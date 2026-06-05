# Valta Field Registry Explorer — Prototypes

## What This Is

The Valta Field Registry Explorer is a client-facing configuration UI for managing fields used in writing the Letter of Engagement (LOE) and the appraisal proposal. It lets the client (Chris) browse fields, add new ones, control their labels and control types, define dropdown options, and flag logic relationships — all in a spreadsheet-style interface that stays out of the way of non-technical users.

The app is built around the client's existing Excel-driven field workflow and translates that into an interactive tool the client can use directly, without needing to understand the underlying registry schema.

This is distinct from the Master Field Registry (see Relationship section below): Valta's scope is narrower and its interface is intentionally simpler.

**Production prototype:** `valta-field-registry-explorer-v6.html`
**Live deployment:** https://apr-dashboard-v3.vercel.app/field-registry-v6.html

---

## What the App Does

- Browse all registered fields in a searchable, sortable table
- Add new fields via inline row insertion (spreadsheet-style — no modal, no panel)
- Edit four client-facing columns: Label, Control Type, Role, Dropdown List
- Field Name (camelCase key) is auto-generated from Label — never client-editable
- New fields start in Pending status; existing fields show Active
- Column visibility and order are configurable via a cog panel, persisted to localStorage
- Logic tab shows Group 3 cascade configuration (which fields auto-set based on other picks)
- Audit panel is a slide-out, not a separate route

The interface scope is LOE + proposal fields — not the full appraisal report. Deep report-builder properties (calculation formulas, output mappings, Valcre API coordinates) are not surfaced here.

---

## Folder Map

See [PROTOTYPES-INDEX.md](PROTOTYPES-INDEX.md) for the authoritative file list, version history, and key design decisions. Summary:

**Production**
- `valta-field-registry-explorer-v6.html` — production-ready, do not modify casually

**Base (locked)**
- `valta-field-registry-explorer-v5.html` — hash-locked base. Do not modify.

**Design iterations (reference only)**
- `valta-field-registry-NEW-FIELD-mockup.html` — slide-out panel approach, replaced by inline
- `valta-field-registry-v7-inline-row.html` through `v11-client-simple.html` — alternate UI patterns explored before v6 was finalized

**Specs**
- `v10-field-edit-spec.md` — visual states spec (States 1-13) for inline add/edit behavior
- `v10-field-edit-spec-md-tables.md` — markdown table version of the same spec
- `STITCH-PROMPT.md` — original design brief for the cascading field picker (context for early iterations)

**Supporting**
- `conditional-field-picker.html` — early cascade logic demo
- `valta-controls-v3.html` — control type component library
- `sc-component-library.html` — style component reference
- `new-field-panel-additions.html` — slide-out panel iteration

---

## Relationship to the Master Field Registry

The Master Field Registry lives at `docs/Features/08-Master-Field-Registry/`. It documents 218 calculator fields across four valuation approaches (Income, Sales Comparison, Cost, Reconciliation), with full INPUT/OUTPUT mappings, calculation formulas, Valcre API coordinates, and cross-section dependency verification. Its source of truth is `src/features/image-configurator/report-builder/schema/fieldRegistry.ts` (22,032 lines).

**These two registries have the same intent — they are not separate things.** The Valta app is the user-friendly interface layer. The master registry is the deep reference layer for appraisal-report-side work: property values, calculation formulas, template placement. Valta surfaces only the subset of fields relevant to LOE writing and proposal generation. The master registry surfaces everything.

**Long-term direction:** one absorbs the other. Valta is likely the surviving UI surface for the client — it is simpler, searchable, and maps to how the client actually thinks about fields. The master registry stays as the deep appraisal-report reference that backs it. The exact migration mechanism is undecided and will be scoped in a separate PRD (not authored here).

**What this means practically:**
- Field coverage questions (does Valta cover all LOE fields?) → check Valta vs. master registry overlap
- Deep report configuration → use master registry docs and `fieldRegistry.ts`
- Client-facing field changes → work in v6 (or its successor)
- Valcre API field mapping → `docs/Features/08-Master-Field-Registry/Valcre-Integration/`

---

## Where to Go From Here

| Task | Where to start |
|------|---------------|
| Modify the production UI | `valta-field-registry-explorer-v6.html` — read PROTOTYPES-INDEX.md key decisions first |
| Propose a new field | Add to v6 via the inline add flow; cross-reference master registry for Valcre mapping |
| Audit field coverage (Valta vs. master) | Compare v6 field list against `docs/Features/08-Master-Field-Registry/01-MASTER-FIELD-REFERENCE-INDEX.md` |
| Understand cascade/logic rules | `STITCH-PROMPT.md` + `v10-field-edit-spec.md` State 1-13 |
| Understand design decisions | `PROTOTYPES-INDEX.md` Key Decisions section |
| Deep appraisal report fields | `docs/Features/08-Master-Field-Registry/` |
| Registry search methods | `docs/Features/08-Master-Field-Registry/09-REGISTRY-GUIDE.md` |
| Valcre API field mapping | `docs/Features/08-Master-Field-Registry/Valcre-Integration/` |
| Migration PRD (future) | Will live in `builds/2-Assembly-Plans/` — not yet authored |
