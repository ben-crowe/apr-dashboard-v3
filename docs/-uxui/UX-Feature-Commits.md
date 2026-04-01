# APR Dashboard v3 — UX Feature Commits

**Purpose:** Single reference for what was built, when, and the commit to revert if something breaks. Update after every feature session.

**Last updated:** 2026-03-23 (React specialist bootstrap — full git history backfill across all 4 pipeline stages)

**Total commits scanned:** 1,202 (full history)

---

## How to Use This File

**Before starting work:** Read this to understand what exists and what's pending.
**After completing work:** Add commit hash, date, one-line description, status (Done / Working / Reverted / Pending).
**If reverting:** Update the previous entry's status to "Reverted" and note the replacement commit.

---

## Stage 1: Client Intake — SubmissionForm

| Commit | Date | Description | Status |
|--------|------|-------------|--------|
| `a113c70` | 2025-10-10 | Initial commit: APR Dashboard V3 — base SubmissionForm, routing | Done |
| `dc6cfe7` | 2025-11-03 | Display job reference ID on submission success screen | Done |
| `4412d99` | 2026-01-02 | Restore client intake S1 fields (intended-use, report-type) after previous session removed them | Done |

**Current state:** Working in production. Routes to `/` (Index). Writes to `job_submissions` table.

---

## Stage 2a: Job Management — Valcre

| Commit | Date | Description | Status |
|--------|------|-------------|--------|
| `7abe1cf` | 2025-12-06 | Add Master Field Directory with 7,967 named ranges from Valcre workbook | Done |
| `c0ac389` | 2025-12-08 | Consolidate VAL Job Number and Valcre Job ID into single field | Done |
| `2c659a7` | 2025-12-14 | Complete comprehensive search for 27 missing fields in Valcre workbook | Done |
| `1c22750` | 2025-11-16 | Fix Multi-Family property type mapping for Valcre API | Done (see note) |
| `cc9ae7b` | 2025-11-16 | Fix Multi-Family to use correct Valcre enum value | Done (see note) |
| `9091ce2` | 2025-11-16 | Revert Multi-Family to Building mapping — correct solution | Done |
| `973ee01` | 2025-11-16 | Multi-Family: send Building to PropertyType, Multi-Family to Types | Done (final) |
| `adf30ac` | 2026-01-27 | Re-enable automatic ClickUp task creation after Valcre job | Done |

### Recurring Bug: Multi-Family Property Type Mapping

The `PropertyType` Valcre API field went through 7+ fix attempts across 2025-11-16:

- **Root cause:** Valcre expects two separate fields: `PropertyType = "Building"` and `Types = "Multi-Family"`. Sending `PropertyType = "Multi-Family"` directly fails silently.
- **What was tried:** Multiple enum values (`multi_family`, `Multi-Family`, `Building`), multiple reverts
- **What worked:** `commit 973ee01` — use `TYPES_FIELD_MAP` to send `Building` to `PropertyType` and `Multi-Family` to `Types`
- **Risk:** Do not change this mapping without checking Valcre API docs. It looks wrong but is correct.

**Current state:** Working in production. Server-side Vercel function at `api/valcre.ts`.

---

## Stage 2b: Job Management — ClickUp

| Commit | Date | Description | Status |
|--------|------|-------------|--------|
| `1605924` | 2025-11-04 | Fix: Update ClickUp API token to correct production credentials | Done |
| `efba355` | 2025-11-06 | Change ClickUp button from purple to blue | Done |
| `8939376` | 2025-11-13 | Auto-complete LOE preparation subtask in ClickUp | Done |
| `713361f` | 2025-11-26 | Fix: Save all LOE details to DB before updating ClickUp task | Done |
| `669659c` | 2025-11-26 | Update ClickUp task formatting: bold headers, YY.MM.DD dates, aligned fields | Done |
| `2145f12` | 2025-11-26 | Fix: Add missing supabaseUrl definition in ClickUp update call | Done |
| `e01b473` | 2025-11-26 | Fix: Call update-clickup-task after Valcre job creation | Done |
| `cbc6f29` | 2026-01-26 | Add ClickUp production environment support | Done |
| `2faa7dc` | 2026-01-27 | Remove OAuth UI — using personal API token instead | Done |
| `a8d3ed3` | 2026-01-27 | Fix ClickUp OAuth callback to save tokens to database | Done |
| `adf30ac` | 2026-01-27 | Re-enable automatic ClickUp task creation after Valcre job | Done |
| `2130b43` | 2026-02-01 | Fix: Use correct ClickUp API endpoint for task templates | Done |

