import { TimeWindow } from '@aave/react';
import { NextApiRequest, NextApiResponse } from 'next';

import { getAllTokenHistoryValues } from '../../src/libs/reental/aave/history';

const CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE_CONTROL_HEADER = 'public, s-maxage=300, stale-while-revalidate=1800';

type ReserveHistoryItem = Awaited<ReturnType<typeof getAllTokenHistoryValues>>[number];

const memoryCache = new Map<
  string,
  {
    expiresAt: number;
    items: ReserveHistoryItem[];
  }
>();

const isValidTimeWindow = (value: string): value is TimeWindow =>
  Object.values(TimeWindow).includes(value as TimeWindow);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', CACHE_CONTROL_HEADER);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const chainId = Number(req.query.chainId);
  const asset = String(req.query.asset || '')
    .trim()
    .toLowerCase();
  const timeWindow = String(req.query.timeWindow || '');

  if (!Number.isFinite(chainId)) {
    return res.status(400).json({ error: 'Invalid chainId' });
  }

  if (!asset) {
    return res.status(400).json({ error: 'Invalid asset' });
  }

  if (!isValidTimeWindow(timeWindow)) {
    return res.status(400).json({ error: 'Invalid timeWindow' });
  }

  const cacheKey = `${chainId}:${asset}:${timeWindow}`;
  const cachedEntry = memoryCache.get(cacheKey);
  if (cachedEntry && cachedEntry.expiresAt > Date.now()) {
    return res.status(200).json({ items: cachedEntry.items });
  }

  try {
    const items = await getAllTokenHistoryValues({
      chainId,
      asset,
      timeWindow,
    });

    memoryCache.set(cacheKey, {
      expiresAt: Date.now() + CACHE_TTL_MS,
      items,
    });

    return res.status(200).json({ items });
  } catch (error) {
    console.error('Reserve history proxy error:', error);
    return res.status(500).json({ error: 'Internal server error', details: String(error) });
  }
}
