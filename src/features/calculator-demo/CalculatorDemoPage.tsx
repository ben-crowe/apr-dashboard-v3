/**
 * Calculator Demo Page - Compact Excel-Style Layout
 *
 * Interactive demonstration of income capitalization calculator.
 * Features compact Excel-style inputs with property selector.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';
import InputPanel from './components/InputPanel';

export default function CalculatorDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="border-b bg-white dark:bg-slate-900 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Calculator className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Income Capitalization Calculator
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Compact Excel-style interface - select a property to load data
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Calculator</CardTitle>
              <CardDescription className="text-xs">
                Select a property or enter custom values
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InputPanel />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
