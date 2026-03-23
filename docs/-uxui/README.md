# docs/-uxui/ — UX/UI Documentation

All UX/UI behavior documentation for APR Dashboard v3 lives here. This folder is **unnumbered** — it's a permanent, cross-cutting reference that sits at the top of the docs directory.

## Files

| File | Purpose | Owner |
|------|---------|-------|
| `UX-MASTER.md` | Unified UX reference — single source of truth for all app behavior | UX Designer agent |
| `UX-Feature-Commits.md` | Commit tracking dashboard — what was built, when, commit to revert | All agents (mandatory) |
| `README.md` | This file — index, workflow, template | All agents |
| `N-feature-name.md` | Individual feature captures (singles) — written by any dev agent | Any agent |

## UX-MASTER.md

The master doc is the canonical reference. If it conflicts with a single, the master wins.

**Maintained by:** UX Designer agent
**Do not edit directly** — drop a single file and the UX Designer will merge it.

## Folder Structure

```
docs/-uxui/
  UX-MASTER.md           <- single source of truth (placeholder, to be populated)
  UX-Feature-Commits.md  <- commit tracking dashboard (mandatory)
  README.md              <- this file
  [singles]              <- all singles stay here permanently (no processed/ folder)
```

## How to Document a New UX Feature (For Dev Agents)

When Ben says "document this UX behavior" or "note how this works":

1. **Create a single file** in this folder (`docs/-uxui/`)
2. **Naming:** `N-short-name.md` where N is the next available number
3. **Check existing singles** to find the next number: `ls docs/-uxui/[0-9]*.md`
4. **Add frontmatter** at the top:
   ```yaml
   ---
   status: active
   in_master: false
   updated: 2026-03-23
   description: "One-line summary"
   ---
   ```
5. **Content:** Describe the behavior as specifically as possible:
   - What triggers it (click, hover, form submit, keyboard)
   - What happens visually (animation, transition, layout shift)
   - What persists (Supabase, localStorage, URL state)
   - Edge cases you discovered
   - Implementation files involved
6. **If you fix this feature again later**, don't create a new file — update the same single and add a changelog entry at the bottom with the date and what changed
7. **Do NOT update UX-MASTER.md** — the UX Designer handles merging
8. **Do NOT duplicate** — if the behavior is already in the master, update the single with what changed

### Template

```markdown
---
status: active
in_master: false
description: "Feature Name — one-line summary"
---

# Feature Name

## Behavior

[What it does, triggered by what, visual result]

## Rules

- [Specific rule 1]
- [Specific rule 2]

## Edge Cases

- [Thing that breaks if you're not careful]

## Files

| File | What |
|------|------|
| `src/features/...` | [role] |

## Changelog

- YYYY-MM-DD: Initial documentation
```

### Frontmatter Lifecycle Fields

Singles stay in place permanently. No `processed/` folder. Frontmatter tracks the full lifecycle:

| Field | Values | Purpose |
|-------|--------|---------|
| `status` | `active` / `merged` | Whether the single has been merged into UX-MASTER |
| `in_master` | `true` / `false` | Whether UX-MASTER covers this topic |
| `merged_date` | `YYYY-MM-DD` | When the single was last merged into UX-MASTER |
| `updated` | `YYYY-MM-DD` | When the single file was last modified |

**Merge check:** If `updated` is newer than `merged_date`, the single needs re-merging — the feature was updated after the last merge.

---

## What Goes Here

- Form behavior (submission, validation, auto-save, field expand/collapse)
- Panel behavior (open, close, resize, split)
- Report Builder interactions (edit panel, preview, field registry)
- LOE document editor behavior (inline editing, auto-resize, layout)
- Calculator interactions (tab navigation, editable cells)
- Modal and dialog behaviors
- Navigation patterns (dashboard tabs, sidebar, routing)
- Known UX bugs and recurring fix cycles
- Branding and visual system rules

## What Does NOT Go Here

- Architecture decisions -> `CLAUDE.md`
- Integration deep-dives (Supabase, Valcre, DocuSeal) -> `docs/Features/`
- Build specs / migration plans -> `docs/Architecture/`
- Field registry definitions -> `docs/Features/08-Master-Field-Registry/`
- Template structure -> `docs/Features/09-Template-Management/`

---

## UX-Feature-Commits Workflow — MANDATORY

**Before and after any UI/UX work, read and update `docs/-uxui/UX-Feature-Commits.md`.**

This is the single reference for what was built, when, and the commit to revert if something breaks.

- Read before starting: understand what already exists and what's pending
- Write after completing: add commit hash, date, description, status
- If reverting or replacing a previous commit: update its status to "Reverted"
