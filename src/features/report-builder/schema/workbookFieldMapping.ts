/**
 * Valcre Workbook → APR Dashboard Field Mapping
 * 
 * This file provides bidirectional mapping between:
 * - Valcre named ranges (from .xlsm workbook)
 * - APR Dashboard field registry IDs
 * 
 * Generated from:
 * - valcre-field-registry.ts (134 fields from .docx extraction)
 * - table-structures.ts (7,988 named ranges, cell positions)
 * - fieldRegistry.ts (519 APR Dashboard fields)
 * 
 * @generated 2024-12-18
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface FieldMapping {
  valcreId: string;           // Valcre named range (e.g., 'IA_DirCap_NOI')
  registryId: string;         // APR Dashboard field ID (e.g., 'calc-noi')
  type: 'text' | 'number' | 'currency' | 'percentage' | 'date' | 'image' | 'select';
  section: string;            // Logical section in report
  description: string;        // Human-readable description
  tableLocation?: {           // Where this appears in tables
    sheet: string;
    cell?: string;
    row?: number;
    column?: string;
  };
}

// ============================================================================
// COVER / PROPERTY IDENTIFICATION
// ============================================================================

export const coverMappings: FieldMapping[] = [
  { valcreId: 'PropertyName', registryId: 'property-name', type: 'text', section: 'cover', description: 'Property name' },
  { valcreId: 'PropertyStreetAddress', registryId: 'street-address', type: 'text', section: 'cover', description: 'Street address' },
  { valcreId: 'PropertyFullAddress', registryId: 'property-full-address', type: 'text', section: 'cover', description: 'Full property address' },
  { valcreId: 'PropertyCity', registryId: 'city', type: 'text', section: 'cover', description: 'City' },
  { valcreId: 'PropertyProvince', registryId: 'province', type: 'text', section: 'cover', description: 'Province full name' },
  { valcreId: 'PropertyProvinceAbbr', registryId: 'province-abbr', type: 'text', section: 'cover', description: 'Province abbreviation' },
  { valcreId: 'PropertyType', registryId: 'property-type-display', type: 'text', section: 'cover', description: 'Property type description' },
  { valcreId: 'BuildingStyle', registryId: 'building-style', type: 'text', section: 'exec', description: 'Building style (walkup, etc.)' },
  { valcreId: 'BuildingType', registryId: 'building-format', type: 'text', section: 'exec', description: 'Building type/format' },
  { valcreId: 'DateOfValuation', registryId: 'valuation-date', type: 'date', section: 'cover', description: 'Effective date of valuation' },
  { valcreId: 'DateOfReport', registryId: 'report-date', type: 'date', section: 'cover', description: 'Date report was prepared' },
  { valcreId: 'FileNo', registryId: 'file-number', type: 'text', section: 'cover', description: 'File reference number' },
  { valcreId: 'InterestAppraised', registryId: 'interest-appraised', type: 'text', section: 'exec', description: 'Interest appraised (Fee Simple, etc.)' },
  { valcreId: 'ValueType', registryId: 'value-scenarios', type: 'text', section: 'exec', description: 'Type of value (As Is, As Stabilized, etc.)' },
];

// ============================================================================
// CLIENT INFORMATION
// ============================================================================

export const clientMappings: FieldMapping[] = [
  { valcreId: 'ClientName', registryId: 'client-contact-name', type: 'text', section: 'cover', description: 'Client contact name' },
  { valcreId: 'ClientCompany', registryId: 'client-company-name', type: 'text', section: 'cover', description: 'Client company name' },
  { valcreId: 'ClientTitle', registryId: 'client-title', type: 'text', section: 'cover', description: 'Client title' },
  { valcreId: 'ClientAddress1', registryId: 'client-organization-address', type: 'text', section: 'cover', description: 'Client address line 1' },
  { valcreId: 'ClientCity', registryId: 'client-city', type: 'text', section: 'cover', description: 'Client city' },
  { valcreId: 'ClientProvince', registryId: 'client-province', type: 'text', section: 'cover', description: 'Client province' },
  { valcreId: 'ClientPostalCode', registryId: 'client-postal', type: 'text', section: 'cover', description: 'Client postal code' },
];

// ============================================================================
// APPRAISER INFORMATION
// ============================================================================

export const appraiserMappings: FieldMapping[] = [
  { valcreId: 'AppraiserName', registryId: 'appraiser-name', type: 'text', section: 'cover', description: 'Appraiser name with designations' },
  { valcreId: 'AppraiserTitle', registryId: 'appraiser-title', type: 'text', section: 'cover', description: 'Appraiser title' },
  { valcreId: 'AppraiserCompany', registryId: 'appraiser-company', type: 'text', section: 'cover', description: 'Appraiser company name' },
  { valcreId: 'AppraiserAddress1', registryId: 'appraiser-address', type: 'text', section: 'cover', description: 'Appraiser address' },
  { valcreId: 'AppraiserCity', registryId: 'appraiser-city', type: 'text', section: 'cover', description: 'Appraiser city' },
  { valcreId: 'AppraiserProvince', registryId: 'appraiser-province', type: 'text', section: 'cover', description: 'Appraiser province' },
  { valcreId: 'AppraiserPostalCode', registryId: 'appraiser-postal', type: 'text', section: 'cover', description: 'Appraiser postal code' },
  { valcreId: 'AppraiserPhone', registryId: 'appraiser-phone', type: 'text', section: 'cover', description: 'Appraiser phone' },
  { valcreId: 'AppraiserEmail', registryId: 'appraiser-email', type: 'text', section: 'cover', description: 'Appraiser email' },
  { valcreId: 'AppraiserWebsite', registryId: 'appraiser-website', type: 'text', section: 'cover', description: 'Appraiser website' },
  { valcreId: 'AppraiserAICNo', registryId: 'appraiser-aic-number', type: 'text', section: 'cover', description: 'AIC membership number' },
];

// ============================================================================
// PHYSICAL / SITE CHARACTERISTICS
// ============================================================================

export const physicalMappings: FieldMapping[] = [
  { valcreId: 'TotalUnits', registryId: 'total-units', type: 'number', section: 'exec', description: 'Total unit count' },
  { valcreId: 'TotalBuildings', registryId: 'total-buildings', type: 'number', section: 'exec', description: 'Number of buildings' },
  { valcreId: 'NRA_SF', registryId: 'total-nra', type: 'number', section: 'exec', description: 'Net rentable area in SF' },
  { valcreId: 'Stories', registryId: 'stories', type: 'number', section: 'exec', description: 'Number of stories' },
  { valcreId: 'YearBuilt', registryId: 'year-built', type: 'number', section: 'exec', description: 'Year constructed' },
  { valcreId: 'YearBuiltWeighted', registryId: 'year-built-weighted', type: 'number', section: 'impv', description: 'Weighted average year built' },
  { valcreId: 'Occupancy_Pct', registryId: 'occupancy-rate', type: 'percentage', section: 'exec', description: 'Current occupancy percentage' },
  { valcreId: 'SiteArea_SF', registryId: 'site-total-area', type: 'number', section: 'site', description: 'Site area in square feet' },
  { valcreId: 'SiteArea_AC', registryId: 'site-acreage', type: 'number', section: 'site', description: 'Site area in acres' },
  { valcreId: 'FootprintSF', registryId: 'impv-building-footprint', type: 'number', section: 'impv', description: 'Building footprint in SF' },
  { valcreId: 'SiteCoverage_Pct', registryId: 'impv-site-coverage', type: 'percentage', section: 'impv', description: 'Building footprint / site area' },
];

// ============================================================================
// INCOME APPROACH - DIRECT CAPITALIZATION
// Sheet: DIRECTCAP
// ============================================================================

export const incomeApproachMappings: FieldMapping[] = [
  // Revenue
  { 
    valcreId: 'IA_DirCap_PGI', 
    registryId: 'calc-pgr', 
    type: 'currency', 
    section: 'calc', 
    description: 'Potential Gross Revenue',
    tableLocation: { sheet: 'DIRECTCAP', row: 218, column: 'L' }
  },
  { 
    valcreId: 'IA_DirCap_PGIUnit', 
    registryId: 'calc-pgr-per-unit', 
    type: 'currency', 
    section: 'calc', 
    description: 'PGR per unit',
    tableLocation: { sheet: 'DIRECTCAP', row: 218, column: 'I' }
  },
  { 
    valcreId: 'IA_DirCap_PGIPSF', 
    registryId: 'calc-pgr-per-sf', 
    type: 'number', 
    section: 'calc', 
    description: 'PGR per square foot',
    tableLocation: { sheet: 'DIRECTCAP', row: 218, column: 'J' }
  },
  
  // Vacancy
  { 
    valcreId: 'IA_DirCap_VacLoss', 
    registryId: 'calc-vacancy-rate', 
    type: 'percentage', 
    section: 'calc', 
    description: 'Vacancy rate',
    tableLocation: { sheet: 'DIRECTCAP', row: 220, column: 'G' }
  },
  { 
    valcreId: 'IA_DirCap_VacancyTotal', 
    registryId: 'calc-vacancy-loss', 
    type: 'currency', 
    section: 'calc', 
    description: 'Vacancy loss amount',
    tableLocation: { sheet: 'DIRECTCAP', row: 220, column: 'L' }
  },

  // Effective Gross Revenue
  { 
    valcreId: 'IA_DirCap_EGI', 
    registryId: 'calc-egr', 
    type: 'currency', 
    section: 'calc', 
    description: 'Effective Gross Revenue',
    tableLocation: { sheet: 'DIRECTCAP', row: 225, column: 'L' }
  },
  { 
    valcreId: 'IA_DirCap_EGIUnit', 
    registryId: 'calc-egr-per-unit', 
    type: 'currency', 
    section: 'calc', 
    description: 'EGR per unit',
    tableLocation: { sheet: 'DIRECTCAP', row: 225, column: 'I' }
  },
  { 
    valcreId: 'IA_DirCap_EGIPSF', 
    registryId: 'calc-egr-per-sf', 
    type: 'number', 
    section: 'calc', 
    description: 'EGR per square foot',
    tableLocation: { sheet: 'DIRECTCAP', row: 225, column: 'J' }
  },

  // Operating Expenses
  { 
    valcreId: 'IA_DirCap_Expenses', 
    registryId: 'calc-expenses-total', 
    type: 'currency', 
    section: 'calc', 
    description: 'Total operating expenses',
    tableLocation: { sheet: 'DIRECTCAP', row: 252, column: 'L' }
  },
  { 
    valcreId: 'IA_DirCap_ExpenseRatio', 
    registryId: 'calc-expense-ratio', 
    type: 'percentage', 
    section: 'calc', 
    description: 'Operating expense ratio',
    tableLocation: { sheet: 'DIRECTCAP', row: 252, column: 'H' }
  },
  { 
    valcreId: 'IA_DirCap_OpEx', 
    registryId: 'calc-expenses-total', 
    type: 'currency', 
    section: 'calc', 
    description: 'Operating expenses (alias)',
  },
  { 
    valcreId: 'IA_DirCap_OpEx_PerUnit', 
    registryId: 'calc-expenses-per-unit', 
    type: 'currency', 
    section: 'calc', 
    description: 'OpEx per unit',
  },
  { 
    valcreId: 'IA_DirCap_OpEx_PSF', 
    registryId: 'calc-expenses-per-sf', 
    type: 'number', 
    section: 'calc', 
    description: 'OpEx per square foot',
  },

  // Net Operating Income
  { 
    valcreId: 'IA_DirCap_NOI', 
    registryId: 'calc-noi', 
    type: 'currency', 
    section: 'calc', 
    description: 'Net Operating Income',
    tableLocation: { sheet: 'DIRECTCAP', row: 253, column: 'L' }
  },
  { 
    valcreId: 'IA_DirCap_NOIUnit', 
    registryId: 'calc-noi-per-unit', 
    type: 'currency', 
    section: 'calc', 
    description: 'NOI per unit',
    tableLocation: { sheet: 'DIRECTCAP', row: 253, column: 'I' }
  },
  { 
    valcreId: 'IA_DirCap_NOIPSF', 
    registryId: 'calc-noi-per-sf', 
    type: 'number', 
    section: 'calc', 
    description: 'NOI per square foot',
    tableLocation: { sheet: 'DIRECTCAP', row: 253, column: 'J' }
  },

  // Capitalization
  { 
    valcreId: 'IA_DirCap_CapRate', 
    registryId: 'calc-cap-rate', 
    type: 'percentage', 
    section: 'calc', 
    description: 'Capitalization rate',
  },
  { 
    valcreId: 'IA_DirCap_CapRate1', 
    registryId: 'calc-cap-rate', 
    type: 'percentage', 
    section: 'calc', 
    description: 'Capitalization rate (primary)',
    tableLocation: { sheet: 'DIRECTCAP', row: 254, column: 'L' }
  },

  // Value Conclusions
  { 
    valcreId: 'IA_DirCap_Value', 
    registryId: 'calc-indicated-value', 
    type: 'currency', 
    section: 'calc', 
    description: 'Indicated value by income approach',
  },
  { 
    valcreId: 'IA_DirCap_Value1', 
    registryId: 'calc-indicated-value', 
    type: 'currency', 
    section: 'calc', 
    description: 'Indicated value scenario 1',
    tableLocation: { sheet: 'DIRECTCAP', row: 257, column: 'L' }
  },
  { 
    valcreId: 'IA_DirCap_ValuePerUnit1.6', 
    registryId: 'calc-value-per-unit', 
    type: 'currency', 
    section: 'calc', 
    description: 'Value per unit',
    tableLocation: { sheet: 'DIRECTCAP', row: 257, column: 'I' }
  },
  { 
    valcreId: 'IA_DirCap_ValuePerUnit1.5', 
    registryId: 'calc-value-per-sf', 
    type: 'number', 
    section: 'calc', 
    description: 'Value per SF',
    tableLocation: { sheet: 'DIRECTCAP', row: 257, column: 'J' }
  },
];

// ============================================================================
// CAP RATE ANALYSIS
// ============================================================================

export const capRateMappings: FieldMapping[] = [
  { valcreId: 'CapRate_Average', registryId: 'cap-rate-average', type: 'percentage', section: 'cap_rate', description: 'Average cap rate from comps' },
  { valcreId: 'CapRate_Concluded', registryId: 'calc-cap-rate', type: 'percentage', section: 'cap_rate', description: 'Concluded cap rate' },
  { valcreId: 'CapRate_RangeHigh', registryId: 'cap-rate-range-high', type: 'percentage', section: 'cap_rate', description: 'High end of cap rate range' },
  { valcreId: 'CapRate_RangeLow', registryId: 'cap-rate-range-low', type: 'percentage', section: 'cap_rate', description: 'Low end of cap rate range' },
];

// ============================================================================
// SALES COMPARISON APPROACH
// Sheet: SALE1, SALE2
// ============================================================================

export const salesComparisonMappings: FieldMapping[] = [
  // DCA Summary
  { valcreId: 'DCA_Value', registryId: 'sales-value-indication', type: 'currency', section: 'sales', description: 'Value by sales comparison' },
  { valcreId: 'DCA_PricePerUnit_Concluded', registryId: 'dca-price-per-unit-concluded', type: 'currency', section: 'sales', description: 'Concluded price per unit' },
  { valcreId: 'DCA_PricePerUnit_High', registryId: 'dca-price-per-unit-high', type: 'currency', section: 'sales', description: 'High price per unit from comps' },
  { valcreId: 'DCA_PricePerUnit_Low', registryId: 'dca-price-per-unit-low', type: 'currency', section: 'sales', description: 'Low price per unit from comps' },
  
  // Sale Comp 1
  { valcreId: 'Sale1_PropertyName', registryId: 'comp1-name', type: 'text', section: 'sales', description: 'Comparable 1 property name' },
  { valcreId: 'Sale1_Address', registryId: 'comp1-address', type: 'text', section: 'sales', description: 'Comparable 1 address' },
  { valcreId: 'Sale1_City', registryId: 'comp1-city', type: 'text', section: 'sales', description: 'Comparable 1 city' },
  { valcreId: 'Sale1_SaleDate', registryId: 'comp1-sale-date', type: 'date', section: 'sales', description: 'Comparable 1 sale date' },
  { valcreId: 'Sale1_Price', registryId: 'comp1-sale-price', type: 'currency', section: 'sales', description: 'Comparable 1 sale price' },
  { valcreId: 'Sale1_Units', registryId: 'comp1-units', type: 'number', section: 'sales', description: 'Comparable 1 unit count' },
  { valcreId: 'Sale1_PricePerUnit', registryId: 'comp1-price-per-unit', type: 'currency', section: 'sales', description: 'Comparable 1 price per unit' },
  { valcreId: 'Sale1_NRA', registryId: 'comp1-gba', type: 'number', section: 'sales', description: 'Comparable 1 NRA/GBA' },
  { valcreId: 'Sale1_PricePerSF', registryId: 'comp1-price-per-sf', type: 'currency', section: 'sales', description: 'Comparable 1 price per SF' },
  { valcreId: 'Sale1_YearBuilt', registryId: 'comp1-year', type: 'number', section: 'sales', description: 'Comparable 1 year built' },
  { valcreId: 'Sale1_CapRate', registryId: 'comp1-cap-rate', type: 'percentage', section: 'sales', description: 'Comparable 1 cap rate' },
  { valcreId: 'Sale1_NOI', registryId: 'comp1-noi', type: 'currency', section: 'sales', description: 'Comparable 1 NOI' },
  { valcreId: 'Sale1_NOI_PerUnit', registryId: 'comp1-noi-per-unit', type: 'currency', section: 'sales', description: 'Comparable 1 NOI per unit' },

  // Sale Comp 2
  { valcreId: 'Sale2_PropertyName', registryId: 'comp2-name', type: 'text', section: 'sales', description: 'Comparable 2 property name' },
  { valcreId: 'Sale2_Address', registryId: 'comp2-address', type: 'text', section: 'sales', description: 'Comparable 2 address' },
  { valcreId: 'Sale2_City', registryId: 'comp2-city', type: 'text', section: 'sales', description: 'Comparable 2 city' },
  { valcreId: 'Sale2_SaleDate', registryId: 'comp2-sale-date', type: 'date', section: 'sales', description: 'Comparable 2 sale date' },
  { valcreId: 'Sale2_Price', registryId: 'comp2-sale-price', type: 'currency', section: 'sales', description: 'Comparable 2 sale price' },
  { valcreId: 'Sale2_Units', registryId: 'comp2-units', type: 'number', section: 'sales', description: 'Comparable 2 unit count' },
  { valcreId: 'Sale2_PricePerUnit', registryId: 'comp2-price-per-unit', type: 'currency', section: 'sales', description: 'Comparable 2 price per unit' },
  { valcreId: 'Sale2_NRA', registryId: 'comp2-gba', type: 'number', section: 'sales', description: 'Comparable 2 NRA/GBA' },
  { valcreId: 'Sale2_PricePerSF', registryId: 'comp2-price-per-sf', type: 'currency', section: 'sales', description: 'Comparable 2 price per SF' },
  { valcreId: 'Sale2_YearBuilt', registryId: 'comp2-year', type: 'number', section: 'sales', description: 'Comparable 2 year built' },
  { valcreId: 'Sale2_CapRate', registryId: 'comp2-cap-rate', type: 'percentage', section: 'sales', description: 'Comparable 2 cap rate' },
  { valcreId: 'Sale2_NOI', registryId: 'comp2-noi', type: 'currency', section: 'sales', description: 'Comparable 2 NOI' },
  { valcreId: 'Sale2_NOI_PerUnit', registryId: 'comp2-noi-per-unit', type: 'currency', section: 'sales', description: 'Comparable 2 NOI per unit' },

  // Sale Comp 3
  { valcreId: 'Sale3_PropertyName', registryId: 'comp3-name', type: 'text', section: 'sales', description: 'Comparable 3 property name' },
  { valcreId: 'Sale3_Address', registryId: 'comp3-address', type: 'text', section: 'sales', description: 'Comparable 3 address' },
  { valcreId: 'Sale3_City', registryId: 'comp3-city', type: 'text', section: 'sales', description: 'Comparable 3 city' },
  { valcreId: 'Sale3_SaleDate', registryId: 'comp3-sale-date', type: 'date', section: 'sales', description: 'Comparable 3 sale date' },
  { valcreId: 'Sale3_Price', registryId: 'comp3-sale-price', type: 'currency', section: 'sales', description: 'Comparable 3 sale price' },
  { valcreId: 'Sale3_Units', registryId: 'comp3-units', type: 'number', section: 'sales', description: 'Comparable 3 unit count' },
  { valcreId: 'Sale3_PricePerUnit', registryId: 'comp3-price-per-unit', type: 'currency', section: 'sales', description: 'Comparable 3 price per unit' },
  { valcreId: 'Sale3_NRA', registryId: 'comp3-gba', type: 'number', section: 'sales', description: 'Comparable 3 NRA/GBA' },
  { valcreId: 'Sale3_PricePerSF', registryId: 'comp3-price-per-sf', type: 'currency', section: 'sales', description: 'Comparable 3 price per SF' },
  { valcreId: 'Sale3_YearBuilt', registryId: 'comp3-year', type: 'number', section: 'sales', description: 'Comparable 3 year built' },
  { valcreId: 'Sale3_CapRate', registryId: 'comp3-cap-rate', type: 'percentage', section: 'sales', description: 'Comparable 3 cap rate' },
  { valcreId: 'Sale3_NOI', registryId: 'comp3-noi', type: 'currency', section: 'sales', description: 'Comparable 3 NOI' },
  { valcreId: 'Sale3_NOI_PerUnit', registryId: 'comp3-noi-per-unit', type: 'currency', section: 'sales', description: 'Comparable 3 NOI per unit' },

  // Sale Comp 4
  { valcreId: 'Sale4_PropertyName', registryId: 'comp4-name', type: 'text', section: 'sales', description: 'Comparable 4 property name' },
  { valcreId: 'Sale4_Address', registryId: 'comp4-address', type: 'text', section: 'sales', description: 'Comparable 4 address' },
  { valcreId: 'Sale4_City', registryId: 'comp4-city', type: 'text', section: 'sales', description: 'Comparable 4 city' },
  { valcreId: 'Sale4_SaleDate', registryId: 'comp4-sale-date', type: 'date', section: 'sales', description: 'Comparable 4 sale date' },
  { valcreId: 'Sale4_Price', registryId: 'comp4-sale-price', type: 'currency', section: 'sales', description: 'Comparable 4 sale price' },
  { valcreId: 'Sale4_Units', registryId: 'comp4-units', type: 'number', section: 'sales', description: 'Comparable 4 unit count' },
  { valcreId: 'Sale4_PricePerUnit', registryId: 'comp4-price-per-unit', type: 'currency', section: 'sales', description: 'Comparable 4 price per unit' },
  { valcreId: 'Sale4_NRA', registryId: 'comp4-gba', type: 'number', section: 'sales', description: 'Comparable 4 NRA/GBA' },
  { valcreId: 'Sale4_PricePerSF', registryId: 'comp4-price-per-sf', type: 'currency', section: 'sales', description: 'Comparable 4 price per SF' },
  { valcreId: 'Sale4_YearBuilt', registryId: 'comp4-year', type: 'number', section: 'sales', description: 'Comparable 4 year built' },
  { valcreId: 'Sale4_CapRate', registryId: 'comp4-cap-rate', type: 'percentage', section: 'sales', description: 'Comparable 4 cap rate' },
  { valcreId: 'Sale4_NOI', registryId: 'comp4-noi', type: 'currency', section: 'sales', description: 'Comparable 4 NOI' },
  { valcreId: 'Sale4_NOI_PerUnit', registryId: 'comp4-noi-per-unit', type: 'currency', section: 'sales', description: 'Comparable 4 NOI per unit' },

  // Sale Comp 5
  { valcreId: 'Sale5_PropertyName', registryId: 'comp5-name', type: 'text', section: 'sales', description: 'Comparable 5 property name' },
  { valcreId: 'Sale5_Address', registryId: 'comp5-address', type: 'text', section: 'sales', description: 'Comparable 5 address' },
  { valcreId: 'Sale5_City', registryId: 'comp5-city', type: 'text', section: 'sales', description: 'Comparable 5 city' },
  { valcreId: 'Sale5_SaleDate', registryId: 'comp5-sale-date', type: 'date', section: 'sales', description: 'Comparable 5 sale date' },
  { valcreId: 'Sale5_Price', registryId: 'comp5-sale-price', type: 'currency', section: 'sales', description: 'Comparable 5 sale price' },
  { valcreId: 'Sale5_Units', registryId: 'comp5-units', type: 'number', section: 'sales', description: 'Comparable 5 unit count' },
  { valcreId: 'Sale5_PricePerUnit', registryId: 'comp5-price-per-unit', type: 'currency', section: 'sales', description: 'Comparable 5 price per unit' },
  { valcreId: 'Sale5_NRA', registryId: 'comp5-gba', type: 'number', section: 'sales', description: 'Comparable 5 NRA/GBA' },
  { valcreId: 'Sale5_PricePerSF', registryId: 'comp5-price-per-sf', type: 'currency', section: 'sales', description: 'Comparable 5 price per SF' },
  { valcreId: 'Sale5_YearBuilt', registryId: 'comp5-year', type: 'number', section: 'sales', description: 'Comparable 5 year built' },
  { valcreId: 'Sale5_CapRate', registryId: 'comp5-cap-rate', type: 'percentage', section: 'sales', description: 'Comparable 5 cap rate' },
  { valcreId: 'Sale5_NOI', registryId: 'comp5-noi', type: 'currency', section: 'sales', description: 'Comparable 5 NOI' },
  { valcreId: 'Sale5_NOI_PerUnit', registryId: 'comp5-noi-per-unit', type: 'currency', section: 'sales', description: 'Comparable 5 NOI per unit' },
];

// ============================================================================
// RENTAL SURVEY
// Sheet: SURVEY1, SURVEY2
// ============================================================================

export const rentalSurveyMappings: FieldMapping[] = [
  // Market rent conclusions
  { valcreId: 'MarketRent_1Bed', registryId: 'rent-1br-concluded-rent', type: 'currency', section: 'survey', description: 'Concluded 1BR market rent' },
  { valcreId: 'MarketRent_2Bed', registryId: 'rent-2br-concluded-rent', type: 'currency', section: 'survey', description: 'Concluded 2BR market rent' },
  { valcreId: 'ContractToMarket_Pct', registryId: 'contract-to-market-pct', type: 'percentage', section: 'survey', description: 'Contract rent as % of market' },
  
  // Survey rent data
  { valcreId: 'Survey_1Bed1Bath_Rent', registryId: 'survey-1br-avg-rent', type: 'currency', section: 'survey', description: '1BR/1BA average market rent' },
  { valcreId: 'Survey_1Bed1Bath_PSF', registryId: 'survey-1br-avg-psf', type: 'number', section: 'survey', description: '1BR/1BA rent per SF' },
  { valcreId: 'Survey_2Bed1Bath_Rent', registryId: 'survey-2br-avg-rent', type: 'currency', section: 'survey', description: '2BR/1BA average market rent' },
  { valcreId: 'Survey_2Bed1Bath_PSF', registryId: 'survey-2br-avg-psf', type: 'number', section: 'survey', description: '2BR/1BA rent per SF' },
];

// ============================================================================
// SURVEY COMPARABLE MAPPINGS (survey1-survey5)
// Using SU1_/SU2_ pattern from workbook
// ============================================================================

/**
 * Generate survey comparable field mappings
 * Valcre uses: SU1_1_Address, SU1_2_Address, etc.
 * Our registry uses: survey1-address, survey2-address, etc.
 */
