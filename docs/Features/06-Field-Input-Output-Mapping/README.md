# Phase 16: Field Input-Output Mapping

**Phase Type**: Foundation Work Block
**Status**: ✅ COMPLETE
**Created**: 2026-01-09
**Completed**: 2026-01-09
**Purpose**: Clean functional mapping of calculator inputs → report outputs

---

## Phase Definition

A **Phase** constitutes a major work block that:
- ✅ Has clear deliverables (functional tables, verified mappings)
- ✅ Crosses multiple subsystems (registry, calculator, UI, report template)
- ✅ Enables next phase of development (UI tab design)
- ✅ Can be worked on by multiple agents in parallel
- ✅ Contains complete documentation for handoff to Composer

**Example**: Phase 3 (ClickUp Integration) = 82 sequential docs showing complete feature build

---

## Phase 16 Objectives

### Primary Goal
Create **clean functional tables** showing Input → Output mappings for financial calculator sections, WITHOUT getting tangled in UX/tabs/page layout.

### Success Criteria
1. ✅ All calculator inputs identified and cataloged
2. ✅ All report outputs mapped to inputs
3. ✅ Field ID alignment verified (registry ↔ calculator ↔ template)
4. ✅ Missing inputs identified and documented
5. ✅ Clean markdown tables for each section (Income, Sales, Cost, Recon)
6. ✅ Ready for Composer to build UI tabs from functional spec

---

## Current State (As of 2026-01-09)

### Field Registry Status
- **Total fields**: 1,643 (verified)
- **Template coverage**: 100% (verified Dec 22, 2025)
- **Calculated fields**: ~402
- **User input fields**: ~1,511

### Known Issues
1. **Dashboard tabs lacking inputs** - Some calc engine inputs not exposed in UI
2. **ID mismatches found** - Wrong inputs added to tabs during testing
3. **Unclear input requirements** - Which inputs generate which outputs not documented

### Files in Good State
- ✅ `src/features/report-builder/schema/fieldRegistry.ts` - 1,643 fields, 100% coverage
- ✅ `public/Report-MF-template.html` - All field placeholders mapped
- ✅ `.agent/system/field-registry-overview.md` - System architecture documented

### Files Needing Review
- ⚠️ `src/features/report-builder/components/IncomeTabPanel/` - Input fields may be incomplete
- ⚠️ `src/features/report-builder/components/CalcInputPanel/` - New panel, needs mapping
- ⚠️ Calculator engine files - Need to verify which inputs drive which outputs

---

## Phase 16 Work Plan

### Step 1: Inventory Current State
- [ ] Map all existing dashboard tab input fields
- [ ] Identify calculator engine input requirements
- [ ] Cross-reference with fieldRegistry.ts
- [ ] Find gaps (missing inputs, mismatched IDs)

### Step 2: Create Functional Tables (Per Section)
For each major section (Income, Sales, Cost, Recon):

**Input Table Template**:
```markdown
| Field ID | Label | Type | Source | Tab Location | Required |
|----------|-------|------|--------|--------------|----------|
| [id] | [label] | [type] | [registry/calc] | [tab-name] | [Y/N] |
```

**Output Table Template**:
```markdown
| Output Field | Report Page | Depends On Inputs | Calculation | Verified |
|--------------|-------------|-------------------|-------------|----------|
| [field-id] | [Page X] | [input1, input2] | [formula] | [Y/N] |
```

### Step 3: Verify Field ID Alignment
- [ ] Registry IDs match calculator input IDs
- [ ] Calculator output IDs match template placeholders
- [ ] No orphaned fields (defined but not used)

### Step 4: Document Missing Inputs
- [ ] List inputs required but not in registry
- [ ] List inputs in registry but not in tabs
- [ ] Prioritize by impact on report generation

### Step 5: Prepare for UI Build
- [ ] Create clean spec for Composer to build from
- [ ] Organize tables by tab structure
- [ ] Document validation rules for each input

---

## Key Files for This Phase

### Field Registry & Schema
- `src/features/report-builder/schema/fieldRegistry.ts` - 1,643 field definitions
- `src/features/report-builder/schema/fieldGenerators.ts` - Field generation logic
- `src/utils/fieldMappings.ts` - Field mapping utilities

### Dashboard Tabs (Input UI)
- `src/features/report-builder/components/IncomeTabPanel/IncomeTabPanel.tsx`
- `src/features/report-builder/components/SalesTabPanel/SalesTabPanel.tsx`
- `src/features/report-builder/components/CostTabPanel/CostTabPanel.tsx`
- `src/features/report-builder/components/ReconTabPanel/ReconTabPanel.tsx`
- `src/features/report-builder/components/CalcInputPanel/CalcInputPanel.tsx` - New

### Report Template (Output)
- `public/Report-MF-template.html` - 75-page report with `{{field-id}}` placeholders

