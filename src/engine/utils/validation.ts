/**
 * Validate that a number is within an inclusive range
 */
export function validateNumberRange(
  value: number,
  options: { min?: number; max?: number; fieldName?: string }
): { valid: boolean; error?: string } {
  const { min, max, fieldName = 'Value' } = options;

  if (typeof value !== 'number' || isNaN(value)) {
    return { valid: false, error: `${fieldName} must be a valid number` };
  }

  if (min !== undefined && value < min) {
    return { valid: false, error: `${fieldName} must be at least ${min}` };
  }

  if (max !== undefined && value > max) {
    return { valid: false, error: `${fieldName} must be at most ${max}` };
  }

  return { valid: true };
}

/**
 * Validate that a value is a positive number
 */
export function validatePositive(value: number, fieldName = 'Value'): { valid: boolean; error?: string } {
  return validateNumberRange(value, { min: 0.01, fieldName });
}

/**
 * Validate that a value is a non-negative number
 */
export function validateNonNegative(value: number, fieldName = 'Value'): { valid: boolean; error?: string } {
  return validateNumberRange(value, { min: 0, fieldName });
}
