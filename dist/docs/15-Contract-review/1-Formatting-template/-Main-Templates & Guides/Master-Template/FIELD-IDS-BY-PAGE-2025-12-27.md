# Field IDs by Page

**Generated:** 2025-12-27
**Template:** `/public/Report-MF-template.html` v2.3.0
**Registry:** `/src/features/report-builder/schema/fieldRegistry.ts` v2.3.0

---

## Field ID System Overview

### Two ID Systems, One Mapping

Every field in this report originates from Valcre (either the Excel workbook or Word document). We maintain two ID systems:

| System | Format | Example | Purpose |
|--------|--------|---------|---------|
| **Valcre ID** | PascalCase with underscores | `Subject_Street` | Original Valcre named range |
| **Our Field ID** | kebab-case | `subject-street` | Standardized ID for our app |

### Why We Have Our Own IDs

Valcre's naming is condensed and inconsistent. We created a formal, organized system:

**Valcre (condensed):**
```
Subject_NRA
IA_DirCap_NOI
SalesComp1_SalePrice
```

**Ours (organized):**
```
subject-nra
ia-dircap-noi
comp1-sale-price
```

### Our Naming Convention

| Prefix | Category | Examples |
|--------|----------|----------|
| `subject-` | Subject property attributes | `subject-street`, `subject-nra`, `subject-units` |
| `comp1-` to `comp5-` | Sales comparables | `comp1-sale-price`, `comp3-address` |
| `rentcomp1-` to `rentcomp5-` | Rental comparables | `rentcomp1-rent-unit-avg` |
| `calc-` | Calculated outputs | `calc-noi`, `calc-egr`, `calc-cap-rate` |
| `ia-dircap-` | Income Approach - Direct Cap | `ia-dircap-noi`, `ia-dircap-value` |
| `exp-` | Operating expenses | `exp-taxes`, `exp-insurance` |
| `img-` | Images | `img-map-regional`, `img-site-plan-1` |
| `report-` | Report metadata | `report-date`, `report-effectivedate` |
| `client-` | Client information | `client-organization`, `client-address` |
| `company-` | Appraisal company info | `company-name`, `company-jobnumber` |

### Source of Truth

```
Registry (fieldRegistry.ts)
    ↓
Defines our Field IDs
    ↓
Template uses: {{field-id}}
Valcre maps to: field-id
Test data uses: field-id
```

**The Registry is the source of truth.** Everything else follows its field IDs.

### Column Reference

| Column | Meaning |
|--------|---------|
| **Field ID** | Our canonical ID (from registry) |
| **Valcre ID** | Corresponding Valcre named range (`TBD` = mapping not yet documented) |
| **Registry** | ✅ = Field ID (column 1) exists and matches in `fieldRegistry.ts`, ❌ = needs adding |
| **Status** | Does the report render correctly with the same image/data as our reference source report? |

**Status Values:**
- ⏳ Pending = Not yet verified against reference report
- ✅ Matched = Renders correctly, matches reference source
- ❌ Mismatch = Does not match reference, needs fixing

---

## Image Fields Reference

All image fields across the report, cross-referenced with Valcre IDs.

| Field ID | Valcre ID | Page | Registry | Description |
|----------|-----------|------|----------|-------------|
| `subject-photo` | `Subject_Photo` | -4 | ✅ | Cover photo |
| `subject-photo-1` | `TBD` | 4 | ✅ | Subject photo 1 |
| `subject-photo-2` | `TBD` | 4 | ✅ | Subject photo 2 |
| `subject-photo-3` | `TBD` | 4 | ✅ | Subject photo 3 |
| `subject-photo-4` | `TBD` | 4 | ✅ | Subject photo 4 |
| `subject-photo-5` | `TBD` | 4 | ✅ | Subject photo 5 |
| `subject-photo-6` | `TBD` | 4 | ✅ | Subject photo 6 |
| `subject-photo-7` | `TBD` | 5 | ✅ | Subject photo 7 |
| `subject-photo-8` | `TBD` | 5 | ✅ | Subject photo 8 |
| `subject-photo-9` | `TBD` | 5 | ✅ | Subject photo 9 |
| `subject-photo-10` | `TBD` | 5 | ✅ | Subject photo 10 |
| `subject-photo-11` | `TBD` | 5 | ✅ | Subject photo 11 |
| `subject-photo-12` | `TBD` | 5 | ✅ | Subject photo 12 |
| `subject-photo-13` | `TBD` | 6 | ✅ | Subject photo 13 |
| `subject-photo-14` | `TBD` | 6 | ✅ | Subject photo 14 |
| `subject-photo-15` | `TBD` | 6 | ✅ | Subject photo 15 |
| `subject-photo-16` | `TBD` | 6 | ✅ | Subject photo 16 |
| `subject-photo-17` | `TBD` | 6 | ✅ | Subject photo 17 |
| `subject-photo-18` | `TBD` | 6 | ✅ | Subject photo 18 |
| `subject-photo-19` | `TBD` | 7 | ✅ | Subject photo 19 |
| `subject-photo-20` | `TBD` | 7 | ✅ | Subject photo 20 |
| `subject-photo-21` | `TBD` | 7 | ✅ | Subject photo 21 |
| `subject-photo-22` | `TBD` | 7 | ✅ | Subject photo 22 |
| `subject-photo-23` | `TBD` | 7 | ✅ | Subject photo 23 |
| `subject-photo-24` | `TBD` | 7 | ✅ | Subject photo 24 |
| `subject-photo-25` | `TBD` | 8 | ✅ | Subject photo 25 |
| `img-map-regional` | `Map_Regional` | 9 | ✅ | Regional location map |
| `img-map-local` | `Map_Local` | 10 | ✅ | Local area map |
| `img-map-aerial` | `Map_Aerial` | 11 | ✅ | Aerial overview map |
| `img-site-plan-1` | `Map_Survey1` | 21 | ✅ | Site plan 1 |
| `img-site-plan-2` | `Map_Survey2` | 22 | ✅ | Site plan 2 |
| `img-zoning-map` | `TBD` | 25 | ✅ | Zoning map |
| `img-rental-comparables-map` | `TBD` | 34 | ✅ | Rental comparables location map |
| `img-comparables-map` | `TBD` | 48 | ✅ | Sales comparables location map |

**Total: 34 image fields**

---

## Page-by-Page Field Reference

**Page Numbering:** -4 to -1 (no footer), 1-67 (with footer)

---

## Page -4 (Cover)
**Field Count:** 19

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `city` | `Subject_City` | ✅ | ⏳ Pending |
| `client-address` | `Client_Address` | ✅ | ⏳ Pending |
| `client-city-state-zip` | `Client_CityStateZip` | ✅ | ⏳ Pending |
| `client-full-name` | `Client_Name` | ✅ | ⏳ Pending |
| `client-organization` | `Client_Company` | ✅ | ⏳ Pending |
| `company-address` | `Company_Address` | ✅ | ⏳ Pending |
| `company-city-state-zip` | `Company_CityStateZip` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `company-name` | `Company_Name` | ✅ | ⏳ Pending |
| `company-phone` | `Company_Phone` | ✅ | ⏳ Pending |
| `company-website` | `TBD` | ✅ | ⏳ Pending |
| `report-date` | `Report_Date` | ✅ | ⏳ Pending |
| `report-effectivedate` | `Report_Date` | ✅ | ⏳ Pending |
| `subject-name` | `Subject_Name` | ✅ | ⏳ Pending |
| `subject-primary` | `Subject_Primary` | ✅ | ⏳ Pending |
| `subject-state` | `Subject_State` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| `subject-subtype` | `Subject_Subtype` | ✅ | ⏳ Pending |
| **Images:** | | | |
| `subject-photo` | `Subject_Photo` | ✅ | ⏳ Pending |

---

## Page -3 (Letter of Transmittal)
**Field Count:** 22

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `city` | `Subject_City` | ✅ | ⏳ Pending |
| `client-address` | `Client_Address` | ✅ | ⏳ Pending |
| `client-city-state-zip` | `Client_CityStateZip` | ✅ | ⏳ Pending |
| `client-full-name` | `Client_Name` | ✅ | ⏳ Pending |
| `client-organization` | `Client_Company` | ✅ | ⏳ Pending |
| `company-address` | `Company_Address` | ✅ | ⏳ Pending |
| `company-city-state-zip` | `Company_CityStateZip` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `company-name` | `Company_Name` | ✅ | ⏳ Pending |
| `company-phone` | `Company_Phone` | ✅ | ⏳ Pending |
| `report-date` | `Report_Date` | ✅ | ⏳ Pending |
| `report-date1` | `Report_Date1` | ✅ | ⏳ Pending |
| `report-extraordinary` | `Report_Extraordinary` | ✅ | ⏳ Pending |
| `report-hypothetical` | `Report_Hypothetical` | ✅ | ⏳ Pending |
| `report-interest` | `Report_Interest` | ✅ | ⏳ Pending |
| `report-values` | `Report_Values` | ✅ | ⏳ Pending |
| `report-valuescenario1` | `TBD` | ✅ | ⏳ Pending |
| `subject-econcharacteristics` | `Subject_EconCharacteristics` | ✅ | ⏳ Pending |
| `subject-exposuretime` | `Report_ExposureTime` | ✅ | ⏳ Pending |
| `subject-introcomment` | `Subject_IntroComment` | ✅ | ⏳ Pending |
| `subject-state` | `Subject_State` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page -2 (Limiting Conditions)
**Field Count:** 7

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `appraiser1-email` | `Appraiser1_Email` | ✅ | ⏳ Pending |
| `appraiser1-name` | `Appraiser1_Name` | ✅ | ⏳ Pending |
| `appraiser1-title` | `Appraiser1_Title` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `company-name` | `Company_Name` | ✅ | ⏳ Pending |
| `report-limcond` | `Report_LimCond` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page -1 (Table of Contents)
**Field Count:** 0

*No field placeholders on this page*

---

## Page 1 (Executive Summary)
**Field Count:** 43

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `city` | `Subject_City` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `report-legal` | `Report_Legal` | ✅ | ⏳ Pending |
| `subject-actualage` | `Subject_Age` | ✅ | ⏳ Pending |
| `subject-appeal-rating` | `Subject_Appeal` | ✅ | ⏳ Pending |
| `subject-condition` | `Subject_Condition` | ✅ | ⏳ Pending |
| `subject-density` | `TBD` | ✅ | ⏳ Pending |
| `subject-economiclife` | `Subject_EconomicLife` | ✅ | ⏳ Pending |
| `subject-effectiveage` | `Subject_EffectiveAge` | ✅ | ⏳ Pending |
| `subject-gba` | `Subject_GBA` | ✅ | ⏳ Pending |
| `subject-geocode` | `TBD` | ✅ | ⏳ Pending |
| `subject-laundry` | `Subject_Laundry` | ✅ | ⏳ Pending |
| `subject-market` | `Subject_Submarket` | ✅ | ⏳ Pending |
| `subject-name` | `Subject_Name` | ✅ | ⏳ Pending |
| `subject-nra` | `Subject_NRA` | ✅ | ⏳ Pending |
| `subject-parking` | `Subject_Parking` | ✅ | ⏳ Pending |
| `subject-primary` | `Subject_Primary` | ✅ | ⏳ Pending |
| `subject-proj-amenities` | `Subject_AmenitiesProject` | ✅ | ⏳ Pending |
| `subject-quality-rating` | `Subject_Quality` | ✅ | ⏳ Pending |
| `subject-remaininglife` | `Subject_RemainingLife` | ✅ | ⏳ Pending |
| `subject-security-features` | `Subject_Security` | ✅ | ⏳ Pending |
| `subject-shape` | `Subject_Shape` | ✅ | ⏳ Pending |
| `subject-siteaccess` | `TBD` | ✅ | ⏳ Pending |
| `subject-siteexposure` | `TBD` | ✅ | ⏳ Pending |
| `subject-sitequality` | `TBD` | ✅ | ⏳ Pending |
| `subject-siteutility` | `TBD` | ✅ | ⏳ Pending |
| `subject-state` | `Subject_State` | ✅ | ⏳ Pending |
| `subject-stories` | `Subject_Stories` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| `subject-submarket` | `Subject_Submarket` | ✅ | ⏳ Pending |
| `subject-subtype` | `Subject_Subtype` | ✅ | ⏳ Pending |
| `subject-tenancy` | `TBD` | ✅ | ⏳ Pending |
| `subject-topography` | `Subject_Topography` | ✅ | ⏳ Pending |
| `subject-totalacre` | `Subject_TotalAcre` | ✅ | ⏳ Pending |
| `subject-totalbuildings` | `Subject_Buildings` | ✅ | ⏳ Pending |
| `subject-totalsf` | `Subject_TotalSF` | ✅ | ⏳ Pending |
| `subject-units` | `Subject_Units` | ✅ | ⏳ Pending |
| `subject-usableacre` | `TBD` | ✅ | ⏳ Pending |
| `subject-usablesf` | `TBD` | ✅ | ⏳ Pending |
| `subject-year-built` | `Subject_YearBuilt` | ✅ | ⏳ Pending |
| `subject-zip` | `Subject_Zip` | ✅ | ⏳ Pending |
| `subject-zoning` | `Subject_Zoning` | ✅ | ⏳ Pending |
| `subject-zoningcode` | `Subject_ZoningCode` | ✅ | ⏳ Pending |

