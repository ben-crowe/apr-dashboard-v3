---
content_type: reference
title: V4 Report — Key Input Fields (grouped by workbench section)
generated: 2026-06-22
source: src/features/report-builder/schema/fieldRegistry.ts (inputSource==user-input) · grouped by TestInputDashboard section taxonomy
regenerate: node /tmp/v4-inputs-doc.mjs
tags: [apr-dashboard, field-registry, v4, input-fields, test-input-dashboard]
---

# V4 Report — Key Input Fields (grouped by the workbench's 21 sections)

> **What this is.** The genuine **input fields** of the V4 report (`inputSource: "user-input"`), grouped and ordered exactly as the **Test Data Input Dashboard** (`/test-input`) shows them — the 21 numbered report sections. This is the "what a person fills in" set, the thing the registry should map.
>
> **How it relates to the 2,082.** The full `fieldRegistry` is ALL fields (inputs + outputs + derived). This doc is ONLY the inputs in the workbench's visible sections.

## The 2,082 broken down (by inputSource)

| inputSource | Count | What it is |
|---|---|---|
| user-input | 1572 | a person enters it (the real inputs) |
| calculated | 421 | formula output (derived) |
| auto-filled | 95 | derived/auto |
| api-fetch | 8 | pulled from API |
| valcre-mapping | 1 | Valcre map |
| **Input fields in the 21 workbench sections** | **1095** | **← the key list below** |

## By section (matches the workbench counts)

| # · Section | Input fields |
|---|---|
| S1 · CLIENT INTAKE (V3) | 38 |
| S2 · LOE PREP (V3) | 58 |
| S3 · IMAGE MANAGEMENT | 134 |
| 01 · COVER PAGE | 13 |
| 02 · INTRODUCTION LETTER | 30 |
| 05 · REPORT INFORMATION | 24 |
| 06 · EXECUTIVE SUMMARY | 58 |
| 08 · SITE DETAILS | 85 |
| 09 · LOCATION ANALYSIS | 15 |
| 10 · PROPERTY TAXES | 10 |
| 11 · MARKET ANALYSIS | 41 |
| 12 · IMPROVEMENTS | 73 |
| 13 · ZONING | 9 |
| 14 · HIGHEST & BEST USE | 14 |
| 15 · VALUATIONS (All 3 Approaches) | 92 |
| 16 · LAND VALUE | 1 |
| 18 · SALES COMPS | 187 |
| 19 · RENT COMPS | 170 |
| 20 · RENT ROLL | 14 |
| 21 · RECONCILIATION | 8 |
| 22 · CERTIFICATION | 21 |
| **TOTAL** | **1095** |

---

# Input fields by section

## S1 · CLIENT INTAKE (V3) — 38 fields

| Field ID | Label | Type | Req |
|---|---|---|---|
| `client-attention` | Client Attention Line | text |  |
| `client-city` | Client City | text |  |
| `client-company` | Client Company | text |  |
| `client-company-name` | Company Name | text |  |
| `client-email` | Client Email | text | ✓ |
| `client-first-name` | Client First Name | text | ✓ |
| `client-full-name` | Client Full Name | text |  |
| `client-last-name` | Client Last Name | text | ✓ |
| `client-name` | Client Name | text |  |
| `client-organization-address` | Street Address | text |  |
| `client-phone` | Client Phone | text | ✓ |
| `client-postal` | Postal Code | text |  |
| `client-province` | Client Province | text |  |
| `client-salutation` | Client Salutation | text |  |
| `client-title` | Client Title | text |  |
| `company-address` | Company Address | text |  |
| `company-city-state-zip` | Company City/State/Zip | text |  |
| `company-email` | Company Email | text |  |
| `company-name` | Company Name | text |  |
| `company-phone` | Company Phone | text |  |
| `company-website` | Company Website | text |  |
| `company-jobnumber` | Client Job Number | text |  |
| `intake-notes` | Additional Information | textarea |  |
| `contact-email` | Contact Email | text |  |
| `contact-first-name` | First Name/Department | text |  |
| `contact-last-name` | Contact Last Name | text |  |
| `contact-phone` | Contact Phone | text |  |
| `asset-condition` | Asset Condition | dropdown |  |
| `authorized-use` | Authorized Use | dropdown |  |
| `property-address` | Property Address | text |  |
| `property-city` | Property City | text |  |
| `property-name` | Property Name | text | ✓ |
| `property-postal` | Property Postal Code | text |  |
| `property-province` | Property Province | text |  |
| `property-subtype` | Property Subtype | dropdown |  |
| `property-type` | Property Type | dropdown |  |
| `tenancy` | Tenancy | dropdown |  |
| `valuation-premises` | Valuation Premises | dropdown |  |

## S2 · LOE PREP (V3) — 58 fields

