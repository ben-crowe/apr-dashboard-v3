# Plan: APR Frontend & Template Expert Agent

**Created:** December 27, 2025
**Project:** APR Dashboard v3 - Report-MF-Template Management
**Goal:** Create a specialized Claude Code agent that combines frontend development + template management expertise

---

## Problem Statement

Ben currently uses Claude Desktop for editing Report-MF-template pages because:
- Easy HTML preview
- Page-by-page focused editing
- Good for styling work

But Claude Desktop can't:
- Read local codebase files
- Commit to git
- Manage version control
- Validate against fieldRegistry
- Know the 4-file sync system

**Solution:** Create a hybrid agent in Claude Code that does BOTH.

---

## Agent: `apr-frontend-template-expert`

### Core Capabilities

**1. Frontend Development (like Desktop agent)**
- Edit HTML pages with proper styling
- Understand the 77-page report structure
- Work with CSS scoped to `.page-XX` classes
- Know the placeholder pattern `{{field-id}}`
- Preview workflow: knows localhost:8082/mock-builder

**2. Template Management (codebase integration)**
- Maintain `/public/Report-MF-template.html` (canonical)
- Version control with changelog in HTML comment
- Validate field IDs against `fieldRegistry.ts`
- 4-file sync awareness (registry, test data, template, images)
- Git commits with proper messages

**3. Desktop Handoff**
- Export pages/template for Desktop continuation
- Import edits from Desktop and merge
- Maintain working copies in accessible location
- Track which pages were edited and by whom

---

## File Structure

### Agent Definition
```
~/.claude/agents/00-Custom-Agents/apr-frontend-template-expert.md
```

### Agent Workspace (THIS FOLDER)
```
/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting-template/
├── README.md                               # Agent instructions (update)
├── TEMPLATE-STATUS.md                      # Current version, changelog (CREATE)
├── MASTER-PAGE-FIELD-REFERENCE.md          # 93KB page field reference (EXISTS)
│
├── -Template-Master Doc Previewer/         # Individual pages & field mappings
│   ├── Page-31.html ... Page-XX.html       # Individual page HTML files
│   ├── FIELD-MAPPING-Page-XX-Registry.md   # Field mappings per page
│   ├── Graph-Pg.XX-buildplan.md            # Build plans for complex pages
│   └── PREVIEW-Master*.html                # Preview versions
│
├── various to organize-cleanup/            # NEEDS ORGANIZATION
│   ├── Report-MF-Template-Framed-v2.1.html # Historical version
│   ├── Report-MF-Template-Framed-v2.2.html # Historical version
│   ├── Report-MF-Template-Framed-v2.3.html # Historical version (CURRENT?)
│   ├── [analysis docs]                     # Move to organized location
│   └── [validation reports]                # Move to organized location
│
├── -Templates & Guides/                    # Reference templates
├── REPORT Pg Img/                          # 50 page reference images
├── Report Table Reference images/          # Table reference images
└── -passover-sessions/                     # Session handoffs
```

### Key Discovery: Historical Versions Exist!
The `various to organize-cleanup/` folder contains:
- `Report-MF-Template-Framed-v2.1.html`
- `Report-MF-Template-Framed-v2.2.html`
- `Report-MF-Template-Framed-v2.3.html`

These may be MORE CURRENT than what's in `/public/Report-MF-template.html`!

### Source Files (managed by agent)
```
/public/Report-MF-template.html             # Canonical template (8,293 lines)
/src/features/report-builder/schema/fieldRegistry.ts    # Field definitions
/src/features/report-builder/data/northBattlefordTestData.ts  # Test data
```

---

## Agent Knowledge Requirements

### Domain Knowledge to Embed

1. **Template Structure**
   - 77 unique pages in the report
   - Page dimensions: 816px × 1056px (US Letter at 96 DPI)
   - CSS must be scoped with `.page-XX` prefix
   - Placeholder format: `{{field-id}}` (kebab-case)

2. **4-File Sync System**
   - fieldRegistry.ts = source of truth for field IDs
   - Template placeholders must match registry IDs
   - Test data keys must match registry IDs
   - Image mapping must match registry IDs

3. **Field Naming Convention**
   - Always kebab-case: `comp1-sale-price`
   - Prefixes: calc-, comp1-5, img-, site-, etc.
   - 1,687 total fields in registry

4. **Preview Workflow**
   - Mock-builder at http://localhost:8082/mock-builder
   - Template loaded via fetch('/Report-MF-template.html')
   - Changes visible after page refresh or store update

5. **Version Control**
   - Version in HTML comment header (lines 7-9)
   - Changelog in comment (after line 19)
   - Sync set version must match across 3 files

---

## Workflow Patterns

