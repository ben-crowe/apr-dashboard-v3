# File Reorganization Plan - Phase 15 → Phase 16/17

**Created**: 2026-01-09
**Purpose**: Move relevant files from Phase 15 "Report Formatting Guide" to their proper homes in Phase 16 (Field Mapping) and Phase 17 (Template Management)

---

## Current Location

```
/docs/15-Contract-review/1-Formatting-template/Report Formatting Guide/
├── README.md
├── field-registry-guide.md
├── field-toggle-system.md
├── compact-styling-guide.md
├── apr-system-context.md
├── agent-mgr-progress.md
└── Registry fix report/
```

---

## Reorganization Analysis

### Files that belong in **Phase 17: Template Management**

| Current File | New Location | Reason |
|-------------|--------------|--------|
| `compact-styling-guide.md` | `docs/17-Template-Management/COMPACT-STYLING-GUIDE.md` | CSS compression for page overflow - template management |
| `field-toggle-system.md` | `docs/17-Template-Management/FIELD-TOGGLE-SYSTEM.md` | Dev Mode vs User Ready toggle - template feature |

**Rationale**: These are about the **template HTML/CSS**, not field mapping or registry.

### Files that belong in **Phase 16: Field Input-Output Mapping**

| Current File | New Location | Reason |
|-------------|--------------|--------|
| `field-registry-guide.md` | `docs/16-Field-Input-Output-Mapping/FIELD-REGISTRY-GUIDE.md` | Field ID conventions, registry structure - mapping concern |

**Rationale**: This is about **field definitions and registry**, which is the foundation for input-output mapping.

### Files that stay in Phase 15 (or archive)

| Current File | Action | Reason |
|-------------|--------|--------|
| `apr-system-context.md` | Keep in Phase 15 OR move to `.agent/system/` | System overview - belongs in agent context |
| `agent-mgr-progress.md` | Archive to Phase 15 history | Progress log - historical, not active reference |
| `Registry fix report/` | Archive to Phase 15 history | Audit work - completed, historical |
| `README.md` | Update to point to new locations | Navigation file |

---

## Proposed New Structure

### Phase 16: Field Input-Output Mapping
```
docs/16-Field-Input-Output-Mapping/
├── README.md (existing)
├── 01-INCOME-APPROACH-INPUT-OUTPUT-MAP.md (existing)
├── 02-SALES-COMPARISON-INPUT-OUTPUT-MAP.md (existing)
├── 03-COST-APPROACH-INPUT-OUTPUT-MAP.md (existing)
├── 04-RECONCILIATION-INPUT-OUTPUT-MAP.md (existing)
├── 05-FIELD-ALIGNMENT-VERIFICATION.md (existing)
├── 06-VALCRE-WORKBOOK-INCOME-STRUCTURE.md (existing)
├── 07-TEMPLATE-PAGES-ANALYSIS.md (existing)
├── AGENT-PROMPTS.md (existing)
├── Calculator-Field-Reference-v2.html (existing)
├── Calculator-Field-Reference-v2.md (existing)
├── Income-Input-UI-Mockup-v2.html (existing)
└── FIELD-REGISTRY-GUIDE.md (NEW - moved from Phase 15)
```

### Phase 17: Template Management
```
docs/17-Template-Management/
├── README.md (existing)
├── CHANGELOG.md (existing)
├── DESIGN-STANDARDS.md (existing)
├── COMPACT-STYLING-GUIDE.md (NEW - moved from Phase 15)
├── FIELD-TOGGLE-SYSTEM.md (NEW - moved from Phase 15)
└── templates/
    ├── table-standard.html (existing)
    ├── header-standard.html (existing)
    └── comp-sheet-table.html (existing)
```

---

## File Content Updates Needed

### 1. COMPACT-STYLING-GUIDE.md (move to Phase 17)

**Current content**: ✅ Already perfect for Phase 17
- CSS compression techniques
- Page overflow fixes
- Progressive compression levels
- Page-specific examples

**Update needed**:
- Add header referencing DESIGN-STANDARDS.md
- Cross-reference with template version in CHANGELOG.md

### 2. FIELD-TOGGLE-SYSTEM.md (move to Phase 17)

**Current content**: ✅ Already perfect for Phase 17
- Dev Mode vs User Ready Mode
- Toggle implementation
- CSS styles for both modes
- data-field-id attribute usage

**Update needed**:
- Add to DESIGN-STANDARDS.md as a subsection
- Or keep as separate reference guide

### 3. FIELD-REGISTRY-GUIDE.md (move to Phase 16)

**Current content**: ✅ Perfect for Phase 16
- Field naming conventions (kebab-case)
- inputSource types (user-input vs calculated)
- 4-file sync requirements
- Field structure examples

**Update needed**:
- Rename to match Phase 16 doc pattern (all caps)
- Add to README.md progress tracker
- Cross-reference with 01-07 field mapping docs

