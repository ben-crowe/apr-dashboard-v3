# Template Field ID Mismatch Analysis

**Date:** 2025-12-23  
**Issue:** HTML template uses different field IDs than registry/TDD page

---

## 🔴 CRITICAL FINDING: Field ID Mismatch

The HTML template (`Report-MF-template.html`) uses **OLD field IDs** that don't match the registry.

### Image Field Mismatches

| Template Uses | Registry Expects | Status |
|---------------|------------------|--------|
| `{{map-regional}}` | `img-map-regional` | ❌ **MISMATCH** |
| `{{map-aerial}}` | `img-map-aerial-1` or `img-map-aerial-2` | ❌ **MISMATCH** |
| `{{map-local}}` | `img-map-local` | ❌ **MISMATCH** |
| `{{comparablesmap}}` | `comparablesmap` | ✅ MATCH |
| `{{rental-comparables-map}}` | `rental-comparables-map` | ✅ MATCH |
| `{{subject-photo-1}}` | `subject-photo-1` | ✅ MATCH |
| `{{subject-photo-2}}` | `subject-photo-2` | ✅ MATCH |
| `{{comp1-photo}}` | `comp1-photo` | ✅ MATCH |
| `{{comp2-photo}}` | `comp2-photo` | ✅ MATCH |
| `{{img-zoning-map}}` | `img-zoning-map` | ✅ MATCH |

### Missing Fields in Template

The template doesn't seem to reference:
- `{{cover-photo}}` or `{{img-cover-photo}}`
- `{{company-logo}}`
- `{{img-signature}}`
- `{{img-common-1}}` through `{{img-common-4}}`
- `{{img-exterior-1}}` through `{{img-exterior-6}}`
- `{{img-street-1}}` through `{{img-street-3}}`
- `{{img-unit-1}}` through `{{img-unit-6}}`
- `{{img-systems-1}}` through `{{img-systems-4}}`

---

## Why Images Don't Load

**Root Cause:** Template uses old field IDs without `img-` prefix.

**Example:**
- Template has: `{{map-regional}}`
- Registry has: `img-map-regional`
- When `interpolateTemplate()` runs, it looks for `map-regional` in the fieldMap
- But the store has `img-map-regional`
- Result: `{{map-regional}}` stays as placeholder, image doesn't load

---

## Solution Options

### Option 1: Update Template (Recommended)
Update `Report-MF-template.html` to use registry field IDs:
- `{{map-regional}}` → `{{img-map-regional}}`
- `{{map-aerial}}` → `{{img-map-aerial-1}}` (or decide which one)
- `{{map-local}}` → `{{img-map-local}}`

**Pros:** Clean, matches registry exactly  
**Cons:** Need to update template file

### Option 2: Add Field Mapping
Add mappings in `testDataFieldMapping`:
```typescript
const testDataFieldMapping: Record<string, string> = {
  // ... existing mappings ...
  "map-regional": "img-map-regional",
  "map-aerial": "img-map-aerial-1",
  "map-local": "img-map-local",
};
```

**Pros:** No template changes needed  
**Cons:** Adds complexity, doesn't fix root cause

### Option 3: Dual Mapping in interpolateTemplate
Update `interpolateTemplate()` to check both old and new IDs:
```typescript
// Try new ID first, fallback to old ID
const value = fieldMap.get(fieldId) || 
              fieldMap.get(`img-${fieldId}`) || 
              match;
```

**Pros:** Backward compatible  
**Cons:** Hacky, maintains technical debt

---

## Field ID Comparison Summary

### ✅ Matching Fields
- `subject-photo-1` through `subject-photo-25` ✅
- `comp1-photo` through `comp5-photo` ✅
- `comp1-map` through `comp5-map` ✅
- `comparablesmap` ✅
- `rental-comparables-map` ✅
- `img-zoning-map` ✅

### ❌ Mismatched Fields
- `map-regional` → should be `img-map-regional`
- `map-aerial` → should be `img-map-aerial-1` or `img-map-aerial-2`
- `map-local` → should be `img-map-local`

### ❓ Missing in Template
- `cover-photo` / `img-cover-photo`
- `company-logo`
- `img-signature`
- All `img-common-*`, `img-exterior-*`, `img-street-*`, `img-unit-*`, `img-systems-*` fields

---

## Recommendations

1. **Update template** to use `img-` prefixed field IDs for maps
2. **Add missing image fields** to template (cover-photo, company-logo, etc.)
3. **Standardize on registry IDs** - template should match registry exactly
4. **Test after update** - verify all images load correctly

---

## Next Steps

1. Search template for all `{{map-*}}` references
2. Update to `{{img-map-*}}` format
3. Add missing image field placeholders
4. Test image loading in preview