**Environments:**
- Test: BC WorkSpace, list `901703694310`
- Production: Valta workspace, list `901402094744`
- Template: `t-86b3exqe8`

**Current state:** Working in production. OAuth removed — personal API token only (`VITE_CLICKUP_API_TOKEN`).

---

## Stage 3: E-Signature — DocuSeal / LOE

### DocuSeal Integration

| Commit | Date | Description | Status |
|--------|------|-------------|--------|
| `7ddc823` | 2025-11-13 | Add intendedUse to webhook payload for Scope field mapping | Done |
| `379d698` | 2025-11-18 | Update Resend email configuration — new API key and sender | Done |
| `d7cfae3` | 2025-11-18 | Switch to Resend sandbox domain for testing | Done |
| `696917c` | 2025-11-26 | Fix: Use supabase.functions.invoke for auth instead of raw fetch | Done |
| `5ad78ea` | 2026-01-12 | Fix DocuSeal webhook "Job not found" error | Done |
| `27329a4` | 2026-01-12 | Apply DocuSeal migration and add webhook test infrastructure | Done |

**Template ID:** 1680270. **Status:** Production/Audited (2026-03-03).

### LOE Document Editor — Property Details Layout (Recurring)

> This is the highest-value section. The LOE property details field layout was fixed 10+ times in a single session (2026-01-20).

| Commit | Date | Description | Status |
|--------|------|-------------|--------|
| `193ef9d` | 2026-01-20 | feat(loe): Add template parser with action/closing section support | Done |
| `0c600e2` | 2026-01-20 | fix(loe): Use whitelist approach for table cell extraction | Done |
| `34f0940` | 2026-01-20 | feat(loe): Document-mode editor with inline editable zones | Done |
| `a374b53` | 2026-01-20 | feat(loe): Make authorized user fields full-width | Done |
| `4b72ec4` | 2026-01-20 | fix(loe): Split subject line into editable boilerplate and read-only field placeholders | Done |
| `a253eb6` | 2026-01-20 | feat(loe): Make all property details fields editable | Done |
| `e9887f9` | 2026-01-20 | fix(loe): Use side-by-side layout for property details fields | Done |
| `4fb49a9` | 2026-01-20 | fix(loe): Reduce property details field height to single line | Done |
| `2bbd263` | 2026-01-20 | fix(loe): Stack property details fields - label on top, input below | Done |
| `15d955f` | 2026-01-20 | fix(loe): Make property details fields more compact | Done |
| `3e8cb44` | 2026-01-20 | fix(loe): Force property details fields to strict one-line height | Done |
| `4cb4c8d` | 2026-01-20 | fix(loe): Remove green focus rings and simplify visual styling | Done |
| `3b3fc91` | 2026-01-20 | feat(loe): Auto-expanding textareas with reduced visual prominence | Done |
| `273021c` | 2026-01-20 | fix(loe): Make property details fields auto-expand like other fields | Done |
| `0b46c07` | 2026-01-20 | fix(loe): Add line breaks between list items in Terms & Conditions | Done |
| `42328b2` | 2026-01-20 | fix(loe): Improve auto-resize to properly shrink fields to content | Done |

### Recurring Bug: LOE Property Details Field Layout (2026-01-20)

16 commits on a single day all touched LOE property details fields. This is a known painful area.

