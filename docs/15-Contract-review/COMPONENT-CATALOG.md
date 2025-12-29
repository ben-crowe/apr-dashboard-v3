# Component Catalog
## Reusable Components - North Battleford Report

**Purpose:** Catalog every reusable UI component identified across the 79-page report
**Status:** Complete component inventory
**Date:** 2025-12-10

---

## Component Index

| Component ID | Component Name | Appears On | Count | Complexity |
|--------------|----------------|------------|-------|------------|
| C01 | Chevron Footer Graphic | 3-78 | 76 | Medium |
| C02 | Running Header with Blue Underline | 6-78 | 73 | Low |
| C03 | Navy Header Table | 6, 7, 19, 23, 28, 33-34, 37-38, 41-45, 48-51, 61-64 | 30+ | Low |
| C04 | Navy Section Divider Row | 50, 61-64 | 5 | Low |
| C05 | Photo Grid (2x3) | 9-12 | 4 | Low |
| C06 | Photo Item with Caption | 9-13 | 27 | Low |
| C07 | Full-Width Map Container | 14-16, 30, 54 | 5 | Low |
| C08 | Data Table (Multi-Column) | 19, 23, 28, 33-34, 37-38, 41-45, 48, 51 | 20+ | Low |
| C09 | Comparable Location Map with Legend | 54 | 1 | Medium |
| C10 | Comparable Sale Card | 55-59 | 5 | High |
| C11 | Bar Chart Component | 47, 49, 60 | 3 | High |
| C12 | Line Chart Component | 47 | 1 | High |
| C13 | Signature Block | 4, 65 | 2 | Low |
| C14 | Value Conclusion Box | 3 | 1 | Medium |
| C15 | Text Section with Subsections | All text pages | 35+ | Low |
| C16 | Bullet List | 18, 20-21, 24 | 10+ | Low |
| C17 | Site Plan Diagram Container | 26-27 | 2 | Medium |
| C18 | Calculation Table with Subtotals | 50, 61-64 | 5 | High |

---

## Detailed Component Specifications

### C01: Chevron Footer Graphic
**Appears:** Pages 3-78 (every page except cover and back cover)
**Frequency:** 76 occurrences
**Visual Description:**
- Positioned at bottom right of page
- Diagonal stripes: light blue (#8DB4E2) → dark blue (#003366)
- Angle approximately 115 degrees
- Width: ~2-3 inches
- Height: ~0.5 inches

**HTML Structure:**
```html
<div class="page-footer">
  <div class="footer-left">
    <span class="page-number">12</span>
  </div>
  <div class="footer-center">
    <span class="footer-text">1101, 1121 109 St, North Battleford, Saskatchewan | File VAL251012 - 1</span>
  </div>
  <div class="footer-right">
    <div class="chevron-graphic"></div>
  </div>
</div>
```

**CSS Implementation:**
```css
.page-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 0.75in;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.75in;
  font-size: 9pt;
}

.footer-left .page-number {
  font-weight: bold;
}

.footer-center {
  text-align: center;
  flex-grow: 1;
}

.footer-right {
  width: 2.5in;
  height: 0.5in;
}

.chevron-graphic {
  width: 100%;
  height: 100%;
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

**Complexity:** Medium
**Implementation Notes:**
- Uses CSS linear-gradient for chevron effect
- Must print colors (critical!)
- Footer should be fixed position for PDF
- Page number updates dynamically
- File number from report metadata

---

### C02: Running Header with Blue Underline
**Appears:** Pages 6-78 (all content pages after TOC)
**Frequency:** 73 occurrences
**Visual Description:**
- Section title in bold black, 18-20pt
- Solid blue line (#003366, 2px) underneath
- Spans full width of content area
- Different text per section

**HTML Structure:**
```html
<div class="running-header">
  <h1 class="section-title">{{ sectionTitle }}</h1>
  <div class="header-underline"></div>
</div>
```

**CSS Implementation:**
```css
.running-header {
  margin-bottom: 24px;
  padding-bottom: 8px;
  border-bottom: 2px solid #003366;
}

.running-header .section-title {
  font-size: 18pt;
  font-weight: bold;
  color: #000000;
  margin: 0;
  line-height: 1.2;
}

@media print {
  .running-header {
    page-break-after: avoid;
  }
}
```

**Props/Inputs:**
- `sectionTitle: string` - Section name (e.g., "Property Analysis", "Market Context")

**Complexity:** Low
**Implementation Notes:**
- Highly reusable
- Text changes based on current section
- Prevent page break after header

---

### C03: Navy Header Table
**Appears:** 30+ pages throughout report
**Frequency:** Very high (most common table type)
**Visual Description:**
- Full-width table
- Navy blue header (#003366) with white text
- UPPERCASE header text
- White body rows with horizontal borders only
- No vertical borders

**HTML Structure:**
```html
<table class="navy-header-table">
  <thead>
    <tr>
      <th colspan="2">{{ tableTitle }}</th>
    </tr>
    <tr *ngIf="hasSubheaders">
      <th>{{ col1Header }}</th>
      <th>{{ col2Header }}</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let row of tableData">
      <td class="label">{{ row.label }}</td>
      <td class="value" [class.number]="row.isNumber">{{ row.value }}</td>
    </tr>
  </tbody>
</table>
```

**CSS Implementation:**
```css
.navy-header-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  border: 1px solid #000000;
  page-break-inside: avoid;
}

