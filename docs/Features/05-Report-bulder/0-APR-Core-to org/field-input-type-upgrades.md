# Field Input Type Upgrades

**Purpose:** Convert text fields to proper input types (dropdowns, toggles, etc.) based on Valcre workbook UX patterns.

**Reference:** `Report-Builder-Workbook-tab-ref.md` (466 fields, 13 input types)

**Registry:** `src/features/report-builder/schema/fieldRegistry.ts` (1,989 fields)

---

## Input Type Reference

| Type | Description | Example |
|------|-------------|---------|
| `text` | Single line input | Property name |
| `textarea` | Multi-line input | Legal description |
| `dropdown` | Single select | Property type |
| `multi-select` | Multiple selections | Modules selection |
| `boolean` | Toggle on/off | Use income approach |
| `date` | Date picker | Inspection date |
| `number` | Numeric input | Number of units |
| `currency` | Dollar amount | Sale price |
| `percentage` | Percentage | Cap rate |
| `image` | Image upload | Property photo |
| `file` | File upload | PDF attachment |

---

## PRIORITY 1: Dropdowns (26 fields)

### Setup & Property Classification

| Field ID | Label | Options |
|----------|-------|---------|
| `property-type` | Property Type | Multi-Family, Office, Retail, Industrial, Land, Special Purpose |
| `property-subtype` | Property Subtype | Apartment, MURB, Condo, Townhouse, Mixed-Use, Student Housing, Senior Living |
| `valuation-type` | Valuation Type | Current, Retrospective, Prospective |
| `occupancy-status` | Occupancy Status | Multi-Tenant, Single-Tenant, Owner-Occupied, Vacant |
| `timeframe` | Timeframe | Current, As Stabilized, As Complete, As Is |

### Report & Assignment

| Field ID | Label | Options |
|----------|-------|---------|
| `report-type` | Report Type | Appraisal Report, Restricted Appraisal, Desktop Appraisal |
| `appraisal-status` | Appraisal Status | Fully Detailed, Summary, Restricted |
| `property-rights` | Property Rights | Fee Simple Estate, Leased Fee Estate, Leasehold Interest |
| `scenario-name` | Scenario Name | As Is, As Stabilized, As Complete, Hypothetical |
| `value-component` | Value Component | Real Property, Real Property + FF&E, Going Concern |

### Location & Geography

| Field ID | Label | Options |
|----------|-------|---------|
| `province` | Province | AB, SK, MB, BC, ON, QC, NB, NS, PE, NL, NT, NU, YT |
| `country` | Country | Canada, United States |
| `adjacent-north` | Adjacent North | Residential, Commercial, Industrial, Vacant, Park, Road |
| `adjacent-south` | Adjacent South | Residential, Commercial, Industrial, Vacant, Park, Road |
| `adjacent-east` | Adjacent East | Residential, Commercial, Industrial, Vacant, Park, Road |
| `adjacent-west` | Adjacent West | Residential, Commercial, Industrial, Vacant, Park, Road |

### Qualitative Ratings (7 fields - all same options)

| Field ID | Label | Options |
|----------|-------|---------|
| `site-appeal` | Site Appeal | Excellent, Good, Average, Fair, Poor |
| `site-exposure` | Site Exposure | Excellent, Good, Average, Fair, Poor |
| `site-utility` | Site Utility | Excellent, Good, Average, Fair, Poor |
| `building-quality` | Building Quality | Excellent, Good, Average, Fair, Poor |
| `building-appeal` | Building Appeal | Excellent, Good, Average, Fair, Poor |
| `building-condition` | Building Condition | Excellent, Good, Average, Fair, Poor |
| `building-function` | Building Function | Excellent, Good, Average, Fair, Poor |

### Site Details

| Field ID | Label | Options |
|----------|-------|---------|
| `shape` | Site Shape | Rectangular, Square, Irregular, L-Shape, Triangular |
| `topography` | Topography | Level, Gently Sloping, Sloping, Steep, Rolling |
| `drainage` | Drainage | Adequate, Inadequate, Poor |
| `visibility` | Visibility | Excellent, Good, Average, Fair, Poor |

### Zoning & Compliance

| Field ID | Label | Options |
|----------|-------|---------|
| `zoning-compliance` | Zoning Compliance | Legal Conforming, Legal Non-Conforming, Illegal |
| `conforming-use` | Conforming Use | Yes, No, Non-Conforming |
| `conforming-lot` | Conforming Lot | Yes, No |

### Improvements

| Field ID | Label | Options |
|----------|-------|---------|
| `construction-type` | Construction Type | Wood Frame, Steel Frame, Concrete, Masonry |
| `foundation` | Foundation | Concrete, Block, Slab, Crawl Space |
| `roof-type` | Roof Type | Flat, Pitched, Hip, Gable |
| `building-class` | Building Class | A, B, C, D |
| `parking-type` | Parking Type | Surface, Underground, Structured, Street |

