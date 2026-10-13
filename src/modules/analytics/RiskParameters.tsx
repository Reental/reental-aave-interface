import { Trans } from '@lingui/macro';
import { Box, Button, Collapse, Paper, Skeleton, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { TextWithTooltip } from 'src/components/TextWithTooltip';
import {
  ComputedReserveData,
  useAppDataContext,
} from 'src/hooks/app-data-provider/useAppDataProvider';

/**
 * The parameters that decide when a position becomes liquidatable, and what it costs.
 *
 * Reserves are grouped by identical parameter sets rather than listed one per row: the
 * Polygon market runs 101 RWA reserves on the same numbers, and a hundred identical rows
 * would bury the handful that differ.
 */

type Group = {
  key: string;
  ltv: string;
  threshold: string;
  bonus: string;
  reserveFactor: string;
  borrowable: boolean;
  symbols: string[];
};

const groupReserves = (reserves: ComputedReserveData[], collateral: boolean): Group[] => {
  const groups = new Map<string, Group>();

  for (const reserve of reserves) {
    const isCollateral = Number(reserve.formattedBaseLTVasCollateral) > 0;
    if (isCollateral !== collateral) continue;

    const key = [
      reserve.formattedBaseLTVasCollateral,
      reserve.formattedReserveLiquidationThreshold,
      reserve.formattedReserveLiquidationBonus,
      reserve.reserveFactor,
      reserve.borrowingEnabled,
    ].join('|');

    const existing = groups.get(key);
    if (existing) {
      existing.symbols.push(reserve.symbol);
      continue;
    }

    groups.set(key, {
      key,
      ltv: reserve.formattedBaseLTVasCollateral,
      threshold: reserve.formattedReserveLiquidationThreshold,
      bonus: reserve.formattedReserveLiquidationBonus,
      reserveFactor: reserve.reserveFactor,
      borrowable: reserve.borrowingEnabled,
      symbols: [reserve.symbol],
    });
  }

  return [...groups.values()].sort((a, b) => b.symbols.length - a.symbols.length);
};

const Param = ({
  label,
  value,
  tooltip,
}: {
  label: React.ReactNode;
  value: string;
  tooltip: React.ReactNode;
}) => (
  <Box sx={{ minWidth: 108 }}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant="secondary12" color="text.secondary">
        {label}
      </Typography>
      <TextWithTooltip iconSize={12}>
        <Typography variant="caption">{tooltip}</Typography>
      </TextWithTooltip>
    </Box>
    <FormattedNumber value={value} percent variant="secondary14" color="text.primary" />
  </Box>
);

const GroupRow = ({ group }: { group: Group }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box sx={{ py: 3, borderTop: 1, borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'flex-start' }}>
        {Number(group.ltv) > 0 && (
          <>
            <Param
              label={<Trans>Max LTV</Trans>}
              value={group.ltv}
              tooltip={
                <Trans>
                  The most you can borrow against this collateral when opening a position.
                </Trans>
              }
            />
            <Param
              label={<Trans>Liquidation threshold</Trans>}
              value={group.threshold}
              tooltip={
                <Trans>
                  The point at which the position can be liquidated. Health factor is this
                  percentage of your collateral divided by your debt — which is why a position can
                  hold more collateral than debt and still fall below 1.
                </Trans>
              }
            />
            <Param
              label={<Trans>Liquidation penalty</Trans>}
              value={group.bonus}
              tooltip={
                <Trans>
                  Extra collateral the liquidator seizes on top of the debt they repay. It is the
                  borrower&apos;s cost of being liquidated.
                </Trans>
              }
            />
          </>
        )}
        <Param
          label={<Trans>Reserve factor</Trans>}
          value={group.reserveFactor}
          tooltip={
            <Trans>Share of the interest paid by borrowers that goes to the treasury.</Trans>
          }
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, flexWrap: 'wrap' }}>
        <Typography variant="secondary12" color="text.secondary">
          {group.symbols.length === 1 ? (
            <Trans>1 asset</Trans>
          ) : (
            <Trans>{group.symbols.length} assets</Trans>
          )}
        </Typography>
        <Button size="small" variant="text" onClick={() => setExpanded(!expanded)} sx={{ p: 0 }}>
          {expanded ? <Trans>Hide</Trans> : <Trans>Show assets</Trans>}
        </Button>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
          {group.symbols.map((symbol) => (
            <Typography
              key={symbol}
              variant="secondary12"
              sx={{ px: 1.5, py: 0.5, borderRadius: '4px', bgcolor: 'background.surface' }}
            >
              {symbol}
            </Typography>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

export const RiskParameters = () => {
  const { reserves, loading } = useAppDataContext();

  const collateralGroups = useMemo(() => groupReserves(reserves, true), [reserves]);
  const debtGroups = useMemo(() => groupReserves(reserves, false), [reserves]);

  if (loading) {
    return (
      <Paper sx={{ p: 4, mt: 4, border: 1, borderColor: 'divider' }}>
        <Skeleton height={32} width={220} />
        <Skeleton height={90} />
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 4, mt: 4, border: 1, borderColor: 'divider' }}>
      <Typography variant="h3">
        <Trans>Risk parameters</Trans>
      </Typography>
      <Typography variant="description" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        <Trans>
          Health factor = (collateral × liquidation threshold) ÷ debt. A position is liquidatable
          once it falls below 1.
        </Trans>
      </Typography>

      {!!collateralGroups.length && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subheader2" color="text.secondary">
            <Trans>Collateral assets</Trans>
          </Typography>
          {collateralGroups.map((group) => (
            <GroupRow key={group.key} group={group} />
          ))}
        </Box>
      )}

      {!!debtGroups.length && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subheader2" color="text.secondary">
            <Trans>Borrowable assets</Trans>
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            <Trans>Debt-only: these cannot be used as collateral, so they have no threshold.</Trans>
          </Typography>
          {debtGroups.map((group) => (
            <GroupRow key={group.key} group={group} />
          ))}
        </Box>
      )}
    </Paper>
  );
};
