---
title: Valcre API Reference — authoritative upstream field spec
status: evergreen reference (brought into v3 registry 2026-06-17)
origin: ~/Development/APR-Dashboard-v2-Res/03-Master-Field-Workflow/ (Ben's "Swagger/Jagger" docs, Oct 2025)
home: ~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/
tags: [apr, valcre, api, swagger, reference, field-mapping, custom-fields, evergreen]
---

# Valcre API Reference — the upstream source of truth for Valcre fields

**What this is:** the authoritative reference for Valcre's API — every entity field name, data type,
enum, and the endpoints/auth for field mapping AND custom-field creation. This is the layer *above*
our code: `api/valcre.ts` and the field registry should *match* what's documented here. For any
field-mapping or custom-field work, **check here first** instead of guessing.

Brought over from Ben's Oct-2025 "Swagger" docs (he called it the "Jagger Valcre guide") — it was
stranded in the old v2-Res repo and forgotten. Now anchored in the v3 registry where the work happens.

## What's here (all evergreen — describes Valcre's API, which is stable)
- **`SWAGGER-FILE-INFO.md`** — master index: live Swagger URL (`api-core.valcre.com/swagger/`), data
  dictionary, auth/OAuth, base URL, core entities/endpoints, Valcre support contact (Grant Norling).
- **`API-Swagger-Reference/`** — the extracted per-entity field defs: `ENTITY-Job.md`, `ENTITY-Contact.md`,
  `ENTITY-Property.md`, `ENTITY-PropertyContact.md`, `ENUMS-Job.md` + an index. **The definitive list of
  what Valcre fields exist and their types/enums.**
- **`VALCRE-ENTITY-MODEL-DISCOVERY.md`** — how the Job/Contact/Property/PropertyContact entities relate.
- **`Valcre API Guide.pdf`** — Valcre's official API guide.

## ⚠ What was deliberately NOT brought over (Ben's caution, 2026-06-17)
The v2-Res `03-Master-Field-Workflow/` folder also held **old field-MAPPING tables** dated Oct 2025 —
`01.Master Field-Mapping-Full.md`, `LOE-FIELDS-MASTER-REFERENCE.md`, `Ref.1/Ref.2-FIELD-MAPPING-TABLE.md`,
`04-ACTUAL-DASHBOARD-FIELDS.md`, `LOE-CAMELCASE-CONVERSION.md`, etc. **Those were left behind on purpose.**
- They map the OLD v2 dashboard fields to Valcre — **superseded** by the current v3 canonical registry
  (the June-9 `client-source` workbook + `GENERATED-field-mapping.{md,json}`).
- Bringing them here would risk confusing a stale v2 mapping with our current registry — the exact
  problem this whole effort just fixed. **Do NOT cite those old tables as current.** If you ever need
  them for history, they remain in the v2-Res repo.

**The line:** this folder = the Valcre API SPEC (what Valcre offers — evergreen). The current registry =
how WE map to it (the June-9 source + generated derivative). Keep those two straight; never let a v2
mapping table stand in for the current registry.
