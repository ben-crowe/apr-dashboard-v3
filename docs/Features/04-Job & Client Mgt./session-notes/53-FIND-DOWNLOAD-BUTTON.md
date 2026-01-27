# Find Download JSON Button

**Issue:** Can't find "Download JSON" button

---

## Option 1: Click "Done" First

**On the current page:**

1. **Look for:** "Done" button (usually bottom right)
2. **Click:** "Done"
3. **This should:** Take you to the credentials list page
4. **Then:** Click on your OAuth client to see download option

---

## Option 2: Go to Credentials Page

**If you don't see download button:**

1. **Go to:** APIs & Services > Credentials
2. **Find:** Your OAuth client in the list
   - Name: "APR Dashboard - bc@crowestudio.com"
   - Type: "OAuth 2.0 Client ID"
3. **Click on it** to open details
4. **Look for:** "Download JSON" button or download icon

---

## Option 3: Create JSON Manually

**If you can see Client ID and Client Secret:**

You can create the JSON file manually:

1. **Copy your:**
   - Client ID: `1051466697976-2nmjqg67klao50ncfvg9a0pf2ah6jo46.apps.googleusercontent.com`
   - Client Secret: (should be shown on the page)

2. **Create file:** `credentials/bc-crowestudio/credentials.json`

3. **Format:**
```json
{
  "installed": {
    "client_id": "1051466697976-2nmjqg67klao50ncfvg9a0pf2ah6jo46.apps.googleusercontent.com",
    "client_secret": "YOUR_CLIENT_SECRET_HERE",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "redirect_uris": ["http://localhost"]
  }
}
```

---

**Try Option 1 first:** Click "Done" and see if it takes you to a page with download option!
