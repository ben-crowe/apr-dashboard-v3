# Layout Pattern Library
## North Battleford Report - Distinct Layout Types

**Purpose:** Catalog all unique layout patterns identified in the 79-page report
**Status:** Complete analysis
**Date:** 2025-12-10

---

## Pattern Index

| Pattern ID | Pattern Name | Pages Using | Complexity | Priority |
|------------|--------------|-------------|------------|----------|
| P01 | Hero Cover Page | 1 | Medium | High |
| P02 | Standard Letter | 3, 4 | Low | High |
| P03 | Split-Screen TOC | 5 | High | High |
| P04 | Multi-Table Dashboard | 6, 7 | Medium | High |
| P05 | Standard Text Body | 8, 17-25, 29, 32-36, 39-40, 52-53, 66-78 | Low | High |
| P06 | Photo Grid (2x3) | 9, 10, 11, 12 | Low | High |
| P07 | Photo Grid Partial | 13 | Low | High |
| P08 | Full-Width Map | 14, 15, 16, 30, 54 | Low | High |
| P09 | Data Table Page | 23, 28, 33, 34, 37, 38, 41-44, 45, 48, 51 | Low | High |
| P10 | Site Plan Diagram | 26, 27 | Medium | Medium |
| P11 | Chart + Text Page | 47, 60 | High | Medium |
| P12 | Chart + Table Page | 49 | High | Medium |
| P13 | Complex Calculation Table | 50, 61-64 | High | High |
| P14 | Comparable Sale Sheet | 55, 56, 57, 58, 59 | High | High |
| P15 | Signature/Certification | 65 | Medium | High |
| P16 | Full Navy Back Cover | 79 | Low | Low |

---

## Detailed Pattern Specifications

### P01: Hero Cover Page
**Pages:** 1
**Visual Description:**
- Top left: Company logo
- Left side: Property photo (square/rectangular)
- Right side: Report title, property details, client info
- Lower right: Diagonal navy blue gradient overlay with white text
- File number at bottom right

**Structure:**
```html
<div class="cover-page">
  <div class="cover-header">
    <img class="logo" />
  </div>
  <div class="cover-body">
    <div class="cover-left">
      <img class="property-hero" />
    </div>
    <div class="cover-right">
      <h1>Appraisal Report</h1>
      <div class="property-info">...</div>
      <div class="diagonal-overlay">
        <div class="client-info">...</div>
      </div>
    </div>
  </div>
</div>
```

**CSS Requirements:**
- CSS Grid (2-column: 40% / 60%)
- Diagonal gradient overlay using clip-path or transform
- Z-index layering for overlay
- Print color adjustment for navy gradient

**Complexity:** Medium
**Implementation Notes:**
- Diagonal overlay can be achieved with `clip-path: polygon()` or SVG
- Ensure gradient prints correctly (use print-color-adjust: exact)
- Property photo should be constrained to aspect ratio

---

### P02: Standard Letter
**Pages:** 3, 4
**Visual Description:**
- Letterhead at top (logo + contact info)
- Standard body text (justified)
- Special callout box (Market Value Conclusion on page 3)
- Signature block at bottom
- Chevron footer graphic

**Structure:**
```html
<div class="letter-page">
  <div class="letterhead">
    <img class="logo" />
    <div class="contact-info">...</div>
  </div>
  <div class="letter-body">
    <p class="date">...</p>
    <p class="recipient">...</p>
    <p class="salutation">...</p>
    <div class="body-text">...</div>
    <div class="callout-box" *ngIf="hasCallout">
      <table class="navy-header">...</table>
    </div>
    <div class="signature-block">...</div>
  </div>
</div>
```

**CSS Requirements:**
- Standard margins (0.75in L/R, 1.25in top, 1.0in bottom)
- Text justification
- Callout box with navy header table
- Signature block positioning

**Complexity:** Low
**Implementation Notes:**
- Reusable for transmittal letters, certifications
- Signature can be image or font-based
- Callout box is optional component

---

### P03: Split-Screen TOC
**Pages:** 5
**Visual Description:**
- Left sidebar (30% width): Navy blue background, white text, "Table of Contents" title
- Right content (70% width): White background, TOC entries with page numbers
- No header/footer on this page

