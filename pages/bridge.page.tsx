import * as React from 'react';
import { useEffect } from 'react';
import { ContentContainer } from 'src/components/ContentContainer';
import { MainLayout } from 'src/layouts/MainLayout';
import { BridgeForm } from 'src/modules/bridge/BridgeForm';
import { BridgeTopPanel } from 'src/modules/bridge/BridgeTopPanel';
import { useRootStore } from 'src/store/root';

export default function Bridge() {
  const trackEvent = useRootStore((store) => store.trackEvent);

  useEffect(() => {
    trackEvent('Page Viewed', {
      'Page Name': 'Bridge',
    });
  }, [trackEvent]);
  return (
    <>
      <BridgeTopPanel />
      {/* Start below the header band instead of overlapping it */}
      <ContentContainer wrapperSx={{ mt: { xs: 4, md: 6 } }}>
        <BridgeForm />
      </ContentContainer>
    </>
  );
}

Bridge.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
