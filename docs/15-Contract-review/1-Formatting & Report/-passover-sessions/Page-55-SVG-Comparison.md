# Page 55 SVG Comparison Analysis
**Date:** December 17, 2025
**Purpose:** Identify dynamic vs static text for field mapping

---

## Page Structure

Page 55 displays a **Sales Comparable Property Detail Card** with the following sections:
1. Header: "Valuation & Conclusions"
2. Property Name and Comparable Number
3. Sale Information
4. Income Analysis
5. Property Details
6. Location Information
7. Remarks/Description Paragraph
8. Footer

---

## Dynamic vs Static Text Analysis

### BOILERPLATE TEXT (Do NOT wrap in field-mapped spans)

**Section Headers:**
- "Valuation & Conclusions"
- "Sale Information"
- "Income Analysis"
- "Property"

**Field Labels:**
- "Buyer"
- "Seller"
- "Sale Date"
- "Transaction Status"
- "Sale Price"
- "Analysis Price"
- "Rights Transferred"
- "Financing"
- "Conditions of Sale"
- "Occupancy"
- "Net Operating Income"
- "Cap Rate"
- "Type"
- "Rent Type"
- "Gross Building Area (GBA)"
- "Net Rentable Area (NRA)"
- "Units"
- "Structures"
- "Year Built"
- "Land Area"
- "Zoning"
- "Project Amenities"
- "Unit Amenities"
- "Parking Type"
- "Utilities"
- "County"
- "Submarket"
- "Remarks"
- "Avg. Size"

**Static Symbols:**
- "$" (dollar sign prefix for prices)
- "%" (percent suffix for rates)
- "/" (separator in "/Unit", "/SF")
- "SF" (square feet)
- "Acres"

---

## DYNAMIC TEXT (Wrap in field-mapped spans)

### North Battleford Example (Comparable 2):

| Field Category | North Battleford Value | Binscarth Value (Comp 4) | Field ID Pattern |
|----------------|------------------------|--------------------------|------------------|
| **Property Identity** | | | |
| Property Name | College View Apartments | Spruce Court | `{{Comp[N]_PropertyName}}` |
| Comparable Number | Comparable 2 | Comparable 4 | `{{Comp[N]_Number}}` |
| **Sale Information** | | | |
| Buyer | Epiphany Group | Not Available | `{{Comp[N]_Buyer}}` |
| Seller | Macro Properties Toronto | Not Available | `{{Comp[N]_Seller}}` |
| Sale Date | 2024-06-17 | 2025-10-27 | `{{Comp[N]_SaleDate}}` |
| Transaction Status | Closed | Listing | `{{Comp[N]_TransactionStatus}}` |
| Sale Price | $4,590,858 | $1,918,656 | `{{Comp[N]_SalePrice}}` |
| Price Per Unit | $102,019/Unit | $159,888/Unit | `{{Comp[N]_PricePerUnit}}` |
| Analysis Price | $4,590,858 | $1,918,656 | `{{Comp[N]_AnalysisPrice}}` |
| Analysis Price/Unit | $102,019/Unit | $159,888/Unit | `{{Comp[N]_AnalysisPricePerUnit}}` |
| Rights Transferred | Fee Simple | Fee Simple | `{{Comp[N]_RightsTransferred}}` |
| Financing | Cash To Seller | Cash to seller | `{{Comp[N]_Financing}}` |
| Conditions of Sale | Arm's Length | Arm's Length | `{{Comp[N]_ConditionsOfSale}}` |
| **Income Analysis** | | | |
| Occupancy | 100.0% | (not shown) | `{{Comp[N]_Occupancy}}` |
| Net Operating Income | $274,992.39 | $129,893.01 | `{{Comp[N]_NOI}}` |
| NOI Per Unit | $6,110.94/Unit | $10,824.42/Unit | `{{Comp[N]_NOI_PerUnit}}` |
| Cap Rate | 5.99% | 6.77% | `{{Comp[N]_CapRate}}` |
| **Property Details** | | | |
| Property Type | Multi-Family, Walk-Up | Multi-Family | `{{Comp[N]_PropertyType}}` |
| Rent Type | Market | (not shown) | `{{Comp[N]_RentType}}` |
| GBA | 33,509 SF | 3,000 SF | `{{Comp[N]_GBA}}` |
| NRA | 33,509 SF | 3,000 SF | `{{Comp[N]_NRA}}` |
| Units | 45 | 12 | `{{Comp[N]_Units}}` |
| Avg. Size | 0 SF | (varies) | `{{Comp[N]_AvgSize}}` |
| Unit Type | Flat 1Bed / 1Bath | (varies) | `{{Comp[N]_UnitType}}` |
| Structures | 2 Buildings, 3 Floors | 3 Buildings, 2 Floors | `{{Comp[N]_Structures}}` |
| Year Built | 2000 | 1980 | `{{Comp[N]_YearBuilt}}` |
| Land Area | 0.5 Acres (21,780 SF) | 0.3444 Acres (15,000 SF) | `{{Comp[N]_LandArea}}` |
| Zoning | RS6 | R6 | `{{Comp[N]_Zoning}}` |
| Project Amenities | Parking | Guest Parking, Pool, Storage Units | `{{Comp[N]_ProjectAmenities}}` |
| Unit Amenities | Balcony, Dishwasher, Microwave... | Microwave, Range/Stove, Refrigerator | `{{Comp[N]_UnitAmenities}}` |
| Parking Type | Surface | Surface | `{{Comp[N]_ParkingType}}` |
| Utilities | Full Services | Full Services | `{{Comp[N]_Utilities}}` |
| **Location** | | | |
| Address | 10910-10912 Winder Crescent | 5123 50 St | `{{Comp[N]_Address}}` |
| City, State, Zip | North Battleford, SK S9A 2C3 | Redwater, AB T0A 0E6 | `{{Comp[N]_CityStateZip}}` |
| County | North Battleford | Sturgeon | `{{Comp[N]_County}}` |
| Submarket | Saskatchewan Area | Redwater | `{{Comp[N]_Submarket}}` |
| **Remarks** | | | |
| Description Paragraph | Macro Properties Toronto sold this 143-unit portfolio to Epiphany Group for $14,000,000 or $97,902.09 per unit. The buyer was drawn to purchasing these properties to diversify and strengthen their investment portfolio. The net operating income in 2024 was reported to be $838,909, yielding a 5.99% cap rate. | (Binscarth has different remarks) | `{{Comp[N]_Remarks}}` |