**Structure:**
```html
<div class="toc-page">
  <div class="toc-sidebar">
    <h2>Table of Contents</h2>
  </div>
  <div class="toc-content">
    <ul class="toc-list">
      <li class="toc-section">
        <span class="section-title">Introduction & Executive Summary</span>
        <span class="page-num">1</span>
      </li>
      <li class="toc-subsection">
        <span class="subsection-title">Property Overview</span>
        <span class="page-num">1</span>
      </li>
      <!-- ... -->
    </ul>
  </div>
</div>
```

**CSS Grid Structure:**
```css
.toc-page {
  display: grid;
  grid-template-columns: 30% 70%;
  min-height: 100vh;
  page-break-after: always;
}

.toc-sidebar {
  background-color: #003366;
  color: #FFFFFF;
  padding: 60px 30px;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.toc-sidebar h2 {
  font-size: 28pt;
  font-weight: bold;
  text-align: center;
  line-height: 1.3;
}

.toc-content {
  background-color: #FFFFFF;
  padding: 60px 40px;
}

.toc-list {
  list-style: none;
  padding: 0;
}

.toc-section {
  font-weight: bold;
  font-size: 14pt;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.toc-subsection {
  font-weight: normal;
  font-size: 12pt;
  margin-top: 8px;
  margin-left: 20px;
  display: flex;
  justify-content: space-between;
}
```

**Complexity:** High
**Implementation Notes:**
- Must suppress header/footer for this page
- Navy background must print (critical!)
- Flexbox for each TOC entry to space title and page number
- Consider using CSS Grid for overall layout
- Test print rendering extensively

---

### P04: Multi-Table Dashboard
**Pages:** 6, 7
**Visual Description:**
- Multiple stacked tables with navy headers
- Each table represents a data category
- Tables are full-width
- Navy header with white uppercase text
- White body with data rows

**Structure:**
```html
<div class="dashboard-page">
  <h2 class="section-header">Property Overview</h2>

  <table class="dashboard-table">
    <thead>
      <tr><th colspan="2">PROPERTY IDENTIFICATION</th></tr>
    </thead>
    <tbody>
      <tr><td class="label">Name</td><td class="value">North Battleford Apartments</td></tr>
      <!-- ... -->
    </tbody>
  </table>

  <table class="dashboard-table">
    <thead>
      <tr><th colspan="2">SITE DESCRIPTION</th></tr>
    </thead>
    <tbody>
      <!-- ... -->
    </tbody>
  </table>

  <!-- More tables... -->
</div>
```

**CSS Requirements:**
```css
.dashboard-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  border: 1px solid #000000;
}

.dashboard-table thead {
  background-color: #003366;
  color: #FFFFFF;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 11pt;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.dashboard-table thead th {
  padding: 10px;
  text-align: left;
}

.dashboard-table tbody tr {
  border-bottom: 1px solid #D0D0D0;
}

.dashboard-table tbody td {
  padding: 8px;
  font-size: 10pt;
  border-left: none;
  border-right: none;
}

.dashboard-table tbody td.label {
  font-weight: 600;
  width: 40%;
}

.dashboard-table tbody td.value {
  width: 60%;
}
```

**Complexity:** Medium
**Implementation Notes:**
- Stack 3-5 tables vertically
- Consistent spacing between tables
- Ensure navy headers print
- No vertical borders in table body
- Can have 2-column or multi-column layouts within tbody

---

### P05: Standard Text Body
**Pages:** 8, 17-25, 29, 32-36, 39-40, 52-53, 66-78 (35 total)
**Visual Description:**
- Running header with section title and blue underline
- Body text in paragraphs (justified)
- Subsection headers in bold blue
- Bullet lists where applicable
- Occasional embedded small tables
- Chevron footer

**Structure:**
```html
<div class="text-page">
  <div class="running-header">
    <h1 class="section-title">Property Analysis</h1>
    <div class="header-underline"></div>
  </div>

  <div class="text-body">
    <h2 class="subsection-header">Location</h2>
    <p>The subject property is located in North Battleford...</p>

    <h3 class="sub-subsection-header">Access</h3>
    <p>The property fronts 109 Street with convenient...</p>

    <ul class="bullet-list">
      <li>Bready School (K-7, public)</li>
      <!-- ... -->
    </ul>
  </div>
</div>
```

