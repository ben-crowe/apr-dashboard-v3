# Report Builder EditPanel Complete Inventory

**Generated:** 2026-01-08  
**Source:** `/mock-builder` Report Builder EditPanel components  
**Purpose:** Complete field-by-field inventory of all tabs, sub-tabs, input fields, output displays, and narratives

---

## HOME

### Sub-tabs:
none

### Input Sections:

| Section | Field ID | Type | Wired? | Notes |
|---------|----------|------|--------|-------|
| Valuation Approaches | `home-use-income-approach` | boolean | Yes | Toggle switch |
| Valuation Approaches | `home-use-sales-approach` | boolean | Yes | Toggle switch |
| Valuation Approaches | `home-use-cost-approach` | boolean | Yes | Toggle switch |
| Valuation Approaches | `use-dcf` | boolean | Yes | Toggle switch |
| Valuation Approaches | `use-land-dc` | boolean | Yes | Toggle switch |
| Valuation Approaches | `sale-lease-config` | select | Yes | Dropdown: $/Unit, $/SF, $/Month |
| Job Setup | `job-number` | text | Yes | Read-only |
| Job Setup | `property-type` | select | Yes | Dropdown from registry |
| Job Setup | `property-subtype` | select | Yes | Dropdown: Apartment, MURB, Condo, Townhouse, Mixed-Use |
| Job Setup | `value-scenario` | select | Yes | Dropdown from registry |
| Job Setup | `calc-total-units` | number | No | Read-only, computed from Income Tab |
| Job Setup | `occupancy-status` | select | Yes | Dropdown: Multi-Tenant, Single-Tenant, Owner-Occupied, Vacant |
| Job Setup | `report-type` | select | Yes | Dropdown from registry |
| Job Setup | `property-description-prefix` | textarea | Yes | Narrative text |
| Appraisal Firm | `company-name` | text | Yes | |
| Appraisal Firm | `appraisal-status` | select | Yes | Dropdown: Fully Detailed, Summary, Restricted |
| Appraisal Firm | `company-address` | text | Yes | |
| Appraisal Firm | `appraiser-city` | text | Yes | |
| Appraisal Firm | `company-city-state-zip` | text | Yes | |
| Appraisal Firm | `company-phone` | tel | Yes | |
| Appraisal Firm | `company-email` | email | Yes | |
| Client Information | `client-full-name` | text | Yes | |
| Client Information | `client-organization` | text | Yes | |
| Client Information | `client-first-name` | text | Yes | |
| Client Information | `client-email` | email | Yes | |
| Client Information | `client-phone` | tel | Yes | |
| Client Information | `client-address` | text | Yes | |
| Client Information | `client-city` | text | Yes | |
| Client Information | `client-province` | select | Yes | Dropdown: Provinces |
| Client Information | `client-postal` | text | Yes | |
| Client Information | `client-attention` | text | Yes | |
| Client Information | `client-salutation` | text | Yes | |
| Key Dates | `transmittal-date` | date | Yes | |
| Key Dates | `appraiser1-inspectiondate` | date | Yes | |
| Key Dates | `report-date` | date | Yes | |
| Key Dates | `valuation-date` | date | Yes | |
| Valuation Scenario | `value-scenario` | select | Yes | Dropdown from registry |
| Valuation Scenario | `property-rights` | select | Yes | Dropdown from registry |
| Valuation Scenario | `value-component` | select | Yes | Dropdown: Real Property, Real Property + FF&E, Going Concern |
| Subject Property | `subject-propertyname` | text | Yes | |
| Subject Property | `subject-street` | text | Yes | |
| Subject Property | `city` | text | Yes | |
| Subject Property | `province` | select | Yes | Dropdown: Provinces |
| Subject Property | `postal-code` | text | Yes | |
| Subject Property | `country` | select | Yes | Dropdown: Canada, US |
| Subject Property | `latitude` | text | Yes | |
| Subject Property | `longitude` | text | Yes | |
| Subject Property | `parcel-id` | text | Yes | |
| Subject Property | `legal-description` | textarea | Yes | |
| Subject Property (Adjacent) | `adjacent-north` | select | Yes | Dropdown: Adjacent types |
| Subject Property (Adjacent) | `adjacent-south` | select | Yes | Dropdown: Adjacent types |
| Subject Property (Adjacent) | `adjacent-east` | select | Yes | Dropdown: Adjacent types |
| Subject Property (Adjacent) | `adjacent-west` | select | Yes | Dropdown: Adjacent types |
| Qualitative Ratings | `site-appeal` | select | Yes | Dropdown: Ratings |
| Qualitative Ratings | `exposure-visibility` | select | Yes | Dropdown: Ratings |
| Qualitative Ratings | `site-utility` | select | Yes | Dropdown: Ratings |
| Qualitative Ratings | `building-quality` | select | Yes | Dropdown: Ratings |
| Qualitative Ratings | `building-appeal` | select | Yes | Dropdown: Ratings |
| Qualitative Ratings | `condition` | select | Yes | Dropdown: Ratings |
| Qualitative Ratings | `building-function` | select | Yes | Dropdown: Ratings |
| Transaction History | `current-owner` | text | Yes | |
| Transaction History | `owner-address` | text | Yes | |
| Transaction History | `prior-owner` | text | Yes | |
| Transaction History | `last-purchase-price` | text | Yes | |
| Transaction History | `purchase-date` | date | Yes | |
| Transaction History | `deed-type` | select | Yes | Dropdown: Deed types |
| Transaction History | `ownership-history` | textarea | Yes | |
| Transaction History | `sales-history` | textarea | Yes | |
| Conditions | `extraordinary-assumption-1` | textarea | Yes | |
| Conditions | `extraordinary-assumption-2` | textarea | Yes | |
| Conditions | `extraordinary-assumption-3` | textarea | Yes | |
| Conditions | `hypothetical-condition-1` | textarea | Yes | |
| Conditions | `hypothetical-condition-2` | textarea | Yes | |
| Conditions | `hypothetical-condition-3` | textarea | Yes | |
| Conditions | `limiting-condition-1` | textarea | Yes | |
| Conditions | `limiting-condition-2` | textarea | Yes | |
| Conditions | `limiting-condition-3` | textarea | Yes | |
| Letter of Transmittal | `transmittal-date` | date | Yes | |
| Letter of Transmittal | `transmittal-body` | textarea | Yes | |
| Appraisers (Primary) | `appraiser-name` | text | Yes | |
| Appraisers (Primary) | `appraiser-credentials` | text | Yes | |
| Appraisers (Primary) | `appraiser-title` | text | Yes | |
| Appraisers (Primary) | `appraiser-role` | select | Yes | Dropdown: Primary Appraiser, Co-Appraiser, Review Appraiser |
| Appraisers (Primary) | `appraiser-phone` | tel | Yes | |
| Appraisers (Primary) | `appraiser-email` | email | Yes | |
| Appraisers (Primary) | `appraiser-aic` | text | Yes | |
| Appraisers (Primary) | `appraiser-license-expiry` | date | Yes | |
| Appraisers (Primary) | `appraiser1-inspected` | boolean | Yes | Toggle |
| Appraisers (Primary) | `appraiser1-allunits` | boolean | Yes | Toggle |
| Appraisers (Primary) | `appraiser1-ce` | boolean | Yes | Toggle |
| Appraisers (Primary) | `appraiser1-ethics` | boolean | Yes | Toggle |
| Appraisers (Primary) | `appraiser1-inspectiondate` | date | Yes | |
| Appraisers (Primary) | `appraiser1-extent` | text | Yes | |
| Appraisers (Secondary) | `appraiser2-name` | text | Yes | |
| Appraisers (Secondary) | `appraiser2-credentials` | text | Yes | |
| Appraisers (Secondary) | `appraiser2-title` | text | Yes | |
| Appraisers (Secondary) | `appraiser2-role` | select | Yes | Dropdown: Co-Appraiser, Primary Appraiser, Review Appraiser |
| Appraisers (Secondary) | `appraiser2-phone` | tel | Yes | |
| Appraisers (Secondary) | `appraiser2-email` | email | Yes | |
| Appraisers (Secondary) | `appraiser2-aic` | text | Yes | |
| Appraisers (Secondary) | `appraiser2-license-expiry` | date | Yes | |
| Appraisers (Secondary) | `appraiser2-inspected` | boolean | Yes | Toggle |
| Appraisers (Secondary) | `appraiser2-allunits` | boolean | Yes | Toggle |
| Appraisers (Secondary) | `appraiser2-ce` | boolean | Yes | Toggle |
| Appraisers (Secondary) | `appraiser2-ethics` | boolean | Yes | Toggle |
| Appraisers (Secondary) | `appraiser2-inspectiondate` | date | Yes | |
| Appraisers (Secondary) | `appraiser2-extent` | text | Yes | |

