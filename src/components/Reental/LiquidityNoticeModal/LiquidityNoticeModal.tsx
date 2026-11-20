import { ExclamationCircleIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import { Box, Button, SvgIcon, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { BasicModal } from 'src/components/primitives/BasicModal';

const LOCK_SECONDS = 10;

export const LiquidityNoticeModal = () => {
  const [open, setOpen] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(LOCK_SECONDS);
  const canClose = secondsLeft === 0;

  useEffect(() => {
    if (canClose) return;
    const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, canClose]);

  return (
    <BasicModal
      open={open}
      setOpen={(value) => canClose && setOpen(value)}
      withCloseButton={canClose}
    >
      <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
      >
        <SvgIcon sx={{ fontSize: '32px', color: 'warning.main', mb: 3 }}>
          <ExclamationCircleIcon />
        </SvgIcon>
        <Typography variant="h2" sx={{ mb: 4 }}>
          <Trans>Important notice</Trans>
        </Typography>
        <Typography variant="description" sx={{ mb: 6 }}>
          <Trans>
            We are working to return the funds. We will keep you informed of every step.
          </Trans>
        </Typography>
        <Button variant="contained" fullWidth disabled={!canClose} onClick={() => setOpen(false)}>
          {canClose ? <Trans>Understood</Trans> : <Trans>Understood ({secondsLeft}s)</Trans>}
        </Button>
      </Box>
    </BasicModal>
  );
};
