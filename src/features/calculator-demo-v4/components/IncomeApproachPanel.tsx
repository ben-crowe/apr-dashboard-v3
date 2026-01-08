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
  const otherIncome = getFieldValueNumber('calc-other-income'); // kept for backwards compat
  const pgr = getFieldValueNumber('calc-pgr');
  const vacancyLoss = getFieldValueNumber('calc-vacancy-loss');
  const egr = getFieldValueNumber('calc-egr');
  const totalUnits = getFieldValueNumber('calc-total-units');
  const totalSf = getFieldValueNumber('calc-total-sf');

  // Other Revenue breakdown
  const parkingIncome = getFieldValueNumber('calc-parking-income');
  const laundryIncome = getFieldValueNumber('calc-laundry-income');
  const totalOtherRevenue = parkingIncome + laundryIncome;

  // Expenses
  const expTaxes = getFieldValueNumber('calc-exp-taxes-annual');
  const expInsurance = getFieldValueNumber('calc-exp-insurance-annual');
  const expRepairs = getFieldValueNumber('calc-exp-repairs-annual');
  const expPayroll = getFieldValueNumber('calc-exp-payroll-annual');
  const expUtilities = getFieldValueNumber('calc-exp-utilities-annual');
  const expManagement = getFieldValueNumber('calc-exp-management-annual');
  const expOther = getFieldValueNumber('calc-exp-other-annual');
  // Calculate total dynamically to ensure it tallies
  const totalExpenses = expTaxes + expInsurance + expRepairs + expPayroll + expUtilities + expManagement + expOther;

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

  // Other revenue percentages
  const parkingIncomePctPGR = pgr > 0 ? (parkingIncome / pgr) * 100 : 0;
  const laundryIncomePctPGR = pgr > 0 ? (laundryIncome / pgr) * 100 : 0;
  const totalOtherRevenuePctPGR = pgr > 0 ? (totalOtherRevenue / pgr) * 100 : 0;

  // Per-unit and per-SF for other revenue items
  const parkingIncomePerUnit = totalUnits > 0 ? parkingIncome / totalUnits : 0;
  const parkingIncomePerSF = totalSf > 0 ? parkingIncome / totalSf : 0;
  const laundryIncomePerUnit = totalUnits > 0 ? laundryIncome / totalUnits : 0;
  const laundryIncomePerSF = totalSf > 0 ? laundryIncome / totalSf : 0;
  const totalOtherRevenuePerUnit = totalUnits > 0 ? totalOtherRevenue / totalUnits : 0;
  const totalOtherRevenuePerSF = totalSf > 0 ? totalOtherRevenue / totalSf : 0;

  // Expense per-SF calculations
  const expTaxesPerSF = totalSf > 0 ? expTaxes / totalSf : 0;
  const expInsurancePerSF = totalSf > 0 ? expInsurance / totalSf : 0;
  const expRepairsPerSF = totalSf > 0 ? expRepairs / totalSf : 0;
  const expPayrollPerSF = totalSf > 0 ? expPayroll / totalSf : 0;
  const expUtilitiesPerSF = totalSf > 0 ? expUtilities / totalSf : 0;
  const expManagementPerSF = totalSf > 0 ? expManagement / totalSf : 0;
  const expOtherPerSF = totalSf > 0 ? expOther / totalSf : 0;
  const totalExpensesPerSF = totalSf > 0 ? totalExpenses / totalSf : 0;

  // Expense % of PGR calculations
  const expTaxesPctPGR = pgr > 0 ? (expTaxes / pgr) * 100 : 0;
  const expInsurancePctPGR = pgr > 0 ? (expInsurance / pgr) * 100 : 0;
  const expRepairsPctPGR = pgr > 0 ? (expRepairs / pgr) * 100 : 0;
  const expPayrollPctPGR = pgr > 0 ? (expPayroll / pgr) * 100 : 0;
  const expUtilitiesPctPGR = pgr > 0 ? (expUtilities / pgr) * 100 : 0;
  const expManagementPctPGR = pgr > 0 ? (expManagement / pgr) * 100 : 0;
  const expOtherPctPGR = pgr > 0 ? (expOther / pgr) * 100 : 0;
  const totalExpensesPctPGR = pgr > 0 ? (totalExpenses / pgr) * 100 : 0;

  // Expense % of EGR calculations
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

  // Deduction formatting: brackets for expenses/vacancy (accounting convention)
  // Red color is used in the printed report template, but not in the app UI for readability
  const formatDeduction = (n: number) => `(${formatCurrency(Math.abs(n))})`;
  const formatDeductionPct = (n: number) => `(${Math.abs(n).toFixed(1)}%)`;

  const inputStyle = {
    backgroundColor: colors.inputBg,
    borderColor: colors.border,
    color: colors.text,
  };

  // Section header style (no background for dark mode compatibility)
  const sectionHeaderStyle = {};

  // Summary row styles (no background color in app - only in report template)
  const pgrSummaryStyle = {};
  const egrSummaryStyle = {};

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
                <td className="px-2 py-1 flex justify-end" style={{ color: colors.text }}>
                  <Input
                    type="number"
                    value={type1Count || ''}
                    onChange={(e) => updateField('calc-type1-count', Number(e.target.value) || 0)}
                    className="w-14 h-6 text-right text-[10px] px-1 ml-auto"
                    min={0}
                  />
                </td>
                <td className="px-2 py-1 flex justify-end" style={{ color: colors.text }}>
                  <Input
                    type="number"
                    value={type1Sf || ''}
                    onChange={(e) => updateField('calc-type1-sf', Number(e.target.value) || 0)}
                    className="w-16 h-6 text-right text-[10px] px-1 ml-auto"
                    min={0}
                  />
                </td>
                <td className="px-2 py-1 flex justify-end" style={{ color: colors.text }}>
                  <Input
                    type="number"
                    value={type1Rent || ''}
                    onChange={(e) => updateField('calc-type1-rent', Number(e.target.value) || 0)}
                    className="w-16 h-6 text-right text-[10px] px-1 ml-auto"
                    min={0}
                  />
                </td>
                <td className="px-2 py-1 flex justify-end" style={{ color: colors.text }}>
                  <Input
                    type="number"
                    value={type1ContractRent || ''}
                    onChange={(e) => updateField('calc-type1-contract-rent', Number(e.target.value) || 0)}
                    className="w-16 h-6 text-right text-[10px] px-1 ml-auto"
                    min={0}
                  />
                </td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatPercentage(type1ContVsMarket)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(type1Annual)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(type1Count > 0 ? type1Annual / type1Count : 0)}</td>
              </tr>
              {/* Type 2 Row */}
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.text }}>{type2Name}</td>
                <td className="px-2 py-1 flex justify-end" style={{ color: colors.text }}>
                  <Input
                    type="number"
                    value={type2Count || ''}
                    onChange={(e) => updateField('calc-type2-count', Number(e.target.value) || 0)}
                    className="w-14 h-6 text-right text-[10px] px-1 ml-auto"
                    min={0}
                  />
                </td>
                <td className="px-2 py-1 flex justify-end" style={{ color: colors.text }}>
                  <Input
                    type="number"
                    value={type2Sf || ''}
                    onChange={(e) => updateField('calc-type2-sf', Number(e.target.value) || 0)}
                    className="w-16 h-6 text-right text-[10px] px-1 ml-auto"
                    min={0}
                  />
                </td>
                <td className="px-2 py-1 flex justify-end" style={{ color: colors.text }}>
                  <Input
                    type="number"
                    value={type2Rent || ''}
                    onChange={(e) => updateField('calc-type2-rent', Number(e.target.value) || 0)}
                    className="w-16 h-6 text-right text-[10px] px-1 ml-auto"
                    min={0}
                  />
                </td>
                <td className="px-2 py-1 flex justify-end" style={{ color: colors.text }}>
                  <Input
                    type="number"
                    value={type2ContractRent || ''}
                    onChange={(e) => updateField('calc-type2-contract-rent', Number(e.target.value) || 0)}
                    className="w-16 h-6 text-right text-[10px] px-1 ml-auto"
                    min={0}
                  />
                </td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatPercentage(type2ContVsMarket)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(type2Annual)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(type2Count > 0 ? type2Annual / type2Count : 0)}</td>
              </tr>
              {/* Type 3 Row */}
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.text }}>{type3Name}</td>
                <td className="px-2 py-1 flex justify-end" style={{ color: colors.text }}>
                  <Input
                    type="number"
                    value={type3Count || ''}
                    onChange={(e) => updateField('calc-type3-count', Number(e.target.value) || 0)}
                    className="w-14 h-6 text-right text-[10px] px-1 ml-auto"
                    min={0}
                  />
                </td>
                <td className="px-2 py-1 flex justify-end" style={{ color: colors.text }}>
                  <Input
                    type="number"
                    value={type3Sf || ''}
                    onChange={(e) => updateField('calc-type3-sf', Number(e.target.value) || 0)}
                    className="w-16 h-6 text-right text-[10px] px-1 ml-auto"
                    min={0}
                  />
                </td>
                <td className="px-2 py-1 flex justify-end" style={{ color: colors.text }}>
                  <Input
                    type="number"
                    value={type3Rent || ''}
                    onChange={(e) => updateField('calc-type3-rent', Number(e.target.value) || 0)}
                    className="w-16 h-6 text-right text-[10px] px-1 ml-auto"
                    min={0}
                  />
                </td>
                <td className="px-2 py-1 flex justify-end" style={{ color: colors.text }}>
                  <Input
                    type="number"
                    value={type3ContractRent || ''}
                    onChange={(e) => updateField('calc-type3-contract-rent', Number(e.target.value) || 0)}
                    className="w-16 h-6 text-right text-[10px] px-1 ml-auto"
                    min={0}
                  />
                </td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatPercentage(type3ContVsMarket)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(type3Annual)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(type3Count > 0 ? type3Annual / type3Count : 0)}</td>
              </tr>
              {/* Type 4 Row */}
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.text }}>{type4Name}</td>
                <td className="px-2 py-1 flex justify-end" style={{ color: colors.text }}>
                  <Input
                    type="number"
                    value={type4Count || ''}
                    onChange={(e) => updateField('calc-type4-count', Number(e.target.value) || 0)}
                    className="w-14 h-6 text-right text-[10px] px-1 ml-auto"
                    min={0}
                  />
                </td>
                <td className="px-2 py-1 flex justify-end" style={{ color: colors.text }}>
                  <Input
                    type="number"
                    value={type4Sf || ''}
                    onChange={(e) => updateField('calc-type4-sf', Number(e.target.value) || 0)}
                    className="w-16 h-6 text-right text-[10px] px-1 ml-auto"
                    min={0}
                  />
                </td>
                <td className="px-2 py-1 flex justify-end" style={{ color: colors.text }}>
                  <Input
                    type="number"
                    value={type4Rent || ''}
                    onChange={(e) => updateField('calc-type4-rent', Number(e.target.value) || 0)}
                    className="w-16 h-6 text-right text-[10px] px-1 ml-auto"
                    min={0}
                  />
                </td>
                <td className="px-2 py-1 flex justify-end" style={{ color: colors.text }}>
                  <Input
                    type="number"
                    value={type4ContractRent || ''}
                    onChange={(e) => updateField('calc-type4-contract-rent', Number(e.target.value) || 0)}
                    className="w-16 h-6 text-right text-[10px] px-1 ml-auto"
                    min={0}
                  />
                </td>
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
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>% of PGR</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>% of EGR</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>$/Unit</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>$/SF</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>Annual</th>
              </tr>
            </thead>
            <tbody>
              {/* RENTAL REVENUE Section Header */}
              <tr style={{ ...sectionHeaderStyle }}>
                <td colSpan={6} className="px-2 py-1 font-bold" style={{ color: colors.text }}>RENTAL REVENUE</td>
              </tr>
              {/* Total Multifamily Revenue - data row */}
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ paddingLeft: '16px', color: colors.textMuted }}>Total Multifamily Revenue</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatPercentage(rentalRevenuePctPGR)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>-</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(rentalRevenuePerUnit)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(rentalRevenuePerSF)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(rentalRevenue)}</td>
              </tr>
              {/* TOTAL RENTAL REVENUE - subtotal row */}
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1 font-medium" style={{ color: colors.text }}>TOTAL RENTAL REVENUE</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatPercentage(rentalRevenuePctPGR)}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>-</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(rentalRevenuePerUnit)}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(rentalRevenuePerSF)}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(rentalRevenue)}</td>
              </tr>

              {/* OTHER REVENUE (MISCELLANEOUS) Section Header */}
              <tr style={{ ...sectionHeaderStyle }}>
                <td colSpan={6} className="px-2 py-1 font-bold" style={{ color: colors.text }}>OTHER REVENUE (MISCELLANEOUS)</td>
              </tr>
              {/* Parking Income - data row with editable input */}
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ paddingLeft: '16px', color: colors.textMuted }}>Parking Income</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatPercentage(parkingIncomePctPGR)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>-</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(parkingIncomePerUnit)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(parkingIncomePerSF)}</td>
                <td className="px-2 py-1 text-right">
                  <Input
                    type="number"
                    value={parkingIncome || ''}
                    onChange={e => updateField('calc-parking-income', parseFloat(e.target.value) || 0)}
                    className="h-6 w-24 text-right text-xs p-1 ml-auto"
                    style={inputStyle}
                  />
                </td>
              </tr>
              {/* Laundry - data row with editable input */}
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ paddingLeft: '16px', color: colors.textMuted }}>Laundry</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatPercentage(laundryIncomePctPGR)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>-</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(laundryIncomePerUnit)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(laundryIncomePerSF)}</td>
                <td className="px-2 py-1 text-right">
                  <Input
                    type="number"
                    value={laundryIncome || ''}
                    onChange={e => updateField('calc-laundry-income', parseFloat(e.target.value) || 0)}
                    className="h-6 w-24 text-right text-xs p-1 ml-auto"
                    style={inputStyle}
                  />
                </td>
              </tr>
              {/* TOTAL OTHER REVENUE - subtotal row */}
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1 font-medium" style={{ color: colors.text }}>TOTAL OTHER REVENUE</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatPercentage(totalOtherRevenuePctPGR)}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>-</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(totalOtherRevenuePerUnit)}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(totalOtherRevenuePerSF)}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(totalOtherRevenue)}</td>
              </tr>

              {/* POTENTIAL GROSS REVENUE - summary row */}
              <tr style={{ ...pgrSummaryStyle, borderTop: `2px solid ${colors.border}` }}>
                <td className="px-2 py-1 font-bold" style={{ color: colors.text }}>POTENTIAL GROSS REVENUE</td>
                <td className="px-2 py-1 text-right font-bold" style={{ color: colors.text }}>100.0%</td>
                <td className="px-2 py-1 text-right font-bold" style={{ color: colors.text }}>-</td>
                <td className="px-2 py-1 text-right font-bold" style={{ color: colors.text }}>{formatCurrency(pgrPerUnit)}</td>
                <td className="px-2 py-1 text-right font-bold" style={{ color: colors.text }}>{formatCurrency(pgrPerSF)}</td>
                <td className="px-2 py-1 text-right font-bold" style={{ color: colors.text }}>{formatCurrency(pgr)}</td>
              </tr>

              {/* ALL VACANCY LOSS Section Header */}
              <tr style={{ ...sectionHeaderStyle }}>
                <td colSpan={6} className="px-2 py-1 font-bold" style={{ color: colors.text }}>ALL VACANCY LOSS</td>
              </tr>
              {/* Vacancy - data row */}
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ paddingLeft: '16px', color: colors.textMuted }}>Vacancy</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeductionPct(vacancyLossPctPGR)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeductionPct(vacancyLossPctPGR)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeduction(vacancyLossPerUnit)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeduction(vacancyLossPerSF)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeduction(vacancyLoss)}</td>
              </tr>
              {/* TOTAL VACANCY & CREDIT LOSS - subtotal row */}
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1 font-medium" style={{ color: colors.text }}>TOTAL VACANCY & CREDIT LOSS</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatDeductionPct(vacancyLossPctPGR)}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatDeductionPct(vacancyLossPctPGR)}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatDeduction(vacancyLossPerUnit)}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatDeduction(vacancyLossPerSF)}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatDeduction(vacancyLoss)}</td>
              </tr>

              {/* EFFECTIVE GROSS REVENUE - summary row */}
              <tr style={{ ...egrSummaryStyle, borderTop: `2px solid ${colors.border}` }}>
                <td className="px-2 py-1 font-bold" style={{ color: colors.text }}>EFFECTIVE GROSS REVENUE</td>
                <td className="px-2 py-1 text-right font-bold" style={{ color: colors.text }}>{formatPercentage(egrPctPGR)}</td>
                <td className="px-2 py-1 text-right font-bold" style={{ color: colors.text }}>100.0%</td>
                <td className="px-2 py-1 text-right font-bold" style={{ color: colors.text }}>{formatCurrency(egrPerUnit)}</td>
                <td className="px-2 py-1 text-right font-bold" style={{ color: colors.text }}>{formatCurrency(egrPerSF)}</td>
                <td className="px-2 py-1 text-right font-bold" style={{ color: colors.text }}>{formatCurrency(egr)}</td>
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
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>% of PGR</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>% of EGR</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>$/Unit</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>$/SF</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>Annual</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Taxes</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeductionPct(expTaxesPctPGR)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeductionPct(expTaxesPctEGR)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeduction(expTaxes / totalUnits)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeduction(expTaxesPerSF)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeduction(expTaxes)}</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Insurance</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeductionPct(expInsurancePctPGR)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeductionPct(expInsurancePctEGR)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeduction(expInsurance / totalUnits)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeduction(expInsurancePerSF)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeduction(expInsurance)}</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Repairs & Maintenance</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeductionPct(expRepairsPctPGR)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeductionPct(expRepairsPctEGR)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeduction(expRepairs / totalUnits)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeduction(expRepairsPerSF)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeduction(expRepairs)}</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Payroll</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeductionPct(expPayrollPctPGR)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeductionPct(expPayrollPctEGR)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeduction(expPayroll / totalUnits)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeduction(expPayrollPerSF)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeduction(expPayroll)}</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Utilities</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeductionPct(expUtilitiesPctPGR)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeductionPct(expUtilitiesPctEGR)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeduction(expUtilities / totalUnits)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeduction(expUtilitiesPerSF)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeduction(expUtilities)}</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Management</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeductionPct(expManagementPctPGR)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeductionPct(expManagementPctEGR)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeduction(expManagement / totalUnits)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeduction(expManagementPerSF)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeduction(expManagement)}</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Other</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeductionPct(expOtherPctPGR)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeductionPct(expOtherPctEGR)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeduction(expOther / totalUnits)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeduction(expOtherPerSF)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatDeduction(expOther)}</td>
              </tr>
              <tr style={{ borderBottom: `2px solid ${colors.border}` }}>
                <td className="px-2 py-1 font-medium" style={{ color: colors.text }}>Total Expenses</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatDeductionPct(totalExpensesPctPGR)}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatDeductionPct(totalExpensesPctEGR)}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatDeduction(totalExpenses / totalUnits)}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatDeduction(totalExpensesPerSF)}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatDeduction(totalExpenses)}</td>
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
