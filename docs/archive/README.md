# Documentation Archive

**Purpose**: Storage for superseded documentation files

**Last Updated**: 2025-11-13

---

## Archived Files

### `api-reference.md` (Oct 10, 2025)
**Original Purpose**: Basic API integration reference
**Archived Date**: Nov 13, 2025
**Reason**: Superseded by comprehensive documentation

**What it contained**:
- Basic Valcre API endpoints
- Simple field conventions
- Supabase table overview
- ClickUp basics
- Environment variables

**Superseded by**:
- `1-API-FIELD-MAPPING-REFERENCE.md` (comprehensive Valcre API reference)
- `2-CLICKUP-INTEGRATION-REFERENCE.md` (complete ClickUp integration)

---

### `field-mapping.md` (Nov 6, 2025)
**Original Purpose**: Simplified field mapping tables
**Archived Date**: Nov 13, 2025
**Reason**: Valuable tables extracted and integrated into comprehensive documentation

**What it contained**:
- Critical Payment Fields table
- Property Fields table
- Enum Fields table
- Basic field mappings

**Superseded by**:
- `1-API-FIELD-MAPPING-REFERENCE.md` (now includes Quick Reference Cheat Sheet with enhanced tables)

**Why archived**: All valuable quick-reference tables were extracted and enhanced, then integrated as Section 1 (Quick Reference Cheat Sheet) of the comprehensive API documentation.

---

## Why These Files Were Archived

1. **Fragmentation**: Multiple small docs were harder to maintain and search
2. **Accuracy**: Comprehensive docs reverse-engineered from production code
3. **Completeness**: New docs include line numbers, code examples, and known issues
4. **Quick Reference**: Old tables extracted and enhanced in comprehensive doc

---

## Current Documentation Structure

Active documentation now consists of:

1. **Core References** (single source of truth):
   - `1-API-FIELD-MAPPING-REFERENCE.md` - Valcre API (with Quick Reference Cheat Sheet)
   - `2-CLICKUP-INTEGRATION-REFERENCE.md` - ClickUp Integration
   - `3-DOCUSEAL-LOE-FIELD-MAPPING.md` - DocuSeal LOE Integration
   - `4-SINGLE-TO-MULTI-SELECT-PATTERN.md` - Reusable Form Pattern

2. **Supporting Documentation**:
   - `IMPLEMENTATION-STATUS.md` - Current bugs and issues
   - `README.md` - Documentation index
   - Section folders (01-13) - Feature-specific docs
   - `-passover-sessions/` - Session continuity

---

## Accessing Archived Files

These files are preserved for historical reference and can be accessed if needed.

**To restore a file**:
```bash
cp /docs/_archive/[filename] /docs/[filename]
```

**Recommendation**: Use comprehensive documentation instead - it includes all valuable content from these files plus much more.

---

**Archive Maintained**: Nov 13, 2025
**Documentation Owner**: Ben Crowe & Development Team
