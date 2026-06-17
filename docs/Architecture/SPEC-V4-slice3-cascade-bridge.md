---
id: spec-v4-slice3-cascade-bridge
title: "SPEC — V4 Slice 3: Cascade bridge (push §10 valuation scenarios into the report builder)"
created: 2026-06-17
type: implementation-spec
status: for-spec-gate (QA flaw-review) → then Ben sign-off → then build
track: "Track 1 — co-architect authored (follows Slice 2 gate + the V3→V4 field-map fold)"
owner: co-architect (author) · qa-agent (spec-gate + build-verify) · ui-designer (template-placeholder side) · Ben (sign-off + GO)
source: V3-to-V4-field-map.json (the biggest missing-in-v4 gap) + Ben direction 2026-06-17
tags: [apr, v4, report-builder, cascade, value-scenarios, bridge, useLoadJobIntoReport, section-10, spec]
---

# SPEC — V4 Slice 3: Cascade bridge

> **One line:** Carry section 2's valuation cascade — Status of Improvements → Value Scenarios →
> Approaches to Value, plus Tenancy + Value Timeframe — from the job's LOE data into the report
> builder, so the report receives the **same scenarios** that drive the §10 contract. One source of
> truth; enter once in intake/LOE, see it in the report. No re-keying.

> **PREP — nothing builds until QA passes + Ben gives GO.**

---

## The goal (Ben, 2026-06-17)
The report builder shows the SAME value scenarios as V3 — auto-filled from the section-2 cascade,
not re-entered. "It makes sense it would be receiving the same scenarios as V3." This is the single
biggest `missing-in-v4` gap in the field map: the entire §10 valuation cascade currently never
reaches the report builder.

**Scope this slice = PUSH (read-only flow into the builder). Editing scenarios IN the builder is
PARKED** — Ben: "editing them there would be of value but not critical to determine now." Note it as
a future option; do not build it here.

---

## Ground truth (code-verified)
- **DB source exists** (`job_loe_details`, per `src/integrations/supabase/types.ts`): `status_of_improvements`, `value_scenarios`, `approaches_to_value`, `tenancy`, `value_timeframe` — all stored already.
- **The §10 narrative source** = `src/utils/loe/loeCascade.ts` (`STATUS_TO_SCENARIOS`, `deriveValueScenarios`, `NARRATIVES`, `resolveNarrative`) + the live editable text in the `scenario_narratives` Supabase table (the Value Scenario editor we shipped). This is what produces the §10 paragraphs.
- **The bridge** = `src/features/report-builder/hooks/useLoadJobIntoReport.ts` — a `fieldMappings: {fieldId, getValue(job, loe, property)}[]` array. The cascade fields are simply ABSENT from it today. Adding them = adding mappings (the established pattern; ~30 existing mappings prove it).
- **Report-side fields exist (partial)**: `fieldRegistry.ts` has `value-scenario`, `value-scenario1`/`-psf`/`-text`, `approaches-applied`, `impv-tenancy`. Template has `{{impv-tenancy}}`, `{{report-valuationcost/income/sales}}`.
- **The map rows** (`V3-to-V4-field-map.json`, just folded into the registry): `StatusofImprovements` (CF12407), `ValueScenarios` (CF12414), `ApproachestoValue` (CF12415), `Tenancy` (CF12408), `Valuetimeframe` (CF12419) — all `missing-in-v4`. Their **report TEMPLATE `{{placeholder}}` side is being filled by ui-designer** via the test-input `testDataFieldMapping` cross-check; this spec builds to those filled targets.

---

## Design — add cascade mappings to the bridge, targeting the registry's report fields

1. **Add bridge mappings** in `useLoadJobIntoReport.ts` for each cascade field, `getValue` reading from `loeData` (job_loe_details):
   - Status of Improvements → its report field id (per the folded registry `reportTarget`).
   - Value Scenarios → the report's `value-scenario` set.
   - Approaches to Value → `approaches-applied`.
   - Tenancy → `impv-tenancy`.
   - Value Timeframe → its report field id.
2. **Scenario fields receive the LABEL, not the prose (ui-designer verified against the template).** The placeholders `{{value-scenario}}`, `{{valuation-scenario}}`, `{{report-valuescenario1}}` carry the scenario LABEL ('As Stabilized', rendered as a bold uppercase heading) — NOT the §10 paragraph. So the bridge maps the derived scenario LABEL(s) (from `deriveValueScenarios` / the stored `value_scenarios`) into those fields. Do not push prose into them.
   - **⚑ OPEN DECISION (Ben) — the §10 PROSE has NO home in the report template.** There is no summary/premise/narrative placeholder anywhere in `Report-MF-template.html`. The §10 paragraph text (what the Value Scenario editor produces from `scenario_narratives`) therefore **cannot land in the report today**. If the appraisal report SHOULD carry that prose, it requires a NEW template placeholder (ui-designer, same class as scope-of-work) AND a bridge mapping sourced from `scenario_narratives` (one source of truth, edits propagate to §10 + report). **If the report only needs the labels/headings, no prose work is needed.** This is Ben's call and gates whether the prose half of this slice exists.
