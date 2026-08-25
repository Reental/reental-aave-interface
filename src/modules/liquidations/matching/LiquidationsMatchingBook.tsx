import { Trans } from '@lingui/macro';
import {
  Box,
  Button,
  Checkbox,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { ListColumn } from 'src/components/lists/ListColumn';
import { ListHeaderTitle } from 'src/components/lists/ListHeaderTitle';
import { ListHeaderWrapper } from 'src/components/lists/ListHeaderWrapper';
import { ListItem } from 'src/components/lists/ListItem';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { TokenIcon } from 'src/components/primitives/TokenIcon';
import { Warning } from 'src/components/primitives/Warning';
import {
  ComputedReserveData,
  useAppDataContext,
} from 'src/hooks/app-data-provider/useAppDataProvider';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';

import { useBackstopLiquidity } from './useBackstopLiquidity';
import {
  LiquidatablePosition,
  maxLiquidatableFactor,
  useLiquidatablePositions,
} from './useLiquidatablePositions';

interface LiquidationsMatchingBookProps {
  reserve: ComputedReserveData;
}

interface BookRow {
  position: LiquidatablePosition;
  debtAmount: number;
  debtUSD: number;
  collateralAmount: number;
  collateralUSD: number;
  /** 1 when HF < 0.95, 0.5 otherwise (close factor) */
  factor: number;
  /** USD repayable now for this pair: close factor, collateral value and backstop caps applied */
  matchableUSD: number;
  executable: boolean;
}

/**
 * The liquidations matching book for a (debt token, collateral token) pair.
 * On a borrowable reserve the debt side is fixed and the collateral is selectable;
 * on a collateral reserve it is the other way around.
 */
/** One liquidation call for the matcher: who liquidates whom, on which pair, for how much debt */
export interface MatcherLiquidationCall {
  liquidator: string;
  user: string;
  debtAsset: string;
  collateralAsset: string;
  /** Debt token units to repay */
  debtToCover: number;
  debtToCoverUSD: number;
}

export const LiquidationsMatchingBook = ({ reserve }: LiquidationsMatchingBookProps) => {
  const theme = useTheme();
  const downToSm = useMediaQuery(theme.breakpoints.down('sm'));
  const { reserves } = useAppDataContext();
  const { currentAccount } = useWeb3Context();
  const positions = useLiquidatablePositions();
  const { getPairLiquidity } = useBackstopLiquidity();
  const [selected, setSelected] = useState<Record<string, boolean>>({});

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

  const backstop =
    debtReserve && collateralReserve
      ? getPairLiquidity(debtReserve.underlyingAsset, collateralReserve.underlyingAsset)
      : { availableUSD: 0, depositors: 0 };

  const rows: BookRow[] = useMemo(() => {
    if (!debtReserve || !collateralReserve) return [];
    const liquidationBonus = Number(collateralReserve.formattedReserveLiquidationBonus) || 0;

    return positions
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
        const matchableUSD = executable
          ? Math.min(debtEntry.amountUSD * factor, collateralCapUSD, backstop.availableUSD)
          : 0;

        return [
          {
            position,
            debtAmount: debtEntry.amount,
            debtUSD: debtEntry.amountUSD,
            collateralAmount: collateralEntry.amount,
            collateralUSD: collateralEntry.amountUSD,
            factor,
            matchableUSD,
            executable,
          },
        ];
      })
      .sort((a, b) => a.position.healthFactor - b.position.healthFactor);
  }, [positions, debtReserve, collateralReserve, backstop.availableUSD]);

  const executableRows = rows.filter((r) => r.executable);
  const liquidatableUSD = executableRows.reduce((acc, r) => acc + r.debtUSD * r.factor, 0);
  const matchableUSD = Math.min(
    executableRows.reduce((acc, r) => acc + r.matchableUSD, 0),
    backstop.availableUSD
  );

  const batchableRows = executableRows.filter((r) => r.matchableUSD > 0);
  const selectedRows = batchableRows.filter((r) => selected[r.position.user]);
  const selectedUSD = selectedRows.reduce((acc, r) => acc + r.matchableUSD, 0);
  const allSelected = batchableRows.length > 0 && selectedRows.length === batchableRows.length;

  const buildCall = (row: BookRow): MatcherLiquidationCall | undefined => {
    if (!debtReserve || !collateralReserve) return undefined;
    const debtPrice = Number(debtReserve.priceInUSD) || 1;
    return {
      liquidator: currentAccount,
      user: row.position.user,
      debtAsset: debtReserve.underlyingAsset,
      collateralAsset: collateralReserve.underlyingAsset,
      debtToCover: row.matchableUSD / debtPrice,
      debtToCoverUSD: row.matchableUSD,
    };
  };

  const handleExecute = (rowsToExecute: BookRow[]) => {
    const calls = rowsToExecute.map(buildCall).filter(Boolean);
    // TODO: wire the matcher contract — single tx per call, or its batch entrypoint when 2+
    // eslint-disable-next-line no-console
    console.log('execute liquidations', calls);
  };

  if (!debtReserve || !collateralReserve || otherSideOptions.length === 0) return null;

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
          <Select
            value={otherAsset}
            onChange={(e) => setOtherAsset(e.target.value)}
            size="small"
            sx={{
              minWidth: '220px',
              '& .MuiSelect-select': { display: 'flex', gap: 2, py: '8px' },
            }}
            MenuProps={{ PaperProps: { sx: { maxHeight: '360px' } } }}
          >
            {otherSideOptions.map((option) => (
              <MenuItem
                key={option.underlyingAsset}
                value={option.underlyingAsset}
                sx={{ display: 'flex', gap: 2 }}
              >
                <TokenIcon symbol={option.iconSymbol} sx={{ fontSize: '24px' }} />
                <Typography variant="main14">{option.symbol}</Typography>
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      {/* Pair summary */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 4, sm: 10 }, mb: 5 }}>
        <Box>
          <Typography variant="caption" color="text.secondary" component="div">
            <Trans>Liquidatable debt</Trans>
          </Typography>
          <FormattedNumber value={liquidatableUSD} symbol="USD" variant="main16" />
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" component="div">
            <Trans>Backstop for this pair</Trans>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
            <FormattedNumber value={backstop.availableUSD} symbol="USD" variant="main16" />
            {backstop.depositors > 0 && (
              <Typography variant="helperText" color="text.muted">
                {backstop.depositors} <Trans>depositors</Trans>
              </Typography>
            )}
          </Box>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" component="div">
            <Trans>Matchable now</Trans>
          </Typography>
          <FormattedNumber
            value={matchableUSD}
            symbol="USD"
            variant="main16"
            color={matchableUSD > 0 ? 'success.main' : 'text.primary'}
          />
        </Box>
      </Box>

      {backstop.availableUSD === 0 && (
        <Warning severity="warning" sx={{ mb: 4 }}>
          <Trans>No backstop deposits accept this pair yet, so nothing can be matched.</Trans>
        </Warning>
      )}

      {rows.length === 0 ? (
        <Warning severity="info" sx={{ mb: 0 }}>
          <Trans>No liquidatable positions for this pair right now.</Trans>
        </Warning>
      ) : (
        <Box sx={{ border: 1, borderColor: 'divider', borderRadius: '6px', overflowX: 'auto' }}>
          <Box sx={{ minWidth: downToSm ? '640px' : 'unset' }}>
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
                  inputProps={{ 'aria-label': 'select all matchable positions' }}
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
                  <Trans>Collateral</Trans>
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

            {rows.map((row) => (
              <ListItem
                key={row.position.user}
                px={4}
                minHeight={64}
                sx={{ opacity: row.executable ? 1 : 0.45 }}
              >
                <ListColumn maxWidth={40} minWidth={40} align="center">
                  {row.executable && row.matchableUSD > 0 && (
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
                    color={
                      !row.executable
                        ? 'text.muted'
                        : row.position.healthFactor < 0.95
                        ? 'error.main'
                        : 'warning.main'
                    }
                  >
                    {row.position.healthFactor.toFixed(3)}
                  </Typography>
                  {row.executable && (
                    <Typography variant="helperText" color="text.secondary">
                      {row.factor === 1 ? (
                        <Trans>100% liquidatable</Trans>
                      ) : (
                        <Trans>up to 50%</Trans>
                      )}
                    </Typography>
                  )}
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
                  <FormattedNumber value={row.collateralAmount} variant="secondary14" />
                  <FormattedNumber
                    value={row.collateralUSD}
                    symbol="USD"
                    variant="secondary12"
                    color="text.secondary"
                  />
                </ListColumn>
                <ListColumn align="right" minWidth={110}>
                  {row.executable ? (
                    <FormattedNumber
                      value={row.matchableUSD}
                      symbol="USD"
                      variant="secondary14"
                      color={row.matchableUSD > 0 ? 'success.main' : 'text.muted'}
                    />
                  ) : (
                    <Typography variant="helperText" color="text.muted">
                      <Trans>HF above 1</Trans>
                    </Typography>
                  )}
                </ListColumn>
                <ListColumn maxWidth={110} minWidth={100} align="right">
                  <Button
                    variant="contained"
                    size="small"
                    disabled={!row.executable || row.matchableUSD === 0}
                    onClick={() => handleExecute([row])}
                  >
                    <Trans>Execute</Trans>
                  </Button>
                </ListColumn>
              </ListItem>
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
            onClick={() => handleExecute(selectedRows)}
          >
            <Trans>Execute batch ({selectedRows.length})</Trans>
          </Button>
        </Box>
      )}
    </Box>
  );
};
