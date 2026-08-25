import { useCallback, useMemo } from 'react';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';

/** A single backstop deposit that can fund liquidations for a (debt, collateral) pair */
export interface BackstopPosition {
  /** Wallet of the backstop depositor whose funds execute the liquidation */
  owner: string;
  /** USD of the debt token this position can still provide for the pair */
  availableUSD: number;
}

export interface BackstopPairLiquidity {
  /** Total USD of this debt token committed by backstop depositors that accept this collateral */
  availableUSD: number;
  /** Number of backstop positions behind that liquidity */
  depositors: number;
}

const mockOwner = (seed: number) =>
  `0x${((seed + 11) * 3266489917).toString(16).padStart(10, '0').slice(0, 8)}…${((seed + 3) * 62591)
    .toString(16)
    .slice(0, 4)}`;

/**
 * Backstop liquidity for each (debt token, collateral token) pair, as the individual
 * depositor positions whose accepted-collateral set includes the collateral.
 *
 * TODO: mock data — replace with matcher contract reads (allowances + accepted collateral
 * sets per depositor) or the liquidations indexer.
 */
export const useBackstopLiquidity = () => {
  const { reserves } = useAppDataContext();

  const pairPositions = useMemo(() => {
    const collateralReserves = reserves.filter((r) => r.reserveLiquidationThreshold !== '0');
    const map = new Map<string, BackstopPosition[]>();

    reserves
      .filter((r) => r.borrowingEnabled)
      .forEach((debtReserve, d) => {
        collateralReserves.forEach((collateralReserve, c) => {
          const seed = (d + 1) * (c + 3);
          // Deterministic spread: 0-5 positions per pair, every 9th pair uncovered
          const count = seed % 9 === 0 ? 0 : (seed % 5) + 1;
          const positions = Array.from({ length: count }, (_, i) => ({
            owner: mockOwner(seed * 31 + i),
            availableUSD: 1000 + ((seed * 12007 + i * 7919) % 8000),
          }));
          map.set(`${debtReserve.underlyingAsset}-${collateralReserve.underlyingAsset}`, positions);
        });
      });

    return map;
  }, [reserves]);

  const getPairPositions = useCallback(
    (debtAsset: string, collateralAsset: string): BackstopPosition[] =>
      pairPositions.get(`${debtAsset}-${collateralAsset}`) ?? [],
    [pairPositions]
  );

  const getPairLiquidity = useCallback(
    (debtAsset: string, collateralAsset: string): BackstopPairLiquidity => {
      const positions = getPairPositions(debtAsset, collateralAsset);
      return {
        availableUSD: positions.reduce((acc, p) => acc + p.availableUSD, 0),
        depositors: positions.length,
      };
    },
    [getPairPositions]
  );

  return { getPairPositions, getPairLiquidity };
};
