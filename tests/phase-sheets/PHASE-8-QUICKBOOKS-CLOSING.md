---
content_type: stage-anatomy
title: Phase 8 — Closing — Pay → Paid (QuickBooks)
status: TO-BUILD — fully greenfield; sandbox path confirmed ready
created: 2026-06-11
owner: co-architect (coordinates) · react-spec (build) · qa-agent (verify)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
tags: [apr-workflow, stage-anatomy, phase-sheet, closing-sequence, quickbooks, payment, intuit, webhook, paid-trigger, testing]
---

# Phase 8 — Closing: Pay → Paid (QuickBooks)

**Tags:** #stage-anatomy #phase-sheet #closing-sequence #quickbooks #payment #intuit #paid-trigger
**Entities:** [[APR-Testing]] [[QuickBooks]] [[Intuit]]

> **What this phase covers:** the LOE has been signed (Phase 5 / Phase 6). Phase 8 is everything from DocuSeal's `submission.completed` event through to the job being marked Paid in the app, the ClickUp card flipped, and the receipt email sent. It is the final pipeline phase.

---

## Index

1. [What it is](#1--what-it-is)
2. [Where it lives](#2--where-it-lives)
3. [The fields / data](#3--the-fields--data)
4. [Data flow in → out](#4--data-flow-in--out)
5. [Trigger / gating logic](#5--trigger--gating-logic)
6. [User + agent flow](#6--user--agent-flow)
7. [Tools / CLIs for this phase](#7--tools--clis-for-this-phase)
8. [Test + verify](#8--test--verify)
9. [Goal vs current state](#9--goal-vs-current-state)
10. [Known bugs / to-build](#10--known-bugs--to-build)
11. [Production wiring / cutover](#11--production-wiring--cutover)
12. [Sources](#12--sources)

---

## 1 — What it is

**GOAL:** After the client signs the LOE, the app automatically sends a branded thank-you email and a QuickBooks invoice; when the client pays, an Intuit webhook triggers a receipt email, flips the job status to `paid`, and updates the ClickUp card — with no manual action from the Valta team.

Phase 8 is the closing choreography — it begins when DocuSeal fires `submission.completed` (the same event Phase 5 already handles) and ends when the job record carries `status = paid` and the ClickUp card reads `▸ Paid`. It is the last phase of the pipeline. Everything upstream (intake through LOE e-sign) is prior phases; nothing downstream depends on this phase.

**Current state:** this phase is fully greenfield. No QuickBooks edge function, no Intuit OAuth wiring, no `/pay/:jobId` route, no `quickbooks-webhook` function exists in the repo. A `// TODO: Trigger payment flow (GHL integration)` placeholder sits at line ~395 of `supabase/functions/docuseal-webhook/index.ts` — that is the attach point for Trigger 1. The merchant-account application has not been submitted (Ben action). The sandbox path is confirmed ready to build against now.

---

## 2 — Where it lives

**GOAL:** Two new edge functions, one new React route, and extensions to existing DB columns are the footprint of this phase.

**Current state:** nothing is built yet. The expected locations once built:

- **New edge functions (to create):**
  - `supabase/functions/create-qb-invoice/index.ts` — Trigger-1 handler; called from docuseal-webhook at the TODO attach point. Creates QBO Customer + Invoice, persists QB IDs, sends thank-you email.
  - `supabase/functions/quickbooks-webhook/index.ts` — Trigger-2 handler; receives Intuit webhook on `Payment` event, verifies signature, fetches Payment, matches invoice, flips status.

- **Modified edge function:**
  - `supabase/functions/docuseal-webhook/index.ts` — extend at line ~395 (the existing `// TODO: Trigger payment flow` placeholder) to call `create-qb-invoice`.

- **New React route (to create):**
  - `/pay/:jobId` — the thank-you/payment page the client lands on after signing. Reads `qb_invoice_link` from DB (no live QB call). Email and DocuSeal redirect point here.

- **Local dev:** `http://localhost:8086/pay/:jobId` (Vite dev server, port 8086).
- **Production URL:** `https://apr-dashboard-v3.vercel.app/pay/:jobId`
- **Deploy skill:** [/supabase-deploy](~/.claude/skills/supabase-deploy/SKILL.md) for edge functions; [/guide-vercel-deploy](~/.claude/skills/guide-vercel-deploy/SKILL.md) for the React route.

---

## 3 — The fields / data

**GOAL:** All closing state is carried on `job_loe_details` (same table that already holds DocuSeal columns and the LOE fee). No new table needed.

**Current state:** the columns below do not yet exist — they are the migration target. Source of truth for the full field map is [00-CLOSING-PAYMENT-FEATURE.md](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/00-CLOSING-PAYMENT-FEATURE.md).

| Column | Table | Type | Purpose |
|--------|-------|------|---------|
| `qb_invoice_id` | `job_loe_details` | text | QBO invoice ID; idempotency key — never create a second invoice if this is set |
| `qb_invoice_link` | `job_loe_details` | text | QuickBooks-hosted "Pay Now" URL; stored at invoice-create time; email + `/pay/:jobId` both read this |
| `qb_payment_id` | `job_loe_details` | text | QBO payment ID; dedupe key for the paid webhook |
| `payment_status` | `job_loe_details` | text | `loe_signed` → `loe_signed_awaiting_payment` → `paid` |
| `amount_paid` | `job_loe_details` | numeric | Confirmed amount from QB payment record |
| `paid_at` | `job_loe_details` | timestamptz | When the QB paid webhook fired |

**Fee source:** `total_fee` on `job_loe_details` — the quote amount the LOE was built from. The invoice line item = this value. Never hand-entered for the invoice.

---

## 4 — Data flow in → out

**GOAL:** The DocuSeal-signed event hands off cleanly to the QB invoice create, and the QB paid event hands off cleanly to the dashboard status update — each step reads from the DB and writes back to it so any downstream consumer sees current state.

**Inbound (from Phase 5 / docuseal-webhook):**
- `docuseal_submission_id` on `job_loe_details` — already written by the sign-send path; used by docuseal-webhook to look up the job.
- `total_fee` on `job_loe_details` — the invoice amount.
- `client_first_name`, `client_last_name`, `client_email` on the job record — used to create/find the QBO Customer.
- Valcre job number, property address — identifying info for the invoice description.

**Trigger 1 writes:**
- `qb_invoice_id`, `qb_invoice_link` onto `job_loe_details`.
- `payment_status = loe_signed_awaiting_payment`.
- Sends Resend thank-you/invoice email to `bc@crowestudio.com` (test) / client email (production).

**Trigger 2 writes:**
- `qb_payment_id`, `amount_paid`, `paid_at` onto `job_loe_details`.
- `payment_status = paid`.
- ClickUp card: appends `▸ Paid: <ts>` line (same regex-replace pattern as `▸ LOE Signed`).
- Sends Resend receipt email.

**Downstream:** `payment_status = paid` is the final pipeline state. The dashboard reads it via the existing status mechanism — no extra wiring needed there.

---

## 5 — Trigger / gating logic

**GOAL:** Two automatic triggers close the job. Both are event-driven, neither requires dashboard action from the Valta team.

### Trigger 1 — LOE signed → thank-you email + create + send QuickBooks invoice

**Event:** DocuSeal `submission.completed` — the same webhook event already handled by `docuseal-webhook/index.ts`.

**Attach point:** line ~395 of `docuseal-webhook/index.ts`, which currently reads:
```
// TODO: Trigger payment flow (GHL integration)
```
This is replaced with a call to the new `create-qb-invoice` edge function. The function is isolated (not inlined) so DocuSeal webhook retries cannot double-create an invoice.

**Gating / idempotency:** `create-qb-invoice` checks `qb_invoice_id` on the job before creating — if already set, it skips the create and re-sends the existing link. This prevents double-invoices on DocuSeal retries.

**Trigger 1 chain:**
1. `docuseal-webhook` fires on `submission.completed`, stamps `loe_signed_at`, flips ClickUp "LOE Signed" (existing behavior — unchanged).
2. At the TODO attach point, calls `create-qb-invoice` with the job ID.
3. `create-qb-invoice`: OAuth → find/create QBO Customer → create Invoice (fee = `total_fee`, `BillEmail.Address` = client email, `AllowOnlineCreditCardPayment: true`, `AllowOnlineACHPayment: true`) → `GET invoice?include=invoiceLink` → persist `qb_invoice_id` + `qb_invoice_link` → flip `payment_status = loe_signed_awaiting_payment` → Resend thank-you email carrying the invoice link.
4. **The thank-you page** `/pay/:jobId` is the landing URL (also in the email). It reads `qb_invoice_link` from DB — no live QB call on page load, no double-create risk.

### Trigger 2 — Invoice paid → Intuit webhook → receipt email + status flip + ClickUp

**Event:** Intuit fires a `Payment` webhook to `quickbooks-webhook` endpoint when the invoice is paid.

**Important:** Intuit webhook payloads carry NO data — they are a trigger notification only. The handler must `GET /v3/company/{realmId}/payment/{id}` to get the actual payment record, then follow `LinkedTxn` to confirm the Invoice ID matches `qb_invoice_id`.

**CloudEvents deadline:** Intuit is migrating webhook payloads to CloudEvents format by 31 July 2026. The `quickbooks-webhook` handler must be built to read the CloudEvents shape (or include a normalizing adapter), not the legacy shape.

**Trigger 2 chain:**
1. Intuit fires webhook to `quickbooks-webhook/index.ts`.
2. Verify `intuit-signature` (HMAC-SHA256 over raw body using verifier token).
3. Fetch Payment by ID from QBO API.
4. Match `LinkedTxn` Invoice ID → `qb_invoice_id` on `job_loe_details` → resolve job.
5. Idempotency: if `qb_payment_id` already set for this job, skip (already processed).
6. Reconcile: `Balance == 0` = fully paid; partial payments do not trigger `paid`.
7. Write `qb_payment_id`, `amount_paid`, `paid_at`, flip `payment_status = paid`.
8. ClickUp: append `▸ Paid: <ts>` line (same pattern as existing LOE Signed update).
9. Send Resend receipt email.

**Proposed ClickUp status path:** Pending → Invoice Sent → Paid. (Confirm "Paid" wording with client before wiring.)

---

## 6 — User + agent flow

**GOAL:** The client experience is seamless — sign, see a thank-you, pay. The Valta team sees status updates in the dashboard and ClickUp with no manual action. The agent test path exercises both triggers without real money.

### Human flow (client-side)

1. Client receives Valta-branded LOE email (Phase 5) → clicks sign link → signs in DocuSeal.
2. DocuSeal redirects client to `/pay/:jobId` (the thank-you page) OR client receives a separate thank-you email.
3. Thank-you page shows a confirmation message + a "Pay Now" button linking to `qb_invoice_link` (the QuickBooks-hosted payment page).
4. Client pays on the QB-hosted page (Intuit handles PCI / card / ACH / EFT — we never see card data).
5. Client receives the QB receipt email (QB native) + optionally a Valta receipt email.

### Agent test path (sandbox, no real money)

The sandbox lets us test the full loop without the merchant account or a real client.

**Trigger 1 test:**
1. Use the `docuseal-webhook` auto-complete path (Phase 5 Section 6): `PUT /submitters/{id}` with `completed: true` → fires `submission.completed` exactly as a real signing does.
2. Confirm `create-qb-invoice` is called: read `qb_invoice_id` + `qb_invoice_link` from `job_loe_details` via Supabase REST.
3. Verify `payment_status = loe_signed_awaiting_payment`.
4. Verify thank-you email arrived at `bc@crowestudio.com` via BC email CLI (`/email-check` → open → read → extract invoice link).
5. Verify `/pay/:jobId` loads and shows the invoice link.

**Trigger 2 test (sandbox Payment simulation):**
1. Use the QBO sandbox API to record a Payment against the invoice (`POST /v3/company/{sandboxRealmId}/payment`) — the sandbox accepts this without real money.
2. The sandbox fires the Intuit webhook to the `quickbooks-webhook` edge function (must be deployed and publicly accessible; dev tunnel or Vercel deploy required).
3. Verify `payment_status = paid`, `qb_payment_id`, `paid_at` written to `job_loe_details`.
4. Verify ClickUp card has `▸ Paid: <ts>` line via `/cli-clickup-tools`.
5. Verify receipt email arrived at `bc@crowestudio.com` via BC email CLI.

**Never hand-fill payment data.** The fee always comes from `total_fee` on `job_loe_details`. The agent never enters an amount manually.

---

## 7 — Tools / CLIs for this phase

**GOAL:** Every step of the build and test has a CLI or skill; nothing requires manual browser interaction or Codex.

- **`/cli-apr-tools`** — Valcre / DocuSeal / Supabase ops. Use for reading `job_loe_details` rows, triggering the DocuSeal auto-complete, verifying DB writes after both triggers.

- **Supabase REST direct** — source `.env.local` for keys, then curl with `apikey` + `Authorization: Bearer` to read `qb_invoice_id`, `qb_invoice_link`, `payment_status`, `paid_at` after each trigger. Reads/writes work with publishable key; DDL (adding columns) needs service_role.

- **`/supabase-deploy`** — deploy the two new edge functions (`create-qb-invoice`, `quickbooks-webhook`) and the extended `docuseal-webhook`. The only deploy path for Supabase functions.

- **`/guide-vercel-deploy`** — deploy the new `/pay/:jobId` React route. `npm run build` locally first to catch TypeScript errors; then `vercel --prod` for live output.

- **QBO sandbox API (direct curl)** — `POST /v3/company/{sandboxRealmId}/payment` to simulate a paid event in the sandbox. No special CLI needed; curl against `https://sandbox-quickbooks.api.intuit.com/`.

- **`/cli-clickup-tools`** — verify the `▸ Paid: <ts>` line landed on the ClickUp card after Trigger 2 fires.

- **BC email CLI suite (EPA BC-Support system)** at [~/Development/02-Project-Planning/EPA BC-Support system/](~/Development/02-Project-Planning/EPA BC-Support system/) — the `/email-check` / `/email-view` slash commands + OAuth'd Python on `bc@crowestudio.com`. **This is how an agent verifies both the thank-you email (Trigger 1) and the receipt email (Trigger 2).** Read the inbox to confirm receipt, open it, read the body, extract the invoice link. NEVER Codex for email verification.

- **`/cli-browser-auto` + `/agent-screenshot`** (`--session apr-iso`, port 8086) — drive the `/pay/:jobId` thank-you page, screenshot the invoice link button. NOT `--cdp 9222` (that is KM-Exp).

- **Codex computer-use** — NOT used for this phase. No payment portal interaction via Codex. The QB sandbox API handles all payment simulation programmatically.

---

## 8 — Test + verify

**GOAL:** Both triggers are proven end-to-end in the sandbox before any production cutover. Evidence = DB writes + ClickUp card + email arrival, not just console logs.

### Trigger 1 test protocol

| Step | Action | Evidence required |
|------|--------|-------------------|
| 1 | Fire `submission.completed` via DocuSeal auto-complete (`PUT /submitters/{id} completed:true`) | 200 response from DocuSeal API |
| 2 | Read `job_loe_details` row | `qb_invoice_id` set, `qb_invoice_link` set, `payment_status = loe_signed_awaiting_payment` |
| 3 | Check thank-you email | BC email CLI confirms email arrived at `bc@crowestudio.com`; body has "Pay Now" button; invoice link extracted + valid (opens QB-hosted page) |
| 4 | Load `/pay/:jobId` | Page renders, shows invoice link button, no live QB call on load |

### Trigger 2 test protocol

| Step | Action | Evidence required |
|------|--------|-------------------|
| 1 | POST sandbox Payment against the invoice | 200 from QBO sandbox API; Payment ID returned |
| 2 | Confirm Intuit fires webhook | `quickbooks-webhook` edge function log shows receipt + signature verify pass |
| 3 | Read `job_loe_details` row | `qb_payment_id` set, `amount_paid` matches invoice, `paid_at` set, `payment_status = paid` |
| 4 | Check ClickUp card | `/cli-clickup-tools` reads card description → `▸ Paid: <ts>` line present |
| 5 | Check receipt email | BC email CLI confirms receipt email arrived at `bc@crowestudio.com` |

**Capturer ≠ verifier:** the agent that fires the trigger is NOT the agent that reads the DB / email to confirm. Two distinct reads, two distinct commands — not just "the function didn't error."

**Test ClickUp list:** `901709622357` (BC test list) during all testing. Never the client's production list.

---

## 9 — Goal vs current state

**GOAL:** The full closing loop runs automatically and requires zero manual action from the Valta team — sign, invoice created + sent, pay, status flipped to Paid, ClickUp updated, receipt emailed.

The invoice-only model (client pays by e-transfer / cheque / etc. and the invoice is marked Paid) ships WITHOUT the QuickBooks Payments merchant account. The live Pay Now card-charge path requires the merchant account but is a later upgrade — it does not gate the core closing automation.

---

**Current state:** fully greenfield. Itemised:

- ✅ `docuseal-webhook` exists and handles `submission.completed` — the Trigger 1 attach point (`// TODO` at line ~395) is ready to extend.
- ✅ `total_fee` on `job_loe_details` is the invoice amount source — already populated by the LOE flow.
- ✅ Resend + `send-loe-email-fixed` infrastructure exists — cloning this sender pattern for the thank-you and receipt emails is a known, proven path.
- ✅ `updateClickUpLOEStatus()` exists in the shared utilities — the Trigger 2 ClickUp write copies this pattern.
- ✅ Sandbox path confirmed: free Intuit Developer account + auto-provisioned sandbox company = full loop testable now, no merchant account needed.
- ✅ Canada viability confirmed: QuickBooks Payments is available to Canadian merchants (cards, Apple Pay, EFT).
- ❌ `create-qb-invoice` edge function — does not exist.
- ❌ `quickbooks-webhook` edge function — does not exist.
- ❌ QB OAuth token store + refresh — not wired.
- ❌ New DB columns (`qb_invoice_id`, `qb_invoice_link`, `qb_payment_id`, `payment_status`, `amount_paid`, `paid_at`) — not migrated.
- ❌ `/pay/:jobId` React route — does not exist.
- ❌ Thank-you email (Trigger 1 Resend send) — not built.
- ❌ Receipt email (Trigger 2 Resend send) — not built.
- ❌ Merchant account application (for live Pay Now card charging) — not submitted. Ben action, starts in parallel with the build.

**What needs the merchant account vs not:**

The invoice-only model — where Valta sends a QuickBooks invoice and the client pays by e-transfer, cheque, or any offline method, then Valta marks it Paid in QBO — requires **no merchant account**. The QBO invoice is created, the "paid" webhook fires when the invoice is manually marked Paid in QBO, and the full Trigger 2 chain runs. This path builds and ships now.

The live "Pay Now" button on the invoice that actually charges a card through Intuit's hosted payment page requires the **QuickBooks Payments merchant account** (underwriting approval, Canadian business registration, ~weeks timeline). This is a later upgrade to the same flow — no structural change to the edge functions, just enabling online payment on the invoice object and the merchant account being active.

---

## 10 — Known bugs / to-build

All items are greenfield build tasks (nothing is broken yet — nothing is built).

**Setup cluster — Ben actions (blocks build start):**
- Intuit Developer account at `developer.intuit.com` → sandbox app → Client ID + Client Secret → sandbox realmId. These become edge-function env vars.
- OAuth2 consent flow run once (authorization-code grant, scopes `com.intuit.quickbooks.accounting` + `com.intuit.quickbooks.payment`) to get the initial access + refresh token pair. Tokens stored as Supabase edge-function secrets.
- (Later, not a build gate) Submit QuickBooks Payments merchant account application — Canadian business info, underwriting approval required. Start early in parallel.

**Build tasks — react-spec:**
- DB migration: add 6 columns to `job_loe_details` (see Section 3). Supabase MCP or CLI.
- `create-qb-invoice` edge function: QB OAuth token fetch/refresh → find-or-create QBO Customer → create Invoice → `GET invoice?include=invoiceLink` → persist QB IDs + link → flip `payment_status` → Resend thank-you email.
- Extend `docuseal-webhook/index.ts` at line ~395: replace the TODO with a call to `create-qb-invoice`.
- `quickbooks-webhook` edge function: verify `intuit-signature` (HMAC-SHA256, raw body) → parse CloudEvents or legacy shape (see note below) → GET Payment from QBO → match Invoice → idempotency check → write paid fields → ClickUp `▸ Paid` → Resend receipt email.
- `/pay/:jobId` React route: read `qb_invoice_link` from DB; render thank-you message + Pay Now button; no live QB call.
- QB OAuth token refresh: Intuit refresh tokens rotate; the token store must update on every refresh.

**Known gotcha — CloudEvents deadline:**
Intuit is migrating webhook payloads to CloudEvents format by **31 July 2026**. Build `quickbooks-webhook` to read CloudEvents shape (`type`, `intuitentityid`, `intuitaccountid`) or include a normalizing adapter that handles both shapes. Do not build only against the legacy shape.

**Known gotcha — sandbox CA region:**
Intuit docs are US-first; Canadian EFT/ACH behavior may differ. Run a sandbox spike to confirm `AllowOnlineACHPayment` behavior in a Canadian QBO company before committing the create-invoice wiring.

**Owner routing:**
- Ben: setup cluster (Intuit account + OAuth consent + merchant application).
- react-spec: all build tasks above.
- ui-designer: `/pay/:jobId` thank-you page visual design (see [LOE Closing Infographic Plan](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-CLOSING-INFOGRAPHIC-PLAN.md)).
- qa-agent: both trigger test protocols (Section 8).

---

## 11 — Production wiring / cutover

**GOAL:** Sandbox builds and proves the full loop; production cutover is a config swap — the same edge functions point at the live QBO company instead of the sandbox company.

### Sandbox → production cutover

The only structural difference between sandbox and production is the QB API base host and the OAuth credentials:

| Config | Sandbox | Production |
|--------|---------|------------|
| QBO API host | `https://sandbox-quickbooks.api.intuit.com` | `https://quickbooks.api.intuit.com` |
| OAuth Client ID/Secret | Sandbox app keys (Intuit Developer portal) | Production app keys |
| realmId | Sandbox company realmId | Live Valta QBO company realmId |
| Invoice online payment | Not real | Requires approved QuickBooks Payments merchant account |

All of these are edge-function env vars (Supabase secrets). The cutover is: update secrets → redeploy the two edge functions. No code changes.

### ClickUp list IDs

- Testing: list `901709622357` (BC test list). Always during sandbox testing.
- Production: list `901402094744` (Valta workspace). Only after Ben confirms production ready.

### Merchant account gate

The live Pay Now card-charge path on the invoice is gated on the QuickBooks Payments merchant account approval (Canadian underwriting, not instant). Ben submits the application in parallel with the build. Until it is approved:

- The invoice is created and sent.
- The client pays offline (e-transfer / cheque).
- Valta marks the invoice Paid manually in QBO.
- The `Payment` webhook fires exactly as it would for an online payment.
- The full Trigger 2 chain runs: `paid_at`, ClickUp, receipt email.

The merchant account is a quality-of-life upgrade (client pays online with a card) — it is NOT a gate on the closing automation shipping.

### Email sender

Both Trigger 1 and Trigger 2 emails use Resend (`send-loe-email-fixed` pattern). In test, sender is the Resend sandbox domain — delivery only to `bc@crowestudio.com`. Production target is the same Microsoft Graph `sendMail` from a valta.ca mailbox that is the production target for all other phase emails (shared blocker with Phase 5). Until Graph is wired, production emails are limited to the Resend sandbox recipient.

---

## 12 — Sources

All facts on this page were verified against:

- [00-CLOSING-PAYMENT-FEATURE.md](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/00-CLOSING-PAYMENT-FEATURE.md) — canonical feature sheet; current build state, sequence, owners.
- [QUICKBOOKS-SANDBOX-PAYMENT-PATH.md](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/QUICKBOOKS-SANDBOX-PAYMENT-PATH.md) — sandbox setup brief; the two-trigger framing; invoice-only vs merchant-account distinction.
- [QUICKBOOKS-PAYMENT-INTEGRATION-RESEARCH.md](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/QUICKBOOKS-PAYMENT-INTEGRATION-RESEARCH.md) — Part 1 (Canada confirmed, recommended approach) + Part 2 (full chain architecture, new columns, gotchas).
- [CLIENT-CLOSING-SEQUENCE-ROADMAP.md](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/CLIENT-CLOSING-SEQUENCE-ROADMAP.md) — Ben's vision + trigger chain + owners.
- `supabase/functions/docuseal-webhook/index.ts` line ~395 — `// TODO: Trigger payment flow (GHL integration)` — confirmed as the Trigger 1 attach point.
- `supabase/functions/` directory listing — confirmed no QuickBooks edge functions exist (fully greenfield).
- [PHASE-5-LOE-ESIGN.md](~/Development/APR-Dashboard-v3/tests/phase-sheets/PHASE-5-LOE-ESIGN.md) — voice/format reference; docuseal-webhook round-trip pattern this phase extends.

---

**Last reviewed:** 2026-06-11 by co-architect — fully greenfield, sandbox path confirmed ready, merchant account is not a build gate.
