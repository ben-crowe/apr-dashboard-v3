---
content_type: setup-recipe
title: SharePoint Integration — Entra App Registration Setup Recipe
status: ACTIVE — the concrete "create the app" recipe to wire SharePoint folder-create into job creation
created: 2026-06-10
updated: 2026-06-10
owner: Ben (does the portal steps, Global Admin) · co-architect (wires the Graph call) · Codex (can guide the clicks)
home: ~/Development/APR-Dashboard-v3/docs/Features/13-Asset-Storage/ASSET-STORAGE-SHAREPOINT.md
tags: [apr-workflow, asset-storage, sharepoint, entra, azure-ad, msgraph, app-registration, setup]
---

# SharePoint Integration — Entra App Setup Recipe

**Tags:** #sharepoint #entra #app-registration #msgraph #asset-storage #apr-workflow
**Entities:** [[Asset-Storage]] [[SharePoint]]

**The "app" needed to integrate SharePoint with new-job-creation = a Microsoft Entra (Azure AD) App Registration using the Microsoft Graph API (client-credentials flow).** Once it exists, job creation calls Graph to auto-create the per-job parent folder + 5 subfolders. Ben is **Global Administrator** on the Valta tenant (`valtapropertyvaluations.onmicrosoft.com`, `ben.crowe@valta.ca`), so he can do every step with no external dependency.

> **One app, two uses:** the SAME registration powers BOTH the SharePoint folder-create (`Sites.ReadWrite.All`) AND the outbound LOE email-send (`Mail.Send`). Add both permissions now so it's done once.

## The steps (Ben, in the Entra admin center — Codex can guide the clicks)

1. **Register the app.** [entra.microsoft.com](https://entra.microsoft.com) → **Identity → Applications → App registrations → New registration**. Name: `APR Dashboard – SharePoint + Mail`. Supported account types: **single tenant** (this org only). Register.
2. **Capture two IDs** from the app's Overview page:
   - **Directory (tenant) ID**
   - **Application (client) ID**
3. **Create a client secret.** App → **Certificates & secrets → Client secrets → New client secret** → description + expiry (24 months) → **copy the secret VALUE immediately** (it's shown once).
4. **Add Graph application permissions.** App → **API permissions → Add a permission → Microsoft Graph → Application permissions** → add:
   - `Sites.ReadWrite.All` (folder create + file upload)
   - `Mail.Send` (LOE email send — same app, later)
   Then click **Grant admin consent for <tenant>** (Ben can, as Global Admin) — the status must show a green check.
5. **Hand off the 3 values** — Tenant ID + Client ID + Secret Value → stored server-side (Vercel env, like the Valcre creds), NEVER in the repo. Then co-architect wires the Graph folder-create call into the job-creation step.

## Guardrail (locked) — scope the mail send
For `Mail.Send`, apply an **Application Access Policy** so the app can only send as the ONE sending mailbox (not as any tenant user). Folder permission (`Sites.ReadWrite.All`) is fine tenant-wide for the jobs site.

## What gets built once the 3 values land
- **Folder-create at intake (auto):** Graph call creates the parent `{JOB#} - {Property Description + Street Address + City + Province}` under `…/sites/V/Shared Documents/2.Jobs/{YEAR}/` + the 5 locked subfolders (`1. REPORT` / `2. CLIENT SUPPLIED` / `3. WORK FILES (TTSZ, PICS, COMPS)` / `4. CLIENT BILLING (Invoice, LOE)` / `5. LETTER OF RELIANCE (LOR)`). Spec confirmed live 2026-06-10 (parent naming) + 2026-06-08 (subfolders).
- **File push:** signed LOE saves to `4. CLIENT BILLING`, attachments route to their subfolders.
  - **Signed-LOE file-naming convention — CONFIRMED from live SharePoint (read-only capture 2026-06-11, VAL261054):**
    - Signed LOE → `LOE - {JOB#} - signed.pdf` (e.g. `LOE - VAL261054 - signed.pdf`)
    - Unsigned LOE → `LOE - {JOB#}.pdf` + `LOE - {JOB#}.docx`
    - Invoice → `Invoice_{JOB#}_from_Valta_Property_Valuations_Ltd.pdf`
    - **No date in the filename** — the date lives in SharePoint metadata, not the name.
    - Live VAL261054 folder matched the locked 5-subfolder spec exactly (casing + order). No files/folders were created or modified during capture.
- **Email send:** the LOE/sign email moves off Resend onto Graph `sendMail` from a `valta.ca` mailbox (the dashboard's decided production target).

## ⭐ Dashboard UI — the folders section + "Create / Connect Folders" button (Ben, 2026-06-10)

The job-detail dashboard's **last section (Files / Assets)** becomes a live, **synced** view of that job's SharePoint folder set, with an on-request button. Two trigger paths, ONE underlying Graph call:

1. **Auto** — at job creation the folder set is created (above).
2. **On request (the button)** — the folders section shows a **"Create Client Folders"** button. On click it fires the same Graph folder-create for THIS job (parent + 5 subfolders), then the section flips to a **"Connected"** state.

**Behaviour spec (build):**
- **Button states:** `Create Client Folders` → (creating…) → `Folders Connected ✓` (with an "Open in SharePoint" link to the parent folder).
- **Idempotent / re-connect:** if the folders already exist (auto-created at intake, or a re-click), the button does NOT duplicate — it **connects/links** to the existing set (Graph: check-then-create per folder). So "make folders" and "connect folders" are the same safe action.
- **Synced view:** once connected, the section lists the parent + 5 subfolders with open-in-SharePoint links, and surfaces where the signed LOE + attachments live.
- **Disabled/guarded** until the Entra app creds exist server-side (no creds → button shows "SharePoint not configured" rather than failing).
- **Owner:** react-specialist (the section UI + button + states) + co-architect (the Graph folder-create/connect endpoint). Gated on the 3 Entra creds above.

## Related
- [Asset Storage + SharePoint](~/Development/APR-Dashboard-v3/docs/Features/13-Asset-Storage/ASSET-STORAGE-SHAREPOINT.md) — the feature doc.
- [Full-Loop E2E Test PRD — Leg 7](~/Development/APR-Dashboard-v3/tests/E2E-TEST-PRD-FULL-LOOP.md) — where this unblocks the folders leg.
- [APR Master Dashboard §2b](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md) — the locked folder spec + wiring plan.

---

**Last reviewed:** 2026-06-10 by co-architect — authored as the concrete "create the app" recipe after Ben confirmed the SharePoint integration needs an app registration. Ben does the portal steps (Global Admin); Codex can guide; co-architect wires the Graph call once the 3 creds land.
