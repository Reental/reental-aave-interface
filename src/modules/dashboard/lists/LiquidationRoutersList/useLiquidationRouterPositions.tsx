import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';
import { textCenterEllipsis } from 'src/helpers/text-center-ellipsis';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { isPonderOffline } from 'src/libs/reental/liquidationRouter/ponder/client';
import {
  allowanceSymbol,
  ArmingState,
  formatAllowance,
  getArmingState,
  isUnlimitedApproval,
} from 'src/libs/reental/liquidationRouter/ponder/format';
import {
  UserLiquidationRouter,
  useUserLiquidationRouters,
} from 'src/libs/reental/liquidationRouter/useUserLiquidationRouter';
import { useRootStore } from 'src/store/root';
import { amountToUsd } from 'src/utils/utils';

import {
  ComputedReserveData,
  useAppDataContext,
} from '../../../../hooks/app-data-provider/useAppDataProvider';
import { isAssetHidden } from '../constants';

export type LiquidationRouterPosition = {
  /** Stable row key: the router address, or the reserve for a not-yet-created row. */
  key: string;
  /** Absent when the router's asset is not a reserve of the current market. */
  reserve?: ComputedReserveData;
  underlyingAsset: string;
  symbol: string;
  iconSymbol: string;
  name: string;
  /** aToken balance available to commit; '0' when the user has not supplied this asset. */
  underlyingBalance: string;
  underlyingBalanceUSD: string;
  router?: UserLiquidationRouter;
  armingState?: ArmingState;
  /** Committed amount as a decimal string; null when it cannot be stated precisely. */
  committed: string | null;
  /** Approval is unlimited, so no exact figure can be shown. */
  committedUnlimited: boolean;
  committedUsd: string;
};

const toPosition = (
  router: UserLiquidationRouter,
  reserve: ComputedReserveData | undefined,
  userReserves: ReturnType<typeof useAppDataContext>['user'],
  marketReferencePriceInUsd: string
): LiquidationRouterPosition => {
  const userReserve = reserve
    ? userReserves?.userReservesData.find(
        (candidate) => candidate.underlyingAsset === reserve.underlyingAsset
      )
    : undefined;

  const committed = formatAllowance(router);
  const unlimited = isUnlimitedApproval(router);

  return {
    key: router.address,
    reserve,
    underlyingAsset: reserve?.underlyingAsset ?? router.token,
    symbol: reserve?.symbol ?? allowanceSymbol(router) ?? textCenterEllipsis(router.token, 6, 4),
    iconSymbol: reserve?.iconSymbol ?? '',
    name: reserve?.name ?? allowanceSymbol(router) ?? router.token,
    underlyingBalance: userReserve?.underlyingBalance ?? '0',
    underlyingBalanceUSD: userReserve?.underlyingBalanceUSD ?? '0',
    router,
    armingState: getArmingState(router),
    committed,
    committedUnlimited: unlimited,
    committedUsd:
      committed && reserve
        ? amountToUsd(
            committed,
            reserve.formattedPriceInMarketReferenceCurrency,
            marketReferencePriceInUsd
          ).toString()
        : '0',
  };
};

/**
 * Rows for the liquidation routers card, read from the Ponder indexer.
 *
 * Router-centric rather than reserve-centric: a user can back several routers for the same
 * debt asset (two exist for FUSDT on Sepolia today), so one row per reserve would silently
 * hide all but one. Borrowable reserves the user has SUPPLIED, and which have no router
 * yet, get a row of their own so the user can create one.
 *
 * Routers the user already backs are always listed, even with nothing currently supplied.
 * Hiding those would strand a live allowance: revoking is done from that row, so a user
 * who supplied, armed a router, then withdrew must still be able to switch it off.
 */
export const useLiquidationRouterPositions = () => {
  const { user, reserves, marketReferencePriceInUsd, loading } = useAppDataContext();
  const { currentAccount } = useWeb3Context();
  const currentMarketData = useRootStore((store) => store.currentMarketData);

  const factory = currentMarketData.addresses.LIQUIDATION_ROUTER_FACTORY;

  const {
    data: routers,
    isLoading: loadingRouters,
    error,
  } = useUserLiquidationRouters({ marketData: currentMarketData, user: currentAccount });

  const positions = useMemo<LiquidationRouterPosition[]>(() => {
    const byAddress = new Map(
      reserves.flatMap((reserve) => [
        [reserve.underlyingAsset.toLowerCase(), reserve] as const,
        [reserve.aTokenAddress.toLowerCase(), reserve] as const,
      ])
    );

    // One row per router the user backstops, unarmed ones included: arming them is what
    // this card is for, so hiding them would remove the rows that need attention most.
    const routerRows = (routers?.all ?? []).map((router) =>
      toPosition(
        router,
        byAddress.get(router.aToken.toLowerCase()) ?? byAddress.get(router.token.toLowerCase()),
        user,
        marketReferencePriceInUsd
      )
    );

    const covered = new Set(
      routerRows.map((row) => row.reserve?.underlyingAsset.toLowerCase()).filter(Boolean)
    );

    // Reserves with no router yet. The liquidation entry point is deliberately NOT
    // offered until the user already holds a supplied position in the asset: a router
    // is backed with the aTokens of a deposit, so inviting someone with nothing
    // supplied to "create a router" leads to a flow they cannot complete.
    //
    // `borrowingEnabled` rather than `assetCanBeBorrowedByUser`: whether THIS user could
    // borrow the asset is irrelevant to backing a router (you commit your own aTokens
    // either way). What matters is that the asset is a debt asset at all, so a router
    // can exist for it. This also matches the rule the reserve page already applies.
    const createRows = reserves
      .filter((reserve) => !isAssetHidden(currentMarketData.market, reserve.underlyingAsset))
      .filter((reserve) => !covered.has(reserve.underlyingAsset.toLowerCase()))
      .filter((reserve) => reserve.borrowingEnabled)
      .map((reserve) => {
        const userReserve = user?.userReservesData.find(
          (candidate) => candidate.underlyingAsset === reserve.underlyingAsset
        );

        return {
          key: reserve.underlyingAsset,
          reserve,
          underlyingAsset: reserve.underlyingAsset,
          symbol: reserve.symbol,
          iconSymbol: reserve.iconSymbol,
          name: reserve.name,
          underlyingBalance: userReserve?.underlyingBalance ?? '0',
          underlyingBalanceUSD: userReserve?.underlyingBalanceUSD ?? '0',
          committed: null,
          committedUnlimited: false,
          committedUsd: '0',
        };
      })
      .filter((row) => Number(row.underlyingBalance) > 0);

    return [...routerRows, ...createRows];
  }, [routers, reserves, user, marketReferencePriceInUsd, currentMarketData.market]);

  const totalCommittedUsd = positions.reduce(
    (total, position) => total.plus(position.committedUsd),
    new BigNumber(0)
  );

  return {
    /** Undefined when the market has no factory, i.e. routers cannot exist at all. */
    factory,
    positions,
    totalCommittedUsd,
    /** Some allowance is unlimited, so the total understates what is committed. */
    hasUnlimited: positions.some((position) => position.committedUnlimited),
    armedCount: positions.filter((position) => position.armingState === 'armed').length,
    routerCount: routers?.all.length ?? 0,
    isLoading: loading || loadingRouters,
    /** The indexer could not be reached — distinct from "this user has no routers". */
    isIndexerOffline: isPonderOffline(error),
    error,
  };
};
