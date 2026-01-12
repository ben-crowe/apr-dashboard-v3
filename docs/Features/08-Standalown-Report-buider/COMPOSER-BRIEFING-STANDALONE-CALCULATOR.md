# Composer Briefing: Standalone Valuation Calculator

**Created**: 2026-01-09
**Purpose**: Build complete standalone calculator for all 4 valuation approaches
**Strategy**: Phase-by-phase implementation starting with Income Approach
**End Goal**: Production-ready calculator that generates exact report pages for template integration

---

## Project Overview

Build a **standalone web application** that:
1. Accepts user inputs for property valuation
2. Calculates all derived values in real-time
3. Displays results in formatted report pages
4. Exports pages ready to insert into main template

### Why Standalone?

✅ **Isolated development** - don't break main template during updates
✅ **Fast testing** - see calculations instantly without full dashboard
✅ **Reusable components** - proven code copies to main dashboard
✅ **Client demo tool** - show calculations without full system
✅ **Template page generator** - creates exact pages for Report-MF-template.html

---

## Complete System Scope (All 4 Approaches)

### Approach 1: Income Approach (PHASE 1 - START HERE)
- **Inputs**: 49 fields (6 unit types, other income, vacancy, expenses, cap rate)
- **Outputs**: 78 calculated fields
- **Pages Generated**:
  - Direct Capitalization (Page 48)
  - Income Conclusion (Page 49)
  - Operating History (Page 43) - optional
  - Expense Detail (Page 44) - optional

### Approach 2: Sales Comparison (PHASE 2)
- **Inputs**: 77 fields (5 comparables × 15 fields each + adjustments)
- **Outputs**: 38 calculated fields
- **Pages Generated**:
  - Comparable 1-5 Sheets (Pages 53-57)
  - Sales Comparison Grid (Page 58)
  - Sales Analysis (Page 59)
  - Sales Conclusion (Page 60)

### Approach 3: Cost Approach (PHASE 3)
- **Inputs**: 17 fields (land value, replacement cost, depreciation)
- **Outputs**: 14 calculated fields
- **Pages Generated**:
  - Cost Analysis (Page ??)
  - Cost Conclusion (Page ??)

### Approach 4: Reconciliation (PHASE 4)
- **Inputs**: 7 fields (weightings for 3 approaches)
- **Outputs**: 7 calculated fields (weighted average)
- **Pages Generated**:
  - Final Reconciliation (Page 62)

**Total System**: 218 fields across 4 approaches

---

## UI/UX Design Specification

### Layout: Split-Pane Interface (Like Report Builder)

```
┌─────────────────────────────────────────────────────────┐
│  APR Valuation Calculator                               │
│  [v] Direct Capitalization         [Calculate] [Export] │
├──────────────────┬──────────────────────────────────────┤
│                  │                                       │
│  INPUT PANEL     │     PREVIEW PANEL                    │
│  (Left 40%)      │     (Right 60% - Resizable)          │
│                  │                                       │
│  ┌────────────┐  │  ┌─────────────────────────────────┐ │
│  │ Unit Mix   │  │  │                                 │ │
│  │            │  │  │  [PAGE IFRAME]                  │ │
│  │ Type 1     │  │  │                                 │ │
│  │ Type 2     │  │  │  Valuation & Conclusions        │ │
│  │ Type 3     │  │  │                                 │ │
│  │ Type 4     │  │  │  DIRECT CAPITALIZATION TABLE    │ │
│  │ Type 5     │  │  │                                 │ │
│  │ Type 6     │  │  │  [Live calculated values]       │ │
│  └────────────┘  │  │                                 │ │
│                  │  │                                 │ │
│  ┌────────────┐  │  └─────────────────────────────────┘ │
│  │Other Income│  │                                       │
│  └────────────┘  │     ᵖᵃᵍᵉ ⁴⁸  (small gray indicator) │
│                  │                                       │
│  ┌────────────┐  │  [Zoom: Fit Width] [100%] [150%]    │
│  │  Vacancy   │  │                                       │
│  └────────────┘  │                                       │
│                  │                                       │
│  ┌────────────┐  │                                       │
│  │  Expenses  │  │                                       │
│  └────────────┘  │                                       │
│                  │                                       │
│  ┌────────────┐  │                                       │
│  │  Cap Rate  │  │                                       │
│  └────────────┘  │                                       │
│                  │                                       │
└──────────────────┴──────────────────────────────────────┘
```

