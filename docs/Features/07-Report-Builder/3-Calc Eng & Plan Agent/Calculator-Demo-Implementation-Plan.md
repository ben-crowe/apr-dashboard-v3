# Implementation Plan: Interactive Calculator Demonstration Page

**Project:** APR Dashboard V3
**Date:** 2025-12-12
**Purpose:** Build standalone interactive calculator demo showcasing validated income capitalization engine
**Status:** 📋 PLANNING COMPLETE - Ready for Implementation

---

## 🔍 SEARCH KEYWORDS

`calculator-demo-page` `interactive-calculator` `calculation-walkthrough` `validated-calculator-engine` `three-panel-layout` `input-output-breakdown` `calculation-transparency` `step-by-step-formulas` `north-battleford-test-data` `7-metric-validation` `non-invasive-wrapper` `useCalculationSteps-hook` `income-capitalization-demo` `stakeholder-transparency`

---

## Executive Summary

This plan outlines the creation of a standalone interactive calculator demonstration page that showcases the validated income capitalization calculator engine. The page will allow stakeholders to input values, load test data, and see a step-by-step calculation breakdown showing HOW results are derived - providing full transparency into the calculation methodology.

**Key Innovation:** The Walkthrough Panel shows not just WHAT the value is ($1,780,000), but HOW it was calculated with every formula and intermediate step visible.

---

## 1. Architecture Overview

### Current State Analysis

**Validated Calculator Engine:**
- **Location:** `/src/features/report-builder/store/reportBuilderStore.ts`
- **Function:** `runCalculations()` (lines 5534-5727)
- **Status:** ✅ **VALIDATED** - 7/7 exact match with Valcre appraisal workbook
- **Rule:** ❌ **DO NOT MODIFY** - Import and use as-is

**Test Data:**
- **Location:** `/src/features/report-builder/data/northBattlefordTestData-REAL.ts`
- **Contains:** 62+ calculator fields with validated North Battleford data
- **Expected Output:** $1,780,000 indicated value (validated)

**Existing Components:**
- TestInputDashboard: Field input interface at `/src/features/test-input/TestInputDashboard.tsx`
- UI Components: Full shadcn/ui component library available
- Store: Zustand store with calculation engine already implemented

### Proposed Architecture

**3-Panel Layout Design:**
```
┌─────────────────────────────────────────────────────────┐
│  Header: Calculator Demo | Load Test Data | Reset       │
├──────────────────┬──────────────────┬───────────────────┤
│                  │                  │                   │
│  INPUT PANEL     │  OUTPUT PANEL    │  WALKTHROUGH      │
│  (Left/Top)      │  (Right/Top)     │  (Bottom/Full)    │
│                  │                  │                   │
│  - Unit Mix      │  - PGR           │  Step-by-step     │
│  - Other Income  │  - Vacancy Loss  │  calculation      │
│  - Vacancy Rate  │  - EGR           │  breakdown        │
│  - Expenses      │  - OpEx          │                   │
│  - Cap Rate      │  - NOI           │  Shows formulas   │
│  - Adjustments   │  - Raw Value     │  & intermediate   │
│                  │  - Final Value   │  values           │
└──────────────────┴──────────────────┴───────────────────┘
```

---

## 2. Data Flow Architecture

### Calculation Pipeline

```
User Input Fields (62 total)
    ↓
Zustand Store (reportBuilderStore)
    ↓
runCalculations() - VALIDATED ENGINE
    ↓
Calculation Steps Tracker (NEW)
    ↓
3 Simultaneous Outputs:
    ├─ Input Panel (field values)
    ├─ Output Panel (7 key results)
    └─ Walkthrough Panel (step-by-step breakdown)
```

### Key Calculation Steps to Track

The walkthrough panel needs to capture and display these intermediate calculations:

1. **Unit Mix Calculations** (per unit type 1-4):
   - `annual = count × rent × 12`
   - Aggregate: `totalUnits`, `totalSf`, `avgUnitSf`, `totalRentalRevenue`

2. **Other Income**:
   - `parkingTotal = parkingPerUnit × totalUnits × 12`
   - `laundryTotal = laundryPerUnit × totalUnits × 12`
   - `totalOtherIncome = parking + laundry + other`