3. **Map authority = the folded registry `reportTarget` column** (registry↔code↔template three-way). Do NOT hard-code placeholders the registry doesn't carry; read the target per field. Where a cascade field's report field id is ambiguous, confirm against `fieldRegistry.ts` (cite the line), never guess.
4. **Reuse the lossy-mapping discipline from the field map:** do not collapse/transform cascade values (the PropertyType `typeMap` lossiness is a known anti-pattern — pass the real value through).

### QA spec-gate fixes (PASS-WITH-FIXES — fold in, do NOT re-spec)
QA re-gate verdict on the corrected spec: **PASS** with two fixes:
- **FIX-1 — legal-description + scope-of-work are ALREADY bridged.** The bridge already maps `legal-description` (`useLoadJobIntoReport.ts:189`) and `scope-of-work` (`:207`) into the store. They are **TEMPLATE-side only**, NOT bridge work: legal→existing `{{report-legal}}`, scope-of-work→new placeholder. Do not add bridge mappings for these two; the store already has the values — the break is purely the missing/mismatched template placeholder.
- **FIX-2 — bridge `getValue` is SYNCHRONOUS.** The cascade LABELS come straight off `loeData` (sync, fine). BUT the conditional §10-prose path (if Ben wants prose) sources from `scenario_narratives` (async store) — so it needs the **preload-once pattern**: await the store load ONCE in the async caller (the `useEffect`/loader in `useLoadJobIntoReport`), pass an in-memory resolver into the still-sync `getValue`. Mirror `generateLOEHTML`'s precedent. Do NOT make `getValue` async. (Only applies IF prose is in scope.)

---

## Template-placeholder gaps to close (the three-way breaks — coordinate with ui-designer)
ui-designer verified the template side. The items:
1. **legal-description → `{{report-legal}}`** — this placeholder ALREADY EXISTS (the legal-description slot in the property tables). Just map the bridge to it. Do NOT use `{{info-legal-source}}` — that's the source citation (e.g. Land Titles), a different field.
2. **scope-of-work → NEW placeholder** — no placeholder exists; ui-designer adds one in `Report-MF-template.html`, then the bridge maps to it.
3. **§10 prose → NEW placeholder, ONLY IF Ben wants prose in the report** (the open decision above). ui-designer adds it; bridge sources from `scenario_narratives`.

Net template-side: 1 existing map (legal→`{{report-legal}}`) + 1 new add (scope-of-work) + 1 conditional new add (§10-prose, pending Ben).

> **⚑ ui-designer owns the HTML/template side; co-arch/builder owns the bridge + code side.** The
> placeholder ADDS happen in `Report-MF-template.html` (ui-designer) and are verified via the
> test-input coverage tool. The bridge mapping (this spec) targets them once they exist. Sequence the
> placeholder decision with ui-designer BEFORE the bridge mapping for legal/scope lands, so we don't
> wire to a non-existent placeholder.

---

## Acceptance (verified on the DEPLOYED app, V4-lit build)
1. Load a job (with section-2 cascade data) into the report builder → Status of Improvements, Value Scenario LABELS, Approaches, Tenancy, Value Timeframe all populate with the SAME values stored on the job's LOE.
2. **(Only if Ben wants prose)** the §10 scenario prose renders in the report from `scenario_narratives` — edit a narrative in the Value Scenario editor → it changes in BOTH §10 and the report (one source of truth). **If labels-only: this criterion is dropped.**
3. legal-description renders via `{{report-legal}}`; scope-of-work renders via its new placeholder — the three-way breaks closed.
4. No regression: the ~30 existing bridge fields still populate; existing report rendering unchanged.
5. `tsc --noEmit` + `npm run build` clean; DEPLOYED Vercel build passes.
6. test-input template-coverage tool shows the previously-missing cascade placeholders now mapped (coverage stat improves; nothing newly empty/missing).

---

## Explicitly OUT of this slice
- **Editing value scenarios inside the report builder** — PARKED (Ben's call; future option). This slice is push-only.
- **Calculator completion** (Sales/Cost) — separate later track.
- **The other `missing-in-v4` fields** beyond the cascade + legal/scope (TransactionStatus, ZoningStatus, CurrentUse, etc.) — follow-on bridge slices; not this one. Name them so they're tracked, don't bundle.

---

*co-architect, 2026-06-17. Closes the biggest missing-in-v4 gap from the V3→V4 map. → QA spec-gate flaw-review → Ben signs off + GO → ui-designer adds template placeholders (legal/scope) → builder adds bridge mappings → deploy → QA build-verify (logged-in not needed; open access).*
