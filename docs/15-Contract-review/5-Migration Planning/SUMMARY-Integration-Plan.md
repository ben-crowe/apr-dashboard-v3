# Integration Plan Summary - Perfected HTML Templates

**Date:** December 17, 2025
**Status:** Ready to Proceed

---

## TL;DR - Executive Summary

**CAN WE INTEGRATE?** ✅ **YES - Fully Compatible**

**HOW LONG?** ~3 weeks (Phase 1 = 1 week for pages 52-58)

**WHAT'S NEEDED?**
1. Add ~250 field definitions to field registry
2. Convert 7 HTML templates to TypeScript functions
3. Implement toggle button for field IDs
4. Validate against reference PDF

**RISK LEVEL:** 🟢 Low (no breaking changes)

---

## PART 1: Architecture Answers

### Q: Is preview actual HTML or programmatic rendering?

**A:** ✅ **Actual HTML String Templates**

```typescript
// Current system (reportHtmlTemplate.ts)
export function generateReportHtml(sections: ReportSection[]): string {
  return `
    <!DOCTYPE html>
    <html>
      <head><style>/* CSS */</style></head>
      <body>${renderAllPages(sections)}</body>
    </html>
  `;
}
```

**Rendering:** HTML string → iframe (`iframeDoc.write(html)`)

**Implication:** Can drop in perfected HTML pages directly ✅

---

### Q: Can we integrate perfected templates directly?

**A:** ✅ **YES - Zero Conversion Needed**

**Matching Patterns:**
- ✅ Page dimensions: 8.5in × 11in (same)
- ✅ CSS scoping: `.page-sheet[data-page-num="Page 54"]` (same)
- ✅ Field IDs: `{{Comp1_Address}}` → `${getFieldValue()}` (simple conversion)
- ✅ Page breaks: Individual `<div>` elements (same)

**Only Changes:**
1. Wrap HTML in `export function renderPageXX()`
2. Convert field IDs to template literals
3. Add `data-sample` attributes for toggle

---

## PART 2: Field Mapping Answers

### Q: How does test data loading work?

**A:** Button triggers store updates via field ID mapping

```typescript
// 1. Test data structure
northBattlefordRealData = {
  'comp1-address': '1551 107 St',
  'comp1-sale-date': '2024-06-17',
  // ...
}

// 2. Field to section mapping
fieldToSectionMap = {
  'comp1-address': 'sales',
  'comp1-sale-date': 'sales',
}

// 3. Load function iterates and updates store
loadNorthBattlefordRealData(updateFieldValue);

// 4. Store triggers preview regeneration
```

---

### Q: How to make field mapping "dummy proof"?

**A:** Consistent naming + validation script

**Convention:**
- Template: `{{Comp1_Address}}`
- Registry: `comp1-address`
- Test Data: `comp1-address`
- Store: `comp1-address`

**Validation:**
```typescript
// Create script to check all template field IDs exist in registry
function validateFieldIds(templateHtml: string, registry: FieldDefinition[]) {
  const matches = templateHtml.match(/\{\{([^}]+)\}\}/g);
  const registryIds = registry.map(f => f.id);

  matches.forEach(match => {
    const fieldId = convertToKebabCase(match);
    if (!registryIds.includes(fieldId)) {
      console.error(`Missing field: ${fieldId}`);
    }
  });
}
```

---

### Q: How many fields need adding?

**A:** ~250 comparable fields (50 per comparable × 5 comparables)

**Breakdown:**
- Basic info (name, address, etc.): 10/comparable = 50
- Sale info (buyer, price, date): 7/comparable = 35
- Property details (units, GBA, parking): 10/comparable = 50
- Income analysis (rent, NOI, cap rate): 6/comparable = 30
- Unit mix (types, counts, SF, rent): 12/comparable = 60
- Ratings (location, quality, condition): 4/comparable = 20
- Visual assets (photo, map): 2/comparable = 10
- Narrative (remarks): 1/comparable = 5

**Total:** 260 fields

---

## PART 3: Toggle Functionality

### Q: How does toggle work?

**A:** JavaScript switches textContent of `.field-mapped` elements

**HTML Pattern:**
```html
<span class="field-mapped"
      data-sample="1551-107 St, North Battleford, SK"
      title="comp1-address">
  1551-107 St, North Battleford, SK
</span>
```

**Toggle Logic:**
```typescript
const handleToggle = () => {
  const elements = iframe.querySelectorAll('.field-mapped');

  elements.forEach(el => {
    if (showingFieldIds) {
      el.textContent = el.getAttribute('title'); // "comp1-address"
    } else {
      el.textContent = el.getAttribute('data-sample'); // "1551-107 St..."
    }
  });
};
```

**UI Addition:**
```tsx
<Button onClick={handleToggle}>
  <Eye className="h-4 w-4" />
  {showFieldIds ? 'Show Data' : 'Show Field IDs'}
</Button>
```

---

## Integration Steps - Phase 1 (Pages 52-58)

### Step 1: Field Registry (Days 1-2)

**Task:** Add 260 comparable fields

