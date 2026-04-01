# APR Dashboard v3 - Master Plan

**Last Updated:** March 23, 2026

## Overview
Single source of truth for the project's roadmap, to-dos, and next steps. Historical plans are in `Plan-various/`.

## Current Phase: Report Builder Integration

### Immediate Priorities
1. **Create `report_builder_data` table** — migration + schema. Table does not exist yet. This blocks all Report Builder persistence.
2. **Route Integration** — `/dashboard/job/:jobId/report` connecting dashboard jobs to the Report Builder.
3. **Data Bridge** — Pull job_submissions + job_loe_details into Report Builder "Home" section automatically.
4. **Auto-save** — 2-second debounce writing to `report_builder_data` table.

### Technical Debt
- Console.log cleanup in ClickUpAction.tsx (debug logging still present)
- Field registry backup files (fieldRegistry.ts.backup, fieldRegistry.ts.bak) — remove or archive
- reportBuilderStore.ts.bak-before-assignment — remove

### UI/UX Polish — Pending
- Select trigger text indent on long values (e.g. "First Mortgage Financing" pushes right) — needs deeper SelectTrigger component fix
- Client Comments textarea not editable — investigate
- File preview pane in Uploaded Documents — half-width file list + preview box, click to preview
- Form intake page — apply same field layout (CompactField, TwoColumnFields, decoupled underlines) as dashboard
- Comments section — consider stacking vertically like description fields instead of three-column
- Dark mode full verification pass

### Recent Completions (Apr 2026)
- Dashboard field layout redesign — style guide, design brief, HTML prototype, React conversion (50+ commits)
- Decoupled underlines (160px line, w-full input), SectionGroup titles, address single-line no underline
- Test data fills all fields including Property Contact, Building Info VALTA dropdowns, mock files
- Report Type always Appraisal Report, spinbutton arrows removed, placeholders cleaned
- Dashboard list page — search bar shortened, table view button removed, job dividers visible, DATE/STATUS aligned
- Legal Description changed to single-line input no underline

### Recent Completions (Jan 2026)
- Real Supabase authentication (replaced fake auth)
- ClickUp production environment (Valta workspace)
- ClickUp task creation from Valcre jobs (auto-trigger)
- Lovable branding removed, APR brand applied
- DocuSeal e-signature audited and cleaned (production status)
- Project root organized (112 session files moved, credentials cleaned)

## Future Roadmap / Backlog

### Phase 2 (V4) — Unified System
- Merge V3 intake pipeline + Report Builder into single integrated flow
- Job → Report seamless transition
- Shared data model

### Phase 3 — Internal CRM
- Replace external Pipedrive/ClickUp with built-in project management
- Client relationship tracking
- Portfolio management

### Backlog Items
- Image Configurator feature (migration exists at 20260103, code at src/features/image-configurator)
- Calculator demo refinement (standalone at /standalone-calculator)
- Docs directory reorganization (numbered convention per audit-docs)
- UX documentation system bootstrap (docs/-uxui/)
