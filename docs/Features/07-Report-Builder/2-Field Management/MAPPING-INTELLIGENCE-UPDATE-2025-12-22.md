# Mapping Intelligence Update - December 22, 2025

**Purpose:** Organize new field mapping intelligence from agent collaboration
**Status:** Receiving documents in progress
**Registry Agent Home:** `/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/2-Field Management`

---

## 📥 Incoming Documents

| Document | Destination | Lines/Size | Purpose |
|----------|-------------|------------|---------|
| **VAL_REPORT_STRUCTURE.md** | `/valcre-mappings/` | ~340 lines | Page-by-page Valcre Word doc structure (74 pages) |
| **Valcre Table Field Mapping** | `/valcre-mappings/` | ~500+ lines | Cell-by-cell named ranges for 12 priority tables |
| **PAGE-INVENTORY.md** | `/template-structure/` | ~100 lines | Template page structure (71 pages) |
| **MASTER-PAGE-FIELD-REFERENCE-2_1.md** | `/template-structure/` | 2,412 lines | Kebab-case field IDs per page |
| **Report-MF-Template-Framed-v2.1.html** | `/template-structure/` | 8,000+ lines | Actual HTML template |

---

## 🔄 How This Updates Existing Documentation

### Current Assets in This Directory

**Existing (from README):**
- MASTER-FIELD-DIRECTORY.md - 7,967 fields from Word HTML
- VALCRE-WORKBOOK-TECHNICAL-GUIDE.md - 700+ named ranges (OLD)
- valcre-named-ranges-complete.json - 9,652 named ranges (GROUND TRUTH)
- FIELD-ALIGNMENT-REPORT.md - Three-way alignment
- DATA-FLOW-SUMMARY.md - End-to-end flow

**New Intelligence:**
- **7,988 Valcre named ranges cataloged** across 14 worksheets (more comprehensive than 700+ in old guide)
- **12 priority tables mapped** cell-by-cell with named range patterns
- **Template v2.1** with 2,412 field references (updated from older analysis)
- **74-page Valcre report structure** (Word doc breakdown)

### What This Enables

**Before:**
- Had fieldRegistry.ts (889 fields)
- Had valcre-named-ranges-complete.json (9,652 ranges)
- Had template with field IDs
- **MISSING**: Clear mapping between them

**After:**
- Named range patterns documented (Subject_*, IA_DirCap_*, SA1_N_*, etc.)
- Cell references for 12 priority tables
- **CROSSWALK TO BUILD**: Valcre ID → Kebab-Case ID
- Complete chain: Valcre Cell → Named Range → Our ID → Template → Registry

---

## 📂 New Subdirectory Structure

```
/docs/15-Contract-review/2-Field Management/
├── README.md (existing - needs update)
├── MAPPING-INTELLIGENCE-UPDATE-2025-12-22.md (this file)
│
├── valcre-mappings/ (NEW)
│   ├── VAL_REPORT_STRUCTURE.md (incoming)
│   ├── Valcre-Table-Field-Mapping.md (incoming)
│   └── [other Valcre extraction docs]
│
├── template-structure/ (NEW)
│   ├── PAGE-INVENTORY.md (incoming)
│   ├── MASTER-PAGE-FIELD-REFERENCE-2_1.md (incoming)
│   └── Report-MF-Template-Framed-v2.1.html (incoming)
│
└── crosswalks/ (NEW)
    ├── valcre-to-kebab-crosswalk.md (TO BE BUILT)
    ├── priority-tables-mapping.md (TO BE BUILT)
    └── missing-fields-analysis.md (TO BE BUILT)
```

---

## 🎯 Key Value Additions

### 1. Named Range Patterns (NEW)
**Valcre naming conventions documented:**
- `Subject_*` → Subject property fields
- `IA_DirCap_*` → Direct Capitalization fields
- `SA1_N_*` → Sales Comp N fields
- `SU1_N_*` → Survey Comp N fields
- `Value_*` → Value conclusion fields

**Impact:** Can now systematically map Valcre → Our IDs using pattern matching

### 2. Cell References for Priority Tables (NEW)
**12 core tables mapped cell-by-cell:**
1. Direct Cap
2. Sales Grid
3. Rent Roll
4. Survey
5. Property Overview
6. Investment Indicators
7. Value Conclusion
8. Unit Mix
9. Building Description
10. Economic Indicators
11. Operating Expenses
12. Cap Rate

**Impact:** Can trace any field back to exact Valcre workbook cell (e.g., DIRECTCAP!$L$253)

