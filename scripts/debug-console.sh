#!/bin/bash

# Console Debugging Script for LOE Page
# Use this when page won't load

URL="http://localhost:8086/dashboard/job/f8f1106a-e44c-477e-b046-42315ce38d8f"

echo "========================================="
echo "Debugging LOE Page Console"
echo "========================================="
echo ""

# Method 1: Check dev server console output
echo "1. Dev Server Console Output:"
echo "   Check terminal where 'npm run dev' is running"
echo "   Look for build errors, TypeScript errors"
echo ""

# Method 2: Browser DevTools Console
echo "2. Browser DevTools Console:"
echo "   a) Open: $URL"
echo "   b) Press F12 or Cmd+Option+I"
echo "   c) Click 'Console' tab"
echo "   d) Look for red errors"
echo ""

# Method 3: Network tab
echo "3. Network Tab:"
echo "   a) Open DevTools (F12)"
echo "   b) Click 'Network' tab"
echo "   c) Reload page (Cmd+R)"
echo "   d) Look for failed requests (red text)"
echo ""

# Method 4: React DevTools
echo "4. React DevTools (if installed):"
echo "   a) Open DevTools (F12)"
echo "   b) Click 'Components' tab"
echo "   c) Check component tree for errors"
echo ""

echo "========================================="
echo "Common Errors & Fixes"
echo "========================================="
echo ""
echo "Error: 'Cannot find module'"
echo "  → Check import paths in the file mentioned"
echo ""
echo "Error: 'X is not a function'"
echo "  → Variable is undefined or wrong type"
echo ""
echo "Error: 'Invalid hook call'"
echo "  → Hook used outside component or conditionally"
echo ""
echo "Error: '404 Not Found'"
echo "  → API endpoint missing or job ID invalid"
echo ""

echo "========================================="
echo "Quick Commands"
echo "========================================="
echo ""
echo "Check build errors:"
echo "  npm run build"
echo ""
echo "Check TypeScript errors:"
echo "  npx tsc --noEmit"
echo ""
echo "Clear cache and restart:"
echo "  rm -rf .next && npm run dev"
echo ""
