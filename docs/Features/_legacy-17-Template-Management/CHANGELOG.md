# Template Change Log

**File**: `public/Report-MF-template.html`
**Maintained by**: Composer + Sonnet + Ben

All changes to the Report-MF-template.html file must be logged here.

---

## [v2.9.0] - 2026-01-07

### Added
- Two-Mode Toggle System (Dev Mode vs User Ready Mode)
- `data-field-id` attribute to all 1,643 field-mapped spans
- `.populated` class support for real data injection
- Dev Mode: Yellow highlight on field-mapped spans
- User Ready Mode: Gray italic on unmapped, data-sample values shown

### Changed
- Pages 52-57: Replaced with corrected structure from v2.6.0
  - Page 52: Comparables Location Map + Summary Table
  - Pages 53-57: Sales Summary Sheets for Comps 1-5
- Updated toggle JavaScript for mode switching

### Fixed
- Field-mapped spans now support both placeholder and real data modes
- Template structure alignment with field registry

**Git Commit**: `cae568f` - feat(template): upgrade Report-MF-template to v2.9.0

---

## [v2.9.1] - 2026-01-09 (Pending)

### Fixed
- Pages 52-57: Restored blue border-bottom on Header1 elements
  - Issue: Local CSS overrides removed `border-bottom: 1px solid #003b7e;`
  - Solution: Added border-bottom and padding-bottom to all 6 pages
  - Status: ✅ Confirmed restored by user

**Issue Tracker**: ISSUE-001-missing-blue-borders-pages-52-57.md (planned)

---

## [v2.8.0] - 2026-01-01

### Changed
- Enhanced preview zoom system
- Zoom now relative to panel size (100% = fits panel perfectly)
- Zoom anchors to page selected in page picker

### Fixed
- Preview panel sizing issues
- Page scroll behavior

**Git Commit**: Multiple commits during Jan 1-7, 2026

---

## [v2.7.0] - 2025-12-30

### Changed
- Restructured Page 48 (Income Statement)
- Operating Expenses table columns realigned to match PGR table
- Standardized column count to 6 columns

### Removed
- Blue/red color styling from calculated fields
- CONT V MKT column color highlights

**Git Commits**:
- `78c0cc6` - feat: Create v2.7.0 master template with restructured Page 48
- `39eee7e` - fix: Remove blue/red color styling from CONT V MKT column

---

## [v2.6.0] - 2025-12-26

### Added
- Field registry alignment
- 1,643 fields verified and mapped
- 100% template coverage confirmed

### Changed
- Reorganized example property files
- Updated field naming to kebab-case standard

**Reference**: Field registry completion session (Dec 22, 2025)

---

## [Earlier Versions] - 2025-12-20 and before

### v2.5.x
- Initial template structure
- 75 pages established
- Core sections defined

---

## Pending Changes

**High Priority**:
- [ ] Add data-sample to Page 36 (Income Approach intro)
- [ ] Add data-sample to Page 37 (Rent Survey table)

**Medium Priority**:
- [ ] Expand Page 49 to support 6 unit types (currently 4)
- [ ] Add 4th vacancy/loss type row to Page 49
- [ ] Update expense field IDs to `-annual` suffix

**Low Priority**:
- [ ] Standardize all table header font sizes to 8pt
- [ ] Verify all pages have consistent padding

---

## Change Request Template

When logging a change, use this format:

```markdown
## [vX.X.X] - YYYY-MM-DD

### Added
- New features or content

### Changed
- Modified existing features

### Deprecated
- Features marked for removal

### Removed
- Deleted features or content

### Fixed
- Bug fixes

### Security
- Security-related changes

**Git Commit**: [hash] - [commit message]
**Issue Tracker**: [Issue file if exists]
```

---

## Version Numbering

**Major.Minor.Patch** (Semantic Versioning)

- **Major** (X.0.0): Breaking changes, complete redesign
- **Minor** (2.X.0): New features, page additions, significant changes
- **Patch** (2.9.X): Bug fixes, small CSS tweaks, corrections

**Examples**:
- v2.9.0: Added Two-Mode Toggle System (minor feature)
- v2.9.1: Fixed blue borders (patch)
- v3.0.0: Complete template redesign (major)

---

**Last Updated**: 2026-01-09
