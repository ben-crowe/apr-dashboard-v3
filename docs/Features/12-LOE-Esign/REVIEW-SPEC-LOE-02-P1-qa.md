---
id: review-spec-loe-02-p1-qa
title: "review-gate (SPEC mode) — Part-1 Cascade Versions spec"
date: 2026-06-15
type: spec-review
reviewer: qa-agent
gate: review-gate / spec-review (7 lenses)
target: ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/SPEC-APR-LOE-02-P1-cascade-versions.md
verdict: "RE-REVIEW (rev 2) — Part B PASS (all 6 gaps closed); Part A REVISE (1 contradiction + 1 guardrail + 1 minor)"
tags: [review-gate, spec-review, loe, cascade-versions, job-contracts, contact-block-lock, build-spec]
---

## ✅ RE-REVIEW (rev 2, 2026-06-15)

Re-ran spec-mode on revision 2, checking each closure against its **original** hole (not co-arch's
summary). **Part B (cascade crux): PASS — all 6 close cleanly.** **Part A (new contact-block lock):
REVISE — the lock fights the reopen behavior for existing drafts.**

### Part B — gap closures verified (all 6 land)

1. **Divergence table / verbatim enum keys** ✓ — table now uses exact `STATUS_TO_SCENARIOS` keys with
   an explicit **"Collapses with"** column. The original contradiction is resolved: `Improved -
   Renovated` and `Improved - Under Renovation` ARE two different keys (Renovated collapses with
   Completed → `As Stabilized`; Under Renovation → `As-Is + As If Complete`). The `As Is Vacant Land`
   (v3) ≠ `As If Vacant Land` (v4) near-name trap is called out. v1–v4 confirmed-distinct.
2. **Reopen proof** ✓ — proof step 5 added (click version → editor loads THAT row's `edited_html`,
   match a known Section-10 string), backed by the `LOEPreviewModal:91` "show exactly what was saved"
   ground truth.
3. **Saved-versions surface** ✓ — CONFIRMED with citation: `LoeQuoteSection.tsx:155` →
   `loadJobContracts(job.id)` → `from('job_contracts')`. No assumption, no new wiring.
4. **Authorized Use input** ✓ — resolved honestly: it's NOT in the picker, it's on Client Intake;
   picker surfaces only Status. v5 demoted to optional bonus, and **the 4 Status rows alone prove the
   crux** — so the crux no longer depends on an unconfirmed input. Good de-risking.
5. **Per-version label** ✓ — build scope 3 sets a distinguishing label via `template_version`.
6. **Save-failure surfaces** ✓ — build scope 4 + fence F require the caller to surface a failed
   insert, not report success on a no-op.

Bonus: rev 2 sharpened the **overwrite trap** ground truth (first Save Draft captures the returned id
→ second Save Draft UPDATES; new version = fresh `Create Contract`). The proof procedure matches it.
Part B is **builder-ready.**

---

### Part A — contact-block lock: REVISE (new section, gated fresh)

The fix (lock read-only, render from client record, click → contact record, no toggle) is the right
call and the scope fence (contact block only) is clean. But three holes:

#### A1. CLOSED by the confirmed root cause (was: lock-vs-frozen-html contradiction) — `ground-truth`
- **Was:** I flagged that "no saved draft can show a run-on" could collide with reopen's "show exactly
  what was saved" (frozen `edited_html`).
- **Resolved:** co-arch code-traced the actual cause — `templateParser.ts` runs `stripHTMLTags()` when
  building the **editable** fields, which collapses the contact block's multi-line `<div>`
  (`company-line`/`address-line`) → run-on. It fires **only on entering edit mode**, NOT at
  render/preview (Ben's repro: fresh LOE previews correctly, flattens the instant Edit is pressed).
  The fix — **exclude the contact block from the editable-sections parse so it never hits
  `stripHTMLTags`** — cures the mechanism end-to-end: it stays structured in edit mode → a save
  captures structured html → nothing run-on persists going forward. This is the exact cure, and it
  answers my open "every LOE or only saved ones?" question: only on entering edit mode.
- **Residual (one-line scope note, not a blocker):** the fix cures the CAUSE but doesn't retro-heal a
  draft that was *already saved while flattened* (its frozen html keeps the run-on). On the test job
  that's a non-issue (recreate the drafts). So tighten the claim: "no saved draft can show a run-on"
  is true for any draft created/edited **after** the fix — note that, or confirm the test job has no
  pre-flattened drafts.

#### A2. Click → route may discard unsaved edits elsewhere in the document — `guardrail`
- **The hole:** clicking the contact block routes away to the client contact record. If the user has
  unsaved edits in a prose paragraph elsewhere in the doc, navigating away could silently lose them.
- **Why it bites:** "I clicked the address to check it and lost the note I just typed" — a real
  data-loss path on a routine action.
- **Fix:** fence it — clicking the contact block must not silently discard unsaved document edits
  (warn / autosave / open the record without destroying editor state, e.g. new tab or guarded nav).

#### A3. Empty mapped field render is undefined — `completeness (minor)`
- **The hole:** the block renders 5 fixed lines from the record, but the client record may lack a
  field (no company, no phone).
- **Why it bites:** a missing field could render a blank line, an empty bullet, or literal
  `undefined`.
- **Fix:** specify graceful collapse — omit the line when its field is empty, never render
  `undefined`/an empty row.

---

## Verdict (updated for the confirmed root cause)

- **Part B — PASS.** Builder-ready; all 6 original gaps closed against their holes, with code
  citations and a sharpened overwrite-trap.
- **Part A — PASS, pending two small folds.** A1 is now CLOSED by the code-traced root cause (the
  `stripHTMLTags`-on-edit bug; exclude-from-parse is the exact cure) — only a one-line legacy-draft
  scope note remains. The two open items are minor and independent of the parsing fix:
  - **A2** — clicking the contact block must not silently discard unsaved document edits (route
    guardrail).
  - **A3** — empty mapped fields render gracefully (omit the line, never `undefined`).
- **Net:** the spec is essentially builder-ready. Fold A2 + A3 + the A1 scope note and it's a full
  PASS — no third structural round needed. Builder confirms the parse-exclusion lands as traced.

*qa-agent · review-gate spec-review re-review · root cause confirmed; A1 closed, A2/A3 fold → full
PASS.*
