---
title: "Codex / Computer-Use Prompt — rebuild the APR ClickUp setup in the client's Valta workspace"
status: DRAFT — for qa-agent /review-gate, then Ben
created: 2026-06-18
owner: co-architect (author) · qa-agent (gate) · Ben (runs Codex / supplies Valta access)
tags: [apr-workflow, clickup, codex, computer-use, valta, rebuild, prompt, cutover]
---

**Tags:** #apr-workflow #clickup #codex #computer-use #valta #rebuild #prompt
**Entities:** [[ClickUp]] [[Valta workspace]] [[Codex]]
**Backlink:** [APR Master Dashboard](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md)
**Related:** [Migration Playbook](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/MIGRATION-PLAYBOOK-clickup-to-valta.md) · [ClickUp Custom-Fields Change Request](~/Development/APR-Dashboard-v3/docs/Features/04-Job%20%26%20Client%20Mgt./CHANGE-REQUEST-clickup-custom-fields.md)

---

# Codex / Computer-Use Prompt — rebuild the APR ClickUp setup in Valta

> **Target = BEN's own ClickUp account / test list FIRST (decided 2026-06-18).** We do NOT test the reorg theory live in the client's account. Codex reorganizes the existing setup on **Ben's** list into the grouped structure below; once it's right, we **save it as a Space template and import it into the client's Valta workspace** (per the [Migration Playbook](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/MIGRATION-PLAYBOOK-clickup-to-valta.md)) — so Codex never has to build anything in the client's account. This drives **Codex via computer-use in the UI** — no API/CLI, no tokens for the build itself. Codex built this setup once already, so the reorg is well within reach.
>
> **Build only the CONFIGURATION layer.** The integration layer (DocuSeal/Resend/QuickBooks/webhook tokens + Valta IDs) is re-pointed separately per the playbook — NOT in this prompt.

---

## The prompt (paste to Codex)

