# Field Registry Guide: Master Reference

**Location**: Feature 08 - Field Input-Output Mapping
**Purpose**: Complete guide to field registry structure, search methods, and field management
**Last Updated**: 2026-01-12

---

## SEARCH KEYWORDS

`field-registry`, `fieldRegistry.ts`, `field-mapping`, `kebab-case`, `field-id`, `4-file-sync`, `inputSource`, `calculated`, `user-input`, `template-placeholders`, `field-validation`, `grep`, `search`, `verify`

---

## FIELD REGISTRY LOCATION

```
/src/features/report-builder/schema/fieldRegistry.ts
```

**Current Stats:**
- ~1,687 field definitions
- Source of truth for ALL field IDs
- Organized by section/subsection

---

## FIELD STRUCTURE

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

## FIELD NAMING CONVENTION

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
| `comp1-` to `comp5-` | Sales comparables | `comp1-sale-price` |
| `cost-` | Cost approach | `cost-land-value`, `cost-rcn-total` |
| `recon-` | Reconciliation | `recon-income-weight`, `recon-reconciled-value` |
| `sca-` | Sales Comparison Approach | `sca-indicated-value` |
| `img-` | Images (S3-managed) | `img-map-regional` |
| `site-` | Site characteristics | `site-area-sqft` |
| `property-` | Property attributes | `property-name` |
| `subject-` | Subject property | `subject-photo` |

---

## FIELD TYPES

| Type | Use For | Example |
|------|---------|---------|
| `text` | Short text input | `client-first-name` |
| `textarea` | Multi-line text | `property-description` |
| `number` | Numeric values | `sale-price` |
| `currency` | Money values | `calc-indicated-value` |
| `percentage` | Percentage values | `calc-cap-rate` |
| `date` | Date picker | `report-date` |
| `select` | Dropdown options | `property-type` |
| `image` | Image URL/path | `subject-photo` |
| `boolean` | Yes/No toggle | `is-corner-lot` |

---

## inputSource TYPES

| Type | Count | Description |
|------|-------|-------------|
| `user-input` | ~1,511 | User types in editor |
| `calculated` | ~402 | Calc engine computes |
| `auto-filled` | ~95 | System populates |
| `api-fetch` | ~8 | External API provides |

**Important:** Never manually set values for `calculated` fields - the calc engine handles them.

---

## 4-FILE SYNC REQUIREMENT (CRITICAL)

When a field ID exists, it MUST match across ALL 4 files:

| File | What to Check | Location |
|------|---------------|----------|
| `fieldRegistry.ts` | Field definition exists | `src/features/report-builder/schema/fieldRegistry.ts` |
| `TestDataSet1.ts` | Test value with matching key | `src/features/report-builder/data/TestDataSet1.ts` |
| `Report-MF-template.html` | `{{field-id}}` placeholder | `public/Report-MF-template.html` |
| UI Component | Field in component (if editable) | `src/features/report-builder/components/` |

---

## VALIDATION COMMANDS (How to Search Registry)

### Basic Field Verification

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

### Advanced Registry Searches

```bash
# List all sections in registry
grep "section:" src/features/report-builder/schema/fieldRegistry.ts | sort -u

# Count fields per inputSource
grep "inputSource:" src/features/report-builder/schema/fieldRegistry.ts | sort | uniq -c

# Find all image fields
grep "type: 'image'" src/features/report-builder/schema/fieldRegistry.ts

# Find all calculated fields
grep "inputSource: 'calculated'" src/features/report-builder/schema/fieldRegistry.ts

# Find all fields in a specific section
grep "section: 'calc'" src/features/report-builder/schema/fieldRegistry.ts

# Find all fields with a specific prefix
grep "id: 'calc-" src/features/report-builder/schema/fieldRegistry.ts

# Find all comp fields (comparables)
grep "id: 'comp[1-5]-" src/features/report-builder/schema/fieldRegistry.ts

# Find all cost approach fields
grep "id: 'cost-" src/features/report-builder/schema/fieldRegistry.ts

# Find all reconciliation fields
grep "id: 'recon-" src/features/report-builder/schema/fieldRegistry.ts
```

### Calculator-Specific Searches

```bash
# Find all Income Approach fields
grep "id: 'calc-" src/features/report-builder/schema/fieldRegistry.ts | grep -E "(type[1-4]|parking|laundry|vacancy|exp-|cap-rate|adj-)"

# Find all Sales Comparison fields
grep "id: 'comp[1-5]-" src/features/report-builder/schema/fieldRegistry.ts
grep "id: 'sca-" src/features/report-builder/schema/fieldRegistry.ts

# Find all Cost Approach fields
grep "id: 'cost-" src/features/report-builder/schema/fieldRegistry.ts

# Find all Reconciliation fields
grep "id: 'recon-" src/features/report-builder/schema/fieldRegistry.ts
```

