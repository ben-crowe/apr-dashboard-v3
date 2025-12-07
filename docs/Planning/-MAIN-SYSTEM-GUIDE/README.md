# Official Document Repository

**This folder contains QC-verified, production-ready documents.**

## Purpose

This is a **universal system** for managing official documents across all projects:
- Separates verified deliverables from work-in-progress
- Provides clear quality control status
- Prevents accidental modification of approved documents
- Self-documents review history and current state

---

## Current Document

**File:** `APR-Systems-Guide-v3.1.md`  
**Status:** ✅ QC Verified - Ready for use  
**Last Reviewed:** November 2, 2025  
**Reviewed By:** Marcel Orchestrator

For complete status details, see `REVIEW-STATUS.md` in this folder.

---

## Files in This Folder

### 1. README.md (this file)
- Folder purpose and universal system overview
- Quick reference for current document
- Usage guidelines

### 2. [Document Name]
- THE official document for this topic
- QC-verified and approved for use
- Single source of truth

### 3. REVIEW-STATUS.md
- Complete QC verification history
- Recent changes log with details
- Pending items and future work
- Verification methodology

---

## Universal System Rules

### ✅ DO:
- **Read** this document for accurate information
- **Reference** in your work with confidence
- **Trust** as verified source of truth
- **Check** REVIEW-STATUS.md for current state

### ❌ DON'T:
- **Edit** directly (use work-in-progress folder)
- **Deploy sub-agents** to this folder
- **Move documents** here without QC verification
- **Assume** it's current (always check REVIEW-STATUS.md)

---

## Universal Workflow

This system works the same across ALL projects:

### For Sub-Agent Work:
```
1. Sub-agent works in: ../_work-in-progress/
2. Orchestrator performs QC verification
3. If approved → Move to: _official-[document-type]/
4. Update REVIEW-STATUS.md with verification notes
5. Note in session passover: "[doc] QC verified"
```

### For Document Updates:
```
1. Changes requested
2. Sub-agent creates new version in _work-in-progress/
3. QC verification by orchestrator
4. Old version archived to: ../_versions-[document-type]/
5. New version moves to official folder
6. REVIEW-STATUS.md updated
```

### Quality Control Protocol:
```
1. Read output document completely
2. Cross-reference against requirements checklist
3. Verify completeness (all items done?)
4. Verify accuracy (done correctly?)
5. Report findings with specifics
6. Mark as "QC Verified" if approved
7. Move to official folder with status notes
```

---

## Folder Naming Convention

This system uses descriptive folder names:

**Pattern:** `_official-[document-type]/`

**Examples:**
- `_official-systems-guide/` ← Architecture & systems docs
- `_official-api-docs/` ← API documentation
- `_official-runbooks/` ← Operational procedures
- `_official-standards/` ← Coding standards & conventions
- `_official-requirements/` ← Product requirements

**Use underscores** to keep folders sorted at top of directory listings.

---

## Integration with Session Management

This system **complements** the session passover system:

**Session Passover Files** (`.passover-session/`):
- Track session work history
- Document decisions and discoveries
- Provide continuity between agents
- **Process-focused**

**Official Document Folders** (`_official-*/`):
- Hold verified deliverables
- Track QC status
- Protect approved documents
- **Product-focused**

**They work together:**
- Session notes point to official documents
- Official folder status referenced in passover files
- Both provide full context for next agent

---

## Quick Reference

### Need current information?
→ Read the document in this folder

### Check document status?
→ Read `REVIEW-STATUS.md`

### See what changed recently?
→ Check `REVIEW-STATUS.md` > Recent Changes

### Find old versions?
→ Check `../_versions-[document-type]/` folder

### Need to make changes?
→ Work in `../_work-in-progress/` then request QC

---

## Verification Standards

Documents in this folder have been verified for:

✅ **Completeness** - All required sections present  
✅ **Accuracy** - Content matches reality/requirements  
✅ **Consistency** - No internal contradictions  
✅ **Clarity** - Professional, clear language  
✅ **Currency** - Information is up-to-date  

See `REVIEW-STATUS.md` for specific verification details.

---

**Universal System Version:** 1.0  
**Last Updated:** November 2, 2025  
**Applies To:** All projects using session-based AI workflows
