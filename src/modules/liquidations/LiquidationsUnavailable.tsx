import { ScaleIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import { Button, Paper, SvgIcon, Typography } from '@mui/material';
import { Link, ROUTES } from 'src/components/primitives/Link';
import { useRootStore } from 'src/store/root';

/** Shown on the liquidation pages when the selected market has no liquidation router. */
export const LiquidationsUnavailable = () => {
  const marketTitle = useRootStore((store) => store.currentMarketData.marketTitle);

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
        <Trans>Liquidations are not available on {marketTitle}</Trans>
      </Typography>
      <Typography variant="description" color="text.secondary" sx={{ mb: 6, maxWidth: '480px' }}>
        <Trans>Select a Reental market to back liquidations with your deposits.</Trans>
      </Typography>
      <Button
        component={Link}
        href={ROUTES.markets}
        variant="contained"
        size="large"
        sx={{ minWidth: '220px' }}
      >
        <Trans>Back to markets</Trans>
      </Button>
    </Paper>
  );
};
