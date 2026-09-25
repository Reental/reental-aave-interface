import { Trans } from '@lingui/macro';
import { Box } from '@mui/material';
import { useEffect } from 'react';
import { GradientBackground } from 'src/components/GradientBackground';
import { MarketSwitcher } from 'src/components/MarketSwitcher';
import { TopInfoPanel } from 'src/components/TopInfoPanel/TopInfoPanel';
import { MainLayout } from 'src/layouts/MainLayout';
import { AnalyticsTopPanel } from 'src/modules/analytics/AnalyticsTopPanel';
import { HealthFactorDistribution } from 'src/modules/analytics/HealthFactorDistribution';
import { PositionsList } from 'src/modules/analytics/PositionsList';
import { RiskParameters } from 'src/modules/analytics/RiskParameters';
import { useProtocolPositions } from 'src/modules/analytics/useProtocolPositions';
import { useRootStore } from 'src/store/root';

import { MarketContainer, marketContainerProps } from './markets.page';

export default function Analytics() {
  const trackEvent = useRootStore((store) => store.trackEvent);
  const { positions } = useProtocolPositions();

  useEffect(() => {
    trackEvent('Page Viewed', {
      'Page Name': 'Analytics',
    });
  }, [trackEvent]);

  return (
    <>
      <GradientBackground />
      <TopInfoPanel
        containerProps={marketContainerProps}
        pageTitle={<Trans>Analytics</Trans>}
        titleComponent={
          <Box sx={{ mb: 4, width: 'fit-content' }}>
            <MarketSwitcher />
          </Box>
        }
      >
        <AnalyticsTopPanel />
      </TopInfoPanel>

      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, mt: { xs: 4, md: 6 } }}>
        <MarketContainer>
          <HealthFactorDistribution positions={positions} />
          <RiskParameters />
          <PositionsList />
        </MarketContainer>
      </Box>
    </>
  );
}

Analytics.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
