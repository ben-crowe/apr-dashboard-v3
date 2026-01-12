# TDD Dashboard vs Editor Panel: Complete Tab & Field Comparison

**Created:** 2025-12-24 06:00 MST
**Purpose:** Document the architectural difference between TDD (Test Data Dashboard) and Editor Panel tab structures
**Status:** Complete field mapping for all 24 TDD tabs vs 21 Editor tabs

---

## Executive Summary

The APR Dashboard uses **TWO distinct interfaces** for different workflows:

- **TDD Dashboard:** 24 tabs (S1-S3 + 01-22) - Bulk data entry mode
- **Editor Panel:** 21 tabs (01-22 only) - Contextual review mode with live preview

**Key Difference:** S-tabs (S1/S2/S3) are TDD-only. They consolidate data entry but don't appear in the Editor Panel because their fields are edited contextually within numbered report pages.

---

## Quick Comparison Table

| Interface | Total Tabs | S-Tabs | Numbered Tabs | Purpose |
|-----------|-----------|---------|---------------|---------|
| **TDD Dashboard** | 24 | S1, S2, S3 | 01-22 (with gaps) | Bulk data gathering |
| **Editor Panel** | 21 | None | 01-22 (with gaps) | Contextual editing with live preview |

### Tab Presence Matrix

| Tab Name | TDD | Editor | Notes |
|----------|-----|--------|-------|
| S1 - Client Intake | ✅ | ❌ | TDD-only (fields populate to 01, 02) |
| S2 - LOE Prep | ✅ | ❌ | TDD-only (fields populate to 01, 22) |
| S3 - Image Management | ✅ | ❌ | TDD-only (images editable in context in Editor) |
| 01 - Cover Page | ✅ | ✅ | Fields from S1/S2 shown as links in TDD |
| 02 - Introduction Letter | ✅ | ✅ | - |
| 03 - Location Maps | ❌ | ❌ | Hidden (consolidated into S3 in TDD) |
| 04 - Identification of Assignment | ✅ | ✅ | - |
| 05 - Report Information | ✅ | ✅ | - |
| 06 - Executive Summary | ✅ | ✅ | - |
| 07 - Property Photographs | ❌ | ❌ | Hidden (consolidated into S3 in TDD) |
| 08 - Site Details | ✅ | ✅ | - |
| 09 - Location Analysis | ✅ | ✅ | - |
| 10 - Property Taxes | ✅ | ✅ | - |
| 11 - Market Analysis | ✅ | ✅ | - |
| 12 - Improvements | ✅ | ✅ | - |
| 13 - Zoning | ✅ | ✅ | Images shown as "Managed in S3" links in TDD |
| 14 - Highest & Best Use | ✅ | ✅ | - |
| 15 - Valuations (All 3 Approaches) | ✅ | ✅ | - |
| 16 - Land Value | ✅ | ✅ | - |
| 17 - Cost Approach | ❌ | ❌ | Hidden (consolidated into 15) |
| 18 - Sales Comparison | ✅ | ✅ | Images shown as "Managed in S3" links in TDD |
| 19 - Income Approach | ❌ | ❌ | Hidden (consolidated into 15) |
| 20 - Rental Survey | ✅ | ✅ | Images shown as "Managed in S3" links in TDD |
| 21 - Reconciliation | ✅ | ✅ | - |
| 22 - Certification | ✅ | ✅ | Signature shown as "Managed in S3" link in TDD |

**Hidden Tabs (neither TDD nor Editor):** 03, 07, 17, 19 - Fields consolidated elsewhere
**TDD Total:** 21 visible tabs (S1-S3 + 18 numbered)
**Editor Total:** 21 visible tabs (numbered only, no S-tabs)

---

## 1. TDD Dashboard Tab Structure (24 Tabs)

### S-Tabs (TDD-Only Operational Sections)

#### S1 - CLIENT INTAKE (V3)
**Purpose:** Initial client/property information gathering
**Fields:** 22 total

<details>
<summary>📋 Client Information Subsection (10 fields)</summary>

| Field ID | Label | Type | Source |
|----------|-------|------|--------|
| `client-first-name` | Client First Name | text | user-input |
| `client-last-name` | Client Last Name | text | user-input |
| `client-email` | Client Email | text | user-input |
| `client-phone` | Client Phone | text | user-input |
| `client-title` | Client Title | text | user-input |
| `client-organization` | Organization | text | user-input |
| `client-address` | Client Address | text | user-input |
| `client-city` | Client City | text | user-input |
| `client-province` | Client Province | text | user-input |
| `client-full-name` | Client Full Name | text | calculated |

</details>

<details>
<summary>📋 Property Information Subsection (6 fields)</summary>

| Field ID | Label | Type | Source |
|----------|-------|------|--------|
| `property-name` | Property Name | text | user-input |
| `property-address` | Property Address | text | user-input |
| `property-type` | Property Type | text | user-input |
| `intended-use` | Intended Use | text | user-input |
| `valuation-premises` | Valuation Premises | text | user-input |
| `asset-condition` | Asset Condition | text | user-input |

</details>

<details>
<summary>📋 Property Contact Subsection (5 fields)</summary>

| Field ID | Label | Type | Source |
|----------|-------|------|--------|
| `contact-first-name` | Contact First Name | text | user-input |
| `contact-last-name` | Contact Last Name | text | user-input |
| `contact-email` | Contact Email | text | user-input |
| `contact-phone` | Contact Phone | text | user-input |
| `contact-full-name` | Contact Full Name | text | calculated |

</details>

<details>
<summary>📋 Notes Subsection (1 field)</summary>

| Field ID | Label | Type | Source |
|----------|-------|------|--------|
| `intake-notes` | Notes | textarea | user-input |

</details>

**Where These Fields Appear:**
- `client-*` fields → Populate to **01 - Cover Page** (shown as "Managed in S1" links in TDD)
- `property-name` → Appears throughout report
- `contact-*` fields → Used in various report sections

---

#### S2 - LOE PREP (V3)
**Purpose:** Letter of Engagement and appraiser assignment details
**Fields:** 18 total

<details>
<summary>📋 Job Assignment Subsection (1 field)</summary>

