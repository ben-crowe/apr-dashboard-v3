# DNS Records to Add - crowestudio.com

**Domain:** `crowestudio.com`  
**Purpose:** Verify domain in Resend to enable sending to any email address  
**Date:** January 8, 2026

---

## 📋 DNS Records from Resend

### 1. DKIM Record (Required)

**Type:** `TXT`  
**Name/Host:** `resend._domainkey`  
**Value:** 
```
p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCirMs4TgGDG++1nMPXP3JtuCTm5pJNvOV0060wEQbx6OvgLOpNTEqUdWj9opFq7FIRZ6FIkI90Mhzytm17YZbNWAno0pdbkcdD8aSOqsC2szaGNakXwwnFXmAxgZI/WAPDypovN9KY/QVgiKiQcbgwg6suMQofUu0kNdIQaUG6VwIDAQAB
```
**TTL:** Auto (or 3600)

**Full DNS Name:** `resend._domainkey.crowestudio.com`

---

### 2. SPF Record - MX (Required)

**Type:** `MX`  
**Name/Host:** `send`  
**Value:** `feedback-smtp.us-east-1.amazonses.com`  
**Priority:** `10`  
**TTL:** Auto (or 3600)

**Full DNS Name:** `send.crowestudio.com`

---

### 3. SPF Record - TXT (Required)

**Type:** `TXT`  
**Name/Host:** `send`  
**Value:** `v=spf1 include:amazonses.com ~all`  
**TTL:** Auto (or 3600)

**Full DNS Name:** `send.crowestudio.com`

---

### 4. DMARC Record (Optional but Recommended)

**Type:** `TXT`  
**Name/Host:** `_dmarc`  
**Value:** `v=DMARC1; p=none;`  
**TTL:** Auto (or 3600)

**Full DNS Name:** `_dmarc.crowestudio.com`

**Note:** This is optional but recommended for better email deliverability.

---

## 🔧 How to Add These Records

### Step 1: Find Your DNS Provider

**Where is crowestudio.com DNS managed?**
- Check where domain was registered (GoDaddy, Namecheap, Cloudflare, etc.)
- Or check current DNS nameservers

**Common DNS Providers:**
- GoDaddy
- Cloudflare
- Namecheap
- Google Domains
- AWS Route 53

---

### Step 2: Log Into DNS Provider

1. Go to your DNS provider's website
2. Log in with your credentials
3. Find DNS management section
4. Select `crowestudio.com` domain

---

### Step 3: Add Each Record

**For each record above, add it to your DNS:**

#### Record 1: DKIM (TXT)
- **Type:** TXT
- **Name/Host:** `resend._domainkey` (or `resend._domainkey.crowestudio.com` - depends on provider)
- **Value:** `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCirMs4TgGDG++1nMPXP3JtuCTm5pJNvOV0060wEQbx6OvgLOpNTEqUdWj9opFq7FIRZ6FIkI90Mhzytm17YZbNWAno0pdbkcdD8aSOqsC2szaGNakXwwnFXmAxgZI/WAPDypovN9KY/QVgiKiQcbgwg6suMQofUu0kNdIQaUG6VwIDAQAB`
- **TTL:** 3600 (or Auto)

#### Record 2: SPF MX (MX)
- **Type:** MX
- **Name/Host:** `send` (or `send.crowestudio.com`)
- **Value:** `feedback-smtp.us-east-1.amazonses.com`
- **Priority:** 10
- **TTL:** 3600 (or Auto)

#### Record 3: SPF TXT (TXT)
- **Type:** TXT
- **Name/Host:** `send` (or `send.crowestudio.com`)
- **Value:** `v=spf1 include:amazonses.com ~all`
- **TTL:** 3600 (or Auto)

#### Record 4: DMARC (TXT) - Optional
- **Type:** TXT
- **Name/Host:** `_dmarc` (or `_dmarc.crowestudio.com`)
- **Value:** `v=DMARC1; p=none;`
- **TTL:** 3600 (or Auto)

---

### Step 4: Save and Wait

1. **Save all DNS records** in your DNS provider
2. **Wait 5-60 minutes** for DNS propagation
3. **Check DNS propagation:** https://dnschecker.org
   - Search for: `resend._domainkey.crowestudio.com` (TXT)
   - Should show the DKIM value

---

### Step 5: Verify in Resend

1. Go back to Resend dashboard → Domains
2. Click on `crowestudio.com`
3. Click **"Verify"** button
4. Resend will check DNS records
5. Status should change to **"Verified"** ✅

---

## 📝 DNS Provider Examples

### GoDaddy
1. Login to GoDaddy
2. Go to **My Products** → **Domains**
3. Click on `crowestudio.com`
4. Click **"DNS"** tab
5. Click **"Add"** button
6. Select record type (TXT or MX)
7. Enter Name, Value, TTL
8. Save

### Cloudflare
1. Login to Cloudflare
2. Select `crowestudio.com` domain
3. Go to **DNS** section
4. Click **"Add record"**
5. Select Type (TXT or MX)
6. Enter Name, Content, TTL
7. Save

### Namecheap
1. Login to Namecheap
2. Go to **Domain List**
3. Click **"Manage"** next to `crowestudio.com`
4. Go to **"Advanced DNS"** tab
5. Click **"Add New Record"**
6. Select Type, enter Host, Value, TTL
7. Save

---

## ✅ Verification Checklist

- [ ] Added DKIM record (TXT: `resend._domainkey`)
- [ ] Added SPF MX record (MX: `send`)
- [ ] Added SPF TXT record (TXT: `send`)
- [ ] Added DMARC record (TXT: `_dmarc`) - Optional
- [ ] Saved all records in DNS provider
- [ ] Waited 5-60 minutes for propagation
- [ ] Clicked "Verify" in Resend
- [ ] Status shows "Verified" ✅

---

## 🐛 Troubleshooting

### If Verification Fails:

1. **Check DNS propagation:**
   - Use https://dnschecker.org
   - Search for each record
   - Make sure values match exactly

2. **Common Issues:**
   - **Wrong Name:** Make sure name is exactly `resend._domainkey` (not `resend._domainkey.crowestudio.com` - depends on provider)
   - **Wrong Value:** Copy/paste entire value exactly
   - **TTL too high:** Use 3600 or Auto
   - **Not propagated:** Wait longer (up to 24 hours in rare cases)

3. **Double-check:**
   - All records added correctly
   - No typos in values
   - Records are active (not disabled)

---

## 🎯 After Verification

Once verified:
1. Update Edge Function to use `noreply@crowestudio.com`
2. Remove sandbox redirect logic
3. Deploy function
4. Test sending to `bc@crowestudio.com` ✅

---

**Need Help?** Tell me which DNS provider you're using and I can give you exact steps!
