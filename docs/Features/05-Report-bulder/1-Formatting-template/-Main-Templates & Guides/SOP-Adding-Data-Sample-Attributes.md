# SOP: Adding data-sample Attributes to Field-Mapped Pages

**Purpose:** Enable toggle functionality on HTML pages by adding `data-sample` attributes to all field-mapped spans
**Result:** Toggle OFF = Show field IDs ({{Field_Name}}), Toggle ON = Show actual sample data
**Project:** APR Report Builder - Contract Review Report

---

## 📋 Overview

Each page in PREVIEW-Master.html has field-mapped spans that need TWO attributes:
1. `title="{{Field_ID}}"` - The field ID (ALREADY EXISTS on most pages)
2. `data-sample="Actual Value"` - The sample data value (NEEDS TO BE ADDED)

**Example:**
```html
<!-- INCOMPLETE (missing data-sample) -->
<span class="field-mapped" title="{{Company_Name}}">{{Company_Name}}</span>

<!-- COMPLETE (has both attributes) -->
<span class="field-mapped" data-sample="Valta Property Valuations Ltd." title="{{Company_Name}}">{{Company_Name}}</span>
```

---

## 🎯 Workflow Steps

### Step 1: Identify Page Missing data-sample Attributes

**Method:** Compare to a reference page that already has data-sample attributes.

```bash
# Read a page that HAS data-sample (e.g., Page 4)
grep -A 2 "Page 4" PREVIEW-Master.html | grep "data-sample"

# Read a page that NEEDS data-sample (e.g., Page 3)
grep -A 2 "Page 3" PREVIEW-Master.html | grep "data-sample"
```

**What to look for:**
- ✅ **HAS data-sample:** `<span class="field-mapped" data-sample="VALUE" title="{{Field_ID}}">{{Field_ID}}</span>`
- ❌ **MISSING data-sample:** `<span class="field-mapped" title="{{Field_ID}}">{{Field_ID}}</span>`

---

### Step 2: Find Source Files for Data Extraction

**File Locations:**

| File Type | Directory | Purpose |
|-----------|-----------|---------|
| **SVG** (preferred) | `docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/doc-pages-north b-svg/` | Extract text values via grep |
| **PNG** (visual) | `docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/doc-page-images/` | Visually confirm values from image |

**File Naming Convention:**
- Page 3 (Letter) → `-c-letter.svg` / `-c-letter.png`
- Page 4 (Cover) → `-a-cover.svg` / `-a-cover.png`
- Page 16-30 (Site) → `site-01.svg` / `site-01.png`, `site-02.svg`, etc.
- Pages 40+ (Income) → `income-01.svg` / `income-01.png`, etc.

**Find the correct file:**
```bash
# List SVG files to identify page naming
ls -la docs/15-Contract-review/1-Formatting\ \&\ Report/REPORT\ Pg\ Img/doc-pages-north\ b-svg/

# List PNG files
ls -la docs/15-Contract-review/1-Formatting\ \&\ Report/REPORT\ Pg\ Img/doc-page-images/
```

---

### Step 3: Extract Data from Source Files

**Option A: Extract from SVG (for text-heavy pages)**

```bash
# Grep for specific text values in SVG
grep -i "valta\|december\|first national\|1101" path/to/page.svg
```

**Option B: Read PNG Image (recommended - most accurate)**

```bash
# Use Read tool to view PNG image
Read(~/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/doc-page-images/-c-letter.png)
```

**Extract all visible text values:**
- Company info (name, address, phone)
- Dates
- Client info
- Property address
- Numerical values (dollars, square feet, etc.)
- Paragraph text (descriptions, comments)

**Pro Tip:** Use Read tool on PNG to visually see ALL values at once instead of grepping SVG.

---

### Step 4: Show BEFORE/AFTER Comparison

**Document what you're changing BEFORE making edits:**

```
🔴 BEFORE (Missing data-sample):

<b><span class="field-mapped" title="{{Company_Name}}">{{Company_Name}}</span></b><br>
<span class="field-mapped" title="{{Company_Address}}">{{Company_Address}}</span><br>
<span class="field-mapped" title="{{Company_CityStateZip}}">{{Company_CityStateZip}}</span><br>

🟢 AFTER (With data-sample):

<b><span class="field-mapped" data-sample="Valta Property Valuations Ltd." title="{{Company_Name}}">{{Company_Name}}</span></b><br>
<span class="field-mapped" data-sample="#300, 4658 Richard Road SW" title="{{Company_Address}}">{{Company_Address}}</span><br>
<span class="field-mapped" data-sample="Calgary, AB T3E 6L1" title="{{Company_CityStateZip}}">{{Company_CityStateZip}}</span><br>
```

**Why this matters:** User can review before you proceed with bulk changes.

---

### Step 5: Update HTML File with data-sample Attributes

