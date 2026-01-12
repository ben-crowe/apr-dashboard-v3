/**
 * Expense Table - Operating Expenses Calculations
 *
 * Calculates all operating expense breakdowns for the report.
 * Produces 35 output fields (7 categories x 5 metrics each) plus 4 summary fields.
 *
 * Template Location: public/Report-MF-template.html lines 4038-4206
 */

import {
  FinancialTable,
  TableFieldDefinition,
  CalculationResult,
  CalculationStep,
  ExpenseCategory,
  formatCurrency,
  formatNumber,
  formatPercentage,
} from './types';

// 7 expense categories with their calculation bases
export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { name: 'taxes', label: 'Real Estate Taxes', inputFieldId: 'calc-exp-taxes', calcBase: 'per_unit' },
  { name: 'insurance', label: 'Insurance', inputFieldId: 'calc-exp-insurance', calcBase: 'per_unit' },
  { name: 'repairs', label: 'Repairs & Maintenance', inputFieldId: 'calc-exp-repairs', calcBase: 'per_unit' },
  { name: 'payroll', label: 'Payroll', inputFieldId: 'calc-exp-payroll', calcBase: 'per_unit' },
  { name: 'utilities', label: 'Utilities', inputFieldId: 'calc-exp-utilities', calcBase: 'per_unit' },
  { name: 'management', label: 'Management', inputFieldId: 'calc-exp-management', calcBase: 'percent_egr' },
  { name: 'other', label: 'Other Expenses', inputFieldId: 'calc-exp-other', calcBase: 'per_unit' },
];

// Input field definitions (7 expense inputs)
const inputFields: TableFieldDefinition[] = EXPENSE_CATEGORIES.map((cat) => ({
  id: cat.inputFieldId,
  storeId: cat.inputFieldId,
  label: cat.label,
  type: 'currency' as const,
  source: 'input' as const,
  defaultValue: 0,
}));

// Output field definitions (35 breakdown fields + 4 summary fields = 39 total)
const outputFields: TableFieldDefinition[] = [];

// Generate 5 output fields per category
EXPENSE_CATEGORIES.forEach((cat) => {
  const prefix = `calc-exp-${cat.name}`;
  outputFields.push(
    {
      id: `${prefix}-annual`,
      storeId: `${prefix}-annual`,
      label: `${cat.label} - Annual`,
      type: 'currency',
      source: 'calculated',
      formula: `${cat.label} calculated based on ${cat.calcBase} methodology`,
      dependsOn: [cat.inputFieldId],
    },
    {
      id: `${prefix}-per-unit`,
      storeId: `${prefix}-per-unit`,
      label: `${cat.label} - Per Unit`,
      type: 'currency',
      source: 'calculated',
      formula: `${prefix}-annual / total-units`,
      dependsOn: [`${prefix}-annual`, 'calc-total-units'],
    },
    {
      id: `${prefix}-per-sf`,
      storeId: `${prefix}-per-sf`,
      label: `${cat.label} - Per SF`,
      type: 'currency',
      source: 'calculated',
      formula: `${prefix}-annual / total-sf`,
      dependsOn: [`${prefix}-annual`, 'calc-total-sf'],
    },
    {
      id: `${prefix}-pct-pgr`,
      storeId: `${prefix}-pct-pgr`,
      label: `${cat.label} - % of PGR`,
      type: 'percentage',
      source: 'calculated',
      formula: `(${prefix}-annual / pgr) * 100`,
      dependsOn: [`${prefix}-annual`, 'calc-pgr'],
    },
    {
      id: `${prefix}-pct-egr`,
      storeId: `${prefix}-pct-egr`,
      label: `${cat.label} - % of EGR`,
      type: 'percentage',
      source: 'calculated',
      formula: `(${prefix}-annual / egr) * 100`,
      dependsOn: [`${prefix}-annual`, 'calc-egr'],
    }
  );
});

// Summary output fields
outputFields.push(
  {
    id: 'calc-expenses-total',
    storeId: 'calc-expenses-total',
    label: 'Total Operating Expenses',
    type: 'currency',
    source: 'calculated',
    formula: 'Sum of all expense categories',
    dependsOn: EXPENSE_CATEGORIES.map((c) => `calc-exp-${c.name}-annual`),
  },
  {
    id: 'calc-expenses-per-unit',
    storeId: 'calc-expenses-per-unit',
    label: 'Total Expenses Per Unit',
    type: 'currency',
    source: 'calculated',
    formula: 'calc-expenses-total / total-units',
    dependsOn: ['calc-expenses-total', 'calc-total-units'],
  },
  {
    id: 'calc-expenses-per-sf',
    storeId: 'calc-expenses-per-sf',
    label: 'Total Expenses Per SF',
    type: 'currency',
    source: 'calculated',
    formula: 'calc-expenses-total / total-sf',
    dependsOn: ['calc-expenses-total', 'calc-total-sf'],
  },
  {
    id: 'calc-expense-ratio',
    storeId: 'calc-expense-ratio',
    label: 'Expense Ratio',
    type: 'percentage',
    source: 'calculated',
    formula: '(calc-expenses-total / egr) * 100',
    dependsOn: ['calc-expenses-total', 'calc-egr'],
  }
);

/**
 * Calculate expense based on the calc base methodology
 */
