# LOE Template Editor Test Protocol

## Overview

Test protocol for validating the LOE Template Editor feature using agent-browser. Uses an existing test job that is already prepped with Valcre job number and e-signature component - no setup needed.

## Test Job

- **URL**: `http://localhost:8086/dashboard/job/f8f1106a-e44c-477e-b046-42315ce38d8f`
- **Status**: Already prepped - has Valcre job number and e-signature component
- **Setup Required**: NONE - skip directly to LOE Template Editor testing

## Important Notes

- **DO NOT click test data buttons** - job is already configured
- **Skip setup phase** - go straight to "Preview & Send LOE" button
- Test data buttons are only needed when testing fields in general or creating new jobs
- For this existing job, assume all fields are perfect and ready

## Prerequisites

- Dev server running on port 8086
- agent-browser installed (`/Users/bencrowe/.npm-global/bin/agent-browser`)
- Database migration applied (loe_templates table exists)
- User authenticated (for template saving)

## Test Protocol

### Step 1: Navigate to Test Job

```bash
agent-browser open http://localhost:8086/dashboard/job/f8f1106a-e44c-477e-b046-42315ce38d8f --headed
```

*Note: `--headed` shows the browser window so you can watch the test*

### Step 2: Verify Job is Ready

```bash
agent-browser snapshot -i | grep -i "preview.*send\|send.*loe"
```

**Expected**: "Preview & Send LOE" button should be enabled (not disabled)

If disabled, check console for validation errors:
```bash
agent-browser console | tail -10
```

### Step 3: Open LOE Preview Modal

```bash
# Find Preview & Send LOE button ref
agent-browser snapshot -i | grep -i "preview.*send"
# Click it (replace @eXX with actual ref)
agent-browser click @eXX
agent-browser wait 2000
```

### Step 4: Verify Preview Modal Opened

```bash
agent-browser snapshot -i | grep -i "edit template\|preview\|send to client"
```

**Expected**: Should see "Edit Template" button and preview iframe

Take a screenshot for reference:
```bash
agent-browser screenshot /tmp/preview-modal-opened.png
```

## Test Scenarios

### Scenario 1: Basic Template Editing Flow

**Objective**: Verify the complete template editing workflow works end-to-end

**Steps:**

1. **Click "Edit Template" button in preview modal**
   ```bash
   agent-browser snapshot -i | grep -i "edit template"
   agent-browser click @eXX  # Replace with actual ref
   agent-browser wait 1000
   ```

2. **Verify template editor modal opens with split view**
   ```bash
   agent-browser snapshot -i | grep -i "template html\|save template\|textarea"
   ```
   Expected:
   - Left side: HTML textarea editor
   - Right side: Live preview iframe
   - "Save Template" button visible
   - "Cancel" button visible

3. **Make a test edit (add HTML comment)**
   ```bash
   # Find the textarea ref
   agent-browser snapshot -i | grep -i "template html\|textarea"
   # Focus and add comment at end
   agent-browser focus @eXX  # Textarea ref
   agent-browser press End
   agent-browser type @eXX "\n<!-- TEST EDIT -->"
   agent-browser wait 500
   ```

4. **Verify preview updates in real-time**
   ```bash
   agent-browser screenshot /tmp/preview-updated.png
   # Preview should show the comment in HTML source
   ```

5. **Click "Save Template" button**
   ```bash
   agent-browser snapshot -i | grep -i "save template"
   agent-browser click @eXX  # Save Template button ref
   agent-browser wait 500
   ```

6. **Fill template name**
   ```bash
   agent-browser snapshot -i | grep -i "template name"
   agent-browser fill @eXX "Test Template"
   ```

7. **Optionally check "Set as default"**
   ```bash
   agent-browser snapshot -i | grep -i "set as.*default"
   agent-browser check @eXX  # Checkbox ref
   ```

8. **Click final "Save" button**
   ```bash
   agent-browser snapshot -i | grep -i "^save$\|button.*save" | grep -v "Save Template"
   agent-browser click @eXX  # Final Save button ref
   agent-browser wait 2000
   ```

