# 04 - Job & Client Management (Master Overview)

> **AUDIT TIMESTAMP:** 2026-03-03  
> **STATUS:** Feature Completed (V3 Production) & Consolidated  
> **WARNING:** The contents of this folder are largely **historical** and contain outdated explorations, session notes, and deprecated planning. **DO NOT** treat the individual files in this folder as current architectural truth.

---

## The App's Current Truth (Read This First)

The functional reality of Job & Client Management has evolved drastically since the files in this folder were written. The absolute, authoritative source of truth for how this feature operates today lives in the master **[UNIFIED-ARCHITECTURAL-TRUTH.md](../../Architecture/UNIFIED-ARCHITECTURAL-TRUTH-DRAFT.md)**. 

If you are an agent looking for how Job Management works, refer to the Master Unified Document, specifically:
- **Section 1 (System Overview):** Client Intake 
- **Section 2 (Data Models):** `job_submissions` and `job_loe_details` tables.
- **Section 3 (External Integrations):** ClickUp synchronizations (post-Valcre creation) and Resend Email automations.
- **Section 3.5 (LOE Pipeline):** The generation and DocuSeal bypassing logic for LOEs.

---

## Folder Junk Filter (What is in here?)

This folder currently houses over 150 legacy files. **Treat 95% of them as deprecated context.**

### 🛑 Ignore These (Historical Junk)
- `session-notes/` (123 files): These are raw, unstructured Agent chat logs from when the ClickUp integration and E-signature pipelines were originally being hammered out across dozens of sessions. They contain outdated API mappings and failed experiments. Do not read them to understand the current app state.
- `-passover-sessions/`: Similar to session notes; legacy handoff logs.
- `Validation-Analysis.md`, `VALTA-Clickup-job-board-Review.md`, etc.: Deprecated planning exercises.
- `LOE Contract.md`: An old draft. The real LOE contract truth lives dynamically in the codebase (`v3Template.ts`) as documented in the Master Unified Truth doc.

### 🟡 Potentially Useful (Reference Only)
- `DOMAIN-CLICKUP-EXPERT.md` & `CLICKUP-API-PATTERNS-REFERENCE.md`: Deep technical specifications for ClickUp's idiosyncratic API. Useful *only* if you are currently writing new ClickUp integration scripts and need API documentation references.
- `SOP-CREATE-CLICKUP-SUBTASKS.md` & `LESSONS-LEARNED-CLICKUP-SUBTASKS.md`: Important lessons on why subtasks fail to trigger ClickUp automations (a quirk of ClickUp's internal engine).

---

## Conclusion
This feature is a core pillar of the V3 system and is actively in production. However, its architecture has been cleanly abstracted into the unified app model. **Do not root around in this folder looking for how ClickUp, Valcre, or Resend works today.** Follow the Unified Truth document.
