# Resend Domain Verification Guide

**Purpose:** Enable sending emails to any address (including bc@crowestudio.com)  
**Current Issue:** Sandbox domain can only send to admin@valta.ca  
**Solution:** Verify a domain in Resend (no upgrade needed!)

---

## 🎯 Goal

Verify `crowestudio.com` domain in Resend so you can:
- Send emails to `bc@crowestudio.com` (your email)
- Send emails to any other email address
- Remove sandbox restrictions

---

## ✅ Step-by-Step Instructions

### Step 1: Login to Resend

1. Go to: https://resend.com/login
2. Email: `admin@valta.ca`
3. Password: `YmnG6HKD$%#FSUPE`

---

### Step 2: Add Domain

1. In Resend dashboard, click **"Domains"** in the sidebar
2. Click **"Add Domain"** button
3. Enter domain: `crowestudio.com`
4. Click **"Add"**

---

### Step 3: Get DNS Records

Resend will show you DNS records to add. You'll need:

1. **DKIM Record** (TXT)
   - Name: `resend._domainkey`
   - Value: `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCirMs4TgGDG++1nMPXP3JtuCTm5pJNvOV0060wEQbx6OvgLOpNTEqUdWj9opFq7FIRZ6FIkI90Mhzytm17YZbNWAno0pdbkcdD8aSOqsC2szaGNakXwwnFXmAxgZI/WAPDypovN9KY/QVgiKiQcbgwg6suMQofUu0kNdIQaUG6VwIDAQAB`

2. **SPF MX Record** (MX)
   - Name: `send`
   - Value: `feedback-smtp.us-east-1.amazonses.com`
   - Priority: `10`

3. **SPF TXT Record** (TXT)
   - Name: `send`
   - Value: `v=spf1 include:amazonses.com ~all`

4. **DMARC Record** (TXT) - Optional
   - Name: `_dmarc`
   - Value: `v=DMARC1; p=none;`

**See detailed guide:** `32-DNS-RECORDS-TO-ADD.md` for exact values and instructions.

---

### Step 4: Add DNS Records

1. **Find your DNS provider** (where crowestudio.com DNS is managed)
   - Could be: GoDaddy, Cloudflare, Namecheap, etc.
   - Check where the domain was registered

2. **Add the DNS records:**
   - Log into your DNS provider
   - Go to DNS management for `crowestudio.com`
   - Add each TXT record that Resend provided
   - Save changes

3. **Wait for DNS propagation:**
   - Usually takes 5-60 minutes
   - Can check with: https://dnschecker.org

---

### Step 5: Verify in Resend

1. Go back to Resend dashboard → Domains
2. Click on `crowestudio.com`
3. Click **"Verify"** button
4. Resend will check DNS records
5. Status should change to **"Verified"** ✅

---

### Step 6: Update Edge Function

Once domain is verified, update the Edge Function:

**File:** `supabase/functions/send-loe-email-fixed/index.ts`

**Change:**
```typescript
// OLD (sandbox):
from: 'Valta Appraisals <onboarding@resend.dev>',
// Remove redirect logic

// NEW (verified domain):
from: 'Valta Appraisals <noreply@crowestudio.com>',
// Send to actual recipient (no redirect)
```

**Remove redirect logic:**
```typescript
// REMOVE THIS:
const actualRecipient = 'admin@valta.ca';
if (to !== 'admin@valta.ca') {
  console.log(`⚠️ Sandbox restriction...`);
}

// REPLACE WITH:
// Send to actual recipient
const actualRecipient = to;
```

**Deploy:**
```bash
supabase functions deploy send-loe-email-fixed
```

---

## 🎉 Result

After verification:
- ✅ Can send to `bc@crowestudio.com`
- ✅ Can send to any email address
- ✅ No sandbox restrictions
- ✅ Professional `from` address: `noreply@crowestudio.com`

---

## 💡 Alternative: Use valta.ca Domain

If you prefer to verify `valta.ca` instead:
- Same process as above
- Use `valta.ca` domain
- Update `from` address to: `noreply@valta.ca` or `admin@valta.ca`

---

## ❓ FAQ

**Q: Do I need to upgrade Resend?**  
A: No! Free plan supports domain verification.

**Q: How long does verification take?**  
A: Usually 5-60 minutes after DNS records are added.

**Q: Can I verify multiple domains?**  
A: Yes! You can verify both `crowestudio.com` and `valta.ca` if needed.

**Q: What if I don't have DNS access?**  
A: You'll need to contact whoever manages the DNS for crowestudio.com.

---

**Need Help?** Check Resend docs: https://resend.com/docs/dashboard/domains/introduction