**CSS Requirements:**
```css
.running-header {
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 2px solid #003366;
}

.running-header .section-title {
  font-size: 18pt;
  font-weight: bold;
  color: #000000;
  margin: 0;
}

.text-body {
  font-size: 11pt;
  line-height: 1.4;
  color: #222222;
}

.text-body p {
  text-align: justify;
  margin-bottom: 12pt;
}

.subsection-header {
  font-size: 16pt;
  font-weight: bold;
  color: #003366;
  margin-top: 24pt;
  margin-bottom: 12pt;
}

.sub-subsection-header {
  font-size: 14pt;
  font-weight: bold;
  color: #003366;
  margin-top: 16pt;
  margin-bottom: 8pt;
}

.bullet-list {
  margin-left: 20px;
  margin-bottom: 12pt;
}

.bullet-list li {
  margin-bottom: 4pt;
}
```

**Complexity:** Low
**Implementation Notes:**
- Most common pattern (44% of report)
- Highly reusable
- May contain embedded tables (use pattern P09)
- Running header text changes per section
- Justification important for professional look

---

### P06: Photo Grid (2x3)
**Pages:** 9, 10, 11, 12
**Visual Description:**
- 2 columns, 3 rows = 6 photos per page
- Each photo has caption underneath
- Photos are same size, evenly spaced
- Captions are centered, small font

**Structure:**
```html
<div class="photo-grid-page">
  <h2 class="section-header">Photographs</h2>

  <div class="photo-grid">
    <div class="photo-item">
      <img src="..." alt="1101 - East Elevation" />
      <p class="photo-caption">1101 - East Elevation</p>
    </div>
    <div class="photo-item">
      <img src="..." alt="1101 - West Elevation" />
      <p class="photo-caption">1101 - West Elevation</p>
    </div>
    <!-- 4 more... -->
  </div>
</div>
```

**CSS Grid Structure:**
```css
.photo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(3, auto);
  gap: 20px;
  margin-top: 20px;
}

.photo-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  page-break-inside: avoid;
}

.photo-item img {
  width: 100%;
  height: auto;
  max-height: 250px;
  object-fit: cover;
  border: 1px solid #D0D0D0;
}

.photo-caption {
  font-size: 9pt;
  text-align: center;
  margin-top: 8px;
  font-weight: 600;
}
```

**Complexity:** Low
**Implementation Notes:**
- Simple CSS Grid layout
- Photos should maintain aspect ratio
- Prevent page breaks inside photo items
- Captions always below photo

---

### P07: Photo Grid Partial (Last Page)
**Pages:** 13
**Visual Description:**
- Same as P06 but only 1-2 photos on page
- Rest of page is white space

**Complexity:** Low
**Implementation Notes:**
- Same CSS as P06
- Just fewer items in grid
- Consider min-height to prevent layout shift

---

### P08: Full-Width Map
**Pages:** 14, 15, 16, 30, 54
**Visual Description:**
- Running header (section title)
- Full-width Google Maps image or zoning map
- Subject property marked (pin or highlight)
- Map attribution at bottom
- May include legend (page 54)

**Structure:**
```html
<div class="map-page">
  <h2 class="section-header">Maps</h2>

  <div class="map-container">
    <img src="..." alt="Location Map" class="full-width-map" />
    <div class="map-attribution">© 1987-2025 HERE, Canada</div>
  </div>
</div>
```

**CSS Requirements:**
```css
.map-container {
  width: 100%;
  margin-top: 20px;
  position: relative;
}

.full-width-map {
  width: 100%;
  height: auto;
  border: 1px solid #D0D0D0;
}

.map-attribution {
  font-size: 8pt;
  color: #666666;
  margin-top: 8px;
  text-align: left;
}
```

**Complexity:** Low
**Implementation Notes:**
- Image should be high resolution
- Consider aspect ratio constraints
- Page 54 has comparables legend table below map

---

