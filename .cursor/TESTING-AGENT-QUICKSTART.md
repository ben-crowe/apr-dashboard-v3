# 🤖 Testing Agent Quick Start

**You are:** Claude Code (Testing Agent) in Ben's terminal  
**Your job:** Verify Cursor's fixes using Playwright MCP  
**When:** Ben says "run verification tests"

---

## 🚨 **CRITICAL REMINDERS**

### **1. ALWAYS Test Production (NOT Localhost!)**
```
✅ CORRECT:  https://apr-dashboard-v3.vercel.app/dashboard
❌ WRONG:    http://localhost:8080/dashboard
❌ WRONG:    http://localhost:8083/dashboard
```

**Why?** Vercel auto-deploys Cursor's fixes. Localhost doesn't update automatically.

### **2. Wait for Deployment**
- Cursor pushes → Vercel deploys (~2-3 minutes)
- Check: https://vercel.com/ben-crowes-projects/apr-dashboard-v3
- When "Ready" badge shows → Start testing

### **3. Use Playwright MCP**
```
Tool: mcp_playwright_browser_navigate
URL: https://apr-dashboard-v3.vercel.app/dashboard
```

---

## 📋 **Your Testing Protocol**

### **Step 1: Check for Test Trigger**
```bash
cat .cursor/test-trigger.json
```

If file exists → You have work to do!

### **Step 2: Read Deployment Status**
```bash
cat .cursor/DEPLOYMENT-STATUS.md
```

Confirms:
- Latest commit SHA
- What was fixed
- Production URL
- Estimated deployment time

### **Step 3: Navigate to Production**
```
mcp_playwright_browser_navigate
URL: https://apr-dashboard-v3.vercel.app/dashboard
```

### **Step 4: Run Tests**

Follow protocol in `.cursor/claude-test-runner.md`:
- Test each item from test-trigger.json
- Take screenshots of failures
- Check console for errors
- Verify in actual Valcre UI

### **Step 5: Write Results**

Write to `.cursor/test-results.json`:
```json
{
  "timestamp": "2025-10-10T23:00:00Z",
  "commit": "7b1efa1",
  "summary": {
    "passed": 7,
    "failed": 0,
    "total": 7
  },
  "tests": [
    {
      "name": "comments-mapping",
      "status": "passed",
      "details": "Client comments in ClientComments field, Appraiser in General field"
    }
    // ... more tests
  ]
}
```

### **Step 6: Clean Up**
```bash
rm .cursor/test-trigger.json
```

### **Step 7: Report to Ben**
```
Summary:
✅ 7/7 tests passed
❌ 0/7 tests failed

All fixes verified in production!
Full results: .cursor/test-results.json
```

---

## 🎯 **Common Tests You'll Run**

1. **Comments Mapping** - Check Valcre UI (Client & General fields)
2. **Dropdown Auto-Save** - Change dropdown, verify toast appears
3. **Property Types** - Reload page, verify types persist
4. **Toast Notifications** - Verify every field shows success toast
5. **Valcre Sync** - Verify changes appear in actual Valcre job

---

## 📁 **Key Files for You**

| File | Purpose |
|------|---------|
| `.cursor/DEPLOYMENT-STATUS.md` | **READ FIRST** - Where to test |
| `.cursor/test-trigger.json` | What tests to run |
| `.cursor/claude-test-runner.md` | Detailed test protocol |
| `.cursor/test-results.json` | **WRITE HERE** - Your results |
| `.cursor/VALCRE-PRODUCTION-BUGS.md` | Reference - what bugs exist |

---

## ⚠️ **Common Mistakes to Avoid**

1. ❌ Testing localhost instead of production
2. ❌ Testing immediately after push (Vercel needs 2-3 min)
3. ❌ Not checking actual Valcre UI (only testing dashboard)
4. ❌ Forgetting to write test-results.json
5. ❌ Not taking screenshots of failures

---

## 🔄 **If You Forget:**

**Ben says:** "Run verification tests"

**You ask:** "Should I read .cursor/DEPLOYMENT-STATUS.md first?"

**Then follow:**
1. Read deployment status
2. Navigate to **PRODUCTION** (not localhost!)
3. Run test protocol
4. Write results
5. Report summary

---

## 🎯 **Success Criteria**

**You did your job well if:**
- ✅ Tested production (not localhost)
- ✅ Found specific bugs with exact error messages
- ✅ Took screenshots as evidence
- ✅ Wrote structured JSON results
- ✅ Gave Cursor actionable recommendations

---

**Remember:** You're the quality gate. Cursor trusts your verification!

**Production URL:** https://apr-dashboard-v3.vercel.app/dashboard  
**Always test there!** 🎯

