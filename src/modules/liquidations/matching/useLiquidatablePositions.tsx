import { useMemo } from 'react';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';

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

// Deterministic mock fixtures: health factors slightly under/over 1 and debt sizes.
// Positions with HF in (1, 1.05] are "approaching liquidation" and shown greyed out.
const MOCK_ROWS = [
  { hf: 0.92, debtUSD: 12500 },
  { hf: 0.968, debtUSD: 4300 },
  { hf: 0.987, debtUSD: 28700 },
  { hf: 0.941, debtUSD: 950 },
  { hf: 1.018, debtUSD: 7600 },
  { hf: 0.996, debtUSD: 15400 },
  { hf: 1.042, debtUSD: 2200 },
];

const mockAddress = (seed: number) =>
  `0x${((seed + 1) * 2654435761).toString(16).padStart(10, '0').slice(0, 10)}…${((seed + 7) * 40503)
    .toString(16)
    .slice(0, 4)}`;

/**
 * All positions that are liquidatable (HF < 1) or close to it, across the market.
 *
 * TODO: this is mock data. Enumerating every borrower with its health factor does not
 * come from UiPoolDataProvider (per-user only) — replace with the liquidations
 * indexer/subgraph endpoint once available.
 */
export const useLiquidatablePositions = (): LiquidatablePosition[] => {
  const { reserves } = useAppDataContext();

  return useMemo(() => {
    const debtReserves = reserves.filter((r) => r.borrowingEnabled);
    const collateralReserves = reserves.filter(
      (r) => !r.isFrozen && !r.isPaused && r.reserveLiquidationThreshold !== '0'
    );
    if (debtReserves.length === 0 || collateralReserves.length === 0) return [];

    return debtReserves.flatMap((debtReserve, d) =>
      MOCK_ROWS.map((row, i) => {
        const seed = d * MOCK_ROWS.length + i;
        const debtPrice = Number(debtReserve.priceInUSD) || 1;
        // 1-2 collateral tokens per position, spread deterministically over the list
        const collateralCount = (seed % 2) + 1;
        // Concentrate mock positions on a handful of collaterals so pairs get several rows
        const collateralPool = Math.min(collateralReserves.length, 4);
        const collateral: PositionAsset[] = Array.from({ length: collateralCount }, (_, c) => {
          const reserve = collateralReserves[(seed * 7 + c * 13) % collateralPool];
          const price = Number(reserve.priceInUSD) || 1;
          // Collateral is worth slightly more than the debt share it backs (HF near 1)
          const shareUSD = (row.debtUSD / collateralCount) * (row.hf + 0.12);
          return {
            underlyingAsset: reserve.underlyingAsset,
            symbol: reserve.symbol,
            iconSymbol: reserve.iconSymbol,
            amount: shareUSD / price,
            amountUSD: shareUSD,
          };
        });

        return {
          user: mockAddress(seed),
          healthFactor: row.hf,
          debt: [
            {
              underlyingAsset: debtReserve.underlyingAsset,
              symbol: debtReserve.symbol,
              iconSymbol: debtReserve.iconSymbol,
              amount: row.debtUSD / debtPrice,
              amountUSD: row.debtUSD,
            },
          ],
          collateral,
        };
      })
    );
  }, [reserves]);
};
