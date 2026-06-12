---
title: Graph + QuickBooks Activation Runbook (credential-boundary handoff)
status: ready-waiting-creds
created: 2026-06-11
tags: [apr-workflow, msgraph, quickbooks, activation, runbook, ground-truth, loose-end]
---

# Graph + QuickBooks — Activation Runbook

**Tags:** #apr-workflow #msgraph #quickbooks #activation #runbook #ground-truth
**Backlink:** [APR Master Dashboard](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md)

The whole backend is built **inert** to the credential boundary (every endpoint returns `503 {configured:false}` until secrets exist). This is the exact sequence to switch it on. Nothing here needs new code.

---

## 1. Recoverable DDL — `quickbooks_tokens` (migration is gitignored)

The `supabase/migrations/` dir is gitignored in this repo, so the token-store migration isn't version-controlled. The table is **already applied live**. DDL captured here for recovery:

```sql
create table if not exists public.quickbooks_tokens (
  id integer primary key default 1,
  access_token text,
  refresh_token text,
  realm_id text,
  access_expires_at timestamptz,
  refresh_expires_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint quickbooks_tokens_singleton check (id = 1)
);
alter table public.quickbooks_tokens enable row level security;
insert into public.quickbooks_tokens (id) values (1) on conflict (id) do nothing;
```

Single row (`id=1`), refresh-token-rotation safe (edge fn overwrites on every token call).

---

## 2. Microsoft Graph activation (email + SharePoint)

**Secrets to set** (Codex produces the first 3 from the Entra app registration; co-arch confirms the mailbox):

```bash
REF=ngovnamnjmexdpjtcnky
supabase secrets set GRAPH_TENANT_ID="<tenant>"     --project-ref $REF
supabase secrets set GRAPH_CLIENT_ID="<client>"     --project-ref $REF
supabase secrets set GRAPH_CLIENT_SECRET="<secret>" --project-ref $REF
supabase secrets set GRAPH_SEND_MAILBOX="<noreply@valta.ca>" --project-ref $REF
```

**One-time site/drive-ID discovery** (run after secrets set; store results so resolution isn't repeated every call):

```bash
# token
TOK=$(curl -s -X POST "https://login.microsoftonline.com/<tenant>/oauth2/v2.0/token" \
  -d "client_id=<client>&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default&client_secret=<secret>&grant_type=client_credentials" \
  | python3 -c "import sys,json;print(json.load(sys.stdin)['access_token'])")
# site id
curl -s "https://graph.microsoft.com/v1.0/sites/valtapropertyvaluations.sharepoint.com:/sites/V" \
  -H "Authorization: Bearer $TOK" | python3 -c "import sys,json;print(json.load(sys.stdin)['id'])"
# drive id (Shared Documents)
curl -s "https://graph.microsoft.com/v1.0/sites/<SITE_ID>/drive" \
  -H "Authorization: Bearer $TOK" | python3 -c "import sys,json;print(json.load(sys.stdin)['id'])"
```

Then optionally pin them to skip runtime resolution:

```bash
supabase secrets set SHAREPOINT_SITE_ID="<...>"  --project-ref $REF
supabase secrets set SHAREPOINT_DRIVE_ID="<...>" --project-ref $REF
```

> The helper auto-discovers site/drive at runtime if these are unset — pinning is just an optimization.

**Live-test loop — CONNECT, don't create (verified live 2026-06-11 against VAL261003):**
1. **Parity check FIRST (read-only):** list a real client job folder's subfolders and confirm they match our 5 canonical names byte-for-byte BEFORE any write — else a "connect" would create duplicates.
2. Fire `create-job-folders` (explicit `jobNumber`+`propertyDescription`+`year`, or `{jobId}`) on a REAL existing client job → **assert `connectedOnly:true`, `parentCreated:false`, every subfolder `created:false`** (pure connect). Then **re-list the year folder and assert NO duplicate** parent appeared.
3. **Upload into existing billing:** test with a clearly-marked QA filename into `4. CLIENT BILLING (Invoice, LOE)`, verify it lands, then DELETE it — never overwrite a real signed LOE. (The real signed-LOE name already in the folder is the convention source of truth.)
4. Email: leave on Resend/crowestudio — Graph send is gated on an **explicit `GRAPH_SEND_MAILBOX`** (production-only, not set during folder activation).

> **Signed-LOE filename — CORRECTED 2026-06-11 (verified from real folder VAL261003):**
> `LOE - {JOB#} - {property desc + addr} - signed.pdf`  ==  `LOE - {parentFolderName} - signed.pdf`
> (NOT `LOE - {JOB#} - signed.pdf` — that earlier "confirmed" value was missing the property description.)

After secrets set, **redeploy is NOT required** (Supabase injects secrets into the running function); the 503 guard flips to live automatically.

---

## 3. QuickBooks activation (closing flow)

**Secrets** (Codex produces from the Intuit Developer app + sandbox):

```bash
supabase secrets set QBO_CLIENT_ID="<...>"       --project-ref $REF
supabase secrets set QBO_CLIENT_SECRET="<...>"   --project-ref $REF
supabase secrets set QBO_VERIFIER_TOKEN="<...>"  --project-ref $REF
supabase secrets set QBO_REDIRECT_URI="https://ngovnamnjmexdpjtcnky.supabase.co/functions/v1/qbo-auth" --project-ref $REF
supabase secrets set QBO_ENV="sandbox"           --project-ref $REF
```

**One-time OAuth bootstrap:** open `…/functions/v1/qbo-auth?action=connect` in a browser → Intuit consent against the sandbox company → callback stores access+refresh+realmId in `quickbooks_tokens`.

**Live sandbox test:** `qbo-create-customer` → `qbo-create-invoice` → `qbo-send-invoice` → `qbo-record-payment` → assert the `Payment.Create` webhook fires `qbo-webhook` and the invoice Balance is 0.

**Follow-ups at closing go-live** (noted in code): CSRF `state` store on callback, cross-instance refresh advisory lock, Trigger-2 downstream (invoice→job map + status/receipt/ClickUp-Paid flip).

---

**Last reviewed:** 2026-06-11 by qa-agent — staged while waiting on Codex's Entra app registration; captures the gitignored token DDL + the exact secrets/discovery/live-test sequence so activation is paint-by-numbers.
