/**
 * Income Table - Revenue & PGR Calculations
 *
 * Calculates rental revenue by unit type, other income, and Potential Gross Revenue (PGR).
 * This is the foundation table - other tables depend on its outputs.
 *
 * Template Location: Income sections of Report-MF-template.html
 */

import {
  FinancialTable,
  TableFieldDefinition,
  CalculationResult,
  CalculationStep,
  formatCurrency,
  formatNumber,
} from './types';

// Unit type structure (supports up to 6 types, 4 commonly used)
const UNIT_TYPES = [1, 2, 3, 4] as const;

// Input field definitions
const inputFields: TableFieldDefinition[] = [
  // Unit mix inputs (4 types x 3 fields = 12 fields)
  ...UNIT_TYPES.flatMap((n) => [
    {
      id: `calc-type${n}-count`,
      storeId: `calc-type${n}-count`,
      label: `Type ${n} - Unit Count`,
      type: 'number' as const,
      source: 'input' as const,
      defaultValue: 0,
    },
    {
      id: `calc-type${n}-sf`,
      storeId: `calc-type${n}-sf`,
      label: `Type ${n} - Avg SF`,
      type: 'number' as const,
      source: 'input' as const,
      defaultValue: 0,
    },
    {
      id: `calc-type${n}-rent`,
      storeId: `calc-type${n}-rent`,
      label: `Type ${n} - Monthly Rent`,
      type: 'currency' as const,
      source: 'input' as const,
      defaultValue: 0,
    },
  ]),
  // Other income inputs
  {
    id: 'calc-parking-per-unit',
    storeId: 'calc-parking-per-unit',
    label: 'Parking Income Per Unit/Month',
    type: 'currency',
    source: 'input',
    defaultValue: 0,
  },
  {
    id: 'calc-laundry-per-unit',
    storeId: 'calc-laundry-per-unit',
    label: 'Laundry Income Per Unit/Month',
    type: 'currency',
    source: 'input',
    defaultValue: 0,
  },
  {
    id: 'calc-other-income',
    storeId: 'calc-other-income',
    label: 'Other Annual Income',
    type: 'currency',
    source: 'input',
    defaultValue: 0,
  },
];

