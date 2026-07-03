import { Trans } from '@lingui/macro';
import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

import { DarkTooltip } from './infoTooltips/DarkTooltip';

interface CircleIconProps {
  downToSM: boolean;
  tooltipText: string;
  children: ReactNode;
}

export const CircleIcon = ({ downToSM, tooltipText, children }: CircleIconProps) => {
  return (
    <DarkTooltip
      title={
        <Typography>
          <Trans>{tooltipText}</Trans>
        </Typography>
      }
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={(theme) => ({
            bgcolor: theme.palette.mode === 'dark' ? '#1F2937' : theme.palette.background.paper,
            width: downToSM ? '18px' : '24px',
            height: downToSM ? '18px' : '24px',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            ml: '8px',
            border:
              theme.palette.mode === 'dark'
                ? '0.5px solid rgba(235, 235, 237, 0.12)'
                : `1px solid ${theme.palette.divider}`,
          })}
        >
          {children}
        </Box>
      </Box>
    </DarkTooltip>
  );
};
