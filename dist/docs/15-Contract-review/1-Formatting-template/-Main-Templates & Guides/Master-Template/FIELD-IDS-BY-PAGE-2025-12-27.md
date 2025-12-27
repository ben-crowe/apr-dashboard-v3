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
| `subject-photo-1` | `WORD-ONLY` | 4 | ✅ | Subject photo 1 |
| `subject-photo-2` | `WORD-ONLY` | 4 | ✅ | Subject photo 2 |
| `subject-photo-3` | `WORD-ONLY` | 4 | ✅ | Subject photo 3 |
| `subject-photo-4` | `WORD-ONLY` | 4 | ✅ | Subject photo 4 |
| `subject-photo-5` | `WORD-ONLY` | 4 | ✅ | Subject photo 5 |
| `subject-photo-6` | `WORD-ONLY` | 4 | ✅ | Subject photo 6 |
| `subject-photo-7` | `WORD-ONLY` | 5 | ✅ | Subject photo 7 |
| `subject-photo-8` | `WORD-ONLY` | 5 | ✅ | Subject photo 8 |
| `subject-photo-9` | `WORD-ONLY` | 5 | ✅ | Subject photo 9 |
| `subject-photo-10` | `WORD-ONLY` | 5 | ✅ | Subject photo 10 |
| `subject-photo-11` | `WORD-ONLY` | 5 | ✅ | Subject photo 11 |
| `subject-photo-12` | `WORD-ONLY` | 5 | ✅ | Subject photo 12 |
| `subject-photo-13` | `WORD-ONLY` | 6 | ✅ | Subject photo 13 |
| `subject-photo-14` | `WORD-ONLY` | 6 | ✅ | Subject photo 14 |
| `subject-photo-15` | `WORD-ONLY` | 6 | ✅ | Subject photo 15 |
| `subject-photo-16` | `WORD-ONLY` | 6 | ✅ | Subject photo 16 |
| `subject-photo-17` | `WORD-ONLY` | 6 | ✅ | Subject photo 17 |
| `subject-photo-18` | `WORD-ONLY` | 6 | ✅ | Subject photo 18 |
| `subject-photo-19` | `WORD-ONLY` | 7 | ✅ | Subject photo 19 |
| `subject-photo-20` | `WORD-ONLY` | 7 | ✅ | Subject photo 20 |
| `subject-photo-21` | `WORD-ONLY` | 7 | ✅ | Subject photo 21 |
| `subject-photo-22` | `WORD-ONLY` | 7 | ✅ | Subject photo 22 |
| `subject-photo-23` | `WORD-ONLY` | 7 | ✅ | Subject photo 23 |
| `subject-photo-24` | `WORD-ONLY` | 7 | ✅ | Subject photo 24 |
| `subject-photo-25` | `WORD-ONLY` | 8 | ✅ | Subject photo 25 |
| `img-map-regional` | `Map_Regional` | 9 | ✅ | Regional location map |
| `img-map-local` | `Map_Local` | 10 | ✅ | Local area map |
| `img-map-aerial` | `Map_Aerial` | 11 | ✅ | Aerial overview map |
| `img-site-plan-1` | `WORD-ONLY` | 21 | ✅ | Site plan 1 |
| `img-site-plan-2` | `WORD-ONLY` | 22 | ✅ | Site plan 2 |
| `img-zoning-map` | `WORD-ONLY` | 25 | ✅ | Zoning map |
| `img-rental-comparables-map` | `WORD-ONLY` | 34 | ✅ | Rental comparables location map |
| `img-comparables-map` | `WORD-ONLY` | 48 | ✅ | Sales comparables location map |

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
| `company-website` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
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
| `report-valuescenario1` | `Report_ValueScenario1` | ✅ | ⏳ Pending |
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
| `subject-density` | `Subject_Density` | ✅ | ⏳ Pending |
| `subject-economiclife` | `Subject_EconomicLife` | ✅ | ⏳ Pending |
| `subject-effectiveage` | `Subject_EffectiveAge` | ✅ | ⏳ Pending |
| `subject-gba` | `Subject_GBA` | ✅ | ⏳ Pending |
| `subject-geocode` | `Subject_Geocode` | ✅ | ⏳ Pending |
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
| `subject-siteaccess` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-siteexposure` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-sitequality` | `Subject_SiteQuality` | ✅ | ⏳ Pending |
| `subject-siteutility` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-state` | `Subject_State` | ✅ | ⏳ Pending |
| `subject-stories` | `Subject_Stories` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| `subject-submarket` | `Subject_Submarket` | ✅ | ⏳ Pending |
| `subject-subtype` | `Subject_Subtype` | ✅ | ⏳ Pending |
| `subject-tenancy` | `Subject_Tenancy` | ✅ | ⏳ Pending |
| `subject-topography` | `Subject_Topography` | ✅ | ⏳ Pending |
| `subject-totalacre` | `Subject_TotalAcre` | ✅ | ⏳ Pending |
| `subject-totalbuildings` | `Subject_Buildings` | ✅ | ⏳ Pending |
| `subject-totalsf` | `Subject_TotalSF` | ✅ | ⏳ Pending |
| `subject-units` | `Subject_Units` | ✅ | ⏳ Pending |
| `subject-usableacre` | `Subject_UsableAcre` | ✅ | ⏳ Pending |
| `subject-usablesf` | `Subject_UsableSF` | ✅ | ⏳ Pending |
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
| `ia-dircap-cap-rate1` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `ia-dircap-expenseratio` | `IA_DirCap_ExpenseRatio` | ✅ | ⏳ Pending |
| `ia-dircap-noi` | `IA_DirCap_NOI` | ✅ | ⏳ Pending |
| `ia-dircap-noi-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `occupancy-rate` | `Subject_Occupancy` | ✅ | ⏳ Pending |
| `report-effectivedate` | `Report_Date` | ✅ | ⏳ Pending |
| `report-interest` | `Report_Interest` | ✅ | ⏳ Pending |
| `report-valuationcost` | `Report_ValuationCost` | ✅ | ⏳ Pending |
| `report-valuationincome` | `Report_ValuationIncome` | ✅ | ⏳ Pending |
| `report-valuationsales` | `Report_ValuationSales` | ✅ | ⏳ Pending |
| `report-values` | `Report_Values` | ✅ | ⏳ Pending |
| `subject-concludedrent` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-currentrent` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-exposuretime` | `Report_ExposureTime` | ✅ | ⏳ Pending |
| `subject-hbuimproved` | `Report_HBUImpv` | ✅ | ⏳ Pending |
| `subject-hbuvacant` | `Report_HBUVacant` | ✅ | ⏳ Pending |
| `subject-marketing` | `Report_Marketing` | ✅ | ⏳ Pending |
| `subject-occupancystabilized` | `Subject_OccupancyStabilized` | ✅ | ⏳ Pending |
| `subject-occupied-units` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-proposedconstruction` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-sfmultifamily` | `Subject_UsableSFMulti` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| `subject-vacancycreditloss` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-vacant-units` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |

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
| `subject-photo-1` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-1-caption` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-2` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-2-caption` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-3` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-3-caption` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-4` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-4-caption` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-5` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-5-caption` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-6` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-6-caption` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 5 (Subject Photographs 2)
Subject property photos 7-12 with captions.

