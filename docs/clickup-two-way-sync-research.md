---
id: clickup-two-way-sync-research
title: "ClickUp ⇄ APR Dashboard — Two-Way (Reverse) Sync Research Brief"
status: draft-for-later
type: research / build-ready spec
author: apr-domain-agent
created: 2026-06-19
direction: REVERSE — ClickUp custom-field change → write back into the dashboard (Supabase)
prerequisite: one-way push (dashboard → ClickUp) is being built first; this layers on top
sources:
  - docs/APR-DATA-FLOW-GROUND-TRUTH-2026-06-18.md  (code-traced data flow)
  - docs/FIELD-ROUTING-dashboard-clickup-loe.md     (field routing)
  - supabase/functions/_shared/clickup-fields.ts    (authoritative push field map, byName resolver)
  - supabase/functions/update-clickup-task/index.ts (Stage-2 push handler)
  - supabase/functions/docuseal-webhook/index.ts    (precedent: inbound webhook receiver pattern)
  - src/integrations/supabase/types.ts              (column names, both tables)
tags: [apr, clickup, two-way-sync, reverse-sync, webhook, supabase, edge-function, field-mapping]
---

# ClickUp → APR Dashboard (Reverse / Two-Way) Sync — Research Brief

> **Scope.** One-way (dashboard → ClickUp) is being built now. This document specifies the **reverse leg only** — a ClickUp custom-field edit flowing back into the dashboard's Supabase tables. Keep on file; build later. The headline finding: **two-way is purely additive on top of one-way IF the one-way build leaves three small hooks in place** (Section 10). Nothing about the reverse leg requires re-architecting the push.

---

## 0. The ground truth this builds on

A "job" in the dashboard is **a `job_submissions` row** plus a 1:1 `job_loe_details` row (keyed on `job_id`). The 39 ClickUp mirror fields are sourced from BOTH tables (client/property identity from `job_submissions`; LOE quote + dates from `job_loe_details`). The push side already resolves every field **byName** against the live list definitions and **type-encodes** each value (`_shared/clickup-fields.ts`). The reverse leg is the mirror image of that resolver: ClickUp field id → field name → dashboard column → typed write.

Two existing inbound edge functions (`docuseal-webhook`, `qbo-webhook`) are the architectural precedent — service-role Supabase client, `Deno.serve`, JSON payload, returns 200. The ClickUp receiver follows the same shape.

---

## 1. ClickUp webhooks — events, payload, subscription, auth

### 1.1 The event we need
ClickUp webhooks support a `taskUpdated` event family. Custom-field value changes fire **`taskUpdated`** with a `history_items` array describing what changed. There is no dedicated "customFieldValueUpdated" event on the public v2 webhook API — custom-field edits arrive **inside `taskUpdated`** as a history item whose `field` is `"custom_field"` and whose `custom_field` object carries the field id + before/after.

Relevant events to subscribe to:
- `taskUpdated` — the workhorse; carries custom-field changes in `history_items`.
- (optional) `taskStatusUpdated` — if the dashboard ever wants ClickUp status → `job_submissions.status`.

### 1.2 Payload shape (taskUpdated, custom-field change)
```jsonc
{
  "webhook_id": "…",
  "event": "taskUpdated",
  "task_id": "86e1yb8nz",
  "history_items": [
    {
      "id": "…",
      "type": 1,
      "date": "1718800000000",
      "field": "custom_field",
      "user": { "id": 10791838, "username": "…", "email": "…" },
      "custom_field": {
        "id": "<clickup-field-uuid>",
        "name": "Delivery Date",
        "type": "date",
        "type_config": { … }
      },
      "before": "…",
      "after": "1718950000000"
    }
  ]
}
```
Key facts:
- The webhook payload gives the **`task_id`** and **the changed field(s)** with `before`/`after`. It does **not** include the full task object — for anything beyond the changed value, GET the task. For our field-level back-sync, `after` + `custom_field.id`/`name` is enough.
- `after` is **already type-shaped the way ClickUp stores it** (date = unix ms, dropdown = option id, currency = number, text = string). The receiver must **decode** these back into dashboard column types (the inverse of `encodeForField`).
- Multiple field edits in one save → multiple `history_items` in one payload. Process them all.

