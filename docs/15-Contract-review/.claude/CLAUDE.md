# APR Report Builder - Agent Context Guide

**Project:** APR Dashboard V4 - Contract Review Report Builder
**Working Directory:** `/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review`
**Status:** Pages 1-77 COMPLETE (100%), Field Registry Integration IN PROGRESS

---

## 🎯 Current Project State

### What's Complete ✅
- **77/77 core pages** populated in `reportPageTemplates.ts`
- **Page rendering functions** with scoped CSS and dynamic field mapping
- **Test data** (North Battleford Apartments - VAL251012)
- **Page dimensions** standardized (816px × 1056px, US Letter at 96 DPI)
- **Git commits** with clear incremental history

### What's In Progress 🔄
- **Field Registry Integration** - 40+ fields need adding to fieldRegistry.ts
- **Pages 78-79** - Appraiser Qualifications and Back Cover (optional)
- **Testing** - Full report rendering in browser
- **Valcre Integration** - Connect templates to live Valcre API data

### Critical Path to Completion 🎯
1. Add missing fields to field registry
2. Test full report generation
3. Validate against reference PDF
4. Connect to live Valcre data

---

## 📋 Vibe Coding Workflow (FOLLOW THIS FOR ALL TASKS)

### Before Writing ANY Code:

1. **EXPLORE** - Read relevant files WITHOUT writing code
2. **PLAN** - Use "think hard" to design approach
3. **CONFIRM** - Wait for user approval before implementing
4. **BUILD** - Implement incrementally with small commits
5. **REFLECT** - Update this file if new patterns emerge

### Development Pattern:

✅ **TDD Preferred** - Write tests first when possible
✅ **Small Commits** - Commit every logical unit of work (one field, one function, one fix)
✅ **Scoped CSS** - Use `.page-XX` prefix to prevent style conflicts
✅ **Field Validation** - Every field must exist in fieldRegistry before use

### Incremental Steps (Checkpoint Each):
1. ✅ Understand requirement (explore files)
2. ✅ Plan approach (think hard)
3. ✅ Get approval (confirm with user)
4. ✅ Write tests if applicable (commit)
5. ✅ Implement feature (commit each logical piece)
6. ✅ Verify works (test in browser)
7. ✅ Update documentation (this file if needed)

---

## 🗂️ Key Files & Their Roles

### Core Template System
```bash
# Page render functions (77 pages)
src/features/report-builder/templates/reportPageTemplates.ts

# Field registry (master list of all fields)
src/features/report-builder/data/fieldRegistry.ts

# Test data for North Battleford property
src/features/report-builder/data/northBattlefordTestData-REAL.ts

# Field mapping between UI and Valcre API
master-field-mapping-consolidated.json
```

### Source Reference
```bash
# Original HTML pages to reference for styling
docs/15-Contract-review/North Battleford Apt -Report-content extracted copy/REPORT Pg Img/
docs/15-Contract-review/1-Formatting & Report/html-pages/

# Original PDF for visual validation
docs/15-Contract-review/North Battleford Apt -Report-content extracted copy/
```

### Session Context
```bash
# Current handoff state
docs/15-Contract-review/1-Formatting & Report/-passover-sessions/-Handoff-25.12.13.md

# Historical sessions (read for context)
docs/15-Contract-review/-passover-sessions/
```

---

## 🚨 CRITICAL RULES (DO NOT VIOLATE)

### Files You MUST NOT Modify Without Explicit Approval:
❌ **fieldRegistry.ts** - Contains all field definitions
❌ **reportBuilderStore.ts** - State management
❌ **workbookFieldMapping.ts** - Valcre field mapping
❌ **Any file outside `/docs/15-Contract-review/`** - This is a scoped project

### Code Pattern YOU MUST Follow:

