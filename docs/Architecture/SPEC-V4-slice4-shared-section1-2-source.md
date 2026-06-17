---
id: spec-v4-slice4-shared-section1-2-source
title: "SPEC — V4 Slice 4: Shared Section 1–2 field source (Option B build sub-spec)"
created: 2026-06-17
type: implementation-spec
status: for-spec-gate (QA flaw-review) → then Ben sign-off → then build
track: "Track 1/2 join — co-architect authored; registry owner (ui-designer) + QA co-build"
owner: co-architect (author/design) · ui-designer (registry model + generator + fixture) · qa-agent (drift-check gate + reconcile) · Ben (sign-off)
source: PROPOSAL-shared-section1-2-field-source.md (Ben picked Option B 2026-06-17)
tags: [apr, v3, v4, registry, single-source, drift-check, sections-1-2, test-fixture, sync-toggle, spec]
---

# SPEC — V4 Slice 4: Shared Section 1–2 field source (Option B)

> **One line:** Make the registry the canonical master of the Section 1–2 field set. V4 GENERATES its
> fields from it; V3 stays untouched but gets a STRICT, release-BLOCKING drift-check against it; the V4
> test-data fixture + a fixture/live toggle both speak that one field contract. Kills silent drift,
> rebuilds nothing in V3.

> **PREP — nothing builds until QA passes + Ben signs off. Build is multi-owner; see ownership per phase.**

