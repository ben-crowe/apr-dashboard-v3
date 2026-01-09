# Field Input-Output Mapping - Feature Overview & Architecture

**Feature Name**: Phase 16 - Field Input-Output Mapping
**Status**: 🚧 In Progress
**Last Updated**: 2026-01-09
**Version**: 1.0

---

## Executive Summary

Phase 16 creates **complete functional documentation** of all calculator field relationships (INPUT → OUTPUT) across the APR Dashboard's 4 valuation approaches (Income, Sales, Cost, Reconciliation). This serves as the **source of truth** before building UI, ensuring every input field has a purpose and every output field has verified inputs.

### Key Capabilities
- ✅ Income Approach mapped (29 inputs → 5 output tables)
- 🚧 Sales Comparison Approach mapping (In Progress)
- 📋 Cost Approach mapping (Planned)
- 📋 Reconciliation mapping (Planned)
- 📋 Field alignment verification across all approaches (Planned)

---

## Architecture Overview

### System Flow

```
USER INPUTS                CALCULATOR ENGINE           REPORT TEMPLATE
(CalcInputPanel)     →     (Validated Logic)     →     ({{field-id}})
                                  ↓
                        PHASE 16 MAPPINGS
                    (Documentation Layer)
                            ↓
            Verifies: Registry ↔ UI ↔ Template
```

### Component Architecture

```
docs/16-Field-Input-Output-Mapping/
├─ 00-PASSOVER-SESSION.md              (Agent handoff)
├─ 01-INCOME-APPROACH-INPUT-OUTPUT-MAP.md
│   ├─ 6 INPUT sections (29 fields)
│   ├─ 5 OUTPUT tables (calculated results)
│   └─ Dependencies + Verification checklist
├─ 02-SALES-COMPARISON-INPUT-OUTPUT-MAP.md  (Next)
├─ 03-COST-APPROACH-INPUT-OUTPUT-MAP.md     (Pending)
├─ 04-RECONCILIATION-INPUT-OUTPUT-MAP.md    (Pending)
├─ 05-FIELD-ALIGNMENT-VERIFICATION.md       (Pending)
├─ README.md                           (Phase overview)
└─ Calculator-Field-Reference.html     (Visual demo)
```

---

## Implementation Details

### Doc 01: Income Approach (Completed)

**Location**: `docs/16-Field-Input-Output-Mapping/01-INCOME-APPROACH-INPUT-OUTPUT-MAP.md`
**Purpose**: Map all Income Approach calculator fields

**Input Sections**:
1. Unit Mix (×4 types) - 20 fields (name, count, sf, rent, contract-rent per type)
2. Other Income - 3 fields (parking, laundry, other)
3. Vacancy & Loss - 3 fields (vacancy %, bad debt %, concessions %)
4. Operating Expenses - 7 fields (taxes, insurance, repairs, payroll, utilities, mgmt, other)
5. Cap Rate - 3 fields (cap rate, range low, range high)
6. Adjustments - 3 fields (capex, leasing, other)

**Total Inputs**: 29 fields

**Output Tables**:
1. Unit Mix Summary (total units, SF, annual revenue per type)
2. Revenue Summary (total rental, other income, PGR)
3. Vacancy & EGR (vacancy loss, EGR)
4. Operating Expenses (per-unit breakdowns, total)
5. NOI & Value (NOI, indicated value, value range)

**Total Outputs**: ~40 calculated fields

**Key Logic**:
```typescript
PGR = Σ(type × rent × 12) + parking + laundry + other
EGR = PGR - (PGR × vacancy%)
NOI = EGR - Total Expenses
Indicated Value = (NOI / cap-rate) + adjustments
```

### Visual Reference HTML

**Location**: `docs/16-Field-Input-Output-Mapping/Calculator-Field-Reference.html`

**Features**:
- Side-by-side INPUT (green) → OUTPUT (blue) layout
- 5 sequential tables showing calculation flow
- Dependency warnings between tables
- Example values: $1,790,000 indicated value
- Stakeholder-friendly visual demo

