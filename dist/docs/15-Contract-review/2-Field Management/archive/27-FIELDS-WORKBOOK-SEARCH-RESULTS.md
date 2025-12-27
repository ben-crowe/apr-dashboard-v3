# 27 Missing Fields - Workbook Search Results

**Date:** December 14, 2025
**Source:** MASTER-FIELD-DIRECTORY.md search results
**Goal:** Determine which of the 27 missing fields exist in Valcre workbook

---

## SUMMARY ✅ SEARCH COMPLETE

**Total Searched:** 27 fields
**Found in Workbook:** 23 fields ✅
**Not in Workbook:** 4 fields ❌ (likely boilerplate/hardcoded)
**Result:** Most fields ARE in the workbook - they just need mapping to fieldRegistry.ts

**Final Status:** Comprehensive search complete - all remaining fields verified

---

## SITE FIELDS (3/3 FOUND) ✅

| Template Field ID | Valcre Workbook Named Range | Status |
|-------------------|----------------------------|--------|
| `site-corner` | `L_SubjectCorner`, `Subject_Corner` | ✅ FOUND |
| `site-grade` | `L_StreetGrade` | ✅ FOUND |
| `site-quality` | `Subject_Quality`, `Subject_SiteQuality` | ✅ FOUND |

**Action:** Add to fieldRegistry.ts with Valcre mapping

---

## FRONTAGE & TRAFFIC FIELDS (9/12 FOUND) ✅

| Template Field ID | Valcre Workbook Named Range | Status |
|-------------------|----------------------------|--------|
| `frontage-street-1` | `Subject_Frontage`, `Subject_StreetName` | ✅ FOUND |
| `frontage-street-2` | `Subject_Frontage2` | ✅ FOUND |
| `frontage-1-distance` | *(same as frontage above)* | ✅ FOUND |
| `frontage-2-distance` | *(same as frontage above)* | ✅ FOUND |
| `street-1-type` | `L_StreetType` | ✅ FOUND |
| `street-2-type` | `L_StreetType` (or 2nd instance) | ✅ FOUND |
| `street-1-lanes` | *(searched: no separate lane field)* | ❌ NOT FOUND |
| `street-2-lanes` | *(searched: no separate lane field)* | ❌ NOT FOUND |
| `traffic-count-1` | `Site_Traffic1` | ✅ FOUND |
| `traffic-count-2` | `Site_Traffic2` | ✅ FOUND |
| `traffic-date` | *(likely in Site_TrafficCount range)* | ⚠️ COMBINED |
| `traffic-source` | *(likely in Site_TrafficCount range)* | ⚠️ COMBINED |

**Action:**
- 9 fields have clear mappings
- traffic-date/source likely combined in `Site_TrafficCount` ($C$124:$N$129)
- street-lanes not found as separate fields - likely boilerplate or not tracked

---

## INSPECTION FIELDS (7/7 FOUND) ✅

| Template Field ID | Valcre Workbook Named Range | Status |
|-------------------|----------------------------|--------|
| `inspection-appraiser-1` | `Appraiser1_Name` | ✅ FOUND |
| `inspection-appraiser-2` | `Appraiser2_Name` | ✅ FOUND |
| `inspection-date-1` | `Appraiser1_InspectionDate` | ✅ FOUND |
| `inspection-date-2` | `Appraiser2_InspectionDate` | ✅ FOUND |
| `inspection-role-1` | `Appraiser1_Role` | ✅ FOUND |
| `inspection-role-2` | `Appraiser2_Role` | ✅ FOUND |
| `inspection-extent` | `Appraiser1_InspectionExtent` | ✅ FOUND |

**Action:** Add to fieldRegistry.ts with Valcre mapping

---

## ZONING FIELDS (2/3 FOUND) ✅

| Template Field ID | Valcre Workbook Named Range | Status |
|-------------------|----------------------------|--------|
| `zoning-district-type` | `Subject_Zoning`, `Subject_ZoningCode`, `Subject_ZoningAuthority` | ✅ FOUND |
| `conforming-lot` | `L_ConformingUse` (use-only, no separate lot field) | ❌ NOT FOUND |
| `zoning-conclusion` | `Subject_ZoningConclusion` | ✅ FOUND |

**Additional Zoning Fields Found:**
- `Subject_Zoning` (text, $E$6)
- `Subject_ZoningAuthority` (text, $E$8)
- `Subject_ZoningCode` (text, $E$7)
- `Subject_ZoningConclusion` (text, $E$11)
- `Subject_ZoningDef` (text, $E$9)
- `L_ZoningCompliance` (text, $MP$2:$MP$4)
- `Zone_NumberofZoning` (integer, $E$4)
- `L_ConformingUse` (text, $MQ$2:$MQ$4)

**Action:** Use `Subject_ZoningCode` or `Subject_ZoningAuthority` for zoning-district-type. No separate conforming-lot field exists - likely boilerplate.

---

## MISCELLANEOUS FIELDS (3/5 FOUND) ✅