## Locked decisions (from the approved proposal — do NOT re-litigate)
- **Option B** (not A): registry = master; V4 generates from it; V3 = drift-check, not a rebuild. (V3 is hand-built JSX — LoeQuoteSection 2301 lines/119 fields, ClientSubmission 912/97, zero registry import — so A's live-render = a V3 rebuild Ben ruled out.)
- **Asymmetric:** V4 (schema-driven) CONSUMES a generated config; V3 (hardcoded) gets a CONFORMANCE/DRIFT-CHECK only.
- **Canonical key = registry `n` (PascalCase), treated as an OPAQUE id.** Crosswalk is EXPLICIT per field, never algorithmically derived (PascalCase is inconsistent — `StatusofImprovements`).
- **Non-destructive:** V4-only S1/S2 fields (bucket 4) are REVIEWED, never auto-removed.
- **The drift-check is a HARD GATE** (blocks release) and **STRICT** (watches dropdown OPTIONS Chris edits, not just names). A loose/passive checker is worse than nothing — false confidence.

## Honest limit (state it, don't hide it)
"Edit once → both follow" is **automatic for registry → V4 only.** **V3 → registry stays a MANUAL mirror step** (V3 has no schema to consume). Full auto-both-ways = a later V3 refactor (Option A), out of scope here. What B guarantees: the registry is the agreed truth, V4 auto-follows, and drift is *caught and blocked*, not silently shipped.

---

## Build phases

### Phase 1 — Extend the registry FIELDS model (owner: ui-designer)
Add to the `FIELDS` model in `public/field-registry-v6.html` the metadata a form config needs (current model has only the descriptive core: name/label/control/dropdown/required):
- **Alias columns:** `v3key` (the REAL camelCase key V3's JSX uses, e.g. `scopeOfWork`) + `v4id` (the REAL kebab id in `fieldRegistry.ts`, e.g. `scope-of-work`).
- **Form-layout metadata:** sub-section/tab assignment, field ORDER, validation, conditional show/hide, placeholder/defaults.
- **⚑ Alias capture is the careful part (ui-designer, code-confirmed asymmetric risk):**
  - `v4id` is CLEAN — `fieldRegistry.ts` has `id===storeId` + explicit section; read it straight.
  - `v3key` is the REAL risk — V3 keys fields via scattered JSX `id`/`name` attrs through a shared `onInputChange`, with up to THREE candidate keys per field (JSX input id · form-STATE key · camelCase sync key in `VALCRE_SYNC_FIELDS`) that don't always coincide. Some v3keys WILL be ambiguous.
  - **Canonical `v3key` = the form-STATE key the form actually reads/writes** (NOT the display id) — that's what the drift-check must compare against.
  - **Run a 5-field alias-capture SPIKE first** to surface the ambiguity pattern before committing the full-capture estimate. Then full capture.
  - **QA reconciles EVERY captured v3key against the real code** — a wrong alias = a silent drift-check miss (same discipline as the bridge reconcile).
- Regenerate the derivatives.
- **Feasibility CONFIRMED (ui-designer, code-checked):** the model extension + generator changes are incremental (same pattern as this session's st/rt/bn add), not a rewrite.

### Phase 2 — Generator emit targets (owner: ui-designer)
Extend `scripts/generate-registry-derivatives.mjs` (today emits docs only) with two new emit targets, both off the one master:
- **V4 form config** keyed by `v4id` — the schema-driven V4 S1/S2 consumes this.
- **V3 drift-check** keyed by `v3key` — compares V3's actual fields/options against the master, emits divergences.

### Phase 3 — The drift-check as a HARD GATE (owner: qa-agent + co-arch wiring)
- Run the V3 drift-check in CI / the build path; **a mismatch BLOCKS the release** (non-zero exit / failed check), not a passive report.
- **STRICT scope:** compares field presence, placement, AND dropdown OPTION sets (Chris's real edits), per field, both directions (missing + extra; extra = flag for review, not auto-fail-to-delete).
- Reuses QA's reconcile pattern. **QA folds in their 4 tightening points here.**

### Phase 4 — Test-data fixture + sync toggle (owner: ui-designer)
- V4's "fill with test data" (existing Load Data button) fixture is **keyed to the canonical field set** (`n`+`v3key`/`v4id`) and **drift-checked against the master** (so it can't rot when Chris tunes S2).
- **Sync toggle** on V4's existing test-mode switch: OFF = fixture (bypass V3, fast iteration); ON = live V3→V4 sync (true end-to-end). **Both states feed the SAME canonical contract** — fixture and live describe fields identically (no "passes in fixture, breaks live").
- **Feasibility CONFIRMED (ui-designer, code-checked):** `reportBuilderStore` already has `activeTestMode` (`'none'|'test-report'|'designer'`) + `setTestMode` + `loadDataSet1User/All` + `testDataFieldMapping`; the live path reuses the existing `useLoadJobIntoReport` bridge. Build = extend an enum + a load path, not new infrastructure.

### Phase 0 (precursor) — Reverse-pass the field map (owner: ui-designer; co-arch reviews)
Before Phase 1 locks the field set: produce the **V4-only (bucket 4)** list (V4 S1/S2 fields not in V3) from `fieldRegistry.ts`, so nothing is removed by assumption — each gets surfaced for review. (ui-designer is already in `fieldRegistry.ts` + the V3 JSX for the alias capture, so it's efficient to pair the reverse-pass with the spike.)

---

## Acceptance
1. Registry `FIELDS` carries `v3key` + `v4id` + layout metadata for the full S1/S2 set; QA reconciles aliases against real code (zero wrong aliases).
2. Generator emits a V4 config + a V3 drift-check off the one master; V4 S1/S2 builds from the generated config.
3. **Drift-check BLOCKS:** introduce a deliberate V3↔master mismatch (incl. a changed dropdown OPTION) → the check FAILS the build. Fix it → passes. (Proves strict + hard-gate.)
4. V4-only fields surfaced for review; none auto-removed.
5. Test-data fixture keyed to the canonical set; toggle OFF = fixture, ON = live V3→V4, both speaking the same contract; fixture is drift-checked too.
6. V3's live forms are UNCHANGED (no rebuild); intake/LOE still work exactly as today.
7. `tsc --noEmit` + build clean; deployed.

## Out of scope
- **The V3 forms refactor** (reading the registry live = Option A) — later, only if full auto-both-ways is wanted.
- Removing any V4-extra field — gated behind explicit review.
- Fields beyond Sections 1–2; calculator; SaaS/domain track.

---

*co-architect, 2026-06-17. Ben approved Option B. → QA spec-gate flaw-review (+ QA folds their 4 points into Phase 3) → ui-designer confirms Phase 1/2/4 mechanics + alias-capture feasibility → Ben sign-off → build (multi-owner) → QA build-verify (the deliberate-mismatch-blocks test is the proof).*
