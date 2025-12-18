# Team Workflow & Standard Operating Procedures

**Last Updated:** 2025-12-18
**Status:** Active

---

## 🎯 TEAM STRUCTURE & ROLES

### Agent 1: Claude Code (Report Builder & HTML Integration)
**You are reading this.**

**Responsibilities:**
- ✅ Add pages to PREVIEW-Master.html template
- ✅ Adjust HTML spacing/margins to fit page size (816px × 1056px)
- ✅ Ensure previewer works correctly
- ✅ Work with user on field mapping IDs (HTML→Registry mapping)
- ✅ Create field mapping documentation (FIELD-MAPPING-Page-XX-Registry.md)
- ✅ Update TABLE-OF-CONTENTS with progress
- ✅ Coordinate with user on Page-by-Page updates

**NOT Your Responsibility:**
- ❌ Working directly in fieldRegistry.ts (registry modifications)
- ❌ TypeScript/React component changes in src/
- ❌ Calculation engine implementation

---

### Agent 2: TypeScript Pro Specialist (Field Registry Manager)
**Handles:** `src/features/report-builder/schema/fieldRegistry.ts`

**Responsibilities:**
- ✅ Add/modify fields in fieldRegistry.ts
- ✅ Ensure field type definitions are correct
- ✅ Verify field IDs match registry standards
- ✅ Handle calculation engine field requirements

**Coordination:**
- User provides field lists from field mapping docs
- TypeScript Pro adds fields to registry
- Reports back field IDs for HTML mapping

---

### Agent 3: Claude Desktop (HTML Generation from Images)
**Tool:** Dedicated Claude Desktop project for page generation

**Responsibilities:**
- ✅ Convert page images (PNG/PDF) to HTML
- ✅ Match styling from reference PDF
- ✅ Generate clean, structured HTML with field placeholders
- ✅ Provide HTML snippets to user for integration

**Workflow:**
- User uploads page image
- Claude Desktop generates HTML markup
- User reviews and provides to Agent 1 (you)

---

### User (Ben - Project Coordinator)
**Responsibilities:**
- ✅ Identify pages needing updates (compare to reference PDF)
- ✅ Coordinate between all three agents
- ✅ Provide page images to Claude Desktop for HTML generation
- ✅ Deliver HTML to Agent 1 for template integration
- ✅ Provide field mapping requirements to TypeScript Pro
- ✅ Test previewer and validate page rendering

---

## 📋 STANDARD WORKFLOWS

### Workflow 1: Adding/Updating a Page (Pages 1-77)

**When:** User identifies a page that doesn't match goal report PDF

**Process:**

1. **User → Claude Desktop:**
   - User uploads page image to Claude Desktop project
   - Claude Desktop generates HTML markup
   - User receives HTML snippet

2. **User → Agent 1 (You):**
   - User provides HTML snippet
   - User specifies page number to update

3. **Agent 1 (You) Actions:**
   ```bash
   # Step 1: Read current page HTML (if updating)
   # Find page location in PREVIEW-Master.html
   grep -n "<!-- Page XX:" PREVIEW-Master.html

   # Step 2: Insert/replace HTML at correct location
   # Use Edit tool to replace old HTML with new HTML

   # Step 3: Adjust spacing to fit page size
   # Page specs: 816px width × 1056px height
   # Method: Reduce padding/margins if content overflows
   # Pattern: padding: 54px → 48px → 42px (reduce gradually)

   # Step 4: Test in browser (user does this)
   # User opens /preview-master and checks Page XX

   # Step 5: Iterate if needed
   # User: "Content still overflowing"
   # You: Further reduce padding or adjust font sizes

   # Step 6: Commit when complete
   git add PREVIEW-Master.html
   git commit -m "feat(page-XX): update HTML from Claude Desktop generation

   - Replaced HTML with new markup from image source
   - Adjusted padding from 54px to 48px for fit
   - Verified field placeholders present"
   ```

4. **Verification:**
   - User refreshes browser and checks page
   - Confirms page fits within dimensions
   - Confirms field placeholders are visible

---

### Workflow 2: Field Mapping Coordination

**When:** Working on field mapping for a specific page/table

**Process:**