export function getSurveyCompMappings(compNum: 1 | 2 | 3 | 4 | 5): FieldMapping[] {
  const sheet = compNum <= 5 ? 'SU1' : 'SU2';
  const sheetRow = compNum <= 5 ? compNum : compNum - 5;
  
  return [
    { valcreId: `${sheet}_${sheetRow}_Name`, registryId: `survey${compNum}-name`, type: 'text', section: 'survey', description: `Survey comp ${compNum} property name` },
    { valcreId: `${sheet}_${sheetRow}_Address`, registryId: `survey${compNum}-address`, type: 'text', section: 'survey', description: `Survey comp ${compNum} address` },
    { valcreId: `${sheet}_${sheetRow}_City`, registryId: `survey${compNum}-city`, type: 'text', section: 'survey', description: `Survey comp ${compNum} city` },
    { valcreId: `${sheet}_${sheetRow}_Distance`, registryId: `survey${compNum}-distance`, type: 'number', section: 'survey', description: `Survey comp ${compNum} distance` },
    { valcreId: `${sheet}_${sheetRow}_Units`, registryId: `survey${compNum}-units`, type: 'number', section: 'survey', description: `Survey comp ${compNum} units` },
    { valcreId: `${sheet}_${sheetRow}_YearBuilt`, registryId: `survey${compNum}-year-built`, type: 'number', section: 'survey', description: `Survey comp ${compNum} year built` },
    { valcreId: `${sheet}_${sheetRow}_Stories`, registryId: `survey${compNum}-stories`, type: 'number', section: 'survey', description: `Survey comp ${compNum} stories` },
    { valcreId: `${sheet}_${sheetRow}_Location`, registryId: `survey${compNum}-location`, type: 'select', section: 'survey', description: `Survey comp ${compNum} location rating` },
    { valcreId: `${sheet}_${sheetRow}_Quality`, registryId: `survey${compNum}-quality`, type: 'select', section: 'survey', description: `Survey comp ${compNum} quality rating` },
    { valcreId: `${sheet}_${sheetRow}_Condition`, registryId: `survey${compNum}-condition`, type: 'select', section: 'survey', description: `Survey comp ${compNum} condition rating` },
    { valcreId: `${sheet}_${sheetRow}_Appeal`, registryId: `survey${compNum}-appeal`, type: 'select', section: 'survey', description: `Survey comp ${compNum} appeal rating` },
    { valcreId: `${sheet}_${sheetRow}_Amenities`, registryId: `survey${compNum}-amenities`, type: 'select', section: 'survey', description: `Survey comp ${compNum} amenities rating` },
    { valcreId: `${sheet}_${sheetRow}_Parking`, registryId: `survey${compNum}-parking`, type: 'text', section: 'survey', description: `Survey comp ${compNum} parking` },
    { valcreId: `${sheet}_${sheetRow}_Laundry`, registryId: `survey${compNum}-laundry`, type: 'text', section: 'survey', description: `Survey comp ${compNum} laundry` },
    { valcreId: `${sheet}_${sheetRow}_Utilities`, registryId: `survey${compNum}-utilities`, type: 'text', section: 'survey', description: `Survey comp ${compNum} utilities included` },
    { valcreId: `${sheet}_${sheetRow}_1BR_SF`, registryId: `survey${compNum}-1br-sf`, type: 'number', section: 'survey', description: `Survey comp ${compNum} 1BR avg SF` },
    { valcreId: `${sheet}_${sheetRow}_1BR_Rent`, registryId: `survey${compNum}-1br-rent`, type: 'currency', section: 'survey', description: `Survey comp ${compNum} 1BR rent` },
    { valcreId: `${sheet}_${sheetRow}_1BR_PSF`, registryId: `survey${compNum}-1br-psf`, type: 'number', section: 'survey', description: `Survey comp ${compNum} 1BR rent/SF` },
    { valcreId: `${sheet}_${sheetRow}_2BR_SF`, registryId: `survey${compNum}-2br-sf`, type: 'number', section: 'survey', description: `Survey comp ${compNum} 2BR avg SF` },
    { valcreId: `${sheet}_${sheetRow}_2BR_Rent`, registryId: `survey${compNum}-2br-rent`, type: 'currency', section: 'survey', description: `Survey comp ${compNum} 2BR rent` },
    { valcreId: `${sheet}_${sheetRow}_2BR_PSF`, registryId: `survey${compNum}-2br-psf`, type: 'number', section: 'survey', description: `Survey comp ${compNum} 2BR rent/SF` },
  ];
}