### Output Displays:
- None (all inputs)

### Narratives:
- `property-description-prefix`: Property description prefix text
- `legal-description`: Legal description of property
- `ownership-history`: Ownership history narrative
- `sales-history`: Sales history narrative
- `extraordinary-assumption-1/2/3`: Extraordinary assumptions text
- `hypothetical-condition-1/2/3`: Hypothetical conditions text
- `limiting-condition-1/2/3`: Limiting conditions text
- `transmittal-body`: Letter of transmittal body text

---

## IMAGE MGT

### Sub-tabs:
none

### Input Sections:

| Section | Field ID | Type | Wired? | Notes |
|---------|----------|------|--------|-------|
| Image Configurator | N/A | component | N/A | Wraps `ImageConfiguratorDemo` component - no direct field inputs in this tab |

### Output Displays:
- Image Configurator: Full image management interface (separate component)

### Narratives:
- None

---

## SITE

### Sub-tabs:
none

### Input Sections:

| Section | Field ID | Type | Wired? | Notes |
|---------|----------|------|--------|-------|
| Site Area | `site-total-area` | number | Yes | Total Site Area (SF) |
| Site Area | `site-acreage` | number | Yes | Site Acreage |
| Site Area | `site-address` | text | Yes | Site Address |
| Site Area | `site-shape` | select | Yes | Dropdown: Regular, Rectangular, Square, Irregular, Triangular, L-Shaped |
| Site Area | `topography` | select | Yes | Dropdown: Level, Gently Sloping, Sloping, Steep, Rolling, Varied |
| Site Area | `accessibility` | select | Yes | Dropdown: Excellent, Good, Average, Fair, Poor, Limited |
| Site Area | `exposure-visibility` | select | Yes | Dropdown: Ratings |
| Site Frontage | `frontage1-street` | text | Yes | Frontage 1 - Street |
| Site Frontage | `frontage1-distance` | text | Yes | Frontage 1 - Distance |
| Site Frontage | `frontage2-street` | text | Yes | Frontage 2 - Street |
| Site Frontage | `frontage2-distance` | text | Yes | Frontage 2 - Distance |
| Adjacent Uses | `adjacent-north` | select | Yes | Dropdown: Adjacent types |
| Adjacent Uses | `adjacent-south` | select | Yes | Dropdown: Adjacent types |
| Adjacent Uses | `adjacent-east` | select | Yes | Dropdown: Adjacent types |
| Adjacent Uses | `adjacent-west` | select | Yes | Dropdown: Adjacent types |
| Site Conditions | `easements` | textarea | Yes | Easements & Encroachments |
| Site Conditions | `soils` | textarea | Yes | Soils |
| Site Conditions | `hazardous-waste` | textarea | Yes | Environmental Concerns |
| Site Conditions | `site-rating` | select | Yes | Dropdown: Ratings |
| Site Conditions | `site-conclusion` | textarea | Yes | Site Conclusion narrative |
| Site Plan Images | N/A | file | No | File upload (not wired to store) |