```
You are configuring a ClickUp workspace via the browser UI (computer-use). Target: BEN'S OWN ClickUp account — the APR appraisal TEST job list (NOT the client's account). Reorganize the existing setup into the EXACT structure below (add/rename/reorder fields, add the divider headers, create the tags). This list will later be saved as a template and imported into the client's Valta workspace, so get it pixel-right here. Work only in the ClickUp UI — no API, no CLI. If you can't find a control, describe what you see and stop; do not guess destructive actions.

GOAL: a job task in this list carries the custom fields, the status-tag pipeline, and the per-job workflow subtasks defined below, so every new appraisal job is tracked consistently.

=== 1. STATUS TAGS (create as list/Space tags, in this order) ===
Create these workflow tags (the team reads job state from the colored tag, not the native Status):
  new arrival  →  loe sent  →  loe signed  →  awaiting payment  →  paid
Also keep an "apr hub" category tag (not part of the status flow).
Give them distinct colors, lightest/earliest = cool (blue) through to paid = green.

=== 2. CUSTOM FIELDS (create on the list, NAME them with a number prefix to control order) ===
Create these with a number prefix in the NAME so ClickUp sorts them in this grouped order (tens-blocks; DATES first as a job snapshot). The "NN ━━ TITLE ━━" rows are DIVIDER fields — Text type, left PERMANENTLY BLANK, the section-title hack (ClickUp has no native field dividers). 18 real fields + 5 dividers = 23 total:
  10 ━━ DATES ━━             (Text — blank divider)
  11 Received Date           (Date)
  12 LOE Sent                (Date)
  13 LOE Signed              (Date)
  14 Delivery Date           (Date — auto-stamped at LOE send = send date + the delivery weeks; see note)
  20 ━━ JOB ━━               (Text — blank divider)
  21 APR Dashboard Link      (URL)
  22 Valcre Job              (URL — see note on anchor text)
  23 Job Number              (Text)
  30 ━━ CLIENT ━━            (Text — blank divider)
  31 Client First Name       (Text)
  32 Client Last Name        (Text)
  33 Client Organization     (Text)
  34 Client Email            (Email)
  35 Client Phone            (Phone)
  40 ━━ PROPERTY ━━          (Text — blank divider)
  41 Property Name           (Text)
  42 Property Address        (Text)
  43 Property Type           (Text — NOT a drop-down; see type rule below)
  50 ━━ PROPERTY CONTACT ━━  (Text — blank divider)
  51 Contact Name            (Text)
  52 Contact Email           (Email)
  53 Contact Phone           (Phone)
After creating, HIDE the 5 divider fields in the table/board views (show them only in the task-detail field list, where they read as section headers). Leave their values empty forever.
TYPE RULE: NO drop-down/select fields — ClickUp is a read-only MIRROR of the dashboard (no sync-back), so a dropdown's input constraint adds nothing. Everything keeps its natural type as listed (dates = Date, links = URL, email = Email, phone = Phone, divider headers = blank Text); Property Type is plain Text.
Do NOT create: Asset Condition, Job Status (clashes with the status tag), Property Rights, Valuation Premises, Report Type, Payment Terms, Scope of Work, Property Use, Condition. (Full detail lives in the APR dashboard, reached via the APR Dashboard Link field.)
NOTE: the date fields (Received/LOE Sent/LOE Signed) intentionally duplicate description text — as real Date fields they support sort/filter/automation that description text can't. They are DISTINCT from the status tag (tag = current state; these = actual timestamps).

=== 3. PER-JOB WORKFLOW STEPS = CHECKBOX custom fields (board columns) ===
RESOLVED from the client's live Valta board: these are CHECKBOX custom fields — ONE per step, each a numbered column on the board — NOT subtasks and NOT a checklist. The board is one row per job; the team checks each step off per job and reads progress across the columns. Number-prefix each checkbox field name to order the columns. Checkbox is a boolean type (the "no drop-down" rule does not apply — checkboxes are correct here).
⏳ Exact NAMES + numbers PENDING Ben (he's fetching them from the live board). Provisional set:
  1. Create & Send LOE
  2. Plan Job
  3. Pull (TTSZ) Tax, Title, Site Plan, Zoning
  4. Tour Property
  5. Sale and Lease Comps
  6. Build Front End
  7. Complete Valuation
  8. Send to Client
  9. Book Job

=== 4. VERIFY (report back, with screenshots) ===
- All 5 status tags exist + the apr hub tag; list them.
- All 23 fields exist (18 real + 5 blank divider/header fields) with the exact "NN " prefixed names + correct types; list them in order. The 5 dividers are hidden in table/board views.
- The 9 workflow-step CHECKBOX custom fields exist as numbered columns on the board (boolean/checkbox type), names matching Ben's confirmed list.
- Flag anything you could NOT create and why.

DO NOT touch billing, sharing/permissions, workspace settings, or any integration/webhook config. Configuration only.
```

---

## Notes for whoever runs this

- **Delivery Date (field 14)** is an auto-computed actual date = LOE-send date + the delivery-weeks value (e.g. sent today + 3 weeks); the contract itself keeps its relative "[X] weeks from payment/signing" wording. The card field is populated by the integration layer at send — Codex just creates the field; it doesn't compute the date.
- **Workflow steps (section 3) = checkbox custom-field COLUMNS** (resolved from the client's live board — not subtasks, not a checklist). Exact names + numbers pending Ben's list from the board.
- **Integration re-point is separate** — after the config exists in Valta, follow the [Migration Playbook](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/MIGRATION-PLAYBOOK-clickup-to-valta.md) steps 5–7 (Valta token + new IDs → re-point DocuSeal/Resend/QBO → recreate the ClickUp webhook → test one signing).

---

*Authored 2026-06-18 by co-architect from qa-agent's research findings, for QA `/review-gate` then Ben. Companion to the Migration Playbook.*
