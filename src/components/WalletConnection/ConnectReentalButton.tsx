import { t, Trans } from '@lingui/macro';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import { useRootStore } from 'src/store/root';
import {
  closePendingReentalPopup,
  ENABLE_REENTAL_WC,
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
 * WalletConnect por mercado: abre la base URL del mercado activo con uri=wc:.
 * Misma altura que Connect wallet; estilo surface + logo (no gradient).
 */
export const ConnectReentalButton: React.FC<ConnectReentalButtonProps> = ({ funnel }) => {
  const { isConnected } = useAccount();
  const { connectAsync, connectors, isPending } = useConnect();
  const [trackEvent, currentMarketData] = useRootStore(
    useShallow((store) => [store.trackEvent, store.currentMarketData])
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const baseUrl = currentMarketData.reentalWalletConnectBaseUrl;
  const marketLogo = currentMarketData.logo || '/icons/markets/reental.png';

  if (!ENABLE_REENTAL_WC || isConnected || !baseUrl) {
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
    <Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'stretch' }}>
      <Button
        variant="surface"
        disabled={isPending || !reentalConnector}
        onClick={onClick}
        startIcon={
          isPending ? (
            <CircularProgress color="inherit" size={16} />
          ) : (
            <Box
              component="span"
              sx={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                overflow: 'hidden',
                display: 'inline-flex',
                flexShrink: 0,
                lineHeight: 0,
              }}
            >
              <Image src={marketLogo} alt="" width={18} height={18} />
            </Box>
          )
        }
        sx={{
          whiteSpace: 'nowrap',
          borderRadius: '10px',
          borderColor: 'divider',
          minHeight: 40,
          px: 3,
          '& .MuiButton-startIcon': { mr: 1.5, ml: 0 },
          '&:hover, &.Mui-focusVisible': {
            borderColor: 'primary.main',
          },
        }}
      >
        <Trans>Connect with Reental</Trans>
      </Button>
      {errorMessage && (
        <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
};
