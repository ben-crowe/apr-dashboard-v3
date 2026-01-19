# APR Dashboard v3 - Knowledge Base

> **Purpose:** Domain knowledge reference for agents working on APR Dashboard
> **Total:** 6,513 lines of architecture, specifications, and field references

---

## Quick Start

**New to APR Dashboard?** Read in this order:
1. [DOMAIN-CONTEXT.md](#domain-context) - Mission, phases, key decisions (5 min read)
2. [FULL-ECOSYSTEM-INTEGRATION.md](#full-ecosystem-integration) - Complete system architecture (15 min read)
3. [PROJECT-INDEX.md](#project-index) - File navigation map (3 min read)

**Working on a specific feature?** Jump to:
- [IMAGE-CONFIGURATOR-FEATURE.md](#image-configurator-feature) - Image management system
- [TDD-Reference/](#tdd-reference) - Report Builder field references

---

## Core Documents

### DOMAIN-CONTEXT.md
**Lines:** 138 | **Last Updated:** 2026-01-05

**What it is:** Mission statement, phase roadmap, and key architectural decisions.

**Read this when:**
- Starting work on APR Dashboard for the first time
- Need to understand the 4-stage workflow
- Want to know what's in scope vs. out of scope
- Need context on why decisions were made

**Key sections:**
- Mission (4-stage appraisal workflow)
- Phases 0-7 roadmap
- Current focus and blockers
- Key decisions (standalone-first, home section, JSONB storage)
- Session log

---

### FULL-ECOSYSTEM-INTEGRATION.md
**Lines:** 743 | **Last Updated:** 2026-01-06

**What it is:** Complete system architecture showing data flow from client intake to final report.

**Read this when:**
- Need to understand the complete data flow
- Working on integration between stages
- Adding new database tables or fields
- Implementing Report Builder persistence
- Understanding the "platform independence" strategy

**Key sections:**
- System overview (4 stages)
- Database schemas (job_submissions, job_loe_details, job_property_info, report_builder_data)
- Status flow diagram
- Valcre integration mappings
- Report Builder architecture (944 fields, 30 sections)
- Integration bridge design (Supabase → Report Builder)
- Complete field mappings (35+ fields)
- Implementation plan (Phases 0-7)
- Platform independence strategy (kill Valcre, ClickUp, Pipedrive)

**Critical findings:**
- Home section exists but is hidden (2 fields: transmittal-date, transmittal-body)
- Report Builder is disconnected from Stages 1-3 (no persistence, no data bridge)
- Need report_builder_data table with JSONB storage
- Need /dashboard/job/:jobId/report route
- Auto-save strategy (2s debounce)

---

### PROJECT-INDEX.md
**Lines:** 170 | **Last Updated:** 2026-01-05

**What it is:** Navigation map to all files in the codebase.

**Read this when:**
- Looking for specific files
- Need to understand folder organization
- Want to know where documentation lives
- Searching for integration code

**Key sections:**
- Quick links to key documents
- Report Builder core files
- Image configurator files
- Job management files
- Integration points (Valcre, DocuSeal, ClickUp)
- Documentation by feature area (01-15 numbered folders)
- Patterns (reusable code)
- File zones (planning, reference, patterns, archive, code)

---

### IMAGE-CONFIGURATOR-FEATURE.md
**Lines:** 311 | **Last Updated:** 2026-01-06

**What it is:** Complete specification for the image management feature.

**Read this when:**
- Working on image upload/management
- Adding report type templates
- Modifying page layouts
- Understanding drag-and-drop logic
- Working with Supabase storage (appraisal-raw bucket)

**Key sections:**
- User flow (upload → filter → drag-and-drop → navigate)
- 6 report type templates (Standard, Quick, Land, Drive-By, Desktop, Commercial)
- Page layout examples (2x3 grids, 1x1 maps, etc.)
- Component structure (ImageGallery, LayoutBuilder, UploadZone)
- Database schema (page_layouts, page_layout_slots, job_images)
- Integration with Report Builder
- Testing checklist

**Implementation status:**
- ✅ Upload, gallery, filters, drag-and-drop, templates, integration
- 🚧 Testing with real job data, UX refinement
- ⏳ Auto-Fill, image editor, batch operations, custom pages

---

### PENDING-TASKS.md
**Lines:** 94 | **Last Updated:** 2026-01-06

**What it is:** Active task list with context for each task.

**Read this when:**
- Starting a new session (check what's pending)
- Looking for small tasks to tackle
- Need context on why a task exists

**Current tasks:**
1. Map Title Default Experience (Hybrid approach with data-sample fallback)

**Completed:**
- Docs folder cleanup (2026-01-06)

---

## TDD Reference

> **TDD = Test-Driven Dashboard** - The original Report Builder implementation with 944 fields across 30 sections.

### When to Use TDD Reference

**Read these files when:**
- Working with fieldRegistry.ts (944 fields)
- Understanding Report Builder sections and tabs
- Looking up field IDs and their purposes
- Understanding field structure (section → subsection → field)
- Working on calculator engine
- Understanding page-to-section mappings

### TDD Files

**TDD-PAGE-ARCHITECTURE.md** (882 lines)
- Complete architecture of Report Builder
- Page structure (70+ pages in HTML template)
- Section organization (30 sections)
- Field distribution analysis
- PostMessage bridge documentation
- Calculator engine overview
- Auto-save patterns

**TDD-FIELD-STRUCTURE-REFERENCE.md** (350 lines)
- Field organization by section
- 924 fields analyzed
- Section-to-field mappings
- Field type breakdown
- Input source analysis

**TDD-DASHBOARD-ANALYSIS.md** (188 lines)
- Active issues and bugs
- Field ID mismatches
- Template inconsistencies
- Known limitations

**TDD dashboard Tab & Fields.md** (2,452 lines)
- Exhaustive field reference
- Every field with metadata
- Section breakdown
- Field purpose explanations

**Unnumbered-Tabs-TDD-Dashboard.md** (1,185 lines)
- Alternative field structure view
- 875 fields organized differently
- Cross-reference for field lookup

---

## How to Use This Knowledge Base

### For Quick Context
```
Read: DOMAIN-CONTEXT.md
Time: 5 minutes
Gets you: Mission, phases, current focus
```

### For Architecture Understanding
```
Read: FULL-ECOSYSTEM-INTEGRATION.md
Time: 15 minutes
Gets you: Complete system architecture, database schemas, integration plan
```

### For File Navigation
```
Read: PROJECT-INDEX.md
Time: 3 minutes
Gets you: Where everything lives in the codebase
```

### For Feature Implementation
```
Read: IMAGE-CONFIGURATOR-FEATURE.md (if working on images)
Read: TDD-Reference/ (if working on Report Builder fields)
Time: 10-30 minutes depending on feature
Gets you: Complete feature spec with flows, schemas, implementation status
```

### For Daily Work
```
Read: PENDING-TASKS.md
Time: 2 minutes
Gets you: What needs to be done, what's already complete
```

---

## Integration with Cognee

**These files are perfect for Cognee ingestion:**

All files in this folder should be ingested into Cognee's knowledge graph to enable semantic search across APR domain knowledge.

**To ingest:**
```bash
# From APR-Dashboard-v3 root
/add-to-cognee docs/Knowledge-Base/
```

**Search examples:**
```
"How does the Report Builder integrate with job data?"
"What fields are in the home section?"
"Show me the database schema for job submissions"
"What's the status flow for jobs?"
"How does image configurator work?"
```

---

## Maintenance

**When to update these files:**

- **DOMAIN-CONTEXT.md** - After each session (update session log, change current focus)
- **PENDING-TASKS.md** - When tasks are added or completed
- **FULL-ECOSYSTEM-INTEGRATION.md** - When database schema changes or new integrations added
- **IMAGE-CONFIGURATOR-FEATURE.md** - When image feature changes or new phases completed
- **TDD Reference files** - When field registry changes significantly

**Who updates:**
- Agents working on APR Dashboard should update at session end
- Orchestrator should ensure consistency across documents

---

## Related Documentation

**Outside this folder:**
- `docs/Features/` - Feature-specific documentation (12 features)
- `docs/Testing/` - Testing documentation and guides
- `.agent/` - Agent quick-start guides (lightweight pointers)
- `PROJECT-STATUS.md` - Living session status (root level)
- `README.md` - Project setup and deployment (root level)

**Knowledge Base is the deep dive - other docs are quick reference or status tracking.**

---

**Last Updated:** 2026-01-19
