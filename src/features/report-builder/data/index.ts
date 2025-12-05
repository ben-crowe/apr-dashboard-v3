/**
 * Report Builder Test Data
 *
 * Centralized exports for all test data sets
 */

export {
  northBattlefordTestData,
  loadNorthBattlefordTestData,
  northBattlefordImages,
  northBattlefordSummary,
} from './northBattlefordTestData';

// Re-export types for convenience
export type TestDataRecord = Record<string, string | number | string[]>;
export type LoadTestDataFunction = (
  updateFieldValue: (sectionId: string, fieldId: string, value: any) => void
) => void;
