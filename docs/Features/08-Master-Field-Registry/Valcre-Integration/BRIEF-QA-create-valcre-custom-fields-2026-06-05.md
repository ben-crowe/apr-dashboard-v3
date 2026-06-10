---
content_type: agent-brief
title: QA Brief — Create the V3.1 Valcre Custom Fields (we own the layer now)
status: ACTIVE — dispatched 2026-06-05
owner: qa-agent (executes) · co-architect (gate + conduit to Ben)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
source_of_truth: ~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/client-source/Valta-Master-Field-Registry-v3.1-2026-06-05.xlsx
tags: [apr-workflow, valcre, custom-fields, registry-v3, field-sync, build-brief]
keywords: [create valcre custom fields, v3.1 master needs custom, relearn custom field creation, fill valcre field id api key, own the custom field layer]
related: [~/Development/APR-Dashboard-v3/builds/valcre-custom-fields-spec.md, ~/Development/APR-Dashboard-v3/builds/VALCRE-CUSTOM-FIELDS-AUDIT.md, ~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/Valcre-Integration/VALCRE-CUSTOM-FIELDS-ADMIN-DEFINITIONS.md, ~/Development/APR-Dashboard-v3/docs/APR-TESTING-REFERENCE.md, ~/Development/APR-Dashboard-v3/docs/DROPDOWN-VS-REGISTRY-AUDIT.md]
---

# QA Brief — Create the V3.1 Valcre Custom Fields

## The decision that changed everything (Ben, 2026-06-05)
**We OWN the Valcre custom-field layer now. Chris is hands-off** — he deleted the unnecessary
custom fields this morning to clear the way so everything bases off ONE authority: the client
master's **Field Registry** tab, **"New Custom Valcre Field" = Yes** column. No more "wait for
Chris's rebuild" — that's done. You are not racing a moving target anymore; you build it.

## Source of truth
- **Client master V3.1:** `~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/client-source/Valta-Master-Field-Registry-v3.1-2026-06-05.xlsx`
  - **Field Registry** tab — the mapping authority. Columns that matter: VALTA Field Name, Data Control Type, Dropdown List, **New Custom Valcre Field (Yes/No)**, Valcre Field Name, **Valcre Field ID**, Valcre Record Location, **Valcre Field Key (API)**.
  - **Dropdown Lists** tab — the canonical option sets (ListAuthorizedUse, ListZoningStatus, etc.) — the OPTIONS each select-field gets.
  - **EA-HC Text** tab — narrative library (feeds the §10 EA/HCSummary / EADetail / HCDetail slots).
- **45 fields are flagged `New Custom = Yes`** (the build list). Includes the core dropdowns
  (Tenancy, AuthorizedUse, ZoningStatus, TransactionStatus, InterestAppraised, ValueScenarios,
  ApproachesToValue, AssignmentType, ReportType, ClientDocuments, PreviouslyAppraised, CMHCFinancing,
  LandMetric, Valuetimeframe, DesktopReport, DeliveryTime[Whole Number], Paid[Checkbox], the two
  Improvements state/status + current/proposed use fields) PLUS all the §10 cascade slots
  (ValueScenario1-6, EA/HCSummary1-6, EADetail1-6, HCDetail1-6).

## STEP 1 — Relearn how we did it before (don't reinvent)
We created a custom-field batch in Valcre on 2026-03-30 and passed every check. Read, in order:
1. `~/Development/APR-Dashboard-v3/builds/valcre-custom-fields-spec.md` — the pre-creation spec format to model on.
2. `~/Development/APR-Dashboard-v3/builds/VALCRE-CUSTOM-FIELDS-AUDIT.md` — what was built + verified.
3. `~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/Valcre-Integration/VALCRE-CUSTOM-FIELDS-ADMIN-DEFINITIONS.md` — the admin/definition mechanics.
4. Your own checkpoint #127 (the 3/30 creation session) + `APR-TESTING-REFERENCE.md` "VALTA Custom Fields" section.
Recover EXACTLY: how a custom field is created in Valcre (API endpoint or Admin UI), how a Select
field's option list is populated, how you captured each new **Field ID + API key**, and how you
read back (`GetValues?entityId=<id>&type=6`, resolve AvailableValueId — never trust the HTTP 200).

## STEP 2 — Produce the create-spec, then STOP and report to co-architect (GATE)
Build a spec table of all 45: for each — VALTA field name, Valcre control type (Select one / Select
multiple / Whole Number / Checkbox), and the exact option set from the Dropdown Lists tab.
**Report the spec to co-architect (dev-5) in your own pane and HOLD.** Do NOT bulk-create 45 fields
until co-architect confirms the list against the now-cleared Valcre. This is the one gate — we
verify the type + options are right before they go live, because re-deleting 45 wrong fields is the
expensive mistake.

## STEP 3 — Create (on co-architect's go)
Create each custom field in Valcre per the relearned method. Capture each new **Valcre Field ID +
API key** as you go. Rate-discipline + name-match guard (test job VAL261101 — watch the 2nd
"Westside Mall" decoy). **Never the "Test Data" button.**

## STEP 4 — Fill the table back for Chris's team
Write each new field's **Valcre Field ID** and **Valcre Field Key (API)** into the master's Field
Registry columns. That completed table is the deliverable Chris's team consumes. Save as a new
dated copy in `client-source/` — never overwrite the original V3.1.

## STEP 5 — Map + verify
Where the master says map-to-this-custom, re-point the app sync to the new field. Readback-verify
each (destination-side, name-match guarded). Per-field PASS/FAIL — the Field-Sync playbook discipline.

## Rules of engagement
- Load skills first: `/cli-apr-tools` (or the Valcre CLI helpers), `/cli-browser-auto` if UI-driven, and the access sheet `~/Development/APR-Dashboard-v3/docs/01-AGENT-ACCESS-LOGIN-PRIMING.md` for the Valcre login (warm session, don't hammer).
- **No multi-choice menus.** Pick the best option per the master + Iron Laws, report "Picked X, reason, proceeding." If genuinely stuck, plain-text "STUCK: <q>".
- **Pull-not-push.** Work in your own pane and write your status there — co-architect monitors it. Do NOT tmux-msg dev-5.
- The Field-Sync Verification playbook governs Step 5: `~/.claude/knowledge/playbooks/field-sync-verification-workflow.md`.
