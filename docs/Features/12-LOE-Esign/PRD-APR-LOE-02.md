---
id: prd-apr-loe-02
title: "PRD-APR-LOE-02 — LOE Series, Part 2 (cascade versions · send · sign · status · storage · payment)"
status: draft-for-approval
created: 2026-06-15
updated: 2026-06-15
type: prd
owner: co-architect (assembler + walk-Ben-through) · qa-agent (support + app-action watch) · Ben (drives as a real user + go-lives)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
supersedes_scope_stub: ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/PRD-NEXT-client-cascade-send-sign-pay-SCOPE.md
prd_series: LOE / client-contract lifecycle
prd_seq: 2
follows: ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/PRD-APR-LOE-01.md
tags: [apr-workflow, loe, econtract, loe-client-series, cascade-versions, docuseal-signing, job-status, sharepoint, payment-portal, real-user-testing, prd]
keywords: [cascade picker, LOE versions, save as draft, default email, sign, job status field, signed pending start, sharepoint storage, payment portal, sandbox]
---

**Tags:** #apr-workflow #loe #econtract #loe-client-series #cascade-versions #docuseal-signing #job-status #sharepoint #payment-portal #real-user-testing #prd
**Entities:** [[LOE E-Sign Feature]] [[eContract Editor]] [[job_contracts]] [[DocuSeal]] [[PRD-APR-LOE-01]]

> **📑 Series: LOE / client-contract lifecycle — this is PRD 2 of 2.**
> ← **PRD 1 (closed):** [Multi-Document Creator](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/PRD-APR-LOE-01.md) — saved versions, the type-pill layout, editable email on send. This PRD 2 picks up where it closed (incl the one open item it carried forward: client-facing filename).

**↑ Home:** [APR Master Dashboard](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md)

# PRD-APR-LOE-02 — LOE Series, Part 2

## ⭐ What this PRD covers (the parts — priority order)

1. **Cascade versions saved on a job** — 🎯 THE CRUX *(KEY)*
2. **One test send with the default email** — *KEY (editing the email = secondary)*
3. **Sign triggers a job action (status field)** — *KEY*
4. **Client-facing filename** — *carried over from PRD 1*
5. **SharePoint storage of the signed doc** — *DISCUSS + ASSESS*
6. **Payment portal / sandbox** — *DISCUSS (later phase)*

> Results 1–3 are the real work; 4 is a small carry-over; 5–6 we cover + assess (not forced to fully work this round). **NOTE:** "client-facing cascade" is just part 1 — NOT the whole PRD, which is why the name stays neutral.

---

## North star

**Real, user-driven testing of the client-facing flow.** Ben runs the activities like a real user; co-architect walks him through each step; a QA agent stands by for support and to confirm what the app does on key actions (especially the sign). The point is to *see it work and look right together*, not to have agents click everything.

The spine: **make several genuinely different LOE versions with the cascade picker, save them as drafts on a job, look at them together and confirm they're correct → then one real test send (default email) to Ben's inbox → Ben opens it, reviews, signs → the sign triggers a visible job action (status) → (later) storage + a payment portal.**

---

## The Key Results in detail

### 1. Cascade versions saved on a job — 🎯 THE CRUX (KEY)

Use the **cascade picker** to make **several genuinely different LOE versions** (e.g. "LOE — Cascade v1", "Cascade v2" … four or five), each reflecting a different cascade switch/selection. **Save them as DRAFTS — no send yet.** Both Ben and co-architect open the job and **see them saved**, look at them, and confirm:
- the cascade picker **switches correctly**,
- the **LOE actually changes** between versions (real different content, not just a renamed copy),
- **no glitches** in how they save as drafts (no duplicates, each version distinct + reopenable).

**Why it matters:** proves the cascade picker works, and gives Ben something to show a client — *"we made four or five versions; here are the different cascade items/switches."*

**Ground-truth guardrails (from spec-review 2026-06-15):**
- The cascade is **input-driven** (`loeCascade.ts` derives Section-10 scenarios/narrative from status-of-improvements + authorized-use). Two different-feeling picks can map to the **same** scenario → identical content, which would **false-fail** the crux. So **QA pre-identifies the cascade inputs that produce provably-different scenarios**, and Ben picks the 4–5 versions from those.
- **Cascade lock is reversible** — RULE 2 locks Value Scenarios on a pick, but the `cascadeResetToken` / Fill-Clear path un-does it, so a wrong pick is never a dead-end mid-version-making.

**Proof (show Ben):** a live job link → the saved-versions list shows the distinct draft versions → open two and confirm a **content diff of the saved `edited_html`** (scenario/narrative actually differs) — NOT "looks different" by eye.

> *At per-chunk-spec time (QA note B):* the diff must **isolate the cascade-derived Section-10 content** so it proves the *cascade* caused the difference — not a manual edit Ben happened to make after.

### 2. One test send with the default email (KEY)

Take one version and do **ONE real test send to bc@crowestudio.com**, using the **DEFAULT email** (the editable email template exists from the last PRD, but **editing it here is SECONDARY — not the point**). Ben:
- sends it with the default,
- goes to his inbox, **opens it, looks at it**, checks it looks fine,
- reviews it with co-architect,
- then presses **Sign**.

**Proof:** the email lands in Ben's inbox (already proven possible); Ben confirms it looks right; he reaches the signing page.