- **Root cause:** The LOE form renders a parsed HTML document template with mixed editable/read-only zones. Auto-resize behavior for textareas conflicts with single-line enforcement for certain fields.
- **The core tension:** Some fields need to auto-expand (multi-line content like Terms & Conditions), while property detail fields should stay single-line compact. Getting both right simultaneously was the challenge.
- **What was tried:** Side-by-side layout, stacked layout, single-line enforcement, whitelist table cell extraction, explicit one-line height — many approaches over the same session
- **What worked:** `commit 42328b2` — `auto-resize that properly shrinks` combined with `3b3fc91` auto-expanding textareas with reduced visual prominence
- **Risk zone:** The LOE editor uses a template parser + inline editable zones. Any change to the template HTML or the parser extraction logic (`whitelist approach` from `0c600e2`) can break field detection.
- **If the LOE form fields break again:** Start from `42328b2`. Check the whitelist in `0c600e2` before adjusting layout.

### LOE Auto-Save (Earlier fixes — 2025-10-10)

| Commit | Date | Description | Status |
|--------|------|-------------|--------|
| `9963512` | 2025-10-10 | CRITICAL FIX: Explicit field mapping for LOE auto-save (Testing Agent Round 4) | Done |
| `c9d9777` | 2025-10-10 | fix: Add auto-save functionality to Property Name field | Done |
| `c0109c7` | 2025-10-10 | fix: Property Type multi-select auto-save and appraiser comments mapping | Done |
| `da223fd` | 2025-10-10 | fix: Add immediate auto-save to Appraiser Comments field | Done |
| `14a349e` | 2025-10-10 | fix: Add auto-save for all LOE fields and client information fields | Done |
| `373047e` | 2025-11-03 | fix: Add missing field mappings for dropdown auto-save in LOE Quote section | Done |
| `8cca437` | 2025-11-18 | Fix PropertyContact not syncing in LOE updates | Done |
| `8939376` | 2025-11-13 | feat: Auto-complete LOE preparation subtask in ClickUp | Done |
| `713361f` | 2025-11-26 | Fix: Save all LOE details to DB before updating ClickUp task | Done |

### Recurring Bug: LOE Auto-Save Field Mapping (2025-10-10)

5 commits on a single day (Testing Agent Round 1-4 pattern in commits) all touched LOE auto-save.

- **Root cause:** The LOE form has fields that map to `job_loe_details` table columns via explicit string keys. Missing mappings silently drop data — no error thrown.
- **What worked:** `9963512` — explicit field mapping object, not dynamic key inference
- **Risk zone:** Adding new LOE fields without updating the field mapping object in the auto-save handler will silently drop those fields.

**Current state:** DocuSeal integration audited and production-ready. LOE form fields working. Writes to `job_loe_details` table.

---

## Stage 4: Report Builder

### Field Registry Expansion

| Commit | Date | Description | Status |
|--------|------|-------------|--------|
| `d3c96fb` | 2025-12-18 | feat(schema): add workbookFieldMapping.ts and 55 new fields to registry | Done |
| `97709e8` | 2025-12-22 | feat(fields): add 120 missing fields from REGISTRY-ADDITIONS-FINAL.md | Done |
| `c7d07fe` | 2025-12-22 | feat: Complete 100% template coverage — add 119 missing fields to registry | Done |
| `ec23106` | 2025-12-22 | feat(fields): add 44 image fields to registry | Done |
| `e2d206e` | 2025-12-22 | feat(store): replace hardcoded sections with dynamic generation from fieldRegistry | Done |
| `bfb8de1` | 2025-12-27 | feat(registry): add 8 missing fields from template | Done |
| `ec1059e` | 2026-01-03 | Add 191 missing template fields to registry + test data | Done |
| `d907e8c` | 2026-01-03 | feat(registry): Add dropdown/toggle types to 66+ fields | Done |
| `af54a2f` | 2026-01-02 | Revert fieldRegistry.ts to pre-session state | Reverted |
| `948d6f1` | 2026-01-02 | Add 5 missing template fields to fieldRegistry | Done |
| `a809fcc` | 2026-01-04 | Add hbu-asimproved-1 field to fieldRegistry.ts | Done |
| `fad56e0` | 2026-01-04 | Add 8 missing street and traffic fields to fieldRegistry.ts | Done |
| `1d59e79` | 2026-01-04 | Remove duplicate subject-photo entries from fieldRegistry | Done |
| `f33198f` | 2026-01-07 | feat(registry): v2.9.0 — add 19 HomeTabPanel crosswalk fields | Done |
| `4100899` | 2026-01-07 | fix(registry): add subject-propertyname crosswalk canonical field | Done |
| `b34bff2` | 2026-01-11 | fix(report-builder): Add comp4-5 to store + INCOME type3-6 rows + COST template | Done |

