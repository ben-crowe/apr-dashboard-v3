# Session Continuity System - Master Guide

**Last Updated:** November 7, 2025

---

## Quick Start for Agents

When you start a session, you have THREE knowledge sources:

1. **Passover files** → Treasure maps pointing to what matters
2. **Memory system** → Search ALL sessions with `/check-all-memory [keywords]` (PRIMARY - use 90% of time)
3. **JSONL conversation logs** → Raw session transcripts

**Don't just read files. Search memory FIRST. You're not a file reader - you're a knowledge retriever.**

**Search Strategy (from startup protocol):**
- 🏆 **PRIMARY (90%):** `/check-all-memory [keywords]` - Searches ALL sessions, always current
- 🔄 **FALLBACK (10%):** `mcp__cognee__search "query" GRAPH_COMPLETION` - For vague/conceptual queries
- 📋 **OTHER:** `pmem "query"` - Legacy shorthand (use /check-all-memory instead)

---

## Core Principle

**Passover files are TREASURE MAPS, not summaries.**

They tell you:
- What files to read
- What memory searches to run (and WHY)
- What JSONL sections matter
- What's broken or blocked
- Critical context from previous work

**The passover file guides you. Memory system empowers you. JSONL gives you raw detail.**

---

## File Types in This System

### 0. Master Evergreen Overview (READ THIS FIRST)

**Format:** `00-SYSTEM-OVERVIEW-EVERGREEN.md`

**Created by:** Manual/Agent, maintained across sessions

**Purpose:** Master system overview - complete project context

**Contains:**
- Complete system architecture
- All integrations and field mappings
- Open issues and bugs
- Production status
- Client context
- Search keywords

**Example:**
```
00-SYSTEM-OVERVIEW-EVERGREEN.md
```

**Your job:** READ THIS FILE FIRST before any session work. This is your foundation context.

**Naming:** `00-` prefix ensures it appears first alphabetically for easy discovery.

---

### 1. Session Work Files (CURRENT STANDARD - Nov 2025)

**Format:** `YY.MM.DD-[N] - [Descriptive-Name].md`

**Date Format:** Use DOTS: `25.11.19` ✅ (NOT dashes: ~~25-11-19~~)

**Created by:** Agent or manual during session work

**Purpose:** Session-specific work, context, and deliverables

**Contains:**
- What was accomplished
- Decisions made
- File changes
- Next steps
- Critical context

**Examples:**
```
25.11.19-3 - API-Credential-Search-Rule-ClickUp-Testing.md
25.11.19-2 - ClickUp-Section-2-Integration.md
25.11.19-1 - Phase-1-Documentation-Update.md
25.11.13-2 - API-Expert-Doc-from-code-sec1-2.md
```

**Numbering:** `-1`, `-2`, `-3` increments for multiple sessions same day

**Your job:** Read for context, execute if contains tasks

---

### 2. Legacy Session Files (OLD FORMAT - Being Phased Out)

**Format:** `YY-MM-DD | PROJECT Ses-#.md`

**Date Format:** DASHES with pipe separator (old convention)

**Created by:** Old `/session-summary` command format

**Purpose:** Complete session notes (legacy format)

**Examples:**
```
25-11-13 | APR Ses-13.md                    ← Old format (dashes + pipe)
25-11-02 | APR Ses-12.md                    ← Old format
25-11-01 | APR Ses-9.md                     ← Old format
```

**Status:** These still exist but new files use the dot format above

**Your job:** Read for historical context

---

## The Memory System Integration

### Memory Search Tools (Updated Protocol)

**🏆 PRIMARY TOOL (Use 90% of the time):**

**`/check-all-memory [keywords]`** - Your main knowledge search tool

**What it does:**
- Searches ALL JSONL session files directly
- Covers ALL projects, ALL time
- Always current (zero indexing lag)
- Includes CURRENT session being written

**Usage:**
```bash
/check-all-memory "APR Dashboard"              # Broad search (start here)
/check-all-memory "valcre field mapping"       # Specific topic
/check-all-memory "clickup auto-creation"      # Feature search
```

**When to use:** Almost always! If you have keywords, use this first.

---

**🔄 FALLBACK TOOL (Use 10% of the time):**

**`mcp__cognee__search "query" GRAPH_COMPLETION`** - Semantic knowledge graph search

**When to use:** Vague/conceptual queries without specific keywords