---

## Page 2 (Executive Summary - HBU & Value)
Highest & Best Use conclusion and value summary table.

**Field Count:** 25

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `ia-dircap-cap-rate1` | `TBD` | ✅ | ⏳ Pending |
| `ia-dircap-expenseratio` | `TBD` | ✅ | ⏳ Pending |
| `ia-dircap-noi` | `TBD` | ✅ | ⏳ Pending |
| `ia-dircap-noi-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `occupancy-rate` | `Subject_Occupancy` | ✅ | ⏳ Pending |
| `report-effectivedate` | `Report_Date` | ✅ | ⏳ Pending |
| `report-interest` | `Report_Interest` | ✅ | ⏳ Pending |
| `report-valuationcost` | `TBD` | ✅ | ⏳ Pending |
| `report-valuationincome` | `TBD` | ✅ | ⏳ Pending |
| `report-valuationsales` | `TBD` | ✅ | ⏳ Pending |
| `report-values` | `TBD` | ✅ | ⏳ Pending |
| `subject-concludedrent` | `TBD` | ✅ | ⏳ Pending |
| `subject-currentrent` | `TBD` | ✅ | ⏳ Pending |
| `subject-exposuretime` | `Report_ExposureTime` | ✅ | ⏳ Pending |
| `subject-hbuimproved` | `Report_HBUImpv` | ✅ | ⏳ Pending |
| `subject-hbuvacant` | `Report_HBUVacant` | ✅ | ⏳ Pending |
| `subject-marketing` | `Report_Marketing` | ✅ | ⏳ Pending |
| `subject-occupancystabilized` | `Subject_OccupancyStabilized` | ✅ | ⏳ Pending |
| `subject-occupied-units` | `TBD` | ✅ | ⏳ Pending |
| `subject-proposedconstruction` | `TBD` | ✅ | ⏳ Pending |
| `subject-sfmultifamily` | `TBD` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| `subject-vacancycreditloss` | `TBD` | ✅ | ⏳ Pending |
| `subject-vacant-units` | `TBD` | ✅ | ⏳ Pending |

---

## Page 3 (Executive Summary - Assumptions)
Hypothetical conditions, extraordinary assumptions, and limiting conditions.

**Field Count:** 5

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `report-extraordinary` | `Report_Extraordinary` | ✅ | ⏳ Pending |
| `report-hypothetical` | `Report_Hypothetical` | ✅ | ⏳ Pending |
| `report-limcond` | `Report_LimCond` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 4 (Subject Photographs 1)
Subject property photos 1-6 with captions.

**Field Count:** 14

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-photo-1` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-1-caption` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-2` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-2-caption` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-3` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-3-caption` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-4` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-4-caption` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-5` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-5-caption` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-6` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-6-caption` | `TBD` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 5 (Subject Photographs 2)
Subject property photos 7-12 with captions.

**Field Count:** 14

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-photo-10` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-10-caption` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-11` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-11-caption` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-12` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-12-caption` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-7` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-7-caption` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-8` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-8-caption` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-9` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-9-caption` | `TBD` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 6 (Subject Photographs 3)
Subject property photos 13-18 with captions.

**Field Count:** 14

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-photo-13` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-13-caption` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-14` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-14-caption` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-15` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-15-caption` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-16` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-16-caption` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-17` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-17-caption` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-18` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-18-caption` | `TBD` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 7 (Subject Photographs 4)
Subject property photos 19-24 with captions.

**Field Count:** 14

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-photo-19` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-19-caption` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-20` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-20-caption` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-21` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-21-caption` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-22` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-22-caption` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-23` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-23-caption` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-24` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-24-caption` | `TBD` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 8 (Subject Photographs 5)
Subject property photo 25 with caption.

**Field Count:** 4

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-photo-25` | `TBD` | ✅ | ⏳ Pending |
| `subject-photo-25-caption` | `TBD` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 9 (Regional Map)
Regional location map showing property in broader geographic context.

**Field Count:** 3

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| **Images:** | | | |
| `img-map-regional` | `Map_Regional` | ✅ | ⏳ Pending |

---

## Page 10 (Local Area Map)
Local area map showing neighborhood and nearby amenities.

**Field Count:** 3

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| **Images:** | | | |
| `img-map-local` | `Map_Local` | ✅ | ⏳ Pending |

---

## Page 11 (Aerial Map)
Aerial view of subject property and immediate surroundings.

**Field Count:** 3

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| **Images:** | | | |
| `img-map-aerial` | `Map_Aerial` | ✅ | ⏳ Pending |

---

## Page 12 (Assignment Identification)
Property identification, legal description, client info, and purpose.

**Field Count:** 17

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `city` | `Subject_City` | ✅ | ⏳ Pending |
| `client-organization` | `Client_Company` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `report-date` | `Report_Date` | ✅ | ⏳ Pending |
| `report-date1` | `Report_Date1` | ✅ | ⏳ Pending |
| `report-dateinspection` | `Report_DateInspection` | ✅ | ⏳ Pending |
| `report-hypothetical` | `Report_Hypothetical` | ✅ | ⏳ Pending |
| `report-intendeduse` | `Report_IntendedUse` | ✅ | ⏳ Pending |
| `report-intendeduser` | `Report_IntendedUser` | ✅ | ⏳ Pending |
| `report-legal` | `Report_Legal` | ✅ | ⏳ Pending |
| `report-valuescenario1` | `TBD` | ✅ | ⏳ Pending |
| `subject-econcharacteristics` | `TBD` | ✅ | ⏳ Pending |
| `subject-gba` | `Subject_GBA` | ✅ | ⏳ Pending |
| `subject-primary` | `Subject_Primary` | ✅ | ⏳ Pending |
| `subject-state` | `Subject_State` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| `subject-subtype` | `Subject_Subtype` | ✅ | ⏳ Pending |

---

## Page 13 (Assignment Identification - Continued)
Extraordinary assumptions, limiting conditions, and ownership history.

**Field Count:** 8

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `report-extraordinary` | `Report_Extraordinary` | ✅ | ⏳ Pending |
| `report-limcond` | `Report_LimCond` | ✅ | ⏳ Pending |
| `subject-exposuretime` | `Report_ExposureTime` | ✅ | ⏳ Pending |
| `subject-marketing` | `Report_Marketing` | ✅ | ⏳ Pending |
| `subject-owner` | `Subject_Owner` | ✅ | ⏳ Pending |
| `subject-salehistory` | `Subject_SalesHistory` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 14 (Assignment - Interest & Scope)
Fee simple interest, scope of work, and valuation methodology.

**Field Count:** 2

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 15 (Assignment - Scope Continued)
Scope of work and valuation methodology continued.

**Field Count:** 2

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 16 (Assignment - Scope Continued)
Scope of work conclusion.

**Field Count:** 5

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `appraiser1-name` | `Appraiser1_Name` | ❌ Missing | ⏳ Pending |
| `appraiser2-name` | `Appraiser2_Name` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `report-inspectiondate` | `TBD` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 17 (Property Analysis - Location)
Location analysis and neighborhood description.

**Field Count:** 2

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 18 (Property Analysis - Site Details)
Site characteristics, size, frontage, and access.

**Field Count:** 10

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `report-legal` | `Report_Legal` | ✅ | ⏳ Pending |
| `subject-shape` | `Subject_Shape` | ✅ | ⏳ Pending |
| `subject-sitequality` | `TBD` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| `subject-topography` | `Subject_Topography` | ✅ | ⏳ Pending |
| `subject-totalacre` | `Subject_TotalAcre` | ✅ | ⏳ Pending |
| `subject-totalsf` | `Subject_TotalSF` | ✅ | ⏳ Pending |
| `subject-usableacres` | `TBD` | ✅ | ⏳ Pending |
| `subject-usablesf` | `TBD` | ✅ | ⏳ Pending |

---

## Page 19 (Property Analysis - Site Continued)
Additional site details and environmental considerations.

**Field Count:** 2

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 20 (Property Analysis - Site Continued)
Utilities, services, and site conclusion.

**Field Count:** 2

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 21 (Property Analysis - Site Plan 1)
Site plan showing building footprints and layout.

**Field Count:** 4

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `site-plan-1-title` | `TBD` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| **Images:** | | | |
| `img-site-plan-1` | `Map_Survey1` | ✅ | ⏳ Pending |

---

## Page 22 (Property Analysis - Site Plan 2)
Additional site plan or survey details.

**Field Count:** 4

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `site-plan-2-title` | `TBD` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| **Images:** | | | |
| `img-site-plan-2` | `Map_Survey2` | ✅ | ⏳ Pending |

---

## Page 23 (Property Analysis - Taxes & Assessment)
Property taxes, assessment values, and tax analysis.

**Field Count:** 7

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| `subject-tax-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `subject-taxamount` | `TBD` | ✅ | ⏳ Pending |
| `subject-taxassessment` | `TBD` | ✅ | ⏳ Pending |
| `subject-taxrate` | `TBD` | ✅ | ⏳ Pending |
| `subject-taxyear` | `TBD` | ✅ | ⏳ Pending |

---

## Page 24 (Property Analysis - Zoning)
Land use and zoning regulations analysis.

**Field Count:** 12

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-conforminglot` | `TBD` | ✅ | ⏳ Pending |
| `subject-conforminguse` | `TBD` | ✅ | ⏳ Pending |
| `subject-legally-permitted` | `TBD` | ✅ | ⏳ Pending |
| `subject-permitteduses` | `TBD` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| `subject-subtype` | `Subject_Subtype` | ✅ | ⏳ Pending |
| `subject-zoning` | `Subject_Zoning` | ✅ | ⏳ Pending |
| `subject-zoningauthority` | `TBD` | ✅ | ⏳ Pending |
| `subject-zoningchange` | `TBD` | ✅ | ⏳ Pending |
| `subject-zoningchangestatus` | `TBD` | ✅ | ⏳ Pending |
| `subject-zoningdescription` | `TBD` | ✅ | ⏳ Pending |

---

## Page 25 (Property Analysis - Zoning Map)
Zoning map showing subject property zoning district.

**Field Count:** 4

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| `zoning-map-title` | `TBD` | ✅ | ⏳ Pending |
| **Images:** | | | |
| `img-zoning-map` | `TBD` | ✅ | ⏳ Pending |

---

## Page 26 (Property Analysis - Improvements)
Description of building improvements, construction, and condition.

**Field Count:** 10

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `sk-avgrent-1bed` | `TBD` | ✅ | ⏳ Pending |
| `sk-avgrent-2bed` | `TBD` | ✅ | ⏳ Pending |
| `sk-avgrent-3bed` | `TBD` | ✅ | ⏳ Pending |
| `sk-avgrent-bachelor` | `TBD` | ✅ | ⏳ Pending |
| `sk-new-supply` | `TBD` | ✅ | ⏳ Pending |
| `sk-rental-rate-growth` | `TBD` | ✅ | ⏳ Pending |
| `sk-supply-growth-rate` | `TBD` | ✅ | ⏳ Pending |
| `sk-vacancy-rate` | `TBD` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 27 (Property Analysis - Improvements Cont.)
Building amenities, parking, and mechanical systems.

**Field Count:** 5

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `hbu-conclusion-vacant` | `TBD` | ✅ | ⏳ Pending |
| `site-size` | `TBD` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| `zoning-designation` | `TBD` | ✅ | ⏳ Pending |

---

