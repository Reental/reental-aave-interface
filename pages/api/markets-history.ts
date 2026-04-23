import { NextApiRequest, NextApiResponse } from 'next';

import {
  getAllMarketHistoryValues,
  HISTORICAL_MARKET_CHAIN_IDS,
} from '../../src/libs/reental/aave/history';
import { MarketReserveParamsHistoryItem } from '../../src/libs/reental/aave/queries';
import { isMarketHistoryRange } from '../../src/modules/markets/marketHistoryRanges';

const CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE_CONTROL_HEADER = 'public, s-maxage=300, stale-while-revalidate=1800';

const memoryCache = new Map<
  string,
  {
    expiresAt: number;
    items: MarketReserveParamsHistoryItem[];
  }
>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', CACHE_CONTROL_HEADER);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const chainId = Number(req.query.chainId);
  const timeRange = String(req.query.timeRange || '');
  const underlyingAssetsParam = String(req.query.underlyingAssets || '');
  const underlyingAssets = underlyingAssetsParam
    .split(',')
    .map((asset) => asset.trim().toLowerCase())
    .filter(Boolean);

  if (!Number.isFinite(chainId) || !HISTORICAL_MARKET_CHAIN_IDS.includes(chainId)) {
    return res.status(400).json({ error: 'Invalid chainId' });
  }

  if (!isMarketHistoryRange(timeRange)) {
    return res.status(400).json({ error: 'Invalid timeRange' });
  }

  if (!underlyingAssets.length) {
    return res.status(200).json({ items: [] });
  }

  const cacheKey = `${chainId}:${timeRange}:${underlyingAssets.join(',')}`;
  const cachedEntry = memoryCache.get(cacheKey);
  if (cachedEntry && cachedEntry.expiresAt > Date.now()) {
    return res.status(200).json({ items: cachedEntry.items });
  }

  try {
    const items = await getAllMarketHistoryValues({
      chainId,
      underlyingAssets,
      timeRange,
    });

    memoryCache.set(cacheKey, {
      expiresAt: Date.now() + CACHE_TTL_MS,
      items,
    });

    return res.status(200).json({ items });
  } catch (error) {
    console.error('Markets history proxy error:', error);
    return res.status(500).json({ error: 'Internal server error', details: String(error) });
  }
}
