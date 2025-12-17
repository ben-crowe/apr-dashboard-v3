# CRITICAL NOTES - Page Fixes Incomplete

**Date:** December 17, 2025
**Status:** INCOMPLETE - Context compact imminent
**File:** PREVIEW-Master.html in doc-pages-html-formatted/

---

## ⚠️ WHAT HAPPENED

1. **Attempted to fix Pages 52-56** with wrong content/layout
2. **Used Python regex scripts** that were TOO AGGRESSIVE
3. **Accidentally deleted Pages 47-55** from file
4. **Restored from backup** (PREVIEW-Master.html.bak from 10:18 AM)
5. **Lost all fixes** - back to original broken state
6. **Formatting is messy** after restore

---

## 🎯 WHAT NEEDS TO BE FIXED

### Page 52
- **CURRENT:** Has "Comparable 4" content (WRONG)
- **SHOULD BE:** "Presentation" intro page
- **Reference:** User showed screenshot - simple text page with:
  - Header: "Valuation & Conclusions"
  - Blue subheader: "Presentation"
  - Paragraph about Sales Comparison Approach
  - Minimal content, lots of white space

### Page 53
- **CURRENT:** Has "Comparable 5" detailed content (WRONG)
- **SHOULD BE:** Map page showing all 5 comparable locations
- **Reference:** Page-53.png in doc-page-images/
  - Large Google Maps image placeholder
  - Table listing 5 comparables with addresses and distances

### Page 54
- **CURRENT:** Correct! Heritage House - Comparable 1
- **STATUS:** ✅ This is the TEMPLATE for all comparable pages
- **Layout:** 2-column (Left: tables 48%, Right: photo/map/remarks 48%)

### Page 55
- **CURRENT:** Messy/incorrect formatting
- **SHOULD BE:** College View Apartments - Comparable 2
- **Reference:** Page-55.png shows same 2-column layout as Page 54

### Page 56
- **CURRENT:** Messy/incorrect formatting
- **SHOULD BE:** Woodland Estates - Comparable 3
- **Reference:** Page-56.png shows same 2-column layout as Page 54

### Page 57
- **CURRENT:** May not exist or wrong content
- **SHOULD BE:** Comparable 4 (Parkside Flats)
- **Reference:** Use Page 54 template pattern

### Page 58
- **CURRENT:** May not exist or wrong content
- **SHOULD BE:** Comparable 5 (Parkside Flats 2)
- **Reference:** Use Page 54 template pattern

---

## ✅ CORRECT APPROACH (ONE AT A TIME)

### Method: Manual Edit Tool, NOT Python Scripts

**For each page:**

1. **Read current Page X** to see exact content
2. **Find page boundaries** precisely (opening `<div data-page-num="Page X">` to closing `</div>`)
3. **Use Edit tool** with exact old_string match (not regex)
4. **Replace with new content** from template
5. **Verify change** by reading the page again
6. **STOP and ask user to review** in browser
7. **Only proceed to next page** after user approval

### Template Files Available

Located in `/tmp/`:
- `template-comparable-page.html` - For comparable pages (54-58)
- `template-map-page.html` - For map page (53)

**To use template:**
- Read template file
- Replace placeholders: {PAGE_NUM}, {COMP_NUM}, {PROPERTY_NAME}, {BUYER}, etc.
- Use Edit tool to replace old content with filled template

---

## 🚫 WHAT WENT WRONG - DON'T REPEAT

### Python Script Issues:

1. **Regex too greedy** - `.*?` matched across multiple pages
2. **No verification** - Didn't check if replacement worked correctly
3. **Batch processing** - Did multiple pages without reviewing
4. **Pattern issues:**
   ```python
   # BAD - This matched TOO MUCH:
   pattern = r'<!-- PAGE.*?Page 55.*?-->\s*<div class="page-sheet".*?</div>\s*</div>'
   ```
   - Matched from Page 47 comment all the way to Page 56 closing!
   - Deleted everything in between

### Lesson Learned:
- **NEVER use regex for large HTML replacements**
- **ALWAYS use Edit tool with exact string matching**
- **ONE page at a time, STOP for review**

---

## 📋 STEP-BY-STEP RECOVERY PLAN

### Phase 1: Fix One Page (Page 52)

```
1. Read Page 52 section (find exact boundaries)
2. Copy current content to see what we're replacing
3. Create new Page 52 content:
   - Simple "Presentation" intro page
   - Header + paragraph + footer
4. Use Edit tool with exact old_string
5. Verify by reading Page 52 again
6. STOP - User reviews in browser
7. If approved, commit: "fix(page-52): replace with Presentation intro"
```

### Phase 2: After User Approves Page 52

```
Same process for Page 53 (map page)
- STOP after Page 53 for user review
```

### Phase 3: Continue One by One

```
Pages 54 (already correct), 55, 56, 57, 58
- STOP after EACH page for user review
```

---

## 🗂️ FILE LOCATIONS

### Main File:
```
/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/
└── 1-Formatting & Report/REPORT Pg Img/doc-page-html/doc-pages-html-formatted/
    └── PREVIEW-Master.html
```

### Reference Images:
```
/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/
└── 1-Formatting & Report/REPORT Pg Img/doc-page-images/
    ├── Page-52.png (user showed this)
    ├── Page-53.png
    ├── Page-54.png
    ├── Page-55.png
    └── Page-56.png
```

### Block Files:
```
/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/
└── 1-Formatting & Report/REPORT Pg Img/doc-page-html/doc-pages-html-single/
    ├── Page-52.html
    ├── Page-53.html
    ├── Page-54.html (CORRECT TEMPLATE)
    ├── Page-55.html
    └── Page-56.html
```

---

## 🎯 IMMEDIATE NEXT STEPS

1. **DO NOT USE PYTHON SCRIPTS**
2. **Start with Page 52 only**
3. **Use Edit tool with exact string matching**
4. **Stop after Page 52 and wait for user review**
5. **Commit after user approval**
6. **Then ask user if ready for Page 53**

---

## 💾 BACKUP STATUS

- `PREVIEW-Master.html` - Current (restored from backup)
- `PREVIEW-Master.html.bak` - Backup from 10:18 AM (same as current)
- `PREVIEW-Master.html.broken-[timestamp]` - The version with deleted pages (DO NOT USE)

---

## 📞 FOR NEXT AGENT

If you're reading this after context compact:

1. Read this entire file first
2. Read Page-54.html in doc-pages-html-single/ to see correct template
3. View Page-54.png reference image
4. Start ONLY with Page 52
5. Use Edit tool, NOT Python scripts
6. Stop and wait for user review after EACH page

**User's requirement:** "ONE page at a time, stop and review"

---

**Status:** Ready to start with Page 52
**Next action:** Fix Page 52 using Edit tool, then STOP