### Documentation
- `FIELD-REGISTRY-GUIDE.md` - Field naming, inputSource types, 4-file sync (moved from Phase 15)
- `.agent/system/field-registry-overview.md` - Registry architecture
- `.agent/sops/adding-report-fields.md` - Field addition workflow
- `docs/15-Contract-review/2-Field Management/-passover-sessions/25.12.22-4 - field-registry-completion.md` - Dec 22 work

---

## Progress Tracker

**Last Updated**: 2026-01-09
**Phase Status**: ✅ COMPLETE

- [x] **01** - Income Approach INPUT → OUTPUT Map (Marcel + Desktop - Jan 9)
- [x] **02** - Sales Comparison Approach (Composer - Jan 9)
- [x] **03** - Cost Approach (Composer - Jan 9)
- [x] **04** - Reconciliation (Composer - Jan 9)
- [x] **05** - Field Alignment Verification (Composer - Jan 9)
- [x] **06** - Valcre Workbook Income Structure Reference (Sonnet - Jan 9)
- [x] **07** - Template Pages Analysis & Action Plan (Sonnet - Jan 9)

---

## Agent Handoff Context

### From Previous Work (Dec 22, 2025)
- Registry completed to 100% template coverage (+123 fields)
- All kebab-case naming verified
- Comp1-5 and RentComp1-5 fields fully mapped

### Current Context (Jan 9, 2026)
- User discovered input fields missing from dashboard tabs
- Calc engine inputs not matching UI inputs
- Need functional INPUT → OUTPUT tables before building UI

### For Composer

**See**: `00-PASSOVER-SESSION.md` for complete handoff instructions

**Numbering Convention** (like Phase 3 - ClickUp Integration):
```
01-INCOME-APPROACH-INPUT-OUTPUT-MAP.md       ✅ Done
02-SALES-COMPARISON-INPUT-OUTPUT-MAP.md      ✅ Done
03-COST-APPROACH-INPUT-OUTPUT-MAP.md         ✅ Done
04-RECONCILIATION-INPUT-OUTPUT-MAP.md        ✅ Done
05-FIELD-ALIGNMENT-VERIFICATION.md           ✅ Done
06-VALCRE-WORKBOOK-INCOME-STRUCTURE.md       ✅ Done
07-TEMPLATE-PAGES-ANALYSIS.md                ✅ Done
```

**Template Structure** (copy from Doc 01):
1. INPUT FIELDS table with examples
2. OUTPUT FIELDS tables with calculations
3. Dependencies mapped
4. Verification checklist

**Critical Rules**:
- ✅ CREATE documentation only
- 🚫 DO NOT modify calculator-demo-v4 code
- 🚫 DO NOT edit field registry
- 📋 NUMBER files sequentially

---

## Related Phases

- **Phase 03**: ClickUp Integration (82 docs, complete workflow)
- **Phase 15**: Contract Review (field registry work, template alignment)
- **Phase 16**: Field Input-Output Mapping (THIS PHASE)
- **Phase 17**: (Future) UI Tab Implementation based on Phase 16 tables

---

## Success Criteria for Phase Completion

Phase 16 is COMPLETE when:
- ✅ All financial sections have INPUT and OUTPUT tables
- ✅ Every input field has verified ID in registry
- ✅ Every output field shows which inputs it depends on
- ✅ Missing inputs documented and prioritized
- ✅ Composer has clean spec to build UI tabs
- ✅ No ambiguity about what goes where

**Status**: ✅ **ALL CRITERIA MET**

---

## Phase 16 Completion Summary

**Completed**: 2026-01-09

### Deliverables:
- ✅ 7 comprehensive documentation files (01-07)
- ✅ 218 unique fields documented and verified
- ✅ All cross-section dependencies mapped
- ✅ Field alignment verification complete
- ✅ Master summary tables created
- ✅ Valcre workbook structure reference extracted
- ✅ Template pages analysis with data-sample gaps identified
- ✅ Agent prompts for calculator v2 implementation

### Key Achievements:
- **Income Approach**: 58 fields (29 inputs + 29 outputs)
- **Sales Comparison**: 115 fields (77 inputs + 38 outputs)
- **Cost Approach**: 31 fields (17 inputs + 14 outputs)
- **Reconciliation**: 14 fields (7 inputs + 7 outputs)
- **Total**: 218 fields verified in registry

### Issues Identified:
- ⚠️ 1 orphaned input field (`cost-depr-physical-age`)
- ⚠️ 1 field ID mismatch (`recon-reconciled-value` vs `recon-final-value`)
- ✅ 0 critical issues
- ✅ 0 missing fields

### Next Phase:
**Phase 17**: UI Tab Implementation based on Phase 16 verified field mappings

---

**Phase 16: COMPLETE** ✅
