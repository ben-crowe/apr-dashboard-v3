/**
 * Calculator With Preview - Combined Layout Demo
 *
 * Standalone demo page that displays calculator (left) and report template (right) side-by-side.
 * Calculator renders CalculatorDemoPage exactly as-is.
 * Report template displays in iframe with its own zoom/toggle controls.
 * Includes resizable split panel for adjusting the layout.
 *
 * postMessage bridge sends financial field values to template in real-time.
 */

import { useRef, useEffect, useCallback } from 'react';
import CalculatorDemoPage from './CalculatorDemoPage';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useReportBuilderStore } from '@/features/report-builder/store/reportBuilderStore';

// Format helpers
const formatCurrency = (value: number): string => {
  if (!value && value !== 0) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPercent = (value: number): string => {
  if (!value && value !== 0) return '';
  return `${value.toFixed(2)}%`;
};

const formatPerUnit = (value: number): string => {
  return `${formatCurrency(value)}/Unit`;
};

const formatPerSF = (value: number): string => {
  return `$${value.toFixed(2)}/SF`;
};

export default function CalculatorWithPreview() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const sections = useReportBuilderStore(state => state.sections);

  // Extract field value from store (returns number for calculations)
  const getFieldValue = useCallback((fieldId: string): number => {
    const calcSection = sections.find(s => s.id === 'calc');
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
  }, [sections]);

  // Extract field value as string (for text fields like names/addresses)
  const getFieldString = useCallback((fieldId: string): string => {
    const calcSection = sections.find(s => s.id === 'calc');
    if (!calcSection) return '';

    const field = calcSection.fields.find(f => f.id === fieldId);
    if (field) return String(field.value || '');

    if (calcSection.subsections) {
      for (const sub of calcSection.subsections) {
        const subField = sub.fields.find(f => f.id === fieldId);
        if (subField) return String(subField.value || '');
      }
    }
    return '';
  }, [sections]);

  // Send values to iframe
  const sendToPreview = useCallback(() => {
    if (!iframeRef.current?.contentWindow) return;

    // Core calculated values
    const noi = getFieldValue('calc-noi');
    const capRate = getFieldValue('calc-cap-rate');
    const indicatedValue = getFieldValue('calc-indicated-value');
    const pgr = getFieldValue('calc-pgr');
    const egr = getFieldValue('calc-egr');
    const vacancyLoss = getFieldValue('calc-vacancy-loss');
    const expensesTotal = getFieldValue('calc-expenses-total');
    const totalUnits = getFieldValue('calc-total-units') || 16;

    // Only send if calculator has actual data (NOI > 0 means calculations ran)
    if (noi === 0 && indicatedValue === 0) {
      console.log('[CalculatorWithPreview] Skipping update - no calculator data yet');
      return;
    }

    // Build financial field values object
    const values: Record<string, string> = {};

    // Revenue fields
    values['calc-pgr'] = formatCurrency(pgr);
    values['calc-pgr-per-unit'] = formatPerUnit(getFieldValue('calc-pgr-per-unit') || pgr / 16);
    values['calc-pgr-per-sf'] = formatPerSF(getFieldValue('calc-pgr-per-sf') || pgr / 10200);
    values['calc-egr'] = formatCurrency(egr);
    values['calc-egr-per-unit'] = formatPerUnit(getFieldValue('calc-egr-per-unit') || egr / 16);
    values['calc-egr-per-sf'] = formatPerSF(getFieldValue('calc-egr-per-sf') || egr / 10200);

    // Rental revenue
    values['calc-total-rental-revenue'] = formatCurrency(getFieldValue('calc-total-rental-revenue'));
    values['calc-rental-revenue-per-unit'] = formatPerUnit(getFieldValue('calc-rental-revenue-per-unit'));

    // Other income
    values['calc-other-income'] = formatCurrency(getFieldValue('calc-other-income'));
    values['calc-other-income-per-unit'] = formatPerUnit(getFieldValue('calc-other-income-per-unit'));
    values['calc-other-income-per-sf'] = formatPerSF(getFieldValue('calc-other-income-per-sf'));

    // Unit mix breakdown (for unit schedule table)
    for (let i = 1; i <= 4; i++) {
      const typePrefix = `calc-type${i}`;
      values[`${typePrefix}-count`] = String(getFieldValue(`${typePrefix}-count`) || '');
      values[`${typePrefix}-sf`] = String(getFieldValue(`${typePrefix}-sf`) || '');
      values[`${typePrefix}-rent`] = formatCurrency(getFieldValue(`${typePrefix}-rent`));
      values[`${typePrefix}-contract-rent`] = formatCurrency(getFieldValue(`${typePrefix}-contract-rent`));
      values[`${typePrefix}-cont-v-market`] = formatPercent(getFieldValue(`${typePrefix}-cont-v-market`));
      values[`${typePrefix}-per-unit`] = formatCurrency(getFieldValue(`${typePrefix}-per-unit`));
      values[`${typePrefix}-per-sf`] = formatPerSF(getFieldValue(`${typePrefix}-per-sf`));
      values[`${typePrefix}-annual`] = formatCurrency(getFieldValue(`${typePrefix}-annual`));
    }
    // Type totals
    values['calc-type-total-per-unit'] = formatPerUnit(getFieldValue('calc-type-total-per-unit'));
    values['calc-type-total-per-sf'] = formatPerSF(getFieldValue('calc-type-total-per-sf'));

    // Vacancy
    values['calc-vacancy-loss'] = `(${formatCurrency(Math.abs(vacancyLoss))})`;
    values['calc-vacancy-per-unit'] = `(${formatPerUnit(Math.abs(getFieldValue('calc-vacancy-per-unit')))})`;
    values['calc-vacancy-per-sf'] = `($${Math.abs(getFieldValue('calc-vacancy-per-sf')).toFixed(2)}/SF)`;
    values['calc-vacancy-rate'] = formatPercent(getFieldValue('calc-vacancy-rate'));

    // Expenses total
    values['calc-expenses-total'] = `(${formatCurrency(Math.abs(expensesTotal))})`;
    values['calc-expenses-per-unit'] = `(${formatPerUnit(Math.abs(getFieldValue('calc-expenses-per-unit')))})`;
    values['calc-expenses-per-sf'] = `($${Math.abs(getFieldValue('calc-expenses-per-sf')).toFixed(2)})`;
    values['calc-expense-ratio'] = formatPercent(getFieldValue('calc-expense-ratio'));

    // Individual expense categories (taxes, insurance, repairs, payroll, utilities, management, other)
    const expenseCategories = ['taxes', 'insurance', 'repairs', 'payroll', 'utilities', 'management', 'other'];
    expenseCategories.forEach(cat => {
      const annual = getFieldValue(`calc-exp-${cat}-annual`);
      const perUnit = getFieldValue(`calc-exp-${cat}-per-unit`);
      const perSf = getFieldValue(`calc-exp-${cat}-per-sf`);
      const pctPgr = getFieldValue(`calc-exp-${cat}-pct-pgr`);
      const pctEgr = getFieldValue(`calc-exp-${cat}-pct-egr`);

      values[`calc-exp-${cat}-annual`] = `(${formatCurrency(Math.abs(annual))})`;
      values[`calc-exp-${cat}-per-unit`] = `($${Math.abs(perUnit).toFixed(0)})`;
      values[`calc-exp-${cat}-per-sf`] = `($${Math.abs(perSf).toFixed(2)})`;
      values[`calc-exp-${cat}-pct-pgr`] = `(${Math.abs(pctPgr).toFixed(1)}%)`;
      values[`calc-exp-${cat}-pct-egr`] = `${Math.abs(pctEgr).toFixed(1)}%`;
    });

    // NOI
    values['calc-noi'] = formatCurrency(noi);
    values['calc-noi-per-unit'] = formatPerUnit(getFieldValue('calc-noi-per-unit') || noi / 16);
    values['calc-noi-per-sf'] = formatPerSF(getFieldValue('calc-noi-per-sf') || noi / 10200);

    // Cap rate and value
    values['calc-cap-rate'] = formatPercent(capRate);
    values['calc-indicated-value'] = formatCurrency(indicatedValue);
    values['calc-value-per-unit'] = formatPerUnit(getFieldValue('calc-value-per-unit') || indicatedValue / 16);
    values['calc-value-per-sf'] = `$${Math.round(indicatedValue / 10200)}`;
    values['calc-indicated-value-rounded'] = formatCurrency(Math.round(indicatedValue / 10000) * 10000);

    // Direct cap (mirrors calc values)
    values['ia-dircap-noi'] = formatCurrency(noi);
    values['ia-dircap-noi-per-unit'] = formatPerUnit(noi / 16);
    values['ia-dircap-cap-rate1'] = formatPercent(capRate);
    values['ia-dircap-expenseratio'] = formatPercent(getFieldValue('calc-expense-ratio'));

    // Reconciliation (use indicated value as final)
    values['recon-final-value'] = formatCurrency(indicatedValue);
    values['recon-final-value-per-sf'] = `$${Math.round(indicatedValue / 10200)}`;

    // Sales comparison (placeholder - would come from SCA section)
    values['sca-indicated-value'] = formatCurrency(indicatedValue);
    values['sca-indicated-value-rounded'] = formatCurrency(Math.round(indicatedValue / 10000) * 10000);
    values['sca-value-per-sf'] = `$${Math.round(indicatedValue / 10200)}`;

    // ========================================
    // Historical fields (hist-*) for Page 43 Operating History
    // ========================================
    const histCategories = [
      'revenue-multifamily', 'revenue-rental', 'revenue-parking',
      'revenue-laundry', 'revenue-misc', 'pgr', 'vacancy', 'egr',
      'exp-taxes', 'exp-insurance', 'exp-repairs', 'exp-payroll',
      'exp-utilities', 'exp-management', 'exp-other', 'exp-total', 'noi'
    ];

    histCategories.forEach(cat => {
      const total = getFieldValue(`hist-${cat}-total`);
      const perUnit = getFieldValue(`hist-${cat}-per-unit`) || (totalUnits > 0 ? total / totalUnits : 0);
      const pctPgr = getFieldValue(`hist-${cat}-pct-pgr`) || 0;

      // Revenue/summary items are positive, expenses/vacancy are negative display
      const isExpense = cat.startsWith('exp-') || cat === 'vacancy';

      values[`hist-${cat}-total`] = isExpense ? `(${formatCurrency(Math.abs(total))})` : formatCurrency(total);
      values[`hist-${cat}-per-unit`] = isExpense ? `(${formatCurrency(Math.abs(perUnit))})` : formatCurrency(perUnit);
      values[`hist-${cat}-pct-pgr`] = isExpense ? `(${Math.abs(pctPgr).toFixed(0)}%)` : `${pctPgr.toFixed(0)}%`;
    });

    // ========================================
    // Comparable sales fields (comp1-* through comp5-*) for Page 60
    // ========================================
    for (let i = 1; i <= 5; i++) {
      const compPrefix = `comp${i}`;

      // Basic comp info (text fields)
      values[`${compPrefix}-name`] = getFieldString(`${compPrefix}-name`);
      values[`${compPrefix}-address`] = getFieldString(`${compPrefix}-address`);
      values[`${compPrefix}-city`] = getFieldString(`${compPrefix}-city`);
      values[`${compPrefix}-province`] = getFieldString(`${compPrefix}-province`);

      // Numeric comp data
      const units = getFieldValue(`${compPrefix}-units`);
      const gba = getFieldValue(`${compPrefix}-gba`) || getFieldValue(`${compPrefix}-sf`);
      const salePrice = getFieldValue(`${compPrefix}-sale-price`);
      const pricePerUnit = salePrice && units ? salePrice / units : 0;

      values[`${compPrefix}-units`] = units ? String(units) : '';
      values[`${compPrefix}-gba`] = gba ? String(gba) : '';
      values[`${compPrefix}-sale-price`] = formatCurrency(salePrice);
      values[`${compPrefix}-price-per-unit`] = formatCurrency(pricePerUnit);
      values[`${compPrefix}-year`] = getFieldString(`${compPrefix}-year-built`) || getFieldString(`${compPrefix}-year`);

      // Adjustment fields - these may be stored as percentages
      const transAdj = getFieldValue(`${compPrefix}-total-trans-adj`) || 0;
      const physAdj = getFieldValue(`${compPrefix}-total-phys-adj`) || 0;
      const transAdjPrice = pricePerUnit * (1 + transAdj / 100);
      const adjPricePerUnit = transAdjPrice * (1 + physAdj / 100);
      const netAdj = transAdj + physAdj;
      const grossAdj = Math.abs(transAdj) + Math.abs(physAdj);

      values[`${compPrefix}-total-trans-adj`] = `${transAdj.toFixed(0)}%`;
      values[`${compPrefix}-trans-adj-price`] = formatCurrency(transAdjPrice);
      values[`${compPrefix}-total-phys-adj`] = physAdj < 0 ? `(${Math.abs(physAdj).toFixed(0)}%)` : `${physAdj.toFixed(0)}%`;
      values[`${compPrefix}-adj-price-per-unit`] = formatCurrency(adjPricePerUnit);
      values[`${compPrefix}-net-adj`] = netAdj < 0 ? `(${Math.abs(netAdj).toFixed(0)}%)` : `${netAdj.toFixed(0)}%`;
      values[`${compPrefix}-gross-adj`] = `${grossAdj.toFixed(0)}%`;
    }

    // ========================================
    // DCA Statistics (dca-high-*, dca-avg-*, dca-med-*, dca-low-*)
    // Calculate statistics from the 5 comps
    // ========================================
    const compPrices: number[] = [];
    const compTransAdj: number[] = [];
    const compPhysAdj: number[] = [];
    const compFinalPrices: number[] = [];
    const compNetAdj: number[] = [];
    const compGrossAdj: number[] = [];

    for (let i = 1; i <= 5; i++) {
      const units = getFieldValue(`comp${i}-units`);
      const salePrice = getFieldValue(`comp${i}-sale-price`);
      if (units > 0 && salePrice > 0) {
        const pricePerUnit = salePrice / units;
        const transAdj = getFieldValue(`comp${i}-total-trans-adj`) || 0;
        const physAdj = getFieldValue(`comp${i}-total-phys-adj`) || 0;
        const transAdjPrice = pricePerUnit * (1 + transAdj / 100);
        const finalPrice = transAdjPrice * (1 + physAdj / 100);
        const netAdj = transAdj + physAdj;
        const grossAdj = Math.abs(transAdj) + Math.abs(physAdj);

        compPrices.push(pricePerUnit);
        compTransAdj.push(transAdj);
        compPhysAdj.push(physAdj);
        compFinalPrices.push(finalPrice);
        compNetAdj.push(netAdj);
        compGrossAdj.push(grossAdj);
      }
    }

    // Helper to calculate stats from array
    const calcStatsFromArray = (arr: number[]): { high: number; avg: number; med: number; low: number } => {
      if (arr.length === 0) return { high: 0, avg: 0, med: 0, low: 0 };
      const sorted = [...arr].sort((a, b) => a - b);
      const sum = arr.reduce((a, b) => a + b, 0);
      return {
        high: Math.max(...arr),
        avg: sum / arr.length,
        med: sorted.length % 2 === 0
          ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
          : sorted[Math.floor(sorted.length / 2)],
        low: Math.min(...arr)
      };
    };

    const priceStats = calcStatsFromArray(compPrices);
    const transAdjStats = calcStatsFromArray(compTransAdj);
    const physAdjStats = calcStatsFromArray(compPhysAdj);
    const finalPriceStats = calcStatsFromArray(compFinalPrices);
    const netAdjStats = calcStatsFromArray(compNetAdj);
    const grossAdjStats = calcStatsFromArray(compGrossAdj);

    // Output DCA statistics
    const statTypes = ['high', 'avg', 'med', 'low'] as const;
    statTypes.forEach(stat => {
      values[`dca-${stat}-price-per-unit`] = formatCurrency(priceStats[stat]);
      values[`dca-${stat}-trans-adj`] = transAdjStats[stat] < 0
        ? `(${Math.abs(transAdjStats[stat]).toFixed(0)}%)`
        : `${transAdjStats[stat].toFixed(0)}%`;
      values[`dca-${stat}-trans-adj-price`] = formatCurrency(priceStats[stat] * (1 + transAdjStats[stat] / 100));
      values[`dca-${stat}-phys-adj`] = physAdjStats[stat] < 0
        ? `(${Math.abs(physAdjStats[stat]).toFixed(0)}%)`
        : `${physAdjStats[stat].toFixed(0)}%`;
      values[`dca-${stat}-final-price`] = formatCurrency(finalPriceStats[stat]);
      values[`dca-${stat}-net-adj`] = netAdjStats[stat] < 0
        ? `(${Math.abs(netAdjStats[stat]).toFixed(0)}%)`
        : `${netAdjStats[stat].toFixed(0)}%`;
      values[`dca-${stat}-gross-adj`] = `${grossAdjStats[stat].toFixed(0)}%`;
    });

    // Send to iframe
    iframeRef.current.contentWindow.postMessage({
      type: 'CALCULATOR_UPDATE',
      values
    }, '*');

    console.log('[CalculatorWithPreview] Sent update to template:', Object.keys(values).length, 'fields');
  }, [getFieldValue, getFieldString]);

  // Watch for store changes and send updates
  useEffect(() => {
    // Send initial values after iframe loads
    const handleLoad = () => {
      setTimeout(sendToPreview, 500); // Give iframe time to initialize
    };

    const iframe = iframeRef.current;
    iframe?.addEventListener('load', handleLoad);

    return () => {
      iframe?.removeEventListener('load', handleLoad);
    };
  }, [sendToPreview]);

  // Send updates when sections change
  useEffect(() => {
    if (sections.length > 0) {
      sendToPreview();
    }
  }, [sections, sendToPreview]);

  return (
    <div className="w-full" style={{ height: '100vh', overflow: 'hidden' }}>
      <ResizablePanelGroup direction="horizontal" className="w-full h-full">
        {/* Left Panel - Calculator (default 60%, resizable) */}
        <ResizablePanel defaultSize={60} minSize={30} maxSize={80} className="flex">
          <div className="w-full h-full overflow-y-auto overflow-x-hidden">
            <CalculatorDemoPage />
          </div>
        </ResizablePanel>

        {/* Resizable Handle */}
        <ResizableHandle withHandle />

        {/* Right Panel - Report Template (default 40%, resizable) */}
        <ResizablePanel defaultSize={40} minSize={20} maxSize={70}>
          <div className="h-full w-full">
            <iframe
              ref={iframeRef}
              src={`/Report-MF-template.html?v=${Date.now()}`}
              className="h-full w-full border-0"
              title="Report Template Preview"
              style={{ display: 'block' }}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
