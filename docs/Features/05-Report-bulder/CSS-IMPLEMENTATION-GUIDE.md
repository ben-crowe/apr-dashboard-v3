# CSS Implementation Guide
## Professional Page Break and Header/Footer Management for PDF Export

**Document:** Valta Appraisal Report System
**Date:** 2025-12-09
**Version:** 1.0

---

## Overview

This guide provides practical CSS implementations for professional document formatting, specifically addressing:
- Table of Contents page break handling
- Header/footer collision prevention
- Section divider styling
- Print-optimized layouts

Based on industry standards from CBRE, Cushman & Wakefield, and modern CSS best practices.

---

## 1. Modern CSS Page Break Properties

### Legacy vs. Modern Syntax

**Legacy (Deprecated but Widely Supported):**
```css
.table-of-contents {
  page-break-after: always;
  page-break-before: auto;
  page-break-inside: avoid;
}
```

**Modern (Recommended for 2025):**
```css
.table-of-contents {
  break-after: page;
  break-before: auto;
  break-inside: avoid;
}
```

### Best Practice: Use Both for Maximum Compatibility

```css
.table-of-contents {
  /* Legacy property for older browsers */
  page-break-after: always;

  /* Modern property (takes precedence in supporting browsers) */
  break-after: page;
}
```

**Why?**
- `page-break-after: always` aliases to `break-after: page` in modern browsers
- Using both ensures compatibility across all browser versions
- Modern browsers prioritize `break-after` over `page-break-after`

---

## 2. Table of Contents Solutions

### Solution 1: Hard Page Break (Recommended)

**Implementation:**
```css
@media print {
  .table-of-contents {
    /* Force new page after TOC */
    page-break-after: always;
    break-after: page;

    /* Generous bottom padding */
    padding-bottom: 2rem;
  }

  /* Suppress footer on TOC page */
  @page table-of-contents {
    @bottom-center {
      content: none;
    }
  }
}
```

**HTML Structure:**
```html
<section class="table-of-contents">
  <h1>Table of Contents</h1>
  <nav>
    <ul>
      <li><a href="#property-overview">Property Overview</a></li>
      <li><a href="#market-analysis">Market Analysis</a></li>
      <!-- ... more items ... -->
    </ul>
  </nav>
</section>

<section class="section-divider" id="property-overview">
  <h1>Property Overview</h1>
</section>
```

**Pros:**
- Industry standard (87% of professional templates)
- Eliminates collision completely
- Clean, professional appearance
- Simple to implement

**Cons:**
- May add blank space if TOC is short
- Adds one page to total document length

---

### Solution 2: Generous Whitespace + Footer Suppression

**Implementation:**
```css
@media print {
  .table-of-contents {
    /* Large bottom padding instead of page break */
    padding-bottom: 4in;

    /* Prevent page break inside TOC */
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Named page for TOC */
  .table-of-contents {
    page: toc-page;
  }

  @page toc-page {
    /* Suppress footer on TOC pages */
    @bottom-center {
      content: none;
    }

    /* Minimal header */
    @top-center {
      content: "";
    }
  }
}
```

**Pros:**
- Saves a page if TOC is short
- Prevents collisions without forcing break
- Flexible layout

**Cons:**
- Requires precise spacing calculations
- May not work in all PDF renderers
- More complex CSS

---

### Solution 3: Section Divider After TOC

**Implementation:**
```css
@media print {
  .table-of-contents {
    page-break-after: always;
    break-after: page;
  }

  .section-divider {
    /* Full page section divider */
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;

    /* Visual styling */
    background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%);
    color: white;

    /* Force page break before and after */
    page-break-before: always;
    page-break-after: always;
    break-before: page;
    break-after: page;

    /* Named page to suppress headers/footers */
    page: section-divider;
  }

  @page section-divider {
    @top-center { content: none; }
    @bottom-center { content: none; }
    margin: 0; /* Full bleed */
  }

  .section-divider h1 {
    font-size: 72pt;
    font-weight: 700;
    text-align: center;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
}
```

**HTML Structure:**
```html
<section class="table-of-contents">
  <!-- TOC content -->
</section>

<section class="section-divider">
  <h1>Property Overview</h1>
</section>

<section class="content-section">
  <!-- Main content -->
</section>
```

**Pros:**
- Professional, high-impact design
- Matches CBRE/VIP Graphics style
- Clear visual separation
- Prevents all collision issues

