# Sales Comparison Section Input Fields

These are the USER INPUT fields for the Report Builder Sales Comparison Section.

**Loads via:** "Load Test Data" button in Sales section of EditPanel
**Rule:** User enters these. Template displays them in the Direct Comparison Approach pages.

---

## Comparable Sale 1

All fields for the first comparable sale.

### Identification
- **Comp 1 Name:** `comp1-name`  |  Heritage House  |  Property name
- **Comp 1 Address:** `comp1-address`  |  1551 107 St  |  Street address
- **Comp 1 City:** `comp1-city`  |  North Battleford  |  City
- **Comp 1 Province:** `comp1-province`  |  SK  |  Province/State
- **Comp 1 Postal:** `comp1-postal`  |  S9A 2A1  |  Postal code
- **Comp 1 ID:** `comp1-id`  |  10760757  |  Valcre property ID

### Sale Information
- **Comp 1 Sale Price:** `comp1-sale-price`  |  3117383  |  Transaction price
- **Comp 1 Sale Date:** `comp1-sale-date`  |  2024-06-17  |  Date of sale
- **Comp 1 Buyer:** `comp1-buyer`  |  Epiphany Group  |  Buyer name
- **Comp 1 Seller:** `comp1-seller`  |  Macro Properties Toronto  |  Seller name
- **Comp 1 Financing:** `comp1-financing`  |  Cash to Seller  |  Financing terms
- **Comp 1 Sale Conditions:** `comp1-saleconditions`  |  Arm's Length  |  Sale conditions
- **Comp 1 Sale Status:** `comp1-salestatus`  |  Closed  |  Transaction status

### Physical Characteristics
- **Comp 1 Units:** `comp1-units`  |  24  |  Number of units
- **Comp 1 GBA:** `comp1-gba`  |  22754  |  Gross building area
- **Comp 1 NRA:** `comp1-nra`  |  22754  |  Net rentable area
- **Comp 1 Year Built:** `comp1-year-built`  |  2000  |  Year of construction
- **Comp 1 Site Size:** `comp1-sitesize`  |  21780  |  Site area (SF)
- **Comp 1 Condition:** `comp1-condition`  |  Average  |  Property condition
- **Comp 1 Quality:** `comp1-quality`  |  Average  |  Construction quality
- **Comp 1 Location:** `comp1-location`  |  Average  |  Location rating
- **Comp 1 Access:** `comp1-access`  |  Average  |  Accessibility rating
- **Comp 1 Exposure:** `comp1-exposure`  |  Average  |  Visibility/exposure
- **Comp 1 Appeal:** `comp1-appeal`  |  Average  |  Market appeal

### Financial Metrics
- **Comp 1 Price Per Unit:** `comp1-price-per-unit`  |  $129,891  |  Sale price per unit
- **Comp 1 Cap Rate:** `comp1-cap-rate`  |  0.0599  |  Capitalization rate
- **Comp 1 NOI Per Unit:** `comp1-noi-per-unit`  |  $7,780  |  NOI per unit

### Adjustments
- **Comp 1 Adj Property Rights:** `comp1-adj-property-rights`  |  0  |  Property rights adjustment (%)
- **Comp 1 Adj Financing:** `comp1-adj-financing`  |  0  |  Financing adjustment (%)
- **Comp 1 Adj Sale Conditions:** `comp1-adj-sale-conditions`  |  0  |  Conditions of sale adjustment (%)
- **Comp 1 Adj Market Conditions:** `comp1-adj-market-conditions`  |  0  |  Market conditions adjustment (%)
- **Comp 1 Adj Location:** `comp1-adj-location`  |  0  |  Location adjustment (%)
- **Comp 1 Adj Size:** `comp1-adj-size`  |  0  |  Size adjustment (%)
- **Comp 1 Adj Age/Condition:** `comp1-adj-age-condition`  |  -10  |  Age/condition adjustment (%)
- **Comp 1 Adj Other:** `comp1-adj-other`  |  -0.2  |  Other adjustments (%)
- **Comp 1 Adjusted Price Per Unit:** `comp1-adjprice-per-unit`  |  $116,635  |  Adjusted price per unit
- **Comp 1 Total Adjustments:** `comp1-total-adjustments`  |  -$13,256  |  Sum of all adjustments
- **Comp 1 Overall Comparison:** `comp1-overall-comparison`  |  SIMILAR  |  Overall comparison to subject

