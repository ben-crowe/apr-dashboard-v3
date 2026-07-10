---
content_type: prd
title: "APR V4 — V3→V4 Transition Readiness, Part 1: test-data split, transition proof, S3 SharePoint folder tab"
prd_series: APR-V4
prd_seq: 1
status: 🔒 LOCKED (Ben, 2026-07-09) — spec-gate PASSED clean, Visual Spec drawn, S3 mirror-SharePoint decided. FROZEN as gated; build authorized (alignment slice → PRD chunks). Changes now require a new revision + re-gate.
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

1. **The test-input page has two separate fill buttons — "Fill V4 Test Data" fills every fillable field EXCEPT the V3-ORIGIN FIELD SET; "Fill V3 Test Data" beside it fills ONLY the V3-origin fields.** — **Prove:** screenshot of both buttons; after Fill-V4, the V3-origin FIELDS are blank (spot-check screenshot); after Fill-V3, only they populate. *(Amended 2026-07-10, chunk-2 grounding, frontier-reviewer sanction: the partition is by FIELD-ORIGIN, not whole section — the loe-prep tab legitimately holds V4-only report fields (the delta doc's Section-D additions), so "tab blank" was the wrong proof; the invariant is "no field double-filled; V3-origin fields only via the V3 route," and it holds.)* **Status: open.**
2. **The V3 test data on the v4 page is the SAME FIXED dataset the V3 side uses — one deterministic definition, imported, never a copy.** — **Prove:** code shows one fixed-dataset export in `testDataGenerator.ts` consumed by both routes; change one value in it → the v4 Fill-V3 button shows the new value AND the transition diff-run's seeded V3 job (which reads the same fixed dataset through the form path — chunk 3) carries it. **NO new V3-form fill UI is built** — the "both routes" are the v4 button and the diff-run's form-seed, not a deterministic-fill affordance on the intake form (gate finding 3, 2026-07-09). **Status: open.**
3. **The V3→V4 transition is PROVEN: a real V3 job pushed via "Create Report" lands in the v4 builder with its fields matching the Fill-V3-Test-Data baseline, and any mismatch is reported as a field-level diff.** — **Prove:** the E2E run artifact — screenshots of the populated S-tabs + a diff table (pushed-job values vs baseline values per field id) with zero unexplained mismatches. **The "zero unexplained" bar REQUIRES the alignment-first order (Build order chunk 0):** run only after S1/S2 alignment lands, so a mismatch means a real bridge bug, not a known-open delta. If the order ever inverts, the delta doc must FIRST be converted to a field-id expected-mismatch list before this proof is mechanically checkable (gate finding 4, 2026-07-09). **Status: open.**
4. **The S3 Client Documents tab shows the job's SharePoint folder buckets — exact SharePoint names — with each bucket's contents listed and drag-and-drop upload into each bucket.** — **Prove:** screenshot of the tab matching the approved layout; drop a file on a bucket in the browser → the file is visible in that folder on SharePoint web. **Status: open.**
5. **Files the client attached on the V3 intake form show up in S3 as an unsorted "Client Submitted" inbox, and each can be dragged into the proper SharePoint bucket — sorting a file MOVES it into that folder on SharePoint.** — **Prove:** submit the intake form with attachments → they appear in the inbox bucket; drag one to a named bucket → it lands in that folder on SharePoint web and leaves the inbox; drag the SAME file twice → exactly ONE copy in the folder (idempotent, gate finding 1); a file over the single-PUT cap → a clear per-file "too large to sort here" error, never a silent failure (gate finding 2). **Status: open.**
6. **(Series Part 2 — declared here, built next PRD) A follow-up email sends the client a link to their own upload page showing the same named folder buckets; client uploads land directly in the matching SharePoint folders.** — **Prove:** (at Part 2) the received email + the client page screenshot + an uploaded file visible in the right SharePoint folder. **Status: deferred to PRD-APR-V4-02 — stays on this list, never dropped.**

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

- **Fill V4 Test Data button** (rename of today's "Load Data" control on the test-input page): fills every fillable field EXCEPT the **V3-ORIGIN FIELD-SET** — an explicit, enumerated id-set, not a whole-section exclude. *(Amended 2026-07-10 with KR1: `loe-prep` is a MIXED section — V3-origin S2 fields PLUS the delta doc's Section-D V4-only report block — so a section filter over-excludes. The id-set spans all of `client-intake` + the V3-origin subset of `loe-prep`, and INCLUDES the ~6 bridge-not-carried V3-origin fields, making the exclude a real INV-2 guard.)* Mechanism: the split parameterizes the existing `loadDataSet1User` store action with the field-id exclusion set; its current **gap-fill-only-blanks behavior is a preserved property** (it already never clobbers bridge-loaded values). S3 is never filled (files, not fields — `client-documents` is a UI-only block, not a registry section).
- **Fill V3 Test Data button**, beside it: fills ONLY the V3-origin field-set (same enumerated ids), values arriving through the production mapping chain below. The builder's DONE hands qa the enumerated id-set for per-id verification at close.
- **Shared test-data source — the three-hop production chain (verified against code):** there are three key spaces (camelCase form keys → snake_case DB columns → kebab-case registry ids) and today NO direct form→registry mapping exists. The design reuses the two production mappings rather than inventing a third:
  1. a **deterministic fixed dataset** is added to `src/utils/testDataGenerator.ts` (the random generator stays for ad-hoc form testing; the fixed set is the transition baseline — a randomized fill can never be a comparison baseline);
  2. the form→DB insert literal inside `useFormSubmission.ts` is extracted into an exported pure `formToDbRow()` (behavior-neutral refactor — the form submit calls the same code);
  3. the DB→registry `fieldMappings` table in `useLoadJobIntoReport.ts` is exported (no behavior change).
  v4's Fill-V3 then computes `fieldMappings(formToDbRow(fixedV3Dataset))` → `updateFieldValue` — both production mappings exercised, zero DB writes, values defined once.
- **Transition diff run (test procedure, scripted via agent-browser — headless, the house default):** Fill-V3 baseline → snapshot store values → clear → seed a REAL V3 job with the same fixed dataset through the actual form path → push via Create Report → snapshot again → field-level diff report. Artifact lands under `builds/`.
- **S3 SharePoint folder tab:** bucket cards named EXACTLY as `JOB_SUBFOLDERS` creates them (`1. REPORT` · `2. CLIENT SUPPLIED` · `3. WORK FILES (TTSZ, PICS, COMPS)` · `4. CLIENT BILLING (Invoice, LOE)` · `5. LETTER OF RELIANCE (LOR)`); per-bucket file list (name, modified); drag-and-drop upload into a bucket; link out to the folder on SharePoint web (the stored `job_submissions.sharepoint_folder_url`).
- **S3 Graph mechanism (extends the EXISTING shared library, `supabase/functions/_shared/graph.ts` — not from zero):** listing extends `listFolderNames` with metadata (`$select` ids/sizes/urls); upload rides the existing `uploadFile` (single PUT to Graph `.../content`). **Single-PUT size cap = 4 MB (Graph simple-upload limit) — NAMED, with explicit over-cap behavior (gate finding 2, 2026-07-09):** a file larger than 4 MB CANNOT be sorted through this path; the UI shows a clear per-file error ("too large to sort here — upload it via SharePoint web" + the folder link-out) instead of a silent no-op, so KR5's "each can be dragged" is honest about the cap. Chunked upload-session (250 MB) is OUT of scope — a Part 2 candidate. Folder location is re-derived by the path convention (`jobFolderInputs`) or an idempotent re-call of `create-job-folders` (returns ids) — **never parsed from the stored webUrl**, which is a browser link only. **Scope pin:** sorting is INBOX→bucket only (a Supabase-storage read + SharePoint upload + row marker); SharePoint bucket→bucket moves are OUT of this PRD (needs a new Graph move helper — Part 2 candidate).
- **S3 job context:** SharePoint folders are per-JOB and the test-input page is standalone. S3 shows the loaded job's folders when v4 was entered from a job (the Create Report route); in standalone test mode it shows a job picker + a no-job empty state. Both states go to the drawn round-trip.
- **Sync visibility:** if a V3 field exists in the shared dataset with no v4 mapping (or vice versa), the test-input page's mapped/unmapped menu surfaces it — drift is KNOWN, not silent.
- **Client-submitted inbox (KR5) — COPY-PLUS-MARK, never delete, IDEMPOTENT:** the V3 intake form's attachments (Supabase storage bucket `job-files`, path `{jobId}/{sanitizedName}`, one `job_files` row each; surfaced on the v3 dashboard's Uploaded Documents section) ALSO appear in S3 as an unsorted **Client Submitted** inbox bucket. Dragging a file onto a named bucket runs **STRICTLY IN THIS ORDER (gate finding 1, 2026-07-09):** (1) read the blob from Supabase storage → (2) `uploadFile` (PUT) to that SharePoint folder under a **ROW-KEYED DETERMINISTIC name** → (3) **ONLY on a 2xx PUT**, mark the `job_files` row filed. **The target name is keyed to the ROW, not the bare filename (gate finding 1-residual, 2026-07-09): `{original file_name stem}-{short job_files.id}.{ext}`** — the client's original stem is kept for readability, and the row-id suffix guarantees uniqueness. Same row re-drag (or a retry after a failed mark) → same path → PUT **OVERWRITES** → **exactly ONE copy, idempotent**. Two DISTINCT rows that happen to share a filename (both "Scan.pdf") get DISTINCT suffixed paths → **neither ever clobbers the other's content** (bare `file_name` would have silently overwritten the first — a data-loss defect INV-5 alone didn't catch). **The Supabase original is NEVER deleted** — the v3 dashboard keeps working unchanged (existing-behavior INV). The filed marker is a NEW column: `job_files` has no status/category column today, so this PRD includes a migration (agents self-apply migrations per project rules).
- **Client upload page + follow-up email (KR6 — Part 2 scope, design-anticipated here):** the bucket component built for S3 must be reusable by a future client-facing page (no dashboard-only assumptions baked in), because Part 2 sends the client a follow-up email linking to their own upload page with the same named buckets, syncing straight into the same SharePoint folders.

## Visual Spec  (MANDATORY — this renders; round-trip owed to Ben BEFORE lock)

**Status: DONE — drawn (ui-designer, 2026-07-09) + layout DECIDED by Ben (mirror SharePoint).** Drawings: `~/Development/KM-Exp/data/screenshots/apr-v4-01/` (header two-button, S3 mirror layout, state set).

1. Mock of the test-input header with the two fill buttons (naming, placement, which is primary).
2. **S3 layout — DECIDED (Ben, 2026-07-09): MIRROR the SharePoint folder set EXACTLY.** The job's five top-level folder buckets as cards, verbatim names, the "2. CLIENT SUPPLIED" bucket included as one of the five (NOT promoted). Reasoning: the buckets ARE the SharePoint folders, so a 1:1 mirror is the honest layout. The client-supplied-first alternative (former option B) is DROPPED — not drawn, not built. The drawn Option A (`apr-v4-01-s3-optionA.png`) IS this layout.
3. State set: empty bucket / loading / upload-in-progress / upload-error / many files (overflow), the no-folders-yet state (job whose folder set was never created — offer the existing create action), the **job-context states** (job loaded via Create Report route = that job's folders; standalone test mode = job picker + no-job empty state), and the **Client Submitted inbox** states (empty = all sorted; populated = files awaiting sorting, visually distinct from the named buckets).

**Open for Ben at the drawn round-trip:** RESOLVED 2026-07-09 — S3 mirrors the SharePoint folder set exactly (see item 2). No layout pick pending.

## What This Touches

- **Adds:** the second fill button + a section-filter parameter on `loadDataSet1User`; the deterministic fixed dataset in `testDataGenerator.ts`; a new edge function beside `create-job-folders` for S3 list/upload (built on `_shared/graph.ts` extensions: list-with-metadata, download-content); the S3 bucket UI (reusable component per KR6); a `job_files` migration adding the filed/sorted column; the transition-diff script + procedure doc.
- **Changes:** `src/features/test-input/TestInputDashboard.tsx` (button split + S3 tab body); `src/features/report-builder/data/TestDataSet1.ts` (**V3-origin entries exist in it today with realistic job values — they get STRIPPED**; V4-only values stay; the four-file-sync rule sanctions the TestDataSet edit); `src/utils/testDataGenerator.ts` (gains the fixed dataset; random mode untouched); `src/components/submission-form/useFormSubmission.ts` (insert literal extracted to exported `formToDbRow()` — behavior-neutral); `src/features/report-builder/hooks/useLoadJobIntoReport.ts` (`fieldMappings` exported — no behavior change); `supabase/functions/_shared/graph.ts` (helper extensions). The v3 dashboard's Uploaded Documents section and the intake upload path keep their current behavior — each gets a still-holds check.
- **Removes:** the S3 UI-only placeholder block in `TestInputDashboard.tsx`; the V3-origin literals inside `TestDataSet1.ts` (belt at both ends with the fill-time section exclusion).

## Settled context — evaluate around, don't re-open

- **Fields-first order** (V4-COMPLETION-PLAN, Ben 2026-06-21): standalone-playable first, V3→V4 wiring last. This PRD respects it — the fill split IS the standalone half; the diff run exercises the already-shipped push.
- **V3 is the source of truth for V3-origin fields** (G4, locked). The shared dataset direction is V3 → v4, never edited on the v4 side.
- **SharePoint folder spec is locked** (master dashboard Live Parts 2b): site `/sites/V`, job folder under `2.Jobs/{YEAR}/`, five named subfolders; `create-job-folders` is the wired mechanism; one Entra app, server-side creds.
- **Create Report push shipped** (FIX 5a/5b + merge/preview fixes, late June): save→pull, UPDATE-not-INSERT, gap-fill never clobbers real V3 data. This PRD tests it; it does not reopen its design.
- **No-login app** — no auth work in any of this; RLS posture unchanged.
- **Registry hygiene sequence** (completion plan): test-data fills run against the FINAL registry structure — if any registry-touching work is in flight at build time, this PRD's fill work lands after it.
- **⚑ SEQUENCING DEPENDENCY — S1/S2 alignment first.** The V3-tab alignment slice (the completion plan's top priority, scoped in V3-V4-FIELD-ALIGNMENT-DELTA.md) is NOT built yet: V4's V3-origin tabs still carry wrong/missing dropdowns and fields. The transition diff run before alignment would report all those KNOWN deltas as noise. Order: alignment lands first, then this PRD's diff run. **KR3's "zero unexplained mismatches" bar is mechanically checkable ONLY under this alignment-first order.** (Fallback if order must invert, gate finding 4: `V3-V4-FIELD-ALIGNMENT-DELTA.md` is a human-readable, field-NAME-keyed scoping table self-described "not the final word" — NOT a field-id whitelist a diff can consume directly. Taking the fallback REQUIRES first converting the delta doc into a field-id expected-mismatch list; without that conversion "unexplained" becomes a human judgment call and KR3's bar is not mechanically checkable. Alignment-first is therefore the REQUIRED path for KR3.)

## Architecture Invariants

- **INV-0 (thesis):** the test surface exercises PRODUCTION code paths — the v4 V3-fill goes through the same field mapping the real bridge uses, and S3 uploads go through the same Graph app as folder-create. No parallel test-only mapping, no second render/upload engine. *Proved by:* code read — one mapping definition imported by both fill and bridge; one Graph credential path. *Fails when:* a test-only mapping OR a second render/upload engine exists anywhere in the path.
- **INV-1:** one V3 test-data definition. No V3 field value literal exists in two places. *Proved by:* grep — V3-origin values appear only in the shared module. *Fails when:* any V3 field value literal is found in a second module (e.g. still in `TestDataSet1.ts`).
- **INV-2:** Fill-V4 writes zero values into V3-origin sections. *Proved by:* store snapshot after Fill-V4 shows V3-origin field ids all empty. *Fails when:* any `client-intake`/`loe-prep` field id holds a value after Fill-V4.
- **INV-3:** S3 reads and writes ONLY the current job's folder subtree; creds never reach the client bundle. *Proved by:* the upload function takes the job's folder path server-side; bundle grep shows no Graph secret. *Fails when:* the upload fn accepts a client-supplied folder path, OR a Graph secret appears in the client bundle.
- **INV-4:** the Create Report push behavior (UPDATE-not-INSERT, gap-fill-never-clobbers) still holds after the test-data changes. *Proved by:* re-run of the existing FIX-5 procedure — `docs/Features/07-Report-Builder/E2E-TEST-WORKFLOW-FIX5.md` — as part of the diff run. *Fails when:* Create Report INSERTs a new row, OR overwrites a bridge-loaded V3 value.
- **INV-5 (idempotent sort + no cross-file clobber, gate finding 1 + residual):** sorting an inbox file to a bucket yields exactly ONE copy of THAT file — a re-drag/retry never duplicates it, AND a different file with the same name never overwrites it. *Proved by:* the PUT targets a ROW-KEYED path (`{stem}-{short job_files.id}.{ext}`) so a repeat PUT of the same row overwrites while distinct rows get distinct paths; test — (a) drag the same inbox file twice → one file in the folder; (b) sort two different files both named "Scan.pdf" → two distinct files in the folder, both intact, on SharePoint web. *Fails when:* a second drag of the same file produces two copies, OR two different files sharing a name collapse to one (either file's content lost).

## Done =

All four Key Results proven with their named artifacts, INVs proved, qa independent verify on the live apr-v4 deploy (fresh/incognito load), diff report shows zero unexplained field mismatches, and one file drag-dropped in the browser confirmed present on SharePoint web.

## Guardrails

- Never fake the V3 side: no hand-typed V3 values anywhere in v4 test tooling.
- The diff run must FAIL LOUD on mismatch — a mismatch is the product (a mapping bug found), never smoothed over.
- S3 never becomes file STORAGE in the app — SharePoint stays the home; the tab is a window plus a drop target.
- No registry field additions for S3 (files, not fields) — `fieldRegistry.ts` untouched by the S3 chunk.
- Existing single-button users: the renamed Fill-V4 keeps its current placement so the workflow doesn't move.

## Build order (chunks)

0. **(Dependency, not this PRD)** the S1/S2 alignment slice — completion-plan priority one — lands first; the diff run (chunk 3) is meaningful only after it.
1. **Shared test-data seam** — fixed dataset in `testDataGenerator.ts`; `formToDbRow()` extraction; `fieldMappings` export; v4 Fill-V3 = the three-hop chain. (Registry untouched; behavior-neutral refactors; smallest blast radius.)
2. **Fill split** — field-id exclusion set on `loadDataSet1User` (Fill-V4 excludes the enumerated V3-origin id-set; Fill-V3 is only-those-ids); strip V3-origin entries from `TestDataSet1.ts`; both buttons on test-input; builder's DONE hands qa the id-set for per-id close verification.
3. **Transition diff run** — seed a V3 job with the fixed dataset through the form path, push via Create Report, diff vs the button baseline (agent-browser, artifact under `builds/`; includes the INV-4 FIX-5 re-run).
4. **S3 folder tab** — `_shared/graph.ts` extensions + new edge function, bucket UI per Ben's picked layout incl. job-context states. (Independent of chunks 1–3; can run parallel after the Visual Spec locks.)
4b. **DEFECT CHUNK — twin-field template disconnect (Ben's live walk, 2026-07-10; sequenced BEFORE chunk 5). CLOSED same day — with a PREMISE CORRECTION:** the original grep read was partly wrong — the `company-*` family is the appraisal-FIRM "Prepared By" letterhead (the LETTERHEAD caution caught it; no client data repointed there). The REAL disconnects, all fixed + qa-proven blank→filled on a real job render: property fields mapped to `property-*` ids while the template reads `subject-*` (repointed; property-name fills both, no template edit); the client city/state/zip template token now composes from the DEDICATED city/province/postal columns instead of parsing the street-only address field (qa's real-job render caught that runtime miss — same code-agrees-runtime-doesn't class as KR3). Banked follow-up: the with-data View Report button gates on the fill path's state and stays disabled after a Create-Report load though the store is populated — widen its enable to include the loaded-job case. The chunk-3 diff proved ROUTE-PARITY only — both fill routes agree — but Ben's walk exposed that both routes target twin field ids the report template partially does NOT read: the template carries real `{{tokens}}` for BOTH twins of several client fields (e.g. client-company-name AND company-name, client-organization-address AND company-address), so pushed data fills one twin while report spots reading the other render BLANK, and "Mapped" in the tabs overstates report coverage. Exactly the blind spot the chunk-3 "Required Framing" declared: agreement ≠ correctness. Work order (react builds, qa gates): (1) template-token coverage audit over both twins of every V3-origin field; (2) canonical-id ruling per REGISTRY-DUP-ID-RULE — with the LETTERHEAD caution: determine whether the `company-*` family is the appraisal-firm block, never repoint client data into letterhead; (3) repoint bridge/fill to the template-wired ids; (4) TDD label pass to registry naming convention; (5) close-proof = KR3 diff RE-RUN (the repoint changes `fieldMappings`, so the diff baseline legitimately shifts — the re-run is the new proof of record) PLUS a rendered-report spot-check showing previously-blank tokens filled. Also folded here: the Create Report destination fix (Ben's ruling: the button lands on the test-input tab view with the job loaded — reuse chunk 4's loaded-job mode; report render remains one step further).
5. **Client-Submitted inbox + sort-to-bucket** — rides on chunk 4's bucket UI; `job_files` migration (filed column) + copy-plus-mark wiring. Runs AFTER the defect chunk (a report rendering blank for real client data outranks the additive inbox).

**Out of scope for this PRD (Part 2 — PRD-APR-V4-02):** the client follow-up email + the client-facing upload page. Declared in KR6 so it's never dropped; the only Part-1 obligation is building the bucket component reusable (no dashboard-only assumptions).

## Verify-before-lock receipts (mechanisms confirmed against live code, 2026-07-09 deep review)

- Fill control ground truth: the button is **"Load Data"** on `TestInputDashboard.tsx` → `loadDataSet1User` (report-builder store) → iterates `TestDataSet1.ts`, remaps via `testDataFieldMapping`, **gap-fills only blanks**.
- V3-origin section ids: exactly `client-intake` + `loe-prep` (from `sectionNameMapping`/`sectionDisplayOrder`); `client-documents` is a UI-only block, not a registry section.
- Key spaces: camelCase form (`testDataGenerator.ts`, randomized) → snake_case DB (inline insert literal, `useFormSubmission.ts`) → kebab registry ids (`fieldMappings` const array in `useLoadJobIntoReport.ts`, not currently exported; mirror serializer exists in `useSaveReportBuilderData.ts`). No form→registry mapping exists today.
- `TestDataSet1.ts` contains V3-origin values today (e.g. client-first-name, property-address, report-type entries).
- Graph: all Graph code in `supabase/functions/_shared/graph.ts` (client-credentials, three secrets; `ensureFolder`/`folderExists`/`listFolderNames` names-only/`uploadFile` single-PUT/`graphSendMail`); consumers incl. `create-job-folders` (idempotent, prefix-match dedupe, returns subfolder ids); exact `JOB_SUBFOLDERS` names as quoted in the Feature surface; `job_submissions.sharepoint_folder_url` stores the webUrl only.
- `job_files`: id, job_id, file_name, file_path, file_type, file_size, created_at — no status/category column; bucket `job-files`; second upload path in `UploadedDocumentsSection.tsx`; preview via public URL, download via authed blob.
- Alignment slice not built: V3-V4-FIELD-ALIGNMENT-DELTA.md deltas are still open (drives the chunk-0 dependency).

## Current state

- v4 live at apr-v4.vercel.app, flag-gated; test-input page works (fill → Load Data → View Report).
- One fill button flooding all sections from `TestDataSet1.ts`; V3 app fills separately from `testDataGenerator.ts` (drift risk live today).
- S3 = placeholder card, no folder wiring; SharePoint folder-create wired + verified elsewhere in the app (`create-job-folders`, "Asset Folders" button).
- Create Report push + merge/preview fixes shipped late June; never proven with a controlled same-dataset diff.

---

*Draft by frontier-reviewer with Ben, 2026-07-09; hardened same day by a plan-mode deep review (two code-trace passes — mechanism corrections folded in: three-hop test-data chain, real fill mechanics, S3 job context, Graph library reuse, copy-plus-mark + migration, alignment-first sequencing).*

*Spec-gate revision 1 (co-architect, 2026-07-09) — qa `/review-gate` spec-mode returned 4 revise-level findings on a solid foundation (all 9 code receipts re-confirmed); closed here: (1) copy-plus-mark idempotency — pinned order (PUT-then-mark) + deterministic-name overwrite + INV-5; (2) single-PUT size cap NAMED (4 MB) + explicit over-cap error; (3) KR2 proof re-pinned to the real mechanism (v4 button + diff-run form-seed, no new V3-form UI); (4) KR3 "zero unexplained" now REQUIRES alignment-first, fallback needs a field-id whitelist conversion. Plus FAIL-WHEN lines added to every INV (qa NOTE). Re-routed to qa for delta re-gate.*

*Spec-gate revision 2 (co-architect, 2026-07-09) — qa's delta re-gate PASSED all 4 + the NOTE, and caught one residual born of the F1 fix: a bare-`file_name` deterministic name would let two distinct client files sharing a name silently overwrite each other on SharePoint (passes INV-5's same-file check, still loses data). Folded: the target name is now ROW-KEYED (`{stem}-{short job_files.id}.{ext}`) — idempotent for the same row, collision-safe across rows, filename stays readable; INV-5 extended to the two-different-files-same-name case. Re-routed the one-liner to qa for same-pass close.*

*Next: qa closes the residual (same-pass) → clean spec-gate PASS → Ben lock (+ S3 A/B pick) → PRD-BRIEF-APR-V4-01 filled → co-architect builds.*
