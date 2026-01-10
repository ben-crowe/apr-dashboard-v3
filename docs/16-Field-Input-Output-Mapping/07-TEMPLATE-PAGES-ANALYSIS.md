# Template Pages Analysis & Action Plan

**Document**: 07 - Template Pages Analysis
**Created**: 2026-01-09
**Purpose**: Identify which pages need data-sample attributes, which calculator pages need updating, and clarify Desktop's calculator mockup purpose

---

## 1. PAGES WITHOUT DATA-SAMPLE ATTRIBUTES (User Ready Mode Issue)

These pages show field IDs in "User Ready" mode instead of example data, causing layout push-down:

| Page | Title | Issue | Fix Needed |
|------|-------|-------|------------|
| **19** | (Unknown - needs check) | No data-sample | Add example data |
| **24** | (Unknown - needs check) | No data-sample | Add example data |
| **36** | Income Approach | No data-sample | Add example data |
| **37** | Rent Survey Comparison Table | No data-sample | Add example data |
| **63** | Certification | No data-sample | **INTENTIONAL** - Legal text, no fields |
| **69** | Definition of Terms (cont.) | No data-sample | **INTENTIONAL** - Glossary, no fields |
| **70** | Definition of Terms (cont.) | No data-sample | **INTENTIONAL** - Glossary, no fields |

**Pages 63, 69, 70**: These are text-only pages (legal/glossary), so missing data-sample is correct.

**Pages 36-37**: Income/Rent Survey pages - these SHOULD have data-sample attributes for clean User Ready mode.

**Pages 19, 24**: Need identification.

---

## 2. PAGES 52-57 FORMATTING ISSUES

### Issue A: Missing Blue Header Lines
**Status**: ✅ CONFIRMED
**Pages affected**: 52, 53, 54, 55, 56, 57
**Problem**: Local CSS overrides remove `border-bottom: 1px solid #003b7e;` from Header1

### Issue B: Fit-to-Page Formatting
**Status**: ⚠️ NEEDS VERIFICATION
**Pages 53-57**: Have `padding: 54px 54px 180px 54px;` which may cause horizontal overflow
**Page 52**: Standard `padding-bottom: 180px;` only

**Git History**:
- Commit `cae568f` (Jan 7, 2026) - v2.9.0 upgrade
- Message: "Pages 52-57 replaced with corrected structure from v2.6.0"
- **Status**: Pages WERE updated 2 days ago, but blue borders not restored

---

## 3. CALCULATOR PAGES IN TEMPLATE

### Current Income Approach Pages:

| Page | Report Page | Title | Has data-sample? |
|------|-------------|-------|------------------|
| 53 | 49 | Direct Capitalization | ✅ YES |
| 54 | 50 | Income Approach Conclusion | ✅ YES |

**Example data-sample values found**:
- `calc-subtotal-per-unit`: `$1,020`
- `calc-subtotal-per-sf`: `$19.19`
- `calc-subtotal-annual`: `$195,840`

### Pages that GENERATE from Calculator:
Based on fieldRegistry and calculator-demo-v4:

**Income Approach generates**:
- Page 49 (Template Page 53): Direct Capitalization table
- Page 50 (Template Page 54): Income Conclusion

**These pages should be rebuilt from Desktop's v2 spec** (49 inputs → 78 calculated outputs).

---

## 4. DESKTOP'S CALCULATOR MOCKUP - PURPOSE CLARIFICATION

### What Desktop Created:

1. **Calculator-Field-Reference-v2.html** (915 lines)
   - Visual reference guide
   - Shows 100 fields (42 inputs + 58 calculated)
   - Interactive dark-themed design
   - **Purpose**: Documentation/reference ONLY

2. **Calculator-Field-Reference-v2.md** (216 lines)
   - Agent-readable spec
   - 127 total fields (49 inputs + 78 calculated)
   - Expanded from 4 to 6 unit types
   - **Purpose**: Specification for updating CalcInputPanel

3. **Income-Input-UI-Mockup-v2.html** (1009 lines)
   - Functional prototype with working inputs
   - Shows INPUT → OUTPUT flow
   - Green preview panels with calculated results
   - **Purpose**: UI design reference for dashboard tabs

### Intended Use:

