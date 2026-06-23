---
title: "Research — Claude Computer Use / Browser Automation + ClickUp"
status: research
date: 2026-06-19
topic: Can Claude drive the ClickUp web UI to rename/create/reorder custom field definitions (drag-to-reorder)?
tags: [research, claude, computer-use, claude-for-chrome, clickup, mcp, custom-fields]
---

# Claude Computer-Use / Browser Automation + ClickUp — Current State (June 2026)

**Question driving this research:** ClickUp custom-field *definition* management (rename / create / reorder) is UI-only — there is no public API for it. Can Claude (Computer Use or Claude for Chrome) drive the ClickUp web UI to do this today, **including the drag-to-reorder**, and how does it compare to Codex computer use on reliability and token cost?

> Verification note: a few official Anthropic / ClickUp doc URLs returned 403/404 to the fetcher (login-gated or moved). Where that happened, claims below are triangulated from the Anthropic API skill reference (cached in-session), reputable secondary coverage, and the ClickUp developer docs that did resolve. Items I could not fully verify are flagged inline as **[UNVERIFIED]**.

---

## 1. Claude "Computer Use" (the API tool)

**What it is.** A self-hostable (or Anthropic-hosted) tool where Claude runs a vision→action loop: it takes a screenshot, reasons about the pixels, and emits a mouse/keyboard action, then re-screenshots and repeats.

**Action set (current `computer_*` tool).** It exposes the standard sub-actions:
`screenshot`, `mouse_move`, `left_click`, `right_click`, `middle_click`, `double_click`, **`left_click_drag`**, `type`, `key`, `cursor_position`, `scroll`. Newer tool versions also split drag into press/release primitives (`left_mouse_down` / `left_mouse_up`) and add `hold_key`, `wait`, `triple_click`, `zoom`.

**Drag support — YES, natively.** `left_click_drag` (click-and-drag from current position to a target X/Y) is a first-class action, and press/hold/release primitives exist for finer-grained drags. So drag-to-reorder is *expressible*. The caveat is reliability, not capability (see below).

**Models that support it.** Computer use runs on the vision-capable Claude 4.x line. As of 2026 the recommended drivers are **Claude Sonnet 4.6** (the computer-use workhorse — Anthropic specifically called out improved computer-use reliability with 4.6) and **Claude Opus 4.7/4.8** (comparable click precision, higher input-image resolution so less downscaling). Available on the Anthropic API, Amazon Bedrock, and Google Vertex AI. Still labeled **beta**, not GA.

**Reliability over the past year.** Meaningfully better. The original 2024/early-2025 launch was explicitly "experimental," with Anthropic naming **scrolling, dragging, and zooming** as the weak spots. Through 2025→2026 this improved: Sonnet 4.6 (Feb 2026) reported ~94% on an insurance computer-use benchmark and is the headline "better at navigating web environments" release. Opus 4.7's higher-res vision (coordinates map 1:1 to pixels) removed a class of click-offset errors.

**Known limitations (still true in 2026).**
- **Pixel-coordinate errors / hallucinated coordinates** — the model can still mis-target, especially on dense UIs; extended/adaptive thinking mitigates but doesn't eliminate it.
- **Drag remains the historically weakest primitive.** It works, but a precise drag-to-an-exact-drop-slot (e.g. reorder list item between two specific neighbors) is exactly the operation the original weakness list called out. Expect retries.
- **Beta, not production-hardened** — Anthropic's own framing is "powerful but evolving"; not recommended for unattended high-stakes flows without a verification loop.

---

## 2. Claude for Chrome (a.k.a. Claude in Chrome)

**What it is.** An official Anthropic **Chrome browser extension** that runs Claude in a side panel; it can read, click, type, navigate, and manage tabs on the live page alongside you. It is **DOM-aware browser automation**, not blind pixel-clicking — generally faster and more reliable on web apps than raw Computer Use.

**Availability / access (June 2026).**
- **Open public beta** — **all paid plans** (Pro, Max, Team, Enterprise). **Not** on the free tier. **Not** GA yet (no production-release date announced).
- **Chrome only** — not other Chromium browsers, not mobile.
- Rollout history: research preview Aug 2025 (1,000 testers) → all Max Nov 2025 → all paid plans incl. Pro by Dec 2025.
- **Model by plan:** Pro → Haiku 4.5; Max/Team/Enterprise → can select Opus 4.7, Sonnet 4.6, or Haiku 4.5.

