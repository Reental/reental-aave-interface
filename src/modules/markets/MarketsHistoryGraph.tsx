import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { curveMonotoneX } from '@visx/curve';
import { localPoint } from '@visx/event';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleLinear, scaleTime } from '@visx/scale';
import { Bar, Line, LinePath } from '@visx/shape';
import { defaultStyles, TooltipWithBounds, withTooltip } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { bisector, extent, max } from 'd3-array';
import { timeFormat } from 'd3-time-format';
import { Fragment, useCallback, useMemo } from 'react';
import { compactNumber } from 'src/components/primitives/FormattedNumber';
import { MarketHistoryPoint } from 'src/modules/markets/marketHistory.utils';
import { MarketHistoryRange } from 'src/modules/markets/marketHistoryRanges';
import { PlaceholderChart } from 'src/modules/reserve-overview/graphs/ApyGraph';

export type MarketHistorySeriesKey = keyof Omit<MarketHistoryPoint, 'date'>;

export type MarketHistorySeriesDefinition = {
  key: MarketHistorySeriesKey;
  label: string;
  color: string;
};

type MarketsHistoryGraphProps = {
  width: number;
  height: number;
  data: MarketHistoryPoint[];
  selectedTimeRange: MarketHistoryRange;
  series: MarketHistorySeriesDefinition[];
};

const formatDate = (date: Date, timeRange: MarketHistoryRange) => {
  if (timeRange === '1w') {
    const formatted = timeFormat('%b %d, %H:%M UTC%Z');
    const value = formatted(date);
    const offsetSign = value.toString().split('UTC')[1].split('')[0];
    const time = value.toString().split(offsetSign);
    const hours = time[1].split('').slice(0, 2).join('');
    const mins = time[1].split('').slice(2, 4).join('');
    return `${time[0]}${offsetSign}${hours}:${mins}`;
  }

  return timeFormat('%b %d, %Y')(date);
};

const getDate = (d: MarketHistoryPoint) => new Date(d.date);
const bisectDate = bisector<MarketHistoryPoint, Date>((d) => new Date(d.date)).left;
const getValue = (d: MarketHistoryPoint, fieldName: MarketHistorySeriesKey) => d[fieldName];

const formatCompactUsd = (value: number) => {
  if (value === 0) return '$0';
  const { prefix, postfix } = compactNumber({ value, visibleDecimals: 2 });
  return `$${prefix}${postfix}`;
};

const formatTooltipUsd = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
    minimumFractionDigits: value === 0 ? 0 : 2,
  }).format(value);

