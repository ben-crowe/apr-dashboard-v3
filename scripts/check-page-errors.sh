#!/bin/bash

# Quick Console Error Check using agent-browser
# Usage: ./scripts/check-page-errors.sh [url]

URL="${1:-http://localhost:8086/dashboard/job/f8f1106a-e44c-477e-b046-42315ce38d8f}"

echo "Checking: $URL"
echo ""

{
  agent-browser open "$URL" &
  sleep 5
  agent-browser errors
  agent-browser close
} 2>&1 | grep -v "Browser not launched"
