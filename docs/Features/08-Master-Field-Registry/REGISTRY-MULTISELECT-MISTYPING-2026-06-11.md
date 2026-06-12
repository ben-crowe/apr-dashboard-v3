---
title: "Registry Mis-Typing — Single Dropdown vs Multi-Select (root cause)"
status: active
created: 2026-06-11
updated: 2026-06-11
last_reviewed: 2026-06-11
description: "The field registry mis-types multi-select fields as single dropdowns and contradicts itself — the root cause of repeatedly rediscovering that Scope/Transaction Status should be multi-choice. Fixes shipped + registry corrections needed."
tags: [field-registry, multi-select, mapping, valcre, gotcha, ground-truth, doctrine-decision, apr-dashboard]
entities: ["[[field-registry-v6]]", "[[Valcre]]", "[[LoeQuoteSection]]", "[[api/valcre.ts]]"]
---

# Registry Mis-Typing — Single Dropdown vs Multi-Select

**Tags:** #field-registry #multi-select #mapping #valcre #gotcha #ground-truth #doctrine-decision
**Entities:** [[field-registry-v6]] [[Valcre]] [[LoeQuoteSection]] [[api/valcre.ts]]

> **Why this exists.** We kept "discovering" that fields like Scope of Work are multi-choice in Valcre every time we looked at a fully-filled client job. Root cause found 2026-06-11: **the field registry mis-types multi-select fields as single dropdowns, and contradicts itself.** We built the dashboard to the registry, so we built single dropdowns and silently dropped multi-value data. This doc is the durable record so it's never re-derived.

---

## The root cause

The registry ([public/field-registry-v6.html](~/Development/APR-Dashboard-v3/public/field-registry-v6.html)) HAS a control-type vocabulary that includes **"Select multiple options"** — and correctly marks 5 fields that way: **Interest Appraised, Value Scenarios, Approaches to Value, Client Documents, Transaction Status**.

BUT it gets two things wrong:

1. **Scope of Work is typed single** — its data entry reads `ctrl:'Select'` (single) even though the SAME entry says it maps to `valcre:{t:'Job.Scopes'}`, and Valcre's `Scopes` field is multi-value. So a field that demonstrably feeds a Valcre multi-field was marked single. That mis-typing is exactly why we built it as a single dropdown.

2. **The registry contradicts itself** — Client Documents appears as **"Select multiple"** in one data section AND as single `ctrl:'Select'` in another. So you can't trust the control type at a glance, which is the real friction.

**The rule that should govern it:** any field that maps to a Valcre multi-option field (`MultiOption` / `Job.Scopes`) MUST read **"Select multiple"** in the registry. Single ≠ multi — a dropdown and a multi-checkbox are different controls, and the registry must say which.

---

## Blast radius (audited 2026-06-11)

Only **two buildable fields** were mis-built as single dropdowns off the bad registry typing:

| Field | Registry said | Should be | Valcre field | Dashboard was | Status |
|---|---|---|---|---|---|
| **Scope of Work** | single `Select` | Select multiple | `Job.Scopes` (multi) | single `<Select>` | ✅ FIXED → MultiSelect + backend split-map |
| **Transaction Status** | Select multiple | Select multiple | CF12424 (MultiOption) | single `<Select>` | ✅ FIXED → MultiSelect (backend already handled multi) |

Everything else the registry marks multi is fine: **Client Documents** was already a MultiSelect; **Value Scenarios / Approaches / Interest Appraised** are cascade-derived (handle multi a different way).

---

## What shipped (code)

- **Scope of Work** → multi-checkbox in [LoeQuoteSection.tsx](~/Development/APR-Dashboard-v3/src/components/dashboard/job-details/LoeQuoteSection.tsx), and [api/valcre.ts](~/Development/APR-Dashboard-v3/api/valcre.ts) now splits the comma list, maps each scope via `SCOPE_OF_WORK_MAP`, and joins for Valcre's `Scopes` (both create + update paths). Deployed.
- **Transaction Status** → multi-checkbox in the same component. Backend `transactionStatus` was already a correct `MultiOption` encoder. Deployed.

## What still needs doing (the durable fix — registry)

The CODE is patched, but the **registry is still wrong** and will mis-inform the next build:

1. Correct **Scope of Work** to "Select multiple" in the registry.
2. Reconcile the **Client Documents** contradiction (mark it "Select multiple" consistently in BOTH data sections).
3. Sweep: confirm every field that maps to a Valcre `MultiOption` / `Job.Scopes` reads "Select multiple" — no field feeding a multi-target should be typed single.

Until the registry is corrected and made internally consistent, this class of bug recurs every time a fresh dropdown is built from it.

---

*Source: registry audit + live client job inspection (VAL261044 Sylvan Lake — client fills Scope and Values as multi), 2026-06-11.*

**Last reviewed:** 2026-06-11 by qa-agent — root-cause capture; two code fixes shipped, registry corrections pending.