**Fieldregistry.ts is 22K lines with 2084 field definitions.** The 4-File Sync Requirement applies to every field change: `fieldRegistry.ts`, `TestDataSet`, `Report-MF-template.html`, EditPanel components.

### Preview Panel

| Commit | Date | Description | Status |
|--------|------|-------------|--------|
| `791c2d4` | 2025-12-20 | fix(preview): make preview responsive to panel width | Reverted |
| `efebd80` | 2025-12-20 | Revert "fix(preview): make preview responsive to panel width" | Done |
| `045d186` | 2026-01-05 | fix(PreviewPanel): Force page injection after 300ms if iframe load timing issue | Done |
| `2e6d98f` | 2026-01-05 | fix(PreviewPanel): Update toggle labels to show current state | Done |
| `359d1bf` | 2026-01-09 | fix(PreviewPanel): add cache-busting to iframe template URL | Done |
| `c872cef` | 2026-01-04 | fix(reportBuilderStore): Add generatePreview after runCalculations in data loading | Done |
| `292fb79` | 2026-01-02 | fix(ReportBuilder): auto-generate preview on mount | Done |
| `4eceead` | 2026-01-02 | fix(ReportBuilder): remove duplicate generatePreview call | Done |
| `165ff45` | 2026-01-01 | Fix PreviewPanel store access — use sections instead of non-existent fieldValues | Done |

### Edit Panel

| Commit | Date | Description | Status |
|--------|------|-------------|--------|
| `5f94aef` | 2026-01-01 | feat(EditPanel): Add collapsible subsections with accordion UI | Done |
| `c865c35` | 2026-01-02 | feat(EditPanel): add expand/collapse all button in section header | Done |
| `cf54da2` | 2026-01-03 | feat(EditPanel): Integrate HomeTabPanel for HOME section rendering | Done |
| `04dd171` | 2026-01-02 | fix(EditPanel): correct HOME_FIELD_LAYOUT to use store field IDs | Done |
| `812d5a0` | 2026-01-01 | refactor(EditPanel): Replace large test data cards with small toggles in section headers | Done |
| `992681d` | 2026-01-07 | revert: remove table editable inputs, use EditPanel instead | Done |
| `a8af386` | 2026-01-20 | fix: Resolve TDZ error in template editor preventing modal from opening | Done |

### Image Configurator (Report Builder Section)

| Commit | Date | Description | Status |
|--------|------|-------------|--------|
| `1f18d90` | 2026-01-06 | Refactor Image Configurator layout with light theme and letter-size page container | Done |
| `5364e2a` | 2026-01-06 | Add draggable divider to Image Configurator split panels | Done |
| `0fed272` | 2026-01-06 | Add zoom toggle to Layout Builder for better slot visibility | Done |
| `c206422` | 2026-01-06 | Auto-create report page layouts on first load | Done |
| `18d84fe` | 2026-01-06 | Add Create Default Layouts button and user guide for Image Configurator | Done |
| `25f2100` | 2026-01-06 | Reorganize Image Configurator header for better UX | Done |
| `15eca81` | 2026-01-06 | Modernize image slot drag-drop styling | Done |
| `3bab982` | 2026-01-06 | Simplify caption styling under images | Done |
| `30f15b3` | 2026-01-06 | Add scrollable gallery with expand overlay | Done |
| `554436e` | 2026-01-06 | Add page sync between Image Configurator and Report Preview | Done |
| `9d4d354` | 2026-01-07 | Consistent dropdown styling across Image Configurator | Done |
| `516688a` | 2026-01-07 | Add editable titles and captions to popup Image Configurator | Done |

