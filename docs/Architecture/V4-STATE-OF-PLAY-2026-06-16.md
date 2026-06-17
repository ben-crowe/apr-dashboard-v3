---
content_type: planning-foundation
title: APR V4 — State of Play & Planning Foundation
status: living — planning foundation for the V4 (real report builder + calculator) phase
created: 2026-06-16
author: mcp-knowledge-manager
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
sources: [APR-V4-ARCHITECTURE.md, APR-V4-IMPLEMENTATION-GUIDE.md, UNIFIED-ARCHITECTURAL-TRUTH-DRAFT.md, 07-Report-Builder docs, live-codebase audit 2026-06-16]
tags: [apr, v4, report-builder, calculator, planning, registry, ground-truth]
---

# APR V4 — State of Play & Planning Foundation

**Purpose.** One consolidated, ground-truthed picture of the V4 phase (the "real report builder
+ appraisal calculator") before we plan the build. Synthesizes the documented vision + the
report-builder docs + a live codebase audit (all 2026-06-16). Cite-or-drop: where docs and code
disagreed, code wins and it's flagged.

> **One-line truth:** V4 is a *working engine behind a locked door with no memory.* The hard
> parts (calculator, template auto-build, field registry, job→report loader) are genuinely built
> and compute correctly. It can't be "turned on" today because the routes are commented out and
> there is no persistence. The path to live is short and concrete.

---

## 1. The documented vision

Replace the fragmented **Valcre → Excel → Word** workflow with a single web report builder:

- **Unified report generation** — capture all report fields in one structured interface with a
  live HTML preview of the multi-page report as data is entered.
- **Dual-calculator trust mode** — internal calculator runs side-by-side vs the Excel import so
  the appraiser can verify the numbers match (the trust bridge off Excel).
- **Client-link delivery** — shareable URLs instead of large email attachments that fail to send.

Stated goals: cut report generation time sharply, fewer formatting errors via live preview, high
delivery success, and a high match-rate between internal vs Excel calculations.

---

## 2. What's genuinely BUILT (live-code verified)

| Capability | Status | Evidence |
|---|---|---|
| **Calculator — all 3 approaches** | ✅ Real, computes (not stubs) | Income table system + `runSalesCompCalculations()` + `runCostApproachCalculations()`, all wired into the store and firing |
| **Income approach** | ✅ Complete + validated | Validates to an exact match against the real Valcre workbook (North Battleford test property lands on the correct value) |
| **Multi-page report template** | ✅ Written + auto-renders | `public/Report-MF-template.html` (~31K lines, the "79-page" template); loaded live + interpolated via `interpolateTemplate()` |
| **Live preview pipeline** | ✅ Wired | Zustand store → PreviewRenderer → iframe, with debounce |
| **Field registry** | ✅ Real (~2,082 defs) | `src/features/image-configurator/report-builder/schema/fieldRegistry.ts` (~22K lines) |
| **Job → report INBOUND bridge** | ✅ Built | `useLoadJobIntoReport.ts` pulls job_submissions + LOE + property info into report fields |
| **Mock split-screen builder** | ✅ Built | `MockReportBuilder.tsx` — exists, but route disabled (see §3) |

**Bottom line:** Ben's "the report nearly auto-builds and the calculator fully works" is TRUE.

---

## 3. Why it can't be "turned on" today (the two blockers)

1. **The doors are bolted shut.** In `src/App.tsx` the `/mock-builder`, `/calculator-demo`, and
   the report routes are **commented out**, and the component imports are disabled with a
   `// TODO: consolidate report-builder location (symlink issue)`. Root cause: a banned symlink
   `src/features/report-builder -> image-configurator/report-builder`; `MockReportBuilder.tsx`
   imports through it, which breaks the Vercel build, so the routes were disabled instead of the
   imports being fixed. (This is the exact workaround the root CLAUDE.md forbids.)

2. **It has no memory.** State lives purely in the Zustand store — refresh loses everything.
   - `report_builder_data` Supabase table: does NOT exist; zero references in `src/`, `api/`, `supabase/`.
   - `useSaveReportBuilderData` (the OUTBOUND save half of the bridge): does NOT exist.
   - No persist middleware, no autosave.

---

## 4. Shortest path to "turned on"

1. **Unlock** — kill the symlink, repoint `MockReportBuilder.tsx` imports to the real
   `@/features/image-configurator/report-builder/...` path, uncomment the 3 imports + routes in
   `App.tsx` (and add `/dashboard/job/:jobId/report`). Build passes → demoable in-app today.
2. **Persist** — create the `report_builder_data` table + migration; write `useSaveReportBuilderData`
   + a debounce autosave. → persistent, usable product.
3. **Finish the approaches** — Income is done; Sales comparison spec written (≈620 fields, ~0 test
   data); Cost approach not started. Wire all three into the full report (currently sandboxed).
4. **Delivery + export** — share links, PDF/HTML/Excel/JSON export.

Steps 1–2 alone = a live, persistent report builder. The rest is completeness.

---

## 4a. Team scope-review addenda (co-architect + qa-agent, 2026-06-16)

Both agents independently reviewed this scope; co-architect re-verified the two blockers in live
code. Their additions are now part of the plan:

**Bundle A + B as a single first slice.** Unlock alone = a builder that forgets everything (bad
demo); Persist alone = a save hook you can't reach (can't test). Together they're the first real,
demoable, *persistent* product. (co-arch)

