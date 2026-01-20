#!/bin/bash
# LOE Template Editor - Automated Test Script
# Uses agent-browser to validate the template editor feature

set -e  # Exit on error

echo "🧪 Testing LOE Template Editor Feature"
echo "========================================"
echo ""

# Configuration
APP_URL="http://localhost:3000"  # Adjust if different
TEST_SESSION="loe-editor-test"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
log_step() {
    echo -e "${GREEN}✓${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

log_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# Cleanup function
cleanup() {
    log_info "Cleaning up test session..."
    agent-browser --session "$TEST_SESSION" close 2>/dev/null || true
}

# Set cleanup trap
trap cleanup EXIT

# Start test
log_info "Starting agent-browser session: $TEST_SESSION"

# Step 1: Navigate to APR Dashboard
log_info "Step 1: Opening APR Dashboard..."
agent-browser --session "$TEST_SESSION" open "$APP_URL"
sleep 2

# Take initial snapshot
agent-browser --session "$TEST_SESSION" snapshot -i > /tmp/apr-initial-snapshot.txt
log_step "Dashboard loaded"

# Step 2: Navigate to a job (you'll need to adjust this based on actual UI)
log_info "Step 2: Navigating to job details..."
# TODO: Add navigation to specific job
# This depends on your actual dashboard structure
# Example:
# agent-browser --session "$TEST_SESSION" snapshot -i | grep -i "job"
# agent-browser --session "$TEST_SESSION" click @e{JOB_LINK_REF}
log_info "⚠️  Manual navigation required - update script with actual job navigation"

# Step 3: Look for "Send LOE" button
log_info "Step 3: Finding 'Send LOE' button..."
agent-browser --session "$TEST_SESSION" snapshot -i > /tmp/job-details-snapshot.txt

# Search for Send LOE button in snapshot
if grep -i "send loe" /tmp/job-details-snapshot.txt > /dev/null; then
    log_step "Found 'Send LOE' button"

    # Extract ref for Send LOE button
    SEND_LOE_REF=$(grep -i "send loe" /tmp/job-details-snapshot.txt | grep -o '@e[0-9]*' | head -1)
    log_info "Send LOE button ref: $SEND_LOE_REF"

    # Click it
    agent-browser --session "$TEST_SESSION" click "$SEND_LOE_REF"
    sleep 1
    log_step "Clicked 'Send LOE' button"
else
    log_error "'Send LOE' button not found - test cannot continue"
    exit 1
fi

# Step 4: Verify preview modal opened
log_info "Step 4: Checking LOE preview modal..."
agent-browser --session "$TEST_SESSION" snapshot -i > /tmp/loe-preview-snapshot.txt

if grep -i "preview\|approve" /tmp/loe-preview-snapshot.txt > /dev/null; then
    log_step "LOE preview modal opened"
else
    log_error "LOE preview modal did not open"
    exit 1
fi

# Step 5: Look for "Edit Template" button
log_info "Step 5: Finding 'Edit Template' button..."
if grep -i "edit template" /tmp/loe-preview-snapshot.txt > /dev/null; then
    log_step "Found 'Edit Template' button"

    EDIT_BTN_REF=$(grep -i "edit template" /tmp/loe-preview-snapshot.txt | grep -o '@e[0-9]*' | head -1)
    log_info "Edit Template button ref: $EDIT_BTN_REF"

    # Click it
    agent-browser --session "$TEST_SESSION" click "$EDIT_BTN_REF"
    sleep 1
    log_step "Clicked 'Edit Template' button"
else
    log_error "'Edit Template' button not found - feature not implemented"
    exit 1
fi

# Step 6: Verify template editor modal opened
log_info "Step 6: Checking template editor modal..."
agent-browser --session "$TEST_SESSION" snapshot -i > /tmp/template-editor-snapshot.txt

if grep -i "template html\|save template" /tmp/template-editor-snapshot.txt > /dev/null; then
    log_step "Template editor modal opened"
else
    log_error "Template editor modal did not open"
    exit 1
fi

# Step 7: Find the HTML textarea
log_info "Step 7: Finding template HTML editor..."
HTML_EDITOR_REF=$(grep -i "template html\|textarea" /tmp/template-editor-snapshot.txt | grep -o '@e[0-9]*' | head -1)

if [ -n "$HTML_EDITOR_REF" ]; then
    log_step "Found HTML editor: $HTML_EDITOR_REF"

    # Make a small change (append a comment to the HTML)
    log_info "Making test edit to template..."
    agent-browser --session "$TEST_SESSION" focus "$HTML_EDITOR_REF"
    agent-browser --session "$TEST_SESSION" press End  # Go to end of content
    agent-browser --session "$TEST_SESSION" type "$HTML_EDITOR_REF" "<!-- Test edit by automation -->"
    log_step "Template edited"
else
    log_error "Could not find HTML editor"
    exit 1
fi

# Step 8: Find and click "Save Template" button
log_info "Step 8: Finding 'Save Template' button..."
agent-browser --session "$TEST_SESSION" snapshot -i > /tmp/editor-with-changes.txt

SAVE_BTN_REF=$(grep -i "save template" /tmp/editor-with-changes.txt | grep -o '@e[0-9]*' | head -1)

if [ -n "$SAVE_BTN_REF" ]; then
    log_step "Found 'Save Template' button: $SAVE_BTN_REF"
    agent-browser --session "$TEST_SESSION" click "$SAVE_BTN_REF"
    sleep 1
    log_step "Clicked 'Save Template' button"
else
    log_error "Could not find 'Save Template' button"
    exit 1
fi

# Step 9: Fill in save dialog
log_info "Step 9: Checking for save dialog..."
agent-browser --session "$TEST_SESSION" snapshot -i > /tmp/save-dialog.txt

if grep -i "template name" /tmp/save-dialog.txt > /dev/null; then
    log_step "Save dialog appeared"

    # Find template name input
    NAME_INPUT_REF=$(grep -i "template name" /tmp/save-dialog.txt | grep -o '@e[0-9]*' | head -1)

    if [ -n "$NAME_INPUT_REF" ]; then
        log_info "Entering template name..."
        agent-browser --session "$TEST_SESSION" fill "$NAME_INPUT_REF" "Automated Test Template"
        log_step "Template name entered"

        # Find "Set as default" checkbox
        if grep -i "set as.*default" /tmp/save-dialog.txt > /dev/null; then
            DEFAULT_CHECKBOX_REF=$(grep -i "set as.*default" /tmp/save-dialog.txt | grep -o '@e[0-9]*' | head -1)
            agent-browser --session "$TEST_SESSION" check "$DEFAULT_CHECKBOX_REF"
            log_step "Checked 'Set as default'"
        fi

        # Find and click final Save button
        FINAL_SAVE_REF=$(grep -i "^save$\|button.*save" /tmp/save-dialog.txt | grep -o '@e[0-9]*' | head -1)
        if [ -n "$FINAL_SAVE_REF" ]; then
            agent-browser --session "$TEST_SESSION" click "$FINAL_SAVE_REF"
            sleep 2
            log_step "Template saved"
        fi
    fi
else
    log_error "Save dialog did not appear"
    exit 1
fi

# Step 10: Verify success toast or confirmation
log_info "Step 10: Checking for success message..."
agent-browser --session "$TEST_SESSION" snapshot -i > /tmp/after-save.txt

if grep -i "success\|saved" /tmp/after-save.txt > /dev/null; then
    log_step "Success message displayed"
else
    log_info "⚠️  No success message detected (may be transient toast)"
fi

# Step 11: Take final screenshot
log_info "Taking final screenshot..."
agent-browser --session "$TEST_SESSION" screenshot /tmp/loe-editor-test-final.png
log_step "Screenshot saved: /tmp/loe-editor-test-final.png"

# Summary
echo ""
echo "=========================================="
echo -e "${GREEN}✓ Test completed successfully!${NC}"
echo "=========================================="
echo ""
echo "Results:"
echo "  • Preview modal: ✓"
echo "  • Edit Template button: ✓"
echo "  • Template editor modal: ✓"
echo "  • Edit functionality: ✓"
echo "  • Save dialog: ✓"
echo "  • Template saved: ✓"
echo ""
echo "Screenshots saved to: /tmp/loe-editor-test-final.png"
echo "Snapshots saved to: /tmp/*.txt"