### Output Displays:
- None (all inputs)

### Narratives:
- `easements`: Easements & Encroachments description
- `soils`: Soils description
- `hazardous-waste`: Environmental concerns description
- `site-conclusion`: Site conclusion narrative

---

## IMPV (Improvements)

### Sub-tabs:
none

### Input Sections:

| Section | Field ID | Type | Wired? | Notes |
|---------|----------|------|--------|-------|
| Building Overview | `impv-overview` | textarea | Yes | Overview narrative |
| Building Overview | `impv-num-buildings` | number | Yes | Number of Buildings |
| Building Overview | `impv-nra` | number | Yes | Net Rentable Area (SF) |
| Building Overview | `impv-year-built` | number | Yes | Year Built |
| Building Overview | `impv-num-units` | number | Yes | Number of Units |
| Building Overview | `impv-stories` | number | Yes | Number of Stories |
| Building Overview | `impv-building-format` | select | Yes | Dropdown: Garden Style, Walk-Up, Mid-Rise, High-Rise, Mixed |
| Amenities | `project-amenities` | textarea | Yes | Project Amenities |
| Amenities | `unit-amenities` | textarea | Yes | Unit Amenities |
| Amenities | `laundry` | text | Yes | Laundry description |
| Amenities | `security` | textarea | Yes | Security Features |
| Construction | `foundation` | text | Yes | Foundation description |
| Construction | `exterior-walls` | text | Yes | Exterior Walls/Framing |
| Construction | `roof` | text | Yes | Roof description |
| Construction | `impv-roof-condition` | select | Yes | Dropdown: Condition ratings |
| Construction | `impv-insulation` | text | Yes | Insulation description |
| Construction | `elevator` | text | Yes | Elevator description |
| Building Systems | `hvac` | text | Yes | HVAC description |
| Building Systems | `electrical` | text | Yes | Electrical description |
| Building Systems | `plumbing` | text | Yes | Plumbing description |
| Building Systems | `fire-protection` | text | Yes | Fire Protection description |
| Interior Finishes | `interior-walls` | text | Yes | Interior Walls |
| Interior Finishes | `ceilings` | text | Yes | Ceilings |
| Interior Finishes | `flooring` | text | Yes | Flooring |
| Interior Finishes | `doors-windows` | text | Yes | Doors & Windows |
| Interior Finishes | `impv-interior-finish` | select | Yes | Dropdown: Condition ratings |
| Site Improvements | `site-impv` | textarea | Yes | Site Improvements description |
| Site Improvements | `landscaping` | text | Yes | Landscaping description |
| Site Improvements | `parking-spaces` | number | Yes | Parking Spaces |
| Site Improvements | `parking-ratio` | number | Yes | Parking Ratio |
| Site Improvements | `impv-building-footprint` | number | Yes | Building Footprint (SF) |
| Site Improvements | `impv-site-coverage` | number | Yes | Site Coverage (%) |
| Condition | `overall-condition` | select | Yes | Dropdown: Condition ratings |
| Condition | `functional-design` | textarea | Yes | Functional Design description |
| Condition | `hazardous-materials` | textarea | Yes | Hazardous Materials description |
| Highest & Best Use | `hbu-asimproved-1` | textarea | Yes | HBU As Improved - Paragraph 1 |
| Highest & Best Use | `hbu-asimproved-2` | textarea | Yes | HBU As Improved - Paragraph 2 |
| Highest & Best Use | `hbu-asimproved-3` | textarea | Yes | HBU As Improved - Paragraph 3 |
| Highest & Best Use | `hbu-conclusion-vacant` | textarea | Yes | HBU Conclusion (As Vacant) |