## Page 28 (Property Analysis - Improvements Cont.)
Additional improvements details and physical characteristics.

**Field Count:** 2

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 29 (Market Context - Economic Overview)
Economic and demographic overview of the market area.

**Field Count:** 2

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 30 (Market Context - Economic Cont.)
Continued economic analysis and market trends.

**Field Count:** 2

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 31 (Market Context - Multi-Family Market)
Multi-family market overview, vacancy, and rent trends.

**Field Count:** 2

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 32 (Valuation - HBU Conclusion)
Highest & Best Use analysis and conclusion.

**Field Count:** 39

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `rentroll-avg-actual-sf` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-avg-actual-unit` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-avg-asking-sf` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-avg-asking-unit` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-avg-occ-pct` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-avg-recent-sf` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-avg-recent-unit` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-avg-size` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-avg-vac-pct` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-total-occ` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-total-pct` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-total-units` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-total-vac` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-type1-actual-sf` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-type1-actual-unit` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-type1-desc` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-type1-name` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-type1-occ` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-type1-occ-pct` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-type1-pct` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-type1-recent-sf` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-type1-size` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-type1-total` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-type1-vac` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-type1-vac-pct` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-type2-actual-sf` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-type2-actual-unit` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-type2-desc` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-type2-name` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-type2-occ` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-type2-occ-pct` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-type2-pct` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-type2-recent-sf` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-type2-size` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-type2-total` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-type2-vac` | `TBD` | ✅ | ⏳ Pending |
| `rentroll-type2-vac-pct` | `TBD` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 33 (Valuation - Rent Roll Analysis)
Subject property rent roll with unit details and current rents.

**Field Count:** 132

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `rentcomp1-address` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp1-appeal` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp1-avg-unit-sf` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp1-city` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp1-condition` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp1-laundry` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp1-location` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp1-name` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp1-parking-incl` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp1-parking-type` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp1-proj-amenities` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp1-province` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp1-quality` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp1-rent-sf-avg` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp1-rent-unit-avg` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp1-renttype` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp1-security` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp1-surveycomments` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp1-totaladj` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp1-unit-amenities` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp1-units` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp1-utilities` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp2-address` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp2-appeal` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp2-avg-unit-sf` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp2-city` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp2-condition` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp2-laundry` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp2-location` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp2-name` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp2-parking-incl` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp2-parking-type` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp2-proj-amenities` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp2-province` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp2-quality` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp2-rent-sf-avg` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp2-rent-unit-avg` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp2-renttype` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp2-security` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp2-surveycomments` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp2-totaladj` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp2-unit-amenities` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp2-units` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp2-utilities` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp3-address` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp3-appeal` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp3-avg-unit-sf` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp3-city` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp3-condition` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp3-laundry` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp3-location` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp3-name` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp3-parking-incl` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp3-parking-type` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp3-proj-amenities` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp3-province` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp3-quality` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp3-rent-sf-avg` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp3-rent-unit-avg` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp3-renttype` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp3-security` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp3-surveycomments` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp3-totaladj` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp3-unit-amenities` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp3-units` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp3-utilities` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp4-address` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp4-appeal` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp4-avg-unit-sf` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp4-city` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp4-condition` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp4-laundry` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp4-location` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp4-name` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp4-parking-incl` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp4-parking-type` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp4-proj-amenities` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp4-province` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp4-quality` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp4-rent-sf-avg` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp4-rent-unit-avg` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp4-renttype` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp4-security` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp4-surveycomments` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp4-totaladj` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp4-unit-amenities` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp4-units` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp4-utilities` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp5-address` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp5-appeal` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp5-avg-unit-sf` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp5-city` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp5-condition` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp5-laundry` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp5-location` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp5-name` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp5-parking-incl` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp5-parking-type` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp5-proj-amenities` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp5-province` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp5-quality` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp5-rent-sf-avg` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp5-rent-unit-avg` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp5-renttype` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp5-security` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp5-surveycomments` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp5-totaladj` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp5-unit-amenities` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp5-units` | `TBD` | ✅ | ⏳ Pending |
| `rentcomp5-utilities` | `TBD` | ✅ | ⏳ Pending |
| `subject-appeal` | `TBD` | ✅ | ⏳ Pending |
| `subject-avg-unit-sf` | `TBD` | ✅ | ⏳ Pending |
| `subject-city` | `Subject_City` | ✅ | ⏳ Pending |
| `subject-condition` | `Subject_Condition` | ✅ | ⏳ Pending |
| `subject-laundry` | `Subject_Laundry` | ✅ | ⏳ Pending |
| `subject-location` | `TBD` | ✅ | ⏳ Pending |
| `subject-name` | `Subject_Name` | ✅ | ⏳ Pending |
| `subject-parking-incl` | `TBD` | ✅ | ⏳ Pending |
| `subject-parking-type` | `Subject_ParkingType` | ✅ | ⏳ Pending |
| `subject-proj-amenities` | `Subject_AmenitiesProject` | ✅ | ⏳ Pending |
| `subject-province` | `TBD` | ✅ | ⏳ Pending |
| `subject-quality` | `TBD` | ✅ | ⏳ Pending |
| `subject-rent-sf-avg` | `TBD` | ✅ | ⏳ Pending |
| `subject-rent-unit-avg` | `TBD` | ✅ | ⏳ Pending |
| `subject-renttype` | `TBD` | ✅ | ⏳ Pending |
| `subject-security` | `TBD` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| `subject-surveycomments` | `TBD` | ✅ | ⏳ Pending |
| `subject-unit-amenities` | `Subject_AmenitiesUnit` | ✅ | ⏳ Pending |
| `subject-units` | `Subject_Units` | ✅ | ⏳ Pending |
| `subject-utilities` | `TBD` | ✅ | ⏳ Pending |

---

## Page 34 (Valuation - Rental Comparables Map)
Location map of rental comparable properties.

**Field Count:** 18

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `rental-comp1-address-full` | `TBD` | ✅ | ⏳ Pending |
| `rental-comp1-distance` | `TBD` | ✅ | ⏳ Pending |
| `rental-comp1-label` | `TBD` | ✅ | ⏳ Pending |
| `rental-comp2-address-full` | `TBD` | ✅ | ⏳ Pending |
| `rental-comp2-distance` | `TBD` | ✅ | ⏳ Pending |
| `rental-comp2-label` | `TBD` | ✅ | ⏳ Pending |
| `rental-comp3-address-full` | `TBD` | ✅ | ⏳ Pending |
| `rental-comp3-distance` | `TBD` | ✅ | ⏳ Pending |
| `rental-comp3-label` | `TBD` | ✅ | ⏳ Pending |
| `rental-comp4-address-full` | `TBD` | ✅ | ⏳ Pending |
| `rental-comp4-distance` | `TBD` | ✅ | ⏳ Pending |
| `rental-comp4-label` | `TBD` | ✅ | ⏳ Pending |
| `rental-comp5-address-full` | `TBD` | ✅ | ⏳ Pending |
| `rental-comp5-distance` | `TBD` | ✅ | ⏳ Pending |
| `rental-comp5-label` | `TBD` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| **Images:** | | | |
| `img-rental-comparables-map` | `TBD` | ✅ | ⏳ Pending |

---

## Page 35 (Valuation - Approaches to Value)
Overview of valuation approaches used in the appraisal.

**Field Count:** 85

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `market-rent-1bed-avg-rentsf` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-avg-rentsf-unadj` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-avg-rentunit` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-avg-unitsize` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp1-rentsf` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp1-rentsf-unadj` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp1-rentunit` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp1-unitsize` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp2-rentsf` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp2-rentsf-unadj` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp2-rentunit` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp2-unitsize` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp3-rentsf` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp3-rentsf-unadj` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp3-rentunit` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp3-unitsize` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp4-rentsf` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp4-rentsf-unadj` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp4-rentunit` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp4-unitsize` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp5-rentsf` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp5-rentsf-unadj` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp5-rentunit` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp5-unitsize` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-high-rentsf` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-high-rentsf-unadj` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-high-rentunit` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-high-unitsize` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-low-rentsf` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-low-rentsf-unadj` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-low-rentunit` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-low-unitsize` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-med-rentsf` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-med-rentsf-unadj` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-med-rentunit` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-med-unitsize` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed1bath-conclusionsf` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed1bath-rentsf` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed1bath-rentunit` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed1bath-unitsize` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-avg-netadj` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-avg-rentsf` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-avg-rentsf-unadj` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-avg-rentunit` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-avg-unitsize` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp1-netadj` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp1-rentsf` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp1-rentsf-unadj` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp1-rentunit` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp1-unitsize` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp2-netadj` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp2-rentsf` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp2-rentsf-unadj` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp2-rentunit` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp2-unitsize` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp3-netadj` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp3-rentsf` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp3-rentsf-unadj` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp3-rentunit` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp3-unitsize` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp4-netadj` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp4-rentsf` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp4-rentsf-unadj` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp4-rentunit` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp4-unitsize` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp5-netadj` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp5-rentsf` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp5-rentsf-unadj` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp5-rentunit` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp5-unitsize` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-high-rentsf` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-high-rentsf-unadj` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-high-rentunit` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-high-unitsize` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-low-netadj` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-low-rentsf` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-low-rentsf-unadj` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-low-rentunit` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-low-unitsize` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-med-rentsf` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-med-rentsf-unadj` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-med-rentunit` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-2bed-med-unitsize` | `TBD` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 36 (Valuation - Methodology)
Valuation methodology overview and approaches applied.

**Field Count:** 2

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 37 (Income Approach - Overview)
Direct capitalization method overview and rent analysis.

**Field Count:** 63

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `contract-vs-market-percentage` | `TBD` | ✅ | ⏳ Pending |
| `contractvsmarket-1bed-actualrent` | `TBD` | ✅ | ⏳ Pending |
| `contractvsmarket-1bed-askingrent` | `TBD` | ✅ | ⏳ Pending |
| `contractvsmarket-1bed-concludedrent` | `TBD` | ✅ | ⏳ Pending |
| `contractvsmarket-1bed-percentage` | `TBD` | ✅ | ⏳ Pending |
| `contractvsmarket-1bed-units` | `TBD` | ✅ | ⏳ Pending |
| `contractvsmarket-2bed-actualrent` | `TBD` | ✅ | ⏳ Pending |
| `contractvsmarket-2bed-askingrent` | `TBD` | ✅ | ⏳ Pending |
| `contractvsmarket-2bed-concludedrent` | `TBD` | ✅ | ⏳ Pending |
| `contractvsmarket-2bed-percentage` | `TBD` | ✅ | ⏳ Pending |
| `contractvsmarket-2bed-units` | `TBD` | ✅ | ⏳ Pending |
| `contractvsmarket-total-actualrent` | `TBD` | ✅ | ⏳ Pending |
| `contractvsmarket-total-askingrent` | `TBD` | ✅ | ⏳ Pending |
| `contractvsmarket-total-concludedrent` | `TBD` | ✅ | ⏳ Pending |
| `contractvsmarket-total-percentage` | `TBD` | ✅ | ⏳ Pending |
| `contractvsmarket-total-units` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-concluded` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-concluded-sf` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-rangehigh` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-rangelow` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-sf-high` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-1bed-sf-low` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-comps-count` | `TBD` | ✅ | ⏳ Pending |
| `market-rent-comps-markets` | `TBD` | ✅ | ⏳ Pending |
| `otherrevenue-laundry-percent` | `TBD` | ✅ | ⏳ Pending |
| `otherrevenue-laundry-persf` | `TBD` | ✅ | ⏳ Pending |
| `otherrevenue-laundry-perunit` | `TBD` | ✅ | ⏳ Pending |
| `otherrevenue-laundry-total` | `TBD` | ✅ | ⏳ Pending |
| `otherrevenue-parking-percent` | `TBD` | ✅ | ⏳ Pending |
| `otherrevenue-parking-persf` | `TBD` | ✅ | ⏳ Pending |
| `otherrevenue-parking-perunit` | `TBD` | ✅ | ⏳ Pending |
| `otherrevenue-parking-total` | `TBD` | ✅ | ⏳ Pending |
| `otherrevenue-total-persf` | `TBD` | ✅ | ⏳ Pending |
| `otherrevenue-total-perunit` | `TBD` | ✅ | ⏳ Pending |
| `otherrevenue-total-total` | `TBD` | ✅ | ⏳ Pending |
| `rentalrevenue-1bed-contractrent` | `TBD` | ✅ | ⏳ Pending |
| `rentalrevenue-1bed-convvmkt` | `TBD` | ✅ | ⏳ Pending |
| `rentalrevenue-1bed-marketrent` | `TBD` | ✅ | ⏳ Pending |
| `rentalrevenue-1bed-persf` | `TBD` | ✅ | ⏳ Pending |
| `rentalrevenue-1bed-perunit` | `TBD` | ✅ | ⏳ Pending |
| `rentalrevenue-1bed-peryear` | `TBD` | ✅ | ⏳ Pending |
| `rentalrevenue-1bed-units` | `TBD` | ✅ | ⏳ Pending |
| `rentalrevenue-2bed-contractrent` | `TBD` | ✅ | ⏳ Pending |
| `rentalrevenue-2bed-convvmkt` | `TBD` | ✅ | ⏳ Pending |
| `rentalrevenue-2bed-marketrent` | `TBD` | ✅ | ⏳ Pending |
| `rentalrevenue-2bed-persf` | `TBD` | ✅ | ⏳ Pending |
| `rentalrevenue-2bed-perunit` | `TBD` | ✅ | ⏳ Pending |
| `rentalrevenue-2bed-peryear` | `TBD` | ✅ | ⏳ Pending |
| `rentalrevenue-2bed-units` | `TBD` | ✅ | ⏳ Pending |
| `rentalrevenue-total-contractrent` | `TBD` | ✅ | ⏳ Pending |
| `rentalrevenue-total-convvmkt` | `TBD` | ✅ | ⏳ Pending |
| `rentalrevenue-total-marketrent` | `TBD` | ✅ | ⏳ Pending |
| `rentalrevenue-total-persf` | `TBD` | ✅ | ⏳ Pending |
| `rentalrevenue-total-perunit` | `TBD` | ✅ | ⏳ Pending |
| `rentalrevenue-total-peryear` | `TBD` | ✅ | ⏳ Pending |
| `subject-amenities-laundry` | `TBD` | ✅ | ⏳ Pending |
| `subject-amenities-parking` | `TBD` | ✅ | ⏳ Pending |
| `subject-amenities-utilities` | `TBD` | ✅ | ⏳ Pending |
| `subject-name` | `Subject_Name` | ✅ | ⏳ Pending |
| `subject-quality-rating` | `Subject_Quality` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| `subject-units` | `Subject_Units` | ✅ | ⏳ Pending |

