# APR Dashboard v4 - Domain Knowledge Update

**Date:** December 26, 2025
**Purpose:** Consolidated knowledge including Calculator Demo v4, Three Valuation Approaches, and Core Registry Files
**Status:** Active Development - Calculator Demo functional, Valuation Approaches planned

---

## Executive Summary

This document consolidates validated findings and current development status:
1. Field Registry v2.2.0 (1,687 total fields) - **schema/fieldRegistry.ts**
2. Calculator Demo v4 - **Functional at /calculator-demo**
3. Three Valuation Approaches - **Documented with implementation plan**
4. Core Registry Files - **Single source of truth for field IDs**

**Key Outcomes:**
- Calculator Demo v4 loads at `http://localhost:PORT/calculator-demo`
- Income Approach: COMPLETE (86 calculated fields)
- Sales Comparison: IN PROGRESS (sandbox works, ~620 fields needed for full engine)
- Cost Approach: NOT STARTED (~100 fields needed)
- Valuation Approaches documentation created in `docs/15-Contract-review/4-Valuation Approaches/`

---

## CORE REGISTRY FILES (Source of Truth)

**CRITICAL: All agents MUST use these exact file paths and field ID formats.**

### Primary Registry Files

| File | Purpose | Location | Field Count |
|------|---------|----------|-------------|
| **fieldRegistry.ts** | Field definitions (source of truth) | `src/features/report-builder/schema/fieldRegistry.ts` | 1,687 |
| **northBattlefordTestData.ts** | Test values for North Battleford | `src/features/report-builder/data/northBattlefordTestData.ts` | 1,778 values |
| **Report-MF-template.html** | HTML template with placeholders | `public/Report-MF-template.html` | ~1,000+ placeholders |
| **reportBuilderStore.ts** | Calc engine + state management | `src/features/report-builder/store/reportBuilderStore.ts` | N/A |

### Field ID Naming Convention

**Format:** `{section}-{category}-{descriptor}`

**Examples:**
```
calc-noi                    # Calculated: Net Operating Income
calc-exp-taxes-annual       # Calculated: Annual taxes expense
calc-indicated-value        # Calculated: Final indicated value
unit1-rent                  # Input: Unit type 1 monthly rent
comp1-sale-price            # Input: Comparable 1 sale price
cost-rcn-total              # Calculated: Replacement Cost New total
```

**Prefixes by Section:**
| Prefix | Section | Type |
|--------|---------|------|
| `calc-` | Calculated outputs | calculated |
| `unit1-` to `unit4-` | Unit mix inputs | user-input |
| `comp1-` to `comp5-` | Sales comparables | user-input |
| `cost-` | Cost approach fields | user-input/calculated |
| `exp-` | Operating expenses | user-input |
| `img-` | Image fields | user-input |

### Cross-Reference Validation

**Before adding/modifying fields, verify consistency across:**
1. `fieldRegistry.ts` - Field definition exists with correct inputSource
2. `northBattlefordTestData.ts` - Test value provided (if applicable)
3. `Report-MF-template.html` - Placeholder exists: `{{field-id}}`
4. `reportBuilderStore.ts` - Calculation logic (if calculated field)

**Validation Command:**
```bash
# Check if field ID exists in all relevant files
grep -l "field-id-name" src/features/report-builder/schema/fieldRegistry.ts \
  src/features/report-builder/data/northBattlefordTestData.ts \
  public/Report-MF-template.html
```

---

## Calculator Demo v4

### Access URL
```
http://localhost:PORT/calculator-demo
```
(Port varies based on available ports - check terminal output)

### File Structure
```
src/features/calculator-demo-v4/
├── CalculatorDemoPage.tsx          # Main page with 2-column layout
├── index.ts                        # Barrel export
├── context/ThemeContext.tsx        # Light/dark theme
├── components/
│   ├── InputPanel.tsx              # Unit mix, expenses, cap rate inputs
│   ├── OutputPanel.tsx             # Indicated value + CalculationReasoning
│   ├── CalculationReasoning.tsx    # Step-by-step breakdown
│   ├── SalesComparisonSection.tsx  # Wrapper for Sales + Recon
│   ├── SalesComparisonPanel.tsx    # 5-comp grid (LOCAL STATE - not store)
│   ├── ReconciliationPanel.tsx     # Combine Income + Sales
│   └── MarkdownSummary.tsx         # Quick reference cards
```

