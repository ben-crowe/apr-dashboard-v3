---
content_type: cascade-spec
title: Cascade Field Options → LOE Contract — Special Instructions (SOURCE OF TRUTH)
status: active — source of truth for this category; deeper reconcile in progress (2026-06-05)
owner: co-architect (consolidates) · ui-designer + react-spec (build)
home: 00-APR-MASTER-DASHBOARD.md
registry_v6: "https://apr-dashboard-v3.vercel.app/field-registry-v6.html (the Valta Registry V6 Rule Explorer — the live cascade rules). Local: public/field-registry-v6.html · prototype: builds/prototypes/valta-field-registry-explorer-v6.html"
tags: [apr-workflow, cascade, cascade-to-loe, conditional-field-logic, value-scenarios, section-10, ea-hc, loe-07, registry-v6, source-of-truth]
keywords: [cascade field options to LOE, conditional field logic, predefined fields on option combo, value scenarios approaches, status of improvements trigger, EA HC section 10, valta registry v6 rule explorer]
related: [../../../valta share/CONDITIONAL-FIELD-LOGIC.md, SPECIAL-NOTES-future-deep-dives.md, LOE-07-RENDER-TWEAKS-2026-06-04.md, ../../08-Master-Field-Registry/Valcre-Integration/AUTO-SYNC-WIRING-MAP.md]
---

# Cascade → LOE Contract — Special Instructions (EA/HC table + value scenarios)

**Status:** SOURCE OF TRUTH for "Cascade field options → LOE." Deeper reconcile in progress.
**Author:** ui-designer (dev-4), from the field-registry cross-check session · co-architect consolidating.
**Companion:** co-architect's `SPECIAL-NOTES-future-deep-dives.md` (same folder) — this doc is the focused cascade→contract picture.

> ## ⭐ The Valta Registry (V6) — go here for the live cascade rules
> **Live:** https://apr-dashboard-v3.vercel.app/field-registry-v6.html (the Rule Explorer)
> Local copy: `public/field-registry-v6.html` · prototype: `builds/prototypes/valta-field-registry-explorer-v6.html`
> Full cascade rule reference (plain): [CONDITIONAL-FIELD-LOGIC.md](~/Development/APR-Dashboard-v3/docs/valta%20share/CONDITIONAL-FIELD-LOGIC.md)

> ## 🔧 Reconcile note (Ben, 2026-06-05) — simpler than "a playbook"
> Ben's clarification: this is NOT a complicated separate "playbook." It's **predefined fields
> that auto-fill when certain option combinations are chosen** — i.e. plain **conditional field
> logic** (see CONDITIONAL-FIELD-LOGIC.md). A trigger pick (Status of Improvements, Authorized
> Use, Property Type/Tenancy) sets downstream fields automatically; for §10 the matching
> assumption text is a predefined fill keyed to the resulting value scenario. **This doc may
> still describe it as a "narrative library/playbook" below — treat that framing as
> over-complicated and being corrected. The authoritative rule set is CONDITIONAL-FIELD-LOGIC.md
> + the Registry V6 Rule Explorer.** Deeper reconcile underway (within the hour).

**Sources of truth:** cascade rules = Registry V6 Rule Explorer (link above) + `CONDITIONAL-FIELD-LOGIC.md` · contract = `loe07-build/LOE-template-v07.html` · build status = `LOE-07-RENDER-TWEAKS-2026-06-04.md`.

---

## What this is

How the dashboard's **cascade logic** (conditional field logic) drives parts of the **LOE-07
contract** — the value-scenario / approaches fields and the Section 10 EA/HC table. The headline:
some contract sections aren't typed per job — a client's upstream pick (e.g. Status of
Improvements) **auto-fills** which scenarios appear, and §10's assumption text is a **predefined
fill keyed to the resulting value scenario** (per the Registry V6 rules), not a hand-typed field.

---

## The cascade in plain terms (from the registry Rule Explorer)

The registry defines a chained rule: **one upstream pick sets two downstream outcomes at once.**

> **Status of Improvements** (what the client picks) → **Value Scenarios** + **Approaches to Value** (auto-derived together).
> **Authorized Use = Insurance** is an override → forces *Insurable Replacement Cost* / *Cost Approach*.

The full lookup (pick on the left → you get both outcomes):

- **Existing – Completed** → scenarios: *As Stabilized* · approaches: *Direct Comparison, Income*
- **Existing – Renovated** → *As Stabilized* · *Direct Comparison, Income*
- **Existing – Under Renovation** → *As-Is, As If Complete & Stabilized* · *Direct Comparison, Income, Cost*
- **Existing – To Be Renovated** → *As-Is, As If Complete & Stabilized* · *Direct Comparison, Income, Cost*
- **Proposed – Vacant Land** → *As Is Vacant Land, As If Complete & Stabilized* · *Land Direct Comparison, Cost*
- **Proposed – Improved Land (Demolition Required)** → *As If Vacant Land, As If Complete & Stabilized* · *Land Direct Comparison, Cost*
- **Proposed – Under Construction** → *As If Vacant Land, As If Complete & Stabilized* · *Land Direct Comparison, Cost*
- **(override) Authorized Use = Insurance** → *Insurable Replacement Cost* · *Cost Approach*

