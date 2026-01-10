# CROSSWALK COMPLIANCE AUDIT
## Master Field Alignment Report

**Authority:** `valcre_template_crosswalk.json` + `template_to_valcre_mapping.json`  
**Date:** January 7, 2026  
**Scope:** HomeTabPanel.tsx, fieldRegistry.ts, Template v2.9.0

---

## SUMMARY

| Category | Count |
|----------|-------|
| Crosswalk canonical fields | 366 |
| HomeTabPanel total fields | 104 |
| Registry total fields | 1,910 |
| Template total fields | 1,230 |

---

## 🚨 PART 1: CROSSWALK FIELD MISMATCHES

These fields have data flow from Valcre. HomeTabPanel uses WRONG names.

### 1.1 Subject Property Fields (CRITICAL - Data Won't Flow)

| HomeTabPanel Uses | Should Be (Crosswalk) | Valcre Source | Status |
|-------------------|----------------------|---------------|--------|
| `property-address` | `subject-street` | Subject_Street | ❌ BROKEN |
| `property-name` | `subject-propertyname` | Subject_PropertyName | ❌ BROKEN |
| `total-units` | `subject-units` | Subject_Units | ❌ BROKEN |

**Fix:** Change HomeTabPanel to use crosswalk IDs.

### 1.2 Fields HomeTabPanel Has Correct (No Change Needed)

| Field | Crosswalk | Status |
|-------|-----------|--------|
| `city` | `city` | ✅ |
| `province` | `province` | ✅ |
| `postal-code` | `postal-code` | ✅ |
| `country` | `country` | ✅ |
| `latitude` | `latitude` | ✅ |
| `longitude` | `longitude` | ✅ |
| `legal-description` | `legal-description` | ✅ |
| `property-type` | `property-type` | ✅ |
| `property-subtype` | `property-subtype` | ✅ |
| `condition` | `condition` | ✅ |
| `adjacent-north` | `adjacent-north` | ✅ |
| `adjacent-south` | `adjacent-south` | ✅ |
| `adjacent-east` | `adjacent-east` | ✅ |
| `adjacent-west` | `adjacent-west` | ✅ |

---

## 🚨 PART 2: INTERNAL NAMING MISMATCHES

These are user-entered fields (not Valcre). Registry/Template are aligned, but HomeTabPanel drifted.

### 2.1 Appraiser Fields (Registry/Template = Correct, HomeTabPanel = Wrong)

| HomeTabPanel Uses | Registry/Template Has | Fix |
|-------------------|----------------------|-----|
| `appraiser1-all-units` | `appraiser1-allunits` | Remove hyphen |
| `appraiser2-all-units` | `appraiser2-allunits` | Remove hyphen |
| `inspection-date-1` | `appraiser1-inspectiondate` | Rename |
| `inspection-date-2` | `appraiser2-inspectiondate` | Rename |
| `inspection-extent` | `appraiser1-extent` | Rename |
| `inspection-extent-2` | `appraiser2-extent` | Rename |

### 2.2 Appraiser Fields Missing from Registry

These are in HomeTabPanel but need to be ADDED to Registry:

```
appraiser-license-expiry
appraiser-role
appraiser2-aic
appraiser2-credentials
appraiser2-email
appraiser2-license-expiry
appraiser2-phone
appraiser2-title
```

---

## 🚨 PART 3: REGISTRY DUPLICATES TO DELETE

Per crosswalk, these are duplicates that shouldn't exist:

| Delete | Keep | Reason |
|--------|------|--------|
| `subject-city` | `city` | Crosswalk: Subject_City → city |
| `subject-province` | `province` | Crosswalk: Subject_State → province |
| `subject-state` | `province` | Duplicate of province |
| `subject-zip` | `postal-code` | Crosswalk: Subject_Zip → postal-code |

---

## 🚨 PART 4: FIELDS IN HOMETABPANEL NOT IN REGISTRY

These need to be ADDED to Registry:

### Client/Contact Fields
```
client-attention
client-salutation
```

### Transaction History Fields
```
current-owner
owner-address
prior-owner
last-purchase-price
purchase-date
ownership-history
sales-history
deed-type
parcel-id
```

