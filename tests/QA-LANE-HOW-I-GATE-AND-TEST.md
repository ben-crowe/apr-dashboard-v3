---
content_type: sop
title: The QA Lane — what I gate, how I test, and which tools actually work
owner: qa-agent
created: 2026-07-13
status: living — corrected whenever a check is found blind
purpose: The standing operating page for the QA seat on APR. What passes through my gates, the proof each one demands, the tooling that actually runs today, and the docs that have rotted.
tags: [apr-dashboard, qa, testing, gates, e2e, tooling, source-of-truth]
---

# The QA Lane — what I gate, how I test, and which tools actually work

> **Read this before asking me to verify anything.** It says what I will demand, so you can build to it and clear the gate on the first pass.

---

## 1. THE FIVE LAWS (earned the hard way, 2026-07-13 — all five from real failures in one day)

These are not style. Each one is here because a check went green while examining nothing, or red while examining nothing, and it cost real time.

### LAW 1 — PROOF-OF-SIGHT. Every check carries a control that would FAIL if the check were blind.

A check that examined nothing returns a result identical to a check that examined everything. **You cannot tell them apart from the output.** The only defence is a control that MUST come back a known way.

| Check type | The control |
|---|---|
| Absence proof (grep, bundle, log) | assert a string that MUST be **present**. Absence only counts once you've proven the instrument can see presence. |
| Type-check / compile | assert a **known-failing** file still reports. |
| Schema / DB probe | ask for a column that **cannot** exist (must error) AND one that **must** exist (must return). |
| Test harness | include one assertion written to **FAIL**. All-green = the harness never ran. |
| UI / visual | capture a state you **know** differs (before vs after). |

**Four blind checks in one day.** A bundle-grep whose control string was also absent (the whole page was behind an off feature flag). A bare `tsc --noEmit` that type-checked **zero files**. A database probe whose "column not found" was actually "invalid API key". A template grep that matched inside a **changelog comment**, not a render site.

**Two of those four were FALSE-RED.** A blind check does not merely *miss* defects — **it invents them.** False-green and false-red are the same failure. The control is the only thing that tells them apart.

### LAW 1a — THE CONTROL IS ALSO A CLAIM. Prove it can fail.

I once blocked a brief *specifically to demand* a negative control — then passed the brief without running the named test case through the actual code. The two filenames it used **did not collide**. The control could never have detected the bug it was written to catch, and would have gone green after the fix, certifying it fixed. **A blind check, formally blessed as the proof.**

A named reproduction case is a **hypothesis until you have run it**. Run the transform. Print both outputs. Show them matching.

### LAW 2 — A CONTRADICTION IS THE FINDING. Investigate the instrument before you spend the result.

A blind instrument doesn't just report nothing — it hands you **unearned confidence**, and that confidence gets *spent*: on overruling the person who was right.

A builder reported 5 real errors. My check said 0 — because it examined zero files. I used my green to **overrule him**, and *invented a mechanism* to explain his correct report away. Every clause of it was false.

- When a result contradicts a **person**, suspect **your instrument** first. They ran the code; you ran a tool.
- Never let a green overrule a red without a third check. Two instruments disagreeing means **at least one is broken** — find out which; don't pick.

### LAW 3 — AN EXPLANATION IS A CLAIM, AND A CLAIM GETS A CONTROL.

"X failed **because** Y" is two claims. You proved the first. You almost certainly **inferred** the second from your own fix working — a different experiment entirely.

**Motive does not protect an explanation.** One of the two false explanations that day was *defensive* (mine, dismissing a correct report). The other was **generous** — a builder handing me the control I was missing, solving my problem, nothing to defend. It was equally false, and it would have planted a wrong model that outlived the conversation.

> **The tell:** you are typing the word "because" and you have not run a command since you started the sentence.
> **The answer you are allowed to give:** *"I don't know why it failed for you — here is what works for me."*

### LAW 4 — VERIFY AGAINST THE SOURCE OF TRUTH, NOT THE ADJACENT LINK.

**The law that catches what the others cannot, because nothing in the chain lies.**

```
Ben clicks through a prototype and approves it     ← THE SOURCE OF TRUTH
   ↓  written up as prose (LOSSY — the drag-and-drop got described away)
a written spec, now self-contradictory
   ↓  a brief written FROM the spec (faithful)
   ↓  a build built FROM the brief (faithful)
   ↓  I verify the build AGAINST THE BRIEF (faithful)
PASS ✅ — confidently, and wrong
```

My own words: **"I checked the build against the brief, and the brief against nothing."** Every link honest. Every check passed. The output was wrong, because a defect that enters **upstream** is invisible to any check that compares a step only to the step before it. It does not fail — **it passes, all the way down.**

- **When an approved ARTEFACT exists — a prototype Ben clicked, a mock he picked — THAT ARTEFACT IS THE SPEC.** The prose is a lossy copy.
- Verify against the artefact. Diff it **element by element**; the **named list of differences** is the proof, not a screenshot and a verdict.
- If prose and artefact disagree, **the artefact wins**, and the disagreement is itself a finding.

