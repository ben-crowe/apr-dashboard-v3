# Claude Code Assist Extension - Configuration Guide

## Extension Details

**Extension ID:** `agsoft.claude-history-viewer`  
**Display Name:** Claude Code Assist - Chat History & Diff Viewer  
**Installed Version:** 0.2.6 (in extensions folder)  
**Active Version:** 0.3.2 (according to VS Code)  
**Publisher:** agsoft

## Configuration Levels

### 1. User-Level Settings (Global)
**Location:** `~/Library/Application Support/Cursor/User/settings.json` (macOS)

These settings apply to all VS Code/Cursor workspaces.

### 2. Workspace-Level Settings (Project-Specific)
**Location:** `.vscode/settings.json` in your project root

These settings override user-level settings for this specific workspace.

### 3. Extension Storage
**Location:** `~/Library/Application Support/Cursor/User/globalStorage/agsoft.claude-history-viewer/`

Extension-specific data storage (databases, cache, etc.)

## Available Settings

Based on the extension's `package.json`, here are the configurable settings:

### Core Settings
- `claude-history.claudeDirectory` - Custom path to .claude directory (auto-detected if empty)
- `claude-history.autoRefreshEnabled` - Enable automatic refresh (default: true)
- `claude-history.autoRefreshInterval` - Refresh interval in hours (default: 2, min: 1, max: 24)

### Search Settings
- `claude-history.search.enableAutoIndexing` - Build search index automatically (default: true)
- `claude-history.search.lazyIndexing` - Enable lazy indexing (default: true)
- `claude-history.search.maxFileSize` - Max file size in MB for indexing (default: 50, max: 500)
- `claude-history.search.maxMessagesPerFile` - Max messages per file (default: 1000, max: 10000)

### Database Settings
- `claude-history.database.enableWAL` - Enable Write-Ahead Logging (default: true)
- `claude-history.database.cacheSize` - SQLite cache size in pages (default: 10000)
- `claude-history.database.enableFTS5` - Enable Full-Text Search (default: true)
- `claude-history.database.indexUpdateBatch` - Messages per batch (default: 50)

### UI Settings
- `claude-history.dashboard.enableButton` - Show dashboard button (default: false)
- `claude-history.statusBar.showUsage` - Show usage in status bar (default: false)
- `claude-history.contextMenu.showFileTimeline` - Show timeline in context menu (default: true)

### Other Settings
- `claude-history.enableErrorReporting` - Anonymous error reporting (default: true)
- `claude-history.keybindings.openSidePanel` - Keyboard shortcut (default: "ctrl+shift+q")
- `claude-history.donations.disablePrompts` - Disable donation prompts (default: false)

## Session Renaming Feature

### Current Status
**The extension does NOT have a built-in rename command** based on the package.json analysis. However, you mentioned being able to rename sessions before.

### Possible Explanations
1. **UI Feature Not Exposed as Command** - The rename might be available in the extension's webview UI (the side panel) but not as a VS Code command
2. **Version Difference** - You have v0.2.6 installed but v0.3.2 active - the newer version might have removed or changed the feature
3. **Different Extension** - You might have been using a different extension or feature

### How to Access Rename (If Available)
1. Open the Claude Code Assist side panel (click the icon in Activity Bar)
2. Look for a dropdown or context menu in the "Claude Chat" panel
3. Right-click on a session in the history list
4. Check for "Rename" or "Edit Name" option

### Alternative: Using Claude Code CLI
The official Claude Code CLI has a `/rename` command:
```bash
claude /rename "New Session Name"
```

## Recommended Configuration

Add to `.vscode/settings.json` for project-specific settings:

```json
{
  "claude-history.autoRefreshEnabled": true,
  "claude-history.autoRefreshInterval": 2,
  "claude-history.search.enableAutoIndexing": true,
  "claude-history.contextMenu.showFileTimeline": true,
  "claude-history.statusBar.showUsage": false
}
```

## Troubleshooting

### If Rename Feature is Missing
1. **Check Extension Version**
   - Open Extensions panel
   - Search for "Claude Code Assist"
   - Check if update is available
   - Current active: 0.3.2, but 0.2.6 is installed

2. **Reload Extension**
   - Command Palette → "Developer: Reload Window"
   - Or disable/re-enable the extension

3. **Check Extension UI**
   - Open the side panel (Activity Bar → Claude Assist icon)
   - Look for rename option in session dropdown
   - Check context menu (right-click on sessions)

4. **Update Extension**
   - Extensions → Search "claude-history-viewer"
   - Click "Update" if available
   - Restart VS Code

### Extension Storage Location
The extension stores its data in:
- **macOS:** `~/Library/Application Support/Cursor/User/globalStorage/agsoft.claude-history-viewer/`
- **Windows:** `%APPDATA%\Cursor\User\globalStorage\agsoft.claude-history-viewer\`
- **Linux:** `~/.config/Cursor/User/globalStorage/agsoft.claude-history-viewer/`

## Commands Available

From Command Palette (Cmd+Shift+P):
- `Claude Assist: Refresh Sessions`
- `Claude Assist: Clear Project Cache`
- `Claude Assist: Open Settings`
- `Claude Assist: Open Claude Chat Side Panel`
- `Claude Assist: Build Search Index`
- `Claude Assist: Open Analytics Dashboard`
- `Claude Assist: Clear All Data`

## Keyboard Shortcuts

- `Cmd+Shift+Q` - Open Claude chat side panel
- `Cmd+Shift+]` - Navigate to next file change
- `Cmd+Shift+[` - Navigate to previous file change

## Next Steps

1. **Check for Updates** - Update to latest version (0.3.2 or newer)
2. **Open Side Panel** - Use Cmd+Shift+Q or click Activity Bar icon
3. **Look for Rename** - Check dropdown/context menu in the UI
4. **Report Issue** - If rename is missing, report to extension GitHub: https://github.com/yashagldit/Claude-Code-History-VSCode
