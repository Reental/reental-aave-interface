import { Trans } from '@lingui/macro';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { Group } from '@visx/group';
import { ParentSize } from '@visx/responsive';
import { scaleBand, scaleLinear } from '@visx/scale';
import { Bar } from '@visx/shape';
import { useMemo } from 'react';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';

import { ProtocolPosition, UNBOUNDED_HEALTH_FACTOR } from './useProtocolPositions';

/**
 * Debt distributed across health-factor bands — the protocol's liquidation map.
 *
 * Bars are denominated in debt rather than position count: ten dust positions at HF 1.01
 * matter far less than one large one, and a count-based chart hides exactly that.
 */

type Bucket = {
  label: string;
  /** Inclusive lower bound; the last bucket is unbounded. */
  from: number;
  to: number;
  danger: boolean;
};

const BUCKETS: Bucket[] = [
  { label: '< 1.0', from: 0, to: 1, danger: true },
  { label: '1.0 – 1.1', from: 1, to: 1.1, danger: true },
  { label: '1.1 – 1.25', from: 1.1, to: 1.25, danger: false },
  { label: '1.25 – 1.5', from: 1.25, to: 1.5, danger: false },
  { label: '1.5 – 2.0', from: 1.5, to: 2, danger: false },
  { label: '2.0+', from: 2, to: Infinity, danger: false },
];

const MARGIN = { top: 16, right: 16, bottom: 40, left: 64 };

export const HealthFactorDistribution = ({ positions }: { positions: ProtocolPosition[] }) => {
  const theme = useTheme();

  const data = useMemo(
    () =>
      BUCKETS.map((bucket) => {
        const inBucket = positions.filter((position) => {
          // An unbounded health factor carries no liquidation risk, so it belongs in the
          // safest band rather than being dropped from the totals.
          const healthFactor =
            position.healthFactor === UNBOUNDED_HEALTH_FACTOR ? Infinity : position.healthFactor;
          return healthFactor >= bucket.from && healthFactor < bucket.to;
        });

        return {
          ...bucket,
          debtUSD: inBucket.reduce((sum, position) => sum + position.totalBorrowsUSD, 0),
          count: inBucket.length,
        };
      }),
    [positions]
  );

  const maxDebt = Math.max(...data.map((bucket) => bucket.debtUSD), 0);

  if (!positions.length) {
    return (
      <Paper sx={{ p: 4, border: 1, borderColor: 'divider' }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          <Trans>Liquidation map</Trans>
        </Typography>
        <Typography color="text.secondary">
          <Trans>No borrow positions in this market yet</Trans>
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 4, border: 1, borderColor: 'divider' }}>
      <Typography variant="h3">
        <Trans>Liquidation map</Trans>
      </Typography>
      <Typography variant="description" color="text.secondary" sx={{ mb: 3, display: 'block' }}>
        <Trans>Borrowed value by health factor. Anything below 1.0 can be liquidated now.</Trans>
      </Typography>

      <Box sx={{ height: 260 }}>
        <ParentSize>
          {({ width, height }) => {
            if (width < 10) return null;

            const innerWidth = Math.max(width - MARGIN.left - MARGIN.right, 0);
            const innerHeight = Math.max(height - MARGIN.top - MARGIN.bottom, 0);

            const xScale = scaleBand<string>({
              domain: data.map((bucket) => bucket.label),
              range: [0, innerWidth],
              padding: 0.3,
            });

            const yScale = scaleLinear<number>({
              // A flat zero domain would collapse the axis; keep a nominal top.
              domain: [0, maxDebt || 1],
              range: [innerHeight, 0],
              nice: true,
            });

            return (
              <svg width={width} height={height}>
                <Group left={MARGIN.left} top={MARGIN.top}>
                  {data.map((bucket) => {
                    const barHeight = innerHeight - (yScale(bucket.debtUSD) ?? 0);
                    return (
                      <Bar
                        key={bucket.label}
                        x={xScale(bucket.label)}
                        y={yScale(bucket.debtUSD)}
                        width={xScale.bandwidth()}
                        height={Math.max(barHeight, 0)}
                        rx={4}
                        fill={bucket.danger ? theme.palette.error.main : theme.palette.primary.main}
                      >
                        <title>
                          {`${bucket.label}: $${Math.round(
                            bucket.debtUSD
                          ).toLocaleString()} across ${bucket.count} position(s)`}
                        </title>
                      </Bar>
                    );
                  })}
                  <AxisLeft
                    scale={yScale}
                    numTicks={4}
                    stroke={theme.palette.divider}
                    tickStroke={theme.palette.divider}
                    tickFormat={(value) => `$${Number(value).toLocaleString()}`}
                    tickLabelProps={() => ({
                      fill: theme.palette.text.secondary,
                      fontSize: 10,
                      textAnchor: 'end',
                      dx: -4,
                      dy: 3,
                    })}
                  />
                  <AxisBottom
                    top={innerHeight}
                    scale={xScale}
                    stroke={theme.palette.divider}
                    tickStroke={theme.palette.divider}
                    tickLabelProps={() => ({
                      fill: theme.palette.text.secondary,
                      fontSize: 10,
                      textAnchor: 'middle',
                    })}
                  />
                </Group>
              </svg>
            );
          }}
        </ParentSize>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 2 }}>
        {data.map((bucket) => (
          <Box key={bucket.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '2px',
                bgcolor: bucket.danger ? 'error.main' : 'primary.main',
              }}
            />
            <Typography variant="secondary12" color="text.secondary">
              {bucket.label}
            </Typography>
            <FormattedNumber value={bucket.debtUSD} symbol="USD" variant="secondary12" compact />
          </Box>
        ))}
      </Box>
    </Paper>
  );
};
