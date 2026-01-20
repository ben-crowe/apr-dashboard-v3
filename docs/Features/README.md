# APR Dashboard - Features Directory

**Project**: APR Dashboard System
**Organization**: Phase-Based Feature Folders
**Last Updated**: 2026-01-12

---

## Quick Start

1. **Read First**: [00-FEATURES-OVERVIEW.md](00-FEATURES-OVERVIEW.md) - Complete roadmap and feature breakdown
2. **Architecture**: [../Architecture/APR-V4-ARCHITECTURE.md](../Architecture/APR-V4-ARCHITECTURE.md) - Technical vision
3. **Pick a Feature**: Navigate to feature folder (01-13) and read README.md

---

## System Phases

| Phase | Description | Status |
|-------|-------------|--------|
| **V3.x** | Standalone intake system (Supabase, Valcre, ClickUp, LOE, CRM) | Active |
| **Report Builder** | Standalone report generation (79 pages, 330+ fields) | Active |
| **Phase 2 (V4)** | V3 + Report Builder integrated as unified system | Planned |
| **Phase 3** | Internal CRM + Project Management (replace Pipedrive/ClickUp) | Future |

---

## Feature Directory Structure

```
docs/Features/
|
+-- 00-FEATURES-OVERVIEW.md          # Complete feature roadmap
+-- README.md                        # This file
|
+-- 01-Foundation-Infrastructure/    # Base technical setup
+-- 02-CRM-Email-Integration/        # CRM (Pipedrive now, internal Phase 3)
+-- 03-Database-Document-Hub/        # Supabase, document management
+-- 04-Job & Client Mgt./            # Client intake, job workflow, ClickUp (Phase 3 = internal PM)
+-- 05-APR-Dashboard-v3/             # V3 Intake: Client intake, Valcre prep
+-- 06-User-Interface/               # UX for whole APR system (all phases)
+-- 07-Report-Builder/               # Report Builder (active development)
+-- 08-Field-Input-Output-Mapping/   # Phase 16 field reference (complete)
+-- 09-Template-Management/          # Template work (active development)
+-- 10-Standalone-Report-Builder/    # Standalone calc pages (paused)
+-- 11-Image-Configurator/           # Image configuration system
+-- 12-LOE-Esign/                    # Letter of Engagement + DocuSeal signing
+-- 13-Data-Extraction/              # Data gathering (Houski, document parsing)
```

---

## Folder Descriptions

### Core Foundation
| # | Folder | Description | Status |
|---|--------|-------------|--------|
| 01 | Foundation-Infrastructure | Next.js, Vite, Zustand, base setup | Reference |
| 02 | CRM-Email-Integration | Pipedrive CRM, email management | Active V3 |
| 03 | Database-Document-Hub | Supabase database, document storage | Active V3 |
| 04 | Job & Client Mgt. | Client intake, job workflow, task automation | Active V3 |

### V3 Intake System
| # | Folder | Description | Status |
|---|--------|-------------|--------|
| 05 | APR-Dashboard-v3 | Client intake, Valcre job prep, LOE flow | Active V3 |

### User Experience (All Phases)
| # | Folder | Description | Status |
|---|--------|-------------|--------|
| 06 | User-Interface | UX documentation for entire APR system | Placeholder |

### Report Builder
| # | Folder | Description | Status |
|---|--------|-------------|--------|
| 07 | Report-Builder | 79-page report generation system | Active |
| 08 | Field-Input-Output-Mapping | 218 calculator fields documented | Complete |
| 09 | Template-Management | Template v3.0, design standards | Active |
| 10 | Standalone-Report-Builder | Standalone finance pages (5-6 pages) | Paused |

### Supporting Features
| # | Folder | Description | Status |
|---|--------|-------------|--------|
| 11 | Image-Configurator | Image upload, gallery, map configuration | Active |
| 12 | LOE-Esign | Letter of Engagement with DocuSeal | Production |
| 13 | Data-Extraction | Houski API, document parsing | Partial |

---

## Active Development Folders

Currently active work:
- **07-Report-Builder** - Core report generation
- **09-Template-Management** - Template v3.0 + field mapping

Recently completed:
- **08-Field-Input-Output-Mapping** - Phase 16 complete (218 fields verified)

Production ready:
- **12-LOE-Esign** - DocuSeal + Resend fully implemented

---

## How to Use This Directory

### For Report Builder Work
1. Start with `07-Report-Builder/` for overall builder documentation
2. Reference `09-Template-Management/` for template changes
3. Use `08-Field-Input-Output-Mapping/` for field verification

### For V3 Intake Work
1. Start with `05-APR-Dashboard-v3/`
2. Reference `04-Job & Client Mgt./` for client intake and task automation
3. Reference `12-LOE-Esign/` for LOE/signing flow

### For UX/UI Planning
1. Start with `06-User-Interface/` (placeholder - to be expanded)
2. Covers all phases: V3 intake, Report Builder, future integrations

---

## Key Files Reference

### Report Builder
| File | Location |
|------|----------|
| Template HTML | `public/Report-MF-template.html` |
| Field Registry | `src/features/report-builder/schema/fieldRegistry.ts` |
| Store | `src/features/report-builder/store/reportBuilderStore.ts` |
| Calculator | `src/features/report-builder/store/costApproachCalculations.ts` |

### Template Documentation
| File | Location |
|------|----------|
| Design Standards | `09-Template-Management/01-DESIGN-STANDARDS.md` |
| Field Registry Guide | `09-Template-Management/08-FIELD-REGISTRY-GUIDE.md` |
| Changelog | `09-Template-Management/CHANGELOG.md` |

---

## Related Documentation

### Architecture
- [../Architecture/APR-V4-ARCHITECTURE.md](../Architecture/APR-V4-ARCHITECTURE.md) - Technical vision
- [../Architecture/APR-V4-IMPLEMENTATION-GUIDE.md](../Architecture/APR-V4-IMPLEMENTATION-GUIDE.md) - Implementation guide

### Session Checkpoints
- `~/.claude/checkpoints/` - Session history and next steps

---

**Created**: 2026-01-10
**Reorganized**: 2026-01-12
**Maintained By**: Claude Opus 4.5 + Ben
