---
content_type: cascade-spec
title: Cascade Logic — Full Spec + Wiring Pass-Off (CANONICAL)
status: active — canonical cascade reference; verified against code 2026-06-10
owner: co-architect (authors) · react-specialist / fullstack (wires the unbuilt groups)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
interactive_source: "public/field-registry-v6.html → 'Logic Fields' tab → Rule Explorer (the live, clickable cascade — the source of truth Ben validates against)"
verified_against:
  - src/utils/loe/loeCascade.ts (STATUS_TO_SCENARIOS, INSURANCE_OVERRIDE_SCENARIO, deriveValueScenarios)
  - src/utils/loe/generateLOE.ts (L111, L166 — approaches token fill)
  - public/field-registry-v6.html (L951-953 — Property Rights rule maps; Rule Explorer guide)
companion: docs/Features/12-LOE-Esign/loe07-build/CASCADE-TO-LOE-CONTRACT-NOTES.md (contract-side view; partly superseded by this doc)
tags: [apr-workflow, cascade, conditional-field-logic, value-scenarios, approaches, property-rights, loe, wiring, built-vs-planned, source-of-truth]
---

# Cascade Logic — Full Spec + Wiring Pass-Off

**Tags:** #cascade #ground-truth #doctrine-decision #loose-end #value-scenarios #property-rights #loe
**Entities:** [[Cascade-Logic]] [[LOE]] [[Valta-Registry-V6]]

**Read this if you are wiring the cascade.** It states every rule exactly as the Rule Explorer
defines it, and marks each cascade **BUILT** (live in code) or **PLANNED** (designed, not wired).
The interactive source of truth is the **Rule Explorer** in the mock — [field-registry-v6.html](~/Development/APR-Dashboard-v3/public/field-registry-v6.html) →
"Logic Fields" tab. This doc is the static, code-verified mirror of it. The cascade engine lives in
[loeCascade.ts](~/Development/APR-Dashboard-v3/src/utils/loe/loeCascade.ts); the LOE token fill in
[generateLOE.ts](~/Development/APR-Dashboard-v3/src/utils/loe/generateLOE.ts).

---

## TL;DR (the simple version)

A **trigger pick** (a user choice) auto-sets one or more **outcome** fields. Outcomes are locked /
read-only — the user never types them; they derive. There are **two** cascade groups (a third slot
is intentionally empty — nothing comes after Group 2).

| Group | Triggers (user picks) | Outcomes (auto-derived) | Status in code |
|---|---|---|---|
| **1 — Property Rights** | Property Type · Property Subtype · Tenancy | Property Rights | ❌ **PLANNED** (logic only in the mock, not the app) |
| **2 — Value Scenarios & Approaches** | Status of Improvements · Authorized Use | Value Scenarios **+** Approaches to Value | ⚠️ **HALF BUILT** — Value Scenarios is LIVE; Approaches is NOT |
| 3 | — | — | Intentionally empty (no further cascade) |

**Why this matters:** Group 2's Value Scenarios is what decides which LOE scenario rows + Section 10
EA/HC narratives get written into the contract. That half is built and proven. The rest (Approaches
derivation, all of Property Rights) is specified here but still needs wiring.

---

## GROUP 1 — Property Rights  ·  ❌ PLANNED (not wired in the app)

**3 triggers → 1 result.** Override hierarchy: **Tenancy overrides Subtype, which overrides
Property Type.** "Unknown" and "Vacant" tenancy leave the outcome unchanged (fall back to the
Subtype/Type result).

### A — Property Type → Property Rights (base)
| Property Type | → Property Rights |
|---|---|
| Multifamily, Self-Storage, Land, Hotel, Seniors | Fee Simple |
| Retail, Industrial, Office | Leased Fee Interest |

### B — Property Subtype (override)
| Subtype | → Property Rights |
|---|---|
| Mixed Use | Fee Simple & Leased Fee |

### C — Tenancy (override — beats Subtype and Type)
| Tenancy | → Property Rights |
|---|---|
| Owner Occupied | Fee Simple |
| Multi-Tenant | Leased Fee Interest |
| Partial Owner Occupied | Leasehold Estate |
| Single-Tenant | Going Concern |
| Unknown, Vacant | (no change — keep Subtype/Type result) |

**Where the rule currently lives:** ONLY in the mock playground —
`public/field-registry-v6.html` L951-953 (`INT_PT`, `INT_SUB`, `INT_TN` maps). There is **no
equivalent in `src/`**. The dashboard's Property Rights field renders as a locked/derived "Pending"
control (mock L569) but nothing computes it — so on the live app it would stay "Pending" forever
until this is wired.

**Where the outcome lands:** the Section 1 "interest appraised" field → Valcre native
`Job.Purposes` (InterestAppraised).

---

## GROUP 2 — Value Scenarios & Approaches  ·  ⚠️ HALF BUILT

**2 triggers → 2 results, chained.** One pick (Status of Improvements) sets both outcomes together.
**Authorized Use = Insurance** is an override that replaces the Status-derived result.

### Value Scenarios  ·  ✅ BUILT + PROVEN
Verified line-for-line against `src/utils/loe/loeCascade.ts` `STATUS_TO_SCENARIOS` (L29-37) +
`INSURANCE_OVERRIDE_SCENARIO` (L40) + `deriveValueScenarios()` (L97). **Exact-string keyed.**

