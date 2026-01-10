# Consolidated Formatting Specification
## North Battleford Report - Cross-Referenced Analysis

**Date:** 2025-12-10
**Status:** Cross-Reference Complete - Ready for Implementation
**Sources:**
- Visual analysis from 14 screenshots (Marcel)
- Pixel-perfect blueprint from specialized agent

---

## 🎯 CRITICAL INSIGHT: This is NOT a Generic Document

**Both analyses agree:** This is a **custom-designed report** with:
1. **Split-Screen TOC** (blue sidebar layout)
2. **Chevron Footer Graphic** (not simple text)
3. **Blue Bar Section Dividers** inside table bodies
4. **Custom Grid Layouts** for comparable sales
5. **Specific color-coded data** (red negatives)

**If implemented as generic Word-style document → Will look unprofessional**

---

## 1. Color Palette (PRECISE - Cross-Referenced)

### Primary Colors (Both Agents Agree)
```css
--brand-navy: #003366;        /* TOC sidebar, table headers, footer graphic */
--brand-sky: #8DB4E2;         /* Light blue in chevron graphic */
--brand-red: #C00000;         /* Negative values, adjustments */
--text-black: #000000;        /* Section headers */
--text-dark-gray: #222222;    /* Body text */
--border-gray: #D0D0D0;       /* Table separators */
--bg-light-gray: #F5F5F5;     /* Subtle table row alternation */
```