### 1.3 Subscribing (one-time setup)
`POST https://api.clickup.com/api/v2/team/{team_id}/webhook` with `{ endpoint, events: ["taskUpdated"], list_id: 901709622357 }`. Scope to the **mirror list** (`list_id` 901709622357) so we only receive events for mirror tasks, not the whole workspace. Auth = the `pk_` token (Authorization header). The `pk_` token **can create/list/delete webhooks** on the public API — this is in-scope for it (unlike field-definition CRUD, which is UI-only). Store the returned `webhook_id` + `secret` (Section 1.4).

### 1.4 Verification / auth of inbound calls
ClickUp signs each webhook delivery with an **`X-Signature`** header = HMAC-SHA256 of the raw request body using the **webhook secret** returned at creation. The receiver MUST:
1. Read the raw body (not the parsed JSON) for the HMAC.
2. Compute `HMAC-SHA256(secret, rawBody)` and constant-time compare to `X-Signature`.
3. Reject (401) on mismatch.

This is **stronger than the current docuseal-webhook**, which does no signature check (it relies on the submission-id lookup as a weak guard). Do it properly for ClickUp — the endpoint is public and writes to the DB with the service-role key.

Store `CLICKUP_WEBHOOK_SECRET` as a Supabase function secret.

---

## 2. Receiving endpoint — where it lands

**Recommendation: a new Supabase edge function `clickup-webhook`** (mirrors `docuseal-webhook` / `qbo-webhook`). Rationale:
- The existing inbound webhooks already live as edge functions — same deploy path, same service-role pattern, same CORS block. Consistency over inventing a Vercel route.
- Service-role key bypasses RLS for the write-back (RLS currently permits anon insert but the back-sync should not depend on that).
- Deno runtime can reuse `_shared/clickup-fields.ts` directly (it already lives in `supabase/functions/_shared/`).

Flow inside `clickup-webhook`:
1. CORS preflight → `ok`.
2. Read **raw** body; verify `X-Signature` (Section 1.4). 401 on fail.
3. Parse; for `event === "taskUpdated"`, find the job by `task_id`:
   `job_submissions.clickup_task_id = task_id` (also stored on `job_loe_details.clickup_task_id`). If no job → return **200 "skip"** (do NOT 500 — avoids ClickUp retry storms), and log.
4. For each `history_items[i]` where `field === "custom_field"`:
   - Map `custom_field.name` → dashboard column via the **reverse field map** (Section 4).
   - If the field is **not back-syncable** (Section 4, ❌ rows) → skip.
   - Decode `after` to the column type (Section 5).
   - **Loop-prevention check** (Section 6) before writing.
   - Write to the correct table (`job_submissions` or `job_loe_details`), set `updated_at`, set `last_sync_source = 'clickup'`.
5. Return 200.

> **Why byName, not byId, for the reverse map too:** the mirror task's field UUIDs differ per list. The push side resolves byName so it survives template replication to the Valta board with zero code change. The reverse map MUST do the same — key off `custom_field.name`, never a hardcoded UUID. (A hardcoded id map would break the moment Ben clones the list.)

---

## 3. Architecture (components)

```
ClickUp (mirror list 901709622357, task 86e1yb8nz)
   │  user edits a custom field
   ▼
ClickUp webhook  ──taskUpdated──►  POST  /functions/v1/clickup-webhook   (NEW edge fn)
                                          │ 1. verify X-Signature (HMAC, secret)
                                          │ 2. find job by clickup_task_id
                                          │ 3. reverse-map each changed field (byName)
                                          │ 4. decode value → column type
                                          │ 5. loop-guard (skip echo) ──► Section 6
                                          │ 6. write job_submissions / job_loe_details
                                          │    + updated_at + last_sync_source='clickup'
                                          ▼
                                   Supabase (service-role write)
                                          │
                                          ▼  (existing) dashboard reads tables on load
                                   Dashboard reflects the change
```

Reusable pieces from the one-way build:
- `_shared/clickup-fields.ts` — add an inverse: `reverseFieldMap` (name → {table, column, syncable}) + `decodeFromField` (the inverse of `encodeForField`).
- The `byName` resolution philosophy (template-portable) carries straight over.

---

## 4. Field map — ClickUp field → dashboard column (reverse)

Derived from `_shared/clickup-fields.ts` `hubValueMap` (push) inverted, + the column list in `types.ts`. **`SYNC?`** column = is it safe to back-sync.

