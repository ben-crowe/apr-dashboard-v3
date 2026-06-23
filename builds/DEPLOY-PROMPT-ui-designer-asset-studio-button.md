---
title: "DEPLOY PROMPT (REVIEW DRAFT v2) — ui-designer tmux teammate · Asset Studio button move"
status: REVIEW DRAFT v2 — DO NOT FIRE until Ben + qa bless it
created: 2026-06-21
revised: 2026-06-21 (v2 — collapsed per Ben+qa: fake skill-audit OUT, real assurance in the work prompt's slash commands + output gate)
author: co-architect
gate: qa prompt-review + Ben approval BEFORE any spawn
owner_lane: co-architect (deployment) · qa-agent (gate) · ui-designer (executor)
task_file: ~/Development/APR-Dashboard-v3/src/components/dashboard/job-details/LoeQuoteSection.tsx
---

# Deployment Prompt — ui-designer teammate (Asset Studio button move)

> **REVIEW DRAFT v2.** Collapsed to the shape Ben + qa locked: no "recite your skills back" handshake (theater — a self-report proves nothing). The real assurance is the **work prompt** firing the skills as literal slash commands + the **output gate**. Three parts: (1) reliable pane spawn, (2) one scoped boot message, (3) the gated work prompt.

---

## Part 1 — Spawn the pane RELIABLY (infra)

**Why the last attempt minted nothing:** a bare `tmux new-session` is NOT surfaced as a KM-Exp tab. A real pane is created through the KM API (`POST /api/copilot/sessions`) — what `spawn-session.sh` does. Two fixes folded in: a **live-port fallback** (qa #2) and **single load, no double-init** (qa #3).

```bash
# Port pre-flight WITH fallback (the saved port can be stale — it moved earlier today)
PORT=$(tmux show-environment -g KM_SERVER_PORT 2>/dev/null | cut -d= -f2)
if [ -z "$PORT" ] || ! curl -sf -o /dev/null "http://127.0.0.1:$PORT/api/tasks/lists"; then
  # saved port dead → discover the LIVE one before spawning
  for p in $(lsof -nP -iTCP -sTCP:LISTEN 2>/dev/null | awk '/node|KM-Exp/{print $9}' | sed 's/.*://' | sort -u); do
    if curl -sf -o /dev/null "http://127.0.0.1:$p/api/tasks/lists"; then PORT=$p; break; fi
  done
fi
echo "live KM_SERVER_PORT=$PORT"   # must be non-empty + 200 before continuing

# Create the TAB only — no --persona here (avoids the double persona-load; the ONE boot message in Part 2 loads her)
~/.claude/scripts/utils/spawn-session.sh --name ui-designer
tmux list-sessions | grep dev-       # confirm a fresh dev-N minted (old dev-3 is gone)
```

If no live port resolves → STOP and surface it (the KM app isn't reachable); do not fall back to bare `tmux new-session` (mints a session with no KM tab).

---

## Part 2 — ONE boot message (scoped load — NOT a skill recital)

The moment the empty pane exists, send this single message — topic folded in so Phase 2 scopes in the same pass (no blind/generic search, no second round-trip):

```
/agent-ui-designer

Load your full startup and scope it to the APR dashboard's Asset Studio — the Component Studio button area in LoeQuoteSection. That's what we're working on: orient in phase one, and scope your phase-two search to that topic, not a blind search.
```

**No "confirm your skills line by line."** That's gone — a self-report is gameable and proves nothing. The only signal I glance at is the **skill-loader script's own `N loaded, 0 missing`** line (that's the script reporting a skill file exists on disk vs. broken/renamed — real signal, one glance, not a recital). If it shows missing → fix the persona/skill ref before the work prompt.

---

## Part 3 — The WORK PROMPT (the artifact I gate — skills fired as literal slash commands)

> This is where the real assurance lives: every skill the job needs is a **literal slash command** (prose like "use your design skill" gets skimmed and never invoked — a slash command actually loads it). Sent after the boot message; the output gate + Ben's click-test are the final proof.

```
SKILLS — load these now (run each, don't just acknowledge):
  /interface-design     ← the cog placement + quiet-affordance craft
  /frontend-design      ← the React/Tailwind edit in LoeQuoteSection.tsx
  /search-2phase        ← scoped search on the Asset Studio / Component Studio area (if not already warm from boot)
  /tmux-comms           ← how you report back to me (below)

WHY: the Component Studio button sits side-by-side in the Create-Document/Email row, so it reads as a
     peer action — but one button PRODUCES documents for the job, the other CONFIGURES templates. They
     shouldn't look like siblings. Interim cleanup BEFORE the slide-out build.

TASK (visual):
  1. MOVE the "Component Studio" button OUT of the Create-Document/Email row.
  2. PLACE it up under the ribbon as a QUIET cog icon + "Asset Studio" label — NO box/border (a
     low-emphasis icon+label affordance, not a Button-styled control).
  3. RELABEL "Component Studio" → "Asset Studio" (label + the title/tooltip text).
  Don't-paint-into-a-corner: position it so the later slide-out can hang off this cog — but do NOT build
  the slide-out now (placement only).

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

REPORT-BACK CONTRACT (mandatory — the gap from the first review):
  When DONE or STUCK, message co-arch via the tmux-comms wrapper (~/.claude/scripts/utils/tmux-msg.sh
  dev-2 "...") — DONE: <result + lines touched + where to click>, or STUCK: <plain question>. Do not let
  the result sit unsent.

ON AMBIGUITY: no AskUserQuestion / multi-choice. Pick best per the intent, report "Picked: <one line>.
  Proceeding." If genuinely blocked → "STUCK: <question>".

PERMISSION: push back if this brief is missing anything you need to place the cog correctly.
```

---

*v2 prepared by co-architect 2026-06-21 — fake skill-recital removed; real gate = the work prompt's slash commands + the output + Ben's click-test. For qa prompt-review + Ben approval. No spawn until blessed.*