**Page Render Function Template:**
```typescript
export function renderPageXX(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-XX" style="width: 816px; height: 1056px; padding: 54px; ...">
      <style>
        /* ALWAYS scope CSS with .page-XX prefix */
        .page-XX h1 { ... }
        .page-XX table { ... }
      </style>

      <!-- Use getFieldValue() for ALL dynamic data -->
      <h1>${getFieldValue(sections, 'property-name')}</h1>

      <!-- NEVER hardcode values unless they are true constants -->
    </div>
  `;
}
```

### Git Commit Pattern:
```bash
# GOOD commits (atomic, descriptive)
git commit -m "feat(page-61): add direct comparison approach table"
git commit -m "fix(page-70): add missing PAGE_RENDERERS entry"
git commit -m "refactor(page-45): scope CSS to prevent conflicts"

# BAD commits (avoid these)
git commit -m "updates"
git commit -m "fix stuff"
git commit -m "pages 61-77 done" (too many changes in one commit)
```

---

## 🔍 Common Commands

### Development
```bash
# Start dev server (if running full app)
cd /Users/bencrowe/Development/APR-Dashboard-v3
npm run dev

# Run tests (if test suite exists)
npm test

# Type check
npm run type-check
```

### File Navigation
```bash
# View template file
cat src/features/report-builder/templates/reportPageTemplates.ts | grep "renderPage"

# Find field usage
grep -r "field-name" src/features/report-builder/

# Check field registry
grep "field-name" src/features/report-builder/data/fieldRegistry.ts
```

### Git Workflow
```bash
# Check status
git status

# View recent commits
git log --oneline -10

# View diff before committing
git diff src/features/report-builder/templates/reportPageTemplates.ts