**Example:**
```bash
mcp__cognee__search "how does authentication work?" GRAPH_COMPLETION
```

---

**📋 LEGACY TOOL (Being phased out):**

**`pmem "query"`** - Old indexed search (may be stale)

**Status:** Still works but prefer `/check-all-memory` for current results

---

**Why this matters:**
- Passover files point to WHAT to search
- `/check-all-memory` returns ACTUAL knowledge (always current)
- Combines context across ALL sessions without indexing delay

**Example from passover file:**
```markdown
### Memory Searches to Run
/check-all-memory "valcre field mapping bugs"  # Why: check documented bugs
/check-all-memory "clickup template structure" # Why: verify current config
```

### Memory Search Results

**You'll get:**
- Relevant chunks of text from past sessions
- Confidence scores
- Source information
- Creation dates

**Note on errors:**
- "Failed to parse" warnings are cosmetic (tool returns text not JSON)
- Check `raw_output` field for actual results
- New vectors (post-Oct 24, 2025) work perfectly
- Old vectors may have missing chunk_text (cleanup planned)

**Don't ignore memory search.** It's how you build on past work instead of rediscovering.

---

## The Three-Source Workflow

### Starting a Session

**Step 1: Read the passover file**
- Location: `.passover-session/[latest file]`
- Get treasure map instructions

**Step 2: Run memory searches**
- Execute searches from passover file
- Search additional topics you need
- Build knowledge foundation

**Step 3: Read JSONL sections**
- Follow line ranges from passover file
- Get conversation context
- See actual problem-solving flow

**Step 4: Read specific files**
- Follow file list from passover file
- Understand current state

**Now you have complete context and you're ready to work.**

---

## Session Numbering System

### How It Works

**Sequential across project:**
- Ses-10 → Ses-11 → Ses-12
- Never reuse numbers
- Maintains clear chronology
- Independent of date or topic

**Auto-detection:**
```bash
# Command checks .passover-session/ folder
# Finds latest Ses-# number
# Increments by 1
# You don't manually track
```

### Session Number Rules

**NO dash = Session summary**
- `Ses-12.md` = Complete session notes
- Read for context
- Update if requested
- Don't execute

**WITH dash = Executable task**
- `Ses-12-1.md` = First prompt/task
- `Ses-12-2.md` = Second prompt/task
- Extract, save, EXECUTE

**WITH "terminal" = Passover file**
- `Ses-12 terminal-valcre.md` = Work session passover
- `Ses-12-1 terminal-result.md` = Prompt result passover
- Instructions for next agent

---

## Optional Topic Naming

**When to add topic:**
- ✅ Session has ONE clear focus → add topic
- ✅ Specific feature/bug → add topic
- ❌ Mixed activities → skip topic, use number only
- ❌ Exploratory work → skip topic

**Examples:**
```
# Focused sessions
25-11-07 | APR Ses-12 terminal-valcre-sync.md
25-11-07 | APR Ses-13 terminal-auth-deployment.md

# Mixed work
25-11-07 | APR Ses-12.md                    (no topic - many activities)
```

**Don't overthink naming.** Session number is enough for continuity. Topic helps searchability.

---

## The `/session-summary` Two-Stage Workflow

**Your primary tool for creating passover files.**

### Why Two Stages?

**Problem:** Agent creates file, you see it after, can't add context before it's written

**Solution:** Agent previews FIRST, you review and refine, THEN it executes

---

### Stage 1: Preview & Refinement (Default)

```bash
/session-summary                # Shows preview (Stage 1)
/session-summary --preview      # Explicit preview flag
/session-summary 1              # Stage 1 shorthand
```

**What happens:**

1. **Agent analyzes session**
   - Identifies topics, decisions, deliverables
   - Determines filename and location
   - Plans memory ingestion

