# Agent Guide: Page 55 Comparable Layout Fix

**Date Created:** December 17, 2025
**Issue:** Page 55 (and other comparable pages) extends past page boundary into footer when data is loaded
**Root Cause:** Incorrect layout structure - using vertical stack instead of efficient 2-column layout from reference

---

## 🚨 The Problem

**Current Layout (WRONG):**
```
┌─────────────────────────────────────────┐
│ Header: "Valuation & Conclusions"      │
│ Subheader: "Comparable 2"               │
├─────────────────────────────────────────┤
│ ┌──────────┐  ┌───────────────────┐   │
│ │  Image   │  │ Sale Info Table   │   │ ← Flexbox row
│ │ 300x200  │  │                   │   │
│ └──────────┘  └───────────────────┘   │
├─────────────────────────────────────────┤
│    Property Details Table               │ ← Full width
│    (20+ rows of data)                   │
├─────────────────────────────────────────┤
│    Income Analysis Table                │ ← Full width
├─────────────────────────────────────────┤
│    Remarks: Long text paragraph...      │ ← Full width
├─────────────────────────────────────────┤
│ FOOTER                                  │
└─────────────────────────────────────────┘
```

**Problem:** Content height = ~1060px, Available space = 822px → **Overflows by 238px into footer!**

---

## ✅ Reference Layout (CORRECT)

**From Page-55.png reference image:**
```
┌─────────────────────────────────────────────────────┐
│ Header: "Valuation & Conclusions"                  │
│ Subheader: "College View Apartments - Comparable 2"│
├────────────────────────┬────────────────────────────┤
│ LEFT COLUMN (50%)      │ RIGHT COLUMN (50%)        │
│                        │                            │
│ ┌────────────────────┐ │ ┌────────────────────────┐│
│ │ Sale Information   │ │ │   Property Photo       ││
│ │ • Buyer            │ │ │   (large image)        ││
│ │ • Seller           │ │ │                        ││
│ │ • Sale Date        │ │ └────────────────────────┘│
│ │ • Sale Price       │ │                            │
│ │ • Analysis Price   │ │ ┌────────────────────────┐│
│ └────────────────────┘ │ │   Location Map         ││
│                        │ │   (small map)          ││
│ ┌────────────────────┐ │ └────────────────────────┘│
│ │ Income Analysis    │ │                            │
│ │ • Occupancy        │ │ Remarks:                   │
│ │ • NOI              │ │ Macro Properties Toronto   │
│ │ • Cap Rate         │ │ sold this 143-unit        │
│ └────────────────────┘ │ portfolio to Epiphany     │
│                        │ Group for $14,000,000...  │
│ ┌────────────────────┐ │                            │
│ │ Property Details   │ │                            │
│ │ • Type             │ │                            │
│ │ • Address          │ │                            │
│ │ • Rent Type        │ │                            │
│ │ • GBA              │ │                            │
│ │ • NRA              │ │                            │
│ │ • Units            │ │                            │
│ │ • Year Built       │ │                            │
│ │ • Zoning           │ │                            │
│ │ • Amenities        │ │                            │
│ └────────────────────┘ │                            │
│                        │                            │
│ ┌────────────────────┐ │                            │
│ │ Unit Mix           │ │                            │
│ │ Table              │ │                            │
│ └────────────────────┘ │                            │
├────────────────────────┴────────────────────────────┤
│ FOOTER (fits comfortably with space above)          │
└─────────────────────────────────────────────────────┘
```

**Key differences:**
1. **2-column layout** instead of vertical stack
2. **Left column:** ALL data tables (compact, narrow format)
3. **Right column:** Image at top, map below, remarks at bottom
4. **Much smaller fonts** (7-8pt instead of 10pt)
5. **Compact spacing** (minimal margins/padding)
6. **All content fits** comfortably within 822px available height

---

## 📐 Page Dimensions & Available Space

```css
.page-sheet {
  height: 11in;              /* = 1056px at 96 DPI */
  padding: 0.75in;           /* = 54px top */
  padding-bottom: 180px;     /* Reserve space for footer */
}

.page-footer {
  position: absolute;
  bottom: 0.75in;            /* = 54px from bottom */
  height: ~126px;            /* Footer actual height */
}
```

