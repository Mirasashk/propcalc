import { Decimal } from 'decimal.js';
import { calculateMortgage, calculateMonthlyPayment, generateAmortizationSchedule } from '../../src/engine/mortgage';
import { MortgageInput } from '../../src/engine/types';

describe('calculateMonthlyPayment', () => {
  it('calculates monthly payment for standard 30-year mortgage', () => {
    const principal = new Decimal(300000);
    const monthlyRate = new Decimal(0.065).dividedBy(12);
    const totalPayments = 360;

    const result = calculateMonthlyPayment(principal, monthlyRate, totalPayments);
    expect(parseFloat(result.toFixed(2))).toBe(1896.20);
  });

  it('calculates monthly payment for $500k at 7%', () => {
    const principal = new Decimal(500000);
    const monthlyRate = new Decimal(0.07).dividedBy(12);
    const totalPayments = 360;

    const result = calculateMonthlyPayment(principal, monthlyRate, totalPayments);
    expect(parseFloat(result.toFixed(2))).toBe(3326.51);
  });

  it('handles 0% interest rate', () => {
    const principal = new Decimal(300000);
    const monthlyRate = new Decimal(0);
    const totalPayments = 360;

    const result = calculateMonthlyPayment(principal, monthlyRate, totalPayments);
    expect(result.toNumber()).toBe(300000 / 360);
  });

  it('handles 15-year term', () => {
    const principal = new Decimal(300000);
    const monthlyRate = new Decimal(0.065).dividedBy(12);
    const totalPayments = 180;

    const result = calculateMonthlyPayment(principal, monthlyRate, totalPayments);
    expect(parseFloat(result.toFixed(2))).toBe(2613.32);
  });
});

describe('generateAmortizationSchedule', () => {
  it('generates correct number of entries for 30-year term', () => {
    const principal = new Decimal(300000);
    const monthlyRate = new Decimal(0.065).dividedBy(12);
    const totalPayments = 360;
    const monthlyPayment = calculateMonthlyPayment(principal, monthlyRate, totalPayments);

    const schedule = generateAmortizationSchedule(principal, monthlyRate, totalPayments, monthlyPayment);
    expect(schedule.length).toBe(360);
  });

  it('first month has correct values for standard mortgage', () => {
    const principal = new Decimal(300000);
    const monthlyRate = new Decimal(0.065).dividedBy(12);
    const totalPayments = 360;
    const monthlyPayment = calculateMonthlyPayment(principal, monthlyRate, totalPayments);

    const schedule = generateAmortizationSchedule(principal, monthlyRate, totalPayments, monthlyPayment);
    const firstMonth = schedule[0];

    expect(firstMonth.month).toBe(1);
    expect(parseFloat(firstMonth.interest.toFixed(2))).toBe(1625.00);
    expect(parseFloat(firstMonth.principal.toFixed(2))).toBe(271.20);
    expect(parseFloat(firstMonth.payment.toFixed(2))).toBe(1896.20);
  });

  it('last month balance is zero or near zero', () => {
    const principal = new Decimal(300000);
    const monthlyRate = new Decimal(0.065).dividedBy(12);
    const totalPayments = 360;
    const monthlyPayment = calculateMonthlyPayment(principal, monthlyRate, totalPayments);

    const schedule = generateAmortizationSchedule(principal, monthlyRate, totalPayments, monthlyPayment);
    const lastMonth = schedule[schedule.length - 1];

    expect(lastMonth.balance).toBeLessThanOrEqual(1);
  });

  it('0% interest schedule has equal principal each month', () => {
    const principal = new Decimal(300000);
    const monthlyRate = new Decimal(0);
    const totalPayments = 360;
    const monthlyPayment = calculateMonthlyPayment(principal, monthlyRate, totalPayments);

    const schedule = generateAmortizationSchedule(principal, monthlyRate, totalPayments, monthlyPayment);
    expect(schedule[0].principal).toBe(300000 / 360);
    expect(schedule[0].interest).toBe(0);
    expect(schedule[schedule.length - 1].balance).toBeLessThan(0.0001);
  });
});

