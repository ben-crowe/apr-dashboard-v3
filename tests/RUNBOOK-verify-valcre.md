# RUNBOOK — Verify Valcre Wiring (the link target + re-runnable procedure)

> **What this is.** The single go-to file behind every Valcre "wired" mark. It proves HOW each field was verified, WHEN it was last run, and IS the procedure to run it again. A green status links here; click it and you see the method, the date, and the exact CLI. Re-running it = run this top to bottom and update the stamp. This is the TEMPLATE — ClickUp / Intake / LOE runbooks follow the same mold.

---

## ⏱ Last verification stamp  ← update this block every run

| | |
|---|---|
| **Last run** | 2026-06-04 (inherited from source reports — NOT a fresh run) |
| **Verifier** | qa-agent (dev-2) |
| **Method** | live Valcre API readback (GetValues / Jobs GET) — never trusting HTTP 200 |
| **Test job** | VAL261101 — Westside Mall, 2129 Broadway Court, Calgary · Valcre Id **784140** |
| **Expires** | 14 days after Last run → then status reverts to "unverified — re-check" |
| **Result** | see scorecard below |

> First real run on this runbook will replace the inherited date with a genuine one.

---

## Model

Binary, manage-by-exception. A field is **wired** only if its readback matches the expected value. Anything that doesn't fully land = **not wired** (no "partial"). Only the not-wired rows get highlighted on the fold-out.

---

## Step 0 — Auth (get a bearer token)

Credentials live in `api/valcre.ts` (and Vercel env `VALCRE_*`). **Do not paste the password into this file** — source it from env so this runbook never carries the secret.

```bash
TOKEN=$(curl -s -X POST https://auth.valcre.com/oauth/token \
  -H 'Content-Type: application/json' \
  -d "{\"grant_type\":\"password\",
       \"client_id\":\"$VALCRE_CLIENT_ID\",
       \"client_secret\":\"$VALCRE_CLIENT_SECRET\",
       \"username\":\"$VALCRE_USERNAME\",
       \"password\":\"$VALCRE_PASSWORD\",
       \"scope\":\"offline_access\",
       \"audience\":\"https://valcre.api.com\"}" | python3 -c "import sys,json;print(json.load(sys.stdin)['access_token'])")
echo "${TOKEN:0:12}…  (token acquired)"
JOB=784140
```

## Step 0.5 — Name-match guard (MANDATORY before trusting any readback)

```bash
curl -s "https://api-core.valcre.com/api/v1/Jobs($JOB)?\$select=Number,Name" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
# EXPECT: Number "VAL261101", Name contains "Westside Mall, 2129 Broadway Court".
# If it doesn't match → STOP. You're reading the wrong job.
```

---

## Step 1 — Native fields (one GET, $select all)

```bash
curl -s "https://api-core.valcre.com/api/v1/Jobs($JOB)?\$select=Purposes,IntendedUses,ReportFormat,AnalysisLevel,BidDate,AwardDate,EffectiveDate,DueDate,Fee,Retainer,Status" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```

| Dashboard field | Valcre key | Expected (last good) | Pass = |
|---|---|---|---|
| Property Rights | Purposes | `FeeSimple` (first-value rule) | matches |
| Authorized Use | IntendedUses | `FinancialReporting` | matches |
| Report Format | ReportFormat | `RestrictedAppraisal` | matches |
| Request Date | BidDate | `2026-03-15` | matches |
| Signed Date | AwardDate | `2026-03-20` | matches |
| Effective Date | EffectiveDate | `2026-04-01` | matches |
| Delivery / Due Date | DueDate | (job's set due date) | non-null, matches dashboard |
| Appraisal Fee | Fee | (job's set fee) | matches dashboard |
| Retainer Amount | Retainer | (job's set retainer) | matches dashboard |
| Job Status | Status | (job's set status) | matches dashboard |
| **Analysis Level** | AnalysisLevel | only `Detailed` reconciles | **NOT WIRED** — options are mis-mapped Report-Format values |

## Step 2 — Custom fields (GetValues, type=6 = Job)

```bash
curl -s "https://api-core.valcre.com/api/v1/CustomFields/GetValues?entityId=$JOB&type=6" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
# Returns field-definition entries keyed by Id (= custom-field id). Match by Id below.
```

| Dashboard field | CF Id | Expected (last good) | Pass = |
|---|---|---|---|
| Zoning Status | 12054 | `Legal Conforming` | matches |
| Value Scenario 1 | 11563 | `As Is` | matches |
| Value Scenario 2 | 11564 | `As Stabilized` | matches |
| **Transaction Status** | 12053 | only Valcre's own labels land | **NOT WIRED** — "Listed" etc. don't reconcile, silent no-write |

---

## Known NOT-WIRED on Valcre (the exceptions — expect these to fail)

These are confirmed exceptions; they should surface highlighted on the fold-out, not as surprises here. Full list: [notwired.md](~/Development/APR-Dashboard-v3/tests/notwired.md).

| Field | How it fails |
|---|---|
| Scope of Work | sent on create → lands `Scopes:"None"` (not in create payload) |
| Valuation Premises | sent on create → lands `RequestedValues:"None"` (not in create payload) |
| Transaction Status | dashboard option labels don't reconcile with CF12053 values |
| Analysis Level | options are mis-mapped Report-Format values, not AnalysisLevel enums |
| Client Title | field-name mapping bug → fallback "Client" |
| Client Address | client contact gets PROPERTY address (mapping bug) |

---

## Step 3 — Agent harness (the "run the manual" automation)

Point an agent at this file with: *"Execute RUNBOOK-verify-valcre.md. Run Step 0 → 2, compare each readback to Expected, mark pass/fail per field, then rewrite the Last-verification stamp block with today's date, your name, and the result. Highlight only failures."*

- Each call is read-only (Step 1–2 are GETs) — safe to run any time, no job mutation.
- Pass/fail is mechanical: readback == Expected.
- The agent updates the ⏱ stamp at top — that's what bumps the date the fold-out reads.

### Round-trip (heavier) test — when a quick read isn't enough

The read-only check above proves the value is *currently* correct. To prove the WRITE PATH still works, do a round-trip: write a known value (PATCH native / `UpdateSelectFieldValue` custom) → readback → restore. That's the PRD-A method; reserve it for when wiring is suspected broken, since it mutates the live test job.

---

**Last reviewed:** 2026-06-09 by qa-agent — authored as the template runbook (Valcre). ClickUp / Intake / LOE runbooks to follow the same shape. The inherited 2026-06-04 stamp will be replaced on first real execution.
