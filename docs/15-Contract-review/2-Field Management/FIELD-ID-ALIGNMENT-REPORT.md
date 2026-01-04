# Field ID Alignment Report

**Date:** January 4, 2026
**Purpose:** Cross-reference all field ID sources to ensure alignment with fieldRegistry (source of truth)
**Status:** Analysis Complete - Action Items Identified

---

## Architecture Reminder

**fieldRegistry.ts is the SINGLE SOURCE OF TRUTH**

All other systems MUST use registry IDs:
- Template placeholders: `{{registry-field-id}}`
- TestDataSet1.ts keys: `"registry-field-id": value`
- Crosswalk "Our Field ID": `registry-field-id`
- Editor Panel field references: `registry-field-id`

---

## Summary Statistics

| Source | Count | Status |
|--------|-------|--------|
| **fieldRegistry.ts** | 1,903 | Source of Truth |
| **TestDataSet1.ts** | 2,236 | Contains 756 IDs NOT in registry |
| **Crosswalk doc** | 263 | Contains 139 IDs NOT in registry |

### Alignment Issues

| Issue | Count | Priority |
|-------|-------|----------|
| TestData IDs missing from Registry | 756 | HIGH |
| Registry IDs missing from TestData | 423 | LOW (expected) |
| Crosswalk IDs missing from Registry | 139 | MEDIUM |
| IDs shared across all three | 85 | OK |

---

## Issue Analysis

### 1. TestDataSet1 IDs NOT in fieldRegistry (756 total)

These IDs exist in test data but are NOT defined in the registry.

**By Category:**

| Category | Count | Action Needed |
|----------|-------|---------------|
| Sales Comps (comp1-comp10) | 200 | Add to registry OR map to existing |
| Rental Comps (rental-comp*) | 94 | Add to registry OR map to existing |
| Calculated Fields (calc-*) | 8 | Add to calc-output section |
| Subject/Property/Site | 20 | Add to appropriate sections |
| Direct Cap (dircap-*) | ~50 | Add to income-approach section |
| OAR Comps (oarcomp*) | ~40 | Add to sales-approach section |
| Other (misc) | ~340 | Review and categorize |

**High Priority Missing Fields:**

```
# Core fields that templates likely use
access
apn
exposure
flood-zone
hbu-vacant
land-to-building
marketing-time
expense-ratio
inspection-date
current-owner-text

# Direct Cap fields
dircap-adj1
dircap-adj2
dircap-baddebt-pct
dircap-baddebt-total
dircap-cap-rate-blend
dircap-concession-pct
dircap-expenses-total
dircap-loss-pct
dircap-misc-perunit
dircap-reimb-perunit
dircap-rent-perunit
dircap-rent-psfmo
dircap-rent-psfyr
dircap-totalloss-pct
dircap-totalloss-total
dircap-unitmix
dircap-vacancy-pct
dircap-value1
dircap-value1-perunit
dircap-value1-psf

# Calculated fields variants
calc-egr-perunit
calc-egr-psf
calc-noi-perunit
calc-noi-psf
calc-pgi
calc-pgi-perunit
calc-pgi-psf
calc-total-expenses
```

### 2. Crosswalk IDs NOT in fieldRegistry (139 total)

These are documented in the Valcre-to-Template crosswalk but don't exist in registry.

**Sample Missing:**

```
# Core property/site fields
access
apn

# Calculated variants
calc-egr-perunit
calc-egr-psf
calc-noi-perunit
calc-noi-psf
calc-pgi
calc-pgi-perunit
calc-pgi-psf

# Comp fields
comp1-comments-prop
comp1-comments-sale
comp1-geocode
comp1-id
comp1-mapcomp
comp1-photourl
comp1-postal
comp1-priceperunit
(similar for comp2-comp5)

# Rental comp fields
rental-comp1-address
rental-comp1-city
rental-comp1-comments
rental-comp1-id
rental-comp1-photo
(similar for rental-comp2-comp5)
```

### 3. Registry IDs NOT in TestData (423 total)

These fields are defined in registry but have no test data. This is expected for:
- Optional fields
- Fields specific to other property types
- System/toggle fields
- Fields not applicable to North Battleford sample

**Sample (expected missing):**
```
appraiser-designation    # Uses appraiser-credentials in test data
appraiser-license        # Not used for this sample
accessibility            # Optional field
actual-age               # Calculated from year-built
```