9. **Verify success toast appears**
   ```bash
   agent-browser snapshot -i | grep -i "success\|saved"
   # Should see toast message about template being saved
   ```

10. **Verify editor modal closes**
    ```bash
    agent-browser snapshot -i | grep -i "edit template\|template html"
    # Should NOT see editor elements - modal closed
    ```

11. **Verify preview modal shows updated template**
    ```bash
    agent-browser screenshot /tmp/preview-with-saved-template.png
    # Preview should reflect the saved changes
    ```

**Validation Checklist:**
- [ ] Editor opens correctly
- [ ] Preview updates as you type
- [ ] Save dialog appears
- [ ] Template saves successfully
- [ ] Success feedback shown
- [ ] Editor modal closes after save
- [ ] Preview shows updated template

---

### Scenario 2: Placeholder Protection

**Objective**: Verify that field placeholders cannot be accidentally modified

**Steps:**

1. **Click "Edit Template"**
   ```bash
   agent-browser snapshot -i | grep -i "edit template"
   agent-browser click @eXX
   agent-browser wait 1000
   ```

2. **Find a field placeholder**
   ```bash
   # Get the HTML content to find placeholders
   agent-browser snapshot -i | grep -i "template html\|textarea"
   agent-browser focus @eXX  # Textarea ref
   # Look for placeholders like [fee], [date.created], [propertycontact.company]
   ```

3. **Modify a placeholder**
   ```bash
   # Example: Change [fee] to [fee_modified]
   agent-browser focus @eXX
   agent-browser press Control+f  # Open find
   agent-browser type @eXX "[fee]"
   # Manually modify: [fee] -> [fee_modified]
   # Or use: agent-browser eval to replace text
   ```

4. **Click "Save Template"**
   ```bash
   agent-browser snapshot -i | grep -i "save template"
   agent-browser click @eXX
   agent-browser wait 500
   ```

5. **Verify error toast appears**
   ```bash
   agent-browser snapshot -i | grep -i "warning\|placeholder\|modified"
   ```
   Expected: Error toast: "Warning: Field placeholders have been modified! Please ensure all [field] placeholders are intact."

6. **Restore original placeholder**
   ```bash
   # Change [fee_modified] back to [fee]
   agent-browser focus @eXX
   # Restore the placeholder
   ```

7. **Verify save succeeds**
   ```bash
   agent-browser click @eXX  # Save Template button again
   agent-browser wait 500
   # Should now show save dialog (not error)
   ```

**Validation Checklist:**
- [ ] Placeholder modification detected
- [ ] Error toast appears
- [ ] Save blocked until placeholder restored
- [ ] Save succeeds after restoration

---

### Scenario 3: Set as Default Template

**Objective**: Verify that setting a template as default causes it to load on next generation

**Steps:**

1. **Edit template**
   ```bash
   agent-browser snapshot -i | grep -i "edit template"
   agent-browser click @eXX
   agent-browser wait 1000
   ```

2. **Make a distinctive edit**
   ```bash
   agent-browser snapshot -i | grep -i "template html\|textarea"
   agent-browser focus @eXX
   agent-browser press End
   agent-browser type @eXX "\n<!-- DEFAULT TEMPLATE TEST -->"
   ```

3. **Save with "Set as default" checked**
   ```bash
   agent-browser snapshot -i | grep -i "save template"
   agent-browser click @eXX
   agent-browser wait 500
   
   # Fill name
   agent-browser snapshot -i | grep -i "template name"
   agent-browser fill @eXX "Default Test Template"
   
   # Check default checkbox
   agent-browser snapshot -i | grep -i "set as.*default"
   agent-browser check @eXX
   
   # Save
   agent-browser snapshot -i | grep -i "^save$" | grep -v "Save Template"
   agent-browser click @eXX
   agent-browser wait 2000
   ```

4. **Close preview modal**
   ```bash
   agent-browser snapshot -i | grep -i "close\|cancel\|x"
   agent-browser click @eXX  # Close button
   agent-browser wait 1000
   ```

5. **Click "Preview & Send LOE" again (generate new preview)**
   ```bash
   agent-browser snapshot -i | grep -i "preview.*send"
   agent-browser click @eXX
   agent-browser wait 2000
   ```

