# Field ID Guide for Page Formatting Agents

**Project:** APR Dashboard v3 - Report Builder HTML Template Migration
**Purpose:** How to find and verify field IDs when formatting report pages
**Last Updated:** 2024-12-16

---

## 🎯 Purpose

This guide teaches agents how to identify which field IDs belong on specific pages during the HTML formatting process. Use this when you're assigned to format pages and need to map dynamic content to field placeholders.

---

## 🔍 The Problem

You're assigned pages 40-45. You need to know:
- What field IDs appear on these pages?
- What tables are on these pages?
- What field patterns should you use?

---

## ✅ The Solution: 4-Step Workflow

### STEP 1: Look at the Source Image

Open the source image for your page to see what content is there:

```bash
# For page 40, read:
/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/doc-page-images/Page-40.png
```

**Identify the content type:**
- Is it a table with calculations? (Income Approach)
- Is it a survey/rental comparison? (Market Rent Survey)
- Is it sales comparables? (Sales Comparison Approach)
- Is it narrative text? (Property Description)

---

### STEP 2: Check TABLE-FIELD-ANALYSIS.md for Page Range

The Field Management directory has a master reference that tells you which field types appear on which pages:

**Location:** `/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/2-Field Management/TABLE-FIELD-ANALYSIS.md`

**Page Range Reference:**

| Page Range | Section Name | Field Pattern | Example Fields |
|------------|--------------|---------------|----------------|
| **Pages 35-39** | Market Rent Survey | `survey1-*`, `survey2-*`, `survey3-*`, `survey4-*`, `survey5-*` | `survey1-name`, `survey1-address`, `survey1-rent-1br` |
| **Pages 40-50** | Income Approach | `calc-noi`, `calc-egr`, `calc-exp-*`, `calc-vacancy` | `calc-noi`, `calc-egr`, `calc-exp-taxes`, `calc-exp-insurance` |
| **Pages 55-60** | Sales Comparison | `comp1-*`, `comp2-*`, `comp3-*` | `comp1-sale-price`, `comp2-units`, `comp3-nra` |

**Example:**
- You're formatting **page 42** → Income Approach section (pages 40-50)
- Field pattern: `calc-*` (calculation fields)
- Likely fields: `calc-noi`, `calc-egr`, `calc-exp-taxes`, etc.

---

### STEP 3: Search PREVIEW-Master.html for Similar Content

Check if similar content already exists in pages 3-39 to see field naming patterns:

```bash
# Search for similar field patterns
grep -i "calc-" PREVIEW-Master.html
grep -i "expense" PREVIEW-Master.html
grep -i "income" PREVIEW-Master.html
```

**Example:**
If page 42 has an expense table, search PREVIEW-Master.html for "expense" to see:
- How expense fields are named
- What structure was used
- Which field IDs were mapped

---

### STEP 4: Check doc-pages-html-single/ for Template Field IDs

The most reliable source: check if your specific page already has field mappings:

**Location:** `/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/doc-page-html/doc-pages-html-single/`

```bash
# Read the single HTML page for your page number
Read: /Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/doc-page-html/doc-pages-html-single/Page-42.html
```

**If the file exists:**
- ✅ Copy field IDs directly from this template
- ✅ Field mappings are already verified
- ✅ Saves you from guessing field names

**If the file doesn't exist:**
- ✅ Use Steps 2-3 to determine field patterns
- ✅ Follow existing naming conventions
- ✅ Document new field IDs in your delivery notes

---

## 📂 Field Management Directory Reference

**Master Directory Location:**
`/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/2-Field Management/`

### Key Files:

1. **MASTER-FIELD-DIRECTORY.md** - Complete catalog of 7,967 fields from final report
2. **TABLE-FIELD-ANALYSIS.md** - Page ranges and field patterns (pages 35-39, 40-50, 55-60)
3. **FIELD-ALIGNMENT-REPORT.md** - Three-way alignment between all sources
4. **DATA-FLOW-SUMMARY.md** - How data flows through the system

**When to check Field Management:**
- ✅ Before creating ANY new field IDs
- ✅ When uncertain about field naming
- ✅ To verify field patterns for your section
- ✅ To understand which fields are already defined

---

## 📝 Real Example Walkthrough

### Scenario: You're assigned pages 40-45 (Income Approach section)

**Step 1: Check source images**
- Open `Page-40.png`, `Page-41.png`, etc.
- See tables with: Potential Gross Rent, Vacancy, Effective Gross Rent, Expenses, NOI

