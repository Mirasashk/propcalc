import { calculateCapRate } from '../../src/engine/cap-rate';
import { CapRateInput } from '../../src/engine/types';

describe('calculateCapRate', () => {
  it('calculates standard scenario', () => {
    const input: CapRateInput = {
      purchasePrice: 200000,
      grossAnnualRent: 18000,
      operatingExpenses: 7200,
      vacancyRate: 0.05,
    };

    const result = calculateCapRate(input);

    // NOI = 18000 * 0.95 - 7200 = 17100 - 7200 = 9900
    // Cap Rate = 9900 / 200000 = 0.0495 = 4.95%
    expect(parseFloat(result.noi.toFixed(2))).toBe(9900);
    expect(parseFloat(result.capRate.toFixed(4))).toBeCloseTo(0.0495, 4);
  });

  it('handles 0% vacancy', () => {
    const input: CapRateInput = {
      purchasePrice: 200000,
      grossAnnualRent: 18000,
      operatingExpenses: 7200,
      vacancyRate: 0,
    };

    const result = calculateCapRate(input);

    // NOI = 18000 - 7200 = 10800
    // Cap Rate = 10800 / 200000 = 0.054 = 5.4%
    expect(parseFloat(result.noi.toFixed(2))).toBe(10800);
    expect(parseFloat(result.capRate.toFixed(4))).toBeCloseTo(0.054, 4);
  });

  it('handles break-even: expenses equal effective gross income', () => {
    const input: CapRateInput = {
      purchasePrice: 200000,
      grossAnnualRent: 18000,
      operatingExpenses: 18000,
      vacancyRate: 0,
    };

    const result = calculateCapRate(input);

    // NOI = 18000 - 18000 = 0
    // Cap Rate = 0 / 200000 = 0
    expect(result.noi).toBe(0);
    expect(result.capRate).toBe(0);
  });

  it('handles negative cash flow when expenses exceed effective gross income', () => {
    const input: CapRateInput = {
      purchasePrice: 200000,
      grossAnnualRent: 18000,
      operatingExpenses: 20000,
      vacancyRate: 0.05,
    };

    const result = calculateCapRate(input);

    // NOI = 17100 - 20000 = -2900
    // Cap Rate = -2900 / 200000 = -0.0145 = -1.45%
    expect(parseFloat(result.noi.toFixed(2))).toBe(-2900);
    expect(parseFloat(result.capRate.toFixed(4))).toBeCloseTo(-0.0145, 4);
  });

  it('throws error for negative purchasePrice', () => {
    const input: CapRateInput = {
      purchasePrice: -200000,
      grossAnnualRent: 18000,
      operatingExpenses: 7200,
      vacancyRate: 0.05,
    };

    expect(() => calculateCapRate(input)).toThrow('purchasePrice must be a positive number');
  });

  it('throws error for 0 purchasePrice', () => {
    const input: CapRateInput = {
      purchasePrice: 0,
      grossAnnualRent: 18000,
      operatingExpenses: 7200,
      vacancyRate: 0.05,
    };

    expect(() => calculateCapRate(input)).toThrow('purchasePrice must be a positive number');
  });

  it('throws error for negative grossAnnualRent', () => {
    const input: CapRateInput = {
      purchasePrice: 200000,
      grossAnnualRent: -18000,
      operatingExpenses: 7200,
      vacancyRate: 0.05,
    };

    expect(() => calculateCapRate(input)).toThrow('grossAnnualRent must be a positive number');
  });

  it('throws error for 0 grossAnnualRent', () => {
    const input: CapRateInput = {
      purchasePrice: 200000,
      grossAnnualRent: 0,
      operatingExpenses: 7200,
      vacancyRate: 0.05,
    };

    expect(() => calculateCapRate(input)).toThrow('grossAnnualRent must be a positive number');
  });

  it('throws error for negative operatingExpenses', () => {
    const input: CapRateInput = {
      purchasePrice: 200000,
      grossAnnualRent: 18000,
      operatingExpenses: -7200,
      vacancyRate: 0.05,
    };

    expect(() => calculateCapRate(input)).toThrow('operatingExpenses must be a non-negative number');
  });

  it('throws error for vacancyRate > 1', () => {
    const input: CapRateInput = {
      purchasePrice: 200000,
      grossAnnualRent: 18000,
      operatingExpenses: 7200,
      vacancyRate: 1.5,
    };

    expect(() => calculateCapRate(input)).toThrow('vacancyRate must be between 0 and 1');
  });

  it('throws error for negative vacancyRate', () => {
    const input: CapRateInput = {
      purchasePrice: 200000,
      grossAnnualRent: 18000,
      operatingExpenses: 7200,
      vacancyRate: -0.05,
    };

    expect(() => calculateCapRate(input)).toThrow('vacancyRate must be between 0 and 1');
  });
});
