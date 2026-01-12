# APR Dashboard - Extraction & Sync Status

## Current Status: READY FOR PREVIEW TEST

**Sync Set Version:** 2.2.0  
**Last Updated:** 2025-12-23  
**Status:** ✅ Aligned and ready

---

## Field Coverage (RESOLVED)

| Metric | Count | Notes |
|--------|-------|-------|
| Registry user-input fields | 839 | All possible MF fields |
| Test data filled | 623 | What North Battleford needed |
| Empty/optional | 216 | Available but not used |
| **Coverage** | **74%** | ✅ Expected - not a problem |

### Why 216 Fields Are Empty (Expected)

| Category | ~Count | Reason |
|----------|--------|--------|
| S1/S2 intake fields | 35 | Populated from separate intake app |
| Extra unit types (type3-10) | 40 | Property only had 2 unit types |
| Extra image slots | 15 | Didn't use all 25 subject photos |
| Optional narratives | 50 | Not every section needs custom text |
| Extra comps (6-10) | 50+ | Only used 5 comps |
| Survey fields (6-10) | 25+ | Only used 5 rent comps |

**Conclusion:** 74% is correct. Empty fields = optional capacity, not missing data.

---

## Sync Set Files (v2.2.0)

| File | Status | Fields |
|------|--------|--------|
| fieldRegistry.ts | ✅ Synced | 1,687 definitions |
| northBattlefordTestData.ts | ✅ Synced | 1,778 values |
| Report-MF-template.html | ✅ Synced | ~1,000+ placeholders |
| IMAGE-FIELD-MAPPING.json | ✅ Synced | 48 image paths |

---

## Image Status

| Category | Mapped | Status |
|----------|--------|--------|
| Subject photos | 26 | ✅ |
| Sales comp photos | 5 | ✅ |
| Sales comp maps | 5 | ✅ |
| Location maps | 6 | ✅ |
| Site plans | 2 | ✅ |
| Branding | 2 | ✅ |
| **Total** | **48** | ✅ |

### Known Image Issues (Minor)
- `img-map-regional` → Currently points to wrong image (logo vs map)
- `rental-comp1-photo` / `rental-comp2-photo` → Point to site plans
- 41 registry image fields have no test data paths (optional)

---

## Next Steps

1. **NOW:** Test report rendering with "Preview in Builder"
2. **IF ISSUES:** Check field ID mismatches in template vs registry
3. **THEN:** Address image path corrections
4. **FUTURE:** Build calc engine for human-input-only workflow

---

## Test Data Files Available

| File | Purpose | Fields |
|------|---------|--------|
| northBattlefordTestData.ts | Full template test | 1,778 |
| HUMAN-INPUT-TEST-DATA.json | Calc engine test | 774 |

---

## Extraction Agent Notes (Claude Web)

I extracted data from:
- VAL251012_-_North_Battleford_Apt.docx (Word report)
- VAL251012_-_North_Battleford_Apt.xlsm (Valcre workbook)

My extraction files used Valcre-style naming. Your system uses kebab-case from fieldRegistry.ts. The test data team has already aligned the field IDs.

**My files for reference (not production):**
- TEST-DATA-COMPLETE-V2.json - Raw Valcre extraction
- IMAGE-MANIFEST.json - Original image mapping
- extracted-images.zip - All 89 images from Word doc

**Your production files:**
- fieldRegistry.ts - Source of truth
- northBattlefordTestData.ts - Aligned test data
- IMAGE-FIELD-MAPPING.json - Corrected image paths

---

*Ready for preview test. Come back if template rendering shows field mismatches.*