### Current Layout
```
┌─────────────────────────────────────────────────────────────┐
│  HEADER: Income Capitalization Calculator                   │
├──────────────────────────┬──────────────────────────────────┤
│  INPUT PANEL (45%)       │  OUTPUT PANEL (55%)              │
├──────────────────────────┴──────────────────────────────────┤
│  [▼ Sales Comparison Approach] - COLLAPSIBLE                │
├─────────────────────────────────────────────────────────────┤
│  [▼ Value Reconciliation] - COLLAPSIBLE                     │
├─────────────────────────────────────────────────────────────┤
│  [▼ Summary Report] - COLLAPSIBLE                           │
└─────────────────────────────────────────────────────────────┘
```

### App.tsx Import (FIXED Dec 26)
```typescript
// CORRECT - uses v4 folder
import { CalculatorDemoPage } from "./features/calculator-demo-v4";
```

---

## Three Valuation Approaches

### Documentation Location
```
docs/15-Contract-review/4-Valuation Approaches/
├── README.md                           # Overview of all 3 approaches
├── 1-Income-Approach/
│   └── INCOME-APPROACH-STATUS.md       # Status: COMPLETE
├── 2-Sales-Comparison/
│   ├── SALES-COMPARISON-ENGINE-HANDOFF.md    # Full spec (~620 fields)
│   ├── SALES-COMPARABLES-DATA-MAPPING.md     # Field mapping
│   └── SALES-COMP-SEPARATE-OWNERSHIP.md      # Separation note
└── 3-Cost-Approach/
    ├── COST-APPROACH-ENGINE-HANDOFF.md       # Full spec (~100 fields)
    └── COST-APPROACH-PLACEHOLDER.md          # Placeholder
```

### Status Summary

| Approach | Status | Fields | Calc Engine | Calculator UI |
|----------|--------|--------|-------------|---------------|
| **Income** | COMPLETE | 86 calculated | `runCalculations()` | InputPanel + OutputPanel |
| **Sales Comparison** | IN PROGRESS | ~620 needed | NOT BUILT | SalesComparisonPanel (local state) |
| **Cost** | NOT STARTED | ~100 needed | NOT BUILT | NOT BUILT |

### Implementation Plan (4 Phases)

**Phase 1: Income Approach Tables**
- Create ReportTableSection component
- Add template-matched report tables (Expense, Income, NOI, CapRate, Value)
- Wire to Calculator Demo page

**Phase 2: Sales Comparison Engine**
- Add ~620 comp fields to fieldRegistry.ts
- Add 5 comps to northBattlefordTestData.ts
- Create `runSalesCompCalculations()` in store
- Wire SalesComparisonPanel to store (replace local state)
- Create SalesCompReportTable

**Phase 3: Cost Approach Engine**
- Add ~100 cost fields to fieldRegistry.ts
- Add test data for hypothetical new construction
- Create `runCostApproachCalculations()` in store
- Create CostApproachPanel.tsx
- Create CostReportTable with applicability toggle

**Phase 4: Reconciliation**
- Update ReconciliationPanel for all 3 approaches
- Weighted average calculation
- Toggle for including/excluding each approach

---

## Calc Engine Validation (North Battleford)

### Key Metrics
| Metric | Value |
|--------|-------|
| Total Units | 20 |
| PGR | $204,240 |
| Vacancy Rate | 3.8% |
| EGR | $196,479 |
| Total Expenses | $84,621 |
| Expense Ratio | 43.1% |
| NOI | $111,771 |
| Cap Rate | 6.25% |
| **Indicated Value** | **$1,780,000** |

### Calculation Pipeline
```
1. Unit Mix → Rental Revenue
2. Other Income → Potential Gross Revenue (PGR)
3. Vacancy/Bad Debt → Effective Gross Revenue (EGR)
4. Operating Expenses → Total Expenses
5. EGR - Expenses → Net Operating Income (NOI)
6. NOI ÷ Cap Rate → Raw Value
7. Raw Value + Adjustments → Indicated Value
```

