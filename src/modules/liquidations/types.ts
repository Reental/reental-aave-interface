export type AllocationMode = 'all' | 'custom';

/**
 * How the router resolves a collateral budget. These are exclusive on-chain and there is no
 * third state: an LP either pools one budget across every property or funds a chosen list.
 *
 * 'pooled' also covers properties listed *after* the LP configured itself, which is the one
 * thing selecting every asset by hand cannot reproduce.
 */
export type CollateralMode = 'pooled' | 'selected';

export interface DepositAllocation {
  /** The deposit is selected to back liquidations */
  enabled: boolean;
  /** 'all' = unlimited (max uint approval, stays valid as the deposit grows), 'custom' unlocks the amount input */
  mode: AllocationMode;
  /** Amount allocated for liquidations in token units ('' when mode is 'all') */
  amount: string;
}

/** Keyed by reserve underlyingAsset (lowercase) */
export type DepositAllocations = Record<string, DepositAllocation>;

export interface CollateralAcceptance {
  /** The user accepts receiving this collateral on liquidations */
  accepted: boolean;
  /** 'all' = no cap on how much can be received, 'custom' caps it at amount */
  mode: AllocationMode;
  /**
   * Max the user accepts to receive from this collateral, **in USD**.
   *
   * The router denominates every collateral budget in USD (8 decimals), not in token units,
   * so this field cannot be a token amount without mis-sizing the budget by the token price.
   */
  amount: string;
}

/** Keyed by reserve underlyingAsset (lowercase) */
export type AcceptedCollaterals = Record<string, CollateralAcceptance>;

export interface LiquidationDeposit {
  underlyingAsset: string;
  symbol: string;
  iconSymbol: string;
  name: string;
  underlyingBalance: string;
  underlyingBalanceUSD: string;
  supplyAPY: string;
  priceInUSD: string;
  /**
   * The aToken the router pulls from. This — not the underlying — is what gets approved:
   * the deposit keeps earning until a liquidation actually executes.
   */
  aTokenAddress: string;
  decimals: number;
  /** Allowance already granted to the router, in token units. '0' when not armed. */
  currentAllowance: string;
}

export interface LiquidationCollateralOption {
  underlyingAsset: string;
  symbol: string;
  iconSymbol: string;
  name: string;
  priceInUSD: string;
  /** Formatted as a fraction, e.g. '0.05' for a 5% bonus */
  liquidationBonus: string;
  /**
   * Whether the LP's recipient may hold this collateral. A budget on a non-whitelisted
   * asset is accepted by the contract but skipped at fill time, silently.
   */
  whitelisted?: boolean;
}

export interface LiquidationsConfig {
  /** mode 'all' = approve MaxUint256 to the router (amount is ''), 'custom' = approve exactly amount */
  allocations: { underlyingAsset: string; mode: AllocationMode; amount: string }[];
  /** Which of the router's two collateral modes this configuration uses */
  collateralMode: CollateralMode;
  /** 'selected' mode only. mode 'all' means an unlimited budget, 'custom' caps it at amount USD */
  acceptedCollaterals: { underlyingAsset: string; mode: AllocationMode; amount: string }[];
  /** 'pooled' mode only. USD spendable across every property; '' means unlimited */
  pooledBudget: string;
  /** Address the seized collateral is delivered to, and the one the whitelist checks */
  recipient: string;
}

export interface StoredLiquidationsPosition {
  config: LiquidationsConfig;
  updatedAt: number;
}
