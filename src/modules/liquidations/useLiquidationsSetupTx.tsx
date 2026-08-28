import { PopulatedTransaction } from '@ethersproject/contracts';
import { useQueryClient } from '@tanstack/react-query';
import { constants, ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { useCallback, useState } from 'react';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import {
  BUDGET_USD_DECIMALS,
  LpConfig,
  SHARED_LIQUIDATION_ROUTER_ABI,
  UNCONSTRAINED_THRESHOLD,
  UNLIMITED_MAX_DEBT,
} from 'src/libs/reental/sharedRouter/abi';
import { Mandate } from 'src/libs/reental/sharedRouter/useMandate';
import { useRootStore } from 'src/store/root';
import { getErrorTextFromError, TxAction } from 'src/ui-config/errorMapping';
import { useShallow } from 'zustand/shallow';

import { DepositAllocation, LiquidationDeposit, LiquidationsConfig } from './types';

/**
 * The transactions behind the setup flow.
 *
 * Configuring a mandate is now a single router call. `configure` takes the whole `LpConfig`
 * struct and is idempotent — it registers on the first call and updates on every later one —
 * so the ordering this hook used to own is gone, along with the separate register, recipient,
 * mode, budget and cap calls it used to sequence.
 *
 * What is left is still a plan rather than one transaction. The aToken approvals are calls on
 * the aTokens rather than on the router, so they cannot be folded in; and `configure` carries
 * no enabled flag, so resuming a paused mandate keeps its own step.
 *
 * The plan is still diffed against the current mandate and dropped when it would be a no-op.
 * That is not an optimisation: a review screen that asks for a signature to confirm the
 * settings the user already has reads as broken.
 */

export type SetupStep = {
  /** Stable key so a retried step replaces its previous status rather than appending. */
  key: string;
  label: string;
  tx: PopulatedTransaction;
};

export type StepStatus = 'idle' | 'pending' | 'done' | 'failed';

const toUsd = (amount: string) => parseUnits(amount || '0', BUDGET_USD_DECIMALS).toString();

/** 'all' means unlimited, which the router expresses as any value at or above 1e36. */
const UNLIMITED_USD = UNCONSTRAINED_THRESHOLD.toString();

/**
 * The form's desired end state, as the struct `configure` takes.
 *
 * Built from the configuration in full rather than from the diff against the mandate. Every
 * field goes on every call, so it does not matter whether the contract merges the arrays into
 * what is stored or replaces them outright — the one place that distinction would bite is
 * collateral the user has just unticked, and that is passed explicitly as a zero budget rather
 * than omitted. An omitted asset would keep funding a property the review screen has just said
 * is no longer accepted.
 */
const buildLpConfig = (
  config: LiquidationsConfig,
  mandate: Mandate | undefined,
  deposits: LiquidationDeposit[]
): LpConfig => {
  const acceptAll = config.collateralMode === 'pooled';

  const debtAssets: string[] = [];
  const maxDebts: string[] = [];

  /**
   * The per-liquidation limit, which is mandatory rather than optional.
   *
   * An unset limit reads as zero on-chain, not as "no limit", so a provider that has
   * registered, approved and funded a budget still contributes nothing until this is set.
   * Leaving it to an advanced screen produced exactly that: a setup that completes
   * successfully and never fills.
   */
  config.allocations.forEach((allocation) => {
    const deposit = deposits.find(
      (item) => item.underlyingAsset.toLowerCase() === allocation.underlyingAsset.toLowerCase()
    );
    // The router reverts on a debt asset it does not list, which would take the whole
    // configuration down with it rather than just this allocation.
    if (!deposit) return;

    debtAssets.push(allocation.underlyingAsset);
    maxDebts.push(
      allocation.mode === 'all'
        ? UNLIMITED_MAX_DEBT
        : parseUnits(allocation.amount || '0', deposit.decimals).toString()
    );
  });

  const collateralAssets: string[] = [];
  const collateralBudgetsUsd: string[] = [];

  // Read only when acceptAll is false. While aggregating, the pooled budget is the only
  // figure that means anything.
  if (!acceptAll) {
    const desired = new Map(
      config.acceptedCollaterals.map((collateral) => [
        collateral.underlyingAsset.toLowerCase(),
        collateral.mode === 'all' ? UNLIMITED_USD : toUsd(collateral.amount),
      ])
    );

    desired.forEach((amountUsd, asset) => {
      collateralAssets.push(asset);
      collateralBudgetsUsd.push(amountUsd);
    });

    (mandate?.budgets ?? []).forEach((budget) => {
      if (BigInt(budget.budget) === BigInt(0)) return;
      if (desired.has(budget.asset.toLowerCase())) return;
      collateralAssets.push(budget.asset);
      collateralBudgetsUsd.push('0');
    });
  }

  return {
    recipient: config.recipient,
    acceptAll,
    globalBudgetUsd: !acceptAll
      ? '0'
      : config.pooledBudget === ''
      ? UNLIMITED_USD
      : toUsd(config.pooledBudget),
    debtAssets,
    maxDebts,
    collateralAssets,
    collateralBudgetsUsd,
  };
};

/** Whether sending `cfg` would leave the mandate exactly as it already is. */
const matchesMandate = (cfg: LpConfig, mandate: Mandate): boolean => {
  if (mandate.recipient.toLowerCase() !== cfg.recipient.toLowerCase()) return false;
  if (mandate.acceptsAllCollateral !== cfg.acceptAll) return false;
  if (cfg.acceptAll && mandate.globalBudget !== cfg.globalBudgetUsd) return false;

  const debtUnchanged = cfg.debtAssets.every(
    (asset, index) =>
      mandate.debtAssets.find((item) => item.asset.toLowerCase() === asset.toLowerCase())
        ?.maxDebt === cfg.maxDebts[index]
  );
  if (!debtUnchanged) return false;

  // An asset with no budget on record reads as zero, which is what the contract stores for it.
  return cfg.collateralAssets.every(
    (asset, index) =>
      (mandate.budgets.find((item) => item.asset.toLowerCase() === asset.toLowerCase())?.budget ??
        '0') === cfg.collateralBudgetsUsd[index]
  );
};

export const useLiquidationsSetupTx = (router?: string, chainId?: number) => {
  const [estimateGasLimit, generateApproval, user] = useRootStore(
    useShallow((store) => [store.estimateGasLimit, store.generateApproval, store.account])
  );
  const { sendTx } = useWeb3Context();
  const queryClient = useQueryClient();

  const [statuses, setStatuses] = useState<Record<string, StepStatus>>({});
  const [error, setError] = useState<string | undefined>();

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['sharedRouterMandate'] });
    queryClient.invalidateQueries({ queryKey: ['sharedRouterPonderMandate'] });
    queryClient.invalidateQueries({ queryKey: ['sharedRouterFunders'] });
    queryClient.invalidateQueries({ queryKey: ['sharedRouterCandidates'] });
  }, [queryClient]);

  const send = useCallback(
    async (key: string, tx: PopulatedTransaction) => {
      setStatuses((prev) => ({ ...prev, [key]: 'pending' }));
      try {
        const withGas = await estimateGasLimit({ ...tx, from: user }, chainId);
        const response = await sendTx(withGas);
        await response.wait(1);
        setStatuses((prev) => ({ ...prev, [key]: 'done' }));
        return true;
      } catch (caught) {
        setStatuses((prev) => ({ ...prev, [key]: 'failed' }));
        setError(getErrorTextFromError(caught, TxAction.MAIN_ACTION, false).error?.toString());
        return false;
      }
    },
    [estimateGasLimit, sendTx, user, chainId]
  );

  /**
   * Arms one deposit by approving its aToken to the router.
   *
   * The aToken, not the underlying — the deposit keeps earning until a liquidation actually
   * pulls from it. 'all' approves max uint so the allowance stays valid as the deposit grows.
   */
  const approveDeposit = useCallback(
    async (deposit: LiquidationDeposit, allocation: DepositAllocation) => {
      if (!router || !chainId) return false;

      const amount =
        allocation.mode === 'all'
          ? constants.MaxUint256.toString()
          : parseUnits(allocation.amount || '0', deposit.decimals).toString();

      const approval = generateApproval(
        { spender: router, user, token: deposit.aTokenAddress, amount },
        { chainId, amount }
      );

      const ok = await send(`approve-${deposit.underlyingAsset}`, approval);
      if (ok) invalidate();
      return ok;
    },
    [router, chainId, generateApproval, user, send, invalidate]
  );

  /**
   * Builds the router calls that turn `mandate` into `config`.
   *
   * Exported separately from the runner so the review screen can show exactly what will be
   * signed before anything is sent.
   */
  const planConfig = useCallback(
    (
      config: LiquidationsConfig,
      mandate?: Mandate,
      deposits: LiquidationDeposit[] = []
    ): SetupStep[] => {
      if (!router) return [];

      const iface = new ethers.utils.Interface(SHARED_LIQUIDATION_ROUTER_ABI);
      const call = (key: string, label: string, fn: string, args: unknown[]): SetupStep => ({
        key,
        label,
        tx: { to: router, data: iface.encodeFunctionData(fn, args) },
      });

      const steps: SetupStep[] = [];
      const cfg = buildLpConfig(config, mandate, deposits);

      if (!mandate?.registered) {
        steps.push(call('configure', 'Register as a liquidity provider', 'configure', [cfg]));
      } else if (!matchesMandate(cfg, mandate)) {
        steps.push(call('configure', 'Update your liquidation settings', 'configure', [cfg]));
      }

      // configure carries no enabled flag, so a paused mandate would keep being skipped
      // however well the rest of it is configured.
      if (mandate?.registered && !mandate.enabled) {
        steps.push(call('enable', 'Resume participation', 'setEnabled', [true]));
      }

      return steps;
    },
    [router]
  );

  /** Runs a plan in order, stopping at the first failure so later steps cannot revert. */
  const runPlan = useCallback(
    async (steps: SetupStep[]) => {
      setError(undefined);
      for (const step of steps) {
        // eslint-disable-next-line no-await-in-loop
        const ok = await send(step.key, step.tx);
        if (!ok) return false;
      }
      invalidate();
      return true;
    },
    [send, invalidate]
  );

  return { approveDeposit, planConfig, runPlan, statuses, error, setStatuses };
};
