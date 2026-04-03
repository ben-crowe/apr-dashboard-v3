# APR Dashboard — Master Status

**Last Updated:** 2026-04-02
**Single reference for all active work, pending items, and decisions.**

---

## Recently Completed (This Session — 2026-04-02)

- Payment tracking fields: Amount Paid, Paid Date, Retainer Amount, Retainer Paid — deployed, QA verified
- LOE V1 (original), V2 (Chris's V02), V3 (Chris's V03) — all in template picker
- Valcre sync for AmountPaid + PaidDate — deployed (client proxy fix)
- Test data logic: fee $6,000, 20% retainer, calculated dates
- Field labels matched to Chris's naming (Amount Paid, Paid Date)
- Payment Terms default changed to "Due Upon Receipt"
- Dark mode dropdown fix + double close button removed
- Template editor capabilities documented
- Vercel build fix (symlink absolute → relative, disabled untracked report-builder routes)
- GitHub auth restored (HTTPS + gh credential helper)

## Active / In Progress

### Job Details Layout Reorganization
**Review doc:** `docs/valta share/JOB-DETAILS-LAYOUT-REVIEW.md`
**Status:** Awaiting Ben's input on 10 questions (Q1-Q10)
**Summary:** Property Rights and Scope of Work misplaced in payment section. Proposed regrouping. Retainer fields to be de-emphasized. Comment blocks may reduce from 3 to 2.

### Conditional Fields System / Field Registry Explorer
**Status:** Prototype built (v2.2) — interactive HTML with 4 tabs, 28 rules verified, cascade logic working
**Prototype:** `builds/prototypes/valta-field-registry-explorer-v2.2.html`
**Controls stylesheet:** `builds/prototypes/valta-controls-v3.html`
**Logic reference:** `docs/valta share/CONDITIONAL-FIELD-LOGIC.md`
**Next iteration:**
- Replace tab bar with dropdown menu categories (Dashboard, Fields, Rules, Tools) — tabs don't scale
- Add Text Library / Narratives view (EA/HC paragraphs that auto-populate based on Value Scenarios)
- Add search/filter that works across all views (type "client" → shows all client fields)
- Add override dimming visual (pick Tenancy → Property Type dims)
- Add change request / ClickUp chat integration concept
- Custom glass dropdowns (attempted, needs careful implementation)

### Report Builder Integration
**Status:** Blocked — `report_builder_data` table does not exist
**Priority:** Was #1 before LOE work took priority
**Tasks:**
1. Create `report_builder_data` table + migration
2. Route: `/dashboard/job/:jobId/report`
3. Data bridge: job data → Report Builder "Home" section
4. Auto-save: 2-second debounce

### Report Builder Directory Consolidation
**Status:** Needs proper fix
**Issue:** `src/features/report-builder` is a symlink to `image-configurator/report-builder`. Causes Vercel build failures. Routes temporarily disabled.
**Proper fix:** Pick one canonical location, update all imports, delete symlink. ~20 files affected.

---

## Pending Decisions

| # | Question | Options | Doc Reference |
|---|----------|---------|---------------|
| Q1 | Appraisal Fee vs Amount Paid — redundant? | Same field or different? | JOB-DETAILS-LAYOUT-REVIEW.md |
| Q2 | Payment Terms dropdown options | Add "Due Upon Receipt" as default | JOB-DETAILS-LAYOUT-REVIEW.md |
| Q3 | Property Rights — move to Card 1? | Valcre groups it with Report tab | JOB-DETAILS-LAYOUT-REVIEW.md |
| Q4 | Comments — reduce from 3 to 2? | Remove Payment Comments? | JOB-DETAILS-LAYOUT-REVIEW.md |
| Q5 | Retainer fields — keep/hide/remove? | Chris doesn't use them | JOB-DETAILS-LAYOUT-REVIEW.md |
| Q6 | ClickUp — sync or replace? | Phase 1-4 roadmap exists | 10-clickup-workflow-sync-spec.md |
| Q7 | Workflow checkboxes on dashboard? | 6 checkboxes from Chris's board | 10-clickup-workflow-sync-spec.md |
| Q8 | Payment Terms options match ClickUp? | Need to verify | JOB-DETAILS-LAYOUT-REVIEW.md |
| Q9 | Which ClickUp phase next? | Phase 1 = expand to 21 fields | 10-clickup-workflow-sync-spec.md |
| Q10 | Disbursement % — is this retainer %? | Chris to confirm | JOB-DETAILS-LAYOUT-REVIEW.md |

