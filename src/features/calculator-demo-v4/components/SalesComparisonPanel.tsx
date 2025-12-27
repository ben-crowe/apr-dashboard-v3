/**
 * Sales Comparison Panel - Wired to Zustand Store
 *
 * Uses store for all comp data and adjustments.
 * Calculations run automatically via runSalesCompCalculations() in store.
 */

import { useEffect } from 'react';
import { useReportBuilderStore } from '@/features/report-builder/store/reportBuilderStore';
import { Input } from '@/components/ui/input';
import { useTheme } from '../context/ThemeContext';

interface SalesComparisonPanelProps {
  onIndicatedValueChange?: (value: number) => void;
}

export default function SalesComparisonPanel({ onIndicatedValueChange }: SalesComparisonPanelProps) {
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

  // Get subject units from Income Approach
  const subjectUnits = getFieldValueNumber('calc-total-units');

  // Get comp data from store (for display)
  const getCompData = (index: number) => {
    const prefix = `comp${index + 1}`;
    return {
      propertyName: String(getFieldValue(`${prefix}-name`) || ''),
      address: String(getFieldValue(`${prefix}-address`) || ''),
      saleDate: String(getFieldValue(`${prefix}-sale-date`) || ''),
      salePrice: getFieldValueNumber(`${prefix}-sale-price`),
      units: getFieldValueNumber(`${prefix}-units`),
      sf: getFieldValueNumber(`${prefix}-gba`),
      yearBuilt: getFieldValueNumber(`${prefix}-year`),
      pricePerUnit: getFieldValueNumber(`${prefix}-price-per-unit`),
      pricePerSF: getFieldValueNumber(`${prefix}-price-per-sf`),
      netAdj: getFieldValueNumber(`${prefix}-net-adj`),
      adjPricePerUnit: getFieldValueNumber(`${prefix}-adj-price-per-unit`),
    };
  };

  // Get adjustment data from store
  const getAdjustmentData = (index: number) => {
    const prefix = `comp${index + 1}`;
    return {
      propertyRights: getFieldValueNumber(`${prefix}-adj-property-rights`),
      financing: getFieldValueNumber(`${prefix}-adj-financing`),
      conditionsOfSale: getFieldValueNumber(`${prefix}-adj-sale-conditions`),
      marketConditions: getFieldValueNumber(`${prefix}-adj-market-conditions`),
      location: getFieldValueNumber(`${prefix}-adj-location`),
      size: getFieldValueNumber(`${prefix}-adj-size`),
      ageCondition: getFieldValueNumber(`${prefix}-adj-age-condition`),
      other: getFieldValueNumber(`${prefix}-adj-other`),
    };
  };

  // Update comp field
  const updateComp = (index: number, field: string, value: string | number) => {
    const prefix = `comp${index + 1}`;
    const fieldIdMap: Record<string, string> = {
      'propertyName': `${prefix}-name`,
      'address': `${prefix}-address`,
      'saleDate': `${prefix}-sale-date`,
      'salePrice': `${prefix}-sale-price`,
      'units': `${prefix}-units`,
      'sf': `${prefix}-gba`,
      'yearBuilt': `${prefix}-year`,
    };
    const fieldId = fieldIdMap[field];
    if (fieldId) {
      updateFieldValue(fieldId, value);
      // Trigger recalculation after updating comp data
      setTimeout(() => runCalculations(), 0);
    }
  };

  // Update adjustment field
  const updateAdjustment = (index: number, field: string, value: string) => {
    const prefix = `comp${index + 1}`;
    const fieldIdMap: Record<string, string> = {
      'propertyRights': `${prefix}-adj-property-rights`,
      'financing': `${prefix}-adj-financing`,
      'conditionsOfSale': `${prefix}-adj-sale-conditions`,
      'marketConditions': `${prefix}-adj-market-conditions`,
      'location': `${prefix}-adj-location`,
      'size': `${prefix}-adj-size`,
      'ageCondition': `${prefix}-adj-age-condition`,
      'other': `${prefix}-adj-other`,
    };
    const fieldId = fieldIdMap[field];
    if (fieldId) {
      updateFieldValue(fieldId, parseFloat(value) || 0);
      // Trigger recalculation after updating adjustments
      setTimeout(() => runCalculations(), 0);
    }
  };

  // Calculate net adjustment from store data
  const calcNetAdjustment = (adj: ReturnType<typeof getAdjustmentData>): number => {
    return adj.propertyRights + adj.financing + adj.conditionsOfSale + adj.marketConditions +
           adj.location + adj.size + adj.ageCondition + adj.other;
  };

  // Get all adjusted values for summary (from store calculated values)
  const compsData = [0, 1, 2, 3, 4].map(i => getCompData(i));
  const adjustedValues = compsData.map(comp => comp.adjPricePerUnit);
  const validAdjusted = adjustedValues.filter(v => v > 0);
  const lowValue = validAdjusted.length > 0 ? Math.min(...validAdjusted) : 0;
  const highValue = validAdjusted.length > 0 ? Math.max(...validAdjusted) : 0;
  const avgValue = validAdjusted.length > 0 ? validAdjusted.reduce((a, b) => a + b, 0) / validAdjusted.length : 0;

  // Get indicated value from store (calculated by runSalesCompCalculations)
  const scaIndicatedValue = getFieldValueNumber('sca-indicated-value');
  const indicatedPerUnit = subjectUnits > 0 ? scaIndicatedValue / subjectUnits : 0;

  // Notify parent when indicated value changes
  useEffect(() => {
    if (onIndicatedValueChange) {
      onIndicatedValueChange(scaIndicatedValue);
    }
  }, [scaIndicatedValue, onIndicatedValueChange]);

  const formatCurrency = (n: number) => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  const formatNumber = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 0 });

  const inputStyle = {
    backgroundColor: colors.inputBg,
    borderColor: colors.border,
    color: colors.text,
  };

  return (
    <div className="space-y-3 text-xs" style={{ color: colors.text }}>

      {/* COMPARABLE SALES TABLE */}
      <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
        <div className="px-2 py-1.5" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>Comparable Sales</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px]">
            <thead style={{ borderBottom: `1px solid ${colors.border}` }}>
              <tr>
                <th className="px-2 py-1 text-left font-normal" style={{ color: colors.textMuted }}>Comp</th>
                <th className="px-2 py-1 text-left font-normal" style={{ color: colors.textMuted }}>Property</th>
                <th className="px-2 py-1 text-left font-normal" style={{ color: colors.textMuted }}>Sale Date</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>Sale Price</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>Units</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>SF</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>Year</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>$/Unit</th>
                <th className="px-2 py-1 text-right font-normal" style={{ color: colors.textMuted }}>$/SF</th>
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2, 3, 4].map((idx) => {
                const comp = getCompData(idx);
                return (
                  <tr key={idx} style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <td className="px-2 py-1" style={{ color: colors.textMuted }}>{idx + 1}</td>
                    <td className="px-2 py-1">
                      <Input
                        type="text"
                        value={comp.propertyName}
                        onChange={e => updateComp(idx, 'propertyName', e.target.value)}
                        placeholder="Property name"
                        className="h-6 w-32 text-[10px] p-1"
                        style={inputStyle}
                      />
                    </td>
                    <td className="px-2 py-1">
                      <Input
                        type="text"
                        value={comp.saleDate}
                        onChange={e => updateComp(idx, 'saleDate', e.target.value)}
                        placeholder="MM/YYYY"
                        className="h-6 w-20 text-[10px] p-1"
                        style={inputStyle}
                      />
                    </td>
                    <td className="px-2 py-1">
                      <Input
                        type="number"
                        value={comp.salePrice || ''}
                        onChange={e => updateComp(idx, 'salePrice', e.target.value)}
                        className="h-6 w-24 text-right text-[10px] p-1"
                        style={inputStyle}
                      />
                    </td>
                    <td className="px-2 py-1">
                      <Input
                        type="number"
                        value={comp.units || ''}
                        onChange={e => updateComp(idx, 'units', e.target.value)}
                        className="h-6 w-14 text-right text-[10px] p-1"
                        style={inputStyle}
                      />
                    </td>
                    <td className="px-2 py-1">
                      <Input
                        type="number"
                        value={comp.sf || ''}
                        onChange={e => updateComp(idx, 'sf', e.target.value)}
                        className="h-6 w-16 text-right text-[10px] p-1"
                        style={inputStyle}
                      />
                    </td>
                    <td className="px-2 py-1">
                      <Input
                        type="number"
                        value={comp.yearBuilt || ''}
                        onChange={e => updateComp(idx, 'yearBuilt', e.target.value)}
                        className="h-6 w-14 text-right text-[10px] p-1"
                        style={inputStyle}
                      />
                    </td>
                    <td className="px-2 py-1 text-right" style={{ color: colors.text }}>
                      {comp.units > 0 ? formatCurrency(comp.pricePerUnit) : '-'}
                    </td>
                    <td className="px-2 py-1 text-right" style={{ color: colors.text }}>
                      {comp.sf > 0 ? '$' + comp.pricePerSF.toFixed(2) : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADJUSTMENT GRID */}
      <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
        <div className="px-2 py-1.5" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>Adjustments (%)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px]">
            <thead style={{ borderBottom: `1px solid ${colors.border}` }}>
              <tr>
                <th className="px-2 py-1 text-left font-normal" style={{ color: colors.textMuted }}>Category</th>
                {[1, 2, 3, 4, 5].map(i => (
                  <th key={i} className="px-2 py-1 text-center font-normal" style={{ color: colors.textMuted }}>Comp {i}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Property Rights</td>
                {[0, 1, 2, 3, 4].map((idx) => {
                  const adj = getAdjustmentData(idx);
                  return (
                    <td key={idx} className="px-2 py-1">
                      <Input
                        type="number"
                        step="0.5"
                        value={adj.propertyRights || ''}
                        onChange={e => updateAdjustment(idx, 'propertyRights', e.target.value)}
                        className="h-6 w-16 text-center text-[10px] p-1"
                        style={inputStyle}
                      />
                    </td>
                  );
                })}
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Financing</td>
                {[0, 1, 2, 3, 4].map((idx) => {
                  const adj = getAdjustmentData(idx);
                  return (
                    <td key={idx} className="px-2 py-1">
                      <Input
                        type="number"
                        step="0.5"
                        value={adj.financing || ''}
                        onChange={e => updateAdjustment(idx, 'financing', e.target.value)}
                        className="h-6 w-16 text-center text-[10px] p-1"
                        style={inputStyle}
                      />
                    </td>
                  );
                })}
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Conditions of Sale</td>
                {[0, 1, 2, 3, 4].map((idx) => {
                  const adj = getAdjustmentData(idx);
                  return (
                    <td key={idx} className="px-2 py-1">
                      <Input
                        type="number"
                        step="0.5"
                        value={adj.conditionsOfSale || ''}
                        onChange={e => updateAdjustment(idx, 'conditionsOfSale', e.target.value)}
                        className="h-6 w-16 text-center text-[10px] p-1"
                        style={inputStyle}
                      />
                    </td>
                  );
                })}
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Market Conditions</td>
                {[0, 1, 2, 3, 4].map((idx) => {
                  const adj = getAdjustmentData(idx);
                  return (
                    <td key={idx} className="px-2 py-1">
                      <Input
                        type="number"
                        step="0.5"
                        value={adj.marketConditions || ''}
                        onChange={e => updateAdjustment(idx, 'marketConditions', e.target.value)}
                        className="h-6 w-16 text-center text-[10px] p-1"
                        style={inputStyle}
                      />
                    </td>
                  );
                })}
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Location</td>
                {[0, 1, 2, 3, 4].map((idx) => {
                  const adj = getAdjustmentData(idx);
                  return (
                    <td key={idx} className="px-2 py-1">
                      <Input
                        type="number"
                        step="0.5"
                        value={adj.location || ''}
                        onChange={e => updateAdjustment(idx, 'location', e.target.value)}
                        className="h-6 w-16 text-center text-[10px] p-1"
                        style={inputStyle}
                      />
                    </td>
                  );
                })}
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Size</td>
                {[0, 1, 2, 3, 4].map((idx) => {
                  const adj = getAdjustmentData(idx);
                  return (
                    <td key={idx} className="px-2 py-1">
                      <Input
                        type="number"
                        step="0.5"
                        value={adj.size || ''}
                        onChange={e => updateAdjustment(idx, 'size', e.target.value)}
                        className="h-6 w-16 text-center text-[10px] p-1"
                        style={inputStyle}
                      />
                    </td>
                  );
                })}
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Age/Condition</td>
                {[0, 1, 2, 3, 4].map((idx) => {
                  const adj = getAdjustmentData(idx);
                  return (
                    <td key={idx} className="px-2 py-1">
                      <Input
                        type="number"
                        step="0.5"
                        value={adj.ageCondition || ''}
                        onChange={e => updateAdjustment(idx, 'ageCondition', e.target.value)}
                        className="h-6 w-16 text-center text-[10px] p-1"
                        style={inputStyle}
                      />
                    </td>
                  );
                })}
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Other</td>
                {[0, 1, 2, 3, 4].map((idx) => {
                  const adj = getAdjustmentData(idx);
                  return (
                    <td key={idx} className="px-2 py-1">
                      <Input
                        type="number"
                        step="0.5"
                        value={adj.other || ''}
                        onChange={e => updateAdjustment(idx, 'other', e.target.value)}
                        className="h-6 w-16 text-center text-[10px] p-1"
                        style={inputStyle}
                      />
                    </td>
                  );
                })}
              </tr>
            </tbody>
            <tfoot style={{ borderTop: `1px solid ${colors.border}` }}>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1 font-medium" style={{ color: colors.textMuted }}>NET ADJUSTMENT</td>
                {[0, 1, 2, 3, 4].map((idx) => {
                  const adj = getAdjustmentData(idx);
                  return (
                    <td key={idx} className="px-2 py-1 text-center font-medium" style={{ color: colors.text }}>
                      {calcNetAdjustment(adj).toFixed(1)}%
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="px-2 py-1 font-medium" style={{ color: colors.textMuted }}>ADJUSTED $/UNIT</td>
                {[0, 1, 2, 3, 4].map((idx) => {
                  const comp = getCompData(idx);
                  return (
                    <td key={idx} className="px-2 py-1 text-center font-medium" style={{ color: colors.text }}>
                      {comp.units > 0 ? formatCurrency(comp.adjPricePerUnit) : '-'}
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* SALES COMPARISON VALUE INDICATION */}
      <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
        <div className="px-2 py-1.5" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>Value Indication</span>
        </div>
        <table className="w-full">
          <tbody>
            {[0, 1, 2, 3, 4].map((idx) => {
              const comp = getCompData(idx);
              return comp.units > 0 ? (
                <tr key={idx} style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <td className="px-2 py-1" style={{ color: colors.textMuted }}>Comp {idx + 1}</td>
                  <td className="px-2 py-1 text-right" style={{ color: colors.text }}>
                    {formatCurrency(comp.adjPricePerUnit)}
                  </td>
                </tr>
              ) : null;
            })}
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              <td className="px-2 py-1 font-medium" style={{ color: colors.textMuted }}>Low</td>
              <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>
                {validAdjusted.length > 0 ? formatCurrency(lowValue) : '-'}
              </td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              <td className="px-2 py-1 font-medium" style={{ color: colors.textMuted }}>High</td>
              <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>
                {validAdjusted.length > 0 ? formatCurrency(highValue) : '-'}
              </td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              <td className="px-2 py-1 font-medium" style={{ color: colors.textMuted }}>Average</td>
              <td className="px-2 py-1 text-right font-medium" style={{ color: colors.text }}>
                {validAdjusted.length > 0 ? formatCurrency(avgValue) : '-'}
              </td>
            </tr>
            <tr>
              <td className="px-2 py-1" style={{ color: colors.textMuted }}>Indicated $/Unit</td>
              <td className="px-2 py-1 text-right" style={{ color: colors.text }}>
                {indicatedPerUnit > 0 ? formatCurrency(indicatedPerUnit) : '-'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* INDICATED VALUE (SALES) - Final result */}
      <div className="rounded-sm px-3 py-3" style={{ border: `1px solid ${colors.border}`, backgroundColor: colors.panelBgAlt }}>
        <div className="flex justify-between items-center">
          <span style={{ color: colors.textMuted }}>Indicated Value (Sales Comparison)</span>
          <span className="text-xl font-semibold" style={{ color: colors.text }}>
            {formatCurrency(scaIndicatedValue)}
          </span>
        </div>
        {subjectUnits > 0 && indicatedPerUnit > 0 && (
          <div className="text-[10px] mt-1 text-right" style={{ color: colors.textDim }}>
            {formatCurrency(indicatedPerUnit)}/unit × {subjectUnits} units
          </div>
        )}
      </div>

    </div>
  );
}
