---
content_type: prd
title: "APR V4 — V3→V4 Transition Readiness, Part 1: test-data split, transition proof, S3 SharePoint folder tab"
prd_series: APR-V4
prd_seq: 1
status: DRAFT — awaiting Visual Spec round-trip + qa spec-gate + Ben lock
created: 2026-07-09
author: frontier-reviewer (PRD-AUTHOR mode, with Ben) — co-architect secondary owner at build line
gate: qa-agent (spec-review + INV PROVED-BY)
anchors:
  - docs/Architecture/V4-COMPLETION-PLAN.md  (the parent plan this PRD executes a slice of)
  - docs/Architecture/V3-V4-FIELD-ALIGNMENT-DELTA.md
  - docs/00-APR-MASTER-DASHBOARD.md  (SharePoint folder spec + Entra app ground truth, Live Parts 2b)
tags: [apr, v4, v3-v4-transition, test-data, test-input, sharepoint, client-documents, transition-testing]
---

**Tags:** #apr #v4 #v3-v4-transition #test-data #sharepoint #transition-testing
**Entities:** [[APR-Dashboard-v3]] [[V4-COMPLETION-PLAN]] [[TestInputDashboard]] [[SharePoint]]

> **📑 Series: APR-V4 — this is PRD 1 of the series.** Parent plan: [V4 Completion Plan](~/Development/APR-Dashboard-v3/docs/Architecture/V4-COMPLETION-PLAN.md) — this PRD executes its step-2/step-3 seam (test-data + transition proof) plus the S3 ruling Ben issued 2026-07-09.

> **⭐ PRD TYPE: Dual-Agent Deployment** — co-architect × qa-agent, two gates, forked builder, independent verify. Authored by frontier-reviewer with Ben; co-architect owns from lock onward (assembly prompt, deploy, verify, fold).

---

## ⭐ Key Results (determined with Ben, 2026-07-09)

1. **The test-input page has two separate fill buttons — "Fill V4 Test Data" fills every fillable field EXCEPT the V3-origin tabs; "Fill V3 Test Data" beside it fills ONLY the V3-origin tabs.** — **Prove:** screenshot of both buttons; after Fill-V4, the S1/S2 tabs are untouched (spot-check screenshot); after Fill-V3, only S1/S2 populate. **Status: open.**
2. **The V3 test data on the v4 page is the SAME data definition the V3 app fills with — one source, imported, never a copy.** — **Prove:** code shows the v4 button importing from V3's `testDataGenerator` (or a shared module both import); change one value in the source, both the V3 form fill and the v4 S-tab fill show it. **Status: open.**
3. **The V3→V4 transition is PROVEN: a real V3 job pushed via "Create Report" lands in the v4 builder with its fields matching the Fill-V3-Test-Data baseline, and any mismatch is reported as a field-level diff.** — **Prove:** the E2E run artifact — screenshots of the populated S-tabs + a diff table (pushed-job values vs baseline values per field id) with zero unexplained mismatches. **Status: open.**
4. **The S3 Client Documents tab shows the job's SharePoint folder buckets — exact SharePoint names — with each bucket's contents listed and drag-and-drop upload into each bucket.** — **Prove:** screenshot of the tab matching the approved layout; drop a file on a bucket in the browser → the file is visible in that folder on SharePoint web. **Status: open.**

---

## What it is

Make v4's test surface honest and the V3→V4 handoff provable. Today one "fill with test data" floods everything including the tabs that should only ever receive data from the V3 dashboard, the V3 test data on the v4 side is a separate copy that can rot, and the S3 Client Documents tab is a placeholder card. This PRD splits the fill into V4-only and V3-only buttons fed by one V3 source of truth, uses that baseline to prove the real Create-Report push field-for-field, and turns S3 into a live SharePoint folder surface with drag-and-drop upload. Reach here when: v4 field testing must not mask handoff bugs, and client files need a visible home in the builder.

## Why

