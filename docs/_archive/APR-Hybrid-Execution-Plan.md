# APR Stage 4 Integration - Hybrid PRP Execution Plan

**Created:** January 5, 2026
**Methodology:** Hybrid PRP (SurferPRP + BMAD + Scout-Plan-Build + Taskmaster)
**Mission:** Connect Report Builder (Stage 4) to Client Intake Pipeline (Stages 1-3)

---

## Executive Summary

This plan applies the Hybrid PRP Methodology to the APR Dashboard's 7-phase integration roadmap. Each phase will be executed using:

- **SCOUT (Haiku Fleet):** Parallel research for API patterns, schema design, component architecture
- **PLAN (Sonnet):** PRD/PRP generation with BMAD context injection
- **BUILD (Sonnet + Specialists):** Implementation with domain-specific agents
- **VALIDATE (QA Gates):** Testing and verification

---

## APR Ecosystem Context

### The Four Stages (Current State)

```
STAGE 1: CLIENT INTAKE      --> job_submissions table       [WORKING]
    |
STAGE 2: JOB MANAGEMENT     --> job_loe_details             [WORKING]
    |
STAGE 3: E-SIGNATURE        --> DocuSeal integration        [WORKING]
    |
STAGE 4: REPORT BUILDER     --> 944 fields (DISCONNECTED)   [TARGET]
```

### The Integration Phases (Roadmap)

| Phase | Name | Description | Status |
|-------|------|-------------|--------|
| **0** | Database Setup | Create `report_builder_data` table | Pending |
| **1** | Expose Home | Add Home section to sidebar | Pending |
| **2** | Home Fields | Map ~35 fields from Supabase | Pending |
| **3** | Integration Bridge | Route `/dashboard/job/:jobId/report` | Pending |
| **4** | Auto-Save | Persistence with 2s debounce | Pending |
| **5** | Dynamic Lists | Conditions with add/remove | Pending |
| **6** | Locked Fields | "Edit in Home" pattern | Pending |
| **7** | Page-Editor Sync | Scroll tracking | Pending |

---

## Hybrid Methodology Application

### Phase 0: Database Setup

**Type:** Foundation / Schema
**Priority:** Critical (blocks all other phases)

#### SCOUT (Haiku Fleet - Parallel)

Deploy 4 Haiku agents simultaneously:

| Agent | Research Focus | Output |
|-------|---------------|--------|
| **HK-1** | Current Supabase schema | Tables, relationships, existing JSONB patterns |
| **HK-2** | Zustand store shape | `reportBuilderStore.ts` (6,340 lines) structure |
| **HK-3** | Version control patterns | How to track report versions per job |
| **HK-4** | JSONB best practices | Supabase JSONB indexing, querying patterns |

**Research Output Location:** `docs/research/phase-0/`

#### PLAN (Sonnet)

Using compiled research, generate:

1. **Schema Design Document**
   - Table structure for `report_builder_data`
   - Relationship to `job_submissions` (FK)
   - JSONB column for report state
   - Indexing strategy

2. **Migration PRP**
   - Supabase migration file content
   - RLS policy requirements
   - Edge function for versioning (if needed)

#### BUILD (Sonnet + database-administrator)

Execute with specialist agent brief:
- Create migration file
- Apply to Supabase
- Test CRUD operations
- Verify RLS policies

#### VALIDATE

- [ ] Table exists in Supabase
- [ ] RLS policies applied
- [ ] Can insert/update JSONB
- [ ] Can query by job_id
- [ ] Version tracking works

---

### Phase 1: Expose Home Section

**Type:** UI / Component
**Dependencies:** Phase 0 complete

#### SCOUT (Haiku Fleet - Parallel)

| Agent | Research Focus | Output |
|-------|---------------|--------|
| **HK-1** | Sidebar structure | `ReportSidebar.tsx` patterns |
| **HK-2** | Section visibility | How sections are shown/hidden |
| **HK-3** | fieldRegistry.ts | Current `home` section definition |
| **HK-4** | TDD page architecture | Where Home fits in page structure |

#### PLAN (Sonnet)

Generate:
1. **UI Requirements** - Where Home appears, visual design
2. **Component Changes** - Which files to modify
3. **Subsection Structure** - The 8 subsections layout

#### BUILD (frontend-developer)

Specialist brief includes:
- Exact file paths
- Pattern examples from existing sections
- Success criteria

#### VALIDATE

- [ ] Home visible in sidebar
- [ ] 8 subsections rendered
- [ ] Navigation works
- [ ] Styling consistent

---

### Phase 2: Home Section Fields (~35 Fields)

**Type:** Data Mapping / Form
**Dependencies:** Phase 1 complete

#### SCOUT (Haiku Fleet - Parallel)

| Agent | Research Focus | Output |
|-------|---------------|--------|
| **HK-1** | job_submissions fields | All available fields |
| **HK-2** | job_loe_details fields | Quote/LOE fields |
| **HK-3** | fieldRegistry patterns | How to define fields correctly |
| **HK-4** | Valcre API mappings | Field naming conventions |

#### PLAN (Sonnet)

Generate:
1. **Field Mapping Document** - Source → Report Builder mapping
2. **fieldRegistry additions** - TypeScript definitions
3. **Subsection allocation** - Which fields go where

#### BUILD (frontend-developer + typescript-pro)

Specialist brief includes:
- fieldRegistry.ts modifications
- Type definitions
- Form component updates

#### VALIDATE

- [ ] All 35 fields defined
- [ ] Types correct
- [ ] Fields render in UI
- [ ] Data binds correctly

---

### Phase 3: Integration Bridge Route

