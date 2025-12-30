/**
 * Sales Comparison Section - Wrapper component
 *
 * Manages state for Sales Comparison Panel and passes the
 * indicated value to the Reconciliation Panel.
 */

import { useState } from 'react';
import SalesComparisonPanel from './SalesComparisonPanel';
import { useTheme } from '../context/ThemeContext';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface SalesComparisonSectionProps {
  onValueChange?: (value: number) => void;
}

export default function SalesComparisonSection({ onValueChange }: SalesComparisonSectionProps) {
  const { colors } = useTheme();
  const [salesExpanded, setSalesExpanded] = useState(false);

  const handleValueChange = (value: number) => {
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
          borderBottom: salesExpanded ? `1px solid ${colors.border}` : 'none',
        }}
        onClick={() => setSalesExpanded(!salesExpanded)}
      >
        <div className="flex items-center gap-2">
          {salesExpanded ? (
            <ChevronDown className="h-4 w-4" style={{ color: colors.textDim }} />
          ) : (
            <ChevronRight className="h-4 w-4" style={{ color: colors.textDim }} />
          )}
          <div>
            <h2 className="font-medium text-sm" style={{ color: colors.text }}>
              Direct Comparison Approach
            </h2>
            <p className="text-xs mt-0.5" style={{ color: colors.textMuted }}>
              Comparable sales analysis with adjustments - P60
            </p>
          </div>
        </div>
        <span className="text-xs" style={{ color: colors.textDim }}>
          {salesExpanded ? 'Collapse' : 'Expand'}
        </span>
      </div>
      {salesExpanded && (
        <div className="p-4">
          <SalesComparisonPanel onIndicatedValueChange={handleValueChange} />
        </div>
      )}
    </div>
  );
}
