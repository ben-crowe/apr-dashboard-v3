# Valcre Credentials for Testing

**Created:** January 8, 2026  
**Purpose:** Valcre login credentials for Playwright automated testing  
**Security:** ⚠️ **SENSITIVE - DO NOT COMMIT TO GIT**

---

## 🔐 Test Credentials

**Email:** `chris.chornohos@valta.ca`  
**Password:** `Valvalta1!`

---

## 📋 Usage

These credentials are for **automated Playwright testing only**. Use them to:
- Test Valcre job creation flow
- Verify job linking between dashboard and Valcre
- Test "View in Valcre" button functionality

---

## ⚠️ Security Notes

1. **DO NOT** commit this file to git
2. **DO NOT** hardcode credentials in test files
3. **DO** use environment variables for credentials
4. **DO** add this file to `.gitignore`

---

## 🔧 Environment Variable Setup

For Playwright tests, use environment variables:

```bash
# .env.local (DO NOT COMMIT)
VALCRE_TEST_EMAIL=chris.chornohos@valta.ca
VALCRE_TEST_PASSWORD=Valvalta1!
```

Then in test files:
```typescript
const email = process.env.VALCRE_TEST_EMAIL || '';
const password = process.env.VALCRE_TEST_PASSWORD || '';
```

---

## ✅ Verified Jobs

**Test Job (January 8, 2026):**
- Dashboard: `/dashboard/job/f8f1106a-e44c-477e-b046-42315ce38d8f`
- Valcre: `https://app.valcre.com/job/edit/754404`
- Status: ✅ Successfully linked
