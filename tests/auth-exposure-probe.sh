#!/usr/bin/env bash
# auth-exposure-probe.sh — the negative acceptance test for the Login + Roles work.
#
# WHAT IT ASKS: with the key that ships to every visitor, and NO login session, what will the
# database and the server functions hand over?
#
# WHY IT EXISTS NOW, BEFORE THE FIX (this is the whole point — read it):
#   A test written AFTER a fix cannot be distinguished from a test that is broken. Both come back
#   green. The only moment you can PROVE a security test can see is while the hole is still open,
#   because that is the only moment you know what the true answer is.
#   Today the true answer is EXPOSED. So today this probe must report EXPOSED — and if it does not,
#   the probe is broken and we throw it away rather than trust it later.
#   Run it now, watch it go red, and keep it. When the fix lands, the same unchanged script must go
#   green. A green from a script that was never seen to go red proves nothing at all.
#
# CONTROLS (a check without one is not a check):
#   NEGATIVE CONTROL — a table that cannot exist MUST error. If it "succeeds", the probe is blind.
#   POSITIVE CONTROL — the public intake form MUST still work after the fix. A total lockout is not
#                      a pass; it is a different outage. If this goes red, we broke the client's
#                      ability to submit an appraisal request.
#   STALE-KEY GUARD  — a rotated key and a locked-down database look IDENTICAL from outside: both
#                      just say no. This probe reads the key from the SHIPPED BUNDLE, never from a
#                      local .env, and refuses to run if the key is rejected — because "invalid key"
#                      would otherwise read as "we're secure", which is the most dangerous way for a
#                      security test to fail.
#
# READ-ONLY. Never writes, never deletes, never mutates. Safe to run against production.
#
# Usage:  bash tests/auth-exposure-probe.sh
# Exit:   0 = all client data DENIED (the goal)   1 = data EXPOSED   2 = the probe itself is blind

set -uo pipefail
cd "$(dirname "$0")/.." || exit 2

URL="https://ngovnamnjmexdpjtcnky.supabase.co"
PASS=0; FAIL=0; BLIND=0; SKIP=0
ok(){   printf '  \033[32mDENIED  \033[0m %s\n' "$1"; PASS=$((PASS+1)); }
bad(){  printf '  \033[31mEXPOSED \033[0m %s — %s\n' "$1" "$2"; FAIL=$((FAIL+1)); }
# BLIND = the INSTRUMENT is broken; the whole result is void.
blind(){ printf '  \033[33mBLIND   \033[0m %s — %s\n' "$1" "$2"; BLIND=$((BLIND+1)); }
# UNTESTABLE = the TARGET cannot be reached (e.g. not deployed). Not a blind instrument, and it
# must NOT void the run — but it must be LOUD, because an untested surface silently counted as
# "fine" is exactly how a hole survives an audit. It is neither a pass nor a fail: it is a gap.
skip(){ printf '  \033[33mUNTESTED\033[0m %s — %s\n' "$1" "$2"; SKIP=$((SKIP+1)); }

# ---------------------------------------------------------------- the key that ships to visitors
BUNDLE=$(ls -t dist/assets/index-*.js 2>/dev/null | head -1)
if [[ -z "$BUNDLE" ]]; then
  echo "No build found. Run: npm run build -- --mode v4shoot"
  echo "The probe deliberately refuses to fall back to a local .env key — that is not what visitors get."
  exit 2
fi
KEY=$(grep -hoE 'eyJ[A-Za-z0-9._-]{100,}' "$BUNDLE" | head -1)
echo "Key source: $BUNDLE (the bundle every visitor downloads), ${#KEY} chars"
echo

q(){ curl -s "$URL/rest/v1/$1" -H "apikey: $KEY" -H "Authorization: Bearer $KEY"; }

# ---------------------------------------------------------------- STEP 1: prove the probe can see
echo "STEP 1 — CONTROLS. Prove this probe can tell allowed from denied, before trusting a word of it."

CTL=$(q "zzz_definitely_not_a_table?select=id&limit=1")
if [[ "$CTL" == *"does not exist"* ]]; then
  echo "  ok       negative control: a non-existent table correctly errors — the probe can detect a failure"
