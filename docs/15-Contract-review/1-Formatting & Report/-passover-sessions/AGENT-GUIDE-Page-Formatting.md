# Agent Guide: Report Page Formatting

**Project:** APR Dashboard v3 - Report Builder HTML Template Migration
**Task:** Format pages from Word document into clean HTML with field mapping
**Last Updated:** 2024-12-16
**Current Status:** Pages 3-39 complete ✅ | Pages 40-77 in progress

---

## 🎯 Mission

Convert pages from the reference Word document into properly formatted HTML pages that:
1. Match the existing visual style (pages 3-39)
2. Use the master CSS stylesheet
3. Map all dynamic content to `{{Field_ID}}` placeholders
4. Fit within strict 11-inch page height (WYSIWYG preview)
5. Include consistent footer styling with **visual overlap alarm**

---

## ⚠️ CRITICAL: Understanding Page Numbers

**IMPORTANT:** When referring to page numbers, we ALWAYS mean the **footer page number** on the actual document page, NOT file names or screenshot numbers.

### The Confusion:
- The PDF/Word document has cover pages and front matter
- **Document page numbering starts around page 3-4** of the PDF file
- Screenshot files may be named differently than document page numbers
- File: "Page 1.png" might be a cover page, NOT document page 1

### How to Identify the Correct Page:

**✅ CORRECT - Use Footer Page Number:**
```html
<div class="page-footer">
    <div><span class="page-num">14</span> <!-- THIS IS DOCUMENT PAGE 14 -->
```
When user says "document page 14", find the page with `<span class="page-num">14</span>` in the footer.

**❌ WRONG - Using File Name:**
- File name: "Page-14.png" ≠ Document page 14
- PDF page 14 ≠ Document page 14
- Screenshot order ≠ Document page order

### Examples:

**User says:** "Check document page 14"
**You should:** Search for `<span class="page-num">14</span>` in the HTML
**Don't:** Look for file "Page 14.png" or PDF page 14

**User says:** "Footer missing on pages 13-16"
**You should:** Find pages with footer numbers 13, 14, 15, 16
**Don't:** Look at the 13th-16th files in the folder

### Quick Reference Command:
```bash
# Find document page 14 in HTML
grep '<span class="page-num">14</span>' PREVIEW-Master.html
```

---

## 📋 Current Progress

**Completed Pages (3-39):**
- Pages 3-7: Letter of Transmittal, Limiting Conditions, TOC, Property Overview
- Pages 8-12: Hypothetical Conditions, Photo grids (25 photos)
- Pages 13-18: Maps (Regional/Local/Aerial), Property ID, Sales History, Exposure Time
- Pages 19-25: Market Analysis sections
- Pages 26-32: Property Analysis, Zoning, Site details
- Pages 33-39: Improvements, Condition, Building details

**Next Batch (40-77):** Current assignment

**⚠️ BATCH SIZE LIMIT: 5-7 pages per session**
- Do NOT attempt to format more than 7 pages in one batch
- Small batches = faster review cycles and better quality control
- Example: Format pages 40-45 (6 pages), then append, commit, and request review
- After review approval, proceed with next batch (pages 46-52)

---

## 🏗️ HTML Structure Reference

### Page Anatomy

Every page follows this structure:

```html
<div class="page-sheet" data-page-num="Page 40">
    <!-- Page Header (if needed) -->
    <div class="Header1">Section Name</div>

    <!-- Page Content -->
    <div class="Header2">SUBSECTION NAME</div>

    <div class="Subheader1">Detail Section</div>
    <p>
        Content with <span class="field-mapped" title="{{Field_ID}}">{{Field_ID}}</span> mapping.
    </p>

    <!-- Tables (if applicable) -->
    <table>
        <tr>
            <td class="label-col">Label</td>
            <td class="value-col">
                <span class="field-mapped" title="{{Field_Value}}">{{Field_Value}}</span>
            </td>
        </tr>
    </table>

    <!-- Page Footer (REQUIRED ON EVERY PAGE) -->
    <div class="page-footer">
        <div>
            <span class="page-num">40</span>
            <span class="field-mapped" title="{{Subject_Street}}">{{Subject_Street}}</span> |
            File <span class="field-mapped" title="{{Company_JobNumber}}">{{Company_JobNumber}}</span>
        </div>
        <div class="footer-accent"></div>
    </div>
</div>
```

