# Deployment Brief: Docs Folder Cleanup

**From:** Marcel (Co-Arch)
**To:** APR-Mgr
**Date:** 2026-01-06
**Status:** Ready to Execute

---

## CONTEXT

38 loose files at `/docs/` root need organized homes. Research completed by 4 Haiku agents analyzing every file for content, date, relevance, and proper location.

**Current state:** Chaotic but functional
**Goal:** Zero loose files at docs root (except core references), everything in its proper folder

---

## OBJECTIVE

Move 38 files from docs root into appropriate folders following organizational principles:
1. Every folder needs a README
2. Every folder needs a purpose
3. No loose files without homes

---

## FILE MOVES (Organized by Destination)

### 1. Create New Folder Structure

```bash
docs/
├── assets/
│   └── logos/
├── archive/
│   ├── sessions/
│   ├── fixes-applied/
│   └── technical-findings/
└── .secrets/  # Or use password manager
```

### 2. Move to 07-Valcre-Integration/ (3 files)

- `1-API-FIELD-MAPPING-REFERENCE.md` (37.8 KB) - Master API reference
- `6-CUSTOM-FIELDS-ANALYSIS.md` (22.3 KB) - 10 custom fields roadmap
- `5-FIELD-MAPPING-ASSUMPTIONS.md` (3.7 KB) - Needs client confirmation on "Investment Value" mapping

### 3. Move to 06-LOE-Generator/ (1 file)

- `3-DOCUSEAL-LOE-FIELD-MAPPING.md` (26.7 KB) - DocuSeal/E-signature integration

### 4. Move to patterns/ (5 files)

- `IMAGE-GALLERY-CODE-PATTERNS.md` (Jan 3) - Production-ready React components
- `IMAGE-GRID-GALLERY-PATTERNS.md` (Jan 3) - Codebase pattern analysis
- `IMAGE-SEARCH-RESULTS-SUMMARY.txt` (Jan 3) - Search summary
- `PATTERN-QUICK-REFERENCE.md` (Jan 3) - Decision tree
- `README-IMAGE-PATTERNS.md` (Jan 3) - Navigation hub
- `4-SINGLE-TO-MULTI-SELECT-PATTERN.md` (Dec 29) - Architectural pattern

### 5. Move to APR-Domain Mgr/ (4 files)

- `TDD-FIELD-STRUCTURE-REFERENCE.md` (Dec 20) - 924 fields reference
- `TDD-DASHBOARD-ANALYSIS.md` (Dec 23) - Active issues
- `Unnumbered-Tabs-TDD-Dashboard.md` (Dec 23) - 875 fields structural reference
- `TDD dashboard Tab & Fields.md` (Dec 20) - Master TDD reference

### 6. Move to archive/fixes-applied/ (4 files)

- `PROPERTYTYPE-FIX-APPLIED.md` (Dec 29) - Historical bug fix
- `PROPERTYTYPE-MULTISELECT-FINDINGS.md` (Dec 29) - Investigation
- `PROPERTYTYPE-PROPERTYCONTACT-FINDINGS.md` (Dec 29) - Debugging doc
- `NEXT-SESSION-IMAGES.md` (Jan 5) - Images fix

### 7. Move to archive/sessions/ (1 file)

- `SESSION-SUMMARY-2025-12-23.md` (Dec 29)

### 8. Move to archive/technical-findings/ (1 file)

- `FINDINGS-AND-NOTES.md` (Dec 29) - Working notes

### 9. Move to archive/screenshots/ (1 file)

- `Screenshot 2025-12-08 at 8.23.38 AM.png` (323 KB)

### 10. Move to assets/logos/ (2 files)

- `Valta-blue.2.svg` (37 KB)
- `Valta-logo-lt.blue.v3.png` (36 KB)

### 11. Secure Location (1 file)

- `LOGIN-CREDENTIALS-PHASE-1.md` → Move to `.secrets/` or password manager
  - Contains: Supabase, ClickUp, Valcre project IDs and login URLs
  - **ACTION REQUIRED:** Confirm with Ben where to move this

### 12. Keep at Root (8 files - these are fine)

- `ARCHITECTURE-OVERVIEW.md` - Main architecture reference
- `PHASE-1-COMPLETE-WORKFLOW.md` - Phase 1 master doc
- `APR-Hybrid-Execution-Plan.md` - Execution blueprint
- `DATA-FLOW-EXPLANATION.md` - Technical reference
- `README-UPDATED.md` - Active project guide
- `deployment.md` - Deployment guide
- `EMPTY-FIELDS-LIST.json` - Data reference
- `intended use-Scope.png` - Scope diagram

