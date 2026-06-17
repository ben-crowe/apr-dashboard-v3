---
id: review-email-sendstep-build-verify-qa
title: "build-verify — Email send-step (post-build, live runtime)"
date: 2026-06-14
type: build-verify
reviewer: qa-agent
target: forked react-spec build of the editable Email send-step (EmailComposeModal + email_templates / job_email_instances)
verdict: PASS (FINAL) — was FAIL → RLS defect fixed → 4 anon proofs + human-confirmed inbox arrival
tags: [build-verify, loe, email-sendstep, rls, anon, apr-workflow, pilot-closed]
---

## 🏁 FINAL VERDICT — PASS (pilot closed, 2026-06-14)

The editable Email send-step is **shippable**. Arc: independent build-verify caught a blocking
silent-failure (RLS-on-new-tables vs an anon app) the build's own self-check missed → fix-fork
disabled RLS to match siblings + made the failures visible → independent re-verify as anon
passed all four → **arrival human-confirmed in the real inbox.**

**The five proofs that close it:**

1. **Anon read of the managed default** works (`OK id=c1c4503c`, no error).
2. **Per-send instance persists** — `state=sent`, recipient `bc@crowestudio.com`, my subject +
   body edits present, `{{signing_link}}` resolved to a real `/sign/…` URL, DocuSeal id attached.
3. **Isolation non-vacuous** — instance wrote AND the default md5 stayed byte-identical (`c2a74d60…`).
4. **Failed-send no longer silent-200** — `sendLOEEmail` requires the edge fn's `success:true`;
   the caller surfaces `saveJobEmailInstance` errors instead of swallowing them.
5. **Arrival — human-confirmed.** Ben pasted the `QA-REVERIFY-558` send from his own inbox:
   subject `Letter of Engagement - Ready for Signature [QA-REVERIFY-558]`, merged `Hi Sarah` +
   `3494 Spring Parkway`, `Review & Sign Document` button = the signing link,
   `QA-REVERIFY-MARKER-558` present, landed 6:10pm to `bc@crowestudio.com`. Stronger than the
   Resend delivered-event — eyeballed in the real inbox. No gmail auth needed.

**Pilot takeaway:** independent verification AS THE APP'S REAL IDENTITY (anon) is what earned its
keep — the silent RLS blocker was invisible to a same-context self-check and to a Resend 200.

---


## ✅ RE-VERIFY (2026-06-14, post fix-fork) — PASS

The blocking RLS defect is **fixed and independently re-verified as anon** (the identity that
exposed it). All evidence below is from a fresh live send on the Wilson job, anon session.

- **RLS off at DB level** — `relrowsecurity = false` on both `email_templates` and
  `job_email_instances` (matches siblings).
- **Anon READ of default works** — `supabase.from('email_templates')…is_default=true` →
  `OK id=c1c4503c…`, no error. (The lingering `loadDefaultEmailTemplate seed failed` console
  line was **stale** from the pre-fix run; the load now takes the happy path.)
- **Per-send instance persists (the exact thing that failed before)** — `job_email_instances`
  row written: `state=sent`, recipient `bc@crowestudio.com`, my subject **and** body edits
  present, `{{signing_link}}` fully resolved to a real `/sign/…` URL, `docuseal_submission_id`
  attached.
- **Isolation now NON-vacuous** — a real instance wrote AND the default md5 stayed byte-identical
  (`c2a74d60…`). Editing one send genuinely doesn't touch the default.
- **Failed-send no longer silent-200** — `sendLOEEmail` now requires the edge fn to return
  `success: true` (returns false otherwise); the caller captures `saveJobEmailInstance`'s
  `{success,error}` and `console.error`s a persistence failure instead of swallowing it.
- **Arrival** — accepted as PROVEN via the Resend *delivered* event (Ben declined gmail re-auth;
  not required since sending is Resend). Corroborated transitively: the instance only persists as
  `sent` when `emailSent === true`, which now requires the edge fn to confirm an actual dispatch.

