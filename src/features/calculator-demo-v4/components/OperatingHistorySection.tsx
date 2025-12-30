/**
 * Operating History Section - Wrapper component
 *
 * Wraps OperatingHistoryPanel with collapsible section UI.
 * Shows YTD vs Projection comparison for operating income/expenses.
 */

import { useState } from 'react';
import OperatingHistoryPanel from './OperatingHistoryPanel';
import { useTheme } from '../context/ThemeContext';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function OperatingHistorySection() {
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
              Operating History
            </h2>
            <p className="text-xs mt-0.5" style={{ color: colors.textMuted }}>
              YTD historical vs projected operating performance
            </p>
          </div>
        </div>
        <span className="text-xs" style={{ color: colors.textDim }}>
          {expanded ? 'Collapse' : 'Expand'}
        </span>
      </div>
      {expanded && (
        <div className="p-4">
          <OperatingHistoryPanel />
        </div>
      )}
    </div>
  );
}
