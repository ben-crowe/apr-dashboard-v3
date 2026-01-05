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

## Completed Tasks

*(Move tasks here when done, with completion date)*

---

## Notes

- This file is the persistent task tracker for APR Dashboard V3
- Claude should check this at session start
- Add new tasks with Status: PENDING
- Include context so future sessions understand the task
- Link from Master Knowledge File for discoverability
