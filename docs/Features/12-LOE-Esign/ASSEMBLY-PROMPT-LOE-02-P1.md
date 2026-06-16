---
id: assembly-prompt-loe-02-coordinated
title: "Assembly Prompt — ONE coordinated builder: editor punch-list + cascade-sync + 4-field address"
created: 2026-06-15
updated: 2026-06-16
type: assembly-prompt
owner: co-architect (author) · qa-agent (prompt-gate + build-verify) · Ben (go + go-live gate)
builder_persona: react-specialist (forked persona-switch)
specs:
  - ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/SPEC-APR-LOE-02-P1-cascade-versions.md
  - ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/SPEC-address-two-part-split.md
build_index: ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/PUNCHLIST-LOE-02-P1-editor-glitches.md
tags: [assembly-prompt, loe, coordinated-build, react-specialist, prompt-gate]
---

# Assembly Prompt — Coordinated build (editor + cascade-sync + 4-field address)

> **Why one builder:** every item below touches the SAME files (`ClientSubmissionSection.tsx`, `generateLOE.ts`, the LOE template, the locked contact block, `api/valcre.ts`, `webhooks/valcre.ts`). Two builders would collide. ONE forked react-specialist does the whole set.
> **Deploy mechanic:** Agent tool, **NO `subagent_type`** (forks me, inherits context) → persona-switch to **react-specialist** in the prompt. This prompt IS the fork's task at spawn. It reports back on completion (no poll) with a VERIFY artifact; co-arch verifies → QA build-verifies.
> **Gate first:** this goes to QA `/review-gate` mode-2 BEFORE dispatch.

---

## THE PROMPT (paste as the fork's task)

You are now **react-specialist** — APR Dashboard v3 (React 18 + TypeScript + Vite + Supabase, dev port 8086). Drop the co-architect persona; build as react-specialist. This is ONE coordinated build of several spec-gated items on the LOE feature. Build to the specs; they passed QA's gate.

### STEP 0 — Load + activate skills (evidence of invocation, not just loaded)
- **`/cli-agent-all`** — ⭐ load FIRST: the FULL APR app toolkit (browser · Valcre read/write+readback · database · ClickUp · e-sign · deploy) + the app's documented traps (incl. "editing Valcre code locally routes through PRODUCTION — local dev syncs via the deployed proxy").
- **`/search-tools`** — the finder; use independently whenever you don't know a command exists or want the safe way to verify something.
- **`/search-2phase`** — run scoped (Step 2) before touching code.
- **`/supabase-deploy`** — for the migration + RLS (instance `ngovnamnjmexdpjtcnky`; you have full Supabase access per root CLAUDE.md).
- **`/cli-browser-auto`** — browser testing (see tool reminder).
- **`/checkpoints`** — checkpoint as react-specialist when done.

### STEP 1 — Read the passover (authoritative)
- This prompt, in full.
- **Spec 1 — cascade versions + contact-block lock + rename:** `SPEC-APR-LOE-02-P1-cascade-versions.md` (sections A–G).
- **Spec 2 — 4-field structured address:** `SPEC-address-two-part-split.md` (FULL PASS, all gaps + PropertyContact pinned).
- **Build index (the full item list + status):** `PUNCHLIST-LOE-02-P1-editor-glitches.md`.

### STEP 2 — Search-prime (both phases, scoped)
`Activate /search-2phase` → `--project ~/Development/APR-Dashboard-v3 --topic "LOE templateParser stripHTMLTags contact block job_contracts saveJobContract loeCascade structured address Valcre AddressStreet 1:1 parseAddress empty-PATCH VALCRE_SYNC_FIELDS"`. Thin leg → read the spec Entry Files directly (ground truth), don't conclude "missing."