# Commit pattern
git add <specific-file>
git commit -m "feat(scope): description"
```

---

## 📊 Field Registry Integration Guide

### Missing Fields (FROM HANDOFF DOC)

**Priority 1: Site Fields (Used in Pages 16-30)**
```typescript
// Add to fieldRegistry.ts:
'site-corner': { id: 'site-corner', label: 'Site Corner', type: 'text', category: 'site' },
'site-grade': { id: 'site-grade', label: 'Site Grade', type: 'select', category: 'site', options: ['Level', 'Sloping', 'Rolling'] },
'site-quality': { id: 'site-quality', label: 'Site Quality', type: 'select', category: 'site', options: ['Good', 'Average', 'Fair'] },
'usable-site-sqft': { id: 'usable-site-sqft', label: 'Usable Site (sq.ft)', type: 'number', category: 'site' },
'usable-site-acres': { id: 'usable-site-acres', label: 'Usable Site (acres)', type: 'number', category: 'site' },
'adjacent-north': { id: 'adjacent-north', label: 'Adjacent North', type: 'text', category: 'site' },
'adjacent-south': { id: 'adjacent-south', label: 'Adjacent South', type: 'text', category: 'site' },
'adjacent-east': { id: 'adjacent-east', label: 'Adjacent East', type: 'text', category: 'site' },
'adjacent-west': { id: 'adjacent-west', label: 'Adjacent West', type: 'text', category: 'site' },
```

**Priority 2: Frontage/Traffic Fields (Pages 16-30)**
```typescript
'frontage-street-1': { id: 'frontage-street-1', label: 'Frontage Street 1', type: 'text', category: 'site' },
'frontage-street-2': { id: 'frontage-street-2', label: 'Frontage Street 2', type: 'text', category: 'site' },
'frontage-1-distance': { id: 'frontage-1-distance', label: 'Frontage 1 Distance (ft)', type: 'number', category: 'site' },
'frontage-2-distance': { id: 'frontage-2-distance', label: 'Frontage 2 Distance (ft)', type: 'number', category: 'site' },
'street-1-type': { id: 'street-1-type', label: 'Street 1 Type', type: 'select', category: 'site', options: ['Paved', 'Gravel', 'Dirt'] },
'street-2-type': { id: 'street-2-type', label: 'Street 2 Type', type: 'select', category: 'site', options: ['Paved', 'Gravel', 'Dirt'] },
'street-1-lanes': { id: 'street-1-lanes', label: 'Street 1 Lanes', type: 'number', category: 'site' },
'street-2-lanes': { id: 'street-2-lanes', label: 'Street 2 Lanes', type: 'number', category: 'site' },
'traffic-count-1': { id: 'traffic-count-1', label: 'Traffic Count 1', type: 'number', category: 'site' },
'traffic-count-2': { id: 'traffic-count-2', label: 'Traffic Count 2', type: 'number', category: 'site' },
'traffic-date': { id: 'traffic-date', label: 'Traffic Count Date', type: 'date', category: 'site' },
'traffic-source': { id: 'traffic-source', label: 'Traffic Count Source', type: 'text', category: 'site' },
```

**Priority 3: Inspection Fields (Pages 16-30)**
```typescript
'inspection-appraiser-1': { id: 'inspection-appraiser-1', label: 'Appraiser 1', type: 'text', category: 'inspection' },
'inspection-appraiser-2': { id: 'inspection-appraiser-2', label: 'Appraiser 2', type: 'text', category: 'inspection' },
'inspection-date-1': { id: 'inspection-date-1', label: 'Inspection Date 1', type: 'date', category: 'inspection' },
'inspection-date-2': { id: 'inspection-date-2', label: 'Inspection Date 2', type: 'date', category: 'inspection' },
'inspection-role-1': { id: 'inspection-role-1', label: 'Inspector 1 Role', type: 'text', category: 'inspection' },
'inspection-role-2': { id: 'inspection-role-2', label: 'Inspector 2 Role', type: 'text', category: 'inspection' },
'inspection-extent': { id: 'inspection-extent', label: 'Inspection Extent', type: 'select', category: 'inspection', options: ['Full', 'Partial', 'External Only'] },
```

**Priority 4: Zoning Fields (Pages 16-30)**
```typescript
'zoning-district-type': { id: 'zoning-district-type', label: 'Zoning District Type', type: 'text', category: 'zoning' },
'zoning-permitted-uses': { id: 'zoning-permitted-uses', label: 'Permitted Uses', type: 'textarea', category: 'zoning' },
'conforming-use': { id: 'conforming-use', label: 'Conforming Use', type: 'select', category: 'zoning', options: ['Yes', 'No', 'Non-Conforming'] },
'conforming-lot': { id: 'conforming-lot', label: 'Conforming Lot', type: 'select', category: 'zoning', options: ['Yes', 'No'] },
'zoning-conclusion': { id: 'zoning-conclusion', label: 'Zoning Conclusion', type: 'textarea', category: 'zoning' },
```

**Priority 5: Other Fields (Various Pages)**
```typescript
'exposure-visibility': { id: 'exposure-visibility', label: 'Exposure/Visibility', type: 'select', category: 'site', options: ['Excellent', 'Good', 'Average', 'Fair', 'Poor'] },
'easements-note': { id: 'easements-note', label: 'Easements Note', type: 'textarea', category: 'site' },
'soils-note': { id: 'soils-note', label: 'Soils Note', type: 'textarea', category: 'site' },
'hazardous-waste-note': { id: 'hazardous-waste-note', label: 'Hazardous Waste Note', type: 'textarea', category: 'site' },
'site-rating': { id: 'site-rating', label: 'Site Rating', type: 'select', category: 'site', options: ['Excellent', 'Good', 'Average', 'Fair', 'Poor'] },
'site-conclusion': { id: 'site-conclusion', label: 'Site Conclusion', type: 'textarea', category: 'site' },
'extraordinary-assumptions': { id: 'extraordinary-assumptions', label: 'Extraordinary Assumptions', type: 'textarea', category: 'certification' },
'extraordinary-limiting-conditions': { id: 'extraordinary-limiting-conditions', label: 'Extraordinary Limiting Conditions', type: 'textarea', category: 'certification' },
```

### Field Addition Workflow (VIBE CODING PATTERN):

**Step 1: EXPLORE**
```bash
# Read current fieldRegistry.ts to understand structure
cat src/features/report-builder/data/fieldRegistry.ts | grep "category:" | sort | uniq

# Check which fields are already defined
grep "'site-corner'" src/features/report-builder/data/fieldRegistry.ts
```

**Step 2: PLAN (Think Hard)**
```
Think about:
- Which category does this field belong to? (site, inspection, zoning, etc.)
- What type? (text, number, date, select, textarea)
- Does it need options array? (for select/radio types)
- Is there validation needed? (min/max for numbers, pattern for text)
- Where is it used in the template? (verify with grep)
```

**Step 3: BUILD (Incremental Commits)**
```typescript
// Add ONE field at a time, commit
'site-corner': {
  id: 'site-corner',
  label: 'Site Corner',
  type: 'text',
  category: 'site'
},

