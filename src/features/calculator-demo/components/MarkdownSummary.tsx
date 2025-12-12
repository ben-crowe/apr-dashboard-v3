/**
 * Markdown Summary Component
 *
 * Generates and displays a professional markdown-formatted calculation summary
 * Similar to validation report styling - clean, structured, and professional
 */

import { useReportBuilderStore } from '@/features/report-builder/store/reportBuilderStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownSummary() {
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

  const formatNumber = (value: number): string => {
    return value.toLocaleString('en-US');
  };

  // Extract all values
  const totalUnits = getFieldValue('calc-total-units');
  const totalSF = getFieldValue('calc-total-sf');
  const totalRentalRevenue = getFieldValue('calc-total-rental-revenue');
  const totalOtherIncome = getFieldValue('calc-total-other-income');
  const pgr = getFieldValue('calc-pgr');

  const vacancyRate = getFieldValue('calc-vacancy-rate');
  const badDebtRate = getFieldValue('calc-bad-debt-rate');
  const concessionsRate = getFieldValue('calc-concessions-rate');
  const totalVacancyRate = vacancyRate + badDebtRate + concessionsRate;
  const vacancyLoss = getFieldValue('calc-vacancy-loss');
  const egr = getFieldValue('calc-egr');

  const expManagement = getFieldValue('calc-exp-management');
  const expTaxes = getFieldValue('calc-exp-taxes');
  const expInsurance = getFieldValue('calc-exp-insurance');
  const expRepairs = getFieldValue('calc-exp-repairs');
  const expUtilities = getFieldValue('calc-exp-utilities');
  const expPayroll = getFieldValue('calc-exp-payroll');
  const expAdmin = getFieldValue('calc-exp-admin');
  const expReserves = getFieldValue('calc-exp-reserves');
  const expOther = getFieldValue('calc-exp-other');
  const expensesTotal = getFieldValue('calc-expenses-total');
  const expenseRatio = getFieldValue('calc-expense-ratio');

  const noi = getFieldValue('calc-noi');
  const capRate = getFieldValue('calc-cap-rate');
  const rawValue = getFieldValue('calc-raw-value');
  const roundedValue = Math.round(rawValue / 10000) * 10000;
  const adjTotal = getFieldValue('calc-adj-total');
  const indicatedValue = getFieldValue('calc-indicated-value');

  // Generate markdown content
  const markdownContent = `## Calculation Summary

**Property:** Multi-Family Income Property
**Calculation Date:** ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
**Indicated Value:** ${formatCurrency(indicatedValue)}

---

### Income Analysis

| Metric | Value |
|--------|-------|
| Total Units | ${formatNumber(totalUnits)} |
| Total SF | ${formatNumber(totalSF)} |
| Rental Revenue | ${formatCurrency(totalRentalRevenue)}/year |
| Other Income | ${formatCurrency(totalOtherIncome)}/year |
| **Potential Gross Revenue** | **${formatCurrency(pgr)}** |

### Vacancy & Loss

| Rate Type | Percentage | Amount |
|-----------|------------|--------|
| Vacancy | ${vacancyRate.toFixed(2)}% | ${formatCurrency(pgr * (vacancyRate / 100))} |
| Bad Debt | ${badDebtRate.toFixed(2)}% | ${formatCurrency(pgr * (badDebtRate / 100))} |
| Concessions | ${concessionsRate.toFixed(2)}% | ${formatCurrency(pgr * (concessionsRate / 100))} |
| **Total Loss** | **${totalVacancyRate.toFixed(2)}%** | **${formatCurrency(vacancyLoss)}** |
| **Effective Gross Revenue** | | **${formatCurrency(egr)}** |

### Operating Expenses

| Expense | Calculation | Amount |
|---------|-------------|--------|
| Management | ${expManagement.toFixed(2)}% of EGR | ${formatCurrency(egr * (expManagement / 100))} |
| Taxes | ${formatCurrency(expTaxes)}/unit × ${totalUnits} units | ${formatCurrency(expTaxes * totalUnits)} |
| Insurance | ${formatCurrency(expInsurance)}/unit × ${totalUnits} units | ${formatCurrency(expInsurance * totalUnits)} |
| Repairs | ${formatCurrency(expRepairs)}/unit × ${totalUnits} units | ${formatCurrency(expRepairs * totalUnits)} |
| Utilities | ${formatCurrency(expUtilities)}/unit × ${totalUnits} units | ${formatCurrency(expUtilities * totalUnits)} |
| Payroll | ${formatCurrency(expPayroll)}/unit × ${totalUnits} units | ${formatCurrency(expPayroll * totalUnits)} |
| Admin | ${formatCurrency(expAdmin)}/unit × ${totalUnits} units | ${formatCurrency(expAdmin * totalUnits)} |
| Reserves | ${formatCurrency(expReserves)}/unit × ${totalUnits} units | ${formatCurrency(expReserves * totalUnits)} |
| Other | ${formatCurrency(expOther)}/unit × ${totalUnits} units | ${formatCurrency(expOther * totalUnits)} |
| **Total Expenses** | | **${formatCurrency(expensesTotal)}** |
| **Expense Ratio** | | **${expenseRatio.toFixed(2)}%** |

### Valuation

| Step | Calculation | Result |
|------|-------------|--------|
| NOI | EGR - Expenses | ${formatCurrency(noi)} |
| Cap Rate | | ${capRate.toFixed(2)}% |
| Raw Value | NOI ÷ Cap Rate | ${formatCurrency(rawValue)} |
| Rounded | to $10,000 | ${formatCurrency(roundedValue)} |
| Adjustments | | ${formatCurrency(adjTotal)} |
| **Indicated Value** | | **${formatCurrency(indicatedValue)}** |

---

*Calculated using Direct Capitalization Method per USPAP/CUSPAP standards*
`;

  return (
    <div className="prose prose-sm max-w-none">
      <style>{`
        .prose h2 {
          color: #1e293b;
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 0.5rem;
        }

        .prose h3 {
          color: #334155;
          font-size: 1.125rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          background: #f8fafc;
          padding: 0.5rem 0.75rem;
          border-left: 4px solid #3b82f6;
        }

        .prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
          font-size: 0.875rem;
        }

        .prose thead {
          background: #1e293b;
          color: white;
        }

        .prose th {
          padding: 0.75rem;
          text-align: left;
          font-weight: 600;
          border: 1px solid #cbd5e1;
        }

        .prose td {
          padding: 0.5rem 0.75rem;
          border: 1px solid #cbd5e1;
        }

        .prose tbody tr:nth-child(even) {
          background: #f8fafc;
        }

        .prose tbody tr:hover {
          background: #f1f5f9;
        }

        .prose strong {
          color: #1e293b;
          font-weight: 700;
        }

        .prose hr {
          border-top: 2px solid #e2e8f0;
          margin: 1.5rem 0;
        }

        .prose em {
          color: #64748b;
          font-size: 0.875rem;
        }

        .prose p {
          line-height: 1.6;
          margin: 0.5rem 0;
        }
      `}</style>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
}
