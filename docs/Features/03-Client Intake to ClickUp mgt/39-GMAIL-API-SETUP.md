# Gmail API Setup for bc@crowestudio.com - Email Testing

**Created:** January 8, 2026  
**Purpose:** Set up Gmail API access for `bc@crowestudio.com` to enable autonomous email verification for end-to-end testing  
**Status:** ✅ WORKING - Email checker functional

---

## Overview

This guide helps you set up Gmail API access for `bc@crowestudio.com` so that automated testing can verify email delivery without manual inbox checking.

**What This Enables:**
- ✅ Verify LOE emails were delivered to `bc@crowestudio.com`
- ✅ Check email content (subject, body, links)
- ✅ Verify email timing
- ✅ Autonomous end-to-end testing
- ✅ Wait for emails to arrive (useful for testing)

---

## Quick Start

### Step 1: Run Setup Script

```bash
bash scripts/setup-bc-email-auth.sh
```

This script will:
1. Create the credentials directory
2. Guide you through getting OAuth credentials from Google Cloud Console
3. Install Python dependencies
4. Run initial authentication

### Step 2: Get OAuth Credentials

The setup script will guide you, but here's the quick version:

1. **Go to Google Cloud Console:**
   - https://console.cloud.google.com/
   - Sign in with `bc@crowestudio.com`

2. **Create or Select a Project:**
   - Create a new project: "APR Dashboard Email Testing"
   - Or use an existing project

3. **Enable Gmail API:**
   - Go to "APIs & Services" > "Library"
   - Search for "Gmail API"
   - Click "Enable"

4. **Create OAuth 2.0 Credentials:**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: **"Desktop app"**
   - Name: "APR Dashboard - bc@crowestudio.com"
   - Click "Create"

5. **Download Credentials:**
   - Click "Download JSON"
   - Save as: `credentials/bc-crowestudio/credentials.json`

6. **Run Setup Again:**
   ```bash
   bash scripts/setup-bc-email-auth.sh
   ```
   - This will complete the OAuth flow (opens browser)

---

## Usage Examples

### Check Latest Emails

```bash
# Get latest 5 emails
python3 scripts/check-bc-email.py --latest --max-results 5

# Show full body
python3 scripts/check-bc-email.py --latest --max-results 3 --show-body
```

### Search for Specific Emails

```bash
# Search by subject
python3 scripts/check-bc-email.py --search "subject:Letter of Engagement" --max-results 5

# Search by sender
python3 scripts/check-bc-email.py --search "from:onboarding@resend.dev" --max-results 10

# Search by date (today)
python3 scripts/check-bc-email.py --search "after:2026/1/8" --max-results 10

# Complex search
python3 scripts/check-bc-email.py --search "subject:Letter of Engagement after:2026/1/8" --max-results 5
```

### Get Specific Email

```bash
# Get email by message ID (show full body)
python3 scripts/check-bc-email.py --email-id "18a1b2c3d4e5f6g7" --show-body
```

### Wait for Email (Useful for Testing)

```bash
# Wait up to 120 seconds for an LOE email
python3 scripts/check-bc-email.py --wait-for "subject:Letter of Engagement" --timeout 120 --show-body

# Wait for any email from Resend
python3 scripts/check-bc-email.py --wait-for "from:onboarding@resend.dev" --timeout 60
```

### Using TypeScript Wrapper

```bash
# TypeScript wrapper (calls Python script)
npx tsx scripts/check-bc-email.ts --latest --max-results 5
npx tsx scripts/check-bc-email.ts --search "subject:Letter of Engagement"
npx tsx scripts/check-bc-email.ts --wait-for "subject:Letter of Engagement" --timeout 120
```

---

## Gmail Search Query Syntax

The `--search` parameter uses Gmail's search syntax:

- **Subject:** `subject:Letter of Engagement`
- **From:** `from:onboarding@resend.dev`
- **To:** `to:bc@crowestudio.com`
- **Date:** `after:2026/1/8` or `before:2026/1/9`
- **Has attachment:** `has:attachment`
- **Is unread:** `is:unread`
- **Combined:** `subject:Letter from:onboarding@resend.dev after:2026/1/8`

