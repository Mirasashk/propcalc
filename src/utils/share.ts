import Share from 'react-native-share';
import { SavedCalculation } from '../types/saved';

export class ShareError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ShareError';
  }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

/**
 * Build a human-readable text summary of a saved calculation.
 */
export function buildShareText(calculation: SavedCalculation): string {
  const { type, inputs, result, name, createdAt } = calculation;
  const displayName = name ?? `${type.toUpperCase()} Calculation`;
  const dateStr = new Date(createdAt).toLocaleDateString('en-US');

  let body = `🏠 ${displayName}\n📅 ${dateStr}\n\n`;

  switch (type) {
    case 'mortgage': {
      const mi = inputs as { loanAmount: number; interestRate: number; loanTermYears: number; downPayment?: number };
      const mr = result as { monthlyPayment: number; totalInterest: number; totalCost: number };
      body += `💰 Loan: ${formatCurrency(mi.loanAmount)}\n`;
      body += `📉 Rate: ${mi.interestRate}% | Term: ${mi.loanTermYears} years\n`;
      if (mi.downPayment) body += `🏦 Down: ${formatCurrency(mi.downPayment)}\n`;
      body += `\n📊 Results:\n`;
      body += `• Monthly: ${formatCurrency(mr.monthlyPayment)}\n`;
      body += `• Total Interest: ${formatCurrency(mr.totalInterest)}\n`;
      body += `• Total Cost: ${formatCurrency(mr.totalCost)}\n`;
      break;
    }
    case 'roi': {
      const ri = inputs as { purchasePrice: number; downPayment: number; monthlyRent: number; monthlyExpenses: number };
      const rr = result as { cashOnCashReturn: number; annualCashFlow: number; totalReturn: number };
      body += `💰 Purchase: ${formatCurrency(ri.purchasePrice)}\n`;
      body += `🏦 Down: ${formatCurrency(ri.downPayment)}\n`;
      body += `💵 Rent: ${formatCurrency(ri.monthlyRent)}/mo | Expenses: ${formatCurrency(ri.monthlyExpenses)}/mo\n`;
      body += `\n📊 Results:\n`;
      body += `• Cash-on-Cash: ${formatPercent(rr.cashOnCashReturn)}\n`;
      body += `• Annual Cash Flow: ${formatCurrency(rr.annualCashFlow)}\n`;
      body += `• Total Return: ${formatCurrency(rr.totalReturn)}\n`;
      break;
    }
    case 'capRate': {
      const ci = inputs as { purchasePrice: number; grossAnnualRent: number; operatingExpenses: number };
      const cr = result as { capRate: number; noi: number };
      body += `💰 Purchase: ${formatCurrency(ci.purchasePrice)}\n`;
      body += `💵 Gross Rent: ${formatCurrency(ci.grossAnnualRent)}/yr\n`;
      body += `💸 Expenses: ${formatCurrency(ci.operatingExpenses)}/yr\n`;
      body += `\n📊 Results:\n`;
      body += `• Cap Rate: ${formatPercent(cr.capRate)}\n`;
      body += `• NOI: ${formatCurrency(cr.noi)}\n`;
      break;
    }
  }

  body += `\nShared from PropCalc 🏡`;
  return body;
}

/**
 * Open the native share sheet with a text summary of the calculation.
 */
export async function shareCalculation(calculation: SavedCalculation): Promise<void> {
  try {
    const message = buildShareText(calculation);
    await Share.open({
      message,
      title: calculation.name ?? `${calculation.type.toUpperCase()} Calculation`,
    });
  } catch (err) {
    // User cancelling the share sheet throws an error from react-native-share
    if (err instanceof Error && err.message?.includes('cancel')) {
      return;
    }
    throw new ShareError(
      `Failed to share calculation: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}
