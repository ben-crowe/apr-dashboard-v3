#!/bin/bash
# Setup Gmail API OAuth Authentication for bc@crowestudio.com
#
# This script helps set up Gmail API access for bc@crowestudio.com
# to enable automated email checking for end-to-end testing.
#
# Usage:
#   bash scripts/setup-bc-email-auth.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CREDENTIALS_DIR="$PROJECT_ROOT/credentials/bc-crowestudio"
CREDENTIALS_FILE="$CREDENTIALS_DIR/credentials.json"
TOKEN_FILE="$CREDENTIALS_DIR/token.json"

EMAIL_ACCOUNT="bc@crowestudio.com"

echo "=========================================="
echo "Gmail API Setup for $EMAIL_ACCOUNT"
echo "=========================================="
echo ""

# Create credentials directory
echo "📁 Creating credentials directory..."
mkdir -p "$CREDENTIALS_DIR"
echo "✅ Directory created: $CREDENTIALS_DIR"
echo ""

# Check if credentials.json already exists
if [ -f "$CREDENTIALS_FILE" ]; then
    echo "✅ Credentials file already exists: $CREDENTIALS_FILE"
    echo ""
    echo "If you need to re-authenticate, delete the token file:"
    echo "  rm $TOKEN_FILE"
    echo ""
else
    echo "📋 Next steps to get OAuth credentials:"
    echo ""
    echo "1. Go to Google Cloud Console:"
    echo "   https://console.cloud.google.com/"
    echo ""
    echo "2. Select or create a project"
    echo ""
    echo "3. Enable Gmail API:"
    echo "   - Go to 'APIs & Services' > 'Library'"
    echo "   - Search for 'Gmail API'"
    echo "   - Click 'Enable'"
    echo ""
    echo "4. Create OAuth 2.0 credentials:"
    echo "   - Go to 'APIs & Services' > 'Credentials'"
    echo "   - Click 'Create Credentials' > 'OAuth client ID'"
    echo "   - Application type: 'Desktop app'"
    echo "   - Name: 'APR Dashboard - bc@crowestudio.com'"
    echo "   - Click 'Create'"
    echo ""
    echo "5. Download credentials:"
    echo "   - Click 'Download JSON'"
    echo "   - Save the file as: $CREDENTIALS_FILE"
    echo ""
    echo "6. Run this script again after downloading credentials.json"
    echo ""
    echo "Press Enter when you've downloaded credentials.json..."
    read -r
    
    if [ ! -f "$CREDENTIALS_FILE" ]; then
        echo "❌ Credentials file not found: $CREDENTIALS_FILE"
        echo "   Please download credentials.json and save it to the above path"
        exit 1
    fi
fi

# Check Python dependencies
echo "🔍 Checking Python dependencies..."
if ! python3 -c "import google.auth.transport.requests" 2>/dev/null; then
    echo "⚠️  Missing Python packages. Installing..."
    pip3 install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib
    echo "✅ Dependencies installed"
else
    echo "✅ Python dependencies already installed"
fi
echo ""

# Run authentication
echo "🔐 Starting OAuth authentication..."
echo "   This will open a browser window for you to authorize access."
echo ""

python3 "$SCRIPT_DIR/check-bc-email.py" --latest --max-results 1 > /dev/null 2>&1 || {
    echo ""
    echo "✅ Authentication complete!"
    echo ""
    echo "You can now use the email checking scripts:"
    echo "  python3 scripts/check-bc-email.py --latest"
    echo "  python3 scripts/check-bc-email.py --search 'subject:Letter of Engagement'"
    echo ""
}

echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Test the setup:"
echo "  python3 scripts/check-bc-email.py --latest --max-results 5"
echo ""
