# Report Builder Verification Workflow

**Purpose:** Validate the Report Builder architecture before adding new fields to ensure data integrity and system correctness.

**Created:** December 13, 2025
**Status:** Ready for execution

---

## Overview

Before adding 40+ missing fields to the field registry, we need to verify that:
1. **Test data** values match the reference PDF exactly
2. **Field IDs** in templates match registry definitions
3. **Data flow** works correctly from registry → store → templates
4. **Boilerplate text** placement is correct and matches source

This workflow ensures we understand the system correctly and prevents building on incorrect assumptions.

---

## Verification Steps

### Step 1: Test Data Validation

**Goal:** Confirm that `northBattlefordTestData-REAL.ts` contains accurate values from the reference PDF.

**Process:**

1. **Open Reference PDF**
   - Location: `/docs/15-Contract-review/North Battleford Apt -Report-content extracted copy/`
   - File: VAL251012 - North Battleford Apartments appraisal report

2. **Select Sample Fields to Validate** (20-30 fields across different sections)
   - Property details (address, legal description)
   - Site information (size, dimensions)
   - Building details (units, sqft)
   - Financial data (income, expenses)
   - Comparable sales data

3. **Manual Verification**
   - Open `src/features/report-builder/data/northBattlefordTestData-REAL.ts`
   - For each field, compare test data value to PDF value
   - Create validation report with results

**Example:**
```typescript
// In northBattlefordTestData-REAL.ts
'property-name': 'North Battleford Apartments',

// Verify in PDF Page 1: ✅ MATCHES
// PDF shows: "North Battleford Apartments"
```

**Expected Output:**
- Validation report showing 95%+ match rate
- List of any discrepancies found
- Decision: Fix test data or document intentional differences

**Tools:**
- Reference PDF viewer
- Text editor with test data file
- Spreadsheet for tracking validation results

---

### Step 2: Field ID Audit

**Goal:** Ensure field IDs used in templates exist in the field registry.

**Process:**

1. **Extract Field IDs from Templates**
   - Search `reportPageTemplates.ts` for all `getFieldValue(sections, 'FIELD-ID')` calls
   - Create list of unique field IDs used in templates

2. **Compare Against Registry**
   - Open `src/features/report-builder/schema/fieldRegistry.ts`
   - Check if each template field ID has a matching registry entry
   - Identify missing fields

3. **Create Field Audit Script** (Optional automation)

```javascript
// audit-field-ids.js
const fs = require('fs');

// Extract field IDs from templates
const templateFile = fs.readFileSync('src/features/report-builder/templates/reportPageTemplates.ts', 'utf8');
const fieldIdMatches = templateFile.match(/getFieldValue\(sections,\s*['"]([^'"]+)['"]\)/g);
const templateFieldIds = new Set(
  fieldIdMatches.map(match => match.match(/['"]([^'"]+)['"]/)[1])
);

// Extract field IDs from registry
const registryFile = fs.readFileSync('src/features/report-builder/schema/fieldRegistry.ts', 'utf8');
const registryMatches = registryFile.match(/storeId:\s*['"]([^'"]+)['"]/g);
const registryFieldIds = new Set(
  registryMatches.map(match => match.match(/['"]([^'"]+)['"]/)[1])
);

// Find missing fields
const missingFields = [...templateFieldIds].filter(id => !registryFieldIds.has(id));

console.log('\n=== FIELD AUDIT RESULTS ===\n');
console.log(`Template fields: ${templateFieldIds.size}`);
console.log(`Registry fields: ${registryFieldIds.size}`);
console.log(`Missing from registry: ${missingFields.length}\n`);

if (missingFields.length > 0) {
  console.log('Missing Fields:');
  missingFields.sort().forEach(field => console.log(`  - ${field}`));
}
```

**Expected Output:**
- List of all field IDs used in templates (estimated ~310)
- List of field IDs in registry (currently 270)
- **Missing fields list** (40+ expected) - this becomes our work queue

**Validation:**
- Confirm missing fields list matches CLAUDE.md documentation
- No unexpected missing fields discovered

---

### Step 3: Data Flow Validation

**Goal:** Verify that field registry → store → templates → render pipeline works correctly.

**Process:**

1. **Test Field Retrieval**
   - Pick 5-10 fields that exist in both registry AND test data
   - Trace each field through the system:
     - Registry definition (fieldRegistry.ts)
     - Test data value (northBattlefordTestData-REAL.ts)
     - Store binding (reportBuilderStore.ts)
     - Template usage (reportPageTemplates.ts)
     - Rendered output (browser)

2. **Create Test Checklist**

| Field ID | Registry ✓ | Test Data ✓ | Template ✓ | Renders ✓ | Notes |
|----------|-----------|------------|-----------|----------|-------|
| property-name | ✅ | ✅ | ✅ | ✅ | Working correctly |
| street-address | ✅ | ✅ | ✅ | ❌ | Not rendering - investigate |
| ... | | | | | |

3. **Browser Render Test**
   - Start dev server: `npm run dev`
   - Navigate to report builder
   - Load North Battleford test data
   - Check that fields appear on rendered pages
   - Compare to reference PDF

**Expected Output:**
- Confirmation that existing fields flow correctly
- Identification of any broken field mappings
- Baseline understanding of how system works

---

### Step 4: Boilerplate Text Validation

**Goal:** Verify that boilerplate text placement matches source and classification is correct.

**Process:**

