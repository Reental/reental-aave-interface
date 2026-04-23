import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { HISTORICAL_MARKET_CHAIN_IDS } from '../../libs/reental/aave/history';
import { MarketReserveParamsHistoryItem } from '../../libs/reental/aave/queries';
import { MarketHistoryRange } from './marketHistoryRanges';

type MarketHistoryResponse = {
  items: MarketReserveParamsHistoryItem[];
};

export const useMarketHistory = ({
  chainId,
  underlyingAssets,
  timeRange,
  enabled,
}: {
  chainId: number;
  underlyingAssets: string[];
  timeRange: MarketHistoryRange;
  enabled: boolean;
}) => {
  const normalizedAssets = [...underlyingAssets].map((asset) => asset.toLowerCase()).sort();

  return useQuery({
    queryKey: ['market-history-api', chainId, normalizedAssets.join(','), timeRange],
    queryFn: async () => {
      const params = new URLSearchParams({
        chainId: String(chainId),
        timeRange,
        underlyingAssets: normalizedAssets.join(','),
      });

      const response = await fetch(`/api/markets-history?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch market history');
      }

      const data: MarketHistoryResponse = await response.json();
      return data.items;
    },
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: (failureCount) => failureCount < 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 15_000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    enabled:
      enabled && normalizedAssets.length > 0 && HISTORICAL_MARKET_CHAIN_IDS.includes(chainId),
  });
};
