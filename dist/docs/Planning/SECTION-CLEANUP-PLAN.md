# Section Cleanup Plan - All 13 Sections

**Created:** November 6, 2025 (Evening)
**Purpose:** Survey current state of all sections, plan cleanup sessions
**Status:** Assessment Complete - Ready for Section-by-Section Reviews

---

## Overview

**13 Active Sections** to review and standardize:
- 01-Client-Form-Submission
- 02-Pipedrive-CRM
- 03-ClickUp-Integration
- 04-APR-Dashboard
- 05-DOC-MANAGEMENT
- 06-LOE-Generator
- 07-Valcre-Integration
- 08-Client-Email-Sequence
- 09-Houski-various
- 10-Document-Hub
- 11-Comp Calculator
- 12-Document-Extraction
- 13-Report-Generator

**Standard Format:**
```
/Section Plans/[Section-Name]/
├── README.md                          ← Source of truth
├── 00-[reference-doc].md             ← Numbered work files
├── 01-[spec].md
├── [supporting folders]/             ← test-scripts, config, etc.
└── -passover | work-session/         ← Session history (optional)
```

---

## Section-by-Section Assessment

### ✅ Section 01: Client-Form-Submission
**Status:** CLEAN - Already follows standard

**Current Structure:**
```
01-Client-Form-Submission/
├── README.md                                    ✅
├── 01-FORM-FIELD-MAPPING.md                    ✅
├── 01.1-FORM-FIELD-MAPPING.md                  ⚠️ Duplicate?
├── 02-EMAIL-NOTIFICATION-FLOW.md               ✅
├── 03-INTEGRATION-ARCHITECTURE.md              ✅
├── VISUAL-FORM-TEMPLATE.md                     ✅
├── img-APR Dashboard.png                       ✅
├── img-APR-Dashboard-client-section.png        ✅
├── img-valta.ca:request-appraisal.png          ✅
└── -passover | work-session/                   ✅
```

**Issues:**
- ⚠️ Two field mapping files (01 and 01.1) - which is current?

**Review Questions:**
1. Is 01.1 an updated version or different content?
2. Should we archive the old one?
3. README current and accurate?

**Cleanup Actions:**
- [ ] Clarify duplicate field mapping files
- [ ] Review README for accuracy
- [ ] Verify all images still relevant

---

### ✅ Section 02: Pipedrive-CRM
**Status:** CLEAN - Fixed folder name

**Current Structure:**
```
02-Pipedrive-CRM/
├── README.md                                    ✅
├── 01-pipedrive-research-october-2025.md       ✅
└── -passover | work-session/                   ✅ (just renamed)
```

**Issues:** None - clean and organized

**Review Questions:**
1. Is Pipedrive integration still planned?
2. Any new research to add?
3. Business requirements clarified yet?

**Cleanup Actions:**
- [ ] Review README against current priorities
- [ ] Add notes about blockers/next steps

---

### 🔍 Section 03: ClickUp-Integration
**Status:** NEEDS REVIEW - Many work files, check for `00-` prefix

**Quick Survey Needed:**
- Check if README has `00-` prefix
- Verify `-passover-sessions/` vs `-passover | work-session/`
- Review if all work files are current

**Review Questions:**
1. Are all 7+ work files still relevant?
2. Should test-scripts be a subfolder?
3. Validation status in README or separate file?

**Cleanup Actions:**
- [ ] Survey current files
- [ ] Standardize folder names
- [ ] Update README with Nov 6 completion status (already done?)

---

### 🔍 Section 04: APR-Dashboard
**Status:** UNKNOWN - Needs survey

**Expected to find:**
- README (check for `00-` prefix)
- Dashboard architecture docs
- Component documentation
- UI/UX specifications

**Review Questions:**
1. What's documented vs what's actually in code?
2. Is this general dashboard docs or specific feature?
3. Overlap with other sections?

**Cleanup Actions:**
- [ ] Survey current contents
- [ ] Determine scope of this section
- [ ] Check for session folder

---

### 🔍 Section 05: DOC-MANAGEMENT
**Status:** UNKNOWN - Needs survey

**Expected to find:**
- Document upload/storage documentation
- Supabase Storage configuration
- File handling workflows
- RLS policies

**Review Questions:**
1. Current implementation status?
2. Bucket configuration documented?
3. Known issues (console warnings mentioned)?

**Cleanup Actions:**
- [ ] Survey current contents
- [ ] Document current state
- [ ] Add session folder if missing

---

### 🔍 Section 06: LOE-Generator
**Status:** UNKNOWN - Needs survey

**Expected to find:**
- LOE template documentation
- 4-page HTML structure
- Field mapping (22 fields)
- Generation workflow

**Review Questions:**
1. Template current and accurate?
2. Field mapping complete?
3. Preview functionality documented?

**Cleanup Actions:**
- [ ] Survey current contents
- [ ] Verify field mappings match code
- [ ] Add session folder if missing

---

### 🔍 Section 07: Valcre-Integration
**Status:** HIGH PRIORITY - 7 production bugs

**Expected to find:**
- README with current status
- Field mapping documentation
- API integration specs
- Known issues (7 bugs)