---

## Root Cause Analysis

### Why the Misalignment Exists

1. **Multiple data sources** - TestDataSet1 was built from Valcre export, registry was built from template analysis
2. **Naming variations** - Same concept with different ID formats:
   - `calc-egr-perunit` vs `calc-egr-per-unit`
   - `comp1-postal` vs `comp1-postal-code`
   - `comp1-priceperunit` vs `comp1-price-per-unit`
3. **Evolution** - Fields added to test data that weren't added to registry
4. **Scope creep** - Test data includes fields not needed for template rendering

### ID Format Inconsistencies

| Pattern in TestData | Pattern in Registry | Fix |
|---------------------|---------------------|-----|
| `calc-egr-perunit` | `calc-egr-per-unit` | Standardize to registry |
| `comp1-postal` | `comp1-postal-code` | Standardize to registry |
| `comp1-priceperunit` | `comp1-price-per-unit` | Standardize to registry |
| `dircap-baddebt-pct` | (missing) | Add to registry |
| `access` | (missing) | Add as `site-access` or add `access` |
| `apn` | (missing) | Add to registry |

---

## Recommended Actions

### Phase 1: High Priority - Core Fields (Add to Registry)

Add these essential fields to fieldRegistry.ts:

```typescript
// Site/Property Core
{ id: 'access', storeId: 'access', label: 'Access', section: 'site', type: 'dropdown', options: ['Excellent', 'Good', 'Average', 'Fair', 'Poor'] },
{ id: 'apn', storeId: 'apn', label: 'APN/Parcel Number', section: 'site', type: 'text' },
{ id: 'exposure', storeId: 'exposure', label: 'Exposure', section: 'site', type: 'dropdown', options: ['Excellent', 'Good', 'Average', 'Fair', 'Poor'] },
{ id: 'flood-zone', storeId: 'flood-zone', label: 'Flood Zone', section: 'site', type: 'text' },
{ id: 'hbu-vacant', storeId: 'hbu-vacant', label: 'HBU As Vacant', section: 'hbu', type: 'textarea' },
{ id: 'land-to-building', storeId: 'land-to-building', label: 'Land to Building Ratio', section: 'site', type: 'text' },
{ id: 'marketing-time', storeId: 'marketing-time', label: 'Marketing Time', section: 'value', type: 'text' },
{ id: 'expense-ratio', storeId: 'expense-ratio', label: 'Expense Ratio', section: 'income', type: 'percentage' },
{ id: 'inspection-date', storeId: 'inspection-date', label: 'Inspection Date', section: 'cover', type: 'date' },
```

### Phase 2: Standardize TestData Keys

Update TestDataSet1.ts to use registry ID format:

```
calc-egr-perunit → calc-egr-per-unit
calc-noi-perunit → calc-noi-per-unit
calc-pgi-perunit → calc-pgi-per-unit
comp1-postal → comp1-postal-code
comp1-priceperunit → comp1-price-per-unit
```

### Phase 3: Add Comp Fields to Registry

Add missing sales comp fields (comp1-comp10):
- `compN-comments-prop`
- `compN-comments-sale`
- `compN-geocode`
- `compN-id`
- `compN-photourl`
- etc.

### Phase 4: Add Direct Cap Fields

Add missing dircap-* fields:
- `dircap-adj1`, `dircap-adj2`
- `dircap-baddebt-pct`, `dircap-baddebt-total`
- `dircap-cap-rate-blend`
- `dircap-concession-pct`
- etc.

---

## Validation Script

Use this to verify alignment after fixes:

```bash
# Count mismatches
grep -o '"[a-z0-9-]*":' TestDataSet1.ts | sed 's/"//g; s/://g' | sort -u > /tmp/td.txt
grep -o "id: '[a-z0-9-]*'" fieldRegistry.ts | sed "s/id: '//g; s/'//g" | sort -u > /tmp/reg.txt
comm -23 /tmp/td.txt /tmp/reg.txt | wc -l  # Should approach 0
```

---

## Notes

- Registry is source of truth - when in doubt, follow registry ID format
- TestData uses registry IDs - any mismatch means TestData needs updating
- Crosswalk documents the Valcre → Registry mapping
- Template placeholders use `{{registry-id}}` format

---

*Document generated: January 4, 2026*