// Commit:
git add src/features/report-builder/data/fieldRegistry.ts
git commit -m "feat(fields): add site-corner to field registry"

// Add NEXT field, commit again
'site-grade': {
  id: 'site-grade',
  label: 'Site Grade',
  type: 'select',
  category: 'site',
  options: ['Level', 'Sloping', 'Rolling']
},

// Commit:
git commit -m "feat(fields): add site-grade with select options"
```

**Step 4: VERIFY**
```bash
# Check field was added correctly
grep "'site-corner'" src/features/report-builder/data/fieldRegistry.ts

# Verify no syntax errors (type check)
npm run type-check

# Test in browser if possible
```

**Step 5: REFLECT**
```
After adding all fields in a category:
- Did any patterns emerge?
- Should we batch similar fields differently?
- Update this CLAUDE.md if new best practices discovered
```

---

## 🧪 Testing Strategy

### Manual Testing Checklist
- [ ] Load `/mock-builder` in browser
- [ ] Click "Load Test Data" button
- [ ] Verify all 77 pages render without errors
- [ ] Check console for missing field warnings
- [ ] Validate page dimensions (816x1056px)
- [ ] Spot-check styling against reference PDF
- [ ] Test field value updates in edit panel
- [ ] Verify preview panel syncs with edits

### Automated Testing (Future)
- [ ] Unit tests for each renderPageXX function
- [ ] Integration tests for field mapping
- [ ] Visual regression tests with Puppeteer
- [ ] Field registry validation tests

---

## 📖 Code Style Guide

### TypeScript
```typescript
// GOOD: Type-safe field access
const propertyName = getFieldValue(sections, 'property-name');
const assessedValue = getFieldValue(sections, 'assessed-value');

// BAD: Hardcoded values
const propertyName = "123 Main St"; // ❌ Don't do this

// GOOD: Conditional rendering
${assessedValue ? `<p>Value: ${assessedValue}</p>` : ''}

// BAD: Unsafe rendering
<p>Value: ${assessedValue}</p> // ❌ Shows "undefined" if missing
```

### CSS
```css
/* GOOD: Scoped to page */
.page-45 h1 {
  font-size: 18px;
  font-weight: bold;
}

/* BAD: Global selectors */
h1 {
  font-size: 18px; /* ❌ Affects all pages */
}

/* GOOD: Specific selectors */
.page-45 .income-table td {
  padding: 8px;
}

/* BAD: Generic classes */
.table td {
  padding: 8px; /* ❌ Too broad */
}
```

### HTML Structure
```html
<!-- GOOD: Semantic, accessible -->
<table class="income-summary" role="table">
  <thead>
    <tr>
      <th scope="col">Category</th>
      <th scope="col">Amount</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>${getFieldValue(sections, 'category-1')}</td>
      <td>${getFieldValue(sections, 'amount-1')}</td>
    </tr>
  </tbody>
</table>

<!-- BAD: Divs for everything -->
<div class="table">
  <div class="row">
    <div>${value1}</div>
    <div>${value2}</div>
  </div>
