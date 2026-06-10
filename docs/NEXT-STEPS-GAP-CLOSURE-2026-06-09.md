---
content_type: gap-closure-tracker
title: APR — Next-Steps Gap Closure (LOE cascade · ClickUp · Asset+Email)
status: living — ui-designer pinpoint tracker, built from SS12 full-cascade search 2026-06-09
owner: ui-designer (QA/compare + cascade-PDF eye) · co-architect (consolidates) · Codex (in-app ops)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
tags: [apr-workflow, gap-closure, loe-07, cascade, clickup, asset-storage, email, next-steps]
entities: [[APR Master Dashboard]] [[loeCascade]] [[LOE E-Sign Feature]] [[ClickUp Job Hub]] [[Microsoft Graph]]
---

# APR — Next-Steps Gap Closure (2026-06-09)

**Tags:** #apr-workflow #gap-closure #loe-07 #cascade #clickup #asset-storage #email #next-steps
**Entities:** [[APR Master Dashboard]] [[loeCascade]] [[LOE E-Sign Feature]] [[ClickUp Job Hub]] [[Microsoft Graph]]

> 🏠 Home: [APR Master Dashboard](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md) → Significant Features. This is the focused punch-list behind the front door.

Built from a full two-phase search (all five layers). This is the pinpointed open-gap list across
the three live fronts Ben named: **LOE cascade + go-live**, **ClickUp hub template + data flow**,
and **Asset Storage + Email**. The master dashboard is the front door; this is the focused punch-list.

---

## ⚠ FIRST — one contradiction to resolve before anything else

- **Master dashboard says "V07 is LIVE (2026-06-05)."** The reconciliation doc
  ([loe07-build/V07-TO-APP-RECONCILIATION.md](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/loe07-build/V07-TO-APP-RECONCILIATION.md), react-spec, 2026-06-05) says the **app still sends
  the OLD V3 template** (loe_templates v5, web-flow, old logo, no cascade) — because the v07 work
  lives in a FILE that was never loaded into an active `loe_templates` row.
