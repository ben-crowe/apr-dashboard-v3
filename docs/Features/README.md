# APR Dashboard V4 - Features Directory

**Project**: APR Dashboard V3 → V4 Migration
**Organization**: Vertical Slice Architecture
**Last Updated**: 2026-01-10

---

## Quick Start

1. **Read First**: [00-EPIC-OVERVIEW.md](00-EPIC-OVERVIEW.md) - Complete roadmap with 7 epics, 23 features
2. **Architecture**: [../Architecture/APR-V4-ARCHITECTURE.md](../Architecture/APR-V4-ARCHITECTURE.md) - Primary vision document
3. **Pick a Feature**: Navigate to feature folder (01-23) and read README.md

---

## Feature Directory Structure

### Active Features (New V4 Structure)
```
01-Foundation-Infrastructure/     Epic 1: Foundation
02-Database-Schema/               Epic 1: Foundation
03-Core-Sections/                 Epic 2: Data Entry
04-Narrative-Sections/            Epic 2: Data Entry
05-Media-Management/              Epic 2: Data Entry
06-Income-Calculator/             Epic 3: Calculations
07-Sales-Comparison/              Epic 3: Calculations
08-Cost-Approach/                 Epic 3: Calculations
09-Reconciliation/                Epic 3: Calculations
10-Excel-Import/                  Epic 3: Calculations
11-Live-Preview/                  Epic 4: Preview & Export
12-Template-System/               Epic 4: Preview & Export
13-Export-Engine/                 Epic 4: Preview & Export
14-Share-Links/                   Epic 5: Client Delivery
15-Client-Portal/                 Epic 5: Client Delivery
16-Email-Delivery/                Epic 5: Client Delivery
17-Valcre-Integration/            Epic 6: Integration
18-ClickUp-Stage-2/               Epic 6: Integration
19-Dashboard-UX/                  Epic 6: Integration
21-Testing/                       Epic 7: Testing & Deploy
22-Performance/                   Epic 7: Testing & Deploy
23-Deployment/                    Epic 7: Testing & Deploy
```

### Legacy Features (Old Structure - Preserved)
```
_legacy-14-User-Interface/        → Migrates to F03, F04, F19
_legacy-15-Contract-review/       → Migrates to F12
_legacy-16-Field-Input-Output-Mapping/  → Referenced by F06-F10
_legacy-17-Template-Management/   → Migrates to F12
_legacy-20-Image-Configurator/    → Migrates to F05
```

---

## Feature Organization Principles

### Vertical Slice Architecture

Each feature is a **complete vertical slice** containing:
- Database schema (if needed)
- API endpoints (if needed)
- Business logic
- UI components
- Tests
- Documentation

### Why Vertical Slices?
- **Minimize coupling** between features
- **Maximize cohesion** within each feature
- **Independent deployment** - ship features separately
- **Clear ownership** - Cursor gets complete isolated scope
- **Reduced side effects** - changes stay within one slice

### Granularity Guidelines
Following industry best practices:
- Each feature: **8-80 hours** (completable in 1-2 weeks)
- Epic: **Multiple features** grouped by strategic goal
- Total project: **592-904 hours** (15-23 weeks)

---

## How to Use This Directory

### For Development (Cursor)

1. **Read Epic Overview**: [00-EPIC-OVERVIEW.md](00-EPIC-OVERVIEW.md)
2. **Check Dependencies**: See which features must complete first
3. **Navigate to Feature**: Go to feature folder (e.g., `01-Foundation-Infrastructure/`)
4. **Read Feature README**: Complete specification with:
   - Business value
   - Technical scope
   - Acceptance criteria
   - Architecture references
   - Testing requirements
5. **Follow Implementation**: Update Progress Log in README as you work
6. **Mark Complete**: Update Epic Overview when feature ships

### For Planning (Ben/Claude Code)

1. **Epic-Level Planning**: Use [00-EPIC-OVERVIEW.md](00-EPIC-OVERVIEW.md) for strategic decisions
2. **Feature Prioritization**: MVP milestones defined (MVP1 → MVP2 → MVP3 → Production)
3. **Dependency Management**: Critical path shown in Epic Overview
4. **Resource Allocation**: Duration estimates help schedule work

### For Documentation (Claude Code)

1. **Feature Briefing**: Create detailed README.md before Cursor starts
2. **Architecture References**: Link to relevant sections in Architecture docs
3. **Progress Tracking**: Cursor updates Progress Log after each session
4. **Knowledge Capture**: Document decisions, trade-offs, learnings

---

## Feature Status Legend

| Status | Icon | Meaning |
|--------|------|---------|
| Not Started | 📋 | Feature not yet begun |
| In Progress | 🔄 | Cursor actively working |
| Completed | ✅ | Feature shipped, tests passing |
| Blocked | ⛔ | Waiting on dependency |
| On Hold | ⏸️ | Paused (not priority) |

---

## Critical Path Features (Must Complete First)

**P0 - Blocking All Others**:
1. F01 - Foundation Infrastructure
2. F02 - Database Schema