else
  blind "negative control" "a non-existent table did NOT error. Response: ${CTL:0:80}"
fi

LIVE=$(q "client_profiles?select=id&limit=1")
if [[ "$LIVE" == *"Invalid API key"* ]]; then
  blind "stale-key guard" "the SHIPPED key was rejected. A rotated key and a locked database look identical from here. STOP — do not read this as 'secure'."
fi

if (( BLIND > 0 )); then
  echo
  echo "PROBE IS BLIND. It cannot distinguish denied from broken. Result is void — fix the probe, do not trust it."
  exit 2
fi
echo "  ok       the probe can see. Proceeding."
echo

# ---------------------------------------------------------------- STEP 2: the client's data
echo "STEP 2 — CLIENT DATA. With no session, does the database hand it over?"
for t in client_profiles job_submissions job_loe_details job_property_info job_files; do
  R=$(q "$t?select=id&limit=1")
  case "$R" in
    "[]")               ok "$t (empty — no rows leaked)" ;;
    \[*)                bad "$t" "returned real rows to an anonymous caller" ;;
    *"permission denied"*|*"JWT"*|*"row-level security"*) ok "$t" ;;
    *)                  blind "$t" "unrecognised response: ${R:0:60}" ;;
  esac
done
echo

# ---------------------------------------------------------------- STEP 3: the server functions
echo "STEP 3 — SERVER FUNCTIONS. Will they act for an anonymous caller?"
for fn in job-folder-docs create-valcre-job create-clickup-task docuseal-proxy; do
  R=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$URL/functions/v1/$fn" \
        -H "apikey: $KEY" -H "Authorization: Bearer $KEY" \
        -H 'Content-Type: application/json' -d '{}' 2>/dev/null)
  case "$R" in
    401|403) ok "$fn (rejected the anonymous caller: HTTP $R)" ;;
    404)     skip "$fn" "not deployed — this surface has NOT been tested. It is a gap, not a pass." ;;
    *)       bad "$fn" "accepted an anonymous caller and answered (HTTP $R) instead of rejecting it" ;;
  esac
done
echo

# ---------------------------------------------------------------- STEP 4: don't break the client
echo "STEP 4 — POSITIVE CONTROL. The public intake form MUST still work. A total lockout is not a pass."
R=$(curl -s -o /dev/null -w '%{http_code}' -X OPTIONS "$URL/rest/v1/job_submissions" -H "apikey: $KEY")
if [[ "$R" == 2* || "$R" == 4* ]]; then
  echo "  ok       the intake path is reachable (HTTP $R). Re-check this by hand after the fix —"
  echo "           if a client can no longer submit an appraisal request, that is an outage, not a win."
else
  blind "intake reachability" "HTTP $R"
fi
echo

# ---------------------------------------------------------------- verdict
echo "────────────────────────────────────────────────────────────"
(( SKIP > 0 )) && echo "NOTE: $SKIP surface(s) UNTESTED (not deployed). They are neither proven open nor proven"
(( SKIP > 0 )) && echo "      closed. Do not count them as safe. Re-run once they are deployed."

if (( BLIND > 0 )); then
  # Only a STEP-1 control failure lands here — the instrument itself could not tell allowed from
  # denied. An unreachable target is a gap (SKIP), not a blind instrument, and must not void a run
  # that otherwise saw clearly.
  echo "VERDICT: PROBE BLIND ($BLIND). The instrument could not see. Result is VOID — fix the probe."
  exit 2
elif (( FAIL > 0 )); then
  echo "VERDICT: EXPOSED — $FAIL open, $PASS closed, $SKIP untested."
  echo "Anyone who opens the site can take this. This red is EXPECTED today, and it is the whole"
  echo "point: it proves the probe can see. This is the red the fix must turn green."
  exit 1
else
  echo "VERDICT: DENIED — all $PASS closed, $SKIP untested."
  echo "⚠ Only trust this green if you have SEEN this same unchanged script report EXPOSED before the"
  echo "  fix. A green from a probe never witnessed going red proves nothing whatsoever."
  exit 0
fi