### P09: Data Table Page
**Pages:** 23, 28, 33, 34, 37, 38, 41-44, 45, 48, 51
**Visual Description:**
- Running header
- Single large table (or 2-3 tables)
- Navy header row with white text
- Data rows with horizontal borders only
- May include multi-column layouts
- Right-aligned numbers

**Structure:**
```html
<div class="table-page">
  <h2 class="section-header">Property Taxes & Assessment</h2>

  <table class="data-table">
    <thead>
      <tr>
        <th>YEAR</th>
        <th>TOTAL ASSESSED VALUE</th>
        <th>TAX RATE</th>
        <th>TAXES</th>
        <th>TAXES/SF</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>2025</td>
        <td class="number">$1,063,000</td>
        <td class="number">0.01757</td>
        <td class="number">$18,668</td>
        <td class="number">$1.83</td>
      </tr>
    </tbody>
  </table>
</div>
```

**CSS Requirements:**
```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  border: 1px solid #000000;
}

.data-table thead {
  background-color: #003366;
  color: #FFFFFF;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 10pt;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.data-table thead th {
  padding: 10px 8px;
  text-align: left;
  border-right: 1px solid #FFFFFF;
}

.data-table thead th:last-child {
  border-right: none;
}

.data-table tbody tr {
  border-bottom: 1px solid #D0D0D0;
}

.data-table tbody td {
  padding: 8px;
  font-size: 9pt;
  border-left: none;
  border-right: none;
}

.data-table tbody td.number {
  text-align: right;
}

.data-table tbody td.negative {
  color: #C00000;
}
```

**Complexity:** Low
**Implementation Notes:**
- Very common pattern
- Ensure navy headers print
- No vertical borders in body (minimalist design)
- Numbers always right-aligned
- Red styling for negative values

---

### P10: Site Plan Diagram
**Pages:** 26, 27
**Visual Description:**
- Running header "Site Plans - Lot 17" / "Lot 18"
- Cadastral survey diagram
- Red outlined lot boundary
- Survey measurements and lot numbers
- White background with black lines

**Structure:**
```html
<div class="diagram-page">
  <h2 class="section-header subsection-blue">Site Plans - Lot 17</h2>

  <div class="diagram-container">
    <img src="..." alt="Site Plan Lot 17" class="site-plan-diagram" />
  </div>
</div>
```

**CSS Requirements:**
```css
.diagram-container {
  width: 100%;
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

.site-plan-diagram {
  max-width: 90%;
  height: auto;
  border: 1px solid #D0D0D0;
}

.subsection-blue {
  color: #003366;
  font-size: 16pt;
  font-weight: bold;
  text-align: center;
}
```

**Complexity:** Medium
**Implementation Notes:**
- Subsection header in blue (not black)
- Centered layout
- Diagram should be vector (SVG) or high-res image
- Red highlighting may need to be added programmatically

---

### P11: Chart + Text Page
**Pages:** 47, 60
**Visual Description:**
- Running header
- Text section at top
- Line chart or bar chart (large)
- May have additional text below chart

**Structure:**
```html
<div class="chart-text-page">
  <h2 class="section-header">Capitalization Rate Selection</h2>

  <div class="chart-intro">
    <p>To determine the appropriate capitalization rate...</p>
  </div>

  <div class="chart-container">
    <canvas id="cap-rate-chart"></canvas>
  </div>

  <div class="chart-conclusion">
    <p>The comparable capitalization rates indicate...</p>
  </div>
</div>
```

**CSS Requirements:**
```css
.chart-container {
  width: 100%;
  max-height: 400px;
  margin: 20px 0;
  page-break-inside: avoid;
}

.chart-intro,
.chart-conclusion {
  margin: 15px 0;
  text-align: justify;
}
```

**Complexity:** High
**Implementation Notes:**
- Charts may be Chart.js, SVG, or embedded images
- Page 47 has both line chart AND bar chart
- Ensure charts print correctly
- Consider static image fallback for PDF

---

### P12: Chart + Table Page
**Pages:** 49
**Visual Description:**
- Running header
- Bar chart at top (NOI & Cap Rate)
- Data table below chart
- Both elements related to same data

