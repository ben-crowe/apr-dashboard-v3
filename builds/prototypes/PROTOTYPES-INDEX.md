# Field Registry Explorer — Prototype Index

**Production prototype:** `valta-field-registry-explorer-v6.html`
**Live URL:** https://apr-dashboard-v3.vercel.app/field-registry-v6.html
**Base (do not modify):** `valta-field-registry-explorer-v5.html` (hash: 05b9a997)

---

## Production

| File | Description |
|------|-------------|
| `valta-field-registry-explorer-v6.html` | Production-ready. Inline add/edit, guided step sequence, column manager, audit panel, Logic tab with Group 3 config. |

## Design Exploration (reference only)

| File | Approach | Notes |
|------|----------|-------|
| `valta-field-registry-NEW-FIELD-mockup.html` | Slide-out panel | First approach. Replaced by inline. |
| `valta-field-registry-v7-inline-row.html` | Inline row expand | Click row, form expands below. |
| `valta-field-registry-v8-grouped.html` | Grouped categories | Category tabs, cascade tab. |
| `valta-field-registry-v9-modal.html` | Modal with context | Split view — left list, right form. |
| `valta-field-registry-v10-simple-add.html` | Spreadsheet add | Dev reference for v6. Has Fill Example + version nav. |
| `valta-field-registry-v11-client-simple.html` | Client-simple | Abandoned — rewrote table layout. |

## Specs

| File | Description |
|------|-------------|
| `v10-field-edit-spec.md` | Visual states spec for field add/edit behavior (States 1-13). |

## Key Decisions

1. **v10 won** — spreadsheet-style inline add/edit is the most direct and natural.
2. **Client sees 4 editable columns** — Label, Control Type (simplified), Role, Dropdown List. Everything else auto-generated or read-only.
3. **Field Name auto-generated** from Label (camelCase). Never client-editable.
4. **New fields start as Pending**. Existing fields show Active.
5. **Dropdown expand defaults to view-only**. Edit is opt-in via "edit options" link.
6. **Column visibility + reorder** via cog panel. Persists to localStorage.
7. **Audit** is a slide-out panel, not a separate tab.
8. **Logic configuration** happens on the Logic Fields tab with Group 3 placeholder pattern.
9. **Placement** (which form/section a field appears on) is a separate future feature — not part of field registration.
