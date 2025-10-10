import { TimeWindow } from '@aave/react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { request } from './client';
import { GetTokenHistoryValues } from './queries';

export const getTokenHistoryValues = async ({
  chainId,
  asset,
  startDate,
  endDate,
  first,
  skip,
  orderBy,
  orderDirection,
}: {
  chainId: number;
  asset: string;
  startDate: Date;
  endDate: Date;
  first?: number;
  skip?: number;
  orderBy?: string;
  orderDirection?: string;
}) => {
  const response = await request<{
    reserveParamsHistoryItems: {
      reserve: {
        id: string;
        underlyingAsset: string;
        decimals: number;
      };
      liquidityRate: string;
      variableBorrowRate: string;
      timestamp: number;
    }[];
  }>(chainId, GetTokenHistoryValues, {
    asset,
    startDate: Math.floor(startDate.getTime() / 1000),
    endDate: Math.floor(endDate.getTime() / 1000),
    first,
    skip,
    orderBy,
    orderDirection,
  });
  return response;
};

export const timeWindowToDateRange = (timeWindow: TimeWindow) => {
  switch (timeWindow) {
    case TimeWindow.LastWeek:
      return {
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
      };
    case TimeWindow.LastMonth:
      return {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
      };
    case TimeWindow.LastSixMonths:
      return {
        startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
      };
    case TimeWindow.LastYear:
      return {
        startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
      };
    default:
      return {
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
      };
  }
};

export const getAllTokenHistoryValues = async ({
  chainId,
  asset,
  timeWindow,
}: {
  chainId: number;
  asset: string;
  timeWindow: TimeWindow;
}) => {
  const { startDate, endDate } = timeWindowToDateRange(timeWindow);
  let hasMore = true;
  const first = 1000;
  let skip = 0;
  const data = [];
  while (hasMore) {
    const response = await request<{
      reserveParamsHistoryItems: {
        reserve: {
          id: string;
          underlyingAsset: string;
          decimals: number;
        };
        liquidityRate: string;
        variableBorrowRate: string;
        timestamp: number;
      }[];
    }>(chainId, GetTokenHistoryValues, {
      asset,
      startDate: Math.floor(startDate.getTime() / 1000),
      endDate: Math.floor(endDate.getTime() / 1000),
      first,
      skip,
      orderBy: 'timestamp',
      orderDirection: 'asc',
    });
    hasMore = response.reserveParamsHistoryItems.length === first;
    skip += first;
    data.push(...response.reserveParamsHistoryItems);
  }
  return data;
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
    queryFn: () => getAllTokenHistoryValues({ chainId, asset, timeWindow }),
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
