# Field Verification Command

**Purpose:** Verify field IDs exist before using them in templates, and cross-reference with Valcre named ranges.

---

## Quick Reference

### Master Registry (Source of Truth)
```
/Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/schema/fieldRegistry.ts
```
- **1,795 fields** defined
- Every field ID used in templates MUST exist here

### Valcre Ground Truth (9,652 named ranges)
```
/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/2-Field Management/valcre-named-ranges-complete.json
```
- Use to verify/find correct Valcre IDs
- Never trust mapping files without cross-referencing here

---

## Verification Workflows

### 1. Verify Our Field ID Exists

**Before using ANY field in a template, verify it exists:**

```bash
# Exact match
grep "'field-name'" src/features/report-builder/schema/fieldRegistry.ts

# Pattern search (if unsure of exact name)
grep -i "property.*name\|name.*property" src/features/report-builder/schema/fieldRegistry.ts
```

**Example:**
```bash
# Checking if 'subject-city' exists
grep "'subject-city'" src/features/report-builder/schema/fieldRegistry.ts

# Result shows the full field definition:
# { id: 'subject-city', storeId: 'subject-city', label: 'City', section: 'cover', ... }
```

### 2. Find Valcre ID for Our Field

**When you need the Valcre named range:**

```bash
# Search registry for valcreRange property
grep "'our-field-id'" src/features/report-builder/schema/fieldRegistry.ts | grep valcreRange
```

**Example:**
```bash
grep "'county'" src/features/report-builder/schema/fieldRegistry.ts
# Result: { id: 'county', ... valcreRange: 'Subject_County' }
```

### 3. Find Our Field from Valcre ID (Reverse Lookup)

**When you have a Valcre ID and need our field:**

```bash
grep "valcreRange.*'Valcre_ID'" src/features/report-builder/schema/fieldRegistry.ts
```

**Example:**
```bash
grep "valcreRange.*Subject_County" src/features/report-builder/schema/fieldRegistry.ts
# Result: { id: 'county', ... valcreRange: 'Subject_County' }
```

### 4. Verify Valcre ID Exists in Ground Truth

**MANDATORY before adding valcreRange to registry:**

```bash
grep '"Valcre_ID"' docs/15-Contract-review/2-Field\ Management/valcre-named-ranges-complete.json
```

**Example:**
```bash
# Verify Subject_County exists
grep '"Subject_County"' docs/15-Contract-review/2-Field\ Management/valcre-named-ranges-complete.json

# Result: "valcreId": "Subject_County",
```

### 5. Search Valcre by Pattern (When ID Unknown)

**When you don't know the exact Valcre naming:**

```bash
# Search by keyword
grep -i "caprate\|cap_rate" docs/15-Contract-review/2-Field\ Management/valcre-named-ranges-complete.json | head -10

# Common patterns:
# Subject_*     - Property info
# IA_*          - Income Approach
# SALE*_*       - Sales Comps
# RENT*_*       - Rental Comps
# Map_*         - Map images
# Client_*      - Client info
# Appraiser*_*  - Appraiser info
```

---

## Template Field Usage Rules

### BEFORE Adding Field to Template:

1. **Check registry first:**
   ```bash
   grep "'field-id'" src/features/report-builder/schema/fieldRegistry.ts
   ```

2. **If NOT found:**
   - Do NOT use in template
   - Either add to registry first, OR
   - Ask if field should exist

3. **If found:**
   - Use exact ID from registry (case-sensitive)
   - Template syntax: `{{field-id}}`

### Common Mistakes to Avoid:

| Wrong | Right | Why |
|-------|-------|-----|
| `{{property-address}}` | Check registry first | Might be `subject-address` |
| `{{clientName}}` | `{{client-name}}` | We use kebab-case |
| Assume field exists | `grep` to verify | Field might not be in registry |

---

## Decision Tree

```
Need to use field in template?
│
├─ Search: grep "'field-id'" fieldRegistry.ts
│
├─ FOUND?
│   ├─ YES → Use exact ID in template
│   │         Template: {{field-id}}
│   │
│   └─ NO → Should it exist?
│            ├─ YES → Add to registry FIRST
│            │         Then use in template
│            │
│            └─ NO → Don't use it
│
└─ Need Valcre mapping?
    ├─ Check: grep "valcreRange" on the field
    ├─ If missing, search ground truth JSON
    └─ VERIFY before adding valcreRange
```

---

## Batch Verification

**Verify multiple fields at once:**

```bash
# Check list of fields
for field in "subject-city" "client-name" "property-type"; do
  echo -n "$field: "
  grep -q "'$field'" src/features/report-builder/schema/fieldRegistry.ts && echo "EXISTS" || echo "MISSING"
done
```

**Find all fields in a template:**

```bash
# Extract field IDs from template (matches {{field-id}})
grep -o '{{[^}]*}}' template.html | sort -u
```

---

## Quick Commands Summary

| Task | Command |
|------|---------|
| Verify our field exists | `grep "'field-id'" src/features/report-builder/schema/fieldRegistry.ts` |
| Find Valcre ID for our field | `grep "'field-id'" fieldRegistry.ts \| grep valcreRange` |
| Reverse: Valcre → Our field | `grep "valcreRange.*Valcre_ID" fieldRegistry.ts` |
| Verify Valcre ID exists | `grep '"Valcre_ID"' valcre-named-ranges-complete.json` |
| Pattern search Valcre | `grep -i "keyword" valcre-named-ranges-complete.json` |
| Count registry fields | `grep -c "{ id:" fieldRegistry.ts` |

---

*Command Version: 1.0*
*Created: January 3, 2026*
*Domain: APR Dashboard v3 - Field Verification*
