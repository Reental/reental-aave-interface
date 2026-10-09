/**
 * @jest-environment node
 */
import { captureReferralCode, getReferralCode } from '../referral';

jest.mock('src/ui-config/referralCodes.json', () => ({ 'partner-a': 1 }));

describe('referral codes (SSR)', () => {
  it('is a no-op and returns 0 without window', () => {
    expect(typeof window).toBe('undefined');
    expect(() => captureReferralCode()).not.toThrow();
    expect(getReferralCode()).toEqual('0');
  });
});
