/**
 * Calculator Demo Page - Compact Excel-Style Layout
 *
 * Interactive demonstration of income capitalization calculator.
 * Features compact Excel-style inputs with property selector.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, RefreshCw, ChevronDown, ChevronRight } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="border-b bg-white dark:bg-slate-900 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calculator className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Income Capitalization Calculator
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  v2.0 Store Connected | Last refresh: {lastRefresh}
                </p>
              </div>
            </div>
            <Button onClick={handleRefresh} variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Hard Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Input Panel - Left Column (1/3) */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Input Parameters</CardTitle>
                <CardDescription className="text-xs">
                  Excel-style tables for all fields
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InputPanel />
              </CardContent>
            </Card>
          </div>

          {/* Output Panel - Right Column (2/3) */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Results</CardTitle>
                <CardDescription className="text-xs">
                  Key metrics calculated in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OutputPanel />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Markdown Summary - Collapsible Accordion */}
        <Card className="shadow-lg">
          <CardHeader
            className="cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={() => setSummaryExpanded(!summaryExpanded)}
          >
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {summaryExpanded ? (
                    <ChevronDown className="h-5 w-5 text-slate-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-slate-500" />
                  )}
                  Professional Summary Report
                </CardTitle>
                <CardDescription className="text-xs ml-7">
                  Markdown-formatted calculation breakdown ready for export
                </CardDescription>
              </div>
              <span className="text-xs text-slate-400">
                {summaryExpanded ? 'Click to collapse' : 'Click to expand'}
              </span>
            </div>
          </CardHeader>
          {summaryExpanded && (
            <CardContent>
              <MarkdownSummary />
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
