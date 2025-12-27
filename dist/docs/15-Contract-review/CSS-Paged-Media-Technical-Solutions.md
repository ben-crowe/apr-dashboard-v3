# CSS Paged Media Technical Solutions for Continuous Flow PDF Reports

**Document Purpose:** Technical CSS/rendering solutions for seamless continuous scroll in browser with structured pagination in PDF export.

**Last Updated:** 2025-12-09

---

## Table of Contents

1. [Code Snippet Library](#code-snippet-library)
2. [Header/Footer Control Techniques](#headerfooter-control-techniques)
3. [Orphan Prevention Solutions](#orphan-prevention-solutions)
4. [Section Break Patterns](#section-break-patterns)
5. [Gotenberg-Specific Notes](#gotenberg-specific-notes)
6. [Print vs. Screen Rendering Tips](#print-vs-screen-rendering-tips)
7. [Recommended CSS Framework](#recommended-css-framework)
8. [Browser Support Matrix](#browser-support-matrix)

---

## 1. Code Snippet Library

### 1.1 Prevent Heading Orphans (Basic)

**Problem Solved:** Headings appearing at bottom of page and getting cut off

```css
@media print {
  h1, h2, h3, h4, h5, h6 {
    /* Modern syntax */
    break-after: avoid;
    break-inside: avoid;

    /* Legacy fallback for older browsers */
    page-break-after: avoid;
    page-break-inside: avoid;
  }
}
```

**Browser Support:** `page-break-*` has wide support, `break-*` is modern standard
**Effectiveness:** Moderate - works in most cases but not 100% reliable

**Source:** [MDN page-break-inside](https://developer.mozilla.org/en-US/docs/Web/CSS/page-break-inside), [CSS-Tricks page-break](https://css-tricks.com/almanac/properties/p/page-break/)

---

### 1.2 Heading + Paragraph Wrapper (Most Reliable)

**Problem Solved:** Orphaned headings separated from their content

```css
@media print {
  .section-group {
    /* Modern syntax */
    break-inside: avoid-page;

    /* Legacy fallback */
    page-break-inside: avoid;

    /* Ensure block-level element */
    display: block;
  }
}
```

**HTML Structure:**
```html
<div class="section-group">
  <h2>Section Title</h2>
  <p>First paragraph that should stay with the heading...</p>
</div>
```

**Browser Support:** Excellent - works across all modern browsers
**Effectiveness:** High - most reliable method for keeping heading with content

**Source:** [GeeksforGeeks CSS page-break-inside](https://www.geeksforgeeks.org/css/css-page-break-inside-property/), [CopyProgramming heading/list prevention](https://copyprogramming.com/howto/avoid-page-break-between-heading-and-first-list-item)

---

### 1.3 Force Section to New Page

**Problem Solved:** Major sections should start on fresh page

```css
@media print {
  .major-section {
    /* Modern syntax */
    break-before: page;

    /* Legacy fallback */
    page-break-before: always;
  }
}
```

**Use Case:** TOC, Executive Summary, each major report section

**Source:** [Smashing Magazine CSS Fragmentation](https://www.smashingmagazine.com/2019/02/css-fragmentation/)

---

### 1.4 Orphan and Widow Control

**Problem Solved:** Prevent single lines at top/bottom of pages

```css
@media print {
  p {
    /* Minimum 2 lines at bottom of page */
    orphans: 2;

    /* Minimum 2 lines at top of page */
    widows: 2;
  }

  /* For critical sections, be more strict */
  .important-content p {
    orphans: 3;
    widows: 3;
  }
}
```

**Browser Support:** Good for `p` elements, limited for other elements
**Effectiveness:** Moderate - works for paragraph text but not structural elements

**Source:** [CSS-Tricks orphans](https://css-tricks.com/almanac/properties/o/orphans/), [Clagnut pagination widows](https://clagnut.com/blog/2426)

---

### 1.5 Gotenberg Color Rendering (CRITICAL)

**Problem Solved:** Background colors not appearing in PDF export

```css
@media print {
  html, body {
    /* REQUIRED for Gotenberg/Chrome headless */
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;

    background-color: #ffffff;
  }

  .section-banner {
    background-color: #2c3e50;
    color: #ffffff;

    /* Apply to all colored elements */
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
```

**CRITICAL:** Gotenberg ignores `printBackground: true` parameter - you MUST use CSS property
**LIMITATION:** Chrome does not print backgrounds on `<body>` element - use wrapper div

**Source:** [Gotenberg GitHub Discussion #572](https://github.com/gotenberg/gotenberg/discussions/572), [CSS-Tricks print-color-adjust](https://css-tricks.com/almanac/properties/p/print-color-adjust/)

---

### 1.6 Named Pages for Different Page Types

**Problem Solved:** Different headers/footers for different sections

```css
/* Define named page types */
@page title-page {
  @top-center {
    content: none; /* No header on title page */
  }
  @bottom-center {
    content: none; /* No footer on title page */
  }
}

@page chapter-page {
  @top-center {
    content: "Appraisal Report";
  }
  @bottom-center {
    content: "Page " counter(page);
  }
}

@page section-opener {
  @top-center {
    content: none; /* Hide header on section title pages */
  }
}

/* Apply named pages to elements */
.title-page {
  page: title-page;
}

.chapter-content {
  page: chapter-page;
}

.section-title-page {
  page: section-opener;
  break-before: page; /* Force to new page */
}
```

**Browser Support:** LIMITED - Named pages NOT supported in Chrome/Gotenberg
**Effectiveness:** N/A for Gotenberg - use alternative patterns instead

**Alternative for Gotenberg:** Use CSS classes with conditional styling instead of named pages

**Source:** [Print-CSS.rocks Named Pages](https://print-css.rocks/lesson/lesson-named-pages), [MDN @page](https://developer.mozilla.org/en-US/docs/Web/CSS/@page)

---

### 1.7 Page Margins and Size

**Problem Solved:** Inconsistent margins, browser adding default header/footer

```css
@page {
  /* Remove browser default header/footer */
  margin: 0;

  /* Standard A4 size */
  size: A4 portrait;
}

/* If you want custom margins */
@page {
  size: A4;
  margin: 20mm 15mm 25mm 15mm; /* top right bottom left */
}

/* Landscape orientation for specific sections */
@page landscape-page {
  size: A4 landscape;
  margin: 15mm 20mm;
}
```

**Gotenberg Note:** Setting `margin: 0` in `@page` removes browser's default print header/footer lines

**Source:** [Excessively Adequate Chrome Print](https://excessivelyadequate.com/posts/print.html), [Chrome Developers Print Margins](https://developer.chrome.com/blog/print-margins)

---

### 1.8 Full-Width Section Banner (No Gap Pattern)

**Problem Solved:** Section dividers creating whitespace gaps

```css
@media print {
  .section-banner {
    /* Full-width across page */
    width: 100vw;
    margin-left: calc(-50vw + 50%);

    /* Remove any gaps */
    margin-top: 0;
    margin-bottom: 0;

    /* Styling */
    padding: 20px;
    background-color: #2c3e50;
    color: #ffffff;

    /* REQUIRED for Gotenberg */
    -webkit-print-color-adjust: exact !important;

    /* Keep heading with banner */
    break-inside: avoid;
  }

  /* Optional: Force banner to new page */
  .section-banner.major {
    break-before: page;
  }
}
```

**Use Case:** Section title pages that act as visual dividers
**Effect:** Creates full-bleed banner without whitespace before/after

**Source:** [FreeCodeCamp Section Divider](https://www.freecodecamp.org/news/section-divider-using-css/)

---

### 1.9 Table of Contents Page Control

**Problem Solved:** TOC variable length creating awkward page transitions

```css
@media print {
  .toc-container {
    /* Force TOC to start on new page */
    break-before: page;

    /* Allow TOC to span multiple pages naturally */
    break-inside: auto;
  }

  /* Keep TOC entries together */
  .toc-entry {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  /* Force content after TOC to new page */
  .toc-container + * {
    break-before: page;
    page-break-before: always;
  }
}
```

**Pattern:** TOC always starts fresh page, content after TOC always starts fresh page

---

### 1.10 Prevent Table/Figure Splitting

**Problem Solved:** Tables and figures split across pages

```css
@media print {
  table, figure, .data-table, .chart-container {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  /* If table is too large, allow breaks at rows */
  table.large-table {
    break-inside: auto;
  }

  table.large-table tr {
    break-inside: avoid;
    page-break-inside: avoid;
  }
}
```

**Note:** Very large tables may need to break - use row-level control

---

## 2. Header/Footer Control Techniques

### 2.1 Current Browser Support Status (2024-2025)

**Chrome/Gotenberg:**
- ✅ Supports: `@page` size and margins, page breaks, page counters
- ❌ Does NOT support: Margin boxes (`@top-center`, `@bottom-center`, etc.), named pages, running headers/footers
- ❌ Does NOT support: `content` property in `@page` margin boxes

**Workaround Required:** Use HTML/CSS elements instead of CSS margin boxes

**Source:** [Steve Fenton CSS Paged Media](https://stevefenton.co.uk/blog/2013/12/using-css-paged-media-to-add-dynamic-headers/), [CSS4.pub Running Headers](https://css4.pub/2023/running-headers/)

---

### 2.2 HTML-Based Header/Footer Pattern (Gotenberg Compatible)

**Since Gotenberg doesn't support `@page` margin boxes, use fixed HTML elements:**

```html
<div class="print-page">
  <header class="page-header">
    <div class="header-content">Appraisal Report</div>
  </header>

  <main class="page-content">
    <!-- Your content here -->
  </main>

  <footer class="page-footer">
    <div class="footer-content">Page <span class="page-number"></span></div>
  </footer>
</div>
```

```css
@media print {
  .page-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 40px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #ddd;
    z-index: 1000;

    -webkit-print-color-adjust: exact;
  }

  .page-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 30px;
    background-color: #f5f5f5;
    border-top: 1px solid #ddd;

    -webkit-print-color-adjust: exact;
  }

  .page-content {
    /* Make space for fixed header/footer */
    margin-top: 50px;
    margin-bottom: 40px;
  }
}
```

**CRITICAL:** Chrome won't automatically resize content for header/footer - you MUST add margins manually

**Source:** [CustomJS HTML Print Pagination](https://www.customjs.space/blog/html-print-pagination-footer/), [PrintCSS Running Headers](https://printcss.net/articles/running-headers-and-footers)

---

### 2.3 Conditional Header/Footer Display

**Problem:** Want to hide header on title page, show on content pages

**Solution:** Use CSS classes instead of named pages (since Gotenberg doesn't support them)

```css
@media print {
  /* Hide header on title page */
  .title-page .page-header {
    display: none;
  }

  /* Hide header on section opener pages */
  .section-opener .page-header {
    display: none;
  }

  /* Show header on all other pages */
  .page-header {
    display: block;
    position: fixed;
    top: 0;
    width: 100%;
  }
}
```

**HTML Structure:**
```html
<!-- Title page -->
<div class="print-page title-page">
  <header class="page-header"><!-- Hidden by CSS --></header>
  <main class="page-content">
    <h1>Property Appraisal Report</h1>
  </main>
</div>

<!-- Regular content page -->
<div class="print-page">
  <header class="page-header">Appraisal Report</header>
  <main class="page-content">
    <!-- Content -->
  </main>
</div>
```

---

### 2.4 Page Counter (Manual Implementation)

**Since Gotenberg doesn't support CSS counters in margin boxes, implement with JavaScript:**

```html
<footer class="page-footer">
  <div class="footer-content">
    Page <span class="page-number"></span> of <span class="total-pages"></span>
  </div>
</footer>
```

```javascript
// Before print/PDF generation
window.addEventListener('beforeprint', function() {
  const pageNumbers = document.querySelectorAll('.page-number');
  const totalPages = document.querySelectorAll('.total-pages');

  // Simple counter (may need adjustment based on actual page breaks)
  pageNumbers.forEach((el, index) => {
    el.textContent = index + 1;
  });

  totalPages.forEach(el => {
    el.textContent = pageNumbers.length;
  });
});
```

**Note:** This is a simplified example - actual page counting with dynamic content is complex

---

### 2.5 Header/Footer Limitations in Chrome Headless

**Known Issues:**
1. Chrome doesn't support page margin boxes (`@top-center`, etc.)
2. Header/footer height limited to ~256px before breaking
3. External resources in header/footer won't load (must use data URLs)
4. Headers don't repeat reliably with `<thead>` beyond 256px

**Source:** [Gotenberg GitHub Discussion #416](https://github.com/gotenberg/gotenberg/discussions/416), [PDF Gotchas with Headless Chrome](https://nathanfriend.com/2019/04/15/pdf-gotchas-with-headless-chrome.html)

**Recommended Approach:**
- Keep headers/footers simple and under 100px height
- Use inline styles or embedded CSS (no external resources)
- Use base64 data URLs for any images in header/footer

---

## 3. Orphan Prevention Solutions

### 3.1 The Core Problem

**Browser Support Status:**
- `break-after: avoid` is NOT supported by Safari or Firefox (as of 2024)
- Only introduced to Chrome in version 108 (December 2022)
- `break-inside: avoid` has better support but limited effectiveness
- Not selected for Interop 2024 or Interop 2025

**Source:** [Interop 2024/2025 status](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_paged_media)

**Reality:** CSS page break control is unreliable - you need defensive patterns

---

### 3.2 Multi-Layer Defense Strategy

**Layer 1: Direct heading properties**
```css
@media print {
  h1, h2, h3, h4, h5, h6 {
    break-after: avoid;
    break-inside: avoid;
    page-break-after: avoid;
    page-break-inside: avoid;
  }
}
```

**Layer 2: Wrapper containers (most reliable)**
```css
@media print {
  .section-group {
    break-inside: avoid-page;
    page-break-inside: avoid;
    display: block;
  }
}
```

**Layer 3: Paragraph orphan/widow control**
```css
@media print {
  p {
    orphans: 3;
    widows: 3;
  }
}
```

**Layer 4: Minimum height requirement**
```css
@media print {
  .section-group {
    min-height: 100px; /* Ensure meaningful content */
  }
}
```

**Combined Pattern:**
```html
<div class="section-group">
  <h2>Section Title</h2>
  <p>First paragraph with at least a few lines of content to ensure the heading isn't orphaned...</p>
  <p>Additional content...</p>
</div>
```

**Effectiveness:** High - combining multiple defensive layers catches most cases

---

### 3.3 Heading-Specific Best Practices

```css
@media print {
  /* Major headings - always force to new page if near bottom */
  h1 {
    break-before: page;
    page-break-before: always;
  }

  /* Section headings - avoid breaks before and after */
  h2 {
    break-before: avoid;
    break-after: avoid;
    page-break-before: avoid;
    page-break-after: avoid;

    /* Ensure some content follows */
    margin-bottom: 0.5em;
  }

  /* Subsection headings */
  h3, h4 {
    break-after: avoid;
    page-break-after: avoid;
    margin-bottom: 0.5em;
  }

  /* Keep heading with next element */
  h2 + *, h3 + *, h4 + * {
    break-before: avoid;
    page-break-before: avoid;
  }
}
```

**Pattern:** Use adjacent sibling selector to keep heading attached to following content

---

### 3.4 Dynamic Content Considerations

**For variable-length sections (like TOC):**

```css
@media print {
  /* Allow TOC to span pages naturally */
  .toc-container {
    break-inside: auto;
  }

  /* But keep individual entries together */
  .toc-entry {
    break-inside: avoid;
    page-break-inside: avoid;
    display: block;
  }

  /* Major TOC sections can break at section boundaries */
  .toc-section {
    break-before: avoid;
    break-inside: auto;
  }

  .toc-section-title {
    break-after: avoid;
    page-break-after: avoid;
  }
}
```

**Strategy:** Allow natural page breaks at sensible boundaries, prevent breaks at awkward points

---

## 4. Section Break Patterns

### 4.1 Full-Page Section Title (Recommended)

**Pattern:** Dedicate entire page to section title - acts as both header and separator

```css
@media print {
  .section-title-page {
    /* Force to new page */
    break-before: page;
    break-after: page;

    /* Full page height */
    min-height: 100vh;

    /* Center content vertically */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    /* Full-width background */
    width: 100vw;
    margin-left: calc(-50vw + 50%);

    /* Styling */
    background-color: #2c3e50;
    color: #ffffff;

    /* REQUIRED for Gotenberg */
    -webkit-print-color-adjust: exact !important;
  }

  /* Hide header/footer on section title pages */
  .section-title-page .page-header,
  .section-title-page .page-footer {
    display: none;
  }
}
```

**HTML:**
```html
<div class="section-title-page">
  <h1>Executive Summary</h1>
  <p class="section-subtitle">Property Valuation Analysis</p>
</div>
```

**Benefits:**
- No footer/header collision (header/footer hidden on this page)
- No orphan issues (full page dedicated to title)
- Clear visual separation between sections
- Looks professional in both screen and PDF

**Source:** [Smashing Magazine Designing for Print](https://www.smashingmagazine.com/2015/01/designing-for-print-with-css/)

---

### 4.2 Banner-Style Section Separator

**Pattern:** Full-width colored banner without page break

```css
@media print {
  .section-separator {
    /* Full-width */
    width: 100vw;
    margin-left: calc(-50vw + 50%);

    /* Remove gaps */
    margin-top: 0;
    margin-bottom: 0;
    padding: 15px 20px;

    /* Keep together */
    break-inside: avoid;
    page-break-inside: avoid;

    /* Styling */
    background-color: #34495e;
    color: #ffffff;
    border-top: 3px solid #2c3e50;

    -webkit-print-color-adjust: exact !important;
  }

  /* Optional: Force to new page if near bottom */
  .section-separator.major {
    break-before: page;
  }
}
```

**HTML:**
```html
<div class="section-separator">
  <h2>Property Description</h2>
</div>
<div class="section-content">
  <!-- Content continues on same page -->
</div>
```

**Use Case:** Section breaks within continuous content without forcing new page

---

### 4.3 Minimal Divider Line

**Pattern:** Simple horizontal rule with text

```css
@media print {
  .section-divider {
    /* Spacing */
    margin: 30px 0;
    padding: 10px 0;

    /* Border styling */
    border-top: 2px solid #2c3e50;
    border-bottom: 1px solid #95a5a6;

    /* Keep with following content */
    break-after: avoid;
    page-break-after: avoid;

    /* Center text */
    text-align: center;
    font-weight: bold;
    color: #2c3e50;
  }
}
```

**HTML:**
```html
<div class="section-divider">Property Analysis</div>
```

**Use Case:** Lightweight visual separation without heavy styling

---

### 4.4 Preventing Gap After Section Break

**Problem:** When section banner removed, footer from previous page sits on header of next page

**Solution 1: Full-page section titles** (recommended - see 4.1)

**Solution 2: Strategic padding**
```css
@media print {
  .section-content {
    /* Add padding to create visual space */
    padding-top: 20px;
  }

  .section-banner {
    /* Remove bottom margin to eliminate gap */
    margin-bottom: 0;
    padding-bottom: 15px;
  }

  /* If banner is last element on page, add extra padding */
  .section-banner:last-child {
    padding-bottom: 30px;
  }
}
```

**Solution 3: Force new page for major sections**
```css
@media print {
  .major-section {
    break-before: page;
    page-break-before: always;
  }
}
```

---

## 5. Gotenberg-Specific Notes

### 5.1 What Works in Gotenberg

✅ **SUPPORTED:**
- `@page` size and orientation (`size: A4 portrait`)
- `@page` margins (`margin: 20mm 15mm`)
- Page breaks (`break-before`, `break-after`, `break-inside`)
- Page counters (with JavaScript workarounds)
- `-webkit-print-color-adjust: exact` for colors
- Standard CSS layout and styling
- Base64 embedded images (data URLs)

❌ **NOT SUPPORTED:**
- Page margin boxes (`@top-center`, `@bottom-center`, etc.)
- Named pages with different headers/footers per section
- `content` property in `@page` rules
- Running headers/footers via CSS
- External resource loading in `@page` rules
- String-set and running elements
- Advanced CSS Generated Content features

**Source:** [Gotenberg Routes Documentation](https://gotenberg.dev/docs/routes), [Medium: Gotenberg Integration Story](https://medium.com/@annabi.medamine/generating-pdfs-from-html-using-gotenberg-a-practical-integration-story-d1792080c00b)

---

### 5.2 Critical Gotenberg CSS Requirements

**1. Background Colors MUST use print-color-adjust:**
```css
@media print {
  .colored-element {
    background-color: #2c3e50;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
```

**2. Images MUST be embedded or base64:**
```css
.logo {
  /* Won't work in Gotenberg header/footer */
  background-image: url('/images/logo.png');

  /* Will work - base64 data URL */
  background-image: url('data:image/png;base64,iVBORw0KGg...');
}
```

**3. Margins MUST be set in CSS, not API params:**
```css
@page {
  margin: 20mm 15mm 25mm 15mm;
}
```

**4. Headers/footers MUST be HTML elements, not @page margin boxes:**
```html
<!-- Use this -->
<header class="page-header" style="position: fixed; top: 0;">Header</header>

<!-- NOT this (won't work) -->
<style>
  @page {
    @top-center { content: "Header"; } /* Not supported */
  }
</style>
```

---

### 5.3 Gotenberg PDF Generation Best Practices

**Optimal @page configuration:**
```css
@page {
  size: A4 portrait;
  margin: 0; /* Remove browser defaults */
}

@media print {
  body {
    margin: 20mm 15mm 25mm 15mm; /* Add margins via body */
  }
}
```

**Why:** Setting `margin: 0` on `@page` removes browser's default header/footer lines

**Fixed header/footer pattern:**
```css
@media print {
  .page-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 40px;
    background-color: #f5f5f5;
    -webkit-print-color-adjust: exact;
    z-index: 1000;
  }

  .page-content {
    margin-top: 50px; /* MUST manually create space */
    margin-bottom: 40px;
  }
}
```

**Font sizes in header/footer:**
Use larger font sizes (14px+) to ensure readability in PDF output

**Source:** [PDF Gotchas with Headless Chrome](https://nathanfriend.com/2019/04/15/pdf-gotchas-with-headless-chrome.html), [Gotenberg GitHub Discussions](https://github.com/gotenberg/gotenberg/discussions/343)

---

### 5.4 Testing Gotenberg Output

**Workflow:**
1. Test in Chrome print preview first (closest to Gotenberg output)
2. Use `@media print` styles exclusively
3. Verify colors appear (check `-webkit-print-color-adjust`)
4. Check page breaks occur where expected
5. Generate PDF via Gotenberg and compare

**Common Issues:**
- **Preview looks good, PDF has no colors:** Add `-webkit-print-color-adjust: exact`
- **Content cut off:** Check margins on `body`, not just `@page`
- **Headers not appearing:** Verify `position: fixed` and check height doesn't exceed ~256px
- **Page breaks ignored:** Use both modern and legacy syntax (`break-*` and `page-break-*`)

---

## 6. Print vs. Screen Rendering Tips

### 6.1 The Fundamental Challenge

**Problem:** Web browsers render for continuous scrolling, PDFs are paginated

When converting flexible, dynamic web layouts into a fixed PDF format, things like absolute positioning or responsive breakpoints can behave unpredictably, leading to layout chaos. What looks perfect in the browser can turn into a chaotic mess in the PDF, with misaligned elements, content spilling across pages, or misplaced text.

**Source:** [CustomJS Common HTML-to-PDF Issues](https://www.customjs.space/blog/html-to-pdf-issues/)

---

### 6.2 Unified CSS Strategy

**Approach 1: Print-first design with screen overrides**

```css
/* Base styles optimized for print */
.section {
  break-inside: avoid;
  padding: 20px;
  margin-bottom: 20px;
}

/* Screen-specific overrides */
@media screen {
  .section {
    /* Allow natural scrolling */
    break-inside: auto;

    /* Add visual borders for screen */
    border: 1px solid #ddd;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
}

/* Print-specific refinements */
@media print {
  .section {
    /* No decorative borders */
    border: none;
    box-shadow: none;
  }
}
```

**Approach 2: Separate print stylesheet**

```html
<link rel="stylesheet" href="screen.css" media="screen">
<link rel="stylesheet" href="print.css" media="print">
```

**Recommended:** Use single stylesheet with `@media print` blocks for better maintainability

---

### 6.3 Making Screen Preview Match PDF Output

**Key Technique:** Apply print styles conditionally for preview mode

```css
/* Apply print styles in preview mode AND actual print */
@media print, (min-width: 0) and (print-preview) {
  /* Your print styles here */
}

/* Alternative: Use class-based approach */
.print-preview-mode {
  /* Mimic print styles in browser */
}

.print-preview-mode .section {
  break-inside: avoid;
  page-break-inside: avoid;
}
```

**JavaScript for preview toggle:**
```javascript
// Toggle print preview mode
function togglePrintPreview() {
  document.body.classList.toggle('print-preview-mode');
}
```

---

### 6.4 Page Break Visualization

**For screen preview, show where page breaks will occur:**

```css
@media screen {
  /* Add visual indicator for page breaks */
  .page-break::after {
    content: "--- PAGE BREAK ---";
    display: block;
    text-align: center;
    color: #e74c3c;
    border-top: 2px dashed #e74c3c;
    border-bottom: 2px dashed #e74c3c;
    padding: 10px;
    margin: 20px 0;
    background-color: #ffeaa7;
    font-weight: bold;
  }
}

@media print {
  .page-break {
    break-after: page;
    page-break-after: always;
  }

  .page-break::after {
    display: none;
  }
}
```

**Use Case:** Help users preview where content will split across pages

---

### 6.5 Ensuring Consistency

**Checklist for consistent rendering:**

1. **Use same units:** Prefer `mm`, `cm`, `in` for print (not `px`, `rem`, `em`)
2. **Avoid viewport units in print:** `vw`, `vh` behave unpredictably
3. **Test in Chrome print preview:** Closest to Gotenberg output
4. **Specify explicit dimensions:** Don't rely on auto-sizing
5. **Use web-safe fonts:** Or embed fonts with @font-face
6. **Avoid float layouts:** Use flexbox or grid for consistent rendering
7. **Set explicit colors:** Don't rely on browser defaults

**CSS units for print:**
```css
@media print {
  /* Prefer absolute units */
  .page-header {
    height: 10mm;
    padding: 3mm 5mm;
    font-size: 12pt;
  }

  /* Avoid relative units */
  .page-header {
    height: 3rem; /* Less predictable in print */
    padding: 1em 2em; /* Less predictable in print */
  }
}
```

---

### 6.6 Color Consistency

**Problem:** Colors look different in screen vs PDF

**Solution:**
```css
@media print {
  * {
    /* Force exact color rendering */
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Use explicit colors, not transparent */
  body {
    background-color: #ffffff; /* Not transparent */
    color: #000000;
  }
}
```

**Note:** Some PDF viewers apply their own color adjustments - test in multiple viewers

---

## 7. Recommended CSS Framework

### 7.1 Core Principles

1. **Mobile-first print design:** Design for smallest page size first
2. **Progressive enhancement:** Add screen enhancements on top of print base
3. **Defensive layering:** Multiple fallback mechanisms for page breaks
4. **Explicit everything:** Don't rely on browser defaults
5. **Test-driven:** Verify PDF output frequently during development

---

### 7.2 Recommended Base Print Stylesheet

```css
/* ============================================
   PRINT STYLESHEET - BASE CONFIGURATION
   ============================================ */

@page {
  size: A4 portrait;
  margin: 0; /* Remove browser defaults */
}

@media print {
  /* ========== RESET & FOUNDATIONS ========== */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  html, body {
    margin: 0;
    padding: 0;
    background-color: #ffffff;
    color: #000000;
    font-size: 12pt;
    line-height: 1.5;
    font-family: 'Georgia', 'Times New Roman', serif;
  }

  body {
    margin: 20mm 15mm 25mm 15mm;
  }

  /* ========== PAGE BREAKS ========== */
  h1 {
    break-before: page;
    break-after: avoid;
    page-break-before: always;
    page-break-after: avoid;
  }

  h2, h3, h4, h5, h6 {
    break-before: avoid;
    break-after: avoid;
    break-inside: avoid;
    page-break-before: avoid;
    page-break-after: avoid;
    page-break-inside: avoid;
  }

  /* Keep heading with following content */
  h2 + *, h3 + *, h4 + *, h5 + *, h6 + * {
    break-before: avoid;
    page-break-before: avoid;
  }

  /* ========== SECTION GROUPING ========== */
  .section-group {
    break-inside: avoid-page;
    page-break-inside: avoid;
    display: block;
  }

  .major-section {
    break-before: page;
    page-break-before: always;
  }

  /* ========== TABLES & FIGURES ========== */
  table, figure, img {
    break-inside: avoid;
    page-break-inside: avoid;
    max-width: 100%;
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }

  /* ========== ORPHANS & WIDOWS ========== */
  p {
    orphans: 3;
    widows: 3;
  }

  /* ========== HEADERS & FOOTERS ========== */
  .page-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 10mm;
    padding: 3mm 5mm;
    background-color: #f5f5f5;
    border-bottom: 1px solid #ddd;
    z-index: 1000;
  }

  .page-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 8mm;
    padding: 2mm 5mm;
    background-color: #f5f5f5;
    border-top: 1px solid #ddd;
    font-size: 10pt;
  }

  .page-content {
    margin-top: 15mm;
    margin-bottom: 12mm;
  }

  /* ========== HIDE SCREEN-ONLY ELEMENTS ========== */
  .no-print, nav, .navigation, .sidebar {
    display: none !important;
  }

  /* ========== SECTION SEPARATORS ========== */
  .section-title-page {
    break-before: page;
    break-after: page;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #2c3e50;
    color: #ffffff;
    width: 100vw;
    margin-left: calc(-50vw + 50%);
  }

  /* Hide header/footer on section title pages */
  .section-title-page .page-header,
  .section-title-page .page-footer {
    display: none;
  }

  /* ========== LINKS ========== */
  a {
    color: inherit;
    text-decoration: underline;
  }

  /* Show URLs in print (optional) */
  a[href^="http"]::after {
    content: " (" attr(href) ")";
    font-size: 10pt;
    color: #666;
  }
}
```

---

### 7.3 HTML Structure Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Property Appraisal Report</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <!-- Title Page (no header/footer) -->
  <div class="section-title-page">
    <h1>Property Appraisal Report</h1>
    <p class="subtitle">123 Main Street</p>
    <p class="date">December 9, 2025</p>
  </div>

  <!-- Regular Page with Header/Footer -->
  <header class="page-header">
    <div class="header-content">Appraisal Report - 123 Main Street</div>
  </header>

  <footer class="page-footer">
    <div class="footer-content">
      Page <span class="page-number"></span>
    </div>
  </footer>

  <main class="page-content">
    <!-- Table of Contents -->
    <section class="toc-container major-section">
      <h2>Table of Contents</h2>
      <div class="toc-entry">1. Executive Summary ............... 3</div>
      <div class="toc-entry">2. Property Description ........... 5</div>
      <!-- More entries -->
    </section>

    <!-- Content Sections -->
    <section class="major-section">
      <div class="section-group">
        <h2>Executive Summary</h2>
        <p>First paragraph stays with heading...</p>
      </div>

      <div class="section-group">
        <h3>Market Analysis</h3>
        <p>Content...</p>
      </div>
    </section>
  </main>
</body>
</html>
```

---

### 7.4 Modular CSS Organization

**Recommended file structure:**
```
styles/
  ├── print/
  │   ├── _base.css         (reset, @page, fonts)
  │   ├── _layout.css       (headers, footers, margins)
  │   ├── _page-breaks.css  (break control)
  │   ├── _sections.css     (section patterns)
  │   └── _utilities.css    (helpers)
  ├── screen/
  │   ├── _base.css
  │   ├── _components.css
  │   └── _responsive.css
  └── main.css              (imports all)
```

**main.css:**
```css
/* Print styles */
@import 'print/_base.css';
@import 'print/_layout.css';
@import 'print/_page-breaks.css';
@import 'print/_sections.css';
@import 'print/_utilities.css';

/* Screen styles */
@media screen {
  @import 'screen/_base.css';
  @import 'screen/_components.css';
  @import 'screen/_responsive.css';
}
```

---

## 8. Browser Support Matrix

### 8.1 CSS Paged Media Feature Support (2024-2025)

| Feature | Chrome/Gotenberg | Firefox | Safari | Notes |
|---------|------------------|---------|--------|-------|
| `@page` size | ✅ Full | ✅ Full | ✅ Full | Well supported |
| `@page` margins | ✅ Full | ✅ Full | ✅ Full | Well supported |
| `break-before` | ✅ v108+ | ❌ No | ❌ No | Chrome only since Dec 2022 |
| `break-after` | ✅ v108+ | ❌ No | ❌ No | Chrome only since Dec 2022 |
| `break-inside` | ✅ Full | ⚠️ Partial | ⚠️ Partial | Best supported |
| `page-break-before` | ✅ Full | ✅ Full | ✅ Full | Legacy - wide support |
| `page-break-after` | ✅ Full | ⚠️ Limited | ⚠️ Limited | Legacy - limited support |
| `page-break-inside` | ✅ Full | ✅ Full | ✅ Full | Legacy - best support |
| `orphans` | ✅ Full | ⚠️ Limited | ⚠️ Limited | Works for `<p>` mainly |
| `widows` | ✅ Full | ⚠️ Limited | ⚠️ Limited | Works for `<p>` mainly |
| Named pages | ❌ No | ❌ No | ❌ No | Not in browsers |
| Margin boxes | ❌ No | ❌ No | ❌ No | Not in browsers |
| Running headers | ❌ No | ❌ No | ❌ No | Not in browsers |
| `content` in @page | ❌ No | ❌ No | ❌ No | Not in browsers |
| Page counters | ⚠️ Limited | ⚠️ Limited | ⚠️ Limited | Basic support only |

**Source:** [Can I Use CSS Paged Media](https://caniuse.com/css-paged-media), [LambdaTest Browser Compatibility](https://www.lambdatest.com/web-technologies/css-paged-media)

---

### 8.2 Compatibility Score

**Overall CSS Paged Media Support:** 75/100

**Gotenberg/Chrome Headless:** Best support among browsers (75/100)
**Firefox:** Partial support (60/100)
**Safari:** Partial support (60/100)

**Recommendation:** Always use both modern and legacy syntax for maximum compatibility

```css
/* GOOD - Works everywhere */
.element {
  break-inside: avoid;      /* Modern */
  page-break-inside: avoid; /* Legacy fallback */
}

/* BAD - Won't work in Firefox/Safari */
.element {
  break-after: avoid; /* Modern only, limited support */
}
```

---

### 8.3 What to Avoid

❌ **DO NOT RELY ON:**
- `break-after: avoid` (no Firefox/Safari support)
- Named pages (no browser support)
- Margin boxes like `@top-center` (no browser support)
- Complex running headers via CSS (no browser support)
- External resources in `@page` rules (Gotenberg won't load them)

✅ **SAFE TO USE:**
- `@page` size and margins
- `page-break-inside: avoid` (wide support)
- `page-break-before: always` (wide support)
- `-webkit-print-color-adjust: exact` (Chromium/Gotenberg)
- Fixed positioned header/footer elements (HTML-based)
- Base64 embedded images
- Standard CSS layout (flexbox, grid)

---

## Summary & Quick Reference

### Key Takeaways

1. **Browser support is limited** - Always use both modern and legacy syntax
2. **Gotenberg doesn't support margin boxes** - Use HTML elements for headers/footers
3. **Wrapper containers are most reliable** - Keep heading with content via wrapping
4. **Colors require explicit property** - Always use `-webkit-print-color-adjust: exact`
5. **Test in Chrome print preview** - Closest match to Gotenberg PDF output
6. **Full-page section titles work best** - Avoid header/footer collision issues
7. **Defensive layering** - Multiple fallback mechanisms for critical features

---

### Essential CSS Snippet

**Copy-paste starter for any print project:**

```css
@page {
  size: A4 portrait;
  margin: 0;
}

@media print {
  * {
    -webkit-print-color-adjust: exact !important;
  }

  body {
    margin: 20mm 15mm;
  }

  h1, h2, h3, h4, h5, h6 {
    break-after: avoid;
    break-inside: avoid;
    page-break-after: avoid;
    page-break-inside: avoid;
  }

  .section-group {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  table, figure, img {
    break-inside: avoid;
    page-break-inside: avoid;
  }
}
```

---

## Sources

### Documentation & Specifications
- [MDN CSS Paged Media](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_paged_media)
- [MDN @page](https://developer.mozilla.org/en-US/docs/Web/CSS/@page)
- [MDN page-break-inside](https://developer.mozilla.org/en-US/docs/Web/CSS/page-break-inside)
- [MDN break-before](https://developer.mozilla.org/en-US/docs/Web/CSS/break-before)
- [W3C CSS Paged Media Module Level 3](https://www.w3.org/TR/css-page-3/)
- [DocRaptor CSS Paged Media](https://docraptor.com/css-paged-media)

### Browser Support
- [Can I Use CSS Paged Media](https://caniuse.com/css-paged-media)
- [LambdaTest Browser Compatibility](https://www.lambdatest.com/web-technologies/css-paged-media)

### Technical Articles
- [Smashing Magazine: CSS Fragmentation](https://www.smashingmagazine.com/2019/02/css-fragmentation/)
- [Smashing Magazine: Designing for Print with CSS](https://www.smashingmagazine.com/2015/01/designing-for-print-with-css/)
- [CSS-Tricks: page-break](https://css-tricks.com/almanac/properties/p/page-break/)
- [CSS-Tricks: orphans](https://css-tricks.com/almanac/properties/o/orphans/)
- [CSS-Tricks: print-color-adjust](https://css-tricks.com/almanac/properties/p/print-color-adjust/)

### Gotenberg-Specific
- [Gotenberg Routes Documentation](https://gotenberg.dev/docs/routes)
- [Gotenberg GitHub Discussion #572 (Background Colors)](https://github.com/gotenberg/gotenberg/discussions/572)
- [Gotenberg GitHub Discussion #416 (Dynamic Headers)](https://github.com/gotenberg/gotenberg/discussions/416)
- [Gotenberg GitHub Discussion #343 (Margin Issues)](https://github.com/gotenberg/gotenberg/discussions/343)
- [Medium: Generating PDFs with Gotenberg](https://medium.com/@annabi.medamine/generating-pdfs-from-html-using-gotenberg-a-practical-integration-story-d1792080c00b)
- [PDF Gotchas with Headless Chrome](https://nathanfriend.com/2019/04/15/pdf-gotchas-with-headless-chrome.html)

### Chrome/Headless
- [Chrome Developers: Print Margins](https://developer.chrome.com/blog/print-margins)
- [Excessively Adequate: Chrome Print CSS](https://excessivelyadequate.com/posts/print.html)
- [Andre.arko: Chrome Headless Print Differences](https://andre.arko.net/2025/05/25/chrome-headless-print-to-pdf/)

### Print CSS Patterns
- [PrintCSS: Running Headers and Footers](https://printcss.net/articles/running-headers-and-footers)
- [PrintCSS: Page Margin Boxes](https://printcss.net/articles/page-margin-boxes)
- [Print-CSS.rocks: Named Pages](https://print-css.rocks/lesson/lesson-named-pages)
- [CustomJS: HTML Print Pagination](https://www.customjs.space/blog/html-print-pagination-footer/)
- [CustomJS: Common HTML-to-PDF Issues](https://www.customjs.space/blog/html-to-pdf-issues/)
- [SitePoint: CSS Printer-Friendly Pages](https://www.sitepoint.com/css-printer-friendly-pages/)

### Section Dividers
- [FreeCodeCamp: Section Divider Using CSS](https://www.freecodecamp.org/news/section-divider-using-css/)
- [wweb.dev: CSS Separator Generator](https://wweb.dev/resources/css-separator-generator)
- [W3Schools: How To Create Dividers](https://www.w3schools.com/howto/howto_css_dividers.asp)

### Additional Resources
- [Steve Fenton: CSS Paged Media Dynamic Headers](https://stevefenton.co.uk/blog/2013/12/using-css-paged-media-to-add-dynamic-headers/)
- [CSS4.pub: Running Headers](https://css4.pub/2023/running-headers/)
- [Clagnut: Pagination Widows](https://clagnut.com/blog/2426)
- [GeeksforGeeks: CSS page-break-inside Property](https://www.geeksforgeeks.org/css/css-page-break-inside-property/)
- [DocuSeal: CSS Print Page Styling](https://www.docuseal.com/blog/css-print-page-style)

---

**Document Version:** 1.0
**Last Updated:** 2025-12-09
**Maintained By:** APR Dashboard Development Team
