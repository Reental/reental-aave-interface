/**
 * Response shapes for the liquidation-router indexer.
 *
 * Hand-written rather than generated: `reental:codegen` points at the 2FA Ponder instance,
 * and this one only exists on a developer's machine today, so a codegen target for it
 * would break any build that cannot reach localhost. Worth generating once it is deployed.
 *
 * Every `BigInt` arrives as a decimal string and every address/hash comes back lowercase.
 */

export type PonderBigInt = string;

export interface PonderToken {
  address: string;
  /** Nullable: non-compliant mock tokens exist. */
  symbol: string | null;
  /** Nullable, and per-token. Never assume 18. */
  decimals: number | null;
}

export interface PonderTokenApproval {
  value: PonderBigInt;
  isActive: boolean;
  /** Unlimited approval: `value` cannot be trusted as a live spendable number. */
  isStaleRisk: boolean;
  updatedAt: PonderBigInt;
  token: PonderToken | null;
}

export interface PonderRouter {
  address: string;
  type: string;
  backstop: string;
  collateralRecipient: string;
  recipientAdmin: string | null;
  aToken: string;
  /** The underlying debt asset — what a user picks in a token selector. */
  token: string;
  maxDebtPerLiquidation: PonderBigInt | null;
  /** null = never approved; "0" = approved then revoked. Both are unarmed. */
  aTokenAllowance: PonderBigInt | null;
  isArmed: boolean;
  allowanceUpdatedAt: PonderBigInt | null;
  pendingRecipient: string | null;
  pendingRecipientEta: PonderBigInt | null;
  liquidationCount: number;
  totalDebtCovered: PonderBigInt;
  totalCollateralSeized: PonderBigInt;
  createdAtBlock: PonderBigInt;
  createdAtTimestamp: PonderBigInt;
  createdAtTxHash: string;
  approvals: { items: PonderTokenApproval[] } | null;
}

export interface PonderLiquidation {
  id: string;
  routerAddress: string;
  caller: string;
  borrower: string;
  collateralAsset: string;
  /** Net underlying consumed, NOT the amount the liquidator requested. */
  debtCovered: PonderBigInt;
  collateralSeized: PonderBigInt;
  residual: PonderBigInt;
  timestamp: PonderBigInt;
  txHash: string;
  router: { address: string; token: string } | null;
}

export interface PonderSyncStatus {
  [chain: string]: { id: number; block: { number: number; timestamp: number } } | null;
}
