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
  return formatCurrency(value);
};

const formatPerSF = (value: number): string => {
  return `$${value.toFixed(2)}/SF`;
};

export default function CalculatorWithPreview() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const sections = useReportBuilderStore(state => state.sections);

  // Extract field value from store (returns number for calculations)
  // Searches ALL sections, not just 'calc', to find hist-*, comp-*, etc.
  const getFieldValue = useCallback((fieldId: string): number => {
    for (const section of sections) {
      // Check section's direct fields
      const field = section.fields?.find((f: any) => f.id === fieldId);
      if (field) return Number(field.value) || 0;

      // Check subsections
      if (section.subsections) {
        for (const sub of section.subsections) {
          const subField = sub.fields?.find((f: any) => f.id === fieldId);
          if (subField) return Number(subField.value) || 0;
        }
      }
    }
    return 0;
  }, [sections]);

  // Extract field value as string (for text fields like names/addresses)
  // Searches ALL sections, not just 'calc'
  const getFieldString = useCallback((fieldId: string): string => {
    for (const section of sections) {
      // Check section's direct fields
      const field = section.fields?.find((f: any) => f.id === fieldId);
      if (field) return String(field.value || '');

      // Check subsections
      if (section.subsections) {
        for (const sub of section.subsections) {
          const subField = sub.fields?.find((f: any) => f.id === fieldId);
          if (subField) return String(subField.value || '');
        }
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

    // Property info fields (total units for Page 48, Page 60 calculations)
    values['total-units'] = String(totalUnits);
    values['subject-units'] = String(totalUnits);
    values['calc-total-units'] = String(totalUnits);

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
      const marketRent = getFieldValue(`${typePrefix}-rent`) || 0;
      const contractRent = getFieldValue(`${typePrefix}-contract-rent`) || marketRent; // Default to market if no contract
      const contVsMarket = marketRent > 0 ? (contractRent / marketRent) * 100 : 0;

      values[`${typePrefix}-count`] = String(getFieldValue(`${typePrefix}-count`) || '');
      values[`${typePrefix}-sf`] = String(getFieldValue(`${typePrefix}-sf`) || '');
      values[`${typePrefix}-rent`] = formatCurrency(marketRent);
      values[`${typePrefix}-contract-rent`] = formatCurrency(contractRent);
      values[`${typePrefix}-cont-v-market`] = formatPercent(contVsMarket);
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

    // ========================================
    // Page 48 Direct Capitalization - NEW FIELDS
    // Matching Page-48-Direct-Capitalization.html template
    // ========================================

    // Get total SF for per-SF calculations
    const totalSf = getFieldValue('calc-total-sf') || 10200;
    const rentalRevenue = getFieldValue('calc-total-rental-revenue');
    const parkingIncome = getFieldValue('calc-parking-income') || 0;
    const laundryIncome = getFieldValue('calc-laundry-income') || 0;
    const totalOtherRevenue = parkingIncome + laundryIncome;

    // PRR (Potential Rental Revenue) = total rental revenue
    const prr = rentalRevenue > 0 ? rentalRevenue : 1; // Avoid division by zero

    // ========================================
    // UNIT MIX SUBTOTAL FIELDS
    // ========================================
    // Calculate average contract rent (weighted by count)
    let totalCount = 0;
    let totalContractRentWeighted = 0;
    let totalMarketRentWeighted = 0;
    let totalAnnual = 0;
    let totalTypeSf = 0;

    for (let i = 1; i <= 4; i++) {
      const count = getFieldValue(`calc-type${i}-count`) || 0;
      const contractRent = getFieldValue(`calc-type${i}-contract-rent`) || 0;
      const marketRent = getFieldValue(`calc-type${i}-rent`) || 0;
      const annual = getFieldValue(`calc-type${i}-annual`) || (count * marketRent * 12);
      const sf = getFieldValue(`calc-type${i}-sf`) || 0;

      totalCount += count;
      totalContractRentWeighted += contractRent * count;
      totalMarketRentWeighted += marketRent * count;
      totalAnnual += annual;
      totalTypeSf += sf * count;
    }

    const avgContractRent = totalCount > 0 ? totalContractRentWeighted / totalCount : 0;
    const avgMarketRent = totalCount > 0 ? totalMarketRentWeighted / totalCount : 0;
    const avgContVsMarket = avgMarketRent > 0 ? (avgContractRent / avgMarketRent) * 100 : 0;
    const subtotalPerUnit = totalCount > 0 ? totalAnnual / totalCount / 12 : 0;
    const subtotalPerSf = totalTypeSf > 0 ? totalAnnual / totalTypeSf : 0;

    values['calc-avg-contract-rent'] = formatCurrency(avgContractRent);
    values['calc-avg-market-rent'] = formatCurrency(avgMarketRent);
    values['calc-avg-cont-v-market'] = formatPercent(avgContVsMarket);
    values['calc-subtotal-per-unit'] = formatCurrency(subtotalPerUnit);
    values['calc-subtotal-per-sf'] = `$${subtotalPerSf.toFixed(2)}`;
    values['calc-subtotal-annual'] = formatCurrency(totalAnnual);

    // ========================================
    // RENTAL REVENUE SECTION
    // ========================================
    // Multifamily revenue (same as total rental revenue for multifamily properties)
    const mfAnnual = rentalRevenue;
    const mfPctPrr = prr > 0 ? (mfAnnual / prr) * 100 : 100;
    const mfPctPgr = pgr > 0 ? (mfAnnual / pgr) * 100 : 0;
    const mfPctEgr = egr > 0 ? (mfAnnual / egr) * 100 : 0;
    const mfPerUnit = totalUnits > 0 ? mfAnnual / totalUnits : 0;
    const mfPerSf = totalSf > 0 ? mfAnnual / totalSf : 0;

    values['calc-mf-pct-prr'] = formatPercent(mfPctPrr);
    values['calc-mf-pct-pgr'] = formatPercent(mfPctPgr);
    values['calc-mf-pct-egr'] = formatPercent(mfPctEgr);
    values['calc-mf-per-unit'] = formatCurrency(mfPerUnit);
    values['calc-mf-per-sf'] = `$${mfPerSf.toFixed(2)}`;
    values['calc-mf-annual'] = formatCurrency(mfAnnual);

    // Total Rental Revenue row
    values['calc-rental-rev-per-unit'] = formatCurrency(mfPerUnit);
    values['calc-rental-rev-per-sf'] = `$${mfPerSf.toFixed(2)}`;
    values['calc-rental-rev-annual'] = formatCurrency(rentalRevenue);

    // ========================================
    // OTHER REVENUE (MISCELLANEOUS) SECTION
    // ========================================
    // Parking Income
    const parkingPctPrr = prr > 0 ? (parkingIncome / prr) * 100 : 0;
    const parkingPctPgr = pgr > 0 ? (parkingIncome / pgr) * 100 : 0;
    const parkingPctEgr = egr > 0 ? (parkingIncome / egr) * 100 : 0;
    const parkingPerUnit = totalUnits > 0 ? parkingIncome / totalUnits : 0;
    const parkingPerSf = totalSf > 0 ? parkingIncome / totalSf : 0;

    values['calc-parking-pct-prr'] = formatPercent(parkingPctPrr);
    values['calc-parking-pct-pgr'] = formatPercent(parkingPctPgr);
    values['calc-parking-pct-egr'] = formatPercent(parkingPctEgr);
    values['calc-parking-per-unit'] = formatCurrency(parkingPerUnit);
    values['calc-parking-per-sf'] = `$${parkingPerSf.toFixed(2)}`;
    values['calc-parking-annual'] = formatCurrency(parkingIncome);

    // Laundry Income
    const laundryPctPrr = prr > 0 ? (laundryIncome / prr) * 100 : 0;
    const laundryPctPgr = pgr > 0 ? (laundryIncome / pgr) * 100 : 0;
    const laundryPctEgr = egr > 0 ? (laundryIncome / egr) * 100 : 0;
    const laundryPerUnit = totalUnits > 0 ? laundryIncome / totalUnits : 0;
    const laundryPerSf = totalSf > 0 ? laundryIncome / totalSf : 0;

    values['calc-laundry-pct-prr'] = formatPercent(laundryPctPrr);
    values['calc-laundry-pct-pgr'] = formatPercent(laundryPctPgr);
    values['calc-laundry-pct-egr'] = formatPercent(laundryPctEgr);
    values['calc-laundry-per-unit'] = formatCurrency(laundryPerUnit);
    values['calc-laundry-per-sf'] = `$${laundryPerSf.toFixed(2)}`;
    values['calc-laundry-annual'] = formatCurrency(laundryIncome);

    // Total Other Revenue (Miscellaneous)
    const otherRevPctPrr = prr > 0 ? (totalOtherRevenue / prr) * 100 : 0;
    const otherRevPctPgr = pgr > 0 ? (totalOtherRevenue / pgr) * 100 : 0;
    const otherRevPctEgr = egr > 0 ? (totalOtherRevenue / egr) * 100 : 0;
    const otherRevPerUnit = totalUnits > 0 ? totalOtherRevenue / totalUnits : 0;
    const otherRevPerSf = totalSf > 0 ? totalOtherRevenue / totalSf : 0;

    values['calc-other-rev-pct-prr'] = formatPercent(otherRevPctPrr);
    values['calc-other-rev-pct-pgr'] = formatPercent(otherRevPctPgr);
    values['calc-other-rev-pct-egr'] = formatPercent(otherRevPctEgr);
    values['calc-other-rev-per-unit'] = formatCurrency(otherRevPerUnit);
    values['calc-other-rev-per-sf'] = `$${otherRevPerSf.toFixed(2)}`;
    values['calc-other-rev-annual'] = formatCurrency(totalOtherRevenue);

    // ========================================
    // ALL VACANCY LOSS SECTION
    // ========================================
    const vacancyPctPgr = pgr > 0 ? (Math.abs(vacancyLoss) / pgr) * 100 : 0;
    const vacancyPctEgr = egr > 0 ? (Math.abs(vacancyLoss) / egr) * 100 : 0;

    values['calc-vacancy-pct-pgr'] = formatPercent(vacancyPctPgr);
    values['calc-vacancy-pct-egr'] = formatPercent(vacancyPctEgr);

    // Total Vacancy & Credit Loss (same as vacancy for now)
    values['calc-total-vacancy-pct-pgr'] = formatPercent(vacancyPctPgr);
    values['calc-total-vacancy-pct-egr'] = formatPercent(vacancyPctEgr);
    values['calc-total-vacancy-per-unit'] = `(${formatCurrency(Math.abs(getFieldValue('calc-vacancy-per-unit')))})`;
    values['calc-total-vacancy-per-sf'] = `($${Math.abs(getFieldValue('calc-vacancy-per-sf')).toFixed(2)})`;
    values['calc-total-vacancy-loss'] = `(${formatCurrency(Math.abs(vacancyLoss))})`;

    // ========================================
    // OPERATING EXPENSES - Additional fields
    // ========================================
    const expenseRatioPgr = pgr > 0 ? (Math.abs(expensesTotal) / pgr) * 100 : 0;
    const expenseRatioEgr = egr > 0 ? (Math.abs(expensesTotal) / egr) * 100 : 0;

    values['calc-expense-ratio-pgr'] = formatPercent(expenseRatioPgr);
    values['calc-expense-ratio-egr'] = formatPercent(expenseRatioEgr);

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
    values['sca-concluded-value-per-unit'] = formatCurrency(indicatedValue / totalUnits);

    // ========================================
    // Historical fields (hist-*) for Page 43 Operating History
    // ========================================
    const histCategories = [
      'revenue-multifamily', 'revenue-rental', 'revenue-parking',
      'revenue-laundry', 'revenue-misc', 'pgr', 'vacancy', 'egr',
      'exp-taxes', 'exp-insurance', 'exp-repairs', 'exp-payroll',
      'exp-utilities', 'exp-management', 'exp-other', 'exp-total', 'noi'
    ];

    // Get historical PGR for percentage calculations
    const histPgr = getFieldValue('hist-pgr-total') || 1; // Avoid division by zero

    histCategories.forEach(cat => {
      const total = getFieldValue(`hist-${cat}-total`);
      const perUnit = getFieldValue(`hist-${cat}-per-unit`) || (totalUnits > 0 ? total / totalUnits : 0);

      // Calculate %PGR dynamically instead of reading from store (store has "0%" placeholder strings)
      let pctPgr = 0;
      if (cat === 'pgr') {
        pctPgr = 100; // PGR is always 100% of itself
      } else if (histPgr > 0) {
        pctPgr = (total / histPgr) * 100;
      }

      // Revenue/summary items are positive, expenses/vacancy are negative display
      const isExpense = cat.startsWith('exp-') || cat === 'vacancy';

      values[`hist-${cat}-total`] = isExpense ? `(${formatCurrency(Math.abs(total))})` : formatCurrency(total);
      values[`hist-${cat}-per-unit`] = isExpense ? `(${formatCurrency(Math.abs(perUnit))})` : formatCurrency(perUnit);
      values[`hist-${cat}-pct-pgr`] = isExpense ? `(${Math.abs(pctPgr).toFixed(1)}%)` : `${pctPgr.toFixed(1)}%`;
    });

    // ========================================
    // Projection %PGR fields for Page 43 Operating History table
    // ========================================
    const projPgr = pgr > 0 ? pgr : 1; // Avoid division by zero
    // Note: rentalRevenue, parkingIncome, laundryIncome already defined above (lines 191-194)
    const otherIncome = getFieldValue('calc-other-income') || 0;

    values['revenue-multifamily-proj-pct'] = formatPercent(rentalRevenue / projPgr * 100);
    values['revenue-rental-proj-pct'] = formatPercent(rentalRevenue / projPgr * 100);
    values['revenue-parking-proj-pct'] = formatPercent(parkingIncome / projPgr * 100);
    values['revenue-laundry-proj-pct'] = formatPercent(laundryIncome / projPgr * 100);
    values['revenue-laundry-proj-total'] = formatCurrency(laundryIncome); // Template uses this for laundry proj column
    values['revenue-misc-proj-pct'] = formatPercent(otherIncome / projPgr * 100);
    values['pgr-proj-pct'] = '100.00%';
    values['vacancy-proj-pct'] = formatPercent(Math.abs(vacancyLoss) / projPgr * 100);
    values['egr-proj-pct'] = formatPercent(egr / projPgr * 100);
    values['exp-total-proj-pct'] = formatPercent(Math.abs(expensesTotal) / projPgr * 100);
    values['noi-proj-pct'] = formatPercent(noi / projPgr * 100);

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
