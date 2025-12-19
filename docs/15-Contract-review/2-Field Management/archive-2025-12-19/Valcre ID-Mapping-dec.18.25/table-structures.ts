/**
 * Valcre Workbook Table Structure Mapping
 * 
 * This file maps Valcre named ranges (field IDs) to their locations in report tables.
 * Used for populating APR Dashboard report templates with data from Valcre export.
 * 
 * WORKBOOK: VAL251012_-_North_Battleford_Apt.xlsm
 * TOTAL NAMED RANGES: 7,988
 */

// ============================================================================
// INCOME SUMMARY / DIRECT CAPITALIZATION TABLE
// Sheet: DIRECTCAP
// Rows: 218-275 (Summary area)
// ============================================================================

export const incomeSummaryTable = {
  sheetName: 'DIRECTCAP',
  description: 'Direct Capitalization Income Statement',
  
  // Column structure for summary rows
  columns: {
    C: 'label',           // Row label (e.g., "POTENTIAL GROSS REVENUE")
    G: 'percentOfPGI',    // % of PGI (for expenses/losses)
    H: 'percentOfEGI',    // % of EGI
    I: 'perUnit',         // $/Unit
    J: 'perSFYear',       // $/SF/Year
    K: 'perSFMonth',      // $/SF/Month
    L: 'total',           // Total Annual Amount
  },

  // Revenue Section (rows 218-225)
  revenue: {
    potentialGrossRevenue: {
      row: 218,
      fieldIds: {
        label: 'IA_PGRev',                    // Dynamic label
        total: 'IA_DirCap_PGI',               // DIRECTCAP!$L$218
        perUnit: 'IA_DirCap_PGIUnit',         // DIRECTCAP!$I$218
        perSF: 'IA_DirCap_PGIPSF',            // DIRECTCAP!$J$218
      }
    },
    vacancy: {
      row: 220,
      fieldIds: {
        rate: 'IA_DirCap_VacLoss',            // DIRECTCAP!$G$220 (percentage)
        total: 'IA_DirCap_VacancyTotal',      // DIRECTCAP!$L$220
      }
    },
    concessions: {
      row: 221,
      fieldIds: {
        rate: 'IA_DirCap_ConcLoss',           // DIRECTCAP!$G$221
        total: 'IA_DirCap_ConcessionTotal',   // DIRECTCAP!$L$221
      }
    },
    creditLoss: {
      row: 222,
      fieldIds: {
        rate: 'IA_DirCap_ColLoss',            // DIRECTCAP!$G$222
        total: 'IA_DirCap_CreditLossTotal',   // DIRECTCAP!$L$222
      }
    },
    otherLoss: {
      row: 223,
      fieldIds: {
        rate: 'IA_DirCap_Loss2Lease',         // DIRECTCAP!$G$223
        total: 'IA_DirCap_OtherLossTotal',    // DIRECTCAP!$L$223
      }
    },
    totalVacancyLoss: {
      row: 224,
      fieldIds: {
        label: 'IA_TVCLoss',
        rate: 'IA_DirCap_Loss',               // DIRECTCAP!$G$224
        total: 'IA_DirCap_LossTotal',         // DIRECTCAP!$L$224
      }
    },
    effectiveGrossRevenue: {
      row: 225,
      fieldIds: {
        label: 'IA_EGRev',
        total: 'IA_DirCap_EGI',               // DIRECTCAP!$L$225
        perUnit: 'IA_DirCap_EGIUnit',         // DIRECTCAP!$I$225
        perSF: 'IA_DirCap_EGIPSF',            // DIRECTCAP!$J$225
      }
    },
  },

  // Expenses Section (rows 227-252)
  expenses: {
    // Dynamic expense rows - labels come from IA_Expense01-25 (IE_IN sheet)
    // Values come from IE_CONC sheet G48-G72
    row_start: 227,
    row_end: 251,
    total_row: 252,
    fieldPattern: {
      label: 'IA_Expense{N}',                 // IE_IN!$G$26-50
      // Amount calculated from IE_CONC!G48-72
    },
    totals: {
      label: 'IA_TOExp',
      expenseRatio: 'IA_DirCap_ExpenseRatio', // DIRECTCAP!$H$252
      total: 'IA_DirCap_Expenses',            // DIRECTCAP!$L$252
    }
  },

  // NOI Section (row 253)
  netOperatingIncome: {
    row: 253,
    fieldIds: {
      label: 'IA_NOInc',
      total: 'IA_DirCap_NOI',                 // DIRECTCAP!$L$253
      perUnit: 'IA_DirCap_NOIUnit',           // DIRECTCAP!$I$253
      perSF: 'IA_DirCap_NOIPSF',              // DIRECTCAP!$J$253
    }
  },

  // Capitalization Section (rows 254-269)
  capitalization: {
    capRate1: {
      row: 254,
      fieldId: 'IA_DirCap_CapRate1',          // DIRECTCAP!$L$254 (user input)
    },
    capRate2: {
      row: 255,
      fieldId: 'IA_DirCap_CapRate2',          // DIRECTCAP!$L$255 (blended option)
    },
    blendOption: 'IA_DirCap_Blend',           // DIRECTCAP!$P$254 ("Yes"/"No")
    
    // Value conclusions (up to 4 scenarios with adjustments)
    preliminaryValue: {
      row: 256,
      fieldId: 'IA_DirCap_PrelimValue1',      // DIRECTCAP!$L$256
    },
    value1: {
      row: 257,
      fieldIds: {
        total: 'IA_DirCap_Value1',            // DIRECTCAP!$L$257
        perUnit: 'IA_DirCap_ValuePerUnit1.6', // DIRECTCAP!$I$257
        perSF: 'IA_DirCap_ValuePerUnit1.5',   // DIRECTCAP!$J$257
      }
    },
    adjustment1: {
      row: 258,
      fieldIds: {
        toggle: 'IA_DirCap_Adj1',             // DIRECTCAP!$P$256
        amount: 'IA_DirCap_Adjustment1',      // DIRECTCAP!$L$258
      }
    },
    value2: {
      row: 261,
      fieldIds: {
        total: 'IA_DirCap_Value2',            // DIRECTCAP!$L$261
        perUnit: 'IA_DirCap_ValuePerUnit2.1', // DIRECTCAP!$I$261
        perSF: 'IA_DirCap_ValuePerUnit2',     // DIRECTCAP!$J$261
      }
    },
    adjustment2: {
      row: 262,
      fieldIds: {
        toggle: 'IA_DirCap_Adj2',
        amount: 'IA_DirCap_Adjustment2',      // DIRECTCAP!$L$262
      }
    },
    value3: {
      row: 265,
      fieldIds: {
        total: 'IA_DirCap_Value3',            // DIRECTCAP!$L$265
        perUnit: 'IA_DirCap_ValuePerUnit3.1',
        perSF: 'IA_DirCap_ValuePerUnit3',
      }
    },
    value4: {
      row: 269,
      fieldIds: {
        total: 'IA_DirCap_Value4',            // DIRECTCAP!$L$269
        perUnit: 'IA_DirCap_ValuePerUnit4.1',
        perSF: 'IA_DirCap_ValuePerUnit4',
      }
    },
  },

  // Comments for report narrative
  comments: {
    pgrComment: 'IA_DirCap_PGRComment',       // DIRECTCAP!$D$10
    egrComment: 'IA_DirCap_EGRComment',       // DIRECTCAP!$D$11
    noiComment: 'IA_DirCap_NOIComment',       // DIRECTCAP!$D$12
  }
};

