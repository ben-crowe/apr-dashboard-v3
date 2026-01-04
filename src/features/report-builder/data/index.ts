/**
 * Report Builder Test Data
 *
 * Centralized exports for all test data sets
 */

// Test DataSet 1 - Test data for sample property
// Used by: loadFullTestData (Test 2) and testScriptDataSet1 (Test 3)
export { testDataSet1 } from './TestDataSet1';

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
