/**
 * Calculator Demo Page - Income Capitalization Calculator
 *
 * Minimal aesthetic with light/dark mode toggle.
 * Borders and whitespace, not colors and fills.
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, ChevronDown, ChevronRight, Sun, Moon } from 'lucide-react';
import { useReportBuilderStore } from '@/features/report-builder/store/reportBuilderStore';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';
import MarkdownSummary from './components/MarkdownSummary';
import SalesComparisonSection from './components/SalesComparisonSection';

function CalculatorContent() {
  const [lastRefresh, setLastRefresh] = useState(new Date().toLocaleTimeString());
  const [summaryExpanded, setSummaryExpanded] = useState(true);
  const initializeMockData = useReportBuilderStore(state => state.initializeMockData);
  const sections = useReportBuilderStore(state => state.sections);
  const { theme, toggleTheme, colors } = useTheme();

  // Initialize store with sections on mount
  useEffect(() => {
    if (sections.length === 0) {
      console.log('Initializing store with mock data...');
      initializeMockData();
    }
  }, [sections.length, initializeMockData]);

  const handleRefresh = () => {
    setLastRefresh(new Date().toLocaleTimeString());
    window.location.reload();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.pageBg }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${colors.border}` }}>
        <div className="mx-auto px-12 py-4" style={{ maxWidth: '1400px' }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-wide" style={{ color: colors.text }}>
                Income Capitalization Calculator
              </h1>
              <p className="text-xs" style={{ color: colors.textMuted }}>
                Direct Capitalization Method · USPAP/CUSPAP · v2.1
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs" style={{ color: colors.textDim }}>
                {lastRefresh}
              </span>
              <Button
                onClick={toggleTheme}
                variant="ghost"
                size="sm"
                className="gap-2"
                style={{
                  color: colors.textMuted,
                }}
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              <Button
                onClick={handleRefresh}
                variant="ghost"
                size="sm"
                className="gap-2"
                style={{ color: colors.textMuted }}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 2 Column Layout (45/55 split) */}
      <div className="mx-auto px-12 py-6" style={{ maxWidth: '1400px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-[45%_1fr] gap-5 items-stretch">
          {/* Input Panel - Left Column (45%) */}
          <div>
            <div
              className="rounded-sm h-full"
              style={{
                backgroundColor: colors.panelBg,
                border: `1px solid ${colors.border}`,
              }}
            >
              <div
                className="px-4 py-3"
                style={{ borderBottom: `1px solid ${colors.border}` }}
              >
                <h2 className="font-medium text-sm" style={{ color: colors.text }}>
                  Income Approach
                </h2>
                <p className="text-xs mt-0.5" style={{ color: colors.textMuted }}>
                  Property data and assumptions
                </p>
              </div>
              <div className="p-4">
                <InputPanel />
              </div>
            </div>
          </div>

          {/* Output Panel - Right Column (55%) */}
          <div>
            <div
              className="rounded-sm h-full flex flex-col"
              style={{
                backgroundColor: colors.panelBg,
                border: `1px solid ${colors.border}`,
              }}
            >
              <div className="p-4 flex-1 flex flex-col min-h-0">
                <OutputPanel />
              </div>
            </div>
          </div>
        </div>

        {/* Sales Comparison and Reconciliation Sections */}
        <SalesComparisonSection />

        {/* Summary - Collapsible */}
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
              borderBottom: summaryExpanded ? `1px solid ${colors.border}` : 'none',
            }}
            onClick={() => setSummaryExpanded(!summaryExpanded)}
          >
            <div className="flex items-center gap-2">
              {summaryExpanded ? (
                <ChevronDown className="h-4 w-4" style={{ color: colors.textDim }} />
              ) : (
                <ChevronRight className="h-4 w-4" style={{ color: colors.textDim }} />
              )}
              <div>
                <h2 className="font-medium text-sm" style={{ color: colors.text }}>
                  Summary Report
                </h2>
                <p className="text-xs mt-0.5" style={{ color: colors.textMuted }}>
                  Quick reference cards
                </p>
              </div>
            </div>
            <span className="text-xs" style={{ color: colors.textDim }}>
              {summaryExpanded ? 'Collapse' : 'Expand'}
            </span>
          </div>
          {summaryExpanded && (
            <div className="p-4">
              <MarkdownSummary />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        className="py-3 mt-6"
        style={{ borderTop: `1px solid ${colors.border}` }}
      >
        <div className="mx-auto px-12" style={{ maxWidth: '1400px' }}>
          <p className="text-xs text-center" style={{ color: colors.textDim }}>
            Engine validated against Valcre workbook · 7/7 metrics exact match
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CalculatorDemoPage() {
  return (
    <ThemeProvider>
      <CalculatorContent />
    </ThemeProvider>
  );
}
