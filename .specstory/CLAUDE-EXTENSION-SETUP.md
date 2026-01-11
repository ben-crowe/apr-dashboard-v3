# Claude VS Code Extension Setup - Verified & Configured

**Status**: ✅ Extension Installed & Shortcuts Configured  
**Date**: 2026-01-08

---

## ✅ Extension Status

**Installed Extensions:**
- `anthropic.claude-code` ✅ Installed
- `agsoft.claude-history-viewer` ✅ Installed

**Extension Commands Found:**
- `claude-vscode.editor.open` - Opens Claude chat panel
- `claude-vscode.terminal.open.keyboard` - Opens Claude in terminal mode
- `claude-vscode.newConversation` - Starts new conversation

---

## ⌨️ Keyboard Shortcuts Configured

I've created `.vscode/keybindings.json` with these shortcuts:

### Open Claude Chat Panel
- **Windows/Linux**: `Ctrl+L` ✅ Configured
- **Alternative**: `Ctrl+Shift+L` ✅ Configured
- **Mac**: `Cmd+N` (already configured globally)

### Open Claude Composer (Inline Editing)
- **Windows/Linux**: `Ctrl+K` ✅ Configured

### Terminal Mode (if enabled)
- **Windows/Linux**: `Ctrl+N` ✅ Configured

---

## 🚀 How to Use

### Method 1: Keyboard Shortcut (Recommended)
1. **Press `Ctrl+L`** anywhere in Cursor
2. Claude chat panel opens on the right side

### Method 2: Command Palette
1. Press `Ctrl+Shift+P`
2. Type: `Claude: Open Chat` or `claude-vscode.editor.open`
3. Press Enter

### Method 3: Sidebar Icon
1. Look for Claude icon in left sidebar
2. Click it to open chat panel

### Method 4: Global Shortcut (Mac)
- Press `Cmd+N` (already configured globally)

---

## 🔧 Troubleshooting

### If `Ctrl+L` doesn't work:

1. **Reload Cursor Window:**
   - Press `Ctrl+Shift+P`
   - Type: `Developer: Reload Window`
   - Press Enter

2. **Check Extension Status:**
   - Press `Ctrl+Shift+X` (Extensions)
   - Search: `claude`
   - Ensure "Claude" by Anthropic is enabled (not disabled)

3. **Verify Keybindings:**
   - Press `Ctrl+K Ctrl+S` (Keyboard Shortcuts)
   - Search: `claude-vscode.editor.open`
   - Should show `Ctrl+L` assigned

4. **Check Extension Settings:**
   - Press `Ctrl+,` (Settings)
   - Search: `claude`
   - Check:
     - `Claude Code: Use Terminal` - Should be false for panel mode
     - `Claude Code: Enable New Conversation Shortcut` - Can be true/false

5. **Try Alternative Shortcuts:**
   - `Ctrl+Shift+L` (also configured)
   - `Ctrl+K` (opens in editor context)
   - Command Palette: `Ctrl+Shift+P` → `claude-vscode.editor.open`

---

## 📁 Files Created/Updated

- ✅ `.vscode/keybindings.json` - Workspace keyboard shortcuts for Claude
- ✅ `.vscode/settings.json` - Already exists with SpecStory config
- ✅ `.specstory/CLAUDE-EXTENSION-SETUP.md` - This documentation

---

## ✅ Verification Steps

1. **Reload Cursor:**
   - `Ctrl+Shift+P` → `Developer: Reload Window`

2. **Test Shortcut:**
   - Press `Ctrl+L`
   - Should open Claude chat panel

3. **Test Command Palette:**
   - `Ctrl+Shift+P` → type `claude` → select `Claude: Open Chat`

4. **Check Extension:**
   - `Ctrl+Shift+X` → search `claude` → verify installed & enabled

---

## 🎯 Next Steps

1. ✅ Extension is installed
2. ✅ Shortcuts are configured  
3. ✅ Workspace keybindings created
4. 🎯 **Reload Cursor window** (`Ctrl+Shift+P` → `Developer: Reload Window`)
5. 🎯 **Try pressing `Ctrl+L` now!**

---

## 📝 Notes

- Workspace keybindings (`.vscode/keybindings.json`) override global keybindings
- Global keybindings are at: `~/Library/Application Support/Cursor/User/keybindings.json`
- Extension uses `claude-vscode.*` command namespace
- If terminal mode is enabled, use `Ctrl+N` instead

---

**Last Updated**: 2026-01-08  
**Extension Version**: anthropic.claude-code (installed)
