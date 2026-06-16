---
id: workflow-spec-prompt-build-verify
title: "THE FLOW — spec → gate → prompt → gate → build → verify (who does what)"
date: 2026-06-16
type: workflow-reference
author: qa-agent
tags: [workflow, roles, build, review-gate, forked-builder, clarity]
---

# THE FLOW — and who does what (read the roles first)

This is the locked back-and-forth for getting a feature built. We kept re-confusing two things;
they are spelled out here so we never re-litigate them.

## ⚑ The two things that kept confusing us — settled

1. **Ben does NOT pick the builder.** Ben gives direction and the GO. That's it. The builder choice
   is co-architect's, made INSIDE her build prompt.
2. **The "forked agent" is NOT Ben and NOT qa and NOT co-architect.** It is a SEPARATE builder agent
   that **co-architect dispatches as her own fork.** It does the actual coding. Co-architect sets it
   up and supervises it; she does not write the code herself, and neither does qa.

## Roles (one line each)

- **Ben** — direction only. Does not pick the builder, does not build, does not review, and does NOT gate deploys (policy change 2026-06-16: agents deploy freely + INFORM Ben — this is a test/prep dashboard, not live client use). Ben just wants to be TOLD when something goes live.
- **Co-architect** — specs the work; writes the build prompt (SHE names the builder agent in it);
  dispatches her own forked builder; supervises the build.
- **qa-agent (me)** — gates the spec, gates the prompt, verifies the finished build. Does NOT build
  (building it myself would make me mark my own homework — kills the independent check).
- **The forked builder** — a separate agent co-architect dispatches. Does the coding. Not Ben, not
  co-architect, not qa.

## The steps (in order)

1. **Co-architect specs** the work → sends the spec to qa.
2. **qa spec-gates** it → thumbs up, or REVISE with specific gaps. (Loop 1→2 until PASS.)
3. **Co-architect writes the build prompt + deployment instructions** — and **picks the builder
   agent/persona right there in the prompt** → sends it to qa.
4. **qa prompt-gates** it → thumbs up, or a quick tweak. (Checks: names the builder + skills, points
   at the spec + exact files + the testable proof, reminds the tool category, orders the start:
   read passover → run SS12 → build to spec.)
5. **Co-architect deploys her own forked builder** with the spec + the gated prompt.
6. **The forked builder builds** to the spec.
7. **qa verifies the result** — the round-trip on the test job (VAL261101) — → PASS or findings back
   to co-architect.
8. **Ben's only touchpoints:** direction at the start, and the GO to deploy. Nothing in the middle.

## Current status (address + editor build)
- Step 2 DONE — qa PASSED the address spec (`SPEC-address-two-part-split.md`).
- Step 3 IN PROGRESS — co-architect writing the build prompt (she picks the builder); qa awaiting it.
- Steps 4–7 pending.

*qa-agent · 2026-06-16. Written at Ben's request to stop re-confusing who picks the builder and who the
fork is. The fork is co-architect's; Ben never picks it.*
