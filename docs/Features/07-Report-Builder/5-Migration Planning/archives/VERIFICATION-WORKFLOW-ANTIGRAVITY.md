# Report Builder Verification Workflow (Antigravity IDE Edition)

**Purpose:** Automated verification using Antigravity IDE + Gemini browser testing

**Created:** December 13, 2025
**Companion to:** VERIFICATION-WORKFLOW.md
**Prerequisites:** Antigravity IDE installed, Gemini CLI available

---

## Overview

This workflow uses **Antigravity IDE + Gemini browser testing** to automate the verification steps outlined in VERIFICATION-WORKFLOW.md. Instead of manual checking, we'll use browser automation to validate the Report Builder.

**Benefits:**
- ✅ Faster validation (minutes vs hours)
- ✅ Repeatable and consistent
- ✅ Automated bug reports with screenshots
- ✅ Can run in CI/CD

**Reference:** See [ANTIGRAVITY-IDE-TESTING-GUIDE.md](../../ANTIGRAVITY-IDE-TESTING-GUIDE.md) for complete setup guide.

---

## Automated Verification Steps

### Step 1: Automated Test Data Validation

**Replace manual spot-checking with browser automation**

**Test Script:** `test-data-validation.js`

**Gemini Prompt:**
```
Goal: Validate North Battleford test data matches reference PDF

Context:
- URL: http://localhost:3000/report-builder
- Test data: northBattlefordTestData-REAL.ts
- Reference: VAL251012 PDF

Steps:
1. Navigate to report builder
2. Load North Battleford test data
3. Render all 77 pages
4. Extract values for 20 sample fields:
   - property-name
   - street-address
   - legal-description
   - site-size-sf
   - site-size-acres
   - building-units
   - total-sqft
   - year-built
   - [etc - list 20 key fields]
5. For each field:
   - Find in rendered HTML
   - Extract displayed value
   - Compare to expected value from test data
6. Generate validation report

Expected:
- 95%+ fields match test data
- Values render correctly in HTML
- No obvious data corruption

If fail:
- Screenshot pages with mismatched values
- Generate detailed mismatch report with:
  - Field ID
  - Expected value (from test data)
  - Actual value (from rendered HTML)
  - Page number where field appears
- Save full HTML for manual review
```

**Run:**
```bash
cd /Users/bencrowe/Development/APR-Dashboard-v3
gemini run testing/browser-tests/test-data-validation.js
```

**Expected Output:**
```
✅ Test Data Validation Report

Validated: 20 fields
Matches: 19 (95%)
Mismatches: 1 (5%)

MISMATCHES:
- site-size-acres: Expected "0.56", Got "0.55" (Page 23)

PASS: Test data is 95% accurate ✅
```

---

### Step 2: Automated Field ID Audit

**Replace manual field ID extraction with automated audit**

**Test Script:** `field-id-audit.js`

**Gemini Prompt:**
```
Goal: Audit field IDs - verify templates match registry

Context:
- Template file: src/features/report-builder/templates/reportPageTemplates.ts
- Registry file: src/features/report-builder/schema/fieldRegistry.ts
- Store file: src/features/report-builder/data/northBattlefordTestData-REAL.ts

Steps:
1. Read reportPageTemplates.ts
2. Extract all field IDs from getFieldValue() calls
   - Regex: getFieldValue\(sections,\s*['"]([^'"]+)['"]\)
3. Read fieldRegistry.ts
4. Extract all storeId values from registry
   - Regex: storeId:\s*['"]([^'"]+)['"]
5. Compare lists:
   - Fields in templates but NOT in registry (missing fields)
   - Fields in registry but NOT in templates (unused fields)
6. Generate audit report

Expected:
- Clear list of missing fields (~40 expected)
- List matches CLAUDE.md documentation
- No unexpected gaps

If fail:
- Report unexpected missing fields
- Flag if missing fields > 50 (indicates larger issue)
```

**Run:**
```bash
gemini run testing/browser-tests/field-id-audit.js
```

**Expected Output:**
```
✅ Field ID Audit Report

Template field IDs: 310
Registry field IDs: 270
Missing from registry: 40

MISSING FIELDS:
Site Fields (9):
- site-corner
- site-grade
- site-quality
- usable-site-sqft
- usable-site-acres
- adjacent-north
- adjacent-south
- adjacent-east
- adjacent-west

Frontage/Traffic Fields (12):
- frontage-street-1
- frontage-street-2
- frontage-1-distance
- frontage-2-distance
[etc...]

PASS: Missing fields list matches expectations ✅
```

---

### Step 3: Automated Data Flow Validation

**Replace manual field tracing with browser automation**

**Test Script:** `data-flow-validation.js`

