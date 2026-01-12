# Non-Calculator Template Fields

Template fields that require data sources OTHER than the calculator panels.

---

## Property Metadata (All Pages)

These appear in headers/footers throughout the report.

| Field ID | Description | Source Needed |
|----------|-------------|---------------|
| `subject-street` | Property address | Property Info section |
| `subject-city` | City | Property Info section |
| `subject-province` | Province/State | Property Info section |
| `subject-units` | Total units | Calculator (added) |
| `company-name` | Appraisal company name | Company settings |
| `company-address` | Company address | Company settings |
| `company-phone` | Company phone | Company settings |
| `company-jobnumber` | File/job number | Report metadata |
| `company-website` | Company website | Company settings |
| `company-email` | Company email | Company settings |

---

## Page 62: Reconciliation Metadata

| Field ID | Description | Source Needed |
|----------|-------------|---------------|
| `VALUE-SCENARIO` | Valuation scenario (AS IS, AS COMPLETE) | Report metadata |
| `property-rights` | Property rights appraised | Report metadata |
| `recon-effective-date` | Effective date of appraisal | Report metadata |

---

## Page 56: Sales Summary Sheets (Comp Details)

Each comp (1-5) needs ~30 research fields. These are property research data, not calculator values.

**Per Comparable (comp1-* through comp5-*):**

| Field Pattern | Description |
|---------------|-------------|
| `compN-buyer` | Buyer name |
| `compN-seller` | Seller name |
| `compN-sale-date` | Date of sale |
| `compN-noi` | Net Operating Income |
| `compN-cap-rate` | Capitalization rate |
| `compN-occupancy` | Occupancy at sale |
| `compN-year-built` | Year built |
| `compN-condition` | Property condition |
| `compN-parking-ratio` | Parking ratio |
| `compN-unit-mix` | Unit mix description |
| `compN-amenities` | Amenities list |
| `compN-photo` | Property photo path |
| `compN-map` | Location map path |
| `compN-comments` | Appraiser comments |
| `compN-verification` | Verification source |

---

## Future Implementation Options

1. **Property Info Panel** - Add editable fields for subject property metadata
2. **Company Settings** - Store in app config or user settings
3. **Comp Research Panel** - Separate panel for entering detailed comp data
4. **Report Metadata Section** - File number, effective date, scenario type

---

## What IS Coming From Calculator

For reference, these field categories ARE populated by the calculator:

- `calc-*` - Income approach calculations (NOI, cap rate, expenses, etc.)
- `hist-*` - Historical operating data (YTD values)
- `comp1-* through comp5-*` - Basic comp adjustments (price, trans adj, phys adj)
- `dca-*` - Direct comparison statistics (HIGH/AVG/MED/LOW)
- `sca-*` - Sales comparison conclusions
- `recon-*` - Reconciliation weights and final values
- `*-proj-pct` - Projection percentages
