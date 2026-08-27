import { Trans } from '@lingui/macro';
import { Box, Button, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import { formatUnits } from 'ethers/lib/utils';
import { CompactableTypography, CompactMode } from 'src/components/CompactableTypography';
import { ListColumn } from 'src/components/lists/ListColumn';
import { ListHeaderTitle } from 'src/components/lists/ListHeaderTitle';
import { ListHeaderWrapper } from 'src/components/lists/ListHeaderWrapper';
import { ListItem } from 'src/components/lists/ListItem';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Row } from 'src/components/primitives/Row';
import { TokenIcon } from 'src/components/primitives/TokenIcon';
import { Warning } from 'src/components/primitives/Warning';
import { useModalContext } from 'src/hooks/useModal';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { Mandate } from 'src/libs/reental/sharedRouter/useMandate';
import { SKIP_FIXES, useMandateActivity } from 'src/libs/reental/sharedRouter/useMandateActivity';
import { useIndexerStatus } from 'src/libs/reental/sharedRouter/usePonderMandate';

import {
  LiquidationCollateralOption,
  LiquidationDeposit,
  LiquidationsConfig,
  StoredLiquidationsPosition,
} from './types';

interface LiquidationsPositionOverviewProps {
  position: StoredLiquidationsPosition;
  /** Live mandate behind the position, for the states the stored shape cannot express. */
  mandate?: Mandate;
  deposits: LiquidationDeposit[];
  collateralOptions: LiquidationCollateralOption[];
  onEdit: () => void;
}

