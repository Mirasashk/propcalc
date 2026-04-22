/**
 * Free tier usage limits
 */
export const FREE_TIER = {
  MAX_SAVED_PROPERTIES: 5,
  MAX_SAVED_CALCULATIONS: 5,
  MAX_COMPARISON_PROPERTIES: 2,
  MAX_HISTORY_ITEMS: 10,
} as const;

/**
 * Pro tier usage limits (unlimited = -1)
 */
export const PRO_TIER = {
  MAX_SAVED_PROPERTIES: -1, // unlimited
  MAX_COMPARISON_PROPERTIES: 5,
  MAX_HISTORY_ITEMS: -1, // unlimited
} as const;

/**
 * Calculator input limits for validation
 */
export const CALCULATOR_LIMITS = {
  MORTGAGE: {
    MIN_LOAN_AMOUNT: 1000,
    MAX_LOAN_AMOUNT: 100_000_000,
    MIN_INTEREST_RATE: 0,
    MAX_INTEREST_RATE: 0.25, // 25%
    MIN_TERM_YEARS: 1,
    MAX_TERM_YEARS: 50,
  },
  ROI: {
    MIN_PURCHASE_PRICE: 1000,
    MAX_PURCHASE_PRICE: 100_000_000,
    MIN_HOLDING_PERIOD: 1,
    MAX_HOLDING_PERIOD: 50,
  },
} as const;
