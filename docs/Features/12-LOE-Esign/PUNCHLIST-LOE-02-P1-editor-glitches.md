---
id: punchlist-loe-02-p1
title: "Punch-list — LOE editor glitches + fixes (Ben's live walk, 2026-06-15)"
status: collecting (Ben still listing) — DO NOT lock the Assembly Prompt until Ben says "that's all"
created: 2026-06-15
type: punch-list
owner: co-architect (collect) · qa-agent (gate) · Ben (source — live walk)
spec: ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/SPEC-APR-LOE-02-P1-cascade-versions.md
assembly_prompt: ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/ASSEMBLY-PROMPT-LOE-02-P1.md
tags: [punch-list, loe, editor, glitches, contact-block, delete-draft, prd]
---

# Punch-list — LOE editor (Ben's live walk)

> Running capture of everything Ben surfaces walking the editor. The Assembly Prompt gets rebuilt from THIS once the list is complete + the persona is settled. Nothing deploys / gates until then.

## Build items (from Ben)

1. **Contact-block lock** — *spec'd, gate-passed (Part A).* Exclude the client contact block from the editable-sections parse (root cause: `templateParser.ts` `stripHTMLTags` flattens its multi-line `<div>`s); render read-only + structured from the client record; click → contact record with guarded nav; graceful empty (omit empty lines); guarantee scoped to drafts created/edited after the fix.

2. **Rename "Edit Template" → "Edit Document"** — `LOEPreviewModal.tsx:408` button + `TemplateEditorModal.tsx:329` subtitle. "Template" = a separate, unbuilt mode; this edits the actual document → misleading. Keep terminology consistent (document, not template).

3. **Delete a saved version (drafts only)** — saved-versions panel needs delete:
   - Subtle **X on hover** beside the word **"Open"** on each saved row. Small/subtle, NOT prominent.
   - Click X → **"are you sure you want to delete it?"** confirm popup (a second popup) → then delete.
   - **Drafts ONLY** — sent contracts are NOT deletable (block/hide the X on sent).
   - Backend exists: `deleteJobContract(id)` in `jobContracts.ts` — this is UI wiring + confirm + drafts-only guard.

4. **Cascade versions save as distinct drafts** — *spec'd, gate-passed (Part B).* Fresh `Create Contract` = new `job_contracts` draft row (no overwrite), per-version label, save-failure surfaces, anon-visible RLS.

## Under investigation (apr-domain-agent dispatched 2026-06-15)

5. **Cascade switch → save/sync errors (CRITICAL — same save the version test depends on). ROOT CAUSE FOUND + REGISTRY-ARBITRATED (co-arch+QA, 2026-06-15).**
   - **"Failed to save statusOfImprovements" = NOT Valcre.** statusOfImprovements isn't in VALCRE_SYNC_FIELDS; it fails at the **Supabase upsert** (LoeQuoteSection.tsx ~642, maps `statusOfImprovements`→`status_of_improvements` at L621) because the live `job_loe_details` table **has no `status_of_improvements` column**. types.ts is STALE (lists it under job_loe_details → code compiles, fails live). The intended migration (BRIEF-reactspec-repoint-and-wire-2026-06-05.md L26) was **authored but never run live** — that's the bug.
   - **Canonical table = `job_loe_details`** (registry-arbitrated, QA): the 06-05 brief directs it there; sibling `value_scenarios` already lives + saves there; the `job_property_info` copy (migration 20260330) is a separate older Section-3 instance, NOT a repoint target. (My earlier 'property table' lean was wrong for this context.)
   - **FIX = run the intended migration:** `ALTER TABLE job_loe_details ADD COLUMN IF NOT EXISTS status_of_improvements text` + **regen types.ts** (so types match live). ✅ **DONE — QA ran the migration live 2026-06-15, column verified present; statusOfImprovements save-failure FIXED.** (types.ts regen still good-hygiene to fold into build so types match live.) The cascade-version blocker is cleared.
   - **"Failed to sync valueScenarios to Valcre" = RESOLVED via live capture (QA, 2026-06-15). FALSE toast, 3rd cause (NOT dual-write, NOT linkage).** Live /api/valcre response on valid job 890842: `customFields:{success:1,failed:0}` (CF12414 WROTE FINE) + `nativePatchError:'Patch object cant be empty'` (Valcre 400). Cause: a cascade-only change builds an EMPTY native updateData, but the proxy fires a native PATCH anyway → Valcre rejects empty patch → `nativePatchError` set → client `syncFailed=true` (L708 includes `!!nativePatchError`) → false toast, even though the custom write succeeded. Dual-write ruled out (VALUE_SCENARIO_PREMISE_MAP dead code, confirmed). Linkage ruled out (valcreJobId reads from job_loe_details=890842, valid; the job_submissions NULL was a red herring). **FIX (held for build): in api/valcre.ts, SKIP the native PATCH when updateData has no keys (custom-field-only sync) → no empty PATCH, no false toast, custom write still lands.** (Co-arch's earlier 'probably a real broken-link failure' call was WRONG — corrected by QA's live capture.)

