import { useMemo } from 'react';
import { isActionable, useProtocolPositions } from 'src/modules/analytics/useProtocolPositions';

export interface PositionAsset {
  underlyingAsset: string;
  symbol: string;
  iconSymbol: string;
  amount: number;
  amountUSD: number;
}

export interface LiquidatablePosition {
  user: string;
  healthFactor: number;
  debt: PositionAsset[];
  collateral: PositionAsset[];
}

/** Aave v3 close factor: below this HF the full debt can be liquidated, above it only 50% */
export const CLOSE_FACTOR_HF_THRESHOLD = 0.95;
export const DEFAULT_CLOSE_FACTOR = 0.5;

export const maxLiquidatableFactor = (healthFactor: number) =>
  healthFactor < CLOSE_FACTOR_HF_THRESHOLD ? 1 : DEFAULT_CLOSE_FACTOR;

/** Positions in this band are shown greyed out as "approaching liquidation". */
const WATCH_HEALTH_FACTOR = 1.05;

/**
 * Every borrower that is liquidatable or close to it, across the market.
 *
 * The borrower set comes from the subgraph — UiPoolDataProvider is per-user and cannot
 * enumerate — and each health factor is then recomputed against live reserve prices, since
 * the subgraph's own prices are unreliable enough to produce nonsense collateral values.
 *
 * Positions whose collateral has already been seized are excluded: they are still
 * underwater, but a liquidation against them seizes nothing and reverts, so offering them
 * as an action would be offering a guaranteed failure.
 */
export const useLiquidatablePositions = (): LiquidatablePosition[] => {
  const { positions } = useProtocolPositions();

  return useMemo(
    () =>
      positions
        .filter(
          (position) => position.healthFactor < WATCH_HEALTH_FACTOR && position.healthFactor > 0
        )
        .filter((position) => position.healthFactor >= 1 || isActionable(position))
        .map((position) => ({
          user: position.address,
          healthFactor: position.healthFactor,
          debt: position.summary.userReservesData
            .filter((userReserve) => Number(userReserve.totalBorrows) > 0)
            .map((userReserve) => ({
              underlyingAsset: userReserve.reserve.underlyingAsset,
              symbol: userReserve.reserve.symbol,
              iconSymbol: userReserve.reserve.iconSymbol,
              amount: Number(userReserve.totalBorrows),
              amountUSD: Number(userReserve.totalBorrowsUSD),
            })),
          collateral: position.summary.userReservesData
            .filter(
              (userReserve) =>
                userReserve.usageAsCollateralEnabledOnUser &&
                Number(userReserve.underlyingBalance) > 0
            )
            .map((userReserve) => ({
              underlyingAsset: userReserve.reserve.underlyingAsset,
              symbol: userReserve.reserve.symbol,
              iconSymbol: userReserve.reserve.iconSymbol,
              amount: Number(userReserve.underlyingBalance),
              amountUSD: Number(userReserve.underlyingBalanceUSD),
            })),
        })),
    [positions]
  );
};