---

## Page 38 (Income Approach - Rent Comparables Grid)
Rental comparable properties summary grid.

**Field Count:** 10

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `calc-egr` | `IA_DirCap_EGI` | ✅ | ⏳ Pending |
| `calc-egr-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `calc-egr-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-occupancy-current` | `TBD` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| `vacancy-loss-sf` | `TBD` | ✅ | ⏳ Pending |
| `vacancy-loss-unit` | `TBD` | ✅ | ⏳ Pending |
| `vacancy-loss-year` | `TBD` | ✅ | ⏳ Pending |
| `vacancy-rate-concluded` | `TBD` | ✅ | ⏳ Pending |

---

## Page 39 (Income Approach - Rent Comp Summary)
Detailed rental comparable analysis and adjustments.

**Field Count:** 99

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `calc-egr` | `IA_DirCap_EGI` | ✅ | ⏳ Pending |
| `calc-egr-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-insurance-annual` | `IA_Expense02` | ✅ | ⏳ Pending |
| `calc-exp-insurance-pct-pgr` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-insurance-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-management-annual` | `IA_Expense03` | ✅ | ⏳ Pending |
| `calc-exp-management-pct-pgr` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-management-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-other-annual` | `IA_Expense07` | ✅ | ⏳ Pending |
| `calc-exp-other-pct-pgr` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-other-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-payroll-annual` | `IA_Expense06` | ✅ | ⏳ Pending |
| `calc-exp-payroll-pct-pgr` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-payroll-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-repairs-annual` | `IA_Expense05` | ✅ | ⏳ Pending |
| `calc-exp-repairs-pct-pgr` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-repairs-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-taxes-annual` | `IA_Expense01` | ✅ | ⏳ Pending |
| `calc-exp-taxes-pct-pgr` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-taxes-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-utilities-annual` | `IA_Expense04` | ✅ | ⏳ Pending |
| `calc-exp-utilities-pct-pgr` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-utilities-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-expense-ratio` | `IA_ExpenseRatio` | ✅ | ⏳ Pending |
| `calc-expenses-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-expenses-total` | `TBD` | ✅ | ⏳ Pending |
| `calc-noi` | `IA_DirCap_NOI` | ✅ | ⏳ Pending |
| `calc-noi-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-other-income` | `TBD` | ✅ | ⏳ Pending |
| `calc-other-income-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-pgr` | `IA_PGRev` | ✅ | ⏳ Pending |
| `calc-pgr-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-rental-revenue-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-total-rental-revenue` | `TBD` | ✅ | ⏳ Pending |
| `calc-vacancy-loss` | `IA_VacancyDCF` | ✅ | ⏳ Pending |
| `calc-vacancy-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-vacancy-rate` | `IA_VacancyDCF` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `egr-proj-pct` | `TBD` | ✅ | ⏳ Pending |
| `hist-egr-pct-pgr` | `TBD` | ✅ | ⏳ Pending |
| `hist-egr-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `hist-egr-total` | `TBD` | ✅ | ⏳ Pending |
| `hist-exp-insurance-pct-pgr` | `TBD` | ✅ | ⏳ Pending |
| `hist-exp-insurance-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `hist-exp-insurance-total` | `TBD` | ✅ | ⏳ Pending |
| `hist-exp-management-pct-pgr` | `TBD` | ✅ | ⏳ Pending |
| `hist-exp-management-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `hist-exp-management-total` | `TBD` | ✅ | ⏳ Pending |
| `hist-exp-other-pct-pgr` | `TBD` | ✅ | ⏳ Pending |
| `hist-exp-other-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `hist-exp-other-total` | `TBD` | ✅ | ⏳ Pending |
| `hist-exp-payroll-pct-pgr` | `TBD` | ✅ | ⏳ Pending |
| `hist-exp-payroll-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `hist-exp-payroll-total` | `TBD` | ✅ | ⏳ Pending |
| `hist-exp-repairs-pct-pgr` | `TBD` | ✅ | ⏳ Pending |
| `hist-exp-repairs-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `hist-exp-repairs-total` | `TBD` | ✅ | ⏳ Pending |
| `hist-exp-taxes-pct-pgr` | `TBD` | ✅ | ⏳ Pending |
| `hist-exp-taxes-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `hist-exp-taxes-total` | `TBD` | ✅ | ⏳ Pending |
| `hist-exp-total-pct-pgr` | `TBD` | ✅ | ⏳ Pending |
| `hist-exp-total-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `hist-exp-total-total` | `TBD` | ✅ | ⏳ Pending |
| `hist-exp-utilities-pct-pgr` | `TBD` | ✅ | ⏳ Pending |
| `hist-exp-utilities-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `hist-exp-utilities-total` | `TBD` | ✅ | ⏳ Pending |
| `hist-noi-pct-pgr` | `TBD` | ✅ | ⏳ Pending |
| `hist-noi-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `hist-noi-total` | `TBD` | ✅ | ⏳ Pending |
| `hist-pgr-pct-pgr` | `TBD` | ✅ | ⏳ Pending |
| `hist-pgr-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `hist-pgr-total` | `TBD` | ✅ | ⏳ Pending |
| `hist-revenue-laundry-pct-pgr` | `TBD` | ✅ | ⏳ Pending |
| `hist-revenue-laundry-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `hist-revenue-laundry-total` | `TBD` | ✅ | ⏳ Pending |
| `hist-revenue-misc-pct-pgr` | `TBD` | ✅ | ⏳ Pending |
| `hist-revenue-misc-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `hist-revenue-misc-total` | `TBD` | ✅ | ⏳ Pending |
| `hist-revenue-multifamily-pct-pgr` | `TBD` | ✅ | ⏳ Pending |
| `hist-revenue-multifamily-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `hist-revenue-multifamily-total` | `TBD` | ✅ | ⏳ Pending |
| `hist-revenue-parking-pct-pgr` | `TBD` | ✅ | ⏳ Pending |
| `hist-revenue-parking-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `hist-revenue-parking-total` | `TBD` | ✅ | ⏳ Pending |
| `hist-revenue-rental-pct-pgr` | `TBD` | ✅ | ⏳ Pending |
| `hist-revenue-rental-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `hist-revenue-rental-total` | `TBD` | ✅ | ⏳ Pending |
| `hist-vacancy-pct-pgr` | `TBD` | ✅ | ⏳ Pending |
| `hist-vacancy-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `hist-vacancy-total` | `TBD` | ✅ | ⏳ Pending |
| `noi-proj-pct` | `TBD` | ✅ | ⏳ Pending |
| `pgr-proj-pct` | `TBD` | ✅ | ⏳ Pending |
| `revenue-laundry-proj-pct` | `TBD` | ✅ | ⏳ Pending |
| `revenue-laundry-proj-total` | `TBD` | ✅ | ⏳ Pending |
| `revenue-misc-proj-pct` | `TBD` | ✅ | ⏳ Pending |
| `revenue-multifamily-proj-pct` | `TBD` | ✅ | ⏳ Pending |
| `revenue-parking-proj-pct` | `TBD` | ✅ | ⏳ Pending |
| `revenue-rental-proj-pct` | `TBD` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 40 (Income Approach - Rent Comp 1)
Rental Comparable Property 1 detailed analysis.

**Field Count:** 44

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `calc-exp-insurance-annual` | `IA_Expense02` | ✅ | ⏳ Pending |
| `calc-exp-insurance-pct-egr` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-insurance-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-insurance-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-management-annual` | `IA_Expense03` | ✅ | ⏳ Pending |
| `calc-exp-management-pct-egr` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-management-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-management-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-other-annual` | `IA_Expense07` | ✅ | ⏳ Pending |
| `calc-exp-other-pct-egr` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-other-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-other-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-payroll-annual` | `IA_Expense06` | ✅ | ⏳ Pending |
| `calc-exp-payroll-pct-egr` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-payroll-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-payroll-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-repairs-annual` | `IA_Expense05` | ✅ | ⏳ Pending |
| `calc-exp-repairs-pct-egr` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-repairs-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-repairs-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-taxes-annual` | `IA_Expense01` | ✅ | ⏳ Pending |
| `calc-exp-taxes-pct-egr` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-taxes-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-taxes-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-utilities-annual` | `IA_Expense04` | ✅ | ⏳ Pending |
| `calc-exp-utilities-pct-egr` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-utilities-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-utilities-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-expense-ratio` | `IA_ExpenseRatio` | ✅ | ⏳ Pending |
| `calc-expenses-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `calc-expenses-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-expenses-total` | `TBD` | ✅ | ⏳ Pending |
| `calc-noi` | `IA_DirCap_NOI` | ✅ | ⏳ Pending |
| `calc-noi-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `calc-noi-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `exp-insurance-comment` | `TBD` | ✅ | ⏳ Pending |
| `exp-management-comment` | `TBD` | ✅ | ⏳ Pending |
| `exp-other-comment` | `TBD` | ✅ | ⏳ Pending |
| `exp-payroll-comment` | `TBD` | ✅ | ⏳ Pending |
| `exp-repairs-comment` | `TBD` | ✅ | ⏳ Pending |
| `exp-taxes-comment` | `TBD` | ✅ | ⏳ Pending |
| `exp-utilities-comment` | `TBD` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 41 (Income Approach - Rent Comp 2-3)
Rental Comparable Properties 2-3 detailed analysis.

**Field Count:** 5

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `bond-yield-10yr` | `TBD` | ✅ | ⏳ Pending |
| `cap-rate-implied-range` | `TBD` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `risk-premium-bp` | `TBD` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 42 (Income Approach - Rent Conclusion)
Rental rate conclusion and market rent determination.

**Field Count:** 70

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `cap-rate-average` | `TBD` | ✅ | ⏳ Pending |
| `cap-rate-high` | `TBD` | ✅ | ⏳ Pending |
| `cap-rate-low` | `TBD` | ✅ | ⏳ Pending |
| `comp1-address` | `SA1_1_Address` | ✅ | ⏳ Pending |
| `comp1-cap-rate` | `TBD` | ✅ | ⏳ Pending |
| `comp1-city` | `SA1_1_City` | ✅ | ⏳ Pending |
| `comp1-gba` | `SA1_1_GBA` | ✅ | ⏳ Pending |
| `comp1-name` | `TBD` | ✅ | ⏳ Pending |
| `comp1-noi` | `TBD` | ✅ | ⏳ Pending |
| `comp1-noi-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp1-price-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `comp1-province` | `SA1_1_State` | ✅ | ⏳ Pending |
| `comp1-sale-date` | `TBD` | ✅ | ⏳ Pending |
| `comp1-sale-price` | `TBD` | ✅ | ⏳ Pending |
| `comp1-units` | `TBD` | ✅ | ⏳ Pending |
| `comp1-year` | `TBD` | ✅ | ⏳ Pending |
| `comp2-address` | `SA1_2_Address` | ✅ | ⏳ Pending |
| `comp2-cap-rate` | `TBD` | ✅ | ⏳ Pending |
| `comp2-city` | `SA1_2_City` | ✅ | ⏳ Pending |
| `comp2-gba` | `SA1_2_GBA` | ✅ | ⏳ Pending |
| `comp2-name` | `TBD` | ✅ | ⏳ Pending |
| `comp2-noi` | `TBD` | ✅ | ⏳ Pending |
| `comp2-noi-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp2-price-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `comp2-province` | `SA1_2_State` | ✅ | ⏳ Pending |
| `comp2-sale-date` | `TBD` | ✅ | ⏳ Pending |
| `comp2-sale-price` | `TBD` | ✅ | ⏳ Pending |
| `comp2-units` | `TBD` | ✅ | ⏳ Pending |
| `comp2-year` | `TBD` | ✅ | ⏳ Pending |
| `comp3-address` | `SA1_3_Address` | ✅ | ⏳ Pending |
| `comp3-cap-rate` | `TBD` | ✅ | ⏳ Pending |
| `comp3-city` | `SA1_3_City` | ✅ | ⏳ Pending |
| `comp3-gba` | `SA1_3_GBA` | ✅ | ⏳ Pending |
| `comp3-name` | `TBD` | ✅ | ⏳ Pending |
| `comp3-noi` | `TBD` | ✅ | ⏳ Pending |
| `comp3-noi-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp3-price-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `comp3-province` | `SA1_3_State` | ✅ | ⏳ Pending |
| `comp3-sale-date` | `TBD` | ✅ | ⏳ Pending |
| `comp3-sale-price` | `TBD` | ✅ | ⏳ Pending |
| `comp3-units` | `TBD` | ✅ | ⏳ Pending |
| `comp3-year` | `TBD` | ✅ | ⏳ Pending |
| `comp4-address` | `SA1_4_Address` | ✅ | ⏳ Pending |
| `comp4-cap-rate` | `TBD` | ✅ | ⏳ Pending |
| `comp4-city` | `SA1_4_City` | ✅ | ⏳ Pending |
| `comp4-gba` | `SA1_4_GBA` | ✅ | ⏳ Pending |
| `comp4-name` | `TBD` | ✅ | ⏳ Pending |
| `comp4-noi` | `TBD` | ✅ | ⏳ Pending |
| `comp4-noi-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp4-price-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `comp4-province` | `SA1_4_State` | ✅ | ⏳ Pending |
| `comp4-sale-date` | `TBD` | ✅ | ⏳ Pending |
| `comp4-sale-price` | `TBD` | ✅ | ⏳ Pending |
| `comp4-units` | `TBD` | ✅ | ⏳ Pending |
| `comp4-year` | `TBD` | ✅ | ⏳ Pending |
| `comp5-address` | `SA1_5_Address` | ✅ | ⏳ Pending |
| `comp5-cap-rate` | `TBD` | ✅ | ⏳ Pending |
| `comp5-city` | `SA1_5_City` | ✅ | ⏳ Pending |
| `comp5-gba` | `SA1_5_GBA` | ✅ | ⏳ Pending |
| `comp5-name` | `TBD` | ✅ | ⏳ Pending |
| `comp5-noi` | `TBD` | ✅ | ⏳ Pending |
| `comp5-noi-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp5-price-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `comp5-province` | `SA1_5_State` | ✅ | ⏳ Pending |
| `comp5-sale-date` | `TBD` | ✅ | ⏳ Pending |
| `comp5-sale-price` | `TBD` | ✅ | ⏳ Pending |
| `comp5-units` | `TBD` | ✅ | ⏳ Pending |
| `comp5-year` | `TBD` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 43 (Income Approach - Income Analysis)
Potential gross income and effective gross income analysis.

