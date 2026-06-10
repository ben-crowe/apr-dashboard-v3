---
title: Move List — Current Live Dashboard vs Proposed Layout
status: proposal-draft
created: 2026-06-10
updated: 2026-06-10
last_reviewed: 2026-06-10
description: Approve-before-touch checklist. Diffs the CURRENT live job-detail dashboard (5 Independent section components) against the PROPOSED section re-sort. Headline finding — it is mostly ADD (the live LOE Quote section is near-empty), not rearrange.
tags: [apr-workflow, field-registry, dashboard, loe, section-resort, move-list]
entities: [[APR Dashboard]] [[LOE Quote Section]] [[Master Field Registry]]
related: [~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/PROPOSED-SECTION-RESORT-2026-06-09.md]
---

# Move List — Current Live Dashboard vs Proposed Layout

**Tags:** #apr-workflow #field-registry #loe #section-resort #move-list
**Entities:** [[APR Dashboard]] [[LOE Quote Section]] [[Master Field Registry]]

[🏠 Home](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md) · [Proposed Re-Sort](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/PROPOSED-SECTION-RESORT-2026-06-09.md)

> **Approve-before-touch.** Nothing in code changes until you sign off on this list. Source: the 5 live `*Independent.tsx` section components vs the proposed re-sort doc.

---

## ⭐ Headline — CORRECTED 2026-06-10: the LOE is broadly wired; this is cleanup + cascade display, not a big build

**Earlier draft of this doc was wrong** — it counted fields *rendered in the one LOE-Quote accordion* and concluded ~26 were "missing from the LOE." That conflated two different things. Ground truth from `src/utils/loe/generateLOE.ts` (`mapDataToV07Fields`): the LOE document reads its tokens **straight from the saved job record** (`job` + `jobDetails`) — client info, property info, job number, property rights, report type, fee, dates, current/proposed use, assignment type, approaches, plus the derived value-scenario cascade. Wherever a field is entered on the dashboard, it reaches the LOE. So the LOE is **broadly fed today**.

The accordion only *shows* a handful of inputs, but the job record behind it carries the rest — collected via the intake form, Valcre readback, and the other sections. "Fields visible in Section 2" ≠ "fields reaching the LOE."

**What's actually the work (small, not a rebuild):**

1. **Cascade display** — Status of Improvements → Value Scenarios → EA/HC narratives already fires inside `generateLOE.ts` at generation time, but does **not** auto-show on the live dashboard. Surface it.
2. **Two free-text gaps** — Current Use / Proposed Use fall back to blank because they're free-text; the client registry has option lists. Build the dropdowns.
3. **Option-label reconcile** — app labels vs client labels mismatch (e.g. "Multi-Family" ≠ "Multifamily") → cascades match on exact text and silently no-op. Gated on Chris.
4. **Section renumber / regroup** — cosmetic reorder of already-aligned sections.

The not-wired exceptions QA confirmed are about **Valcre/ClickUp sync on job-create**, a *different* destination from the LOE — not LOE gaps.

---

## A. Pure rearrange moves (cheap — fields already exist live)

These are genuine just-move-it items.

**Report Type** — lives in live Section 2 "LOE Details". Stays in Section 2 but joins the new "Report Type & Assignment Type" group.

**Loan Number** — live Section 1 "Property Information". Keep (maps to nothing critical; confirm it stays).

**Disbursement %** — live Section 2. Not in the proposed layout — decide keep or drop.

**Data Gathering block (Section 3b live → Section 4 proposed)** — the whole Property Site / Parcels / Assessments cluster is already built and already matches the proposed Section 4 almost field-for-field. This is a rename + renumber, not a rebuild.

**Doc Upload (live Section 4 → proposed Section 5)** — identical 8 fields. Renumber only.

---

## B. Section 2 — verify which driving inputs exist live, then surface the cascade

The earlier Explore pass read only the top-level `LoeQuoteSectionIndependent.tsx` and missed the `loe-quote/` subcomponents (PaymentSection, ValuationSection, PropertyRightsSection, JobNumberField, CommentsSection...). So the live Section 2 is richer than "5 fields." **Verify the real set before claiming anything is missing.**

The genuine work here is NOT building two dozen fields — it's:
- **Surface the value-scenario cascade** (Status of Improvements → scenarios → narratives) on the live dashboard. The logic exists in `loeCascade.ts` and already runs at LOE-gen; the dashboard just doesn't preview it.
- **Confirm a live input exists for the cascade trigger** (Status of Improvements). If the only way it's set today is indirect, add the input.
- Free-text → dropdown for Current Use / Proposed Use (Section C item, registry has the lists).

---

## C. Section 1 adds

Live Section 1 has contact + property address + type + loan number + special instructions. Proposed adds:

**Authorized Use · Valuation Premises · Asset Condition · separate Property Contact block (4 fields) · Client Comments** (live has "Special Instructions" — likely the same field, confirm rename).

---

## D. Brand-new sections

**Section 3 — Building Information** (Year Built, Building Size, Units, Parking, State of Improvements, Land Metric, Env. Assessment, Heritage, Legal Description). No live equivalent.

**Closing & Payment** (Retainer Paid, Amount Paid, Paid Date, Signed Date) — post-signature, future QuickBooks flow.

---

## Recommendation

Calling this "rearrange the current dashboard" undersells it. Sections 1/4/5 are a quick rename-and-reorder. **Section 2 is a build** — ~26 new fields plus the cascade wiring. The honest path:

1. **Quick win first** — renumber/rename Sections 3b→4 and 4→5 (already aligned), add Section 1's missing fields. Low risk, visible progress.
2. **Then the real work** — build out Section 2's LOE-gate fields against the proposed layout, field group by field group, with the not-wired exceptions flagged as we go.

Before any of B, the 4 🔴 code-verify blockers in the [Proposed Re-Sort Open Items](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/PROPOSED-SECTION-RESORT-2026-06-09.md) still gate (Zoning/Transaction Status wiring, Assignment Type one-or-two, Approaches vs Scope, Property Type/Tenancy option mismatch).

---

**Last reviewed:** 2026-06-10 by ui-designer — initial diff of live components vs proposed re-sort.
