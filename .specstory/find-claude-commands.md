# Finding Claude Extension Command IDs

Since the shortcuts aren't showing up in Keyboard Shortcuts editor, we need to find the actual command IDs.

## Method 1: Check Command Palette

1. Press `Ctrl+Shift+P` (Command Palette)
2. Type: `claude`
3. Look at the command names that appear
4. The command ID is usually shown in parentheses or can be found by:
   - Right-clicking the command
   - Selecting "Copy Command ID" (if available)

## Method 2: Check Keyboard Shortcuts Editor

1. Press `Ctrl+K Ctrl+S` (Keyboard Shortcuts)
2. Filter: `@ext:Anthropic.claude-code`
3. Click on a command (like "Claude Code: Open in Side Bar")
4. Look at the bottom of the editor - it might show the command ID
5. Or click the edit icon - it might show the command ID in the input

## Method 3: Check Extension Details

1. Go to Extensions (`Ctrl+Shift+X`)
2. Find "Claude Code for VS Code"
3. Click on it
4. Look for "Contributions" tab or section
5. Check "Commands" - should list all command IDs

## What We Need

From your screenshot, we need command IDs for:
- "Claude Code: Open in Side Bar"
- "Claude Code: Open in Terminal"
- "Claude Code: Open in New Window"
- "Claude Code: Open Walkthrough"

Once we have these, I can update the keybindings.json file correctly.
