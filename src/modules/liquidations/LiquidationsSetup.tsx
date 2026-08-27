import { Trans } from '@lingui/macro';
import {
  Box,
  Button,
  Chip,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import { formatUnits } from 'ethers/lib/utils';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Row } from 'src/components/primitives/Row';
import { TokenIcon } from 'src/components/primitives/TokenIcon';
import { Warning } from 'src/components/primitives/Warning';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';

import { approvalKey, ApprovalStatus, LiquidationsApproveStep } from './LiquidationsApproveStep';
import { LiquidationCollateralList } from './lists/LiquidationCollateralList/LiquidationCollateralList';
import { LiquidationDepositsList } from './lists/LiquidationDepositsList/LiquidationDepositsList';
import {
  AcceptedCollaterals,
  CollateralAcceptance,
  CollateralMode,
  DepositAllocation,
  DepositAllocations,
  LiquidationDeposit,
  LiquidationsConfig,
} from './types';
import { useLiquidationsData } from './useLiquidationsData';
import { useLiquidationsSetupTx } from './useLiquidationsSetupTx';

interface LiquidationsSetupProps {
  /** Pre-fills the form when editing an existing position */
  initialConfig?: LiquidationsConfig;
  onSubmitted?: () => void;
  /** When provided (editing), shows a Cancel action to leave without changes */
  onCancel?: () => void;
}

