---
title: Cascade Versions — Quick Map
status: active
created: 2026-06-12
updated: 2026-06-12
description: "Each cascade version written word-for-word as it reads in the dropdown, then plain sentences for where every part goes. Dash = this version doesn't touch that field."
tags: [apr-workflow, cascade, test-mode, reference, ground-truth]
---

# Cascade Versions — Quick Map

**Tags:** #apr-workflow #cascade #test-mode #reference
**Entities:** [[APR-Dashboard]] · **Full logic:** [Cascade Logic Spec](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/CASCADE-LOGIC-SPEC-AND-WIRING.md)

Each version, word-for-word as it reads in the dropdown:

---

V1 — Completed = As Stabilized & Direct Comparison + Income

V2 — Under Renovation = As-Is + As If Complete & Stabilized & Direct Comparison + Income + Cost

V3 — Improved Land / Demolition = As If Vacant Land + As If Complete & Stabilized & Land Direct Comparison + Cost

V4 — Insurance = Insurable Replacement Cost & Cost Approach

---

## The fields when empty

Field name, and what shows in it when empty — with the number on the outside.

```
2.1   Job Number             │  Waiting for a Valcre job number
2.2   Job Status             │  Pending Valcre job status
2.3   Purpose                │  User can type anything here — free text that maps to the LOE Purpose paragraph
2.4   Status of Improvements │  Select…
2.5   Value Scenarios        │  from Status of Impr. (2.4)
2.6   Property Subtype       │  from Subtype (1.10)
2.7   Tenancy                │  from Tenancy (1.11)
2.8   Property Rights        │  from Tenancy (1.11)
2.9   Approaches to Value    │  from Status of Impr. (2.4)
2.10  Value Timeframe        │  Select…
2.11  Scope of Work          │  Select…
```

---

## The colors

The word before the "=" is colored to the field it lands in. Green is Status of Improvements (2.4). Orange is Authorized Use (1.13). Rose is Value Scenarios (2.5). Blue is Approaches (2.9). So V1–V3's first word is green (it goes to Status); V4's "Insurance" is orange (it goes to Authorized Use). Yellow stays for the property sources (Subtype, Tenancy, Property Rights) that come from the Insert-from-data toggle, not from the version.

## The dash rule

If a version doesn't set a field, that field shows "—", not "Select…". A dash says "nothing happens here for this choice — on purpose." Value Timeframe (2.10) is a dash on every version, because no version drives it — it's the appraiser's own pick, separate from the cascade.

---

**Last reviewed:** 2026-06-12 by co-architect — rewritten word-for-word per the dropdown (no table), with where each part goes in plain sentences.
