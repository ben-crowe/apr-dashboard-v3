# Phase 1: Login & Credentials Reference

**Version:** 1.0  
**Last Updated:** November 2, 2025  
**Purpose:** API keys, login URLs, and credentials for Phase 1 systems

---

## 1. Supabase

**Project ID:** `ngovnamnjmexdpjtcnky`  
**Project URL:** `https://ngovnamnjmexdpjtcnky.supabase.co`  
**Dashboard:** `https://supabase.com/dashboard/project/ngovnamnjmexdpjtcnky`

**Login:**
- URL: [Provide login URL]
- Username: [Provide]
- Password: [Provide]

**API Keys (Frontend):**
```
VITE_SUPABASE_URL="https://ngovnamnjmexdpjtcnky.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nb3ZuYW1uam1leGRwanRjbmt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MTk0NzAsImV4cCI6MjA1NzI5NTQ3MH0.i5pxHZ6Uvo1kcyws-C0tSegs35pA7tMO287_gYXIkGQ"
```

---

## 2. ClickUp

**Login:**
- URL: `https://app.clickup.com/`
- Team ID: `8555561`
- Workspace: Valta (Production)

**API Configuration:**
```
API Key: pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU
Base URL: https://api.clickup.com/api/v2
Team ID: 8555561
Production List ID: 901402094744 (Valta workspace - where tasks are created)
Test List ID: 901703694310 (Ben's workspace - for testing)
Template ID: t-86b3exqe8 (LOE New Template 2025.01.09 - creates 9 subtasks)
```

**Environment Variable:**
```
VITE_CLICKUP_ENV=production
```

**Integration Status:** ✅ Working - Manual task creation via button in APR Dashboard

---

## 3. Valcre

**Login:**
- Dashboard URL: https://public-api.valcre.com
- Username: `chris.chornohos@valta.ca`
- Password: `Valvalta1!`

**API Configuration (OAuth):**
```
OAuth URL: https://public-api.valcre.com/connect/token
Client ID: c9AfkQFS3Scq8YvRsl1DtGbbMRaDDSoh
Client Secret: 6VLkSjdT-EvELiIh8QLNv-sQrgy-o_P2KXrHn1g1_Sq9p9yPn73NxuBGtKGaO2kZ
Username: appraisal@chrischornohos.com
Password: Valvalta1!
Base URL: https://api.valcre.com/api/v1
```

**Reference:** Field mapping in `.docs/field-mapping.md`

---

## 4. DocuSeal

**Login:**
- URL: https://api.docuseal.com
- Account: Ben's Account (bc@crowestudio.com)

**API Configuration:**
```
Base URL: https://api.docuseal.com
Header: X-Auth-Token
API Key: 9jnCPmKv5FfnokxJBnn4ij1tPgsQPEqqXASs2MSyaRN
```

**Webhook Configuration:**
```
Endpoint: https://ngovnamnjmexdpjtcnky.supabase.co/functions/v1/docuseal-webhook
Events: Document signed/completed
```

---

## 5. Resend

**Login:**
- URL: `https://resend.com/`
- Username: `bc@crowestudio.com`
- Password: `37NPMU%kU#SRcEL$`

**API Configuration:**
```
API Key: re_8B4Po2eL_84kFfQeEHAf4z4GFTLaqTv94
Base URL: https://api.resend.com
Domain: valta.ca (verified)
Sender: admin@valta.ca
```

---

## 6. Pipedrive CRM

**Login:**
- URL: https://app.pipedrive.com
- Username: `appraisal@chrischornohos.com`
- Password: `Pipechris1234!`

**API Configuration:**
```
API Key: [To be retrieved from Pipedrive dashboard]
Base URL: [Organization-specific URL from Pipedrive]
```

**Status:** Login credentials confirmed - API key to be retrieved from dashboard

---

## 7. Payment Processor (Stripe - Recommended)

**Purpose:** Process client payments via Next.js embedded checkout

**Login:**
- Dashboard: https://dashboard.stripe.com
- Username: [Provide]
- Password: [Provide]

**API Configuration:**
```
Publishable Key: [Provide - safe for frontend]
Secret Key: [Provide - server-side only, stored in Supabase secrets]
Webhook Secret: [Provide - for payment confirmation webhooks]
```

**Integration:**
- Next.js payment page: `/payment/:jobId` or `/checkout/:sessionId`
- Stripe Checkout embedded (branded to match valta.ca)
- Webhooks to N8N for payment confirmation automation

**Test Mode:**
- Separate test API keys for development
- Test card: 4242 4242 4242 4242

**Need from client:**
- Stripe account creation (or existing credentials)
- Banking information for deposits
- Business verification details

**Status:** To be set up - N8N workflow ready once Stripe configured

---

## 8. N8N Cloud (Payment Automation)

**Purpose:** Payment email workflows, Stripe integration, CRM updates