6b. **"Chris question" / canonical-field-home = MOOT (Ben clarified 2026-06-15). NOT a problem, dropped.** The Valcre custom fields (CF12414 "Value Scenario(s)", Valuation Premise 1/2, etc.) are **BRAND NEW + EMPTY — Chris just created them; nothing's mapped in yet.** That's why they all read empty — by design, not because one's the wrong home. There is NO pre-existing convention to discover. The code already maps valueScenarios → CF12414 and the write LANDS (verified customFields success=1) → mapping is fine; Ben's call: "map it into any of them." Do NOT research canonical home. (Co-arch's registry dig toward "Premise is canonical / 12414 suspect" was chasing a convention that doesn't exist yet — moot.) Registry-divergences #1's "Chris question" is superseded by this clarification.
   - **UX (separate):** the "stay silent when no Valcre job (testing)" popup-suppression guard doesn't cover a test job that HAS a Valcre number → popup spam in test mode.
   - **⭐ REFRAME (Ben, 2026-06-15) — do NOT blanket-suppress the toasts.** Ben WANTS a popup when a field genuinely fails to map — it's a real signal (it already caught the missing-column failure). The fix is to make the popup HONEST: fire on a genuine non-mapping/non-save, NOT on a false-negative (the 06-10 valueScenarios pattern where data landed but the toast fired). So: (a) ensure every cascade/moved field TRULY maps to Valcre (or is correctly marked not-synced), and (b) the toast only fires on a real failure. NOT "suppress in test mode."
   - **⭐ ROOT INSIGHT (Ben):** when Ben + co-arch + UI-designer rearranged the client-job-area fields, mapping-to-Valcre was NEVER the focus — it was layout work. So the Valcre mapping of the moved/cascade fields may never have been verified. → **Mapping audit needed:** does every cascade/moved field actually map (QA running it live, read-only, on the real test job now).

## Two-part address split (UI-designer spec, Ben-approved on the mock 2026-06-16)

7. **Structured address — FOUR fields (REVISED 2026-06-16, Ben): Street / City / Province / Postal**, both client + property, on dashboard Section 1 + intake + LOE. Maps 1:1 to what Valcre actually stores (`AddressStreet`/`AddressCity`/`AddressState`/`AddressPostalCode`). Spec: `SPEC-address-two-part-split.md` (rewritten to 4-field). SUPERSEDES the 2-field `…Locality` draft.
   - 6 new nullable DB cols: `client_city/province/postal_code` + `property_city/province/postal_code`; `client_address`/`property_address` become street-only. New fields `clientCity/Province/Postal` + `propertyCity/Province/Postal`.
   - **⚑ Valcre = 1:1 DIRECT MAP, DELETE `parseAddress`** (UPDATE `api/valcre.ts` ~L1010 + property ~L1179 + PropertyContact ~L1099; CREATE `webhooks/valcre.ts` ~L263/L159). This SIMPLIFIES + fixes the truncated-street bug (parser took only first comma-segment). **The earlier GAP-1 "recombine" concern is OBSOLETE** — each part is its own field/column; no recombine. Prereq: dashboard + intake must SEND all 4 fields in the Valcre payload.
   - **⚑⚑ NO-CROSS (Ben — documented past bug): CLIENT/org address → Valcre CONTACT entity ONLY; PROPERTY address → PROPERTY entity ONLY. Never let one fall back to the other** (prior bug: contact got the property address). When deleting parseAddress, don't cross. QA acceptance uses a DIFFERENT client vs property address on the test job so a swap is visible.
   - **LOE mapper:** contact block — `[ClientAddressLocality]` COMPOSED = `"{city}, {province}  {postal}"`; empty-suppress the line + `<br/>` if all 3 empty (GAP-2 still applies, both addresses). Property field `[PropertyAddress]` = recombined full string for display.
   - **⚑ FILE-OVERLAP — ONE coordinated builder:** touches `ClientSubmissionSection.tsx`, `generateLOE.ts`, LOE template, contact block, `api/valcre.ts`, `webhooks/valcre.ts` — same files as the editor + cascade-sync work. One assembly prompt, not a second builder.
   - **Status (2026-06-16):** spec FULL PASS. **OWNERSHIP SPLIT (Ben):** ui-designer owns the FRONT-END + DB hands-on — `ClientSubmissionSection.tsx`, `SubmissionForm.tsx`, LOE template + `generateLOE.ts` mapper, the 6 DB cols (editing now). co-arch/react-spec own ONLY the **Valcre 1:1 rewire** (`api/valcre.ts` parseAddress deletion + `webhooks/valcre.ts`), to run AFTER the front-end+DB land (ui-designer pings). **⚑ The Valcre rewire MUST pull main first** — QA committed an `approachesToValue` alias fix to `api/valcre.ts` (cascade short-names → CF12415 '...Approach' forms; silent-no-write fix) that must not be clobbered. (A co-arch address fork was dispatched + immediately killed pre-edit when this split landed — zero edits, no collision.)
   - **⚑ OPEN DECISION → Ben (still open):** `[JobName]` label = `propertyName, propertyAddress(street-only now)` → drops the city from the job-name LABEL ("Westside Mall, 2129 Broadway Court, Calgary, AB" → "…Broadway Court"). Keep city in the name (recombine for the label) vs leave street-only. Co-arch lean = keep city. Awaiting Ben.

