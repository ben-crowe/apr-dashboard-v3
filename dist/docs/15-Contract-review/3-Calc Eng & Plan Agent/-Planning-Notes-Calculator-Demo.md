# Planning Notes: Calculator Demo Page

**Status:** 📋 PLANNING COMPLETE - Ready for Implementation
**Date:** 2025-12-12
**Project:** APR Dashboard V3
**Focus:** Interactive calculator demonstration page with calculation transparency

---

## 🔍 QUICK REFERENCE

**When resuming work in this area, READ FIRST:**

1. **Full Implementation Plan:** `Calculator-Demo-Implementation-Plan.md` (in this directory)
2. **SOP Document:** `../passover-sessions/-25.12.11 - SOP-Verification-System.md`
3. **Calculator Validation Report:** `../passover-sessions/-25.12.11 - Calculator-Engine-Validation-Report.md`

---

## 🎯 PROJECT GOAL

Build a standalone interactive page where stakeholders can:
1. Load validated test data (North Battleford)
2. Input or modify calculator values (62 fields)
3. See 7 key results in real-time
4. **See HOW calculations work** (step-by-step breakdown with formulas)

**Key Innovation:** The Walkthrough Panel shows not just WHAT the value is ($1,780,000), but HOW it was calculated with every formula and intermediate step visible.

---

## 🚨 CRITICAL RULES

### Rule 1: DO NOT MODIFY CALCULATOR ENGINE
- **Location:** `/src/features/report-builder/store/reportBuilderStore.ts`
- **Function:** `runCalculations()` (lines 5534-5727)
- **Status:** ✅ VALIDATED - 7/7 exact match with Valcre
- **Rule:** ❌ **NEVER MODIFY THIS CODE**
- **Approach:** Import and use as-is, wrap with step-tracking logic

### Rule 2: Must Match Validated Results
When North Battleford test data is loaded, must produce:
- PGR: $204,240
- Vacancy Loss: $7,761
- EGR: $196,479
- Total Expenses: $84,621
- NOI: $111,771
- Raw Value: $1,788,336
- **Indicated Value: $1,780,000** ✅

### Rule 3: Non-Invasive Wrapper Approach
- Create `useCalculationSteps()` hook that re-implements calculation logic in parallel
- Captures intermediate steps for display
- Does NOT modify validated engine
- All step-tracking logic is isolated
- Keeps engine pristine

---

## 🏗️ 3-PANEL ARCHITECTURE

```
┌─────────────────────────────────────────────────────────┐
│  Header: Calculator Demo | Load Test Data | Reset       │
├──────────────────┬──────────────────┬───────────────────┤
│  INPUT PANEL     │  OUTPUT PANEL    │  WALKTHROUGH      │
│  (Left/Top)      │  (Right/Top)     │  (Bottom/Full)    │
│                  │                  │                   │
│  62 Fields:      │  7 Results:      │  8 Step Groups:   │
│  • Unit Mix      │  • PGR           │  1. Unit Mix      │
│  • Other Income  │  • Vacancy Loss  │  2. Other Income  │
│  • Vacancy Rate  │  • EGR           │  3. PGR           │
│  • Expenses      │  • OpEx          │  4. Vacancy/Loss  │
│  • Cap Rate      │  • NOI           │  5. Expenses      │
│  • Adjustments   │  • Raw Value     │  6. NOI           │
│                  │  • Final Value   │  7. Cap Value     │
│                  │                  │  8. Adjustments   │
└──────────────────┴──────────────────┴───────────────────┘
```

---

## 📂 FILE STRUCTURE

```
/src/features/calculator-demo/
├── CalculatorDemoPage.tsx        # Main container
├── components/
│   ├── InputPanel.tsx            # 62 field inputs
│   ├── OutputPanel.tsx           # 7 key results
│   ├── WalkthroughPanel.tsx      # Step-by-step breakdown (THE NEW PART)
│   ├── LoadTestDataButton.tsx    # Load North Battleford data
│   └── ResetButton.tsx
├── hooks/
│   └── useCalculationSteps.ts    # Extract calculation steps (parallel logic)
└── types/
    └── calculatorDemo.types.ts
```

---

## 🔑 KEY COMPONENTS

### InputPanel.tsx
- 62 calculator fields organized in collapsible sections
- Categories: Unit Mix, Other Income, Vacancy, Expenses, Cap Rate, Adjustments
- Visual distinction: editable (white) vs calculated (gray)
- Real-time validation
- Connected to Zustand store

### OutputPanel.tsx
- 7 key validated results in Card components
- Color coding: Income (green), Expenses (red), Value (blue)
- Large prominent display for final $1,780,000 value
- Tooltips explaining each metric
- Updates in real-time as inputs change

### WalkthroughPanel.tsx (THE INNOVATION)
Shows step-by-step breakdown with formulas:

**Example Display:**
```
Step 1: Unit Mix
  Type 1 (1BR/1BA): 16 units × $1,064/mo × 12 = $204,288
  Total Units: 16
  Total Rental Revenue: $204,288

Step 2: Other Income
  Parking: $375/unit/mo × 16 × 12 = $6,000
  Laundry: $150/unit/mo × 16 × 12 = $2,400
  Total Other Income: $8,400

Step 3: Potential Gross Revenue
  PGR = Rental Revenue + Other Income
  PGR = $204,288 + $8,400 = $212,688

[...continues through all 8 steps...]

Step 8: Final Indicated Value
  Raw Value: $1,913,952
  Rounded: $1,910,000
  Adjustments: $0
  Final Value: $1,910,000
```

---

## 🔧 TECHNICAL APPROACH

