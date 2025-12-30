/**
 * Operating History Panel - YTD vs Projection Comparison
 *
 * Shows Operating History with editable YTD values and read-only Projections.
 * YTD columns: Total (editable), $/Unit (calculated), %PGR (calculated)
 * Projection columns: Total, $/Unit, %PGR (all read-only from calc-* fields)
 */

import { useReportBuilderStore } from '@/features/report-builder/store/reportBuilderStore';
import { Input } from '@/components/ui/input';
import { useTheme } from '../context/ThemeContext';

export default function OperatingHistoryPanel() {
  const { colors } = useTheme();
  const sections = useReportBuilderStore(state => state.sections);
  const updateFieldValue = useReportBuilderStore(state => state.updateFieldValue);
  const runCalculations = useReportBuilderStore(state => state.runCalculations);

  // Helper to get field value from any section
  const getFieldValue = (fieldId: string): any => {
    for (const section of sections) {
      const field = section.fields?.find((f: any) => f.id === fieldId);
      if (field) return field.value;
      if (section.subsections) {
        for (const sub of section.subsections) {
          const subField = sub.fields?.find((f: any) => f.id === fieldId);
          if (subField) return subField.value;
        }
      }
    }
    return '';
  };

  // Helper to get numeric field value
  const getFieldValueNumber = (fieldId: string): number => {
    return Number(getFieldValue(fieldId)) || 0;
  };

  // Update field and trigger recalculation
  const updateField = (fieldId: string, value: string | number) => {
    updateFieldValue(fieldId, value);
    setTimeout(() => runCalculations(), 0);
  };

  // Get total units for per-unit calculations (default to 16 if not set)
  const totalUnits = getFieldValueNumber('calc-total-units') || 16;

  // ===== YTD VALUES (editable) =====
  // Revenue
  const histRevenueMultifamily = getFieldValueNumber('hist-revenue-multifamily-total');
  const histRevenueParking = getFieldValueNumber('hist-revenue-parking-total');
  const histRevenueLaundry = getFieldValueNumber('hist-revenue-laundry-total');
  const histRevenueMisc = getFieldValueNumber('hist-revenue-misc-total');
  const histPgr = getFieldValueNumber('hist-pgr-total');

  // Vacancy
  const histVacancy = getFieldValueNumber('hist-vacancy-total');
  const histEgr = getFieldValueNumber('hist-egr-total');

  // Expenses
  const histExpTaxes = getFieldValueNumber('hist-exp-taxes-total');
  const histExpInsurance = getFieldValueNumber('hist-exp-insurance-total');
  const histExpRepairs = getFieldValueNumber('hist-exp-repairs-total');
  const histExpPayroll = getFieldValueNumber('hist-exp-payroll-total');
  const histExpUtilities = getFieldValueNumber('hist-exp-utilities-total');
  const histExpManagement = getFieldValueNumber('hist-exp-management-total');
  const histExpOther = getFieldValueNumber('hist-exp-other-total');
  const histExpTotal = getFieldValueNumber('hist-exp-total-total');

  // NOI
  const histNoi = getFieldValueNumber('hist-noi-total');

  // ===== PROJECTION VALUES (read-only) =====
  const projRentalRevenue = getFieldValueNumber('calc-total-rental-revenue');
  const projOtherIncome = getFieldValueNumber('calc-other-income');
  const projPgr = getFieldValueNumber('calc-pgr');
  const projVacancy = getFieldValueNumber('calc-vacancy-loss');
  const projEgr = getFieldValueNumber('calc-egr');
  const projExpTaxes = getFieldValueNumber('calc-exp-taxes-annual');
  const projExpInsurance = getFieldValueNumber('calc-exp-insurance-annual');
  const projExpRepairs = getFieldValueNumber('calc-exp-repairs-annual');
  const projExpPayroll = getFieldValueNumber('calc-exp-payroll-annual');
  const projExpUtilities = getFieldValueNumber('calc-exp-utilities-annual');
  const projExpManagement = getFieldValueNumber('calc-exp-management-annual');
  const projExpOther = getFieldValueNumber('calc-exp-other-annual');
  const projExpTotal = getFieldValueNumber('calc-expenses-total');
  const projNoi = getFieldValueNumber('calc-noi');

  // ===== CALCULATED VALUES =====
  // YTD $/Unit calculations
  const calcPerUnit = (total: number) => totalUnits > 0 ? total / totalUnits : 0;

  // YTD %PGR calculations (percentage of PGR)
  const calcPctPGR = (total: number, pgr: number) => pgr > 0 ? (total / pgr) * 100 : 0;

  // Projection $/Unit calculations
  const projPerUnit = (total: number) => totalUnits > 0 ? total / totalUnits : 0;

  // Projection %PGR calculations
  const projPctPGR = (total: number) => projPgr > 0 ? (total / projPgr) * 100 : 0;

  // Formatters
  const formatCurrency = (n: number) => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  const formatPercentage = (n: number) => n.toFixed(1) + '%';

  const inputStyle = {
    backgroundColor: colors.inputBg,
    borderColor: colors.border,
    color: colors.text,
  };

  // Render an editable YTD row
  const renderYtdRow = (
    label: string,
    ytdFieldId: string,
    ytdValue: number,
    projValue: number | null,
    isBold: boolean = false
  ) => {
    const ytdPerUnit = calcPerUnit(ytdValue);
    const ytdPctPgr = calcPctPGR(ytdValue, histPgr);
    const projPerUnitVal = projValue !== null ? projPerUnit(projValue) : 0;
    const projPctPgrVal = projValue !== null ? projPctPGR(projValue) : 0;

    const textStyle = isBold
      ? { color: colors.text, fontWeight: 500 }
      : { color: colors.textMuted };
    const valueStyle = isBold
      ? { color: colors.text, fontWeight: 500 }
      : { color: colors.text };

    return (
      <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
        <td className="px-2 py-1" style={textStyle}>{label}</td>
        {/* YTD Total - Editable */}
        <td className="px-2 py-1 text-right">
          <Input
            type="number"
            value={ytdValue || ''}
            onChange={e => updateField(ytdFieldId, parseFloat(e.target.value) || 0)}
            className="h-6 w-24 text-right text-xs p-1 ml-auto"
            style={inputStyle}
          />
        </td>
        {/* YTD $/Unit - Calculated */}
        <td className="px-2 py-1 text-right" style={valueStyle}>{formatCurrency(ytdPerUnit)}</td>
        {/* YTD %PGR - Calculated */}
        <td className="px-2 py-1 text-right" style={valueStyle}>{formatPercentage(ytdPctPgr)}</td>
        {/* Proj Total - Read-only */}
        <td className="px-2 py-1 text-right" style={valueStyle}>
          {projValue !== null ? formatCurrency(projValue) : '-'}
        </td>
        {/* Proj $/Unit - Calculated */}
        <td className="px-2 py-1 text-right" style={valueStyle}>
          {projValue !== null ? formatCurrency(projPerUnitVal) : '-'}
        </td>
        {/* Proj %PGR - Calculated */}
        <td className="px-2 py-1 text-right" style={valueStyle}>
          {projValue !== null ? formatPercentage(projPctPgrVal) : '-'}
        </td>
      </tr>
    );
  };

  // Render a summary row (bold, double border on top)
  const renderSummaryRow = (
    label: string,
    ytdFieldId: string,
    ytdValue: number,
    projValue: number,
    isPgr: boolean = false
  ) => {
    const ytdPerUnit = calcPerUnit(ytdValue);
    const ytdPctPgr = isPgr ? 100 : calcPctPGR(ytdValue, histPgr);
    const projPerUnitVal = projPerUnit(projValue);
    const projPctPgrVal = isPgr ? 100 : projPctPGR(projValue);

    return (
      <tr style={{ borderBottom: `2px solid ${colors.border}` }}>
        <td className="px-2 py-1 font-medium" style={{ color: colors.text }}>{label}</td>
        <td className="px-2 py-1 text-right">
          <Input
            type="number"
            value={ytdValue || ''}
            onChange={e => updateField(ytdFieldId, parseFloat(e.target.value) || 0)}
            className="h-6 w-24 text-right text-xs p-1 ml-auto font-medium"
            style={inputStyle}
          />
        </td>
        <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(ytdPerUnit)}</td>
        <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatPercentage(ytdPctPgr)}</td>
        <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(projValue)}</td>
        <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(projPerUnitVal)}</td>
        <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatPercentage(projPctPgrVal)}</td>
      </tr>
    );
  };

  // Render a display-only row (no input, for calculated totals)
  const renderDisplayRow = (
    label: string,
    ytdValue: number,
    projValue: number,
    isPgr: boolean = false
  ) => {
    const ytdPerUnit = calcPerUnit(ytdValue);
    const ytdPctPgr = isPgr ? 100 : calcPctPGR(ytdValue, histPgr);
    const projPerUnitVal = projPerUnit(projValue);
    const projPctPgrVal = isPgr ? 100 : projPctPGR(projValue);

    return (
      <tr style={{ borderBottom: `2px solid ${colors.border}` }}>
        <td className="px-2 py-1 font-medium" style={{ color: colors.text }}>{label}</td>
        <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(ytdValue)}</td>
        <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(ytdPerUnit)}</td>
        <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatPercentage(ytdPctPgr)}</td>
        <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(projValue)}</td>
        <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatCurrency(projPerUnitVal)}</td>
        <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>{formatPercentage(projPctPgrVal)}</td>
      </tr>
    );
  };

  return (
    <div className="space-y-3 text-xs" style={{ color: colors.text }}>
      {/* OPERATING HISTORY TABLE */}
      <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
        <div className="px-2 py-1.5" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
            Operating History - YTD vs Projection
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px]">
            <thead style={{ borderBottom: `1px solid ${colors.border}` }}>
              <tr>
                <th className="px-2 py-1 text-left font-normal" style={{ color: colors.textMuted }}>Category</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>YTD Total</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>YTD $/Unit</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>YTD %PGR</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>Proj Total</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>Proj $/Unit</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>Proj %PGR</th>
              </tr>
            </thead>
            <tbody>
              {/* REVENUE SECTION */}
              <tr>
                <td colSpan={7} className="px-2 py-1 font-medium" style={{ color: colors.text, backgroundColor: colors.panelBgAlt }}>
                  REVENUE
                </td>
              </tr>
              {renderYtdRow('Total Multifamily Revenue', 'hist-revenue-multifamily-total', histRevenueMultifamily, projRentalRevenue)}
              {renderYtdRow('Parking Income', 'hist-revenue-parking-total', histRevenueParking, null)}
              {renderYtdRow('Laundry', 'hist-revenue-laundry-total', histRevenueLaundry, null)}
              {renderSummaryRow('TOTAL MISC REVENUE', 'hist-revenue-misc-total', histRevenueMisc, projOtherIncome)}
              {renderSummaryRow('PGR', 'hist-pgr-total', histPgr, projPgr, true)}

              {/* VACANCY SECTION */}
              <tr>
                <td colSpan={7} className="px-2 py-1 font-medium" style={{ color: colors.text, backgroundColor: colors.panelBgAlt }}>
                  VACANCY
                </td>
              </tr>
              {renderYtdRow('Vacancy', 'hist-vacancy-total', histVacancy, projVacancy)}
              {renderSummaryRow('EGR', 'hist-egr-total', histEgr, projEgr)}

              {/* EXPENSES SECTION */}
              <tr>
                <td colSpan={7} className="px-2 py-1 font-medium" style={{ color: colors.text, backgroundColor: colors.panelBgAlt }}>
                  EXPENSES
                </td>
              </tr>
              {renderYtdRow('Taxes', 'hist-exp-taxes-total', histExpTaxes, projExpTaxes)}
              {renderYtdRow('Insurance', 'hist-exp-insurance-total', histExpInsurance, projExpInsurance)}
              {renderYtdRow('Repairs', 'hist-exp-repairs-total', histExpRepairs, projExpRepairs)}
              {renderYtdRow('Payroll', 'hist-exp-payroll-total', histExpPayroll, projExpPayroll)}
              {renderYtdRow('Utilities', 'hist-exp-utilities-total', histExpUtilities, projExpUtilities)}
              {renderYtdRow('Management', 'hist-exp-management-total', histExpManagement, projExpManagement)}
              {renderYtdRow('Other', 'hist-exp-other-total', histExpOther, projExpOther)}
              {renderSummaryRow('TOTAL EXPENSES', 'hist-exp-total-total', histExpTotal, projExpTotal)}

              {/* NOI SECTION */}
              <tr>
                <td colSpan={7} className="px-2 py-1 font-medium" style={{ color: colors.text, backgroundColor: colors.panelBgAlt }}>
                  NET OPERATING INCOME
                </td>
              </tr>
              {renderSummaryRow('NOI', 'hist-noi-total', histNoi, projNoi)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
