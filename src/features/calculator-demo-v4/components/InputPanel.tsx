/**
 * Input Panel - Connects to Zustand Store
 *
 * Claude-inspired minimal aesthetic: grayscale, subtle borders, no bright colors.
 */

import { useState, useCallback } from 'react';
import { useReportBuilderStore } from '@/features/report-builder/store/reportBuilderStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTheme } from '../context/ThemeContext';

export default function InputPanel() {
  // Force re-render trigger
  const [updateKey, setUpdateKey] = useState(0);
  const { colors } = useTheme();

  // Subscribe to sections with a dependency on updateKey to force refresh
  const sections = useReportBuilderStore(state => state.sections);
  const updateFieldValue = useReportBuilderStore(state => state.updateFieldValue);
  const runCalculations = useReportBuilderStore(state => state.runCalculations);
  const loadDataSet1All = useReportBuilderStore(state => state.loadDataSet1All);

  const calcSection = sections.find(s => s.id === 'calc');

  const getFieldValue = useCallback((fieldId: string): number => {
    if (!calcSection) return 0;

    // Check direct fields
    const field = calcSection.fields?.find((f: any) => f.id === fieldId);
    if (field) return Number(field.value) || 0;

    // Check subsections
    if (calcSection.subsections) {
      for (const sub of calcSection.subsections) {
        const subField = sub.fields?.find((f: any) => f.id === fieldId);
        if (subField) return Number(subField.value) || 0;
      }
    }
    return 0;
  }, [calcSection, updateKey]);

  const getStringFieldValue = useCallback((fieldId: string): string => {
    if (!calcSection) return '';

    const field = calcSection.fields?.find((f: any) => f.id === fieldId);
    if (field) return String(field.value) || '';

    if (calcSection.subsections) {
      for (const sub of calcSection.subsections) {
        const subField = sub.fields?.find((f: any) => f.id === fieldId);
        if (subField) return String(subField.value) || '';
      }
    }
    return '';
  }, [calcSection, updateKey]);

  const updateField = (fieldId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    updateFieldValue(fieldId, numValue);
    runCalculations();
  };

  const handleLoadTestData = () => {
    loadDataSet1All();
    // Force component to re-render after store update
    setTimeout(() => setUpdateKey(k => k + 1), 50);
    // Trigger calculation animation
    setTimeout(() => window.dispatchEvent(new Event('testDataLoaded')), 100);
  };

  const handleReset = () => {
    const calcFields = [
      'calc-type1-count', 'calc-type1-sf', 'calc-type1-rent',
      'calc-parking-per-unit', 'calc-laundry-per-unit',
      'calc-vacancy-rate', 'calc-bad-debt-rate', 'calc-concessions-rate',
      'calc-exp-management', 'calc-exp-taxes', 'calc-exp-insurance',
      'calc-exp-repairs', 'calc-exp-utilities', 'calc-exp-payroll',
      'calc-exp-admin', 'calc-exp-reserves', 'calc-exp-other',
      'calc-cap-rate', 'calc-adj-capex', 'calc-adj-leasing', 'calc-adj-other'
    ];
    calcFields.forEach(fieldId => updateFieldValue(fieldId, 0));
    runCalculations();
    setTimeout(() => setUpdateKey(k => k + 1), 50);
  };

  // Get values from store
  const type1Name = getStringFieldValue('calc-type1-name') || '1 Bed / 1 Bath';
  const type1Count = getFieldValue('calc-type1-count');
  const type1Sf = getFieldValue('calc-type1-sf');
  const type1Rent = getFieldValue('calc-type1-rent');
  const type1Annual = getFieldValue('calc-type1-annual');

  const totalUnits = getFieldValue('calc-total-units');
  const totalSf = getFieldValue('calc-total-sf');
  const totalRentalRevenue = getFieldValue('calc-total-rental-revenue');

  const parkingPerUnit = getFieldValue('calc-parking-per-unit');
  const laundryPerUnit = getFieldValue('calc-laundry-per-unit');
  const parkingTotal = getFieldValue('calc-parking-total');
  const laundryTotal = getFieldValue('calc-laundry-total');
  const totalOtherIncome = getFieldValue('calc-total-other-income');

  const pgr = getFieldValue('calc-pgr');
  const vacancyRate = getFieldValue('calc-vacancy-rate');
  const badDebtRate = getFieldValue('calc-bad-debt-rate');
  const vacancyLoss = getFieldValue('calc-vacancy-loss');
  const egr = getFieldValue('calc-egr');

  const expManagement = getFieldValue('calc-exp-management');
  const expTaxes = getFieldValue('calc-exp-taxes');
  const expInsurance = getFieldValue('calc-exp-insurance');
  const expRepairs = getFieldValue('calc-exp-repairs');
  const expUtilities = getFieldValue('calc-exp-utilities');
  const expPayroll = getFieldValue('calc-exp-payroll');
  const expOther = getFieldValue('calc-exp-other');
  const expensesTotal = getFieldValue('calc-expenses-total');
  const expenseRatio = getFieldValue('calc-expense-ratio');

  const noi = getFieldValue('calc-noi');
  const capRate = getFieldValue('calc-cap-rate');
  const rawValue = getFieldValue('calc-raw-value');
  const roundedValue = Math.round(rawValue / 10000) * 10000;
  const indicatedValue = getFieldValue('calc-indicated-value');

  const formatCurrency = (n: number) => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  const formatNumber = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 2 });

  // Input styling helper
  const inputStyle = {
    backgroundColor: colors.inputBg,
    borderColor: colors.border,
    color: colors.text,
  };

  return (
    <div className="space-y-3 text-xs" style={{ color: colors.text }}>

      {/* DATA CONTROL BUTTONS */}
      <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
        <div className="px-2 py-1.5" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>{`Data Controls`}</span>
        </div>
        <div className="p-2 flex flex-col gap-2">
          <Button
            onClick={handleLoadTestData}
            className="w-full text-xs py-2 border-0"
            style={{ backgroundColor: colors.border, color: colors.text }}
          >
            Load North Battleford Test Data
          </Button>
          <Button
            onClick={handleReset}
            variant="ghost"
            className="w-full text-xs py-2 hover:bg-transparent"
            style={{ color: colors.textDim }}
          >
            Reset All Fields
          </Button>
        </div>
      </div>

      {/* UNIT MIX */}
      <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
        <div className="px-2 py-1.5" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>{`Unit Mix`}</span>
        </div>
        <table className="w-full">
          <thead style={{ borderBottom: `1px solid ${colors.border}` }}>
            <tr>
              <th className="px-2 py-1 text-left font-normal" style={{ color: colors.textMuted }}>Type</th>
              <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>Count</th>
              <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>SF</th>
              <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>Rent/Mo</th>
              <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>Annual</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              <td className="px-2 py-1" style={{ color: colors.textMuted }}>{type1Name}</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={type1Count}
                  onChange={e => updateField('calc-type1-count', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1"
                  style={inputStyle}
                />
              </td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={type1Sf}
                  onChange={e => updateField('calc-type1-sf', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1"
                  style={inputStyle}
                />
              </td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={type1Rent}
                  onChange={e => updateField('calc-type1-rent', e.target.value)}
                  className="h-6 w-20 text-right text-xs p-1"
                  style={inputStyle}
                />
              </td>
              <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(type1Annual)}</td>
            </tr>
          </tbody>
          <tfoot style={{ borderTop: `1px solid ${colors.border}` }}>
            <tr>
              <td className="px-2 py-1 font-medium" style={{ color: colors.textMuted }}>Totals</td>
              <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{totalUnits}</td>
              <td className="px-2 py-1 text-right" style={{ color: colors.text }}>{formatNumber(totalSf)}</td>
              <td className="px-2 py-1"></td>
              <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(totalRentalRevenue)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* OTHER INCOME */}
      <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
        <div className="px-2 py-1.5" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>{`Other Income`}</span>
        </div>
        <table className="w-full">
          <tbody>
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              <td className="px-2 py-1" style={{ color: colors.textMuted }}>Parking</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={parkingPerUnit}
                  onChange={e => updateField('calc-parking-per-unit', e.target.value)}
                  className="h-6 w-20 text-right text-xs p-1"
                  style={inputStyle}
                />
              </td>
              <td className="px-2 py-1 text-right" style={{ color: colors.textDim }}>/unit/mo</td>
              <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(parkingTotal)}</td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              <td className="px-2 py-1" style={{ color: colors.textMuted }}>Laundry</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={laundryPerUnit}
                  onChange={e => updateField('calc-laundry-per-unit', e.target.value)}
                  className="h-6 w-20 text-right text-xs p-1"
                  style={inputStyle}
                />
              </td>
              <td className="px-2 py-1 text-right" style={{ color: colors.textDim }}>/unit/mo</td>
              <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(laundryTotal)}</td>
            </tr>
          </tbody>
          <tfoot style={{ borderTop: `1px solid ${colors.border}` }}>
            <tr>
              <td className="px-2 py-1" style={{ color: colors.textMuted }} colSpan={3}>Total Other Income</td>
              <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(totalOtherIncome)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* PGR */}
      <div className="rounded-sm px-3 py-2 flex justify-between" style={{ border: `1px solid ${colors.border}` }}>
        <span style={{ color: colors.textMuted }}>Potential Gross Revenue (PGR)</span>
        <span className="font-medium" style={{ color: colors.text }}>{formatCurrency(pgr)}</span>
      </div>

      {/* VACANCY */}
      <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
        <div className="px-2 py-1.5" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>{`Vacancy & Loss`}</span>
        </div>
        <table className="w-full">
          <tbody>
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              <td className="px-2 py-1" style={{ color: colors.textMuted }}>Vacancy Rate</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  step="0.1"
                  value={vacancyRate}
                  onChange={e => updateField('calc-vacancy-rate', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1"
                  style={inputStyle}
                />
              </td>
              <td className="px-2 py-1" style={{ color: colors.textDim }}>%</td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              <td className="px-2 py-1" style={{ color: colors.textMuted }}>Bad Debt</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  step="0.1"
                  value={badDebtRate}
                  onChange={e => updateField('calc-bad-debt-rate', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1"
                  style={inputStyle}
                />
              </td>
              <td className="px-2 py-1" style={{ color: colors.textDim }}>%</td>
            </tr>
          </tbody>
          <tfoot style={{ borderTop: `1px solid ${colors.border}` }}>
            <tr>
              <td className="px-2 py-1" style={{ color: colors.textMuted }}>Vacancy Loss</td>
              <td className="px-2 py-1 text-right" style={{ color: colors.textMuted }} colSpan={2}>({formatCurrency(vacancyLoss)})</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* EGR */}
      <div className="rounded-sm px-3 py-2 flex justify-between" style={{ border: `1px solid ${colors.border}` }}>
        <span style={{ color: colors.textMuted }}>Effective Gross Revenue (EGR)</span>
        <span className="font-medium" style={{ color: colors.text }}>{formatCurrency(egr)}</span>
      </div>

      {/* EXPENSES */}
      <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
        <div className="px-2 py-1.5" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>{`Operating Expenses`}</span>
        </div>
        <table className="w-full">
          <tbody>
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              <td className="px-2 py-1" style={{ color: colors.textMuted }}>Management</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  step="0.25"
                  value={expManagement}
                  onChange={e => updateField('calc-exp-management', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1"
                  style={inputStyle}
                />
              </td>
              <td className="px-2 py-1" style={{ color: colors.textDim }}>% EGR</td>
              <td className="px-2 py-1 text-right" style={{ color: colors.textMuted }}>{formatCurrency(egr * (expManagement / 100))}</td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              <td className="px-2 py-1" style={{ color: colors.textMuted }}>Taxes</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={expTaxes}
                  onChange={e => updateField('calc-exp-taxes', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1"
                  style={inputStyle}
                />
              </td>
              <td className="px-2 py-1" style={{ color: colors.textDim }}>/unit</td>
              <td className="px-2 py-1 text-right" style={{ color: colors.textMuted }}>{formatCurrency(expTaxes * totalUnits)}</td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              <td className="px-2 py-1" style={{ color: colors.textMuted }}>Insurance</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={expInsurance}
                  onChange={e => updateField('calc-exp-insurance', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1"
                  style={inputStyle}
                />
              </td>
              <td className="px-2 py-1" style={{ color: colors.textDim }}>/unit</td>
              <td className="px-2 py-1 text-right" style={{ color: colors.textMuted }}>{formatCurrency(expInsurance * totalUnits)}</td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              <td className="px-2 py-1" style={{ color: colors.textMuted }}>Repairs</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={expRepairs}
                  onChange={e => updateField('calc-exp-repairs', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1"
                  style={inputStyle}
                />
              </td>
              <td className="px-2 py-1" style={{ color: colors.textDim }}>/unit</td>
              <td className="px-2 py-1 text-right" style={{ color: colors.textMuted }}>{formatCurrency(expRepairs * totalUnits)}</td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              <td className="px-2 py-1" style={{ color: colors.textMuted }}>Utilities</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={expUtilities}
                  onChange={e => updateField('calc-exp-utilities', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1"
                  style={inputStyle}
                />
              </td>
              <td className="px-2 py-1" style={{ color: colors.textDim }}>/unit</td>
              <td className="px-2 py-1 text-right" style={{ color: colors.textMuted }}>{formatCurrency(expUtilities * totalUnits)}</td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              <td className="px-2 py-1" style={{ color: colors.textMuted }}>Payroll</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={expPayroll}
                  onChange={e => updateField('calc-exp-payroll', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1"
                  style={inputStyle}
                />
              </td>
              <td className="px-2 py-1" style={{ color: colors.textDim }}>/unit</td>
              <td className="px-2 py-1 text-right" style={{ color: colors.textMuted }}>{formatCurrency(expPayroll * totalUnits)}</td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              <td className="px-2 py-1" style={{ color: colors.textMuted }}>Other</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={expOther}
                  onChange={e => updateField('calc-exp-other', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1"
                  style={inputStyle}
                />
              </td>
              <td className="px-2 py-1" style={{ color: colors.textDim }}>/unit</td>
              <td className="px-2 py-1 text-right" style={{ color: colors.textMuted }}>{formatCurrency(expOther * totalUnits)}</td>
            </tr>
          </tbody>
          <tfoot style={{ borderTop: `1px solid ${colors.border}` }}>
            <tr>
              <td className="px-2 py-1" style={{ color: colors.textMuted }} colSpan={3}>Total Expenses ({formatNumber(expenseRatio)}%)</td>
              <td className="px-2 py-1 text-right" style={{ color: colors.textMuted }}>({formatCurrency(expensesTotal)})</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* NOI */}
      <div className="rounded-sm px-3 py-2 flex justify-between" style={{ border: `1px solid ${colors.border}` }}>
        <span style={{ color: colors.textMuted }}>Net Operating Income (NOI)</span>
        <span className="font-medium" style={{ color: colors.text }}>{formatCurrency(noi)}</span>
      </div>

      {/* CAP RATE & VALUE */}
      <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
        <div className="px-2 py-1.5" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>{`Capitalization`}</span>
        </div>
        <table className="w-full">
          <tbody>
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              <td className="px-2 py-1" style={{ color: colors.textMuted }}>Cap Rate</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  step="0.25"
                  value={capRate}
                  onChange={e => updateField('calc-cap-rate', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1"
                  style={inputStyle}
                />
              </td>
              <td className="px-2 py-1" style={{ color: colors.textDim }}>%</td>
              <td className="px-2 py-1"></td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              <td className="px-2 py-1" style={{ color: colors.textMuted }} colSpan={3}>Raw Value (NOI ÷ Cap Rate)</td>
              <td className="px-2 py-1 text-right" style={{ color: colors.textMuted }}>{formatCurrency(rawValue)}</td>
            </tr>
            <tr>
              <td className="px-2 py-1" style={{ color: colors.textMuted }} colSpan={3}>Rounded (to $10,000)</td>
              <td className="px-2 py-1 text-right" style={{ color: colors.textMuted }}>{formatCurrency(roundedValue)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* FINAL VALUE - The ONE accent */}
      <div className="rounded-sm px-3 py-3" style={{ border: `1px solid ${colors.border}`, backgroundColor: colors.panelBgAlt }}>
        <div className="flex justify-between items-center">
          <span style={{ color: colors.textMuted }}>Indicated Value</span>
          <span className="text-xl font-semibold" style={{ color: colors.text }}>{formatCurrency(indicatedValue)}</span>
        </div>
        {totalUnits > 0 && (
          <div className="text-[10px] mt-1 text-right" style={{ color: colors.textDim }}>
            {formatCurrency(indicatedValue / totalUnits)}/unit · ${formatNumber(indicatedValue / totalSf)}/SF
          </div>
        )}
      </div>

    </div>
  );
}
