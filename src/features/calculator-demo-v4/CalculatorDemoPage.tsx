/**
 * Calculator Demo Page - Income Capitalization Calculator
 *
 * Minimal aesthetic with light/dark mode toggle.
 * Borders and whitespace, not colors and fills.
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, ChevronDown, ChevronRight, Sun, Moon, ZoomIn, ZoomOut } from 'lucide-react';
import { useReportBuilderStore } from '@/features/report-builder/store/reportBuilderStore';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';
import MarkdownSummary from './components/MarkdownSummary';
import OperatingHistorySection from './components/OperatingHistorySection';
import IncomeApproachSection from './components/IncomeApproachSection';
import SalesComparisonSection from './components/SalesComparisonSection';
import CostApproachSection from './components/CostApproachSection';
import ReconciliationSection from './components/ReconciliationSection';

function CalculatorContent() {
  const [lastRefresh, setLastRefresh] = useState(new Date().toLocaleTimeString());
  const [summaryExpanded, setSummaryExpanded] = useState(true);
  const [incomeValue, setIncomeValue] = useState<number>(0);
  const [salesValue, setSalesValue] = useState<number>(0);
  const [costValue, setCostValue] = useState<number>(0);
  const [zoom, setZoom] = useState(1);
  const initializeMockData = useReportBuilderStore(state => state.initializeMockData);
  const sections = useReportBuilderStore(state => state.sections);
  const { theme, toggleTheme, colors } = useTheme();

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 1.5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleZoomReset = () => {
    setZoom(1);
  };

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
    <div style={{ backgroundColor: colors.pageBg, minHeight: '2000px' }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.pageBg }}>
        <div className="mx-auto px-12 py-4" style={{ maxWidth: '1400px', backgroundColor: colors.pageBg }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-wide" style={{ color: colors.text }}>
                Valuation Calculator
              </h1>
              <p className="text-xs" style={{ color: colors.textMuted }}>
                Direct Capitalization Method · USPAP/CUSPAP · v2.1
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: colors.textDim }}>
                {lastRefresh}
              </span>
              {/* Zoom Controls */}
              <div className="flex items-center gap-1 border rounded-md px-1" style={{ borderColor: colors.border }}>
                <Button
                  onClick={handleZoomOut}
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  style={{ color: colors.textMuted }}
                  title="Zoom Out"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </Button>
                <span className="text-xs px-2" style={{ color: colors.textMuted, minWidth: '45px', textAlign: 'center' }}>
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  onClick={handleZoomIn}
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  style={{ color: colors.textMuted }}
                  title="Zoom In"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </Button>
                {zoom !== 1 && (
                  <Button
                    onClick={handleZoomReset}
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    style={{ color: colors.textMuted }}
                    title="Reset Zoom"
                  >
                    Reset
                  </Button>
                )}
              </div>
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

      {/* Main Content - Vertical Resizable Split: Top = Side-by-side panels, Bottom = Sections */}
      <div className="mx-auto px-12 py-6" style={{ maxWidth: '1400px', backgroundColor: colors.pageBg, height: '2050px' }}>
        <ResizablePanelGroup direction="vertical" className="w-full h-full">
          {/* Top Panel - Side-by-side Input and Output Panels */}
          <ResizablePanel defaultSize={65} minSize={5} maxSize={85} className="flex" id="top-panel">
            <div className="w-full h-full">
              <ResizablePanelGroup direction="horizontal" className="w-full h-full items-stretch">
                {/* Input Panel - Left Column (default 65%, resizable) */}
                <ResizablePanel defaultSize={65} minSize={30} maxSize={75} className="flex">
                  <div
                    className="rounded-sm w-full h-full flex flex-col"
                    style={{
                      backgroundColor: colors.panelBg,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <div
                      className="px-4 py-3 flex-shrink-0"
                      style={{ borderBottom: `1px solid ${colors.border}` }}
                    >
                      <h2 className="font-medium text-sm" style={{ color: colors.text }}>
                        Input Panel
                      </h2>
                      <p className="text-xs mt-0.5" style={{ color: colors.textMuted }}>
                        Property data and assumptions
                      </p>
                    </div>
                    <div
                      className="p-4 flex-1 min-h-0 overflow-y-auto"
                      style={{ zoom: zoom }}
                    >
                      <InputPanel />
                    </div>
                  </div>
                </ResizablePanel>

                {/* Resizable Handle */}
                <ResizableHandle withHandle />

                {/* Output Panel - Right Column (default 35%, resizable) */}
                <ResizablePanel defaultSize={35} minSize={25} maxSize={70} className="flex">
                  <div
                    className="rounded-sm w-full h-full flex flex-col"
                    style={{
                      backgroundColor: colors.panelBg,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <div
                      className="p-4 flex flex-col flex-1 min-h-0"
                      style={{ zoom: zoom }}
                    >
                      <OutputPanel />
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </ResizablePanel>

          {/* Vertical Resizable Handle */}
          <ResizableHandle withHandle />

          {/* Bottom Panel - Approach Sections */}
          <ResizablePanel defaultSize={35} minSize={15} maxSize={95} className="flex" id="bottom-panel">
            <div className="w-full h-full overflow-y-auto overflow-x-hidden">
              {/* Operating History Section */}
              <OperatingHistorySection />

              {/* Income Approach Section */}
              <IncomeApproachSection onValueChange={setIncomeValue} />

              {/* Sales Comparison Section */}
              <SalesComparisonSection onValueChange={setSalesValue} />

              {/* Cost Approach Section */}
              <CostApproachSection onValueChange={setCostValue} />

              {/* Reconciliation Section */}
              <ReconciliationSection
                incomeValue={incomeValue}
                salesValue={salesValue}
                costValue={costValue}
              />

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
                  <div className="p-4" style={{ zoom: zoom }}>
                    <MarkdownSummary />
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Footer */}
      <div
        className="py-3"
        style={{ borderTop: `1px solid ${colors.border}`, backgroundColor: colors.pageBg, marginTop: '200px' }}
      >
        <div className="mx-auto px-12" style={{ maxWidth: '1400px', backgroundColor: colors.pageBg }}>
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
