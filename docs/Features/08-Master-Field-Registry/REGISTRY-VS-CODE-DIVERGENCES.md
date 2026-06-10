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

**Last reviewed:** 2026-06-10 by qa-agent — created the divergence register; entry #1 (Value Scenarios → 12414 vs premise 11563/11564) logged from live-tenant verification.
