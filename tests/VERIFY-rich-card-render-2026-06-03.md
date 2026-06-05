# Verify — rich ClickUp card (Stage-1) — CLOSED ✅

**By:** qa-agent · 2026-06-03 · test list **901706896375** ("New Submission")
**Final status:** ✅ **PASS — deployed function creates the rich card live.** Rich-card task CLOSED.

## Final re-verify (after react-spec's token fix + redeploy)
Invoked the DEPLOYED `create-clickup-task` function (`POST /functions/v1/create-clickup-task {jobId:7001c13e}`):
- **HTTP 200, success — no 401.** The token fix worked.
- Created card **`86e1q4kmh`** → https://app.clickup.com/t/86e1q4kmh
- Name: "PENDING - Northgate Center, 5713 Mountain Circle"
- **List: 901706896375** (the test list — correct, no prod/Chris touch)
- Status: to do

### Sections — 9/9 ✓
NEW APPRAISAL REQUEST · VALCRE JOB NUMBER · RECEIVED DATE · ▸ LOE Sent · ▸ LOE Signed · CLIENT INFORMATION · PROPERTY INFORMATION · PROPERTY CONTACT · CLIENT COMMENTS — all present.

### Field values — all ✓
Sarah Harris · Quantum Holdings · Northgate Center · 5713 Mountain Circle · Retail · Litigation · Poor · Market Rent · Joseph Miller · (403) 493-8470 — all render in the correct sections.

## History (resolved)
1. First invoke: `401 Token invalid` — stale hardcoded fallback `pk_10791838_TPNA2KDR…`.
2. Render proven correct via the function's exact template (interim).
3. react-spec set the valid `CLICKUP_API_TOKEN` secret + dropped the stale fallback + redeployed.
4. This re-verify: deployed function creates the rich card live. ✅

## Cleanup
- Deleted the interim manual render-check card `86e1q4ga4` (HTTP 204) to avoid a duplicate Northgate card on the test list.
- Kept `86e1q4kmh` as the authoritative function-created evidence.

## Scope honored
CREATE stage only, test list 901706896375 only. update-clickup-task + docuseal-webhook (still pointed at Chris/prod) were NOT triggered.

## Verdict
Rich card builder is **fully restored and live** on the deployed create-clickup-task function. Submitting/creating a job now produces the full Summit Tower-format card on the test list. **Rich-card task closed.**
