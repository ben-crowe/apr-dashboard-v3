/**
 * Sales Comparison Approach Calculations
 * ISOLATED from Income Approach to prevent accidental damage
 *
 * Pure function: takes inputs, returns calculated outputs
 */

export function runSalesCompCalculations(inputs: Record<string, any>): Record<string, number> {
  const outputs: Record<string, number> = {};

  for (let i = 1; i <= 5; i++) {
    const prefix = `comp${i}`;
    const salePrice = parseFloat(inputs[`${prefix}-sale-price`]) || 0;
    const units = parseFloat(inputs[`${prefix}-units`]) || 0;
    const gba = parseFloat(inputs[`${prefix}-gba`]) || 0;

    // Basic per-unit/per-sf
    outputs[`${prefix}-price-per-unit`] = units > 0 ? salePrice / units : 0;
    outputs[`${prefix}-price-per-sf`] = gba > 0 ? salePrice / gba : 0;

    // Sum transactional adjustments
    const transAdj = ['property-rights', 'financing', 'sale-conditions', 'market-conditions']
      .reduce((sum, adj) => sum + (parseFloat(inputs[`${prefix}-adj-${adj}`]) || 0), 0);

    // Sum physical adjustments
    const physAdj = ['location', 'size', 'age-condition', 'other']
      .reduce((sum, adj) => sum + (parseFloat(inputs[`${prefix}-adj-${adj}`]) || 0), 0);

    outputs[`${prefix}-total-trans-adj`] = transAdj;
    outputs[`${prefix}-total-phys-adj`] = physAdj;
    outputs[`${prefix}-net-adj`] = transAdj + physAdj;
    outputs[`${prefix}-gross-adj`] = Math.abs(transAdj) + Math.abs(physAdj);

    // Adjusted price per unit
    const pricePerUnit = outputs[`${prefix}-price-per-unit`];
    outputs[`${prefix}-adj-price-per-unit`] = pricePerUnit * (1 + (transAdj + physAdj) / 100);
  }

  // Calculate indicated value from average of adjusted prices
  const validComps = [1,2,3,4,5].filter(i =>
    (parseFloat(inputs[`comp${i}-sale-price`]) || 0) > 0
  );

  if (validComps.length > 0) {
    const avgAdjPrice = validComps.reduce((sum, i) =>
      sum + outputs[`comp${i}-adj-price-per-unit`], 0
    ) / validComps.length;

    const subjectUnits = parseFloat(inputs['calc-total-units']) || parseFloat(inputs['property-total-units']) || 0;
    outputs['sca-indicated-value'] = avgAdjPrice * subjectUnits;

    // Value per SF for template
    const subjectSf = parseFloat(inputs['calc-total-sf']) || parseFloat(inputs['property-nra']) || parseFloat(inputs['subject-nra']) || 0;
    outputs['sca-value-per-sf'] = subjectSf > 0 ? outputs['sca-indicated-value'] / subjectSf : 0;
  }

  return outputs;
}