### Top Controls

**Dropdown**: View selector (no page numbers in dropdown)
```
[v] Direct Capitalization
    ├─ Income Conclusion
    ├─ Operating History
    ├─ Expense Detail
    ├─ Comparable 1 Sheet
    ├─ Comparable 2 Sheet
    └─ ... (etc)
```

**Buttons**:
- `[Calculate]` - Run all calculations and update preview
- `[Export Pages]` - Download generated pages as HTML files
- `[Dev Mode]` - Toggle field ID visibility (yellow highlights)

### Left Panel: Collapsible Input Sections

Each section expands/collapses:
```
▼ Unit Mix (6 types)
  [Type 1 Name] [Count] [SF] [Contract Rent] [Market Rent]
  [Type 2 Name] [Count] [SF] [Contract Rent] [Market Rent]
  ...

▼ Other Income
  [Parking $/unit] [Laundry $/unit] [Other $/year]

▼ Vacancy & Loss
  [Vacancy Rate %] [Concessions %] [Credit Loss %] [Other Loss %]

▼ Operating Expenses (Annual)
  [Property Taxes] [Insurance] [Repairs] [Utilities] [Payroll] [Management] [Other]

▼ Capitalization
  [Cap Rate %] [Cap Rate 2 %] [CapEx Adj] [Leasing Adj] [Other Adj]
```

### Right Panel: Live Preview

**Features**:
- Iframe showing current selected page
- Auto-updates when user changes inputs (if Calculate clicked)
- Zoom controls (fit width, 100%, 150%)
- Small page indicator in bottom-right corner
- Dev Mode toggle to show field IDs

---

## Technology Stack

### Option A: React (Recommended)
**Pros**: Matches main dashboard stack, reusable components
**Cons**: Build step required

### Option B: Pure HTML/CSS/JS
**Pros**: No build step, simple deployment
**Cons**: More manual DOM manipulation

### Option C: Hybrid (React for inputs, HTML for pages)
**Pros**: Best of both worlds
**Cons**: Two systems to maintain

**Recommendation**: **Option A (React)** - components will copy directly to main dashboard

---

## File Structure

```
src/features/standalone-calculator/
├── index.tsx                          (main app container)
├── components/
│   ├── InputPanel/
│   │   ├── InputPanel.tsx            (left panel container)
│   │   ├── UnitMixSection.tsx        (6 unit type inputs)
│   │   ├── OtherIncomeSection.tsx    (parking, laundry, other)
│   │   ├── VacancySection.tsx        (4 vacancy inputs)
│   │   ├── ExpensesSection.tsx       (7 expense inputs)
│   │   └── CapRateSection.tsx        (cap rate + adjustments)
│   ├── PreviewPanel/
│   │   ├── PreviewPanel.tsx          (right panel container)
│   │   ├── PageSelector.tsx          (dropdown menu)
│   │   ├── ZoomControls.tsx          (fit/100%/150%)
│   │   └── PageFrame.tsx             (iframe for page display)
│   └── Controls/
│       ├── CalculateButton.tsx       (trigger calculations)
│       ├── ExportButton.tsx          (download pages)
│       └── DevModeToggle.tsx         (field ID visibility)
├── calculator/
│   ├── income-calculations.ts        (NOI, PGR, EGR, value)
│   ├── sales-calculations.ts         (comp adjustments, indicated value)
│   ├── cost-calculations.ts          (replacement cost, depreciation)
│   └── reconciliation-calculations.ts (weighted average)
├── pages/
│   ├── page-48-direct-cap.html       (Income: Direct Capitalization)
│   ├── page-49-income-conclusion.html (Income: Conclusion)
│   ├── page-53-comp1.html            (Sales: Comparable 1)
│   ├── page-54-comp2.html            (Sales: Comparable 2)
│   ├── page-55-comp3.html            (Sales: Comparable 3)
│   ├── page-56-comp4.html            (Sales: Comparable 4)
│   ├── page-57-comp5.html            (Sales: Comparable 5)
│   ├── page-58-sales-grid.html       (Sales: Grid)
│   ├── page-59-sales-analysis.html   (Sales: Analysis)
│   ├── page-60-sales-conclusion.html (Sales: Conclusion)
│   └── page-62-reconciliation.html   (Final Reconciliation)
├── store/
│   └── calculatorStore.ts            (Zustand store for all fields)
└── styles/
    ├── split-pane.css                (resizable layout)
    ├── input-sections.css            (collapsible sections)
    └── preview-panel.css             (iframe + zoom)
```

