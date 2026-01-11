# Claude Code + SpecStory Setup Guide

**Complete guide to ensure Claude Code captures all conversations in this project**

---

## ✅ Quick Verification Checklist

- [ ] SpecStory extension installed in Claude Code
- [ ] Workspace opened at project root: `/Users/bencrowe/Development/apr-dashboard-v3`
- [ ] `.specstory/.project.json` exists (✅ Already created)
- [ ] `.vscode/settings.json` configured (✅ Already created)
- [ ] Workspace settings configured (✅ Already created)

---

## Step 1: Install SpecStory Extension

### In Claude Code:

1. **Open Extensions**:
   - Press `Cmd+Shift+X` (Mac) or `Ctrl+Shift+X` (Windows/Linux)
   - Or: View → Extensions

2. **Search for SpecStory**:
   - Type: `SpecStory` in the search box
   - Look for: "SpecStory - AI Chat History" by SpecStory

3. **Install**:
   - Click "Install"
   - Wait for installation to complete

4. **Verify Installation**:
   - Check Extensions sidebar
   - Should show "SpecStory" as installed

---

## Step 2: Open Project in Claude Code

### Important: Open the Correct Directory

**✅ Correct Way:**
```bash
# In terminal, navigate to project root
cd /Users/bencrowe/Development/apr-dashboard-v3

# Open Claude Code from this directory
claude-code .
```

**Or in Claude Code:**
1. File → Open Folder...
2. Navigate to: `/Users/bencrowe/Development/apr-dashboard-v3`
3. Click "Open"

**❌ Wrong Way:**
- Opening a subdirectory (like `src/` or `docs/`)
- Opening parent directory
- Opening via file instead of folder

### Verify You're in the Right Place

**Check terminal in Claude Code:**
```bash
pwd
# Should show: /Users/bencrowe/Development/apr-dashboard-v3
```

**Check for `.specstory` directory:**
```bash
ls -la .specstory
# Should show: .project.json, history/, features/, etc.
```

---

## Step 3: Enable SpecStory Auto-Save

### Method 1: Via Settings UI

1. **Open Settings**:
   - Press `Cmd+,` (Mac) or `Ctrl+,` (Windows/Linux)
   - Or: Code → Preferences → Settings

2. **Search for SpecStory**:
   - Type: `specstory` in search box

3. **Enable Auto-Save**:
   - Find: `SpecStory: Auto Save`
   - Check the box to enable
   - Or set to `true`

### Method 2: Via Settings JSON

1. **Open Settings JSON**:
   - Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
   - Type: "Preferences: Open User Settings (JSON)"
   - Press Enter

2. **Add SpecStory Settings**:
   ```json
   {
     "specstory.enabled": true,
     "specstory.autoSave": true
   }
   ```

### Method 3: Workspace Settings (Already Configured)

The workspace file (`apr-dashboard-v3.code-workspace`) already has SpecStory settings configured. These apply automatically when you open the workspace.

---

## Step 4: Verify SpecStory is Working

### Test 1: Check Project Identity

```bash
# Check if .project.json exists and has correct data
cat .specstory/.project.json | jq '.project_name, .workspace_id'
```

**Expected Output:**
```
"apr-dashboard-v3"
"49e1-a8ac-0bdd-fbd1"
```

### Test 2: Start a Conversation

1. **Open Claude Code Chat**:
   - Press `Cmd+L` (Mac) or `Ctrl+L` (Windows/Linux)
   - Or: View → Chat

2. **Ask a Simple Question**:
   ```
   What is the current project structure?
   ```

3. **Wait for Response**:
   - Let Claude respond completely
   - Wait 2-3 seconds after response

4. **Check if Session Was Captured**:
   ```bash
   # List latest sessions
   cd .specstory
   ./specstory-utils.sh latest 1
   ```

**Expected:** Should see a new session file with today's date

### Test 3: Check SpecStory Status