6. **Verify custom template loads**
   ```bash
   # Check if the test comment is in the preview
   agent-browser eval "document.querySelector('iframe')?.contentDocument?.body?.innerHTML.includes('DEFAULT TEMPLATE TEST')" 2>&1
   ```
   Expected: Should return `true` - custom template loaded

7. **Verify it's NOT the default V3_TEMPLATE**
   ```bash
   # The test comment should be present, proving custom template loaded
   agent-browser screenshot /tmp/custom-template-loaded.png
   ```

**Validation Checklist:**
- [ ] Default checkbox works
- [ ] Template saved as default
- [ ] Next preview loads custom template
- [ ] Database query successful
- [ ] Custom template HTML visible in preview

---

### Scenario 4: Send Blocking (Unsaved Changes)

**Objective**: Verify that sending is blocked when template is modified but not saved

**Steps:**

1. **Open preview modal**
   ```bash
   agent-browser snapshot -i | grep -i "preview.*send"
   agent-browser click @eXX
   agent-browser wait 2000
   ```

2. **Click "Edit Template"**
   ```bash
   agent-browser snapshot -i | grep -i "edit template"
   agent-browser click @eXX
   agent-browser wait 1000
   ```

3. **Make changes (add comment)**
   ```bash
   agent-browser snapshot -i | grep -i "template html\|textarea"
   agent-browser focus @eXX
   agent-browser press End
   agent-browser type @eXX "\n<!-- UNSAVED CHANGES -->"
   agent-browser wait 500
   ```

4. **Click "Cancel" (close editor without saving)**
   ```bash
   agent-browser snapshot -i | grep -i "cancel"
   agent-browser click @eXX  # Cancel button
   agent-browser wait 1000
   ```

5. **Try to click "Send to Client"**
   ```bash
   agent-browser snapshot -i | grep -i "send to client\|approve.*send"
   agent-browser click @eXX  # Send button
   agent-browser wait 1000
   ```

6. **Verify error toast appears**
   ```bash
   agent-browser snapshot -i | grep -i "save.*template\|before.*sending"
   ```
   Expected: Error toast: "Please save your template before sending to client"

7. **Click "Edit Template" again**
   ```bash
   agent-browser snapshot -i | grep -i "edit template"
   agent-browser click @eXX
   agent-browser wait 1000
   ```

8. **Save template**
   ```bash
   agent-browser snapshot -i | grep -i "save template"
   agent-browser click @eXX
   agent-browser wait 500
   
   agent-browser snapshot -i | grep -i "template name"
   agent-browser fill @eXX "Saved Template"
   
   agent-browser snapshot -i | grep -i "^save$" | grep -v "Save Template"
   agent-browser click @eXX
   agent-browser wait 2000
   ```

9. **Verify "Send to Client" button now works**
   ```bash
   agent-browser snapshot -i | grep -i "send to client"
   agent-browser is enabled @eXX  # Should return true
   ```

**Validation Checklist:**
- [ ] Send blocked when template modified but not saved
- [ ] Error message clear and helpful
- [ ] Send works after saving
- [ ] State tracking works correctly

---

## Validation Checklist

### Setup & Navigation
- [ ] Test job loads correctly
- [ ] "Preview & Send LOE" button is enabled
- [ ] Preview modal opens

### Template Editor
- [ ] "Edit Template" button visible in preview modal
- [ ] Template editor modal opens with split view
- [ ] HTML editor is editable
- [ ] Preview updates in real-time when editing
- [ ] "Save Template" button works
- [ ] Save dialog appears with name input and checkbox
- [ ] Template saves successfully
- [ ] Success toast appears

### Features
- [ ] Placeholder protection works
- [ ] Default template setting works
- [ ] Send blocking works when template modified but not saved
- [ ] Saved template loads on next generation

### Database
- [ ] Template saved to loe_templates table
- [ ] Default flag set correctly
- [ ] User ID associated correctly
- [ ] Template HTML stored correctly

## Troubleshooting

### "Preview & Send LOE" disabled