// ============================================================================
// UNIT MIX TABLE
// Sheet: DIRECTCAP (rows 17-44) pulls from UNITMIX
// ============================================================================

export const unitMixTable = {
  sheetName: 'DIRECTCAP',
  sourceSheet: 'UNITMIX',
  description: 'Unit Mix / Rent Roll Summary',
  
  // Header row
  headerRow: 17,
  dataStartRow: 19,
  dataEndRow: 43,
  totalRow: 44,

  columns: {
    C: 'unitType',           // Unit type/description (from UNITMIX!T)
    D: 'unitCount',          // Number of units (from UNITMIX!V)
    E: 'avgSF',              // Average SF per unit (from UNITMIX!P)
    F: 'contractRent',       // Contract rent (from UNITMIX!AT)
    G: 'marketRent',         // Market rent (from UNITMIX!BI)
    H: 'rentRatio',          // Contract/Market ratio
    I: 'selectedRent',       // Selected rent (Contract or Market)
    J: 'annualRentPSF',      // Annual $/SF
    K: 'monthlyRentPSF',     // Monthly $/SF
    L: 'totalAnnualRent',    // Total annual revenue
  },

  // Named range for the entire table
  tableRange: 'IA_DirCap_GRIMF',              // DIRECTCAP!$C$17:$L$44

  // Source mappings to UNITMIX sheet
  sourceMappings: {
    unitType: 'UNITMIX!T{row}',
    description: 'UNITMIX!U{row}',
    unitCount: 'UNITMIX!V{row}',
    avgSF: 'UNITMIX!P{row}',
    contractRent: 'UNITMIX!AT{row}',
    marketRent: 'UNITMIX!BI{row}',
  }
};

