import { Decimal } from 'decimal.js';
import { MortgageInput, MortgageResult, AmortizationEntry } from './types';

/**
 * Validate mortgage inputs and throw Error for invalid values
 */
function validateMortgageInput(input: MortgageInput): void {
  const { loanAmount, interestRate, loanTermYears, downPayment } = input;

  if (typeof loanAmount !== 'number' || isNaN(loanAmount) || loanAmount <= 0) {
    throw new Error('Loan amount must be a positive number');
  }

  if (typeof interestRate !== 'number' || isNaN(interestRate) || interestRate < 0) {
    throw new Error('Interest rate must be a non-negative number');
  }

  if (typeof loanTermYears !== 'number' || isNaN(loanTermYears) || loanTermYears <= 0) {
    throw new Error('Loan term must be a positive number');
  }

  if (downPayment !== undefined) {
    if (typeof downPayment !== 'number' || isNaN(downPayment) || downPayment < 0) {
      throw new Error('Down payment must be a non-negative number');
    }
    if (downPayment >= loanAmount) {
      throw new Error('Down payment cannot exceed or equal loan amount');
    }
  }
}

/**
 * Calculate monthly payment using standard amortization formula
 * M = P[r(1+r)^n] / [(1+r)^n - 1]
 */
export function calculateMonthlyPayment(
  principal: Decimal,
  monthlyRate: Decimal,
  totalPayments: number
): Decimal {
  const n = new Decimal(totalPayments);

  // Handle 0% interest rate
  if (monthlyRate.isZero()) {
    return principal.dividedBy(n);
  }

  const onePlusR = new Decimal(1).plus(monthlyRate);
  const pow = onePlusR.pow(n);

  const numerator = monthlyRate.times(pow);
  const denominator = pow.minus(1);

  return principal.times(numerator.dividedBy(denominator));
}

/**
 * Generate full amortization schedule
 */
export function generateAmortizationSchedule(
  principal: Decimal,
  monthlyRate: Decimal,
  totalPayments: number,
  monthlyPayment: Decimal
): AmortizationEntry[] {
  const schedule: AmortizationEntry[] = [];
  let balance = principal;

  for (let month = 1; month <= totalPayments; month++) {
    const interestPayment = balance.times(monthlyRate);
    let principalPayment = monthlyPayment.minus(interestPayment);

    // Adjust final payment to clear balance exactly
    if (principalPayment.greaterThan(balance)) {
      principalPayment = balance;
    }

    balance = balance.minus(principalPayment);

    // Prevent negative balance due to rounding
    if (balance.lessThan(0)) {
      balance = new Decimal(0);
    }

    schedule.push({
      month,
      payment: monthlyPayment.toNumber(),
      principal: principalPayment.toNumber(),
      interest: interestPayment.toNumber(),
      balance: balance.toNumber(),
    });
  }

  return schedule;
}

/**
 * Calculate complete mortgage details including amortization schedule
 */
export function calculateMortgage(input: MortgageInput): MortgageResult {
  validateMortgageInput(input);

  const { loanAmount, interestRate, loanTermYears, downPayment = 0 } = input;

  const principal = new Decimal(loanAmount).minus(new Decimal(downPayment));
  const annualRateDecimal = new Decimal(interestRate).dividedBy(100);
  const monthlyRate = annualRateDecimal.dividedBy(12);
  const totalPayments = loanTermYears * 12;

  const monthlyPayment = calculateMonthlyPayment(principal, monthlyRate, totalPayments);
  const amortizationSchedule = generateAmortizationSchedule(
    principal,
    monthlyRate,
    totalPayments,
    monthlyPayment
  );

  const totalCost = monthlyPayment.times(totalPayments);
  const totalInterest = totalCost.minus(principal);

  return {
    monthlyPayment: monthlyPayment.toNumber(),
    totalInterest: totalInterest.toNumber(),
    totalCost: totalCost.toNumber(),
    amortizationSchedule,
  };
}
