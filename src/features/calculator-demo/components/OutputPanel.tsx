/**
 * Output Panel - Calculation Results
 *
 * Claude-inspired minimal aesthetic: subtle borders, grayscale, color only for key values.
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
    <div className="flex flex-col h-full">
      {/* Results Box - Minimal, border-defined */}
      <div className="border border-[#3a3a3a] rounded-sm overflow-hidden flex-shrink-0">
        <div className="px-4 py-2 border-b border-[#3a3a3a]">
          <span className="text-xs font-medium text-[#909090] uppercase tracking-wider">Results</span>
        </div>
        <div className="divide-y divide-[#3a3a3a]">
          <div className="px-4 py-2 flex justify-between items-center">
            <span className="text-sm text-[#909090]">PGR</span>
            <span className="text-sm font-medium text-[#e5e5e5]">{formatCurrency(pgr)}</span>
          </div>
          <div className="px-4 py-2 flex justify-between items-center">
            <span className="text-sm text-[#909090]">Vacancy Loss</span>
            <span className="text-sm font-medium text-[#909090]">({formatCurrency(vacancyLoss)})</span>
          </div>
          <div className="px-4 py-2 flex justify-between items-center">
            <span className="text-sm text-[#909090]">EGR</span>
            <span className="text-sm font-medium text-[#e5e5e5]">{formatCurrency(egr)}</span>
          </div>
          <div className="px-4 py-2 flex justify-between items-center">
            <span className="text-sm text-[#909090]">Operating Expenses</span>
            <span className="text-sm font-medium text-[#909090]">({formatCurrency(expensesTotal)})</span>
          </div>
          <div className="px-4 py-2 flex justify-between items-center">
            <span className="text-sm text-[#909090]">NOI</span>
            <span className="text-sm font-medium text-[#e5e5e5]">{formatCurrency(noi)}</span>
          </div>
          <div className="px-4 py-2 flex justify-between items-center">
            <span className="text-sm text-[#909090]">Cap Rate</span>
            <span className="text-sm font-medium text-[#e5e5e5]">{capRate.toFixed(2)}%</span>
          </div>
          <div className="px-4 py-2 flex justify-between items-center">
            <span className="text-sm text-[#909090]">Raw Value</span>
            <span className="text-sm font-medium text-[#e5e5e5]">{formatCurrency(rawValue)}</span>
          </div>
        </div>
        {/* Indicated Value */}
        <div className="px-4 py-4 border-t border-[#3a3a3a] bg-[#252525]">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#909090]">Indicated Value</span>
            <span className="text-2xl font-semibold text-[#e5e5e5]">{formatCurrency(indicatedValue)}</span>
          </div>
        </div>
      </div>

      {/* Calculation Breakdown - grows to fill remaining space, then scrolls */}
      <div className="mt-4 flex-1 min-h-0">
        <CalculationReasoning />
      </div>
    </div>
  );
}
