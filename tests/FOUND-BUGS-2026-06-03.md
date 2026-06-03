# Found Bugs — APR Dashboard (2026-06-03 testing session)

Running list of defects surfaced while wiring up E2E testing. Promote to the board when triaged.

| # | Bug | Severity | Where | Status |
|---|---|---|---|---|
| 1 | **Dashboard top search does nothing** — can't find a job by VAL number OR property name (e.g. "Westside Mall" / VAL261101 return nothing). Search appears non-functional entirely. | Low (workaround: scroll/find manually) | Appraisal Dashboard, top search bar | OPEN |
| 2 | **App hardcodes a DEAD ClickUp test list** — `src/utils/webhooks/clickup.ts:11` points at `901703694310` (no token can see it). The real list is `901709622357`. (Also: clickup.ts is the dead legacy client path; the live card is built by the Supabase edge functions.) | Med | `clickup.ts:11` | OPEN |
| 3 | **`valcre-verify-job.sh` $filter URL-encoding bug** — caused the exit-3 that looked like an auth failure. Auth is fine (HTTP 200). Fix the `$filter` encoding. | Low | `~/.claude/scripts/apr/valcre-verify-job.sh` | OPEN (qa root-caused) |

## Notes
- Bug 1 (search) is Ben-reported, non-critical — flagged for later fix.
- Bugs 2 & 3 are also captured in `E2E-TESTING-WORKFLOW-MASTER.md` LOCKED block.
