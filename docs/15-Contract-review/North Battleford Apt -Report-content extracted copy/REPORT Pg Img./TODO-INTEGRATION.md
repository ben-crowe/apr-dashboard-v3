# TODO - APR Dashboard Template Integration

**Project:** North Battleford Apartments Report Integration
**Goal:** Replace broken reportHtmlTemplate.ts with 79-page structure
**Status:** In Progress

---

## TASK LIST

- [x] **1. AUDIT fieldRegistry.ts**
  - **Status:** DONE (521 fields across 103 sections)
  - **File:** `/src/features/report-builder/schema/fieldRegistry.ts`
  - **Output:** `INTEGRATION-AUDIT.md`

- [x] **2. AUDIT reportHtmlTemplate.ts**
  - **Status:** DONE (7,481 lines, broken with overflow issues)
  - **File:** `/src/features/report-builder/templates/reportHtmlTemplate.ts`
  - **Problem:** Single monolithic template, pagination broken

- [ ] **3. FIND workbookFieldMapping.ts**
  - **Status:** IN PROGRESS
  - **Expected:** `/src/features/report-builder/schema/workbookFieldMapping.ts`
  - **Actual:** File not found at expected location
  - **Next:** Search broader path, check reportBuilder.types.ts

- [x] **4. MAP images to field IDs**
  - **Status:** PARTIAL (16/89 images mapped)
  - **File:** `image-field-mapping.json`
  - **Confirmed:**
    - `image4.png` → `valta-logo`
    - `image24.jpg` → `img-cover-photo`
    - `image15.png` → `img-map-local`
    - `image16.png` → `img-map-regional`
    - 12 more confirmed mappings
  - **Remaining:** 73 images to map

- [x] **5. COMPARE Property 1 vs Property 2 for prose sections**
  - **Status:** DONE
  - **Property 1:** North Battleford Apartments (VAL251012)
    - Path: `/docs/15-Contract-review/Ref.Report-VAL251012-North Battleford Apt.docx`
  - **Property 2:** Binscarth Apartments, Drumheller (VAL251026)
    - Path: `/docs/15-Contract-review/Property 2/VAL251026 - Binscarth Apartments, 802 Bankview Dr, Drumheller, AB Revised v01 2025-12-12.docx`
  - **Method:**
    - ✅ Converted both .docx to plain text via pandoc
    - ✅ Compared paragraph-by-paragraph
    - ✅ Identified boilerplate (60-70% identical) vs dynamic (30-40% property-specific)
  - **Output:** `BOILERPLATE-VS-DYNAMIC-ANALYSIS.md`
  - **Key Findings:**
    - 26 new prose fields needed
    - National economic overview is 100% boilerplate
    - Provincial/city market overviews are 100% dynamic
    - Building specs are structured boilerplate with dynamic values

- [ ] **6. CREATE field list for prose sections** ← **CURRENT PRIORITY**
  - **Status:** IN PROGRESS
  - **Purpose:** Identify new fields needed for dynamic prose
  - **Source:** 26 new fields identified in BOILERPLATE-VS-DYNAMIC-ANALYSIS.md
  - **Action:** Create structured field list ready for fieldRegistry.ts integration

- [ ] **7. MAP all 79 pages to field IDs**
  - **Status:** PENDING
  - **Includes:**
    - Numbers (site-total-area, site-acreage, etc.)
    - Prose (dynamic paragraphs from #5/#6)
    - Images (from #4)
  - **Output:** Complete page-to-field mapping

- [ ] **8. BUILD new reportHtmlTemplate.ts**
  - **Status:** PENDING
  - **Structure:** 79 discrete page functions
  - **Uses:** Existing fieldRegistry field names
  - **Replaces:** Broken 7,481-line template

- [ ] **9. INTEGRATE with existing viewer**
  - **Status:** PENDING
  - **Integration:** TDD Dashboard (Left=Editor, Right=Viewer)
  - **Input:** `sections: ReportSection[]` (same as current)
  - **Output:** Rendered 79-page HTML

- [ ] **10. TEST with Property 1 data**
  - **Status:** PENDING
  - **Property:** North Battleford Apartments
  - **Verify:** All fields populate correctly

- [ ] **11. VALIDATE with Property 2 data**
  - **Status:** PENDING
  - **Property:** Binscarth Apartments, Drumheller
  - **Verify:** Same template, different data works

---

## FILES CREATED

- `INTEGRATION-AUDIT.md` - fieldRegistry audit (521 fields, 103 sections)
- `IMAGE-ASSET-AUDIT.md` - Image extraction analysis (89 images)
- `image-field-mapping.json` - 16/89 images mapped
- `BOILERPLATE-VS-DYNAMIC-ANALYSIS.md` - Property comparison results (26 new fields identified)
- `TODO-INTEGRATION.md` - This file

---

## NEXT ACTION

**Execute Task #6:** Create field list for prose sections

**Input:** 26 new fields from BOILERPLATE-VS-DYNAMIC-ANALYSIS.md
**Output:** Structured field definitions ready for fieldRegistry.ts

**Updated:** 2025-12-12 14:15
