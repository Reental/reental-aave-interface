import { useRootStore } from 'src/store/root';
import { isFeatureEnabled } from 'src/utils/marketsAndNetworksConfig';

import { getLiquidationsPonderUrl } from './client';

/**
 * Liquidation indexer of the selected market. Queries are disabled on markets without
 * liquidations (e.g. official Aave) and keyed by chain so markets never share cached data.
 */
export const useLiquidationsPonder = () => {
  const marketData = useRootStore((store) => store.currentMarketData);
  const enabled = !!isFeatureEnabled.liquidations(marketData);
  return {
    enabled,
    url: enabled ? getLiquidationsPonderUrl(marketData) : undefined,
    chainId: marketData.chainId,
  };
};
