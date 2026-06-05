---
content_type: pipeline-plan
title: LOE-07 Phase-2 — Wiring Pipeline Plan + Foreseen Issues
status: DRAFT — for co-architect/Ben review, HOLD before any wiring
created: 2026-06-04
author: react-specialist
sources_studied: LOE-DOCUSEAL-ARCHITECTURE.md (full), docuseal-proxy + docuseal-webhook + generateLOE.ts (loadV3Template, mapDataToV3Fields, seedTemplatesIfEmpty), v3/v4/v5 template chain, PRD-A field map
---

# LOE-07 Phase-2 — Pipeline Plan + Foreseen Issues

Understand-first deliverable. Traces the full path and flags the seam risks. **No wiring done — holding for review.**

## How the current system ACTUALLY works (verified, not assumed)

1. **Generate (client):** `LoeQuoteSection` → `generateLOEHTML(job, jobDetails)` → `loadV3Template()` → `mapDataToV3Fields()` builds ~20 `[placeholder]→value` pairs → global regex replace → HTML. DocuSeal `<signature-field>` / `<date-field>` anchor tags left untouched.
2. **Template source is ALREADY version-aware (partial):** `loadV3Template()` reads `loe_templates` (DB) by `is_default:true`, seeds V3/V4/V5 if empty (cols: `name, template_html, is_default, is_active, version`), falls back to embedded `V5_TEMPLATE`. **BUT it only ever loads the single `is_default` row — a job cannot yet CHOOSE its version.**
3. **Submit:** `generateAndSendLOE` → POST `docuseal-proxy?endpoint=submissions/html` → DocuSeal renders HTML→PDF + converts anchor tags to fields. Payload: `{name, send_email:false, documents:[{html, size:'Letter'}], submitters:[{email,name,role:'First Party'}]}`.
4. **Persist:** writes filled HTML to `loe_submissions` + sets `job_loe_details.docuseal_submission_id`. Emails via `send-loe-email-fixed` (Resend).
5. **Webhook:** `docuseal-webhook` on `submission.completed` → `job_submissions.status='loe_signed'`, `job_loe_details.signed_document_url + signed_at`, `loe_submissions.status='signed'`, insert `job_files`. Plus ClickUp "LOE Signed" line.

## The full Phase-2 path + foreseen issues at each seam

### Seam 1 — v07 template → placeholder vocabulary (BIGGEST architectural issue)
- v07 uses PascalCase tokens (`[ClientFirstName]`, `[PropertyName]`, `[AssignmentType]`…). The existing `mapDataToV3Fields` emits a DIFFERENT vocabulary (`[date.created]`, `[propertycontact.company]`, `[fee]`…). **They are NOT interchangeable.**
- **→ Phase-2 needs a NEW `mapDataToV07Fields()`** keyed to v07's tokens. And version selection must pick BOTH the right template AND the right mapper (version→template + version→mapper pairing). This is the core wiring design decision.

### Seam 2 — placeholder → job-data coverage (incl PRD-A fields + gap fields)
- **Available now** (job_submissions / job_loe_details, incl PRD-A): ClientFirst/Last/Company/Org-Address/Phone/Email, JobNumber, JobName, PropertyName/Address/Type, InterestAppraised(propertyRightsAppraised), AuthorizedUse, ReportType, AssignmentType, Fee, RequestDate/SignedDate/EffectiveDate, ReportFormat, ValueScenarios, TransactionStatus, ZoningStatus.
- **GAP fields with NO clean source yet** (PRD-B Phase-2 named these): CurrentUseImprovements, ProposedUseImprovements, ApproachestoValue (cascade), Valuetimeframe, ValueScenario1-6 + EA/HCSummary1-6 (narrative Text Library, not dropdowns), ClientDocuments, PreviouslyAppraised, DeliveryTime(weeks). → must add these to the job-prep area (overlaps PRD-A field work — do in the same area so they sync).
- **Dedup risk:** several v07 tokens collide with PRD-A's still-pending Ben rulings (AuthorizedUse↔IntendedUses, etc.). Phase-2 mapping should reuse PRD-A's resolved targets — gate on those rulings.

### Seam 3 — DocuSeal signature tags + Chris's signatory signature (HOW applied)
- **Client signature:** replace the v07 `.sig-field-slot` placeholder div with `<signature-field role="First Party" required="true">` + a `<date-field role="First Party">`; keep the 340px underline rule. `role` must match the submitter `role:'First Party'`.
- **Chris's signature (Valta side):** in the current model Chris's sig is a STATIC baked image, NOT a DocuSeal field (the company is pre-signed). v07 has a `.sig-logo-slot` → embed `assets/v07img-006-006.png` (extracted from V07) as an `<img>`. DocuSeal renders `<img>` fine. So Chris's sig = static asset embed at generate-time; only the CLIENT signs interactively.
- **Foreseen issue:** anchor-tag positioning in a flowing layout — current v3 uses auto-position; verify the field lands on the underline rule (may need x/y or inline placement). Test on a real submission.

