---
content_type: plan
title: APR V4 — Completion Plan (finish the V4 report-builder app end to end)
status: DRAFT 2026-06-21 — co-arch + qa reconciled from SS12 + the image-library findings; awaiting qa spec-gate
created: 2026-06-21
author: co-architect
gate: qa-agent (spec-review + INV PROVED-BY)
anchors:
  - docs/Architecture/V4-STATE-OF-PLAY-2026-06-16.md  (⚠ STALE on §3/§4 — KN-Mgr refresh pending)
  - docs/Architecture/SPEC-V4-slice1-unlock-persist.md … slice4b  (the existing slice specs this resumes)
  - docs/Features/08-Master-Field-Registry/GENERATED-field-mapping.md  (canonical mapping home)
  - docs/Features/07-Report-Builder/2-Field Management/crosswalks/valcre_template_crosswalk.json
sibling: docs/Architecture/V4-IMAGE-LIBRARY-PLAN.md  (the visual map this plan acts on)
tags: [apr, v4, completion, report-builder, field-mapping, v3-v4-transition, planning]
---

# APR V4 — Completion Plan

**Purpose.** Turn the image-library's verified status map into the actual work to finish the V4
report-builder app end to end. This is NOT a fresh plan — it RESUMES the already-written but stalled
SPEC-V4-slice* specs, anchored on ground truth from a two-agent SS12 (co-arch + qa) + the live shoot.

