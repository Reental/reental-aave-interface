import { ChainId } from '@aave/contract-helpers';
import { Trans } from '@lingui/macro';
import { Box, Button, useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { ROUTES } from 'src/components/primitives/Link';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';
// import { CustomMarket } from 'src/utils/marketsAndNetworksConfig';
import { AUTH } from 'src/utils/mixPanelEvents';

import { BorrowAssetsList } from './lists/BorrowAssetsList/BorrowAssetsList';
import { BorrowedPositionsList } from './lists/BorrowedPositionsList/BorrowedPositionsList';
import { SuppliedPositionsList } from './lists/SuppliedPositionsList/SuppliedPositionsList';
import { SupplyAssetsList } from './lists/SupplyAssetsList/SupplyAssetsList';

interface DashboardContentWrapperProps {
  isBorrow: boolean;
}

export const DashboardContentWrapper = ({ isBorrow }: DashboardContentWrapperProps) => {
  const { breakpoints } = useTheme();
  const { currentAccount } = useWeb3Context();
  const router = useRouter();
  const trackEvent = useRootStore((store) => store.trackEvent);
  // const [currentMarket, setCurrentMarket] = useRootStore((store) => [
  //   store.currentMarket,
  //   store.setCurrentMarket,
  // ]);
  // const currentNetworkConfig = useRootStore((store) => store.currentNetworkConfig);

  const currentMarketData = useRootStore((store) => store.currentMarketData);
  const isDesktop = useMediaQuery(breakpoints.up('lg'));
  const paperWidth = isDesktop ? 'calc(50% - 8px)' : '100%';

  const downToLg = useMediaQuery(breakpoints.down('lg'));

  // const upFromSm = useMediaQuery(breakpoints.up('xsm'));

  // const handleUpdateEthMarket = (market: CustomMarket) => {
  //   setCurrentMarket(market);
  // };

  return (
    <Box>
      {/* {currentAccount && MULTIPLE_MARKET_OPTIONS.includes(currentMarket) && (
        <Box pb={2} sx={{ width: upFromSm ? '320px' : '100%' }}>
          <StyledTxModalToggleGroup
            color="secondary"
            value={currentMarket}
            exclusive
            onChange={(_, value) => handleUpdateEthMarket(value)}
          >
            <StyledTxModalToggleButton
              maxWidth={upFromSm ? '160px' : undefined}
              unselectedBackgroundColor="#383D51"
              value={currentNetworkConfig.isFork ? 'fork_proto_mainnet_v3' : 'proto_mainnet_v3'}
              disabled={
                (currentNetworkConfig.isFork &&
                  currentMarket === ('fork_proto_mainnet_v3' as string)) ||
                (!currentNetworkConfig.isFork && currentMarket === 'proto_mainnet_v3')
              }
              onClick={() =>
                trackEvent(DASHBOARD.SELECT_V3_ETH_MARKET, { market: 'Ethereum Main' })
              }
            >
              <TokenIcon sx={{ mr: 2 }} symbol="eth-round" />

              <Typography variant="buttonM">
                <Trans>Ethereum Main</Trans>
              </Typography>
            </StyledTxModalToggleButton>

            <StyledTxModalToggleButton
              maxWidth={upFromSm ? '160px' : undefined}
              unselectedBackgroundColor="#383D51"
              disabled={
                (currentNetworkConfig.isFork &&
                  currentMarket === ('fork_proto_lido_v3' as string)) ||
                (!currentNetworkConfig.isFork && currentMarket === ('proto_lido_v3' as string))
              }
              value={currentNetworkConfig.isFork ? 'fork_proto_lido_v3' : 'proto_lido_v3'}
              // disabled={currentMarket === 'proto_lido_v3' || 'fork_proto_lido_v3' ? true : false}

              onClick={() => trackEvent(DASHBOARD.SELECT_V3_ETH_MARKET, { market: 'Lido' })}
            >
              <TokenIcon sx={{ mr: 2 }} symbol="ldo" />

              <Typography variant="buttonM">
                <Trans>Lido</Trans>
              </Typography>
            </StyledTxModalToggleButton>
          </StyledTxModalToggleGroup>
        </Box>
      )} */}

      {currentMarketData.chainId === ChainId.polygon && !currentMarketData.v3}
      <Box
        sx={{
          display: isDesktop ? 'flex' : 'block',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box
          sx={{
            position: 'relative',

            display: { xs: isBorrow ? 'none' : 'block', lg: 'block' },
            width: paperWidth,
          }}
        >
          {currentAccount && !isBorrow && downToLg && (
            <Box>
              <Button
                sx={{
                  position: 'absolute',
                  top: '-130px',
                  right: '0px',
                }}
                onClick={() => {
                  router.push(ROUTES.history);
                  trackEvent(AUTH.VIEW_TX_HISTORY);
                }}
                component="a"
                variant="surface"
                size="small"
              >
                <Trans>View Transactions</Trans>
              </Button>
            </Box>
          )}

          <SuppliedPositionsList />
          <SupplyAssetsList />
        </Box>

        <Box
          sx={{
            position: 'relative',

            display: { xs: !isBorrow ? 'none' : 'block', lg: 'block' },
            width: paperWidth,
          }}
        >
          {currentAccount && (
            <Box
              sx={{
                position: 'absolute',

                top: downToLg ? '-130px' : '-90px',

                right: '0px',
              }}
            >
              <Button
                onClick={() => {
                  router.push(ROUTES.history);
                  trackEvent(AUTH.VIEW_TX_HISTORY);
                }}
                component="a"
                variant="surface"
                size="small"
              >
                <Trans>View Transactions</Trans>
              </Button>
            </Box>
          )}

          <BorrowedPositionsList />
          <BorrowAssetsList />
        </Box>
      </Box>
    </Box>
  );
};
