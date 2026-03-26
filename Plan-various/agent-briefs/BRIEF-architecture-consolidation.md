Exactly, there you go.Don't worry about slower, I'm not in a# BRIEF: Unified Architecture Drafting Session

**Target Agent:** Documentation Engineer / Co-Architect
**Project:** APR Dashboard V3
**Status:** Ready for execution in a dedicated session.

## Context & Background
The project's architectural documentation is currently scattered across multiple massive files (e.g., `APR-V4-ARCHITECTURE.md`), feature folders (`07-Report-Builder`, `Calculator Engine`), and JSONL session logs (ClickUp, Resend). 
To optimize for Gemini/Cognee ingestion later, we are moving to a modular structure. However, before componentizing, we must first consolidate everything into a single, unified "Truth Draft" for the USER to review, test, and vet.

## The Mission
Your job in this new session is to act as the Architectural Compiler and Q&A partner for the USER.

**Step 1. Deep Dive Search (Methodology):**
To systematically cross-reference static docs against recent session work without asking the USER questions, you MUST use the following methods:
1. **JSONL Breadcrumb Search:** Run `~/.claude/scripts/search-local "<keyword>" --limit 5 --extract --full` via bash to search past session logs for recent decisions.
   - *Example:* `~/.claude/scripts/search-local "APR-Dashboard-v3 Resend email" --limit 5 --extract --full`
   - *Example:* `~/.claude/scripts/search-local "APR-Dashboard-v3 ClickUp Valta" --limit 5 --extract --full`
   - **CRITICAL:** Always use `--full`. Do not take shortcuts; thoroughness is more important than speed.
2. **File Discovery:** Use your `find_by_name` tool to locate scattered documentation blocks.
   - *Example:* Search for `*calc*`, `*resend*`, or `*clickup*` inside `docs/` and `src/`.
3. **Codebase Reality Check:** Use `grep_search` or `view_file` to verify if the architecture docs match the codebase reality.
   - *Example:* `grep_search` for `report_builder_data` inside `supabase/migrations/` or `src/features/`.
4. **Compile the Evidence:** Read the files you mapped out (especially in `docs/Features/07-Report-Builder/` and the Calculator Engine folders). Treat the JSONL logs and the codebase as the ultimate source of truth over older Markdown files.

**Step 2. Build the Draft:**
- Populate the `docs/Architecture/UNIFIED-ARCHITECTURAL-TRUTH-DRAFT.md` file. Ensure everything from data models to ClickUp flows to the Calculator Engine is captured.

**Step 3. The Review & Q&A Testing Phase:**
- **CRITICAL:** Do NOT ask the USER questions during the drafting process. Be exhaustive and thorough on your own. Only present the draft *after* you consider it 100% compiled from available context.
- Once you present the full draft, the USER will test you and ask clarification questions.
- They will ask questions like: *"Where is the Resend capability documented?"* or *"Did you capture the Calculator Engine mappings?"*
- You must respond with exact locations in the draft (e.g., "Yes, it is in Section 4.2"), or immediately investigate the gap and add it if you missed it.

## Strict Rules
1. **NO ARCHIVING:** Do not delete or archive any existing documentation yet.
2. **NO INGESTION:** Do not ingest anything into Gemini or Cognee until the USER explicitly signs off on the final unified document.
3. **ONLY ADD:** Compile and structure. If there are conflicts, ask the USER for the source of truth.
