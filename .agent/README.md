# APR Dashboard v3 - Agent Documentation

> **Purpose:** Quick-start context for agents working on this codebase
> **Read time:** 3-5 minutes for full orientation

---

## Quick Start

**New to this project?** Read in order:
1. `system/4-stage-pipeline.md` - Understand the full system
2. `system/field-registry-overview.md` - How the 1,687 fields work
3. `system/zustand-store-patterns.md` - State management approach

**Working on a task?** Check:
- `tasks/` - Any existing PRDs or implementation plans
- `sops/` - Standard procedures for common operations

---

## When to Read What

| If you need to... | Read this |
|-------------------|-----------|
| Understand the overall system | `system/4-stage-pipeline.md` |
| Add or modify fields | `system/field-registry-overview.md` + `sops/adding-report-fields.md` |
| Work with state/store | `system/zustand-store-patterns.md` |
| Test your changes | `sops/testing-changes.md` |
| Understand current tasks | `tasks/` folder |

---

## Project At a Glance

**What:** APR Dashboard v3 is a 4-stage appraisal workflow system

**Stages:**
1. Client Intake - Job submission form
2. Job Management - LOE preparation
3. E-Signature - DocuSeal integration
4. Report Builder - Final report assembly (944+ fields)

**Tech Stack:**
- React 18 + TypeScript
- Zustand for state management
- Supabase for backend
- Tailwind CSS

**Key Locations:**
| Purpose | Path |
|---------|------|
| Field definitions | `src/features/report-builder/schema/fieldRegistry.ts` |
| Zustand store | `src/features/report-builder/store/reportBuilderStore.ts` |
| HTML template | `public/Report-MF-template.html` |
| Test data | `src/features/report-builder/data/TestDataSet1.ts` |
| Knowledge hub | `docs/bc research & notes/TDD-PAGE-ARCHITECTURE.md` |

---

## Documentation Map

```
.agent/
├── README.md              <- You are here (index)
├── tasks/                 <- PRDs and implementation plans
│   └── .gitkeep
├── system/                <- Architecture documentation
│   ├── 4-stage-pipeline.md
│   ├── field-registry-overview.md
│   └── zustand-store-patterns.md
└── sops/                  <- Standard Operating Procedures
    ├── adding-report-fields.md
    └── testing-changes.md
```

---

## Deep Dive Documentation

For extensive reference material, see:
- `docs/bc research & notes/TDD-PAGE-ARCHITECTURE.md` - Master knowledge file
- `docs/bc research & notes/FULL-ECOSYSTEM-INTEGRATION.md` - Integration architecture
- `docs/bc research & notes/ORCHESTRATOR-CONTEXT.md` - Mission and phases
- `docs/15-Contract-review/` - Reference library (field guides, crosswalks)

---

## Current Status

**Active Phase:** Pre-Phase 0 (foundation work)

**Pending Integration:**
- Report Builder is currently disconnected from Stages 1-3
- No persistence to database (data lost on close)
- Missing route `/dashboard/job/:jobId/report`

**Pending Tasks:** See `docs/bc research & notes/PENDING-TASKS.md`

---

## Maintenance

After completing work, consider:
1. Updating relevant `.agent/` docs if architecture changed
2. Adding SOPs for new procedures discovered
3. Adding PRDs to `tasks/` for major features

---

*Last updated: 2026-01-05*
