/**
 * Income Approach Panel - Report-style table
 *
 * Shows Income Approach calculation flow in report format:
 * Revenue -> Expenses -> NOI -> Value
 * All fields editable and wired to store.
 */

import { useEffect } from 'react';
import { useReportBuilderStore } from '@/features/report-builder/store/reportBuilderStore';
import { Input } from '@/components/ui/input';
import { useTheme } from '../context/ThemeContext';

interface IncomeApproachPanelProps {
  onValueChange?: (value: number) => void;
}

export default function IncomeApproachPanel({ onValueChange }: IncomeApproachPanelProps) {
  const { colors } = useTheme();
  const sections = useReportBuilderStore(state => state.sections);
  const updateFieldValue = useReportBuilderStore(state => state.updateFieldValue);
  const runCalculations = useReportBuilderStore(state => state.runCalculations);

  // Helper to get field value from any section
  const getFieldValue = (fieldId: string): any => {
    for (const section of sections) {
      const field = section.fields?.find((f: any) => f.id === fieldId);
      if (field) return field.value;
      if (section.subsections) {
        for (const sub of section.subsections) {
          const subField = sub.fields?.find((f: any) => f.id === fieldId);
          if (subField) return subField.value;
        }
      }
    }
    return '';
  };

  // Helper to get numeric field value
  const getFieldValueNumber = (fieldId: string): number => {
    return Number(getFieldValue(fieldId)) || 0;
  };

  // Update field and trigger recalculation
  const updateField = (fieldId: string, value: string | number) => {
    updateFieldValue(fieldId, value);
    setTimeout(() => runCalculations(), 0);
  };

  // Get values from store
  const rentalRevenue = getFieldValueNumber('calc-total-rental-revenue');
  const otherIncome = getFieldValueNumber('calc-other-income');
  const pgr = getFieldValueNumber('calc-pgr');
  const vacancyLoss = getFieldValueNumber('calc-vacancy-loss');
  const egr = getFieldValueNumber('calc-egr');
  const totalUnits = getFieldValueNumber('calc-total-units');
  const totalSf = getFieldValueNumber('calc-total-sf');

  // Expenses
  const expTaxes = getFieldValueNumber('calc-exp-taxes-annual');
  const expInsurance = getFieldValueNumber('calc-exp-insurance-annual');
  const expRepairs = getFieldValueNumber('calc-exp-repairs-annual');
  const expPayroll = getFieldValueNumber('calc-exp-payroll-annual');
  const expUtilities = getFieldValueNumber('calc-exp-utilities-annual');
  const expManagement = getFieldValueNumber('calc-exp-management-annual');
  const expOther = getFieldValueNumber('calc-exp-other-annual');
  const totalExpenses = getFieldValueNumber('calc-total-expenses');

  // Value
  const noi = getFieldValueNumber('calc-noi');
  const capRate = getFieldValueNumber('calc-cap-rate');
  const rawValue = getFieldValueNumber('calc-raw-value');
  const adjTotal = getFieldValueNumber('calc-adj-total');
  const indicatedValue = getFieldValueNumber('calc-indicated-value');

  // Unit Mix data
  const type1Name = getFieldValue('calc-type1-name') || '1 Bed / 1 Bath';
  const type1Count = getFieldValueNumber('calc-type1-count');
  const type1Sf = getFieldValueNumber('calc-type1-sf');
  const type1Rent = getFieldValueNumber('calc-type1-rent');
  const type1ContractRent = getFieldValueNumber('calc-type1-contract-rent') || type1Rent;
  const type1Annual = type1Count * type1Rent * 12;
  const type1ContVsMarket = type1Rent > 0 ? (type1ContractRent / type1Rent) * 100 : 0;

  const type2Name = getFieldValue('calc-type2-name') || '2 Bed / 1 Bath';
  const type2Count = getFieldValueNumber('calc-type2-count');
  const type2Sf = getFieldValueNumber('calc-type2-sf');
  const type2Rent = getFieldValueNumber('calc-type2-rent');
  const type2ContractRent = getFieldValueNumber('calc-type2-contract-rent') || type2Rent;
  const type2Annual = type2Count * type2Rent * 12;
  const type2ContVsMarket = type2Rent > 0 ? (type2ContractRent / type2Rent) * 100 : 0;

  const type3Name = getFieldValue('calc-type3-name') || '3 Bed / 2 Bath';
  const type3Count = getFieldValueNumber('calc-type3-count');
  const type3Sf = getFieldValueNumber('calc-type3-sf');
  const type3Rent = getFieldValueNumber('calc-type3-rent');
  const type3ContractRent = getFieldValueNumber('calc-type3-contract-rent') || type3Rent;
  const type3Annual = type3Count * type3Rent * 12;
  const type3ContVsMarket = type3Rent > 0 ? (type3ContractRent / type3Rent) * 100 : 0;

  const type4Name = getFieldValue('calc-type4-name') || 'Studio';
  const type4Count = getFieldValueNumber('calc-type4-count');
  const type4Sf = getFieldValueNumber('calc-type4-sf');
  const type4Rent = getFieldValueNumber('calc-type4-rent');
  const type4ContractRent = getFieldValueNumber('calc-type4-contract-rent') || type4Rent;
  const type4Annual = type4Count * type4Rent * 12;
  const type4ContVsMarket = type4Rent > 0 ? (type4ContractRent / type4Rent) * 100 : 0;

  const totalUnitCount = type1Count + type2Count + type3Count + type4Count;
  const totalUnitSf = type1Sf + type2Sf + type3Sf + type4Sf;
  const totalAnnualRent = type1Annual + type2Annual + type3Annual + type4Annual;

  // Calculate per-unit and per-SF values
  const rentalRevenuePerUnit = totalUnits > 0 ? rentalRevenue / totalUnits : 0;
  const rentalRevenuePerSF = totalSf > 0 ? rentalRevenue / totalSf : 0;
  const otherIncomePerUnit = totalUnits > 0 ? otherIncome / totalUnits : 0;
  const otherIncomePerSF = totalSf > 0 ? otherIncome / totalSf : 0;
  const pgrPerUnit = totalUnits > 0 ? pgr / totalUnits : 0;
  const pgrPerSF = totalSf > 0 ? pgr / totalSf : 0;
  const vacancyLossPerUnit = totalUnits > 0 ? vacancyLoss / totalUnits : 0;
  const vacancyLossPerSF = totalSf > 0 ? vacancyLoss / totalSf : 0;
  const egrPerUnit = totalUnits > 0 ? egr / totalUnits : 0;
  const egrPerSF = totalSf > 0 ? egr / totalSf : 0;

  // Calculate percentages
  const rentalRevenuePctPGR = pgr > 0 ? (rentalRevenue / pgr) * 100 : 0;
  const otherIncomePctPGR = pgr > 0 ? (otherIncome / pgr) * 100 : 0;
  const vacancyLossPctPGR = pgr > 0 ? (vacancyLoss / pgr) * 100 : 0;
  const egrPctPGR = pgr > 0 ? (egr / pgr) * 100 : 0;

  // Expense percentages
  const expTaxesPctEGR = egr > 0 ? (expTaxes / egr) * 100 : 0;
  const expInsurancePctEGR = egr > 0 ? (expInsurance / egr) * 100 : 0;
  const expRepairsPctEGR = egr > 0 ? (expRepairs / egr) * 100 : 0;
  const expPayrollPctEGR = egr > 0 ? (expPayroll / egr) * 100 : 0;
  const expUtilitiesPctEGR = egr > 0 ? (expUtilities / egr) * 100 : 0;
  const expManagementPctEGR = egr > 0 ? (expManagement / egr) * 100 : 0;
  const expOtherPctEGR = egr > 0 ? (expOther / egr) * 100 : 0;
  const totalExpensesPctEGR = egr > 0 ? (totalExpenses / egr) * 100 : 0;

  // Notify parent when indicated value changes
  useEffect(() => {
    if (onValueChange) {
      onValueChange(indicatedValue);
    }
  }, [indicatedValue, onValueChange]);

  const formatCurrency = (n: number) => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  const formatNumber = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 2 });
  const formatPercentage = (n: number) => n.toFixed(1) + '%';

  // Deduction formatting: brackets + red color for expenses/vacancy
  // Matches source report style where all costs are shown in red with brackets
  const expenseRed = '#dc2626'; // Tailwind red-600
  const formatDeduction = (n: number) => `(${formatCurrency(Math.abs(n))})`;
  const formatDeductionPct = (n: number) => `(${Math.abs(n).toFixed(1)}%)`;

  const inputStyle = {
    backgroundColor: colors.inputBg,
    borderColor: colors.border,
    color: colors.text,
  };

  return (
    <div className="space-y-3 text-xs" style={{ color: colors.text }}>

      {/* DIRECT CAPITALIZATION - UNIT MIX TABLE */}
      <div className="rounded-sm overflow-hidden mb-3" style={{ border: `1px solid ${colors.border}` }}>
        <div className="px-2 py-1.5" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
            Direct Capitalization
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px]">
            <thead style={{ borderBottom: `1px solid ${colors.border}` }}>
              <tr>
                <th className="px-2 py-1 text-left font-normal" style={{ color: colors.textMuted }}>Unit Type</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>Count</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>SF</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>Rent/Mo</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>Contract</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>% Market</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>Annual</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>$/Unit</th>
              </tr>
            </thead>
            <tbody>
              {/* Type 1 Row */}
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.text }}>{type1Name}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{type1Count}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{type1Sf.toLocaleString()}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(type1Rent)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(type1ContractRent)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatPercentage(type1ContVsMarket)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(type1Annual)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(type1Count > 0 ? type1Annual / type1Count : 0)}</td>
              </tr>
              {/* Type 2 Row */}
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.text }}>{type2Name}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{type2Count}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{type2Sf.toLocaleString()}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(type2Rent)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(type2ContractRent)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatPercentage(type2ContVsMarket)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(type2Annual)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(type2Count > 0 ? type2Annual / type2Count : 0)}</td>
              </tr>
              {/* Type 3 Row */}
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.text }}>{type3Name}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{type3Count}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{type3Sf.toLocaleString()}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(type3Rent)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(type3ContractRent)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatPercentage(type3ContVsMarket)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(type3Annual)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(type3Count > 0 ? type3Annual / type3Count : 0)}</td>
              </tr>
              {/* Type 4 Row */}
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.text }}>{type4Name}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{type4Count}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{type4Sf.toLocaleString()}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(type4Rent)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(type4ContractRent)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatPercentage(type4ContVsMarket)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(type4Annual)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(type4Count > 0 ? type4Annual / type4Count : 0)}</td>
              </tr>
              {/* Total Row */}
              <tr style={{ borderTop: `2px solid ${colors.border}` }}>
                <td className="px-2 py-1 font-medium" style={{ color: colors.text }}>TOTAL</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{totalUnitCount}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{totalUnitSf.toLocaleString()}</td>
                <td colSpan={3}></td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(totalAnnualRent)}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(totalUnitCount > 0 ? totalAnnualRent / totalUnitCount : 0)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* POTENTIAL GROSS REVENUE TABLE */}
      <div className="rounded-sm overflow-hidden mb-3" style={{ border: `1px solid ${colors.border}` }}>
        <div className="px-2 py-1.5" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
            Potential Gross Revenue
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px]">
            <thead style={{ borderBottom: `1px solid ${colors.border}` }}>
              <tr>
                <th className="px-2 py-1 text-left font-normal" style={{ color: colors.textMuted }}>Item</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>Annual</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>$/Unit</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>$/SF</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>% of PGR</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>% of EGR</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Rental Revenue</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(rentalRevenue)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(rentalRevenuePerUnit)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(rentalRevenuePerSF)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatPercentage(rentalRevenuePctPGR)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>-</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Other Income</td>
                <td className="px-2 py-1 text-right">
                  <Input
                    type="number"
                    value={otherIncome || ''}
                    onChange={e => updateField('calc-other-income', parseFloat(e.target.value) || 0)}
                    className="h-6 w-24 text-right text-xs p-1 ml-auto"
                    style={inputStyle}
                  />
                </td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(otherIncomePerUnit)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(otherIncomePerSF)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatPercentage(otherIncomePctPGR)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>-</td>
              </tr>
              <tr style={{ borderBottom: `2px solid ${colors.border}` }}>
                <td className="px-2 py-1 font-medium" style={{ color: colors.text }}>Potential Gross Revenue</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(pgr)}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(pgrPerUnit)}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(pgrPerSF)}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>100.0%</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>-</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Vacancy</td>
                <td className="px-2 py-1 text-right" style={{ color: expenseRed }}>{formatDeduction(vacancyLoss)}</td>
                <td className="px-2 py-1 text-right" style={{ color: expenseRed }}>{formatDeduction(vacancyLossPerUnit)}</td>
                <td className="px-2 py-1 text-right" style={{ color: expenseRed }}>{formatDeductionPct(vacancyLossPctPGR)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>-</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>-</td>
              </tr>
              <tr style={{ borderBottom: `2px solid ${colors.border}` }}>
                <td className="px-2 py-1 font-medium" style={{ color: colors.text }}>Effective Gross Revenue</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(egr)}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(egrPerUnit)}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(egrPerSF)}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatPercentage(egrPctPGR)}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>100.0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* OPERATING EXPENSES TABLE */}
      <div className="rounded-sm overflow-hidden mb-3" style={{ border: `1px solid ${colors.border}` }}>
        <div className="px-2 py-1.5" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
            Operating Expenses
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px]">
            <thead style={{ borderBottom: `1px solid ${colors.border}` }}>
              <tr>
                <th className="px-2 py-1 text-left font-normal" style={{ color: colors.textMuted }}>Item</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>Total</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>$/Unit</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>% of EGR</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Taxes</td>
                <td className="px-2 py-1 text-right" style={{ color: expenseRed }}>{formatDeduction(expTaxes)}</td>
                <td className="px-2 py-1 text-right" style={{ color: expenseRed }}>{formatDeduction(expTaxes / totalUnits)}</td>
                <td className="px-2 py-1 text-right" style={{ color: expenseRed }}>{formatDeductionPct(expTaxesPctEGR)}</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Insurance</td>
                <td className="px-2 py-1 text-right" style={{ color: expenseRed }}>{formatDeduction(expInsurance)}</td>
                <td className="px-2 py-1 text-right" style={{ color: expenseRed }}>{formatDeduction(expInsurance / totalUnits)}</td>
                <td className="px-2 py-1 text-right" style={{ color: expenseRed }}>{formatDeductionPct(expInsurancePctEGR)}</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Repairs & Maintenance</td>
                <td className="px-2 py-1 text-right" style={{ color: expenseRed }}>{formatDeduction(expRepairs)}</td>
                <td className="px-2 py-1 text-right" style={{ color: expenseRed }}>{formatDeduction(expRepairs / totalUnits)}</td>
                <td className="px-2 py-1 text-right" style={{ color: expenseRed }}>{formatDeductionPct(expRepairsPctEGR)}</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Payroll</td>
                <td className="px-2 py-1 text-right" style={{ color: expenseRed }}>{formatDeduction(expPayroll)}</td>
                <td className="px-2 py-1 text-right" style={{ color: expenseRed }}>{formatDeduction(expPayroll / totalUnits)}</td>
                <td className="px-2 py-1 text-right" style={{ color: expenseRed }}>{formatDeductionPct(expPayrollPctEGR)}</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Utilities</td>
                <td className="px-2 py-1 text-right" style={{ color: expenseRed }}>{formatDeduction(expUtilities)}</td>
                <td className="px-2 py-1 text-right" style={{ color: expenseRed }}>{formatDeduction(expUtilities / totalUnits)}</td>
                <td className="px-2 py-1 text-right" style={{ color: expenseRed }}>{formatDeductionPct(expUtilitiesPctEGR)}</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Management</td>
                <td className="px-2 py-1 text-right" style={{ color: expenseRed }}>{formatDeduction(expManagement)}</td>
                <td className="px-2 py-1 text-right" style={{ color: expenseRed }}>{formatDeduction(expManagement / totalUnits)}</td>
                <td className="px-2 py-1 text-right" style={{ color: expenseRed }}>{formatDeductionPct(expManagementPctEGR)}</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Other</td>
                <td className="px-2 py-1 text-right" style={{ color: expenseRed }}>{formatDeduction(expOther)}</td>
                <td className="px-2 py-1 text-right" style={{ color: expenseRed }}>{formatDeduction(expOther / totalUnits)}</td>
                <td className="px-2 py-1 text-right" style={{ color: expenseRed }}>{formatDeductionPct(expOtherPctEGR)}</td>
              </tr>
              <tr style={{ borderBottom: `2px solid ${colors.border}` }}>
                <td className="px-2 py-1 font-medium" style={{ color: colors.text }}>Total Expenses</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: expenseRed }}>{formatDeduction(totalExpenses)}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: expenseRed }}>{formatDeduction(totalExpenses / totalUnits)}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: expenseRed }}>{formatDeductionPct(totalExpensesPctEGR)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* NET OPERATING INCOME TABLE */}
      <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
        <div className="px-2 py-1.5" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
            Net Operating Income
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px]">
            <thead style={{ borderBottom: `1px solid ${colors.border}` }}>
              <tr>
                <th className="px-2 py-1 text-left font-normal" style={{ color: colors.textMuted }}>Item</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>Annual</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>$/Unit</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>$/SF</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1 font-medium" style={{ color: colors.text }}>Net Operating Income</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(noi)}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(noi / totalUnits)}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(noi / totalSf)}</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Cap Rate</td>
                <td className="px-2 py-1 text-right">
                  <Input
                    type="number"
                    step="0.01"
                    value={capRate || ''}
                    onChange={e => updateField('calc-cap-rate', parseFloat(e.target.value) || 0)}
                    className="h-6 w-20 text-right text-xs p-1 ml-auto"
                    style={inputStyle}
                  />
                  <span className="ml-1" style={{ color: colors.textMuted }}>%</span>
                </td>
                <td colSpan={2}></td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Raw Value</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(rawValue)}</td>
                <td colSpan={2}></td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Adjustments</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(adjTotal)}</td>
                <td colSpan={2}></td>
              </tr>
              <tr style={{ borderTop: `2px solid ${colors.border}` }}>
                <td className="px-2 py-1 font-bold text-sm" style={{ color: colors.text }}>Indicated Value</td>
                <td className="px-2 py-1 text-right font-bold text-sm" style={{ color: colors.text }}>{formatCurrency(indicatedValue)}</td>
                <td colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
