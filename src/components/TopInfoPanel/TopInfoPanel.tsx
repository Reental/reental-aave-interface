import { Box, BoxProps, Container, ContainerProps } from '@mui/material';
import { ReactNode } from 'react';

import { PageTitle, PageTitleProps } from './PageTitle';

interface TopInfoPanelProps extends PageTitleProps {
  children?: ReactNode;
  titleComponent?: ReactNode;
  containerProps?: ContainerProps;
  wrapperSx?: BoxProps['sx'];
}

export const TopInfoPanel = ({
  pageTitle,
  titleComponent,
  withMarketSwitcher,
  withMigrateButton,
  withFavoriteButton,
  bridge,
  children,
  containerProps = {},
  wrapperSx,
}: TopInfoPanelProps) => {
  return (
    <Box
      sx={[
        (theme) => ({
          // Dark: RNT Body Color header band. Light: a light "card" surface so the
          // band reads as a card instead of keeping the dark header (Manual de Marca).
          bgcolor:
            theme.palette.mode === 'dark'
              ? theme.palette.background.header
              : theme.palette.background.surface,
          pt: { xs: 10, md: 12 },
          pb: { xs: 18, md: 20, lg: '94px', xl: '92px', xxl: '96px' },
          color: theme.palette.mode === 'dark' ? '#F1F1F3' : theme.palette.text.primary,
        }),
        ...(Array.isArray(wrapperSx) ? wrapperSx : [wrapperSx]),
      ]}
    >
      <Container {...containerProps} sx={{ ...containerProps.sx, pb: 0 }}>
        <Box sx={{ px: { xs: 4, xsm: 6 } }}>
          {!titleComponent && (
            <PageTitle
              pageTitle={pageTitle}
              withMarketSwitcher={withMarketSwitcher}
              withMigrateButton={withMigrateButton}
              withFavoriteButton={withFavoriteButton}
              bridge={bridge}
            />
          )}

          {titleComponent && titleComponent}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: { xs: 3, xsm: 8 },
              flexWrap: 'wrap',
              width: '100%',
            }}
          >
            {children}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
