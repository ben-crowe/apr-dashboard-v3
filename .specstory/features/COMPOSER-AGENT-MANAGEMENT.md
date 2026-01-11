# Cursor Composer Agent Management Guide

**How agents are coordinated and managed with Cursor Composer**

---

## Overview

Your system uses **multiple AI agents** that work together through **file-based communication** and **orchestration patterns**. Composer (Cursor's AI) is the primary development agent, but it coordinates with other specialized agents.

---

## Agent Architecture

### 1. **Cursor Composer** (Primary Development Agent)
- **Location**: Cursor IDE (main editor)
- **Model**: `composer-1`
- **Mode**: `Agent`
- **Role**: Makes code changes, fixes bugs, implements features
- **Communication**: Writes to `.cursor/` files, commits to git

### 2. **Testing Agent** (Verification Agent)
- **Location**: Claude Code / Zed (external terminal/agent)
- **Role**: Verifies Composer's fixes using Playwright MCP
- **Communication**: Reads `.cursor/test-trigger.json`, writes `.cursor/test-results.json`
- **Trigger**: Manual ("run verification tests") or automated via file watcher

### 3. **Multi-Agent Coordinator** (Research Orchestrator)
- **Location**: Terminal 1 (Sonnet model)
- **Role**: Strategic oversight - defines WHAT to research, WHO validates
- **Communication**: Generates deployment instructions for Terminal 2

### 4. **HK-Organizer** (Research Executor)
- **Location**: Terminal 2 (Haiku model)
- **Role**: Tactical execution - deploys research agents, validates deliverables
- **Communication**: Receives instructions from Terminal 1, writes to research directories

---

## How Composer Manages Agents

### File-Based Communication Pattern

Composer doesn't directly "control" other agents. Instead, it uses **shared files** as communication channels:

```
┌─────────────────┐
│ Cursor Composer │
│  (makes fixes)   │
└────────┬────────┘
         │ Writes
         ▼
┌─────────────────────┐
│ .cursor/test-       │
│ trigger.json        │
└────────┬────────────┘
         │ Read by
         ▼
┌─────────────────┐
│ Testing Agent   │
│ (verifies fixes)│
└────────┬────────┘
         │ Writes
         ▼
┌─────────────────────┐
│ .cursor/test-       │
│ results.json        │
└────────┬────────────┘
         │ Read by
         ▼
┌─────────────────┐
│ Cursor Composer │
│ (reads results)  │
└─────────────────┘
```

### Communication Files

| File | Written By | Read By | Purpose |
|------|-----------|---------|---------|
| `.cursor/test-trigger.json` | Git hook / Composer | Testing Agent | Tells agent what to test |
| `.cursor/test-results.json` | Testing Agent | Composer | Results of verification |
| `.cursor/testing-needed.txt` | Git hook | File watcher | Signal that testing is needed |
| `.cursor/DEPLOYMENT-STATUS.md` | Composer | Testing Agent | Deployment info & test URL |

---

## Workflow Examples

### Example 1: Composer → Testing Agent

**Step 1: Composer makes fixes**
```typescript
// Composer edits code in Cursor
// Fixes bug in LoeQuoteSection.tsx
```

**Step 2: Composer pushes to git**
```bash
git add .
git commit -m "Fix appraiser comments auto-save"
git push
```

**Step 3: Git hook creates signal**
```bash
# Post-push hook creates:
echo "abc123" > .cursor/testing-needed.txt
```

**Step 4: File watcher detects signal**
```bash
# watch-for-cursor.sh detects file
# Creates: .cursor/test-trigger.json
```

**Step 5: Testing Agent reads trigger**
```bash
# Testing Agent (in Claude Code) reads:
cat .cursor/test-trigger.json
```

**Step 6: Testing Agent runs tests**
```javascript
// Uses Playwright MCP to test production
mcp_playwright_browser_navigate({ url: "https://apr-dashboard-v3.vercel.app/dashboard" })
// Runs tests, takes screenshots
```

**Step 7: Testing Agent writes results**
```json
// Writes to .cursor/test-results.json
{
  "summary": { "passed": 7, "failed": 0 },
  "tests": [...]
}
```

**Step 8: Composer reads results (next session)**
```bash
# Composer reads results in next conversation
cat .cursor/test-results.json
# Sees what passed/failed
# Auto-fixes failures if needed
```

---

### Example 2: Multi-Agent Research Orchestration

**Terminal 1 (Coordinator - Sonnet):**
```
"Deploy research assignment for API Integration domain"
```

**Terminal 2 (HK-Organizer - Haiku):**
```
- Reads: research-assignment-api-integration.md
- Deploys research-analyst agent
- Monitors progress
- Validates deliverables
```

**Communication:**
- Terminal 1 → Terminal 2: Deployment instructions (text)
- Terminal 2 → Terminal 1: Progress updates (JSONL files)
- Both → Filesystem: Research deliverables

---

## SpecStory Integration

**SpecStory captures all Composer conversations:**

- Every Composer session is saved to `.specstory/history/`
- Format: `YYYY-MM-DD_HH-MMZ-session-name.md`
- Includes:
  - User queries
  - Agent responses
  - Tool usage (file reads, edits, commands)
  - Full context

**Example session header:**
```markdown
<!-- cursor Session abc123... (2026-01-08 14:51Z) -->
_**Agent (model composer-1, mode Agent)**_
```

**Usage:**
- Reference past sessions: `@.specstory/history/session-name.md`
- Search history: `./specstory-utils.sh search "topic"`
- Load context into new conversations

---

## Agent Coordination Patterns

### Pattern 1: Sequential (Composer → Testing Agent)
```
Composer fixes → Git push → Signal file → Testing Agent verifies → Results file → Composer reads
```

### Pattern 2: Parallel (Multi-Agent Research)
```
Coordinator (Terminal 1) → Instructions → Executor (Terminal 2) → Deploys agents → Validates → Reports back
```

### Pattern 3: Asynchronous (File Watcher)
```
Git hook → Signal file → Watcher script → Trigger file → Agent picks up → Processes → Results
```

---

## Key Management Principles

### 1. **No Direct Control**
- Composer doesn't "command" other agents
- Uses files as communication channels
- Agents operate independently

### 2. **Event-Driven**
- Git hooks trigger signals
- File watchers detect changes
- Agents respond to file presence

### 3. **Stateless Communication**
- Files contain all context needed
- No persistent connections
- Agents can start/stop independently

### 4. **Separation of Concerns**
- **Composer**: Development (code changes)
- **Testing Agent**: Verification (Playwright tests)
- **Coordinator**: Strategy (research planning)
- **Executor**: Tactics (research deployment)

---

## Current Agent Setup

### Active Agents

1. ✅ **Cursor Composer** - Active in Cursor IDE
   - Making code changes
   - Writing to `.cursor/` files
   - Committing to git

2. ✅ **Testing Agent** - Available in Claude Code
   - Reads test triggers
   - Runs Playwright verification
   - Writes results

3. ✅ **Multi-Agent Coordinator** - Available (Sonnet)
   - Strategic research planning
   - Domain deployment instructions

4. ✅ **HK-Organizer** - Available (Haiku)
   - Research execution
   - Agent deployment
   - Validation

### Communication Status

- ✅ File-based communication working
- ✅ Git hooks creating signals
- ✅ File watcher monitoring (optional)
- ✅ SpecStory capturing conversations
- ✅ Test results being written/read

---

## Best Practices

### For Composer (You)

1. **Write clear test triggers**
   - Specify what to test in `.cursor/test-trigger.json`
   - Include commit SHA and context

2. **Check results before claiming fixes**
   - Read `.cursor/test-results.json` in next session
   - Verify tests passed before moving on

3. **Document deployment status**
   - Update `.cursor/DEPLOYMENT-STATUS.md`
   - Include production URL and commit info

### For Testing Agent

1. **Always test production**
   - Use: `https://apr-dashboard-v3.vercel.app/dashboard`
   - Never test localhost

2. **Wait for deployment**
   - Vercel needs 2-3 minutes after push
   - Check deployment status first

3. **Write structured results**
   - Use JSON format
   - Include screenshots for failures
   - Provide actionable feedback

### For Multi-Agent Coordination

1. **Sequential deployment**
   - Complete one domain before starting next
   - Monitor progress asynchronously

2. **Verify tangible evidence**
   - Check file sizes grew
   - Verify fixes present in code
   - Don't trust claims without proof

---

## Troubleshooting

### Composer can't communicate with Testing Agent

**Check:**
```bash
# Signal file exists?
ls -la .cursor/testing-needed.txt

# Trigger file created?
cat .cursor/test-trigger.json

# Results file written?
cat .cursor/test-results.json
```

**Solution:**
- Ensure Testing Agent is active in Claude Code
- Check file permissions
- Verify git hooks are installed

### Testing Agent not responding

**Check:**
```bash
# Is agent active?
# Check Claude Code terminal

# Are trigger files readable?
cat .cursor/test-trigger.json
```

**Solution:**
- Manually tell agent: "Check for test triggers"
- Or: "Run verification tests"
- Verify Playwright MCP is available

### Multi-agent coordination stuck

**Check:**
```bash
# Terminal 2 JSONL progress
ls -lt ~/.claude/projects/*.jsonl | head -2

# Research deliverables
ls -lh research-deliverables/[domain]/
```

**Solution:**
- Verify Terminal 2 is active
- Check deployment instructions were clear
- Monitor JSONL for progress

---

## Summary

**Composer manages agents through:**

1. ✅ **File-based communication** (not direct control)
2. ✅ **Event-driven triggers** (git hooks, file watchers)
3. ✅ **Stateless protocols** (files contain all context)
4. ✅ **Separation of concerns** (each agent has specific role)

**Current system:**
- Composer → Testing Agent (via files)
- Coordinator → Executor (via instructions)
- SpecStory captures everything

**Key files:**
- `.cursor/test-trigger.json` - What to test
- `.cursor/test-results.json` - Test results
- `.specstory/history/` - Conversation history

---

**Last Updated**: 2026-01-08  
**Status**: ✅ Active and Working
