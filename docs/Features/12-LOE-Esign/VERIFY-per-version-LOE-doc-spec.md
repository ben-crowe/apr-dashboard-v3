---
id: verify-per-version-loe-doc-spec
title: "Per-version LOE document spec — what each cascade version's saved LOE must contain (verification reference)"
created: 2026-06-15
type: verification-reference
owner: co-architect (derived from cascade engine) · qa-agent (verifies docs) · Ben+Codex (generate drafts)
source_of_truth: src/utils/loe/loeCascade.ts (STATUS_TO_SCENARIOS, STATUS_TO_APPROACHES, NARRATIVES) + generateLOE.ts (§10 render + row suppression)
test_job: Westside Mall
tags: [loe, cascade-versions, verification, value-scenarios, approaches, section-10, prd]
---

# Per-version LOE doc spec (verification reference)

Derived from the cascade engine (`loeCascade.ts`) + the §10 render logic (`generateLOE.ts`) — NOT assumption. For each of the 4 cascade versions on the Westside Mall test job, this is what the SAVED LOE must contain. QA confirms the back end + the generated document against this.

> **QA's approaches assumption = CONFIRMED CORRECT on all 4.** Exact canonical strings + the narrative behavior added below.

## How it renders (mechanics, applies to all)
- **§10 "Value Scenarios" table:** LEFT = the derived scenarios (one row each); RIGHT = the matching EA/HC narrative. Row count = number of scenarios. Empty scenarios → row suppressed; **zero scenarios → whole §10 section drops + the doc reflows/renumbers pages** (not the case for any of these 4 — all have ≥1 scenario, so §10 is present in all four).
- **EA/HC narrative:** `resolveNarrative(scenario)` — if the scenario has no library text, the cell keeps the **LITERAL bracket** (e.g. `[EA/HCSummary1]`), by design ("degrades cleanly, never blank"). Matters for V4.
- **Approaches:** render as a comma-listed FIELD value (`[ApproachestoValue]`), not separate report sections. "Absent" = not in that list.

---

## V1 — "Completed" (`Improved - Completed`)
- **Value Scenarios (§10 rows):** **As Stabilized** — 1 row.
- **Approaches:** **Direct Comparison, Income.** ABSENT: Cost, Land. ✓ matches assumption.
- **§10 narrative:** "As Stabilized" carries **full summary + EA + HC** (real prose, the long lease-up/stabilized-occupancy text).
- **Distinguisher:** single scenario; **no Cost** approach.

## V2 — "Under Renovation" (`Improved - Under Renovation`)
- **Value Scenarios (§10 rows):** **As-Is** + **As If Complete & Stabilized** — 2 rows.
- **Approaches:** **Direct Comparison, Income, Cost** (all 3 building approaches). ABSENT: Land. ✓ (the "+Cost" vs V1).
- **§10 narrative:** "As-Is" = **summary ONLY** (no EA/HC detail — those are null); "As If Complete & Stabilized" = **summary + EA + HC**.
- **Distinguisher:** 2 scenarios; gains the Cost approach vs V1.

## V3 — "Improved Land" (`Proposed - Improved Land (Demolition Required)`)
- **Value Scenarios (§10 rows):** **As If Vacant Land** + **As If Complete & Stabilized** — 2 rows.
- **Approaches:** **Land Direct Comparison, Cost.** ABSENT: **Income**, building **Direct Comparison**. ✓ matches assumption.
- **§10 narrative:** both "As If Vacant Land" and "As If Complete & Stabilized" carry **summary + EA + HC**.
- **Distinguisher:** **"As If Vacant Land" is unique to V3**; **Land** Direct Comparison (not building DC) + **no Income**.

## V4 — "Insurance" (Authorized Use = Insurance → OVERRIDE, ignores Status)
- **Value Scenarios (§10 rows):** **Insurable Replacement Cost** — 1 row.
- **Approaches:** **Cost Approach** ONLY. ABSENT: Income, Direct Comparison/Sales, Land. ✓ "Cost-only."
- **§10 narrative — ⚑ KEY FLAG:** "Insurable Replacement Cost" has **NO library text** → `resolveNarrative` returns null → the EA/HC cell shows the **LITERAL bracket `[EA/HCSummary1]`**, not prose. **This is EXPECTED, not a bug** — Chris's copy is pending for this scenario. A real prose narrative here would actually be wrong (would mean a stray mapping).
- **Distinguisher:** single override scenario "Insurable Replacement Cost" (independent of Status of Improvements); Cost-only; literal-bracket narrative.

---

## Quick verification matrix

| Ver | §10 scenarios (rows) | Approaches (present) | Approaches ABSENT | §10 narrative |
|---|---|---|---|---|
| V1 Completed | As Stabilized (1) | Direct Comparison, Income | Cost, Land | full EA+HC prose |
| V2 Under Renovation | As-Is, As If Complete & Stabilized (2) | Direct Comparison, Income, Cost | Land | As-Is summary-only; AICS EA+HC |
| V3 Improved Land | As If Vacant Land, As If Complete & Stabilized (2) | Land Direct Comparison, Cost | Income, (building) Direct Comparison | both EA+HC prose |
| V4 Insurance | Insurable Replacement Cost (1) | Cost Approach | Income, Direct Comparison, Land | LITERAL bracket (no prose — expected) |

**Page count:** not a reliable distinguisher — §10 is present in all 4 (none drop). The visible structural diff is §10 **row count** (1 for V1/V4, 2 for V2/V3) + the approaches list + the EA/HC prose-vs-bracket behavior.

---

*Derived 2026-06-15 by co-architect from loeCascade.ts + generateLOE.ts (ground truth). QA verifies the saved doc + back end against this per version.*
