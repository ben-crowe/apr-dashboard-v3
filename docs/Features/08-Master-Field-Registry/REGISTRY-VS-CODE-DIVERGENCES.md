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

> **CORRECTION (2026-06-10, later same day) — 12414 is NOT empty.** A fresh readback on 784140 during punch-list baselining shows **CF12414 `ValueScenarios` = [7505, 7506] POPULATED**, alongside legacy premise CF11563=[5128]/CF11564=[5138]. So the code is **dual-writing to BOTH** the registry field (12414, handles all scenarios) AND the legacy premise fields (11563/11564, only understand 2 → throws the false "Failed to sync" on a 3rd). The original "12414 unused / values land only in premise" framing above was WRONG. The real divergence is the **dual-write**, not a mis-route. Fix in flight (co-arch punch-list #1): drop the legacy premise write, keep 12414. The Chris question (is Value Scenario == Valuation Premise?) still stands for the *native* `RequestedValues` field (separately = "None").

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
| **Status** | Step 1 (read-only) DONE 2026-06-10. **Target + plumbing CONFIRMED 2026-06-15** (see resolution note). Values still OPEN — Chris question drafted (`CHRIS-QUESTION-property-subtype-options.md`). Write-readback held for Ben's go. |
| **Resolver** | qa (validate) → Ben/Chris (client-review trail). |

**Step 1 read-only findings (sampled 100 live Properties):**
- The live native field is **`SecondaryType`**. A second field `SubType` exists but is **empty/unused** across the sample.
- **SecondaryType values actually in use:** `Apartments`, `Low-rise`, `Multifamily`, `Warehouse`.
- **None of Chris's 4** (Apartment / Townhouse / Mixed Use / Shopping Centre) appear in the sample. ⚠ **`Apartment` (Chris) vs `Apartments` (Valcre) is a singular/plural near-miss** — the exact silent-no-write trap if SecondaryType is enum-validated.
- **Industrial gap CONFIRMED:** Industrial properties DO carry a subtype (`Warehouse` seen), so Valcre supports industrial subtypes — but Chris's curated 4 contain **no industrial option**. An industrial property (like our test property 25802872, currently SecondaryType=None) has no valid Chris-option to pick.
- **NOT yet proven:** whether Chris's exact 4 strings LAND or silently no-write. A 100-property sample shows what's *used*, not the accepted enum. The per-option write→readback (step 2, Ben-gated) is what settles "which land."

**Resolution note (2026-06-15, Property-area live pull — ui-designer):**
- **Target CONFIRMED:** Subtype → native `Property.SecondaryType` is correct. A Property-scoped
  CustomFields pull found **no real Property custom field** for subtype (only a junk CF `XXXX`).
  Plumbing is wired both paths (api/valcre.ts update L823-865 + create L1242) and on the edit
  path's client send (wired 2026-06-15).
- **Blind spot cleared:** the earlier custom-field pull was Job-scoped (FieldEntityType=Job) only.
  The Property-area pull confirms Chris's entire real custom-field registry is **Job-scoped** (55
  Job / 1 Contact-junk / 1 Property-junk of 57 CFs) — nothing was hiding in the Property area.
- **Still OPEN = values only:** is `SecondaryType` a constrained enum or free text, and what is the
  canonical accepted option set (incl. an industrial subtype)? → **Chris question**, drafted in
  `CHRIS-QUESTION-property-subtype-options.md`. Settled by Chris's answer and/or a write→readback.

**Related (NOT a divergence — closed): Tenancy home.** Ben's Property screenshot showed a native
`Property.Tenancy` attribute, raising "which home?". Live `/CustomFields` `FieldEntityType` pull
resolves it: CF12408 Tenancy = **Job-scoped** = Chris's purpose-built registry target. The native
Property.Tenancy is a coincidental native attribute, NOT the registry target. The CF12408 wiring
(2026-06-15) is **correct** — readback-pending only.

---

**Last reviewed:** 2026-06-10 by qa-agent — created the divergence register; entry #1 (Value Scenarios → 12414 vs premise 11563/11564) logged from live-tenant verification. PV-1 (Property Subtype native-value validation) queued from co-arch.
