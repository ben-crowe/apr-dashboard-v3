# Cursor ↔ Testing Agent Hook Integration Guide

**Created**: October 10, 2025  
**Purpose**: Automatically trigger your testing agent when Cursor completes work

---

## 🎯 **The Workflow**

```
┌─────────────┐      ┌──────────────┐      ┌─────────────────┐
│   Cursor    │─────▶│  Git Hook    │─────▶│ Testing Agent   │
│ (me coding) │ push │ (trigger)    │signal│ (Playwright)    │
└─────────────┘      └──────────────┘      └─────────────────┘
                                                      │
                                                      ▼
                                            ┌─────────────────┐
                                            │  Test Report    │
                                            │  ✅/❌ Results  │
                                            └─────────────────┘
```

---

## ✅ **Method 1: Git Post-Push Hook (RECOMMENDED)**

### **What I've Already Set Up:**
- ✅ Created `.git/hooks/post-push` hook
- ✅ Made it executable (`chmod +x`)
- ✅ Hook creates signal file: `.cursor/testing-needed.txt`

### **What You Need To Do:**

**Configure your testing agent to watch for the signal file:**

```bash
# In your testing agent's workflow/script
while true; do
  if [ -f .cursor/testing-needed.txt ]; then
    COMMIT_SHA=$(cat .cursor/testing-needed.txt)
    echo "🔔 New commit detected: $COMMIT_SHA"
    echo "🧪 Running Playwright tests..."
    
    # Run your Playwright tests
    npx playwright test tests/cursor-fixes-verification.spec.ts
    
    # Remove signal file after processing
    rm .cursor/testing-needed.txt
    
    echo "✅ Testing complete for $COMMIT_SHA"
  fi
  sleep 5  # Check every 5 seconds
done
```

### **How It Works:**
1. I make fixes and run `git push`
2. Git automatically triggers `.git/hooks/post-push`
3. Hook writes commit SHA to `.cursor/testing-needed.txt`
4. Your agent detects the file and runs tests
5. Agent removes the file after testing

---

## 🔧 **Method 2: NPM Script Hook**

### **Add to `package.json`:**

```json
{
  "scripts": {
    "test:agent": "node .cursor/trigger-testing-agent.js",
    "postbuild": "npm run test:agent"  // Runs after every build
  }
}
```

### **Create `.cursor/trigger-testing-agent.js`:**

```javascript
const fs = require('fs');
const { execSync } = require('child_process');

// Get current commit SHA
const commitSha = execSync('git rev-parse HEAD').toString().trim();

console.log('🚀 Build complete - triggering testing agent');
console.log('📝 Commit:', commitSha);

// Create signal file
fs.writeFileSync('.cursor/testing-needed.txt', commitSha);

console.log('✅ Signal sent to testing agent');
```

### **Customize the Hook:**

Replace the hook content with your preferred method:

```bash
# Method A: Claude CLI (if you have it installed)
claude --agent testing-agent --prompt "Run verification tests for latest push"

# Method B: HTTP webhook to your testing agent
curl -X POST http://localhost:3001/test-trigger \
  -H "Content-Type: application/json" \
  -d "{\"commit\": \"$(git rev-parse HEAD)\"}"

# Method C: Signal file (current setup)
echo "$(git rev-parse HEAD)" > .cursor/testing-needed.txt
```

---

## 📋 **Method 3: Cursor TODO Completion Hook**

**When I complete all TODOs, create a marker:**

```javascript
// I can add this to my workflow
if (allTodosComplete) {
  fs.writeFileSync('.cursor/ready-for-testing.txt', JSON.stringify({
    timestamp: Date.now(),
    commit: commitSha,
    todosCompleted: completedTodos
  }));
}
```

---

## 🔍 **Testing Agent Configuration**

### **Option A: File Watcher (Recommended)**

Use Node.js `chokidar` or `fs.watch`:

```javascript
const chokidar = require('chokidar');

const watcher = chokidar.watch('.cursor/testing-needed.txt', {
  persistent: true
});

watcher.on('add', async (path) => {
  console.log('🔔 Signal file detected!');
  const commitSha = await fs.promises.readFile(path, 'utf-8');
  
  // Run Playwright tests
  const { exec } = require('child_process');
  exec('npx playwright test', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Tests failed:', error);
    } else {
      console.log('✅ Tests passed!');
    }
    
    // Clean up signal file
    fs.unlinkSync(path);
  });
});
```

### **Option B: Claude MCP Watcher**

If your testing agent uses Claude MCP:

```javascript
// In your MCP server
const server = new Server({
  name: "testing-agent",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {},
    resources: {}
  }
});

// Watch for Cursor completion signals
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  // Check for signal file
  if (fs.existsSync('.cursor/testing-needed.txt')) {
    return {
      resources: [{
        uri: "test://trigger",
        name: "Run Playwright Tests",
        description: "Cursor completed work - run verification"
      }]
    };
  }
  return { resources: [] };
});
```

---

## 🚀 **Quick Start (5 Minutes)**

### **1. Test the Hook Manually:**

```bash
# Trigger the hook
./.git/hooks/post-push

# Check if signal file was created
cat .cursor/testing-needed.txt
```

### **2. Create a Simple Watcher Script:**

```bash
# watch-for-cursor.sh
#!/bin/bash
while true; do
  if [ -f .cursor/testing-needed.txt ]; then
    echo "🧪 Running tests..."
    npx playwright test
    rm .cursor/testing-needed.txt
  fi
  sleep 3
done
```

### **3. Run the Watcher:**

```bash
chmod +x watch-for-cursor.sh
./watch-for-cursor.sh &  # Run in background
```

Now when I push code, your tests run automatically! 🎉

---

## 📊 **Advanced: Status File for Feedback Loop**

### **After Tests Complete, Agent Writes Results:**

```javascript
// testing-agent writes results
fs.writeFileSync('.cursor/test-results.json', JSON.stringify({
  timestamp: Date.now(),
  commit: commitSha,
  passed: true,
  failedTests: [],
  summary: "All 5 tests passed ✅"
}));
```

### **I Can Check Results on Next Run:**

```javascript
// In my workflow
if (fs.existsSync('.cursor/test-results.json')) {
  const results = JSON.parse(fs.readFileSync('.cursor/test-results.json'));
  console.log('📊 Last test results:', results.summary);
}
```

---

## 🔄 **Complete Bidirectional Flow**

```
Cursor → Push Code → Git Hook → Signal File
  ↑                                    ↓
  └─── Test Results ←─── Agent Runs ←─┘
```

---

## 💡 **Best Practices**

1. **Use `.gitignore`** to exclude signal files:
   ```
   .cursor/testing-needed.txt
   .cursor/test-results.json
   ```

2. **Add timeout to watcher** - don't run tests if they're already running

3. **Log everything** - helps debug if hook isn't triggering

4. **Test the hook** before relying on it:
   ```bash
   git commit --allow-empty -m "Test hook"
   git push
   ```

---

## ❓ **Troubleshooting**

### **Hook isn't triggering:**
```bash
# Check if hook is executable
ls -la .git/hooks/post-push

# Test hook manually
./.git/hooks/post-push

# Check git hook output
GIT_TRACE=1 git push
```

### **Agent isn't detecting signal:**
```bash
# Check if file exists
ls -la .cursor/testing-needed.txt

# Check file permissions
chmod 644 .cursor/testing-needed.txt
```

### **Tests not running:**
```bash
# Test Playwright directly
npx playwright test --reporter=list

# Check for port conflicts
lsof -i :8083
```

---

## 🎯 **Summary**

**I've set up the foundation:**
- ✅ Git post-push hook created
- ✅ Signal file mechanism ready
- ✅ This documentation

**You need to:**
1. Configure your testing agent to watch `.cursor/testing-needed.txt`
2. Run Playwright tests when file appears
3. Delete signal file after testing

**Result:**
- When I push → Hook triggers → Tests run automatically
- No manual intervention needed
- You get instant feedback on my fixes

---

**Questions? Let me know and I can help customize this for your exact setup!**