### Output Displays:
- None (all inputs)

### Narratives:
- `impv-overview`: Building overview narrative
- `project-amenities`: Project amenities description
- `unit-amenities`: Unit amenities description
- `security`: Security features description
- `functional-design`: Functional design description
- `hazardous-materials`: Hazardous materials description
- `hbu-asimproved-1/2/3`: HBU As Improved paragraphs
- `hbu-conclusion-vacant`: HBU Conclusion (As Vacant)

---

## INCOME

### Sub-tabs:
- `revenue` - Revenue inputs and PGI analysis
- `vacancy` - Vacancy & loss rates and PGR→EGR calculation
- `expenses` - Operating expenses and expense analysis
- `value` - Capitalization, adjustments, NOI analysis, and value indication

### Input Sections:

| Section | Field ID | Type | Wired? | Notes |
|---------|----------|------|--------|-------|
| Revenue - Unit Mix | `calc-type1-name` | text | Yes | Unit Type 1 Name |
| Revenue - Unit Mix | `calc-type1-count` | number | Yes | Unit Type 1 Count |
| Revenue - Unit Mix | `calc-type1-sf` | number | Yes | Unit Type 1 Avg SF |
| Revenue - Unit Mix | `calc-type1-contract-rent` | number | Yes | Unit Type 1 Contract Rent |
| Revenue - Unit Mix | `calc-type1-rent` | number | Yes | Unit Type 1 Market Rent |
| Revenue - Unit Mix | `calc-type2-name` | text | Yes | Unit Type 2 Name |
| Revenue - Unit Mix | `calc-type2-count` | number | Yes | Unit Type 2 Count |
| Revenue - Unit Mix | `calc-type2-sf` | number | Yes | Unit Type 2 Avg SF |
| Revenue - Unit Mix | `calc-type2-contract-rent` | number | Yes | Unit Type 2 Contract Rent |
| Revenue - Unit Mix | `calc-type2-rent` | number | Yes | Unit Type 2 Market Rent |
| Revenue - Unit Mix | `calc-type3-name` | text | Yes | Unit Type 3 Name |
| Revenue - Unit Mix | `calc-type3-count` | number | Yes | Unit Type 3 Count |
| Revenue - Unit Mix | `calc-type3-sf` | number | Yes | Unit Type 3 Avg SF |
| Revenue - Unit Mix | `calc-type3-contract-rent` | number | Yes | Unit Type 3 Contract Rent |
| Revenue - Unit Mix | `calc-type3-rent` | number | Yes | Unit Type 3 Market Rent |
| Revenue - Unit Mix | `calc-type4-name` | text | Yes | Unit Type 4 Name |
| Revenue - Unit Mix | `calc-type4-count` | number | Yes | Unit Type 4 Count |
| Revenue - Unit Mix | `calc-type4-sf` | number | Yes | Unit Type 4 Avg SF |
| Revenue - Unit Mix | `calc-type4-contract-rent` | number | Yes | Unit Type 4 Contract Rent |
| Revenue - Unit Mix | `calc-type4-rent` | number | Yes | Unit Type 4 Market Rent |
| Revenue - Unit Mix | `calc-type5-name` | text | Yes | Unit Type 5 Name |
| Revenue - Unit Mix | `calc-type5-count` | number | Yes | Unit Type 5 Count |
| Revenue - Unit Mix | `calc-type5-sf` | number | Yes | Unit Type 5 Avg SF |
| Revenue - Unit Mix | `calc-type5-contract-rent` | number | Yes | Unit Type 5 Contract Rent |
| Revenue - Unit Mix | `calc-type5-rent` | number | Yes | Unit Type 5 Market Rent |
| Revenue - Unit Mix | `calc-type6-name` | text | Yes | Unit Type 6 Name |
| Revenue - Unit Mix | `calc-type6-count` | number | Yes | Unit Type 6 Count |
| Revenue - Unit Mix | `calc-type6-sf` | number | Yes | Unit Type 6 Avg SF |
| Revenue - Unit Mix | `calc-type6-contract-rent` | number | Yes | Unit Type 6 Contract Rent |
| Revenue - Unit Mix | `calc-type6-rent` | number | Yes | Unit Type 6 Market Rent |
| Revenue - Other Income | `calc-parking-per-unit` | number | Yes | Parking $/unit/mo |
| Revenue - Other Income | `calc-laundry-per-unit` | number | Yes | Laundry $/unit/mo |
| Revenue - Other Income | `calc-other-income-annual` | number | Yes | Other Income ($/year) |
| Vacancy - Rates | `calc-vacancy-rate` | number | Yes | Vacancy Rate (%) |
| Vacancy - Rates | `calc-concessions-rate` | number | Yes | Concessions (%) |
| Vacancy - Rates | `calc-credit-loss-rate` | number | Yes | Credit Loss (%) |
| Vacancy - Rates | `calc-other-loss-rate` | number | Yes | Other Loss (%) |
| Expenses - Operating | `calc-exp-taxes-annual` | number | Yes | Property Taxes (Annual) |
| Expenses - Operating | `calc-exp-insurance-annual` | number | Yes | Insurance (Annual) |
| Expenses - Operating | `calc-exp-repairs-annual` | number | Yes | Repairs & Maintenance (Annual) |
| Expenses - Operating | `calc-exp-utilities-annual` | number | Yes | Utilities (Annual) |
| Expenses - Operating | `calc-exp-management-annual` | number | Yes | Management (Annual) |
| Expenses - Operating | `calc-exp-reserves-annual` | number | Yes | Reserves (Annual) |
| Expenses - Operating | `calc-exp-other-annual` | number | Yes | Other (Annual) |
| Value - Capitalization | `calc-cap-rate` | number | Yes | Cap Rate (%) |
| Value - Capitalization | `calc-cap-rate-2` | number | Yes | Cap Rate 2 (%) - Optional |
| Value - Adjustments | `calc-adj-capex` | number | Yes | CapEx Adjustment |
| Value - Adjustments | `calc-adj-leasing` | number | Yes | Leasing Costs |
| Value - Adjustments | `calc-adj-other` | number | Yes | Other Adjustment |
| Value - Value Indication | `income-value-indication` | number | Yes | Income Approach Value |

