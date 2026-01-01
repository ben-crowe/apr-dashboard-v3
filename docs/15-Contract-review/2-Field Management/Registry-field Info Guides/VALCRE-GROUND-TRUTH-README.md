# Valcre Workbook Ground Truth Reference

**Purpose:** Authoritative source for all Valcre named ranges extracted directly from the actual .xlsm workbook. This is the GROUND TRUTH that validates all field mappings in the APR Dashboard.

---

## 📋 Contents

| File | Purpose | Last Updated |
|------|---------|--------------|
| `valcre-named-ranges-complete.json` | Complete extraction of all 9,652 named ranges from Valcre workbook | **2025-12-19** |

---

## ✅ Extraction Validation

**Source Workbook:** `VAL251012_-_North_Battleford_Apt.xlsm`
**Extraction Method:** Python `openpyxl` library (direct workbook parsing)
**Extraction Date:** December 19, 2025
**Total Named Ranges:** 9,652
**Total Sheets:** 88
**Extractor Agent:** Session 75 - Workbook Extraction Agent

### Verified Reference Values (From Actual Workbook)
- **PGR (Potential Gross Revenue):** $204,240
- **NOI (Net Operating Income):** $111,771
- **Indicated Value:** $1,800,000
- **Cap Rate:** 6.21%

These values are from the actual test data in the North Battleford workbook and can be used to validate calculations in the dashboard.

---

## 🔍 What This File Contains

The `valcre-named-ranges-complete.json` file contains every named range in the Valcre workbook with:

```json
{
  "source": "VAL251012_-_North_Battleford_Apt.xlsm",
  "totalRanges": 9652,
  "extractedAt": "2025-12-19",
  "ranges": [
    {
      "valcreId": "IA_DirCap_NOI",
      "sheet": "DIRECTCAP",
      "cell": "$L$253"
    },
    ...
  ]
}
```

### Field Structure
- **valcreId**: Valcre's internal named range (e.g., `IA_DirCap_NOI`)
- **sheet**: Excel sheet name (e.g., `DIRECTCAP`, `DATA`, `REGIONAL`)
- **cell**: Exact cell address (e.g., `$L$253`)

---

## 🎯 How To Use This File

### For Registry Agent (Field Additions)

**Before adding any field to `fieldRegistry.ts`, verify it exists:**

```bash
# Search for Valcre named range
grep '"IA_DirCap_NOI"' docs/15-Contract-review/2-Field\ Management/valcre-named-ranges-complete.json

# Expected output if field exists:
# "valcreId": "IA_DirCap_NOI",

# Get full details (sheet + cell)
grep -A2 '"IA_DirCap_NOI"' docs/15-Contract-review/2-Field\ Management/valcre-named-ranges-complete.json
```

**If the Valcre ID is NOT found in this file:**
- ❌ **Do not add to registry** without verification
- 🔍 Double-check the Valcre ID spelling
- 💬 Ask user to confirm the field name
- 📖 Check `workbookFieldMapping.ts` for alternative IDs

### For Developers (Field Mapping)

When mapping dashboard fields to Valcre fields, use this file to:

1. **Verify Valcre ID exists** (prevents typos)
2. **Get exact cell location** (for debugging)
3. **Identify sheet name** (understand data source)
4. **Validate mappings** in `workbookFieldMapping.ts`

### For QA/Testing (Validation)

Use the verified reference values to test calculations:

```typescript
// Test: calc-noi should equal $111,771 for North Battleford test data
expect(getFieldValue(sections, 'calc-noi')).toBe(111771);

// Test: calc-pgr should equal $204,240
expect(getFieldValue(sections, 'calc-pgr')).toBe(204240);

// Test: calc-indicated-value should equal $1,800,000
expect(getFieldValue(sections, 'calc-indicated-value')).toBe(1800000);
```

---

## 📊 Coverage Statistics

### Named Ranges by Sheet Category

