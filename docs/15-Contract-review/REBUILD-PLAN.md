# Rebuild Plan: reportBuilderStore.ts

**Date:** December 5, 2025
**Task:** Reconstruct corrupted store file from documentation
**Status:** Store truncated from ~3,300 lines to 100 lines

---

## Situation

The `reportBuilderStore.ts` file was corrupted by a subagent. It now contains only 100 lines (partial COVER section). The file was not tracked in git, and backup is also truncated.

**Intact Resources:**
- `reportHtmlTemplate.ts` (2,510 lines) - Shows section IDs and render functions
- Session 5 passover doc - Complete section/subsection structure
- Session 6 passover doc - CALC section design and calculation logic
- `2-FIELD-MAPPING.md` - 330+ field definitions
- `reportBuilder.types.ts` - Type definitions including expenseCalcBase

---

## Rebuild Strategy

### Approach: Incremental Build with Verification

Build the file in phases, verifying compilation after each phase. Do NOT write the entire file in one operation.

### Phase 1: Core Structure (Lines 1-200)

```
File: /src/features/report-builder/store/reportBuilderStore.ts

1. Imports (zustand, types, template)
2. Type definitions (helper types if needed)
3. getMockData() function opening
4. COVER section (already exists, just need closing)
```

### Phase 2: Sections 1-7 (Lines 200-800)

| Section ID | Subsections | Est. Lines |
|------------|-------------|------------|
| `cover` | PREPARED FOR, PREPARED BY | ~100 |
| `home` | Letter of Transmittal | ~50 |
| `custom` | Custom fields | ~30 |
| `maps` | Map images | ~40 |
| `report` | Report metadata | ~50 |
| `exec` | PROPERTY IDENTIFICATION, VALUE SUMMARY, KEY CHARACTERISTICS | ~120 |
| `photos` | EXTERIOR, STREET VIEWS, INTERIOR COMMON, UNIT INTERIORS, BUILDING SYSTEMS | ~150 |

### Phase 3: Sections 8-14 (Lines 800-1600)

| Section ID | Subsections | Est. Lines |
|------------|-------------|------------|
| `site` | SITE AREA, ADJACENT USES, CHARACTERISTICS, CONDITIONS, IMAGES | ~180 |
| `location` | OVERVIEW, WALKABILITY SCORES, LOCAL AREA, MAPS | ~100 |
| `tax` | Flat structure (7 fields) | ~60 |
| `market` | NATIONAL, PROVINCIAL, LOCAL, MULTIFAMILY | ~120 |
| `impv` | BUILDING OVERVIEW, AMENITIES, CONSTRUCTION, SYSTEMS, FINISHES, SITE IMPV, CONDITION | ~250 |
| `zone` | 12 fields including map image | ~80 |
| `hbu` | INTRODUCTION, AS VACANT, AS IMPROVED, CONCLUSION | ~100 |

### Phase 4: CALC Section (Lines 1600-1900)

**Placement:** After HBU, before LAND1

**7 Subsections (64 fields):**

1. **UNIT MIX** (26 fields)
   - 4 unit types: type, count, SF, market-rent, annual (calculated)
   - Totals: total-units, total-sf, avg-unit-sf, total-rental-revenue, avg-rent-per-unit, avg-rent-per-sf

2. **OTHER INCOME** (7 fields)
   - parking-per-unit, parking-total (calc)
   - laundry-per-unit, laundry-total (calc)
   - other-income, total-other-income (calc), pgr (calc)

3. **VACANCY & LOSS** (5 fields)
   - vacancy-rate, bad-debt-rate, concessions-rate
   - vacancy-loss (calc), egr (calc)

4. **OPERATING EXPENSES** (12 fields with expenseCalcBase)
   - management: `percent_egr` (4.25%)
   - taxes, insurance, repairs, utilities, payroll, admin, reserves, other: `per_unit`
   - expenses-total (calc), expense-ratio (calc)

5. **CAPITALIZATION** (1 field)
   - cap-rate

6. **POST-VALUE ADJUSTMENTS** (4 fields)
   - adj-capex, adj-leasing, adj-other, adj-total (calc)

7. **VALUATION RESULTS** (8 fields)
   - noi, noi-per-unit, noi-per-sf
   - raw-value, indicated-value (rounded to $10K)
   - value-per-unit, value-per-sf, grm

### Phase 5: Sections 15-21 (Lines 1900-2500)

| Section ID | Subsections | Est. Lines |
|------------|-------------|------------|
| `land1` | Land value (placeholder) | ~20 |
| `cost-s` | Cost approach (placeholder) | ~20 |
| `sales` | SUBJECT SUMMARY, COMP 1-3, VALUE CONCLUSION | ~200 |
| `income` | POTENTIAL INCOME, OPERATING EXPENSES, NOI, ANALYSIS | ~150 |
| `recon` | VALUE INDICATIONS, WEIGHTS, ANALYSIS, FINAL VALUE | ~100 |
| `cert` | 12 certification statements + signature | ~80 |

