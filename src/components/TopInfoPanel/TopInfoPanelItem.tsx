import { Box, Skeleton, SxProps, Theme, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ReactNode } from 'react';
import { FONT_LABEL } from 'src/utils/theme';

interface TopInfoPanelItemProps {
  icon?: ReactNode;
  title: ReactNode;
  titleIcon?: ReactNode;
  children: ReactNode;
  hideIcon?: boolean;
  withoutIconWrapper?: boolean;
  variant?: 'light' | 'dark' | undefined; // default dark
  withLine?: boolean;
  loading?: boolean;
  sx?: SxProps<Theme>;
}

export const TopInfoPanelItem = ({
  icon,
  title,
  titleIcon,
  children,
  hideIcon,
  variant = 'dark',
  withLine,
  loading,
  withoutIconWrapper,
  sx,
}: TopInfoPanelItemProps) => {
  const theme = useTheme();
  const upToSM = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: { xs: 'calc(50% - 12px)', xsm: 'unset' },
        ...sx,
      }}
    >
      {withLine && (
        <Box
          sx={{
            mr: 8,
            my: 'auto',
            width: '1px',
            bgcolor: '#F2F3F729',
            height: '37px',
          }}
        />
      )}

      {!hideIcon &&
        (withoutIconWrapper ? (
          icon && icon
        ) : (
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid',
              borderColor: theme.palette.mode === 'dark' ? '#EBEBED1F' : 'divider',
              borderRadius: '12px',
              bgcolor: theme.palette.mode === 'dark' ? '#1F2937' : 'background.paper',
              boxShadow: '0px 2px 1px rgba(0, 0, 0, 0.05), 0px 0px 1px rgba(0, 0, 0, 0.25)',
              width: 42,
              height: 42,
              mr: 3,
            }}
          >
            {icon && icon}
          </Box>
        ))}

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
          <Typography
            sx={{
              // Theme-aware label color: the panel band is dark in dark mode and a
              // light card in light mode.
              color: variant === 'dark' ? 'text.muted' : '#62677B',
              // RNT "Label" style: Orbitron, uppercase, tracked out (Manual de Marca V.1).
              fontFamily: FONT_LABEL,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
            variant={upToSM ? 'subheader2' : 'helperText'}
            component="div"
          >
            {title}
          </Typography>
          {titleIcon && titleIcon}
        </Box>

        {loading ? (
          <Skeleton
            width={60}
            height={upToSM ? 28 : 24}
            sx={{ background: theme.palette.mode === 'dark' ? '#1F2937' : undefined }}
          />
        ) : (
          // RNT "Data" style: metric values inherit the brand primary color
          // (green in dark mode, blue in light mode). Regular weight: the
          // variants' bold weights read too heavy for figures.
          <Box sx={{ color: 'primary.main', '& .MuiTypography-root': { fontWeight: 400 } }}>
            {children}
          </Box>
        )}
      </Box>
    </Box>
  );
};
