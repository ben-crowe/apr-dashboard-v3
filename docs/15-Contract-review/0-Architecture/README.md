# 0-Architecture - OUTDATED

**Status:** NOT CURRENT - Do not reference until fully updated

---

## Warning

These architecture documents were created in **November-December 2025** during initial APR-V4 design. They contain:

- Outdated field counts (330 fields vs current 1,687)
- Missing Three Valuation Approaches context
- Superseded implementation phases

---

## Current Source of Truth

For up-to-date information, reference:

### 1. APR Domain Core Management
```
/docs/15-Contract-review/0-APR-Domain-Core-Mgt/
```
Contains:
- `APR-DOMAIN-KNOWLEDGE-25.12.26.md` - Current field counts, calc engine status, valuation approaches
- Valcre workbook analysis files
- Field naming conventions and mappings

### 2. Slash Commands
- `/check-apr-domain-knowledge` - Load current domain knowledge
- `/check-registry-agent` - Activate registry/workbook expertise

---

## Files in This Folder (Historical)

| File | Date | Notes |
|------|------|-------|
| `APR-V4-ARCHITECTURE.md` | Dec 11 | Core concepts valid, field counts wrong |
| `APR-V4-IMPLEMENTATION-GUIDE.md` | Dec 1 | Outdated workflow references |
| `ARCHITECTURE-DIAGRAM.md` | Dec 4 | Component tree for MockReportBuilder |
| `IMPLEMENTATION-ROADMAP.md` | Dec 10 | Superseded by Calculator Demo phases |
| `IMPLEMENTATION-STATUS.md` | Nov 19 | V3 bug tracking - not relevant to V4 |
| `MOCK-REPORT-BUILDER-IMPLEMENTATION.md` | Dec 4 | Still accurate for `/mock-builder` route |

---

## To Update This Folder

An agent would need to:
1. Read current domain knowledge file
2. Update all field counts (1,687 total, 86 calc engine outputs)
3. Add Three Valuation Approaches section
4. Update implementation phases to match Calculator Demo plan
5. Remove this warning README

---

*Last Updated: December 26, 2025*
