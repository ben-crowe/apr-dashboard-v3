# Quick Fix: Claude Extension Shortcut Not Working

**Problem**: `Ctrl+L` doesn't open Claude chat panel  
**Solution**: Multiple approaches to fix

---

## ✅ What I've Done

1. ✅ Verified extension is installed: `anthropic.claude-code@2.1.1`
2. ✅ Created workspace keybindings: `.vscode/keybindings.json`
3. ✅ Updated workspace settings: `.vscode/settings.json`
4. ✅ Added multiple shortcut options

---

## 🚀 Try These Shortcuts (In Order)

### Option 1: Ctrl+L (Primary)
Press `Ctrl+L` - Should open Claude chat panel

### Option 2: Ctrl+Shift+L (Alternative)
Press `Ctrl+Shift+L` - Backup shortcut

### Option 3: Ctrl+Alt+L (Alternative 2)
Press `Ctrl+Alt+L` - Another backup shortcut

### Option 4: Command Palette
1. Press `Ctrl+Shift+P`
2. Type: `claude`
3. Select: `Claude: Open Chat` or `claude-vscode.editor.open`
4. Press Enter

### Option 5: Sidebar Icon
- Look for Claude icon in left sidebar
- Click it to open chat panel

---

## 🔧 If Still Not Working - Manual Fix

### Step 1: Open Keyboard Shortcuts
1. Press `Ctrl+K Ctrl+S` (or `Ctrl+Shift+P` → "Preferences: Open Keyboard Shortcuts")
2. Search for: `claude-vscode.editor.open`

### Step 2: Check Current Binding
- See what key (if any) is assigned
- If nothing assigned, click the "+" icon

### Step 3: Assign Ctrl+L
1. Click the "+" icon next to `claude-vscode.editor.open`
2. Press `Ctrl+L`
3. Press Enter

### Step 4: Test
- Press `Ctrl+L` - Should now work!

---

## 🎯 Alternative: Use Global Shortcut

Your global keybindings show `Cmd+N` opens Claude. Try:
- **Mac**: `Cmd+N`
- **Windows/Linux**: Check if `Ctrl+N` works (may need to check settings)

---

## 📋 Extension Settings Check

I've added these to `.vscode/settings.json`:
```json
{
  "claudeCode.preferredLocation": "panel",
  "claudeCode.useTerminal": false,
  "claudeCode.enableNewConversationShortcut": true
}
```

**To verify:**
1. Press `Ctrl+,` (Settings)
2. Search: `claude`
3. Check:
   - `Claude Code: Preferred Location` = "panel"
   - `Claude Code: Use Terminal` = false

---

## 🔄 Reload Required

After making changes:
1. Press `Ctrl+Shift+P`
2. Type: `Developer: Reload Window`
3. Press Enter
4. Try `Ctrl+L` again

---

## 📝 Files Created

- `.vscode/keybindings.json` - Workspace shortcuts
- `.vscode/settings.json` - Updated with Claude settings
- `.specstory/QUICK-FIX-CLAUDE-SHORTCUT.md` - This file

---

## ✅ Next Steps

1. **Reload Cursor**: `Ctrl+Shift+P` → `Developer: Reload Window`
2. **Try `Ctrl+L`**: Should open Claude chat
3. **If not working**: Use Command Palette method (`Ctrl+Shift+P` → `claude`)
4. **Manual fix**: Follow "Manual Fix" steps above

---

**The extension IS installed - we just need to get the shortcut working!**
