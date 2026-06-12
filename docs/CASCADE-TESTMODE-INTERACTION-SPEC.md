---
title: Cascade Test-Mode Interaction Spec (mock-first)
status: active
created: 2026-06-12
updated: 2026-06-12
description: "How the cascade test/demo interaction must behave — two decoupled controls, two-colour provenance, exact 'from' labels with reference numbers. Build on the mock first."
tags: [apr-workflow, cascade, test-mode, mock-first, interaction-spec, doctrine-decision]
---

# Cascade Test-Mode Interaction Spec (mock-first)

**Tags:** #apr-workflow #cascade #test-mode #mock-first #interaction-spec
**Entities:** [[APR-Dashboard]]

**↑ Home:** [APR Master Dashboard](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md) · **Build on:** `public/field-registry-v6.html` (mock) per the [Mock-First Standard](~/Development/APR-Dashboard-v3/docs/MOCK-FIRST-WORKFLOW-STANDARD.md)

The cascade demo conflates two different things, which is the "mind-fuck." This spec separates them so every change has one obvious cause. **Build + dial this on the mock first, then wire the real app to match.**

---

## The core problem it fixes

Picking a scenario currently pushes source data AND derives results at the same time — so you can't tell which input caused which output. And the "from" labels are too vague to trace ("from Status" actually reads like it pulls from *Job Status*, the wrong field). Both get fixed below.

## Two decoupled controls

**1. "Insert from data" checkbox** — toggles the **source / mapped "from" fields** (Property Type, Subtype, Tenancy) on/off.
- ON → they populate, highlighted **yellow**, and **stay editable** (change one, watch Property Rights move).
- OFF → they empty again.
- Purpose: see empty→full→empty, prove where data lives, and catch a wrong mapping on sight.

**2. Scenario picker** — picks the **scenario ONLY**.
- Sets Status of Improvements → derives Value Scenarios + Approaches.
- Does **NOT** push source data. One action, one effect.
- The chosen scenario stays visible up top as your shown choice.

## Two-colour provenance

| Colour | Means | Fields |
|---|---|---|
| **Yellow** | Mapped-in source data (the "from" inputs) | Property Type, Property Subtype, Tenancy |
| **Scenario shade** (matches the picker's colour) | Derived from the scenario pick | Value Scenarios, Approaches to Value |

The shade on a derived field matches the picker, so the eye traces "this got its colour from that pick."

## "From" labels — exact name + reference number

Every "from" label names the **exact source field** plus the mock's existing layout number. NEVER a section ("from Section 1") and NEVER a clipped name ("from Status" — ambiguous with Job Status 2.2).

- ✓ `Approaches to Value (2.9) — from Status of Improvements (2.4)`
- ✓ `Property Rights (2.8) — from Property Subtype (2.6) · Tenancy (2.7)`
- ✗ `from Status` · ✗ `from Section 1` · ✗ `from Property Type` (no number, no exact name)

The number is the cross-reference (jump straight to it); the full name kills the Job-Status confusion. The mock already carries these numbers (2.1, 2.2, 2.4…) as layout handles — reuse them.

## Provenance map (what comes from what)

| Derived field | Pulls from | Driven by |
|---|---|---|
| Property Rights | Property Type + Subtype + Tenancy (sources) | the **from-data checkbox** |
| Value Scenarios | Status of Improvements (scenario) | the **scenario picker** |
| Approaches to Value | Status of Improvements (scenario) | the **scenario picker** |

This is why two controls is *truthful*, not just tidy: Property Rights genuinely comes from the sources; the scenarios genuinely come from the pick.

## Fill behaviour (refined — Ben 2026-06-12)

- **Fill Test Data fills the rest of the form ONLY. It leaves the WHOLE cascade cluster CLEAR** (Status of Improvements, Subtype, Tenancy, Property Rights, Value Scenarios, Approaches all stay empty). Fill never touches the cascade.
- The cascade comes alive ONLY via the two toggles:
  - **"Insert from data" checkbox** → fills the cascade **source** fields (Subtype, Tenancy) in **yellow**, editable → Property Rights derives.
  - **Scenario picker** → fills the scenario-derived (Value Scenarios, Approaches).
- Why: this is what makes the toggles meaningful — you always know the toggle did it, not Fill. (Earlier draft had Fill pre-filling the sources; that's superseded by this.)
- The "see where it comes from" still works: check the from-data box and the source appears in yellow with the arrow; uncheck and it's gone.

## Trigger fields start inert (Ben, 2026-06-12)

Fill never auto-loads the one value that *activates* a behavior. The trigger fields start inert so the cause-and-effect is visible only when you fire it.

- **Authorized Use** is filled with a neutral intake value (e.g. "First Mortgage Financing"), **never "Insurance"** — because Insurance is the value that fires the override. If Fill pre-loaded Insurance, the override would already be running (Value Scenarios would jump to Insurable Replacement Cost) before you touched anything, and you'd never see the activation.
- Same principle as the scenario chain starting empty: the activation is always a **conscious pick** (V4), never a pre-baked state. Pick V4 → you watch it flip on (orange, the scenario shifts).
- Rule: no trigger field is ever pre-set to the value that would auto-fire its effect.

## Open questions for the registry (flag, don't guess)

- **Do land/demolition or insurance scenarios drop the source dependence?** Right now Property Rights always uses Subtype/Tenancy regardless of scenario — but for a land/demolition or insurance valuation, building tenancy arguably shouldn't drive it. Registry decides.
- **Do we need more scenarios?** Goal is to cover every scenario that can happen, so the two-colour flow shows every path.

---

**Last reviewed:** 2026-06-12 by co-architect — captured from the cascade-demo dialogue; separates data-mapping (checkbox) from scenario-pick (dropdown), adds two-colour provenance + exact numbered "from" labels. Build on the mock first.
