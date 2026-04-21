import { Decimal } from 'decimal.js';

/**
 * Calculate compound interest: A = P * (1 + r/n)^(nt)
 * @param principal - Initial amount
 * @param annualRate - Annual interest rate (e.g. 0.065 for 6.5%)
 * @param years - Number of years
 * @param compoundsPerYear - Number of times interest compounds per year (default: 12)
 * @returns Final amount after compound interest
 */
export function compoundInterest(
  principal: number | Decimal,
  annualRate: number,
  years: number,
  compoundsPerYear = 12
): Decimal {
  const p = principal instanceof Decimal ? principal : new Decimal(principal);
  const r = new Decimal(annualRate);
  const n = new Decimal(compoundsPerYear);
  const t = new Decimal(years);

  // (1 + r/n)
  const base = new Decimal(1).plus(r.dividedBy(n));
  // (nt)
  const exponent = n.times(t);

  return p.times(base.pow(exponent));
}

/**
 * Calculate monthly payment for an amortizing loan
 * @param loanAmount - Principal loan amount
 * @param annualRate - Annual interest rate (e.g. 0.065 for 6.5%)
 * @param termYears - Loan term in years
 * @returns Monthly payment amount
 */
export function calculateMonthlyPayment(
  loanAmount: number | Decimal,
  annualRate: number,
  termYears: number
): Decimal {
  const principal = loanAmount instanceof Decimal ? loanAmount : new Decimal(loanAmount);

  // Handle 0% interest rate
  if (annualRate === 0) {
    const months = new Decimal(termYears).times(12);
    return principal.dividedBy(months);
  }

  const monthlyRate = new Decimal(annualRate).dividedBy(12);
  const numPayments = new Decimal(termYears).times(12);

  // M = P * [r(1+r)^n] / [(1+r)^n - 1]
  const onePlusR = new Decimal(1).plus(monthlyRate);
  const numerator = monthlyRate.times(onePlusR.pow(numPayments));
  const denominator = onePlusR.pow(numPayments).minus(1);

  return principal.times(numerator.dividedBy(denominator));
}

/**
 * Generate an amortization schedule
 * @param loanAmount - Principal loan amount
 * @param annualRate - Annual interest rate
 * @param termYears - Loan term in years
 * @returns Array of amortization entries
 */
export function generateAmortizationSchedule(
  loanAmount: number | Decimal,
  annualRate: number,
  termYears: number
): Array<{ month: number; payment: number; principal: number; interest: number; balance: number }> {
  const principal = loanAmount instanceof Decimal ? loanAmount : new Decimal(loanAmount);
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, termYears);
  const numPayments = new Decimal(termYears).times(12).toNumber();
  const monthlyRate = new Decimal(annualRate).dividedBy(12);

  const schedule: Array<{ month: number; payment: number; principal: number; interest: number; balance: number }> = [];
  let balance = principal;

  for (let month = 1; month <= numPayments; month++) {
    const interestPayment = balance.times(monthlyRate);
    const principalPayment = monthlyPayment.minus(interestPayment);
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
