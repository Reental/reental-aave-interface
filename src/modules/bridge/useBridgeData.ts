import { formatUnits } from '@ethersproject/units';
import { useQuery } from '@tanstack/react-query';
import { Contract } from 'ethers';
import { useEffect, useState } from 'react';
import { getProvider } from 'src/utils/marketsAndNetworksConfig';

import { BridgeToken } from './bridgeConfig';
import {
  BridgeQuoteParams,
  fetchBridgeQuote,
  fetchSwapStatus,
  SwapStatus,
  UniswapApiError,
} from './uniswapBridgeApi';

const ERC20_BALANCE_ABI = ['function balanceOf(address owner) view returns (uint256)'];

// Indicative quotes before a wallet is connected still need a swapper address
const PLACEHOLDER_SWAPPER = '0x0000000000000000000000000000000000000001';

export const useDebouncedValue = <T>(value: T, delay = 500) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return debounced;
};

export const useBridgeTokenBalance = (token: BridgeToken | undefined, user: string) => {
  return useQuery({
    queryKey: ['bridgeTokenBalance', token?.chainId, token?.address, user],
    enabled: !!token && !!user,
    queryFn: async () => {
      if (!token) return '0';
      const contract = new Contract(token.address, ERC20_BALANCE_ABI, getProvider(token.chainId));
      const balance = await contract.balanceOf(user);
      return formatUnits(balance, token.decimals);
    },
    refetchInterval: 30_000,
  });
};

export const useBridgeQuote = (
  params: Omit<BridgeQuoteParams, 'swapper'> & { swapper?: string }
) => {
  const swapper = params.swapper || PLACEHOLDER_SWAPPER;
  const hasAmount = !!params.amount && params.amount !== '0';
  return useQuery({
    queryKey: [
      'uniswapBridgeQuote',
      params.tokenIn,
      params.tokenInChainId,
      params.tokenOut,
      params.tokenOutChainId,
      params.amount,
      swapper,
    ],
    enabled: hasAmount,
    queryFn: () => fetchBridgeQuote({ ...params, swapper }),
    // Quotes go stale quickly and the API is rate limited per key
    refetchInterval: 30_000,
    retry: (failureCount, error) =>
      failureCount < 2 && !(error instanceof UniswapApiError && error.status < 500),
  });
};

const FINAL_STATUSES: SwapStatus[] = ['SUCCESS', 'FAILED', 'EXPIRED'];

export const useBridgeStatus = (txHash: string | undefined, chainId: number) => {
  return useQuery({
    queryKey: ['uniswapBridgeStatus', txHash, chainId],
    enabled: !!txHash,
    queryFn: () => fetchSwapStatus(txHash as string, chainId),
    refetchInterval: (query) =>
      query.state.data && FINAL_STATUSES.includes(query.state.data) ? false : 5_000,
  });
};