### Output Displays:
- **IncomeApproachPanel** (Vacancy & Value tabs): Shows PGR→EGR calculation table with calculated fields
- **OperatingHistoryPanel** (Expenses tab): Shows operating history table with calculated fields
- **Formatted Value Display** (Value tab): Shows formatted currency value from `income-value-indication`

### Narratives:
- `income-pgi-narrative`: PGI Analysis narrative (Revenue tab)
- `income-expense-narrative`: Expense Analysis narrative (Expenses tab)
- `income-noi-narrative`: NOI Analysis narrative (Value tab)
- `income-cap-rate-analysis`: Cap Rate Analysis narrative (Value tab)

---

## SALES

### Sub-tabs:
none

### Input Sections:

| Section | Field ID | Type | Wired? | Notes |
|---------|----------|------|--------|-------|
| Subject Property Summary | `subject-units` | number | Yes | Number of Units |
| Subject Property Summary | `subject-gba` | number | Yes | Gross Building Area (SF) |
| Subject Property Summary | `subject-year` | number | Yes | Year Built |
| Subject Property Summary | `subject-site-area` | number | Yes | Site Area (SF) |
| Subject Property Summary | `subject-parking` | number | Yes | Parking Ratio |
| Subject Property Summary | `subject-condition` | select | Yes | Dropdown: Condition options |
| Comparable Sale 1 - Property ID | `comp1-name` | text | Yes | Property Name |
| Comparable Sale 1 - Property ID | `comp1-address` | text | Yes | Address |
| Comparable Sale 1 - Sale Info | `comp1-sale-date` | date | Yes | Sale Date |
| Comparable Sale 1 - Sale Info | `comp1-sale-price` | number | Yes | Sale Price |
| Comparable Sale 1 - Property Details | `comp1-units` | number | Yes | Units |
| Comparable Sale 1 - Property Details | `comp1-gba` | number | Yes | GBA (SF) |
| Comparable Sale 1 - Property Details | `comp1-year` | number | Yes | Year Built |
| Comparable Sale 1 - Property Details | `comp1-cap-rate` | number | Yes | Cap Rate (%) |
| Comparable Sale 1 - Adjustments | `comp1-adj-property-rights` | number | Yes | Property Rights (%) |
| Comparable Sale 1 - Adjustments | `comp1-adj-financing` | number | Yes | Financing Terms (%) |
| Comparable Sale 1 - Adjustments | `comp1-adj-conditions-sale` | number | Yes | Conditions of Sale (%) |
| Comparable Sale 1 - Adjustments | `comp1-adj-market-time` | number | Yes | Market/Time (%) |
| Comparable Sale 1 - Adjustments | `comp1-adj-location` | number | Yes | Location (%) |
| Comparable Sale 1 - Adjustments | `comp1-adj-size` | number | Yes | Size (%) |
| Comparable Sale 1 - Adjustments | `comp1-adj-age-condition` | number | Yes | Age/Condition (%) |
| Comparable Sale 1 - Adjustments | `comp1-adj-other` | number | Yes | Other (%) |
| Comparable Sale 2 - Property ID | `comp2-name` | text | Yes | Property Name |
| Comparable Sale 2 - Property ID | `comp2-address` | text | Yes | Address |
| Comparable Sale 2 - Sale Info | `comp2-sale-date` | date | Yes | Sale Date |
| Comparable Sale 2 - Sale Info | `comp2-sale-price` | number | Yes | Sale Price |
| Comparable Sale 2 - Property Details | `comp2-units` | number | Yes | Units |
| Comparable Sale 2 - Property Details | `comp2-gba` | number | Yes | GBA (SF) |
| Comparable Sale 2 - Property Details | `comp2-year` | number | Yes | Year Built |
| Comparable Sale 2 - Property Details | `comp2-cap-rate` | number | Yes | Cap Rate (%) |
| Comparable Sale 2 - Adjustments | `comp2-adj-property-rights` | number | Yes | Property Rights (%) |
| Comparable Sale 2 - Adjustments | `comp2-adj-financing` | number | Yes | Financing Terms (%) |
| Comparable Sale 2 - Adjustments | `comp2-adj-conditions-sale` | number | Yes | Conditions of Sale (%) |
| Comparable Sale 2 - Adjustments | `comp2-adj-market-time` | number | Yes | Market/Time (%) |
| Comparable Sale 2 - Adjustments | `comp2-adj-location` | number | Yes | Location (%) |
| Comparable Sale 2 - Adjustments | `comp2-adj-size` | number | Yes | Size (%) |
| Comparable Sale 2 - Adjustments | `comp2-adj-age-condition` | number | Yes | Age/Condition (%) |
| Comparable Sale 2 - Adjustments | `comp2-adj-other` | number | Yes | Other (%) |
| Comparable Sale 3 - Property ID | `comp3-name` | text | Yes | Property Name |
| Comparable Sale 3 - Property ID | `comp3-address` | text | Yes | Address |
| Comparable Sale 3 - Sale Info | `comp3-sale-date` | date | Yes | Sale Date |
| Comparable Sale 3 - Sale Info | `comp3-sale-price` | number | Yes | Sale Price |
| Comparable Sale 3 - Property Details | `comp3-units` | number | Yes | Units |
| Comparable Sale 3 - Property Details | `comp3-gba` | number | Yes | GBA (SF) |
| Comparable Sale 3 - Property Details | `comp3-year` | number | Yes | Year Built |
| Comparable Sale 3 - Property Details | `comp3-cap-rate` | number | Yes | Cap Rate (%) |
| Comparable Sale 3 - Adjustments | `comp3-adj-property-rights` | number | Yes | Property Rights (%) |
| Comparable Sale 3 - Adjustments | `comp3-adj-financing` | number | Yes | Financing Terms (%) |
| Comparable Sale 3 - Adjustments | `comp3-adj-conditions-sale` | number | Yes | Conditions of Sale (%) |
| Comparable Sale 3 - Adjustments | `comp3-adj-market-time` | number | Yes | Market/Time (%) |
| Comparable Sale 3 - Adjustments | `comp3-adj-location` | number | Yes | Location (%) |
| Comparable Sale 3 - Adjustments | `comp3-adj-size` | number | Yes | Size (%) |
| Comparable Sale 3 - Adjustments | `comp3-adj-age-condition` | number | Yes | Age/Condition (%) |
| Comparable Sale 3 - Adjustments | `comp3-adj-other` | number | Yes | Other (%) |
| Comparable Sale 4 - Property ID | `comp4-name` | text | Yes | Property Name |
| Comparable Sale 4 - Property ID | `comp4-address` | text | Yes | Address |
| Comparable Sale 4 - Sale Info | `comp4-sale-date` | date | Yes | Sale Date |
| Comparable Sale 4 - Sale Info | `comp4-sale-price` | number | Yes | Sale Price |
| Comparable Sale 4 - Property Details | `comp4-units` | number | Yes | Units |
| Comparable Sale 4 - Property Details | `comp4-gba` | number | Yes | GBA (SF) |
| Comparable Sale 4 - Property Details | `comp4-year` | number | Yes | Year Built |
| Comparable Sale 4 - Property Details | `comp4-cap-rate` | number | Yes | Cap Rate (%) |
| Comparable Sale 4 - Adjustments | `comp4-adj-property-rights` | number | Yes | Property Rights (%) |
| Comparable Sale 4 - Adjustments | `comp4-adj-financing` | number | Yes | Financing Terms (%) |
| Comparable Sale 4 - Adjustments | `comp4-adj-conditions-sale` | number | Yes | Conditions of Sale (%) |
| Comparable Sale 4 - Adjustments | `comp4-adj-market-time` | number | Yes | Market/Time (%) |
| Comparable Sale 4 - Adjustments | `comp4-adj-location` | number | Yes | Location (%) |
| Comparable Sale 4 - Adjustments | `comp4-adj-size` | number | Yes | Size (%) |
| Comparable Sale 4 - Adjustments | `comp4-adj-age-condition` | number | Yes | Age/Condition (%) |
| Comparable Sale 4 - Adjustments | `comp4-adj-other` | number | Yes | Other (%) |
| Comparable Sale 5 - Property ID | `comp5-name` | text | Yes | Property Name |
| Comparable Sale 5 - Property ID | `comp5-address` | text | Yes | Address |
| Comparable Sale 5 - Sale Info | `comp5-sale-date` | date | Yes | Sale Date |
| Comparable Sale 5 - Sale Info | `comp5-sale-price` | number | Yes | Sale Price |
| Comparable Sale 5 - Property Details | `comp5-units` | number | Yes | Units |
| Comparable Sale 5 - Property Details | `comp5-gba` | number | Yes | GBA (SF) |
| Comparable Sale 5 - Property Details | `comp5-year` | number | Yes | Year Built |
| Comparable Sale 5 - Property Details | `comp5-cap-rate` | number | Yes | Cap Rate (%) |
| Comparable Sale 5 - Adjustments | `comp5-adj-property-rights` | number | Yes | Property Rights (%) |
| Comparable Sale 5 - Adjustments | `comp5-adj-financing` | number | Yes | Financing Terms (%) |
| Comparable Sale 5 - Adjustments | `comp5-adj-conditions-sale` | number | Yes | Conditions of Sale (%) |
| Comparable Sale 5 - Adjustments | `comp5-adj-market-time` | number | Yes | Market/Time (%) |
| Comparable Sale 5 - Adjustments | `comp5-adj-location` | number | Yes | Location (%) |
| Comparable Sale 5 - Adjustments | `comp5-adj-size` | number | Yes | Size (%) |
| Comparable Sale 5 - Adjustments | `comp5-adj-age-condition` | number | Yes | Age/Condition (%) |
| Comparable Sale 5 - Adjustments | `comp5-adj-other` | number | Yes | Other (%) |
| Value Conclusion | `sales-value-indication` | number | Yes | Sales Comparison Value |

