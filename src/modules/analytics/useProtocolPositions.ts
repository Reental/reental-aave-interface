import { formatUserSummary, FormatUserSummaryResponse } from '@aave/math-utils';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { FormattedReservesAndIncentives } from 'src/hooks/pool/usePoolFormattedReserves';
import { request } from 'src/libs/reental/aave/client';
import { useRootStore } from 'src/store/root';

/**
 * Every borrower in the market, with a health factor for each.
 *
 * The subgraph supplies the borrower list and their *scaled* balances. Scaled balances are
 * index-independent, so pairing them with the live reserve indices the app already loads
 * yields current figures — one query for the whole protocol rather than an RPC round trip
 * per user, and no dependency on the subgraph's own price or index freshness.
 *
 * The health factor is computed by the protocol's own `formatUserSummary`, the same call
 * the connected-user path uses, rather than a reimplementation of liquidation thresholds.
 */

const PROTOCOL_POSITIONS = `
  query ProtocolPositions($first: Int!, $skip: Int!) {
    users(first: $first, skip: $skip, where: { borrowedReservesCount_gt: 0 }) {
      id
      borrowedReservesCount
      reserves {
        usageAsCollateralEnabledOnUser
        scaledATokenBalance
        scaledVariableDebt
        reserve {
          underlyingAsset
        }
      }
    }
  }
`;

const PAGE_SIZE = 500;

interface SubgraphUser {
  id: string;
  borrowedReservesCount: number;
  reserves: {
    usageAsCollateralEnabledOnUser: boolean;
    scaledATokenBalance: string;
    scaledVariableDebt: string;
    reserve: { underlyingAsset: string };
  }[];
}

export type ProtocolPosition = {
  /** Borrower address, lowercase as the subgraph returns it. */
  address: string;
  healthFactor: number;
  /** True when the subgraph reports no debt at all; health factor is then meaningless. */
  hasDebt: boolean;
  totalCollateralUSD: number;
  totalBorrowsUSD: number;
  summary: FormatUserSummaryResponse<FormattedReservesAndIncentives>;
};

/** Aave reports an unbounded health factor as -1; treat it as "no liquidation risk". */
export const UNBOUNDED_HEALTH_FACTOR = -1;

/**
 * Below this, a USD figure is rounding noise rather than a position worth acting on.
 * Reental's Polygon market carries a long tail of fully-seized positions holding fractions
 * of a cent of debt and no collateral at all.
 */
const DUST_USD = 0.01;

/** Underwater by the protocol's own measure. Includes positions with nothing left to seize. */
export const isLiquidatable = (position: ProtocolPosition) =>
  position.hasDebt &&
  position.healthFactor !== UNBOUNDED_HEALTH_FACTOR &&
  position.healthFactor < 1;

/**
 * Underwater *and* worth liquidating. A position whose collateral has already been seized
 * is still underwater, but a liquidation against it seizes nothing and reverts, so it must
 * never be offered as an action.
 */
export const isActionable = (position: ProtocolPosition) =>
  isLiquidatable(position) &&
  position.totalCollateralUSD > DUST_USD &&
  position.totalBorrowsUSD > DUST_USD;

/** Debt left stranded on positions with no collateral behind it. */
export const isBadDebt = (position: ProtocolPosition) =>
  position.hasDebt && position.totalCollateralUSD <= DUST_USD;

const useSubgraphBorrowers = (chainId: number) =>
  useQuery({
    queryKey: ['protocolBorrowers', chainId],
    staleTime: 60_000,
    queryFn: async () => {
      const users: SubgraphUser[] = [];

      // Paged so the view does not silently truncate as the market grows.
      for (let skip = 0; ; skip += PAGE_SIZE) {
        const data = await request<{ users: SubgraphUser[] }>(chainId, PROTOCOL_POSITIONS, {
          first: PAGE_SIZE,
          skip,
        });

        users.push(...data.users);
        if (data.users.length < PAGE_SIZE) break;
      }

      return users;
    },
  });

export const useProtocolPositions = () => {
  const {
    reserves,
    marketReferencePriceInUsd,
    marketReferenceCurrencyDecimals,
    loading: reservesLoading,
  } = useAppDataContext();
  const currentMarketData = useRootStore((store) => store.currentMarketData);

  const { data: borrowers, isLoading, error } = useSubgraphBorrowers(currentMarketData.chainId);

  const positions: ProtocolPosition[] = (borrowers ?? [])
    .map((borrower) => {
      const summary = formatUserSummary({
        currentTimestamp: dayjs().unix(),
        marketReferencePriceInUsd,
        marketReferenceCurrencyDecimals,
        userReserves: borrower.reserves.map((userReserve) => ({
          underlyingAsset: userReserve.reserve.underlyingAsset,
          scaledATokenBalance: userReserve.scaledATokenBalance,
          scaledVariableDebt: userReserve.scaledVariableDebt,
          usageAsCollateralEnabledOnUser: userReserve.usageAsCollateralEnabledOnUser,
        })),
        formattedReserves: reserves,
        // The subgraph does not populate eModeCategoryId, so this assumes no eMode. eMode
        // raises the liquidation threshold, so a real eMode user's health factor would be
        // understated here — the liquidate flow re-reads the position on-chain, where the
        // true category is available, before offering the action.
        userEmodeCategoryId: 0,
      });

      const totalBorrowsUSD = Number(summary.totalBorrowsUSD);

      return {
        address: borrower.id,
        healthFactor: Number(summary.healthFactor),
        hasDebt: totalBorrowsUSD > 0,
        totalCollateralUSD: Number(summary.totalCollateralUSD),
        totalBorrowsUSD,
        summary,
      };
    })
    .filter((position) => position.hasDebt)
    .sort((a, b) => {
      // Riskiest first; unbounded health factors sink to the bottom.
      const rank = (position: ProtocolPosition) =>
        position.healthFactor === UNBOUNDED_HEALTH_FACTOR ? Infinity : position.healthFactor;
      return rank(a) - rank(b);
    });

  const liquidatable = positions.filter(isLiquidatable);
  const actionable = positions.filter(isActionable);
  const badDebt = positions.filter(isBadDebt);

  return {
    positions,
    liquidatable,
    actionable,
    totals: {
      collateralUSD: positions.reduce((sum, position) => sum + position.totalCollateralUSD, 0),
      borrowsUSD: positions.reduce((sum, position) => sum + position.totalBorrowsUSD, 0),
      /** Debt on positions that can actually be liquidated for a seizable amount. */
      atRiskUSD: actionable.reduce((sum, position) => sum + position.totalBorrowsUSD, 0),
      /** Underwater with nothing left to seize — a protocol loss, not an opportunity. */
      badDebtUSD: badDebt.reduce((sum, position) => sum + position.totalBorrowsUSD, 0),
      positionCount: positions.length,
      liquidatableCount: liquidatable.length,
      actionableCount: actionable.length,
      badDebtCount: badDebt.length,
    },
    // Reserves must be loaded before any health factor is meaningful.
    isLoading: isLoading || reservesLoading || !reserves.length,
    error,
  };
};
