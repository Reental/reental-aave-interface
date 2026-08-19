import { formatUnits } from 'viem';

import { PonderBigInt, PonderRouter, PonderTokenApproval } from './types';

/**
 * Why a router cannot act, distinguished so the UI can say "never set up" rather than
 * "switched off". Both are unarmed, but they are different operator situations.
 */
export type ArmingState = 'armed' | 'revoked' | 'never-approved';

export const getArmingState = (router: {
  isArmed: boolean;
  aTokenAllowance: PonderBigInt | null;
}): ArmingState => {
  if (router.isArmed) return 'armed';
  return router.aTokenAllowance === null ? 'never-approved' : 'revoked';
};

/** The arming approval carries the token metadata needed to render the allowance. */
export const getArmingApproval = (router: PonderRouter): PonderTokenApproval | undefined =>
  router.approvals?.items[0];

/**
 * An unlimited approval never re-emits as it is spent, so the indexed value sits at max
 * forever. Callers must not present it as a precise spendable number.
 */
export const isUnlimitedApproval = (router: PonderRouter) =>
  getArmingApproval(router)?.isStaleRisk ?? false;

/**
 * The committed amount as a decimal string, or null when it cannot be stated precisely
 * (unlimited approval, unknown decimals, or nothing approved).
 *
 * Decimals come from the token relation and are never defaulted: every token here is
 * 6-decimal, so assuming 18 would render 500 USDT as 0.0000000000005.
 */
export const formatAllowance = (router: PonderRouter): string | null => {
  const approval = getArmingApproval(router);
  const raw = router.aTokenAllowance;

  if (raw === null) return null;
  if (approval?.isStaleRisk) return null;

  const decimals = approval?.token?.decimals;
  if (decimals === null || decimals === undefined) return null;

  return formatUnits(BigInt(raw), decimals);
};

/** Raw allowance, for the case where decimals are unknown and guessing would mislead. */
export const rawAllowance = (router: PonderRouter) => router.aTokenAllowance;

export const allowanceSymbol = (router: PonderRouter) =>
  getArmingApproval(router)?.token?.symbol ?? null;

/** Unix seconds from the indexer to a Date, or null. */
export const toDate = (seconds: PonderBigInt | null) =>
  seconds === null ? null : new Date(Number(seconds) * 1000);