// Output field definitions
const outputFields: TableFieldDefinition[] = [
  // Unit type outputs (4 types x 3 outputs = 12 fields)
  ...UNIT_TYPES.flatMap((n) => [
    {
      id: `calc-type${n}-annual`,
      storeId: `calc-type${n}-annual`,
      label: `Type ${n} - Annual Revenue`,
      type: 'currency' as const,
      source: 'calculated' as const,
      formula: `type${n}-count x type${n}-rent x 12`,
      dependsOn: [`calc-type${n}-count`, `calc-type${n}-rent`],
    },
    {
      id: `calc-type${n}-per-unit`,
      storeId: `calc-type${n}-per-unit`,
      label: `Type ${n} - Annual Per Unit`,
      type: 'currency' as const,
      source: 'calculated' as const,
      formula: `type${n}-annual / type${n}-count`,
      dependsOn: [`calc-type${n}-annual`, `calc-type${n}-count`],
    },
    {
      id: `calc-type${n}-per-sf`,
      storeId: `calc-type${n}-per-sf`,
      label: `Type ${n} - Monthly Rent Per SF`,
      type: 'currency' as const,
      source: 'calculated' as const,
      formula: `type${n}-rent / type${n}-sf`,
      dependsOn: [`calc-type${n}-rent`, `calc-type${n}-sf`],
    },
  ]),
  // Property totals
  {
    id: 'calc-total-units',
    storeId: 'calc-total-units',
    label: 'Total Units',
    type: 'number',
    source: 'calculated',
    formula: 'Sum of all unit type counts',
    dependsOn: UNIT_TYPES.map((n) => `calc-type${n}-count`),
  },
  {
    id: 'calc-total-sf',
    storeId: 'calc-total-sf',
    label: 'Total SF',
    type: 'number',
    source: 'calculated',
    formula: 'Sum of (count x sf) for each unit type',
    dependsOn: UNIT_TYPES.flatMap((n) => [`calc-type${n}-count`, `calc-type${n}-sf`]),
  },
  {
    id: 'calc-avg-unit-sf',
    storeId: 'calc-avg-unit-sf',
    label: 'Average Unit SF',
    type: 'number',
    source: 'calculated',
    formula: 'total-sf / total-units',
    dependsOn: ['calc-total-sf', 'calc-total-units'],
  },
  {
    id: 'calc-total-rental-revenue',
    storeId: 'calc-total-rental-revenue',
    label: 'Total Rental Revenue',
    type: 'currency',
    source: 'calculated',
    formula: 'Sum of all unit type annual revenues',
    dependsOn: UNIT_TYPES.map((n) => `calc-type${n}-annual`),
  },
  {
    id: 'calc-avg-rent-per-unit',
    storeId: 'calc-avg-rent-per-unit',
    label: 'Average Rent Per Unit',
    type: 'currency',
    source: 'calculated',
    formula: 'total-rental-revenue / total-units / 12',
    dependsOn: ['calc-total-rental-revenue', 'calc-total-units'],
  },
  {
    id: 'calc-avg-rent-per-sf',
    storeId: 'calc-avg-rent-per-sf',
    label: 'Average Rent Per SF',
    type: 'currency',
    source: 'calculated',
    formula: 'total-rental-revenue / total-sf / 12',
    dependsOn: ['calc-total-rental-revenue', 'calc-total-sf'],
  },
  // Other income outputs
  {
    id: 'calc-parking-total',
    storeId: 'calc-parking-total',
    label: 'Parking Income - Annual',
    type: 'currency',
    source: 'calculated',
    formula: 'parking-per-unit x total-units x 12',
    dependsOn: ['calc-parking-per-unit', 'calc-total-units'],
  },
  {
    id: 'calc-laundry-total',
    storeId: 'calc-laundry-total',
    label: 'Laundry Income - Annual',
    type: 'currency',
    source: 'calculated',
    formula: 'laundry-per-unit x total-units x 12',
    dependsOn: ['calc-laundry-per-unit', 'calc-total-units'],
  },
  {
    id: 'calc-total-other-income',
    storeId: 'calc-total-other-income',
    label: 'Total Other Income',
    type: 'currency',
    source: 'calculated',
    formula: 'parking-total + laundry-total + other-income',
    dependsOn: ['calc-parking-total', 'calc-laundry-total', 'calc-other-income'],
  },
  // PGR
  {
    id: 'calc-pgr',
    storeId: 'calc-pgr',
    label: 'Potential Gross Revenue (PGR)',
    type: 'currency',
    source: 'calculated',
    formula: 'total-rental-revenue + total-other-income',
    dependsOn: ['calc-total-rental-revenue', 'calc-total-other-income'],
  },
  {
    id: 'calc-pgr-per-unit',
    storeId: 'calc-pgr-per-unit',
    label: 'PGR Per Unit',
    type: 'currency',
    source: 'calculated',
    formula: 'pgr / total-units',
    dependsOn: ['calc-pgr', 'calc-total-units'],
  },
  {
    id: 'calc-pgr-per-sf',
    storeId: 'calc-pgr-per-sf',
    label: 'PGR Per SF',
    type: 'currency',
    source: 'calculated',
    formula: 'pgr / total-sf',
    dependsOn: ['calc-pgr', 'calc-total-sf'],
  },
  // Type totals
  {
    id: 'calc-type-total-per-unit',
    storeId: 'calc-type-total-per-unit',
    label: 'Total Rental Per Unit (Annual)',
    type: 'currency',
    source: 'calculated',
    formula: 'total-rental-revenue / total-units',
    dependsOn: ['calc-total-rental-revenue', 'calc-total-units'],
  },
  {
    id: 'calc-type-total-per-sf',
    storeId: 'calc-type-total-per-sf',
    label: 'Total Rental Per SF (Monthly)',
    type: 'currency',
    source: 'calculated',
    formula: 'total-rental-revenue / total-sf / 12',
    dependsOn: ['calc-total-rental-revenue', 'calc-total-sf'],
  },
  {
    id: 'calc-rental-revenue-per-unit',
    storeId: 'calc-rental-revenue-per-unit',
    label: 'Rental Revenue Per Unit (Annual)',
    type: 'currency',
    source: 'calculated',
    formula: 'total-rental-revenue / total-units',
    dependsOn: ['calc-total-rental-revenue', 'calc-total-units'],
  },
  {
    id: 'calc-other-income-per-unit',
    storeId: 'calc-other-income-per-unit',
    label: 'Other Income Per Unit (Annual)',
    type: 'currency',
    source: 'calculated',
    formula: 'total-other-income / total-units',
    dependsOn: ['calc-total-other-income', 'calc-total-units'],
  },
  {
    id: 'calc-other-income-per-sf',
    storeId: 'calc-other-income-per-sf',
    label: 'Other Income Per SF (Annual)',
    type: 'currency',
    source: 'calculated',
    formula: 'total-other-income / total-sf',
    dependsOn: ['calc-total-other-income', 'calc-total-sf'],
  },
];