---

## Data Flow & Field Mapping

### Field Registry → Calculator → Template

| Source | Field Count | Purpose |
|--------|-------------|---------|
| `fieldRegistry.ts` | 1,643 total | Single source of truth for all fields |
| Calculator Panels | ~100 calc fields | Read from registry, compute outputs |
| Report Template | 1,029 placeholders | Display calculated results |

### Field ID Naming Convention

**Income Approach Pattern**:
- Inputs: `calc-type1-count`, `calc-vacancy-rate`, `calc-exp-taxes-annual`
- Outputs: `calc-total-units`, `calc-pgr`, `calc-noi`, `calc-indicated-value`

**All approaches use `calc-*` prefix** for calculator fields.

---

## API Integration Details

N/A - This is a documentation feature, not API integration.

---

## Testing & Validation

### Test Scenarios

1. **Registry Coverage**: Verify all calc-* fields exist in fieldRegistry.ts
2. **UI Rendering**: Verify all input fields render in CalcInputPanel
3. **Calculation Flow**: Verify outputs update when inputs change
4. **Template Binding**: Verify {{calc-*}} placeholders populate in report
5. **Example Values**: Use North Battleford test data → $1,780,000 result

### Test Scripts

**Location**: N/A (Manual verification via checklists in each doc)

**Validation Process**:
- Read calculator panel component
- Extract all input field IDs
- Extract all output field IDs
- Cross-reference with fieldRegistry.ts
- Document discrepancies in "Issues Identified" section

---

## Configuration & Environment Variables

N/A - Documentation feature only.

---

## Known Issues & Limitations

### Current Limitations

1. **Field ID Mismatches**: Expense inputs show `calc-exp-taxes` (per-unit) in HTML visual but `calc-exp-taxes-annual` in CalcInputPanel code
2. **Missing Inputs**: Some calculated outputs may lack corresponding UI inputs in CalcInputPanel
3. **Incomplete Coverage**: Only Income Approach documented so far (Sales, Cost, Recon pending)

### Future Enhancements

1. **Automated Verification**: Script to validate field IDs across registry → UI → template
2. **Visual Flow Diagrams**: Mermaid charts showing INPUT → CALC → OUTPUT for each approach
3. **Interactive HTML Demo**: Add input editing to visual reference HTML
4. **CI/CD Integration**: Auto-check for field ID consistency on commits

---

## Related Documentation

- **Phase 15 Field Registry**: `docs/15-Contract-review/2-Field Management/-passover-sessions/25.12.22-4 - field-registry-completion.md`
- **Calculator Demo Standalone**: `src/features/calculator-demo-v4/README.md`
- **Field Registry Overview**: `.agent/system/field-registry-overview.md`
- **Field Addition SOP**: `.agent/sops/adding-report-fields.md`

---

## Maintenance & Updates

### Update History

**2026-01-09**: Created Phase 16, completed Income Approach mapping (Doc 01)

### Maintenance Tasks

- [ ] Complete Sales Comparison mapping (Doc 02)
- [ ] Complete Cost Approach mapping (Doc 03)
- [ ] Complete Reconciliation mapping (Doc 04)
- [ ] Create field alignment verification doc (Doc 05)
- [ ] Update visual HTML reference for all approaches
- [ ] Create automated field ID validation script

---

## Handoff to Composer

**Passover Session**: `docs/16-Field-Input-Output-Mapping/00-PASSOVER-SESSION.md`

**Next Tasks**:
1. Document Sales Comparison Approach (Doc 02)
2. Document Cost Approach (Doc 03)
3. Document Reconciliation (Doc 04)
4. Create verification doc (Doc 05)

**Numbering Convention**: Sequential (01, 02, 03...) like Phase 3 (ClickUp Integration)

**Template**: Follow Doc 01 structure for all subsequent docs

---

**End of Feature Overview**

*This document is maintained in SpecStory and can be referenced in Claude Code via:*
*`@.specstory/features/field-input-output-mapping-feature-overview.md`*