### STEP 3 — Build (per the specs; grouped)
**A. Contact-block lock** (Spec 1 §A) — exclude the client contact block from the editable-sections parse (root cause: `templateParser.ts` `stripHTMLTags` flattens it); render read-only + structured from the client record; click → contact record with **guarded nav**; **graceful empty** (omit empty lines). Scope: contact block ONLY.
**B. Rename** "Edit Template" → **"Edit Document"** (`LOEPreviewModal.tsx:408`) + the subtitle (`TemplateEditorModal.tsx:329`).
**C. Delete a saved version** — subtle **hover-X** beside "Open" on each saved row → **"are you sure?"** confirm → delete. **DRAFTS ONLY** (block/hide on sent). Backend `deleteJobContract(id)` exists; wire UI + confirm + drafts-only guard.
**D. Cascade versions save as distinct drafts** (Spec 1 §B–F) — each new version = fresh **Create Contract** (no `id` → INSERT, separate `job_contracts` draft row, no overwrite); **per-version label** via `template_version`; **save-failure must SURFACE** (toast/throw, not swallow); `job_contracts` insert visible to **anon**.
**E. 4-field structured address** (Spec 2) — DB migration: 6 nullable cols (`client_city/province/postal_code`, `property_city/province/postal_code`); `types.ts` + `src/types/job.ts`; `ClientSubmissionSection.tsx` Street/City/Province/Postal for BOTH client + property (auto-save + in the `syncData` PAYLOAD); `SubmissionForm.tsx` intake; LOE mapper composes `[ClientAddressLocality]` + `[PropertyAddressLocality]` (empty-suppress line+`<br/>` if all 3 empty); **Valcre 1:1 — DELETE `parseAddress`**, map AddressStreet/City/State/PostalCode directly. **⚑⚑ NO-CROSS:** client→Contact only, property→Property only; **PropertyContact = EMPTY (remove the `|| addressParts.street` fallback at ~L1100)** — Ben-confirmed. `[JobName]` label: **KEEP the city** (recombine just for the label) — co-arch default pending Ben; one-line flip if he says street-only.
**F. Cascade-sync fixes** (punchlist CASCADE-SYNC set) — **(a) SERVER empty-native-PATCH skip** in `api/valcre.ts`: when `updateData` has no keys, SKIP the native PATCH, go straight to `setValtaCustomFields` (this is LOAD-BEARING — empty PATCH currently hard-fails and custom fields never write). **(f) Surface the swallowed Valcre native-PATCH error** (currently `details:''`) so failures are diagnosable. **(g) Fix the Property Rights `Purposes` native update** once (f) reveals the real rejection reason (REAL failure, not a mute). **(d)** surface the cascade-derived state on the dashboard.
**G. Sync-reassurance UX** — give `ClientSubmissionSection` (Section 1) the same per-field `fieldStates`→'synced ✓' indicator `LoeQuoteSection` (Section 2) has (`status=` on its CompactFields) so no-popup reads as success.

**⚑ PRESERVE QA's already-committed client-side fixes — do NOT regen over them:**
- `LoeQuoteSection.tsx` syncFailed **verdict fix** (~L704-711): empty-native-PATCH no longer counts as failure.
- `statusOfImprovements` + `valueTimeframe` wired into `VALCRE_SYNC_FIELDS` + `syncData`.

### STEP 4 — Self-verify BEFORE reporting (the testable proof)

**⚑ TWO non-negotiable verification rules (live evidence this session — ignore them and every check false-passes):**

- **AUTH (TWEAK 2):** the app's real identity is **AUTHENTICATED, not unauthenticated.** **Unauthenticated/anon writes SILENTLY FAIL RLS** — the UI optimistically shows "saved" while the DB row reads back EMPTY (confirmed live this session). So: **LOG IN as `bc@crowestudio.com`** in the running app, THEN exercise the flows. Confirm persistence by **DB READ AFTER A RELOAD** (reload the job, re-query Supabase) — NEVER trust the optimistic UI "saved" state. (NOT service-role/console either — that's the opposite false-pass.)
- **LOCAL-vs-DEPLOYED (TWEAK 1):** on port 8086, **`/api` proxies to the DEPLOYED server** (`vite.config.ts`) — so your STEP-3-F **SERVER** edits (`api/valcre.ts`: empty-PATCH skip, error-surfacing, Property Rights `Purposes`) are **NOT live on localhost** until deployed. Do NOT verify them on 8086 and do NOT claim them "verified" — you'd be testing stale prod (was 4 days stale this session). Build + commit them, report **"built, awaiting deploy."**