1. **Agent 1 (You) → User:**
   - You identify fields in HTML (extract from PREVIEW-Master.html)
   - You create initial field mapping document: `FIELD-MAPPING-Page-XX-Registry.md`
   - Document shows: HTML Field ID → Registry Field ID → Valcre Source
   - Mark fields as ☐ Need Verification if unsure about registry ID

2. **User → TypeScript Pro:**
   - User shares field mapping document
   - TypeScript Pro verifies which fields exist in registry
   - TypeScript Pro adds missing fields to fieldRegistry.ts
   - TypeScript Pro reports back with actual field IDs

3. **User → Agent 1 (You):**
   - User shares verified field IDs
   - You update field mapping document with confirmed IDs
   - Mark fields as ✅ Verified

4. **Documentation:**
   ```markdown
   # FIELD-MAPPING-Page-49-Registry.md

   ## TABLE 1: Unit Mix & Rental Revenue
   | HTML Field ID | Registry Field ID | Type | Input Source | Status |
   |---------------|-------------------|------|--------------|--------|
   | {{Unit_Type_1_Count}} | calc-type1-count | number | user-input | ✅ |
   | {{Unit_Type_1_Rent}} | calc-type1-rent | currency | user-input | ✅ |
   | {{Unit_Type_1_Annual}} | calc-type1-annual | currency | calculated | ☐ Verify |
   ```

5. **Update TABLE-OF-CONTENTS:**
   - Add entry to Registry Mapping Status table
   - Update status from 🔄 In Progress to ✅ Complete

---

### Workflow 3: Page Spacing Adjustment (Critical Skill)

**When:** HTML content overflows page boundaries (816px × 1056px)

**Page Dimensions:**
- Width: 816px (US Letter width at 96 DPI)
- Height: 1056px (US Letter height at 96 DPI)
- Standard padding: 54px (reduces content area to ~708px × 948px)

**Adjustment Strategy:**

```html
<!-- BEFORE: Content overflowing -->
<div class="page page-49" style="width: 816px; height: 1056px; padding: 54px;">
  <!-- Table with 20 rows causes overflow -->
</div>

<!-- AFTER: Reduce padding -->
<div class="page page-49" style="width: 816px; height: 1056px; padding: 48px;">
  <!-- Same table now fits -->
</div>
```

**Adjustment Hierarchy (Try in Order):**

1. **Reduce padding:** 54px → 48px → 42px → 36px
   - Affects all content equally
   - Maintains readability

2. **Reduce margins on internal elements:**
   ```css
   .page-XX h2 { margin-bottom: 12px; } /* was 16px */
   .page-XX table { margin-bottom: 16px; } /* was 20px */
   ```

3. **Reduce line-height:**
   ```css
   .page-XX p { line-height: 1.4; } /* was 1.6 */
   ```

4. **Reduce font-size (LAST RESORT):**
   ```css
   .page-XX body { font-size: 10px; } /* was 11px */
   ```

**Never Do:**
- ❌ Cut content to make it fit
- ❌ Let content overflow into next page
- ❌ Remove field placeholders
- ❌ Change page dimensions (must stay 816×1056)

**Testing:**
- User opens `/preview-master` in browser
- User scrolls to Page XX
- User visually confirms no overflow
- User checks bottom margin has space (~36px minimum)

---

## 📂 FILE LOCATIONS & TEMPLATES

### Master HTML Template
```
/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/-Template-Master Doc Previewer/PREVIEW-Master.html
```

**Current Status:**
- 72 pages complete (Pages 1-72)
- Line count: ~7,513 lines
- File size: ~560KB

**Structure:**
```html
<!DOCTYPE html>
<html>
<head>
  <title>APR Report Preview - Master Template</title>
  <style>
    /* Global styles */
  </style>
</head>
<body>
  <!-- Page 1: Title Page -->
  <div class="page page-1" style="width: 816px; height: 1056px; ...">
    ...
  </div>

  <!-- Page 2: Executive Summary -->
  <div class="page page-2" style="width: 816px; height: 1056px; ...">
    ...
  </div>

  <!-- ... Pages 3-72 ... -->
</body>
</html>
```

---

### Field Mapping Documents
```
/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/-Template-Master Doc Previewer/FIELD-MAPPING-Page-XX-Registry.md
```

**Pattern:** One document per table (per-table mapping pattern)

**Example Files:**
- `FIELD-MAPPING-Page-49-Registry.md` - Direct Capitalization (80 fields) ✅
- `FIELD-MAPPING-Page-59-Registry.md` - Sales Comparison Grid (105 fields) 🔄 Next

