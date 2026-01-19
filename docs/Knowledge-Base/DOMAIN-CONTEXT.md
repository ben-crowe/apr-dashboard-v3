# APR Dashboard v3 - Orchestrator Context

> **Last Updated:** 2026-01-05
> **Mission Status:** Active

---

## Mission

Build a complete 4-stage appraisal workflow where data flows from client intake through to final PDF report - no re-entry, no data loss, full persistence.

---

## The Four Stages

```
STAGE 1: CLIENT INTAKE      --> job_submissions table
    |
STAGE 2: JOB MANAGEMENT     --> job_loe_details, job_property_info
    |
STAGE 3: E-SIGNATURE        --> DocuSeal integration
    |
STAGE 4: REPORT BUILDER     --> Complete appraisal report (944 fields)
```

**Current State:** Stages 1-3 work. Stage 4 (Report Builder) is disconnected - no persistence, no bridge to job data.

---

## Phases (Integration Roadmap)

```
[ ] Phase 0: Database setup (report_builder_data table)
[ ] Phase 1: Expose Home section in sidebar
[ ] Phase 2: Add ~35 Home section fields (mapped from Supabase)
[ ] Phase 3: Integration bridge route (/dashboard/job/:jobId/report)
[ ] Phase 4: Auto-save + persistence (2s debounce)
[ ] Phase 5: Dynamic lists for conditions
[ ] Phase 6: Locked fields + "Edit in Home" pattern
[ ] Phase 7: Page-to-editor sync (scroll tracking)
```

---

## Current Focus

**Active Phase:** Pre-Phase 0 (foundation work, standalone components)

**Current Objective:** Build standalone components that will plug into Report Builder

**Blockers:** None - deciding what to tackle next

---

## Key Decisions Made

1. **Standalone-first development:** Build features like image configurator in isolation at `/image-test`, then wire into Report Builder. Rationale: Easier to perfect without Report Builder complexity.

2. **Home section for job data:** All data from Stages 1-3 lands in a new "Home" section in Report Builder. Other sections reference Home fields. Rationale: Single source of truth, locked fields prevent drift.

3. **JSONB storage for report data:** Store entire report state as JSONB in `report_builder_data` table. Rationale: Flexible schema, easy versioning, matches Zustand store shape.

---

## Micro to Macro Map

```
MICRO: Image configurator component
  |
SERVES: image-mgt section (160 fields, 55 images)
  |
SERVES: Report Builder editor experience
  |
SERVES: Stage 4 completion
  |
MACRO: Complete client-to-report pipeline
```

```
MICRO: Map Title default experience
  |
SERVES: Better UX for fresh templates
  |
SERVES: Report Builder usability
  |
SERVES: Stage 4 completion
  |
MACRO: Complete client-to-report pipeline
```

---

## Key Files

| File | Purpose |
|------|---------|
| `docs/APR-Hybrid-Execution-Plan.md` | **Hybrid PRP execution plan for Phase 0-7** |
| `docs/bc research & notes/FULL-ECOSYSTEM-INTEGRATION.md` | Complete system architecture |
| `src/features/report-builder/schema/fieldRegistry.ts` | 944 field definitions |
| `src/features/report-builder/store/reportBuilderStore.ts` | Zustand store (6,340 lines) |
| `src/features/image-configurator/` | Standalone image management feature |
| `docs/PENDING-TASKS.md` | Current task list |
| `docs/TDD-PAGE-ARCHITECTURE.md` | Page/section architecture |

---

## Session Log

| Date | Focus | Outcome |
|------|-------|---------|
| 2025-12-31 | Ecosystem research | Created FULL-ECOSYSTEM-INTEGRATION.md |
| 2026-01-03 | Image configurator | Built standalone at /image-test |
| 2026-01-05 | Orchestrator setup | Created context + /continue command |
| 2026-01-05 | Hybrid methodology | Created APR-Hybrid-Execution-Plan.md applying Hybrid PRP to Phases 0-7 |

---

## Success Criteria (from FULL-ECOSYSTEM-INTEGRATION.md)

- [ ] Home section visible as first section in sidebar
- [ ] Home section has 8 subsections with ~40 fields
- [ ] Job data pre-populates Home Tab from Job Detail
- [ ] Report Builder auto-saves to Supabase (2s debounce)
- [ ] Version history tracked per job
- [ ] Conditions use dynamic list UI (add/remove items)
- [ ] Locked fields in other sections show "Edit in Home" link
- [ ] Closing Report Builder does NOT lose data
- [ ] "Begin Report" button in Job Detail View
- [ ] Route: `/dashboard/job/:jobId/report` works

---

## Notes for Future Sessions

- Image configurator is DONE as standalone - ready to wire into image-mgt section
- Map Title default experience is pending (small UX task)
- Phase 0 (database table) is the logical next step before any Report Builder UI work
- The `home` section already exists in fieldRegistry with 2 fields - just hidden from sidebar
