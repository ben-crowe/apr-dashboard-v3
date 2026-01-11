/**
 * Calculator Store - Zustand store for Income Approach Calculator
 * 
 * Manages 127 fields:
 * - 49 input fields (user-entered)
 * - 78 calculated output fields
 * - UI state (devMode, selectedPage, zoomLevel)
 */

import { create } from 'zustand';
import { calculateIncomeApproach } from '../calculator/income-calculations';

// Input fields interface (49 fields)
export interface CalculatorInputs {
  // Unit Mix (30 fields - 6 types × 5 fields)
  'calc-type1-name': string;
  'calc-type1-count': number;
  'calc-type1-sf': number;
  'calc-type1-contract-rent': number;
  'calc-type1-rent': number;
  'calc-type2-name': string;
  'calc-type2-count': number;
  'calc-type2-sf': number;
  'calc-type2-contract-rent': number;
  'calc-type2-rent': number;
  'calc-type3-name': string;
  'calc-type3-count': number;
  'calc-type3-sf': number;
  'calc-type3-contract-rent': number;
  'calc-type3-rent': number;
  'calc-type4-name': string;
  'calc-type4-count': number;
  'calc-type4-sf': number;
  'calc-type4-contract-rent': number;
  'calc-type4-rent': number;
  'calc-type5-name': string;
  'calc-type5-count': number;
  'calc-type5-sf': number;
  'calc-type5-contract-rent': number;
  'calc-type5-rent': number;
  'calc-type6-name': string;
  'calc-type6-count': number;
  'calc-type6-sf': number;
  'calc-type6-contract-rent': number;
  'calc-type6-rent': number;
  
  // Other Income (3 fields)
  'calc-parking-per-unit': number;
  'calc-laundry-per-unit': number;
  'calc-other-income-annual': number;
  
  // Vacancy & Loss (4 fields)
  'calc-vacancy-rate': number;
  'calc-concessions-rate': number;
  'calc-credit-loss-rate': number;
  'calc-other-loss-rate': number;
  
  // Operating Expenses (7 fields - annual totals)
  'calc-exp-taxes-annual': number;
  'calc-exp-insurance-annual': number;
  'calc-exp-repairs-annual': number;
  'calc-exp-utilities-annual': number;
  'calc-exp-management-annual': number;
  'calc-exp-reserves-annual': number;
  'calc-exp-other-annual': number;
  
  // Capitalization (5 fields)
  'calc-cap-rate': number;
  'calc-cap-rate-2': number;
  'calc-adj-capex': number;
  'calc-adj-leasing': number;
  'calc-adj-other': number;
}

// Output fields interface (78 calculated fields)
export interface CalculatorOutputs {
  // Unit Mix Totals (5 outputs)
  'calc-total-units': number;
  'calc-total-sf': number;
  'calc-avg-contract-rent': number;
  'calc-avg-market-rent': number;
  'calc-subtotal-annual': number;
  
  // Per-Type Calculations (30 outputs - 6 types × 5 fields)
  'calc-type1-cont-v-market': number;
  'calc-type1-per-unit': number;
  'calc-type1-per-sf': number;
  'calc-type1-annual': number;
  'calc-type1-total-sf': number;
  'calc-type2-cont-v-market': number;
  'calc-type2-per-unit': number;
  'calc-type2-per-sf': number;
  'calc-type2-annual': number;
  'calc-type2-total-sf': number;
  'calc-type3-cont-v-market': number;
  'calc-type3-per-unit': number;
  'calc-type3-per-sf': number;
  'calc-type3-annual': number;
  'calc-type3-total-sf': number;
  'calc-type4-cont-v-market': number;
  'calc-type4-per-unit': number;
  'calc-type4-per-sf': number;
  'calc-type4-annual': number;
  'calc-type4-total-sf': number;
  'calc-type5-cont-v-market': number;
  'calc-type5-per-unit': number;
  'calc-type5-per-sf': number;
  'calc-type5-annual': number;
  'calc-type5-total-sf': number;
  'calc-type6-cont-v-market': number;
  'calc-type6-per-unit': number;
  'calc-type6-per-sf': number;
  'calc-type6-annual': number;
  'calc-type6-total-sf': number;
  
  // Other Income Calculations (3 outputs)
  'calc-parking-annual': number;
  'calc-laundry-annual': number;
  'calc-total-other-income': number;
  
  // Vacancy & Loss Calculations (5 outputs)
  'calc-vacancy-amount': number;
  'calc-total-vacancy-loss': number;
  'calc-total-vacancy-rate': number;
  'calc-vacancy-loss': number; // Alias for total-vacancy-loss
  'calc-vacancy-per-unit': number;
  
  // Revenue Summary (7 outputs)
  'calc-total-rental-revenue': number;
  'calc-pgr': number;
  'calc-pgr-per-unit': number;
  'calc-pgr-per-sf': number;
  'calc-egr': number;
  'calc-egr-per-unit': number;
  'calc-egr-per-sf': number;
  
