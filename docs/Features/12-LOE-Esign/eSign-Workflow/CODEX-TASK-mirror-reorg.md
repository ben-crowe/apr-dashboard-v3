# Codex Task — rename the Valta Mirror fields to single-digit groups (LOCKED)

**Target:** the **"APR Test - Valta Mirror"** list in Ben's BC ClickUp workspace (the imported VALTA JOBS - Temp V2 template). NOT the client's account. NOT the live-wired dashboard list. Only this mirror. Work in the ClickUp UI (computer-use) — no API (ClickUp can't rename field definitions via API).

**Exact names are LOCKED in:** [TARGET-task-field-layout.md](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/TARGET-task-field-layout.md) — copy each Name verbatim.

**Scheme:** every field's Name = one group digit + a space + its own name (e.g. `1 Received Date`, `3 Client Email`, `6 Interest Appraised`). Same digit = same group; ClickUp sorts fields by name so they cluster. No title/header fields, no decimals. Within-group order doesn't matter.

---

## The prompt (paste to Codex when it's back online)

```
You are configuring a ClickUp list via the browser UI (computer-use). Target = BEN'S OWN account, the "APR Test - Valta Mirror" list. Work only in the ClickUp UI. NEVER delete a field or a drop-down option. If a control is missing or an action looks destructive, describe what you see and STOP.

THE JOB: rename every custom field so its name = its group digit + a space + its own name, per the locked target. Open this file and copy each Name verbatim:
  ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/TARGET-task-field-layout.md

KEY MECHANIC (why your earlier attempt looked like it failed): ClickUp orders a task's custom fields ALPHANUMERICALLY BY NAME. There is NO drag. Renaming is the only lever, and you must rename ALL fields in one pass — renaming only a few barely moves the order so it looks like nothing happened. Leave NONE on the old import names (1.0/2.1 style).

STEPS:
1. Rename each existing field to "<digit> <name>" from the file (e.g. "1 Received Date"). Keep each field's type and its drop-down options exactly — only the NAME changes.
2. CREATE any of our fields that don't exist yet (the group 1-5 "we feed" ones: the dates, APR Dashboard Link, Valcre Job, Job Number, the Client fields, the Contact fields) with the right digit prefix and type.
3. There are NO header/divider fields in this scheme — do not create any.
4. Create the status TAGS: new arrival → loe sent → loe signed → awaiting payment → paid, plus an "apr hub" tag. Cool (blue) earliest → green (paid).
5. Reload a job task's detail view and CONFIRM the fields now cluster by their digit (all 1s together, then 2s, etc.).

VERIFY (report back with a task-detail screenshot): fields cluster by digit per the target file; all drop-down options intact; list anything you could not do. Do NOT touch billing, sharing, workspace settings, or integrations.
```

---

*Locked 2026-06-18 by qa-agent + Ben (single-digit group scheme). Names live in [TARGET-task-field-layout.md](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/TARGET-task-field-layout.md).*
