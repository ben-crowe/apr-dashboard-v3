# Master Build Plan - PDF Formatting Section Update
**Date:** December 10, 2025
**Purpose:** Section to insert into Master Build Plan after line 802

---

## 🎨 PDF Formatting & Visual Design System - December 10, 2025

### Status: Complete Documentation ✅ | Phase 1 Ready ✅ | Phase 2-5 Planned ✅

**Background:**
- Reference PDF has **custom design system**, NOT generic document template
- Initial text-based blueprint was incorrect → Redone with visual analysis
- 79 complete page images extracted for pixel-perfect replication
- Cross-referenced two independent analyses (comprehensive + precise)
- Complete 79-page documentation delivered by documentation-engineer agent

---

### 📊 Complete Documentation Suite

**Location:** `/docs/15-Contract-review/`

| Document | Status | Content | Impact |
|----------|--------|---------|--------|
| **PAGE-INVENTORY.md** | ✅ Complete | All 79 pages cataloged with layout patterns | Full coverage map |
| **LAYOUT-PATTERN-LIBRARY.md** | ✅ Complete | 16 distinct patterns with HTML/CSS | Implementation blueprints |
| **COMPONENT-CATALOG.md** | ✅ Complete | 18 reusable components (250+ instances) | Reusability library |
| **IMPLEMENTATION-ROADMAP.md** | ✅ Complete | 5-phase build strategy (50-65 hours) | Execution plan |
| **CONSOLIDATED-FORMATTING-SPECIFICATION.md** | ✅ Complete | Cross-referenced master spec (13 sections) | Visual standards |
| **VISUAL-FORMATTING-ANALYSIS-FROM-SCREENSHOTS.md** | ✅ Complete | Original visual analysis (12 sections) | Research foundation |
| **QUICK-WIN-FIXES.md** | ✅ Complete | Phase 1 implementation guide | Quick start |

---

### 🎯 Critical Discovery: Three "High-Design" Elements

**These elements differentiate professional CRE reports from generic documents:**

