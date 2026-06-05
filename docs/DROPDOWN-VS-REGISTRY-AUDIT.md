---
content_type: audit
title: Dropdown vs Registry Audit — app options checked against Valta Registry V6
status: v1 — first pass, 2026-06-05
owner: ui-designer (authors) · react-spec (fixes app) · co-architect (registry edits)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
registry_v6: "public/field-registry-v6.html (the List* arrays = canonical option sets) + live https://apr-dashboard-v3.vercel.app/field-registry-v6.html"
tags: [apr-workflow, fields, dropdowns, registry-v6, audit, source-of-truth]
related: [~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/Valcre-Integration/1-API-FIELD-MAPPING-REFERENCE.md, ~/Development/APR-Dashboard-v3/docs/DASHBOARD-FIELD-CATALOG.md, ~/Development/APR-Dashboard-v3/docs/01-AGENT-ACCESS-LOGIN-PRIMING.md, ~/Development/APR-Dashboard-v3/docs/FIELD-ROUTING-dashboard-clickup-loe.md]
parent: "~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/Valcre-Integration/1-API-FIELD-MAPPING-REFERENCE.md — its PENDING Questions section parks these for Ben/Chris"
---

# Dropdown vs Registry Audit

**The rule (Ben):** the **Valta Registry V6** is the source of truth. Every app dropdown should match its registry `List*` set. Where they disagree, the registry is the authority — so the fix is *either* correct the app *or* "tell us what in the registry needs changing."

**Canonical source:** the `List*` arrays in `public/field-registry-v6.html` (lines ~934–955).
**App source:** `LoeQuoteSection.tsx` (job-prep) + `ClientSubmissionSection.tsx` (intake).
**Confidence:** ✓ = confirmed · ⚠ = field↔options mapping should be confirmed against the live UI (grep loses the JSX label context).

---

## Verification method — it's a THREE-way check, and Valcre is the tie-breaker

