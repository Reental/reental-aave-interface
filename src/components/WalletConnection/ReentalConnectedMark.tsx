import { t } from '@lingui/macro';
import { Badge, Box, Tooltip } from '@mui/material';
import Image from 'next/image';
import { useRootStore } from 'src/store/root';

const LOGO_SIZE = 18;
const PIN_SIZE = 8;

/** Compact brand mark: Reental logo + green connected pin. */
export const ReentalConnectedMark = () => {
  const marketLogo = useRootStore((s) => s.currentMarketData.logo) || '/icons/markets/reental.png';
  const label = t`Connected with Reental`;

  return (
    <Tooltip title={label} arrow placement="bottom">
      <Box
        component="span"
        aria-label={label}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          lineHeight: 0,
          ml: 0.5,
        }}
      >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <Box
              sx={{
                width: PIN_SIZE,
                height: PIN_SIZE,
                borderRadius: '50%',
                bgcolor: 'success.main',
                border: '1.5px solid',
                borderColor: 'background.surface',
                boxShadow: (theme) =>
                  theme.palette.mode === 'dark' ? '0 0 0 1px rgba(0,0,0,0.35)' : 'none',
              }}
            />
          }
        >
          <Box
            sx={{
              width: LOGO_SIZE,
              height: LOGO_SIZE,
              borderRadius: '50%',
              overflow: 'hidden',
              display: 'inline-flex',
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Image src={marketLogo} alt="" width={LOGO_SIZE} height={LOGO_SIZE} />
          </Box>
        </Badge>
      </Box>
    </Tooltip>
  );
};
