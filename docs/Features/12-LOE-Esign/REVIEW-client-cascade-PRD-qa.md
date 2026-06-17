---
id: review-client-cascade-prd-qa
title: "review-gate (SPEC mode) — Client-Facing Cascade PRD (whole-PRD altitude)"
date: 2026-06-15
type: spec-review
reviewer: qa-agent
gate: review-gate / spec-review (7 lenses)
target: PRD-APR-LOE-02.md
verdict: PASS (re-review) — was REVISE, all 8 gaps closed against their original holes
tags: [review-gate, spec-review, loe, cascade, docuseal-sign, job-status, apr-workflow]
---

## ✅ RE-REVIEW (2026-06-15) — PASS

Re-ran spec-mode on the revised PRD, checking each closure against its **original** gap (not the
summary). All eight land in the text, each fixing exactly what it should:

1+2. "Pending Start" killed → real `loe_signed` named; KR3 explicitly flagged **NEW WIRING**
   (webhook→`job_status`→UI), not a verify. ✓
3. Webhook-registration **pre-flight** is now the first step of the sign phase. ✓
4. Crux proof = **content-diff of `edited_html`** + QA pre-identifies the diverging cascade inputs. ✓
5. **Sign blast-radius fenced** (ClickUp OK; SharePoint upload = the KR5 assessment, test job only). ✓
6. Email-editing fenced **OUT**. ✓
7. Cascade lock **reversible** (`cascadeResetToken`/Fill-Clear). ✓
8. **RLS fix carried** onto the cascade send path. ✓

**Two non-blocking notes for the per-chunk spec** (clarifications, not gate failures):
- **A (KR3 UI surface):** the proof says "visible on the job / the UI" — confirm the app actually
  *renders* `job_status` somewhere on the job, or the build adds that indicator. Else QA's
  "watch the UI flip" has a DB row but no pixel.
- **B (KR1 diff isolation):** the content-diff should isolate the **cascade-derived Section-10**
  content, so it proves the *cascade* caused the difference (not any manual edit Ben made after).

Verdict: **PASS** — builder-ready at PRD altitude. Proceed to per-chunk spec; fold A+B there.

---

# review-gate SPEC review — Client-Facing Cascade PRD

**Verdict: REVISE.** Strong, well-prioritized PRD — the crux is sharp, phasing is clean, scope
fences on storage/payment/sender are explicit. But **KR3 (sign → status) has three real
ground-truth holes** that would bite the build, plus a crux-collision risk and an unfenced
side-effect. None are fatal to the design; all are closeable on paper. Reviewed at whole-PRD
altitude (per co-arch) against ground truth read from the code.

Output: each gap = `the hole → why it bites → suggested fix`.

---

## Gate-blockers

### 1. "Signed → Pending Start" doesn't exist in the app's status model — `ground-truth / contradiction`
- **The hole:** KR3 says wire the sign to a job status of **"Pending Start."** The app's `JobStatus` enum (`src/types/job.ts`) is `submitted | in_progress | loe_pending | loe_sent | loe_signed | contract_generated | paid | active | completed` — there is **`loe_signed`, but NO "Pending Start."**
- **Why it bites:** the builder either invents a "Pending Start" status the app doesn't render, or maps to `loe_signed` and the proof ("status visibly flips to Pending Start") can't match. The QA watch-the-app step has nothing real to watch.
- **Suggested fix:** name where "Pending Start" actually lives — is it the app's `job_status` (then add it to the enum + UI, or use `loe_signed`), a **ClickUp** task status, or a **Valcre** status? Decide the ONE field that flips and state its real values.

### 2. The sign event currently goes to ClickUp, NOT the app's job_status — `ground-truth / testability`
- **The hole:** `docuseal-webhook/index.ts` on `submission.completed` updates the **ClickUp task** (writes "▸ LOE Signed: <time> by <signer>"). It does **not** call `updateJobStatus` / touch `job_submissions.job_status`. KR3's proof is "QA watches the **app** fire the action / the job status visibly flips."
- **Why it bites:** as built, signing flips a ClickUp field, not anything in the app — so "watch the app react" has no hook today. This is NEW wiring (webhook → `job_status` → app display), not a verify of existing behavior.
- **Suggested fix:** state that KR3 requires **new wiring** from the webhook to the app's `job_status` (+ the app must display it), OR redefine the proof as "QA confirms the ClickUp status flip" if ClickUp is the intended surface. Pick the surface; don't leave "the app reacts" undefined.

