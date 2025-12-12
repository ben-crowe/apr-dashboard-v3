/**
 * Summary Accordions Component
 *
 * Individual collapsible sections for calculation details.
 * Dark theme matching the rest of the calculator interface.
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
    <div className="border-b border-[#3a3a3a] last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full px-3 py-2 flex items-center gap-2 hover:bg-[#333] transition-colors text-left"
      >
        {isOpen ? (
          <ChevronDown className="w-3.5 h-3.5 text-[#606060] flex-shrink-0" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-[#606060] flex-shrink-0" />
        )}
        <span className="text-xs font-medium text-[#909090]">{title}</span>
      </button>
      {isOpen && (
        <div className="px-3 pb-3">
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

  // Table styling
  const tableClass = "w-full text-[11px]";
  const thClass = "px-2 py-1 text-left text-[#707070] font-normal border-b border-[#3a3a3a]";
  const tdClass = "px-2 py-1 text-[#909090] border-b border-[#3a3a3a]";
  const tdValueClass = "px-2 py-1 text-[#e5e5e5] text-right border-b border-[#3a3a3a]";
  const tdBoldClass = "px-2 py-1 text-[#e5e5e5] font-medium border-b border-[#3a3a3a]";

  return (
    <div className="bg-[#232323] rounded-sm">
      {/* Income Analysis */}
      <AccordionSection
        title="Income Analysis"
        isOpen={openSections.has('income')}
        onToggle={() => toggleSection('income')}
      >
        <table className={tableClass}>
          <tbody>
            <tr>
              <td className={tdClass}>Total Units</td>
              <td className={tdValueClass}>{fmtNum(totalUnits)}</td>
            </tr>
            <tr>
              <td className={tdClass}>Total SF</td>
              <td className={tdValueClass}>{fmtNum(totalSF)}</td>
            </tr>
            <tr>
              <td className={tdClass}>Rental Revenue</td>
              <td className={tdValueClass}>{fmt(totalRentalRevenue)}/yr</td>
            </tr>
            <tr>
              <td className={tdClass}>Other Income</td>
              <td className={tdValueClass}>{fmt(totalOtherIncome)}/yr</td>
            </tr>
            <tr>
              <td className={tdBoldClass}>Potential Gross Revenue</td>
              <td className={`${tdValueClass} font-medium`}>{fmt(pgr)}</td>
            </tr>
          </tbody>
        </table>
      </AccordionSection>

      {/* Vacancy & Loss */}
      <AccordionSection
        title="Vacancy & Loss"
        isOpen={openSections.has('vacancy')}
        onToggle={() => toggleSection('vacancy')}
      >
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass}>Type</th>
              <th className={`${thClass} text-right`}>Rate</th>
              <th className={`${thClass} text-right`}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={tdClass}>Vacancy</td>
              <td className={tdValueClass}>{vacancyRate.toFixed(2)}%</td>
              <td className={tdValueClass}>{fmt(pgr * (vacancyRate / 100))}</td>
            </tr>
            <tr>
              <td className={tdClass}>Bad Debt</td>
              <td className={tdValueClass}>{badDebtRate.toFixed(2)}%</td>
              <td className={tdValueClass}>{fmt(pgr * (badDebtRate / 100))}</td>
            </tr>
            <tr>
              <td className={tdClass}>Concessions</td>
              <td className={tdValueClass}>{concessionsRate.toFixed(2)}%</td>
              <td className={tdValueClass}>{fmt(pgr * (concessionsRate / 100))}</td>
            </tr>
            <tr>
              <td className={tdBoldClass}>Total Loss</td>
              <td className={`${tdValueClass} font-medium`}>{totalVacancyRate.toFixed(2)}%</td>
              <td className={`${tdValueClass} font-medium`}>{fmt(vacancyLoss)}</td>
            </tr>
            <tr>
              <td className={tdBoldClass}>Effective Gross Revenue</td>
              <td className={tdValueClass}></td>
              <td className={`${tdValueClass} font-medium`}>{fmt(egr)}</td>
            </tr>
          </tbody>
        </table>
      </AccordionSection>

      {/* Operating Expenses */}
      <AccordionSection
        title="Operating Expenses"
        isOpen={openSections.has('expenses')}
        onToggle={() => toggleSection('expenses')}
      >
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass}>Expense</th>
              <th className={`${thClass} text-right`}>Calculation</th>
              <th className={`${thClass} text-right`}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={tdClass}>Management</td>
              <td className={tdValueClass}>{expManagement.toFixed(2)}% of EGR</td>
              <td className={tdValueClass}>{fmt(egr * (expManagement / 100))}</td>
            </tr>
            <tr>
              <td className={tdClass}>Taxes</td>
              <td className={tdValueClass}>{fmt(expTaxes)}/unit</td>
              <td className={tdValueClass}>{fmt(expTaxes * totalUnits)}</td>
            </tr>
            <tr>
              <td className={tdClass}>Insurance</td>
              <td className={tdValueClass}>{fmt(expInsurance)}/unit</td>
              <td className={tdValueClass}>{fmt(expInsurance * totalUnits)}</td>
            </tr>
            <tr>
              <td className={tdClass}>Repairs</td>
              <td className={tdValueClass}>{fmt(expRepairs)}/unit</td>
              <td className={tdValueClass}>{fmt(expRepairs * totalUnits)}</td>
            </tr>
            <tr>
              <td className={tdClass}>Utilities</td>
              <td className={tdValueClass}>{fmt(expUtilities)}/unit</td>
              <td className={tdValueClass}>{fmt(expUtilities * totalUnits)}</td>
            </tr>
            <tr>
              <td className={tdClass}>Payroll</td>
              <td className={tdValueClass}>{fmt(expPayroll)}/unit</td>
              <td className={tdValueClass}>{fmt(expPayroll * totalUnits)}</td>
            </tr>
            {expAdmin > 0 && (
              <tr>
                <td className={tdClass}>Admin</td>
                <td className={tdValueClass}>{fmt(expAdmin)}/unit</td>
                <td className={tdValueClass}>{fmt(expAdmin * totalUnits)}</td>
              </tr>
            )}
            {expReserves > 0 && (
              <tr>
                <td className={tdClass}>Reserves</td>
                <td className={tdValueClass}>{fmt(expReserves)}/unit</td>
                <td className={tdValueClass}>{fmt(expReserves * totalUnits)}</td>
              </tr>
            )}
            {expOther > 0 && (
              <tr>
                <td className={tdClass}>Other</td>
                <td className={tdValueClass}>{fmt(expOther)}/unit</td>
                <td className={tdValueClass}>{fmt(expOther * totalUnits)}</td>
              </tr>
            )}
            <tr>
              <td className={tdBoldClass}>Total Expenses</td>
              <td className={`${tdValueClass} font-medium`}>{expenseRatio.toFixed(1)}% OER</td>
              <td className={`${tdValueClass} font-medium`}>{fmt(expensesTotal)}</td>
            </tr>
          </tbody>
        </table>
      </AccordionSection>

      {/* Valuation */}
      <AccordionSection
        title="Valuation"
        isOpen={openSections.has('valuation')}
        onToggle={() => toggleSection('valuation')}
      >
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass}>Step</th>
              <th className={`${thClass} text-right`}>Calculation</th>
              <th className={`${thClass} text-right`}>Result</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={tdClass}>NOI</td>
              <td className={tdValueClass}>EGR - Expenses</td>
              <td className={tdValueClass}>{fmt(noi)}</td>
            </tr>
            <tr>
              <td className={tdClass}>Cap Rate</td>
              <td className={tdValueClass}></td>
              <td className={tdValueClass}>{capRate.toFixed(2)}%</td>
            </tr>
            <tr>
              <td className={tdClass}>Raw Value</td>
              <td className={tdValueClass}>NOI ÷ Cap Rate</td>
              <td className={tdValueClass}>{fmt(rawValue)}</td>
            </tr>
            <tr>
              <td className={tdClass}>Rounded</td>
              <td className={tdValueClass}>to $10,000</td>
              <td className={tdValueClass}>{fmt(roundedValue)}</td>
            </tr>
            {adjTotal !== 0 && (
              <tr>
                <td className={tdClass}>Adjustments</td>
                <td className={tdValueClass}></td>
                <td className={tdValueClass}>{fmt(adjTotal)}</td>
              </tr>
            )}
            <tr>
              <td className={tdBoldClass}>Indicated Value</td>
              <td className={tdValueClass}></td>
              <td className={`${tdValueClass} font-medium text-[#e5e5e5]`}>{fmt(indicatedValue)}</td>
            </tr>
          </tbody>
        </table>
      </AccordionSection>
    </div>
  );
}