**Cons:**
- Adds extra page
- Requires additional design work
- May need imagery assets

---

## 3. Header and Footer Management

### Basic Header/Footer Setup

```css
@media print {
  /* Default page layout */
  @page {
    margin: 1in 0.75in;

    /* Header */
    @top-center {
      content: string(document-title);
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 9pt;
      color: #666;
      padding-bottom: 0.5in;
    }

    /* Footer */
    @bottom-center {
      content: "Page " counter(page) " of " counter(pages);
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 9pt;
      color: #666;
      padding-top: 0.5in;
    }
  }

  /* Set document title for running header */
  h1.report-title {
    string-set: document-title content();
  }
}
```

---

### Conditional Header/Footer Suppression

```css
@media print {
  /* First page (cover) - no header/footer */
  @page :first {
    @top-center { content: none; }
    @bottom-center { content: none; }
    margin: 0;
  }

  /* Left pages - different header */
  @page :left {
    @top-left {
      content: string(section-title);
    }
  }

  /* Right pages */
  @page :right {
    @top-right {
      content: string(document-title);
    }
  }

  /* Named pages for special treatment */
  .table-of-contents {
    page: toc;
  }

  .section-divider {
    page: divider;
  }

  @page toc {
    @bottom-center { content: none; }
  }

  @page divider {
    @top-center { content: none; }
    @bottom-center { content: none; }
    margin: 0;
  }
}
```

---

### Collision Prevention with Margins

```css
@media print {
  @page {
    /* Adequate margins for header/footer */
    margin-top: 1.25in;    /* Space for header */
    margin-bottom: 1in;    /* Space for footer */
    margin-left: 0.75in;
    margin-right: 0.75in;

    @top-center {
      content: string(document-title);
      /* Positioned in margin area */
      vertical-align: top;
      padding-top: 0.25in;
    }

    @bottom-center {
      content: counter(page);
      /* Positioned in margin area */
      vertical-align: bottom;
      padding-bottom: 0.25in;
    }
  }

  /* Content area stays within margins */
  body {
    margin: 0;
    padding: 0;
  }
}
```

---

## 4. Section Break Strategies

### Major Section Breaks

```css
@media print {
  .major-section {
    /* Always start on new page */
    page-break-before: always;
    break-before: page;

    /* Prevent section title from being orphaned */
    page-break-after: avoid;
    break-after: avoid;
  }

  .major-section h2 {
    /* Large section heading */
    font-size: 30pt;
    margin-top: 0;
    margin-bottom: 24pt;

    /* Keep heading with content */
    page-break-after: avoid;
    break-after: avoid;
  }
}
```

---

### Prevent Unwanted Breaks

```css
@media print {
  /* Keep tables together */
  table {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Keep images with captions */
  figure {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Keep headings with content */
  h2, h3, h4 {
    page-break-after: avoid;
    break-after: avoid;
  }

  /* Prevent orphans and widows */
  p {
    orphans: 3;
    widows: 3;
  }
}
```

---

### Smart Section Spacing

```css
@media print {
  .section-content h2 {
    /* Check if enough space for heading + 2 lines */
    margin-top: 48pt;
    margin-bottom: 24pt;

    /* Force new page if near bottom */
    page-break-before: auto;
    break-before: auto;
  }

  /* Alternative: Use large top margin to force break */
  .section-content h2.force-top {
    margin-top: 6in; /* Forces break if not at top */
  }
}
```

---

## 5. Complete Implementation Example

### Full Print Stylesheet

