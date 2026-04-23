import { TimeWindow } from '@aave/react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

type ReserveHistoryResponse = {
  items: {
    reserve: {
      id: string;
      underlyingAsset: string;
      decimals: number;
    };
    liquidityRate: string;
    variableBorrowRate: string;
    timestamp: number;
  }[];
};

export function useAllTokenHistory({
  chainId,
  asset,
  timeWindow,
}: {
  chainId: number;
  asset: string;
  timeWindow: TimeWindow;
}) {
  return useQuery({
    queryKey: ['allTokenHistory', chainId, asset, timeWindow],
    queryFn: async () => {
      const params = new URLSearchParams({
        chainId: String(chainId),
        asset: asset.toLowerCase(),
        timeWindow,
      });
      const response = await fetch(`/api/reserve-history?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch reserve history');
      }

      const data: ReserveHistoryResponse = await response.json();
      return data.items;
    },
    placeholderData: keepPreviousData,
    select: (data) => data,
    // Cache & retry strategy — tweak as you like
    staleTime: 5 * 60 * 1000, // 5m: historical data is stable
    gcTime: 30 * 60 * 1000, // 30m in cache
    retry: (failureCount) => failureCount < 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 15_000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
}
