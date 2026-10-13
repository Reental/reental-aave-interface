import { Trans } from '@lingui/macro';
import { Box, Checkbox, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ListColumn } from 'src/components/lists/ListColumn';
import { ListItem } from 'src/components/lists/ListItem';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Row } from 'src/components/primitives/Row';
import { TokenIcon } from 'src/components/primitives/TokenIcon';

import { LiquidationAmountInput } from '../../LiquidationAmountInput';
import { AllocationMode, CollateralAcceptance, LiquidationCollateralOption } from '../../types';

interface LiquidationCollateralListItemProps {
  option: LiquidationCollateralOption;
  acceptance: CollateralAcceptance;
  onAcceptanceChange: (underlyingAsset: string, acceptance: CollateralAcceptance) => void;
}

export const LiquidationCollateralListItem = (props: LiquidationCollateralListItemProps) => {
  const theme = useTheme();
  const downToXSM = useMediaQuery(theme.breakpoints.down('xsm'));

  return downToXSM ? (
    <LiquidationCollateralListItemMobile {...props} />
  ) : (
    <LiquidationCollateralListItemDesktop {...props} />
  );
};

const useItemHandlers = ({
  option,
  acceptance,
  onAcceptanceChange,
}: LiquidationCollateralListItemProps) => {
  const handleToggle = (accepted: boolean) => {
    // Accepting defaults to no cap ('all'), the user can switch to 'custom' to limit it
    onAcceptanceChange(option.underlyingAsset, { accepted, mode: 'all', amount: '' });
  };

  const handleModeChange = (mode: AllocationMode) => {
    onAcceptanceChange(option.underlyingAsset, { ...acceptance, mode, amount: '' });
  };

  const handleAmountChange = (amount: string) => {
    onAcceptanceChange(option.underlyingAsset, { ...acceptance, amount });
  };

  const amountUsd = (Number(acceptance.amount || '0') * Number(option.priceInUSD)).toString();

  return { handleToggle, handleModeChange, handleAmountChange, amountUsd };
};

const LiquidationCollateralListItemDesktop = (props: LiquidationCollateralListItemProps) => {
  const { option, acceptance } = props;
  const { handleToggle, handleModeChange, handleAmountChange, amountUsd } = useItemHandlers(props);

  return (
    <ListItem
      px={6}
      minHeight={85}
      button
      onClick={() => handleToggle(!acceptance.accepted)}
      sx={{ cursor: 'pointer', opacity: acceptance.accepted ? 1 : 0.85 }}
      data-cy={`liquidationCollateralListItem_${option.symbol.toUpperCase()}`}
    >
      <ListColumn maxWidth={48} minWidth={48} align="center">
        <Checkbox
          checked={acceptance.accepted}
          onChange={(e) => handleToggle(e.target.checked)}
          onClick={(e) => e.stopPropagation()}
          inputProps={{ 'aria-label': `accept ${option.symbol} from liquidations` }}
          sx={{ p: 1 }}
        />
      </ListColumn>

      <ListColumn isRow maxWidth={190} minWidth={160}>
        <TokenIcon symbol={option.iconSymbol} fontSize="large" />
        <Box sx={{ pl: 3, overflow: 'hidden' }}>
          <Typography variant="h4" noWrap>
            {option.symbol}
          </Typography>
          <Typography variant="subheader2" color="text.muted" noWrap>
            {option.name}
          </Typography>
        </Box>
      </ListColumn>

      <ListColumn>
        <FormattedNumber value={option.priceInUSD} symbol="USD" variant="secondary14" />
      </ListColumn>

      <ListColumn>
        <FormattedNumber
          value={option.liquidationBonus}
          percent
          variant="main14"
          color="success.main"
        />
      </ListColumn>

      <ListColumn
        maxWidth={220}
        minWidth={200}
        align="right"
        // Interacting with the amount controls must not toggle the row
      >
        <Box onClick={(e) => e.stopPropagation()} sx={{ width: '100%' }}>
          <LiquidationAmountInput
            mode={acceptance.mode}
            value={acceptance.accepted ? acceptance.amount : ''}
            usdValue={amountUsd}
            disabled={!acceptance.accepted}
            allLabel={<Trans>No limit</Trans>}
            onModeChange={handleModeChange}
            onChange={handleAmountChange}
          />
        </Box>
      </ListColumn>
    </ListItem>
  );
};

const LiquidationCollateralListItemMobile = (props: LiquidationCollateralListItemProps) => {
  const { option, acceptance } = props;
  const { handleToggle, handleModeChange, handleAmountChange, amountUsd } = useItemHandlers(props);

  return (
    <Box
      sx={{
        px: 4,
        pt: 4,
        pb: 5,
        '&:not(:last-child)': { borderBottom: '1px solid', borderColor: 'divider' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Checkbox
          checked={acceptance.accepted}
          onChange={(e) => handleToggle(e.target.checked)}
          sx={{ ml: -2, mr: 1 }}
        />
        <TokenIcon symbol={option.iconSymbol} sx={{ fontSize: '40px' }} />
        <Box sx={{ ml: 2 }}>
          <Typography variant="h4" color="text.primary">
            {option.name}
          </Typography>
          <Typography variant="subheader2" color="text.muted">
            {option.symbol}
          </Typography>
        </Box>
      </Box>

      <Row caption={<Trans>Oracle price</Trans>} captionVariant="description" mb={2}>
        <FormattedNumber value={option.priceInUSD} symbol="USD" variant="secondary14" />
      </Row>

      <Row caption={<Trans>Liquidation bonus</Trans>} captionVariant="description" mb={3}>
        <FormattedNumber
          value={option.liquidationBonus}
          percent
          variant="secondary14"
          color="success.main"
        />
      </Row>

      <Row
        caption={<Trans>Amount you accept</Trans>}
        captionVariant="description"
        align="flex-start"
      >
        <LiquidationAmountInput
          mode={acceptance.mode}
          value={acceptance.accepted ? acceptance.amount : ''}
          usdValue={amountUsd}
          disabled={!acceptance.accepted}
          allLabel={<Trans>No limit</Trans>}
          onModeChange={handleModeChange}
          onChange={handleAmountChange}
        />
      </Row>
    </Box>
  );
};
