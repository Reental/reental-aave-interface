/**
 * ERC20Service.approvedAmount() reports an unlimited (MAX_UINT) allowance as -1 rather
 * than a huge number, so a plain `> 0` check reads an unlimited approval as "nothing
 * approved". Route every allowance check through these helpers.
 */
export const UNLIMITED_ALLOWANCE = -1;

export const isUnlimitedAllowance = (allowance?: number) => allowance === UNLIMITED_ALLOWANCE;

/** True when the router can pull any amount at all, unlimited included. */
export const hasAllowance = (allowance?: number) =>
  allowance !== undefined && (isUnlimitedAllowance(allowance) || allowance > 0);
