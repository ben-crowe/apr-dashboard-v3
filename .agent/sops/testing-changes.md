# SOP: Testing Changes

> **Purpose:** Standard procedure for verifying Report Builder changes
> **Applies to:** Any code changes to the Report Builder system

---

## Quick Test (5 minutes)

For minor changes, run through this quick verification:

1. **Start the app**
   ```bash
   cd /Users/bencrowe/Development/APR-Dashboard-v3
   npm run dev
   ```

2. **Load test data**
   - Navigate to `/test-input` (Test Data Dashboard)
   - Click "Load Data" button
   - Verify no console errors

3. **Check preview**
   - Navigate to `/mock-builder`
   - Verify preview renders
   - Check your specific change appears correctly

4. **Check editor**
   - Click through sections in sidebar
   - Verify fields render
   - Test editing a field (should update preview)

---

## Full Test (15 minutes)

For significant changes, add these checks:

### Store Verification

1. Open React DevTools
2. Find `ReportBuilderStoreProvider`
3. Expand state and verify:
   - `sections` array has ~30 sections
   - Your fields exist with correct values
   - `previewHtml` is populated

### Coverage Statistics

1. On `/test-input` page
2. Check the stats panel:
   - Template fields: ~1,247
   - Mapped: ~1,000+
   - Coverage: ~80%+

### Calculation Engine

If you changed calculation-related fields:
1. Load data
2. Check calculated fields populate
3. Verify calculations are correct
4. Check sales comp, cost, and income approaches

### Image Fields

If you changed image-related fields:
1. Load data
2. Check images render in preview (not as text paths)
3. Test image upload in editor
4. Verify `onerror` handling for missing images

---

## Console Debug Markers

The store has debug logging. Look for:

```
🖼️ IMAGE UPDATE: subject-photo from "" to "/extracted-images/image2.jpeg"
🟣🟣🟣 FOUND subject-photo in section "image-mgt"
interpolateTemplate: Image replacement: {{subject-photo}} → value:"..."
```

---

## Common Test Scenarios

### Testing Field Additions

- [ ] Field appears in store (React DevTools)
- [ ] Field renders in preview (if in template)
- [ ] Field shows in editor (if in EditPanel layout)
- [ ] Test data populates the field

### Testing Template Changes

- [ ] No broken placeholders (search for `{{` in preview)
- [ ] Images render as images, not paths
- [ ] Page layout intact
- [ ] Approach toggling still works

### Testing Store Changes

- [ ] `loadDataSet1User()` completes without errors
- [ ] `generatePreview()` produces valid HTML
- [ ] Field updates trigger preview refresh
- [ ] No state corruption after multiple edits

### Testing Calculations

- [ ] Calculated fields populate after loading user-input fields
- [ ] Values are mathematically correct
- [ ] Calculation chain works (A feeds B feeds C)

---

## Routes for Testing

| Route | Purpose |
|-------|---------|
| `/test-input` | Load test data, view statistics |
| `/mock-builder` | Full editor + preview |
| `/preview` | Preview-only view |

---

## Known Issues to Watch For

| Symptom | Likely Cause |
|---------|--------------|
| Field shows `{{field-id}}` in preview | Missing from store or wrong ID |
| Image shows as text path | Missing `<img>` tag in template |
| Editor shows empty | Field not in EditPanel layout |
| Calculations wrong | Missing input fields or formula error |
| Stats show low coverage | Test data missing entries |

---

## Pre-Commit Checklist

Before committing:

- [ ] App runs without console errors
- [ ] Test data loads successfully
- [ ] Preview renders correctly
- [ ] Your specific change works as expected
- [ ] No regression in existing functionality

---

## Automated Testing (Future)

Currently testing is manual. Planned:
- Unit tests for calculations
- Integration tests for data flow
- Visual regression tests for preview

---

*When in doubt, load test data and verify in both editor and preview.*
