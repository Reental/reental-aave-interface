import { ScaleIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import { Button, Paper, SvgIcon, Typography } from '@mui/material';

interface LiquidationsNoPositionProps {
  onSetup: () => void;
}

export const LiquidationsNoPosition = ({ onSetup }: LiquidationsNoPositionProps) => {
  return (
    <Paper
      sx={{
        border: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        p: { xs: 6, xsm: 10 },
      }}
    >
      <SvgIcon sx={{ fontSize: '48px', color: 'text.muted', mb: 4 }}>
        <ScaleIcon />
      </SvgIcon>
      <Typography variant="h3" sx={{ mb: 2 }}>
        <Trans>No liquidation position yet</Trans>
      </Typography>
      <Typography variant="description" color="text.secondary" sx={{ mb: 6, maxWidth: '480px' }}>
        <Trans>
          Allocate part of your deposits to back liquidations and earn liquidation bonuses on the
          collaterals you choose to accept. Your funds keep earning interest until a liquidation
          executes.
        </Trans>
      </Typography>
      <Button variant="contained" size="large" onClick={onSetup} sx={{ minWidth: '220px' }}>
        <Trans>Set up liquidations</Trans>
      </Button>
    </Paper>
  );
};