**What it can do on a page.** Click buttons, type text, screenshot, multi-tab workflows, navigate common platforms (Slack, Gmail, GCal, Google Docs, GitHub), background multi-step workflows, download files, image uploads, **record + replay workflows as shortcuts**, and scheduled recurring tasks.

**Drag?** The official capability list emphasizes **read / click / type / navigate**. **[UNVERIFIED]** — drag-and-drop reordering is **not** called out as a supported primitive in the help docs I could read. A DOM-driven extension may simulate HTML5 drag events, but native canvas/JS drag-reorder widgets (which is what ClickUp's column reorder is) are not a documented strength. Treat drag-to-reorder in Claude-for-Chrome as **unconfirmed and risky**.

**Reliability for real web-app automation.** Better than pixel Computer Use for standard click/fill/navigate flows because it sees the DOM. Still **beta**, with explicit safety framing ("inherent risks"); high-risk actions require explicit user approval, and Team/Enterprise admins can allowlist/blocklist sites. Independent reviews call it useful for early adopters but "not yet production-reliable" for professional unattended use.

**Where it lives.** It's a **Chrome extension** tied to the Claude subscription. It interoperates with **Claude Desktop** (via connector) and **Claude Code**, but it is *not* a feature embedded inside claude.ai's web chat — it's the browser extension surface.

---

## 3. Claude Desktop App capabilities

- The **desktop app itself does not have built-in OS-level computer use** as a standard always-on consumer feature; its automation reach comes from **MCP connectors** (the connectors directory) and from pairing with **Claude for Chrome** (the extension drives the browser; the desktop app can coordinate via connector).
- Anthropic has been shipping a broader "autonomous workstation" direction in 2026 (stabilized Computer Use, Remote Control via `claude remote-control`, Agent Teams, MCP Apps) — **[UNVERIFIED]** how much of that OS-control surface is exposed in the *consumer desktop app* vs. Claude Code / the API. For *driving a specific web UI*, the practical desktop path is **Claude for Chrome**, not a desktop OS-control feature.
- Net: to drive ClickUp's web UI from "Claude the app," the realistic mechanism is the **Chrome extension**, not a desktop-native computer-use mode.

---

## 4. ClickUp + Claude integration

### (a) Anthropic connectors directory / claude.ai connectors
- There **is** an official **ClickUp connector** in Anthropic's Connectors Directory (claude.com/connectors/clickup), **"Made by: ClickUp"**, read & write, works across claude.ai / Desktop / Mobile / Code. The directory has ~439 connectors as of June 2026.
- **Documented actions:** find workspace members, **create/organize tasks**, **update task details** (incl. setting priority and other field **values**), automatic time tracking, create docs/pages, send team chat messages.
- **Custom field DEFINITIONS:** the connector page shows **only setting field *values* on tasks** (e.g. set priority). **No** capability to create / rename / reorder custom-field *definitions* is listed.

### (b) ClickUp's own MCP server
- ClickUp ships an **official MCP server** (help.clickup.com "What is ClickUp MCP" — page was 403 to the fetcher, **[UNVERIFIED]** on plan gating, but its existence and tool surface are corroborated by the developer docs and third-party catalogs).
- **Tool surface (representative):** `clickup_create_task`, `clickup_get_task`, `clickup_update_task`, `get_list_tasks`, doc/page tools, and crucially `clickup_set_custom_field_value_by_custom_id` — i.e. **discover available custom fields and SET their VALUES.**
- **Field-definition verdict:** the MCP exposes **read field definitions + set field values only.** It does **not** expose create / rename / reorder of custom-field *definitions*. This is not an MCP-author omission — it's an upstream API limit (see next).
- **Why:** the **ClickUp public Custom Fields API itself** supports only *Get Accessible Custom Fields*, *Set Custom Field Value*, *Remove Field Value*, and *filter tasks by field*. It has **no endpoints to create, rename, or reorder field definitions.** Confirmed directly from developer.clickup.com/docs/customfields. Any MCP built on that API inherits the same ceiling. **To create/rename/reorder a field definition you must use the ClickUp web app.**

### (c) Claude-for-Chrome + ClickUp combo
- No purpose-built "Claude-for-Chrome × ClickUp" recipe exists. The combo is generic: the extension drives the ClickUp web UI like any site. This is the **only Claude path that can touch field-definition management at all**, because it operates the UI rather than the API.

---

## 5. Practical verdict for our use case

**Goal:** rename / create / **reorder (drag)** ClickUp custom-field *definitions* — confirmed **UI-only, no public API**, therefore **no connector and no MCP can do it.** The work must be done by driving the live ClickUp web UI.

**Can Claude do it today?**

| Path | Rename field | Create field | **Drag-to-reorder** | Notes |
|---|---|---|---|---|
| ClickUp connector / ClickUp MCP | ❌ | ❌ | ❌ | API ceiling — values only, never definitions |
| Claude Computer Use (API, self-hosted) | ✅ likely | ✅ likely | ⚠️ **expressible** (`left_click_drag`) but drag is the historically weakest primitive — expect retries | Beta; needs screenshot-verify loop |
| Claude for Chrome (extension) | ✅ likely (click + type) | ✅ likely | ⚠️ **[UNVERIFIED]** — drag not documented; DOM-driven, native reorder widget may not respond | Best for click/fill/navigate; drag is the open risk |

**Bottom line:** Rename and create are achievable via a UI-driving agent (Computer Use or Claude-for-Chrome) with reasonable confidence. **The drag-to-reorder is the genuine risk** — Computer Use *can* emit a native drag (`left_click_drag`) so it's the more capable path for that specific step, but drag precision into an exact drop slot is exactly the operation Anthropic flagged as weakest and that's only partly improved by 2026. Plan for a verify-and-retry loop (screenshot → confirm new order → retry if wrong) rather than a one-shot.

**Computer Use vs Codex computer use (reliability + token cost) — [PARTIALLY UNVERIFIED]:**
- **Reliability:** Both are vision→pixel loops with the same fundamental drag weakness; neither is "solved" for precise reorder. Claude Sonnet 4.6 / Opus 4.7 brought real 2026 gains (higher-res vision, fewer coordinate offsets). A head-to-head Claude-vs-Codex computer-use drag benchmark was **not found** in this pass — do not assert a winner without a direct test.
- **Token cost:** Pixel computer-use is **screenshot-heavy** (every step ships a full image ~1.5–4.8K image tokens on the high-res Opus path), so cost is dominated by image tokens × step count, not by the text. **Claude-for-Chrome is cheaper per step than pixel Computer Use** because DOM context is far smaller than full screenshots — favor the DOM/extension path for cost wherever it can do the job, and reserve pixel Computer Use for the drag step it can't.

**Recommendation:** For a one-off or low-frequency field-reorder, the pragmatic path is **Claude for Chrome** (or Codex computer use) for the rename/create clicks, with a **human or screenshot-verified loop on the drag step** — or just do the drag by hand, since it's the single brittle action and it's UI-only anyway. Don't build an unattended pipeline around the drag until it's tested on the actual ClickUp reorder widget.

---

## Sources

- Anthropic Computer Use tool — actions & limitations (secondary coverage): https://www.digitalapplied.com/blog/anthropic-computer-use-api-guide · https://sellershorts.com/resources/ai-agent-builder/anthropic-computer-use · https://www.developersdigest.tech/blog/claude-computer-use
- Claude Q1 2026 / computer-use stabilization, Remote Control, Agent Teams: https://aimaker.substack.com/p/anthropic-claude-updates-q1-2026-guide · https://anthemcreation.com/en/artificial-intelligence/claude-march-2026-computer-use-dispatch-anthropic-updates/ · https://siliconangle.com/2026/03/23/anthropics-claude-gets-computer-use-capabilities-preview/
- Sonnet 4.6 computer-use reliability: https://www.anthropic.com/news/claude-sonnet-4-6 · https://hyperight.com/anthropic-releases-sonnet-4-6-improving-computer-use-and-complex-coding-workflows/
- Claude in Chrome (official help + coverage): https://support.claude.com/en/articles/12012173-get-started-with-claude-in-chrome · https://almcorp.com/blog/claude-for-chrome-complete-guide/ · https://itdaily.com/news/workplace/claude-for-chrome/ · https://aitoolanalysis.com/claude-in-chrome-review/
- Anthropic Connectors Directory + ClickUp connector: https://claude.com/connectors/clickup · https://github.com/rdmgator12/awesome-claude-connectors · https://aitoolsreview.co.uk/insights/claude-connectors-complete-directory
- ClickUp MCP (official + catalogs): https://help.clickup.com/hc/en-us/articles/33335772678423-What-is-ClickUp-MCP · https://developer.clickup.com/docs/connect-an-ai-assistant-to-clickups-mcp-server-1 · https://www.speakeasy.com/product/mcp-gateway/catalog/clickup
- ClickUp Custom Fields API (definition limit — primary): https://developer.clickup.com/docs/customfields
- ClickUp custom-field UI reorder (drag columns / rename from column menu): https://help.clickup.com/hc/en-us/articles/6303561371543-Edit-Custom-Fields