**Two GATES to resolve BEFORE that slice is built:**
1. **Pick the code's true home first.** The builder lives under `image-configurator/` but docs point
   at `features/report-builder/` — the mismatch the symlink was papering over. Just repointing imports
   to make the build pass = recreating the banned workaround. Decide the real home ONCE, then unlock.
2. **Decide the save shape before building the table.** ~2,000 fields ≠ 2,000 columns → JSON bag +
   a few queryable columns. **Lock row-level security / auth rules day one** — this session was burned
   twice by writes that silently failed without auth; the report builder must not ship with that hole.
   QA's sharpening: a raw JSON blob of ~900 fields with no schema is hard to verify (nothing guarantees
   a field exists or is well-shaped) — it needs structure or a validation layer, not a bare blob.

**Risks flagged:**
- **"Done" = the DEPLOYED Vercel build passes**, not just a local check. The build break is
  Vercel-specific (same local-vs-deployed trap hit this session).
- **Calculator-completion is the heavy, risky piece** and belongs LATE: Sales ≈620 fields with almost
  no test data, Cost not started — correctness can't be verified yet. Test-data gathering is its own
  prerequisite, not part of slice one.
- **Report fields reconcile THREE ways** (registry → code → template placeholder) vs the two-way Valcre
  mapping we certified. Pattern carries over, one step more complex — the registry-extension lane.

**⚠ Terminology trap — "Reconciliation" has TWO meanings; keep them apart in every spec:**
- *Appraisal* reconciliation = a real report section where the three approaches resolve to one final value.
- *Our* reconciliation = the registry-vs-code(-vs-template) certification check.
The search/memory layer has already conflated these. KN-Mgr owns disambiguating it in the knowledge layer.

**Sequence (team-agreed):** resolve the two gates → ship A+B (Unlock+Persist) verified on the deployed
app → then run **registry-extension** and **calculator-completion** as separate parallel tracks.

---

## 4b. Ben's product/deployment direction (2026-06-16) — THREE locked guardrails

These shape every V4 slice from here. Captured from Ben in-session; co-architect authored.

**1. The V3/V4 seam is a GATE — section 3 onward stays hidden until V4 is done.**
- **Sections 1–2 (client intake + LOE prep) = the shippable V3 product.** Standalone functional on its own. This is what Chris + his team get to USE as the live app today — intake, LOE/quote, e-sign. They keep using **Valcre** for full report building exactly as they do now.
- **Sections 3–4 onward (property research → report builder) = gated/not-opened** to the client until V4 is fully worked out + operational. We build V4 **silently** behind the gate, then introduce it once ready.
- **Build implication:** section 3+ and the report builder need a **feature-gate / hidden-route** so Chris's team never sees half-built V4 in their live app. Sections 1–2 must keep working with the gate ON. (This is a concrete near-term task — flag-gate the section-3+ surface.)

**2. Sections 1–2 must be verifiably standalone.** Intake + LOE prep cannot depend on any V4/report-builder code to function — Chris's team runs them with V4 entirely dark. Every V4 change is checked to NOT regress the standalone 1–2 flow.