**Process:**
```typescript
// Batch 1: Comp1 fields (50)
{ id: 'comp1-name', storeId: 'comp1-name', label: 'Comparable 1 Name', section: 'sales', subsection: 'comp1', type: 'text', inputSource: 'user-input', required: true },
{ id: 'comp1-address', storeId: 'comp1-address', label: 'Comparable 1 Address', section: 'sales', subsection: 'comp1', type: 'text', inputSource: 'user-input', required: true },
// ... 48 more

// Commit: feat(fields): add Comparable 1 fields (50)

// Batch 2: Comp2 fields (50)
// ... repeat

// Total commits: 5 (one per comparable)
```

**Files Modified:**
- `/src/features/report-builder/schema/fieldRegistry.ts`

---

### Step 2: Test Data (Days 1-2)

**Task:** Add test data for all comparable fields

**Process:**
```typescript
// Add to northBattlefordTestData-REAL.ts
export const northBattlefordRealData = {
  // Existing fields...

  // Comparable 1
  'comp1-name': 'Heritage House',
  'comp1-address': '1551 107 St, North Battleford, SK S9A 2A1',
  'comp1-sale-date': '2024-06-17',
  'comp1-sale-price': 3117383,
  // ... all comp1 fields

  // Comparable 2-5
  // ... repeat
};

// Add mappings
export const fieldToSectionMap = {
  'comp1-name': 'sales',
  'comp1-address': 'sales',
  // ... all comp1-5 fields
};
```

**Files Modified:**
- `/src/features/report-builder/data/northBattlefordTestData-REAL.ts`

---

### Step 3: Template Conversion (Days 3-4)

**Task:** Convert 7 HTML templates to TypeScript functions

**Process:**

1. **Copy perfected HTML** from template
2. **Convert field IDs:** `{{Comp1_Address}}` → `${getFieldValue(sections, 'comp1-address')}`
3. **Add to file:** Create `renderPage54()` function in `reportHtmlTemplate.ts`
4. **Register:** Add to `PAGE_RENDERERS` mapping
5. **Test:** Load preview, check console for errors

**Example:**
```typescript
export function renderPage54(sections: ReportSection[]): string {
  // Extract all field values
  const comp1Name = getFieldValue(sections, 'comp1-name');
  const comp1Address = getFieldValue(sections, 'comp1-address');
  const comp1SaleDate = getFieldValue(sections, 'comp1-sale-date');

  return `
    <style>
      .page-sheet[data-page-num="Page 54"] {
        /* CSS here */
      }
    </style>

    <div class="page-sheet" data-page-num="Page 54">
      <h1>Comparable 1 - ${comp1Name}</h1>
      <p>Address: <span class="field-mapped" data-sample="${comp1Address}" title="comp1-address">${comp1Address}</span></p>
      <p>Sale Date: <span class="field-mapped" data-sample="${comp1SaleDate}" title="comp1-sale-date">${comp1SaleDate}</span></p>
    </div>
  `;
}

// Register
export const PAGE_RENDERERS: Record<number, PageRenderer> = {
  // ...existing pages
  54: renderPage54,
  55: renderPage55,
  56: renderPage56,
  57: renderPage57,
  58: renderPage58,
};
```

**Files Modified:**
- `/src/features/report-builder/templates/reportHtmlTemplate.ts`

**Commits:** 7 (one per page)

---

### Step 4: Toggle Button (Day 5)

**Task:** Add toggle button to preview panel

**Process:**

1. **Add state:** `const [showFieldIds, setShowFieldIds] = useState(false);`
2. **Add button:** In toolbar next to export buttons
3. **Add handler:** Switches `.field-mapped` element textContent
4. **Test:** Click button, verify field IDs appear/disappear

**Files Modified:**
- `/src/features/report-builder/components/PreviewPanel/PreviewPanel.tsx`

**Commits:** 1

---

### Step 5: Validation (Day 5)

**Task:** Verify pages 52-58 match reference PDF

**Checklist:**
- [ ] All pages render without console errors
- [ ] "Load Test Data" populates all fields
- [ ] Toggle button switches between field IDs and data
- [ ] Visual layout matches reference PDF (±5%)
- [ ] Page breaks correct (no overflow)
- [ ] CSS scoped properly (no style conflicts)

**Files Modified:**
- Various (bug fixes as needed)

---

## Timeline & Effort

### Phase 1: Pages 52-58 (Proof of Concept)

| Day | Tasks | Hours | Commits |
|-----|-------|-------|---------|
| 1 | Add Comp1-2 fields to registry + test data | 6-8 | 2 |
| 2 | Add Comp3-5 fields to registry + test data | 6-8 | 3 |
| 3 | Convert Pages 54-56 to TypeScript | 6-8 | 3 |
| 4 | Convert Pages 52-53, 57-58, add toggle | 6-8 | 5 |
| 5 | Test, validate, fix issues | 6-8 | 1-3 |
| **TOTAL** | | **30-40 hrs** | **14-16** |

**Calendar:** 1 week at full-time (8 hrs/day)

---

