# Field Registry & Mapping Guide

**Purpose:** Reference for field registry structure, naming conventions, and 4-file sync requirements
**Last Updated:** 2026-01-07

---

## Search Keywords

`field-registry`, `fieldRegistry.ts`, `field-mapping`, `kebab-case`, `field-id`, `4-file-sync`, `inputSource`, `calculated`, `user-input`, `template-placeholders`, `field-validation`

---

## Field Registry Location

```
/src/features/report-builder/schema/fieldRegistry.ts
```

**Current Stats:**
- ~1,687 field definitions
- Source of truth for ALL field IDs
- Organized by section/subsection

---

## Field Structure

Each field in the registry has this shape:

```typescript
{
  id: 'client-first-name',           // Canonical field ID (kebab-case)
  storeId: 'client-first-name',      // ID in Zustand store (usually same as id)
  label: 'Client First Name',         // Human-readable label
  section: 'client-intake',           // Parent section
  subsection: 'client-info-intake',   // Sub-grouping
  type: 'text',                       // Field type
  inputSource: 'user-input',          // How data enters system
  required: true                      // Validation flag
}
```

---

## Field Naming Convention

### Format: kebab-case ONLY

```
CORRECT:
  comp1-sale-price
  calc-exp-taxes-annual
  img-map-regional

WRONG:
  comp1SalePrice      (camelCase)
  comp1_sale_price    (snake_case)
  Comp1-Sale-Price    (Title-Case)
```

### Common Prefixes

| Prefix | Category | Example |
|--------|----------|---------|
| `calc-` | Calculated outputs | `calc-noi`, `calc-egr` |
| `comp1-` to `comp6-` | Sales comparables | `comp1-sale-price` |
| `img-` | Images (S3-managed) | `img-map-regional` |
| `site-` | Site characteristics | `site-area-sqft` |
| `unit1-` to `unit4-` | Unit mix inputs | `unit1-rent` |
| `exp-` | Operating expenses | `exp-taxes` |
| `property-` | Property attributes | `property-name` |
| `subject-` | Subject property | `subject-photo` |

---

## Field Types

| Type | Use For | Example |
|------|---------|---------|
| `text` | Short text input | `client-first-name` |
| `textarea` | Multi-line text | `property-description` |
| `number` | Numeric values | `sale-price` |
| `date` | Date picker | `report-date` |
| `select` | Dropdown options | `property-type` |
| `image` | Image URL/path | `subject-photo` |
| `boolean` | Yes/No toggle | `is-corner-lot` |

---

## inputSource Types

| Type | Count | Description |
|------|-------|-------------|
| `user-input` | ~1,511 | User types in editor |
| `calculated` | ~402 | Calc engine computes |
| `auto-filled` | ~95 | System populates |
| `api-fetch` | ~8 | External API provides |

**Important:** Never manually set values for `calculated` fields - the calc engine handles them.

---

## 4-File Sync Requirement (CRITICAL)

When a field ID exists, it MUST match across ALL 4 files:

| File | What to Check |
|------|---------------|
| `fieldRegistry.ts` | Field definition exists |
| `TestDataSet1.ts` | Test value with matching key |
| `Report-MF-template.html` | `{{field-id}}` placeholder |
| `EditPanel.tsx` | Field in layout array (if editable) |

### Validation Commands

```bash
# Check if field exists in registry
grep "field-id-name" src/features/report-builder/schema/fieldRegistry.ts

# Check if field has test data
grep "field-id-name" src/features/report-builder/data/TestDataSet1.ts

# Check if field is in template
grep "{{field-id-name}}" public/Report-MF-template.html

# Count all placeholders in template
grep -o "{{[^}]*}}" public/Report-MF-template.html | wc -l
```

---

## Adding a New Field

### Step 1: Add to fieldRegistry.ts

```typescript
{
  id: 'new-field-name',
  storeId: 'new-field-name',
  label: 'New Field Name',
  section: 'appropriate-section',
  subsection: 'appropriate-subsection',
  type: 'text',
  inputSource: 'user-input',
  required: false
}
```

### Step 2: Add test value to TestDataSet1.ts

```typescript
'new-field-name': 'Sample Value',
```

### Step 3: Add placeholder to template

```html
<span class="field-mapped" data-field-id="{{new-field-name}}" title="{{new-field-name}}">{{new-field-name}}</span>
```

### Step 4: Add to EditPanel.tsx (if user-editable)

```typescript
{ fields: ['new-field-name'], widths: ['100%'] },
```

---

## Common Registry Errors

| Error | Cause | Fix |
|-------|-------|-----|
| Field not rendering | ID mismatch between registry and template | Verify exact spelling (kebab-case) |
| "undefined" in preview | Field exists in template but not registry | Add to fieldRegistry.ts |
| Test data not loading | Key mismatch in TestDataSet1.ts | Match key to registry ID exactly |
| Field not in editor | Missing from EditPanel.tsx layout | Add to appropriate layout array |
| Calc field showing input | Wrong inputSource | Set to `calculated`, not `user-input` |

---

## Template Placeholder Format

### Text Fields
```html
<span class="field-mapped" data-field-id="{{field-id}}" title="{{field-id}}">{{field-id}}</span>
```

### Image Fields
```html
<img class="field-mapped" src="{{img-field-id}}" data-field-id="{{img-field-id}}" title="{{img-field-id}}" />
```

### In Tables
```html
<td class="field-mapped" data-field-id="{{field-id}}" title="{{field-id}}">{{field-id}}</td>
```

---

## Field Mapping Files

| File | Purpose |
|------|---------|
| `master-field-mapping-consolidated.json` | Maps template fields to Valcre API |
| `workbookFieldMapping.ts` | Valcre field mapping definitions |
| `image-manifest.json` | Image field paths and metadata |

---

## Quick Lookup Commands

```bash
# List all sections in registry
grep "section:" src/features/report-builder/schema/fieldRegistry.ts | sort -u

# Count fields per inputSource
grep "inputSource:" src/features/report-builder/schema/fieldRegistry.ts | sort | uniq -c

# Find all image fields
grep "type: 'image'" src/features/report-builder/schema/fieldRegistry.ts

# Find all calculated fields
grep "inputSource: 'calculated'" src/features/report-builder/schema/fieldRegistry.ts | wc -l
```

---

## Related Files in This Folder

| File | Purpose |
|------|---------|
| `apr-system-context.md` | System overview, 4-stage architecture |
| `compact-styling-guide.md` | Fix page overflow issues |
| `field-toggle-system.md` | Dev Mode / User Ready toggle |
| `field-registry-guide.md` | THIS FILE - registry & mapping |