**Gemini Prompt:**
```
Goal: Verify registry → store → template → render pipeline

Context:
- Test 10 sample fields end-to-end
- URL: http://localhost:3000/report-builder

Steps:
1. Select 10 fields that exist in both registry AND test data:
   - property-name
   - street-address
   - site-size-sf
   - building-units
   - year-built
   - total-sqft
   - cap-rate
   - market-value
   - [etc - 10 total]

2. For each field:
   a. Verify field exists in fieldRegistry.ts (check storeId)
   b. Verify test value exists in northBattlefordTestData-REAL.ts
   c. Load report builder in browser
   d. Load North Battleford test data
   e. Find field in rendered HTML
   f. Extract rendered value
   g. Compare to test data value

3. Create end-to-end validation matrix

Expected:
- All 10 fields flow correctly through pipeline
- Registry → Store → Template → Render all working
- No broken field mappings

If fail:
- Identify which step in pipeline failed
- Screenshot rendered page
- Report broken field mapping details
```

**Run:**
```bash
gemini run testing/browser-tests/data-flow-validation.js
```

**Expected Output:**
```
✅ Data Flow Validation Report

Tested: 10 fields

| Field ID         | Registry ✓ | Test Data ✓ | Renders ✓ | Value Match ✓ |
|-----------------|-----------|------------|----------|--------------|
| property-name    | ✅        | ✅         | ✅       | ✅           |
| street-address   | ✅        | ✅         | ✅       | ✅           |
| site-size-sf     | ✅        | ✅         | ✅       | ✅           |
| building-units   | ✅        | ✅         | ✅       | ✅           |
| year-built       | ✅        | ✅         | ✅       | ✅           |
| total-sqft       | ✅        | ✅         | ✅       | ✅           |
| cap-rate         | ✅        | ✅         | ✅       | ✅           |
| market-value     | ✅        | ✅         | ✅       | ✅           |

PASS: All 10 fields flow correctly ✅
```

---

### Step 4: Automated Page Count Validation

**Verify all 77 pages render correctly**

**Test Script:** `page-count-validation.js`

**Gemini Prompt:**
```
Goal: Verify Report Builder generates all 77 pages

Context:
- URL: http://localhost:3000/report-builder
- Expected: 77 pages (renderPage1 through renderPage77)

Steps:
1. Navigate to report builder
2. Load North Battleford test data
3. Wait for complete HTML generation (5-10 seconds)
4. Count elements with class "page" in rendered HTML
5. Extract page count
6. If count != 77:
   - Identify which pages are missing
   - Check PAGE_RENDERERS mapping
   - Report which renderPageXX functions failed

Expected:
- Page count === 77
- All page templates rendering
- No missing pages

If fail:
- Screenshot preview panel
- Log actual page count
- List missing page numbers
- Check for JavaScript errors in console
- Save rendered HTML to file
```

**Run:**
```bash
gemini run testing/browser-tests/page-count-validation.js
```

**Expected Output:**
```
✅ Page Count Validation Report

Expected pages: 77
Actual pages: 77

PASS: All pages rendering correctly ✅

Page breakdown:
- Pages 1-15: Front Matter & Executive Summary ✅
- Pages 16-30: Site & Location ✅
- Pages 31-45: Improvements & Market ✅
- Pages 46-60: Income Approach ✅
- Pages 61-77: Sales Comparison & Appendices ✅
```

---

### Step 5: Automated Visual Validation

**Use Gemini computer use to compare rendered pages to reference PDF**

**Test Script:** `visual-validation.js`

**Gemini Prompt:**
```
Goal: Visual comparison of rendered pages to reference PDF

Context:
- Rendered URL: http://localhost:3000/report-builder
- Reference PDF: VAL251012 North Battleford report
- Sample pages to validate: 1, 10, 23, 50, 70

Steps:
1. For each sample page:
   a. Open reference PDF to page N
   b. Take screenshot of PDF page
   c. Navigate to report builder
   d. Load test data
   e. Scroll to page N in preview
   f. Take screenshot of rendered page
   g. Compare screenshots side-by-side

2. Analyze differences:
   - ACCEPTABLE: Font rendering, minor spacing, color shades
   - CONCERNING: Missing content, wrong data, broken layout

3. Generate visual comparison report

Expected:
- Layout matches reference PDF
- All content present
- Data values correct
- Styling approximately matches

If fail:
- Save side-by-side comparison screenshots
- Highlight areas of significant difference
- Categorize issues (missing content, layout broken, wrong data)
```

**Run:**
```bash
gemini run testing/browser-tests/visual-validation.js
```

