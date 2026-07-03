import { Trans } from '@lingui/macro';
import { Box, useTheme } from '@mui/material';

import styles from './TwoFABanner.module.css';

const WarningIcon = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const stroke = isDark ? '#97FF38' : '#004DFF';
  const background = isDark ? 'rgba(151, 255, 56, 0.12)' : 'rgba(0, 77, 255, 0.1)';

  return (
    <Box className={styles.warningIcon} sx={{ background }}>
      <svg
        className={styles.warningIconSvg}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_7994_8077)">
          <path
            d="M10.0003 6.66663V9.99996M10.0003 13.3333H10.0087M18.3337 9.99996C18.3337 14.6023 14.6027 18.3333 10.0003 18.3333C5.39795 18.3333 1.66699 14.6023 1.66699 9.99996C1.66699 5.39759 5.39795 1.66663 10.0003 1.66663C14.6027 1.66663 18.3337 5.39759 18.3337 9.99996Z"
            stroke={stroke}
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_7994_8077">
            <rect width="20" height="20" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </Box>
  );
};

export const TwoFABanner = () => {
  const theme = useTheme();

  return (
    <div className={styles.layout}>
      <Box
        className={styles.container}
        sx={{
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <div className={styles.content}>
          <WarningIcon />
          <Box
            component="span"
            className={styles.contentText}
            sx={{ color: theme.palette.text.primary }}
          >
            <Trans>
              In order to perform operations with your real estate tokens, you must first open your
              time window on the app.reental.co platform
            </Trans>
          </Box>
          <div className={styles.contentButtons}>
            <button
              className={styles.contentButton}
              onClick={() => window.open('https://app.reental.co/dashboard/rnt', '_blank')}
            >
              <Trans>Go to Reental</Trans>
            </button>

            <Box
              className={styles.linkButton}
              sx={{ color: theme.palette.text.highlight }}
              onClick={() =>
                window.open(
                  'https://www.reental.co/ayuda/guia-de-acceso-temporal-y-activacion-de-la-ventana-de-tiempo-en-reenlever',
                  '_blank'
                )
              }
            >
              <Trans>What is the time window?</Trans>
            </Box>
          </div>
        </div>
      </Box>
    </div>
  );
};
