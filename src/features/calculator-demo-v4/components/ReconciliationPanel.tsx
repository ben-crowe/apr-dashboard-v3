/**
 * Reconciliation Panel - Combines Income and Sales Approaches
 *
 * Uses LOCAL STATE for weights and pulls values from:
 * - Income Approach (from store)
 * - Sales Comparison (passed as prop)
 */

import { useState, useEffect } from 'react';
import { useReportBuilderStore } from '@/features/report-builder/store/reportBuilderStore';
import { Input } from '@/components/ui/input';
import { useTheme } from '../context/ThemeContext';

interface ReconciliationPanelProps {
  salesIndicatedValue: number;
}

export default function ReconciliationPanel({ salesIndicatedValue }: ReconciliationPanelProps) {
  const { colors } = useTheme();

  // Get Income Approach value from store
  const sections = useReportBuilderStore(state => state.sections);
  const calcSection = sections.find(s => s.id === 'calc');

  const getFieldValue = (fieldId: string): number => {
    if (!calcSection) return 0;
    const field = calcSection.fields?.find((f: any) => f.id === fieldId);
    if (field) return Number(field.value) || 0;
    if (calcSection.subsections) {
      for (const sub of calcSection.subsections) {
        const subField = sub.fields?.find((f: any) => f.id === fieldId);
        if (subField) return Number(subField.value) || 0;
      }
    }
    return 0;
  };

  const incomeValue = getFieldValue('calc-indicated-value');
  const totalUnits = getFieldValue('calc-total-units');
  const totalSf = getFieldValue('calc-total-sf');

  // Weight state - default 50/50
  const [incomeWeight, setIncomeWeight] = useState<number>(50);
  const [salesWeight, setSalesWeight] = useState<number>(50);

  // Auto-adjust weights to sum to 100%
  const handleIncomeWeightChange = (value: string) => {
    const val = parseFloat(value) || 0;
    const clamped = Math.max(0, Math.min(100, val));
    setIncomeWeight(clamped);
    setSalesWeight(100 - clamped);
  };

  const handleSalesWeightChange = (value: string) => {
    const val = parseFloat(value) || 0;
    const clamped = Math.max(0, Math.min(100, val));
    setSalesWeight(clamped);
    setIncomeWeight(100 - clamped);
  };

  // Calculate reconciled value
  const reconciledValue = (incomeValue * incomeWeight / 100) + (salesIndicatedValue * salesWeight / 100);

  const formatCurrency = (n: number) => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  const formatNumber = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 2 });

  const inputStyle = {
    backgroundColor: colors.inputBg,
    borderColor: colors.border,
    color: colors.text,
  };

  // Check if weights sum to 100%
  const weightSum = incomeWeight + salesWeight;
  const weightsValid = Math.abs(weightSum - 100) < 0.01;

  return (
    <div className="space-y-3 text-xs" style={{ color: colors.text }}>

      {/* RECONCILIATION TABLE */}
      <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
        <div className="px-2 py-1.5" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
            Value Reconciliation
          </span>
        </div>
        <table className="w-full">
          <thead style={{ borderBottom: `1px solid ${colors.border}` }}>
            <tr>
              <th className="px-2 py-1 text-left font-normal" style={{ color: colors.textMuted }}>Approach</th>
              <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>Indicated Value</th>
              <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>Weight (%)</th>
              <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>Weighted Value</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              <td className="px-2 py-1" style={{ color: colors.textMuted }}>Income Approach</td>
              <td className="px-2 py-1 text-right" style={{ color: colors.text }}>
                {formatCurrency(incomeValue)}
              </td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  step="5"
                  min="0"
                  max="100"
                  value={incomeWeight}
                  onChange={e => handleIncomeWeightChange(e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1 ml-auto"
                  style={inputStyle}
                />
              </td>
              <td className="px-2 py-1 text-right" style={{ color: colors.textMuted }}>
                {formatCurrency(incomeValue * incomeWeight / 100)}
              </td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              <td className="px-2 py-1" style={{ color: colors.textMuted }}>Sales Comparison</td>
              <td className="px-2 py-1 text-right" style={{ color: colors.text }}>
                {formatCurrency(salesIndicatedValue)}
              </td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  step="5"
                  min="0"
                  max="100"
                  value={salesWeight}
                  onChange={e => handleSalesWeightChange(e.target.value)}
                  className="h-6 w-16 text-right text-xs p-1 ml-auto"
                  style={inputStyle}
                />
              </td>
              <td className="px-2 py-1 text-right" style={{ color: colors.textMuted }}>
                {formatCurrency(salesIndicatedValue * salesWeight / 100)}
              </td>
            </tr>
          </tbody>
          <tfoot style={{ borderTop: `1px solid ${colors.border}` }}>
            <tr>
              <td className="px-2 py-1 font-medium" style={{ color: colors.textMuted }}>Total</td>
              <td className="px-2 py-1"></td>
              <td className="px-2 py-1 text-right font-medium" style={{
                color: weightsValid ? colors.text : '#ff6b6b'
              }}>
                {weightSum.toFixed(0)}%
              </td>
              <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>
                {formatCurrency(reconciledValue)}
              </td>
            </tr>
          </tfoot>
        </table>
        {!weightsValid && (
          <div className="px-2 py-1 text-[10px]" style={{ color: '#ff6b6b', borderTop: `1px solid ${colors.border}` }}>
            Warning: Weights must sum to 100%
          </div>
        )}
      </div>

      {/* RECONCILED VALUE - Final Result */}
      <div className="rounded-sm px-3 py-3" style={{ border: `1px solid ${colors.border}`, backgroundColor: colors.panelBgAlt }}>
        <div className="flex justify-between items-center">
          <span className="font-medium" style={{ color: colors.textMuted }}>Final Reconciled Value</span>
          <span className="text-2xl font-bold" style={{ color: colors.text }}>
            {formatCurrency(reconciledValue)}
          </span>
        </div>
        {totalUnits > 0 && totalSf > 0 && (
          <div className="text-[10px] mt-2 text-right space-y-0.5" style={{ color: colors.textDim }}>
            <div>{formatCurrency(reconciledValue / totalUnits)}/unit</div>
            <div>${formatNumber(reconciledValue / totalSf)}/SF</div>
          </div>
        )}
      </div>

      {/* BREAKDOWN DETAILS */}
      <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
        <div className="px-2 py-1.5" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
            Calculation Details
          </span>
        </div>
        <div className="p-2 space-y-1 text-[10px]" style={{ color: colors.textMuted }}>
          <div className="flex justify-between">
            <span>Income Contribution:</span>
            <span style={{ color: colors.text }}>
              {formatCurrency(incomeValue)} × {incomeWeight}% = {formatCurrency(incomeValue * incomeWeight / 100)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Sales Contribution:</span>
            <span style={{ color: colors.text }}>
              {formatCurrency(salesIndicatedValue)} × {salesWeight}% = {formatCurrency(salesIndicatedValue * salesWeight / 100)}
            </span>
          </div>
          <div className="flex justify-between pt-1" style={{ borderTop: `1px solid ${colors.border}` }}>
            <span className="font-medium">Reconciled Total:</span>
            <span className="font-medium" style={{ color: colors.text }}>
              {formatCurrency(reconciledValue)}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
