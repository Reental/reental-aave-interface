import { t, Trans } from '@lingui/macro';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  createFilterOptions,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { ListColumn } from 'src/components/lists/ListColumn';
import { ListHeaderTitle } from 'src/components/lists/ListHeaderTitle';
import { ListHeaderWrapper } from 'src/components/lists/ListHeaderWrapper';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Link, ROUTES } from 'src/components/primitives/Link';
import { TokenIcon } from 'src/components/primitives/TokenIcon';
import { Warning } from 'src/components/primitives/Warning';
import { TextWithTooltip } from 'src/components/TextWithTooltip';
import {
  ComputedReserveData,
  useAppDataContext,
} from 'src/hooks/app-data-provider/useAppDataProvider';

import { BackstopDiagnostics } from './BackstopDiagnostics';
import { LiquidationsExecuteModal } from './LiquidationsExecuteModal';
import { useBackstopLiquidity } from './useBackstopLiquidity';
import { useExecuteLiquidations } from './useExecuteLiquidations';
import {
  LiquidatablePosition,
  maxLiquidatableFactor,
  useLiquidatablePositions,
} from './useLiquidatablePositions';

// Search the pair selector by symbol or token name (property tokens are easier to find by name)
const filterReserveOptions = createFilterOptions<ComputedReserveData>({
  stringify: (option) => `${option.symbol} ${option.name}`,
});

/**
 * Of the collateral's liquidation bonus, the liquidity provider keeps this share and the
 * protocol takes the rest. Used only to simulate a provider's take in the empty-state preview.
 */
const PROVIDER_BONUS_SHARE = 0.9;

interface LiquidationsMatchingBookProps {
  reserve: ComputedReserveData;
}

/** A chunk of one backstop position assigned to fund (part of) a liquidation */
export interface BackstopSlice {
  owner: string;
  amountUSD: number;
}

export interface BookRow {
  position: LiquidatablePosition;
  debtAmount: number;
  debtUSD: number;
  collateralAmount: number;
  collateralUSD: number;
  /** 1 when HF < 0.95, 0.5 otherwise (close factor) */
  factor: number;
  /** USD repayable now: close factor and collateral value caps applied */
  demandUSD: number;
  /** USD actually funded by the assigned backstop slices */
  matchableUSD: number;
  /** Backstop positions used to fund this liquidation, in fill order */
  slices: BackstopSlice[];
  /** 'total' when the backstop fully covers demand, 'partial' otherwise */
  coverage: 'total' | 'partial' | 'none';
  executable: boolean;
}

/**
 * The liquidations matching book for a (debt token, collateral token) pair.
 * On a borrowable reserve the debt side is fixed and the collateral is selectable;
 * on a collateral reserve it is the other way around.
 */