**Field Count:** 9

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `calc-cap-rate` | `IA_DirCap_CapRate` | ✅ | ⏳ Pending |
| `cap-rate-average` | `TBD` | ✅ | ⏳ Pending |
| `cap-rate-high` | `TBD` | ✅ | ⏳ Pending |
| `cap-rate-low` | `TBD` | ✅ | ⏳ Pending |
| `cap-rate-range` | `TBD` | ✅ | ⏳ Pending |
| `comp5-cap-rate` | `TBD` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| `year-built` | `Subject_YearBuilt` | ✅ | ⏳ Pending |

---

## Page 44 (Income Approach - Operating Expenses)
Operating expenses analysis and expense ratio.

**Field Count:** 80

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `calc-cap-rate` | `IA_DirCap_CapRate` | ✅ | ⏳ Pending |
| `calc-egr` | `IA_DirCap_EGI` | ✅ | ⏳ Pending |
| `calc-egr-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `calc-egr-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-insurance-annual` | `IA_Expense02` | ✅ | ⏳ Pending |
| `calc-exp-insurance-pct-egr` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-insurance-pct-pgr` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-insurance-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-insurance-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-management-annual` | `IA_Expense03` | ✅ | ⏳ Pending |
| `calc-exp-management-pct-egr` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-management-pct-pgr` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-management-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-management-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-other-annual` | `IA_Expense07` | ✅ | ⏳ Pending |
| `calc-exp-other-pct-egr` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-other-pct-pgr` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-other-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-other-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-payroll-annual` | `IA_Expense06` | ✅ | ⏳ Pending |
| `calc-exp-payroll-pct-egr` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-payroll-pct-pgr` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-payroll-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-payroll-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-repairs-annual` | `IA_Expense05` | ✅ | ⏳ Pending |
| `calc-exp-repairs-pct-egr` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-repairs-pct-pgr` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-repairs-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-repairs-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-taxes-annual` | `IA_Expense01` | ✅ | ⏳ Pending |
| `calc-exp-taxes-pct-egr` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-taxes-pct-pgr` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-taxes-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-taxes-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-utilities-annual` | `IA_Expense04` | ✅ | ⏳ Pending |
| `calc-exp-utilities-pct-egr` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-utilities-pct-pgr` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-utilities-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `calc-exp-utilities-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-expense-ratio` | `IA_ExpenseRatio` | ✅ | ⏳ Pending |
| `calc-expenses-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `calc-expenses-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-expenses-total` | `TBD` | ✅ | ⏳ Pending |
| `calc-indicated-value` | `IA_IndicatedValue` | ✅ | ⏳ Pending |
| `calc-indicated-value-rounded` | `IA_IndicatedValueRounded` | ✅ | ⏳ Pending |
| `calc-noi` | `IA_DirCap_NOI` | ✅ | ⏳ Pending |
| `calc-noi-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `calc-noi-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-other-income` | `TBD` | ✅ | ⏳ Pending |
| `calc-other-income-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `calc-other-income-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-pgr` | `IA_PGRev` | ✅ | ⏳ Pending |
| `calc-pgr-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `calc-pgr-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-total-rental-revenue` | `TBD` | ✅ | ⏳ Pending |
| `calc-type-total-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `calc-type-total-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-type1-annual` | `TBD` | ✅ | ⏳ Pending |
| `calc-type1-cont-v-market` | `TBD` | ✅ | ⏳ Pending |
| `calc-type1-contract-rent` | `TBD` | ✅ | ⏳ Pending |
| `calc-type1-count` | `TBD` | ✅ | ⏳ Pending |
| `calc-type1-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `calc-type1-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-type1-rent` | `TBD` | ✅ | ⏳ Pending |
| `calc-type2-annual` | `TBD` | ✅ | ⏳ Pending |
| `calc-type2-cont-v-market` | `TBD` | ✅ | ⏳ Pending |
| `calc-type2-contract-rent` | `TBD` | ✅ | ⏳ Pending |
| `calc-type2-count` | `TBD` | ✅ | ⏳ Pending |
| `calc-type2-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `calc-type2-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-type2-rent` | `TBD` | ✅ | ⏳ Pending |
| `calc-vacancy-loss` | `IA_VacancyDCF` | ✅ | ⏳ Pending |
| `calc-vacancy-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `calc-vacancy-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `calc-vacancy-rate` | `IA_VacancyDCF` | ✅ | ⏳ Pending |
| `calc-value-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `calc-value-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| `total-units` | `TBD` | ✅ | ⏳ Pending |

---

## Page 45 (Income Approach - Cap Rate Analysis)
Capitalization rate analysis and market cap rate survey.

**Field Count:** 7

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `calc-cap-rate` | `IA_DirCap_CapRate` | ✅ | ⏳ Pending |
| `calc-indicated-value-rounded` | `IA_IndicatedValueRounded` | ✅ | ⏳ Pending |
| `calc-noi` | `IA_DirCap_NOI` | ✅ | ⏳ Pending |
| `calc-noi-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `calc-value-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 46 (Income Approach - Cap Rate Cont.)
Continued cap rate analysis and conclusion.

**Field Count:** 2

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 47 (Income Approach - Direct Cap Grid)
Direct capitalization calculation summary grid.

**Field Count:** 2

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 48 (Sales Comparison - Comparables Map)
Location map of sales comparable properties.

**Field Count:** 18

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `comp1-address-full` | `TBD` | ✅ | ⏳ Pending |
| `comp1-distance` | `TBD` | ✅ | ⏳ Pending |
| `comp1-label` | `TBD` | ✅ | ⏳ Pending |
| `comp2-address-full` | `TBD` | ✅ | ⏳ Pending |
| `comp2-distance` | `TBD` | ✅ | ⏳ Pending |
| `comp2-label` | `TBD` | ✅ | ⏳ Pending |
| `comp3-address-full` | `TBD` | ✅ | ⏳ Pending |
| `comp3-distance` | `TBD` | ✅ | ⏳ Pending |
| `comp3-label` | `TBD` | ✅ | ⏳ Pending |
| `comp4-address-full` | `TBD` | ✅ | ⏳ Pending |
| `comp4-distance` | `TBD` | ✅ | ⏳ Pending |
| `comp4-label` | `TBD` | ✅ | ⏳ Pending |
| `comp5-address-full` | `TBD` | ✅ | ⏳ Pending |
| `comp5-distance` | `TBD` | ✅ | ⏳ Pending |
| `comp5-label` | `TBD` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| **Images:** | | | |
| `img-comparables-map` | `TBD` | ✅ | ⏳ Pending |

---

## Page 49 (Sales Comparison - Adjustment Grid)
Sales comparison adjustment grid with comparable properties.

**Field Count:** 43

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `comp1-address` | `SA1_1_Address` | ✅ | ⏳ Pending |
| `comp1-analysis-price` | `TBD` | ✅ | ⏳ Pending |
| `comp1-analysis-price-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp1-buyer` | `TBD` | ✅ | ⏳ Pending |
| `comp1-cap-rate` | `TBD` | ✅ | ⏳ Pending |
| `comp1-city-state-zip` | `TBD` | ✅ | ⏳ Pending |
| `comp1-conditions-of-sale` | `TBD` | ✅ | ⏳ Pending |
| `comp1-corner` | `TBD` | ✅ | ⏳ Pending |
| `comp1-county` | `TBD` | ✅ | ⏳ Pending |
| `comp1-financing` | `TBD` | ✅ | ⏳ Pending |
| `comp1-gba` | `SA1_1_GBA` | ✅ | ⏳ Pending |
| `comp1-landarea` | `TBD` | ✅ | ⏳ Pending |
| `comp1-laundry` | `TBD` | ✅ | ⏳ Pending |
| `comp1-map` | `TBD` | ✅ | ⏳ Pending |
| `comp1-name` | `TBD` | ✅ | ⏳ Pending |
| `comp1-noi` | `TBD` | ✅ | ⏳ Pending |
| `comp1-noi-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp1-nra` | `SA1_1_NRA` | ✅ | ⏳ Pending |
| `comp1-occupancy` | `TBD` | ✅ | ⏳ Pending |
| `comp1-parking-type` | `TBD` | ✅ | ⏳ Pending |
| `comp1-photo` | `SA1_1_Photo` | ✅ | ⏳ Pending |
| `comp1-price-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp1-proj-amenities` | `TBD` | ✅ | ⏳ Pending |
| `comp1-property-type` | `TBD` | ✅ | ⏳ Pending |
| `comp1-remarks` | `TBD` | ✅ | ⏳ Pending |
| `comp1-renttype` | `TBD` | ✅ | ⏳ Pending |
| `comp1-rights-transferred` | `TBD` | ✅ | ⏳ Pending |
| `comp1-sale-date` | `TBD` | ✅ | ⏳ Pending |
| `comp1-sale-price` | `TBD` | ✅ | ⏳ Pending |
| `comp1-security-features` | `TBD` | ✅ | ⏳ Pending |
| `comp1-seller` | `TBD` | ✅ | ⏳ Pending |
| `comp1-structures` | `TBD` | ✅ | ⏳ Pending |
| `comp1-submarket` | `TBD` | ✅ | ⏳ Pending |
| `comp1-transaction-status` | `TBD` | ✅ | ⏳ Pending |
| `comp1-unit-amenities` | `TBD` | ✅ | ⏳ Pending |
| `comp1-unitmix-avgsize` | `TBD` | ✅ | ⏳ Pending |
| `comp1-unitmix-count` | `TBD` | ✅ | ⏳ Pending |
| `comp1-unitmix-type` | `TBD` | ✅ | ⏳ Pending |
| `comp1-units` | `TBD` | ✅ | ⏳ Pending |
| `comp1-utilities` | `TBD` | ✅ | ⏳ Pending |
| `comp1-year-built` | `TBD` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 50 (Sales Comparison - Methodology)
Sales comparison approach methodology and unit of comparison.

**Field Count:** 40

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `comp2-address` | `SA1_2_Address` | ✅ | ⏳ Pending |
| `comp2-analysis-price` | `TBD` | ✅ | ⏳ Pending |
| `comp2-buildings` | `TBD` | ✅ | ⏳ Pending |
| `comp2-buyer` | `TBD` | ✅ | ⏳ Pending |
| `comp2-cap-rate` | `TBD` | ✅ | ⏳ Pending |
| `comp2-city-state-zip` | `TBD` | ✅ | ⏳ Pending |
| `comp2-county` | `TBD` | ✅ | ⏳ Pending |
| `comp2-gba` | `SA1_2_GBA` | ✅ | ⏳ Pending |
| `comp2-landarea` | `TBD` | ✅ | ⏳ Pending |
| `comp2-laundry` | `TBD` | ✅ | ⏳ Pending |
| `comp2-map` | `TBD` | ✅ | ⏳ Pending |
| `comp2-market-conditions` | `TBD` | ✅ | ⏳ Pending |
| `comp2-name` | `TBD` | ✅ | ⏳ Pending |
| `comp2-noi` | `TBD` | ✅ | ⏳ Pending |
| `comp2-nra` | `SA1_2_NRA` | ✅ | ⏳ Pending |
| `comp2-occupancy` | `TBD` | ✅ | ⏳ Pending |
| `comp2-parking` | `TBD` | ✅ | ⏳ Pending |
| `comp2-parking-type` | `TBD` | ✅ | ⏳ Pending |
| `comp2-photo` | `SA1_2_Photo` | ✅ | ⏳ Pending |
| `comp2-price-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp2-property-type` | `TBD` | ✅ | ⏳ Pending |
| `comp2-remarks` | `TBD` | ✅ | ⏳ Pending |
| `comp2-renttype` | `TBD` | ✅ | ⏳ Pending |
| `comp2-rights-transferred` | `TBD` | ✅ | ⏳ Pending |
| `comp2-sale-date` | `TBD` | ✅ | ⏳ Pending |
| `comp2-sale-price` | `TBD` | ✅ | ⏳ Pending |
| `comp2-security-features` | `TBD` | ✅ | ⏳ Pending |
| `comp2-seller` | `TBD` | ✅ | ⏳ Pending |
| `comp2-submarket` | `TBD` | ✅ | ⏳ Pending |
| `comp2-transaction-status` | `TBD` | ✅ | ⏳ Pending |
| `comp2-unit-amenities` | `TBD` | ✅ | ⏳ Pending |
| `comp2-unitmix-avgsize` | `TBD` | ✅ | ⏳ Pending |
| `comp2-unitmix-count` | `TBD` | ✅ | ⏳ Pending |
| `comp2-unitmix-type` | `TBD` | ✅ | ⏳ Pending |
| `comp2-units` | `TBD` | ✅ | ⏳ Pending |
| `comp2-utilities` | `TBD` | ✅ | ⏳ Pending |
| `comp2-year-built` | `TBD` | ✅ | ⏳ Pending |
| `comp2-zoning` | `TBD` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 51 (Sales Comparison - Comparable Selection)
Comparable property selection criteria and analysis.

**Field Count:** 40

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `comp3-address` | `SA1_3_Address` | ✅ | ⏳ Pending |
| `comp3-analysis-price` | `TBD` | ✅ | ⏳ Pending |
| `comp3-buildings` | `TBD` | ✅ | ⏳ Pending |
| `comp3-buyer` | `TBD` | ✅ | ⏳ Pending |
| `comp3-cap-rate` | `TBD` | ✅ | ⏳ Pending |
| `comp3-city-state-zip` | `TBD` | ✅ | ⏳ Pending |
| `comp3-county` | `TBD` | ✅ | ⏳ Pending |
| `comp3-gba` | `SA1_3_GBA` | ✅ | ⏳ Pending |
| `comp3-landarea` | `TBD` | ✅ | ⏳ Pending |
| `comp3-laundry` | `TBD` | ✅ | ⏳ Pending |
| `comp3-map` | `TBD` | ✅ | ⏳ Pending |
| `comp3-market-conditions` | `TBD` | ✅ | ⏳ Pending |
| `comp3-name` | `TBD` | ✅ | ⏳ Pending |
| `comp3-noi` | `TBD` | ✅ | ⏳ Pending |
| `comp3-nra` | `SA1_3_NRA` | ✅ | ⏳ Pending |
| `comp3-occupancy` | `TBD` | ✅ | ⏳ Pending |
| `comp3-parking` | `TBD` | ✅ | ⏳ Pending |
| `comp3-parking-type` | `TBD` | ✅ | ⏳ Pending |
| `comp3-photo` | `SA1_3_Photo` | ✅ | ⏳ Pending |
| `comp3-price-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp3-property-type` | `TBD` | ✅ | ⏳ Pending |
| `comp3-remarks` | `TBD` | ✅ | ⏳ Pending |
| `comp3-renttype` | `TBD` | ✅ | ⏳ Pending |
| `comp3-rights-transferred` | `TBD` | ✅ | ⏳ Pending |
| `comp3-sale-date` | `TBD` | ✅ | ⏳ Pending |
| `comp3-sale-price` | `TBD` | ✅ | ⏳ Pending |
| `comp3-security-features` | `TBD` | ✅ | ⏳ Pending |
| `comp3-seller` | `TBD` | ✅ | ⏳ Pending |
| `comp3-submarket` | `TBD` | ✅ | ⏳ Pending |
| `comp3-transaction-status` | `TBD` | ✅ | ⏳ Pending |
| `comp3-unit-amenities` | `TBD` | ✅ | ⏳ Pending |
| `comp3-unitmix-avgsize` | `TBD` | ✅ | ⏳ Pending |
| `comp3-unitmix-count` | `TBD` | ✅ | ⏳ Pending |
| `comp3-unitmix-type` | `TBD` | ✅ | ⏳ Pending |
| `comp3-units` | `TBD` | ✅ | ⏳ Pending |
| `comp3-utilities` | `TBD` | ✅ | ⏳ Pending |
| `comp3-year-built` | `TBD` | ✅ | ⏳ Pending |
| `comp3-zoning` | `TBD` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 52 (Sales Comparison - Adjustment Analysis)
Adjustment factors and quantitative analysis.

**Field Count:** 40

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `comp4-address` | `SA1_4_Address` | ✅ | ⏳ Pending |
| `comp4-analysis-price` | `TBD` | ✅ | ⏳ Pending |
| `comp4-buildings` | `TBD` | ✅ | ⏳ Pending |
| `comp4-buyer` | `TBD` | ✅ | ⏳ Pending |
| `comp4-cap-rate` | `TBD` | ✅ | ⏳ Pending |
| `comp4-city-state-zip` | `TBD` | ✅ | ⏳ Pending |
| `comp4-county` | `TBD` | ✅ | ⏳ Pending |
| `comp4-gba` | `SA1_4_GBA` | ✅ | ⏳ Pending |
| `comp4-landarea` | `TBD` | ✅ | ⏳ Pending |
| `comp4-laundry` | `TBD` | ✅ | ⏳ Pending |
| `comp4-map` | `TBD` | ✅ | ⏳ Pending |
| `comp4-market-conditions` | `TBD` | ✅ | ⏳ Pending |
| `comp4-name` | `TBD` | ✅ | ⏳ Pending |
| `comp4-noi` | `TBD` | ✅ | ⏳ Pending |
| `comp4-nra` | `SA1_4_NRA` | ✅ | ⏳ Pending |
| `comp4-occupancy` | `TBD` | ✅ | ⏳ Pending |
| `comp4-parking` | `TBD` | ✅ | ⏳ Pending |
| `comp4-parking-type` | `TBD` | ✅ | ⏳ Pending |
| `comp4-photo` | `SA1_4_Photo` | ✅ | ⏳ Pending |
| `comp4-price-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp4-property-type` | `TBD` | ✅ | ⏳ Pending |
| `comp4-remarks` | `TBD` | ✅ | ⏳ Pending |
| `comp4-renttype` | `TBD` | ✅ | ⏳ Pending |
| `comp4-rights-transferred` | `TBD` | ✅ | ⏳ Pending |
| `comp4-sale-date` | `TBD` | ✅ | ⏳ Pending |
| `comp4-sale-price` | `TBD` | ✅ | ⏳ Pending |
| `comp4-security-features` | `TBD` | ✅ | ⏳ Pending |
| `comp4-seller` | `TBD` | ✅ | ⏳ Pending |
| `comp4-submarket` | `TBD` | ✅ | ⏳ Pending |
| `comp4-transaction-status` | `TBD` | ✅ | ⏳ Pending |
| `comp4-unit-amenities` | `TBD` | ✅ | ⏳ Pending |
| `comp4-unitmix-avgsize` | `TBD` | ✅ | ⏳ Pending |
| `comp4-unitmix-count` | `TBD` | ✅ | ⏳ Pending |
| `comp4-unitmix-type` | `TBD` | ✅ | ⏳ Pending |
| `comp4-units` | `TBD` | ✅ | ⏳ Pending |
| `comp4-utilities` | `TBD` | ✅ | ⏳ Pending |
| `comp4-year-built` | `TBD` | ✅ | ⏳ Pending |
| `comp4-zoning` | `TBD` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 53 (Sales Comparison - Sales Comp Summary)
Sales comparable properties summary and location map.

**Field Count:** 40

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `comp5-address` | `SA1_5_Address` | ✅ | ⏳ Pending |
| `comp5-analysis-price` | `TBD` | ✅ | ⏳ Pending |
| `comp5-buildings` | `TBD` | ✅ | ⏳ Pending |
| `comp5-buyer` | `TBD` | ✅ | ⏳ Pending |
| `comp5-cap-rate` | `TBD` | ✅ | ⏳ Pending |
| `comp5-city-state-zip` | `TBD` | ✅ | ⏳ Pending |
| `comp5-county` | `TBD` | ✅ | ⏳ Pending |
| `comp5-gba` | `SA1_5_GBA` | ✅ | ⏳ Pending |
| `comp5-landarea` | `TBD` | ✅ | ⏳ Pending |
| `comp5-laundry` | `TBD` | ✅ | ⏳ Pending |
| `comp5-map` | `TBD` | ✅ | ⏳ Pending |
| `comp5-market-conditions` | `TBD` | ✅ | ⏳ Pending |
| `comp5-name` | `TBD` | ✅ | ⏳ Pending |
| `comp5-noi` | `TBD` | ✅ | ⏳ Pending |
| `comp5-nra` | `SA1_5_NRA` | ✅ | ⏳ Pending |
| `comp5-occupancy` | `TBD` | ✅ | ⏳ Pending |
| `comp5-parking` | `TBD` | ✅ | ⏳ Pending |
| `comp5-parking-type` | `TBD` | ✅ | ⏳ Pending |
| `comp5-photo` | `SA1_5_Photo` | ✅ | ⏳ Pending |
| `comp5-price-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp5-property-type` | `TBD` | ✅ | ⏳ Pending |
| `comp5-remarks` | `TBD` | ✅ | ⏳ Pending |
| `comp5-renttype` | `TBD` | ✅ | ⏳ Pending |
| `comp5-rights-transferred` | `TBD` | ✅ | ⏳ Pending |
| `comp5-sale-date` | `TBD` | ✅ | ⏳ Pending |
| `comp5-sale-price` | `TBD` | ✅ | ⏳ Pending |
| `comp5-security-features` | `TBD` | ✅ | ⏳ Pending |
| `comp5-seller` | `TBD` | ✅ | ⏳ Pending |
| `comp5-submarket` | `TBD` | ✅ | ⏳ Pending |
| `comp5-transaction-status` | `TBD` | ✅ | ⏳ Pending |
| `comp5-unit-amenities` | `TBD` | ✅ | ⏳ Pending |
| `comp5-unitmix-avgsize` | `TBD` | ✅ | ⏳ Pending |
| `comp5-unitmix-count` | `TBD` | ✅ | ⏳ Pending |
| `comp5-unitmix-type` | `TBD` | ✅ | ⏳ Pending |
| `comp5-units` | `TBD` | ✅ | ⏳ Pending |
| `comp5-utilities` | `TBD` | ✅ | ⏳ Pending |
| `comp5-year-built` | `TBD` | ✅ | ⏳ Pending |
| `comp5-zoning` | `TBD` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 54 (Sales Comparison - Comp 1)
Sales Comparable Property 1 detailed analysis.

**Field Count:** 176

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `calc-noi-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `city` | `Subject_City` | ✅ | ⏳ Pending |
| `comp1-access` | `TBD` | ✅ | ⏳ Pending |
| `comp1-address` | `SA1_1_Address` | ✅ | ⏳ Pending |
| `comp1-adj-price-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp1-appeal` | `TBD` | ✅ | ⏳ Pending |
| `comp1-cap-rate` | `TBD` | ✅ | ⏳ Pending |
| `comp1-city` | `SA1_1_City` | ✅ | ⏳ Pending |
| `comp1-condition` | `TBD` | ✅ | ⏳ Pending |
| `comp1-expenditures-after` | `TBD` | ✅ | ⏳ Pending |
| `comp1-exposure` | `TBD` | ✅ | ⏳ Pending |
| `comp1-financing` | `TBD` | ✅ | ⏳ Pending |
| `comp1-gba` | `SA1_1_GBA` | ✅ | ⏳ Pending |
| `comp1-location` | `TBD` | ✅ | ⏳ Pending |
| `comp1-market-conditions` | `TBD` | ✅ | ⏳ Pending |
| `comp1-name` | `TBD` | ✅ | ⏳ Pending |
| `comp1-noi-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp1-occupancy` | `TBD` | ✅ | ⏳ Pending |
| `comp1-parking-type` | `TBD` | ✅ | ⏳ Pending |
| `comp1-postal-code` | `TBD` | ✅ | ⏳ Pending |
| `comp1-price-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp1-proj-amenities` | `TBD` | ✅ | ⏳ Pending |
| `comp1-property-rights` | `TBD` | ✅ | ⏳ Pending |
| `comp1-province` | `SA1_1_State` | ✅ | ⏳ Pending |
| `comp1-quality` | `TBD` | ✅ | ⏳ Pending |
| `comp1-sale-conditions` | `TBD` | ✅ | ⏳ Pending |
| `comp1-sale-price` | `TBD` | ✅ | ⏳ Pending |
| `comp1-sale-status` | `TBD` | ✅ | ⏳ Pending |
| `comp1-total-phys-adj` | `TBD` | ✅ | ⏳ Pending |
| `comp1-total-trans-adj` | `TBD` | ✅ | ⏳ Pending |
| `comp1-unit-amenities` | `TBD` | ✅ | ⏳ Pending |
| `comp1-units` | `TBD` | ✅ | ⏳ Pending |
| `comp1-year` | `TBD` | ✅ | ⏳ Pending |
| `comp2-access` | `TBD` | ✅ | ⏳ Pending |
| `comp2-address` | `SA1_2_Address` | ✅ | ⏳ Pending |
| `comp2-adj-price-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp2-appeal` | `TBD` | ✅ | ⏳ Pending |
| `comp2-cap-rate` | `TBD` | ✅ | ⏳ Pending |
| `comp2-city` | `SA1_2_City` | ✅ | ⏳ Pending |
| `comp2-condition` | `TBD` | ✅ | ⏳ Pending |
| `comp2-expenditures-after` | `TBD` | ✅ | ⏳ Pending |
| `comp2-exposure` | `TBD` | ✅ | ⏳ Pending |
| `comp2-financing` | `TBD` | ✅ | ⏳ Pending |
| `comp2-gba` | `SA1_2_GBA` | ✅ | ⏳ Pending |
| `comp2-location` | `TBD` | ✅ | ⏳ Pending |
| `comp2-market-conditions` | `TBD` | ✅ | ⏳ Pending |
| `comp2-name` | `TBD` | ✅ | ⏳ Pending |
| `comp2-noi-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp2-occupancy` | `TBD` | ✅ | ⏳ Pending |
| `comp2-parking-type` | `TBD` | ✅ | ⏳ Pending |
| `comp2-postal-code` | `TBD` | ✅ | ⏳ Pending |
| `comp2-price-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp2-proj-amenities` | `TBD` | ✅ | ⏳ Pending |
| `comp2-property-rights` | `TBD` | ✅ | ⏳ Pending |
| `comp2-province` | `SA1_2_State` | ✅ | ⏳ Pending |
| `comp2-quality` | `TBD` | ✅ | ⏳ Pending |
| `comp2-sale-conditions` | `TBD` | ✅ | ⏳ Pending |
| `comp2-sale-price` | `TBD` | ✅ | ⏳ Pending |
| `comp2-sale-status` | `TBD` | ✅ | ⏳ Pending |
| `comp2-total-phys-adj` | `TBD` | ✅ | ⏳ Pending |
| `comp2-total-trans-adj` | `TBD` | ✅ | ⏳ Pending |
| `comp2-unit-amenities` | `TBD` | ✅ | ⏳ Pending |
| `comp2-units` | `TBD` | ✅ | ⏳ Pending |
| `comp2-year` | `TBD` | ✅ | ⏳ Pending |
| `comp3-access` | `TBD` | ✅ | ⏳ Pending |
| `comp3-address` | `SA1_3_Address` | ✅ | ⏳ Pending |
| `comp3-adj-price-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp3-appeal` | `TBD` | ✅ | ⏳ Pending |
| `comp3-cap-rate` | `TBD` | ✅ | ⏳ Pending |
| `comp3-city` | `SA1_3_City` | ✅ | ⏳ Pending |
| `comp3-condition` | `TBD` | ✅ | ⏳ Pending |
| `comp3-expenditures-after` | `TBD` | ✅ | ⏳ Pending |
| `comp3-exposure` | `TBD` | ✅ | ⏳ Pending |
| `comp3-financing` | `TBD` | ✅ | ⏳ Pending |
| `comp3-gba` | `SA1_3_GBA` | ✅ | ⏳ Pending |
| `comp3-location` | `TBD` | ✅ | ⏳ Pending |
| `comp3-market-conditions` | `TBD` | ✅ | ⏳ Pending |
| `comp3-name` | `TBD` | ✅ | ⏳ Pending |
| `comp3-noi-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp3-occupancy` | `TBD` | ✅ | ⏳ Pending |
| `comp3-parking-type` | `TBD` | ✅ | ⏳ Pending |
| `comp3-postal-code` | `TBD` | ✅ | ⏳ Pending |
| `comp3-price-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp3-proj-amenities` | `TBD` | ✅ | ⏳ Pending |
| `comp3-property-rights` | `TBD` | ✅ | ⏳ Pending |
| `comp3-province` | `SA1_3_State` | ✅ | ⏳ Pending |
| `comp3-quality` | `TBD` | ✅ | ⏳ Pending |
| `comp3-sale-conditions` | `TBD` | ✅ | ⏳ Pending |
| `comp3-sale-price` | `TBD` | ✅ | ⏳ Pending |
| `comp3-sale-status` | `TBD` | ✅ | ⏳ Pending |
| `comp3-total-phys-adj` | `TBD` | ✅ | ⏳ Pending |
| `comp3-total-trans-adj` | `TBD` | ✅ | ⏳ Pending |
| `comp3-unit-amenities` | `TBD` | ✅ | ⏳ Pending |
| `comp3-units` | `TBD` | ✅ | ⏳ Pending |
| `comp3-year` | `TBD` | ✅ | ⏳ Pending |
| `comp4-access` | `TBD` | ✅ | ⏳ Pending |
| `comp4-address` | `SA1_4_Address` | ✅ | ⏳ Pending |
| `comp4-adj-price-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp4-appeal` | `TBD` | ✅ | ⏳ Pending |
| `comp4-cap-rate` | `TBD` | ✅ | ⏳ Pending |
| `comp4-city` | `SA1_4_City` | ✅ | ⏳ Pending |
| `comp4-condition` | `TBD` | ✅ | ⏳ Pending |
| `comp4-expenditures-after` | `TBD` | ✅ | ⏳ Pending |
| `comp4-exposure` | `TBD` | ✅ | ⏳ Pending |
| `comp4-financing` | `TBD` | ✅ | ⏳ Pending |
| `comp4-gba` | `SA1_4_GBA` | ✅ | ⏳ Pending |
| `comp4-location` | `TBD` | ✅ | ⏳ Pending |
| `comp4-market-conditions` | `TBD` | ✅ | ⏳ Pending |
| `comp4-name` | `TBD` | ✅ | ⏳ Pending |
| `comp4-noi-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp4-occupancy` | `TBD` | ✅ | ⏳ Pending |
| `comp4-parking-type` | `TBD` | ✅ | ⏳ Pending |
| `comp4-postal-code` | `TBD` | ✅ | ⏳ Pending |
| `comp4-price-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp4-proj-amenities` | `TBD` | ✅ | ⏳ Pending |
| `comp4-property-rights` | `TBD` | ✅ | ⏳ Pending |
| `comp4-province` | `SA1_4_State` | ✅ | ⏳ Pending |
| `comp4-quality` | `TBD` | ✅ | ⏳ Pending |
| `comp4-sale-conditions` | `TBD` | ✅ | ⏳ Pending |
| `comp4-sale-price` | `TBD` | ✅ | ⏳ Pending |
| `comp4-sale-status` | `TBD` | ✅ | ⏳ Pending |
| `comp4-total-phys-adj` | `TBD` | ✅ | ⏳ Pending |
| `comp4-total-trans-adj` | `TBD` | ✅ | ⏳ Pending |
| `comp4-unit-amenities` | `TBD` | ✅ | ⏳ Pending |
| `comp4-units` | `TBD` | ✅ | ⏳ Pending |
| `comp4-year` | `TBD` | ✅ | ⏳ Pending |
| `comp5-access` | `TBD` | ✅ | ⏳ Pending |
| `comp5-address` | `SA1_5_Address` | ✅ | ⏳ Pending |
| `comp5-adj-price-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp5-appeal` | `TBD` | ✅ | ⏳ Pending |
| `comp5-cap-rate` | `TBD` | ✅ | ⏳ Pending |
| `comp5-city` | `SA1_5_City` | ✅ | ⏳ Pending |
| `comp5-condition` | `TBD` | ✅ | ⏳ Pending |
| `comp5-expenditures-after` | `TBD` | ✅ | ⏳ Pending |
| `comp5-exposure` | `TBD` | ✅ | ⏳ Pending |
| `comp5-financing` | `TBD` | ✅ | ⏳ Pending |
| `comp5-gba` | `SA1_5_GBA` | ✅ | ⏳ Pending |
| `comp5-location` | `TBD` | ✅ | ⏳ Pending |
| `comp5-market-conditions` | `TBD` | ✅ | ⏳ Pending |
| `comp5-name` | `TBD` | ✅ | ⏳ Pending |
| `comp5-noi-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp5-occupancy` | `TBD` | ✅ | ⏳ Pending |
| `comp5-parking-type` | `TBD` | ✅ | ⏳ Pending |
| `comp5-postal-code` | `TBD` | ✅ | ⏳ Pending |
| `comp5-price-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp5-proj-amenities` | `TBD` | ✅ | ⏳ Pending |
| `comp5-property-rights` | `TBD` | ✅ | ⏳ Pending |
| `comp5-province` | `SA1_5_State` | ✅ | ⏳ Pending |
| `comp5-quality` | `TBD` | ✅ | ⏳ Pending |
| `comp5-sale-conditions` | `TBD` | ✅ | ⏳ Pending |
| `comp5-sale-price` | `TBD` | ✅ | ⏳ Pending |
| `comp5-sale-status` | `TBD` | ✅ | ⏳ Pending |
| `comp5-total-phys-adj` | `TBD` | ✅ | ⏳ Pending |
| `comp5-total-trans-adj` | `TBD` | ✅ | ⏳ Pending |
| `comp5-unit-amenities` | `TBD` | ✅ | ⏳ Pending |
| `comp5-units` | `TBD` | ✅ | ⏳ Pending |
| `comp5-year` | `TBD` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `occupancy-rate` | `Subject_Occupancy` | ✅ | ⏳ Pending |
| `postal-code` | `Subject_Zip` | ✅ | ⏳ Pending |
| `property-name` | `TBD` | ✅ | ⏳ Pending |
| `province` | `Subject_State` | ✅ | ⏳ Pending |
| `street-address` | `TBD` | ✅ | ⏳ Pending |
| `subject-access-rating` | `TBD` | ✅ | ⏳ Pending |
| `subject-appeal-rating` | `Subject_Appeal` | ✅ | ⏳ Pending |
| `subject-condition` | `Subject_Condition` | ✅ | ⏳ Pending |
| `subject-exposure-rating` | `TBD` | ✅ | ⏳ Pending |
| `subject-gba` | `Subject_GBA` | ✅ | ⏳ Pending |
| `subject-location-rating` | `TBD` | ✅ | ⏳ Pending |
| `subject-parking` | `Subject_Parking` | ✅ | ⏳ Pending |
| `subject-proj-amenities` | `Subject_AmenitiesProject` | ✅ | ⏳ Pending |
| `subject-quality-rating` | `Subject_Quality` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| `subject-unit-amenities` | `Subject_AmenitiesUnit` | ✅ | ⏳ Pending |
| `subject-units` | `Subject_Units` | ✅ | ⏳ Pending |
| `subject-year` | `TBD` | ✅ | ⏳ Pending |