### Output Displays:
- **Calculated Fields** (read-only): `comp1-price-per-unit`, `comp1-price-per-sf`, `comp2-price-per-unit`, `comp2-price-per-sf`, etc. (for all 5 comparables)
- **SalesComparisonPanel**: Live updating sales comparison table showing all comparables with adjustments and final adjusted values

### Narratives:
- `sales-adjustment-summary`: Adjustment Summary narrative (Value Conclusion section)

---

## COST S

### Sub-tabs:
none

### Input Sections:

| Section | Field ID | Type | Wired? | Notes |
|---------|----------|------|--------|-------|
| Land Value | `cost-land-sf` | number | Yes | Land Area (SF) |
| Land Value | `cost-land-rate-per-sf` | number | Yes | Rate per SF ($) |
| Replacement Cost New - Building Costs | `cost-rcn-gba` | number | Yes | Gross Building Area (SF) |
| Replacement Cost New - Building Costs | `cost-rcn-rate-per-sf` | number | Yes | Rate per SF ($) |
| Replacement Cost New - Indirect & Entrepreneur | `cost-rcn-indirect-pct` | number | Yes | Indirect Costs (%) |
| Replacement Cost New - Indirect & Entrepreneur | `cost-rcn-entrepreneur-pct` | number | Yes | Entrepreneur Incentive (%) |
| Depreciation - Physical | `cost-depr-physical-age` | number | Yes | Actual Age (years) |
| Depreciation - Physical | `cost-depr-physical-life` | number | Yes | Economic Life (years) |
| Depreciation - Physical | `cost-depr-physical-effective-age` | number | Yes | Effective Age (years) |
| Depreciation - Functional & External | `cost-depr-functional-total` | number | Yes | Functional Obsolescence ($) |
| Depreciation - Functional & External | `cost-depr-external-total` | number | Yes | External Obsolescence ($) |
| Site Improvements - Parking | `cost-site-parking-spaces` | number | Yes | Parking Spaces |
| Site Improvements - Parking | `cost-site-parking-cost` | number | Yes | Cost per Space ($) |
| Site Improvements - Other | `cost-site-landscaping` | number | Yes | Landscaping ($) |
| Site Improvements - Other | `cost-site-paving` | number | Yes | Paving ($) |
| Site Improvements - Other | `cost-site-utilities` | number | Yes | Utilities ($) |
| Site Improvements - Other | `cost-site-other` | number | Yes | Other ($) |
| Cost Conclusion | `cost-approach-conclusion` | textarea | Yes | Cost Approach Narrative |

