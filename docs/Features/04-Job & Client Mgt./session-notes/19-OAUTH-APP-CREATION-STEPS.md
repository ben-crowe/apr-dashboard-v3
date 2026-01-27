# ClickUp OAuth App Creation - Exact Steps

**Date:** January 8, 2026  
**Purpose:** Detailed step-by-step guide to find and create OAuth app in ClickUp

---

## The Confusion

You're seeing an "Apps" page that looks like an integration area with a list of apps. The "Create new app" button might not be obvious. Here's exactly where to find it:

---

## Exact Step-by-Step Instructions

### Step 1: Navigate to Apps Settings
1. **Log into ClickUp**: https://app.clickup.com
2. **Click your avatar/profile picture** (upper-right corner of the screen)
3. **Click "Settings"** from the dropdown menu
4. **In the left sidebar**, look for **"Apps"** and click it
   - Direct link: https://app.clickup.com/settings/apps

### Step 2: Find "Create new app" Button

**What you're probably seeing:**
- A page titled "Apps" or "Integrations"
- A list of existing apps/integrations (if any)
- Maybe sections like "API Token", "OAuth Apps", etc.

**What to look for:**
- **At the TOP of the page** (usually top-right area)
- **A button that says "Create new app"** or **"+ Create App"** or **"New App"**
- It might be:
  - A blue/purple button
  - An icon with a "+" symbol
  - A link/button in the header area

**If you see tabs or sections:**
- Look for a tab/section labeled **"OAuth Apps"** or **"Apps"** (not "Integrations")
- The "Create new app" button should be in that section

### Step 3: Alternative Locations

**If you don't see "Create new app" button:**

1. **Check if you're a Workspace Owner/Admin**
   - Only workspace owners/admins can create OAuth apps
   - If you're not, you'll need to ask a workspace admin to create it

2. **Look for these text labels:**
   - "OAuth Apps" section
   - "Developer Apps" section
   - "Custom Apps" section
   - "API Apps" section

3. **Check the page header:**
   - Top-right corner of the Apps page
   - Might be a small "+" icon or "Add" button

### Step 4: What the Button Might Look Like

The button could appear as:
- **"Create new app"** (text button)
- **"+ Create App"** (with plus icon)
- **"New App"** (simple text)
- **"Add App"** (add button)
- A **purple/blue button** in the top-right

---

## Visual Guide (Based on ClickUp Documentation)

According to ClickUp's docs, the flow is:

```
ClickUp App
  ↓
Avatar (top-right)
  ↓
Settings
  ↓
Left Sidebar → "Apps"
  ↓
Apps Page Opens
  ↓
Look for "Create new app" button
  ↓
Click it!
```

---

## What You'll See After Clicking "Create new app"

A form/modal will appear asking for:

1. **App Name**
   - Example: `"APR Dashboard Integration"`

2. **Redirect URL**
   - Example: `https://apr-dashboard-v3.vercel.app/clickup/callback`
   - This is where users will be redirected after authorizing

3. **After submitting**, you'll get:
   - **Client ID** (public, safe to share)
   - **Client Secret** (private, keep secure!)

---

## Troubleshooting

### "I don't see 'Create new app' button"

**Possible reasons:**
1. **Not a workspace owner/admin**
   - Solution: Ask workspace admin to create it, or get admin permissions

2. **Looking at wrong section**
   - Make sure you're in "Apps" not "Integrations"
   - Look for "OAuth Apps" specifically

3. **Button is hidden/collapsed**
   - Try scrolling up to the top of the page
   - Look for a "+" icon or "Add" button

### "I see 'API Token' section but not 'Create new app'"

- The "API Token" section is for personal tokens (`pk_...`)
- OAuth apps are usually in a separate section
- Look for "OAuth Apps", "Apps", or "Developer Apps" section

### "The page looks different than expected"

ClickUp's UI can vary. Look for:
- Any button/link that says "Create", "New", "Add", or "+"
- Any section related to "Apps", "OAuth", or "Developer"

---

## What to Share With Me

Once you find and create the app, share:

1. ✅ **Client ID** (looks like: `ABC123XYZ789` or similar)
2. ✅ **Client Secret** (looks like: `secret_abc123...` or similar)
3. ✅ **Redirect URL** you used
4. ✅ **App Name** you gave it

---

## Quick Checklist

- [ ] Logged into ClickUp
- [ ] Clicked avatar (top-right)
- [ ] Clicked "Settings"
- [ ] Clicked "Apps" in left sidebar
- [ ] Found "Create new app" button (or similar)
- [ ] Created app with name and redirect URL
- [ ] Got Client ID and Client Secret
- [ ] Ready to share credentials!

---

## Still Stuck?

If you're still having trouble finding it:

1. **Take a screenshot** of what you see on the Apps page
2. **Describe what you see** - any buttons, sections, or text
3. **Check your workspace role** - are you owner/admin?

Or, you can:
- Ask a workspace admin to create it for you
- Share what you see and I'll help you locate it!

---

## Reference

- [ClickUp OAuth Documentation](https://developer.clickup.com/docs/authentication#step-1-create-an-oauth-app)
- Direct link to Apps settings: https://app.clickup.com/settings/apps
