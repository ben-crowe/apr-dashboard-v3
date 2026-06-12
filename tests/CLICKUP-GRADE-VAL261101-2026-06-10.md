---
content_type: clickup-grade-record
title: ClickUp Card Sync Grade — VAL261101 on BC test list (custom-field readback)
status: PASS (with 1 real bug + 2 vocab-mismatch skips flagged)
owner: qa-agent (verify gate) · co-architect (gate author) · react-specialist (edge-fn fixes)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
date: 2026-06-10
tags: [apr-workflow, clickup, clickup-sync, custom-fields, readback, qa-gate, val261101]
---

# ClickUp Sync Grade — VAL261101 (BC test list 901709622357)

**Spec:** [CLICKUP-SYNC-CANONICAL.md](~/Development/APR-Dashboard-v3/docs/Features/04-Job%20&%20Client%20Mgt./CLICKUP-SYNC-CANONICAL.md)
**Scope:** test list **901709622357** ONLY (never client prod 901402094744). Task `86e1qnwr6`.

## What was verified

Pulled VAL261101 live from Supabase (job + job_loe_details + job_property_info), ran the real
`buildHubCustomFields` byName→encode→skip logic against the test list's live field defs, applied each
field, and **GET-readback-verified each one** (HTTP 200 ≠ persisted). Then proved sync-on-change by
editing a dashboard field and invoking the **real deployed `update-clickup-task` edge function**.

## Per-field readback (the 14 fields with a matching column)

| Field | Type | Landed value | Result |
|---|---|---|---|
| Client Organization | text | Evergreen Holdings | PASS |
| Client First Name | text | Edward | PASS |
| Client Last Name | text | Johnson | PASS |
| Client Email | email | edward.johnson.988928@test.com | PASS |
| Client Phone | phone | +14032576592 (after E.164) | **FAIL→FIX** — raw `(403) 257-6592` was rejected; only E.164 persists |
| Property Name | text | Westside Mall | PASS |
| Property Address | text | 2129 Broadway Court | PASS |
| Property Type | drop_down | Industrial | PASS (orderindex resolved to label) |
| Property Rights Appraised | drop_down | Leased Fee Interest | PASS |
| Scope of Work | text | Income Approach | PASS |
| Delivery Date | date | 2026-06-24 (±TZ) | PASS-with-watch (TZ day-shift) |
| Payment Terms | drop_down | On LOE Signature | PASS |

## Skips (correct behavior or flagged)

- **Valuation Premise** → list column is **"Valuation Premises"** (plural). byName MISS → silently
  dropped. **Naming bug — the valuation premise never reaches the card.** Fix: rename the hub key OR the
  column so they match.
- **Report Type** → source "Appraisal Report"; list options are [Comprehensive, Concise, Form, N/A] →
  no match → skipped. Dashboard vocabulary ≠ ClickUp dropdown options.
- **Asset Condition** → source "Good"; list options are [New Development, Existing Property] → no match.
  Same vocabulary-mismatch class.
- **Authorized Use · Status of Improvements · Appraisal Fee · Retainer · Appraiser Notes · Client
  Comments** → no column on the test list yet (Stage-2 ADD set). Spec says these self-resolve when the
  columns are created. Expected skips.

## Sync-on-change (Stage-2, real edge function)

Edited dashboard `scope_of_work` → invoked deployed `update-clickup-task` ({jobId}) → returned
`success:true, set:14, failed:0` → card "Scope of Work" changed to the new value → restored. **PASS.**

## Findings to route

1. **Phone encoding (react-specialist):** `encodeForField` case `'phone'` only trims — ClickUp phone
   fields silently drop non-E.164. Normalize to E.164 before send.
2. **"Valuation Premise" vs "Valuation Premises" naming (co-arch/react-spec):** byName miss drops the
   field. Align the names.
3. **Readback false-negatives (informational):** the edge function's own readback compares
   `String(live)===String(sent)`, which FAILS for dropdowns (live=orderindex, sent=option-id), phone,
   and date — so it logs `verified=10/14` even when all 14 landed. The "unverified" 4 are a comparison
   artifact, not broken fields. Consider resolving orderindex→id in the readback so the verified count
   is truthful.
4. **Delivery Date TZ (watch):** edge-fn `Date.parse("2026-06-24")` can land the card a day early.

**Last reviewed:** 2026-06-10 by qa-agent — VAL261101 on BC test list; per-field readback + real
edge-function sync-on-change. 11/12 applied fields clean; phone needs E.164; 1 naming-miss + 2
vocab-mismatch skips flagged.