// ============================================================================
// VALUE RECONCILIATION
// Sheet: VALUES
// ============================================================================

export const valueReconciliationMappings: FieldMapping[] = [
  { 
    valcreId: 'Value_Scenario1', 
    registryId: 'recon-final-value', 
    type: 'currency', 
    section: 'recon', 
    description: 'Final reconciled value - scenario 1',
    tableLocation: { sheet: 'VALUES', row: 74, column: 'F' }
  },
  { 
    valcreId: 'Value_Scenario1Text', 
    registryId: 'recon-value-premise', 
    type: 'text', 
    section: 'recon', 
    description: 'Value premise text',
    tableLocation: { sheet: 'VALUES', row: 78, column: 'F' }
  },
  { 
    valcreId: 'Value_IARecScenario1', 
    registryId: 'recon-income-value', 
    type: 'currency', 
    section: 'recon', 
    description: 'Reconciled income approach value',
    tableLocation: { sheet: 'VALUES', row: 44, column: 'F' }
  },
];

// ============================================================================
// COMBINED MAPPING REGISTRY
// ============================================================================

export const allMappings: FieldMapping[] = [
  ...coverMappings,
  ...clientMappings,
  ...appraiserMappings,
  ...physicalMappings,
  ...incomeApproachMappings,
  ...capRateMappings,
  ...salesComparisonMappings,
  ...rentalSurveyMappings,
  ...getSurveyCompMappings(1),
  ...getSurveyCompMappings(2),
  ...getSurveyCompMappings(3),
  ...getSurveyCompMappings(4),
  ...getSurveyCompMappings(5),
  ...valueReconciliationMappings,
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get registry ID from Valcre field ID
 */
export function getRegistryId(valcreId: string): string | undefined {
  const mapping = allMappings.find(m => m.valcreId === valcreId);
  return mapping?.registryId;
}

/**
 * Get Valcre field ID from registry ID
 */
export function getValcreId(registryId: string): string | undefined {
  const mapping = allMappings.find(m => m.registryId === registryId);
  return mapping?.valcreId;
}

/**
 * Get all mappings for a section
 */
export function getMappingsBySection(section: string): FieldMapping[] {
  return allMappings.filter(m => m.section === section);
}

/**
 * Get table location for a field
 */
export function getTableLocation(valcreId: string): FieldMapping['tableLocation'] | undefined {
  const mapping = allMappings.find(m => m.valcreId === valcreId);
  return mapping?.tableLocation;
}

/**
 * Check if a Valcre field has a mapping
 */
export function hasMapping(valcreId: string): boolean {
  return allMappings.some(m => m.valcreId === valcreId);
}

/**
 * Get mapping statistics
 */
export function getMappingStats() {
  const bySection: Record<string, number> = {};
  const byType: Record<string, number> = {};
  
  allMappings.forEach(m => {
    bySection[m.section] = (bySection[m.section] || 0) + 1;
    byType[m.type] = (byType[m.type] || 0) + 1;
  });
  
  return {
    totalMappings: allMappings.length,
    bySection,
    byType,
    withTableLocation: allMappings.filter(m => m.tableLocation).length,
  };
}

// ============================================================================
// REGISTRY GAPS - Fields in Valcre extraction not yet mapped
// ============================================================================

export const unmappedValcreFields = [
  // These need registry fields added or mapping created:
  // (Add fields here as gaps are identified)
];

// ============================================================================
// REGISTRY ORPHANS - Fields in your registry with no Valcre equivalent
// ============================================================================

export const orphanRegistryFields = [
  // Fields in your 519-field registry that don't map to Valcre:
  // - TDD/Dashboard UI fields (intake-*, loe-*)
  // - Image management fields (img-*)
  // - Internal workflow fields
  // These are VALID - they're app-specific, not Valcre imports
];
