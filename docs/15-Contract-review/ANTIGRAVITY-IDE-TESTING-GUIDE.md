# AntiGravity IDE + Gemini Browser Testing Guide

**Last Updated:** December 7, 2025  
**Purpose:** Automated browser validation for Report Builder - verify page counts, field mapping, UI issues  
**Use Case:** Replace manual testing with automated browser-driven validation

---

## 🎯 Why Use AntiGravity IDE for This Project

**Problem:** Manual testing is tedious and error-prone
- Manually counting pages in generated reports (is it 25 or 72?)
- Checking if 292 fields are mapped correctly
- Verifying preview sync issues
- Debugging UI glitches

**Solution:** AntiGravity IDE + Gemini browser automation
- Automated page counting in generated HTML
- Field presence verification
- Screenshot-based visual regression
- Console error detection
- Automated bug reports

---

## 📋 What AntiGravity IDE Can Do For Us

### 1. Report Builder Validation
✅ **Load `/test-input` and verify:**
- All 292 fields render correctly
- Stats bar shows accurate counts
- "Load Test Data" button populates fields
- Field status badges (Mapped/Empty/Missing) are correct

✅ **Load `/mock-builder` and verify:**
- Edit panel displays current section
- Preview panel shows HTML output
- Page count matches expected (72 pages)
- Zoom controls work
- Export buttons present

### 2. Three-Way Sync Testing
✅ **Automated workflow test:**
1. Load test data via button
2. Edit a field value
3. Screenshot preview panel before change
4. Screenshot preview panel after change
5. Compare screenshots (did it update?)
6. Report sync success/failure

### 3. Page Count Verification
✅ **Automated page counting:**
1. Navigate to `/mock-builder`
2. Load test data
3. Wait for HTML preview to render
4. Count pages in generated HTML
5. Assert: actual count === 72 pages
6. If mismatch, screenshot and report which sections are missing

### 4. Field Mapping Audit
✅ **Automated field verification:**
1. Load `/test-input`
2. Extract stats bar numbers
3. Verify 292 total fields
4. Check mapped percentage
5. Report any missing/empty fields by section

---

## 🚀 Quick Setup Guide

### Step 1: Install AntiGravity IDE

1. **Download from Google:**
   - Visit Google's developer site
   - Download AntiGravity IDE installer
   - Sign in with Google account

2. **Integrate with Google Cloud (optional):**
   - If you want to deploy or store test results in cloud
   - Connect your Google Cloud project

3. **Verify Installation:**
   ```bash
   # Open terminal in AntiGravity IDE
   gemini --version
   ```

### Step 2: Create Test Project Workspace

1. **Create new project in IDE:**
   - Name: `APR-Dashboard-Testing`
   - Location: `/Users/bencrowe/Development/APR-Dashboard-v3/testing/`

2. **Add test scripts folder:**
   ```
   /testing/
   ├── browser-tests/
   │   ├── test-input-validation.js
   │   ├── mock-builder-page-count.js
   │   ├── preview-sync-test.js
   │   └── field-mapping-audit.js
   └── screenshots/
       └── [automated screenshots go here]
   ```

3. **Open project in AntiGravity IDE:**
   - Use IDE's project manager
   - Add task/milestone tracking

---

## 📝 Prompting Patterns for Gemini Browser Automation

### Pattern 1: Structured Test Prompt

```
Goal: [What you want to test]
Context: [URL, credentials, preconditions]
Steps:
  1. [Action 1]
  2. [Action 2]
  3. [Action 3]
Expected:
  - [Assertion 1]
  - [Assertion 2]
If fail:
  - Screenshot
  - Log error
  - Report details
```

### Pattern 2: Page Count Verification

**Example Prompt:**
```
Goal: Verify Report Builder generates 72 pages

Context:
- URL: http://localhost:8080/mock-builder
- Precondition: Test data loaded

Steps:
1. Navigate to http://localhost:8080/mock-builder
2. Wait for page load (check for "Live Preview" text)
3. Click "Load Test Data" button in Edit Panel
4. Wait 5 seconds for HTML generation
5. Switch to Preview Panel iframe
6. Count elements with class "page" in HTML
7. Extract page count

Expected:
- Page count === 72
- If not 72, report actual count
- Screenshot preview panel
- List which sections are missing (compare to expected 21 sections)

If fail:
- Screenshot full page
- Log actual page count
- Report missing sections
- Save HTML to file for manual review
```