Legend: ✅ back-sync safe · ❌ do NOT back-sync (dashboard-owned / computed / derived) · ⚠ conditional

### 4.1 Client / property identity → `job_submissions`
| ClickUp field name | Dashboard column (table) | Type | SYNC? | Notes |
|---|---|---|---|---|
| Client First Name | `client_first_name` (job_submissions) | text | ✅ | |
| Client Last Name | `client_last_name` (job_submissions) | text | ✅ | |
| Client Organization | `client_organization` (job_submissions) | text | ✅ | |
| Client Email | `client_email` (job_submissions) | email | ✅ | NOT NULL — never write empty |
| Property Name | `property_name` (job_submissions) | text | ✅ | |
| Property Address | `property_address` (job_submissions) | text | ✅ | NOT NULL — never write empty |
| Property Type | `property_type` (job_submissions) | dropdown→text | ⚠ | NOT NULL; decode option id→label; feeds the cascade — see ❗below |
| Intended Use | `authorized_use` (job_loe_details) / `intended_use` (job_submissions) | dropdown→text | ⚠ | push reads loe.authorized_use first; back-sync should target the SAME canonical column — confirm during build |

### 4.2 Appraisal scope / LOE quote → `job_loe_details`
| ClickUp field name | Dashboard column (job_loe_details) | Type | SYNC? | Notes |
|---|---|---|---|---|
| Report Type | `report_type` | dropdown→text | ✅ | |
| Property Rights Appraised | `property_rights_appraised` | dropdown→text | ⚠ | derived by the LOE cascade from Property Type/Subtype/Tenancy — back-sync overwrites a cascade output (see ❗) |
| Scope of Work | `scope_of_work` | text | ✅ | |
| Payment Terms | `payment_terms` | dropdown→text | ✅ | |
| Appraisal Fee | `appraisal_fee` | currency→number | ✅ | strip `$`/commas |

### 4.3 Dates → `job_loe_details` / `job_submissions`
| ClickUp field name | Dashboard column | Type | SYNC? | Notes |
|---|---|---|---|---|
| Delivery Date | `delivery_date` (job_loe_details) | date(ms)→ISO | ✅ | decode unix-ms → ISO string |
| Received Date | `created_at` (job_submissions) | date | ❌ | **immutable** — system stamp; never overwrite |
| LOE Sent | `loe_sent_at` (job_loe_details) | date | ❌ | **system-owned** — set ONLY by docuseal-webhook on send; ClickUp must not write it back |
| LOE Signed | `signed_at` (job_loe_details) | date | ❌ | **system-owned** — set ONLY by docuseal-webhook on completion |

### 4.4 Links — NEVER back-sync (dashboard-owned, computed)
| ClickUp field name | SYNC? | Why |
|---|---|---|
| Job Number | ❌ | owned by Valcre create path → `job_loe_details.job_number` |
| APR Dashboard Link | ❌ | computed from `job.id` (`/dashboard/job/<id>`) — pure output |
| Valcre Job Link | ❌ | computed from `valcre_job_id` — pure output |

### 4.5 Team & Workflow checkboxes / Site-Transaction (the extra mirror fields)
The 39-field mirror includes fields with **no current push source** (Phase Owner, Work Phase, Client Info Received, Invoice Paid, TTSZ Done, Template Saved, Photos Saved, Comps Provided, Transaction Status, Zoning Status, Land $/Metric, Inspection Date, Value Scenario(s), Approaches To Value). Status per dashboard schema:
- `transaction_status`, `zoning_status`, `value_scenarios`, `approaches_to_value`, `assignment_type` **columns exist on `job_loe_details`** → ✅ back-syncable (but note `value_scenarios`/`approaches_to_value` are **cascade outputs** — ❗).
- The **checkbox workflow flags** (Client Info Received, Invoice Paid, TTSZ Done, Template Saved, Photos Saved, Comps Provided) and **Phase Owner / Work Phase** have **no dashboard column today**. They are ClickUp-native workflow state. Two options at build time: (a) leave them ClickUp-only (recommended — they are PM workflow, not job data), or (b) add columns to `job_loe_details` if the dashboard wants to display them. **Default: do NOT back-sync; they live in ClickUp.**
- `Land $/Metric`, `Inspection Date` → map to `land_*` / `effective_date`/`inspection`-type columns if/when added; confirm exact column at build.

