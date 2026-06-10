---
content_type: flag-resolution
title: FLAG-1 Resolution — Transaction/Zoning duplicate boxes are safe to delete (green light)
status: RESOLVED in code — green light for cleanup, GATED on two conditions below
owner: co-architect (code-verified) · qa-agent (gates the live deletion) · ui-designer (does the cleanup)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
date: 2026-06-10
supersedes: the FLAG-1 worry in JOB-DETAIL-FIELD-AUDIT-2026-06-09.md (Co-Arch Cross-Check section) + qa-agent prime "FLAG-1 BLOCKER"
tags: [apr-workflow, field-registry, flag-1, valcre-sync, transaction-status, zoning-status, duplicate-fields, green-light]
---

# FLAG-1 Resolution — the duplicate boxes are one field, not two

## The original worry

The audit flagged that Transaction Status and Zoning Status each appear in TWO places on
the dashboard — the LOE Quote section AND the older Data-Gathering (Property Info) section.
A live Valcre readback showed Zoning synced as "Legal Conforming" (a Data-Gathering-looking
value), raising the fear that **the Valcre sync was reading the stale Data-Gathering copy
instead of the LOE-section canonical** — which would make deleting the duplicate dangerous.

## What the code actually shows (verified 2026-06-10)

**There is only ONE underlying value. The two on-screen boxes both edit it.**

- `PropertyInfoSection.tsx` (the Data-Gathering box) and `LoeQuoteSection.tsx` (the LOE box)
  both render a `<Select>` bound to the **same** state key — `jobDetails.transactionStatus`
  and `jobDetails.zoningStatus`. Two controls, one value. Touch either → same field updates.
- `useSaveJobDetails.ts` + `useJobData.ts` confirm both fields were **moved** to the LOE table
  (`job_loe_details.transaction_status` / `.zoning_status`) — there is no separate
  Data-Gathering column still in play.
- The Valcre sync reads that single canonical value: `VALCRE_SYNC_FIELDS` (LoeQuoteSection.tsx)
  includes `transactionStatus` + `zoningStatus`, routed to **Custom 12053** (Transaction) and
  **Custom 12054** (Zoning) via `UpdateSelectFieldValue`. QA readback-verified both on the live
  test job VAL261101 / Valcre Id 784140.

**The stale "Legal Conforming" Ben saw is explained** by Valcre's change-only-update behavior,
NOT by a stale-field read: the sync only fires when the value changes, so an old Valcre entry
just needs re-touching (change → change back) to force a fresh push. It was never two competing
fields.

## Green light — with two gate conditions

✅ **The duplicate Data-Gathering box can be deleted with no loss of the wired value.** Removing
the Property Info copy leaves the LOE-section control and the single underlying value intact, and
the Valcre sync is unaffected.

GATED on (QA owns this gate):

1. **Option-label reconcile first.** A few dropdown labels don't match Valcre's own labels and
   silently no-write (e.g. dashboard "Listed" on Transaction Status never lands; Analysis Level
   options beyond "Comprehensive" are Valcre-rejected). This is the option-set cleanup waiting on
   **Chris's client-wanted list** — the long pole. Reconcile labels before relying on the field.
2. **QA re-runs the Valcre readback right after any live deletion/rewire** to prove nothing
   dropped (GetValues on the test job — never trust HTTP 200).

## Division of work (agreed 2026-06-10)

- **ui-designer + subagent** — owns the visual work: regroup the sections, delete the duplicate
  box, build the cascade display, the fold-out, the two missing dropdowns (Current Use / Proposed
  Use). Most of this can't touch wiring at all.
- **qa-agent** — owns the gate: no duplicate deleted on the live site until this doc is the green
  light AND labels reconciled AND post-change readback passes.
- **co-architect** — wiring reference: field→target map, cascade rules, this FLAG-1 finding,
  option-label traps.

## ⚠ CORRECTION 2026-06-10 — the sync isn't currently landing (separate from FLAG-1)

A live `GetValues` on job 784140 (qa-agent) showed **every custom field reads `None`** — our
Valcre sync is currently landing nothing into the real custom fields. Two things this clarifies:

- **The routing MAP is NOT drifted.** `api/valcre.ts` `CUSTOM_FIELD_IDS` (L156-180) already uses
  the correct v3.1 block matching Chris's Excel exactly — `transactionStatus: 12424`,
  `zoningStatus: 12425`, `valueScenarios: 12414`, etc. The flow resolves by field NAME server-side
  through that map. The `CF12053 / CF12054` references in `LoeQuoteSection.tsx` (L558-559) and
  `webhooks/valcre.ts` (L166) are **stale COMMENTS only** — they do not drive routing. (Kill them.)
- **The earlier "readback-verified wired" for Transaction/Zoning is NOT currently true** — it was
  proven against the old IDs before a Valcre renumber. Root cause of the `None` is OPEN and must be
  pinned empirically before relying on the field: (a) deployed Vercel function lagging local
  `api/valcre.ts` [most likely], (b) stale `AvailableValueId` option-IDs causing silent write-fail,
  or (c) the job simply not re-synced since the renumber. qa-agent owns pinning this.

**FLAG-1 itself is unaffected.** The structural conclusion — one underlying value, two on-screen
boxes, both persisted in `job_loe_details`, duplicate box safe to delete with no wired value lost —
is a code-structure fact independent of the Valcre CF IDs. It still holds. The `None` issue is a
separate active sync bug, not a reason to keep the duplicate box.

**Doctrine note:** this is the worked proof case for "trace to Chris's source, don't trust the
code." Chris's Excel + the live Valcre API agreed on the 124xx block; the code's own comments lied,
and a careful read of those comments produced a false diagnosis. Source beat code twice.

## Source of truth for the wiring claims

- `src/components/dashboard/job-details/LoeQuoteSection.tsx` — `VALCRE_SYNC_FIELDS`, the
  transactionStatus→12053 / zoningStatus→12054 routing.
- `src/components/dashboard/job-details/PropertyInfoSection.tsx` — the duplicate Select controls
  (same state key).
- `src/hooks/useSaveJobDetails.ts` + `src/hooks/useJobData.ts` — both fields live in
  `job_loe_details`.
- `docs/Features/08-Master-Field-Registry/Valcre-Integration/AUTO-SYNC-WIRING-MAP.md` — QA's
  readback-verified target map.
- `tests/VERIFIED-PER-DESTINATION-2026-06-09.md` — per-destination live/partial/not status.
