---
title: "LOE Email Delivery Setup — Microsoft Graph (direct) vs Resend"
status: decided — Graph-direct; go-live steps pending
created: 2026-06-18
owner: qa-agent (verification) · Ben (Valta tenant admin)
tags: [apr-workflow, loe, email, msgraph, resend, entra, deliverability, decision]
---

**Tags:** #apr-workflow #loe #email #msgraph #resend #entra #deliverability #decision
**Entities:** [[Microsoft Graph]] [[Resend]] [[Microsoft Entra ID]] [[DocuSeal]] [[Valta tenant]]
**Backlink:** [APR Master Dashboard](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md)
**Related:** [Codex Entra App-Registration Prompt](~/Development/APR-Dashboard-v3/docs/Features/13-Asset-Storage/CODEX-ENTRA-APP-REGISTRATION-PROMPT.md) · [LOE-DocuSeal Architecture](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-DOCUSEAL-ARCHITECTURE.md)

---

## TL;DR (the decision)

**Send LOE e-signature emails DIRECTLY via Microsoft Graph from the real `clientcare@valta.ca` mailbox. Drop Resend.**

At this volume (low, one-to-one, B2B, transactional) deliverability is identical, and the only thing Resend adds — open/click analytics — is both unreliable in 2026 AND redundant, because the event that actually matters (the client signed) already arrives from DocuSeal, not from the email. The current Resend path is also effectively broken (sandbox sender that only reaches Ben), so keeping it means fixing domain-verification + webhooks for no real gain.

**One scenario that flips this:** if Valta later adds marketing / bulk sends, or needs programmatic bounce-and-retry without watching the mailbox, bring back an email service provider (ESP) at that point.

---

## What we HAVE set up (verified 2026-06-18)

- **One Microsoft Entra app, shared by two features.** The same registered app drives both SharePoint job-folder creation AND outbound email — it is NOT two apps. Source-of-truth: [graph.ts](~/Development/APR-Dashboard-v3/supabase/functions/_shared/graph.ts) serves both Feature A (email `sendMail`) and Feature B (SharePoint), both gated on the same three secrets.
- **The email permission is already granted.** `Mail.Send` (Application) was granted with admin consent on **2026-06-11**, alongside `Sites.ReadWrite.All` for folders. Verified live in the Entra portal this session (Codex recall + portal read). No further portal permission work is required.
- **`clientcare@valta.ca` is a real, licensed mailbox.** Confirmed in the Valta tenant: user "Valta ClientCare", account Enabled, one assigned license, its own inbox — not a forwarding alias. This is the same address printed in the LOE header contact block, so the sender identity matches the document.
- **The Graph send code is already built and waiting.** [send-loe-email-fixed/index.ts](~/Development/APR-Dashboard-v3/supabase/functions/send-loe-email-fixed/index.ts) already routes through `graphSendMail` when two conditions are met: the Graph secrets exist (`graphConfigured()`) AND an explicit `GRAPH_SEND_MAILBOX` env is set. Until `GRAPH_SEND_MAILBOX` is set it deliberately falls back to the Resend test path.
- **Tenant:** Valta (`valta.ca`), Ben is Global Admin — self-register / self-consent, no client dependency.

## What we are sending TODAY (the current reality)

- Every LOE email currently goes out via **Resend on its sandbox sender** (`onboarding@resend.dev`), which **only delivers to the account owner (`bc@crowestudio.com`)** — it cannot reach a real client. This is why everything safely lands in Ben's inbox during testing.
- There is a **test-recipient guard** that defaults non-production sends to `bc@crowestudio.com`. Keep this — it is independent of transport and stays after the swap.

---

## How "triggers" actually work (important — clears a common confusion)

- The email-template records carry a setting called `trigger` (`'manual' | 'after_sign'`), but **`after_sign` is wired to nothing** — no code reads it and auto-sends. Today **every email is a manual human send.** The column saves a value that has no engine behind it yet.
- The **real business event — "client signed the LOE" — comes from DocuSeal webhooks** (`submission.created` / `submission.completed`), entirely independent of the email channel. That signed event is what already drives status updates, the signed-PDF mirror, QuickBooks, and ClickUp.
- Implication: we do **not** need email open/click data to know what's happening — the signed event is a stronger, reliable signal than an email open. (See the Resend section.)

---

## Graph-direct vs Resend — the comparison

| Axis | Microsoft Graph (direct) | Resend (verified domain) |
|---|---|---|
| Deliverability (low-volume 1:1 B2B) | Excellent — Microsoft IPs, SPF/DKIM/DMARC-aligned | Excellent — managed reputation pools |
| Domain-reputation protection | No IP isolation from the domain | ESP IPs isolated from your domain |
| Open / click webhooks | None | Yes (opened, clicked, delivered, bounced, complained) |
| Bounce handling | NDR email back to the mailbox; no API state | `email.bounced` webhook + auto-suppression |
| Delivery confirmation | `202 Accepted` only ("we took it") | `email.delivered` webhook ("it landed") |
| Throttle limits | 10,000/day, 30/min — untouchable here | 3,000/mo free — untouchable here |
| Setup needed | Auth already done; just set the sender | Verify domain + wire webhooks; sandbox blocks delivery now |
| Cost | Included in the M365 license | Free tier sufficient |