- **These can't both be true.** Either the file got loaded to DB + activated after 06-05 (then the
  reconciliation is stale), or the app still sends V3 (then the dashboard's "LIVE" is wrong).
- **Action:** confirm which template a real e-sign send transmits today (render through the real app
  path, not Chrome-direct) before any go-live step. → **Ben + react-spec.**

---

## Front 1 — LOE V07 (cascade + go-live)

### Where we are (done)
- **DocuSeal render PASS.** Keeper template renders clean — 9 pages, header rule absent page 1 /
  present on continuations, footers + page numbers correct, no clipping. Both DocuSeal fixes landed
  (signature/name/date fields anchor on the acceptance line; date token fills). **Not committed —
  holding for Ben's sign-off.**
- **Canonical keeper file:** [LOE Template V07 - DocuSeal.html](~/Development/valta-graphics/LOE-V07/LOE%20Template%20V07%20-%20DocuSeal.html)
  (auto-flow, fields role="Client"). NOTE: this is a NEWER location than the reconciliation doc's
  path ([docs/Features/12-LOE-Esign/loe07-build/LOE-template-v07.html](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/loe07-build/LOE-template-v07.html)) — the go-live plan must be
  re-pointed at this keeper.
- **Cascade logic is BUILT** ([src/utils/loe/loeCascade.ts](~/Development/APR-Dashboard-v3/src/utils/loe/loeCascade.ts), realigned 2026-06-05) and version-gated
  (`loe_templates` version ≥6 → `mapDataToV07Fields` + cascade fires).

### The cascade in plain terms (so we can show the client "pick X → LOE changes")
- **Status of Improvements** (client/dashboard pick) → derives the **Value Scenarios** (§5), the
  **Approaches to Value** (§9), and the §10 left column — all at once.
- **Authorized Use = Insurance** is an override → forces *Insurable Replacement Cost* / Cost Approach.
- **§10 right column** (the EA/HC narrative paragraphs) = a text-library lookup keyed by scenario,
  NOT a typed field.

### Open
- **G1 — Go-live wiring (behind Ben's go).** Load the keeper FILE into a `loe_templates` row at
  version ≥6 → set `is_active=true` (+ `is_default=true`, unset V3). Then editor + preview + send all
  use v07. 3-step plan in [V07-TO-APP-RECONCILIATION.md](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/loe07-build/V07-TO-APP-RECONCILIATION.md) — update its source path to the new keeper first.
- **G2 — Cascade PDF variants for the client (does NOT need go-live).** Render the keeper through the
  cascade with different Status-of-Improvements picks → produce a few PDFs that visually show
  "pick A → §5/§9/§10 look like this; pick B → like this." Harness exists:
  [tests/loe-v07-cascade-proof.py](~/Development/APR-Dashboard-v3/tests/loe-v07-cascade-proof.py) (pulls real job data, writes filled HTML). **This is ui-designer's
  next build once Ben confirms he wants the variants.**
- **G3 — §10 narrative gaps.** [loeCascade.ts](~/Development/APR-Dashboard-v3/src/utils/loe/loeCascade.ts) now carries text for 6 scenarios (As Is Vacant Land,
  As If Vacant Land, As If Complete & Stabilized, As-Is, As Stabilized, As If Complete & Stabilized -
  Renovated). **4 still resolve to null** (As If Complete - Rezoned / Serviced / Subdivided, Insurable
  Replacement Cost) — those §10 rows keep literal brackets until **Chris** supplies the copy.
- **G4 — Commit the keeper** once Ben signs off (currently uncommitted per QA's hold).

---

## Front 2 — ClickUp job hub (template + live data flow)

### Concept (locked)
Lightweight **job hub** = identify the job + link out to APR Dashboard / Valcre + light summary +
status tracker. Data in **typed custom fields**, NOT a description blob (kills the duplication bug).
Proven: demo task populated 16 fields cleanly via API.

### Open
- **C1 — Build the Job Hub template (ClickUp UI).** API can't delete fields or save-as-template, so
  build the KEEP set in the UI (~16–19 fields: Links → Job Summary → Status/Dates clusters), hide the
  rest, save as template. → **Codex in-app op** (he built the updated one in Ben's area, knows the recipe).
- **C2 — Verify live data flow (the thing Ben hasn't seen yet).** Make a change on the APR dashboard
  for the pinned test job → watch it land on the ClickUp task's custom field. Current integration
  fills only ~7 of ~48 fields; confirm sync-on-change end-to-end. (Live card render currently 404s on
  the BC test token — use prod token or fresh task on test list `901709622357`.)
- **C3 — Reconcile dropdown option-sets 1:1.** Report Type (ClickUp Comprehensive/Concise/Form vs
  dashboard "Appraisal Report") and Transaction Status mismatches → align exact strings or the value
  silently won't map.
- **C4 — Duplicate the template into the client's Valta area.** Once C1–C3 pass. → **Codex in-app op.**
- **C5 — Two versions.** Clean KEEP set (default) + a more-fields version if the client wants more —
  both clean, both typed, neither stuffed in the description line.

---

## Front 3 — Asset Storage + Email (one Microsoft 365 / Graph integration)

One Entra app (Ben = Global Admin on `valta.ca` tenant) powers BOTH folders and email.

### Open
- **E1 — SharePoint per-job folders.** At intake, create a parent job folder + **5 standard
  subfolders** (REPORT · CLIENT SUPPLIED · WORK FILES · CLIENT BILLING · LETTER OF RELIANCE). Folder
  spec + verbatim naming locked. Site: `valtapropertyvaluations.sharepoint.com/sites/V`. NOT wired yet.
- **E2 — Email: retire Resend → Graph sendMail.** Resend was a sandbox stub. New path: send directly
  via Graph `sendMail` from a `valta.ca` mailbox using the same Entra app — add `Mail.Send` + an
  app-access policy scoped to one mailbox. Covers both LOE-send and closing emails.
- → **Codex lane** (Graph wiring + folder creation). Credential slot pending in [01-AGENT-ACCESS-LOGIN-PRIMING](~/Development/APR-Dashboard-v3/docs/01-AGENT-ACCESS-LOGIN-PRIMING.md).

---

## Integration priority order (from checkpoints)
**ClickUp verification → SharePoint → Valta email → Pipedrive removal → Document Hub scrapers.**

## Context already done (not open)
- **Valcre:** 13 custom fields created + verified, 26/26 tests pass, auto-sync fixed, full pipeline
  Dashboard → Supabase → Valcre live + readback-verified.

---

## Roles
- **ui-designer:** LOE QA/compare eye + cascade-PDF variants (G2). Does NOT author the LOE HTML (Codex owns) and does NOT touch [loeCascade.ts](~/Development/APR-Dashboard-v3/src/utils/loe/loeCascade.ts) (react-spec/QA lane).
- **Codex:** in-app ClickUp template ops (C1, C4), Graph/SharePoint/email wiring (E1, E2). Route Codex-bound work through Ben.
- **react-spec / QA:** the app DB wiring (G1), cascade code, live-flow verification (C2).
- **Chris (client-side):** §10 Text Library copy for the 4 pending scenarios (G3).

---

## Research (deferred — figure out on its own)

- **R1 — "Fill Test Data" buttons per dashboard section.** Each dashboard section has a Fill-Test-Data
  button (mirrors the HTML Field Registry / Logic-Fields tool approach). They likely DON'T fill with
  *proper / realistic* test data today. Revisit so each button fills sensible, versioned test data per
  section — same pattern as the HTML registry tool (pick a version → "Fill Test Data"). Scope as its
  own research item; not on the current critical path. (Ben flagged 2026-06-09.) Related gotcha already
  on the master dashboard: make the button **agent-pressable** (press → reshuffles realistic field data).

---

**Last reviewed:** 2026-06-09 by documentation-engineer (km-markdown standardize, content unchanged).
