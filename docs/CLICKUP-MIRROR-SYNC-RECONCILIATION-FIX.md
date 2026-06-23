---
content_type: fix-brief
status: ready-for-build
tags: [apr-workflow, clickup, mirror-list, field-sync, reconciliation, resolver, one-way, APR]
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
created: 2026-06-19
author: qa-agent
supersedes: ~/Development/APR-Dashboard-v3/docs/CLICKUP-MIRROR-ONEWAY-WIRING-PLAN.md
grounds_on:
  - ~/Development/APR-Dashboard-v3/supabase/functions/_shared/clickup-fields.ts
  - ~/Development/APR-Dashboard-v3/Data-Flow Visuals/04-CLICKUP-CUSTOMFIELD-SYNC-RESULT.md
  - ~/Development/APR-Dashboard-v3/docs/APR-DATA-FLOW-GROUND-TRUTH-2026-06-18.md
  - live browser walk of mirror task 86e1yb8nz (list 901709622357), 2026-06-19
---

# ClickUp Mirror — Sync Reconciliation Fix Brief

`#clickup` `#field-sync` `#reconciliation` `#resolver`

**The build is NOT new.** Dashboard → ClickUp custom-field sync was built + verified end-to-end
2026-06-04 (see 04-CLICKUP-CUSTOMFIELD-SYNC-RESULT.md). Two edge functions (`create-clickup-task`,
`update-clickup-task`) share the dynamic byName resolver `clickup-fields.ts`, already pointed at the
mirror list `901709622357` via secret `CLICKUP_LIST_ID`.