**P0 - Core Value**:
3. F03 - Core Sections (data entry foundation)
4. F06 - Income Calculator (critical valuation method)
5. F10 - Excel Import (trust-building)
6. F11 - Live Preview (essential UX)
7. F14 - Share Links (solves Gmail problem)

**Complete these 7 features → MVP3 (Full System)**

---

## Legacy Migration Status

| Legacy Folder | Content | New Location | Status |
|---------------|---------|--------------|--------|
| _legacy-14-User-Interface | UI components | F03, F04, F19 | ⏳ To Review |
| _legacy-15-Contract-review | Report templates, 79-page HTML | F12 (Template System) | ⏳ To Review |
| _legacy-16-Field-Input-Output-Mapping | Calculator field maps (127 KB docs) | Referenced by F06-F10 | ✅ Active Reference |
| _legacy-17-Template-Management | Template injection system | F12 (Template System) | ⏳ To Review |
| _legacy-20-Image-Configurator | Image upload/gallery | F05 (Media Management) | ⏳ To Review |

**Action**: Before starting F03-F05, F12 → review legacy folders for reusable code/patterns.

---

## Naming Conventions

### Feature Folder Names
- **Format**: `##-Feature-Name-With-Hyphens/`
- **Examples**: `01-Foundation-Infrastructure/`, `06-Income-Calculator/`
- **Numbering**: Sequential 01-23 (some gaps intentional for future additions)

### Feature IDs
- **Format**: `F##` (e.g., F01, F06, F23)
- **Usage**: In documentation, Epic Overview, dependency graphs

### Epic Numbers
- **Format**: `EPIC #` (e.g., EPIC 1, EPIC 3)
- **Usage**: Strategic grouping of related features

---

## Documentation Standards

Each feature folder MUST contain:

### Required Files
- **README.md** - Complete feature specification
  - Overview
  - Business value
  - Deliverables (checklist)
  - Technical scope
  - Architecture references
  - Dependencies
  - Acceptance criteria
  - Implementation notes
  - Testing requirements
  - Progress log (updated by Cursor)

### Optional Files (As Needed)
- **BRIEF.md** - Extended implementation guide for complex features
- **PROMPTS.md** - Numbered prompts for Cursor
- **plans/** - Cursor's .plan.md files (copied from ~/.cursor/plans/)
- **PROGRESS-LOG.md** - Detailed session-by-session updates

---

## Related Documentation

### Architecture
- [../Architecture/APR-V4-ARCHITECTURE.md](../Architecture/APR-V4-ARCHITECTURE.md) - Primary vision (1,630 lines)
- [../Architecture/ARCHITECTURE-DIAGRAM.md](../Architecture/ARCHITECTURE-DIAGRAM.md) - Data flow & components
- [../Architecture/IMPLEMENTATION-ROADMAP.md](../Architecture/IMPLEMENTATION-ROADMAP.md) - 79-page template breakdown

### Field Mapping
- [../Architecture/.../CALC-ENGINE-FIELD-MAP.md](../Architecture/21-APR-Domain KN Mgr/review & document/CALC-ENGINE-FIELD-MAP.md) - 24 inputs → 85 outputs
- [../Architecture/.../LOCKED-FIELD-IDS.md](../Architecture/21-APR-Domain KN Mgr/architecture-v4/LOCKED-FIELD-IDS.md) - Protected calculator outputs

### Current System (V3)
- [../Architecture/.../IMPLEMENTATION-STATUS.md](../Architecture/21-APR-Domain KN Mgr/architecture-v4/IMPLEMENTATION-STATUS.md) - V3 bugs & fixes

---

## Next Steps

### Immediate (Ben & Claude Code)
1. ✅ Feature structure created (01-23)
2. ✅ Epic Overview written
3. ✅ Example READMEs created (F01, F02, F06)
4. ⏳ Review legacy folders for valuable content
5. ⏳ Create remaining feature READMEs (F03-F23)
6. ⏳ Reorganize Architecture folder

### Phase 1: Foundation (Ben → Cursor)
1. Read [01-Foundation-Infrastructure/README.md](01-Foundation-Infrastructure/README.md)
2. Plan Mode: Create implementation plan
3. Implement: Next.js 15 + Vite + Zustand
4. Complete: Mark F01 as ✅

### Phase 2: Database (Ben → Cursor)
1. Read [02-Database-Schema/README.md](02-Database-Schema/README.md)
2. Implement: Supabase tables + RLS
3. Complete: Mark F02 as ✅

### MVP1 Target
Complete F01-F05 → Basic data entry system (no calculations yet)

---

## Questions or Issues?

- **Architecture questions**: Check [APR-V4-ARCHITECTURE.md](../Architecture/APR-V4-ARCHITECTURE.md)
- **Field mapping questions**: Check [CALC-ENGINE-FIELD-MAP.md](../Architecture/21-APR-Domain KN Mgr/review & document/CALC-ENGINE-FIELD-MAP.md)
- **Feature dependencies**: Check [00-EPIC-OVERVIEW.md](00-EPIC-OVERVIEW.md) dependency graph

---

**Created**: 2026-01-10
**Maintained By**: Claude Code (Documentation Orchestrator)
**For**: APR Dashboard V4 Development Team