---

## Phase 1: Income Approach Implementation

### Step 1: Project Setup
- [ ] Create `/src/features/standalone-calculator/` folder
- [ ] Set up React components structure
- [ ] Install dependencies (Zustand for state, react-split-pane for layout)

### Step 2: UI Layout
- [ ] Build split-pane container (40% left, 60% right, resizable)
- [ ] Create InputPanel skeleton with collapsible sections
- [ ] Create PreviewPanel with iframe container
- [ ] Add dropdown selector (hardcoded options for now)

### Step 3: Income Input Fields (49 fields)
- [ ] UnitMixSection: 6 types × 5 fields = 30 inputs
  - `calc-type{1-6}-name`, `-count`, `-sf`, `-contract-rent`, `-rent`
- [ ] OtherIncomeSection: 3 inputs
  - `calc-parking-per-unit`, `calc-laundry-per-unit`, `calc-other-income-annual`
- [ ] VacancySection: 4 inputs
  - `calc-vacancy-rate`, `calc-concessions-rate`, `calc-credit-loss-rate`, `calc-other-loss-rate`
- [ ] ExpensesSection: 7 inputs
  - `calc-exp-taxes-annual`, `-insurance`, `-repairs`, `-utilities`, `-payroll`, `-management`, `-other`
- [ ] CapRateSection: 5 inputs
  - `calc-cap-rate`, `calc-cap-rate-2`, `calc-adj-capex`, `calc-adj-leasing`, `calc-adj-other`

### Step 4: Calculator Engine
- [ ] Create `income-calculations.ts`
- [ ] Implement calculations for 78 output fields:
  - Unit Mix totals (per-unit, per-sf, annual for each type)
  - PGR calculation (Potential Gross Revenue)
  - Vacancy & loss calculations
  - EGR calculation (Effective Gross Revenue)
  - Operating expense calculations (per-unit, per-sf, %PGR, %EGR for each category)
  - NOI calculation (Net Operating Income)
  - Value indication (NOI ÷ Cap Rate)

### Step 5: Page Templates (HTML)
- [ ] Extract Pages 48-49 from Report-MF-template.html
- [ ] Create standalone HTML files in `/pages/`
- [ ] Update to v2 spec (6 unit types, all sections)
- [ ] Add field-mapped spans with data-field-id attributes

### Step 6: Data Flow
- [ ] Set up Zustand store with 127 fields (49 inputs + 78 outputs)
- [ ] Wire inputs → store (onChange handlers)
- [ ] Wire Calculate button → run calculator engine → update store
- [ ] Wire store → iframe via postMessage (field updates)

### Step 7: Preview Integration
- [ ] Load page HTML into iframe
- [ ] Implement postMessage listener in page HTML
- [ ] Update field values in real-time when Calculate clicked
- [ ] Add zoom controls (fit width, 100%, 150%)

### Step 8: Testing & Polish
- [ ] Test all 127 field calculations with North Battleford data
- [ ] Verify page layout matches template exactly
- [ ] Add Dev Mode toggle (yellow highlights for field IDs)
- [ ] Add Export button (download pages as HTML)

---

## Phase 2: Sales Comparison (After Phase 1 Complete)

### Additional Components Needed:
- [ ] ComparablesSection (5 comps × 15 fields each)
- [ ] AdjustmentsGrid (location, size, age, condition, etc.)
- [ ] sales-calculations.ts (comp adjustments, indicated value)
- [ ] Pages 53-60 HTML templates

---

## Phase 3: Cost Approach (After Phase 2 Complete)

### Additional Components Needed:
- [ ] LandValueSection
- [ ] ReplacementCostSection
- [ ] DepreciationSection
- [ ] cost-calculations.ts
- [ ] Cost approach page templates

---