## ⭐ CASCADE-SYNC FIX SET (for the build — LIVE-PROVEN end-to-end on ref job VAL261101, QA + Ben driving, 2026-06-15)

The cascade→Valcre work is fully diagnosed to the line. Four pieces:
- **(a0) Client-side toast-verdict fix — ✅ DONE NOW (QA, committed to main, NO push, deploy-gated; live via HMR).** `LoeQuoteSection.tsx` syncFailed verdict (~L704-711): an empty-native-PATCH ('Patch object cant be empty') no longer counts as failure (custom-only sync; `customFields.failed===0` = write landed). Only a REAL native rejection / custom-write fail / readback mismatch trips the toast. Unblocks Ben's local testing immediately — popup is accurate NOW. **⚑ BUILDER: PRESERVE this client verdict edit when touching LoeQuoteSection — do NOT regen over it.**
- **(a) Empty-native-PATCH skip (SERVER) — ⛔ LOAD-BEARING, TOP PRIORITY, BLOCKS REAL DATA (elevated by QA 2026-06-15 — NOT cosmetic).** In `api/valcre.ts`, SKIP the native PATCH when `updateData` has no keys → go straight to `setValtaCustomFields`. **Why it's load-bearing:** when a sync touches ONLY custom fields (valueScenarios, statusOfImprovements, valueTimeframe — none native), `updateData` is empty → proxy fires an empty native PATCH → when Valcre HARD-rejects it, the proxy BAILS to the error branch and NEVER runs `setValtaCustomFields` (`customFields:null`) → **the custom fields DON'T WRITE AT ALL.** Proven live: a valueScenarios-only call that earlier returned `success:true, customFields:{success:1}` now returns `success:false, customFields:null` (Valcre's empty-PATCH response degraded from 200-with-error to hard-fail). So custom-only syncs can SILENTLY FAIL TO SAVE to Valcre until this lands. Needs deploy. *(builder makes this live-Valcre proxy edit — NOT QA, blast radius.)*
- **(b) Wire Status of Improvements (+ Value Timeframe) to sync — ✅ DONE client-side (QA, committed main).** Added `statusOfImprovements` + `valueTimeframe` to `VALCRE_SYNC_FIELDS` + `syncData` (the never-wired single-value fields). **They send now but WON'T reliably land until the (a) server empty-PATCH fix deploys** (they're custom-only → hit the empty-PATCH bail).
- **⚑ VERIFICATION CONSTRAINT (QA, 2026-06-15):** QA is OFF the live Valcre — too many mutating test calls degraded it (now hard-failing even previously-good calls; rate-limit/degraded). **Further cascade-sync verification = via the dashboard UI (Ben) or POST-DEPLOY, NOT QA API calls.**
- **Second batch still OPEN (cascade fields not yet resolved):** Approaches to Value (multi-select), Tenancy/Subtype (mirror; `propertySubtype` MISSING from `VALTA_CUSTOM_FIELD_IDS`), Property Rights (native Purposes REAL failure — items f/g).
- **(c) Supabase column** — ✅ DONE live (the migration QA ran).
- **(d) Dashboard-display fix** — surface the cascade-derived state on the live dashboard.
- **(e) Sync-reassurance UX (Ben flagged — soft regression, low-priority polish, not blocking).** Pattern = popup ONLY on real failure (done, a0) + spinner/✓ = success reassurance. Gap: `LoeQuoteSection` (Section 2) has per-field `fieldStates`→'synced/saved/sync-failed' via `CompactField status=`, but `ClientSubmissionSection` (Section 1 — Property Type/Subtype/Tenancy) has NO fieldStates + no `status=` prop → only the section spinner, no per-field 'synced ✓'. Ben felt the reassurance was gone testing Section 1. FIX: give Section 1 the same per-field synced indicator (add `fieldStates` + `status=` on its CompactFields) + ensure the subtle in-flight spinner reliably shows. So no-popup reads as success, not silence.
- **⚑ DEPENDENCY: (a) + (b) MUST land together.** (b) alone (wiring statusOfImprovements) would ALSO trip the empty-PATCH false popup, so the skip-empty-PATCH fix must ship with it.