### Pattern 1: Direct Edit in Claude Code
```
1. User: "Edit page 45 to improve the income table styling"
2. Agent reads current template
3. Agent extracts page 45 section
4. Agent makes CSS/HTML edits (scoped to .page-45)
5. Agent validates field IDs
6. Agent updates template with changes
7. Agent bumps version, adds changelog entry
8. User previews at localhost:8082/mock-builder
```

### Pattern 2: Export for Desktop
```
1. User: "Export pages 30-35 for Desktop editing"
2. Agent extracts pages 30-35 to workspace folder
3. Agent creates standalone HTML files with styles
4. User opens in Claude Desktop for visual editing
5. User brings edited pages back to Claude Code
6. Agent merges changes into canonical template
7. Agent validates and commits
```

### Pattern 3: Import from Desktop
```
1. User: "Here's the updated page 45 from Desktop"
2. Agent receives edited HTML
3. Agent validates field IDs against registry
4. Agent merges into canonical template
5. Agent updates version and changelog
6. Agent commits to codebase
```

---

## Implementation Steps

### Phase 1: Audit & Organize Existing Workspace
**Location:** `/docs/15-Contract-review/1-Formatting-template/`

1. **Inventory individual page files** in `-Template-Master Doc Previewer/`:
   - Found: Page-31, 32, 33, 34, 37, 37-2, 38, 38-2, 38-3
   - These may be optimized versions NOT YET in main template

2. **Organize `various to organize-cleanup/`** folder:
   - Move historical templates (v2.1, v2.2, v2.3) to `-Archive/` subfolder
   - Categorize analysis docs into proper locations
   - Clean up screenshots and temp files

3. **Create TEMPLATE-STATUS.md** with:
   - Current version deployed to `/public/`
   - List of optimized pages pending merge
   - Sync status with fieldRegistry

### Phase 2: Create Agent Definition
1. Create `~/.claude/agents/00-Custom-Agents/apr-frontend-template-expert.md`
2. Embed domain knowledge:
   - Workspace location: `/docs/15-Contract-review/1-Formatting-template/`
   - Individual pages location: `-Template-Master Doc Previewer/`
   - 4-file sync system understanding
   - Field naming conventions (kebab-case)
   - Page structure (77 pages, 816×1056px)
3. Define workflows:
   - Edit page directly
   - Merge individual page into main template
   - Export for Desktop
   - Import from Desktop
   - Validate and commit

### Phase 3: Merge Optimized Pages
1. Compare individual page files to corresponding sections in main template
2. Identify differences (optimizations, styling, field changes)
3. Merge optimized pages into `/public/Report-MF-template.html`
4. Bump version to 2.4.0
5. Update changelog

### Phase 4: Create Skill Commands
1. `/template-status` - Show version, pending merges, sync status
2. `/template-export [pages]` - Export pages for Desktop editing
3. `/template-import` - Import and merge edits
4. `/template-validate` - Check field IDs against registry
5. `/template-merge [page]` - Merge individual page into main template

### Phase 5: Test Workflow
1. Test direct editing workflow
2. Test Desktop export/import cycle
3. Verify preview at localhost:8082/mock-builder
4. Verify git commits are proper

---

## Key Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `~/.claude/agents/00-Custom-Agents/apr-frontend-template-expert.md` | CREATE | Agent definition |
| `docs/15-Contract-review/1-Formatting-template/TEMPLATE-STATUS.md` | CREATE | Version tracking & merge status |
| `docs/15-Contract-review/1-Formatting-template/README.md` | UPDATE | Add agent instructions |
| `docs/15-Contract-review/1-Formatting-template/-Archive/` | CREATE | Move historical versions here |
| `~/.claude/commands/template-status.md` | CREATE | Status command |
| `~/.claude/commands/template-export.md` | CREATE | Export command |
| `~/.claude/commands/template-import.md` | CREATE | Import command |
| `~/.claude/commands/template-merge.md` | CREATE | Merge page into template |
| `/public/Report-MF-template.html` | UPDATE | Merge optimized pages, bump to v2.4.0 |

---

## Success Criteria

- [ ] Agent can edit template pages directly with proper styling
- [ ] Agent validates field IDs against registry before committing
- [ ] Agent maintains version control in HTML comment header
- [ ] Desktop handoff workflow works (export → edit → import)
- [ ] Preview at localhost:8082/mock-builder shows changes
- [ ] 4-file sync awareness prevents broken placeholders

---

## Notes

- This agent essentially replaces need for Claude Desktop for template work
- Desktop can still be used for visual preview/refinement
- Bidirectional handoff means either tool can pick up where other left off
- Agent knows codebase structure that Desktop cannot access

---

*Plan created: December 27, 2025*
*Location: /docs/15-Contract-review/1-Formatting-template/*