**Possible causes:**
- Job might not have Valcre job number
- Validation might be failing
- Required fields not filled

**Debug steps:**
```bash
agent-browser console | grep -i "validation\|error\|valcre"
agent-browser eval "Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Preview & Send LOE')).disabled" 2>&1
```

### Modal doesn't open

**Possible causes:**
- JavaScript errors
- Button not actually enabled
- Validation blocking

**Debug steps:**
```bash
agent-browser console | tail -20
agent-browser errors
agent-browser eval "window.validateRequiredFields" 2>&1
```

### Template doesn't save

**Possible causes:**
- Database errors
- User not authenticated
- RLS policies blocking

**Debug steps:**
```bash
agent-browser console | grep -i "database\|error\|save"
agent-browser eval "const { data: { user } } = await supabase.auth.getUser(); user?.id" 2>&1
```

### Placeholder validation not working

**Possible causes:**
- Regex pattern issue
- Placeholder format changed
- Validation logic error

**Debug steps:**
```bash
agent-browser console | grep -i "placeholder\|validation"
agent-browser eval "const pattern = /\[[\w.-]+\]/g; pattern.test('[fee]')" 2>&1
```

## Success Criteria

- All test scenarios pass
- No console errors (except known database UUID warnings)
- Database records created correctly in loe_templates table
- UI behaves as expected
- Template editor fully functional
- Placeholder protection works
- Default template loading works
- Send blocking works correctly

## agent-browser Commands Reference

### Navigation
```bash
agent-browser open <url> --headed          # Navigate to URL (show browser)
agent-browser get url                      # Get current URL
agent-browser back                         # Go back
agent-browser reload                       # Reload page
```

### Snapshot & Inspection
```bash
agent-browser snapshot -i                  # Interactive elements only (recommended)
agent-browser snapshot                     # Full accessibility tree
agent-browser screenshot /tmp/test.png     # Take screenshot
```

### Interactions
```bash
agent-browser click @eXX                   # Click element by ref
agent-browser fill @eXX "text"             # Fill input field
agent-browser check @eXX                   # Check checkbox
agent-browser focus @eXX                   # Focus element
agent-browser type @eXX "text"             # Type text
agent-browser press Enter                  # Press key
```

### State & Information
```bash
agent-browser is enabled @eXX              # Check if enabled
agent-browser is visible @eXX              # Check if visible
agent-browser get text @eXX                # Get element text
agent-browser get value @eXX               # Get input value
```

### Debugging
```bash
agent-browser console                      # View console messages
agent-browser errors                       # View page errors
agent-browser wait 2000                   # Wait milliseconds
agent-browser wait @eXX                    # Wait for element
```

### JavaScript Execution
```bash
agent-browser eval "document.title"       # Run JavaScript
```

## Notes

- **Port**: 8086 (not 3000 or 5173)
- **Test Job**: Use existing job - do NOT create new Valcre jobs
- **Setup**: Skip test data buttons - job is already prepped
- **Focus**: Go straight to LOE Template Editor testing
- **Placeholders**: Template editor validates placeholder integrity using regex `/\[[\w.-]+\]/g`
- **Default Template**: Loads from database (`loe_templates` table), falls back to `V3_TEMPLATE` constant
- **User ID**: Required for saving templates - retrieved via `supabase.auth.getUser()`
- **RLS**: Templates are user-scoped (users can only access their own templates)

## Issues Found During Testing

### 🔴 CRITICAL: Template Editor Modal Window Too Small

**Issue**: The template editor modal window is extremely small, making it nearly impossible to see or edit the template content effectively.

**Location**: 
- `TemplateEditorModal.tsx` line 88: `max-w-[95vw] max-h-[95vh]`
- `src/components/ui/dialog.tsx` line 39: Default `max-w-lg` (~512px)

**Root Cause**:
The `DialogContent` component has a default `max-w-lg` class (line 39 in `dialog.tsx`), which limits the dialog to approximately 512px width. While `TemplateEditorModal` attempts to override this with `max-w-[95vw]`, the Tailwind class merge may not be working correctly, or the default is taking precedence.