---

## 2. THE THREE GATES — what passes through me, and what each demands

| Gate | When | Catches |
|---|---|---|
| **BRIEF GATE** | before a builder is dispatched | *building the wrong thing* |
| **SPEC GATE** | before code is written | *a spec that lies about the codebase* |
| **BUILD-VERIFY** | after the builder reports done | *a build that doesn't do what it claims* |

### The BRIEF GATE (added 2026-07-13 — the gate that would have caught the day's real failure)

**Every instruction that changes what gets built passes me BEFORE the builder starts. No emergency exception, no fast lane.** The only ungated messages are ones that direct no build — a question, an acknowledgement, a status check.

Why it exists: a build was **faithful** to a brief that pointed at the wrong components. A gate on the *finished build* can never catch a *wrong brief*. The defect was upstream of everything I was looking at.

**The one question:** *does this brief build the thing that was actually approved?* Not "is it well written."

**My matching duty: GATE FAST.** A gate that takes an hour is a gate that gets bypassed under pressure — and then there is no gate at all. **Single turn. Pass or block.**

### The SPEC GATE

Every *"this already exists"* claim in a spec gets **verified against live code**. Docs rot; line numbers drift; a spec is a claim about the codebase, not a description of it.

Output is per-hole: **"here is the hole → here is why it bites → here is the fix."** Never a vague concern.

### BUILD-VERIFY

**As the app's real runtime identity** — logged-out if that's how it actually runs. A logged-in self-check misses every auth and permission bug.

**Evidence hierarchy — a 200 is not evidence:**
1. **The database row** — read it back. The write either happened or it didn't.
2. **The real arrival** — the file in the bucket, the email in the inbox, the object in SharePoint.
3. **The pixels** — a screenshot I have *read*, not merely captured.
4. **Never** the builder's "done", and never an HTTP 200.

**Type-clean is not app-alive.** Deleting a dead module passed `tsc` and turned the entire app into a white screen — a barrel re-export of a deleted file is a *runtime* failure, not a *type* failure. **After any deletion, load the app and look at it.**

**Never bury an unproven check inside a PASS.** A third verdict exists: **PARTIAL / UNVERIFIED**, stating what could not be confirmed and what would close it.

---

## 3. THE STANDING E2E PLAN — the pipeline, and what proves each leg

| # | Leg | Proof I demand | State |
|---|---|---|---|
| 1 | Client submits the intake form | `job_submissions` row by query + every attachment has a `job_files` row **and** a storage object | ✅ proven 2026-07-13 |
| 2 | Job + ClickUp card created | ClickUp card read back by API, custom fields populated, **no duplicate card** | ✅ proven |
| 2a | Dashboard fields sync to Valcre | **readback via GetValues** — never the HTTP 200. Valcre silently ignores a wrong field name. | ✅ proven |
| 3 | LOE generated + e-signed | rendered LOE checked against the coverage gate; DocuSeal webhook updates the DB row | ⚠️ partial — re-anchor + template-ID mismatch open |
| 3a | Client documents filed into folders | `filed_bucket` set, `sharepoint_path` NULL while SharePoint is dark, file leaves the unsorted list | ✅ proven 2026-07-13 |
| 4 | Closing: pay → paid | QuickBooks sandbox invoice + payment webhook flips status | ☐ not built |
| 5 | Cutover to the client's accounts | **the ClickUp production branch has NEVER been type-checked** — it is switched off, which is exactly why | ⛔ see task #25 |

**The pinned test job is VAL261101.** Modify it field by field. **Never** the Test Data button as a verification (it fills fixed values and can pass while the real path is broken).

**Test data on the shared production database:** local and production read the **same** database. There is no separate local one. If a test creates a job, **it is live**. Record what you create, delete it after — rows AND storage objects — and **re-verify the deletion by query**, not by assumption.

---

## 4. THE TOOLING — what actually runs today (⚠ THE CATALOGUE IS LYING TO YOU)

### ✅ REAL, RUNNABLE — `~/.claude/scripts/apr/` (18 scripts, verified present)

```
apr-health-check.sh · apr-regression.sh · supabase-connect.sh
valcre-auth.sh · valcre-verify-job.sh · valcre-field-audit.sh
valcre-list-custom-fields.sh · valcre-get-custom-field-values.sh
valcre-set-custom-field.sh · valcre-create-custom-fields.sh · valcre-patch-custom-field-options.sh
clickup-auth-test.sh · clickup-get-task.sh · clickup-list-tasks.sh
clickup-list-fields.sh · clickup-update-field.sh · clickup-create-task.sh · clickup-button-verify.sh
```

**Use these for Valcre and ClickUp verification. Do not hand-roll curl at them.**

### ⛔ THREE WAYS THE TOOL CATALOGUE IS STALE — FLAGGED, NOT LEFT