**Template Structure:**
```markdown
# Page XX: [Table Name] - HTML to Registry Field Mapping

## TABLE 1: [Section Name] (N fields)
| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| {{FieldName}} | registry-field-id | type | source | SHEET!CELL | ✅/☐ |

## Summary Statistics
| Section | HTML Fields | Registry Fields | Verified | Need Review |
|---------|-------------|-----------------|----------|-------------|
| Table 1 | N | N | N | N |
```

---

### Documentation Chain
```
Calc-eng Field Map.md → fieldRegistry.ts → FIELD-MAPPING-Page-XX-Registry.md → PREVIEW-Master.html
(What to calculate)   (Registry defs)   (HTML mapping)                        (Template)
```

**Master Calculation Reference:**
```
/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/-Template-Master Doc Previewer/Calc-eng Field Map.md
```

**Registry Definitions:**
```
/Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/schema/fieldRegistry.ts
```

---

### Progress Tracking
```
/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/-Template-Master Doc Previewer/TABLE-OF-CONTENTS-25.12.18.md
```

**Contains:**
- Complete page index (Pages 1-72)
- Registry mapping status per table
- Field counts per page
- Priority levels for field mapping work

---

### Session Handoffs
```
/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/-Template-Master Doc Previewer/-passover-sessions/
```

**Files:**
- `-Handoff-25.12.18.md` - Evergreen project status (always current)
- `25.12.18-2 - Pages-65-72-Field-Mapping.md` - Session 2 summary
- `25.12.18-3 - Field-Registry-Calc-Engine-Docs.md` - Session 3 summary

---

## 🚨 CRITICAL RULES

### What Agent 1 (You) MUST Do:
✅ **Always use exact HTML provided by user** - Do not modify structure unless asked
✅ **Cross-reference page numbers** - Verify you're updating correct page
✅ **Test spacing before committing** - Ask user to check in browser first
✅ **Commit atomically** - One page or logical change per commit
✅ **Update field mapping docs** - Document all field IDs found
✅ **Coordinate with TypeScript Pro via user** - Never modify registry directly

### What Agent 1 (You) MUST NOT Do:
❌ **Modify fieldRegistry.ts** - TypeScript Pro handles this
❌ **Reload preview for user** - User refreshes browser themselves
❌ **Cut content to fit** - Reduce spacing instead
❌ **Create custom HTML** - Use user-provided HTML exactly
❌ **Guess field IDs** - Mark as ☐ Need Verification if unsure
❌ **Make calculation engine changes** - Outside scope

---

## 🔄 SESSION WORKFLOW

### Starting a Session
1. **Load handoff file:**
   ```
   Read: -Handoff-25.12.18.md
   ```

2. **Check current status:**
   - What pages are complete?
   - What field mapping is in progress?
   - Any blockers from previous session?

3. **Confirm with user:**
   - "I've loaded the handoff. Ready to continue with [next task]."

---

### During a Session
1. **User provides task:**
   - Add/update page XX
   - Create field mapping for Page XX
   - Verify field IDs

2. **You execute:**
   - Read relevant files
   - Make changes incrementally
   - Test with user
   - Commit with clear messages

3. **Document progress:**
   - Update field mapping docs
   - Update TABLE-OF-CONTENTS status
   - Note any blockers

---

### Ending a Session
1. **Create session summary:**
   ```
   User invokes: /session-summary
   You create: 25.12.XX-N - [Topic].md
   ```

2. **Update handoff file:**
   ```
   Update: -Handoff-25.12.18.md
   - Current progress table
   - Session history
   - Next steps
   ```

3. **Commit documentation:**
   ```bash
   git add -A
   git commit -m "docs: session handoff and summary for 25.12.XX"
   ```

---

## 📊 PROGRESS TRACKING

### Current Status (as of 2025-12-18)

| Component | Status | Notes |
|-----------|--------|-------|
| **Pages 1-72** | ✅ Complete | All in PREVIEW-Master.html |
| **Page 49 Field Mapping** | ✅ Complete | 80 fields documented |
| **Page 59 Field Mapping** | 🔄 Next | 105 fields (Sales Comparison) |
| **Pages 37-40 Field Mapping** | ⏳ Pending | ~110 fields (Rental Survey) |
| **Page 44 Field Mapping** | ⏳ Pending | ~40 fields (Operating History) |
| **Page 65 Field Mapping** | ⏳ Pending | ~10 fields (Market Value) |

