---
content_type: prd
title: PRD-A — Job-Prep Fields → Valcre Mapping + Sync Testing
status: ready-to-roll
created: 2026-06-03
owner: agents (react-spec + QA), co-architect coordinates
test_job: VAL261101 "Westside Mall" (pinned — name-match guard before any write)
related: [JOB-PREP-FIELDS-MAP-2026-06-03.md, VALTA-MASTER-DELTA-2026-05-14.md, MAPPING-dashboard-to-clickup.md]
---

# PRD-A — Job-Prep Fields → Valcre Mapping + Sync Testing

## Goal
The new job-prep fields are built + verified on the dashboard (LoeQuoteSection.tsx, build green).
Now wire + prove each one end-to-end: dashboard field → Valcre custom field (and ClickUp card
where routed), filled and confirmed it landed in the right Valcre field. Agent-owned testing on
the ONE pinned test job — not a Ben-driven click-through.

## Scope
- The new/changed job-prep fields: Authorized Use, Assignment Type, Job Status, Value Scenarios
  (multi), Property Rights (multi), Desktop Report, CMHC Financing, Request/Signed/Due dates,
  plus the 7 pending-Ben extras IF Ben keeps them (Report Format, Transaction Status, Zoning
  Status, Purpose, Analysis Level, Lead Appraiser, Effective Date).
- Out: Report Builder fields, anything not in the job-prep area.

## Steps (agent-owned)
1. **Confirm the target Valcre field for each** — review the live Valcre API / job schema; build a
   per-field map (dashboard field → Valcre property). Start from VALTA-MASTER-DELTA known maps
   (e.g. Authorized Use → Job.IntendedUses) and verify each against the live API, don't assume.
2. **Wire** the field → Valcre sync (api/valcre.ts proxy + field mapping) one field at a time.
3. **Fill + push** on the pinned test job VAL261101 (name-match guard FIRST — VAL numbers get
   reassigned).
4. **Verify it arrived** — read the value back from Valcre, confirm it's in the correct custom
   field. Screenshot the Valcre side. One field at a time; don't batch-and-pray.
5. **ClickUp leg** — for fields routed to the card (per MAPPING-dashboard-to-clickup.md), confirm
   they land on the edge-function card too.
6. **Report** a per-field pass/fail table + screenshots, in Ben's viewer (grouped, /km-open).

## Done = 
Every in-scope field proven to land in its correct Valcre custom field (and ClickUp where routed),
with a screenshot per verification, on VAL261101. No new jobs created.

## Gates
- Pin job VAL261101 only; name-match guard before ANY Valcre write.
- Isolated --session for any browser capture; save to data/screenshots; never /tmp.
- Screenshot-and-read before any "done" claim.
