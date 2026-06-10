---
content_type: integration-spec
title: ClickUp Card Sync — CANONICAL (custom-fields Job-Hub model)
status: active — THE single source of truth for ClickUp sync; supersedes the rich-markdown-card docs
created: 2026-06-10
updated: 2026-06-10
last_reviewed: 2026-06-10
owner: co-architect (authors) · qa-agent (readback-verifies) · react-specialist (edge fns)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
verified_against:
  - supabase/functions/_shared/clickup-fields.ts (buildHubCustomFields — THE current field list)
  - supabase/functions/create-clickup-task/index.ts (Stage-1: short header desc + custom fields)
  - supabase/functions/update-clickup-task/index.ts (Stage-2: LOE-quote custom fields + readback)
tags: [apr-workflow, clickup, clickup-sync, custom-fields, job-hub, ground-truth, integration]
---

# ClickUp Card Sync — CANONICAL

**Tags:** #clickup #clickup-sync #custom-fields #job-hub #ground-truth #apr-workflow
**Entities:** [[ClickUp-Job-Hub]] [[APR-Dashboard]]

**The one place to go for how the APR dashboard syncs to ClickUp.** If you need to know what fields
sync, why, or where to change it — start here. Vault-search `clickup sync` finds this.

> ## ⚠ SUPERSEDES the rich-markdown-card model (2026-06-05 redesign)
> The OLD approach wrote a rich 9-section **markdown description blob**. That's DEAD — it kept
> duplicating on update (markdown appends, never replaces). The CURRENT model writes the data into
> ClickUp **native custom fields** (typed, filterable, sortable). Any doc still describing a "rich
> edge-function description card" is STALE — see "Stale docs" at the bottom.

---

## How it works (the current model)

- **Data lives in ClickUp NATIVE CUSTOM FIELDS** — not a markdown description. Source:
  [clickup-fields.ts → `buildHubCustomFields`](~/Development/APR-Dashboard-v3/supabase/functions/_shared/clickup-fields.ts).
- **The description is now a short header only** — the two links (APR Dashboard + Valcre), Job#, Date
  Ordered. (`create-clickup-task` sets this.)
- **Dynamic byName resolution** — at runtime it GETs the list's field definitions and matches by field
  NAME. A hub field with no column on a list is **silently skipped** (not an error), so:
  - Ben can replicate the field template to the Valta board with ZERO code change.
  - HOLD fields + not-yet-added columns self-populate the moment their defs exist (created in the
    ClickUp UI or via API).
- **Why custom fields, not markdown:** setting a field REPLACES (never appends) → no duplication; and
  the data becomes filterable / sortable / groupable in ClickUp.
- **Readback-verified** — every write re-GETs the task and confirms it landed (HTTP 200 ≠ persisted),
  same honesty as the Valcre sync.
- **API limit (don't fight it):** the ClickUp v2 API canNOT create/delete/reorder custom-field
  DEFINITIONS — only set/remove VALUES on existing fields. Column defs are created in the ClickUp UI.

## The fields that sync (buildHubCustomFields KEEP set, 2026-06-05)

**Client & Property (Stage-1, on create):**
Client Organization · Client First Name · Client Last Name · Client Email · Client Phone ·
Property Name · Property Address · Property Type · Authorized Use *(canonical — replaces the Intended
Use dup)* · Asset Condition · Valuation Premise

**LOE Quote (Stage-2, pushed as the dashboard LOE fields are filled):**
Property Rights Appraised · Scope of Work · Report Type · Status of Improvements · Appraisal Fee ·
Retainer · Delivery Date · Payment Terms · Appraiser Notes · Client Comments

**Status tracker:** ClickUp task STATUS (Received → LOE Sent → LOE Signed) — driven by
`supabase/functions/docuseal-webhook`, NOT a custom field.

**NOT on the card:** internal-only tracking (Retainer Paid / Amount Paid / Paid Date), Client Title /
Org Address. (Those stay dashboard/Valcre-side.)

## The two stages (which edge fn writes what)

| Stage | Edge function | Writes |
|---|---|---|
| 1 — Create | [create-clickup-task](~/Development/APR-Dashboard-v3/supabase/functions/create-clickup-task/index.ts) | short header description (links + Job#) + the Client/Property custom fields |
| 2 — LOE Quote update | [update-clickup-task](~/Development/APR-Dashboard-v3/supabase/functions/update-clickup-task/index.ts) | LOE-quote custom fields + readback-verify (debounced; reuses saved clickup_task_id, never creates) |

Client-side trigger: `CLICKUP_CARD_FIELDS` in `LoeQuoteSection.tsx` debounces edits → calls
`update-clickup-task`. (That array is just the *trigger* list — the authoritative field set is
`buildHubCustomFields`.)

## Environments (test → promote)

- **Testing:** Ben's BC workspace, test list **901709622357** ("APR Test - Valta Mirror"). NEVER the
  client's list during testing.
- **Production:** the client's Valta workspace, list **901402094744** — a deliberate, Ben-gated switch
  done only after a flow is dialed (retarget the list ID + token).
- **Field IDs are per-list** — Valta prod and BC test have DIFFERENT UUIDs for the same field names;
  the byName resolver handles this, never hardcode one list's IDs for another.

## Related / testing docs (what QA works from)

- [Job-Hub field spec](~/Development/APR-Dashboard-v3/Data-Flow%20Visuals/03-CLICKUP-JOB-HUB-SPEC.md) — the field-model spec.
- [Custom-field sync RESULT](~/Development/APR-Dashboard-v3/Data-Flow%20Visuals/04-CLICKUP-CUSTOMFIELD-SYNC-RESULT.md) — QA's readback result.
- [Dashboard→ClickUp mapping](~/Development/APR-Dashboard-v3/tests/MAPPING-dashboard-to-clickup.md) — field map (verify against THIS doc).
- [Intake→ClickUp chain wiring spec](~/Development/APR-Dashboard-v3/tests/WIRING-SPEC-intake-clickup-chain-2026-06-04.md).

## Stale docs (describe the DEAD rich-markdown model — do not trust their ClickUp sections)

- [FIELD-ROUTING-dashboard-clickup-loe.md](~/Development/APR-Dashboard-v3/docs/FIELD-ROUTING-dashboard-clickup-loe.md) — still says "rich edge-function description card."
- The E2E master plan's ClickUp decision block (2026-06-03) — pre-dates the 2026-06-05 custom-fields redesign.

---

**Last reviewed:** 2026-06-10 by co-architect — authored from the deployed edge-function code
(buildHubCustomFields) after the rich-markdown docs caused a wrong-version read. THE canonical ClickUp
sync reference going forward; linked from the [APR Master Dashboard](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md).