This audit is app vs registry. But for any field that **syncs to Valcre**, the real authority chain is **app vs registry vs Valcre-real** — and **QA is the verifier** (he has live Valcre access and pulls Valcre's actual option set side-by-side). Two rules govern what a discrepancy *means*:

- **Native Valcre enum fields** (Authorized Use → `IntendedUses`, Property Rights → `Purposes`, Analysis Level → `AnalysisLevel`): options are **locked by Valcre's platform — we cannot add to them.** The app + registry MUST use only what Valcre offers. A registry/app option Valcre lacks = **hard ceiling → flag to the client** ("the registry info doesn't match Valcre's only allowed options").
- **Custom Valcre fields** (Transaction Status → CF12053, Zoning → CF12054, Valuation Premise → CF11563/11564): options are a list **Valta defined in Valcre** — so if the registry wants one Valcre lacks, the fix could be **"add it in Valcre,"** not "drop it from the app." That's a client choice, not an automatic trim.
- **Fields that don't map to Valcre at all** (the DO-NOT-SYNC set — Report Format, Purpose, Lead Appraiser, etc.): Valcre is NOT the verifier here. They're allowed to differ — APR→LOE only. "Not in Valcre" does NOT mean wrong for these.

So when a dropdown's options are in question: route it to QA → he marks each as **hard ceiling (native, must match Valcre)** or **addable gap (custom, client decides)** — unless it's a non-sync field, in which case Valcre cross-ref doesn't apply.

---

## A. REGISTRY needs updating (the registry is incomplete, app is ahead)

- **Zoning Status** — registry `ListZoningStatus` is **EMPTY `[]`**. The app has the real set: **Legal Conforming · Legal Non-Conforming · Illegal · No Zoning** (and it syncs to Valcre CF 12054). → **Populate the registry** with these 4. App is correct.
- **Land $/Metric** — registry `ListLand$/Metric` is **EMPTY `[]`**. → registry needs the canonical set if this field is live.

## B. APP needs fixing (registry is the standard, app deviates)

- **Authorized Use** — registry `ListAuthorizedUse` = **8**: First Mortgage Financing · Financial Reporting · Insurance · Internal Decision-Making · Acquisition-Disposition · Estate Planning · Litigation · GST.
  - Job-prep copy = **exactly these 8 ✓ matches.**
  - Intake copy = **10** — has 2 EXTRAS not in registry: **Underwriting Decisions, Other.** → drop them (or add to registry if the client wants them). Also it's a duplicate field — keep one copy (per the dedup spec), options = the registry 8.
- **Property Type** (intake) — registry `ListPropertyType` = 9 (Multifamily · Self-Storage · Retail · Industrial · Office · Land · Hotel · Seniors · Other). App intake = **16** and renamed: Agriculture, Building, Healthcare, Hospitality, Manufactured Housing, **Multi-Family** (vs *Multifamily*), **Senior** (vs *Seniors*), Single-Family, Special Purpose, Unknown… → big mismatch; reconcile names + set.
- **Valuation Premises** (intake) — registry (inline) = Market Value · Market Rent · Investment Value · Insurable Value (4). App = those + **Liquidation Value** (5). → app has 1 extra not in registry (the test job even uses "Liquidation Value"). Reconcile.
- **Transaction Status** ⚠ — registry `ListTransactionStatus` = **Not Applicable · Listed · Under Contract**. App cluster = **Arm's Length · Non-Arm's Length · Listing · Under Contract · REO/Bank Sale**. Only "Under Contract" overlaps. → mismatch (confirm this app cluster is Transaction Status and not a separate "Sale Type" field). Note: Transaction Status syncs to Valcre CF 12053 — the values must match what Valcre accepts.
- **Property Rights / Interest Appraised** — registry `ListInterestAppraised` = **4** (Fee Simple · Leased Fee Interest · Leasehold Estate · Going Concern). App + the registry's own cascade outcome both show a **5th: "Fee Simple & Leased Fee."** → registry's `ListInterestAppraised` array is missing the 5th its own cascade produces; add it (internal registry inconsistency).

## C. NAMING COLLISION — reconcile what each field is called

- Registry `ListReportType` = **Comprehensive · Concise · Form**. But in the app, that trio is **"Report Format"** (and matches ✓). The app's **"Report Type"** is a *different* list entirely (Appraisal Report · Restricted Appraisal Report · Evaluation · Desk Review · …). So "Report Type" means two different things across registry vs app.
- Add to that **"Analysis Level"** (app shows Detailed · Summary · Brief in source, but a prior capture showed Comprehensive/Concise/Form) — overlaps conceptually with Report Format.
- → These three (Report Type / Report Format / Analysis Level) need a human call on canonical names + which is the real Comprehensive/Concise/Form field. This is the duplicate-field question from earlier, now with the registry context.

## D. MATCHES (app = registry ✓)

- **Assignment Type** — Single Property · Multiple Properties ✓.
- **Report Format** — Comprehensive · Concise · Form = registry `ListReportType` ✓ (name aside).
- **Yes/No fields** (Desktop Report · CMHC Financing · Previously Appraised) — Yes · No = registry `ListYes/No` ✓.
- **Approaches to Value** ⚠ — registry `ListApproachestoValue` = Land Direct Comparison · Cost · Direct Comparison · Income Approach; confirm app field matches (the app's "Scope of Work" is a different, larger list and has NO registry `List` — likely app-only).

## E. NO registry canonical (app-only or needs a registry entry)

- **Scope of Work** — large app list (All Applicable, Best One/Two Approaches, etc.); no registry `ListScopeOfWork`. Decide: app-only, or add to registry.
- **Payment Terms** — On LOE Signature · NET 30 Days · On Completion · 50% Upfront; no registry list.
- **Asset Condition** (intake) — Excellent · Very Good · Good · Fair · Poor; no registry list.

---

## Fix routing

- **Registry edits (Section A + the Property Rights 5th + collision naming):** co-architect / the registry owner — these are "change the registry" items.
- **App edits (Section B):** react-spec — match the app dropdowns to the registry sets.
- **Human calls:** Section C naming + whether Section E fields should be registry-governed → Ben / Chris.

> Multi-select option lists (Value Scenarios, Client Documents) and the cascade fields are governed by the registry's `ListValueScenarios` (10) / `ListClientDocuments` (11) — verify the app multi-selects render those exact sets in a follow-up pass.
