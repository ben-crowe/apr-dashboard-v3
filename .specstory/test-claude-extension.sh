#!/bin/bash
# Test script to verify Claude extension is working

echo "🔍 Testing Claude Extension Setup..."
echo ""

echo "✅ Extension Status:"
code --list-extensions | grep -i claude
echo ""

echo "✅ Workspace Keybindings:"
cat .vscode/keybindings.json 2>/dev/null || echo "  Not found"
echo ""

echo "✅ Workspace Settings:"
cat .vscode/settings.json | grep -i claude || echo "  No Claude settings found"
echo ""

echo "✅ Global Keybindings (Claude commands):"
cat ~/Library/Application\ Support/Cursor/User/keybindings.json | grep -A 1 "claude-vscode" | head -10
echo ""

echo "📋 Next Steps:"
echo "1. Reload Cursor: Ctrl+Shift+P → 'Developer: Reload Window'"
echo "2. Try Ctrl+L to open Claude chat"
echo "3. If not working, use Command Palette: Ctrl+Shift+P → 'claude'"
echo ""
