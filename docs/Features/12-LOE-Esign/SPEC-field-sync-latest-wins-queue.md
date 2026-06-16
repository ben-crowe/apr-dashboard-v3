---
id: spec-field-sync-latest-wins-queue
title: "Build Spec — Latest-wins per-field Valcre sync queue (kill the out-of-order false-✓)"
status: ready-for-gate
created: 2026-06-16
type: build-spec
priority: follow-up (real fix, NOT urgent — only rapid same-field changes trigger it; build AFTER the address work closes)
owner: qa-agent (spec — found + diagnosed live) · co-architect (design direction + gate) · react-spec (build) · qa (verify)
tags: [loe, valcre, sync, race-condition, honest-indicator, field-generic]
---

# Build Spec — Latest-wins per-field Valcre sync queue

## The problem (live-confirmed, VAL261062 / 890842)
Each synced Section-1/Section-2 field fires `sendToValcre` **async** on change. When the SAME field
changes rapidly (e.g. Tenancy toggled Multi-Tenant → other → Multi-Tenant, which re-derives Property
Rights via Part E), **multiple async calls race and resolve OUT OF ORDER** — so Valcre lands on an
INTERMEDIATE value while React state + the `synced ✓` indicator reflect the FINAL value.

**Live evidence:** dashboard showed Property Rights = "Leased Fee Interest" + blue ✓, but Valcre
`InterestAppraised` = 7472 ("Going Concern", the intermediate) — STABLE (re-read 12s later, unchanged).
The ✓ means "the last call returned 200," NOT "Valcre holds the current value." **That is a lying
indicator — it violates the honest-indicator principle this whole effort exists to uphold.**

## Design (co-architect direction — latest-wins queue; explicitly NOT readback-before-green)
A **per-field, latest-wins, single-in-flight** sync queue:
- Each synced field holds **ONE pending value** (a slot).
- A newer change to the SAME field **REPLACES** the pending value (supersedes) — intermediate values
  **never even fire** (fewer Valcre calls — good, Valcre is degraded).
- A **single in-flight worker per field** runs: it `await`s the prior call, then sends the latest
  pending value **only if it changed**; loops if a newer value arrived while it was in flight; stops
  when pending is empty.
- Net: Valcre **converges to the FINAL value** in correct order; the `✓` honestly means *"the latest
  value is the one that was sent."*
- **Do NOT** add readback-before-green (option c) — too many calls on a degraded Valcre.

## Where it lives
The two sync entry points both call `sendToValcre`:
- `ClientSubmissionSection.tsx` — `autoSaveField` (~L92) + `syncDetailFieldToValcre` (~L183).
- `LoeQuoteSection.tsx` — its `autoSaveField` (the Section-2 sync path; cascade Parts C/D/E call it).

**Build a shared hook `useValcreSyncQueue` (new file, e.g. `src/hooks/useValcreSyncQueue.ts`)** that
both components route their `sendToValcre` dispatch through. Field-generic — keyed by `fieldName`, not
PR-specific. The hook owns: the per-field pending slot + in-flight worker + the `FieldSyncStatus`
transitions (`saving` while a worker is active for the field; `synced`/`sync-failed` from the LATEST
call's result only). The components keep their persistence (`onUpdateJob`/`onUpdateDetails`) and their
field→syncData mapping; only the `sendToValcre` call + the fieldState set move into the hook.

## Acceptance (QA — deployed app, logged in, DB-read-after-reload; verify in Valcre)
1. **Rapid same-field toggle converges:** on a test job, toggle Tenancy Multi-Tenant → Single-Tenant →
   Multi-Tenant as fast as possible. → Valcre `InterestAppraised` (the derived Property Rights) ends on
   **7470 (Leased Fee Interest)** — the FINAL value — NOT an intermediate. The `✓` is green AND matches.
2. **Fewer calls:** the intermediate value(s) do not produce a Valcre write (supersede, not queue-all) —
   confirm via the proxy log / by the absence of the intermediate id ever appearing.
3. **Honest ✓:** the green check appears only after the LATEST value's call succeeds; if that call
   fails, the amber triangle shows (matching reality). No green ✓ while Valcre holds a different value.
4. **Single change unaffected:** one change at a time still syncs exactly as today (no regression).
5. **Field-generic:** the same convergence holds for any rapidly-changed synced field (spot-check a
   second field, e.g. a client text field hammered with edits), not just Property Rights.

## Out of scope
- Readback-before-green (option c) — rejected (Valcre-call cost).
- The address create-vs-edit re-sync gap (separate item).
- Any change to WHICH fields sync or their value mapping — purely the dispatch ordering + the honesty of `✓`.

## Guardrails
- Must NOT drop the final value (the whole point — Valcre must end correct).
- Must NOT fire a stale value after a newer one (the bug).
- Must NOT add per-keystroke Valcre calls (supersede pending; the existing debounce on text fields stays).
- Preserve all committed fixes (approachesToValue alias, F empty-PATCH skip, stale-closure fix, PR→CF12412).

*qa-agent · spec authored 2026-06-16 (found + diagnosed live). Design per co-architect (latest-wins
queue). Follow-up priority — build after the address work closes. → co-architect gate → react-spec build
→ qa verify (rapid-toggle convergence on the test job).*