/**
 * Calculate all income outputs from inputs
 * @param inputs - Unit mix data from table inputs
 * @param dependencies - External store values (subject-units from Home Tab)
 */
function calculate(
  inputs: Record<string, number>,
  dependencies?: Record<string, number>
): CalculationResult {
  const steps: CalculationStep[] = [];
  const outputs: Record<string, number> = {};

  // Read total units from Home Tab (subject-units) - this is the authority
  const totalUnits = dependencies?.['subject-units'] ?? 0;

  // Unit mix calculations (for SF and revenue breakdown only)
  let totalSf = 0;
  let totalRentalRevenue = 0;

  UNIT_TYPES.forEach((n) => {
    const count = inputs[`calc-type${n}-count`] ?? 0;
    const sf = inputs[`calc-type${n}-sf`] ?? 0;
    const rent = inputs[`calc-type${n}-rent`] ?? 0;

    const annual = count * rent * 12;
    const perUnit = count > 0 ? Math.round(annual / count) : 0;
    const perSf = count > 0 && sf > 0 ? Math.round((rent / sf) * 100) / 100 : 0;

    // SF calculated from unit mix (not units - that comes from Home Tab)
    totalSf += count * sf;
    totalRentalRevenue += annual;

    outputs[`calc-type${n}-annual`] = annual;
    outputs[`calc-type${n}-per-unit`] = perUnit;
    outputs[`calc-type${n}-per-sf`] = perSf;

    if (count > 0) {
      steps.push({
        id: `unit-type-${n}`,
        label: `Type ${n} Annual Revenue`,
        formula: `${count} units x ${formatCurrency(rent)}/mo x 12 months`,
        inputs: [
          { name: 'Units', value: count },
          { name: 'Monthly Rent', value: rent, unit: '$/unit' },
        ],
        result: annual,
        resultFormatted: formatCurrency(annual),
      });
    }
  });

  // Property totals
  const avgUnitSf = totalUnits > 0 ? totalSf / totalUnits : 0;
  const avgRentPerUnit = totalUnits > 0 ? totalRentalRevenue / totalUnits / 12 : 0;
  const avgRentPerSf = totalSf > 0 ? totalRentalRevenue / totalSf / 12 : 0;

  outputs['calc-total-units'] = totalUnits;
  outputs['calc-total-sf'] = totalSf;
  outputs['calc-avg-unit-sf'] = Math.round(avgUnitSf);
  outputs['calc-total-rental-revenue'] = totalRentalRevenue;
  outputs['calc-avg-rent-per-unit'] = Math.round(avgRentPerUnit);
  outputs['calc-avg-rent-per-sf'] = Math.round(avgRentPerSf * 100) / 100;

  steps.push({
    id: 'total-rental-revenue',
    label: 'Total Rental Revenue',
    formula: `Sum of all unit type revenues`,
    inputs: UNIT_TYPES.filter((n) => (inputs[`calc-type${n}-count`] ?? 0) > 0).map((n) => ({
      name: `Type ${n}`,
      value: outputs[`calc-type${n}-annual`],
    })),
    result: totalRentalRevenue,
    resultFormatted: formatCurrency(totalRentalRevenue),
  });

  // Other income
  const parkingPerUnit = inputs['calc-parking-per-unit'] ?? 0;
  const laundryPerUnit = inputs['calc-laundry-per-unit'] ?? 0;
  const otherIncome = inputs['calc-other-income'] ?? 0;

  const parkingTotal = parkingPerUnit * totalUnits * 12;
  const laundryTotal = laundryPerUnit * totalUnits * 12;
  const totalOtherIncome = parkingTotal + laundryTotal + otherIncome;

  outputs['calc-parking-total'] = parkingTotal;
  outputs['calc-laundry-total'] = laundryTotal;
  outputs['calc-total-other-income'] = totalOtherIncome;

  if (totalOtherIncome > 0) {
    steps.push({
      id: 'other-income',
      label: 'Other Income',
      formula: `Parking + Laundry + Other`,
      inputs: [
        { name: 'Parking', value: parkingTotal },
        { name: 'Laundry', value: laundryTotal },
        { name: 'Other', value: otherIncome },
      ],
      result: totalOtherIncome,
      resultFormatted: formatCurrency(totalOtherIncome),
    });
  }

  // PGR
  const pgr = totalRentalRevenue + totalOtherIncome;
  outputs['calc-pgr'] = pgr;
  outputs['calc-pgr-per-unit'] = totalUnits > 0 ? Math.round(pgr / totalUnits) : 0;
  outputs['calc-pgr-per-sf'] = totalSf > 0 ? Math.round((pgr / totalSf) * 100) / 100 : 0;

  steps.push({
    id: 'pgr',
    label: 'Potential Gross Revenue (PGR)',
    formula: `Rental Revenue + Other Income`,
    inputs: [
      { name: 'Rental Revenue', value: totalRentalRevenue },
      { name: 'Other Income', value: totalOtherIncome },
    ],
    result: pgr,
    resultFormatted: formatCurrency(pgr),
    explanation: 'PGR represents total income assuming 100% occupancy',
  });

  // Type totals
  outputs['calc-type-total-per-unit'] = totalUnits > 0 ? Math.round(totalRentalRevenue / totalUnits) : 0;
  outputs['calc-type-total-per-sf'] = totalSf > 0 ? Math.round((totalRentalRevenue / totalSf) * 100) / 100 : 0;
  outputs['calc-rental-revenue-per-unit'] = totalUnits > 0 ? Math.round(totalRentalRevenue / totalUnits) : 0;
  outputs['calc-other-income-per-unit'] = totalUnits > 0 ? Math.round(totalOtherIncome / totalUnits) : 0;
  outputs['calc-other-income-per-sf'] = totalSf > 0 ? Math.round((totalOtherIncome / totalSf) * 100) / 100 : 0;

  return {
    outputs,
    steps,
    success: true,
  };
}