**Step 2: Check TABLE-FIELD-ANALYSIS.md**
- Pages 40-50 = Income Approach section
- Field pattern: `calc-*` (calculation fields)

**Step 3: Search PREVIEW-Master.html**
```bash
grep -i "calc-" PREVIEW-Master.html
# Returns: calc-noi, calc-egr, calc-exp-taxes, calc-vacancy
```

**Step 4: Check single HTML templates**
```bash
Read: Page-40.html
# Find exact field mappings used on page 40
# Copy field IDs directly from template
```

**Result:**
- ✅ You know exactly which field IDs to use
- ✅ No guessing required
- ✅ Consistent with existing pages
- ✅ Ready to format with confidence

---

## 🆕 If You Create New Field IDs

If you determine a new field ID is needed (not found in templates or Field Management):

1. **Follow naming convention:** `Category_Description` (e.g., `calc-cap-rate`, `survey1-parking`)
2. **Document in delivery notes:**
   ```
   === NEW FIELD IDs CREATED ===
   - {{calc-cap-rate}} - Capitalization rate for income approach (page 42)
   - {{calc-value-income}} - Indicated value by income approach (page 45)
   ```
3. **Verify in review:** User will confirm if field IDs are appropriate or need adjustment

---

## 🏷️ Field Mapping Format

**Standard format:**
```html
<span class="field-mapped" title="{{Field_ID}}">{{Field_ID}}</span>
```

### Common Field ID Patterns:

**Subject Property:**
- `{{Subject_Street}}` - Property address
- `{{Subject_City}}` - City
- `{{Subject_State}}` - State/Province
- `{{Subject_Primary}}` - Primary property type
- `{{Subject_Subtype}}` - Property subtype
- `{{Subject_NRA}}` - Net rentable area
- `{{Subject_Owner}}` - Current owner
- `{{Subject_Zoning}}` - Zoning designation
- `{{Subject_SiteArea}}` - Site area
- `{{Subject_Units}}` - Number of units

**Company/Report:**
- `{{Company_JobNumber}}` - File number
- `{{Company_Name}}` - Appraisal company
- `{{Report_Date}}` - Report date
- `{{Report_Date1}}` - Effective date of value
- `{{Report_InspectionDate}}` - Inspection date

**Market/Valuation:**
- `{{Market_[Description]}}` - Market analysis fields
- `{{Value_[Type]}}` - Valuation fields
- `{{Comp_[Number]_[Field]}}` - Comparable property data

---

## 📋 Field Naming Convention

1. Use **PascalCase** (e.g., `Subject_Street`, not `subject_street`)
2. Use **descriptive names** (e.g., `Market_SupplyTrend`, not `mkt_sup`)
3. Match existing patterns from pages 3-39
4. **Check the master field ID document** if unsure

---

## ✅ What to Map vs. What NOT to Map

### ✅ Map these:
- Property addresses, names, descriptions
- Dates, numbers, measurements
- Owner/client names
- Market data, valuations
- Any user-editable content

### ❌ Don't map these:
- Section headers ("Introduction & Executive Summary")
- Static labels in tables ("Property Type", "Legal Description")
- Boilerplate text (standard disclaimers, definitions)
- Instructional text

---

## 🎯 Summary Workflow

**Don't guess field IDs.** Use the 4-step workflow:

1. **Look at source image** → What content is on the page?
2. **Check TABLE-FIELD-ANALYSIS.md** → What field pattern for this page range?
3. **Search PREVIEW-Master.html** → How are similar fields named?
4. **Check doc-pages-html-single template** → Does exact mapping already exist?

This workflow ensures consistency, reduces errors, and makes your formatting work align with the existing system.

---

## 📞 If You're Uncertain

**If uncertain about a field ID:**
1. ✅ Check Field Management directory files first
2. ✅ Search PREVIEW-Master.html for similar content
3. ✅ Create a **"Unknown Field IDs"** list in your delivery notes
4. ✅ Propose descriptive field names following the convention
5. ❌ DON'T skip field mapping (better to have a tentative ID than none)
6. ❌ DON'T use generic names like "Field1", "Text1" (use descriptive names)

---

## 🔗 Related Documentation

- **Agent Guide:** See `AGENT-GUIDE-Page-Formatting.md` for complete page formatting workflow
- **Field Management README:** See `README.md` in this directory for all field documentation files
- **Master Field Directory:** See `MASTER-FIELD-DIRECTORY.md` for complete field catalog (7,967 fields)

---

**Ready to find your field IDs? Follow the 4-step workflow! 🚀**
