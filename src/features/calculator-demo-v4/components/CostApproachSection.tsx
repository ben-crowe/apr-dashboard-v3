/**
 * Cost Approach Section - Wrapper component
 *
 * Manages state for Cost Approach Panel and passes the
 * indicated value to the Reconciliation Panel.
 */

import { useState } from 'react';
import CostApproachPanel from './CostApproachPanel';
import { useTheme } from '../context/ThemeContext';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function CostApproachSection() {
  const { colors } = useTheme();
  const [costExpanded, setCostExpanded] = useState(false);

  // This will be lifted up from CostApproachPanel
  const [costIndicatedValue, setCostIndicatedValue] = useState<number>(0);

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
          borderBottom: costExpanded ? `1px solid ${colors.border}` : 'none',
        }}
        onClick={() => setCostExpanded(!costExpanded)}
      >
        <div className="flex items-center gap-2">
          {costExpanded ? (
            <ChevronDown className="h-4 w-4" style={{ color: colors.textDim }} />
          ) : (
            <ChevronRight className="h-4 w-4" style={{ color: colors.textDim }} />
          )}
          <div>
            <h2 className="font-medium text-sm" style={{ color: colors.text }}>
              Cost Approach
            </h2>
            <p className="text-xs mt-0.5" style={{ color: colors.textMuted }}>
              Land Value + (RCN - Depreciation) + Site Improvements
            </p>
          </div>
        </div>
        <span className="text-xs" style={{ color: colors.textDim }}>
          {costExpanded ? 'Collapse' : 'Expand'}
        </span>
      </div>
      {costExpanded && (
        <div className="p-4">
          <CostApproachPanel onValueChange={setCostIndicatedValue} />
        </div>
      )}
    </div>
  );
}

