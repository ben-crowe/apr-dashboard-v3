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

## Supporting Files

Files present in this folder that are not part of the v6 production lineage. Kept for reference.

| File | Description |
|------|-------------|
| `conditional-field-picker.html` | Standalone cascade logic demo showing Field Registry with cascading rules (Property Type → Property Rights, Status of Improvements → Value Scenarios chain). Early exploration of the cascade behavior that eventually informed the Logic tab. |
| `new-field-panel-additions.html` | CSS/HTML/JS snippet file — additive code blocks intended to graft a slide-out "New Field Registration" panel onto v5. Not a standalone page; parts were superseded by the inline row approach in v6. |
| `sc-component-library.html` | Dark-theme SC component library reference page (title: "SC Component Library"). Three-panel layout showing UI components used across the Valta design system. |
| `sc-lib-screenshot.png` | Screenshot of `sc-component-library.html` — visual reference for the SC component library. |
| `sc-verify.png` | Verification screenshot; likely a QA capture confirming a design or layout state. Exact context not determinable from the image filename alone. |
| `valta-controls-v3.html` | Standalone control-type component library (title: "Valta Controls — v3") showing light and dark theme variants of form controls used in the Valta UI. |

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