---

## ADDING A NEW FIELD

### Step-by-Step Process

#### Step 1: Add to fieldRegistry.ts

```typescript
{
  id: 'new-field-name',              // kebab-case, descriptive
  storeId: 'new-field-name',         // Usually same as id
  label: 'New Field Name',            // Human-readable
  section: 'appropriate-section',    // e.g., 'calc', 'sales', 'cost'
  subsection: 'appropriate-subsection', // e.g., 'unit-mix', 'adjustments'
  type: 'text',                      // See Field Types table above
  inputSource: 'user-input',         // or 'calculated', 'auto-filled', 'api-fetch'
  required: false                     // true if mandatory
}
```

**Location**: Add to appropriate section in `src/features/report-builder/schema/fieldRegistry.ts`

#### Step 2: Add test value to TestDataSet1.ts

```typescript
'new-field-name': 'Sample Value',
```

**Location**: `src/features/report-builder/data/TestDataSet1.ts`

#### Step 3: Add placeholder to template

```html
<!-- Text fields -->
<span class="field-mapped" data-field-id="{{new-field-name}}" title="{{new-field-name}}">{{new-field-name}}</span>

<!-- In tables -->
<td class="field-mapped" data-field-id="{{new-field-name}}" title="{{new-field-name}}">{{new-field-name}}</td>

<!-- Image fields -->
<img class="field-mapped" src="{{img-field-id}}" data-field-id="{{img-field-id}}" title="{{img-field-id}}" />
```

**Location**: `public/Report-MF-template.html` (appropriate page)

#### Step 4: Add to UI Component (if user-editable)

**For Calculator Fields**:
- Income Approach: `src/features/report-builder/components/CalcInputPanel/CalcInputPanel.tsx`
- Sales Comparison: `src/features/report-builder/components/SalesTabPanel/SalesTabPanel.tsx`
- Cost Approach: `src/features/report-builder/components/CostTabPanel/CostTabPanel.tsx`
- Reconciliation: `src/features/report-builder/components/ReconTabPanel/ReconTabPanel.tsx`

**For Other Fields**:
- `src/features/report-builder/components/EditPanel/EditPanel.tsx`

#### Step 5: Document in Feature 08

- Add to appropriate INPUT → OUTPUT mapping doc (`03-06`)
- Update verification doc (`07-FIELD-ALIGNMENT-VERIFICATION.md`)
- Add example values

---

## COMMON REGISTRY ERRORS

| Error | Cause | Fix |
|-------|-------|-----|
| Field not rendering | ID mismatch between registry and template | Verify exact spelling (kebab-case) |
| "undefined" in preview | Field exists in template but not registry | Add to fieldRegistry.ts |
| Test data not loading | Key mismatch in TestDataSet1.ts | Match key to registry ID exactly |
| Field not in editor | Missing from UI component | Add to appropriate component |
| Calc field showing input | Wrong inputSource | Set to `calculated`, not `user-input` |
| Field not calculating | Missing from calculation function | Add to `*Calculations.ts` file |

---

## TEMPLATE PLACEHOLDER FORMATS

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

### Currency Fields
```html
<span class="field-mapped" data-field-id="{{calc-indicated-value}}" title="{{calc-indicated-value}}">${{calc-indicated-value}}</span>
```

---

## VERIFICATION WORKFLOW

### When Adding a New Field

1. **Verify Registry**:
   ```bash
   grep "new-field-name" src/features/report-builder/schema/fieldRegistry.ts
   ```

2. **Verify Test Data**:
   ```bash
   grep "new-field-name" src/features/report-builder/data/TestDataSet1.ts
   ```

3. **Verify Template**:
   ```bash
   grep "{{new-field-name}}" public/Report-MF-template.html
   ```

4. **Verify UI Component**:
   ```bash
   grep "new-field-name" src/features/report-builder/components/**/*.tsx
   ```

5. **Update Documentation**:
   - Add to appropriate `03-06` doc
   - Update `07-FIELD-ALIGNMENT-VERIFICATION.md`

### When Reviewing Existing Fields

1. **Find Field Location**:
   - Check `03-06` docs for approach mapping
   - Use grep commands above to find registry entry

2. **Verify 4-File Sync**:
   - Run all validation commands
   - Ensure all 4 files have matching field ID

3. **Check Dependencies**:
   - See `07-FIELD-ALIGNMENT-VERIFICATION.md` for cross-section dependencies
   - Verify calculation dependencies in `03-06` docs

