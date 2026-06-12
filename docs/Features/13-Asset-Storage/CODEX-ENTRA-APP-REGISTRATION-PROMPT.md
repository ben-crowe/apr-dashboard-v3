---
title: "Codex Prompt — Entra App Registration: APR Dashboard SharePoint + Mail"
status: ready-to-deploy
created: 2026-06-11
tags: [apr-workflow, entra, codex, app-registration, deploy-prompt, msgraph]
---

**Tags:** #apr-workflow #entra #codex #app-registration #deploy-prompt #msgraph
**Entities:** Microsoft Entra ID, Microsoft Graph, APR Dashboard v3, Valta tenant, SharePoint Online, Mail.Send

**Backlink:** ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md

---

## (1) Ben opens this page

Sign in to the Microsoft Entra admin center as Global Admin, then navigate directly to App Registrations:

**https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade**

If that deep link doesn't land on the App registrations blade, navigate manually:
Entra admin center → left sidebar → **Entra ID** → **App registrations**

Confirm you are signed in as a Global Admin account for the Valta tenant before handing off to Codex.

---

## (2) Codex prompt (paste verbatim)

```
You are operating via computer-use inside the Microsoft Entra admin center.
Ben has signed in as Global Admin for the Valta tenant and has the App registrations
blade open. Your job is to complete an app registration end-to-end and return
three credential values. Work methodically — confirm each page loaded before
proceeding. If the UI differs from the steps below, adapt to achieve the same
goal rather than stopping.

═══════════════════════════════════════════════════════════════
STEP 1 — REGISTER THE APPLICATION
═══════════════════════════════════════════════════════════════
Goal: Create a new single-tenant app registration named exactly
"APR Dashboard – SharePoint + Mail".

Navigation: You should be on the App registrations blade.
Click "New registration".

Fill in the form:
- Name: APR Dashboard – SharePoint + Mail
- Supported account types: select "Accounts in this organizational
  directory only (<tenant name> only – Single tenant)"
- Redirect URI: leave blank (not required for this app)

Click "Register".

Wait for the Overview page to load. Confirm the app name matches.

═══════════════════════════════════════════════════════════════
STEP 2 — CAPTURE THE TENANT ID AND CLIENT ID
═══════════════════════════════════════════════════════════════
Goal: Record both IDs from the Overview page. These are shown
immediately after registration.

On the Overview page, locate and copy:
- Application (client) ID  → save as CLIENT_ID
- Directory (tenant) ID    → save as TENANT_ID

Take a screenshot or note both values precisely — you will
report them at the end.

═══════════════════════════════════════════════════════════════
STEP 3 — CREATE THE CLIENT SECRET
═══════════════════════════════════════════════════════════════
Goal: Create a 24-month client secret and capture its value.
The secret value is shown ONCE — if you navigate away before
copying it, it is gone forever and a new one must be created.

Navigation: In the left sidebar under "Manage", click
"Certificates & secrets".
Click the "Client secrets" tab.
Click "+ New client secret".

Fill in:
- Description: APR Dashboard production secret
- Expires: 24 months (select from the dropdown)

Click "Add".

IMMEDIATELY after the secret is created, copy the VALUE column
(the long string, NOT the Secret ID). Save it as SECRET_VALUE.

Do NOT navigate away from this page until SECRET_VALUE is
recorded. Confirm you have the full value (typically ~40 chars).

═══════════════════════════════════════════════════════════════
STEP 4 — ADD MICROSOFT GRAPH APPLICATION PERMISSIONS
═══════════════════════════════════════════════════════════════
Goal: Add two APPLICATION permissions (not delegated) from
Microsoft Graph: Sites.ReadWrite.All and Mail.Send.

Navigation: In the left sidebar under "Manage", click
"API permissions".
Click "+ Add a permission".
In the "Request API permissions" panel, click "Microsoft Graph".
Click "Application permissions" (not Delegated permissions).

Search for and add Sites.ReadWrite.All:
- In the search box type "Sites.ReadWrite"
- Expand the Sites section
- Check "Sites.ReadWrite.All"

Then search for and add Mail.Send:
- Clear the search box and type "Mail.Send"
- Expand the Mail section
- Check "Mail.Send"

Click "Add permissions".

Verify the API permissions list now shows both:
- Microsoft Graph / Sites.ReadWrite.All / Application
- Microsoft Graph / Mail.Send / Application

═══════════════════════════════════════════════════════════════
STEP 5 — GRANT ADMIN CONSENT
═══════════════════════════════════════════════════════════════
Goal: Grant tenant-wide admin consent for both permissions so
they show a green "Granted" status.

You should still be on the "API permissions" page.

Click the button "Grant admin consent for <tenant name>".
A confirmation dialog will appear — click "Yes".

Wait for the page to refresh. Verify that both permissions show:
- Status column: a green checkmark / "Granted for <tenant name>"

If the status does not update, click the Refresh button and
check again.

═══════════════════════════════════════════════════════════════
FINAL REPORT — return these three values to Ben
═══════════════════════════════════════════════════════════════
Report back in this exact format:

TENANT_ID:    <Directory (tenant) ID from Step 2>
CLIENT_ID:    <Application (client) ID from Step 2>
SECRET_VALUE: <Client secret Value from Step 3>

Then add a brief confirmation line, e.g.:
"Both Graph permissions (Sites.ReadWrite.All, Mail.Send) show
green admin-consent checkmarks. App is single-tenant, Valta org."

═══════════════════════════════════════════════════════════════
IMPORTANT: DO NOT PROCEED with Exchange / Mail access policy
═══════════════════════════════════════════════════════════════
The Mail.Send application permission grants the app permission
to send mail AS any mailbox in the tenant. A separate
Application Access Policy (Exchange Online PowerShell) is
required to restrict it to one specific mailbox. That is a
SEPARATE step and is NOT part of this portal registration.
Flag it in your report but do not attempt it here.
═══════════════════════════════════════════════════════════════
```