---

## Field Registry v2.2.0 Structure

**File:** `src/features/report-builder/schema/fieldRegistry.ts`
**Total Fields:** 1,687 fields

### InputSource Distribution

| InputSource | Count | Definition |
|------------|-------|------------|
| `user-input` | 1,253 | Manual data entry required |
| `calculated` | 332 | Computed by calc engine |
| `auto-filled` | 94 | Auto-populated from V3 |
| `api-fetch` | 8 | External API data |
| **TOTAL** | **1,687** | |

### Field Categories

| Category | Fields | Notes |
|----------|--------|-------|
| Unit Mix | 16 | 4 types × 4 fields |
| Other Income | 3 | Parking, laundry, other |
| Vacancy | 3 | Rate, amount, EGR |
| Expenses | 35 | 7 categories × 5 metrics |
| Capitalization | 8 | Cap rate, adjustments |
| Calculated Outputs | 21 | Income approach outputs |
| Sales Comps | ~620 (PLANNED) | 5 comps × ~120 fields each |
| Cost Approach | ~100 (PLANNED) | Land, RCN, depreciation |

---

## The 4-File Sync Set

**RULE:** When field IDs change in any file, update all four files.

| File | Purpose | Status |
|------|---------|--------|
| **fieldRegistry.ts** | Field definitions | Source of truth |
| **northBattlefordTestData.ts** | Test values | Synced |
| **Report-MF-template.html** | Template placeholders | Synced |
| **IMAGE-FIELD-MAPPING.json** | Field ID → image path | Synced |

---

## Related Documentation

### Master Documents
- `docs/15-Contract-review/4-Valuation Approaches/README.md` - Valuation approaches overview
- `docs/15-Contract-review/2-Field Management/01-Registry truth docs/EXTRACTION-STATUS-HANDOFF.md` - Sync status

### Implementation Plans
- `/Users/bencrowe/.claude/plans/enchanted-tumbling-umbrella.md` - Active plan for Calculator Demo extension

### Code Locations
| Component | Location |
|-----------|----------|
| Field Registry | `src/features/report-builder/schema/fieldRegistry.ts` |
| Calc Engine | `src/features/report-builder/store/reportBuilderStore.ts` |
| Calculator Demo | `src/features/calculator-demo-v4/` |
| Test Data | `src/features/report-builder/data/northBattlefordTestData.ts` |
| Table Definitions | `src/features/report-builder/tables/` |

---

## Changes from Dec 23 Knowledge File

### Updates Made Dec 26, 2025:
1. **Fixed App.tsx import** - Changed from `calculator-demo` to `calculator-demo-v4`
2. **Added Core Registry Files section** - Clear source of truth for field IDs
3. **Added Valuation Approaches documentation** - New folder with all 3 approaches outlined
4. **Updated file paths** - fieldRegistry is in `/schema/` not `/registry/`
5. **Added Implementation Plan** - 4-phase plan for completing all approaches
6. **Added Cross-Reference Validation** - Instructions for verifying field ID consistency

### Corrections:
- Field Registry path corrected: `schema/fieldRegistry.ts` (not `registry/`)
- Calculator Demo import corrected: `calculator-demo-v4` (not `calculator-demo`)

---

## Agent Guidelines

### Before Modifying Fields:
1. Check `fieldRegistry.ts` for existing field definition
2. Verify field ID format matches convention: `{section}-{category}-{descriptor}`
3. Update all 4 sync files if changing field IDs
4. Run validation to ensure consistency

### Before Adding New Features:
1. Check existing implementation in Calculator Demo v4
2. Reference the plan file for implementation order
3. Use kebab-case for all field IDs
4. Add test data for any new fields

### Common Mistakes to Avoid:
- Using wrong import path for Calculator Demo (use `calculator-demo-v4`)
- Mixing field ID formats (use kebab-case consistently)
- Adding fields without updating all 4 sync files
- Using local state when store should be used (SalesComparisonPanel issue)

---

**Status:** Active Development
**Last Updated:** December 26, 2025
**Next Update:** After Phase 1 implementation completes

---

*This document consolidates all validated findings and serves as the authoritative reference for APR Dashboard v4 domain knowledge.*
