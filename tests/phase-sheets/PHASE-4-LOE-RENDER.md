---
title: "Phase 4 — LOE Generation / Render"
tags: [#APR, #testing, #phase-sheet, #full-loop, #loe, #render, #cascade]
created: 2026-06-11
author: qa-agent
status: active
---

# Phase 4 — LOE Generation / Render

**[⬅ Back to Phase Sheets Dashboard](~/Development/APR-Dashboard-v3/tests/phase-sheets/00-PHASE-SHEETS-DASHBOARD.md)**

**What this sheet is:** the canonical reference for generating and rendering the LOE (the engagement letter the client signs). It covers how the letter is built from the live template, how the cascade fills its scenario section, and exactly what to check to call a render clean. Picks up where [Phase 3 — Valcre Job Creation](~/Development/APR-Dashboard-v3/tests/phase-sheets/PHASE-3-VALCRE-JOB-CREATION.md) ends.

**How to read it:** every section leads with the **Goal** (what we want the LOE to do or contain), then a **Current State** block right under it (what's proven and what's missing). Goal first, current state second.

---

## Index

1. The Goal — a correct, complete LOE letter, every time
2. How the LOE renders — the live DB template + the right way to capture it
3. The Cascade — Status of Improvements → scenarios + approaches
4. Section 10 — the scenario engine + narratives + clean rows
5. Conditional sections — Schedule A + the Example block
6. The Coverage Gate — what to check on EVERY render
7. The 4 canonical versions + prior full PASS
8. Gaps
9. Tools / CLIs for this phase
10. Definition of Done

---

## 1. The Goal — a correct, complete LOE letter, every time

**Goal:** generate the client's engagement letter so that it's complete and correct on every render — letterhead and core fields populated, the Value Scenarios in Section 10 matching the job's Status of Improvements, every narrative resolving to real text (no stray `[brackets]`), no blank rows, Schedule A handling single vs multiple properties correctly, and zero leftover placeholder tokens. The output is a real PDF — the exact artifact the client sees and signs.

**Current State:** the render engine + cascade are **proven** — a full pass across all 4 canonical scenario versions landed, and the coverage gate caught and fixed the issues that happy-path testing missed (Schedule A, blank §10 rows, the Example-block leak). Two things are still open: there's no one-command CLI to render the LOE (it's a multi-step serve + capture today), and one narrative (the Insurable Replacement Cost text) isn't written yet. Details below.

---

## 2. How the LOE renders — the live DB template + the right way to capture it

**Goal:** render the letter from the ONE active template and capture the REAL printed output, not a half-rendered HTML string.

**Current State (two facts that trip people up):**

**The active template is a database row, NOT a static file.** The live template is the Supabase `loe_templates` DB row (LOE-07-1, version 7) — read by `generateLOE.ts` (`supabase.from('loe_templates').select('template_html')`). The static `LOE-template-v07.html` file in the repo is NOT what renders. Always verify against the DB row. Any template fix has to be pushed to that Supabase row to take effect.

**The render is print / Paged.js media — capture it over http, not file://.** The template uses Paged.js print media. Loading it as a `file://` URL in playwright silently fails — playwright lands on about:blank and you get a blank capture. The right way: serve the rendered HTML over http, then use playwright's PDF capture (not a screen screenshot) to get the real letter. The output is a PDF — that IS the client-facing artifact, so it's what you verify and what you deliver.