| Field ID | Label | Type | Source |
|----------|-------|------|--------|
| `job-number` | Valcre Job ID (VAL#) | text | user-input |

</details>

<details>
<summary>📋 Financial Terms Subsection (3 fields)</summary>

| Field ID | Label | Type | Source |
|----------|-------|------|--------|
| `appraisal-fee` | Appraisal Fee | currency | user-input |
| `retainer-amount` | Retainer Amount | currency | user-input |
| `payment-terms` | Payment Terms | text | user-input |

</details>

<details>
<summary>📋 Delivery Details Subsection (3 fields)</summary>

| Field ID | Label | Type | Source |
|----------|-------|------|--------|
| `delivery-date` | Delivery Date | date | user-input |
| `report-type` | Report Type | text | user-input |
| `property-rights` | Property Rights Appraised | text | user-input |

</details>

<details>
<summary>📋 Scope Subsection (2 fields)</summary>

| Field ID | Label | Type | Source |
|----------|-------|------|--------|
| `scope-of-work` | Scope of Work | textarea | user-input |
| `special-instructions` | Special Instructions | textarea | user-input |

</details>

<details>
<summary>📋 Comments Subsection (2 fields)</summary>

| Field ID | Label | Type | Source |
|----------|-------|------|--------|
| `internal-comments` | Internal Comments | textarea | user-input |
| `appraiser-comments` | Appraiser Comments | textarea | user-input |

</details>

<details>
<summary>📋 Appraiser Info Subsection (7 fields)</summary>

| Field ID | Label | Type | Source |
|----------|-------|------|--------|
| `appraiser-name` | Appraiser Name | text | user-input |
| `appraiser-credentials` | Appraiser Credentials | text | user-input |
| `appraiser-title` | Appraiser Title | text | user-input |
| `appraiser-email` | Appraiser Email | text | user-input |
| `appraiser-aic` | AIC Number | text | user-input |
| `valuation-date` | Date of Valuation | date | user-input |
| `report-date` | Date of Report | date | auto-filled |

</details>

**Where These Fields Appear:**
- `appraiser-*` fields → Populate to **01 - Cover Page** and **22 - Certification** (shown as "Managed in S2" links in TDD)
- `job-number` → Used for tracking/workflow
- Financial/delivery fields → LOE document generation

---

#### S3 - IMAGE MANAGEMENT
**Purpose:** Centralized bulk image upload location
**Fields:** 70+ image slots organized by destination

<details>
<summary>📷 01 - Cover & Signature (2 fields)</summary>

| Field ID | Label | Destination |
|----------|-------|-------------|
| `img-cover-photo` | Cover Photo - Main property image | 01 - Cover Page |
| `img-signature` | Appraiser Signature | 01 - Cover, 22 - Certification |

</details>

<details>
<summary>📷 03 - Location Maps (8 fields)</summary>

| Field ID | Label | Destination |
|----------|-------|-------------|
| `img-map-regional` | Regional Map - Province/region context | 03 - Location Maps |
| `img-map-regional-title` | Title | Caption field |
| `img-map-local` | Local Area Map - City/neighborhood | 03 - Location Maps |
| `img-map-local-title` | Title | Caption field |
| `img-map-aerial-1` | Aerial View - Bird's eye of property | 03 - Location Maps |
| `img-map-aerial-1-title` | Title | Caption field |
| `img-map-aerial-2` | Site Boundary - Property lines shown | 03 - Location Maps |
| `img-map-aerial-2-title` | Title | Caption field |

</details>

<details>
<summary>📷 03 - Additional Maps (4 fields)</summary>

| Field ID | Label | Destination |
|----------|-------|-------------|
| `img-zoning-map` | Zoning Map - Municipal zoning | 13 - Zoning |
| `zoning-map-title` | Zoning Map Title | Caption field |
| `img-site-plan-1` | Site Plan - Layout/footprint | 08 - Site Details |
| `site-plan-1-title` | Site Plan 1 Title | Caption field |

</details>

<details>
<summary>📷 07 - Exterior Photos (12 fields = 6 images + 6 captions)</summary>

| Field ID | Label | Destination |
|----------|-------|-------------|
| `img-exterior-1` | Exterior 1 - Front Facade | 07 - Property Photographs |
| `img-exterior-1-caption` | Caption | Caption field |
| `img-exterior-2` | Exterior 2 - Rear Elevation | 07 - Property Photographs |
| `img-exterior-2-caption` | Caption | Caption field |
| `img-exterior-3` | Exterior 3 - Left Side | 07 - Property Photographs |
| `img-exterior-3-caption` | Caption | Caption field |
| `img-exterior-4` | Exterior 4 - Right Side | 07 - Property Photographs |
| `img-exterior-4-caption` | Caption | Caption field |
| `img-exterior-5` | Exterior 5 - Detail/Feature | 07 - Property Photographs |
| `img-exterior-5-caption` | Caption | Caption field |
| `img-exterior-6` | Exterior 6 - Additional | 07 - Property Photographs |
| `img-exterior-6-caption` | Caption | Caption field |

</details>

<details>
<summary>📷 07 - Street Views (6 fields = 3 images + 3 captions)</summary>

| Field ID | Label | Destination |
|----------|-------|-------------|
| `img-street-1` | Street View 1 - Looking North | 07 - Property Photographs |
| `img-street-1-caption` | Caption | Caption field |
| `img-street-2` | Street View 2 - Looking South | 07 - Property Photographs |
| `img-street-2-caption` | Caption | Caption field |
| `img-street-3` | Street View 3 - Streetscape/Context | 07 - Property Photographs |
| `img-street-3-caption` | Caption | Caption field |

</details>

<details>
<summary>📷 07 - Common Areas (8 fields = 4 images + 4 captions)</summary>

| Field ID | Label | Destination |
|----------|-------|-------------|
| `img-common-1` | Common Area 1 - Lobby/Entrance | 07 - Property Photographs |
| `img-common-1-caption` | Caption | Caption field |
| `img-common-2` | Common Area 2 - Hallway/Corridor | 07 - Property Photographs |
| `img-common-2-caption` | Caption | Caption field |
| `img-common-3` | Common Area 3 - Amenity Space | 07 - Property Photographs |
| `img-common-3-caption` | Caption | Caption field |
| `img-common-4` | Common Area 4 - Additional | 07 - Property Photographs |
| `img-common-4-caption` | Caption | Caption field |

</details>

<details>
<summary>📷 07 - Unit Interiors (12 fields = 6 images + 6 captions)</summary>

| Field ID | Label | Destination |
|----------|-------|-------------|
| `img-unit-1` | Unit Interior 1 - Living Room | 07 - Property Photographs |
| `img-unit-1-caption` | Caption | Caption field |
| `img-unit-2` | Unit Interior 2 - Kitchen | 07 - Property Photographs |
| `img-unit-2-caption` | Caption | Caption field |
| `img-unit-3` | Unit Interior 3 - Bedroom | 07 - Property Photographs |
| `img-unit-3-caption` | Caption | Caption field |
| `img-unit-4` | Unit Interior 4 - Bathroom | 07 - Property Photographs |
| `img-unit-4-caption` | Caption | Caption field |
| `img-unit-5` | Unit Interior 5 - Additional Room | 07 - Property Photographs |
| `img-unit-5-caption` | Caption | Caption field |
| `img-unit-6` | Unit Interior 6 - Additional | 07 - Property Photographs |
| `img-unit-6-caption` | Caption | Caption field |

</details>

<details>
<summary>📷 07 - Building Systems (8 fields = 4 images + 4 captions)</summary>

| Field ID | Label | Destination |
|----------|-------|-------------|
| `img-systems-1` | Building Systems 1 - Mechanical Room | 07 - Property Photographs |
| `img-systems-1-caption` | Caption | Caption field |
| `img-systems-2` | Building Systems 2 - Electrical Panel | 07 - Property Photographs |
| `img-systems-2-caption` | Caption | Caption field |
| `img-systems-3` | Building Systems 3 - Plumbing/Water Heater | 07 - Property Photographs |
| `img-systems-3-caption` | Caption | Caption field |
| `img-systems-4` | Building Systems 4 - Additional | 07 - Property Photographs |
| `img-systems-4-caption` | Caption | Caption field |

</details>

<details>
<summary>📷 Sales Comp Photos (10 fields = 5 images + 5 captions)</summary>

| Field ID | Label | Destination |
|----------|-------|-------------|
| `comp1-photo` | Comp 1 Photo | 18 - Sales Comparison |
| `comp1-photo-caption` | Caption | Caption field |
| `comp2-photo` | Comp 2 Photo | 18 - Sales Comparison |
| `comp2-photo-caption` | Caption | Caption field |
| `comp3-photo` | Comp 3 Photo | 18 - Sales Comparison |
| `comp3-photo-caption` | Caption | Caption field |
| `comp4-photo` | Comp 4 Photo | 18 - Sales Comparison |
| `comp4-photo-caption` | Caption | Caption field |
| `comp5-photo` | Comp 5 Photo | 18 - Sales Comparison |
| `comp5-photo-caption` | Caption | Caption field |

</details>

<details>
<summary>📷 Sales Comp Maps (5 fields)</summary>

| Field ID | Label | Destination |
|----------|-------|-------------|
| `comp1-map` | Comp 1 Map | 18 - Sales Comparison |
| `comp2-map` | Comp 2 Map | 18 - Sales Comparison |
| `comp3-map` | Comp 3 Map | 18 - Sales Comparison |
| `comp4-map` | Comp 4 Map | 18 - Sales Comparison |
| `comp5-map` | Comp 5 Map | 18 - Sales Comparison |

</details>

<details>
<summary>📷 Rental Comp Photos (1 field)</summary>

| Field ID | Label | Destination |
|----------|-------|-------------|
| `rental-comparables-map` | Rental Comparables Map | 20 - Rental Survey |

</details>

**Total Image Fields in S3:** ~70 fields (images + captions)

**Key Pattern:**
- In **TDD:** Upload all images in S3 bulk mode
- In **Editor Panel:** Same images editable in context on their destination pages (e.g., edit zoning map while viewing Page 13)

---

### Numbered Tabs (01-22)

These tabs exist in BOTH TDD and Editor Panel. The difference:

- **In TDD:** Some fields show as "Managed in S1/S2/S3" links (bulk entry elsewhere)
- **In Editor:** ALL fields are directly editable (contextual editing)

#### 01 - COVER PAGE
**Fields in TDD:** Mix of editable + links to S1/S2
**Fields in Editor:** All directly editable

<details>
<summary>📝 Fields (15 total)</summary>

| Field ID | Label | TDD Display | Editor Display |
|----------|-------|-------------|----------------|
| `property-name` | Property Name | 🔗 Link to S1 | ✏️ Direct edit |
| `property-address` | Property Address | 🔗 Link to S1 | ✏️ Direct edit |
| `client-title` | Client Title | 🔗 Link to S1 | ✏️ Direct edit |
| `client-address` | Client Address | 🔗 Link to S1 | ✏️ Direct edit |
| `client-city` | Client City | 🔗 Link to S1 | ✏️ Direct edit |
| `client-province` | Client Province | 🔗 Link to S1 | ✏️ Direct edit |
| `appraiser-name` | Appraiser Name | 🔗 Link to S2 | ✏️ Direct edit |
| `appraiser-credentials` | Credentials | 🔗 Link to S2 | ✏️ Direct edit |
| `appraiser-title` | Appraiser Title | 🔗 Link to S2 | ✏️ Direct edit |
| `appraiser-email` | Appraiser Email | 🔗 Link to S2 | ✏️ Direct edit |
| `appraiser-aic` | AIC Number | 🔗 Link to S2 | ✏️ Direct edit |
| `valuation-date` | Date of Valuation | 🔗 Link to S2 | ✏️ Direct edit |
| `report-date` | Date of Report | 🔗 Link to S2 | ✏️ Direct edit |
| `cover-photo` | Cover Photo | 🔗 Link to S3 | ✏️ Direct edit |
| `appraiser1-signature` | Appraiser Signature | 🔗 Link to S3 | ✏️ Direct edit |

</details>

**Pattern:** In TDD, clicking "Managed in S1/S2/S3" scrolls to that section for bulk editing

---

#### 02 - INTRODUCTION LETTER
**Fields:** All directly editable in both TDD and Editor

<details>
<summary>📝 Fields (8 total)</summary>

| Field ID | Label | Type |
|----------|-------|------|
| `intro-letter-date` | Letter Date | date |
| `intro-recipient-name` | Recipient Name | text |
| `intro-recipient-title` | Recipient Title | text |
| `intro-recipient-company` | Recipient Company | text |
| `intro-salutation` | Salutation | text |
| `intro-body` | Letter Body | textarea |
| `intro-closing` | Closing | text |
| `intro-signature-name` | Signature Name | text |

</details>

---

#### 04 - IDENTIFICATION OF ASSIGNMENT
**Fields:** All directly editable in both TDD and Editor

<details>
<summary>📝 Fields (12 total)</summary>

| Field ID | Label | Type |
|----------|-------|------|
| `assignment-client` | Client | text |
| `assignment-property-type` | Property Type | text |
| `assignment-property-address` | Property Address | text |
| `assignment-legal-description` | Legal Description | textarea |
| `assignment-property-rights` | Property Rights Appraised | text |
| `assignment-intended-use` | Intended Use of Report | text |
| `assignment-valuation-date` | Date of Valuation | date |
| `assignment-report-date` | Date of Report | date |
| `assignment-scope-of-work` | Scope of Work | textarea |
| `assignment-extraordinary-assumptions` | Extraordinary Assumptions | textarea |
| `assignment-limiting-conditions` | Limiting Conditions | textarea |
| `assignment-appraiser-certification` | Appraiser Certification | textarea |

</details>

---

#### 05 - REPORT INFORMATION
**Fields:** All directly editable in both TDD and Editor

<details>
<summary>📝 Fields (10 total)</summary>

| Field ID | Label | Type |
|----------|-------|------|
| `report-type` | Report Type | text |
| `report-purpose` | Purpose of Appraisal | text |
| `report-intended-users` | Intended Users | text |
| `report-effective-date` | Effective Date | date |
| `report-inspection-date` | Inspection Date | date |
| `report-completion-date` | Completion Date | date |
| `report-assumptions` | Assumptions | textarea |
| `report-limiting-conditions` | Limiting Conditions | textarea |
| `report-certification` | Certification | textarea |
| `report-signature` | Signature | image |

</details>

---

#### 06 - EXECUTIVE SUMMARY
**Fields:** All directly editable in both TDD and Editor

<details>
<summary>📝 Fields (15 total)</summary>

| Field ID | Label | Type |
|----------|-------|------|
| `exec-property-type` | Property Type | text |
| `exec-property-address` | Property Address | text |
| `exec-legal-description` | Legal Description | textarea |
| `exec-zoning` | Zoning | text |
| `exec-site-area` | Site Area | number |
| `exec-building-area` | Building Area (GBA) | number |
| `exec-year-built` | Year Built | number |
| `exec-num-units` | Number of Units | number |
| `exec-occupancy` | Occupancy Rate | percentage |
| `exec-as-is-value` | As-Is Market Value | currency |
| `exec-land-value` | Land Value | currency |
| `exec-cost-approach-value` | Cost Approach Value | currency |
| `exec-sales-comparison-value` | Sales Comparison Value | currency |
| `exec-income-approach-value` | Income Approach Value | currency |
| `exec-final-value` | Final Value Conclusion | currency |

</details>

---

#### 08 - SITE DETAILS
**Fields:** All directly editable in both TDD and Editor

<details>
<summary>📝 Fields (20 total)</summary>

| Field ID | Label | Type |
|----------|-------|------|
| `site-address` | Site Address | text |
| `site-legal-description` | Legal Description | textarea |
| `site-total-area` | Total Site Area (sq.ft) | number |
| `site-acreage` | Total Site Area (acres) | number |
| `site-dimensions` | Site Dimensions | text |
| `site-shape` | Site Shape | select |
| `site-topography` | Topography | select |
| `site-drainage` | Drainage | select |
| `site-utilities` | Utilities | textarea |
| `site-access` | Access | text |
| `site-frontage` | Street Frontage | text |
| `site-easements` | Easements/Encumbrances | textarea |
| `site-flood-zone` | Flood Zone | text |
| `site-environmental` | Environmental Issues | textarea |
| `site-zoning` | Zoning | text |
| `site-highest-best-use` | Highest & Best Use | text |
| `site-plan-image` | Site Plan | 🔗 Managed in S3 (TDD) / ✏️ Direct edit (Editor) |
| `site-aerial-image` | Aerial Image | 🔗 Managed in S3 (TDD) / ✏️ Direct edit (Editor) |
| `site-zoning-map` | Zoning Map | 🔗 Managed in S3 (TDD) / ✏️ Direct edit (Editor) |
| `site-conclusion` | Site Conclusion | textarea |

</details>

---

#### 09 - LOCATION ANALYSIS
**Fields:** All directly editable in both TDD and Editor

<details>
<summary>📝 Fields (12 total)</summary>

| Field ID | Label | Type |
|----------|-------|------|
| `location-overview` | Location Overview | textarea |
| `location-regional` | Regional Analysis | textarea |
| `location-neighborhood` | Neighborhood Analysis | textarea |
| `location-walk-score` | Walk Score | number |
| `location-transit-score` | Transit Score | number |
| `location-bike-score` | Bike Score | number |
| `location-local-area` | Local Area Description | textarea |
| `location-nearby-schools` | Nearby Schools | textarea |
| `location-public-transit` | Public Transit | textarea |
| `location-amenities` | Nearby Amenities | textarea |
| `location-employment` | Employment Centers | textarea |
| `location-conclusion` | Location Conclusion | textarea |

</details>

---

#### 10 - PROPERTY TAXES
**Fields:** All directly editable in both TDD and Editor

<details>
<summary>📝 Fields (7 total)</summary>

| Field ID | Label | Type |
|----------|-------|------|
| `tax-assessment-year` | Assessment Year | number |
| `tax-assessed-value-total` | Total Assessed Value | currency |
| `tax-land-value` | Land Assessment | currency |
| `tax-building-value` | Building Assessment | currency |
| `tax-annual-amount` | Annual Property Taxes | currency |
| `tax-mill-rate` | Mill Rate | number |
| `tax-notes` | Tax Notes | textarea |

</details>

---

#### 11 - MARKET ANALYSIS
**Fields:** All directly editable in both TDD and Editor

<details>
<summary>📝 Fields (8 total)</summary>

| Field ID | Label | Type |
|----------|-------|------|
| `market-national-overview` | National Economic Overview | textarea |
| `market-provincial-overview` | Provincial Market Overview | textarea |
| `market-local-overview` | Local Market Analysis | textarea |
| `market-segment-overview` | Multifamily Market Segment | textarea |
| `market-rent-trend` | Rent Trend Analysis | textarea |
| `market-vacancy-rate` | Market Vacancy Rate | percentage |
| `market-supply-demand` | Supply & Demand Analysis | textarea |
| `market-conclusion` | Market Conclusion | textarea |

</details>

---

#### 12 - IMPROVEMENTS
**Fields:** All directly editable in both TDD and Editor

<details>
<summary>📝 Fields (25+ total)</summary>

| Field ID | Label | Type |
|----------|-------|------|
| `impv-num-stories` | Number of Stories | number |
| `impv-year-built` | Year Built | number |
| `impv-gba` | Gross Building Area (GBA) | number |
| `impv-nra` | Net Rentable Area (NRA) | number |
| `impv-num-units` | Total Number of Units | number |
| `impv-unit-mix` | Unit Mix | textarea |
| `impv-construction-type` | Construction Type | text |
| `impv-foundation` | Foundation | text |
| `impv-exterior-walls` | Exterior Walls | text |
| `impv-roof` | Roof | text |
| `impv-hvac` | HVAC System | text |
| `impv-electrical` | Electrical System | text |
| `impv-plumbing` | Plumbing System | text |
| `impv-elevator` | Elevator | text |
| `impv-fire-protection` | Fire Protection | text |
| `impv-interior-walls` | Interior Walls | text |
| `impv-ceilings` | Ceilings | text |
| `impv-flooring` | Flooring | text |
| `impv-doors-windows` | Doors & Windows | text |
| `impv-project-amenities` | Project Amenities | textarea |
| `impv-unit-amenities` | Unit Amenities | textarea |
| `impv-parking-spaces` | Parking Spaces | number |
| `impv-parking-ratio` | Parking Ratio | text |
| `impv-overall-condition` | Overall Condition | select |
| `impv-conclusion` | Improvements Conclusion | textarea |

</details>

---

#### 13 - ZONING
**Fields:** Mix of editable + image links in TDD; all editable in Editor

<details>
<summary>📝 Fields (8 total)</summary>

| Field ID | Label | TDD Display | Editor Display |
|----------|-------|-------------|----------------|
| `zone-classification` | Zoning Classification | ✏️ Direct edit | ✏️ Direct edit |
| `zone-description` | Zoning Description | ✏️ Direct edit | ✏️ Direct edit |
| `zone-max-height` | Maximum Height | ✏️ Direct edit | ✏️ Direct edit |
| `zone-max-density` | Maximum Density | ✏️ Direct edit | ✏️ Direct edit |
| `zone-parking-req` | Parking Requirements | ✏️ Direct edit | ✏️ Direct edit |
| `zone-conformance` | Zoning Conformance | ✏️ Direct edit | ✏️ Direct edit |
| `zoning-map` | Zoning Map | 🔗 Managed in S3 | ✏️ Direct edit |
| `zone-conclusion` | Zoning Conclusion | ✏️ Direct edit | ✏️ Direct edit |

</details>

---

#### 14 - HIGHEST & BEST USE
**Fields:** All directly editable in both TDD and Editor

<details>
<summary>📝 Fields (5 total)</summary>

| Field ID | Label | Type |
|----------|-------|------|
| `hbu-introduction` | HBU Introduction | textarea |
| `hbu-vacant-max-productive` | HBU as Vacant | textarea |
| `hbu-improved-analysis` | HBU as Improved | textarea |
| `hbu-final-conclusion` | HBU Conclusion | textarea |
| `hbu-summary` | HBU Summary | textarea |

</details>

---

#### 15 - VALUATIONS (All 3 Approaches)
**Purpose:** Consolidated calculation hub for all three valuation approaches
**Fields:** Mix of user inputs + calculated outputs

<details>
<summary>📝 Calc - Unit Mix Subsection (16 user inputs)</summary>

| Field ID | Label | Type | Source |
|----------|-------|------|--------|
| `calc-type1-name` | Unit Type 1 Name | text | user-input |
| `calc-type1-count` | Unit Type 1 Count | number | user-input |
| `calc-type1-sf` | Unit Type 1 Sq.Ft | number | user-input |
| `calc-type1-rent` | Unit Type 1 Market Rent | currency | user-input |
| `calc-type2-name` | Unit Type 2 Name | text | user-input |
| `calc-type2-count` | Unit Type 2 Count | number | user-input |
| `calc-type2-sf` | Unit Type 2 Sq.Ft | number | user-input |
| `calc-type2-rent` | Unit Type 2 Market Rent | currency | user-input |
| `calc-type3-name` | Unit Type 3 Name | text | user-input |
| `calc-type3-count` | Unit Type 3 Count | number | user-input |
| `calc-type3-sf` | Unit Type 3 Sq.Ft | number | user-input |
| `calc-type3-rent` | Unit Type 3 Market Rent | currency | user-input |
| `calc-type4-name` | Unit Type 4 Name | text | user-input |
| `calc-type4-count` | Unit Type 4 Count | number | user-input |
| `calc-type4-sf` | Unit Type 4 Sq.Ft | number | user-input |
| `calc-type4-rent` | Unit Type 4 Market Rent | currency | user-input |

</details>

<details>
<summary>📝 Calc - Other Income Subsection (4 user inputs)</summary>

| Field ID | Label | Type | Source |
|----------|-------|------|--------|
| `calc-other-parking` | Parking Income | currency | user-input |
| `calc-other-laundry` | Laundry Income | currency | user-input |
| `calc-other-storage` | Storage Income | currency | user-input |
| `calc-other-misc` | Misc. Income | currency | user-input |

</details>

<details>
<summary>📝 Calc - Vacancy & Loss Subsection (1 user input)</summary>

| Field ID | Label | Type | Source |
|----------|-------|------|--------|
| `calc-vacancy-rate` | Vacancy & Collection Loss % | percentage | user-input |

</details>

<details>
<summary>📝 Calc - Operating Expenses Subsection (10 user inputs)</summary>

| Field ID | Label | Type | Source |
|----------|-------|------|--------|
| `calc-exp-property-tax` | Property Taxes | currency | user-input |
| `calc-exp-insurance` | Insurance | currency | user-input |
| `calc-exp-utilities` | Utilities | currency | user-input |
| `calc-exp-repairs` | Repairs & Maintenance | currency | user-input |
| `calc-exp-management` | Management Fee % | percentage | user-input |
| `calc-exp-admin` | Administrative | currency | user-input |
| `calc-exp-reserves` | Reserves/Replacement | currency | user-input |
| `calc-exp-legal` | Legal & Accounting | currency | user-input |
| `calc-exp-advertising` | Advertising | currency | user-input |
| `calc-exp-other` | Other Expenses | currency | user-input |

</details>

<details>
<summary>📝 Calc - Cap Rate Subsection (1 user input)</summary>

| Field ID | Label | Type | Source |
|----------|-------|------|--------|
| `calc-cap-rate` | Capitalization Rate % | percentage | user-input |

</details>

<details>
<summary>📝 Calc - Adjustments Subsection (2 user inputs)</summary>

| Field ID | Label | Type | Source |
|----------|-------|------|--------|
| `calc-adj-entrepreneurial-incentive` | Entrepreneurial Incentive | currency | user-input |
| `calc-adj-other` | Other Adjustments | currency | user-input |

</details>

<details>
<summary>📝 Calc - Calculated Results (25+ calculated fields)</summary>

| Field ID | Label | Formula | Source |
|----------|-------|---------|--------|
| `calc-total-units` | Total Units | SUM(type1-count...type4-count) | calculated |
| `calc-total-nra` | Total NRA | SUM(type1-sf × type1-count...) | calculated |
| `calc-pgi-rental` | Potential Gross Income - Rental | SUM(rent × count × 12) | calculated |
| `calc-pgi-other` | PGI - Other Income | SUM(other income fields) | calculated |
| `calc-pgi-total` | Total PGI | rental + other | calculated |
| `calc-vacancy-loss` | Vacancy & Loss Amount | PGI × vacancy-rate | calculated |
| `calc-egi` | Effective Gross Income | PGI - Vacancy Loss | calculated |
| `calc-total-expenses` | Total Operating Expenses | SUM(all expense fields) | calculated |
| `calc-noi` | Net Operating Income | EGI - Expenses | calculated |
| `calc-income-value` | Income Approach Value | NOI / cap-rate | calculated |
| ...and more | | | |

</details>

**Total Fields in Section 15:** ~60 fields (34 user inputs + 26+ calculated)

**Display Pattern:**
- User input fields appear first (editable)
- Calculated fields shown below (read-only, auto-update when inputs change)
- Both TDD and Editor show same fields, but organized differently

---

#### 16 - LAND VALUE
**Fields:** All directly editable in both TDD and Editor

<details>
<summary>📝 Fields (10 total)</summary>

| Field ID | Label | Type |
|----------|-------|------|
| `land-valuation-method` | Valuation Method | select |
| `land-comparable-1-address` | Land Comp 1 Address | text |
| `land-comparable-1-sale-price` | Land Comp 1 Sale Price | currency |
| `land-comparable-1-size` | Land Comp 1 Size (acres) | number |
| `land-comparable-1-price-per-acre` | Land Comp 1 Price/Acre | currency |
| `land-comparable-2-address` | Land Comp 2 Address | text |
| `land-comparable-2-sale-price` | Land Comp 2 Sale Price | currency |
| `land-comparable-2-size` | Land Comp 2 Size (acres) | number |
| `land-comparable-2-price-per-acre` | Land Comp 2 Price/Acre | currency |
| `land-value-conclusion` | Land Value Conclusion | currency |

</details>

---

#### 18 - SALES COMPARISON
**Fields:** Mix of editable + image links in TDD; all editable in Editor

<details>
<summary>📝 Fields (50+ total = comp data + images)</summary>

**Subject Property Fields (10):**
| Field ID | Label | Type |
|----------|-------|------|
| `subject-num-units` | Subject Units | number |
| `subject-year-built` | Subject Year Built | number |
| `subject-gba` | Subject GBA | number |
| `subject-nra` | Subject NRA | number |
| `subject-site-area` | Subject Site Area | number |
| `subject-parking` | Subject Parking | number |
| `subject-condition` | Subject Condition | select |
| `subject-location` | Subject Location | select |
| `subject-amenities` | Subject Amenities | select |
| `subject-quality` | Subject Quality | select |

**Comp 1-5 Fields (each comp has ~10 fields × 5 comps = 50 fields):**
| Field Pattern | Example Field | Type |
|---------------|---------------|------|
| `comp{N}-address` | comp1-address | text |
| `comp{N}-sale-date` | comp1-sale-date | date |
| `comp{N}-sale-price` | comp1-sale-price | currency |
| `comp{N}-num-units` | comp1-num-units | number |
| `comp{N}-year-built` | comp1-year-built | number |
| `comp{N}-gba` | comp1-gba | number |
| `comp{N}-nra` | comp1-nra | number |
| `comp{N}-site-area` | comp1-site-area | number |
| `comp{N}-condition` | comp1-condition | select |
| `comp{N}-photo` | comp1-photo | 🔗 S3 (TDD) / ✏️ Direct (Editor) |
| `comp{N}-map` | comp1-map | 🔗 S3 (TDD) / ✏️ Direct (Editor) |

**Analysis Fields (5):**
| Field ID | Label | Type |
|----------|-------|------|
| `sales-price-per-unit` | Indicated Value per Unit | currency |
| `sales-price-per-sf` | Indicated Value per SF | currency |
| `sales-adjustment-summary` | Adjustment Summary | textarea |
| `sales-conclusion` | Sales Comparison Conclusion | textarea |
| `sales-value` | Sales Comparison Value | currency |

</details>

**Total Fields:** ~70 (10 subject + 50 comp data + 10 comp images + 5 analysis)

---

#### 20 - RENTAL SURVEY
**Fields:** Mix of editable + image links in TDD; all editable in Editor

<details>
<summary>📝 Fields (30+ total)</summary>

**Rental Comp 1-5 Fields (each comp has ~6 fields × 5 comps = 30 fields):**
| Field Pattern | Example Field | Type |
|---------------|---------------|------|
| `rent-comp{N}-name` | rent-comp1-name | text |
| `rent-comp{N}-address` | rent-comp1-address | text |
| `rent-comp{N}-unit-type` | rent-comp1-unit-type | text |
| `rent-comp{N}-size` | rent-comp1-size | number |
| `rent-comp{N}-rent` | rent-comp1-rent | currency |
| `rent-comp{N}-notes` | rent-comp1-notes | text |

**Image Field:**
| Field ID | Label | TDD Display | Editor Display |
|----------|-------|-------------|----------------|
| `rental-comparables-map` | Rental Comps Map | 🔗 Managed in S3 | ✏️ Direct edit |

**Analysis Fields:**
| Field ID | Label | Type |
|----------|-------|------|
| `rent-conclusion` | Rental Analysis Conclusion | textarea |
| `rent-market-rent-1br` | Market Rent - 1 BR | currency |
| `rent-market-rent-2br` | Market Rent - 2 BR | currency |

</details>

---

#### 21 - RECONCILIATION
**Fields:** All directly editable in both TDD and Editor

<details>
<summary>📝 Fields (8 total)</summary>

| Field ID | Label | Type |
|----------|-------|------|
| `recon-land-value` | Land Value | currency |
| `recon-cost-approach` | Cost Approach Value | currency |
| `recon-sales-comparison` | Sales Comparison Value | currency |
| `recon-income-approach` | Income Approach Value | currency |
| `recon-analysis` | Reconciliation Analysis | textarea |
| `recon-final-value` | Final Value Conclusion | currency |
| `recon-exposure-time` | Exposure Time | text |
| `recon-marketing-time` | Marketing Time | text |

</details>

---

#### 22 - CERTIFICATION
**Fields:** Mix of editable + image link in TDD; all editable in Editor

<details>
<summary>📝 Fields (10 total)</summary>

| Field ID | Label | TDD Display | Editor Display |
|----------|-------|-------------|----------------|
| `cert-appraiser-name` | Appraiser Name | 🔗 Link to S2 | ✏️ Direct edit |
| `cert-credentials` | Credentials | 🔗 Link to S2 | ✏️ Direct edit |
| `cert-date` | Certification Date | ✏️ Direct edit | ✏️ Direct edit |
| `cert-signature` | Appraiser Signature | 🔗 Managed in S3 | ✏️ Direct edit |
| `cert-company` | Company Name | ✏️ Direct edit | ✏️ Direct edit |
| `cert-address` | Company Address | ✏️ Direct edit | ✏️ Direct edit |
| `cert-phone` | Company Phone | ✏️ Direct edit | ✏️ Direct edit |
| `cert-email` | Company Email | ✏️ Direct edit | ✏️ Direct edit |
| `cert-statement` | Certification Statement | ✏️ Direct edit | ✏️ Direct edit |
| `cert-assumptions` | Extraordinary Assumptions | ✏️ Direct edit | ✏️ Direct edit |

</details>

---

## 2. Editor Panel Tab Structure (21 Tabs)

The Editor Panel shows **ONLY the numbered report page tabs (01-22 minus hidden sections)**.

**What's Missing:**
- S1 - Client Intake (TDD-only)
- S2 - LOE Prep (TDD-only)
- S3 - Image Management (TDD-only)

**Why Missing:**
- Fields from S1/S2/S3 are accessible **IN CONTEXT** on their destination pages
- Example: `appraiser-name` from S2 is directly editable on Page 01 (Cover) in the Editor Panel
- Example: `zoning-map` from S3 is directly editable on Page 13 (Zoning) in the Editor Panel

**Tabs Present in Editor Panel:**
1. 01 - COVER PAGE
2. 02 - INTRODUCTION LETTER
3. 04 - ASSIGNMENT
4. 05 - REPORT INFORMATION
5. 06 - EXECUTIVE SUMMARY
6. 08 - SITE DETAILS
7. 09 - LOCATION ANALYSIS
8. 10 - PROPERTY TAXES
9. 11 - MARKET ANALYSIS
10. 12 - IMPROVEMENTS
11. 13 - ZONING
12. 14 - HIGHEST & BEST USE
13. 15 - VALUATIONS
14. 16 - LAND VALUE
15. 18 - SALES COMPARISON
16. 20 - RENTAL SURVEY
17. 21 - RECONCILIATION
18. 22 - CERTIFICATION

**Not Present (Hidden in Both):**
- 03 - LOCATION MAPS (consolidated into S3 in TDD)
- 07 - PROPERTY PHOTOGRAPHS (consolidated into S3 in TDD)
- 17 - COST APPROACH (consolidated into 15 - Valuations)
- 19 - INCOME APPROACH (consolidated into 15 - Valuations)

**Total Editor Tabs:** 18 visible tabs (same as TDD numbered tabs, but WITHOUT S1/S2/S3)

---

## 3. Field Differences by Tab

### Summary Table

| Tab Name | TDD Fields | Editor Fields | Difference |
|----------|-----------|--------------|------------|
| S1 - Client Intake | 22 | N/A | TDD-only |
| S2 - LOE Prep | 18 | N/A | TDD-only |
| S3 - Image Management | 70+ | N/A | TDD-only (images editable in context in Editor) |
| 01 - Cover Page | 15 (7 links) | 15 (all editable) | Links → Direct edit |
| 02 - Introduction Letter | 8 | 8 | Same |
| 04 - Identification of Assignment | 12 | 12 | Same |
| 05 - Report Information | 10 | 10 | Same |
| 06 - Executive Summary | 15 | 15 | Same |
| 08 - Site Details | 20 (3 image links) | 20 (all editable) | Links → Direct edit |
| 09 - Location Analysis | 12 | 12 | Same |
| 10 - Property Taxes | 7 | 7 | Same |
| 11 - Market Analysis | 8 | 8 | Same |
| 12 - Improvements | 25+ | 25+ | Same |
| 13 - Zoning | 8 (1 image link) | 8 (all editable) | Link → Direct edit |
| 14 - Highest & Best Use | 5 | 5 | Same |
| 15 - Valuations (All 3 Approaches) | 60 | 60 | Same |
| 16 - Land Value | 10 | 10 | Same |
| 18 - Sales Comparison | 70 (10 image links) | 70 (all editable) | Links → Direct edit |
| 20 - Rental Survey | 33 (1 image link) | 33 (all editable) | Link → Direct edit |
| 21 - Reconciliation | 8 | 8 | Same |
| 22 - Certification | 10 (3 links) | 10 (all editable) | Links → Direct edit |

**Total Field Count:**
- **TDD:** ~450 unique fields (including S1/S2/S3)
- **Editor:** ~340 unique fields (S1/S2/S3 fields appear contextually on destination pages)
- **Overlap:** ~340 fields (all numbered tab fields)

---

## 4. UX Flow Comparison

### TDD Dashboard Workflow (Bulk Data Entry)

**Purpose:** Get all data into the system efficiently

**Steps:**
1. Open TDD Dashboard
2. Navigate to **S1 - Client Intake**
3. Fill in client/property info (22 fields)
4. Navigate to **S2 - LOE Prep**
5. Fill in appraiser/job details (18 fields)
6. Navigate to **S3 - Image Management**
7. Upload ALL images in one place (70+ slots organized by category)
8. Navigate through numbered tabs (01-22)
9. Fill in remaining property data
10. Click "Preview in Builder" to review

**Advantages:**
- Bulk upload for images (don't jump between 20 tabs)
- Logical grouping (client info together, appraiser info together)
- Progress tracking (stats bar shows % complete)
- Links to related sections ("Managed in S3" avoids duplicate entry)

**When to Use:**
- Initial report setup
- Assistant gathering data from inspection
- Batch data import from other systems

---

### Editor Panel Workflow (Contextual Review)

**Purpose:** Review and refine with live preview

**Steps:**
1. Open Split Panel Editor
2. Navigate to Page 01 (Cover)
3. See rendered page on RIGHT panel
4. See editable fields on LEFT panel
5. Edit `appraiser-name` directly (no need to go to S2)
6. See change update instantly on RIGHT
7. Navigate to Page 13 (Zoning)
8. Edit `zoning-map` directly (no need to go to S3)
9. See updated map render on RIGHT
10. Continue through report pages
11. Export PDF when satisfied

**Advantages:**
- In-context editing (see field AND output simultaneously)
- Live preview (no regenerate step)
- No mental mapping needed (field is next to what it produces)
- Quality control (spot errors immediately)

**When to Use:**
- Appraiser reviewing assistant's work
- Final quality check before delivery
- Client requested changes (quick fixes)
- Troubleshooting specific page issues

---

## 5. Visual Workflow Diagrams

### TDD Dashboard Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    TDD DASHBOARD                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Step 1: S1 - CLIENT INTAKE                                 │
│  ┌────────────────────────────────────────────┐             │
│  │ client-first-name:  [John____________]    │             │
│  │ client-last-name:   [Smith___________]    │             │
│  │ client-email:       [john@example.com]    │             │
│  │ ...22 fields total                        │             │
│  └────────────────────────────────────────────┘             │
│                                                              │
│  Step 2: S2 - LOE PREP                                      │
│  ┌────────────────────────────────────────────┐             │
│  │ appraiser-name:     [Jane Appraiser___]   │             │
│  │ valuation-date:     [2025-12-24_______]   │             │
│  │ ...18 fields total                        │             │
│  └────────────────────────────────────────────┘             │
│                                                              │
│  Step 3: S3 - IMAGE MANAGEMENT                              │
│  ┌────────────────────────────────────────────┐             │
│  │ 01 - Cover & Signature                     │             │
│  │   img-cover-photo:  [Upload] [Change]     │             │
│  │   img-signature:    [Upload] [Change]     │             │
│  │                                            │             │
│  │ 03 - Location Maps                         │             │
│  │   img-map-regional: [Upload] [Change]     │             │
│  │   img-map-local:    [Upload] [Change]     │             │
│  │   ...8 map slots                           │             │
│  │                                            │             │
│  │ 07 - Property Photographs                  │             │
│  │   [6 Exterior] [3 Street] [4 Common]      │             │
│  │   [6 Unit] [4 Systems]                    │             │
│  │   ...23 photo slots                        │             │
│  │                                            │             │
│  │ Comp Photos & Maps                         │             │
│  │   [5 Comp Photos] [5 Comp Maps]           │             │
│  │   [1 Rental Map]                           │             │
│  └────────────────────────────────────────────┘             │
│                                                              │
│  Step 4: Navigate numbered tabs 01-22                       │
│  ┌────────────────────────────────────────────┐             │
│  │ 01 - COVER PAGE                            │             │
│  │   property-name:  → Managed in S1 (link)   │             │
│  │   appraiser-name: → Managed in S2 (link)   │             │
│  │   cover-photo:    → Managed in S3 (link)   │             │
│  │                                            │             │
│  │ 13 - ZONING                                │             │
│  │   zone-classification: [R2-Residential]    │             │
│  │   zoning-map:      → Managed in S3 (link)  │             │
│  └────────────────────────────────────────────┘             │
│                                                              │
│  [Preview in Builder] ←── Click to review                   │
└─────────────────────────────────────────────────────────────┘
```

---

### Editor Panel Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      SPLIT PANEL EDITOR                         │
├────────────────────────────┬────────────────────────────────────┤
│                            │                                    │
│   LEFT: EDITABLE FIELDS    │    RIGHT: LIVE HTML PREVIEW        │
│                            │                                    │
│  Page 01 - COVER PAGE      │   ┌────────────────────────────┐  │
│  ┌──────────────────────┐  │   │                            │  │
│  │ property-name        │  │   │   APPRAISAL REPORT         │  │
│  │ [North Battleford_]  │  │   │                            │  │
│  └──────────────────────┘  │   │   North Battleford Apts    │  │
│                            │   │   123 Main Street          │  │
│  ┌──────────────────────┐  │   │                            │  │
│  │ appraiser-name       │  │   │   Prepared for:            │  │
│  │ [Jane Appraiser___] │  │   │   John Smith               │  │
│  └──────────────────────┘  │   │                            │  │
│                            │   │   Prepared by:             │  │
│  ┌──────────────────────┐  │   │   Jane Appraiser, AACI    │  │
│  │ cover-photo          │  │   │                            │  │
│  │ [Upload] [Change]    │  │   │   [Photo appears here]     │  │
│  └──────────────────────┘  │   │                            │  │
│            ↕               │   │            ↕               │  │
│  Edit field on left...     │   │   ...see change on right   │  │
│  No need to regenerate!    │   │   Updates instantly!       │  │
│                            │   └────────────────────────────┘  │
│                            │                                    │
├────────────────────────────┼────────────────────────────────────┤
│                            │                                    │
│  Page 13 - ZONING          │   ┌────────────────────────────┐  │
│  ┌──────────────────────┐  │   │   ZONING ANALYSIS          │  │
│  │ zone-classification  │  │   │                            │  │
│  │ [R2 - Low Density__] │  │   │   Classification: R2       │  │
│  └──────────────────────┘  │   │   Low Density Residential  │  │
│                            │   │                            │  │
│  ┌──────────────────────┐  │   │   ┌──────────────────┐    │  │
│  │ zoning-map           │  │   │   │  [Zoning Map]    │    │  │
│  │ [Upload] [Change]    │  │   │   │  [Image renders] │    │  │
│  └──────────────────────┘  │   │   └──────────────────┘    │  │
│                            │   │                            │  │
│  ┌──────────────────────┐  │   │   Permitted Uses:          │  │
│  │ zone-description     │  │   │   • Single family          │  │
│  │ [Permits multi-fam_] │  │   │   • Multi-family           │  │
│  └──────────────────────┘  │   └────────────────────────────┘  │
│                            │                                    │
│  NO "Managed in S3" links! │   Changes reflect IMMEDIATELY     │
│  Everything editable here! │   See field + output together!    │
│                            │                                    │
└────────────────────────────┴────────────────────────────────────┘
```

---

## 6. Key Architectural Insights

### Why Two Interfaces?

**TDD Dashboard:**
- Optimized for **INPUT** (get data in efficiently)
- Consolidates related fields (client info, images, etc.)
- Shows data flow (links show where fields populate to)

**Editor Panel:**
- Optimized for **REVIEW** (validate output quality)
- Shows fields in context (edit while viewing rendered page)
- No mental mapping needed (field is next to what it produces)

### The "Managed Elsewhere" Pattern

**In TDD:**
```typescript
// Page 13 - Zoning
zoning-map: "Managed in S3 - Image Management" [clickable link]
```

**In Editor:**
```typescript
// Page 13 - Zoning
zoning-map: [Upload] [Change] [Preview]
// Editable directly on this page!
```

**Why:**
- TDD encourages bulk upload (go to S3 once, upload all images)
- Editor encourages contextual editing (fix this map while viewing this page)

### Field Deduplication

Fields from S1/S2/S3 are NOT duplicated in numbered tabs. They appear as:
- **TDD:** Links to source section (avoid duplicate entry)
- **Editor:** Direct edit (no S-tabs, so fields appear on destination pages)

**Example:**
- `appraiser-name` defined in S2
- Appears on Page 01 (Cover) as link in TDD
- Appears on Page 01 (Cover) as editable field in Editor
- Same underlying field, different UI presentation

---

## 7. Field Registry Source of Truth

All fields documented above are defined in:
```
/Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/schema/fieldRegistry.ts
```

**Field Definition Structure:**
```typescript
{
  id: 'field-id',               // Canonical field ID
  storeId: 'field-id',          // Zustand store ID (matches id)
  label: 'Human Label',         // UI display name
  section: 'section-id',        // Section (S1, S2, S3, cover, exec, etc.)
  subsection: 'subsection-id',  // Optional subsection
  type: 'text',                 // Field type (text, number, date, image, etc.)
  inputSource: 'user-input',    // Source (user-input, calculated, api-fetch)
  required: true/false,         // Validation
  options: [...],               // For select fields
}
```

**Total Fields in Registry:** ~1,687 fields (as of version 2.3.0)

**Sections Present:**
- S1 (client-intake): 22 fields
- S2 (loe-prep): 18 fields
- S3 (image-mgt): 70+ fields
- Numbered sections (01-22): ~340 fields
- Hidden/consolidated sections: ~1,240 fields (detailed subsections)

---

## 8. Cross-Reference to Other Docs

**Related Documentation:**
- `/docs/15-Contract-review/Session-Claude-Reg.03/SPLIT-PANEL-EDITOR-UX.md` - UX philosophy and workflows
- `/docs/15-Contract-review/1-Formatting & Report/-passover-sessions/-Handoff-25.12.13.md` - Current project state
- `/src/features/report-builder/schema/fieldRegistry.ts` - Complete field definitions
- `/src/features/report-builder/store/reportBuilderStore.ts` - Section builder and state management
- `/src/features/test-input/TestInputDashboard.tsx` - TDD implementation
- `/src/features/report-builder/components/SectionSidebar.tsx` - Editor Panel tab navigation

---

## 9. Summary Statistics

| Metric | TDD Dashboard | Editor Panel |
|--------|--------------|--------------|
| **Total Tabs** | 24 | 21 |
| **S-Tabs (Operational)** | 3 (S1, S2, S3) | 0 |
| **Numbered Tabs** | 21 (01-22 minus hidden) | 21 (same) |
| **Hidden Tabs** | 3 (03, 07, 17, 19) | 3 (same) |
| **Total Fields** | ~450 | ~340 |
| **Image Fields** | 70+ (S3) | 70+ (in context) |
| **Unique Fields** | ~450 | ~340 (S-tab fields appear contextually) |
| **Field Links** | ~20 ("Managed in S1/S2/S3") | 0 (all direct edit) |
| **User Input Fields** | ~340 | ~340 |
| **Calculated Fields** | ~110 | ~110 |

---

## 10. When to Use Which Interface

### Use TDD Dashboard When:
- Starting a new report from scratch
- Assistant is gathering data from inspection
- Batch uploading images (50+ photos)
- Importing data from external systems
- Need to see field completion stats
- Want to organize data by logical groupings (client, appraiser, images)

### Use Editor Panel When:
- Appraiser reviewing assistant's work
- Final quality control before delivery
- Client requested specific changes
- Troubleshooting output formatting
- Need to see rendered page while editing
- Making quick fixes to specific sections
- Want immediate visual feedback

### Use Both When:
- Complex report: TDD for initial entry, Editor for review
- Collaborative workflow: Assistant uses TDD, Appraiser uses Editor
- Iterative refinement: TDD for bulk edits, Editor for polishing

---

**Document Version:** 1.0
**Last Updated:** 2025-12-24 06:00 MST
**Maintained By:** Documentation Engineer (Claude)
**Verified Against:** fieldRegistry.ts v2.3.0, TestInputDashboard.tsx, SectionSidebar.tsx