### 3. Updated Template Analysis (NEW)
**Template v2.1 with 2,412 field references:**
- More current than older MASTER-FIELD-DIRECTORY.md (7,967 fields)
- 71 pages (vs 74 in Valcre Word doc - needs reconciliation)
- Kebab-case IDs documented per page

**Impact:** Current template structure for fieldRegistry verification

---

## 🚀 Next Actions for Registry Agent

### Phase 1: Receive & Organize (IN PROGRESS)
- [x] Create subdirectories in correct location
- [x] Create this tracking document
- [ ] Receive 5 documents from user
- [ ] Place documents in appropriate subdirectories
- [ ] Update README.md with new structure

### Phase 2: Build Crosswalk (NEXT)
- [ ] Extract Valcre named ranges from new mapping docs
- [ ] Extract kebab-case IDs from MASTER-PAGE-FIELD-REFERENCE-2_1.md
- [ ] Create mapping table: Valcre ID ↔ Kebab-Case ID
- [ ] Validate mappings against valcre-named-ranges-complete.json
- [ ] Document patterns and exceptions

### Phase 3: Validate Registry (THEN)
- [ ] Check 889 existing fieldRegistry.ts entries against crosswalk
- [ ] Identify mismatches or incorrect mappings
- [ ] Flag fields in template but not in registry
- [ ] Create prioritized addition list

### Phase 4: Add Missing Fields (FINALLY)
- [ ] Use crosswalk to add 41 priority fields with correct Valcre mappings
- [ ] Verify each addition against ground truth
- [ ] Commit atomically with Valcre ID in commit message
- [ ] Update crosswalk with new entries

---

## 🔗 The Complete Mapping Chain

**Goal:** Connect every field from source to destination

```
Valcre Workbook
    ↓ (cell reference)
DIRECTCAP!$L$253
    ↓ (named range)
IA_DirCap_NOI
    ↓ (pattern mapping - TO BE BUILT)
calc-noi
    ↓ (template placeholder)
{{calc-noi}}
    ↓ (registry entry)
fieldRegistry.ts line 542
    ↓ (store management)
reportBuilderStore.ts
    ↓ (template interpolation)
Report Output HTML
```

**Each link now documented!**

---

## 📊 Updated Statistics

### Current State (Dec 22, 2025)

| Metric | Count | Source |
|--------|-------|--------|
| **Field Registry Entries** | 889 | fieldRegistry.ts (grep count) |
| **Fields to Add** | 41 | Priority list from planning |
| **Valcre Named Ranges** | 9,652 | valcre-named-ranges-complete.json |
| **Template Field References** | 2,412 | MASTER-PAGE-FIELD-REFERENCE-2_1.md (incoming) |
| **Valcre Report Pages** | 74 | VAL_REPORT_STRUCTURE.md (incoming) |
| **Template Pages** | 71 | PAGE-INVENTORY.md (incoming) |
| **Priority Tables Mapped** | 12 | Valcre Table Field Mapping (incoming) |
| **Worksheets Cataloged** | 14 | Valcre mapping analysis |
| **Named Ranges Documented** | 7,988 | Across 14 worksheets |

### Gap Analysis
- **Page Count Mismatch:** 74 (Valcre) vs 71 (Template) → Need reconciliation
- **Field Count Mismatch:** 7,967 (old MASTER-FIELD-DIRECTORY) vs 2,412 (new MASTER-PAGE-FIELD-REFERENCE) → Need explanation
- **Named Ranges:** 9,652 (ground truth) vs 7,988 (new mapping) vs 700+ (old guide) → Need consolidation

---

## 💡 Registry Agent Working Directory

**HOME BASE (Document in Registry Agent Skill):**
```
/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/2-Field Management
```

**Never create field management docs in:**
- ❌ `/docs/15-Contract-review/1-Formatting & Report/` (that's for HTML/design agents)
- ❌ Any new "Field Mapping Intelligence" directories
- ✅ ALWAYS use `/2-Field Management/` for Registry Agent work

**Subdirectory Organization:**
- `/valcre-mappings/` - Valcre workbook structure and extractions
- `/template-structure/` - HTML template analysis and field IDs
- `/crosswalks/` - Mapping tables between systems
- `/archive/` - Superseded documentation
- `/-passover-sessions/` - Session handoff notes

---

## ✅ Status

**Current:** Awaiting 5 documents from user
**Next:** Organize documents and build crosswalk
**Goal:** Complete Valcre → Kebab-Case ID mapping for fieldRegistry verification

**Ready to receive documents.**
