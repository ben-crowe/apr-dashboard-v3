---
tags: [#APR, #testing, #docuseal, #e-sign, #loe, #phase-sheet, #full-loop]
phase: 5
title: LOE Send + E-Sign (DocuSeal)
last_reconciled: 2026-06-11
---

# Phase 5 — LOE Send + E-Sign (DocuSeal)

> **What this phase covers:** the LOE has been rendered (Phase 4). This phase is everything from "Preview & Send LOE" being clicked through to the signed-date landing back on the job + ClickUp card. The render itself is Phase 4 — this phase is the SEND, the SIGN, and the COMPLETION round-trip.

---

## Index

1. The goal
2. How the send works (generateLOE → docuseal-proxy → /submissions/html, send_email:false)
3. The branded email (send-loe-email-fixed, Resend sandbox, test recipient)
4. Signature + date anchor tags (how DocuSeal knows where to sign)
5. The completion round-trip (docuseal-webhook → DB + ClickUp on "completed")
6. ⭐ Can the e-sign be COMPLETED programmatically? (the investigated answer)
7. Open items (re-anchor V07, sync template selectors, template-ID / key discrepancy, .co vs .com)
8. Tools / CLIs for this phase
9. Definition of done

---

## 1. The goal

**GOAL:** One click on the job sends the rendered LOE to the client for e-signature, the client signs it, and the **signed date** flows automatically back onto the job record AND the ClickUp card — no manual data entry, no copy-paste of a status.

**CURRENT STATE:** Send + delivery is **proven** — the button generates the LOE, creates a DocuSeal submission from raw HTML, gets back a signing slug, and emails the client a branded Valta email with the sign link. The **completion round-trip is wired** (a webhook stamps `loe_signed_at` + the ClickUp "LOE Signed" line on `submission.completed`) but depends on a real human actually clicking through the DocuSeal portal and signing — there is no end-to-end automated proof yet because nobody has driven a full sign-to-stamp cycle in the test environment. See Section 6 for whether the sign step itself can be automated.

---

## 2. How the send works

**GOAL:** Send the exact rendered LOE (the live filled HTML from Phase 4) to DocuSeal for signature, controlling the email ourselves so it's branded Valta — not DocuSeal's generic notification.

**CURRENT STATE:** ✅ Working. The flow:

- **Trigger** — `ESignatureAction.tsx` "Preview & Send LOE" button. Two-step: (a) generate preview HTML, show it in `LOEPreviewModal`; (b) on approve, `generateAndSendLOE(job, jobDetails, previewHTML)`. The button is gated — hidden if no Valcre job number, disabled until required fields (client first/last/email + property address) validate.
- **The send payload** (`generateLOE.ts` `generateAndSendLOE`) goes to the `docuseal-proxy` edge function with `?endpoint=submissions/html`. Key facts about the payload:
  - **NO `template_id`** — the raw filled HTML IS the document. DocuSeal scans the HTML for the anchor tags and builds the interactive fields itself. This is the modern path; the old static-template path (`docuseal.ts`, template `1680270`) is the DEAD path.
  - `send_email: false` — we deliberately suppress DocuSeal's own email so we can send our own branded one (Section 3).
  - One submitter, `role: "First Party"` — must match the role on the anchor tags or the fields don't bind.
- **The proxy** (`docuseal-proxy/index.ts`) is a thin pass-through: adds the `X-Auth-Token`, forwards to `https://api.docuseal.com/<endpoint>`, returns the JSON. It exists to keep the API key server-side and dodge browser CORS.
- **The response** carries a `slug` (top-level or on `submitters[0]`). The code FAIL-LOUDs if no slug comes back — no slug = no sign link = dead send.
- **Persistence** — the filled HTML snapshot + slug + submission ID + resolved template version are written to `loe_submissions` (keystone for version reproducibility) AND `docuseal_submission_id` is written onto `job_loe_details` (this is what the webhook later uses to find the job).
- **Signing link** built as `https://docuseal.com/s/<slug>` (or the persisted submission's link).

---

## 3. The branded email

**GOAL:** The client gets a clean Valta-branded email with a "Review & Sign" button — not a generic DocuSeal notice.

**CURRENT STATE:** ✅ Working in test, ❌ not production-ready.

- `sendLOEEmail()` → `send-loe-email-fixed` edge function → **Resend**.
- **Sender is the Resend SANDBOX domain** — `from: 'Valta Appraisals <onboarding@resend.dev>'`. This sandbox can only deliver to the verified test inbox **bc@crowestudio.com**. It will NOT deliver to arbitrary client addresses. That's fine for testing, wrong for production.
- The email body is hand-built HTML: greeting, property address, a blue "Review & Sign Document" button pointing at the signing link, a "what happens next" list, Valta signature block (Calgary address, clientcare@valta.ca).
- **There are FOUR `send-loe-email*` functions on disk** (`send-loe-email`, `-fixed`, `-gmail`, `-v2`). `-fixed` is the live one (Resend, bc@crowestudio.com account, dated Jan 2026). The others are abandoned attempts — a cleanup target, not active wiring.

**⭐ HOW WE VERIFY THE EMAIL — agent-driven via the BC email CLI suite (Claude Code, NEVER Codex):**

The Claude Code agent verifies the LOE / e-sign email end-to-end ITSELF — confirm it arrived, open it, read it, screenshot it. **Codex and computer-use are explicitly NOT involved in ANY email step.**

- The tooling is the **EPA BC-Support system** (`~/Development/02-Project-Planning/EPA BC-Support system/`) — OAuth'd Python on **bc@crowestudio.com**: read, search, SEND, open threads, plus the `email-*` slash commands (`/email-check`, `/email-view`, etc.).
- It is **NOT a `gmail` binary** and it is **NOT Codex**. It is a Claude Code CLI suite built for exactly this.
- So the test loop after a send: use the BC email CLI to confirm the "Letter of Engagement — Ready for Signature" email landed in bc@crowestudio.com, open it, read the body, click/extract the sign link, screenshot.
- **The ONLY dependency** is a one-time OAuth re-auth (`reauth_gmail.py`) when the token expires — that refreshes the CLI's OWN login. It is NOT a Codex task and NOT a per-test step.

**PRODUCTION TARGET (TO-BUILD):** retire Resend entirely → **Microsoft Graph `sendMail` from a valta.ca mailbox**. That's the only way to (a) send from a real valta.ca address and (b) deliver to real client inboxes. Until that swap lands, this phase cannot go to a real client.

---

## 4. Signature + date anchor tags

**GOAL:** DocuSeal automatically places an interactive signature box + date box at exactly the right spot on the rendered LOE, with zero manual field-dragging in the DocuSeal UI.

**CURRENT STATE:** ✅ Mechanism works, ⚠️ V07 re-anchor is an open item (Section 7).

- The LOE HTML carries custom anchor tags in the signature block:
  - `<signature-field name="Client Signature" role="First Party" required="true" ...>`
  - `<date-field name="Signature Date" role="First Party" required="true" ...>`
- On `/submissions/html`, DocuSeal parses these tags and converts them into real interactive fields bound to the `First Party` submitter. The `role` on the tag MUST equal the submitter `role` in the payload — mismatch = unbound fields = client can't sign.
- `generateAndSendLOE` warns (console only) if `<signature-field>` or `<date-field>` is missing from the HTML — a soft guard, not a hard block.
- The anchor block currently lives in the static template files (`v4Template.ts` / `v3Template.ts`). The live render uses the Supabase `loe_templates` DB row (Phase 4) — so the anchor tags must exist IN THE DB ROW too. Re-confirming the V07 DB row has correctly-placed anchors is the open item in Section 7.

---

## 5. The completion round-trip

**GOAL:** When the client finishes signing, the signed timestamp lands on the job + the ClickUp card automatically, so the team sees "LOE Signed" without anyone touching the dashboard.

**CURRENT STATE:** ✅ Wired, ⚠️ unproven end-to-end (no full human-sign cycle run in test yet).

- DocuSeal fires a webhook to `docuseal-webhook` on two events:
  - **`submission.created`** → "LOE Sent" — stamps `loe_sent_at` on `job_loe_details` + writes the `▸ LOE Sent: <ts>` line on the ClickUp card.
  - **`submission.completed`** → "LOE Signed" — stamps the signed timestamp + writes `▸ LOE Signed: <ts> by <signer>` on the ClickUp card, and grabs the signed PDF (`documents[0]`).
- **Job lookup is two-path** (mirrors the Valcre two-path pattern): first by `docuseal_submission_id` on `job_loe_details` (production path), fallback to `metadata.job_id` (test mode), and if found by metadata it back-fills the `docuseal_submission_id`. If neither resolves, the webhook logs + returns `200 success` (deliberately does NOT fail — DocuSeal would otherwise retry forever).
- The ClickUp update is regex-replace into the existing card description (`▸ LOE Sent:` / `▸ LOE Signed:` blank-line replacement, with fallbacks if the lines aren't found). ClickUp failures are swallowed (logged, not thrown) — the DocuSeal/DB update is treated as more important.

---

## 6. ⭐ Can the e-sign be COMPLETED programmatically?

**The question Ben asked:** is there a programmatic DocuSeal "complete submission as the signer" path (API / headless), or does a real human have to click through the portal and sign?

**INVESTIGATED ANSWER — YES, there is a programmatic complete-as-signer path. A human portal click is NOT required.**

Verified against DocuSeal's live API docs (docuseal.com/docs/api). The decisive evidence is the **Update-a-submitter** endpoint (`PUT /submitters/{id}`), which exposes a `completed` parameter:

> **`completed` (Boolean)** — *"Pass `true` to mark submitter as completed and auto-signed via API."*

It also accepts a **`values` (Object)** param — *"An object with pre-filled values for the submission. Use field names for keys."* So a single API call can fill the field values AND mark the submitter completed/auto-signed. That fires the same `submission.completed` webhook that the human-sign path fires — meaning the existing Section 5 round-trip (DB stamp + ClickUp "LOE Signed") triggers identically whether a human signs or we auto-complete via API.

**What this means for the test loop:**
- We do NOT need Codex computer-use to drive the DocuSeal portal UI for a smoke test. We can: create the submission (existing send path), then `PUT /submitters/{submitter_id}` with `completed: true` (+ optional `values`), and watch the completion webhook stamp the signed date.
- The submitter ID comes back in the `/submissions/html` response (the `submitters[]` array — same place the slug lives).
- This auto-complete is a TEST capability, not a production behavior — in production the real client signs through the portal. But it lets us prove the FULL Phase-5 round-trip (send → "sign" → signed-date-on-job-and-ClickUp) without a human and without computer-use.

**Caveat to confirm at execution time:** the `completed: true` auto-sign is documented on the hosted API; confirm the test API key/account tier permits it (some DocuSeal plan tiers gate API auto-completion). If a 4xx comes back on the `completed` flag, THEN — and only then — Codex computer-use against the portal is the fallback. But the API path is the default and the documented answer is that it exists.

---

## 7. Open items (TO-BUILD)

- **Production email = Microsoft Graph `sendMail` from valta.ca** — retire Resend. The Resend sandbox can only reach bc@crowestudio.com; real clients are unreachable until this swaps. Hard blocker for going live (Section 3).
- **Re-anchor the V07 signature field** — confirm the live `loe_templates` V07 DB row carries correctly-placed `<signature-field>` + `<date-field>` anchors with `role="First Party"`. The anchors currently live in the static template files; the DB row is what actually ships (Phase 4). Mismatch = unbound signature field.
- **Sync the template selectors** — the LOE-Version dropdown (render side) and the e-sign modal must BOTH point at V07. If render uses V07 but e-sign grabs a stale template, the signed document differs from the previewed one.
- **Template-ID / API-key discrepancy** — clean up the dead static-template path: `docuseal.ts` hardcodes template `1680270` + `VITE_DOCUSEAL_API_KEY` against `api.docuseal.co`; the live path (`generateLOE` + proxy) uses NO template_id + a hardcoded server key against `api.docuseal.com`. Two API bases (`.co` vs `.com`), two keys, one dead path. Consolidate to the HTML-anchor path + one key (server-side, env, not hardcoded).
- **Cleanup: four `send-loe-email*` functions** — only `-fixed` is live; archive the other three.

---

## 8. Tools / CLIs for this phase

> These markdowns double as a reminder of our capabilities + how we do the work. For Phase 5 specifically:

- **`/cli-apr-tools`** — Valcre / DocuSeal / Supabase ops. The DocuSeal submission create, the `PUT /submitters/{id}` auto-complete probe, reading `job_loe_details` / `loe_submissions` rows.
- **Supabase REST direct** — source `.env.local` for `VITE_SUPABASE_PUBLISHABLE_KEY`, then curl with `apikey` + `Authorization: Bearer` to read/verify `loe_sent_at` / signed timestamps + `docuseal_submission_id` after a send. (Reads/writes work; DDL needs service_role.)
- **`/supabase-deploy`** — deploy edge-function changes (`docuseal-proxy`, `docuseal-webhook`, the future Graph email function). Edge-function fixes ship here.
- **`/guide-vercel-deploy`** — Vite dev proxies `/api` to production Vercel, so client-side send-path changes need a deploy to take effect against the live functions.
- **`/cli-clickup-tools`** — verify the `▸ LOE Sent` / `▸ LOE Signed` lines actually landed on the card after the webhook fires.
- **BC email CLI suite (EPA BC-Support system)** — `~/Development/02-Project-Planning/EPA BC-Support system/`, the `/email-check` / `/email-view` slash commands + OAuth'd Python on bc@crowestudio.com. **This is how a Claude Code agent verifies the LOE email itself** (arrived / open / read / screenshot). NEVER Codex, NEVER computer-use for email. One-time `reauth_gmail.py` if the token's expired.
- **`/cli-browser-auto` + `/agent-screenshot`** (`--session apr-iso`, port 8086) — drive the "Preview & Send LOE" button, screenshot the preview modal + the DocuSeal signing portal. NOT `--cdp 9222` (that's KM-Exp).
- **DocuSeal API auto-complete** (Section 6) — the `PUT /submitters/{id}` `completed:true` call is how we close the round-trip in test WITHOUT Codex computer-use.
- **Codex computer-use** — FALLBACK ONLY, if the API auto-complete is gated by plan tier. Login-gated DocuSeal portal sign-click.

---

## 9. Definition of done

**Today-PASS (test environment):**
- "Preview & Send LOE" generates the LOE, creates a DocuSeal submission from raw HTML, returns a slug.
- Branded Valta email arrives at bc@crowestudio.com with a working sign link — **verified agent-side via the BC email CLI** (`/email-check` → open → read → screenshot), not Codex.
- The signing portal renders the LOE with an interactive signature + date field bound to First Party.
- Completing the submission (human portal sign OR API `completed:true` auto-sign per Section 6) fires `submission.completed`.
- The webhook stamps the signed timestamp on `job_loe_details` AND writes `▸ LOE Signed: <ts> by <signer>` on the ClickUp card.
- Proven by: reading the `loe_submissions` / `job_loe_details` rows + the ClickUp card description after the round-trip.

**Goal-PASS (production):**
- All Today-PASS, PLUS:
- Email sends from a real **valta.ca** address via Microsoft Graph and delivers to a real client inbox (Resend retired).
- V07 anchors confirmed in the live DB template row; render selector + e-sign selector both V07.
- Single consolidated DocuSeal path (no dead static-template/`.co`/second-key code).