### Seam 4 — conditional Schedule A
- Insert the Schedule "A" property-list block ONLY when `AssignmentType = "Multiple Properties"`. Strip it otherwise (don't leave the placeholder note in production output).
- **Foreseen issue:** WHERE does the property list content come from for multi-property jobs? No data source identified yet — likely a new repeatable field/table. Flag as a gap; single-property jobs are unaffected (block stripped).

### Seam 5 — VERSION SELECTOR (job chooses v07 vs v3/v5, default newest)
- Build on existing `loe_templates`. Steps: (a) register a v07 row (template_html = the styled v07 + anchor tags); (b) add a per-job choice — `job_loe_details.loe_template_id` (or `loe_version`); (c) change `loadV3Template()` to honor the job's choice, defaulting to the NEWEST active (not just `is_default`); (d) pair the chosen version with its mapper (Seam 1).
- **Foreseen issue:** old versions must stay reproducible — the mapper for v3/v5 must remain wired (don't delete). Reproducibility also needs the filled HTML stored per submission (Seam 6).
- **Naming wrinkle:** the DB seed labels are confusing — "V3 - Current Template" row actually holds `V5_TEMPLATE`. Clean up the version labels when adding v07 so the selector UI isn't misleading.

### Seam 6 — PERSISTENCE GAP (loe_submissions missing) — blocks versioning/reproducibility
- `loe_submissions` table DOES NOT EXIST → the filled-HTML insert in `generateAndSendLOE` AND the `status='signed'` update in `docuseal-webhook` BOTH silently fail (caught/logged, never thrown). No per-submission HTML is stored; the webhook's loe_submissions write is dead.
- **→ Create the table** with: job_id, **loe_version/template_id** (which version generated it), loe_html (filled snapshot), docuseal_submission_id, docuseal_slug, signed_document_url, status, timestamps. Make inserts FAIL-LOUD. This is the keystone for "old versions stay reproducible." (Signed-PDF tracking via job_loe_details + job_files already works.)

### Seam 7 — font / CDN (Open Sans @import)
- The styled render loads Open Sans via Google Fonts `@import` and DocuSeal fetched it (verified). **Runtime CDN dependency** — an offline/blocked render falls back to sans-serif (acceptable but off-brand).
- **Options:** (a) accept fallback; (b) self-host/base64-embed the Open Sans woff2 in the template; (c) use the raster letterhead PNG. Recommend (b) embed the font for determinism, OR confirm DocuSeal's egress is reliable. Low risk, easy.

### Seam 8 — per-page COMPACT HEADER (Ben hopes the logo holds at top per page)
- Flowing doc renders the big letterhead once (page 1). A per-page top logo needs a running header. `@page @top-center { content: ... }` can only hold text/counters, NOT an SVG/`<img>`. The CSS-paged-media way is a running element: `header { position: running(h) }` + `@top-center { content: element(h) }` — supported by the paged-media engine DocuSeal appears to use (the @bottom margin-boxes work, indicating WeasyPrint/Prince-class, not Chrome).
- **Feasibility/cost:** PLAUSIBLE but UNVERIFIED for this engine + the SVG-in-running-element case. Cost = one render test cycle. **Recommendation:** the @page footer already carries "VALTA PROPERTY VALUATIONS LTD." on every page; if Ben wants the top logo too, I run one running-element test before committing. Don't block the wiring on it.

### Seam 9 — section numbering (tidied 1-16 kept)
- Kept the clean sequential 1-16 (pandoc artifacts 0-start/17/18/20 normalized). Titles + legal text verbatim. **Needs Ben/legal sign-off** that the renumber is cosmetic-only before this ships as the live contract.

## Proposed Phase-2 sequence (once approved)
1. Register v07 in `loe_templates` (+ clean version labels) and add anchor tags + Chris-sig `<img>` to the template.
2. Create `loe_submissions` table (+ loe_version col), fail-loud inserts. (Seam 6.)
3. Add the version selector (job-level choice, default newest) + version→template+mapper pairing. (Seams 1,5.)
4. Write `mapDataToV07Fields()` for the available fields; add the gap fields to the job-prep area (coordinate with PRD-A). (Seams 1,2.)
5. Conditional Schedule A strip/insert. (Seam 4.)
6. End-to-end test on the pinned job: generate → submit → (self-sign) → webhook → DB, screenshot-read each stage. (Seam 3.)
7. Font embed decision (Seam 7); optional per-page-header test (Seam 8).

## Open questions for Ben / co-architect (gate the build)
- PRD-A rulings on the colliding fields (AuthorizedUse/ReportFormat/etc.) — Phase-2 mapping reuses those targets.
- Gap-field sources (CurrentUse/ProposedUse/ApproachesToValue/EA-HC narratives/ClientDocuments/PreviouslyAppraised/property-list) — where do these come from?
- Version-selector UX: dropdown in the LOE section? default = newest active; confirm.
- Per-page top logo: worth a running-element test, or is the footer branding enough?
- Section renumber 1-16: legal sign-off to ship.
