import { Trans } from '@lingui/macro';
import { Box, Checkbox, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ListColumn } from 'src/components/lists/ListColumn';
import { ListHeaderTitle } from 'src/components/lists/ListHeaderTitle';
import { ListHeaderWrapper } from 'src/components/lists/ListHeaderWrapper';
import { ListWrapper } from 'src/components/lists/ListWrapper';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Warning } from 'src/components/primitives/Warning';

import { DepositAllocation, DepositAllocations, LiquidationDeposit } from '../../types';
import { LiquidationDepositsListItem } from './LiquidationDepositsListItem';

interface LiquidationDepositsListProps {
  deposits: LiquidationDeposit[];
  allocations: DepositAllocations;
  totalAllocatedUSD: number;
  onAllocationChange: (underlyingAsset: string, allocation: DepositAllocation) => void;
  onToggleAll: (enabled: boolean) => void;
}

const EMPTY_ALLOCATION: DepositAllocation = { enabled: false, mode: 'all', amount: '' };

export const LiquidationDepositsList = ({
  deposits,
  allocations,
  totalAllocatedUSD,
  onAllocationChange,
  onToggleAll,
}: LiquidationDepositsListProps) => {
  const theme = useTheme();
  const downToXSM = useMediaQuery(theme.breakpoints.down('xsm'));

  const enabledCount = deposits.filter((d) => allocations[d.underlyingAsset]?.enabled).length;
  const allEnabled = deposits.length > 0 && enabledCount === deposits.length;

  return (
    <ListWrapper
      // Rendered inside the setup card, which already draws the outer border
      paperSx={{ border: 0 }}
      titleComponent={
        <Typography component="div" variant="h3" sx={{ mr: 4 }}>
          <Trans>Your deposits for liquidations</Trans>
        </Typography>
      }
      subTitleComponent={
        totalAllocatedUSD > 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="secondary14" color="text.secondary" sx={{ mr: 1 }}>
              <Trans>Allocated</Trans>
            </Typography>
            <FormattedNumber
              value={totalAllocatedUSD}
              symbol="USD"
              variant="secondary14"
              color="text.secondary"
            />
          </Box>
        ) : undefined
      }
    >
      {deposits.length === 0 ? (
        <Box sx={{ px: 6, pb: 6 }}>
          <Warning severity="info" sx={{ mb: 0 }}>
            <Trans>
              You have no active deposits. Supply an asset first to allocate it for liquidations.
            </Trans>
          </Warning>
        </Box>
      ) : (
        <>
          {!downToXSM && (
            <ListHeaderWrapper px={6}>
              <ListColumn maxWidth={48} minWidth={48} align="center">
                <Checkbox
                  size="small"
                  checked={allEnabled}
                  indeterminate={enabledCount > 0 && !allEnabled}
                  onChange={(e) => onToggleAll(e.target.checked)}
                  inputProps={{ 'aria-label': 'select all deposits' }}
                  sx={{ p: 0 }}
                />
              </ListColumn>
              <ListColumn isRow maxWidth={190} minWidth={160}>
                <ListHeaderTitle>
                  <Trans>Asset</Trans>
                </ListHeaderTitle>
              </ListColumn>
              <ListColumn>
                <ListHeaderTitle>
                  <Trans>Your deposit</Trans>
                </ListHeaderTitle>
              </ListColumn>
              <ListColumn>
                <ListHeaderTitle>
                  <Trans>Supply APY</Trans>
                </ListHeaderTitle>
              </ListColumn>
              <ListColumn maxWidth={220} minWidth={200} align="right">
                <ListHeaderTitle>
                  <Trans>Amount for liquidations</Trans>
                </ListHeaderTitle>
              </ListColumn>
            </ListHeaderWrapper>
          )}

          {deposits.map((deposit) => (
            <LiquidationDepositsListItem
              key={deposit.underlyingAsset}
              deposit={deposit}
              allocation={allocations[deposit.underlyingAsset] ?? EMPTY_ALLOCATION}
              onAllocationChange={onAllocationChange}
            />
          ))}
        </>
      )}
    </ListWrapper>
  );
};
