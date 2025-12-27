# Subagent Task: Add Missing data-sample Attributes to Field-Mapped Spans

**Date Created:** December 17, 2025
**Task Type:** Data extraction and field mapping correction
**Estimated Scope:** 251 missing data-sample attributes across pages 3-40

---

## 🎯 Mission

You are assigned to add missing `data-sample` attributes to field-mapped spans in PREVIEW-Master.html. The previous agent created field mappings but didn't extract the actual data values from the source images. Your job is to:

1. Read the source PNG image for your assigned page(s)
2. Extract the actual data values shown in the image
3. Add `data-sample` attributes to ALL field-mapped spans on that page

---

## 📊 Current Status

**Analysis completed:** 35 pages (3-40) have 251 missing data-sample attributes
**Pages with most missing data:**
- Page 31: 62 missing (Economic Indicators section)
- Page 6: 25 missing (Property Overview)
- Page 3: 24 missing (Cover Letter)
- Page 17: 18 missing (Identification of Assignment)

---

## ✅ CORRECT Format (What You Must Create)

**Current state (WRONG):**
```html
<span class="field-mapped" title="{{Company_Name}}">{{Company_Name}}</span>
```

**Fixed state (CORRECT):**
```html
<span class="field-mapped" data-sample="Valta Property Valuations Ltd." title="{{Company_Name}}">{{Company_Name}}</span>
```

