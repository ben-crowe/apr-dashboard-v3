---
title: Microsoft Graph Build Spec — Email + SharePoint (APR Dashboard)
status: build-ready-research
created: 2026-06-11
tags: [apr-workflow, msgraph, entra, email, sharepoint, sendmail, build-spec, ground-truth]
---

[[~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md]]

#msgraph #entra #email #sharepoint #sendmail #build-spec

**Entities:** Microsoft Graph v1.0 · Entra ID · Exchange Online · SharePoint Online · Supabase Edge Functions · valta.ca · valtapropertyvaluations.sharepoint.com

---

## Overview

Single-tenant Entra app, client-credentials (app-only) flow, powers two features:

- **Feature A** — Outbound email from a valta.ca mailbox via `POST /users/{mailbox}/sendMail`
- **Feature B** — Per-job SharePoint folder creation + file upload under `valtapropertyvaluations.sharepoint.com/sites/V`

All calls originate from Supabase/Deno edge functions. Secrets: `TENANT_ID`, `CLIENT_ID`, `CLIENT_SECRET`.

---

## 1. App-Only Token Acquisition

**Source:** [Get access without a user — Microsoft Graph](https://learn.microsoft.com/en-us/graph/auth-v2-service)

**Token endpoint:**

```
POST https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/token
Content-Type: application/x-www-form-urlencoded
```

**Request body (URL-encoded form fields):**

```
client_id={CLIENT_ID}
&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default
&client_secret={CLIENT_SECRET}
&grant_type=client_credentials
```

**Field notes:**

- `scope` must be exactly `https://graph.microsoft.com/.default` — this is the only accepted value for client credentials; it instructs the identity platform to include all admin-consented application permissions.
- `grant_type` must be `client_credentials`.

**Token response:**

```json
{
  "token_type": "Bearer",
  "expires_in": 3599,
  "ext_expires_in": 3599,
  "access_token": "eyJ0eXAi..."
}
```

**Token lifetime:** 3599 seconds (≈1 hour). `ext_expires_in` is the extended resilience window. Cache the token; request a new one when it expires. Do not request a new token per API call.

**Usage:** Pass as `Authorization: Bearer {access_token}` on every Graph API request.

---

## 2. Feature A — Email Send (app-only)

### 2a. sendMail endpoint

**Source:** [user: sendMail — Microsoft Graph v1.0](https://learn.microsoft.com/en-us/graph/api/user-sendmail?view=graph-rest-1.0)

**Endpoint:**

```
POST https://graph.microsoft.com/v1.0/users/{mailbox-UPN-or-id}/sendMail
Authorization: Bearer {access_token}
Content-Type: application/json
```

Replace `{mailbox-UPN-or-id}` with the sender's UPN, e.g. `noreply@valta.ca` or the mailbox object ID. The `/me/sendMail` form requires a delegated token — **do not use it for app-only**.

**Request body:**

```json
{
  "message": {
    "subject": "Your APR Report — 123 Main St",
    "body": {
      "contentType": "HTML",
      "content": "<p>Please find your appraisal report attached.</p>"
    },
    "toRecipients": [
      {
        "emailAddress": {
          "address": "client@example.com"
        }
      }
    ],
    "ccRecipients": [
      {
        "emailAddress": {
          "address": "appraiser@valta.ca"
        }
      }
    ],
    "attachments": [
      {
        "@odata.type": "#microsoft.graph.fileAttachment",
        "name": "APR-Report.pdf",
        "contentType": "application/pdf",
        "contentBytes": "{base64-encoded-bytes}"
      }
    ]
  },
  "saveToSentItems": true
}
```

**Field notes:**

- `body.contentType`: `"HTML"` or `"Text"`.
- `toRecipients` / `ccRecipients`: array of `{ emailAddress: { address: "..." } }` objects.
- `attachments`: inline base64 for small files (< ~3 MB practical limit in single sendMail call). For large attachments use the large attachment upload session pattern separately.
- `saveToSentItems`: `true` saves to the mailbox Sent Items. Default is `true`.

**Success response:** `HTTP 202 Accepted` (no body). 202 means accepted for delivery, not guaranteed delivered — subject to Exchange Online throttling.

### 2b. Application Access Policy — scope Mail.Send to one mailbox

**Source:** [Application Access Policies (legacy) — Exchange Online](https://learn.microsoft.com/en-us/exchange/permissions-exo/application-access-policies)

**Why required:** `Mail.Send` application permission grants the app access to send from *any* mailbox in the tenant by default. The Application Access Policy restricts it to a specific mailbox.

> Note: Microsoft labels this "legacy" and it is being replaced by App RBAC for Exchange. As of June 2026 it remains the only supported mechanism to scope app-only mail permissions to a single mailbox. Do not create new policies expecting long-term stability — monitor the deprecation timeline.

**Step 1 — Create a mail-enabled security group in Exchange Online** containing only the valta.ca sending mailbox (e.g. `noreply@valta.ca`). The group must be a `MailUniversalSecurityGroup` (mail-enabled security group). Note its email address, e.g. `apr-send-scope@valta.ca`.

**Step 2 — Connect to Exchange Online PowerShell:**

```powershell
Connect-ExchangeOnline -UserPrincipalName admin@valta.ca
```

**Step 3 — Create the RestrictAccess policy:**

```powershell
New-ApplicationAccessPolicy `
  -AppId "{CLIENT_ID}" `
  -PolicyScopeGroupId "apr-send-scope@valta.ca" `
  -AccessRight RestrictAccess `
  -Description "Restrict APR app mail send to noreply@valta.ca only."
```

- `-AppId`: the Entra app's Client (Application) ID.
- `-PolicyScopeGroupId`: email address of the mail-enabled security group.
- `-AccessRight RestrictAccess`: grants access *only* to mailboxes that are members of the group; denies all others.

**Step 4 — Test the policy:**

```powershell
Test-ApplicationAccessPolicy -Identity noreply@valta.ca -AppId "{CLIENT_ID}"
```

Output will show `AccessCheckResult: Granted` if configured correctly.

Test a mailbox that should be denied:

```powershell
Test-ApplicationAccessPolicy -Identity someoneelse@valta.ca -AppId "{CLIENT_ID}"
```

Should return `AccessCheckResult: Denied`.

**Propagation delay:** Changes to Application Access Policies can take **longer than 1 hour** to take effect in Microsoft Graph REST API calls, even when `Test-ApplicationAccessPolicy` shows positive results. Plan accordingly — do not test the live API immediately after creation.

**Denied access error shape:**

```json
{
  "error": {
    "code": "ErrorAccessDenied",
    "message": "Access to OData is disabled."
  }
}
```

---

## 3. Feature B — SharePoint: Resolve Site ID and Drive ID

These IDs are stable once the site exists. Resolve them once and store as constants in the edge function environment (or a config table).

### 3a. Get the site ID

**Source:** [Get a SharePoint Site — Microsoft Graph v1.0](https://learn.microsoft.com/en-us/graph/api/site-get?view=graph-rest-1.0)

**Endpoint:**

```
GET https://graph.microsoft.com/v1.0/sites/valtapropertyvaluations.sharepoint.com:/sites/V
Authorization: Bearer {access_token}
```

Pattern: `GET /sites/{hostname}:/{server-relative-path}`

**Response (excerpt):**

```json
{
  "id": "valtapropertyvaluations.sharepoint.com,{site-guid},{web-guid}",
  "displayName": "V",
  "webUrl": "https://valtapropertyvaluations.sharepoint.com/sites/V"
}
```

The `id` field is a composite string: `{hostname},{site-collection-guid},{web-guid}`. Store the full string — it is the `{site-id}` used in all subsequent calls.

### 3b. Get the document library drive ID

**Source:** [List Drives — Microsoft Graph v1.0](https://learn.microsoft.com/en-us/graph/api/drive-list?view=graph-rest-1.0)

**Endpoint:**

```
GET https://graph.microsoft.com/v1.0/sites/{site-id}/drives
Authorization: Bearer {access_token}
```

**Response:** Array of drive objects. Each has `id`, `name`, `driveType`.

Find the drive where `name` equals `"Shared Documents"` (the default document library). Store its `id` as `{drive-id}`.

```json
{
  "value": [
    {
      "id": "b!abc123...",
      "name": "Shared Documents",
      "driveType": "documentLibrary"
    }
  ]
}
```

Alternatively, use the default drive shortcut:

```
GET https://graph.microsoft.com/v1.0/sites/{site-id}/drive
```

This returns the site's default document library drive directly.

---

## 4. Feature B — SharePoint: Folder Creation

**Source:** [Create a new folder — Microsoft Graph v1.0](https://learn.microsoft.com/en-us/graph/api/driveitem-post-children?view=graph-rest-1.0)

### 4a. Create a single folder by path (preferred for nested paths)

Use the path-based URL form to create a folder at an arbitrary nested path without needing the parent item ID:

```
POST https://graph.microsoft.com/v1.0/drives/{drive-id}/root:/{folder-path}:/children
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request body:**

```json
{
  "name": "2024-001 - 123 Main St",
  "folder": {},
  "@microsoft.graph.conflictBehavior": "fail"
}
```

**Field notes:**

- `"folder": {}` — the empty folder facet signals this is a folder, not a file.
- `@microsoft.graph.conflictBehavior`:
  - `"fail"` — returns `409 Conflict` if the folder already exists. Use this for the idempotent check-then-create pattern (see below).
  - `"replace"` — replaces an existing item (destructive for folders — avoid).
  - `"rename"` — creates a new folder with an auto-incremented name if conflict exists (not suitable for deterministic job paths).

**Recommendation: use `"fail"` for job folders.** The idempotent pattern is:

1. `GET /drives/{drive-id}/root:/{path}` — if `200 OK`, folder exists, capture `id`.
2. If `404 Not Found`, `POST .../children` with `conflictBehavior: "fail"` to create it.
3. On `409 Conflict` (race condition), retry the GET to get the `id`.

### 4b. APR job folder structure

Target path pattern: `2.Jobs/{YEAR}/{JOB#} - {PROPERTY}/`

Five subfolders under each job folder. Create the parent first, then create each subfolder. Example sequence:

**Create parent:**

```
POST https://graph.microsoft.com/v1.0/drives/{drive-id}/root:/2.Jobs/2024:/children

{
  "name": "2024-001 - 123 Main St",
  "folder": {},
  "@microsoft.graph.conflictBehavior": "fail"
}
```

**Create subfolder (repeat for each of the 5):**

```
POST https://graph.microsoft.com/v1.0/drives/{drive-id}/root:/2.Jobs/2024/2024-001 - 123 Main St:/children

{
  "name": "01-Engagement",
  "folder": {},
  "@microsoft.graph.conflictBehavior": "fail"
}
```

**Note on URL encoding:** Spaces and special characters in the path segment must be URL-encoded. In the path portion of the URL, a space is `%20`. The `{YEAR}` and `2.Jobs` segments must also be URL-encoded if they contain dots (`.` is safe in path segments and does not need encoding in most clients, but verify your HTTP library's behavior).

**Creating deeply nested paths in one call:** Graph does not recursively create intermediate directories in a single call. Create each level individually (parent, then each child) or use the `PUT :/content` trick — uploading a placeholder file to a non-existent deep path will auto-create all intermediate folders.

### 4c. Retrieve folder item ID after creation

The `201 Created` response body contains the new folder's `id`:

```json
{
  "id": "ACEA49D1-1444-45A9-A1CB-68B1B28AE491",
  "name": "2024-001 - 123 Main St",
  "folder": { "childCount": 0 }
}
```

Store this `id` for direct use as `{parent-item-id}` in subsequent child-folder or file-upload calls (avoids re-resolving by path).

---

## 5. Feature B — SharePoint: File Upload

### 5a. Small files (up to 250 MB) — single PUT

**Source:** [Upload small files — Microsoft Graph v1.0](https://learn.microsoft.com/en-us/graph/api/driveitem-put-content?view=graph-rest-1.0)

```
PUT https://graph.microsoft.com/v1.0/drives/{drive-id}/root:/{folder-path}/{filename}:/content
Authorization: Bearer {access_token}
Content-Type: {mime-type}

{binary file bytes}
```

Example for uploading a PDF to a job folder:

```
PUT https://graph.microsoft.com/v1.0/drives/{drive-id}/root:/2.Jobs/2024/2024-001%20-%20123%20Main%20St/01-Engagement/LOE-2024-001.pdf:/content
Authorization: Bearer {access_token}
Content-Type: application/pdf

{binary PDF bytes}
```

**Success response:** `201 Created` (new file) or `200 OK` (replaced file) with a `driveItem` object in the body.

**Size limit:** Officially supports files up to **250 MB** in a single PUT call.

**Practical recommendation for signed LOE PDFs:** If the PDF is expected to stay well under 4 MB, the simple PUT is fine. If there is any risk of exceeding ~10 MB, use the upload session approach below.

### 5b. Large files — upload session (recommended for LOE PDFs > 10 MB)

**Source:** [driveItem: createUploadSession — Microsoft Graph v1.0](https://learn.microsoft.com/en-us/graph/api/driveitem-createuploadsession?view=graph-rest-1.0)

**Step 1 — Create the upload session:**

```
POST https://graph.microsoft.com/v1.0/drives/{drive-id}/items/{parent-item-id}:/{filename}:/createUploadSession
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "item": {
    "@microsoft.graph.conflictBehavior": "replace",
    "name": "LOE-2024-001.pdf"
  }
}
```

**Response:** Returns an `uploadUrl` (pre-authenticated, no `Authorization` header needed for subsequent PUTs) and `expirationDateTime`.

**Step 2 — Upload byte ranges:**

```
PUT {uploadUrl}
Content-Length: {chunk-size}
Content-Range: bytes {start}-{end}/{total}

{chunk bytes}
```

**Chunk size rules:**
- Must be a multiple of **320 KiB (327,680 bytes)**.
- Recommended chunk size: **10 MiB** for stable connections, **5 MiB** for less reliable.
- Microsoft recommends using upload sessions for files **larger than 10 MiB**.

**Step 3 — Final chunk response:** `201 Created` with the `driveItem` object.

---

## 6. Permissions, Consent, and App-Only Limitations

### Required application permissions (admin consent required for all)

| Permission | Purpose | Admin consent |
| --- | --- | --- |
| `Mail.Send` | Send email from any mailbox (scoped by Application Access Policy) | Required |
| `Sites.ReadWrite.All` | Read/write SharePoint sites, drive items, create folders, upload files | Required |

**Note:** `Sites.ReadWrite.All` also satisfies the `Files.ReadWrite.All` requirement for drive operations on SharePoint. You do not need to add `Files.ReadWrite.All` separately.

### Granting admin consent

In the Entra admin center (`entra.microsoft.com`):

1. App registrations > your app > API permissions.
2. Add both permissions as **Application permissions** (not Delegated).
3. Click **Grant admin consent for {tenant}**.
4. Verify both permissions show a green checkmark and status "Granted for {tenant}".

Only a Global Administrator (or Privileged Role Administrator) can grant admin consent. Ben is Global Admin — he can do this directly.

### App-only limitations

**Mail.Send without Application Access Policy:**
An app granted `Mail.Send` as an application permission can send as or on behalf of *any* mailbox in the tenant by default. The Application Access Policy (Section 2b) is the only Exchange-level control to scope this to a single mailbox.

**SharePoint Sites.ReadWrite.All:**
Grants read/write access to all SharePoint sites in the tenant. There is no equivalent mailbox-scoping mechanism for SharePoint — the permission is tenant-wide. Mitigate by using least-privilege site permissions at the SharePoint site level if needed (separate from Graph permissions).

**App-only cannot use delegated-only endpoints:**
The `/me/` prefix in Graph API endpoints always refers to the signed-in delegated user. App-only tokens must use `/users/{id}/` forms (e.g. `POST /users/{mailbox}/sendMail`, not `POST /me/sendMail`).

---

## Sources

- [Get access without a user (client credentials flow) — Microsoft Graph](https://learn.microsoft.com/en-us/graph/auth-v2-service)
- [OAuth 2.0 client credentials flow — Microsoft identity platform](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-client-creds-grant-flow)
- [user: sendMail — Microsoft Graph v1.0](https://learn.microsoft.com/en-us/graph/api/user-sendmail?view=graph-rest-1.0)
- [Application Access Policies (legacy) — Exchange Online](https://learn.microsoft.com/en-us/exchange/permissions-exo/application-access-policies)
- [New-ApplicationAccessPolicy — Exchange PowerShell](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/new-applicationaccesspolicy?view=exchange-ps)
- [Get a SharePoint Site — Microsoft Graph v1.0](https://learn.microsoft.com/en-us/graph/api/site-get?view=graph-rest-1.0)
- [List Drives — Microsoft Graph v1.0](https://learn.microsoft.com/en-us/graph/api/drive-list?view=graph-rest-1.0)
- [Create a new folder — Microsoft Graph v1.0](https://learn.microsoft.com/en-us/graph/api/driveitem-post-children?view=graph-rest-1.0)
- [Upload small files — Microsoft Graph v1.0](https://learn.microsoft.com/en-us/graph/api/driveitem-put-content?view=graph-rest-1.0)
- [driveItem: createUploadSession — Microsoft Graph v1.0](https://learn.microsoft.com/en-us/graph/api/driveitem-createuploadsession?view=graph-rest-1.0)

---

## What Ben must do (human steps)

These steps require Global Admin access and cannot be done by code.

**Step 1 — Entra App Registration** (entra.microsoft.com)

1. App registrations > New registration.
2. Name: `APR-Dashboard` (or similar). Supported account types: "Accounts in this organizational directory only" (single-tenant).
3. No redirect URI needed for client credentials.
4. After creation: note the **Application (client) ID** and **Directory (tenant) ID**.
5. Certificates & secrets > New client secret. Note the secret value immediately (shown only once).
6. API permissions > Add a permission > Microsoft Graph > Application permissions:
   - Add `Mail.Send`
   - Add `Sites.ReadWrite.All`
7. Click **Grant admin consent for valta.ca**. Verify both show green checkmarks.
8. Store `TENANT_ID`, `CLIENT_ID`, `CLIENT_SECRET` as Supabase secrets.

**Step 2 — Exchange Online Application Access Policy** (Exchange Online PowerShell)

1. In Exchange Online admin (or PowerShell): create a mail-enabled security group, e.g. `apr-send-scope@valta.ca`, containing only the `noreply@valta.ca` mailbox (or whichever sending mailbox is used).
2. Run:
   ```powershell
   Connect-ExchangeOnline -UserPrincipalName ben@valta.ca
   New-ApplicationAccessPolicy `
     -AppId "{CLIENT_ID}" `
     -PolicyScopeGroupId "apr-send-scope@valta.ca" `
     -AccessRight RestrictAccess `
     -Description "Restrict APR app mail send to noreply@valta.ca only."
   ```
3. Wait at least 1 hour, then test:
   ```powershell
   Test-ApplicationAccessPolicy -Identity noreply@valta.ca -AppId "{CLIENT_ID}"
   # Expect: AccessCheckResult: Granted
   Test-ApplicationAccessPolicy -Identity ben@valta.ca -AppId "{CLIENT_ID}"
   # Expect: AccessCheckResult: Denied
   ```

**Step 3 — One-time site/drive ID discovery** (run once, store as constants)

Once the app is authenticated, run these two calls (e.g. from a Supabase function or curl) and store the results:

```
GET https://graph.microsoft.com/v1.0/sites/valtapropertyvaluations.sharepoint.com:/sites/V
→ copy "id" field  →  SHAREPOINT_SITE_ID

GET https://graph.microsoft.com/v1.0/sites/{SHAREPOINT_SITE_ID}/drives
→ find drive where name = "Shared Documents", copy its "id"  →  SHAREPOINT_DRIVE_ID
```

Store both as Supabase secrets or a config row.

---

## What's then paint-by-numbers to build

With the human steps complete and IDs stored as secrets, the edge function work is fully mechanical:

1. **Token service** — `POST` to the token endpoint, cache result for `expires_in` seconds, return `access_token`.
2. **sendMail function** — Fetch token, `POST /users/{mailbox}/sendMail` with the JSON body shape from Section 2a.
3. **createJobFolder function** — Fetch token, run the idempotent GET-then-POST pattern from Section 4b to create the parent folder and 5 subfolders. Return the folder item IDs for downstream use.
4. **uploadFile function** — Fetch token, `PUT /drives/{DRIVE_ID}/root:/{path}/{filename}:/content` for files < 10 MB; createUploadSession pattern for larger files.
5. **Wire to APR job lifecycle** — Call createJobFolder on job creation, uploadFile when LOE PDF is signed via DocuSeal webhook.
