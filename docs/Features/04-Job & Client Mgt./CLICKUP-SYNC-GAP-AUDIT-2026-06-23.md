---
content_type: audit
title: ClickUp Sync Gap Audit — fields not reaching ClickUp
date: 2026-06-23
author: qa-agent
app: APR-Dashboard-v3
status: findings (no code changed)
tags: [apr-workflow, clickup, sync, field-mapping, audit, gap]
keywords: [clickup unwired fields, fields not syncing to clickup, hubValueMap, clickup mirror 39 fields, dropped sync fields, dead on-change trigger]
related: [CLICKUP-SYNC-CANONICAL.md (STALE — correct after this), CLICKUP-MIRROR-SYNC-RECONCILIATION-FIX.md]
---

# ClickUp Sync Gap Audit — what isn't reaching ClickUp (2026-06-23)

Read-only audit. Ground truth = `supabase/functions/_shared/clickup-fields.ts` (`hubValueMap`, the live mapping) — **NOT** `CLICKUP-SYNC-CANONICAL.md` (stale 06-10) and **NOT** `src/utils/webhooks/clickup.ts` (RETIRED). The ClickUp mirror was rebuilt to 39 client fields on 06-19; the resolver matches by **exact field name** and **silently skips** any field it can't source — which is why gaps are invisible in the UI.

## 1. UNWIRED — ClickUp columns nothing writes to (newer than the map)

These 12 fields exist on the ClickUp card (added to the mirror at the 06-19 rebuild) but **no dashboard source feeds them** — they were never wired. Most are Team/Workflow tracking fields with no dashboard equivalent today:

- Inspection Date
- Land $/Metric
- Phase Owner
- Work Phase
- Client Info Received
- Invoice Paid
- TTSZ Done
- Template Saved
- Photos Saved
- Comps Provided
- Notes
- Task Type

**Decision needed (Ben):** for each — is there a dashboard field that *should* feed it (wire it), or is it a ClickUp-only workflow field the team fills in manually (leave it, document as manual)?

## 2. DROPPED — fields that USED to sync and silently stopped

Removed from the live mapping on 06-19 but **still listed as synced** in the stale canonical doc:

- Scope of Work
- Appraisal Fee
- Payment Terms
- (doc also still lists: Retainer, Asset Condition, Valuation Premise)

These no longer reach ClickUp. If they should, they need re-adding to `hubValueMap`.

## 3. BROKEN — edits that fire a sync that lands nothing (false "synced")

The on-change trigger list (`LoeQuoteSection.tsx` `CLICKUP_CARD_FIELDS`) still includes **scopeOfWork, appraisalFee, retainerAmount, paymentComments**. Editing any of them fires an `update-clickup-task` call — but those keys no longer exist in the mapping, so the call runs and writes **nothing** for them. Wasted call + false impression that the edit synced. These dead keys should be removed from the trigger (or the fields re-wired in §2).

## 4. Suspect-but-intentional

- **Report Type** sources `report_format` (not `report_type`) — deliberate, but a debugging trap; note it.

## Where a fix touches

- Mapping: `supabase/functions/_shared/clickup-fields.ts` → `hubValueMap`
- On-change trigger: `src/components/dashboard/job-details/LoeQuoteSection.tsx` (`CLICKUP_CARD_FIELDS`)
- Update select path: `supabase/functions/update-clickup-task/index.ts`
- Stale doc to correct: `docs/Features/04-Job & Client Mgt./CLICKUP-SYNC-CANONICAL.md`

## Sync timing (context)

Create-only (set once at card create): Client / Property / Contact fields + links. On-change (debounced ~1.5s, only the trigger-list keys): the LOE/quote fields. LOE Sent / LOE Signed are stamped by the `docuseal-webhook`, not the UI.

---

## ROOT CAUSE (confirmed against live VAL261066 — added 2026-06-23)

**The core mechanism:** both edge functions (`create-clickup-task`, `update-clickup-task`) build the SAME full 27-field payload from the DB. The gap is NOT the payload — it's the **on-change trigger gate**. Editing a field only pushes to ClickUp if the field name is in `CLICKUP_CARD_FIELDS` (LoeQuoteSection.tsx) — a list of just **9 fields**. Every other synced field (~18: Property Type/Subtype, Transaction Status, Status of Improvements, Interest Appraised, Zoning, dates, etc.) is **effectively create-only** — written once at card creation and never refreshed when you edit it. That's why edited values show blank or stale.