**Field Count:** 14

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-photo-10` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-10-caption` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-11` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-11-caption` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-12` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-12-caption` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-7` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-7-caption` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-8` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-8-caption` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-9` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-9-caption` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 6 (Subject Photographs 3)
Subject property photos 13-18 with captions.

**Field Count:** 14

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-photo-13` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-13-caption` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-14` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-14-caption` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-15` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-15-caption` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-16` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-16-caption` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-17` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-17-caption` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-18` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-18-caption` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 7 (Subject Photographs 4)
Subject property photos 19-24 with captions.

**Field Count:** 14

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-photo-19` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-19-caption` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-20` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-20-caption` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-21` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-21-caption` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-22` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-22-caption` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-23` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-23-caption` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-24` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-24-caption` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 8 (Subject Photographs 5)
Subject property photo 25 with caption.

**Field Count:** 4

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-photo-25` | `WORD-ONLY` | ✅ | ⏳ Pending |
| `subject-photo-25-caption` | `WORD-ONLY` | ✅ | ⏳ Pending |
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
| `report-valuescenario1` | `Report_ValueScenario1` | ✅ | ⏳ Pending |
| `subject-econcharacteristics` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
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
| `report-inspectiondate` | `Report_Inspection` | ✅ | ⏳ Pending |
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
| `subject-sitequality` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| `subject-topography` | `Subject_Topography` | ✅ | ⏳ Pending |
| `subject-totalacre` | `Subject_TotalAcre` | ✅ | ⏳ Pending |
| `subject-totalsf` | `Subject_TotalSF` | ✅ | ⏳ Pending |
| `subject-usableacres` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-usablesf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |

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
| `site-plan-1-title` | `WORD-ONLY` | ✅ | ⏳ Pending |
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
| `site-plan-2-title` | `WORD-ONLY` | ✅ | ⏳ Pending |
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
| `subject-tax-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-taxamount` | `L_PropertyParcelAssessmentTaxes` | ✅ | ⏳ Pending |
| `subject-taxassessment` | `L_PropertyParcelAssessmentTotalValue` | ✅ | ⏳ Pending |
| `subject-taxrate` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-taxyear` | `L_TaxYear` | ✅ | ⏳ Pending |

---

## Page 24 (Property Analysis - Zoning)
Land use and zoning regulations analysis.

