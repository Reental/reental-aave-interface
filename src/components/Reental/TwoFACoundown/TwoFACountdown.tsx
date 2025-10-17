import { Trans } from '@lingui/macro';
import { CircularProgress, circularProgressClasses, CircularProgressProps } from '@mui/material';
import React from 'react';

import { TwoFABanner } from '../TwoFABanner/TwoFABanner';
import styles from './TwoFACountdown.module.css';

function useVisibleCountdown(expirationDate: Date, stepMs = 1000) {
  const [now, setNow] = React.useState(() => Date.now());

  React.useEffect(() => {
    let id: number | null = null;
    const tick = () => setNow(Date.now());
    const start = () => {
      if (id == null) id = window.setInterval(tick, stepMs);
    };
    const stop = () => {
      if (id != null) {
        clearInterval(id);
        id = null;
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        tick(); // una sola actualización inmediata
        start(); // y reanudar intervalo
      } else {
        stop(); // no actualices mientras está oculta
      }
    };
    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [stepMs]);

  return Math.max(0, expirationDate.getTime() - now);
}

export default function MyCircularProgress(props: CircularProgressProps) {
  return (
    <div className={styles.circularProgress}>
      <CircularProgress
        variant="determinate"
        className={styles.circularProgressCircle}
        {...props}
        value={100}
        sx={{
          [`& .${circularProgressClasses.circle}`]: {
            stroke: '#1F293720',
          },
        }}
      />
      <CircularProgress
        variant="determinate"
        className={styles.circularProgressCircle}
        {...props}
      />
    </div>
  );
}

export const TwoFACountdown = ({
  windowTime,
  expirationDate,
  fetchOnEnd,
}: {
  windowTime: number; // ms totales de la ventana
  expirationDate: Date;
  fetchOnEnd: () => void;
}) => {
  const timeLeft = useVisibleCountdown(expirationDate, 1000);

  // Evita dobles llamadas al llegar a 0
  const endedRef = React.useRef(false);
  React.useEffect(() => {
    if (timeLeft <= 0 && !endedRef.current) {
      endedRef.current = true;
      fetchOnEnd();
    }
  }, [timeLeft, fetchOnEnd]);

  const totalMs = Math.max(1, windowTime);
  const minutesLeft = String(Math.floor(timeLeft / 60000)).padStart(2, '0');
  const secondsLeft = String(Math.floor((timeLeft % 60000) / 1000)).padStart(2, '0');
  const progress = 100 - Math.max(0, Math.min(100, (timeLeft / totalMs) * 100));

  if (timeLeft <= 0) {
    return <TwoFABanner />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <span className={styles.contentText}>
          <Trans>Time to operate</Trans>
        </span>
        <div className={styles.timeLeft}>
          {minutesLeft}:{secondsLeft}
        </div>
        <MyCircularProgress
          sx={{
            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: 'round',
              stroke: '#FF9E00',
            },
          }}
          variant="determinate"
          value={progress}
          size={32}
          thickness={8}
        />
      </div>
    </div>
  );
};
