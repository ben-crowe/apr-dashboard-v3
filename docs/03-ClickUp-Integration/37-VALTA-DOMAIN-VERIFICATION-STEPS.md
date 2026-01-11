# Valta.ca Domain Verification - Step-by-Step Guide

**Date:** January 8, 2026  
**Domain:** `valta.ca` (Client's domain)  
**Purpose:** Production email sending FROM `noreply@valta.ca`

---

## 🎯 Goal

Verify `valta.ca` domain in Resend so production emails come FROM `noreply@valta.ca` (client's domain).

---

## ✅ Step-by-Step Instructions

### Step 1: Add Domain in Resend

1. **Login to Resend:**
   - Go to: https://resend.com/login
   - Email: `admin@valta.ca`
   - Password: `YmnG6HKD$%#FSUPE`

2. **Navigate to Domains:**
   - Click **"Domains"** in the left sidebar
   - You should see `crowestudio.com` listed (if already added)

3. **Add New Domain:**
   - Click **"Add Domain"** button (usually top right)
   - Enter domain: `valta.ca`
   - Click **"Add"** or **"Continue"**

4. **Resend Shows DNS Records:**
   - Resend will display DNS records you need to add
   - You'll see 4 records (same types as crowestudio.com):
     - DKIM (TXT)
     - SPF MX (MX)
     - SPF TXT (TXT)
     - DMARC (TXT) - Optional

5. **Copy/Note the DNS Records:**
   - **Important:** The values will be DIFFERENT from crowestudio.com
   - Copy each record carefully
   - Or keep Resend page open while adding to GoDaddy

---

### Step 2: Login to GoDaddy (valta.ca DNS)

1. **Go to GoDaddy:**
   - URL: https://www.godaddy.com
   - Username: `chrischornohos`
   - Password: `StoneAspen1!` (or get from NordPass if different)

2. **Navigate to DNS Management:**
   - Go to **"My Products"** → **"Domains"**
   - Find `valta.ca` in the list
   - Click on `valta.ca`
   - Click **"DNS"** tab (or "Manage DNS")

3. **You should see existing DNS records** for valta.ca

---

### Step 3: Add DNS Records to valta.ca

**Add each record one by one:**

#### Record 1: DKIM (TXT)
- Click **"Add"** or **"+"** button
- **Type:** Select `TXT`
- **Name:** Enter `resend._domainkey` (exactly as shown in Resend)
- **Value:** Paste the DKIM value from Resend (will be different from crowestudio.com)
- **TTL:** `600` or `1 Hour`
- Click **"Save"**

#### Record 2: SPF MX (MX)
- Click **"Add"** or **"+"** button
- **Type:** Select `MX`
- **Name:** Enter `send`
- **Value:** `feedback-smtp.us-east-1.amazonses.com` (or what Resend shows)
- **Priority:** `10`
- **TTL:** `600` or `1 Hour`
- Click **"Save"**

#### Record 3: SPF TXT (TXT)
- Click **"Add"** or **"+"** button
- **Type:** Select `TXT`
- **Name:** Enter `send`
- **Value:** `v=spf1 include:amazonses.com ~all` (or what Resend shows)
- **TTL:** `600` or `1 Hour`
- Click **"Save"**

#### Record 4: DMARC (TXT) - Optional
- Click **"Add"** or **"+"** button
- **Type:** Select `TXT`
- **Name:** Enter `_dmarc`
- **Value:** `v=DMARC1; p=none;` (or what Resend shows)
- **TTL:** `600` or `1 Hour`
- Click **"Save"**

---

### Step 4: Verify All Records Added

**Check in GoDaddy:**
- All 4 records should be visible in DNS list
- Make sure names and values match exactly what Resend shows
- No typos or extra spaces

---

### Step 5: Wait for DNS Propagation

**Wait Time:** 5-60 minutes (usually 10-30 minutes)

**Optional Check:**
- Go to: https://dnschecker.org
- Search for: `resend._domainkey.valta.ca` (TXT)
- Should show the DKIM value once propagated

---

### Step 6: Verify in Resend

1. **Go back to Resend:** https://resend.com/login
2. **Navigate to Domains:**
   - Click **"Domains"** in sidebar
   - Find `valta.ca` in the list

3. **Click "Verify" Button:**
   - Click **"Verify"** button next to `valta.ca`
   - Resend will check DNS records

4. **Check Status:**
   - Should change to **"Verified"** ✅
   - If still "Pending" or "Failed":
     - Wait longer (DNS might not be propagated yet)
     - Double-check DNS records match exactly
     - Try verify again

---

## ✅ After Verification

**Once `valta.ca` is verified:**

1. **Update Edge Function** to use `noreply@valta.ca`:
   - Change `from` address to: `Valta Appraisals <noreply@valta.ca>`
   - Remove sandbox redirect logic
   - Deploy function

2. **Test:**
   - Send LOE email
   - Should come FROM `noreply@valta.ca`
   - Can send TO any email address

---

## 📋 Checklist

- [ ] Logged into Resend
- [ ] Added `valta.ca` domain in Resend
- [ ] Copied DNS records from Resend
- [ ] Logged into GoDaddy (valta.ca)
- [ ] Added DKIM record (TXT: `resend._domainkey`)
- [ ] Added SPF MX record (MX: `send`)
- [ ] Added SPF TXT record (TXT: `send`)
- [ ] Added DMARC record (TXT: `_dmarc`) - Optional
- [ ] Saved all records in GoDaddy
- [ ] Waited 5-60 minutes for propagation
- [ ] Clicked "Verify" in Resend
- [ ] Status shows "Verified" ✅

---

## 🎯 Current Status

**You Have:**
- ✅ `crowestudio.com` DNS records added (for testing)
- ⏳ `valta.ca` - Ready to add in Resend

**Next Steps:**
1. Add `valta.ca` domain in Resend
2. Get DNS records for `valta.ca`
3. Add records to valta.ca DNS in GoDaddy
4. Verify in Resend

---

**Ready to start?** Go to Resend and add `valta.ca` domain, then we'll add the DNS records to GoDaddy!