1. **Review Boilerplate Documentation**
   - Read `BOILERPLATE-EXTRACTION.md`
   - Read `BOILERPLATE-VALIDATION.md`
   - Understand the 8 confirmed + 235 conditional classification

2. **Spot Check Boilerplate Placement**
   - Select 5 examples from the "8 confirmed static" list
   - Find in reference PDF
   - Find in template files
   - Verify exact text match and placement

**Example:**
```typescript
// Template should have:
"Fee Simple Estate: Absolute ownership unencumbered by any other interest..."

// Reference PDF Page X should show same text
```

3. **Validate Conditional Logic**
   - Pick 2-3 conditional boilerplate blocks
   - Verify they are NOT hardcoded in templates
   - Confirm they appear conditionally based on property type/config

**Expected Output:**
- Confirmation that static boilerplate is correctly placed
- Verification that conditional boilerplate is not hardcoded
- List of any boilerplate discrepancies

---

### Step 5: Visual Validation Process

**Goal:** Design process for comparing rendered pages to reference PDF.

**Process:**

1. **Screenshot Comparison Strategy**
   - Render page in browser
   - Take screenshot
   - Compare side-by-side with reference PDF page
   - Note visual differences (expected vs concerning)

2. **Expected Differences (Acceptable)**
   - Font rendering (browser vs PDF)
   - Line height/spacing minor variations
   - Color slight variations (#003b7e vs #003b7f)
   - Image placeholders vs actual images

3. **Concerning Differences (Investigate)**
   - Missing content
   - Wrong data values
   - Layout significantly broken
   - Tables misaligned
   - Page overflow

4. **Visual Validation Checklist Template**

```markdown
## Page X Visual Validation

**Reference:** PDF Page X
**Rendered:** Browser screenshot

### Layout ✓
- [ ] Header present and positioned correctly
- [ ] Content sections in correct order
- [ ] Tables aligned properly
- [ ] Footer present

### Content ✓
- [ ] All text present
- [ ] Data values match PDF
- [ ] Images/charts present (or placeholders)
- [ ] No overflow/clipping

### Styling ✓
- [ ] Fonts approximately match
- [ ] Colors approximately match
- [ ] Spacing reasonable

### Issues Found:
- (List any problems)

### Status: ✅ PASS / ❌ FAIL / ⚠️ NEEDS REVIEW
```

**Expected Output:**
- Defined process for visual comparison
- Template for validation reports
- Criteria for pass/fail decisions

---

## Verification Execution Plan

### Phase 1: Quick Validation (30-45 minutes)
1. Run Field ID Audit script → Get missing fields list
2. Spot check 10 test data values against PDF → Confirm accuracy
3. Render 3 sample pages in browser → Confirm basic rendering works

**Decision Point:** If Phase 1 fails, stop and investigate issues before proceeding.

### Phase 2: Comprehensive Validation (2-3 hours)
1. Complete test data validation (20-30 fields)
2. Trace 10 fields through complete data flow
3. Validate 5 boilerplate examples
4. Visual validation of 5 representative pages

**Decision Point:** If Phase 2 passes, proceed to field addition. If issues found, document and fix first.

### Phase 3: Continuous Validation (Ongoing)
- Visual validation after each field addition batch
- Regression testing when modifying existing fields
- Periodic full report render validation

---

## Success Criteria

Before proceeding to add missing fields, we must confirm:

- ✅ **Test data accuracy**: 95%+ match rate with reference PDF
- ✅ **Field audit complete**: Missing fields list documented and matches expectations
- ✅ **Data flow verified**: At least 10 fields traced successfully end-to-end
- ✅ **Boilerplate correct**: Static text matches, conditional text not hardcoded
- ✅ **Visual baseline**: 5 sample pages render acceptably compared to PDF

**If any criterion fails:** Investigate and fix before adding new fields.

---

## Tools and Scripts

### Field ID Audit Script
- **File:** `audit-field-ids.js` (create in project root)
- **Run:** `node audit-field-ids.js`
- **Output:** Missing fields list

### Visual Comparison Tools
- Browser DevTools (screenshot capability)
- PDF viewer (for reference)
- Image diff tool (optional): `pixelmatch` npm package

### Test Data Validation
- Manual: Spreadsheet tracking
- Automated (future): Script to extract PDF text and compare

---

## Documentation

After completing verification, create:

1. **VERIFICATION-RESULTS.md** - Complete report of findings
   - Test data validation results
   - Field audit results
   - Data flow validation results
   - Boilerplate validation results
   - Visual validation results
   - Go/no-go decision for field addition

2. **Update CLAUDE.md** - Add verification findings
   - Confirm or update missing fields list
   - Note any discovered issues
   - Update next steps based on results

---

## Next Steps After Verification

**If verification passes:**
1. Proceed with Session 1: Add 9 Site Fields (per WRAP-UP-WORKFLOW-VIBE-CODING.md)
2. Use vibe coding pattern: Explore → Plan → Build → Reflect
3. Continue through 5-session field addition plan

**If verification fails:**
1. Document all issues found
2. Create fix plan for each issue
3. Implement fixes
4. Re-run verification
5. Only proceed to field addition when verification passes

---

## Notes

- **Priority:** Verification before implementation prevents rework
- **Philosophy:** "Trust but verify" - assume architecture is correct, but confirm
- **Time Investment:** 3-4 hours of verification saves 20+ hours of debugging bad assumptions
- **Deliverable:** VERIFICATION-RESULTS.md becomes part of project documentation

---

**Ready to execute when you are.**