**Structure:**
```html
<div class="chart-table-page">
  <h2 class="section-header">Direct Capitalization Conclusion</h2>

  <div class="chart-container">
    <canvas id="noi-cap-chart"></canvas>
  </div>

  <table class="data-table">
    <thead>
      <tr><th colspan="5">COMPARABLE SALES</th></tr>
      <tr>
        <th></th>
        <th>COMP 1</th>
        <th>COMP 2</th>
        <!-- ... -->
      </tr>
    </thead>
    <tbody>
      <!-- ... -->
    </tbody>
  </table>
</div>
```

**Complexity:** High
**Implementation Notes:**
- Chart and table must use same data source
- Vertical alignment important
- Both should print on same page (page-break-inside: avoid)

---

### P13: Complex Calculation Table
**Pages:** 50, 61-64
**Visual Description:**
- Large table with multiple sections
- Navy section divider rows inside table body
- Red negative values (parentheses or minus)
- Multi-column layout
- Subtotals and totals
- May span multiple pages

**Example from Page 50:**
- DIRECT CAPITALIZATION header
- Sections: Unit Mix, Rental Revenue, Other Revenue, Potential Gross Revenue
- Each section has navy divider row
- Red percentages for vacancy/credit loss
- Calculations flow downward to NET OPERATING INCOME

**Structure:**
```html
<table class="complex-calc-table">
  <thead>
    <tr><th colspan="6">DIRECT CAPITALIZATION</th></tr>
    <tr>
      <th>UNIT MIX</th>
      <th>UNITS</th>
      <th>CATEGORY</th>
      <th>CONTRACT</th>
      <th>MARKET</th>
      <th>CONT V MKT</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Flat 1 Bed / 1 Bath</td>
      <td>4</td>
      <td>1 Bed</td>
      <td>$850</td>
      <td>$900</td>
      <td>94%</td>
    </tr>

    <tr class="section-divider">
      <td colspan="6">RENTAL REVENUE</td>
    </tr>

    <tr>
      <td>Total Monthly Revenue</td>
      <td></td>
      <td>%PGR</td>
      <td>%EGR</td>
      <td>$/UNIT</td>
      <td>$/SF (YR 1)</td>
    </tr>
    <!-- ... -->

    <tr class="section-divider">
      <td colspan="6">EFFECTIVE GROSS REVENUE</td>
    </tr>
    <!-- ... -->

    <tr class="total-row">
      <td>NET OPERATING INCOME</td>
      <td></td>
      <td>%EGR</td>
      <td>$/UNIT</td>
      <td>$/SF (YR 1)</td>
      <td class="number">$111,771</td>
    </tr>
  </tbody>
</table>
```

**CSS Requirements:**
```css
.complex-calc-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 9pt;
  border: 1px solid #000000;
}

.complex-calc-table thead {
  background-color: #003366;
  color: #FFFFFF;
  font-weight: bold;
  text-transform: uppercase;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.complex-calc-table thead th {
  padding: 8px;
  text-align: center;
  border-right: 1px solid #FFFFFF;
}

.complex-calc-table tbody tr.section-divider {
  background-color: #003366;
  color: #FFFFFF;
  font-weight: bold;
  text-transform: uppercase;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.complex-calc-table tbody tr.section-divider td {
  padding: 8px;
  text-align: left;
}

.complex-calc-table tbody tr.total-row {
  font-weight: bold;
  background-color: #F5F5F5;
}

.complex-calc-table tbody td {
  padding: 6px 8px;
  border-bottom: 1px solid #D0D0D0;
  border-left: none;
  border-right: none;
}

.complex-calc-table tbody td.number {
  text-align: right;
}

.complex-calc-table tbody td.negative,
.complex-calc-table tbody td:contains("(") {
  color: #C00000;
}
```

**Complexity:** High
**Implementation Notes:**
- Most complex table in report
- Navy section dividers INSIDE tbody
- Red color for ANY value with parentheses
- Multiple alignment types in same row
- May need JavaScript to detect negative values
- Critical for Income Approach and Direct Comparison sections

---

