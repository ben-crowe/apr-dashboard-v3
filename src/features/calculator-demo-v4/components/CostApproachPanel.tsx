/**
 * Cost Approach Panel - Wired to Zustand Store
 *
 * Uses store for all cost approach data.
 * Calculations run automatically via runCostApproachCalculations() in store.
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
  const deprTotalPct = getFieldValueNumber('cost-depr-total-pct');

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

  return (
    <div className="space-y-2 text-xs" style={{ color: colors.text }}>

      {/* SECTION 1: LAND VALUATION */}
      <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
        <div className="px-2 py-1" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>Land Valuation</span>
        </div>
        <div className="p-2 space-y-1.5">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] block mb-0.5" style={{ color: colors.textMuted }} title="Land Area (Square Feet)">Land Area (SF)</label>
              <Input
                type="number"
                value={landSF || ''}
                onChange={e => updateField('cost-land-sf', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="text-[10px] block mb-0.5" style={{ color: colors.textMuted }} title="Rate per Square Foot">Rate/SF</label>
              <Input
                type="number"
                value={landRatePerSF || ''}
                onChange={e => updateField('cost-land-rate-per-sf', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1"
                style={inputStyle}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <div className="pt-0.5 border-t" style={{ borderColor: colors.border }}>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-medium" style={{ color: colors.textMuted }}>Land Value</span>
                <span className="text-sm font-semibold" style={{ color: colors.text }}>
                  {formatCurrency(landValue)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: REPLACEMENT COST NEW (RCN) */}
      <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
        <div className="px-2 py-1" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>Replacement Cost New (RCN)</span>
        </div>
        <div className="p-2 space-y-1.5">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] block mb-0.5" style={{ color: colors.textMuted }} title="Building Gross Building Area">GBA</label>
              <Input
                type="number"
                value={rcnGBA || ''}
                onChange={e => updateField('cost-rcn-gba', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="text-[10px] block mb-0.5" style={{ color: colors.textMuted }} title="Cost per Square Foot">Cost/SF</label>
              <Input
                type="number"
                value={rcnRatePerSF || ''}
                onChange={e => updateField('cost-rcn-rate-per-sf', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1"
                style={inputStyle}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] block mb-0.5" style={{ color: colors.textMuted }} title="Indirect Costs Percentage">Indirect %</label>
              <Input
                type="number"
                value={rcnIndirectPct || ''}
                onChange={e => updateField('cost-rcn-indirect-pct', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="text-[10px] block mb-0.5" style={{ color: colors.textMuted }} title="Entrepreneur Profit Percentage">Entrepreneur %</label>
              <Input
                type="number"
                value={rcnEntrepreneurPct || ''}
                onChange={e => updateField('cost-rcn-entrepreneur-pct', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1"
                style={inputStyle}
              />
            </div>
          </div>
          <div className="pt-0.5 border-t grid grid-cols-4 gap-2" style={{ borderColor: colors.border }}>
            <div className="flex flex-col justify-center">
              <span className="text-[9px]" style={{ color: colors.textMuted }}>Direct</span>
              <span className="text-[10px] font-medium" style={{ color: colors.text }}>{formatCurrency(rcnDirectCosts)}</span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[9px]" style={{ color: colors.textMuted }}>Indirect</span>
              <span className="text-[10px] font-medium" style={{ color: colors.text }}>{formatCurrency(rcnIndirectCosts)}</span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[9px]" style={{ color: colors.textMuted }}>Entrepreneur</span>
              <span className="text-[10px] font-medium" style={{ color: colors.text }}>{formatCurrency(rcnEntrepreneurAmt)}</span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[9px]" style={{ color: colors.textMuted }}>Total RCN</span>
              <span className="text-sm font-semibold" style={{ color: colors.text }}>{formatCurrency(rcnTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: DEPRECIATION */}
      <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
        <div className="px-2 py-1" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>Depreciation</span>
        </div>
        <div className="p-2 space-y-1.5">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] block mb-0.5" style={{ color: colors.textMuted }} title="Actual Age">Actual Age</label>
              <Input
                type="number"
                value={deprPhysicalAge || ''}
                onChange={e => updateField('cost-depr-physical-age', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="text-[10px] block mb-0.5" style={{ color: colors.textMuted }} title="Economic Life">Econ Life</label>
              <Input
                type="number"
                value={deprPhysicalLife || ''}
                onChange={e => updateField('cost-depr-physical-life', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="text-[10px] block mb-0.5" style={{ color: colors.textMuted }} title="Effective Age">Eff Age</label>
              <Input
                type="number"
                value={deprPhysicalEffectiveAge || ''}
                onChange={e => updateField('cost-depr-physical-effective-age', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1"
                style={inputStyle}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] block mb-0.5" style={{ color: colors.textMuted }} title="Functional Obsolescence">Functional</label>
              <Input
                type="number"
                value={deprFunctionalTotal || ''}
                onChange={e => updateField('cost-depr-functional-total', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="text-[10px] block mb-0.5" style={{ color: colors.textMuted }} title="External Obsolescence">External</label>
              <Input
                type="number"
                value={deprExternalTotal || ''}
                onChange={e => updateField('cost-depr-external-total', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1"
                style={inputStyle}
              />
            </div>
          </div>
          <div className="pt-0.5 border-t grid grid-cols-4 gap-2" style={{ borderColor: colors.border }}>
            <div className="flex flex-col justify-center">
              <span className="text-[9px]" style={{ color: colors.textMuted }}>Rem. Life</span>
              <span className="text-[10px] font-medium" style={{ color: colors.text }}>{formatNumber(deprPhysicalRemainingLife)} yrs</span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[9px]" style={{ color: colors.textMuted }}>Phys Depr %</span>
              <span className="text-[10px] font-medium" style={{ color: colors.text }}>{formatPercentage(deprPhysicalPct)}</span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[9px]" style={{ color: colors.textMuted }}>Phys Depr $</span>
              <span className="text-[10px] font-medium" style={{ color: colors.text }}>{formatCurrency(deprPhysicalAmt)}</span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[9px]" style={{ color: colors.textMuted }}>Total Depr</span>
              <span className="text-sm font-semibold" style={{ color: colors.text }}>{formatCurrency(deprTotalAmt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: SITE IMPROVEMENTS */}
      <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
        <div className="px-2 py-1" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>Site Improvements</span>
        </div>
        <div className="p-2 space-y-1.5">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] block mb-0.5" style={{ color: colors.textMuted }} title="Parking Spaces">Spaces</label>
              <Input
                type="number"
                value={siteParkingSpaces || ''}
                onChange={e => updateField('cost-site-parking-spaces', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="text-[10px] block mb-0.5" style={{ color: colors.textMuted }} title="Cost per Parking Space">Cost/Space</label>
              <Input
                type="number"
                value={siteParkingCost || ''}
                onChange={e => updateField('cost-site-parking-cost', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="text-[10px] block mb-0.5" style={{ color: colors.textMuted }} title="Landscaping">Landscaping</label>
              <Input
                type="number"
                value={siteLandscaping || ''}
                onChange={e => updateField('cost-site-landscaping', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1"
                style={inputStyle}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] block mb-0.5" style={{ color: colors.textMuted }} title="Paving">Paving</label>
              <Input
                type="number"
                value={sitePaving || ''}
                onChange={e => updateField('cost-site-paving', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="text-[10px] block mb-0.5" style={{ color: colors.textMuted }} title="Utilities">Utilities</label>
              <Input
                type="number"
                value={siteUtilities || ''}
                onChange={e => updateField('cost-site-utilities', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="text-[10px] block mb-0.5" style={{ color: colors.textMuted }} title="Other Site Improvements">Other</label>
              <Input
                type="number"
                value={siteOther || ''}
                onChange={e => updateField('cost-site-other', parseFloat(e.target.value) || 0)}
                className="h-6 text-xs p-1"
                style={inputStyle}
              />
            </div>
          </div>
          <div className="pt-0.5 border-t grid grid-cols-2 gap-2" style={{ borderColor: colors.border }}>
            <div className="flex flex-col justify-center">
              <span className="text-[9px]" style={{ color: colors.textMuted }}>Parking Total</span>
              <span className="text-[10px] font-medium" style={{ color: colors.text }}>{formatCurrency(siteParkingTotal)}</span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[9px]" style={{ color: colors.textMuted }}>Total Site</span>
              <span className="text-sm font-semibold" style={{ color: colors.text }}>{formatCurrency(siteTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: SUMMARY */}
      <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
        <div className="px-2 py-1" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>Value Indication</span>
        </div>
        <div className="p-2">
          <div className="grid grid-cols-4 gap-2 items-center">
            <div className="flex flex-col">
              <span className="text-[9px]" style={{ color: colors.textMuted }}>Land Value</span>
              <span className="text-[10px] font-medium" style={{ color: colors.text }}>{formatCurrency(landValue)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px]" style={{ color: colors.textMuted }}>+ Depr. RCN</span>
              <span className="text-[10px] font-medium" style={{ color: colors.text }}>{formatCurrency(depreciatedValue)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px]" style={{ color: colors.textMuted }}>+ Site Improv.</span>
              <span className="text-[10px] font-medium" style={{ color: colors.text }}>{formatCurrency(siteTotal)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px]" style={{ color: colors.textMuted }}>= Indicated Value</span>
              <span className="text-lg font-bold" style={{ color: colors.text }}>{formatCurrency(indicatedValue)}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

