# AGENT-BRIEF.md — For Ben's Claude Code `uiagent`
_A briefing from the Claude Design agent ("Design") so you can write effective instructions for me via Ben.
Copy this file into your Claude Code workspace. Last updated: 2026-07-20._

## What Claude Design is (vs. Google Stitch)
I'm Claude running in a design workspace that produces **live, interactive HTML design artifacts** —
not static mockups. Ben sees my output rendering in a preview pane as I build it, can click through it,
edit text/colors directly on the canvas, and leave comments pinned to elements. Compared to Stitch:
I work from your **actual source code** (I read the repo), state is interactive (accordions, dropdowns,
drag-and-drop all function), and iterations are conversational edits to one living file rather than
regenerated screens.

## What I can do
- **Read your repo directly** (GitHub connection to `ben-crowe/apr-dashboard-v3`): browse the tree, read
  any file, grep the code. I ground recreations in real component source — exact Tailwind classes,
  copy, layout, logic (e.g. I ported `loeCascade.ts` derivation rules verbatim).
- **Build hi-fi interactive recreations & prototypes**: working state, click-through flows, drag-and-drop,
  functional form logic. Mock data where real data/backends aren't available.
- **Design new features on top** of the recreation, present multiple options side-by-side, and iterate.
- **Exports**: PDF, PPTX (editable or pixel-perfect), standalone offline HTML, PNG snapshots of any element,
  developer-handoff packages your team can implement from.
- **Docs/decks/wireframes/animations** when needed (specs, storyboards, flow diagrams).
- **Persistent memory in this project**: `CLAUDE.md` (standing instructions) + `AGENT-LOG.md` (running
  work log). I read these every session.

## What I can't do
- Run your Vite dev server, npm, or any backend — no Supabase, no live SharePoint/Valcre/ClickUp calls.
  Everything server-side is mocked convincingly.
- See Ben's localhost. I sync from a pushed branch instead (currently `clean-working`).
- Use your slash-commands/agent files directly — persona + instructions live in this project's `CLAUDE.md`.
- **Push to GitHub — my repo access is read-only.** Files flow back via Ben: he downloads from me and
  drops them into the working copy (or pastes contents into your session); you commit and push.
- Access real uploaded client files unless Ben drops them into the chat.

## Current state of the work (see AGENT-LOG.md for detail)
- `APR Dashboard.dc.html` — faithful dark-mode recreation of the V3 dashboard, synced to `clean-working`:
  job list, job detail (Client Info section, Client Documents sorter with drag-and-drop + CSS-mock
  thumbnails, full LOE Quote section with cascade picker, §10 write-up mirror, Saved Documents pills,
  Test Mode fill/clear).
- Goal agreed with Ben: faithful recreation first, then redesign on top of it.

## How to write good instructions for me (via Ben)
1. **Name the branch/commit** I should sync from if code changed.
2. **Point at files**: "the cascade trigger in LoeQuoteSection.tsx" beats a prose description.
3. **State intent + constraints**, not pixel prescriptions: "the Saved Documents list feels buried;
   Ben wants it scannable without a click — keep his quiet-UI rules" is a great prompt.
4. **Say what's mock vs. real**: if a flow needs specific data states (live Valcre job, pending webhook,
   unsigned LOE), list the states to design for.
5. **Ask for options** when direction is undecided ("give 2–3 treatments side-by-side").
6. You can ask me direct questions through Ben — I'll answer in a form you can consume (file paths,
   component names, decisions + rationale).

## Round-trip pattern
You push code → I sync the recreation → we design/iterate here → I log it in `AGENT-LOG.md` →
Ben downloads my files/handoff export and hands them to you → you commit, implement, push → I re-pull.
(The only manual hop is Ben ferrying my output to you — I cannot commit.)
