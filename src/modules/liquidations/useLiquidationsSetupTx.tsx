import { PopulatedTransaction } from '@ethersproject/contracts';
import { useQueryClient } from '@tanstack/react-query';
import { constants, ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { useCallback, useState } from 'react';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import {
  BUDGET_USD_DECIMALS,
  SHARED_LIQUIDATION_ROUTER_ABI,
  UNCONSTRAINED_THRESHOLD,
} from 'src/libs/reental/sharedRouter/abi';
import { Mandate } from 'src/libs/reental/sharedRouter/useMandate';
import { useRootStore } from 'src/store/root';
import { getErrorTextFromError, TxAction } from 'src/ui-config/errorMapping';
import { useShallow } from 'zustand/shallow';

import { DepositAllocation, LiquidationDeposit, LiquidationsConfig } from './types';

/**
 * The transactions behind the setup flow.
 *
 * Configuring a mandate is not one call. The router enforces an order — `register()` first,
 * because every other setter sits behind `require(m.registered)` — and the collateral mode
 * and its budget are set by different functions depending on what is changing. This hook
 * owns that sequencing so the form only has to describe the desired end state.
 *
 * Each step is diffed against the current mandate and skipped when it would be a no-op.
 * That is not an optimisation: every redundant step is a wallet prompt the user has to read
 * and sign, and a setup that asks for six signatures to change one number reads as broken.
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
   * Builds the ordered list of router calls that turns `mandate` into `config`.
   *
   * Exported separately from the runner so the review screen can show exactly what will be
   * signed before anything is sent.
   */
  const planConfig = useCallback(
    (config: LiquidationsConfig, mandate?: Mandate): SetupStep[] => {
      if (!router) return [];

      const iface = new ethers.utils.Interface(SHARED_LIQUIDATION_ROUTER_ABI);
      const call = (key: string, label: string, fn: string, args: unknown[]): SetupStep => ({
        key,
        label,
        tx: { to: router, data: iface.encodeFunctionData(fn, args) },
      });

      const steps: SetupStep[] = [];

      if (!mandate?.registered) {
        steps.push(
          call('register', 'Register as a liquidity provider', 'register', [config.recipient])
        );
      } else if (mandate.recipient.toLowerCase() !== config.recipient.toLowerCase()) {
        steps.push(
          call('recipient', 'Update collateral recipient', 'setRecipient', [config.recipient])
        );
      }

      const wantsPooled = config.collateralMode === 'pooled';
      const isPooled = !!mandate?.acceptsAllCollateral;
      const pooledUsd = config.pooledBudget === '' ? UNLIMITED_USD : toUsd(config.pooledBudget);

      if (wantsPooled) {
        // Switching mode and toping up are different functions. Using the mode switch as a
        // top-up is harmless here (we do want pooled), but using the top-up as a mode switch
        // silently leaves the LP enumerated, so the direction of this test matters.
        if (!isPooled) {
          steps.push(
            call('mode', 'Accept all collateral from one pooled budget', 'setAcceptAllCollateral', [
              true,
              pooledUsd,
            ])
          );
        } else if (mandate?.globalBudget !== pooledUsd) {
          steps.push(
            call('pooled-budget', 'Set the pooled budget', 'setGlobalCollateralBudget', [pooledUsd])
          );
        }
      } else {
        if (isPooled) {
          steps.push(
            call('mode', 'Fund selected assets only', 'setAcceptAllCollateral', [false, '0'])
          );
        }

        const desired = new Map(
          config.acceptedCollaterals.map((collateral) => [
            collateral.underlyingAsset.toLowerCase(),
            collateral.mode === 'all' ? UNLIMITED_USD : toUsd(collateral.amount),
          ])
        );

        desired.forEach((amountUsd, asset) => {
          const current = mandate?.budgets.find((budget) => budget.asset.toLowerCase() === asset);
          if (current?.budget === amountUsd) return;
          steps.push(
            call(`budget-${asset}`, `Set budget for ${asset.slice(0, 8)}`, 'setCollateralBudget', [
              asset,
              amountUsd,
            ])
          );
        });

        // A budget the user has unticked has to be zeroed explicitly. Leaving it in place
        // would keep funding an asset the review screen says is no longer accepted.
        (mandate?.budgets ?? []).forEach((budget) => {
          if (BigInt(budget.budget) === BigInt(0)) return;
          if (desired.has(budget.asset.toLowerCase())) return;
          steps.push(
            call(
              `budget-${budget.asset.toLowerCase()}`,
              `Stop accepting ${budget.asset.slice(0, 8)}`,
              'setCollateralBudget',
              [budget.asset, '0']
            )
          );
        });
      }

      // A paused mandate would keep being skipped however well it is configured.
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
