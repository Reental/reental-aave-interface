import { ethers } from 'ethers';
import { CustomMarket } from 'src/ui-config/marketsConfig';

import { MarketReserveParamsHistoryItem } from '../../libs/reental/aave/queries';
import { isAssetHidden } from '../dashboard/lists/constants';
import {
  MarketHistoryRange,
  marketHistoryRangeToBucketMs,
  marketHistoryRangeToDateRange,
} from './marketHistoryRanges';

export const CHART_HEIGHT = 190;

export const seriesColors = {
  totalSupplied: '#2EBAC6',
  tvl: '#3AAF9F',
  totalBorrowed: '#B6509E',
} as const;

export type MarketHistoryPoint = {
  date: number;
  totalSupplied: number;
  tvl: number;
  totalBorrowed: number;
};

type ReserveState = {
  totalSupplied: number;
  tvl: number;
  totalBorrowed: number;
};

type VisibleReserve = {
  isActive: boolean;
  underlyingAsset: string;
};

export const getVisibleMarketReserves = <T extends VisibleReserve>(
  reserves: T[],
  market: CustomMarket
) =>
  reserves.filter((reserve) => reserve.isActive && !isAssetHidden(market, reserve.underlyingAsset));

const clampPositive = (value: number) => (Number.isFinite(value) ? Math.max(value, 0) : 0);

const bucketPoints = (points: MarketHistoryPoint[], range: MarketHistoryRange) => {
  if (points.length <= 1) return points;

  const bucketMs = marketHistoryRangeToBucketMs(range);
  const start = points[0]?.date ?? 0;
  const bucketed = new Map<number, MarketHistoryPoint>();

  points.forEach((point) => {
    const bucket = Math.floor((point.date - start) / bucketMs);
    bucketed.set(bucket, point);
  });

  const compressed = Array.from(bucketed.values()).sort((a, b) => a.date - b.date);

  if (compressed[0]?.date !== points[0]?.date) {
    compressed.unshift(points[0]);
  }

  const lastPoint = points[points.length - 1];
  if (compressed[compressed.length - 1]?.date !== lastPoint?.date) {
    compressed.push(lastPoint);
  }

  return compressed;
};

const dedupePoints = (points: MarketHistoryPoint[]) =>
  points.reduce<MarketHistoryPoint[]>((acc, point) => {
    const previous = acc[acc.length - 1];

    if (previous?.date === point.date) {
      acc[acc.length - 1] = point;
      return acc;
    }

    acc.push(point);
    return acc;
  }, []);

const getHistoryState = (
  item: MarketReserveParamsHistoryItem,
  fallbackPriceInUsd: number
): ReserveState => {
  const historicalPrice = Number(item.priceInUsd);
  const priceInUsd = historicalPrice > 0 ? historicalPrice : fallbackPriceInUsd;
  const totalSupplied = clampPositive(
    Number(ethers.utils.formatUnits(item.totalLiquidity, item.reserve.decimals)) * priceInUsd
  );
  const tvl = clampPositive(
    Number(ethers.utils.formatUnits(item.availableLiquidity, item.reserve.decimals)) * priceInUsd
  );

  return {
    totalSupplied,
    tvl,
    totalBorrowed: clampPositive(totalSupplied - tvl),
  };
};

export const buildMarketHistoryPoints = ({
  reserves,
  historyItems,
  timeRange,
}: {
  reserves: {
    underlyingAsset: string;
    totalLiquidityUSD: string;
    totalDebtUSD: string;
    priceInUSD: string;
  }[];
  historyItems: MarketReserveParamsHistoryItem[];
  timeRange: MarketHistoryRange;
}) => {
  const { startDate, endDate } = marketHistoryRangeToDateRange(timeRange);
  const safeStartDate = Math.max(startDate.getTime(), 1);
  const currentStateByReserve = new Map<string, ReserveState>();
  const fallbackPrices = new Map<string, number>();

  let totalSupplied = 0;
  let totalBorrowed = 0;
  let tvl = 0;

  reserves.forEach((reserve) => {
    const asset = reserve.underlyingAsset.toLowerCase();
    const supplied = clampPositive(Number(reserve.totalLiquidityUSD || 0));
    const borrowed = clampPositive(Number(reserve.totalDebtUSD || 0));
    const currentState = {
      totalSupplied: supplied,
      totalBorrowed: borrowed,
      tvl: clampPositive(supplied - borrowed),
    };

    currentStateByReserve.set(asset, currentState);
    fallbackPrices.set(asset, clampPositive(Number(reserve.priceInUSD || 0)));
    totalSupplied += currentState.totalSupplied;
    totalBorrowed += currentState.totalBorrowed;
    tvl += currentState.tvl;
  });

  const pointsDescending: MarketHistoryPoint[] = [
    {
      date: endDate.getTime(),
      totalSupplied,
      totalBorrowed,
      tvl,
    },
  ];

  const sortedHistory = [...historyItems]
    .filter((item) => item.timestamp > 0)
    .sort((a, b) => b.timestamp - a.timestamp);

  for (let index = 0; index < sortedHistory.length; ) {
    const timestamp = sortedHistory[index].timestamp;

    while (index < sortedHistory.length && sortedHistory[index].timestamp === timestamp) {
      const item = sortedHistory[index];
      const asset = item.reserve.underlyingAsset.toLowerCase();
      const previousState = currentStateByReserve.get(asset);

      if (previousState) {
        const nextState = getHistoryState(item, fallbackPrices.get(asset) ?? 0);

        totalSupplied += nextState.totalSupplied - previousState.totalSupplied;
        totalBorrowed += nextState.totalBorrowed - previousState.totalBorrowed;
        tvl += nextState.tvl - previousState.tvl;
        currentStateByReserve.set(asset, nextState);
      }

      index += 1;
    }

    pointsDescending.push({
      date: timestamp * 1000,
      totalSupplied: clampPositive(totalSupplied),
      totalBorrowed: clampPositive(totalBorrowed),
      tvl: clampPositive(tvl),
    });
  }

  const oldestHistoryDate =
    sortedHistory.length > 0
      ? sortedHistory[sortedHistory.length - 1].timestamp * 1000
      : safeStartDate;
  const firstPointDate = timeRange === 'all' ? oldestHistoryDate : safeStartDate;

  pointsDescending.push({
    date: firstPointDate,
    totalSupplied: clampPositive(totalSupplied),
    totalBorrowed: clampPositive(totalBorrowed),
    tvl: clampPositive(tvl),
  });

  return bucketPoints(
    dedupePoints(pointsDescending.reverse()).filter((point) => point.date > 0),
    timeRange
  );
};