function calculateExpenseAmount(
  inputValue: number,
  calcBase: string,
  deps: {
    totalUnits: number;
    totalSf: number;
    pgr: number;
    egr: number;
  }
): number {
  switch (calcBase) {
    case 'percent_pgr':
      return deps.pgr * (inputValue / 100);
    case 'percent_egr':
      return deps.egr * (inputValue / 100);
    case 'fixed':
      return inputValue;
    case 'per_unit':
      return inputValue * deps.totalUnits;
    case 'per_sf':
      return inputValue * deps.totalSf;
    default:
      return inputValue * deps.totalUnits;
  }
}

/**
 * Calculate all expense outputs from inputs and dependencies
 */
function calculate(
  inputs: Record<string, number>,
  dependencies?: Record<string, number>
): CalculationResult {
  const steps: CalculationStep[] = [];
  const outputs: Record<string, number> = {};

  // Get required dependencies
  const totalUnits = dependencies?.['calc-total-units'] ?? 0;
  const totalSf = dependencies?.['calc-total-sf'] ?? 0;
  const pgr = dependencies?.['calc-pgr'] ?? 0;
  const egr = dependencies?.['calc-egr'] ?? 0;

  if (totalUnits === 0) {
    return {
      outputs: {},
      steps: [],
      success: false,
      error: 'Missing dependency: calc-total-units must be greater than 0',
    };
  }

  const deps = { totalUnits, totalSf, pgr, egr };
  let expensesTotal = 0;

  // Calculate each expense category
  EXPENSE_CATEGORIES.forEach((cat) => {
    const inputValue = inputs[cat.inputFieldId] ?? 0;
    const prefix = `calc-exp-${cat.name}`;

    // Calculate annual expense based on calc base
    const annual = Math.round(calculateExpenseAmount(inputValue, cat.calcBase, deps));
    expensesTotal += annual;

    // Calculate derived metrics
    const perUnit = totalUnits > 0 ? annual / totalUnits : 0;
    const perSf = totalSf > 0 ? annual / totalSf : 0;
    const pctPgr = pgr > 0 ? (annual / pgr) * 100 : 0;
    const pctEgr = egr > 0 ? (annual / egr) * 100 : 0;

    // Store outputs with proper rounding
    outputs[`${prefix}-annual`] = annual;
    outputs[`${prefix}-per-unit`] = Math.round(perUnit * 100) / 100;
    outputs[`${prefix}-per-sf`] = Math.round(perSf * 100) / 100;
    outputs[`${prefix}-pct-pgr`] = Math.round(pctPgr * 100) / 100;
    outputs[`${prefix}-pct-egr`] = Math.round(pctEgr * 100) / 100;

    // Create calculation step for walkthrough
    steps.push({
      id: `expense-${cat.name}`,
      label: cat.label,
      formula:
        cat.calcBase === 'percent_egr'
          ? `${formatCurrency(egr)} EGR x ${inputValue}%`
          : cat.calcBase === 'percent_pgr'
          ? `${formatCurrency(pgr)} PGR x ${inputValue}%`
          : `${formatCurrency(inputValue)}/unit x ${totalUnits} units`,
      inputs: [
        { name: 'Input Value', value: inputValue, unit: cat.calcBase.includes('percent') ? '%' : '$/unit' },
        { name: 'Total Units', value: totalUnits },
      ],
      result: annual,
      resultFormatted: formatCurrency(annual),
    });
  });

  // Summary outputs
  outputs['calc-expenses-total'] = Math.round(expensesTotal);
  outputs['calc-expenses-per-unit'] = totalUnits > 0 ? Math.round((expensesTotal / totalUnits) * 100) / 100 : 0;
  outputs['calc-expenses-per-sf'] = totalSf > 0 ? Math.round((expensesTotal / totalSf) * 100) / 100 : 0;
  outputs['calc-expense-ratio'] = egr > 0 ? Math.round((expensesTotal / egr) * 100 * 100) / 100 : 0;

  // Summary step
  steps.push({
    id: 'expense-total',
    label: 'Total Operating Expenses',
    formula: `Sum of all ${EXPENSE_CATEGORIES.length} expense categories`,
    inputs: EXPENSE_CATEGORIES.map((cat) => ({
      name: cat.label,
      value: outputs[`calc-exp-${cat.name}-annual`],
    })),
    result: expensesTotal,
    resultFormatted: formatCurrency(expensesTotal),
  });

  return {
    outputs,
    steps,
    success: true,
  };
}

/**
 * Expense Table Definition
 */
export const expenseTable: FinancialTable = {
  id: 'expense-table',
  name: 'Operating Expenses',
  category: 'expense',
  description:
    'Calculates all operating expense breakdowns including annual, per-unit, per-SF, and percentage metrics for 7 expense categories plus summary totals.',
  inputFields,
  outputFields,
  calculate,
  testCases: [
    {
      name: 'North Battleford Expenses',
      inputs: {
        'calc-exp-management': 5, // 5% of EGR
        'calc-exp-taxes': 416, // per unit
        'calc-exp-insurance': 200, // per unit
        'calc-exp-repairs': 550, // per unit
        'calc-exp-utilities': 400, // per unit
        'calc-exp-payroll': 200, // per unit
        'calc-exp-other': 350, // per unit
      },
      expectedOutputs: {
        'calc-expenses-total': 84621, // Template expects $84,621
      },
      tolerance: 100, // Allow $100 variance for rounding
    },
  ],
  templateLocation: {
    file: 'public/Report-MF-template.html',
    startLine: 4038,
    endLine: 4206,
  },
};

export default expenseTable;
