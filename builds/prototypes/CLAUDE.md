# Agent Instructions — Valta Field Registry Explorer Prototypes

This folder contains the Valta Field Registry Explorer prototype — a client-facing UI for managing LOE and proposal fields.

---

## Production File

**File:** `valta-field-registry-explorer-v6.html`
**Live URL:** https://apr-dashboard-v3.vercel.app/field-registry-v6.html
**To open locally:** `open ~/Development/APR-Dashboard-v3/builds/prototypes/valta-field-registry-explorer-v6.html`

---

## Sibling Docs in This Folder

- `PROTOTYPES-INDEX.md` — authoritative file list, version history, key design decisions (read this before touching anything)
- `v10-field-edit-spec.md` — visual states spec (States 1-13) for inline add/edit behavior; this is the design contract that v6 implements
- `STITCH-PROMPT.md` — original design brief for the cascading field picker; useful for understanding cascade/logic intent

---

## Master Field Registry

**Path:** `docs/Features/08-Master-Field-Registry/`
**Relationship:** Same intent as Valta, different scope and audience. Valta is the client-facing UI for LOE + proposal fields. The master registry is the deep appraisal-report reference (218 calculator fields, full Valcre API mapping, calculation formulas). One will eventually absorb the other — Valta is likely the surviving UI surface. Migration PRD not yet authored.

---

## Hard Rules

**v5 is locked.** `valta-field-registry-explorer-v5.html` is the hash-locked base (hash: 05b9a997 per PROTOTYPES-INDEX.md). Do not modify it under any circumstances.

**v6 is production.** `valta-field-registry-explorer-v6.html` is the current production prototype. Changes here affect the live deployment. Do not modify without intent.

**v7 through v11 are reference only.** `valta-field-registry-v7-inline-row.html` through `valta-field-registry-v11-client-simple.html` are design exploration files. They were superseded by v6. Do not build on them.

---

## Anti-Patterns

**Do not duplicate field-mapping content here.** Valcre API coordinates, calculation formulas, and cross-section field dependencies live in `docs/Features/08-Master-Field-Registry/`. Reference that folder — do not copy content into this one.

**Do not deepen this app into report-builder territory.** Valta's scope is LOE and proposal fields. Deep appraisal report properties (value scenarios, income approach outputs, cost approach inputs) belong in the master registry and `fieldRegistry.ts`, not in the Valta UI.

**Do not author a migration PRD here.** The eventual plan for merging Valta with the master registry will live in `builds/2-Assembly-Plans/`. This folder documents current state and intent only.

**Do not modify `fieldRegistry.ts` or any production source code** from this folder. This is a prototypes directory. Production code changes go through the main `src/` tree.

---

## Quick Orientation

The app exposes four client-editable columns per field: Label, Control Type, Role, Dropdown List. Field Name (camelCase) is auto-generated and never client-editable. The spreadsheet-style inline add/edit pattern (v10 design) won over modal and slide-out approaches — see PROTOTYPES-INDEX.md Key Decisions for why.
