import { Decimal } from 'decimal.js';
import { CapRateInput, CapRateResult } from './types';

/**
 * Validate cap rate inputs and throw Error for invalid values
 */
function validateCapRateInput(input: CapRateInput): void {
  const { purchasePrice, grossAnnualRent, operatingExpenses, vacancyRate } = input;

  if (typeof purchasePrice !== 'number' || isNaN(purchasePrice) || purchasePrice <= 0) {
    throw new Error('purchasePrice must be a positive number');
  }

  if (typeof grossAnnualRent !== 'number' || isNaN(grossAnnualRent) || grossAnnualRent <= 0) {
    throw new Error('grossAnnualRent must be a positive number');
  }

  if (typeof operatingExpenses !== 'number' || isNaN(operatingExpenses) || operatingExpenses < 0) {
    throw new Error('operatingExpenses must be a non-negative number');
  }

  if (typeof vacancyRate !== 'number' || isNaN(vacancyRate) || vacancyRate < 0 || vacancyRate > 1) {
    throw new Error('vacancyRate must be between 0 and 1');
  }
}

/**
 * Calculate Cap Rate and Net Operating Income (NOI)
 * for a rental property.
 */
export function calculateCapRate(input: CapRateInput): CapRateResult {
  validateCapRateInput(input);

  const { purchasePrice, grossAnnualRent, operatingExpenses, vacancyRate } = input;

  const purchasePriceD = new Decimal(purchasePrice);
  const grossAnnualRentD = new Decimal(grossAnnualRent);
  const operatingExpensesD = new Decimal(operatingExpenses);
  const vacancyRateD = new Decimal(vacancyRate);

  // NOI = Gross Annual Rent * (1 - Vacancy Rate) - Operating Expenses
  const effectiveGrossIncome = grossAnnualRentD.times(new Decimal(1).minus(vacancyRateD));
  const noi = effectiveGrossIncome.minus(operatingExpensesD);

  // Cap Rate = NOI / Purchase Price
  const capRate = noi.dividedBy(purchasePriceD);

  return {
    capRate: capRate.toNumber(),
    noi: noi.toNumber(),
  };
}
