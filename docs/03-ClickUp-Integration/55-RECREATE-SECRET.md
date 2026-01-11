# Recreate Client Secret

**Issue:** Created secret but didn't copy it before it disappeared

**Solution:** Create another new secret and copy it immediately

---

## Step 1: Create Another Secret

**On the OAuth client page:**

1. **Look for:** "ADD SECRET" or "Create Secret" button again
2. **Click it** to create another secret
3. **A dialog/popup will appear** showing the new secret
4. **DO NOT CLICK ANYTHING YET**
5. **Copy the secret immediately** (select all and copy)
6. **Then** click "OK" or "Done"

---

## Step 2: Save Secret Immediately

**As soon as you see the secret:**

1. **Select all the text** of the secret
2. **Copy it** (Cmd+C)
3. **Paste it here** or save it somewhere safe
4. **Then** click OK/Done on the dialog

---

## Step 3: Create JSON File

**Once you have the secret, I'll create the JSON file for you**

Or create it yourself at: `credentials/bc-crowestudio/credentials.json`

---

## Alternative: Use Existing ADC Credentials

**We can also try using your existing Application Default Credentials:**
- Location: `~/.config/gcloud/application_default_credentials.json`
- Has refresh token that might work

**Let's try the script first with existing setup, or create a new secret.**

---

**Next:** Create another secret, and THIS TIME copy it immediately before clicking OK!
