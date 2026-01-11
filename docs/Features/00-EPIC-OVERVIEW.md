# APR Dashboard V4 - Epic Overview

**Project**: APR Dashboard V3 → V4 Migration
**Date**: 2026-01-10
**Architecture**: Vertical Slice (Business Capability Focus)

---

## Quick Navigation

| Epic | Features | Status |
|------|----------|--------|
| [Epic 1: Foundation](#epic-1-foundation--infrastructure) | F01-F02 | 📋 Not Started |
| [Epic 2: Data Entry](#epic-2-data-entry--field-management) | F03-F05 | 📋 Not Started |
| [Epic 3: Calculations](#epic-3-calculation-engine) | F06-F10 | 📋 Not Started |
| [Epic 4: Preview & Export](#epic-4-preview--export) | F11-F13 | 📋 Not Started |
| [Epic 5: Client Delivery](#epic-5-client-delivery) | F14-F16 | 📋 Not Started |
| [Epic 6: Integration](#epic-6-integration--workflow) | F17-F19 | 📋 Not Started |
| [Epic 7: Testing & Deploy](#epic-7-testing--deployment) | F21-F23 | 📋 Not Started |

**Total**: 23 features across 7 epics

---

## Architecture Principles

### Vertical Slice Organization
Each feature is a **complete vertical slice** containing:
- Database schema (if needed)
- API endpoints (if needed)
- Business logic
- UI components
- Tests

### Why Vertical Slices?
1. **Minimize coupling** between features
2. **Maximize cohesion** within features
3. **Independent deployment** - each feature can ship separately
4. **Clear ownership** - Cursor gets complete scope per feature
5. **Reduced side effects** - changes localized to one slice

### Feature Guidelines
- Each feature is a **complete, independently testable and deployable** unit
- Features grouped by strategic goal (Epic level)
- Dependencies clearly documented

---

## EPIC 1: Foundation & Infrastructure
**Strategic Goal**: Establish technical foundation for V4 build

### Features
| ID | Feature | Priority |
|----|---------|------|----------|
| F01 | [Foundation-Infrastructure](01-Foundation-Infrastructure/) | P0 - Blocking |
| F02 | [Database-Schema](02-Database-Schema/) | P0 - Blocking |

**Deliverables**:
- Next.js 15 + React 19 + TypeScript setup
- Vite build system
- Zustand store architecture
- Supabase database schema (reports, share_links, access_logs)
- RLS policies

**Blocks**: All other features depend on Epic 1

---

## EPIC 2: Data Entry & Field Management
**Strategic Goal**: Unified interface for all 944+ fields

### Features
| ID | Feature | Priority |
|----|---------|----------|----------|
| F03 | [Core-Sections](03-Core-Sections/) | P0 - High Reuse |
| F04 | [Narrative-Sections](04-Narrative-Sections/) | P1 - New Build |
| F05 | [Media-Management](05-Media-Management/) | P1 - Images |

**Deliverables**:
- 72 fields (Cover, Transmittal, Executive, Property ID, Certification)
- 91 fields (Scope, Location, Site, Taxes, Zoning, Market, HBU, Improvements)
- 55+ fields (Photographs, Maps)
- Auto-save with 3-second debounce
- Rich text editors for narratives
- Multi-image upload with compression

**Total Fields**: 218 fields across 14 sections

---

## EPIC 3: Calculation Engine
**Strategic Goal**: Dual calculator system with Excel import

### Features
| ID | Feature | Priority |
|----|---------|----------|----------|
| F06 | [Income-Calculator](06-Income-Calculator/) | P0 - Critical |
| F07 | [Sales-Comparison](07-Sales-Comparison/) | P0 - Critical |
| F08 | [Cost-Approach](08-Cost-Approach/) | P1 - Required |
| F09 | [Reconciliation](09-Reconciliation/) | P0 - Critical |
| F10 | [Excel-Import](10-Excel-Import/) | P0 - Trust Building |

**Deliverables**:
- Income Approach: 24 inputs → 85 outputs
- Sales Comparison: 50+ fields with comparable grid
- Cost Approach: Land + building + depreciation
- Reconciliation: Final value from 3 approaches
- Excel import with side-by-side comparison
- Match percentage calculation (<1% variance target)

**Reference**: [CALC-ENGINE-FIELD-MAP.md](../../Architecture/21-APR-Domain KN Mgr/review & document/CALC-ENGINE-FIELD-MAP.md)

---

## EPIC 4: Preview & Export
**Strategic Goal**: Live HTML preview and export functionality

### Features
| ID | Feature | Priority |
|----|---------|----------|----------|
| F11 | [Live-Preview](11-Live-Preview/) | P0 - Critical UX |
| F12 | [Template-System](12-Template-System/) | P0 - Required |
| F13 | [Export-Engine](13-Export-Engine/) | P1 - Client Delivery |

**Deliverables**:
- Split-screen layout (builder | preview)
- Real-time rendering with debounce
- 79-page HTML template with Handlebars
- Valta branding CSS
- Export: HTML (standalone), PDF (Puppeteer), Excel, JSON

**Reference**: [APR-V4-ARCHITECTURE.md](../../Architecture/APR-V4-ARCHITECTURE.md) Section 6 (lines 491-589)

---

## EPIC 5: Client Delivery
**Strategic Goal**: Shareable links replacing 23MB email attachments

### Features
| ID | Feature | Priority |
|----|---------|----------|----------|
| F14 | [Share-Links](14-Share-Links/) | P0 - Core Value |
| F15 | [Client-Portal](15-Client-Portal/) | P0 - Core Value |
| F16 | [Email-Delivery](16-Email-Delivery/) | P1 - Automation |

**Deliverables**:
- Secure token generation (32-byte tokens)
- Expiry configuration (7/14/30/90 days, never)
- Password protection (optional)
- QR code generation
- Public read-only report view
- View tracking and analytics
- Email templates with SendGrid/Resend

**Business Value**: Solves Gmail 23MB attachment failures (currently 60% success → 100%)

---

## EPIC 6: Integration & Workflow
**Strategic Goal**: Connect V4 with existing V3 systems

### Features
| ID | Feature | Priority |
|----|---------|----------|----------|
| F17 | [Valcre-Integration](17-Valcre-Integration/) | P0 - Required |
| F18 | [ClickUp-Stage-2](18-ClickUp-Stage-2/) | P1 - Workflow |
| F19 | [Dashboard-UX](19-Dashboard-UX/) | P1 - Polish |

**Deliverables**:
- Import job data from Valcre (two-way sync)
- Auto-populate from VAL number
- ClickUp task updates (Stage 2 automation)
- Silent auto-save indicators (remove annoying popups)
- Section completion progress
- Validation summary

**Reference**: Current V3 Valcre/ClickUp integration code

---

## EPIC 7: Testing & Deployment
**Strategic Goal**: Production-ready with confidence

### Features
| ID | Feature | Priority |
|----|---------|----------|----------|
| F21 | [Testing](21-Testing/) | P0 - Quality |
| F22 | [Performance](22-Performance/) | P1 - UX |
| F23 | [Deployment](23-Deployment/) | P0 - Go-Live |

**Deliverables**:
- Unit tests (Vitest) for calculations
- Integration tests for workflows
- E2E tests (Playwright) for critical paths
- Code splitting by section
- Image optimization
- Lighthouse score >90
- Vercel production deployment
- Supabase production migration

---

## Feature Dependencies (Critical Path)

```
F01 (Foundation) → F02 (Database)
    ↓
F03, F04, F05 (Data Entry) ← Can start in parallel
    ↓
F06, F07, F08, F09 (Calculators) ← Depends on F03
    ↓
F10 (Excel Import) ← Depends on F06-F09
    ↓
F11 (Preview) ← Depends on F03-F10
    ↓
F12 (Templates) ← Depends on F11
    ↓
F13 (Export) ← Depends on F12
    ↓
F14, F15, F16 (Client Delivery) ← Depends on F13
    ↓
F17, F18, F19 (Integration) ← Can start after F03
    ↓
F21, F22, F23 (Testing & Deploy) ← Depends on all above
```

---

## Minimum Viable Product (MVP)

**MVP 1 - Data Entry Only** (After Epic 1-2):
- ✅ Foundation + Database
- ✅ Core + Narrative sections
- ✅ Media management
- ❌ No calculations (Excel fallback)
- ❌ No preview

**MVP 2 - Calculator Validation** (After Epic 3):
- ✅ MVP 1 +
- ✅ Income Calculator
- ✅ Excel import & comparison
- ✅ Trust-building with side-by-side view
- ❌ No client delivery

**MVP 3 - Full System** (After Epic 4-5):
- ✅ MVP 2 +
- ✅ Live preview
- ✅ Export engine
- ✅ Client portal with share links
- ✅ Ready for pilot testing

**Production** (After Epic 6-7):
- ✅ MVP 3 +
- ✅ Valcre/ClickUp integration
- ✅ Full test coverage
- ✅ Production deployment

---

## Legacy Feature Migration

**From old numbering** (preserved in `_legacy-*` folders):

| Old | Content | Migrates To | Status |
|-----|---------|-------------|--------|
| 14-User Interface | UI components | F03, F04, F19 | ⏳ Review |
| 15-Contract-review | Report templates | F12 | ⏳ Review |
| 16-Field-Input-Output-Mapping | Calculator maps | F06-F10 | ✅ Referenced |
| 17-Template-Management | Template system | F12 | ⏳ Review |
| 20-Image-Configurator | Image handling | F05 | ⏳ Review |

**Action**: Review legacy folders and extract valuable content into new feature structure.

---

## Related Documentation

### Architecture
- [APR-V4-ARCHITECTURE.md](../Architecture/APR-V4-ARCHITECTURE.md) - Primary architectural vision (1,630 lines)
- [ARCHITECTURE-DIAGRAM.md](../Architecture/ARCHITECTURE-DIAGRAM.md) - Data flow & component tree
- [IMPLEMENTATION-ROADMAP.md](../Architecture/IMPLEMENTATION-ROADMAP.md) - 79-page template breakdown

### Field Mapping
- [CALC-ENGINE-FIELD-MAP.md](../Architecture/21-APR-Domain KN Mgr/review & document/CALC-ENGINE-FIELD-MAP.md)
- [LOCKED-FIELD-IDS.md](../Architecture/21-APR-Domain KN Mgr/architecture-v4/LOCKED-FIELD-IDS.md)

### Current System (V3)
- [IMPLEMENTATION-STATUS.md](../Architecture/21-APR-Domain KN Mgr/architecture-v4/IMPLEMENTATION-STATUS.md) - V3 bugs & fixes

---

## Success Metrics

### Technical Success
- ✅ All 944+ fields functional with validation
- ✅ Calculator matches Excel within 1%
- ✅ Live preview renders all sections accurately
- ✅ Share links deliver with 100% success rate
- ✅ Auto-save works without data loss
- ✅ Export to PDF matches Word quality
- ✅ Mobile responsive on all devices
- ✅ Lighthouse score >90

### User Success
- ✅ Chris approves first 5 pilot reports
- ✅ Calculator confidence reaches 95%+ match rate
- ✅ Time per report reduced from 4 hours → 90 minutes (55% reduction)
- ✅ Error rate reduced by 80%+ (formatting, calculations)
- ✅ Client feedback positive on HTML reports
- ✅ Team adoption 90%+ of reports use V4 within 3 months

### Business Success
- ✅ Gmail delivery issues eliminated (0 bounced reports)
- ✅ Client experience improved (mobile access, faster loading)
- ✅ Professional appearance maintained (branding, layout)
- ✅ CUSPAP compliance verified by Chris
- ✅ ROI positive within 6 months (time savings > development cost)

---

**Created**: 2026-01-10
**Last Updated**: 2026-01-10
**Status**: Active Roadmap
