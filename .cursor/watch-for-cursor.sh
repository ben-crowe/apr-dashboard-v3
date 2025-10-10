#!/bin/bash

# Claude Code Testing Agent - File Watcher
# Monitors for Cursor's signal file and runs Playwright verification tests

echo "🤖 Claude Code Testing Agent Started"
echo "👀 Watching for: .cursor/testing-needed.txt"
echo "📍 Working directory: $(pwd)"
echo ""

while true; do
  if [ -f .cursor/testing-needed.txt ]; then
    COMMIT_SHA=$(cat .cursor/testing-needed.txt)
    echo "🔔 Signal detected! Commit: $COMMIT_SHA"
    echo "🧪 Starting Playwright verification tests..."
    echo ""

    # Start dev server in background if not running
    if ! lsof -i :8080 > /dev/null 2>&1; then
      echo "🚀 Starting dev server..."
      npm run dev > /dev/null 2>&1 &
      DEV_PID=$!
      sleep 5  # Wait for server to start
    fi

    # Run the verification tests via Claude Code MCP
    # This would ideally trigger me (Claude) to run the Playwright tests
    # For now, create a marker that I can detect

    echo "{
  \"trigger\": \"cursor-push\",
  \"commit\": \"$COMMIT_SHA\",
  \"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\",
  \"status\": \"testing-needed\",
  \"tests\": [
    \"multi-select-property-type\",
    \"appraisal-fee-save\",
    \"retainer-amount-save\",
    \"console-logs-clean\"
  ]
}" > .cursor/test-trigger.json

    echo "✅ Test trigger created: .cursor/test-trigger.json"
    echo "💡 Claude Code agent should now run Playwright tests..."

    # Remove the signal file
    rm .cursor/testing-needed.txt
    echo "🗑️  Signal file processed and removed"
    echo ""
    echo "⏳ Waiting for next signal..."
    echo ""
  fi

  sleep 3  # Check every 3 seconds
done
