---
title: "WORK PROMPT — ui-designer · Asset Studio button move (off the locked Step-3 skeleton)"
status: FOR QA GATE — then Ben blesses → co-arch sends to dev-3
created: 2026-06-21
deployer: co-architect (dev-2)  ← report-back target
executor: ui-designer (dev-3, already booted + oriented to this topic)
gate: qa-agent (dev-1)
template: ~/.claude/skills/deploy-tmux-teammate/STARTUP-PROMPT-TEMPLATE.md (Step 3)
---

# Work Prompt — send verbatim to ui-designer (dev-3) after the gate clears

> She's already booted on dev-3 and ran the scoped search on this exact area, so this is the work prompt only — no re-spawn, no re-boot. Send via the wrapper: `~/.claude/scripts/utils/tmux-msg.sh dev-3 '<below>'`.

```
SKILLS — load these now (run each as a slash command, don't just acknowledge):
  /interface-design   ← the cog placement + quiet-affordance craft (where + how it reads)
  /frontend-design    ← the React/Tailwind edit in LoeQuoteSection.tsx
  /tmux-comms         ← how you report back to me (below)

WHY: the "Component Studio" button sits side-by-side in the Create-Document/Email row, so it reads as a
     peer production action — but the other buttons PRODUCE documents for the job while this one
     CONFIGURES templates. They shouldn't look like siblings. Interim cleanup BEFORE the slide-out build.

TASK (visual):
  1. MOVE the "Component Studio" button OUT of the Create-Document/Email row.
  2. PLACE it up under the ribbon as a QUIET cog icon + "Asset Studio" label — NO box/border (a
     low-emphasis icon+label affordance, not a Button-styled control).
  3. RELABEL "Component Studio" → "Asset Studio" (the label AND the title/tooltip text).
  PLACEMENT-ONLY forward-compat: position it so the later slide-out can hang off this cog — but do NOT
  build the slide-out now. Don't paint into a corner; don't over-build.

FILE: src/components/dashboard/job-details/LoeQuoteSection.tsx
  Anchor: the Component Studio <Button> (~line 1591) — `<LayoutGrid/> Component Studio`,
  title "Open the Component Studio — Document, Email & Popup library + sequence map".

CONSTRAINTS:
  - You OWN the visuals — your call on the cog treatment within "quiet, no box, under the ribbon."
  - Verify CODE/DB only. NO agent screenshots — BEN click-tests the look. Your "done" = the change
    compiles (npm run build / tsc clean) + the button is relocated/relabeled per spec. Do NOT
    self-screenshot-verify the appearance.
  - Do NOT touch the Create-Document/Email production buttons' behavior — only remove Component Studio
    from that row.

ACCEPTANCE:
  - Component Studio GONE from the Create-Document/Email row.
  - Quiet cog + "Asset Studio" label under the ribbon, no box.
  - Label + tooltip read "Asset Studio".
  - npm run build clean. Report the exact lines touched + where Ben clicks to see it.

REPORT-BACK CONTRACT (mandatory): when DONE or STUCK, message co-arch (the deployer) via the wrapper —
  ~/.claude/scripts/utils/tmux-msg.sh dev-2 "DONE: <result + lines touched + where to click>"
  (or "STUCK: <plain question>"). Never let the result sit unsent.

ON AMBIGUITY: no AskUserQuestion / multi-choice. Pick best per this intent + the Studio spec, report
  "Picked: <one line>. Proceeding." If genuinely blocked → "STUCK: <question>".

PERMISSION: push back if this brief is missing anything you need to place the cog correctly.
```

---

*Off the locked deploy template's Step 3. For qa prompt-gate → Ben → co-arch sends to dev-3.*
