---
title: "Workflow Verification — Template"
type: workflow-verification-template
status: draft for Ben's approval
purpose: the reusable format for a WORKFLOW VERIFICATION — an agent drives the running product end to end, screenshots every step, each shot passes or fails, and the run is written up. The document both TESTS the feature and TEACHES the app, readable by a person and runnable by a terminal agent.
worked_example: tests/WALKTHROUGH-1-client-intake-file-management.md
---

# Workflow Verification — Template

> **⭐ THE NAME OF THIS THING IS A WORKFLOW VERIFICATION (Ben, 2026-07-14). It is not a "walkthrough" and it is not an "audit".** Those two words are already taken on this machine and they mean different jobs. Getting this wrong is not pedantry: an agent asked to "do a walkthrough" finds whichever of the three it happens to hit first.
>
> | The word | What it actually means here |
> |---|---|
> | **Workflow verification** *(this document)* | An agent DRIVES THE RUNNING PRODUCT end to end, screenshots each step, and every shot passes or fails. It proves the app works. |
> | **Walkthrough** | Talking a build through OUT LOUD to find gaps in how the team hands work over. It is about the agents, not the app. |
> | **Audit** | Deploying a cold outside agent to read HOW A BUILD RUN WENT — the process, not the product. Also about the agents. |
>
> *(The file names in this folder still say WALKTHROUGH. They are staying as-is for now; the term above is what governs.)*

This is the **format** every workflow verification follows. Copy this file, rename it, and fill the bracketed parts. The finished document does three jobs at once:

- **It tests the feature** — each step ends in a screenshot that decides pass or fail.
- **It teaches the app** — it reads like a how-to, so an agent (or a new person) learns the feature by following it.
- **It runs** — a terminal-driving agent can execute it step by step, and improve the write-up as it goes.

> **Review gate.** A finished walkthrough goes to Ben first. Nothing runs until he has read it and the steps match how he would actually walk the app. Writing it out is itself a layout check — a button named in the wrong place is a bug caught on paper.

---

## 1. Header block — put this at the top of every walkthrough

**Title and place in the set.** Name it `Walkthrough N of M — <feature>`, and put a short index at the very top listing the whole set (written and still-tentative), so a reader sees this is one section of many, not a standalone. Name the walkthrough by the journey it actually covers end to end — if it starts at the intake form and ends at SharePoint, it is not "Document Filing", it is "Client Intake and File Management".

Then fill these four lines so anyone opening the document knows the ground:

- **Feature:** `<one sentence — what the user can do>`
- **Test job / data:** `<the exact job or record to use, and why it's the right one>`
- **Destination:** `<where the outcome lands — a database row, a SharePoint folder, an email — and how the tester reaches it>`
- **Session held:** `<any login already signed in so the tester doesn't re-authenticate — e.g. the SharePoint session in the browser>`

---

## 2. Search prime — orient before you write or walk

Before authoring or running the walkthrough, orient on the feature. Three rules, non-negotiable:

- **Declare the skill by name — `/search-2phase`, scoped to the project. NEVER paste a raw search command.** The skill owns both phases, the scoping, and the refuse-to-skip. Naming a raw command (`~/.claude/scripts/search/ss12 '…'`) instead is exactly how the second phase gets skipped — a pasted command is something an agent half-runs; the moment the prime describes the search instead of declaring the skill, it hands the agent a story to negotiate with. Declare the skill; the skill does the work.
- **Two subjects = two separate runs.** If the feature spans two topics (e.g. the client-intake flow AND job creation), run `/search-2phase` once per subject. A single blended query returns whichever subject the recent records favour and drops the other.
- **Read the results yourself.** The comprehension search cannot be handed to a helper — understanding forms only in whoever did the reading.

---

## 3. Capabilities map — fill this FIRST, before any step

List **every** thing a user can do in this feature, before writing a single step. This is what forces the whole journey onto the page — including the parts not built yet — so gaps show here instead of in production.

| Capability | Built? | Where it lives on screen | What proves it works |
|---|---|---|---|
| `<e.g. file a document into a folder>` | `Yes / GAP` | `<panel + control location>` | `<the on-screen + data result>` |
| `<...>` | | | |

**Rule:** a capability marked **GAP** still gets a step in the walkthrough — a *fail-closed* one (see below). A feature is not "tested" until every row here has a step.

---

## 4. The walkthrough — numbered steps

Write each step as if you are driving the app for the first time. Three fixed parts per step:

