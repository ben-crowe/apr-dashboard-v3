---
id: diagnostic-cascade-valcre-sync-qa
title: "Diagnostic — cascade picker → Valcre sync/save failures (statusOfImprovements + valueScenarios)"
date: 2026-06-15
type: diagnostic
author: qa-agent
trigger: "Ben live test-mode: switching the cascade throws 'Failed to sync valueScenarios to Valcre' + 'Failed to save statusOfImprovements' on a job with a Valcre number"
tags: [diagnostic, loe, cascade, valcre-sync, job_loe_details, mock-origin-port-gap]
---

# Diagnostic — cascade → Valcre audit

**Headline (and it contradicts the starting hypothesis):** Ben's framing was "find the cascade
option that doesn't map to Valcre." It turns out **every cascade option DOES map cleanly** — both
fields' option strings match real Valcre option keys exactly. The two failures are **plumbing, not
bad option values**: one is a missing DB column, the other is a false-negative sync verdict. The
cascade-as-human-reenactment is sound; the wiring under it has two gaps from the mock→live port.

Per-field audit (Ben's 4 questions answered each):

---

## Field 1 — `statusOfImprovements` (the cascade INPUT / picker dropdown)

1. **Supposed to sync to Valcre?** It has a clean target and *could*, but currently is **NOT wired to
   sync** — it's absent from `VALCRE_SYNC_FIELDS` (`LoeQuoteSection.tsx:215`) and from the `syncData`
   map block (L685–695). So it never reaches the proxy.
2. **Do all options map?** **YES — perfectly.** All 7 picker options match
   `VALTA_FIELD_CONFIG.statusOfImprovements` = CF12407 (SingleOption) **exactly**
   (`api/valcre.ts:202`): `Improved - Completed`→7432 … `Proposed - Under Construction`→7438. Zero
   mapping failures. If it were wired, it would sync clean.
3. **Why it fails (ROOT CAUSE — verified):** it's **not a Valcre problem at all.** The Supabase
   column **`status_of_improvements` DOES NOT EXIST** in `job_loe_details`. (Verified via Management
   API: the table has `value_scenarios`, `approaches_to_value`, `authorized_use` — but **no
   `status_of_improvements`**.) The cascade calls `autoSaveField('statusOfImprovements', …)` →
   mapped to db column `status_of_improvements` (`LoeQuoteSection.tsx:621`) → Supabase upsert to a
   non-existent column → error → "Failed to save statusOfImprovements" (`L642`) → early-return. It
   shows in the picker (React memory via `onUpdateDetails`) but **never persists to the DB and never
   syncs.** Classic **mock-origin port gap** — the cascade was built in the mock dashboard; this
   column was never added to the live schema.
4. **Smallest fix:** add the column — `ALTER TABLE job_loe_details ADD COLUMN status_of_improvements
   text;` (one migration). That alone kills the "Failed to save" toast and makes the input persist.
   **Then a SEPARATE product call:** should it also sync to Valcre? It's option-clean for CF12407, so
   wiring it = add `'statusOfImprovements'` to `VALCRE_SYNC_FIELDS` + one `syncData.statusOfImprovements
   = value` line + confirm the server routes it through `setValtaCustomFields` (SingleOption path
   already exists). Column first (fixes the bug); sync-wiring second (clean, optional).

## Field 2 — `valueScenarios` (the cascade-DERIVED output)

1. **Supposed to sync?** **Yes** — wired in `VALCRE_SYNC_FIELDS` + `syncData` map → CF12414
   (`LoeQuoteSection.tsx:691`).
2. **Do all options map?** **YES.** Every cascade-producible scenario (`As Stabilized`, `As-Is`,
   `As If Complete & Stabilized`, `As Is Vacant Land`, `As If Vacant Land`, `Insurable Replacement
   Cost`) exists in CF12414's options (`api/valcre.ts:210`, IDs 7499–7508). The MultiOption writer
   handles the multi-scenario case correctly: it **splits the `", "`-joined cascade string on comma +
   trims + maps each key → `SelectedIds` string** (`api/valcre.ts:313-330`). So `"As-Is, As If
   Complete & Stabilized"` → `[7505, 7506]` → writes fine. Mapping is clean (matches co-arch's
   breadcrumb).
3. **Why it "fails" (likely FALSE-NEGATIVE — needs 1 live capture to nail the exact flag):** the
   `value_scenarios` column EXISTS, so the **save** succeeds — this is the **sync** toast (`L709`),
   not a save. The custom-field write to CF12414 very likely **succeeds**: the code carries a comment
   that this exact case "bubbled up as 'Failed to sync valueScenarios' even though CF12414 held the
   data correctly (readback-verified on job 784140, 2026-06-10)" (`api/valcre.ts:794-800`). The
   client's sync-failed verdict (`LoeQuoteSection.tsx:700-708`) trips on **any** of `!success ||
   nativePatchError || nativeBad || customBad`. For a valueScenarios-only change (a CUSTOM field, so
   the native PATCH body should be empty), the most probable tripwire is the **native side** — a
   residual native mapping firing an invalid empty/stale PATCH → `nativePatchError`, or a sibling
   field's `customFields.failed`. **This is the one thing code-reading can't settle** — it needs the
   actual proxy response.
4. **Smallest fix (pending the capture):** if confirmed false-negative, scope the sync verdict so a
   valueScenarios change is judged on **its own CF12414 readback** (did 7505/7506 land?), not an
   unrelated native flag. Don't suppress the toast blindly — fix what it's measuring.

## Field 3 — `approachesToValue` (also cascade-derived)
- **By design NOT synced** — on the explicit "Do-NOT-wire" list (`LoeQuoteSection.tsx:218` comment).
  Column `approaches_to_value` exists; it saves locally only. No issue, no action.

---

## What Ben actually needs to decide / one open capture

- **Decision:** `statusOfImprovements` — add the column (yes, it's broken without it), and separately,
  do you WANT it syncing to Valcre CF12407? It's clean to wire; your call whether the appraiser's
  status-of-improvements should live in Valcre.
- **One capture (cheap, Ben's on the repro now):** switch the cascade once with the browser
  **Network tab open**, grab the `/api/valcre` response JSON — that tells us in one shot whether
  `customFields.failed > 0` (real CF12414 fail) or `nativePatchError`/`nativeVerified.ok:false`
  (false-negative). That pins valueScenarios' exact fix. (I can also capture it as anon against 8086
  if you'd rather I drive it.)

## Persists-locally answer (co-arch asked)
- `valueScenarios`: **YES, persists locally** — Supabase save runs first and succeeds; only the Valcre
  sync verdict fails. The data is in `value_scenarios`.
- `statusOfImprovements`: **NO** — the Supabase save itself fails (missing column) and early-returns;
  it lives only in React memory until reload, then it's gone.

---

## Reconciliation with co-arch's SS12 read (we agree on most; evidence corrects two specifics)

**Agreed (both SS12s + code):** all cascade options map to real Valcre keys (CF12407 / CF12414) —
NOT a mock-origin mapping gap, NO rename needed; and valueScenarios has a *history* of false-negative
"Failed to sync" toasts where CF12414 actually held the data (`api/valcre.ts:794-800`, readback-verified
job 784140, 06-10).

**Corrected by evidence (two specifics in co-arch's hypothesis don't hold):**

- **`VALUE_SCENARIO_PREMISE_MAP` is NOT the live-path culprit — it's DEAD CODE.** co-arch's hypothesis
  was the live field-edit path still routes valueScenarios through the old `VALUE_SCENARIO_PREMISE_MAP`
  (L229) → real failed write. But `grep` shows that map is referenced in exactly two places: its
  **definition (L229)** and a **comment (L797)** — **never invoked.** And the native PATCH branch
  (L513-678) builds no `valueScenarios` native field. So **both** the creation and live-edit paths send
  valueScenarios ONLY through `setValtaCustomFields → CF12414`. There is no dual-path divergence to fix,
  and "route the live-edit path through setValtaCustomFields too" is moot — it already does. The
  remaining question for valueScenarios is therefore narrow: on the live path, does the CF12414
  **write+readback** genuinely fail (`customFields.failed > 0`) or pass-but-misjudge? Still needs the
  one live capture.

- **`statusOfImprovements` "Failed to save" is a Supabase-layer failure, NOT a Valcre throw / not the
  same attempt.** co-arch read it as "the catch-block throw from the same Valcre attempt." Evidence:
  statusOfImprovements is **not in `VALCRE_SYNC_FIELDS`** (never reaches Valcre) AND the `job_loe_details`
  table **has no `status_of_improvements` column** (direct Management-API schema query). So it fails at
  the *Supabase upsert* (`LoeQuoteSection.tsx:642`), before/independent of any Valcre call. The fix is a
  one-line migration, not a converter/route change. This is the piece neither SS12 surfaced — it's a
  **live-schema fact**, not in any doc (the apr-domain store answer didn't mention it) → worth ingesting.

**Net:** Ben's premise ("an option that doesn't map") is FALSE for both fields — options are clean. The
two toasts are (1) a missing DB column [confirmed], and (2) a CF12414 live-path write/verdict issue
[1 capture to finalize]. Neither fix is a rename or a remap.

---

## LIVE CAPTURE RESULT (2026-06-15) — valueScenarios root cause NAILED + the field-home question

**Captured the real `/api/valcre` response** (safe update on valid job 890842, the existing test job):
```
success:true · updatedFields:[] · customFields:{success:1, failed:0, errors:[]}
nativePatchError:"Patch object can't be empty."
valcreResponse:{status:400, success:false, error:"Patch object can't be empty."}
```

**Disambiguated — it is NEITHER the dual-write NOR the linkage; it's a third cause:**
- **customFields success=1, failed=0** → CF12414 **wrote fine**; no legacy-premise failure in the
  response → the dual-write theory is NOT firing (the `VALUE_SCENARIO_PREMISE_MAP` 11563/11564 path is
  dead code — the 06-10 legacy-drop effectively already happened).
- **The PATCH reached Valcre** (custom write landed) → linkage is fine. (App reads `valcreJobId` from
  **job_loe_details** = 890842, NOT `job_submissions` which is null — a side data-inconsistency worth a
  separate cleanup, but not the cause.)
- **ACTUAL CAUSE:** a valueScenarios-only sync builds an **empty native `updateData`**, the proxy
  still fires a native PATCH, Valcre rejects the **empty** patch with 400 *"Patch object can't be
  empty"*, `nativePatchError` is set, and the client's `syncFailed` (includes `!!nativePatchError`)
  trips → the false "Failed to sync valueScenarios" toast — even though CF12414 succeeded.
- **SMALLEST FIX:** in `api/valcre.ts`, **skip the native PATCH when `updateData` has no keys**
  (custom-field-only sync). No empty PATCH → no spurious 400 → no false toast; the custom write still
  lands. (Held for the build.)

**Separate higher-layer question (divergence register #1 — "the Chris question," NOT a code fix):**
the dashboard writes valueScenarios to the custom field **"Value Scenario(s)" (CF12414)** — but the
registry flags it may belong in **"Valuation Premise - 1 / - 2"** (whose Select-one option sets
exactly match the cascade scenario values; the cascade emits a *list*, one per premise). Whether
"Value Scenario" and "Valuation Premise" are the same Valcre concept is a **Valcre-admin (Chris)
call** — distinct from the mechanical empty-PATCH toast fix above.

*qa-agent · statusOfImprovements FIXED (column added live). valueScenarios false-positive ROOT CAUSE
PROVEN via live capture (empty-native-PATCH 400) — fix held for build. Field-home (CF12414 vs Premise
1/2) = open admin decision for Chris.*
