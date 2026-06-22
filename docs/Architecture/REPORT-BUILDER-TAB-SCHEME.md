---
content_type: spec
title: Report Builder — Tab/Section Scheme + Collection-vs-Report Layer Model
created: 2026-06-22
author: co-architect (brainstormed + locked with Ben)
gate: qa-agent
executor: ui-designer (folds into the registry pass)
purpose: Lock the report-builder tab numbering + the collection-layer/report-layer model, so the non-sequential tab numbers get cleaned up consistently and everyone shares the same field-category language.
tags: [apr-dashboard, report-builder, tabs, sections, field-registry, collection-layer]
---

# Report Builder — Tab/Section Scheme

## The model — two layers, split by SOURCE (locked with Ben 2026-06-22)

The report builder's tabs are really **two layers**:

1. **COLLECTION layer (the "S" tabs) — input gathered FROM the client.** What the client gives us.
   This is the prep/input layer; conceptually it belongs with the V3-style prep dashboard and will
   likely migrate there eventually (it's input, not report).
2. **REPORT layer (numbered tabs) — the report's own content,** entered/generated in the builder by
   the appraiser. The fields that "go into the report."

The split is by **source**, and the live SharePoint folder structure already draws the same line
("2. CLIENT SUPPLIED" vs "3. WORK FILES") — so it's how the job already organizes itself.

## Why the numbers were a mess (the current state)

Three numbering schemes in one list — `S1/S2/S3` prefixed, then `01/05/06…` zero-padded with gaps
(02,03,04,07,16,17,21 missing = removed/merged tabs), then `COST` with no number at all. The gaps are
the history of deleted/compacted tabs showing through.

## The locked scheme

### COLLECTION layer (S-tabs — from the client)
| Tab | Section | What it is |
|---|---|---|
| **S1** | Client Intake (V3) | the V3 intake fields — mapped in |
| **S2** | LOE Prep (V3) | the V3 LOE fields — mapped in |
| **S3** | **Client Documents** | the files the client is REQUIRED to submit (list below) — NOT images |

### REPORT layer — ⚑ CORRECTED RULING (Ben, 2026-06-22): KEEP ALL TABS, sequential, NO merges

> **Supersedes the original "contiguous 01–16" table below.** dev-3 verified against the LIVE
> builder: there are **22 real report tabs**, none empty — the missing numbers (02/03/04/07/16/17/21)
> are NOT gaps, they're tabs that were grouped/renamed, every slot is a real tab. The original table
> assumed 6 merges that are NOT happening. **Ben's ruling: keep every tab, one continuous sequential
> run, no deletions.**
>
> **The scheme:** one continuous numbering — `S1, S2, S3` on the three collection tabs (the only
> special-cased prefix, marking them as the **client-submission layer**), then the report tabs keep
> their current order and continue the numbers straight through (do NOT restart at 01). Result = a
> clean sequential run with zero gaps, every tab preserved.
>
> ## ⛔ CRITICAL — S3 is CLIENT DOCUMENTS, **NOT** Image Management (this is the part that keeps getting missed)
>
> The three S-tabs are ALL "from the client." So the third one **must be Client Documents** — the
> files the client submits (prior appraisal, proforma, rent roll/unit mix, operating expenses,
> drawings/plans, tour contact). Per Ben's S3 ruling: S3 **references the SharePoint folder** (the
> existing client-documents checklist + file-number), it does NOT build new upload fields.
>
> **The builder currently mislabels the third tab as "Image Management" — that is the bug to fix.**
> The ~133 image-management fields are **appraiser-generated** (inspection photos, comp photos, maps)
> — they are NOT something the client submits, so they do **NOT** belong in the S-collection layer.
> They **MOVE OUT of the S3 slot INTO their own REPORT-layer section, "Images & Exhibits"** (sits in
> the numbered report run). This is a RELOCATION, not a delete — every field is preserved, just homed
> in the right layer.
>
> So STEP 2 = renumber (keep all report tabs, sequential) **+ this S3 fix**: make S3 = Client
> Documents, and relocate the image-mgt fields to the report-layer Images & Exhibits section.
>
> **COST → Valuations merge is DEFERRED** — it's a content decision, not a numbering one (still
> co-arch's lean = group under Valuations, but parked). "No merges this pass" = don't fold COST; it
> does NOT mean "don't move the images" — the image relocation IS in scope (it's what makes S3 correct).
>
> **Where the numbering lives:** the builder's tab config (+ the testing-workbench
> `TestInputDashboard.tsx sectionNameMapping`) — NOT the locked `fieldRegistry.ts`, so this renumber
> does not collide with the registry dup/bridge work. dev-3 owns the exact live tab list as ground truth.
>
> **Downstream:** the final section list this produces feeds the asset-routing canonical category set
> (ASSET-ROUTING-ARCHITECTURE.md) + qa's sample-doc mapping — so the Images/Exhibits landing matters.