export const LiquidationsPositionOverview = ({
  position,
  mandate,
  deposits,
  collateralOptions,
  onEdit,
}: LiquidationsPositionOverviewProps) => {
  const { currentAccount } = useWeb3Context();
  const { openLiquidityMandate } = useModalContext();
  const { skips } = useMandateActivity(currentAccount);
  const { data: indexer } = useIndexerStatus();

  const pooled = position.config.collateralMode === 'pooled';

  const allocations = position.config.allocations
    .map((allocation) => ({
      allocation,
      deposit: deposits.find((d) => d.underlyingAsset === allocation.underlyingAsset),
    }))
    .filter(
      (
        entry
      ): entry is {
        allocation: LiquidationsConfig['allocations'][number];
        deposit: LiquidationDeposit;
      } => !!entry.deposit
    )
    .map(({ allocation, deposit }) => {
      // 'all' tracks the live deposit; a custom allowance is stored in base units, and the
      // amount actually usable is capped by whichever of the two is smaller.
      const approved =
        allocation.mode === 'all'
          ? deposit.underlyingBalance
          : formatUnits(allocation.amount, deposit.decimals);
      const amount = Math.min(Number(approved), Number(deposit.underlyingBalance)).toString();

      return {
        deposit,
        mode: allocation.mode,
        amount,
        limitedByBalance: Number(approved) > Number(deposit.underlyingBalance),
        amountUSD: Number(amount) * Number(deposit.priceInUSD),
      };
    });

  const totalAllocatedUSD = allocations.reduce((acc, a) => acc + a.amountUSD, 0);

  const acceptedOptions = position.config.acceptedCollaterals
    .map((collateral) => ({
      collateral,
      option: collateralOptions.find((o) => o.underlyingAsset === collateral.underlyingAsset),
    }))
    .filter(
      (
        entry
      ): entry is {
        collateral: LiquidationsConfig['acceptedCollaterals'][number];
        option: LiquidationCollateralOption;
      } => !!entry.option
    );

  const notWhitelisted = acceptedOptions.filter(({ option }) => option.whitelisted === false);

  /** Optional ceiling on how much of one debt asset a single liquidation may draw. */
  const capFor = (underlyingAsset: string) => {
    const debtAsset = mandate?.debtAssets.find(
      (item) => item.asset.toLowerCase() === underlyingAsset.toLowerCase()
    );
    const deposit = deposits.find((item) => item.underlyingAsset === underlyingAsset);
    if (!debtAsset || !deposit || debtAsset.maxDebt === '0') return 'No per-liquidation cap';
    return `Cap ${formatUnits(debtAsset.maxDebt, deposit.decimals)} per liquidation`;
  };
  const recentSkips = skips.data?.items.slice(0, 3) ?? [];

  return (
    <Paper sx={{ border: 1, borderColor: 'divider' }}>
      <Box
        sx={{
          px: { xs: 4, xsm: 6 },
          py: { xs: 3.5, xsm: 4 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Typography component="div" variant="h3">
            <Trans>Your liquidation position</Trans>
          </Typography>
          <Chip
            label={mandate?.enabled === false ? <Trans>Paused</Trans> : <Trans>Active</Trans>}
            color={mandate?.enabled === false ? 'default' : 'success'}
            size="small"
            variant="outlined"
          />
          {mandate && !mandate.isArmed && (
            <Chip label={<Trans>Not armed</Trans>} color="warning" size="small" />
          )}
        </Box>
        <Stack direction="row" gap={2}>
          {/* Pausing keeps the registration, allowances and budgets intact — the wizard has
              no step for it because it is not part of setting a position up. */}
          <Button variant="outlined" onClick={() => openLiquidityMandate('enabled')}>
            {mandate?.enabled === false ? <Trans>Resume</Trans> : <Trans>Pause</Trans>}
          </Button>
          <Button variant="outlined" onClick={onEdit}>
            <Trans>Edit position</Trans>
          </Button>
        </Stack>
      </Box>

      {/* Armed means an allowance *and* a balance behind it. Either at zero and the router
          passes this LP over without saying so. */}
      {mandate && !mandate.isArmed && (
        <Box sx={{ px: { xs: 4, xsm: 6 }, pb: 2 }}>
          <Warning severity="warning" sx={{ mb: 0 }}>
            <Trans>
              None of your deposits can currently be drawn on, so you are skipped in every
              liquidation. Check that the approval is still in place and the deposit still holds a
              balance.
            </Trans>
          </Warning>
        </Box>
      )}

      {notWhitelisted.length > 0 && (
        <Box sx={{ px: { xs: 4, xsm: 6 }, pb: 2 }}>
          <Warning severity="warning" sx={{ mb: 0 }}>
            <Trans>
              Your recipient is not whitelisted for{' '}
              {notWhitelisted.map(({ option }) => option.symbol).join(', ')}. Budgets on those
              assets are accepted but never filled.
            </Trans>
          </Warning>
        </Box>
      )}

      <ListHeaderWrapper px={6} sx={{ position: 'static' }}>
        <ListColumn isRow maxWidth={190} minWidth={160}>
          <ListHeaderTitle>
            <Trans>Asset</Trans>
          </ListHeaderTitle>
        </ListColumn>
        <ListColumn>
          <ListHeaderTitle>
            <Trans>Allocation</Trans>
          </ListHeaderTitle>
        </ListColumn>
        <ListColumn align="right">
          <ListHeaderTitle>
            <Trans>Backing liquidations</Trans>
          </ListHeaderTitle>
        </ListColumn>
      </ListHeaderWrapper>

      {allocations.map(({ deposit, mode, amount, amountUSD, limitedByBalance }) => (
        <ListItem key={deposit.underlyingAsset} px={6}>
          <ListColumn isRow maxWidth={190} minWidth={160}>
            <TokenIcon symbol={deposit.iconSymbol} fontSize="large" />
            <Box sx={{ pl: 3, overflow: 'hidden' }}>
              <Typography variant="h4" noWrap>
                {deposit.symbol}
              </Typography>
              <Typography variant="subheader2" color="text.muted" noWrap>
                {deposit.name}
              </Typography>
            </Box>
          </ListColumn>
          <ListColumn>
            <Typography variant="secondary14" color="text.secondary">
              {mode === 'all' ? <Trans>Unlimited</Trans> : <Trans>Custom amount</Trans>}
            </Typography>
            {limitedByBalance && (
              <Typography variant="helperText" color="text.muted">
                <Trans>Capped by your deposit</Trans>
              </Typography>
            )}
          </ListColumn>
          <ListColumn align="right">
            <FormattedNumber value={amount} variant="secondary14" sx={{ mb: '2px' }} />
            <FormattedNumber
              value={amountUSD}
              variant="secondary12"
              color="text.secondary"
              symbol="USD"
            />
            <Button
              size="small"
              variant="text"
              sx={{ mt: '2px', minWidth: 0, p: 0 }}
              onClick={() => openLiquidityMandate('maxDebt', deposit.underlyingAsset)}
            >
              <Typography variant="helperText" color="text.muted">
                {capFor(deposit.underlyingAsset)}
              </Typography>
            </Button>
          </ListColumn>
        </ListItem>
      ))}

      <Box sx={{ px: { xs: 4, xsm: 6 }, py: 4 }}>
        <Row caption={<Trans>Total backing liquidations</Trans>} captionVariant="subheader1" mb={5}>
          <FormattedNumber value={totalAllocatedUSD} symbol="USD" variant="main14" />
        </Row>

        <Divider sx={{ mb: 4 }} />

        <Typography variant="subheader1" color="text.secondary" sx={{ mb: 2 }}>
          <Trans>Collaterals you accept</Trans>{' '}
          {!pooled && (
            <Typography component="span" variant="secondary14" color="text.muted">
              ({acceptedOptions.length}/{collateralOptions.length})
            </Typography>
          )}
        </Typography>

        {pooled ? (
          <Box sx={{ mb: 3 }}>
            <Typography variant="secondary14">
              {position.config.pooledBudget === '' ? (
                <Trans>Any collateral, no budget limit</Trans>
              ) : (
                <Trans>
                  Any collateral, ${Number(position.config.pooledBudget).toLocaleString()} remaining
                </Trans>
              )}
            </Typography>
            <Typography variant="helperText" color="text.muted">
              <Trans>Properties listed in the future are covered automatically.</Trans>
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            {acceptedOptions.map(({ option, collateral }) => (
              <Chip
                key={option.underlyingAsset}
                icon={<TokenIcon symbol={option.iconSymbol} sx={{ fontSize: '20px' }} />}
                label={
                  collateral.mode === 'custom'
                    ? `${option.symbol} · ≤ $${Number(collateral.amount).toLocaleString()}`
                    : option.symbol
                }
                variant="outlined"
                color={option.whitelisted === false ? 'warning' : 'default'}
              />
            ))}
          </Box>
        )}

        <Row caption={<Trans>Collateral recipient</Trans>} captionVariant="description" mb={3}>
          <CompactableTypography variant="secondary14" compactMode={CompactMode.MD}>
            {position.config.recipient}
          </CompactableTypography>
        </Row>

        {/* Skipping is silent on-chain, so this is the only place the reason ever appears. */}
        {recentSkips.length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="subheader1" color="text.secondary" sx={{ mb: 2 }}>
              <Trans>Recently skipped</Trans>
            </Typography>
            {recentSkips.map((skip) => (
              <Stack
                key={`${skip.txHash}-${skip.collateralAsset}`}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ py: 1, flexWrap: 'wrap', gap: 2 }}
              >
                <Typography variant="secondary14" color="text.secondary">
                  {SKIP_FIXES[skip.reasonName]}
                </Typography>
                <Chip size="small" color="warning" label={skip.reasonName} />
              </Stack>
            ))}
          </>
        )}

        {indexer && !indexer.online ? (
          <Typography variant="helperText" color="text.muted">
            <Trans>
              Indexer unreachable — history is hidden. Everything above is read from the chain.
            </Trans>
          </Typography>
        ) : (
          position.updatedAt > 0 && (
            <Typography variant="helperText" color="text.muted">
              <Trans>Registered</Trans> {new Date(position.updatedAt).toLocaleString()}
            </Typography>
          )
        )}
      </Box>
    </Paper>
  );
};
