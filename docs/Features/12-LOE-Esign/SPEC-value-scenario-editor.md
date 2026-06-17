---
id: spec-value-scenario-editor
title: "SPEC — Value Scenario narrative editor (Section 10 live-mirror: see + edit the paragraph in the dashboard before the contract)"
status: spec-for-gate
created: 2026-06-16
type: build-spec
owner: co-architect (author) · qa-agent (spec gate + build-verify) · ui-designer (mockup + build) · Ben (direction) · Chris (end reviewer)
source_notes: ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/SPEC-NOTES-value-scenario-editor.md
verify_reference: ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/VERIFY-per-version-LOE-doc-spec.md
entry_files:
  - ~/Development/APR-Dashboard-v3/src/utils/loe/loeCascade.ts
  - ~/Development/APR-Dashboard-v3/src/utils/loe/generateLOE.ts
  - ~/Development/APR-Dashboard-v3/src/components/dashboard/job-details/LoeQuoteSection.tsx
tags: [apr-workflow, loe, value-scenarios, section-10, narrative, editor, dashboard, build-spec]
keywords: [value scenarios, EA/HCSummary, NARRATIVES, deriveValueScenarios, section 10, pill expand, cog, narrative store, live mirror]
---

**Tags:** #apr-workflow #loe #value-scenarios #section-10 #narrative-editor #build-spec
**Entities:** [[Cascade-Logic]] [[LOE E-Sign Feature]] [[loeCascade]]

# SPEC — Value Scenario narrative editor

> **One line:** Section 10 of the contract stops being a blind auto-populate. The dashboard Value
> Scenarios area becomes a **live mirror** of that exact §10 spot — you see the paragraph each scenario
> generates, read it, and tweak it right in the dashboard, BEFORE it reaches the HTML. Built so the
> client (Chris) can review + correct the written scenario text without touching code or waiting until
> the finished contract.

> **Workflow:** co-arch spec (this) → QA `/review-gate` spec-mode → co-arch build/mockup prompt → QA
> gate prompt-mode → **ui-designer MOCKUP first** (Ben asked) → build → QA verify. NO rush; proper steps.

---

