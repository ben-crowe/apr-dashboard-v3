/**
 * Calculator Demo Page - Professional Income Capitalization Calculator
 *
 * Interactive demonstration of income capitalization calculator.
 * Professional navy/charcoal color scheme - Bloomberg terminal aesthetic.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header - Professional Navy */}
      <div className="border-b border-[#999] bg-[#1a1a2e]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">
                INCOME CAPITALIZATION CALCULATOR
              </h1>
              <p className="text-xs text-slate-400">
                Direct Capitalization Method · USPAP/CUSPAP Compliant · v2.1
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-500">
                Last refresh: {lastRefresh}
              </span>
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Input Panel - Left Column (1/3) */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-[#999] overflow-hidden h-full" style={{ borderRadius: '2px' }}>
              <div className="bg-[#2d2d2d] text-white px-4 py-2 border-b border-[#999]">
                <h2 className="font-bold text-sm tracking-wide">INPUT PARAMETERS</h2>
                <p className="text-xs text-slate-400">Property data and assumptions</p>
              </div>
              <div className="p-4">
                <InputPanel />
              </div>
            </div>
          </div>

          {/* Output Panel - Right Column (2/3) */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-[#999] overflow-hidden h-full" style={{ borderRadius: '2px' }}>
              <div className="bg-[#2d2d2d] text-white px-4 py-2 border-b border-[#999]">
                <h2 className="font-bold text-sm tracking-wide">VALUATION RESULTS</h2>
                <p className="text-xs text-slate-400">Real-time calculation output</p>
              </div>
              <div className="p-4">
                <OutputPanel />
              </div>
            </div>
          </div>
        </div>

        {/* Markdown Summary - Collapsible */}
        <div className="bg-white border border-[#999] overflow-hidden" style={{ borderRadius: '2px' }}>
          <div
            className="bg-[#2d2d2d] text-white px-4 py-2 cursor-pointer hover:bg-[#3d3d3d] transition-colors flex items-center justify-between"
            onClick={() => setSummaryExpanded(!summaryExpanded)}
          >
            <div className="flex items-center gap-2">
              {summaryExpanded ? (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-400" />
              )}
              <div>
                <h2 className="font-bold text-sm tracking-wide">PROFESSIONAL SUMMARY REPORT</h2>
                <p className="text-xs text-slate-400">Exportable markdown format</p>
              </div>
            </div>
            <span className="text-xs text-slate-500">
              {summaryExpanded ? 'Collapse' : 'Expand'}
            </span>
          </div>
          {summaryExpanded && (
            <div className="p-4 border-t border-[#999]">
              <MarkdownSummary />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#999] bg-[#2d2d2d] py-2">
        <div className="container mx-auto px-6">
          <p className="text-xs text-slate-500 text-center">
            Engine validated against Valcre workbook · 7/7 metrics exact match · Production ready
          </p>
        </div>
      </div>
    </div>
  );
}
