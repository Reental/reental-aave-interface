import { CheckCircleIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/macro';
import { Box, Button, CircularProgress, SvgIcon, Typography } from '@mui/material';
import { ListColumn } from 'src/components/lists/ListColumn';
import { ListHeaderTitle } from 'src/components/lists/ListHeaderTitle';
import { ListHeaderWrapper } from 'src/components/lists/ListHeaderWrapper';
import { ListItem } from 'src/components/lists/ListItem';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { TokenIcon } from 'src/components/primitives/TokenIcon';
import { Warning } from 'src/components/primitives/Warning';

import { DepositAllocation, LiquidationDeposit } from './types';

export type ApprovalStatus = 'idle' | 'pending' | 'approved';

/** Approvals are keyed by asset + mode + amount, so changing the allocation invalidates them */
export const approvalKey = (underlyingAsset: string, allocation: DepositAllocation) =>
  `${underlyingAsset}-${allocation.mode}-${allocation.amount}`;

interface LiquidationsApproveStepProps {
  allocations: { deposit: LiquidationDeposit; allocation: DepositAllocation }[];
  approvals: Record<string, ApprovalStatus>;
  onApprove: (deposit: LiquidationDeposit, allocation: DepositAllocation) => void;
}

export const LiquidationsApproveStep = ({
  allocations,
  approvals,
  onApprove,
}: LiquidationsApproveStepProps) => {
  return (
    // Rendered inside the setup card, which already draws the outer border
    <Box>
      <Box sx={{ px: { xs: 4, xsm: 6 }, pt: { xs: 3.5, xsm: 4 }, pb: 2 }}>
        <Typography variant="h3" sx={{ mb: 1 }}>
          <Trans>Approve your tokens</Trans>
        </Typography>
        <Typography variant="description" color="text.secondary">
          <Trans>
            Grant the liquidations matcher contract permission to use each selected deposit. One
            approval per token — already-approved tokens stay approved if you come back to this
            step.
          </Trans>
        </Typography>
      </Box>

      <ListHeaderWrapper px={6} sx={{ position: 'static' }}>
        <ListColumn isRow maxWidth={190} minWidth={160}>
          <ListHeaderTitle>
            <Trans>Asset</Trans>
          </ListHeaderTitle>
        </ListColumn>
        <ListColumn>
          <ListHeaderTitle>
            <Trans>Amount to approve</Trans>
          </ListHeaderTitle>
        </ListColumn>
        <ListColumn maxWidth={190} minWidth={160} align="right">
          <ListHeaderTitle>
            <Trans>Status</Trans>
          </ListHeaderTitle>
        </ListColumn>
      </ListHeaderWrapper>

      {allocations.map(({ deposit, allocation }) => {
        const status = approvals[approvalKey(deposit.underlyingAsset, allocation)] ?? 'idle';

        return (
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
              {allocation.mode === 'all' ? (
                <>
                  <Typography variant="secondary14" sx={{ mb: '2px' }}>
                    <Trans>Unlimited</Trans>
                  </Typography>
                  <Typography variant="helperText" color="text.secondary">
                    <Trans>Max uint approval</Trans>
                  </Typography>
                </>
              ) : (
                <>
                  <FormattedNumber
                    value={allocation.amount}
                    variant="secondary14"
                    sx={{ mb: '2px' }}
                  />
                  <Typography variant="helperText" color="text.secondary">
                    <Trans>Custom</Trans>
                  </Typography>
                </>
              )}
            </ListColumn>

            <ListColumn maxWidth={190} minWidth={160} align="right">
              {status === 'approved' ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SvgIcon sx={{ color: 'success.main', fontSize: '20px' }}>
                    <CheckCircleIcon />
                  </SvgIcon>
                  <Typography variant="secondary14" color="success.main">
                    <Trans>Approved</Trans>
                  </Typography>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  disabled={status === 'pending'}
                  onClick={() => onApprove(deposit, allocation)}
                  sx={{ minWidth: '130px' }}
                >
                  {status === 'pending' ? (
                    <>
                      <CircularProgress size={14} color="inherit" sx={{ mr: 2 }} />
                      <Trans>Approving...</Trans>
                    </>
                  ) : (
                    <Trans>Approve {deposit.symbol}</Trans>
                  )}
                </Button>
              )}
            </ListColumn>
          </ListItem>
        );
      })}

      <Box sx={{ px: { xs: 4, xsm: 6 }, py: 4 }}>
        <Warning severity="info" sx={{ mb: 0 }}>
          <Trans>
            Approvals only authorize the matcher contract to pull up to the shown amount of each
            token when a liquidation executes. Your funds stay in your deposit earning interest
            until then.
          </Trans>
        </Warning>
      </Box>
    </Box>
  );
};
