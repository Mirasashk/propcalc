import { useState, useCallback } from 'react';
import { z } from 'zod';
import type { CalculatorInput, CalculatorResult } from '../engine/types';

interface UseCalculatorOptions<TInput extends CalculatorInput, TResult extends CalculatorResult> {
  schema: z.ZodSchema<TInput>;
  calculate: (input: TInput) => TResult;
}

interface UseCalculatorReturn<TInput, TResult> {
  input: Partial<TInput>;
  result: TResult | null;
  errors: Record<string, string>;
  isCalculating: boolean;
  setField: <K extends keyof TInput>(field: K, value: TInput[K]) => void;
  calculate: () => void;
  reset: () => void;
}

export function useCalculator<TInput extends CalculatorInput, TResult extends CalculatorResult>(
  options: UseCalculatorOptions<TInput, TResult>
): UseCalculatorReturn<TInput, TResult> {
  const { schema, calculate: calcFn } = options;

  const [input, setInput] = useState<Partial<TInput>>({});
  const [result, setResult] = useState<TResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCalculating, setIsCalculating] = useState(false);

  const setField = useCallback(<K extends keyof TInput>(field: K, value: TInput[K]) => {
    setInput((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user edits
    setErrors((prev) => {
      const next = { ...prev };
      delete next[String(field)];
      return next;
    });
  }, []);

  const calculate = useCallback(() => {
    setIsCalculating(true);
    setErrors({});

    try {
      const validated = schema.parse(input);
      const calcResult = calcFn(validated);
      setResult(calcResult);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          const path = e.path.join('.');
          fieldErrors[path] = e.message;
        });
        setErrors(fieldErrors);
      }
      setResult(null);
    } finally {
      setIsCalculating(false);
    }
  }, [input, schema, calcFn]);

  const reset = useCallback(() => {
    setInput({});
    setResult(null);
    setErrors({});
  }, []);

  return {
    input,
    result,
    errors,
    isCalculating,
    setField,
    calculate,
    reset,
  };
}
