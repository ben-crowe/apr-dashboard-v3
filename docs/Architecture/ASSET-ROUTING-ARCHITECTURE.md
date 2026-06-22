---
content_type: spec
title: Asset Routing Architecture — SharePoint → Supabase → Report (folder-as-router)
created: 2026-06-22
author: co-architect (owns architecture/spec)
gate: qa-agent (produces sample-doc set + per-file→section mapping, gates this spec)
status: qa-gated PASS-WITH-FIXES applied (intake-upload as first-class source, re-sync semantics, INV-0); canonical category list pending STEP 2 (tab-scheme)
purpose: Define how client-supplied files move from collection (SharePoint) into the appraisal's permanent home (Supabase) and land in the correct report section/field — driven by ONE canonical asset-category set, with folder placement as the primary routing signal.
tags: [apr-dashboard, assets, document-intake, sharepoint, supabase, routing, report-builder, v4]
---

# Asset Routing Architecture

## End-state (locked with Ben 2026-06-22)

**Supabase is the AUTHORITATIVE system of record for ALL appraisal assets.** SharePoint is an
**OPTIONAL** front-door / intake source that ports INTO Supabase — never a dependency.

Ben's framing: SharePoint's value is **human comfort** (people trust a folder, it *feels* safe to
see files "in there"), NOT the storage. So the system must NOT depend on SharePoint either way: a
client who trusts Supabase can drop SharePoint entirely; one who likes folders keeps it as an
optional front-door + mental backup. Both "eventually obsolete for some" and "fine as a default for
others" hold under **optional**. The "reference the SharePoint folder" button is the bridge until
real ingest is live, then it becomes one optional source among others.

The clean flow Ben described:

```
structured COLLECTION → structured INGEST → lands in the right REPORT spot
(SharePoint folders   →  pull into        →  report section/field
 matching report cats)    Supabase + tag)     by category
```

## The spine — folder placement IS the routing signal

The single biggest simplifier (Ben, 2026-06-22): **the SharePoint folder structure MIRRORS the
report asset categories.** The client collecting files into the right subfolder is already
pre-sorting for ingest. A file dropped in the `site-photos` subfolder lands in the site-photos
report area automatically — **folder placement becomes the route**, so we lean FAR LESS on
content-scanning.

This means **content-scan/classify is a SECONDARY fallback** — used only for misfiled or
ambiguous files — NOT the primary router.

## ONE canonical asset-category set drives THREE layers

A single category set is the contract every layer shares:

| Layer | How it uses the category set |
|---|---|
| **1. SharePoint subfolders** | the per-job folder tree's subfolders ARE the categories (the client's drop targets) |
| **2. Supabase storage layout** | `documents` bucket path prefix + a `category` column on `job_files` |
| **3. Report drop-zones** | each report section/field area maps to one category — where the asset renders |

> **⛔ The category list is DERIVED from STEP 2 (the tab-scheme — "where things land").** This spec
> locks the *model + interfaces* now; the actual category enum is filled once STEP 2 settles the
> report sections. qa builds the sample-doc set against the SAME list, so the two dovetail.

### Provisional category set (to confirm against STEP 2 output)

Driven by the report sections + the client REQUIRED-DOCUMENTS list (from REPORT-BUILDER-TAB-SCHEME.md):

- `site-photos` (subject exterior/interior — inspection)
- `comp-photos` (sales + rent comps)
- `maps-exhibits` (location/aerial/plat maps)
- `site-plans-surveys` (Drawings/Plans — client or appraiser)
- `prior-appraisal` (Full Property Details / Prior Appraisal)
- `proforma`
- `rent-roll-unit-mix` (Unit Mix MF/SS or Rent Roll)
- `operating-expenses` (1–3yr historical + budget)
- `misc-uncategorized` (the fallback bin → triggers content-scan)

*(Final names + completeness gate on STEP 2. The `misc-uncategorized` bin is the ONLY thing the
content-scan layer routes from.)*

## Current ground truth (qa-verified off code, 2026-06-22)

What already exists — build ON this, don't rebuild:

1. **Intake already lands in Supabase.** Client intake files upload to the `documents` bucket +
   `job_files` table today.
2. **SharePoint tree is auto-created per job.** `api/valcre.ts` creates a parent folder + **5
   standard subfolders** per job; tracked via `job_submissions.sharepoint_folder_url`.
3. **GAP (net-new, exists nowhere):** nothing scans file CONTENTS or routes each file to a report
   section/field.