---

## Key Findings

### 1. ALL Data Values are Dynamic
Every piece of data on this page changes between properties. This includes:
- Property names and comparable numbers
- All sale information (prices, dates, parties)
- All income metrics (NOI, cap rate, occupancy)
- All physical attributes (size, units, year built)
- Location details (address, county, submarket)
- Descriptive remarks paragraph

### 2. Comparable Number is Dynamic
- North Battleford shows "Comparable 2"
- Binscarth shows "Comparable 4"
- This means each sales comparison page represents a different comparable from the sales grid

### 3. Remarks Section is Fully Dynamic
The paragraph at the bottom contains property-specific narrative that is completely different between properties:
- **North Battleford:** "Macro Properties Toronto sold this 143-unit portfolio to Epiphany Group for $14,000,000 or $97,902.09 per unit..."
- **Binscarth:** (Would have completely different text about Spruce Court)

### 4. Field Structure Variations
Some fields appear in one property but not the other:
- **Occupancy:** Shown for North Battleford (100.0%), not shown for Binscarth
- **Rent Type:** Shown for North Battleford (Market), not shown for Binscarth

---

## Comparison with Existing HTML (PREVIEW-Master.html)

**Current Status:** Page 55 in PREVIEW-Master.html currently shows:
- Title: "Sales Comparison Approach Analysis"
- 4 paragraphs of boilerplate methodology text
- No comparable property detail card

**Issue:** The HTML does not match the SVG reference at all. Page 55 should display a **detailed comparable property card**, not methodology paragraphs.

**Hypothesis:**
- The methodology paragraphs currently on "Page 55" might actually belong to an earlier page
- Page 55 should be a **comparable detail page** (similar to pages showing individual comps)
- This is part of the Sales Comparison Approach section where each comparable gets a full-page detailed breakdown

---

## Field Naming Convention

For this comparable detail page, use the pattern:

```
{{Comp[N]_FieldName}}
```

Where:
- `[N]` = Comparable number (1-5 typically)
- `FieldName` = Descriptive field name in PascalCase

**Examples:**
- `{{Comp2_PropertyName}}` → "College View Apartments"
- `{{Comp2_SalePrice}}` → "$4,590,858"
- `{{Comp2_CapRate}}` → "5.99%"
- `{{Comp2_Remarks}}` → (full paragraph text)

---

## Recommended Action

**Page 55 needs to be completely rewritten** to match the SVG structure:

1. Remove the 4 methodology paragraphs (these likely belong elsewhere)
2. Create a comparable property detail card layout matching the SVG
3. Add field-mapped spans for ALL data values (60+ fields per comparable)
4. Keep labels and section headers as plain text
5. Make the page dynamic to show any comparable (Comp1 through Comp5)

**Estimated Fields to Map:** ~60 fields per comparable property card

**Next Steps:**
1. User confirmation that Page 55 should be a comparable detail card
2. Check if there are Pages 55-59 (one for each of 5 comparables)
3. Determine if we need a template that accepts a comparable number parameter
4. Create the field mappings following the Field ID Guide patterns

---

**Analysis Complete.**
**Ready for field mapping implementation upon user approval.**
