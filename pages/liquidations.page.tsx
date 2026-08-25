import { Trans } from '@lingui/macro';
import { Typography } from '@mui/material';
import { useEffect } from 'react';
import { ConnectWalletPaper } from 'src/components/ConnectWalletPaper';
import { ContentContainer } from 'src/components/ContentContainer';
import { TopInfoPanel } from 'src/components/TopInfoPanel/TopInfoPanel';
import { MainLayout } from 'src/layouts/MainLayout';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { LiquidationsContentWrapper } from 'src/modules/liquidations/LiquidationsContentWrapper';
import { useRootStore } from 'src/store/root';

export default function Liquidations() {
  const { currentAccount } = useWeb3Context();
  const trackEvent = useRootStore((store) => store.trackEvent);

  useEffect(() => {
    trackEvent('Page Viewed', {
      'Page Name': 'Liquidations',
    });
  }, [trackEvent]);

  return (
    <>
      <TopInfoPanel
        titleComponent={
          <Typography variant="h1" sx={{ mb: 1 }}>
            <Trans>Liquidations</Trans>
          </Typography>
        }
      >
        <Typography variant="description" color="text.secondary" sx={{ maxWidth: '680px' }}>
          <Trans>
            Put your deposits to work backing liquidations. Choose how much of each deposit to
            allocate and which collaterals you are willing to receive in exchange, with their
            liquidation bonus.
          </Trans>
        </Typography>
      </TopInfoPanel>

      <ContentContainer>
        {currentAccount ? <LiquidationsContentWrapper /> : <ConnectWalletPaper />}
      </ContentContainer>
    </>
  );
}

Liquidations.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
