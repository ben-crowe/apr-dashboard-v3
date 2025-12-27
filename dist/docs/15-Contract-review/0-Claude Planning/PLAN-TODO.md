# Planning Session TODO

**Created:** 2025-12-25
**Status:** Active - Planning Phase

---

## 🚨 Critical Notes

### Domain Knowledge File Relocation
- **File moved to:** `/0-Claude Planning/APR-DASHBOARD-DOMAIN-KNOWLEDGE-UPDATE-Dec-23-2025.md`
- **Previous location:** `/docs/15-Contract-review/` (root)
- **Action needed:** Check if any `/command` references this file path - may need updating
- **Status:** ⏸️ HOLD - Do NOT update domain knowledge file until planning is organized
- **Single source of truth:** This is the one file we keep updated going forward

---

## 📋 Session Organization Tasks

### Phase 1: Audit & Assessment
- [ ] Check for any slash commands (/read-domain-knowledge, /domain, etc.) that reference old path
- [ ] List all files in planning folder and categorize by status
- [ ] Identify which documentation is PRODUCTION vs REFERENCE
- [ ] Note any file duplication or redundancy

### Phase 2: Planning Organization
- [ ] Create master index of what exists in planning folder
- [ ] Identify critical next-step items from all documents
- [ ] Prioritize work based on dependencies
- [ ] Create clean decision matrix (v2.2.0 vs v2.3.0 adoption)

### Phase 3: Setup (When Organized)
- [ ] Consolidate domain knowledge file with new findings
- [ ] Update any slash commands if needed
- [ ] Create session tracking format for future handoffs
- [ ] Lock down file locations and naming conventions

---

## 🔗 Key File Locations

| File | Location | Purpose | Status |
|------|----------|---------|--------|
| Domain Knowledge | `/0-Claude Planning/APR-DASHBOARD-DOMAIN-KNOWLEDGE-UPDATE-Dec-23-2025.md` | Single source of truth | 🔒 FROZEN until organized |
| Passover Session | `/0-Claude Planning/-passover-session/25.12.24-1 - TDD-Dashboard-Architecture-Understanding.md` | Last session summary | ✅ Complete |
| Sync Status | `/0-Claude Planning/EXTRACTION-STATUS-HANDOFF.md` | Current readiness | ✅ v2.2.0 ready |
| Export Index | `/0-Claude Planning/APR-DASHBOARD-EXPORT-INDEX.md` | File catalog | ✅ Reference |

---

## ⚠️ Known Issues to Address

1. **Path Change Impact** - Verify no broken references
2. **File Consolidation** - May have duplicate documentation between files
3. **Versioning** - v2.2.0 vs v2.3.0 decision pending
4. **Field Migration** - If adopting v2.3.0, plan migration strategy

---

## 🎯 Next Decision Point

**After organization:**
- Do we adopt v2.3.0 field consolidation (remove prefixes)?
- If yes: Plan field registry migration
- If no: Document reason and continue with v2.2.0

---

**Last Updated:** 2025-12-25
**Owner:** Marcel Superagent / Claude Code
**Next Review:** After Phase 1 complete

