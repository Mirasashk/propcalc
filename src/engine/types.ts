import { Decimal } from 'decimal.js';

export interface Money {
  amount: Decimal;
  currency: string;
}

export interface AmortizationEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface MortgageInput {
  loanAmount: number;
  interestRate: number; // annual, e.g. 6.5
  loanTermYears: number; // 1-30
  downPayment?: number;
}

export interface MortgageResult {
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  amortizationSchedule: AmortizationEntry[];
}

export interface ROIInput {
  purchasePrice: number;
  downPayment: number;
  closingCosts: number;
  rehabCosts: number;
  monthlyRent: number;
  monthlyExpenses: number;
  vacancyRate: number; // e.g. 0.05 for 5%
  appreciationRate?: number; // annual, e.g. 0.03 for 3%
  holdingPeriodYears: number;
}

export interface ROIResult {
  cashOnCashReturn: number; // percentage
  annualCashFlow: number;
  totalReturn: number;
  capRate: number;
}

export interface CapRateInput {
  purchasePrice: number;
  grossAnnualRent: number;
  operatingExpenses: number;
  vacancyRate: number;
}

export interface CapRateResult {
  capRate: number; // percentage
  noi: number; // net operating income
}

export interface RentVsBuyInput {
  monthlyRent: number;
  homePrice: number;
  downPayment: number;
  interestRate: number;
  loanTermYears: number;
  annualRentIncrease: number; // e.g. 0.03 for 3%
  annualHomeAppreciation: number; // e.g. 0.03 for 3%
  yearsToCompare: number;
}

export interface RentVsBuyResult {
  rentTotalCost: number;
  buyTotalCost: number;
  breakEvenYear: number | null;
  recommendation: 'rent' | 'buy' | 'tie';
}

export interface FixFlipInput {
  purchasePrice: number;
  rehabCosts: number;
  arv: number; // after repair value
  holdingCosts: number;
  sellingCosts: number; // agent fees, closing, etc.
  holdingPeriodMonths: number;
}

export interface FixFlipResult {
  totalInvestment: number;
  profit: number;
  profitMargin: number; // percentage
  roi: number; // percentage
}

export interface PropertyComparisonInput {
  properties: Array<{
    name: string;
    price: number;
    rent: number;
    expenses: number;
  }>;
}

export interface PropertyComparisonResult {
  comparisons: Array<{
    name: string;
    capRate: number;
    cashOnCash: number;
    monthlyCashFlow: number;
  }>;
  bestCapRate: string;
  bestCashFlow: string;
}

export type CalculatorInput =
  | MortgageInput
  | ROIInput
  | CapRateInput
  | RentVsBuyInput
  | FixFlipInput
  | PropertyComparisonInput;

export type CalculatorResult =
  | MortgageResult
  | ROIResult
  | CapRateResult
  | RentVsBuyResult
  | FixFlipResult
  | PropertyComparisonResult;