### Amenities
- **Comp 1 Unit Amenities:** `comp1-unit-amenities`  |  Air Conditioning, Range/Stove, Refrigerator  |  In-unit amenities
- **Comp 1 Project Amenities:** `comp1-projamenities`  |  Guest Parking  |  Building amenities
- **Comp 1 Parking Type:** `comp1-parking-type`  |  Surface  |  Type of parking

### Comments
- **Comp 1 Comments (Sale):** `comp1-comments-sale`  |  Macro Properties Toronto sold this 143-unit portfolio...  |  Sale transaction comments
- **Comp 1 Comments (Property):** `comp1-comments-prop`  |  -  |  Property comments

### Media
- **Comp 1 Photo:** `comp1-photo`  |  /extracted-images/image73.jpg  |  Property photo
- **Comp 1 Map:** `comp1-map`  |  /extracted-images/image74.png  |  Location map
- **Comp 1 Photo Caption:** `comp1-photo-caption`  |  Comp 1 - 1551 107 St, North Battleford  |  Photo caption

---

## Comparable Sales 2-4

Comps 2-4 follow the same field pattern as Comp 1, with the prefix changed:
- `comp2-*` for Comparable 2
- `comp3-*` for Comparable 3
- `comp4-*` for Comparable 4

Example for Comp 2:
- **Comp 2 Name:** `comp2-name`  |  College View Apartments  |  Property name
- **Comp 2 Address:** `comp2-address`  |  10910-10912 Winder Crescent  |  Street address
- **Comp 2 Units:** `comp2-units`  |  45  |  Number of units
- **Comp 2 Sale Price:** `comp2-sale-price`  |  4590858  |  Transaction price
- (etc. for all fields)

---

## DCA Statistics

Summary statistics across all comparables.

- **DCA Adj Price High:** `dca-adjprice-high`  |  118100  |  Highest adjusted price/unit
- **DCA Adj Price Avg:** `dca-adjprice-avg`  |  115981  |  Average adjusted price/unit
- **DCA Adj Price Low:** `dca-adjprice-low`  |  111914  |  Lowest adjusted price/unit
- **DCA Avg Price Per Unit:** `dca-avg-price-per-unit`  |  $0  |  Average unadjusted price
- **DCA High Price Per Unit:** `dca-high-price-per-unit`  |  $0  |  High unadjusted price
- **DCA Low Price Per Unit:** `dca-low-price-per-unit`  |  $0  |  Low unadjusted price
- **DCA Med Price Per Unit:** `dca-med-price-per-unit`  |  $0  |  Median unadjusted price

---

## Field Mapping: Source to Sales

Maps source fields from `northBattlefordTestData.ts` to sales field IDs.

**Comp Pattern:**
- `comp{N}-name`, `comp{N}-address`, `comp{N}-city` → Identification
- `comp{N}-sale-price`, `comp{N}-sale-date` → Transaction data
- `comp{N}-units`, `comp{N}-gba`, `comp{N}-year-built` → Physical characteristics
- `comp{N}-cap-rate`, `comp{N}-noi-per-unit` → Financial metrics
- `comp{N}-adj-*` → Adjustment fields
- `comp{N}-photo`, `comp{N}-map` → Media

**Statistics:**
- `dca-adjprice-high/avg/low` → Adjusted price statistics
- `dca-*-price-per-unit` → Unadjusted price statistics

---

## Total Fields: ~200

Each comparable has approximately 45 fields:
- Identification: 6
- Sale Information: 7
- Physical Characteristics: 12
- Financial Metrics: 3
- Adjustments: 11
- Amenities: 3
- Comments: 2
- Media: 3

With 4 comparables: 4 × 45 = 180 fields
Plus DCA statistics: ~20 fields

---

## Adding New Sales Fields

1. Add field definition to `initializeMockData()` in `reportBuilderStore.ts`
2. Add mapping in `loadSalesTestData()` function
3. Update this documentation
4. Test with "Load Test Data" button
