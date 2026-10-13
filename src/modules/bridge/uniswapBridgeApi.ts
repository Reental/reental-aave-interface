// Client for the Uniswap Trading API, always called through our /api/uniswap proxy
// (trailing slash matches the app's `trailingSlash` routing).

export type UniswapTransaction = {
  to: string;
  from: string;
  data: string;
  value: string;
  chainId: number;
  gasLimit?: string;
};

export type BridgeQuote = {
  quoteId: string;
  chainId: number;
  destinationChainId: number;
  swapper: string;
  input: { amount: string; token: string };
  output: { amount: string; token: string; recipient: string; minimumAmount?: string };
  gasFeeUSD?: string;
  estimatedFillTimeMs?: number;
};

export type BridgeQuoteResponse = {
  requestId: string;
  routing: string;
  quote: BridgeQuote;
  permitData: null | Record<string, unknown>;
};

export type SwapStatus = 'PENDING' | 'SUCCESS' | 'NOT_FOUND' | 'FAILED' | 'EXPIRED';

export class UniswapApiError extends Error {
  constructor(message: string, readonly status: number, readonly errorCode?: string) {
    super(message);
  }
}

const request = async <T>(endpoint: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`/api/uniswap/${endpoint}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new UniswapApiError(
      data.detail || data.message || data.error || `Uniswap API error ${response.status}`,
      response.status,
      data.errorCode
    );
  }
  return data as T;
};

const post = <T>(endpoint: string, body: unknown) =>
  request<T>(`${endpoint}/`, { method: 'POST', body: JSON.stringify(body) });

export type BridgeQuoteParams = {
  tokenIn: string;
  tokenInChainId: number;
  tokenOut: string;
  tokenOutChainId: number;
  amount: string;
  swapper: string;
};

export const fetchBridgeQuote = (params: BridgeQuoteParams) =>
  post<BridgeQuoteResponse>('quote', {
    ...params,
    type: 'EXACT_INPUT',
    slippageTolerance: 0.5,
  });

export const fetchBridgeApproval = (params: BridgeQuoteParams) =>
  post<{ approval: UniswapTransaction | null; cancel: UniswapTransaction | null }>(
    'check_approval',
    {
      walletAddress: params.swapper,
      token: params.tokenIn,
      amount: params.amount,
      chainId: params.tokenInChainId,
      tokenOut: params.tokenOut,
      tokenOutChainId: params.tokenOutChainId,
    }
  );

export const fetchBridgeTransaction = (quote: BridgeQuote) =>
  post<{ swap: UniswapTransaction }>('swap', { quote });

export const fetchSwapStatus = async (txHash: string, chainId: number) => {
  const search = new URLSearchParams({ txHashes: txHash, chainId: String(chainId) });
  const { swaps } = await request<{ swaps?: { status: SwapStatus }[] }>(`swaps/?${search}`);
  return swaps?.[0]?.status ?? 'NOT_FOUND';
};
