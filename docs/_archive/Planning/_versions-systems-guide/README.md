# APR Systems Guide - Version Control

**Purpose:** Track all versions of the Systems Guide with clear version history and backup system.

---

## Version Naming Convention

**Format:** `APR-Systems-Guide-v[MAJOR].[MINOR].md`

**Examples:**
- `APR-Systems-Guide-v3.0.md` - Initial consolidated version
- `APR-Systems-Guide-v3.1.md` - After corrections batch
- `APR-Systems-Guide-v3.2.md` - After teammate feedback
- `APR-Systems-Guide-v4.0.md` - Major restructure

**Semantic Versioning:**
- **Major (X.0):** Significant restructure, major additions
- **Minor (X.Y):** Corrections, additions, refinements

---

## File Location Strategy

**Current/Active Version:**
- Lives in: `/.APR-System-Roadmap/`
- Filename: `APR-Systems-Guide-v[LATEST].md`

**Archive Versions:**
- Live in: `/.APR-System-Roadmap/_versions-systems-guide/`
- Never delete - always archive

---

## Version Control Workflow

### When Creating New Version:

1. **Archive current version:**
   ```
   Copy: APR-Systems-Guide-v3.0.md
   To: _versions-systems-guide/APR-Systems-Guide-v3.0.md
   ```

2. **Create new version:**
   ```
   Rename: APR-Systems-Guide-v3.0.md → APR-Systems-Guide-v3.1.md
   ```

3. **Update version metadata inside document:**
   - Line 3: `**Version:** 3.1`
   - Line 4: `**Last Updated:** 25-11-[XX]`
   - Version History table: Add row for v3.1

4. **Make changes to new version**

5. **Update this README** (add to version list below)

---

## Version History

| Version | Date | Size | Changes | Notes |
|---------|------|------|---------|-------|
| 3.0 | 25-11-01 | 82.24 KB | Initial consolidated version | Sent to teammate |
| 3.1 | 25-11-02 | 90 KB | 13 corrections applied | Added GHL/Pipedrive integrations, rewrote ClickUp section (auto-creation), flowchart fixes, Houski warning, email fix (admin@valta.ca), testing language cleanup, Appendix A additions |

**[Add new versions above]**

---

## Date Format

**Always use:** YY-MM-DD (ISO 8601)
- Example: 25-11-01 = November 1, 2025

---

## Quick Reference

**Current version:**
```
/.APR-System-Roadmap/APR-Systems-Guide-v3.1.md
```

**All previous versions:**
```
/.APR-System-Roadmap/_versions-systems-guide/
```

---

## Notes

- Never overwrite without archiving
- Update version number inside document
- Update this README with each version
- One current version only in main folder

---

**Maintained by:** Project team
**Last Updated:** 25-11-02
