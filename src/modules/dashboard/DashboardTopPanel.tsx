import { valueToBigNumber } from '@aave/math-utils';
import { Trans } from '@lingui/macro';
import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import Link from 'next/link';
import * as React from 'react';
import { useState } from 'react';
import { NetAPYTooltip } from 'src/components/infoTooltips/NetAPYTooltip';
import { getMarketInfoById } from 'src/components/MarketSwitcher';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { ROUTES } from 'src/components/primitives/Link';
import { PageTitle } from 'src/components/TopInfoPanel/PageTitle';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';
import { selectIsMigrationAvailable } from 'src/store/v3MigrationSelectors';
import { DASHBOARD, GENERAL } from 'src/utils/events';
import { useShallow } from 'zustand/shallow';

import { HealthFactorNumber } from '../../components/HealthFactorNumber';
import { NoData } from '../../components/primitives/NoData';
import { TopInfoPanel } from '../../components/TopInfoPanel/TopInfoPanel';
import { TopInfoPanelItem } from '../../components/TopInfoPanel/TopInfoPanelItem';
import { useAppDataContext } from '../../hooks/app-data-provider/useAppDataProvider';
import { useEnhancedUserYield } from '../../hooks/useEnhancedUserYield';
import { LiquidationRiskParametresInfoModal } from './LiquidationRiskParametresModal/LiquidationRiskParametresModal';

const DashboardMetricCard = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={(theme) => ({
      width: { xs: 'calc(50% - 12px)', xsm: 'unset' },
      bgcolor: 'background.surface',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: '14px',
      px: { xs: 3, sm: 4 },
      py: { xs: 2.5, sm: 3 },
      ...(theme.palette.mode === 'dark' && {
        boxShadow: '0 0 24px rgba(151,255,56,.12)',
      }),
    })}
  >
    {children}
  </Box>
);

export const DashboardTopPanel = () => {
  const { user, loading } = useAppDataContext();
  const { currentAccount } = useWeb3Context();
  const { netAPY: enhancedNetAPY, hasEnhancedData } = useEnhancedUserYield();
  const [open, setOpen] = useState(false);
  const [trackEvent, currentNetworkConfig, currentMarket, isMigrateToV3Available] = useRootStore(
    useShallow((store) => [
      store.trackEvent,
      store.currentNetworkConfig,
      store.currentMarket,
      selectIsMigrationAvailable(store),
    ])
  );
  const { market } = getMarketInfoById(currentMarket);
  const showMigrateButton = user
    ? isMigrateToV3Available && currentAccount !== '' && Number(user.totalLiquidityUSD) > 0
    : false;
  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));

  const loanToValue =
    user?.totalCollateralMarketReferenceCurrency === '0'
      ? '0'
      : valueToBigNumber(user?.totalBorrowsMarketReferenceCurrency || '0')
          .dividedBy(user?.totalCollateralMarketReferenceCurrency || '1')
          .toFixed();

  const valueTypographyVariant = downToSM ? 'main16' : 'main21';
  const noDataTypographyVariant = downToSM ? 'secondary16' : 'secondary21';

  return (
    <>
      {showMigrateButton && downToSM && (
        <Box sx={{ width: '100%' }}>
          <Link href={ROUTES.migrationTool}>
            <Button
              variant="gradient"
              sx={{
                height: '40px',
                width: '100%',
                borderRadius: '10px',
              }}
            >
              <Typography variant="buttonM">
                <Trans>Migrate to {market.marketTitle} v3 Market</Trans>
              </Typography>
            </Button>
          </Link>
        </Box>
      )}

      <TopInfoPanel
        wrapperSx={{ pb: { xs: 8, md: 9, lg: 10, xl: 10, xxl: 10 } }}
        titleComponent={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PageTitle
              pageTitle={<Trans>Dashboard</Trans>}
              withMarketSwitcher={true}
              bridge={currentNetworkConfig.bridge}
            />
            {showMigrateButton && !downToSM && (
              <Box sx={{ alignSelf: 'center', mb: 4, width: '100%' }}>
                <Link href={ROUTES.marketMigrationTool(currentMarket)}>
                  <Button variant="gradient" sx={{ height: '20px', borderRadius: '10px' }}>
                    <Typography variant="buttonS" data-cy={`migration-button`}>
                      <Trans>Migrate to v3</Trans>
                    </Typography>
                  </Button>
                </Link>
              </Box>
            )}
          </Box>
        }
      >
        <DashboardMetricCard>
          <TopInfoPanelItem
            sx={{ width: '100%' }}
            title={<Trans>Net worth</Trans>}
            loading={loading}
            hideIcon
          >
            {currentAccount ? (
              <FormattedNumber
                value={Number(user?.netWorthUSD || 0)}
                symbol="USD"
                variant={valueTypographyVariant}
                visibleDecimals={2}
                compact
                symbolsColor="primary.main"
                symbolsVariant={noDataTypographyVariant}
              />
            ) : (
              <NoData variant={noDataTypographyVariant} sx={{ opacity: '0.7' }} />
            )}
          </TopInfoPanelItem>
        </DashboardMetricCard>

        <DashboardMetricCard>
          <TopInfoPanelItem
            sx={{ width: '100%' }}
            title={
              <div style={{ display: 'flex' }}>
                <Trans>Net APY</Trans>
                <NetAPYTooltip
                  event={{
                    eventName: GENERAL.TOOL_TIP,
                    eventParams: { tooltip: 'NET APY: Dashboard Banner' },
                  }}
                />
              </div>
            }
            loading={loading}
            hideIcon
          >
            {currentAccount && user && Number(user.netWorthUSD) > 0 ? (
              <FormattedNumber
                value={hasEnhancedData ? enhancedNetAPY : user ? user.netAPY : 0}
                variant={valueTypographyVariant}
                visibleDecimals={2}
                percent
                symbolsColor="primary.main"
                symbolsVariant={noDataTypographyVariant}
              />
            ) : (
              <NoData variant={noDataTypographyVariant} sx={{ opacity: '0.7' }} />
            )}
          </TopInfoPanelItem>
        </DashboardMetricCard>

        {currentAccount && user?.healthFactor !== '-1' && (
          <DashboardMetricCard>
            <TopInfoPanelItem
              sx={{ width: '100%' }}
              title={
                <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                  <Trans>Health factor</Trans>
                </Box>
              }
              loading={loading}
              hideIcon
            >
              <HealthFactorNumber
                value={user?.healthFactor || '-1'}
                variant={valueTypographyVariant}
                onInfoClick={() => {
                  trackEvent(DASHBOARD.VIEW_RISK_DETAILS);
                  setOpen(true);
                }}
              />
            </TopInfoPanelItem>
          </DashboardMetricCard>
        )}
      </TopInfoPanel>
      <LiquidationRiskParametresInfoModal
        open={open}
        setOpen={setOpen}
        healthFactor={user?.healthFactor || '-1'}
        loanToValue={loanToValue}
        currentLoanToValue={user?.currentLoanToValue || '0'}
        currentLiquidationThreshold={user?.currentLiquidationThreshold || '0'}
      />
    </>
  );
};