### Output Displays:
- **Calculated Fields** (read-only):
  - `cost-land-value`: Land Value (calculated from land-sf × rate-per-sf)
  - `cost-rcn-direct-costs`: Direct Costs (calculated)
  - `cost-rcn-indirect-costs`: Indirect Costs (calculated)
  - `cost-rcn-entrepreneur-amt`: Entrepreneur Amount (calculated)
  - `cost-rcn-total`: Total RCN (calculated)
  - `cost-depr-physical-remaining-life`: Remaining Life (calculated)
  - `cost-depr-physical-pct`: Physical Depreciation (%) (calculated)
  - `cost-depr-physical-amt`: Physical Depreciation ($) (calculated)
  - `cost-depr-total-pct`: Total Depreciation (%) (calculated)
  - `cost-depr-total-amt`: Total Depreciation ($) (calculated)
  - `cost-site-parking-total`: Parking Total (calculated)
  - `cost-site-total`: Total Site Improvements (calculated)
  - `cost-depreciated-value`: Depreciated Value (calculated)
  - `cost-indicated-value`: Indicated Value (Cost Approach) (calculated)
- **CostApproachPanel**: Live updating cost approach table showing all cost components and calculations

### Narratives:
- `cost-approach-conclusion`: Cost Approach Narrative (Cost Conclusion section)

