import {
  computeDebtToCover,
  DebtToCoverInputs,
  percentDiv,
  percentMul,
} from '../computeDebtToCover';

// Same fixture as the contract fork tests: 11 units of an 18-decimal RWA collateral against
// 800 USDC (6-decimal) debt, USDC priced at 1e8, 110% liquidation bonus.
const base: DebtToCoverInputs = {
  debt: 800_000000n, // 800 USDC
  healthFactor: 970000000000000000n, // 0.97
  collateralBalance: 11_000000000000000000n, // 11 RWA (1e18)
  liquidationBonus: 11000n,
  collateralDecimals: 18n,
  debtDecimals: 6n,
  priceDebt: 1_00000000n, // 1e8
  priceCollateral: 88_00000000n, // 88e8
  poolRevision: 4n,
};

describe('percentage math', () => {
  it('matches Aave PercentageMath rounding', () => {
    expect(percentMul(800_000000n, 5000n)).toBe(400_000000n);
    expect(percentMul(800_000000n, 10000n)).toBe(800_000000n);
    expect(percentDiv(660_000000n, 11000n)).toBe(600_000000n);
  });
});

describe('computeDebtToCover', () => {
  it('applies the 50% close factor above HF 0.95 (not collateral limited)', () => {
    const result = computeDebtToCover(base);
    expect(result.liquidatable).toBe(true);
    expect(result.closeFactorBps).toBe(5000n);
    expect(result.collateralLimited).toBe(false);
    expect(result.debtToCover).toBe(400_000000n);
  });

  it('allows 100% of the debt at or below HF 0.95 when collateral covers it', () => {
    // HF 0.935, RWA at 85e8 -> collateral value 935 > 880 needed, so close factor binds at 100%.
    const result = computeDebtToCover({
      ...base,
      healthFactor: 935000000000000000n,
      priceCollateral: 85_00000000n,
    });
    expect(result.closeFactorBps).toBe(10000n);
    expect(result.collateralLimited).toBe(false);
    expect(result.debtToCover).toBe(800_000000n);
  });

  it('is capped by collateral when the collateral cannot cover the repayment', () => {
    // RWA crashes to 60e8: 11 * 60 = 660 collateral value, below the 880 needed to repay 800.
    const result = computeDebtToCover({
      ...base,
      healthFactor: 700000000000000000n, // 0.70 -> 100% close factor
      priceCollateral: 60_00000000n,
    });
    expect(result.closeFactorBps).toBe(10000n);
    expect(result.collateralLimited).toBe(true);
    // Exact figure from the formula: percentDiv(660e6, 11000) = 600e6.
    expect(result.debtToCover).toBe(600_000000n);
  });

  it('flags a non-liquidatable borrower at HF >= 1', () => {
    const result = computeDebtToCover({ ...base, healthFactor: 1000000000000000000n });
    expect(result.liquidatable).toBe(false);
  });

  it('falls back to the full debt on an unsupported pool revision', () => {
    const result = computeDebtToCover({ ...base, poolRevision: 5n });
    expect(result.usedFallback).toBe(true);
    expect(result.debtToCover).toBe(800_000000n);
  });

  it('caps the result at a user-entered amount', () => {
    const result = computeDebtToCover(base, 150_000000n);
    expect(result.debtToCover).toBe(150_000000n);
  });

  it('ignores a user amount larger than what Aave would repay', () => {
    const result = computeDebtToCover(base, 999_000000n);
    expect(result.debtToCover).toBe(400_000000n);
  });
});