export const MarketsHistoryGraph = withTooltip<MarketsHistoryGraphProps, MarketHistoryPoint>(
  ({
    width,
    height,
    data,
    selectedTimeRange,
    series,
    margin = { top: 20, right: 10, bottom: 20, left: 52 },
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipLeft = 0,
  }: MarketsHistoryGraphProps &
    WithTooltipProvidedProps<MarketHistoryPoint> & {
      margin?: { top: number; right: number; bottom: number; left: number };
    }) => {
    if (width < 10) return null;

    const theme = useTheme();
    const isXsm = useMediaQuery(theme.breakpoints.down('xsm'));
    const accentColorDark = theme.palette.mode === 'light' ? '#1F29371F' : '#a5a8b647';
    const tooltipStyles = {
      ...defaultStyles,
      padding: '8px 12px',
      boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.2), 0px 2px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '4px',
      fontSize: '12px',
      lineHeight: '16px',
      letterSpacing: '0.15px',
      background: theme.palette.mode === 'light' ? '#fff' : theme.palette.background.default,
    };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const xAxisNumTicks = selectedTimeRange === '1w' || selectedTimeRange === '1m' || isXsm ? 3 : 4;

    const dateScale = useMemo(
      () =>
        scaleTime({
          range: [0, innerWidth],
          domain: extent(data, getDate) as [Date, Date],
        }),
      [data, innerWidth]
    );

    const yValueScale = useMemo(() => {
      const valueMax =
        max(data, (d) => Math.max(...series.map((serie) => getValue(d, serie.key)))) || 0;

      return scaleLinear({
        range: [innerHeight, 0],
        domain: [0, valueMax * 1.1],
        nice: true,
      });
    }, [data, innerHeight, series]);

    const handleTooltip = useCallback(
      (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
        const { x: xPoint } = localPoint(event) || { x: 0 };
        const x = xPoint - margin.left;
        const x0 = dateScale.invert(x);
        const index = bisectDate(data, x0, 1);
        const d0 = data[index - 1];
        const d1 = data[index];
        let d = d0;

        if (d1 && d0 && getDate(d1)) {
          d = x0.valueOf() - getDate(d0).valueOf() > getDate(d1).valueOf() - x0.valueOf() ? d1 : d0;
        }

        if (!d) return;

        showTooltip({
          tooltipData: d,
          tooltipLeft: dateScale(getDate(d)) ?? x,
        });
      },
      [data, dateScale, margin.left, showTooltip]
    );

    return (
      <>
        <svg width={width} height={height}>
          <Group left={margin.left} top={margin.top}>
            <GridRows
              scale={yValueScale}
              width={innerWidth}
              strokeDasharray="3,3"
              stroke={theme.palette.divider}
              pointerEvents="none"
              numTicks={3}
            />

            {series.map((serie) => (
              <LinePath
                key={serie.key}
                data={data}
                stroke={serie.color}
                strokeWidth={2}
                x={(d) => dateScale(getDate(d)) ?? 0}
                y={(d) => yValueScale(getValue(d, serie.key)) ?? 0}
                curve={curveMonotoneX}
              />
            ))}

            <AxisBottom
              top={innerHeight - margin.bottom / 4}
              scale={dateScale}
              strokeWidth={0}
              numTicks={xAxisNumTicks}
              tickStroke={theme.palette.text.secondary}
              tickLabelProps={() => ({
                fill: theme.palette.text.muted,
                fontSize: 10,
                textAnchor: 'middle',
                dy: 4,
              })}
            />

            <AxisLeft
              left={0}
              scale={yValueScale}
              strokeWidth={0}
              numTicks={3}
              tickFormat={(value) => formatCompactUsd(Number(value))}
              tickLabelProps={() => ({
                fill: theme.palette.text.muted,
                fontSize: 10,
                dx: -margin.left + 10,
              })}
            />

            <Bar
              width={innerWidth}
              height={innerHeight}
              fill="transparent"
              onTouchStart={handleTooltip}
              onTouchMove={handleTooltip}
              onMouseMove={handleTooltip}
              onMouseLeave={() => hideTooltip()}
            />

            {tooltipData && (
              <g>
                <Line
                  from={{ x: tooltipLeft, y: margin.top }}
                  to={{ x: tooltipLeft, y: innerHeight }}
                  stroke={accentColorDark}
                  strokeWidth={1}
                  pointerEvents="none"
                  strokeDasharray="5,2"
                />
                {series.map((serie) => (
                  <Fragment key={serie.key}>
                    <circle
                      cx={tooltipLeft}
                      cy={yValueScale(getValue(tooltipData, serie.key)) + 1}
                      r={4}
                      fillOpacity={0.1}
                      strokeOpacity={0.1}
                      strokeWidth={2}
                      pointerEvents="none"
                    />
                    <circle
                      cx={tooltipLeft}
                      cy={yValueScale(getValue(tooltipData, serie.key))}
                      r={4}
                      fill={serie.color}
                      stroke="white"
                      strokeWidth={2}
                      pointerEvents="none"
                    />
                  </Fragment>
                ))}
              </g>
            )}
          </Group>
        </svg>

        {tooltipData && (
          <TooltipWithBounds top={20} left={tooltipLeft + 40} style={tooltipStyles}>
            <Typography
              variant="secondary12"
              color="text.secondary"
              sx={{ mb: 2, mr: 2, fontWeight: 400 }}
            >
              {formatDate(getDate(tooltipData), selectedTimeRange)}
            </Typography>
            {series.map((serie) => (
              <Box
                key={serie.key}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 1, '&:last-child': { mb: 0 } }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ mr: 4 }}>
                  {serie.label}
                </Typography>
                <Typography variant="main12" color="text.primary">
                  {formatTooltipUsd(getValue(tooltipData, serie.key))}
                </Typography>
              </Box>
            ))}
          </TooltipWithBounds>
        )}
      </>
    );
  }
);

export { PlaceholderChart };
