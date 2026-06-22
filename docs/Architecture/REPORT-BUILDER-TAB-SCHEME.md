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

### REPORT layer (contiguous 01–16, report-flow order preserved)
| New # | Section | (was) |
|---|---|---|
| 01 | Cover Page | 01 |
| 02 | Report Information | 05 |
| 03 | Executive Summary | 06 |
| 04 | Site Details | 08 |
| 05 | Location Analysis | 09 |
| 06 | Property Taxes | 10 |
| 07 | Market Analysis | 11 |
| 08 | Improvements | 12 |
| 09 | Zoning | 13 |
| 10 | Highest & Best Use | 14 |
| 11 | Valuations (All 3 Approaches) | 15 (+ COST — see note) |
| 12 | Sales Comps | 18 |
| 13 | Rent Comps | 19 |
| 14 | Rent Roll | 20 |
| 15 | Certification | 22 |
| 16 | **Images & Exhibits** | (was S3) — appraiser-generated photos/maps/comps |

## The key reframe — images are REPORT content, not client-collection

Earlier instinct put images at S3 (assuming the client supplies them). **The client submission form
proves otherwise:** the client submits DOCUMENTS + a tour *contact* — the appraiser takes the report
photos on the inspection. So:
- the ~133 "image management" fields (subject/exterior/interior photos, comp photos, maps) are
  **appraiser-generated → they belong at 16 (Images & Exhibits)**, the report layer.
- **S3 is a CLIENT DOCUMENTS tab** (file uploads for the required docs below), the collection layer.

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

## Execution notes (for dev-3, qa-gated) — RULINGS folded in (2026-06-22, dev-3 ground-truth confirmed)

1. **Renumber per the table** — report layer contiguous 01–16, S1/S2/S3 = collection layer. Map is clean, ready.
2. **Image set → 16 — RULED: all 134 stay at 16.** dev-3 confirmed all 134 are inspection/appraiser-generated.
   The 4 flagged `img-site-plan-1/2` (+titles) STAY at 16 — they are report DISPLAY SLOTS (where a site-plan/
   survey image lands in the report), regardless of whether the source file came from the client. A
   client-supplied survey/plan is COLLECTED as the S3 "Drawings/Plans" document; the appraiser then PLACES
   the image into the 16 slot. **Clarified model: image-mgt = report display slots; S3 = client file collection.** Don't conflate file-source with display-slot.
3. **S3 = Client Documents → ⛔ OPEN BEN DECISION (not a relabel — a BUILD).** dev-3 confirmed the builder has
   NO per-doc upload fields (only a `client-documents` multi-select checklist + `file-number` text). So S3 is
   NEW work. **The real question for Ben:** build dedicated upload fields in the builder for the required docs
   (Proforma/Unit-Mix/OpEx/Prior-Appraisal/Drawings), OR have S3 just CHECKLIST/REFERENCE the client files that
   already land in the SharePoint "2. CLIENT SUPPLIED" folder (don't duplicate storage)? **Co-arch lean:
   reference SharePoint, don't rebuild upload/storage in the builder — but Ben's scope call.** Parked until ruled.
4. **COST — RULED: folds UNDER 11-Valuations as the Cost panel (a GROUPING, NOT a delete).** dev-3 confirmed
   cost = 32 real Cost-Approach fields (land/RCN/depreciation/site/value); the "Valuations" calc tab's 245 are
   income-approach math, so COST is NOT a dup of it. Group the three approaches (income + sales + cost) under
   11-Valuations. `cost-s` = 1 empty stub field = **retire candidate** (confirm truly unused, then retire per FIX-1).
5. Folds into the registry pass; same gate loop (dev-3 executes → qa verifies → co-arch commits). Gaps closed
   only, NOT a report-flow re-sequence, unless Ben calls a reorder separately. **Renumber + #2/#4 are executable
   once Ben rules #3 (S3 build-vs-reference); execution likely resumes post-compact-prime.**

---

*Locked with Ben 2026-06-22. Pairs with REGISTRY-DUP-ID-RULE.md + V4-COMPLETION-PLAN.md. The collection layer (S1/S2/S3) is the input/prep that eventually migrates to the V3-style dashboard.*