/**
 * External dependencies this table reads from the store
 */
const dependencyFields: TableFieldDefinition[] = [
  {
    id: 'subject-units',
    storeId: 'subject-units',
    label: 'Total Units (from Home Tab)',
    type: 'number',
    source: 'input', // External input from Home Tab
  },
];

/**
 * Income Table Definition
 */
export const incomeTable: FinancialTable = {
  id: 'income-table',
  name: 'Income & Revenue',
  category: 'income',
  description:
    'Calculates rental revenue by unit type, other income sources, and Potential Gross Revenue (PGR). Foundation for all other financial calculations.',
  inputFields,
  outputFields,
  dependencyFields,
  calculate,
  testCases: [
    {
      name: 'North Battleford Income',
      inputs: {
        // Type 1: Bachelor - 2 units @ $485
        'calc-type1-count': 2,
        'calc-type1-sf': 400,
        'calc-type1-rent': 485,
        // Type 2: 1-Bedroom - 6 units @ $665
        'calc-type2-count': 6,
        'calc-type2-sf': 575,
        'calc-type2-rent': 665,
        // Type 3: 2-Bedroom - 10 units @ $835
        'calc-type3-count': 10,
        'calc-type3-sf': 850,
        'calc-type3-rent': 835,
        // Type 4: 3-Bedroom - 2 units @ $950
        'calc-type4-count': 2,
        'calc-type4-sf': 1100,
        'calc-type4-rent': 950,
        // Other income
        'calc-parking-per-unit': 0,
        'calc-laundry-per-unit': 0,
        'calc-other-income': 0,
      },
      // subject-units from Home Tab (authority for total unit count)
      dependencies: {
        'subject-units': 20,
      },
      expectedOutputs: {
        'calc-total-units': 20,
        'calc-pgr': 204240, // Template expects $204,240
      },
      tolerance: 1,
    },
  ],
  templateLocation: {
    file: 'public/Report-MF-template.html',
    startLine: 3900,
    endLine: 4000,
  },
};

export default incomeTable;