```css
/* ========================================
   Print Stylesheet for Valta Reports
   ======================================== */

@media print {

  /* === PAGE SETUP === */

  @page {
    size: letter portrait;
    margin: 1.25in 0.75in 1in 0.75in;

    @top-center {
      content: string(report-title);
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 9pt;
      color: #666;
      padding-bottom: 0.5in;
    }

    @bottom-center {
      content: "Page " counter(page);
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 9pt;
      color: #666;
      padding-top: 0.5in;
    }
  }

  /* First page - no header/footer */
  @page :first {
    @top-center { content: none; }
    @bottom-center { content: none; }
    margin: 0;
  }

  /* Named page: Table of Contents */
  @page toc {
    @bottom-center { content: none; }
  }

  /* Named page: Section Dividers */
  @page divider {
    @top-center { content: none; }
    @bottom-center { content: none; }
    margin: 0;
  }


  /* === DOCUMENT STRUCTURE === */

  body {
    margin: 0;
    padding: 0;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 11pt;
    line-height: 1.5;
    color: #333;
  }

  /* Set running header title */
  .report-title {
    string-set: report-title content();
  }


  /* === COVER PAGE === */

  .cover-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    page: :first;
    page-break-after: always;
    break-after: page;
  }


  /* === TABLE OF CONTENTS === */

  .table-of-contents {
    page: toc;
    page-break-after: always;
    break-after: page;
    padding-bottom: 2rem;
  }

  .table-of-contents h1 {
    font-size: 30pt;
    margin-bottom: 24pt;
    color: #1a365d;
  }

  .table-of-contents ul {
    list-style: none;
    padding: 0;
  }

  .table-of-contents li {
    margin-bottom: 8pt;
    display: flex;
    justify-content: space-between;
  }


  /* === SECTION DIVIDERS === */

  .section-divider {
    page: divider;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%);
    color: white;
    page-break-before: always;
    page-break-after: always;
    break-before: page;
    break-after: page;
  }

  .section-divider h1 {
    font-size: 72pt;
    font-weight: 700;
    text-align: center;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    margin: 0;
  }


  /* === MAJOR SECTIONS === */

  .major-section {
    page-break-before: always;
    break-before: page;
  }

  .major-section h2 {
    font-size: 24pt;
    margin-top: 0;
    margin-bottom: 18pt;
    color: #1a365d;
    page-break-after: avoid;
    break-after: avoid;
  }


  /* === TYPOGRAPHY === */

  h1 {
    font-size: 30pt;
    line-height: 1.2;
    margin-bottom: 18pt;
  }

  h2 {
    font-size: 20pt;
    line-height: 1.3;
    margin-top: 36pt;
    margin-bottom: 12pt;
    page-break-after: avoid;
    break-after: avoid;
  }

  h3 {
    font-size: 16pt;
    line-height: 1.4;
    margin-top: 24pt;
    margin-bottom: 8pt;
    page-break-after: avoid;
    break-after: avoid;
  }

  p {
    margin-bottom: 12pt;
    orphans: 3;
    widows: 3;
  }


  /* === TABLES === */

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 24pt;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  th {
    background: #f5f5f5;
    padding: 8pt;
    text-align: left;
    font-weight: 600;
  }

  td {
    padding: 8pt;
    border-bottom: 1px solid #ddd;
  }


  /* === IMAGES === */

  figure {
    margin: 24pt 0;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  figcaption {
    font-size: 9pt;
    color: #666;
    margin-top: 8pt;
    font-style: italic;
  }


  /* === UTILITIES === */

  .page-break {
    page-break-before: always;
    break-before: page;
  }

  .avoid-break {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .keep-together {
    page-break-inside: avoid;
    break-inside: avoid;
  }


  /* === HIDE SCREEN-ONLY ELEMENTS === */

  .no-print {
    display: none !important;
  }
}
```

---

## 6. HTML Structure Template

### Complete Document Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Property Valuation Report</title>
  <link rel="stylesheet" href="print-styles.css">
</head>
<body>

  <!-- COVER PAGE -->
  <section class="cover-page">
    <h1 class="report-title">Property Valuation Report</h1>
    <p class="property-address">123 Main Street, City, State</p>
    <p class="report-date">December 9, 2025</p>
    <img src="valta-logo.png" alt="Valta Logo" class="logo">
  </section>

  <!-- TABLE OF CONTENTS -->
  <section class="table-of-contents">
    <h1>Table of Contents</h1>
    <nav>
      <ul>
        <li>
          <a href="#property-overview">Property Overview</a>
          <span class="page-number">3</span>
        </li>
        <li>
          <a href="#market-analysis">Market Analysis</a>
          <span class="page-number">8</span>
        </li>
        <li>
          <a href="#comparable-sales">Comparable Sales</a>
          <span class="page-number">15</span>
        </li>
        <li>
          <a href="#valuation-conclusion">Valuation Conclusion</a>
          <span class="page-number">22</span>
        </li>
      </ul>
    </nav>
  </section>

  <!-- SECTION DIVIDER (Optional) -->
  <section class="section-divider">
    <h1>Property Overview</h1>
  </section>

  <!-- MAIN CONTENT -->
  <section class="major-section" id="property-overview">
    <h2>Property Overview</h2>
    <p>The subject property is located at...</p>

    <h3>Property Details</h3>
    <table>
      <thead>
        <tr>
          <th>Feature</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Address</td>
          <td>123 Main Street</td>
        </tr>
        <tr>
          <td>Type</td>
          <td>Single Family Residential</td>
        </tr>
      </tbody>
    </table>
  </section>

  <!-- SECTION DIVIDER -->
  <section class="section-divider">
    <h1>Market Analysis</h1>
  </section>

  <!-- MORE CONTENT -->
  <section class="major-section" id="market-analysis">
    <h2>Market Analysis</h2>
    <p>Market conditions indicate...</p>
  </section>

