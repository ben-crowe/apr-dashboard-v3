# Feature 06: Income Approach Calculator

**Epic**: EPIC 3 - Calculation Engine
**Feature ID**: F06
**Status**: 📋 Not Started

---

## Overview

Port and enhance the Income Approach calculator from V3. Implement 24 user input fields that generate 85 calculated output fields. Real-time recalculation with locked output field IDs.

---

## Business Value

- **Core valuation method**: Income capitalization for rental properties
- **Automated calculations**: Eliminate manual Excel calculations
- **Trust-building**: Side-by-side comparison with Excel (Feature 10)
- **Error reduction**: Formula-driven outputs prevent calculation mistakes

---

## Deliverables

- [ ] 24 input fields: Unit mix (16), Other income (3), Vacancy (3), Cap rate (2)
- [ ] 85 output fields: Unit calcs (22), Income (10), Vacancy (5), Expenses (39), NOI & Valuation (10)
- [ ] Real-time calculation engine (`runCalculations()` function)
- [ ] Calculator tables: income-table.ts, expense-table.ts, vacancy-table.ts, noi-table.ts, capitalization-table.ts
- [ ] Validation rules (Zod schemas)
- [ ] Calculator UI in TDD Dashboard Tab "17 - INCOME ANALYSIS"

---

## Technical Scope

### Input Fields (24 total)

**Unit Mix** (16 fields):
- Type 1-4: count, sf, rent, contract-rent (4 types × 4 fields = 16)

**Other Income** (3 fields):
- `calc-parking-per-unit`, `calc-laundry-per-unit`, `calc-other-income`

**Vacancy & Loss** (3 fields):
- `calc-vacancy-rate`, `calc-bad-debt-rate`, `calc-concessions-rate`

**Valuation** (2 fields):
- `calc-cap-rate`, `calc-adj-capex`, `calc-adj-leasing`, `calc-adj-other`

### Output Fields (85 total)

**Unit Mix Calculated** (22 fields):
- Per type: annual, per-unit, per-sf, cont-v-market (4 types × 4-5 fields)
- Totals: total-units, total-sf, avg-unit-sf, total-rental-revenue, avg-rent-per-unit, avg-rent-per-sf

**Income Calculated** (10 fields):
- `calc-parking-total`, `calc-laundry-total`, `calc-total-other-income`
- `calc-pgr` (Potential Gross Revenue), `calc-pgr-per-unit`, `calc-pgr-per-sf`
- `calc-other-income-per-unit`, `calc-rental-revenue-per-unit`

**Vacancy Calculated** (5 fields):
- `calc-vacancy-loss`, `calc-vacancy-per-unit`, `calc-egr` (Effective Gross Revenue)
- `calc-egr-per-unit`, `calc-egr-per-sf`

**Expenses Calculated** (39 fields):
- For each category (taxes, insurance, repairs, payroll, utilities, management, other):
  - annual, per-unit, per-sf, pct-pgr, pct-egr (7 categories × 5 = 35 fields)
- Totals: `calc-expenses-total`, `calc-expenses-per-unit`, `calc-expenses-per-sf`, `calc-expense-ratio`

**NOI & Valuation** (10 fields):
- `calc-noi`, `calc-noi-per-unit`, `calc-noi-per-sf`
- `calc-raw-value`, `calc-adj-total`, `calc-indicated-value`
- `calc-indicated-value-rounded`, `calc-value-per-unit`, `calc-value-per-sf`, `calc-grm`

### Data Flow
```
USER INPUT (TDD Dashboard Tab 17)
    ↓
runCalculations() in reportBuilderStore.ts
    ↓
5 Calculator Tables:
  - income-table.ts
  - expense-table.ts
  - vacancy-table.ts
  - noi-table.ts
  - capitalization-table.ts
    ↓
STORE (sections[calc].fields)
    ↓
interpolateTemplate() → {{calc-noi}} → $109,445
    ↓
HTML Template (Page 49)
```

---

## Architecture Reference

- **Field Map**: [CALC-ENGINE-FIELD-MAP.md](../../Architecture/21-APR-Domain KN Mgr/review & document/CALC-ENGINE-FIELD-MAP.md) (207 lines)
- **Locked IDs**: [LOCKED-FIELD-IDS.md](../../Architecture/21-APR-Domain KN Mgr/architecture-v4/LOCKED-FIELD-IDS.md) (150 lines)
- **V3 Calculator**: `/Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/tables/`

---

## Dependencies

**Requires**:
- Feature 01 (Foundation) - Zustand store
- Feature 03 (Core Sections) - Field registry

**Blocks**:
- Feature 10 (Excel Import) - needs calculator outputs for comparison
- Feature 11 (Live Preview) - needs calculated values in template

---

## Acceptance Criteria

- [ ] All 24 input fields accept user entry
- [ ] All 85 output fields calculate correctly
- [ ] Calculations update within <100ms of input change
- [ ] Calculator matches V3 output (regression test)
- [ ] Zero TypeScript errors (strict mode)
- [ ] All formulas documented with comments
- [ ] Validation prevents invalid inputs (negative counts, cap rate >100%)
- [ ] Calculator works offline (no API calls needed)

---

## Implementation Notes

### Calculation Order Matters
1. **Unit Mix** → total units, total SF, rental revenue
2. **Other Income** → parking, laundry totals
3. **PGR** → rental revenue + other income
4. **Vacancy** → PGR × vacancy rate = EGR
5. **Expenses** → per-unit × total units = annual
6. **NOI** → EGR - expenses
7. **Valuation** → NOI / cap rate = value

### Locked Output Fields
**NEVER change these field IDs without updating calculator code:**
- All `calc-*` fields are calculator outputs
- Changing IDs breaks template interpolation
- See [LOCKED-FIELD-IDS.md](../../Architecture/21-APR-Domain KN Mgr/architecture-v4/LOCKED-FIELD-IDS.md)

### Validation Rules
```typescript
const IncomeApproachSchema = z.object({
  'calc-vacancy-rate': z.number().min(0).max(50),  // 0-50%
  'calc-cap-rate': z.number().min(3).max(15),      // 3-15%
  'calc-type1-count': z.number().int().min(0),    // Integer units
  'calc-type1-rent': z.number().positive(),        // Positive $
});
```

---

## Testing Requirements

- [ ] Unit tests: Each calculator table function
- [ ] Integration tests: Full calculation pipeline
- [ ] Regression tests: V3 output === V4 output
- [ ] Performance tests: <100ms recalculation with 944 fields

### Test Cases
```typescript
describe('Income Calculator', () => {
  it('calculates PGR correctly', () => {
    const inputs = { type1Count: 10, type1Rent: 1000 };
    const result = runCalculations(inputs);
    expect(result['calc-pgr']).toBe(120000); // 10 × $1000 × 12
  });

  it('calculates NOI correctly', () => {
    const inputs = { pgr: 192000, vacancyRate: 5, expenses: 84040 };
    const result = runCalculations(inputs);
    expect(result['calc-noi']).toBe(100760); // EGR - expenses
  });
});
```

---

## Documentation

- [ ] Formula reference for each calculation
- [ ] Field dependency graph (which outputs depend on which inputs)
- [ ] Migration notes from V3 calculator

---

## Progress Log

_Cursor updates this section after each work session_

---

**Created**: 2026-01-10
**Last Updated**: 2026-01-10
**Owner**: Claude Code (Documentation Orchestrator)
