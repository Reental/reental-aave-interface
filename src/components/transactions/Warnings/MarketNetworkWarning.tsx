import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';
import { getNetworkConfig } from 'src/utils/marketsAndNetworksConfig';

import { ChangeNetworkWarning, ChangeNetworkWarningProps } from './ChangeNetworkWarning';

/**
 * Prompts the wallet to switch to the selected market's network (auto-switch on mount plus a
 * manual button) for flows that don't go through the standard ModalWrapper.
 */
export const MarketNetworkWarning = (
  props: Omit<ChangeNetworkWarningProps, 'networkName' | 'chainId'>
) => {
  const { currentAccount, chainId: connectedChainId, readOnlyModeAddress } = useWeb3Context();
  const marketChainId = useRootStore((store) => store.currentMarketData.chainId);

  if (!currentAccount || readOnlyModeAddress || connectedChainId === marketChainId) return null;

  return (
    <ChangeNetworkWarning
      networkName={getNetworkConfig(marketChainId).name}
      chainId={marketChainId}
      {...props}
    />
  );
};
