/**
 * Field Generators - Pattern-based field generation
 *
 * Reduces repetitive manual field entries by generating them programmatically.
 * Used for sales comp adjustment fields and other repetitive patterns.
 */

import { FieldDefinition } from './fieldRegistry';

/**
 * Generate all 40 sales comp adjustment fields
 * 5 comps × 8 adjustment categories = 40 fields
 *
 * Categories: property-rights, financing, sale-conditions, market-conditions,
 *             location, size, age-condition, other
 *
 * @returns Array of 40 FieldDefinition objects
 */
export function generateAdjustmentFields(): FieldDefinition[] {
  const adjustmentCategories = [
    'property-rights',
    'financing',
    'sale-conditions',
    'market-conditions',
    'location',
    'size',
    'age-condition',
    'other'
  ];

  const categoryLabels: Record<string, string> = {
    'property-rights': 'Property Rights',
    'financing': 'Financing',
    'sale-conditions': 'Sale Conditions',
    'market-conditions': 'Market Conditions',
    'location': 'Location',
    'size': 'Size',
    'age-condition': 'Age/Condition',
    'other': 'Other'
  };

  const fields: FieldDefinition[] = [];

  for (let comp = 1; comp <= 5; comp++) {
    for (const category of adjustmentCategories) {
      const fieldId = `comp${comp}-adj-${category}`;
      fields.push({
        id: fieldId,
        storeId: fieldId,
        label: `${categoryLabels[category]} Adj %`,
        section: 'sales',
        subsection: `sale-comp-${comp}`,
        type: 'percentage',
        inputSource: 'user-input',
        required: false
      });
    }
  }

  return fields;
}

/**
 * Generate default values for all 40 adjustment fields
 * All defaults set to 0 for clean initial state
 *
 * @returns Object with 40 key-value pairs (all values = 0)
 */
export function generateAdjustmentDefaults(): Record<string, number> {
  const adjustmentCategories = [
    'property-rights',
    'financing',
    'sale-conditions',
    'market-conditions',
    'location',
    'size',
    'age-condition',
    'other'
  ];

  const defaults: Record<string, number> = {};

  for (let comp = 1; comp <= 5; comp++) {
    for (const category of adjustmentCategories) {
      defaults[`comp${comp}-adj-${category}`] = 0;
    }
  }

  return defaults;
}
