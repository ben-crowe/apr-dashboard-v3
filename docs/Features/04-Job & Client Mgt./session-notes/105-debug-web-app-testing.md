# Debug Web App Command Testing & Documentation

**Date:** January 27, 2026  
**Purpose:** Test and document how `/debug-web-app` command works  
**Status:** Testing Complete

---

## What I Learned

### The `/debug-web-app` Command Structure

The command activates a **systematic debugging workflow** defined in:
- **SOP:** `~/.claude/protocols/Debugging/debugging-web-app-SOP.md`
- **Frontend Protocol:** `~/.claude/protocols/Debugging/2-web-app-debugging-protocol.md`
- **Backend Protocol:** `~/.claude/protocols/Debugging/3-backend-debugging-protocol.md`

### Key Insight: Orchestrator vs Worker Roles

**In Claude Code (with Task() tool):**
- Orchestrator deploys sub-agents using `Task()` tool
- Sub-agents read protocol files and execute independently
- Orchestrator validates findings and coordinates fixes

**In Cursor (without Task() tool):**
- I AM the orchestrator AND the worker
- I follow the SOP workflow steps myself
- I use the protocols as guidance for systematic debugging
- No sub-agent deployment needed - I execute directly

---

## Workflow Steps (From SOP)

### STEP 0: Pre-Flight Tool Check ✅

**What it does:**
- Verifies `agent-browser` is installed
- Checks dev server is running
- Ensures environment is ready

**Commands:**
```bash
which agent-browser
# Expected: /Users/bencrowe/.npm-global/bin/agent-browser ✅

curl http://localhost:[PORT] -I
# Expected: 200 OK or HTML response
```

**If checks fail:** Report to user and STOP. Don't proceed with broken environment.

---

### STEP 1: Switch Persona (Optional)

**When to use:**
- General debugging → `debugger`
- Frontend-heavy → `react-specialist`
- Backend-heavy → `backend-developer`
- Multi-layer → `root-cause-analyst`

**In Cursor:** I can mentally adopt the persona, but no `/persona-switching` command needed.

---

### STEP 2: Gather Context

**What to ask user:**
1. **What's not working?** (Brief description)
2. **Dev server port?** (e.g., 3000, 5173, 8086)
3. **Can you reproduce it?** (Yes/No)
4. **Recent changes?** (Code, deployments, config)

**Also search Cognee:**
- Look for similar error patterns
- Check if issue was seen before

---

### STEP 3: Execute Debugging Protocol

**Choose protocol based on issue:**

| User Reports | Protocol | Why |
|--------------|----------|-----|
| "Button doesn't work" | Protocol 2 (Frontend) | UI interaction = frontend |
| "Console errors" | Protocol 2 (Frontend) | Browser console = frontend |
| "Component not rendering" | Protocol 2 (Frontend) | React component = frontend |
| "API returns 500" | Protocol 3 (Backend) | Server error = backend |
| "Login fails with 401" | Protocol 3 (Backend) | Auth error = backend |
| "Database connection error" | Protocol 3 (Backend) | DB = backend |
| "Page is slow" | Both 2 + 3 | Could be either layer |
| "Something's broken" (vague) | Both 2 + 3 | Check both layers |

**In Cursor:** I execute the protocol steps myself using:
- `agent-browser` commands (for frontend)
- Terminal commands (for backend)
- Code inspection
- Log analysis

---

### STEP 4: Validate Findings

**Checklist:**
- [ ] Root cause explains ALL symptoms
- [ ] Evidence supports diagnosis (logs, screenshots, queries)
- [ ] Diagnosis is specific (not vague)
- [ ] Recommended fix is actionable

**If PASS:** Proceed to Step 5  
**If FAIL:** Gather more evidence or try different protocol

---

### STEP 5: Implement Fix

**What to do:**
- Read affected files first
- Fix ONLY what's broken - no extras
- Maintain existing code style
- Keep changes minimal

**In Cursor:** I implement fixes directly using code editing tools.

---

### STEP 6: Verify Fix

**What to do:**
1. Navigate to the area that was broken
2. Attempt to reproduce the original issue
3. Check console for errors
4. Report: FIXED / NOT FIXED / PARTIALLY FIXED

**In Cursor:** Use `agent-browser` or manual testing to verify.

---

### STEP 7: Document in Cognee (Optional)

**What to document:**
```markdown
## Debugging Session: [Brief Title]

**Issue:** [Original problem]
**Root Cause:** [What caused it]
**Fix:** [What was changed]
**Files:** [Changed files]
**Prevention:** [How to avoid in future]
```

**Action:** `/add-to-cognee` (if Cognee available)

---

### STEP 8: Report to User

**Format:**
```markdown
## Debugging Complete

**Issue:** [Brief description]
**Root Cause:** [What caused it]
**Fix Applied:** [What changed]
**Verification:** ✅ Resolved
**Files Changed:** [List]
```

---

## Protocol 2: Frontend Debugging (Key Commands)

**Essential workflow:**
```bash
# 1. Open application
agent-browser open http://localhost:PORT --headed

# 2. Navigate to problem area
agent-browser snapshot -i | grep -i "search term"
agent-browser click @eXX
agent-browser wait --load networkidle

# 3. Check console logs
agent-browser console | tail -30
agent-browser console | grep "ComponentName"

# 4. Check for errors
agent-browser errors

# 5. Inspect DOM elements
agent-browser snapshot -i
agent-browser eval "document.querySelector('selector') ? 'found' : 'not found'"

# 6. Take screenshot
agent-browser screenshot /tmp/debug-state.png
```

**Key principle:** Console access is your best friend. Most bugs reveal themselves in console logs before visual symptoms appear.