  // Operating Expenses Calculations (24 outputs)
  // Per-category: per-unit, per-sf, pct-egr (3 × 7 = 21)
  'calc-exp-taxes-per-unit': number;
  'calc-exp-taxes-per-sf': number;
  'calc-exp-taxes-pct-egr': number;
  'calc-exp-insurance-per-unit': number;
  'calc-exp-insurance-per-sf': number;
  'calc-exp-insurance-pct-egr': number;
  'calc-exp-repairs-per-unit': number;
  'calc-exp-repairs-per-sf': number;
  'calc-exp-repairs-pct-egr': number;
  'calc-exp-utilities-per-unit': number;
  'calc-exp-utilities-per-sf': number;
  'calc-exp-utilities-pct-egr': number;
  'calc-exp-management-per-unit': number;
  'calc-exp-management-per-sf': number;
  'calc-exp-management-pct-egr': number;
  'calc-exp-reserves-per-unit': number;
  'calc-exp-reserves-per-sf': number;
  'calc-exp-reserves-pct-egr': number;
  'calc-exp-other-per-unit': number;
  'calc-exp-other-per-sf': number;
  'calc-exp-other-pct-egr': number;
  // Expense Totals (3 outputs)
  'calc-expenses-total': number;
  'calc-expenses-per-unit': number;
  'calc-expense-ratio': number;
  
  // NOI (3 outputs)
  'calc-noi': number;
  'calc-noi-per-unit': number;
  'calc-noi-per-sf': number;
  
  // Capitalization & Value (6 outputs)
  'calc-raw-value': number;
  'calc-adj-total': number;
  'calc-indicated-value': number;
  'calc-value-per-unit': number;
  'calc-value-per-sf': number;
  'calc-grm': number;
}

// Combined state interface
export interface CalculatorState {
  // Input fields (49)
  inputs: CalculatorInputs;
  
  // Output fields (78 calculated)
  outputs: CalculatorOutputs;
  
  // UI state
  devMode: boolean;
  selectedPage: 'page-48' | 'page-49';
  zoomLevel: 'fit' | '100%' | '150%';
}

// Store actions
export interface CalculatorActions {
  updateInput: (fieldId: keyof CalculatorInputs, value: string | number) => void;
  runCalculations: () => void;
  toggleDevMode: () => void;
  setSelectedPage: (page: 'page-48' | 'page-49') => void;
  setZoomLevel: (zoom: 'fit' | '100%' | '150%') => void;
}

// Initial input state (all zeros/empty)
const initialInputs: CalculatorInputs = {
  // Unit Mix (30 fields)
  'calc-type1-name': '',
  'calc-type1-count': 0,
  'calc-type1-sf': 0,
  'calc-type1-contract-rent': 0,
  'calc-type1-rent': 0,
  'calc-type2-name': '',
  'calc-type2-count': 0,
  'calc-type2-sf': 0,
  'calc-type2-contract-rent': 0,
  'calc-type2-rent': 0,
  'calc-type3-name': '',
  'calc-type3-count': 0,
  'calc-type3-sf': 0,
  'calc-type3-contract-rent': 0,
  'calc-type3-rent': 0,
  'calc-type4-name': '',
  'calc-type4-count': 0,
  'calc-type4-sf': 0,
  'calc-type4-contract-rent': 0,
  'calc-type4-rent': 0,
  'calc-type5-name': '',
  'calc-type5-count': 0,
  'calc-type5-sf': 0,
  'calc-type5-contract-rent': 0,
  'calc-type5-rent': 0,
  'calc-type6-name': '',
  'calc-type6-count': 0,
  'calc-type6-sf': 0,
  'calc-type6-contract-rent': 0,
  'calc-type6-rent': 0,
  
  // Other Income (3 fields)
  'calc-parking-per-unit': 0,
  'calc-laundry-per-unit': 0,
  'calc-other-income-annual': 0,
  
  // Vacancy & Loss (4 fields)
  'calc-vacancy-rate': 0,
  'calc-concessions-rate': 0,
  'calc-credit-loss-rate': 0,
  'calc-other-loss-rate': 0,
  
  // Operating Expenses (7 fields)
  'calc-exp-taxes-annual': 0,
  'calc-exp-insurance-annual': 0,
  'calc-exp-repairs-annual': 0,
  'calc-exp-utilities-annual': 0,
  'calc-exp-management-annual': 0,
  'calc-exp-reserves-annual': 0,
  'calc-exp-other-annual': 0,
  
  // Capitalization (5 fields)
  'calc-cap-rate': 0,
  'calc-cap-rate-2': 0,
  'calc-adj-capex': 0,
  'calc-adj-leasing': 0,
  'calc-adj-other': 0,
};