**Field Count:** 12

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-conforminglot` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-conforminguse` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-legally-permitted` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-permitteduses` | `Subject_ZoningDef` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| `subject-subtype` | `Subject_Subtype` | ✅ | ⏳ Pending |
| `subject-zoning` | `Subject_Zoning` | ✅ | ⏳ Pending |
| `subject-zoningauthority` | `Subject_ZoningAuthority` | ✅ | ⏳ Pending |
| `subject-zoningchange` | `Subject_ZoningChange` | ✅ | ⏳ Pending |
| `subject-zoningchangestatus` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-zoningdescription` | `Subject_ZoningConclusion` | ✅ | ⏳ Pending |

---

## Page 25 (Property Analysis - Zoning Map)
Zoning map showing subject property zoning district.

**Field Count:** 4

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| `zoning-map-title` | `WORD-ONLY` | ✅ | ⏳ Pending |
| **Images:** | | | |
| `img-zoning-map` | `WORD-ONLY` | ✅ | ⏳ Pending |

---

## Page 26 (Property Analysis - Improvements)
Description of building improvements, construction, and condition.

**Field Count:** 10

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `sk-avgrent-1bed` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `sk-avgrent-2bed` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `sk-avgrent-3bed` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `sk-avgrent-bachelor` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `sk-new-supply` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `sk-rental-rate-growth` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `sk-supply-growth-rate` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `sk-vacancy-rate` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 27 (Property Analysis - Improvements Cont.)
Building amenities, parking, and mechanical systems.

**Field Count:** 5

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `hbu-conclusion-vacant` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `site-size` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| `zoning-designation` | `Subject_Zoning` | ✅ | ⏳ Pending |

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
| `rentroll-avg-actual-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-avg-actual-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-avg-asking-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-avg-asking-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-avg-occ-pct` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-avg-recent-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-avg-recent-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-avg-size` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-avg-vac-pct` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-total-occ` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-total-pct` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-total-units` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-total-vac` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-type1-actual-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-type1-actual-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-type1-desc` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-type1-name` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-type1-occ` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-type1-occ-pct` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-type1-pct` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-type1-recent-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-type1-size` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-type1-total` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-type1-vac` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-type1-vac-pct` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-type2-actual-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-type2-actual-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-type2-desc` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-type2-name` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-type2-occ` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-type2-occ-pct` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-type2-pct` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-type2-recent-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-type2-size` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-type2-total` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-type2-vac` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentroll-type2-vac-pct` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 33 (Valuation - Rent Roll Analysis)
Subject property rent roll with unit details and current rents.

**Field Count:** 132

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `rentcomp1-address` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp1-appeal` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp1-avg-unit-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp1-city` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp1-condition` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp1-laundry` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp1-location` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp1-name` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp1-parking-incl` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp1-parking-type` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp1-proj-amenities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp1-province` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp1-quality` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp1-rent-sf-avg` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp1-rent-unit-avg` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp1-renttype` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp1-security` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp1-surveycomments` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp1-totaladj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp1-unit-amenities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp1-units` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp1-utilities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp2-address` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp2-appeal` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp2-avg-unit-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp2-city` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp2-condition` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp2-laundry` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp2-location` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp2-name` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp2-parking-incl` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp2-parking-type` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp2-proj-amenities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp2-province` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp2-quality` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp2-rent-sf-avg` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp2-rent-unit-avg` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp2-renttype` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp2-security` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp2-surveycomments` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp2-totaladj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp2-unit-amenities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp2-units` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp2-utilities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp3-address` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp3-appeal` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp3-avg-unit-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp3-city` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp3-condition` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp3-laundry` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp3-location` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp3-name` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp3-parking-incl` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp3-parking-type` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp3-proj-amenities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp3-province` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp3-quality` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp3-rent-sf-avg` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp3-rent-unit-avg` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp3-renttype` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp3-security` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp3-surveycomments` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp3-totaladj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp3-unit-amenities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp3-units` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp3-utilities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp4-address` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp4-appeal` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp4-avg-unit-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp4-city` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp4-condition` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp4-laundry` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp4-location` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp4-name` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp4-parking-incl` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp4-parking-type` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp4-proj-amenities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp4-province` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp4-quality` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp4-rent-sf-avg` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp4-rent-unit-avg` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp4-renttype` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp4-security` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp4-surveycomments` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp4-totaladj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp4-unit-amenities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp4-units` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp4-utilities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp5-address` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp5-appeal` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp5-avg-unit-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp5-city` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp5-condition` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp5-laundry` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp5-location` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp5-name` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp5-parking-incl` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp5-parking-type` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp5-proj-amenities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp5-province` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp5-quality` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp5-rent-sf-avg` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp5-rent-unit-avg` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp5-renttype` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp5-security` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp5-surveycomments` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp5-totaladj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp5-unit-amenities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp5-units` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentcomp5-utilities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-appeal` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-avg-unit-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-city` | `Subject_City` | ✅ | ⏳ Pending |
| `subject-condition` | `Subject_Condition` | ✅ | ⏳ Pending |
| `subject-laundry` | `Subject_Laundry` | ✅ | ⏳ Pending |
| `subject-location` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-name` | `Subject_Name` | ✅ | ⏳ Pending |
| `subject-parking-incl` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-parking-type` | `Subject_ParkingType` | ✅ | ⏳ Pending |
| `subject-proj-amenities` | `Subject_AmenitiesProject` | ✅ | ⏳ Pending |
| `subject-province` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-quality` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-rent-sf-avg` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-rent-unit-avg` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-renttype` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-security` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| `subject-surveycomments` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-unit-amenities` | `Subject_AmenitiesUnit` | ✅ | ⏳ Pending |
| `subject-units` | `Subject_Units` | ✅ | ⏳ Pending |
| `subject-utilities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |

---

## Page 34 (Valuation - Rental Comparables Map)
Location map of rental comparable properties.

**Field Count:** 18

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `rental-comp1-address-full` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rental-comp1-distance` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rental-comp1-label` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rental-comp2-address-full` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rental-comp2-distance` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rental-comp2-label` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rental-comp3-address-full` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rental-comp3-distance` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rental-comp3-label` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rental-comp4-address-full` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rental-comp4-distance` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rental-comp4-label` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rental-comp5-address-full` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rental-comp5-distance` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rental-comp5-label` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| **Images:** | | | |
| `img-rental-comparables-map` | `WORD-ONLY` | ✅ | ⏳ Pending |

---

## Page 35 (Valuation - Approaches to Value)
Overview of valuation approaches used in the appraisal.