- The Fill-V3 / push-a-real-job pair is the transition test Ben wants: same dataset in by two routes, compare. Without the split, test fills paper over bridge gaps.
- V4's S-tab test values currently come from `TestDataSet1.ts` while V3's form fills from `testDataGenerator.ts` — two definitions. When V3 fields change, v4's copy silently drifts.
- S3 today is a UI-only placeholder (per the comment in `TestInputDashboard.tsx`); the SharePoint folder plumbing (Entra app, per-job five-folder scaffold via `create-job-folders`) already exists and is verified live — the tab just doesn't use it.

## Premise

Prove the transition by comparing two routes of the SAME dataset (button fill vs real push) rather than by hand-auditing the bridge mapping file — the obvious alternative (read `useLoadJobIntoReport` and eyeball its coverage) was already tried in the completion plan era and can't catch runtime coercion, dropdown-option mismatches, or silent nulls; a value-level diff on live surfaces catches all three.

## Feature surface

- **Fill V4 Test Data button** (rename of the existing fill): fills all report-builder sections EXCEPT the V3-origin sections (client-intake, loe-prep, and any section the registry marks V3-origin). S3 is never filled (it's files, not fields).
- **Fill V3 Test Data button**, beside it: fills ONLY the V3-origin sections, values sourced from V3's single test-data definition.
- **Shared test-data source:** V3's generator becomes (or is wrapped as) a shared module; both the V3 submission form fill and the v4 V3-fill import it. The v4 side maps V3 field keys → v4 registry field ids through the SAME mapping the real bridge uses (`useLoadJobIntoReport`'s map), so the fill exercises the production mapping, not a parallel one.
- **Transition diff run (test procedure, scripted):** fill-V3 baseline → snapshot store values → clear → push a real V3 job seeded with the same dataset via Create Report → snapshot again → field-level diff report.
- **S3 SharePoint folder tab:** bucket cards named exactly as the SharePoint folders for the job; per-bucket file list (name, modified); drag-and-drop upload into a bucket via the existing Graph app (server-side creds, same pattern as `create-job-folders`); link out to the folder on SharePoint web.
- **Sync visibility:** if a V3 field exists in the shared dataset with no v4 mapping (or vice versa), the test-input page's mapped/unmapped menu surfaces it — drift is KNOWN, not silent.

## Visual Spec  (MANDATORY — this renders; round-trip owed to Ben BEFORE lock)

**Status: OPEN — this is the named step handed to co-architect:** dispatch the ui-designer to draw, Ben picks before lock.

1. Mock of the test-input header with the two fill buttons (naming, placement, which is primary).
2. Two to three drawn layout options for the S3 tab, each with its trade-off:
   - (a) the job's five top-level folder buckets as cards;
   - (b) client-supplied-centric: the "2. CLIENT SUPPLIED" bucket promoted, with the client-required file categories (Property Details / Prior Appraisal, Proforma, Unit Mix or Rent Roll, Operating Expenses, Drawings/Plans) as sub-buckets, other folders collapsed;
   - trade-off to name on each: mirror-SharePoint-exactly vs organize-around-what-the-client-owes.
3. State set: empty bucket / loading / upload-in-progress / upload-error / many files (overflow), and the no-folders-yet state (job whose folder set was never created — offer the existing create action).

**Open for Ben at the drawn round-trip:** which bucket set S3 leads with (option a vs b above).

## What This Touches

- **Adds:** the second fill button + its handler; the shared test-data module (or export seam on `testDataGenerator.ts`); a Graph list-folder-contents + upload path (new serverless/edge function beside `create-job-folders`); the S3 bucket UI; the transition-diff script/procedure doc.
- **Changes:** `src/features/test-input/TestInputDashboard.tsx` (button split + S3 tab body); `src/features/report-builder/data/TestDataSet1.ts` (V3-origin values REMOVED or delegated to the shared source — V4-only values stay); V3 `src/utils/testDataGenerator.ts` (exported/shared, values unchanged).
- **Removes:** the S3 UI-only placeholder card; any V3-origin literals duplicated inside `TestDataSet1.ts`.

## Settled context — evaluate around, don't re-open