---

## Page 55 (Sales Comparison - Comp 2)
Sales Comparable Property 2 detailed analysis.

**Field Count:** 5

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `sca-adjusted-value-high` | `TBD` | ❌ Missing | ⏳ Pending |
| `sca-adjusted-value-low` | `TBD` | ❌ Missing | ⏳ Pending |
| `sca-concluded-value-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 56 (Sales Comparison - Comp 3)
Sales Comparable Property 3 detailed analysis.

**Field Count:** 70

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `comp1-adj-price-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp1-gross-adj` | `TBD` | ✅ | ⏳ Pending |
| `comp1-net-adj` | `TBD` | ✅ | ⏳ Pending |
| `comp1-price-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp1-total-phys-adj` | `TBD` | ✅ | ⏳ Pending |
| `comp1-total-trans-adj` | `TBD` | ✅ | ⏳ Pending |
| `comp1-trans-adj-price` | `TBD` | ✅ | ⏳ Pending |
| `comp2-adj-price-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp2-gross-adj` | `TBD` | ✅ | ⏳ Pending |
| `comp2-net-adj` | `TBD` | ✅ | ⏳ Pending |
| `comp2-price-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp2-total-phys-adj` | `TBD` | ✅ | ⏳ Pending |
| `comp2-total-trans-adj` | `TBD` | ✅ | ⏳ Pending |
| `comp2-trans-adj-price` | `TBD` | ✅ | ⏳ Pending |
| `comp3-adj-price-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp3-gross-adj` | `TBD` | ✅ | ⏳ Pending |
| `comp3-net-adj` | `TBD` | ✅ | ⏳ Pending |
| `comp3-price-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp3-total-phys-adj` | `TBD` | ✅ | ⏳ Pending |
| `comp3-total-trans-adj` | `TBD` | ✅ | ⏳ Pending |
| `comp3-trans-adj-price` | `TBD` | ✅ | ⏳ Pending |
| `comp4-adj-price-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp4-gross-adj` | `TBD` | ✅ | ⏳ Pending |
| `comp4-net-adj` | `TBD` | ✅ | ⏳ Pending |
| `comp4-price-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp4-total-phys-adj` | `TBD` | ✅ | ⏳ Pending |
| `comp4-total-trans-adj` | `TBD` | ✅ | ⏳ Pending |
| `comp4-trans-adj-price` | `TBD` | ✅ | ⏳ Pending |
| `comp5-adj-price-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp5-gross-adj` | `TBD` | ✅ | ⏳ Pending |
| `comp5-net-adj` | `TBD` | ✅ | ⏳ Pending |
| `comp5-price-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `comp5-total-phys-adj` | `TBD` | ✅ | ⏳ Pending |
| `comp5-total-trans-adj` | `TBD` | ✅ | ⏳ Pending |
| `comp5-trans-adj-price` | `TBD` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `dca-avg-final-price` | `TBD` | ✅ | ⏳ Pending |
| `dca-avg-gross-adj` | `TBD` | ✅ | ⏳ Pending |
| `dca-avg-net-adj` | `TBD` | ✅ | ⏳ Pending |
| `dca-avg-phys-adj` | `TBD` | ✅ | ⏳ Pending |
| `dca-avg-price-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `dca-avg-trans-adj` | `TBD` | ✅ | ⏳ Pending |
| `dca-avg-trans-adj-price` | `TBD` | ✅ | ⏳ Pending |
| `dca-high-final-price` | `TBD` | ✅ | ⏳ Pending |
| `dca-high-gross-adj` | `TBD` | ✅ | ⏳ Pending |
| `dca-high-net-adj` | `TBD` | ✅ | ⏳ Pending |
| `dca-high-phys-adj` | `TBD` | ✅ | ⏳ Pending |
| `dca-high-price-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `dca-high-trans-adj` | `TBD` | ✅ | ⏳ Pending |
| `dca-high-trans-adj-price` | `TBD` | ✅ | ⏳ Pending |
| `dca-low-final-price` | `TBD` | ✅ | ⏳ Pending |
| `dca-low-gross-adj` | `TBD` | ✅ | ⏳ Pending |
| `dca-low-net-adj` | `TBD` | ✅ | ⏳ Pending |
| `dca-low-phys-adj` | `TBD` | ✅ | ⏳ Pending |
| `dca-low-price-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `dca-low-trans-adj` | `TBD` | ✅ | ⏳ Pending |
| `dca-low-trans-adj-price` | `TBD` | ✅ | ⏳ Pending |
| `dca-med-final-price` | `TBD` | ✅ | ⏳ Pending |
| `dca-med-gross-adj` | `TBD` | ✅ | ⏳ Pending |
| `dca-med-net-adj` | `TBD` | ✅ | ⏳ Pending |
| `dca-med-phys-adj` | `TBD` | ✅ | ⏳ Pending |
| `dca-med-price-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `dca-med-trans-adj` | `TBD` | ✅ | ⏳ Pending |
| `dca-med-trans-adj-price` | `TBD` | ✅ | ⏳ Pending |
| `sca-concluded-value-per-unit` | `TBD` | ✅ | ⏳ Pending |
| `sca-indicated-value` | `TBD` | ✅ | ⏳ Pending |
| `sca-indicated-value-rounded` | `TBD` | ✅ | ⏳ Pending |
| `sca-value-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| `subject-units` | `Subject_Units` | ✅ | ⏳ Pending |

---

## Page 57 (Sales Comparison - Comp 4)
Sales Comparable Property 4 detailed analysis.

**Field Count:** 2

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 58 (Sales Comparison - Comp 5)
Sales Comparable Property 5 detailed analysis.

**Field Count:** 14

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `calc-cap-rate` | `IA_DirCap_CapRate` | ✅ | ⏳ Pending |
| `calc-indicated-value` | `IA_IndicatedValue` | ✅ | ⏳ Pending |
| `calc-noi` | `IA_DirCap_NOI` | ✅ | ⏳ Pending |
| `calc-noi-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `calc-value-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `property-rights` | `TBD` | ✅ | ⏳ Pending |
| `recon-effective-date` | `TBD` | ✅ | ⏳ Pending |
| `recon-final-value` | `TBD` | ✅ | ⏳ Pending |
| `recon-final-value-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `sca-indicated-value` | `TBD` | ✅ | ⏳ Pending |
| `sca-value-per-sf` | `TBD` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| `value-scenario` | `TBD` | ✅ | ⏳ Pending |

