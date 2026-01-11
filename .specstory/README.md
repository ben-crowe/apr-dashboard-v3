# SpecStory - Conversation History & Documentation

This directory contains automatically captured Cursor AI conversation sessions.

## Quick Start

### View Recent Sessions
```bash
ls -lt .specstory/history/ | head -5
```

### Search for Topics
```bash
# Find sessions about a specific feature
grep -l "image configurator" .specstory/history/*.md

# Find sessions that modified a file
grep -l "ImageConfiguratorDemo.tsx" .specstory/history/*.md
```

### Reference in Cursor
When chatting with Cursor AI, reference a past session:
```
@.specstory/history/2026-01-06_22-45Z-image-page-configurator-color-discrepancy.md
```

## What Gets Captured

Each session file contains:
- **User queries** - What you asked
- **AI responses** - What the AI suggested
- **Tool usage** - Code searches, file reads, edits
- **Code changes** - Files modified, implementations
- **Terminal output** - Command results
- **Session metadata** - Timestamp, model, session ID

## File Naming Convention

Files are named: `YYYY-MM-DD_HH-MMZ-description.md`

Example: `2026-01-06_22-45Z-image-page-configurator-color-discrepancy.md`

## Current Status

- ✅ **Active**: SpecStory is capturing sessions
- 📁 **Location**: `.specstory/history/`
- 📊 **Total Sessions**: Check with `ls .specstory/history/ | wc -l`
- 📅 **Latest**: Most recent file shows last capture time

## Usage Examples

### Example 1: Find How a Bug Was Fixed
```bash
# Search for sessions mentioning the bug
grep -r "color discrepancy" .specstory/history/
```

### Example 2: Review Implementation Approach
```bash
# Find sessions about TDD dashboard
grep -l "TDD Dashboard" .specstory/history/*.md
```

### Example 3: Load Past Context in Cursor
In a Cursor chat, reference a past session:
```
Can you review what we did in @.specstory/history/2026-01-05_04-38Z-tdd-page-data-loading-issue.md 
and apply the same approach to fix the current issue?
```

## Configuration

- See `.what-is-this.md` for detailed explanation
- See `.project.json` for project metadata and settings

## Privacy

- History files are **excluded from git** by default
- Files are stored locally only
- You can manually commit specific sessions if needed

---

*For more information, see `.what-is-this.md`*
