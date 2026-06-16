---
title: "HTML Field Registry — APR canonical field-mapping source"
status: active
type: reference
updated: 2026-06-16
owner: "ui-designer (build) · co-architect (doc upkeep + search ingestion) · qa-agent (reconcile vs code)"
tags: [apr, field-registry, valcre-mapping, custom-fields, value-scenarios, section-10, canonical-source, html-registry]
keywords: [field registry, HTML registry, Valcre custom field, CF12407, CF12414, field mapping, routes to, value scenarios, section 10 narratives, scenario_narratives, generated derivative, reconcile, source of truth, derived vs direct, create-only contact]
related:
  - ~/Development/APR-Dashboard-v3/public/field-registry-v6.html
  - ~/Development/APR-Dashboard-v3/api/valcre.ts
  - ~/Development/APR-Dashboard-v3/src/utils/loe/loeCascade.ts
  - ~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/GENERATED-field-mapping.json
  - ~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/GENERATED-field-mapping.md
---

**Tags:** #apr #field-registry #valcre-mapping #custom-fields #value-scenarios #section-10 #canonical-source #html-registry

# HTML Field Registry — APR canonical field-mapping source

> **One line:** The HTML field registry is the **canonical, human-facing source of truth for APR field mapping** — every dashboard field, where it comes from, where it routes in Valcre, and every Section 10 value scenario and its wording. It is reconciled against the code (`api/valcre.ts` = runtime truth) and emits a generated markdown/JSON derivative for agents + code.

## Status — last worked on

- **Last updated:** 2026-06-16
- **What changed (2026-06-16):**
  - Promoted the HTML registry to the **canonical** central field-mapping source (Ben's call) — superseding the hand-edited markdown "API & Field Mapping Reference," which is now demoted to generated-output + a gotchas notes file.
  - Folded today's verified **Valcre custom-field mapping** (CF12407–CF12427) into the registry's Routes-To column for all cascade/LOE fields; marked derived-vs-direct (Interest Appraised / Value Scenarios / Approaches = computed; Status of Improvements = direct trigger); fixed entity scoping; added Current Use / Proposed Use / Previously Appraised rows; represented the PropertyType dual-write (`Property.Type` single + `Property.Types` multi).
  - Added a **Scenarios tab** — the §10 value-scenario library (summary, EA/HC, what derives it, Valcre CF12414 option ID, has-text-vs-pending).
  - Built the **HTML → markdown/JSON generator** (`scripts/generate-registry-derivatives.mjs`).
  - **QA-certified 1:1 vs `api/valcre.ts`** — the registry, and the generated derivative, both stamped CERTIFIED 2026-06-16.

## What it is

A self-contained **registry app** (single HTML file) that holds the APR field universe as structured data with multiple views — far more usable than prose for search, extraction, and cross-referencing. It carries, per field: name, label, control type, source (User Input / Logic / Valcre API / Calculated), dropdown list + options, **Routes To** (Valcre native path *or* custom-field ID), entity (Job / Property / Contact / PropertyContact), form/required flags, and notes. It also carries the §10 value-scenario library.

## Where it lives

- **The registry app:** `~/Development/APR-Dashboard-v3/public/field-registry-v6.html`
- **This README:** `~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/HTML-REGISTRY-README.md`
- **Generated derivatives (agent/code-readable):** `GENERATED-field-mapping.md` + `GENERATED-field-mapping.json` (same folder)
- **Generator script:** `~/Development/APR-Dashboard-v3/scripts/generate-registry-derivatives.mjs`
- **Runtime truth (reconcile target):** `~/Development/APR-Dashboard-v3/api/valcre.ts` (`VALTA_CUSTOM_FIELD_IDS`, native mappings)
- **Cascade + scenario source:** `~/Development/APR-Dashboard-v3/src/utils/loe/loeCascade.ts` (`STATUS_TO_SCENARIOS`, `NARRATIVES`)
- **Live §10 editable text:** Supabase `scenario_narratives` table (the dashboard Value Scenario editor writes here; the registry Scenarios tab mirrors it, code seed as fallback)

## The architecture — one source, many views

1. **`api/valcre.ts` = runtime truth.** The custom-field IDs + native field mappings that actually execute. Everything reconciles *to* it; no doc overrides code.
2. **HTML registry = the canonical human source.** Edit fields/scenarios here. The visual app is the viewer; the embedded `FIELDS` + `SCN_LIB` arrays are the data.
3. **Generated md/JSON = the derivative.** Agents and code read these (always match the HTML). The JSON carries full status keys for exact machine matching; the markdown is the human-readable export.
4. **Client registry (Chris's v03) = field-definition authority.** What fields/options *should* exist; mismatches are Chris questions.
5. **QA reconcile-check = the drift guard.** QA diffs the registry + the derivative against `api/valcre.ts`; any divergence is flagged.

## The tabs (views)

- **Field Registry** — every dashboard field + its Valcre mapping (Routes To = native path or CF id), searchable by field, label, or custom-field id.
- **Scenarios** — the §10 value-scenario library (summary, EA/HC, derived-from, Valcre CF12414 option id, status). Reference view; edit live text in the dashboard.
- **Logic Fields** / **Cascade Logic** — the trigger→result cascade groups.
- **Mock Dashboard** — the field-layout mock.
- **Live Dashboard** — opens the deployed app.

## How to update it

1. Edit `public/field-registry-v6.html` (the `FIELDS` and/or `SCN_LIB` data, or the views).
2. Bump the **Last updated** line in the registry header **and** this README's status block.
3. Regenerate the derivatives: `node scripts/generate-registry-derivatives.mjs`.
4. Ping **qa-agent** to reconcile the registry + derivative against `api/valcre.ts`.
5. **co-architect** routes the updated derivative to search-ingestion (replacing the stale hand-edited markdown).

## Ownership

- **ui-designer** — builds + maintains the HTML registry and the generator.
- **qa-agent** — owns the reconcile-check (registry + derivative vs `api/valcre.ts` runtime truth).
- **co-architect** — owns this README's upkeep + search ingestion + keeping Ben pinned on APR status.

---
*Authored 2026-06-16 by ui-designer; ownership of upkeep + ingestion handed to co-architect. The HTML registry is the canonical source; this README is its searchable map.*
