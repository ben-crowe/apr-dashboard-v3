/**
 * Income Approach Calculation Engine
 * 
 * Pure functions for calculating all 78 output fields from 49 input fields
 * Based on Valcre workbook DIRECTCAP sheet logic
 */

import type { CalculatorInputs, CalculatorOutputs } from '../store/calculatorStore';

/**
 * Main calculation function - calculates all 78 outputs from inputs
 */
export function calculateIncomeApproach(inputs: CalculatorInputs): CalculatorOutputs {
  // 1. Unit Mix Calculations (30 outputs)
  const unitMix = calculateUnitMix(inputs);
  
  // 2. Other Income Calculations (3 outputs)
  const otherIncome = calculateOtherIncome(inputs, unitMix.totalUnits);
  
  // 3. Revenue Summary (7 outputs)
  const revenue = calculateRevenue(unitMix, otherIncome);
  
  // 4. Vacancy & Loss Calculations (5 outputs)
  const vacancy = calculateVacancy(inputs, revenue.pgr, unitMix.totalUnits);
  
  // 5. EGR Calculation
  const egr = revenue.pgr - vacancy.totalVacancyLoss;
  const egrPerUnit = unitMix.totalUnits > 0 ? egr / unitMix.totalUnits : 0;
  const egrPerSF = unitMix.totalSF > 0 ? egr / unitMix.totalSF : 0;
  
  // 6. Operating Expenses Calculations (24 outputs)
  const expenses = calculateExpenses(inputs, egr, unitMix.totalUnits, unitMix.totalSF);
  
  // 7. NOI Calculations (3 outputs)
  const noi = egr - expenses.total;
  const noiPerUnit = unitMix.totalUnits > 0 ? noi / unitMix.totalUnits : 0;
  const noiPerSF = unitMix.totalSF > 0 ? noi / unitMix.totalSF : 0;
  
  // 8. Capitalization & Value Calculations (6 outputs)
  const value = calculateValue(noi, inputs, unitMix.totalUnits, unitMix.totalSF, revenue.totalRentalRevenue);
  
  // Combine all outputs
  return {
    ...unitMix,
    ...otherIncome,
    ...revenue,
    ...vacancy,
    'calc-egr': egr,
    'calc-egr-per-unit': egrPerUnit,
    'calc-egr-per-sf': egrPerSF,
    ...expenses,
    'calc-noi': noi,
    'calc-noi-per-unit': noiPerUnit,
    'calc-noi-per-sf': noiPerSF,
    ...value,
  };
}

/**
 * Calculate Unit Mix totals and per-type calculations
 */
function calculateUnitMix(inputs: CalculatorInputs) {
  const types = [1, 2, 3, 4, 5, 6] as const;
  
  // Per-type calculations
  const perType: Partial<CalculatorOutputs> = {};
  let totalUnits = 0;
  let totalSF = 0;
  let totalContractRent = 0;
  let totalMarketRent = 0;
  let subtotalAnnual = 0;
  
  types.forEach((type) => {
    const count = inputs[`calc-type${type}-count` as keyof CalculatorInputs] as number || 0;
    const sf = inputs[`calc-type${type}-sf` as keyof CalculatorInputs] as number || 0;
    const contractRent = inputs[`calc-type${type}-contract-rent` as keyof CalculatorInputs] as number || 0;
    const marketRent = inputs[`calc-type${type}-rent` as keyof CalculatorInputs] as number || 0;
    
    // Per-type calculations
    const totalSFForType = count * sf;
    const annualRent = count * marketRent * 12;
    const perUnit = marketRent * 12;
    const perSF = sf > 0 ? perUnit / sf : 0;
    const contVMarket = marketRent > 0 ? (contractRent / marketRent) * 100 : 0;
    
    perType[`calc-type${type}-total-sf` as keyof CalculatorOutputs] = totalSFForType;
    perType[`calc-type${type}-annual` as keyof CalculatorOutputs] = annualRent;
    perType[`calc-type${type}-per-unit` as keyof CalculatorOutputs] = perUnit;
    perType[`calc-type${type}-per-sf` as keyof CalculatorOutputs] = perSF;
    perType[`calc-type${type}-cont-v-market` as keyof CalculatorOutputs] = contVMarket;
    
    // Accumulate totals
    totalUnits += count;
    totalSF += totalSFForType;
    totalContractRent += count * contractRent;
    totalMarketRent += count * marketRent;
    subtotalAnnual += annualRent;
  });
  
  // Calculate averages
  const avgContractRent = totalUnits > 0 ? totalContractRent / totalUnits : 0;
  const avgMarketRent = totalUnits > 0 ? totalMarketRent / totalUnits : 0;
  
  return {
    ...perType,
    'calc-total-units': totalUnits,
    'calc-total-sf': totalSF,
    'calc-avg-contract-rent': avgContractRent,
    'calc-avg-market-rent': avgMarketRent,
    'calc-subtotal-annual': subtotalAnnual,
  } as CalculatorOutputs;
}

/**
 * Calculate Other Income totals
 */
function calculateOtherIncome(inputs: CalculatorInputs, totalUnits: number): Partial<CalculatorOutputs> {
  const parkingPerUnit = inputs['calc-parking-per-unit'] || 0;
  const laundryPerUnit = inputs['calc-laundry-per-unit'] || 0;
  const otherIncomeAnnual = inputs['calc-other-income-annual'] || 0;
  
  const parkingAnnual = parkingPerUnit * totalUnits * 12;
  const laundryAnnual = laundryPerUnit * totalUnits * 12;
  const totalOtherIncome = parkingAnnual + laundryAnnual + otherIncomeAnnual;
  
  return {
    'calc-parking-annual': parkingAnnual,
    'calc-laundry-annual': laundryAnnual,
    'calc-total-other-income': totalOtherIncome,
  };
}

