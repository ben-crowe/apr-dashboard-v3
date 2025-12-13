/**
 * Calculator Demo Page - Income Capitalization Calculator
 *
 * Claude-inspired minimal aesthetic: dark background, light cards, subtle borders.
 * Borders and whitespace, not colors and fills.
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, ChevronDown, ChevronRight } from 'lucide-react';
import { useReportBuilderStore } from '@/features/report-builder/store/reportBuilderStore';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';
import MarkdownSummary from './components/MarkdownSummary';

export default function CalculatorDemoPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastRefresh, setLastRefresh] = useState(new Date().toLocaleTimeString());
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const initializeMockData = useReportBuilderStore(state => state.initializeMockData);
  const sections = useReportBuilderStore(state => state.sections);

  // Initialize store with sections on mount
  useEffect(() => {
    if (sections.length === 0) {
      console.log('Initializing store with mock data...');
      initializeMockData();
    }
  }, [sections.length, initializeMockData]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    setLastRefresh(new Date().toLocaleTimeString());
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e]">
      {/* Header - Minimal, text-based */}
      <div className="border-b border-[#3a3a3a]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-[#e5e5e5] tracking-wide">
                Income Capitalization Calculator
              </h1>
              <p className="text-xs text-[#808080]">
                Direct Capitalization Method · USPAP/CUSPAP · v2.1
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-[#606060]">
                {lastRefresh}
              </span>
              <Button
                onClick={handleRefresh}
                variant="ghost"
                size="sm"
                className="gap-2 text-[#808080] hover:text-[#e5e5e5] hover:bg-[#2a2a2a]"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 2 Column Layout (45/55 split) */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[45%_1fr] gap-5 items-stretch">
          {/* Input Panel - Left Column (45%) */}
          <div>
            <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-sm h-full">
              <div className="px-4 py-3 border-b border-[#3a3a3a]">
                <h2 className="font-medium text-sm text-[#e5e5e5]">Input Parameters</h2>
                <p className="text-xs text-[#707070] mt-0.5">Property data and assumptions</p>
              </div>
              <div className="p-4">
                <InputPanel />
              </div>
            </div>
          </div>

          {/* Output Panel - Right Column (55%) */}
          <div>
            <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-sm h-full flex flex-col">
              <div className="p-4 flex-1 flex flex-col min-h-0">
                <OutputPanel />
              </div>
            </div>
          </div>
        </div>

        {/* Markdown Summary - Collapsible */}
        <div className="mt-5 bg-[#2a2a2a] border border-[#3a3a3a] rounded-sm">
          <div
            className="px-4 py-3 cursor-pointer hover:bg-[#333333] transition-colors flex items-center justify-between border-b border-transparent hover:border-[#3a3a3a]"
            onClick={() => setSummaryExpanded(!summaryExpanded)}
          >
            <div className="flex items-center gap-2">
              {summaryExpanded ? (
                <ChevronDown className="h-4 w-4 text-[#606060]" />
              ) : (
                <ChevronRight className="h-4 w-4 text-[#606060]" />
              )}
              <div>
                <h2 className="font-medium text-sm text-[#e5e5e5]">Summary Report</h2>
                <p className="text-xs text-[#707070] mt-0.5">Exportable markdown format</p>
              </div>
            </div>
            <span className="text-xs text-[#606060]">
              {summaryExpanded ? 'Collapse' : 'Expand'}
            </span>
          </div>
          {summaryExpanded && (
            <div className="p-4 border-t border-[#3a3a3a]">
              <MarkdownSummary />
            </div>
          )}
        </div>
      </div>

      {/* Footer - Minimal */}
      <div className="border-t border-[#3a3a3a] py-3 mt-6">
        <div className="container mx-auto px-6">
          <p className="text-xs text-[#505050] text-center">
            Engine validated against Valcre workbook · 7/7 metrics exact match
          </p>
        </div>
      </div>
    </div>
  );
}