3. **Potential Gross Revenue (PGR)**:
   - `PGR = totalRentalRevenue + totalOtherIncome`

4. **Vacancy & Loss**:
   - `totalVacancyRate = vacancy% + badDebt% + concessions%`
   - `vacancyLoss = PGR × (totalVacancyRate / 100)`
   - `EGR = PGR - vacancyLoss`

5. **Operating Expenses** (9 categories):
   - Each expense calculated based on: `percent_egr`, `percent_pgr`, `per_unit`, `per_sf`, or `fixed`
   - `expensesTotal = sum of all 9 expense categories`
   - `expenseRatio = (expensesTotal / EGR) × 100`

6. **Net Operating Income (NOI)**:
   - `NOI = EGR - expensesTotal`
   - `NOI/Unit = NOI / totalUnits`
   - `NOI/SF = NOI / totalSf`

7. **Capitalized Value**:
   - `rawValue = NOI / (capRate / 100)`
   - `roundedValue = round to nearest $10,000`

8. **Adjustments & Final Value**:
   - `adjTotal = capex + leasing + other`
   - `indicatedValue = roundedValue - adjTotal`
   - `value/unit`, `value/sf`, `GRM`

---

## 3. Component Structure

### File Organization

```
/src/features/calculator-demo/
├── index.ts                           # Feature exports
├── CalculatorDemoPage.tsx             # Main page component
├── components/
│   ├── InputPanel.tsx                 # Left panel - field inputs
│   ├── OutputPanel.tsx                # Right panel - results display
│   ├── WalkthroughPanel.tsx          # Bottom panel - step breakdown
│   ├── CalculationStep.tsx           # Individual step display
│   ├── LoadTestDataButton.tsx        # Load North Battleford data
│   └── ResetButton.tsx               # Clear all inputs
├── hooks/
│   └── useCalculationSteps.ts        # Extract calculation steps
├── types/
│   └── calculatorDemo.types.ts       # TypeScript interfaces
└── utils/
    └── formatCalculationSteps.ts     # Format steps for display
```

### New Route

Add to `/src/App.tsx`:
```typescript
import CalculatorDemoPage from './features/calculator-demo/CalculatorDemoPage';
// ...
<Route path="/calculator-demo" element={<CalculatorDemoPage />} />
```

---

## 4. Component Implementation Details

### 4.1 CalculatorDemoPage.tsx

**Purpose:** Main container component, orchestrates 3 panels

**Key Responsibilities:**
- Layout management (3-panel responsive design)
- Load test data functionality
- Reset functionality
- Real-time calculation trigger on input change

**Data Flow:**
- Subscribes to Zustand store (`useReportBuilderStore`)
- Triggers `runCalculations()` on any input change
- Passes calculation steps to walkthrough panel

**Layout Strategy:**
- Desktop: 3-panel (Input Left | Output Right | Walkthrough Bottom)
- Mobile: Stacked vertical (Input → Output → Walkthrough)
- Uses ResizablePanel for desktop layout

---

### 4.2 InputPanel.tsx

**Purpose:** Display and edit calculator input fields

**Field Categories (62 total fields from test data):**

1. **Unit Mix (20 fields)** - 4 unit types × 5 fields:
   - `calc-type[1-4]-name` (text)
   - `calc-type[1-4]-count` (number)
   - `calc-type[1-4]-sf` (number)
   - `calc-type[1-4]-rent` (number/month)
   - `calc-type[1-4]-annual` (calculated)

2. **Totals (6 fields)** - All calculated:
   - `calc-total-units`, `calc-total-sf`, `calc-avg-unit-sf`
   - `calc-total-rental-revenue`, `calc-avg-rent-per-unit`, `calc-avg-rent-per-sf`

3. **Other Income (6 fields)**:
   - `calc-parking-per-unit` ($/unit/month)
   - `calc-parking-total` (calculated)
   - `calc-laundry-per-unit` ($/unit/month)
   - `calc-laundry-total` (calculated)
   - `calc-other-income` (annual)
   - `calc-total-other-income` (calculated)

4. **Vacancy & Loss (5 fields)**:
   - `calc-vacancy-rate` (%)
   - `calc-bad-debt-rate` (%)
   - `calc-concessions-rate` (%)
   - `calc-vacancy-loss` (calculated)
   - `calc-egr` (calculated)

