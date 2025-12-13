/**
 * Sales Comparison Panel - Sandbox Calculator Component
 *
 * Uses LOCAL STATE (not Zustand store) for testing.
 * Pulls subject units from existing Income Approach via store.
 */

import { useState } from 'react';
import { useReportBuilderStore } from '@/features/report-builder/store/reportBuilderStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTheme } from '../context/ThemeContext';

interface Comparable {
  propertyName: string;
  address: string;
  saleDate: string;
  salePrice: number;
  units: number;
  sf: number;
  yearBuilt: number;
}

interface Adjustments {
  propertyRights: number;
  financing: number;
  conditionsOfSale: number;
  marketConditions: number;
  location: number;
  size: number;
  ageCondition: number;
  other: number;
}

const emptyComp: Comparable = {
  propertyName: '',
  address: '',
  saleDate: '',
  salePrice: 0,
  units: 0,
  sf: 0,
  yearBuilt: 0,
};

const emptyAdjustments: Adjustments = {
  propertyRights: 0,
  financing: 0,
  conditionsOfSale: 0,
  marketConditions: 0,
  location: 0,
  size: 0,
  ageCondition: 0,
  other: 0,
};

export default function SalesComparisonPanel() {
  const { colors } = useTheme();

  // Local state for comps and adjustments
  const [comps, setComps] = useState<Comparable[]>([
    { ...emptyComp },
    { ...emptyComp },
    { ...emptyComp },
    { ...emptyComp },
    { ...emptyComp },
  ]);

  const [adjustments, setAdjustments] = useState<Adjustments[]>([
    { ...emptyAdjustments },
    { ...emptyAdjustments },
    { ...emptyAdjustments },
    { ...emptyAdjustments },
    { ...emptyAdjustments },
  ]);

  const [indicatedPerUnit, setIndicatedPerUnit] = useState<number>(0);

  // Get subject units from Income Approach (from store)
  const sections = useReportBuilderStore(state => state.sections);
  const calcSection = sections.find(s => s.id === 'calc');

  const getFieldValue = (fieldId: string): number => {
    if (!calcSection) return 0;
    const field = calcSection.fields?.find((f: any) => f.id === fieldId);
    if (field) return Number(field.value) || 0;
    if (calcSection.subsections) {
      for (const sub of calcSection.subsections) {
        const subField = sub.fields?.find((f: any) => f.id === fieldId);
        if (subField) return Number(subField.value) || 0;
      }
    }
    return 0;
  };

  const subjectUnits = getFieldValue('calc-total-units');

  // Update comp field
  const updateComp = (index: number, field: keyof Comparable, value: string | number) => {
    const newComps = [...comps];
    if (field === 'propertyName' || field === 'address' || field === 'saleDate') {
      newComps[index][field] = value as string;
    } else {
      newComps[index][field] = typeof value === 'string' ? parseFloat(value) || 0 : value;
    }
    setComps(newComps);
  };

  // Update adjustment field
  const updateAdjustment = (index: number, field: keyof Adjustments, value: string) => {
    const newAdj = [...adjustments];
    newAdj[index][field] = parseFloat(value) || 0;
    setAdjustments(newAdj);
  };

  // Calculate per unit and per SF
  const calcPerUnit = (comp: Comparable) => comp.units > 0 ? comp.salePrice / comp.units : 0;
  const calcPerSF = (comp: Comparable) => comp.sf > 0 ? comp.salePrice / comp.sf : 0;

  // Calculate net adjustment
  const calcNetAdjustment = (adj: Adjustments): number => {
    return adj.propertyRights + adj.financing + adj.conditionsOfSale + adj.marketConditions +
           adj.location + adj.size + adj.ageCondition + adj.other;
  };

  // Calculate adjusted $/unit
  const calcAdjustedPerUnit = (comp: Comparable, adj: Adjustments): number => {
    const basePerUnit = calcPerUnit(comp);
    const netAdj = calcNetAdjustment(adj);
    return basePerUnit * (1 + netAdj / 100);
  };

  // Get all adjusted values for summary
  const adjustedValues = comps.map((comp, i) => calcAdjustedPerUnit(comp, adjustments[i]));
  const validAdjusted = adjustedValues.filter(v => v > 0);
  const lowValue = validAdjusted.length > 0 ? Math.min(...validAdjusted) : 0;
  const highValue = validAdjusted.length > 0 ? Math.max(...validAdjusted) : 0;
  const avgValue = validAdjusted.length > 0 ? validAdjusted.reduce((a, b) => a + b, 0) / validAdjusted.length : 0;

  // Calculate indicated value (Sales)
  const indicatedValueSales = indicatedPerUnit * subjectUnits;

  // Load sample data
  const loadSampleData = () => {
    setComps([
      {
        propertyName: 'Riverside Apts',
        address: '123 River St, North Battleford, SK',
        saleDate: '2023-06',
        salePrice: 1650000,
        units: 12,
        sf: 9600,
        yearBuilt: 1985,
      },
      {
        propertyName: 'Oak Manor',
        address: '456 Oak Ave, North Battleford, SK',
        saleDate: '2023-08',
        salePrice: 1900000,
        units: 14,
        sf: 11200,
        yearBuilt: 1990,
      },
      {
        propertyName: 'Pine View',
        address: '789 Pine Rd, North Battleford, SK',
        saleDate: '2023-04',
        salePrice: 1450000,
        units: 10,
        sf: 8000,
        yearBuilt: 1982,
      },
      {
        propertyName: 'Cedar Heights',
        address: '321 Cedar Ln, North Battleford, SK',
        saleDate: '2023-09',
        salePrice: 2100000,
        units: 16,
        sf: 12800,
        yearBuilt: 1995,
      },
      {
        propertyName: 'Maple Court',
        address: '654 Maple Dr, North Battleford, SK',
        saleDate: '2023-07',
        salePrice: 1750000,
        units: 13,
        sf: 10400,
        yearBuilt: 1988,
      },
    ]);

    // Sample adjustments (reasonable values)
    setAdjustments([
      { propertyRights: 0, financing: 0, conditionsOfSale: 0, marketConditions: 2, location: -3, size: 5, ageCondition: -2, other: 0 },
      { propertyRights: 0, financing: 0, conditionsOfSale: 0, marketConditions: 1.5, location: 0, size: 2, ageCondition: 1, other: 0 },
      { propertyRights: 0, financing: 0, conditionsOfSale: 0, marketConditions: 3, location: -5, size: 8, ageCondition: -5, other: 0 },
      { propertyRights: 0, financing: 0, conditionsOfSale: 0, marketConditions: 1, location: 2, size: -2, ageCondition: 3, other: 0 },
      { propertyRights: 0, financing: 0, conditionsOfSale: 0, marketConditions: 2, location: -1, size: 3, ageCondition: 0, other: 0 },
    ]);

    // Set indicated to average of adjusted values
    setTimeout(() => {
      const vals = comps.map((comp, i) => calcAdjustedPerUnit(comp, adjustments[i])).filter(v => v > 0);
      if (vals.length > 0) {
        const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
        setIndicatedPerUnit(Math.round(avg));
      }
    }, 100);
  };

  const formatCurrency = (n: number) => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  const formatNumber = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 0 });

  const inputStyle = {
    backgroundColor: colors.inputBg,
    borderColor: colors.border,
    color: colors.text,
  };

  return (
    <div className="space-y-3 text-xs" style={{ color: colors.text }}>

      {/* LOAD SAMPLE DATA */}
      <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
        <div className="px-2 py-1.5" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>Data Controls</span>
        </div>
        <div className="p-2">
          <Button
            onClick={loadSampleData}
            className="w-full text-xs py-2 border-0"
            style={{ backgroundColor: colors.border, color: colors.text }}
          >
            Load Sample Comps
          </Button>
        </div>
      </div>

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
              {comps.map((comp, idx) => (
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
                    {comp.units > 0 ? formatCurrency(calcPerUnit(comp)) : '-'}
                  </td>
                  <td className="px-2 py-1 text-right" style={{ color: colors.text }}>
                    {comp.sf > 0 ? '$' + (calcPerSF(comp)).toFixed(2) : '-'}
                  </td>
                </tr>
              ))}
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
                {adjustments.map((adj, idx) => (
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
                ))}
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Financing</td>
                {adjustments.map((adj, idx) => (
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
                ))}
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Conditions of Sale</td>
                {adjustments.map((adj, idx) => (
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
                ))}
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Market Conditions</td>
                {adjustments.map((adj, idx) => (
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
                ))}
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Location</td>
                {adjustments.map((adj, idx) => (
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
                ))}
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Size</td>
                {adjustments.map((adj, idx) => (
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
                ))}
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Age/Condition</td>
                {adjustments.map((adj, idx) => (
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
                ))}
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1" style={{ color: colors.textMuted }}>Other</td>
                {adjustments.map((adj, idx) => (
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
                ))}
              </tr>
            </tbody>
            <tfoot style={{ borderTop: `1px solid ${colors.border}` }}>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="px-2 py-1 font-medium" style={{ color: colors.textMuted }}>NET ADJUSTMENT</td>
                {adjustments.map((adj, idx) => (
                  <td key={idx} className="px-2 py-1 text-center font-medium" style={{ color: colors.text }}>
                    {calcNetAdjustment(adj).toFixed(1)}%
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-2 py-1 font-medium" style={{ color: colors.textMuted }}>ADJUSTED $/UNIT</td>
                {comps.map((comp, idx) => (
                  <td key={idx} className="px-2 py-1 text-center font-medium" style={{ color: colors.text }}>
                    {comp.units > 0 ? formatCurrency(calcAdjustedPerUnit(comp, adjustments[idx])) : '-'}
                  </td>
                ))}
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
            {comps.map((comp, idx) => (
              comp.units > 0 && (
                <tr key={idx} style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <td className="px-2 py-1" style={{ color: colors.textMuted }}>Comp {idx + 1}</td>
                  <td className="px-2 py-1 text-right" style={{ color: colors.text }}>
                    {formatCurrency(calcAdjustedPerUnit(comp, adjustments[idx]))}
                  </td>
                </tr>
              )
            ))}
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
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={indicatedPerUnit || ''}
                  onChange={e => setIndicatedPerUnit(parseFloat(e.target.value) || 0)}
                  className="h-6 w-28 text-right text-xs p-1 ml-auto"
                  style={inputStyle}
                />
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
            {formatCurrency(indicatedValueSales)}
          </span>
        </div>
        {subjectUnits > 0 && (
          <div className="text-[10px] mt-1 text-right" style={{ color: colors.textDim }}>
            {formatCurrency(indicatedPerUnit)}/unit × {subjectUnits} units
          </div>
        )}
      </div>

    </div>
  );
}
