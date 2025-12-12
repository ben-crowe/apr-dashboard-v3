/**
 * Input Panel - Compact Excel-Style Tables
 *
 * HARDCODED TEST DATA - Bypasses store completely
 */

import { useState } from 'react';
import { Input } from '@/components/ui/input';

// Property data sets
const PROPERTIES = {
  'north-battleford': {
    name: 'North Battleford Multi-Family',
    data: {
      type1Name: '1 Bed / 1 Bath',
      type1Count: 16,
      type1Sf: 638,
      type1Rent: 1064,
      parkingPerUnit: 375,
      laundryPerUnit: 150,
      otherIncome: 0,
      vacancyRate: 3.8,
      badDebtRate: 0,
      concessionsRate: 0,
      expManagement: 4.25,
      expTaxes: 1168,
      expInsurance: 710,
      expRepairs: 830,
      expUtilities: 1315,
      expPayroll: 500,
      expAdmin: 0,
      expReserves: 0,
      expOther: 245,
      capRate: 6.25,
      adjCapex: 0,
      adjLeasing: 0,
      adjOther: 0,
    }
  },
  'empty': {
    name: 'Blank Template',
    data: {
      type1Name: 'Unit Type 1',
      type1Count: 0,
      type1Sf: 0,
      type1Rent: 0,
      parkingPerUnit: 0,
      laundryPerUnit: 0,
      otherIncome: 0,
      vacancyRate: 5,
      badDebtRate: 0,
      concessionsRate: 0,
      expManagement: 5,
      expTaxes: 0,
      expInsurance: 0,
      expRepairs: 0,
      expUtilities: 0,
      expPayroll: 0,
      expAdmin: 0,
      expReserves: 0,
      expOther: 0,
      capRate: 6,
      adjCapex: 0,
      adjLeasing: 0,
      adjOther: 0,
    }
  }
};

type PropertyKey = keyof typeof PROPERTIES;
type PropertyData = typeof PROPERTIES['north-battleford']['data'];