5. **Operating Expenses (11 fields)** - 9 expenses + 2 totals:
   - `calc-exp-management` (% of EGR)
   - `calc-exp-taxes` ($/unit/year)
   - `calc-exp-insurance` ($/unit/year)
   - `calc-exp-repairs` ($/unit/year)
   - `calc-exp-utilities` ($/unit/year)
   - `calc-exp-payroll` ($/unit/year)
   - `calc-exp-admin` ($/unit/year)
   - `calc-exp-reserves` ($/unit/year)
   - `calc-exp-other` ($/unit/year)
   - `calc-expenses-total` (calculated)
   - `calc-expense-ratio` (calculated %)

6. **Cap Rate (1 field)**:
   - `calc-cap-rate` (%)

7. **Adjustments (4 fields)**:
   - `calc-adj-capex` ($)
   - `calc-adj-leasing` ($)
   - `calc-adj-other` ($)
   - `calc-adj-total` (calculated)

**UI Design:**
- Collapsible sections (Accordion component)
- Input fields with proper labels and units
- Calculated fields shown as read-only with gray background
- Real-time validation (numbers only, min/max ranges)
- Clear visual distinction between input vs calculated fields

---

### 4.3 OutputPanel.tsx

**Purpose:** Display 7 key validated results in real-time

**Result Metrics (from calculation engine):**

1. **Potential Gross Revenue (PGR)**
   - Field: `calc-pgr`
   - Format: Currency ($204,240)
   - Description: Total rental + other income

2. **Vacancy & Collection Loss**
   - Field: `calc-vacancy-loss`
   - Format: Currency ($7,761)
   - Description: Total revenue loss

3. **Effective Gross Revenue (EGR)**
   - Field: `calc-egr`
   - Format: Currency ($196,479)
   - Description: PGR - Vacancy Loss

4. **Total Operating Expenses**
   - Field: `calc-expenses-total`
   - Format: Currency ($84,621)
   - Description: Sum of all expenses
   - Include: Expense ratio (%)

5. **Net Operating Income (NOI)**
   - Field: `calc-noi`
   - Format: Currency ($111,771)
   - Include: NOI/Unit, NOI/SF

6. **Raw Capitalized Value**
   - Field: `calc-raw-value`
   - Format: Currency ($1,788,336)
   - Description: NOI / Cap Rate (before rounding)

7. **Indicated Value** (FINAL RESULT)
   - Field: `calc-indicated-value`
   - Format: Currency ($1,780,000) - HIGHLIGHTED
   - Include: Value/Unit, Value/SF, GRM

**UI Design:**
- Card-based layout (Card component)
- Large, prominent display for final value
- Color coding: Green for income, Red for expenses, Blue for final value
- Tooltips explaining each metric
- Visual progress flow: PGR → EGR → NOI → Value

---

### 4.4 WalkthroughPanel.tsx

**Purpose:** Show step-by-step calculation breakdown with formulas

**THE NEW PART - Key Innovation:**

This panel provides transparency by showing HOW each result was calculated, not just the final numbers.

**Step Categories:**

1. **Unit Mix Breakdown**
   ```
   Type 1 (1BR/1BA): 16 units × 638 SF × $1,064/mo × 12 = $204,288
   Type 2: [empty]
   Type 3: [empty]
   Type 4: [empty]
   ───────────────────────────────────────────────────
   Total Units: 16
   Total SF: 10,204 (16 × 638)
   Avg Unit SF: 638
   Total Rental Revenue: $204,288/year
   ```

2. **Other Income Breakdown**
   ```
   Parking: $375/unit/mo × 16 units × 12 = $6,000
   Laundry: $150/unit/mo × 16 units × 12 = $2,400
   Other: $0
   ───────────────────────────────────────────────────
   Total Other Income: $8,400
   ```

3. **PGR Calculation**
   ```
   PGR = Rental Revenue + Other Income
   PGR = $204,288 + $8,400 = $212,688
   ```

4. **Vacancy & Loss**
   ```
   Vacancy Rate: 3.8%
   Bad Debt: 0%
   Concessions: 0%
   Total Loss Rate: 3.8%

   Vacancy Loss = $212,688 × 3.8% = $8,082
   EGR = $212,688 - $8,082 = $204,606
   ```

