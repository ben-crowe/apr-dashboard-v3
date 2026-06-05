# DEFECT — ClickUp test-mode writes to a dead list

**Found:** 2026-06-03 · **By:** qa-agent · **Severity:** HIGH (blocks any ClickUp test-mode E2E phase)
**Status:** OPEN · **Fix owner:** apr-domain-agent / react-specialist (NOT qa — do not fix mid-inventory)

## Defect
`src/utils/webhooks/clickup.ts:11` hardcodes the test-mode ClickUp list ID as **`901703694310`** ("Automation Team Board"). That list is **not reachable** by the BC test token (team 8555561) — it does not appear in ANY space/folder/list the token can see. It has been deleted, archived, or moved. So in test mode the app creates tasks against a dead list (writes nowhere / errors).

## Evidence (read-only, ClickUp API)
- Full workspace-hierarchy traversal 2026-06-03 with BC test token (team 8555561): `901703694310` **absent** from every space/folder/list.
- Canonical live test list **`901709622357`** ("APR Test - Valta Mirror") **present** under SPACE "APR Testing" > FOLDER "APR Test Lists", 27 custom fields, reachable.

## Fix
Update the hardcoded test list ID at `clickup.ts:11` from `901703694310` → **`901709622357`** (locked canonical test list).
Prod list `901402094744` (Chris) unchanged — that is where the create-task script's field mapping ("49 fields") is sourced.

## Related cleanup (recommend to Ben)
Three duplicate "APR Test - Valta Mirror" lists exist from past churn — pick one canonical, archive the other two:
- `901709622357` — APR Testing space — **KEEP (canonical)**
- `901709621852` — My Stuff > LOE Workflow — archive
- `901709621790` — Dev.Projects — archive

## Related flag (separate defect)
`valcre-verify-job.sh VAL261003` exited 3 (auth/parse failure, not a clean not-found) — `valcre-auth.sh` may be broken. Flag to apr-domain as a blocker for any Valcre phase.
