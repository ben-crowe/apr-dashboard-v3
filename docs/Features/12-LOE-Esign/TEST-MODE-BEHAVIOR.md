---
id: test-mode-behavior
title: "How Test Mode actually works (LOE job-details) — code-confirmed reference"
date: 2026-06-15
type: behavior-reference
author: qa-agent
source: "Ben's live observations (real browser) reconciled against the code"
tags: [loe, test-mode, provenance, cascade-picker, fill-test-data, behavior-reference]
---

# Test Mode — how it actually works (code-confirmed)

Reference for the LOE job-details Test Mode, written from the code (not assumptions) and reconciled
with Ben's live observations. Each row marked **[code]** = confirmed in source; **[drift]** = the code
and its own stated intent disagree (a decision/fix).

## What Test Mode is
- A **global toggle** (`TestModeContext`) — **default OFF, not persisted** (resets on page reload).
  `src/contexts/TestModeContext.tsx`.
- It is a **visual / demo aid**, not an access gate. It changes what you SEE and a couple of
  test-only tools — it does NOT lock the actual editing controls.

## What Test Mode GATES (turns on/off) — **[code]**
1. **Field brightening / provenance colors.** Test Mode ON → the derived LOE fields tint with their
   provenance colors and the upper-section mappings show their colors. OFF → plain, no colors.
   (`LoeQuoteSection.tsx` — `testMode ? tintKey : null`.) *This is the part Ben likes — see where
   everything maps.*
2. **The "Insert from data" toggle** — only appears in Test Mode (`LoeQuoteSection.tsx:1586`).
3. **The "Clear" and "Fill with Test Data" links** (top-right) — only appear in Test Mode
   (`JobDetailAccordion.tsx:169`). So outside Test Mode you never even see them. *(Confirms Ben.)*

## The Clear / Fill guardrail — **[code]** (Ben's reasoning was exactly right)
- "Clear" and "Fill with Test Data" are **additionally disabled when the job is connected to a live
  Valcre job** (`isLiveValcreJob` = valid Valcre number + `valcreJobId`). They grey out
  (`opacity-50`, `cursor-not-allowed`) with the tooltip *"Not available — this job is connected to a
  live Valcre job."* (`JobDetailAccordion.tsx:172-190`).
- **Why (and it matches Ben's read):** once a job has a Valcre number, you're testing real
  sync — wiping all data would destroy what you're testing and you'd lose track of what you changed.
  So Clear locks on purpose. Without a Valcre number you CAN fill/clear/play freely; the moment the
  Valcre number lands, Clear locks. Sensible, working as intended.

## What Test Mode does NOT gate (and Ben's "head-spinny" note)
4. **The cascade picker is NOT gated by Test Mode — [code].** There is no `disabled` tied to
   `testMode` on the cascade / version picker (`LoeQuoteSectionIndependent.tsx`). It is **always
   usable**, Test Mode on or off. *(Confirms Ben's observation that the picker works either way.)*
   - **Ben's resolved reasoning (captured):** this is arguably FINE, not a bug. You WANT to switch
     cascade options freely to see if they sync — and the real safety net is the **Clear lock**
     above, not the picker. So "picker unlocked + Clear locked while you have a Valcre job" is a
     coherent combination: play with versions, can't nuke the job.
   - **Open design question for Ben (not urgent):** do you still want the picker itself
     Test-Mode-gated (hidden/locked when Test Mode is off, since in production it's removed)? Current
     answer = no gate. Leaving as-is is defensible.

## The ONE real inconsistency — **[drift]** (this explains the popups)
5. **Test Mode is DOCUMENTED to suppress failure toasts, but the code doesn't do it.**
   - `types.ts:13` states: *"Test Mode ON → suppress per-field save/sync FAILURE toasts (demo noise);
     indicators still update."*
   - But the actual save code gates the toast on **`hasRealJob`** (a live Valcre job), **NOT**
     `testMode` (`LoeQuoteSection.tsx:711` — `if (hasRealJob) toast.error(...)`). There is no
     `testMode` check in the toast path.
   - **Consequence (and why Ben keeps seeing popups in Test Mode):** because the test job HAS a Valcre
     number, the error toasts fire regardless of Test Mode. Test Mode is NOT hiding them like the
     comment promises.
   - **Decision for Ben:** either (a) wire Test Mode to actually suppress the failure toasts (honor
     the documented intent — clean demos), or (b) accept "show errors whenever there's a real Valcre
     job" as the real behavior and delete the stale comment. Right now the doc and the code disagree.

## Quick truth table
| Thing | Test Mode OFF | Test Mode ON | Extra gate |
|---|---|---|---|
| Field provenance colors | hidden | shown | — |
| "Insert from data" toggle | hidden | shown | — |
| Clear / Fill-Test-Data links | hidden | shown | **disabled if live Valcre job** |
| Cascade / version picker | **usable** | usable | none (not gated) |
| Save/sync failure toasts | show if live Valcre job | **still show if live Valcre job** | gated on `hasRealJob`, NOT testMode — **[drift]** |

---

*qa-agent · code-confirmed against Ben's live notes. Two items for Ben: (open) should the cascade
picker be Test-Mode-gated — current lean: no; (drift) Test Mode doesn't suppress failure toasts
despite the stated intent — decide wire-it vs delete-the-claim. Not 100% of Ben's notes were taken at
face value — each row is reconciled to source.*
