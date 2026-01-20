# Verify Gmail API Setup Status

**Quick Checklist:** Let's verify what's already done

---

## Check 1: Gmail API Enabled?

1. **Click:** "APIs & Services" in left menu
2. **Click:** "Enabled APIs & services" (or "Library")
3. **Search for:** "Gmail API"
4. **Is it listed?** ✅ Yes = Enabled | ❌ No = Need to enable

---

## Check 2: OAuth Consent Screen Configured?

1. **Click:** "APIs & Services" > "OAuth consent screen"
2. **What do you see?**
   - ✅ "OAuth consent screen" with app name = Configured
   - ❌ "Get started" button = Not configured yet

---

## Check 3: OAuth Client Created?

1. **Click:** "APIs & Services" > "Credentials"
2. **Look for:** OAuth 2.0 Client IDs
3. **Do you see any clients listed?**
   - ✅ Yes = Client exists
   - ❌ No = Need to create one

---

## Check 4: Test User Added?

1. **Go to:** OAuth consent screen
2. **Look for:** "Test users" section
3. **Is `bc@crowestudio.com` listed?**
   - ✅ Yes = Good
   - ❌ No = Need to add

---

## Quick Test

**Try running the script:**
```bash
python3 scripts/check-bc-email.py --latest --max-results 5
```

**What happens?**
- ✅ Works = Everything is set up!
- ❌ "App blocked" = Need to check test users and testing mode
- ❌ "No credentials" = Need to create OAuth client

---

**Let's verify each step!**