**Delivery:** save the rendered PDF under an allowed path (e.g. `tests/LOE-v1.pdf`, never `/tmp` — the viewer can't reach it), and share it as a clickable path on its own line so Ben can page through the whole letter. For a multi-version run, share each version PDF as a separate labeled line. Don't deliver a screenshot — it's a flat image of one page; the PDF lets Ben see the whole letter as the client would.

---

## 3. The Cascade — Status of Improvements → scenarios + approaches

**Goal:** the job's Status of Improvements automatically drives which Value Scenarios and which Approaches to Value appear in the letter — no manual selection, the right scenarios for the right job.

**Current State:** ✅ wired in `loeCascade.ts`. The cascade has two derivations:

- **Status of Improvements → Value Scenarios** (`deriveValueScenarios` / `STATUS_TO_SCENARIOS`) — e.g. "Completed" yields "As Stabilized"; "Under Renovation" yields "As-Is" + "As If Complete & Stabilized"; etc.
- **Status of Improvements → Approaches to Value** (`deriveApproaches` / `STATUS_TO_APPROACHES`).
- **Insurance override:** when Authorized Use = Insurance, both derivations are REPLACED by the single "Insurable Replacement Cost" scenario (`INSURANCE_OVERRIDE_SCENARIO`, rule R023). This is the override path, not a status-derived one.

Each scenario then maps to its narrative text (the right column of Section 10) by exact scenario-name match (`resolveNarrative`).

---

## 4. Section 10 — the scenario engine + narratives + clean rows

**Goal:** Section 10 shows exactly the scenarios the cascade produced, each with its real narrative text, and NO empty rows — clean for a job with fewer than the maximum number of scenarios.

**Current State:** ✅ working, with one narrative gap (see Section 8).

- **Scenario rows match the cascade** — the left column of §10 is the scenarios derived from Status of Improvements (Section 3).
- **Narratives resolve to real text** — each scenario's summary/detail comes from the narrative library in `loeCascade.ts`. A literal `[EA/HCSummary_n]` bracket in the output means the narrative library is missing that entry — that's a content gap to flag (to Chris/Codex), NOT a wiring bug. Distinguish the two.
- **Blank-row suppression** — the DB template uses fence markers (`<!-- EAHC-ROW-n:START/END -->`) to remove empty scenario rows. A job with fewer than 6 scenarios must produce ZERO blank `<tr>` rows. (This was the 784140 FAIL — fixed in the DB template.)
- **Whole-section drop** — if the cascade yields zero scenarios, the entire §10 section is dropped.

---

## 5. Conditional sections — Schedule A + the Example block

**Goal:** the parts of the letter that only appear sometimes behave correctly — Schedule A lists each property when there are multiple and collapses cleanly when there's one; the static "Example" legend never prints on a real contract.

**Current State (this is the bucket that gets missed):**

- **Schedule A — multiple properties.** Must list each property when the job has several, and suppress/collapse when there's a single property. Uses conditional markers in the DB template, same fence pattern as the §10 rows. ⚑ This is the path that was missed in the original happy-path pass — never skip testing BOTH a single-property AND a multi-property job.
- **Example block.** The static "Example" legend under §10 must NOT print on a real contract (flagged for removal). Confirm it's gone.

---

## 6. The Coverage Gate — what to check on EVERY render

**Goal:** every LOE render is checked against a documented list, so coverage is provable, not remembered. A green render is only valid if every item below was checked.

**Current State:** ✅ the gate is documented and canonical — `tests/LOE-TEST-COVERAGE-GATE.md`. QA runs the LOE against it every time and records PASS/FAIL per item in a dated grade doc. The gate items:

**A — Cascade → Section 10:** §10 scenarios match the Status across ALL status versions (not one); narratives resolve to real text (a literal bracket = library gap, flag it); zero blank §10 rows; Approaches match `STATUS_TO_APPROACHES`.

**B — Conditional sections (the miss bucket):** Schedule A correct for single AND multiple properties; the Example block is gone.

**C — Token / field integrity:** zero unresolved `[Token]` leaks (a stray placeholder = FAIL unless it's a known library-pending narrative); core fields populate (letterhead, client name, property name + address, fee, retainer, all dates, property rights/interest).

**D — How to render + verify:** verify at the rendered-PDF level, not the HTML string (file:// blanks in playwright — serve over http + playwright PDF); the active template is the `loe_templates` DB row, not the static file.

**E — Ownership routing:** any template / HTML / spatial / narrative fix routes to Codex (template owner), not a code change. The fix is pushed to the Supabase `loe_templates` row — Codex can push it; QA/any agent is the fallback (agents have full Supabase access via `/supabase-deploy`). EITHER WAY: never trust a "success" claim — verify the write by reading the live DB row back, and re-render single + multi property to prove the suppression actually fires (markers existing ≠ behavior working).

---

## 7. The 4 canonical versions + prior full PASS

**Goal:** the cascade is proven across the full range of job types, not just one.

**Current State:** ✅ all 4 canonical versions passed (mock test data):

| Version | Status of Improvements → Scenario(s) |
|---|---|
| 1 — Completed | As Stabilized |
| 2 — Under Renovation | As-Is + As If Complete & Stabilized |
| 3 — Demolition Land | As If Vacant Land + As If Complete & Stabilized |
| 4 — Insurance | Insurable Replacement Cost (override) |

The prior LOE-GRADE run recorded a full PASS across the gate for these. The grade docs (`tests/LOE-GRADE-784140-2026-06-10.md`, `tests/LOE-GRADE-scheduleA-fix-2026-06-10.md`) are the per-run records — a run is "clean" only when every gate item is PASS or a documented-flagged gap.

---

## 8. Gaps

**Goal:** zero of these — one-command render, every narrative written.

**Current State:**

**Gap 1 — no LOE-render CLI.** Rendering the LOE today is a multi-step manual flow (pull the DB template, generate, serve over http, capture with playwright PDF). There's no single command to render a job's LOE to a PDF. Until one exists, follow the serve + playwright-PDF steps from the gate (item D9).

**Gap 2 — Insurable Replacement Cost narrative unbuilt.** The Insurance-override scenario resolves to a literal `[EA/HCSummary_n]` bracket because the narrative library has no text for it yet (`loeCascade.ts` notes it as PENDING). This is a CONTENT gap (Chris/Codex write the narrative), not a wiring bug — the cascade correctly selects the scenario; the text just doesn't exist. Flag it; don't pass it silently and don't treat it as a render failure.

**Routing reminder:** template-layer fixes (Schedule A markers, Example-block removal, narrative text, layout) all go to Codex, who owns the `loe_templates` DB row. QA flags + routes; Codex fixes + pushes to Supabase; QA re-verifies by reading the row back and re-rendering.

---

## 9. Tools / CLIs for this phase

> These markdowns double as a reminder of our capabilities + how we do the work. For Phase 4 specifically:

- **`/cli-apr-tools` + Supabase REST direct** — read the live `loe_templates` DB row (V07, `is_active`), confirm which version renders; read `job_loe_details` for the cascade inputs.
- **`/supabase-deploy`** — template-layer fixes route to **Codex** (owns the DB row) and ship via this skill; the cascade-engine code (`loeCascade.ts`, `generateLOE.ts`) ships via Vercel.
- **`/guide-vercel-deploy`** — render-logic changes need a deploy (Vite dev proxies `/api`).
- **http server + `/cli-browser-auto` + playwright PDF capture** — the render is print/Paged.js media; `file://` blanks in playwright, so serve over http and capture the real PDF. Deliver the PDF as a clickable path, NOT a screenshot.
- **`/agent-screenshot` + `/vision-prime`** — visual-verify the rendered letter against the Coverage Gate (§10 rows match status, Schedule A correct, zero token leaks, Example block gone).
- **Codex** — owns the `loe_templates` DB-row template edits (the unbuilt Insurable Replacement Cost narrative is a content gap that routes to Codex, not a wiring bug).

---

## 10. Definition of Done

### Today-PASS (the render engine works)

1. The LOE renders from the live `loe_templates` DB row (LOE-07-1 v7), captured at the PDF level over http (not file://).
2. Across all 4 canonical versions, §10 scenarios match the Status of Improvements, Approaches match, and there are zero blank §10 rows.
3. Schedule A is correct for both a single-property and a multi-property job; the Example block is gone.
4. Zero unresolved token leaks except the one documented-pending narrative (Insurable Replacement Cost).
5. Every coverage-gate item (A1–E12) is PASS or a documented-flagged gap, recorded in a dated grade doc.
6. The rendered PDF is delivered as a clickable path Ben can page through.

### Goal-PASS (clean + complete)

1. A one-command CLI renders a job's LOE to a PDF (Gap 1 closed).
2. The Insurable Replacement Cost narrative is written, so the Insurance version renders with real text and zero brackets (Gap 2 closed).

---

*Sources: `src/utils/loe/generateLOE.ts` (DB-template fetch, §10 cascade wiring, docuseal/email path), `src/utils/loe/loeCascade.ts` (STATUS_TO_SCENARIOS / STATUS_TO_APPROACHES / INSURANCE_OVERRIDE_SCENARIO / NARRATIVES / resolveNarrative), `tests/LOE-TEST-COVERAGE-GATE.md` (the canonical gate), `tests/LOE-GRADE-784140-2026-06-10.md` + `tests/LOE-GRADE-scheduleA-fix-2026-06-10.md` (prior PASS records), `docs/Features/12-LOE-Esign/CASCADE-LOGIC-SPEC-AND-WIRING.md` (cascade spec), `supabase/migrations/20260610_loe_eahc_fence_markers.sql` (fence-marker suppression).*
