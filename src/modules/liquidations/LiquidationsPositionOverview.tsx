import { Trans } from '@lingui/macro';
import { Box, Button, Chip, Divider, Paper, Typography } from '@mui/material';
import { ListColumn } from 'src/components/lists/ListColumn';
import { ListHeaderTitle } from 'src/components/lists/ListHeaderTitle';
import { ListHeaderWrapper } from 'src/components/lists/ListHeaderWrapper';
import { ListItem } from 'src/components/lists/ListItem';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Row } from 'src/components/primitives/Row';
import { TokenIcon } from 'src/components/primitives/TokenIcon';

import {
  LiquidationCollateralOption,
  LiquidationDeposit,
  LiquidationsConfig,
  StoredLiquidationsPosition,
} from './types';

interface LiquidationsPositionOverviewProps {
  position: StoredLiquidationsPosition;
  deposits: LiquidationDeposit[];
  collateralOptions: LiquidationCollateralOption[];
  onEdit: () => void;
}

export const LiquidationsPositionOverview = ({
  position,
  deposits,
  collateralOptions,
  onEdit,
}: LiquidationsPositionOverviewProps) => {
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
      // 'all' tracks the live deposit, 'custom' is capped at the configured amount
      const amount = allocation.mode === 'all' ? deposit.underlyingBalance : allocation.amount;
      return {
        deposit,
        mode: allocation.mode,
        amount,
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Typography component="div" variant="h3">
            <Trans>Your liquidation position</Trans>
          </Typography>
          <Chip label={<Trans>Active</Trans>} color="success" size="small" variant="outlined" />
        </Box>
        <Button variant="outlined" onClick={onEdit}>
          <Trans>Edit position</Trans>
        </Button>
      </Box>

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

      {allocations.map(({ deposit, mode, amount, amountUSD }) => (
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
          </ListColumn>
          <ListColumn align="right">
            <FormattedNumber value={amount} variant="secondary14" sx={{ mb: '2px' }} />
            <FormattedNumber
              value={amountUSD}
              variant="secondary12"
              color="text.secondary"
              symbol="USD"
            />
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
          <Typography component="span" variant="secondary14" color="text.muted">
            ({acceptedOptions.length}/{collateralOptions.length})
          </Typography>
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          {acceptedOptions.map(({ option, collateral }) => (
            <Chip
              key={option.underlyingAsset}
              icon={<TokenIcon symbol={option.iconSymbol} sx={{ fontSize: '20px' }} />}
              label={
                collateral.mode === 'custom'
                  ? `${option.symbol} · ≤ ${Number(collateral.amount).toLocaleString()}`
                  : option.symbol
              }
              variant="outlined"
            />
          ))}
        </Box>

        <Typography variant="helperText" color="text.muted">
          <Trans>Last updated</Trans> {new Date(position.updatedAt).toLocaleString()}
        </Typography>
      </Box>
    </Paper>
  );
};
