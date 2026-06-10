---
content_type: agent-brief
title: react-spec Brief — Re-point app to new custom fields + wire Status of Improvements + V07 go-live prep
status: ACTIVE — dispatched 2026-06-05 (Ben go)
owner: react-spec (executes) · co-architect (gate + conduit to Ben) · qa-agent (created the fields)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
filled_master: ~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/client-source/Valta-Master-Field-Registry-v3.1-2026-06-05-IDS-FILLED-2026-06-05.xlsx
tags: [apr-workflow, valcre, custom-fields, field-sync, loe-07, v07-go-live, section-10, docuseal, build-brief]
related: [~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/Valcre-Integration/BRIEF-QA-create-valcre-custom-fields-2026-06-05.md, ~/Development/APR-Dashboard-v3/builds/valcre-custom-fields-v3.1-create-spec.md, ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/loe07-build/LOE-TO-DOCUSEAL-FIELD-MAP.md, ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/loe07-build/V07-TO-APP-RECONCILIATION.md, ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-ECONTRACT-CREATOR-ARCHITECTURE.md]
---

# react-spec Brief — Re-point + Wire + V07 Go-Live Prep

## What just happened
QA created ALL 45 v3.1 custom fields in Valcre and readback-verified them. Every new field's
Valcre Field ID + API key is in the **filled master** (see frontmatter `filled_master`). The app
has NOT been touched — that's you, now, on Ben's go.

## The big-picture goal
Ship **V07 as the LIVE send contract**, done properly. This brief is **Phase A + B** of the
go-live sequence (ui-designer authored the full A→B→C→D). **The go-live flip (C) and the live
send test (D) gate through co-architect on Ben's explicit go — do NOT flip is_active yourself.**

## STEP A2 — Wire "Status of Improvements" end-to-end (PRIORITY — unlocks §10)
Today §10 can't fill for a real job because Status of Improvements isn't stored on the job.
- Add the **`status_of_improvements`** column to `job_loe_details` (migration — you have full Supabase access).
- Wire it: **intake / job-prep field → the job record → the new Valcre custom field** (ID in the filled master).
- Confirm the 7 statuses match the master's `ListStatusofImprovements` exactly (Improved - Completed · Improved - Renovated · Improved - Under Renovation · Improved - Proposed Renovation · Proposed - Vacant Land · Proposed - Improved Land (Demolition Required) · Proposed - Under Construction).

## STEP A2b — Re-point the other dashboard fields to the new custom fields (controlled pass)
Per the filled master, re-point each dashboard field that the master says maps-to-custom onto its
new custom field ID. **Controlled + readback-verified per field** (destination-side, never trust
the 200). This includes **D1 — Authorized Use:** the custom field now exists; re-point Authorized
Use OFF native `Job.IntendedUses` ONTO the new custom field per the master. (This was deliberately
deferred until the custom field existed — now it does.)

## STEP A3 — Verify §10 fills on the test job
On VAL261101 (name-match guard — watch the 2nd "Westside Mall" decoy): set Status of Improvements
→ regenerate V07 → confirm §10 fills (the right value scenarios + the EA/HC narrative text), and
confirm **NO stray `[tokens]`** anywhere in the render.

## STEP B4 — Token audit (V07 has its OWN placeholder vocabulary)
⚠ Each template version has a DIFFERENT token set — V07 uses different placeholder names than V3
(e.g. `[ClientFirstName]` vs v3's `[date.created]`), and **version-select must pair template +
the matching mapper**. Confirm V07's send path uses V07's mapper so every token resolves from real
job data. Audit the full V07 render — zero brackets may reach a client.

## STEP B5 — DocuSeal signature-field anchoring for V07 (HIGHEST-RISK correctness)
Signature / signatory / date anchor tags were positioned for the **V3 layout**. V07's structure
differs, so re-verify they land correctly on V07's pages. Ref: `LOE-TO-DOCUSEAL-FIELD-MAP.md`.
This is the single highest-risk correctness check before go-live — do it carefully.

## STOP HERE — report to co-architect
After A2/A2b/A3/B4/B5: report status to co-architect (dev-5) in your own pane. **Do NOT set
V07 is_active=true** — the go-live flip (C6) + the real-send test (D7) are a separate Ben gate.

## Rules of engagement
- Load `/cli-browser-auto` before any browser testing; use agent-browser (APR port 8086), not Playwright unless filling React controlled inputs. Access sheet: `~/Development/APR-Dashboard-v3/docs/01-AGENT-ACCESS-LOGIN-PRIMING.md`.
- Name-match guard on VAL261101 every Valcre write; **never the "Test Data" button**.
- No multi-choice menus — pick best per the master + Iron Laws, report "Picked X, reason, proceeding"; if truly stuck, plain-text "STUCK: <q>".
- Pull-not-push: work + status in your OWN pane; co-architect monitors it. Don't tmux-msg dev-5.
- TypeScript strict, no `any`; root-cause fixes, no band-aids (No Workarounds Rule). Commit when a slice is done.
- Field-Sync playbook governs the readback discipline: `~/.claude/knowledge/playbooks/field-sync-verification-workflow.md`.