**Available content height:**
- Total page: 1056px
- Top padding: -54px
- Bottom padding: -180px
- **Usable space: 822px**

**Current content height estimate:**
- Header + Subheader: ~60px
- Image + Sale Info flex row: ~220px
- Property Details table: ~450px (20+ rows)
- Income Analysis table: ~150px
- Remarks paragraph: ~150px
- **Total: ~1030px → OVERFLOWS!**

**Target content height with 2-column layout:**
- Header + Subheader: ~50px
- Left column tables: ~650px (all tables stacked vertically)
- Right column: ~650px (image + map + remarks stacked)
- **Total: ~700px → FITS with 122px buffer!**

---

## 🔧 How to Fix: Step-by-Step

### Step 1: Change Layout Structure

**Current structure (delete this):**
```html
<div style="display: flex; gap: 20px;">
  <div style="flex: 0 0 300px;">Image</div>
  <div style="flex: 1;">Sale Info Table</div>
</div>
<table>Property Details (full width)</table>
<table>Income Analysis (full width)</table>
<p>Remarks (full width)</p>
```

**New structure (implement this):**
```html
<div style="display: flex; gap: 20px; margin-bottom: 20px;">

  <!-- LEFT COLUMN: ALL TABLES -->
  <div style="flex: 0 0 48%; display: flex; flex-direction: column; gap: 12px;">

    <!-- Sale Information Table -->
    <table class="comp-table-compact">
      <thead><tr><th colspan="2">Sale Information</th></tr></thead>
      <tbody>
        <tr><td>Buyer</td><td>{{Comp2_Buyer}}</td></tr>
        <tr><td>Seller</td><td>{{Comp2_Seller}}</td></tr>
        ...
      </tbody>
    </table>

    <!-- Income Analysis Table -->
    <table class="comp-table-compact">
      <thead><tr><th colspan="2">Income Analysis</th></tr></thead>
      <tbody>
        <tr><td>Occupancy</td><td>{{Comp2_Occupancy}}</td></tr>
        ...
      </tbody>
    </table>

    <!-- Property Details Table -->
    <table class="comp-table-compact">
      <thead><tr><th colspan="2">Property</th></tr></thead>
      <tbody>
        <tr><td>Type</td><td>{{Comp2_PropertyType}}</td></tr>
        <tr><td>Address</td><td>{{Comp2_Address}}</td></tr>
        ...
      </tbody>
    </table>

    <!-- Unit Mix Table (if applicable) -->
    <table class="comp-table-compact">
      <thead><tr><th>Unit Type</th><th>Units</th><th>Avg Size</th></tr></thead>
      <tbody>
        <tr><td>1 Bed / 1 Bath</td><td>45</td><td>0 SF</td></tr>
      </tbody>
    </table>

  </div>

  <!-- RIGHT COLUMN: IMAGE + MAP + REMARKS -->
  <div style="flex: 0 0 48%; display: flex; flex-direction: column; gap: 12px;">

    <!-- Property Photo -->
    <div style="width: 100%; height: 280px; background: #f0f0f0; border: 1px solid #ccc;">
      <span class="field-mapped" title="{{Comp2_Photo}}">{{Comp2_Photo}}</span>
    </div>

    <!-- Location Map -->
    <div style="width: 100%; height: 180px; background: #f0f0f0; border: 1px solid #ccc;">
      <span class="field-mapped" title="{{Comp2_Map}}">{{Comp2_Map}}</span>
    </div>

    <!-- Address Block -->
    <div style="font-size: 8pt; line-height: 1.3;">
      <strong>{{Comp2_Address}}</strong><br>
      County: {{Comp2_County}}<br>
      Submarket: {{Comp2_Submarket}}
    </div>

    <!-- Remarks -->
    <div style="font-size: 8pt; line-height: 1.4; text-align: justify;">
      <strong>Remarks:</strong><br>
      {{Comp2_Remarks}}
    </div>

  </div>

</div>
```

---

### Step 2: Add Compact Table Styling

**Add this CSS to Page 55 (and other comparable pages):**

