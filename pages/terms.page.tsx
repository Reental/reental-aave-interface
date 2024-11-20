import * as React from 'react';
import { useEffect } from 'react';
import { ContentContainer } from 'src/components/ContentContainer';
import TermsPage from 'src/components/terms/TermsPage';
import { MainLayout } from 'src/layouts/MainLayout';
import { useRootStore } from 'src/store/root';

export default function Terms() {
  const trackEvent = useRootStore((store) => store.trackEvent);

  useEffect(() => {
    trackEvent('Page Viewed', {
      'Page Name': 'T&C',
    });
  }, [trackEvent]);
  return (
    <ContentContainer>
      <TermsPage />
    </ContentContainer>
  );
}

Terms.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
