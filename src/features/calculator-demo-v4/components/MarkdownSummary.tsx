/**
 * Summary Cards Component
 *
 * Four cards in a row - all visible at a glance.
 * No accordions, no clicking. Dark theme.
 */

import { useReportBuilderStore } from '@/features/report-builder/store/reportBuilderStore';
import { useTheme } from '../context/ThemeContext';

export default function MarkdownSummary() {
  const { sections } = useReportBuilderStore();
  const { colors } = useTheme();
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
  const expensesTotal = getFieldValue('calc-expenses-total');
  const expenseRatio = getFieldValue('calc-expense-ratio');

  const noi = getFieldValue('calc-noi');
  const capRate = getFieldValue('calc-cap-rate');
  const rawValue = getFieldValue('calc-raw-value');
  const roundedValue = Math.round(rawValue / 10000) * 10000;
  const indicatedValue = getFieldValue('calc-indicated-value');

  // Card component
  const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div
      className="rounded-sm overflow-hidden"
      style={{
        backgroundColor: colors.panelBgAlt,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div
        className="px-4 py-2"
        style={{ borderBottom: `1px solid ${colors.border}` }}
      >
        <h3 className="text-sm font-medium" style={{ color: colors.textMuted }}>{title}</h3>
      </div>
      <div className="px-4 py-3">
        {children}
      </div>
    </div>
  );

  // Row component for label/value pairs
  const Row = ({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) => (
    <div className="flex justify-between items-baseline py-1">
      <span
        className="text-[14px]"
        style={{
          color: bold ? colors.textSecondary : colors.textMuted,
          fontWeight: bold ? 500 : 400,
        }}
      >
        {label}
      </span>
      <span
        className="text-[14px]"
        style={{
          color: bold ? colors.text : colors.textSecondary,
          fontWeight: bold ? 500 : 400,
        }}
      >
        {value}
      </span>
    </div>
  );

  // Divider
  const Divider = () => (
    <div className="my-2" style={{ borderTop: `1px solid ${colors.border}` }} />
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Income Analysis */}
      <Card title="Income Analysis">
        <Row label="Total Units" value={fmtNum(totalUnits)} />
        <Row label="Total SF" value={fmtNum(totalSF)} />
        <Row label="Rental Revenue" value={`${fmt(totalRentalRevenue)}/yr`} />
        <Row label="Other Income" value={`${fmt(totalOtherIncome)}/yr`} />
        <Divider />
        <Row label="PGR" value={fmt(pgr)} bold />
      </Card>

      {/* Vacancy & Loss */}
      <Card title="Vacancy & Loss">
        <Row label="Vacancy" value={`${vacancyRate.toFixed(1)}%`} />
        <Row label="Bad Debt" value={`${badDebtRate.toFixed(1)}%`} />
        <Row label="Concessions" value={`${concessionsRate.toFixed(1)}%`} />
        <Divider />
        <Row label="Total Loss" value={`${totalVacancyRate.toFixed(1)}%`} />
        <Row label="Loss Amount" value={`(${fmt(vacancyLoss)})`} />
        <Divider />
        <Row label="EGR" value={fmt(egr)} bold />
      </Card>

      {/* Operating Expenses */}
      <Card title="Operating Expenses">
        <Row label="Management" value={fmt(egr * (expManagement / 100))} />
        <Row label="Taxes" value={fmt(expTaxes * totalUnits)} />
        <Row label="Insurance" value={fmt(expInsurance * totalUnits)} />
        <Row label="Repairs" value={fmt(expRepairs * totalUnits)} />
        <Row label="Utilities" value={fmt(expUtilities * totalUnits)} />
        <Row label="Payroll" value={fmt(expPayroll * totalUnits)} />
        <Divider />
        <Row label="Total" value={fmt(expensesTotal)} bold />
        <Row label="OER" value={`${expenseRatio.toFixed(1)}%`} />
      </Card>

      {/* Valuation */}
      <Card title="Valuation">
        <Row label="NOI" value={fmt(noi)} />
        <Row label="Cap Rate" value={`${capRate.toFixed(2)}%`} />
        <Divider />
        <Row label="Raw Value" value={fmt(rawValue)} />
        <Row label="Rounded" value={fmt(roundedValue)} />
        <Divider />
        <Row label="Indicated Value" value={fmt(indicatedValue)} bold />
      </Card>
    </div>
  );
}