5. **Operating Expenses Breakdown**
   ```
   Management: 4.25% of EGR = $204,606 × 4.25% = $8,696
   Taxes: $1,168/unit × 16 = $18,688
   Insurance: $710/unit × 16 = $11,360
   Repairs: $830/unit × 16 = $13,280
   Utilities: $1,315/unit × 16 = $21,040
   Payroll: $500/unit × 16 = $8,000
   Admin: $0/unit × 16 = $0
   Reserves: $0/unit × 16 = $0
   Other: $245/unit × 16 = $3,920
   ───────────────────────────────────────────────────
   Total Expenses: $84,984
   Expense Ratio: $84,984 / $204,606 = 41.53%
   ```

6. **NOI Calculation**
   ```
   NOI = EGR - Total Expenses
   NOI = $204,606 - $84,984 = $119,622

   Per Unit: $119,622 / 16 = $7,476/unit
   Per SF: $119,622 / 10,204 = $11.72/SF
   ```

7. **Capitalized Value**
   ```
   Cap Rate: 6.25%

   Raw Value = NOI / Cap Rate
   Raw Value = $119,622 / 0.0625 = $1,913,952

   Rounded Value = Round to nearest $10,000 = $1,910,000
   ```

8. **Final Adjustments**
   ```
   CapEx: $0
   Leasing Costs: $0
   Other Adjustments: $0
   Total Adjustments: $0

   Indicated Value = $1,910,000 - $0 = $1,910,000

   Per Unit: $1,910,000 / 16 = $119,375/unit
   Per SF: $1,910,000 / 10,204 = $187.22/SF
   GRM: $1,910,000 / $204,288 = 9.35
   ```

**UI Design:**
- Accordion/Stepper component showing each step
- Collapsible sections for each category
- Syntax-highlighted formulas
- Color-coded intermediate values
- Clear visual hierarchy: Input values → Formula → Result
- Update in real-time as inputs change

**Implementation Strategy:**
- Create `CalculationStep` interface with formula string and result
- Hook into `runCalculations()` to capture intermediate values
- Format as human-readable formulas with proper units
- Display with syntax highlighting for readability

---

### 4.5 useCalculationSteps.ts Hook

**Purpose:** Extract calculation steps from the validated engine

**Challenge:** The current `runCalculations()` function doesn't expose intermediate values - it only updates the store.

**Solution Strategy:**

**Option A: Non-Invasive Wrapper (RECOMMENDED)**
Create a wrapper hook that:
1. Subscribes to all relevant store fields
2. Re-implements the same calculation logic in parallel
3. Captures intermediate steps
4. Returns formatted step objects

**Pros:**
- Does NOT modify validated calculator engine
- Keeps engine pristine and validated
- All step-tracking logic is isolated
- Easy to test independently

**Cons:**
- Duplicates some calculation logic
- Requires manual sync if calculator changes

**Option B: Store Enhancement (NOT RECOMMENDED)**
Modify `runCalculations()` to track steps internally.

**Rejected because:** Would modify the validated engine, which violates the requirement.

**Implementation (Option A):**

```typescript
// useCalculationSteps.ts
export interface CalculationStep {
  id: string;
  category: string;
  label: string;
  formula: string;
  inputs: { name: string; value: number; unit?: string }[];
  result: number;
  resultFormatted: string;
  explanation?: string;
}

export function useCalculationSteps(): CalculationStep[] {
  const store = useReportBuilderStore();

  // Subscribe to all calculator fields
  const calcFields = store.sections.find(s => s.id === 'calc');

  // Re-implement calculation logic to capture steps
  const steps: CalculationStep[] = [];

  // Example: Unit Mix Step
  const type1Count = getFieldValue('calc-type1-count');
  const type1Rent = getFieldValue('calc-type1-rent');
  const type1Annual = type1Count * type1Rent * 12;

  steps.push({
    id: 'unit-mix-type1',
    category: 'Unit Mix',
    label: 'Type 1 Annual Revenue',
    formula: '{count} units × ${rent}/mo × 12',
    inputs: [
      { name: 'count', value: type1Count, unit: 'units' },
      { name: 'rent', value: type1Rent, unit: '$/month' }
    ],
    result: type1Annual,
    resultFormatted: formatCurrency(type1Annual),
    explanation: '1 Bed / 1 Bath units annual rental revenue'
  });

  // ... continue for all calculation steps

  return steps;
}
```

