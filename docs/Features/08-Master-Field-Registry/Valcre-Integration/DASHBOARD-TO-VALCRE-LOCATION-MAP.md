---
content_type: field-mapping
title: Dashboard → Valcre — Field LOCATION Map (which Valcre page/section each field lands in)
status: active — verified against live job VAL261101 (2026-06-05)
owner: qa-agent
home: 00-APR-MASTER-DASHBOARD.md
tags: [apr-workflow, field-mapping, valcre, dashboard-to-valcre, breadcrumb, sync, location-map]
keywords: [where does each field go in valcre, valcre job tab sections, dashboard field to valcre location, general dates report custom fields, field breadcrumb, valcre section map]
related: [AUTO-SYNC-WIRING-MAP.md, ../../../../Data-Flow Visuals/02-SYNC-VERIFICATION-RESULT.md, ../PRD-A-fields-to-valcre-mapping.md]
---

# Dashboard → Valcre — Field LOCATION Map

**What this answers:** for every APR dashboard field that goes to Valcre, **exactly where it lands** —
the Valcre tab, the section block inside it, and the field name. Read it as a breadcrumb:
`Valcre › JOB tab › <Section> › <Field>  ←  <APR dashboard field>`.

Companion to the [Auto-Sync Wiring Map](AUTO-SYNC-WIRING-MAP.md) (which gives the *how* — CF id / native
key / write method). This doc gives the **where** (the human-navigable location in the Valcre UI).

