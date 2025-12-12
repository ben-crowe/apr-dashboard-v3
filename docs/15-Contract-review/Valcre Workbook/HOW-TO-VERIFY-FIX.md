# How to Verify the Property Duplicate Fix

**Fix Applied:** Removed duplicate "Property" word from cover page
**Commit:** a3abdf8

---

## Quick Test (Recommended)

### 1. Start the App
```bash
cd /Users/bencrowe/Development/APR-Dashboard-v3
npm run dev
```

### 2. Navigate to Report Builder
- Open http://localhost:5173
- Go to Report Builder page

### 3. Check Cover Page
Look at the cover page preview and verify:

**BEFORE FIX (WRONG):**
```
Multi-Family Walkup Property Property
```

**AFTER FIX (CORRECT):**
```
Multi-Family Walkup Property
```

---

## Full HTML Verification

### 1. Export HTML from App

**Option A: Browser Console**
```javascript
// In browser console:
const iframe = document.querySelector('iframe[title="Report Preview"]');
const html = iframe.contentDocument.documentElement.outerHTML;
console.log(html);
// Copy and paste into a file
```

**Option B: Export to PDF**
- Click "Export PDF" button
- If using Gotenberg, capture the HTML payload before sending

### 2. Search for the Fix
```bash
cd /Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/Valcre\ Workbook
grep "property-type" generated-report-FROM-APP.html
```

**Should see:**
```html
<div class="property-type">Multi-Family Walkup Property</div>
```

**Should NOT see:**
```html
<div class="property-type">Multi-Family Walkup Property Property</div>
```

---

## Test Data Values

### Current Test Data Files

**northBattlefordTestData.ts:**
```typescript
'property-type-display': 'Multi-Family Walkup'  // No "Property" suffix
```

**northBattlefordTestData-REAL.ts:**
```typescript
'property-type-display': 'Multi-Family Walkup Property'  // Has "Property" suffix
```

### Template Logic (Fixed)

**Before:**
```typescript
${propertyType ? `${propertyType} Property` : '[Property Type]'}
//                                 ^^^^^^^
//                          This was being added
```

**After:**
```typescript
${propertyType ? `${propertyType}` : '[Property Type]'}
//                                ^
//                         No longer appending " Property"
```

### Expected Results

| Data File | Field Value | Template Output |
|-----------|-------------|-----------------|
| Test Data | `Multi-Family Walkup` | `Multi-Family Walkup` |
| REAL Data | `Multi-Family Walkup Property` | `Multi-Family Walkup Property` |

Both now display correctly without duplication.

---

## Automated Test (Future)

Add a test to prevent regression:

```typescript
describe('Cover Page Rendering', () => {
  it('should not duplicate Property suffix', () => {
    const sections = createTestSections({
      'property-type-display': 'Multi-Family Walkup Property'
    });

    const html = generateReportHtml(sections);

    // Should appear once
    expect(html).toContain('Multi-Family Walkup Property');

    // Should NOT appear duplicated
    expect(html).not.toContain('Property Property');
  });
});
```

---

## Related Files

**Modified:**
- `/Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/templates/reportHtmlTemplate.ts` (line 6830)

**Documentation:**
- `/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/Valcre Workbook/DUPLICATE-ANALYSIS.md`

**Data Files:**
- `/Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/data/northBattlefordTestData.ts`
- `/Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/data/northBattlefordTestData-REAL.ts`

---

## Next Steps

1. Verify fix in running app
2. Update comparison script to handle nested divs correctly (see DUPLICATE-ANALYSIS.md)
3. Re-run comparison after fixing comparison script
4. Add automated test to prevent regression
