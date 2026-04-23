import { valueToBigNumber } from '@aave/math-utils';
import { InformationCircleIcon } from '@heroicons/react/outline';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Box,
  ButtonBase,
  CircularProgress,
  Collapse,
  Paper,
  Skeleton,
  SvgIcon,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ParentSize } from '@visx/responsive';
import { ReactNode, useMemo, useState } from 'react';
import { PopperComponent } from 'src/components/ContentWithTooltip';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { HISTORICAL_MARKET_CHAIN_IDS } from 'src/libs/reental/aave/history';
import { GraphLegend } from 'src/modules/reserve-overview/graphs/GraphLegend';
import { useRootStore } from 'src/store/root';
import { useShallow } from 'zustand/shallow';

import { isAssetHidden } from '../dashboard/lists/constants';
import {
  buildMarketHistoryPoints,
  CHART_HEIGHT,
  getVisibleMarketReserves,
  seriesColors,
} from './marketHistory.utils';
import { MarketHistoryRange } from './marketHistoryRanges';
import {
  MarketHistorySeriesDefinition,
  MarketsHistoryGraph,
  PlaceholderChart,
} from './MarketsHistoryGraph';
import { MarketsHistoryRangeSelector } from './MarketsHistoryRangeSelector';
import { useMarketHistory } from './useMarketHistory';

type StatProps = {
  label: ReactNode;
  tooltip: ReactNode;
  value: string;
  loading: boolean;
  valueVariant: 'main16' | 'main21';
  symbolVariant: 'secondary16' | 'secondary21';
  labelVariant: 'caption' | 'description';
};

const Stat = ({
  label,
  tooltip,
  value,
  loading,
  valueVariant,
  symbolVariant,
  labelVariant,
}: StatProps) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      minWidth: { xs: '45%', xsm: 160 },
      flex: { xsm: 1 },
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant={labelVariant} color="text.secondary">
        {label}
      </Typography>
      <Tooltip
        arrow
        placement="top"
        PopperComponent={PopperComponent}
        title={
          <Box
            sx={{
              py: 4,
              px: 6,
              fontSize: '12px',
              lineHeight: '16px',
            }}
          >
            {tooltip}
          </Box>
        }
      >
        <SvgIcon
          sx={{
            fontSize: 14,
            ml: 0.5,
            color: 'text.muted',
            cursor: 'pointer',
            '&:hover': { color: 'info.main' },
          }}
        >
          <InformationCircleIcon />
        </SvgIcon>
      </Tooltip>
    </Box>
    {loading ? (
      <Skeleton width={120} height={28} />
    ) : (
      <FormattedNumber
        value={value}
        symbol="USD"
        variant={valueVariant}
        symbolsVariant={symbolVariant}
        visibleDecimals={2}
        compact
        symbolsColor="text.secondary"
      />
    )}
  </Box>
);