1. **Narration** — name the control by the **words on it** and **where it sits** ("the *Move to* dropdown, right side of the file's row"), the action, and **what should appear** after it.
2. **SCREENSHOT [letter]** — exactly what to capture. Label them `[A]`, `[B]`, `[C]` … in order.
3. **PASS [letter]** — the on-screen result that makes it a pass. Where a screenshot can't see the truth (a database row, a file's bytes), add a **data pair**: the one extra read that confirms it.

Five disciplines, applied throughout:

- **Negative control with teeth.** Before the step that should make something happen, assert the state where it has NOT happened yet — and make it a real check that could fail, not a photo of empty space. Eval that the element is `null` before and non-`null` after; a screenshot of a blank area cannot fail and proves nothing.
- **Fail-closed for unbuilt steps.** A not-yet-built capability's PASS is "nothing happens today." The screenshot marks the gap. When the feature is built, the **same** step flips to a real pass — no rewrite.
- **The destination is the proof, never the app's own word.** "The function returned OK" is not a pass. The file appearing in the real folder, the row actually written, the bytes coming back — that is the pass.
- **"Renders readable" needs a data check beside the picture.** A blank white box and a real page look identical in a screenshot. Pair the shot with a read that proves content — e.g. assert the preview frame's `src` points at the real file and its type matches. The picture alone can't tell a working preview from a broken one.
- **Expand a collapsed container before you shoot it.** If a panel starts collapsed, the FIRST instruction is to expand it — name the exact button text — before any screenshot. A shot of a collapsed panel reports the feature missing when it's just folded shut.

### Step format to copy

```
**Step N.M** — <narration: control by its label + location, the action, what should appear>
> **SCREENSHOT [X]** — <exactly what the picture shows>
> **PASS [X]** = <the on-screen result>. Data pair: <the row / bytes / count that confirms it>.
```

Group steps under plain headings that match the journey — a **Precondition** section first (what must exist before the feature can be used), then one section per stage of the user's path.

---

## 5. Machine-runnable layer — so a terminal agent can execute it

A person reads Section 4. A terminal-driving agent (e.g. Codex in the cmux terminal) reads this table — the same steps, in the form it needs to act. One row per screenshot checkpoint.

| Step | Route / action | Control (text or selector) | Expected state to capture | Screenshot out-path |
|---|---|---|---|---|
| `[A]` | `navigate <url>` | `<control text or selector>` | `<what must be true>` | `<path>/step-A.png` |
| `[B]` | `click …` | `<...>` | `<...>` | `<...>/step-B.png` |

**Why both layers:** the narration is what a human approves and what teaches the app; the table is what an agent runs without guessing. Keep them in lockstep — every `[letter]` in Section 4 has one row here.

---

## 6. How to drive this walk — put this block in every walkthrough

The agent executing the walk follows these rules. State them in the document so a runner doesn't have to be told each time:

- **Open your OWN browser surface and use only that reference.** Two agents on one shared surface navigate it out from under each other. Each walk gets its own surface.
- **Drive with the built-in cmux browser** — `navigate`, `eval`, `screenshot --out`. Read the current URL before waiting or shooting.
- **Give the exact selector when a control has no accessible role.** A plain `div` acting as a button is invisible to a snapshot that looks for a "button" — it reports the control missing when it's right there. Where the control isn't a real button, the step names the exact selector to click.
- **THE FAILURE RULE — on a failed step, STOP.** Capture the screenshot, report the failure, and stop. The agent does NOT repair the app mid-walk. A walk is a test, not a fix session; fixing hides the failure the walk exists to surface.
- **A dead surface reads like a crashed app.** If the tab silently goes to `about:blank` and every read comes back empty while it refuses to navigate, the surface died — open a fresh one; the old one never recovers. Don't report the app broken.

---

## 7. The story in one glance

Close with one paragraph that walks the screenshot letters in order — "the panel exists `[A]`, the control is where it should be `[B]`, a file gets in `[C]` …". A reviewer reads the shots start to finish and the story is either complete or it isn't. This paragraph is the fastest way for Ben to see whether the test covers the whole feature.

---

## Worked example

`tests/WALKTHROUGH-1-client-intake-file-management.md` is this template filled in — the client-intake-to-SharePoint journey, from the intake form's "Test Data" button through creating the folder set, filing into a folder, the copy landing in the real SharePoint folder, and the in-app preview. Read it alongside this template to see the format in use.
