# APR Dashboard v3 - Project Index

> **Last Updated:** 2026-01-05
> **Maintained By:** Orchestrator (auto-updated)

---

## Quick Links

| Document | Purpose |
|----------|---------|
| [DOMAIN-CONTEXT.md](./DOMAIN-CONTEXT.md) | Mission, phases, decisions |
| [PENDING-TASKS.md](./PENDING-TASKS.md) | Current task list |
| [FULL-ECOSYSTEM-INTEGRATION.md](./docs/bc%20research%20%26%20notes/FULL-ECOSYSTEM-INTEGRATION.md) | Complete system architecture |

---

## Planning & Context

| File | Purpose | Status |
|------|---------|--------|
| `DOMAIN-CONTEXT.md` | Mission, phases, key decisions | Active |
| `PENDING-TASKS.md` | Task tracking (syncs with session summaries) | Active |
| `docs/bc research & notes/FULL-ECOSYSTEM-INTEGRATION.md` | 4-stage system architecture | Reference |
| `docs/bc research & notes/TDD-PAGE-ARCHITECTURE.md` | Page/section architecture | Reference |
| `docs/bc research & notes/CALC-ENGINE-FIELD-MAP.md` | Calculator field mappings | Reference |

---

## Report Builder (Stage 4) - Core

| File | Purpose |
|------|---------|
| `src/features/report-builder/schema/fieldRegistry.ts` | 944 field definitions |
| `src/features/report-builder/store/reportBuilderStore.ts` | Zustand store (6,340 lines) |
| `src/features/report-builder/types/reportBuilder.types.ts` | TypeScript types |
| `src/features/report-builder/components/SectionSidebar.tsx` | Section navigation |
| `src/features/report-builder/components/EditPanel/EditPanel.tsx` | Field editors |
| `src/features/report-builder/components/PreviewPanel/PreviewPanel.tsx` | iframe preview |

---

## Image Configurator (Standalone)

| File | Purpose |
|------|---------|
| `src/features/image-configurator/ImageConfiguratorDemo.tsx` | Main demo component |
| `src/features/image-configurator/components/ImageGrid.tsx` | Grid display with drag-drop |
| `src/features/image-configurator/components/ImageUploadZone.tsx` | Upload dropzone |
| `src/features/image-configurator/components/FiltersPanel.tsx` | Filter controls |
| `src/features/image-configurator/components/LayoutBuilder.tsx` | Layout management |
| `src/features/image-configurator/components/ImageEditorModal.tsx` | Image editing |
| `src/features/image-configurator/hooks/useJobImages.ts` | Image data hook |
| `src/features/image-configurator/hooks/useLayouts.ts` | Layout management hook |
| `src/pages/ImageTest.tsx` | Route: `/image-test` |

---

## Calculator Demo (Standalone)

| File | Purpose |
|------|---------|
| `src/features/calculator-demo-v4/` | Calculator v4 feature |
| `src/pages/CalculatorDemo.tsx` | Route: `/calculator-demo` |

---

## Job Management (Stages 1-3)

| File | Purpose |
|------|---------|
| `src/components/dashboard/JobDetailView.tsx` | Job detail page |
| `src/components/dashboard/job-details/ClientSubmissionSection.tsx` | Client info display |
| `src/components/dashboard/job-details/LoeQuoteSection.tsx` | LOE preparation |
| `src/hooks/useJobDetail.ts` | Job data fetching |
| `src/hooks/useJobData.ts` | Job data management |
| `src/types/job.ts` | Job TypeScript types |

---

## Integrations

| Integration | Key Files | Status |
|-------------|-----------|--------|
| Valcre API | `src/utils/webhooks/valcre.ts` | Active |
| DocuSeal | `src/utils/webhooks/docuseal.ts` | Active |
| ClickUp | `src/utils/webhooks/clickup.ts` | Active |
| Supabase | `src/integrations/supabase/client.ts` | Active |

---

## Documentation by Feature Area

| Area | Folder | Contents |
|------|--------|----------|
| Client Form | `docs/01-Client-Form-Submission/` | Intake form docs |
| CRM | `docs/02-Email-&-Pipedrive-CRM/` | Pipedrive research |
| ClickUp | `docs/03-ClickUp-Integration/` | ClickUp integration |
| Dashboard | `docs/04-APR-Dashboard/` | Dashboard docs |
| Doc Management | `docs/05-DOC-MANAGEMENT/` | Document handling |
| LOE Generator | `docs/06-LOE-Generator/` | DocuSeal implementation |
| Valcre | `docs/07-Valcre-Integration/` | Valcre API docs |
| Report Generator | `docs/13-Report-Generator/` | Report generation |
| Blueprints | `docs/14-APR.Blueprints/` | System blueprints |
| Contract Review | `docs/15-Contract-review/` | Contract analysis |

---

## Reference Docs (Root Level)

| File | Purpose |
|------|---------|
| `docs/1-API-FIELD-MAPPING-REFERENCE.md` | API field mappings |
| `docs/3-DOCUSEAL-LOE-FIELD-MAPPING.md` | DocuSeal field map |
| `docs/ARCHITECTURE-OVERVIEW.md` | System architecture |
| `docs/DATA-FLOW-EXPLANATION.md` | Data flow docs |
| `docs/API-TESTING-METHODOLOGY.md` | API testing approach |

---

## Patterns (Reusable)

| File | Purpose |
|------|---------|
| `docs/patterns/dnd-kit-layout-builder-pattern.md` | Drag-drop pattern |
| `docs/patterns/react-image-upload-patterns.md` | Image upload pattern |
| `docs/patterns/supabase-storage-image-patterns.md` | Supabase storage pattern |
| `docs/patterns/react-image-editor-patterns.md` | Image editor pattern |

---

## Archive

| Folder | Contents |
|--------|----------|
| `docs/archive/early-sessions/` | Old session notes |
| `docs/-passover-sessions/` | Session handoffs |
| `docs/Cursor Files/` | Legacy Cursor docs |

---

## Cleanup Candidates

| File/Folder | Issue | Suggested Action |
|-------------|-------|------------------|
| `docs/Cursor Files/` | Legacy from Cursor era | Archive or delete |
| `docs/archive/` | Old sessions | Keep archived |
| `docs/NEXT-SESSION-IMAGES.md` | Orphaned note | Review - consolidate or delete |
| `docs/README-UPDATED.md` | Duplicate? | Review |
| `docs/Unnumbered-Tabs-TDD-Dashboard.md` | Unclear purpose | Review |

---

## File Zones

| Zone | Path | What Goes Here |
|------|------|----------------|
| Planning | `docs/bc research & notes/` | Active planning, specs, research |
| Reference | `docs/[numbered folders]/` | Feature-specific documentation |
| Patterns | `docs/patterns/` | Reusable code patterns |
| Archive | `docs/archive/` | Old/completed session notes |
| Code | `src/` | All source code |
| Features | `src/features/` | Feature-organized code |

---

## Notes

- `bc research & notes/` is the active planning area - agent outputs go here
- Numbered folders (`01-`, `02-`, etc.) organize by feature area
- Passover sessions are session handoffs for continuity
- Image configurator is ready to wire into Report Builder's image-mgt section
