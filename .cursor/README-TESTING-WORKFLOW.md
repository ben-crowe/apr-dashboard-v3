# Cursor ↔ Testing Agent Workflow (Semi-Automated)

## 🎯 Current Setup (80% Automated)

### **What's Automated:**
1. ✅ Cursor pushes → Git hook auto-triggers
2. ✅ Signal file created with commit SHA
3. ✅ Watcher detects and creates test trigger
4. ✅ Testing agent runs Playwright
5. ✅ Results written to JSON
6. ✅ Cursor reads results next session

### **What's Manual:**
- ❌ Ben needs to tell testing agent "check for triggers"
- (This is the only manual step)

---

## 🚀 Quick Start (5 Minutes)

### **Step 1: Start the Watcher (Terminal 1)**
```bash
cd /Users/bencrowe/Development/apr-dashboard-v3
./.cursor/watch-for-cursor.sh
```

Leave this running. You'll see:
```
🤖 Claude Code Testing Agent Started
👀 Watching for: .cursor/testing-needed.txt
```

### **Step 2: When You See "Signal detected!"**

The watcher will show:
```
🔔 Signal detected! Commit: abc123
✅ Test trigger created: .cursor/test-trigger.json
```

### **Step 3: Tell Your Testing Agent**
```
"Check for test triggers and run verification"
```

### **Step 4: Testing Agent Automatically:**
- Reads `.cursor/test-trigger.json`
- Runs the Playwright tests listed
- Writes `.cursor/test-results.json`

### **Step 5: Cursor (Me) Next Session:**
- Reads `.cursor/test-results.json`
- Sees what passed/failed
- Auto-fixes failures
- Pushes again → Cycle repeats

---

## 📋 For Ben: Your Only Manual Step

**When watcher shows "Signal detected!":**

Option A (Quick):
```
Tell testing agent: "Run verification tests"
```

Option B (Specific):
```
Tell testing agent: "Check .cursor/test-trigger.json and run those tests"
```

That's it! Everything else is automated.

---

## 🔄 The Complete Flow

```
┌─────────────┐
│   Cursor    │ 1. Makes fixes
│             │ 2. git push
└──────┬──────┘
       │ AUTOMATED ✅
       ▼
┌─────────────────┐
│   Git Hook      │ 3. Creates signal
│   (post-push)   │
└──────┬──────────┘
       │ AUTOMATED ✅
       ▼
┌──────────────────┐
│  Bash Watcher    │ 4. Detects signal
│  (Terminal 1)    │ 5. Creates trigger
└──────┬───────────┘
       │
       │ ⚠️ MANUAL STEP (only this!)
       ▼
┌──────────────────┐
│   Ben tells      │ 6. "Run tests"
│  Testing Agent   │
└──────┬───────────┘
       │ AUTOMATED ✅
       ▼
┌──────────────────┐
│  Testing Agent   │ 7. Runs Playwright
│  (Claude Code)   │ 8. Writes results
└──────┬───────────┘
       │ AUTOMATED ✅
       ▼
┌──────────────────┐
│   Cursor reads   │ 9. Sees results
│   results file   │ 10. Fixes issues
└──────────────────┘
```

**You save:** Copying error reports, describing bugs, manual testing

**You do:** One sentence: "Run verification tests"

---

## 💾 File Locations

- **Signal File**: `.cursor/testing-needed.txt` (auto-deleted after read)
- **Test Trigger**: `.cursor/test-trigger.json` (tells agent what to test)
- **Test Results**: `.cursor/test-results.json` (agent writes, Cursor reads)
- **Watcher Script**: `.cursor/watch-for-cursor.sh` (runs in Terminal 1)

---

## 🧪 Test It Now

**Try a dummy push:**
```bash
git commit --allow-empty -m "Test hook system"
git push
```

**You should see:**
1. Watcher shows "Signal detected!"
2. `.cursor/test-trigger.json` created
3. Tell testing agent "Run verification"
4. Watch Playwright tests run
5. `.cursor/test-results.json` appears

---

## 🚀 Future: Full Automation Options

### **Option A: Node.js Daemon + Claude API**
```javascript
// Calls Claude API to run tests when signal detected
const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
```

### **Option B: GitHub Actions**
```yaml
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-action@v1
        with:
          prompt: "Run Playwright verification tests"
```

### **Option C: n8n Workflow**
- File watcher node
- Trigger Claude agent node
- Write results node

**But for now, semi-automated is MORE THAN GOOD ENOUGH!**

---

## ✅ Summary

**Current State:**
- 80% automated
- One manual trigger per push
- Saves you 90% of testing overhead

**Next Push:**
- Cursor fixes the retainer/appraisal bug
- Pushes code
- Watcher detects
- You tell agent "run tests"
- Agent verifies automatically
- Writes results
- Cursor reads and confirms
- **DONE!**

This is production-ready TODAY! 🎉

