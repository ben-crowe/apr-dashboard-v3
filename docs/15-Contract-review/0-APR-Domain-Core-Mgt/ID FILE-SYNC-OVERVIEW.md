# APR Dashboard V3 - File Sync System Overview

## Executive Summary

The APR Dashboard uses a **4-file sync system** where field IDs must match exactly across all files. Any mismatch = broken template rendering.

---

## The 4-File Sync Set

| File | Purpose | Field Count | Location |
|------|---------|-------------|----------|
| **fieldRegistry.ts** | Source of truth - field definitions | ~1,687 | `/lib/fieldRegistry.ts` |
| **northBattlefordTestData.ts** | Test values for all fields | ~1,791 | `/lib/northBattlefordTestData.ts` |
| **Report-MF-template.html** | HTML template with `{{field-id}}` placeholders | ~1,000+ | `/templates/` |
| **IMAGE-FIELD-MAPPING.json** | Maps image field IDs to file paths | ~55 | `/public/test-data/` |

---

## File #1: fieldRegistry.ts

### What It Is
The **master definition file** for every field in the system.

### Key Properties Per Field
```typescript
{
  id: 'comp1-sale-price',        // Field ID - MUST MATCH everywhere
  storeId: 'comp1-sale-price',   // Same as id (for React store)
  label: 'Sale Price',           // Human-readable name
  section: 'sales-comparison',   // Which tab/section in dashboard
  subsection: 'comp1',           // Subsection grouping
  type: 'currency',              // Data type
  inputSource: 'user-input',     // WHO PROVIDES THE DATA ← KEY!
  required: false
}
```

### inputSource Values (Critical!)
| Value | Meaning | Dashboard Behavior |
|-------|---------|-------------------|
| `user-input` | Human types this | Show input field |
| `calculated` | Calc engine computes | Hide from forms, show as read-only |
| `auto-filled` | System populates | Hide from forms |
| `api-fetch` | External API | Background fetch |
| `template` | Static template text | No input needed |

### Field Counts by inputSource
| inputSource | Count |
|-------------|-------|
| user-input | 1,252 |
| calculated | 332 |
| auto-filled | 94 |

---

## File #2: northBattlefordTestData.ts

### What It Is
**Sample data** for the North Battleford property - populates ALL template fields for testing.

### Structure
```typescript
export const northBattlefordTestData: Record<string, string | number | string[]> = {
  "comp1-sale-price": "$3,117,383",
  "comp1-address": "1551 107 St",
  "calc-noi": 111771.128,
  "subject-photo-1": "/extracted-images/image12.jpeg",
  // ... ~1,791 total fields
}
```

### Two Use Cases

**Test 1: Full Template Mapping**
- Load ALL ~1,791 fields
- Verifies every placeholder receives data
- Tests: Does the template render correctly?

**Test 2: Human Input → Calculation Flow**
- Load only `user-input` fields
- Run calc engine
- Verify `calculated` fields are computed
- Tests: Does the calc engine work?

---

## File #3: Report-MF-template.html

### What It Is
The **HTML template** with Handlebars-style placeholders that get replaced with data.

### Placeholder Format
```html
<td>{{comp1-sale-price}}</td>
<img src="{{comp1-photo}}" />
<span>{{calc-noi}}</span>
```

### Rule
Every `{{field-id}}` in the template MUST exist in:
1. fieldRegistry.ts (definition)
2. northBattlefordTestData.ts (test value)

---

## File #4: IMAGE-FIELD-MAPPING.json

### What It Is
Maps **image field IDs** to their **file paths** in the public folder.

### Structure
```json
{
  "comp1-photo": "/test-data/images/comparables/comp1-photo.jpg",
  "img-map-regional": "/test-data/images/maps/map-regional.png",
  "subject-photo-1": "/test-data/images/subject/subject-photo-1.jpeg"
}
```

### Image Field IDs (from Registry)
| Category | Field Pattern | Count |
|----------|---------------|-------|
| Subject photos | `subject-photo-1` through `subject-photo-24` | 24 |
| Exterior photos | `img-exterior-1` through `img-exterior-6` | 6 |
| Street views | `img-street-1` through `img-street-3` | 3 |
| Common areas | `img-common-1` through `img-common-4` | 4 |
| Unit interiors | `img-unit-1` through `img-unit-6` | 6 |
| Maps | `img-map-regional`, `img-map-local`, `img-map-aerial-1`, etc. | 7 |
| Site plans | `img-site-plan-1`, `img-site-plan-2` | 2 |
| Cover | `cover-photo`, `img-cover-photo` | 2 |
| Sales comps | `comp1-photo` through `comp5-photo` | 5 |
| Sales comp maps | `comp1-map` through `comp5-map` | 5 |
| Rental comps | `rental-comp1-photo`, `rental-comp2-photo` | 2 |
| Zoning | `img-zoning-map`, `zoning-map` | 2 |

---

## Naming Convention

