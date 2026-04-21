import { create } from 'zustand';
import type { CalculatorInput, CalculatorResult } from '../engine/types';

interface CalculationRecord {
  id: string;
  type: string;
  input: CalculatorInput;
  result: CalculatorResult;
  timestamp: number;
}

interface CalcState {
  currentInput: CalculatorInput | null;
  currentResult: CalculatorResult | null;
  currentType: string | null;
  history: CalculationRecord[];
  setCurrentCalculation: (type: string, input: CalculatorInput, result: CalculatorResult) => void;
  addToHistory: (record: CalculationRecord) => void;
  clearHistory: () => void;
  clearCurrent: () => void;
}

export const useCalcStore = create<CalcState>((set) => ({
  currentInput: null,
  currentResult: null,
  currentType: null,
  history: [],
  setCurrentCalculation: (type, input, result) =>
    set({ currentType: type, currentInput: input, currentResult: result }),
  addToHistory: (record) =>
    set((state) => ({ history: [record, ...state.history] })),
  clearHistory: () => set({ history: [] }),
  clearCurrent: () => set({ currentType: null, currentInput: null, currentResult: null }),
}));
