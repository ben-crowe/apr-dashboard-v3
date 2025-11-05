# Environment Variables Setup Guide

## Overview

All API keys and credentials have been moved from hardcoded values in the source code to environment variables for better security and maintainability.

## Setup Instructions

### 1. Create `.env.local` File

Create a file named `.env.local` in the root directory of the project with the following content:

```env
# APR Dashboard V3 - Environment Variables
# DO NOT COMMIT THIS FILE TO VERSION CONTROL

# ============================================
# SUPABASE CONFIGURATION
# ============================================
VITE_SUPABASE_URL=https://ngovnamnjmexdpjtcnky.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nb3ZuYW1uam1leGRwanRjbmt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MTk0NzAsImV4cCI6MjA1NzI5NTQ3MH0.i5pxHZ6Uvo1kcyws-C0tSegs35pA7tMO287_gYXIkGQ
VITE_SUPABASE_PROJECT_ID=ngovnamnjmexdpjtcnky

# ============================================
# CLICKUP INTEGRATION
# ============================================
VITE_CLICKUP_API_TOKEN=pk_10791838_U80AIXPC66YFCS56AGWT71SAPXWH6EU5
VITE_CLICKUP_ENV=production
VITE_CLICKUP_LIST_ID=901402094744

# ============================================
# DOCUSEAL E-SIGNATURE
# ============================================
VITE_DOCUSEAL_API_KEY=9jnCPmKv5FfnokxJBnn4ij1tPgsQPEqqXASs2MSyaRN

# ============================================
# RESEND EMAIL SERVICE
# ============================================
RESEND_API_KEY=re_8B4Po2eL_84kFfQeEHAf4z4GFTLaqTv94

# ============================================
# VALCRE API CREDENTIALS
# ============================================
VALCRE_CLIENT_ID=c9AfkQFS3Scq8YvRsl1DtGbbMRaDDSoh
VALCRE_CLIENT_SECRET=6VLkSjdT-EvELiIh8QLNv-sQrgy-o_P2KXrHn1g1_Sq9p9yPn73NxuBGtKGaO2kZ
VALCRE_USERNAME=chris.chornohos@valta.ca
VALCRE_PASSWORD=Valvalta1!

# ============================================
# GMAIL SMTP (for legacy email sending)
# ============================================
GMAIL_USERNAME=admin@valta.ca
GMAIL_APP_PASSWORD=spusouthiyfmesdj

# ============================================
# APPLICATION CONFIGURATION
# ============================================
VITE_APP_URL=https://apr-dashboard-v2.vercel.app
```

### 2. Update `.gitignore`

Ensure your `.gitignore` file includes:

```
.env.local
.env*.local
```

### 3. Configure Supabase Edge Functions

For Supabase Edge Functions to access environment variables, you need to set them in your Supabase project:

```bash
# Set ClickUp credentials
supabase secrets set CLICKUP_API_TOKEN=pk_10791838_U80AIXPC66YFCS56AGWT71SAPXWH6EU5
supabase secrets set CLICKUP_LIST_ID=901402094744

# Set DocuSeal credentials
supabase secrets set DOCUSEAL_API_KEY=9jnCPmKv5FfnokxJBnn4ij1tPgsQPEqqXASs2MSyaRN

# Set Resend credentials
supabase secrets set RESEND_API_KEY=re_8B4Po2eL_84kFfQeEHAf4z4GFTLaqTv94

# Set Valcre credentials
supabase secrets set VALCRE_CLIENT_ID=c9AfkQFS3Scq8YvRsl1DtGbbMRaDDSoh
supabase secrets set VALCRE_CLIENT_SECRET=6VLkSjdT-EvELiIh8QLNv-sQrgy-o_P2KXrHn1g1_Sq9p9yPn73NxuBGtKGaO2kZ
supabase secrets set VALCRE_USERNAME=chris.chornohos@valta.ca
supabase secrets set VALCRE_PASSWORD=Valvalta1!

# Set Gmail credentials
supabase secrets set GMAIL_USERNAME=admin@valta.ca
supabase secrets set GMAIL_APP_PASSWORD=spusouthiyfmesdj
```

### 4. Configure Vercel Deployment

If deploying to Vercel, add these environment variables in your Vercel project settings:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add all the variables from `.env.local` above

## Files Updated

The following files have been updated to use environment variables:

### Frontend/Client Files (use `import.meta.env.*`)
- `src/utils/webhooks/clickup.ts` - ClickUp API token
- `src/utils/webhooks/docuseal.ts` - DocuSeal API key
- `src/integrations/supabase/client.ts` - Supabase credentials

### API/Serverless Files (use `process.env.*`)
- `api/valcre.ts` - Valcre OAuth credentials

### Supabase Edge Functions (use `Deno.env.get()`)
- `supabase/functions/create-clickup-task/index.ts` - ClickUp credentials
- `supabase/functions/create-valcre-job/index.ts` - Valcre OAuth credentials
- `supabase/functions/docuseal-proxy/index.ts` - DocuSeal API key
- `supabase/functions/send-loe-email-fixed/index.ts` - Resend API key
- `supabase/functions/send-loe-email/index.ts` - Gmail SMTP credentials

## Security Notes

1. **Never commit `.env.local`** to version control
2. **Rotate credentials** if they were previously exposed in committed code
3. **Use different credentials** for development, staging, and production environments
4. **Restrict API key permissions** to only what's necessary
5. **Monitor API usage** for any unauthorized access

## Fallback Values

All environment variable usages include fallback values for backward compatibility. However, it's recommended to always use the environment variables properly configured.

## Troubleshooting

### Environment variables not working in Vite

Vite requires environment variables to be prefixed with `VITE_` to be exposed to the client-side code. Make sure:
- Client-side variables start with `VITE_`
- You restart the dev server after changing `.env.local`

### Supabase Edge Functions not finding variables

Make sure you've set the secrets using `supabase secrets set` command as shown above.

### Vercel deployment issues

Ensure all environment variables are set in Vercel project settings, not just in the `.env.local` file.

## For New Team Members

If you're a new developer joining the project:

1. Copy `.env.example` to `.env.local`
2. Ask the team lead for the actual credential values
3. Fill in the values in your `.env.local` file
4. Never commit this file to git

---

Last Updated: November 4, 2025



