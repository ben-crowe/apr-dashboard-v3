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

  return (
    <div className="overflow-x-auto" style={{ color: colors.text }}>
      <table
        className="w-full text-xs border-collapse"
        style={{ minWidth: '1000px', backgroundColor: colors.panelBg }}
      >
        <thead>
          <tr style={{ borderBottom: `2px solid ${colors.border}` }}>
            <th style={headerStyle}>Land Valuation</th>
            <th style={headerStyle}>Replacement Cost New</th>
            <th style={headerStyle}>Depreciation</th>
            <th style={headerStyle}>Site Improvements</th>
            <th style={headerStyle}>Value Indication</th>
          </tr>
        </thead>
        <tbody>
          {/* ROW 1: Primary inputs */}
          <tr>
            <td style={cellStyle}>
              <label style={labelStyle} title="Land Area (Square Feet)">
                Land Area (SF)
              </label>
              <Input
                type="number"
                value={landSF || ''}
                onChange={e => updateField('cost-land-sf', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1 w-full"
                style={inputStyle}
              />
            </td>
            <td style={cellStyle}>
              <label style={labelStyle} title="Building Gross Building Area">
                GBA
              </label>
              <Input
                type="number"
                value={rcnGBA || ''}
                onChange={e => updateField('cost-rcn-gba', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1 w-full"
                style={inputStyle}
              />
            </td>
            <td style={cellStyle}>
              <label style={labelStyle} title="Actual Age">
                Actual Age
              </label>
              <Input
                type="number"
                value={deprPhysicalAge || ''}
                onChange={e => updateField('cost-depr-physical-age', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1 w-full"
                style={inputStyle}
              />
            </td>
            <td style={cellStyle}>
              <label style={labelStyle} title="Parking Spaces">
                Spaces
              </label>
              <Input
                type="number"
                value={siteParkingSpaces || ''}
                onChange={e => updateField('cost-site-parking-spaces', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1 w-full"
                style={inputStyle}
              />
            </td>
            <td style={{ ...cellStyle, rowSpan: 8, backgroundColor: colors.panelBg }} className="align-top">
              <div className="space-y-2 text-xs">
                <div>
                  <span style={labelStyle}>Land Value</span>
                  <div style={valueStyle}>{formatCurrency(landValue)}</div>
                </div>
                <div>
                  <span style={labelStyle}>+ Depr. RCN</span>
                  <div style={valueStyle}>{formatCurrency(depreciatedValue)}</div>
                </div>
                <div>
                  <span style={labelStyle}>+ Site Improv.</span>
                  <div style={valueStyle}>{formatCurrency(siteTotal)}</div>
                </div>
                <div className="pt-1" style={{ borderTop: `1px solid ${colors.border}` }}>
                  <span style={labelStyle}>= Indicated Value</span>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: colors.text }}>
                    {formatCurrency(indicatedValue)}
                  </div>
                </div>
              </div>
            </td>
          </tr>

          {/* ROW 2: Secondary inputs */}
          <tr>
            <td style={cellStyle}>
              <label style={labelStyle} title="Rate per Square Foot">
                Rate/SF
              </label>
              <Input
                type="number"
                value={landRatePerSF || ''}
                onChange={e => updateField('cost-land-rate-per-sf', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1 w-full"
                style={inputStyle}
              />
            </td>
            <td style={cellStyle}>
              <label style={labelStyle} title="Cost per Square Foot">
                Cost/SF
              </label>
              <Input
                type="number"
                value={rcnRatePerSF || ''}
                onChange={e => updateField('cost-rcn-rate-per-sf', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1 w-full"
                style={inputStyle}
              />
            </td>
            <td style={cellStyle}>
              <label style={labelStyle} title="Economic Life">
                Econ Life
              </label>
              <Input
                type="number"
                value={deprPhysicalLife || ''}
                onChange={e => updateField('cost-depr-physical-life', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1 w-full"
                style={inputStyle}
              />
            </td>
            <td style={cellStyle}>
              <label style={labelStyle} title="Cost per Parking Space">
                Cost/Space
              </label>
              <Input
                type="number"
                value={siteParkingCost || ''}
                onChange={e => updateField('cost-site-parking-cost', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1 w-full"
                style={inputStyle}
              />
            </td>
          </tr>

          {/* ROW 3: Tertiary inputs */}
          <tr>
            <td style={cellStyle}></td>
            <td style={cellStyle}>
              <label style={labelStyle} title="Indirect Costs Percentage">
                Indirect %
              </label>
              <Input
                type="number"
                value={rcnIndirectPct || ''}
                onChange={e => updateField('cost-rcn-indirect-pct', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1 w-full"
                style={inputStyle}
              />
            </td>
            <td style={cellStyle}>
              <label style={labelStyle} title="Effective Age">
                Eff Age
              </label>
              <Input
                type="number"
                value={deprPhysicalEffectiveAge || ''}
                onChange={e => updateField('cost-depr-physical-effective-age', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1 w-full"
                style={inputStyle}
              />
            </td>
            <td style={cellStyle}>
              <label style={labelStyle} title="Landscaping">
                Landscaping
              </label>
              <Input
                type="number"
                value={siteLandscaping || ''}
                onChange={e => updateField('cost-site-landscaping', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1 w-full"
                style={inputStyle}
              />
            </td>
          </tr>

          {/* ROW 4: More inputs */}
          <tr>
            <td style={cellStyle}></td>
            <td style={cellStyle}>
              <label style={labelStyle} title="Entrepreneur Profit Percentage">
                Entrepreneur %
              </label>
              <Input
                type="number"
                value={rcnEntrepreneurPct || ''}
                onChange={e => updateField('cost-rcn-entrepreneur-pct', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1 w-full"
                style={inputStyle}
              />
            </td>
            <td style={cellStyle}>
              <label style={labelStyle} title="Functional Obsolescence">
                Functional
              </label>
              <Input
                type="number"
                value={deprFunctionalTotal || ''}
                onChange={e => updateField('cost-depr-functional-total', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1 w-full"
                style={inputStyle}
              />
            </td>
            <td style={cellStyle}>
              <label style={labelStyle} title="Paving">
                Paving
              </label>
              <Input
                type="number"
                value={sitePaving || ''}
                onChange={e => updateField('cost-site-paving', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1 w-full"
                style={inputStyle}
              />
            </td>
          </tr>

          {/* ROW 5: RCN Calculated values */}
          <tr>
            <td style={cellStyle}></td>
            <td style={cellStyle}>
              <div style={valueStyle}>Direct: {formatCurrency(rcnDirectCosts)}</div>
              <div style={valueStyle}>Indirect: {formatCurrency(rcnIndirectCosts)}</div>
              <div style={valueStyle}>Entrepreneur: {formatCurrency(rcnEntrepreneurAmt)}</div>
            </td>
            <td style={cellStyle}>
              <label style={labelStyle} title="External Obsolescence">
                External
              </label>
              <Input
                type="number"
                value={deprExternalTotal || ''}
                onChange={e => updateField('cost-depr-external-total', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1 w-full"
                style={inputStyle}
              />
            </td>
            <td style={cellStyle}>
              <label style={labelStyle} title="Utilities">
                Utilities
              </label>
              <Input
                type="number"
                value={siteUtilities || ''}
                onChange={e => updateField('cost-site-utilities', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1 w-full"
                style={inputStyle}
              />
            </td>
          </tr>

          {/* ROW 6: Depreciation calculated */}
          <tr>
            <td style={cellStyle}></td>
            <td style={cellStyle}></td>
            <td style={cellStyle}>
              <div style={valueStyle}>Rem. Life: {formatNumber(deprPhysicalRemainingLife)} yrs</div>
              <div style={valueStyle}>Phys Depr %: {formatPercentage(deprPhysicalPct)}</div>
              <div style={valueStyle}>Phys Depr $: {formatCurrency(deprPhysicalAmt)}</div>
            </td>
            <td style={cellStyle}>
              <label style={labelStyle} title="Other Site Improvements">
                Other
              </label>
              <Input
                type="number"
                value={siteOther || ''}
                onChange={e => updateField('cost-site-other', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1 w-full"
                style={inputStyle}
              />
            </td>
          </tr>

          {/* ROW 7: Site totals */}
          <tr>
            <td style={cellStyle}></td>
            <td style={cellStyle}></td>
            <td style={cellStyle}></td>
            <td style={cellStyle}>
              <div style={valueStyle}>Parking Total: {formatCurrency(siteParkingTotal)}</div>
            </td>
          </tr>

          {/* ROW 8: Spacing row */}
          <tr style={{ height: '20px' }}>
            <td style={cellStyle}></td>
            <td style={cellStyle}></td>
            <td style={cellStyle}></td>
            <td style={cellStyle}></td>
          </tr>
        </tbody>

        {/* FOOTER: Column totals */}
        <tfoot>
          <tr style={{ borderTop: `2px solid ${colors.border}` }}>
            <td style={totalCellStyle}>
              <div style={labelStyle}>Land Value</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>{formatCurrency(landValue)}</div>
            </td>
            <td style={totalCellStyle}>
              <div style={labelStyle}>Total RCN</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>{formatCurrency(rcnTotal)}</div>
            </td>
            <td style={totalCellStyle}>
              <div style={labelStyle}>Total Depr</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>{formatCurrency(deprTotalAmt)}</div>
            </td>
            <td style={totalCellStyle}>
              <div style={labelStyle}>Total Site</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>{formatCurrency(siteTotal)}</div>
            </td>
            <td style={{ ...totalCellStyle, backgroundColor: colors.panelBg }}>
              <div style={labelStyle}>Indicated Value</div>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>{formatCurrency(indicatedValue)}</div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
