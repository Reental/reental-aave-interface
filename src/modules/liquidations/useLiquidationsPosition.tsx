import { formatUnits } from 'ethers/lib/utils';
import { useMemo } from 'react';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { BUDGET_USD_DECIMALS, UNCONSTRAINED_THRESHOLD } from 'src/libs/reental/sharedRouter/abi';
import { Mandate, useMandate } from 'src/libs/reental/sharedRouter/useMandate';
import { usePonderMandate } from 'src/libs/reental/sharedRouter/usePonderMandate';
import { useRootStore } from 'src/store/root';

import { LiquidationsConfig, StoredLiquidationsPosition } from './types';

/**
 * The user's liquidation position, read from the router rather than persisted locally.
 *
 * This replaces a localStorage mock, and the difference matters beyond plumbing: a position
 * only exists once `register()` has landed on-chain, so an interrupted setup leaves no
 * phantom position behind, and a position configured from another device shows up here.
 *
 * The return keeps the stored-position shape the overview screen was written against, so
 * that component did not have to change.
 */

/** The router treats anything at or above 1e36 as unconstrained. */
const isUnlimited = (value: string) => BigInt(value) >= UNCONSTRAINED_THRESHOLD;

const toConfig = (mandate: Mandate): LiquidationsConfig => ({
  allocations: mandate.debtAssets
    .filter((debtAsset) => BigInt(debtAsset.allowance) > BigInt(0))
    .map((debtAsset) => ({
      underlyingAsset: debtAsset.asset,
      mode: isUnlimited(debtAsset.allowance) ? ('all' as const) : ('custom' as const),
      amount: debtAsset.allowance,
    })),
  collateralMode: mandate.acceptsAllCollateral ? 'pooled' : 'selected',
  acceptedCollaterals: mandate.budgets
    .filter((budget) => BigInt(budget.budget) > BigInt(0))
    .map((budget) => ({
      underlyingAsset: budget.asset,
      mode: budget.unconstrained ? ('all' as const) : ('custom' as const),
      amount: budget.unconstrained ? '' : formatUnits(budget.budget, BUDGET_USD_DECIMALS),
    })),
  pooledBudget: mandate.globalBudgetUnconstrained
    ? ''
    : formatUnits(mandate.globalBudget, BUDGET_USD_DECIMALS),
  recipient: mandate.recipient,
});

export const useLiquidationsPosition = () => {
  const { currentAccount } = useWeb3Context();
  const { reserves } = useAppDataContext();
  const currentMarketData = useRootStore((store) => store.currentMarketData);
  const { data: indexed } = usePonderMandate(currentAccount);

  const collateralAssets = useMemo(
    () =>
      reserves
        .filter(
          (reserve) =>
            !reserve.isFrozen && !reserve.isPaused && reserve.reserveLiquidationThreshold !== '0'
        )
        .map((reserve) => reserve.underlyingAsset),
    [reserves]
  );

  const { data: mandate, isLoading } = useMandate({
    marketData: currentMarketData,
    user: currentAccount,
    collateralAssets,
  });

  const position: StoredLiquidationsPosition | null = useMemo(() => {
    if (!mandate?.registered) return null;

    return {
      config: toConfig(mandate),
      // The indexer is the only source for when this was set up; the contract does not
      // store it. Falling back to now would render a wrong date as if it were real.
      updatedAt: indexed?.lp?.registeredAt ? Number(indexed.lp.registeredAt) * 1000 : 0,
    };
  }, [mandate, indexed?.lp?.registeredAt]);

  return { position, mandate, loading: isLoading };
};
