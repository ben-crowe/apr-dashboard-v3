---
title: Proposed Section Re-Sort — Job-Detail Fields
status: proposal-draft
created: 2026-06-09
updated: 2026-06-09
last_reviewed: 2026-06-09
description: Plan to agree before any HTML change — re-sorts job-detail fields between sections by one test ("Does this field need to be filled to CREATE the LOE?"). Two-column dashboard-style layout with group breaks. No HTML changed yet.
tags: [apr-workflow, field-registry, dashboard, loe, section-resort, proposal]
entities: [[LOE Quote Section]], [[Master Field Registry]], [[APR Dashboard]]
related: [~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/EXTRACTED-FIELD-REGISTRY-dashboard.md, ~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/JOB-DETAIL-FIELD-AUDIT-2026-06-09.md]
---

# Proposed Section Re-Sort — Job-Detail Fields

**Tags:** #apr-workflow #field-registry #loe #section-resort #proposal
**Entities:** [[LOE Quote Section]] [[Master Field Registry]] [[APR Dashboard]]

[🏠 Home](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md)

> **PLAN to agree — no HTML changed yet.** Fields laid out two-column like the dashboard, broken into groups so we can see how they cluster and name each group. Move any field, rename any group.

**The one test:** *does this field need to be filled to CREATE the LOE?* — **yes** → Section 2 (the LOE gate) · **no** → Section 3+ (after the LOE is sent).

**Markers:** moved up into Section 2 · moved down · ~~strikethrough~~ = delete · `⚑` your call.

