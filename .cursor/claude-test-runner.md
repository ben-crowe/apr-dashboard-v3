# 🤖 Claude Code Test Runner Protocol

**Purpose:** Automated Playwright testing triggered by Cursor's git push hooks  
**Created:** September 2, 2025  
**For:** Claude Code (me) to execute when Ben says "run verification tests"

---

## 🚀 Quick Start Command

When Ben says **"run verification tests"** or **"check for test triggers"**, execute this workflow:

---

## 📋 Step-by-Step Execution Protocol

### Step 1: Check for Test Trigger

```bash
cat .cursor/test-trigger.json
```

**Expected format:**
```json
{
  "trigger": "cursor-push",
  "commit": "abc123...",
  "timestamp": "2025-09-02T16:30:00Z",
  "status": "testing-needed",
  "tests": [
    "multi-select-property-type",
    "appraisal-fee-save",
    "retainer-amount-save",
    "console-logs-clean"
  ]
}
```

**If file doesn't exist:** Report "No test trigger found - Cursor hasn't pushed yet"

---

### Step 2: Verify Dev Server Running

```bash
lsof -i :8080
```

**If not running:**
```bash
npm run dev &
sleep 5  # Wait for server startup
```

---

### Step 3: Navigate to Dashboard

```
mcp__playwright__browser_navigate
URL: http://localhost:8080/dashboard
```

---

### Step 4: Execute Test Suite

Run each test from the trigger file:

#### Test 1: Multi-Select PropertyType
```
1. mcp__playwright__browser_snapshot
2. Click on a job (e.g., "Tech Center Building")
3. Find PropertyType dropdown
4. Verify checkbox interface exists
5. Verify current selections display as tags
6. Take screenshot: .playwright-mcp/property-type-verification.png
```

**Pass Criteria:**
- ✅ Dropdown opens with checkboxes
- ✅ Multiple selections allowed
- ✅ Tags display correctly (e.g., "Building ×")

---

#### Test 2: Appraisal Fee Save
```
1. Find Appraisal Fee field in snapshot
2. Click field, change value (e.g., 3500 → 4000)
3. Click another field to trigger blur/auto-save
4. Wait 2 seconds (debounce + save time)
5. Check console messages for errors
6. Take screenshot if error occurs
```

**Pass Criteria:**
- ✅ Field editable
- ✅ Shows raw value while editing
- ✅ Shows formatted currency when not editing
- ✅ No PGRST204 error in console
- ✅ Success notification or no error notification

**Fail Criteria:**
- ❌ PGRST204 error: "Could not find the 'appraisalFee' column"
- ❌ Error notification displayed
- ❌ Console shows save error

---

#### Test 3: Retainer Amount Save
```
1. Find Retainer Amount field
2. Click field, change value (e.g., 350 → 500)
3. Click another field to trigger blur/auto-save
4. Wait 2 seconds
5. Check console for errors
```

**Pass Criteria:**
- ✅ Field editable
- ✅ Local state working (raw value during edit)
- ✅ No schema errors
- ✅ Saves successfully

---

#### Test 4: Console Logs Clean
```
1. mcp__playwright__browser_console_messages
2. Filter for spam patterns:
   - PropertyType debug logs
   - File upload spam
   - Verbose API responses
```

**Pass Criteria:**
- ✅ No PropertyType spam
- ✅ No file upload spam
- ✅ Only expected logs (ClickUp state, env vars)

---

### Step 5: Generate Results JSON

After all tests complete, write results:

```json
{
  "timestamp": "2025-09-02T16:35:00Z",
  "commit": "abc123...",
  "testRunId": "run-001",
  "devServerUrl": "http://localhost:8080",
  "summary": {
    "total": 4,
    "passed": 2,
    "failed": 2,
    "duration": "45s"
  },
  "tests": [
    {
      "name": "multi-select-property-type",
      "status": "passed",
      "duration": "8s",
      "details": "Checkbox dropdown working. Tags display correctly (Building ×, Hospitality ×, Land ×)",
      "screenshot": ".playwright-mcp/property-type-verification.png"
    },
    {
      "name": "appraisal-fee-save",
      "status": "failed",
      "duration": "12s",
      "error": "PGRST204",
      "errorMessage": "Could not find the 'appraisalFee' column of 'job_loe_details' in the schema cache",
      "details": "Field is editable, local state works, but save fails. Still sending camelCase 'appraisalFee' instead of snake_case 'appraisal_fee'",
      "screenshot": ".playwright-mcp/appraisal-fee-error.png",
      "recommendation": "Add explicit field mapping: appraisalFee: 'appraisal_fee' in useJobData.ts"
    },
    {
      "name": "retainer-amount-save",
      "status": "skipped",
      "reason": "Blocked by appraisalFee schema issue - same LOE save logic",
      "willTestAfter": "appraisal-fee-save passes"
    },
    {
      "name": "console-logs-clean",
      "status": "passed",
      "duration": "3s",
      "details": "PropertyType spam removed ✅. File upload spam removed ✅. Only expected logs remain."
    }
  ],
  "nextSteps": [
    "Fix PGRST204 error by adding explicit field mapping for appraisalFee",
    "After fix: Re-test appraisal-fee-save",
    "After fix: Test retainer-amount-save"
  ],
  "screenshots": [
    ".playwright-mcp/property-type-verification.png",
    ".playwright-mcp/appraisal-fee-error.png"
  ]
}
```

**Save to:** `.cursor/test-results.json`

---

### Step 6: Clean Up Trigger File

```bash
rm .cursor/test-trigger.json
```

---

### Step 7: Report to Ben

**Summary format:**
```
🧪 Test Results for Cursor's commit abc123...

✅ PASSED (2/4):
  • Multi-select PropertyType - Working perfectly
  • Console Logs Clean - Spam removed

❌ FAILED (1/4):
  • Appraisal Fee Save - PGRST204 error (field name mapping issue)

⏭️ SKIPPED (1/4):
  • Retainer Amount Save - Blocked by LOE schema issue

📊 Next Steps:
  1. Cursor needs to add explicit mapping: appraisalFee: 'appraisal_fee'
  2. Re-test after fix

📸 Screenshots saved to .playwright-mcp/
📄 Full results: .cursor/test-results.json
```

---

## 🔄 Workflow Loop

```
1. Cursor pushes → Hook creates test-trigger.json
2. Ben says "run verification tests"
3. I execute this protocol
4. I write test-results.json
5. Cursor reads results next session
6. Cursor fixes failures
7. Cursor pushes again → Loop continues
```

---

## 💡 Smart Decisions I Make

### When to Skip Tests
- If appraisalFee fails with schema error, skip retainerAmount (same logic)
- If dev server won't start, abort with error report
- If dashboard won't load, check for deployment issues

### When to Take Screenshots
- ✅ Always on failures
- ✅ On first success of a previously failing test
- ⚠️ Optional on passing tests (save tokens)

### Error Categorization
- **PGRST204**: Database schema mismatch (field name mapping)
- **PGRST301**: Permission error (RLS policy)
- **Network error**: Dev server or API connection issue
- **UI error**: Element not found (deployment/build issue)

---

## 🚨 Emergency Protocols

### If Everything Fails
1. Check dev server actually running
2. Check correct URL (http://localhost:8080/dashboard)
3. Try manual navigation first
4. Report to Ben: "System check needed"

### If Playwright MCP Breaks
1. Try browser_close and restart
2. Check for Zed external agent (NOT terminal)
3. Report issue to Ben

---

## 📝 Notes for Future Me

- **Always use Zed external agent** for Playwright MCP (not terminal)
- **Wait 2 seconds** after blur events (500ms debounce + save time)
- **Check console messages** before and after actions
- **Take screenshots** for evidence (Cursor loves visual proof)
- **Write detailed error messages** with specific recommendations
- **Use exact file paths** in results JSON for easy navigation

---

**This protocol ensures consistent, reliable, automated testing that Cursor can depend on!** 🎯