---

## 5. Implementation Steps (Sequenced)

### Phase 1: Project Setup & Routing
1. Create `/src/features/calculator-demo/` directory structure
2. Create basic `CalculatorDemoPage.tsx` with placeholder layout
3. Add route to `App.tsx`: `/calculator-demo`
4. Create types file: `calculatorDemo.types.ts`
5. Verify routing works and store is accessible

### Phase 2: Input Panel
1. Create `InputPanel.tsx` component
2. Map 62 calculator fields from `northBattlefordTestData-REAL.ts`
3. Implement field grouping (Unit Mix, Other Income, etc.)
4. Add Accordion UI for collapsible sections
5. Connect to Zustand store via `updateFieldValue`
6. Add real-time validation (number ranges, required fields)
7. Distinguish calculated vs editable fields visually
8. Test input → store → calculation pipeline

### Phase 3: Output Panel
1. Create `OutputPanel.tsx` component
2. Subscribe to 7 key calculated fields from store
3. Design Card-based layout for results
4. Add color coding (income=green, expense=red, value=blue)
5. Format currency values with proper units
6. Add tooltips explaining each metric
7. Test real-time updates when inputs change

### Phase 4: Calculation Steps Hook
1. Create `useCalculationSteps.ts` hook
2. Re-implement calculation logic to capture steps
3. Define `CalculationStep` interface
4. Extract all 8 step categories (Unit Mix → Final Value)
5. Format formulas as human-readable strings
6. Test step extraction accuracy vs actual results
7. Validate all intermediate values match

### Phase 5: Walkthrough Panel
1. Create `WalkthroughPanel.tsx` component
2. Consume calculation steps from hook
3. Design step-by-step display UI
4. Implement collapsible sections per category
5. Add formula syntax highlighting
6. Show intermediate values clearly
7. Add visual flow indicators (arrows, progress)
8. Test real-time updates as inputs change

### Phase 6: Data Loading & Reset
1. Create `LoadTestDataButton.tsx` component
2. Import `northBattlefordRealData` from test data file
3. Implement `loadFullTestData()` store function call
4. Verify loaded data produces $1,780,000 indicated value
5. Create `ResetButton.tsx` component
6. Implement clear all inputs functionality
7. Add confirmation dialog for reset
8. Test data load → calculate → reset cycle

### Phase 7: Responsive Layout & Polish
1. Implement responsive breakpoints (desktop/tablet/mobile)
2. Test 3-panel layout on different screen sizes
3. Add loading states during calculations
4. Add error handling for invalid inputs
5. Improve accessibility (ARIA labels, keyboard nav)
6. Add help tooltips explaining terminology
7. Performance optimization (memoization, debouncing)
8. Final QA testing

### Phase 8: Documentation & Handoff
1. Add JSDoc comments to all components
2. Create README.md in calculator-demo feature
3. Document calculation formulas and sources
4. Add inline code comments for complex logic
5. Create user guide for stakeholders
6. Record demo video showing functionality

---

## 6. Technical Specifications

### Dependencies (Already Available)
- React 18+ (existing)
- Zustand (existing - store already set up)
- shadcn/ui components (existing - Card, Accordion, Input, etc.)
- Tailwind CSS (existing)
- TypeScript (existing)
- React Router (existing)

### No New Dependencies Required
All functionality can be built with existing packages.

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ features
- CSS Grid & Flexbox

---

## 7. Data Validation Strategy

### Test Data Validation
**Source:** `northBattlefordTestData-REAL.ts`
**Expected Results (7/7 exact match):**
1. PGR: $204,240
2. Vacancy Loss: $7,761
3. EGR: $196,479
4. Total Expenses: $84,621
5. NOI: $111,771
6. Raw Value: $1,788,336
7. Indicated Value: $1,780,000

