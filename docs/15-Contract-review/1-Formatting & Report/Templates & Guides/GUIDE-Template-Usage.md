# Template Usage Guide

**Last Updated:** December 17, 2025
**Purpose:** Best practices for using page templates and avoiding common issues

---

## 📋 Available Templates

### 1. template-comparable-page.html
**Use for:** Comparable property detail pages (Pages 54-58)

**Structure:**
- 2-column layout
- Left: Tables (Sale Info, Property Details, Income Analysis, Unit Mix)
- Right: Photo, map, address, remarks
- Ultra-compact spacing (7-8pt font, 2-4px padding)

**Field Pattern:** `{{Comp#_FieldName}}` where # = comparable number (1-5)

**Example Pages:** 54, 55, 56, 57, 58

---

### 2. template-map-page.html
**Use for:** Location map pages showing multiple properties

**Structure:**
- Full-width map display
- Markers for all comparable locations
- Legend/key for property identification

**Example Pages:** 53

---

## 🎯 Template Application Workflow

### Step 1: Verify Page Design
1. Open SVG files for the page (North Battleford and Binscarth)
2. Compare same page numbers to identify:
   - Dynamic content (changes between properties) → needs field IDs
   - Static content (same across properties) → plain text
3. Confirm which template pattern applies

### Step 2: Apply Template
1. Copy template HTML structure
2. Replace field IDs with correct numbering (Comp1, Comp2, etc.)
3. Update data-sample attributes with actual sample data
4. Apply page-specific CSS scoping

### Step 3: Test & Verify
1. Open PREVIEW-Master.html in browser
2. Navigate to the page using "Go to Page" input
3. Toggle between field IDs and sample data
4. **Hard refresh browser (Cmd+Shift+R)** to clear cache
5. Verify no overflow past page boundaries

---

## ⚠️ Common Issues & Solutions

### Issue 1: Page Overflow When Toggle ON

**Symptoms:**
- Content extends past page break
- Text wrapping in table columns
- Excessive whitespace between elements

**Root Causes:**
- Padding/margin values too large
- Column widths not optimized
- Gap values between flex items too wide
- Photo/image dimensions too large

**Solutions:**
```css
/* Reduce cell padding */
table td {
  padding: 2px 4px; /* Instead of 4px 6px or larger */
}

/* Fix column widths to prevent wrapping */
td.label-col {
  width: 160px; /* Fixed width, not min-width */
  padding-right: 8px; /* Reduce gap to next column */
}

td:nth-child(2) {
  min-width: 200px; /* Wider data column */
}

/* Reduce flex gaps */
.flex-container {
  gap: 10px; /* Instead of 20px */
}

/* Optimize image sizes */
.property-photo {
  width: 280px; /* Instead of 300px */
  height: 190px; /* Instead of 200px */
}

/* Tighten all margins */
h1, h2, h3 {
  margin-bottom: 10px; /* Instead of 20px */
}

p {
  line-height: 1.4; /* Instead of 1.6 or higher */
}
```

**Prevention:**
- Start with minimal spacing values
- Test with toggle ON (sample data is usually longer than field IDs)
- Measure total page height before committing

---

### Issue 2: Browser Cache Showing Old Pages

**Symptoms:**
- Changes not visible after editing HTML
- Seeing old page designs
- Toggle panel appears different than expected

**Root Cause:**
Browser caching previous version of HTML file

**Solutions:**

**Method 1: Hard Refresh**
```
Mac: Cmd + Shift + R
Windows: Ctrl + Shift + R
Linux: Ctrl + Shift + R
```

**Method 2: Clear Cache**
1. Open Developer Tools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

**Method 3: Incognito/Private Window**
- Opens with no cache
- Good for testing clean state

**Prevention:**
- Always hard refresh after making changes
- Use incognito window for testing
- Add cache-busting query parameter: `?v=timestamp`

---

### Issue 3: Wrong File Open in Browser

**Symptoms:**
- Only seeing 3 pages (e.g., 54, 55, 56)
- Different toggle design
- Missing page navigation controls

**Root Cause:**
Opening a partial HTML file instead of PREVIEW-Master.html

**Common Wrong Files:**
- `Page-42-46.html`
- `Page-47-51.html`
- `pages-57-61-insert.html`
- `TEMP-Preview-35-40.html`