| Sheet Type | Approximate Count | Purpose |
|------------|------------------|---------|
| **DIRECTCAP** | ~300 | Direct Capitalization (Income Approach) |
| **RENT1-4** | ~1,300 | Rental Survey Comparables (4 sheets) |
| **SALES1-5** | ~1,600 | Sales Comparables (5 sheets) |
| **DATA** | ~400 | Property Data & Configuration |
| **REGIONAL** | ~200 | Market & Regional Analysis |
| **VALUES** | ~150 | Value Reconciliation |
| **SPECIALUSE** | ~800 | Specialized Property Types |
| **Other** | ~5,900 | Supporting sheets (formulas, calculations, templates) |

---

## 🔄 When To Update This File

**Update if:**
- ✅ Valcre releases a new workbook version
- ✅ Named ranges are added/removed in Valcre template
- ✅ Sheet structure changes in workbook
- ✅ User provides updated .xlsm file

**How to update:**
1. Obtain new Valcre .xlsm workbook
2. Run extraction script using `openpyxl`:
   ```python
   from openpyxl import load_workbook
   wb = load_workbook('new-workbook.xlsm', data_only=False)
   # Extract all named ranges...
   ```
3. Replace `valcre-named-ranges-complete.json` with new extraction
4. Update this README with new date and statistics
5. Commit with message: `docs(valcre): update ground truth from [workbook-name]`

---

## 🔗 Related Documentation

### In This Project
- **`/src/features/report-builder/schema/workbookFieldMapping.ts`** - Bidirectional field mapping (Valcre ↔ Dashboard)
- **`/src/features/report-builder/schema/fieldRegistry.ts`** - Dashboard field registry (889 fields)
- **`/docs/15-Contract-review/2-Field Management/TABLE-FIELD-ANALYSIS.md`** - Table-to-sheet mapping analysis
- **`/docs/15-Contract-review/2-Field Management/VALCRE-WORKBOOK-TECHNICAL-GUIDE.md`** - Comprehensive workbook structure guide

### Historical Context
- **Session 74-75 Passover:** `/docs/15-Contract-review/1-Formatting & Report/-passover-sessions/25.12.18-75 - Field-Registry-Expansion.md`
- **Workbook Validation Session:** `/docs/15-Contract-review/-passover-sessions/25.12.10-4 - Workbook-Field-Validation-Mapping.md`

---

## 🚨 Critical Warnings

### DO NOT:
- ❌ **Delete this file** - It's the authoritative source for all field mappings
- ❌ **Edit manually** - Only update via programmatic extraction
- ❌ **Guess Valcre IDs** - Always verify against this file first
- ❌ **Assume documentation is current** - This JSON is the source of truth

### DO:
- ✅ **Reference this file** before adding fields to registry
- ✅ **Commit changes** if you update the JSON
- ✅ **Document updates** in this README with date and reason
- ✅ **Verify mappings** against this file during QA

---

## 📝 Change Log

| Date | Change | Agent/Session | Notes |
|------|--------|---------------|-------|
| 2025-12-19 | Initial extraction from VAL251012 workbook | Session 75 - Workbook Extraction Agent | 9,652 named ranges extracted via openpyxl |
| 2025-12-19 | Moved to proper documentation folder | Session 75 - Registry Agent | Created this README for protection and validation |

---

## 💡 Why This Matters

**The Problem We Solved:**

Before this file existed, we had:
- ❓ Uncertainty about whether field IDs were guessed or verified
- ❓ No way to validate if a Valcre ID exists before adding to registry
- ❓ Tables in Word doc were flattened images (couldn't see individual cells)
- ❓ Risk of typos or incorrect mappings

**What This File Provides:**

- ✅ **Ground truth** - Direct extraction from actual workbook (not documentation)
- ✅ **Complete coverage** - All 9,652 named ranges (100% of workbook)
- ✅ **Cell-level precision** - Exact sheet and cell location for every field
- ✅ **Validation checkpoint** - Verify any field exists before using it
- ✅ **Test data** - Known values for QA validation

**Bottom Line:** This file prevents us from "pulling our hair out" wondering if we verified fields properly. We did. This is the proof.

---

**Last Updated:** December 19, 2025
**Maintained By:** Registry Agent (APR Dashboard Field Management)
**Status:** ✅ VERIFIED & PROTECTED
