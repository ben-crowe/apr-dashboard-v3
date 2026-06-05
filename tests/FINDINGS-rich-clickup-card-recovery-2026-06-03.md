# Rich ClickUp card — located + how to re-wire

**By:** qa-agent · 2026-06-03 · git-history deep search (read-only). The rich Summit Tower card builder EXISTS in history. Do not reinvent — restore it.

## Where it is
**File:** `supabase/functions/create-clickup-task/index.ts`
**Rich version commit:** **669659c** ("Update ClickUp task formatting: bold headers, YY.MM.DD dates, aligned fields") — added the full rich builder (+85 lines).
**Disconnected by:** **72ca10f** ("Match ClickUp task description format to production clickup.ts") — stripped it (−53 lines) DOWN to the current lean card. (Backwards: they matched the rich edge function *down* to the lean client-side `src/utils/webhooks/clickup.ts`, instead of upgrading the client up.)
**Last good (rich) state:** anywhere from 669659c through 72ca10f~1. Pull it with:
`git show 669659c:supabase/functions/create-clickup-task/index.ts`

## The rich builder it produces (matches Summit Tower exactly)
```
📍 NEW APPRAISAL REQUEST: [APR Dashboard](jobUrl)
📍 VALCRE JOB NUMBER:            ← blank, filled later by update-clickup-task
━━━━━━━━━━
RECEIVED DATE:  YY.MM.DD / H:MM AM/PM   ← job.created_at
  ▸ LOE Sent:                    ← blank scaffold, filled by docuseal-webhook
  ▸ LOE Signed:                  ← blank scaffold, filled by docuseal-webhook
━━━━━━━━━━
CLIENT INFORMATION
• Name / Org / Email / Phone     ← client_first/last_name, client_organization, client_email, client_phone
PROPERTY INFORMATION
• Property / Address / Type / Use / Condition / Premise
   ← property_name, property_address, property_type, intended_use, asset_condition, valuation_premises
PROPERTY CONTACT
• Name / Email / Phone           ← property_contact_first/last_name, property_contact_email, property_contact_phone
CLIENT COMMENTS
• ...                            ← notes / additionalComments
```

**This is the missing scaffold.** It creates the blank `▸ LOE Sent` / `▸ LOE Signed` tracker lines that **docuseal-webhook** later fills, and the Stage-1 block that **update-clickup-task** preserves (it keeps "everything before the first LOE section"). So restoring this ONE builder makes the whole 3-stage chain work as designed — the other functions already expect it.

## The list-ID trace (answers "New Submission list 901706896375 built by what")
- **Rich (669659c) version** pointed at `CLICKUP_LIST_ID || '901703694310'` — the now-DEAD list. So even the rich version was aimed at a list that no longer resolves.
- **Current (lean) version** is env-driven: dev default `901706896375` ("New Submission", Dev.Projects), prod `901402094744` (Chris/Valta). → **The New Submission list tasks were built by the CURRENT lean edge function in dev mode.**
- **Neither version points at Ben's canonical test list `901709622357`.**

## How to re-wire (route the code change to react-specialist / apr-domain — NOT qa)
1. **Restore the rich `description` template** (~lines 104–133 of the 669659c version) into `supabase/functions/create-clickup-task/index.ts`, replacing the current lean `description`.
2. **Point at the canonical test list:** set env `CLICKUP_LIST_ID=901709622357` (or change the dev config default `901706896375` → `901709622357`). Note: this is the same dead-list class as the app-bug in `src/utils/webhooks/clickup.ts:11` (`901703694310`) — fix both to `901709622357`.
3. **Re-deploy:** `supabase functions deploy create-clickup-task`.
4. **Pick ONE canonical builder.** Today there are two lean builders (the edge function + client-side `src/utils/webhooks/clickup.ts`). Decide whether the dashboard calls the edge function or the client path, and put the rich builder there (or restore it in both). Don't leave two divergent builders.
5. **No downstream changes needed** — update-clickup-task (Stage-2 LOE section) and docuseal-webhook (tracker fill) already expect this scaffold.

## Two-phase context-search corroboration (Phase 1 + Phase 2)
Ran the knowledge tool alongside the git search, as asked. It did NOT surface a documented "we disconnected the card on date X" narrative — **git remains the authority on the disconnect** (669659c → 72ca10f). But it corroborated the timeline and surfaced two related specs:
- **Cognee:** the rich card was "fully operational as of **January 8, 2026**" — matches the 669659c commit era. Confirms it was live, then lost.
- **Gemini fan-out (agent-checkpoints + apr-domain):** two documented specs live inside `docs/APR-MASTER-DASHBOARD.md`:
  - **"clickup-workflow-sync-spec" (Phase 1-4 roadmap)** — the custom-FIELDS integration currently fills only **~7 of 48** ClickUp custom fields; Phase 1 plans to expand to **21 fields on creation.**
  - **"dashboard-to-valcre-mapping"** — 68 fields (36 mapped, 30 not, 2 no destination).

### ⚠ Don't conflate two different "rich" things
- **(A) The markdown CARD body** (CLIENT INFORMATION / PROPERTY CONTACT / etc. — the Summit Tower *look*). This is what 669659c built and 72ca10f stripped. **Recover via the git restore above.**
- **(B) The custom FIELDS** (the 48-field production board, ~7 filled today, Phase-1-4 expansion roadmap). Separate integration, separate work — NOT the same as the card body.
The Summit Tower "rich card" people refer to is **(A)**. The "7 of 48 fields" is **(B)**. Restoring the card body (A) is the small git job; expanding custom fields (B) is the documented roadmap.

## Verdict
Rich card = **recoverable, not lost.** One commit (669659c) holds the full builder; one commit (72ca10f) removed it. Restore that template + re-point the list + re-deploy, and the Summit Tower card is back, wired into the existing Stage-2 + status-tracker chain. Effort is low (restore ~30 lines + env + deploy), risk is low (additive to a known-good prior state).
