import { Decimal } from 'decimal.js';
import { ROIInput, ROIResult } from './types';

/**
 * Validate ROI inputs and throw Error for invalid values
 */
function validateROIInput(input: ROIInput): void {
  const {
    purchasePrice,
    downPayment,
    closingCosts,
    rehabCosts,
    monthlyRent,
    monthlyExpenses,
    vacancyRate,
    appreciationRate,
    holdingPeriodYears,
  } = input;

  if (typeof purchasePrice !== 'number' || isNaN(purchasePrice) || purchasePrice <= 0) {
    throw new Error('purchasePrice must be a positive number');
  }

  if (typeof downPayment !== 'number' || isNaN(downPayment) || downPayment < 0) {
    throw new Error('downPayment must be a non-negative number');
  }

  if (typeof closingCosts !== 'number' || isNaN(closingCosts) || closingCosts < 0) {
    throw new Error('closingCosts must be a non-negative number');
  }

  if (typeof rehabCosts !== 'number' || isNaN(rehabCosts) || rehabCosts < 0) {
    throw new Error('rehabCosts must be a non-negative number');
  }

  if (typeof monthlyRent !== 'number' || isNaN(monthlyRent) || monthlyRent <= 0) {
    throw new Error('monthlyRent must be a positive number');
  }

  if (typeof monthlyExpenses !== 'number' || isNaN(monthlyExpenses) || monthlyExpenses < 0) {
    throw new Error('monthlyExpenses must be a non-negative number');
  }

  if (typeof vacancyRate !== 'number' || isNaN(vacancyRate) || vacancyRate < 0 || vacancyRate > 1) {
    throw new Error('vacancyRate must be between 0 and 1');
  }

  if (appreciationRate !== undefined) {
    if (typeof appreciationRate !== 'number' || isNaN(appreciationRate) || appreciationRate < 0) {
      throw new Error('appreciationRate must be a non-negative number');
    }
  }

  if (typeof holdingPeriodYears !== 'number' || isNaN(holdingPeriodYears) || holdingPeriodYears <= 0) {
    throw new Error('holdingPeriodYears must be a positive number');
  }
}

/**
 * Calculate ROI (Cash-on-Cash Return), Cap Rate, and Total Return
 * for a rental property investment.
 */
export function calculateROI(input: ROIInput): ROIResult {
  validateROIInput(input);

  const {
    purchasePrice,
    downPayment,
    closingCosts,
    rehabCosts,
    monthlyRent,
    monthlyExpenses,
    vacancyRate,
    appreciationRate = 0,
    holdingPeriodYears,
  } = input;

  const purchasePriceD = new Decimal(purchasePrice);
  const downPaymentD = new Decimal(downPayment);
  const closingCostsD = new Decimal(closingCosts);
  const rehabCostsD = new Decimal(rehabCosts);
  const monthlyRentD = new Decimal(monthlyRent);
  const monthlyExpensesD = new Decimal(monthlyExpenses);
  const vacancyRateD = new Decimal(vacancyRate);
  const appreciationRateD = new Decimal(appreciationRate);
  const holdingPeriodYearsD = new Decimal(holdingPeriodYears);

  // Cash Invested = Down Payment + Closing Costs + Rehab Costs
  const cashInvested = downPaymentD.plus(closingCostsD).plus(rehabCostsD);

  // Annual Cash Flow = (Monthly Rent * 12 * (1 - Vacancy Rate)) - (Monthly Expenses * 12)
  const grossAnnualRent = monthlyRentD.times(12);
  const effectiveGrossIncome = grossAnnualRent.times(new Decimal(1).minus(vacancyRateD));
  const annualOperatingExpenses = monthlyExpensesD.times(12);
  const annualCashFlow = effectiveGrossIncome.minus(annualOperatingExpenses);

  // Cash-on-Cash Return = Annual Cash Flow / Cash Invested
  let cashOnCashReturn = new Decimal(0);
  if (!cashInvested.isZero()) {
    cashOnCashReturn = annualCashFlow.dividedBy(cashInvested);
  }

  // Cap Rate = Annual Cash Flow / Purchase Price
  const capRate = annualCashFlow.dividedBy(purchasePriceD);

  // Total Return = Annual Cash Flow * Holding Period + Appreciation
  const totalCashFlowReturn = annualCashFlow.times(holdingPeriodYearsD);
  const appreciation = purchasePriceD.times(appreciationRateD).times(holdingPeriodYearsD);
  const totalReturn = totalCashFlowReturn.plus(appreciation);

  return {
    cashOnCashReturn: cashOnCashReturn.toNumber(),
    annualCashFlow: annualCashFlow.toNumber(),
    totalReturn: totalReturn.toNumber(),
    capRate: capRate.toNumber(),
  };
}
