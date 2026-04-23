import { TimeWindow } from '@aave/react';

import {
  MarketHistoryRange,
  marketHistoryRangeToDateRange,
} from '../../../modules/markets/marketHistoryRanges';
import { request } from './client';
import {
  GetMarketHistoryValues,
  GetTokenHistoryValues,
  MarketReserveParamsHistoryItem,
} from './queries';

export const HISTORICAL_MARKET_CHAIN_IDS = [137, 11155111];

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

export const getAllMarketHistoryValues = async ({
  chainId,
  underlyingAssets,
  timeRange,
}: {
  chainId: number;
  underlyingAssets: string[];
  timeRange: MarketHistoryRange;
}) => {
  if (!underlyingAssets.length || !HISTORICAL_MARKET_CHAIN_IDS.includes(chainId)) {
    return [] as MarketReserveParamsHistoryItem[];
  }

  const { startDate, endDate } = marketHistoryRangeToDateRange(timeRange);
  let hasMore = true;
  const first = 1000;
  let skip = 0;
  const data: MarketReserveParamsHistoryItem[] = [];

  while (hasMore) {
    const response = await request<{
      reserveParamsHistoryItems: MarketReserveParamsHistoryItem[];
    }>(chainId, GetMarketHistoryValues, {
      underlyingAssets,
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
