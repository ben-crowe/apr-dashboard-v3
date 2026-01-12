# Finding the Correct Page to Create OAuth App

**The Issue:** You're looking at the "App Center" (marketplace), but you need the "Settings → Apps" page (developer settings).

---

## You're Currently Here (Wrong Place)

**App Center** = Marketplace for existing integrations
- Shows apps like Slack, GitHub, Google Drive, etc.
- This is for INSTALLING apps, not CREATING them
- Has categories like "Featured", "Development", "Communication", etc.

**This is NOT where you create OAuth apps!**

---

## Where You Need to Go (Correct Place)

**Settings → Apps** = Developer/API settings page
- This is where you manage API tokens and OAuth apps
- This is where the "Create new app" button is located

---

## Exact Steps to Get There

### Method 1: Via Settings (Recommended)

1. **Click your avatar/profile picture** (top-right corner of ClickUp)
2. **Click "Settings"** from the dropdown menu
3. **In the LEFT SIDEBAR** (not the main content area), look for **"Apps"**
4. **Click "Apps"** in the sidebar
5. You should now see a page with:
   - "API Token" section (for personal tokens)
   - "OAuth Apps" section (for creating OAuth apps)
   - "Create new app" button

### Method 2: Direct Link

Go directly to: **https://app.clickup.com/settings/apps**

---

## What the Correct Page Looks Like

The **Settings → Apps** page should show:

**Left Sidebar:**
- Settings
  - Apps ← **You want this one**
  - Other settings...

**Main Content Area:**
- **API Token** section
  - Shows your personal API token (`pk_...`)
  - Generate/Regenerate buttons
  
- **OAuth Apps** section (or similar)
  - List of existing OAuth apps (if any)
  - **"Create new app"** button ← **This is what you need!**

---

## Key Difference

| App Center (Marketplace) | Settings → Apps (Developer) |
|-------------------------|---------------------------|
| Browse/install existing apps | Create/manage OAuth apps |
| Shows Slack, GitHub, etc. | Shows API tokens & OAuth apps |
| No "Create" button | Has "Create new app" button |
| Marketplace/browse view | Developer settings view |

---

## Visual Guide

```
ClickUp App
  ↓
Avatar (top-right) ← Click here!
  ↓
Settings ← Click this!
  ↓
Left Sidebar → "Apps" ← Click this!
  ↓
Settings → Apps Page Opens
  ↓
Look for "OAuth Apps" section
  ↓
Find "Create new app" button ← This is it!
```

---

## Still Can't Find It?

**Check these things:**

1. **Are you clicking "Settings" from your avatar?**
   - Not from the App Center
   - Not from any other menu
   - Must be: Avatar → Settings

2. **Are you looking at the LEFT SIDEBAR?**
   - Not the main content area
   - Look for "Apps" in the sidebar menu

3. **Do you see "API Token" section?**
   - If yes, you're in the right place!
   - Look for "OAuth Apps" section below it

4. **Are you a workspace owner/admin?**
   - Only owners/admins can create OAuth apps
   - If not, ask a workspace admin

---

## Quick Test

Try this direct link: **https://app.clickup.com/settings/apps**

If that takes you to a page with "API Token" section, you're in the right place!

---

## What You'll See After Finding It

Once you're on the correct Settings → Apps page:

1. You'll see "API Token" section (for personal tokens)
2. Below that, you should see "OAuth Apps" or similar section
3. There should be a **"Create new app"** button
4. Click it, and you'll get a form to:
   - Name your app
   - Add redirect URL (e.g., `https://apr-dashboard-v3.vercel.app/clickup/callback`)
   - Get `client_id` and `client_secret`

---

## Summary

**You're here:** App Center (marketplace) ❌  
**You need:** Settings → Apps (developer settings) ✅

**To get there:**
1. Click avatar (top-right)
2. Click "Settings"
3. Click "Apps" in left sidebar
4. Look for "Create new app" button

Try the direct link: https://app.clickup.com/settings/apps