### ❗ Cascade / derived fields — the dangerous back-sync set
`Property Type`, `Property Rights Appraised`, `Value Scenario(s)`, `Approaches To Value` are **inputs to or outputs of the LOE cascade** (`loeCascade.ts`). Back-syncing a cascade OUTPUT (Property Rights, Value Scenarios, Approaches) from ClickUp will be **silently re-derived and overwritten** the next time the cascade fires on the dashboard — making the back-sync look broken. **Recommendation: treat all cascade outputs as ❌ back-sync.** Only back-sync the cascade INPUTS (Property Type, and the source fields), and let the dashboard re-derive. Decide this explicitly during build — it is the subtlest correctness trap in the reverse leg.

---

## 5. Value decoding (inverse of `encodeForField`)
The webhook `after` value arrives ClickUp-shaped; decode to column type:
- **dropdown** — `after` is the **option id**. Decode by looking up the option id in the field's `type_config.options` → use the option **label/name** as the column string. (Inverse of the push's label→id match.) If the option id isn't resolvable, GET the list field defs to refresh.
- **date** — `after` is **unix ms** (string). Convert → ISO string for the column (`new Date(Number(after)).toISOString()`).
- **currency** — `after` is a number → store as number.
- **text / email / short_text / url** — store as-is (trimmed).
- **NOT NULL guard** — `client_email`, `property_address`, `property_type`, `client_first_name`, `client_last_name` are NOT NULL on `job_submissions`. Never write empty/null to these — skip the write if `after` is blank.

---

## 6. Loop prevention (the echo problem)
The risk: dashboard pushes a value → ClickUp fires `taskUpdated` → webhook writes it back to the dashboard → (if the dashboard then re-pushes) → infinite echo. Three defenses, layered:

1. **Author check (cheapest, first line).** The push uses the `pk_` service token, so dashboard-originated edits show `history_items[].user.id` = the **service-token user id** (10791838). **If the change author is the service-token user, SKIP** — it's our own push echoing back. Genuine human edits in the ClickUp UI carry a real user id. This alone kills the common echo.
2. **Value-equality check (second line).** Before writing, read the current dashboard column value; if it already equals the decoded `after`, **skip the write** (no-op). Idempotent; stops a redundant write even if the author check is unavailable.
3. **`last_sync_source` + timestamp (definitive).** Add `last_sync_source text` + rely on `updated_at` (Section 10). When the webhook writes, set `last_sync_source='clickup'`. When the dashboard pushes, set `last_sync_source='dashboard'`. The push handler can check: "if the row's `last_sync_source='clickup'` and `updated_at` is within N seconds, this value just came FROM ClickUp — don't re-push." This breaks the cycle at the push side too.

**Recommended combination:** author check (1) + value-equality (2) as the receiver guard; `last_sync_source` (3) as the push-side guard. Together they make the loop impossible from either direction.

---

## 7. Conflict resolution (both sides edit the same field)
Options considered:
- **Last-write-wins (LWW) by timestamp** — simplest; whichever edit is newer wins. Needs a reliable per-field timestamp (ClickUp gives `history_items[].date`; the dashboard has `updated_at` per row, not per field). Risk: row-level `updated_at` is coarser than ClickUp's per-field timestamp, so a stale row-level compare could clobber a fresh field.
- **Dashboard-wins** — the dashboard is the system of record (it feeds Valcre, the LOE, DocuSeal). On conflict, the dashboard value is authoritative; ClickUp is a convenience mirror. Simple, predictable, matches the actual data ownership.
- **Field-level ownership** — each field has ONE authoritative side. Most fields = dashboard-owned (back-sync only fills/corrects). System fields (LOE Sent/Signed, links, job number) = dashboard-owned, never accept ClickUp. Workflow flags = ClickUp-owned, never pushed.

**Recommendation: field-level ownership with dashboard-as-default.** It matches reality:
- **Dashboard-owned (ClickUp edits accepted as fills/corrections, but dashboard always re-asserts on its own edit):** client/property identity, scope, fee, payment terms, report type, delivery date.
- **Dashboard-exclusive (reject ClickUp writes entirely):** Received Date, LOE Sent, LOE Signed, Job Number, both links, all cascade outputs.
- **ClickUp-owned (never pushed, optionally not back-synced either):** the workflow checkboxes + Phase Owner/Work Phase.