### Transaction

| Field ID | Label | Options |
|----------|-------|---------|
| `deed-type` | Deed Type | Warranty, Quitclaim, Special Warranty, Trustee |
| `tax-status` | Tax Status | Current, Delinquent, Exempt |
| `assessment-trend` | Assessment Trend | Increasing, Stable, Decreasing |

### Appraiser

| Field ID | Label | Options |
|----------|-------|---------|
| `appraiser1-role` | Appraiser 1 Role | Primary Appraiser, Co-Appraiser, Review Appraiser |
| `appraiser2-role` | Appraiser 2 Role | Primary Appraiser, Co-Appraiser, Review Appraiser |

### Utilities (4 fields)

| Field ID | Label | Options |
|----------|-------|---------|
| `util-water` | Water | Municipal, Well, Cistern, None |
| `util-sewer` | Sewer | Municipal, Septic, None |
| `util-electric` | Electric | Connected, Not Connected |
| `util-gas` | Gas | Natural Gas, Propane, None |

### Market & Economic

| Field ID | Label | Options |
|----------|-------|---------|
| `economic-outlook` | Economic Outlook | Improving, Stable, Declining |
| `market-outlook` | Market Outlook | Improving, Stable, Declining |

---

## PRIORITY 2: Toggles/Booleans (15 fields)

### Approach Selection (already done)

| Field ID | Label | Default |
|----------|-------|---------|
| `home-use-income-approach` | Use Income Approach | true |
| `home-use-sales-approach` | Use Sales Comparison | true |
| `home-use-cost-approach` | Use Cost Approach | true |

### Additional Approach Toggles (need to add)

| Field ID | Label | Default |
|----------|-------|---------|
| `use-land-dc` | Use Site & Land DC | false |
| `use-multi-dc` | Use Multi-DC | false |
| `use-dcf` | Use DCF Analysis | false |
| `use-stabilization` | Use Stabilization Tool | false |
| `use-special` | Use Special/Hotel | false |

### Appraiser Toggles

| Field ID | Label | Default |
|----------|-------|---------|
| `appraiser1-inspector` | Appraiser 1 Inspected | true |
| `appraiser1-ce` | Appraiser 1 CE Completed | true |
| `appraiser1-ethics` | Appraiser 1 Ethics Completed | true |
| `appraiser2-inspector` | Appraiser 2 Inspected | false |
| `appraiser2-ce` | Appraiser 2 CE Completed | true |
| `appraiser2-ethics` | Appraiser 2 Ethics Completed | true |

---

## PRIORITY 3: Multi-Select (2 fields)

| Field ID | Label | Options |
|----------|-------|---------|
| `select-modules` | Select Modules | DC, Income, Cost, Land, DCF |
| `approaches-applied` | Approaches Applied | Cost, Sales Comparison, Income |

---

## PRIORITY 4: Auto-Calculated with Defaults (6 fields)

These fields should auto-populate with default text if their parent fields are empty:

| Field ID | Default Value When Empty |
|----------|-------------------------|
| `ea-default` | "No Extraordinary Assumptions were made for this assignment." |
| `hc-default` | "No Hypothetical Conditions were made for this assignment." |
| `elc-default` | "No Extraordinary Limiting Conditions were made for this assignment." |
| `assistance-default` | "No one provided significant real property appraisal assistance to the persons signing this appraisal report." |

---

## Implementation Notes

### Field Definition Pattern with Options

```typescript
{
  id: 'property-type',
  storeId: 'property-type',
  label: 'Property Type',
  section: 'home',
  subsection: 'job-setup',
  type: 'dropdown',  // Changed from 'text'
  inputSource: 'user-input',
  required: true,
  options: ['Multi-Family', 'Office', 'Retail', 'Industrial', 'Land', 'Special Purpose']
},
```

### Toggle Pattern

```typescript
{
  id: 'use-dcf',
  storeId: 'use-dcf',
  label: 'Use DCF Analysis',
  section: 'home',
  subsection: 'approach-selection',
  type: 'boolean',
  inputSource: 'user-input',
  required: false,
  defaultValue: false
},
```

---

## Summary

| Category | Count |
|----------|-------|
| Dropdowns | ~45 |
| Toggles | ~15 |
| Multi-Select | 2 |
| Auto-Default | 4 |
| **Total** | **~66 fields to upgrade** |

---

## Next Steps

1. Update fieldRegistry.ts with `type` and `options` changes
2. Update EditPanel.tsx to render dropdowns/toggles based on field type
3. Add default value logic for auto-calculated fields
4. Test in mock-builder

---

*Created: January 3, 2026*
*Source: Report-Builder-Workbook-tab-ref.md*