**Field Count:** 85

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `market-rent-1bed-avg-rentsf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-avg-rentsf-unadj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-avg-rentunit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-avg-unitsize` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp1-rentsf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp1-rentsf-unadj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp1-rentunit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp1-unitsize` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp2-rentsf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp2-rentsf-unadj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp2-rentunit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp2-unitsize` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp3-rentsf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp3-rentsf-unadj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp3-rentunit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp3-unitsize` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp4-rentsf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp4-rentsf-unadj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp4-rentunit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp4-unitsize` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp5-rentsf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp5-rentsf-unadj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp5-rentunit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-comp5-unitsize` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-high-rentsf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-high-rentsf-unadj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-high-rentunit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-high-unitsize` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-low-rentsf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-low-rentsf-unadj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-low-rentunit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-low-unitsize` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-med-rentsf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-med-rentsf-unadj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-med-rentunit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-med-unitsize` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed1bath-conclusionsf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed1bath-rentsf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed1bath-rentunit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed1bath-unitsize` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-avg-netadj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-avg-rentsf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-avg-rentsf-unadj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-avg-rentunit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-avg-unitsize` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp1-netadj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp1-rentsf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp1-rentsf-unadj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp1-rentunit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp1-unitsize` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp2-netadj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp2-rentsf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp2-rentsf-unadj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp2-rentunit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp2-unitsize` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp3-netadj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp3-rentsf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp3-rentsf-unadj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp3-rentunit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp3-unitsize` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp4-netadj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp4-rentsf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp4-rentsf-unadj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp4-rentunit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp4-unitsize` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp5-netadj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp5-rentsf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp5-rentsf-unadj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp5-rentunit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-comp5-unitsize` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-high-rentsf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-high-rentsf-unadj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-high-rentunit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-high-unitsize` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-low-netadj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-low-rentsf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-low-rentsf-unadj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-low-rentunit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-low-unitsize` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-med-rentsf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-med-rentsf-unadj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-med-rentunit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-2bed-med-unitsize` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
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
| `contract-vs-market-percentage` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `contractvsmarket-1bed-actualrent` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `contractvsmarket-1bed-askingrent` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `contractvsmarket-1bed-concludedrent` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `contractvsmarket-1bed-percentage` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `contractvsmarket-1bed-units` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `contractvsmarket-2bed-actualrent` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `contractvsmarket-2bed-askingrent` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `contractvsmarket-2bed-concludedrent` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `contractvsmarket-2bed-percentage` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `contractvsmarket-2bed-units` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `contractvsmarket-total-actualrent` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `contractvsmarket-total-askingrent` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `contractvsmarket-total-concludedrent` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `contractvsmarket-total-percentage` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `contractvsmarket-total-units` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-concluded` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-concluded-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-rangehigh` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-rangelow` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-sf-high` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-1bed-sf-low` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-comps-count` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `market-rent-comps-markets` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `otherrevenue-laundry-percent` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `otherrevenue-laundry-persf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `otherrevenue-laundry-perunit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `otherrevenue-laundry-total` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `otherrevenue-parking-percent` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `otherrevenue-parking-persf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `otherrevenue-parking-perunit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `otherrevenue-parking-total` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `otherrevenue-total-persf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `otherrevenue-total-perunit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `otherrevenue-total-total` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentalrevenue-1bed-contractrent` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentalrevenue-1bed-convvmkt` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentalrevenue-1bed-marketrent` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentalrevenue-1bed-persf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentalrevenue-1bed-perunit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentalrevenue-1bed-peryear` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentalrevenue-1bed-units` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentalrevenue-2bed-contractrent` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentalrevenue-2bed-convvmkt` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentalrevenue-2bed-marketrent` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentalrevenue-2bed-persf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentalrevenue-2bed-perunit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentalrevenue-2bed-peryear` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentalrevenue-2bed-units` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentalrevenue-total-contractrent` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentalrevenue-total-convvmkt` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentalrevenue-total-marketrent` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentalrevenue-total-persf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentalrevenue-total-perunit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `rentalrevenue-total-peryear` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-amenities-laundry` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-amenities-parking` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-amenities-utilities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
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
| `calc-egr-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-egr-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-occupancy-current` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| `vacancy-loss-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `vacancy-loss-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `vacancy-loss-year` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `vacancy-rate-concluded` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |

---

## Page 39 (Income Approach - Rent Comp Summary)
Detailed rental comparable analysis and adjustments.

**Field Count:** 99

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `calc-egr` | `IA_DirCap_EGI` | ✅ | ⏳ Pending |
| `calc-egr-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-insurance-annual` | `IA_Expense02` | ✅ | ⏳ Pending |
| `calc-exp-insurance-pct-pgr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-insurance-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-management-annual` | `IA_Expense03` | ✅ | ⏳ Pending |
| `calc-exp-management-pct-pgr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-management-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-other-annual` | `IA_Expense07` | ✅ | ⏳ Pending |
| `calc-exp-other-pct-pgr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-other-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-payroll-annual` | `IA_Expense06` | ✅ | ⏳ Pending |
| `calc-exp-payroll-pct-pgr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-payroll-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-repairs-annual` | `IA_Expense05` | ✅ | ⏳ Pending |
| `calc-exp-repairs-pct-pgr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-repairs-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-taxes-annual` | `IA_Expense01` | ✅ | ⏳ Pending |
| `calc-exp-taxes-pct-pgr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-taxes-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-utilities-annual` | `IA_Expense04` | ✅ | ⏳ Pending |
| `calc-exp-utilities-pct-pgr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-utilities-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-expense-ratio` | `IA_ExpenseRatio` | ✅ | ⏳ Pending |
| `calc-expenses-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-expenses-total` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-noi` | `IA_DirCap_NOI` | ✅ | ⏳ Pending |
| `calc-noi-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-other-income` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-other-income-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-pgr` | `IA_PGRev` | ✅ | ⏳ Pending |
| `calc-pgr-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-rental-revenue-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-total-rental-revenue` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-vacancy-loss` | `IA_VacancyDCF` | ✅ | ⏳ Pending |
| `calc-vacancy-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-vacancy-rate` | `IA_VacancyDCF` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `egr-proj-pct` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-egr-pct-pgr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-egr-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-egr-total` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-exp-insurance-pct-pgr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-exp-insurance-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-exp-insurance-total` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-exp-management-pct-pgr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-exp-management-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-exp-management-total` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-exp-other-pct-pgr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-exp-other-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-exp-other-total` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-exp-payroll-pct-pgr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-exp-payroll-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-exp-payroll-total` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-exp-repairs-pct-pgr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-exp-repairs-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-exp-repairs-total` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-exp-taxes-pct-pgr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-exp-taxes-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-exp-taxes-total` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-exp-total-pct-pgr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-exp-total-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-exp-total-total` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-exp-utilities-pct-pgr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-exp-utilities-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-exp-utilities-total` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-noi-pct-pgr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-noi-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-noi-total` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-pgr-pct-pgr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-pgr-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-pgr-total` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-revenue-laundry-pct-pgr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-revenue-laundry-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-revenue-laundry-total` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-revenue-misc-pct-pgr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-revenue-misc-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-revenue-misc-total` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-revenue-multifamily-pct-pgr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-revenue-multifamily-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-revenue-multifamily-total` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-revenue-parking-pct-pgr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-revenue-parking-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-revenue-parking-total` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-revenue-rental-pct-pgr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-revenue-rental-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-revenue-rental-total` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-vacancy-pct-pgr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-vacancy-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `hist-vacancy-total` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `noi-proj-pct` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `pgr-proj-pct` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `revenue-laundry-proj-pct` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `revenue-laundry-proj-total` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `revenue-misc-proj-pct` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `revenue-multifamily-proj-pct` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `revenue-parking-proj-pct` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `revenue-rental-proj-pct` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 40 (Income Approach - Rent Comp 1)
Rental Comparable Property 1 detailed analysis.