---

## RECON

### Sub-tabs:
none

### Input Sections:

| Section | Field ID | Type | Wired? | Notes |
|---------|----------|------|--------|-------|
| Reconciliation Panel | N/A | component | N/A | Embedded `ReconciliationPanel` component - handles weights internally |
| Reconciliation Narratives | `final-value-conclusion` | textarea | Yes | Final Value Conclusion narrative |
| Reconciliation Narratives | `value-scenario1-text` | textarea | Yes | Value Scenario 1 (Text) |
| Reconciliation Narratives | `value-scenario2-text` | textarea | Yes | Value Scenario 2 (Text) |

### Output Displays:
- **ReconciliationPanel**: Shows reconciliation table with:
  - Income Approach value (reads `income-value-indication`)
  - Sales Comparison value (reads `sales-value-indication`)
  - Cost Approach value (reads `cost-value-indication`)
  - Weights for each approach (input sliders in panel)
  - Final reconciled value (calculated)

### Narratives:
- `final-value-conclusion`: Final Value Conclusion narrative
- `value-scenario1-text`: Value Scenario 1 expressed in words
- `value-scenario2-text`: Value Scenario 2 expressed in words

---

## Summary Statistics

### Total Input Fields by Tab:
- **HOME**: 88 input fields
- **IMAGE MGT**: 0 input fields (component wrapper)
- **SITE**: 18 input fields
- **IMPV**: 35 input fields
- **INCOME**: 48 input fields (across 4 sub-tabs)
- **SALES**: 66 input fields (5 comparables × 13 fields each + 6 subject fields)
- **COST S**: 15 input fields
- **RECON**: 3 input fields (narratives only, weights handled by component)

### Wiring Status:
- **All input fields are wired** to `updateFieldValue()` via `onInputChange()` handlers
- **All calculated/read-only fields** display values from store but are not directly editable
- **File uploads** (Image MGT, Site Plan Images) are not wired to store

### Missing Fields Analysis:

#### SALES Tab:
- ✅ All 5 comparables have complete field sets (13 fields each: 2 property ID, 2 sale info, 4 property details, 8 adjustments)
- ✅ Subject summary has all 6 fields
- ✅ Value conclusion has value indication and narrative
- **Status**: Complete

#### COST S Tab:
- ✅ Land value inputs complete (2 fields)
- ✅ Replacement cost new inputs complete (4 fields)
- ✅ Depreciation inputs complete (5 fields: 3 physical, 2 functional/external)
- ✅ Site improvements inputs complete (6 fields)
- ✅ Cost conclusion narrative present
- **Status**: Complete

#### RECON Tab:
- ✅ Reconciliation panel reads values from other tabs correctly
- ✅ All narrative fields present (3 fields)
- ✅ Weights handled by ReconciliationPanel component
- **Status**: Complete

---

## Notes

1. **Field Naming Convention**: Field IDs follow kebab-case naming (e.g., `calc-type1-name`, `comp1-adj-property-rights`)

2. **Wiring Pattern**: All input fields use the pattern:
   ```typescript
   onChange={onInputChange('field-id')}
   ```
   Which calls `updateFieldValue(fieldId, value)` internally.

3. **Calculated Fields**: Read-only calculated fields are displayed but not editable. They are computed by `runCalculations()` in the store.

4. **Component Integration**: Several tabs embed specialized calculator panels:
   - INCOME: `IncomeApproachPanel`, `OperatingHistoryPanel`
   - SALES: `SalesComparisonPanel`
   - COST S: `CostApproachPanel`
   - RECON: `ReconciliationPanel`

5. **Sub-tab Navigation**: Only INCOME tab has sub-tabs (revenue, vacancy, expenses, value). All other tabs are single-panel.

6. **Narrative Fields**: All narrative fields use `<textarea>` elements and are wired to store.

7. **File Uploads**: Image upload fields (Site Plan Images, Image MGT) are not currently wired to store - they use separate file handling logic.