### Color Usage Rules
- **Navy (#003366):** Table headers, TOC sidebar, footer, blue section dividers
- **Sky Blue (#8DB4E2):** ONLY in chevron footer graphic (accent)
- **Red (#C00000):** ANY value in parentheses OR negative numbers
- **Black (#000000):** Section headers (with underline)
- **Dark Gray (#222222):** Body text

---

## 2. Typography (Cross-Referenced with Measurements)

### Font Family
**Other Agent Spec:** Calibri or Segoe UI (Windows standard)
**My Observation:** Appears to be Arial family
**DECISION:** Use **Calibri** as primary (matches Word/professional reports), fallback to Arial

```css
font-family: Calibri, 'Segoe UI', Arial, sans-serif;
```

### Font Sizes (My Visual Measurements + Their Context)
```css
--section-header: 18-20pt;      /* "Introduction & Executive Summary" */
--subsection-header: 14-16pt;   /* "Capitalization Rate" */
--running-head: 14pt;           /* Other agent spec - header on each page */
--sub-subsection: 12-14pt;      /* "Hypothetical Conditions" */
--body-text: 10-11pt;           /* Paragraph text */
--table-header: 10-11pt;        /* UPPERCASE white text */
--table-body: 9-10pt;           /* Table data */
--small-text: 8-9pt;            /* Chart labels, captions */
```

### Font Weights & Transforms
- **Section Headers:** Bold, normal case, black, underlined
- **Subsection Headers:** Bold, normal case, **blue (#003366)**, no underline
- **Sub-subsection Headers:** Bold, normal case, blue
- **Table Headers:** Bold, **UPPERCASE**, white on navy background
- **Body Text:** Regular (400), justified alignment
- **Table Body:** Regular, left-align labels, right-align numbers

---

## 3. Page Layout & Margins (Cross-Referenced)

### Page Size
**Standard Letter:** 8.5" x 11"

### Margins (Other Agent's Precision)
```css
@page {
  size: 8.5in 11in;
  margin-top: 1.25in;    /* Accommodate running header */
  margin-bottom: 1.0in;  /* Accommodate footer graphic */
  margin-left: 0.75in;   /* Slightly tighter than my 1.0" estimate */
  margin-right: 0.75in;
}
```

**Note:** Other agent's margins (0.75" L/R, 1.25" top) are more precise than my visual estimates (1.0" all around). **Use theirs for implementation.**

### Running Header (Every Page Except Cover/TOC)
```
Format: "Section Title" (14pt, bold, normal case)
Underline: Solid blue line (border-bottom: 2px solid #003366)
Example: "Introduction & Executive Summary"
         ────────────────────────────────────── (blue line)
```

### Footer (Every Page)
**Structure:**
- **Left:** Page number (bold, small)
- **Center:** "Address | File Number" (e.g., "1101, 1121 109 St | File VAL251012-1")
- **Right:** **CHEVRON GRAPHIC** (light blue → dark blue angled stripes)

**Chevron Footer Implementation (Other Agent's Spec):**
```css
.footer-graphic {
  background: linear-gradient(115deg,
    transparent 20%,
    #8DB4E2 20%,
    #8DB4E2 50%,
    #003366 50%
  );
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}
```

---

## 4. Table Design (Consolidated Rules)

### Standard Table Structure
```
┌────────────────────────────────────────────┐
│ TABLE HEADER (Navy #003366, White Text)   │ ← UPPERCASE, Bold
├────────────────────────────────────────────┤
│ Label              │ Value               │ ← Regular text
├────────────────────────────────────────────┤
│ Another Label      │ $1,234              │ ← Right-align numbers
├────────────────────────────────────────────┤
│ SECTION DIVIDER (Navy #003366, White)     │ ← Blue bar (new insight!)
├────────────────────────────────────────────┤
│ Sub Label          │ (10%)               │ ← RED negative value
└────────────────────────────────────────────┘
```

### Table Header Row (Both Agree)
```css
thead tr {
  background-color: #003366;
  color: #FFFFFF;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 10-11pt;
  padding: 8-10px;
}
```

### Blue Bar Section Dividers (Other Agent's KEY Insight)
**Purpose:** Inside table bodies, separate major categories
**Example:** In "Direct Comparison Approach" table, rows like:
- "SALE INFORMATION" (full-width blue bar)
- "INCOME INFORMATION" (full-width blue bar)
- "PHYSICAL INFORMATION" (full-width blue bar)

```css
tr.section-divider {
  background-color: #003366;
  color: #FFFFFF;
  font-weight: bold;
  text-transform: uppercase;
}

tr.section-divider td {
  padding: 8px;
  text-align: left;
  border: none;
}
```

### Table Body Rows (My Observations)
```css
tbody tr {
  border-bottom: 1px solid #D0D0D0; /* Horizontal lines only */
}

tbody tr:nth-child(even) {
  background-color: #F5F5F5; /* Very subtle alternation */
}

tbody td {
  padding: 6-8px;
  font-size: 9-10pt;
  border-left: none;  /* NO vertical lines - minimalist */
  border-right: none;
}

/* Number alignment */
td.number {
  text-align: right;
}

/* Red negative values (Both Agree) */
td.negative,
.text-negative {
  color: #C00000;
}
```

### Table Border Style (My Observation)
```css
table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #000000; /* Thin outer border */
}

/* NO column separators (vertical lines) */
td {
  border-left: none;
  border-right: none;
}
```

---

## 5. Special Layout: Split-Screen TOC (Other Agent's Spec + My Observations)

### Page 5 Structure
```
┌─────────────┬──────────────────────────────┐
│             │                              │
│   Table     │  Introduction & Executive... │
│     of      │  Property Overview       1   │
│  Contents   │  Photographs             4   │
│             │  Maps                    9   │
│  (White)    │                              │
│  (Navy Bg)  │  Property Analysis      17   │
│             │  Location               17   │
│             │  Site Details           18   │
│             │                              │
└─────────────┴──────────────────────────────┘
  30-33%         67-70%
```

### CSS Implementation
```css
.toc-page {
  display: flex;
  min-height: 100vh;
  page-break-after: always;
}

.toc-sidebar {
  width: 30%;
  background-color: #003366;
  color: #FFFFFF;
  padding: 40px 20px;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.toc-sidebar h2 {
  font-size: 24pt;
  font-weight: bold;
  text-align: center; /* or right-aligned */
}

.toc-content {
  width: 70%;
  background-color: #FFFFFF;
  padding: 40px 30px;
}

.toc-content ul {
  list-style: none;
  padding: 0;
}

.toc-content li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.toc-content .section-title {
  font-weight: bold;
}

.toc-content .subsection-title {
  padding-left: 20px; /* Indent */
}

.toc-content .page-number {
  font-weight: normal;
}
```

---

## 6. Special Layout: Comparable Sales Grid (Other Agent's Spec)

### Page 54-55 Structure
```
┌───────────────────┬───────────────┐
│                   │               │
│  Sale Information │  [Property    │
│  Buyer: ...       │   Photo]      │
│  Seller: ...      │               │
│  Price: $...      │               │
├───────────────────┼───────────────┤
│  Property Details │  [Google Map] │
│  Type: ...        │               │
│  Units: ...       │               │
└───────────────────┴───────────────┘
│                                   │
│  Remarks: (Full width paragraph)  │
│                                   │
└───────────────────────────────────┘
```

### CSS Grid Implementation
```css
.comparable-sales-sheet {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  grid-template-rows: auto auto auto;
  gap: 16px;
  margin-bottom: 40px;
  page-break-inside: avoid;
}

.sale-info {
  grid-column: 1;
  grid-row: 1;
}

.property-photo {
  grid-column: 2;
  grid-row: 1;
}

.property-details {
  grid-column: 1;
  grid-row: 2;
}

.location-map {
  grid-column: 2;
  grid-row: 2;
  max-height: 200px;
}

.remarks {
  grid-column: 1 / -1; /* Span both columns */
  grid-row: 3;
}
```

---

## 7. Data Formatting Rules (Both Agents Agree)

### Currency
```
Format: $###,###
Example: $129,891
Alignment: Right
Negative: ($129,891) in RED
```

### Percentages
```
Format: #.##%
Example: 5.99%
Alignment: Right
Negative: (10%) in RED
```

### Conditional RED Styling (Critical Rule)
```javascript
// Any text containing parentheses OR negative numbers → RED
if (value.includes('(') || value.includes(')') || value < 0) {
  element.classList.add('text-negative');
}
```

```css
.text-negative {
  color: #C00000 !important;
}
```

---

## 8. Charts & Graphs (My Observations)

### Bar Chart Styling
```css
.chart-container {
  margin: 20px 0;
  page-break-inside: avoid;
}

.chart-title {
  font-size: 14pt;
  font-weight: bold;
  color: #003366; /* Blue titles */
  margin-bottom: 12px;
}

.chart-bar {
  fill: #003366; /* Navy bars */
}

.chart-grid {
  stroke: #D0D0D0; /* Light gray grid lines */
  stroke-width: 1px;
}

.chart-axis-label {
  font-size: 9pt;
  fill: #222222;
}
```

---

## 9. Print CSS Requirements (Critical for Gotenberg)

### Color Rendering (Both Agents Emphasize)
```css
* {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  color-adjust: exact !important;
}
```

### Page Breaks (My Research + Their Spec)
```css
/* Hard breaks */
.toc-section {
  page-break-after: always !important;
  break-after: page !important;
}

.page-separator {
  page-break-before: always !important;
  break-before: page !important;
}

/* Prevent breaks */
.section-group,
.comparable-sales-sheet,
table,
.chart-container {
  page-break-inside: avoid !important;
  break-inside: avoid !important;
}

/* Table header repetition */
thead {
  display: table-header-group;
}

tfoot {
  display: table-footer-group;
}
```

---

## 10. Implementation Priority (Consolidated Recommendation)

### Phase 1: Core Visual Elements (High Impact)
**Estimated Effort:** 4-6 hours

1. ✅ **Update Color Variables**
   - Replace all blues with #003366
   - Add sky blue #8DB4E2 for footer
   - Add red #C00000 for negatives

2. ✅ **Fix Table Headers**
   - Dark navy background (#003366)
   - White uppercase text
   - Remove vertical lines

3. ✅ **Implement Red Negative Values**
   - Auto-detect parentheses
   - Apply .text-negative class

4. ✅ **Add Blue Section Dividers in Tables**
   - Create section-divider row type
   - Style with navy background

5. ✅ **Update Typography**
   - Change to Calibri primary font
   - Adjust sizes to match spec
   - Section headers: black + underline
   - Subsection headers: blue, no underline

### Phase 2: Special Layouts (Medium Impact)
**Estimated Effort:** 3-4 hours

6. ✅ **Build Split-Screen TOC**
   - 30% navy sidebar
   - 70% white content
   - Print color adjustment

7. ✅ **Create Chevron Footer Graphic**
   - Linear gradient implementation
   - Position correctly

8. ✅ **Implement Comparable Sales Grid**
   - CSS Grid 4-area layout
   - Photo + map integration

### Phase 3: Polish & Testing (Low Impact)
**Estimated Effort:** 2-3 hours

9. ✅ **Adjust Margins**
   - Top: 1.25in
   - Bottom: 1.0in
   - Left/Right: 0.75in

10. ✅ **Add Running Headers**
    - Section title with blue underline
    - Page-specific content

11. ✅ **Test PDF Export**
    - Verify colors render
    - Check page breaks
    - Confirm table headers repeat

---

## 11. Gap Analysis vs Current Code

### Known Issues (To Verify)

Based on both analyses, current code likely has:

❌ **Wrong table header styling** (probably gray, not navy blue)
❌ **Missing blue section dividers** inside tables
❌ **Missing red negative value styling**
❌ **Wrong font** (probably not Calibri)
❌ **Missing chevron footer graphic** (probably plain text)
❌ **Wrong TOC layout** (probably standard list, not split-screen)
❌ **Section headers wrong color** (probably blue instead of black)
❌ **Subsection headers wrong** (probably black instead of blue)
❌ **Table has vertical lines** (should be minimalist, horizontal only)
❌ **Missing comparable sales grid layout**

### Next Steps

1. **Read current reportHtmlTemplate.ts print CSS section** (lines 5870-5966)
2. **Document exact current state** vs this spec
3. **Create prioritized fix list** with code examples
4. **Deploy frontend-developer agent** with specific instructions

---

## 12. Agent Deployment Recommendation

### Recommended Approach: **Single Specialist with Phased Commits**

**Agent:** `frontend-developer` or `react-specialist`

**Why Single Agent:**
- Changes are cohesive (all HTML/CSS)
- Avoids coordination overhead
- Faster iteration

**Execution Strategy:**
1. **Commit Phase 1** → Test PDF → Review
2. **Commit Phase 2** → Test PDF → Review
3. **Commit Phase 3** → Final test → Done

**Estimated Total Time:** 9-13 hours across 3 phases

---

## 13. Critical Success Factors

### Must-Haves for Professional Look

1. ✅ **Navy blue table headers** (#003366 with white text)
2. ✅ **Chevron footer graphic** (not plain text)
3. ✅ **Split-screen TOC** (blue sidebar)
4. ✅ **Red negative values** (automatic)
5. ✅ **Blue section dividers** in complex tables
6. ✅ **No vertical table lines** (minimalist)
7. ✅ **Calibri font** (professional standard)
8. ✅ **Print color adjustment** (colors must render)

**If any of these 8 are missing → Report looks unprofessional**

---

## Appendix: Code Snippet Library

### A. CSS Variables (Complete Set)
```css
:root {
  /* Colors */
  --brand-navy: #003366;
  --brand-sky: #8DB4E2;
  --brand-red: #C00000;
  --text-black: #000000;
  --text-dark-gray: #222222;
  --border-gray: #D0D0D0;
  --bg-white: #FFFFFF;
  --bg-light-gray: #F5F5F5;

  /* Typography */
  --font-primary: Calibri, 'Segoe UI', Arial, sans-serif;
  --section-header-size: 20pt;
  --subsection-header-size: 16pt;
  --body-text-size: 11pt;
  --table-header-size: 11pt;
  --table-body-size: 10pt;

  /* Spacing */
  --section-margin-top: 32pt;
  --subsection-margin-top: 20pt;
  --table-margin-vertical: 20pt;
  --table-cell-padding: 8px;

  /* Line Heights */
  --body-line-height: 1.4;
  --heading-line-height: 1.2;
}
```

### B. Negative Value Auto-Styling (JavaScript)
```javascript
function applyNegativeValueStyling() {
  const cells = document.querySelectorAll('td, .value');

  cells.forEach(cell => {
    const text = cell.textContent.trim();

    // Check for parentheses OR negative sign
    if (text.includes('(') && text.includes(')')) {
      cell.classList.add('text-negative');
    }

    // Check numeric value
    const numericValue = parseFloat(text.replace(/[^0-9.-]/g, ''));
    if (!isNaN(numericValue) && numericValue < 0) {
      cell.classList.add('text-negative');
    }
  });
}
```

---

**Consolidated Analysis Complete**
**Status:** Ready for Implementation
**Confidence:** High (cross-referenced from 2 independent analyses)
**Next Step:** Deploy agent with this specification
