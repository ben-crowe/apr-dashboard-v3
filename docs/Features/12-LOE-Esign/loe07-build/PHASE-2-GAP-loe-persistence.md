---
content_type: gap-note
status: open-deferred
created: 2026-06-03
author: react-specialist
phase: LOE-07 Phase-2 wiring (do NOT fix now — note only, per co-architect)
related: [PRD-B versioning requirement]
---

# GAP — generated LOEs are NOT persisted (loe_submissions table missing)

**Found:** 2026-06-03 during the signed-LOE reference pull.

## What's broken
- `src/utils/loe/generateLOE.ts` inserts each generated LOE into a **`loe_submissions`** table (`loe_html`, `docuseal_slug`, `docuseal_submission_id`, `status`, client fields). **That table DOES NOT EXIST** in the Supabase `public` schema.
- The insert is wrapped in a try/log that does NOT throw on failure → **every LOE generation silently fails to persist**. No filled `loe_html` is stored anywhere; no per-job LOE history exists.
- Confirmed: 0 rows of stored LOE HTML; only `job_loe_details.docuseal_submission_id` records the DocuSeal link (and `signed_document_url` is null even for the one submission that exists).

## Why it matters for LOE-07 / PRD-B
- **Versioning requires persistence.** PRD-B locks LOE-07 as a NEW version alongside v3/v5 with a version selector + "old versions stay reproducible." Reproducibility is impossible if the generated/filled HTML is never stored.
- Need (Phase-2): create the `loe_submissions` table (or equivalent) with at minimum: `job_id`, `loe_version` (which template version generated it), `loe_html` (filled snapshot), `docuseal_submission_id`, `docuseal_slug`, `signed_document_url`, `status`, timestamps. Make the insert fail-loud, not silent.

## Scope
- **Do NOT fix now** (co-architect directive). This is a Phase-2 wiring item. Logged so it's not rediscovered cold.
