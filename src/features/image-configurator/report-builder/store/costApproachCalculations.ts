/**
 * Cost Approach Calculations
 * ISOLATED from Income and Sales Approaches to prevent accidental damage
 *
 * Formula: Land Value + (RCN - Depreciation) + Site Improvements = Value
 *
 * Pure function: takes inputs, returns calculated outputs
 */

export function runCostApproachCalculations(inputs: Record<string, any>): Record<string, number> {
  const outputs: Record<string, number> = {};

  // Land Value
  outputs['cost-land-value'] = (parseFloat(inputs['cost-land-sf']) || 0) * (parseFloat(inputs['cost-land-rate-per-sf']) || 0);

  // RCN
  outputs['cost-rcn-direct-costs'] = (parseFloat(inputs['cost-rcn-gba']) || 0) * (parseFloat(inputs['cost-rcn-rate-per-sf']) || 0);
  outputs['cost-rcn-indirect-costs'] = outputs['cost-rcn-direct-costs'] * ((parseFloat(inputs['cost-rcn-indirect-pct']) || 0) / 100);
  outputs['cost-rcn-entrepreneur-amt'] = (outputs['cost-rcn-direct-costs'] + outputs['cost-rcn-indirect-costs']) * ((parseFloat(inputs['cost-rcn-entrepreneur-pct']) || 0) / 100);
  outputs['cost-rcn-total'] = outputs['cost-rcn-direct-costs'] + outputs['cost-rcn-indirect-costs'] + outputs['cost-rcn-entrepreneur-amt'];

  // Depreciation
  const economicLife = parseFloat(inputs['cost-depr-physical-life']) || 50;
  const effectiveAge = parseFloat(inputs['cost-depr-physical-effective-age']) || 0;

  outputs['cost-depr-physical-remaining-life'] = economicLife - effectiveAge;
  outputs['cost-depr-physical-pct'] = economicLife > 0 ? (effectiveAge / economicLife) * 100 : 0;
  outputs['cost-depr-physical-amt'] = outputs['cost-rcn-total'] * (outputs['cost-depr-physical-pct'] / 100);

  const functionalObs = parseFloat(inputs['cost-depr-functional-total']) || 0;
  const externalObs = parseFloat(inputs['cost-depr-external-total']) || 0;

  outputs['cost-depr-total-amt'] = outputs['cost-depr-physical-amt'] + functionalObs + externalObs;
  outputs['cost-depr-total-pct'] = outputs['cost-rcn-total'] > 0 ? (outputs['cost-depr-total-amt'] / outputs['cost-rcn-total']) * 100 : 0;

  // Site Improvements
  outputs['cost-site-parking-total'] = (parseFloat(inputs['cost-site-parking-spaces']) || 0) * (parseFloat(inputs['cost-site-parking-cost']) || 0);
  outputs['cost-site-total'] = outputs['cost-site-parking-total'] +
    (parseFloat(inputs['cost-site-landscaping']) || 0) +
    (parseFloat(inputs['cost-site-paving']) || 0) +
    (parseFloat(inputs['cost-site-utilities']) || 0) +
    (parseFloat(inputs['cost-site-other']) || 0);

  // Final Value
  outputs['cost-depreciated-value'] = outputs['cost-rcn-total'] - outputs['cost-depr-total-amt'];
  outputs['cost-indicated-value'] = outputs['cost-land-value'] + outputs['cost-depreciated-value'] + outputs['cost-site-total'];

  return outputs;
}