> **Built on search, not re-derivation (Ben's directive 2026-06-21).** Both agents ran full SS12;
> findings reconciled below. Where the 06-16 anchor conflicts with live code, CODE WINS.

## ⭐ THE CANONICAL V3→V4 DATA FLOW (from Ben — the spine of this plan)

The whole app is this 5-stage handoff. Every build piece below serves it:

1. **STAGE 1 — V3 (live, shippable).** A job is completed IN FULL in the V3 app: intake (Section 1)
   + LOE prep (Section 2). This is what Chris's team uses TODAY. Data lands in `job_submissions` +
   `job_loe_details` + `job_property_info`.
2. **STAGE 2 — THE TRIGGER (needs building).** On a COMPLETED V3 job, a **"Create Report" button**.
   Pressing it fires the handoff. ⚑ **This button is the missing canonical entry** — it must be
   added/surfaced on the finished V3 job-detail view. (Today only the TestInputDashboard "View
   Report" exists; the real flow is "Create Report" on a done job.)
3. **STAGE 3 — THE MAP (largely EXISTS).** Pressing it carries that job's V3 data INTO the V4 report
   builder. `useLoadJobIntoReport.ts` already pulls `job_submissions` + LOE + property →
   `updateFieldValue` into the report store by report-field-id. **Verify coverage/completeness.**
4. **STAGE 4 — V4 BUILDER = A SEPARATE FIELD AREA (Ben's words).** The builder opens POPULATED with
   the job data; the appraiser does the V4-only work — valuations (income/sales/cost), comps,
   narrative — in report fields that are **DISTINCT from** the V3 intake/LOE fields. NOT the same fields.
5. **STAGE 5 — OUTPUT.** Those report fields fill the `{{placeholders}}` in the 79-page template → the report.

**Tie-ins:** (a) the **V3 TABS inside the V4 builder** (S1/S2) MIRROR the V3 app, so their field
names + dropdowns must match the CURRENT V3 app = the alignment slice. (b) the **gate** keeps
section-3+ hidden from the client until V4 is ready. (c) the **deploy 401 blocks loading ANY job**,
so this flow can't be tested live until that's fixed (key/URL trailing-newline — being fixed).

## Ground truth — what WORKS today (verified, stop re-litigating)

- **The hard engine works:** calc engine, the builder shell, the 79-page HTML template, and the
  test-data workflow (`/test-input` → "Load Data" → plain "View Report") all function on the live
  apr-v4 deploy.
- **Runtime field→template mapping works:** it's a NAME-MATCH — registry field id `subject-nra`
  fills `{{subject-nra}}` in `public/Report-MF-template.html` via `interpolateTemplate`. The registry
  (`fieldRegistry.ts`, ~2,082 ids) + the template ARE the live mapping truth (not a doc).
- **Cost approach IS built** (computes Land + Direct) — the batch-1 "stub" was just empty data.
- **Slice 1 (Unlock + Persist) is effectively DONE** — symlink gone (real dir),
  `useSaveReportBuilderData.ts` + `report_builder_data` migration exist, routes flag-gated.

## The gaps to "end to end" (each maps to an existing slice)

| # | Gap (verified) | Maps to | Owner | Proof it's done |
|---|---|---|---|---|
| G1 | **Approach→Reconciliation value flow** — recon weights/math work (33/33/34) but all 3 approaches feed $0 → final $0, even though the standalone calc computes the real value. The engine works; the values don't FLOW into the builder's reconciliation. | SPEC-V4-slice3-cascade-bridge (slice D wiring) | builder + qa | load test data → recon final shows the real indicated value, not $0 |
| G2 | **~35 report fields + the ENTIRE LOE valuation cascade not bridged** into the builder (Cognee + TDD "21 missing" corroborate). | SPEC-V4-slice3-cascade-bridge / slice4b-add-missing-fields | builder + qa | the named fields populate from a loaded job; LOE cascade values appear in the report |
| G3 | **Valcre-source crosswalk only ~4% derived** — `valcre_template_crosswalk.json` maps ~350 of ~7,988 Valcre ranges; the rest name-match to template tokens but the Valcre-source mapping is incomplete + many placeholders unverified. | registry-extension (slice C) — **Ben's lane** | Ben + qa | crosswalk coverage raised; placeholders verified against the template |
| G4 | **⭐ V3-TAB ALIGNMENT (NEW slice, Ben 2026-06-21)** — V4's V3-origin tabs (S1 Client Intake + S2 LOE Prep) carry STALE field names + dropdown options vs the newly-updated V3 app. **The V3 app is the SOURCE OF TRUTH** (data flows V3→V4 via `useLoadJobIntoReport`). Update V4's intake+LOE tab field names + dropdowns to match the current V3 app NEAR-EXACTLY → then the V3→report mapping is clean. Distinct from calc; sits with the V3→V4 transition / registry-extension. | NEW — pairs with slice4-shared-section1-2-source | builder + qa | qa's DELTA (live V3 intake/LOE fields+dropdowns vs V4 V3-tabs) closed; names+options match V3 | 
| G5 | **PDF/export key-name mismatch** — `exportReport.ts:72` reads `VITE_SUPABASE_ANON_KEY` (nothing sets it) → PDF/export hits 'Invalid API key' independently. | code-fix (reconcile to `VITE_SUPABASE_PUBLISHABLE_KEY`) | builder + qa | export runs without the key error |

## Done this session (deploy defect — CLOSED on the build side)

- **apr-v4 "Invalid API key" (jobs + image-mgt blocked) = FIXED.** Root cause: the gitignored `.env`
  shipped LOCAL/DEMO Supabase values (127.0.0.1 + a `supabase-demo` anon key) that won build-time
  inlining → the demo key baked into `supabase/client.ts` `createClient` → prod DB rejected it.
  **Fix:** committed `.env.production` with the real prod Supabase URL + public anon key so Vite
  inlines deterministically; forced fresh `vercel --prod` of apr-v4. **Verified server-side:**
  served bundle has demo-key=0, prod URL inlined, the inlined anon JWT decodes to the correct prod
  project (role=anon), and the exact app query returns HTTP 200 + a real row. qa's final browser
  re-verify (fresh/incognito load) is the last word — local browser cache was the remaining artifact.

## NET BUILD PIECES — ⭐ FIELDS-FIRST order (Ben, 2026-06-21)

> **Ben's near-term priority: make V4 playable STANDALONE first, wire V3→V4 LAST.** The sequence is
> NOT "build the handoff then fix fields" — it's "get V4's fields right + fillable on their own, prove
> the whole report works end to end with test data, THEN connect it to V3." So:

0. **✅ DONE — Key/URL newline fix (deploy unblocked).** The 401 (trailing newline on the Supabase
   URL + key) blocked loading any job. Fixed: URL + key re-entered clean (printf, no newline) + a
   `.trim()` guard in `client.ts` + redeploy. **qa GATE = PASS** (jobs load, HTTP 200, real rows on
   build `index-Cg0I9tTO`). The earlier "deeper issue" flag was a stale network buffer — it WAS the
   newline.
1. **V3-TAB ALIGNMENT (fields-first, #1 priority).** Make ALL of V4's V3-origin fields (S1 intake +
   S2 LOE) match the CURRENT V3 app — field names + dropdown options — near-exactly. qa's DELTA
   (live V3 vs V4 V3-tabs) scopes it.
2. **FILL V4 WITH THE SAME TEST DATA AS V3.** Load V4 with the identical test dataset V3 uses, so the
   builder is **playable STANDALONE** — every field populated, the report renders end to end, no V3
   dependency. (This proves Stages 4–5 work before the handoff is wired.)
3. **THEN wire V3→V4 (LAST) — the handoff spine:**
   - **"Create Report" button** on a COMPLETED V3 job-detail → routes to `/apr-v4` + fires the bridge
     (the canonical entry, replacing the TestInputDashboard-only "View Report").
   - **Verify `useLoadJobIntoReport` field coverage** — confirm it carries the full V3 job data
     (intake + LOE + property) into the report store with no gaps.

**In-builder completeness gaps (fold into step 2's "playable standalone" proof):** G1 recon
value-flow (headline $0 bug) · G2 missing fields + LOE cascade · G3 Valcre crosswalk extension
(Ben's lane) · G5 export key-name fix. **Housekeeping:** KN-Mgr refresh the stale V4-STATE-OF-PLAY §3/§4.

*(G1–G5 detailed in the gaps table above. The reorder: fields right → standalone-playable with test
data → V3→V4 wiring last.)*

## Parallel registry-hygiene lane (dev-3, qa-gated — coordinate with #2, don't collide)

dev-3's V4-native dup review (per [REGISTRY-DUP-ID-RULE.md](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/REGISTRY-DUP-ID-RULE.md)) runs alongside #2. qa-gated classification: **110 dups = 50 KEEP / 29 FIX-2 / 31 FIX-3** (verified vs live registry), with:
- **~9 same-section dups mis-tagged FIX-2 are actually FIX-1 REDUNDANT → COLLAPSE to one** (delete the extra), NOT reconcile-both (`comp1-5-year-built` in sales-comparison/comp1, `subject-parking-incl` in impv/amenities, `sca-concluded-value-per-unit`, `subject-rent-*-avg`). The rule already says same-section = FIX-1; dev-3 re-tags these 9. **Any registry build must distinguish FIX-1 (delete) from FIX-2 (reconcile-both).**
- **⛔ HIDDEN LEGACY `sales` section (~283 fields)** collides with the live `sales-comparison` section on `comp1-5`. `sales-comparison` is canonical → **retire ONLY the colliding comp duplicates, NEVER a blanket 283-field section delete.** The rest of that legacy section = a SEPARATE dead-code assessment (parked — see Out of scope).
- The one **bridge** dup item (`interest-appraised` loe-prep dropdown) is qa's lane, not dev-3's.

**Coordination — LOCKED build order (qa, 2026-06-22):**
1. **dev-3's DUP CLEANUP lands FIRST** — it changes field DEFINITIONS (FIX-1 deletes redundant fields, FIX-2 retypes, e.g. number→currency). Must complete before anything fills those fields.
2. **THEN #2 TEST-DATA fill** (`TestDataSet1.ts`) runs against the CLEANED registry — sequential. (Filling before cleanup = values for fields about to be deleted/retyped = rework + wrong-typed test data.)
3. **recon-$0 CODE fix (part B) runs PARALLEL** — it touches a DIFFERENT file set (the approach→reconciliation value-flow, NOT the registry), so no collision with the cleanup.

So: **[dup cleanup → test-data fill] sequential on the registry/TestDataSet; [recon value-flow fix] parallel.** Note: qa's #2 DELTAS (coverage map + recon root-cause trace) are READ-ONLY analysis — zero edit, zero collision — so they can be produced anytime; the collision discipline only bites at the BUILD-edit phase.

## Out of scope

- **Legacy `sales` section dead-code assessment (~283 fields, minus the comp1-5 dups dev-3 retires)** — a separate cleanup pass; NOT this build, and NOT a blanket delete. Flag-only for now.
- **SaaS multi-tenant** — separate strategic track.
- **The image library itself** — sibling plan (V4-IMAGE-LIBRARY-PLAN.md); this plan ACTS on its findings.
- **RLS hardening** — `report_builder_data` ships RLS-off deliberately (matches the no-login app); revisit at SaaS.

## Division of labor

- **co-architect:** this plan + per-slice Assembly Prompts; the deploy-config lane (done: the env fix).
- **qa-agent:** spec-gate + INV PROVED-BY; the V3-tab DELTA; status-verification (code-vs-doc); visual verify.
- **builders (TBD):** the slice builds, prompted by co-arch, gated by qa.
- **Ben:** the registry-extension lane (G3) + steer + final aesthetic.

---

*DRAFT 2026-06-21 — reconciled from co-arch + qa SS12 + the live image-library shoot. Resumes the
existing SPEC-V4-slice* specs; does not re-derive. Awaiting qa spec-gate, then per-slice prompts.*
