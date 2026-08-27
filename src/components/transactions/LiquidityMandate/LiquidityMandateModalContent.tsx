import { Trans } from '@lingui/macro';
import { Skeleton, Stack, Switch, TextField, Typography } from '@mui/material';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import React, { useState } from 'react';
import { CompactableTypography, CompactMode } from 'src/components/CompactableTypography';
import { Warning } from 'src/components/primitives/Warning';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { MandateStep, useModalContext } from 'src/hooks/useModal';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { BUDGET_USD_DECIMALS, UNCONSTRAINED_THRESHOLD } from 'src/libs/reental/sharedRouter/abi';
import { useMandate } from 'src/libs/reental/sharedRouter/useMandate';
import { useRootStore } from 'src/store/root';
import { useShallow } from 'zustand/shallow';

import { AssetInput } from '../AssetInput';
import { GasEstimationError } from '../FlowCommons/GasEstimationError';
import { TxSuccessView } from '../FlowCommons/Success';
import { TxModalDetails } from '../FlowCommons/TxModalDetails';
import { ArmActions } from './ArmActions';
import { MandateActions } from './MandateActions';

/**
 * One mandate action per opening.
 *
 * The contract enforces an order — `register` is the only call permitted before a mandate
 * exists, because every other setter sits behind `require(m.registered)`. Anything that
 * would revert on that check is blocked here rather than offered and left to fail.
 */