---

## Protocol 3: Backend Debugging (Key Commands)

**Essential workflow:**
```bash
# 1. Verify server health
curl -s http://localhost:PORT/health | jq .

# 2. Check logs for errors
grep -i "error\|exception\|fail" /path/to/app.log | tail -30

# 3. Trace request flow
grep "request_id_here" /path/to/app.log

# 4. Check database state
psql -c "SELECT * FROM table_name WHERE id = 'expected_id';"

# 5. Test external dependencies
curl -v https://external-api.com/endpoint

# 6. Check resource utilization
ps -o pid,rss,vsz,comm -p $(pgrep -f "your_app")
```

**Key principle:** Follow the request from entry to response, checking each step for where it fails.

---

## Testing Results

### Test 1: Pre-Flight Checks ✅

```bash
$ which agent-browser
/Users/bencrowe/.npm-global/bin/agent-browser ✅

$ agent-browser --version
agent-browser 0.6.0 ✅

$ agent-browser --help
# Shows available commands: open, click, console, errors, screenshot, etc. ✅
```

**Result:** Tool check works. `agent-browser` is installed and functional. SOP correctly identifies when environment is ready.

### Test 2: Understanding agent-browser Commands ✅

**Available commands (from `--help`):**
- `open <url>` - Navigate to URL
- `click <sel>` - Click element
- `console` - View console logs (from Protocol 2)
- `errors` - View errors (from Protocol 2)
- `screenshot <path>` - Take screenshot (from Protocol 2)
- `snapshot -i` - Inspect interactive elements (from Protocol 2)
- `eval <js>` - Evaluate JavaScript (from Protocol 2)
- `wait` - Wait for conditions (from Protocol 2)

**Result:** Protocol 2 commands match actual `agent-browser` CLI. I can execute them directly.

---

### Test 3: SOP Structure Understanding ✅

**What I learned:**
- SOP provides **ready-to-use prompts** for sub-agents (in Claude Code)
- In Cursor, I use the **protocols as guidance** for my own debugging
- The workflow is **systematic and repeatable**
- Each step has **clear success criteria**

**Key insight:** The SOP teaches me HOW to debug systematically, even without sub-agents.

---

### Test 4: Protocol Guidance ✅

**Protocol 2 (Frontend):**
- Provides specific `agent-browser` commands for each scenario
- Has checklists for common issues (component not rendering, iframe not loading, etc.)
- Requires structured diagnosis report format

**Protocol 3 (Backend):**
- Provides specific log analysis commands
- Has scenarios for common issues (500 errors, DB connection failures, etc.)
- Requires structured diagnosis report format

**Result:** Protocols are comprehensive guides I can follow step-by-step.

### Test 5: Workflow Execution Understanding ✅

**What happens when I use `/debug-web-app`:**

1. **I read the SOP** - It tells me the workflow steps
2. **I execute Step 0** - Pre-flight checks (verify tools)
3. **I gather context** - Ask user or infer from conversation
4. **I choose protocol** - Frontend (2) or Backend (3) based on issue
5. **I follow protocol steps** - Execute commands systematically
6. **I collect evidence** - Logs, screenshots, queries
7. **I diagnose** - Root cause with evidence
8. **I fix** - Implement solution
9. **I verify** - Test that fix works
10. **I report** - Structured summary to user

**Key realization:** The command doesn't "magically debug" - it provides me with a **systematic methodology** to debug anything.

**In Cursor context:**
- No sub-agent deployment needed
- I execute protocols directly
- I am orchestrator AND worker
- Same systematic approach, just executed by me directly

---

## How to Use `/debug-web-app` in Cursor

**When user says:** "Something's broken" or "Debug this"

**My workflow:**
1. **Read SOP** (`~/.claude/protocols/Debugging/debugging-web-app-SOP.md`)
2. **Execute Step 0:** Pre-flight checks
3. **Execute Step 2:** Gather context (ask user or infer from context)
4. **Choose protocol:** Frontend (2) or Backend (3) or Both
5. **Execute protocol steps:** Follow the protocol file systematically
6. **Validate findings:** Check evidence supports diagnosis
7. **Implement fix:** Make code changes
8. **Verify fix:** Test that it works
9. **Report:** Summarize for user

**Key difference from Claude Code:**
- No `Task()` tool calls
- I execute protocols directly
- I am orchestrator AND worker

---

## Key Takeaways

1. **The SOP teaches systematic debugging** - not just tool usage
2. **Protocols are comprehensive guides** - follow them step-by-step
3. **In Cursor, I execute directly** - no sub-agent deployment needed
4. **Workflow is repeatable** - same steps every time
5. **Evidence-based diagnosis** - always collect logs, screenshots, queries
6. **Structured reporting** - protocols specify output format

---

## Next Time I Use `/debug-web-app`

1. Read SOP to refresh workflow
2. Execute pre-flight checks
3. Gather context
4. Choose appropriate protocol
5. Follow protocol systematically
6. Collect evidence at each step
7. Return structured diagnosis report
8. Implement fix
9. Verify fix works
10. Report to user

**I now understand:** The command doesn't "do" debugging - it teaches me HOW to debug systematically using proven protocols.

---

## Files Referenced

- SOP: `~/.claude/protocols/Debugging/debugging-web-app-SOP.md`
- Frontend Protocol: `~/.claude/protocols/Debugging/2-web-app-debugging-protocol.md`
- Backend Protocol: `~/.claude/protocols/Debugging/3-backend-debugging-protocol.md`
- Skill: `~/.claude/skills/debug-web-app/SKILL.md`

---

**Status:** ✅ Testing Complete - Ready to use `/debug-web-app` command effectively
