---
content_type: wiring-plan
status: draft
phase1_prep: true
ingest_proposed: true
ingested: false
tags: [apr-workflow, clickup, mirror-list, field-sync, one-way, dashboard, wiring-plan, APR]
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
created: 2026-06-19
author: qa-agent
related:
  - ~/Development/APR-Dashboard-v3/docs/FIELD-ROUTING-dashboard-clickup-loe.md
  - ~/Development/APR-Dashboard-v3/docs/DASHBOARD-FIELD-CATALOG.md
  - ~/Development/APR-Dashboard-v3/docs/VALTA-FIELD-SPEC.md
  - ~/Development/APR-Dashboard-v3/src/utils/webhooks/clickup.ts
---

> ⚠ **SUPERSEDED 2026-06-19** by [CLICKUP-MIRROR-SYNC-RECONCILIATION-FIX.md](~/Development/APR-Dashboard-v3/docs/CLICKUP-MIRROR-SYNC-RECONCILIATION-FIX.md).
> This doc assumed a from-scratch one-way build; the SS12 search proved the sync was already built + verified
> (2026-06-04). The real work is reconciliation, captured in the fix brief. Kept for history only.

# ClickUp Mirror — One-Way Wiring Plan (Dashboard → ClickUp)

`#clickup` `#mirror-list` `#one-way-sync` `#field-sync`

**Goal:** when a job is filled/edited in the APR Dashboard, its values sink into the
matching custom fields on the ClickUp **mirror** task. One direction only (dashboard is
the source of truth). Two-way (ClickUp → dashboard) is a separate later build — see the
companion two-way research brief.

> Built from a live walk-through of job VAL261101 "Westside Mall"
> (`/dashboard/job/e5a7ba2f-0535-4fbf-9ba7-b7027cf0a157`) via the Claude-in-Chrome bridge,
> 2026-06-19, cross-referenced against the same job in the ClickUp mirror list.

---

## 0. The two things that changed since the old routing doc

The existing `FIELD-ROUTING-dashboard-clickup-loe.md` maps the dashboard to the **old**
edge-function "rich card" on list `901703694310` (test) / `901402094744` (prod). The new
work is a **different target**:

- **New mirror list:** `901709622357` ("APR Test - Valta Mirror"), BC workspace `8555561`.
- **Reference mirror task:** `86e1yb8nz` ("VALTA JOBS - Temp V2") — carries the canonical **39 custom fields** in grouped order.
- The new model is field-level value sync into 39 named fields, **not** a markdown card body.

**Therefore the one-way build = repoint + remap**, not net-new from zero:
1. Point the sync at list `901709622357` and the 39 field IDs (pull IDs via the pk_ token: `GET api.clickup.com/api/v2/list/901709622357/field`).
2. Map each dashboard field → ClickUp field ID (table below).
3. Set values via the pk_ token (`POST .../task/{id}/field/{field_id}` — works on the public API, permanent, headless).

---

## 1. Join key — how a dashboard job finds its ClickUp task

**Open design point.** Options:
- **(A) Store `clickup_task_id` on the job record** (cleanest, no ambiguity). Set it when the task is first created, reuse on every update.
- **(B) Match on Job Number** (VAL261101) — natural key both sides hold, but requires a search and assumes uniqueness.

**Recommendation: (A)** — add a `clickup_task_id` column to `job_submissions`, populated at task-creation time. Avoids search + dup risk and is the hook two-way will need anyway.

---

## 2. Field map — Dashboard → 39 ClickUp mirror fields

Legend: ✅ clean source · ⚙ derived/converted · ⚠ no clean dashboard source (stays manual or two-way later)

### Dates
| ClickUp field | Dashboard source | Notes |
|---|---|---|
| Received Date | Request Date | confirm semantics (request vs received) |
| LOE Sent | ⚠ | no dashboard field seen — from DocuSeal send event? |
| LOE Signed | Signed Date | from DocuSeal webhook |
| Delivery Date | Delivery Date | ✅ |

### Job
| ClickUp field | Dashboard source | Notes |
|---|---|---|
| APR Dashboard Link | (job URL) | ⚙ construct from job UUID |
| Valcre Job | Valcre job ref | ⚙ from Valcre integration |
| Job Number | Job Number | ✅ |

