# APR Dashboard v3 - Documentation

**Last Updated**: 2025-11-13
**Project Status**: Active Development
**Documentation Status**: ✅ Comprehensive API & Integration References Complete

---

## 📚 About This README

**You are reading**: Documentation Index (for technical specs, integrations, planning)

**Also available**: [Code Repository README](../README.md) (for installation, setup, running the app)

**The distinction**:
- **Code Repository README** (`/README.md`) - Get the application running (installation, tech stack, quick start)
- **Documentation README** (`/docs/README.md`) - Understand how it works (field mappings, integrations, architecture)

---

## 📖 Quick Start

**New to this project?** Start here:

1. **Read the Core References** (below) - Complete technical documentation
2. **Check Implementation Status** - See what's working vs. in progress
3. **Review Section Plans** - Deep dive into specific features

**Returning to work?** Check the passover sessions folder for latest context.

---

## 🎯 Core Reference Documentation

These documents are **reverse-engineered from production code** and serve as the **single source of truth** for field mappings and API integrations.

### 1️⃣ Valcre API & Field Mapping Reference

**File**: `1-API-FIELD-MAPPING-REFERENCE.md` (42KB)

**Coverage**: Complete Valcre API integration
- Section 1 & 2 field mappings (95% functional)
- 5 complete enum conversion maps (66 value mappings)
- Special handling patterns (currency, addresses, comments)
- Authentication & entity creation flow
- All code references with exact line numbers

**Use this for**: Understanding how Dashboard data flows to Valcre API

---

### 2️⃣ ClickUp Integration Reference

**File**: `2-CLICKUP-INTEGRATION-REFERENCE.md`

**Coverage**: Complete ClickUp task automation
- Two-stage task system (auto-creation + manual update)
- Task name & description formats
- Markdown field mapping
- Auto-creation via Supabase Edge Function
- Template system (9-step workflow checklist)
- Idempotency & error handling

**Use this for**: Understanding ClickUp task creation and updates

**Status**: Auto-creation LIVE since Nov 4, 2025

---

### 3️⃣ DocuSeal LOE Field Mapping

**File**: `3-DOCUSEAL-LOE-FIELD-MAPPING.md`

**Coverage**: Complete DocuSeal e-signature integration
- All 22 LOE field mappings documented
- Template ID: 1680270
- Validation logic & required fields
- ClickUp checklist auto-update
- Webhook handling for signed documents
- SELECT field handling (intentionally empty)

**Use this for**: Understanding LOE document generation and e-signature flow

---

### 4️⃣ Single-to-Multi Select Pattern

**File**: `4-SINGLE-TO-MULTI-SELECT-PATTERN.md`

