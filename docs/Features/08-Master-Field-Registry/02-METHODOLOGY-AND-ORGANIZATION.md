# Field Input-Output Mapping: Methodology & Organization

**Created**: 2026-01-09
**Last Updated**: 2026-01-12
**Purpose**: Document the methodology, reasoning, and organization structure for Phase 16 field mapping work

---

## EXECUTIVE SUMMARY

Phase 16 created comprehensive **INPUT → OUTPUT field mappings** for all calculator sections (Income, Sales, Cost, Reconciliation). This documentation serves as the **functional specification** that bridges:

1. **Calculator Logic** → How calculations work (`runIncomeCalculations`, `runSalesCompCalculations`, etc.)
2. **Field Registry** → Where fields are defined (`fieldRegistry.ts`)
3. **UI Components** → Where users enter data (`CalcInputPanel`, `SalesTabPanel`, etc.)
4. **Report Template** → Where results are displayed (`Report-MF-template.html`)

**Key Achievement**: 218 unique fields documented and verified across 4 valuation approaches.

---

## METHODOLOGY: How Phase 16 Work Was Conducted

### Phase 16 Mission (From Passover Session)

> "Create **complete functional INPUT → OUTPUT mapping documentation** for all calculator sections to serve as the **source of truth** before building UI. This is **NOT a coding task**. This is a **documentation and verification task**."

### Step-by-Step Process

#### Step 1: Read Source Components (READ-ONLY)
- **Source**: `src/features/calculator-demo-v4/components/`
  - `IncomeApproachPanel.tsx`
  - `SalesComparisonPanel.tsx`
  - `CostApproachPanel.tsx`
  - `ReconciliationPanel.tsx`
- **Purpose**: Identify all input fields and output displays
- **Rule**: DO NOT modify code, only document

#### Step 2: Read Calculation Logic
- **Source**: `src/features/report-builder/store/`
  - `incomeCalculations.ts`
  - `salesCompCalculations.ts`
  - `costApproachCalculations.ts`
- **Purpose**: Understand calculation formulas and dependencies
- **Output**: Documented calculation formulas in OUTPUT tables

#### Step 3: Cross-Reference Field Registry
- **Source**: `src/features/report-builder/schema/fieldRegistry.ts`
- **Purpose**: Verify all field IDs exist and are properly defined
- **Verification**: Check `inputSource: "calculated"` vs `"user-input"`

#### Step 4: Document INPUT Fields
For each approach, created comprehensive INPUT table with:
- Field ID (kebab-case)
- Label (human-readable)
- Type (text, number, currency, percentage)
- Tab Location (where user enters data)
- Registry Status (✅ verified)
- Required flag (Yes/No)

#### Step 5: Document OUTPUT Fields
For each approach, created OUTPUT tables with:
- Output Field ID
- Report Page (where it appears)
- Calculation Formula
- Dependencies (which inputs feed this output)

#### Step 6: Map Dependencies
- **Cross-Section**: Income → Sales (units, SF)
- **Sequential**: RCN → Depreciation → Value (Cost Approach)
- **Final**: All approaches → Reconciliation

#### Step 7: Create Example Values
- Realistic test data for all inputs
- Calculated outputs showing complete flow
- Demonstrates formulas work correctly

#### Step 8: Verification Checklist
- Input fields exist in registry?
- Output fields exist in registry?
- Calculations trigger correctly?
- Template placeholders exist?

#### Step 9: Cross-Verification (Doc 07)
- Verify all 218 fields exist in registry
- Identify orphaned fields (defined but unused)
- Identify missing fields (used but undefined)
- Validate cross-section dependencies

---

## ORGANIZATION STRUCTURE

### Feature 08: Field Input-Output Mapping

**Purpose**: Calculator-focused documentation - **HOW calculations work**

**Contains**:
- ✅ INPUT → OUTPUT mapping tables (Docs 03-06)
- ✅ Calculation formulas and dependencies
- ✅ Field alignment verification (Doc 07)
- ✅ Valcre API integration field mapping
- ✅ Example values and test data

**Focus**: **Functional specification** for calculator logic

**Key Documents**:
1. `01-INCOME-APPROACH-INPUT-OUTPUT-MAP.md` - 58 fields
2. `02-SALES-COMPARISON-INPUT-OUTPUT-MAP.md` - 115 fields
3. `03-COST-APPROACH-INPUT-OUTPUT-MAP.md` - 31 fields
4. `04-RECONCILIATION-INPUT-OUTPUT-MAP.md` - 14 fields
7. `07-FIELD-ALIGNMENT-VERIFICATION.md` - Master verification

**Use Case**: "I need to understand how Income Approach calculations work" → Go to Feature 08

---

### Feature 09: Template Management

**Purpose**: Template-focused documentation - **HOW fields appear in reports**

**Contains**:
- ✅ Template design standards (typography, colors, spacing)
- ✅ Field registry conventions (naming, structure)
- ✅ Template page-to-field mapping
- ✅ Field toggle system (Dev Mode vs User Ready)
- ✅ Pipeline completion summaries

**Focus**: **Template integration** and design standards

**Key Documents**:
1. `01-DESIGN-STANDARDS.md` - Typography, colors, spacing
2. `08-FIELD-REGISTRY-GUIDE.md` - Naming conventions, 4-file sync
3. `templates/Template-Page-Field-Mapping.md` - Page-to-field reference
4. `04-PIPELINE-COMPLETION-SUMMARY.md` - Store-to-template wiring

**Use Case**: "I need to add a field to the template" → Go to Feature 09

