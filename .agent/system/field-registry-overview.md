# Field Registry Overview

> **Read time:** 3 minutes
> **Purpose:** Understand how the 1,687 fields are managed

---

## The 4-File Sync Architecture

**Critical:** These 4 files MUST have matching field IDs:

| File | Purpose | Count |
|------|---------|-------|
| `fieldRegistry.ts` | Field definitions (SOURCE OF TRUTH) | ~1,687 |
| `TestDataSet1.ts` | Test values for all fields | ~2,270 |
| `Report-MF-template.html` | HTML with `{{field-id}}` placeholders | ~1,247 |
| `EditPanel.tsx` | Hardcoded layout arrays for editor UI | varies |

**Rule:** A field ID like `client-first-name` must be identical across all 4 files.

---

## Field Definition Structure

```typescript
{
  id: 'client-first-name',           // Canonical field ID
  storeId: 'client-first-name',      // ID used in store (same as id)
  label: 'Client First Name',         // Human-readable label
  section: 'client-intake',           // Parent section
  subsection: 'client-info-intake',   // Sub-grouping
  type: 'text',                       // Field type
  inputSource: 'user-input',          // How data enters
  required: true
}
```

---

## Field Types

| Type | Description |
|------|-------------|
| `text` | Single-line text input |
| `number` | Numeric input |
| `textarea` | Multi-line text |
| `date` | Date picker |
| `image` | Image URL |
| `currency` | Money values |
| `percentage` | Percent values |
| `dropdown` | Select from options |
| `multi-select` | Multiple selections |
| `boolean` | True/false toggle |
| `calculated` | Computed from other fields |

---

## Input Sources

| Type | Count | Description |
|------|-------|-------------|
| `user-input` | ~1,511 | User types in editor |
| `calculated` | ~402 | Calc engine computes |
| `auto-filled` | ~95 | System populates |
| `api-fetch` | ~8 | External API provides |

---

## Sections Overview

The registry organizes fields into ~30 sections:

| Section ID | Description |
|------------|-------------|
| `client-intake` | Client information from intake |
| `loe-prep` | Letter of Engagement data |
| `cover` | Report cover page |
| `exec` | Executive summary |
| `site` | Site analysis |
| `impv` | Improvements |
| `market` | Market analysis |
| `hbu` | Highest and best use |
| `income` | Income approach |
| `sales` | Sales comparison |
| `cost` | Cost approach |
| `recon` | Reconciliation |
| `image-mgt` | All images (160 fields, 55 images) |
| `calc-output` | Calculation results |

---

## Common Operations

### Finding a Field

```typescript
const field = fieldRegistry.find(f => f.id === 'client-first-name');
```

### Getting Fields by Section

```typescript
const sectionFields = fieldRegistry.filter(f => f.section === 'exec');
```

### Getting Fields by Input Source

```typescript
const calculatedFields = fieldRegistry.filter(f => f.inputSource === 'calculated');
```

---

## File Locations

| File | Path |
|------|------|
| Field Registry | `src/features/report-builder/schema/fieldRegistry.ts` |
| Test Data | `src/features/report-builder/data/TestDataSet1.ts` |
| HTML Template | `public/Report-MF-template.html` |
| Edit Panel | `src/features/report-builder/components/EditPanel/EditPanel.tsx` |

---

## Adding New Fields

See: `sops/adding-report-fields.md`

---

## Reference Documentation

For exhaustive field details:
- `docs/15-Contract-review/2-Field Management/Registry-field Info Guides/-MASTER-PAGE-FIELD-REFERENCE.md`
- `docs/15-Contract-review/0-APR-Domain-Core-Mgt/FIELD-NAMING-CONVENTION-CLEAN.md`

---

*This is a summary. The master knowledge file at `docs/bc research & notes/TDD-PAGE-ARCHITECTURE.md` has full details.*