| Field ID | Label | Type | Req |
|---|---|---|---|
| `appraiser-aic` | AIC Number | text |  |
| `appraiser-aic-number` | AIC Member Number | text |  |
| `appraiser-credentials` | Appraiser Credentials | text |  |
| `appraiser-designation` | Appraiser Designation | text |  |
| `appraiser-email` | Appraiser Email | text |  |
| `appraiser-license` | Appraiser License | text |  |
| `appraiser-license-expiry` | Appraiser License Expiry | date |  |
| `appraiser-name` | Appraiser Name | text | ✓ |
| `appraiser-role` | Appraiser Role | dropdown |  |
| `appraiser-title` | Appraiser Title | text |  |
| `appraiser1-allunits` | Appraiser 1 All Units Inspected | boolean |  |
| `appraiser1-email` | Appraiser 1 Email | text |  |
| `appraiser1-extent` | Appraiser 1 Inspection Extent | text |  |
| `appraiser1-inspectiondate` | Appraiser 1 Inspection Date | date |  |
| `appraiser1-name` | Appraiser 1 Name | text |  |
| `appraiser1-title` | Appraiser 1 Title | text |  |
| `appraiser2-aic` | Appraiser 2 AIC Number | text |  |
| `appraiser2-allunits` | Appraiser 2 All Units Inspected | boolean |  |
| `appraiser2-credentials` | Appraiser 2 Credentials | text |  |
| `appraiser2-email` | Appraiser 2 Email | text |  |
| `appraiser2-extent` | Appraiser 2 Inspection Extent | text |  |
| `appraiser2-inspectiondate` | Appraiser 2 Inspection Date | date |  |
| `appraiser2-license-expiry` | Appraiser 2 License Expiry | date |  |
| `appraiser2-phone` | Appraiser 2 Phone | text |  |
| `appraiser2-title` | Appraiser 2 Title | text |  |
| `valuation-date` | Date of Valuation | date | ✓ |
| `assignment-type` | Assignment Type | dropdown |  |
| `client-documents` | Client Documents | multi-select |  |
| `cmhc-financing` | CMHC Financing | dropdown |  |
| `current-use-improvements` | Current Use Improvements | dropdown |  |
| `delivery-time` | Delivery Time | number |  |
| `desktop-report` | Desktop Report | dropdown |  |
| `land-metric` | Land $/Metric | dropdown |  |
| `previously-appraised` | Previously Appraised | dropdown |  |
| `proposed-use-improvements` | Proposed Use Improvements | dropdown |  |
| `report-intendeduse` | Intended Use | textarea |  |
| `report-intendeduser` | Intended User | text |  |
| `state-of-improvements` | State of Improvements | dropdown |  |
| `status-of-improvements` | Status of Improvements | dropdown |  |
| `transaction-status` | Transaction Status | multi-select |  |
| `zoning-status` | Zoning Status | dropdown |  |
| `report-extraordinary` | Extraordinary Assumptions | textarea |  |
| `report-hypothetical` | Hypothetical Conditions | textarea |  |
| `report-limcond` | Limiting Conditions | textarea |  |
| `appraiser-comments` | Appraiser Comments | textarea |  |
| `internal-comments` | Internal Comments | textarea |  |
| `appraisal-status` | Appraisal Status | dropdown |  |
| `delivery-date` | Delivery Date | date |  |
| `interest-appraised` | Property Rights Appraised | dropdown |  |
| `report-type` | Report Type | dropdown |  |
| `valuation-type` | Valuation Type | dropdown |  |
| `appraisal-fee` | Appraisal Fee | currency |  |
| `payment-terms` | Payment Terms | text |  |
| `retainer-amount` | Retainer Amount | currency |  |
| `job-number` | Valcre Job ID (VAL#) | text |  |
| `report-legal` | Legal Description | textarea |  |
| `scope-of-work` | Scope of Work | textarea |  |
| `special-instructions` | Special Instructions | textarea |  |

## S3 · IMAGE MANAGEMENT — 134 fields

| Field ID | Label | Type | Req |
|---|---|---|---|
| `company-logo` | Company Logo | image |  |
| `img-common-1` | Common Area 1 - Lobby/Entrance | image |  |
| `img-common-1-caption` | Caption | text |  |
| `img-common-2` | Common Area 2 - Hallway/Corridor | image |  |
| `img-common-2-caption` | Caption | text |  |
| `img-common-3` | Common Area 3 - Amenity Space | image |  |
| `img-common-3-caption` | Caption | text |  |
| `img-common-4` | Common Area 4 - Additional | image |  |
| `img-common-4-caption` | Caption | text |  |
| `comp1-map` | Comp 1 Map | image |  |
| `comp2-map` | Comp 2 Map | image |  |
| `comp3-map` | Comp 3 Map | image |  |
| `comp4-map` | Comp 4 Map | image |  |
| `comp5-map` | Comp 5 Map | image |  |
| `comp1-photo` | Comp 1 Photo | image |  |
| `comp1-photo-caption` | Caption | text |  |
| `comp2-photo` | Comp 2 Photo | image |  |
| `comp2-photo-caption` | Caption | text |  |
| `comp3-photo` | Comp 3 Photo | image |  |
| `comp3-photo-caption` | Caption | text |  |
| `comp4-photo` | Comp 4 Photo | image |  |
| `comp4-photo-caption` | Caption | text |  |
| `comp5-photo` | Comp 5 Photo | image |  |
| `comp5-photo-caption` | Caption | text |  |
| `img-signature` | Appraiser Signature | image |  |
| `subject-photo` | Cover Photo - Main property image | image |  |
| `img-exterior-1` | Exterior 1 - Front Facade | image |  |
| `img-exterior-1-caption` | Caption | text |  |
| `img-exterior-2` | Exterior 2 - Rear Elevation | image |  |
| `img-exterior-2-caption` | Caption | text |  |
| `img-exterior-3` | Exterior 3 - Left Side | image |  |
| `img-exterior-3-caption` | Caption | text |  |
| `img-exterior-4` | Exterior 4 - Right Side | image |  |
| `img-exterior-4-caption` | Caption | text |  |
| `img-exterior-5` | Exterior 5 - Detail/Feature | image |  |
| `img-exterior-5-caption` | Caption | text |  |
| `img-exterior-6` | Exterior 6 - Additional | image |  |
| `img-exterior-6-caption` | Caption | text |  |
| `img-comparables-map` | Sales Comparables Location Map | image |  |
| `img-map-aerial` | Aerial Overview Map | image |  |
| `img-map-aerial-1` | Aerial View - Bird's eye of property | image |  |
| `img-map-aerial-1-title` | Title | text |  |
| `img-map-aerial-2` | Site Boundary - Property lines shown | image |  |
| `img-map-aerial-2-title` | Title | text |  |
| `img-map-local` | Local Area Map - City/neighborhood | image |  |
| `img-map-local-title` | Title | text |  |
| `img-map-regional` | Regional Map - Province/region context | image |  |
| `img-map-regional-title` | Title | text |  |
| `img-rental-comparables-map` | Rental Comparables Location Map | image |  |
| `img-site-plan-1` | Site Plan - Layout/footprint | image |  |
| `img-site-plan-2` | Survey/Plot Plan | image |  |
| `img-zoning-map` | Zoning Map - Municipal zoning | image |  |
| `site-plan-1-title` | Site Plan 1 Title | text |  |
| `site-plan-2-title` | Site Plan 2 Title | text |  |
| `zoning-map-title` | Zoning Map Title | text |  |
| `photo-section-title` | Photo Section Title | text |  |
| `rental-comp1-photo` | Rental Comp 1 Photo | image |  |
| `rental-comp2-photo` | Rental Comp 2 Photo | image |  |
| `img-street-1` | Street View 1 - Looking North | image |  |
| `img-street-1-caption` | Caption | text |  |
| `img-street-2` | Street View 2 - Looking South | image |  |
| `img-street-2-caption` | Caption | text |  |
| `img-street-3` | Street View 3 - Streetscape/Context | image |  |
| `img-street-3-caption` | Caption | text |  |
| `subject-photo-1` | Subject Photo 1 | image |  |
| `subject-photo-1-caption` | Caption | text |  |
| `subject-photo-10` | Subject Photo 10 | image |  |
| `subject-photo-10-caption` | Caption | text |  |
| `subject-photo-11` | Subject Photo 11 | image |  |
| `subject-photo-11-caption` | Caption | text |  |
| `subject-photo-12` | Subject Photo 12 | image |  |
| `subject-photo-12-caption` | Caption | text |  |
| `subject-photo-13` | Subject Photo 13 | image |  |
| `subject-photo-13-caption` | Caption | text |  |
| `subject-photo-14` | Subject Photo 14 | image |  |
| `subject-photo-14-caption` | Caption | text |  |
| `subject-photo-15` | Subject Photo 15 | image |  |
| `subject-photo-15-caption` | Caption | text |  |
| `subject-photo-16` | Subject Photo 16 | image |  |
| `subject-photo-16-caption` | Caption | text |  |
| `subject-photo-17` | Subject Photo 17 | image |  |
| `subject-photo-17-caption` | Caption | text |  |
| `subject-photo-18` | Subject Photo 18 | image |  |
| `subject-photo-18-caption` | Caption | text |  |
| `subject-photo-19` | Subject Photo 19 | image |  |
| `subject-photo-19-caption` | Caption | text |  |
| `subject-photo-2` | Subject Photo 2 | image |  |
| `subject-photo-2-caption` | Caption | text |  |
| `subject-photo-20` | Subject Photo 20 | image |  |
| `subject-photo-20-caption` | Caption | text |  |
| `subject-photo-21` | Subject Photo 21 | image |  |
| `subject-photo-21-caption` | Caption | text |  |
| `subject-photo-22` | Subject Photo 22 | image |  |
| `subject-photo-22-caption` | Caption | text |  |
| `subject-photo-23` | Subject Photo 23 | image |  |
| `subject-photo-23-caption` | Caption | text |  |
| `subject-photo-24` | Subject Photo 24 | image |  |
| `subject-photo-24-caption` | Caption | text |  |
| `subject-photo-25` | Subject Photo 25 | image |  |
| `subject-photo-25-caption` | Caption | text |  |
| `subject-photo-3` | Subject Photo 3 | image |  |
| `subject-photo-3-caption` | Caption | text |  |
| `subject-photo-4` | Subject Photo 4 | image |  |
| `subject-photo-4-caption` | Caption | text |  |
| `subject-photo-5` | Subject Photo 5 | image |  |
| `subject-photo-5-caption` | Caption | text |  |
| `subject-photo-6` | Subject Photo 6 | image |  |
| `subject-photo-6-caption` | Caption | text |  |
| `subject-photo-7` | Subject Photo 7 | image |  |
| `subject-photo-7-caption` | Caption | text |  |
| `subject-photo-8` | Subject Photo 8 | image |  |
| `subject-photo-8-caption` | Caption | text |  |
| `subject-photo-9` | Subject Photo 9 | image |  |
| `subject-photo-9-caption` | Caption | text |  |
| `img-systems-1` | Building Systems 1 - Mechanical Room | image |  |
| `img-systems-1-caption` | Caption | text |  |
| `img-systems-2` | Building Systems 2 - Electrical Panel | image |  |
| `img-systems-2-caption` | Caption | text |  |
| `img-systems-3` | Building Systems 3 - Plumbing/Water Heater | image |  |
| `img-systems-3-caption` | Caption | text |  |
| `img-systems-4` | Building Systems 4 - HVAC/Furnace | image |  |
| `img-systems-4-caption` | Caption | text |  |
| `img-unit-1` | Unit Interior 1 - Living Room | image |  |
| `img-unit-1-caption` | Caption | text |  |
| `img-unit-2` | Unit Interior 2 - Kitchen | image |  |
| `img-unit-2-caption` | Caption | text |  |
| `img-unit-3` | Unit Interior 3 - Bedroom | image |  |
| `img-unit-3-caption` | Caption | text |  |
| `img-unit-4` | Unit Interior 4 - Bathroom | image |  |
| `img-unit-4-caption` | Caption | text |  |
| `img-unit-5` | Unit Interior 5 - Additional Room | image |  |
| `img-unit-5-caption` | Caption | text |  |
| `img-unit-6` | Unit Interior 6 - Additional | image |  |
| `img-unit-6-caption` | Caption | text |  |

## 01 · COVER PAGE — 13 fields

| Field ID | Label | Type | Req |
|---|---|---|---|
| `appraiser1-signature` | Appraiser 1 Signature | image |  |
| `client-city` | Client City | text |  |
| `client-organization-address` | Client Address | text |  |
| `client-province` | Client Province | text |  |
| `client-title` | Client Title | text |  |
| `appraiser2-name` | Appraiser 2 Name | text |  |
| `market` | Market | text |  |
| `submarket` | Submarket | text |  |
| `subject-geocode` | Geocode | text |  |
| `subject-location` | Location | text |  |
| `subject-market` | Market | text |  |
| `subject-street` | Street | text |  |
| `subject-submarket` | Submarket | text |  |

## 02 · INTRODUCTION LETTER — 30 fields

| Field ID | Label | Type | Req |
|---|---|---|---|
| `approaches-to-value` | Approaches Applied | multi-select |  |
| `home-use-cost-approach` | Cost Approach | boolean |  |
| `home-use-income-approach` | Income Approach | boolean |  |
| `home-use-sales-approach` | Sales Comparison | boolean |  |
| `select-modules` | Select Modules | multi-select |  |
| `use-dcf` | Use DCF Analysis | boolean |  |
| `use-land-dc` | Use Site & Land DC | boolean |  |
| `use-multi-dc` | Use Multi-DC | boolean |  |
| `use-special` | Use Special/Hotel | boolean |  |
| `use-stabilization` | Use Stabilization Tool | boolean |  |
| `extraordinary-assumption-1` | Extraordinary Assumption 1 | textarea |  |
| `extraordinary-assumption-2` | Extraordinary Assumption 2 | textarea |  |
| `extraordinary-assumption-3` | Extraordinary Assumption 3 | textarea |  |
| `hypothetical-condition-1` | Hypothetical Condition 1 | textarea |  |
| `hypothetical-condition-2` | Hypothetical Condition 2 | textarea |  |
| `hypothetical-condition-3` | Hypothetical Condition 3 | textarea |  |
| `limiting-condition-1` | Limiting Condition 1 | textarea |  |
| `limiting-condition-2` | Limiting Condition 2 | textarea |  |
| `limiting-condition-3` | Limiting Condition 3 | textarea |  |
| `property-description-prefix` | Property Description Prefix | textarea |  |
| `sale-lease-config` | Sale/Lease Configuration | select |  |
| `parcel-id` | Parcel ID | text |  |
| `current-owner` | Current Owner | text |  |
| `last-purchase-price` | Last Purchase Price | currency |  |
| `owner-address` | Owner Address | text |  |
| `ownership-history` | Ownership History | textarea |  |
| `prior-owner` | Prior Owner | text |  |
| `purchase-date` | Purchase Date | date |  |
| `sales-history` | Sales History | textarea |  |
| `transmittal-body` | Letter Body | textarea | ✓ |

## 05 · REPORT INFORMATION — 24 fields

| Field ID | Label | Type | Req |
|---|---|---|---|
| `report-purpose` | Purpose | textarea | ✓ |
| `report-scope` | Scope of Work | textarea | ✓ |
| `info-assessment-source` | Assessment Info Source | text |  |
| `info-buildingsize-source` | Building Size Info Source | text |  |
| `info-comps-source` | Comparables Info Source | text |  |
| `info-environmental-source` | Environmental Info Source | text |  |
| `info-incomeexpense-source` | Income/Expense Info Source | text |  |
| `info-lease-source` | Lease Info Source | text |  |
| `info-legal-source` | Legal Info Source | text |  |
| `info-rentroll-source` | Rent Roll Info Source | text |  |
| `info-sitesize-source` | Site Size Info Source | text |  |
| `info-title-source` | Title Info Source | text |  |
| `info-zoning-source` | Zoning Info Source | text |  |
| `report-date1` | Report Date | date |  |
| `report-dateinspection` | Date of Inspection | date |  |
| `report-effectivedate` | Effective Date | date |  |
| `report-inspectiondate` | Inspection Date | date |  |
| `report-interest` | Interest Appraised | text |  |
| `report-valuationcost` | Valuation - Cost Approach | currency |  |
| `report-valuationincome` | Valuation - Income Approach | currency |  |
| `report-valuationsales` | Valuation - Sales Approach | currency |  |
| `report-values` | Final Value Conclusion | currency |  |
| `report-valuescenario1` | Value Scenario 1 | currency |  |
| `deed-type` | Deed Type | dropdown |  |

## 06 · EXECUTIVE SUMMARY — 58 fields

| Field ID | Label | Type | Req |
|---|---|---|---|
| `effective-date` | Effective Date | date |  |
| `exposure-time` | Exposure Time | text |  |
| `interest-appraised` | Interest Appraised | text |  |
| `occupancy-status` | Occupancy Status | dropdown |  |
| `property-address` | Property Address | text |  |
| `site-size` | Site Size | number |  |
| `subject-actualage` | Actual Age | number |  |
| `subject-appeal` | Appeal | text |  |
| `subject-avg-unit-sf` | Average Unit SF | number |  |
| `subject-avg-unit-sf` | Average Unit SF | number |  |
| `subject-conforminglot` | Conforming Lot | select |  |
| `subject-conforminguse` | Conforming Use | select |  |
| `subject-density` | Density | number |  |
| `subject-econcharacteristics` | Economic Characteristics | textarea |  |
| `subject-economiclife` | Economic Life | number |  |
| `subject-effectiveage` | Effective Age | number |  |
| `subject-exposuretime` | Exposure Time | text |  |
| `subject-introcomment` | Introduction Comment | textarea |  |
| `subject-legally-permitted` | Legally Permitted | select |  |
| `subject-marketing` | Marketing Time | text |  |
| `subject-name` | Property Name | text |  |
| `subject-nra` | Net Rentable Area | number |  |
| `subject-occupancy` | Subject Occupancy | percentage |  |
| `subject-occupancy-current` | Current Occupancy | percentage |  |
| `subject-occupancystabilized` | Stabilized Occupancy | percentage |  |
| `subject-occupied-units` | Occupied Units | number |  |
| `subject-owner` | Owner | text |  |
| `subject-permitteduses` | Permitted Uses | textarea |  |
| `subject-primary` | Primary Type | text |  |
| `subject-property-name` | Property Name | text |  |
| `subject-proposedconstruction` | Proposed Construction | textarea |  |
| `subject-quality` | Quality | text |  |
| `subject-remaininglife` | Remaining Life | number |  |
| `subject-salehistory` | Sale History | textarea |  |
| `subject-sfmultifamily` | SF Multifamily | number |  |
| `subject-stories` | Number of Stories | number |  |
| `subject-subtype` | Property Subtype | text |  |
| `subject-tenancy` | Tenancy | text |  |
| `subject-totalbuildings` | Total Buildings | number |  |
| `subject-totalsf` | Total SF | number |  |
| `subject-vacant-units` | Vacant Units | number |  |
| `subject-year-built` | Year Built | number |  |
| `subject-year-built` | Year Built | number |  |
| `subject-zoning` | Zoning | text |  |
| `subject-zoningauthority` | Zoning Authority | text |  |
| `subject-zoningchange` | Zoning Change | textarea |  |
| `subject-zoningchangestatus` | Zoning Change Status | text |  |
| `subject-zoningcode` | Zoning Code | text |  |
| `subject-zoningdescription` | Zoning Description | textarea |  |
| `valuation-scenario` | Valuation Scenario | text |  |
| `value-scenarios` | Value Scenario | select | ✓ |
| `value-timeframe` | Timeframe | dropdown |  |
| `zoning-designation` | Zoning Designation | text |  |
| `extraordinary-assumptions` | Extraordinary Assumptions | textarea |  |
| `extraordinary-limiting-conditions` | Extraordinary Limiting Conditions | textarea |  |
| `hypothetical-conditions` | Hypothetical Conditions | textarea |  |
| `scenario-name` | Scenario Name | dropdown |  |
| `value-component` | Value Component | dropdown |  |

## 08 · SITE DETAILS — 85 fields

| Field ID | Label | Type | Req |
|---|---|---|---|
| `adjacent-east` | East | dropdown |  |
| `adjacent-north` | North | dropdown |  |
| `adjacent-south` | South | dropdown |  |
| `adjacent-west` | West | dropdown |  |
| `frontage1-distance` | Frontage 1 Distance (ft) | number |  |
| `frontage1-street` | Frontage 1 Street | text |  |
| `frontage2-distance` | Frontage 2 Distance (ft) | number |  |
| `frontage2-street` | Frontage 2 Street | text |  |
| `accessibility` | Accessibility | text |  |
| `exposure-visibility` | Exposure & Visibility | dropdown |  |
| `land-area-usable-acres` | Usable Land Area (Acres) | number |  |
| `land-area-usable-sf` | Usable Land Area (SF) | number |  |
| `legal-description` | Legal Description | text |  |
| `site-shape` | Shape | dropdown |  |
| `subject-totalacre` | Total Acres | number |  |
| `subject-usableacre` | Usable Acre | number |  |
| `subject-usableacres` | Usable Acres | number |  |
| `subject-usablesf` | Usable SF | number |  |
| `topography` | Topography | dropdown |  |
| `visibility` | Visibility | dropdown |  |
| `building-appeal` | Building Appeal | dropdown |  |
| `building-quality` | Building Quality | dropdown |  |
| `drainage` | Drainage | dropdown |  |
| `easements` | Easements & Encroachments | textarea |  |
| `hazardous-waste` | Environmental Concerns | textarea |  |
| `site-appeal` | Site Appeal | dropdown |  |
| `site-conclusion` | Site Conclusion | textarea |  |
| `site-exposure` | Site Exposure | dropdown |  |
| `site-quality` | Site Quality | dropdown |  |
| `site-rating` | Site Rating | dropdown |  |
| `site-utility` | Site Utility | dropdown |  |
| `soils` | Soils | textarea |  |
| `subject-easements` | Easements Text | textarea |  |
| `subject-shape` | Site Shape | text |  |
| `subject-siteaccess` | Site Access | text |  |
| `subject-siteconclusion` | Site Conclusion | textarea |  |
| `subject-siteexposure` | Site Exposure | text |  |
| `subject-sitequality` | Site Quality | text |  |
| `subject-siterating` | Site Rating | textarea |  |
| `subject-siteutility` | Site Utility | text |  |
| `subject-soils` | Soils | textarea |  |
| `subject-topography` | Topography | text |  |
| `subject-utilities` | Utilities | text |  |
| `site-plan-image` | Site Plan Images | image |  |
| `street1-centerlane` | Street 1 Center Lane | text |  |
| `street1-condition` | Street 1 Condition | text |  |
| `street1-curbs` | Street 1 Curbs | text |  |
| `street1-direction` | Street 1 Direction | text |  |
| `street1-lanes` | Street 1 Lanes | number |  |
| `street1-lighting` | Street 1 Lighting | text |  |
| `street1-name` | Street 1 Name | text |  |
| `street1-parking` | Street 1 Parking | text |  |
| `street1-sidewalks` | Street 1 Sidewalks | text |  |
| `street1-type` | Street 1 Type | dropdown |  |
| `street2-bikelane` | Street 2 Bike Lane | text |  |
| `street2-centerlane` | Street 2 Center Lane | text |  |
| `street2-condition` | Street 2 Condition | text |  |
| `street2-curbs` | Street 2 Curbs | text |  |
| `street2-direction` | Street 2 Direction | text |  |
| `street2-lanes` | Street 2 Lanes | number |  |
| `street2-lighting` | Street 2 Lighting | text |  |
| `street2-name` | Street 2 Name | text |  |
| `street2-parking` | Street 2 Parking | text |  |
| `street2-sidewalks` | Street 2 Sidewalks | text |  |
| `street2-surface` | Street 2 Surface | text |  |
| `street2-type` | Street 2 Type | dropdown |  |
| `traffic-total` | Total Traffic Count | number |  |
| `traffic1-count` | Traffic Count 1 | number |  |
| `traffic1-date` | Traffic Count 1 Date | date |  |
| `traffic1-location` | Traffic Count 1 Location | text |  |
| `traffic1-source` | Traffic Count 1 Source | text |  |
| `traffic1-street` | Traffic Count 1 Street | text |  |
| `traffic1-year` | Traffic Count 1 Year | number |  |
| `traffic2-count` | Traffic Count 2 | number |  |
| `traffic2-date` | Traffic Count 2 Date | date |  |
| `traffic2-location` | Traffic Count 2 Location | text |  |
| `traffic2-source` | Traffic Count 2 Source | text |  |
| `traffic2-street` | Traffic Count 2 Street | text |  |
| `traffic2-year` | Traffic Count 2 Year | number |  |
| `util-electric` | Electric | dropdown |  |
| `util-gas` | Gas | dropdown |  |
| `util-sewer` | Sewer | dropdown |  |
| `util-water` | Water | dropdown |  |
| `subject-zoningconclusion` | Zoning Conclusion | textarea |  |
| `subject-zoningtype` | Zoning Type | text |  |

## 09 · LOCATION ANALYSIS — 15 fields

| Field ID | Label | Type | Req |
|---|---|---|---|
| `local-area-description` | Local Area Description | textarea |  |
| `location-localarea` | Local Area Overview | textarea |  |
| `location-nearby-amenities` | Nearby Amenities | textarea |  |
| `location-nearbyschool-1` | Nearby School 1 | text |  |
| `location-nearbyschool-2` | Nearby School 2 | text |  |
| `location-nearbyschool-3` | Nearby School 3 | text |  |
| `location-nearbyschool-4` | Nearby School 4 | text |  |
| `location-nearbyschool-5` | Nearby School 5 | text |  |
| `nearby-schools` | Nearby Schools | textarea |  |
| `location-access` | Access | textarea |  |
| `location-description` | Location Description | textarea |  |
| `location-overview-text` | Location Overview | textarea |  |
| `location-publictransit` | Public Transit | textarea |  |
| `public-transit` | Public Transportation | textarea |  |
| `location-walkbikescores` | Walk/Bike Scores | textarea |  |

## 10 · PROPERTY TAXES — 10 fields

| Field ID | Label | Type | Req |
|---|---|---|---|
| `assessment-trend` | Assessment Trend | dropdown |  |
| `tax-commentary` | Tax Commentary | textarea |  |
| `tax-status` | Tax Status | dropdown |  |
| `tax-commentary-1` | Tax Commentary Paragraph 1 | textarea |  |
| `tax-commentary-2` | Tax Commentary Paragraph 2 | textarea |  |
| `subject-tax-per-sf` | Tax per SF | currency |  |
| `subject-taxamount` | Tax Amount | currency |  |
| `subject-taxassessment` | Tax Assessment | currency |  |
| `subject-taxrate` | Tax Rate | percentage |  |
| `subject-taxyear` | Tax Year | number |  |

## 11 · MARKET ANALYSIS — 41 fields

| Field ID | Label | Type | Req |
|---|---|---|---|
| `economic-outlook` | Economic Outlook | dropdown |  |
| `local-market` | Local Market Analysis | textarea |  |
| `market-local-employment` | Employment | textarea |  |
| `market-local-population` | Population | text |  |
| `chart-mf-investment-indicators` | MF Investment Indicators Chart | image |  |
| `market-demand-drivers` | Demand Drivers | textarea |  |
| `market-outlook` | Market Outlook | dropdown |  |
| `market-supply-pipeline` | Supply Pipeline | textarea |  |
| `multifamily-overview` | Multifamily Market Overview | textarea |  |
| `rent-trend` | Rent Trend | dropdown |  |
| `ca-business-investment` | Canada Business Investment | text |  |
| `ca-gdp` | Canada GDP | text |  |
| `ca-gdp-growth` | Canada GDP Growth | text |  |
| `ca-housing-starts` | Canada Housing Starts | text |  |
| `ca-inflation` | Canada Inflation Rate | text |  |
| `ca-natgas` | Canada Natural Gas Price | text |  |
| `ca-pop-growth` | Canada Population Growth | text |  |
| `ca-population` | Canada Population | text |  |
| `ca-retail` | Canada Retail Sales | text |  |
| `ca-unemployment` | Canada Unemployment Rate | text |  |
| `ca-wcs` | Canada WCS Oil Price | text |  |
| `ca-wells` | Canada Oil Wells Drilled | text |  |
| `ca-wti` | Canada WTI Oil Price | text |  |
| `market-national-gdp` | GDP Growth | text |  |
| `market-national-inflation` | Inflation Rate | text |  |
| `national-overview` | National Economic Overview | textarea |  |
| `market-provincial-key-industries` | Key Industries | textarea |  |
| `market-provincial-unemployment` | Unemployment Rate | text |  |
| `provincial-overview` | Provincial Overview | textarea |  |
| `sk-avg-home-price` | SK Average Home Price | currency |  |
| `sk-avg-rent-2br` | SK Average 2BR Rent | currency |  |
| `sk-credit-rating` | SK Credit Rating | text |  |
| `sk-econ-overview` | SK Economic Overview | textarea |  |
| `sk-gdp-growth` | SK GDP Growth | text |  |
| `sk-housing-starts` | SK Housing Starts | text |  |
| `sk-inflation` | SK Inflation Rate | text |  |
| `sk-oil-price` | SK Oil Price | text |  |
| `sk-pop-growth` | SK Population Growth | text |  |
| `sk-potash` | SK Potash Production | text |  |
| `sk-rental-vacancy` | SK Rental Vacancy Rate | percentage |  |
| `sk-unemployment` | SK Unemployment Rate | percentage |  |

## 12 · IMPROVEMENTS — 73 fields

| Field ID | Label | Type | Req |
|---|---|---|---|
| `laundry` | Laundry | text |  |
| `project-amenities` | Project Amenities | textarea |  |
| `security` | Security Features | textarea |  |
| `subject-amenities-laundry` | Amenities - Laundry | text |  |
| `subject-amenities-parking` | Amenities - Parking | text |  |
| `subject-amenities-utilities` | Amenities - Utilities | text |  |
| `subject-laundry` | Laundry | text |  |
| `subject-parking-incl` | Parking Included | select |  |
| `subject-parking-incl` | Parking Included | text |  |
| `subject-parking-type` | Parking Type | dropdown |  |
| `subject-parking-type` | Parking Type | dropdown |  |
| `subject-proj-amenities` | Project Amenities | textarea |  |
| `subject-security` | Security | text |  |
| `subject-security-features` | Security Features | textarea |  |
| `subject-unit-amenities` | Unit Amenities | textarea |  |
| `unit-amenities` | Unit Amenities | textarea |  |
| `building-class` | Building Class | dropdown |  |
| `impv-appeal` | Appeal Rating | dropdown |  |
| `impv-condition` | Condition Rating | dropdown |  |
| `impv-overview` | Overview | textarea |  |
| `impv-propertytype` | Property Type | text |  |
| `impv-quality` | Quality Rating | dropdown |  |
| `tenancy` | Tenancy | dropdown |  |
| `building-condition` | Building Condition | dropdown |  |
| `building-function` | Building Function | dropdown |  |
| `economic-life` | Economic Life (Years) | number |  |
| `effective-age` | Effective Age (Years) | number |  |
| `functional-design` | Functional Design | textarea |  |
| `hazardous-materials` | Hazardous Materials | textarea |  |
| `impv-economiclife` | Economic Life | number |  |
| `impv-effectiveage` | Effective Age | number |  |
| `overall-condition` | Overall Condition | dropdown |  |
| `subject-functionaldesign` | Functional Design | textarea |  |
| `subject-hazardousmaterials` | Hazardous Materials | textarea |  |
| `construction-type` | Construction Type | dropdown |  |
| `elevator` | Elevator | text |  |
| `exterior-walls` | Exterior Walls/Framing | text |  |
| `foundation` | Foundation | dropdown |  |
| `impv-insulation` | Insulation | text |  |
| `impv-roof-condition` | Roof Condition | text |  |
| `roof` | Roof | dropdown |  |
| `roof-type` | Roof Type | dropdown |  |
| `subject-elevator` | Elevator | text |  |
| `subject-exteriorwalls` | Exterior Walls | text |  |
| `subject-foundation` | Foundation | text |  |
| `subject-insulation` | Insulation | text |  |
| `ceilings` | Ceilings | text |  |
| `doors-windows` | Doors & Windows | text |  |
| `flooring` | Flooring | text |  |
| `impv-interior-finish` | Interior Finish Quality | text |  |
| `interior-walls` | Interior Walls | text |  |
| `subject-ceilings` | Ceilings | text |  |
| `subject-doorswindows` | Doors & Windows | text |  |
| `subject-floorcovering` | Floor Covering | text |  |
| `subject-interiorwalls` | Interior Walls | text |  |
| `impv-parkingspaces` | Parking Spaces | number |  |
| `landscaping` | Landscaping | text |  |
| `parking-type` | Parking Type | dropdown |  |
| `site-impv` | Site Improvements | textarea |  |
| `subject-landscaping` | Landscaping | text |  |
| `subject-parkingdesc` | Parking Description | textarea |  |
| `subject-siteimprovements` | Site Improvements | textarea |  |
| `subject-interior-finish` | Interior Finish | text |  |
| `subject-roof` | Roof Type | text |  |
| `electrical` | Electrical | text |  |
| `fire-protection` | Fire Protection | text |  |
| `hvac` | HVAC | text |  |
| `plumbing` | Plumbing | text |  |
| `subject-electrical` | Electrical | text |  |
| `subject-fireprotection` | Fire Protection | text |  |
| `subject-hvac` | HVAC | text |  |
| `subject-lighting` | Lighting | text |  |
| `subject-plumbing` | Plumbing | text |  |

## 13 · ZONING — 9 fields

| Field ID | Label | Type | Req |
|---|---|---|---|
| `conforming-lot` | Conforming Lot | dropdown |  |
| `conforming-use` | Conforming Use | dropdown |  |
| `permitted-uses` | Permitted Uses | textarea |  |
| `zone-conditional-uses` | Conditional Uses | textarea |  |
| `zoning-compliance` | Zoning Compliance | dropdown |  |
| `zoning-conclusion` | Zoning Conclusion | textarea |  |
| `zoning-conformance` | Conformance | dropdown |  |
| `zoning-description` | Zoning Description | textarea |  |
| `zoning-map` | Zoning Map | image |  |

## 14 · HIGHEST & BEST USE — 14 fields

| Field ID | Label | Type | Req |
|---|---|---|---|
| `hbu-asimproved-1` | HBU As Improved | textarea |  |
| `hbu-asimproved-2` | HBU As Improved Paragraph 2 | textarea |  |
| `hbu-asimproved-3` | HBU As Improved Paragraph 3 | textarea |  |
| `hbu-improved` | Highest & Best Use As Improved | textarea |  |
| `subject-hbuimproved` | HBU As Improved | textarea |  |
| `hbu-conclusion-vacant` | HBU Conclusion Vacant | textarea |  |
| `hbu-vacant-financial` | Financially Feasible | textarea |  |
| `hbu-vacant-legal` | Legally Permissible | textarea |  |
| `hbu-vacant-physical` | Physically Possible | textarea |  |
| `hbu-vacant-productive` | Maximally Productive | textarea |  |
| `subject-hbuvacant` | HBU As Vacant | textarea |  |
| `hbu-conclusion-text` | HBU Conclusion | textarea |  |
| `hbu-mostprobablebuyer` | Most Probable Buyer | textarea |  |
| `hbu-intro` | HBU Introduction | textarea |  |

## 15 · VALUATIONS (All 3 Approaches) — 92 fields

| Field ID | Label | Type | Req |
|---|---|---|---|
| `calc-adj-capex` | CapEx Adjustment | number |  |
| `calc-adj-leasing` | Leasing Costs | number |  |
| `calc-adj-other` | Other Adjustments | number |  |
| `calc-cap-rate` | Cap Rate (%) | number |  |
| `cap-rate-range-high` | Cap Rate Range High | percentage |  |
| `cap-rate-range-low` | Cap Rate Range Low | percentage |  |
| `calc-exp-admin` | Admin & General | number |  |
| `calc-exp-insurance` | Insurance | number |  |
| `calc-exp-insurance-annual` | Insurance Annual | currency |  |
| `calc-exp-management` | Management | number |  |
| `calc-exp-management-annual` | Management Annual | currency |  |
| `calc-exp-other` | Other Expenses | number |  |
| `calc-exp-other-annual` | Other Annual | currency |  |
| `calc-exp-payroll` | Payroll | number |  |
| `calc-exp-payroll-annual` | Payroll Annual | currency |  |
| `calc-exp-repairs` | Repairs & Maintenance | number |  |
| `calc-exp-repairs-annual` | Repairs Annual | currency |  |
| `calc-exp-reserves` | Replacement Reserves | number |  |
| `calc-exp-taxes` | Real Estate Taxes | number |  |
| `calc-exp-taxes-annual` | Taxes Annual | currency |  |
| `calc-exp-utilities` | Utilities | number |  |
| `calc-exp-utilities-annual` | Utilities Annual | currency |  |
| `dircap-expense01-label` | Expense Line 01 | text |  |
| `dircap-expense02-label` | Expense Line 02 | text |  |
| `dircap-expense03-label` | Expense Line 03 | text |  |
| `dircap-expense04-label` | Expense Line 04 | text |  |
| `dircap-expense05-label` | Expense Line 05 | text |  |
| `dircap-expense06-label` | Expense Line 06 | text |  |
| `dircap-expense07-label` | Expense Line 07 | text |  |
| `dircap-expense08-label` | Expense Line 08 | text |  |
| `dircap-expense09-label` | Expense Line 09 | text |  |
| `dircap-expense10-label` | Expense Line 10 | text |  |
| `dircap-expense11-label` | Expense Line 11 | text |  |
| `dircap-expense12-label` | Expense Line 12 | text |  |
| `dircap-expense13-label` | Expense Line 13 | text |  |
| `dircap-expense14-label` | Expense Line 14 | text |  |
| `dircap-expense15-label` | Expense Line 15 | text |  |
| `dircap-expense16-label` | Expense Line 16 | text |  |
| `dircap-expense17-label` | Expense Line 17 | text |  |
| `dircap-expense18-label` | Expense Line 18 | text |  |
| `dircap-expense19-label` | Expense Line 19 | text |  |
| `dircap-expense20-label` | Expense Line 20 | text |  |
| `dircap-expense21-label` | Expense Line 21 | text |  |
| `dircap-expense22-label` | Expense Line 22 | text |  |
| `dircap-expense23-label` | Expense Line 23 | text |  |
| `dircap-expense24-label` | Expense Line 24 | text |  |
| `dircap-expense25-label` | Expense Line 25 | text |  |
| `exp-insurance-proj-pct` | Insurance Projection % | percentage |  |
| `exp-management-proj-pct` | Management Projection % | percentage |  |
| `exp-other-proj-pct` | Other Expenses Projection % | percentage |  |
| `exp-repairs-proj-pct` | Repairs Projection % | percentage |  |
| `exp-reserves-comment` | Reserves Comment | textarea |  |
| `exp-reserves-proj-pct` | Reserves Projection % | percentage |  |
| `exp-taxes-proj-pct` | Taxes Projection % | percentage |  |
| `exp-utilities-proj-pct` | Utilities Projection % | percentage |  |
| `calc-laundry-per-unit` | Laundry $/Unit/Mo | number |  |
| `calc-other-income` | Other Income Annual | number |  |
| `calc-parking-per-unit` | Parking $/Unit/Mo | number |  |
| `laundry-proj-pct` | Laundry Projection % | percentage |  |
| `other-revenue-proj-pct` | Other Revenue Projection % | percentage |  |
| `parking-proj-pct` | Parking Projection % | percentage |  |
| `rental-revenue-proj-pct` | Rental Revenue Projection % | percentage |  |
| `calc-type1-contract-rent` | Contract Rent/Mo | currency |  |
| `calc-type1-count` | Unit Count | number |  |
| `calc-type1-name` | Unit Type 1 | text |  |
| `calc-type1-rent` | Market Rent/Mo | number |  |
| `calc-type1-sf` | Avg SF | number |  |
| `calc-type2-contract-rent` | Contract Rent/Mo | currency |  |
| `calc-type2-count` | Unit Count | number |  |
| `calc-type2-name` | Unit Type 2 | text |  |
| `calc-type2-rent` | Market Rent/Mo | number |  |
| `calc-type2-sf` | Avg SF | number |  |
| `calc-type3-contract-rent` | Contract Rent/Mo | currency |  |
| `calc-type3-count` | Unit Count | number |  |
| `calc-type3-name` | Unit Type 3 | text |  |
| `calc-type3-rent` | Market Rent/Mo | number |  |
| `calc-type3-sf` | Avg SF | number |  |
| `calc-type4-contract-rent` | Contract Rent/Mo | currency |  |
| `calc-type4-count` | Unit Count | number |  |
| `calc-type4-name` | Unit Type 4 | text |  |
| `calc-type4-rent` | Market Rent/Mo | number |  |
| `calc-type4-sf` | Avg SF | number |  |
| `calc-bad-debt-rate` | Bad Debt Rate (%) | number |  |
| `calc-concessions-rate` | Concessions Rate (%) | number |  |
| `calc-vacancy-rate` | Vacancy Rate (%) | number |  |
| `exp-insurance-comment` | Insurance Comment | text |  |
| `exp-management-comment` | Management Comment | text |  |
| `exp-other-comment` | Other Comment | text |  |
| `exp-payroll-comment` | Payroll Comment | text |  |
| `exp-repairs-comment` | Repairs Comment | text |  |
| `exp-taxes-comment` | Taxes Comment | text |  |
| `exp-utilities-comment` | Utilities Comment | text |  |

## 16 · LAND VALUE — 1 fields

| Field ID | Label | Type | Req |
|---|---|---|---|
| `land-value-conclusion` | Land Value Conclusion | textarea |  |

## 18 · SALES COMPS — 187 fields

| Field ID | Label | Type | Req |
|---|---|---|---|
| `comp1-address-full` | Comp1 Address Full | text |  |
| `comp1-analysis-price` | Comp1 Analysis Price | currency |  |
| `comp1-analysis-price-per-unit` | Comp1 Analysis Price Per Unit | currency |  |
| `comp1-buyer` | Comp1 Buyer | text |  |
| `comp1-cap-rate` | Comp1 Cap Rate | percentage |  |
| `comp1-city-state-zip` | Comp1 City State Zip | text |  |
| `comp1-conditions-of-sale` | Comp1 Conditions of Sale | text |  |
| `comp1-corner` | Comp1 Corner | text |  |
| `comp1-county` | Comp1 County | text |  |
| `comp1-distance` | Comp1 Distance | number |  |
| `comp1-label` | Comp1 Label | text |  |
| `comp1-landarea` | Comp1 Land Area | number |  |
| `comp1-laundry` | Comp1 Laundry | text |  |
| `comp1-map` | Comp1 Map | image |  |
| `comp1-noi-perunit` | Comp1 NOI Per Unit | currency |  |
| `comp1-nra` | Comp1 NRA | number |  |
| `comp1-parking-type` | Comp1 Parking Type | text |  |
| `comp1-photo` | Comp1 Photo | image |  |
| `comp1-price-per-unit` | Comp1 Price Per Unit | currency |  |
| `comp1-proj-amenities` | Comp1 Project Amenities | text |  |
| `comp1-property-name` | Comp1 Property Name | text |  |
| `comp1-property-type` | Comp1 Property Type | text |  |
| `comp1-remarks` | Comp1 Remarks | text |  |
| `comp1-renttype` | Comp1 Rent Type | text |  |
| `comp1-rights-transferred` | Comp1 Rights Transferred | text |  |
| `comp1-sale-date` | Comp1 Sale Date | date |  |
| `comp1-sale-price` | Comp1 Sale Price | currency |  |
| `comp1-security-features` | Comp1 Security Features | text |  |
| `comp1-seller` | Comp1 Seller | text |  |
| `comp1-structures` | Comp1 Structures | number |  |
| `comp1-submarket` | Comp1 Submarket | text |  |
| `comp1-transaction-status` | Comp1 Transaction Status | text |  |
| `comp1-unit-amenities` | Comp1 Unit Amenities | text |  |
| `comp1-unitmix-avgsize` | Comp1 Unit Mix Avg Size | text |  |
| `comp1-unitmix-count` | Comp1 Unit Mix Count | text |  |
| `comp1-unitmix-type` | Comp1 Unit Mix Type | text |  |
| `comp1-utilities` | Comp1 Utilities | text |  |
| `comp1-year-built` | Comp1 Year Built | text |  |
| `comp1-year-built` | Comp1 Year Built | number |  |
| `comp2-address-full` | Comp2 Address Full | text |  |
| `comp2-analysis-price` | Comp2 Analysis Price | currency |  |
| `comp2-buildings` | Comp2 Buildings | text |  |
| `comp2-buyer` | Comp2 Buyer | text |  |
| `comp2-cap-rate` | Comp2 Cap Rate | percentage |  |
| `comp2-city-state-zip` | Comp2 City State Zip | text |  |
| `comp2-county` | Comp2 County | text |  |
| `comp2-distance` | Comp2 Distance | number |  |
| `comp2-label` | Comp2 Label | text |  |
| `comp2-landarea` | Comp2 Land Area | number |  |
| `comp2-laundry` | Comp2 Laundry | text |  |
| `comp2-map` | Comp2 Map | image |  |
| `comp2-market-conditions` | Comp2 Market Conditions | text |  |
| `comp2-nra` | Comp2 NRA | number |  |
| `comp2-parking` | Comp2 Parking | text |  |
| `comp2-parking-type` | Comp2 Parking Type | text |  |
| `comp2-photo` | Comp2 Photo | image |  |
| `comp2-price-per-unit` | Comp2 Price Per Unit | currency |  |
| `comp2-property-name` | Comp2 Property Name | text |  |
| `comp2-property-type` | Comp2 Property Type | text |  |
| `comp2-remarks` | Comp2 Remarks | text |  |
| `comp2-renttype` | Comp2 Rent Type | text |  |
| `comp2-rights-transferred` | Comp2 Rights Transferred | text |  |
| `comp2-sale-date` | Comp2 Sale Date | date |  |
| `comp2-sale-price` | Comp2 Sale Price | currency |  |
| `comp2-security-features` | Comp2 Security Features | text |  |
| `comp2-seller` | Comp2 Seller | text |  |
| `comp2-submarket` | Comp2 Submarket | text |  |
| `comp2-transaction-status` | Comp2 Transaction Status | text |  |
| `comp2-unit-amenities` | Comp2 Unit Amenities | text |  |
| `comp2-unitmix-avgsize` | Comp2 Unit Mix Avg Size | text |  |
| `comp2-unitmix-count` | Comp2 Unit Mix Count | text |  |
| `comp2-unitmix-type` | Comp2 Unit Mix Type | text |  |
| `comp2-utilities` | Comp2 Utilities | text |  |
| `comp2-year-built` | Comp2 Year Built | text |  |
| `comp2-year-built` | Comp2 Year Built | number |  |
| `comp2-zoning` | Comp2 Zoning | text |  |
| `comp3-address-full` | Comp3 Address Full | text |  |
| `comp3-analysis-price` | Comp3 Analysis Price | currency |  |
| `comp3-buildings` | Comp3 Buildings | text |  |
| `comp3-buyer` | Comp3 Buyer | text |  |
| `comp3-cap-rate` | Comp3 Cap Rate | percentage |  |
| `comp3-city-state-zip` | Comp3 City State Zip | text |  |
| `comp3-county` | Comp3 County | text |  |
| `comp3-distance` | Comp3 Distance | number |  |
| `comp3-label` | Comp3 Label | text |  |
| `comp3-landarea` | Comp3 Land Area | number |  |
| `comp3-laundry` | Comp3 Laundry | text |  |
| `comp3-map` | Comp3 Map | image |  |
| `comp3-market-conditions` | Comp3 Market Conditions | text |  |
| `comp3-nra` | Comp3 NRA | number |  |
| `comp3-parking` | Comp3 Parking | text |  |
| `comp3-parking-type` | Comp3 Parking Type | text |  |
| `comp3-photo` | Comp3 Photo | image |  |
| `comp3-price-per-unit` | Comp3 Price Per Unit | currency |  |
| `comp3-property-name` | Comp3 Property Name | text |  |
| `comp3-property-type` | Comp3 Property Type | text |  |
| `comp3-remarks` | Comp3 Remarks | text |  |
| `comp3-renttype` | Comp3 Rent Type | text |  |
| `comp3-rights-transferred` | Comp3 Rights Transferred | text |  |
| `comp3-sale-date` | Comp3 Sale Date | date |  |
| `comp3-sale-price` | Comp3 Sale Price | currency |  |
| `comp3-security-features` | Comp3 Security Features | text |  |
| `comp3-seller` | Comp3 Seller | text |  |
| `comp3-submarket` | Comp3 Submarket | text |  |
| `comp3-transaction-status` | Comp3 Transaction Status | text |  |
| `comp3-unit-amenities` | Comp3 Unit Amenities | text |  |
| `comp3-unitmix-avgsize` | Comp3 Unit Mix Avg Size | text |  |
| `comp3-unitmix-count` | Comp3 Unit Mix Count | text |  |
| `comp3-unitmix-type` | Comp3 Unit Mix Type | text |  |
| `comp3-utilities` | Comp3 Utilities | text |  |
| `comp3-year-built` | Comp3 Year Built | text |  |
| `comp3-year-built` | Comp3 Year Built | number |  |
| `comp3-zoning` | Comp3 Zoning | text |  |
| `comp4-address-full` | Comp4 Address Full | text |  |
| `comp4-analysis-price` | Comp4 Analysis Price | currency |  |
| `comp4-buildings` | Comp4 Buildings | text |  |
| `comp4-buyer` | Comp4 Buyer | text |  |
| `comp4-cap-rate` | Comp4 Cap Rate | percentage |  |
| `comp4-city-state-zip` | Comp4 City State Zip | text |  |
| `comp4-county` | Comp4 County | text |  |
| `comp4-distance` | Comp4 Distance | number |  |
| `comp4-label` | Comp4 Label | text |  |
| `comp4-landarea` | Comp4 Land Area | number |  |
| `comp4-laundry` | Comp4 Laundry | text |  |
| `comp4-map` | Comp4 Map | image |  |
| `comp4-market-conditions` | Comp4 Market Conditions | text |  |
| `comp4-nra` | Comp4 NRA | number |  |
| `comp4-parking` | Comp4 Parking | text |  |
| `comp4-parking-type` | Comp4 Parking Type | text |  |
| `comp4-photo` | Comp4 Photo | image |  |
| `comp4-price-per-unit` | Comp4 Price Per Unit | currency |  |
| `comp4-property-name` | Comp4 Property Name | text |  |
| `comp4-property-type` | Comp4 Property Type | text |  |
| `comp4-remarks` | Comp4 Remarks | text |  |
| `comp4-renttype` | Comp4 Rent Type | text |  |
| `comp4-rights-transferred` | Comp4 Rights Transferred | text |  |
| `comp4-sale-date` | Comp4 Sale Date | date |  |
| `comp4-sale-price` | Comp4 Sale Price | currency |  |
| `comp4-security-features` | Comp4 Security Features | text |  |
| `comp4-seller` | Comp4 Seller | text |  |
| `comp4-submarket` | Comp4 Submarket | text |  |
| `comp4-transaction-status` | Comp4 Transaction Status | text |  |
| `comp4-unit-amenities` | Comp4 Unit Amenities | text |  |
| `comp4-unitmix-avgsize` | Comp4 Unit Mix Avg Size | text |  |
| `comp4-unitmix-count` | Comp4 Unit Mix Count | text |  |
| `comp4-unitmix-type` | Comp4 Unit Mix Type | text |  |
| `comp4-utilities` | Comp4 Utilities | text |  |
| `comp4-year-built` | Comp4 Year Built | text |  |
| `comp4-year-built` | Comp4 Year Built | number |  |
| `comp4-zoning` | Comp4 Zoning | text |  |
| `comp5-address-full` | Comp5 Address Full | text |  |
| `comp5-analysis-price` | Comp5 Analysis Price | currency |  |
| `comp5-buildings` | Comp5 Buildings | text |  |
| `comp5-buyer` | Comp5 Buyer | text |  |
| `comp5-cap-rate` | Comp5 Cap Rate | percentage |  |
| `comp5-city-state-zip` | Comp5 City State Zip | text |  |
| `comp5-county` | Comp5 County | text |  |
| `comp5-distance` | Comp5 Distance | number |  |
| `comp5-label` | Comp5 Label | text |  |
| `comp5-landarea` | Comp5 Land Area | number |  |
| `comp5-laundry` | Comp5 Laundry | text |  |
| `comp5-map` | Comp5 Map | image |  |
| `comp5-market-conditions` | Comp5 Market Conditions | text |  |
| `comp5-nra` | Comp5 NRA | number |  |
| `comp5-parking` | Comp5 Parking | text |  |
| `comp5-parking-type` | Comp5 Parking Type | text |  |
| `comp5-photo` | Comp5 Photo | image |  |
| `comp5-price-per-unit` | Comp5 Price Per Unit | currency |  |
| `comp5-property-name` | Comp5 Property Name | text |  |
| `comp5-property-type` | Comp5 Property Type | text |  |
| `comp5-remarks` | Comp5 Remarks | text |  |
| `comp5-renttype` | Comp5 Rent Type | text |  |
| `comp5-rights-transferred` | Comp5 Rights Transferred | text |  |
| `comp5-sale-date` | Comp5 Sale Date | date |  |
| `comp5-sale-price` | Comp5 Sale Price | currency |  |
| `comp5-security-features` | Comp5 Security Features | text |  |
| `comp5-seller` | Comp5 Seller | text |  |
| `comp5-submarket` | Comp5 Submarket | text |  |
| `comp5-transaction-status` | Comp5 Transaction Status | text |  |
| `comp5-unit-amenities` | Comp5 Unit Amenities | text |  |
| `comp5-unitmix-avgsize` | Comp5 Unit Mix Avg Size | text |  |
| `comp5-unitmix-count` | Comp5 Unit Mix Count | text |  |
| `comp5-unitmix-type` | Comp5 Unit Mix Type | text |  |
| `comp5-utilities` | Comp5 Utilities | text |  |
| `comp5-year-built` | Comp5 Year Built | text |  |
| `comp5-year-built` | Comp5 Year Built | number |  |
| `comp5-zoning` | Comp5 Zoning | text |  |

## 19 · RENT COMPS — 170 fields

| Field ID | Label | Type | Req |
|---|---|---|---|
| `rental-comp1-address-full` | Rental Comp 1 - Full Address | text |  |
| `rental-comp1-distance` | Rental Comp 1 - Distance | text |  |
| `rental-comp1-label` | Rental Comp 1 - Label | text |  |
| `rental-comp2-address-full` | Rental Comp 2 - Full Address | text |  |
| `rental-comp2-distance` | Rental Comp 2 - Distance | text |  |
| `rental-comp2-label` | Rental Comp 2 - Label | text |  |
| `rental-comp3-address-full` | Rental Comp 3 - Full Address | text |  |
| `rental-comp3-distance` | Rental Comp 3 - Distance | text |  |
| `rental-comp3-label` | Rental Comp 3 - Label | text |  |
| `rental-comp4-address-full` | Rental Comp 4 - Full Address | text |  |
| `rental-comp4-distance` | Rental Comp 4 - Distance | text |  |
| `rental-comp4-label` | Rental Comp 4 - Label | text |  |
| `rental-comp5-address-full` | Rental Comp 5 - Full Address | text |  |
| `rental-comp5-distance` | Rental Comp 5 - Distance | text |  |
| `rental-comp5-label` | Rental Comp 5 - Label | text |  |
| `rental-comparables-map` | Rental Comparables Map | image |  |
| `rentcomp1-address` | Rentcomp1 Address | text |  |
| `rentcomp1-appeal` | Rentcomp1 Appeal | text |  |
| `rentcomp1-avg-unit-sf` | Rentcomp1 Avg Unit SF | number |  |
| `rentcomp1-avg-unit-sf` | Rentcomp1 Avg Unit SF | number |  |
| `rentcomp1-city` | Rentcomp1 City | text |  |
| `rentcomp1-condition` | Rentcomp1 Condition | text |  |
| `rentcomp1-laundry` | Rentcomp1 Laundry | text |  |
| `rentcomp1-location` | Rentcomp1 Location | text |  |
| `rentcomp1-name` | Rentcomp1 Name | text |  |
| `rentcomp1-occupancy` | Rentcomp1 Occupancy | percentage |  |
| `rentcomp1-parking-incl` | Rentcomp1 Parking Included | text |  |
| `rentcomp1-parking-incl` | Rentcomp1 Parking Included | text |  |
| `rentcomp1-parking-type` | Rentcomp1 Parking Type | text |  |
| `rentcomp1-parking-type` | Rentcomp1 Parking Type | text |  |
| `rentcomp1-proj-amenities` | Rentcomp1 Project Amenities | text |  |
| `rentcomp1-proj-amenities` | Rentcomp1 Project Amenities | text |  |
| `rentcomp1-province` | Rentcomp1 Province | text |  |
| `rentcomp1-quality` | Rentcomp1 Quality | text |  |
| `rentcomp1-rent-sf-avg` | Rentcomp1 Rent/SF Avg | currency |  |
| `rentcomp1-rent-sf-avg` | Rentcomp1 Rent/SF Avg | currency |  |
| `rentcomp1-rent-unit-avg` | Rentcomp1 Rent/Unit Avg | currency |  |
| `rentcomp1-rent-unit-avg` | Rentcomp1 Rent/Unit Avg | currency |  |
| `rentcomp1-renttype` | Rentcomp1 Rent Type | text |  |
| `rentcomp1-security` | Rentcomp1 Security | text |  |
| `rentcomp1-surveycomments` | Rentcomp1 Survey Comments | text |  |
| `rentcomp1-totaladj` | Rentcomp1 Total Adj | currency |  |
| `rentcomp1-unit-amenities` | Rentcomp1 Unit Amenities | text |  |
| `rentcomp1-unit-amenities` | Rentcomp1 Unit Amenities | text |  |
| `rentcomp1-units` | Rentcomp1 Units | number |  |
| `rentcomp1-utilities` | Rentcomp1 Utilities | text |  |
| `rentcomp2-address` | Rentcomp2 Address | text |  |
| `rentcomp2-appeal` | Rentcomp2 Appeal | text |  |
| `rentcomp2-avg-unit-sf` | Rentcomp2 Avg Unit SF | number |  |
| `rentcomp2-avg-unit-sf` | Rentcomp2 Avg Unit SF | number |  |
| `rentcomp2-city` | Rentcomp2 City | text |  |
| `rentcomp2-condition` | Rentcomp2 Condition | text |  |
| `rentcomp2-laundry` | Rentcomp2 Laundry | text |  |
| `rentcomp2-location` | Rentcomp2 Location | text |  |
| `rentcomp2-name` | Rentcomp2 Name | text |  |
| `rentcomp2-occupancy` | Rentcomp2 Occupancy | percentage |  |
| `rentcomp2-parking-incl` | Rentcomp2 Parking Included | text |  |
| `rentcomp2-parking-incl` | Rentcomp2 Parking Included | text |  |
| `rentcomp2-parking-type` | Rentcomp2 Parking Type | text |  |
| `rentcomp2-parking-type` | Rentcomp2 Parking Type | text |  |
| `rentcomp2-proj-amenities` | Rentcomp2 Project Amenities | text |  |
| `rentcomp2-proj-amenities` | Rentcomp2 Project Amenities | text |  |
| `rentcomp2-province` | Rentcomp2 Province | text |  |
| `rentcomp2-quality` | Rentcomp2 Quality | text |  |
| `rentcomp2-rent-sf-avg` | Rentcomp2 Rent/SF Avg | currency |  |
| `rentcomp2-rent-sf-avg` | Rentcomp2 Rent/SF Avg | currency |  |
| `rentcomp2-rent-unit-avg` | Rentcomp2 Rent/Unit Avg | currency |  |
| `rentcomp2-rent-unit-avg` | Rentcomp2 Rent/Unit Avg | currency |  |
| `rentcomp2-renttype` | Rentcomp2 Rent Type | text |  |
| `rentcomp2-security` | Rentcomp2 Security | text |  |
| `rentcomp2-surveycomments` | Rentcomp2 Survey Comments | text |  |
| `rentcomp2-totaladj` | Rentcomp2 Total Adj | currency |  |
| `rentcomp2-unit-amenities` | Rentcomp2 Unit Amenities | text |  |
| `rentcomp2-unit-amenities` | Rentcomp2 Unit Amenities | text |  |
| `rentcomp2-units` | Rentcomp2 Units | number |  |
| `rentcomp2-utilities` | Rentcomp2 Utilities | text |  |
| `rentcomp3-address` | Rentcomp3 Address | text |  |
| `rentcomp3-appeal` | Rentcomp3 Appeal | text |  |
| `rentcomp3-avg-unit-sf` | Rentcomp3 Avg Unit SF | number |  |
| `rentcomp3-avg-unit-sf` | Rentcomp3 Avg Unit SF | number |  |
| `rentcomp3-city` | Rentcomp3 City | text |  |
| `rentcomp3-condition` | Rentcomp3 Condition | text |  |
| `rentcomp3-laundry` | Rentcomp3 Laundry | text |  |
| `rentcomp3-location` | Rentcomp3 Location | text |  |
| `rentcomp3-name` | Rentcomp3 Name | text |  |
| `rentcomp3-occupancy` | Rentcomp3 Occupancy | percentage |  |
| `rentcomp3-parking-incl` | Rentcomp3 Parking Included | text |  |
| `rentcomp3-parking-incl` | Rentcomp3 Parking Included | text |  |
| `rentcomp3-parking-type` | Rentcomp3 Parking Type | text |  |
| `rentcomp3-parking-type` | Rentcomp3 Parking Type | text |  |
| `rentcomp3-proj-amenities` | Rentcomp3 Project Amenities | text |  |
| `rentcomp3-proj-amenities` | Rentcomp3 Project Amenities | text |  |
| `rentcomp3-province` | Rentcomp3 Province | text |  |
| `rentcomp3-quality` | Rentcomp3 Quality | text |  |
| `rentcomp3-rent-sf-avg` | Rentcomp3 Rent/SF Avg | currency |  |
| `rentcomp3-rent-sf-avg` | Rentcomp3 Rent/SF Avg | currency |  |
| `rentcomp3-rent-unit-avg` | Rentcomp3 Rent/Unit Avg | currency |  |
| `rentcomp3-rent-unit-avg` | Rentcomp3 Rent/Unit Avg | currency |  |
| `rentcomp3-renttype` | Rentcomp3 Rent Type | text |  |
| `rentcomp3-security` | Rentcomp3 Security | text |  |
| `rentcomp3-surveycomments` | Rentcomp3 Survey Comments | text |  |
| `rentcomp3-totaladj` | Rentcomp3 Total Adj | currency |  |
| `rentcomp3-unit-amenities` | Rentcomp3 Unit Amenities | text |  |
| `rentcomp3-unit-amenities` | Rentcomp3 Unit Amenities | text |  |
| `rentcomp3-units` | Rentcomp3 Units | number |  |
| `rentcomp3-utilities` | Rentcomp3 Utilities | text |  |
| `rentcomp4-address` | Rentcomp4 Address | text |  |
| `rentcomp4-appeal` | Rentcomp4 Appeal | text |  |
| `rentcomp4-avg-unit-sf` | Rentcomp4 Avg Unit SF | number |  |
| `rentcomp4-avg-unit-sf` | Rentcomp4 Avg Unit SF | number |  |
| `rentcomp4-city` | Rentcomp4 City | text |  |
| `rentcomp4-condition` | Rentcomp4 Condition | text |  |
| `rentcomp4-laundry` | Rentcomp4 Laundry | text |  |
| `rentcomp4-location` | Rentcomp4 Location | text |  |
| `rentcomp4-name` | Rentcomp4 Name | text |  |
| `rentcomp4-occupancy` | Rentcomp4 Occupancy | percentage |  |
| `rentcomp4-parking-incl` | Rentcomp4 Parking Included | text |  |
| `rentcomp4-parking-incl` | Rentcomp4 Parking Included | text |  |
| `rentcomp4-parking-type` | Rentcomp4 Parking Type | text |  |
| `rentcomp4-parking-type` | Rentcomp4 Parking Type | text |  |
| `rentcomp4-proj-amenities` | Rentcomp4 Project Amenities | text |  |
| `rentcomp4-proj-amenities` | Rentcomp4 Project Amenities | text |  |
| `rentcomp4-province` | Rentcomp4 Province | text |  |
| `rentcomp4-quality` | Rentcomp4 Quality | text |  |
| `rentcomp4-rent-sf-avg` | Rentcomp4 Rent/SF Avg | currency |  |
| `rentcomp4-rent-sf-avg` | Rentcomp4 Rent/SF Avg | currency |  |
| `rentcomp4-rent-unit-avg` | Rentcomp4 Rent/Unit Avg | currency |  |
| `rentcomp4-rent-unit-avg` | Rentcomp4 Rent/Unit Avg | currency |  |
| `rentcomp4-renttype` | Rentcomp4 Rent Type | text |  |
| `rentcomp4-security` | Rentcomp4 Security | text |  |
| `rentcomp4-surveycomments` | Rentcomp4 Survey Comments | text |  |
| `rentcomp4-totaladj` | Rentcomp4 Total Adj | currency |  |
| `rentcomp4-unit-amenities` | Rentcomp4 Unit Amenities | text |  |
| `rentcomp4-unit-amenities` | Rentcomp4 Unit Amenities | text |  |
| `rentcomp4-units` | Rentcomp4 Units | number |  |
| `rentcomp4-utilities` | Rentcomp4 Utilities | text |  |
| `rentcomp5-address` | Rentcomp5 Address | text |  |
| `rentcomp5-appeal` | Rentcomp5 Appeal | text |  |
| `rentcomp5-avg-unit-sf` | Rentcomp5 Avg Unit SF | number |  |
| `rentcomp5-avg-unit-sf` | Rentcomp5 Avg Unit SF | number |  |
| `rentcomp5-city` | Rentcomp5 City | text |  |
| `rentcomp5-condition` | Rentcomp5 Condition | text |  |
| `rentcomp5-laundry` | Rentcomp5 Laundry | text |  |
| `rentcomp5-location` | Rentcomp5 Location | text |  |
| `rentcomp5-name` | Rentcomp5 Name | text |  |
| `rentcomp5-occupancy` | Rentcomp5 Occupancy | percentage |  |
| `rentcomp5-parking-incl` | Rentcomp5 Parking Included | text |  |
| `rentcomp5-parking-incl` | Rentcomp5 Parking Included | text |  |
| `rentcomp5-parking-type` | Rentcomp5 Parking Type | text |  |
| `rentcomp5-parking-type` | Rentcomp5 Parking Type | text |  |
| `rentcomp5-proj-amenities` | Rentcomp5 Project Amenities | text |  |
| `rentcomp5-proj-amenities` | Rentcomp5 Project Amenities | text |  |
| `rentcomp5-province` | Rentcomp5 Province | text |  |
| `rentcomp5-quality` | Rentcomp5 Quality | text |  |
| `rentcomp5-rent-sf-avg` | Rentcomp5 Rent/SF Avg | currency |  |
| `rentcomp5-rent-sf-avg` | Rentcomp5 Rent/SF Avg | currency |  |
| `rentcomp5-rent-unit-avg` | Rentcomp5 Rent/Unit Avg | currency |  |
| `rentcomp5-rent-unit-avg` | Rentcomp5 Rent/Unit Avg | currency |  |
| `rentcomp5-renttype` | Rentcomp5 Rent Type | text |  |
| `rentcomp5-security` | Rentcomp5 Security | text |  |
| `rentcomp5-surveycomments` | Rentcomp5 Survey Comments | text |  |
| `rentcomp5-totaladj` | Rentcomp5 Total Adj | currency |  |
| `rentcomp5-unit-amenities` | Rentcomp5 Unit Amenities | text |  |
| `rentcomp5-unit-amenities` | Rentcomp5 Unit Amenities | text |  |
| `rentcomp5-units` | Rentcomp5 Units | number |  |
| `rentcomp5-utilities` | Rentcomp5 Utilities | text |  |
| `survey-conclusion` | Rental Survey Conclusion | textarea |  |
| `survey-intro` | Rental Survey Introduction | textarea |  |
| `survey-market-rent-support` | Market Rent Support Narrative | textarea |  |
| `survey-methodology` | Survey Methodology | textarea |  |

## 20 · RENT ROLL — 14 fields

| Field ID | Label | Type | Req |
|---|---|---|---|
| `rentroll-type1-actual-unit` | Type 1 Actual Rent/Unit | currency |  |
| `rentroll-type1-desc` | Type 1 Description | text |  |
| `rentroll-type1-name` | Type 1 Name | text |  |
| `rentroll-type1-occ` | Type 1 Occupied | number |  |
| `rentroll-type1-recent-sf` | Type 1 Recent Rent/SF | currency |  |
| `rentroll-type1-size` | Type 1 Size (SF) | number |  |
| `rentroll-type1-vac` | Type 1 Vacant | number |  |
| `rentroll-type2-actual-unit` | Type 2 Actual Rent/Unit | currency |  |
| `rentroll-type2-desc` | Type 2 Description | text |  |
| `rentroll-type2-name` | Type 2 Name | text |  |
| `rentroll-type2-occ` | Type 2 Occupied | number |  |
| `rentroll-type2-recent-sf` | Type 2 Recent Rent/SF | currency |  |
| `rentroll-type2-size` | Type 2 Size (SF) | number |  |
| `rentroll-type2-vac` | Type 2 Vacant | number |  |

## 21 · RECONCILIATION — 8 fields

| Field ID | Label | Type | Req |
|---|---|---|---|
| `property-is-listed` | Property Currently Listed | select |  |
| `use-dcf-methodology` | Use DCF Methodology | select |  |
| `recon-narrative` | Reconciliation Narrative | textarea |  |
| `recon-cost-weight` | Cost Weight (%) | number |  |
| `recon-income-weight` | Income Weight (%) | number |  |
| `recon-sales-weight` | Sales Weight (%) | number |  |
| `recon-cost-value` | Cost Approach Value | number |  |
| `recon-sales-value` | Sales Comparison Value | number |  |

## 22 · CERTIFICATION — 21 fields

| Field ID | Label | Type | Req |
|---|---|---|---|
| `appraiser-bio-paragraph1` | Appraiser Bio Paragraph 1 | textarea |  |
| `appraiser-bio-paragraph2` | Appraiser Bio Paragraph 2 | textarea |  |
| `appraiser-headshot` | Appraiser Headshot | image |  |
| `appraiser-rics` | RICS Membership Number | text |  |
| `appraiser1-allunits` | Appraiser 1 Inspected All Units | boolean |  |
| `appraiser1-ce` | Appraiser 1 CE Completed | boolean |  |
| `appraiser1-ethics` | Appraiser 1 Ethics Completed | boolean |  |
| `appraiser1-extent` | Appraiser 1 Inspection Extent | text |  |
| `appraiser1-inspected` | Appraiser 1 Inspected Property | boolean |  |
| `appraiser1-inspectiondate` | Appraiser 1 Inspection Date | date |  |
| `appraiser1-inspector` | Appraiser 1 Inspected Property | boolean |  |
| `appraiser1-role` | Appraiser 1 Role | dropdown |  |
| `appraiser2-allunits` | Appraiser 2 Inspected All Units | boolean |  |
| `appraiser2-ce` | Appraiser 2 CE Completed | boolean |  |
| `appraiser2-ethics` | Appraiser 2 Ethics Completed | boolean |  |
| `appraiser2-extent` | Appraiser 2 Inspection Extent | text |  |
| `appraiser2-inspected` | Appraiser 2 Inspected Property | boolean |  |
| `appraiser2-inspectiondate` | Appraiser 2 Inspection Date | date |  |
| `appraiser2-inspector` | Appraiser 2 Inspected Property | boolean |  |
| `appraiser2-role` | Appraiser 2 Role | dropdown |  |
| `cert-signature` | Signature Image | image |  |

---

# Appendix — flagged for review

### Hidden / possibly-legacy input sections (NOT shown in the workbench)
These code-sections hold user-input fields but the workbench hides them (consolidated into 15·VALUATIONS, or superseded). Confirm they're not dead duplicates:

| Code section | user-input fields |
|---|---|
| `cost` | 18 |
| `cost-s` | 1 |
| `income` | 24 |
| `photos` | 5 |
| `sales` | 193 |

### Derived / output fields (NOT inputs) — 525
Formula/auto/api fields. Products of the inputs above; not registry input entries.

| inputSource | count |
|---|---|
| api-fetch | 8 |
| auto-filled | 95 |
| calculated | 421 |
| valcre-mapping | 1 |
