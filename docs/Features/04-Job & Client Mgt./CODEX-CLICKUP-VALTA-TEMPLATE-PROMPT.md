---
content_type: deploy-prompt
title: Codex Prompt — Remake the ClickUp Job-Hub Template on the Client's Valta Workspace
status: ready-to-deploy
created: 2026-06-11
owner: co-architect (authored) · Codex (executes in-UI) · Ben (opens ClickUp, shares the workspace)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
tags: [apr-workflow, clickup, codex, deploy-prompt, job-hub, template, valta, custom-fields]
---

# Codex Prompt — ClickUp Job-Hub Template on the Valta Workspace

**Tags:** #clickup #codex #deploy-prompt #job-hub #template #valta
**Entities:** [[ClickUp-Job-Hub]] [[APR-Dashboard]]

**↑ Home:** [APR Master Dashboard](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md)

**What this is:** the ready-to-paste Codex prompt to build the APR Job-Hub task template on the **client's live Valta ClickUp workspace** — a UI-only job (ClickUp's API can't create custom-field definitions or save templates). Ben opens ClickUp (shared access); Codex drives the UI. Source of truth for the field set: [03-CLICKUP-JOB-HUB-SPEC](~/Development/APR-Dashboard-v3/Data-Flow%20Visuals/03-CLICKUP-JOB-HUB-SPEC.md).

---

## (1) Ben opens this

The **Valta workspace** in ClickUp (Ben has shared access), on the production job list:
- Workspace/team: **Valta** (`9014181018`)
- List: **`901402094744`**
- (Existing template to compare/replace: `t-86b3exqe8`)

Open ClickUp to that list, signed in, then hand to Codex.

## (2) Codex prompt (paste verbatim)

```
You are operating ClickUp directly in the browser via computer-use. Ben has the Valta
workspace open on list 901402094744. Your job: build a task that carries the APR Job-Hub
custom-field set, then SAVE IT AS A TEMPLATE. UI-only — do not use the API.

GOAL: a "Job Hub" task template on this list with EXACTLY the 19 custom fields below, each
created as TEXT type (one-way display fields — the dashboard pushes values in; nobody picks
in ClickUp, so NO dropdowns, NO option lists). If a field with the same name already exists
on the list, reuse it — do not duplicate. You may search ClickUp's help UI if a control has
moved; adapt, don't get stuck.

CREATE these 19 custom fields (TEXT type), grouped in this order:
  Links:    Job Number · APR Dashboard Link · Valcre Job Link
  Summary:  Client First Name · Client Last Name · Client Organization · Client Email ·
            Property Name · Property Address · Property Type · Report Type · Intended Use ·
            Property Rights · Scope of Work · Payment Terms · Appraisal Fee
  Dates:    Received Date · Delivery Date · LOE Sent · LOE Signed

Do NOT add any other custom fields. Specifically do NOT create: Client Title, Client Phone,
Client Address, Property Contact fields, Job Status, Asset Condition, Valuation Premises,
Notes, Property Subtype, Tenancy. (These are intentionally excluded from the hub.)

STEPS:
1. On list 901402094744, create a task named "Job Hub Template".
2. For each of the 19 fields: add a custom field of TYPE = Text with the exact name above.
   Reuse any same-named field that already exists; never duplicate.
3. Confirm all 19 are present on the task (screenshot the custom-fields panel).
4. Save the task AS A TEMPLATE: task menu -> Templates -> Save as Template. Name it
   "APR Job Hub". Include custom fields in the template. Make it available to the whole list/Space.
5. Report back: the template name, that all 19 fields are TEXT type, a screenshot of the
   fields, and any field you had to reuse vs create.

IMPORTANT: TEXT type for every field (so the dashboard's by-name value push lands verbatim with
zero option-matching). Do not invent fields. Do not touch existing tasks' data.
```

## (3) What Codex returns

- Confirmation the "APR Job Hub" template exists on list `901402094744` with all 19 fields as TEXT.
- A screenshot of the custom-fields panel.
- Which fields were reused vs newly created.

## (4) Why this works with zero code change

The edge function (`create-clickup-task` / `buildHubCustomFields`) resolves custom fields **byName** at runtime — so the instant these 19 named columns exist on the Valta list, the integration populates them with **no redeploy**. Field IDs are per-list, so byName (not byId) is what makes the template replicate cleanly from test → Valta.

---

**Last reviewed:** 2026-06-11 by co-architect — authored as the ready-to-deploy Codex prompt for the Valta-workspace template remake, built from the locked 19-field Job-Hub spec (TEXT-type, one-way). Deploy anytime on Ben's go.