**Field Count:** 44

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `calc-exp-insurance-annual` | `IA_Expense02` | ✅ | ⏳ Pending |
| `calc-exp-insurance-pct-egr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-insurance-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-insurance-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-management-annual` | `IA_Expense03` | ✅ | ⏳ Pending |
| `calc-exp-management-pct-egr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-management-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-management-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-other-annual` | `IA_Expense07` | ✅ | ⏳ Pending |
| `calc-exp-other-pct-egr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-other-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-other-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-payroll-annual` | `IA_Expense06` | ✅ | ⏳ Pending |
| `calc-exp-payroll-pct-egr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-payroll-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-payroll-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-repairs-annual` | `IA_Expense05` | ✅ | ⏳ Pending |
| `calc-exp-repairs-pct-egr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-repairs-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-repairs-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-taxes-annual` | `IA_Expense01` | ✅ | ⏳ Pending |
| `calc-exp-taxes-pct-egr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-taxes-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-taxes-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-utilities-annual` | `IA_Expense04` | ✅ | ⏳ Pending |
| `calc-exp-utilities-pct-egr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-utilities-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-utilities-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-expense-ratio` | `IA_ExpenseRatio` | ✅ | ⏳ Pending |
| `calc-expenses-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-expenses-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-expenses-total` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-noi` | `IA_DirCap_NOI` | ✅ | ⏳ Pending |
| `calc-noi-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-noi-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `exp-insurance-comment` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `exp-management-comment` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `exp-other-comment` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `exp-payroll-comment` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `exp-repairs-comment` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `exp-taxes-comment` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `exp-utilities-comment` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 41 (Income Approach - Rent Comp 2-3)
Rental Comparable Properties 2-3 detailed analysis.

