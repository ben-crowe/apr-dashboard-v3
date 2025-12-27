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

  const inputStyle = {
    backgroundColor: colors.inputBg,
    borderColor: colors.border,
    color: colors.text,
  };

  return (
    <div className="space-y-3 text-xs" style={{ color: colors.text }}>

      {/* INCOME APPROACH TABLE */}
      <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
        <div className="px-2 py-1.5" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
            Income Approach - Direct Capitalization
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
              {/* REVENUE SECTION */}
              <tr>
                <td colSpan={6} className="px-2 py-1 font-medium" style={{ color: colors.text, backgroundColor: colors.panelBgAlt }}>
                  REVENUE
                </td>
              </tr>
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
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Less: Vacancy & Collection</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(vacancyLoss)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(vacancyLossPerUnit)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(vacancyLossPerSF)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatPercentage(vacancyLossPctPGR)}</td>
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

              {/* EXPENSES SECTION */}
              <tr>
                <td colSpan={6} className="px-2 py-1 font-medium" style={{ color: colors.text, backgroundColor: colors.panelBgAlt }}>
                  EXPENSES
                </td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Taxes</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(expTaxes)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(expTaxes / totalUnits)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(expTaxes / totalSf)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>-</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatPercentage(expTaxesPctEGR)}</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Insurance</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(expInsurance)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(expInsurance / totalUnits)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(expInsurance / totalSf)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>-</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatPercentage(expInsurancePctEGR)}</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Repairs & Maintenance</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(expRepairs)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(expRepairs / totalUnits)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(expRepairs / totalSf)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>-</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatPercentage(expRepairsPctEGR)}</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Payroll</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(expPayroll)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(expPayroll / totalUnits)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(expPayroll / totalSf)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>-</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatPercentage(expPayrollPctEGR)}</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Utilities</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(expUtilities)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(expUtilities / totalUnits)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(expUtilities / totalSf)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>-</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatPercentage(expUtilitiesPctEGR)}</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Management</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(expManagement)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(expManagement / totalUnits)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(expManagement / totalSf)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>-</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatPercentage(expManagementPctEGR)}</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Other</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(expOther)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(expOther / totalUnits)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(expOther / totalSf)}</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>-</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatPercentage(expOtherPctEGR)}</td>
              </tr>
              <tr style={{ borderBottom: `2px solid ${colors.border}` }}>
                <td className="px-2 py-1 font-medium" style={{ color: colors.text }}>Total Expenses</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(totalExpenses)}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(totalExpenses / totalUnits)}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(totalExpenses / totalSf)}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>-</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatPercentage(totalExpensesPctEGR)}</td>
              </tr>

              {/* VALUE INDICATION SECTION */}
              <tr>
                <td colSpan={6} className="px-2 py-1 font-medium" style={{ color: colors.text, backgroundColor: colors.panelBgAlt }}>
                  VALUE INDICATION
                </td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1 font-medium" style={{ color: colors.text }}>Net Operating Income</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(noi)}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(noi / totalUnits)}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(noi / totalSf)}</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>-</td>
                <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>-</td>
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
                <td colSpan={4}></td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Raw Value</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(rawValue)}</td>
                <td colSpan={4}></td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Adjustments</td>
                <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatCurrency(adjTotal)}</td>
                <td colSpan={4}></td>
              </tr>
              <tr style={{ borderTop: `2px solid ${colors.border}` }}>
                <td className="px-2 py-1 font-bold text-sm" style={{ color: colors.text }}>Indicated Value</td>
                <td className="px-2 py-1 text-right font-bold text-sm" style={{ color: colors.text }}>{formatCurrency(indicatedValue)}</td>
                <td colSpan={4}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