**What broke it:** the mirror was rebuilt to the full 39 client fields (checkpoint #149, 2026-06-19)
with the client's REAL registry names — AFTER the sync was verified. The resolver matches fields by
exact name and skips any miss silently, so renamed/culled fields quietly stopped syncing.

## ⛔ Governing rule (Ben, 2026-06-19) — the client's list is the source of truth
- The ClickUp mirror's fields + dropdown options ARE the client's intended set. **Do NOT add fields,
  checkboxes, or dropdown options to ClickUp to match the dashboard's larger set.**
- **Do NOT change the dashboard** — it intentionally carries more options/versions than any one client needs.
- The job is one-directional mapping: land each dashboard value onto an *existing* ClickUp option.
  A dashboard value with no matching option simply does not sync — that is BY DESIGN, flag it, never invent the option.

---

## Authoritative live field list — mirror task 86e1yb8nz (39 fields, in order)
Dates: Received Date · LOE Sent · LOE Signed · Delivery Date
Links/Job: APR Dashboard Link · Valcre Job · Job Number
Client: Client Full Name · Client Email · Client Phone · Client Organization
Property: Property Name · Property Address · Property Type
Contact: Contact Name · Contact Email · Contact Phone
Scope: Property Subtype · Interest Appraised · Authorized Use · State of Improvements · Status of Improvements · Approaches To Value · Value Scenario(s) · Report Type · Inspection Date
Site/Txn: Transaction Status · Zoning Status · Land $/Metric
Team/Workflow: Phase Owner · Work Phase · Client Info Received · Invoice Paid · TTSZ Done · Template Saved · Photos Saved · Comps Provided
Notes: Notes · Task Type

---

## A. PLUMBING FIXES (clearly broken — just fix; no client decision)
Edit `hubValueMap` keys in `clickup-fields.ts` to match the live names:

| Resolver sends now | Live field name | Fix |
|---|---|---|
| `Valcre Job Link` | **Valcre Job** | rename key |
| `Client First Name` + `Client Last Name` | **Client Full Name** | replace the two keys with one; value = `first + ' ' + last` (trimmed) |
| `Intended Use` | **Authorized Use** | rename key (keep source `authorized_use`) |
| `Property Rights Appraised` | **Interest Appraised** | rename key (keep source `property_rights_appraised`) |
| `Scope of Work` | (not on mirror) | **REMOVE from map** — Ben confirmed 2026-06-19, client did not keep it |
| `Payment Terms` | (not on mirror) | **REMOVE from map** — Ben confirmed 2026-06-19 |
| `Appraisal Fee` | (not on mirror) | **REMOVE from map** — Ben confirmed 2026-06-19 |

Plus the date-column bug (verification finding #2):
- `hubValueMap` reads `loe.loe_sent_at` and `loe.signed_at`; those columns do not exist on
  `job_loe_details`. Now live-relevant (LOE Sent / LOE Signed are on the mirror). Reconcile the column
  names with the actual schema (check docuseal-webhook for what it actually stamps) so the dates populate.

## B. CLIENT FIELDS THE DASHBOARD CAN FEED (add to the resolver value map)
These are on the client's list (they want them) and the dashboard has a clean source — add to `hubValueMap`:

| Live field | Dashboard source |
|---|---|
| Client Phone | `job.client_phone` (phone-encode already handled) |
| Contact Name | property-contact first + last |
| Contact Email | property-contact email |
| Contact Phone | property-contact phone |
| Property Subtype | `job_property_info` subtype |
| Approaches To Value | cascade output (`loe`) |
| Value Scenario(s) | cascade output (`loe`) |
| Transaction Status | dashboard Transaction Status |
| Zoning Status | dashboard Zoning Status |
| Status of Improvements | `loe` (cascade input) |
| State of Improvements | `job_property_info.state_of_improvements` (distinct field — Existing/Proposed/Vacant Land) |

> Forward-PUSH of the cascade outputs (Approaches To Value, Value Scenarios) is fine and wanted.
> NOTE for the future two-way leg: these must NEVER sync *back* from ClickUp (dashboard re-derives them).

## C. FLAGS — confirm with Ben before coding
1. ~~"State of Improvements" vs "Status of Improvements"~~ — RESOLVED 2026-06-19: verified in source, these are
   two DISTINCT fields (Status = cascade input on `loe`; State = property field on `job_property_info`, options
   Existing/Proposed/Vacant Land). Both real, both sync. NOT a duplicate. Moved both into section B.
2. **Inspection Date** — on the client list; is there a dashboard source? (Not seen in the job walk.) If none, leave manual.
3. **Notes** — client kept it; dashboard has Comments/General. Push it or leave manual?
4. **Land $/Metric, Phase Owner, Work Phase, the 6 workflow checkboxes, Task Type** — no dashboard source;
   client/team fills manually. LEAVE as-is (per governing rule).

## D. DROPDOWN OPTION ALIGNMENT (map onto theirs; never expand)
The resolver already does fuzzy matching (exact → prefix → reverse-prefix → word-overlap), then SKIPS on miss.
For each synced dropdown (Property Type, Report Type, Interest Appraised, Authorized Use, Transaction Status,
Zoning Status, Property Subtype), confirm the dashboard's emitted value lands on an existing ClickUp option.
- Known miss from verification: Report Type dashboard value "Appraisal Report" had no matching option.
- Where a real, always-filled value has no option: FLAG to Ben (client may need that one option) — do NOT add it unilaterally.

## E. VERIFICATION (qa-agent, after react-spec ships)
For test job VAL261101 (Westside Mall, task 86e1qnwr6): null the task id → fire create → read each field back
in Chrome (the bridge) AND via API → confirm every A+B field lands in its typed slot, edits replace in place,
zero duplicate cards. Four-layer: API response · DOM (browser) · ClickUp readback · resolver source.

---

## Cleanup carried over (from verification doc)
- `QA_PROBE_DELETE_ME` leftover test field on the mirror — needs manual delete in ClickUp UI (API can't, 405).
- Stale demo card `86e1qn375 "(FIELDS DEMO)"` — archive so the board shows one clean hub card.
- `verified` undercounts dropdowns (cosmetic) — compare orderindex↔id before counting.

*Authored 2026-06-19 by qa-agent. Grounded via SS12 + live Chrome-bridge walk + resolver source read.
Supersedes CLICKUP-MIRROR-ONEWAY-WIRING-PLAN.md (which wrongly assumed a from-scratch build).*
