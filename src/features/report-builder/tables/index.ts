/**
 * Financial Tables - Barrel Export
 *
 * Modular financial table components for independent testing and validation.
 * Each table defines its inputs, outputs, calculation logic, and test data.
 *
 * Dependency Flow:
 * income-table → vacancy-table → noi-table → capitalization-table
 *                     ↑               ↑
 *              expense-table ─────────┘
 *
 * Usage:
 * ```typescript
 * import { incomeTable, expenseTable, runFullCalculation } from '@/features/report-builder/tables';
 *
 * // Run single table
 * const incomeResult = incomeTable.calculate(inputs);
 *
 * // Run full pipeline
 * const finalValue = runFullCalculation(allInputs);
 * ```
 */

// Type exports
export * from './types';

// Table exports
export { incomeTable } from './income-table';
export { vacancyTable } from './vacancy-table';
export { expenseTable, EXPENSE_CATEGORIES } from './expense-table';
export { noiTable } from './noi-table';
export { capitalizationTable } from './capitalization-table';

// Import tables for pipeline
import { incomeTable } from './income-table';
import { vacancyTable } from './vacancy-table';
import { expenseTable } from './expense-table';
import { noiTable } from './noi-table';
import { capitalizationTable } from './capitalization-table';
import { CalculationResult, CalculationStep, formatCurrency } from './types';

/**
 * All financial tables in dependency order
 */
export const allTables = [
  incomeTable,
  vacancyTable,
  expenseTable,
  noiTable,
  capitalizationTable,
] as const;

/**
 * Result of running the full calculation pipeline
 */
export interface FullCalculationResult {
  /** All calculated outputs from all tables */
  outputs: Record<string, number>;

  /** All calculation steps from all tables */
  steps: CalculationStep[];

  /** Whether all calculations succeeded */
  success: boolean;

  /** Any error messages */
  errors: string[];

  /** The final indicated value */
  indicatedValue: number;
}

/**
 * Run the complete calculation pipeline through all tables
 *
 * @param inputs - All input field values
 * @returns Complete calculation result with all outputs
 */
export function runFullCalculation(inputs: Record<string, number>): FullCalculationResult {
  const allOutputs: Record<string, number> = {};
  const allSteps: CalculationStep[] = [];
  const errors: string[] = [];

  // Step 1: Income Table (no dependencies)
  const incomeResult = incomeTable.calculate(inputs);
  if (!incomeResult.success) {
    errors.push(`Income: ${incomeResult.error}`);
  } else {
    Object.assign(allOutputs, incomeResult.outputs);
    allSteps.push(...(incomeResult.steps ?? []));
  }

  // Step 2: Vacancy Table (depends on income)
  const vacancyResult = vacancyTable.calculate(inputs, allOutputs);
  if (!vacancyResult.success) {
    errors.push(`Vacancy: ${vacancyResult.error}`);
  } else {
    Object.assign(allOutputs, vacancyResult.outputs);
    allSteps.push(...(vacancyResult.steps ?? []));
  }

  // Step 3: Expense Table (depends on income and vacancy for pgr/egr)
  const expenseResult = expenseTable.calculate(inputs, allOutputs);
  if (!expenseResult.success) {
    errors.push(`Expense: ${expenseResult.error}`);
  } else {
    Object.assign(allOutputs, expenseResult.outputs);
    allSteps.push(...(expenseResult.steps ?? []));
  }

  // Step 4: NOI Table (depends on vacancy and expense)
  const noiResult = noiTable.calculate(inputs, allOutputs);
  if (!noiResult.success) {
    errors.push(`NOI: ${noiResult.error}`);
  } else {
    Object.assign(allOutputs, noiResult.outputs);
    allSteps.push(...(noiResult.steps ?? []));
  }

  // Step 5: Capitalization Table (depends on NOI)
  const capResult = capitalizationTable.calculate(inputs, allOutputs);
  if (!capResult.success) {
    errors.push(`Capitalization: ${capResult.error}`);
  } else {
    Object.assign(allOutputs, capResult.outputs);
    allSteps.push(...(capResult.steps ?? []));
  }

  const indicatedValue = allOutputs['calc-indicated-value'] ?? 0;

  return {
    outputs: allOutputs,
    steps: allSteps,
    success: errors.length === 0,
    errors,
    indicatedValue,
  };
}

/**
 * North Battleford test data inputs
 * Expected final result: $1,780,000
 */
export const NORTH_BATTLEFORD_INPUTS: Record<string, number> = {
  // Unit Mix
  'calc-type1-count': 2,
  'calc-type1-sf': 400,
  'calc-type1-rent': 485,
  'calc-type2-count': 6,
  'calc-type2-sf': 575,
  'calc-type2-rent': 665,
  'calc-type3-count': 10,
  'calc-type3-sf': 850,
  'calc-type3-rent': 835,
  'calc-type4-count': 2,
  'calc-type4-sf': 1100,
  'calc-type4-rent': 950,

  // Other Income
  'calc-parking-per-unit': 0,
  'calc-laundry-per-unit': 0,
  'calc-other-income': 0,

  // Vacancy
  'calc-vacancy-rate': 3.8,
  'calc-bad-debt-rate': 0,
  'calc-concessions-rate': 0,

  // Expenses (per unit)
  'calc-exp-management': 5, // 5% of EGR
  'calc-exp-taxes': 416,
  'calc-exp-insurance': 200,
  'calc-exp-repairs': 550,
  'calc-exp-utilities': 400,
  'calc-exp-payroll': 200,
  'calc-exp-other': 350,

  // Capitalization
  'calc-cap-rate': 6.25,
  'calc-adj-capex': 0,
  'calc-adj-leasing': 0,
  'calc-adj-other': 0,
};

/**
 * Expected outputs for North Battleford test case
 */
export const NORTH_BATTLEFORD_EXPECTED = {
  'calc-pgr': 204240,
  'calc-vacancy-loss': 7761,
  'calc-egr': 196479,
  'calc-expenses-total': 84621,
  'calc-noi': 111771,
  'calc-raw-value': 1788336,
  'calc-indicated-value': 1780000,
};

/**
 * Validate calculation against expected values
 */
export function validateCalculation(
  result: FullCalculationResult,
  expected: Record<string, number>,
  tolerance = 100
): { valid: boolean; differences: Array<{ field: string; expected: number; actual: number }> } {
  const differences: Array<{ field: string; expected: number; actual: number }> = [];

  for (const [field, expectedValue] of Object.entries(expected)) {
    const actualValue = result.outputs[field] ?? 0;
    if (Math.abs(actualValue - expectedValue) > tolerance) {
      differences.push({ field, expected: expectedValue, actual: actualValue });
    }
  }

  return {
    valid: differences.length === 0,
    differences,
  };
}