(There's a sibling cascade — **Property Rights** — driven by Property Type / Subtype / Tenancy, but it feeds the §1 interest field, not the EA/HC table.)

---

## Where this lands in the contract

| Cascade output | Contract section | Page (of 9) |
|---|---|---|
| Value Scenarios | §5 Value Scenarios (`[ValueScenarios]`) | Page 2 |
| Approaches to Value | §9 Approaches to Value (`[ApproachestoValue]`) | Page 3 |
| Value Scenarios + EA/HC summaries | §10 Extraordinary Assumptions & Hypothetical Conditions (the table) | Page 3 |

---

## Section 10 — the special one (the EA/HC table)

Section 10 is a **6-row table**, not a single field. Each row pairs a scenario with its narrative:

`[ValueScenario1]` | `[EA/HCSummary1]`  …through… `[ValueScenario6]` | `[EA/HCSummary6]`

**The split that makes it special — two halves, two data sources:**

- **LEFT — `[ValueScenarioN]`** = structured data. Comes straight from the **cascade** above (and ties to Valcre via the Value Scenarios → Premise custom fields). The number of rows that render = how many scenarios the cascade produced (1–6); empty rows should suppress.
- **RIGHT — `[EA/HCSummaryN]`** = a **narrative paragraph pulled from a text library** (the extraordinary-assumption / hypothetical-condition prose for that scenario). This is **NOT a field** and **NOT from the cascade** — it's a pre-written block keyed by scenario. This is the "unique custom area / table / playbook" pull.

### Plain-language rule (the thing to remember)

> On **page 3, Section 10**: if a client's *Status of Improvements* triggers, say, **As-Is + As If Complete & Stabilized**, the table auto-lists those two scenarios on the left, and each one **pulls its matching extraordinary-assumption paragraph from the narrative library** on the right. The left side is structured/Valcre-tied; the right side is a library lookup, not a typed field.

---

## Do we have the data? (the honest status)

- **Scenario names + approaches (left column, §5, §9):** ✅ **Yes** — fully defined by the registry cascade. Once the team wires the cascade, these populate cleanly.
- **EA/HC summary narratives (right column of §10):** ⏳ **Not yet wired.** The template currently ships only an **example block** (As Is / As If Vacant Land) showing the intended prose style. The actual narrative library isn't connected.

So your hunch is right: it's both, split by column — the **left** is the Valcre/cascade tie; the **right** pulls from the appraisal-side **playbook / text library** (could live as an Excel/text source or a backend table — TBD).

---

## §10 PROVENANCE — RESOLVED (SS12 trace of field-registry-v6.html, 2026-06-04)

Both columns trace to the registry. Verdict: left maps cleanly; right has a known registry home but is **not yet wired** → §10 stays literal brackets for now (confirms Ben's "map nothing").

**LEFT — `[ValueScenario1–6]`:**
- Registry source: **`ListValueScenarios`** (field-registry-v6.html line 942) — option set: As Is Vacant Land · As If Vacant Land · As If Complete & Stabilized · As-Is · As Stabilized · …Insurable Replacement Cost.
- **Cascade-derived** (registry Group 2 Rule Explorer): trigger = **Status of Improvements** (override = Authorized Use "Insurance") → outputs Value Scenarios (and Approaches). Valcre back-end target = Custom **11563** (Premise-1) / **11564** (Premise-2).
- Traces cleanly. *Derived field.*

**RIGHT — `[EA/HCSummary1–6]`:**
- Registry source: the **Narratives / Text Library** subsystem.
  - Field entries **EA1–EA5** ("Extraordinary Assumption 1–5", lines 1177–1181): category `Multi-line`, source `s:"Logic"`, **data source `d:"" ` (EMPTY — unbound)**, desc "Auto-populated from cascade/text library".
  - Library data = the **`NARRATIVES` array** (line 1869): entries e.g. `EA-001` "As If Vacant — Demolition", `trigger: 'Value Scenarios = "As If Vacant Land"'`, `usedIn: 'Report | LOE'`, + the prose.
- Mechanism (registry "About Narratives", lines 766–773): a **cascade-TRIGGERED text-library lookup** — "when Value Scenarios is set to an outcome, the system looks up matching narratives and inserts them." The scenario value triggers the EA/HC paragraph.
- **Status = NOT WIRED:** EA1–5 have `d:""`; only 2 library entries exist (both "As If Vacant Land"); the registry says *"Chris is building out the Text Library."* So the trigger→narrative map is incomplete → **unmapped in practice.**

**"Example" block (As Is / As If Vacant Land wording):** NOT from the registry — static illustrative sample hardcoded in the LOE template (a format legend).

**Reconciliation:** Ben's recollection is exactly right — §10's right column pulls a whole section from a separate playbook = the registry's **Narratives / Text Library**, cascade-triggered by Value Scenarios. Per "if any piece is unmapped it stays literal brackets," and since the narrative side is unbound (Chris still building it), **§10 stays literal brackets** — de-table only, map nothing. Wiring it later = bind EA1–6 `d:` to the Narratives lookup keyed by the Value Scenario value.

---

## Refinement log

- **2026-06-04** — v0.1. Captured the cascade rule set (registry Rule Explorer), mapped it to contract §5 / §9 / §10 + pages, documented the §10 left/right split and the parked EA/HC narrative-library gap.
