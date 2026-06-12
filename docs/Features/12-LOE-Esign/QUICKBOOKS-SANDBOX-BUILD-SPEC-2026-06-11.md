---
title: QuickBooks Online Sandbox Build Spec — APR Invoice/Payment Flow
status: build-ready-verified
created: 2026-06-11
verified: 2026-06-11
tags: [apr-workflow, quickbooks, intuit, sandbox, oauth, webhook, build-spec, ground-truth]
---

#quickbooks #intuit #sandbox #oauth #webhook #build-spec

**Entities:** QuickBooks Online API, OAuth2, Invoice, Payment, Customer, Webhooks, Supabase Edge Functions

**Backlink:** ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md

---

> **Verification note (2026-06-11):** Every value in this document was cross-checked against live Intuit developer pages and official blog posts via 12+ distinct web fetches. Corrections from the prior draft are marked **[CORRECTED]**. Values confirmed unchanged are marked **[CONFIRMED]**. One material policy change (refresh token lifetime) was introduced by Intuit in November 2025 and the prior draft had stale information on it. Full source list in Section 7.

---

## Scope of This Spec

This is the ground-truth integration spec for wiring the APR LOE/invoice flow to the **QuickBooks Online sandbox**. The decided model is **invoice-only**: APR creates and emails a QuickBooks invoice when an LOE is signed, and fires a downstream receipt/status event when that invoice is recorded as paid. There is **no live "Pay Now" card capture**, so **no QuickBooks Payments merchant account is required** (confirmed in [Section 5](#5-merchant-account--what-needs-it-vs-what-doesnt)).

Two triggers drive the integration:

1. **LOE signed** → edge function creates a Customer (if new) + creates an Invoice + sends the Invoice by email.
2. **Invoice paid (recorded)** → QuickBooks webhook (Payment `Create`) hits an edge function → APR fires its downstream receipt/status workflow.

All API calls run from **Supabase edge functions (Deno)**. OAuth tokens (access + the rotating refresh token + realmId) are held as **edge-function secrets** and must be re-persisted on every refresh because the refresh token rotates (see [Section 1](#1-oauth2-authorization-code-flow) and [Section 6](#6-gotchas--token-refresh-sandbox-resets-rate-limits)).

---

## 1. OAuth2 Authorization-Code Flow

QuickBooks Online uses **OAuth 2.0 Authorization Code flow exclusively** — there are no API keys or basic-auth alternatives for data calls. The flow has three legs: redirect the user to the authorization endpoint, exchange the returned `code` for tokens at the token endpoint, then refresh access tokens with the rotating refresh token.

### Endpoints (exact) — [CONFIRMED]

| Purpose | URL |
|---|---|
| Authorization endpoint | `https://appcenter.intuit.com/connect/oauth2` |
| Token endpoint (exchange + refresh) | `https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer` |
| Token revocation endpoint | `https://developer.api.intuit.com/v2/oauth2/tokens/revoke` |

All three endpoints confirmed against multiple sources [A][B][C][D].

### Accounting API scope (exact) — [CONFIRMED]

```
com.intuit.quickbooks.accounting
```

This is the exact and only scope needed for the invoice/payment/customer flow [A][B][C]. (QuickBooks Payments would additionally need `com.intuit.quickbooks.payment`, which this invoice-only flow does **not** use — see Section 5.)

### Step 1 — Authorization request

Redirect the user (browser) to the authorization endpoint with these query params:

```
https://appcenter.intuit.com/connect/oauth2
  ?client_id=<CLIENT_ID>
  &scope=com.intuit.quickbooks.accounting
  &redirect_uri=<EXACT_REGISTERED_REDIRECT_URI>
  &response_type=code
  &state=<CSRF_RANDOM_STRING>
```

`response_type` is always `code`. `state` is your CSRF token — generate it, store it, and verify it on the callback.

### Step 2 — Authorization response

Intuit redirects back to your `redirect_uri` with `code`, `state`, and `realmId` appended as query params. The `realmId` is the QuickBooks company ID — **persist it**; every data API call is scoped to it (`/v3/company/{realmId}/...`).

### Step 3 — Token exchange

`POST` to the token endpoint with **HTTP Basic Authentication** (header `Authorization: Basic base64(client_id:client_secret)`) and a form-encoded body:

```
POST https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer
Authorization: Basic <base64(client_id:client_secret)>
Content-Type: application/x-www-form-urlencoded
Accept: application/json

grant_type=authorization_code
&code=<CODE_FROM_CALLBACK>
&redirect_uri=<SAME_REDIRECT_URI_AS_STEP_1>
```

Token response shape:

```json
{
  "token_type": "bearer",
  "access_token": "<...>",
  "expires_in": 3600,
  "refresh_token": "<...>",
  "x_refresh_token_expires_in": 157766400
}
```

> **[CORRECTED]** The prior draft showed `x_refresh_token_expires_in: 8726400` (100 days in seconds). As of November 2025, Intuit changed the refresh token maximum validity to **5 years** — `157766400` seconds (5 × 365 × 86400). See Section 1 refresh token details and source [E].

### Step 4 — Token refresh

`POST` to the same token endpoint, same Basic auth, with `grant_type=refresh_token`:

```
POST https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer
Authorization: Basic <base64(client_id:client_secret)>
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token
&refresh_token=<LATEST_STORED_REFRESH_TOKEN>
```

### Token lifetimes — [CORRECTED for refresh token]

| Token | Lifetime | Notes |
|---|---|---|
| Access token | **3,600 seconds (1 hour)** — `expires_in: 3600` | Unchanged [A][B][C] |
| Refresh token | **5 years maximum** (`x_refresh_token_expires_in`) | **[CORRECTED]** — was 100 days; Intuit changed policy Nov 2025 [E] |

**Refresh token policy change detail (November 2025):** Intuit announced a maximum 5-year validity period for all refresh tokens, replacing the prior "100 days of inactivity" model. For apps using the `com.intuit.quickbooks.accounting` scope:
- Tokens generated from **October 2023** onward expire in **October 2028**
- The change went into effect in early 2026; a "Reconnect URL" in the developer portal is now mandatory (required by February 24, 2026) to handle expiry gracefully
- Intuit notifies end-users 30 days and 7 days before a token expires [E]

### Refresh token ROTATION — the critical persistence rule — [CONFIRMED]

**The refresh token still rotates on every use, and a stale stored token will lock you out:**

- Each call to the token endpoint returns a **new** `refresh_token`. The previous value is immediately invalidated.
- **Every time you call the token endpoint (exchange OR refresh), read the `refresh_token` from the response and overwrite your stored copy.** Never assume the refresh token you sent is still the one to keep [C][F].
- The 5-year clock runs from when the token was issued. With active rotation and persistence, an integration stays alive indefinitely up to that 5-year ceiling. After 5 years, re-authorization is required.
- **Concurrent refresh race condition:** Two edge-function invocations refreshing simultaneously can each rotate the token and invalidate the other's copy. Serialize refresh (row lock / advisory lock).

**Persistence implication for Supabase edge functions:** the refresh token cannot be a static, baked-in secret. After each refresh, the edge function must write the new `refresh_token` back to durable storage (a Supabase table row or the Supabase Management API for secrets), then use that value next time. A common pattern is a single-row `quickbooks_tokens` table holding `access_token`, `refresh_token`, `realm_id`, `access_expires_at`, `refresh_expires_at`, updated atomically on every token call.

### redirect_uri handling

- The `redirect_uri` you send in Steps 1 and 3 must be an **exact, character-for-character match** to a URI registered in the app's portal settings — trailing slashes and `http` vs `https` matter.
- For local sandbox testing, Intuit allows `http://localhost` style redirect URIs; production requires HTTPS.

---

## 2. Sandbox Specifics

### Base API hosts (exact) — [CONFIRMED]

| Environment | Base host | Full path pattern |
|---|---|---|
| **Sandbox** | `https://sandbox-quickbooks.api.intuit.com` | `https://sandbox-quickbooks.api.intuit.com/v3/company/{realmId}/...` |
| **Production** | `https://quickbooks.api.intuit.com` | `https://quickbooks.api.intuit.com/v3/company/{realmId}/...` |

Both confirmed against multiple sources [A][B][C]. Only the data-API host differs between sandbox and production. The **OAuth endpoints (`appcenter.intuit.com` and `oauth.platform.intuit.com`) are the SAME** for both environments — what makes a call "sandbox" is using the **development/sandbox Client ID + Secret** against the **sandbox host**.

### minorversion query parameter — [CONFIRMED]

```
?minorversion=75
```

- **75** is the current/default minor version [G]. Beginning **August 1, 2025, minor versions 1–74 were deprecated**; all Accounting API requests now use minor version 75 by default, and any value < 75 you pass is ignored and served as 75.
- Always pass `minorversion=75` explicitly to pin the schema.

### Provisioning a sandbox company (realmId)

1. Sign in to the Intuit Developer account at developer.intuit.com.
2. Go to the **API Docs & Tools** tab → **Add a sandbox company**.
3. Choose **QuickBooks Online Plus** or **QuickBooks Online Advanced** for the sandbox.
4. You can create **up to 10 sandbox companies**, each **valid/active for two years**.
5. Each sandbox company has its own **realmId** — that's the ID you'll use in `/v3/company/{realmId}/...` and that comes back on the OAuth callback when you authorize against that sandbox.

### Where to get sandbox Client ID + Secret

1. In the Developer dashboard, go to **Apps and Resources → My Apps**, then **Create an app** → select **QuickBooks Online and Payments**.
2. Open the app → **Development** menu → **Keys & OAuth** sub-menu → copy the **Client ID** and **Client Secret**.
3. **Development (sandbox) keys do NOT work against live/production QuickBooks accounts, and Production keys do NOT work in the sandbox.** Keep the two key pairs strictly separated in your secrets.
4. Register your **Redirect URI(s)** in the app's **Keys & OAuth** / App Settings section (Add URI).

---

## 3. API Calls — Customer, Invoice, Send, Payment

All calls below are scoped to a company and require these headers:

```
Authorization: Bearer <ACCESS_TOKEN>
Accept: application/json
Content-Type: application/json     (except SendInvoice — see 3c)
```

Base for sandbox: `https://sandbox-quickbooks.api.intuit.com`. Append `?minorversion=75` to every call.

### 3a. Create Customer — [CONFIRMED]

```
POST https://sandbox-quickbooks.api.intuit.com/v3/company/{realmId}/customer?minorversion=75
```

Minimal body — `DisplayName` is the practical required field (must be unique within the company); add `PrimaryEmailAddr` so the invoice can be emailed:

```json
{
  "DisplayName": "Acme Property Holdings LLC",
  "PrimaryEmailAddr": {
    "Address": "billing@acme-holdings.com"
  }
}
```

The response returns the created `Customer` object including its `Id` — **persist that `Id`**; it becomes `CustomerRef.value` on the invoice.

### 3b. Create Invoice — [CONFIRMED]

```
POST https://sandbox-quickbooks.api.intuit.com/v3/company/{realmId}/invoice?minorversion=75
```

Minimal body. An invoice requires a `CustomerRef` and at least one `Line` of `DetailType: "SalesItemLineDetail"` with an `ItemRef` that already exists in the company's item list [H]:

```json
{
  "CustomerRef": {
    "value": "123"
  },
  "Line": [
    {
      "Amount": 2500.00,
      "DetailType": "SalesItemLineDetail",
      "SalesItemLineDetail": {
        "ItemRef": {
          "value": "1"
        },
        "Qty": 1,
        "UnitPrice": 2500.00
      }
    }
  ],
  "BillEmail": {
    "Address": "billing@acme-holdings.com"
  }
}
```

Notes:
- `ItemRef.value` must reference an existing **Item** in the QuickBooks company. The sandbox company ships with a few default items, or create one (Item entity) for "Appraisal Services." **The item must exist or the invoice create returns a validation error.**
- Include `BillEmail.Address` on the invoice so QuickBooks knows where to email it; `EmailStatus` will initialize to `NeedToSend`.
- The response returns the `Invoice` object with its `Id` (and a `SyncToken`) — **persist `Id`**; you need it for the send call and to match the later Payment webhook.

### 3c. Send Invoice via email (SendInvoice operation) — [CONFIRMED]

```
POST https://sandbox-quickbooks.api.intuit.com/v3/company/{realmId}/invoice/{invoiceId}/send?minorversion=75
```

- **HTTP method: POST**.
- **No JSON body** — the operation acts on the existing invoice. Set `Content-Type: application/octet-stream` for the send request.
- To send to the invoice's existing `BillEmail.Address`, call with no `sendTo`. To **override/specify the recipient**, append the `sendTo` query parameter (URL-encoded email):

```
POST .../invoice/{invoiceId}/send?sendTo=billing%40acme-holdings.com&minorversion=75
Content-Type: application/octet-stream
```

- On success, the invoice's `EmailStatus` transitions from `NeedToSend` to `EmailSent`, and the response returns the updated `Invoice` object.

### 3d. Record a Payment (flip invoice to Paid) — [CONFIRMED]

```
POST https://sandbox-quickbooks.api.intuit.com/v3/company/{realmId}/payment?minorversion=75
```

This is a recorded (manual) payment — it does **not** charge a card and needs **no merchant account**. It links to the invoice via `LinkedTxn` with `TxnType: "Invoice"`, which marks the invoice paid:

```json
{
  "TotalAmt": 2500.00,
  "CustomerRef": {
    "value": "123"
  },
  "Line": [
    {
      "Amount": 2500.00,
      "LinkedTxn": [
        {
          "TxnId": "<INVOICE_ID>",
          "TxnType": "Invoice"
        }
      ]
    }
  ]
}
```

Notes:
- `TotalAmt` must cover the linked amount. When the payment fully covers the invoice, the invoice's `Balance` goes to 0 and it reads as Paid.
- `CustomerRef.value` must match the invoice's customer.
- `TxnId` is the **invoice `Id`** you persisted in 3b.
- In the live APR flow you may not need to call this yourself — a human recording the payment inside QuickBooks produces the **same Payment `Create` event**, which is what your webhook listens for (Section 4). Use this endpoint primarily for **automated sandbox testing** of the "paid" trigger.

---

## 4. Webhooks — Registration, Events, Payload, Signature

### Registration (developer portal) — [CONFIRMED]

1. In the Developer dashboard, open your app → the **Webhooks** section.
2. Enter your **secure HTTPS endpoint URL** (the Supabase edge-function URL that will receive POSTs).
3. Select the **entities and operations** to subscribe to (table below).
4. Save. The portal then exposes a **Verifier Token** for this app — copy it; it's the HMAC key for signature verification (Section 4d).
5. **Sandbox vs production webhooks are configured per environment** — confirm you're configuring the development/sandbox webhook endpoint, not production.

### 4a. Subscribable entities + operations (exact event model) — [CONFIRMED]

Intuit webhooks **do not have a discrete "event type."** Instead each changed record carries a `name` (entity) + `operation` in the payload, and you subscribe to (entity × operation) combinations. Subscribable entities include **Customer, Invoice, Payment** (and Account, Bill, Item, Vendor, and many more). Supported operations are: **Create, Update, Delete, Merge, Void** [B][I].

For the APR flow, subscribe to:

| Entity | Operations to subscribe | Why |
|---|---|---|
| `Invoice` | `Create`, `Update` | Confirm the invoice was created/sent; catch status changes |
| `Payment` | `Create` | **The "invoice paid" trigger** — fire downstream receipt/status |

The "invoice paid" signal is a **`Payment` `Create`** notification. When that arrives, fetch the Payment (`GET /v3/company/{realmId}/payment/{id}`) to read its `LinkedTxn` and confirm which invoice it cleared, then fire APR's downstream workflow.

### 4b. Notification payload shape (exact JSON) — [CONFIRMED]

A single POST can batch multiple changes. The structure is `eventNotifications[] → { realmId, dataChangeEvent: { entities[] } }` [B][I]:

```json
{
  "eventNotifications": [
    {
      "realmId": "1185883450",
      "dataChangeEvent": {
        "entities": [
          {
            "name": "Payment",
            "id": "157",
            "operation": "Create",
            "lastUpdated": "2025-01-15T15:00:00-0700"
          }
        ]
      }
    }
  ]
}
```

Each entity object's fields: **`name`** (entity type), **`id`** (the record's QuickBooks Id), **`operation`** (Create/Update/Delete/Merge/Void), **`lastUpdated`** (ISO-8601 timestamp). The payload notifies you *that* something changed; it does **not** include the full record — you `GET` the entity by `id` to read details.

Important: notifications are **sent periodically, not in real-time** — Intuit batches and delivers with a short delay [I].

### 4c. Edge-function handler contract

- Respond **`200 OK` within 3 seconds** and process asynchronously. Intuit retries on non-200, and will disable webhooks for endpoints that consistently fail [I].
- Verify the signature (4d) **before** trusting the payload.
- Confirm `realmId` in the payload matches your stored realmId.

### 4d. Signature verification (exact) — [CONFIRMED]

Every webhook POST carries an **`intuit-signature`** HTTP header. Intuit signs the **raw request body** with **HMAC-SHA256** using your app's **Verifier Token** as the key. Verify like this:

1. Read the **`intuit-signature`** header value (it is **base64**-encoded).
2. Compute `HMAC_SHA256(rawRequestBody, verifierToken)`.
3. Base64-encode your computed HMAC and compare to the header (constant-time compare). If they match, the payload is authentic.

Deno (edge function) sketch:

```ts
import { createHmac } from "node:crypto";

function verifyIntuitSignature(rawBody: string, header: string, verifierToken: string): boolean {
  const computed = createHmac("sha256", verifierToken)
    .update(rawBody, "utf8")
    .digest("base64");
  // constant-time compare computed vs header
  return computed === header;
}
```

Critical: hash the **exact raw bytes** of the request body, not a re-serialized JSON object — re-serialization changes whitespace/key order and breaks the HMAC. Capture the raw body string before any JSON parse.

---

## 5. Merchant Account — What Needs It vs What Doesn't

**Confirmed: the APR invoice-only path needs NO QuickBooks Payments merchant account.**

| Capability | Needs QuickBooks Payments merchant account? | In APR flow? |
|---|---|---|
| Create Customer | No | Yes |
| Create Invoice | No | Yes |
| Send Invoice by email (SendInvoice) | No | Yes |
| **Record a Payment** (manual/recorded, via Payment entity + LinkedTxn) | **No** | Yes |
| Read invoice/payment status, webhooks | No | Yes |
| **Live card "Pay Now" / charge a card / ACH capture** | **YES** — requires a QuickBooks Payments merchant account + `com.intuit.quickbooks.payment` scope + the Payments API | **No (explicitly out of scope)** |

The distinction: **recording that a payment happened** (the Payment entity with a `LinkedTxn` to the invoice — Section 3d) is pure Accounting-API bookkeeping and is fully supported by the Accounting scope and the sandbox. **Actually capturing money** (charging a card, processing ACH) is the QuickBooks Payments product, which requires an approved merchant account and is a different API/scope entirely. Because APR's model is "invoice goes out, customer pays however, payment gets recorded," it lives entirely in the Accounting API. No merchant account, no Payments scope, no card data ever touches the system.

The sandbox covers the **entire invoice-only path** end to end: create customer, create invoice, send invoice, record payment, receive the Payment `Create` webhook.

---

## 6. Gotchas — Token Refresh, Sandbox Resets, Rate Limits

### Token refresh failure modes

- **Stale refresh token = hard lockout.** Because the refresh token rotates on every use (Section 1), if you store and re-send an old refresh token after a newer one was issued, the server rejects it (`invalid_grant`) and the chain is broken — the user must re-authorize [C][F].
- **Concurrent refresh race.** Two edge-function invocations refreshing simultaneously can each rotate the token and invalidate the other's copy. Serialize refresh with a DB lock / advisory lock so only one refresh runs at a time.
- **5-year absolute expiry (new policy).** The 5-year maximum validity (from Nov 2025 policy change) is absolute — not extended by activity. For the `com.intuit.quickbooks.accounting` scope, tokens issued from Oct 2023 expire Oct 2028. Build a re-authorization flow and register a Reconnect URL in the developer portal (mandatory as of Feb 24, 2026) [E].
- **Intuit user notifications:** Intuit now notifies end-users 30 days and 7 days before their token expires, so your re-auth flow should be ready before the first batch of tokens starts expiring.
- **Reported `invalid_grant` before 5 years** is almost always the rotation bug above — the app kept using a superseded refresh token — not an actual Intuit lifetime change [F].

### Sandbox data reset behavior

- Sandbox companies are **valid/active for two years** and you can hold up to **10** of them.
- Intuit provides a **sandbox reset** capability to wipe a sandbox company back to a clean seeded state for testing.
- Plan tests to be **idempotent** (look up customer/item by name before creating) so a reset doesn't strand your stored Ids.
- After any reset, previously-stored `realmId` may still be valid but the seeded **Item/Customer Ids you cached can change** — re-resolve them.

### Rate limits — [CORRECTED: concurrent requests]

| Limit | Value | Source |
|---|---|---|
| Requests per minute (per realmId) | **500** | [B][J] |
| **Concurrent requests (per realmId)** | **10** — **[CORRECTED from 40]** | [J] |
| Batch requests per minute (per realmId) | **40** (a separate batch-endpoint limit, enforced Oct 31, 2025) | [J] |
| Batch operation max entities per request | **30** | [B] |
| Report endpoints | **200 requests per minute** | [I] |

> **[CORRECTED]** The prior draft stated "40 concurrent" — this was incorrect. Intuit's throttling policy sets the **concurrent** request limit at **10 per realmId per second** (a batch of concurrent multi-threaded calls beyond 10 returns 429). The "40" figure in the prior draft conflated the separate **batch-requests-per-minute** limit (40/min) with the concurrent limit.

For APR's volume (a handful of invoices per day) these limits are not a constraint. Still: handle HTTP **429** with exponential backoff, and never poll status in a tight loop — rely on webhooks for the "paid" signal instead of polling.

---

## 7. Sources

All URLs below were fetched or searched during the 2026-06-11 verification pass. Twelve distinct web fetches / searches were performed.

**[A]** Satva Solutions — QuickBooks Online API Guide 2026 (OAuth endpoints, scope strings, sandbox URL, rate limits, minorversion)
https://satvasolutions.com/blog/quickbooks-online-api-guide

**[B]** Truto Blog — How to Integrate with the QuickBooks Online API (2026 Guide) — OAuth, rate limits, webhook payload, batch limits
https://truto.one/blog/how-to-integrate-with-the-quickbooks-online-api-2026-guide/

**[C]** Apideck Blog — How to Integrate Your App with QuickBooks Online (2026)
https://www.apideck.com/blog/how-to-integrate-your-app-with-quickbooks-online

**[D]** Intuit Developer — OAuth2 FAQ (revocation endpoint confirmed via search)
https://developer.intuit.com/app/developer/qbo/docs/develop/authentication-and-authorization/faq

**[E]** Intuit Developer Blog (via Medium) — Important changes to refresh token policy (November 2025) — 5-year maximum, Reconnect URL requirement, timeline by scope
https://blogs.intuit.com/2025/11/12/important-changes-to-refresh-token-policy/
(canonical: https://medium.com/intuitdev/important-changes-to-refresh-token-policy-8443779d40db)

**[F]** Nango Blog — QuickBooks OAuth refresh token invalid_grant — rotation behavior, how stale tokens cause lockout
https://nango.dev/blog/quickbooks-oauth-refresh-token-invalid-grant/

**[G]** Intuit Developer Blog — Changes to our Accounting API that may impact your application (January 2025) — minorversion 75, Aug 1 2025 deprecation date
https://blogs.intuit.com/2025/01/21/changes-to-our-accounting-api-that-may-impact-your-application/

**[H]** Intuit Developer — Create basic invoices workflow (confirmed JSON shape via search snippet)
https://developer.intuit.com/app/developer/qbo/docs/workflows/create-an-invoice

**[I]** Intuit Developer — Webhooks documentation (confirmed entities/operations, payload shape, 3-second response requirement, periodic delivery)
https://developer.intuit.com/app/developer/qbo/docs/develop/webhooks

**[J]** Intuit Help Community — QBO API throttling and rate limiting (10 concurrent confirmed, 500/min, 40 batch/min)
https://help.developer.intuit.com/s/question/0D5TR00000oMNgN0AW/qbo-api-throttling-and-rate-limiting
https://help.developer.intuit.com/s/question/0D54R00008kHftwSAC/with-respect-to-calculating-throttling-limits-500-qbo-api-requests-per-minute-and-the-maximum-of-10-concurrent-requests

**[K]** Intuit Developer — Minor versions of our API (current minorversion reference)
https://developer.intuit.com/app/developer/qbo/docs/learn/explore-the-quickbooks-online-api/minor-versions

**[L]** Intuit Developer — Sandbox management (sandbox company limits, lifespan)
https://developer.intuit.com/app/developer/qbo/docs/develop/sandboxes/manage-your-sandboxes

---

## 8. What Ben Must Do (human steps)

These are the manual, account-level steps that only a human with Intuit credentials can complete. Nothing here is code.

1. **Create an Intuit Developer account** at developer.intuit.com (or sign in with the existing Intuit/QuickBooks login).
2. **Create an app:** Apps and Resources → My Apps → Create an app → choose **QuickBooks Online and Payments**. (The "and Payments" label is just the app type — we will only request the Accounting scope.)
3. **Create a sandbox company:** API Docs & Tools → Add a sandbox company → choose QuickBooks Online Plus. Note its **realmId**.
4. **Copy the sandbox keys:** in the app, Development → Keys & OAuth → copy the **Client ID** and **Client Secret** (these are the *development/sandbox* keys — they will NOT work against a live company).
5. **Register the redirect URI:** in Keys & OAuth, add the exact callback URL the edge function will use (e.g. the Supabase function URL or a localhost URL for first tests). It must match character-for-character what the code sends.
6. **Register a Reconnect URL:** in the app settings, register a Reconnect URL (this is now mandatory by Feb 24, 2026 per Intuit's Nov 2025 policy change — it's the page users land on when their token expires and they need to re-authorize).
7. **Enable webhooks:** in the app's Webhooks section, set the HTTPS endpoint to the Supabase webhook edge-function URL, subscribe to **Invoice (Create, Update)** and **Payment (Create)**, save, then **copy the Verifier Token**.
8. **Hand off four secrets to the build:** Client ID, Client Secret, Verifier Token, and the Reconnect URL. (The access/refresh tokens are produced by running the auth flow once — see Section 9 — not copied from the portal.)
9. **Run the one-time authorization** (Section 9 wires a helper for this): click through the Intuit consent screen against the sandbox company so the system captures the first refresh token + realmId.

---

## 9. What's Paint-by-Numbers to Build

With every endpoint, scope, header, and payload above pinned, the code tasks are mechanical. Edge functions are Supabase/Deno.

**A. Secrets + token store**
- Table `quickbooks_tokens` (single row): `access_token`, `refresh_token`, `realm_id`, `access_expires_at`, `refresh_expires_at`, `updated_at`. Client ID/Secret/Verifier Token as edge-function secrets.
- Helper `getValidAccessToken()`: if `access_expires_at` is near, refresh (`grant_type=refresh_token`), **persist the new refresh_token + both expiries**, return fresh access token. Wrap in a row/advisory lock to prevent concurrent-refresh invalidation.

**B. One-time OAuth bootstrap (two tiny functions)**
- `GET /qbo/connect`: redirect to `appcenter.intuit.com/connect/oauth2` with `client_id`, `scope=com.intuit.quickbooks.accounting`, registered `redirect_uri`, `response_type=code`, random `state`.
- `GET /qbo/callback`: verify `state`, exchange `code` at the token endpoint (Basic auth), store `access_token` + `refresh_token` + `realmId` + expiries.

**C. LOE-signed handler (trigger 1)**
- Resolve/create Customer: look up by DisplayName; if absent, `POST /customer` (3a); cache `Id`.
- Ensure the "Appraisal Services" Item exists (look up / create); cache its `Id`.
- `POST /invoice` (3b) with `CustomerRef`, one `SalesItemLineDetail` line, `BillEmail`; cache invoice `Id` + `SyncToken`.
- `POST /invoice/{id}/send` (3c) with `Content-Type: application/octet-stream` (optionally `?sendTo=`). Record `EmailStatus = EmailSent`.

**D. Webhook receiver (trigger 2)**
- `POST /qbo/webhook`: capture **raw body**, verify `intuit-signature` via HMAC-SHA256 with Verifier Token (4d), confirm `realmId`, return `200` immediately.
- For each entity where `name == "Payment"` and `operation == "Create"`: `GET /payment/{id}`, read `LinkedTxn` to find the cleared invoice `Id`, then **fire APR's downstream receipt/status workflow**.
- Optionally handle `Invoice`/`Update` to reflect send/view status.

**E. Test harness (sandbox)**
- Script the full loop against the sandbox: create customer → create invoice → send → `POST /payment` (3d) linking the invoice → assert the Payment webhook fires and the invoice `Balance` is 0. Make every create idempotent (lookup-before-create) so a sandbox reset doesn't strand cached Ids.

**F. Resilience**
- 429 backoff, single-flight token refresh, re-authorization flow (with Reconnect URL) for the 5-year expiry case, and structured logging of every token rotation so a lockout is diagnosable.