export const LiquidationsSetup = ({
  initialConfig,
  onSubmitted,
  onCancel,
}: LiquidationsSetupProps) => {
  const { deposits, unsupportedDeposits, collateralOptions, mandate } = useLiquidationsData();
  const { currentAccount, chainId: connectedChainId } = useWeb3Context();
  const currentMarketData = useRootStore((store) => store.currentMarketData);

  const router = currentMarketData.addresses.SHARED_LIQUIDATION_ROUTER;
  const isWrongNetwork = connectedChainId !== currentMarketData.chainId;

  const { approveDeposit, planConfig, runPlan, statuses, error } = useLiquidationsSetupTx(
    router,
    currentMarketData.chainId
  );

  const [activeStep, setActiveStep] = useState(0);
  const [allocations, setAllocations] = useState<DepositAllocations>({});
  const [accepted, setAccepted] = useState<AcceptedCollaterals>({});
  const [collateralMode, setCollateralMode] = useState<CollateralMode>('pooled');
  const [pooledBudget, setPooledBudget] = useState('');
  // Defaults to the connected wallet: it is the address the whitelist is checked against,
  // and sending seized collateral anywhere else is the unusual case, not the default.
  const [recipient, setRecipient] = useState(currentAccount);

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
                amount:
                  allocation.mode === 'all' ? '' : formatUnits(allocation.amount, deposit.decimals),
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
    setCollateralMode(initialConfig.collateralMode);
    setPooledBudget(initialConfig.pooledBudget);
    if (initialConfig.recipient) setRecipient(initialConfig.recipient);
  }, [initialConfig, deposits]);

  const enabledAllocations = useMemo(
    () =>
      deposits
        .map((deposit) => ({ deposit, allocation: allocations[deposit.underlyingAsset] }))
        .filter(
          (entry): entry is { deposit: LiquidationDeposit; allocation: DepositAllocation } =>
            !!entry.allocation?.enabled &&
            (entry.allocation.mode === 'all' || Number(entry.allocation.amount) > 0)
        ),
    [deposits, allocations]
  );

  // 'all' allocations are unlimited, so estimate them at the current deposit balance
  const totalAllocatedUSD = enabledAllocations.reduce(
    (acc, { deposit, allocation }) =>
      acc +
      Number(allocation.mode === 'all' ? deposit.underlyingBalance : allocation.amount) *
        Number(deposit.priceInUSD),
    0
  );

  const hasExceededAllocation = enabledAllocations.some(
    ({ deposit, allocation }) =>
      allocation.mode === 'custom' && Number(allocation.amount) > Number(deposit.underlyingBalance)
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

  const config: LiquidationsConfig = useMemo(
    () => ({
      allocations: enabledAllocations.map(({ deposit, allocation }) => ({
        underlyingAsset: deposit.underlyingAsset,
        mode: allocation.mode,
        amount: allocation.amount,
      })),
      collateralMode,
      acceptedCollaterals:
        collateralMode === 'selected'
          ? acceptedEntries.map(({ option, acceptance }) => ({
              underlyingAsset: option.underlyingAsset,
              mode: acceptance.mode,
              amount: acceptance.amount,
            }))
          : [],
      pooledBudget: collateralMode === 'pooled' ? pooledBudget : '',
      recipient,
    }),
    [enabledAllocations, collateralMode, acceptedEntries, pooledBudget, recipient]
  );

  const plan = useMemo(() => planConfig(config, mandate), [planConfig, config, mandate]);

  const handleAllocationChange = (underlyingAsset: string, allocation: DepositAllocation) =>
    setAllocations((prev) => ({ ...prev, [underlyingAsset]: allocation }));

  const handleToggleAllDeposits = (enabled: boolean) =>
    setAllocations(
      Object.fromEntries(
        deposits.map((deposit) => [
          deposit.underlyingAsset,
          { enabled, mode: 'all' as const, amount: '' },
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

  /**
   * Approval status, seeded from the chain rather than from this session.
   *
   * An allowance already covering the requested amount is not something to ask for again —
   * coming back to edit one collateral budget should not re-prompt for every approval.
   */
  const approvals: Record<string, ApprovalStatus> = useMemo(() => {
    const entries = enabledAllocations.map(({ deposit, allocation }) => {
      const key = approvalKey(deposit.underlyingAsset, allocation);
      const live = statuses[`approve-${deposit.underlyingAsset}`];
      if (live === 'pending') return [key, 'pending' as ApprovalStatus] as const;
      if (live === 'done') return [key, 'approved' as ApprovalStatus] as const;

      const granted = BigInt(deposit.currentAllowance);
      const needed =
        allocation.mode === 'all'
          ? BigInt(0)
          : BigInt(
              Math.floor(Number(allocation.amount || '0') * 10 ** deposit.decimals).toString()
            );
      const covered =
        allocation.mode === 'all' ? granted > BigInt(0) : granted > BigInt(0) && granted >= needed;

      return [key, (covered ? 'approved' : 'idle') as ApprovalStatus] as const;
    });

    return Object.fromEntries(entries);
  }, [enabledAllocations, statuses]);

  const allApproved =
    enabledAllocations.length > 0 &&
    enabledAllocations.every(
      ({ deposit, allocation }) =>
        approvals[approvalKey(deposit.underlyingAsset, allocation)] === 'approved'
    );

  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async () => {
    setSubmitting(true);
    const ok = await runPlan(plan);
    setSubmitting(false);
    if (ok) onSubmitted?.();
  };

  const validRecipient = /^0x[a-fA-F0-9]{40}$/.test(recipient);
  const canContinueDeposits = enabledAllocations.length > 0 && !hasExceededAllocation;
  const canContinueCollaterals =
    collateralMode === 'pooled'
      ? pooledBudget === '' || Number(pooledBudget) > 0
      : acceptedEntries.length > 0 &&
        acceptedEntries.every(
          ({ acceptance }) => acceptance.mode === 'all' || Number(acceptance.amount) > 0
        );

  if (!router) {
    return (
      <Warning severity="error">
        <Trans>No liquidation router is configured for this market.</Trans>
      </Warning>
    );
  }

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
          <>
            <LiquidationDepositsList
              deposits={deposits}
              allocations={allocations}
              totalAllocatedUSD={totalAllocatedUSD}
              onAllocationChange={handleAllocationChange}
              onToggleAll={handleToggleAllDeposits}
            />
            {/* Silently hiding these would look like a bug to anyone who can see the
                deposit on their dashboard. */}
            {unsupportedDeposits.length > 0 && (
              <Box sx={{ px: { xs: 4, xsm: 6 }, pb: 4 }}>
                <Warning severity="info" sx={{ mb: 0 }}>
                  <Trans>
                    {unsupportedDeposits.map((deposit) => deposit.symbol).join(', ')} cannot back
                    liquidations yet. The router repays debt in specific assets, and only those can
                    be pulled from your deposits.
                  </Trans>
                </Warning>
              </Box>
            )}
          </>
        )}

        {activeStep === 1 && (
          <>
            <Box sx={{ px: { xs: 4, xsm: 6 }, pt: { xs: 3.5, xsm: 4 } }}>
              <Typography variant="h3" sx={{ mb: 1 }}>
                <Trans>What collateral will you take?</Trans>
              </Typography>
              <RadioGroup
                value={collateralMode}
                onChange={(event) => setCollateralMode(event.target.value as CollateralMode)}
              >
                <FormControlLabel
                  value="pooled"
                  control={<Radio size="small" />}
                  label={
                    <Box>
                      <Typography variant="secondary14">
                        <Trans>Any collateral, one shared budget</Trans>
                      </Typography>
                      <Typography variant="helperText" color="text.muted">
                        <Trans>
                          Covers properties listed in the future too, without reconfiguring.
                        </Trans>
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="selected"
                  control={<Radio size="small" />}
                  label={
                    <Box>
                      <Typography variant="secondary14">
                        <Trans>Only the assets I choose</Trans>
                      </Typography>
                      <Typography variant="helperText" color="text.muted">
                        <Trans>
                          A separate budget per property. Anything unlisted is declined.
                        </Trans>
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>

              {collateralMode === 'pooled' && (
                <TextField
                  size="small"
                  type="number"
                  sx={{ mt: 3, mb: 2, maxWidth: '280px' }}
                  label={<Trans>Pooled budget in USD</Trans>}
                  placeholder="Leave empty for no limit"
                  value={pooledBudget}
                  onChange={(event) => setPooledBudget(event.target.value)}
                  data-cy="pooledBudgetInput"
                />
              )}
            </Box>

            {collateralMode === 'selected' && (
              <LiquidationCollateralList
                options={collateralOptions}
                accepted={accepted}
                onAcceptanceChange={handleAcceptanceChange}
                onToggleAll={handleToggleAllCollaterals}
              />
            )}
          </>
        )}

        {activeStep === 2 && (
          <LiquidationsApproveStep
            allocations={enabledAllocations}
            approvals={approvals}
            onApprove={approveDeposit}
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
                {allocation.mode === 'all' ? (
                  <Typography variant="secondary14" color="text.secondary">
                    <Trans>Unlimited</Trans>
                  </Typography>
                ) : (
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
                )}
              </Row>
            ))}

            <Row caption={<Trans>Total allocated</Trans>} captionVariant="subheader1" mb={6}>
              <FormattedNumber value={totalAllocatedUSD} symbol="USD" variant="main14" />
            </Row>

            <Typography variant="subheader1" color="text.secondary" sx={{ mb: 2 }}>
              <Trans>Collaterals you accept</Trans>
            </Typography>
            {collateralMode === 'pooled' ? (
              <Typography variant="secondary14" sx={{ mb: 6 }}>
                {pooledBudget === '' ? (
                  <Trans>Any collateral, no budget limit</Trans>
                ) : (
                  <Trans>Any collateral, up to ${pooledBudget} in total</Trans>
                )}
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 6 }}>
                {acceptedEntries.map(({ option, acceptance }) => (
                  <Chip
                    key={option.underlyingAsset}
                    icon={<TokenIcon symbol={option.iconSymbol} sx={{ fontSize: '20px' }} />}
                    label={
                      acceptance.mode === 'custom'
                        ? `${option.symbol} · ≤ $${Number(acceptance.amount).toLocaleString()}`
                        : option.symbol
                    }
                    variant="outlined"
                  />
                ))}
              </Box>
            )}

            <Typography variant="subheader1" color="text.secondary" sx={{ mb: 2 }}>
              <Trans>Collateral recipient</Trans>
            </Typography>
            <TextField
              fullWidth
              size="small"
              sx={{ mb: 2 }}
              value={recipient}
              onChange={(event) => setRecipient(event.target.value.trim())}
              error={!!recipient && !validRecipient}
              helperText={
                !!recipient && !validRecipient ? <Trans>Not a valid address</Trans> : undefined
              }
              data-cy="recipientInput"
            />
            <Typography variant="helperText" color="text.muted" sx={{ display: 'block', mb: 6 }}>
              <Trans>
                Seized collateral is delivered here, and this is the address checked against the
                property whitelist.
              </Trans>
            </Typography>

            {/* The plan is shown before anything is sent: this is a multi-transaction flow
                and a user who expects one signature will abandon it halfway through. */}
            <Typography variant="subheader1" color="text.secondary" sx={{ mb: 2 }}>
              <Trans>Transactions to sign</Trans>{' '}
              <Typography component="span" variant="secondary14" color="text.muted">
                ({plan.length})
              </Typography>
            </Typography>
            {plan.length === 0 ? (
              <Warning severity="info" sx={{ mb: 0 }}>
                <Trans>Your configuration already matches what is on-chain. Nothing to sign.</Trans>
              </Warning>
            ) : (
              plan.map((step, index) => (
                <Row
                  key={step.key}
                  caption={
                    <Typography variant="secondary14">
                      {index + 1}. {step.label}
                    </Typography>
                  }
                  mb={2}
                >
                  <Typography
                    variant="secondary14"
                    color={
                      statuses[step.key] === 'done'
                        ? 'success.main'
                        : statuses[step.key] === 'failed'
                        ? 'error.main'
                        : 'text.secondary'
                    }
                  >
                    {statuses[step.key] === 'done' ? (
                      <Trans>Done</Trans>
                    ) : statuses[step.key] === 'pending' ? (
                      <Trans>Signing...</Trans>
                    ) : statuses[step.key] === 'failed' ? (
                      <Trans>Failed</Trans>
                    ) : (
                      <Trans>Pending</Trans>
                    )}
                  </Typography>
                </Row>
              ))
            )}

            {error && (
              <Warning severity="error" sx={{ mt: 3, mb: 0 }}>
                {error}
              </Warning>
            )}

            {isWrongNetwork && (
              <Warning severity="warning" sx={{ mt: 3, mb: 0 }}>
                <Trans>Switch to {currentMarketData.marketTitle} to continue.</Trans>
              </Warning>
            )}
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
          nextDisabled={submitting || isWrongNetwork || !validRecipient || plan.length === 0}
          nextLabel={
            submitting ? <Trans>Confirming...</Trans> : <Trans>Confirm &amp; activate</Trans>
          }
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