## Collection sources — TWO first-class paths (not just SharePoint)

Because SharePoint is OPTIONAL, it is NOT the only source — and for a client who skips it, the
**intake-upload path is the primary (only) source.** Both must categorize:

| Source | When | How it gets a category |
|---|---|---|
| **Intake-upload** (existing: client uploads at submission → `documents` bucket + `job_files`) | every job; the ONLY source for no-SharePoint clients | the intake `DocumentsSection` presents the SAME category drop-zones (folder-as-router at upload time) → stamp `category` on the `job_files` row at upload. If no category chosen → explicit `misc-uncategorized` (→ Piece D), never a silent null. |
| **SharePoint** (optional front-door) | when a client prefers folders | category read from the subfolder the file sat in (Piece B) |

> **Why this is load-bearing:** if intake-uploaded files land with NO category, a no-SharePoint
> client's files ALL funnel to `misc` → Piece D scan, making the "fallback" the default path. Intake
> categorization at upload keeps folder-as-router true for BOTH sources.

## Source-of-truth + re-sync semantics (Supabase wins, post-ingest — full stop)

"Supabase authoritative" with teeth:

1. **Re-sync is ADDITIVE-ONLY.** A SharePoint file disappearing (deleted/renamed there) NEVER
   deletes or orphans the corresponding Supabase row. Sync adds/updates; it does not destroy.
2. **Supabase-side edits are NEVER overwritten by a later SharePoint sync.** Once a row exists, any
   category change or edit made in Supabase is final — a subsequent sync must not clobber it
   (idempotent on content-hash/path key; on conflict, Supabase state wins).
3. Net: **post-ingest, Supabase is the system of record, period.** SharePoint can only contribute
   NEW assets, never override or remove what Supabase already holds.

## The three build pieces (this workstream — NOT the registry sequence)

### Piece A — align collection structure (cheapest, highest leverage)
Realign the `api/valcre.ts` auto-created subfolders from the current 5 generic ones to the
**canonical category set**. This turns collection into pre-sorting at zero scan cost. The single
change that makes folder-as-router work.

### Piece B — ingest/sync SharePoint per-job folder → Supabase
Pull each per-job folder's contents into the `documents` bucket + `job_files`, stamping each row
with its `category` (read from the subfolder it came from). Build on the existing bucket + table.
Idempotent (content-hash or path key) so re-sync doesn't duplicate.

### Piece C — route asset → report section/field
Map each `job_files.category` to its report drop-zone. Folder-derived category = direct route.
`misc-uncategorized` → Piece D.

### Piece D — content-scan/classify (SECONDARY fallback only)
Scan/classify ONLY misfiled or ambiguous files (the `misc-uncategorized` bin) to suggest a
category. Never the primary router; a confidence-gated assist.

## Sequencing

- **Piece A** can spec now; the subfolder list locks when STEP 2 gives the category set.
- **Pieces B/C** depend on the category set (STEP 2) + the report drop-zone map.
- **Piece D** is last (fallback, only valuable once A–C handle the happy path).
- Runs **ALONGSIDE** the registry sequence — not blocking it — but the routing TARGETS wait on
  STEP 2 settling where things land.

## Split (locked with qa)

- **co-architect** — owns this architecture/spec (the SharePoint↔Supabase↔report asset model).
- **qa-agent** — produces a realistic sample client-doc set + per-file→report-section mapping,
  built around the SAME canonical category set; gates this spec.

## Invariants (verbatim proof targets)

**INV-0 — folder-placement-as-route (the spine):** A file placed in category subfolder `X` MUST
land in report drop-zone `X` with NO content-scan.
- **FAIL-WHEN:** a correctly-foldered file needs scanning to route.
- **PROVED-BY:** drop a sample file in the `site-photos` subfolder → ingest → assert
  `job_files.category = site-photos` AND it renders in the site-photos report area AND the scanner
  was never invoked.

## The reenactment (Ben's ask)

Before building any scanning system: reenact the flow with a realistic sample set of client
documents (qa's set) and define where each file lands in the report. This proves the
folder-as-router model end-to-end on real-shaped inputs and surfaces the true category list.

---

*Drafted 2026-06-22 by co-architect. Pairs with REPORT-BUILDER-TAB-SCHEME.md (STEP 2 supplies the
category set) + V4-COMPLETION-PLAN.md. The category set is the shared contract — link here, don't
re-derive per piece.*