### Example: Full Page with Content

```html
<div class="page-sheet" data-page-num="Page 40">
    <div class="Header1">Highest & Best Use Analysis</div>
    <div class="Header2">AS THOUGH VACANT</div>

    <div class="Subheader1">Legal Permissibility</div>
    <p>
        The subject site is zoned
        <span class="field-mapped" title="{{Subject_Zoning}}">{{Subject_Zoning}}</span>
        which permits
        <span class="field-mapped" title="{{Subject_PermittedUses}}">{{Subject_PermittedUses}}</span>.
    </p>

    <div class="Subheader1">Physical Feasibility</div>
    <table>
        <tr>
            <td class="label-col">Site Area</td>
            <td class="value-col">
                <span class="field-mapped" title="{{Subject_SiteArea}}">{{Subject_SiteArea}}</span>
            </td>
        </tr>
        <tr>
            <td class="label-col">Topography</td>
            <td class="value-col">
                <span class="field-mapped" title="{{Subject_Topography}}">{{Subject_Topography}}</span>
            </td>
        </tr>
    </table>

    <div class="page-footer">
        <div>
            <span class="page-num">40</span>
            <span class="field-mapped" title="{{Subject_Street}}">{{Subject_Street}}</span> |
            File <span class="field-mapped" title="{{Company_JobNumber}}">{{Company_JobNumber}}</span>
        </div>
        <div class="footer-accent"></div>
    </div>
</div>
```

---

## 🎨 Master CSS Stylesheet

**DO NOT include the `<style>` tags or CSS in your output.**
Just reference these classes in your HTML. The master file already has this CSS.

### Key CSS Classes:

```css
/* Page container with ABSOLUTE FOOTER method */
.page-sheet {
    height: 11in; /* STRICT - Pages cannot grow */
    padding: 0.75in;
    padding-bottom: 180px; /* Reserves space for footer */
    position: relative;
    overflow: hidden; /* Content overflow gets clipped */
}

.Header1 {
    font-size: 18pt;
    color: #003B7E;
    border-bottom: 1px solid #003B7E;
    padding-bottom: 5px;
    margin-bottom: 12px;
}

.Header2 {
    font-size: 12pt;
    color: #003B7E;
    font-weight: bold;
    text-transform: uppercase;
    margin-top: 12px;
    margin-bottom: 6px;
}

.Subheader1 {
    font-size: 11pt;
    color: #003B7E;
    font-weight: bold;
    text-transform: uppercase;
    margin-top: 10px;
    margin-bottom: 4px;
}

.field-mapped {
    background-color: rgba(255, 255, 0, 0.15); /* Yellow highlight */
    border-bottom: 1px dotted #999;
    cursor: help;
}

/* ABSOLUTE FOOTER - Always visible at bottom */
.page-footer {
    position: absolute;
    bottom: 0.75in;
    left: 0.75in;
    right: 0.75in;
    padding-top: 15px;
    border-top: 1px solid #ccc;
    background-color: white; /* Solid background */
    z-index: 10; /* Stays on top of content */
}

.footer-accent {
    width: 60px;
    height: 10px;
    background: linear-gradient(to right, #4a9fd8, #003d7a);
    border-radius: 2px;
}

.page-num {
    color: #003B7E;
    font-weight: bold;
    margin-right: 15px;
}

table {
    margin-bottom: 10px;
    border-collapse: collapse;
}

td, th {
    padding: 4px 8px;
    border: 1px solid #ddd;
}

.label-col {
    background-color: #f0f0f0;
    font-weight: bold;
    width: 35%;
}

.value-col {
    width: 65%;
}
```

### Spacing Guidelines (IMPORTANT):
- Moderate spacing (not too tight, not too loose)
- Headers: 12px margins
- Subheaders: 10px top, 4px bottom
- Paragraphs: 8pt spacing
- Tables: 10px bottom margin
- **Content must fit in 11 inches!** If content overlaps footer, it's too long.

---

## 🏷️ Field Mapping Rules

**⚠️ CRITICAL PHASE REQUIREMENT:** Identifying and mapping ALL field IDs is a PRIMARY objective of this formatting work. This is not optional - every dynamic content item must be mapped to a field ID.

