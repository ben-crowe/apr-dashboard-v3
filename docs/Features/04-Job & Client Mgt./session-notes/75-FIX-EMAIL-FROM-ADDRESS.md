# Fix Email From Address - Use Verified Domain

**Issue:** Email failing because using sandbox domain `onboarding@resend.dev`  
**Fix:** Use verified domain `crowestudio.com` in `from` address

---

## Problem

**Error:**
```
You can only send testing emails to your own email address (bc@crowestudio.com). 
To send emails to other recipients, please verify a domain at resend.com/domains, 
and change the `from` address to an email using this domain.
```

**Cause:** Using `onboarding@resend.dev` (sandbox domain) restricts sending

---

## Solution

**Updated Edge Function:**
- Changed `from`: `onboarding@resend.dev` → `noreply@crowestudio.com`
- Using verified domain `crowestudio.com`

**File:** `supabase/functions/send-loe-email-fixed/index.ts`

**Change:**
```typescript
// OLD:
from: 'Valta Appraisals <onboarding@resend.dev>',

// NEW:
from: 'Valta Appraisals <noreply@crowestudio.com>',
```

---

## Deploy Edge Function

**After updating code, deploy:**

```bash
supabase functions deploy send-loe-email-fixed
```

---

## After Deployment

**Test again:**
1. Send LOE email from dashboard
2. Should work now with verified domain
3. Email arrives at `bc@crowestudio.com`

---

**Status:** Code updated - Need to deploy Edge Function!
