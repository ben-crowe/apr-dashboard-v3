# Create New Google Cloud Project for Gmail API

**Issue:** Project `gen-lang-client-0262970848` doesn't exist in your account  
**Solution:** Create a new project or use an existing one

---

## Option 1: Create New Project (Recommended)

### Step 1: Create Project

1. **In the "Select a resource" dialog** (currently open):
   - Click **"New project"** button (top right)
   - **Project name:** `APR Dashboard Email Testing`
   - **Project ID:** Will auto-generate (or you can customize)
   - Click **"Create"**

2. **Wait for project creation** (takes ~30 seconds)

3. **Select the new project** from the dropdown

---

## Option 2: Use Existing Project

If you prefer to use an existing project:

1. **Select one of your existing projects** from the list:
   - "My First Project" (any of them)
   - Or any other project you prefer

2. **Click on it** to select

---

## After Selecting/Creating Project

Once you have a project selected:

### Step 1: Enable Gmail API

1. Go to **"APIs & Services"** > **"Library"**
2. Search for: **"Gmail API"**
3. Click **"Enable"**

### Step 2: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** > **"OAuth consent screen"**
2. **User Type:** Select **"External"** → Click **"Create"**
3. **App Information:**
   - App name: `APR Dashboard Email Testing`
   - User support email: `bc@crowestudio.com`
   - Click **"Save and Continue"**
4. **Scopes:**
   - Click **"Add or Remove Scopes"**
   - Search: `gmail.readonly`
   - Check: `https://www.googleapis.com/auth/gmail.readonly`
   - Click **"Update"** → **"Save and Continue"**
5. **Test Users:**
   - Click **"Add Users"**
   - Add: `bc@crowestudio.com`
   - Click **"Add"** → **"Save and Continue"**

### Step 3: Create OAuth Client

1. Go to **"APIs & Services"** > **"Credentials"**
2. Click **"Create Credentials"** > **"OAuth client ID"**
3. **Application type:** Desktop app
4. **Name:** `APR Dashboard - bc@crowestudio.com`
5. Click **"Create"**
6. **Download the JSON** file
7. **Save it as:** `credentials/bc-crowestudio/credentials.json`

---

## Update Scripts

After creating new credentials, the scripts will automatically use them. The existing OAuth setup in `~/.config/gcloud/application_default_credentials.json` might be from a different account/service, so creating fresh credentials in your own project is cleaner.

---

**Recommendation:** Create a new project specifically for this purpose - it's cleaner and easier to manage!