.navy-header-table thead {
  background-color: #003366;
  color: #FFFFFF;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 11pt;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.navy-header-table thead th {
  padding: 10px 8px;
  text-align: left;
}

.navy-header-table tbody tr {
  border-bottom: 1px solid #D0D0D0;
}

.navy-header-table tbody tr:last-child {
  border-bottom: none;
}

.navy-header-table tbody td {
  padding: 8px;
  font-size: 10pt;
  border-left: none;
  border-right: none;
}

.navy-header-table tbody td.label {
  font-weight: 600;
  width: 40%;
}

.navy-header-table tbody td.value {
  width: 60%;
}

.navy-header-table tbody td.number {
  text-align: right;
}
```

**Variations:**
1. **Single header row** (e.g., "PROPERTY IDENTIFICATION")
2. **Double header row** (main title + column headers)
3. **Multi-column** (3-6 columns)

**Props/Inputs:**
- `tableTitle: string` - Main header text
- `hasSubheaders: boolean` - Whether column headers needed
- `columnHeaders: string[]` - Column header texts
- `tableData: TableRow[]` - Array of row data
- `columnCount: number` - Number of columns

**Complexity:** Low
**Implementation Notes:**
- Most reusable component in report
- Must ensure navy header prints
- No vertical borders (minimalist design)
- Can be 2-column or multi-column

---

### C04: Navy Section Divider Row
**Appears:** Pages 50, 61-64 (inside table bodies)
**Frequency:** 5-10 occurrences
**Visual Description:**
- Full-width row INSIDE table tbody
- Same navy blue background as header (#003366)
- White uppercase text
- Used to separate major sections within a table

**HTML Structure:**
```html
<table class="complex-table">
  <thead>...</thead>
  <tbody>
    <tr>...</tr>
    <tr>...</tr>

    <!-- Section Divider -->
    <tr class="section-divider">
      <td colspan="{{ columnCount }}">{{ dividerText }}</td>
    </tr>

    <tr>...</tr>
    <tr>...</tr>
  </tbody>
</table>
```

**CSS Implementation:**
```css
.section-divider {
  background-color: #003366;
  color: #FFFFFF;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 10pt;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.section-divider td {
  padding: 8px;
  text-align: left;
  border: none;
}
```

**Examples:**
- "RENTAL REVENUE"
- "EFFECTIVE GROSS REVENUE"
- "SALE INFORMATION"
- "PHYSICAL INFORMATION"

**Props/Inputs:**
- `dividerText: string` - Section name
- `columnCount: number` - For colspan

**Complexity:** Low
**Implementation Notes:**
- Critical for Complex Calculation Tables (C18)
- Used in Direct Capitalization and Adjustment tables
- Must print navy background

---

### C05: Photo Grid (2x3)
**Appears:** Pages 9-12
**Frequency:** 4 pages (24 photos total)
**Visual Description:**
- 2 columns × 3 rows = 6 photos per page
- Equal-sized photos
- Captions centered below each photo
- Consistent spacing

**HTML Structure:**
```html
<div class="photo-grid">
  <div class="photo-item" *ngFor="let photo of photos">
    <img [src]="photo.url" [alt]="photo.caption" class="grid-photo" />
    <p class="photo-caption">{{ photo.caption }}</p>
  </div>
</div>
```

**CSS Implementation:**
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

.grid-photo {
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
  color: #222222;
}
```

**Props/Inputs:**
- `photos: Photo[]` - Array of photo objects (max 6 per grid)
  - `url: string`
  - `caption: string`

**Complexity:** Low
**Implementation Notes:**
- Simple CSS Grid
- Photos maintain aspect ratio
- Prevent page breaks inside photo items
- Can handle 1-6 photos (partial grid on last page)

