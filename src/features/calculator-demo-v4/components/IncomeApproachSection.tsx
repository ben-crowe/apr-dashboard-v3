/**
 * Income Approach Section - Wrapper component
 *
 * Manages state for Income Approach Panel and passes the
 * indicated value to the Reconciliation Panel.
 */

import { useState } from 'react';
import IncomeApproachPanel from './IncomeApproachPanel';
import { useTheme } from '../context/ThemeContext';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface IncomeApproachSectionProps {
  onValueChange?: (value: number) => void;
}

export default function IncomeApproachSection({ onValueChange }: IncomeApproachSectionProps) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [indicatedValue, setIndicatedValue] = useState<number>(0);

  const handleValueChange = (value: number) => {
    setIndicatedValue(value);
    onValueChange?.(value);
  };

  return (
    <div
      className="mt-5 rounded-sm"
      style={{
        backgroundColor: colors.panelBg,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div
        className="px-4 py-3 cursor-pointer transition-colors flex items-center justify-between"
        style={{
          borderBottom: expanded ? `1px solid ${colors.border}` : 'none',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronDown className="h-4 w-4" style={{ color: colors.textDim }} />
          ) : (
            <ChevronRight className="h-4 w-4" style={{ color: colors.textDim }} />
          )}
          <div>
            <h2 className="font-medium text-sm" style={{ color: colors.text }}>
              Income Approach
            </h2>
            <p className="text-xs mt-0.5" style={{ color: colors.textMuted }}>
              Direct capitalization of net operating income
            </p>
          </div>
        </div>
        <span className="text-xs" style={{ color: colors.textDim }}>
          {expanded ? 'Collapse' : 'Expand'}
        </span>
      </div>
      {expanded && (
        <div className="p-4">
          <IncomeApproachPanel onValueChange={handleValueChange} />
        </div>
      )}
    </div>
  );
}

