import { ChainId } from '@aave/contract-helpers';

// Shared by the page and the /api/uniswap proxy: the proxy only forwards requests for these routes.

export type BridgeAsset = 'USDC' | 'USDT';

export type BridgeToken = {
  asset: BridgeAsset;
  chainId: number;
  address: string;
  symbol: string;
  decimals: number;
};

// Ethereum side matches the Aave V3 Core reserves, Polygon side the Reental market reserves
export const BRIDGE_TOKENS: BridgeToken[] = [
  {
    asset: 'USDC',
    chainId: ChainId.mainnet,
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    symbol: 'USDC',
    decimals: 6,
  },
  {
    asset: 'USDC',
    chainId: ChainId.polygon,
    address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    symbol: 'USDC',
    decimals: 6,
  },
  {
    asset: 'USDT',
    chainId: ChainId.mainnet,
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    symbol: 'USDT',
    decimals: 6,
  },
  {
    asset: 'USDT',
    chainId: ChainId.polygon,
    address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    symbol: 'USDT0',
    decimals: 6,
  },
];

export const BRIDGE_ASSETS: BridgeAsset[] = ['USDC', 'USDT'];
export const BRIDGE_CHAIN_IDS = [ChainId.mainnet, ChainId.polygon];

export const getBridgeToken = (asset: BridgeAsset, chainId: number) =>
  BRIDGE_TOKENS.find((token) => token.asset === asset && token.chainId === chainId);

const findToken = (address: unknown, chainId: unknown) =>
  typeof address === 'string'
    ? BRIDGE_TOKENS.find(
        (token) =>
          token.chainId === Number(chainId) && token.address.toLowerCase() === address.toLowerCase()
      )
    : undefined;

/** True when both ends are the same asset on two different supported chains */
export const isSupportedBridgeRoute = (
  tokenIn: unknown,
  tokenInChainId: unknown,
  tokenOut: unknown,
  tokenOutChainId: unknown
) => {
  const from = findToken(tokenIn, tokenInChainId);
  const to = findToken(tokenOut, tokenOutChainId);
  return !!from && !!to && from.asset === to.asset && from.chainId !== to.chainId;
};
