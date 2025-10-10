// Field value mappings for dropdown fields between systems
// Based on FIELD-OPTIONS.md

// Property Type mappings
export const propertyTypeMap: Record<string, string> = {
  // APR App value → Display value for DocuSeal
  'commercial_office': 'Commercial Office',
  'retail_plaza': 'Retail Plaza', 
  'retail_standalone': 'Retail Standalone',
  'multi_family': 'Multi-Family',
  'single_family': 'Single Family',
  'industrial': 'Industrial',
  'industrial_warehouse': 'Industrial Warehouse',
  'industrial_manufacturing': 'Industrial Manufacturing',
  'mixed_use': 'Mixed-Use',
  'land': 'Land',
  'agricultural': 'Agricultural',
  'special_purpose': 'Special Purpose',
  'hotel': 'Hotel',
  // Fallback
  'commercial': 'Commercial Office',
  'residential': 'Single Family'
};

// Asset Condition mappings
export const assetConditionMap: Record<string, string> = {
  'excellent': 'Excellent',
  'very_good': 'Very Good',
  'good': 'Good',
  'fair': 'Fair',
  'poor': 'Poor',
  // Extended options
  'excellent_new': 'Excellent - New Construction',
  'excellent_renovated': 'Excellent - Recently Renovated',
  'very_good_maintained': 'Very Good - Well Maintained',
  'good_renovated': 'Good - Recently Renovated Common Areas',
  'fair_deferred': 'Fair - Deferred Maintenance',
  'poor_major': 'Poor - Requires Major Renovation'
};

// Intended Use mappings
export const intendedUseMap: Record<string, string> = {
  'financing': 'Financing',
  'refinancing': 'Refinancing',
  'purchase_sale': 'Purchase/Sale',
  'purchase': 'Purchase',
  'sale': 'Sale',
  'portfolio_review': 'Portfolio Review',
  'estate_planning': 'Estate Planning',
  'insurance': 'Insurance',
  'tax_appeal': 'Tax Appeal',
  'legal': 'Legal/Litigation',
  'internal': 'Internal Valuation',
  'partnership': 'Partnership Dissolution',
  // Legacy mappings
  'mortgage': 'Financing',
  'legal_litigation': 'Legal/Litigation',
  'internal_valuation': 'Internal Valuation'
};

// Report Type mappings
export const reportTypeMap: Record<string, string> = {
  'narrative': 'Full Narrative',
  'full': 'Full Narrative',
  'form': 'Form Report',
  'summary': 'Summary Report',
  'letter': 'Letter of Opinion',
  'restricted': 'Restricted Use',
  'desktop': 'Desktop Valuation',
  'driveby': 'Drive-By',
  'drive_by': 'Drive-By'
};

// Payment Terms mappings
export const paymentTermsMap: Record<string, string> = {
  '50_50': '50% Retainer, 50% on Delivery',
  '100_upfront': '100% Upfront',
  'net_30': 'Net 30',
  'net_15': 'Net 15',
  'due_receipt': 'Due on Receipt',
  'custom': 'Custom Terms',
  // Legacy mappings
  'half_half': '50% Retainer, 50% on Delivery',
  'upfront': '100% Upfront'
};

// Scope of Work mappings (based on Valcre dropdowns mentioned in Field-Map3.md)
export const scopeOfWorkMap: Record<string, string> = {
  'complete': 'All Applicable',
  'limited': 'Best One Approach',
  'desktop': 'Cost Approach',
  'drive_by': 'Direct Comparison Approach',
  'exterior': 'Direct Comparison Approach',
  'interior': 'All Applicable',
  // Additional based on standard appraisal scopes
  'full_inspection': 'All Applicable',
  'exterior_only': 'Direct Comparison Approach',
  'desktop_only': 'Desktop'
};

// Requested Value mappings (mentioned in Field-Map3.md)
export const requestedValueMap: Record<string, string> = {
  'as_is': 'As-Is',
  'as_complete': 'Prospective at Completion',
  'prospective': 'Prospective at Completion',
  'as_stabilized': 'Prospective at Stabilization',
  'as_vacant': 'As-Vacant',
  'replacement_cost': 'Insurable Replacement Cost',
  'liquidation': 'Liquidation',
  'in_use': 'In Use',
  'disposition': 'Disposition'
};

// Property Rights mappings
export const propertyRightsMap: Record<string, string> = {
  'fee_simple': 'Fee Simple',
  'leased_fee': 'Leased Fee',
  'leasehold': 'Leasehold',
  'partial_interest': 'Partial Interest',
  'life_estate': 'Life Estate',
  'easement': 'Easement',
  'air_rights': 'Air Rights'
};

// Helper function to convert any dropdown value
export function convertDropdownValue(
  fieldName: string, 
  value: string | undefined
): string {
  if (!value) return '';
  
  // Determine which map to use based on field name
  const mappings: Record<string, Record<string, string>> = {
    'property_type': propertyTypeMap,
    'propertyType': propertyTypeMap,
    'asset_condition': assetConditionMap,
    'assetCondition': assetConditionMap,
    'intended_use': intendedUseMap,
    'intendedUse': intendedUseMap,
    'report_type': reportTypeMap,
    'reportType': reportTypeMap,
    'payment_terms': paymentTermsMap,
    'paymentTerms': paymentTermsMap,
    'scope_of_work': scopeOfWorkMap,
    'scopeOfWork': scopeOfWorkMap,
    'requested_value': requestedValueMap,
    'requestedValue': requestedValueMap,
    'property_rights': propertyRightsMap,
    'propertyRights': propertyRightsMap,
    'propertyRightsAppraised': propertyRightsMap
  };
  
  // Find the appropriate mapping
  const map = mappings[fieldName];
  if (!map) return value; // Return original if no mapping found
  
  // Convert the value
  return map[value] || value; // Return mapped value or original if not found
}

// Export all maps for use in other files
export const fieldMappings = {
  propertyType: propertyTypeMap,
  assetCondition: assetConditionMap,
  intendedUse: intendedUseMap,
  reportType: reportTypeMap,
  paymentTerms: paymentTermsMap,
  scopeOfWork: scopeOfWorkMap,
  requestedValue: requestedValueMap,
  propertyRights: propertyRightsMap
};