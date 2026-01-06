# APR Dashboard V3 - Pending Tasks

> **For Claude:** Check this file at session start. These are tasks that MUST get done. Ask user when to execute - don't auto-start without permission.

---

## Active Tasks

### 1. Map Title Default Experience (Hybrid Approach)

**Status:** PENDING
**Priority:** Medium
**Added:** 2026-01-05

**Problem:**
- When template loads with no data, field-mapped titles show blank
- When user deletes an image, the title also disappears
- Poor UX for new users seeing empty template

**Current State:**
Map titles changed from hardcoded to field-mapped:
```html
<!-- Was hardcoded (always shows, not editable) -->
<div class="Header2">Regional Context Map</div>

<!-- Now field-mapped (editable, but blank when empty) -->
<div class="Header2">
  <span class="field-mapped" title="{{img-map-regional-title}}">{{img-map-regional-title}}</span>
</div>
```

**Proposed Fix - HYBRID approach:**
```html
<div class="Header2">
  <span class="field-mapped" data-sample="Regional Context Map" title="{{img-map-regional-title}}">{{img-map-regional-title}}</span>
</div>
```

**Why this works:**
- `data-sample` shows as placeholder text when field is empty
- User sees pre-named sections on fresh template
- Still editable in preview
- Best of both worlds

**Files to check/modify:**
- `public/Report-MF-template.html` - Add `data-sample` to map title spans
- Verify `interpolateTemplate()` respects `data-sample` fallback

**Acceptance Criteria:**
- [ ] Fresh template shows "Regional Context Map", "Local Area Map", etc.
- [ ] Titles are editable in preview
- [ ] Empty field shows data-sample value, not blank
- [ ] Deleting image doesn't blank out section title

---

### 2. Docs Folder Cleanup

**Status:** PENDING
**Priority:** Low (housekeeping)
**Added:** 2026-01-06 (Session: Orchestrator System #5)

**Problem:**
- 38 loose files sitting at `docs/` root with no home
- Some numbered folders (01-15) missing README files
- Folders without clear purpose shouldn't exist

**The Mess:**
- API/field mapping files (8) → should go in `07-Valcre-Integration/` or field folder
- Image pattern files (5) → should go in `patterns/`
- TDD/Template files (6) → should go in `15-Contract-review/` or `APR-Domain Mgr/`
- PropertyType files (3) → should go in `07-Valcre-Integration/`
- Architecture files (5) → should go in `APR-Domain Mgr/`
- Asset files (4 PNG/SVG) → should go in `assets/`
- Orphaned/misc (7) → archive or delete

**Principles:**
1. Every folder needs a README explaining its purpose
2. Every folder needs a clear purpose - or delete it
3. No loose files at docs root - everything has a home

**Execution:**
- **See deployment brief:** `docs/agent-briefs/BRIEF-docs-cleanup.md`
- Research completed by 4 Haiku agents (analyzed all 38 files)
- Brief contains detailed file moves, folder structure, and 5-phase plan
- Deploy sub-agents per brief instructions

**Acceptance Criteria:**
- [ ] Zero loose files at docs/ root (except main README.md)
- [ ] All 15 numbered folders have README.md
- [ ] Each README explains folder purpose in 1-2 sentences
- [ ] Assets consolidated in one location

---

## Completed Tasks

*(Move tasks here when done, with completion date)*

---

## Notes

- This file is the persistent task tracker for APR Dashboard V3
- Claude should check this at session start
- Add new tasks with Status: PENDING
- Include context so future sessions understand the task
- Link from Master Knowledge File for discoverability
