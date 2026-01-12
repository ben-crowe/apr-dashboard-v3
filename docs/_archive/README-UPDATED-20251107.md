# APR Dashboard - Project Index & Workflow Guide

**Last Updated:** November 7, 2025
**Project Status:** Active Development
**Current Focus:** ClickUp Integration • Valcre Sync Issues

---

## 📖 HOW TO USE THIS PROJECT (READ THIS EVERY SESSION!)

**Dear Agent (that's you!),**

When you start a new session, here's your workflow:

1. **✅ YOU JUST READ THIS FILE** - Good! This is the project-level README
2. **📂 CHECK THE SECTION INDEX BELOW** - See what we worked on last
3. **📄 NAVIGATE TO THAT SECTION'S README** - Get full current state and context
4. **🚀 START WORKING** - You now have complete context!

**Example:**
- This README says: "Last worked on: 03-ClickUp-Integration"
- You navigate to: `.docs/03-ClickUp-Integration/README.md`
- You read the current state, config, known issues, next steps
- You're ready to continue where we left off!

---

## 📋 DOCUMENTATION STRATEGY (IMPORTANT!)

**README.md = Source of Truth**
- Each section has a README.md that's the ONLY file you need to read
- README shows: Current State, Configuration, Known Issues, Next Steps
- Always update the README when work is done
- This is what Cursor and other agents naturally read first

**Session Continuity:**
- Session handoff notes exist in `.docs/-passover | work-sessions/` folder
- Use the `/session-summary` command for proper session documentation
- README files contain current state, not session history

**Why this works:**
- One file to read = fast onboarding
- Always up-to-date (we update it as we work)
- No hunting through old sessions
- Clear handoff between agents

---

## 📊 PROJECT STATE OVERVIEW

### What's Working ✅
- **Form Submissions:** Both APR Dashboard + Valta Website forms working
- **ClickUp Auto-Creation:** Form submission → ClickUp task (LIVE!)
- **Database:** Supabase, migrations applied, triggers working
- **Deployments:** Vercel CLI for fast deploys (~5 seconds)

### In Progress 🔄
- **Valcre Sync UX:** Needs improvement (annoying popups, sync before job exists)
- **Field Mapping:** Some fields not mapping correctly to Valcre
- **Test Coverage:** Need comprehensive test plan for Valcre integration

### Planned 📋
- Silent sync indicator (remove popups)
- Mock Valcre API for testing
- Complete field validation
- Email integration (Resend sandbox limitations)

---

## 🗂️ SECTION INDEX (Active Work Areas)

### Last Worked On: **03-ClickUp-Integration** (Nov 6, 2025 - Evening)
**Status:** ✅ Auto-Creation LIVE and Working
**README:** `.docs/03-ClickUp-Integration/README.md`
**Summary:**
- Auto-creation trigger fully working end-to-end
- Database trigger with proper auth, pg_net enabled
- Bidirectional links tested and working
- Button color changed to blue, checkbox removed
- Ready for production use in test workspace

**Known Issues for Next Session:**
- Frontend `clickup.ts` has old token (401 errors)
- See section README for full details

---

### 01 - Client Form Submission
**Status:** ✅ Working
**README:** `.docs/01-Client-Form-Submission/README.md`
**Last Update:** Nov 6 (checkbox removed, Property Type required)
**Summary:** Both forms (APR Dashboard + Valta Website) submitting successfully

---

### 02 - Pipedrive CRM
**Status:** 📋 Not Started
**README:** `.docs/02-Pipedrive-CRM/README.md`

---

### 03 - ClickUp Integration ⭐ **CURRENT FOCUS**
**Status:** ✅ Auto-Creation Complete
**README:** `.docs/03-ClickUp-Integration/README.md`
**Last Update:** Nov 6, 2025 (Evening)
**Summary:** Auto-creation working, both directions tested, production-ready

---

### 04 - APR Dashboard
**Status:** ✅ Working
**README:** `.docs/04-APR-Dashboard/README.md`
**Summary:** Core dashboard functional, deployed to Vercel

---

### 05 - Document Management
**Status:** 🔄 In Progress
**README:** `.docs/05-DOC-MANAGEMENT/README.md`
**Summary:** File uploads working, bucket warnings in console

---

### 06 - LOE Generator
**Status:** 🔄 In Progress
**README:** `.docs/06-LOE-Generator/README.md`

---

### 07 - Valcre Integration 🎯 **NEXT PRIORITY**
**Status:** ⚠️ Working but needs UX fixes
**README:** `.docs/07-Valcre-Integration/README.md`
**Known Issues:**
- Annoying sync popups on every field change
- Syncing before job exists (no VAL number yet)
- Empty patch errors from Valcre API
- Comments field mapping incorrectly
- See: `.docs/Issues/valcre-sync-issues.md`

---

### 08 - Client Email Sequence
**Status:** 📋 Planned
**README:** `.docs/08-Client-Email-Sequence/README.md`
**Notes:** Resend sandbox domain limitations

---

### 09 - Houski Integration
**Status:** 🔄 In Progress
**README:** `.docs/09-Houski-various/README.md`

---

### 10 - Document Hub
**Status:** 🔄 In Progress
**README:** `.docs/10-Document-Hub/README.md`

---

### 11 - Comp Calculator
**Status:** 📋 Planned
**README:** `.docs/11-Comp Calculator/README.md`

---

### 12 - Document Extraction
**Status:** 📋 Planned
**README:** `.docs/12-Document-Extraction/README.md`

---

### 13 - Report Generator
**Status:** 📋 Planned
**README:** `.docs/13-Report-Generator/README.md`

---

## 🔄 WORKFLOW REMINDERS

### Starting a New Session
```
1. Open project at: /Users/bencrowe/Development/APR-Dashboard-v3/
2. Read: .docs/README.md (this file)
3. See: "Last worked on: 03-ClickUp-Integration"
4. Navigate to: .docs/03-ClickUp-Integration/README.md
5. Read the current state, config, issues
6. You're ready to work!
```

### During Work
```
1. Make changes to code/config
2. Test the changes
3. Update the section's README.md with what you did
4. Update this project README if switching focus areas
```

---

## 📁 PROJECT STRUCTURE

```
/APR-Dashboard-v3/
├── .docs/
│   ├── README.md                          ← YOU ARE HERE (Project Index)
│   ├── -passover | work-sessions/         ← Session continuity (use /session-summary)
│   ├── Planning/                          ← Planning docs, Systems Guide
│   ├── Project-status/                    ← Current Build Report, status docs
│   ├── Test-plans/                        ← Test plans and specs
│   ├── Issues/                            ← Bug tracking
│   ├── 01-Client-Form-Submission/         ← Section-specific docs
│   ├── 03-ClickUp-Integration/            ← Section-specific docs
│   ├── 07-Valcre-Integration/             ← Section-specific docs
│   └── [sections 02-13...]                ← Other section folders
├── src/                                   ← Code
├── supabase/                              ← Database & Edge Functions
└── tests/                                 ← Playwright tests
```

---

## 🎯 NEXT SESSION PRIORITIES

### ✅ COMPLETED: Current Build Report Generated!

**Comprehensive system overview created:** `.docs/Project-status/Current-Build-Report.md`

**What it includes:**
- Complete end-to-end flow diagram
- What works vs what's broken (detailed breakdown)
- Integration status table (all 10 external services)
- 7 Valcre bugs documented with fix locations
- Phase completion: ~85% complete

---

### 🔴 URGENT: Test Results Show New Issues!

**Automated tests just completed with failures:**

1. **Checkbox Still Exists on Production Form** ❌
   - Previous session believed it was removed
   - Tests confirm: checkbox still present on deployed form
   - **Impact:** May cause Valcre duplicate contacts issue
   - **Fix:** Verify deployment, ensure correct code is live

2. **Property Type Field Selector Issue** ❌
   - Test looking for `[id="propertyType"]` (singular)
   - Form may have `propertyTypes` (plural) or different structure
   - Causes timeout in automated tests
   - **Fix:** Update test selector OR verify form field ID

**Test Location:** `tests/test-form-submission.spec.ts`

---

### 📋 NEW: Section Cleanup Plan Created

**Comprehensive review plan:** `.docs/Planning/SECTION-CLEANUP-PLAN.md`

**Purpose:** Survey all 13 sections, standardize format, plan review sessions

**Sections Surveyed:**
- ✅ Section 01: Client-Form-Submission (clean)
- ✅ Section 02: Pipedrive-CRM (fixed folder name)
- 🔍 Sections 03-13: Need survey and review

**Next Action:** Go through sections together, section by section

---

### Immediate (Next Session)
1. **Fix Valcre Sync UX** (Section 07)
   - Remove annoying popups
   - Add silent sync indicator
   - Disable sync until VAL number exists
   - Filter empty patches

2. **Update Frontend ClickUp Token** (Section 03)
   - File: `src/utils/webhooks/clickup.ts`
   - New token: `pk_10791838_PA9IIZZQVZDSGCUO73ZDXYXEIPQKZLVM`

3. **Section-by-Section Reviews**
   - Use SECTION-CLEANUP-PLAN.md as guide
   - Priority: Valcre → ClickUp → LOE → Others

### Soon
- Investigate Property Type auto-fill from Test Data button
- Create mock Valcre API for testing
- Comprehensive Valcre field mapping validation

---

## 📝 NOTES & REMINDERS

**For Agents:**
- Always read the README first (this is your context!)
- README has everything you need to start work
- Update README as you work - it's the handoff to next agent
- Use section folders to organize work by feature
- Project README (this file) = index only, section READMEs = details

**For Ben:**
- Start sessions at project level: `/APR-Dashboard-v3/`
- Agent will navigate to correct section automatically
- README shows what was worked on last
- Clear next steps always documented

---

## 🔗 QUICK LINKS

**Project:**
- Project Root: `/Users/bencrowe/Development/APR-Dashboard-v3/`
- Documentation: `/Users/bencrowe/Development/APR-Dashboard-v3/.docs/`
- Planning: `/Users/bencrowe/Development/APR-Dashboard-v3/.docs/Planning/`
- Current Status: `/Users/bencrowe/Development/APR-Dashboard-v3/.docs/Project-status/`

**Related Projects:**
- Valta Website: `/Users/bencrowe/Development/Valta-Website/`

**Deployments:**
- APR Dashboard: `https://apr-dashboard-v3.vercel.app`
- Valta Website: `https://valta.ca`

---

**Remember:** This README is your map. Section READMEs are your detailed guides. Read both, then work! 🚀