**Field Count:** 5

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `bond-yield-10yr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `cap-rate-implied-range` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `risk-premium-bp` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 42 (Income Approach - Rent Conclusion)
Rental rate conclusion and market rent determination.

**Field Count:** 70

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `cap-rate-average` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `cap-rate-high` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `cap-rate-low` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-address` | `SA1_1_Address` | ✅ | ⏳ Pending |
| `comp1-cap-rate` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-city` | `SA1_1_City` | ✅ | ⏳ Pending |
| `comp1-gba` | `SA1_1_GBA` | ✅ | ⏳ Pending |
| `comp1-name` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-noi` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-noi-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-price-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-province` | `SA1_1_State` | ✅ | ⏳ Pending |
| `comp1-sale-date` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-sale-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-units` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-year` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-address` | `SA1_2_Address` | ✅ | ⏳ Pending |
| `comp2-cap-rate` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-city` | `SA1_2_City` | ✅ | ⏳ Pending |
| `comp2-gba` | `SA1_2_GBA` | ✅ | ⏳ Pending |
| `comp2-name` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-noi` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-noi-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-price-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-province` | `SA1_2_State` | ✅ | ⏳ Pending |
| `comp2-sale-date` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-sale-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-units` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-year` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-address` | `SA1_3_Address` | ✅ | ⏳ Pending |
| `comp3-cap-rate` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-city` | `SA1_3_City` | ✅ | ⏳ Pending |
| `comp3-gba` | `SA1_3_GBA` | ✅ | ⏳ Pending |
| `comp3-name` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-noi` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-noi-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-price-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-province` | `SA1_3_State` | ✅ | ⏳ Pending |
| `comp3-sale-date` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-sale-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-units` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-year` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-address` | `SA1_4_Address` | ✅ | ⏳ Pending |
| `comp4-cap-rate` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-city` | `SA1_4_City` | ✅ | ⏳ Pending |
| `comp4-gba` | `SA1_4_GBA` | ✅ | ⏳ Pending |
| `comp4-name` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-noi` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-noi-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-price-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-province` | `SA1_4_State` | ✅ | ⏳ Pending |
| `comp4-sale-date` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-sale-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-units` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-year` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-address` | `SA1_5_Address` | ✅ | ⏳ Pending |
| `comp5-cap-rate` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-city` | `SA1_5_City` | ✅ | ⏳ Pending |
| `comp5-gba` | `SA1_5_GBA` | ✅ | ⏳ Pending |
| `comp5-name` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-noi` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-noi-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-price-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-province` | `SA1_5_State` | ✅ | ⏳ Pending |
| `comp5-sale-date` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-sale-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-units` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-year` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 43 (Income Approach - Income Analysis)
Potential gross income and effective gross income analysis.

**Field Count:** 9

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `calc-cap-rate` | `IA_DirCap_CapRate` | ✅ | ⏳ Pending |
| `cap-rate-average` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `cap-rate-high` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `cap-rate-low` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `cap-rate-range` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-cap-rate` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
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
| `calc-egr-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-egr-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-insurance-annual` | `IA_Expense02` | ✅ | ⏳ Pending |
| `calc-exp-insurance-pct-egr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-insurance-pct-pgr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-insurance-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-insurance-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-management-annual` | `IA_Expense03` | ✅ | ⏳ Pending |
| `calc-exp-management-pct-egr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-management-pct-pgr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-management-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-management-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-other-annual` | `IA_Expense07` | ✅ | ⏳ Pending |
| `calc-exp-other-pct-egr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-other-pct-pgr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-other-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-other-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-payroll-annual` | `IA_Expense06` | ✅ | ⏳ Pending |
| `calc-exp-payroll-pct-egr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-payroll-pct-pgr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-payroll-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-payroll-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-repairs-annual` | `IA_Expense05` | ✅ | ⏳ Pending |
| `calc-exp-repairs-pct-egr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-repairs-pct-pgr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-repairs-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-repairs-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-taxes-annual` | `IA_Expense01` | ✅ | ⏳ Pending |
| `calc-exp-taxes-pct-egr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-taxes-pct-pgr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-taxes-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-taxes-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-utilities-annual` | `IA_Expense04` | ✅ | ⏳ Pending |
| `calc-exp-utilities-pct-egr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-utilities-pct-pgr` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-utilities-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-exp-utilities-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-expense-ratio` | `IA_ExpenseRatio` | ✅ | ⏳ Pending |
| `calc-expenses-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-expenses-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-expenses-total` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-indicated-value` | `IA_IndicatedValue` | ✅ | ⏳ Pending |
| `calc-indicated-value-rounded` | `IA_IndicatedValueRounded` | ✅ | ⏳ Pending |
| `calc-noi` | `IA_DirCap_NOI` | ✅ | ⏳ Pending |
| `calc-noi-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-noi-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-other-income` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-other-income-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-other-income-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-pgr` | `IA_PGRev` | ✅ | ⏳ Pending |
| `calc-pgr-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-pgr-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-total-rental-revenue` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-type-total-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-type-total-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-type1-annual` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-type1-cont-v-market` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-type1-contract-rent` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-type1-count` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-type1-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-type1-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-type1-rent` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-type2-annual` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-type2-cont-v-market` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-type2-contract-rent` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-type2-count` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-type2-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-type2-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-type2-rent` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-vacancy-loss` | `IA_VacancyDCF` | ✅ | ⏳ Pending |
| `calc-vacancy-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-vacancy-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-vacancy-rate` | `IA_VacancyDCF` | ✅ | ⏳ Pending |
| `calc-value-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-value-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| `total-units` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |

---

## Page 45 (Income Approach - Cap Rate Analysis)
Capitalization rate analysis and market cap rate survey.

**Field Count:** 7

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `calc-cap-rate` | `IA_DirCap_CapRate` | ✅ | ⏳ Pending |
| `calc-indicated-value-rounded` | `IA_IndicatedValueRounded` | ✅ | ⏳ Pending |
| `calc-noi` | `IA_DirCap_NOI` | ✅ | ⏳ Pending |
| `calc-noi-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-value-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
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
| `comp1-address-full` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-distance` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-label` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-address-full` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-distance` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-label` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-address-full` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-distance` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-label` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-address-full` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-distance` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-label` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-address-full` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-distance` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-label` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| **Images:** | | | |
| `img-comparables-map` | `WORD-ONLY` | ✅ | ⏳ Pending |

---

## Page 49 (Sales Comparison - Adjustment Grid)
Sales comparison adjustment grid with comparable properties.

**Field Count:** 43

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `comp1-address` | `SA1_1_Address` | ✅ | ⏳ Pending |
| `comp1-analysis-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-analysis-price-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-buyer` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-cap-rate` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-city-state-zip` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-conditions-of-sale` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-corner` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-county` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-financing` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-gba` | `SA1_1_GBA` | ✅ | ⏳ Pending |
| `comp1-landarea` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-laundry` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-map` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-name` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-noi` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-noi-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-nra` | `SA1_1_NRA` | ✅ | ⏳ Pending |
| `comp1-occupancy` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-parking-type` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-photo` | `SA1_1_Photo` | ✅ | ⏳ Pending |
| `comp1-price-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-proj-amenities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-property-type` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-remarks` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-renttype` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-rights-transferred` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-sale-date` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-sale-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-security-features` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-seller` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-structures` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-submarket` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-transaction-status` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-unit-amenities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-unitmix-avgsize` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-unitmix-count` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-unitmix-type` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-units` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-utilities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-year-built` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 50 (Sales Comparison - Methodology)
Sales comparison approach methodology and unit of comparison.

**Field Count:** 40

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `comp2-address` | `SA1_2_Address` | ✅ | ⏳ Pending |
| `comp2-analysis-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-buildings` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-buyer` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-cap-rate` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-city-state-zip` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-county` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-gba` | `SA1_2_GBA` | ✅ | ⏳ Pending |
| `comp2-landarea` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-laundry` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-map` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-market-conditions` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-name` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-noi` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-nra` | `SA1_2_NRA` | ✅ | ⏳ Pending |
| `comp2-occupancy` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-parking` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-parking-type` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-photo` | `SA1_2_Photo` | ✅ | ⏳ Pending |
| `comp2-price-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-property-type` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-remarks` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-renttype` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-rights-transferred` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-sale-date` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-sale-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-security-features` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-seller` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-submarket` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-transaction-status` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-unit-amenities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-unitmix-avgsize` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-unitmix-count` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-unitmix-type` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-units` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-utilities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-year-built` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-zoning` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 51 (Sales Comparison - Comparable Selection)
Comparable property selection criteria and analysis.