**Target File:**
```
/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/doc-page-html/doc-pages-html-formatted/PREVIEW-Master.html
```

**Use Edit tool to update each field:**

```typescript
// Example: Update Company_Name field
Edit(PREVIEW-Master.html, {
  old_string: '<span class="field-mapped" title="{{Company_Name}}">{{Company_Name}}</span>',
  new_string: '<span class="field-mapped" data-sample="Valta Property Valuations Ltd." title="{{Company_Name}}">{{Company_Name}}</span>'
})
```

**IMPORTANT RULES:**
1. **DO NOT modify the field ID** (`title="{{Field_ID}}"`) - Keep it exactly as-is
2. **DO NOT modify the inner content** (`>{{Field_ID}}</span>`) - Keep it exactly as-is
3. **ONLY add** the `data-sample="VALUE"` attribute before the title attribute
4. **Preserve all HTML formatting** - Don't break line breaks, spacing, or structure
5. **Use exact values from source** - Copy text exactly as shown in PNG/SVG

---

### Step 6: Document Fields Updated

**Create a summary showing:**

```
📊 Summary of Changes

Page Updated: Page 3 (Letter of Transmittal)

Total Fields Updated: 20 field-mapped spans now have data-sample attributes

Fields Added:
- ✅ Company_Name: "Valta Property Valuations Ltd."
- ✅ Company_Address: "#300, 4658 Richard Road SW"
- ✅ Company_Phone: "587-801-5151"
- ✅ Report_Date: "November 20, 2025"
- ✅ Client_Company: "102109845 Saskatchewan Ltd."
... (list all fields)

🎯 Result

Toggle now works on Page 3:
- OFF = Shows field IDs like {{Company_Name}}
- ON = Shows sample data like Valta Property Valuations Ltd.
```

---

### Step 7: Commit Changes

**Commit Pattern:**
```bash
cd /Users/bencrowe/Development/APR-Dashboard-v3

git add "docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/doc-page-html/doc-pages-html-formatted/PREVIEW-Master.html"

git commit -m "feat(page-X): add data-sample attributes for toggle functionality"
```

**Good Commit Messages:**
- `feat(page-3): add data-sample attributes for toggle functionality`
- `feat(page-16): add site field data-sample attributes`
- `feat(page-40): add income table data-sample attributes`

**Bad Commit Messages:**
- ❌ `update page 3`
- ❌ `add samples`
- ❌ `fixes`

---

## 🔍 Common Field Patterns

### Company/Client Fields
```html
<span class="field-mapped" data-sample="Valta Property Valuations Ltd." title="{{Company_Name}}">{{Company_Name}}</span>
<span class="field-mapped" data-sample="#300, 4658 Richard Road SW" title="{{Company_Address}}">{{Company_Address}}</span>
<span class="field-mapped" data-sample="Calgary, AB T3E 6L1" title="{{Company_CityStateZip}}">{{Company_CityStateZip}}</span>
<span class="field-mapped" data-sample="587-801-5151" title="{{Company_Phone}}">{{Company_Phone}}</span>
```

### Date Fields
```html
<span class="field-mapped" data-sample="November 20, 2025" title="{{Report_Date}}">{{Report_Date}}</span>
<span class="field-mapped" data-sample="October 17, 2025" title="{{Report_Date1}}">{{Report_Date1}}</span>
```

### Property Address Fields
```html
<span class="field-mapped" data-sample="1101, 1121 109 St" title="{{Subject_Street}}">{{Subject_Street}}</span>
<span class="field-mapped" data-sample="North Battleford" title="{{Subject_City}}">{{Subject_City}}</span>
<span class="field-mapped" data-sample="SK" title="{{Subject_State}}">{{Subject_State}}</span>
```

### Currency Fields
```html
<span class="field-mapped" data-sample="$1,400,000" title="{{Report_Values}}">{{Report_Values}}</span>
```

### Select/Enum Fields
```html
<span class="field-mapped" data-sample="Fee Simple Estate" title="{{Report_Interest}}">{{Report_Interest}}</span>
<span class="field-mapped" data-sample="As Stabilized" title="{{Report_ValueScenario1}}">{{Report_ValueScenario1}}</span>
```

### Long Text/Paragraph Fields
```html
<span class="field-mapped" data-sample="The subject property, located at 1101, 1121 109 St, North Battleford, SK, is a multi-family, walkup property with improvements located in North Battleford. The improvements are comprised of 2 total buildings, and consist of 10,201 square feet (sf) of net rentable area (NRA) as of the valuation date." title="{{Subject_IntroComment}}">{{Subject_IntroComment}}</span>
```

**IMPORTANT for long text:** Keep the entire paragraph on ONE LINE in the data-sample attribute. Do NOT add line breaks inside the data-sample value.

---

## ✅ Quality Checklist

Before committing, verify:

- [ ] All field-mapped spans on the page have data-sample attributes
- [ ] Data-sample values match exactly what appears in source PNG/SVG
- [ ] No field IDs were modified (title="{{Field_ID}}" unchanged)
- [ ] No inner content was modified (>{{Field_ID}}</span> unchanged)
- [ ] HTML structure preserved (line breaks, spacing, formatting)
- [ ] Long text values are on one line (no line breaks in data-sample)
- [ ] Created BEFORE/AFTER comparison for user review
- [ ] Documented all fields updated in summary
- [ ] Commit message follows pattern: `feat(page-X): add data-sample attributes for toggle functionality`

---

## 🚨 Common Mistakes to Avoid

### ❌ DON'T: Modify field IDs
```html
<!-- WRONG -->
<span class="field-mapped" data-sample="Valta Property Valuations Ltd." title="{{CompanyName}}">{{Company_Name}}</span>
                                                                              ^^^^^^^^^^^^^^  ^^^^^^^^^^^^^^^^
                                                                              Changed ID      Doesn't match
```

### ❌ DON'T: Add line breaks in data-sample
```html
<!-- WRONG -->
<span class="field-mapped" data-sample="The subject property,
located at 1101, 1121 109 St,
North Battleford, SK" title="{{Subject_IntroComment}}">{{Subject_IntroComment}}</span>

<!-- RIGHT -->
<span class="field-mapped" data-sample="The subject property, located at 1101, 1121 109 St, North Battleford, SK" title="{{Subject_IntroComment}}">{{Subject_IntroComment}}</span>
```

### ❌ DON'T: Change HTML structure
```html
<!-- WRONG (removed <br> tags) -->
<span class="field-mapped" data-sample="Valta Property Valuations Ltd." title="{{Company_Name}}">{{Company_Name}}</span>
<span class="field-mapped" data-sample="#300, 4658 Richard Road SW" title="{{Company_Address}}">{{Company_Address}}</span>

<!-- RIGHT (preserved <br> tags) -->
<span class="field-mapped" data-sample="Valta Property Valuations Ltd." title="{{Company_Name}}">{{Company_Name}}</span><br>
<span class="field-mapped" data-sample="#300, 4658 Richard Road SW" title="{{Company_Address}}">{{Company_Address}}</span><br>
```

### ❌ DON'T: Skip the visual verification
```
Always read the PNG image to verify values. SVG text extraction can miss formatting or special characters.
```

---

## 📊 Progress Tracking

**Pages Completed:**
- ✅ Page 4 (Cover) - Already had data-sample attributes (reference example)
- ✅ Page 3 (Letter of Transmittal) - Completed with 20 fields

**Pages Pending:**
- ⏳ Page 5-59 - Need data-sample attributes added
- ⏳ Page 60-77 - Need data-sample attributes added (if these pages exist)

**Track in handoff file:** Update `-Handoff-[DATE].md` with progress after each page.

---

## 🔗 Related Documentation

| Document | Purpose |
|----------|---------|
| `FIELD-ID-GUIDE-for-Agents.md` | Field naming conventions and format |
| `TABLE-CREATION-GUIDE.md` | Table formatting standards |
| `AGENT-GUIDE-Page-Formatting.md` | General page formatting guide |
| `-Handoff-[DATE].md` | Current project status and progress |

---

## 📝 Example: Complete Page Update

**Scenario:** Adding data-sample to Page 3 (Letter of Transmittal)

**Step 1: Identify**
```bash
# Confirmed Page 3 missing data-sample attributes
grep "Page 3" PREVIEW-Master.html | grep "data-sample" | wc -l
# Result: 0 (needs fixing)
```

**Step 2: Find Source**
```bash
# Located PNG: -c-letter.png
ls docs/15-Contract-review/1-Formatting\ \&\ Report/REPORT\ Pg\ Img/doc-page-images/ | grep letter
```

**Step 3: Extract Data**
```bash
# Read PNG visually
Read(~/Development/.../doc-page-images/-c-letter.png)
# Extracted 22 distinct field values
```

**Step 4: Show Comparison**
```
🔴 BEFORE: <span class="field-mapped" title="{{Company_Name}}">{{Company_Name}}</span>
🟢 AFTER: <span class="field-mapped" data-sample="Valta Property Valuations Ltd." title="{{Company_Name}}">{{Company_Name}}</span>
```

**Step 5: Update File**
```bash
# Used Edit tool to update all 20 spans
# Preserved HTML structure exactly
```

**Step 6: Document**
```
✅ Page 3 Complete - 20 fields updated
- Company_Name, Company_Address, Client_Name, etc.
```

**Step 7: Commit**
```bash
git commit -m "feat(page-3): add data-sample attributes for toggle functionality"
# Commit: 6fc7abf
```

---

**Last Updated:** December 17, 2025
**Created By:** Based on successful Page 3 implementation workflow
**Maintained By:** APR Report Builder Team