**Original table (HISTORICAL — assumed merges, do NOT execute literally):** contiguous 01–16 with Cover→01, Report Info→02, Exec Summary→03, Site→04, Location→05, Taxes→06, Market→07, Improvements→08, Zoning→09, HBU→10, Valuations(+COST)→11, Sales Comps→12, Rent Comps→13, Rent Roll→14, Cert→15, Images & Exhibits→16. *(This is what mis-stated 22 tabs as 16 — kept only to show what was superseded.)*

## The key reframe — images are REPORT content, not client-collection

Earlier instinct put images at S3 (assuming the client supplies them). **The client submission form
proves otherwise:** the client submits DOCUMENTS + a tour *contact* — the appraiser takes the report
photos on the inspection. So:
- the ~133 "image management" fields (subject/exterior/interior photos, comp photos, maps) are
  **appraiser-generated → they belong in the report-layer "Images & Exhibits" section** (at its real
  sequential slot in the continuous numbering — NOT a hardcoded "16"; under keep-all-22/no-merge it
  lands wherever the straight renumber puts it, likely ~19–22).
- **S3 is a CLIENT DOCUMENTS tab** (references the client's submitted files — see S3 ruling below),
  the collection layer.

## What the client is REQUIRED to submit (defines S3 + the SharePoint "client supplied" folder)

From the client appraisal-request submission form, "Required Documents":
- **Full Property Details or Prior Appraisal**
- **Proforma**
- **Unit Mix** (MF/SS) **or Rent Roll** (Retail/Office/Industrial)
- **Operating Expenses** (1–3 Years Historical and Budget)
- **Drawings/Plans** (New Developments only)
- **Contact for property tour** (Existing Buildings only)
- Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (max 10MB/file)

This is the canonical definition of "what comes from the client" — it scopes S3's field set and the
SharePoint `2. CLIENT SUPPLIED` folder. (Documented 2026-06-22 — was never formally spelled out.)

## Execution notes (for dev-3, qa-gated) — RECONCILED to the corrected ruling (2026-06-22)

> These notes were rewritten to match the CORRECTED RULING banner above. The earlier versions
> described the superseded 16-tab/merge scheme and contradicted the banner (qa caught it). This is now
> the single consistent spec.

1. **Renumber: KEEP ALL TABS, continuous sequential, NO restart.** S1/S2/S3 on the three collection
   tabs, then the report tabs keep their current order and continue the numbers straight through. Do
   NOT execute the old "contiguous 01–16" table — that assumed merges that are not happening. Every
   tab is preserved.
2. **Relocate the image-mgt fields to the report-layer "Images & Exhibits" section.** All ~134 image
   fields are appraiser-generated (inspection/comp photos, maps) — they move OUT of the (mislabeled)
   3rd collection slot INTO their own report-layer section, which lands at its real sequential number
   (NOT a hardcoded 16). The 4 `img-site-plan-1/2` (+titles) go WITH them — they're report DISPLAY
   SLOTS (where a client-supplied survey/plan image is PLACED in the report); the client file itself is
   collected at S3. Relocation, not deletion — nothing is lost.
3. **S3 = Client Documents — RULED: REFERENCE SharePoint, do NOT build upload fields (Ben, this
   session).** The 3rd collection tab becomes Client Documents: it references the client's submitted
   files in the SharePoint "2. CLIENT SUPPLIED" folder (the existing `client-documents` checklist +
   `file-number`), NOT new per-doc upload/storage fields. The builder currently mislabeling the 3rd
   tab as "Image Management" is the bug this fixes. (Permanent ingest of those files → Supabase is the
   SEPARATE asset-routing workstream — see ASSET-ROUTING-ARCHITECTURE.md — not this pass.)
4. **COST → Valuations merge — DEFERRED (no merges this pass).** COST is 32 real Cost-Approach fields
   (NOT a dup of the income-approach Valuations math); co-arch's lean is still to group the three
   approaches under Valuations, but that's a CONTENT decision parked for a separate call. This pass
   does NOT fold COST and does NOT retire the `cost-s` stub. "No merges" applies to COST only — it does
   NOT block the image relocation in #2, which is in scope.
5. Folds into the registry pass; same gate loop (dev-3 executes → qa verifies → co-arch commits).
   Renumber + image relocation + S3-as-reference are executable NOW (Ben has ruled S3). Not a
   report-flow re-sequence — order preserved unless Ben calls a reorder separately.

---

*Locked with Ben 2026-06-22. Pairs with REGISTRY-DUP-ID-RULE.md + V4-COMPLETION-PLAN.md. The collection layer (S1/S2/S3) is the input/prep that eventually migrates to the V3-style dashboard.*
