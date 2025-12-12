/**
 * Output Panel - Professional Financial Results Summary
 *
 * Displays the 7 key calculation results in a clean, professional format.
 * Color scheme: Navy/charcoal - Bloomberg terminal aesthetic.
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
    <div className="space-y-4">
      {/* Compact Results Box - Professional Navy Theme */}
      <div className="border border-slate-400 overflow-hidden" style={{ borderRadius: '2px' }}>
        <div className="bg-[#1a1a2e] text-white px-4 py-2 font-bold text-sm tracking-wide">
          CALCULATION RESULTS
        </div>
        <div className="divide-y divide-slate-200 bg-white">
          <div className="px-4 py-2 flex justify-between items-center hover:bg-slate-50">
            <span className="text-sm font-medium text-[#1a1a1a]">PGR:</span>
            <span className="text-base font-semibold text-[#1a1a1a]">{formatCurrency(pgr)}</span>
          </div>
          <div className="px-4 py-2 flex justify-between items-center hover:bg-slate-50">
            <span className="text-sm font-medium text-[#1a1a1a]">Vacancy Loss:</span>
            <span className="text-base font-semibold text-[#8b0000]">({formatCurrency(vacancyLoss)})</span>
          </div>
          <div className="px-4 py-2 flex justify-between items-center hover:bg-slate-50">
            <span className="text-sm font-medium text-[#1a1a1a]">EGR:</span>
            <span className="text-base font-semibold text-[#1a1a1a]">{formatCurrency(egr)}</span>
          </div>
          <div className="px-4 py-2 flex justify-between items-center hover:bg-slate-50">
            <span className="text-sm font-medium text-[#1a1a1a]">Operating Exp:</span>
            <span className="text-base font-semibold text-[#8b0000]">({formatCurrency(expensesTotal)})</span>
          </div>
          <div className="px-4 py-2 flex justify-between items-center hover:bg-slate-50">
            <span className="text-sm font-medium text-[#1a1a1a]">NOI:</span>
            <span className="text-base font-semibold text-[#003366]">{formatCurrency(noi)}</span>
          </div>
          <div className="px-4 py-2 flex justify-between items-center hover:bg-slate-50">
            <span className="text-sm font-medium text-[#1a1a1a]">Cap Rate:</span>
            <span className="text-base font-semibold text-[#1a1a1a]">{capRate.toFixed(2)}%</span>
          </div>
          <div className="px-4 py-2 flex justify-between items-center hover:bg-slate-50">
            <span className="text-sm font-medium text-[#1a1a1a]">Raw Value:</span>
            <span className="text-base font-semibold text-[#1a1a1a]">{formatCurrency(rawValue)}</span>
          </div>
        </div>
        {/* Indicated Value - Navy Background */}
        <div className="bg-[#1a1a2e] border-t-2 border-[#003366] px-4 py-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-white uppercase tracking-wide">Indicated Value:</span>
            <span className="text-3xl font-bold text-white">{formatCurrency(indicatedValue)}</span>
          </div>
        </div>
      </div>

      {/* Validation Badge - Muted Green */}
      {indicatedValue === 1780000 && (
        <div className="bg-[#f0f4f0] border border-[#1e5631] px-4 py-2" style={{ borderRadius: '2px' }}>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#1e5631]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold text-[#1e5631] text-sm">
              Validated: Matches expected $1,780,000 result
            </span>
          </div>
        </div>
      )}

      {/* Calculation Reasoning - Terminal-style breakdown */}
      <CalculationReasoning />
    </div>
  );
}