// ============================================================================
// OPERATING EXPENSES TABLE
// Sheet: IE_CONC (Expense Conclusion)
// ============================================================================

export const operatingExpensesTable = {
  sheetName: 'IE_CONC',
  sourceSheet: 'IE_IN',
  description: 'Operating Expense Pro Forma',
  
  dataStartRow: 48,
  dataEndRow: 72,
  totalRow: 73,

  columns: {
    C: 'expenseCategory',    // Label (from IA_Expense01-25)
    D: 'percentOfEGI',       // % of EGI
    E: 'perSF',              // $/SF
    F: 'perUnit',            // $/Unit
    G: 'totalAmount',        // Total Amount
  },

  // Each expense row pattern
  expenseRowPattern: {
    label: 'IA_Expense{N}',                   // IE_IN!$G$26+N
    percentEGI: 'IE_CONC!D{48+N}',
    perSF: 'IE_CONC!E{48+N}',
    perUnit: 'IE_CONC!F{48+N}',
    total: 'IE_CONC!G{48+N}',
  },

  // Named ranges for individual expense labels (1-25)
  expenseLabels: [
    'IA_Expense01', 'IA_Expense02', 'IA_Expense03', 'IA_Expense04', 'IA_Expense05',
    'IA_Expense06', 'IA_Expense07', 'IA_Expense08', 'IA_Expense09', 'IA_Expense10',
    'IA_Expense11', 'IA_Expense12', 'IA_Expense13', 'IA_Expense14', 'IA_Expense15',
    'IA_Expense16', 'IA_Expense17', 'IA_Expense18', 'IA_Expense19', 'IA_Expense20',
    'IA_Expense21', 'IA_Expense22', 'IA_Expense23', 'IA_Expense24', 'IA_Expense25',
  ],

  // Total row
  totals: {
    label: 'TOTAL OPERATING EXPENSES',
    totalFieldId: 'IA_DirCap_Expenses',
  }
};

// ============================================================================
// SALES COMPARISON TABLE
// Sheet: SALE1 (and SALE2 for additional comps)
// ============================================================================

export const salesComparisonTable = {
  sheetName: 'SALE1',
  additionalSheet: 'SALE2',
  description: 'Sales Comparison Grid',
  
  // Up to 10 comparable sales per sheet
  maxComps: 10,
  
  // Column positions for each comp (1-10)
  compColumns: {
    1: 'E', 2: 'G', 3: 'I', 4: 'K', 5: 'L',
    6: 'N', 7: 'P', 8: 'R', 9: 'T', 10: 'W',
  },

  // Named range pattern: SA1_{comp}_{field}
  fieldPatterns: {
    // Property identification
    id: 'SA1_{N}_ID',                         // SALE1!${col}$6
    address: 'SA1_{N}_Address',               // SALE1!${col}$26
    city: 'SA1_{N}_City',                     // SALE1!${col}$27
    state: 'SA1_{N}_State',                   // SALE1!${col}$28
    zip: 'SA1_{N}_Zip',                       // SALE1!${col}$29
    
    // Physical characteristics
    gba: 'SA1_{N}_GBA',                       // SALE1!${col}$71
    nra: 'SA1_{N}_NRA',                       // SALE1!${col}$72
    
    // Sale information
    pricePerUOM: 'SA1_{N}_PricePerUOM',       // SALE1!${col}$46
    
    // Photo and comments
    photo: 'SA1_{N}_Photo',
    photoURL: 'SA1_{N}_PhotoURL',
    commentProp: 'SA1_{N}_CommentProp',
    commentSale: 'SA1_{N}_CommentSale',
    
    // Map/Geo data
    geocode: 'SA1_{N}_Geocode',
    mapComp: 'SA1_{N}_MapComp',
  },

  // Subject property row identifiers
  subjectRow: {
    address: 'Subject_Address',
    city: 'Subject_City',
    state: 'Subject_State',
    units: 'Subject_Units',
    nra: 'Subject_NRA',
  }
};

