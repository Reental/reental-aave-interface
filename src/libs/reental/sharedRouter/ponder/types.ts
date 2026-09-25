import { SkipReason } from '../abi';

/**
 * Row shapes returned by the liquidation-router indexer.
 *
 * Every numeric field arrives as a decimal *string*, never a number — `BigInt(value)` then
 * format. Passing one through `Number()` loses precision on any realistic budget.
 *
 * Two scales coexist and must not be mixed: anything named `...Usd`, `budgetRemaining` or
 * `globalBudgetRemaining` is 8-decimal USD; `maxDebtPerLiquidation`, `debtContributed`,
 * `collateralReceived` and allowances are in the token's own decimals.
 */

export type PonderLp = {
  address: string;
  recipient: string;
  enabled: boolean;
  /** true = aggregation: one pooled budget funds every RWA. See PonderCollateralOrder. */
  acceptsAllCollateral: boolean;
  /** 8-decimal USD. Only meaningful in aggregation mode. */
  globalBudgetRemaining: string;
  globalBudgetLastSet: string | null;
  registeredAt: string;
};

/**
 * Enumerated mode only. An aggregating LP has NO rows here — its entire appetite lives on
 * the `lp` row, so reading only this table renders such an LP as having no budget.
 */
export type PonderCollateralOrder = {
  lpAddress: string;
  collateralAsset: string;
  /** 8-decimal USD. 0 means declined or exhausted; the router skips either way. */
  budgetRemaining: string;
  totalReceivedUsd: string;
  totalReceivedUnits: string;
  fillCount: number;
  updatedAt: string;
};

export type PonderDebtCap = {
  lpAddress: string;
  debtAsset: string;
  /** Debt-asset decimals, NOT USD. */
  maxDebtPerLiquidation: string;
};

/** One LP's share of one liquidation. */
export type PonderFill = {
  txHash: string;
  logIndex: number;
  lpAddress: string;
  collateralAsset: string;
  debtAsset: string;
  debtContributed: string;
  collateralReceived: string;
  residualReturned: string;
  /** 8-decimal USD debited from the budget. */
  collateralValueUsed: string;
  collateralBudgetLeft: string;
  /** Which of the two budgets `collateralBudgetLeft` refers to. */
  fromGlobalBudget: boolean;
  timestamp: string;
};

/** A candidate the router passed over. Carries no debt asset — join on txHash for that. */
export type PonderSkip = {
  txHash: string;
  lpAddress: string;
  collateralAsset: string;
  reason: number;
  reasonName: SkipReason;
  timestamp: string;
};

export type PonderDebtAssetListing = {
  debtAsset: string;
  aToken: string;
};

export type PonderRouterConfig = {
  address: string;
  yieldPool: string;
  liquidationPool: string;
  whitelist: string;
  manager: string;
  deployedAtBlock: string;
};

/** The arming allowance. version "v2" means the spender is the shared router. */
export type PonderTokenApproval = {
  tokenAddress: string;
  owner: string;
  value: string;
  isArming: boolean;
  /** Unlimited approval: `value` is not a live figure and should not be rendered as one. */
  isStaleRisk: boolean;
};

export type PonderLiquidation = {
  id: string;
  version: string;
  borrower: string;
  collateralAsset: string;
  debtAsset: string | null;
  debtCovered: string;
  collateralSeized: string;
  lpsUsed: number | null;
  caller: string;
  txHash: string;
  timestamp: string;
};

export type PonderPage<T> = { items: T[]; totalCount?: number };
