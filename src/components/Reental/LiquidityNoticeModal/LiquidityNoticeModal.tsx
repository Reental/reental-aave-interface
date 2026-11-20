import { ExclamationCircleIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import { Box, Button, SvgIcon, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { BasicModal } from 'src/components/primitives/BasicModal';

/** Seconds the notice stays locked before the user can dismiss it. */
export const LIQUIDITY_NOTICE_LOCK_SECONDS = 10;

/**
 * Blocking notice shown on every app load while the liquidity return is being organized.
 *
 * For the first LIQUIDITY_NOTICE_LOCK_SECONDS it cannot be dismissed: there is no close
 * button and backdrop clicks / Escape are ignored. After that, the button, the close icon,
 * the backdrop and Escape all close it.
 */
export const LiquidityNoticeModal = () => {
  const [open, setOpen] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(LIQUIDITY_NOTICE_LOCK_SECONDS);
  const canClose = secondsLeft <= 0;

  useEffect(() => {
    if (canClose) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, canClose]);

  // BasicModal routes the close icon, backdrop clicks and Escape through setOpen(false).
  const handleSetOpen = (value: boolean) => {
    if (!value && !canClose) return;
    setOpen(value);
  };

  return (
    <BasicModal open={open} setOpen={handleSetOpen} withCloseButton={canClose}>
      <Box
        data-cy="LiquidityNoticeModal"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <SvgIcon sx={{ fontSize: '32px', color: 'warning.main', mb: 3 }}>
          <ExclamationCircleIcon />
        </SvgIcon>
        <Typography variant="h2" sx={{ mb: 4 }}>
          <Trans>Important notice</Trans>
        </Typography>
        <Typography variant="description" sx={{ mb: 6 }}>
          <Trans>
            We are organizing everything to return the liquidity. We will keep you informed.
          </Trans>
        </Typography>
        <Button
          variant="contained"
          fullWidth
          disabled={!canClose}
          onClick={() => handleSetOpen(false)}
          data-cy="LiquidityNoticeModal-close"
        >
          {canClose ? <Trans>Understood</Trans> : <Trans>Understood ({secondsLeft}s)</Trans>}
        </Button>
      </Box>
    </BasicModal>
  );
};
