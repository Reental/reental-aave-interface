export type AllocationMode = 'all' | 'custom';

export interface DepositAllocation {
  /** The deposit is selected to back liquidations */
  enabled: boolean;
  /** 'all' allocates the full deposit (kept in sync with the balance), 'custom' unlocks the amount input */
  mode: AllocationMode;
  /** Effective amount allocated for liquidations, in token units */
  amount: string;
}

/** Keyed by reserve underlyingAsset (lowercase) */
export type DepositAllocations = Record<string, DepositAllocation>;

export interface CollateralAcceptance {
  /** The user accepts receiving this collateral on liquidations */
  accepted: boolean;
  /** 'all' = no cap on how much can be received, 'custom' caps it at amount */
  mode: AllocationMode;
  /** Max amount the user accepts to receive, in token units (only meaningful for 'custom') */
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
}

export interface LiquidationCollateralOption {
  underlyingAsset: string;
  symbol: string;
  iconSymbol: string;
  name: string;
  priceInUSD: string;
  /** Formatted as a fraction, e.g. '0.05' for a 5% bonus */
  liquidationBonus: string;
}

export interface LiquidationsConfig {
  /** mode 'all' means the full deposit backs liquidations (e.g. unlimited approval), 'custom' caps it at amount */
  allocations: { underlyingAsset: string; mode: AllocationMode; amount: string }[];
  /** mode 'all' means no cap on the amount received, 'custom' caps it at amount */
  acceptedCollaterals: { underlyingAsset: string; mode: AllocationMode; amount: string }[];
}

export interface StoredLiquidationsPosition {
  config: LiquidationsConfig;
  updatedAt: number;
}