**In Claude Code:**
1. Open Command Palette: `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2. Type: `SpecStory: Show Status`
3. Should show: "SpecStory is active and capturing sessions"

---

## Step 5: Configure Claude Code to Use This Directory

### Ensure Workspace is Set Correctly

**Check workspace file:**
```bash
cat apr-dashboard-v3.code-workspace
```

**Should show:**
```json
{
  "folders": [
    {
      "name": "apr-dashboard-v3",
      "path": "."
    }
  ],
  "settings": {
    "specstory.enabled": true,
    "specstory.autoSave": true,
    ...
  }
}
```

### Open Workspace File

**In Claude Code:**
1. File → Open Workspace from File...
2. Navigate to: `/Users/bencrowe/Development/apr-dashboard-v3`
3. Select: `apr-dashboard-v3.code-workspace`
4. Click "Open"

**This ensures:**
- ✅ Correct directory is opened
- ✅ SpecStory settings are applied
- ✅ Workspace-specific configuration is active

---

## Troubleshooting

### Problem: Sessions Not Being Captured

**Check 1: Extension Status**
```bash
# In Claude Code terminal
code --list-extensions | grep -i specstory
```

**If not found:**
- Install SpecStory extension (Step 1)

**Check 2: Auto-Save Enabled**
```bash
# Check settings
cat .vscode/settings.json | grep specstory
```

**If missing:**
- Settings file already created, should be there

**Check 3: Correct Directory**
```bash
pwd
# Should be: /Users/bencrowe/Development/apr-dashboard-v3
```

**If wrong:**
- Close Claude Code
- Navigate to project root
- Open Claude Code from there

**Check 4: SpecStory Extension Settings**

In Claude Code:
1. Open Settings (`Cmd+,`)
2. Search: `specstory`
3. Verify:
   - `SpecStory: Enabled` = ✅ checked
   - `SpecStory: Auto Save` = ✅ checked

### Problem: Can't Reference Sessions with @

**Solution:**
- Sessions are in `.specstory/history/`
- Reference like: `@.specstory/history/2026-01-08_14-51Z-specstory-explanation-and-usage.md`
- Or use partial name: `@.specstory/history/specstory-explanation`

### Problem: SpecStory Settings Not Applied

**Solution:**
1. Close Claude Code completely
2. Reopen workspace file: `apr-dashboard-v3.code-workspace`
3. Verify settings in: Code → Preferences → Settings → Workspace

---

## Verification Commands

### Quick Status Check

```bash
cd /Users/bencrowe/Development/apr-dashboard-v3/.specstory

# Check if SpecStory is capturing
./specstory-utils.sh stats

# View latest session
./specstory-utils.sh latest 1

# List all features
./specstory-utils.sh features
```

### Expected Output

```
SpecStory Statistics:

Total sessions: [number]
Total size: [size]

Oldest session: [date]
Newest session: [date] (should be today!)

Feature Documentation:
Total features documented: [number]
```

---

## Best Practices

### 1. Always Open Workspace File

**Instead of:**
```bash
claude-code /Users/bencrowe/Development/apr-dashboard-v3
```

**Do:**
```bash
cd /Users/bencrowe/Development/apr-dashboard-v3
claude-code apr-dashboard-v3.code-workspace
```

### 2. Verify Before Starting Work

**Quick check:**
```bash
# In Claude Code terminal
pwd
ls .specstory/history | tail -1
```

**Should show:**
- Current directory is project root
- Latest session file exists

### 3. Reference Past Sessions

**In Claude Code Chat:**
```
@.specstory/history/[session-name].md

Can you review what we discussed about [topic]?
```

### 4. Update Feature Docs

**When features change:**
```
Update the [feature-name] feature doc to reflect [changes].
```

---

## Configuration Files Created

✅ **`.vscode/settings.json`**
- SpecStory enabled
- Auto-save enabled
- Output directory configured

✅ **`apr-dashboard-v3.code-workspace`**
- Workspace settings include SpecStory config
- Ensures settings apply when workspace opens

✅ **`.specstory/.project.json`**
- Project identity configured
- Workspace ID and Git ID set
- SpecStory version and settings

---

## Next Steps

1. ✅ Install SpecStory extension (if not already installed)
2. ✅ Open workspace file in Claude Code
3. ✅ Verify auto-save is enabled
4. ✅ Test by having a conversation
5. ✅ Check that session was captured

**Once verified, SpecStory will automatically capture all your Claude Code conversations!**

---

**Last Updated**: 2026-01-08  
**Status**: ✅ Configuration Complete