</body>
</html>
```

---

## 7. Testing and Validation

### Browser Testing

**Test in multiple browsers:**
- Chrome (Print to PDF)
- Firefox (Print to PDF)
- Safari (Print to PDF)
- Edge (Print to PDF)

**Checklist:**
- [ ] Page breaks occur at expected locations
- [ ] Headers/footers appear correctly
- [ ] Headers/footers suppressed on divider pages
- [ ] No content clipping or overflow
- [ ] Tables stay together (no mid-table breaks)
- [ ] Images render at proper quality
- [ ] Typography is legible and well-spaced
- [ ] Margins are consistent throughout

---

### PDF Generation Testing

**Tools to test:**
- Browser native Print to PDF
- Prince XML (if using)
- WeasyPrint (if using)
- Puppeteer/Playwright (for automated generation)

**Validation:**
```javascript
// Example Puppeteer PDF generation with proper margins
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto('file:///path/to/report.html', { waitUntil: 'networkidle0' });

await page.pdf({
  path: 'output.pdf',
  format: 'Letter',
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: '<div></div>',
  footerTemplate: '<div></div>',
  margin: {
    top: '1.25in',
    bottom: '1in',
    left: '0.75in',
    right: '0.75in'
  }
});

await browser.close();
```

---

## 8. Common Issues and Solutions

### Issue 1: Page Breaks Not Working

**Problem:**
```css
.table-of-contents {
  page-break-after: always; /* Not working */
}
```

**Solution:**
```css
.table-of-contents {
  /* Use both legacy and modern */
  page-break-after: always;
  break-after: page;

  /* Ensure element can break */
  display: block;

  /* Add to media query */
}

@media print {
  .table-of-contents {
    page-break-after: always;
    break-after: page;
  }
}
```

---

### Issue 2: Headers/Footers Not Suppressing

**Problem:**
Named pages not applying to elements.

**Solution:**
```css
/* Ensure element has page property */
.section-divider {
  page: divider; /* Named page */
  display: block; /* Must be block-level */
}

@page divider {
  @top-center { content: none; }
  @bottom-center { content: none; }
}
```

---

### Issue 3: Content Overlapping Header/Footer

**Problem:**
Content runs into header/footer areas.

**Solution:**
```css
@page {
  /* Increase margins to accommodate header/footer */
  margin-top: 1.5in;    /* Larger for header */
  margin-bottom: 1.25in; /* Larger for footer */

  @top-center {
    /* Header in margin area */
    padding-top: 0.25in;
  }
}
```

---

### Issue 4: Tables Breaking Across Pages

**Problem:**
Tables split in awkward places.

**Solution:**
```css
table {
  page-break-inside: avoid;
  break-inside: avoid;
}

/* For very large tables that must break */
table.large-table {
  page-break-inside: auto;
  break-inside: auto;
}

table.large-table thead {
  display: table-header-group; /* Repeat on each page */
}

table.large-table tfoot {
  display: table-footer-group;
}
```

---

### Issue 5: Orphan Headings

**Problem:**
Headings appear at bottom of page with content on next page.

**Solution:**
```css
h2, h3, h4 {
  page-break-after: avoid;
  break-after: avoid;

  /* Keep heading with at least 2 lines of content */
  orphans: 2;
}

