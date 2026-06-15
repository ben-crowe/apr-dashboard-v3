---
id: chris-question-property-subtype-options
title: "Question for Chris — Property Subtype option set vs Valcre's native SecondaryType"
date: 2026-06-15
type: client-question
author: qa-agent
status: open
relates_to: REGISTRY-VS-CODE-DIVERGENCES.md (PV-1)
tags: [registry, property-subtype, valcre, secondarytype, chris-question, divergence]
---

# Question for Chris — Property Subtype options

**One issue, one decision needed.** Everything else on the cascade→Valcre sync is wired and
registry-confirmed; this is the single item that needs Chris.

## The situation (live-verified)

The dashboard's **Property Subtype** field writes to Valcre's **native `Property.SecondaryType`**
field (confirmed: there is no Job custom field for subtype — SecondaryType is the correct target,
and the wiring is in place on both create and edit).

The problem is the **option values**, not the plumbing. Two live findings from a 100-property
Valcre sample:

1. **None of the registry's 4 subtype options appear in live Valcre.**
   - Registry (`ListPropertySubtype`): **Apartment · Townhouse · Mixed Use · Shopping Centre**
   - Live `SecondaryType` values actually in use: **Apartments · Low-rise · Multifamily · Warehouse**
   - `Apartment` (registry) vs `Apartments` (Valcre) is a **singular/plural near-miss**. If
     `SecondaryType` is a validated enum, a non-matching string saves as **nothing** (HTTP 200,
     no change) — a silent no-write. The user sees no error; Valcre stays blank.

2. **No industrial subtype option exists in the registry.** The test property is **Industrial**,
   and Valcre clearly supports industrial subtypes (e.g. `Warehouse` is in live use) — but the
   registry's 4 options contain nothing for industrial. So an industrial property has **no valid
   subtype to pick**.

## What we need from Chris

1. **Is `SecondaryType` a constrained enum or free text?** If free text, any string lands and
   there's no problem — we just use the registry labels as-is. If it's a constrained enum, we
   need #2.
2. **The canonical subtype option set** Chris wants the dashboard to offer, using **the exact
   strings Valcre accepts** — including **industrial** subtypes (and any others the 4-option list
   is missing). This becomes the dashboard dropdown + the registry source of truth.

## Why it matters now

Until this is settled, editing Property Subtype on a job **looks like it saves but doesn't reach
Valcre** for any value that isn't an exact match — exactly the kind of silent failure we can't
have in front of a client. The fix is Chris's option set, not more code.

*qa-agent · drafted 2026-06-15. Plumbing confirmed (SecondaryType, both paths); this is purely
the option-set reconciliation. Full evidence: REGISTRY-VS-CODE-DIVERGENCES.md PV-1.*
