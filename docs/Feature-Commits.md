# APR Dashboard v3 — Feature Commits

**Purpose:** Single reference for what was built, when, and the commit to revert if something breaks. Update after every feature session.

**Last updated:** 2026-03-23 (CoArch initial audit)

---

## Recent Commits (Latest First)

| Commit | Date | Description | Status |
|--------|------|-------------|--------|
| `0673699` | 2026-01-12 | Update og-image to solid black (remove Lovable branding) | Done |
| `742f8ac` | 2026-01-12 | Replace Lovable branding og-image with APR brand color | Done |
| `2130b43` | 2026-01-12 | Fix ClickUp API endpoint for task templates | Done |
| `adf30ac` | 2026-01-12 | Re-enable automatic ClickUp task creation after Valcre job | Done |
| `2faa7dc` | 2026-01-12 | Remove OAuth UI — using personal API token instead | Done |
| `dc80907` | 2026-01-12 | Replace fake auth with real Supabase authentication | Done |
| `a8d3ed3` | 2026-01-12 | Fix ClickUp OAuth callback to save tokens to database | Done |
| `cbc6f29` | 2026-01-12 | Add ClickUp production environment support | Done |
| `a8af386` | 2026-01-12 | Fix TDZ error in template editor preventing modal from opening | Done |

---

## Feature Areas

### Client Intake (Stage 1)
| Commit | Date | Description | Status |
|--------|------|-------------|--------|
| — | — | SubmissionForm with autofill, property info, documents | Working |

### Job Management — Valcre (Stage 2a)
| Commit | Date | Description | Status |
|--------|------|-------------|--------|
| — | — | api/valcre.ts Vercel function, field mapping | Working |

### Job Management — ClickUp (Stage 2b)
| Commit | Date | Description | Status |
|--------|------|-------------|--------|
| `2130b43` | 2026-01-12 | Fix ClickUp API endpoint for task templates | Done |
| `adf30ac` | 2026-01-12 | Re-enable auto ClickUp task creation after Valcre | Done |
| `2faa7dc` | 2026-01-12 | Remove OAuth UI, use personal API token | Done |
| `cbc6f29` | 2026-01-12 | Add ClickUp production environment support | Done |

### E-Signature — DocuSeal (Stage 3)
| Commit | Date | Description | Status |
|--------|------|-------------|--------|
| — | — | DocuSeal integration audited and cleaned (2026-03-03) | Production |

### Report Builder (Stage 4)
| Commit | Date | Description | Status |
|--------|------|-------------|--------|
| `a8af386` | 2026-01-12 | Fix TDZ error in template editor | Done |
| — | — | Database persistence (report_builder_data table) | NOT STARTED |
| — | — | Route integration (/dashboard/job/:jobId/report) | NOT STARTED |
| — | — | Auto-save (2s debounce) | NOT STARTED |

### Authentication
| Commit | Date | Description | Status |
|--------|------|-------------|--------|
| `dc80907` | 2026-01-12 | Replace fake auth with real Supabase auth | Done |

### Branding
| Commit | Date | Description | Status |
|--------|------|-------------|--------|
| `0673699` | 2026-01-12 | Solid black APR brand, removed Lovable artifacts | Done |

---

## Pending Work

1. Report Builder database persistence (report_builder_data table creation + migration)
2. Route integration: /dashboard/job/:jobId/report
3. Data bridge: job data -> Report Builder "Home" section
4. Auto-save: 2-second debounce to report_builder_data
5. Console.log cleanup in ClickUpAction.tsx
6. Image Configurator feature (migration exists, feature in src/features/image-configurator)

---

## How to Use This File

**Before starting work:** Read this to understand what exists and what's pending.
**After completing work:** Add commit hash, date, one-line description, status.
**If reverting:** Update the status to "Reverted" with the replacement commit.
