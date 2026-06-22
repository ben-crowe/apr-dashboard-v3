---
content_type: reference
title: V4-Only Fields — not yet in the unified registry
generated: 2026-06-22
source: src/features/report-builder/schema/fieldRegistry.ts (V4 builder) diffed against GENERATED-v4-form-config.json (registry v4ids)
regenerate: node scripts/generate-registry-derivatives.mjs && node /tmp/v4-only-diff.mjs
tags: [apr-dashboard, field-registry, v4, registry-candidates]
---

# V4-Only Fields — not yet in the unified registry

> **What this is.** Every V4 report-builder field (`fieldRegistry.ts`) that has **no `v4id` entry** in the canonical HTML registry (`field-registry-v6.html`). The registry today maps the S1/S2 intake+LOE set (27 v4ids of 55 fields); this is everything the V4 builder adds beyond that. Use it to decide what graduates into the unified registry.
>
> **Two parts:** Part A = **registry candidates** (real input fields a user fills — the ones worth adding). Part B = **computed / derived** (calc-engine outputs + `calculated` type — generally NOT registry entries, they're products of inputs). Review Part A; Part B is here for completeness.

## Totals

| | Count |
|---|---|
| V4 builder fields (total) | 2097 |
| Already in registry (v4id) | 27 |
| **V4-only (no registry entry)** | **2063** |
| → Part A · registry candidates (inputs) | 1466 |
| → Part B · computed / derived | 597 |

## By section

| Section | Candidates (A) | Computed (B) | Total |
|---|---|---|---|
| `client-intake` | 22 | 0 | 22 |
| `loe-prep` | 55 | 0 | 55 |
| `home` | 30 | 0 | 30 |
| `cover` | 34 | 0 | 34 |
| `report` | 24 | 0 | 24 |
| `exec` | 78 | 1 | 79 |
| `site` | 88 | 0 | 88 |
| `zone` | 17 | 0 | 17 |
| `location` | 18 | 0 | 18 |
| `tax` | 16 | 0 | 16 |
| `hbu` | 14 | 0 | 14 |
| `impv` | 91 | 0 | 91 |
| `image-mgt` | 134 | 0 | 134 |
| `photos` | 5 | 0 | 5 |
| `income` | 38 | 0 | 38 |
| `rentroll` | 37 | 0 | 37 |
| `rent-analysis` | 170 | 0 | 170 |
| `market` | 50 | 0 | 50 |
| `sales` | 273 | 10 | 283 |
| `sales-comparison` | 187 | 0 | 187 |
| `cost` | 32 | 0 | 32 |
| `cost-s` | 1 | 0 | 1 |
| `land1` | 1 | 0 | 1 |
| `recon` | 15 | 0 | 15 |
| `cert` | 36 | 0 | 36 |
| `calc` | 0 | 245 | 245 |
| `calc-output` | 0 | 341 | 341 |

---

# PART A — Registry candidates (input fields) — 1466

Real user-entered fields. These are the ones to review for the unified registry.

## `client-intake` — 22 candidate fields

| Field ID | Label | Type |
|---|---|---|
| `client-city` | Client City | text |
| `client-province` | Client Province | text |
| `client-full-name` | Client Full Name | text |
| `client-name` | Client Name | text |
| `client-company` | Client Company | text |
| `client-attention` | Client Attention Line | text |
| `client-salutation` | Client Salutation | text |
| `client-postal` | Postal Code | text |
| `company-name` | Company Name | text |
| `company-address` | Company Address | text |
| `company-city-state-zip` | Company City/State/Zip | text |
| `company-phone` | Company Phone | text |
| `company-email` | Company Email | text |
| `company-website` | Company Website | text |
| `company-jobnumber` | Client Job Number | text |
| `intake-notes` | Additional Information | textarea |
| `contact-full-name` | Contact Full Name | text |
| `valuation-premises` | Valuation Premises | dropdown |
| `asset-condition` | Asset Condition | dropdown |
| `property-city` | Property City | text |
| `property-province` | Property Province | text |
| `property-postal` | Property Postal Code | text |

## `loe-prep` — 55 candidate fields

| Field ID | Label | Type |
|---|---|---|
| `appraiser-name` | Appraiser Name | text |
| `appraiser-credentials` | Appraiser Credentials | text |
| `appraiser-title` | Appraiser Title | text |
| `appraiser-email` | Appraiser Email | text |
| `appraiser-aic` | AIC Number | text |
| `appraiser-designation` | Appraiser Designation | text |
| `appraiser-license` | Appraiser License | text |
| `appraiser-aic-number` | AIC Member Number | text |
| `appraiser1-name` | Appraiser 1 Name | text |
| `appraiser1-title` | Appraiser 1 Title | text |
| `appraiser1-email` | Appraiser 1 Email | text |
| `appraiser-license-expiry` | Appraiser License Expiry | date |
| `appraiser-role` | Appraiser Role | dropdown |
| `appraiser1-allunits` | Appraiser 1 All Units Inspected | boolean |
| `appraiser1-inspectiondate` | Appraiser 1 Inspection Date | date |
| `appraiser1-extent` | Appraiser 1 Inspection Extent | text |
| `appraiser2-aic` | Appraiser 2 AIC Number | text |
| `appraiser2-credentials` | Appraiser 2 Credentials | text |
| `appraiser2-email` | Appraiser 2 Email | text |
| `appraiser2-phone` | Appraiser 2 Phone | text |
| `appraiser2-title` | Appraiser 2 Title | text |
| `appraiser2-license-expiry` | Appraiser 2 License Expiry | date |
| `appraiser2-allunits` | Appraiser 2 All Units Inspected | boolean |
| `appraiser2-inspectiondate` | Appraiser 2 Inspection Date | date |
| `appraiser2-extent` | Appraiser 2 Inspection Extent | text |
| `valuation-date` | Date of Valuation | date |
| `report-date` | Date of Report | date |
| `appraiser-company` | Company Name | text |
| `appraiser-phone` | Company Phone | text |
| `status-of-improvements` | Status of Improvements | dropdown |
| `state-of-improvements` | State of Improvements | dropdown |
| `assignment-type` | Assignment Type | dropdown |
| `transaction-status` | Transaction Status | multi-select |
| `zoning-status` | Zoning Status | dropdown |
| `cmhc-financing` | CMHC Financing | dropdown |
| `land-metric` | Land $/Metric | dropdown |
| `desktop-report` | Desktop Report | dropdown |
| `client-documents` | Client Documents | multi-select |
| `delivery-time` | Delivery Time | number |
| `current-use-improvements` | Current Use Improvements | dropdown |
| `proposed-use-improvements` | Proposed Use Improvements | dropdown |
| `previously-appraised` | Previously Appraised | dropdown |
| `report-intendeduse` | Intended Use | textarea |
| `report-intendeduser` | Intended User | text |
| `report-extraordinary` | Extraordinary Assumptions | textarea |
| `report-hypothetical` | Hypothetical Conditions | textarea |
| `report-limcond` | Limiting Conditions | textarea |
| `internal-comments` | Internal Comments | textarea |
| `appraiser-comments` | Appraiser Comments | textarea |
| `delivery-date` | Delivery Date | date |
| `valuation-type` | Valuation Type | dropdown |
| `appraisal-status` | Appraisal Status | dropdown |
| `retainer-amount` | Retainer Amount | currency |
| `payment-terms` | Payment Terms | text |
| `special-instructions` | Special Instructions | textarea |

## `home` — 30 candidate fields

| Field ID | Label | Type |
|---|---|---|
| `home-use-income-approach` | Income Approach | boolean |
| `home-use-sales-approach` | Sales Comparison | boolean |
| `home-use-cost-approach` | Cost Approach | boolean |
| `use-dcf` | Use DCF Analysis | boolean |
| `use-stabilization` | Use Stabilization Tool | boolean |
| `use-multi-dc` | Use Multi-DC | boolean |
| `use-land-dc` | Use Site & Land DC | boolean |
| `use-special` | Use Special/Hotel | boolean |
| `select-modules` | Select Modules | multi-select |
| `extraordinary-assumption-1` | Extraordinary Assumption 1 | textarea |
| `extraordinary-assumption-2` | Extraordinary Assumption 2 | textarea |
| `extraordinary-assumption-3` | Extraordinary Assumption 3 | textarea |
| `hypothetical-condition-1` | Hypothetical Condition 1 | textarea |
| `hypothetical-condition-2` | Hypothetical Condition 2 | textarea |
| `hypothetical-condition-3` | Hypothetical Condition 3 | textarea |
| `limiting-condition-1` | Limiting Condition 1 | textarea |
| `limiting-condition-2` | Limiting Condition 2 | textarea |
| `limiting-condition-3` | Limiting Condition 3 | textarea |
| `property-description-prefix` | Property Description Prefix | textarea |
| `sale-lease-config` | Sale/Lease Configuration | select |
| `parcel-id` | Parcel ID | text |
| `current-owner` | Current Owner | text |
| `owner-address` | Owner Address | text |
| `prior-owner` | Prior Owner | text |
| `last-purchase-price` | Last Purchase Price | currency |
| `purchase-date` | Purchase Date | date |
| `ownership-history` | Ownership History | textarea |
| `sales-history` | Sales History | textarea |
| `transmittal-date` | Letter Date | date |
| `transmittal-body` | Letter Body | textarea |

## `cover` — 34 candidate fields

| Field ID | Label | Type |
|---|---|---|
| `property-type-display` | Property Type | text |
| `street-address` | Street Address | text |
| `city` | City | text |
| `city-formal` | City (Formal Name) | text |
| `province` | Province | dropdown |
| `province-abbr` | Province Abbreviation | text |
| `property-full-address` | Full Property Address | text |
| `file-number` | File Number | text |
| `appraiser-address` | Company Address | text |
| `appraiser-city` | Company City | text |
| `appraiser-province` | Company Province | text |
| `appraiser-postal` | Company Postal Code | text |
| `appraiser-website` | Company Website | text |
| `appraiser-name-credentials` | Appraiser Name & Credentials | text |
| `appraiser1-signature` | Appraiser 1 Signature | image |
| `client-city` | Client City | text |
| `client-province` | Client Province | text |
| `client-city-state-zip` | Client City/State/Zip | text |
| `postal-code` | Postal Code | text |
| `latitude` | Latitude | text |
| `longitude` | Longitude | text |
| `county` | County | text |
| `msa` | MSA | text |
| `geocode` | Geocode | text |
| `census-tract` | Census Tract | text |
| `country` | Country | dropdown |
| `market` | Market | text |
| `submarket` | Submarket | text |
| `appraiser2-name` | Appraiser 2 Name | text |
| `subject-geocode` | Geocode | text |
| `subject-location` | Location | text |
| `subject-market` | Market | text |
| `subject-street` | Street | text |
| `subject-submarket` | Submarket | text |

## `report` — 24 candidate fields

| Field ID | Label | Type |
|---|---|---|
| `report-purpose` | Purpose | textarea |
| `report-scope` | Scope of Work | textarea |
| `report-compliance` | Compliance Standard | text |
| `info-assessment-source` | Assessment Info Source | text |
| `info-buildingsize-source` | Building Size Info Source | text |
| `info-comps-source` | Comparables Info Source | text |
| `info-environmental-source` | Environmental Info Source | text |
| `info-incomeexpense-source` | Income/Expense Info Source | text |
| `info-lease-source` | Lease Info Source | text |
| `info-legal-source` | Legal Info Source | text |
| `info-rentroll-source` | Rent Roll Info Source | text |
| `info-sitesize-source` | Site Size Info Source | text |
| `info-title-source` | Title Info Source | text |
| `info-zoning-source` | Zoning Info Source | text |
| `report-date1` | Report Date | date |
| `report-dateinspection` | Date of Inspection | date |
| `report-effectivedate` | Effective Date | date |
| `report-interest` | Interest Appraised | text |
| `report-valuationcost` | Valuation - Cost Approach | currency |
| `report-valuationincome` | Valuation - Income Approach | currency |
| `report-valuationsales` | Valuation - Sales Approach | currency |
| `report-values` | Final Value Conclusion | currency |
| `report-valuescenario1` | Value Scenario 1 | currency |
| `deed-type` | Deed Type | dropdown |

## `exec` — 78 candidate fields

| Field ID | Label | Type |
|---|---|---|
| `building-style` | Building Style | text |
| `total-buildings` | Total Buildings | number |
| `total-nra` | Net Rentable Area (SF) | number |
| `year-built` | Year Built | number |
| `occupancy-rate` | Occupancy Rate (%) | number |
| `stabilized-occupancy` | Stabilized Occupancy (%) | number |
| `quality` | Quality | text |
| `condition` | Condition | text |
| `appeal` | Appeal | text |
| `parking` | Parking | text |
| `total-units` | Total Units | number |
| `stories` | Number of Stories | number |
| `building-format` | Building Format | text |
| `subject-actualage` | Actual Age | number |
| `subject-effectiveage` | Effective Age | number |
| `subject-economiclife` | Economic Life | number |
| `subject-nra` | Net Rentable Area | number |
| `subject-owner` | Owner | text |
| `subject-property-name` | Property Name | text |
| `subject-propertyname` | Property Name (Crosswalk) | text |
| `subject-remaininglife` | Remaining Life | number |
| `subject-year-built` | Year Built | number |
| `subject-zoning` | Zoning | text |
| `subject-zoningcode` | Zoning Code | text |
| `subject-zoningdescription` | Zoning Description | textarea |
| `subject-appeal` | Appeal | text |
| `subject-avg-unit-sf` | Average Unit SF | number |
| `subject-conforminglot` | Conforming Lot | select |
| `subject-conforminguse` | Conforming Use | select |
| `subject-density` | Density | number |
| `subject-econcharacteristics` | Economic Characteristics | textarea |
| `subject-exposuretime` | Exposure Time | text |
| `subject-introcomment` | Introduction Comment | textarea |
| `subject-legally-permitted` | Legally Permitted | select |
| `subject-marketing` | Marketing Time | text |
| `subject-occupancy-current` | Current Occupancy | percentage |
| `subject-occupancystabilized` | Stabilized Occupancy | percentage |
| `subject-occupied-units` | Occupied Units | number |
| `subject-permitteduses` | Permitted Uses | textarea |
| `subject-primary` | Primary Type | text |
| `subject-proposedconstruction` | Proposed Construction | textarea |
| `subject-quality` | Quality | text |
| `subject-salehistory` | Sale History | textarea |
| `subject-sfmultifamily` | SF Multifamily | number |
| `subject-stories` | Number of Stories | number |
| `subject-subtype` | Property Subtype | text |
| `subject-tenancy` | Tenancy | text |
| `subject-totalbuildings` | Total Buildings | number |
| `subject-totalsf` | Total SF | number |
| `subject-vacant-units` | Vacant Units | number |
| `subject-zoningauthority` | Zoning Authority | text |
| `subject-zoningchange` | Zoning Change | textarea |
| `subject-zoningchangestatus` | Zoning Change Status | text |
| `subject-avg-unit-sf` | Average Unit SF | number |
| `subject-name` | Property Name | text |
| `subject-year-built` | Year Built | number |
| `effective-date` | Effective Date | date |
| `exposure-time` | Exposure Time | text |
| `site-size` | Site Size | number |
| `subject-occupancy` | Subject Occupancy | percentage |
| `valuation-scenario` | Valuation Scenario | text |
| `zoning-designation` | Zoning Designation | text |
| `occupancy-status` | Occupancy Status | dropdown |
| `value-scenario1` | Value Scenario 1 | currency |
| `value-scenario1-psf` | Value Scenario 1 ($/SF) | currency |
| `value-scenario1-text` | Value Scenario 1 (Text) | text |
| `value-scenario2` | Value Scenario 2 | currency |
| `value-scenario2-text` | Value Scenario 2 (Text) | text |
| `value-scenario3` | Value Scenario 3 | currency |
| `value-scenario3-text` | Value Scenario 3 (Text) | text |
| `value-sa-conclusion` | Sales Approach Value Conclusion | currency |
| `value-ia-conclusion` | Income Approach Value Conclusion | currency |
| `value-insurable` | Insurable Value | currency |
| `hypothetical-conditions` | Hypothetical Conditions | textarea |
| `extraordinary-assumptions` | Extraordinary Assumptions | textarea |
| `extraordinary-limiting-conditions` | Extraordinary Limiting Conditions | textarea |
| `scenario-name` | Scenario Name | dropdown |
| `value-component` | Value Component | dropdown |

## `site` — 88 candidate fields

| Field ID | Label | Type |
|---|---|---|
| `adjacent-north` | North | dropdown |
| `adjacent-south` | South | dropdown |
| `adjacent-east` | East | dropdown |
| `adjacent-west` | West | dropdown |
| `frontage1-distance` | Frontage 1 Distance (ft) | number |
| `frontage1-street` | Frontage 1 Street | text |
| `frontage2-distance` | Frontage 2 Distance (ft) | number |
| `frontage2-street` | Frontage 2 Street | text |
| `site-total-area` | Total Site Area (SF) | number |
| `site-acreage` | Site Acreage | number |
| `site-address` | Site Address | text |
| `site-shape` | Shape | dropdown |
| `topography` | Topography | dropdown |
| `accessibility` | Accessibility | text |
| `exposure-visibility` | Exposure & Visibility | dropdown |
| `legal-description` | Legal Description | text |
| `land-area-usable-sf` | Usable Land Area (SF) | number |
| `land-area-usable-acres` | Usable Land Area (Acres) | number |
| `subject-totalacre` | Total Acres | number |
| `subject-usableacre` | Usable Acre | number |
| `subject-usableacres` | Usable Acres | number |
| `subject-usablesf` | Usable SF | number |
| `visibility` | Visibility | dropdown |
| `easements` | Easements & Encroachments | textarea |
| `soils` | Soils | textarea |
| `hazardous-waste` | Environmental Concerns | textarea |
| `site-rating` | Site Rating | dropdown |
| `site-conclusion` | Site Conclusion | textarea |
| `site-quality` | Site Quality | dropdown |
| `site-utility` | Site Utility | dropdown |
| `building-quality` | Building Quality | dropdown |
| `building-appeal` | Building Appeal | dropdown |
| `subject-shape` | Site Shape | text |
| `subject-siteaccess` | Site Access | text |
| `subject-siteexposure` | Site Exposure | text |
| `subject-sitequality` | Site Quality | text |
| `subject-siteutility` | Site Utility | text |
| `subject-topography` | Topography | text |
| `subject-utilities` | Utilities | text |
| `subject-easements` | Easements Text | textarea |
| `subject-siteconclusion` | Site Conclusion | textarea |
| `subject-siterating` | Site Rating | textarea |
| `subject-soils` | Soils | textarea |
| `drainage` | Drainage | dropdown |
| `site-appeal` | Site Appeal | dropdown |
| `site-exposure` | Site Exposure | dropdown |
| `site-plan-image` | Site Plan Images | image |
| `street1-condition` | Street 1 Condition | text |
| `street1-curbs` | Street 1 Curbs | text |
| `street1-lanes` | Street 1 Lanes | number |
| `street1-name` | Street 1 Name | text |
| `street1-parking` | Street 1 Parking | text |
| `street1-sidewalks` | Street 1 Sidewalks | text |
| `street1-type` | Street 1 Type | dropdown |
| `street1-centerlane` | Street 1 Center Lane | text |
| `street1-direction` | Street 1 Direction | text |
| `street1-lighting` | Street 1 Lighting | text |
| `street2-condition` | Street 2 Condition | text |
| `street2-curbs` | Street 2 Curbs | text |
| `street2-lanes` | Street 2 Lanes | number |
| `street2-lighting` | Street 2 Lighting | text |
| `street2-name` | Street 2 Name | text |
| `street2-parking` | Street 2 Parking | text |
| `street2-sidewalks` | Street 2 Sidewalks | text |
| `street2-surface` | Street 2 Surface | text |
| `street2-type` | Street 2 Type | dropdown |
| `street2-bikelane` | Street 2 Bike Lane | text |
| `street2-centerlane` | Street 2 Center Lane | text |
| `street2-direction` | Street 2 Direction | text |
| `traffic-total` | Total Traffic Count | number |
| `traffic1-count` | Traffic Count 1 | number |
| `traffic1-date` | Traffic Count 1 Date | date |
| `traffic1-source` | Traffic Count 1 Source | text |
| `traffic1-street` | Traffic Count 1 Street | text |
| `traffic1-year` | Traffic Count 1 Year | number |
| `traffic1-location` | Traffic Count 1 Location | text |
| `traffic2-count` | Traffic Count 2 | number |
| `traffic2-date` | Traffic Count 2 Date | date |
| `traffic2-source` | Traffic Count 2 Source | text |
| `traffic2-street` | Traffic Count 2 Street | text |
| `traffic2-year` | Traffic Count 2 Year | number |
| `traffic2-location` | Traffic Count 2 Location | text |
| `util-water` | Water | dropdown |
| `util-sewer` | Sewer | dropdown |
| `util-electric` | Electric | dropdown |
| `util-gas` | Gas | dropdown |
| `subject-zoningconclusion` | Zoning Conclusion | textarea |
| `subject-zoningtype` | Zoning Type | text |

## `zone` — 17 candidate fields

| Field ID | Label | Type |
|---|---|---|
| `zoning-classification` | Zoning Classification | text |
| `zoning-description` | Zoning Description | textarea |
| `permitted-uses` | Permitted Uses | textarea |
| `zone-conditional-uses` | Conditional Uses | textarea |
| `zone-minimum-lot-size` | Minimum Lot Size | text |
| `zone-setbacks` | Setback Requirements | text |
| `max-height` | Max Height | text |
| `max-density` | Max Density | text |
| `min-setback` | Min Setback | text |
| `parking-requirements` | Parking Requirements | text |
| `site-coverage` | Site Coverage | text |
| `zoning-conformance` | Conformance | dropdown |
| `zoning-conclusion` | Zoning Conclusion | textarea |
| `zoning-map` | Zoning Map | image |
| `zoning-compliance` | Zoning Compliance | dropdown |
| `conforming-use` | Conforming Use | dropdown |
| `conforming-lot` | Conforming Lot | dropdown |

## `location` — 18 candidate fields

| Field ID | Label | Type |
|---|---|---|
| `local-area-description` | Local Area Description | textarea |
| `nearby-schools` | Nearby Schools | textarea |
| `location-nearby-amenities` | Nearby Amenities | textarea |
| `location-localarea` | Local Area Overview | textarea |
| `location-nearbyschool-1` | Nearby School 1 | text |
| `location-nearbyschool-2` | Nearby School 2 | text |
| `location-nearbyschool-3` | Nearby School 3 | text |
| `location-nearbyschool-4` | Nearby School 4 | text |
| `location-nearbyschool-5` | Nearby School 5 | text |
| `location-overview-text` | Location Overview | textarea |
| `location-access` | Access | textarea |
| `public-transit` | Public Transportation | textarea |
| `location-description` | Location Description | textarea |
| `location-publictransit` | Public Transit | textarea |
| `walk-score` | Walk Score | number |
| `transit-score` | Transit Score | number |
| `bike-score` | Bike Score | number |
| `location-walkbikescores` | Walk/Bike Scores | textarea |

## `tax` — 16 candidate fields

| Field ID | Label | Type |
|---|---|---|
| `assessment-year` | Assessment Year | number |
| `land-assessment` | Land Assessment | number |
| `building-assessment` | Building Assessment | number |
| `total-assessment` | Total Assessment | number |
| `mill-rate` | Mill Rate | text |
| `annual-taxes` | Annual Taxes | number |
| `tax-commentary` | Tax Commentary | textarea |
| `tax-status` | Tax Status | dropdown |
| `assessment-trend` | Assessment Trend | dropdown |
| `tax-commentary-1` | Tax Commentary Paragraph 1 | textarea |
| `tax-commentary-2` | Tax Commentary Paragraph 2 | textarea |
| `subject-taxamount` | Tax Amount | currency |
| `subject-taxassessment` | Tax Assessment | currency |
| `subject-tax-per-sf` | Tax per SF | currency |
| `subject-taxrate` | Tax Rate | percentage |
| `subject-taxyear` | Tax Year | number |

## `hbu` — 14 candidate fields

| Field ID | Label | Type |
|---|---|---|
| `hbu-improved` | Highest & Best Use As Improved | textarea |
| `subject-hbuimproved` | HBU As Improved | textarea |
| `hbu-asimproved-1` | HBU As Improved | textarea |
| `hbu-asimproved-2` | HBU As Improved Paragraph 2 | textarea |
| `hbu-asimproved-3` | HBU As Improved Paragraph 3 | textarea |
| `hbu-vacant-legal` | Legally Permissible | textarea |
| `hbu-vacant-physical` | Physically Possible | textarea |
| `hbu-vacant-financial` | Financially Feasible | textarea |
| `hbu-vacant-productive` | Maximally Productive | textarea |
| `subject-hbuvacant` | HBU As Vacant | textarea |
| `hbu-conclusion-vacant` | HBU Conclusion Vacant | textarea |
| `hbu-conclusion-text` | HBU Conclusion | textarea |
| `hbu-mostprobablebuyer` | Most Probable Buyer | textarea |
| `hbu-intro` | HBU Introduction | textarea |

## `impv` — 91 candidate fields

| Field ID | Label | Type |
|---|---|---|
| `project-amenities` | Project Amenities | textarea |
| `unit-amenities` | Unit Amenities | textarea |
| `laundry` | Laundry | text |
| `security` | Security Features | textarea |
| `subject-amenities-laundry` | Amenities - Laundry | text |
| `subject-amenities-parking` | Amenities - Parking | text |
| `subject-amenities-utilities` | Amenities - Utilities | text |
| `subject-laundry` | Laundry | text |
| `subject-parking-incl` | Parking Included | select |
| `subject-parking-type` | Parking Type | dropdown |
| `subject-proj-amenities` | Project Amenities | textarea |
| `subject-security` | Security | text |
| `subject-security-features` | Security Features | textarea |
| `subject-unit-amenities` | Unit Amenities | textarea |
| `subject-parking-incl` | Parking Included | text |
| `subject-parking-type` | Parking Type | dropdown |
| `impv-overview` | Overview | textarea |
| `impv-num-buildings` | Number of Buildings | number |
| `impv-nra` | Net Rentable Area (SF) | number |
| `impv-year-built` | Year Built | number |
| `impv-num-units` | Number of Units | number |
| `impv-stories` | Number of Stories | number |
| `impv-building-format` | Building Format | text |
| `gba` | Gross Building Area (SF) | number |
| `density-units-acre` | Density (Units/Acre) | number |
| `impv-appeal` | Appeal Rating | dropdown |
| `impv-condition` | Condition Rating | dropdown |
| `impv-quality` | Quality Rating | dropdown |
| `impv-density` | Density (Units/Acre) | number |
| `impv-landtobldg` | Land to Building Ratio | number |
| `impv-propertytype` | Property Type | text |
| `building-class` | Building Class | dropdown |
| `overall-condition` | Overall Condition | dropdown |
| `functional-design` | Functional Design | textarea |
| `hazardous-materials` | Hazardous Materials | textarea |
| `actual-age` | Actual Age (Years) | number |
| `effective-age` | Effective Age (Years) | number |
| `economic-life` | Economic Life (Years) | number |
| `remaining-useful-life` | Remaining Useful Life (Years) | number |
| `impv-actualage` | Actual Age | number |
| `impv-effectiveage` | Effective Age | number |
| `impv-economiclife` | Economic Life | number |
| `impv-remaininglife` | Remaining Life | number |
| `subject-functionaldesign` | Functional Design | textarea |
| `subject-hazardousmaterials` | Hazardous Materials | textarea |
| `building-condition` | Building Condition | dropdown |
| `building-function` | Building Function | dropdown |
| `foundation` | Foundation | dropdown |
| `exterior-walls` | Exterior Walls/Framing | text |
| `roof` | Roof | dropdown |
| `impv-roof-condition` | Roof Condition | text |
| `impv-insulation` | Insulation | text |
| `elevator` | Elevator | text |
| `subject-elevator` | Elevator | text |
| `subject-exteriorwalls` | Exterior Walls | text |
| `subject-foundation` | Foundation | text |
| `subject-insulation` | Insulation | text |
| `construction-type` | Construction Type | dropdown |
| `roof-type` | Roof Type | dropdown |
| `interior-walls` | Interior Walls | text |
| `ceilings` | Ceilings | text |
| `flooring` | Flooring | text |
| `doors-windows` | Doors & Windows | text |
| `impv-interior-finish` | Interior Finish Quality | text |
| `subject-ceilings` | Ceilings | text |
| `subject-doorswindows` | Doors & Windows | text |
| `subject-floorcovering` | Floor Covering | text |
| `subject-interiorwalls` | Interior Walls | text |
| `site-impv` | Site Improvements | textarea |
| `landscaping` | Landscaping | text |
| `parking-spaces` | Parking Spaces | number |
| `parking-ratio` | Parking Ratio | number |
| `impv-building-footprint` | Building Footprint (SF) | number |
| `impv-site-coverage` | Site Coverage (%) | number |
| `impv-parkingratio` | Parking Ratio | number |
| `impv-parkingspaces` | Parking Spaces | number |
| `subject-landscaping` | Landscaping | text |
| `subject-parkingdesc` | Parking Description | textarea |
| `subject-siteimprovements` | Site Improvements | textarea |
| `parking-type` | Parking Type | dropdown |
| `subject-interior-finish` | Interior Finish | text |
| `subject-roof` | Roof Type | text |
| `hvac` | HVAC | text |
| `electrical` | Electrical | text |
| `plumbing` | Plumbing | text |
| `fire-protection` | Fire Protection | text |
| `subject-electrical` | Electrical | text |
| `subject-fireprotection` | Fire Protection | text |
| `subject-hvac` | HVAC | text |
| `subject-lighting` | Lighting | text |
| `subject-plumbing` | Plumbing | text |

## `image-mgt` — 134 candidate fields

| Field ID | Label | Type |
|---|---|---|
| `company-logo` | Company Logo | image |
| `img-common-1` | Common Area 1 - Lobby/Entrance | image |
| `img-common-1-caption` | Caption | text |
| `img-common-2` | Common Area 2 - Hallway/Corridor | image |
| `img-common-2-caption` | Caption | text |
| `img-common-3` | Common Area 3 - Amenity Space | image |
| `img-common-3-caption` | Caption | text |
| `img-common-4` | Common Area 4 - Additional | image |
| `img-common-4-caption` | Caption | text |
| `comp1-map` | Comp 1 Map | image |
| `comp2-map` | Comp 2 Map | image |
| `comp3-map` | Comp 3 Map | image |
| `comp4-map` | Comp 4 Map | image |
| `comp5-map` | Comp 5 Map | image |
| `comp1-photo` | Comp 1 Photo | image |
| `comp1-photo-caption` | Caption | text |
| `comp2-photo` | Comp 2 Photo | image |
| `comp2-photo-caption` | Caption | text |
| `comp3-photo` | Comp 3 Photo | image |
| `comp3-photo-caption` | Caption | text |
| `comp4-photo` | Comp 4 Photo | image |
| `comp4-photo-caption` | Caption | text |
| `comp5-photo` | Comp 5 Photo | image |
| `comp5-photo-caption` | Caption | text |
| `subject-photo` | Cover Photo - Main property image | image |
| `img-signature` | Appraiser Signature | image |
| `img-exterior-1` | Exterior 1 - Front Facade | image |
| `img-exterior-1-caption` | Caption | text |
| `img-exterior-2` | Exterior 2 - Rear Elevation | image |
| `img-exterior-2-caption` | Caption | text |
| `img-exterior-3` | Exterior 3 - Left Side | image |
| `img-exterior-3-caption` | Caption | text |
| `img-exterior-4` | Exterior 4 - Right Side | image |
| `img-exterior-4-caption` | Caption | text |
| `img-exterior-5` | Exterior 5 - Detail/Feature | image |
| `img-exterior-5-caption` | Caption | text |
| `img-exterior-6` | Exterior 6 - Additional | image |
| `img-exterior-6-caption` | Caption | text |
| `img-map-regional` | Regional Map - Province/region context | image |
| `img-map-regional-title` | Title | text |
| `img-map-local` | Local Area Map - City/neighborhood | image |
| `img-map-local-title` | Title | text |
| `img-map-aerial` | Aerial Overview Map | image |
| `img-map-aerial-1` | Aerial View - Bird's eye of property | image |
| `img-map-aerial-1-title` | Title | text |
| `img-comparables-map` | Sales Comparables Location Map | image |
| `img-rental-comparables-map` | Rental Comparables Location Map | image |
| `img-map-aerial-2` | Site Boundary - Property lines shown | image |
| `img-map-aerial-2-title` | Title | text |
| `img-zoning-map` | Zoning Map - Municipal zoning | image |
| `zoning-map-title` | Zoning Map Title | text |
| `img-site-plan-1` | Site Plan - Layout/footprint | image |
| `site-plan-1-title` | Site Plan 1 Title | text |
| `img-site-plan-2` | Survey/Plot Plan | image |
| `site-plan-2-title` | Site Plan 2 Title | text |
| `photo-section-title` | Photo Section Title | text |
| `rental-comp1-photo` | Rental Comp 1 Photo | image |
| `rental-comp2-photo` | Rental Comp 2 Photo | image |
| `img-street-1` | Street View 1 - Looking North | image |
| `img-street-1-caption` | Caption | text |
| `img-street-2` | Street View 2 - Looking South | image |
| `img-street-2-caption` | Caption | text |
| `img-street-3` | Street View 3 - Streetscape/Context | image |
| `img-street-3-caption` | Caption | text |
| `subject-photo-1` | Subject Photo 1 | image |
| `subject-photo-1-caption` | Caption | text |
| `subject-photo-2` | Subject Photo 2 | image |
| `subject-photo-2-caption` | Caption | text |
| `subject-photo-3` | Subject Photo 3 | image |
| `subject-photo-3-caption` | Caption | text |
| `subject-photo-4` | Subject Photo 4 | image |
| `subject-photo-4-caption` | Caption | text |
| `subject-photo-5` | Subject Photo 5 | image |
| `subject-photo-5-caption` | Caption | text |
| `subject-photo-6` | Subject Photo 6 | image |
| `subject-photo-6-caption` | Caption | text |
| `subject-photo-7` | Subject Photo 7 | image |
| `subject-photo-7-caption` | Caption | text |
| `subject-photo-8` | Subject Photo 8 | image |
| `subject-photo-8-caption` | Caption | text |
| `subject-photo-9` | Subject Photo 9 | image |
| `subject-photo-9-caption` | Caption | text |
| `subject-photo-10` | Subject Photo 10 | image |
| `subject-photo-10-caption` | Caption | text |
| `subject-photo-11` | Subject Photo 11 | image |
| `subject-photo-11-caption` | Caption | text |
| `subject-photo-12` | Subject Photo 12 | image |
| `subject-photo-12-caption` | Caption | text |
| `subject-photo-13` | Subject Photo 13 | image |
| `subject-photo-13-caption` | Caption | text |
| `subject-photo-14` | Subject Photo 14 | image |
| `subject-photo-14-caption` | Caption | text |
| `subject-photo-15` | Subject Photo 15 | image |
| `subject-photo-15-caption` | Caption | text |
| `subject-photo-16` | Subject Photo 16 | image |
| `subject-photo-16-caption` | Caption | text |
| `subject-photo-17` | Subject Photo 17 | image |
| `subject-photo-17-caption` | Caption | text |
| `subject-photo-18` | Subject Photo 18 | image |
| `subject-photo-18-caption` | Caption | text |
| `subject-photo-19` | Subject Photo 19 | image |
| `subject-photo-19-caption` | Caption | text |
| `subject-photo-20` | Subject Photo 20 | image |
| `subject-photo-20-caption` | Caption | text |
| `subject-photo-21` | Subject Photo 21 | image |
| `subject-photo-21-caption` | Caption | text |
| `subject-photo-22` | Subject Photo 22 | image |
| `subject-photo-22-caption` | Caption | text |
| `subject-photo-23` | Subject Photo 23 | image |
| `subject-photo-23-caption` | Caption | text |
| `subject-photo-24` | Subject Photo 24 | image |
| `subject-photo-24-caption` | Caption | text |
| `subject-photo-25` | Subject Photo 25 | image |
| `subject-photo-25-caption` | Caption | text |
| `img-systems-1` | Building Systems 1 - Mechanical Room | image |
| `img-systems-1-caption` | Caption | text |
| `img-systems-2` | Building Systems 2 - Electrical Panel | image |
| `img-systems-2-caption` | Caption | text |
| `img-systems-3` | Building Systems 3 - Plumbing/Water Heater | image |
| `img-systems-3-caption` | Caption | text |
| `img-systems-4` | Building Systems 4 - HVAC/Furnace | image |
| `img-systems-4-caption` | Caption | text |
| `img-unit-1` | Unit Interior 1 - Living Room | image |
| `img-unit-1-caption` | Caption | text |
| `img-unit-2` | Unit Interior 2 - Kitchen | image |
| `img-unit-2-caption` | Caption | text |
| `img-unit-3` | Unit Interior 3 - Bedroom | image |
| `img-unit-3-caption` | Caption | text |
| `img-unit-4` | Unit Interior 4 - Bathroom | image |
| `img-unit-4-caption` | Caption | text |
| `img-unit-5` | Unit Interior 5 - Additional Room | image |
| `img-unit-5-caption` | Caption | text |
| `img-unit-6` | Unit Interior 6 - Additional | image |
| `img-unit-6-caption` | Caption | text |

## `photos` — 5 candidate fields

| Field ID | Label | Type |
|---|---|---|
| `photos-systems` | Building Systems Photos | image |
| `photos-exterior` | Exterior Photos | image |
| `photos-common` | Common Area Photos | image |
| `photos-street` | Street View Photos | image |
| `photos-units` | Unit Interior Photos | image |

## `income` — 38 candidate fields

| Field ID | Label | Type |
|---|---|---|
| `income-cap-rate-analysis` | Cap Rate Analysis | textarea |
| `income-value-indication` | Income Approach Value | number |
| `bond-yield-10yr` | 10-Year Bond Yield | percentage |
| `cap-rate-average` | Cap Rate Average | percentage |
| `cap-rate-high` | Cap Rate High | percentage |
| `cap-rate-implied-range` | Cap Rate Implied Range | text |
| `cap-rate-low` | Cap Rate Low | percentage |
| `cap-rate-range` | Cap Rate Range | text |
| `risk-premium-bp` | Risk Premium (BP) | number |
| `ia-dircap-cap-rate1` | Direct Cap Cap Rate | percentage |
| `ia-dircap-expenseratio` | Direct Cap Expense Ratio | percentage |
| `ia-dircap-noi` | Direct Cap NOI | currency |
| `ia-dircap-noi-per-unit` | Direct Cap NOI Per Unit | currency |
| `hist-pgr-pct-pgr` | Historical PGR % | percentage |
| `income-expense-narrative` | Expense Analysis | textarea |
| `income-noi-narrative` | NOI Analysis | textarea |
| `income-pgi-narrative` | PGI Analysis | textarea |
| `egr-proj-pct` | EGR Projection % | percentage |
| `noi-proj-pct` | NOI Projection % | percentage |
| `pgr-proj-pct` | PGR Projection % | percentage |
| `unitmix-avg-size` | Average Unit Size | number |
| `unitmix-desc-1` | Unit Mix Description 1 | text |
| `unitmix-desc-2` | Unit Mix Description 2 | text |
| `unitmix-gba-1` | Unit Type 1 GBA | number |
| `unitmix-gba-2` | Unit Type 2 GBA | number |
| `unitmix-nra-1` | Unit Type 1 NRA | number |
| `unitmix-nra-2` | Unit Type 2 NRA | number |
| `unitmix-pct-1` | Unit Type 1 Percentage | percentage |
| `unitmix-pct-2` | Unit Type 2 Percentage | percentage |
| `unitmix-size-1` | Unit Type 1 Size | number |
| `unitmix-size-2` | Unit Type 2 Size | number |
| `unitmix-total-gba` | Total GBA | number |
| `unitmix-total-nra` | Total NRA | number |
| `unitmix-total-units` | Total Units | number |
| `unitmix-type-1` | Unit Type 1 Name | text |
| `unitmix-type-2` | Unit Type 2 Name | text |
| `unitmix-units-1` | Unit Type 1 Count | number |
| `unitmix-units-2` | Unit Type 2 Count | number |

## `rentroll` — 37 candidate fields

| Field ID | Label | Type |
|---|---|---|
| `rentroll-total-occ` | Total Occupied | number |
| `rentroll-total-vac` | Total Vacant | number |
| `rentroll-total-units` | Total Units | number |
| `rentroll-total-pct` | Total % | percentage |
| `rentroll-avg-size` | Average Size (SF) | number |
| `rentroll-avg-vac-pct` | Average Vacancy % | percentage |
| `rentroll-avg-occ-pct` | Average Occupancy % | percentage |
| `rentroll-avg-asking-unit` | Average Asking Rent/Unit | currency |
| `rentroll-avg-asking-sf` | Average Asking Rent/SF | currency |
| `rentroll-avg-recent-unit` | Average Recent Rent/Unit | currency |
| `rentroll-avg-recent-sf` | Average Recent Rent/SF | currency |
| `rentroll-avg-actual-unit` | Average Actual Rent/Unit | currency |
| `rentroll-avg-actual-sf` | Average Actual Rent/SF | currency |
| `rentroll-type1-name` | Type 1 Name | text |
| `rentroll-type1-desc` | Type 1 Description | text |
| `rentroll-type1-occ` | Type 1 Occupied | number |
| `rentroll-type1-vac` | Type 1 Vacant | number |
| `rentroll-type1-total` | Type 1 Total | number |
| `rentroll-type1-pct` | Type 1 % | percentage |
| `rentroll-type1-size` | Type 1 Size (SF) | number |
| `rentroll-type1-vac-pct` | Type 1 Vacancy % | percentage |
| `rentroll-type1-occ-pct` | Type 1 Occupancy % | percentage |
| `rentroll-type1-recent-sf` | Type 1 Recent Rent/SF | currency |
| `rentroll-type1-actual-unit` | Type 1 Actual Rent/Unit | currency |
| `rentroll-type1-actual-sf` | Type 1 Actual Rent/SF | currency |
| `rentroll-type2-name` | Type 2 Name | text |
| `rentroll-type2-desc` | Type 2 Description | text |
| `rentroll-type2-occ` | Type 2 Occupied | number |
| `rentroll-type2-vac` | Type 2 Vacant | number |
| `rentroll-type2-total` | Type 2 Total | number |
| `rentroll-type2-pct` | Type 2 % | percentage |
| `rentroll-type2-size` | Type 2 Size (SF) | number |
| `rentroll-type2-vac-pct` | Type 2 Vacancy % | percentage |
| `rentroll-type2-occ-pct` | Type 2 Occupancy % | percentage |
| `rentroll-type2-recent-sf` | Type 2 Recent Rent/SF | currency |
| `rentroll-type2-actual-unit` | Type 2 Actual Rent/Unit | currency |
| `rentroll-type2-actual-sf` | Type 2 Actual Rent/SF | currency |

## `rent-analysis` — 170 candidate fields

| Field ID | Label | Type |
|---|---|---|
| `rental-comp1-address-full` | Rental Comp 1 - Full Address | text |
| `rental-comp1-distance` | Rental Comp 1 - Distance | text |
| `rental-comp1-label` | Rental Comp 1 - Label | text |
| `rental-comp2-address-full` | Rental Comp 2 - Full Address | text |
| `rental-comp2-distance` | Rental Comp 2 - Distance | text |
| `rental-comp2-label` | Rental Comp 2 - Label | text |
| `rental-comp3-address-full` | Rental Comp 3 - Full Address | text |
| `rental-comp3-distance` | Rental Comp 3 - Distance | text |
| `rental-comp3-label` | Rental Comp 3 - Label | text |
| `rental-comp4-address-full` | Rental Comp 4 - Full Address | text |
| `rental-comp4-distance` | Rental Comp 4 - Distance | text |
| `rental-comp4-label` | Rental Comp 4 - Label | text |
| `rental-comp5-address-full` | Rental Comp 5 - Full Address | text |
| `rental-comp5-distance` | Rental Comp 5 - Distance | text |
| `rental-comp5-label` | Rental Comp 5 - Label | text |
| `rental-comparables-map` | Rental Comparables Map | image |
| `rentcomp1-address` | Rentcomp1 Address | text |
| `rentcomp1-appeal` | Rentcomp1 Appeal | text |
| `rentcomp1-avg-unit-sf` | Rentcomp1 Avg Unit SF | number |
| `rentcomp1-city` | Rentcomp1 City | text |
| `rentcomp1-condition` | Rentcomp1 Condition | text |
| `rentcomp1-laundry` | Rentcomp1 Laundry | text |
| `rentcomp1-location` | Rentcomp1 Location | text |
| `rentcomp1-name` | Rentcomp1 Name | text |
| `rentcomp1-parking-incl` | Rentcomp1 Parking Included | text |
| `rentcomp1-parking-type` | Rentcomp1 Parking Type | text |
| `rentcomp1-proj-amenities` | Rentcomp1 Project Amenities | text |
| `rentcomp1-province` | Rentcomp1 Province | text |
| `rentcomp1-quality` | Rentcomp1 Quality | text |
| `rentcomp1-rent-sf-avg` | Rentcomp1 Rent/SF Avg | currency |
| `rentcomp1-rent-unit-avg` | Rentcomp1 Rent/Unit Avg | currency |
| `rentcomp1-renttype` | Rentcomp1 Rent Type | text |
| `rentcomp1-security` | Rentcomp1 Security | text |
| `rentcomp1-surveycomments` | Rentcomp1 Survey Comments | text |
| `rentcomp1-totaladj` | Rentcomp1 Total Adj | currency |
| `rentcomp1-unit-amenities` | Rentcomp1 Unit Amenities | text |
| `rentcomp1-units` | Rentcomp1 Units | number |
| `rentcomp1-utilities` | Rentcomp1 Utilities | text |
| `rentcomp1-avg-unit-sf` | Rentcomp1 Avg Unit SF | number |
| `rentcomp1-occupancy` | Rentcomp1 Occupancy | percentage |
| `rentcomp1-parking-incl` | Rentcomp1 Parking Included | text |
| `rentcomp1-parking-type` | Rentcomp1 Parking Type | text |
| `rentcomp1-proj-amenities` | Rentcomp1 Project Amenities | text |
| `rentcomp1-rent-sf-avg` | Rentcomp1 Rent/SF Avg | currency |
| `rentcomp1-rent-unit-avg` | Rentcomp1 Rent/Unit Avg | currency |
| `rentcomp1-unit-amenities` | Rentcomp1 Unit Amenities | text |
| `rentcomp2-address` | Rentcomp2 Address | text |
| `rentcomp2-appeal` | Rentcomp2 Appeal | text |
| `rentcomp2-avg-unit-sf` | Rentcomp2 Avg Unit SF | number |
| `rentcomp2-city` | Rentcomp2 City | text |
| `rentcomp2-condition` | Rentcomp2 Condition | text |
| `rentcomp2-laundry` | Rentcomp2 Laundry | text |
| `rentcomp2-location` | Rentcomp2 Location | text |
| `rentcomp2-name` | Rentcomp2 Name | text |
| `rentcomp2-parking-incl` | Rentcomp2 Parking Included | text |
| `rentcomp2-parking-type` | Rentcomp2 Parking Type | text |
| `rentcomp2-proj-amenities` | Rentcomp2 Project Amenities | text |
| `rentcomp2-province` | Rentcomp2 Province | text |
| `rentcomp2-quality` | Rentcomp2 Quality | text |
| `rentcomp2-rent-sf-avg` | Rentcomp2 Rent/SF Avg | currency |
| `rentcomp2-rent-unit-avg` | Rentcomp2 Rent/Unit Avg | currency |
| `rentcomp2-renttype` | Rentcomp2 Rent Type | text |
| `rentcomp2-security` | Rentcomp2 Security | text |
| `rentcomp2-surveycomments` | Rentcomp2 Survey Comments | text |
| `rentcomp2-totaladj` | Rentcomp2 Total Adj | currency |
| `rentcomp2-unit-amenities` | Rentcomp2 Unit Amenities | text |
| `rentcomp2-units` | Rentcomp2 Units | number |
| `rentcomp2-utilities` | Rentcomp2 Utilities | text |
| `rentcomp2-avg-unit-sf` | Rentcomp2 Avg Unit SF | number |
| `rentcomp2-occupancy` | Rentcomp2 Occupancy | percentage |
| `rentcomp2-parking-incl` | Rentcomp2 Parking Included | text |
| `rentcomp2-parking-type` | Rentcomp2 Parking Type | text |
| `rentcomp2-proj-amenities` | Rentcomp2 Project Amenities | text |
| `rentcomp2-rent-sf-avg` | Rentcomp2 Rent/SF Avg | currency |
| `rentcomp2-rent-unit-avg` | Rentcomp2 Rent/Unit Avg | currency |
| `rentcomp2-unit-amenities` | Rentcomp2 Unit Amenities | text |
| `rentcomp3-address` | Rentcomp3 Address | text |
| `rentcomp3-appeal` | Rentcomp3 Appeal | text |
| `rentcomp3-avg-unit-sf` | Rentcomp3 Avg Unit SF | number |
| `rentcomp3-city` | Rentcomp3 City | text |
| `rentcomp3-condition` | Rentcomp3 Condition | text |
| `rentcomp3-laundry` | Rentcomp3 Laundry | text |
| `rentcomp3-location` | Rentcomp3 Location | text |
| `rentcomp3-name` | Rentcomp3 Name | text |
| `rentcomp3-parking-incl` | Rentcomp3 Parking Included | text |
| `rentcomp3-parking-type` | Rentcomp3 Parking Type | text |
| `rentcomp3-proj-amenities` | Rentcomp3 Project Amenities | text |
| `rentcomp3-province` | Rentcomp3 Province | text |
| `rentcomp3-quality` | Rentcomp3 Quality | text |
| `rentcomp3-rent-sf-avg` | Rentcomp3 Rent/SF Avg | currency |
| `rentcomp3-rent-unit-avg` | Rentcomp3 Rent/Unit Avg | currency |
| `rentcomp3-renttype` | Rentcomp3 Rent Type | text |
| `rentcomp3-security` | Rentcomp3 Security | text |
| `rentcomp3-surveycomments` | Rentcomp3 Survey Comments | text |
| `rentcomp3-totaladj` | Rentcomp3 Total Adj | currency |
| `rentcomp3-unit-amenities` | Rentcomp3 Unit Amenities | text |
| `rentcomp3-units` | Rentcomp3 Units | number |
| `rentcomp3-utilities` | Rentcomp3 Utilities | text |
| `rentcomp3-avg-unit-sf` | Rentcomp3 Avg Unit SF | number |
| `rentcomp3-occupancy` | Rentcomp3 Occupancy | percentage |
| `rentcomp3-parking-incl` | Rentcomp3 Parking Included | text |
| `rentcomp3-parking-type` | Rentcomp3 Parking Type | text |
| `rentcomp3-proj-amenities` | Rentcomp3 Project Amenities | text |
| `rentcomp3-rent-sf-avg` | Rentcomp3 Rent/SF Avg | currency |
| `rentcomp3-rent-unit-avg` | Rentcomp3 Rent/Unit Avg | currency |
| `rentcomp3-unit-amenities` | Rentcomp3 Unit Amenities | text |
| `rentcomp4-address` | Rentcomp4 Address | text |
| `rentcomp4-appeal` | Rentcomp4 Appeal | text |
| `rentcomp4-avg-unit-sf` | Rentcomp4 Avg Unit SF | number |
| `rentcomp4-city` | Rentcomp4 City | text |
| `rentcomp4-condition` | Rentcomp4 Condition | text |
| `rentcomp4-laundry` | Rentcomp4 Laundry | text |
| `rentcomp4-location` | Rentcomp4 Location | text |
| `rentcomp4-name` | Rentcomp4 Name | text |
| `rentcomp4-parking-incl` | Rentcomp4 Parking Included | text |
| `rentcomp4-parking-type` | Rentcomp4 Parking Type | text |
| `rentcomp4-proj-amenities` | Rentcomp4 Project Amenities | text |
| `rentcomp4-province` | Rentcomp4 Province | text |
| `rentcomp4-quality` | Rentcomp4 Quality | text |
| `rentcomp4-rent-sf-avg` | Rentcomp4 Rent/SF Avg | currency |
| `rentcomp4-rent-unit-avg` | Rentcomp4 Rent/Unit Avg | currency |
| `rentcomp4-renttype` | Rentcomp4 Rent Type | text |
| `rentcomp4-security` | Rentcomp4 Security | text |
| `rentcomp4-surveycomments` | Rentcomp4 Survey Comments | text |
| `rentcomp4-totaladj` | Rentcomp4 Total Adj | currency |
| `rentcomp4-unit-amenities` | Rentcomp4 Unit Amenities | text |
| `rentcomp4-units` | Rentcomp4 Units | number |
| `rentcomp4-utilities` | Rentcomp4 Utilities | text |
| `rentcomp4-avg-unit-sf` | Rentcomp4 Avg Unit SF | number |
| `rentcomp4-occupancy` | Rentcomp4 Occupancy | percentage |
| `rentcomp4-parking-incl` | Rentcomp4 Parking Included | text |
| `rentcomp4-parking-type` | Rentcomp4 Parking Type | text |
| `rentcomp4-proj-amenities` | Rentcomp4 Project Amenities | text |
| `rentcomp4-rent-sf-avg` | Rentcomp4 Rent/SF Avg | currency |
| `rentcomp4-rent-unit-avg` | Rentcomp4 Rent/Unit Avg | currency |
| `rentcomp4-unit-amenities` | Rentcomp4 Unit Amenities | text |
| `rentcomp5-address` | Rentcomp5 Address | text |
| `rentcomp5-appeal` | Rentcomp5 Appeal | text |
| `rentcomp5-avg-unit-sf` | Rentcomp5 Avg Unit SF | number |
| `rentcomp5-city` | Rentcomp5 City | text |
| `rentcomp5-condition` | Rentcomp5 Condition | text |
| `rentcomp5-laundry` | Rentcomp5 Laundry | text |
| `rentcomp5-location` | Rentcomp5 Location | text |
| `rentcomp5-name` | Rentcomp5 Name | text |
| `rentcomp5-parking-incl` | Rentcomp5 Parking Included | text |
| `rentcomp5-parking-type` | Rentcomp5 Parking Type | text |
| `rentcomp5-proj-amenities` | Rentcomp5 Project Amenities | text |
| `rentcomp5-province` | Rentcomp5 Province | text |
| `rentcomp5-quality` | Rentcomp5 Quality | text |
| `rentcomp5-rent-sf-avg` | Rentcomp5 Rent/SF Avg | currency |
| `rentcomp5-rent-unit-avg` | Rentcomp5 Rent/Unit Avg | currency |
| `rentcomp5-renttype` | Rentcomp5 Rent Type | text |
| `rentcomp5-security` | Rentcomp5 Security | text |
| `rentcomp5-surveycomments` | Rentcomp5 Survey Comments | text |
| `rentcomp5-totaladj` | Rentcomp5 Total Adj | currency |
| `rentcomp5-unit-amenities` | Rentcomp5 Unit Amenities | text |
| `rentcomp5-units` | Rentcomp5 Units | number |
| `rentcomp5-utilities` | Rentcomp5 Utilities | text |
| `rentcomp5-avg-unit-sf` | Rentcomp5 Avg Unit SF | number |
| `rentcomp5-occupancy` | Rentcomp5 Occupancy | percentage |
| `rentcomp5-parking-incl` | Rentcomp5 Parking Included | text |
| `rentcomp5-parking-type` | Rentcomp5 Parking Type | text |
| `rentcomp5-proj-amenities` | Rentcomp5 Project Amenities | text |
| `rentcomp5-rent-sf-avg` | Rentcomp5 Rent/SF Avg | currency |
| `rentcomp5-rent-unit-avg` | Rentcomp5 Rent/Unit Avg | currency |
| `rentcomp5-unit-amenities` | Rentcomp5 Unit Amenities | text |
| `survey-intro` | Rental Survey Introduction | textarea |
| `survey-methodology` | Survey Methodology | textarea |
| `survey-conclusion` | Rental Survey Conclusion | textarea |
| `survey-market-rent-support` | Market Rent Support Narrative | textarea |

## `market` — 50 candidate fields

| Field ID | Label | Type |
|---|---|---|
| `local-market` | Local Market Analysis | textarea |
| `market-local-population` | Population | text |
| `market-local-employment` | Employment | textarea |
| `economic-outlook` | Economic Outlook | dropdown |
| `multifamily-overview` | Multifamily Market Overview | textarea |
| `market-vacancy-rate` | Market Vacancy Rate (%) | number |
| `rent-trend` | Rent Trend | dropdown |
| `market-supply-pipeline` | Supply Pipeline | textarea |
| `market-demand-drivers` | Demand Drivers | textarea |
| `chart-mf-investment-indicators` | MF Investment Indicators Chart | image |
| `market-outlook` | Market Outlook | dropdown |
| `national-overview` | National Economic Overview | textarea |
| `market-national-gdp` | GDP Growth | text |
| `market-national-inflation` | Inflation Rate | text |
| `ca-business-investment` | Canada Business Investment | text |
| `ca-gdp-growth` | Canada GDP Growth | text |
| `ca-gdp` | Canada GDP | text |
| `ca-housing-starts` | Canada Housing Starts | text |
| `ca-inflation` | Canada Inflation Rate | text |
| `ca-natgas` | Canada Natural Gas Price | text |
| `ca-pop-growth` | Canada Population Growth | text |
| `ca-population` | Canada Population | text |
| `ca-retail` | Canada Retail Sales | text |
| `ca-unemployment` | Canada Unemployment Rate | text |
| `ca-wcs` | Canada WCS Oil Price | text |
| `ca-wells` | Canada Oil Wells Drilled | text |
| `ca-wti` | Canada WTI Oil Price | text |
| `provincial-overview` | Provincial Overview | textarea |
| `market-provincial-unemployment` | Unemployment Rate | text |
| `market-provincial-key-industries` | Key Industries | textarea |
| `sk-avg-home-price` | SK Average Home Price | currency |
| `sk-avg-rent-2br` | SK Average 2BR Rent | currency |
| `sk-credit-rating` | SK Credit Rating | text |
| `sk-econ-overview` | SK Economic Overview | textarea |
| `sk-gdp-growth` | SK GDP Growth | text |
| `sk-housing-starts` | SK Housing Starts | text |
| `sk-inflation` | SK Inflation Rate | text |
| `sk-oil-price` | SK Oil Price | text |
| `sk-pop-growth` | SK Population Growth | text |
| `sk-potash` | SK Potash Production | text |
| `sk-rental-vacancy` | SK Rental Vacancy Rate | percentage |
| `sk-unemployment` | SK Unemployment Rate | percentage |
| `sk-avgrent-1bed` | SK Avg Rent - 1 Bedroom | currency |
| `sk-avgrent-2bed` | SK Avg Rent - 2 Bedroom | currency |
| `sk-avgrent-3bed` | SK Avg Rent - 3 Bedroom | currency |
| `sk-avgrent-bachelor` | SK Avg Rent - Bachelor | currency |
| `sk-new-supply` | SK New Supply | number |
| `sk-rental-rate-growth` | SK Rental Rate Growth | percentage |
| `sk-supply-growth-rate` | SK Supply Growth Rate | percentage |
| `sk-vacancy-rate` | SK Vacancy Rate | percentage |

## `sales` — 273 candidate fields

| Field ID | Label | Type |
|---|---|---|
| `dca-high-price-per-unit` | High Price/Unit | currency |
| `dca-high-trans-adj` | High Trans Adj % | percentage |
| `dca-high-trans-adj-price` | High Trans Adj Price | currency |
| `dca-high-phys-adj` | High Physical Adj % | percentage |
| `dca-high-final-price` | High Final Price | currency |
| `dca-high-net-adj` | High Net Adj % | percentage |
| `dca-high-gross-adj` | High Gross Adj % | percentage |
| `dca-avg-price-per-unit` | Avg Price/Unit | currency |
| `dca-avg-trans-adj` | Avg Trans Adj % | percentage |
| `dca-avg-trans-adj-price` | Avg Trans Adj Price | currency |
| `dca-avg-phys-adj` | Avg Physical Adj % | percentage |
| `dca-avg-final-price` | Avg Final Price | currency |
| `dca-avg-net-adj` | Avg Net Adj % | percentage |
| `dca-avg-gross-adj` | Avg Gross Adj % | percentage |
| `dca-med-price-per-unit` | Median Price/Unit | currency |
| `dca-med-trans-adj` | Median Trans Adj % | percentage |
| `dca-med-trans-adj-price` | Median Trans Adj Price | currency |
| `dca-med-phys-adj` | Median Physical Adj % | percentage |
| `dca-med-final-price` | Median Final Price | currency |
| `dca-med-net-adj` | Median Net Adj % | percentage |
| `dca-med-gross-adj` | Median Gross Adj % | percentage |
| `dca-low-price-per-unit` | Low Price/Unit | currency |
| `dca-low-trans-adj` | Low Trans Adj % | percentage |
| `dca-low-trans-adj-price` | Low Trans Adj Price | currency |
| `dca-low-phys-adj` | Low Physical Adj % | percentage |
| `dca-low-final-price` | Low Final Price | currency |
| `dca-low-net-adj` | Low Net Adj % | percentage |
| `dca-low-gross-adj` | Low Gross Adj % | percentage |
| `dca-price-per-unit-concluded` | Concluded Price Per Unit | currency |
| `dca-price-per-unit-high` | Price Per Unit High | currency |
| `dca-price-per-unit-low` | Price Per Unit Low | currency |
| `dca-price-per-unit-avg` | Price Per Unit Average | currency |
| `comp1-name` | Property Name | text |
| `comp1-address` | Address | text |
| `comp1-sale-date` | Sale Date | date |
| `comp1-sale-price` | Sale Price | number |
| `comp1-units` | Units | number |
| `comp1-gba` | GBA (SF) | number |
| `comp1-year` | Year Built | number |
| `comp1-cap-rate` | Cap Rate (%) | number |
| `comp1-city` | City | text |
| `comp1-noi` | NOI | currency |
| `comp1-noi-per-unit` | NOI/Unit | currency |
| `comp1-province` | Province | text |
| `comp1-postal-code` | Postal Code | text |
| `comp1-property-rights` | Property Rights | dropdown |
| `comp1-financing` | Financing | text |
| `comp1-sale-conditions` | Conditions of Sale | text |
| `comp1-expenditures-after` | Expenditures After Sale | currency |
| `comp1-market-conditions` | Market Conditions | text |
| `comp1-sale-status` | Sale Status | text |
| `comp1-total-trans-adj` | Total Transactional Adj % | percentage |
| `comp1-adj-price-per-unit` | Adjusted Price/Unit | currency |
| `comp1-occupancy` | Occupancy % | percentage |
| `comp1-location` | Location Rating | select |
| `comp1-access` | Access Rating | select |
| `comp1-exposure` | Exposure Rating | select |
| `comp1-quality` | Quality Rating | select |
| `comp1-condition` | Condition Rating | select |
| `comp1-appeal` | Appeal Rating | select |
| `comp1-parking-type` | Parking Type | dropdown |
| `comp1-proj-amenities` | Project Amenities | text |
| `comp1-unit-amenities` | Unit Amenities | text |
| `comp1-total-phys-adj` | Total Physical Adj % | percentage |
| `comp1-trans-adj-price` | Transactional Adj Price | currency |
| `comp1-net-adj` | Net Adjustment % | percentage |
| `comp1-gross-adj` | Gross Adjustment % | percentage |
| `comp1-adj-property-rights` | Property Rights Adj % | percentage |
| `comp1-adj-financing` | Financing Adj % | percentage |
| `comp1-adj-sale-conditions` | Sale Conditions Adj % | percentage |
| `comp1-adj-market-conditions` | Market Conditions Adj % | percentage |
| `comp1-adj-location` | Location Adj % | percentage |
| `comp1-adj-size` | Size Adj % | percentage |
| `comp1-adj-age-condition` | Age/Condition Adj % | percentage |
| `comp1-adj-other` | Other Adj % | percentage |
| `comp2-name` | Property Name | text |
| `comp2-address` | Address | text |
| `comp2-sale-date` | Sale Date | date |
| `comp2-sale-price` | Sale Price | number |
| `comp2-units` | Units | number |
| `comp2-gba` | GBA (SF) | number |
| `comp2-year` | Year Built | number |
| `comp2-cap-rate` | Cap Rate (%) | number |
| `comp2-city` | City | text |
| `comp2-noi` | NOI | currency |
| `comp2-noi-per-unit` | NOI/Unit | currency |
| `comp2-province` | Province | text |
| `comp2-postal-code` | Postal Code | text |
| `comp2-property-rights` | Property Rights | dropdown |
| `comp2-financing` | Financing | text |
| `comp2-sale-conditions` | Conditions of Sale | text |
| `comp2-expenditures-after` | Expenditures After Sale | currency |
| `comp2-market-conditions` | Market Conditions | text |
| `comp2-sale-status` | Sale Status | text |
| `comp2-total-trans-adj` | Total Transactional Adj % | percentage |
| `comp2-adj-price-per-unit` | Adjusted Price/Unit | currency |
| `comp2-occupancy` | Occupancy % | percentage |
| `comp2-location` | Location Rating | select |
| `comp2-access` | Access Rating | select |
| `comp2-exposure` | Exposure Rating | select |
| `comp2-quality` | Quality Rating | select |
| `comp2-condition` | Condition Rating | select |
| `comp2-appeal` | Appeal Rating | select |
| `comp2-parking-type` | Parking Type | dropdown |
| `comp2-proj-amenities` | Project Amenities | text |
| `comp2-unit-amenities` | Unit Amenities | text |
| `comp2-total-phys-adj` | Total Physical Adj % | percentage |
| `comp2-trans-adj-price` | Transactional Adj Price | currency |
| `comp2-net-adj` | Net Adjustment % | percentage |
| `comp2-gross-adj` | Gross Adjustment % | percentage |
| `comp2-adj-property-rights` | Property Rights Adj % | percentage |
| `comp2-adj-financing` | Financing Adj % | percentage |
| `comp2-adj-sale-conditions` | Sale Conditions Adj % | percentage |
| `comp2-adj-market-conditions` | Market Conditions Adj % | percentage |
| `comp2-adj-location` | Location Adj % | percentage |
| `comp2-adj-size` | Size Adj % | percentage |
| `comp2-adj-age-condition` | Age/Condition Adj % | percentage |
| `comp2-adj-other` | Other Adj % | percentage |
| `comp3-name` | Property Name | text |
| `comp3-address` | Address | text |
| `comp3-sale-date` | Sale Date | date |
| `comp3-sale-price` | Sale Price | number |
| `comp3-units` | Units | number |
| `comp3-gba` | GBA (SF) | number |
| `comp3-year` | Year Built | number |
| `comp3-cap-rate` | Cap Rate (%) | number |
| `comp3-city` | City | text |
| `comp3-noi` | NOI | currency |
| `comp3-noi-per-unit` | NOI/Unit | currency |
| `comp3-province` | Province | text |
| `comp3-postal-code` | Postal Code | text |
| `comp3-property-rights` | Property Rights | dropdown |
| `comp3-financing` | Financing | text |
| `comp3-sale-conditions` | Conditions of Sale | text |
| `comp3-expenditures-after` | Expenditures After Sale | currency |
| `comp3-market-conditions` | Market Conditions | text |
| `comp3-sale-status` | Sale Status | text |
| `comp3-total-trans-adj` | Total Transactional Adj % | percentage |
| `comp3-adj-price-per-unit` | Adjusted Price/Unit | currency |
| `comp3-occupancy` | Occupancy % | percentage |
| `comp3-location` | Location Rating | select |
| `comp3-access` | Access Rating | select |
| `comp3-exposure` | Exposure Rating | select |
| `comp3-quality` | Quality Rating | select |
| `comp3-condition` | Condition Rating | select |
| `comp3-appeal` | Appeal Rating | select |
| `comp3-parking-type` | Parking Type | dropdown |
| `comp3-proj-amenities` | Project Amenities | text |
| `comp3-unit-amenities` | Unit Amenities | text |
| `comp3-total-phys-adj` | Total Physical Adj % | percentage |
| `comp3-trans-adj-price` | Transactional Adj Price | currency |
| `comp3-net-adj` | Net Adjustment % | percentage |
| `comp3-gross-adj` | Gross Adjustment % | percentage |
| `comp3-adj-property-rights` | Property Rights Adj % | percentage |
| `comp3-adj-financing` | Financing Adj % | percentage |
| `comp3-adj-sale-conditions` | Sale Conditions Adj % | percentage |
| `comp3-adj-market-conditions` | Market Conditions Adj % | percentage |
| `comp3-adj-location` | Location Adj % | percentage |
| `comp3-adj-size` | Size Adj % | percentage |
| `comp3-adj-age-condition` | Age/Condition Adj % | percentage |
| `comp3-adj-other` | Other Adj % | percentage |
| `comp4-name` | Property Name | text |
| `comp4-address` | Address | text |
| `comp4-sale-date` | Sale Date | date |
| `comp4-sale-price` | Sale Price | number |
| `comp4-units` | Units | number |
| `comp4-gba` | GBA (SF) | number |
| `comp4-year` | Year Built | number |
| `comp4-cap-rate` | Cap Rate (%) | number |
| `comp4-city` | City | text |
| `comp4-noi` | NOI | currency |
| `comp4-noi-per-unit` | NOI/Unit | currency |
| `comp4-province` | Province | text |
| `comp4-postal-code` | Postal Code | text |
| `comp4-property-rights` | Property Rights | dropdown |
| `comp4-financing` | Financing | text |
| `comp4-sale-conditions` | Conditions of Sale | text |
| `comp4-expenditures-after` | Expenditures After Sale | currency |
| `comp4-market-conditions` | Market Conditions | text |
| `comp4-sale-status` | Sale Status | text |
| `comp4-total-trans-adj` | Total Transactional Adj % | percentage |
| `comp4-adj-price-per-unit` | Adjusted Price/Unit | currency |
| `comp4-occupancy` | Occupancy % | percentage |
| `comp4-location` | Location Rating | select |
| `comp4-access` | Access Rating | select |
| `comp4-exposure` | Exposure Rating | select |
| `comp4-quality` | Quality Rating | select |
| `comp4-condition` | Condition Rating | select |
| `comp4-appeal` | Appeal Rating | select |
| `comp4-parking-type` | Parking Type | dropdown |
| `comp4-proj-amenities` | Project Amenities | text |
| `comp4-unit-amenities` | Unit Amenities | text |
| `comp4-total-phys-adj` | Total Physical Adj % | percentage |
| `comp4-trans-adj-price` | Transactional Adj Price | currency |
| `comp4-net-adj` | Net Adjustment % | percentage |
| `comp4-gross-adj` | Gross Adjustment % | percentage |
| `comp4-adj-property-rights` | Property Rights Adj % | percentage |
| `comp4-adj-financing` | Financing Adj % | percentage |
| `comp4-adj-sale-conditions` | Sale Conditions Adj % | percentage |
| `comp4-adj-market-conditions` | Market Conditions Adj % | percentage |
| `comp4-adj-location` | Location Adj % | percentage |
| `comp4-adj-size` | Size Adj % | percentage |
| `comp4-adj-age-condition` | Age/Condition Adj % | percentage |
| `comp4-adj-other` | Other Adj % | percentage |
| `comp5-name` | Property Name | text |
| `comp5-address` | Address | text |
| `comp5-sale-date` | Sale Date | date |
| `comp5-sale-price` | Sale Price | number |
| `comp5-units` | Units | number |
| `comp5-gba` | GBA (SF) | number |
| `comp5-year` | Year Built | number |
| `comp5-cap-rate` | Cap Rate (%) | number |
| `comp5-city` | City | text |
| `comp5-noi` | NOI | currency |
| `comp5-noi-per-unit` | NOI/Unit | currency |
| `comp5-province` | Province | text |
| `comp5-postal-code` | Postal Code | text |
| `comp5-property-rights` | Property Rights | dropdown |
| `comp5-financing` | Financing | text |
| `comp5-sale-conditions` | Conditions of Sale | text |
| `comp5-expenditures-after` | Expenditures After Sale | currency |
| `comp5-market-conditions` | Market Conditions | text |
| `comp5-sale-status` | Sale Status | text |
| `comp5-total-trans-adj` | Total Transactional Adj % | percentage |
| `comp5-adj-price-per-unit` | Adjusted Price/Unit | currency |
| `comp5-occupancy` | Occupancy % | percentage |
| `comp5-location` | Location Rating | select |
| `comp5-access` | Access Rating | select |
| `comp5-exposure` | Exposure Rating | select |
| `comp5-quality` | Quality Rating | select |
| `comp5-condition` | Condition Rating | select |
| `comp5-appeal` | Appeal Rating | select |
| `comp5-parking-type` | Parking Type | dropdown |
| `comp5-proj-amenities` | Project Amenities | text |
| `comp5-unit-amenities` | Unit Amenities | text |
| `comp5-total-phys-adj` | Total Physical Adj % | percentage |
| `comp5-trans-adj-price` | Transactional Adj Price | currency |
| `comp5-net-adj` | Net Adjustment % | percentage |
| `comp5-gross-adj` | Gross Adjustment % | percentage |
| `comp5-adj-property-rights` | Property Rights Adj % | percentage |
| `comp5-adj-financing` | Financing Adj % | percentage |
| `comp5-adj-sale-conditions` | Sale Conditions Adj % | percentage |
| `comp5-adj-market-conditions` | Market Conditions Adj % | percentage |
| `comp5-adj-location` | Location Adj % | percentage |
| `comp5-adj-size` | Size Adj % | percentage |
| `comp5-adj-age-condition` | Age/Condition Adj % | percentage |
| `comp5-adj-other` | Other Adj % | percentage |
| `sales-indicated-value` | Sales Indicated Value | currency |
| `sales-value-per-sf` | Sales Value Per SF | currency |
| `sales-value-indication` | Sales Comparison Value | number |
| `sales-adjustment-summary` | Adjustment Summary | textarea |
| `sca-adjustedvaluehigh` | SCA Adjusted Value High | currency |
| `sca-adjustedvaluelow` | SCA Adjusted Value Low | currency |
| `sca-adjusted-value-high` | SCA Adjusted Value High | currency |
| `sca-adjusted-value-low` | SCA Adjusted Value Low | currency |
| `sca-concluded-value-per-unit` | SCA Concluded Value Per Unit | currency |
| `sca-concluded-value-per-unit` | Concluded Value/Unit | currency |
| `sca-indicated-value` | SCA Indicated Value | currency |
| `sca-indicated-value-rounded` | SCA Indicated Value (Rounded) | currency |
| `sca-value-per-sf` | SCA Value/SF | currency |
| `subject-units` | Number of Units | number |
| `subject-gba` | Gross Building Area (SF) | number |
| `subject-year` | Year Built | number |
| `subject-site-area` | Site Area (SF) | number |
| `subject-parking` | Parking Ratio | number |
| `subject-condition` | Condition | text |
| `subject-location-rating` | Location Rating | select |
| `subject-access-rating` | Access Rating | select |
| `subject-exposure-rating` | Exposure Rating | select |
| `subject-quality-rating` | Quality Rating | select |
| `subject-appeal-rating` | Appeal Rating | select |
| `subject-proj-amenities` | Project Amenities | text |
| `subject-unit-amenities` | Unit Amenities | text |

## `sales-comparison` — 187 candidate fields

| Field ID | Label | Type |
|---|---|---|
| `comp1-address-full` | Comp1 Address Full | text |
| `comp1-analysis-price-per-unit` | Comp1 Analysis Price Per Unit | currency |
| `comp1-analysis-price` | Comp1 Analysis Price | currency |
| `comp1-buyer` | Comp1 Buyer | text |
| `comp1-city-state-zip` | Comp1 City State Zip | text |
| `comp1-conditions-of-sale` | Comp1 Conditions of Sale | text |
| `comp1-corner` | Comp1 Corner | text |
| `comp1-county` | Comp1 County | text |
| `comp1-distance` | Comp1 Distance | number |
| `comp1-label` | Comp1 Label | text |
| `comp1-landarea` | Comp1 Land Area | number |
| `comp1-laundry` | Comp1 Laundry | text |
| `comp1-map` | Comp1 Map | image |
| `comp1-noi-perunit` | Comp1 NOI Per Unit | currency |
| `comp1-nra` | Comp1 NRA | number |
| `comp1-photo` | Comp1 Photo | image |
| `comp1-property-type` | Comp1 Property Type | text |
| `comp1-remarks` | Comp1 Remarks | text |
| `comp1-renttype` | Comp1 Rent Type | text |
| `comp1-rights-transferred` | Comp1 Rights Transferred | text |
| `comp1-security-features` | Comp1 Security Features | text |
| `comp1-seller` | Comp1 Seller | text |
| `comp1-structures` | Comp1 Structures | number |
| `comp1-submarket` | Comp1 Submarket | text |
| `comp1-transaction-status` | Comp1 Transaction Status | text |
| `comp1-unitmix-avgsize` | Comp1 Unit Mix Avg Size | text |
| `comp1-unitmix-count` | Comp1 Unit Mix Count | text |
| `comp1-unitmix-type` | Comp1 Unit Mix Type | text |
| `comp1-utilities` | Comp1 Utilities | text |
| `comp1-year-built` | Comp1 Year Built | text |
| `comp1-cap-rate` | Comp1 Cap Rate | percentage |
| `comp1-parking-type` | Comp1 Parking Type | text |
| `comp1-price-per-unit` | Comp1 Price Per Unit | currency |
| `comp1-proj-amenities` | Comp1 Project Amenities | text |
| `comp1-property-name` | Comp1 Property Name | text |
| `comp1-sale-date` | Comp1 Sale Date | date |
| `comp1-sale-price` | Comp1 Sale Price | currency |
| `comp1-unit-amenities` | Comp1 Unit Amenities | text |
| `comp1-year-built` | Comp1 Year Built | number |
| `comp2-address-full` | Comp2 Address Full | text |
| `comp2-analysis-price` | Comp2 Analysis Price | currency |
| `comp2-buildings` | Comp2 Buildings | text |
| `comp2-buyer` | Comp2 Buyer | text |
| `comp2-city-state-zip` | Comp2 City State Zip | text |
| `comp2-county` | Comp2 County | text |
| `comp2-distance` | Comp2 Distance | number |
| `comp2-label` | Comp2 Label | text |
| `comp2-landarea` | Comp2 Land Area | number |
| `comp2-laundry` | Comp2 Laundry | text |
| `comp2-map` | Comp2 Map | image |
| `comp2-market-conditions` | Comp2 Market Conditions | text |
| `comp2-nra` | Comp2 NRA | number |
| `comp2-parking` | Comp2 Parking | text |
| `comp2-photo` | Comp2 Photo | image |
| `comp2-property-type` | Comp2 Property Type | text |
| `comp2-remarks` | Comp2 Remarks | text |
| `comp2-renttype` | Comp2 Rent Type | text |
| `comp2-rights-transferred` | Comp2 Rights Transferred | text |
| `comp2-security-features` | Comp2 Security Features | text |
| `comp2-seller` | Comp2 Seller | text |
| `comp2-submarket` | Comp2 Submarket | text |
| `comp2-transaction-status` | Comp2 Transaction Status | text |
| `comp2-unitmix-avgsize` | Comp2 Unit Mix Avg Size | text |
| `comp2-unitmix-count` | Comp2 Unit Mix Count | text |
| `comp2-unitmix-type` | Comp2 Unit Mix Type | text |
| `comp2-utilities` | Comp2 Utilities | text |
| `comp2-year-built` | Comp2 Year Built | text |
| `comp2-zoning` | Comp2 Zoning | text |
| `comp2-cap-rate` | Comp2 Cap Rate | percentage |
| `comp2-parking-type` | Comp2 Parking Type | text |
| `comp2-price-per-unit` | Comp2 Price Per Unit | currency |
| `comp2-property-name` | Comp2 Property Name | text |
| `comp2-sale-date` | Comp2 Sale Date | date |
| `comp2-sale-price` | Comp2 Sale Price | currency |
| `comp2-unit-amenities` | Comp2 Unit Amenities | text |
| `comp2-year-built` | Comp2 Year Built | number |
| `comp3-address-full` | Comp3 Address Full | text |
| `comp3-analysis-price` | Comp3 Analysis Price | currency |
| `comp3-buildings` | Comp3 Buildings | text |
| `comp3-buyer` | Comp3 Buyer | text |
| `comp3-city-state-zip` | Comp3 City State Zip | text |
| `comp3-county` | Comp3 County | text |
| `comp3-distance` | Comp3 Distance | number |
| `comp3-label` | Comp3 Label | text |
| `comp3-landarea` | Comp3 Land Area | number |
| `comp3-laundry` | Comp3 Laundry | text |
| `comp3-map` | Comp3 Map | image |
| `comp3-market-conditions` | Comp3 Market Conditions | text |
| `comp3-nra` | Comp3 NRA | number |
| `comp3-parking` | Comp3 Parking | text |
| `comp3-photo` | Comp3 Photo | image |
| `comp3-property-type` | Comp3 Property Type | text |
| `comp3-remarks` | Comp3 Remarks | text |
| `comp3-renttype` | Comp3 Rent Type | text |
| `comp3-rights-transferred` | Comp3 Rights Transferred | text |
| `comp3-security-features` | Comp3 Security Features | text |
| `comp3-seller` | Comp3 Seller | text |
| `comp3-submarket` | Comp3 Submarket | text |
| `comp3-transaction-status` | Comp3 Transaction Status | text |
| `comp3-unitmix-avgsize` | Comp3 Unit Mix Avg Size | text |
| `comp3-unitmix-count` | Comp3 Unit Mix Count | text |
| `comp3-unitmix-type` | Comp3 Unit Mix Type | text |
| `comp3-utilities` | Comp3 Utilities | text |
| `comp3-year-built` | Comp3 Year Built | text |
| `comp3-zoning` | Comp3 Zoning | text |
| `comp3-cap-rate` | Comp3 Cap Rate | percentage |
| `comp3-parking-type` | Comp3 Parking Type | text |
| `comp3-price-per-unit` | Comp3 Price Per Unit | currency |
| `comp3-property-name` | Comp3 Property Name | text |
| `comp3-sale-date` | Comp3 Sale Date | date |
| `comp3-sale-price` | Comp3 Sale Price | currency |
| `comp3-unit-amenities` | Comp3 Unit Amenities | text |
| `comp3-year-built` | Comp3 Year Built | number |
| `comp4-address-full` | Comp4 Address Full | text |
| `comp4-analysis-price` | Comp4 Analysis Price | currency |
| `comp4-buildings` | Comp4 Buildings | text |
| `comp4-buyer` | Comp4 Buyer | text |
| `comp4-city-state-zip` | Comp4 City State Zip | text |
| `comp4-county` | Comp4 County | text |
| `comp4-distance` | Comp4 Distance | number |
| `comp4-label` | Comp4 Label | text |
| `comp4-landarea` | Comp4 Land Area | number |
| `comp4-laundry` | Comp4 Laundry | text |
| `comp4-map` | Comp4 Map | image |
| `comp4-market-conditions` | Comp4 Market Conditions | text |
| `comp4-nra` | Comp4 NRA | number |
| `comp4-parking` | Comp4 Parking | text |
| `comp4-photo` | Comp4 Photo | image |
| `comp4-property-type` | Comp4 Property Type | text |
| `comp4-remarks` | Comp4 Remarks | text |
| `comp4-renttype` | Comp4 Rent Type | text |
| `comp4-rights-transferred` | Comp4 Rights Transferred | text |
| `comp4-security-features` | Comp4 Security Features | text |
| `comp4-seller` | Comp4 Seller | text |
| `comp4-submarket` | Comp4 Submarket | text |
| `comp4-transaction-status` | Comp4 Transaction Status | text |
| `comp4-unitmix-avgsize` | Comp4 Unit Mix Avg Size | text |
| `comp4-unitmix-count` | Comp4 Unit Mix Count | text |
| `comp4-unitmix-type` | Comp4 Unit Mix Type | text |
| `comp4-utilities` | Comp4 Utilities | text |
| `comp4-year-built` | Comp4 Year Built | text |
| `comp4-zoning` | Comp4 Zoning | text |
| `comp4-cap-rate` | Comp4 Cap Rate | percentage |
| `comp4-parking-type` | Comp4 Parking Type | text |
| `comp4-price-per-unit` | Comp4 Price Per Unit | currency |
| `comp4-property-name` | Comp4 Property Name | text |
| `comp4-sale-date` | Comp4 Sale Date | date |
| `comp4-sale-price` | Comp4 Sale Price | currency |
| `comp4-unit-amenities` | Comp4 Unit Amenities | text |
| `comp4-year-built` | Comp4 Year Built | number |
| `comp5-address-full` | Comp5 Address Full | text |
| `comp5-analysis-price` | Comp5 Analysis Price | currency |
| `comp5-buildings` | Comp5 Buildings | text |
| `comp5-buyer` | Comp5 Buyer | text |
| `comp5-city-state-zip` | Comp5 City State Zip | text |
| `comp5-county` | Comp5 County | text |
| `comp5-distance` | Comp5 Distance | number |
| `comp5-label` | Comp5 Label | text |
| `comp5-landarea` | Comp5 Land Area | number |
| `comp5-laundry` | Comp5 Laundry | text |
| `comp5-map` | Comp5 Map | image |
| `comp5-market-conditions` | Comp5 Market Conditions | text |
| `comp5-nra` | Comp5 NRA | number |
| `comp5-parking` | Comp5 Parking | text |
| `comp5-photo` | Comp5 Photo | image |
| `comp5-property-type` | Comp5 Property Type | text |
| `comp5-remarks` | Comp5 Remarks | text |
| `comp5-renttype` | Comp5 Rent Type | text |
| `comp5-rights-transferred` | Comp5 Rights Transferred | text |
| `comp5-security-features` | Comp5 Security Features | text |
| `comp5-seller` | Comp5 Seller | text |
| `comp5-submarket` | Comp5 Submarket | text |
| `comp5-transaction-status` | Comp5 Transaction Status | text |
| `comp5-unitmix-avgsize` | Comp5 Unit Mix Avg Size | text |
| `comp5-unitmix-count` | Comp5 Unit Mix Count | text |
| `comp5-unitmix-type` | Comp5 Unit Mix Type | text |
| `comp5-utilities` | Comp5 Utilities | text |
| `comp5-year-built` | Comp5 Year Built | text |
| `comp5-zoning` | Comp5 Zoning | text |
| `comp5-cap-rate` | Comp5 Cap Rate | percentage |
| `comp5-parking-type` | Comp5 Parking Type | text |
| `comp5-price-per-unit` | Comp5 Price Per Unit | currency |
| `comp5-property-name` | Comp5 Property Name | text |
| `comp5-sale-date` | Comp5 Sale Date | date |
| `comp5-sale-price` | Comp5 Sale Price | currency |
| `comp5-unit-amenities` | Comp5 Unit Amenities | text |
| `comp5-year-built` | Comp5 Year Built | number |

## `cost` — 32 candidate fields

| Field ID | Label | Type |
|---|---|---|
| `cost-depr-physical-age` | Actual Age | number |
| `cost-depr-physical-life` | Economic Life | number |
| `cost-depr-physical-effective-age` | Effective Age | number |
| `cost-depr-physical-remaining-life` | Remaining Life | number |
| `cost-depr-physical-pct` | Physical Depr % | percentage |
| `cost-depr-physical-amt` | Physical Depr $ | currency |
| `cost-depr-functional-total` | Functional Obsolescence | currency |
| `cost-depr-external-total` | External Obsolescence | currency |
| `cost-depr-total-amt` | Total Depreciation | currency |
| `cost-depr-total-pct` | Depreciation % | percentage |
| `cost-land-sf` | Land Area (SF) | number |
| `cost-land-rate-per-sf` | Rate per SF | currency |
| `cost-land-value` | Land Value | currency |
| `cost-rcn-gba` | Building GBA | number |
| `cost-rcn-rate-per-sf` | Cost per SF | currency |
| `cost-rcn-indirect-pct` | Indirect Costs % | percentage |
| `cost-rcn-entrepreneur-pct` | Entrepreneur Profit % | percentage |
| `cost-rcn-direct-costs` | Direct Costs | currency |
| `cost-rcn-indirect-costs` | Indirect Costs | currency |
| `cost-rcn-entrepreneur-amt` | Entrepreneur Amount | currency |
| `cost-rcn-total` | Total RCN | currency |
| `cost-site-parking-spaces` | Parking Spaces | number |
| `cost-site-parking-cost` | Cost per Space | currency |
| `cost-site-parking-total` | Parking Total | currency |
| `cost-site-landscaping` | Landscaping | currency |
| `cost-site-paving` | Paving | currency |
| `cost-site-utilities` | Utilities | currency |
| `cost-site-other` | Other Site | currency |
| `cost-site-total` | Total Site Improvements | currency |
| `cost-depreciated-value` | Depreciated Value | currency |
| `cost-indicated-value` | Indicated Value | currency |
| `cost-approach-applied` | Approach Applied | boolean |

## `cost-s` — 1 candidate fields

| Field ID | Label | Type |
|---|---|---|
| `cost-approach-conclusion` | Cost Approach Conclusion | textarea |

## `land1` — 1 candidate fields

| Field ID | Label | Type |
|---|---|---|
| `land-value-conclusion` | Land Value Conclusion | textarea |

## `recon` — 15 candidate fields

| Field ID | Label | Type |
|---|---|---|
| `recon-final-value` | Final Value | number |
| `recon-value-premise` | Value Premise | text |
| `recon-effective-date` | Effective Date | date |
| `recon-final-value-per-unit` | Final Value/Unit | currency |
| `recon-final-value-per-sf` | Final Value/SF | currency |
| `final-value-conclusion` | Final Value Conclusion | currency |
| `use-dcf-methodology` | Use DCF Methodology | select |
| `property-is-listed` | Property Currently Listed | select |
| `recon-narrative` | Reconciliation Narrative | textarea |
| `recon-income-weight` | Income Weight (%) | number |
| `recon-sales-weight` | Sales Weight (%) | number |
| `recon-cost-weight` | Cost Weight (%) | number |
| `recon-income-value` | Income Approach Value | number |
| `recon-sales-value` | Sales Comparison Value | number |
| `recon-cost-value` | Cost Approach Value | number |

## `cert` — 36 candidate fields

| Field ID | Label | Type |
|---|---|---|
| `appraiser-bio-paragraph1` | Appraiser Bio Paragraph 1 | textarea |
| `appraiser-bio-paragraph2` | Appraiser Bio Paragraph 2 | textarea |
| `appraiser-headshot` | Appraiser Headshot | image |
| `appraiser-rics` | RICS Membership Number | text |
| `cert-statement-1` | Statement 1 | textarea |
| `cert-statement-2` | Statement 2 | textarea |
| `cert-statement-3` | Statement 3 | textarea |
| `cert-statement-4` | Statement 4 | textarea |
| `cert-statement-5` | Statement 5 | textarea |
| `cert-statement-6` | Statement 6 | textarea |
| `cert-statement-7` | Statement 7 | textarea |
| `cert-statement-8` | Statement 8 | textarea |
| `cert-statement-9` | Statement 9 | textarea |
| `cert-statement-10` | Statement 10 | textarea |
| `cert-statement-11` | Statement 11 | textarea |
| `cert-statement-12` | Statement 12 | textarea |
| `appraiser1-allunits` | Appraiser 1 Inspected All Units | boolean |
| `appraiser1-extent` | Appraiser 1 Inspection Extent | text |
| `appraiser1-inspected` | Appraiser 1 Inspected Property | boolean |
| `appraiser1-inspectiondate` | Appraiser 1 Inspection Date | date |
| `appraiser1-role` | Appraiser 1 Role | dropdown |
| `appraiser2-allunits` | Appraiser 2 Inspected All Units | boolean |
| `appraiser2-extent` | Appraiser 2 Inspection Extent | text |
| `appraiser2-inspected` | Appraiser 2 Inspected Property | boolean |
| `appraiser2-inspectiondate` | Appraiser 2 Inspection Date | date |
| `appraiser2-role` | Appraiser 2 Role | dropdown |
| `appraiser1-inspector` | Appraiser 1 Inspected Property | boolean |
| `appraiser1-ce` | Appraiser 1 CE Completed | boolean |
| `appraiser1-ethics` | Appraiser 1 Ethics Completed | boolean |
| `appraiser2-inspector` | Appraiser 2 Inspected Property | boolean |
| `appraiser2-ce` | Appraiser 2 CE Completed | boolean |
| `appraiser2-ethics` | Appraiser 2 Ethics Completed | boolean |
| `cert-signature` | Signature Image | image |
| `cert-sign-name` | Appraiser Name | text |
| `cert-sign-credentials` | Credentials | text |
| `cert-sign-date` | Signature Date | date |

---

# PART B — Computed / derived — 597

Calc-engine outputs (`calc` / `calc-output` sections) and `calculated`-type fields. Products of Part-A inputs — generally NOT registry entries. Listed for completeness.

## `exec` — 1 computed fields

| Field ID | Label | Type |
|---|---|---|
| `concluded-value` | Concluded Value | calculated |

## `sales` — 10 computed fields

| Field ID | Label | Type |
|---|---|---|
| `comp1-price-per-unit` | Price/Unit | calculated |
| `comp1-price-per-sf` | Price/SF | calculated |
| `comp2-price-per-unit` | Price/Unit | calculated |
| `comp2-price-per-sf` | Price/SF | calculated |
| `comp3-price-per-unit` | Price/Unit | calculated |
| `comp3-price-per-sf` | Price/SF | calculated |
| `comp4-price-per-unit` | Price/Unit | calculated |
| `comp4-price-per-sf` | Price/SF | calculated |
| `comp5-price-per-unit` | Price/Unit | calculated |
| `comp5-price-per-sf` | Price/SF | calculated |

## `calc` — 245 computed fields

| Field ID | Label | Type |
|---|---|---|
| `calc-adj-capex` | CapEx Adjustment | number |
| `calc-adj-leasing` | Leasing Costs | number |
| `calc-adj-other` | Other Adjustments | number |
| `calc-adj-total` | Total Adjustments | calculated |
| `calc-cap-rate` | Cap Rate (%) | number |
| `cap-rate-average` | Cap Rate Average | percentage |
| `cap-rate-range-high` | Cap Rate Range High | percentage |
| `cap-rate-range-low` | Cap Rate Range Low | percentage |
| `dircap-blend` | Cap Rate Blend | percentage |
| `dircap-cap-rate1` | Capitalization Rate 1 | percentage |
| `dircap-cap-rate2` | Capitalization Rate 2 | percentage |
| `calc-expense-ratio-egr` | Expense Ratio (% of EGR) | percentage |
| `calc-expense-ratio-pgr` | Expense Ratio (% of PGR) | percentage |
| `calc-exp-management` | Management | number |
| `calc-exp-taxes` | Real Estate Taxes | number |
| `calc-exp-insurance` | Insurance | number |
| `calc-exp-repairs` | Repairs & Maintenance | number |
| `calc-exp-utilities` | Utilities | number |
| `calc-exp-payroll` | Payroll | number |
| `calc-exp-admin` | Admin & General | number |
| `calc-exp-reserves` | Replacement Reserves | number |
| `calc-exp-other` | Other Expenses | number |
| `dircap-expense-ratio` | Expense Ratio | percentage |
| `dircap-expense01-label` | Expense Line 01 | text |
| `dircap-expense02-label` | Expense Line 02 | text |
| `dircap-expense03-label` | Expense Line 03 | text |
| `dircap-expense04-label` | Expense Line 04 | text |
| `dircap-expense05-label` | Expense Line 05 | text |
| `dircap-expense06-label` | Expense Line 06 | text |
| `dircap-expense07-label` | Expense Line 07 | text |
| `dircap-expense08-label` | Expense Line 08 | text |
| `dircap-expense09-label` | Expense Line 09 | text |
| `dircap-expense10-label` | Expense Line 10 | text |
| `dircap-expense11-label` | Expense Line 11 | text |
| `dircap-expense12-label` | Expense Line 12 | text |
| `dircap-expense13-label` | Expense Line 13 | text |
| `dircap-expense14-label` | Expense Line 14 | text |
| `dircap-expense15-label` | Expense Line 15 | text |
| `dircap-expense16-label` | Expense Line 16 | text |
| `dircap-expense17-label` | Expense Line 17 | text |
| `dircap-expense18-label` | Expense Line 18 | text |
| `dircap-expense19-label` | Expense Line 19 | text |
| `dircap-expense20-label` | Expense Line 20 | text |
| `dircap-expense21-label` | Expense Line 21 | text |
| `dircap-expense22-label` | Expense Line 22 | text |
| `dircap-expense23-label` | Expense Line 23 | text |
| `dircap-expense24-label` | Expense Line 24 | text |
| `dircap-expense25-label` | Expense Line 25 | text |
| `calc-exp-taxes-pct-pgr` | Taxes % of PGR | percentage |
| `calc-exp-taxes-pct-egr` | Taxes % of EGR | percentage |
| `calc-exp-taxes-per-unit` | Taxes/Unit | currency |
| `calc-exp-taxes-per-sf` | Taxes/SF | number |
| `calc-exp-taxes-annual` | Taxes Annual | currency |
| `calc-exp-insurance-pct-pgr` | Insurance % of PGR | percentage |
| `calc-exp-insurance-pct-egr` | Insurance % of EGR | percentage |
| `calc-exp-insurance-per-unit` | Insurance/Unit | currency |
| `calc-exp-insurance-per-sf` | Insurance/SF | number |
| `calc-exp-insurance-annual` | Insurance Annual | currency |
| `calc-exp-repairs-pct-pgr` | Repairs % of PGR | percentage |
| `calc-exp-repairs-pct-egr` | Repairs % of EGR | percentage |
| `calc-exp-repairs-per-unit` | Repairs/Unit | currency |
| `calc-exp-repairs-per-sf` | Repairs/SF | number |
| `calc-exp-repairs-annual` | Repairs Annual | currency |
| `calc-exp-payroll-pct-pgr` | Payroll % of PGR | percentage |
| `calc-exp-payroll-pct-egr` | Payroll % of EGR | percentage |
| `calc-exp-payroll-per-unit` | Payroll/Unit | currency |
| `calc-exp-payroll-per-sf` | Payroll/SF | number |
| `calc-exp-payroll-annual` | Payroll Annual | currency |
| `calc-exp-utilities-pct-pgr` | Utilities % of PGR | percentage |
| `calc-exp-utilities-pct-egr` | Utilities % of EGR | percentage |
| `calc-exp-utilities-per-unit` | Utilities/Unit | currency |
| `calc-exp-utilities-per-sf` | Utilities/SF | number |
| `calc-exp-utilities-annual` | Utilities Annual | currency |
| `calc-exp-management-pct-pgr` | Management % of PGR | percentage |
| `calc-exp-management-pct-egr` | Management % of EGR | percentage |
| `calc-exp-management-per-unit` | Management/Unit | currency |
| `calc-exp-management-per-sf` | Management/SF | number |
| `calc-exp-management-annual` | Management Annual | currency |
| `calc-exp-other-pct-pgr` | Other % of PGR | percentage |
| `calc-exp-other-pct-egr` | Other % of EGR | percentage |
| `calc-exp-other-per-unit` | Other/Unit | currency |
| `calc-exp-other-per-sf` | Other/SF | number |
| `calc-exp-other-annual` | Other Annual | currency |
| `calc-expenses-total` | Total Expenses | calculated |
| `calc-expense-ratio` | Expense Ratio (%) | calculated |
| `calc-expenses-per-unit` | Expenses Per Unit | calculated |
| `calc-expenses-per-sf` | Expenses Per SF | calculated |
| `calc-exp-reserves-annual` | Reserves Annual | currency |
| `calc-exp-reserves-pct-egr` | Reserves % EGR | percentage |
| `calc-exp-reserves-per-sf` | Reserves Per SF | currency |
| `calc-exp-reserves-per-unit` | Reserves Per Unit | currency |
| `exp-insurance-proj-pct` | Insurance Projection % | percentage |
| `exp-management-proj-pct` | Management Projection % | percentage |
| `exp-other-proj-pct` | Other Expenses Projection % | percentage |
| `exp-repairs-proj-pct` | Repairs Projection % | percentage |
| `exp-reserves-comment` | Reserves Comment | textarea |
| `exp-reserves-proj-pct` | Reserves Projection % | percentage |
| `exp-taxes-proj-pct` | Taxes Projection % | percentage |
| `exp-utilities-proj-pct` | Utilities Projection % | percentage |
| `calc-avg-cont-v-market` | Avg Contract vs Market % | percentage |
| `calc-avg-contract-rent` | Avg Contract Rent | currency |
| `calc-avg-market-rent` | Avg Market Rent | currency |
| `calc-subtotal-annual` | Subtotal Revenue Annual | currency |
| `calc-subtotal-per-sf` | Subtotal Revenue Per SF | currency |
| `calc-subtotal-per-unit` | Subtotal Revenue Per Unit | currency |
| `calc-parking-per-unit` | Parking $/Unit/Mo | number |
| `calc-parking-total` | Parking Annual | calculated |
| `calc-laundry-per-unit` | Laundry $/Unit/Mo | number |
| `calc-laundry-total` | Laundry Annual | calculated |
| `calc-other-income` | Other Income Annual | number |
| `calc-total-other-income` | Total Other Income | calculated |
| `dircap-rent-total` | Total Rental Revenue | currency |
| `dircap-reimb-total` | Reimbursement Total | currency |
| `dircap-misc-total` | Miscellaneous Income Total | currency |
| `calc-pgr` | Potential Gross Revenue | calculated |
| `calc-pgr-per-unit` | PGR Per Unit | calculated |
| `calc-pgr-per-sf` | PGR Per SF | calculated |
| `calc-laundry-annual` | Laundry Revenue Annual | currency |
| `calc-laundry-pct-egr` | Laundry % of EGR | percentage |
| `calc-laundry-pct-pgr` | Laundry % of PGR | percentage |
| `calc-laundry-pct-prr` | Laundry % of Rental Revenue | percentage |
| `calc-laundry-per-sf` | Laundry Per SF | currency |
| `calc-other-rev-annual` | Other Revenue Annual | currency |
| `calc-other-rev-pct-egr` | Other Revenue % of EGR | percentage |
| `calc-other-rev-pct-pgr` | Other Revenue % of PGR | percentage |
| `calc-other-rev-pct-prr` | Other Revenue % of Rental Revenue | percentage |
| `calc-other-rev-per-sf` | Other Revenue Per SF | currency |
| `calc-other-rev-per-unit` | Other Revenue Per Unit | currency |
| `calc-parking-annual` | Parking Revenue Annual | currency |
| `calc-parking-pct-egr` | Parking % of EGR | percentage |
| `calc-parking-pct-pgr` | Parking % of PGR | percentage |
| `calc-parking-pct-prr` | Parking % of Rental Revenue | percentage |
| `calc-parking-per-sf` | Parking Revenue Per SF | currency |
| `calc-other-revenue-laundry` | Laundry Revenue | currency |
| `calc-other-revenue-parking` | Parking Revenue | currency |
| `calc-other-revenue-per-unit` | Other Revenue Per Unit | currency |
| `calc-total-other-revenue` | Total Other Revenue | currency |
| `laundry-proj-pct` | Laundry Projection % | percentage |
| `other-revenue-proj-pct` | Other Revenue Projection % | percentage |
| `parking-proj-pct` | Parking Projection % | percentage |
| `calc-mf-annual` | Multifamily Revenue Annual | currency |
| `calc-mf-pct-egr` | Multifamily % of EGR | percentage |
| `calc-mf-pct-pgr` | Multifamily % of PGR | percentage |
| `calc-mf-pct-prr` | Multifamily % of Rental Revenue | percentage |
| `calc-mf-per-sf` | Multifamily Revenue Per SF | currency |
| `calc-mf-per-unit` | Multifamily Revenue Per Unit | currency |
| `calc-rental-rev-annual` | Rental Revenue Annual | currency |
| `calc-rental-rev-per-sf` | Rental Revenue Per SF | currency |
| `calc-rental-rev-per-unit` | Rental Revenue Per Unit | currency |
| `calc-noi` | Net Operating Income | calculated |
| `calc-noi-per-unit` | NOI/Unit | calculated |
| `calc-noi-per-sf` | NOI/SF | calculated |
| `calc-raw-value` | Raw Value | calculated |
| `calc-indicated-value` | Indicated Value | calculated |
| `calc-value-per-unit` | Value/Unit | calculated |
| `calc-value-per-sf` | Value/SF | calculated |
| `calc-grm` | GRM | calculated |
| `rental-revenue-proj-pct` | Rental Revenue Projection % | percentage |
| `calc-revenue-multifamily-pct-pgr` | Multifamily Revenue % PGR | percentage |
| `calc-revenue-rental-pct-pgr` | Rental Revenue % PGR | percentage |
| `calc-revenue-parking-pct-pgr` | Parking Revenue % PGR | percentage |
| `calc-revenue-laundry-pct-pgr` | Laundry Revenue % PGR | percentage |
| `calc-revenue-misc-pct-pgr` | Misc Revenue % PGR | percentage |
| `calc-pgr-pct-pgr` | PGR % PGR | percentage |
| `calc-egr-pct-pgr` | EGR % PGR | percentage |
| `calc-noi-pct-pgr` | NOI % PGR | percentage |
| `calc-type1-name` | Unit Type 1 | text |
| `calc-type1-count` | Unit Count | number |
| `calc-type1-sf` | Avg SF | number |
| `calc-type1-rent` | Market Rent/Mo | number |
| `calc-type1-annual` | Annual Revenue | calculated |
| `calc-type1-contract-rent` | Contract Rent/Mo | currency |
| `calc-type1-cont-v-market` | Contract vs Market % | percentage |
| `calc-type1-per-unit` | Revenue/Unit | currency |
| `calc-type1-per-sf` | Revenue/SF | number |
| `calc-type2-name` | Unit Type 2 | text |
| `calc-type2-count` | Unit Count | number |
| `calc-type2-sf` | Avg SF | number |
| `calc-type2-rent` | Market Rent/Mo | number |
| `calc-type2-annual` | Annual Revenue | calculated |
| `calc-type2-contract-rent` | Contract Rent/Mo | currency |
| `calc-type2-cont-v-market` | Contract vs Market % | percentage |
| `calc-type2-per-unit` | Revenue/Unit | currency |
| `calc-type2-per-sf` | Revenue/SF | number |
| `calc-type3-name` | Unit Type 3 | text |
| `calc-type3-count` | Unit Count | number |
| `calc-type3-sf` | Avg SF | number |
| `calc-type3-rent` | Market Rent/Mo | number |
| `calc-type3-annual` | Annual Revenue | calculated |
| `calc-type3-contract-rent` | Contract Rent/Mo | currency |
| `calc-type3-cont-v-market` | Contract vs Market % | percentage |
| `calc-type3-per-unit` | Revenue/Unit | currency |
| `calc-type3-per-sf` | Revenue/SF | number |
| `calc-type4-name` | Unit Type 4 | text |
| `calc-type4-count` | Unit Count | number |
| `calc-type4-sf` | Avg SF | number |
| `calc-type4-rent` | Market Rent/Mo | number |
| `calc-type4-annual` | Annual Revenue | calculated |
| `calc-type4-contract-rent` | Contract Rent/Mo | currency |
| `calc-type4-cont-v-market` | Contract vs Market % | percentage |
| `calc-type4-per-unit` | Revenue/Unit | currency |
| `calc-type4-per-sf` | Revenue/SF | number |
| `calc-total-units` | Total Units | calculated |
| `calc-total-sf` | Total SF | calculated |
| `calc-avg-unit-sf` | Avg Unit SF | calculated |
| `calc-total-rental-revenue` | Total Rental Revenue | calculated |
| `calc-avg-rent-per-unit` | Avg Rent/Unit | calculated |
| `calc-avg-rent-per-sf` | Avg Rent/SF | calculated |
| `unitmix-gba-avgsize` | GBA Average Size | number |
| `unitmix-gba-units` | GBA Total Units | number |
| `unitmix-nra-avgsize` | NRA Average Size | number |
| `unitmix-nra-units` | NRA Total Units | number |
| `unitmix-total-pct` | Unit Mix Total % | percentage |
| `calc-vacancy-rate` | Vacancy Rate (%) | number |
| `calc-bad-debt-rate` | Bad Debt Rate (%) | number |
| `calc-concessions-rate` | Concessions Rate (%) | number |
| `dircap-vacancy-total` | Vacancy Total | currency |
| `dircap-concession-total` | Concession Total | currency |
| `dircap-loss-total` | Total Loss | currency |
| `calc-vacancy-loss` | Total Vacancy & Loss | calculated |
| `calc-egr` | Effective Gross Revenue | calculated |
| `calc-egr-per-unit` | EGR Per Unit | calculated |
| `calc-egr-per-sf` | EGR Per SF | calculated |
| `calc-total-vacancy-loss` | Total Vacancy Loss | currency |
| `calc-total-vacancy-pct-egr` | Total Vacancy % of EGR | percentage |
| `calc-total-vacancy-pct-pgr` | Total Vacancy % of PGR | percentage |
| `calc-total-vacancy-per-sf` | Total Vacancy Per SF | currency |
| `calc-total-vacancy-per-unit` | Total Vacancy Per Unit | currency |
| `calc-vacancy-pct-egr` | Vacancy % of EGR | percentage |
| `calc-vacancy-pct-pgr` | Vacancy % of PGR | percentage |
| `calc-indicated-value-rounded` | Indicated Value (Rounded) | currency |
| `calc-other-income-per-sf` | Other Income Per SF | currency |
| `calc-other-income-per-unit` | Other Income Per Unit | currency |
| `calc-rental-revenue-per-unit` | Rental Revenue Per Unit | currency |
| `calc-type-total-per-sf` | Type Total Per SF | currency |
| `calc-type-total-per-unit` | Type Total Per Unit | currency |
| `calc-vacancy-per-sf` | Vacancy Per SF | currency |
| `calc-vacancy-per-unit` | Vacancy Per Unit | currency |
| `exp-taxes-comment` | Taxes Comment | text |
| `exp-insurance-comment` | Insurance Comment | text |
| `exp-repairs-comment` | Repairs Comment | text |
| `exp-payroll-comment` | Payroll Comment | text |
| `exp-utilities-comment` | Utilities Comment | text |
| `exp-management-comment` | Management Comment | text |
| `exp-other-comment` | Other Comment | text |

## `calc-output` — 341 computed fields

| Field ID | Label | Type |
|---|---|---|
| `contract-vs-market-percentage` | Contract vs Market % | percentage |
| `contractvsmarket-1bed-actualrent` | 1BR Actual Rent | currency |
| `contractvsmarket-1bed-askingrent` | 1BR Asking Rent | currency |
| `contractvsmarket-1bed-concludedrent` | 1BR Concluded Rent | currency |
| `contractvsmarket-1bed-percentage` | 1BR Percentage | percentage |
| `contractvsmarket-1bed-units` | 1BR Units | number |
| `contractvsmarket-2bed-actualrent` | 2BR Actual Rent | currency |
| `contractvsmarket-2bed-askingrent` | 2BR Asking Rent | currency |
| `contractvsmarket-2bed-concludedrent` | 2BR Concluded Rent | currency |
| `contractvsmarket-2bed-percentage` | 2BR Percentage | percentage |
| `contractvsmarket-2bed-units` | 2BR Units | number |
| `contractvsmarket-total-actualrent` | Total Actual Rent | currency |
| `contractvsmarket-total-askingrent` | Total Asking Rent | currency |
| `contractvsmarket-total-concludedrent` | Total Concluded Rent | currency |
| `contractvsmarket-total-percentage` | Total Percentage | percentage |
| `contractvsmarket-total-units` | Total Units | number |
| `subject-currentrent` | Current Rent | currency |
| `hist-exp-taxes-total` | Taxes | currency |
| `hist-exp-taxes-per-unit` | Taxes/Unit | currency |
| `hist-exp-taxes-pct-pgr` | Taxes % PGR | percentage |
| `hist-exp-insurance-total` | Insurance | currency |
| `hist-exp-insurance-per-unit` | Insurance/Unit | currency |
| `hist-exp-insurance-pct-pgr` | Insurance % PGR | percentage |
| `hist-exp-repairs-total` | Repairs & Maintenance | currency |
| `hist-exp-repairs-per-unit` | Repairs/Unit | currency |
| `hist-exp-repairs-pct-pgr` | Repairs % PGR | percentage |
| `hist-exp-payroll-total` | Payroll | currency |
| `hist-exp-payroll-per-unit` | Payroll/Unit | currency |
| `hist-exp-payroll-pct-pgr` | Payroll % PGR | percentage |
| `hist-exp-utilities-total` | Utilities | currency |
| `hist-exp-utilities-per-unit` | Utilities/Unit | currency |
| `hist-exp-utilities-pct-pgr` | Utilities % PGR | percentage |
| `hist-exp-management-total` | Management | currency |
| `hist-exp-management-per-unit` | Management/Unit | currency |
| `hist-exp-management-pct-pgr` | Management % PGR | percentage |
| `hist-exp-other-total` | Other Expenses | currency |
| `hist-exp-other-per-unit` | Other/Unit | currency |
| `hist-exp-other-pct-pgr` | Other % PGR | percentage |
| `hist-exp-total-total` | Total Expenses | currency |
| `hist-exp-total-per-unit` | Total Expenses/Unit | currency |
| `hist-exp-total-pct-pgr` | Total Expenses % PGR | percentage |
| `hist-exp-reserves-pct-pgr` | Historical Reserves % PGR | percentage |
| `hist-exp-reserves-per-unit` | Historical Reserves Per Unit | currency |
| `hist-exp-reserves-total` | Historical Reserves Total | currency |
| `hist-expenses-pct-pgr` | Historical Expenses % PGR | percentage |
| `hist-expenses-per-unit` | Historical Expenses Per Unit | currency |
| `hist-expenses-total` | Historical Expenses Total | currency |
| `hist-noi-total` | NOI | currency |
| `hist-noi-per-unit` | NOI/Unit | currency |
| `hist-noi-pct-pgr` | NOI % PGR | percentage |
| `hist-revenue-multifamily-total` | Multifamily Revenue | currency |
| `hist-revenue-multifamily-per-unit` | Multifamily Revenue/Unit | currency |
| `hist-revenue-multifamily-pct-pgr` | Multifamily Revenue % PGR | percentage |
| `hist-revenue-rental-total` | Rental Revenue | currency |
| `hist-revenue-rental-per-unit` | Rental Revenue/Unit | currency |
| `hist-revenue-rental-pct-pgr` | Rental Revenue % PGR | percentage |
| `hist-revenue-parking-total` | Parking Revenue | currency |
| `hist-revenue-parking-per-unit` | Parking Revenue/Unit | currency |
| `hist-revenue-parking-pct-pgr` | Parking Revenue % PGR | percentage |
| `hist-revenue-laundry-total` | Laundry Revenue | currency |
| `hist-revenue-laundry-per-unit` | Laundry Revenue/Unit | currency |
| `hist-revenue-laundry-pct-pgr` | Laundry Revenue % PGR | percentage |
| `hist-revenue-misc-total` | Misc Revenue | currency |
| `hist-revenue-misc-per-unit` | Misc Revenue/Unit | currency |
| `hist-revenue-misc-pct-pgr` | Misc Revenue % PGR | percentage |
| `hist-pgr-total` | PGR Total | currency |
| `hist-pgr-per-unit` | PGR/Unit | currency |
| `hist-pgr-pct` | PGR % | percentage |
| `hist-revenue-other-pct-pgr` | Historical Other Revenue % PGR | percentage |
| `hist-revenue-other-per-unit` | Historical Other Revenue Per Unit | currency |
| `hist-revenue-other-total` | Historical Other Revenue Total | currency |
| `hist-vacancy-total` | Vacancy Loss | currency |
| `hist-vacancy-per-unit` | Vacancy/Unit | currency |
| `hist-vacancy-pct-pgr` | Vacancy % PGR | percentage |
| `hist-egr-total` | EGR Total | currency |
| `hist-egr-per-unit` | EGR/Unit | currency |
| `hist-egr-pct-pgr` | EGR % PGR | percentage |
| `market-rent-1bed-avg-rentsf` | 1BR Avg Rent/SF | currency |
| `market-rent-1bed-avg-rentsf-unadj` | 1BR Avg Rent/SF (Unadj) | currency |
| `market-rent-1bed-avg-rentunit` | 1BR Avg Rent/Unit | currency |
| `market-rent-1bed-avg-unitsize` | 1BR Avg Unit Size | number |
| `market-rent-1bed-comp1-rentsf` | 1BR Comp1 Rent/SF | currency |
| `market-rent-1bed-comp1-rentsf-unadj` | 1BR Comp1 Rent/SF (Unadj) | currency |
| `market-rent-1bed-comp1-rentunit` | 1BR Comp1 Rent/Unit | currency |
| `market-rent-1bed-comp1-unitsize` | 1BR Comp1 Unit Size | number |
| `market-rent-1bed-comp2-rentsf` | 1BR Comp2 Rent/SF | currency |
| `market-rent-1bed-comp2-rentsf-unadj` | 1BR Comp2 Rent/SF (Unadj) | currency |
| `market-rent-1bed-comp2-rentunit` | 1BR Comp2 Rent/Unit | currency |
| `market-rent-1bed-comp2-unitsize` | 1BR Comp2 Unit Size | number |
| `market-rent-1bed-comp3-rentsf` | 1BR Comp3 Rent/SF | currency |
| `market-rent-1bed-comp3-rentsf-unadj` | 1BR Comp3 Rent/SF (Unadj) | currency |
| `market-rent-1bed-comp3-rentunit` | 1BR Comp3 Rent/Unit | currency |
| `market-rent-1bed-comp3-unitsize` | 1BR Comp3 Unit Size | number |
| `market-rent-1bed-comp4-rentsf` | 1BR Comp4 Rent/SF | currency |
| `market-rent-1bed-comp4-rentsf-unadj` | 1BR Comp4 Rent/SF (Unadj) | currency |
| `market-rent-1bed-comp4-rentunit` | 1BR Comp4 Rent/Unit | currency |
| `market-rent-1bed-comp4-unitsize` | 1BR Comp4 Unit Size | number |
| `market-rent-1bed-comp5-rentsf` | 1BR Comp5 Rent/SF | currency |
| `market-rent-1bed-comp5-rentsf-unadj` | 1BR Comp5 Rent/SF (Unadj) | currency |
| `market-rent-1bed-comp5-rentunit` | 1BR Comp5 Rent/Unit | currency |
| `market-rent-1bed-comp5-unitsize` | 1BR Comp5 Unit Size | number |
| `market-rent-1bed-concluded` | 1BR Concluded Rent | currency |
| `market-rent-1bed-concluded-sf` | 1BR Concluded Rent/SF | currency |
| `market-rent-1bed-high-rentsf` | 1BR High Rent/SF | currency |
| `market-rent-1bed-high-rentsf-unadj` | 1BR High Rent/SF (Unadj) | currency |
| `market-rent-1bed-high-rentunit` | 1BR High Rent/Unit | currency |
| `market-rent-1bed-high-unitsize` | 1BR High Unit Size | number |
| `market-rent-1bed-low-rentsf` | 1BR Low Rent/SF | currency |
| `market-rent-1bed-low-rentsf-unadj` | 1BR Low Rent/SF (Unadj) | currency |
| `market-rent-1bed-low-rentunit` | 1BR Low Rent/Unit | currency |
| `market-rent-1bed-low-unitsize` | 1BR Low Unit Size | number |
| `market-rent-1bed-med-rentsf` | 1BR Med Rent/SF | currency |
| `market-rent-1bed-med-rentsf-unadj` | 1BR Med Rent/SF (Unadj) | currency |
| `market-rent-1bed-med-rentunit` | 1BR Med Rent/Unit | currency |
| `market-rent-1bed-med-unitsize` | 1BR Med Unit Size | number |
| `market-rent-1bed-rangehigh` | 1BR Range High | currency |
| `market-rent-1bed-rangelow` | 1BR Range Low | currency |
| `market-rent-1bed-sf-high` | 1BR SF High | number |
| `market-rent-1bed-sf-low` | 1BR SF Low | number |
| `market-rent-1bed1bath-conclusionsf` | 1BR1BA Conclusion/SF | currency |
| `market-rent-1bed1bath-rentsf` | 1BR1BA Rent/SF | currency |
| `market-rent-1bed1bath-rentunit` | 1BR1BA Rent/Unit | currency |
| `market-rent-1bed1bath-unitsize` | 1BR1BA Unit Size | number |
| `market-rent-2bed-avg-netadj` | 2BR Avg Net Adj | currency |
| `market-rent-2bed-avg-rentsf` | 2BR Avg Rent/SF | currency |
| `market-rent-2bed-avg-rentsf-unadj` | 2BR Avg Rent/SF (Unadj) | currency |
| `market-rent-2bed-avg-rentunit` | 2BR Avg Rent/Unit | currency |
| `market-rent-2bed-avg-unitsize` | 2BR Avg Unit Size | number |
| `market-rent-2bed-comp1-netadj` | 2BR Comp1 Net Adj | currency |
| `market-rent-2bed-comp1-rentsf` | 2BR Comp1 Rent/SF | currency |
| `market-rent-2bed-comp1-rentsf-unadj` | 2BR Comp1 Rent/SF (Unadj) | currency |
| `market-rent-2bed-comp1-rentunit` | 2BR Comp1 Rent/Unit | currency |
| `market-rent-2bed-comp1-unitsize` | 2BR Comp1 Unit Size | number |
| `market-rent-2bed-comp2-netadj` | 2BR Comp2 Net Adj | currency |
| `market-rent-2bed-comp2-rentsf` | 2BR Comp2 Rent/SF | currency |
| `market-rent-2bed-comp2-rentsf-unadj` | 2BR Comp2 Rent/SF (Unadj) | currency |
| `market-rent-2bed-comp2-rentunit` | 2BR Comp2 Rent/Unit | currency |
| `market-rent-2bed-comp2-unitsize` | 2BR Comp2 Unit Size | number |
| `market-rent-2bed-comp3-netadj` | 2BR Comp3 Net Adj | currency |
| `market-rent-2bed-comp3-rentsf` | 2BR Comp3 Rent/SF | currency |
| `market-rent-2bed-comp3-rentsf-unadj` | 2BR Comp3 Rent/SF (Unadj) | currency |
| `market-rent-2bed-comp3-rentunit` | 2BR Comp3 Rent/Unit | currency |
| `market-rent-2bed-comp3-unitsize` | 2BR Comp3 Unit Size | number |
| `market-rent-2bed-comp4-netadj` | 2BR Comp4 Net Adj | currency |
| `market-rent-2bed-comp4-rentsf` | 2BR Comp4 Rent/SF | currency |
| `market-rent-2bed-comp4-rentsf-unadj` | 2BR Comp4 Rent/SF (Unadj) | currency |
| `market-rent-2bed-comp4-rentunit` | 2BR Comp4 Rent/Unit | currency |
| `market-rent-2bed-comp4-unitsize` | 2BR Comp4 Unit Size | number |
| `market-rent-2bed-comp5-netadj` | 2BR Comp5 Net Adj | currency |
| `market-rent-2bed-comp5-rentsf` | 2BR Comp5 Rent/SF | currency |
| `market-rent-2bed-comp5-rentsf-unadj` | 2BR Comp5 Rent/SF (Unadj) | currency |
| `market-rent-2bed-comp5-rentunit` | 2BR Comp5 Rent/Unit | currency |
| `market-rent-2bed-comp5-unitsize` | 2BR Comp5 Unit Size | number |
| `market-rent-2bed-high-rentsf` | 2BR High Rent/SF | currency |
| `market-rent-2bed-high-rentsf-unadj` | 2BR High Rent/SF (Unadj) | currency |
| `market-rent-2bed-high-rentunit` | 2BR High Rent/Unit | currency |
| `market-rent-2bed-high-unitsize` | 2BR High Unit Size | number |
| `market-rent-2bed-low-netadj` | 2BR Low Net Adj | currency |
| `market-rent-2bed-low-rentsf` | 2BR Low Rent/SF | currency |
| `market-rent-2bed-low-rentsf-unadj` | 2BR Low Rent/SF (Unadj) | currency |
| `market-rent-2bed-low-rentunit` | 2BR Low Rent/Unit | currency |
| `market-rent-2bed-low-unitsize` | 2BR Low Unit Size | number |
| `market-rent-2bed-med-rentsf` | 2BR Med Rent/SF | currency |
| `market-rent-2bed-med-rentsf-unadj` | 2BR Med Rent/SF (Unadj) | currency |
| `market-rent-2bed-med-rentunit` | 2BR Med Rent/Unit | currency |
| `market-rent-2bed-med-unitsize` | 2BR Med Unit Size | number |
| `market-rent-comps-count` | Market Rent Comps Count | number |
| `market-rent-comps-markets` | Market Rent Comps Markets | text |
| `otherrevenue-laundry-percent` | Laundry Revenue Percent | percentage |
| `otherrevenue-laundry-persf` | Laundry Revenue Per SF | currency |
| `otherrevenue-laundry-perunit` | Laundry Revenue Per Unit | currency |
| `otherrevenue-laundry-total` | Laundry Revenue Total | currency |
| `otherrevenue-parking-percent` | Parking Revenue Percent | percentage |
| `otherrevenue-parking-persf` | Parking Revenue Per SF | currency |
| `otherrevenue-parking-perunit` | Parking Revenue Per Unit | currency |
| `otherrevenue-parking-total` | Parking Revenue Total | currency |
| `otherrevenue-total-persf` | Other Revenue Total Per SF | currency |
| `otherrevenue-total-perunit` | Other Revenue Total Per Unit | currency |
| `otherrevenue-total-total` | Other Revenue Grand Total | currency |
| `subject-rent-sf-avg` | Rent per SF Average | currency |
| `subject-renttype` | Rent Type | text |
| `subject-rent-unit-avg` | Rent per Unit Average | currency |
| `subject-surveycomments` | Survey Comments | textarea |
| `subject-rent-sf-avg` | Average Rent/SF | currency |
| `subject-rent-unit-avg` | Average Rent/Unit | currency |
| `rent-1br-high` | 1BR High Rent | calculated |
| `rent-1br-low` | 1BR Low Rent | calculated |
| `rent-1br-avg` | 1BR Average Rent | calculated |
| `rent-1br-median` | 1BR Median Rent | calculated |
| `rent-1br-concluded-sf` | 1BR Concluded SF | number |
| `rent-1br-concluded-rent` | 1BR Concluded Rent | number |
| `rent-1br-concluded-psf` | 1BR Concluded Rent/SF | calculated |
| `rent-2br-high` | 2BR High Rent | calculated |
| `rent-2br-low` | 2BR Low Rent | calculated |
| `rent-2br-avg` | 2BR Average Rent | calculated |
| `rent-2br-median` | 2BR Median Rent | calculated |
| `rent-2br-concluded-sf` | 2BR Concluded SF | number |
| `rent-2br-concluded-rent` | 2BR Concluded Rent | number |
| `rent-2br-concluded-psf` | 2BR Concluded Rent/SF | calculated |
| `subject-concludedrent` | Concluded Rent | currency |
| `survey1-name` | Property Name | text |
| `survey1-address` | Address | text |
| `survey1-city` | City | text |
| `survey1-distance` | Distance (km) | number |
| `survey1-units` | Total Units | number |
| `survey1-year-built` | Year Built | number |
| `survey1-stories` | Stories | number |
| `survey1-location` | Location Rating | select |
| `survey1-quality` | Quality Rating | select |
| `survey1-condition` | Condition Rating | select |
| `survey1-appeal` | Appeal Rating | select |
| `survey1-amenities` | Amenities Rating | select |
| `survey1-parking` | Parking | text |
| `survey1-laundry` | Laundry | text |
| `survey1-utilities` | Utilities Included | text |
| `survey1-1br-sf` | 1BR Avg SF | number |
| `survey1-1br-rent` | 1BR Rent/Mo | number |
| `survey1-1br-psf` | 1BR Rent/SF | calculated |
| `survey1-2br-sf` | 2BR Avg SF | number |
| `survey1-2br-rent` | 2BR Rent/Mo | number |
| `survey1-2br-psf` | 2BR Rent/SF | calculated |
| `survey2-name` | Property Name | text |
| `survey2-address` | Address | text |
| `survey2-city` | City | text |
| `survey2-distance` | Distance (km) | number |
| `survey2-units` | Total Units | number |
| `survey2-year-built` | Year Built | number |
| `survey2-stories` | Stories | number |
| `survey2-location` | Location Rating | select |
| `survey2-quality` | Quality Rating | select |
| `survey2-condition` | Condition Rating | select |
| `survey2-appeal` | Appeal Rating | select |
| `survey2-amenities` | Amenities Rating | select |
| `survey2-parking` | Parking | text |
| `survey2-laundry` | Laundry | text |
| `survey2-utilities` | Utilities Included | text |
| `survey2-1br-sf` | 1BR Avg SF | number |
| `survey2-1br-rent` | 1BR Rent/Mo | number |
| `survey2-1br-psf` | 1BR Rent/SF | calculated |
| `survey2-2br-sf` | 2BR Avg SF | number |
| `survey2-2br-rent` | 2BR Rent/Mo | number |
| `survey2-2br-psf` | 2BR Rent/SF | calculated |
| `survey3-name` | Property Name | text |
| `survey3-address` | Address | text |
| `survey3-city` | City | text |
| `survey3-distance` | Distance (km) | number |
| `survey3-units` | Total Units | number |
| `survey3-year-built` | Year Built | number |
| `survey3-stories` | Stories | number |
| `survey3-location` | Location Rating | select |
| `survey3-quality` | Quality Rating | select |
| `survey3-condition` | Condition Rating | select |
| `survey3-appeal` | Appeal Rating | select |
| `survey3-amenities` | Amenities Rating | select |
| `survey3-parking` | Parking | text |
| `survey3-laundry` | Laundry | text |
| `survey3-utilities` | Utilities Included | text |
| `survey3-1br-sf` | 1BR Avg SF | number |
| `survey3-1br-rent` | 1BR Rent/Mo | number |
| `survey3-1br-psf` | 1BR Rent/SF | calculated |
| `survey3-2br-sf` | 2BR Avg SF | number |
| `survey3-2br-rent` | 2BR Rent/Mo | number |
| `survey3-2br-psf` | 2BR Rent/SF | calculated |
| `survey4-name` | Property Name | text |
| `survey4-address` | Address | text |
| `survey4-city` | City | text |
| `survey4-distance` | Distance (km) | number |
| `survey4-units` | Total Units | number |
| `survey4-year-built` | Year Built | number |
| `survey4-stories` | Stories | number |
| `survey4-location` | Location Rating | select |
| `survey4-quality` | Quality Rating | select |
| `survey4-condition` | Condition Rating | select |
| `survey4-appeal` | Appeal Rating | select |
| `survey4-amenities` | Amenities Rating | select |
| `survey4-parking` | Parking | text |
| `survey4-laundry` | Laundry | text |
| `survey4-utilities` | Utilities Included | text |
| `survey4-1br-sf` | 1BR Avg SF | number |
| `survey4-1br-rent` | 1BR Rent/Mo | number |
| `survey4-1br-psf` | 1BR Rent/SF | calculated |
| `survey4-2br-sf` | 2BR Avg SF | number |
| `survey4-2br-rent` | 2BR Rent/Mo | number |
| `survey4-2br-psf` | 2BR Rent/SF | calculated |
| `survey5-name` | Property Name | text |
| `survey5-address` | Address | text |
| `survey5-city` | City | text |
| `survey5-distance` | Distance (km) | number |
| `survey5-units` | Total Units | number |
| `survey5-year-built` | Year Built | number |
| `survey5-stories` | Stories | number |
| `survey5-location` | Location Rating | select |
| `survey5-quality` | Quality Rating | select |
| `survey5-condition` | Condition Rating | select |
| `survey5-appeal` | Appeal Rating | select |
| `survey5-amenities` | Amenities Rating | select |
| `survey5-parking` | Parking | text |
| `survey5-laundry` | Laundry | text |
| `survey5-utilities` | Utilities Included | text |
| `survey5-1br-sf` | 1BR Avg SF | number |
| `survey5-1br-rent` | 1BR Rent/Mo | number |
| `survey5-1br-psf` | 1BR Rent/SF | calculated |
| `survey5-2br-sf` | 2BR Avg SF | number |
| `survey5-2br-rent` | 2BR Rent/Mo | number |
| `survey5-2br-psf` | 2BR Rent/SF | calculated |
| `rentalrevenue-1bed-contractrent` | 1BR Contract Rent | currency |
| `rentalrevenue-1bed-convvmkt` | 1BR Contract vs Market | percentage |
| `rentalrevenue-1bed-marketrent` | 1BR Market Rent | currency |
| `rentalrevenue-1bed-persf` | 1BR Per SF | currency |
| `rentalrevenue-1bed-perunit` | 1BR Per Unit | currency |
| `rentalrevenue-1bed-peryear` | 1BR Per Year | currency |
| `rentalrevenue-1bed-units` | 1BR Units Count | number |
| `rentalrevenue-2bed-contractrent` | 2BR Contract Rent | currency |
| `rentalrevenue-2bed-convvmkt` | 2BR Contract vs Market | percentage |
| `rentalrevenue-2bed-marketrent` | 2BR Market Rent | currency |
| `rentalrevenue-2bed-persf` | 2BR Per SF | currency |
| `rentalrevenue-2bed-perunit` | 2BR Per Unit | currency |
| `rentalrevenue-2bed-peryear` | 2BR Per Year | currency |
| `rentalrevenue-2bed-units` | 2BR Units Count | number |
| `rentalrevenue-total-contractrent` | Total Contract Rent | currency |
| `rentalrevenue-total-convvmkt` | Total Contract vs Market | percentage |
| `rentalrevenue-total-marketrent` | Total Market Rent | currency |
| `rentalrevenue-total-persf` | Total Per SF | currency |
| `rentalrevenue-total-perunit` | Total Per Unit | currency |
| `rentalrevenue-total-peryear` | Total Per Year | currency |
| `revenue-laundry-proj-pct` | Laundry Revenue - Projected % | percentage |
| `revenue-laundry-proj-total` | Laundry Revenue - Projected Total | currency |
| `revenue-misc-proj-pct` | Misc Revenue - Projected % | percentage |
| `revenue-multifamily-proj-pct` | Multifamily Revenue - Projected % | percentage |
| `revenue-parking-proj-pct` | Parking Revenue - Projected % | percentage |
| `revenue-rental-proj-pct` | Rental Revenue - Projected % | percentage |
| `contract-to-market-pct` | Contract to Market % | percentage |
| `survey-1br-avg-rent` | 1BR Average Rent | currency |
| `survey-1br-avg-psf` | 1BR Average PSF | number |
| `survey-2br-avg-rent` | 2BR Average Rent | currency |
| `survey-2br-avg-psf` | 2BR Average PSF | number |
| `subject-vacancycreditloss` | Vacancy & Credit Loss | percentage |
| `vacancy-loss-sf` | Vacancy Loss Per SF | currency |
| `vacancy-loss-unit` | Vacancy Loss Per Unit | currency |
| `vacancy-loss-year` | Vacancy Loss Per Year | currency |
| `vacancy-rate-concluded` | Vacancy Rate - Concluded | percentage |
