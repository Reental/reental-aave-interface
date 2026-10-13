import referralCodes from 'src/ui-config/referralCodes.json';

import {
  captureReferralCode,
  getReferralCode,
  getReferralCodeForMarket,
  REFERRAL_STORAGE_KEY,
  REFERRAL_TTL_DAYS,
} from '../referral';

jest.mock('src/ui-config/referralCodes.json', () => ({}));

const mockReferralCodes = referralCodes as Record<string, number>;

const DAY_MS = 24 * 60 * 60 * 1000;

const setSearch = (search: string) => {
  window.history.replaceState({}, '', `/${search}`);
};

const readStored = () => JSON.parse(window.localStorage.getItem(REFERRAL_STORAGE_KEY) as string);

describe('referral codes', () => {
  beforeEach(() => {
    Object.keys(mockReferralCodes).forEach((key) => delete mockReferralCodes[key]);
    Object.assign(mockReferralCodes, { 'partner-a': 1, 'partner-b': 42 });
    window.localStorage.clear();
    setSearch('');
    jest.useRealTimers();
  });

  it('returns 0 when nothing has been captured', () => {
    captureReferralCode();
    expect(getReferralCode()).toEqual('0');
  });

  it('stores a known slug (trimmed and lowercased)', () => {
    setSearch('?referral_code=%20Partner-A%20');
    captureReferralCode();

    expect(readStored()).toMatchObject({ slug: 'partner-a', code: 1 });
    expect(typeof readStored().ts).toBe('number');
    expect(getReferralCode()).toEqual('1');
  });

  it('ignores an unknown slug and keeps the previous referral', () => {
    setSearch('?referral_code=partner-a');
    captureReferralCode();

    setSearch('?referral_code=unknown-partner');
    captureReferralCode();

    expect(readStored()).toMatchObject({ slug: 'partner-a', code: 1 });
    expect(getReferralCode()).toEqual('1');
  });

  it('overwrites with the last known slug (last-touch)', () => {
    setSearch('?referral_code=partner-a');
    captureReferralCode();

    setSearch('?referral_code=partner-b');
    captureReferralCode();

    expect(readStored()).toMatchObject({ slug: 'partner-b', code: 42 });
    expect(getReferralCode()).toEqual('42');
  });

  it('returns 0 once the referral has expired', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    setSearch('?referral_code=partner-a');
    captureReferralCode();

    jest.setSystemTime(Date.now() + (REFERRAL_TTL_DAYS - 1) * DAY_MS);
    expect(getReferralCode()).toEqual('1');

    jest.setSystemTime(Date.now() + 2 * DAY_MS);
    expect(getReferralCode()).toEqual('0');
  });

  it('returns 0 when the slug is removed from the whitelist', () => {
    setSearch('?referral_code=partner-a');
    captureReferralCode();
    expect(getReferralCode()).toEqual('1');

    delete mockReferralCodes['partner-a'];
    expect(getReferralCode()).toEqual('0');
  });

  it('returns 0 when the stored value is corrupted', () => {
    window.localStorage.setItem(REFERRAL_STORAGE_KEY, '{not json');
    expect(getReferralCode()).toEqual('0');

    window.localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify({ slug: 1, ts: 'x' }));
    expect(getReferralCode()).toEqual('0');

    window.localStorage.setItem(REFERRAL_STORAGE_KEY, 'null');
    expect(getReferralCode()).toEqual('0');
  });

  it('returns 0 when storage access throws', () => {
    const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(getReferralCode()).toEqual('0');
    spy.mockRestore();
  });

  describe('getReferralCodeForMarket', () => {
    beforeEach(() => {
      setSearch('?referral_code=partner-b');
      captureReferralCode();
    });

    it('returns 0 when the market flag is off or missing', () => {
      expect(getReferralCodeForMarket(undefined)).toEqual('0');
      expect(getReferralCodeForMarket({})).toEqual('0');
      expect(getReferralCodeForMarket({ enabledFeatures: {} })).toEqual('0');
      expect(getReferralCodeForMarket({ enabledFeatures: { referralCode: false } })).toEqual('0');
    });

    it('returns the stored code when the market flag is on', () => {
      expect(getReferralCodeForMarket({ enabledFeatures: { referralCode: true } })).toEqual('42');
    });

    it('returns 0 when the flag is on but nothing valid is stored', () => {
      window.localStorage.clear();
      expect(getReferralCodeForMarket({ enabledFeatures: { referralCode: true } })).toEqual('0');
    });
  });
});
