---
content_type: divergence-log
title: Registry-vs-Code Divergences — where Chris's registry and our live code disagree
status: active — append-only log; each entry is a Chris question until resolved
owner: qa-agent (logs, live-verifies) · co-architect (code trace) · Ben (routes to Chris)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
date: 2026-06-10
tags: [apr-workflow, field-registry, valcre-sync, registry-vs-code, divergence, chris-question, ground-truth]
---

# Registry-vs-Code Divergences

**Tags:** #apr-workflow #field-registry #valcre-sync #registry-vs-code #divergence #chris-question #ground-truth
**Entities:** [[Valta Master Field Registry]] [[Valcre Sync]] [[Chris]]

Where **Chris's registry** (the source of truth) and **our live code / the live Valcre tenant** disagree. Each entry stays open as a **Chris question** until his intent settles it. Verified against the live tenant, never assumed.

> **Why this list exists:** the three-layer doctrine (Chris's Excel → HTML mirror → our code) only works if drift is *logged and resolved*, not silently absorbed. This is the drift register.

---

## Entry #1 — Value Scenarios: registry target vs actual landing field

| | |
|---|---|
| **Registry says** | `ValueScenarios` maps to Valcre custom field **12414** (`ValueScenarios`). |
| **Live code/tenant says** | Value-scenario values land in the **Valuation Premise** fields — **11563** (`ValuationPremiseOne`) and **11564** (`ValuationPremiseTwo`). Verified live on job 784140: 11563 = "As Is", 11564 = "As Stabilized". |
| **And** | Custom field **12414 is empty / unused** on the live tenant. |
| **Status** | OPEN — needs Chris's intent. No code change made; the code comment was left pointing at 11563/11564 (matches reality). |

**The Chris question:** Are **Value Scenarios** and **Valuation Premises** the *same* thing or *distinct*?
- If **same** → either the code should write to 12414 (the registry's named field) and abandon the premise fields, OR the registry should be corrected to point at 11563/11564. One of the two is the real home; 12414 sitting empty next to populated premise fields is the smell.
- If **distinct** (Value Scenario = the as-is/as-stabilized scenario label; Valuation Premise = a separate appraisal concept) → then 12414 is a *different* field that legitimately should be populated separately, and we have a *missing* sync (12414 never gets written), not a mis-routed one.

**Why it matters:** until resolved, "Value Scenarios" looks wired (premise fields populate) but the registry's named field (12414) is always empty — so anyone trusting the registry's mapping would see a blank field and call it broken. The label-vs-field identity has to be Chris's call.

**Resolver:** Ben → Chris. Discovered 2026-06-10 during the live-tenant re-baseline.

---

---

## Pending validations (queued, not yet run)

### PV-1 — Property Subtype: do Chris's 4 options land in Valcre's native Subtype?

| | |
|---|---|
| **Field** | Property Subtype → Valcre native `Property.SecondaryType` (registry ValcreName=`Subtype`, RecordLoc=Property, NewCustom=No). |
| **Chris's curated options** | Apartment · Townhouse · Mixed Use · Shopping Centre (registry `ListPropertySubtype`). |
| **Risk** | Same silent-no-write trap as Transaction Status labels — a native enum write that doesn't match an accepted value lands as nothing (HTTP 200, no change). |
| **To confirm** | Per-option write→readback on a test Property: which of the 4 actually land in `SecondaryType`. |
| **ALSO** | Valcre Subtype is **nested under Property Type**. Chris's 4 are residential/retail — **no industrial option**. Flag whether an industrial Property can even accept these (Type↔Subtype validity). |
| **Status** | Step 1 (read-only) DONE 2026-06-10. Steps 2-3 (write-readback) held for Ben's go. |
| **Resolver** | qa (validate) → Ben/Chris (client-review trail). |

**Step 1 read-only findings (sampled 100 live Properties):**
- The live native field is **`SecondaryType`**. A second field `SubType` exists but is **empty/unused** across the sample.
- **SecondaryType values actually in use:** `Apartments`, `Low-rise`, `Multifamily`, `Warehouse`.
- **None of Chris's 4** (Apartment / Townhouse / Mixed Use / Shopping Centre) appear in the sample. ⚠ **`Apartment` (Chris) vs `Apartments` (Valcre) is a singular/plural near-miss** — the exact silent-no-write trap if SecondaryType is enum-validated.
- **Industrial gap CONFIRMED:** Industrial properties DO carry a subtype (`Warehouse` seen), so Valcre supports industrial subtypes — but Chris's curated 4 contain **no industrial option**. An industrial property (like our test property 25802872, currently SecondaryType=None) has no valid Chris-option to pick.
- **NOT yet proven:** whether Chris's exact 4 strings LAND or silently no-write. A 100-property sample shows what's *used*, not the accepted enum. The per-option write→readback (step 2, Ben-gated) is what settles "which land."

---

**Last reviewed:** 2026-06-10 by qa-agent — created the divergence register; entry #1 (Value Scenarios → 12414 vs premise 11563/11564) logged from live-tenant verification. PV-1 (Property Subtype native-value validation) queued from co-arch.