**Full Gmail search syntax:** https://support.google.com/mail/answer/7190

---

## Integration with Testing

### Example: Test LOE Email Delivery

```bash
#!/bin/bash
# test-loe-email-delivery.sh

echo "📧 Sending LOE email..."
# ... send email via Edge Function ...

echo "⏳ Waiting for email to arrive..."
python3 scripts/check-bc-email.py \
  --wait-for "subject:Letter of Engagement" \
  --timeout 120 \
  --show-body

if [ $? -eq 0 ]; then
  echo "✅ Email received!"
else
  echo "❌ Email not received within timeout"
  exit 1
fi
```

### Example: Verify Email Content

```bash
# After sending email, verify it arrived
python3 scripts/check-bc-email.py \
  --search "subject:Letter of Engagement" \
  --max-results 1 \
  --show-body | grep -i "docuseal.com"
```

---

## File Structure

```
apr-dashboard-v3/
├── scripts/
│   ├── check-bc-email.py          # Python Gmail API checker
│   ├── check-bc-email.ts          # TypeScript wrapper
│   └── setup-bc-email-auth.sh     # Setup script
├── credentials/
│   └── bc-crowestudio/
│       ├── credentials.json        # OAuth credentials (from Google Cloud Console)
│       └── token.json             # Access token (auto-generated)
└── docs/
    └── 03-ClickUp-Integration/
        └── 39-GMAIL-API-SETUP.md  # This file
```

---

## Troubleshooting

### "Credentials file not found"

**Solution:** Run the setup script and follow the OAuth credential download steps:
```bash
bash scripts/setup-bc-email-auth.sh
```

### "Missing required Python packages"

**Solution:** Install dependencies:
```bash
pip3 install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib
```

### "Token expired" or "Invalid credentials"

**Solution:** Delete the token file and re-authenticate:
```bash
rm credentials/bc-crowestudio/token.json
python3 scripts/check-bc-email.py --latest --max-results 1
```

### "Gmail API not enabled"

**Solution:** Enable Gmail API in Google Cloud Console:
1. Go to APIs & Services > Library
2. Search for "Gmail API"
3. Click "Enable"

### Browser doesn't open for OAuth

**Solution:** The OAuth flow uses a local server. If it doesn't open automatically:
1. Check the terminal for the authorization URL
2. Copy and paste it into your browser
3. Complete the authorization
4. Copy the authorization code back to the terminal

---

## Security Notes

- ✅ Credentials directory is in `.gitignore` (not committed)
- ✅ `token.json` contains sensitive access tokens
- ✅ OAuth tokens are scoped to read-only Gmail access
- ✅ Tokens can be revoked in Google Cloud Console

**To revoke access:**
1. Go to Google Account > Security > Third-party apps with account access
2. Find "APR Dashboard - bc@crowestudio.com"
3. Click "Remove access"

---

## Next Steps

Once set up, you can:

1. **Test Email Delivery:**
   ```bash
   python3 scripts/check-bc-email.py --wait-for "subject:Letter of Engagement" --timeout 120
   ```

2. **Verify Email Content:**
   ```bash
   python3 scripts/check-bc-email.py --search "subject:Letter of Engagement" --show-body
   ```

3. **Integrate with End-to-End Tests:**
   - Use in test scripts to verify email delivery
   - Check email content matches expected values
   - Verify DocuSeal links are correct

---

## Related Documentation

- [Email Checking Setup (Original)](./12-EMAIL-CHECKING-SETUP.md)
- [Resend Domain Verification](./29-RESEND-DOMAIN-VERIFICATION-GUIDE.md)
- [LOE E-Signature Testing](./25-LOE-E-SIGNATURE-TESTING.md)

---

**Last Updated:** January 8, 2026  
**Status:** Scripts ready - OAuth setup pending user action
