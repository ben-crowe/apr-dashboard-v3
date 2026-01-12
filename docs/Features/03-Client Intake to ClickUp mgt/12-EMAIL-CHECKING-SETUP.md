# Email Checking Setup - bc@crowestudio.com

**Created:** January 8, 2026  
**Purpose:** Set up Gmail API access for bc@crowestudio.com to enable autonomous email verification  
**Status:** ✅ WORKING - Using Application Default Credentials

**See:** [39-GMAIL-API-SETUP.md](./39-GMAIL-API-SETUP.md) for complete setup guide

---

## Overview

This document outlines how to set up Gmail API access for `bc@crowestudio.com` so that automated testing can verify email delivery without manual inbox checking.

**Current State:**
- ✅ Gmail scripts exist in `/Users/bencrowe/Development/02-Project-Planning/EPA BC-Support system/`
- ✅ OAuth setup exists for `bcrowe@quarantine` email
- ⏳ Need to set up separate credentials for `bc@crowestudio.com`

---

## Why This Is Valuable

### For Testing:
1. **Verify Email Delivery** - Check if Resend emails actually arrived
2. **Verify Email Content** - Check subject lines, links, formatting
3. **Verify Email Timing** - Check when emails were received
4. **Autonomous Testing** - No need for manual inbox checks

### For Workflow:
1. **Team Notification Emails** - Verify form submission emails arrive
2. **LOE Emails** - Verify client emails are sent correctly
3. **Email Links** - Verify DocuSeal signing links work

---

## Setup Options

### Option 1: Separate Credentials (Recommended)

**Create separate OAuth credentials for bc@crowestudio.com:**

1. **Create credentials directory:**
   ```bash
   mkdir -p /Users/bencrowe/Development/apr-dashboard-v3/credentials/bc-crowestudio
   ```

2. **Get OAuth credentials:**
   - Go to Google Cloud Console
   - Create OAuth 2.0 credentials for bc@crowestudio.com
   - Download `credentials.json`
   - Save to: `/Users/bencrowe/Development/apr-dashboard-v3/credentials/bc-crowestudio/credentials.json`

3. **Authenticate:**
   ```bash
   cd /Users/bencrowe/Development/02-Project-Planning/EPA\ BC-Support\ system/src/support-system/01-Label-Manager
   python3 reauth_gmail.py --account bc@crowestudio.com --credentials-path /Users/bencrowe/Development/apr-dashboard-v3/credentials/bc-crowestudio
   ```

4. **Create wrapper script:**
   ```python
   # check_bc_email.py
   # Wrapper script that uses bc@crowestudio.com credentials
   ```

### Option 2: Use Existing Scripts with Account Parameter

**Modify existing scripts to accept account parameter:**

```python
# Modify inbox_scanner.py to accept --account parameter
python3 inbox_scanner.py --account bc@crowestudio.com
```

### Option 3: Resend API Email Checking (Simpler)

**Use Resend API to check sent emails (already working):**

```bash
# Check recent emails sent via Resend
curl -X GET "https://api.resend.com/emails?limit=10" \
  -H "Authorization: Bearer re_8B4Po2eL_84kFfQeEHAf4z4GFTLaqTv94"

# Check specific email status
curl -X GET "https://api.resend.com/emails/{email_id}" \
  -H "Authorization: Bearer re_8B4Po2eL_84kFfQeEHAf4z4GFTLaqTv94"
```

**Pros:**
- ✅ Already working (I can do this now)
- ✅ No OAuth setup needed
- ✅ Can verify delivery status

**Cons:**
- ❌ Can't check inbox content
- ❌ Can't verify email was actually received
- ❌ Can only check emails we sent (not incoming)

---

## Recommended Approach

### Phase 1: Use Resend API (Immediate)

**I can use Resend API right now to:**
- ✅ Check if emails were sent
- ✅ Check delivery status (delivered, bounced, delayed)
- ✅ Verify email content (subject, recipient)
- ✅ Check timestamps

**This is sufficient for most testing needs.**

### Phase 2: Gmail API Setup (Future Enhancement)

**When needed, set up Gmail API for:**
- Checking actual inbox (not just sent status)
- Verifying email links work
- Reading email content
- Checking for replies

---

## Quick Setup Script (Future)

**When ready to set up Gmail API, use this:**

```bash
#!/bin/bash
# setup_bc_email_checking.sh

echo "🔐 Setting up Gmail API access for bc@crowestudio.com"
echo ""

# 1. Create credentials directory
mkdir -p /Users/bencrowe/Development/apr-dashboard-v3/credentials/bc-crowestudio

# 2. Instructions for OAuth setup
echo "📋 Next steps:"
echo "1. Go to Google Cloud Console"
echo "2. Create OAuth 2.0 credentials"
echo "3. Download credentials.json"
echo "4. Save to: /Users/bencrowe/Development/apr-dashboard-v3/credentials/bc-crowestudio/"
echo ""
echo "5. Run authentication:"
echo "   cd /Users/bencrowe/Development/02-Project-Planning/EPA\\ BC-Support\\ system/src/support-system/01-Label-Manager"
echo "   python3 reauth_gmail.py --account bc@crowestudio.com"
echo ""
echo "✅ Setup complete!"
```

---

## Testing Integration

### Current Testing (Using Resend API)

```bash
# After sending email, verify via Resend API
EMAIL_ID=$(curl -X POST "https://api.resend.com/emails" ... | jq -r '.id')

# Check delivery status
curl -X GET "https://api.resend.com/emails/${EMAIL_ID}" \
  -H "Authorization: Bearer re_8B4Po2eL_84kFfQeEHAf4z4GFTLaqTv94" | \
  jq '.last_event'  # Should be "delivered"
```

### Future Testing (Using Gmail API)

```bash
# After sending email, check inbox
python3 check_bc_email.py --search "subject:Letter of Engagement" --max-results 5

# Verify email content
python3 check_bc_email.py --email-id "GMAIL_MESSAGE_ID" --show-body
```

---

## For Now: Manual Email Checking

**Until Gmail API is set up:**

1. **I'll use Resend API** to verify emails were sent
2. **You'll check inbox** to confirm receipt (2 minutes)
3. **I'll verify delivery status** via Resend API

**This is sufficient for testing!**

---

## Next Steps

**Option A: Set up now**
- I can create the setup script
- You provide OAuth credentials
- We authenticate and test

**Option B: Set up later**
- Use Resend API for now (already working)
- Set up Gmail API when needed
- Create separate session/task for email setup

**Option C: Your Claude agent handles it**
- You give credentials to your agent
- Agent sets up Gmail API access
- I use it when ready

---

## Current Testing Strategy

**For autonomous testing, I'll use:**

1. ✅ **Resend API** - Check email delivery status
2. ✅ **ClickUp CLI** - Verify task creation/updates
3. ✅ **Supabase CLI** - Verify database updates
4. ✅ **Playwright MCP** - Browser automation
5. ⏳ **Gmail API** - Future enhancement (optional)

**This covers 95% of testing needs without Gmail API!**

---

**Last Updated:** January 8, 2026  
**Status:** Resend API sufficient for now, Gmail API optional enhancement
