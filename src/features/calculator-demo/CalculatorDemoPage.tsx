/**
 * Calculator Demo Page
 *
 * Interactive demonstration of the validated income capitalization calculator.
 * Features 3-panel layout: Input | Output | Walkthrough
 *
 * CRITICAL: Uses validated calculator engine from reportBuilderStore
 * DO NOT modify the calculation logic - import and use only
 */

import { useEffect } from 'react';
import { useReportBuilderStore } from '../report-builder/store/reportBuilderStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, RotateCcw, Upload } from 'lucide-react';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';
import WalkthroughPanel from './components/WalkthroughPanel';

export default function CalculatorDemoPage() {
  const { loadFullTestData, runCalculations, sections } = useReportBuilderStore();

  // Run calculations on mount and whenever store changes
  useEffect(() => {
    runCalculations();
  }, [runCalculations]);

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
                  Interactive demonstration with step-by-step transparency
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleLoadTestData}>
                <Upload className="h-4 w-4 mr-2" />
                Load Test Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 3 Panel Layout */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Input Parameters</CardTitle>
                <CardDescription>
                  62 calculator fields organized in sections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InputPanel />
              </CardContent>
            </Card>
          </div>

          {/* Output Panel */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Results</CardTitle>
                <CardDescription>
                  7 key metrics calculated in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OutputPanel />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Walkthrough Panel - Full Width */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Calculation Walkthrough</CardTitle>
            <CardDescription>
              Step-by-step breakdown showing HOW each result is calculated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WalkthroughPanel />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