#### 1. Split-Screen TOC Layout (Page 5)
- **Structure:** 30% navy blue sidebar (#003366) / 70% white content area
- **Sidebar:** White "Table of Contents" text, white section numbers
- **Content:** Entries with page numbers right-aligned
- **Impact:** Brand differentiator, immediately signals professional quality
- **Implementation:** CSS flexbox layout with print-color-adjust
- **Complexity:** Medium
- **Pages:** 1 (Page 5)

#### 2. Chevron Footer Graphic (76 pages - 96% of report)
- **Design:** Linear gradient angled stripes (light blue → dark navy)
- **Colors:** #8DB4E2 (sky blue) to #003366 (navy)
- **Position:** Bottom-right corner, fixed element
- **NOT:** Plain text footer - decorative branding element
- **Implementation:** `linear-gradient(115deg, transparent 20%, #8DB4E2 20%, #8DB4E2 50%, #003366 50%)`
- **Complexity:** Low
- **Pages:** 76 (all pages except cover, transmittal, blank)

#### 3. Blue Section Dividers (20+ calculation tables)
- **Design:** Navy blue full-width rows INSIDE table bodies
- **Purpose:** Separate categories ("SALE INFORMATION", "INCOME INFORMATION")
- **Style:** White uppercase text on navy background
- **NOT:** Just table headers - structural dividers within data
- **Implementation:** `<tr class="section-divider"><td colspan="4">CATEGORY NAME</td></tr>`
- **Complexity:** Low (CSS only)
- **Pages:** 20+ (Pages 47-64 calculation tables, comparable sheets)

---

### 📐 Layout Pattern Distribution

**From LAYOUT-PATTERN-LIBRARY.md - 16 Patterns Identified:**

| Pattern | Pages | % of Report | Complexity | Priority |
|---------|-------|-------------|------------|----------|
| Standard Text Layout | 35 | 44% | Low | P1 |
| Navy Header Table | 30+ | 25% | Low | P1 |
| Split-Screen TOC | 1 | 1% | Medium | P1 (Brand) |
| Photo Grid 4-up | 6 | 8% | Low | P2 |
| Comparable Sale Card | 5 | 6% | High | P4 |
| Calculation Table | 8 | 10% | High | P4 |
| Charts (Bar/Line) | 3 | 4% | High | P4 |
| Cover Page Hero | 1 | 1% | Medium | P2 |
| Other Patterns | 11 | 14% | Mixed | P2-P5 |

**Complexity Summary:**
- **Low Complexity:** 71% of patterns (standard text, simple tables, photo grids)
- **Medium Complexity:** 15% (TOC, cover, maps)
- **High Complexity:** 14% (calculation tables, charts, comparable cards)

---

### 🧩 Component Reusability Analysis

**From COMPONENT-CATALOG.md - 18 Components, 250+ Instances:**

#### High-Frequency Components (Use Everywhere)
1. **Chevron Footer Graphic** - 76 pages (96%)
2. **Running Header with Blue Underline** - 73 pages (92%)
3. **Navy Header Table** - 30+ pages (38%)
4. **Standard Text Block** - 35 pages (44%)
5. **Page Number Element** - 73 pages (92%)

#### Medium-Frequency Components (Use Often)
6. **Photo Grid 4-up** - 6 instances (Pages 8-13)
7. **Multi-Column Data Table** - 20+ pages
8. **Section Header (Black + Underline)** - 50+ instances
9. **Subsection Header (Blue, No Underline)** - 80+ instances
10. **Map Image with Caption** - 9 instances (Pages 27-35, 54)

#### Low-Frequency / Specialized (Use Rarely)
11. **Split-Screen TOC** - 1 instance (Page 5)
12. **Comparable Sale Card** - 5 instances (Pages 55-59)
13. **Calculation Table with Dividers** - 8 instances (Pages 47-64)
14. **Bar Chart** - 2 instances (Pages 47, 60)
15. **Line Chart** - 1 instance (Page 49)
16. **Cover Page Hero Layout** - 1 instance (Page 1)
17. **Signature Block** - 2 instances (Pages 4, 65)
18. **Two-Column Text + Image** - 3 instances (Pages 14-26)

**Implementation Impact:**
- **Top 5 components** cover 70% of pages → Build these first
- **Top 10 components** cover 85% of pages → Week 1-2 target
- **Remaining 8 components** complete the report → Weeks 3-5

---

### 🗺️ 5-Phase Implementation Roadmap

**From IMPLEMENTATION-ROADMAP.md - 50-65 Hours Total:**

#### Phase 1: Foundation Components (11-16 hours) → 70% Coverage
**Goal:** Core styling and high-frequency components

**Tasks:**
1. **Color System & Typography** (2-3 hours)
   - CSS variables for navy, sky blue, red
   - Calibri font implementation (currently Times New Roman - Line 5196)
   - Section/subsection header styles (black + underline, blue no underline)

2. **Chevron Footer Graphic** (2-3 hours)
   - Linear gradient implementation
   - Fixed positioning for print
   - Apply to 76 pages

3. **Running Header** (2-3 hours)
   - Section title with blue underline
   - Fixed positioning for print
   - Apply to 73 pages

4. **Navy Header Tables** (3-4 hours)
   - Navy background (#003366), white uppercase text
   - Remove vertical lines (horizontal only)
   - Apply to 30+ pages

5. **Red Negative Values** (2-3 hours)
   - Auto-detect parentheses and negative signs
   - Apply red color (#C00000)
   - JavaScript implementation

**Testing:** Pages 1, 6, 47, 49 (cover, exec summary, calculation, chart)
**Success:** 70% visual match to reference

---

#### Phase 2: Data Presentation (12-15 hours) → 80% Coverage
**Goal:** Tables, photo grids, and standard content

**Tasks:**
1. **Blue Section Dividers** (3-4 hours)
   - Navy rows inside table bodies
   - White uppercase category text
   - Apply to calculation tables (Pages 47-64)

2. **Photo Grid 4-up** (4-5 hours)
   - 2x2 grid layout with captions
   - Consistent spacing and borders
   - 6 instances (Pages 8-13)
   - Handle partial grids (Page 13 with 1 photo)

3. **Multi-Column Data Tables** (3-4 hours)
   - Various column configurations (2, 3, 4, 5 columns)
   - Right-aligned numbers
   - Gray horizontal separators

4. **Standard Text Blocks** (2 hours)
   - Justified alignment, line height 1.4
   - Proper heading hierarchy
   - Consistent whitespace (16-32pt between sections)

**Testing:** Pages 8-13 (photos), 38-42 (data tables), 14-26 (text blocks)
**Success:** 80% visual match to reference

---

#### Phase 3: Special Layouts & TOC (9-12 hours) → 85% Coverage
**Goal:** Brand differentiators and unique page designs

**Tasks:**
1. **Split-Screen TOC** (4-5 hours)
   - CSS flexbox: 30% navy sidebar / 70% white content
   - Sidebar: White text, "Table of Contents" heading
   - Content: Entries with right-aligned page numbers
   - Print color adjustment for navy background
   - 1 instance (Page 5)

2. **Cover Page Hero Layout** (3-4 hours)
   - Valta logo positioning
   - Property photo placement
   - Client info blocks (white text on navy)
   - Diagonal gradient element (bottom-right)
   - 1 instance (Page 1)

3. **Maps with Captions** (2-3 hours)
   - Full-width image placement
   - Caption styling
   - 9 instances (Pages 27-35, 54)
   - Special handling: Zoning map red overlay (Page 30)

**Testing:** Pages 1, 5, 27-30 (cover, TOC, maps)
**Success:** 85% visual match to reference

---

#### Phase 4: Advanced Components & Charts (14-18 hours) → 95% Coverage
**Goal:** Complex data visualization and calculations

**Tasks:**
1. **Calculation Tables with Dividers** (6-8 hours)
   - Navy section divider rows inside tbody
   - Multi-section tables (Operating History, Rental Revenue, etc.)
   - Red negative values integration
   - Subtotal and total row styling
   - Currency/percentage formatting
   - 8 instances (Pages 47-64)

2. **Bar Charts** (4-5 hours)
   - Navy blue bars (#003366)
   - White background, light gray grid
   - Axis labels and titles
   - PDF-compatible rendering (no external libraries)
   - 2 instances (Pages 47, 60)

3. **Line Charts** (4-5 hours)
   - Navy blue line (#003366)
   - Data point markers
   - Grid and axis styling
   - PDF-compatible rendering
   - 1 instance (Page 49)

**Testing:** Pages 47-50, 60-64 (calculation tables and charts)
**Success:** 95% visual match to reference

---

#### Phase 5: Comparables & Polish (10-12 hours) → 100% Coverage
**Goal:** Complete all remaining elements and full regression test

**Tasks:**
1. **Comparable Sale Card** (5-6 hours)
   - CSS Grid 4-area layout
   - Areas: Sale info (top-left), Photo (top-right), Property details (middle-left), Map (middle-right), Remarks (full-width bottom)
   - Navy header bar with white text
   - Data table styling
   - Image sizing and positioning
   - 5 instances (Pages 55-59)

2. **Comparables Location Map** (2-3 hours)
   - Full-width map with property markers
   - Distance legend table
   - 1 instance (Page 54)

3. **Full Regression Test** (3 hours)
   - Test all 79 pages
   - Visual comparison to reference images
   - PDF export verification (colors, page breaks, headers/footers)
   - Fix any edge cases or inconsistencies

**Testing:** All 79 pages
**Success:** 100% complete, client-ready quality

---

### 📋 Build Groups (9 Logical Clusters)

**From IMPLEMENTATION-ROADMAP.md:**

| Group | Pages | Pattern | Effort | Phase |
|-------|-------|---------|--------|-------|
| **Group 1: Cover & Front Matter** | 1-7 | Cover, Transmittal, TOC, Exec Summary | 8-10 hrs | P1, P3 |
| **Group 2: Property Photos** | 8-13 | Photo Grid 4-up | 4-5 hrs | P2 |
| **Group 3: Property Description** | 14-26 | Text + Image Two-Column | 3-4 hrs | P2 |
| **Group 4: Site & Maps** | 27-35 | Maps with Captions | 2-3 hrs | P3 |
| **Group 5: Market Analysis** | 36-46 | Standard Text + Tables | 4-5 hrs | P2 |
| **Group 6: Valuation & Charts** | 47-50 | Calculation Tables + Charts | 10-13 hrs | P4 |
| **Group 7: Comparables Map** | 51-54 | Location Map | 2-3 hrs | P5 |
| **Group 8: Sale Comparables** | 55-64 | Sale Cards + Calc Tables | 11-14 hrs | P4, P5 |
| **Group 9: Appendices & Back Matter** | 65-79 | Standard Text, Signature | 3-4 hrs | P2 |

**Total Effort:** 50-65 hours across 5 phases (5 weeks at ~10-13 hrs/week)

---

### 🎨 Color Palette (Validated Cross-Reference)

**From CONSOLIDATED-FORMATTING-SPECIFICATION.md:**

```css
:root {
  /* Primary Brand Colors */
  --brand-navy: #003366;        /* TOC sidebar, table headers, footer graphic, section dividers */
  --brand-sky: #8DB4E2;         /* Chevron gradient accent only */
  --brand-red: #C00000;         /* Negative values, adjustments */

  /* Text Colors */
  --text-black: #000000;        /* Section headers */
  --text-dark-gray: #222222;    /* Body text */

  /* UI Colors */
  --border-gray: #D0D0D0;       /* Table separators (horizontal only) */
  --bg-light-gray: #F5F5F5;     /* Subtle table row alternation */
}
```

**Color Usage Rules:**
- **Navy (#003366):** Table headers, TOC sidebar, footer graphic, blue section dividers
- **Sky Blue (#8DB4E2):** ONLY in chevron footer gradient (accent color)
- **Red (#C00000):** ANY value in parentheses OR negative numbers
- **Black (#000000):** Section headers (with underline)
- **Dark Gray (#222222):** Body text

---

### 📝 Typography System (Cross-Referenced Measurements)

**Font Family:** Calibri (or Segoe UI fallback, Arial last resort)

**Hierarchy:**
```css
/* Section Headers */
h1.section-header {
  font-size: 20pt;
  font-weight: bold;
  color: #000000;  /* BLACK, not blue */
  border-bottom: 2px solid #000000;  /* Underline */
  line-height: 1.2;
  margin-top: 32pt;
  margin-bottom: 16pt;
}

/* Subsection Headers */
h2.subsection {
  font-size: 16pt;
  font-weight: bold;
  color: #003366;  /* Blue, no underline */
  line-height: 1.2;
  margin-top: 24pt;
  margin-bottom: 12pt;
}

/* Sub-subsection Headers */
h3.sub-subsection {
  font-size: 14pt;
  font-weight: bold;
  color: #003366;  /* Blue, no underline */
  line-height: 1.2;
  margin-top: 16pt;
  margin-bottom: 8pt;
}

/* Body Text */
p, li {
  font-size: 11pt;
  font-weight: normal;
  color: #222222;
  line-height: 1.4;
  text-align: justify;
}

/* Table Headers */
thead th {
  font-size: 11pt;
  font-weight: bold;
  text-transform: uppercase;
  color: #FFFFFF;
  background: #003366;
  padding: 8pt 12pt;
}

/* Table Data */
tbody td {
  font-size: 10pt;
  font-weight: normal;
  color: #222222;
  padding: 6pt 12pt;
  text-align: left;  /* Left for text */
}

tbody td.number {
  text-align: right;  /* Right for numbers */
}
```

---

### 🏗️ Table Design Patterns

**From COMPONENT-CATALOG.md - Navy Header Table Component:**

**Critical Rules:**
1. ✅ **Navy blue headers** (#003366 background, white uppercase text)
2. ✅ **NO vertical column separators** (minimalist design, horizontal only)
3. ✅ **Blue section divider rows** inside tbody for category separation
4. ✅ **Red color** (#C00000) for negative values (auto-detect parentheses)
5. ✅ **Horizontal gray borders** only (#D0D0D0, 1px)
6. ✅ **Number alignment:** Right-aligned for currency/percentages
7. ✅ **Alternating rows:** Very subtle (#F5F5F5) or none

**HTML Structure:**
```html
<table class="navy-header-table">
  <thead>
    <tr>
      <th>COLUMN 1</th>
      <th>COLUMN 2</th>
      <th>COLUMN 3</th>
    </tr>
  </thead>
  <tbody>
    <!-- Optional: Blue section divider -->
    <tr class="section-divider">
      <td colspan="3">SECTION NAME</td>
    </tr>

    <tr>
      <td>Data</td>
      <td class="number">$123,456</td>
      <td class="number">45.2%</td>
    </tr>

    <tr>
      <td>Negative Example</td>
      <td class="number text-negative">($12,345)</td>
      <td class="number text-negative">-5.2%</td>
    </tr>
  </tbody>
</table>
```

**CSS Implementation:**
```css
.navy-header-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #D0D0D0;
}

.navy-header-table thead th {
  background: #003366;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 11pt;
  padding: 8pt 12pt;
  text-align: left;
  border-bottom: 2px solid #003366;
}

.navy-header-table tbody td {
  padding: 6pt 12pt;
  font-size: 10pt;
  border-bottom: 1px solid #D0D0D0;
  /* NO border-left or border-right */
}

.navy-header-table tr.section-divider td {
  background: #003366;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  padding: 6pt 12pt;
}

.navy-header-table .text-negative {
  color: #C00000 !important;
}

.navy-header-table .number {
  text-align: right;
}
```

---

### 📐 Page Layout Specifications

**Margins:** 0.75" left/right, 1.25" top (running header space), 1.0" bottom
**Running Header:** Section title with blue underline (14pt bold), appears on 73 pages
**Footer:** Chevron graphic only (no text footer), appears on 76 pages
**Body Text:** Line height 1.4, justified alignment
**Whitespace:** 16-32pt between sections

**Page Structure:**
```
┌─────────────────────────────────────────────┐
│ Running Header (Section Title + Blue Line) │ ← 1.25" top margin
├─────────────────────────────────────────────┤
│                                             │
│                                             │
│             Content Area                    │
│                                             │
│                                             │
├─────────────────────────────────────────────┤
│          Chevron Footer Graphic             │ ← 1.0" bottom margin
└─────────────────────────────────────────────┘
    ↑                                      ↑
  0.75"                                 0.75"
  left                                  right
```

---

### 🔧 Code Gaps Identified

**File:** `reportHtmlTemplate.ts` (5,966 lines)

**Critical Issues:**

1. **Line 5196:** Font family is Times New Roman → MUST change to Calibri
   ```typescript
   // WRONG (current):
   font-family: 'Times New Roman', Times, serif;

   // CORRECT:
   font-family: Calibri, 'Segoe UI', Arial, sans-serif;
   ```

2. **Lines 5180-5200:** Missing CSS color variables
   ```css
   /* ADD AFTER LINE 5180: */
   :root {
     --brand-navy: #003366;
     --brand-sky: #8DB4E2;
     --brand-red: #C00000;
     --text-black: #000000;
     --text-dark-gray: #222222;
     --border-gray: #D0D0D0;
     --bg-light-gray: #F5F5F5;
   }
   ```

3. **After line 5960:** Missing navy table header styles
4. **Missing:** Red negative value auto-detection JavaScript
5. **Missing:** Blue section divider row implementation
6. **Missing:** Split-screen TOC layout (Page 5)
7. **Missing:** Chevron footer graphic CSS (76 pages)
8. **Missing:** Running header implementation (73 pages)
9. **Missing:** Comparable sale card CSS Grid layout (Pages 55-59)
10. **Missing:** Chart rendering (bar and line charts, Pages 47, 49, 60)

---

### 🚧 Gotenberg PDF Export Constraints

**From CSS-Paged-Media-Technical-Solutions.md:**

✅ **SUPPORTED:**
- `@page` size and margins
- Page breaks (`break-before/after/inside`)
- Color rendering: `-webkit-print-color-adjust: exact !important` (REQUIRED)
- HTML headers/footers with `position: fixed`
- Base64 embedded images (data URLs)
- CSS Grid and Flexbox layouts

❌ **NOT SUPPORTED:**
- Page margin boxes (`@top-center`, `@bottom-center`)
- Named pages (`@page chapter-page`)
- CSS counters in `@page` context
- Running headers via CSS `string-set`
- External resource loading in `@page`

**Workarounds:**
1. **Headers/Footers:** Use HTML elements with `position: fixed` instead of CSS margin boxes
2. **Chevron Footer:** Use `linear-gradient` CSS (no image files needed)
3. **Page Numbers:** Implement with JavaScript before PDF generation, not CSS counters
4. **Section Headers:** Use CSS classes to hide/show headers, not named pages
5. **Colors:** Apply `-webkit-print-color-adjust: exact !important` to ALL colored elements

**Example - Chevron Footer (Gotenberg-Compatible):**
```css
.chevron-footer {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 200px;
  height: 40px;
  background: linear-gradient(
    115deg,
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

### ✅ Success Criteria - PDF Formatting

#### Phase 1 Complete When:
- ✅ Font changed to Calibri throughout (currently Times New Roman)
- ✅ CSS color variables defined
- ✅ Navy table headers with white uppercase text (30+ pages)
- ✅ Red negative values in financial data (auto-detected)
- ✅ Black section headers with underlines (50+ instances)
- ✅ Blue subsection headers without underlines (80+ instances)
- ✅ Chevron footer on 76 pages
- ✅ Running header on 73 pages
- ✅ Colors render correctly in PDF export
- ✅ **Target:** 70% visual match to reference pages 1, 6, 47, 49

#### Phase 2 Complete When:
- ✅ Blue section dividers in calculation tables (Pages 47-64)
- ✅ Photo grids 4-up with captions (Pages 8-13)
- ✅ Multi-column data tables styled (20+ pages)
- ✅ Standard text blocks with proper typography (35 pages)
- ✅ **Target:** 80% visual match to reference

#### Phase 3 Complete When:
- ✅ Split-screen TOC matches reference Page 5
- ✅ Cover page hero layout matches reference Page 1
- ✅ Maps with captions styled (Pages 27-35, 54)
- ✅ **Target:** 85% visual match to reference

#### Phase 4 Complete When:
- ✅ Calculation tables with section dividers (Pages 47-64)
- ✅ Bar charts rendered (Pages 47, 60)
- ✅ Line charts rendered (Page 49)
- ✅ **Target:** 95% visual match to reference

#### Phase 5 Complete When:
- ✅ Comparable sale cards implemented (Pages 55-59)
- ✅ Comparables location map (Page 54)
- ✅ All 79 pages tested
- ✅ Full regression test passed
- ✅ PDF export verified (colors, page breaks, headers/footers)
- ✅ **Target:** 100% complete, client-ready presentation quality

---

### 📁 Reference Files

**Documentation (All Complete ✅):**
- `PAGE-INVENTORY.md` - All 79 pages cataloged
- `LAYOUT-PATTERN-LIBRARY.md` - 16 patterns with HTML/CSS
- `COMPONENT-CATALOG.md` - 18 components, 250+ instances
- `IMPLEMENTATION-ROADMAP.md` - 5-phase build plan (50-65 hrs)
- `CONSOLIDATED-FORMATTING-SPECIFICATION.md` - Master visual spec (13 sections)
- `VISUAL-FORMATTING-ANALYSIS-FROM-SCREENSHOTS.md` - Original analysis (12 sections)
- `QUICK-WIN-FIXES.md` - Phase 1 quick start guide

**Reference Images:**
- `Ref REPORT Page Images/` - 79 PNG files (Page 1-79 of 79)
- `Ref Doc IMGS copy/` - 14 screenshot samples (critical pages)

**Implementation Files:**
- `reportHtmlTemplate.ts` - Lines 5180-5966 (CSS), template HTML
- `reportBuilderStore.ts` - State management, calculator engine
- `fieldRegistry.ts` - Field definitions (S3 IMAGE MGT section lines 89-162)

---

### 🎯 Next Steps (Sequential)

#### Immediate (Ready Now)
1. **Deploy frontend-developer** for Phase 1 (11-16 hours)
   - Update CSS variables and Calibri font
   - Implement chevron footer and running header
   - Add navy table headers
   - Implement red negative auto-styling
   - Test Pages 1, 6, 47, 49

#### Week 1 Follow-up
2. **Review Phase 1 results** and iterate
   - Generate PDF from updated template
   - Visual comparison to reference pages
   - Fix any issues before Phase 2

#### Week 2-3
3. **Deploy Phase 2 implementation** (12-15 hours)
   - Blue section dividers
   - Photo grids
   - Data tables
   - Standard text blocks

4. **Deploy Phase 3 implementation** (9-12 hours)
   - Split-screen TOC
   - Cover page
   - Maps

#### Week 4-5
5. **Deploy Phase 4 implementation** (14-18 hours)
   - Calculation tables
   - Charts (bar and line)

6. **Deploy Phase 5 implementation** (10-12 hours)
   - Comparable sale cards
   - Full regression test

#### Final
7. **Full 79-page regression test** (3 hours)
   - Visual comparison all pages
   - PDF export verification
   - Client presentation readiness check

**Total Timeline:** 5 weeks at 10-13 hours/week = 50-65 hours

---

### 📊 Project Metrics

**Documentation Coverage:**
- Pages analyzed: 79/79 (100%)
- Layout patterns identified: 16
- Reusable components: 18
- Component instances: 250+
- Implementation hours estimated: 50-65

**Phase Targets:**
- Phase 1: 70% visual match (11-16 hrs)
- Phase 2: 80% visual match (12-15 hrs)
- Phase 3: 85% visual match (9-12 hrs)
- Phase 4: 95% visual match (14-18 hrs)
- Phase 5: 100% complete (10-12 hrs)

**Component Frequency:**
- High-frequency (70%+ pages): 5 components (chevron footer, running header, navy tables, text blocks, page numbers)
- Medium-frequency (20-40% pages): 5 components (photo grids, data tables, headers, maps)
- Low-frequency (<20% pages): 8 components (TOC, cover, charts, comparable cards, specialized)

---

### 📝 Session Documentation

**Passover Session:** `25.12.10-1 - PDF-formatting-reference-analysis.md` (14K)

**Search Keywords:**
`PDF-formatting`, `navy-table-headers`, `Calibri-font`, `red-negatives`, `split-screen-TOC`, `chevron-footer`, `blue-section-dividers`, `Valta-design-system`, `79-pages`, `visual-analysis`, `component-library`, `layout-patterns`, `implementation-roadmap`, `Gotenberg`, `5-phase-build`

---

**End of PDF Formatting Section**
