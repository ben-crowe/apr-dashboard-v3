# Get Client Secret - Google Changed Interface

**Issue:** Google no longer shows full client secrets after creation

**Solution:** Create a new secret and copy it immediately, OR use existing secret if you saved it

---

## Option 1: Create New Secret (Recommended)

**On the current page:**

1. **Look for:** "ADD SECRET" or "Create Secret" button
2. **Click it** to create a new secret
3. **IMPORTANT:** Copy the secret **immediately** (it will be masked after you leave the page)
4. **Save it securely** - you'll need it for the JSON file

---

## Option 2: Use Existing Secret

**If you have the full secret saved somewhere:**
- Use the first secret: `****PHlx` (if you know the full value)
- Or the second: `****Ttye` (if you know the full value)

---

## Option 3: I'll Create JSON File

**If you can create a new secret and copy it:**

1. **Create new secret** (click "ADD SECRET" or similar)
2. **Copy the full secret** immediately
3. **Tell me the secret** and I'll create the JSON file for you
4. **Or create it yourself** using the format below

---

## JSON File Format

Once you have the full client secret, create: `credentials/bc-crowestudio/credentials.json`

```json
{
  "installed": {
    "client_id": "1051466697976-2nmjqg67klao50ncfvg9a0pf2ah6jo46.apps.googleusercontent.com",
    "client_secret": "FULL_SECRET_HERE",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "redirect_uris": ["http://localhost"]
  }
}
```

---

**Next Step:** Look for "ADD SECRET" or "Create Secret" button, create a new one, and copy it immediately!