PROVEN: Value Scenarios sync WORKS (dashboard change → Valcre "Value Scenario(s)" updated); the "Failed to sync" popup = false alarm (empty-PATCH 400, data lands).

**⚑ TWO DISTINCT cascade-sync popups — do NOT lump them:**
- **Value Scenarios popup = FALSE alarm** (empty-native-PATCH). FIXED client-side (a0); root cleanup (a).
- **Property Rights popup = REAL failure** (reclassified by QA via live capture on 890842, 2026-06-15 — was twice nearly mis-called false; verify-before-mute caught it). POST with `propertyRightsAppraised` → `success:false, 'Failed to update job', updateData:{Purposes:'LeasedFee'}`. The native `Purposes` PATCH GENUINELY FAILS even though registry says Purposes is single-enum and 'LeasedFee' is a valid member with correct format. NOT a mute — needs a real fix:
  - **(f) Surface the swallowed proxy error** — `api/valcre.ts` currently eats Valcre's native-PATCH error (`details:''`), so we can't see WHY Purposes is rejected. Make the proxy return Valcre's real error. (Diagnostic prerequisite.)
  - **(g) Fix the actual Purposes update failure** — once (f) reveals the real reason, fix the native Purposes PATCH so Property Rights syncs.

## Banked for later (non-blocking, not in the current build)

- **Race-condition false-✓ on rapid same-field changes (QA found live on 890842, 2026-06-16).** Rapidly toggling a synced field (e.g. tenancy Multi-Tenant→other→Multi-Tenant) fires multiple async `sendToValcre` for the re-derived field (Part E, `LoeQuoteSection` L801-813); they resolve OUT OF ORDER → an intermediate value lands LAST in Valcre while React state + the 'synced ✓' show the FINAL value (the ✓ = "last call returned 200", not "Valcre holds the current value"). The honest-indicator violation we've been killing. **NOT urgent** — normal one-change-at-a-time syncs fine; only rapid same-field toggling triggers it. Likely affects ANY rapidly-changed synced field (spec field-generic). **FIX direction (co-arch): latest-wins per-field sync queue** — each field holds one pending value; a newer change SUPERSEDES the pending (intermediate values never fire); a single in-flight worker per field awaits the prior call then sends the latest-pending if changed. Converges Valcre to the final value + fewer calls (Valcre degraded) + honest ✓. NOT readback-before-green (too many Valcre calls). QA speccing it → gate → build as a FOLLOW-UP after the address work closes.

- **Generic swallowed-native-PATCH error surfacing** (`api/valcre.ts`) — dropped from this build because its original driver (Property Rights native-Purposes failure) is moot (Property Rights → CF12412). But it has a SECOND value QA flagged: readable errors if a REAL (non-empty) native PATCH ever fails. Bank as a future diagnostic nicety — surface Valcre's native error instead of `details:''`. Not this build.

## Parked (non-blocking, Ben deciding)

- **Address city-line break** — address prints on one line (single combined `[client.addressstreet]` field). Break at the city to match VALTA letterhead: (a) split at display, or (b) separate street/city fields on the record. Ben to pick. Does NOT gate.

## Build rules — apply to WHATEVER persona builds (QA carry-forward, 2026-06-15)

- **SELF-VERIFY AS ANON (load-bearing):** the builder's self-verify must run AS the **anon app identity through the running app (port 8086)** — NOT service-role/console. This is the exact PRD-LOE-01 silent-RLS trap; a not-anon self-check false-passes while anon persists nothing. Bake into the final proof section.
- **Worker doctrine:** no `AskUserQuestion` / multi-choice menus — pick + report "Picked Option N, Reason"; emit plain `STUCK:` if blocked, so the fork can't block its pane or dump a menu.

## Persona / work-split — Ben's call (2026-06-15)

Ben is SPLITTING the work:
- **UI-designer owns the mapping / mock** (the field→Valcre mapping audit, mock-dashboard cascade work, editor/HTML-structure side).
- **QA owns popup accuracy** (toast verdicts — already did the client-side verdict fix).
- **Builder (forked) makes the live-Valcre proxy edits** (api/valcre.ts: empty-PATCH skip, error-surfacing, Purposes fix) — NOT QA, blast radius.
- Open: which persona the forked builder switches to for the editor build (contact-block lock + cascade-versions + the proxy edits). Leaning the editor-capable persona; confirm with Ben before finalizing the Assembly Prompt.

---

*Collecting. Rebuild the Assembly Prompt from this when Ben says the list is complete + names the persona → QA prompt-gate (mode-2) → deploy.*