## Phase 4: Reconciliation (After Phase 3 Complete)

### Additional Components Needed:
- [ ] WeightingsSection (% for each approach)
- [ ] reconciliation-calculations.ts (weighted average)
- [ ] Page 62 reconciliation template

---

## Reference Documentation

**ALL documentation already exists in Phase 16:**

1. **Field Specs**: `/docs/16-Field-Input-Output-Mapping/`
   - `01-INCOME-APPROACH-INPUT-OUTPUT-MAP.md` (58 fields)
   - `02-SALES-COMPARISON-INPUT-OUTPUT-MAP.md` (115 fields)
   - `03-COST-APPROACH-INPUT-OUTPUT-MAP.md` (31 fields)
   - `04-RECONCILIATION-INPUT-OUTPUT-MAP.md` (14 fields)

2. **Field IDs**: `Calculator-Field-Reference-v2.md` (Income Approach v2 spec)

3. **UI Mockup**: `Income-Input-UI-Mockup-v2.html` (Desktop's example)

4. **Page Mapping**: `/docs/17-Template-Management/templates/Template-Page-Field-Mapping.md`

5. **Design Standards**: `/docs/17-Template-Management/DESIGN-STANDARDS.md`

---

## Critical Requirements

### Field ID Consistency (4-File Sync)
Every field ID must match EXACTLY in:
1. Input component (React)
2. Calculator engine (TypeScript)
3. Field registry (`fieldRegistry.ts`)
4. Page template HTML (`data-field-id` attribute)

**Example**: `calc-type1-sf`
- ✅ Correct: kebab-case
- ❌ Wrong: `calcType1SF`, `calc_type1_sf`, `CALC-TYPE1-SF`

### Data Flow
```
User Input
  ↓
Zustand Store (inputs)
  ↓
Calculator Engine (runs calculations)
  ↓
Zustand Store (outputs)
  ↓
postMessage to iframe
  ↓
Page HTML updates field values
```

### Page Format
- Each page is standalone HTML file
- Contains exact same structure as Report-MF-template.html
- Has field-mapped spans: `<span data-field-id="{{calc-noi}}" data-sample="$89,280">{{calc-noi}}</span>`
- Listens for postMessage to update values
- Small page number indicator in footer (e.g., "page 48")

---

## Success Criteria

### Phase 1 Complete When:
- ✅ All 49 income inputs working
- ✅ All 78 calculated outputs correct
- ✅ Pages 48-49 display in preview
- ✅ Live updates when Calculate clicked
- ✅ Zoom controls functional
- ✅ Dev Mode toggle working
- ✅ Export downloads valid HTML

### Full System Complete When:
- ✅ All 4 approaches implemented
- ✅ All 218 fields working
- ✅ All 12+ pages generating correctly
- ✅ Field calculations match Valcre workbook
- ✅ Pages ready to copy into main template
- ✅ Can run full property valuation start to finish

---

## Testing Data

**Use North Battleford property** (from existing test data):
- 24 units total
- Mix of 1-bed, 2-bed, 3-bed units
- Known cap rate, expenses, vacancy rate
- Expected value: ~$1,780,000

**Validation**: Calculator should produce same value as existing calculator-demo-v4

---

## Next Steps for Composer

1. **Review this briefing** - understand full scope
2. **Create detailed implementation plan** for Phase 1 (Income Approach)
3. **Get user approval** on plan before coding
4. **Build Phase 1** following the plan
5. **Test and validate** with North Battleford data
6. **Copy proven pages** back to main template
7. **Repeat for Phases 2-4** (Sales, Cost, Reconciliation)

---

## Questions for Composer to Answer in Plan:

1. **React or Plain JS?** Which approach for fastest development?
2. **State Management**: Zustand, Redux, or useState?
3. **Split Pane Library**: react-split-pane or custom CSS?
4. **Page Communication**: postMessage or direct DOM manipulation?
5. **Calculation Trigger**: Auto-calculate on input change or manual button?
6. **Export Format**: Single HTML file or zip of all pages?
7. **Dev Mode**: Separate toggle or integrated with template modes?

---

**Status**: 📋 Ready for Composer to create implementation plan
**Created by**: Sonnet (2026-01-09)
**For**: Phase 1 of Standalone Valuation Calculator
