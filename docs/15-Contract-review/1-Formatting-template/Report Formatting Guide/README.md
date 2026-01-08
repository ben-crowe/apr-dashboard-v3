# Report Formatting Guide

Reference documentation for APR Report Template formatting and systems.

---

## Files in This Folder

| File | Purpose | Use When |
|------|---------|----------|
| `agent-mgr-progress.md` | Agent progress log, session notes, pending tasks | Tracking work done, continuing sessions |
| `apr-system-context.md` | 4-stage system overview, architecture, key files | Getting up to speed on APR system |
| `compact-styling-guide.md` | CSS techniques for preventing page overflow | Page content extends into footer |
| `field-registry-guide.md` | Field registry structure, naming, 4-file sync | Adding/fixing fields, registry errors |
| `field-toggle-system.md` | Two-mode field display (Dev/User Ready) | Understanding or modifying toggle behavior |

---

## Quick Links

### Compact Styling
**Problem:** Page content overflows into footer area
**Solution:** Apply progressive compression (font, padding, line-height)
**File:** `./compact-styling-guide.md`

### Field Toggle System
**Problem:** Need to switch between raw field IDs and sample data
**Solution:** Toggle between Dev Mode and User Ready Mode
**File:** `./field-toggle-system.md`

---

## Related Commands

| Command | Description |
|---------|-------------|
| `/check-apr-temp-formatting` | Load compact styling guide |

---

## Related Files (Outside This Folder)

- **Template:** `/public/Report-MF-template.html`
- **Issue Tracker:** `/.claude/plans/template-page-review.md`
- **Field Registry:** `/src/features/report-builder/data/fieldRegistry.ts`
