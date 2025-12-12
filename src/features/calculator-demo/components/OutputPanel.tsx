/**
 * Output Panel - 7 Key Validated Results
 *
 * Displays the calculated results in real-time:
 * 1. PGR (Potential Gross Revenue)
 * 2. Vacancy Loss
 * 3. EGR (Effective Gross Revenue)
 * 4. Total Expenses
 * 5. NOI (Net Operating Income)
 * 6. Raw Value (before rounding)
 * 7. Indicated Value (FINAL - must be $1,780,000 with test data)
 */

import { useReportBuilderStore } from '@/features/report-builder/store/reportBuilderStore';
import { Card } from '@/components/ui/card';
import { ArrowRight, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export default function OutputPanel() {
  const { sections } = useReportBuilderStore();

  const calcSection = sections.find(s => s.id === 'calc');

  const getFieldValue = (fieldId: string): number => {
    if (!calcSection) return 0;

    const field = calcSection.fields.find(f => f.id === fieldId);
    if (field) return Number(field.value) || 0;

    if (calcSection.subsections) {
      for (const sub of calcSection.subsections) {
        const subField = sub.fields.find(f => f.id === fieldId);
        if (subField) return Number(subField.value) || 0;
      }
    }
    return 0;
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  const ResultCard = ({
    label,
    value,
    icon: Icon,
    colorClass,
    subtitle,
  }: {
    label: string;
    value: string;
    icon: any;
    colorClass: string;
    subtitle?: string;
  }) => (
    <Card className={`p-4 border-l-4 ${colorClass}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Icon className="h-4 w-4 text-slate-600" />
            <p className="text-xs font-medium text-slate-600">{label}</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </Card>
  );

  const pgr = getFieldValue('calc-pgr');
  const vacancyLoss = getFieldValue('calc-vacancy-loss');
  const egr = getFieldValue('calc-egr');
  const expensesTotal = getFieldValue('calc-expenses-total');
  const expenseRatio = getFieldValue('calc-expense-ratio');
  const noi = getFieldValue('calc-noi');
  const noiPerUnit = getFieldValue('calc-noi-per-unit');
  const noiPerSf = getFieldValue('calc-noi-per-sf');
  const rawValue = getFieldValue('calc-raw-value');
  const indicatedValue = getFieldValue('calc-indicated-value');
  const valuePerUnit = getFieldValue('calc-value-per-unit');
  const valuePerSf = getFieldValue('calc-value-per-sf');
  const grm = getFieldValue('calc-grm');
  const totalUnits = getFieldValue('calc-total-units');

  return (
    <div className="space-y-4">
      {/* Flow Diagram */}
      <div className="flex items-center justify-center gap-3 py-4 bg-slate-50 rounded-lg mb-6">
        <div className="text-center">
          <p className="text-xs text-slate-600 mb-1">PGR</p>
          <p className="font-bold text-green-700">{formatCurrency(pgr)}</p>
        </div>
        <ArrowRight className="h-4 w-4 text-slate-400" />
        <div className="text-center">
          <p className="text-xs text-slate-600 mb-1">EGR</p>
          <p className="font-bold text-green-700">{formatCurrency(egr)}</p>
        </div>
        <ArrowRight className="h-4 w-4 text-slate-400" />
        <div className="text-center">
          <p className="text-xs text-slate-600 mb-1">NOI</p>
          <p className="font-bold text-blue-700">{formatCurrency(noi)}</p>
        </div>
        <ArrowRight className="h-4 w-4 text-slate-400" />
        <div className="text-center">
          <p className="text-xs text-slate-600 mb-1">Value</p>
          <p className="font-bold text-purple-700">{formatCurrency(indicatedValue)}</p>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* 1. PGR */}
        <ResultCard
          label="Potential Gross Revenue (PGR)"
          value={formatCurrency(pgr)}
          icon={TrendingUp}
          colorClass="border-l-green-500"
          subtitle="Total rental + other income"
        />

        {/* 2. Vacancy Loss */}
        <ResultCard
          label="Vacancy & Collection Loss"
          value={formatCurrency(vacancyLoss)}
          icon={TrendingDown}
          colorClass="border-l-red-500"
          subtitle="Total revenue loss"
        />

        {/* 3. EGR */}
        <ResultCard
          label="Effective Gross Revenue (EGR)"
          value={formatCurrency(egr)}
          icon={TrendingUp}
          colorClass="border-l-green-600"
          subtitle="PGR - Vacancy Loss"
        />

        {/* 4. Total Expenses */}
        <ResultCard
          label="Total Operating Expenses"
          value={formatCurrency(expensesTotal)}
          icon={TrendingDown}
          colorClass="border-l-red-600"
          subtitle={`Expense Ratio: ${formatPercent(expenseRatio)}`}
        />

        {/* 5. NOI */}
        <ResultCard
          label="Net Operating Income (NOI)"
          value={formatCurrency(noi)}
          icon={DollarSign}
          colorClass="border-l-blue-600"
          subtitle={`${formatCurrency(noiPerUnit)}/unit | $${noiPerSf.toFixed(2)}/SF`}
        />

        {/* 6. Raw Value */}
        <ResultCard
          label="Raw Capitalized Value"
          value={formatCurrency(rawValue)}
          icon={DollarSign}
          colorClass="border-l-purple-500"
          subtitle="Before rounding & adjustments"
        />

      </div>

      {/* 7. Final Indicated Value - Highlighted */}
      <Card className="p-6 border-2 border-purple-600 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <p className="text-sm font-medium text-slate-600 mb-2">FINAL INDICATED VALUE</p>
          <p className="text-5xl font-bold text-purple-900 mb-4">{formatCurrency(indicatedValue)}</p>
          <div className="flex justify-center gap-8 text-sm text-slate-700">
            <div>
              <p className="text-xs text-slate-500">Per Unit</p>
              <p className="font-semibold">{formatCurrency(valuePerUnit)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Per SF</p>
              <p className="font-semibold">${valuePerSf.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">GRM</p>
              <p className="font-semibold">{grm.toFixed(2)}</p>
            </div>
          </div>
          {totalUnits > 0 && indicatedValue === 1780000 && (
            <div className="mt-4 p-3 bg-green-100 border border-green-400 rounded-lg">
              <p className="text-sm font-semibold text-green-800">
                Validated: Matches expected $1,780,000 result
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