### Phase 2: Remaining Pages (If Continuing)

| Task | Est. Hours | Priority |
|------|-----------|----------|
| Field registry (40 remaining fields) | 3-4 | P0 |
| Template conversions (70 pages) | 35-40 | P0 |
| Testing per batch | 15-20 | P0 |
| Performance optimization | 4-6 | P1 |
| Final validation | 6-8 | P0 |
| **TOTAL PHASE 2** | **63-78 hrs** | |

**Calendar:** 2 weeks at full-time

---

## Risk Assessment

### High Risks (Mitigated)

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Field ID mismatches | 🔴 High | 🟡 Medium | Consistent naming + validation script |
| Store structure changes | 🔴 High | 🟢 Low | Don't modify store unless necessary |
| Performance degradation | 🟡 Medium | 🟡 Medium | Profile rendering + lazy loading |

### Medium Risks (Acceptable)

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| CSS conflicts | 🟡 Medium | 🟡 Medium | Scope all CSS to page numbers |
| Toggle complexity | 🟡 Medium | 🟢 Low | Simple implementation first |

### Overall Risk: 🟢 **LOW**

---

## Success Criteria

### Quantitative

- ✅ All 260 comparable fields in registry
- ✅ 0 console errors when loading preview
- ✅ 100% page render success (7/7 pages)
- ✅ 100% test data coverage
- ✅ <2s preview generation time

### Qualitative

- ✅ 95%+ visual match to reference PDF
- ✅ Intuitive toggle functionality
- ✅ Maintainable code (new devs can add pages)
- ✅ Complete documentation

---

## Decision Matrix

### Should We Proceed?

| Factor | Score | Weight | Weighted |
|--------|-------|--------|----------|
| Technical feasibility | 10/10 | 30% | 3.0 |
| Risk level | 9/10 | 25% | 2.25 |
| Value delivered | 9/10 | 25% | 2.25 |
| Effort required | 7/10 | 20% | 1.4 |
| **TOTAL** | | | **8.9/10** |

### Recommendation: ✅ **PROCEED WITH PHASE 1**

**Justification:**
- High feasibility (no architectural changes)
- Low risk (no breaking changes)
- High value (perfect formatting + toggle)
- Reasonable effort (1 week for proof of concept)
- Clear exit point (can stop after Phase 1)

---

## Next Session Starting Point

### Immediate Actions (Session 1)

1. **Create branch:** `feature/comparable-fields-integration`
2. **Start with Comp1:** Add 50 field definitions
3. **Add test data:** Comp1 values
4. **Test load button:** Verify fields populate
5. **Commit:** `feat(fields): add Comparable 1 fields (50)`

### First File to Edit

```bash
/Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/schema/fieldRegistry.ts
```

### First Lines to Add

```typescript
// Comparable 1 - Basic Info
{ id: 'comp1-name', storeId: 'comp1-name', label: 'Comparable 1 Name', section: 'sales', subsection: 'comp1', type: 'text', inputSource: 'user-input', required: true },
{ id: 'comp1-address', storeId: 'comp1-address', label: 'Comparable 1 Address', section: 'sales', subsection: 'comp1', type: 'text', inputSource: 'user-input', required: true },
{ id: 'comp1-city', storeId: 'comp1-city', label: 'Comparable 1 City', section: 'sales', subsection: 'comp1', type: 'text', inputSource: 'user-input', required: true },
// ... 47 more
```

---

## Quick Reference

### Key File Paths

```
# Core files to modify
/src/features/report-builder/schema/fieldRegistry.ts
/src/features/report-builder/data/northBattlefordTestData-REAL.ts
/src/features/report-builder/templates/reportHtmlTemplate.ts
/src/features/report-builder/components/PreviewPanel/PreviewPanel.tsx

# Reference files
/docs/15-Contract-review/1-Formatting & Report/Templates & Guides/template-comparable-page.html
/docs/15-Contract-review/REPORT-Preview-Architecture-Analysis.md (this analysis)
```

### Common Commands

```bash
# Start dev server
cd /Users/bencrowe/Development/APR-Dashboard-v3
npm run dev

# Type check
npm run type-check

# Create branch
git checkout -b feature/comparable-fields-integration

# Commit pattern
git add <file>
git commit -m "feat(scope): description"
```

### Field ID Conversion

```javascript
// Template → System
'{{Comp1_Address}}'     → 'comp1-address'
'{{Comp1_SaleDate}}'    → 'comp1-sale-date'
'{{Comp1_PricePerUnit}}' → 'comp1-price-per-unit'

// Algorithm: PascalCase_Underscore → kebab-case
```

---

## Conclusion

**Status:** ✅ Ready to proceed with Phase 1 integration

**Confidence:** 🟢 High (9/10)

**Blocking Issues:** None

**Recommended Start Date:** Next available session

**Estimated Completion (Phase 1):** 5 working days

---

**For detailed analysis, see:** `REPORT-Preview-Architecture-Analysis.md`

**For questions or updates, contact:** Project maintainer

**Document Version:** 1.0
**Last Updated:** December 17, 2025
