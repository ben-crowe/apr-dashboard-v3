---
id: spec-v4-slice1-unlock-persist
title: "SPEC — V4 Slice 1: Unlock + Persist (report builder)"
created: 2026-06-16
type: implementation-spec
status: for-spec-gate (QA flaw-review) → then Ben sign-off → then build
track: "Track 1 (PREP) — KN-Mgr directed, co-architect authored"
owner: co-architect (author) · qa-agent (spec-gate + build-verify) · Ben (gate recommendations + GO)
source: docs/Architecture/V4-STATE-OF-PLAY-2026-06-16.md (§4 + §4a)
scope_excludes: "calculator-completion (Sales ~620 fields, Cost not started) — separate later track"
tags: [apr, v4, report-builder, unlock, persistence, symlink, report_builder_data, rls, spec]
---

# SPEC — V4 Slice 1: Unlock + Persist

> **One line:** Make the already-built report builder *reachable* (kill the symlink, re-enable the
> routes) AND *persistent* (a real `report_builder_data` table + autosave hook), as one slice.
> "Done" = the **DEPLOYED Vercel build passes** + a report round-trips through Supabase.

> **PREP status — nothing builds until Ben signs off the two gate recommendations below.**

---

## The two gates — RECOMMENDATIONS for Ben (code-verified, not assumed)

### Gate A — the report-builder's true code home → **RECOMMEND: move to `src/features/report-builder/`, delete the symlink**

**Code-verified facts:**
- The symlink exists: `src/features/report-builder → image-configurator/report-builder` (confirmed via `readlink`). It is the Vercel build-breaker.
- **Every importer (~18 files) already imports `@/features/report-builder/...`** — `MockReportBuilder.tsx`, all of `calculator-demo-v4/`, `test-input/`. **ZERO files import the `image-configurator/report-builder` path.**
- One file inside `image-configurator/` imports report-builder (`components/LayoutBuilder.tsx:23`), but via the `@/features/report-builder/` alias — which still resolves after the move. (QA-verified: the move is safe; an earlier "grep empty" claim here was inaccurate — the import exists but is alias-routed.)
- The project's own `CLAUDE.md` ("No Workarounds Rule" + Key Files table) already names `src/features/report-builder/` as the canonical home and explicitly forbids the symlink: *"move the files… One canonical location… no symlinks, no aliases."*

**Why move (not repoint to image-configurator):** moving the real directory OUT to `features/report-builder/` and deleting the symlink means **zero import edits** — every existing `@/features/report-builder/...` import becomes correct against a real directory. Repointing imports to `image-configurator/` instead would touch ~18 files, fight the docs, and keep a home nobody references. Move is the smaller, doc-aligned, workaround-killing change.

**The move (mechanical):**
1. `git mv src/features/report-builder` is a symlink — first `rm` the symlink, then move the real dir:
   move `src/features/image-configurator/report-builder/` → `src/features/report-builder/` (real directory at the canonical path).
2. Delete the symlink.
3. Verify no remaining references to `image-configurator/report-builder` anywhere (`grep -rn`).
4. `tsc --noEmit` clean — all `@/features/report-builder/...` imports now resolve to a real dir.

> **⚑ Open sub-question for Ben/QA:** does anything ELSE under `image-configurator/` (the image-config
> feature itself) expect report-builder as an internal sibling? Grep says no, but confirm before the move
> is final — this is the one move-safety check to re-run at build time.

### Gate B — the save shape → **DECIDED (Ben): hybrid table (queryable columns + one JSONB field-bag), OPEN access (no auth gate)**

> **⚑ Ben's call (2026-06-16):** this is an app under active development — **remove login/auth as a
> hindrance entirely. Open read+write access. No RLS gate that blocks agents or anyone from full testing.**
> Logins get added LATER as a separate protection/user-account feature, not now. This DECISION supersedes
> any "lock RLS day one" language below — keep saves open like the rest of the dashboard.

**Code-verified facts:**
- `report_builder_data` does NOT exist (zero refs in `src/`, `api/`, `supabase/migrations/`). `useSaveReportBuilderData` does NOT exist. Inbound bridge `useLoadJobIntoReport.ts` exists; the outbound save half does not.
- The store (`reportBuilderStore.ts`) is section→fields nested; the field universe is ~2,082 ids. A column-per-field table is wrong (~2,000 columns); a raw unstructured blob is what QA flagged as unverifiable.