**Desktop's mockups are REFERENCE DESIGNS**, not meant to replace your template.

**Correct workflow**:
1. ✅ Use v2 spec to update `CalcInputPanel` (49 inputs)
2. ✅ Use v2 spec to update calculator engine (127 total fields)
3. ✅ Update **Template Pages 49-50** to match v2 output structure
4. ✅ Keep standalone calculator for testing
5. ✅ Generated pages from standalone → insert into template

**Desktop's HTML mockup shows**:
- How the INPUT panel should look in dashboard
- How the OUTPUT preview should display
- What calculations happen in real-time

---

## 5. WHICH PAGES DOES THE CALCULATOR GENERATE?

### Current State (calculator-demo-v4):
**Generates**: 2 pages
- Page 49: Direct Capitalization (Income Statement)
- Page 50: Income Approach Conclusion

**Input fields**: 29 (from 4 unit types)
**Output fields**: 33

### After v2 Update (Desktop's spec):
**Will generate**: Same 2 pages, but enhanced
- Page 49: Expanded to 6 unit types, 4 vacancy types
- Page 50: Enhanced with more detailed outputs

**Input fields**: 49 (from 6 unit types + expanded sections)
**Output fields**: 78

### Page Generation Flow:

```
CalcInputPanel (Dashboard Tab)
    ↓
49 user inputs entered
    ↓
Calculator Engine processes
    ↓
78 calculated outputs generated
    ↓
Report Builder injects into Template Pages 49-50
    ↓
Final PDF pages with blue headers, data-sample values
```

---

## 6. ACTION ITEMS

### Immediate Fixes:

1. **Fix Pages 52-57 Blue Headers** (Agent prompt ready)
   - Add `border-bottom: 1px solid #003b7e;` to Header1
   - 6 pages, simple CSS addition

2. **Add data-sample to Pages 36-37**
   - Page 36: Income Approach intro
   - Page 37: Rent Survey table

3. **Identify Pages 19, 24**
   - Check what these pages are
   - Determine if they need data-sample

### Enhancement Work:

4. **Update CalcInputPanel** (use Desktop's v2 spec)
   - Expand from 4 to 6 unit types
   - Add 4 vacancy/loss types
   - Update expense field IDs to `-annual` suffix

5. **Update Template Pages 49-50**
   - Expand unit mix table to 6 types
   - Add missing vacancy types
   - Ensure all 127 fields have placeholders

6. **Verify Calculator → Template Field Alignment**
   - All 49 inputs in CalcInputPanel
   - All 78 outputs in template pages 49-50
   - All field IDs match fieldRegistry

---

## 7. PAGES THAT SHOULD HAVE DATA-SAMPLE

**All financial/calculated pages need data-sample for clean User Ready mode**:

✅ **Already have it**:
- Pages 48-51: Income pages
- Pages 52-57: Sales Comparison pages (map, summaries)
- Pages 58+: Cost Approach pages

❌ **Missing it**:
- Page 36: Income Approach intro
- Page 37: Rent Survey Comparison

**Pages that DON'T need it** (text-only):
- Page 63: Certification (legal text)
- Pages 69-70: Glossary

---

## SUMMARY FOR USER

**Your understanding is correct**:

1. ✅ Desktop's HTML mockup is a **design reference**, not replacement code
2. ✅ Use it to enhance **current CalcInputPanel** in dashboard
3. ✅ Update **calculator engine** to v2 spec (49 inputs → 78 outputs)
4. ✅ Update **Template Pages 49-50** to match v2 structure
5. ✅ Pages 52-57 need blue header fix + possibly data-sample check
6. ✅ Standalone calculator generates 2 pages (49-50) which insert into template

**Calculator generates**: Pages 49-50 ONLY (Income Approach section)
**Other sections generate**: Different pages (Sales, Cost, Recon each have their own)

---

**Next Steps**:
1. Agent fixes Pages 52-57 blue headers (prompt ready)
2. Verify Pages 36-37 need data-sample
3. Use Desktop's v2 spec to update CalcInputPanel
4. Update calculator engine to 127 fields
5. Regenerate Pages 49-50 with v2 structure

---

**Document Status**: ✅ Complete
**Agent Context**: This clarifies Desktop's mockup purpose and identifies template pages needing fixes