export const LiquidationsMatchingBook = ({ reserve }: LiquidationsMatchingBookProps) => {
  const { reserves } = useAppDataContext();
  const positions = useLiquidatablePositions();
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [executeRows, setExecuteRows] = useState<BookRow[] | null>(null);

  const isDebtSide = reserve.borrowingEnabled;

  const otherSideOptions = useMemo(
    () =>
      isDebtSide
        ? reserves.filter(
            (r) => !r.isFrozen && !r.isPaused && r.reserveLiquidationThreshold !== '0'
          )
        : reserves.filter((r) => r.borrowingEnabled),
    [reserves, isDebtSide]
  );

  const [otherAsset, setOtherAsset] = useState(otherSideOptions[0]?.underlyingAsset ?? '');
  const selectedOther = otherSideOptions.find((r) => r.underlyingAsset === otherAsset);

  const debtReserve = isDebtSide ? reserve : selectedOther;
  const collateralReserve = isDebtSide ? selectedOther : reserve;

  const { positions: backstopPositions, quoteError } = useBackstopLiquidity({
    debtReserve,
    collateralReserve,
  });

  const { execute, statuses: executionStatuses, error: executionError } = useExecuteLiquidations();

  const rows: BookRow[] = useMemo(() => {
    if (!debtReserve || !collateralReserve) return [];
    const liquidationBonus = Number(collateralReserve.formattedReserveLiquidationBonus) || 0;

    const candidates = positions
      .flatMap((position) => {
        const debtEntry = position.debt.find(
          (d) => d.underlyingAsset === debtReserve.underlyingAsset
        );
        const collateralEntry = position.collateral.find(
          (c) => c.underlyingAsset === collateralReserve.underlyingAsset
        );
        if (!debtEntry || !collateralEntry) return [];

        const executable = position.healthFactor < 1;
        const factor = maxLiquidatableFactor(position.healthFactor);
        // Repaying X USD seizes X * (1 + bonus) USD of collateral, capped by what the position holds
        const collateralCapUSD = collateralEntry.amountUSD / (1 + liquidationBonus);
        const demandUSD = executable ? Math.min(debtEntry.amountUSD * factor, collateralCapUSD) : 0;

        return [{ position, debtEntry, collateralEntry, factor, demandUSD, executable }];
      })
      .sort((a, b) => a.position.healthFactor - b.position.healthFactor);

    // Fill algorithm: lowest HF first; each liquidation drains backstop positions starting
    // from the largest remaining volume, splitting across positions when one is not enough.
    const backstopPool = backstopPositions.map((position) => ({
      ...position,
      remainingUSD: position.availableUSD,
    }));

    return candidates.map(
      ({ position, debtEntry, collateralEntry, factor, demandUSD, executable }) => {
        const slices: BackstopSlice[] = [];
        let pending = demandUSD;

        while (pending > 0.01) {
          const source = backstopPool
            .filter((p) => p.remainingUSD > 0.01)
            .sort((a, b) => b.remainingUSD - a.remainingUSD)[0];
          if (!source) break;
          const take = Math.min(source.remainingUSD, pending);
          slices.push({ owner: source.owner, amountUSD: take });
          source.remainingUSD -= take;
          pending -= take;
        }

        const matchableUSD = slices.reduce((acc, s) => acc + s.amountUSD, 0);

        return {
          position,
          debtAmount: debtEntry.amount,
          debtUSD: debtEntry.amountUSD,
          collateralAmount: collateralEntry.amount,
          collateralUSD: collateralEntry.amountUSD,
          factor,
          demandUSD,
          matchableUSD,
          slices,
          coverage: (matchableUSD === 0
            ? 'none'
            : pending <= 0.01
            ? 'total'
            : 'partial') as BookRow['coverage'],
          executable,
        };
      }
    );
  }, [positions, debtReserve, collateralReserve, backstopPositions]);

  const executableRows = rows.filter((r) => r.executable);
  const matchableUSD = executableRows.reduce((acc, r) => acc + r.matchableUSD, 0);

  const batchableRows = executableRows.filter((r) => r.matchableUSD > 0);
  const selectedRows = batchableRows.filter((r) => selected[r.position.user]);
  const selectedUSD = selectedRows.reduce((acc, r) => acc + r.matchableUSD, 0);
  const allSelected = batchableRows.length > 0 && selectedRows.length === batchableRows.length;

  const handleExecute = async (rowsToExecute: BookRow[]) => {
    if (!debtReserve || !collateralReserve) return;
    await execute(rowsToExecute, debtReserve, collateralReserve);
    setSelected({});
    setExecuteRows(null);
  };

  if (!debtReserve || !collateralReserve || otherSideOptions.length === 0) return null;
  const otherReserve = isDebtSide ? collateralReserve : debtReserve;
  const liquidationBonus = Number(collateralReserve.formattedReserveLiquidationBonus) || 0;

  return (
    <Box>
      {/* Pair selector: the current reserve is fixed, the other side is selectable */}
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 3, mb: 5 }}>
        <Box>
          <Typography variant="caption" color="text.secondary" component="div" sx={{ mb: 1 }}>
            {isDebtSide ? <Trans>Debt token</Trans> : <Trans>Collateral</Trans>}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              border: 1,
              borderColor: 'divider',
              borderRadius: '6px',
              px: 3,
              py: '9px',
            }}
          >
            <TokenIcon symbol={reserve.iconSymbol} sx={{ fontSize: '24px' }} />
            <Typography variant="main14">{reserve.symbol}</Typography>
          </Box>
        </Box>

        <Typography variant="secondary14" color="text.muted" sx={{ mt: 5 }}>
          <Trans>vs</Trans>
        </Typography>

        <Box>
          <Typography variant="caption" color="text.secondary" component="div" sx={{ mb: 1 }}>
            {isDebtSide ? <Trans>Collateral</Trans> : <Trans>Debt token</Trans>}
          </Typography>
          <Autocomplete
            value={otherReserve}
            onChange={(_, option) => option && setOtherAsset(option.underlyingAsset)}
            options={otherSideOptions}
            filterOptions={filterReserveOptions}
            getOptionLabel={(option) => option.symbol}
            isOptionEqualToValue={(option, value) =>
              option.underlyingAsset === value.underlyingAsset
            }
            disableClearable
            autoHighlight
            size="small"
            sx={{ minWidth: '260px' }}
            ListboxProps={{ style: { maxHeight: '360px' } }}
            noOptionsText={<Trans>No tokens found</Trans>}
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                key={option.underlyingAsset}
                sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
              >
                <TokenIcon symbol={option.iconSymbol} sx={{ fontSize: '24px' }} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="main14" noWrap>
                    {option.symbol}
                  </Typography>
                  {option.name !== option.symbol && (
                    <Typography variant="caption" color="text.secondary" component="div" noWrap>
                      {option.name}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={t`Search token`}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <TokenIcon symbol={otherReserve.iconSymbol} sx={{ fontSize: '24px', ml: 1 }} />
                  ),
                }}
              />
            )}
          />
        </Box>
      </Box>

      {/* Pair summary: the only figure a liquidator acts on — what can be liquidated right now. */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="caption" color="text.secondary" component="div">
          <Trans>Available to liquidate</Trans>
        </Typography>
        <FormattedNumber
          value={matchableUSD}
          symbol="USD"
          variant="main16"
          color={matchableUSD > 0 ? 'success.main' : 'text.primary'}
        />
      </Box>

      {quoteError ? (
        <Warning severity="error" sx={{ mb: 4 }}>
          <Trans>The router cannot price this pair: {quoteError}.</Trans>
        </Warning>
      ) : (
        executableRows.length > 0 &&
        matchableUSD === 0 && (
          <Warning severity="info" sx={{ mb: 4 }}>
            <Trans>
              No liquidity is funding {collateralReserve.symbol} / {debtReserve.symbol} right now,
              so these positions can&apos;t be matched yet.
            </Trans>
          </Warning>
        )
      )}

      {/* Surfaces only the hard blocker the matchable figure cannot: a router barred from the token. */}
      <BackstopDiagnostics collateralReserve={collateralReserve} />

      {executionError && (
        <Warning severity="error" sx={{ mb: 4 }}>
          {executionError}
        </Warning>
      )}

      {executableRows.length === 0 ? (
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Typography variant="secondary14" sx={{ mb: 1 }}>
            <Trans>No liquidatable positions for this pair right now.</Trans>
          </Typography>
          <Typography
            variant="helperText"
            color="text.secondary"
            sx={{ display: 'block', mb: 3, maxWidth: '380px', mx: 'auto' }}
          >
            <Trans>
              Provide liquidity to liquidate {collateralReserve.symbol} positions when they turn
              unhealthy, and earn the supply rate in the meantime.
            </Trans>
          </Typography>
          <Button component={Link} href={ROUTES.liquidations} variant="outlined" size="small">
            <Trans>Provide liquidity</Trans>
          </Button>

          {/* The positions nearest to liquidation for this pair, dimmed — a preview of the
              demand that providing liquidity would be positioned to capture. The tooltip
              simulates the provider's take if the position crossed into liquidatable. */}
          {rows.length > 0 && (
            <Box sx={{ mt: 6, mx: 'auto', maxWidth: '360px' }}>
              <Typography
                variant="helperText"
                color="text.secondary"
                sx={{ display: 'block', textAlign: 'left', mb: 1, opacity: 0.6 }}
              >
                <Trans>Approaching liquidation</Trans>
              </Typography>
              {rows.slice(0, 5).map((row) => {
                // What a provider would take if this position became liquidatable. They fund
                // the repayment in the debt token and are paid in the collateral token: their
                // repayment back plus the liquidation bonus, of which the protocol takes a cut.
                const repayUSD = Math.min(
                  row.debtUSD * row.factor,
                  row.collateralUSD / (1 + liquidationBonus)
                );
                const grossBonusUSD = repayUSD * liquidationBonus;
                const providerBonusUSD = grossBonusUSD * PROVIDER_BONUS_SHARE;
                const protocolBonusUSD = grossBonusUSD - providerBonusUSD;
                // Collateral the provider walks away with: repayment + their share of the bonus.
                const providerReceiveUSD = repayUSD + providerBonusUSD;

                return (
                  <Box
                    key={row.position.user}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1,
                      borderTop: 1,
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="secondary12" sx={{ opacity: 0.55 }}>
                      {`${row.position.user.slice(0, 6)}...${row.position.user.slice(-4)}`}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="secondary12" color="warning.main" sx={{ opacity: 0.7 }}>
                        <Trans>HF {row.position.healthFactor.toFixed(3)}</Trans>
                      </Typography>
                      <TextWithTooltip iconSize={14} iconColor="text.secondary">
                        <Box sx={{ minWidth: '220px' }}>
                          <Typography variant="subheader2" sx={{ mb: 2 }}>
                            <Trans>Your take if liquidated</Trans>
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block', mb: 3 }}
                          >
                            <Trans>
                              If this position turns unhealthy, you repay its {debtReserve.symbol}{' '}
                              debt and are paid in {collateralReserve.symbol} — your repayment back
                              plus a {(liquidationBonus * 100).toFixed(1)}% bonus. You keep{' '}
                              {(PROVIDER_BONUS_SHARE * 100).toFixed(0)}% of that bonus; the rest
                              goes to the protocol.
                            </Trans>
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              <Trans>You pay ({debtReserve.symbol})</Trans>
                            </Typography>
                            <FormattedNumber value={repayUSD} symbol="USD" variant="caption" />
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'baseline',
                              mb: 1,
                            }}
                          >
                            <Typography variant="caption" color="success.main">
                              <Trans>You keep ({collateralReserve.symbol})</Trans>
                            </Typography>
                            <Box sx={{ textAlign: 'right' }}>
                              <FormattedNumber
                                value={providerReceiveUSD}
                                symbol="USD"
                                variant="secondary12"
                                color="success.main"
                              />
                              <Typography
                                variant="helperText"
                                color="text.secondary"
                                sx={{ display: 'block' }}
                              >
                                <Trans>
                                  incl.{' '}
                                  <FormattedNumber
                                    value={providerBonusUSD}
                                    symbol="USD"
                                    variant="helperText"
                                    sx={{ display: 'inline-flex' }}
                                  />{' '}
                                  bonus
                                </Trans>
                              </Typography>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              <Trans>Protocol bonus cut</Trans>
                            </Typography>
                            <FormattedNumber
                              value={protocolBonusUSD}
                              symbol="USD"
                              variant="caption"
                              color="text.secondary"
                            />
                          </Box>
                        </Box>
                      </TextWithTooltip>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      ) : (
        <Box sx={{ border: 1, borderColor: 'divider', borderRadius: '6px', overflowX: 'auto' }}>
          <Box sx={{ minWidth: '560px' }}>
            <ListHeaderWrapper px={4} sx={{ position: 'static', pt: 3 }}>
              <ListColumn maxWidth={40} minWidth={40} align="center">
                <Checkbox
                  size="small"
                  checked={allSelected}
                  indeterminate={selectedRows.length > 0 && !allSelected}
                  disabled={batchableRows.length === 0}
                  onChange={(e) =>
                    setSelected(
                      e.target.checked
                        ? Object.fromEntries(batchableRows.map((r) => [r.position.user, true]))
                        : {}
                    )
                  }
                  inputProps={{ 'aria-label': t`Select all matchable positions` }}
                  sx={{ p: 0 }}
                />
              </ListColumn>
              <ListColumn isRow minWidth={110} maxWidth={130}>
                <ListHeaderTitle>
                  <Trans>Position</Trans>
                </ListHeaderTitle>
              </ListColumn>
              <ListColumn align="left" minWidth={80}>
                <ListHeaderTitle>
                  <Trans>Health factor</Trans>
                </ListHeaderTitle>
              </ListColumn>
              <ListColumn align="right" minWidth={100}>
                <ListHeaderTitle>
                  <Trans>Debt</Trans>
                </ListHeaderTitle>
              </ListColumn>
              <ListColumn align="right" minWidth={110}>
                <ListHeaderTitle>
                  <Trans>Matchable now</Trans>
                </ListHeaderTitle>
              </ListColumn>
              <ListColumn maxWidth={110} minWidth={100} align="right">
                <ListHeaderTitle>
                  <Trans>Action</Trans>
                </ListHeaderTitle>
              </ListColumn>
            </ListHeaderWrapper>

            {executableRows.map((row) => (
              <Box
                key={row.position.user}
                sx={{
                  '&:not(:last-child)': { borderBottom: '1px solid', borderColor: 'divider' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', minHeight: '56px', px: 4 }}>
                  <ListColumn maxWidth={40} minWidth={40} align="center">
                    {row.matchableUSD > 0 && (
                      <Checkbox
                        size="small"
                        checked={!!selected[row.position.user]}
                        onChange={(e) =>
                          setSelected((prev) => ({
                            ...prev,
                            [row.position.user]: e.target.checked,
                          }))
                        }
                        inputProps={{ 'aria-label': `select position ${row.position.user}` }}
                        sx={{ p: 0 }}
                      />
                    )}
                  </ListColumn>
                  <ListColumn isRow minWidth={110} maxWidth={130}>
                    <Typography variant="secondary14" noWrap>
                      {row.position.user}
                    </Typography>
                  </ListColumn>
                  <ListColumn align="left" minWidth={80}>
                    <Typography
                      variant="main14"
                      color={row.position.healthFactor < 0.95 ? 'error.main' : 'warning.main'}
                    >
                      {row.position.healthFactor.toFixed(3)}
                    </Typography>
                    <Typography variant="helperText" color="text.secondary">
                      {row.factor === 1 ? (
                        <Trans>100% liquidatable</Trans>
                      ) : (
                        <Trans>up to 50%</Trans>
                      )}
                    </Typography>
                  </ListColumn>
                  <ListColumn align="right" minWidth={100}>
                    <FormattedNumber value={row.debtAmount} variant="secondary14" />
                    <FormattedNumber
                      value={row.debtUSD}
                      symbol="USD"
                      variant="secondary12"
                      color="text.secondary"
                    />
                  </ListColumn>
                  <ListColumn align="right" minWidth={110}>
                    <FormattedNumber
                      value={row.matchableUSD}
                      symbol="USD"
                      variant="secondary14"
                      color={row.matchableUSD > 0 ? 'success.main' : 'text.muted'}
                    />
                    {row.coverage !== 'none' && (
                      <Chip
                        label={
                          row.coverage === 'total' ? <Trans>Total</Trans> : <Trans>Partial</Trans>
                        }
                        size="small"
                        variant="outlined"
                        color={row.coverage === 'total' ? 'success' : 'warning'}
                        sx={{ mt: 1, height: '20px', fontSize: '11px' }}
                      />
                    )}
                  </ListColumn>
                  <ListColumn maxWidth={110} minWidth={100} align="right">
                    <Button
                      variant="contained"
                      size="small"
                      disabled={
                        row.matchableUSD === 0 ||
                        executionStatuses[row.position.user] === 'pending' ||
                        executionStatuses[row.position.user] === 'done'
                      }
                      onClick={() => setExecuteRows([row])}
                    >
                      {executionStatuses[row.position.user] === 'done' ? (
                        <Trans>Done</Trans>
                      ) : executionStatuses[row.position.user] === 'pending' ? (
                        <Trans>Signing...</Trans>
                      ) : (
                        <Trans>Execute</Trans>
                      )}
                    </Button>
                  </ListColumn>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {batchableRows.length > 1 && (
        <Box
          sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 3, mt: 3 }}
        >
          {selectedRows.length > 0 && (
            <Typography variant="secondary14" color="text.secondary">
              {selectedRows.length} <Trans>selected</Trans> ·{' '}
              <FormattedNumber
                value={selectedUSD}
                symbol="USD"
                variant="secondary14"
                sx={{ display: 'inline-flex' }}
              />
            </Typography>
          )}
          <Button
            variant="contained"
            disabled={selectedRows.length === 0}
            onClick={() => setExecuteRows(selectedRows)}
          >
            <Trans>Execute {selectedRows.length} liquidations</Trans>
          </Button>
        </Box>
      )}

      <LiquidationsExecuteModal
        open={!!executeRows}
        setOpen={(isOpen) => !isOpen && setExecuteRows(null)}
        rows={executeRows ?? []}
        debtReserve={debtReserve}
        collateralReserve={collateralReserve}
        onConfirm={() => {
          if (executeRows) handleExecute(executeRows);
        }}
      />
    </Box>
  );
};