### Layout Builder (Image Page Layouts)

Multiple fixes on a single day (2026-01-06) — layout overflow and page tabs visibility issues:

| Commit | Date | Description | Status |
|--------|------|-------------|--------|
| `cf89d98` | 2026-01-06 | Fix layout — use CSS Grid for predictable structure, fixed letter aspect ratio | Done |
| `e38f84d` | 2026-01-06 | Fix layout overflow — use explicit fixed heights, minHeight:0 on page area | Done |
| `9b3f668` | 2026-01-06 | Return page tabs to bottom with proper flex layout | Done |
| `25ec94b` | 2026-01-06 | Fix hidden page tabs — restructure layout with sticky positioning | Done |
| `9479bc2` | 2026-01-06 | Fix bottom page tabs being hidden — ensure proper flex layout with flex-shrink-0 | Done |
| `04ec471` | 2026-01-06 | Add min size constraints to LayoutBuilder page | Done |

### Recurring Bug: LayoutBuilder Page Tabs (2026-01-06)

5 commits on one day all tried to fix page tabs being hidden in the Layout Builder.

- **Root cause:** The page container used `overflow:hidden` on parent without setting proper flex constraints. Page tabs at the bottom got pushed off-screen.
- **What worked:** CSS Grid for the overall structure (`cf89d98`) with `flex-shrink-0` on the tab wrapper (`9479bc2`)
- **Risk zone:** Any changes to the Image Configurator outer container dimensions or flex/grid structure can re-hide the page tabs.

### Template HTML (Report Pages)

| Commit | Date | Description | Status |
|--------|------|-------------|--------|
| `ec8dc6a` | 2025-12-18 | feat(page-49): update field IDs to registry format | Done |
| `d15a343` | 2025-12-18 | feat(page-59): update field IDs to registry format | Done |
| `c568b99` | 2025-12-18 | fix(page-44): wire ~96 registry field IDs to Operating History table | Done |
| `07ca9b3` | 2025-12-18 | fix(page-63): wire 12 registry field IDs to HTML template | Done |
| `a3c8893` | 2025-12-18 | fix(page-61): update HTML with 68 registry field IDs for DCA conclusion grid | Done |
| `f8b839e` | 2025-12-21 | feat(pages-14-16): complete Executive Summary pages from Figma design | Done |
| `bebf452` | 2025-12-21 | feat(page-12): implement Introduction & Executive Summary page from Figma design | Done |
| `8995a1d` | 2025-12-16 | docs(field-management): catalog 86 reference table design images | Done |
| `ffdaa02` | 2025-12-17 | feat(page-65): add final estimate of value with market value conclusion and signature block | Done |
| `43d8eb5` | 2025-12-17 | fix(page-65): replace svg signature placeholder with actual base64 encoded signature | Done |
| `f2dd844` | 2026-01-05 | Fix cover image: template now uses img-cover-photo (matches editor) | Done |

### Report Builder Store

| Commit | Date | Description | Status |
|--------|------|-------------|--------|
| `cbefc26` | 2026-01-02 | fix(report-builder): Button now calls loadFullTestData correctly | Done |
| `f1d30e4` | 2026-01-02 | fix(report-builder): Use correct field IDs in loadHomeTestData | Done |
| `6675cdb` | 2026-01-02 | refactor(ReportBuilder): remove Load Full Test Data button | Done |
| `5f69699` | 2026-01-01 | Integrate calculator panels into Report Builder CALC section | Done |
| `e2a130b` | 2026-01-01 | Add integration bridge route for Report Builder from Job Detail | Done |

**Current state:** Stage 4 standalone only. `report_builder_data` table does not exist. No DB persistence. No route integration (`/dashboard/job/:jobId/report`).