---

## (3) What Codex returns

Codex will report back three values:

| Value | Where it comes from |
|---|---|
| `TENANT_ID` | Overview page — Directory (tenant) ID |
| `CLIENT_ID` | Overview page — Application (client) ID |
| `SECRET_VALUE` | Certificates & secrets — Value column (shown once) |

Store all three immediately as environment secrets (Vercel / `.env.local` / secure vault). Do not commit them to source control.

---

## Post-step: Application Access Policy (Exchange)

`Mail.Send` as an application permission allows the app to send as **any mailbox** in the tenant. After the above registration is complete, an Exchange Online Application Access Policy must be created to scope sending to one specific mailbox (e.g. the APR notifications address).

This requires Exchange Online PowerShell:

```powershell
# Run after completing the Entra registration above
New-ApplicationAccessPolicy `
  -AppId "<CLIENT_ID>" `
  -PolicyScopeGroupId "<mailbox@valta.com>" `
  -AccessRight RestrictAccess `
  -Description "Restrict APR Dashboard Mail.Send to one mailbox"
```

**This is a separate task — do not include it in the Codex computer-use session above.**
Reference: [learn.microsoft.com/en-us/graph/auth-limit-mailbox-access](https://learn.microsoft.com/en-us/graph/auth-limit-mailbox-access)

---

## Sources

- [Register an app in Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app)
- [Add and manage app credentials (client secrets)](https://learn.microsoft.com/en-us/entra/identity-platform/how-to-add-credentials)
- [Grant tenant-wide admin consent](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/grant-admin-consent)
- [Web API app registration and API permissions](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-configure-app-access-web-apis)
- [Microsoft Graph permissions overview](https://learn.microsoft.com/en-us/graph/permissions-overview)
- [Limit mailbox access for Mail.Send (Application Access Policy)](https://learn.microsoft.com/en-us/graph/auth-limit-mailbox-access)
