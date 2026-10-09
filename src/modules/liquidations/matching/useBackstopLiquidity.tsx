import { formatUnits } from 'ethers/lib/utils';
import { useMemo } from 'react';
import { ComputedReserveData } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useCandidates } from 'src/libs/reental/sharedRouter/useCandidates';
import { useRootStore } from 'src/store/root';

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

/**
 * Backstop liquidity for one (debt token, collateral token) pair.
 *
 * The figures come from the router's own `quote()`, not from a local model. Eligibility
 * depends on four independent ceilings — aToken allowance, aToken balance, collateral
 * budget and per-liquidation cap — and one of them is not indexed anywhere, so anything
 * computed off-chain would drift from what the router actually does at fill time.
 *
 * Takes the pair as an argument rather than returning lookup functions: each pair is a
 * network round trip, and the previous shape implied every pair was already in memory.
 */
export const useBackstopLiquidity = ({
  debtReserve,
  collateralReserve,
}: {
  debtReserve?: ComputedReserveData;
  collateralReserve?: ComputedReserveData;
}) => {
  const currentMarketData = useRootStore((store) => store.currentMarketData);

  const { data, isLoading } = useCandidates({
    marketData: currentMarketData,
    collateralAsset: collateralReserve?.underlyingAsset,
    debtAsset: debtReserve?.underlyingAsset,
  });

  const positions: BackstopPosition[] = useMemo(() => {
    if (!debtReserve || !data) return [];
    const price = Number(debtReserve.priceInUSD) || 0;

    return data.candidates.map((candidate) => ({
      owner: candidate.lp,
      availableUSD: Number(formatUnits(candidate.maxDebt, debtReserve.decimals)) * price,
    }));
  }, [data, debtReserve]);

  const liquidity: BackstopPairLiquidity = useMemo(
    () => ({
      availableUSD: positions.reduce((acc, position) => acc + position.availableUSD, 0),
      depositors: positions.length,
    }),
    [positions]
  );

  return {
    positions,
    liquidity,
    isLoading,
    /** The router refused to price this pair at all — a different problem from "no LPs". */
    quoteError: data?.quoteError,
    /** More eligible LPs exist than one liquidation can name. */
    truncated: !!data?.truncated,
  };
};