**Field Count:** 40

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `comp3-address` | `SA1_3_Address` | ✅ | ⏳ Pending |
| `comp3-analysis-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-buildings` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-buyer` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-cap-rate` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-city-state-zip` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-county` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-gba` | `SA1_3_GBA` | ✅ | ⏳ Pending |
| `comp3-landarea` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-laundry` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-map` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-market-conditions` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-name` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-noi` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-nra` | `SA1_3_NRA` | ✅ | ⏳ Pending |
| `comp3-occupancy` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-parking` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-parking-type` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-photo` | `SA1_3_Photo` | ✅ | ⏳ Pending |
| `comp3-price-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-property-type` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-remarks` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-renttype` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-rights-transferred` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-sale-date` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-sale-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-security-features` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-seller` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-submarket` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-transaction-status` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-unit-amenities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-unitmix-avgsize` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-unitmix-count` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-unitmix-type` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-units` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-utilities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-year-built` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-zoning` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 52 (Sales Comparison - Adjustment Analysis)
Adjustment factors and quantitative analysis.

**Field Count:** 40

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `comp4-address` | `SA1_4_Address` | ✅ | ⏳ Pending |
| `comp4-analysis-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-buildings` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-buyer` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-cap-rate` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-city-state-zip` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-county` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-gba` | `SA1_4_GBA` | ✅ | ⏳ Pending |
| `comp4-landarea` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-laundry` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-map` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-market-conditions` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-name` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-noi` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-nra` | `SA1_4_NRA` | ✅ | ⏳ Pending |
| `comp4-occupancy` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-parking` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-parking-type` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-photo` | `SA1_4_Photo` | ✅ | ⏳ Pending |
| `comp4-price-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-property-type` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-remarks` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-renttype` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-rights-transferred` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-sale-date` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-sale-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-security-features` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-seller` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-submarket` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-transaction-status` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-unit-amenities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-unitmix-avgsize` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-unitmix-count` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-unitmix-type` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-units` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-utilities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-year-built` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-zoning` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 53 (Sales Comparison - Sales Comp Summary)
Sales comparable properties summary and location map.

**Field Count:** 40

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `comp5-address` | `SA1_5_Address` | ✅ | ⏳ Pending |
| `comp5-analysis-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-buildings` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-buyer` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-cap-rate` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-city-state-zip` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-county` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-gba` | `SA1_5_GBA` | ✅ | ⏳ Pending |
| `comp5-landarea` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-laundry` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-map` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-market-conditions` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-name` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-noi` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-nra` | `SA1_5_NRA` | ✅ | ⏳ Pending |
| `comp5-occupancy` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-parking` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-parking-type` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-photo` | `SA1_5_Photo` | ✅ | ⏳ Pending |
| `comp5-price-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-property-type` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-remarks` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-renttype` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-rights-transferred` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-sale-date` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-sale-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-security-features` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-seller` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-submarket` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-transaction-status` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-unit-amenities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-unitmix-avgsize` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-unitmix-count` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-unitmix-type` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-units` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-utilities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-year-built` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-zoning` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 54 (Sales Comparison - Comp 1)
Sales Comparable Property 1 detailed analysis.

