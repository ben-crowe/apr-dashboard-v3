/**
 * Calculator Demo Page - Redesigned with Compact Layout
 *
 * Interactive demonstration of the validated income capitalization calculator.
 * Features compact Excel-style inputs and markdown summary output
 *
 * CRITICAL: Uses validated calculator engine from reportBuilderStore
 * DO NOT modify the calculation logic - import and use only
 */

import { useEffect } from 'react';
import { useReportBuilderStore } from '../report-builder/store/reportBuilderStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';
import MarkdownSummary from './components/MarkdownSummary';

export default function CalculatorDemoPage() {
  const { loadFullTestData, runCalculations, sections } = useReportBuilderStore();

  // Run calculations on mount only
  useEffect(() => {
    runCalculations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadTestData = () => {
    loadFullTestData();
    runCalculations();
  };

  const handleReset = () => {
    // Reset all calculator fields to 0
    const calcSection = sections.find(s => s.id === 'calc');
    if (calcSection) {
      calcSection.fields.forEach(field => {
        useReportBuilderStore.getState().updateFieldValue(field.id, 0);
      });
      if (calcSection.subsections) {
        calcSection.subsections.forEach(sub => {
          sub.fields.forEach(field => {
            useReportBuilderStore.getState().updateFieldValue(field.id, 0);
          });
        });
      }
    }
    runCalculations();
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
                  Compact Excel-style interface with markdown summary export
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-slate-300 rounded bg-white hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleLoadTestData}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium transition-colors"
              >
                Load Test Data
              </button>
            </div>
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
                  Excel-style tables for all 62 fields
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
                  7 key metrics calculated in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OutputPanel />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Markdown Summary - Full Width */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Professional Summary Report</CardTitle>
            <CardDescription className="text-xs">
              Markdown-formatted calculation breakdown ready for export
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MarkdownSummary />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