// Initial output state (all zeros)
const initialOutputs: CalculatorOutputs = {
  // Unit Mix Totals
  'calc-total-units': 0,
  'calc-total-sf': 0,
  'calc-avg-contract-rent': 0,
  'calc-avg-market-rent': 0,
  'calc-subtotal-annual': 0,
  
  // Per-Type Calculations (30 outputs)
  'calc-type1-cont-v-market': 0,
  'calc-type1-per-unit': 0,
  'calc-type1-per-sf': 0,
  'calc-type1-annual': 0,
  'calc-type1-total-sf': 0,
  'calc-type2-cont-v-market': 0,
  'calc-type2-per-unit': 0,
  'calc-type2-per-sf': 0,
  'calc-type2-annual': 0,
  'calc-type2-total-sf': 0,
  'calc-type3-cont-v-market': 0,
  'calc-type3-per-unit': 0,
  'calc-type3-per-sf': 0,
  'calc-type3-annual': 0,
  'calc-type3-total-sf': 0,
  'calc-type4-cont-v-market': 0,
  'calc-type4-per-unit': 0,
  'calc-type4-per-sf': 0,
  'calc-type4-annual': 0,
  'calc-type4-total-sf': 0,
  'calc-type5-cont-v-market': 0,
  'calc-type5-per-unit': 0,
  'calc-type5-per-sf': 0,
  'calc-type5-annual': 0,
  'calc-type5-total-sf': 0,
  'calc-type6-cont-v-market': 0,
  'calc-type6-per-unit': 0,
  'calc-type6-per-sf': 0,
  'calc-type6-annual': 0,
  'calc-type6-total-sf': 0,
  
  // Other Income Calculations
  'calc-parking-annual': 0,
  'calc-laundry-annual': 0,
  'calc-total-other-income': 0,
  
  // Vacancy & Loss Calculations
  'calc-vacancy-amount': 0,
  'calc-total-vacancy-loss': 0,
  'calc-total-vacancy-rate': 0,
  'calc-vacancy-loss': 0,
  'calc-vacancy-per-unit': 0,
  
  // Revenue Summary
  'calc-total-rental-revenue': 0,
  'calc-pgr': 0,
  'calc-pgr-per-unit': 0,
  'calc-pgr-per-sf': 0,
  'calc-egr': 0,
  'calc-egr-per-unit': 0,
  'calc-egr-per-sf': 0,
  
  // Operating Expenses Calculations (24 outputs)
  'calc-exp-taxes-per-unit': 0,
  'calc-exp-taxes-per-sf': 0,
  'calc-exp-taxes-pct-egr': 0,
  'calc-exp-insurance-per-unit': 0,
  'calc-exp-insurance-per-sf': 0,
  'calc-exp-insurance-pct-egr': 0,
  'calc-exp-repairs-per-unit': 0,
  'calc-exp-repairs-per-sf': 0,
  'calc-exp-repairs-pct-egr': 0,
  'calc-exp-utilities-per-unit': 0,
  'calc-exp-utilities-per-sf': 0,
  'calc-exp-utilities-pct-egr': 0,
  'calc-exp-management-per-unit': 0,
  'calc-exp-management-per-sf': 0,
  'calc-exp-management-pct-egr': 0,
  'calc-exp-reserves-per-unit': 0,
  'calc-exp-reserves-per-sf': 0,
  'calc-exp-reserves-pct-egr': 0,
  'calc-exp-other-per-unit': 0,
  'calc-exp-other-per-sf': 0,
  'calc-exp-other-pct-egr': 0,
  'calc-expenses-total': 0,
  'calc-expenses-per-unit': 0,
  'calc-expense-ratio': 0,
  
  // NOI
  'calc-noi': 0,
  'calc-noi-per-unit': 0,
  'calc-noi-per-sf': 0,
  
  // Capitalization & Value
  'calc-raw-value': 0,
  'calc-adj-total': 0,
  'calc-indicated-value': 0,
  'calc-value-per-unit': 0,
  'calc-value-per-sf': 0,
  'calc-grm': 0,
};

// Create Zustand store
export const useCalculatorStore = create<CalculatorState & CalculatorActions>((set, get) => ({
  // Initial state
  inputs: initialInputs,
  outputs: initialOutputs,
  devMode: false,
  selectedPage: 'page-48',
  zoomLevel: 'fit',
  
  // Actions
  updateInput: (fieldId, value) => {
    set((state) => ({
      inputs: {
        ...state.inputs,
        [fieldId]: typeof value === 'string' ? value : Number(value) || 0,
      },
    }));
  },
  
  runCalculations: () => {
    const { inputs } = get();
    const outputs = calculateIncomeApproach(inputs);
    set({ outputs });
  },
  
  toggleDevMode: () => {
    set((state) => ({ devMode: !state.devMode }));
  },
  
  setSelectedPage: (page) => {
    set({ selectedPage: page });
  },
  
  setZoomLevel: (zoom) => {
    set({ zoomLevel: zoom });
  },
}));