// ============================================================================
// RENTAL SURVEY TABLE
// Sheet: SURVEY1 (and SURVEY2 for additional comps)
// ============================================================================

export const rentalSurveyTable = {
  sheetName: 'SURVEY1',
  additionalSheet: 'SURVEY2',
  description: 'Rental Survey / Rent Comparable Grid',
  
  maxComps: 10,

  // Named range pattern: SU1_{comp}_{field}
  fieldPatterns: {
    // Property identification
    id: 'SU1_{N}_ID',                         // SURVEY1!${col}$6
    address: 'SU1_{N}_Address',               // SURVEY1!${col}$20
    city: 'SU1_{N}_City',                     // SURVEY1!${col}$21
    state: 'SU1_{N}_State',                   // SURVEY1!${col}$22
    zip: 'SU1_{N}_Zip',                       // SURVEY1!${col}$23
    
    // Building characteristics
    utilities: 'SU1_{N}_Utilities',           // SURVEY1!${col}$52
    
    // Adjustment total
    totalAdj: 'SU1_{N}_TotalAdj',
    
    // Unit mix data
    unitMix: 'SU1_{N}_UnitMix',               // Links to SU1C sheet
    
    // Photo and comments
    photo: 'SU1_{N}_Photo',
    photoURL: 'SU1_{N}_PhotoURL',
    commentProp: 'SU1_{N}_CommentProp',
    commentSurvey: 'SU1_{N}_CommentSurvey',
    
    // Map/Geo
    geocode: 'SU1_{N}_Geocode',
    mapComp: 'SU1_{N}_MapComp',
  }
};

// ============================================================================
// RENT COMPARISON ADJUSTMENT GRID
// Sheet: RENT1, RENT2, RENT3, RENT4
// ============================================================================

export const rentComparisonTable = {
  sheets: ['RENT1', 'RENT2', 'RENT3', 'RENT4'],
  description: 'Rental Comparable Adjustment Grid',

  // Named range pattern: AdjRent_{sheet}_{adj}
  // Example: AdjRent_1_1 through AdjRent_1_21 for RENT1
  adjustmentRows: {
    start: 52,
    end: 72,
  },

  // Each adjustment line
  fieldPattern: 'AdjRent_{sheet}_{row}',       // e.g., AdjRent_1_1 = RENT1!$AA$52
  formattedPattern: 'AdjRent_{sheet}_{row}_Formatted',
};

// ============================================================================
// VALUE RECONCILIATION TABLE
// Sheet: VALUES
// ============================================================================

