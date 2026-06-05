---
content_type: decisions
title: LOE-07 Phase-2 + PRD-A — co-architect decisions (reversible calls made; Ben = critical-only)
date: 2026-06-04
authority: co-architect (Ben delegated all reversible/low-consequence calls; bring only critical/irreversible to Ben)
---

# Decisions — proceed with wiring on these (all reversible, modify at the end if needed)

## PRD-A field collisions (mapping — reversible, remap any time)
- **ReportFormat** ← owned by **Report Type** (existing). "Report Format" field → LOE-only, no Valcre sync.
- **Purposes** ← owned by **Property Rights** (now multi-select; send primary if Valcre Purposes is single). "Purpose" field → LOE-only.
- **Assignment Type** (dashboard Single/Multiple) → **LOE-only**, drives Schedule A. Do NOT map to Valcre CF12049 (different concept).
- **Job Status** → syncs to Valcre **Status** (native enum); dashboard dropdown uses Valcre's exact Status values (also solves its missing-options).
- Already proven targets (just wire): Authorized Use→IntendedUses, Transaction Status→CF12053, Zoning Status→CF12054, Value Scenarios→ValuationPremise-1/2 (CF11563/11564), Lead Appraiser→OwnerId via staff picker.
- LOE-only / no Valcre field: CMHC Financing, Desktop Report.

## Gap fields (reversible)
- Add Current Use / Proposed Use / Approaches to Value / ClientDocuments / Previously Appraised as **job-prep fields** (coordinate with PRD-A field work).
- **EA/HC summaries** = narrative **Text Library**, not simple dropdown fields.

## Version-selector (reversible)
- **Dropdown in the LOE section**, default = **newest active** version. Pair template+mapper (v07 needs `mapDataToV07Fields()`). Old versions stay selectable + reproducible.

## Per-page logo header (reversible)
- **Attempt the running-element approach** to keep the compact logo at top of each continuation page (Ben's lean). Footer-branding-only is the acceptable fallback if it's costly.

## Section numbering — ⚠ THE ONE BACK-POCKET FLAG FOR BEN (still reversible)
- Proceeding with **tidied sequential 1–16** (pandoc skeleton had 0-start + 17/18/20 jumps; titles + text VERBATIM from V07).
- This is the only item touching **legal**: before the contract goes live to a real client, worth a lawyer's glance to confirm renumbering is fine. Reversible (can restore V07's exact numbers). NOT blocking the build.

## Persistence (not a decision — required fix)
- Create `loe_submissions` table (+ loe_version col), fail-loud inserts + webhook signed-status write. Keystone for version reproducibility.
