# Phase 16 Passover Session

**From**: Marcel (Co-Architect) + Claude Desktop
**To**: Composer Agent
**Date**: 2026-01-09
**Phase**: 16 - Field Input-Output Mapping

---

## Mission

Create **complete functional INPUT → OUTPUT mapping documentation** for all calculator sections (Income, Sales, Cost, Recon) to serve as the **source of truth** before building UI.

This is **NOT a coding task**. This is a **documentation and verification task** to ensure we have every field mapped before touching the UI.

---

## What We've Completed

### ✅ Doc 01: Income Approach Mapping
**File**: `01-INCOME-APPROACH-INPUT-OUTPUT-MAP.md`

- 29 user input fields documented
- 5 output tables mapped (Unit Mix, Revenue, Vacancy, Expenses, NOI/Value)
- Example values throughout
- Dependencies tracked
- Verification checklist included

### ✅ Visual Reference
**File**: `Calculator-Field-Reference (1).html`

- Side-by-side INPUT (green) → OUTPUT (blue) tables
- Sequential flow: Income → Vacancy → Expense → NOI → Capitalization
- Stakeholder-friendly visual demo
- Shows $1,790,000 calculated result example

---

## What You Need to Do

### Sequential Documentation (Number Files Going Forward)

**File Naming Convention**:
```
02-[SECTION]-INPUT-OUTPUT-MAP.md
03-[SECTION]-INPUT-OUTPUT-MAP.md
...
```

Follow Phase 3 (ClickUp Integration) numbering style: 01, 02, 03... up to completion.

### Required Sections to Document

**Priority Order**:
1. ✅ **Income Approach** (DONE - Doc 01)
2. ⏳ **Sales Comparison Approach**
3. ⏳ **Cost Approach**
4. ⏳ **Reconciliation**
5. ⏳ **Operating History** (if needed separately from Income)

### Template Structure (Copy from Doc 01)

For EACH section, create a doc with:

#### 1. INPUT FIELDS Table
```markdown
| Field ID | Label | Type | Tab Location | Registry | Required |
|----------|-------|------|--------------|----------|----------|
```

#### 2. OUTPUT FIELDS Tables
```markdown
| Output Field ID | Report Page | Calculation | Depends On Inputs |
|----------------|-------------|-------------|-------------------|
```

#### 3. Example Values
- Show filled inputs
- Show calculated outputs
- Demonstrate flow

#### 4. Verification Checklist
- Fields exist in registry?
- Fields rendered in UI?
- Calculations correct?
- Template placeholders exist?

---

## Where to Find Information

### Source Files

**Calculator Panels** (READ-ONLY - DO NOT MODIFY):
```
src/features/calculator-demo-v4/components/
├─ IncomeApproachPanel.tsx       ✅ Reference for Income
├─ SalesComparisonPanel.tsx      ⏳ Use for Sales doc
├─ CostApproachPanel.tsx         ⏳ Use for Cost doc
├─ ReconciliationPanel.tsx       ⏳ Use for Recon doc
└─ OperatingHistoryPanel.tsx     ✅ Used in Income doc
```

**Field Registry**:
```
src/features/report-builder/schema/fieldRegistry.ts
```
- 1,643 fields total
- Search for field IDs matching calc-* pattern
- Verify inputSource: "calculated" vs "user-input"

**Report Template**:
```
public/Report-MF-template.html
```
- Search for {{calc-*}} placeholders
- Identify which report pages use which fields

**Tab Panels** (Current UI):
```
src/features/report-builder/components/
├─ CalcInputPanel/CalcInputPanel.tsx     (Income inputs - 29 fields)
├─ SalesTabPanel/SalesTabPanel.tsx       (Sales inputs)
├─ CostTabPanel/CostTabPanel.tsx         (Cost inputs)
└─ ReconTabPanel/ReconTabPanel.tsx       (Recon inputs)
```

---

## Critical Rules

### 🚫 DO NOT MODIFY CODE
- **READ calculator-demo-v4 components ONLY**
- Do NOT edit the standalone calculator
- Do NOT add fields to registry
- Do NOT modify tab panels

### ✅ DO CREATE DOCUMENTATION
- Sequential numbered markdown files
- Clean INPUT → OUTPUT tables
- Example values
- Verification checklists

