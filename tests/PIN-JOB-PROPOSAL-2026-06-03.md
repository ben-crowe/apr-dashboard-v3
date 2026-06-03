# E2E pin-job proposal

**By:** qa-agent · 2026-06-03 · read-only cross-check (Supabase ↔ live Valcre), Valcre auth WORKING
**Proposal:** PIN = **VAL261101 (Westside Mall)** — the only job present on both sides AND still ours by name.

## Method
Pulled all 5 Supabase `job_submissions` VAL numbers, queried each against live Valcre (read-only, name-verified to catch reassignment-to-real-client per the VAL261028 finding).

## Candidates table

| VAL# | Our DB name | Valcre name | Match? | State | Verdict |
|---|---|---|---|---|---|
| **VAL261101** | Westside Mall / Evergreen Holdings | **Westside Mall, 2129 Broadway Court, Calgary, AB** | **YES — exact** | Valcre **Lead** / DB submitted | ✅ **PROPOSED PIN** |
| VAL261029 | Riverside Complex / Skyline Investments | — | not in Valcre | deleted / never pushed | ✗ deleted |
| VAL251032 | Summit Tower / Capital Ventures | — | not in Valcre | deleted / never pushed | ✗ deleted |
| VAL261028 | Southlands Plaza / Quantum Holdings | Bentley Multifamily – 13714 Bentley Road Surrey BC | **NO — reassigned to real client** | Valcre Lead | ✗ DO NOT TOUCH |
| VAL251031 | Lyric / Ayrshire Group | Barrie Townhomes 967 Big Bay Point Barrie ON | **NO — reassigned** | Valcre Lead | ✗ DO NOT TOUCH |

## Recommendation — pin VAL261101 now
- **Only job present on BOTH sides** (Supabase + Valcre) with the Valcre name **still matching** our test record (Westside Mall, 2129 Broadway Court). Exact match — not reassigned.
- **Pre-LOE:** Valcre status "Lead" (earliest stage) + DB "submitted" → safe to reset/modify, no active engagement to disturb.
- **modify-not-create works:** it already exists in Valcre, so a run modifies it rather than spawning a junk VAL number. Satisfies Ben's guardrail.
- Supabase id for the reset script: query `job_submissions WHERE job_number='VAL261101'` (id not echoed here).

## Mandatory safety rule for every run
**Re-verify the Valcre name == "Westside Mall…" at the START of each run** before any write. VAL numbers DO get reassigned to real clients (VAL261028 → Bentley, VAL251031 → Barrie both proved it). If the name has changed, ABORT and re-propose — never modify a reassigned number.

## Durable upgrade (recommend as hardening)
Because reassignment is a proven, recurring hazard, the long-term-safe pin is a **dedicated `E2E TEST — DO NOT DELETE` record** that spawns its own Valcre job and is never recycled. Proposal: use VAL261101 immediately (it qualifies today), and migrate to a dedicated test record either now (if Ben prefers max safety) or the first time VAL261101 fails the name re-verify. Either path is a Ben/apr-domain call.

## Note
3 of 5 of our test VAL numbers are gone or hijacked in Valcre — the intake VAL-number space is NOT a reliable handle for test fixtures over time. The dedicated-record approach is the real fix; VAL261101 is the best available bridge.
