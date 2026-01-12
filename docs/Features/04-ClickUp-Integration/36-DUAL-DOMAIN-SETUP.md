# Dual Domain Setup - Testing & Production

**Date:** January 8, 2026  
**Strategy:** Keep both domains verified for different purposes

---

## 🎯 Two-Domain Strategy

**You can verify BOTH domains in Resend:**
- ✅ `crowestudio.com` - For testing (your domain)
- ✅ `valta.ca` - For production (client's domain)

**Benefits:**
- Test emails come FROM `noreply@crowestudio.com` → TO `bc@crowestudio.com`
- Production emails come FROM `noreply@valta.ca` → TO clients
- Both work independently

---

## 📧 Email Address Strategy

### Testing (crowestudio.com)

**FROM:** `noreply@crowestudio.com` or `bc@crowestudio.com`  
**TO:** `bc@crowestudio.com` (your email for testing)

**Use Case:**
- Testing LOE emails
- Testing form submissions
- Development/testing workflows

---

### Production (valta.ca)

**FROM:** `noreply@valta.ca` (recommended)  
**Alternative:** `admin@valta.ca` (also fine, but less standard)

**Why `noreply@valta.ca` instead of `admin@valta.ca`?**
- ✅ More standard/professional
- ✅ Clear it's automated (not personal)
- ✅ Less risk of spam complaints affecting admin inbox
- ✅ Better for automated emails

**TO:** Client emails (e.g., `client@example.com`)

**Use Case:**
- Production LOE emails to clients
- Form submission notifications
- Production workflows

---

## ✅ Keep Both Domains Verified

**Recommendation:** Keep `crowestudio.com` verified!

**Reasons:**
1. ✅ Can send test emails to `bc@crowestudio.com`
2. ✅ Testing doesn't affect production
3. ✅ Can test without touching client's domain
4. ✅ Both domains can coexist in Resend

**No need to delete** - having both verified gives you flexibility!

---

## 🔧 Edge Function Strategy

**You can use different `from` addresses based on environment:**

### Option 1: Environment-Based (Recommended)

```typescript
// In Edge Function
const isProduction = Deno.env.get('ENVIRONMENT') === 'production';

const fromAddress = isProduction
  ? 'Valta Appraisals <noreply@valta.ca>'  // Production
  : 'Valta Appraisals <noreply@crowestudio.com>'; // Testing

// Send to actual recipient (no restrictions after domain verification)
const actualRecipient = to;
```

### Option 2: Always Use Production Domain

```typescript
// Always use valta.ca for production
const fromAddress = 'Valta Appraisals <noreply@valta.ca>';
const actualRecipient = to; // Can send to any email
```

---

## 📋 Current Setup Status

**What You Have:**
- ✅ `crowestudio.com` DNS records added to GoDaddy
- ✅ Waiting for verification
- ⏳ `valta.ca` - Not yet verified (can add later)

**What You Should Do:**

1. **Keep `crowestudio.com` verified** (for testing)
   - Can send to `bc@crowestudio.com`
   - Use for development/testing

2. **Also verify `valta.ca`** (for production)
   - Add `valta.ca` domain in Resend
   - Get DNS records for `valta.ca`
   - Add records to valta.ca DNS in GoDaddy
   - Use `noreply@valta.ca` for production emails

---

## 🎯 Recommended FROM Addresses

### Testing
- `noreply@crowestudio.com` ✅
- `bc@crowestudio.com` ✅

### Production
- `noreply@valta.ca` ✅ (Recommended - standard, professional)
- `admin@valta.ca` ✅ (Also fine, but less standard)
- `clientcare@valta.ca` ✅ (If that's the support email)

**Avoid:**
- ❌ `admin@valta.ca` for automated emails (better for personal/admin use)
- ✅ `noreply@valta.ca` is industry standard for automated emails

---

## 💡 Why `noreply@valta.ca` Instead of `admin@valta.ca`?

**`noreply@valta.ca`:**
- ✅ Standard for automated emails
- ✅ Clear it's not a personal inbox
- ✅ Less risk of spam complaints affecting admin inbox
- ✅ Professional appearance
- ✅ Industry best practice

**`admin@valta.ca`:**
- ⚠️ Looks like a personal/admin inbox
- ⚠️ Spam complaints could affect admin email
- ⚠️ Less clear it's automated
- ✅ Still works, but not ideal for automated emails

---

## ✅ Action Plan

**Keep Both Domains:**

1. **Keep `crowestudio.com` verified** ✅
   - For testing
   - Can send to `bc@crowestudio.com`

2. **Also verify `valta.ca`** (when ready)
   - Add domain in Resend
   - Add DNS records to valta.ca DNS
   - Use `noreply@valta.ca` for production

3. **Update Edge Function:**
   - Use `noreply@valta.ca` for production
   - Use `noreply@crowestudio.com` for testing (optional)
   - Can send to any email address

---

## 🎉 Bottom Line

**Keep `crowestudio.com` verified** - it's useful for testing!

**Also verify `valta.ca`** for production emails FROM the client's domain.

**Use `noreply@valta.ca`** (not `admin@valta.ca`) for production automated emails - it's more professional and safer.

**Both domains can coexist** - no need to delete either one!

---

**Current Status:** `crowestudio.com` DNS records added ✅  
**Next:** Verify in Resend, then optionally add `valta.ca` for production
