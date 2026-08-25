import { useMemo } from 'react';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';

export interface BackstopPairLiquidity {
  /** Total USD of this debt token committed by backstop depositors that accept this collateral */
  availableUSD: number;
  /** Number of backstop depositors behind that liquidity */
  depositors: number;
}

/**
 * Aggregated backstop liquidity for a (debt token, collateral token) pair: how much of the
 * debt token is committed by depositors whose accepted-collateral set includes the collateral.
 *
 * TODO: mock data — replace with matcher contract reads (aggregate allowances + accepted
 * collateral sets per depositor) or the liquidations indexer.
 */
export const useBackstopLiquidity = () => {
  const { reserves } = useAppDataContext();

  const pairLiquidity = useMemo(() => {
    const collateralReserves = reserves.filter((r) => r.reserveLiquidationThreshold !== '0');
    const map = new Map<string, BackstopPairLiquidity>();

    reserves
      .filter((r) => r.borrowingEnabled)
      .forEach((debtReserve, d) => {
        collateralReserves.forEach((collateralReserve, c) => {
          const seed = (d + 1) * (c + 3);
          // Deterministic spread: some pairs well covered, some thin, every 9th uncovered
          const availableUSD = seed % 9 === 0 ? 0 : 5000 + ((seed * 12007) % 90000);
          const depositors = availableUSD === 0 ? 0 : (seed % 7) + 1;
          map.set(`${debtReserve.underlyingAsset}-${collateralReserve.underlyingAsset}`, {
            availableUSD,
            depositors,
          });
        });
      });

    return map;
  }, [reserves]);

  const getPairLiquidity = (debtAsset: string, collateralAsset: string): BackstopPairLiquidity =>
    pairLiquidity.get(`${debtAsset}-${collateralAsset}`) ?? { availableUSD: 0, depositors: 0 };

  return { getPairLiquidity };
};