**Coverage**: Reusable pattern for form fields that support both single and multiple values
- Two-tier UX pattern (client form vs. dashboard)
- Valcre string requirement (why arrays don't work)
- Property Type implementation case study
- Complete code examples for new fields
- Implementation checklist (40+ items)
- Common pitfalls and solutions

**Use this for**: Implementing any new field that needs single-select (client form) and multi-select (dashboard)

**Pattern proven by**: Property Types field (production since Oct 2025)

---

## 📂 Documentation Structure

```
/docs/
├── README.md                                    ← YOU ARE HERE (Documentation Index)
│
├── 1-API-FIELD-MAPPING-REFERENCE.md             ← Valcre API Reference (42KB)
├── 2-CLICKUP-INTEGRATION-REFERENCE.md           ← ClickUp Integration Reference
├── 3-DOCUSEAL-LOE-FIELD-MAPPING.md              ← DocuSeal LOE Mapping
├── 4-SINGLE-TO-MULTI-SELECT-PATTERN.md          ← Reusable Form Pattern Guide
│
├── IMPLEMENTATION-STATUS.md                     ← Current bugs & known issues
│
├── PROPERTYTYPE-*.md                            ← Property Type investigation files (Oct 2025)
│
├── -passover-sessions/                          ← Session continuity & context
│   ├── README.md                                ← How passover system works
│   ├── 25.11.13-1 - System-Guide-...md          ← Latest session context
│   └── [historical sessions...]
│
├── Planning/                                    ← Planning documents
│   ├── -MAIN-SYSTEM-GUIDE/                      ← Architecture & systems docs
│   └── [other planning docs...]
│
├── 01-Client-Form-Submission/                   ← Feature-specific documentation
├── 02-Pipedrive-CRM/
├── 03-ClickUp-Integration/
├── 07-Valcre-Integration/
├── 08-Client-Email-Sequence/
├── [other section folders...]
│
└── [loose markdown files - pending organization]
```

---

## 🔧 Implementation Status

**File**: `IMPLEMENTATION-STATUS.md`

**What it contains**:
- Known bugs with exact file locations
- Field mapping issues
- Integration status by feature
- Priority fixes needed

**Cross-referenced with**: All core reference documents note known issues

---

## 🔬 Historical Investigation Files

**Pattern**: `PROPERTYTYPE-*.md`

These files document the Property Type multi-select investigation from October 2025:

1. **PROPERTYTYPE-FIX-APPLIED.md** - Fix implementation for single → comma-separated string
2. **PROPERTYTYPE-MULTISELECT-FINDINGS.md** - Investigation into multi-select requirements
3. **PROPERTYTYPE-PROPERTYCONTACT-FINDINGS.md** - Related PropertyContact investigation

**Status**: Investigation complete, pattern documented in `4-SINGLE-TO-MULTI-SELECT-PATTERN.md`

**Use these for**: Understanding how the single-to-multi pattern was discovered and validated

---

## 📝 Session Management & Continuity

**Folder**: `-passover-sessions/`

**Purpose**: Session-to-session context preservation

**Key Files**:
- `README.md` - Explains passover system
- `25.11.13-1 - System-Guide-Documentation-Consolidation.md` - Latest session context
- Historical session files for complete project history

**Use this for**: Picking up where previous session left off

---

## 🗂️ Section Documentation

Each feature has its own folder with detailed specs, tests, and implementation notes:

| Section | Folder | Status |
|---------|--------|--------|
| Client Form Submission | `01-Client-Form-Submission/` | ✅ Working |
| Pipedrive CRM | `02-Pipedrive-CRM/` | 📋 Not Started |
| ClickUp Integration | `03-ClickUp-Integration/` | ✅ Auto-Creation LIVE |
| APR Dashboard | `04-APR-Dashboard/` | ✅ Working |
| Document Management | `05-DOC-MANAGEMENT/` | 🔄 In Progress |
| LOE Generator | `06-LOE-Generator/` | 🔄 In Progress |
| Valcre Integration | `07-Valcre-Integration/` | ⚠️ Working (needs UX fixes) |
| Client Email Sequence | `08-Client-Email-Sequence/` | 📋 Planned |
| Comp Calculator | `11-Comp Calculator/` | 📋 Planned |

---

## 🎨 Planning & Architecture

**Folder**: `Planning/`

**Contains**:
- System architecture documentation
- Feature planning documents
- Design decisions & rationale
- Version history

**Key Subfolder**: `-MAIN-SYSTEM-GUIDE/` - Comprehensive architecture docs

---

## 📚 How to Use This Documentation

### For Developers

1. **Starting work on a feature?**
   → Read the relevant core reference (1, 2, 3, or 4)
   → Check section folder for detailed specs

2. **Need to understand data flow?**
   → `1-API-FIELD-MAPPING-REFERENCE.md` shows complete flow from form → database → Valcre

3. **Working on integrations?**
   → Core references (1, 2, 3) have exact code line numbers
   → Cross-reference with Implementation Status for known issues

4. **Adding a new form field?**
   → `4-SINGLE-TO-MULTI-SELECT-PATTERN.md` for fields that need single + multi select
   → Includes complete implementation checklist

5. **Bug fixing?**
   → Check `IMPLEMENTATION-STATUS.md` first
   → Core references document known issues and workarounds

### For Project Managers

1. **Feature status?**
   → See section documentation folders (01-13)
   → Check Implementation Status for blockers

2. **Integration health?**
   → All three core references document what's working vs. what's broken

3. **What's next?**
   → Check latest passover session for current priorities

---

## 🔍 Finding What You Need

### Quick Reference

| I need to... | Go to... |
|--------------|----------|
| Understand Valcre API | `1-API-FIELD-MAPPING-REFERENCE.md` |
| Debug ClickUp task creation | `2-CLICKUP-INTEGRATION-REFERENCE.md` |
| Fix LOE field mapping | `3-DOCUSEAL-LOE-FIELD-MAPPING.md` |
| Implement multi-select field | `4-SINGLE-TO-MULTI-SELECT-PATTERN.md` |
| See current bugs | `IMPLEMENTATION-STATUS.md` |
| Continue previous work | `-passover-sessions/[latest].md` |
| Understand architecture | `Planning/-MAIN-SYSTEM-GUIDE/` |
| Review feature specs | Section folders (01-13) |

### Search Tips

All markdown files are searchable:

```bash
# Find all references to a field name
grep -r "propertyType" docs/

# Find specific integration details
grep -r "ClickUp" docs/*.md

# Search within core references only
grep -r "currency" docs/[1-3]*.md
```

---

## 📌 Important Notes

### Folder Rename (Nov 2025)

**Previous name**: `.docs/` (hidden folder with leading dot)
**Current name**: `docs/` (visible folder, no leading dot)

**Reason**: Visibility in project explorer programs

**Impact**: All documentation paths updated accordingly

### Documentation Maintenance

**Core References (1, 2, 3)**: Updated when production code changes
**Implementation Status**: Updated as bugs are fixed/discovered
**Section Folders**: Updated during feature development
**Passover Sessions**: Created at end of each work session

### Reverse-Engineering Approach

All three core reference documents were created by analyzing production code directly:

✅ **Single source of truth** (production code)
✅ **100% accurate** (no speculation)
✅ **Line number references** (complete traceability)
✅ **Recently updated code included** (latest fixes documented)

---

## 🚀 Next Steps

**If you're starting a new session**:

1. Read latest passover session: `-passover-sessions/[latest].md`
2. Check Implementation Status for current blockers
3. Review relevant core reference (1, 2, or 3)
4. Check section folder for feature-specific details
5. Start working!

**If you're adding new documentation**:

1. Follow existing patterns (see core references for format)
2. Include code line references
3. Document known issues
4. Update Implementation Status if bugs found
5. Create passover session at end of work

---

## 📞 Quick Links

**Project Root**: `/Users/bencrowe/Development/APR-Dashboard-v3/`
**Documentation**: `/Users/bencrowe/Development/APR-Dashboard-v3/docs/` (this folder)
**Production Code**: `../src/`, `../api/`, `../supabase/`

**Deployments**:
- APR Dashboard: `https://apr-dashboard-v3.vercel.app`
- Valta Website: `https://valta.ca`

---

## 📖 Documentation Philosophy

**Goal**: Every agent should have complete context in under 5 minutes

**Principles**:
- Comprehensive but organized
- Single source of truth for each topic
- Code references for traceability
- Known issues documented honestly
- Easy navigation via this index

**Result**: Fast onboarding, accurate information, efficient work

---

**Remember**: This README is your map to all documentation. Use the core references (1, 2, 3) for technical details, and section folders for feature-specific work.

**Questions?** Check the passover sessions for context, or start with Implementation Status to see what's currently broken vs. working.

---

**Last Maintained**: 2025-11-13
**Documentation Owner**: Ben Crowe & Development Team
**Status**: ✅ Active, Comprehensive, Production-Accurate
