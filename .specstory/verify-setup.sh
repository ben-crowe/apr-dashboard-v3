#!/bin/bash
# SpecStory Setup Verification Script
# Run this to verify SpecStory is properly configured

set -e

PROJECT_ROOT="/Users/bencrowe/Development/apr-dashboard-v3"
SPECSTORY_DIR="$PROJECT_ROOT/.specstory"

echo "Verifying SpecStory Setup..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check 1: Project directory exists
echo -e "${BLUE}Checking project directory...${NC}"
if [ -d "$PROJECT_ROOT" ]; then
    echo -e "  ${GREEN}OK${NC} Project directory exists: $PROJECT_ROOT"
else
    echo -e "  ${RED}FAIL${NC} Project directory not found: $PROJECT_ROOT"
    exit 1
fi

# Check 2: SpecStory directory exists
echo -e "${BLUE}Checking SpecStory directory...${NC}"
if [ -d "$SPECSTORY_DIR" ]; then
    echo -e "  ${GREEN}OK${NC} SpecStory directory exists"
else
    echo -e "  ${RED}FAIL${NC} SpecStory directory not found"
    exit 1
fi

# Check 3: Project identity file exists
echo -e "${BLUE}Checking project identity file...${NC}"
if [ -f "$SPECSTORY_DIR/.project.json" ]; then
    echo -e "  ${GREEN}OK${NC} Project identity file exists"
    PROJECT_NAME=$(cat "$SPECSTORY_DIR/.project.json" | grep -o '"project_name": "[^"]*' | cut -d'"' -f4)
    echo -e "  ${GREEN}  ->${NC} Project: $PROJECT_NAME"
else
    echo -e "  ${RED}FAIL${NC} Project identity file not found"
    exit 1
fi

# Check 4: History directory exists
echo -e "${BLUE}Checking history directory...${NC}"
if [ -d "$SPECSTORY_DIR/history" ]; then
    SESSION_COUNT=$(ls -1 "$SPECSTORY_DIR/history"/*.md 2>/dev/null | wc -l | tr -d ' ')
    echo -e "  ${GREEN}OK${NC} History directory exists"
    echo -e "  ${GREEN}  ->${NC} Sessions captured: $SESSION_COUNT"
else
    echo -e "  ${YELLOW}WARN${NC} History directory not found (will be created on first session)"
fi

# Check 5: Features directory exists
echo -e "${BLUE}Checking features directory...${NC}"
if [ -d "$SPECSTORY_DIR/features" ]; then
    FEATURE_COUNT=$(ls -1 "$SPECSTORY_DIR/features"/*.md 2>/dev/null | grep -v TEMPLATE | wc -l | tr -d ' ')
    echo -e "  ${GREEN}OK${NC} Features directory exists"
    echo -e "  ${GREEN}  ->${NC} Features documented: $FEATURE_COUNT"
else
    echo -e "  ${YELLOW}WARN${NC} Features directory not found (will be created when needed)"
fi

# Check 6: VS Code settings file exists
echo -e "${BLUE}Checking VS Code settings...${NC}"
if [ -f "$PROJECT_ROOT/.vscode/settings.json" ]; then
    if grep -q "specstory.enabled" "$PROJECT_ROOT/.vscode/settings.json"; then
        echo -e "  ${GREEN}OK${NC} VS Code settings configured"
    else
        echo -e "  ${YELLOW}WARN${NC} VS Code settings file exists but SpecStory not configured"
    fi
else
    echo -e "  ${YELLOW}WARN${NC} VS Code settings file not found (optional)"
fi

# Check 7: Workspace file configured
echo -e "${BLUE}Checking workspace file...${NC}"
if [ -f "$PROJECT_ROOT/apr-dashboard-v3.code-workspace" ]; then
    if grep -q "specstory.enabled" "$PROJECT_ROOT/apr-dashboard-v3.code-workspace"; then
        echo -e "  ${GREEN}OK${NC} Workspace file configured"
    else
        echo -e "  ${YELLOW}WARN${NC} Workspace file exists but SpecStory not configured"
    fi
else
    echo -e "  ${YELLOW}WARN${NC} Workspace file not found (optional)"
fi

# Check 8: Utility script exists
echo -e "${BLUE}Checking utility script...${NC}"
if [ -f "$SPECSTORY_DIR/specstory-utils.sh" ]; then
    if [ -x "$SPECSTORY_DIR/specstory-utils.sh" ]; then
        echo -e "  ${GREEN}OK${NC} Utility script exists and is executable"
    else
        echo -e "  ${YELLOW}WARN${NC} Utility script exists but not executable"
        echo -e "  ${YELLOW}  ->${NC} Run: chmod +x $SPECSTORY_DIR/specstory-utils.sh"
    fi
else
    echo -e "  ${YELLOW}WARN${NC} Utility script not found (optional)"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}Setup Verification Complete!${NC}"
echo "=========================================="
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Install SpecStory extension in Claude Code if not already installed"
echo "2. Open workspace file: apr-dashboard-v3.code-workspace"
echo "3. Start a conversation in Claude Code"
echo "4. Verify session was captured: ./specstory-utils.sh latest 1"
echo ""
echo -e "${BLUE}For detailed setup instructions, see:${NC}"
echo "  .specstory/CLAUDE-CODE-SETUP.md"