**Pending work (highest priority):**
1. Create `report_builder_data` table + migration
2. Route: `/dashboard/job/:jobId/report`
3. Data bridge: job data → Report Builder "Home" section
4. Auto-save: 2-second debounce to `report_builder_data`

---

## Calculator Engine

| Commit | Date | Description | Status |
|--------|------|-------------|--------|
| `680a2df` | 2025-12-12 | Add interactive calculator demonstration page | Done |
| `6231f14` | 2025-12-12 | Fix calculator demo white screen crash — infinite render loop | Done |
| `52bd542` | 2025-12-12 | CRITICAL FIX: Connect calculator demo to Zustand store | Done |
| `8b8f813` | 2025-12-12 | Fix calculator demo to produce $1,780,000 indicated value | Done |
| `1000986` | 2025-12-15 | Add field count badges to Valuations accordions and fix Income Approach field sources | Done |
| `532b919` | 2025-12-13 | Add new contract review and calculator engine handoff documents | Done |
| `457c25b` | 2025-12-12 | Add Sales Comparison and Reconciliation panels to calculator | Done |
| `69290b7` | 2025-12-12 | Integrate Sales Comparison and Reconciliation into calculator page | Done |
| `08a2bfa` | 2025-12-12 | Populate template pages 31-45 (Income Approach section) | Done |
| `ff90055` | 2025-12-30 | Restructure Income Approach panel to match report template sections | Done |
| `b5a0c78` | 2025-12-30 | Remove blue background colors from calculator app summary rows | Done |
| `1b92198` | 2025-12-30 | fix(calculator): remove gray section headers for dark mode compatibility | Done |
| `25c9168` | 2026-01-03 | Add CostTabPanel with collapsible input sections and CostApproachPanel calculator | Done |
| `352cf47` | 2026-01-03 | feat(SalesTabPanel): integrate SalesComparisonPanel calculator table | Done |
| `f6a0a6c` | 2026-01-03 | Integrate OperatingHistoryPanel and IncomeApproachPanel into IncomeTabPanel | Done |
| `4332bd8` | 2026-01-03 | feat(IncomeTabPanel): add dedicated panel for Income Approach section | Done |
| `5b6a024` | 2026-01-07 | feat(calc): add CalcInputPanel with collapsible input sections | Done |
| `a51a99a` | 2026-01-07 | feat(income): make unit counts editable, reverse flow direction | Done |
| `c6a8b0a` | 2026-01-07 | feat(income): make SF, Rent, and Contract fields editable | Done |
| `31384b8` | 2026-01-07 | feat(home-tab): make Rental Units read-only from Income Tab calc | Done |
| `625f026` | 2026-01-07 | fix: income-table reads subject-units from Home Tab instead of summing | Done |
| `fc790e9` | 2026-01-11 | Add 49 calculator input fields to INCOME tab | Done |
| `0cfa1af` | 2026-01-11 | Refactor INCOME tab with 4 sub-tabs (REVENUE, VACANCY, EXPENSES, VALUE) | Done |

**Current state:** Working at `/calculator-demo`. Zustand-backed. Income, Sales Comparison, Cost Approach panels integrated into Report Builder CALC section.

---

## Authentication & Login

| Commit | Date | Description | Status |
|--------|------|-------------|--------|
| `dc80907` | 2026-01-27 | feat: Replace fake auth with real Supabase authentication | Done |
| `92a0d5b` | 2026-01-27 | fix: Make login form text visible (black text on white background) | Done |
| `ee2a08b` | 2026-01-27 | Fix login page input text visibility issue | Done |
| `2faa7dc` | 2026-01-27 | Remove OAuth UI — using personal API token instead | Done |

**Current state:** Real Supabase authentication at `/login`. Login form text visibility was fixed twice on the same day (see below).

### Recurring Bug: Login Form Text Visibility (2026-01-27)

Two commits on the same day both touched login form text visibility (`92a0d5b` then `ee2a08b`).

- **Root cause:** Default Tailwind input styles had light text on a light background. First fix applied to some inputs, missed others.
- **Rule:** All login form inputs need explicit `text-black` or `text-gray-900` + `bg-white` classes. Do not rely on browser defaults.

