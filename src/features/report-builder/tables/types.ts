/**
 * Financial Table Types
 *
 * Shared type definitions for modular financial table components.
 * Each table defines its inputs, outputs, calculations, and test data
 * for independent validation before integration with the report builder.
 */

export type FieldType = 'currency' | 'number' | 'percentage' | 'text';
export type FieldSource = 'input' | 'calculated';
export type TableCategory = 'income' | 'expense' | 'vacancy' | 'noi' | 'valuation';

/**
 * Definition for a single field in a financial table
 */
export interface TableFieldDefinition {
  /** Template placeholder ID (kebab-case, e.g., 'calc-exp-taxes-annual') */
  id: string;

  /** Store field ID (usually matches id) */
  storeId: string;

  /** Display label for UI */
  label: string;

  /** Field data type */
  type: FieldType;

  /** Whether this is a user input or calculated output */
  source: FieldSource;

  /** Human-readable formula (for calculated fields) */
  formula?: string;

  /** Field IDs this calculation depends on */
  dependsOn?: string[];

  /** Default value if not provided */
  defaultValue?: number;
}

/**
 * Result of running calculations for a table
 */
export interface CalculationResult {
  /** Output field ID -> calculated value */
  outputs: Record<string, number>;

  /** Intermediate calculation steps (for walkthrough display) */
  steps?: CalculationStep[];

  /** Whether calculation completed successfully */
  success: boolean;

  /** Error message if calculation failed */
  error?: string;
}

/**
 * A single calculation step for walkthrough display
 */
export interface CalculationStep {
  /** Step identifier */
  id: string;

  /** Step label */
  label: string;

  /** Human-readable formula used */
  formula: string;

  /** Input values used in this step */
  inputs: Array<{ name: string; value: number; unit?: string }>;

  /** Calculated result */
  result: number;

  /** Formatted result for display */
  resultFormatted: string;

  /** Optional explanation text */
  explanation?: string;
}

/**
 * Test case for validating a financial table
 */
export interface TableTestCase {
  /** Test case name */
  name: string;

  /** Input values for this test */
  inputs: Record<string, number>;

  /** Expected output values */
  expectedOutputs: Record<string, number>;

  /** Tolerance for floating point comparisons (default 0.01) */
  tolerance?: number;
}

/**
 * Complete definition for a financial table
 */
export interface FinancialTable {
  /** Unique table identifier */
  id: string;

  /** Display name */
  name: string;

  /** Table category for grouping */
  category: TableCategory;

  /** Description of what this table calculates */
  description: string;

  /** Fields that are user inputs to this table */
  inputFields: TableFieldDefinition[];

  /** Fields that are calculated outputs from this table */
  outputFields: TableFieldDefinition[];

  /**
   * Calculate outputs from inputs
   * @param inputs - Map of field ID to value for all input fields
   * @param dependencies - Map of field ID to value for any external dependencies
   * @returns Calculation result with outputs and optional steps
   */
  calculate: (
    inputs: Record<string, number>,
    dependencies?: Record<string, number>
  ) => CalculationResult;

  /** Test cases for validating this table */
  testCases: TableTestCase[];

  /** Template table HTML snippet this corresponds to (line range in template) */
  templateLocation?: {
    file: string;
    startLine: number;
    endLine: number;
  };
}

/**
 * Expense category definition for expense table
 */
export interface ExpenseCategory {
  /** Category name (e.g., 'taxes', 'insurance') */
  name: string;

  /** Display label */
  label: string;

  /** Input field ID for base expense amount */
  inputFieldId: string;

  /** Calculation base type */
  calcBase: 'fixed' | 'per_unit' | 'per_sf' | 'percent_pgr' | 'percent_egr';
}

/**
 * Formatting utilities for display
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value: number, decimals = 2): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatPercentage = (value: number, decimals = 1): string => {
  return `${formatNumber(value, decimals)}%`;
};

/**
 * Round to nearest specified value
 */
export const roundToNearest = (value: number, nearest: number): number => {
  return Math.round(value / nearest) * nearest;
};
