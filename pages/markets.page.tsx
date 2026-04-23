import { Box, Container } from '@mui/material';
import { ReactNode, useEffect } from 'react';
import { MarketSwitcher } from 'src/components/MarketSwitcher';
import { TopInfoPanel } from 'src/components/TopInfoPanel/TopInfoPanel';
import { MainLayout } from 'src/layouts/MainLayout';
import { MarketAssetsListContainer } from 'src/modules/markets/MarketAssetsListContainer';
import { MarketsTopPanel } from 'src/modules/markets/MarketsTopPanel';
import { useRootStore } from 'src/store/root';

interface MarketContainerProps {
  children: ReactNode;
}

export const marketContainerProps = {
  sx: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    pb: '39px',
    px: {
      xs: 2,
      xsm: 5,
      sm: 12,
      md: 5,
      lg: 0,
      xl: '96px',
      xxl: 0,
    },
    maxWidth: {
      xs: 'unset',
      lg: '1240px',
      xl: 'unset',
      xxl: '1440px',
    },
  },
};

export const MarketContainer = ({ children }: MarketContainerProps) => {
  return <Container {...marketContainerProps}>{children}</Container>;
};

export default function Markets() {
  const trackEvent = useRootStore((store) => store.trackEvent);

  useEffect(() => {
    trackEvent('Page Viewed', {
      'Page Name': 'Markets',
    });
  }, [trackEvent]);

  return (
    <>
      <TopInfoPanel
        containerProps={marketContainerProps}
        wrapperSx={{ pb: { xs: 8, md: 9, lg: 10, xl: 10, xxl: 10 } }}
        titleComponent={
          <Box sx={{ mb: 4, width: 'fit-content' }}>
            <MarketSwitcher />
          </Box>
        }
      >
        <MarketsTopPanel showDetails={false} />
      </TopInfoPanel>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          mt: { xs: 4, md: 6 },
        }}
      >
        <MarketContainer>
          <Box sx={{ mb: 4 }}>
            <MarketsTopPanel showSummary={false} />
          </Box>
          <MarketAssetsListContainer />
        </MarketContainer>
      </Box>
    </>
  );
}

Markets.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
