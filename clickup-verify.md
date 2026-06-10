# 04 — ClickUp Job-Hub Custom-Field Sync Verification (Official Result)

**Date:** 2026-06-04
**Tester:** qa-agent (dev-2)
**Deploy under test:** react-spec commit `edcf95e` — `create-clickup-task` + `update-clickup-task` both wired to the shared resolver `supabase/functions/_shared/clickup-fields.ts`. Dev list pointed at MIRROR `901709622357` (secret `CLICKUP_LIST_ID`).
**Test job:** VAL261101 — Westside Mall, 2129 Broadway Court, Calgary (job `e5a7ba2f-0535-4fbf-9ba7-b7027cf0a157`, Valcre 784140, client Edward Johnson / Evergreen Holdings).
**Name-match guard:** PASSED before any write. (Decoy noted: a 2nd "Westside Mall" — George Martin / Maple Drive / no job number `13b17278` — left untouched.)
**Method:** null stale task ids → invoke `create-clickup-task` (fresh) → independent ClickUp API readback (NOT trusting the edge-fn's own verify or HTTP 200) → change two card fields in DB → invoke `update-clickup-task` exactly as the dashboard debounce does (by jobId) → readback + duplicate count.

---

## Headline

**Custom-field sync is verified working end-to-end.** A job's fields land in the TYPED custom-field slots on the ClickUp card (not the description blob), with correct typed encoding (dropdown=option, date=ms, email/url/text exact). Editing a field REPLACES in place on the SAME card — the create→update flow produced exactly ONE card, zero duplicates. New card: `86e1qnwr6` on list `901709622357 "APR Test - Valta Mirror"`.

---

## Layer 1 — fresh create, per-field scorecard (independent readback)

| Field | Type | Value landed | Result |
|---|---|---|---|
| Job Number | short_text | VAL261101 | ✅ PASS |
| APR Dashboard Link | url | .../dashboard/job/e5a7ba2f… | ✅ PASS |
| Valcre Job Link | url | app.valcre.com/job/edit/784140#job | ✅ PASS |
| Client First Name | short_text | Edward | ✅ PASS |
| Client Last Name | short_text | Johnson | ✅ PASS |
| Client Organization | short_text | Evergreen Holdings | ✅ PASS |
| Client Email | email | edward.johnson.988928@test.com | ✅ PASS |
| Property Name | short_text | Westside Mall | ✅ PASS |
| Property Address | short_text | 2129 Broadway Court | ✅ PASS |
| Property Type | drop_down | **Industrial** (option) | ✅ PASS |
| Property Rights Appraised | drop_down | **Leased Fee Interest** (option) | ✅ PASS |
| Scope of Work | short_text | Income Approach | ✅ PASS |
| Payment Terms | drop_down | **On LOE Signature** (option) | ✅ PASS |
| Delivery Date | date | 2026-02-10 (unix ms 1770634800000) | ✅ PASS |
| Report Type | drop_down | (empty) | ⬜ EMPTY-by-design (HOLD — "Appraisal Report" ≠ any option) |
| Intended Use | drop_down | (empty) | ⬜ EMPTY-by-design (HOLD — "Estate Planning" ≠ any option) |
| Appraisal Fee | — | field absent on mirror | ⬜ EMPTY-by-design (not-yet-added) |
| Received Date | — | field absent on mirror | ⬜ EMPTY-by-design (not-yet-added) |
| LOE Sent | — | field absent on mirror | ⬜ EMPTY-by-design (not-yet-added) |
| LOE Signed | — | field absent on mirror | ⬜ EMPTY-by-design (not-yet-added) |

**14/14 populated fields correct. 0 failures. 6 empty-by-design = PASS per spec.**

## Layer 2 — edit replaces in place, no duplicate

- Changed `scope_of_work` → "Sales Comparison Approach", `payment_terms` → "Net 30" in DB, fired `update-clickup-task` by jobId (the exact debounce path in `LoeQuoteSection.tsx:108`).
- Readback: both values REPLACED on the SAME card `86e1qnwr6` (typed slots updated, not appended). ✅
- Returned `taskId: 86e1qnwr6` — no new card. `update-clickup-task` PUTs to the existing id and never creates (resolver comment: "Reuses the saved clickup_task_id — never creates").
- Duplicate count on mirror = the sync produced exactly ONE card. (A 2nd card `86e1qn375 "…(FIELDS DEMO)"` exists but is pre-existing MANUAL scaffolding from a prior session, NOT a sync dup — differently named.)
- Values restored to originals + re-synced (2nd replace-in-place confirm).

## Layer 3 — response shape

Both functions return `customFields: { set, failed, verified, total }`. ✅ Create: `{set:14, failed:0, verified:10, total:14}`. Update: same shape, `verified:true` top-level.

---

## Findings (non-blocking — for react-spec)

1. **Edge-fn `verified` undercounts dropdowns (cosmetic).** `applyTaskFields` readback compares the sent dropdown **option-UUID** against ClickUp's returned **orderindex** — different representations → never equal, so each dropdown counts as set-but-unverified. That's why `verified:10` not 14. Fields ARE correctly set (independent readback = 14/14). Fix: resolve orderindex↔id before the compare (or treat dropdown as verified when `set` and live value non-null). Does NOT affect actual sync.

2. **Resolver reads a non-existent column.** `clickup-fields.ts` `hubValueMap` reads `loe.loe_sent_at` (and `loe.signed_at`); `job_loe_details.loe_sent_at` does NOT exist (SQL `column does not exist`). Harmless now (LOE Sent/Signed fields aren't on the mirror → skipped), but once those fields are added the date will silently stay empty until the column name is reconciled with the actual schema (LOE arch doc claims `loe_sent_at TIMESTAMP` — schema disagrees).

3. **Stale demo card** `86e1qn375` on the mirror — recommend archiving so the board shows one clean hub card.

---

## Bottom line
The JOB-HUB custom-field sync **works and is proven**: typed slots populate correctly on create, edits replace in place with no duplicate card, and the response carries the verification counts. Two cosmetic/forward-looking findings for react-spec; none block sign-off.

## Cleanup item (2026-06-05)
- **QA_PROBE_DELETE_ME** — leftover QA test custom field on the ClickUp mirror list. ClickUp API cannot delete custom fields (405), so it needs **manual deletion in the ClickUp UI** (Ben). Harmless until then.
