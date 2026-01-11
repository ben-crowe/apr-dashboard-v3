#!/bin/bash
# Quick Setup Using Existing Application Default Credentials
#
# This script creates a credentials.json file from your existing
# Application Default Credentials (gcloud setup) for easier use.
#
# Usage:
#   bash scripts/setup-from-adc.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CREDENTIALS_DIR="$PROJECT_ROOT/credentials/bc-crowestudio"
CREDENTIALS_FILE="$CREDENTIALS_DIR/credentials.json"
ADC_FILE="$HOME/.config/gcloud/application_default_credentials.json"

echo "=========================================="
echo "Setup from Application Default Credentials"
echo "=========================================="
echo ""

# Check if ADC exists
if [ ! -f "$ADC_FILE" ]; then
    echo "❌ Application Default Credentials not found at:"
    echo "   $ADC_FILE"
    echo ""
    echo "Please ensure gcloud is set up with:"
    echo "   gcloud auth application-default login"
    exit 1
fi

echo "✅ Found Application Default Credentials"
echo ""

# Create credentials directory
mkdir -p "$CREDENTIALS_DIR"

# Extract client info from ADC and create credentials.json format
echo "📝 Creating credentials.json from ADC..."

# Read ADC file and create OAuth client format
python3 << EOF
import json
import sys
from pathlib import Path

adc_file = Path("$ADC_FILE")
creds_file = Path("$CREDENTIALS_FILE")

with open(adc_file, 'r') as f:
    adc = json.load(f)

# Create OAuth client credentials format
oauth_client = {
    "installed": {
        "client_id": adc["client_id"],
        "client_secret": adc["client_secret"],
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "redirect_uris": ["http://localhost"]
    }
}

with open(creds_file, 'w') as f:
    json.dump(oauth_client, f, indent=2)

print(f"✅ Created credentials.json at: {creds_file}")
EOF

echo ""
echo "✅ Setup complete!"
echo ""
echo "The script will now use your existing Application Default Credentials."
echo "You can test it with:"
echo "  python3 scripts/check-bc-email.py --latest --max-results 5"
echo ""