---

## LOE Template Versions

| Picker Label | Source | File | Status |
|---|---|---|---|
| V1 - Original | Our first template | v3Template.ts | In picker, backup |
| V2 - Updated | Chris's V02.docx | v4Template.ts | In picker |
| V3 - Current | Chris's V03.docx | v5Template.ts | Default, deployed |

**Template docs:**
- `docs/valta share/LOE-TEMPLATE-V3-CURRENT.md` — V1 snapshot
- `docs/valta share/LOE-TEMPLATE-V4-REVISED.md` — V2 changes
- `docs/valta share/LOE-V4-CLEAN-PREVIEW.md` — V2 clean preview
- `docs/valta share/LOE-V03-DIFF-vs-V02.md` — V3 changes
- `docs/valta share/TEMPLATE-EDITOR-CAPABILITIES.md` — what the editor can/cannot do
- `docs/valta share/CHANGE-REQUEST-V2.md` — V2 field registry diff

---

## ClickUp Integration

**Full spec:** `builds/field-mapping/10-clickup-workflow-sync-spec.md`
**Current:** 7 of 48 fields auto-filled on task creation, 0 live-synced
**Target:** Phase 1 = 21 fields, Phase 4 = replace ClickUp entirely

---

## Field Mapping Reference

| Doc | What It Covers |
|-----|---------------|
| `builds/field-mapping/1-client-form.md` | 19 intake form fields |
| `builds/field-mapping/2-dashboard.md` | 65 dashboard fields across 4 sections |
| `builds/field-mapping/3-valcre-job.md` | Valcre job page — 7 sections |
| `builds/field-mapping/4-loe-esignature.md` | 22 LOE document fields |
| `builds/field-mapping/5-clickup-task.md` | ClickUp task fields |
| `builds/field-mapping/6-dropdown-options.md` | 21 dropdowns, ~150 options |
| `builds/field-mapping/7-file-uploads.md` | File storage flow |
| `builds/field-mapping/8-client-communication.md` | Notification timeline |
| `builds/field-mapping/9-dashboard-to-valcre-mapping.md` | 68 fields: 36 mapped, 30 not, 2 no destination |
| `builds/field-mapping/10-clickup-workflow-sync-spec.md` | 48 ClickUp fields, 4-phase plan |

---

## Design Rules

- **No pill-shaped buttons or rounded chips.** Flat, tight, text-driven controls. Engineering tooling aesthetic, not consumer SaaS / Notion-lite.
- Active state = subtle background tint or thin underline/border, NOT colored pills
- Think Chrome DevTools, database admin panels — flat and precise
- Applies to all prototypes, dashboards, and UI designer work on APR

---

## Technical Debt

- Report-builder symlink → needs consolidation (routes disabled as workaround)
- Console.log cleanup in ClickUpAction.tsx
- Field registry backup files (fieldRegistry.ts.backup, .bak) — remove
- reportBuilderStore.ts.bak-before-assignment — remove
- Stale PLAN.md (March 23) — needs update
- Stale README.md (March 23) — needs update
- `docs/` missing README index
- `Valta Field Reg-cc.xlsx` in project root — move to docs/valta share/

---

## Valcre Sync Status

| Field Category | Mapped | Not Mapped | No Destination |
|---|---|---|---|
| Client Information (7) | 7 | 0 | 0 |
| Property Information (6) | 5 | 0 | 1 |
| Property Contact (4) | 0 | 4 | 0 |
| LOE / Job Details (8) | 7 | 0 | 1 |
| 13 VALTA Custom Fields | 13 | 0 | 0 |
| Building Info (4) | 0 | 4 | 0 |
| Property Site (5) | 0 | 5 | 0 |
| Parcels (5) | 0 | 4 | 1 |
| Assessments (6) | 0 | 6 | 0 |
| **Total** | **36** | **30** | **2** |
