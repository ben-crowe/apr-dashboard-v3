# Templates & Guides Folder

**Purpose:** Reusable HTML templates and documentation for building APR report pages
**Created By:** Claude Code AI Agent (in collaboration with Ben Crowe)
**Last Updated:** December 17, 2025
**Status:** Active - Templates in use for Pages 59-77

---

## 📁 Files in This Folder

### 1. **template-comparable-page.html**
**Type:** HTML Template
**Use For:** Comparable property detail pages (Sales Summary Sheets)
**Pages Using This Template:** 54-58 (current), 59+ (upcoming)

**Features:**
- 2-column layout (48% left tables, 48% right photo/map/remarks)
- Ultra-compact spacing (7-8pt font, tight padding)
- Field mapping pattern: `{{Comp#_FieldName}}`
- Scoped CSS with placeholder: `.page-sheet[data-page-num="Page {PAGE_NUM}"]`

**⚠️ UPDATE REQUIRED:**
This template contains the **OLD DESIGN** with:
- ❌ Table grid lines (`border: 1px solid #ddd`)
- ❌ Gray background on label cells (`background-color: #f9f9f9`)
- ❌ Smaller property photo (200px height)
- ❌ Stacked address and map layout

**NEW DESIGN** (implemented in Pages 54-58, December 17, 2025):
- ✅ No table borders (`border: none`)
- ✅ No background colors on cells
- ✅ Larger property photo (280px height)
- ✅ Side-by-side address and map layout (38% / 58% split)
- ✅ Uses `.address-map-wrapper` flexbox container

**Action Needed:** Update this template to match Pages 54-58 before using for Pages 59+

---

### 2. **template-comparison-table-chart.html**
**Type:** HTML Template
**Use For:** Comparison tables with analysis charts (e.g., Capitalization Rate analysis)
**Pages Using This Template:** 47 (current implementation)

**Features:**
- Borderless comparison table (COMP 1-5 columns)
- Compact font sizing (7.5pt data, 8.5pt summaries)
- Capitalization Rate summary section (HIGH/AVERAGE/LOW)
- Centered chart with dual Y-axes (dollars + percentages)
- Gray gridlines and separator lines
- Responsive spacing (table to chart: 44px)
- Field mapping pattern: `{{COMP_#_FieldName}}`, `{{CapRate_*}}`