```css
<style>
  /* Scoped to Page 55 */
  .page-sheet[data-page-num="Page 55"] .comp-table-compact {
    width: 100%;
    border-collapse: collapse;
    font-size: 7pt;  /* Very small for data density */
    margin-bottom: 0;
  }

  .page-sheet[data-page-num="Page 55"] .comp-table-compact th {
    background-color: #003B7E;
    color: white;
    font-weight: bold;
    font-size: 8pt;
    text-transform: uppercase;
    padding: 4px 6px;
    text-align: left;
  }

  .page-sheet[data-page-num="Page 55"] .comp-table-compact td {
    padding: 3px 6px;
    border: 1px solid #ddd;
    vertical-align: top;
    line-height: 1.3;
  }

  .page-sheet[data-page-num="Page 55"] .comp-table-compact td:first-child {
    background-color: #f0f0f0;
    font-weight: 600;
    width: 45%;
  }

  .page-sheet[data-page-num="Page 55"] .comp-table-compact td:last-child {
    width: 55%;
  }

  /* Highlighted rows (Sale Price, Analysis Price, Cap Rate) */
  .page-sheet[data-page-num="Page 55"] .comp-table-compact tr.highlight {
    background-color: #f0f0f0;
    font-weight: bold;
  }

  /* Column headers and content sections */
  .page-sheet[data-page-num="Page 55"] h2.Header2 {
    text-align: center;
    font-size: 11pt;
    margin-bottom: 15px;
  }
</style>
```

---

### Step 3: Reduce Font Sizes and Spacing

**Current styling (too large):**
```css
font-size: 10pt;      /* Body text */
padding: 4px 8px;     /* Table cells */
margin-bottom: 20px;  /* Section spacing */
gap: 20px;            /* Column gap */
```

**New styling (compact):**
```css
font-size: 7pt;       /* Body text for tables */
font-size: 8pt;       /* Remarks and address blocks */
padding: 3px 6px;     /* Table cells */
margin-bottom: 12px;  /* Section spacing */
gap: 12px;            /* Column gap */
line-height: 1.3;     /* Tighter line spacing */
```

---

## 📊 Content Height Calculation

**Formula:**
```
Available Height = Page Height - Top Padding - Bottom Padding (footer reserve)
                 = 1056px - 54px - 180px
                 = 822px
```

**How to measure your content:**

```javascript
// In browser console after rendering page:
const page55 = document.querySelector('[data-page-num="Page 55"]');
const footer = page55.querySelector('.page-footer');
const contentHeight = footer.offsetTop - 54; // Subtract top padding

console.log('Content height:', contentHeight);
console.log('Available space:', 822);
console.log('Overflow:', contentHeight > 822 ? (contentHeight - 822) : 'None');
```

**Target content height:** ≤ 800px (leaving 22px buffer)

---

## ⚠️ Common Mistakes to Avoid

### ❌ Mistake 1: Using Full-Width Tables
```html
<!-- DON'T DO THIS -->
<table style="width: 100%;">...</table>
<table style="width: 100%;">...</table>
```
**Why:** Stacks tables vertically, wastes horizontal space

### ❌ Mistake 2: Large Image Dimensions
```html
<!-- DON'T DO THIS -->
<div style="width: 300px; height: 200px;">Image</div>
```
**Why:** Too wide for 2-column layout, too tall compared to reference

### ❌ Mistake 3: Forgetting to Scope CSS
```css
/* DON'T DO THIS */
table.compact-table { font-size: 7pt; }
```
**Why:** Affects ALL pages, not just Page 55

**Correct:**
```css
.page-sheet[data-page-num="Page 55"] table.compact-table { font-size: 7pt; }
```

### ❌ Mistake 4: Using Large Fonts
```css
/* DON'T DO THIS */
font-size: 10pt; /* Too large for comparable pages */
```
**Why:** Reference uses 7-8pt for data density

### ❌ Mistake 5: Not Testing with Full Data
```html
<!-- DON'T TEST WITH THIS -->
<td>Short text</td>

<!-- TEST WITH REALISTIC DATA -->
<td>10910-10912 Winder Crescent, North Battleford, SK S9A 2C3</td>
```
**Why:** Overflow only shows when full addresses, remarks loaded

