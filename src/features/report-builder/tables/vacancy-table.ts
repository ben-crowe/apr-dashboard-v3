/**
 * Vacancy Table - Vacancy & Collection Loss Calculations
 *
 * Calculates vacancy loss, collection loss, and Effective Gross Revenue (EGR).
 * Depends on income-table outputs (PGR, total-units, total-sf).
 *
 * Template Location: Vacancy sections of Report-MF-template.html
 */

import {
  FinancialTable,
  TableFieldDefinition,
  CalculationResult,
  CalculationStep,
  formatCurrency,
  formatPercentage,
} from './types';

// Input field definitions
const inputFields: TableFieldDefinition[] = [
  {
    id: 'calc-vacancy-rate',
    storeId: 'calc-vacancy-rate',
    label: 'Vacancy Rate (%)',
    type: 'percentage',
    source: 'input',
    defaultValue: 5,
  },
  {
    id: 'calc-bad-debt-rate',
    storeId: 'calc-bad-debt-rate',
    label: 'Bad Debt / Collection Loss (%)',
    type: 'percentage',
    source: 'input',
    defaultValue: 0,
  },
  {
    id: 'calc-concessions-rate',
    storeId: 'calc-concessions-rate',
    label: 'Concessions (%)',
    type: 'percentage',
    source: 'input',
    defaultValue: 0,
  },
];

// Output field definitions
const outputFields: TableFieldDefinition[] = [
  {
    id: 'calc-vacancy-loss',
    storeId: 'calc-vacancy-loss',
    label: 'Total Vacancy & Loss',
    type: 'currency',
    source: 'calculated',
    formula: 'PGR x (vacancy-rate + bad-debt-rate + concessions-rate) / 100',
    dependsOn: ['calc-pgr', 'calc-vacancy-rate', 'calc-bad-debt-rate', 'calc-concessions-rate'],
  },
  {
    id: 'calc-vacancy-per-unit',
    storeId: 'calc-vacancy-per-unit',
    label: 'Vacancy Per Unit',
    type: 'currency',
    source: 'calculated',
    formula: 'vacancy-loss / total-units',
    dependsOn: ['calc-vacancy-loss', 'calc-total-units'],
  },
  {
    id: 'calc-vacancy-per-sf',
    storeId: 'calc-vacancy-per-sf',
    label: 'Vacancy Per SF',
    type: 'currency',
    source: 'calculated',
    formula: 'vacancy-loss / total-sf',
    dependsOn: ['calc-vacancy-loss', 'calc-total-sf'],
  },
  {
    id: 'calc-egr',
    storeId: 'calc-egr',
    label: 'Effective Gross Revenue (EGR)',
    type: 'currency',
    source: 'calculated',
    formula: 'PGR - vacancy-loss',
    dependsOn: ['calc-pgr', 'calc-vacancy-loss'],
  },
  {
    id: 'calc-egr-per-unit',
    storeId: 'calc-egr-per-unit',
    label: 'EGR Per Unit',
    type: 'currency',
    source: 'calculated',
    formula: 'EGR / total-units',
    dependsOn: ['calc-egr', 'calc-total-units'],
  },
  {
    id: 'calc-egr-per-sf',
    storeId: 'calc-egr-per-sf',
    label: 'EGR Per SF',
    type: 'currency',
    source: 'calculated',
    formula: 'EGR / total-sf',
    dependsOn: ['calc-egr', 'calc-total-sf'],
  },
];

/**
 * Calculate vacancy outputs from inputs and dependencies
 */
function calculate(
  inputs: Record<string, number>,
  dependencies?: Record<string, number>
): CalculationResult {
  const steps: CalculationStep[] = [];
  const outputs: Record<string, number> = {};

  // Get required dependencies from income table
  const pgr = dependencies?.['calc-pgr'] ?? 0;
  const totalUnits = dependencies?.['calc-total-units'] ?? 0;
  const totalSf = dependencies?.['calc-total-sf'] ?? 0;

  if (pgr === 0) {
    return {
      outputs: {},
      steps: [],
      success: false,
      error: 'Missing dependency: calc-pgr must be greater than 0',
    };
  }

  // Get vacancy rates
  const vacancyRate = inputs['calc-vacancy-rate'] ?? 0;
  const badDebtRate = inputs['calc-bad-debt-rate'] ?? 0;
  const concessionsRate = inputs['calc-concessions-rate'] ?? 0;
  const totalVacancyRate = vacancyRate + badDebtRate + concessionsRate;

  // Calculate vacancy loss
  const vacancyLoss = pgr * (totalVacancyRate / 100);
  outputs['calc-vacancy-loss'] = Math.round(vacancyLoss);
  outputs['calc-vacancy-per-unit'] = totalUnits > 0 ? Math.round(vacancyLoss / totalUnits) : 0;
  outputs['calc-vacancy-per-sf'] = totalSf > 0 ? Math.round((vacancyLoss / totalSf) * 100) / 100 : 0;

  steps.push({
    id: 'vacancy-loss',
    label: 'Vacancy & Collection Loss',
    formula: `${formatCurrency(pgr)} PGR x ${formatPercentage(totalVacancyRate)}`,
    inputs: [
      { name: 'PGR', value: pgr },
      { name: 'Vacancy Rate', value: vacancyRate, unit: '%' },
      { name: 'Bad Debt', value: badDebtRate, unit: '%' },
      { name: 'Concessions', value: concessionsRate, unit: '%' },
    ],
    result: vacancyLoss,
    resultFormatted: formatCurrency(vacancyLoss),
    explanation: `Total vacancy rate: ${formatPercentage(totalVacancyRate)}`,
  });

  // Calculate EGR
  const egr = pgr - vacancyLoss;
  outputs['calc-egr'] = Math.round(egr);
  outputs['calc-egr-per-unit'] = totalUnits > 0 ? Math.round(egr / totalUnits) : 0;
  outputs['calc-egr-per-sf'] = totalSf > 0 ? Math.round((egr / totalSf) * 100) / 100 : 0;

  steps.push({
    id: 'egr',
    label: 'Effective Gross Revenue (EGR)',
    formula: `${formatCurrency(pgr)} PGR - ${formatCurrency(vacancyLoss)} Loss`,
    inputs: [
      { name: 'PGR', value: pgr },
      { name: 'Vacancy Loss', value: vacancyLoss },
    ],
    result: egr,
    resultFormatted: formatCurrency(egr),
    explanation: 'EGR represents actual expected revenue after vacancy and collection losses',
  });

  return {
    outputs,
    steps,
    success: true,
  };
}

/**
 * Vacancy Table Definition
 */
export const vacancyTable: FinancialTable = {
  id: 'vacancy-table',
  name: 'Vacancy & Collection Loss',
  category: 'vacancy',
  description:
    'Calculates vacancy loss, bad debt, and concessions to derive Effective Gross Revenue (EGR) from Potential Gross Revenue (PGR).',
  inputFields,
  outputFields,
  calculate,
  testCases: [
    {
      name: 'North Battleford Vacancy',
      inputs: {
        'calc-vacancy-rate': 3.8, // 3.8% vacancy
        'calc-bad-debt-rate': 0,
        'calc-concessions-rate': 0,
      },
      expectedOutputs: {
        'calc-vacancy-loss': 7761, // $7,761 vacancy loss
        'calc-egr': 196479, // $196,479 EGR
      },
      tolerance: 10,
    },
  ],
  templateLocation: {
    file: 'public/Report-MF-template.html',
    startLine: 4000,
    endLine: 4038,
  },
};

export default vacancyTable;
