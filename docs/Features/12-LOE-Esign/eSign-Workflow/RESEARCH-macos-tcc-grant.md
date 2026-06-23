---
title: "macOS Accessibility / Screen Recording grant — when the toggle won't hold (Claude Code computer-use)"
status: research
date: 2026-06-19
machine: macOS 26.5.1 (Tahoe, build 25F80), SIP enabled
tags: [#macos, #tcc, #permissions, #claude-code, #computer-use, #screen-recording]
---

# macOS TCC Grant — Definitive Methods When the System Settings Toggle Won't Hold

> **Bottom line for THIS machine:** the toggle isn't broken and TCC isn't the problem.
> Claude Code's computer-use gate is an **internal helper-bundle check**, and on this
> machine the bundle is **version-mismatched** (CLI `2.1.183` running, only the `2.1.181`
> helper provisioned on disk). macOS never even sees the permission request. Direct
> TCC.db editing and config profiles will NOT fix it. The fix is re-provisioning the
> helper bundle (reinstall / re-enable). See Section 5.

---

## 0. The machine's actual state (measured, not assumed)

| Check | Result |
|---|---|
| macOS | 26.5.1 (Tahoe), build 25F80 |
| SIP | **enabled** (`csrutil status`) |
| Running Claude Code CLI | **2.1.183** (`~/.local/share/claude/versions/2.1.183`) |
| Provisioned helper bundle(s) | **only `2.1.181`** at `~/Library/Application Support/Claude/claude-code/2.1.181/` |
| Helper bundle integrity (2.1.181) | intact — `.verified` present, `claude.app` signed, `com.anthropic.claude-code`, Team `Q6L2SF6YDW` |
| Helper bundle for 2.1.183 | **MISSING** ← this is the failure |
| Terminal Full Disk Access | **NOT granted** — `sqlite3` read of user TCC.db returns `authorization denied` |
| User TCC.db | exists, `~/Library/Application Support/com.apple.TCC/TCC.db` |

**Diagnosis:** version-mismatched helper. This is exactly GitHub issue
[#50735](https://github.com/anthropics/claude-code/issues/50735) — the CLI looks for
`~/Library/Application Support/Claude/claude-code/<RUNNING_VERSION>/.verified` + a valid
`claude.app`. The running version is `2.1.183`; only `2.1.181` is on disk. When the
per-version bundle is absent, `request_access` / `list_granted_applications` return
"Accessibility and Screen Recording permission(s) not yet granted" **regardless of actual
macOS TCC state** — the gate short-circuits before macOS is consulted. That is precisely
why toggling System Settings a dozen times does nothing: macOS isn't the gatekeeper here.

---

## 1. Direct TCC.db editing

### Where the databases live and what guards them

| Database | Path | Holds | Guard |
|---|---|---|---|
| **User** | `~/Library/Application Support/com.apple.TCC/TCC.db` | `kTCCServiceAccessibility` and most per-app grants | NOT SIP-protected, but **only a process with Full Disk Access can write it** |
| **System** | `/Library/Application Support/com.apple.TCC/TCC.db` | `kTCCServiceScreenCapture` (Screen Recording), system services | **SIP-protected** — writes require **SIP disabled** (`csrutil disable` from Recovery) |

This split is the crux: **Accessibility is user-DB (reachable with FDA), Screen Recording
is system-DB (needs SIP off).** ([HackTricks TCC](https://book.hacktricks.wiki/en/macos-hardening/macos-security-and-privilege-escalation/macos-security-protections/macos-tcc/index.html), [Entonos](https://entonos.com/2023/06/23/how-to-modify-tcc-on-macos/))

### The `access` table schema (subject to change per macOS version)

```
service, client, client_type, auth_value, auth_reason, auth_version,
csreq, policy_id, indirect_object_identifier_type, indirect_object_identifier,
indirect_object_code_identity, flags, last_modified
```

- `auth_value` = `2` → allowed; `0` → denied.
- `client_type` = `0` for a bundle ID, `1` for an absolute binary path.
- `csreq` is a **code-requirement blob** — without a matching one, macOS later invalidates
  the row and the grant "resets" (a common cause of toggles not sticking on ad-hoc-signed apps).

Build the csreq blob:
```bash
codesign -dr - /path/to/claude.app 2>&1 \
  | awk -F ' => ' '/designated/{print $2}' \
  | csreq -r- -b /tmp/csreq.bin
echo "X'$(xxd -p /tmp/csreq.bin | tr -d '\n')'"
```

### Exact INSERT shapes

Accessibility (USER db — works with Terminal FDA, no SIP change):
```bash
sqlite3 ~/Library/Application\ Support/com.apple.TCC/TCC.db \
"INSERT OR REPLACE INTO access VALUES('kTCCServiceAccessibility','com.anthropic.claude-code',0,2,4,1,X'<CSREQ_HEX>',NULL,0,'UNUSED',NULL,0,$(date +%s));"
```

Screen Recording (SYSTEM db — **requires SIP disabled**):
```bash
sqlite3 /Library/Application\ Support/com.apple.TCC/TCC.db \
"INSERT OR REPLACE INTO access VALUES('kTCCServiceScreenCapture','com.anthropic.claude-code',0,2,4,1,X'<CSREQ_HEX>',NULL,0,'UNUSED',NULL,0,$(date +%s));"
```

### Requirements / blockers
- **Terminal/iTerm must have Full Disk Access** even for the user DB. On this machine it
  does NOT (verified: `authorization denied`). So even the Accessibility insert is blocked
  until FDA is granted to the terminal first.
- **Screen Recording cannot be inserted without disabling SIP** — it lives in the
  SIP-protected system DB. `csrutil disable` requires booting Recovery, lowers system
  security materially, and Apple may still re-validate/reset the row on reboot if the csreq
  doesn't match. **High risk, not recommended.**

---

## 2. PPPC configuration profile (.mobileconfig)

### Two hard walls

1. **Screen Recording cannot be granted by ANY profile.** Apple explicitly does not allow
   MDM or any configuration profile to *enable* `kTCCServiceScreenCapture`. The PPPC payload
   only supports `Allow` for it on paper but macOS ignores it — the user must approve Screen
   Recording manually in System Settings. The only profile knob is
   `AllowStandardUserToSetSystemService` (lets a standard user flip it), not a pre-grant.
   ([ManageEngine PPPC](https://www.manageengine.com/mobile-device-management/help/profile_management/mac/mdm_mac_pppc.html), [Jamf](https://community.jamf.com/general-discussions-2/configuration-profile-to-enable-screen-recording-no-longer-functions-correctly-under-monterey-26446))

2. **PPPC payloads require MDM + supervision — they do NOT apply from a manual double-click
   install.** A manually installed (user-approved) profile silently drops the PPPC payload;
   macOS only honors `com.apple.TCC.configuration-profile-policy` from a user-approved MDM
   server. Manual install gets "profile must originate from a user-approved MDM server."
   ([MacRumors](https://forums.macrumors.com/threads/howto-import-mobileconfig-files-without-mdm.2391802/), [Addigy PPPC](https://addigy.com/blog/how-setting-up-pppc-profiles-can-improve-security-on-macos-devices/))

**Verdict:** For a non-MDM personal Mac, the PPPC route gets you **nothing** for Screen
Recording (impossible even under MDM) and **nothing for Accessibility either** without
enrolling in an MDM. Not viable here.

---

## 3. Identifying the RIGHT target app

A frequent "won't hold" cause is granting the wrong binary. For Claude Code computer-use the
target is **not** the terminal (iTerm/Terminal) and **not** the `node`/`claude` CLI binary.
It is the **bundled helper app** Claude Code provisions per version:

- **Bundle:** `~/Library/Application Support/Claude/claude-code/<VERSION>/claude.app`
- **Bundle ID:** `com.anthropic.claude-code`
- **Team ID:** `Q6L2SF6YDW`
- Needs **both** Accessibility and Screen Recording.
- (Belt-and-suspenders, also grant Claude Desktop `com.anthropicclaude` / `com.anthropic.claudefordesktop` if installed.)

Because the helper path is **version-stamped**, every CLI update points at a NEW path. If
auto-update doesn't re-provision the bundle, the grant target effectively disappears and the
gate fails — looking to the user exactly like "the toggle won't hold." Code-signing
instability (ad-hoc/unstable signature) can also cause macOS to reset a grant, but here the
2.1.181 bundle is properly Developer-ID signed, so the cause is the **missing 2.1.183
bundle**, not signing.

---

## 4. Claude Code-specific findings

- Computer-use **is** supported from terminal Claude Code (there is a built-in
  `computer-use` MCP), gated behind macOS Accessibility + Screen Recording on the helper app
  **and** an internal per-version `.verified` helper-bundle check.
- **Issue [#50735](https://github.com/anthropics/claude-code/issues/50735)** documents the
  exact failure mode on this machine: auto-update advanced the CLI version but left the
  helper bundle at the old version, so the gate returns "permission(s) not yet granted" and
  **never consults macOS TCC**. Misleading error — it means "helper bundle missing," not
  "you didn't toggle the switch."
- Status: closed as **not planned** — no official fix shipped; no `claude doctor` repair.
- Related: #41538 (`checkAccessibility undefined` on Tahoe), #42404 (computer-use fails on
  Tahoe 26), #31647 (helper/runtime missing from bundle).

---

## 5. The cleanest working method (ranked)

### ✅ Method A — Re-provision the helper bundle (THE fix for this machine)
The grant target (`2.1.183` helper) doesn't exist; create it, then the normal toggle works.

1. Remove the stale bundle so nothing short-circuits:
   ```bash
   mv ~/Library/Application\ Support/Claude/claude-code/2.1.181 ~/.Trash/
   ```
2. Re-trigger provisioning (re-enable the MCP, or cleanest, reinstall the current CLI):
   ```bash
   claude mcp disable computer-use 2>/dev/null; claude mcp enable computer-use
   # if that no-ops, reinstall the running version via the canonical installer
   ```
3. Confirm `~/Library/Application Support/Claude/claude-code/2.1.183/claude.app` + `.verified` now exist.
4. THEN grant in System Settings → Privacy & Security → **Accessibility** and **Screen
   Recording**, adding `com.anthropic.claude-code` (the helper `claude.app`). Now the toggle
   holds because macOS is finally the real gate.
5. Fully quit and relaunch the terminal/CLI after granting.

**Risk:** none meaningful — no SIP change, no DB hacking. Worst case is a CLI reinstall.

### ◑ Method B — Direct USER TCC.db insert for Accessibility only
Grant Terminal/iTerm Full Disk Access first (currently missing), then run the
`kTCCServiceAccessibility` INSERT from Section 1 with a real csreq blob. **Does not touch
Screen Recording** (system DB). Only worth it if Method A's toggle still won't stick for
Accessibility. Risk: low; a wrong csreq just gets ignored/reset.

### ✗ Method C — System TCC.db insert for Screen Recording
Requires `csrutil disable` from Recovery. **Not recommended** — disables SIP system-wide,
weakens the whole machine, and macOS may re-validate and drop the row anyway. Only if A and
B both fail and Screen Recording specifically still won't take.

### ✗ Method D — PPPC config profile
**Not viable** on a non-MDM personal Mac: needs MDM+supervision to apply, and Screen
Recording can't be profile-granted under any circumstance.

---

## Honest summary

Terminal Claude Code **can** get the permission — it is not a desktop-app-only capability.
The "toggle won't hold" symptom on this machine is **not a TCC problem at all**; it's a
version-mismatched internal helper bundle (`2.1.183` running, only `2.1.181` provisioned).
**Re-provision the helper (Method A), then the ordinary System Settings toggle works.**
Direct DB editing is a fallback for Accessibility only (needs Terminal FDA) and is useless
for Screen Recording without disabling SIP. Config profiles are a dead end without MDM.

## Sources
- [GitHub anthropics/claude-code #50735 — orphaned per-version helper](https://github.com/anthropics/claude-code/issues/50735)
- [GitHub anthropics/claude-code #38473 — computer-use permission gates](https://github.com/anthropics/claude-code/issues/38473)
- [Entonos — How to modify TCC on macOS (sqlite3 schema, csreq)](https://entonos.com/2023/06/23/how-to-modify-tcc-on-macos/)
- [HackTricks — macOS TCC (user vs system DB)](https://book.hacktricks.wiki/en/macos-hardening/macos-security-and-privilege-escalation/macos-security-protections/macos-tcc/index.html)
- [Rainforest QA — A deep dive into macOS TCC.db](https://www.rainforestqa.com/blog/macos-tcc-db-deep-dive)
- [ManageEngine — Mac PPPC](https://www.manageengine.com/mobile-device-management/help/profile_management/mac/mdm_mac_pppc.html)
- [Addigy — PPPC for standard users](https://support.addigy.com/hc/en-us/articles/4403549601043-Privacy-Preferences-Policy-Control-PPPC-for-Standard-Users)
- [MacRumors — importing .mobileconfig without MDM](https://forums.macrumors.com/threads/howto-import-mobileconfig-files-without-mdm.2391802/)
- [Jamf — Screen Recording profile no longer works](https://community.jamf.com/general-discussions-2/configuration-profile-to-enable-screen-recording-no-longer-functions-correctly-under-monterey-26446)