### Why Field Mapping is Critical:

1. **Data Binding:** Field IDs connect HTML template to React editor inputs
2. **User Editing:** Every field ID becomes an editable input in the dashboard
3. **Report Generation:** Field IDs are replaced with actual data when generating reports
4. **Completeness:** Missing field IDs = broken functionality in production

**Your responsibility:** Identify EVERY piece of dynamic content and assign appropriate field IDs.

### Format:
```html
<span class="field-mapped" title="{{Field_ID}}">{{Field_ID}}</span>
```

### Field ID Reference Files (SOURCE OF TRUTH):

**Location:** `/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/2-Field Management/`

**Before creating new field IDs:**
1. Check existing field mapping files in Field Management directory
2. Look for similar fields in pages 3-39 (PREVIEW-Master.html)
3. Follow existing naming patterns
4. Only create NEW field IDs if no suitable match exists

**If uncertain about a field ID:**
1. ✅ Check Field Management directory files first
2. ✅ Search PREVIEW-Master.html for similar content
3. ✅ Create a **"Unknown Field IDs"** list in your delivery notes
4. ✅ Propose descriptive field names following the convention below
5. ❌ DON'T skip field mapping (better to have a tentative ID than none)
6. ❌ DON'T use generic names like "Field1", "Text1" (use descriptive names)

### Common Field IDs:

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

### Field Naming Convention:
1. Use **PascalCase** (e.g., `Subject_Street`, not `subject_street`)
2. Use **descriptive names** (e.g., `Market_SupplyTrend`, not `mkt_sup`)
3. Match existing patterns from pages 3-39
4. **Check the master field ID document** if unsure

### What to Map:
✅ **Map these:**
- Property addresses, names, descriptions
- Dates, numbers, measurements
- Owner/client names
- Market data, valuations
- Any user-editable content

❌ **Don't map these:**
- Section headers ("Introduction & Executive Summary")
- Static labels in tables ("Property Type", "Legal Description")
- Boilerplate text (standard disclaimers, definitions)
- Instructional text

---

## 📂 File Organization & Structure

**Three-Tier Folder System:**

The project uses a logical three-tier structure from source images → single HTML pages → formatted batches:

```
REPORT Pg Img/
├── doc-page-images/              ← TIER 1: Source screenshots (renamed)
│   ├── -a-cover.png              (Front matter - no page numbers)
│   ├── -b-conditions.png
│   ├── -c-letter.png
│   ├── -d-table-contents.png
│   └── Page-01.png → Page-74.png (Numbered document pages)
│
├── Img-doc-pages/                ← RAW: Original screenshots (needs renaming)
│   └── Ref.Report-VAL251012-North Battleford Apt.docx.pdf - Page X of 79.png
│
└── doc-page-html/
    ├── doc-pages-html-single/    ← TIER 2: Individual page HTML files
    │   ├── -a-cover.html
    │   ├── -b-conditions.html
    │   ├── -c-letter.html
    │   ├── -d-table-contents.html
    │   └── Page-01.html → Page-74.html
    │
    └── doc-pages-html-formatted/  ← TIER 3: Batch files + PREVIEW-Master
        ├── Page-01-02 & B-D.html  (Combined front matter + pages 1-2)
        ├── Page-08-12.html        (Batch: pages 8-12)
        ├── Page-19-25.html        (Batch: pages 19-25)
        └── PREVIEW-Master.html    (Complete compiled preview)
```

**File Naming Convention (Established):**
- **Front matter:** `-a-cover`, `-b-conditions`, `-c-letter`, `-d-table-contents`
- **Numbered pages:** `Page-01` through `Page-74` (two-digit padding)
- **Batch files:** `Page-XX-XX.html` (page range based on footer numbers)

---

## 📄 Source Material

**Screenshot Images (Source of Truth):**
`/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/doc-page-images/`

**Images to use:**
- Front matter: `-a-cover.png`, `-b-conditions.png`, `-c-letter.png`, `-d-table-contents.png`
- Numbered pages: `Page-01.png` through `Page-74.png`

**Important:** Page numbers on images (footer numbers) are the authoritative source. Always verify the footer number on the screenshot matches your assigned page.

**Master Field ID Document:**
Check `/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/2-Field Management/` for field registry reference.

