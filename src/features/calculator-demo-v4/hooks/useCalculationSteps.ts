/**
 * useCalculationSteps Hook
 *
 * Non-invasive wrapper that re-implements calculation logic to capture steps.
 * Does NOT modify the validated calculator engine - runs in parallel.
 *
 * Subscribes to store fields and extracts intermediate calculation steps
 * for display in the walkthrough panel.
 */

import { useReportBuilderStore } from '@/features/report-builder/store/reportBuilderStore';
import { CalculationStepGroup } from '../types/calculatorDemo.types';

export function useCalculationSteps(): CalculationStepGroup[] {
  const { sections } = useReportBuilderStore();

  const calcSection = sections.find(s => s.id === 'calc');

  const getFieldValue = (fieldId: string): number => {
    if (!calcSection) return 0;

    const field = calcSection.fields.find(f => f.id === fieldId);
    if (field) return Number(field.value) || 0;

    if (calcSection.subsections) {
      for (const sub of calcSection.subsections) {
        const subField = sub.fields.find(f => f.id === fieldId);
        if (subField) return Number(subField.value) || 0;
      }
    }
    return 0;
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Re-implement calculation logic to capture steps
  const type1Count = getFieldValue('calc-type1-count');
  const type1Rent = getFieldValue('calc-type1-rent');
  const type1Annual = type1Count * type1Rent * 12;

  const type2Count = getFieldValue('calc-type2-count');
  const type2Rent = getFieldValue('calc-type2-rent');
  const type2Annual = type2Count * type2Rent * 12;

  const type3Count = getFieldValue('calc-type3-count');
  const type3Rent = getFieldValue('calc-type3-rent');
  const type3Annual = type3Count * type3Rent * 12;

  const type4Count = getFieldValue('calc-type4-count');
  const type4Rent = getFieldValue('calc-type4-rent');
  const type4Annual = type4Count * type4Rent * 12;

  const totalUnits = type1Count + type2Count + type3Count + type4Count;
  const totalRentalRevenue = type1Annual + type2Annual + type3Annual + type4Annual;

  const parkingPerUnit = getFieldValue('calc-parking-per-unit');
  const laundryPerUnit = getFieldValue('calc-laundry-per-unit');
  const otherIncome = getFieldValue('calc-other-income');
  const parkingTotal = parkingPerUnit * totalUnits * 12;
  const laundryTotal = laundryPerUnit * totalUnits * 12;
  const totalOtherIncome = parkingTotal + laundryTotal + otherIncome;

  const pgr = totalRentalRevenue + totalOtherIncome;

  const vacancyRate = getFieldValue('calc-vacancy-rate');
  const badDebtRate = getFieldValue('calc-bad-debt-rate');
  const concessionsRate = getFieldValue('calc-concessions-rate');
  const totalVacancyRate = vacancyRate + badDebtRate + concessionsRate;
  const vacancyLoss = pgr * (totalVacancyRate / 100);
  const egr = pgr - vacancyLoss;

  const expManagement = egr * (getFieldValue('calc-exp-management') / 100);
  const expTaxes = getFieldValue('calc-exp-taxes') * totalUnits;
  const expInsurance = getFieldValue('calc-exp-insurance') * totalUnits;
  const expRepairs = getFieldValue('calc-exp-repairs') * totalUnits;
  const expUtilities = getFieldValue('calc-exp-utilities') * totalUnits;
  const expPayroll = getFieldValue('calc-exp-payroll') * totalUnits;
  const expAdmin = getFieldValue('calc-exp-admin') * totalUnits;
  const expReserves = getFieldValue('calc-exp-reserves') * totalUnits;
  const expOther = getFieldValue('calc-exp-other') * totalUnits;
  const expensesTotal = expManagement + expTaxes + expInsurance + expRepairs + expUtilities + expPayroll + expAdmin + expReserves + expOther;
  const expenseRatio = egr > 0 ? (expensesTotal / egr) * 100 : 0;

  const noi = egr - expensesTotal;
  const capRate = getFieldValue('calc-cap-rate');
  const rawValue = capRate > 0 ? noi / (capRate / 100) : 0;
  const roundedValue = Math.round(rawValue / 10000) * 10000;

  const adjCapex = getFieldValue('calc-adj-capex');
  const adjLeasing = getFieldValue('calc-adj-leasing');
  const adjOther = getFieldValue('calc-adj-other');
  const adjTotal = adjCapex + adjLeasing + adjOther;
  const indicatedValue = roundedValue - adjTotal;

  // Build step groups
  const stepGroups: CalculationStepGroup[] = [
    {
      id: 'unit-mix',
      title: 'Step 1: Unit Mix Revenue',
      steps: [
        {
          id: 'type1',
          category: 'Unit Mix',
          label: 'Type 1 Annual Revenue',
          formula: `${type1Count} units × $${type1Rent}/mo × 12`,
          inputs: [
            { name: 'Count', value: type1Count, unit: 'units' },
            { name: 'Rent', value: type1Rent, unit: '$/month' },
          ],
          result: type1Annual,
          resultFormatted: formatCurrency(type1Annual),
        },
        {
          id: 'type2',
          category: 'Unit Mix',
          label: 'Type 2 Annual Revenue',
          formula: `${type2Count} units × $${type2Rent}/mo × 12`,
          inputs: [
            { name: 'Count', value: type2Count, unit: 'units' },
            { name: 'Rent', value: type2Rent, unit: '$/month' },
          ],
          result: type2Annual,
          resultFormatted: formatCurrency(type2Annual),
        },
      ],
      summary: `Total Rental Revenue: ${formatCurrency(totalRentalRevenue)}`,
    },
    {
      id: 'other-income',
      title: 'Step 2: Other Income',
      steps: [
        {
          id: 'parking',
          category: 'Other Income',
          label: 'Parking Income',
          formula: `$${parkingPerUnit}/unit/mo × ${totalUnits} units × 12`,
          inputs: [
            { name: 'Per Unit', value: parkingPerUnit, unit: '$/unit/month' },
            { name: 'Units', value: totalUnits, unit: 'units' },
          ],
          result: parkingTotal,
          resultFormatted: formatCurrency(parkingTotal),
        },
        {
          id: 'laundry',
          category: 'Other Income',
          label: 'Laundry Income',
          formula: `$${laundryPerUnit}/unit/mo × ${totalUnits} units × 12`,
          inputs: [
            { name: 'Per Unit', value: laundryPerUnit, unit: '$/unit/month' },
            { name: 'Units', value: totalUnits, unit: 'units' },
          ],
          result: laundryTotal,
          resultFormatted: formatCurrency(laundryTotal),
        },
      ],
      summary: `Total Other Income: ${formatCurrency(totalOtherIncome)}`,
    },
    {
      id: 'pgr',
      title: 'Step 3: Potential Gross Revenue (PGR)',
      steps: [
        {
          id: 'pgr-calc',
          category: 'PGR',
          label: 'PGR Calculation',
          formula: `${formatCurrency(totalRentalRevenue)} + ${formatCurrency(totalOtherIncome)}`,
          inputs: [
            { name: 'Rental Revenue', value: totalRentalRevenue, unit: '$' },
            { name: 'Other Income', value: totalOtherIncome, unit: '$' },
          ],
          result: pgr,
          resultFormatted: formatCurrency(pgr),
        },
      ],
      summary: `PGR = ${formatCurrency(pgr)}`,
    },
    {
      id: 'vacancy',
      title: 'Step 4: Vacancy & Loss',
      steps: [
        {
          id: 'vacancy-loss',
          category: 'Vacancy',
          label: 'Vacancy Loss',
          formula: `${formatCurrency(pgr)} × ${totalVacancyRate.toFixed(2)}%`,
          inputs: [
            { name: 'PGR', value: pgr, unit: '$' },
            { name: 'Loss Rate', value: totalVacancyRate, unit: '%' },
          ],
          result: vacancyLoss,
          resultFormatted: formatCurrency(vacancyLoss),
        },
        {
          id: 'egr',
          category: 'Vacancy',
          label: 'Effective Gross Revenue',
          formula: `${formatCurrency(pgr)} - ${formatCurrency(vacancyLoss)}`,
          inputs: [
            { name: 'PGR', value: pgr, unit: '$' },
            { name: 'Vacancy Loss', value: vacancyLoss, unit: '$' },
          ],
          result: egr,
          resultFormatted: formatCurrency(egr),
        },
      ],
      summary: `EGR = ${formatCurrency(egr)}`,
    },
    {
      id: 'expenses',
      title: 'Step 5: Operating Expenses',
      steps: [
        {
          id: 'exp-management',
          category: 'Expenses',
          label: 'Management',
          formula: `${formatCurrency(egr)} × ${getFieldValue('calc-exp-management')}%`,
          inputs: [{ name: 'EGR', value: egr, unit: '$' }],
          result: expManagement,
          resultFormatted: formatCurrency(expManagement),
        },
        {
          id: 'exp-taxes',
          category: 'Expenses',
          label: 'Taxes',
          formula: `$${getFieldValue('calc-exp-taxes')}/unit × ${totalUnits} units`,
          inputs: [{ name: 'Units', value: totalUnits, unit: 'units' }],
          result: expTaxes,
          resultFormatted: formatCurrency(expTaxes),
        },
      ],
      summary: `Total Expenses: ${formatCurrency(expensesTotal)} (${expenseRatio.toFixed(2)}% of EGR)`,
    },
    {
      id: 'noi',
      title: 'Step 6: Net Operating Income (NOI)',
      steps: [
        {
          id: 'noi-calc',
          category: 'NOI',
          label: 'NOI Calculation',
          formula: `${formatCurrency(egr)} - ${formatCurrency(expensesTotal)}`,
          inputs: [
            { name: 'EGR', value: egr, unit: '$' },
            { name: 'Expenses', value: expensesTotal, unit: '$' },
          ],
          result: noi,
          resultFormatted: formatCurrency(noi),
        },
      ],
      summary: `NOI = ${formatCurrency(noi)}`,
    },
    {
      id: 'capitalization',
      title: 'Step 7: Capitalized Value',
      steps: [
        {
          id: 'raw-value',
          category: 'Capitalization',
          label: 'Raw Value',
          formula: `${formatCurrency(noi)} ÷ ${capRate}%`,
          inputs: [
            { name: 'NOI', value: noi, unit: '$' },
            { name: 'Cap Rate', value: capRate, unit: '%' },
          ],
          result: rawValue,
          resultFormatted: formatCurrency(rawValue),
        },
        {
          id: 'rounded-value',
          category: 'Capitalization',
          label: 'Rounded Value',
          formula: `Round ${formatCurrency(rawValue)} to nearest $10,000`,
          inputs: [{ name: 'Raw Value', value: rawValue, unit: '$' }],
          result: roundedValue,
          resultFormatted: formatCurrency(roundedValue),
        },
      ],
      summary: `Rounded Value = ${formatCurrency(roundedValue)}`,
    },
    {
      id: 'final',
      title: 'Step 8: Final Indicated Value',
      steps: [
        {
          id: 'adjustments',
          category: 'Adjustments',
          label: 'Total Adjustments',
          formula: `${formatCurrency(adjCapex)} + ${formatCurrency(adjLeasing)} + ${formatCurrency(adjOther)}`,
          inputs: [
            { name: 'CapEx', value: adjCapex, unit: '$' },
            { name: 'Leasing', value: adjLeasing, unit: '$' },
            { name: 'Other', value: adjOther, unit: '$' },
          ],
          result: adjTotal,
          resultFormatted: formatCurrency(adjTotal),
        },
        {
          id: 'indicated-value',
          category: 'Final Value',
          label: 'Indicated Value',
          formula: `${formatCurrency(roundedValue)} - ${formatCurrency(adjTotal)}`,
          inputs: [
            { name: 'Rounded Value', value: roundedValue, unit: '$' },
            { name: 'Adjustments', value: adjTotal, unit: '$' },
          ],
          result: indicatedValue,
          resultFormatted: formatCurrency(indicatedValue),
        },
      ],
      summary: `FINAL INDICATED VALUE = ${formatCurrency(indicatedValue)}`,
    },
  ];

  return stepGroups;
}