- **Fields-first order** (V4-COMPLETION-PLAN, Ben 2026-06-21): standalone-playable first, V3→V4 wiring last. This PRD respects it — the fill split IS the standalone half; the diff run exercises the already-shipped push.
- **V3 is the source of truth for V3-origin fields** (G4, locked). The shared dataset direction is V3 → v4, never edited on the v4 side.
- **SharePoint folder spec is locked** (master dashboard Live Parts 2b): site `/sites/V`, job folder under `2.Jobs/{YEAR}/`, five named subfolders; `create-job-folders` is the wired mechanism; one Entra app, server-side creds.
- **Create Report push shipped** (FIX 5a/5b + merge/preview fixes, late June): save→pull, UPDATE-not-INSERT, gap-fill never clobbers real V3 data. This PRD tests it; it does not reopen its design.
- **No-login app** — no auth work in any of this; RLS posture unchanged.
- **Registry hygiene sequence** (completion plan): test-data fills run against the FINAL registry structure — if any registry-touching work is in flight at build time, this PRD's fill work lands after it.

## Architecture Invariants

- **INV-0 (thesis):** the test surface exercises PRODUCTION code paths — the v4 V3-fill goes through the same field mapping the real bridge uses, and S3 uploads go through the same Graph app as folder-create. No parallel test-only mapping, no second render/upload engine. *Proved by:* code read — one mapping definition imported by both fill and bridge; one Graph credential path.
- **INV-1:** one V3 test-data definition. No V3 field value literal exists in two places. *Proved by:* grep — V3-origin values appear only in the shared module.
- **INV-2:** Fill-V4 writes zero values into V3-origin sections. *Proved by:* store snapshot after Fill-V4 shows V3-origin field ids all empty.
- **INV-3:** S3 reads and writes ONLY the current job's folder subtree; creds never reach the client bundle. *Proved by:* the upload function takes the job's folder path server-side; bundle grep shows no Graph secret.
- **INV-4:** the Create Report push behavior (UPDATE-not-INSERT, gap-fill-never-clobbers) still holds after the test-data changes. *Proved by:* re-run of the FIX-5 E2E check as part of the diff run.

## Done =

All four Key Results proven with their named artifacts, INVs proved, qa independent verify on the live apr-v4 deploy (fresh/incognito load), diff report shows zero unexplained field mismatches, and one file drag-dropped in the browser confirmed present on SharePoint web.

## Guardrails

- Never fake the V3 side: no hand-typed V3 values anywhere in v4 test tooling.
- The diff run must FAIL LOUD on mismatch — a mismatch is the product (a mapping bug found), never smoothed over.
- S3 never becomes file STORAGE in the app — SharePoint stays the home; the tab is a window plus a drop target.
- No registry field additions for S3 (files, not fields) — `fieldRegistry.ts` untouched by the S3 chunk.
- Existing single-button users: the renamed Fill-V4 keeps its current placement so the workflow doesn't move.

## Build order (chunks)

1. **Shared test-data seam** — extract/export V3's dataset; v4 V3-fill button consuming it through the bridge mapping. (Registry untouched; smallest blast radius.)
2. **Fill split** — scope the existing fill to V4-only sections; both buttons live on test-input.
3. **Transition diff run** — seed a V3 job with the shared dataset, push, diff, report. (Read-only against the app; produces the KR3 artifact.)
4. **S3 folder tab** — Graph list + upload function, bucket UI per Ben's picked layout. (Independent of chunks 1–3; can run parallel after the Visual Spec locks.)

## Current state

- v4 live at apr-v4.vercel.app, flag-gated; test-input page works (fill → Load Data → View Report).
- One fill button flooding all sections from `TestDataSet1.ts`; V3 app fills separately from `testDataGenerator.ts` (drift risk live today).
- S3 = placeholder card, no folder wiring; SharePoint folder-create wired + verified elsewhere in the app (`create-job-folders`, "Asset Folders" button).
- Create Report push + merge/preview fixes shipped late June; never proven with a controlled same-dataset diff.

---

*Draft by frontier-reviewer with Ben, 2026-07-09. Next: ui-designer drawn options (via co-architect) → qa spec-gate → Ben lock → PRD-BRIEF-APR-V4-01 filled → co-architect builds.*