**Per-field cause:**
- **Property Type ('Self-Storage') / Property Subtype ('Mixed-Use') blank** — (primary) not in the trigger set AND not routed through this section's autosave (they live on the property panel) → edits never push. (secondary, latent) even if pushed, the drop_down encoder SKIPs on option-mismatch: Subtype sends `'Mixed-Use'` (hyphen) vs the client mirror's `'Mixed Use'` (space), high drop risk; no synonym entry exists.
- **Status of Improvements wrong ('Existing -' vs dashboard 'Improved -')** — STALE, not a live mistranslation. Not in the trigger → new value never re-pushed; card holds the original create-time fuzzy match. No `FIELD_SYNONYMS` entry (only 'State of Improvements' exists).
- **Interest Appraised stale** — sources `property_rights_appraised`; dashboard now blank, but clearing-to-blank encodes null→skip so it never overwrites the old card value.
- **Report Type = 'Concise'** — confirmed sources `report_format` (the known trap), not the report type.
- **Delivery Date drift (7/9 vs 7/14)** — `docuseal-webhook` no longer writes delivery_date; card date is from create.
- **LOE Sent blank while LOE Signed set** — stamped separately by the webhook (`loe_sent_at` on send, `signed_at` on completion); sent blank = the send-event write didn't fire / predates the column.

**Gap classes:** (1) on-change re-sync = 9 fields only; (2) create-only = ~18 fields (never refreshed on edit); (3) option-drop = drop_down no-match silently skipped (Subtype is the live example).

**FIX SCOPE (no code yet):**
1. **Drop the 9-field gate** — call the card-update on ANY persisted field change (the update path already rebuilds the whole card from the DB, so the whitelist is a redundant gate that causes the gaps). Plus wire the property-panel autosave (Property Type/Subtype) to fire it. File: `LoeQuoteSection.tsx` (`CLICKUP_CARD_FIELDS` + the push gate).
2. **Add synonyms / reconcile options** — `FIELD_SYNONYMS` entries for Property Subtype ('Mixed-Use'→'Mixed Use' etc.) and Status of Improvements; reconcile Subtype option labels to the client mirror. File: `clickup-fields.ts` (`FIELD_SYNONYMS`, `encodeForField`).
3. **Backfill stale cards** — after (1)+(2), re-trigger an update on existing jobs to overwrite frozen Status/Interest/date values.
4. **Also clean up** the dead on-change keys flagged in §3 above (scopeOfWork/appraisalFee/retainerAmount/paymentComments fire but land nothing) — resolved naturally by fixing the mapping or removing them.

---

## FUTURE / PLANNED — Directional (per-field) two-way sync (Ben direction, 2026-06-23)

**The idea:** some ClickUp fields are meant for the CLIENT'S TEAM to fill/adjust IN ClickUp (the workflow set — Phase Owner, Work Phase, Client Info Received, Invoice Paid, TTSZ Done, Template Saved, Photos Saved, Comps Provided, Notes, Task Type, Inspection Date). If the team edits those in ClickUp, the values should flow back to the dashboard — an ease-of-use win since the team is already working the task.

**The rule (refined by Ben 2026-06-23) — THREE buckets, by whether the field exists on both sides:**
1. **ClickUp-only fields (no dashboard counterpart)** — e.g. most of the 12 workflow fields (Phase Owner, Work Phase, Client Info Received, Invoice Paid, TTSZ Done, Template Saved, Photos Saved, Comps Provided, Notes, Task Type, Inspection Date). **Default = DO NOT sync.** No dashboard home, so they stay ClickUp-only and the team manages them there. No work, no decision — unless we deliberately ADD a dashboard field for one (then it becomes bucket 2).
2. **Fields on BOTH dashboard and ClickUp** — one-way dashboard→ClickUp **guaranteed** (this is the current fix). These are the natural candidates for two-way-back.
3. **Two-way back (ClickUp→dashboard)** — a "where straightforward" enhancement on bucket-2 fields only. Do the easy ones; skip awkward/hard-to-sync-back ones (revisit later). NOT for bucket-1.

**Why it's safe + cheap:** the current fix only pushes shared dashboard-owned fields; it touches nothing ClickUp-only. The back-direction is an additive enhancement on shared fields. New work for the "up" direction = a ClickUp webhook listener → Supabase update + an update-loop guard (standard pattern), applied only to the easy shared fields.

**Status: PLANNED — bucket 3 (two-way-back on shared fields) is the optional follow-on; bucket 1 stays unsynced by default. Needs a PRD when scheduled. Not scheduled.**