describe('calculateMortgage', () => {
  it('calculates standard $300k 6.5% 30-year mortgage correctly', () => {
    const input: MortgageInput = {
      loanAmount: 300000,
      interestRate: 6.5,
      loanTermYears: 30,
    };

    const result = calculateMortgage(input);

    expect(parseFloat(result.monthlyPayment.toFixed(2))).toBe(1896.20);
    expect(result.amortizationSchedule.length).toBe(360);
    expect(result.totalCost).toBeGreaterThan(0);
    expect(result.totalInterest).toBeGreaterThan(0);
  });

  it('calculates standard $500k 7% 30-year mortgage correctly', () => {
    const input: MortgageInput = {
      loanAmount: 500000,
      interestRate: 7.0,
      loanTermYears: 30,
    };

    const result = calculateMortgage(input);

    expect(parseFloat(result.monthlyPayment.toFixed(2))).toBe(3326.51);
    expect(result.amortizationSchedule.length).toBe(360);
  });

  it('handles 0% interest rate', () => {
    const input: MortgageInput = {
      loanAmount: 300000,
      interestRate: 0,
      loanTermYears: 30,
    };

    const result = calculateMortgage(input);

    expect(result.monthlyPayment).toBe(300000 / 360);
    expect(result.totalInterest).toBe(0);
    expect(result.totalCost).toBe(300000);
  });

  it('handles 15-year term', () => {
    const input: MortgageInput = {
      loanAmount: 300000,
      interestRate: 6.5,
      loanTermYears: 15,
    };

    const result = calculateMortgage(input);

    expect(parseFloat(result.monthlyPayment.toFixed(2))).toBe(2613.32);
    expect(result.amortizationSchedule.length).toBe(180);
  });

  it('handles down payment', () => {
    const input: MortgageInput = {
      loanAmount: 300000,
      interestRate: 6.5,
      loanTermYears: 30,
      downPayment: 50000,
    };

    const result = calculateMortgage(input);

    // Principal should be 250000
    const expectedMonthly = calculateMonthlyPayment(
      new Decimal(250000),
      new Decimal(0.065).dividedBy(12),
      360
    );
    expect(parseFloat(result.monthlyPayment.toFixed(2))).toBe(parseFloat(expectedMonthly.toFixed(2)));
  });

  it('throws error for negative loan amount', () => {
    const input: MortgageInput = {
      loanAmount: -100000,
      interestRate: 6.5,
      loanTermYears: 30,
    };

    expect(() => calculateMortgage(input)).toThrow('Loan amount must be a positive number');
  });

  it('throws error for 0 loan amount', () => {
    const input: MortgageInput = {
      loanAmount: 0,
      interestRate: 6.5,
      loanTermYears: 30,
    };

    expect(() => calculateMortgage(input)).toThrow('Loan amount must be a positive number');
  });

  it('throws error for negative interest rate', () => {
    const input: MortgageInput = {
      loanAmount: 300000,
      interestRate: -1,
      loanTermYears: 30,
    };

    expect(() => calculateMortgage(input)).toThrow('Interest rate must be a non-negative number');
  });

  it('throws error for negative loan term', () => {
    const input: MortgageInput = {
      loanAmount: 300000,
      interestRate: 6.5,
      loanTermYears: -10,
    };

    expect(() => calculateMortgage(input)).toThrow('Loan term must be a positive number');
  });

  it('throws error for 0 loan term', () => {
    const input: MortgageInput = {
      loanAmount: 300000,
      interestRate: 6.5,
      loanTermYears: 0,
    };

    expect(() => calculateMortgage(input)).toThrow('Loan term must be a positive number');
  });

  it('throws error for negative down payment', () => {
    const input: MortgageInput = {
      loanAmount: 300000,
      interestRate: 6.5,
      loanTermYears: 30,
      downPayment: -5000,
    };

    expect(() => calculateMortgage(input)).toThrow('Down payment must be a non-negative number');
  });

  it('throws error when down payment equals loan amount', () => {
    const input: MortgageInput = {
      loanAmount: 300000,
      interestRate: 6.5,
      loanTermYears: 30,
      downPayment: 300000,
    };

    expect(() => calculateMortgage(input)).toThrow('Down payment cannot exceed or equal loan amount');
  });

  it('throws error when down payment exceeds loan amount', () => {
    const input: MortgageInput = {
      loanAmount: 300000,
      interestRate: 6.5,
      loanTermYears: 30,
      downPayment: 350000,
    };

    expect(() => calculateMortgage(input)).toThrow('Down payment cannot exceed or equal loan amount');
  });
});
