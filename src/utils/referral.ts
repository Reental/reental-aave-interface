import type { MarketDataType } from 'src/ui-config/marketsConfig';
import referralCodes from 'src/ui-config/referralCodes.json';

// Aave V3 `referralCode` is a uint16 indexed in the Pool `Supply` event. 0 means "no referral".
export const REFERRAL_QUERY_PARAM = 'referral_code';
export const REFERRAL_STORAGE_KEY = 'reental_referral_v1';
export const REFERRAL_TTL_DAYS = 30;
const REFERRAL_TTL_MS = REFERRAL_TTL_DAYS * 24 * 60 * 60 * 1000;
const NO_REFERRAL = '0';
const MAX_REFERRAL_CODE = 65535;

type StoredReferral = {
  slug: string;
  code: number;
  ts: number;
};

const whitelist: Record<string, number> = referralCodes;

const isValidCode = (code: unknown): code is number =>
  typeof code === 'number' && Number.isInteger(code) && code >= 1 && code <= MAX_REFERRAL_CODE;

const lookupCode = (slug: string): number | undefined => {
  if (!Object.prototype.hasOwnProperty.call(whitelist, slug)) return undefined;
  const code = whitelist[slug];
  return isValidCode(code) ? code : undefined;
};

/**
 * Reads `?referral_code=<slug>` from the current URL and, if the slug is whitelisted,
 * persists it (last-touch: always overwrites). Unknown slugs are ignored.
 */
export const captureReferralCode = (): void => {
  if (typeof window === 'undefined') return;
  try {
    const raw = new URLSearchParams(window.location.search).get(REFERRAL_QUERY_PARAM);
    if (!raw) return;
    const slug = raw.trim().toLowerCase();
    const code = lookupCode(slug);
    if (code === undefined) return;
    const referral: StoredReferral = { slug, code, ts: Date.now() };
    window.localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(referral));
  } catch {
    // storage unavailable (private mode, blocked site data...): ignore
  }
};

/**
 * Returns the referral code to send on-chain, as a string (contract-helpers expects `string`).
 * Falls back to '0' when missing, expired, corrupted or no longer whitelisted.
 */
export const getReferralCode = (): string => {
  if (typeof window === 'undefined') return NO_REFERRAL;
  try {
    const raw = window.localStorage.getItem(REFERRAL_STORAGE_KEY);
    if (!raw) return NO_REFERRAL;
    const stored = JSON.parse(raw) as Partial<StoredReferral> | null;
    if (!stored || typeof stored.slug !== 'string' || typeof stored.ts !== 'number') {
      return NO_REFERRAL;
    }
    if (Date.now() - stored.ts > REFERRAL_TTL_MS) return NO_REFERRAL;
    // Always resolve against the current whitelist so removing a partner disables it.
    const code = lookupCode(stored.slug);
    return code === undefined ? NO_REFERRAL : code.toString();
  } catch {
    return NO_REFERRAL;
  }
};

/**
 * Referral code to send for a deposit on the given market: the stored partner code when the
 * market has `enabledFeatures.referralCode`, '0' otherwise.
 */
export const getReferralCodeForMarket = (
  marketData: Pick<MarketDataType, 'enabledFeatures'> | undefined
): string => (marketData?.enabledFeatures?.referralCode ? getReferralCode() : NO_REFERRAL);
