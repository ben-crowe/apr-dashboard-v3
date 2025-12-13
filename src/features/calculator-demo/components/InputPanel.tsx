/**
 * Input Panel - Connects to Zustand Store
 *
 * Claude-inspired minimal aesthetic: grayscale, subtle borders, no bright colors.
 */

import { useState, useCallback } from 'react';
import { useReportBuilderStore } from '@/features/report-builder/store/reportBuilderStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function InputPanel() {
  // Force re-render trigger
  const [updateKey, setUpdateKey] = useState(0);

  // Subscribe to sections with a dependency on updateKey to force refresh
  const sections = useReportBuilderStore(state => state.sections);
  const updateFieldValue = useReportBuilderStore(state => state.updateFieldValue);
  const runCalculations = useReportBuilderStore(state => state.runCalculations);
  const loadFullTestData = useReportBuilderStore(state => state.loadFullTestData);

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
    loadFullTestData();
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

  return (
    <div className="space-y-3 text-xs text-[#e5e5e5]">

      {/* DATA CONTROL BUTTONS */}
      <div className="border border-[#3a3a3a] rounded-sm overflow-hidden">
        <div className="px-2 py-1.5 border-b border-[#3a3a3a]">
          <span className="text-[10px] font-medium text-[#808080] uppercase tracking-wider">Data Controls</span>
        </div>
        <div className="p-2 flex flex-col gap-2">
          <Button
            onClick={handleLoadTestData}
            className="w-full bg-[#3a3a3a] hover:bg-[#4a4a4a] text-[#e5e5e5] text-xs py-2 border-0"
          >
            Load North Battleford Test Data
          </Button>
          <Button
            onClick={handleReset}
            variant="ghost"
            className="w-full text-xs py-2 text-[#808080] hover:text-[#e5e5e5] hover:bg-[#333]"
          >
            Reset All Fields
          </Button>
        </div>
      </div>

      {/* UNIT MIX */}
      <div className="border border-[#3a3a3a] rounded-sm overflow-hidden">
        <div className="px-2 py-1.5 border-b border-[#3a3a3a]">
          <span className="text-[10px] font-medium text-[#808080] uppercase tracking-wider">Unit Mix</span>
        </div>
        <table className="w-full">
          <thead className="border-b border-[#3a3a3a]">
            <tr>
              <th className="px-2 py-1 text-left text-[#707070] font-normal">Type</th>
              <th className="px-2 py-1 text-right text-[#707070] font-normal">Count</th>
              <th className="px-2 py-1 text-right text-[#707070] font-normal">SF</th>
              <th className="px-2 py-1 text-right text-[#707070] font-normal">Rent/Mo</th>
              <th className="px-2 py-1 text-right text-[#707070] font-normal">Annual</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#3a3a3a]">
              <td className="px-2 py-1 text-[#909090]">{type1Name}</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={type1Count}
                  onChange={e => updateField('calc-type1-count', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1 bg-[#1e1e1e] border-[#3a3a3a] text-[#e5e5e5]"
                />
              </td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={type1Sf}
                  onChange={e => updateField('calc-type1-sf', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1 bg-[#1e1e1e] border-[#3a3a3a] text-[#e5e5e5]"
                />
              </td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={type1Rent}
                  onChange={e => updateField('calc-type1-rent', e.target.value)}
                  className="h-6 w-20 text-right text-xs p-1 bg-[#1e1e1e] border-[#3a3a3a] text-[#e5e5e5]"
                />
              </td>
              <td className="px-2 py-1 text-right font-medium text-[#e5e5e5]">{formatCurrency(type1Annual)}</td>
            </tr>
          </tbody>
          <tfoot className="border-t border-[#3a3a3a]">
            <tr>
              <td className="px-2 py-1 text-[#909090] font-medium">Totals</td>
              <td className="px-2 py-1 text-right text-[#e5e5e5]">{totalUnits}</td>
              <td className="px-2 py-1 text-right text-[#e5e5e5]">{formatNumber(totalSf)}</td>
              <td className="px-2 py-1"></td>
              <td className="px-2 py-1 text-right font-medium text-[#e5e5e5]">{formatCurrency(totalRentalRevenue)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* OTHER INCOME */}
      <div className="border border-[#3a3a3a] rounded-sm overflow-hidden">
        <div className="px-2 py-1.5 border-b border-[#3a3a3a]">
          <span className="text-[10px] font-medium text-[#808080] uppercase tracking-wider">Other Income</span>
        </div>
        <table className="w-full">
          <tbody>
            <tr className="border-b border-[#3a3a3a]">
              <td className="px-2 py-1 text-[#909090]">Parking</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={parkingPerUnit}
                  onChange={e => updateField('calc-parking-per-unit', e.target.value)}
                  className="h-6 w-20 text-right text-xs p-1 bg-[#1e1e1e] border-[#3a3a3a] text-[#e5e5e5]"
                />
              </td>
              <td className="px-2 py-1 text-right text-[#606060]">/unit/mo</td>
              <td className="px-2 py-1 text-right font-medium text-[#e5e5e5]">{formatCurrency(parkingTotal)}</td>
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="px-2 py-1 text-[#909090]">Laundry</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={laundryPerUnit}
                  onChange={e => updateField('calc-laundry-per-unit', e.target.value)}
                  className="h-6 w-20 text-right text-xs p-1 bg-[#1e1e1e] border-[#3a3a3a] text-[#e5e5e5]"
                />
              </td>
              <td className="px-2 py-1 text-right text-[#606060]">/unit/mo</td>
              <td className="px-2 py-1 text-right font-medium text-[#e5e5e5]">{formatCurrency(laundryTotal)}</td>
            </tr>
          </tbody>
          <tfoot className="border-t border-[#3a3a3a]">
            <tr>
              <td className="px-2 py-1 text-[#909090]" colSpan={3}>Total Other Income</td>
              <td className="px-2 py-1 text-right font-medium text-[#e5e5e5]">{formatCurrency(totalOtherIncome)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* PGR */}
      <div className="border border-[#3a3a3a] rounded-sm px-3 py-2 flex justify-between">
        <span className="text-[#909090]">Potential Gross Revenue (PGR)</span>
        <span className="font-medium text-[#e5e5e5]">{formatCurrency(pgr)}</span>
      </div>

      {/* VACANCY */}
      <div className="border border-[#3a3a3a] rounded-sm overflow-hidden">
        <div className="px-2 py-1.5 border-b border-[#3a3a3a]">
          <span className="text-[10px] font-medium text-[#808080] uppercase tracking-wider">Vacancy & Loss</span>
        </div>
        <table className="w-full">
          <tbody>
            <tr className="border-b border-[#3a3a3a]">
              <td className="px-2 py-1 text-[#909090]">Vacancy Rate</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  step="0.1"
                  value={vacancyRate}
                  onChange={e => updateField('calc-vacancy-rate', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1 bg-[#1e1e1e] border-[#3a3a3a] text-[#e5e5e5]"
                />
              </td>
              <td className="px-2 py-1 text-[#606060]">%</td>
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="px-2 py-1 text-[#909090]">Bad Debt</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  step="0.1"
                  value={badDebtRate}
                  onChange={e => updateField('calc-bad-debt-rate', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1 bg-[#1e1e1e] border-[#3a3a3a] text-[#e5e5e5]"
                />
              </td>
              <td className="px-2 py-1 text-[#606060]">%</td>
            </tr>
          </tbody>
          <tfoot className="border-t border-[#3a3a3a]">
            <tr>
              <td className="px-2 py-1 text-[#909090]">Vacancy Loss</td>
              <td className="px-2 py-1 text-right text-[#909090]" colSpan={2}>({formatCurrency(vacancyLoss)})</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* EGR */}
      <div className="border border-[#3a3a3a] rounded-sm px-3 py-2 flex justify-between">
        <span className="text-[#909090]">Effective Gross Revenue (EGR)</span>
        <span className="font-medium text-[#e5e5e5]">{formatCurrency(egr)}</span>
      </div>

      {/* EXPENSES */}
      <div className="border border-[#3a3a3a] rounded-sm overflow-hidden">
        <div className="px-2 py-1.5 border-b border-[#3a3a3a]">
          <span className="text-[10px] font-medium text-[#808080] uppercase tracking-wider">Operating Expenses</span>
        </div>
        <table className="w-full">
          <tbody>
            <tr className="border-b border-[#3a3a3a]">
              <td className="px-2 py-1 text-[#909090]">Management</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  step="0.25"
                  value={expManagement}
                  onChange={e => updateField('calc-exp-management', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1 bg-[#1e1e1e] border-[#3a3a3a] text-[#e5e5e5]"
                />
              </td>
              <td className="px-2 py-1 text-[#606060]">% EGR</td>
              <td className="px-2 py-1 text-right text-[#909090]">{formatCurrency(egr * (expManagement / 100))}</td>
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="px-2 py-1 text-[#909090]">Taxes</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={expTaxes}
                  onChange={e => updateField('calc-exp-taxes', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1 bg-[#1e1e1e] border-[#3a3a3a] text-[#e5e5e5]"
                />
              </td>
              <td className="px-2 py-1 text-[#606060]">/unit</td>
              <td className="px-2 py-1 text-right text-[#909090]">{formatCurrency(expTaxes * totalUnits)}</td>
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="px-2 py-1 text-[#909090]">Insurance</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={expInsurance}
                  onChange={e => updateField('calc-exp-insurance', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1 bg-[#1e1e1e] border-[#3a3a3a] text-[#e5e5e5]"
                />
              </td>
              <td className="px-2 py-1 text-[#606060]">/unit</td>
              <td className="px-2 py-1 text-right text-[#909090]">{formatCurrency(expInsurance * totalUnits)}</td>
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="px-2 py-1 text-[#909090]">Repairs</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={expRepairs}
                  onChange={e => updateField('calc-exp-repairs', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1 bg-[#1e1e1e] border-[#3a3a3a] text-[#e5e5e5]"
                />
              </td>
              <td className="px-2 py-1 text-[#606060]">/unit</td>
              <td className="px-2 py-1 text-right text-[#909090]">{formatCurrency(expRepairs * totalUnits)}</td>
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="px-2 py-1 text-[#909090]">Utilities</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={expUtilities}
                  onChange={e => updateField('calc-exp-utilities', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1 bg-[#1e1e1e] border-[#3a3a3a] text-[#e5e5e5]"
                />
              </td>
              <td className="px-2 py-1 text-[#606060]">/unit</td>
              <td className="px-2 py-1 text-right text-[#909090]">{formatCurrency(expUtilities * totalUnits)}</td>
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="px-2 py-1 text-[#909090]">Payroll</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={expPayroll}
                  onChange={e => updateField('calc-exp-payroll', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1 bg-[#1e1e1e] border-[#3a3a3a] text-[#e5e5e5]"
                />
              </td>
              <td className="px-2 py-1 text-[#606060]">/unit</td>
              <td className="px-2 py-1 text-right text-[#909090]">{formatCurrency(expPayroll * totalUnits)}</td>
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="px-2 py-1 text-[#909090]">Other</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={expOther}
                  onChange={e => updateField('calc-exp-other', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1 bg-[#1e1e1e] border-[#3a3a3a] text-[#e5e5e5]"
                />
              </td>
              <td className="px-2 py-1 text-[#606060]">/unit</td>
              <td className="px-2 py-1 text-right text-[#909090]">{formatCurrency(expOther * totalUnits)}</td>
            </tr>
          </tbody>
          <tfoot className="border-t border-[#3a3a3a]">
            <tr>
              <td className="px-2 py-1 text-[#909090]" colSpan={3}>Total Expenses ({formatNumber(expenseRatio)}%)</td>
              <td className="px-2 py-1 text-right text-[#909090]">({formatCurrency(expensesTotal)})</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* NOI */}
      <div className="border border-[#3a3a3a] rounded-sm px-3 py-2 flex justify-between">
        <span className="text-[#909090]">Net Operating Income (NOI)</span>
        <span className="font-medium text-[#e5e5e5]">{formatCurrency(noi)}</span>
      </div>

      {/* CAP RATE & VALUE */}
      <div className="border border-[#3a3a3a] rounded-sm overflow-hidden">
        <div className="px-2 py-1.5 border-b border-[#3a3a3a]">
          <span className="text-[10px] font-medium text-[#808080] uppercase tracking-wider">Capitalization</span>
        </div>
        <table className="w-full">
          <tbody>
            <tr className="border-b border-[#3a3a3a]">
              <td className="px-2 py-1 text-[#909090]">Cap Rate</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  step="0.25"
                  value={capRate}
                  onChange={e => updateField('calc-cap-rate', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1 bg-[#1e1e1e] border-[#3a3a3a] text-[#e5e5e5]"
                />
              </td>
              <td className="px-2 py-1 text-[#606060]">%</td>
              <td className="px-2 py-1"></td>
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="px-2 py-1 text-[#707070]" colSpan={3}>Raw Value (NOI ÷ Cap Rate)</td>
              <td className="px-2 py-1 text-right text-[#909090]">{formatCurrency(rawValue)}</td>
            </tr>
            <tr>
              <td className="px-2 py-1 text-[#707070]" colSpan={3}>Rounded (to $10,000)</td>
              <td className="px-2 py-1 text-right text-[#909090]">{formatCurrency(roundedValue)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* FINAL VALUE - The ONE accent */}
      <div className="border border-[#3a3a3a] rounded-sm px-3 py-3 bg-[#252525]">
        <div className="flex justify-between items-center">
          <span className="text-[#909090]">Indicated Value</span>
          <span className="text-xl font-semibold text-[#e5e5e5]">{formatCurrency(indicatedValue)}</span>
        </div>
        {totalUnits > 0 && (
          <div className="text-[10px] text-[#606060] mt-1 text-right">
            {formatCurrency(indicatedValue / totalUnits)}/unit · ${formatNumber(indicatedValue / totalSf)}/SF
          </div>
        )}
      </div>

    </div>
  );
}
