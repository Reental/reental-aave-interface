import { Trans } from '@lingui/macro';
import { Box, CircularProgress, Paper, PaperProps, Typography } from '@mui/material';
import { useModal } from 'connectkit';
import { ReactNode } from 'react';

import { ConnectReentalButton } from './WalletConnection/ConnectReentalButton';
import { ConnectWalletButton } from './WalletConnection/ConnectWalletButton';

interface ConnectWalletPaperProps extends PaperProps {
  description?: ReactNode;
}

export const ConnectWalletPaper = ({ description, sx, ...rest }: ConnectWalletPaperProps) => {
  const { open } = useModal();

  return (
    <Paper
      {...rest}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        border: 1,
        borderColor: 'divider',
        p: 4,
        flex: 1,
        ...sx,
      }}
    >
      <>
        {open ? (
          <CircularProgress />
        ) : (
          <>
            <Typography variant="h2" sx={{ mb: 2 }}>
              <Trans>Please, connect your wallet</Trans>
            </Typography>
            <Typography sx={{ mb: 6 }} color="text.secondary">
              {description || (
                <Trans>
                  Please connect your wallet to see your supplies, borrowings, and open positions.
                </Trans>
              )}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', xsm: 'row' },
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              <ConnectWalletButton funnel="connect_wallet_paper" />
              <ConnectReentalButton funnel="connect_wallet_paper" />
            </Box>
          </>
        )}
      </>
    </Paper>
  );
};
