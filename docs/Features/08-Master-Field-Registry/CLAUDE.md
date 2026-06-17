# Agent Instructions — Master Field Registry

This folder is the deep reference layer for all 2,082 fields in the APR appraisal report — what each field is, what it maps to, what calculation owns it, and how it flows to Valcre.

> **Source-of-truth resources (check these before guessing):**
> - **Client registry (what WE map):** the June-9 canonical workbook `client-source/Valta Master Field Registry v03 - reviewed 2026-06-09.xlsx` + the parsed `BASELINE-v03-2026-06-09-authority.{md,json}`. (The old April `docs/valta share/` copy is STALE — archived, do not cite.)
> - **Valcre API spec (what Valcre OFFERS — upstream truth for field mapping + custom-field creation):** `Valcre-API-Reference/` — the Swagger-extracted per-entity field defs + enums + API guide. See its README. NOTE: the old v2 *mapping tables* were deliberately NOT brought in (superseded by the current registry — do not confuse).

---

## Production Source

**File:** `src/features/image-configurator/report-builder/schema/fieldRegistry.ts`
**Size:** 22,032 lines, 2,082 field definitions (verify: `grep -cE "^\s+id: ['\"]" <path>` → 2082)
**Mirror path:** `src/features/report-builder/schema/fieldRegistry.ts` also exists at identical size/mtime — canonical location unresolved, treat the image-configurator path as authoritative until reconciled.

The registry is the single source of truth. Docs in this folder describe it; they do not replace it.

---

## Sibling Registry — Valta

**Path:** `~/Development/APR-Dashboard-v3/builds/prototypes/`
**Live URL:** https://apr-dashboard-v3.vercel.app/field-registry-v6.html
**Relationship:** Valta is the client-facing UI that surfaces a 218-field subset (the calculator fields across Income, Sales, Cost, Reconciliation approaches) for LOE and proposal generation. Master (here) is the deep reference for the full 2,082-field registry plus Valcre API mapping.

Long-term, one will absorb the other — Valta is likely the surviving UI surface. Migration PRD lives in `builds/2-Assembly-Plans/` (not yet authored).

**Conflict rule:** If Valta UI claims and this folder disagree, **this folder wins** (deep reference rule). If this folder is wrong, Valta inherits the error — fix here first.

---

## Hard Rules

**Do not duplicate Valta UI content here.** Per-control behavior, dropdown editing UX, States 1-13 visual contract — those belong in `builds/prototypes/`. Reference, do not copy.

**Do not author the migration PRD here.** Eventual plan for merging Valta with master lives in `builds/2-Assembly-Plans/`.

**Modifying `fieldRegistry.ts` requires the 4-file sync** per root `CLAUDE.md`: fieldRegistry.ts → TestDataSet1.ts → Report-MF-template.html → EditPanel components. No partial syncs.

---

## Anti-Patterns

**Do not conflate the 218-field calculator subset with the 2,082 master total.** Docs 03–06 cover only the 4 valuation approaches (Income 58 + Sales 115 + Cost 31 + Recon 14 = 218). The registry as a whole is ~10x larger.

**Do not update field counts in any doc without verifying against current source.** Run the grep above; do not propagate counts from doc to doc. Historical stale numbers (218, ~1,687) have already caused audit drift.

**Do not modify production code from this folder.** This is documentation. Code changes go through the main `src/` tree with the 4-file sync.

**Do not assume the registry is frozen.** Active inbox work ("VALTA Field Spec — 13 missing fields + 3 dropdown fixes") means "Reference Only" framing in older READMEs is stale.

---

## Where to Go

**Numbered reference docs (this folder):**
- `00-START-HERE.md` — entry point
- `01-MASTER-FIELD-REFERENCE-INDEX.md` — calculator-subset index
- `02-METHODOLOGY-AND-ORGANIZATION.md` — historical methodology
- `03-INCOME-APPROACH-INPUT-OUTPUT-MAP.md` (58 fields)
- `04-SALES-COMPARISON-INPUT-OUTPUT-MAP.md` (115 fields)
- `05-COST-APPROACH-INPUT-OUTPUT-MAP.md` (31 fields)
- `06-RECONCILIATION-INPUT-OUTPUT-MAP.md` (14 fields)
- `07-FIELD-ALIGNMENT-VERIFICATION.md` — calculator-subset cross-verification
- `08-VALCRE-WORKBOOK-INCOME-STRUCTURE.md` — Valcre Income workbook structure
- `09-REGISTRY-GUIDE.md` — full registry navigation (the entry point for non-calculator fields)

**Valcre API integration:** `Valcre-Integration/` subfolder — out of scope for this CLAUDE.md, covered by its own audit item.

**Archive:** `archive/` holds historical decision records (PROPERTYTYPE bug investigation, FIELD-AUDIT-FULL, parking-laundry calc history). Read before opening a new investigation into a known-historical field issue.

---

## When Agents Land Here

- Adding a calculator field → `09-REGISTRY-GUIDE.md` + the relevant 03–06 subset doc
- Adding a non-calculator field → `09-REGISTRY-GUIDE.md` only (subset docs do not apply)
- Modifying Valcre payload mapping → `Valcre-Integration/1-API-FIELD-MAPPING-REFERENCE.md` + verify against `api/valcre.ts`
- Investigating a field bug → check `archive/` for prior decisions first
- Auditing field counts → `_AUDIT-2026-05-14.md` for the most recent drift report
