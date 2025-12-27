/*
 * Cost Approach Panel - Table Layout
 *
 * Uses store for all cost approach data.
 * Calculations run automatically via runCostApproachCalculations() in store.
 * Table format with 5 columns and totals at bottom of each column.
 */

import { useEffect } from 'react';
import { useReportBuilderStore } from '@/features/report-builder/store/reportBuilderStore';
import { Input } from '@/components/ui/input';
import { useTheme } from '../context/ThemeContext';

interface CostApproachPanelProps {
  onValueChange?: (value: number) => void;
}

export default function CostApproachPanel({ onValueChange }: CostApproachPanelProps) {
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

  // Get all values from store
  const landSF = getFieldValueNumber('cost-land-sf');
  const landRatePerSF = getFieldValueNumber('cost-land-rate-per-sf');
  const landValue = getFieldValueNumber('cost-land-value');

  const rcnGBA = getFieldValueNumber('cost-rcn-gba');
  const rcnRatePerSF = getFieldValueNumber('cost-rcn-rate-per-sf');
  const rcnIndirectPct = getFieldValueNumber('cost-rcn-indirect-pct');
  const rcnEntrepreneurPct = getFieldValueNumber('cost-rcn-entrepreneur-pct');
  const rcnDirectCosts = getFieldValueNumber('cost-rcn-direct-costs');
  const rcnIndirectCosts = getFieldValueNumber('cost-rcn-indirect-costs');
  const rcnEntrepreneurAmt = getFieldValueNumber('cost-rcn-entrepreneur-amt');
  const rcnTotal = getFieldValueNumber('cost-rcn-total');

  const deprPhysicalAge = getFieldValueNumber('cost-depr-physical-age');
  const deprPhysicalLife = getFieldValueNumber('cost-depr-physical-life');
  const deprPhysicalEffectiveAge = getFieldValueNumber('cost-depr-physical-effective-age');
  const deprPhysicalRemainingLife = getFieldValueNumber('cost-depr-physical-remaining-life');
  const deprPhysicalPct = getFieldValueNumber('cost-depr-physical-pct');
  const deprPhysicalAmt = getFieldValueNumber('cost-depr-physical-amt');
  const deprFunctionalTotal = getFieldValueNumber('cost-depr-functional-total');
  const deprExternalTotal = getFieldValueNumber('cost-depr-external-total');
  const deprTotalAmt = getFieldValueNumber('cost-depr-total-amt');

  const siteParkingSpaces = getFieldValueNumber('cost-site-parking-spaces');
  const siteParkingCost = getFieldValueNumber('cost-site-parking-cost');
  const siteParkingTotal = getFieldValueNumber('cost-site-parking-total');
  const siteLandscaping = getFieldValueNumber('cost-site-landscaping');
  const sitePaving = getFieldValueNumber('cost-site-paving');
  const siteUtilities = getFieldValueNumber('cost-site-utilities');
  const siteOther = getFieldValueNumber('cost-site-other');
  const siteTotal = getFieldValueNumber('cost-site-total');

  const depreciatedValue = getFieldValueNumber('cost-depreciated-value');
  const indicatedValue = getFieldValueNumber('cost-indicated-value');

  // Notify parent when indicated value changes
  useEffect(() => {
    if (onValueChange) {
      onValueChange(indicatedValue);
    }
  }, [indicatedValue, onValueChange]);

  const formatCurrency = (n: number) => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  const formatNumber = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  const formatPercentage = (n: number) => n.toFixed(2) + '%';

  const inputStyle = {
    backgroundColor: colors.inputBg,
    borderColor: colors.border,
    color: colors.text,
  };

  const cellStyle = {
    padding: '0.5rem',
    borderBottom: `1px solid ${colors.border}`,
    verticalAlign: 'top',
  };

  const headerStyle = {
    padding: '0.5rem',
    textAlign: 'left' as const,
    fontSize: '0.625rem',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    borderBottom: `2px solid ${colors.border}`,
    color: colors.textMuted,
    backgroundColor: colors.panelBg,
  };

  const totalCellStyle = {
    padding: '0.5rem',
    fontWeight: 600,
    borderTop: `2px solid ${colors.border}`,
    color: colors.text,
    textAlign: 'center' as const,
  };

  const labelStyle = {
    fontSize: '0.625rem',
    color: colors.textMuted,
    marginBottom: '0.25rem',
    display: 'block',
  };

  const valueStyle = {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: colors.text,
    marginBottom: '0.5rem',
  };

  const inputFieldStyle = {
    marginBottom: '0.5rem',
  };

  const sectionContainerStyle = {
    padding: '0.75rem',
    backgroundColor: colors.panelBg,
    borderRight: `1px solid ${colors.border}`,
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
  };

  const lastSectionStyle = {
    padding: '0.75rem',
    backgroundColor: colors.panelBg,
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
  };

  const calcValueStyle = {
    fontSize: '0.75rem',
    padding: '0.5rem 0',
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${colors.border}`,
    paddingBottom: '0.5rem',
    marginBottom: '0.5rem',
  };

  const calcLabelStyle = {
    color: colors.textMuted,
    fontSize: '0.7rem',
    fontWeight: 500,
  };

  const calcAmountStyle = {
    fontWeight: 600,
    color: colors.text,
  };

  const fieldsContainerStyle = {
    flex: 0,
  };

  const subtotalsContainerStyle = {
    marginTop: 'auto',
    flex: 0,
  };

  const totalSectionStyle = {
    paddingTop: '0.75rem',
    borderTop: `2px solid ${colors.border}`,
  };

  const totalLabelStyle = {
    fontSize: '0.7rem',
    color: colors.textMuted,
    marginBottom: '0.25rem',
  };

  const totalAmountStyle = {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: colors.text,
  };

  const summaryBoxStyle = {
    padding: '1.25rem',
    backgroundColor: colors.inputBg,
    borderRadius: '4px',
    border: `1px solid ${colors.border}`,
  };

  const summaryLineStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
    fontSize: '0.8rem',
  };

  const summaryFinalStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '0.75rem',
    borderTop: `2px solid ${colors.border}`,
    fontSize: '1rem',
    fontWeight: 700,
    color: colors.text,
    marginTop: '0.75rem',
  };

  return (
    <div style={{ color: colors.text, display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem' }}>
      {/* MAIN TABLE */}
      <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
        <table className="w-full text-[10px] border-collapse">
          <thead style={{ backgroundColor: colors.panelBg, borderBottom: `1px solid ${colors.border}` }}>
            <tr>
              <th className="px-2 py-1 text-left font-medium" style={{ color: colors.textMuted }}>Land Valuation</th>
              <th className="px-2 py-1 text-left font-medium" style={{ color: colors.textMuted }}>RCN</th>
              <th className="px-2 py-1 text-left font-medium" style={{ color: colors.textMuted }}>Depreciation</th>
              <th className="px-2 py-1 text-left font-medium" style={{ color: colors.textMuted }}>Site Improvements</th>
            </tr>
          </thead>
          <tbody>
            {/* ROW 1: Land Area, GBA, Actual Age, Spaces */}
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              <td className="px-2 py-1">
                <div style={{ fontSize: '0.65rem', color: colors.textMuted, marginBottom: '0.25rem' }}>Land Area (SF)</div>
                <Input
                  type="number"
                  value={landSF || ''}
                  onChange={e => updateField('cost-land-sf', parseFloat(e.target.value) || 0)}
                  className="h-6 text-[10px] p-1 w-full"
                  style={inputStyle}
                />
              </td>
              <td className="px-2 py-1">
                <div style={{ fontSize: '0.65rem', color: colors.textMuted, marginBottom: '0.25rem' }}>GBA</div>
                <Input
                  type="number"
                  value={rcnGBA || ''}
                  onChange={e => updateField('cost-rcn-gba', parseFloat(e.target.value) || 0)}
                  className="h-6 text-[10px] p-1 w-full"
                  style={inputStyle}
                />
              </td>
              <td className="px-2 py-1">
                <div style={{ fontSize: '0.65rem', color: colors.textMuted, marginBottom: '0.25rem' }}>Actual Age</div>
                <Input
                  type="number"
                  value={deprPhysicalAge || ''}
                  onChange={e => updateField('cost-depr-physical-age', parseFloat(e.target.value) || 0)}
                  className="h-6 text-[10px] p-1 w-full"
                  style={inputStyle}
                />
              </td>
              <td className="px-2 py-1">
                <div style={{ fontSize: '0.65rem', color: colors.textMuted, marginBottom: '0.25rem' }}>Spaces</div>
                <Input
                  type="number"
                  value={siteParkingSpaces || ''}
                  onChange={e => updateField('cost-site-parking-spaces', parseFloat(e.target.value) || 0)}
                  className="h-6 text-[10px] p-1 w-full"
                  style={inputStyle}
                />
              </td>
            </tr>

            {/* ROW 2: Rate/SF, Cost/SF, Econ Life, Cost/Space */}
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              <td className="px-2 py-1">
                <div style={{ fontSize: '0.65rem', color: colors.textMuted, marginBottom: '0.25rem' }}>Rate/SF</div>
                <Input
                  type="number"
                  value={landRatePerSF || ''}
                  onChange={e => updateField('cost-land-rate-per-sf', parseFloat(e.target.value) || 0)}
                  className="h-6 text-[10px] p-1 w-full"
                  style={inputStyle}
                />
              </td>
              <td className="px-2 py-1">
                <div style={{ fontSize: '0.65rem', color: colors.textMuted, marginBottom: '0.25rem' }}>Cost/SF</div>
                <Input
                  type="number"
                  value={rcnRatePerSF || ''}
                  onChange={e => updateField('cost-rcn-rate-per-sf', parseFloat(e.target.value) || 0)}
                  className="h-6 text-[10px] p-1 w-full"
                  style={inputStyle}
                />
              </td>
              <td className="px-2 py-1">
                <div style={{ fontSize: '0.65rem', color: colors.textMuted, marginBottom: '0.25rem' }}>Econ. Life</div>
                <Input
                  type="number"
                  value={deprPhysicalLife || ''}
                  onChange={e => updateField('cost-depr-physical-life', parseFloat(e.target.value) || 0)}
                  className="h-6 text-[10px] p-1 w-full"
                  style={inputStyle}
                />
              </td>
              <td className="px-2 py-1">
                <div style={{ fontSize: '0.65rem', color: colors.textMuted, marginBottom: '0.25rem' }}>Cost/Space</div>
                <Input
                  type="number"
                  value={siteParkingCost || ''}
                  onChange={e => updateField('cost-site-parking-cost', parseFloat(e.target.value) || 0)}
                  className="h-6 text-[10px] p-1 w-full"
                  style={inputStyle}
                />
              </td>
            </tr>

            {/* ROW 3: Indirect %, Eff Age, Landscaping */}
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              <td className="px-2 py-1"></td>
              <td className="px-2 py-1">
                <div style={{ fontSize: '0.65rem', color: colors.textMuted, marginBottom: '0.25rem' }}>Indirect %</div>
                <Input
                  type="number"
                  value={rcnIndirectPct || ''}
                  onChange={e => updateField('cost-rcn-indirect-pct', parseFloat(e.target.value) || 0)}
                  className="h-6 text-[10px] p-1 w-full"
                  style={inputStyle}
                />
              </td>
              <td className="px-2 py-1">
                <div style={{ fontSize: '0.65rem', color: colors.textMuted, marginBottom: '0.25rem' }}>Eff. Age</div>
                <Input
                  type="number"
                  value={deprPhysicalEffectiveAge || ''}
                  onChange={e => updateField('cost-depr-physical-effective-age', parseFloat(e.target.value) || 0)}
                  className="h-6 text-[10px] p-1 w-full"
                  style={inputStyle}
                />
              </td>
              <td className="px-2 py-1">
                <div style={{ fontSize: '0.65rem', color: colors.textMuted, marginBottom: '0.25rem' }}>Landscaping</div>
                <Input
                  type="number"
                  value={siteLandscaping || ''}
                  onChange={e => updateField('cost-site-landscaping', parseFloat(e.target.value) || 0)}
                  className="h-6 text-[10px] p-1 w-full"
                  style={inputStyle}
                />
              </td>
            </tr>

            {/* ROW 4: Entrepreneur %, Functional, Paving */}
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              <td className="px-2 py-1"></td>
              <td className="px-2 py-1">
                <div style={{ fontSize: '0.65rem', color: colors.textMuted, marginBottom: '0.25rem' }}>Entrepreneur %</div>
                <Input
                  type="number"
                  value={rcnEntrepreneurPct || ''}
                  onChange={e => updateField('cost-rcn-entrepreneur-pct', parseFloat(e.target.value) || 0)}
                  className="h-6 text-[10px] p-1 w-full"
                  style={inputStyle}
                />
              </td>
              <td className="px-2 py-1">
                <div style={{ fontSize: '0.65rem', color: colors.textMuted, marginBottom: '0.25rem' }}>Functional</div>
                <Input
                  type="number"
                  value={deprFunctionalTotal || ''}
                  onChange={e => updateField('cost-depr-functional-total', parseFloat(e.target.value) || 0)}
                  className="h-6 text-[10px] p-1 w-full"
                  style={inputStyle}
                />
              </td>
              <td className="px-2 py-1">
                <div style={{ fontSize: '0.65rem', color: colors.textMuted, marginBottom: '0.25rem' }}>Paving</div>
                <Input
                  type="number"
                  value={sitePaving || ''}
                  onChange={e => updateField('cost-site-paving', parseFloat(e.target.value) || 0)}
                  className="h-6 text-[10px] p-1 w-full"
                  style={inputStyle}
                />
              </td>
            </tr>

            {/* ROW 5: External, Utilities */}
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              <td className="px-2 py-1"></td>
              <td className="px-2 py-1"></td>
              <td className="px-2 py-1">
                <div style={{ fontSize: '0.65rem', color: colors.textMuted, marginBottom: '0.25rem' }}>External</div>
                <Input
                  type="number"
                  value={deprExternalTotal || ''}
                  onChange={e => updateField('cost-depr-external-total', parseFloat(e.target.value) || 0)}
                  className="h-6 text-[10px] p-1 w-full"
                  style={inputStyle}
                />
              </td>
              <td className="px-2 py-1">
                <div style={{ fontSize: '0.65rem', color: colors.textMuted, marginBottom: '0.25rem' }}>Utilities</div>
                <Input
                  type="number"
                  value={siteUtilities || ''}
                  onChange={e => updateField('cost-site-utilities', parseFloat(e.target.value) || 0)}
                  className="h-6 text-[10px] p-1 w-full"
                  style={inputStyle}
                />
              </td>
            </tr>

            {/* ROW 6: Other */}
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              <td className="px-2 py-1"></td>
              <td className="px-2 py-1"></td>
              <td className="px-2 py-1"></td>
              <td className="px-2 py-1">
                <div style={{ fontSize: '0.65rem', color: colors.textMuted, marginBottom: '0.25rem' }}>Other</div>
                <Input
                  type="number"
                  value={siteOther || ''}
                  onChange={e => updateField('cost-site-other', parseFloat(e.target.value) || 0)}
                  className="h-6 text-[10px] p-1 w-full"
                  style={inputStyle}
                />
              </td>
            </tr>

            {/* ROW 7: SUBTOTALS */}
            <tr style={{ borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.inputBg }}>
              <td className="px-2 py-1" style={{ color: colors.text, fontSize: '0.75rem', fontWeight: 600 }}>Land Value</td>
              <td className="px-2 py-1">
                <div style={{ fontSize: '0.7rem', color: colors.textMuted }}>Direct:</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: colors.text }}>{formatCurrency(rcnDirectCosts)}</div>
              </td>
              <td className="px-2 py-1">
                <div style={{ fontSize: '0.7rem', color: colors.textMuted }}>Rem. Life:</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: colors.text }}>{formatNumber(deprPhysicalRemainingLife)} yrs</div>
              </td>
              <td className="px-2 py-1">
                <div style={{ fontSize: '0.7rem', color: colors.textMuted }}>Pkg Total:</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: colors.text }}>{formatCurrency(siteParkingTotal)}</div>
              </td>
            </tr>

            {/* ROW 8: MORE SUBTOTALS */}
            <tr style={{ borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.inputBg }}>
              <td className="px-2 py-1" style={{ color: colors.text, fontSize: '0.8rem', fontWeight: 600 }}>{formatCurrency(landValue)}</td>
              <td className="px-2 py-1">
                <div style={{ fontSize: '0.7rem', color: colors.textMuted }}>Indirect:</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: colors.text }}>{formatCurrency(rcnIndirectCosts)}</div>
              </td>
              <td className="px-2 py-1">
                <div style={{ fontSize: '0.7rem', color: colors.textMuted }}>Phys Depr %:</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: colors.text }}>{formatPercentage(deprPhysicalPct)}</div>
              </td>
              <td className="px-2 py-1"></td>
            </tr>

            {/* ROW 9: FINAL SUBTOTALS */}
            <tr style={{ borderBottom: `2px solid ${colors.border}`, backgroundColor: colors.inputBg }}>
              <td className="px-2 py-1"></td>
              <td className="px-2 py-1">
                <div style={{ fontSize: '0.7rem', color: colors.textMuted }}>Entrepreneur:</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: colors.text }}>{formatCurrency(rcnEntrepreneurAmt)}</div>
              </td>
              <td className="px-2 py-1">
                <div style={{ fontSize: '0.7rem', color: colors.textMuted }}>Phys Depr $:</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: colors.text }}>{formatCurrency(deprPhysicalAmt)}</div>
              </td>
              <td className="px-2 py-1"></td>
            </tr>

            {/* ROW 10: TOTALS */}
            <tr style={{ backgroundColor: colors.panelBg }}>
              <td className="px-2 py-1" style={{ color: colors.text, fontSize: '0.8rem', fontWeight: 700 }}>
                <div style={{ fontSize: '0.7rem', color: colors.textMuted, marginBottom: '0.25rem' }}>Total</div>
                {formatCurrency(landValue)}
              </td>
              <td className="px-2 py-1" style={{ color: colors.text, fontSize: '0.8rem', fontWeight: 700 }}>
                <div style={{ fontSize: '0.7rem', color: colors.textMuted, marginBottom: '0.25rem' }}>Total</div>
                {formatCurrency(rcnTotal)}
              </td>
              <td className="px-2 py-1" style={{ color: colors.text, fontSize: '0.8rem', fontWeight: 700 }}>
                <div style={{ fontSize: '0.7rem', color: colors.textMuted, marginBottom: '0.25rem' }}>Total</div>
                {formatCurrency(deprTotalAmt)}
              </td>
              <td className="px-2 py-1" style={{ color: colors.text, fontSize: '0.8rem', fontWeight: 700 }}>
                <div style={{ fontSize: '0.7rem', color: colors.textMuted, marginBottom: '0.25rem' }}>Total</div>
                {formatCurrency(siteTotal)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* VALUE INDICATION SIDE */}
      <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${colors.border}`, width: '280px', height: 'fit-content' }}>
        <div className="px-2 py-1" style={{ borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.panelBg }}>
          <span className="text-[10px] font-medium uppercase" style={{ color: colors.textMuted }}>Value Indication</span>
        </div>
        <div className="px-3 py-2 space-y-2 text-[10px]">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: colors.textMuted }}>Land Value</span>
            <span style={{ color: colors.text, fontWeight: 600 }}>{formatCurrency(landValue)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: colors.textMuted }}>+ Depr. RCN</span>
            <span style={{ color: colors.text, fontWeight: 600 }}>{formatCurrency(depreciatedValue)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: colors.textMuted }}>+ Site Impr.</span>
            <span style={{ color: colors.text, fontWeight: 600 }}>{formatCurrency(siteTotal)}</span>
          </div>
          <div
            style={{
              borderTop: `1px solid ${colors.border}`,
              paddingTop: '0.5rem',
              marginTop: '0.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: 700,
              color: colors.text,
            }}
          >
            <span>= Indicated</span>
            <span style={{ fontSize: '0.85rem' }}>{formatCurrency(indicatedValue)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