**Fences (from spec-review):**
- **Editing the email is OUT this round** — it shipped + was verified in the closed PRD (PRD 1). Only the **default send** is exercised here.
- **Carry the email-instance RLS fix onto THIS send path** — PRD 1's send had a silent RLS persist-bug (`job_email_instances` anon insert denied). Confirm the RLS-disable fix covers the cascade send path, or the test send "succeeds" while persisting nothing (the exact silent failure we just closed).

### 3. Sign triggers a job action — status field (KEY)

When Ben signs, the **app reacts** by flipping the **job's status** so the job visibly shows it's signed.

**Ground-truth resolution (from spec-review 2026-06-15 — corrects the original "Pending Start"):**
- **There is NO "Pending Start" status.** The app's `JobStatus` enum (`src/types/job.ts`) already has **`loe_signed`** — that's the value the job flips to on sign. (If Ben later wants a distinct "pending start" sub-state, that's a deliberate enum + UI addition — not assumed here.)
- **The surface is the app's `job_status`** (Ben wants it on the job, in the app — not buried in ClickUp).
- **⚑ This is NEW WIRING, not a verify.** Today `docuseal-webhook` on `submission.completed` writes the **ClickUp task only** — it does NOT call `updateJobStatus`. So KR3's real build = wire the webhook → `job_submissions.job_status = loe_signed` → the app displays it. "QA watches the app react" only has something to watch once this wiring exists.
- **PRE-FLIGHT (first step of the sign phase):** confirm the DocuSeal `submission.completed` webhook is **registered in the DocuSeal dashboard + reaching `docuseal-webhook`** BEFORE the sign test. (API registration 404s — known; it's a manual dashboard reg.) Without it, signing triggers nothing and reads as a false "KR3 failed."

**Why it matters:** even before QuickBooks/Valcre payment is wired, the appraiser **knows the client signed** → they follow up for payment however they do today (quote / request to pay). The trigger is the win. *"Now you know how and when the client signed — go do your current payment step until the portal's ready."*

**Sign blast-radius fence (a real sign fires real side-effects — name them before Ben clicks):**
- **ClickUp task write** — expected/allowed (existing behavior).
- **SharePoint signed-LOE upload** — live (KR5). On the test sign this **IS the KR5 assessment** (let it run, on the TEST job only) — not a surprise.
- **TEST JOB ONLY**, never a client; the sign is exercised by Ben on the test job.

**Proof:** pre-flight confirms the webhook is live → Ben signs → the **app's job status flips to `loe_signed`** (visible on the job) → QA confirms the app fired it (DB `job_status` + the UI), and notes the fenced side-effects landed as expected.

> *At per-chunk-spec time (QA note A):* confirm the app actually **renders `job_status` somewhere on the job** — if it doesn't, the build adds that on-job indicator, else QA is watching a DB row with no pixel.

### 4. Client-facing filename (carry-over)

The clean name the client actually sees on the downloaded/sent doc (not "LOE-04") + rename ability + a naming convention. Carried from the closed Multi-Document Creator PRD; lives here because it only matters once docs go to a real client.

### 5. SharePoint storage of the signed doc — DISCUSS + ASSESS

We **cover it and update ourselves**, don't force full working. **Already-known ground truth (research 2026-06-14):** Codex registered the Entra app with `Sites.ReadWrite.All` (admin-consented), SharePoint secrets are live in Supabase, and **SharePoint folder-connect + signed-LOE upload were verified live 06-11/12**. So this may already largely work — the task is to **confirm current state on a real signed doc** and decide what (if anything) to finish. Runbooks: `docs/Features/13-Asset-Storage/`.

### 6. Payment portal / sandbox — DISCUSS (later phase)

**Target flow (Ben's idea):** client signs → *"Thanks for signing — now proceed to your payment portal"* → a payment portal opens (the QuickBooks **sandbox** is where we'd play with this). **Not required to work this round** — assess state, plan it. The real thing is the QuickBooks/Valcre payment link, done as a **later phase** after sign-triggers-status is solid. Refs: `docs/Features/12-LOE-Esign/QUICKBOOKS-SANDBOX-*.md`.

---

## How we run it (the testing approach)

- **Ben drives as a real user** — he does the activities (pick cascade, save drafts, send, open email, sign). Co-architect **narrates each step** and watches with him.
- **QA agent on standby** — support, and specifically to **detect/confirm what the app does on the sign action** (and the status flip). Agents are NOT forced to do all the CLI; Ben does the real-user clicks.
- **No production client** — the one test send goes to **bc@crowestudio.com**; signing is exercised by Ben.

## Phasing

- **Phase 1 — the crux:** cascade versions saved as drafts, seen + confirmed correct on the job. (No send.)
- **Phase 2 — send + sign + status:** one default-email test send → open → review → sign → job status flips (QA confirms the app action).
- **Phase 3 — discuss/assess:** SharePoint storage state on a real signed doc; payment-portal-after-sign flow (sandbox) — covered + planned, not necessarily fully built.

## Out of scope (for now)

- Real client sends (sender cutover to a real valta.ca recipient) — the one-switch activation is known + captured, but this PRD's send stays to Ben's test inbox. *(Sender activation can fold into Phase 2 if Ben wants real-client delivery; otherwise it's the next step.)*
- Fully working QuickBooks/Valcre payment link — Phase 3 is discuss + sandbox-play only.

---

**Last reviewed:** 2026-06-15 by co-architect — authored from Ben's brain-dump; priority order locked (cascade-versions crux → send/sign/status → storage/payment discuss). Pending Ben's approval, then the spec + review-gate loop per sub-item.
