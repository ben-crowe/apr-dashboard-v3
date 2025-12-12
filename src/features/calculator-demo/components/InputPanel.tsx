/**
 * Input Panel - Compact Excel-Style Tables
 *
 * Replaces accordion-heavy design with dense spreadsheet-style tables
 * All inputs editable inline with auto-recalculation
 */

import { useReportBuilderStore } from '@/features/report-builder/store/reportBuilderStore';
import { Input } from '@/components/ui/input';

export default function InputPanel() {
  const { sections, updateFieldValue, runCalculations } = useReportBuilderStore();

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

  const handleFieldChange = (fieldId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    updateFieldValue(fieldId, numValue);
    runCalculations();
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate totals for display
  const totalUnits = getFieldValue('calc-total-units');
  const totalSF = getFieldValue('calc-total-sf');
  const totalRentalRevenue = getFieldValue('calc-total-rental-revenue');
  const totalOtherIncome = getFieldValue('calc-total-other-income');
  const vacancyLoss = getFieldValue('calc-vacancy-loss');
  const egr = getFieldValue('calc-egr');
  const expensesTotal = getFieldValue('calc-expenses-total');

  return (
    <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">

      {/* UNIT MIX TABLE */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-slate-800 text-white px-3 py-2 font-semibold text-sm">
          UNIT MIX
        </div>
        <table className="w-full text-xs">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="px-2 py-1.5 text-left font-medium">Type</th>
              <th className="px-2 py-1.5 text-right font-medium">Count</th>
              <th className="px-2 py-1.5 text-right font-medium">SF/Unit</th>
              <th className="px-2 py-1.5 text-right font-medium">Rent/Mo</th>
              <th className="px-2 py-1.5 text-right font-medium">Annual Revenue</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4].map(type => {
              const name = getFieldValue(`calc-type${type}-name`);
              const count = getFieldValue(`calc-type${type}-count`);
              const sf = getFieldValue(`calc-type${type}-sf`);
              const rent = getFieldValue(`calc-type${type}-rent`);
              const annual = getFieldValue(`calc-type${type}-annual`);

              return (
                <tr key={type} className="border-b hover:bg-slate-50">
                  <td className="px-2 py-1">
                    <Input
                      type="text"
                      value={name || `Type ${type}`}
                      onChange={(e) => handleFieldChange(`calc-type${type}-name`, e.target.value)}
                      className="h-7 text-xs border-0 bg-transparent p-1"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <Input
                      type="number"
                      value={count}
                      onChange={(e) => handleFieldChange(`calc-type${type}-count`, e.target.value)}
                      className="h-7 text-xs text-right"
                      step="1"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <Input
                      type="number"
                      value={sf}
                      onChange={(e) => handleFieldChange(`calc-type${type}-sf`, e.target.value)}
                      className="h-7 text-xs text-right"
                      step="1"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <Input
                      type="number"
                      value={rent}
                      onChange={(e) => handleFieldChange(`calc-type${type}-rent`, e.target.value)}
                      className="h-7 text-xs text-right"
                      step="0.01"
                    />
                  </td>
                  <td className="px-2 py-1 text-right text-slate-600">
                    {formatCurrency(annual)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-50 border-t-2 font-semibold">
            <tr>
              <td className="px-2 py-1.5">TOTALS</td>
              <td className="px-2 py-1.5 text-right">{totalUnits} units</td>
              <td className="px-2 py-1.5 text-right">{totalSF.toLocaleString()} SF</td>
              <td className="px-2 py-1.5"></td>
              <td className="px-2 py-1.5 text-right">{formatCurrency(totalRentalRevenue)}/year</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* OTHER INCOME TABLE */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-slate-800 text-white px-3 py-2 font-semibold text-sm">
          OTHER INCOME
        </div>
        <table className="w-full text-xs">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="px-2 py-1.5 text-left font-medium">Item</th>
              <th className="px-2 py-1.5 text-right font-medium">Per Unit/Mo</th>
              <th className="px-2 py-1.5 text-right font-medium">Annual Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-slate-50">
              <td className="px-2 py-1">Parking</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={getFieldValue('calc-parking-per-unit')}
                  onChange={(e) => handleFieldChange('calc-parking-per-unit', e.target.value)}
                  className="h-7 text-xs text-right"
                  step="0.01"
                />
              </td>
              <td className="px-2 py-1 text-right text-slate-600">
                {formatCurrency(getFieldValue('calc-parking-total'))}
              </td>
            </tr>
            <tr className="border-b hover:bg-slate-50">
              <td className="px-2 py-1">Laundry</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={getFieldValue('calc-laundry-per-unit')}
                  onChange={(e) => handleFieldChange('calc-laundry-per-unit', e.target.value)}
                  className="h-7 text-xs text-right"
                  step="0.01"
                />
              </td>
              <td className="px-2 py-1 text-right text-slate-600">
                {formatCurrency(getFieldValue('calc-laundry-total'))}
              </td>
            </tr>
            <tr className="border-b hover:bg-slate-50">
              <td className="px-2 py-1">Other (annual)</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={getFieldValue('calc-other-income')}
                  onChange={(e) => handleFieldChange('calc-other-income', e.target.value)}
                  className="h-7 text-xs text-right"
                  step="0.01"
                />
              </td>
              <td className="px-2 py-1 text-right text-slate-600">
                {formatCurrency(getFieldValue('calc-other-income'))}
              </td>
            </tr>
          </tbody>
          <tfoot className="bg-slate-50 border-t-2 font-semibold">
            <tr>
              <td className="px-2 py-1.5" colSpan={2}>TOTAL OTHER INCOME</td>
              <td className="px-2 py-1.5 text-right">{formatCurrency(totalOtherIncome)}/year</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* VACANCY & LOSS TABLE */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-slate-800 text-white px-3 py-2 font-semibold text-sm">
          VACANCY & LOSS
        </div>
        <table className="w-full text-xs">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="px-2 py-1.5 text-left font-medium">Type</th>
              <th className="px-2 py-1.5 text-right font-medium">Rate (%)</th>
              <th className="px-2 py-1.5 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-slate-50">
              <td className="px-2 py-1">Vacancy</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={getFieldValue('calc-vacancy-rate')}
                  onChange={(e) => handleFieldChange('calc-vacancy-rate', e.target.value)}
                  className="h-7 text-xs text-right"
                  step="0.01"
                />
              </td>
              <td className="px-2 py-1 text-right text-slate-600" rowSpan={3}>
                {formatCurrency(vacancyLoss)}
              </td>
            </tr>
            <tr className="border-b hover:bg-slate-50">
              <td className="px-2 py-1">Bad Debt</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={getFieldValue('calc-bad-debt-rate')}
                  onChange={(e) => handleFieldChange('calc-bad-debt-rate', e.target.value)}
                  className="h-7 text-xs text-right"
                  step="0.01"
                />
              </td>
            </tr>
            <tr className="border-b hover:bg-slate-50">
              <td className="px-2 py-1">Concessions</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={getFieldValue('calc-concessions-rate')}
                  onChange={(e) => handleFieldChange('calc-concessions-rate', e.target.value)}
                  className="h-7 text-xs text-right"
                  step="0.01"
                />
              </td>
            </tr>
          </tbody>
          <tfoot className="bg-slate-50 border-t-2 font-semibold">
            <tr>
              <td className="px-2 py-1.5" colSpan={2}>EFFECTIVE GROSS REVENUE</td>
              <td className="px-2 py-1.5 text-right">{formatCurrency(egr)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* OPERATING EXPENSES TABLE */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-slate-800 text-white px-3 py-2 font-semibold text-sm">
          OPERATING EXPENSES
        </div>
        <table className="w-full text-xs">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="px-2 py-1.5 text-left font-medium">Expense</th>
              <th className="px-2 py-1.5 text-right font-medium">Rate/Unit</th>
              <th className="px-2 py-1.5 text-right font-medium">Annual Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-slate-50">
              <td className="px-2 py-1">Management (% of EGR)</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={getFieldValue('calc-exp-management')}
                  onChange={(e) => handleFieldChange('calc-exp-management', e.target.value)}
                  className="h-7 text-xs text-right"
                  step="0.01"
                />
              </td>
              <td className="px-2 py-1 text-right text-slate-600">
                {formatCurrency(egr * (getFieldValue('calc-exp-management') / 100))}
              </td>
            </tr>
            <tr className="border-b hover:bg-slate-50">
              <td className="px-2 py-1">Taxes</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={getFieldValue('calc-exp-taxes')}
                  onChange={(e) => handleFieldChange('calc-exp-taxes', e.target.value)}
                  className="h-7 text-xs text-right"
                  step="0.01"
                />
              </td>
              <td className="px-2 py-1 text-right text-slate-600">
                {formatCurrency(getFieldValue('calc-exp-taxes') * totalUnits)}
              </td>
            </tr>
            <tr className="border-b hover:bg-slate-50">
              <td className="px-2 py-1">Insurance</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={getFieldValue('calc-exp-insurance')}
                  onChange={(e) => handleFieldChange('calc-exp-insurance', e.target.value)}
                  className="h-7 text-xs text-right"
                  step="0.01"
                />
              </td>
              <td className="px-2 py-1 text-right text-slate-600">
                {formatCurrency(getFieldValue('calc-exp-insurance') * totalUnits)}
              </td>
            </tr>
            <tr className="border-b hover:bg-slate-50">
              <td className="px-2 py-1">Repairs</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={getFieldValue('calc-exp-repairs')}
                  onChange={(e) => handleFieldChange('calc-exp-repairs', e.target.value)}
                  className="h-7 text-xs text-right"
                  step="0.01"
                />
              </td>
              <td className="px-2 py-1 text-right text-slate-600">
                {formatCurrency(getFieldValue('calc-exp-repairs') * totalUnits)}
              </td>
            </tr>
            <tr className="border-b hover:bg-slate-50">
              <td className="px-2 py-1">Utilities</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={getFieldValue('calc-exp-utilities')}
                  onChange={(e) => handleFieldChange('calc-exp-utilities', e.target.value)}
                  className="h-7 text-xs text-right"
                  step="0.01"
                />
              </td>
              <td className="px-2 py-1 text-right text-slate-600">
                {formatCurrency(getFieldValue('calc-exp-utilities') * totalUnits)}
              </td>
            </tr>
            <tr className="border-b hover:bg-slate-50">
              <td className="px-2 py-1">Payroll</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={getFieldValue('calc-exp-payroll')}
                  onChange={(e) => handleFieldChange('calc-exp-payroll', e.target.value)}
                  className="h-7 text-xs text-right"
                  step="0.01"
                />
              </td>
              <td className="px-2 py-1 text-right text-slate-600">
                {formatCurrency(getFieldValue('calc-exp-payroll') * totalUnits)}
              </td>
            </tr>
            <tr className="border-b hover:bg-slate-50">
              <td className="px-2 py-1">Admin</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={getFieldValue('calc-exp-admin')}
                  onChange={(e) => handleFieldChange('calc-exp-admin', e.target.value)}
                  className="h-7 text-xs text-right"
                  step="0.01"
                />
              </td>
              <td className="px-2 py-1 text-right text-slate-600">
                {formatCurrency(getFieldValue('calc-exp-admin') * totalUnits)}
              </td>
            </tr>
            <tr className="border-b hover:bg-slate-50">
              <td className="px-2 py-1">Reserves</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={getFieldValue('calc-exp-reserves')}
                  onChange={(e) => handleFieldChange('calc-exp-reserves', e.target.value)}
                  className="h-7 text-xs text-right"
                  step="0.01"
                />
              </td>
              <td className="px-2 py-1 text-right text-slate-600">
                {formatCurrency(getFieldValue('calc-exp-reserves') * totalUnits)}
              </td>
            </tr>
            <tr className="border-b hover:bg-slate-50">
              <td className="px-2 py-1">Other</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={getFieldValue('calc-exp-other')}
                  onChange={(e) => handleFieldChange('calc-exp-other', e.target.value)}
                  className="h-7 text-xs text-right"
                  step="0.01"
                />
              </td>
              <td className="px-2 py-1 text-right text-slate-600">
                {formatCurrency(getFieldValue('calc-exp-other') * totalUnits)}
              </td>
            </tr>
          </tbody>
          <tfoot className="bg-slate-50 border-t-2 font-semibold">
            <tr>
              <td className="px-2 py-1.5" colSpan={2}>TOTAL EXPENSES</td>
              <td className="px-2 py-1.5 text-right">{formatCurrency(expensesTotal)}</td>
            </tr>
            <tr>
              <td className="px-2 py-1.5" colSpan={2}>Expense Ratio</td>
              <td className="px-2 py-1.5 text-right">{getFieldValue('calc-expense-ratio').toFixed(2)}%</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* CAP RATE & ADJUSTMENTS */}
      <div className="grid grid-cols-2 gap-4">
        {/* CAP RATE */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-slate-800 text-white px-3 py-2 font-semibold text-sm">
            CAP RATE
          </div>
          <div className="p-3">
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Capitalization Rate (%)
            </label>
            <Input
              type="number"
              value={getFieldValue('calc-cap-rate')}
              onChange={(e) => handleFieldChange('calc-cap-rate', e.target.value)}
              className="text-sm text-right"
              step="0.01"
            />
          </div>
        </div>

        {/* ADJUSTMENTS */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-slate-800 text-white px-3 py-2 font-semibold text-sm">
            ADJUSTMENTS
          </div>
          <div className="p-3 space-y-2">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">CapEx</label>
              <Input
                type="number"
                value={getFieldValue('calc-adj-capex')}
                onChange={(e) => handleFieldChange('calc-adj-capex', e.target.value)}
                className="h-7 text-xs text-right"
                step="1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Leasing</label>
              <Input
                type="number"
                value={getFieldValue('calc-adj-leasing')}
                onChange={(e) => handleFieldChange('calc-adj-leasing', e.target.value)}
                className="h-7 text-xs text-right"
                step="1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Other</label>
              <Input
                type="number"
                value={getFieldValue('calc-adj-other')}
                onChange={(e) => handleFieldChange('calc-adj-other', e.target.value)}
                className="h-7 text-xs text-right"
                step="1"
              />
            </div>
            <div className="pt-2 border-t font-semibold text-xs">
              Total: {formatCurrency(getFieldValue('calc-adj-total'))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