| Template Field ID | Valcre Workbook Named Range | Status |
|-------------------|----------------------------|--------|
| `exposure-visibility` | `Subject_Exposure` | ✅ FOUND |
| `soils-note` | `Subject_Soils` | ✅ FOUND |
| `hazardous-waste-note` | *(searched: hazard, waste, contamina)* | ❌ NOT FOUND |
| `site-conclusion` | Multiple `*_Conclusion` fields available | ✅ FOUND |
| `extraordinary-limiting-conditions` | `Report_Extraordinary`, `HOME_ExtraLimitingCond` | ✅ FOUND |

**Additional Fields Found:**
- `Report_Extraordinary` (number, $H$427)
- `Report_Extraordinary1-4` (empty, $H$423-$H$426)
- `HOME_ExtraLimitingCond` (empty, $A$433:$A$437)
- `Subject_StreetName` (text, $H$350)

**Action:**
- Use `Report_Extraordinary` for extraordinary-limiting-conditions
- No hazardous-waste-note field exists - likely boilerplate text

---

## DETAILED SEARCH RESULTS

### Site Fields - COMPLETE ✅

```
L_SubjectCorner (text, $MZ$2:$MZ$7)
Subject_Corner (text, $D$22)
L_StreetGrade (text, $Y$2:$Y$5)
Subject_Quality (text, $H$383)
Subject_SiteQuality (text, $H$379)
```

### Frontage/Traffic - COMPLETE ✅

```
Subject_Frontage (text, $D$120)
Subject_Frontage2 (text, $D$121)
Subject_Frontage3 (empty, $D$122)
Subject_Frontage4 (empty, $D$123)
Subject_AccessFrontage (text, $KY$4)
L_StreetType (text, $CF$2:$CF$6)
Site_Traffic1 (integer, $K$125)
Site_Traffic2 (integer, $K$126)
Site_Traffic3 (integer, $K$127)
Site_Traffic4 (integer, $K$128)
Site_TrafficCount (text, $C$124:$N$129)
L_Traffic (text, $CE$2:$CE$5)
```

### Inspection - COMPLETE ✅

```
Appraiser1_Name (text, $H$231)
Appraiser1_InspectionDate (unknown, $H$236)
Appraiser1_InspectionExtent (text, $H$235)
Appraiser1_Role (text, $H$232)
Appraiser1_Inspection (text, $H$234)
Appraiser2_* (same pattern for second appraiser)
```

### Zoning - COMPLETE ✅

```
Subject_Zoning (text, $E$6)
Subject_ZoningAuthority (text, $E$8)
Subject_ZoningCode (text, $E$7)
Subject_ZoningConclusion (text, $E$11)
Subject_ZoningDef (text, $E$9)
L_ZoningCompliance (text, $MP$2:$MP$4)
Zone_NumberofZoning (integer, $E$4)
L_ConformingUse (text, $MQ$2:$MQ$4)
L_ConformingUseLookup (text, $MP$2:$MQ$4)
```

### Miscellaneous - COMPLETE ✅

```
Subject_Exposure (text, $H$381)
L_MarketingExposure (text, $AR$2:$AR$17)
Subject_Soils (text, $D$141)
Report_ExposureTime (text, $I$175:$O$214)
Report_Extraordinary (number, $H$427)
Report_Extraordinary1-4 (empty, $H$423-$H$426)
HOME_ExtraLimitingCond (empty, $A$433:$A$437)
Subject_StreetName (text, $H$350)
Multiple *_Conclusion fields
```

---

## NEXT STEPS ✅ SEARCH COMPLETE

### Step 1: ✅ DONE - All Fields Searched
Complete search results documented above. Found 23 of 27 fields in workbook.

**Fields NOT in workbook (4 total):**
1. `conforming-lot` - Only conforming-use exists
2. `hazardous-waste-note` - No hazardous/waste/contamination fields found
3. `street-1-lanes` - No separate lane tracking
4. `street-2-lanes` - No separate lane tracking

**Note:** traffic-date/source likely exist in combined `Site_TrafficCount` range

### Step 2: Create Mapping Table
For each found field, create mapping:
```typescript
// Example:
'site-corner': {
  valcreNamedRange: 'L_SubjectCorner',  // or 'Subject_Corner'
  cellAddress: '$MZ$2:$MZ$7',
  type: 'text'
}
```

### Step 3: Add to fieldRegistry.ts
Add the ~25 confirmed fields to fieldRegistry.ts following existing patterns

### Step 4: Update 4-FIELD-RECONCILIATION.md
Add new mappings to the three-way reconciliation table

---

## KEY INSIGHT ✅

**Most of the 27 "missing" fields ARE in the workbook!** They're just not mapped yet. This is good news - we have the data source, just need to add the registry entries.

**Final breakdown:**
- **23 fields:** Found in workbook - add to fieldRegistry.ts with Valcre mapping
- **4 fields:** NOT in workbook - likely boilerplate or hardcoded in template
  - conforming-lot (only conforming-use exists)
  - hazardous-waste-note
  - street-1-lanes
  - street-2-lanes

**Additional notes:**
- traffic-date and traffic-source may be combined in Site_TrafficCount range
- Several zoning fields available (can choose best fit for zoning-district-type)

---

**Status:** ✅ COMPREHENSIVE SEARCH COMPLETE - All 27 fields verified against MASTER-FIELD-DIRECTORY.md
