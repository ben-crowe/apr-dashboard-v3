/**
 * Calculator Demo Types
 *
 * Type definitions for the interactive calculator demonstration page.
 * This demo showcases the validated income capitalization engine with
 * full transparency through step-by-step calculation breakdown.
 */

/**
 * Individual calculation step with formula and result
 */
export interface CalculationStep {
  id: string;
  category: string;
  label: string;
  formula: string;
  inputs: { name: string; value: number; unit?: string }[];
  result: number;
  resultFormatted: string;
  explanation?: string;
}

/**
 * Grouped calculation steps by category
 */
export interface CalculationStepGroup {
  id: string;
  title: string;
  steps: CalculationStep[];
  summary?: string;
}

/**
 * Calculator field metadata for input panel
 */
export interface CalculatorFieldMeta {
  id: string;
  label: string;
  type: 'input' | 'calculated';
  unit?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

/**
 * Field group for organizing input panel
 */
export interface CalculatorFieldGroup {
  id: string;
  title: string;
  description?: string;
  fields: CalculatorFieldMeta[];
}