**Verified:** structure + values read back against live job **VAL261101** (Valcre Id 784140, "Westside
Mall") on 2026-06-05. ✓ = confirmed landed via API readback. Name-match guard before any write.

**Valcre site navigation (left sidebar):** Create new · Dashboard · Market Insights · **Jobs** ·
**Contacts** · Sets · **Properties** · Sales · Leases · Surveys · Expenses · Downloads · Administration ·
Custom fields. Our integration writes to **three** of these areas: **Contacts** (the Authorized Client),
**Properties** (the Subject Property), and **Jobs** (everything else) — the dashboard "Create Valcre Job"
action makes a Contact + a Property + a Job in one go.

**Full breadcrumb:** `Valcre › Jobs › <the job> › JOB tab › <Section> › <Field>`.

**Valcre page structure (JOB tab):** the job opens on the **JOB** tab (siblings: COMPS · FILES · DCF).
The JOB tab is one scrolling page of section blocks, in this order:
`General → Dates → Report → Values → Staff → Permissions → Comments → Custom Fields`.

---

## JOB › General
| Valcre field | ← APR dashboard source | How | Status |
|---|---|---|---|
| Job Number | (Valcre-generated VAL#, written back to dashboard) | on job create | system |
| Job Name | Property Name + Property Address (composed) | on create | ✓ |
| Subject Property | Property Name / Property Address | on create | ✓ |
| Authorized Client | Client First + Last + Organization | on create (Contact link) | ✓ |
| Fee | Appraisal Fee | on create/update | ✓ |
| Retainer | Retainer Amount | on create/update | ✓ |
| Amount Paid | — **Valcre-side / manual** (dashboard "Amount Paid" is internal-only, NOT synced) | — | Valcre-only |
| Status · Lead · Client File # · Borrower · Check # · Appraised Value | — not mapped from dashboard | — | n/a |

## JOB › Dates
| Valcre field | ← APR dashboard source | How | Status |
|---|---|---|---|
| Bid Date | **Request Date** | native `Job.BidDate` (PATCH) | ✓ verified |
| Awarded Date | **Signed Date** | native `Job.AwardDate` (PATCH) | ✓ verified |
| Date of Value | **Effective Date** | native `Job.EffectiveDate` (PATCH) | ✓ verified |
| Due Date | **Delivery Date** | native (PATCH) | ✓ (VAL261101 = 2026-02-10) |
| Inspection · Internal Due · Invoice · Paid Date | — not mapped from dashboard (Paid Date is internal-only) | — | n/a |

## JOB › Report
| Valcre field | ← APR dashboard source | How | Status |
|---|---|---|---|
| Authorized Use | **Authorized Use** | native `Job.IntendedUses` via `INTENDED_USES_MAP` | ✓ verified (EstatePlanning) |
| Purpose | **Property Rights** | native `Job.Purposes` via `PURPOSES_MAP` (first-value) | ✓ verified (LeasedFee) |
| Analysis Level | **Analysis Level** | native `Job.AnalysisLevel` via `ANALYSIS_LEVEL_MAP` | ✓ verified (Detailed) |
| Scope | **Scope of Work** | native `Job.Scopes` | ✓ (Income Approach) |
| Format | ⚠ dashboard **Report Format** was ruled **LOE-only / not-wired** — but a Valcre "Format" field DOES exist here. **Confirm with Ben** whether to wire it. | — | HELD — decision |

## JOB › Staff
| Valcre field | ← APR dashboard source | Status |
|---|---|---|
| Primary Appraiser | — **NOT** the dashboard "Lead Appraiser" (that's dashboard-only text). Valcre Staff needs a real Valcre staff account; set in Valcre. | Valcre-only |

## JOB › Permissions
No dashboard fields map here (Confidential etc. are Valcre-side).

## JOB › Comments
| Valcre field | ← APR dashboard source | How | Status |
|---|---|---|---|
| General (comments) | **Internal Comments** + **Payment Terms** appended (no native Payment-Terms field, so it rides here as `Payment Terms: <value>`) | on create/update | ✓ |

## JOB › Custom Fields
| Valcre custom field | ← APR dashboard source | CF id | Status |
|---|---|---|---|
| Valuation Premise - 1 | **Value Scenarios** (premise 1) | CF11563 | ✓ verified (As Is) |
| Valuation Premise - 2 | **Value Scenarios** (premise 2) | CF11564 | ✓ verified (As Stabilized) |
| Transaction Status | **Transaction Status** | CF12053 | ✓ verified (Under Contract) |
| Zoning Status | **Zoning Status** | CF12054 | ✓ verified (Legal Conforming) |
| Assignment Type | Assignment Type | CF12049 | ⏸ HELD (concept clash — not wired) |
| Approaches to Value | Approaches to Value | — | ⏸ HELD (cascade not wired) |
| Value Timeframe | (Value Timeframe) | — | ⏸ HELD (confirm field exists) |
| Status of Improvements · Property Subtype · Tenancy · Land Metric · State of Improvements | (cascade/property-research fields) | — | ⏸ HELD (job-prep, not yet wired) |
| Lender Company/Contact (Name/Address/Email/Phone/Title) | — not from current dashboard | — | n/a |
| Appraised Value - 1 / - 2 | — not mapped | — | n/a |

> The JOB › General **Subject Property** field is a **link** — clicking it opens the **Property record**
> (Valcre › Properties), which is where all property detail lands. Those fields are NOT on the Job tab.

---

## Properties › Subject Property record  *(opened via the "Subject Property" link)*
**Verified against the live Property record for VAL261101 (2026-06-05).** General section is the only one
fed by the dashboard; Site / Improvements / Flood / building-metric sections are appraiser-research fields,
correctly empty (not from intake).
| Valcre Property field | ← APR dashboard source | Status (VAL261101) |
|---|---|---|
| Name | property_name | ✓ Westside Mall |
| Property Type | property_type | ✓ Industrial |
| Street Address | property_address *(street-only string)* | ✓ 2129 Broadway Court |
| City | parsed from address/job name | ✓ Calgary |
| State/Province | parsed | ✓ AB |
| **ZIP/Postal** | — | 🚩 **EMPTY — GAP.** Dashboard collects NO property postal. `property_address` is one street-only field; the only postal on the dashboard is the **client's** (`client_address`), not the property's. **Fix:** add a structured property address (city/state/**postal**) on intake, or at least a property postal field. |
| **Condition** (Comments block) | asset_condition (= "Good") | ✗ **EMPTY — GAP.** `asset_condition="Good"` is on the dashboard but did NOT land in Valcre's Qualitative/Condition. Mapping not firing (create-time only? not wired on update?). |
| Comments (Private) | internal_comments | ✗ empty here — internal comments landed in the **Job › Comments** block instead, not the Property record. |
| Subtype · Region · Country · Market · Submarket | not collected on intake | n/a (expected empty) |
| Site / Improvements / Flood / Building metrics | appraiser-research, not from intake | n/a (expected empty) |

## Contacts › Client contact record  *(opened via "Authorized Client")*
What the flow sends to the **Client Contact** (createContact).
| Valcre Contact field | ← APR dashboard source | Status |
|---|---|---|
| Company | Client Organization | expected |
| First Name / Last Name | Client First / Last Name | expected |
| Address (Street / City / State / Postal) | Client Address (parsed) | expected |
| Phone | Client Phone | expected |
| Email | Client Email | expected |
| Title | Client Title | expected |

## Contacts › Property Contact record  *(only if it differs from the client)*
A SEPARATE contact is created when the property contact's name/email differs from the client.
| Valcre Contact field | ← APR dashboard source |
|---|---|
| Company / First / Last / Address / Phone / Email / Title | Property Contact fields (fallback to client if blank) |

> 🚩 **RED FLAG (2026-06-05) — Property Contact not landing in Valcre.** On VAL261101 the Job › General
> "Property Contact" slot is EMPTY ("ADD"). Root cause: the create-flow only creates/links a property
> contact **if it differs from the client** — and the test job's property contact is an exact clone of
> the client (same name + email: Edward Johnson), so the "differs" check fails and nothing syncs.
> TWO things are therefore unverified: (1) does the "differs" path actually fire, and (2) does the created
> contact LINK into the Job's Property Contact slot vs just floating in Contacts? Also note: property-contact
> creation appears to be **job-create-time only**, so it may not re-push onto an existing job.
> **Next:** set a DISTINCT property contact (property manager, own email) on the test job → verify it lands
> in the Valcre Property Contact slot. If it doesn't re-push on the existing job → wiring gap for react-spec
> (property-contact sync on update + slot-linking). Reminder on roles: **Authorized Client** = the intake-form
> submitter; **Property Contact** = the on-site contact (property manager/GM) — must be a different person.

> **To complete + confirm these three:** paste the live **Property record** (via the Subject Property
> link) and the **Client/Property Contact records** for VAL261101. I'll flip each "expected" row to ✓ /
> ✗ and flag any property/client field that should be there but isn't.

---

## Cross-check: how Chris's team actually fills Valcre (live job VAL261052)
Comparing a real Valta-filled job against our integration targets surfaced **field-target mismatches** —
where Chris populates a field our sync ignores, or uses a NATIVE field while we write a CUSTOM one.
*(One job = signal, not proof. Confirm the pattern with Chris before re-architecting — but these are strong.)*

- 🚩 **Report › Format — Chris FILLS it ("Appraisal Report"); we DON'T wire it.** Our dashboard "Report
  Format" was ruled LOE-only/not-wired — but Chris's real workflow puts it in Valcre. **Reverse the ruling:
  wire Report Type → Valcre Report › Format.** (Ben: "that's huge.")
- 🚩 **Report › Values (NATIVE) — Chris fills it** ("Prospective at Stabilization, Prospective at Completion,
  As-Vacant"). **We write Value Scenarios to CUSTOM fields (Valuation Premise 1/2), and Chris's custom
  fields are EMPTY.** Likely we're populating fields he doesn't use. **Reconcile:** should Value Scenarios
  go to the native **Values/RequestedValues** field (where Chris works) instead of / in addition to the
  custom Valuation Premise fields?
- ⚠ **ALL custom fields are EMPTY in Chris's job** (Valuation Premise, Transaction Status, Zoning, etc.).
  Our integration writes Transaction Status → CF12053 and Zoning → CF12054 — but if Chris works in native
  fields, our custom-field writes may be invisible to his workflow. **Confirm with Chris which fields he
  actually tracks** before assuming custom = correct.
- 🚩 **Scope — same field, wrong control type.** Valcre's **Scope** = our **"Scope of Work"** (same name,
  already wired). But Valcre's Scope is a **CHECKBOX multi-select** (confirmed on screen — tick as many as
  apply); ours is currently a **single-pick** dropdown. APR had a checkbox system before — **restore it.**
  Two parts: (a) make Scope of Work a multi-select checkbox; (b) **option parity** — Valcre's list is
  `All Applicable · Best One Approach · Best Two Approaches · Cost Approach · Direct Comparison Approach ·
  Discounted Cash Flow · Feasibility Study · Income Approach · Land (Residual) · Land (Subdivision) ·
  Land Value …`; ours is missing Best One Approach, Discounted Cash Flow, Feasibility Study, Land (Residual),
  Land (Subdivision). (c) sync must send ALL checked approaches to native `Job.Scopes` (currently sends one).
  *(VAL261101 currently has only "Income Approach" ticked in Valcre — matches our single sent value.)*
  Separately: our **"Approaches to Value"** field (combo options) overlaps this concept — clarify whether
  it's redundant with Scope of Work or genuinely distinct.
- ✓ **Property postal present in Chris's job** (T3B 2K2) — confirms ZIP/Postal IS a real used Valcre field,
  reinforcing our postal GAP above.
- ℹ **Property Contact empty in Chris's job too** — tempers the earlier red flag (often blank in practice),
  but the sync should still work when one IS entered.
- ℹ **Invoice Date** filled by Chris (2026-06-01); ours doesn't populate it.

---

## Dashboard fields that DO NOT go to Valcre
**LOE-contract-only** (live in the APR app + flow to the LOE, never Valcre): Report Format*, Assignment Type (held), CMHC Financing (no Valcre field), Desktop Report (phantom CF), the **Purpose text field** (Property Rights owns `Job.Purposes`, not this).
**Dashboard-only:** Lead Appraiser (Valcre Staff needs a real account).
**Internal tracking only** (neither Valcre nor LOE): Retainer Paid date, Amount Paid, Paid Date.
*Report Format has a Valcre "Format" slot — flagged above as a Ben decision.

## Bottom line
Everything the dashboard syncs to Valcre lands in **three** JOB-tab sections — **Dates** (3 dates),
**Report** (Authorized Use, Purpose, Analysis Level, Scope), and **Custom Fields** (Value Premises ×2,
Transaction Status, Zoning) — plus identity/financials set on create in **General** and notes in
**Comments**. All eight sync targets above are readback-verified on VAL261101. The HELD custom fields
are the next wiring wave; Format is a pending Ben decision.