export const valueReconciliationTable = {
  sheetName: 'VALUES',
  description: 'Value Reconciliation Summary',

  // Scenario columns
  scenarioColumns: {
    scenario1: 'F',
    scenario2: 'G',
    scenario3: 'H',
  },

  // Header information
  headers: {
    scenarioName: {
      row: 8,
      fieldIds: ['Report_ValueScenario1', 'Report_ValueScenario2', 'Report_ValueScenario3'],
    },
    interestAppraised: {
      row: 9,
      fieldIds: ['Report_ValueInterest1', 'Report_ValueInterest2', 'Report_ValueInterest3'],
    },
    effectiveDate: {
      row: 10,
      fieldIds: ['Report_Date1', 'Report_Date2', 'Report_Date3'],
    },
  },

  // Approach values
  approaches: {
    landValue: {
      row: 12,
      label: 'Vacant Land Value / Site Value',
    },
    costApproach: {
      row: 15,
      label: 'Indicated Value - Cost Approach',
    },
    salesApproach: {
      row: 19,
      label: 'Indicated Value - Sales Comparison',
      fieldIds: {
        scenario1: 'Value_SARecScenario1',    // VALUES!$F$27
      }
    },
    incomeApproachDirect: {
      row: 34,
      label: 'Indicated Value - Direct Capitalization',
    },
    incomeApproachDCF: {
      row: 42,
      label: 'Indicated Value - DCF Analysis',
    },
    incomeApproachReconciled: {
      row: 44,
      label: 'Reconciled Income Approach Value',
      fieldIds: {
        scenario1: 'Value_IARecScenario1',    // VALUES!$F$44
      }
    },
  },

  // Final value conclusion
  finalValue: {
    row: 74,
    fieldIds: {
      scenario1: 'Value_Scenario1',           // VALUES!$F$74
      scenario2: 'Value_Scenario2',           // VALUES!$G$74
      scenario3: 'Value_Scenario3',           // VALUES!$H$74
    },
    textFieldIds: {
      scenario1: 'Value_Scenario1Text',       // VALUES!$F$78
      scenario2: 'Value_Scenario2Text',       // VALUES!$G$78
      scenario3: 'Value_Scenario3Text',       // VALUES!$H$78
    },
    perUOM: {
      row: 75,
      fieldId: 'Value_Scenario1PerUofM',      // VALUES!$F$75
    },
  },

  // Other value conclusions (rows 47-71)
  otherValues: {
    replacementCost: {
      row: 47,
      fieldId: 'Value_RepCostEst',            // VALUES!$F$47
    },
    goDark: {
      row: 49,
      fieldId: 'Value_GoDark',                // VALUES!$F$49
    },
    disposition: {
      row: 51,
      fieldId: 'Value_Disposition',           // VALUES!$F$51
    },
    // Other1-10 for custom value types
    other: [
      { row: 53, fieldId: 'Value_Other1' },
      { row: 55, fieldId: 'Value_Other2' },
      { row: 57, fieldId: 'Value_Other3' },
      { row: 59, fieldId: 'Value_Other4' },
      { row: 61, fieldId: 'Value_Other5' },
      { row: 63, fieldId: 'Value_Other6' },
      { row: 65, fieldId: 'Value_Other7' },
      { row: 67, fieldId: 'Value_Other8' },
      { row: 69, fieldId: 'Value_Other9' },
      { row: 71, fieldId: 'Value_Other10' },
    ],
  },
};

// ============================================================================
// EXECUTIVE SUMMARY TABLE
// Sheet: EXEC
// ============================================================================

export const executiveSummaryTable = {
  sheetName: 'EXEC',
  description: 'Executive Summary Data Ranges',

  ranges: {
    general: 'Exec_General',                  // EXEC!$C$20:$F$30
    propertyIdentity: 'Exec_PropIdentity',    // EXEC!$C$21:$F$30
    site: 'Exec_Site',                        // EXEC!$C$32:$F$45
    improvements: 'Exec_Impv',                // EXEC!$C$47:$F$83
    qualitative: 'Exec_Qualitative',          // EXEC!$C$85:$F$92
    hbu: 'Exec_HBU',                          // EXEC!$C$98:$F$101
    exposureTime: 'Exec_ExpTime',             // EXEC!$C$103:$F$105
    investmentIndicators: 'Exec_InvestmentIndicators', // EXEC!$C$107:$F$135
    dcfSummary: 'Exec_DCF',                   // EXEC!$C$124:$F$135
    swot: 'Exec_SWOT',                        // EXEC!$C$145:$F$162
  },

  // Specific field locations
  propertyFields: {
    // These reference other sheets
  }
};

// ============================================================================
// SUBJECT PROPERTY FIELDS
// Various sheets, primarily HOME, SITE, IMPV
// ============================================================================

export const subjectPropertyFields = {
  // Identification
  address: 'Subject_Address',
  city: 'Subject_City',
  state: 'Subject_State',
  zip: 'Subject_Zip',
  county: 'Subject_County',
  country: 'Subject_Country',
  apn: 'Subject_APN',
  
  // Physical characteristics
  siteArea: 'Subject_AcresDecimalRD',         // SITE!$G$13
  nra: 'Subject_NRA',
  gba: 'Subject_GBA',
  units: 'Subject_Units',
  age: 'Subject_Age',                         // IMPV!$D$40
  
  // Classification
  propertyType: 'Subject_Primary',
  propertySubtype: 'Subject_Subtype',
  areaType: 'Subject_AreaType',               // IMPV!$C$6 (determines $/SF measure)
  
  // Unit naming
  unitNameSingular: 'Subject_UnitNameSingular',
  unitNamePlural: 'Subject_UnitNamePlural',
};

// ============================================================================
// REPORT METADATA FIELDS
// Various sheets, primarily HOME
// ============================================================================

