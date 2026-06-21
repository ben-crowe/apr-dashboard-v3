# Codex brief — order the custom fields on ONE task (LOCKED, manual-sort approach)

**Target task:** `86e1yb8nz` — task name **"VALTA JOBS - Temp V2"** — https://app.clickup.com/t/8555561/86e1yb8nz (BC workspace). This ONE task only; confirm the task title reads "VALTA JOBS - Temp V2" before touching anything.

**What changed (why no more numbers):** our roadmap research found that ClickUp does NOT reliably order a task's fields by name — it always groups filled/pinned/required fields first, so a number-prefix hack scrambles on a real task. The proper lever is the **Custom Fields ClickApp → Manual sort → drag in the Custom Field Manager**. So: clean field names, set order by dragging. Full how-to in [ROADMAP-clickup-custom-fields-ui.md](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/ROADMAP-clickup-custom-fields-ui.md) — Codex reads it instead of searching.

**The order we want (clean names, no numbers — just dragged into these groups, top to bottom):**
Dates (Received, LOE Sent, LOE Signed, Delivery) → Job (APR Dashboard Link, Valcre Job, Job Number) → Client (Full Name, Email, Phone, Organization) → Property (Name, Address, Type) → Property Contact (Name, Email, Phone) → Appraisal Scope (Subtype, Interest Appraised, Authorized Use, State/Status of Improvements, Approaches to Value, Value Scenario(s), Report Type, Inspection Date) → Site/Transaction (Transaction Status, Zoning Status, Land $/Metric) → Team & Workflow (Phase Owner, Work Phase, the report checkboxes) → Notes (Notes, Task Type). Full list: [TARGET-task-field-layout.md](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/TARGET-task-field-layout.md) (ignore the numbers there — names only now).

---

## How to run Codex — STAGED, confirm-first (do NOT dump-and-go)

Run these in order. **Do not let Codex click anything until its Stage-2 repeat-back is clean.**

### Stage 0 — read the pre-research (no clicking)
```
Read this file fully — it's the ClickUp how-to roadmap we already researched for you, so you do NOT need to search or discover the UI:
  ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/ROADMAP-clickup-custom-fields-ui.md
Summarize back in 3-4 lines how field ordering actually works in ClickUp.
```

### Stage 1 — the job + the NOT-list (still no clicking)
```
The job, plain: ONE task (86e1yb8nz) already holds a set of CUSTOM FIELDS. We want those fields ORDERED into clean logical groups (Dates, Job, Client, Property, Property Contact, Appraisal Scope, Site/Transaction, Team & Workflow, Notes), with clean field NAMES (no number prefixes). You set the order via the Custom Fields ClickApp → Manual sort → drag in the Custom Field Manager — NOT by renaming.

You are NOT: making a task board, turning fields into columns or tasks, reordering List/Table view columns, deleting any field or dropdown option, or touching billing/sharing/settings/integrations/other tasks.
```

### Stage 2 — repeat back + WAIT for go
```
Before clicking anything, tell me in your own words: (1) what you're going to do, (2) the NOT-list, (3) the single mechanic that sets field order (answer: flip Custom Fields ClickApp to Manual, then drag in the Custom Field Manager — NOT renaming). Ask me anything unclear. Then STOP and wait for my "go".
```

### Stage 3 — execute (only after a clean Stage-2 confirm)
```
Go. (a) If any field still carries an old number prefix (e.g. "1.1"), rename it to its clean name. (b) Flip the Custom Fields ClickApp to Manual sort. (c) In the Custom Field Manager, drag the fields into the group order above. (d) Optionally PIN the fields so the order holds on real tasks (ClickUp floats filled/pinned fields first). (e) Create the status TAGS at the Space level: new arrival → loe sent → loe signed → awaiting payment → paid, plus an "apr hub" tag (cool/blue earliest → green paid).
Never delete a field or a dropdown option. When done, open task 86e1yb8nz and screenshot the field list in its new order; report anything you couldn't do.
```

### Bonus recon (optional, while you're in there)
```
If easy: with Chrome DevTools → Network open, capture the HTTP call ClickUp fires when you drag-reorder a field (URL + method + payload + auth). Save as ~/Development/APR-Dashboard-v3/tests/clickup-reorder-call.har (or copy-as-cURL) and hand it to qa-agent to try as a CLI. Caveat: it rides session auth, may be fragile — that's expected.
```

---

*Locked 2026-06-19 by qa-agent + Ben. Manual-sort approach (supersedes the number-prefix scheme after the roadmap research showed name-order is unreliable). Stays with qa-agent for the Codex handoff (not routed to co-arch). Follows the `/computer-use-prep` doctrine.*