### Pattern 3: Field Sync Testing

**Example Prompt:**
```
Goal: Verify Edit Panel → Preview Panel sync works

Context:
- URL: http://localhost:8080/mock-builder
- Precondition: Test data loaded
- Field to test: property-name

Steps:
1. Navigate to http://localhost:8080/mock-builder
2. Click "Load Test Data" button
3. Wait for data load
4. Find field "Property Name" in Edit Panel
5. Screenshot preview panel (before)
6. Change "Property Name" value to "TEST PROPERTY SYNC"
7. Wait 2 seconds
8. Screenshot preview panel (after)
9. Compare screenshots (look for "TEST PROPERTY SYNC" in preview)

Expected:
- Preview shows new value "TEST PROPERTY SYNC"
- Screenshots differ (visual change detected)

If fail:
- Save both screenshots
- Log: "Preview sync FAILED - value did not update"
- Report as BUG: Preview Panel not syncing
```

### Pattern 4: Stats Bar Validation

**Example Prompt:**
```
Goal: Verify Test Input Dashboard stats are accurate

Context:
- URL: http://localhost:8080/test-input
- Expected: 292 total fields

Steps:
1. Navigate to http://localhost:8080/test-input
2. Wait for page load
3. Extract text from stats bar (contains "Total: X | Mapped: Y...")
4. Parse numbers:
   - Total fields
   - Mapped fields
   - Empty fields
   - Missing fields
   - Coverage %
5. Calculate: Mapped + Empty + Missing should === Total

Expected:
- Total === 292
- All numbers add up correctly
- Coverage % = (Mapped / Total) * 100

If fail:
- Screenshot stats bar
- Log extracted numbers
- Report math error or incorrect total
```

---

## 🛠️ Test Scripts to Create

### Script 1: `test-input-validation.js`

**Purpose:** Validate Test Input Dashboard loads correctly

**What it tests:**
- Page loads without errors
- 292 fields present
- Stats bar shows correct totals
- "Load Test Data" button works
- Field status badges render

**Run via CLI:**
```bash
gemini run browser-tests/test-input-validation.js
```

---

### Script 2: `mock-builder-page-count.js`

**Purpose:** Count pages in generated report

**What it tests:**
- Report Builder loads
- Test data populates
- HTML preview generates
- Page count === 72
- All 21 sections render

**Run via CLI:**
```bash
gemini run browser-tests/mock-builder-page-count.js
```

**Expected output:**
```
✅ Page count: 72 pages (PASS)
✅ All 21 sections present (PASS)
✅ Screenshot saved: screenshots/page-count-success.png
```

**Failure output:**
```
❌ Page count: 25 pages (FAIL - Expected 72)
❌ Missing sections:
   - Location Analysis
   - Market Context
   - Income Calculator
   - Maps
   - [etc.]
📸 Screenshot: screenshots/page-count-fail.png
🐛 Bug report generated: bug-reports/page-count-mismatch.md
```

---

### Script 3: `preview-sync-test.js`

**Purpose:** Verify Edit Panel → Preview sync

**What it tests:**
- Field edit triggers preview update
- Visual change detected via screenshots
- No console errors during sync

**Run via CLI:**
```bash
gemini run browser-tests/preview-sync-test.js
```

---

### Script 4: `field-mapping-audit.js`

**Purpose:** Comprehensive field audit

**What it tests:**
- All 292 fields exist in store
- Field IDs match between registry and store
- No duplicate field IDs
- All required fields marked correctly

**Run via CLI:**
```bash
gemini run browser-tests/field-mapping-audit.js
```

---

## 🎬 Example Workflow: Debug Page Count Issue

**Scenario:** Report shows 25 pages instead of 72

### Manual Process (Old Way - Painful)
1. Open browser manually
2. Load `/mock-builder`
3. Click "Load Test Data"
4. Wait for render
5. Manually count pages by scrolling
6. Try to figure out which sections are missing
7. Check console for errors
8. Pull your hair out

### Automated Process (AntiGravity IDE - Easy)