**Verify NOW on 8086 (client-side, logged in as bc@crowestudio.com, DB-read-after-reload):**
1. **Cascade versions:** create the distinct versions (Spec 1 divergence table), each a fresh Create Contract → Save Draft → **reload → query `job_contracts`** = distinct labeled draft rows, none overwritten → content-diff `edited_html` §10 differs (cascade-isolated). Reopen a version → loads THAT row's html.
2. **Contact-block lock:** renders one-item-per-line from the record; not inline-editable; click → contact record (guarded nav); empty field omits its line; a draft created after the fix shows no run-on.
3. **4-field address round-trip (DB side):** enter all 4 parts both addresses → save → **reload → re-query Supabase** = the 6 cols persist (DIFFERENT client vs property addresses) → LOE shows street + composed locality line (+ property full), empty-suppress holds.
4. **Delete:** hover-X deletes a DRAFT after confirm; sent contracts not deletable.
5. `npx tsc --noEmit` + build clean.

**Built + committed, proof DEFERRED to post-deploy (report "built, awaiting deploy" — do NOT mark verified off localhost):**
6. **Address → Valcre 1:1 across ALL THREE entities** (Contact = client addr exactly, Property = property addr exactly, **PropertyContact = EMPTY**, no truncation, no swap) — needs the deployed proxy (server-side map + parseAddress deletion). QA runs this readback post-deploy.
7. **Cascade-sync server fixes** — empty-PATCH skip (custom-only writes land), swallowed-error surfacing, Property Rights `Purposes` sync. All server-side → verify post-deploy.

### TOOL REMINDER — browser testing
`/cli-browser-auto` / agent-browser **headless on port 8086**, **LOGGED IN as `bc@crowestudio.com`** (authenticated — unauthenticated/anon writes silently fail RLS and read back empty). **NOT Playwright, never --headed.** Search before guessing: `python3 ~/.claude/skills/cli-browser-auto/scripts/search.py "your task"`.

### CONSTRAINTS (hard)
- **Test job + bc@crowestudio.com only.** No production client. **Valcre is degraded from test calls** — prefer dashboard-UI verification + readback; minimal mutating API calls; reachability checks use READ/GET, never a mutating POST (junk-job lesson).
- **DEPLOY FREELY — no gate** (policy change, Ben 2026-06-16). This APR dashboard is a TEST/prep instance (no real client team on it yet; hosted on Chris's Vercel only so he can log in + play). So: commit to main AND `vercel --prod` when the client-side work verifies — then the SERVER fixes (Valcre) actually go live (localhost can't run them). Do NOT wait for Ben; just **inform** him each time something goes live. **No secrets committed.** (The one real external system is Valcre itself — stay on the test job + minimal mutating calls.)
- **KEEP GOING** on validated in-flight fixes; only stop if you'd CHANGE the design.
- **Worker doctrine:** no `AskUserQuestion`/menus — pick + report "Picked Option N, Reason"; emit plain `STUCK:` if blocked.

### STEP 5 — Report back
VERIFY artifact: the Step-4 results with evidence (DB rows, content-diff, Valcre 3-entity readback, screenshots/DOM for contact block + address + delete), `tsc`/build status, files changed, any deviation + reason. Checkpoint as react-specialist. Co-arch verifies → QA runs the independent VAL261101 round-trip across all 3 entities.

---

*Route to QA `/review-gate` mode-2 before deploy. On thumbs-up → fork react-specialist with the prompt above. Go-live stays Ben's gate.*