### Testing Checklist
- [ ] Load test data → verify all 62 fields populate
- [ ] Verify PGR = $204,240
- [ ] Verify EGR = $196,479
- [ ] Verify NOI = $111,771
- [ ] Verify Indicated Value = $1,780,000
- [ ] Modify unit count → verify recalculation
- [ ] Modify cap rate → verify value change
- [ ] Reset → verify all fields clear
- [ ] Check walkthrough shows correct formulas
- [ ] Verify all intermediate steps match

---

## 8. Edge Cases & Error Handling

### Input Validation
- **Zero Units:** Display "No units defined" message
- **Zero Cap Rate:** Display "Cap rate required" (prevent division by zero)
- **Negative Values:** Prevent negative inputs (except adjustments)
- **Non-numeric Input:** Clear field, show validation error
- **Extreme Values:** Warn if values outside typical ranges

### Calculation Errors
- **Division by Zero:** Handle gracefully in cap rate calculation
- **NaN Results:** Display "Invalid calculation" instead of NaN
- **Rounding Errors:** Use consistent rounding (cents for currency)

### UX Edge Cases
- **Empty State:** Show helpful placeholder when no data loaded
- **Loading State:** Show spinner during test data load
- **Reset Confirmation:** Prevent accidental data loss
- **Unsaved Changes:** Warn if navigating away with changes

---

## 9. Performance Considerations

### Optimization Strategies
1. **Debounced Calculations:** Wait 300ms after last input change before recalculating
2. **Memoization:** Use `useMemo` for expensive step formatting
3. **Virtual Scrolling:** If walkthrough gets very long
4. **Lazy Loading:** Load panels on-demand if performance issues
5. **Calculation Caching:** Cache results for identical inputs

### Expected Performance
- Input change → Result update: < 100ms
- Test data load → Full calculation: < 500ms
- Walkthrough rendering: < 200ms
- Total page load: < 1 second

---

## 10. Future Enhancements (Out of Scope)

These are NOT part of this implementation but could be added later:

1. **Export Functionality:** Export walkthrough as PDF or Excel
2. **Comparison Mode:** Side-by-side comparison of different scenarios
3. **Saved Scenarios:** Save/load custom input sets
4. **Formula Customization:** Allow users to modify calculation formulas
5. **Chart Visualizations:** Pie chart for expense breakdown, waterfall for value
6. **Print Stylesheet:** Optimized print layout
7. **Share Link:** Generate shareable URL with parameters
8. **Mobile App:** Native mobile version
9. **Multi-Language:** i18n support
10. **Advanced Scenarios:** Pro forma projections, sensitivity analysis

---

## 11. Risk Mitigation

### Key Risks & Mitigations

**Risk 1: Calculation Discrepancies**
- **Mitigation:** Use exact same logic as validated engine
- **Testing:** Validate against all 7 reference values
- **Fallback:** If discrepancy found, display warning and investigate

**Risk 2: Performance Degradation**
- **Mitigation:** Implement debouncing and memoization from start
- **Testing:** Test with large number of rapid input changes
- **Fallback:** Add "Calculate" button to control when calculations run

**Risk 3: Step Extraction Errors**
- **Mitigation:** Unit test each step extraction independently
- **Testing:** Compare all intermediate values to store values
- **Fallback:** Show simplified step view if detailed extraction fails

**Risk 4: UI Complexity**
- **Mitigation:** Progressive disclosure (collapsible sections)
- **Testing:** User testing with stakeholders
- **Fallback:** Provide simple vs detailed view toggle

**Risk 5: Responsive Layout Issues**
- **Mitigation:** Mobile-first design approach
- **Testing:** Test on multiple devices/screen sizes
- **Fallback:** Simplified stacked layout for small screens

---

## 12. Success Criteria

### MVP Definition
A calculator demo page is successful when:

1. ✅ **Loads Test Data:** One-click load of North Battleford data
2. ✅ **Shows 62 Inputs:** All calculator fields accessible and editable
3. ✅ **Displays 7 Results:** Real-time display of PGR, EGR, NOI, Value, etc.
4. ✅ **Exact Match:** Produces $1,780,000 indicated value with test data
5. ✅ **Step Breakdown:** Shows HOW each result was calculated
6. ✅ **Real-Time Updates:** Changes reflect immediately in all panels
7. ✅ **Reset Functionality:** Can clear all inputs and start fresh
8. ✅ **Responsive:** Works on desktop, tablet, and mobile
9. ✅ **Validated:** All 7 key metrics match reference values

