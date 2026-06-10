---
content_type: field-audit
title: Job-Detail Field Audit — dropdown clarity + conflicts (SS12-backed)
status: cross-checked + reconciled 2026-06-09 — awaiting Ben's decision on FLAG 1 before ANY field change
owner: ui-designer (built) · co-architect (cross-check vs cascade/registry source)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
tags: [apr-workflow, field-audit, dropdown, conditional-field-logic, cascade, job-detail, source-of-truth, provenance, field-registry]
entities: [[APR Master Dashboard]] [[Valta Master Field Registry]] [[loeCascade]] [[LOE Quote Section]] [[Data Gathering Section]]
sources:
  - src/components/dashboard/job-details/* (code map, every field's input type + options)
  - "docs/Features/08-Master-Field-Registry/client-source/Valta Master Field Registry v03 - reviewed 2026-06-09.xlsx" ("Dropdown Lists" tab — CURRENT CLIENT source of truth, live SharePoint pull 2026-06-09)
  - "docs/Features/08-Master-Field-Registry/client-source/Valta Master Field Registry v03 - reviewed 2026-06-09.xlsx" ("Field Registry" tab — per-field provenance: Control Type · Source Type · Dropdown List · Valcre target · Status directive, read firsthand 2026-06-09)
  - docs/valta share/CONDITIONAL-FIELD-LOGIC.md (derived plain-language mirror — NOT the client file)
  - src/utils/loe/loeCascade.ts (cascade keys — the TRUE source for cascade-trigger strings)
---

# Job-Detail Field Audit — dropdown clarity + conflicts

**Tags:** #apr-workflow #field-audit #dropdown #conditional-field-logic #cascade #job-detail #source-of-truth #provenance #field-registry
**Entities:** [[APR Master Dashboard]] [[Valta Master Field Registry]] [[loeCascade]] [[LOE Quote Section]] [[Data Gathering Section]]

> 🏠 Home: [APR Master Dashboard](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md) → Significant Features → Job-Detail Field Audit.

Built from a full SS12 (context-search + deep cascade + code map) against the live job-detail
components, cross-referenced to the registry source-of-truth. **Answers Ben's question: which fields
have dropdowns, which are missing them, and where options are wrong.**

> ## 📌 SOURCE OF TRUTH — the CURRENT client file (named + reviewed)
> **Client registry file (CURRENT):** [Valta Master Field Registry v03 - reviewed 2026-06-09.xlsx](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/client-source/Valta%20Master%20Field%20Registry%20v03%20-%20reviewed%202026-06-09.xlsx)
> — pulled by Ben from the client's **live SharePoint on 2026-06-09**, stored in
> [client-source/](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/client-source/). **`v03` is the client's own naming
> convention** (he bumps the number only on a major change). The authoritative option-sets live on its
> **"Dropdown Lists" tab** (6 tabs total: Field Registry · Dropdown Lists · EA-HC Text · Types ·
> Valcre Fields · TBD).
> **Reviewed firsthand by ui-designer: 2026-06-09** (read the xlsx directly).
> **Diff result:** its dropdown lists are IDENTICAL to the prior `…v3.1-2026-06-05.xlsx` — no
> option-set changes, so every finding below holds against the live registry.
>
> **[CONDITIONAL-FIELD-LOGIC.md](~/Development/APR-Dashboard-v3/docs/valta%20share/CONDITIONAL-FIELD-LOGIC.md) is NOT the client file** — it's our derived plain-language mirror of
> the cascade RULES only. The option-SET authority is the xlsx above. (The md's Status-of-Improvements
> prefixes are stale; the xlsx + [loeCascade.ts](~/Development/APR-Dashboard-v3/src/utils/loe/loeCascade.ts) are correct.)
>
> ⚠ **Refresh trigger:** when the client posts a new SharePoint version (he'll bump past `v03`), drop
> it in [client-source/](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/client-source/), re-diff, and re-date this stamp.

> **Verification (2026-06-09):** every conflict below was read FIRSTHAND in the component source
> ([LoeQuoteSection.tsx](~/Development/APR-Dashboard-v3/src/components/dashboard/job-details/LoeQuoteSection.tsx), [PropertyInfoSection.tsx](~/Development/APR-Dashboard-v3/src/components/dashboard/job-details/PropertyInfoSection.tsx)) AND cross-checked against the client xlsx
> "Dropdown Lists" tab. The code's own comments confirm the diagnosis (Transaction/Zoning Status carry
> "old options didn't match the new field" fix-notes; Job Status carries "options not invented").
> SS12 layer ratings: Vault RICH · Files RICH (code + client xlsx) · Gemini RICH · Cognee THIN
> (generic) · JSONL THIN (term collision).
>
> **One correction to my earlier chat:** I'd said Zoning Status "disagrees — In Place vs Property Site."
> Wrong — "Property Site" is a sub-section HEADER in the Data Gathering area, not a field value. The
> REAL issue is bigger: the two sections offer **different option SETS** for the same `zoningStatus`
> column (see headline table).

---

## ⭐ THE HEADLINE — the real problem is duplicate fields built two different ways

Several fields are rendered in BOTH the **LOE Quote section** AND the **Data Gathering / Property
Research section**, bound to the **same database column**, but with **different controls or different
option lists**. Same storage, two UIs → **whichever section saves last wins** → silent data conflict.

**The pattern:** the LOE Quote section generally holds the CURRENT, Valcre/registry-matched options.
The Data Gathering section holds STALE/older option sets for the same field. This is the source of the
"odd" behavior Ben saw.

| Field (same DB binding) | LOE Quote section | Data Gathering section | Verdict |
|---|---|---|---|
| **Approaches to Value** | **free-text box** (no dropdown) | **dropdown**, 7 options | ⚠ same field, two control types — THE oddity Ben flagged. The free-text box just shows whatever's stored. |
| **Assignment Type** | dropdown: Single Property / Multiple Properties | dropdown: Standard / Update / Retrospective / Desktop | ❌ opposite meanings, same column |
| **Transaction Status** | dropdown: Not Applicable / Listed / Under Contract (Valcre-matched) | dropdown: Arm's Length / Non-Arm's Length / Listing / Under Contract / REO (stale) | ❌ different option sets, same column |
| **Zoning Status** | dropdown: In Place / To Be Rezoned (Valcre-matched) | dropdown: Legal Conforming / Legal Non-Conforming / Illegal / No Zoning (stale) | ❌ different option sets — this is why "Zoning Status" looked inconsistent |
| **Desktop Report** | dropdown: Yes / No | dropdown: Yes / No | ✓ harmless duplicate (same options) — but **client Status directive = "Delete"**: the registry wants this field removed entirely (see Provenance) |
| **Year Built** | (Building Info) numeric | numeric | ✓ harmless duplicate |

**Recommendation:** for each conflicted field, pick ONE canonical section + option set (the
Valcre-matched LOE-section set), make the other a read-only mirror or remove it. This is a code fix,
not just a registry fix.

> ⛔ **BLOCKED — do NOT act on this recommendation yet (Co-Arch Cross-Check FLAG 1).** The verified
> Valcre readback shows Zoning syncing FROM the **Data-Gathering (stale-looking) field**, not the LOE
> section. So "remove the Data-Gathering version" could BREAK the live Valcre sync. **First** confirm
> in code which field feeds Valcre CF12053 (Transaction) + CF12054 (Zoning), re-point if needed, THEN
> Ben rules. Also (FLAG 4): Assignment Type may be **two different concepts** sharing one column — verify
> same-concept before calling it a dedupe. See the [Co-Arch Cross-Check](#co-arch-cross-check--vs-the-verified-dashboardvalcre-location-map) section below.

---

## ⭐ ROLE classification — the lens (and the grouping)

Every job-detail field gets ONE role. This is both the audit key AND the grouping Ben wants — the
three roles cluster the dashboard into purpose blocks instead of crammed columns:

- **INPUT** — user picks it; should have a dropdown/option-set. *(grouping = "pick these")*
- **DERIVED** — no dropdown by design; computed from other fields via the cascade. Name the driver.
  *(grouping = "auto-filled — review")*
- **FREE-TEXT** — manual typed entry by design (names, addresses, amounts, jurisdiction-specific). *(grouping = "type it in")*

**The gap-flag ONLY fires on a TRUE gap = an INPUT field missing its option-set.** A DERIVED field
with no dropdown is correct, not a gap. A FREE-TEXT field with no dropdown is correct, not a gap.

### TRUE gaps — INPUT fields missing their option-set (the only real "missing dropdown" list)

| Field | Role | Why it's a gap | Client-registry option list (verbatim from xlsx "Dropdown Lists") |
|---|---|---|---|
| **Current Use** | INPUT | **registry HAS the options; app renders free-text** — straight wiring gap | `ListCurrentUseImprovements`: Vacant Land · Single Family · Multifamily · Retail · Industrial · Office |
| **Proposed Use** | INPUT | **registry HAS the options; app renders free-text** — straight wiring gap | `ListProposedUseImprovements`: Single Family · Multifamily · Mixed Use · Retail · Industrial · Office |
| **Job Status** | INPUT | **NOT "options not invented" — it IS a registry select field** mapping to Valcre's **Status** enum; its options come from there. Gap = the app renders free-text instead of wiring the registry dropdown (see Provenance). | Valcre **Status** enum (registry "Job Status" row, Source Type = User Input / "Select one option") |
| **Purpose** | FREE-TEXT (LOE-only) | **NOT a Valcre gap** (Co-Arch FLAG 2): Valcre `Job.Purposes` is fed by Property Rights via PURPOSES_MAP — the dashboard Purpose text field does NOT sync to Valcre. May still warrant a list for LOE use, but not a Valcre-mapping gap. | free-text today |
| **Flood Zone** | INPUT (candidate) | FEMA zones are a fixed set (Zone X / AE / …); no registry list | currently free-text — confirm with Chris |

### DERIVED fields — NOT gaps (no dropdown by design; driver named)

| Field | Role | Driver | Current control issue |
|---|---|---|---|
| **Property Rights** | DERIVED | Property Type / Subtype / Tenancy (last pick wins) | rendered as a manual multi-select — should be an *outcome* (auto-set, adjustable) |
| **Value Scenarios** | DERIVED | Status of Improvements (override: Authorized Use = Insurance) | manual multi-select today; cascade not yet wired to it |
| **Approaches to Value** | DERIVED | Value Scenarios | ⚠ rendered as **free-text** in the LOE section — this is the "missing dropdown" you saw; it's NOT a gap, it's a derived field built with the wrong control |

**This resolves the Scope = Approaches = "Income Approach" overlap:** Scope of Work is a real INPUT
dropdown ("Income Approach" is a valid option). The Approaches-to-Value box beside it is the *free-text*
instance of a DERIVED field — it only looks like a duplicate value because both happen to hold
"Income Approach." Fix = render Approaches as its derived outcome, not a free-text box. No gap to fill.

### FREE-TEXT by design — NOT gaps
Names · Title · Organization · addresses · phone · email · Client Comments · Lead Appraiser ·
all currency (Fee, Retainer, amounts, assessed/land/total values, taxes) · all dates · numeric
building/site metrics · Parcel Number · Zoning / Zone Code / Land Use / Utilities (jurisdiction-specific) ·
Env. Assessment · Heritage · Legal Description. *(Delivery Time (wks) is free-text today — optional small INPUT later.)*

---

## Provenance — where each field came from (client "Field Registry" tab)

This section answers a different question than everything above: **not "what are the options" but "where did each dashboard field come from."** Earlier passes only read the **"Dropdown Lists"** tab; this provenance backbone comes from the **"Field Registry" tab** of the current client file [Valta Master Field Registry v03 - reviewed 2026-06-09.xlsx](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/client-source/Valta%20Master%20Field%20Registry%20v03%20-%20reviewed%202026-06-09.xlsx) ([client-source/](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/client-source/)), read firsthand 2026-06-09.

The "Field Registry" tab is the **master field list** — one row per field, each carrying: **Control Type · Source Type** (how it's filled) **· Dropdown List · Valcre target field · Status directive.** It is the answer to "where did each dashboard field come from." A field with a registry row is **registry-sourced** (conform to it); a field with no row is a **true outlier** (needs a "why is it here?" answer).

**Approach (Ben):** conform the registry-sourced fields first; the true outliers are secondary — each needs a "why is it here" answer (client custom request, internal-ops, or remove).

### Registry-sourced fields (handle these FIRST — conform to the registry)

| Field | Source Type (how filled) | Dropdown list / Valcre target | Note |
|---|---|---|---|
| **Job Status** | User Input, "Select one option" | Valcre **Status** field | NOT invented — it's a registry dropdown that maps to Valcre's Status enum; options come from there. (Corrects the earlier "options not invented.") |
| **Current Use Improvements** | User Input, select | `ListCurrentUseImprovements` (Required) | registry field — app renders free-text = wiring gap |
| **Proposed Use Improvements** | User Input, select | `ListProposedUseImprovements` (Required) | same |
| **Assignment Type** | User Input, select | `ListAssignmentType` (Single/Multiple) | the registry's ONE Assignment Type |
| **Desktop Report** | User Input, select | `ListYes/No` | **client Status directive = "Delete"** — client wants it removed |
| **Value Timeframe** | User Input, select | `ListValueTimeFrame` | registry field |
| **Delivery Time** | User Input, **Whole Number** | (no list) | free-text NUMBER is correct per registry — not a dropdown gap |
| **Transaction Status** | User Input, multi-select | `ListTransactionStatus` | registry field |
| **Zoning Status** | User Input, select | `ListZoningStatus` | registry field |
| **Report Type** | User Input, select | `ListReportType` (Comprehensive/Concise/Form) | NOTE: registry "Report Type" = the app's "Report Format" field (naming swap) |
| **Property Type / Subtype / Tenancy / State+Status of Improvements / Interest Appraised / Authorized Use / Value Scenarios / Approaches to Value / Land $/Metric / CMHC Financing / Previously Appraised / Client Documents** | User Input or Logic, select | their respective Lists | all registry fields |
| **Section 10 cascade fields:** Value Scenario 1–6, EA/HC Summary 1–6, EA Detail 1–6, HC Detail 1–6 | User Input, select | `ListValueScenarios` / `ListEA/HCSummary` / `ListEADetail` / `ListHCDetail` | the registry DOES define the Section 10 narrative slots as select-from-text-library |
| **Date/money fields:** Fee (Calculated), Paid Date / Request Date / Signed Date / Due Date / Amount Paid / Paid (Logic-derived) | as noted | Valcre Fee / PaidDate / BidDate / AwardDate / DueDate / AmountPaid | "Source Type = Logic" means derived, not typed |

### True outliers (NOT in the registry — secondary; "why is this here?")

| Field | Where it appears | Status |
|---|---|---|
| **Lead Appraiser** | LOE-Quote section | NO registry row anywhere — genuine internal/app field, no client source. The clearest true outlier. |
| **Purpose** (dashboard text field) | LOE-Quote section | not a Field-Registry row; only appears on the "Valcre Fields" tab as native Valcre "Purposes" (fed by Property Rights per Co-Arch FLAG 2). App-added. |
| **Assignment Type** (Standard / Update / Retrospective / Desktop) | Data-Gathering section | NOT the registry Assignment Type — app-invented; confirms the concept-clash flag. |
| **Retainer Amount, Retainer Paid** | LOE-Quote section | no registry row (Fee is in registry, retainer is not) — app-added internal tracking. |
| **Data-Gathering property-research fields** (Zone Code, Land Use, Flood Zone, Utilities, Parcel Number, building/site areas, assessment values, taxes) | Data-Gathering section | not in the Job Field-Registry — likely Valcre Property/Parcel-record fields or app-added; need a separate trace before judging. |

---

## (B) The DERIVED fields (cascade outcomes — not normal user dropdowns)

Per the conditional-field logic, three fields are **auto-set by the cascade**, not freely picked:

- **Property Rights** ← Property Type / Subtype / Tenancy
- **Value Scenarios** ← Status of Improvements (override: Authorized Use = Insurance)
- **Approaches to Value** ← Value Scenarios

These should render as **outcome fields** (auto-filled, adjustable dropdown), never free-text.
**Current state:** the displayed test values do NOT match what the cascade would derive (Status =
"Improved - Under Renovation" should give *As-Is + As If Complete*, but Value Scenarios shows
*As Stabilized*). **So the cascade is not yet driving these dashboard fields** — they currently hold
manually-entered values. (The cascade logic exists in [loeCascade.ts](~/Development/APR-Dashboard-v3/src/utils/loe/loeCascade.ts) + the v07 mapper; wiring it to
the live dashboard display is a separate open task.)

---

## (C) Option-string mismatches that will BREAK the cascade (exact strings matter)

The cascade keys on EXACT strings. Where the app dropdown doesn't match the **client xlsx "Dropdown
Lists"** value, the rule silently never fires (and Valcre sync can 400). All "client registry" columns
below are verbatim from the current `Valta Master Field Registry v03` (live SharePoint pull, reviewed 2026-06-09):

| Field | App dropdown options (code) | CLIENT registry list (xlsx) | Problem |
|---|---|---|---|
| **Property Type** | Agriculture, Building, Healthcare, Hospitality, Industrial, Land, Manufactured Housing, Multi-Family, Office, Retail, Self-Storage, Single-Family, Senior, Special Purpose, Unknown, Other (16) | `ListPropertyType`: Multifamily, Self-Storage, Retail, Industrial, Office, Land, Hotel, Seniors, Other (9) | ❌ app list is a DIFFERENT set — names differ (Multi-Family≠Multifamily, Senior≠Seniors, Hospitality≠Hotel, no "Hotel") + extra app-only options → Property Rights cascade won't fire for most picks |
| **Tenancy** | Owner-Occupied, Single-Tenant, Multi-Tenant, Vacant (4) | `ListTenancy`: Multi-Tenant, Owner Occupied, Partial Owner Occupied, Single-Tenant, Unkown, Vacant (6) | ❌ "Owner-Occupied" (hyphen) ≠ client's "Owner Occupied"; app missing Partial Owner Occupied + Unkown → Property Rights override misfires |
| **Approaches to Value** (Data-Gathering dropdown) | All Applicable, Cost Approach, Direct Comparison, Income Approach, Cost + Direct Comparison, Cost + Income, Direct Comparison + Income (7) | `ListApproachestoValue`: Land Direct Comparison Approach, Cost Approach, Direct Comparison Approach, Income Approach (4) | ❌ app's combination options don't match the client's 4 atomic strings → derived cascade values won't match the dropdown |
| **State of Improvements** | Proposed, Under Construction, Complete (3) | `ListSateofImprovements`: Improved, Proposed, Vacant Land, Improved Development Land (4) | ❌ app set ≠ client set |
| **Status of Improvements** | Improved - Completed, Improved - Renovated, Improved - Under Renovation, Improved - Proposed Renovation, Proposed - Vacant Land, Proposed - Improved Land (Demolition Required), Proposed - Under Construction (7) | `ListSatusofImprovements`: identical (7) | ✓ **MATCHES the client xlsx + loeCascade.ts.** (`CONDITIONAL-FIELD-LOGIC.md` shows OLD "Existing -" prefixes — that md is stale; the xlsx + code are right) |
| **Transaction Status** | LOE section: Not Applicable, Listed, Under Contract ✓ · Data-Gathering: Arm's Length, Non-Arm's Length, Listing, Under Contract, REO/Bank Sale | `ListTransactionStatus`: Not Applicable, Listed, Under Contract (3) | ✓ LOE section matches client · ❌ Data-Gathering section is stale |
| **Zoning Status** | LOE section: In Place, To Be Rezoned ✓ · Data-Gathering: Legal Conforming, Legal Non-Conforming, Illegal, No Zoning | `ListZoningStatus`: In Place, To Be Rezoned (2) | ✓ LOE section matches client · ❌ Data-Gathering section is stale |
| **Assignment Type** | LOE section: Single Property, Multiple Properties ✓ · Data-Gathering: Standard, Update, Retrospective, Desktop | `ListAssignmentType`: Single Property, Multiple Properties (2) | ✓ LOE section matches client · ❌ Data-Gathering section is stale/wrong |
| **Report Type vs Report Format** | app "Report Type" = Appraisal Report, … (10) · app "Report Format" = Comprehensive / Concise / Form | `ListReportType`: Comprehensive, Concise, Form | ⚠ label swap — the client's `ListReportType` = the app's "Report **Format**" field. The app's "Report Type" is a separate concept with no client list. Reconcile naming. |

---

## (D) Full field inventory

The complete field-by-field table (every section, input type, options, source file:line) is captured
from the code map. Key sections: Client Info & Property Details ([ClientSubmissionSection.tsx](~/Development/APR-Dashboard-v3/src/components/dashboard/job-details/ClientSubmissionSection.tsx)),
LOE Quote & Valuation Details ([LoeQuoteSection.tsx](~/Development/APR-Dashboard-v3/src/components/dashboard/job-details/LoeQuoteSection.tsx)), Building Info ([OrganizingDocsSection.tsx](~/Development/APR-Dashboard-v3/src/components/dashboard/job-details/OrganizingDocsSection.tsx)),
Data Gathering / Property Research ([PropertyInfoSection.tsx](~/Development/APR-Dashboard-v3/src/components/dashboard/job-details/PropertyInfoSection.tsx)), Documents ([Section4Compact.tsx](~/Development/APR-Dashboard-v3/src/components/dashboard/job-details/Section4Compact.tsx)).

Registry source-of-truth option lists: **[Valta Master Field Registry v03 - reviewed 2026-06-09.xlsx](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/client-source/Valta%20Master%20Field%20Registry%20v03%20-%20reviewed%202026-06-09.xlsx)**,
"Dropdown Lists" tab ([client-source/](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/client-source/)) — the CURRENT CLIENT file
(live SharePoint pull, reviewed firsthand 2026-06-09). [CONDITIONAL-FIELD-LOGIC.md](~/Development/APR-Dashboard-v3/docs/valta%20share/CONDITIONAL-FIELD-LOGIC.md) is the derived
plain-language mirror only (its Status prefixes are stale — defer to the xlsx + [loeCascade.ts](~/Development/APR-Dashboard-v3/src/utils/loe/loeCascade.ts)).

---

## (E) Grouping — falls out of the ROLE classification

The LOE Quote section dumps ~30 fields in tight side-by-side columns. The role classification above
IS the grouping: cluster by **pick-these (INPUT)** → **auto-filled, review (DERIVED)** →
**type-it-in (FREE-TEXT)**. Within INPUT, sub-cluster by purpose: **Valuation Logic** (the derived
chain — Status of Improvements → Value Scenarios → Approaches, grouped + visually marked derived) ·
**Commercial Terms** (Fee, Retainer, Payment Terms) · **Assignment Meta** (Assignment Type, Report
Type/Format, Analysis Level) · **Dates** (Effective, Request, Signed, Delivery). Regroup AFTER the
conflicts (headline) are resolved — not before, or we'd re-shuffle fields about to be removed/merged.

---

## Next actions
1. **co-arch cross-check** this against the cascade/registry source loaded on their side (esp. the
   option-string mismatches in section C).
2. Decide canonical section + option set for each conflicted duplicate field (B/C above).
3. Define the missing option lists (Job Status, Current Use, Proposed Use, Purpose).
4. Reconcile the Report Type / Report Format label swap.
5. THEN regroup the LOE Quote section (E).

---

## Co-Arch Cross-Check — vs the verified Dashboard→Valcre Location Map

Cross-checked against [DASHBOARD-TO-VALCRE-LOCATION-MAP.md](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/Valcre-Integration/DASHBOARD-TO-VALCRE-LOCATION-MAP.md) (qa-agent, readback-verified on live VAL261101). Confirmations + conflicts to resolve BEFORE any field change:

- **FLAG 1 (CONFLICT — resolve first). Which dashboard field actually feeds the Valcre sync for the conflicted duplicates?** The verified readback shows Zoning Status synced to Valcre CF12054 as **"Legal Conforming"** — a value from the **Data-Gathering (stale) set**, NOT the LOE-section canonical "In Place." That implies the Valcre sync may read FROM the Data-Gathering field, not the LOE section. If so, the headline recommendation ("make LOE section canonical, remove/mirror Data-Gathering") would BREAK the Valcre sync unless it's re-pointed to the LOE field first. **ACTION:** confirm in code which field (LOE-section vs Data-Gathering) is wired to CF12053 (Transaction) + CF12054 (Zoning) before removing either.
- **FLAG 2 (CORRECTION). "Purpose" is NOT a Valcre-mapping gap.** This audit lists dashboard "Purpose" as an INPUT gap that "maps Valcre purpose." The verified map says the opposite: Valcre `Job.Purposes` is fed by **Property Rights** (via PURPOSES_MAP), and the dashboard **Purpose text field does NOT go to Valcre** (LOE-only). So Purpose-as-free-text isn't a Valcre gap — correct the note. (It may still warrant a list for LOE use, but not for Valcre.)
- **FLAG 3 (ADD — already-locked decisions, don't re-litigate).** The Valcre map's "Field-hygiene cleanup spec" already LOCKED: (a) **Authorized Use** is ALSO a duplicate (Client Intake + Job-Prep) — canonical = Client Intake, single-select, 8 `ListAuthorizedUse` options, remove the Job-Prep copy → add to the duplicate list as ALREADY-DECIDED; (b) **Valuation Premises vs Value Scenarios** = DISTINCT, locked "do NOT merge"; (c) **Scope of Work** is slated to become a multi-select CHECKBOX (Valcre Scope is a checkbox) — INPUT but multi-select, not single-pick.
- **FLAG 4 (VERIFY before dedupe). Assignment Type may be two concepts, not stale-vs-fresh.** The Valcre map flags it as a "concept clash" (held/not-wired). Single/Multiple Property vs Standard/Update/Retrospective/Desktop may be TWO DIFFERENT real concepts wrongly sharing one DB column — confirm same-concept before recommending "remove Data-Gathering"; they may need separate columns.
- **FLAG 5 (CONSISTENT — open question both docs raise). Approaches to Value vs Scope of Work redundancy.** This audit treats them as distinct (Scope=INPUT, Approaches=DERIVED-from-Value-Scenarios); the Valcre map asks to "clarify whether redundant with Scope of Work or genuinely distinct." Aligned — flag for Ben/Chris to confirm.

**CONFIRMS (no conflict):** Transaction/Zoning/Assignment LOE-section = client-canonical ✓ · Current Use/Proposed Use registry-has-list-but-app-free-text gap ✓ · Value Scenarios + Approaches + Property Rights = DERIVED ✓ · Property Type + Tenancy option-parity mismatch ✓ (and it matters — the Property Rights cascade keys on exact Property Type/Tenancy strings).

**No field changes until Ben decides the conflict resolutions (especially FLAG 1).**

---

**Last reviewed:** 2026-06-09 by documentation-engineer (added Provenance section from client "Field Registry" tab; corrected Job Status + Desktop Report notes).
