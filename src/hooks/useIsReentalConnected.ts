import { useEffect, useState } from 'react';
import {
  type WalletConnectPeerMetadata,
  isReentalPeerMetadata,
  REENTAL_CONNECTOR_ID,
} from 'src/ui-config/reentalWalletConnect';
import { useAccount } from 'wagmi';

type SessionProvider = {
  session?: {
    peer?: {
      metadata?: WalletConnectPeerMetadata;
    };
  };
};

/**
 * True when the active session is the Reental app (HumanWallet), whether the
 * user entered via the branded connector or pasted a WalletConnect URI.
 */
export const useIsReentalConnected = (): boolean => {
  const { connector, isConnected, status } = useAccount();
  const [isReental, setIsReental] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const resolve = async () => {
      if (!isConnected || !connector) {
        if (!cancelled) setIsReental(false);
        return;
      }

      if (connector.id === REENTAL_CONNECTOR_ID) {
        if (!cancelled) setIsReental(true);
        return;
      }

      // URI paste / ConnectKit WC path — identify by wallet peer metadata.
      try {
        const provider = (await connector.getProvider()) as SessionProvider | undefined;
        const meta = provider?.session?.peer?.metadata;
        if (!cancelled) setIsReental(isReentalPeerMetadata(meta));
      } catch {
        if (!cancelled) setIsReental(false);
      }
    };

    void resolve();

    return () => {
      cancelled = true;
    };
  }, [connector, isConnected, status]);

  return isReental;
};