---

### C06: Photo Item with Caption
**Appears:** Pages 9-13 (within photo grids and comparable sheets)
**Frequency:** 27 photos
**Visual Description:**
- Single photo with border
- Caption centered below
- Constrained height, aspect ratio maintained

**HTML Structure:**
```html
<div class="photo-item">
  <img [src]="photoUrl" [alt]="caption" class="property-photo" />
  <p class="photo-caption">{{ caption }}</p>
</div>
```

**CSS Implementation:**
```css
.photo-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.property-photo {
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

**Props/Inputs:**
- `photoUrl: string`
- `caption: string`
- `maxHeight?: number` (default 250px)

**Complexity:** Low
**Reusability:** Very High
**Implementation Notes:**
- Used in photo grids AND comparable sale sheets
- Can be standalone or in grid
- Border is subtle gray

---

### C07: Full-Width Map Container
**Appears:** Pages 14-16, 30, 54
**Frequency:** 5 maps
**Visual Description:**
- Full-width image
- Border around map
- Optional attribution text below
- May include legend (page 54)

**HTML Structure:**
```html
<div class="map-container">
  <img [src]="mapUrl" [alt]="mapTitle" class="full-width-map" />
  <p *ngIf="attribution" class="map-attribution">{{ attribution }}</p>
  <div *ngIf="hasLegend" class="map-legend">
    <table class="legend-table">
      <tr *ngFor="let item of legendItems">
        <td class="legend-label">{{ item.label }}</td>
        <td class="legend-value">{{ item.value }}</td>
      </tr>
    </table>
  </div>
</div>
```

**CSS Implementation:**
```css
.map-container {
  width: 100%;
  margin: 20px 0;
  page-break-inside: avoid;
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

.map-legend {
  margin-top: 15px;
}

.legend-table {
  width: 100%;
  font-size: 9pt;
}

.legend-table td {
  padding: 4px 8px;
  border-bottom: 1px solid #E0E0E0;
}

.legend-table .legend-label {
  font-weight: 600;
  width: 30%;
}
```

**Map Types:**
1. **Street Grid** (page 14) - Close-up with subject property pin
2. **City Context** (page 15) - Radius overlay showing area
3. **Regional** (page 16) - Wide geographic context
4. **Zoning Map** (page 30) - With red highlighted property
5. **Comparables Map** (page 54) - Multiple numbered pins + legend

**Props/Inputs:**
- `mapUrl: string`
- `mapTitle: string`
- `attribution?: string`
- `hasLegend: boolean`
- `legendItems?: LegendItem[]`

**Complexity:** Low (without legend), Medium (with legend)

---

### C08: Data Table (Multi-Column)
**Appears:** 20+ pages
**Frequency:** Very high
**Visual Description:**
- Same as C03 (Navy Header Table) but with 3+ columns
- Used for data presentation (not label/value pairs)
- Right-aligned numbers
- May have alternating row colors

**HTML Structure:**
```html
<table class="data-table">
  <thead>
    <tr>
      <th *ngFor="let header of columnHeaders">{{ header }}</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let row of tableData">
      <td *ngFor="let cell of row.cells" [class.number]="cell.isNumber" [class.negative]="cell.isNegative">
        {{ cell.value }}
      </td>
    </tr>
  </tbody>
</table>
```

**CSS Implementation:**
```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  border: 1px solid #000000;
  font-size: 9pt;
}