### Client
| ClickUp field | Dashboard source | Notes |
|---|---|---|
| Client Full Name | Client First + Last | ⚙ concat |
| Client Email | Client Email | ✅ |
| Client Phone | Client Phone | ✅ |
| Client Organization | Organization | ✅ |

### Property
| ClickUp field | Dashboard source | Notes |
|---|---|---|
| Property Name | Property Name | ✅ |
| Property Address | Property Street Address (+ city/prov/postal) | ⚙ compose |
| Property Type | Property Type | ✅ |
| Status of Improvements | Status of Improvements | ✅ |

### Contact
| ClickUp field | Dashboard source | Notes |
|---|---|---|
| (Contact name/email/phone) | Property Contact First/Last/Email/Phone | ✅ confirm exact ClickUp field names |

### Appraisal Scope
| ClickUp field | Dashboard source | Notes |
|---|---|---|
| Approaches To Value | Approaches to Value | ✅ (cascade output) |
| Value Scenario(s) | Value Scenarios | ✅ (cascade output) |
| Report Type | Report Type | ✅ |
| Inspection Date | ⚠ | no dashboard field seen |

### Site / Transaction
| ClickUp field | Dashboard source | Notes |
|---|---|---|
| Transaction Status | Transaction Status | ✅ |
| Zoning Status | Zoning Status | ✅ |
| Land $/Metric | ⚠ | no dashboard field seen |

### Team & Workflow
| ClickUp field | Dashboard source | Notes |
|---|---|---|
| Phase Owner | ⚠ | appraiser-side, likely ClickUp-owned |
| Work Phase | Job Status | ⚙ map dashboard status → work-phase value |
| Client Info Received | ⚠ checkbox | workflow flag — ClickUp-owned or two-way |
| Invoice Paid | Amount Paid / Paid Date | ⚙ derive boolean (paid? ) |
| TTSZ Done | ⚠ checkbox | ClickUp-owned |
| Template Saved | ⚠ checkbox | ClickUp-owned |
| Photos Saved | ⚠ checkbox | ClickUp-owned |
| Comps Provided | ⚠ checkbox | ClickUp-owned |

### Notes
| ClickUp field | Dashboard source | Notes |
|---|---|---|
| Notes | Comments — General (+ Delivery/Payment?) | ⚙ compose |
| Task Type | ⚠ | trailing field, outside planned groups — confirm purpose / drop |

---

## 3. Dashboard fields with no ClickUp target (carried on job only)
Client Title, Client/Org Address, Purpose, Property Subtype, Tenancy, Property Rights,
Value Timeframe, Scope of Work, Report Format, Assignment Type, Analysis Level,
Appraisal Fee, Retainer Amount, Payment Terms, Retainer Paid, Effective Date,
Delivery Time (wks), Current Use, Proposed Use, CMHC Financing, Client Documents,
Previously Appraised, Section 10 write-ups (cascade narrative). — Confirm none of these
*should* be on the mirror before finalizing.

---

## 4. Push architecture (recommended)

- **Trigger:** Supabase — on `job_submissions` insert/update, fire an edge function
  (or call from the existing dashboard save path) that pushes mapped values to ClickUp.
- **Auth:** pk_ token on public `api.clickup.com` (set field values). Permanent, no browser.
- **Idempotent:** upsert by `clickup_task_id`; create the task if absent, else update fields.
- **Value conversions:** dropdowns → match ClickUp option ids; dates → epoch ms; checkboxes → bool.
- **Verify:** after push, the QA loop reads the field back in ClickUp via the bridge (four-layer).

### Leave-in-place for two-way (so it layers cleanly later)
- `clickup_task_id` column (the join hook).
- `updated_at` / last-sync timestamp per record.
- A `sync_source` marker on writes to prevent echo loops when the reverse leg is added.

---

## 5. Open questions for Ben / build
1. Join key — confirm option (A) store `clickup_task_id`.
2. The ⚠ fields with no dashboard source — leave manual in ClickUp, or are some meant to come from the dashboard?
3. "Task Type" trailing field — keep or drop?
4. Section 10 cascade write-ups — do they belong on the mirror at all, or stay dashboard/contract-only?
5. Confirm the exact ClickUp field IDs + dropdown option IDs (pull via pk_ token at build time).

---

*Authored 2026-06-19 by qa-agent from a live Chrome-bridge walk of both apps. One-way only;
two-way is a separate brief.*
