/**
 * Sizes `debtToCover` for SharedLiquidationRouter.liquidate() so the call asks for exactly what
 * Aave V3.1 will actually repay — no more.
 *
 * The router pulls LP aTokens via `transferFrom` for the full `debtToCover` and only caps that
 * at the borrower's *total* debt. Aave itself repays less whenever the close factor or the
 * borrower's collateral limits it, and the unused amount comes back to the LP as freshly
 * supplied aTokens — but the allowance it consumed is never restored. Observed on a fork: a
 * borrower owing 800 USDC at HF 0.97 had 800 of allowance spent to repay 400. The contract is
 * immutable, so the fix lives here, where the call is built: pass what Aave will repay.
 *
 * Everything is bigint. Floats cannot represent 1e18-scaled health factors or token base units
 * without losing the low digits these ceilings turn on.
 */

// The project targets es2016, where bigint literals (123n) are a syntax error under tsc, so
// every bigint is built with BigInt(...). These shared small values keep the math readable.
const TEN = BigInt(10);
const TWO = BigInt(2);
const HALF_BPS = BigInt(5000);
const BPS = BigInt(10000);

/** Aave's PercentageMath, 1e4 basis. Mirrors the contract's rounding exactly. */
export const percentMul = (value: bigint, percentage: bigint): bigint =>
  (value * percentage + HALF_BPS) / BPS;

export const percentDiv = (value: bigint, percentage: bigint): bigint =>
  (value * BPS + percentage / TWO) / percentage;

/** Health factor is 1e18-scaled; 1e18 is exactly 1.0. */
export const HEALTH_FACTOR_LIQUIDATION_THRESHOLD = BigInt('1000000000000000000');

/**
 * Above this HF the close factor is 50%, at or below it the full debt is liquidatable. This is
 * the V3.1 rule; V3.3 changes it (and reverts on dust), which is why an unexpected pool
 * revision falls back to the old whole-debt behaviour instead of applying the 50% cap.
 */
export const CLOSE_FACTOR_HF_THRESHOLD = BigInt('950000000000000000');

export const DEFAULT_CLOSE_FACTOR_BPS = HALF_BPS;
export const MAX_CLOSE_FACTOR_BPS = BPS;

/** The pool revision whose liquidation math this helper mirrors. */
export const SUPPORTED_POOL_REVISION = BigInt(4);

export interface DebtToCoverInputs {
  /** Borrower's total debt in the debt asset (variable + stable), in debt-asset base units. */
  debt: bigint;
  /** Borrower health factor, 1e18-scaled. */
  healthFactor: bigint;
  /** Borrower's aToken balance of the collateral, in collateral base units. */
  collateralBalance: bigint;
  /** From the collateral reserve config, e.g. 11000 = 110%. */
  liquidationBonus: bigint;
  /** Collateral asset decimals. */
  collateralDecimals: bigint;
  /** Debt asset decimals. */
  debtDecimals: bigint;
  /** Oracle price of the debt asset (oracle base units; both prices share the same base). */
  priceDebt: bigint;
  /** Oracle price of the collateral asset. */
  priceCollateral: bigint;
  /** Pool revision from POOL_REVISION(); gates the close-factor rule. */
  poolRevision: bigint;
}

export interface DebtToCoverResult {
  /** What to pass as `debtToCover`, in debt-asset base units. */
  debtToCover: bigint;
  /** False when HF >= 1e18 — the borrower is not liquidatable and nothing should be sent. */
  liquidatable: boolean;
  /** 5000 or 10000, in basis points. */
  closeFactorBps: bigint;
  /** Debt repayable under the close factor alone. */
  maxByCloseFactor: bigint;
  /** Debt repayable given the borrower's collateral. */
  maxByCollateral: bigint;
  /** True when collateral, not the close factor, is the binding constraint. */
  collateralLimited: boolean;
  /**
   * True when the pool revision was not the supported one, so the close-factor rule was skipped
   * and debtToCover fell back to the full debt. The caller should log a warning.
   */
  usedFallback: boolean;
}

/**
 * Pure: given the on-chain inputs (and an optional user-entered cap), returns the debtToCover to
 * send plus the reasoning behind it. Mirrors Aave V3.1 LiquidationLogic.
 */
export const computeDebtToCover = (
  inputs: DebtToCoverInputs,
  userAmount?: bigint
): DebtToCoverResult => {
  const {
    debt,
    healthFactor,
    collateralBalance,
    liquidationBonus,
    collateralDecimals,
    debtDecimals,
    priceDebt,
    priceCollateral,
    poolRevision,
  } = inputs;

  const liquidatable = healthFactor < HEALTH_FACTOR_LIQUIDATION_THRESHOLD;

  const capToUser = (value: bigint) =>
    userAmount !== undefined && userAmount < value ? userAmount : value;

  // Unknown revision: the close-factor rule may differ (V3.3 reverts on dust). Fall back to the
  // old whole-debt behaviour rather than guess the new math.
  if (poolRevision !== SUPPORTED_POOL_REVISION) {
    return {
      debtToCover: capToUser(debt),
      liquidatable,
      closeFactorBps: MAX_CLOSE_FACTOR_BPS,
      maxByCloseFactor: debt,
      maxByCollateral: debt,
      collateralLimited: false,
      usedFallback: true,
    };
  }

  // 1. Close factor.
  const closeFactorBps =
    healthFactor > CLOSE_FACTOR_HF_THRESHOLD ? DEFAULT_CLOSE_FACTOR_BPS : MAX_CLOSE_FACTOR_BPS;
  const maxByCloseFactor = percentMul(debt, closeFactorBps);

  // 2. Collateral limit — Aave's _calculateAvailableCollateralToLiquidate.
  const debtUnit = TEN ** debtDecimals;
  const collUnit = TEN ** collateralDecimals;

  const baseCollateral = (priceDebt * maxByCloseFactor * collUnit) / (priceCollateral * debtUnit);
  const maxCollateral = percentMul(baseCollateral, liquidationBonus);

  let maxByCollateral: bigint;
  let collateralLimited: boolean;
  if (maxCollateral > collateralBalance) {
    // Collateral cannot cover the close-factor repayment at the bonus: back out the debt the
    // available collateral actually pays for.
    maxByCollateral = percentDiv(
      (priceCollateral * collateralBalance * debtUnit) / (priceDebt * collUnit),
      liquidationBonus
    );
    collateralLimited = true;
  } else {
    maxByCollateral = maxByCloseFactor;
    collateralLimited = false;
  }

  const debtToCover = capToUser(
    maxByCloseFactor < maxByCollateral ? maxByCloseFactor : maxByCollateral
  );

  return {
    debtToCover,
    liquidatable,
    closeFactorBps,
    maxByCloseFactor,
    maxByCollateral,
    collateralLimited,
    usedFallback: false,
  };
};
