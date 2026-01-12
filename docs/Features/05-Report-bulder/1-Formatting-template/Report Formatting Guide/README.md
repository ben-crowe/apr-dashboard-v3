# Report Formatting Guide

**Status**: 📦 ARCHIVED - Files migrated to Phase 16 & 17 (2026-01-09)

Reference documentation for APR Report Template formatting and systems.

---

## Migration Notice

**Date**: 2026-01-09

Active reference files have been reorganized into their proper phase folders for better organization:

### Files Moved to Phase 17: Template Management

| Original File | New Location | Purpose |
|--------------|--------------|---------|
| `compact-styling-guide.md` | `docs/17-Template-Management/COMPACT-STYLING-GUIDE.md` | CSS compression for page overflow |
| `field-toggle-system.md` | `docs/17-Template-Management/FIELD-TOGGLE-SYSTEM.md` | Dev Mode vs User Ready toggle |

**Why moved**: These are template HTML/CSS management concerns.

### Files Moved to Phase 16: Field Input-Output Mapping

| Original File | New Location | Purpose |
|--------------|--------------|---------|
| `field-registry-guide.md` | `docs/16-Field-Input-Output-Mapping/FIELD-REGISTRY-GUIDE.md` | Field naming, inputSource, 4-file sync |

**Why moved**: This is field definition and mapping infrastructure.

### Files Archived

| Original File | New Location | Status |
|--------------|--------------|--------|
| `agent-mgr-progress.md` | `archive-2026-01-09/agent-mgr-progress.md` | Historical progress log |
| `Registry fix report/` | `archive-2026-01-09/Registry fix report/` | Completed audit work |

**Why archived**: Historical work from contract review phase, no longer actively referenced.

### Files Remaining in Phase 15

| File | Status | Notes |
|------|--------|-------|
| `apr-system-context.md` | Active | System overview, may move to `.agent/system/` later |

---

## Quick Links to New Locations

**Need field naming conventions?**
→ [docs/16-Field-Input-Output-Mapping/FIELD-REGISTRY-GUIDE.md](../../../16-Field-Input-Output-Mapping/FIELD-REGISTRY-GUIDE.md)

**Need CSS compression for page overflow?**
→ [docs/17-Template-Management/COMPACT-STYLING-GUIDE.md](../../../17-Template-Management/COMPACT-STYLING-GUIDE.md)

**Need Dev Mode vs User Ready toggle info?**
→ [docs/17-Template-Management/FIELD-TOGGLE-SYSTEM.md](../../../17-Template-Management/FIELD-TOGGLE-SYSTEM.md)

**Need template design standards?**
→ [docs/17-Template-Management/DESIGN-STANDARDS.md](../../../17-Template-Management/DESIGN-STANDARDS.md)

---

## Original Files in This Folder (Before Migration)

| File | Purpose | Use When |
|------|---------|----------|
| `agent-mgr-progress.md` | Agent progress log, session notes, pending tasks | Tracking work done, continuing sessions |
| `apr-system-context.md` | 4-stage system overview, architecture, key files | Getting up to speed on APR system |
| `compact-styling-guide.md` | CSS techniques for preventing page overflow | Page content extends into footer |
| `field-registry-guide.md` | Field registry structure, naming, 4-file sync | Adding/fixing fields, registry errors |
| `field-toggle-system.md` | Two-mode field display (Dev/User Ready) | Understanding or modifying toggle behavior |

---

## Related Files (Outside This Folder)

- **Template:** `/public/Report-MF-template.html`
- **Field Registry:** `/src/features/report-builder/schema/fieldRegistry.ts`
- **Phase 16 Docs:** `/docs/16-Field-Input-Output-Mapping/`
- **Phase 17 Docs:** `/docs/17-Template-Management/`

---

**Last Updated**: 2026-01-09
**Migration Completed**: All active files moved to Phase 16/17
