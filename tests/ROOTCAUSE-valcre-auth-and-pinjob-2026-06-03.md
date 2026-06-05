# Root cause — Valcre "auth exit-3" + pin-job existence

**By:** qa-agent · 2026-06-03 · read-only diagnostics, no writes, no brute-force
**TL;DR:** Auth is NOT broken. The exit-3 is a script bug (unencoded OData URL). And the real news: **VAL261029 does not exist on the Valcre side.**

## 1. valcre-auth.sh — WORKING, not the cause
Ran it directly: exit 0, returns a valid JWT. Raw auth endpoint = **HTTP 200** with `access_token`, `refresh_token`, `scope`, `expires_in`. Chris's credentials are valid and current. The earlier exit-3 had nothing to do with auth.

## 2. Real cause of exit-3 — a bug in valcre-verify-job.sh
The script builds the OData query URL with **unencoded spaces**:
`.../Jobs?$filter=Number eq 'VAL261029'&$expand=Property`
The raw spaces in `Number eq '…'` aren't percent-encoded, so the request mishandles → response isn't the expected JSON → the `COUNT` parse fails under `set -euo pipefail` → script aborts with exit 3 **instead of** cleanly printing "No job found / exit 1". So exit-3 = silent parse failure, not auth, not a clean not-found.
**Fix (route to apr-domain):** URL-encode the `$filter` value (space→`%20`, `'`→`%27`) in `valcre-verify-job.sh`. Low effort.

## 3. Substantive finding — VAL261029 is NOT in Valcre
Using a clean URL-encoded probe (bypassing the buggy script): **HTTP 200, job count 0** for `Number eq 'VAL261029'`. Format verified against live recent Valcre jobs (VAL261047–VAL261052 all present, status "Lead"), so the filter works and VAL261029's absence is real — it was either deleted or never pushed to Valcre.

- VAL261029 IS in our Supabase (`job_submissions`, status `submitted`).
- It is NOT in Valcre.
- So this submission has no Valcre job behind it.

## 4. Implication for the pin (Ben / apr-domain decision)
The "modify-not-create, don't spawn junk VAL numbers" guardrail assumed the pin job already exists in Valcre. It doesn't. With VAL261029 as the pin, the Valcre-create phase would **CREATE** a new job (the exact thing we wanted to avoid), not modify an existing one. Options:
- **(a)** Accept that the test flow includes one real Valcre create per run (litters one VAL number), then prune in the Valcre UI.
- **(b)** Pin a job that already exists in Valcre — but the live ones (VAL261047–52) are real client "Lead" jobs; modifying those is riskier than creating a disposable test job.
- **(c)** Get a real Valcre sandbox (cleanest, but blocks until provisioned).

**Recommendation:** Ben/apr-domain call. My read: option (a) with a clearly-named disposable test job is the pragmatic path, but that reframes the guardrail from "never create" to "create one, prune after." Do NOT brute-force prod.

## Hand-offs
- Fix `valcre-verify-job.sh` URL-encoding → apr-domain.
- Decide pin-job strategy (a/b/c above) → Ben + apr-domain.
- Note: Supabase and Valcre job-number sets are largely disjoint (Supabase: VAL261029/261028/261101/251031; Valcre recent: VAL261047–52) — worth a separate look at whether intake VAL numbers track Valcre at all.
