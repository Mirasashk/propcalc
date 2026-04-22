import { CalculatorInput, CalculatorResult } from '../engine/types';

export interface SavedCalculation {
  id: string;
  type: 'mortgage' | 'roi' | 'capRate';
  inputs: CalculatorInput;
  result: CalculatorResult;
  createdAt: number;
  name?: string;
}
