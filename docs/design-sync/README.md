# design-sync — the shared folder between Claude Code (ui-designer) and Claude Design

One folder, two channels:
- Ben links THIS folder in the Claude Design chat → Design reads everything here LIVE (no push needed).
- The folder sits inside the repo working copy → it also travels with commits/pushes on clean-working.

Flow:
- ui-designer writes instructions + files here → Design reads them.
- Design's outputs: Ben downloads them INTO this folder → ui-designer picks up, wires, commits.
- Canonical shared docs: AGENT-BRIEF.md (Design's capabilities) + AGENT-LOG.md (Design's work log, ferried per session).

Design CANNOT write here or push — every file from Design arrives via Ben's download. (Its repo access is read-only.)
