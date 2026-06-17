---
id: spec-v4-slice2-gate-section3
title: "SPEC — V4 Slice 2: Gate section 3+ (ship sections 1–2 standalone to Chris, V4 stays dark)"
created: 2026-06-16
type: implementation-spec
status: for-spec-gate (QA flaw-review) → then Ben sign-off → then build
track: "Track 1 — co-architect authored (follows Slice 1 Unlock+Persist)"
owner: co-architect (author) · qa-agent (spec-gate + build-verify) · Ben (sign-off + GO)
source: V4-STATE-OF-PLAY-2026-06-16.md §4b (Ben's three locked guardrails)
tags: [apr, v4, feature-gate, section-3, standalone-v3, chris-handoff, report-builder, spec]
---

# SPEC — V4 Slice 2: Gate section 3+ (V3 sections 1–2 ship standalone)

> **One line:** Add ONE feature switch that hides section 3 onward (property research → report builder)
> so **sections 1–2 (intake + LOE) ship to Chris's team as a clean, standalone V3 product** while V4 is
> built silently behind the gate. Flag OFF = client build; flag ON = our internal/dev build.

> **PREP — nothing builds until Ben signs off + QA passes.**

---

## The goal (root, not just the task)
Chris's team uses **sections 1 & 2** as their live app — client intake + LOE prep + e-sign — and keeps
doing full reports in **Valcre** as they do today. They must NEVER see half-built V4. We keep building
V4 (section 3+, the report builder) behind a switch and flip it on per-environment only when ready.

---

## Ground truth (code-verified)
- **Live job view** = `JobDetailView.tsx` → renders `JobDetailAccordion.tsx` ("the correct clean version").
- `JobDetailAccordion.tsx` renders, in order: Section 1 `ClientSubmissionSection`, Section 2 `LoeQuoteSection`, **Section 3 `OrganizingDocsSection` + `PropertyInfoSection`, Section 4 `Section4Compact`**.
- The report builder route (from Slice 1) = `/dashboard/job/:jobId/report` (nested in Dashboard).
- **No app-level feature-flag pattern exists yet** (the `isEnabled` hits in `report-builder/` are per-field render toggles, unrelated). So this slice introduces the first clean one.

---

## Design — ONE switch, build-time env flag

**Mechanism: a single env-based flag + one helper.** Simplest correct v1 — no DB, no UI, no auth needed.
- `VITE_V4_ENABLED` (Vite build-time env var). **Default = OFF** (absent/false) so the safe default is "client build, V4 dark."
- One helper, single source of truth: `src/lib/featureFlags.ts` → `export const isV4Enabled = () => import.meta.env.VITE_V4_ENABLED === 'true'`. Every gate point reads THIS, never the env directly.
- **Client/Chris build:** flag unset → V4 dark. **Our dev + internal Vercel build:** flag = `'true'` → full V4 visible (no change from today's experience).

**Why env-var, not a DB/runtime toggle (recommendation):** the gate is per-environment (Chris's build vs ours), not per-user or per-session — a build-time flag is the least code, no auth dependency, and can't be flipped by accident in the client's running app. A runtime/DB toggle is a later upgrade IF we ever need to flip it live without a redeploy; noted, not built now.

### DEPLOYMENT SPLIT — DECIDED (Ben, 2026-06-16): same Vercel project, per-environment, NO new domain yet
QA's correct catch: one build-time switch only differs between Chris and us if there are **two builds** — one site can't be lit and dark at once. **Ben's call: do NOT split to a new domain yet.** So:
- **Production environment = `VITE_V4_ENABLED` OFF/unset** → the live URL Chris's team uses is V4-dark (sections 1–2 only).
- **Preview + Development environments = `VITE_V4_ENABLED=true`** → our internal builds show full V4.
- Set via **Vercel project env vars scoped per-environment** (Production vs Preview vs Development — Vercel supports this natively). One project, two configs, zero new infra.
- The **separate-domain / multi-tenant SaaS split is the LATER track** (State-of-Play §4b point 3) — not now. This per-environment split is the interim.

---

## Gate points (everything reads `isV4Enabled()`)
1. **Sections 3 & 4 in `JobDetailAccordion.tsx`** — when OFF, do NOT render `OrganizingDocsSection`, `PropertyInfoSection`, `Section4Compact`. Sections 1 & 2 ALWAYS render. (Gate the AccordionItems, not just hide via CSS — they must not mount, so no V4 code runs / errors in the client build.)
2. **The report route `/dashboard/job/:jobId/report`** — when OFF, route is not registered / redirects to the job view (no direct-URL access to the builder). When ON, works as Slice 1 shipped.
3. **Any nav/link/button to the report builder or section 3+** — when OFF, not rendered (no dead entry points). Sweep for links to the report route + any "open report builder" affordance.
4. **The standalone routes `/mock-builder` + `/calculator-demo`** (re-enabled in Slice 1) — gate these too; they are V4 dev surfaces, dark in the client build.

---

## Acceptance (verified on the DEPLOYED app)

**Flag OFF (the Chris/client build — the important half):**
1. Sections 1 & 2 render and are FULLY functional — intake submit, LOE cascade, e-sign — with zero dependence on V4.
2. Sections 3 & 4 do NOT appear in the job view; their components never mount.
3. `/dashboard/job/:jobId/report`, `/mock-builder`, `/calculator-demo` are NOT reachable (redirect / NotFound) even by direct URL.
4. No link/button anywhere leads to a gated surface (no dead ends).
5. No console errors from the absence of V4 — sections 1–2 are provably standalone.

**Flag ON (our internal build — no regression):**
6. Everything renders exactly as today — sections 1–4 + the report builder all present and working.

**Both:**
7. `tsc --noEmit` + `npm run build` clean; the DEPLOYED Vercel build passes. Document how to set the flag per Vercel environment (project env var `VITE_V4_ENABLED`).

---

## QA spec-gate notes (PASS — builder folds in)
QA flaw-review: design sound, default-OFF integrity real, no entry-links to gate today. Two notes:
1. **Future-proof the gate:** if any section-3 entry button/link is ADDED later it MUST read `isV4Enabled()`. Leave a comment at the gate so it's not missed.
2. **Delete the two dead job-view copies** that still import the gated sections (`JobDetailAccordionFixed.tsx`, `JobDetailAccordionSimple.tsx` — confirm zero importers first) so the gate can't be sidestepped via a stale path. If either has a live importer, gate it instead of deleting.

## Explicitly OUT of this slice
- **Building any new V4 functionality** — this is purely the gate. Section 3+ content/report-builder work continues on its own behind the flag.
- **The SaaS/multi-tenant + separate-domain track** (State-of-Play §4b point 3) — that's a parallel strategic planning track, not this slice.
- **A runtime/DB/per-user toggle or an admin UI for the flag** — env-var is the v1; runtime toggle is a later upgrade only if needed.

---

*co-architect, 2026-06-16. Per Ben's §4b guardrails. → QA spec-gate flaw-review → Ben signs off + GO → build → deploy → QA build-verify (both flag states, headless).*