export default function InputPanel() {
  const [selectedProperty, setSelectedProperty] = useState<PropertyKey>('north-battleford');
  const [data, setData] = useState(PROPERTIES['north-battleford'].data);

  const loadProperty = (key: PropertyKey) => {
    setSelectedProperty(key);
    setData(PROPERTIES[key].data);
  };

  // Calculations
  const type1Annual = data.type1Count * data.type1Rent * 12;
  const totalUnits = data.type1Count;
  const totalSf = data.type1Count * data.type1Sf;
  const totalRentalRevenue = type1Annual;

  const parkingTotal = data.parkingPerUnit * totalUnits * 12;
  const laundryTotal = data.laundryPerUnit * totalUnits * 12;
  const totalOtherIncome = parkingTotal + laundryTotal + data.otherIncome;

  const pgr = totalRentalRevenue + totalOtherIncome;
  const totalVacancyRate = data.vacancyRate + data.badDebtRate + data.concessionsRate;
  const vacancyLoss = pgr * (totalVacancyRate / 100);
  const egr = pgr - vacancyLoss;

  const expManagementAmt = egr * (data.expManagement / 100);
  const expTaxesAmt = data.expTaxes * totalUnits;
  const expInsuranceAmt = data.expInsurance * totalUnits;
  const expRepairsAmt = data.expRepairs * totalUnits;
  const expUtilitiesAmt = data.expUtilities * totalUnits;
  const expPayrollAmt = data.expPayroll * totalUnits;
  const expAdminAmt = data.expAdmin * totalUnits;
  const expReservesAmt = data.expReserves * totalUnits;
  const expOtherAmt = data.expOther * totalUnits;
  const expensesTotal = expManagementAmt + expTaxesAmt + expInsuranceAmt + expRepairsAmt +
                        expUtilitiesAmt + expPayrollAmt + expAdminAmt + expReservesAmt + expOtherAmt;
  const expenseRatio = egr > 0 ? (expensesTotal / egr) * 100 : 0;

  const noi = egr - expensesTotal;
  const rawValue = data.capRate > 0 ? noi / (data.capRate / 100) : 0;
  const roundedValue = Math.round(rawValue / 10000) * 10000;

  const adjTotal = data.adjCapex + data.adjLeasing + data.adjOther;
  const indicatedValue = roundedValue - adjTotal;

  const formatCurrency = (n: number) => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  const formatNumber = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 2 });

  const updateField = (field: keyof PropertyData, value: string) => {
    setData(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  return (
    <div className="space-y-3 text-xs">

      {/* PROPERTY SELECTOR */}
      <div className="border rounded overflow-hidden">
        <div className="bg-slate-800 text-white px-2 py-1 font-semibold">SELECT PROPERTY</div>
        <div className="p-2 flex flex-wrap gap-2">
          {Object.entries(PROPERTIES).map(([key, prop]) => (
            <button
              key={key}
              type="button"
              onClick={() => loadProperty(key as PropertyKey)}
              className={`px-3 py-1.5 text-xs rounded font-medium transition-colors ${
                selectedProperty === key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {prop.name}
            </button>
          ))}
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
              <td className="px-2 py-1">{data.type1Name}</td>
              <td className="px-2 py-1"><Input type="number" value={data.type1Count} onChange={e => updateField('type1Count', e.target.value)} className="h-6 w-16 text-right text-xs p-1" /></td>
              <td className="px-2 py-1"><Input type="number" value={data.type1Sf} onChange={e => updateField('type1Sf', e.target.value)} className="h-6 w-16 text-right text-xs p-1" /></td>
              <td className="px-2 py-1"><Input type="number" value={data.type1Rent} onChange={e => updateField('type1Rent', e.target.value)} className="h-6 w-20 text-right text-xs p-1" /></td>
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
              <td className="px-2 py-1"><Input type="number" value={data.parkingPerUnit} onChange={e => updateField('parkingPerUnit', e.target.value)} className="h-6 w-20 text-right text-xs p-1" /></td>
              <td className="px-2 py-1 text-right text-slate-500">/unit/mo</td>
              <td className="px-2 py-1 text-right font-medium">{formatCurrency(parkingTotal)}</td>
            </tr>
            <tr className="border-t">
              <td className="px-2 py-1">Laundry</td>
              <td className="px-2 py-1"><Input type="number" value={data.laundryPerUnit} onChange={e => updateField('laundryPerUnit', e.target.value)} className="h-6 w-20 text-right text-xs p-1" /></td>
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
              <td className="px-2 py-1"><Input type="number" step="0.1" value={data.vacancyRate} onChange={e => updateField('vacancyRate', e.target.value)} className="h-6 w-16 text-right text-xs p-1" /></td>
              <td className="px-2 py-1 text-slate-500">%</td>
            </tr>
            <tr className="border-t">
              <td className="px-2 py-1">Bad Debt</td>
              <td className="px-2 py-1"><Input type="number" step="0.1" value={data.badDebtRate} onChange={e => updateField('badDebtRate', e.target.value)} className="h-6 w-16 text-right text-xs p-1" /></td>
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
              <td className="px-2 py-1"><Input type="number" step="0.25" value={data.expManagement} onChange={e => updateField('expManagement', e.target.value)} className="h-6 w-16 text-right text-xs p-1" /></td>
              <td className="px-2 py-1 text-slate-500">% EGR</td>
              <td className="px-2 py-1 text-right">{formatCurrency(expManagementAmt)}</td>
            </tr>
            <tr className="border-t">
              <td className="px-2 py-1">Taxes</td>
              <td className="px-2 py-1"><Input type="number" value={data.expTaxes} onChange={e => updateField('expTaxes', e.target.value)} className="h-6 w-16 text-right text-xs p-1" /></td>
              <td className="px-2 py-1 text-slate-500">/unit</td>
              <td className="px-2 py-1 text-right">{formatCurrency(expTaxesAmt)}</td>
            </tr>
            <tr className="border-t">
              <td className="px-2 py-1">Insurance</td>
              <td className="px-2 py-1"><Input type="number" value={data.expInsurance} onChange={e => updateField('expInsurance', e.target.value)} className="h-6 w-16 text-right text-xs p-1" /></td>
              <td className="px-2 py-1 text-slate-500">/unit</td>
              <td className="px-2 py-1 text-right">{formatCurrency(expInsuranceAmt)}</td>
            </tr>
            <tr className="border-t">
              <td className="px-2 py-1">Repairs</td>
              <td className="px-2 py-1"><Input type="number" value={data.expRepairs} onChange={e => updateField('expRepairs', e.target.value)} className="h-6 w-16 text-right text-xs p-1" /></td>
              <td className="px-2 py-1 text-slate-500">/unit</td>
              <td className="px-2 py-1 text-right">{formatCurrency(expRepairsAmt)}</td>
            </tr>
            <tr className="border-t">
              <td className="px-2 py-1">Utilities</td>
              <td className="px-2 py-1"><Input type="number" value={data.expUtilities} onChange={e => updateField('expUtilities', e.target.value)} className="h-6 w-16 text-right text-xs p-1" /></td>
              <td className="px-2 py-1 text-slate-500">/unit</td>
              <td className="px-2 py-1 text-right">{formatCurrency(expUtilitiesAmt)}</td>
            </tr>
            <tr className="border-t">
              <td className="px-2 py-1">Payroll</td>
              <td className="px-2 py-1"><Input type="number" value={data.expPayroll} onChange={e => updateField('expPayroll', e.target.value)} className="h-6 w-16 text-right text-xs p-1" /></td>
              <td className="px-2 py-1 text-slate-500">/unit</td>
              <td className="px-2 py-1 text-right">{formatCurrency(expPayrollAmt)}</td>
            </tr>
            <tr className="border-t">
              <td className="px-2 py-1">Other</td>
              <td className="px-2 py-1"><Input type="number" value={data.expOther} onChange={e => updateField('expOther', e.target.value)} className="h-6 w-16 text-right text-xs p-1" /></td>
              <td className="px-2 py-1 text-slate-500">/unit</td>
              <td className="px-2 py-1 text-right">{formatCurrency(expOtherAmt)}</td>
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
              <td className="px-2 py-1"><Input type="number" step="0.25" value={data.capRate} onChange={e => updateField('capRate', e.target.value)} className="h-6 w-16 text-right text-xs p-1" /></td>
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
        <div className="text-xs text-purple-700 mt-1">
          {formatCurrency(indicatedValue / totalUnits)}/unit | ${formatNumber(indicatedValue / totalSf)}/SF
        </div>
      </div>

    </div>
  );
}
