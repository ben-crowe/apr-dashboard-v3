# Quick Reference - Google OAuth Block Issue

**For:** Claude Code Agent  
**Issue:** Google blocking OAuth access despite correct configuration

---

## Quick Facts

- **Project:** APR Dashboard Email Testing (`apr-dashboard-email-testing`)
- **Status:** Testing mode, External user type, Test user added, Scope added
- **Error:** "This app is blocked" when running email checker script
- **Script:** `scripts/check-bc-email.py`
- **Credentials:** `credentials/bc-crowestudio/credentials.json`

---

## Most Likely Causes

1. **Wrong Google account** - User signing in with different account than `bc@crowestudio.com`
2. **Propagation delay** - Google needs 30+ minutes to update
3. **Cached token** - Old token file causing issues

---

## Quick Fixes to Try

1. **Delete token cache:**
   ```bash
   rm credentials/bc-crowestudio/token.json
   ```

2. **Run script in terminal** (not via me):
   ```bash
   python3 scripts/check-bc-email.py --latest --max-results 3
   ```

3. **When browser opens:** Make sure you sign in with `bc@crowestudio.com`

4. **Wait 30 minutes** after last config change

---

## Full Details

See: `docs/03-ClickUp-Integration/65-GOOGLE-OAUTH-BLOCK-ISSUE-SUMMARY.md`