### All Field IDs Use Kebab-Case
```
✅ comp1-sale-price
✅ img-map-regional
✅ calc-exp-taxes-annual

❌ comp1SalePrice (camelCase)
❌ comp1_sale_price (snake_case)
❌ Comp1SalePrice (PascalCase)
```

### Prefixes Indicate Category
| Prefix | Category |
|--------|----------|
| `comp1-` through `comp5-` | Sales comparables |
| `rentcomp1-` through `rentcomp5-` | Rent survey comps |
| `rental-comp1-` | Rental comp photos |
| `survey1-` through `survey5-` | Survey data |
| `calc-` | Calculated values |
| `img-` | Images (maps, photos) |
| `subject-` | Subject property |
| `property-` | Property attributes |
| `site-` | Site characteristics |
| `dircap-` | Direct capitalization |
| `intake-` | Client intake form |
| `loe-` | Letter of engagement |
| `recon-` | Reconciliation |

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INPUT (Dashboard)                   │
│  • Enters ~1,252 fields marked inputSource: 'user-input'    │
│  • Uploads images → paths stored in IMAGE-FIELD-MAPPING     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      CALC ENGINE                             │
│  • Reads user-input fields                                  │
│  • Computes ~332 calculated fields                          │
│  • Examples: calc-noi, calc-egr, expense ratios             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    TEMPLATE ENGINE                           │
│  • Combines: user-input + calculated + auto-filled          │
│  • Replaces {{field-id}} placeholders                       │
│  • Injects image paths from IMAGE-FIELD-MAPPING             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    RENDERED REPORT                           │
│  • 71-page professional appraisal document                  │
│  • All fields populated                                     │
│  • All images displayed                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Image Files Structure

### Source (Extracted from Valcre)
```
/extracted-images/
├── image1.png      → Company logo
├── image2.jpeg     → Cover photo
├── image12-35.jpeg → Subject photos (24)
├── image36-38.png  → Maps (regional, aerial, local)
├── image44-45.png  → Site plans
├── image48-49.png  → Zoning, flood maps
├── image57.png     → Rental comparables map
├── image72.png     → Sales comparables map
├── image73-82.*    → Comp photos and maps
└── image89.png     → Appraiser bio
```

### Organized (For Production)
```
/public/test-data/images/
├── branding/
│   ├── company-logo.png
│   └── cover-photo.jpeg
├── subject/
│   └── subject-photo-1.jpeg ... subject-photo-24.jpeg
├── maps/
│   ├── map-regional.png
│   ├── map-aerial.png
│   ├── map-local.png
│   ├── zoning-map.png
│   └── sales-comparables-map.png
├── comparables/
│   ├── comp1-photo.jpg ... comp5-photo.png
│   └── comp1-map.png ... comp5-map.png
└── site/
    ├── site-plan-1.png
    └── site-plan-2.png
```

---

## Common Errors & Fixes

### Error: Field shows `{{comp1-sale-price}}` instead of value
**Cause:** Field ID mismatch between template and test data
**Fix:** Check exact spelling in all 4 files

### Error: Image not displaying
**Cause:** Path in IMAGE-FIELD-MAPPING doesn't match actual file location
**Fix:** Verify file exists at specified path

### Error: Calculated field is empty
**Cause:** Calc engine not running, or input fields missing
**Fix:** Ensure user-input fields are populated first

### Error: Field shows `[field-id]` placeholder text
**Cause:** Test data has placeholder instead of real value
**Fix:** Update northBattlefordTestData.ts with actual value

---

## Validation Checklist

Before deploying changes:

- [ ] Field ID exists in fieldRegistry.ts
- [ ] Field ID exists in northBattlefordTestData.ts  
- [ ] Field ID exists in template (if displayed)
- [ ] Image field has path in IMAGE-FIELD-MAPPING.json
- [ ] Image file exists at specified path
- [ ] inputSource is correct (user-input vs calculated)
- [ ] kebab-case naming convention followed

---

## Files Created by Extraction Agent (Claude Web)

| File | Purpose | Status |
|------|---------|--------|
| TEST-DATA-COMPLETE-V2.json | Raw Valcre extraction | ⚠️ Wrong field IDs |
| IMAGE-FIELD-MAPPING.json | Image paths | ✅ Needs update to match registry |
| FIELD-CLASSIFICATION.md | Input vs calculated | ⚠️ Based on wrong IDs |
| extracted-images.zip | Source images | ✅ Good |
| organize-images.sh | Organize script | ✅ Good |

**Note:** Files I created used Valcre-style naming. Your system uses kebab-case. The **fieldRegistry.ts** is your source of truth - not my extraction files.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.2.0 | 2025-12-23 | Kebab-case standardization complete |
| 2.0.0 | 2025-12-22 | Tab reorganization, calc-output hidden |

---

*Last Updated: 2025-12-23*
*Source of Truth: fieldRegistry.ts v2.2.0*
