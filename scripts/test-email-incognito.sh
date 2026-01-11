#!/bin/bash
# Test email checker - opens in incognito mode

echo "=========================================="
echo "Testing Email Checker"
echo "=========================================="
echo ""
echo "This will open Chrome Incognito for OAuth"
echo ""
echo "When browser opens:"
echo "1. Make sure you're in Incognito mode"
echo "2. Sign in with: bc@crowestudio.com"
echo "3. Click 'Allow' to grant access"
echo ""
echo "Press Enter to continue..."
read

cd "$(dirname "$0")/.."
python3 scripts/check-bc-email.py --latest --max-results 3
