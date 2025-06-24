import { Box } from '@mui/material';
import React, { ReactNode } from 'react';
import AnalyticsConsent from 'src/components/Analytics/AnalyticsConsent';
import { FeedbackModal } from 'src/layouts/FeedbackDialog';
import { FORK_ENABLED } from 'src/utils/marketsAndNetworksConfig';

import { AppFooter } from './AppFooter';
import { AppHeader } from './AppHeader';
import TopBarNotify from './TopBarNotify';

const parseJSON = (jsonString = '') => {
  try {
    const json = JSON.parse(jsonString);
    return json;
  } catch (error) {
    return {};
  }
};
const NOTIFY_BAR = parseJSON(process.env.NEXT_PUBLIC_NOTIFY_BAR || '{}');

export function MainLayout({ children }: { children: ReactNode }) {
  const APP_BANNER_VERSION = 'r1.0.4';

  const { visible = false, learnMoreLink, buttonText, notifyText, icon } = NOTIFY_BAR;

  return (
    <>
      {visible && (
        <TopBarNotify
          learnMoreLink={learnMoreLink}
          buttonText={buttonText}
          notifyText={notifyText}
          bannerVersion={APP_BANNER_VERSION}
          icon={icon}
        />
      )}
      <AppHeader />
      <Box component="main" sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {children}
      </Box>

      <AppFooter />
      <FeedbackModal />
      {FORK_ENABLED ? null : <AnalyticsConsent />}
    </>
  );
}