---

## 📐 WYSIWYG Requirements (CRITICAL)

### The Dual-Layer Defense Strategy

We use a two-layer approach to prevent layout overflow:

**Layer 1: Input Character Limits (Future - Prevention)**
- React editor will have character limits per field
- User sees "2800 / 2800 characters" counter
- Prevents 95% of overflow issues before they happen
- *(Implementation planned after pages 40-77 complete)*

**Layer 2: Visual Overlap Alarm (Current - Detection)**
- Footer absolutely positioned at bottom with `z-index: 10`
- If content is too long, it **overlaps the footer visibly**
- User can SEE the overlap = knows content needs adjustment
- Acts as safety net for edge cases

### The CSS Solution (Currently Implemented):

**Absolute Positioning Method:**
- Footer is **always visible** at bottom (position: absolute)
- Footer has white background and high z-index (stays on top)
- If content exceeds page capacity, content appears **behind footer**
- User sees overlap = visual alarm "too much content"

### What This Means for You:

1. **Content should fit in available space** (11 inches minus footer height)
2. **Test your pages:** If content overlaps footer, reduce content or adjust spacing
3. **Solutions if content overlaps footer:**
   - Reduce paragraph spacing (use inline `margin-bottom: 6pt`)
   - Split content across two pages
   - Use more compact table formatting
   - Remove unnecessary line breaks
   - Shorten text content (will be enforced by character limits later)

### Visual Feedback:

✅ **Footer visible, no overlap** = Page fits correctly
⚠️ **Content overlapping footer** = Content overflow, needs adjustment
🚨 **Footer completely covered** = Severe overflow, must reduce content

### Why This Approach is Better:

**Old approach (flexbox):**
- Footer would disappear when content too long
- No visual feedback = user doesn't know there's a problem

**Current approach (absolute positioning):**
- Footer always visible = marks page boundary
- Overlap is visual alarm = immediate feedback
- User sees problem and fixes it manually
- Combined with future character limits = 95%+ prevention

---

## 📦 Output Format

### File Structure:

Create HTML files for batch of 5-7 pages (e.g., `pg-40-45.html` for 6 pages)

**File structure:**
```html
<!-- NO <!DOCTYPE> or <html> tags -->
<!-- NO <head> or <style> tags -->
<!-- JUST the page content -->

<div class="page-sheet" data-page-num="Page 40">
    <!-- Page 40 content -->
    <div class="page-footer">...</div>
</div>

<div class="page-sheet" data-page-num="Page 41">
    <!-- Page 41 content -->
    <div class="page-footer">...</div>
</div>

<!-- ... more pages ... -->
```

### Save Location:
`/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/doc-page-html/doc-pages-html-formatted/`

**File naming:** Use page range with established convention (e.g., `Page-40-45.html`)

### What NOT to Include:
❌ `<!DOCTYPE html>`
❌ `<html>`, `<head>`, `<body>` tags
❌ `<style>` block (CSS is already in master)
❌ `<script>` tags
❌ Personal comments or notes

### What TO Include:
✅ Just the `<div class="page-sheet">` blocks (5-7 pages)
✅ Properly formatted HTML
✅ All field mappings with `class="field-mapped"`
✅ Footer on every page
✅ Correct page numbers in `data-page-num` and footer

### Delivery Notes (REQUIRED if applicable):

**If you created new field IDs or have uncertainties:**

Create a separate text block in your delivery with:
```
=== FIELD ID NOTES ===

New Field IDs Created:
- {{Building_MechanicalSystems}} - Used for HVAC/mechanical description on page 42
- {{Subject_ParkingRatio}} - Parking spaces per unit on page 45

Uncertain Field IDs (please verify):
- {{Subject_ElevatorCount}} - Might already exist as {{Building_Elevators}}?
- {{Market_RentalTrends}} - Could this be {{Market_RentTrend}} (singular)?

Questions:
- Page 47: Should "Maintenance History" be field-mapped or remain static text?
```

This helps with review and ensures no field mapping issues slip through.

---

## ✅ Quality Checklist

Before delivering your HTML, verify:

### Structure:
- [ ] Each page is wrapped in `<div class="page-sheet" data-page-num="Page X">`
- [ ] Every page has a footer with `<div class="page-footer">`
- [ ] Footer includes page number, address, file number
- [ ] Footer includes `<div class="footer-accent"></div>`

