# APR Dashboard - Features Overview

**Project**: APR Dashboard System
**Date**: 2026-01-12
**Architecture**: Vertical Slice (Business Capability Focus)

---

## System Phases

| Phase | Description | Status |
|-------|-------------|--------|
| **V3.x** | Standalone intake system (Supabase, Valcre, ClickUp, LOE, CRM) | Active |
| **Report Builder** | Standalone report generation (79 pages, 330+ fields) | Active |
| **Phase 2 (V4)** | V3 + Report Builder integrated as unified system | Planned |
| **Phase 3** | Internal CRM + Project Management (replace Pipedrive/ClickUp) | Future |

---

## Quick Navigation

| Epic | Features | Status |
|------|----------|--------|
| [Epic 1: Foundation](#epic-1-foundation--infrastructure) | F01-F02 | Not Started |
| [Epic 2: Data Entry](#epic-2-data-entry--field-management) | F03-F05 | Not Started |
| [Epic 3: Calculations](#epic-3-calculation-engine) | F06-F10 | Not Started |
| [Epic 4: Preview & Export](#epic-4-preview--export) | F11-F13 | Not Started |
| [Epic 5: Client Delivery](#epic-5-client-delivery) | F14-F16 | Not Started |
| [Epic 6: Integration](#epic-6-integration--workflow) | F17-F20 | Partial (F20 Production) |
| [Epic 7: Testing & Deploy](#epic-7-testing--deployment) | F21-F23 | Not Started |
| [Epic 8: Extended](#epic-8-extended-features) | F24-F26 | Partial (V3 Existing) |

**Total**: 26 features across 8 epics

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
4. **Clear ownership** - complete scope per feature
5. **Reduced side effects** - changes localized to one slice

---

## EPIC 1: Foundation & Infrastructure
**Strategic Goal**: Establish technical foundation

| ID | Feature | Priority | Status |
|----|---------|----------|--------|
| F01 | Foundation-Infrastructure | P0 | Not Started |
| F02 | Database-Schema | P0 | Not Started |

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

| ID | Feature | Priority | Status |
|----|---------|----------|--------|
| F03 | Core-Sections | P0 | Not Started |
| F04 | Narrative-Sections | P1 | Not Started |
| F05 | Media-Management | P1 | Not Started |

**Deliverables**:
- 72 fields (Cover, Transmittal, Executive, Property ID, Certification)
- 91 fields (Scope, Location, Site, Taxes, Zoning, Market, HBU, Improvements)
- 55+ fields (Photographs, Maps)
- Auto-save with 3-second debounce
- Rich text editors for narratives
- Multi-image upload with compression

---

## EPIC 3: Calculation Engine
**Strategic Goal**: Dual calculator system with Excel import

| ID | Feature | Priority | Status |
|----|---------|----------|--------|
| F06 | Income-Calculator | P0 | Not Started |
| F07 | Sales-Comparison | P0 | Not Started |
| F08 | Cost-Approach | P1 | Not Started |
| F09 | Reconciliation | P0 | Not Started |
| F10 | Excel-Import | P0 | Not Started |

**Deliverables**:
- Income Approach: 24 inputs -> 85 outputs
- Sales Comparison: 50+ fields with comparable grid
- Cost Approach: Land + building + depreciation
- Reconciliation: Final value from 3 approaches
- Excel import with side-by-side comparison
- Match percentage calculation (<1% variance target)

---

## EPIC 4: Preview & Export
**Strategic Goal**: Live HTML preview and export functionality

| ID | Feature | Priority | Status |
|----|---------|----------|--------|
| F11 | Live-Preview | P0 | Not Started |
| F12 | Template-System | P0 | Not Started |
| F13 | Export-Engine | P1 | Not Started |

**Deliverables**:
- Split-screen layout (builder | preview)
- Real-time rendering with debounce
- 79-page HTML template with Handlebars
- Valta branding CSS
- Export: HTML (standalone), PDF (Puppeteer), Excel, JSON

---

## EPIC 5: Client Delivery
**Strategic Goal**: Shareable links replacing 23MB email attachments

| ID | Feature | Priority | Status |
|----|---------|----------|--------|
| F14 | Share-Links | P0 | Not Started |
| F15 | Client-Portal | P0 | Not Started |
| F16 | Email-Delivery | P1 | Not Started |

**Deliverables**:
- Secure token generation (32-byte tokens)
- Expiry configuration (7/14/30/90 days, never)
- Password protection (optional)
- QR code generation
- Public read-only report view
- View tracking and analytics
- Email templates with SendGrid/Resend

**Business Value**: Solves Gmail 23MB attachment failures (currently 60% success -> 100%)

---

## EPIC 6: Integration & Workflow
**Strategic Goal**: Connect systems together

| ID | Feature | Priority | Status |
|----|---------|----------|--------|
| F17 | Valcre-Integration | P0 | Not Started |
| F18 | ClickUp-Stage-2 | P1 | Not Started |
| F19 | Dashboard-UX | P1 | Not Started |
| **F20** | **LOE-Generator** | **P0** | **Production (V3)** |

**F20 LOE Generator** - Fully implemented in V3:
- DocuSeal integration (22-field mapping)
- Resend email API
- Signature webhook tracking
- Status flow: pending_loe -> loe_sent -> loe_signed

---

## EPIC 7: Testing & Deployment
**Strategic Goal**: Production-ready with confidence

| ID | Feature | Priority | Status |
|----|---------|----------|--------|
| F21 | Testing | P0 | Not Started |
| F22 | Performance | P1 | Not Started |
| F23 | Deployment | P0 | Not Started |

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

## EPIC 8: Extended Features
**V3 Existing + Future Enhancements**

| ID | Feature | Priority | Status |
|----|---------|----------|--------|
| **F24** | **Document-Management** | **P2** | **Partial (V3)** |
| **F25** | **Document-Extraction** | **P3** | **Not Started** |
| **F26** | **Houski-Integration** | **P3** | **Partial (V3)** |

### F24: Document Management (Doc Hub)
- File upload to Supabase Storage
- Document linking architecture designed
- Smart links concept (planned)

### F26: Houski Integration
- API key configured
- Property details endpoint documented
- Field mapping table created
- "Gather Data" button placeholder exists

---

## Feature Dependencies (Critical Path)

```
F01 (Foundation) -> F02 (Database)
    |
F03, F04, F05 (Data Entry) <- Can start in parallel
    |
F06, F07, F08, F09 (Calculators) <- Depends on F03
    |
F10 (Excel Import) <- Depends on F06-F09
    |
F11 (Preview) <- Depends on F03-F10
    |
F12 (Templates) <- Depends on F11
    |
F13 (Export) <- Depends on F12
    |
F14, F15, F16 (Client Delivery) <- Depends on F13
    |
F17, F18, F19 (Integration) <- Can start after F03
    |
F21, F22, F23 (Testing & Deploy) <- Depends on all above
```

---

## MVP Milestones

### MVP 1 - Data Entry + LOE
- F01-F02: Foundation + Database
- F03-F05: Data Entry (Core + Narrative + Media)
- **F20: LOE Generator (V3 existing)**
- F17: Valcre Integration
- No calculations (Excel fallback)
- No preview

**Business Value**: Can intake jobs, create Valcre entries, send LOE

### MVP 2 - Calculator Validation
- MVP 1 +
- F06-F10: All calculators + Excel import
- Trust-building with side-by-side comparison
- No client delivery yet

**Business Value**: Can validate calculator accuracy vs Excel

### MVP 3 - Full System
- MVP 2 +
- F11-F13: Preview + Templates + Export
- F14-F16: Share Links + Client Portal + Email
- **F24: Document Management (enhanced)**

**Business Value**: Complete appraisal workflow, client delivery

### Production
- MVP 3 +
- F18-F19: ClickUp Stage 2 + Dashboard UX polish
- F21-F23: Full test coverage + Performance + Deployment
- **F26: Houski Integration (if ready)**

---

## What Exists in V3 (Don't Rebuild!)

1. **LOE Generator** - Complete system (DocuSeal + Resend)
2. **File Upload** - Supabase Storage integration
3. **Valcre API** - Field mapping documented
4. **ClickUp Stage 1** - Auto-creation working
5. **Houski API** - Credentials and endpoints ready

## What Phase 2 (V4) Adds

1. **Unified 944+ field data entry**
2. **Dual calculator (internal vs Excel)**
3. **Live HTML preview**
4. **Client share links** (solving 23MB Gmail problem)
5. **79-page template system**

---

## Success Metrics

### Technical Success
- All 944+ fields functional with validation
- Calculator matches Excel within 1%
- Live preview renders all sections accurately
- Share links deliver with 100% success rate
- Auto-save works without data loss
- Export to PDF matches Word quality
- Mobile responsive on all devices
- Lighthouse score >90

### User Success
- Calculator confidence reaches 95%+ match rate
- Error rate reduced by 80%+ (formatting, calculations)
- Client feedback positive on HTML reports
- Team adoption 90%+ of reports use system

### Business Success
- Gmail delivery issues eliminated (0 bounced reports)
- Client experience improved (mobile access, faster loading)
- Professional appearance maintained (branding, layout)
- CUSPAP compliance verified

---

**Created**: 2026-01-10
**Last Updated**: 2026-01-12
**Status**: Active Roadmap