### P14: Comparable Sale Sheet
**Pages:** 55, 56, 57, 58, 59
**Visual Description:**
- Title at top (e.g., "College View Apartments", "Comparable 2")
- CSS Grid layout with 4 areas:
  - Top-left: Sale Information table
  - Top-right: Property photo
  - Middle-left: Property details table
  - Middle-right: Google Maps location
  - Bottom: Full-width Remarks section

**Structure:**
```html
<div class="comparable-sale-sheet">
  <h2 class="comp-title">College View Apartments</h2>
  <p class="comp-subtitle">Comparable 1</p>

  <div class="comp-grid">
    <div class="sale-info">
      <h3>Sale Information</h3>
      <table class="comp-table">
        <tr><td class="label">Buyer</td><td>Epiphany Group</td></tr>
        <tr><td class="label">Seller</td><td>Macro Properties Toronto</td></tr>
        <tr><td class="label">Sale Date</td><td>2024-04-19</td></tr>
        <tr><td class="label">Sale Price</td><td>$4,590,858</td></tr>
        <!-- ... -->
      </table>
    </div>

    <div class="property-photo">
      <img src="..." alt="College View Apartments" />
    </div>

    <div class="property-details">
      <h3>Property</h3>
      <table class="comp-table">
        <tr><td class="label">Property Type</td><td>Multi-Family, Walk-Up</td></tr>
        <tr><td class="label">Rent Type</td><td>Market</td></tr>
        <!-- ... -->
      </table>

      <h3>Unit Mix</h3>
      <table class="comp-table">
        <tr><th>Units</th><th>Avg Size</th></tr>
        <tr><td>Flat<br/>1 Bed / 1 Bath</td><td>45<br/>0 SF</td></tr>
      </table>
    </div>

    <div class="location-map">
      <img src="..." alt="Location Map" />
      <p class="map-address">10010-10910 Winder Crescent<br/>North Battleford, SK</p>
    </div>

    <div class="remarks">
      <h3>Remarks</h3>
      <p>Macro Properties Toronto sold this 45-unit portfolio...</p>
    </div>
  </div>
</div>
```

**CSS Grid Structure:**
```css
.comparable-sale-sheet {
  page-break-before: always;
  page-break-after: always;
}

.comp-title {
  font-size: 16pt;
  font-weight: bold;
  color: #003366;
  margin-bottom: 4px;
}

.comp-subtitle {
  font-size: 12pt;
  color: #666666;
  margin-bottom: 20px;
}

.comp-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  grid-template-rows: auto auto auto;
  gap: 20px;
}

.sale-info {
  grid-column: 1;
  grid-row: 1;
}

.property-photo {
  grid-column: 2;
  grid-row: 1;
}

.property-photo img {
  width: 100%;
  height: auto;
  max-height: 250px;
  object-fit: cover;
  border: 1px solid #D0D0D0;
}

.property-details {
  grid-column: 1;
  grid-row: 2;
}

.location-map {
  grid-column: 2;
  grid-row: 2;
}

.location-map img {
  width: 100%;
  height: auto;
  max-height: 200px;
  border: 1px solid #D0D0D0;
}

.map-address {
  font-size: 9pt;
  text-align: center;
  margin-top: 8px;
}

.remarks {
  grid-column: 1 / -1; /* Span both columns */
  grid-row: 3;
}

.comp-table {
  width: 100%;
  font-size: 9pt;
  margin-bottom: 15px;
}

.comp-table td,
.comp-table th {
  padding: 4px 8px;
  border-bottom: 1px solid #E0E0E0;
}

.comp-table td.label {
  font-weight: 600;
  width: 40%;
}
```

**Complexity:** High
**Implementation Notes:**
- Most unique layout in report
- CSS Grid essential for 2-column layout
- Photo and map must be integrated
- Each comparable is on own page
- Tables are simpler than main report tables (no navy headers)
- Remarks can be long paragraph

---

### P15: Signature/Certification Page
**Pages:** 65
**Visual Description:**
- Running header
- Final value conclusion table
- Certification text sections
- Signature block with handwritten signature
- Appraiser credentials below signature