---

## 🎯 Validation Checklist

After implementing fixes, verify:

- [ ] **Layout is 2-column** (left: tables, right: image/map/remarks)
- [ ] **All tables in left column** use compact styling (7pt font)
- [ ] **Image dimensions** are approximately 100% width of right column, 280px height
- [ ] **Map dimensions** are approximately 100% width of right column, 180px height
- [ ] **Remarks text** uses 8pt font, justified alignment
- [ ] **Content height** ≤ 800px when measured in browser
- [ ] **No overlap with footer** (footer should have ~20px+ gap above it)
- [ ] **CSS is scoped** to `[data-page-num="Page 55"]`
- [ ] **Toggle works** - field IDs switch to data-sample values
- [ ] **Matches reference image** Page-55.png visually

---

## 📝 Template Pattern for All Comparable Pages

**Apply this pattern to:**
- Page 54: Comparable 1
- Page 55: Comparable 2 ✅ (Fix this first)
- Page 56: Comparable 3
- ... any other comparable pages

**Structure:**
```html
<div class="page-sheet" data-page-num="Page XX">
  <style>
    /* Scoped CSS for this page */
    .page-sheet[data-page-num="Page XX"] .comp-table-compact { ... }
  </style>

  <h1 class="Header1">Valuation & Conclusions</h1>
  <h2 class="Header2" style="text-align: center;">Property Name - Comparable N</h2>

  <div style="display: flex; gap: 12px; margin-bottom: 20px;">

    <!-- LEFT COLUMN: Tables -->
    <div style="flex: 0 0 48%; display: flex; flex-direction: column; gap: 12px;">
      <!-- Sale Info, Income, Property Details, Unit Mix tables -->
    </div>

    <!-- RIGHT COLUMN: Media + Remarks -->
    <div style="flex: 0 0 48%; display: flex; flex-direction: column; gap: 12px;">
      <!-- Photo, Map, Address, Remarks -->
    </div>

  </div>

  <div class="page-footer">
    <div><span class="page-num">XX</span> {{Property_Address}} | File {{File_Number}}</div>
    <div class="footer-accent"></div>
  </div>
</div>
```

---

## 🚀 Implementation Steps

1. **Read reference image** `/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/doc-page-images/Page-55.png`

2. **Read current HTML** Line 5008 in `PREVIEW-Master.html`

3. **Backup current version** (git commit before changes)

4. **Implement new 2-column layout** following template above

5. **Add scoped compact CSS** for tables and content

6. **Test in browser:**
   - Open PREVIEW-Master.html
   - Navigate to Page 55
   - Toggle field IDs off (preview mode)
   - Measure content height using browser console
   - Verify no footer overlap

7. **Adjust spacing if needed:**
   - If still overflowing: reduce `gap`, `padding`, `margin-bottom`
   - If too much space: slightly increase spacing
   - Target: ~20px gap above footer

8. **Commit changes:**
   ```bash
   git add PREVIEW-Master.html
   git commit -m "fix(page-55): implement 2-column layout to prevent footer overflow"
   ```

9. **Apply pattern to other comparable pages** (54, 56, etc.)

---

## 🔍 Debugging Tips

### If content still overflows:

1. **Inspect in browser DevTools:**
   ```javascript
   // Select the page
   const page = document.querySelector('[data-page-num="Page 55"]');

   // Find tallest element
   const children = Array.from(page.children);
   children.forEach(child => {
     console.log(child.tagName, child.offsetHeight);
   });
   ```

2. **Check table row counts:**
   - Property Details table should have ~15-18 rows
   - If more rows, consider splitting or making even more compact

3. **Reduce image heights:**
   - Photo: Try 250px instead of 280px
   - Map: Try 150px instead of 180px

4. **Tighten spacing:**
   - Reduce `gap: 12px` to `gap: 8px`
   - Reduce table `padding: 3px 6px` to `padding: 2px 4px`

5. **Use smaller fonts if necessary:**
   - Try `font-size: 6.5pt` for tables (minimum readable size)

---

**Last Updated:** December 17, 2025
**Next Review:** After Page 55 fix is verified