---

## UI/Styling & Branding

| Commit | Date | Description | Status |
|--------|------|-------------|--------|
| `b2f35b0` | 2025-11-06 | Remove Lovable branding and update to APR Dashboard | Done |
| `35d666a` | 2025-12-11 | Update Dashboard table headers to use consistent brand navy color | Done |
| `742f8ac` | 2026-02-01 | Replace Lovable branding og-image with APR brand color | Done |
| `0673699` | 2026-02-01 | Update og-image to solid black (remove Lovable branding) | Done |
| `38f97e3` | 2026-01-20 | feat(ui): Standardize action buttons to gray low-profile styling | Done |
| `f72bc09` | 2026-01-07 | fix(ui): rename toggle labels to Dev Mode / User Ready | Done |

**Brand state:** All Lovable branding removed. APR brand color + solid black og-image. Action buttons are gray low-profile (not colored).

---

## Dashboard Layout & Navigation

| Commit | Date | Description | Status |
|--------|------|-------------|--------|
| `3f81396` | 2025-12-11 | Fix Page 6 Dashboard Year Built display | Done |
| `ccd665c` | 2025-11-11 | fix: Correct IIFE syntax error in ClientSubmissionSection | Done |
| `e58c04a` | 2025-11-13 | Add Delivery and Payment comment fields to Dashboard | Done |
| `2cff473` | 2025-11-19 | Clarify client form vs dashboard sections in workflow doc | Done |
| `3986158` | 2026-01-05 | Add minimal test dashboard for image flow reproduction | Done |
| `61ebfc0` | 2025-12-10 | Implement Phase 1 PDF formatting improvements for APR Dashboard | Done |

---

## PDF Export

| Commit | Date | Description | Status |
|--------|------|-------------|--------|
| `fc7c8bf` | 2025-12-09 | Fix PDF export: hide grey bars, fix header/footer positioning | Done |
| `cdaa260` | 2025-12-09 | Simplify print CSS for cleaner PDF export | Done |
| `b0971f3` | 2025-12-09 | Fix PDF pagination — prevent content cutoff between pages | Done |
| `4ce48c9` | 2025-12-09 | Embed Valta logo as base64 for PDF export | Done |
| `73bed6b` | 2025-12-08 | Revert to window.print() for PDF — html2pdf.js produced blank pages | Done |

**Note:** `html2pdf.js` was tried and reverted. `window.print()` is the working solution.

---

## Docs & Session Notes

| Commit | Date | Description | Status |
|--------|------|-------------|--------|
| `a113c70` | 2025-10-10 | Initial commit: APR Dashboard V3 | Done |
| `7fc8329` | 2025-11-04 | docs: Update production URL to apr-dashboard-v2.vercel.app | Done |
| `04c2662` | 2026-01-27 | Organize session management — move 112 session files to session-notes folder | Done |
| `53948b2` | 2026-03-23 | docs: enriched CLAUDE.md + Feature-Commits tracking file (CoArch initial audit) | Done |
| `f73f73a` | 2026-03-23 | docs: project audit — updated PLAN.md, README.md, Feature-Commits tracking | Done |

---

## Dashboard Field Layout Redesign (2026-04-01)

> Marathon session: style guide → design brief → HTML prototype (6+ iterations with UI designer) → React conversion → polish.