**Review Questions:**
1. Are 7 bugs from STATE-OF-THE-UNION documented here?
2. Field mapping table complete?
3. Test plan exists?

**Cleanup Actions:**
- [ ] Survey current contents
- [ ] Add 7 bug documentation
- [ ] Create field mapping work file
- [ ] Plan bug fix sessions

---

### 🔍 Section 08: Client-Email-Sequence
**Status:** UNKNOWN - Resend sandbox limitations

**Expected to find:**
- Email templates
- Send flow documentation
- Resend API integration
- Sequence timing/triggers

**Review Questions:**
1. How many emails in sequence?
2. Which are implemented?
3. Domain verification status?

**Cleanup Actions:**
- [ ] Survey current contents
- [ ] Document implemented vs planned emails
- [ ] Add sandbox limitation notes

---

### 🔍 Section 09: Houski-various
**Status:** UNKNOWN - Property data integration

**Expected to find:**
- Houski API documentation
- Data validation workflows
- Field mapping
- Integration architecture

**Review Questions:**
1. Is Houski integration started?
2. API credentials available?
3. Use cases defined?

**Cleanup Actions:**
- [ ] Survey current contents
- [ ] Document integration status
- [ ] Add session folder if missing

---

### 🔍 Section 10: Document-Hub
**Status:** UNKNOWN - Advanced document features

**Expected to find:**
- Document categorization
- Municipal website gathering
- PDF extraction AI
- Export functionality

**Review Questions:**
1. What's implemented vs planned?
2. Overlap with Section 05 (DOC-MANAGEMENT)?
3. Clear scope distinction?

**Cleanup Actions:**
- [ ] Survey current contents
- [ ] Clarify scope vs Section 05
- [ ] Document current state

---

### 🔍 Section 11: Comp Calculator
**Status:** PLANNED - Ready to integrate

**Expected to find:**
- Calculator specifications
- Income/Sales/Cost approach docs
- Integration plan
- Location of external code

**Review Questions:**
1. Is external code at `/APR-Dashboard-v2-Res/01-APR-Resources/08-Calculator/`?
2. Integration complexity?
3. Priority level?

**Cleanup Actions:**
- [ ] Survey current contents
- [ ] Link to external code location
- [ ] Create integration spec if missing

---

### 🔍 Section 12: Document-Extraction
**Status:** PLANNED - AI-powered

**Expected to find:**
- PDF extraction specs
- AI model documentation
- Field extraction mapping
- Integration architecture

**Review Questions:**
1. Any work done on this?
2. AI service chosen?
3. Use cases defined?

**Cleanup Actions:**
- [ ] Survey current contents
- [ ] Document if section is empty
- [ ] Plan research if needed

---

### 🔍 Section 13: Report-Generator
**Status:** READY TO INTEGRATE - 233 files external

**Expected to find:**
- Integration plan with external system
- Field mapping (265+ inputs)
- USPAP compliance docs
- Location of external code

**Review Questions:**
1. Is external code at specific location?
2. Integration approach decided?
3. Timeline for integration?

**Cleanup Actions:**
- [ ] Survey current contents
- [ ] Link to external codebase
- [ ] Create integration roadmap

---

## Cleanup Workflow Plan

**Phase 1: Survey (NEXT)**
- Go through sections 03-13
- Document what exists in each
- Note issues and questions
- Estimate cleanup effort

**Phase 2: Section Reviews (TOGETHER)**
- Review each section with Ben
- Answer questions
- Make cleanup decisions
- Update READMEs

**Phase 3: Standardization**
- Apply standard format to all sections
- Rename files as needed
- Add missing folders
- Archive outdated content

**Phase 4: Documentation**
- Update all READMEs
- Add review notes
- Link sections together
- Update project README

---

## Priority Sections for Cleanup

**High Priority (Active Work):**
1. Section 07 - Valcre Integration (7 production bugs)
2. Section 03 - ClickUp Integration (just completed)
3. Section 06 - LOE Generator (production use)

**Medium Priority (Planned Soon):**
4. Section 08 - Client Email Sequence
5. Section 09 - Houski Integration
6. Section 04 - APR Dashboard

**Lower Priority (Future):**
7. Section 05 - DOC-MANAGEMENT
8. Section 10 - Document Hub
9. Section 11 - Comp Calculator
10. Section 12 - Document Extraction
11. Section 13 - Report Generator

---

## Next Steps

1. **Complete Survey** - Finish documenting Sections 03-13
2. **Create Review Schedule** - Plan session for each section
3. **Start with High Priority** - Section 07 (Valcre) first
4. **Work Through List** - Section by section with Ben

---

## Questions to Answer in Each Section Review

**Standard Questions:**
1. What's the current implementation status?
2. What work files exist and are they current?
3. Are there session summaries or just README?
4. What needs to be documented that isn't?
5. What's outdated and can be archived?
6. What's the next session priority for this section?

**Section-Specific Questions:**
- See individual section notes above

---

**Status:** Assessment in progress
**Next Action:** Survey remaining sections (03-13)
**Ready For:** Section-by-section review sessions with Ben