**Expected Output:**
```
✅ Visual Validation Report

Validated: 5 sample pages (1, 10, 23, 50, 70)

Page 1 (Cover): ✅ PASS
- Layout matches
- Property name displays correctly
- Minor font differences (acceptable)

Page 10 (Executive Summary): ✅ PASS
- Table structure correct
- All data rows present
- Styling approximately matches

Page 23 (Site Details): ⚠️ NEEDS REVIEW
- Layout matches
- Data values correct
- Table border thickness differs slightly (acceptable)

Page 50 (Income Approach): ✅ PASS
- Calculations display correctly
- Charts present (placeholder)
- Data matches

Page 70 (Final Value Estimate): ✅ PASS
- All sections present
- Value displays correctly
- Format matches reference

PASS: 4/5 pages perfect, 1 minor styling difference ✅
```

---

## Quick Start: Run All Verification Tests

**Single command to run complete verification suite:**

```bash
cd /Users/bencrowe/Development/APR-Dashboard-v3/testing

# Run all verification tests
gemini run browser-tests/verification-suite.js
```

**This runs:**
1. Test Data Validation
2. Field ID Audit
3. Data Flow Validation
4. Page Count Validation
5. Visual Validation (5 sample pages)

**Expected runtime:** 3-5 minutes

**Expected output:** Comprehensive validation report with pass/fail for each step.

---

## Success Criteria (Automated)

**All tests must pass before proceeding to field addition:**

- ✅ Test Data Validation: 95%+ match rate
- ✅ Field ID Audit: Missing fields list matches expectations (~40 fields)
- ✅ Data Flow: 10/10 sample fields flow correctly
- ✅ Page Count: 77/77 pages render
- ✅ Visual Validation: 4/5 sample pages pass (minor differences acceptable)

**If any test fails:** Review automated bug report, fix issues, re-run tests.

---

## Verification Results Documentation

**After running tests, Gemini will generate:**

**File:** `testing/reports/VERIFICATION-RESULTS-ANTIGRAVITY.md`

**Contents:**
```markdown
# Verification Results - Automated (Antigravity IDE)

**Date:** 2025-12-13
**Tool:** Gemini Browser Testing
**Status:** ✅ PASS

## Summary
All verification tests passed. Report Builder architecture validated.
Ready to proceed with field addition.

## Test Results

### 1. Test Data Validation: ✅ PASS
- Validated 20 fields
- Match rate: 95% (19/20 matches)
- Minor discrepancy in site-size-acres (0.56 vs 0.55 - acceptable)

### 2. Field ID Audit: ✅ PASS
- Missing fields: 40 (matches expectations)
- List documented in audit report
- No unexpected gaps

### 3. Data Flow Validation: ✅ PASS
- Tested 10 fields end-to-end
- All fields flow correctly through pipeline
- Registry → Store → Template → Render working

### 4. Page Count Validation: ✅ PASS
- Expected: 77 pages
- Actual: 77 pages
- All page templates rendering

### 5. Visual Validation: ✅ PASS
- Tested 5 sample pages
- 4 perfect matches
- 1 minor styling difference (acceptable)

## Decision: ✅ PROCEED TO FIELD ADDITION

Architecture verified. System understood correctly.
Safe to add 40+ missing fields using vibe coding workflow.

## Next Steps
1. Begin Session 1: Add 9 Site Fields
2. Follow WRAP-UP-WORKFLOW-VIBE-CODING.md
3. Use Explore → Plan → Build → Reflect pattern
```

---

## Integration with Vibe Coding Workflow

**After verification passes, use Antigravity IDE to assist with field addition:**

### Session 1: Add 9 Site Fields
```bash
# Verification test after adding fields
gemini run testing/browser-tests/verify-site-fields.js
```

### Session 2-5: Continue with automated testing
```bash
# After each vibe coding session, run regression tests
gemini run testing/browser-tests/regression-suite.js
```

---

## Troubleshooting

### Issue: Tests fail due to dev server not running
**Fix:**
```bash
# Start dev server first
npm run dev

# Then run tests in separate terminal
gemini run testing/browser-tests/verification-suite.js
```

### Issue: Timing issues causing false failures
**Fix:** Increase wait times in test scripts
```javascript
// In test script
await page.waitForTimeout(5000); // Increase from 2000
```

### Issue: Screenshots not saving
**Fix:** Create screenshots directory
```bash
mkdir -p testing/screenshots/baseline
mkdir -p testing/screenshots/results
```

---

## Next Steps

1. ✅ Install Antigravity IDE (if not done)
2. ✅ Create `/testing/browser-tests/` directory
3. ✅ Run verification suite: `gemini run browser-tests/verification-suite.js`
4. ✅ Review VERIFICATION-RESULTS-ANTIGRAVITY.md
5. ✅ If all tests pass → Proceed to field addition
6. ✅ If tests fail → Fix issues and re-run

---

**Remember:** Automation gives you confidence. Let Gemini do the tedious validation work!