### Conditions Fields
```
extraordinary-assumption-1
extraordinary-assumption-2
extraordinary-assumption-3
hypothetical-condition-1
hypothetical-condition-2
hypothetical-condition-3
limiting-condition-1
limiting-condition-2
limiting-condition-3
```

### Other Fields
```
property-description-prefix
sale-lease-config
exposure-visibility
site-utility
```

---

## 📋 COMPLETE FIX CHECKLIST

### Phase 1: HomeTabPanel.tsx - Crosswalk Alignment (CRITICAL)

| Line | Current | Change To |
|------|---------|-----------|
| ~691 | `property-address` | `subject-street` |
| ~683 | `property-name` | `subject-propertyname` |
| ~440 | `total-units` | `subject-units` |
| ~1165 | `appraiser1-all-units` | `appraiser1-allunits` |
| ~1166 | `appraiser1-all-units` | `appraiser1-allunits` |
| ~1172 | `inspection-date-1` | `appraiser1-inspectiondate` |
| ~1176 | `inspection-extent` | `appraiser1-extent` |
| ~1230 | `appraiser2-all-units` | `appraiser2-allunits` |
| ~1231 | `appraiser2-all-units` | `appraiser2-allunits` |
| ~1237 | `inspection-date-2` | `appraiser2-inspectiondate` |
| ~1241 | `inspection-extent-2` | `appraiser2-extent` |

### Phase 2: fieldRegistry.ts - Delete Duplicates

Delete these entries:
- `subject-city` (keep `city`)
- `subject-province` (keep `province`)
- `subject-state` (keep `province`)
- `subject-zip` (keep `postal-code`)

### Phase 3: fieldRegistry.ts - Add Missing Fields

Add 35 fields from HomeTabPanel that don't exist in registry (see Part 4 above).

### Phase 4: Template Cleanup (I will handle this)

Template has duplicate fields that need to change to canonical IDs:

| Find | Replace With | Line(s) | Count |
|------|--------------|---------|-------|
| `{{subject-city}}` | `{{city}}` | 13022 | 1 |
| `{{subject-province}}` | `{{province}}` | 13073 | 1 |
| `{{subject-state}}` | `{{province}}` | 1038, 1361, 2563, 4875, 5009 | 5 |
| `{{subject-zip}}` | `{{postal-code}}` | 2569 | 1 |

**Total: 8 replacements in template**

---

## NAMING CONVENTION (For Future Reference)

### From Crosswalk - Valcre-Sourced Fields

| Valcre Pattern | Our Pattern | Example |
|----------------|-------------|---------|
| `Subject_*` | varies - check crosswalk | Subject_City → `city` |
| `Subject_Street` | `subject-street` | Has prefix |
| `Subject_Units` | `subject-units` | Has prefix |
| `Subject_NRA` | `subject-nra` | Has prefix |
| `IA_DirCap_*` | `dircap-*` or `calc-*` | calc-noi |
| `SA1_N_*` | `compN-*` | comp1-address |
| `SU1_N_*` | `rental-compN-*` | rental-comp1-address |

### Internal Fields - User-Entered

| Pattern | Example | Rule |
|---------|---------|------|
| Appraiser 1 | `appraiser1-allunits` | No hyphens in compound words |
| Appraiser 2 | `appraiser2-inspectiondate` | Same pattern |
| Client | `client-first-name` | Hyphenated |
| Company | `company-name` | Hyphenated |

---

## EXECUTION ORDER

1. ✅ Fix HomeTabPanel crosswalk fields (data flow critical) - COMPLETE
2. ✅ Fix HomeTabPanel appraiser naming - COMPLETE
3. ✅ Delete registry duplicates - N/A (duplicates didn't exist)
4. ✅ Add missing registry fields - COMPLETE (v2.9.0, +19 fields)
5. ✅ Verify template alignment - COMPLETE
   - reportPageTemplates.ts: commit 06ecb14
   - Report-MF-template.html: commit 972361f
6. ⏳ Test data flow end-to-end - PENDING

**ALL CROSSWALK ALIGNMENT COMPLETE - Ready for E2E testing**

---

*Audit generated by Claude | Authority: Valcre Crosswalk*