### Content:
- [ ] All dynamic content wrapped in `<span class="field-mapped" title="{{Field_ID}}">{{Field_ID}}</span>`
- [ ] Field IDs use PascalCase (e.g., `Subject_Street`)
- [ ] No hard-coded property-specific data (use field IDs instead)
- [ ] Static labels are NOT field-mapped

### Field Mapping (CRITICAL):
- [ ] **Every** piece of dynamic content has a field ID (no exceptions)
- [ ] Checked Field Management directory for existing field IDs
- [ ] Searched PREVIEW-Master.html for similar field patterns
- [ ] New field IDs follow naming conventions (Category_Description)
- [ ] Created "Field ID Notes" section if any uncertainties exist
- [ ] No generic field names like "Field1" or "Text1"
- [ ] Verified field IDs match content purpose (not just placeholders)

### Formatting:
- [ ] Headers use proper classes (Header1, Header2, Subheader1)
- [ ] Tables use label-col and value-col classes
- [ ] Paragraphs have proper spacing (8pt default)
- [ ] Content fits within available page space (no footer overlap)
- [ ] Footer is visible on all pages (not hidden behind content)

### Consistency:
- [ ] Style matches pages 3-39 (check PREVIEW-Master.html)
- [ ] Spacing is moderate (not too tight, not too loose)
- [ ] Color scheme matches (#003B7E for headers)
- [ ] Table formatting is consistent

### Technical:
- [ ] Valid HTML (no unclosed tags)
- [ ] No inline CSS (use classes instead)
- [ ] No DOCTYPE or html/head/body tags
- [ ] File named appropriately with page range (e.g., `pg-40-45.html`)
- [ ] Batch size is 5-7 pages (not more, not less)

---

## 🔄 Workflow After Delivery

**YOU are responsible for completing Steps 1-3. This is not optional.**

**⚠️ BATCH SIZE: Format only 5-7 pages per session, then request review.**

### Step 1: Create Your HTML File

Create a batch file with your formatted pages (e.g., `pg-40-45.html` for pages 40-45) containing just the page-sheet divs.

**Batch size:**
- Minimum: 5 pages
- Maximum: 7 pages
- Recommended: 6 pages for consistent batching

### Step 2: Append to PREVIEW-Master.html

**⚠️ CRITICAL:** You must append your pages to the master file yourself.

**Location:** `/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/doc-page-html/doc-pages-html-formatted/PREVIEW-Master.html`

**⚠️ BACKUP EXISTS:** A backup file (`PREVIEW-Master.BACKUP-YYYYMMDD-HHMMSS.html`) is created automatically to protect against accidental deletion.

**How to append:**

1. **Read the end of PREVIEW-Master.html** to find where to insert
2. **Look for the last page-sheet closing tag** `</div>` before the closing `</body>`
3. **Insert your pages BEFORE** the `</body></html>` tags

**Example workflow:**
```bash
# 1. Find insertion point (look for last page-sheet div)
tail -20 PREVIEW-Master.html

# 2. You'll see something like:
#     </div>  <!-- End of last existing page -->
#
#     </body>
#     </html>

# 3. Insert your pages BEFORE </body>
# Use the Edit tool to add your pages at the correct location
```

**Verification after appending:**
- Check that your pages appear before `</body></html>`
- Verify no duplicate page numbers
- Ensure proper closing tags
- Check that file still has valid HTML structure

### Step 3: Commit Your Changes

After appending to PREVIEW-Master.html, commit to git:

```bash
cd "/Users/bencrowe/Development/APR-Dashboard-v3"
git add "docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/html-pages/New Formated/PREVIEW-Master.html"
git commit -m "Add pages 40-45 to preview master (6 pages)

- Formatted pages 40-45 from reference document
- Field mapped all dynamic content
- Footer visible on all pages
- [Add any field ID notes here]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

### Step 4: Request Review

**⚠️ STOP HERE - Do not continue to next batch without review approval.**

1. **Announce completion:** "Pages 40-45 (6 pages) have been formatted, appended to PREVIEW-Master.html, and committed. Ready for review."
2. **Provide summary:**
   - Pages completed: 40-45
   - Total pages in batch: 6
   - Field ID notes (if any)
   - Any issues or concerns encountered
3. **Wait for user review:** User will open browser and review the preview
4. **User checks:**
   - Footer overlap on all pages
   - Field ID completeness
   - Visual formatting consistency
   - Content accuracy
5. **Iterate if needed:** Make refinements based on feedback before next batch

### Step 5: Repeat for Next Batch

**Only after receiving user approval**, continue with next set of 5-7 pages using the same workflow.

Example progression:
- Batch 1: Pages 40-45 (6 pages) → Review → Approved ✅
- Batch 2: Pages 46-52 (7 pages) → Review → Approved ✅
- Batch 3: Pages 53-58 (6 pages) → Review → Approved ✅

---

## 📝 Why This Workflow Works

### Small Batch Size (5-7 pages):
- **Fast feedback:** Issues caught early before propagating
- **Quality control:** User reviews while content is fresh
- **Token efficiency:** Smaller corrections, not rewriting large sections
- **Manageable scope:** Clear start/end points for each session

### You Do Steps 1-3 (Not Me):

**Efficiency:**
- Reduces token usage significantly
- You can append pages directly without back-and-forth
- Faster iteration cycle within each batch

**Learning:**
- If you make mistakes, we refine this guide
- Guide becomes better SOP (Standard Operating Procedure)
- Enables spawning sub-agents to work independently
- Small batches = small mistakes = easy fixes

**Responsibility:**
- You own the entire delivery: format → append → commit → request review
- Quality control happens at review step
- Clear accountability for each batch
- User approves before you proceed to next batch

---

## 💡 Tips & Best Practices

### Content Fitting:
- Start with first page, check for footer overlap
- If overlap occurs, reduce spacing before moving to next page
- Use reference PDF to gauge content density
- Remember: footer overlap = visual alarm, not failure

### Field Mapping:
- When in doubt, map it (better to have extra fields than missing ones)
- Use descriptive field names that match the content
- Check existing pages for similar content patterns

### Tables:
- Keep table rows compact (4px vertical padding)
- Use label-col for left column (35% width)
- Use value-col for right column (65% width)
- Map all data cells, not label cells

### Common Patterns:

**Property Description:**
```html
<p>
    The subject property, located at
    <span class="field-mapped" title="{{Subject_Street}}">{{Subject_Street}}</span>,
    <span class="field-mapped" title="{{Subject_City}}">{{Subject_City}}</span>,
    is a <span class="field-mapped" title="{{Subject_Primary}}">{{Subject_Primary}}</span>
    with <span class="field-mapped" title="{{Subject_NRA}}">{{Subject_NRA}}</span> square feet.
</p>
```

**Data Table:**
```html
<table>
    <tr>
        <td class="label-col">Property Type</td>
        <td class="value-col">
            <span class="field-mapped" title="{{Subject_Primary}}">{{Subject_Primary}}</span>
        </td>
    </tr>
    <tr>
        <td class="label-col">Total Units</td>
        <td class="value-col">
            <span class="field-mapped" title="{{Subject_Units}}">{{Subject_Units}}</span>
        </td>
    </tr>
</table>
```

---

## 📞 Questions?

If you encounter:
- **Unclear content:** Use best judgment, we'll refine in review
- **Missing field IDs:** Create descriptive names following the pattern
- **Content overlap:** Try reducing spacing first, then ask
- **Formatting questions:** Check pages 3-39 in PREVIEW-Master.html

---

## 🎯 Success Criteria

Your pages are successful when:
1. ✅ Content fits within available page space (no excessive footer overlap)
2. ✅ Visual style matches pages 3-39
3. ✅ All dynamic content is field-mapped
4. ✅ Footer on every page with correct page numbers
5. ✅ HTML is clean and valid
6. ✅ File saved in correct location with appropriate name

---

## 📚 Related Documentation

- **Footer Strategy:** See `formatting-fixed pg brakes.md` for absolute positioning rationale
- **Character Limits:** See `Formatting-defined-input.md` for Layer 1 prevention strategy
- **WYSIWYG Notes:** See `formatting-notes.md` and `formatting-note-2.md` for evolution of approach

---

**Ready to start? Format your assigned pages and deliver clean HTML!**

**Good luck! 🚀**