---

## CLEAR SEPARATION OF CONCERNS

### Feature 08: Calculator Logic (Phase 16)

**Questions Answered**:
- What inputs does the user enter?
- What calculations run?
- What outputs are produced?
- How do approaches depend on each other?

**Example**: "How does Sales Comparison calculate indicated value?"
- **Answer**: Average of adjusted price-per-unit × subject units
- **Formula**: `sca-indicated-value = AVG(compN-adj-price-per-unit) × calc-total-units`
- **Location**: Feature 08, Doc 02

---

### Feature 09: Template Integration (Phase 17+)

**Questions Answered**:
- Where does this field appear in the report?
- What page number?
- What styling is used?
- How is it wired from store to template?

**Example**: "Where does Sales Comparison indicated value appear in the template?"
- **Answer**: Page 44, in "Value Indication" section
- **Template**: `{{sca-indicated-value}}`
- **Location**: Feature 09, Template-Page-Field-Mapping.md

---

## CROSS-REFERENCES

### Feature 08 → Feature 09

**When documenting calculations**, reference template location:
```markdown
| Output Field ID | Report Page | Calculation |
|----------------|-------------|-------------|
| `sca-indicated-value` | Page 44 | AVG(adj-price-per-unit) × units |
```

**Reference**: See `09-Template-Management/templates/Template-Page-Field-Mapping.md` for template structure.

---

### Feature 09 → Feature 08

**When documenting template fields**, reference calculation source:
```markdown
| Field ID | Page | Source |
|----------|------|--------|
| `sca-indicated-value` | 44 | Sales Comparison calculation |
```

**Reference**: See `08-Field-Input-Output-Mapping/02-SALES-COMPARISON-INPUT-OUTPUT-MAP.md` for calculation formula.

---

## FIELD REGISTRY OVERLAP

### Feature 08: Uses Registry for Verification

**Purpose**: Verify field IDs exist and are correctly defined
- Checks `inputSource: "calculated"` vs `"user-input"`
- Verifies field IDs match calculation logic
- Documents registry status (✅ verified)

**Example**: Doc 07 verification checklist

---

### Feature 09: Documents Registry Conventions

**Purpose**: Guide for creating new fields and maintaining registry
- Naming conventions (kebab-case)
- Field structure (id, storeId, label, type, inputSource)
- 4-file sync requirements (registry ↔ store ↔ template ↔ UI)

**Example**: `08-FIELD-REGISTRY-GUIDE.md`

---

## RECOMMENDED WORKFLOW

### Adding a New Calculator Field

1. **Feature 08**: Document INPUT → OUTPUT mapping
   - Add to appropriate approach doc (03-06)
   - Document calculation formula
   - Add to verification checklist

2. **Feature 09**: Add to template
   - Add field to `fieldRegistry.ts` (following conventions)
   - Add `{{field-id}}` placeholder to template
   - Update Template-Page-Field-Mapping.md

3. **Cross-Verify**: Update Doc 07
   - Add field to registry verification
   - Verify cross-section dependencies

---

### Modifying a Calculation

1. **Feature 08**: Update calculation documentation
   - Modify OUTPUT table formula
   - Update example values
   - Update dependencies

2. **Feature 09**: Verify template still works
   - Check field ID hasn't changed
   - Verify template placeholder exists
   - Test with sample data

---

## PHASE 16 DELIVERABLES SUMMARY

### Documentation Created

| Doc | Approach | Fields | Status |
|-----|----------|--------|--------|
| 01 | Income | 58 | ✅ Complete |
| 02 | Sales Comparison | 115 | ✅ Complete |
| 03 | Cost | 31 | ✅ Complete |
| 04 | Reconciliation | 14 | ✅ Complete |
| 05 | Verification | 218 | ✅ Complete |

**Total**: 218 unique fields documented and verified

### Key Achievements

- ✅ All field IDs verified in `fieldRegistry.ts`
- ✅ All calculation formulas documented
- ✅ All cross-section dependencies mapped
- ✅ 2 minor issues identified (documented, low impact)
- ✅ Foundation laid for Phase 17 (UI Tab Implementation)

---

## RELATED DOCUMENTATION

### Phase 15: Field Registry Completion
- **Location**: `docs/15-Contract-review/2-Field Management/`
- **Achievement**: Registry brought to 100% template coverage (+123 fields)
- **Result**: 1,643 fields, all kebab-case verified

### Phase 16: Field Input-Output Mapping (THIS PHASE)
- **Location**: `docs/Features/08-Field-Input-Output-Mapping/`
- **Achievement**: 218 calculator fields documented and verified
- **Result**: Complete functional specification for calculator logic

### Phase 17: Template Management
- **Location**: `docs/Features/09-Template-Management/`
- **Achievement**: Template pages wired to store, design standards established
- **Result**: Complete pipeline from UI → Store → Template

---

## CONCLUSION

**Feature 08** and **Feature 09** serve complementary but distinct purposes:

- **Feature 08**: Calculator logic and calculations (HOW it works)
- **Feature 09**: Template integration and design (WHERE it appears)

Both reference the same **field registry** but from different perspectives:
- Feature 08: Uses registry to verify field existence
- Feature 09: Documents registry conventions for maintenance

**Phase 16 Status**: ✅ COMPLETE
**Next Phase**: Phase 17 (UI Tab Implementation) uses Feature 08 docs as functional spec

---

**Document Status**: ✅ Complete
**Maintained by**: Composer Agent + Ben
**Go-to document for**: Understanding Phase 16 methodology and organization structure