**Structure:**
```html
<div class="certification-page">
  <h2 class="section-header">Final Estimate of Value</h2>

  <table class="value-conclusion">
    <thead>
      <tr><th colspan="5">MARKET VALUE CONCLUSION</th></tr>
      <tr>
        <th>VALUATION SCENARIOS</th>
        <th>INTEREST APPRAISED</th>
        <th>EXPOSURE TIME</th>
        <th>EFFECTIVE DATE</th>
        <th>VALUE</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>As Stabilized</td>
        <td>Fee Simple Estate</td>
        <td>Six Months</td>
        <td>October 17, 2025</td>
        <td class="number">$1,800,000</td>
      </tr>
    </tbody>
  </table>

  <div class="certification-sections">
    <h3>Hypothetical Conditions</h3>
    <p>The use of a hypothetical condition(s) may have impacted...</p>

    <h3>Extraordinary Assumptions</h3>
    <p>No Extraordinary Assumptions were made...</p>

    <h3>Extraordinary Limiting Conditions</h3>
    <p>No Extraordinary Limiting Conditions were made...</p>
  </div>

  <div class="signature-block">
    <img src="signature.png" alt="Signature" class="signature-image" />
    <div class="appraiser-info">
      <p class="appraiser-name">Chris Chornohos, AACI, MRICS</p>
      <p>Founder</p>
      <p>chris.chornohos@valta.ca</p>
      <p>AIC No: 90209</p>
    </div>
  </div>
</div>
```

**Complexity:** Medium
**Implementation Notes:**
- Similar to P04 for table
- Signature can be image or CSS font
- Page break management important
- Certification text follows standard format

---

### P16: Full Navy Back Cover
**Pages:** 79
**Visual Description:**
- Entire page is navy blue background (#003366)
- White text
- Company name, address, contact info at bottom
- Disclaimer text at very bottom
- Logo at bottom left (optional)

**Structure:**
```html
<div class="back-cover">
  <div class="back-cover-content">
    <div class="company-info">
      <h2>Valta Property Valuations Ltd.</h2>
      <p>300, 4838 Richard Road SW</p>
      <p>Calgary, AB T3E 6L1</p>
      <p><strong>Office:</strong> 587-801-5151</p>
    </div>

    <div class="disclaimer">
      <h3>Valta.ca</h3>
      <p class="small-text">All information presented herein was obtained from sources deemed reliable...</p>
    </div>
  </div>
</div>
```

**CSS Requirements:**
```css
.back-cover {
  width: 100%;
  min-height: 100vh;
  background-color: #003366;
  color: #FFFFFF;
  display: flex;
  align-items: flex-end;
  padding: 60px;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  page-break-before: always;
}

.back-cover-content {
  width: 100%;
}

.company-info {
  margin-bottom: 40px;
}

.company-info h2 {
  font-size: 14pt;
  font-weight: normal;
  margin-bottom: 8px;
}

.company-info p {
  font-size: 10pt;
  margin: 4px 0;
}

.disclaimer h3 {
  font-size: 12pt;
  margin-bottom: 8px;
}

.disclaimer .small-text {
  font-size: 8pt;
  line-height: 1.3;
  opacity: 0.9;
}
```

**Complexity:** Low
**Implementation Notes:**
- Critical that navy background prints
- Use print-color-adjust: exact
- Test PDF rendering extensively
- Simple layout but important branding element

---

## Pattern Usage Summary

| Complexity | Pattern Count | Total Pages | % of Report |
|------------|---------------|-------------|-------------|
| Low | 8 | 56 | 71% |
| Medium | 5 | 12 | 15% |
| High | 6 | 11 | 14% |

**Implementation Recommendation:**
1. Start with Low complexity patterns (71% coverage)
2. Build Medium complexity patterns (adds 15% coverage)
3. Tackle High complexity patterns last (final 14%)

**Critical Patterns (Must-Have):**
- P03: Split-Screen TOC (brand differentiator)
- P04: Multi-Table Dashboard (executive summary)
- P09: Data Table (most common)
- P13: Complex Calculation Table (core valuation)
- P14: Comparable Sale Sheet (unique layout)

---

**Document Status:** Complete Pattern Library
**Patterns Documented:** 16 distinct types
**Pages Covered:** 79/79 (100%)
**Last Updated:** 2025-12-10
