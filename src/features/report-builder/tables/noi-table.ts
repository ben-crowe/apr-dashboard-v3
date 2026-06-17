/**
 * NOI Table - Net Operating Income Calculations
 *
 * Calculates Net Operating Income (NOI) from EGR minus Total Expenses.
 * This is a derived table with no direct inputs - all values come from dependencies.
 *
 * Template Location: NOI sections of Report-MF-template.html
 */

import {
  FinancialTable,
  TableFieldDefinition,
  CalculationResult,
  CalculationStep,
  formatCurrency,
  formatPercentage,
} from './types';

// No input fields - NOI is entirely derived from other tables
const inputFields: TableFieldDefinition[] = [];

// Output field definitions
const outputFields: TableFieldDefinition[] = [
  {
    id: 'calc-noi',
    storeId: 'calc-noi',
    label: 'Net Operating Income (NOI)',
    type: 'currency',
    source: 'calculated',
    formula: 'EGR - Total Expenses',
    dependsOn: ['calc-egr', 'calc-expenses-total'],
  },
  {
    id: 'calc-noi-per-unit',
    storeId: 'calc-noi-per-unit',
    label: 'NOI Per Unit',
    type: 'currency',
    source: 'calculated',
    formula: 'NOI / total-units',
    dependsOn: ['calc-noi', 'calc-total-units'],
  },
  {
    id: 'calc-noi-per-sf',
    storeId: 'calc-noi-per-sf',
    label: 'NOI Per SF',
    type: 'currency',
    source: 'calculated',
    formula: 'NOI / total-sf',
    dependsOn: ['calc-noi', 'calc-total-sf'],
  },
  {
    id: 'calc-expense-ratio',
    storeId: 'calc-expense-ratio',
    label: 'Expense Ratio',
    type: 'percentage',
    source: 'calculated',
    formula: '(Total Expenses / EGR) x 100',
    dependsOn: ['calc-expenses-total', 'calc-egr'],
  },
];

/**
 * Calculate NOI outputs from dependencies
 */
function calculate(
  _inputs: Record<string, number>,
  dependencies?: Record<string, number>
): CalculationResult {
  const steps: CalculationStep[] = [];
  const outputs: Record<string, number> = {};

  // Get required dependencies
  const egr = dependencies?.['calc-egr'] ?? 0;
  const expensesTotal = dependencies?.['calc-expenses-total'] ?? 0;
  const totalUnits = dependencies?.['calc-total-units'] ?? 0;
  const totalSf = dependencies?.['calc-total-sf'] ?? 0;

  if (egr === 0) {
    return {
      outputs: {},
      steps: [],
      success: false,
      error: 'Missing dependency: calc-egr must be greater than 0',
    };
  }

  // Calculate NOI
  const noi = egr - expensesTotal;
  outputs['calc-noi'] = Math.round(noi);
  outputs['calc-noi-per-unit'] = totalUnits > 0 ? Math.round(noi / totalUnits) : 0;
  outputs['calc-noi-per-sf'] = totalSf > 0 ? Math.round((noi / totalSf) * 100) / 100 : 0;

  // Calculate expense ratio
  const expenseRatio = egr > 0 ? (expensesTotal / egr) * 100 : 0;
  outputs['calc-expense-ratio'] = Math.round(expenseRatio * 100) / 100;

  steps.push({
    id: 'expense-ratio',
    label: 'Expense Ratio',
    formula: `${formatCurrency(expensesTotal)} / ${formatCurrency(egr)} x 100`,
    inputs: [
      { name: 'Total Expenses', value: expensesTotal },
      { name: 'EGR', value: egr },
    ],
    result: expenseRatio,
    resultFormatted: formatPercentage(expenseRatio),
    explanation: 'Percentage of revenue consumed by operating expenses',
  });

  steps.push({
    id: 'noi',
    label: 'Net Operating Income (NOI)',
    formula: `${formatCurrency(egr)} EGR - ${formatCurrency(expensesTotal)} Expenses`,
    inputs: [
      { name: 'EGR', value: egr },
      { name: 'Total Expenses', value: expensesTotal },
    ],
    result: noi,
    resultFormatted: formatCurrency(noi),
    explanation: 'NOI represents income available for debt service and return on investment',
  });

  steps.push({
    id: 'noi-metrics',
    label: 'NOI Metrics',
    formula: `NOI / Units and NOI / SF`,
    inputs: [
      { name: 'NOI', value: noi },
      { name: 'Total Units', value: totalUnits },
      { name: 'Total SF', value: totalSf },
    ],
    result: outputs['calc-noi-per-unit'],
    resultFormatted: `${formatCurrency(outputs['calc-noi-per-unit'])}/unit`,
    explanation: `Also ${formatCurrency(outputs['calc-noi-per-sf'])}/SF`,
  });

  return {
    outputs,
    steps,
    success: true,
  };
}

/**
 * NOI Table Definition
 */
export const noiTable: FinancialTable = {
  id: 'noi-table',
  name: 'Net Operating Income',
  category: 'noi',
  description:
    'Calculates Net Operating Income (NOI) as EGR minus Total Operating Expenses. Also calculates expense ratio and per-unit/per-SF metrics.',
  inputFields,
  outputFields,
  calculate,
  testCases: [
    {
      name: 'North Battleford NOI',
      inputs: {},
      expectedOutputs: {
        'calc-noi': 111771, // $111,771 NOI
        'calc-expense-ratio': 43.07, // ~43% expense ratio
      },
      tolerance: 100,
    },
  ],
  templateLocation: {
    file: 'public/Report-MF-template.html',
    startLine: 4206,
    endLine: 4250,
  },
};

export default noiTable;