**3. SaaS hosting model — our domain, NOT the client's. (NEW — biggest new planning item.)**
- Build/host the full app on **our own separate domain**, not on a client's domain. Clients access it via **subscriptions to our app** — we do not host the app on their site.
- This is a **multi-tenant SaaS** direction (our infra, our domain, per-client subscription access) rather than per-client deployment.
- **Status: needs its own planning track** — touches deployment architecture, multi-tenancy/data isolation, auth + subscription/billing, domain setup. Ben + KN-Mgr planning territory; co-arch specs once the shape is decided. NOT a Slice-1-adjacent task — a parallel strategic track to scope deliberately. Do NOT start building it off this note alone.

---

## 5. Fields, registry & the report mapping (the planning core)

This is the through-line from today's V3 registry work into V4.

- **The certified registry pattern is portable.** We just proved it on the workflow/job fields:
  HTML registry (canonical) → generated derivative (certified) → runtime (`api/valcre.ts`). The
  report fields extend the SAME system — new registry sections for report content (text, images,
  graphs, tables, narrative blocks).
- **Report fields map to a DIFFERENT runtime truth.** Job fields map to Valcre. Report fields map
  to **the report itself** — each field lands at a `{{field-id}}` placeholder in the multi-page
  template. So report-side reconciliation is THREE-way: registry ↔ field code ↔ template placeholder.
- **The mapping is already partly derived (the gold mine).** On disk today:
  - A Word reference report (`Ref.Report-VAL251012 - North Battleford Apt.docx`) — the page-structure source of truth.
  - Page-by-page mapping (`VALCRE_REPORT_STRUCTURE.md`) and cell-to-field mapping
    (`VALCRE_TABLE_FIELD_MAPPING.md`, e.g. `NOI → IA_DirCap_NOI → DIRECTCAP!$L$253`).
  - Field consolidation map (S1/S2/S3 "enter once, reference everywhere") + TDD-vs-Editor field map.
  - Image-field mapping doc (70+ image slots by destination).
- **Two UI modes documented:** a TDD/bulk-entry dashboard and an in-context Editor panel.

⚠ **Open: the field-count drift.** Docs cite 218 (calculator subset) / 330 / 944 / ~1,687 / 2,082.
Ground truth = ~2,082 registry definitions; the certified Valta subset = 218 calculator fields. Counts
must be re-derived from source, never doc-to-doc, before any planning leans on a number.

---

## 6. How V4 decomposes (candidate buildable pieces)

Each is an independent slice that can get its own spec → plan → build:

- **A · Unlock** — symlink fix + route re-enable. (Smallest; makes the engine reachable.)
- **B · Persistence** — `report_builder_data` table + save hook + autosave.
- **C · Registry extension** — extend the certified registry system to fully cover report fields
  (images/graphs/tables/narrative); the three-way reconciliation against the template. (Ben's lane.)
- **D · Calculator completion** — finish Sales + Cost approaches into the full report; reconciliation.
- **E · Report sections** — the non-calculator sections (cover, transmittal, exec summary, photos,
  maps, site, zoning, HBU, etc.).
- **F · Delivery & export** — share links, expiry/password, PDF/HTML/Excel/JSON export.

---

## 7. Open design questions (for Ben / the team)

- **Canonical code location** — the report-builder lives under `image-configurator/`; the documented
  `src/features/report-builder/` path only resolves via the banned symlink. Pick ONE home + fix imports.
- **Persistence shape** — hybrid (queryable columns for key values + JSONB for narrative sections)?
  Confirm the table schema.
- **Photos/images source** — does Valcre expose photo endpoints, or manual upload + CDN?
- **Registry extension model** — what new columns do report field types need (image source, render
  type, table binding) on top of the current registry array?
- **Sequence** — unlock+persist first (prove it live), or registry-extension first (continue the
  momentum)? See §6; these can run in parallel.

---

## 8. Division of labor (this phase)

- **Ben + KN-Mgr (mcp-knowledge-manager):** planning + thinking; prep planning files; capture the
  gold mine; own the knowledge/registry-search layer.
- **co-architect (+ react/Sorya specialist):** take the planning files → author specs + implementation plans → build.
- **qa-agent:** review specs for flaws; verify builds; code-vs-doc certification (as on the registry).

---

_Foundation only — not a build spec. The per-piece specs come next, authored off this doc._