**Design Specifications:**
- Table: No borders, transparent label column, left-aligned headers
- Chart: 490px centered wrapper, 180px tall, 24px bars, brand blue (#003B7E)
- Spacing: 12px after headers, 14px before Cap Rate, 44px to chart
- Lines: 1px gray (#ccc) under headers/Cap Rate, 2px under LOW/bottom

**Status:** ✅ Production-ready (based on Page 47, December 17, 2025)

---

### 3. **template-map-page.html**
**Type:** HTML Template
**Use For:** Location map pages showing all comparables on one map
**Pages Using This Template:** 53 (Comparable Locations Map)

**Features:**
- Full-width map container (650px height)
- Comparables list table with location details
- Clean design with minimal chrome
- Scoped CSS with placeholder: `.page-sheet[data-page-num="Page {PAGE_NUM}"]`

**Status:** ✅ Current and ready to use

---

### 4. **AGENT-GUIDE-Page-Formatting.md**
**Type:** Documentation
**Audience:** AI Agents (orchestrators and sub-agents)

**Purpose:**
- Complete workflow for converting Word document pages to HTML
- Step-by-step instructions for field mapping
- Quality control checkpoints
- Footer overlap detection rules
- Multi-agent orchestration patterns

**Key Sections:**
- Mission and objectives
- Orchestrator agent responsibilities
- Page formatting workflow (5 steps)
- Field mapping patterns
- Footer height calculations
- Common pitfalls and solutions

**Status:** ✅ Comprehensive and actively used

---

### 5. **GUIDE-Template-Usage.md**
**Type:** Documentation
**Audience:** Developers and AI Agents

**Purpose:**
- Best practices for using the HTML templates
- Template application workflow
- Common issues and troubleshooting
- Field mapping conventions

**Key Sections:**
- Available templates catalog
- Template application workflow
- Placeholder replacement guide
- Field mapping patterns
- Testing and validation steps

**Status:** ✅ Current and ready to use

**Note:** Should be updated to reference the new comparable page design once `template-comparable-page.html` is updated

---

### 6. **Comparables Pg.png**
**Type:** Reference Image
**Format:** PNG Screenshot

**Purpose:**
- Visual reference for comparable page layout
- Shows expected spacing, table structure, and overall design
- Used for validation during page creation

**Contents:**
- Example comparable property page
- Shows OLD design with grid lines (pre-December 17, 2025)

**Note:** This image shows the previous design. Current design (Pages 54-58) has cleaner tables without grid lines and side-by-side address/map layout

---

## 🔄 Current Workflow Status

### Completed Pages
- ✅ **Pages 1-58** - Formatted, optimized, and in PREVIEW-Master.html
- ✅ **Pages 54-58** - Updated to NEW comparable design (December 17, 2025)

### Next Steps
1. **Update template-comparable-page.html** to match new design from Pages 54-58
2. **Continue with Page 59** using updated template
3. **Format Pages 60-77** one at a time using templates

---

## 📝 Template Usage Instructions

### For Comparable Pages (54-58, 59+)

**Step 1:** Copy `template-comparable-page.html` (after it's updated)

**Step 2:** Replace placeholders:
- `{PAGE_NUM}` → Actual page number (e.g., "59")
- `{COMP_NUM}` → Comparable number (e.g., "6")
- `{PROPERTY_NAME}` → Property name (e.g., "Riverside Apartments")

**Step 3:** Update field mappings:
- Pattern: `{{Comp#_FieldName}}`
- Example: `{{Comp6_Buyer}}`, `{{Comp6_SalePrice}}`, etc.

**Step 4:** Verify layout:
- Check that tables fit in left column (48%)
- Confirm photo/map/remarks fit in right column (48%)
- Test that page height doesn't exceed 1056px

**Step 5:** Add to PREVIEW-Master.html with proper page breaks

---

### For Map Pages

**Step 1:** Copy `template-map-page.html`

**Step 2:** Replace placeholders:
- `{PAGE_NUM}` → Actual page number
- `{MAP_TITLE}` → Map title (e.g., "Comparable Locations Map")

**Step 3:** Update field mappings for map and comparables list

**Step 4:** Add to PREVIEW-Master.html

---

## ⚙️ Design Evolution Log

### December 17, 2025 - Page 47 Comparison Table & Chart Redesign
**Changed By:** Claude Code AI Agent & Ben Crowe

**Changes:**
1. Removed all table borders for clean, modern appearance
2. Made label column transparent (no gray background)
3. Left-aligned COMP headers (instead of centered)
4. Added light gray separator line under headers (1px #ccc)
5. Reduced data row font to 7.5pt for better density
6. Added spacing: 12px after headers, 14px before Cap Rate section
7. Tightened HIGH/LOW positioning (2px padding-top)
8. Created compact, centered chart (490px wrapper instead of full width)
9. Increased chart height (140px → 180px)
10. Changed gridlines to light gray (#ccc)
11. Positioned chart labels below bottom gridline
12. Increased table-to-chart spacing (36px → 44px)
13. Centered summary text below chart

**Affected Pages:** 47
**Template Created:** `template-comparison-table-chart.html`

**Reason:** User provided feedback for cleaner design with better spacing, borderless tables, and properly positioned chart elements

---

### December 17, 2025 - Comparable Page Redesign
**Changed By:** Claude Code AI Agent & Ben Crowe

**Changes:**
1. Removed all table grid lines for cleaner appearance
2. Removed gray background colors from table cells
3. Increased property photo from 200px to 280px height
4. Changed address/map layout from stacked to side-by-side
5. Added `.address-map-wrapper` flexbox container (38% address, 58% map)

**Affected Pages:** 54, 55, 56, 57, 58
**Template Status:** ⚠️ Not yet updated - use Pages 54-58 as reference

**Reason:** User provided screenshot showing cleaner design without grid lines and better use of space for larger photos

---

## 🤖 AI Agent Notes

### When to Use Templates
- ✅ When creating new pages with similar structure to existing pages
- ✅ When consistency is critical (all comparable pages should match)
- ✅ When you want to avoid reinventing CSS and layout

### When NOT to Use Templates
- ❌ When page structure is unique (e.g., cover pages, charts, narrative sections)
- ❌ When working with pages 1-53 (already complete)
- ❌ When template doesn't match current design standards

### Template Maintenance
- Always check if template matches latest implemented pages
- Update templates when design patterns change
- Document design evolution in this README
- Keep reference images updated

---

## 📞 Questions?

If you're an AI agent working on this project:
1. Read `AGENT-GUIDE-Page-Formatting.md` for complete workflow
2. Read `GUIDE-Template-Usage.md` for template best practices
3. Check Pages 54-58 in PREVIEW-Master.html for current design reference
4. Update templates BEFORE using them for new pages

---

**Maintained By:** Claude Code AI Agent
**Project:** APR Dashboard v3 - Report Builder
**Location:** `/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/Templates & Guides`
