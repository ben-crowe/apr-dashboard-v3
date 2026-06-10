---
content_type: test-gate
title: LOE Test Coverage Gate — what to verify on EVERY LOE test
status: active — the canonical LOE review checklist; QA runs the LOE against THIS every time
created: 2026-06-10
updated: 2026-06-10
last_reviewed: 2026-06-10
owner: qa-agent (runs the gate) · co-architect (maintains) · Codex (owns template fixes)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
tags: [apr-workflow, apr-testing, loe, test-gate, qa-gate, coverage, ground-truth]
---

# LOE Test Coverage Gate

**Tags:** #apr-testing #loe #qa-gate #test-gate #coverage #ground-truth #apr-workflow
**Entities:** [[LOE-07]] [[APR-Testing]]

**The documented "what to look for" when testing the LOE.** A green LOE test is only valid if EVERY
item below was checked. Testing without this list = happy-path testing = misses things (that's how
Schedule A slipped, 2026-06-10). Run the LOE against this gate every time; record PASS/FAIL per item.

> ## ⚠ THE LESSON (2026-06-10)
> The 4-version scenario proof passed — but it only tested the SCENARIO cascade. It never exercised
> the LOE's OTHER conditional behaviors (Schedule A / multiple properties, the Example-block leak).
> An undocumented test verifies what you *thought* to check, not what the document actually does.
> **This gate exists so the coverage is documented, not remembered.**

---

## The gate — check ALL of these, every LOE test

### A. Cascade → Section 10 (the scenario engine)
1. **§10 Value Scenarios match the Status of Improvements** — verify across ALL status versions, not
   one. Reference the cascade spec: [CASCADE-LOGIC-SPEC-AND-WIRING.md](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/CASCADE-LOGIC-SPEC-AND-WIRING.md). The 4 canonical versions (mock test data):
   Completed→As Stabilized · Under Renovation→As-Is + As If Complete & Stabilized · Demolition Land→As If
   Vacant Land + As If Complete & Stabilized · Insurance→Insurable Replacement Cost.
2. **§10 narratives resolve to REAL text** — a literal `[EA/HCSummary_n]` bracket = narrative library
   GAP (flag to Chris/Codex), NOT a wiring bug. Distinguish the two. (Known gap: Insurable Replacement
   Cost narrative unbuilt.)
3. **§10 row cleanliness** — fence-marker suppression (`<!-- EAHC-ROW-n:START/END -->`) removes empty
   rows. ZERO blank `<tr>` on a <6-scenario job. (Was the 784140 FAIL — fixed in DB template.)
4. **Approaches to Value** matches `STATUS_TO_APPROACHES` for that status.

### B. Conditional sections (the parts that DON'T always appear) — THE MISS BUCKET
5. **Schedule A — multiple properties.** Test BOTH a single-property AND a multi-property job. Schedule
   A must list each property when multiple, and suppress/collapse when single. Needs conditional markers
   in the DB template, same pattern as the §10 fences. ⚑ This is the path that was missed — never skip it.
6. **Example block** — the static "Example" legend under §10 must NOT print on a real contract (flagged
   for removal). Confirm it's gone.

### C. Token / field integrity
7. **Zero unresolved `[Token]` leaks** — any stray `[Placeholder]` in the rendered output = FAIL (unless
   it's a known library-pending narrative, item 2 — then flag, don't pass silently).
8. **Core fields populate** — letterhead, client name, property name + address, fee, retainer, all dates,
   property rights/interest. Spot-check against the job data.

### D. How to actually render + verify (the gotcha)
9. **Verify at the rendered-PDF level, not just HTML string.** The LOE template is print / Paged.js
   media — `file://` loads silently fail in playwright (lands on about:blank → blank capture). **Serve
   over http + use playwright** (not a screen screenshot) to get the real letter.
10. **The active template is the Supabase `loe_templates` DB row** (LOE-07-1 v7) — NOT the static
    `LOE-template-v07.html` file. Verify against the DB template.

### E. Ownership routing
11. **Any template / HTML / spatial fix → Codex.** Schedule A markers, Example-block removal, narrative
    text, layout — all Codex's template work, NOT a code change. QA flags + routes; Codex fixes; QA
    re-verifies.

---

## Per-run record

Each LOE test logs PASS/FAIL per item (A1–E11) in a dated grade doc, e.g.
[LOE-GRADE-784140-2026-06-10.md](~/Development/APR-Dashboard-v3/tests/LOE-GRADE-784140-2026-06-10.md).
A run is only "clean" when every gate item is PASS or a documented-flagged gap.

## Related
- [Cascade Logic — Spec + Wiring](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/CASCADE-LOGIC-SPEC-AND-WIRING.md) — the scenario engine.
- [Cascade → LOE contract notes](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/loe07-build/CASCADE-TO-LOE-CONTRACT-NOTES.md) — §10 + narrative detail.
- [E2E Testing Workflow — Master Plan](~/Development/APR-Dashboard-v3/tests/E2E-TESTING-WORKFLOW-MASTER.md) — the full pipeline test this LOE gate sits inside.

---

**Last reviewed:** 2026-06-10 by co-architect — authored after the Schedule-A miss; turns QA's
in-head "review gate" into a documented, dashboard-linked checklist so LOE coverage is provable, not
remembered. Linked from the [APR Master Dashboard](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md) Testing section.