.data-table thead {
  background-color: #003366;
  color: #FFFFFF;
  font-weight: bold;
  text-transform: uppercase;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.data-table thead th {
  padding: 10px 8px;
  text-align: center;
  border-right: 1px solid #FFFFFF;
}

.data-table thead th:last-child {
  border-right: none;
}

.data-table tbody tr {
  border-bottom: 1px solid #D0D0D0;
}

.data-table tbody tr:nth-child(even) {
  background-color: #F9F9F9; /* Subtle alternation */
}

.data-table tbody td {
  padding: 6px 8px;
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

**Props/Inputs:**
- `columnHeaders: string[]`
- `tableData: TableRow[]`
- `columnAlignments?: ('left'|'center'|'right')[]`

**Complexity:** Low
**Implementation Notes:**
- Similar to C03 but multi-column focused
- Used for Economic Indicators, Unit Mix, Comparable Sales
- Red negatives critical

---

### C09: Comparable Location Map with Legend
**Appears:** Page 54
**Frequency:** 1
**Visual Description:**
- Full-width Google Map
- Multiple numbered pins (1-5 for comparables)
- Table legend below showing addresses
- Distances from subject

**HTML Structure:**
```html
<div class="comparables-map-container">
  <img src="{{ mapUrl }}" alt="Comparables Location Map" class="comparables-map" />

  <table class="comparables-legend">
    <thead>
      <tr>
        <th>COMPARABLE</th>
        <th>LABEL</th>
        <th>ADDRESS</th>
        <th>KILOMETERS FROM SUBJECT</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let comp of comparables">
        <td>COMPARABLE {{ comp.number }}</td>
        <td>{{ comp.number }}</td>
        <td>{{ comp.address }}</td>
        <td class="number">{{ comp.distance }}</td>
      </tr>
    </tbody>
  </table>
</div>
```

**CSS Implementation:**
```css
.comparables-map-container {
  width: 100%;
  page-break-inside: avoid;
}

.comparables-map {
  width: 100%;
  height: auto;
  border: 1px solid #D0D0D0;
  margin-bottom: 20px;
}

.comparables-legend {
  width: 100%;
  border-collapse: collapse;
  font-size: 9pt;
}

.comparables-legend thead {
  background-color: #003366;
  color: #FFFFFF;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 8pt;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.comparables-legend thead th {
  padding: 8px;
  text-align: left;
}

.comparables-legend tbody td {
  padding: 6px 8px;
  border-bottom: 1px solid #D0D0D0;
}

.comparables-legend tbody td.number {
  text-align: right;
}
```

**Props/Inputs:**
- `mapUrl: string` - Google Maps static image with pins
- `comparables: Comparable[]`
  - `number: number`
  - `address: string`
  - `distance: number`

**Complexity:** Medium
**Implementation Notes:**
- Unique to Sales Comparison section
- Map must show all comp locations
- Legend table is navy header style

---

### C10: Comparable Sale Card
**Appears:** Pages 55-59
**Frequency:** 5 cards (1 per comparable)
**Visual Description:**
- Complex CSS Grid layout
- 4 areas: Sale Info + Photo, Property Details + Map, Full-width Remarks
- Multiple tables within card
- Property photo and Google Map embedded

**HTML Structure:**
```html
<div class="comparable-sale-card">
  <h2 class="comp-title">{{ compName }}</h2>
  <p class="comp-subtitle">Comparable {{ compNumber }}</p>

  <div class="comp-grid">
    <!-- Top Left: Sale Information -->
    <div class="sale-info-section">
      <h3>Sale Information</h3>
      <table class="comp-info-table">
        <tr><td class="label">Buyer</td><td>{{ sale.buyer }}</td></tr>
        <tr><td class="label">Seller</td><td>{{ sale.seller }}</td></tr>
        <tr><td class="label">Sale Date</td><td>{{ sale.date }}</td></tr>
        <tr><td class="label">Sale Price</td><td>{{ sale.price | currency }}</td></tr>
        <tr><td class="label">Analysis Price</td><td>{{ sale.analysisPrice | currency }}</td></tr>
      </table>

      <h3>Income Analysis</h3>
      <table class="comp-info-table">
        <tr><td class="label">Occupancy</td><td>{{ income.occupancy }}%</td></tr>
        <tr><td class="label">NOI</td><td>{{ income.noi | currency }}</td></tr>
        <tr><td class="label">Cap Rate</td><td>{{ income.capRate }}%</td></tr>
      </table>
    </div>

    <!-- Top Right: Property Photo -->
    <div class="comp-photo-section">
      <img [src]="propertyPhoto" alt="{{ compName }}" class="comp-photo" />
    </div>

    <!-- Middle Left: Property Details -->
    <div class="property-details-section">
      <h3>Property</h3>
      <table class="comp-info-table">
        <tr><td class="label">Property Type</td><td>{{ property.type }}</td></tr>
        <tr><td class="label">Rent Type</td><td>{{ property.rentType }}</td></tr>
        <tr><td class="label">GBA</td><td>{{ property.gba }} SF</td></tr>
        <tr><td class="label">NRA</td><td>{{ property.nra }} SF</td></tr>
        <tr><td class="label">Units</td><td>{{ property.units }}</td></tr>
        <tr><td class="label">Year Built</td><td>{{ property.yearBuilt }}</td></tr>
      </table>

      <h3>Unit Mix</h3>
      <table class="unit-mix-table">
        <thead>
          <tr><th>Flat</th><th>Units</th><th>Avg Size</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let unit of unitMix">
            <td>{{ unit.bedrooms }} Bed / {{ unit.bathrooms }} Bath</td>
            <td>{{ unit.count }}</td>
            <td>{{ unit.avgSize }} SF</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Middle Right: Location Map -->
    <div class="location-map-section">
      <img [src]="locationMap" alt="Location Map" class="location-map" />
      <p class="map-address">{{ property.address }}<br/>{{ property.city }}, {{ property.province }}</p>
    </div>

    <!-- Bottom: Remarks (Full Width) -->
    <div class="remarks-section">
      <h3>Remarks</h3>
      <p>{{ remarks }}</p>
    </div>
  </div>
</div>
```

**CSS Implementation:**
```css
.comparable-sale-card {
  page-break-before: always;
  page-break-after: always;
  page-break-inside: avoid;
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

/* Grid Area Positioning */
.sale-info-section {
  grid-column: 1;
  grid-row: 1;
}

.comp-photo-section {
  grid-column: 2;
  grid-row: 1;
}

.property-details-section {
  grid-column: 1;
  grid-row: 2;
}

.location-map-section {
  grid-column: 2;
  grid-row: 2;
}

.remarks-section {
  grid-column: 1 / -1;
  grid-row: 3;
}

/* Section Headers */
.comp-grid h3 {
  font-size: 12pt;
  font-weight: bold;
  color: #003366;
  margin-top: 15px;
  margin-bottom: 8px;
}

.comp-grid h3:first-child {
  margin-top: 0;
}

/* Info Tables */
.comp-info-table {
  width: 100%;
  font-size: 9pt;
  margin-bottom: 15px;
}

.comp-info-table td {
  padding: 4px 8px;
  border-bottom: 1px solid #E0E0E0;
}

.comp-info-table td.label {
  font-weight: 600;
  width: 40%;
}

/* Unit Mix Table */
.unit-mix-table {
  width: 100%;
  font-size: 9pt;
  border-collapse: collapse;
}

.unit-mix-table thead th {
  background-color: #F0F0F0;
  padding: 6px 8px;
  text-align: left;
  font-weight: bold;
  border-bottom: 2px solid #D0D0D0;
}

.unit-mix-table tbody td {
  padding: 4px 8px;
  border-bottom: 1px solid #E0E0E0;
}

/* Photo */
.comp-photo {
  width: 100%;
  height: auto;
  max-height: 250px;
  object-fit: cover;
  border: 1px solid #D0D0D0;
}

/* Location Map */
.location-map {
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: cover;
  border: 1px solid #D0D0D0;
}

.map-address {
  font-size: 9pt;
  text-align: center;
  margin-top: 8px;
  line-height: 1.3;
}

/* Remarks */
.remarks-section p {
  font-size: 10pt;
  line-height: 1.5;
  text-align: justify;
}
```

**Props/Inputs:**
- `compName: string`
- `compNumber: number`
- `sale: SaleInfo` (buyer, seller, date, price, analysisPrice)
- `income: IncomeInfo` (occupancy, noi, capRate)
- `property: PropertyInfo` (type, rentType, gba, nra, units, yearBuilt, address, city, province)
- `unitMix: UnitMix[]`
- `propertyPhoto: string`
- `locationMap: string`
- `remarks: string`

**Complexity:** High
**Implementation Notes:**
- Most complex component in report
- CSS Grid is essential
- Each comp is on own page
- Tables inside grid areas are simpler (no navy headers)
- Must integrate photos and maps
- Remarks can be long paragraph

---

### C11: Bar Chart Component
**Appears:** Pages 47, 49, 60
**Frequency:** 3 charts
**Visual Description:**
- Horizontal or vertical bars
- Navy blue bars (#003366)
- Grid lines in gray
- Axis labels
- Value labels on/above bars
- May include comparison dotted line

**Chart Types:**
1. **NOI & Cap Rate** (page 49) - Dual-axis bar chart
2. **Unadjusted & Adjusted Price** (page 60) - Grouped bars with comparison line
3. **Cap Rate by Comparable** (page 47) - Bar chart embedded in larger page

**HTML Structure:**
```html
<div class="chart-container">
  <canvas id="{{ chartId }}"></canvas>
</div>
```

**JavaScript (Chart.js):**
```javascript
const chartConfig = {
  type: 'bar',
  data: {
    labels: chartData.labels,
    datasets: [{
      label: chartData.datasetLabel,
      data: chartData.values,
      backgroundColor: '#003366',
      borderColor: '#003366',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: chartData.showLegend
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#D0D0D0',
          lineWidth: 1
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  }
};
```

**CSS Implementation:**
```css
.chart-container {
  width: 100%;
  max-height: 400px;
  margin: 20px 0;
  page-break-inside: avoid;
}

.chart-container canvas {
  width: 100% !important;
  height: auto !important;
}
```

**Props/Inputs:**
- `chartId: string`
- `chartData: ChartData`
  - `labels: string[]`
  - `values: number[]`
  - `datasetLabel: string`
  - `showLegend: boolean`
- `chartType: 'bar' | 'horizontalBar'`

**Complexity:** High
**Implementation Notes:**
- Use Chart.js or similar library
- Navy bars are brand color
- Ensure charts render in PDF (may need static image fallback)
- Test print rendering

---

### C12: Line Chart Component
**Appears:** Page 47
**Frequency:** 1 chart
**Visual Description:**
- Multiple colored lines
- Time-series data (years on X-axis)
- Percentage on Y-axis
- Legend showing multiple cities
- Grid lines

**HTML Structure:**
```html
<div class="chart-container line-chart">
  <canvas id="multifamily-investment-indicators"></canvas>
</div>
```

**JavaScript (Chart.js):**
```javascript
const lineChartConfig = {
  type: 'line',
  data: {
    labels: years, // ['2015', '2016', ...]
    datasets: [
      {
        label: 'Canada',
        data: canadaData,
        borderColor: '#003366',
        backgroundColor: 'transparent',
        tension: 0.3
      },
      {
        label: 'Calgary',
        data: calgaryData,
        borderColor: '#8DB4E2',
        backgroundColor: 'transparent',
        tension: 0.3
      },
      // ... more cities
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        },
        grid: {
          color: '#E0E0E0'
        }
      },
      x: {
        grid: {
          color: '#E0E0E0'
        }
      }
    }
  }
};
```

**Props/Inputs:**
- `chartId: string`
- `years: number[]`
- `datasets: LineDataset[]`
  - `label: string`
  - `data: number[]`
  - `color: string`

**Complexity:** High
**Implementation Notes:**
- Multi-line chart for time-series data
- Legend critical for identifying cities
- Yellow border around chart (unique to page 47)

---

### C13: Signature Block
**Appears:** Pages 4, 65
**Frequency:** 2
**Visual Description:**
- Handwritten signature image
- Appraiser name below signature
- Credentials (AACI, MRICS)
- Email and AIC number

**HTML Structure:**
```html
<div class="signature-block">
  <img [src]="signatureImage" alt="Signature" class="signature-image" />
  <div class="appraiser-info">
    <p class="appraiser-name">{{ appraiserName }}, {{ credentials }}</p>
    <p>{{ title }}</p>
    <p>{{ email }}</p>
    <p>AIC No: {{ aicNumber }}</p>
  </div>
</div>
```

**CSS Implementation:**
```css
.signature-block {
  margin-top: 40px;
  page-break-inside: avoid;
}

.signature-image {
  max-width: 200px;
  height: auto;
  margin-bottom: 10px;
}

.appraiser-info {
  font-size: 10pt;
  line-height: 1.5;
}

.appraiser-name {
  font-weight: bold;
  margin-bottom: 4px;
}

.appraiser-info p {
  margin: 2px 0;
}
```

**Props/Inputs:**
- `signatureImage: string`
- `appraiserName: string`
- `credentials: string`
- `title: string`
- `email: string`
- `aicNumber: string`

**Complexity:** Low
**Reusability:** High

---

### C14: Value Conclusion Box
**Appears:** Page 3
**Frequency:** 1
**Visual Description:**
- Navy header table
- Single row with "FINAL VALUE CONCLUSION"
- Large value amount ($1,800,000)
- Stands out on transmittal letter

**HTML Structure:**
```html
<table class="value-conclusion-box">
  <thead>
    <tr><th colspan="2">MARKET VALUE CONCLUSION</th></tr>
  </thead>
  <tbody>
    <tr>
      <td class="label">{{ valuationType }}</td>
      <td class="value">{{ valueAmount | currency }}</td>
    </tr>
  </tbody>
</table>
```

**CSS Implementation:**
```css
.value-conclusion-box {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  border: 2px solid #003366;
}

.value-conclusion-box thead {
  background-color: #003366;
  color: #FFFFFF;
  font-weight: bold;
  text-transform: uppercase;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.value-conclusion-box thead th {
  padding: 10px;
  text-align: center;
  font-size: 12pt;
}

.value-conclusion-box tbody td {
  padding: 12px;
  font-size: 11pt;
}

.value-conclusion-box tbody td.label {
  font-weight: bold;
  width: 60%;
}

.value-conclusion-box tbody td.value {
  font-weight: bold;
  font-size: 14pt;
  text-align: right;
  width: 40%;
}
```

**Props/Inputs:**
- `valuationType: string` (e.g., "FINAL VALUE CONCLUSION")
- `valueAmount: number`

**Complexity:** Medium
**Implementation Notes:**
- Variation of navy header table
- Thicker border (2px)
- Larger value font size

---

### C15: Text Section with Subsections
**Appears:** All text pages (35+)
**Frequency:** Very high
**Visual Description:**
- Subsection headers in bold blue (#003366)
- Body paragraphs justified
- Sub-subsection headers smaller, also blue
- May include bullet lists

**HTML Structure:**
```html
<div class="text-section">
  <h2 class="subsection-header">{{ subsectionTitle }}</h2>
  <p *ngFor="let paragraph of paragraphs">{{ paragraph }}</p>

  <h3 *ngIf="hasSubSubsection" class="sub-subsection-header">{{ subSubsectionTitle }}</h3>
  <p *ngFor="let para of subParagraphs">{{ para }}</p>

  <ul *ngIf="hasBullets" class="bullet-list">
    <li *ngFor="let item of bulletItems">{{ item }}</li>
  </ul>
</div>
```

**CSS Implementation:**
```css
.text-section {
  margin-bottom: 20px;
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

.text-section p {
  font-size: 11pt;
  line-height: 1.4;
  text-align: justify;
  margin-bottom: 12pt;
  color: #222222;
}

.bullet-list {
  margin-left: 20px;
  margin-bottom: 12pt;
}

.bullet-list li {
  margin-bottom: 4pt;
  font-size: 11pt;
  line-height: 1.4;
}
```

**Complexity:** Low
**Reusability:** Very High

---

### C16: Bullet List
**Appears:** Pages 18, 20-21, 24
**Frequency:** 10+
**Visual Description:**
- Standard bullet points
- Indented from left margin
- Same font as body text

**HTML Structure:**
```html
<ul class="bullet-list">
  <li *ngFor="let item of items">{{ item }}</li>
</ul>
```

**CSS Implementation:**
```css
.bullet-list {
  margin-left: 20px;
  margin-bottom: 12pt;
  list-style-type: disc;
}

.bullet-list li {
  margin-bottom: 4pt;
  font-size: 11pt;
  line-height: 1.4;
  color: #222222;
}
```

**Complexity:** Low
**Reusability:** Very High

---

### C17: Site Plan Diagram Container
**Appears:** Pages 26-27
**Frequency:** 2
**Visual Description:**
- Centered diagram
- Subsection header in blue
- Border around diagram
- Red lot highlighting

**HTML Structure:**
```html
<div class="site-plan-container">
  <h2 class="subsection-header blue-header">{{ planTitle }}</h2>
  <div class="diagram-wrapper">
    <img [src]="diagramUrl" alt="{{ planTitle }}" class="site-plan-diagram" />
  </div>
</div>
```

**CSS Implementation:**
```css
.site-plan-container {
  page-break-inside: avoid;
}

.blue-header {
  color: #003366;
  text-align: center;
}

.diagram-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.site-plan-diagram {
  max-width: 90%;
  height: auto;
  border: 1px solid #D0D0D0;
}
```

**Props/Inputs:**
- `planTitle: string` (e.g., "Site Plans - Lot 17")
- `diagramUrl: string`

**Complexity:** Medium

---

### C18: Calculation Table with Subtotals
**Appears:** Pages 50, 61-64
**Frequency:** 5
**Visual Description:**
- Complex multi-section table
- Navy section dividers (C04) inside table
- Subtotal and total rows
- Red negative values
- Right-aligned numbers
- Multiple column types (labels, percentages, dollars)

**HTML Structure:**
```html
<table class="calculation-table">
  <thead>
    <tr><th colspan="{{ columnCount }}">{{ tableTitle }}</th></tr>
    <tr>
      <th *ngFor="let header of columnHeaders">{{ header }}</th>
    </tr>
  </thead>
  <tbody>
    <!-- Regular rows -->
    <tr *ngFor="let row of section1">
      <td>{{ row.label }}</td>
      <td class="number">{{ row.value1 }}</td>
      <td class="number">{{ row.value2 }}</td>
    </tr>

    <!-- Section Divider -->
    <tr class="section-divider">
      <td colspan="{{ columnCount }}">{{ section2Title }}</td>
    </tr>

    <!-- More rows -->
    <tr *ngFor="let row of section2">
      <td>{{ row.label }}</td>
      <td class="number" [class.negative]="row.isNegative">{{ row.value }}</td>
    </tr>

    <!-- Subtotal Row -->
    <tr class="subtotal-row">
      <td>{{ subtotalLabel }}</td>
      <td class="number" colspan="{{ columnCount - 1 }}">{{ subtotalValue }}</td>
    </tr>

    <!-- Total Row -->
    <tr class="total-row">
      <td>{{ totalLabel }}</td>
      <td class="number" colspan="{{ columnCount - 1 }}">{{ totalValue }}</td>
    </tr>
  </tbody>
</table>
```

**CSS Implementation:**
```css
.calculation-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #000000;
  font-size: 9pt;
}

.calculation-table thead {
  background-color: #003366;
  color: #FFFFFF;
  font-weight: bold;
  text-transform: uppercase;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.calculation-table thead th {
  padding: 8px;
  text-align: center;
  border-right: 1px solid #FFFFFF;
}

.calculation-table tbody td {
  padding: 6px 8px;
  border-bottom: 1px solid #D0D0D0;
  border-left: none;
  border-right: none;
}

.calculation-table tbody td.number {
  text-align: right;
  font-family: 'Courier New', monospace; /* For alignment */
}

.calculation-table tbody td.negative {
  color: #C00000;
}

.calculation-table tbody tr.section-divider {
  background-color: #003366;
  color: #FFFFFF;
  font-weight: bold;
  text-transform: uppercase;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.calculation-table tbody tr.section-divider td {
  padding: 8px;
  border: none;
}

.calculation-table tbody tr.subtotal-row {
  font-weight: 600;
  background-color: #F5F5F5;
}

.calculation-table tbody tr.total-row {
  font-weight: bold;
  font-size: 10pt;
  background-color: #E8E8E8;
  border-top: 2px solid #003366;
}
```

**Props/Inputs:**
- `tableTitle: string`
- `columnHeaders: string[]`
- `sections: TableSection[]`
  - `title: string`
  - `rows: TableRow[]`
- `subtotals: Subtotal[]`
- `total: Total`

**Complexity:** High
**Implementation Notes:**
- Most complex table component
- Multiple row types (data, section divider, subtotal, total)
- Automatic negative detection and red styling
- Used for Income Approach and Direct Comparison adjustments
- Critical for valuation calculations

---

## Component Reusability Matrix

| Component | Reusability | Pages Used | Implementation Priority |
|-----------|-------------|------------|-------------------------|
| C01: Chevron Footer | Very High | 76 | Critical |
| C02: Running Header | Very High | 73 | Critical |
| C03: Navy Header Table | Very High | 30+ | Critical |
| C04: Section Divider | High | 5 | High |
| C05: Photo Grid | High | 4 | Medium |
| C06: Photo Item | Very High | 27 | High |
| C07: Map Container | High | 5 | Medium |
| C08: Data Table | Very High | 20+ | Critical |
| C09: Comparables Map | Low | 1 | Low |
| C10: Comparable Card | Medium | 5 | High |
| C11: Bar Chart | Medium | 3 | Medium |
| C12: Line Chart | Low | 1 | Low |
| C13: Signature Block | High | 2 | Medium |
| C14: Value Conclusion | Low | 1 | Medium |
| C15: Text Section | Very High | 35+ | Critical |
| C16: Bullet List | Very High | 10+ | Critical |
| C17: Site Plan Container | Medium | 2 | Low |
| C18: Calculation Table | High | 5 | High |

---

## Implementation Notes

### Critical Components (Build First)
1. C01: Chevron Footer - Used on almost every page
2. C02: Running Header - Used on all content pages
3. C03: Navy Header Table - Most common data presentation
4. C08: Data Table - Multi-column data display
5. C15: Text Section - All narrative content
6. C16: Bullet List - Common in text pages

### High Priority Components (Build Second)
7. C04: Section Divider - Needed for complex tables
8. C06: Photo Item - Used in multiple contexts
9. C10: Comparable Card - Complex but critical for Sales Comparison
10. C18: Calculation Table - Core valuation calculations

### Medium Priority Components (Build Third)
11. C05: Photo Grid - Photo section
12. C07: Map Container - Map pages
13. C11: Bar Chart - Data visualization
14. C13: Signature Block - Certification pages
15. C14: Value Conclusion Box - Transmittal letter highlight

### Low Priority Components (Build Last)
16. C09: Comparables Map with Legend - One-off use
17. C12: Line Chart - One-off use
18. C17: Site Plan Container - Two pages only

---

**Document Status:** Complete Component Catalog
**Components Documented:** 18 distinct reusable components
**Total Component Instances:** 250+ across 79 pages
**Last Updated:** 2025-12-10
