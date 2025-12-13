/**
 * Output Panel - Indicated Value + Calculation Breakdown
 *
 * Simplified layout: prominent value display + detailed breakdown below.
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

  const indicatedValue = getFieldValue('calc-indicated-value');
  const capRate = getFieldValue('calc-cap-rate');
  const noi = getFieldValue('calc-noi');

  return (
    <div className="flex flex-col h-full">
      {/* Indicated Value - Prominent Display */}
      <div className="border border-[#3a3a3a] rounded-sm overflow-hidden flex-shrink-0 bg-[#252525]">
        <div className="px-5 py-4">
          <div className="text-xs font-medium text-[#707070] uppercase tracking-wider mb-2">
            Indicated Value
          </div>
          <div className="text-3xl font-semibold text-[#e5e5e5] tracking-tight">
            {formatCurrency(indicatedValue)}
          </div>
          <div className="mt-2 text-xs text-[#606060]">
            NOI {formatCurrency(noi)} @ {capRate.toFixed(2)}% Cap Rate
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