### Stakeholder Acceptance
- Client can understand where $1,780,000 value comes from
- Can modify inputs and see immediate impact
- Calculation transparency builds trust
- Can be used for client presentations
- Serves as documentation of methodology

---

## 13. Dependencies & Constraints

### Must Import (Do Not Copy)
- `useReportBuilderStore` from `/src/features/report-builder/store/reportBuilderStore.ts`
- `northBattlefordRealData` from `/src/features/report-builder/data/northBattlefordTestData-REAL.ts`
- Field definitions from `/src/features/report-builder/schema/fieldRegistry.ts`

### Must NOT Modify
- `runCalculations()` function (lines 5534-5727 in store)
- Any validated calculator logic
- Test data values (except for creating new test scenarios)

### Must Reuse
- Existing UI components from `/src/components/ui/`
- Existing Zustand store structure
- Existing TypeScript types where applicable

---

## 14. Critical Files for Implementation

### Files to Import/Reference (DO NOT MODIFY)

**Calculator Engine:**
- `/src/features/report-builder/store/reportBuilderStore.ts`
  - Contains validated `runCalculations()` function (lines 5534-5727)
  - Import and use, do NOT modify

**Test Data:**
- `/src/features/report-builder/data/northBattlefordTestData-REAL.ts`
  - Contains 62 validated calculator field values
  - Use for "Load Test Data" button

**Field Input Pattern Reference:**
- `/src/features/test-input/TestInputDashboard.tsx`
  - Shows field grouping, collapsible sections, store integration
  - Reference for input panel design

**Layout Pattern Reference:**
- `/src/features/report-builder/components/ReportBuilderLayout.tsx`
  - 3-panel resizable layout using ResizablePanel components
  - Reference for page layout

**Routing:**
- `/src/App.tsx`
  - Add new `/calculator-demo` route here

---

## 15. Agent Deployment Prompt (For Implementation)

**When ready to implement, use this prompt with a frontend agent:**

```
Build an interactive calculator demonstration page for the APR Dashboard V3 project.

CRITICAL CONSTRAINTS:
- DO NOT modify the validated calculator engine (reportBuilderStore.ts lines 5534-5727)
- MUST produce $1,780,000 when North Battleford test data is loaded (validated result)
- Import and use existing calculator, do NOT copy or reimplement it

IMPLEMENTATION PLAN:
Full detailed plan is in: /Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/Calc Eng & Plan Agent/Calculator-Demo-Implementation-Plan.md

KEY REQUIREMENTS:
1. Create 3-panel layout (Input | Output | Walkthrough)
2. Input panel: 62 calculator fields in collapsible sections
3. Output panel: 7 key validated results displayed in real-time
4. Walkthrough panel: Step-by-step calculation breakdown with formulas
5. "Load Test Data" button that loads North Battleford validated data
6. Reset button to clear all inputs
7. Real-time calculation updates as inputs change

VALIDATION:
- Load test data must produce: $1,780,000 indicated value
- All 7 metrics must match validated results
- Walkthrough must show HOW calculations were performed

Follow the 8-phase implementation plan in the full document.
```

---

## Conclusion

This implementation plan provides a complete blueprint for building an interactive calculator demonstration page that showcases the validated income capitalization engine with full transparency. The 3-panel design (Input | Output | Walkthrough) provides stakeholders with the ability to understand not just WHAT the value is, but HOW it was calculated - building trust and demonstrating the rigor of the appraisal methodology.

The plan deliberately avoids modifying the validated calculator engine, instead wrapping it with a demonstration interface that extracts and displays calculation steps. This preserves the validated 7/7 exact match while providing the educational transparency stakeholders need.

All components leverage existing UI library, store architecture, and patterns from the codebase, minimizing new dependencies and ensuring consistency with the rest of the APR Dashboard application.

---

**Plan Status:** ✅ COMPLETE - Ready for Implementation
**Planning Agent ID:** a68de96 (can be resumed if refinements needed)
**Next Step:** Deploy frontend agent with implementation prompt above
**Last Updated:** 2025-12-12