**Recommended schema (the hybrid — structure, not a bare blob):**
```sql
CREATE TABLE IF NOT EXISTS report_builder_data (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id       UUID NOT NULL,                 -- queryable FK to the job
  schema_version INTEGER NOT NULL DEFAULT 1,  -- QA's validation/migration hook (NOT a raw blob)
  data         JSONB NOT NULL DEFAULT '{}',   -- the field-value bag (id → value)
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_report_builder_data_job ON report_builder_data (job_id);
```
- **One row per job** (`uq` on `job_id`) → autosave is a clean upsert-on-job_id.
- **`schema_version`** is the answer to QA's "raw blob is unverifiable" — the save layer validates the bag against the current registry version and stamps it; a future field-shape migration keys off this.
- **OPEN ACCESS — no auth gate (Ben's call).** RLS either disabled or a fully-permissive `FOR ALL USING (true) WITH CHECK (true)` policy so anon + agents + the app all read/write freely. Mirror where the email tables actually landed (`20260614130000_disable_rls_email_tables.sql`), which is now the intended posture, not a mistake. Login-based gating is a SEPARATE later feature.

> **⚑ AUTH TRAP — now MOOT for this slice.** Because writes are open (no auth), the headless/anon
> agent-browser save round-trip verifies normally — no false pass/fail, no need to route the save proof
> to a logged-in session. QA can build-verify the full round-trip headless.

---

## Build scope (after Ben signs off the gates) — Unlock THEN Persist

### Part 1 — UNLOCK
1. Execute the Gate-A move + symlink delete + reference sweep.
2. In `src/App.tsx`, uncomment + restore the imports (L17, L19–21) and routes:
   - `/mock-builder` → `MockReportBuilder`
   - `/calculator-demo` → `CalculatorDemoPage`
   - **NEW:** `/dashboard/job/:jobId/report` → the in-dashboard report builder entry.
3. Remove the `// TODO: consolidate report-builder location (symlink issue)` markers — the debt is paid, not deferred.
4. **Gate:** `npm run build` local clean → then the DEPLOYED `vercel --prod` build passes (the build break was Vercel-specific; local-green is necessary, not sufficient).

### Part 2 — PERSIST
1. Migration: the `report_builder_data` table above (+ unique index + RLS policy). Apply via Supabase (agents have full access per CLAUDE.md).
2. `useSaveReportBuilderData` hook — outbound mirror of `useLoadJobIntoReport`: serialize the store's field-bag → upsert on `job_id` → stamp `schema_version` + `updated_at`. Honest error surfaced on write-fail (no silent success).
3. Debounce autosave (~2s) wired into the store, writing through the hook.
4. Regenerate `src/integrations/supabase/types.ts` for the new table.

---

## Acceptance (verified on the DEPLOYED app, logged in)

1. `tsc --noEmit` + `npm run build` clean locally.
2. **DEPLOYED `vercel --prod` build passes** — the real "done" bar.
3. No `image-configurator/report-builder` references remain; no symlink; the three routes load in the deployed app.
4. **Save round-trip (open access — verifies headless):** open a job's report → edit a field → autosave fires → reload → store rehydrates from `report_builder_data` → the edited value persists. One row per job (upsert, not duplicate rows).
5. Writes are OPEN — an anon/headless write succeeds and reads back (no auth gate); confirms the trap is gone.
6. The inbound bridge (`useLoadJobIntoReport`) still works alongside the new outbound save.

---

## QA spec-gate fixes (PASS-WITH-FIXES — builder folds in, do NOT re-spec)
QA flaw-review verdict: **PASS**, cleared for Ben's build GO. Three builder-fixes:
1. **Make the `schema_version` validation real, not a claim.** The save hook must actually validate the field-bag against the current registry version before stamping — not just write the integer. Define what "valid" means (e.g. keys ⊆ known field ids) and reject/log on mismatch.
2. **Define the zero-row / first-load state.** A job that was never saved has no `report_builder_data` row — the load path MUST treat zero rows as an empty store (clean blank form), never an error/crash. Add as a defined state + one acceptance line.
3. **Decide the `job_id` FK.** SQL comments it "queryable FK" but adds no `REFERENCES job_submissions(id)`. Either enforce it (orphan-row guard) or document why not — one line either way.

## Explicitly OUT of this slice
- **Calculator-completion** — Sales (~620 fields, ~0 test data) + Cost (not started). Separate later track; correctness can't be verified yet.
- **Registry/report-field three-way mapping** — Track 2, Ben + KN-Mgr own it in parallel.
- **Delivery/export** (share links, PDF/Excel) — later decomposition slice F.

---

*co-architect, 2026-06-16. PREP per KN-Mgr Track-1 direction. → QA spec-gate flaw-review → Ben signs off the two gate recommendations + the spec → build (Unlock then Persist) → deploy → QA build-verify (logged-in for the save round-trip).*
