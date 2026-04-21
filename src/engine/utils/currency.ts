import { Decimal } from 'decimal.js';

/**
 * Format a number as currency string (USD)
 */
export function formatCurrency(value: number | Decimal, options?: { decimals?: number; prefix?: string }): string {
  const decimals = options?.decimals ?? 2;
  const prefix = options?.prefix ?? '$';
  const num = value instanceof Decimal ? value.toNumber() : value;
  return `${prefix}${num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

/**
 * Parse a currency string to a number
 * Handles: $1,234.56, 1234.56, $1,234
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[$,\s]/g, '');
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed)) {
    throw new Error(`Invalid currency value: "${value}"`);
  }
  return parsed;
}

/**
 * Format a number as percentage string
 */
export function formatPercent(value: number | Decimal, decimals = 2): string {
  const num = value instanceof Decimal ? value.toNumber() : value;
  return `${(num * 100).toFixed(decimals)}%`;
}

/**
 * Parse a percentage string to a decimal number
 * Handles: 5%, 5.5%, 0.055
 */
export function parsePercent(value: string): number {
  const cleaned = value.replace('%', '').trim();
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed)) {
    throw new Error(`Invalid percentage value: "${value}"`);
  }
  // If value > 1, assume it's already in percent form (e.g. 5 = 5%)
  return parsed > 1 ? parsed / 100 : parsed;
}
