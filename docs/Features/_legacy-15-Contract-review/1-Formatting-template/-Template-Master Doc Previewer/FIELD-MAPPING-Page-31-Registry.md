# Field Mapping - Page 31 (Saskatchewan Multifamily Indicators)

**Page:** 31 - Multi-Family Market Overview
**Location in HTML:** Lines 1874-1955
**Total Fields:** 8 market indicator fields (+ 2 footer fields)
**Status:** HTML Updated ✅ | Field IDs Converted to kebab-case ✅

---

## Overview

Page 31 presents Saskatchewan's multifamily rental market indicators for 2025, sourced from CMHC (Canada Mortgage and Housing Corporation). The page includes:

1. **Market Context Paragraph** - Narrative overview of 2025 Saskatchewan rental market conditions
2. **8-Row Indicators Table** - Key metrics (vacancy rate, average rents by bedroom type, rental growth, new supply)
3. **Standard Footer** - Property address and file number

All field IDs have been converted from PascalCase to kebab-case format for consistency with the established registry pattern.

---

## Field Crosswalk

| # | HTML Field ID (Registry) | Valcre Source | Sample Value | Notes |
|---|-------------------------|---------------|--------------|-------|
| **Market Indicators - 8 fields** |
| 1 | `sk-vacancy-rate` | MARKET.SK_VacancyRate | "3.0%" | Provincial vacancy rate for multifamily rentals |
| 2 | `sk-avgrent-bachelor` | MARKET.SK_AvgRent_Bachelor | "$885" | Average monthly rent for bachelor units |
| 3 | `sk-avgrent-1bed` | MARKET.SK_AvgRent_1Bed | "$1,160" | Average monthly rent for 1-bedroom units |
| 4 | `sk-avgrent-2bed` | MARKET.SK_AvgRent_2Bed | "$1,390" | Average monthly rent for 2-bedroom units |
| 5 | `sk-avgrent-3bed` | MARKET.SK_AvgRent_3Bed | "$1,650" | Average monthly rent for 3-bedroom units |
| 6 | `sk-rental-rate-growth` | MARKET.SK_RentalRateGrowth | "+3.5% YoY" | Year-over-year rental rate growth |
| 7 | `sk-new-supply` | MARKET.SK_NewSupply | "+1,200 units YoY" | New multifamily units added year-over-year |
| 8 | `sk-supply-growth-rate` | MARKET.SK_SupplyGrowthRate | "+3.0% YoY" | Percentage growth in rental supply |
| **Footer Fields** |
| 9 | `property-address` | PROPERTY.Address | "1101, 1121 109 St, North Battleford, Saskatchewan" | Full property address |
| 10 | `file-number` | FILE.Number | "VAL251012 - 1" | Appraisal file number |

---

## Table Structure

### Saskatchewan Multifamily Indicators Table

**Headers:**
- **Indicator** - Name of the metric
- **Estimate** - Current value (CMHC data)
- **Commentary** - Brief analysis of the indicator
- **Source** - Data source (all CMHC)

**Rows (8 total):**
1. Vacancy Rate
2. Average Rent - Bachelor
3. Average Rent - 1 Bed
4. Average Rent - 2 Bed
5. Average Rent - 3 Bed
6. Rental Rate Growth
7. New Supply
8. Supply Growth Rate