### 13. Evaluate/Delete (3 files)

- `README.md` - Check if superseded by README-UPDATED.md, delete if duplicate
- `DOCUMENTATION-INDEX.md` - Update or consolidate with DOCS-INDEX.md
- `FIELD-ID-MISMATCH-ANALYSIS.md` - Archive if test data issue fixed
- `TEMPLATE-FIELD-ID-ANALYSIS.md` - Archive if registry updated
- `TEMPLATE-FIELD-ID-MISMATCH.md` - Archive if template fixed

---

## PHASES

### Phase 1: Create Folder Structure (5 min)

Deploy sub-agent to create:
```bash
mkdir -p docs/assets/logos
mkdir -p docs/archive/sessions
mkdir -p docs/archive/fixes-applied
mkdir -p docs/archive/technical-findings
mkdir -p docs/archive/screenshots
mkdir -p docs/.secrets
```

### Phase 2: Move Files (20 min)

Deploy sub-agent to execute all moves listed above.

**Critical:** Use `git mv` not `mv` to preserve history.

### Phase 3: Add READMEs to Numbered Folders (30 min)

Deploy sub-agent to check all folders 01-15 and add README.md if missing.

**README format:**
```markdown
# [Number] - [Folder Name]

**Purpose:** [1-2 sentence description]

**Contents:**
- [Key file 1]
- [Key file 2]

**Related:** [Links to other relevant folders]

*Last Updated: YYYY-MM-DD*
```

Use DOCS-INDEX.md as reference for folder purposes.

### Phase 4: Update Cross-References (10 min)

Update any broken links in:
- ARCHITECTURE-OVERVIEW.md
- DOCUMENTATION-INDEX.md
- APR-Domain Mgr/PROJECT-INDEX.md

### Phase 5: Verify & Commit (5 min)

```bash
# Check no loose files remain (except allowed)
ls -la docs/*.md docs/*.png docs/*.json

# Commit
git add docs/
git commit -m "Organize docs: move 38 files to proper folders

- Created archive/, assets/logos/, .secrets/ structure
- Moved API/field mappings to 07-Valcre-Integration/
- Moved DocuSeal docs to 06-LOE-Generator/
- Moved patterns to patterns/
- Moved TDD docs to APR-Domain Mgr/
- Archived historical fixes and sessions
- All numbered folders now have READMEs"
```

---

## CONSTRAINTS

1. **Use `git mv` not `mv`** - Preserve file history
2. **Don't delete anything** - Archive instead
3. **Ask Ben about LOGIN-CREDENTIALS-PHASE-1.md** - Don't move to .secrets/ without confirmation
4. **Check for broken links** - Update any references to moved files
5. **Test doc links** - Verify ARCHITECTURE-OVERVIEW.md links still work

---

## SUCCESS CRITERIA

- [ ] Zero loose files at docs/ root (except 8 allowed files)
- [ ] All 15 numbered folders have README.md
- [ ] assets/logos/ contains 2 brand assets
- [ ] archive/ contains 3 subdirectories with historical docs
- [ ] patterns/ contains 6 pattern files
- [ ] 07-Valcre-Integration/ contains 3 API/field files
- [ ] 06-LOE-Generator/ contains DocuSeal field mapping
- [ ] APR-Domain Mgr/ contains 4 TDD reference files
- [ ] No broken links in architecture docs
- [ ] All changes committed to git

---

## AGENT DEPLOYMENT

**Recommended:**
- **Phase 1-2:** Single `frontend-developer` agent (file moves)
- **Phase 3:** Single `technical-writer` agent (READMEs)
- **Phase 4:** Single `documentation-engineer` agent (link updates)

**Alternative:** Deploy all 3 in parallel with clear boundaries.

---

## HANDOFF NOTES

After completion:
1. Update PENDING-TASKS.md - mark #2 complete
2. Update DOMAIN-CONTEXT.md session log
3. Verify with Ben that LOGIN-CREDENTIALS-PHASE-1.md went to the right place

---

**Brief Version:** 1.0
**Research Completed:** 2026-01-06 by 4 Haiku agents
**Ready for Execution:** Yes
