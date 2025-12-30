/**
 * Reconciliation Section - Wrapper component
 *
 * Manages state for Reconciliation Panel and passes all
 * 3 indicated values from Income, Sales, and Cost approaches.
 */

import { useState } from 'react';
import ReconciliationPanel from './ReconciliationPanel';
import { useTheme } from '../context/ThemeContext';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface ReconciliationSectionProps {
  incomeValue: number;
  salesValue: number;
  costValue: number;
}

export default function ReconciliationSection({
  incomeValue,
  salesValue,
  costValue
}: ReconciliationSectionProps) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);

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
              Value Reconciliation
            </h2>
            <p className="text-xs mt-0.5" style={{ color: colors.textMuted }}>
              Combine Income, Sales, and Cost approaches - P62
            </p>
          </div>
        </div>
        <span className="text-xs" style={{ color: colors.textDim }}>
          {expanded ? 'Collapse' : 'Expand'}
        </span>
      </div>
      {expanded && (
        <div className="p-4 overflow-y-auto" style={{ maxHeight: '500px' }}>
          <ReconciliationPanel
            incomeValue={incomeValue}
            salesIndicatedValue={salesValue}
            costValue={costValue}
          />
        </div>
      )}
    </div>
  );
}

