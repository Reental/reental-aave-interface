import { ShieldCheckIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Button, keyframes, LinearProgress, SvgIcon, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { BasicModal } from 'src/components/primitives/BasicModal';

const LOCK_SECONDS = 10;
const NO_LIQUIDATIONS_UNTIL = new Date('2026-11-28T18:00:00+01:00');
const TIME_ZONE = 'Europe/Madrid';
const SEEN_STORAGE_KEY = 'reental_lend_incident_notice_v1';

const fill = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

export const LiquidityNoticeModal = () => {
  const { i18n } = useLingui();
  const [open, setOpen] = useState(() => localStorage.getItem(SEEN_STORAGE_KEY) !== 'true');
  const [secondsLeft, setSecondsLeft] = useState(LOCK_SECONDS);
  const canClose = secondsLeft === 0;

  useEffect(() => {
    if (!open || canClose) return;
    const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [open, secondsLeft, canClose]);

  if (!open) return null;

  const close = () => {
    localStorage.setItem(SEEN_STORAGE_KEY, 'true');
    setOpen(false);
  };

  const day = i18n.date(NO_LIQUIDATIONS_UNTIL, {
    day: 'numeric',
    month: 'long',
    timeZone: TIME_ZONE,
  });
  const time = i18n.date(NO_LIQUIDATIONS_UNTIL, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TIME_ZONE,
    timeZoneName: 'short',
  });

  return (
    <BasicModal open setOpen={() => canClose && close()} withCloseButton={canClose}>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
      >
        <SvgIcon sx={{ fontSize: '32px', color: 'success.main', mb: 3 }}>
          <ShieldCheckIcon />
        </SvgIcon>
        <Typography variant="h2" sx={{ mb: 4 }}>
          <Trans>Your RNTLend balance is 100% backed</Trans>
        </Typography>
        <Typography variant="description" sx={{ mb: 3 }}>
          <Trans>
            Reental has covered, with its own funds, the amount affected by the November 18
            incident.
          </Trans>
        </Typography>
        <Typography variant="description" sx={{ mb: 6 }}>
          <Trans>
            There will be no liquidations until {day} at {time}, so you can review and adjust your
            positions with peace of mind.
          </Trans>
        </Typography>
        {!canClose && (
          <LinearProgress
            variant="determinate"
            value={0}
            sx={{
              width: '100%',
              mb: 3,
              '& .MuiLinearProgress-bar': { animation: `${fill} ${LOCK_SECONDS}s linear forwards` },
            }}
          />
        )}
        <Button variant="contained" fullWidth disabled={!canClose} onClick={close}>
          {canClose ? <Trans>Understood</Trans> : <Trans>Understood ({secondsLeft}s)</Trans>}
        </Button>
      </Box>
    </BasicModal>
  );
};
