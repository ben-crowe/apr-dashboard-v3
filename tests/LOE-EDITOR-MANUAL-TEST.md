# LOE Template Editor - Manual Test Guide (agent-browser)

## Prerequisites

1. **Start dev server:**
   ```bash
   cd /Users/bencrowe/Development/APR-Dashboard-v3
   npm run dev
   ```

2. **Verify app is running:** http://localhost:3000

---

## Test Flow with agent-browser

### Step 1: Open Dashboard

```bash
agent-browser open http://localhost:3000 --headed
```

*Note: `--headed` shows the browser window so you can watch*

### Step 2: Get Initial Snapshot

```bash
agent-browser snapshot -i > /tmp/dashboard.txt
cat /tmp/dashboard.txt | head -50
```

Look for navigation elements, job links, etc.

### Step 3: Navigate to Job Details

**Find a job link:**
```bash
grep -i "job\|view details" /tmp/dashboard.txt
```

**Click the job link** (replace `@eXX` with actual ref):
```bash
agent-browser click @eXX
agent-browser wait 1000
```

### Step 4: Find "Send LOE" Button

```bash
agent-browser snapshot -i > /tmp/job-details.txt
grep -i "send loe\|generate loe" /tmp/job-details.txt
```

**Click "Send LOE":**
```bash
agent-browser click @eXX  # Replace with actual ref
agent-browser wait 1000
```

### Step 5: Verify Preview Modal

```bash
agent-browser snapshot -i > /tmp/preview-modal.txt
cat /tmp/preview-modal.txt
```

**Expected:** See LOE preview modal with:
- Preview iframe
- "Approve and Send" button
- **"Edit Template" button** ← NEW FEATURE

### Step 6: Click "Edit Template"

```bash
grep -i "edit template" /tmp/preview-modal.txt
agent-browser click @eXX  # Edit Template button ref
agent-browser wait 1000
```

### Step 7: Verify Template Editor Modal

```bash
agent-browser snapshot -i > /tmp/editor-modal.txt
cat /tmp/editor-modal.txt
```

**Expected:** See template editor with:
- HTML textarea (left side)
- Preview iframe (right side)
- "Save Template" button
- "Cancel" button

### Step 8: Edit Template HTML

**Find the textarea:**
```bash
grep -i "textarea\|template html" /tmp/editor-modal.txt
```

**Make a test edit:**
```bash
agent-browser focus @eXX  # Textarea ref
agent-browser press End
agent-browser type @eXX "\n<!-- TEST EDIT -->"
```

**Verify change in preview:**
```bash
agent-browser wait 500
agent-browser screenshot /tmp/editor-with-changes.png
```

### Step 9: Save Template

```bash
grep -i "save template" /tmp/editor-modal.txt
agent-browser click @eXX  # Save Template button
agent-browser wait 500
```

### Step 10: Fill Save Dialog

```bash
agent-browser snapshot -i > /tmp/save-dialog.txt
cat /tmp/save-dialog.txt
```

**Expected:** Dialog with:
- Template name input
- "Set as my default template" checkbox

**Fill in name:**
```bash
grep -i "template name" /tmp/save-dialog.txt
agent-browser fill @eXX "My Test Template"
```

**Check "Set as default":**
```bash
grep -i "default" /tmp/save-dialog.txt
agent-browser check @eXX
```

**Click final Save:**
```bash
grep -i "^save$\|button.*save" /tmp/save-dialog.txt
agent-browser click @eXX
agent-browser wait 2000
```

### Step 11: Verify Success

```bash
agent-browser snapshot -i > /tmp/after-save.txt
agent-browser screenshot /tmp/final-state.png
```

**Expected:**
- Success toast message
- Editor modal closes
- Preview modal still open
- Preview shows edited template

### Step 12: Test Block on Unsaved Changes

**Edit template again but DON'T save:**
```bash
# Click Edit Template again
agent-browser click @eXX
agent-browser wait 500

# Make changes
agent-browser fill @eXX "NEW CHANGES"

# Click Cancel (don't save)
grep -i "cancel" /tmp/editor-modal.txt
agent-browser click @eXX
```

**Try to send:**
```bash
grep -i "approve.*send\|send to client" /tmp/preview-modal.txt
agent-browser click @eXX  # Approve and Send button
```

**Expected:** Error toast: "Please save your template before sending to client"

### Step 13: Cleanup

```bash
agent-browser close
```

---

## Success Criteria

✅ **Preview modal opens** when clicking "Send LOE"
✅ **"Edit Template" button** visible in preview modal
✅ **Template editor modal** opens with split view
✅ **HTML is editable** in textarea
✅ **Preview updates** when editing
✅ **Save dialog appears** with name input + default checkbox
✅ **Template saves** successfully
✅ **Success toast** displays
✅ **Sending blocked** if template edited but not saved

---

## Debugging

**View browser console:**
```bash
agent-browser console
```

**View page errors:**
```bash
agent-browser errors
```

**Get current URL:**
```bash
agent-browser get url
```

**Take screenshot at any point:**
```bash
agent-browser screenshot /tmp/debug-{step}.png
```

---

## Video Recording (Optional)

**Record the entire test:**
```bash
agent-browser record start /tmp/loe-editor-test.webm
# ... perform all test steps ...
agent-browser record stop
```

Then review: `/tmp/loe-editor-test.webm`