### Data Flow
```
User Input (62 fields)
    ↓
Zustand Store (reportBuilderStore)
    ↓
runCalculations() [VALIDATED ENGINE - DON'T TOUCH]
    ↓
useCalculationSteps() [NEW HOOK - Parallel tracking]
    ↓
3 Outputs:
    ├─ Input Panel (shows field values)
    ├─ Output Panel (shows 7 results)
    └─ Walkthrough Panel (shows HOW)
```

### useCalculationSteps Hook Strategy

**Problem:** Calculator engine doesn't expose intermediate values

**Solution:** Non-invasive wrapper
1. Subscribe to all relevant store fields
2. Re-implement same calculation logic in parallel
3. Capture each step with formula, inputs, result
4. Return formatted CalculationStep objects
5. Display in WalkthroughPanel

**Interface:**
```typescript
interface CalculationStep {
  id: string;
  category: string;
  label: string;
  formula: string;
  inputs: { name: string; value: number; unit?: string }[];
  result: number;
  resultFormatted: string;
  explanation?: string;
}
```

---

## 📋 8-PHASE IMPLEMENTATION SEQUENCE

1. **Project Setup & Routing** - Directory structure, route to App.tsx
2. **Input Panel** - 62 fields, grouping, validation, store connection
3. **Output Panel** - 7 results, cards, color coding, tooltips
4. **Calculation Steps Hook** - Re-implement logic, capture steps
5. **Walkthrough Panel** - Display steps, formulas, collapsible sections
6. **Data Loading & Reset** - Test data button, reset functionality
7. **Responsive Layout & Polish** - Mobile/desktop, accessibility, performance
8. **Documentation & Handoff** - JSDoc, README, user guide

---

## ✅ VALIDATION CHECKLIST

When implementation is complete, verify:

- [ ] Load test data → All 62 fields populate correctly
- [ ] PGR = $204,240 ✅
- [ ] EGR = $196,479 ✅
- [ ] NOI = $111,771 ✅
- [ ] Indicated Value = $1,780,000 ✅
- [ ] Modify unit count → Recalculates correctly
- [ ] Modify cap rate → Value changes appropriately
- [ ] Reset button → Clears all inputs
- [ ] Walkthrough shows correct formulas for each step
- [ ] All intermediate values match store values
- [ ] Responsive layout works on mobile/tablet/desktop

---

## 📚 SOURCE DOCUMENTS

### Critical Files to Reference

**Calculator Engine (DO NOT MODIFY):**
- `/src/features/report-builder/store/reportBuilderStore.ts`
  - Lines 5534-5727: `runCalculations()` function
  - Import and use, never modify

**Test Data:**
- `/src/features/report-builder/data/northBattlefordTestData-REAL.ts`
  - 62 validated calculator fields
  - Expected result: $1,780,000

**Field Input Pattern:**
- `/src/features/test-input/TestInputDashboard.tsx`
  - Shows how to display and edit calculator fields
  - Reference for input panel design

**Layout Pattern:**
- `/src/features/report-builder/components/ReportBuilderLayout.tsx`
  - Shows 3-panel resizable layout
  - Reference for page layout

---

## 🚀 DEPLOYMENT PROMPT (When Ready)

```
Build the interactive calculator demonstration page per the full plan in:
Calculator-Demo-Implementation-Plan.md

CRITICAL:
- DO NOT modify calculator engine (lines 5534-5727)
- MUST produce $1,780,000 when test data loaded
- Import existing calculator, don't copy

Create 3 panels:
1. Input: 62 fields organized in sections
2. Output: 7 key results in real-time
3. Walkthrough: Step-by-step formula breakdown

Follow 8-phase plan. Validate against test data.
```

---

## 💡 KEY INSIGHTS

### Why This Matters
- Validates calculator is working correctly (shows the math)
- Builds trust with stakeholders (transparency)
- Educational tool (teaches how valuations work)
- Demo for presentations (interactive playground)
- Documentation of methodology (permanent record)

### Design Philosophy
- **Transparency over opacity:** Show HOW, not just WHAT
- **Trust through proof:** Every step is visible
- **Education through interaction:** Play with inputs, see impact
- **Validation through demonstration:** Proven math, not black box

---

## 🔗 RELATED DOCUMENTS

**In This Directory:**
- `Calculator-Demo-Implementation-Plan.md` - Full detailed plan

**In Parent Directory:**
- `../passover-sessions/-25.12.11 - SOP-Verification-System.md` - Methodology
- `../passover-sessions/-25.12.11 - Calculator-Engine-Validation-Report.md` - Validation proof

**In Reference Images:**
- `../North Battleford Apt -Report-content extracted copy/Ref REPORT Page Images/` - 79 reference pages

---

## 📊 CURRENT STATUS

**Planning Phase:** ✅ COMPLETE
**Planning Agent:** a68de96 (can be resumed if refinements needed)
**Implementation Phase:** ⏳ NOT STARTED
**Next Action:** Deploy frontend agent with full implementation plan

---

## 🎯 SUCCESS CRITERIA

**MVP is successful when:**
1. Loads test data with one click
2. Shows all 62 inputs editable
3. Displays 7 results in real-time
4. Produces exact $1,780,000 value
5. Walkthrough shows HOW calculations work
6. Updates immediately as inputs change
7. Reset clears everything
8. Responsive on all devices
9. All 7 metrics match validated results

**Stakeholder acceptance when:**
- Client understands where value comes from
- Can modify inputs and see impact
- Calculation transparency builds trust
- Can be used for presentations
- Serves as methodology documentation

---

**Last Updated:** 2025-12-12
**Status:** Ready for Implementation
**Read Full Plan:** `Calculator-Demo-Implementation-Plan.md`
