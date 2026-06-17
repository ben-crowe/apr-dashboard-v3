---
id: assembly-prompt-value-scenario-editor
title: "Assembly Prompt — Value Scenario narrative editor → ui-designer (MOCKUP-FIRST, then build)"
created: 2026-06-16
type: assembly-prompt
owner: co-architect (author) · qa-agent (prompt-gate + build-verify) · Ben (mockup approval + GO)
builder_persona: ui-designer (dev-3)
spec: ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/SPEC-value-scenario-editor.md
status: for-prompt-gate
tags: [assembly-prompt, loe, value-scenarios, section-10, narrative-editor, ui-designer, mockup-first]
---

# Assembly Prompt — Value Scenario narrative editor (ui-designer, mockup-first)

> **Goes to QA `/review-gate` prompt-mode BEFORE dispatch.** Builder = **ui-designer** (it's a new UI
> surface in Section 2 + a UX interaction Ben wants to see before code). **MOCKUP FIRST** — Ben approves
> the mockup, THEN build. Two phases in one prompt; do NOT build past the mockup until Ben says GO.

---

## THE PROMPT (paste as ui-designer's task)

You are **ui-designer** on the APR Dashboard v3 (React 18 + TS + Vite, dev port 8086, Supabase, Tailwind
+ Shadcn). This is a spec-gated feature: the **Value Scenario narrative editor** — make Section 10 of the
LOE a *live mirror* you can see + edit in the dashboard before it reaches the contract. The spec PASSED
QA's gate; build to it, don't redesign the data model.

### STEP 0 — Load + activate skills (show evidence of invocation)
- **`/cli-agent-all`** — load FIRST: the full APR toolkit (browser · Supabase read/write+readback ·
  deploy) + the app's documented traps (incl. "editing Valcre/server code locally routes through the
  DEPLOYED proxy" — not relevant here but know it).
- **`/frontend-design`** + **`/ui-ux-pro-max`** — this is a new UI surface + interaction; design it properly.
- **`/supabase-deploy`** — the new `scenario_narratives` table + RLS (instance `ngovnamnjmexdpjtcnky`; you have full Supabase access).
- **`/cli-browser-auto`** — headless browser test on :8086, **logged in as bc@crowestudio.com** (NOT Playwright, never --headed).
- **`/search-2phase`** — run it scoped (STEP 2) BEFORE touching code.
- **`/checkpoints`** — checkpoint as ui-designer when done.