### 📋 Numbering Convention
- Start with `02-` for next doc
- Continue sequentially (03, 04, 05...)
- Use descriptive section names
- Example: `02-SALES-COMPARISON-INPUT-OUTPUT-MAP.md`

---

## Success Criteria

Each doc you create must have:

1. **Complete INPUT table** - All user-entered fields
2. **Complete OUTPUT tables** - All calculated results
3. **Example values** - Realistic test data
4. **Dependencies mapped** - Which inputs feed which outputs
5. **Verification section** - Checklist for testing
6. **Field count summary** - Total inputs, total outputs

---

## Expected Deliverables

By end of Phase 16:

```
docs/16-Field-Input-Output-Mapping/
├─ 00-PASSOVER-SESSION.md               (This file)
├─ 01-INCOME-APPROACH-INPUT-OUTPUT-MAP.md     ✅ Done
├─ 02-SALES-COMPARISON-INPUT-OUTPUT-MAP.md    ⏳ Your next task
├─ 03-COST-APPROACH-INPUT-OUTPUT-MAP.md       ⏳ After Sales
├─ 04-RECONCILIATION-INPUT-OUTPUT-MAP.md      ⏳ After Cost
├─ 05-FIELD-ALIGNMENT-VERIFICATION.md         ⏳ Final verification
├─ README.md                             (Phase overview)
└─ Calculator-Field-Reference (1).html   (Visual demo)
```

---

## Related Documentation

**Field Registry Work** (Dec 22, 2025):
- `docs/15-Contract-review/2-Field Management/-passover-sessions/25.12.22-4 - field-registry-completion.md`
- Registry brought to 100% template coverage
- 1,643 fields, all kebab-case verified

**Calculator Demo Standalone**:
- `src/features/calculator-demo-v4/README.md`
- Validated $1,780,000 result with North Battleford test data
- **DO NOT MODIFY** - This is the master calculator

**SpecStory Integration**:
- Follow `.specstory/features/TEMPLATE-feature-overview.md` structure
- This becomes the feature doc for "Field Input-Output Mapping"

---

## SpecStory Feature Doc Required

Create: `.specstory/features/field-input-output-mapping-feature-overview.md`

Using template structure:
1. Executive Summary
2. Architecture Overview
3. Implementation Details (doc numbering system)
4. Data Flow (INPUT → CALC → OUTPUT)
5. Testing & Validation
6. Known Issues & Limitations
7. Related Documentation (Phase 15 registry, Phase 16 mappings)

---

## First Task for Composer

**Start with Sales Comparison Approach**:

1. Read `src/features/calculator-demo-v4/components/SalesComparisonPanel.tsx`
2. Identify all input fields (comp1-5 fields, subject property fields)
3. Identify all calculated outputs (adjusted values, indicated value)
4. Create `02-SALES-COMPARISON-INPUT-OUTPUT-MAP.md` following Doc 01 format
5. Include example values (5 comparables with adjustments)

---

## Questions You Might Have

**Q: Should I fix field ID mismatches I find?**
A: NO. Document them in a "Issues Identified" section. We'll fix in Phase 17.

**Q: What if inputs are missing from CalcInputPanel?**
A: Document in "Missing Inputs" section. We'll add in Phase 17.

**Q: Should I test calculations?**
A: NO. Just document the formulas. Testing happens in Phase 17.

**Q: Can I reorganize the folder?**
A: NO. Only create new numbered docs. Don't move existing files.

---

## Communication

**Update README.md** as you complete each doc:
```markdown
## Progress Tracker

- [x] 01 - Income Approach (Marcel + Desktop - Jan 9)
- [ ] 02 - Sales Comparison (Composer - In Progress)
- [ ] 03 - Cost Approach (Composer - Pending)
- [ ] 04 - Reconciliation (Composer - Pending)
- [ ] 05 - Verification (Composer - Pending)
```

---

## Ready to Begin

You have everything you need:
- ✅ Template (Doc 01)
- ✅ Source files identified
- ✅ Numbering convention clear
- ✅ Success criteria defined
- ✅ SpecStory structure provided

**Start with Doc 02: Sales Comparison Approach**

Good luck! 🚀