/**
 * Calculate Revenue Summary (PGR)
 */
function calculateRevenue(
  unitMix: Partial<CalculatorOutputs>,
  otherIncome: Partial<CalculatorOutputs>
): Partial<CalculatorOutputs> {
  const totalRentalRevenue = unitMix['calc-subtotal-annual'] || 0;
  const totalOtherIncome = otherIncome['calc-total-other-income'] || 0;
  const totalUnits = unitMix['calc-total-units'] || 0;
  const totalSF = unitMix['calc-total-sf'] || 0;
  
  const pgr = totalRentalRevenue + totalOtherIncome;
  const pgrPerUnit = totalUnits > 0 ? pgr / totalUnits : 0;
  const pgrPerSF = totalSF > 0 ? pgr / totalSF : 0;
  
  return {
    'calc-total-rental-revenue': totalRentalRevenue,
    'calc-pgr': pgr,
    'calc-pgr-per-unit': pgrPerUnit,
    'calc-pgr-per-sf': pgrPerSF,
  };
}

/**
 * Calculate Vacancy & Loss
 */
function calculateVacancy(
  inputs: CalculatorInputs,
  pgr: number,
  totalUnits: number
): Partial<CalculatorOutputs> {
  const vacancyRate = inputs['calc-vacancy-rate'] || 0;
  const concessionsRate = inputs['calc-concessions-rate'] || 0;
  const creditLossRate = inputs['calc-credit-loss-rate'] || 0;
  const otherLossRate = inputs['calc-other-loss-rate'] || 0;
  
  const totalVacancyRate = vacancyRate + concessionsRate + creditLossRate + otherLossRate;
  const totalVacancyLoss = pgr * (totalVacancyRate / 100);
  const vacancyAmount = pgr * (vacancyRate / 100);
  const vacancyPerUnit = totalUnits > 0 ? totalVacancyLoss / totalUnits : 0;
  
  return {
    'calc-vacancy-amount': vacancyAmount,
    'calc-total-vacancy-loss': totalVacancyLoss,
    'calc-total-vacancy-rate': totalVacancyRate,
    'calc-vacancy-loss': totalVacancyLoss, // Alias
    'calc-vacancy-per-unit': vacancyPerUnit,
  };
}

/**
 * Calculate Operating Expenses (per-category and totals)
 */
function calculateExpenses(
  inputs: CalculatorInputs,
  egr: number,
  totalUnits: number,
  totalSF: number
): Partial<CalculatorOutputs> {
  const expenseCategories = [
    'taxes',
    'insurance',
    'repairs',
    'utilities',
    'management',
    'reserves',
    'other',
  ] as const;
  
  const perCategory: Partial<CalculatorOutputs> = {};
  let expensesTotal = 0;
  
  expenseCategories.forEach((category) => {
    const annual = inputs[`calc-exp-${category}-annual` as keyof CalculatorInputs] as number || 0;
    const perUnit = totalUnits > 0 ? annual / totalUnits : 0;
    const perSF = totalSF > 0 ? annual / totalSF : 0;
    const pctEGR = egr > 0 ? (annual / egr) * 100 : 0;
    
    perCategory[`calc-exp-${category}-per-unit` as keyof CalculatorOutputs] = perUnit;
    perCategory[`calc-exp-${category}-per-sf` as keyof CalculatorOutputs] = perSF;
    perCategory[`calc-exp-${category}-pct-egr` as keyof CalculatorOutputs] = pctEGR;
    
    expensesTotal += annual;
  });
  
  const expensesPerUnit = totalUnits > 0 ? expensesTotal / totalUnits : 0;
  const expenseRatio = egr > 0 ? (expensesTotal / egr) * 100 : 0;
  
  return {
    ...perCategory,
    'calc-expenses-total': expensesTotal,
    'calc-expenses-per-unit': expensesPerUnit,
    'calc-expense-ratio': expenseRatio,
  };
}

/**
 * Calculate Capitalization & Value Indication
 */
function calculateValue(
  noi: number,
  inputs: CalculatorInputs,
  totalUnits: number,
  totalSF: number,
  totalRentalRevenue: number
): Partial<CalculatorOutputs> {
  const capRate = inputs['calc-cap-rate'] || 0;
  const adjCapex = inputs['calc-adj-capex'] || 0;
  const adjLeasing = inputs['calc-adj-leasing'] || 0;
  const adjOther = inputs['calc-adj-other'] || 0;
  
  // Raw value = NOI / Cap Rate
  const rawValue = capRate > 0 ? noi / (capRate / 100) : 0;
  
  // Total adjustments
  const adjTotal = adjCapex + adjLeasing + adjOther;
  
  // Indicated value = Raw value + adjustments, rounded to nearest $10,000
  const indicatedValue = Math.round((rawValue + adjTotal) / 10000) * 10000;
  
  // Per-unit and per-SF values
  const valuePerUnit = totalUnits > 0 ? indicatedValue / totalUnits : 0;
  const valuePerSF = totalSF > 0 ? indicatedValue / totalSF : 0;
  
  // Gross Rent Multiplier = Value / Rental Revenue
  const grm = totalRentalRevenue > 0 ? indicatedValue / totalRentalRevenue : 0;
  
  return {
    'calc-raw-value': rawValue,
    'calc-adj-total': adjTotal,
    'calc-indicated-value': indicatedValue,
    'calc-value-per-unit': valuePerUnit,
    'calc-value-per-sf': valuePerSF,
    'calc-grm': grm,
  };
}