**Type:** Routing / Data Flow
**Dependencies:** Phases 0-2 complete

#### SCOUT (Haiku Fleet - Parallel)

| Agent | Research Focus | Output |
|-------|---------------|--------|
| **HK-1** | React Router patterns | Current routing structure |
| **HK-2** | Job Detail View | Entry point for "Begin Report" |
| **HK-3** | Data loading patterns | How to fetch job data |
| **HK-4** | Report Builder initialization | How store gets populated |

#### PLAN (Sonnet)

Generate:
1. **Route Architecture** - `/dashboard/job/:jobId/report`
2. **Data Flow Diagram** - Job data → Home fields
3. **Component Structure** - Wrapper component design

#### BUILD (frontend-developer + react-specialist)

Specialist brief includes:
- Route file location
- Data fetching pattern
- Error handling

#### VALIDATE

- [ ] Route accessible
- [ ] Job data loads
- [ ] Home fields populated
- [ ] Navigation back works

---

### Phase 4: Auto-Save + Persistence

**Type:** Data Layer / UX
**Dependencies:** Phases 0-3 complete

#### SCOUT (Haiku Fleet - Parallel)

| Agent | Research Focus | Output |
|-------|---------------|--------|
| **HK-1** | Zustand persistence patterns | Existing save patterns |
| **HK-2** | Debounce implementations | 2s debounce patterns |
| **HK-3** | Supabase upsert | Best practices for JSONB upsert |
| **HK-4** | Optimistic updates | UX patterns for save feedback |

#### PLAN (Sonnet)

Generate:
1. **Persistence Strategy** - When/how to save
2. **Store Modifications** - Zustand changes needed
3. **UX Indicators** - Save status feedback

#### BUILD (frontend-developer)

#### VALIDATE

- [ ] Changes persist on refresh
- [ ] 2s debounce works
- [ ] Save indicator shows
- [ ] No data loss scenarios

---

### Phases 5-7: Advanced Features

Follow same SCOUT → PLAN → BUILD → VALIDATE pattern for:

- **Phase 5:** Dynamic lists (Conditions UI)
- **Phase 6:** Locked fields pattern
- **Phase 7:** Page-editor sync (scroll tracking)

Each phase gets dedicated research agents and specialist execution.

---

## Agent Brief Templates

### Haiku Research Agent Brief

```markdown
## Context
You are researching [TOPIC] for APR Dashboard Phase [N].
APR Dashboard is a Next.js/React 18 application with Supabase backend.

## Objective
[SPECIFIC RESEARCH GOAL]

## Search Scope
- `/Users/bencrowe/Development/APR-Dashboard-v3/src/`
- Specific files: [LIST]

## Output Format
Return findings as:
1. Key patterns discovered
2. Relevant file paths (exact)
3. Code snippets that demonstrate patterns
4. Warnings/gotchas found

## Constraints
- Research only, no code modifications
- Focus on [TOPIC] exclusively
- Do not expand scope
```

### Sonnet Build Agent Brief

```markdown
## Context
APR Dashboard Phase [N] - [PHASE NAME]
Previous phase delivered: [OUTCOME]

## Objective
[SINGLE SPECIFIC GOAL]

## Requirements
- [Requirement 1]
- [Requirement 2]
- Follow patterns from: [EXAMPLE FILES]

## Files to Modify
- `/exact/path/file1.tsx` - [What to change]
- `/exact/path/file2.ts` - [What to change]

## Success Criteria
- [ ] [Concrete outcome 1]
- [ ] [Concrete outcome 2]

## Constraints (CRITICAL)
- DO NOT modify files outside listed scope
- DO NOT add dependencies without approval
- MUST follow existing code patterns
```

---

## Execution Schedule

| Phase | Research (Haiku) | Planning (Sonnet) | Build (Sonnet+) | Validate |
|-------|-----------------|-------------------|-----------------|----------|
| **0** | 4 agents parallel | Schema + Migration PRP | database-administrator | Manual + test |
| **1** | 4 agents parallel | UI Requirements | frontend-developer | Visual + nav |
| **2** | 4 agents parallel | Field Mapping | frontend + typescript | Type + render |
| **3** | 4 agents parallel | Route Architecture | react-specialist | Route + data |
| **4** | 4 agents parallel | Persistence Strategy | frontend-developer | Save + persist |
| **5-7** | As needed | Per phase | As needed | Per phase |

---

## Key Files Reference

| File | Purpose | Phase Relevance |
|------|---------|-----------------|
| `src/features/report-builder/schema/fieldRegistry.ts` | 944 field definitions | 1, 2 |
| `src/features/report-builder/store/reportBuilderStore.ts` | Zustand store (6,340 lines) | 0, 4 |
| `docs/bc research & notes/FULL-ECOSYSTEM-INTEGRATION.md` | System architecture | All |
| `docs/TDD-PAGE-ARCHITECTURE.md` | Page/section architecture | 1, 2 |
| `supabase/migrations/` | Database migrations | 0 |

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Job data → Report Builder | 100% fields mapped |
| Data persistence | Zero loss on any action |
| First-pass build success | 90%+ with PRP |
| Context efficiency | Fresh context per phase |

---

## Related Documentation

- **Hybrid Methodology:** `/Users/bencrowe/Development/0-Planing-Co-Mgt Area/Orchestrator-System/Hybrid-PRP-Methodology.md`
- **APR Orchestrator Context:** `/Users/bencrowe/Development/APR-Dashboard-v3/docs/bc research & notes/ORCHESTRATOR-CONTEXT.md`
- **Agent Registry:** `~/.claude/agents/`

---

*Version: 1.0*
*Methodology: Hybrid PRP v1.0*