> **Where does each field go?** Field names below are clean — the routing (Valcre / ClickUp / derived / GAP / etc.) lives in the [Field Reference Table](#field-reference-table) just before the recap. Layout numbers (1.1, 2.4, …) are the rail handles that key each row.

---

## Section 1 — Client Information & Property Details

**Client Information**

| | |
|---|---|
| First Name | Last Name |
| Title | Organization |
| Phone | Email |
| Address | |

**Property Information**

| | |
|---|---|
| Property Name | Property Type |
| Property Address | Authorized Use |
| Valuation Premises | Asset Condition |

**Property Contact**

| | |
|---|---|
| First Name | Last Name |
| Email | Phone |

**Client Comments**

| | |
|---|---|
| Comments | |

---

## Section 2 — LOE Quote & Valuation Details  ·  *the LOE gate*

_Group names = the LOE contract's own section names (this section fills the contract). Where each field routes is in the [Field Reference Table](#field-reference-table)._

**Action row** *(top)* — **View in Valcre** · **View in ClickUp** · **Preview & Send LOE** (all plain whitish buttons; arrows only on the two "view" links) · **Test Data — version picker** (a mini-dropdown of the four cascade versions: V1 Completed · V2 Under Renovation · V3 Improved Land/Demolition · V4 Insurance override — picking one fills the cascade fields for that scenario, so you can see how the LOE generates before printing).

**Job Info**

| | |
|---|---|
| Job Number | Job Status |

_(ClickUp moved up to a "View in ClickUp" button in the action row. Lead Appraiser — held off, candidate to remove; see recap.)_

**Purpose of the Assignment**  *(LOE §4)*

| | |
|---|---|
| Purpose | |

**Value Scenarios & Approaches**  *(LOE §5 · §9 · §10 Assumptions & Conditions)*

| | |
|---|---|
| Status of Improvements | Value Scenarios |
| Property Subtype | Tenancy |
| Property Rights | Approaches to Value |
| Value Timeframe | |

**Scope of Work**  *(LOE §8)*

| | |
|---|---|
| Scope of Work | |

**Report Type & Assignment Type**  *(LOE §7)*

| | |
|---|---|
| Report Type | Report Format |
| Assignment Type | Analysis Level |

**Fees & Terms**  *(LOE §11)*

| | |
|---|---|
| Appraisal Fee | Retainer Amount |
| Payment Terms | |

**Effective Date & Report Date**  *(LOE §6)*

| | |
|---|---|
| Effective Date | Request Date |
| Delivery Date | Delivery Time (wks) |

**Property Information Request**  *(LOE §12)*

| | |
|---|---|
| Client Documents | Previously Appraised |

**Property Use & Other**  *(feeds LOE §2 / job data)*

| | |
|---|---|
| Current Use | Proposed Use |
| CMHC Financing | Transaction Status |
| Zoning Status | |

**Notes**  *(two for now — final names TBD by client)*

| | |
|---|---|
| General 1 | General 2 |

---

## Section 3 — Building Information  ·  *after the LOE*

**Building Information**

| | |
|---|---|
| Year Built | Building Size (SF) |
| Number of Units | Parking Spaces |
| State of Improvements | Land Metric |
| Env. Assessment | Heritage / Conserv. |

**Legal Description**

| | |
|---|---|
| Description | |

---

## Section 4 — Data Gathering – Property Research  ·  *after the LOE*

_(the old "Appraisal Assignment" group is gone — those fields moved up to Section 2)_

**Property Site**

| | |
|---|---|
| Zoning | Zone Code |
| Land Use | Flood Zone |
| Utilities | |

**Parcels Summary**

| | |
|---|---|
| Parcel Number | Gross Building Area |
| Net Rentable Area | Year Built |
| Buildable Land | Total Site Area |
| Assessed Value | Taxes |

**Assessments & Taxes**

| | |
|---|---|
| Assessment Year | Land Value |
| Land Split | Improved Value |
| Total Value | Building Split |

---

## Section 5 — Document Upload & Organization  ·  *after the LOE*

| | |
|---|---|
| Land Title Certificate | Survey / RPR |
| Tax Assessment Notice | Aerial Photo |
| Zoning Map | Flood Map |
| Building Permits | Site Plan |

---

## NEW — Closing & Payment  ·  *after signature*

_(moved down — these only exist once the LOE is signed; future QuickBooks closing flow)_

| | |
|---|---|
| Retainer Paid | Amount Paid |
| Paid Date | Signed Date |

---

## Field Reference Table

One clean row per field, every field, all six sections in number order. The **#** (layout number) is the rail handle. **Role**, **Comes from**, **Goes to**, and **Notes** are pulled from the audit + extracted-registry docs. *(No registry-# column — the client registry keys fields by option-list names, e.g. `ListCurrentUseImprovements`, not clean per-field IDs, so the layout number is the handle.)*

| # | Field | Role | Comes from | Goes to | Notes |
|---|---|---|---|---|---|
| 1.1 | First Name | FREE-TEXT | client form | — | |
| 1.2 | Last Name | FREE-TEXT | client form | — | |
| 1.3 | Title | FREE-TEXT | client form | — | |
| 1.4 | Organization | FREE-TEXT | client form | — | |
| 1.5 | Phone | FREE-TEXT | client form | — | |
| 1.6 | Email | FREE-TEXT | client form | — | |
| 1.7 | Address | FREE-TEXT | client form | — | |
| 1.8 | Property Name | FREE-TEXT | User Input | Valcre (Property record) | |
| 1.9 | Property Type | INPUT | User Input | Valcre (Property Type) | app list (16) ≠ client list (9) — option mismatch flagged; breaks Property Rights cascade |
| 1.10 | Property Address | FREE-TEXT | User Input | Valcre (Property record) | no property postal collected (gap) |
| 1.11 | Authorized Use | INPUT | User Input | Valcre (Job.IntendedUses) | Insurance overrides the Value-Scenarios cascade |
| 1.12 | Valuation Premises | INPUT | User Input | internal | DISTINCT from Value Scenarios — do NOT merge |
| 1.13 | Asset Condition | INPUT | User Input | internal | |
| 1.14 | Contact First Name | FREE-TEXT | User Input | Valcre (Property Contact) | only if differs from client |
| 1.15 | Contact Last Name | FREE-TEXT | User Input | Valcre (Property Contact) | only if differs from client |
| 1.16 | Contact Email | FREE-TEXT | User Input | Valcre (Property Contact) | only if differs from client |
| 1.17 | Contact Phone | FREE-TEXT | User Input | Valcre (Property Contact) | only if differs from client |
| 1.18 | Client Comments | FREE-TEXT | client form | — | |
| 2.1 | Job Number | FREE-TEXT | Valcre API | Valcre | |
| 2.2 | Job Status | INPUT | User Input | internal | stage tracker; free-text today (no options defined) — registry maps to Valcre Status enum, not yet wired |
| 2.3 | Purpose | FREE-TEXT | User Input | LOE §4 | does NOT go to Valcre (Property Rights feeds Valcre's Purpose) |
| 2.4 | Status of Improvements | INPUT | User Input | internal | cascade TRIGGER; moved up from Building Info |
| 2.5 | Value Scenarios | DERIVED | Logic (from Status of Improvements; Insurance override) | Valcre (Valuation Premise 1/2) | cascade outcome; cascade not yet wired to live display |
| 2.6 | Property Subtype | INPUT | User Input | internal | moved up |
| 2.7 | Tenancy | INPUT | User Input | internal | moved up; app list (4) ≠ client list (6) — option mismatch |
| 2.8 | Property Rights | DERIVED | Logic (from Property Type / Subtype / Tenancy) | Valcre (Job.Purposes) · ClickUp | cascade outcome; rendered as manual multi-select today — should auto-set |
| 2.9 | Approaches to Value | DERIVED | Logic (from Value Scenarios) | internal | was free-text in old LOE section — fix to derived control |
| 2.10 | Value Timeframe | INPUT | User Input | internal | moved up |
| 2.11 | Scope of Work | INPUT | User Input | Valcre · ClickUp | single-pick today; Valcre treats as checkbox |
| 2.12 | Report Type | INPUT | User Input | Valcre · ClickUp | separate concept from 2.13 (naming swap — see 2.13) |
| 2.13 | Report Format | INPUT | User Input | — | the field the client registry calls "Report Type" (naming swap); not wired to Valcre (held) |
| 2.14 | Assignment Type | INPUT | User Input | — | not wired to Valcre (held — concept clash); canonical set, stale Data-Gathering copy removed |
| 2.15 | Analysis Level | INPUT | User Input | Valcre | |
| 2.16 | Appraisal Fee | FREE-TEXT | Calculated | Valcre (Fee) | currency |
| 2.17 | Retainer Amount | FREE-TEXT | User Input | Valcre (Retainer) | currency; no registry row — app-added internal tracking |
| 2.18 | Payment Terms | INPUT | User Input | Valcre (Comments, appended) | |
| 2.19 | Effective Date | FREE-TEXT | User Input | Valcre | |
| 2.20 | Request Date | FREE-TEXT | User Input | internal | |
| 2.21 | Delivery Date | FREE-TEXT | User Input | Valcre (Due Date) | |
| 2.22 | Delivery Time (wks) | FREE-TEXT | User Input | — | whole number; optional small INPUT later |
| 2.23 | Client Documents | INPUT | User Input | internal | |
| 2.24 | Previously Appraised | INPUT | User Input | internal | |
| 2.25 | Current Use | INPUT | User Input | internal | free-text GAP — client registry HAS option list (`ListCurrentUseImprovements`); app renders text |
| 2.26 | Proposed Use | INPUT | User Input | internal | free-text GAP — client registry HAS option list (`ListProposedUseImprovements`); app renders text |
| 2.27 | CMHC Financing | INPUT | User Input | internal | Yes / No |
| 2.28 | Transaction Status | INPUT | User Input | Valcre | canonical set — stale Data-Gathering duplicate removed |
| 2.29 | Zoning Status | INPUT | User Input | Valcre | canonical set — stale Data-Gathering duplicate removed |
| 2.30 | General 1 | FREE-TEXT | User Input | — | note slot, final name TBD by client |
| 2.31 | General 2 | FREE-TEXT | User Input | — | note slot, final name TBD by client |
| 3.1 | Year Built | FREE-TEXT | User Input | internal | numeric |
| 3.2 | Building Size (SF) | FREE-TEXT | User Input | internal | numeric |
| 3.3 | Number of Units | FREE-TEXT | User Input | internal | numeric |
| 3.4 | Parking Spaces | FREE-TEXT | User Input | internal | numeric |
| 3.5 | State of Improvements | INPUT | User Input | internal | app set (3) ≠ client set (4) — option mismatch |
| 3.6 | Land Metric | INPUT | User Input | internal | |
| 3.7 | Env. Assessment | FREE-TEXT | User Input | internal | |
| 3.8 | Heritage / Conserv. | FREE-TEXT | User Input | internal | |
| 3.9 | Legal Description | FREE-TEXT | User Input | internal | |
| 4.1 | Zoning | FREE-TEXT | User Input | internal | jurisdiction-specific |
| 4.2 | Zone Code | FREE-TEXT | User Input | internal | |
| 4.3 | Land Use | FREE-TEXT | User Input | internal | |
| 4.4 | Flood Zone | FREE-TEXT | User Input | internal | free-text today; candidate INPUT (FEMA fixed set) — confirm with Chris |
| 4.5 | Utilities | FREE-TEXT | User Input | internal | |
| 4.6 | Parcel Number | FREE-TEXT | User Input | internal | |
| 4.7 | Gross Building Area | FREE-TEXT | User Input | internal | numeric |
| 4.8 | Net Rentable Area | FREE-TEXT | User Input | internal | numeric |
| 4.9 | Year Built | FREE-TEXT | User Input | internal | research copy |
| 4.10 | Buildable Land | FREE-TEXT | User Input | internal | numeric |
| 4.11 | Total Site Area | FREE-TEXT | User Input | internal | numeric |
| 4.12 | Assessed Value | FREE-TEXT | User Input | internal | currency |
| 4.13 | Taxes | FREE-TEXT | User Input | internal | currency |
| 4.14 | Assessment Year | FREE-TEXT | User Input | internal | |
| 4.15 | Land Value | FREE-TEXT | User Input | internal | currency |
| 4.16 | Land Split | FREE-TEXT | User Input | internal | |
| 4.17 | Improved Value | FREE-TEXT | User Input | internal | currency |
| 4.18 | Total Value | FREE-TEXT | User Input | internal | currency |
| 4.19 | Building Split | FREE-TEXT | User Input | internal | |
| 5.1 | Land Title Certificate | — | file upload | internal | |
| 5.2 | Survey / RPR | — | file upload | internal | |
| 5.3 | Tax Assessment Notice | — | file upload | internal | |
| 5.4 | Aerial Photo | — | file upload | internal | |
| 5.5 | Zoning Map | — | file upload | internal | |
| 5.6 | Flood Map | — | file upload | internal | |
| 5.7 | Building Permits | — | file upload | internal | |
| 5.8 | Site Plan | — | file upload | internal | |
| 6.1 | Retainer Paid | FREE-TEXT | User Input | internal | moved down — only exists after signing |
| 6.2 | Amount Paid | FREE-TEXT | Logic (derived) | internal | moved down — only exists after signing |
| 6.3 | Paid Date | FREE-TEXT | Logic (derived) | internal | moved down — only exists after signing |
| 6.4 | Signed Date | FREE-TEXT | Logic (DocuSeal signature) | internal | moved down — only exists after signing |

---

## What moved (quick recap)

- **Up into Section 2:** Status of Improvements, Property Subtype, Tenancy, Value Timeframe.
- **Down to Closing & Payment:** Retainer Paid, Amount Paid, Paid Date, Signed Date.
- **Deleted:** Desktop Report (client said remove) + the Data-Gathering "Appraisal Assignment" duplicate group (Assignment Type, Approaches, Transaction Status, Zoning Status — stale copies of Section 2).
- **Removed — LOE Version picker:** only one option exists, so the picker is confusing noise. Remove it from the dashboard too (the app just uses the single template).
- **Moved to Job Info (top):** Job Status (stage tracker, by the Valcre/ClickUp buttons).
- **Lead Appraiser — held off for now:** not in the build, candidate to remove. Added only because the client's sheet had it; no clear reason. Kept on the plan so we don't lose it.
- **Notes trimmed:** three note fields → two generic slots (General 1, General 2 — final names TBD by client).

> Shuffle fields between the two columns or between groups, rename any group, and once it reads right this becomes the proposed layer in the HTML → then the live dashboard.

---

## ⭐ Open Items — the fields actually in question (decide these before we touch code)

These are the specific things co-architect flagged when cross-checking the mock against the live Valcre sync. Listed plainly so nothing's buried. **No field gets deleted or rewired until the four 🔴 blockers are answered.**

### 🔴 Must verify in code FIRST (could break the live Valcre sync)

| # | Field | The question | Why it matters |
|---|---|---|---|
| 1 | **Zoning Status** + **Transaction Status** | Which copy actually feeds Valcre — the clean Section 2 one, or the stale-looking Data-Gathering one we want to delete? | The live readback shows Valcre pulling the Data-Gathering value. If we delete that copy before re-pointing, the sync breaks. Confirm the wiring, then delete. |
| 2 | **Assignment Type** | Is this one field or two? Section 2 says Single/Multiple Property; Data-Gathering says Standard/Update/Retrospective/Desktop. | Those may be two genuinely different things crammed into one database column — not a stale duplicate. If so they each need their own column, not a delete. |
| 3 | **Approaches to Value** vs **Scope of Work** | Are these redundant, or genuinely separate? | We treat them as separate (Scope = you pick it, Approaches = auto-derived). Needs a yes/no from you or Chris before we finalize the layout. |
| 4 | **Property Type** + **Tenancy** | App's option lists don't match the client registry's (different names, missing entries). | The cascade matches on exact text — mismatched names mean Property Rights silently never auto-fills. Align the lists to the client's. |

### 🟡 Decisions for you / Chris (not code blockers)

| Field | The question |
|---|---|
| **Current Use** / **Proposed Use** | The client registry already has dropdown lists for these, but the app shows a blank text box. Wire the dropdowns — confirm that's what you want. |
| **Job Status** | **DECIDED (Ben 2026-06-10): NOT a dropdown, NOT human-entered.** It auto-changes by workflow stage (New/Received → LOE Sent → Signed → Job in Progress), driven by actions not yet wired. For now: display **locked/italic** (computed-field look) with a hover "?" explaining *"Auto-set by job stage; triggers not connected yet."* Same family as Value Scenarios (self-computing), just stage-driven. Supersedes the earlier "make it a dropdown" note. |
| **Purpose (2.3)** | **Orphan field** — it's a free-text box the test-fill populates, but Purpose does NOT feed Valcre (Property Rights → Job.Purposes owns that). So it's a typed box that goes nowhere. Decide: give it a real dropdown + destination, or reconsider keeping it. |
| **Flood Zone** | Free text today. FEMA zones are a fixed list — make it a dropdown? Confirm with Chris. |
| **Report Type** vs **Report Format** | The client's sheet calls "Report Type" what our app calls "Report Format." Naming swap to reconcile so we both mean the same thing. |
| **Lead Appraiser** | Not in the client registry at all — no clear reason it's there. Keep or remove? |
| **General 1 / General 2** | The two note slots — client still needs to give final names. |

### ✅ Already decided (no action needed — just don't re-open)

| Field | Decision |
|---|---|
| **Desktop Report** | Client said remove it. Deleted. |
| **Purpose** | It does NOT feed Valcre (Property Rights feeds Valcre's purpose instead). Earlier note saying it was a gap was wrong — corrected. |
| **Authorized Use** | Also a duplicate (Client Intake + Job-Prep). Canonical = Client Intake; remove the Job-Prep copy. |
| **Valuation Premise** vs **Value Scenarios** | Confirmed DIFFERENT things — do NOT merge them. |
| **Scope of Work** | Becomes a multi-select checkbox (Valcre treats it as a checkbox), not a single pick. |

### 🔧 Pending layout tweaks (Ben, 2026-06-10) — bundle with the lower-sections pass

| Tweak | Detail |
|---|---|
| **Move ClickUp Task button up** | Bring the "Create ClickUp Task" button up to sit with the other action buttons — three buttons together in one row. |
| **Job Number + Job Status side by side** | Currently stacked one on top of the other; put them on the same row, side by side. |

### 🧪 Test-data tool behavior (Ben, 2026-06-10) — the live Fill/Cascade port rules

**1. Test tools disable on a real Valcre job.** Once a job has a real synced Valcre job number,
the top **Fill Test Data** button AND the **Cascade Options** picker go **inactive but still
visible** (greyed). Clicking a disabled one shows a reason: *"Not available — this job is connected
to a live Valcre job."* Rationale: those fields auto-sync to Valcre, so an accidental click could
mass-overwrite the real job. Do NOT change auto-sync — only gate the test tools. (Gate = presence of
a real Valcre job number; no formal "test mode" toggle needed. Future: may remove test buttons
entirely.)

**2. Locking is a RESULT of picking, never the default.** Default state = every field editable,
nothing locked, picker idle. A derived field shows **locked only the moment a cascade scenario is
actually picked**, and only for fields that genuinely derive (today: **Value Scenarios only** —
Property Rights + Approaches do NOT auto-compute live, so they stay editable). A user who skips the
picker fills everything by hand normally. Optional: a hover "?" on logic fields explaining
"computed from the situation you pick."

---

**Last reviewed:** 2026-06-09 by ui-designer — added "Open Items" section at the bottom: the exact fields in question pulled out of co-architect's cross-check (4 code-verify blockers, 6 decisions for Ben/Chris, 5 already-decided), so nothing stays buried in the audit. Prior: documentation-engineer added the Field Reference Table.