2. **Agent shows preview:**
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📋 SESSION SUMMARY PREVIEW
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   
   Filename: 25-11-07 | APR Ses-12 terminal-valcre-sync.md
   Location: .passover-session/
   
   📌 WILL CAPTURE:
   • Discovery 1
   • Decision 1
   • Deliverable 1
   
   📌 FILES AFFECTED:
   .passover-session/
   └── 25-11-07 | APR Ses-12 terminal-valcre-sync.md [NEW]
   
   Ready to proceed? (yes/no)
   ```

3. **You review and refine:**
   - "Add this context: [X]"
   - "The main topic was actually: [Y]"
   - "Change priority to: [Z]"
   - Agent adjusts, shows preview again

4. **You approve:**
   - Type "yes" → Proceeds to Stage 2
   - Type "no" → Cancels, you can retry

**Benefits:**
- ✅ See exact filename and location BEFORE it's written
- ✅ Add external context (calls, meetings, decisions)
- ✅ Correct misunderstandings before committing
- ✅ Adjust priorities collaboratively
- ✅ Know where to find the file later

---

### Stage 2: Execute (After Approval)

```bash
/session-summary --execute      # Runs automatically after Stage 1 approval
/session-summary 2              # Manual Stage 2 (not recommended)
```

**What happens:**

1. **Creates directory if needed**
   - Ensures `.passover-session/` exists

2. **Writes passover file**
   - Incorporates your feedback from Stage 1
   - Creates file in approved location
   - Populates all sections

3. **Extracts learnings to memory**
   - Indexes major discoveries
   - Creates vectors for future search
   - (Unless `--skip-memory` flag used)

4. **Shows completion summary:**
   ```
   ✅ SESSION SUMMARY COMPLETE
   
   📄 Passover file: .passover-session/25-11-07 | APR Ses-12 terminal-valcre-sync.md
   🧠 Memory ingestion: 3 learnings indexed, 47 vectors stored
   
   📍 Next agent will:
   1. Read this passover file
   2. Execute instructions
   3. Load context from JSONL
   4. Be ready to continue
   ```

**Your Stage 1 feedback is incorporated into the final file.**

---

### Usage Examples

**Most common (default preview):**
```bash
/session-summary
# Shows preview → you review → type "yes" → executes
```

**With session number:**
```bash
/session-summary 12
# Uses Ses-12 → shows preview → you approve → executes
```

**Full specification:**
```bash
/session-summary 12 valcre-sync
# Ses-12, topic "valcre-sync" → preview → approve → execute
```

**Prompt result file:**
```bash
/session-summary 12-1
# Creates Ses-12-1 terminal-result.md → preview → approve
```

**Skip memory ingestion:**
```bash
/session-summary --skip-memory
# Preview → approve → execute without memory indexing
```

---

### Command Philosophy

**Create actionable instructions, not summaries.**

The passover file is a treasure map that tells next agent:
- What files to read (and why)
- What memory searches to run (with reasoning)
- What JSONL sections matter
- Critical context without fluff
- What's broken or blocked

**Two-stage ensures quality:** You partner with the agent to create the best possible handoff.

---

### Command Location

**Implemented as:** Claude Code slash commands
- Stage 1: `~/.claude/commands/session-summary-stage-1.md`
- Stage 2: `~/.claude/commands/session-summary-stage-2.md`
- Single-stage (legacy): `~/.claude/commands/session-summary.md`

**Recommendation:** Always use default (Stage 1 first)

---

## Passover File Structure

### For Next Agent (Primary Section)

**Files to Read:**
- Specific paths
- Why each file matters
- Priority order

**Memory Searches to Run:**
```bash
pmem "[topic 1]"  # Why: [reasoning]
pmem "[topic 2]"  # Why: [reasoning]
```

**JSONL to Review:**
- Session UUID path
- Specific line ranges
- What to look for

**Critical Context:**
- Key insights
- What changed
- New approaches

**Warnings:**
- What's broken
- What needs testing
- What changed

### User Notes Section (Editable)

**Critical feature:** Passover files are editable after generation.

Ben can add:
- Reminders for himself
- Things to investigate
- External context (calls, meetings, client feedback)
- Priority adjustments

**Next agent reads USER NOTES first** - they override generated content if conflict exists.

**Location in file:**
```markdown
## 📝 USER NOTES (Manually Added After Generation)

<!-- Ben: Add your notes here. Next agent will read and act on them. -->
```

### For Humans (Reference Section)

**Human-readable overview:**
- What we built
- What we discovered
- Decisions made
- Blockers
- Next steps

**This section is for Ben's reference.** Agents focus on the instructions section above.

---

## Integration Points

### With Zed (Primary Interface)

**Ben works in Zed for:**
- Planning and architecture
- Code review and validation
- Complex decision making
- Extended thinking sessions

**Zed exports:**
- Full conversation as markdown
- Manual save to `.passover-session/`
- Format: `YY-MM-DD | PROJECT Ses-#.md`

**Agents can reference Zed exports** via `@mention` or direct file read.

---

### With Terminal Claude (Executor)

