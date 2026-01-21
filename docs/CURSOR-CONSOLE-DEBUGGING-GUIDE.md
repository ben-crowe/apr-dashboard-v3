# Console Debugging Guide for Cursor

## When the Page Won't Load - DO THIS FIRST

If a page fails to load or shows errors, **STOP GUESSING** and check the console.

---

## Step-by-Step Console Debugging

### 1. Open the Page with Browser Agent

```bash
agent-browser open http://localhost:8086/dashboard/job/f8f1106a-e44c-477e-b046-42315ce38d8f
```

### 2. Check Console Errors

```bash
agent-browser console
```

**This shows ALL console messages including:**
- JavaScript errors
- React errors
- Warning messages
- Network failures
- Missing dependencies

### 3. Check Page Errors Specifically

```bash
agent-browser errors
```

**This filters to just error-level messages:**
- Uncaught exceptions
- Syntax errors
- Module import failures
- Component render errors

### 4. Take a Screenshot to See Visual State

```bash
agent-browser screenshot page-state.png
```

This shows if the page is:
- Completely blank
- Partially loaded
- Showing an error boundary
- Stuck in loading state

---

## Common Error Patterns & Fixes

### Pattern 1: Import Error
```
Console shows: "Cannot find module '@/components/...' "
```
**Fix:** File path is wrong or component doesn't exist. Check the import path.

### Pattern 2: Undefined Variable
```
Console shows: "Cannot read property 'map' of undefined"
```
**Fix:** Data isn't loaded yet. Add null check or optional chaining.

### Pattern 3: React Hook Error
```
Console shows: "Invalid hook call" or "Rendered more hooks than..."
```
**Fix:** Hook called conditionally or outside component. Review hook usage.

### Pattern 4: TypeScript Error
```
Console shows: "Type 'X' is not assignable to type 'Y'"
```
**Fix:** Type mismatch. Check prop types or add type assertion.

### Pattern 5: Network Error
```
Console shows: "Failed to fetch" or "404 Not Found"
```
**Fix:** API endpoint wrong or backend not running.

---

## Complete Debugging Workflow

```bash
# 1. Open the page
agent-browser open http://localhost:8086/dashboard/job/YOUR-JOB-ID

# 2. Wait for page to attempt loading
agent-browser wait 3000

# 3. Check for errors
agent-browser errors

# 4. Check full console output
agent-browser console

# 5. Take screenshot to see visual state
agent-browser screenshot debug.png

# 6. Check network requests if needed
agent-browser network requests

# 7. Close browser when done
agent-browser close
```

---

## What to Report to User

After checking console, report:

1. **Error Type:** "React rendering error" / "Import error" / "Network error" / etc.
2. **Exact Error Message:** Copy the full error from console
3. **File & Line:** Where the error occurred (if available)
4. **What Broke:** "LOE page won't load because EditableSection component has undefined prop"
5. **Quick Fix:** "Need to add null check on line 45 of TemplateEditorModal.tsx"

---

## DO NOT Say This:

❌ "The page might not be loading"
❌ "There could be an error"
❌ "Try checking the console"
❌ "I'm not sure what's wrong"

## DO Say This:

✅ "Console shows: 'Cannot find module @/components/ui/textarea'. The import path on line 6 is incorrect."
✅ "React error: editableSections.map is not a function. The sections prop is undefined in TemplateEditorModal.tsx:330"
✅ "Network error: GET /api/jobs/xxx returned 404. Backend endpoint missing or job ID invalid."

---

## Example: Debugging LOE Page Load Failure

```bash
# Open the page
agent-browser open http://localhost:8086/dashboard/job/f8f1106a-e44c-477e-b046-42315ce38d8f

# Check errors
agent-browser errors
```

**Example Output:**
```
TypeError: Cannot read property 'handleTextareaResize' of undefined
  at TemplateEditorModal.tsx:362
  at Array.map
```

**Report to User:**
"Ben, the LOE page won't load because handleTextareaResize is undefined on line 362 of TemplateEditorModal.tsx. The function exists but isn't being called correctly in the onChange handler. I'll fix the reference now."

---

## Advanced: Debugging React Components

### Check Component Tree
```bash
agent-browser eval "console.log(document.querySelector('[data-testid=\"template-editor\"]'))"
agent-browser console
```

### Check Props Being Passed
```bash
agent-browser eval "window.React = require('react'); console.log('React version:', React.version)"
agent-browser console
```

### Check State Values
```bash
agent-browser eval "console.log('Sections:', window.__REACT_DEVTOOLS_GLOBAL_HOOK__)"
agent-browser console
```

---

## Quick Reference Card

| Problem | Command | Look For |
|---------|---------|----------|
| Page blank | `agent-browser screenshot` + `agent-browser errors` | React errors, import failures |
| Slow load | `agent-browser network requests` | Slow API calls, missing resources |
| White screen | `agent-browser console` | Uncaught exceptions |
| Partial render | `agent-browser snapshot -i` | Missing elements, broken layout |
| API issues | `agent-browser network requests --filter api` | 404s, 500s, timeout |

---

## Cursor Prompt for Self-Service Debugging

**When you encounter a page load failure, run this immediately:**

```bash
agent-browser open http://localhost:8086/dashboard/job/[JOB-ID]
agent-browser wait 3000
agent-browser errors
agent-browser console
```

Then analyze the output and report the exact error with file location and line number. Don't guess - the console tells you exactly what's wrong.

---

## Remember

**The console is THE source of truth.**

If the page won't load:
1. Check console FIRST (not last)
2. Report exact error message
3. Identify file and line number
4. Propose specific fix based on actual error

**Stop guessing. Start reading console.**