### Why each of Ben's three hunches checks out

1. **Deliverability** — Equivalent at this volume. Sending from a real, authenticated `valta.ca` mailbox on Microsoft's own infrastructure places in the inbox just as reliably as a verified ESP domain. The ESP deliverability machinery (IP warming, feedback loops, suppression lists) only earns its keep at scale.
2. **Sender-reputation / domain protection** — Real, but a *volume-scale* concern (marketing blasts, cold outreach). No practical impact for low-volume 1:1 transactional mail. Hunch confirmed.
3. **Engagement & delivery telemetry (the one genuine differentiator)** — Resend exposes opens / clicks / delivered / bounced as webhooks; Graph gives back only `202 Accepted`, with bounces arriving as NDR emails to the mailbox. BUT: open-tracking is largely broken in 2026 (Apple Mail Privacy Protection pre-fetches images; B2B link-scanners inflate clicks), so "open rate" is not a trustworthy signal for a B2B transactional email — and the signed event from DocuSeal already covers the only trigger that matters here. Net incremental value of email telemetry for this use case: ~nil.

### The one gotcha to know about Graph-direct

Graph confirms **"accepted," not "delivered."** A rare bounce surfaces as a **bounce-back email in the `clientcare@valta.ca` mailbox**, not as an error in the app. Easily handled: add a mailbox forward/alert rule on non-delivery reports if you want active alerting. For low 1:1 volume this is a non-issue in practice.

---

## Go-live steps (what remains)

1. **Scope the app to one sender (optional guardrail, recommended).** Create an Exchange Online Application Access Policy restricting `Mail.Send` to only `clientcare@valta.ca`, so the app can never send as any other tenant mailbox. (Exchange Online PowerShell — `New-ApplicationAccessPolicy`. Separate from the portal; step-by-step in the [Codex Entra App-Registration Prompt](~/Development/APR-Dashboard-v3/docs/Features/13-Asset-Storage/CODEX-ENTRA-APP-REGISTRATION-PROMPT.md).)
2. **Set the sender + confirm the secrets in Supabase.** Set `GRAPH_SEND_MAILBOX = clientcare@valta.ca`, and confirm `GRAPH_TENANT_ID` / `GRAPH_CLIENT_ID` / `GRAPH_CLIENT_SECRET` are present in the edge-function secrets (they should already be — folder creation uses them). Setting `GRAPH_SEND_MAILBOX` is the single switch that flips email from the Resend test path to live Graph.
3. **Test send (guard still on).** Fire a test from the pinned job → it routes via Graph from `clientcare@valta.ca` → lands at `bc@crowestudio.com` (the guard) → confirm delivery + that the sender identity reads as Valta ClientCare + the signing link works.
4. **Flip to real recipient for production.** Once verified, production sends go to the real client (the guard only redirects in non-prod).
5. **Retire Resend.** Remove the Resend fallback branch + the dead [send-loe-email](~/Development/APR-Dashboard-v3/supabase/functions/send-loe-email/index.ts), [send-loe-email-v2](~/Development/APR-Dashboard-v3/supabase/functions/send-loe-email-v2/index.ts), [send-loe-email-gmail](~/Development/APR-Dashboard-v3/supabase/functions/send-loe-email-gmail/index.ts) edge functions (only [send-loe-email-fixed](~/Development/APR-Dashboard-v3/supabase/functions/send-loe-email-fixed/index.ts) is live), leaving one canonical Graph send path.

## Security flag (do before any commit)

- The live function currently has a **hard-coded Resend API key as a fallback in source** — see [send-loe-email-fixed/index.ts](~/Development/APR-Dashboard-v3/supabase/functions/send-loe-email-fixed/index.ts). Move it to a secret and remove the literal — it should not sit in the repo. (Moot once Resend is retired, but fix it regardless before the cleanup commit.)

---

## Sources (research, 2026-06-18)

- [B2B email deliverability benchmarks 2025](https://thedigitalbloom.com/learn/b2b-email-deliverability-benchmarks-2025/)
- [Email deliverability at volume](https://mailtrap.io/blog/email-deliverability/)
- [Graph sendMail returns accepted, not delivered (MS Q&A)](https://learn.microsoft.com/en-us/answers/questions/1397679/currently-using-microsoft-graph-wanted-to-know-whe)
- [Apple Mail Privacy Protection & open-rate tracking 2026](https://lite14.net/blog/2026/02/21/apple-mail-privacy-features-continue-to-reshape-email-open-rate-tracking/)
- [Microsoft Graph throttling limits](https://learn.microsoft.com/en-us/graph/throttling-limits)
- [Limit mailbox access for Mail.Send (Application Access Policy)](https://learn.microsoft.com/en-us/graph/auth-limit-mailbox-access)

---

**Last reviewed:** 2026-06-18 by qa-agent — verified the shared Entra app + Mail.Send grant + real clientcare@valta.ca mailbox live; folded the Graph-vs-Resend research; optimized all links to clickable form.