**Terminal handles:**
- Implementing planned tasks
- Deploying subagents
- Heavy coding work
- Build and deployment

**Terminal creates passover files** via `/session-summary` command.

**Terminal receives:**
- Delegation from Ben
- Prompt files from Desktop Claude
- Context from passover files

---

### With Desktop Claude (File Management)

**Desktop Claude writes:**
- Prompt files for Terminal
- Planning documents
- Architecture specs

**Ben pastes to Terminal:**
- Entire Desktop Claude message
- Terminal extracts prompt files
- Terminal saves and executes

---

### With Memory System (Knowledge Retrieval)

**Memory system provides:**
- Cross-session knowledge
- Past problem solutions
- Methodology learnings
- Configuration details

**Passover files trigger memory:**
- Specify what to search
- Explain why it matters
- Point to relevant topics

**Agents MUST use memory** - don't rediscover what's already indexed.

---

## Workflow Patterns

### Pattern 1: Starting a New Session

```
1. Read latest passover file in .passover-session/
2. Run memory searches listed in passover
3. Review JSONL sections specified
4. Read files listed
5. Check USER NOTES for manual additions
6. You now have complete context
```

### Pattern 2: Terminal Receives Delegation

```
1. Ben pastes task from Desktop Claude or Zed
2. Extract prompt content
3. Save: YY-MM-DD | PROJECT Ses-#-N.md
4. Execute the task
5. Run /session-summary when complete
6. Report back results
```

### Pattern 3: End of Work Session

```
1. Review what was accomplished
2. Run /session-summary [session-number] [topic]
3. Command creates passover file
4. Command extracts learnings to memory (unless --skip-memory)
5. Edit passover file if needed (add USER NOTES)
6. File is ready for next agent
```

---

## Directory Structure

```
project-root/
├── .docs/
│   └── -passover | work-sessions/
│       ├── README.md                                    ← This file
│       ├── 25-11-06 | APR Ses-11.md                     ← Session summary
│       ├── 25-11-07 | APR Ses-12.md                     ← Session summary
│       ├── 25-11-07 | APR Ses-12 terminal-valcre.md     ← Terminal passover
│       └── 25-11-07 | APR Ses-12-1 terminal-result.md   ← Prompt result
├── src/
└── package.json
```

**Note:** Folder is `-passover | work-sessions/` (with pipe separator)

---

## Best Practices

### For Agents

**DO:**
- ✅ Run memory searches from passover files
- ✅ Search additional topics you need
- ✅ Read USER NOTES first (highest priority)
- ✅ Follow file paths and line ranges exactly
- ✅ Update session summaries as work progresses
- ✅ Create passover files at end of work
- ✅ Honor warnings about broken things

**DON'T:**
- ❌ Skip memory searches ("I'll just read files")
- ❌ Ignore USER NOTES section
- ❌ Assume you have all context without searching
- ❌ Rediscover solutions that are already indexed
- ❌ Create vague passover files
- ❌ Forget to run `/session-summary`

### For Ben

**DO:**
- ✅ Edit passover files after generation (USER NOTES)
- ✅ Add external context agents couldn't know
- ✅ Flag things for next agent to investigate
- ✅ Adjust priorities in next steps
- ✅ Export Zed sessions at logical stopping points

**DON'T:**
- ❌ Rely only on agent-generated content
- ❌ Skip adding context from outside sessions
- ❌ Let passover files accumulate without review

---

## Success Criteria

### Good Passover File

**Characteristics:**
- ✅ Specific file paths (not "read the config")
- ✅ Memory searches with reasoning (why each search matters)
- ✅ Exact JSONL line ranges (not "review the session")
- ✅ Actionable instructions (not vague summaries)
- ✅ Clear warnings about broken things
- ✅ Focused next steps
- ✅ USER NOTES section ready for manual additions

### Bad Passover File

**Characteristics:**
- ❌ Vague instructions ("catch up on what happened")
- ❌ No memory searches specified
- ❌ No file paths or line numbers
- ❌ Generic context ("we made progress")
- ❌ No warnings about problems
- ❌ Missing next steps

---

## Quick Reference

### File Naming Convention (CURRENT STANDARD)

**⚠️ IMPORTANT: Always use DOTS for dates, not dashes!**

**Correct:** `25.11.19` ✅
**Wrong:** `25-11-19` ❌