LWW is a fallback only for the small dashboard-owned set where simultaneous edits are plausible — and even there, prefer the most-recent-edit using ClickUp's per-field `history_items[].date` vs the dashboard's `updated_at`. Avoid pure row-level LWW (too coarse).

---

## 8. Open questions (resolve at build time)
1. **Intended Use canonical column** — push reads `loe.authorized_use ?? job.authorized_use ?? job.intended_use`. Which is the single write target for back-sync? (Likely `job_loe_details.authorized_use`.) Confirm.
2. **Cascade outputs** — final call: hard-block back-sync on Property Rights / Value Scenarios / Approaches To Value (Section 4 ❗)? Recommended yes.
3. **Per-field timestamps** — do we need a per-field `*_updated_at` for true LWW, or is field-level ownership enough to avoid needing them? (Recommended: ownership model avoids per-field timestamps.)
4. **Workflow checkboxes** — leave ClickUp-only, or add `job_loe_details` columns to surface them on the dashboard? (Recommended: ClickUp-only for v1.)
5. **Webhook reliability** — ClickUp webhooks have no guaranteed delivery + a health/auto-disable behavior on repeated failures. Do we need a periodic reconciliation sweep (GET task fields, diff vs DB) as a backstop? (Recommended: yes, a low-frequency reconcile cron, Phase 3.)
6. **Multi-job lists** — webhook scoped to the mirror list; confirm one task ⇄ one job (the `clickup_task_id` lookup assumes 1:1).

---

## 9. Phased implementation outline
- **Phase 0 — one-way leaves the hooks in (Section 10).** No reverse code; just the three additive columns/flags during the one-way build.
- **Phase 1 — receiver skeleton.** New `clickup-webhook` edge fn: CORS, raw-body read, `X-Signature` HMAC verify, find-job-by-task, return 200/skip. No writes yet — log the decoded changes. Subscribe the webhook to the mirror list.
- **Phase 2 — reverse field map + decode + write.** Add `reverseFieldMap` + `decodeFromField` to `_shared/clickup-fields.ts`. Wire writes for the **dashboard-owned ✅ set only** (identity, scope, fee, terms, report type, delivery date). Enforce NOT-NULL guards. Set `last_sync_source='clickup'` + `updated_at`.
- **Phase 3 — loop prevention + conflict.** Author check + value-equality guard in the receiver; `last_sync_source` guard in the push handler. Apply field-level ownership rules (reject the dashboard-exclusive set). Add the reconciliation cron backstop.
- **Phase 4 — extend (optional).** Cascade-input handling, workflow-checkbox columns, per-field timestamps if LWW is ever needed.

---

## 10. How two-way layers ON TOP of one-way (what the one-way build must leave in place)
Two-way is **additive** — but the one-way build should drop three cheap hooks so the reverse leg installs cleanly with zero rework:

1. **`last_sync_source text` column** on `job_submissions` AND `job_loe_details` (nullable). One-way sets it to `'dashboard'` on every push-triggering write. Reverse leg sets `'clickup'`. This is the backbone of both loop-prevention (Section 6.3) and conflict ownership (Section 7). **Adding it now costs one migration; retrofitting later means re-touching every push write.**
2. **Reliable `updated_at` maintenance** on both tables. The reverse leg's value-equality + recency checks depend on `updated_at` being trustworthy. Confirm both tables have it (they do — `updated_at` exists on `job_loe_details`; verify a trigger or app-level set on `job_submissions`).
3. **Keep the push field resolution `byName` and the `_shared/clickup-fields.ts` location** (already true). The reverse map is the inverse of the same file — colocating them means one source of truth for the name↔column mapping. Do NOT move field logic into Vercel routes for the one-way build; keep it in the shared edge module so the receiver can reuse it.

**Nothing else about one-way needs to change now.** No schema redesign, no push-handler rewrite. The push can ship and run in production; when two-way is wanted, you add the `clickup-webhook` edge function + the inverse map, and the only pre-existing dependency you'll wish you had is `last_sync_source` — which is why it's the one thing worth adding during the one-way build.

---

*Drafted 2026-06-19 from code-traced ground truth (edge functions, shared field resolver, Supabase types) + ClickUp public webhook API behavior. Build-ready; resolve Section 8 open questions before Phase 2.*
