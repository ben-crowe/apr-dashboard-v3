/**
 * Summary Accordions Component
 *
 * Two-column grid of collapsible sections for calculation details.
 * Compact tables with auto-width columns. Dark theme.
 */

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useReportBuilderStore } from '@/features/report-builder/store/reportBuilderStore';

interface AccordionSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function AccordionSection({ title, isOpen, onToggle, children }: AccordionSectionProps) {
  return (
    <div className="bg-[#262626] border border-[#3a3a3a] rounded-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-3 py-2 flex items-center gap-2 hover:bg-[#2e2e2e] transition-colors text-left"
      >
        {isOpen ? (
          <ChevronDown className="w-3.5 h-3.5 text-[#606060] flex-shrink-0" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-[#606060] flex-shrink-0" />
        )}
        <span className="text-xs font-medium text-[#909090]">{title}</span>
      </button>
      {isOpen && (
        <div className="px-3 pb-3 pt-1">
          {children}
        </div>
      )}
    </div>
  );
}

export default function MarkdownSummary() {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const { sections } = useReportBuilderStore();

  const calcSection = sections.find(s => s.id === 'calc');

  const toggleSection = (section: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

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

  const fmt = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const fmtNum = (value: number): string => value.toLocaleString('en-US');

  // Extract values
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

  // Compact table styling - auto width, tight spacing
  const tdLabel = "pr-4 py-0.5 text-[11px] text-[#808080] whitespace-nowrap";
  const tdValue = "py-0.5 text-[11px] text-[#e5e5e5] text-right whitespace-nowrap";
  const tdTotal = "pr-4 py-0.5 text-[11px] text-[#e5e5e5] font-medium whitespace-nowrap border-t border-[#3a3a3a]";
  const tdTotalValue = "py-0.5 text-[11px] text-[#e5e5e5] font-medium text-right whitespace-nowrap border-t border-[#3a3a3a]";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* Row 1: Income Analysis | Vacancy & Loss */}
      <AccordionSection
        title="Income Analysis"
        isOpen={openSections.has('income')}
        onToggle={() => toggleSection('income')}
      >
        <table className="text-[11px]">
          <tbody>
            <tr>
              <td className={tdLabel}>Total Units</td>
              <td className={tdValue}>{fmtNum(totalUnits)}</td>
            </tr>
            <tr>
              <td className={tdLabel}>Total SF</td>
              <td className={tdValue}>{fmtNum(totalSF)}</td>
            </tr>
            <tr>
              <td className={tdLabel}>Rental Revenue</td>
              <td className={tdValue}>{fmt(totalRentalRevenue)}/yr</td>
            </tr>
            <tr>
              <td className={tdLabel}>Other Income</td>
              <td className={tdValue}>{fmt(totalOtherIncome)}/yr</td>
            </tr>
            <tr>
              <td className={tdTotal}>PGR</td>
              <td className={tdTotalValue}>{fmt(pgr)}</td>
            </tr>
          </tbody>
        </table>
      </AccordionSection>

      <AccordionSection
        title="Vacancy & Loss"
        isOpen={openSections.has('vacancy')}
        onToggle={() => toggleSection('vacancy')}
      >
        <table className="text-[11px]">
          <tbody>
            <tr>
              <td className={tdLabel}>Vacancy</td>
              <td className={tdValue}>{vacancyRate.toFixed(2)}%</td>
              <td className={tdValue}>{fmt(pgr * (vacancyRate / 100))}</td>
            </tr>
            <tr>
              <td className={tdLabel}>Bad Debt</td>
              <td className={tdValue}>{badDebtRate.toFixed(2)}%</td>
              <td className={tdValue}>{fmt(pgr * (badDebtRate / 100))}</td>
            </tr>
            <tr>
              <td className={tdLabel}>Concessions</td>
              <td className={tdValue}>{concessionsRate.toFixed(2)}%</td>
              <td className={tdValue}>{fmt(pgr * (concessionsRate / 100))}</td>
            </tr>
            <tr>
              <td className={tdTotal}>Total Loss</td>
              <td className={tdTotalValue}>{totalVacancyRate.toFixed(2)}%</td>
              <td className={tdTotalValue}>{fmt(vacancyLoss)}</td>
            </tr>
            <tr>
              <td className={tdTotal}>EGR</td>
              <td className={tdTotalValue}></td>
              <td className={tdTotalValue}>{fmt(egr)}</td>
            </tr>
          </tbody>
        </table>
      </AccordionSection>

      {/* Row 2: Operating Expenses | Valuation */}
      <AccordionSection
        title="Operating Expenses"
        isOpen={openSections.has('expenses')}
        onToggle={() => toggleSection('expenses')}
      >
        <table className="text-[11px]">
          <tbody>
            <tr>
              <td className={tdLabel}>Management</td>
              <td className={tdValue}>{expManagement.toFixed(1)}%</td>
              <td className={tdValue}>{fmt(egr * (expManagement / 100))}</td>
            </tr>
            <tr>
              <td className={tdLabel}>Taxes</td>
              <td className={tdValue}>${expTaxes}/u</td>
              <td className={tdValue}>{fmt(expTaxes * totalUnits)}</td>
            </tr>
            <tr>
              <td className={tdLabel}>Insurance</td>
              <td className={tdValue}>${expInsurance}/u</td>
              <td className={tdValue}>{fmt(expInsurance * totalUnits)}</td>
            </tr>
            <tr>
              <td className={tdLabel}>Repairs</td>
              <td className={tdValue}>${expRepairs}/u</td>
              <td className={tdValue}>{fmt(expRepairs * totalUnits)}</td>
            </tr>
            <tr>
              <td className={tdLabel}>Utilities</td>
              <td className={tdValue}>${expUtilities}/u</td>
              <td className={tdValue}>{fmt(expUtilities * totalUnits)}</td>
            </tr>
            <tr>
              <td className={tdLabel}>Payroll</td>
              <td className={tdValue}>${expPayroll}/u</td>
              <td className={tdValue}>{fmt(expPayroll * totalUnits)}</td>
            </tr>
            {expAdmin > 0 && (
              <tr>
                <td className={tdLabel}>Admin</td>
                <td className={tdValue}>${expAdmin}/u</td>
                <td className={tdValue}>{fmt(expAdmin * totalUnits)}</td>
              </tr>
            )}
            {expReserves > 0 && (
              <tr>
                <td className={tdLabel}>Reserves</td>
                <td className={tdValue}>${expReserves}/u</td>
                <td className={tdValue}>{fmt(expReserves * totalUnits)}</td>
              </tr>
            )}
            {expOther > 0 && (
              <tr>
                <td className={tdLabel}>Other</td>
                <td className={tdValue}>${expOther}/u</td>
                <td className={tdValue}>{fmt(expOther * totalUnits)}</td>
              </tr>
            )}
            <tr>
              <td className={tdTotal}>Total</td>
              <td className={tdTotalValue}>{expenseRatio.toFixed(1)}%</td>
              <td className={tdTotalValue}>{fmt(expensesTotal)}</td>
            </tr>
          </tbody>
        </table>
      </AccordionSection>

      <AccordionSection
        title="Valuation"
        isOpen={openSections.has('valuation')}
        onToggle={() => toggleSection('valuation')}
      >
        <table className="text-[11px]">
          <tbody>
            <tr>
              <td className={tdLabel}>NOI</td>
              <td className={tdValue}>{fmt(noi)}</td>
            </tr>
            <tr>
              <td className={tdLabel}>Cap Rate</td>
              <td className={tdValue}>{capRate.toFixed(2)}%</td>
            </tr>
            <tr>
              <td className={tdLabel}>Raw Value</td>
              <td className={tdValue}>{fmt(rawValue)}</td>
            </tr>
            <tr>
              <td className={tdLabel}>Rounded</td>
              <td className={tdValue}>{fmt(roundedValue)}</td>
            </tr>
            {adjTotal !== 0 && (
              <tr>
                <td className={tdLabel}>Adjustments</td>
                <td className={tdValue}>{fmt(adjTotal)}</td>
              </tr>
            )}
            <tr>
              <td className={tdTotal}>Indicated Value</td>
              <td className={tdTotalValue}>{fmt(indicatedValue)}</td>
            </tr>
          </tbody>
        </table>
      </AccordionSection>
    </div>
  );
}