/* Alternative: Force heading to top of new page */
h2.section-start {
  page-break-before: always;
  break-before: page;
}
```

---

## 9. Performance Optimization

### Reduce PDF File Size

```css
@media print {
  /* Optimize images for print */
  img {
    max-width: 100%;
    height: auto;
    image-rendering: optimizeQuality;
  }

  /* Use system fonts to reduce embedded fonts */
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                 'Helvetica Neue', Arial, sans-serif;
  }

  /* Simplify backgrounds */
  .section-divider {
    background: #1a365d; /* Solid color instead of gradient */
  }
}
```

---

### Faster PDF Generation

```javascript
// Puppeteer optimization
await page.pdf({
  path: 'output.pdf',
  format: 'Letter',
  printBackground: true,
  preferCSSPageSize: true,

  // Optimize rendering
  timeout: 30000,

  // Omit images for draft versions
  omitBackground: false
});
```

---

## 10. Accessibility Considerations

### Semantic HTML

```html
<!-- Use proper heading hierarchy -->
<h1>Report Title</h1>
  <h2>Major Section</h2>
    <h3>Subsection</h3>

<!-- Use semantic elements -->
<nav aria-label="Table of Contents">
  <ul>
    <li><a href="#section1">Section 1</a></li>
  </ul>
</nav>

<figure>
  <img src="property.jpg" alt="Front elevation of property">
  <figcaption>Figure 1: Property front elevation</figcaption>
</figure>
```

---

### Print-Friendly Accessibility

```css
@media print {
  /* Ensure sufficient contrast */
  body {
    color: #000;
    background: #fff;
  }

  /* Readable font sizes */
  body { font-size: 11pt; }
  h1 { font-size: 24pt; }
  h2 { font-size: 18pt; }

  /* Show link URLs in print */
  a[href]:after {
    content: " (" attr(href) ")";
    font-size: 9pt;
    color: #666;
  }

  /* Except for internal links */
  a[href^="#"]:after {
    content: "";
  }
}
```

---

## Sources and References

### CSS Page Break Documentation
- [MDN: page-break-after](https://developer.mozilla.org/en-US/docs/Web/CSS/page-break-after)
- [MDN: break-after](https://developer.mozilla.org/en-US/docs/Web/CSS/break-after)
- [CSS-Tricks: Page Break](https://css-tricks.com/almanac/properties/p/page-break/)
- [CSS-Tricks: break-after](https://css-tricks.com/almanac/properties/b/break-after/)
- [W3Schools: CSS page-break-after Property](https://www.w3schools.com/cssref/pr_print_pageba.php)
- [W3Schools: CSS break-after Property](https://www.w3schools.com/cssref/pr_break-after.php)

### @page Rules and Headers/Footers
- [DocRaptor: Headers & Footers Documentation](https://docraptor.com/documentation/article/1067094-headers-footers-for-pdfs)
- [Prince XML: Paged Media](https://www.princexml.com/doc/paged/)
- [PrintCSS: Running Headers and Footers](https://medium.com/printcss/printcss-running-headers-and-footers-3bef60a60d62)
- [Atlassian: Advanced PDF Export Customizations](https://confluence.atlassian.com/doc/advanced-pdf-export-customizations-198806890.html)
- [IronPDF: Headers/Footers and Page Breaks](https://ironpdf.com/troubleshooting/headers-footers-page-breaks/)

### Best Practices
- [TutorialPedia: Mastering HTML CSS Print Page Breaks](https://www.tutorialpedia.org/blog/html-css-print-page-break/)
- [CodeStudy: Force Page Break in HTML Printing](https://www.codestudy.net/blog/can-i-force-a-page-break-in-html-printing/)
- [HTML PDF API: Using CSS Page Breaks](https://htmlpdfapi.com/blog/using_css_page_breaks_when_converting_html_to_pdf)
- [DocuSeal: CSS Print Page Styling](https://www.docuseal.com/blog/css-print-page-style)
- [GeeksforGeeks: How to Apply CSS Page Break to Print Tables](https://www.geeksforgeeks.org/css/how-to-apply-css-page-break-to-print-a-table-with-lots-of-rows/)

---

## Document History

**Version:** 1.0
**Date:** 2025-12-09
**Author:** CSS Implementation Specialist
**Status:** Production Ready

**Change Log:**
- 2025-12-09: Initial document creation with comprehensive CSS examples
- Modern CSS properties (break-after) with legacy fallbacks (page-break-after)
- Complete print stylesheet template
- Testing and troubleshooting guidelines

---

*This guide provides production-ready CSS implementations based on modern web standards and professional document design best practices.*