1. **Write prompt in IDE:**
```
Goal: Debug why report only shows 25 pages instead of 72

Context:
- URL: http://localhost:8080/mock-builder
- Expected: 72 pages (21 sections)
- Actual: 25 pages (unknown sections)

Steps:
1. Navigate to URL
2. Load test data
3. Wait for HTML generation
4. Count pages
5. Extract section IDs from HTML
6. Compare to expected 21 sections
7. Report which sections are missing
8. Check console for JavaScript errors
9. Screenshot preview panel

Analysis:
- If sections missing: report which renderer functions aren't called
- If console errors: report exact error message
- Provide hypothesis for root cause

Output:
- Detailed bug report with:
  - Actual page count
  - Missing sections list
  - Console errors (if any)
  - Screenshots
  - Suggested fix
```

2. **Run via Gemini CLI:**
```bash
gemini run debug-page-count
```

3. **Get automated report:**
```
🐛 BUG REPORT: Page Count Mismatch
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACTUAL: 25 pages
EXPECTED: 72 pages
MISSING: 47 pages

SECTIONS FOUND (9):
✅ Cover
✅ Letter of Transmittal
✅ Executive Summary
✅ Site Details
✅ Property Taxes
✅ Zoning
✅ Highest & Best Use
✅ Reconciliation
✅ Certification

SECTIONS MISSING (12):
❌ Photographs (renderPhotosSection not called)
❌ Maps (renderMapsSection not called)
❌ Location Analysis (renderLocationSection not called)
❌ Market Context (renderMarketSection not called)
❌ Improvements (renderImpvSection not called)
❌ Income Approach (renderIncomeSection not called)
❌ Sales Comparison (renderSalesSection not called)
❌ Income Calculator (renderCalcSection not called)
❌ Table of Contents (renderTableOfContents not called)
❌ Appendix A (renderLimitingConditionsAppendix not called)
❌ Appendix B (renderDefinitionsAppendix not called)
❌ Appendix C (renderQualificationsAppendix not called)

CONSOLE ERRORS:
None

ROOT CAUSE HYPOTHESIS:
Renderer functions exist but are not being called in the 
section.id ternary chain at reportHtmlTemplate.ts:4987-5001

SUGGESTED FIX:
Check ternary chain in reportHtmlTemplate.ts
Verify section IDs match expected values
Ensure all renderers are included in chain

SCREENSHOT: screenshots/25-pages-preview.png
HTML SAVED: debug-output/25-pages.html
```

4. **Fix the issue based on report**
5. **Re-run test to verify fix**

---

## 🎯 Specific Tests for Report Builder Issues

### Issue 1: Auto-Load Test Data Bug

**Test Prompt:**
```
Goal: Verify test data does NOT auto-load on page open

Context:
- URL: http://localhost:8080/test-input
- Expected: Fields should be empty on first load

Steps:
1. Clear browser cache
2. Navigate to http://localhost:8080/test-input
3. Wait 3 seconds
4. Check if field "property-name" has a value
5. Check stats bar (should show 0 mapped initially)

Expected:
- Fields are empty
- Stats show 0 mapped
- User must click "Load Test Data" button

If fail:
- Log: "BUG: Test data auto-loads on page open"
- Screenshot page
- Report as UX issue
```

---

### Issue 2: Preview Sync Bug

**Test Prompt:**
```
Goal: Verify preview updates when editing fields

Context:
- URL: http://localhost:8080/mock-builder
- Known bug: Preview doesn't update on field change

Steps:
1. Navigate to /mock-builder
2. Load test data
3. Select "Cover" section
4. Screenshot preview panel (baseline)
5. Change "Property Name" to "SYNC TEST 123"
6. Wait 2 seconds
7. Screenshot preview panel (after edit)
8. Compare screenshots
9. Search preview HTML for "SYNC TEST 123"

Expected:
- Preview HTML contains "SYNC TEST 123"
- Screenshots differ
- No console errors

If fail:
- Log: "CRITICAL BUG: Preview sync broken"
- Save both screenshots
- Save preview HTML to file
- Check console for errors
- Report detailed findings
```

---

## 📊 Automated Bug Reporting

AntiGravity IDE can generate structured bug reports:

**Example Auto-Generated Bug Report:**
```markdown
# BUG REPORT: Preview Sync Failure

**Date:** 2025-12-07
**Test:** preview-sync-test.js
**Status:** ❌ FAILED

## Summary
Edit Panel field changes do not update HTML Preview panel.

## Steps to Reproduce
1. Navigate to http://localhost:8080/mock-builder
2. Load test data
3. Edit field "Property Name" to "TEST VALUE"
4. Observe preview panel

## Expected Behavior
Preview panel HTML should update to show "TEST VALUE"

## Actual Behavior
Preview panel HTML remains unchanged

## Evidence
- Screenshot Before: screenshots/preview-before-edit.png
- Screenshot After: screenshots/preview-after-edit.png
- HTML Diff: No changes detected
- Console Errors: None

## Root Cause Analysis
updateFieldValue() calls generatePreview() at line 3069
previewHtml state updates correctly
PreviewPanel component may not be re-rendering

## Suggested Fix
Check PreviewRenderer component re-render logic
Add key prop or useEffect dependency
```

---

## 🔧 Gemini CLI Commands

### Run Single Test
```bash
cd /Users/bencrowe/Development/APR-Dashboard-v3/testing/
gemini run browser-tests/mock-builder-page-count.js
```

### Run All Tests
```bash
gemini run browser-tests/*.js
```

### Run with Screenshot Output
```bash
gemini run --screenshots browser-tests/preview-sync-test.js
```

### Generate Test Report
```bash
gemini run --report browser-tests/field-mapping-audit.js
```

---

## 📁 Project Structure

```
/Users/bencrowe/Development/APR-Dashboard-v3/
├── testing/
│   ├── browser-tests/
│   │   ├── test-input-validation.js
│   │   ├── mock-builder-page-count.js
│   │   ├── preview-sync-test.js
│   │   └── field-mapping-audit.js
│   ├── screenshots/
│   │   ├── baseline/
│   │   └── results/
│   ├── bug-reports/
│   │   └── [auto-generated reports]
│   └── test-data/
│       └── expected-values.json
```

---

## 🎯 Integration with CI/CD (Future)

**Automated testing on every PR:**
```yaml
# .github/workflows/browser-tests.yml
name: Browser Validation Tests

on: [pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Start dev server
        run: npm run dev &
      - name: Run Gemini browser tests
        run: gemini run testing/browser-tests/*.js
      - name: Upload screenshots
        uses: actions/upload-artifact@v2
        with:
          name: test-screenshots
          path: testing/screenshots/
```

---

## 📚 Best Practices

### 1. Keep Prompts Structured
✅ **Good Prompt:**
```
Goal: [Clear objective]
Context: [URL, preconditions]
Steps: [Numbered steps]
Expected: [Assertions]
If fail: [Error handling]
```

❌ **Bad Prompt:**
```
"Check if the report builder works"
```

### 2. Use Screenshots Liberally
- Before/after comparisons
- Visual regression testing
- Evidence for bug reports

### 3. Automate Repetitive Checks
- Page counting
- Field validation
- Sync testing
- Console error detection

### 4. Generate Structured Reports
- Automated bug reports
- Test summaries
- Failure diagnostics

---

## 🚨 Common Pitfalls

### Pitfall 1: Timing Issues
**Problem:** Test runs before page fully loads

**Solution:** Add explicit waits
```javascript
// Wait for specific element
await page.waitForSelector('.live-preview');
// Wait for network idle
await page.waitForLoadState('networkidle');
```

### Pitfall 2: Stale Element References
**Problem:** Element changes between extraction and interaction

**Solution:** Re-query elements
```javascript
// Bad
const button = await page.$('.load-button');
await page.waitForTimeout(5000);
await button.click(); // May be stale

// Good
await page.waitForTimeout(5000);
const button = await page.$('.load-button');
await button.click();
```

### Pitfall 3: Inconsistent State
**Problem:** Tests fail due to cached data

**Solution:** Clear state between tests
```javascript
// Clear localStorage
await page.evaluate(() => localStorage.clear());
// Clear browser cache
await context.clearCookies();
```

---

## 🎓 Learning Resources

**Gemini Documentation:**
- Gemini CLI Reference
- Browser Automation Guide
- Computer Use API

**AntiGravity IDE:**
- Project Management Tools
- Task Coordination Features
- Data Transformation Capabilities

---

## ✅ Next Steps

1. **Install AntiGravity IDE** (if not done)
2. **Create test project workspace**
3. **Write first test:** `mock-builder-page-count.js`
4. **Run test and verify page count**
5. **Expand to other tests** (sync, field mapping)
6. **Integrate with development workflow**

---

**Remember:** Let the browser automation do the tedious work. You focus on fixing bugs, not finding them manually!

**End of Guide**