**Env left clean:** Wilson `clickup_task_id` restored, test instance + test `loe_submissions`
rows deleted, `job_contracts = 3` (Ben's set intact), `job_email_instances = 0`. DocuSeal
submission `8450095` remains (no API delete) — Ben deletes at will.

---


# build-verify — Email send-step (live runtime, Wilson test job)

**Verdict: FAIL — one blocking defect.** The UI build is excellent and hits every point of
the spec review. But under the app's actual runtime identity (**anon**), the per-send email
instance silently never persists and the managed default can't be read. Root cause is a
single RLS mismatch on the two new tables. Everything else verified PASS.

Method: live click-through on the Wilson test job (`558ab43f…`, VAL261028) in the headless
`apr-iso` session, DB ground-truth via Supabase Management API + direct anon-key REST probes,
pixels read from screenshots. Test data only; recipient forced to `bc@crowestudio.com`
(Resend sandbox); environment left clean; no Vercel.

---

## 🔴 BLOCKING DEFECT — new tables require `authenticated`, app runs `anon`

- **The hole:** `email_templates` and `job_email_instances` were created with RLS **enabled**
  and an `authenticated`-only policy (`auth.role() = 'authenticated'`). But the APR app runs
  **anon**: `supabase.auth.getSession()` returns no session, and `/dashboard/*` is **not**
  wrapped in `ProtectedRoute` (App.tsx) — anon reaches the dashboard. Every sibling LOE table
  (`loe_submissions`, `job_contracts`) has `relrowsecurity = false`.
- **Why it bites:**
  - The per-send instance insert is **RLS-denied** every time → `job_email_instances` stays
    empty → the draft→sent lifecycle and "sent emails appear as records in Saved Documents"
    never happen.
  - `loadDefaultEmailTemplate` can't **read** `email_templates` under anon → console
    `🔴 loadDefaultEmailTemplate seed failed` → it survives only by falling back to the
    hardcoded `EMAIL_SEED_*` constants. "Set as Default" / "Reset to original" would also
    fail silently under anon.
  - The default-isolation md5 check passes **vacuously** — nothing writes the instance, so
    nothing can touch the default.
- **Evidence (triangulated, 4 signals):**
  - `relrowsecurity`: `loe_submissions=false`, `job_contracts=false`, **`email_templates=true`,
    `job_email_instances=true`**.
  - RLS policy text: both new tables = `(auth.role() = 'authenticated')` for ALL.
  - Direct anon-key REST insert into `job_email_instances` →
    `42501: new row violates row-level security policy`.
  - After a "successful" send (DocuSeal submission + `loe_submissions` row both persisted,
    signing link resolved to `/sign/9b8884d5…`), `job_email_instances` = **0 rows**.
- **Suggested fix:** match the sibling pattern —
  `ALTER TABLE email_templates DISABLE ROW LEVEL SECURITY;` and same for
  `job_email_instances`. (Or, if a stricter posture is wanted, it must be reconciled across
  the whole LOE feature, not just these two tables — today it's inconsistent.)

## 🟠 SECONDARY (fix regardless) — the failure is invisible

- **Swallowed error:** the caller (`LoeQuoteSection` ~998) does `await saveJobEmailInstance(...)`
  but never checks its `{ success, error }` return — so a denied insert is silent. Surface it
  (toast + `console.error`) so this class of failure can never hide again.
- **Weakened failed-send guardrail:** `sendLOEEmail` returns `true` "even if email isn't
  actually sent, as long as LOE was created." So a non-delivering email still looks successful
  and would mark the flow done. The spec guardrail ("document NOT marked sent on send-failure")
  is not truly enforced by this return.

---

## What PASSED (verified, with evidence)

- **① Review step + stepper** — Document → ① Review → ② Email → ③ Sent. Real Wilson LOE rendered
  (Valta letterhead, Sarah Wilson, VAL261028). Pixels: `e2-loe-preview-step1.png`.
- **② Email compose** — pixel-perfect to the spec review:
  - amber **"TEST — delivered to sandbox, not the client"** banner (spec clarification #8);
  - To: `bc@crowestudio.com`; client address shown for reference;
  - locked merge chips incl. **"Signing link (at send)"** (spec blocker #1);
  - live preview with name + property address merged at edit time;
  - my subject + body edits flow into the compose;
  - footer "Edits here apply to this send only — the default is unchanged."
  - Pixels: `e3-email-compose-step2.png`, `e4-email-edited.png`.
- **Signing link resolves at SEND, not edit** — `{{signing_link}}` held as a labelled
  placeholder in compose; resolved to `http://localhost:8086/sign/9b8884d5…` at send (console).
- **DocuSeal submission + `loe_submissions` persist** — slug `JGJJYgh61vEnn3`,
  submission_id `8448446`, status pending, client_email `bc@crowestudio.com`.
- **Double-send guard** — code-correct (`isSending` gate + `generateAndSendLOE(…, false)` so it
  no longer fires its own email). Architecture sound; not independently runtime-retested.

## Could NOT verify

- **In-inbox arrival** — BLOCKED. `guide-gmail-cli` OAuth token is **expired AND revoked**
  (`invalid_grant: Token has been expired or revoked`); the refresh token itself is dead, so it
  needs a full browser re-auth only Ben can do. A Resend 200 is not delivery — independent
  arrival confirmation is impossible until gmail is re-authed.
- **③ Sent step content** — the modal closes on send; not captured this pass.

---

## Cleanup (environment left clean)

- Wilson `clickup_task_id` restored to `86b93vwd3` (was nulled to block `markLOEPrepComplete`).
- Stray test `loe_submissions` row `9b8884d5…` deleted.
- Wilson `job_contracts` = 3 (Ben's clickable set intact); `job_email_instances` = 0.
- **For Ben:** DocuSeal submission `8448446` remains (no reliable API delete) — delete at will.

*qa-agent · build-verify · independent runtime pass · routes to co-architect → react-spec fix.*
