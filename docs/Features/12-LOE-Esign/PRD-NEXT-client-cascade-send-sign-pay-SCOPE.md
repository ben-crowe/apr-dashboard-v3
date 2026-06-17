---
title: "PRD SCOPE CAPTURE — Client-facing cascade: real sender, versions, storage, signing, payment"
status: scope-capture
created: 2026-06-14
description: "Scope stub for the NEXT PRD after the editable-email pilot. Bundles the client-facing end-to-end demo Ben named: Valta as real sender, inbox verification, cascade versions on a real job, SharePoint storage, signing, and sandbox payment portal. Not the full PRD yet — captured so nothing is lost; research pending, prepped with Ben."
tags: [apr-workflow, loe, econtract, sender-cutover, cascade-versions, sharepoint, docuseal-signing, payment-portal, prd, scope-capture]
---

# NEXT PRD — Client-Facing Cascade (scope capture)

**Tags:** #apr-workflow #loe #econtract #sender-cutover #cascade-versions #sharepoint #docuseal-signing #payment-portal #prd
**Entities:** [[PRD-multi-document-creator]] [[ORCHESTRATION-SYSTEM-DASHBOARD]]

> **This is a SCOPE CAPTURE, not the finished PRD.** Written live as Ben named the pieces (2026-06-14) so none are lost. The editable-email pilot (PRD-multi-document-creator → "Email template" Key Result) is wrapping up; THIS is what comes after. We prep the real PRD together once the sender research lands.

## The end goal (Ben's words)

A full **client-facing demo on a real job**: show the client the **different cascade versions** saved on the job, send them the **real email from Valta**, they **sign**, the **payment portal works**, the documents are **stored in SharePoint**, and we can **verify the inbox**. One packaged PRD.

## The six bundled pieces

1. **Real sender = Valta (valta.ca)** — flip the LOE send off the Resend sandbox (onboarding@resend.dev → bc@crowestudio.com only) onto the real Valta mailbox via **Microsoft Graph**, so real clients receive it. **GROUND TRUTH (confirmed in code 2026-06-14):** Graph is already wired in `supabase/functions/send-loe-email-fixed/index.ts` (imports `graphConfigured` + `graphSendMail` from `_shared/graph.ts`); the send is GATED on an explicit `GRAPH_SEND_MAILBOX` env var (`graphConfigured() && graphMailbox`). Code comment: the Graph app **secrets already exist for SharePoint** (Codex's setup, ~2026-06-11), email just stays on the test path until a real valta.ca sending mailbox is deliberately set. Setup runbooks already in repo: `docs/Features/13-Asset-Storage/SHAREPOINT-APP-SETUP-RECIPE.md`, `GRAPH-QBO-ACTIVATION-RUNBOOK.md`, `MS-GRAPH-BUILD-SPEC-2026-06-11.md`, `CODEX-ENTRA-APP-REGISTRATION-PROMPT.md`.
   - **RESEARCH CONFIRMED (2026-06-14, read-only fork):** Codex set it ALL up — the Entra app is registered with **`Mail.Send` + `Sites.ReadWrite.All`, admin-consented**; all Graph secrets are LIVE in Supabase (`GRAPH_TENANT_ID/CLIENT_ID/CLIENT_SECRET`, `SHAREPOINT_SITE_ID/DRIVE_ID`) so `graphConfigured()` already returns true; SharePoint folder-connect + signed-LOE upload verified live 06-11/12. Email stays on Resend **solely** because the ONE gate secret **`GRAPH_SEND_MAILBOX` is unset**. Set it to a real valta.ca mailbox → email flips to Graph automatically, **no redeploy**. **This is an ACTIVATION + verification sub-item, not a build.**
   - **The 5 cutover steps:** (1) set `GRAPH_SEND_MAILBOX` to the real sending mailbox; (2) **NEEDS BEN** — confirm the exact mailbox + tenant domain (code/runbook assume `noreply@valta.ca`, body signs `clientcare@valta.ca`, a Codex doc says `valta.com`, SharePoint host is `valtapropertyvaluations.sharepoint.com` — which UPN, valta.ca or .com?); (3) **NEEDS ADMIN** — Exchange Online `New-ApplicationAccessPolicy` to scope `Mail.Send` to the ONE APR mailbox (currently the app can send as ANY mailbox in the tenant — a security lock-down, PowerShell); (4) live-test Graph send → 202 + real arrival + from-address = the valta.ca mailbox + button → real signing URL (to a controlled recipient first, not a client); (5) cleanup — dead variants `send-loe-email`/`-v2`/`-gmail`, and remove the hardcoded `RESEND_API_KEY` fallback literal at `send-loe-email-fixed/index.ts:35` (secret already exists; in-code key is dead weight + secret-in-source).
   - *Adjacent (noted, separate): `GRAPH-QBO-ACTIVATION-RUNBOOK.md` §2b flags an OPEN DocuSeal webhook-registration UI task — unrelated to the sender cutover.*
2. **Inbox verification** — durable way to verify the email actually arrived in the real inbox (not just a send 200 / delivered event). Tie to the standing-access lesson in `~/Development/00-Systems-Management/AUTH-REQUESTS-LOG.md` — prefer persistent access over repeat OAuth.
3. **Cascade versions on a real job** — save multiple cascade versions on an actual job and let Ben **show the client the different versions** on that job. This is the parked cascade-versions thread, now in scope. Reuse the level-agnostic saved-versions list (built in the pilot) so the client/contact (CRM) view reuses it.
4. **SharePoint storage folders** — verify the storage folders are **collecting + saving documents to SharePoint** (the Asset-Storage / Microsoft Graph storage path, `docs/Features/13-Asset-Storage/`). Confirm folders create + files land.
5. **Signing** — how DocuSeal **signing actually works**, exercised end-to-end (someone opens the LOE, reads it, signs) — NOT done in the pilot (pilot only proved the email + the signing-link button; nobody signed).
6. **Sandbox payment portal** — the **payment portal / sandbox payment + signature** works (QuickBooks sandbox path; refs `docs/Features/12-LOE-Esign/QUICKBOOKS-SANDBOX-*.md`).

## Status

- **Scope captured.** Sender-research fork in flight (confirms Graph/SharePoint state + cutover gaps).
- **Next:** research lands → prep the real PRD with Ben (Key Results per piece, proof-per-piece, sub-item ordering). Likely sequenced sub-items, not one big bang.

---

**Last reviewed:** 2026-06-14 by co-architect — scope captured live as Ben named the six pieces; full PRD to follow after sender research.
