import { Trans } from '@lingui/macro';
import { Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ConnectWalletPaper } from 'src/components/ConnectWalletPaper';
import { ContentContainer } from 'src/components/ContentContainer';
import { ROUTES } from 'src/components/primitives/Link';
import { TopInfoPanel } from 'src/components/TopInfoPanel/TopInfoPanel';
import { MainLayout } from 'src/layouts/MainLayout';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { LiquidationsSetup } from 'src/modules/liquidations/LiquidationsSetup';
import { useLiquidationsPosition } from 'src/modules/liquidations/useLiquidationsPosition';
import { useRootStore } from 'src/store/root';

export default function LiquidationsSetupPage() {
  const router = useRouter();
  const { currentAccount } = useWeb3Context();
  const { position, savePosition } = useLiquidationsPosition();
  const trackEvent = useRootStore((store) => store.trackEvent);

  useEffect(() => {
    trackEvent('Page Viewed', {
      'Page Name': 'Liquidations Setup',
    });
  }, [trackEvent]);

  return (
    <>
      <TopInfoPanel
        titleComponent={
          <Typography variant="h1" sx={{ mb: 1 }}>
            <Trans>Configure liquidations</Trans>
          </Typography>
        }
      >
        <Typography variant="description" color="text.secondary" sx={{ maxWidth: '680px' }}>
          <Trans>
            Choose how much of each deposit to allocate, which collaterals you are willing to
            receive in exchange, and approve the matcher contract.
          </Trans>
        </Typography>
      </TopInfoPanel>

      <ContentContainer>
        {currentAccount ? (
          <LiquidationsSetup
            initialConfig={position?.config}
            onSubmit={(config) => {
              // TODO: wire the matcher contract write before persisting
              savePosition(config);
              router.push(ROUTES.liquidations);
            }}
            onCancel={() => router.push(ROUTES.liquidations)}
          />
        ) : (
          <ConnectWalletPaper />
        )}
      </ContentContainer>
    </>
  );
}

LiquidationsSetupPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
