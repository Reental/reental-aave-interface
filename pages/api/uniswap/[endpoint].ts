import { NextApiRequest, NextApiResponse } from 'next';
import { isSupportedBridgeRoute } from 'src/modules/bridge/bridgeConfig';

const UNISWAP_API_URL = 'https://trade-api.gateway.uniswap.org/v1';

type Body = Record<string, unknown>;

// Every POST is checked against the bridge routes so the key can't be used as an open Uniswap proxy
const ENDPOINTS: Record<string, { method: 'GET' | 'POST'; isAllowed?: (body: Body) => boolean }> = {
  check_approval: {
    method: 'POST',
    isAllowed: (body) =>
      isSupportedBridgeRoute(body.token, body.chainId, body.tokenOut, body.tokenOutChainId),
  },
  quote: {
    method: 'POST',
    isAllowed: (body) =>
      isSupportedBridgeRoute(
        body.tokenIn,
        body.tokenInChainId,
        body.tokenOut,
        body.tokenOutChainId
      ),
  },
  swap: {
    method: 'POST',
    isAllowed: (body) => {
      const quote = (body.quote || {}) as Body;
      const input = (quote.input || {}) as Body;
      const output = (quote.output || {}) as Body;
      return isSupportedBridgeRoute(
        input.token,
        quote.chainId,
        output.token,
        quote.destinationChainId
      );
    },
  },
  swaps: { method: 'GET' },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const endpoint = String(req.query.endpoint);
  const config = ENDPOINTS[endpoint];

  if (!config) {
    return res.status(404).json({ error: 'Not found' });
  }
  if (req.method !== config.method) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.UNISWAP_API_KEY;
  if (!apiKey) {
    console.error('UNISWAP_API_KEY environment variable is not set');
    return res.status(500).json({ error: 'Internal server error' });
  }

  const body: Body = req.body && typeof req.body === 'object' ? req.body : {};
  if (config.isAllowed && !config.isAllowed(body)) {
    return res.status(400).json({ error: 'Unsupported bridge route' });
  }

  const url = new URL(`${UNISWAP_API_URL}/${endpoint}`);
  if (config.method === 'GET') {
    Object.entries(req.query).forEach(([key, value]) => {
      if (key !== 'endpoint' && typeof value === 'string') url.searchParams.set(key, value);
    });
  }

  try {
    const response = await fetch(url, {
      method: config.method,
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: config.method === 'POST' ? JSON.stringify(body) : undefined,
    });
    const data = await response.json().catch(() => ({}));
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Uniswap API proxy error:', error);
    return res.status(502).json({ error: 'Bad gateway' });
  }
}