---

## Page 59 (Sales Comparison - Adjustment Grid Detail)
Detailed adjustment grid and reconciliation.

**Field Count:** 2

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 60 (Sales Comparison - Reconciliation)
Sales comparison approach value reconciliation.

**Field Count:** 11

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `appraiser-aic` | `TBD` | ✅ | ⏳ Pending |
| `appraiser-email` | `TBD` | ✅ | ⏳ Pending |
| `appraiser-name-credentials` | `TBD` | ✅ | ⏳ Pending |
| `appraiser-title` | `TBD` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `effective-date` | `TBD` | ✅ | ⏳ Pending |
| `exposure-time` | `Subject_ExposureTime` | ✅ | ⏳ Pending |
| `final-value-conclusion` | `TBD` | ✅ | ⏳ Pending |
| `interest-appraised` | `TBD` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| `valuation-scenario` | `TBD` | ✅ | ⏳ Pending |

---

## Page 61 (Reconciliation of Value)
Final value reconciliation from all approaches.

**Field Count:** 2

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 62 (Reconciliation - Final Conclusion)
Final value conclusion and summary.

**Field Count:** 2

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 63 (Certification 1)
Appraiser certification and signatures.

**Field Count:** 2

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 64 (Certification 2)
Continued appraiser certification.

**Field Count:** 2

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 65 (Appendix - Contingent & Limiting Conditions)
Standard contingent and limiting conditions.