export const LiquidityMandateModalContent = React.memo(
  ({ step, asset, revoke }: { step: MandateStep; asset?: string; revoke?: boolean }) => {
    const { mainTxState, gasLimit, txError } = useModalContext();
    const { currentAccount, chainId: connectedChainId } = useWeb3Context();
    const { reserves } = useAppDataContext();
    const [currentMarketData] = useRootStore(useShallow((store) => [store.currentMarketData]));

    const router = currentMarketData.addresses.SHARED_LIQUIDATION_ROUTER;
    const isWrongNetwork = connectedChainId !== currentMarketData.chainId;

    const collateralAssets = reserves
      .filter((reserve) => Number(reserve.formattedBaseLTVasCollateral) > 0)
      .map((reserve) => reserve.underlyingAsset);

    const { data: mandate, isLoading } = useMandate({
      marketData: currentMarketData,
      user: currentAccount,
      collateralAssets,
    });

    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');

    const reserveFor = (address?: string) =>
      reserves.find((reserve) => reserve.underlyingAsset.toLowerCase() === address?.toLowerCase());

    if (!router) {
      return (
        <Warning severity="error" sx={{ mt: 4 }}>
          <Trans>No shared liquidation router is configured for this market.</Trans>
        </Warning>
      );
    }

    if (mainTxState.success) {
      return <TxSuccessView action={<Trans>Mandate updated</Trans>} />;
    }

    if (isLoading || !mandate) {
      return (
        <Stack gap={2} sx={{ mt: 4 }}>
          <Skeleton height={44} />
          <Skeleton height={72} />
        </Stack>
      );
    }

    // Everything but registration reverts on require(m.registered).
    if (step !== 'register' && !mandate.registered) {
      return (
        <Warning severity="error" sx={{ mt: 4 }}>
          <Trans>
            You need to register as a liquidity provider before changing anything else. The contract
            rejects every other call until then.
          </Trans>
        </Warning>
      );
    }

    if (step === 'register' && mandate.registered) {
      return (
        <Warning severity="info" sx={{ mt: 4 }}>
          <Trans>
            You are already registered. Use &quot;Change recipient&quot; to point the mandate at a
            different address.
          </Trans>
        </Warning>
      );
    }

    // ---- register / change recipient -------------------------------------------------
    if (step === 'register' || step === 'recipient') {
      const valid = /^0x[a-fA-F0-9]{40}$/.test(recipient);

      return (
        <>
          <Warning severity="info" sx={{ mt: 4, mb: 0 }}>
            <Trans>
              The recipient receives every piece of collateral seized on your behalf. It is also the
              address checked against the collateral whitelist, so budgets only work for assets this
              address is allowed to hold.
            </Trans>
          </Warning>

          <TextField
            fullWidth
            size="small"
            sx={{ mt: 4 }}
            label={<Trans>Recipient address</Trans>}
            placeholder="0x..."
            value={recipient}
            onChange={(event) => setRecipient(event.target.value.trim())}
            error={!!recipient && !valid}
            helperText={!!recipient && !valid ? <Trans>Not a valid address</Trans> : undefined}
            data-cy="mandateRecipientInput"
          />

          {step === 'recipient' && (
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
              <Typography variant="description" color="text.secondary">
                <Trans>Current recipient</Trans>
              </Typography>
              <CompactableTypography variant="secondary14" compactMode={CompactMode.MD}>
                {mandate.recipient}
              </CompactableTypography>
            </Stack>
          )}

          {txError && <GasEstimationError txError={txError} />}

          <MandateActions
            call={{ fn: step === 'register' ? 'register' : 'setRecipient', args: [recipient] }}
            router={router}
            chainId={currentMarketData.chainId}
            isWrongNetwork={isWrongNetwork}
            disabled={!valid}
            actionText={
              step === 'register' ? <Trans>Register</Trans> : <Trans>Change recipient</Trans>
            }
            actionInProgressText={<Trans>Submitting...</Trans>}
          />
        </>
      );
    }

    // ---- arm: approve aTokens to the router ------------------------------------------
    if (step === 'arm') {
      const debtAsset =
        mandate.debtAssets.find((item) => item.asset.toLowerCase() === asset?.toLowerCase()) ??
        mandate.debtAssets[0];
      const reserve = reserveFor(debtAsset?.asset);

      if (!debtAsset || !reserve) {
        return (
          <Warning severity="error" sx={{ mt: 4 }}>
            <Trans>This debt asset is not registered on the router.</Trans>
          </Warning>
        );
      }

      const userReserve = reserves.find((item) => item.underlyingAsset === debtAsset.asset);
      const maxAmount = formatUnits(debtAsset.allowance, reserve.decimals);

      return (
        <>
          <Warning severity={revoke ? 'warning' : 'info'} sx={{ mt: 4, mb: 0 }}>
            {revoke ? (
              <Trans>
                This sets your {reserve.symbol} allowance to 0. You stay registered, but stop
                contributing to liquidations.
              </Trans>
            ) : (
              <Trans>
                Approving your {reserve.symbol} aTokens is what arms you. Without an allowance a
                liquidation reverts on its first line, whatever budget you set.
              </Trans>
            )}
          </Warning>

          {!revoke && (
            <AssetInput
              value={amount}
              onChange={setAmount}
              usdValue="0"
              symbol={reserve.symbol}
              assets={[
                {
                  balance: userReserve?.formattedAvailableLiquidity ?? '0',
                  symbol: reserve.symbol,
                  iconSymbol: reserve.iconSymbol,
                },
              ]}
              disabled={mainTxState.loading}
              balanceText={<Trans>Currently armed</Trans>}
              sx={{ mt: 4 }}
            />
          )}

          <TxModalDetails gasLimit={gasLimit} skipLoad>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="description" color="text.secondary">
                <Trans>Currently armed</Trans>
              </Typography>
              <Typography variant="secondary14">
                {maxAmount} {reserve.symbol}
              </Typography>
            </Stack>
          </TxModalDetails>

          {txError && <GasEstimationError txError={txError} />}

          <ArmActions
            aTokenAddress={debtAsset.aToken}
            router={router}
            amount={amount}
            decimals={reserve.decimals}
            symbol={reserve.symbol}
            chainId={currentMarketData.chainId}
            isWrongNetwork={isWrongNetwork}
            revoke={revoke}
            disabled={!revoke && Number(amount) <= 0}
          />
        </>
      );
    }

    // ---- collateral budget (8-decimal USD) -------------------------------------------
    if (step === 'budget') {
      const budget = mandate.budgets.find(
        (item) => item.asset.toLowerCase() === asset?.toLowerCase()
      );
      const reserve = reserveFor(asset);

      if (!budget || !reserve) {
        return (
          <Warning severity="error" sx={{ mt: 4 }}>
            <Trans>This collateral asset is not part of the current market.</Trans>
          </Warning>
        );
      }

      return (
        <>
          {!budget.whitelisted && (
            <Warning severity="error" sx={{ mt: 4, mb: 0 }}>
              <Trans>
                Your recipient is not whitelisted for {reserve.symbol}. A budget can be set, but you
                will be skipped in liquidations of this collateral.
              </Trans>
            </Warning>
          )}

          {mandate.acceptsAllCollateral && (
            <Warning severity="warning" sx={{ mt: 3, mb: 0 }}>
              <Trans>
                You currently accept all collateral from one pooled budget, so this per-asset budget
                is stored but not spent. It takes effect again if you switch to choosing assets
                individually.
              </Trans>
            </Warning>
          )}

          <Warning severity="info" sx={{ mt: 3, mb: 0 }}>
            <Trans>
              Budgets are denominated in USD, not in tokens. Setting 0 means you do not accept{' '}
              {reserve.symbol} at all.
            </Trans>
          </Warning>

          <TextField
            fullWidth
            size="small"
            type="number"
            sx={{ mt: 4 }}
            label={<Trans>Budget in USD</Trans>}
            placeholder="10000"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            data-cy="mandateBudgetInput"
          />

          <TxModalDetails gasLimit={gasLimit} skipLoad>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="description" color="text.secondary">
                <Trans>Current budget</Trans>
              </Typography>
              <Typography variant="secondary14">
                {budget.unconstrained ? (
                  <Trans>Unlimited</Trans>
                ) : (
                  `$${formatUnits(budget.budget, BUDGET_USD_DECIMALS)}`
                )}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mt: 2 }}
            >
              <Typography variant="description" color="text.secondary">
                <Trans>Remaining</Trans>
              </Typography>
              <Typography variant="secondary14">
                {budget.unconstrained ? (
                  <Trans>Unlimited</Trans>
                ) : (
                  `$${formatUnits(budget.remaining, BUDGET_USD_DECIMALS)}`
                )}
              </Typography>
            </Stack>
          </TxModalDetails>

          {txError && <GasEstimationError txError={txError} />}

          <MandateActions
            call={{
              fn: 'setCollateralBudget',
              args: [
                reserve.underlyingAsset,
                amount ? parseUnits(amount, BUDGET_USD_DECIMALS).toString() : '0',
              ],
            }}
            router={router}
            chainId={currentMarketData.chainId}
            isWrongNetwork={isWrongNetwork}
            disabled={amount === ''}
            actionText={<Trans>Set budget</Trans>}
            actionInProgressText={<Trans>Setting budget...</Trans>}
          />
        </>
      );
    }

    // ---- collateral mode: pooled vs per-asset ----------------------------------------
    // setAcceptAllCollateral is the only call that changes the mode, and it carries a budget
    // with it. Offering it as a plain top-up is how an enumerated LP ends up accepting every
    // property by accident, so the two live behind separate steps.
    if (step === 'acceptAll') {
      const turningOn = !mandate.acceptsAllCollateral;

      return (
        <>
          <Warning severity="info" sx={{ mt: 4, mb: 0 }}>
            {turningOn ? (
              <Trans>
                One pooled budget will fund any property, including ones listed after today. Your
                per-asset budgets are kept and go dormant, so you can switch back without setting
                them up again.
              </Trans>
            ) : (
              <Trans>
                You will only fund the assets you have given an individual budget. Anything without
                one is declined. Your existing per-asset budgets become active again.
              </Trans>
            )}
          </Warning>

          {turningOn && (
            <TextField
              fullWidth
              size="small"
              type="number"
              sx={{ mt: 4 }}
              label={<Trans>Pooled budget in USD</Trans>}
              placeholder="10000"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              data-cy="mandateAcceptAllInput"
            />
          )}

          <TxModalDetails gasLimit={gasLimit} skipLoad>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="description" color="text.secondary">
                <Trans>Current mode</Trans>
              </Typography>
              <Typography variant="secondary14">
                {mandate.acceptsAllCollateral ? (
                  <Trans>All collateral (pooled)</Trans>
                ) : (
                  <Trans>Selected assets only</Trans>
                )}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mt: 2 }}
            >
              <Typography variant="description" color="text.secondary">
                <Trans>Pooled budget</Trans>
              </Typography>
              <Typography variant="secondary14">
                {mandate.globalBudgetUnconstrained ? (
                  <Trans>Unlimited</Trans>
                ) : (
                  `$${formatUnits(mandate.globalBudget, BUDGET_USD_DECIMALS)}`
                )}
              </Typography>
            </Stack>
          </TxModalDetails>

          {txError && <GasEstimationError txError={txError} />}

          <MandateActions
            call={{
              fn: 'setAcceptAllCollateral',
              args: [
                turningOn,
                turningOn && amount ? parseUnits(amount, BUDGET_USD_DECIMALS).toString() : '0',
              ],
            }}
            router={router}
            chainId={currentMarketData.chainId}
            isWrongNetwork={isWrongNetwork}
            disabled={turningOn && amount === ''}
            actionText={
              turningOn ? <Trans>Accept all collateral</Trans> : <Trans>Choose assets</Trans>
            }
            actionInProgressText={<Trans>Submitting...</Trans>}
          />
        </>
      );
    }

    // ---- top up the pooled budget, leaving the mode alone -----------------------------
    if (step === 'globalBudget') {
      return (
        <>
          {!mandate.acceptsAllCollateral && (
            <Warning severity="warning" sx={{ mt: 4, mb: 0 }}>
              <Trans>
                You are funding selected assets only, so the pooled budget is not spent. This sets
                it without changing that — use &quot;Collateral mode&quot; to switch.
              </Trans>
            </Warning>
          )}

          <Warning severity="info" sx={{ mt: 3, mb: 0 }}>
            <Trans>
              This replaces the pooled budget with the amount you enter, in USD. It does not change
              which collateral you accept.
            </Trans>
          </Warning>

          <TextField
            fullWidth
            size="small"
            type="number"
            sx={{ mt: 4 }}
            label={<Trans>Pooled budget in USD</Trans>}
            placeholder="10000"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            data-cy="mandateGlobalBudgetInput"
          />

          <TxModalDetails gasLimit={gasLimit} skipLoad>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="description" color="text.secondary">
                <Trans>Remaining now</Trans>
              </Typography>
              <Typography variant="secondary14">
                {mandate.globalBudgetUnconstrained ? (
                  <Trans>Unlimited</Trans>
                ) : (
                  `$${formatUnits(mandate.globalBudget, BUDGET_USD_DECIMALS)}`
                )}
              </Typography>
            </Stack>
          </TxModalDetails>

          {txError && <GasEstimationError txError={txError} />}

          <MandateActions
            call={{
              fn: 'setGlobalCollateralBudget',
              args: [amount ? parseUnits(amount, BUDGET_USD_DECIMALS).toString() : '0'],
            }}
            router={router}
            chainId={currentMarketData.chainId}
            isWrongNetwork={isWrongNetwork}
            disabled={amount === ''}
            actionText={<Trans>Set pooled budget</Trans>}
            actionInProgressText={<Trans>Setting budget...</Trans>}
          />
        </>
      );
    }

    // ---- per-liquidation debt cap (token decimals) -----------------------------------
    if (step === 'maxDebt') {
      const debtAsset =
        mandate.debtAssets.find((item) => item.asset.toLowerCase() === asset?.toLowerCase()) ??
        mandate.debtAssets[0];
      const reserve = reserveFor(debtAsset?.asset);

      if (!debtAsset || !reserve) {
        return (
          <Warning severity="error" sx={{ mt: 4 }}>
            <Trans>This debt asset is not registered on the router.</Trans>
          </Warning>
        );
      }

      return (
        <>
          <Warning severity="info" sx={{ mt: 4, mb: 0 }}>
            <Trans>
              Caps how much {reserve.symbol} debt you cover in a single liquidation. This one is in{' '}
              {reserve.symbol}, not USD. Zero is a real limit of zero: leave it unset and you fund
              nothing, however much you have approved.
            </Trans>
          </Warning>

          <TextField
            fullWidth
            size="small"
            type="number"
            sx={{ mt: 4 }}
            label={<Trans>Max debt per liquidation ({reserve.symbol})</Trans>}
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            data-cy="mandateMaxDebtInput"
          />

          <TxModalDetails gasLimit={gasLimit} skipLoad>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="description" color="text.secondary">
                <Trans>Current cap</Trans>
              </Typography>
              <Typography variant="secondary14">
                {debtAsset.maxDebt === '0' ? (
                  <Trans>Not set — funds nothing</Trans>
                ) : BigInt(debtAsset.maxDebt) >= UNCONSTRAINED_THRESHOLD ? (
                  <Trans>No limit</Trans>
                ) : (
                  `${formatUnits(debtAsset.maxDebt, reserve.decimals)} ${reserve.symbol}`
                )}
              </Typography>
            </Stack>
          </TxModalDetails>

          {txError && <GasEstimationError txError={txError} />}

          <MandateActions
            call={{
              fn: 'setMaxDebtPerLiquidation',
              args: [
                debtAsset.asset,
                amount ? parseUnits(amount, reserve.decimals).toString() : '0',
              ],
            }}
            router={router}
            chainId={currentMarketData.chainId}
            isWrongNetwork={isWrongNetwork}
            disabled={amount === ''}
            actionText={<Trans>Set cap</Trans>}
            actionInProgressText={<Trans>Setting cap...</Trans>}
          />
        </>
      );
    }

    // ---- enable / disable ------------------------------------------------------------
    return (
      <>
        <Warning severity="info" sx={{ mt: 4, mb: 0 }}>
          <Trans>
            Disabling keeps your registration, allowance and budgets intact but takes you out of
            liquidations until you switch back on.
          </Trans>
        </Warning>

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 4 }}>
          <Typography variant="description">
            <Trans>Participating in liquidations</Trans>
          </Typography>
          <Switch checked={mandate.enabled} disabled />
        </Stack>

        {txError && <GasEstimationError txError={txError} />}

        <MandateActions
          call={{ fn: 'setEnabled', args: [!mandate.enabled] }}
          router={router}
          chainId={currentMarketData.chainId}
          isWrongNetwork={isWrongNetwork}
          actionText={mandate.enabled ? <Trans>Disable</Trans> : <Trans>Enable</Trans>}
          actionInProgressText={<Trans>Submitting...</Trans>}
        />
      </>
    );
  }
);