**Current Implementation**:
```tsx
// TemplateEditorModal.tsx line 88
<DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden flex flex-col">
```

```tsx
// dialog.tsx line 39 (default)
className={cn(
  "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg ...", // ← max-w-lg is the problem
  className
)}
```

**Impact**: 
- **HIGH** - Users cannot effectively edit templates due to poor visibility
- The HTML editor textarea and preview iframe are both too small to be usable
- This severely impacts the core functionality of the feature
- User feedback: "It was so small I couldn't even see the page"

**Expected Behavior**:
- Modal should use full viewport width/height (or close to it) for a full-screen editing experience
- Editor and preview should each take ~50% of available space
- Text should be readable without excessive scrolling

**Fix Required**:
1. Override the default `max-w-lg` by ensuring the custom class takes precedence
2. Options:
   - Use `!max-w-[95vw]` (important flag) to force override
   - Or modify the className merge order in `dialog.tsx` to prioritize passed className
   - Or use a more specific width like `w-[95vw]` instead of `max-w-[95vw]`
3. Ensure height is also properly applied: `h-[95vh]` or `max-h-[95vh]`

**Recommended Fix**:
```tsx
<DialogContent className="!max-w-[95vw] !max-h-[95vh] w-[95vw] h-[95vh] overflow-hidden flex flex-col">
```

**Status**: ✅ **FIXED** - Applied fix using `!max-w-[95vw]` and `w-[95vw] h-[95vh]` to override default `max-w-lg`

**Fix Applied**:
- Changed line 88 to: `className="!max-w-[95vw] !max-h-[95vh] w-[95vw] h-[95vh] overflow-hidden flex flex-col"`
- Used Tailwind `!` important flag to force override of default `max-w-lg`
- Set explicit width and height to ensure full viewport usage
- Improved flex layout for better space distribution

---

### ✅ COMPLETE REDESIGN: Form-Based Template Editor

**Issue**: Users were seeing raw HTML code in a textarea, which is not acceptable for end users.

**Status**: ✅ **FIXED** - Complete redesign implemented

**Changes Made**:

1. **Created Template Parser Utility** (`src/utils/loe/templateParser.ts`):
   - Extracts editable text sections from HTML template
   - Identifies field placeholders in each section
   - Reconstructs HTML from edited text sections

2. **Redesigned TemplateEditorModal Component**:
   - **Left Side**: Form-based UI with labeled sections and textareas (NO raw HTML)
   - **Right Side**: Live preview iframe
   - **Field Placeholders**: Shown as badges below each textarea
   - **User Experience**: Users see "Introduction Paragraph" with a textarea, not HTML code

3. **Key Features**:
   - Form-like interface with labeled sections
   - Field placeholders displayed as badges (e.g., `[fee]`, `[date.created]`)
   - Real-time preview updates as user types
   - Placeholder validation ensures field placeholders remain intact
   - HTML reconstruction merges edited text back into template structure

**Implementation Details**:
- Parser extracts `.intro` section and can be extended for more sections
- Each section shows available field placeholders as badges
- HTML is reconstructed on save, preserving template structure
- Validation ensures no placeholders are accidentally removed

**Next Steps** (if needed):
- Add more editable sections (scope of work, payment terms, etc.)
- Enhance parser to identify additional text sections automatically

---

## Test Execution Log

Use this section to track test execution:

**Date**: January 20, 2026
**Tester**: AI Agent (agent-browser)
**Results**:
- Scenario 1: [✅] Pass (functional but UX issue with window size)
- Scenario 2: [ ] Not Tested
- Scenario 3: [ ] Not Tested  
- Scenario 4: [ ] Not Tested

**Issues Found**:
1. 🔴 Template editor modal window is too small - nearly unusable
2. ⚠️ Need to verify placeholder protection works (not tested yet)
3. ⚠️ Need to verify default template loading works (not tested yet)
4. ⚠️ Need to verify send blocking works (not tested yet)

**Notes**:
- Core functionality works (edit → save → preview flow)
- Window sizing issue prevents effective template editing
- Need to fix sizing before proceeding with additional test scenarios