**Key rules:**
- `textContent` = Field ID (e.g., `{{Company_Name}}`)
- `data-sample` = Actual value from image (e.g., `"Valta Property Valuations Ltd."`)
- `title` = Field ID (already correct, don't change)

---

## 📂 File Locations

**HTML file to edit:**
`/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/doc-page-html/doc-pages-html-formatted/PREVIEW-Master.html`

**Source images (extract data from here):**
`/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/doc-page-images/`

- Page-3.png
- Page-4.png
- Page-6.png
- Page-7.png
- ... etc.

---

## 🔍 Step-by-Step Workflow

### Step 1: Read Your Assigned Page Image

```bash
# Example for Page 3:
Read: /Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/doc-page-images/Page-3.png
```

**Extract all visible data:**
- Company names, addresses, phone numbers
- Client information
- Property addresses
- Dates
- Values, measurements, numbers
- Any text that appears in field-mapped spans

### Step 2: Find the Page in PREVIEW-Master.html

Search for your page number:
```bash
grep -n 'data-page-num="Page 3"' PREVIEW-Master.html
```

### Step 3: Identify Field-Mapped Spans Missing data-sample

Look for patterns like:
```html
<span class="field-mapped" title="{{FieldName}}">{{FieldName}}</span>
```

These need to be changed to:
```html
<span class="field-mapped" data-sample="ActualValue" title="{{FieldName}}">{{FieldName}}</span>
```

### Step 4: Match Field IDs to Image Data

**Example from Page 3:**

Image shows:
- Company: "Valta Property Valuations Ltd."
- Address: "123 Main Street"
- Client: "ABC Real Estate Inc."

Field IDs in HTML:
```html
<span class="field-mapped" title="{{Company_Name}}">{{Company_Name}}</span>
<span class="field-mapped" title="{{Company_Address}}">{{Company_Address}}</span>
<span class="field-mapped" title="{{Client_Company}}">{{Client_Company}}</span>
```

**Add data-sample attributes:**
```html
<span class="field-mapped" data-sample="Valta Property Valuations Ltd." title="{{Company_Name}}">{{Company_Name}}</span>
<span class="field-mapped" data-sample="123 Main Street" title="{{Company_Address}}">{{Company_Address}}</span>
<span class="field-mapped" data-sample="ABC Real Estate Inc." title="{{Client_Company}}">{{Client_Company}}</span>
```

### Step 5: Use Edit Tool to Add data-sample Attributes

**DO NOT rewrite entire sections.** Use Edit tool for precision:

```html
<!-- Find this exact text: -->
<span class="field-mapped" title="{{Company_Name}}">{{Company_Name}}</span>

<!-- Replace with: -->
<span class="field-mapped" data-sample="Valta Property Valuations Ltd." title="{{Company_Name}}">{{Company_Name}}</span>
```

### Step 6: Verify Toggle Functionality

After editing:
1. Open PREVIEW-Master.html in browser
2. Navigate to your page using page navigation
3. Click the toggle button at top-right
4. **Toggle OFF:** Should show field IDs like `{{Company_Name}}`
5. **Toggle ON:** Should show sample data like `Valta Property Valuations Ltd.`

If toggle doesn't work, you made a mistake. Fix it.

---

## 🚨 CRITICAL RULES

### ✅ DO:
- Extract exact text from source PNG images
- Preserve all spacing, punctuation, capitalization exactly as shown
- Add `data-sample` to EVERY field-mapped span on your page
- Use Edit tool for precision (not Write tool for whole sections)
- Verify toggle works after your changes
- Keep field ID in `textContent` (between opening/closing tags)
- Keep field ID in `title` attribute (don't change this)

### ❌ DON'T:
- Don't guess or make up sample values
- Don't leave any field-mapped spans without data-sample
- Don't change the field IDs in title or textContent
- Don't add data-sample to plain text (only to field-mapped spans)
- Don't use Write tool to rewrite entire pages
- Don't skip verification step

---

## 📋 Common Field ID Patterns and Where to Find Data

### Company/Report Fields (Usually on cover pages, headers, footers)

**Field IDs:**
- `{{Company_Name}}` - Company name in header
- `{{Company_Address}}` - Company address
- `{{Company_Phone}}` - Phone number
- `{{Company_JobNumber}}` - File number (usually in footer)
- `{{Report_Date}}` - Report date
- `{{Report_Date1}}` - Effective date of value

**Where to look:** Top of page (letterhead), footer sections

---

### Client Fields (Usually on cover letter pages)

**Field IDs:**
- `{{Client_Company}}` - Client company name
- `{{Client_Name}}` - Contact person name
- `{{Client_Address}}` - Client address
- `{{Client_CityStateZip}}` - City, state, zip

**Where to look:** Cover letter recipient information

---

### Subject Property Fields (Throughout report)

**Field IDs:**
- `{{Subject_Street}}` - Property address
- `{{Subject_City}}` - City
- `{{Subject_State}}` - State/Province
- `{{Subject_Zip}}` - Postal code
- `{{Subject_Primary}}` - Property type (e.g., "Multifamily")
- `{{Subject_Subtype}}` - Subtype (e.g., "Apartment Building")
- `{{Subject_NRA}}` - Net Rentable Area (square feet)
- `{{Subject_Units}}` - Number of units
- `{{Subject_Owner}}` - Current owner name
- `{{Subject_Zoning}}` - Zoning designation

**Where to look:** Property Overview tables, headers, property description sections

---

### Valuation Fields (Usually in executive summary, valuation sections)

**Field IDs:**
- `{{Report_Values}}` - Final value conclusion (e.g., "$2,500,000")
- `{{Report_ValueScenario1}}` - Value scenario (e.g., "As Is")
- `{{Report_Interest}}` - Interest appraised (e.g., "Fee Simple")
- `{{Subject_ExposureTime}}` - Exposure time (e.g., "6-12 months")

**Where to look:** Market Value Conclusion table, Executive Summary

---

### Market/Economic Fields (Pages 31-32 have many)

**Field IDs:**
- `{{SK_Econ_Indicator_X_Name}}` - Economic indicator name
- `{{SK_Econ_Indicator_X_Estimate}}` - Value/percentage
- `{{SK_Econ_Indicator_X_Source}}` - Data source
- `{{SK_Econ_Indicator_X_Commentary}}` - Analysis text

**Where to look:** Economic Overview tables, Market Context section

---

## 📄 Example: Complete Page 3 Fix

**Before (Page 3, lines 383-387):**
```html
<b><span class="field-mapped" title="{{Company_Name}}">{{Company_Name}}</span></b><br>
<span class="field-mapped" title="{{Company_Address}}">{{Company_Address}}</span><br>
<span class="field-mapped" title="{{Company_CityStateZip}}">{{Company_CityStateZip}}</span><br>
Office: <span class="field-mapped" title="{{Company_Phone}}">{{Company_Phone}}</span><br>
```

**After (with data-sample added):**
```html
<b><span class="field-mapped" data-sample="Valta Property Valuations Ltd." title="{{Company_Name}}">{{Company_Name}}</span></b><br>
<span class="field-mapped" data-sample="123 Main Street" title="{{Company_Address}}">{{Company_Address}}</span><br>
<span class="field-mapped" data-sample="Regina, SK S4P 2H1" title="{{Company_CityStateZip}}">{{Company_CityStateZip}}</span><br>
Office: <span class="field-mapped" data-sample="(306) 555-1234" title="{{Company_Phone}}">{{Company_Phone}}</span><br>
```

---

## 🎯 Page Assignment Guide

**Quick fixes (2 missing per page):**
- Pages 9-16, 19-20, 22, 24-27, 30, 35-40: Only `{{Company_JobNumber}}` and `{{Subject_Street}}` in footer

**Medium complexity (5-15 missing):**
- Page 4: 6 missing (Appraiser info)
- Page 7: 14 missing (Valuation summary)
- Page 18: 9 missing (Property details)
- Page 28: 7 missing (Tax information)
- Page 29: 13 missing (Zoning details)

**High complexity (20+ missing):**
- Page 3: 24 missing (Cover letter - company, client, property info)
- Page 6: 25 missing (Property Overview table)
- Page 17: 18 missing (Identification of Assignment)
- Page 31: 62 missing (Economic Indicators - tables with multiple rows)

---

## ⚙️ Using Edit Tool Correctly

**Template:**
```html
<!-- OLD (what exists now): -->
<span class="field-mapped" title="{{FieldID}}">{{FieldID}}</span>

<!-- NEW (what you're changing it to): -->
<span class="field-mapped" data-sample="ValueFromImage" title="{{FieldID}}">{{FieldID}}</span>
```

**Edit tool syntax:**
```typescript
Edit({
  file_path: "/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/doc-page-html/doc-pages-html-formatted/PREVIEW-Master.html",
  old_string: '<span class="field-mapped" title="{{Company_Name}}">{{Company_Name}}</span>',
  new_string: '<span class="field-mapped" data-sample="Valta Property Valuations Ltd." title="{{Company_Name}}">{{Company_Name}}</span>'
})
```

---

## 🧪 Testing Your Changes

1. **Open in browser:** `PREVIEW-Master.html`
2. **Navigate to your page:** Use page navigation input (top-right)
3. **Test toggle:**
   - Toggle OFF: Should see `{{Field_IDs}}`
   - Toggle ON: Should see actual values from images
4. **Verify all fields:** Every field-mapped span should show data, not field IDs

**If any field shows field ID when toggled ON:**
- ❌ You missed adding data-sample to that field
- Go back and fix it

---

## 📊 Deliverable Checklist

Before marking your task complete:

- [ ] Read source PNG image for assigned page(s)
- [ ] Extracted all visible data values from image
- [ ] Added `data-sample` attribute to EVERY field-mapped span on page
- [ ] Used Edit tool for precision (not Write tool)
- [ ] Verified toggle works in browser
- [ ] ALL fields show sample data when toggle ON
- [ ] NO fields show field IDs when toggle ON
- [ ] Committed changes to git

---

## 🚀 Ready to Start?

**Your assignment:**
- Pages: [SPECIFY PAGE RANGE]
- Total missing fields: [SPECIFY COUNT]
- Source images: `/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/doc-page-images/Page-X.png`

**Start with Step 1: Read your page image and extract all visible data.**

Good luck!