**Field Count:** 176

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `calc-noi-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `city` | `Subject_City` | ✅ | ⏳ Pending |
| `comp1-access` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-address` | `SA1_1_Address` | ✅ | ⏳ Pending |
| `comp1-adj-price-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-appeal` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-cap-rate` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-city` | `SA1_1_City` | ✅ | ⏳ Pending |
| `comp1-condition` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-expenditures-after` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-exposure` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-financing` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-gba` | `SA1_1_GBA` | ✅ | ⏳ Pending |
| `comp1-location` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-market-conditions` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-name` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-noi-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-occupancy` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-parking-type` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-postal-code` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-price-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-proj-amenities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-property-rights` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-province` | `SA1_1_State` | ✅ | ⏳ Pending |
| `comp1-quality` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-sale-conditions` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-sale-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-sale-status` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-total-phys-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-total-trans-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-unit-amenities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-units` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-year` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-access` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-address` | `SA1_2_Address` | ✅ | ⏳ Pending |
| `comp2-adj-price-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-appeal` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-cap-rate` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-city` | `SA1_2_City` | ✅ | ⏳ Pending |
| `comp2-condition` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-expenditures-after` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-exposure` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-financing` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-gba` | `SA1_2_GBA` | ✅ | ⏳ Pending |
| `comp2-location` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-market-conditions` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-name` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-noi-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-occupancy` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-parking-type` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-postal-code` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-price-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-proj-amenities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-property-rights` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-province` | `SA1_2_State` | ✅ | ⏳ Pending |
| `comp2-quality` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-sale-conditions` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-sale-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-sale-status` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-total-phys-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-total-trans-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-unit-amenities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-units` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-year` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-access` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-address` | `SA1_3_Address` | ✅ | ⏳ Pending |
| `comp3-adj-price-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-appeal` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-cap-rate` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-city` | `SA1_3_City` | ✅ | ⏳ Pending |
| `comp3-condition` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-expenditures-after` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-exposure` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-financing` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-gba` | `SA1_3_GBA` | ✅ | ⏳ Pending |
| `comp3-location` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-market-conditions` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-name` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-noi-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-occupancy` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-parking-type` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-postal-code` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-price-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-proj-amenities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-property-rights` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-province` | `SA1_3_State` | ✅ | ⏳ Pending |
| `comp3-quality` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-sale-conditions` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-sale-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-sale-status` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-total-phys-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-total-trans-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-unit-amenities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-units` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-year` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-access` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-address` | `SA1_4_Address` | ✅ | ⏳ Pending |
| `comp4-adj-price-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-appeal` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-cap-rate` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-city` | `SA1_4_City` | ✅ | ⏳ Pending |
| `comp4-condition` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-expenditures-after` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-exposure` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-financing` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-gba` | `SA1_4_GBA` | ✅ | ⏳ Pending |
| `comp4-location` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-market-conditions` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-name` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-noi-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-occupancy` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-parking-type` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-postal-code` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-price-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-proj-amenities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-property-rights` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-province` | `SA1_4_State` | ✅ | ⏳ Pending |
| `comp4-quality` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-sale-conditions` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-sale-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-sale-status` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-total-phys-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-total-trans-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-unit-amenities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-units` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-year` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-access` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-address` | `SA1_5_Address` | ✅ | ⏳ Pending |
| `comp5-adj-price-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-appeal` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-cap-rate` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-city` | `SA1_5_City` | ✅ | ⏳ Pending |
| `comp5-condition` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-expenditures-after` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-exposure` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-financing` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-gba` | `SA1_5_GBA` | ✅ | ⏳ Pending |
| `comp5-location` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-market-conditions` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-name` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-noi-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-occupancy` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-parking-type` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-postal-code` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-price-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-proj-amenities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-property-rights` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-province` | `SA1_5_State` | ✅ | ⏳ Pending |
| `comp5-quality` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-sale-conditions` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-sale-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-sale-status` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-total-phys-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-total-trans-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-unit-amenities` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-units` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-year` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `occupancy-rate` | `Subject_Occupancy` | ✅ | ⏳ Pending |
| `postal-code` | `Subject_Zip` | ✅ | ⏳ Pending |
| `property-name` | `Subject_Name` | ✅ | ⏳ Pending |
| `province` | `Subject_State` | ✅ | ⏳ Pending |
| `street-address` | `Subject_Street` | ✅ | ⏳ Pending |
| `subject-access-rating` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-appeal-rating` | `Subject_Appeal` | ✅ | ⏳ Pending |
| `subject-condition` | `Subject_Condition` | ✅ | ⏳ Pending |
| `subject-exposure-rating` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-gba` | `Subject_GBA` | ✅ | ⏳ Pending |
| `subject-location-rating` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-parking` | `Subject_Parking` | ✅ | ⏳ Pending |
| `subject-proj-amenities` | `Subject_AmenitiesProject` | ✅ | ⏳ Pending |
| `subject-quality-rating` | `Subject_Quality` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| `subject-unit-amenities` | `Subject_AmenitiesUnit` | ✅ | ⏳ Pending |
| `subject-units` | `Subject_Units` | ✅ | ⏳ Pending |
| `subject-year` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |

---

## Page 55 (Sales Comparison - Comp 2)
Sales Comparable Property 2 detailed analysis.

**Field Count:** 5

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `sca-adjusted-value-high` | `DASHBOARD-ONLY` | ❌ Missing | ⏳ Pending |
| `sca-adjusted-value-low` | `DASHBOARD-ONLY` | ❌ Missing | ⏳ Pending |
| `sca-concluded-value-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |

---

## Page 56 (Sales Comparison - Comp 3)
Sales Comparable Property 3 detailed analysis.

**Field Count:** 70

| Field ID | Valcre ID | Registry | Status |
|----------|-----------|----------|--------|
| `comp1-adj-price-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-gross-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-net-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-price-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-total-phys-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-total-trans-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp1-trans-adj-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-adj-price-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-gross-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-net-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-price-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-total-phys-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-total-trans-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp2-trans-adj-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-adj-price-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-gross-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-net-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-price-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-total-phys-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-total-trans-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp3-trans-adj-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-adj-price-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-gross-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-net-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-price-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-total-phys-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-total-trans-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp4-trans-adj-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-adj-price-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-gross-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-net-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-price-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-total-phys-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-total-trans-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `comp5-trans-adj-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `dca-avg-final-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `dca-avg-gross-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `dca-avg-net-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `dca-avg-phys-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `dca-avg-price-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `dca-avg-trans-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `dca-avg-trans-adj-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `dca-high-final-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `dca-high-gross-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `dca-high-net-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `dca-high-phys-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `dca-high-price-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `dca-high-trans-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `dca-high-trans-adj-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `dca-low-final-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `dca-low-gross-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `dca-low-net-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `dca-low-phys-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `dca-low-price-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `dca-low-trans-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `dca-low-trans-adj-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `dca-med-final-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `dca-med-gross-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `dca-med-net-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `dca-med-phys-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `dca-med-price-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `dca-med-trans-adj` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `dca-med-trans-adj-price` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `sca-concluded-value-per-unit` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `sca-indicated-value` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `sca-indicated-value-rounded` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `sca-value-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
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
| `calc-noi-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `calc-value-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `property-rights` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `recon-effective-date` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `recon-final-value` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `recon-final-value-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `sca-indicated-value` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `sca-value-per-sf` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| `value-scenario` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |

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
| `appraiser-aic` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `appraiser-email` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `appraiser-name-credentials` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `appraiser-title` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `company-jobnumber` | `Company_JobNumber` | ✅ | ⏳ Pending |
| `effective-date` | `Report_Date` | ✅ | ⏳ Pending |
| `exposure-time` | `Subject_ExposureTime` | ✅ | ⏳ Pending |
| `final-value-conclusion` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `interest-appraised` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |
| `subject-street` | `Subject_Street` | ✅ | ⏳ Pending |
| `valuation-scenario` | `DASHBOARD-ONLY` | ✅ | ⏳ Pending |

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
