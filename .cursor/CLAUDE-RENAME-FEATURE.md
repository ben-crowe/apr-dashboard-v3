# Claude Code Extension - Rename Session Feature

## Official Anthropic Claude Code Extension

**Extension:** `anthropic.claude-code`  
**Version:** 2.1.3 (active) / 2.0.37 (installed)

## How to Rename Sessions

### Method 1: Using `/rename` Command (Confirmed Working)

In the Claude Code chat panel, type:
```
/rename "Your Session Name"
```

Example:
```
/rename "APR Dashboard Refactoring"
```

### Method 2: Using `/resume` Command

When resuming a session:
1. Type `/resume` in the chat
2. Press `R` to rename the session
3. Press `P` to preview before selecting

## UI Dropdown Rename (Status Unknown)

You mentioned being able to rename sessions in the dropdown panel. This feature may:

1. **Exist but be hidden** - Check the conversation dropdown in the Claude Code panel:
   - Click the dropdown arrow next to the conversation title
   - Look for an edit/rename icon or option
   - Right-click on the conversation name in the list

2. **Have been removed** - If it existed before, it may have been removed in an update

3. **Require specific interaction** - Try:
   - Double-clicking the conversation name
   - Clicking an edit icon next to the name
   - Right-clicking in the conversation list

## Troubleshooting

### If `/rename` doesn't work:
1. Make sure you're in an active conversation
2. Type `/rename` followed by your desired name in quotes
3. Press Enter

### If UI rename is missing:
1. **Check Extension Version**
   - Extensions → Search "Claude Code"
   - Update to latest version if available
   - Current: 2.1.3

2. **Reload Extension**
   - Command Palette → "Developer: Reload Window"

3. **Check UI Elements**
   - Open Claude Code panel
   - Look for edit/rename icons in the conversation dropdown
   - Check if double-clicking the name works

## Feature Request

If UI-based renaming is missing, you can request it:
- GitHub: https://github.com/anthropics/claude-code/issues
- Existing issue: https://github.com/anthropics/claude-code/issues/6006

## Current Status

- ✅ `/rename` command works (confirmed in v2.1.3)
- ❓ UI dropdown rename - status unclear
- ✅ `/resume` with rename option works

## Quick Reference

```
/rename "Session Name"     - Rename current session
/resume                     - Resume session (press R to rename)
```
