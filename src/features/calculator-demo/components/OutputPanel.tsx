/**
 * Output Panel - Compact Results Summary
 *
 * Displays the 7 key calculation results in a simple, compact format
 * No giant cards - just clean summary box
 */

import { useReportBuilderStore } from '@/features/report-builder/store/reportBuilderStore';
import CalculationReasoning from './CalculationReasoning';

export default function OutputPanel() {
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

  const pgr = getFieldValue('calc-pgr');
  const vacancyLoss = getFieldValue('calc-vacancy-loss');
  const egr = getFieldValue('calc-egr');
  const expensesTotal = getFieldValue('calc-expenses-total');
  const noi = getFieldValue('calc-noi');
  const capRate = getFieldValue('calc-cap-rate');
  const rawValue = getFieldValue('calc-raw-value');
  const indicatedValue = getFieldValue('calc-indicated-value');

  return (
    <div className="space-y-6">
      {/* Compact Results Box */}
      <div className="border-2 border-slate-300 rounded-lg overflow-hidden">
        <div className="bg-slate-800 text-white px-4 py-2 font-bold">
          CALCULATION RESULTS
        </div>
        <div className="divide-y">
          <div className="px-4 py-2 flex justify-between items-center hover:bg-slate-50">
            <span className="text-sm font-medium text-slate-700">PGR:</span>
            <span className="text-base font-semibold text-slate-900">{formatCurrency(pgr)}</span>
          </div>
          <div className="px-4 py-2 flex justify-between items-center hover:bg-slate-50">
            <span className="text-sm font-medium text-slate-700">Vacancy Loss:</span>
            <span className="text-base font-semibold text-red-600">({formatCurrency(vacancyLoss)})</span>
          </div>
          <div className="px-4 py-2 flex justify-between items-center hover:bg-slate-50">
            <span className="text-sm font-medium text-slate-700">EGR:</span>
            <span className="text-base font-semibold text-slate-900">{formatCurrency(egr)}</span>
          </div>
          <div className="px-4 py-2 flex justify-between items-center hover:bg-slate-50">
            <span className="text-sm font-medium text-slate-700">Operating Exp:</span>
            <span className="text-base font-semibold text-red-600">({formatCurrency(expensesTotal)})</span>
          </div>
          <div className="px-4 py-2 flex justify-between items-center hover:bg-slate-50">
            <span className="text-sm font-medium text-slate-700">NOI:</span>
            <span className="text-base font-semibold text-blue-700">{formatCurrency(noi)}</span>
          </div>
          <div className="px-4 py-2 flex justify-between items-center hover:bg-slate-50">
            <span className="text-sm font-medium text-slate-700">Cap Rate:</span>
            <span className="text-base font-semibold text-slate-900">{capRate.toFixed(2)}%</span>
          </div>
          <div className="px-4 py-2 flex justify-between items-center hover:bg-slate-50">
            <span className="text-sm font-medium text-slate-700">Raw Value:</span>
            <span className="text-base font-semibold text-slate-900">{formatCurrency(rawValue)}</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-100 to-blue-100 border-t-4 border-purple-600 px-4 py-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-purple-900 uppercase">Indicated Value:</span>
            <span className="text-3xl font-bold text-purple-900">{formatCurrency(indicatedValue)}</span>
          </div>
        </div>
      </div>

      {/* Validation Badge */}
      {indicatedValue === 1780000 && (
        <div className="bg-green-100 border-2 border-green-500 rounded-lg px-4 py-3">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold text-green-800">
              Validated: Matches expected $1,780,000 result
            </span>
          </div>
        </div>
      )}

      {/* Calculation Reasoning - Show Your Math */}
      <CalculationReasoning />

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-3 gap-4 pt-4">
        <div className="text-center p-3 bg-slate-50 rounded border">
          <div className="text-xs text-slate-600 mb-1">Per Unit</div>
          <div className="text-lg font-bold text-slate-900">
            {formatCurrency(getFieldValue('calc-value-per-unit'))}
          </div>
        </div>
        <div className="text-center p-3 bg-slate-50 rounded border">
          <div className="text-xs text-slate-600 mb-1">Per SF</div>
          <div className="text-lg font-bold text-slate-900">
            ${getFieldValue('calc-value-per-sf').toFixed(2)}
          </div>
        </div>
        <div className="text-center p-3 bg-slate-50 rounded border">
          <div className="text-xs text-slate-600 mb-1">GRM</div>
          <div className="text-lg font-bold text-slate-900">
            {getFieldValue('calc-grm').toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