**Login:**
- URL: https://crowestudio.app.n8n.cloud
- Dashboard: https://crowestudio.app.n8n.cloud/home/workflows
- Username: `bc@crowestudio.com`
- Password: `dAdBhNKb%R4Qi!gU`

**API Configuration:**
```
API Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTk0YTI1Yy0yNGJjLTRlYTMtYmFlYy05NGI2Nzc1OWMwYjkiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzQ5ODM3MDE5fQ.QwfGCt0qYQAcNnoQJ5QLU6s7YFzXOJeCHJpp3K5mJdk
Endpoint: https://crowestudio.app.n8n.cloud
```

**Workflows for Phase 1:**
1. Payment Email Workflow (LOE signed → email with Stripe link)
2. Payment Confirmation Workflow (Stripe webhook → update Supabase/Pipedrive/ClickUp)

**Credentials Currently Available:**
- ✅ Supabase API key (from .env.local)
- ✅ ClickUp API key (`pk_10791838_U80AIXPC66YFCS56AGWT71SAPXWH6EU5`)
- ✅ Resend API key (`re_8B4Po2eL_84kFfQeEHAf4z4GFTLaqTv94`)
- ✅ DocuSeal API key (`9jnCPmKv5FfnokxJBnn4ij1tPgsQPEqqXASs2MSyaRN`)

**Credentials Needed for N8N Workflows:**
- ⏳ Stripe Secret key (after client provides Stripe account)
- ⏳ Pipedrive API key (client may have existing account - to be confirmed)

**Status:** Active - ClickUp/Resend/DocuSeal configured; Stripe/Pipedrive pending

---

## 9. Gmail (Valta Admin)

**Purpose:** Email sender for LOE and payment communications via Resend

**Login:**
- Email: `admin@valta.ca`
- Password: `Emailcircle1estates!`

**Configuration:**
- Used as sender in Resend API (`FROM: admin@valta.ca`)
- Domain verified in Resend

---

## 10. Valta.ca Website/Hosting

**Hosting:** Vercel  
**Deployment:** GitHub to Vercel (auto-deploy from main branch)

**Vercel Project:**
- Project: `valta-live-repo` (Production - valta.ca)
- Project ID: `prj_7DUiwOm9hNXzOYwwYFSCVvJwigmk`
- Org ID: `team_wNn948n6ztMnT8LYqOLcjglm`
- Dashboard: https://vercel.com/dashboard

**Vercel Login:**
- URL: https://vercel.com/login
- Username: [Provide]
- Password: [Provide]

**GitHub Repository:**
- Repo: `ben-crowe/valta-website-staging`
- Branch: `main` (auto-deploys to production)

---

## Environment Variables (.env.local)

```bash
# Supabase
VITE_SUPABASE_PROJECT_ID="ngovnamnjmexdpjtcnky"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nb3ZuYW1uam1leGRwanRjbmt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MTk0NzAsImV4cCI6MjA1NzI5NTQ3MH0.i5pxHZ6Uvo1kcyws-C0tSegs35pA7tMO287_gYXIkGQ"
VITE_SUPABASE_URL="https://ngovnamnjmexdpjtcnky.supabase.co"

# ClickUp
VITE_CLICKUP_ENV="production"
```

**Server-side secrets** (stored in Supabase Edge Function secrets):
- VALCRE_API_KEY
- CLICKUP_API_KEY
- CLICKUP_LIST_ID
- RESEND_API_KEY

---

---

## Additional Client Accounts

### GoDaddy (Domain Management)
**Login:**
- URL: https://www.godaddy.com
- Username: `chrischornohos`
- Password: `StoneAspen1!`
- Customer No: `101276862`
- Account Created: March 24, 2015
- Email on Account: `chris@chrischornohos.com`

### LinkedIn
**Login:**
- Email: `chris@chrischornohos.com`
- Password: `Linkedin1`

---

## Phase 2 Systems (Reference Only)

**Houski API:**
```
API Key: e081b601-58f5-4b03-858a-7584874089e0
Base URL: https://api.houski.ca/v1
```

**Google Drive API:** Not needed for Phase 1

---

## Still Needed

**Missing Information:**

1. **Supabase:** Dashboard login credentials
2. **ClickUp:** Client's List ID and Workspace ID (where tasks should be created)
3. **Stripe:** Client to provide Stripe account setup and API keys
4. **Pipedrive:** API key (retrieve from dashboard using login above)
5. **Vercel:** Login credentials

---

**Document Version:** 1.1  
**Last Updated:** November 2, 2025  
**Status:** Core credentials complete - Client-specific Stripe/ClickUp workspace pending

---

## Notes

**Single Source of Truth:**
This document is the credential reference for Phase 1. 

**TODO:** Cross-reference with Systems Guide (`APR-Systems-Guide-v3.1.md`) to ensure credentials match between both documents. If discrepancies found, this document takes precedence.

---

**END OF CREDENTIALS REFERENCE**