---

## CALCULATOR FIELD SPECIFICS

### Income Approach Fields (`calc-*`)

**Prefix**: `calc-`
**Examples**: `calc-total-units`, `calc-indicated-value`, `calc-noi`
**Registry Section**: `calc`
**Documentation**: `01-INCOME-APPROACH-INPUT-OUTPUT-MAP.md`

**Search Command**:
```bash
grep "id: 'calc-" src/features/report-builder/schema/fieldRegistry.ts
```

### Sales Comparison Fields (`comp[1-5]-*`, `sca-*`)

**Prefixes**: `comp1-` through `comp5-`, `sca-`
**Examples**: `comp1-sale-price`, `comp1-adj-price-per-unit`, `sca-indicated-value`
**Registry Section**: `sales` or `calc`
**Documentation**: `02-SALES-COMPARISON-INPUT-OUTPUT-MAP.md`

**Search Command**:
```bash
grep -E "id: '(comp[1-5]-|sca-)" src/features/report-builder/schema/fieldRegistry.ts
```

### Cost Approach Fields (`cost-*`)

**Prefix**: `cost-`
**Examples**: `cost-land-value`, `cost-rcn-total`, `cost-indicated-value`
**Registry Section**: `cost`
**Documentation**: `03-COST-APPROACH-INPUT-OUTPUT-MAP.md`

**Search Command**:
```bash
grep "id: 'cost-" src/features/report-builder/schema/fieldRegistry.ts
```

### Reconciliation Fields (`recon-*`)

**Prefix**: `recon-`
**Examples**: `recon-income-weight`, `recon-reconciled-value`, `recon-final-value`
**Registry Section**: `reconciliation`
**Documentation**: `04-RECONCILIATION-INPUT-OUTPUT-MAP.md`

**Search Command**:
```bash
grep "id: 'recon-" src/features/report-builder/schema/fieldRegistry.ts
```

---

## FIELD COUNT VERIFICATION

### Calculator Fields (Verified in Phase 16)

| Approach | Input Fields | Output Fields | Total |
|----------|--------------|---------------|-------|
| Income | 29 | 29 | 58 |
| Sales Comparison | 77 | 38 | 115 |
| Cost | 17 | 14 | 31 |
| Reconciliation | 7 | 7 | 14 |
| **Total** | **130** | **88** | **218** |

**Verification**: See `07-FIELD-ALIGNMENT-VERIFICATION.md`

### Registry Totals

```bash
# Count total fields in registry
grep -c "id:" src/features/report-builder/schema/fieldRegistry.ts

# Count by inputSource
grep "inputSource:" src/features/report-builder/schema/fieldRegistry.ts | sort | uniq -c

# Count by type
grep "type:" src/features/report-builder/schema/fieldRegistry.ts | sort | uniq -c
```

---

## RELATED DOCUMENTATION

### In Feature 08
- `00-START-HERE.md` - Entry point
- `01-MASTER-FIELD-REFERENCE-INDEX.md` - Complete index
- `03-06-*-INPUT-OUTPUT-MAP.md` - Field mappings by approach
- `07-FIELD-ALIGNMENT-VERIFICATION.md` - Cross-verification
- `02-METHODOLOGY-AND-ORGANIZATION.md` - Phase 16 methodology

### In Feature 09
- `08-FIELD-REGISTRY-GUIDE.md` - Template-focused registry guide
- `templates/Template-Page-Field-Mapping.md` - Page-to-field reference

### In Codebase
- `src/features/report-builder/schema/fieldRegistry.ts` - Registry file
- `src/features/report-builder/store/*Calculations.ts` - Calculation functions
- `public/Report-MF-template.html` - Template file

---

## QUICK REFERENCE

### Most Common Tasks

**"Does field X exist?"**
```bash
grep "field-x" src/features/report-builder/schema/fieldRegistry.ts
```

**"Where is field X used?"**
```bash
grep -r "field-x" src/features/report-builder/
grep "{{field-x}}" public/Report-MF-template.html
```

**"What fields are in Income Approach?"**
→ See `01-INCOME-APPROACH-INPUT-OUTPUT-MAP.md`

**"How do I add a new calculator field?"**
→ Follow "Adding a New Field" section above + document in `03-06` docs

**"Which fields are calculated vs user-input?"**
→ See `07-FIELD-ALIGNMENT-VERIFICATION.md` or grep `inputSource: 'calculated'`

---

**Status**: ✅ Master Registry Reference Complete
**Go-to document for**: Registry structure, search methods, field management, adding new fields
