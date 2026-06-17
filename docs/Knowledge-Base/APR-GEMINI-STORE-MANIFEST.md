---
title: APR Gemini Store — Reconstructed Manifest
store: apr-domain (fileSearchStores/aprdomain-4ff70q8zo9xo)
created: 2026-06-16
author: mcp-knowledge-manager
method: query-probe reconstruction (store exposes no filenames; recovered via citation harvesting across 30 diverse queries)
coverage: 24 of 33 documents surfaced
status: active
tags: [apr, gemini-store, manifest, ingestion-state, knowledge-infra]
---

# APR Gemini Store — Reconstructed Manifest

## Why this file exists

The `apr-domain` Gemini store had **no manifest** — it was seeded via a temporary
staging folder that was deleted, and Gemini File Search exposes documents only as
anonymous IDs, never filenames. The only way to see what's inside is to search it and
harvest the `source` field from citations. This file is that reconstruction: 24 of 33
docs recovered by probing the store with 30 diverse queries.

**Bottom line:** the store is real and in use, but it's a **stale mixed bag** of three
different vintages. The single most important current doc (the master dashboard) is
ingested as a months-old copy. A curated wipe-rebuild from the current source-of-truth
docs is the clean fix.

---

## The three vintages in the store

### 1. Curated numbered set — the original May seed (NOW STALE vs disk)
Staged `.txt` copies, renamed with `NN-` prefixes. Their real `.md` sources live on disk
and several are **much newer** than the ingested copy:

| In store | Disk source | Disk date | Verdict |
|---|---|---|---|
| `01-APR-MASTER-DASHBOARD.txt` | `docs/00-APR-MASTER-DASHBOARD.md` | 2026-06-13 | ⚠️ STALE copy — disk far newer |
| `02-E2E-TESTING-WORKFLOW-MASTER.txt` | `docs/Testing/E2E-TESTING-WORKFLOW-MASTER.md` | current | ⚠️ re-pull |
| `03-LOE-TEST-COVERAGE-GATE.txt` | `docs/Testing/LOE-TEST-COVERAGE-GATE.md` | current | ⚠️ re-pull |
| `04-CLICKUP-SYNC-CANONICAL.txt` | `docs/Features/04-Job & Client Mgt./CLICKUP-SYNC-CANONICAL.md` | 2026-06-11 | ⚠️ STALE copy |
| `05-CASCADE-LOGIC-SPEC-AND-WIRING.txt` | `docs/Features/12-LOE-Esign/CASCADE-LOGIC-SPEC-AND-WIRING.md` | 2026-06-10 | ⚠️ STALE copy |
| `06-CLI-APR-TOOLS-SKILL.txt` | `~/.claude/skills/cli-apr-tools/` (skill, not a doc) | — | drop or re-source |

### 2. Old session-capture passover notes (POINT-IN-TIME NOISE)
Dated session snapshots and early guides — not live docs, just frozen captures. These are
the **heaviest-cited** entries (one session file surfaced 23×), meaning they dominate
search results with stale content:

- `2026-04-08-session-2026-03-26_20-34-02Z.md` (23×)
- `2026-04-08-session-2026-04-08_21-12-10Z.md` (10×)
- `2026-04-08-session-2026-04-08_21-36-29Z.md` (6×)
- `2026-01-12-apr-field-registry-guide.md` (19×)
- `2026-01-12-apr-features-overview.md` (3×)
- `2025-11-04-apr-valcre-api-integration.md` (3×)
- `2026-03-03-apr-loe-docuseal-architecture-part1-components.md` (2×)

→ Recommend **dropping** these from the store; they're superseded by current docs.

### 3. Genuinely current `.md` docs matching disk (KEEP)
These match real, current source files — the valuable core:

| In store | Disk path | Date |
|---|---|---|
| `1-API-FIELD-MAPPING-REFERENCE.md` | `docs/Features/08-Master-Field-Registry/Valcre-Integration/` | 2026-06-05 |
| `FIELD-DATA-MAP-where-everything-lives.md` | `docs/Features/08-Master-Field-Registry/` | 2026-06-11 |
| `DASHBOARD-TO-VALCRE-LOCATION-MAP.md` | `docs/Features/08-Master-Field-Registry/Valcre-Integration/` | 2026-06-05 |
| `CLICKUP-SYNC-CANONICAL.md` | `docs/Features/04-Job & Client Mgt./` | 2026-06-11 |
| `CASCADE-LOGIC-SPEC-AND-WIRING.md` | `docs/Features/12-LOE-Esign/` | 2026-06-10 |
| `00-LOE-ESIGN-FEATURE.md` | `docs/Features/12-LOE-Esign/` | 2026-06-09 |
| `LOE-DOCUSEAL-ARCHITECTURE.md` | `docs/Features/12-LOE-Esign/` | 2026-03-03 |
| `5-FIELD-MAPPING-ASSUMPTIONS.md` | `docs/Features/08-Master-Field-Registry/Valcre-Integration/` | 2025-12-29 |
| `PROPERTY-TYPE-FIELD-MAPPING.md` | `docs/Features/08-Master-Field-Registry/Valcre-Integration/` | 2025-12-29 |
| `VALCRE_REPORT_STRUCTURE.md` | `docs/Features/07-Report-Builder/0-APR-Core-to org/` | 2025-12-29 |
| `VALCRE_TABLE_FIELD_MAPPING.md` | `docs/Features/07-Report-Builder/0-APR-Core-to org/.../` | 2025-12-29 |
| `INTAKE-FORM-FIELDMAP-2026-06-03.md` | `docs/Testing/` (verify) | 2026-06-03 |
| `VALCRE-API-FIELD-MAPPING` (chunked) | `docs/.../Valcre-Integration/` (renamed) | current |

---

## Recommended next step: curated wipe-rebuild

Rather than reconcile this mixed store doc-by-doc, rebuild it clean from the **current
source-of-truth set on disk** — the exact docs each section README points to. The README
index system (confirmed working) IS the curation list.

1. Assemble the canonical current docs (per section READMEs) into a tagged staging set.
2. `sync-store.py --full-wipe` (human-gated: `MEMORY_DESTRUCTION_APPROVED=YES`) to clear
   the stale/session-capture cruft and re-seed from current sources only.
3. Stamp each with `gemini_ingest: done` + `gemini_store: apr-domain` frontmatter so the
   store becomes self-describing (no more lost manifest).
4. Snapshot the doc list to `~/.claude/data/gemini-store-snapshots/` (this store currently
   has NO snapshot — only agent-checkpoints and workflows do).

Coverage caveat: 9 of 33 docs did not surface in probing and are not listed here. A
full-wipe-rebuild makes that moot (clean slate from known sources).
