# Email Checking Scripts - Quick Reference

## Setup (One-Time)

```bash
# Run the setup script (guides you through OAuth setup)
bash scripts/setup-bc-email-auth.sh
```

## Common Commands

### Check Latest Emails
```bash
python3 scripts/check-bc-email.py --latest --max-results 5
```

### Search for LOE Emails
```bash
python3 scripts/check-bc-email.py --search "subject:Letter of Engagement" --max-results 5 --show-body
```

### Wait for Email (Testing)
```bash
python3 scripts/check-bc-email.py --wait-for "subject:Letter of Engagement" --timeout 120 --show-body
```

### Get Specific Email
```bash
python3 scripts/check-bc-email.py --email-id "MESSAGE_ID" --show-body
```

## Gmail Search Examples

- `subject:Letter of Engagement` - Search by subject
- `from:onboarding@resend.dev` - Search by sender
- `after:2026/1/8` - Emails after date
- `is:unread` - Unread emails only
- `has:attachment` - Emails with attachments

## Full Documentation

See: `docs/03-ClickUp-Integration/39-GMAIL-API-SETUP.md`
