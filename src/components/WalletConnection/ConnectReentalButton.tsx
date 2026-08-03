import { t, Trans } from '@lingui/macro';
import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import { useRootStore } from 'src/store/root';
import {
  closePendingReentalPopup,
  openBlankReentalPopup,
  REENTAL_CONNECTOR_ID,
} from 'src/ui-config/reentalWalletConnect';
import { AUTH } from 'src/utils/events';
import { useAccount, useConnect } from 'wagmi';
import { useShallow } from 'zustand/shallow';

export interface ConnectReentalButtonProps {
  funnel?: string;
}

/**
 * WalletConnect por mercado: abre la base URL del mercado activo (dashboard) con uri=wc:.
 * Requiere NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID y
 * reentalWalletConnectBaseUrl en el mercado (env NEXT_PUBLIC_REENTAL_WC_URL_*).
 */
export const ConnectReentalButton: React.FC<ConnectReentalButtonProps> = ({ funnel }) => {
  const { isConnected } = useAccount();
  const { connectAsync, connectors, isPending } = useConnect();
  const [trackEvent, currentMarketData] = useRootStore(
    useShallow((store) => [store.trackEvent, store.currentMarketData])
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const baseUrl = currentMarketData.reentalWalletConnectBaseUrl;

  if (isConnected || !baseUrl) {
    return null;
  }

  const reentalConnector = connectors.find((c) => c.id === REENTAL_CONNECTOR_ID);

  const onClick = async () => {
    setErrorMessage(null);

    if (!reentalConnector) {
      setErrorMessage(t`Reental connector is not configured (missing WalletConnect Project ID).`);
      return;
    }

    const popup = openBlankReentalPopup(baseUrl);
    if (!popup) {
      setErrorMessage(
        t`Tab blocked. Allow pop-ups/tabs for this site, or use Connect wallet (QR) as fallback.`
      );
      return;
    }

    trackEvent(AUTH.CONNECT_WALLET, {
      funnel: funnel || 'reental_walletconnect',
      wallet_type: REENTAL_CONNECTOR_ID,
      current_url: window.location.pathname,
      market: currentMarketData.market,
    });
    trackEvent(AUTH.WALLET_CONNECT_START, {
      funnel: funnel || 'reental_walletconnect',
      wallet_type: REENTAL_CONNECTOR_ID,
      market: currentMarketData.market,
    });

    try {
      await connectAsync({ connector: reentalConnector });
      trackEvent(AUTH.WALLET_CONNECT_SUCCESS, {
        funnel: funnel || 'reental_walletconnect',
        wallet_type: REENTAL_CONNECTOR_ID,
        market: currentMarketData.market,
      });
    } catch (error) {
      closePendingReentalPopup();
      trackEvent(AUTH.WALLET_CONNECT_ABORT, {
        funnel: funnel || 'reental_walletconnect',
        wallet_type: REENTAL_CONNECTOR_ID,
        market: currentMarketData.market,
      });
      const message = error instanceof Error ? error.message : t`Connection failed`;
      if (!/user rejected|connection request reset/i.test(message)) {
        setErrorMessage(message);
      }
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        disabled={isPending || !reentalConnector}
        onClick={onClick}
        sx={{ whiteSpace: 'nowrap' }}
      >
        <Trans>Connect with Reental</Trans>
      </Button>
      {errorMessage && (
        <Typography
          variant="caption"
          color="error"
          sx={{ display: 'block', maxWidth: 220, mt: 0.5 }}
        >
          {errorMessage}
        </Typography>
      )}
    </>
  );
};
