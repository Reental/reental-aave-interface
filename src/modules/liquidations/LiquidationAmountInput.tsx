import { Trans } from '@lingui/macro';
import { Box, Button, InputBase, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { NoData } from 'src/components/primitives/NoData';
import { StyledTxModalToggleButton } from 'src/components/StyledToggleButton';
import { StyledTxModalToggleGroup } from 'src/components/StyledToggleButtonGroup';
import { NumberFormatCustom } from 'src/components/transactions/AssetInput';

import { AllocationMode } from './types';

interface LiquidationAmountInputProps {
  mode: AllocationMode;
  value: string;
  /** Upper bound for the amount. When omitted there is no cap (no Max button, no exceeds check). */
  maxValue?: string;
  usdValue: string;
  disabled?: boolean;
  /** What 'all' means for this input, shown under the amount (e.g. "Full deposit" / "No limit") */
  allLabel?: ReactNode;
  onModeChange: (mode: AllocationMode) => void;
  onChange: (value: string) => void;
}

export const LiquidationAmountInput = ({
  mode,
  value,
  maxValue,
  usdValue,
  disabled,
  allLabel,
  onModeChange,
  onChange,
}: LiquidationAmountInputProps) => {
  const exceedsBalance = maxValue !== undefined && Number(value) > Number(maxValue);
  const isMaxSelected = maxValue !== undefined && value !== '' && value === maxValue;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 1.5,
        width: '100%',
        maxWidth: '184px',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <StyledTxModalToggleGroup
        color="primary"
        value={mode}
        exclusive
        disabled={disabled}
        onChange={(_, newMode) => newMode && onModeChange(newMode as AllocationMode)}
        sx={{ height: '28px' }}
      >
        <StyledTxModalToggleButton value="all" disabled={disabled || mode === 'all'}>
          <Typography variant="secondary12">
            <Trans>All</Trans>
          </Typography>
        </StyledTxModalToggleButton>
        <StyledTxModalToggleButton value="custom" disabled={disabled || mode === 'custom'}>
          <Typography variant="secondary12">
            <Trans>Custom</Trans>
          </Typography>
        </StyledTxModalToggleButton>
      </StyledTxModalToggleGroup>

      {disabled ? (
        <NoData variant="secondary14" color="text.muted" sx={{ pr: 1 }} />
      ) : mode === 'all' ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', pr: 1 }}>
          {maxValue !== undefined && <FormattedNumber value={maxValue} variant="secondary14" />}
          <Typography variant="helperText" color="text.secondary">
            {allLabel ?? <Trans>Full deposit</Trans>}
          </Typography>
        </Box>
      ) : (
        <>
          <Box
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              width: '100%',
              px: 2,
              py: '2px',
              borderRadius: '6px',
              border: `1px solid ${
                exceedsBalance ? theme.palette.error.main : theme.palette.divider
              }`,
              background: theme.palette.background.surface,
              transition: 'border-color 0.2s ease',
              '&:focus-within': {
                borderColor: exceedsBalance ? theme.palette.error.main : theme.palette.primary.main,
              },
            })}
          >
            <InputBase
              sx={{ flex: 1, fontSize: '14px' }}
              placeholder="0.00"
              autoFocus
              value={value}
              onChange={(e) => onChange(e.target.value)}
              inputProps={{
                'aria-label': 'amount for liquidations',
                sx: { p: 1, textAlign: 'left' },
              }}
              // eslint-disable-next-line
              inputComponent={NumberFormatCustom as any}
            />
            {maxValue !== undefined && (
              <Button
                size="small"
                variant="text"
                disabled={isMaxSelected}
                onClick={() => onChange(maxValue)}
                sx={{ minWidth: 'unset', px: 1 }}
              >
                <Trans>Max</Trans>
              </Button>
            )}
          </Box>
          {exceedsBalance ? (
            <Typography variant="helperText" color="error.main" sx={{ mt: '-4px' }}>
              <Trans>Exceeds your deposit</Trans>
            </Typography>
          ) : (
            Number(value) > 0 && (
              <Typography variant="helperText" color="text.secondary" sx={{ mt: '-4px' }}>
                $ {Number(usdValue).toFixed(2)}
              </Typography>
            )
          )}
        </>
      )}
    </Box>
  );
};