### High Priority Tables
1. **Page 59** - Sales Comparison Grid (105 fields)
2. **Pages 37-40** - Rental Survey Grid (~110 fields)
3. **Page 44** - Operating History (~40 fields)
4. **Page 65** - Market Value Conclusion (~10 fields)

---

## 💡 TIPS & BEST PRACTICES

### For Agent 1 (You):

**HTML Integration:**
- Always verify page numbers before editing (grep for "Page XX:")
- Keep field placeholders intact: `{{FieldName}}`
- Maintain `class="field-mapped"` on all dynamic fields
- Use `data-sample` attribute to show example values

**Spacing Adjustments:**
- Start with padding reduction (54px → 48px)
- Test after each change
- Document what worked in git commit message
- Never reduce below 36px padding (readability threshold)

**Field Mapping:**
- Extract all `{{FieldName}}` placeholders from HTML
- Create structured table showing HTML→Registry→Valcre
- Mark uncertain fields as ☐ Need Verification
- Update to ✅ Verified after TypeScript Pro confirms

**Git Commits:**
```bash
# Good commit messages:
git commit -m "feat(page-49): update HTML from Claude Desktop

- Replaced Direct Capitalization table markup
- Adjusted padding from 54px to 48px for fit
- Verified 80 field placeholders present"

git commit -m "docs(field-mapping): add Page 49 registry mapping

- Created FIELD-MAPPING-Page-49-Registry.md
- Mapped 80 HTML fields to registry IDs
- Identified 8 fields needing verification"
```

---

## 🔍 QUICK REFERENCE

### Find Page in Template
```bash
grep -n "<!-- Page 49:" PREVIEW-Master.html
# Returns: Line number where Page 49 starts
```

### Extract Field IDs from Page
```bash
grep -o "{{[^}]*}}" PREVIEW-Master.html | grep "Page 49" -A 100 | sort -u
# Returns: All {{FieldName}} placeholders on Page 49
```

### Check Field in Registry
```bash
grep "calc-type1-count" /Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/schema/fieldRegistry.ts
# Returns: Field definition if exists
```

### Update TABLE-OF-CONTENTS Status
```markdown
| Page | Table Name | HTML Fields | Registry Fields | Mapping Doc | Status |
|------|-----------|-------------|-----------------|-------------|--------|
| 49 | Direct Capitalization | 80 | 74 verified | [FIELD-MAPPING-Page-49-Registry.md] | ✅ Complete |
| 59 | Sales Comparison Grid | 105 | TBD | - | 🔄 Next |
```

---

## 📞 COORDINATION POINTS

### With User:
- **Before starting page:** Confirm which page to update
- **After spacing changes:** Ask user to test in browser
- **When unsure about field ID:** Mark for verification, don't guess
- **After completing task:** Confirm next task or end session

### With TypeScript Pro (via User):
- **When creating field mapping:** Provide list of needed fields
- **After registry update:** Get confirmed field IDs
- **When adding new fields:** Specify type, inputSource, category

### With Claude Desktop (via User):
- **No direct coordination needed** - User handles this workflow
- **You receive:** Clean HTML markup from user
- **You provide:** Feedback on fit/styling if needed

---

## 📝 REMINDER FOR CLAUDE DESKTOP WORKFLOW

**User Uses Claude Desktop For:**
- Converting page images (PNG/PDF) to HTML
- This is VERY EFFICIENT for page generation
- Dedicated Claude Desktop project exists for this
- Claude Desktop matches styling from reference PDF

**Process:**
1. User uploads page image to Claude Desktop
2. Claude Desktop generates HTML markup
3. User reviews HTML
4. User provides HTML to you (Agent 1)
5. You integrate into PREVIEW-Master.html
6. You adjust spacing to fit page size
7. User tests in browser

**Why This Works:**
- Claude Desktop specializes in visual→HTML conversion
- You specialize in template integration and field mapping
- TypeScript Pro specializes in registry management
- Clean separation of concerns = efficient workflow

---

**End of Team Workflow SOP**
**Version:** 1.0
**Last Updated:** 2025-12-18

For questions or workflow improvements, coordinate with user (Ben).