---

## Migration Steps

### Step 1: Copy files to new locations

```bash
# Copy to Phase 17
cp "docs/15-Contract-review/1-Formatting-template/Report Formatting Guide/compact-styling-guide.md" \
   "docs/17-Template-Management/COMPACT-STYLING-GUIDE.md"

cp "docs/15-Contract-review/1-Formatting-template/Report Formatting Guide/field-toggle-system.md" \
   "docs/17-Template-Management/FIELD-TOGGLE-SYSTEM.md"

# Copy to Phase 16
cp "docs/15-Contract-review/1-Formatting-template/Report Formatting Guide/field-registry-guide.md" \
   "docs/16-Field-Input-Output-Mapping/FIELD-REGISTRY-GUIDE.md"
```

### Step 2: Update content headers

Add to each moved file:
```markdown
**Originally from**: Phase 15 Contract Review / Report Formatting Guide
**Moved to**: Phase 16/17 (2026-01-09)
**Purpose**: [Proper categorization in active phase folders]
```

### Step 3: Update README files

**Phase 16 README.md**:
- Add FIELD-REGISTRY-GUIDE.md to file list
- Note it covers field conventions and registry structure

**Phase 17 README.md**:
- Add COMPACT-STYLING-GUIDE.md to file list
- Add FIELD-TOGGLE-SYSTEM.md to file list
- Reference them in "Common Issues & Solutions"

**Phase 15 README.md**:
- Update to note files moved to Phase 16/17
- Add links to new locations

### Step 4: Archive Phase 15 historical files

```bash
# Create archive folder
mkdir -p "docs/15-Contract-review/1-Formatting-template/Report Formatting Guide/archive-2026-01-09"

# Move historical files
mv "docs/15-Contract-review/1-Formatting-template/Report Formatting Guide/agent-mgr-progress.md" \
   "docs/15-Contract-review/1-Formatting-template/Report Formatting Guide/archive-2026-01-09/"

mv "docs/15-Contract-review/1-Formatting-template/Report Formatting Guide/Registry fix report" \
   "docs/15-Contract-review/1-Formatting-template/Report Formatting Guide/archive-2026-01-09/"
```

### Step 5: Commit with clear message

```bash
git add docs/16-Field-Input-Output-Mapping/FIELD-REGISTRY-GUIDE.md
git add docs/17-Template-Management/COMPACT-STYLING-GUIDE.md
git add docs/17-Template-Management/FIELD-TOGGLE-SYSTEM.md
git add docs/15-Contract-review/

git commit -m "refactor(docs): reorganize Phase 15 guides into Phase 16/17

Moved files to proper phase folders:
- field-registry-guide.md → Phase 16 (field mapping concern)
- compact-styling-guide.md → Phase 17 (template CSS)
- field-toggle-system.md → Phase 17 (template feature)

Archived historical files:
- agent-mgr-progress.md (progress log)
- Registry fix report/ (completed audit)

Updated README files with new locations.

Rationale: Phase 15 was contract review work (historical).
Active template/field work belongs in Phase 16/17.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Benefits of Reorganization

### Before (Phase 15 - confusing)
- ❌ Active reference docs mixed with historical work
- ❌ Template guides in "Contract Review" phase
- ❌ Field registry guide not near field mapping docs
- ❌ Hard to find: "Is it in Phase 15, 16, or 17?"

### After (Phase 16/17 - logical)
- ✅ Phase 16: All field-related docs in one place
- ✅ Phase 17: All template-related docs in one place
- ✅ Phase 15: Historical contract review work archived
- ✅ Clear: "Template question? → Phase 17. Field question? → Phase 16."

---

## Quick Reference After Migration

**Need field naming conventions?**
→ `docs/16-Field-Input-Output-Mapping/FIELD-REGISTRY-GUIDE.md`

**Need CSS compression for page overflow?**
→ `docs/17-Template-Management/COMPACT-STYLING-GUIDE.md`

**Need Dev Mode vs User Ready toggle info?**
→ `docs/17-Template-Management/FIELD-TOGGLE-SYSTEM.md`

**Need field input → output mappings?**
→ `docs/16-Field-Input-Output-Mapping/01-07-*.md`

**Need template design standards?**
→ `docs/17-Template-Management/DESIGN-STANDARDS.md`

---

## Decision Point

**Should we execute this reorganization now?**

**Pros**:
- ✅ Logical organization
- ✅ Easier to find docs
- ✅ Separates active vs historical
- ✅ Aligns with Phase 16/17 purposes

**Cons**:
- ⚠️ Breaks existing links/bookmarks (if any)
- ⚠️ Need to update multiple README files
- ⚠️ Takes ~15 minutes of work

**Recommendation**: ✅ **Yes, execute now** - Better organization pays off long-term

---

**Status**: ⏸️ Awaiting user approval
**Next**: Execute Steps 1-5 if approved
