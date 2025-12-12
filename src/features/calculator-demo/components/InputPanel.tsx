/**
 * Input Panel - Connects to Zustand Store
 *
 * FIXED: Uses proper Zustand selector pattern for re-renders
 */

import { useReportBuilderStore } from '@/features/report-builder/store/reportBuilderStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Helper to find field value from calc section
const findFieldValue = (calcSection: any, fieldId: string): number | string => {
  if (!calcSection) return 0;

  // Check direct fields
  const field = calcSection.fields?.find((f: any) => f.id === fieldId);
  if (field) return field.value;

  // Check subsections
  if (calcSection.subsections) {
    for (const sub of calcSection.subsections) {
      const subField = sub.fields?.find((f: any) => f.id === fieldId);
      if (subField) return subField.value;
    }
  }
  return 0;
};

export default function InputPanel() {
  // Use selector to subscribe to just the calc section - this ensures re-renders
  const calcSection = useReportBuilderStore(state =>
    state.sections.find(s => s.id === 'calc')
  );

  // Get store actions separately (these don't change)
  const updateFieldValue = useReportBuilderStore(state => state.updateFieldValue);
  const runCalculations = useReportBuilderStore(state => state.runCalculations);
  const loadFullTestData = useReportBuilderStore(state => state.loadFullTestData);

  const getFieldValue = (fieldId: string): number => {
    const val = findFieldValue(calcSection, fieldId);
    return Number(val) || 0;
  };

  const getStringFieldValue = (fieldId: string): string => {
    const val = findFieldValue(calcSection, fieldId);
    return String(val) || '';
  };

  const updateField = (fieldId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    updateFieldValue(fieldId, numValue);
    runCalculations();
  };

  const handleLoadTestData = () => {
    loadFullTestData();
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
    <div className="space-y-3 text-xs">

      {/* DATA CONTROL BUTTONS */}
      <div className="border rounded overflow-hidden">
        <div className="bg-slate-800 text-white px-2 py-1 font-semibold">DATA CONTROLS</div>
        <div className="p-2 flex flex-col gap-2">
          <Button
            onClick={handleLoadTestData}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-2"
          >
            Load North Battleford Test Data
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="w-full text-xs py-2"
          >
            Reset All Fields
          </Button>
        </div>
      </div>

      {/* UNIT MIX */}
      <div className="border rounded overflow-hidden">
        <div className="bg-slate-800 text-white px-2 py-1 font-semibold">UNIT MIX</div>
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-2 py-1 text-left">Type</th>
              <th className="px-2 py-1 text-right">Count</th>
              <th className="px-2 py-1 text-right">SF</th>
              <th className="px-2 py-1 text-right">Rent/Mo</th>
              <th className="px-2 py-1 text-right">Annual</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-2 py-1">{type1Name}</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={type1Count}
                  onChange={e => updateField('calc-type1-count', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1"
                />
              </td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={type1Sf}
                  onChange={e => updateField('calc-type1-sf', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1"
                />
              </td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={type1Rent}
                  onChange={e => updateField('calc-type1-rent', e.target.value)}
                  className="h-6 w-20 text-right text-xs p-1"
                />
              </td>
              <td className="px-2 py-1 text-right font-medium">{formatCurrency(type1Annual)}</td>
            </tr>
          </tbody>
          <tfoot className="bg-slate-50 font-semibold">
            <tr className="border-t">
              <td className="px-2 py-1">TOTALS</td>
              <td className="px-2 py-1 text-right">{totalUnits}</td>
              <td className="px-2 py-1 text-right">{formatNumber(totalSf)}</td>
              <td className="px-2 py-1"></td>
              <td className="px-2 py-1 text-right">{formatCurrency(totalRentalRevenue)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* OTHER INCOME */}
      <div className="border rounded overflow-hidden">
        <div className="bg-slate-800 text-white px-2 py-1 font-semibold">OTHER INCOME</div>
        <table className="w-full">
          <tbody>
            <tr className="border-t">
              <td className="px-2 py-1">Parking</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={parkingPerUnit}
                  onChange={e => updateField('calc-parking-per-unit', e.target.value)}
                  className="h-6 w-20 text-right text-xs p-1"
                />
              </td>
              <td className="px-2 py-1 text-right text-slate-500">/unit/mo</td>
              <td className="px-2 py-1 text-right font-medium">{formatCurrency(parkingTotal)}</td>
            </tr>
            <tr className="border-t">
              <td className="px-2 py-1">Laundry</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={laundryPerUnit}
                  onChange={e => updateField('calc-laundry-per-unit', e.target.value)}
                  className="h-6 w-20 text-right text-xs p-1"
                />
              </td>
              <td className="px-2 py-1 text-right text-slate-500">/unit/mo</td>
              <td className="px-2 py-1 text-right font-medium">{formatCurrency(laundryTotal)}</td>
            </tr>
          </tbody>
          <tfoot className="bg-slate-50 font-semibold border-t">
            <tr>
              <td className="px-2 py-1" colSpan={3}>Total Other Income</td>
              <td className="px-2 py-1 text-right">{formatCurrency(totalOtherIncome)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* PGR */}
      <div className="bg-green-50 border border-green-200 rounded p-2 flex justify-between">
        <span className="font-semibold text-green-800">Potential Gross Revenue (PGR)</span>
        <span className="font-bold text-green-800">{formatCurrency(pgr)}</span>
      </div>

      {/* VACANCY */}
      <div className="border rounded overflow-hidden">
        <div className="bg-slate-800 text-white px-2 py-1 font-semibold">VACANCY & LOSS</div>
        <table className="w-full">
          <tbody>
            <tr className="border-t">
              <td className="px-2 py-1">Vacancy Rate</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  step="0.1"
                  value={vacancyRate}
                  onChange={e => updateField('calc-vacancy-rate', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1"
                />
              </td>
              <td className="px-2 py-1 text-slate-500">%</td>
            </tr>
            <tr className="border-t">
              <td className="px-2 py-1">Bad Debt</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  step="0.1"
                  value={badDebtRate}
                  onChange={e => updateField('calc-bad-debt-rate', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1"
                />
              </td>
              <td className="px-2 py-1 text-slate-500">%</td>
            </tr>
          </tbody>
          <tfoot className="bg-red-50 font-semibold border-t">
            <tr>
              <td className="px-2 py-1">Vacancy Loss</td>
              <td className="px-2 py-1 text-right text-red-700" colSpan={2}>{formatCurrency(vacancyLoss)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* EGR */}
      <div className="bg-green-50 border border-green-200 rounded p-2 flex justify-between">
        <span className="font-semibold text-green-800">Effective Gross Revenue (EGR)</span>
        <span className="font-bold text-green-800">{formatCurrency(egr)}</span>
      </div>

      {/* EXPENSES */}
      <div className="border rounded overflow-hidden">
        <div className="bg-slate-800 text-white px-2 py-1 font-semibold">OPERATING EXPENSES</div>
        <table className="w-full">
          <tbody>
            <tr className="border-t">
              <td className="px-2 py-1">Management</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  step="0.25"
                  value={expManagement}
                  onChange={e => updateField('calc-exp-management', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1"
                />
              </td>
              <td className="px-2 py-1 text-slate-500">% EGR</td>
              <td className="px-2 py-1 text-right">{formatCurrency(egr * (expManagement / 100))}</td>
            </tr>
            <tr className="border-t">
              <td className="px-2 py-1">Taxes</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={expTaxes}
                  onChange={e => updateField('calc-exp-taxes', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1"
                />
              </td>
              <td className="px-2 py-1 text-slate-500">/unit</td>
              <td className="px-2 py-1 text-right">{formatCurrency(expTaxes * totalUnits)}</td>
            </tr>
            <tr className="border-t">
              <td className="px-2 py-1">Insurance</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={expInsurance}
                  onChange={e => updateField('calc-exp-insurance', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1"
                />
              </td>
              <td className="px-2 py-1 text-slate-500">/unit</td>
              <td className="px-2 py-1 text-right">{formatCurrency(expInsurance * totalUnits)}</td>
            </tr>
            <tr className="border-t">
              <td className="px-2 py-1">Repairs</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={expRepairs}
                  onChange={e => updateField('calc-exp-repairs', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1"
                />
              </td>
              <td className="px-2 py-1 text-slate-500">/unit</td>
              <td className="px-2 py-1 text-right">{formatCurrency(expRepairs * totalUnits)}</td>
            </tr>
            <tr className="border-t">
              <td className="px-2 py-1">Utilities</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={expUtilities}
                  onChange={e => updateField('calc-exp-utilities', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1"
                />
              </td>
              <td className="px-2 py-1 text-slate-500">/unit</td>
              <td className="px-2 py-1 text-right">{formatCurrency(expUtilities * totalUnits)}</td>
            </tr>
            <tr className="border-t">
              <td className="px-2 py-1">Payroll</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={expPayroll}
                  onChange={e => updateField('calc-exp-payroll', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1"
                />
              </td>
              <td className="px-2 py-1 text-slate-500">/unit</td>
              <td className="px-2 py-1 text-right">{formatCurrency(expPayroll * totalUnits)}</td>
            </tr>
            <tr className="border-t">
              <td className="px-2 py-1">Other</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={expOther}
                  onChange={e => updateField('calc-exp-other', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1"
                />
              </td>
              <td className="px-2 py-1 text-slate-500">/unit</td>
              <td className="px-2 py-1 text-right">{formatCurrency(expOther * totalUnits)}</td>
            </tr>
          </tbody>
          <tfoot className="bg-red-50 font-semibold border-t">
            <tr>
              <td className="px-2 py-1" colSpan={3}>Total Expenses ({formatNumber(expenseRatio)}%)</td>
              <td className="px-2 py-1 text-right text-red-700">{formatCurrency(expensesTotal)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* NOI */}
      <div className="bg-blue-50 border border-blue-200 rounded p-2 flex justify-between">
        <span className="font-semibold text-blue-800">Net Operating Income (NOI)</span>
        <span className="font-bold text-blue-800">{formatCurrency(noi)}</span>
      </div>

      {/* CAP RATE & VALUE */}
      <div className="border rounded overflow-hidden">
        <div className="bg-slate-800 text-white px-2 py-1 font-semibold">CAPITALIZATION</div>
        <table className="w-full">
          <tbody>
            <tr className="border-t">
              <td className="px-2 py-1">Cap Rate</td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  step="0.25"
                  value={capRate}
                  onChange={e => updateField('calc-cap-rate', e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1"
                />
              </td>
              <td className="px-2 py-1 text-slate-500">%</td>
              <td className="px-2 py-1"></td>
            </tr>
            <tr className="border-t bg-slate-50">
              <td className="px-2 py-1" colSpan={3}>Raw Value (NOI ÷ Cap Rate)</td>
              <td className="px-2 py-1 text-right font-medium">{formatCurrency(rawValue)}</td>
            </tr>
            <tr className="border-t bg-slate-50">
              <td className="px-2 py-1" colSpan={3}>Rounded (to $10,000)</td>
              <td className="px-2 py-1 text-right font-medium">{formatCurrency(roundedValue)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* FINAL VALUE */}
      <div className="bg-purple-100 border-2 border-purple-400 rounded p-3 text-center">
        <div className="text-sm font-semibold text-purple-800 mb-1">INDICATED VALUE</div>
        <div className="text-2xl font-bold text-purple-900">{formatCurrency(indicatedValue)}</div>
        {totalUnits > 0 && (
          <div className="text-xs text-purple-700 mt-1">
            {formatCurrency(indicatedValue / totalUnits)}/unit | ${formatNumber(indicatedValue / totalSf)}/SF
          </div>
        )}
      </div>

    </div>
  );
}