The `/cli-agent-all` catalogue is the documented front door. **I searched it for the things I hand-rolled today, and found this:**

1. **`✓ exists` DOES NOT MEAN THERE IS A COMMAND.** `form-submit` and `supabase-query-jobs` are both marked **"✓ exists"**. Neither is a command — `which` finds nothing. They are *descriptions of a procedure* and a *SQL snippet*. The catalogue conflates **"we know how to do this"** with **"there is a tool that does this."** An agent trusting the badge will go looking for a binary that was never written.

2. **THE PORT IS WRONG.** `form-submit`'s example says `agent-browser open http://localhost:5173`. **5173 is KM-Exp, not APR.** APR is **8086** — the project's own CLAUDE.md warns about exactly this confusion, and the catalogue walks straight into it. Six test docs still name 5173.

3. **`agent-browser` IS DEAD ON THIS MACHINE.** It is installed and on PATH, and every invocation returns **`✗ Daemon failed to start`**. Nine test docs are written around it. **Every browser example in the tooling catalogue is currently unusable.**

### ✅ WHAT ACTUALLY WORKS FOR BROWSER TESTING TODAY

| Job | Tool | Why |
|---|---|---|
| View / drive / read a page, check the app renders | **cmux browser** (`cmux browser surface:N ...`) | works, visible in the workspace — Ben can watch. Caught the app rendering after a dead-code deletion, which `tsc` could not. |
| **File upload** | **cmux browser — YES IT CAN.** | ⚠️ **CORRECTED 2026-07-13.** I claimed it could not, having read the command list and seen no upload verb. That was an *inference*, not a test, and it was **wrong**. Carry the file in as base64, rebuild it as a `File` in the page, put it on the input, **dispatch a `change` event** — the app receives the real bytes. Proven live. The OS file-picker window is out of reach; you are bypassing it, which is more reliable. **A LIMITATION IS ALSO A CLAIM (Law 3). "It cannot do X" needs a probe exactly as much as "it does X."** |
| DB / storage ground truth | **Supabase REST via curl** | no catalogued command exists — see the gap below. |

> Playwright's own bundled browsers are **not installed** here. Launch with `channel: 'chrome'` or it fails.

### 🕳 THE REAL GAP — tools I hand-rolled today that SHOULD exist

The catalogue itself flags **`form-file-upload`** as **✗ MISSING — needs authoring**. That is precisely what I built by hand today. These are the ones worth authoring, because I wrote them three times each:

- **submit the intake form with attachments** (Playwright + `setInputFiles`)
- **read every `job_files` row + storage object for a job** (the DB/storage ground-truth pair)
- **delete a test job completely** — `job_files`, `job_property_info`, `job_loe_details`, `job_submissions`, **and** the storage objects — then **re-verify by query**

That last one is not a convenience. **Deleting a job removes its rows but nothing removes its bytes** — there are ~108 orphaned client documents in the storage bucket right now from jobs deleted long ago (task #30).

---

## 5. STALE DOCS — NAMED, per the directive

| Doc | Rot |
|---|---|
| `docs/APR-TESTING-PLAYBOOK.md` | **last touched 2026-03-26.** Names port 5173. The oldest source of truth in the testing set. |
| `docs/APR-TESTING-REFERENCE.md` | names port 5173 |
| `tests/E2E-TESTING-WORKFLOW-MASTER.md` | names **both** 5173 and 8086 — it contradicts itself; also written around `agent-browser`, which is dead |
| `tests/METHOD-apr-screenshot-verification.md` | 5173 + agent-browser |
| `tests/LOE-TEMPLATE-EDITOR-TEST-PROTOCOL.md` | 5173 + agent-browser |
| `tests/INTAKE-FORM-FIELDMAP-2026-06-03.md` | 5173 |
| 6 more test docs | written around `agent-browser` |

**The pattern is one rot, not seven:** the whole testing corpus was written when `agent-browser` worked and someone believed the port was 5173. Fixing them one at a time is the wrong move — **the port and the browser tool are the two variables**, and both changed. This file is the corrected entry point; the others need a single sweep.

---

## 6. WHERE I AM STILL THIN — stated, not hidden

- **The e-signature leg** has never been driven end to end by me. The template-ID mismatch and the signature re-anchor are open, and I have not personally proven a client can sign.
- **The ClickUp production path** has never been type-checked *or* tested — it is pinned off, which is exactly why nothing has ever looked at it. **The day it matters most is the first day anyone looks.**
- **QuickBooks / closing** — nothing built, nothing tested.
- **Moving a filed document between folders after it has reached SharePoint** — the code is right; the path has never executed, because nothing has ever been mirrored. It is written, not proven.
- **The search's deep-graph layer was DOWN** when I primed this lane. Declared, not swallowed.

---

*Written 2026-07-13 by qa-agent, after a day in which four checks reported confidently while examining nothing. Every law above is a scar. Correct this file when a check is found blind — that is the only way it stays worth reading.*