export const reportFields = {
  // Dates
  effectiveDate1: 'Report_Date1',
  effectiveDate2: 'Report_Date2',
  effectiveDate3: 'Report_Date3',
  
  // Value scenarios
  valueScenario1: 'Report_ValueScenario1',
  valueScenario2: 'Report_ValueScenario2',
  valueScenario3: 'Report_ValueScenario3',
  
  // Interest appraised
  valueInterest1: 'Report_ValueInterest1',
  valueInterest2: 'Report_ValueInterest2',
  valueInterest3: 'Report_ValueInterest3',
  
  // Modules enabled
  moduleSA1: 'Report_ModuleSA1',              // Sales Approach
  moduleRE1: 'Report_ModuleRE1',              // Rent Comparison
  moduleSU1: 'Report_ModuleSU1',              // Survey
  moduleCA: 'Report_ModuleCA',                // Cost Approach
  moduleLA1: 'Report_ModuleLA1',              // Land Analysis
  moduleIM: 'Report_ModuleIM',                // Income Module
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get the named range for a specific sale comp field
 */
export function getSaleCompFieldId(compNum: number, field: string, sheet: 'SA1' | 'SA2' = 'SA1'): string {
  return `${sheet}_${compNum}_${field}`;
}

/**
 * Get the named range for a specific survey comp field
 */
export function getSurveyCompFieldId(compNum: number, field: string, sheet: 'SU1' | 'SU2' = 'SU1'): string {
  return `${sheet}_${compNum}_${field}`;
}

/**
 * Get expense label field ID
 */
export function getExpenseFieldId(expenseNum: number): string {
  return `IA_Expense${String(expenseNum).padStart(2, '0')}`;
}

/**
 * Get rent adjustment field ID
 */
export function getRentAdjustmentFieldId(sheetNum: number, rowNum: number): string {
  return `AdjRent_${sheetNum}_${rowNum}`;
}

// ============================================================================
// SHEET → TABLE MAPPING
// Which sheets generate which report tables
// ============================================================================

export const sheetToTableMapping = {
  'DIRECTCAP': ['incomeSummaryTable', 'unitMixTable'],
  'IE_CONC': ['operatingExpensesTable'],
  'SALE1': ['salesComparisonTable'],
  'SALE2': ['salesComparisonTable'],
  'SURVEY1': ['rentalSurveyTable'],
  'SURVEY2': ['rentalSurveyTable'],
  'RENT1': ['rentComparisonTable'],
  'RENT2': ['rentComparisonTable'],
  'RENT3': ['rentComparisonTable'],
  'RENT4': ['rentComparisonTable'],
  'VALUES': ['valueReconciliationTable'],
  'EXEC': ['executiveSummaryTable'],
  'UNITMIX': ['unitMixTable'],  // Source data
  'IE_IN': ['operatingExpensesTable'],  // Source data (expense labels)
};

// ============================================================================
// TRULY FLATTENED TABLES (No formula source)
// ============================================================================

export const flattenedTables = [
  // These tables appear as images in reports with no traceable formula source:
  // (None identified - all major tables have formula-based sources)
];

// ============================================================================
// EXPORT SUMMARY
// ============================================================================

export const tableSummary = {
  totalNamedRanges: 7988,
  majorPrefixes: {
    'IA_': 1789,      // Income Approach
    'Subject_': 487,  // Subject Property
    'SA1_': 299,      // Sales Comp 1
    'SA2_': 242,      // Sales Comp 2
    'SU1_': 290,      // Survey Comp 1
    'SU2_': 252,      // Survey Comp 2
    'RE1_': 320,      // Rent Comp 1
    'RE2_': 257,      // Rent Comp 2
    'RE3_': 256,      // Rent Comp 3
    'RE4_': 256,      // Rent Comp 4
    'Value_': 30,     // Value Conclusions
    'Exec_': 36,      // Executive Summary
  },
  sheets: {
    count: 83,
    primary: [
      'HOME', 'DIRECTCAP', 'VALUES', 'EXEC',
      'SALE1', 'SALE2', 'SURVEY1', 'SURVEY2',
      'RENT1', 'RENT2', 'RENT3', 'RENT4',
      'IE_CONC', 'IE_IN', 'UNITMIX', 'RENTROLL',
    ],
  },
};