</div>
```

---

## 🎯 Wrap-Up Roadmap (Next 3-5 Sessions)

### Session 1: Field Registry Completion (Highest Priority)
**Goal:** Add all 40+ missing fields to fieldRegistry.ts

**Tasks:**
- [ ] Add Priority 1 fields (site fields) - 9 fields
- [ ] Add Priority 2 fields (frontage/traffic) - 12 fields
- [ ] Add Priority 3 fields (inspection) - 7 fields
- [ ] Add Priority 4 fields (zoning) - 5 fields
- [ ] Add Priority 5 fields (other) - 8 fields
- [ ] Commit each field individually (41 commits)
- [ ] Run type check after each batch
- [ ] Update handoff doc with completion status

**Pattern:** Use vibe coding Explore→Plan→Build→Reflect for each batch

### Session 2: Browser Testing & Validation
**Goal:** Verify all 77 pages render correctly in browser

**Tasks:**
- [ ] Load `/mock-builder` in browser
- [ ] Screenshot each page section
- [ ] Compare to reference PDF
- [ ] Document any styling discrepancies
- [ ] Fix CSS issues (scoped to specific pages)
- [ ] Commit fixes incrementally
- [ ] Update handoff with test results

### Session 3: Valcre Integration Prep
**Goal:** Map template fields to Valcre API data structure

**Tasks:**
- [ ] Review `master-field-mapping-consolidated.json`
- [ ] Identify unmapped fields in templates
- [ ] Add mappings for new fields (40+ from registry)
- [ ] Test with mock Valcre data
- [ ] Document integration points
- [ ] Commit mapping updates

### Session 4: Pages 78-79 (Optional)
**Goal:** Complete final 2 pages if needed

**Tasks:**
- [ ] Decide if pages needed (check with user)
- [ ] Extract HTML from reference PDF if yes
- [ ] Create renderPage78 and renderPage79
- [ ] Add to PAGE_RENDERERS mapping
- [ ] Test in browser
- [ ] Commit

### Session 5: Final Testing & Documentation
**Goal:** Production-ready report builder

**Tasks:**
- [ ] Full report generation test (1-77 or 1-79)
- [ ] Performance testing (large reports)
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Update README with usage instructions
- [ ] Create deployment checklist
- [ ] Final commit and tag release

---

## 🔄 Session Handoff Protocol

At end of each session, agent MUST:

1. **Update handoff file:**
   ```bash
   # Update: docs/15-Contract-review/1-Formatting & Report/-passover-sessions/-Handoff-[DATE].md
   ```

2. **Include:**
   - What was completed (with commit hashes)
   - What's in progress
   - Blockers or questions
   - Next session starting point

3. **Commit handoff:**
   ```bash
   git add docs/15-Contract-review/1-Formatting\ &\ Report/-passover-sessions/-Handoff-*.md
   git commit -m "docs: session handoff for [DATE]"
   ```

4. **Update this file if:**
   - New patterns discovered
   - Common issues found
   - Workflow improvements needed

---

## 💡 Learnings & Patterns

### What's Working Well ✅
- **Small commits** - Easy to review and rollback if needed
- **Scoped CSS** - No style conflicts between pages
- **getFieldValue()** - Clean separation between template and data
- **Page dimensions** - Consistent sizing makes PDF export easier
- **Batch processing** - Pages 1-15, 16-30, etc. manageable chunks

### Common Pitfalls ⚠️
- **Forgetting to add field to registry** - Always check fieldRegistry.ts first
- **Global CSS selectors** - Always scope with `.page-XX`
- **Hardcoded values** - Use getFieldValue() for ALL dynamic data
- **Large commits** - Break work into smaller logical pieces
- **Missing PAGE_RENDERERS entry** - Remember to register each page function

### Best Practices Discovered 🌟
- **Read before write** - Always explore files before making changes
- **Test after each batch** - Don't wait until all 77 pages done
- **Keep reference handy** - Original PDF guides styling decisions
- **Document field gaps** - Maintain list of missing fields
- **Use TypeScript** - Catches errors before runtime

---

## 📞 Need Help?

### Common Issues & Solutions

**Issue:** Field not rendering in template
**Solution:**
1. Check if field exists in fieldRegistry.ts
2. Verify field ID matches exactly (case-sensitive)
3. Check if field has value in test data

**Issue:** CSS not applying
**Solution:**
1. Verify scoped selector (`.page-XX`)
2. Check for specificity conflicts
3. Inspect in browser DevTools

**Issue:** Type errors
**Solution:**
1. Run `npm run type-check`
2. Read error message carefully
3. Verify function signatures match

**Issue:** Git conflicts
**Solution:**
1. Don't modify files outside scope
2. Pull before starting work
3. Commit frequently to avoid large merges

---

**Last Updated:** December 13, 2025
**Next Review:** After Session 1 (Field Registry Completion)