### STEP 1 — Read the spec + grounding (authoritative)
- **The spec, in full:** `~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/SPEC-value-scenario-editor.md` (incl. BLOCKING-1/2 + the dead-file line + the 3 notes).
- **Verify reference (what §10 renders per version):** `VERIFY-per-version-LOE-doc-spec.md`.
- **Source notes (the why, Ben's framing):** `SPEC-NOTES-value-scenario-editor.md`.

### STEP 2 — Search-prime (both phases, scoped) — START HERE before any code
`Activate /search-2phase` → `--project ~/Development/APR-Dashboard-v3 --topic "LOE value scenarios NARRATIVES resolveNarrative generateLOEHTML section 10 EA/HCSummary LoeQuoteSection saved-doc pills email_templates seedTemplatesIfEmpty scenario_narratives RLS"`. Thin leg → read the spec's entry files directly (ground truth), don't conclude "missing."

### STEP 3 — ⚑ PHASE A: MOCKUP FIRST (stop here for Ben's approval — do NOT build past this)
Produce a **visual mockup** of the editor surface so Ben sees the interaction before code:
- The **cog beside the "Value Scenarios" label** in the Section 2 (`LoeQuoteSection`) layout — where it sits.
- The **pill-expand interaction:** derived scenarios as pills (mirror the saved-contract pill pattern); click a pill → it expands underneath into a compact read-block showing that scenario's actual §10 paragraph → an edit affordance turns it editable → Save.
- Show **read-first** state, **editing** state, and the **save-fail** state (named toast).
- Decide + show the container (the spec leaves cog→modal-vs-inline open — pick one, show it, note why).
Deliver the mockup (HTML prototype or rendered screens) + a one-paragraph interaction note. **Then STOP and report "MOCKUP READY for Ben" — do not proceed to Phase B until Ben approves.**

### STEP 4 — PHASE B: BUILD (only after Ben approves the mockup)
Build to the spec. The load-bearing mechanics (from the gate):
- **Data:** new `scenario_narratives` table (`scenario` unique, `summary`, room for `ea_detail`/`hc_detail` later, `updated_at`). **Seed at runtime, upsert-if-empty** — mirror `seedTemplatesIfEmpty`; seed VERBATIM from the code `NARRATIVES` const (incl. the "makret" typo — Chris's call, don't fix). **RLS v1: authenticated-internal write / public read.**
- **⚑ BLOCKING-1 — preload-once, mapper stays SYNC:** in `generateLOE.ts`, have **`generateLOEHTML` (async, ~L240)** do a **one-shot load of ALL narratives BEFORE the token-map builder**, then pass an **in-memory resolver** into the still-synchronous mapper (the §10 loop at L193 resolves against the preloaded set, not the const, not a per-call await). Do NOT make the mapper async. Mirror the `loadTemplateRow` await precedent.
- **⚑ Where the const + resolver live — `loeCascade.ts`:** the `NARRATIVES` const (seed source) AND `resolveNarrative` (`loeCascade.ts:197`) both live here. The seed-verbatim-from-`NARRATIVES` and the resolver-swap-to-store both touch this file — don't rely on the search to locate the const home.
- **⚑ DEAD-FILE:** build the cog/pill surface in **`LoeQuoteSection.tsx`** — NOT `LoeQuoteSectionIndependent.tsx` (dead, zero importers, the only current `resolveNarrative` caller; don't follow it there).
- **Surface fail-states:** store-fetch-fail on open + save-fail → honest error/toast, never silent success; §10 generator falls back to the code seed on fetch-fail (no blank-regress).
- **Scope:** SUMMARIES only (park ea/hc detail); GLOBAL store (last-write-wins, known v1).

### STEP 5 — Self-verify (logged in as bc@crowestudio.com, DB-read-after-reload)
Run the spec's acceptance 1–7. The proof that matters: **edit a summary → save → reload → re-query the store = persisted → generate the LOE → §10 shows the EDITED text** (live mirror end-to-end). Plus: fresh-store seed fidelity (today's exact text incl. "makret"), give Insurable Replacement Cost text → it renders in §10, suppression unchanged, `tsc --noEmit` + build clean.

**⚑ AUTH TRAP — the WRITE proofs need a genuinely authenticated session (this is BLOCKING-2 biting at verify-time):** RLS = authenticated-internal write. A headless/agent-browser session that is NOT logged in will **silently no-op the write and read back empty** — so acceptance **#3 (edit→save→persist)** and **#5 (give Insurable text → renders)** run on an anon session produce a FALSE fail (or an optimistic-UI false pass). So: the write-path acceptance MUST run under a **real authenticated session**. If an authenticated headless session isn't achievable, **do NOT report the anon no-op as pass OR fail** — route that specific persist-verify to a logged-in check (Ben-driven or QA build-verify) and say so. **Reads / seed-fidelity / suppression CAN verify headless; the WRITE proof cannot on anon.**

### DEPLOY + REPORT
**DEPLOY FREELY** (Ben policy — APR is a test/prep instance): after client-side verifies, commit to main + `vercel --prod`, just **inform** Ben. No secrets committed. Report a VERIFY artifact (acceptance results + DB rows + the §10-shows-edited-text proof + files changed + any deviation). Checkpoint as ui-designer. Co-arch verifies → QA runs independent build-verify.

### WORKER DOCTRINE
No `AskUserQuestion`/menus — pick + report "Picked Option N, Reason" or emit `STUCK:`. The one hard stop is the **mockup-approval gate** (end of Phase A) — that's Ben's, report and wait.

---

*co-architect, 2026-06-16. Spec gate = PASS (QA, rev 2 verified in-file). → QA prompt-gate (mode-2) → dispatch ui-designer mockup-first → Ben approves mockup → build → deploy → QA verify.*
