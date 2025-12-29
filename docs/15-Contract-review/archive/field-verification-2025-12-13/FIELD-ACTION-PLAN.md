# Field Action Plan - 273 Missing Fields

**Date:** 2025-12-13
**Status:** Analysis Complete - Awaiting Manual Verification

---

## What We Know

### From Workbook Analysis:
- ✅ Valcre workbook has 7,973 named ranges
- ✅ Some boilerplate IS in workbook (reconciliation paragraphs as named ranges)
- ✅ Workbook uses different naming: `L_SubjectCorner` vs template `site-corner`
- ❌ No direct name mapping exists yet
- ❌ Certification items NOT in workbook (likely VBA/Word template)

### From Gemini Field Audit:
- 273 fields used in templates but NOT in fieldRegistry.ts
- Categories: Site (13), Frontage (13), Inspection (8), Zoning (4), Other (235)

### Key Discovery:
The template field IDs (kebab-case like `site-corner`) don't match workbook field names (PascalCase like `L_SubjectCorner`). This means we need MANUAL verification, not automated matching.

---

## Recommended Workflow

### Step 1: Manual Spot Check (YOU DO THIS)

Open the Valcre workbook and check 5 sample fields:

1. **site-corner**
   - Search workbook for: "corner"
   - Likely field: `L_SubjectCorner`
   - Action: Verify if it contains "Corner" or "Mid-block"

2. **site-grade**
   - Search workbook for: "grade"
   - Likely field: `L_StreetGrade`
   - Action: Verify if it contains grade info

3. **certification-item-1**
   - Search workbook for: "certification" or "certify"
   - Result: NOT FOUND (confirmed - it's boilerplate)

4. **reconciliation-para-1**
   - Search workbook for: "Report_"
   - Likely field: `Report_CostText` or similar
   - Result: FOUND (confirmed - extract from workbook)

5. **photo-1-caption**
   - Search workbook for: "photo" or "caption"
   - Action: Check if captions are stored or if they're user-entered

### Step 2: Categorize Based on Results

After spot checking, categorize each of the 273 fields:

**Category A: In Workbook (Dynamic Data)**
- Has a corresponding workbook named range
- Action: Add to fieldRegistry.ts + create mapping

**Category B: NOT in Workbook (Boilerplate)**
- No workbook named range found
- Action: Hardcode in template

**Category C: Semi-Dynamic**
- Partial workbook data + template structure
- Action: Combination approach

### Step 3: Implementation

Once categorized, proceed with:
- Category A → Batch add to registry
- Category B → Batch hardcode in templates
- Category C → Custom implementation per field

---

## Quick Reference: Known Boilerplate

From workbook exploration, these ARE boilerplate (hardcode in templates):

### Reconciliation Paragraphs (in workbook as named ranges):
- `Report_CostText` - Cost approach text
- `Report_IncomeText` - Income approach text
- `Report_SaleText` - Sales comparison text
- `Report_GuidelinesText` - CUSPAP compliance
- `Report_LandText` - Land valuation text

### Certification Items (NOT in workbook):
- certification-item-1 through 11 - Standard CUSPAP legal text

---

## Tools Available

1. **explore-workbook-boilerplate.py** - Search workbook for specific text
2. **analyze-273-fields.py** - Cross-reference fields (needs name mapping fix)
3. **MASTER-FIELD-DIRECTORY.md** - All 7,973 workbook field names
4. **Valcre Workbook** - Direct source (open in Excel)

---

## Next Session Action

**Option 1: Manual Verification (Recommended)**
- You open workbook + spot check 10-20 sample fields
- Create mapping list: template-field-id → workbook-named-range
- I use that mapping to categorize all 273

**Option 2: Automated Fuzzy Matching**
- I create script using keyword matching (risky - could be wrong)
- You verify results afterward

**Option 3: Use Second Reference Property**
- Compare VAL251012 vs VAL251026
- Text that's IDENTICAL = boilerplate
- Text that's DIFFERENT = dynamic field
- Most reliable but more work

---

## Current Blockers

1. **No name mapping** between template IDs and workbook field names
2. **Need manual verification** to confirm which approach is correct
3. **Permission prompts** slowing down exploration (VSCode setting missing)

---

**Waiting for your decision on next steps.**
