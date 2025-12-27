/**
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
    marginBottom: '0.75rem',
  };

  const sectionContainerStyle = {
    padding: '1rem',
    backgroundColor: colors.panelBg,
    borderRight: `1px solid ${colors.border}`,
  };

  const lastSectionStyle = {
    padding: '1rem',
    backgroundColor: colors.panelBg,
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

  const totalSectionStyle = {
    marginTop: '1rem',
    paddingTop: '1rem',
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
    <div style={{ color: colors.text }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0 }}>
        {/* COLUMN 1: LAND VALUATION */}
        <div style={sectionContainerStyle}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: colors.textMuted, marginBottom: '1rem' }}>
            Land Valuation
          </h3>

          <div style={inputFieldStyle}>
            <label style={labelStyle} title="Land Area (Square Feet)">
              Land Area (SF)
            </label>
            <Input
              type="number"
              value={landSF || ''}
              onChange={e => updateField('cost-land-sf', parseFloat(e.target.value) || 0)}
              className="h-7 text-xs p-1.5 w-full"
              style={inputStyle}
            />
          </div>

          <div style={inputFieldStyle}>
            <label style={labelStyle} title="Rate per Square Foot">
              Rate/SF
            </label>
            <Input
              type="number"
              value={landRatePerSF || ''}
              onChange={e => updateField('cost-land-rate-per-sf', parseFloat(e.target.value) || 0)}
              className="h-7 text-xs p-1.5 w-full"
              style={inputStyle}
            />
          </div>

          <div style={totalSectionStyle}>
            <div style={totalLabelStyle}>Land Value</div>
            <div style={totalAmountStyle}>{formatCurrency(landValue)}</div>
          </div>
        </div>

        {/* COLUMN 2: REPLACEMENT COST NEW */}
        <div style={sectionContainerStyle}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: colors.textMuted, marginBottom: '1rem' }}>
            Replacement Cost New
          </h3>

          <div style={inputFieldStyle}>
            <label style={labelStyle} title="Building Gross Building Area">
              GBA
            </label>
            <Input
              type="number"
              value={rcnGBA || ''}
              onChange={e => updateField('cost-rcn-gba', parseFloat(e.target.value) || 0)}
              className="h-7 text-xs p-1.5 w-full"
              style={inputStyle}
            />
          </div>

          <div style={inputFieldStyle}>
            <label style={labelStyle} title="Cost per Square Foot">
              Cost/SF
            </label>
            <Input
              type="number"
              value={rcnRatePerSF || ''}
              onChange={e => updateField('cost-rcn-rate-per-sf', parseFloat(e.target.value) || 0)}
              className="h-7 text-xs p-1.5 w-full"
              style={inputStyle}
            />
          </div>

          <div style={inputFieldStyle}>
            <label style={labelStyle} title="Indirect Costs Percentage">
              Indirect %
            </label>
            <Input
              type="number"
              value={rcnIndirectPct || ''}
              onChange={e => updateField('cost-rcn-indirect-pct', parseFloat(e.target.value) || 0)}
              className="h-7 text-xs p-1.5 w-full"
              style={inputStyle}
            />
          </div>

          <div style={inputFieldStyle}>
            <label style={labelStyle} title="Entrepreneur Profit Percentage">
              Entrepreneur %
            </label>
            <Input
              type="number"
              value={rcnEntrepreneurPct || ''}
              onChange={e => updateField('cost-rcn-entrepreneur-pct', parseFloat(e.target.value) || 0)}
              className="h-7 text-xs p-1.5 w-full"
              style={inputStyle}
            />
          </div>

          <div style={{ ...calcValueStyle, marginTop: '0.75rem', borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
            <span style={calcLabelStyle}>Direct Costs:</span>
            <span style={calcAmountStyle}>{formatCurrency(rcnDirectCosts)}</span>
          </div>

          <div style={calcValueStyle}>
            <span style={calcLabelStyle}>Indirect Costs:</span>
            <span style={calcAmountStyle}>{formatCurrency(rcnIndirectCosts)}</span>
          </div>

          <div style={calcValueStyle}>
            <span style={calcLabelStyle}>Entrepreneur:</span>
            <span style={calcAmountStyle}>{formatCurrency(rcnEntrepreneurAmt)}</span>
          </div>

          <div style={totalSectionStyle}>
            <div style={totalLabelStyle}>Total RCN</div>
            <div style={totalAmountStyle}>{formatCurrency(rcnTotal)}</div>
          </div>
        </div>

        {/* COLUMN 3: DEPRECIATION */}
        <div style={sectionContainerStyle}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: colors.textMuted, marginBottom: '1rem' }}>
            Depreciation
          </h3>

          <div style={inputFieldStyle}>
            <label style={labelStyle} title="Actual Age">
              Actual Age
            </label>
            <Input
              type="number"
              value={deprPhysicalAge || ''}
              onChange={e => updateField('cost-depr-physical-age', parseFloat(e.target.value) || 0)}
              className="h-7 text-xs p-1.5 w-full"
              style={inputStyle}
            />
          </div>

          <div style={inputFieldStyle}>
            <label style={labelStyle} title="Economic Life">
              Econ. Life
            </label>
            <Input
              type="number"
              value={deprPhysicalLife || ''}
              onChange={e => updateField('cost-depr-physical-life', parseFloat(e.target.value) || 0)}
              className="h-7 text-xs p-1.5 w-full"
              style={inputStyle}
            />
          </div>

          <div style={inputFieldStyle}>
            <label style={labelStyle} title="Effective Age">
              Eff. Age
            </label>
            <Input
              type="number"
              value={deprPhysicalEffectiveAge || ''}
              onChange={e => updateField('cost-depr-physical-effective-age', parseFloat(e.target.value) || 0)}
              className="h-7 text-xs p-1.5 w-full"
              style={inputStyle}
            />
          </div>

          <div style={inputFieldStyle}>
            <label style={labelStyle} title="Functional Obsolescence">
              Functional
            </label>
            <Input
              type="number"
              value={deprFunctionalTotal || ''}
              onChange={e => updateField('cost-depr-functional-total', parseFloat(e.target.value) || 0)}
              className="h-7 text-xs p-1.5 w-full"
              style={inputStyle}
            />
          </div>

          <div style={inputFieldStyle}>
            <label style={labelStyle} title="External Obsolescence">
              External
            </label>
            <Input
              type="number"
              value={deprExternalTotal || ''}
              onChange={e => updateField('cost-depr-external-total', parseFloat(e.target.value) || 0)}
              className="h-7 text-xs p-1.5 w-full"
              style={inputStyle}
            />
          </div>

          <div style={{ ...calcValueStyle, marginTop: '0.75rem', borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
            <span style={calcLabelStyle}>Rem. Life:</span>
            <span style={calcAmountStyle}>{formatNumber(deprPhysicalRemainingLife)} yrs</span>
          </div>

          <div style={calcValueStyle}>
            <span style={calcLabelStyle}>Phys. Depr %:</span>
            <span style={calcAmountStyle}>{formatPercentage(deprPhysicalPct)}</span>
          </div>

          <div style={calcValueStyle}>
            <span style={calcLabelStyle}>Phys. Depr $:</span>
            <span style={calcAmountStyle}>{formatCurrency(deprPhysicalAmt)}</span>
          </div>

          <div style={totalSectionStyle}>
            <div style={totalLabelStyle}>Total Depr</div>
            <div style={totalAmountStyle}>{formatCurrency(deprTotalAmt)}</div>
          </div>
        </div>

        {/* COLUMN 4: SITE IMPROVEMENTS */}
        <div style={sectionContainerStyle}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: colors.textMuted, marginBottom: '1rem' }}>
            Site Improvements
          </h3>

          <div style={inputFieldStyle}>
            <label style={labelStyle} title="Parking Spaces">
              Parking Spaces
            </label>
            <Input
              type="number"
              value={siteParkingSpaces || ''}
              onChange={e => updateField('cost-site-parking-spaces', parseFloat(e.target.value) || 0)}
              className="h-7 text-xs p-1.5 w-full"
              style={inputStyle}
            />
          </div>

          <div style={inputFieldStyle}>
            <label style={labelStyle} title="Cost per Parking Space">
              Cost/Space
            </label>
            <Input
              type="number"
              value={siteParkingCost || ''}
              onChange={e => updateField('cost-site-parking-cost', parseFloat(e.target.value) || 0)}
              className="h-7 text-xs p-1.5 w-full"
              style={inputStyle}
            />
          </div>

          <div style={inputFieldStyle}>
            <label style={labelStyle} title="Landscaping">
              Landscaping
            </label>
            <Input
              type="number"
              value={siteLandscaping || ''}
              onChange={e => updateField('cost-site-landscaping', parseFloat(e.target.value) || 0)}
              className="h-7 text-xs p-1.5 w-full"
              style={inputStyle}
            />
          </div>

          <div style={inputFieldStyle}>
            <label style={labelStyle} title="Paving">
              Paving
            </label>
            <Input
              type="number"
              value={sitePaving || ''}
              onChange={e => updateField('cost-site-paving', parseFloat(e.target.value) || 0)}
              className="h-7 text-xs p-1.5 w-full"
              style={inputStyle}
            />
          </div>

          <div style={inputFieldStyle}>
            <label style={labelStyle} title="Utilities">
              Utilities
            </label>
            <Input
              type="number"
              value={siteUtilities || ''}
              onChange={e => updateField('cost-site-utilities', parseFloat(e.target.value) || 0)}
              className="h-7 text-xs p-1.5 w-full"
              style={inputStyle}
            />
          </div>

          <div style={inputFieldStyle}>
            <label style={labelStyle} title="Other">
              Other
            </label>
            <Input
              type="number"
              value={siteOther || ''}
              onChange={e => updateField('cost-site-other', parseFloat(e.target.value) || 0)}
              className="h-7 text-xs p-1.5 w-full"
              style={inputStyle}
            />
          </div>

          <div style={{ ...calcValueStyle, marginTop: '0.75rem', borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
            <span style={calcLabelStyle}>Parking Total:</span>
            <span style={calcAmountStyle}>{formatCurrency(siteParkingTotal)}</span>
          </div>

          <div style={totalSectionStyle}>
            <div style={totalLabelStyle}>Total Site</div>
            <div style={totalAmountStyle}>{formatCurrency(siteTotal)}</div>
          </div>
        </div>

        {/* COLUMN 5: VALUE INDICATION */}
        <div style={lastSectionStyle}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: colors.textMuted, marginBottom: '1rem' }}>
            Value Indication
          </h3>

          <div style={summaryBoxStyle}>
            <div style={summaryLineStyle}>
              <span style={calcLabelStyle}>Land Value</span>
              <span style={calcAmountStyle}>{formatCurrency(landValue)}</span>
            </div>

            <div style={summaryLineStyle}>
              <span style={calcLabelStyle}>+ Depr. RCN</span>
              <span style={calcAmountStyle}>{formatCurrency(depreciatedValue)}</span>
            </div>

            <div style={summaryLineStyle}>
              <span style={calcLabelStyle}>+ Site Improv.</span>
              <span style={calcAmountStyle}>{formatCurrency(siteTotal)}</span>
            </div>

            <div style={summaryFinalStyle}>
              <span>= Indicated Value</span>
              <span>{formatCurrency(indicatedValue)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
