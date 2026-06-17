---
id: proposal-shared-section1-2-field-source
title: "PROPOSAL — One shared field source for Sections 1–2 (V3 + V4 consume the same definitions)"
created: 2026-06-17
type: architecture-proposal
status: for-review (QA) → Ben decides the "how"
owner: co-architect (author/design) · ui-designer (registry owner, mechanics) · qa-agent (review) · Ben (decision)
source: Ben + ui-designer thread 2026-06-17 (dev-3)
tags: [apr, v3, v4, registry, single-source-of-truth, sections-1-2, drift, intake, loe, report-builder]
---

# PROPOSAL — One shared field source for Sections 1–2

> **One line:** Stop maintaining two parallel field lists (V3 intake/LOE sections 1–2 and V4 report
> builder's matching fields) and reconciling them by hand. Define the Section 1–2 fields ONCE; both
> V3 and V4 consume that one source — so a client change is made once and both inherit it, drift-proof.

> **PROPOSAL only — nothing builds until Ben picks the "how" + QA reviews.**

---

## The goal (Ben, 2026-06-17)
Chris is about to tune Section 2 over the next week. Every field change he makes must hit BOTH the V3
intake/LOE dashboard AND the V4 report builder — automatically, not by editing two lists from memory
(which is exactly how they quietly drift apart, and why the V3→V4 field map kept finding gaps).

---

## The reconciliation method (V3-driven, NON-destructive to V4)
V3 Sections 1–2 are the **reference** (they're the polished, current, client-tuned set). Lay V3's
Section 1–2 fields beside V4's. Four outcomes per field — **and the V4-extra rule is a hard guardrail:**

1. **Match** — V3 field already in V4 1–2 → confirm 1:1 (most fall here; the field map showed the data already largely flows).
2. **Missing in V4** — V3 has it, V4 doesn't → move/organize it into V4 to match V3.
3. **Stale/mismatched** — exists in V4 but named/placed/shaped differently → align to V3.
4. **⚑ V4-EXTRA — exists in V4 1–2, NOT in V3 → REVIEW, never auto-remove.** These may serve a real
   purpose (report-side need, a calc input, something Chris hasn't surfaced). The rule: **surface every
   V4-only field for review; move it if it belongs elsewhere; remove ONLY after a deliberate "this has
   no purpose" decision — never by assumption.** (Don't kill what you don't understand.)

The existing `V3-to-V4-field-map.json` already gives buckets 1–3; this adds the **reverse pass** (V4-only
fields) for bucket 4.

---

## The decision Ben must make — HOW "shared"?

**Option A — One LIVE shared definition both forms read at runtime.**
- Both V3's sections 1–2 and V4's matching fields render FROM the registry live. A change shows in both instantly, zero regeneration.
- Strongest drift-proofing (literally one source).
- **Cost/risk:** V3's sections 1–2 are hand-built React with rich custom UX (cascades, sync indicators, conditional fields). Making them render dynamically from a registry is a significant rebuild and risks disturbing the section 1–2 experience you just refined.

**Option B — One MASTER definition both forms are BUILT FROM (recommended).**
- The registry is the canonical master. Both V3 and V4 field configs are generated/checked against it; a drift-check flags any divergence. Change the master → both regenerate.
- Nearly the same outcome (change once, both follow) with **far less rebuild and no risk to the current live forms**.
- **Cost/risk:** a regeneration/sync step rather than pure-live; the drift-check is what guarantees they stay matched.

**Recommendation: Option B**, as the first step — same drift-proof result Ben wants, without reworking the polished intake forms. Option A can be a later evolution if live-render proves worth it.

### ⚑ Registry-owner mechanics finding (verified — changes what "automatic" means)
ui-designer (registry owner) verified the actual build:
- **V3 Sections 1–2 are hand-built JSX with NO central field schema** — split across sub-components (S1: ClientInformation + PropertyInformation + PropertyContact; S2: Valuation + Payment + PropertyRights + Comments + JobNumber). Field names are camelCase app keys (`scopeOfWork`, `appraisalFee`). There is no field-definition/config file anywhere.
- **V4 IS schema-driven** — `fieldRegistry.ts` has ~83 entries across client-intake + loe-prep (S1/S2).

**The honest limit this creates — "edit once → both follow" is NOT fully automatic today:**
- **registry → V4 = automatic** (V4 reads the schema).
- **V3 → registry = a MANUAL mirror step.** Because V3 has no schema, when Chris changes a V3 field someone must reflect it into the registry by hand. It becomes fully automatic both-ways ONLY if V3's forms are later refactored to read the registry (that refactor IS Option A).
- So **Option B delivers: registry is the canonical written record of the S1/S2 field set; V4 auto-derives; V3 stays a deliberate manual mirror.** It kills *silent* drift (the registry is the agreed truth + a drift-check catches divergence) but does not yet remove the manual V3 update. True change-once-both-follow = Option A = the V3 refactor (bigger, later).

### ⚑ Option B refined — ASYMMETRIC (registry-owner scoped). This is the buildable shape.
Don't frame B as "emit a V3 config AND a V4 config" — the two sides differ:
- **V4 (schema-driven) → GENERATE its config.** V4 consumes a generated field config off the master → the V4 S1/S2 fields are produced from the registry.
- **V3 (hardcoded JSX) → DRIFT-CHECK, not a config.** V3 can't consume a config without the rebuild we're avoiding, so instead emit a conformance check that verifies V3 matches the master and flags divergence. V3 stays untouched + non-destructive. (This IS the "generate/check against it" phrasing.)
- **Cost (incremental, not a rewrite):** extend the registry `FIELDS` model with the form-layout metadata a real config needs — sub-section/tab, field ORDER, the name crosswalk, validation, conditional show/hide, placeholders/defaults (the current model has only the descriptive core: name/label/control/dropdown/required) — then add 2 new generator emit targets (V4 config + V3 drift-check). The bigger lift is the model extension, not the emitter. **ui-designer owns the generator + model extension and will scope a sub-spec once Ben picks B; the drift-check reuses QA's reconcile pattern.**

### ⚑ Naming crosswalk — a decision the proposal must settle
The same field has THREE names: V3 camelCase (`scopeOfWork`) · registry PascalCase (`ScopeOfWork`) · V4 kebab id (`scope-of-work`). The shared source must **pick ONE canonical key + define the mapping to the other two**, or the "one source" just moves the drift into the naming layer.

**DECIDED (ui-designer, registry owner): canonical = the registry `n` (PascalCase)** — already the join key across the field map + fold + derivatives, so anything else is churn; and the registry is the master. Two safety rules:
- **`n` is an OPAQUE id — the crosswalk is EXPLICIT per field, never algorithmically derived.** (PascalCase is already inconsistent — `StatusofImprovements` has a lowercase "of" — so auto-casing `n`→camelCase would produce a wrong key. No casing algorithm; explicit aliases only.)
- **Add two alias columns to the registry `FIELDS` model:** `v3key` (the real camelCase key V3's JSX uses, e.g. `scopeOfWork`) + `v4id` (the real kebab id in `fieldRegistry.ts`, e.g. `scope-of-work`). Each row then carries `n` + explicit `v3key` + `v4id` = the whole crosswalk, zero ambiguity. Generator emits the V4 config keyed by `v4id` and the V3 drift-check keyed by `v3key`, both resolved from `n`.
- **Work/risk:** populating `v3key`+`v4id` is real capture work — read the actual V3 JSX sub-sections + `fieldRegistry.ts` to record the REAL ids (not guessed); QA reconciles the aliases against the code (a wrong alias = a silent drift-check miss). ui-designer owns the model extension + alias capture; this lands in the **Option-B sub-spec** (separate doc, on Ben's pick — keeps it off this proposal to avoid edit collision during review).

---

## Proposed sequence (after Ben picks A or B)
1. **Reverse-pass the field map** — produce the V4-only (bucket 4) list so nothing gets removed by assumption. (co-arch + the existing map.)
2. **Define the canonical Section 1–2 field set** in the registry (ui-designer owns the registry; co-arch the schema).
3. **Wire/generate** both V3 + V4 1–2 from it per the chosen option, with a drift-check (QA's reconcile pattern).
4. **Hold for Chris's week of Section 2 tuning** — this is the payoff: his changes land once, both inherit.

---

## Out of scope
- The valuation cascade bridge (shipped) and the calculator track — separate.
- Removing any V4-extra field — gated behind explicit review (bucket 4 rule), never in the wiring step.
- The separate-domain / SaaS track — unrelated.

---

*co-architect, 2026-06-17. From the Ben + ui-designer thread. → I verify V3 form structure → QA reviews → Ben picks A or B → sequence above. The V4-extra non-destructive rule is a hard guardrail, not a preference.*