**Solution:**
1. Check browser address bar for exact filename
2. Confirm you're opening: `PREVIEW-Master.html`
3. Full path should be:
```
file:///Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/
1-Formatting%20&%20Report/REPORT%20Pg%20Img/doc-page-html/
doc-pages-html-formatted/PREVIEW-Master.html
```

**Prevention:**
- Bookmark the correct file in browser
- Use `open` command from terminal
- Close other preview files to avoid confusion

---

## 📐 Template Organization Best Practices

### File Naming Convention
```
template-[purpose]-page.html

Examples:
✅ template-comparable-page.html
✅ template-map-page.html
✅ template-valuation-table.html

❌ temp-page.html (not descriptive)
❌ page-template.html (too generic)
❌ comparable.html (missing "template" prefix)
```

### Storage Location
```
/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/
└── 1-Formatting & Report/
    └── Templates/
        ├── GUIDE-Template-Usage.md (this file)
        ├── template-comparable-page.html
        ├── template-map-page.html
        └── [future templates...]
```

**Never store templates in:**
- `/tmp/` - Gets cleared on reboot
- Project root - Gets cluttered
- Random subdirectories - Hard to find

### Template Documentation
Each template should have:
1. **Comment header** explaining purpose and usage
2. **Field ID patterns** clearly marked
3. **CSS scoping** examples included
4. **Sample data** in data-sample attributes

Example template header:
```html
<!--
  TEMPLATE: Comparable Property Page (2-Column Layout)

  PURPOSE: Detail page for comparable property analysis
  USED ON: Pages 54-58 (one per comparable)

  FIELD PATTERN: {{Comp#_FieldName}} where # = 1-5

  STRUCTURE:
  - Left: Tables (Sale Info, Property Details, Income, Unit Mix)
  - Right: Photo, Map, Address, Remarks

  CSS SPACING: Ultra-compact (7-8pt font, 2-4px padding)

  CREATED: Dec 17, 2025
  LAST UPDATED: Dec 17, 2025
-->
```

---

## 🔧 CSS Scoping Best Practices

### Always Scope Styles to Specific Pages
```css
/* ✅ GOOD - Scoped to page */
.page-sheet[data-page-num="Page 54"] table td {
  padding: 2px 4px;
}

/* ❌ BAD - Affects all pages */
table td {
  padding: 2px 4px;
}
```

### Use Specific Selectors
```css
/* ✅ GOOD - Very specific */
.page-sheet[data-page-num="Page 54"] .comp-table-compact td.label-col {
  width: 160px;
}

/* ❌ BAD - Too generic */
.label-col {
  width: 160px;
}
```

### Group Related Page Styles
```css
/* When multiple pages share same styling */
.page-sheet[data-page-num="Page 54"] table,
.page-sheet[data-page-num="Page 55"] table,
.page-sheet[data-page-num="Page 56"] table {
  font-size: 7pt;
}
```

---

## ✅ Pre-Commit Checklist

Before committing template changes:

- [ ] Template file has descriptive name
- [ ] Template stored in Templates folder
- [ ] Comment header explains purpose and usage
- [ ] Field IDs follow naming convention
- [ ] CSS is properly scoped to page numbers
- [ ] Tested with toggle ON (sample data displayed)
- [ ] Tested with toggle OFF (field IDs displayed)
- [ ] No overflow past page boundaries
- [ ] Hard refreshed browser to verify
- [ ] Git commit message describes changes

---

## 🎓 Lessons Learned

### SVG is Source of Truth
When HTML and SVG designs conflict, SVG shows the correct design. Restructure HTML to match SVG, not the other way around.

### Extract Templates AFTER Verification
Don't create templates from unverified pages. First verify a page is correct, THEN extract it as a template.

### Spacing Compounds Quickly
Small spacing values (4px → 8px) multiply across many elements. Always start minimal and add only if needed.

### Test with Real Data
Toggle ON shows sample data, which is often longer than field IDs. Always test overflow with toggle ON.

---

## 📞 Getting Help

**If templates aren't working:**
1. Check browser console for errors (F12)
2. Verify field IDs exist in field registry
3. Confirm CSS scoping is correct
4. Compare against working example (Page 54)

**If pages overflow:**
1. Measure current spacing values
2. Reduce in this order: margins → padding → gaps → font size
3. Test after each reduction
4. Document what worked in git commit

**If cache issues persist:**
1. Close all browser windows
2. Clear browser cache completely
3. Reopen file in fresh incognito window
4. If still broken, check file path in address bar

---

**End of Guide**

**For questions or improvements to this guide, update this file and commit changes.**
