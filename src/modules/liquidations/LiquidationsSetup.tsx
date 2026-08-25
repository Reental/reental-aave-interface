import { Trans } from '@lingui/macro';
import { Box, Button, Chip, Paper, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Row } from 'src/components/primitives/Row';
import { TokenIcon } from 'src/components/primitives/TokenIcon';
import { Warning } from 'src/components/primitives/Warning';

import { approvalKey, ApprovalStatus, LiquidationsApproveStep } from './LiquidationsApproveStep';
import { LiquidationCollateralList } from './lists/LiquidationCollateralList/LiquidationCollateralList';
import { LiquidationDepositsList } from './lists/LiquidationDepositsList/LiquidationDepositsList';
import {
  AcceptedCollaterals,
  CollateralAcceptance,
  DepositAllocation,
  DepositAllocations,
  LiquidationDeposit,
  LiquidationsConfig,
} from './types';
import { useLiquidationsData } from './useLiquidationsData';

interface LiquidationsSetupProps {
  /** Pre-fills the form when editing an existing position */
  initialConfig?: LiquidationsConfig;
  onSubmit?: (config: LiquidationsConfig) => void;
  /** When provided (editing), shows a Cancel action to leave without changes */
  onCancel?: () => void;
}

export const LiquidationsSetup = ({
  initialConfig,
  onSubmit,
  onCancel,
}: LiquidationsSetupProps) => {
  const { deposits, collateralOptions } = useLiquidationsData();

  const [activeStep, setActiveStep] = useState(0);
  const [allocations, setAllocations] = useState<DepositAllocations>({});
  const [accepted, setAccepted] = useState<AcceptedCollaterals>({});
  // TODO: seed from on-chain allowances towards the matcher contract when editing
  const [approvals, setApprovals] = useState<Record<string, ApprovalStatus>>({});

  // Pre-fill from the existing position once the app data is available
  const initializedRef = useRef(false);
  useEffect(() => {
    if (initializedRef.current || !initialConfig || deposits.length === 0) return;
    initializedRef.current = true;

    setAllocations(
      Object.fromEntries(
        initialConfig.allocations
          .map((allocation) => {
            const deposit = deposits.find((d) => d.underlyingAsset === allocation.underlyingAsset);
            if (!deposit) return undefined;
            return [
              allocation.underlyingAsset,
              {
                enabled: true,
                mode: allocation.mode,
                amount: allocation.mode === 'all' ? deposit.underlyingBalance : allocation.amount,
              },
            ] as const;
          })
          .filter((entry): entry is NonNullable<typeof entry> => !!entry)
      )
    );
    setAccepted(
      Object.fromEntries(
        initialConfig.acceptedCollaterals.map((collateral) => [
          collateral.underlyingAsset,
          { accepted: true, mode: collateral.mode, amount: collateral.amount },
        ])
      )
    );
  }, [initialConfig, deposits]);

  const enabledAllocations = useMemo(
    () =>
      deposits
        .map((deposit) => ({ deposit, allocation: allocations[deposit.underlyingAsset] }))
        .filter(
          (entry): entry is { deposit: LiquidationDeposit; allocation: DepositAllocation } =>
            !!entry.allocation?.enabled && Number(entry.allocation.amount) > 0
        ),
    [deposits, allocations]
  );

  const totalAllocatedUSD = enabledAllocations.reduce(
    (acc, { deposit, allocation }) => acc + Number(allocation.amount) * Number(deposit.priceInUSD),
    0
  );

  const hasExceededAllocation = enabledAllocations.some(
    ({ deposit, allocation }) => Number(allocation.amount) > Number(deposit.underlyingBalance)
  );

  const acceptedEntries = useMemo(
    () =>
      collateralOptions
        .map((option) => ({ option, acceptance: accepted[option.underlyingAsset] }))
        .filter(
          (
            entry
          ): entry is { option: (typeof entry)['option']; acceptance: CollateralAcceptance } =>
            !!entry.acceptance?.accepted
        ),
    [collateralOptions, accepted]
  );

  const handleAllocationChange = (underlyingAsset: string, allocation: DepositAllocation) =>
    setAllocations((prev) => ({ ...prev, [underlyingAsset]: allocation }));

  const handleToggleAllDeposits = (enabled: boolean) =>
    setAllocations(
      Object.fromEntries(
        deposits.map((deposit) => [
          deposit.underlyingAsset,
          { enabled, mode: 'all' as const, amount: enabled ? deposit.underlyingBalance : '' },
        ])
      )
    );

  const handleAcceptanceChange = (underlyingAsset: string, acceptance: CollateralAcceptance) =>
    setAccepted((prev) => ({ ...prev, [underlyingAsset]: acceptance }));

  const handleToggleAllCollaterals = (isAccepted: boolean, assets: string[]) =>
    setAccepted((prev) => ({
      ...prev,
      ...Object.fromEntries(
        assets.map((asset) => [asset, { accepted: isAccepted, mode: 'all' as const, amount: '' }])
      ),
    }));

  const handleApprove = (deposit: LiquidationDeposit, allocation: DepositAllocation) => {
    const key = approvalKey(deposit.underlyingAsset, allocation);
    setApprovals((prev) => ({ ...prev, [key]: 'pending' }));
    // TODO: replace with the real ERC20 approve tx of the wrapped token to the matcher contract
    setTimeout(() => {
      setApprovals((prev) => ({ ...prev, [key]: 'approved' }));
    }, 1500);
  };

  const allApproved =
    enabledAllocations.length > 0 &&
    enabledAllocations.every(
      ({ deposit, allocation }) =>
        approvals[approvalKey(deposit.underlyingAsset, allocation)] === 'approved'
    );

  const handleSubmit = () =>
    onSubmit?.({
      allocations: enabledAllocations.map(({ deposit, allocation }) => ({
        underlyingAsset: deposit.underlyingAsset,
        mode: allocation.mode,
        amount: allocation.amount,
      })),
      acceptedCollaterals: acceptedEntries.map(({ option, acceptance }) => ({
        underlyingAsset: option.underlyingAsset,
        mode: acceptance.mode,
        amount: acceptance.amount,
      })),
    });

  const canContinueDeposits = enabledAllocations.length > 0 && !hasExceededAllocation;
  const canContinueCollaterals =
    acceptedEntries.length > 0 &&
    acceptedEntries.every(
      ({ acceptance }) => acceptance.mode === 'all' || Number(acceptance.amount) > 0
    );

  return (
    <Box>
      <Paper sx={{ border: 1, borderColor: 'divider' }}>
        <Box
          sx={{
            px: { xs: 4, xsm: 6 },
            py: { xs: 3, xsm: 4 },
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Stepper
            activeStep={activeStep}
            sx={{
              maxWidth: '820px',
              mx: 'auto',
              // On small screens only the step circles fit the bar, so hide the labels
              '& .MuiStepLabel-label': { display: { xs: 'none', md: 'block' } },
            }}
          >
            <Step>
              <StepLabel>
                <Trans>Deposits</Trans>
              </StepLabel>
            </Step>
            <Step>
              <StepLabel>
                <Trans>Accepted collaterals</Trans>
              </StepLabel>
            </Step>
            <Step>
              <StepLabel>
                <Trans>Approve</Trans>
              </StepLabel>
            </Step>
            <Step>
              <StepLabel>
                <Trans>Review &amp; confirm</Trans>
              </StepLabel>
            </Step>
          </Stepper>
        </Box>

        {activeStep === 0 && (
          <LiquidationDepositsList
            deposits={deposits}
            allocations={allocations}
            totalAllocatedUSD={totalAllocatedUSD}
            onAllocationChange={handleAllocationChange}
            onToggleAll={handleToggleAllDeposits}
          />
        )}

        {activeStep === 1 && (
          <LiquidationCollateralList
            options={collateralOptions}
            accepted={accepted}
            onAcceptanceChange={handleAcceptanceChange}
            onToggleAll={handleToggleAllCollaterals}
          />
        )}

        {activeStep === 2 && (
          <LiquidationsApproveStep
            allocations={enabledAllocations}
            approvals={approvals}
            onApprove={handleApprove}
          />
        )}

        {activeStep === 3 && (
          <Box sx={{ p: { xs: 4, xsm: 6 } }}>
            <Typography variant="h3" sx={{ mb: 4 }}>
              <Trans>Review your liquidation setup</Trans>
            </Typography>

            <Typography variant="subheader1" color="text.secondary" sx={{ mb: 2 }}>
              <Trans>Deposits allocated</Trans>
            </Typography>
            {enabledAllocations.map(({ deposit, allocation }) => (
              <Row
                key={deposit.underlyingAsset}
                caption={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TokenIcon symbol={deposit.iconSymbol} sx={{ fontSize: '20px', mr: 2 }} />
                    <Typography variant="secondary14">{deposit.symbol}</Typography>
                    <Typography variant="helperText" color="text.muted" sx={{ ml: 2 }}>
                      {allocation.mode === 'all' ? (
                        <Trans>Full deposit</Trans>
                      ) : (
                        <Trans>Custom</Trans>
                      )}
                    </Typography>
                  </Box>
                }
                mb={2}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FormattedNumber value={allocation.amount} variant="secondary14" />
                  <FormattedNumber
                    value={Number(allocation.amount) * Number(deposit.priceInUSD)}
                    symbol="USD"
                    variant="secondary12"
                    color="text.secondary"
                    sx={{ ml: 2 }}
                  />
                </Box>
              </Row>
            ))}

            <Row caption={<Trans>Total allocated</Trans>} captionVariant="subheader1" mb={6}>
              <FormattedNumber value={totalAllocatedUSD} symbol="USD" variant="main14" />
            </Row>

            <Typography variant="subheader1" color="text.secondary" sx={{ mb: 2 }}>
              <Trans>Collaterals you accept</Trans>
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 6 }}>
              {acceptedEntries.map(({ option, acceptance }) => (
                <Chip
                  key={option.underlyingAsset}
                  icon={<TokenIcon symbol={option.iconSymbol} sx={{ fontSize: '20px' }} />}
                  label={
                    acceptance.mode === 'custom'
                      ? `${option.symbol} · ≤ ${Number(acceptance.amount).toLocaleString()}`
                      : option.symbol
                  }
                  variant="outlined"
                />
              ))}
            </Box>

            <Warning severity="info" sx={{ mb: 0 }}>
              <Trans>
                Your token approvals to the matcher contract are already in place. Confirming will
                register this configuration so your deposits can back liquidations. You can revoke
                or update it at any time.
              </Trans>
            </Warning>
          </Box>
        )}
      </Paper>

      {activeStep === 0 && (
        <StepActions
          onBack={onCancel}
          backLabel={onCancel ? <Trans>Cancel</Trans> : undefined}
          onNext={() => setActiveStep(1)}
          nextDisabled={!canContinueDeposits}
        />
      )}
      {activeStep === 1 && (
        <StepActions
          onBack={() => setActiveStep(0)}
          onNext={() => setActiveStep(2)}
          nextDisabled={!canContinueCollaterals}
        />
      )}
      {activeStep === 2 && (
        <StepActions
          onBack={() => setActiveStep(1)}
          onNext={() => setActiveStep(3)}
          nextDisabled={!allApproved}
        />
      )}
      {activeStep === 3 && (
        <StepActions
          onBack={() => setActiveStep(2)}
          onNext={handleSubmit}
          nextLabel={<Trans>Confirm &amp; activate</Trans>}
        />
      )}
    </Box>
  );
};

interface StepActionsProps {
  onBack?: () => void;
  backLabel?: React.ReactNode;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: React.ReactNode;
}

const StepActions = ({ onBack, backLabel, onNext, nextDisabled, nextLabel }: StepActionsProps) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
    <Box>
      {onBack && (
        <Button variant="outlined" size="large" onClick={onBack}>
          {backLabel ?? <Trans>Back</Trans>}
        </Button>
      )}
    </Box>
    <Button
      variant="contained"
      size="large"
      disabled={nextDisabled}
      onClick={onNext}
      sx={{ minWidth: '160px' }}
    >
      {nextLabel ?? <Trans>Continue</Trans>}
    </Button>
  </Box>
);
