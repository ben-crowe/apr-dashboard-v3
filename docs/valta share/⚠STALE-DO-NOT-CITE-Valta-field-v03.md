---
title: ⚠ STALE — DO NOT CITE — Valta-field-v03.xlsx (April-2 copy)
status: STALE / superseded — ARCHIVED 2026-06-17 (do not restore or cite)
flagged: 2026-06-17 by mcp-knowledge-manager (with Ben + co-architect)
applies_to: (archived) ~/Development/APR-Dashboard-v3/docs/valta share/_archive/Valta-field-v03-APR2-STALE.xlsx
canonical_replacement: ~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/client-source/Valta Master Field Registry v03 - reviewed 2026-06-09.xlsx
tags: [apr, registry, stale, do-not-cite, source-of-truth]
---

# ⚠ STALE — do NOT cite `Valta-field-v03.xlsx` (this folder) as registry authority

**The file `Valta-field-v03.xlsx` in this `docs/valta share/` folder is an APRIL-2 copy and is STALE.**
It predates Chris's June-9 review and is **missing fields he added/confirmed** — e.g.
`CurrentUseImprovements`, `ProposedUseImprovements`, `PreviouslyAppraised` (present in June-9, absent here).

## What happened (2026-06-17)
The Slice-4b reconciliation doc cited THIS April file as its authority. Because the file was stale,
three fields Chris had already specified were wrongly flagged "not in his registry → ask Chris." Caught
before they shipped to a Chris-question list. Root cause = wrong/stale source file, not a client gap.

## The CANONICAL source of truth (use this, always)
`~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/client-source/Valta Master Field Registry v03 - reviewed 2026-06-09.xlsx`
— this is the file the field-registry HTML itself names as source of truth. Parsed authority baseline:
`~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/BASELINE-v03-2026-06-09-authority.{md,json}`

## Rule
- Do NOT cite, parse, or reconcile against the April `Valta-field-v03.xlsx`.
- Anything that references it must be repointed to the June-9 client-source file (or the parsed baseline).
- ✅ DONE 2026-06-17: April xlsx moved to `_archive/Valta-field-v03-APR2-STALE.xlsx` (Ben approved). This
  file is now a tombstone marking where it used to live. Do not restore.
- ⚠ Two OTHER registry copies still live in this `docs/valta share/` folder — `Valta-Master-Field-Registry-v2.xlsx`
  (v2, older than v03) and `Valcre Field Registry.xlsx`. Flagged for Ben's call on whether to archive them too
  (same duplicate-proliferation risk). Canonical remains the June-9 client-source file.
