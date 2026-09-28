import { API_ETH_MOCK_ADDRESS } from '@aave/contract-helpers';
import { t, Trans } from '@lingui/macro';
import { Box, Switch, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import { ListSearchBar } from 'src/components/lists/ListSearchBar';
import { ListWrapper } from 'src/components/lists/ListWrapper';
import { NoSearchResults } from 'src/components/NoSearchResults';
import { Link } from 'src/components/primitives/Link';
import { Warning } from 'src/components/primitives/Warning';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import MarketAssetsList from 'src/modules/markets/MarketAssetsList';
import { useRootStore } from 'src/store/root';
import { fetchIconSymbolAndName } from 'src/ui-config/reservePatches';
import { matchesSearchTerm } from 'src/utils/assetSearch';
import { useShallow } from 'zustand/shallow';

import { GENERAL } from '../../utils/events';
import { isAssetHidden } from '../dashboard/lists/constants';

export const MarketAssetsListContainer = () => {
  const { reserves, loading } = useAppDataContext();
  const [trackEvent, currentMarketData, currentNetworkConfig] = useRootStore(
    useShallow((store) => [store.trackEvent, store.currentMarketData, store.currentNetworkConfig])
  );
  const [searchTerm, setSearchTerm] = useState('');

  const { breakpoints } = useTheme();

  const sm = useMediaQuery(breakpoints.down('sm'));

  const filteredData = reserves
    // Filter out any non-active reserves
    .filter((res) => res.isActive)
    // Filter out any hidden assets
    .filter((res) => !isAssetHidden(currentMarketData.market, res.underlyingAsset))
    // filter out any that don't meet search term criteria
    .filter((res) => matchesSearchTerm(searchTerm, res.symbol, res.name, res.underlyingAsset))
    // Transform the object for list to consume it
    .map((reserve) => ({
      ...reserve,
      ...(reserve.isWrappedBaseAsset
        ? fetchIconSymbolAndName({
            symbol: currentNetworkConfig.baseAssetSymbol,
            underlyingAsset: API_ETH_MOCK_ADDRESS.toLowerCase(),
          })
        : {}),
    }));
  // const marketFrozen = !reserves.some((reserve) => !reserve.isFrozen);
  // const showFrozenMarketWarning =
  //   marketFrozen && ['Fantom', 'Ethereum AMM'].includes(currentMarketData.marketTitle);
  const unfrozenReserves = filteredData.filter((r) => !r.isFrozen && !r.isPaused);
  const [showFrozenMarketsToggle, setShowFrozenMarketsToggle] = useState(false);

  const handleChange = () => {
    setShowFrozenMarketsToggle((prevState) => !prevState);
  };

  const frozenOrPausedReserves = filteredData.filter((r) => r.isFrozen || r.isPaused);

  return (
    <ListWrapper
      wrapperSx={{ pt: { xs: '6px', xsm: '6px', sm: 3.5 } }}
      titleComponent={
        <Typography component="div" variant="h2" sx={{ mr: 4 }}>
          <Trans>Assets</Trans>
        </Typography>
      }
    >
      <ListSearchBar
        onSearchTermChange={setSearchTerm}
        placeholder={sm ? t`Search asset` : t`Search asset name, symbol, or address`}
        wrapperSx={{ pt: 2 }}
      />
      {/* Unfrozen assets list */}
      <MarketAssetsList reserves={unfrozenReserves} loading={loading} />

      {/* Frozen or paused assets list */}
      {frozenOrPausedReserves.length > 0 && (
        <Box sx={{ mt: 10, px: { xs: 4, xsm: 6 } }}>
          <Typography variant="h4" mb={4}>
            <Trans>Show Frozen or paused assets</Trans>

            <Switch
              checked={showFrozenMarketsToggle}
              onChange={handleChange}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Typography>
          {showFrozenMarketsToggle && (
            <Warning severity="info">
              <Trans>
                These assets are temporarily frozen or paused by Aave community decisions, meaning
                that further supply / borrow, or rate swap of these assets are unavailable.
                Withdrawals and debt repayments are allowed. Follow the{' '}
                <Link
                  onClick={() => {
                    trackEvent(GENERAL.EXTERNAL_LINK, {
                      link: 'Frozen Market Markets Page',
                      frozenMarket: currentNetworkConfig.name,
                    });
                  }}
                  href="https://governance.aave.com"
                  underline="always"
                >
                  Aave governance forum
                </Link>{' '}
                for further updates.
              </Trans>
            </Warning>
          )}
        </Box>
      )}
      {showFrozenMarketsToggle && (
        <MarketAssetsList reserves={frozenOrPausedReserves} loading={loading} />
      )}

      {/* Show no search results message if nothing hits in either list */}
      {!loading && filteredData.length === 0 && (
        <NoSearchResults
          searchTerm={searchTerm}
          subtitle={
            <Trans>
              We couldn&apos;t find any assets related to your search. Try again with a different
              asset name, symbol, or address.
            </Trans>
          }
        />
      )}
    </ListWrapper>
  );
};
