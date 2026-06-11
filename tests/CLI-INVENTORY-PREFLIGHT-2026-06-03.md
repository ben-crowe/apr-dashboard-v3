---
content_type: pointer-and-residual-findings
title: APR CLI Inventory — RETIRED into the cli-apr-tools skill (pointer + residual findings)
status: retired-into-skill — per-command inventory now lives as searchable rows in /cli-apr-tools
created: 2026-06-03
updated: 2026-06-10
last_reviewed: 2026-06-10
owner: qa-agent (curated) · ui-designer (skill curator) · co-architect
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
tags: [apr-workflow, apr-testing, cli-inventory, cli-apr-tools, ground-truth, loose-end]
---

# APR CLI Inventory — Retired into the Skill

**Tags:** #apr-testing #cli-inventory #cli-apr-tools #ground-truth #loose-end #apr-workflow
**Entities:** [[cli-apr-tools]] [[APR-Testing]]

> ## ⚠ THIS DOC IS RETIRED (2026-06-10)
> The per-command CLI inventory that used to live here is now **searchable rows inside the
> cli-apr-tools skill**, each carrying a `status` field (`exists` / `missing` / `broken`). A gap
> search returns the missing/broken items directly — no separate doc to drift. **Go to the skill, not
> this file, for "what CLI does X / does a CLI for X exist."**

## Where the inventory lives now

The skill is the single source of truth:

~/.claude/skills/cli-apr-tools/SKILL.md

Search it (a gap query returns "✗ MISSING — needs authoring" rows too):

```bash
python3 ~/.claude/skills/cli-apr-tools/scripts/search.py "reset test job"
python3 ~/.claude/skills/cli-apr-tools/scripts/search.py "verify clickup button"
python3 ~/.claude/skills/cli-apr-tools/scripts/search.py "get task"   # flags the broken script
```

Every on-disk `~/.claude/scripts/apr/` script is now a row (including the new button-verify CLI), the
broken `clickup-get-task.sh` is flagged `broken`, and the missing/needs-authoring capabilities
(valcre reset/delete/list-by-appraiser, clickup-update-checklist, resend get-email/domain-check,
docuseal get-submission/list, reset-test-state.sh) are rows with `status=missing`.

---

## Residual findings (NOT per-command — kept here on purpose)

These are constraints/decisions, not tool entries, so they stay in this doc.

### 1. Valcre has NO test environment — prod-as-Chris (hard constraint)

`valcre-auth.sh` authenticates as Chris (chris.chornohos@valta.ca) into **LIVE prod** with hardcoded
creds. Every Valcre call is prod-as-Chris. There are no job-CRUD scripts — the toolkit is field-level
only. **The only safe pattern is: pin ONE canonical job and modify-not-create. Never create or delete
a Valcre job in a test.** This elevates Ben's open Q5 (one pinned test job). (Also captured as the
`valcre-no-test-env-gotcha` row in the skill.)

### 2. ⚑ RECONCILE — ClickUp custom-field count is a 3-way drift (OPEN, do not assume)

The "all custom fields populated" assertion cannot be trusted until this is reconciled:

- The original inventory/doc claimed **49** fields.
- The 2026-06-03 preflight found **27** fields on the test list.
- The 2026-06-10 sync (qa, VAL261101) saw **19** columns on test list 901709622357.

Either the counts target different lists, or columns were added/removed between runs, or a doc is
stale. **Open question for the team: which list + which count is canonical?** Until resolved, do not
report a fixed "N fields synced" number as ground truth.

### 3. Bottom line for the team (still current)

- **ClickUp + Supabase** = ready for the API-layer checks (one gap: `clickup-update-checklist`).
- **DocuSeal + Resend** = need thin read-only wrappers authored, or lean on Codex/app for the rest.
- **Valcre** = the real constraint (single live prod env as Chris — see finding 1).
- **Codex** earns its place exactly where CLIs are missing/risky: intake form-fill + DocuSeal portal-sign.

## Related

- [cli-apr-tools skill](~/.claude/skills/cli-apr-tools/SKILL.md) — the live searchable inventory.
- [E2E Testing Workflow — Master Plan](~/Development/APR-Dashboard-v3/tests/E2E-TESTING-WORKFLOW-MASTER.md) — the pipeline this tooling serves.
- [ClickUp Sync — CANONICAL](~/Development/APR-Dashboard-v3/docs/Features/04-Job%20&%20Client%20Mgt./CLICKUP-SYNC-CANONICAL.md) — the field-sync model.

---

**Last reviewed:** 2026-06-10 by qa-agent — retired the per-command inventory into the cli-apr-tools
skill (searchable rows + status field); kept the Valcre prod-as-Chris constraint, the 3-way
field-count RECONCILE flag, and the team bottom-line here.