### Phase 6: Section Groups (Lines 2500-2600)

```typescript
const sectionGroups: SectionGroup[] = [
  { id: 'intro', name: 'Introduction', sections: ['cover', 'home', 'custom', 'maps', 'report'] },
  { id: 'analysis', name: 'Analysis', sections: ['exec', 'photos', 'site', 'location', 'tax', 'market'] },
  { id: 'improvements', name: 'Improvements', sections: ['impv', 'zone', 'hbu'] },
  { id: 'calculator', name: 'Calculator', sections: ['calc'] },
  { id: 'valuation', name: 'Valuation', sections: ['land1', 'cost-s', 'sales', 'income'] },
  { id: 'conclusion', name: 'Conclusion', sections: ['recon', 'cert'] },
];
```

### Phase 7: Store Creation (Lines 2600-2800)

```typescript
export const useReportBuilderStore = create<ReportBuilderState>((set, get) => ({
  sections: getMockData(),
  sectionGroups: sectionGroups,
  activeSection: 'cover',
  previewHtml: '',
  isDirty: false,
  sidebarCollapsed: false,

  // Actions...
}));
```

### Phase 8: Store Actions (Lines 2800-3100)

1. `setActiveSection(sectionId)`
2. `updateFieldValue(fieldId, value)` - with calculation trigger
3. `reorderImages(fieldId, imageUrls)`
4. `addImage(fieldId, imageUrl)`
5. `removeImage(fieldId, imageUrl)`
6. `generatePreview()`
7. `initializeMockData()`
8. `toggleSidebar()`
9. `loadCalcTestData()` - North Battleford test data
10. `loadFullTestData()` - Complete report test data

### Phase 9: Calculation Engine (Lines 3100-3300)

```typescript
const updateCalculatedFields = () => {
  // Get CALC input values
  const units = getFieldValue('calc-total-units');
  const sqft = getFieldValue('calc-total-sf');
  const pgr = getFieldValue('calc-pgr');
  const egr = getFieldValue('calc-egr');

  // Calculate each expense based on expenseCalcBase
  const calculateExpense = (fieldId: string, value: number, base: string) => {
    switch (base) {
      case 'percent_pgr': return pgr * (value / 100);
      case 'percent_egr': return egr * (value / 100);
      case 'fixed': return value;
      case 'per_unit': return value * units;
      case 'per_sf': return value * sqft;
    }
  };

  // Calculate totals
  // NOI = EGR - Total Expenses
  // Raw Value = NOI / (capRate / 100)
  // Rounded = Math.round(rawValue / 10000) * 10000
  // Indicated = Rounded - Adjustments

  // Sync to RECON
  // calc-indicated-value -> recon-income-value
};
```

---

## Test Data for Verification

**North Battleford Calculator Values:**
```
Unit Mix:
- Type 1: 1BR/1BA, 4 units, 550 SF, $900/mo
- Type 2: 2BR/1BA, 12 units, 667 SF, $1,060/mo

Expected Results:
- Total Units: 16
- Total SF: 10,204
- PGR: $204,240
- EGR: ~$196,070 (4% vacancy)
- NOI: ~$111,449
- Indicated Value: $1,780,000 (at 6.25% cap)
```

---

## Files to Reference

```
/docs/15-Contract-review/-passover-sessions/25.12.04-5-V4-Report-Builder-Template-Implementation.md
/docs/15-Contract-review/-passover-sessions/25.12.04-6-Calculator-Engine-Integration.md
/docs/15-Contract-review/2-FIELD-MAPPING.md
/src/features/report-builder/templates/reportHtmlTemplate.ts (intact, 2510 lines)
/src/features/report-builder/types/reportBuilder.types.ts
```

---

## Execution Steps

1. **Read template file** to get exact section IDs used in render functions
2. **Build Phase 1** - Core structure + COVER completion
3. **Verify compilation** - Run `npm run dev`, check for errors
4. **Build Phase 2-5** - Sections incrementally, verify after each
5. **Build Phase 6-7** - Section groups and store creation
6. **Build Phase 8** - Store actions
7. **Build Phase 9** - Calculation engine
8. **Test loadCalcTestData()** - Verify $1,780,000 output
9. **Test loadFullTestData()** - Load complete North Battleford report

---

## Success Criteria

- [ ] Store compiles without errors
- [ ] All 21 sections render in preview
- [ ] Section navigation works (sidebar click -> preview scroll)
- [ ] Field editing works (changes reflect in preview)
- [ ] CALC section calculates correctly
- [ ] loadCalcTestData() produces $1,780,000 indicated value
- [ ] loadFullTestData() populates all sections with test data