**Field Count:** 2

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 66 (Appendix - Limiting Conditions Cont.)
Continued limiting conditions.

**Field Count:** 2

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 67 (Appendix - Definition of Terms)
Appraisal terminology and definitions.

**Field Count:** 2

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---


**TOTAL: 1476 field occurrences across 71 pages**

---

## Validation Summary

### Column Legend
- **Field ID**: Our canonical field ID (used in template + registry)
- **Valcre ID**: Corresponding Valcre named range (`TBD` = mapping not yet documented)
- **Registry**: ✅ = exists in fieldRegistry.ts, ❌ = missing
- **Status**: Workflow status (Pending/Complete)

### Registry Validation Summary

**Template Fields:** 1,039 unique field IDs
**Registry Fields:** 1,652 field definitions
**Validation Date:** 2025-12-27

### Fields in Template NOT in Registry (8 total)

| Field ID | Pages Used | Action Needed |
|----------|------------|---------------|
| `appraiser1-email` | 4 | Add to registry |
| `appraiser1-name` | 4, 21 | Add to registry |
| `appraiser1-title` | 4 | Add to registry |
| `img-comparables-map` | 62 | Add to registry (image field) |
| `img-map-aerial` | 16 | Add to registry (image field) |
| `img-rental-comparables-map` | 39 | Add to registry (image field) |
| `sca-adjusted-value-high` | 62 | Add to registry (calc field) |
| `sca-adjusted-value-low` | 62 | Add to registry (calc field) |



### Valcre Mapping Summary

**Mapped to Valcre:** 158 fields have corresponding Valcre named range
**Valcre TBD: 1318 fields need Valcre ID mapping documented
**Note:** These 8 fields exist in template but need to be added to fieldRegistry.ts
