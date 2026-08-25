import { Trans } from '@lingui/macro';
import { Box, Checkbox, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ListColumn } from 'src/components/lists/ListColumn';
import { ListItem } from 'src/components/lists/ListItem';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Row } from 'src/components/primitives/Row';
import { TokenIcon } from 'src/components/primitives/TokenIcon';

import { LiquidationAmountInput } from '../../LiquidationAmountInput';
import { AllocationMode, DepositAllocation, LiquidationDeposit } from '../../types';

interface LiquidationDepositsListItemProps {
  deposit: LiquidationDeposit;
  allocation: DepositAllocation;
  onAllocationChange: (underlyingAsset: string, allocation: DepositAllocation) => void;
}

export const LiquidationDepositsListItem = (props: LiquidationDepositsListItemProps) => {
  const theme = useTheme();
  const downToXSM = useMediaQuery(theme.breakpoints.down('xsm'));

  return downToXSM ? (
    <LiquidationDepositsListItemMobile {...props} />
  ) : (
    <LiquidationDepositsListItemDesktop {...props} />
  );
};

const useItemHandlers = ({
  deposit,
  allocation,
  onAllocationChange,
}: LiquidationDepositsListItemProps) => {
  const handleToggle = (checked: boolean) => {
    // Selecting defaults to the full deposit ('all'), the user can switch to 'custom' to cap it
    onAllocationChange(deposit.underlyingAsset, {
      enabled: checked,
      mode: 'all',
      amount: checked ? deposit.underlyingBalance : '',
    });
  };

  const handleModeChange = (mode: AllocationMode) => {
    onAllocationChange(deposit.underlyingAsset, {
      ...allocation,
      mode,
      // Both directions start from the full deposit; in 'custom' the user edits from there
      amount: deposit.underlyingBalance,
    });
  };

  const handleAmountChange = (amount: string) => {
    onAllocationChange(deposit.underlyingAsset, { ...allocation, amount });
  };

  const amountUsd = (Number(allocation.amount || '0') * Number(deposit.priceInUSD)).toString();

  return { handleToggle, handleModeChange, handleAmountChange, amountUsd };
};

const LiquidationDepositsListItemDesktop = (props: LiquidationDepositsListItemProps) => {
  const { deposit, allocation } = props;
  const { handleToggle, handleModeChange, handleAmountChange, amountUsd } = useItemHandlers(props);

  return (
    <ListItem
      px={6}
      minHeight={85}
      sx={{ opacity: allocation.enabled ? 1 : 0.85 }}
      data-cy={`liquidationDepositsListItem_${deposit.symbol.toUpperCase()}`}
    >
      <ListColumn maxWidth={48} minWidth={48} align="center">
        <Checkbox
          checked={allocation.enabled}
          onChange={(e) => handleToggle(e.target.checked)}
          inputProps={{ 'aria-label': `use ${deposit.symbol} for liquidations` }}
          sx={{ p: 1 }}
        />
      </ListColumn>

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
        <FormattedNumber
          value={deposit.underlyingBalance}
          variant="secondary14"
          sx={{ mb: '2px' }}
        />
        <FormattedNumber
          value={deposit.underlyingBalanceUSD}
          variant="secondary12"
          color="text.secondary"
          symbol="USD"
        />
      </ListColumn>

      <ListColumn>
        <FormattedNumber value={deposit.supplyAPY} percent variant="main14" />
      </ListColumn>

      <ListColumn maxWidth={220} minWidth={200} align="right">
        <LiquidationAmountInput
          mode={allocation.mode}
          value={allocation.enabled ? allocation.amount : ''}
          maxValue={deposit.underlyingBalance}
          usdValue={amountUsd}
          disabled={!allocation.enabled}
          onModeChange={handleModeChange}
          onChange={handleAmountChange}
        />
      </ListColumn>
    </ListItem>
  );
};

const LiquidationDepositsListItemMobile = (props: LiquidationDepositsListItemProps) => {
  const { deposit, allocation } = props;
  const { handleToggle, handleModeChange, handleAmountChange, amountUsd } = useItemHandlers(props);

  return (
    <Box
      sx={{
        px: 4,
        pt: 4,
        pb: 6,
        '&:not(:last-child)': { borderBottom: '1px solid', borderColor: 'divider' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Checkbox
          checked={allocation.enabled}
          onChange={(e) => handleToggle(e.target.checked)}
          sx={{ ml: -2, mr: 1 }}
        />
        <TokenIcon symbol={deposit.iconSymbol} sx={{ fontSize: '40px' }} />
        <Box sx={{ ml: 2 }}>
          <Typography variant="h4" color="text.primary">
            {deposit.name}
          </Typography>
          <Typography variant="subheader2" color="text.muted">
            {deposit.symbol}
          </Typography>
        </Box>
      </Box>

      <Row caption={<Trans>Your deposit</Trans>} captionVariant="description" mb={2}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <FormattedNumber value={deposit.underlyingBalance} variant="secondary14" />
          <FormattedNumber
            value={deposit.underlyingBalanceUSD}
            variant="secondary12"
            color="text.secondary"
            symbol="USD"
          />
        </Box>
      </Row>

      <Row caption={<Trans>Supply APY</Trans>} captionVariant="description" mb={3}>
        <FormattedNumber value={deposit.supplyAPY} percent variant="secondary14" />
      </Row>

      <Row
        caption={<Trans>Amount for liquidations</Trans>}
        captionVariant="description"
        align="flex-start"
      >
        <LiquidationAmountInput
          mode={allocation.mode}
          value={allocation.enabled ? allocation.amount : ''}
          maxValue={deposit.underlyingBalance}
          usdValue={amountUsd}
          disabled={!allocation.enabled}
          onModeChange={handleModeChange}
          onChange={handleAmountChange}
        />
      </Row>
    </Box>
  );
};
