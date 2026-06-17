---
id: spec-notes-value-scenario-editor
title: "Spec Notes — Value Scenario narrative viewer/editor (see + edit the paragraph BEFORE the contract)"
status: notes-for-spec (not yet gated)
created: 2026-06-16
type: spec-notes
owner: co-architect (notes) · ui-designer (mockup) · Ben (direction) · Chris (the end reviewer/editor)
related:
  - ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/SPEC-NOTES-email-editor-phase2.md
  - ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/VERIFY-per-version-LOE-doc-spec.md
entry_files:
  - ~/Development/APR-Dashboard-v3/src/utils/loe/loeCascade.ts  (NARRATIVES library — summary/eaDetail/hcDetail)
  - ~/Development/APR-Dashboard-v3/src/utils/loe/generateLOE.ts (§10 render — only [EA/HCSummary_n] consumed)
  - ~/Development/APR-Dashboard-v3/src/components/dashboard/job-details/LoeQuoteSection.tsx (Section 2 host + save-doc pills)
tags: [loe, value-scenarios, section-10, narrative, editor, dashboard, spec-notes]
---

# Spec Notes — Value Scenario narrative viewer/editor

> **The core insight (Ben, from a client conversation):** the cascade dropdowns and Value Scenario
> fields are abstract — you pick options but you DON'T see the paragraph they actually generate until
> you open the finished contract, and by then it's too late/too far away to edit. Section 10 really
> just produces a paragraph per scenario; everything else is plumbing. **So surface the generated
> paragraph right where you choose — see it, read it, edit it, lock it — BEFORE it reaches the HTML.**
> Chris (the client) isn't sure all the written scenario text is right yet and wants to review it.
>
> **The mental model (Ben):** §10 stops being a blind auto-populate. This dashboard area becomes a
> live mirror that **maps to the §10 spot in the HTML** — you see exactly what's going to land there
> and can tweak it right here in the dashboard before it ships, instead of discovering it only on the
> finished contract.

---

## What this solves
Today: pick Status of Improvements → Value Scenarios derive → a one-line summary renders in §10 of the
contract. You only ever see the actual words by generating the full LOE. Editing the words means
touching code (`NARRATIVES` in `loeCascade.ts`) — Chris can't do that, and no one sees the text in
context before it ships.

## The ask — two linked pieces

### A. A scenario review/editor surface (cog entry point)
- A **cog (gear) icon beside the "Value Scenarios" label** in the LOE & Valuation Details area
  (Section 2, `LoeQuoteSection`). Click it → opens a review/edit surface for the scenario narratives.
- Shows **the scenarios currently in the registry AND what's loading into the HTML now** — side by
  side / in one place, so Chris can see what will actually render.
- **All the summaries are editable here.** Edit → save → that's what populates §10. It "locks it here"
  — the reviewed/approved text outside the HTML, easy to view, before it goes into the document.
- **Scope now = SUMMARIES only.** Each scenario also has fuller EA-detail + HC-detail paragraphs
  (they exist in the library, see "Grounding" below) — Ben's unsure whether the detail editing lives
  here too or somewhere else. Park the detail; build the summary editor first. (Tie-in: the detail
  paragraphs are also the unwired §10 content noted in the per-version verify doc.)

### B. See the paragraph inline, at the point of choice (the real win)
- In the Value Scenarios area, mirror the **saved-documents dropdown pattern** (the contract pills):
  show the derived scenarios as **pill buttons**.
- **Click a pill → it expands underneath** into a read/edit block showing THAT scenario's actual
  paragraph (there isn't much text per scenario, so it stays compact). Edit inline → save.
- Even stronger: **when you pick a scenario, write the paragraph out underneath it** so you literally
  see what §10 will say — not just the scenario name. Turns the abstract field picks into visible
  output right in the dashboard.

## Grounding (verified this session, not assumed)
- The narrative library `NARRATIVES` (in `loeCascade.ts`) already holds **three slots per scenario**:
  `summary`, `eaDetail`, `hcDetail`. **Only `summary` is rendered** into §10 today
  (`resolveNarrative` → `[EA/HCSummary_n]`); `eaDetail`/`hcDetail` exist but are "not yet consumed by
  the template." So "summaries only for now" matches what actually renders.
- These narratives currently live **in code** (a hardcoded `const`), not in any editable store. So an
  editor that lets Chris change + lock text needs a **persistence home** — same shape as the email
  managed-default (`email_templates`) / `job_contracts` pattern. Decision below.
- §10 already suppresses empty rows and keeps a literal `[EA/HCSummary_n]` bracket when a scenario has
  no text (e.g. Insurable Replacement Cost / V4 — pending Chris's copy). An editor is exactly how Chris
  would supply that missing text.

## Open questions to resolve before this is a buildable spec (DON'T assume)
- **Where does edited text persist?** A new DB table of scenario narratives (editable, the new source
  of truth) replacing/overriding the hardcoded `NARRATIVES`? Global (one set of summaries reused on
  every job) or per-job overrides, or both (managed default + per-job edit, like the email model)?
- **Summary vs detail:** confirm summary-only for v1; where the EA/HC detail editing eventually lives.
- **Who edits — Chris or internal only?** Affects auth/RLS + whether it's a settings page vs a per-job panel.
- **Cog → modal/page vs inline-expand pills:** are A and B the same surface (the cog opens the
  pill-expand editor) or two things (a full review page AND inline dashboard pills)? Lean: one surface,
  reachable both from the cog and inline.
- **Lock/approve semantics:** does "locks it here" mean a saved/approved state that the contract then
  reads, vs draft? Mirror the draft/sent contract lifecycle?
- **Registry relationship:** the registry defines the scenario list + the EA/HCSummary fields — does
  editing here feed back to the registry, or is the registry just the option-set source?

## Files this will likely touch (preliminary)
- `LoeQuoteSection.tsx` — the cog + the inline pill/expand viewer in the Value Scenarios area.
- `loeCascade.ts` / a new narratives module — move narratives from hardcoded const to an editable store.
- `generateLOE.ts` — read scenario text from the store instead of the const (so edits flow to §10).
- A migration for the narrative store (+ RLS).
- ui-designer mockup FIRST (Ben asked) — the pill-expand-editor interaction in the Section 2 layout.

---

*co-architect notes, 2026-06-16. Grounded in the §10 verification done this session (NARRATIVES =
summary+eaDetail+hcDetail; only summary renders; narratives currently hardcoded). Next: ui-designer
mockup → resolve open questions with Ben → gated build spec. Sequence AFTER the current address/cascade
close-out; bank alongside the email-editor Phase-2 notes.*
