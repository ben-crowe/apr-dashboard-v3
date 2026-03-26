#!/bin/bash
# APR Dashboard - TDD Dashboard Launcher
# Starts dev server and opens TDD Dashboard in browser

cd "$(dirname "$0")"

echo "🚀 Starting APR Dashboard dev server..."

# Check if server is already running
if lsof -Pi :8084 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Dev server already running on port 8084"
else
    echo "⚡ Starting dev server..."
    npm run dev > /dev/null 2>&1 &

    # Wait for server to be ready (max 10 seconds)
    for i in {1..20}; do
        if curl -s http://localhost:8084 > /dev/null; then
            echo "✅ Dev server ready!"
            break
        fi
        sleep 0.5
    done
fi

echo "🌐 Opening TDD Dashboard..."
open "http://localhost:8084/test-input"

echo "✨ Done! TDD Dashboard should open in your browser."