## The problem (verified this session, not assumed)
- The cascade picks Status of Improvements → derives Value Scenarios → §10 renders a one-line summary
  per scenario. **You only ever see the actual words by generating the full LOE** — too far downstream
  to comfortably edit, and abstract until then ("all these dropdown fields are irrelevant if you can't
  see what they produce").
- The scenario text lives **hardcoded** in `NARRATIVES` (`loeCascade.ts`) — Chris can't edit it, and no
  one reads it in context before it ships. He has flagged he isn't sure all the written text is right.
- Ground truth: `NARRATIVES` holds 3 slots per scenario (`summary`, `eaDetail`, `hcDetail`); **only
  `summary` renders** today (`resolveNarrative` → `[EA/HCSummary_n]`); `eaDetail`/`hcDetail` exist but
  are not consumed. §10 suppresses empty rows and keeps a literal `[EA/HCSummary_n]` bracket when a
  scenario has no text (e.g. Insurable Replacement Cost — pending Chris's copy).

## Scope (this build)
- **Summaries ONLY.** The fuller EA-detail / HC-detail paragraphs are PARKED (separate item — they
  aren't rendered today anyway). Build the summary view/edit; leave room for detail later.
- A **dashboard surface in the Value Scenarios area of Section 2** (`LoeQuoteSection`) that shows, for
  the currently-derived scenarios, the actual paragraph each will write into §10, editable + saveable.

## Behavior

### 1. Entry point — cog beside "Value Scenarios"
A **gear/cog icon beside the "Value Scenarios" label** in the LOE & Valuation Details area
(`LoeQuoteSection`). It opens the review/edit surface (modal or inline panel — ui-designer decides in
the mockup). The surface shows the scenarios **currently derived for this job** (from the cascade) and
the paragraph each one produces.

### 2. The view/edit surface — pill-expand (mirror the saved-documents dropdown)
- The derived scenarios render as **pill buttons** (same visual pattern as the saved-contract pills).
- **Click a pill → it expands underneath** into a block showing THAT scenario's paragraph (compact —
  there's little text per scenario). The block is **read-first**; an edit affordance turns it editable.
- **Edit → Save** persists the text; that saved text is what §10 renders.
- **When a scenario is active/picked, its paragraph is written out (visible), not just the name** — so
  the dashboard shows the real §10 output at the point of choice.

### 3. Live mirror to §10 (the core principle)
What you see/save here is **exactly** what §10 renders for that scenario — same text, same suppression
rules. §10 must read the scenario summary from the **editable store** (below), not the hardcoded const,
so an edit in the dashboard flows straight to the generated contract.

**⚑ BLOCKING-1 — sync→async reconciliation (preload-once pattern, the core hole QA caught):**
`resolveNarrative` is **synchronous** (a const lookup) and is called synchronously inside the §10 token
mapper loop (`generateLOE.ts:193`). Moving the source to a Supabase table makes the fetch **async** — a
naive per-call `await` inside the sync mapper would block or get bolted on fragile. **Required pattern:**
`generateLOEHTML` (already async, ~`generateLOE.ts:240`) does a **one-shot load of ALL narratives BEFORE
the token-map builder runs**, then passes an **in-memory resolver** (a plain map/function over the loaded
rows) into the still-synchronous mapper. The mapper stays sync; it just resolves against the preloaded
in-memory set instead of the const. **Mirror the existing `seedTemplatesIfEmpty` / `loadTemplateRow`
await precedent** in the email-template code. Do NOT make the mapper itself async.

### 4. Persistence — move narratives out of code into an editable store
- Today narratives are a hardcoded `const`. Build a **narrative store** (new Supabase table, e.g.
  `scenario_narratives`: `scenario` (canonical name, unique), `summary`, optional `ea_detail`/
  `hc_detail` columns for later, `updated_at`) **seeded from the current `NARRATIVES` verbatim** (so
  reset/initial state = today's text exactly, including the known client typo "makret" — verbatim,
  Chris's call to fix).
- `resolveNarrative` (and the §10 mapper) read from the store, falling back to the code seed if a row
  is missing (so a fresh/empty DB still renders today's text — never blank-regress).
- **Default scope = GLOBAL** (one set of summaries reused on every job) for v1 — the narratives are
  standard legal language, not per-job. (Per-job override is a possible later extension; NOT in v1.)
  - **⚑ Known v1 behavior (name it, don't hide it):** global + last-write-wins on shared legal text —
    editing a summary changes §10 for **ALL future contracts, including in-flight jobs** that regenerate.
    Acceptable for v1 (standard legal language, internal editors); flag if a per-job override is wanted.
- **Seed timing:** seed the store from the code `NARRATIVES` at **runtime, upsert-if-empty** — mirror
  the `seedTemplatesIfEmpty` precedent (the email default self-heals the same way), NOT a one-time
  migration insert (so a fresh/reset DB always recovers today's text).
- An edit that empties a summary → §10 keeps its existing empty-suppression behavior (no blank row, no
  stray bracket where suppression already applies).

- **⚑ BLOCKING-2 — v1 RLS policy (LOCKED guardrail, not an open question):** `scenario_narratives` is a
  NEW write path. This session proved unauthenticated/headless writes **silently fail RLS and read back
  empty** (false-pass) — so acceptance #3 is unverifiable until auth is pinned. **v1 policy: write =
  authenticated-internal only; read = public/anon OK** (the LOE generator + dashboard must read it). WHO
  beyond internal (Chris direct vs internal-on-his-behalf) is still an open question, but the RLS floor
  is locked here so the editor can't silently no-op. Verify writes **logged in as bc@crowestudio.com**.

- **⚑ DEAD-CODE TRAP — build in the LIVE file:** the cog/pill surface goes in **`LoeQuoteSection.tsx`**
  (live, in `entry_files`). Do **NOT** wire or copy into **`LoeQuoteSectionIndependent.tsx`** — it is
  DEAD (zero importers) and is the *only* current dashboard caller of `resolveNarrative` (L317). Don't
  follow that caller to the wrong file.

## Acceptance (QA — deployed app, logged in as bc@crowestudio.com, DB-read-after-reload; verify in the generated LOE)
1. **Cog visible** beside Value Scenarios in Section 2; opens the surface.
2. **Derived scenarios show as pills**; clicking one expands its actual §10 paragraph (matches what the
   contract renders for that scenario — spot-check against the `VERIFY-per-version-LOE-doc-spec` text).
3. **Edit round-trip:** edit a summary → save → reload → re-query the store = persisted; **generate the
   LOE → §10 shows the EDITED text** (live mirror proven end-to-end), not the old hardcoded text.
4. **Seed fidelity:** a fresh store renders today's exact text (incl. "makret") — no blank-regress, no
   text drift from the current contract output.
5. **Empty/suppression:** clearing a summary doesn't ship a blank row or stray bracket where §10 already
   suppresses; a scenario with no text (Insurable Replacement Cost) can be GIVEN text here and it then
   renders in §10 (this is how Chris supplies the missing V4 copy).
6. **No regression:** the cascade still derives the same scenarios; existing §10 row-count/ordering for
   V1–V4 unchanged except for edited wording.
7. **Surface failure states:** a store-fetch failure on open and a save failure both show an honest
   error (named save-fail toast, e.g. "Couldn't save scenario text"), never a silent success — and the
   §10 generator falls back to the code seed on fetch-fail rather than rendering blank.

## Out of scope (this build)
- EA-detail / HC-detail paragraph editing (parked — separate item; not rendered today).
- Per-job narrative overrides (global store only in v1).
- Any change to the cascade derivation (which scenarios appear) — purely the TEXT + its visibility/edit.
- The email-editor Phase 2 work (separate banked spec).

## Open questions (resolve at mockup / with Ben — none blocking the build)
- **Cog → modal vs inline-expand:** one surface reachable both ways, or a full review page + inline
  pills? (Lean: one surface; ui-designer mockup decides the container.)
- **Who edits, beyond the RLS floor:** v1 RLS is locked (authenticated-internal write / public read).
  Open: does Chris edit directly later, or internal-on-his-behalf for now? (Lean: internal for v1.)
- **Lock/approve state:** is "locks it here" just saved-text, or an explicit approved flag the contract
  reads? (Lean: saved-text = source for v1; approval workflow later if needed.)

---

*co-architect, 2026-06-16. Rev 2 — folds QA spec-gate PASS-WITH-FIXES: BLOCKING-1 (preload-once async
resolver, mapper stays sync), BLOCKING-2 (v1 RLS floor locked), dead-file line (LoeQuoteSection not the
Independent copy), + the 3 notes (surface fail-states, runtime seed-if-empty, global last-write-wins
caveat). Grounded in this session's §10 verification. → QA re-confirm → prompt → QA prompt-gate →
ui-designer mockup-first → build → QA verify.*