export const MarketsTopPanel = () => {
  const { i18n } = useLingui();
  const { reserves, loading } = useAppDataContext();
  const currentMarketData = useRootStore(useShallow((store) => store.currentMarketData));
  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));
  const [expanded, setExpanded] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<MarketHistoryRange>('all');

  const { totalSupplied, totalBorrowed, tvl } = useMemo(() => {
    const initial = {
      totalSupplied: valueToBigNumber(0),
      totalBorrowed: valueToBigNumber(0),
      tvl: valueToBigNumber(0),
    };

    return reserves
      .filter((r) => r.isActive && !isAssetHidden(currentMarketData.market, r.underlyingAsset))
      .reduce((acc, r) => {
        const supplied = valueToBigNumber(r.totalLiquidityUSD || 0);
        const borrowed = valueToBigNumber(r.totalDebtUSD || 0);
        return {
          totalSupplied: acc.totalSupplied.plus(supplied),
          totalBorrowed: acc.totalBorrowed.plus(borrowed),
          tvl: acc.tvl.plus(supplied.minus(borrowed)),
        };
      }, initial);
  }, [reserves, currentMarketData.market]);
  const visibleReserves = useMemo(
    () => getVisibleMarketReserves(reserves, currentMarketData.market),
    [currentMarketData.market, reserves]
  );
  const underlyingAssets = useMemo(
    () => visibleReserves.map((reserve) => reserve.underlyingAsset.toLowerCase()),
    [visibleReserves]
  );
  const historyQuery = useMarketHistory({
    chainId: currentMarketData.chainId,
    underlyingAssets,
    timeRange: selectedTimeRange,
    enabled: expanded,
  });
  const chartData = useMemo(
    () =>
      buildMarketHistoryPoints({
        reserves: visibleReserves,
        historyItems: historyQuery.data ?? [],
        timeRange: selectedTimeRange,
      }),
    [historyQuery.data, selectedTimeRange, visibleReserves]
  );
  const series = useMemo<MarketHistorySeriesDefinition[]>(
    () => [
      {
        key: 'totalSupplied',
        label: i18n._(t`Total market size`),
        color: seriesColors.totalSupplied,
      },
      {
        key: 'tvl',
        label: i18n._(t`Total value locked`),
        color: seriesColors.tvl,
      },
      {
        key: 'totalBorrowed',
        label: i18n._(t`Total borrowed`),
        color: seriesColors.totalBorrowed,
      },
    ],
    [i18n]
  );

  const valueVariant = downToSM ? 'main16' : 'main21';
  const symbolVariant = downToSM ? 'secondary16' : 'secondary21';
  const labelVariant = downToSM ? 'caption' : 'description';
  const historyLoading = historyQuery.isLoading || historyQuery.isFetching;
  const unsupportedChain = !HISTORICAL_MARKET_CHAIN_IDS.includes(currentMarketData.chainId);

  return (
    <Paper
      sx={{
        mb: 4,
        border: 1,
        borderColor: 'divider',
        mx: { xs: '1.6px', xsm: '1.6px', sm: 0 },
        px: { xs: 4, xsm: 6 },
        py: { xs: 3, xsm: 4 },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: { xs: 3, xsm: 6 },
          alignItems: 'center',
        }}
      >
        <Stat
          label={<Trans>Total market size</Trans>}
          tooltip={
            <Trans>
              The total value of all assets supplied to the protocol across every reserve. It
              represents the overall size of the market and includes both the liquidity currently
              available in the pool and the portion that has been borrowed.
            </Trans>
          }
          value={totalSupplied.toString()}
          loading={loading}
          valueVariant={valueVariant}
          symbolVariant={symbolVariant}
          labelVariant={labelVariant}
        />
        <Stat
          label={<Trans>Total value locked</Trans>}
          tooltip={
            <Trans>
              The amount of capital currently locked in the protocol, calculated as the total
              supplied minus the total borrowed. It reflects the liquidity that is actually
              available in the pool at this moment.
            </Trans>
          }
          value={tvl.toString()}
          loading={loading}
          valueVariant={valueVariant}
          symbolVariant={symbolVariant}
          labelVariant={labelVariant}
        />
        <Stat
          label={<Trans>Total borrowed</Trans>}
          tooltip={
            <Trans>
              The total outstanding debt across all reserves, i.e. the sum of all assets that users
              have borrowed from the protocol and have not yet repaid.
            </Trans>
          }
          value={totalBorrowed.toString()}
          loading={loading}
          valueVariant={valueVariant}
          symbolVariant={symbolVariant}
          labelVariant={labelVariant}
        />
      </Box>

      <Box
        sx={{
          mt: 3,
        }}
      >
        <Box
          sx={{
            mx: { xs: -4, xsm: -6 },
            borderTop: (themeValue) => `1px solid ${themeValue.palette.divider}`,
          }}
        />
        <ButtonBase
          onClick={() => setExpanded((prev) => !prev)}
          disableRipple
          sx={{
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'text.secondary',
            borderRadius: 1,
            pt: 3,
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}
        >
          <Typography variant="description">
            {expanded ? <Trans>Hide metrics</Trans> : <Trans>Show metrics</Trans>}
          </Typography>
          <ExpandMoreIcon
            sx={{
              fontSize: 20,
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          />
        </ButtonBase>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 4 }}>
            {unsupportedChain ? (
              <Box
                sx={{
                  height: CHART_HEIGHT,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="subheader1" color="text.secondary">
                  <Trans>Historical data is not available for this market.</Trans>
                </Typography>
              </Box>
            ) : (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    justifyContent: 'space-between',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 3,
                    mb: 4,
                  }}
                >
                  <GraphLegend
                    labels={series.map((item) => ({ text: item.label, color: item.color }))}
                  />
                  <MarketsHistoryRangeSelector
                    disabled={historyLoading}
                    timeRange={selectedTimeRange}
                    onTimeRangeChanged={setSelectedTimeRange}
                  />
                </Box>

                {historyLoading ? (
                  <Box
                    sx={{
                      height: CHART_HEIGHT,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CircularProgress size={20} sx={{ mb: 2, opacity: 0.5 }} />
                    <Typography variant="subheader1" color="text.muted">
                      <Trans>Loading data...</Trans>
                    </Typography>
                  </Box>
                ) : historyQuery.isError ? (
                  <Box
                    sx={{
                      height: CHART_HEIGHT,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="subheader1">
                      <Trans>Something went wrong</Trans>
                    </Typography>
                    <Typography variant="caption" sx={{ mb: 3 }}>
                      <Trans>Data couldn&apos;t be loaded.</Trans>
                    </Typography>
                  </Box>
                ) : (
                  <ParentSize>
                    {({ width }) =>
                      chartData.length > 0 ? (
                        <MarketsHistoryGraph
                          width={width}
                          height={CHART_HEIGHT}
                          data={chartData}
                          selectedTimeRange={selectedTimeRange}
                          series={series}
                        />
                      ) : (
                        <PlaceholderChart height={CHART_HEIGHT} width={width} />
                      )
                    }
                  </ParentSize>
                )}
              </>
            )}
          </Box>
        </Collapse>
      </Box>
    </Paper>
  );
};
