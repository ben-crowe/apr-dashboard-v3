export type FieldType = 'text' | 'number' | 'date' | 'image' | 'calculated' | 'dropdown' | 'textarea';

// Field input type for color coding (matches Valcre workbook)
export type FieldInputType = 'user-input' | 'dropdown' | 'auto-filled';

// Test mode - mutually exclusive modes for testing
// 'none' = no test mode active (normal editing)
// 'test-report' = Test Report mode (user inputs + calc engine)
// 'designer' = Designer mode (sample data for visual review)
export type TestMode = 'none' | 'test-report' | 'designer';

export interface ReportField {
  id: string;
  label: string;
  type: FieldType;
  value: string | string[] | number;
  isEditable: boolean;
  calculationFormula?: string; // For calculated fields
  inputType?: FieldInputType; // For color coding: yellow=user-input, blue=dropdown, green=auto-filled
  options?: string[]; // For dropdown fields
  placeholder?: string;
  expenseCalcBase?: 'percent_pgr' | 'percent_egr' | 'fixed' | 'per_unit' | 'per_sf';
}

export interface ReportSection {
  id: string;
  name: string;
  shortName: string; // For sidebar display (e.g., "EXEC", "SITE")
  fields: ReportField[];
  subsections?: ReportSubsection[];
}

export interface ReportSubsection {
  id: string;
  title: string;
  fields: ReportField[];
}

// Section groups for sidebar organization (matches workbook)
export interface SectionGroup {
  id: string;
  name: string;
  sections: string[]; // Section IDs
}

export interface ReportBuilderState {
  sections: ReportSection[];
  sectionGroups: SectionGroup[];
  activeSection: string;
  previewHtml: string;
  isDirty: boolean;
  sidebarCollapsed: boolean;
  activeTestMode: TestMode; // Mutually exclusive test modes
  testDataLoaded: Record<string, boolean>; // Tracks which sections have had test data loaded (e.g., { home: true, cover: false })

  // Actions
  setActiveSection: (sectionId: string) => void;
  updateFieldValue: (fieldId: string, value: string | string[] | number) => void;
  reorderImages: (fieldId: string, imageUrls: string[]) => void;
  addImage: (fieldId: string, imageUrl: string) => void;
  removeImage: (fieldId: string, imageUrl: string) => void;
  generatePreview: () => void;
  initializeMockData: () => void;
  toggleSidebar: () => void;
  loadCalcTestData: () => void;
  loadHomeTestData: () => Promise<void>;
  loadCoverTestData: () => Promise<void>;
  loadMapsTestData: () => Promise<void>;
  loadAssignmentTestData: () => Promise<void>;
  loadExecTestData: () => Promise<void>;
  loadSiteTestData: () => Promise<void>;
  loadImprovementsTestData: () => Promise<void>;
  loadSalesTestData: () => Promise<void>;
  loadIncomeTestData: () => Promise<void>;
  runCalculations: () => void;
  loadDataSet1All: () => Promise<void>; // Test 2 - loads ALL fields to TDD
  loadDataSet1User: () => Promise<void>; // Test 3 - loads user inputs, runs calc engine
  loadDataSet1DirectToTemplate: () => Promise<void>; // Direct field validation - bypasses calc engine
  setTestMode: (mode: TestMode) => void; // Switch between test modes
  setTestDataLoaded: (sectionId: string, loaded: boolean) => void; // Mark section test data as loaded/unloaded
}
