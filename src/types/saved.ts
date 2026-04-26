import { MortgageInput, MortgageResult, ROIInput, ROIResult, CapRateInput, CapRateResult } from '../engine/types';

export interface BaseSavedCalculation {
  id: string;
  createdAt: number;
  name?: string;
}

export interface SavedMortgageCalculation extends BaseSavedCalculation {
  type: 'mortgage';
  inputs: MortgageInput;
  result: MortgageResult;
}

export interface SavedROICalculation extends BaseSavedCalculation {
  type: 'roi';
  inputs: ROIInput;
  result: ROIResult;
}

export interface SavedCapRateCalculation extends BaseSavedCalculation {
  type: 'capRate';
  inputs: CapRateInput;
  result: CapRateResult;
}

export type SavedCalculation =
  | SavedMortgageCalculation
  | SavedROICalculation
  | SavedCapRateCalculation;