**Styling:**
- **Header**: White text on #003B7E background, 12pt Georgia serif
- **Column Headers**: Uppercase, bold, 8pt font
- **Table**: 9pt font, full width, collapsed borders
- **Rows**: 1px bottom border (#eee), 10px vertical padding

---

## Field Category: Market Indicators

All 8 Saskatchewan multifamily fields belong to the **market-indicators** category in the field registry. These fields provide provincial-level market context for the appraisal report.

**Registry Category:** `market-indicators`

**Field Types:**
- Vacancy rate: percentage (formatted as "X.X%")
- Average rents: currency (formatted as "$X,XXX")
- Rental rate growth: percentage with YoY qualifier
- New supply: units with YoY qualifier
- Supply growth rate: percentage with YoY qualifier

---

## Data Source: CMHC

**Source:** Canada Mortgage and Housing Corporation (CMHC)
**Frequency:** Annual updates (typically released in fall for current year)
**Scope:** Provincial level (Saskatchewan)
**Market Type:** Multifamily rental (purpose-built apartments)

**Data Elements:**
- **Vacancy Rate:** Percentage of vacant rental units in purpose-built structures (3+ units)
- **Average Rents:** Mean monthly rent by bedroom type across all rental structures
- **Rental Rate Growth:** Year-over-year percentage change in average rents
- **New Supply:** Net new rental units added to inventory
- **Supply Growth Rate:** Percentage increase in total rental stock

---

## HTML Code Pattern

```html
<tr style="border-bottom: 1px solid #eee;">
    <td style="padding: 10px 8px;">Vacancy Rate</td>
    <td style="padding: 10px 8px;">
        <span class="field-mapped" data-sample="3.0%" title="{{sk-vacancy-rate}}">
            {{sk-vacancy-rate}}
        </span>
    </td>
    <td style="padding: 10px 8px;">Slight rise since 2024 as completions increase and in-migration slows.</td>
    <td style="padding: 10px 8px; text-align: right;">CMHC</td>
</tr>
```

**Pattern Elements:**
- `class="field-mapped"` - Identifies dynamic content
- `data-sample="..."` - Provides sample value for testing
- `title="{{field-id}}"` - Tooltip shows field ID
- `{{field-id}}` - Mustache template placeholder

---

## Field Naming Convention Change

**Original Format (PascalCase with underscores):**
- `{{SK_VacancyRate}}`
- `{{SK_AvgRent_Bachelor}}`
- `{{SK_RentalRateGrowth}}`

**Updated Format (kebab-case):**
- `{{sk-vacancy-rate}}`
- `{{sk-avgrent-bachelor}}`
- `{{sk-rental-rate-growth}}`

**Rationale:** Consistent with established field naming pattern across all pages (Pages 37, 39, 44, 49, 59, 61, 63).

**Conversion Date:** December 18, 2025
**Commit:** 63b5b62

---

## Registry Addition Requirements

These 8 fields need to be added to `fieldRegistry.ts`:

```typescript
// Saskatchewan Multifamily Market Indicators (Page 31)
'sk-vacancy-rate': {
  id: 'sk-vacancy-rate',
  label: 'SK Vacancy Rate',
  type: 'text',
  category: 'market-indicators',
  description: 'Provincial vacancy rate for multifamily rentals (CMHC)'
},
'sk-avgrent-bachelor': {
  id: 'sk-avgrent-bachelor',
  label: 'SK Avg Rent - Bachelor',
  type: 'currency',
  category: 'market-indicators',
  description: 'Average monthly rent for bachelor units (CMHC)'
},
'sk-avgrent-1bed': {
  id: 'sk-avgrent-1bed',
  label: 'SK Avg Rent - 1 Bed',
  type: 'currency',
  category: 'market-indicators',
  description: 'Average monthly rent for 1-bedroom units (CMHC)'
},
'sk-avgrent-2bed': {
  id: 'sk-avgrent-2bed',
  label: 'SK Avg Rent - 2 Bed',
  type: 'currency',
  category: 'market-indicators',
  description: 'Average monthly rent for 2-bedroom units (CMHC)'
},
'sk-avgrent-3bed': {
  id: 'sk-avgrent-3bed',
  label: 'SK Avg Rent - 3 Bed',
  type: 'currency',
  category: 'market-indicators',
  description: 'Average monthly rent for 3-bedroom units (CMHC)'
},
'sk-rental-rate-growth': {
  id: 'sk-rental-rate-growth',
  label: 'SK Rental Rate Growth',
  type: 'text',
  category: 'market-indicators',
  description: 'Year-over-year rental rate growth percentage (CMHC)'
},
'sk-new-supply': {
  id: 'sk-new-supply',
  label: 'SK New Supply',
  type: 'text',
  category: 'market-indicators',
  description: 'New multifamily units added year-over-year (CMHC)'
},
'sk-supply-growth-rate': {
  id: 'sk-supply-growth-rate',
  label: 'SK Supply Growth Rate',
  type: 'text',
  category: 'market-indicators',
  description: 'Percentage growth in rental supply year-over-year (CMHC)'
},
```

---

## Page Context

**Section:** Market Analysis (Pages 31-42)
**Purpose:** Provide provincial market context for subject property valuation
**Relationship to Other Pages:**
- **Page 32:** Unit mix and rent roll for subject property
- **Pages 37-40:** Rental survey comparables and adjustment grid
- **Page 49:** Direct capitalization income approach

**Market Context Flow:**
1. Page 31: Provincial indicators (Saskatchewan)
2. Page 32: Subject property unit mix
3. Pages 37-40: Rental comparables survey
4. Page 49: Income approach (applying market rent conclusions)

---

## Testing Checklist

- [x] Field IDs converted to kebab-case
- [x] All 8 indicator fields properly wrapped in `<span class="field-mapped">`
- [x] Footer fields updated to standard format
- [x] Table styling consistent with brand (#003B7E header)
- [ ] Fields added to fieldRegistry.ts
- [ ] Sample values tested in preview
- [ ] CMHC data source verified for 2025

---

## Notes

- **CMHC Data:** Updated annually, typically in fall. Ensure values reflect most recent CMHC Rental Market Report for Saskatchewan.
- **Market Context Paragraph:** Static narrative text, not field-mapped. Should be reviewed/updated annually to reflect current market conditions.
- **Commentary Column:** Static text providing context for each indicator. Not field-mapped as commentary is report-specific analysis.
- **Source Column:** All indicators show "CMHC" as source. Could be field-mapped if multiple sources used in future.

---

**Created:** December 18, 2025
**Last Updated:** December 18, 2025
**Related Commits:** 7f36594 (Page 31 replacement), 63b5b62 (Field ID conversion)
