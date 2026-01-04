/**
 * Report Builder Test Data
 *
 * Centralized exports for all test data sets
 */

// Test DataSet 1 - Complete test data for sample property
// Used by: loadFullTestData() (all fields) and loadUserInputsOnly() (filtered)
export { testDataSet1AllFields } from './Test-DataSet1-All-ID-Direct';

// Legacy exports (northBattlefordTestData-REAL.ts) - for backward compatibility
export {
  northBattlefordTestData,
  loadNorthBattlefordTestData,
  northBattlefordImages,
  northBattlefordSummary,
} from './northBattlefordTestData-REAL';

// Re-export types for convenience
export type TestDataRecord = Record<string, string | number | string[]>;
export type LoadTestDataFunction = (
  updateFieldValue: (sectionId: string, fieldId: string, value: any) => void
) => void;