| Status of Improvements (trigger) | → Value Scenarios (outcome) |
|---|---|
| Improved - Completed | As Stabilized |
| Improved - Renovated | As Stabilized |
| Improved - Under Renovation | As-Is, As If Complete & Stabilized |
| Improved - Proposed Renovation | As-Is, As If Complete & Stabilized |
| Proposed - Vacant Land | As Is Vacant Land, As If Complete & Stabilized |
| Proposed - Improved Land (Demolition Required) | As If Vacant Land, As If Complete & Stabilized |
| Proposed - Under Construction | As If Vacant Land, As If Complete & Stabilized |
| **(override) Authorized Use = Insurance** | Insurable Replacement Cost |

### Approaches to Value  ·  ❌ NOT WIRED (spec below is the build target)
The Rule Explorer pairs each Status with an Approaches set, but **no code derives it.**
`generateLOE.ts` only reads `jobDetails.approachesToValue` and falls back to a hardcoded default
(L111: `|| 'Direct Comparison, Income, Cost'`). There is **no `STATUS_TO_APPROACHES` map.** Build it
from this table:

| Status of Improvements (trigger) | → Approaches to Value (outcome) |
|---|---|
| Improved - Completed | Direct Comparison, Income |
| Improved - Renovated | Direct Comparison, Income |
| Improved - Under Renovation | Direct Comparison, Income, Cost |
| Improved - Proposed Renovation | Direct Comparison, Income, Cost |
| Proposed - Vacant Land | Land Direct Comparison, Cost |
| Proposed - Improved Land (Demolition Required) | Land Direct Comparison, Cost |
| Proposed - Under Construction | Land Direct Comparison, Cost |
| **(override) Authorized Use = Insurance** | Cost Approach |

**Where the outcomes land in the LOE:** Value Scenarios → §5 (`[ValueScenarios]`) + §10 EA/HC table
left column; Approaches → §9 (`[ApproachestoValue]`). See companion CASCADE-TO-LOE-CONTRACT-NOTES.md
for the contract section/page map and the §10 narrative-library detail.

---

## GROUP 3 — intentionally empty

The "+ Create Logic Field" slot in the Rule Explorer is just room to add a future cascade. **Nothing
comes after Group 2** — this is by design, not an unfinished item. Do not build anything here.

---

## WIRING PASS-OFF — what to build, where

All cascade logic belongs in the **shared source** `src/utils/loe/loeCascade.ts` (same pattern as the
existing `deriveValueScenarios`), so the dashboard and the LOE generator both consume one source.

### Task 1 — Approaches to Value derivation (Group 2, second outcome)
- Add `STATUS_TO_APPROACHES: Record<string, string[]>` to `loeCascade.ts` from the table above.
- Add `INSURANCE_OVERRIDE_APPROACHES = 'Cost Approach'`.
- Add `export function deriveApproaches(statusOfImprovements?, authorizedUse?): string[]` mirroring
  `deriveValueScenarios` (insurance override wins, else status lookup).
- Wire the dashboard: when Status of Improvements is picked (LoeQuoteSection — same handler that sets
  Value Scenarios), also set `approachesToValue` from `deriveApproaches`. It's already rendered as a
  locked/"Pending" derived field — just feed it.
- `generateLOE.ts` then receives a real `approachesToValue` instead of the hardcoded fallback.

### Task 2 — Property Rights derivation (Group 1)
- Port the mock's `INT_PT` / `INT_SUB` / `INT_TN` maps (`field-registry-v6.html` L951-953) into
  `loeCascade.ts` as `derivePropertyRights(propertyType?, propertySubtype?, tenancy?)`.
- Apply the override order: start from Property Type, override with Subtype (Mixed Use), then override
  with Tenancy (except Unknown/Vacant = no change).
- Wire the dashboard: when any of Property Type / Subtype / Tenancy changes, recompute Property Rights.
  It's already a locked/"Pending" derived control — feed it.
- Target: Section 1 interest field → Valcre `Job.Purposes`.

### Safety rails (unchanged from the migration)
- Do **not** touch `VALCRE_SYNC_FIELDS` / `CLICKUP_CARD_FIELDS` / the sync if-chain / file-upload.
- These are derive-and-fill additions on top of existing fields — preserve every binding.
- `npx tsc --noEmit` + build clean. QA readback-verifies any field that newly writes to Valcre.

---

## Empty-state language (applies to all cascade fields)
- **"Choose"** (shaded) = a user-choice trigger, not yet picked (Status of Improvements, Property
  Type/Subtype/Tenancy, etc.).
- **"Pending"** (shaded) = a derived outcome, fills itself once its triggers are set (Value Scenarios,
  Approaches to Value, Property Rights).

---

## Refinement log
- **2026-06-10** — v1.0. Authored from the Rule Explorer guide + a full code verification. Established
  built-vs-planned status per group (Value Scenarios = live; Approaches + Property Rights = planned),
  corrected the companion doc's stale "Existing -" keys to the live "Improved -" keys, and wrote the
  two wiring tasks. Source of truth for the cascade going forward.

---

**Last reviewed:** 2026-06-10 by co-architect — authored + verified every rule against the live code
(loeCascade.ts, generateLOE.ts) and the mock Rule Explorer; linked from the
[APR Master Dashboard](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md).