### 3. The DocuSeal completion webhook may not fire at all — `ground-truth / adversarial`
- **The hole:** DocuSeal's `submission.completed` webhook is **registered only via the DocuSeal dashboard UI** (API registration 404s — known ground truth, 2026-06-14). If it isn't registered/pointing at `docuseal-webhook`, **signing triggers nothing.**
- **Why it bites:** Ben signs, nothing happens, and it reads as "KR3 failed / build broken" when the real cause is an unregistered webhook. The whole sign→status proof silently can't run.
- **Suggested fix:** add a **pre-flight** to KR3: confirm the `submission.completed` webhook is registered + reaches `docuseal-webhook` BEFORE the sign test. Make it the first step of Phase 2, not an assumption.

### 4. "Several genuinely different versions" can collide on identical scenarios — `adversarial / testability`
- **The hole:** the cascade is **input-driven** — `loeCascade.ts` derives value scenarios + narrative from `status-of-improvements` (+ authorized-use override). Two different-feeling picks can map to the **same** scenarios → two "versions" with **identical** LOE content despite different labels.
- **Why it bites:** the crux ("the LOE actually changes between versions, not a renamed copy") can **false-fail** — not from a bug, but because the picks didn't diverge. Ben + co-arch chase a non-bug.
- **Suggested fix:** QA (me) pre-identifies which cascade inputs produce **provably different** Section-10 scenarios/narrative; Ben picks from those for the 4–5 versions. And make the proof a **content diff** of the saved `edited_html` (scenario/narrative differs), not "visibly different" by eye.

### 5. The one test SIGN fires real side-effects that aren't fenced — `guardrail`
- **The hole:** a real `submission.completed` can cascade: the **ClickUp** write (confirmed), and per KR5 the **SharePoint signed-LOE upload was verified live** — so signing the test doc may actually upload to SharePoint + write ClickUp.
- **Why it bites:** a "just testing the status flip" sign quietly mutates ClickUp and pushes a doc to SharePoint on the test job — unintended real side-effects, and it muddies what KR5 is "assessing."
- **Suggested fix:** name which side-effects are **expected/allowed** on the test sign (ClickUp write OK? SharePoint upload OK as the KR5 assessment, or suppress?). Fence the sign's blast radius before Ben clicks Sign.

---

## Clarifications (fence these)

### 6. Editing the email — IN or OUT this round? — `scope fence`
KR2 says "the default email is the point; editing is SECONDARY — not the point." Fuzzy. State plainly: editing-the-email is **NOT tested this round** (it shipped + was verified in the closed PRD); only the **default send** is exercised here.

### 7. Cascade lock reversibility — `guardrail (can't-change-it-from-there)`
RULE 2 locks Value Scenarios after a cascade pick. Confirm a picked cascade is **reversible** (the `cascadeResetToken` / Fill-Clear path) so a wrong pick isn't a dead-end mid-version-making.

### 8. Carry the email-instance RLS fix onto THIS send path — `ground-truth`
The last PRD's send had a **silent RLS persist-bug** (`job_email_instances` insert denied under anon). The cascade test-send reuses that send path. Confirm the RLS-disable fix covers it, or the test send "succeeds" while persisting nothing — the exact silent failure we just closed.

---

## What passed

- **Priority order + phasing** — crux-first (cascade versions), then send/sign/status, then discuss-only storage/payment. Excellent, unambiguous.
- **Scope fences** — KR5/6 explicitly DISCUSS-only, sender cutover OUT (one GRAPH_SEND_MAILBOX switch, captured), test-inbox-only. Clean.
- **Cascade ground truth** — the picker is real and genuinely derives different scenarios/narrative (`loeCascade.ts`), so KR1's "LOE actually changes" is feasible (subject to gap #4).
- **No-duplicate/distinct-draft discipline** — carries the chunk-1 lesson correctly.

---

*qa-agent · review-gate spec-review · whole-PRD altitude · co-architect revises → re-review or proceed to per-chunk spec.*
