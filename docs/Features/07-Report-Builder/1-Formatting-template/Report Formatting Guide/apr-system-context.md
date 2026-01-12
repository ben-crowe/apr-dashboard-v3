# APR System Context - Quick Reference

**Purpose:** Fast context load for APR Dashboard v3 system architecture
**Last Updated:** 2026-01-07

---

## Search Keywords

`4-stage-system`, `report-builder`, `field-registry`, `4-file-sync`, `template-architecture`, `stage-4`, `mock-builder`, `image-configurator`, `persistence`, `job-integration`, `dev-mode`, `user-ready-mode`

---

## The 4-Stage Appraisal Workflow

```
STAGE 1: CLIENT INTAKE      → job_submissions table
    ↓
STAGE 2: JOB MANAGEMENT     → job_loe_details, job_property_info
    ↓
STAGE 3: E-SIGNATURE        → DocuSeal integration
    ↓
STAGE 4: REPORT BUILDER     → 944+ fields, HTML template, PDF output
```

| Stage | Status | Notes |
|-------|--------|-------|
| 1. Client Intake | Working | `/` route |
| 2. Job Management | Working | `/dashboard/job/:jobId` |
| 3. E-Signature | Working | DocuSeal |
| 4. Report Builder | **Disconnected** | No persistence, no job bridge |

---

## Current State (as of Jan 2026)

**Active Phase:** Pre-Phase 0 (foundation work)

**What Works:**
- Stages 1-3 complete
- Image configurator standalone at `/image-test`
- Template has two-mode toggle system (Dev Mode / User Ready)
- Field registry has 1,687 fields defined

**What's Missing:**
- Report Builder not connected to job data
- No auto-save / persistence (data lost on close)
- No `/dashboard/job/:jobId/report` route
- Home section hidden from sidebar

---

## Phase Roadmap

```
[ ] Phase 0: Database setup (report_builder_data table)
[ ] Phase 1: Expose Home section in sidebar
[ ] Phase 2: Add ~35 Home section fields (mapped from Supabase)
[ ] Phase 3: Integration bridge route (/dashboard/job/:jobId/report)
[ ] Phase 4: Auto-save + persistence (2s debounce)
[ ] Phase 5: Dynamic lists for conditions
[ ] Phase 6: Locked fields + "Edit in Home" pattern
[ ] Phase 7: Page-to-editor sync (scroll tracking)
```

---

## 4-File Sync Architecture (CRITICAL)

These files MUST have matching field IDs:

| File | Purpose | Location |
|------|---------|----------|
| **fieldRegistry.ts** | 1,687 field definitions (SOURCE OF TRUTH) | `src/features/report-builder/schema/` |
| **TestDataSet1.ts** | Test values for all fields | `src/features/report-builder/data/` |
| **Report-MF-template.html** | HTML with `{{field-id}}` placeholders | `public/` |
| **EditPanel.tsx** | Editor UI layout arrays | `src/features/report-builder/components/EditPanel/` |

**Rule:** Field ID `client-first-name` must be identical across ALL 4 files.

---

## Template Two-Mode System

| Mode | Toggle | Display | Use For |
|------|--------|---------|---------|
| **Dev Mode** | OFF | `{{field-id}}` yellow | Development + Registry data testing |
| **User Ready** | ON | Sample data gray | Layout planning + Client preview |
| **Populated** | N/A | Real data normal | Live/deployed state |

See: `./field-toggle-system.md` for implementation details

---

## Key URLs

| URL | Purpose |
|-----|---------|
| `/mock-builder` | Report Builder (main editing interface) |
| `/test-input` | Test Data Dashboard (TDD) |
| `/image-test` | Standalone image configurator |
| `/dashboard/job/:jobId` | Job management (Stages 1-3) |

---

## Key Files

| File | Purpose |
|------|---------|
| `public/Report-MF-template.html` | HTML template with placeholders |
| `src/features/report-builder/schema/fieldRegistry.ts` | Field definitions |
| `src/features/report-builder/store/reportBuilderStore.ts` | Zustand store (6,340 lines) |
| `src/features/report-builder/data/TestDataSet1.ts` | Test data values |
| `docs/APR-Domain Mgr/DOMAIN-CONTEXT.md` | Mission & phases |
| `docs/APR-Domain Mgr/TDD-PAGE-ARCHITECTURE.md` | Deep technical docs |

---

## Key Decisions

1. **Standalone-first development** - Build features in isolation (like image configurator at `/image-test`), then wire into Report Builder

2. **Home section for job data** - All data from Stages 1-3 lands in "Home" section. Other sections reference Home fields.

3. **JSONB storage** - Store entire report state as JSONB in `report_builder_data` table

---

## Template Specs

| Spec | Value |
|------|-------|
| Page dimensions | 816px × 1056px |
| Paper size | US Letter at 96 DPI |
| Padding | 54px |
| Total pages | 71 unique pages |
| Field placeholders | ~1,429 |
| Version | 2.8.0+ (check template header) |

---

## Related Files in This Folder

| File | Purpose |
|------|---------|
| `README.md` | Index of all guides |
| `compact-styling-guide.md` | Fix page overflow issues |
| `field-toggle-system.md` | Dev Mode / User Ready toggle |
| `apr-system-context.md` | THIS FILE - system overview |

---

## Deep Dive Resources

For more detail, read:
- `docs/APR-Domain Mgr/DOMAIN-CONTEXT.md` - Mission, phases, decisions
- `docs/APR-Domain Mgr/TDD-PAGE-ARCHITECTURE.md` - 883 lines of technical architecture
- `docs/APR-Domain Mgr/FULL-ECOSYSTEM-INTEGRATION.md` - Complete system architecture
