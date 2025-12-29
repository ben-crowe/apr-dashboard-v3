// Where each field appears in the report
// Useful for template mapping and validation

export const fieldPlacements: Record<string, string[]> = {
  'ClientCompany': ["cover-page", "transmittal-letter"],
  'ClientName': ["cover-page", "transmittal-letter"],
  'DCA_PricePerUnit_Concluded': ["sales-comparison-conclusion"],
  'DCA_Value': ["sales-comparison-conclusion", "reconciliation"],
  'DateOfReport': ["cover-page", "transmittal-letter"],
  'DateOfValuation': ["cover-page", "exec-summary", "reconciliation", "certification"],
  'FileNo': ["cover-page", "running-footer"],
  'IA_DirCap_CapRate': ["income-approach-table", "cap-rate-analysis", "reconciliation"],
  'IA_DirCap_EGR': ["income-approach-table"],
  'IA_DirCap_NOI': ["income-approach-table", "cap-rate-analysis"],
  'IA_DirCap_PGR': ["income-approach-table"],
  'IA_DirCap_Value': ["income-approach-conclusion", "reconciliation"],
  'NRA_SF': ["transmittal-letter", "exec-summary", "improvements-description", "income-approach"],
  'Occupancy_Pct': ["transmittal-letter", "exec-summary"],
  'PropertyFullAddress': ["cover-page", "transmittal-letter", "exec-summary", "site-details"],
  'PropertyName': ["cover-page", "transmittal-letter", "exec-summary", "running-header", "certification"],
  'TotalUnits': ["transmittal-letter", "exec-summary", "improvements-description"],
  'YearBuilt': ["transmittal-letter", "exec-summary", "improvements-description"],
};