```
CURRENT FORMAT (Nov 2025):
YY.MM.DD-[N] - [Descriptive-Name].md
^^^ ^^^ ^^  (DOTS for dates!)

Examples:
00-SYSTEM-OVERVIEW-EVERGREEN.md                         # Master overview (read first)
25.11.19-3 - API-Credential-Search-ClickUp-Testing.md   # Session work file
25.11.19-2 - ClickUp-Section-2-Integration.md           # Session work file
25.11.19-1 - Phase-1-Documentation-Update.md            # Session work file
25.11.13-2 - API-Expert-Doc-from-code.md                # Session work file

LEGACY FORMAT (Being Phased Out):
25-11-13 | APR Ses-13.md                                # Old format (dashes + pipe)
25-11-02 | APR Ses-12.md                                # Old format
```

**Date Format Rules:**
- ✅ CURRENT: `25.11.19` (Year.Month.Day with DOTS)
- ❌ OLD: `25-11-19` (dashes - legacy format)
- ❌ WRONG: `11-19-25` (wrong order)

**Numbering:**
- Multiple sessions same day: `-1`, `-2`, `-3`
- Example: `25.11.26-1`, `25.11.26-2`, `25.11.26-3`

### Memory Search (Updated Protocol)

**PRIMARY (Use 90%):**
```bash
/check-all-memory "[keywords]"                    # Search ALL sessions (always current)
/check-all-memory "APR Dashboard"                 # Broad project search
/check-all-memory "valcre field mapping"          # Specific topic
/check-all-memory "clickup auto-creation"         # Feature search
```

**FALLBACK (Use 10%):**
```bash
mcp__cognee__search "query" GRAPH_COMPLETION      # Vague/conceptual queries
```

**LEGACY (Being phased out):**
```bash
pmem "[query]"                                    # Old indexed search (prefer /check-all-memory)
```

### Commands

```bash
/session-summary                  # Create passover file (auto-detect)
/session-summary 12               # Specify session number
/session-summary 12 auth-deploy   # Full specification
/session-summary --skip-memory    # Skip memory ingestion
```

---

## Troubleshooting

### Can't find previous session

```bash
ls -la .passover-session/
grep -l "search term" .passover-session/*.md
```

### Session numbers unclear

**Check latest:**
```bash
ls -t .passover-session/ | head -1
```

**Next number:** Latest + 1

### Memory search returns errors

**"Failed to parse" warnings:**
- Cosmetic issue (tool returns text not JSON)
- Check `raw_output` field for results
- New vectors work fine
- Old vectors may have missing fields (cleanup planned)

### Missing context

**If you feel lost:**
1. Read latest passover file
2. Run ALL memory searches listed
3. Review JSONL sections specified
4. Search additional topics
5. Read files listed
6. Check USER NOTES

**Don't start working without context.**

---

## Related Systems

### Official Document Management

**Pattern:** `_official-[document-type]/` folders for QC-verified deliverables

**Integration:**
- Passover files point to official documents
- Official folders referenced in session work
- REVIEW-STATUS.md documents verification
- Both provide context for next agent

**See:** `_official-systems-guide/README.md` for details

### Project Documentation

**Pattern:** `.docs/` folder for project-specific documentation

**Integration:**
- Passover files live in `.docs/-passover | work-sessions/`
- Section-specific docs in numbered folders
- Planning docs in `.docs/Planning/`
- Status docs in `.docs/Project-status/`

**See:** `.docs/README.md` for project structure

---

## Summary

**Three knowledge sources:**
1. **Passover files** → Treasure maps (what to read, what to search)
2. **Memory system** → `/check-all-memory [keywords]` (PRIMARY - 90% of searches)
3. **JSONL logs** → Raw conversation context

**The workflow:**
1. Read passover file (start with `00-SYSTEM-OVERVIEW-EVERGREEN.md`)
2. Run `/check-all-memory` searches (broad first, then specific)
3. Review JSONL sections if needed
4. Read specific files listed
5. Check USER NOTES
6. Work with complete context

**The output:**
- Create focused passover file via `/session-summary`
- Extract learnings to memory (auto)
- Next agent picks up seamlessly

**You're not a file reader. You're a knowledge retriever using multiple sources.**

---

**This is the single source of truth for session continuity.**

**Maintained by:** Ben, Claude (multiple instances)
**Version:** 2.1 (Added Master Evergreen Overview + Fixed to ACTUAL Current Standard: DOTS not dashes)
**Last Updated:** November 26, 2025