| Commit | Date | Description | Status |
|--------|------|-------------|--------|
| `07f3042` | 2026-04-01 | Revert address split — single long address field matching Valcre UI | Done |
| `d42b63a` | 2026-04-01 | Add dashboard field style guide — line widths, column layout, three field types | Done |
| `b942642` | 2026-04-01 | Add approved field layout prototype and design brief | Done |
| `a046369` | 2026-04-01 | Apply approved field layout to Client Info, Property Info, Property Contact | Done |
| `99572c9` | 2026-04-01 | Move section titles inside centered content wrapper for alignment | Done |
| `2d67f0f` | 2026-04-01 | Match LOE section layout — SectionGroup, TwoColumnFields, three-col label-on-top | Done |
| `064b47a` | 2026-04-01 | Put three selects back in TwoColumnFields for edge alignment | Done |
| `c09dbf6` | 2026-04-01 | Decouple underlines from inputs — 160px line, w-full input field | Done |
| `a1cb9a8` | 2026-04-01 | Fill Property Contact with test data when Test Data button pressed | Done |
| `8036eef` | 2026-04-01 | Cap grid columns at max-w-[1100px] with pr-8 right padding | Done |
| `0b12815` | 2026-04-01 | Fix test data — Property Type, Intended Use, add Valuation Premises | Done |
| `5325197` | 2026-04-01 | Fix Report Type test data — values match dropdown options | Done |
| `619291c` | 2026-04-01 | Always select Appraisal Report for test data | Done |
| `161e438` | 2026-04-01 | Fill delivery/payment comments, auto-expand textareas | Done |
| `242b579` | 2026-04-01 | Single expand/collapse toggle for all three comment fields | Done |
| `ec0b24a` | 2026-04-01 | Fill all Building Info fields in test data — VALTA dropdowns | Done |
| `dd1fbbc` | 2026-04-01 | Shorten long Building Info labels for alignment | Done |
| `a656263` | 2026-04-01 | Remove spinbutton arrows from numeric fields | Done |
| `ce91226` | 2026-04-01 | Remove Year Built placeholder and spinbutton in Data Gathering | Done |
| `24d2f95` | 2026-04-01 | Legal Description — single-line input, no underline | Done |
| `dd37440` | 2026-04-01 | Fix chevron position on select triggers — right edge of 160px | Done |
| `dad017f` | 2026-04-01 | Add padding to dashboard main container | Done |
| `43f90fc` | 2026-04-01 | Add p-6 inside dashboard list card for breathing room | Done |
| `b0b0a35` | 2026-04-01 | Remove Switch to Table View button from dashboard | Done |
| `d9a3489` | 2026-04-01 | Make job list divider lines more visible | Done |
| `b90260d` | 2026-04-01 | Shorten search bar to 400px, group filter buttons right | Done |
| `2c46a7c` | 2026-04-01 | Align DATE/STATUS headers with row values | Done |

### Design Artifacts
- Style guide: `docs/-uxui/dashboard-field-style-guide.md`
- Design brief: `docs/-uxui/dashboard-field-design-brief.md`
- HTML prototype v1 (two-line address): `builds/field-layout-prototype.html`
- HTML prototype v2 (single-line, approved): `builds/field-layout-prototype-v2.html`

### Known Issues (Pending)
- Select trigger text indent on long values (e.g. "First Mortgage Financing" pushes right)
- Client Comments textarea not editable — needs investigation
- File preview pane concept — half-width file list + preview box
- Form intake page needs same field layout treatment
- Comments section — consider stacking vertically like description fields

---

## Pending Work (Current Sprint)

1. Create `report_builder_data` table + migration in Supabase
2. Route integration: `/dashboard/job/:jobId/report`
3. Data bridge: job data → Report Builder "Home" section
4. Auto-save: 2-second debounce to `report_builder_data`
5. Console.log cleanup in `ClickUpAction.tsx`
6. Image Configurator feature — migration exists, feature in `src/features/image-configurator`

---

## Known Risk Areas

| Area | Risk | Last Touched |
|------|------|-------------|
| LOE property details layout | Auto-resize vs single-line tension | 2026-01-20 |
| LOE auto-save field mapping | Silent data loss if field map incomplete | 2025-11-03 |
| Valcre PropertyType mapping | Must use Building→PropertyType + Multi-Family→Types | 2025-11-16 |
| LayoutBuilder page tabs | Hidden by flex/overflow if container changed | 2026-01-06 |
| fieldRegistry.ts | 22K lines — revert risk if batch edit fails | 2026-01-07 |
| PreviewPanel iframe timing | 300ms forced inject needed for load race | 2026-01-05 |
| PDF export | window.print() only — html2pdf.js was reverted | 2025-12-09 |
