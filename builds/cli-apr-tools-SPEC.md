# CLI-APR-Tools — APR Dashboard Integration Toolkit

## Brief

Build a searchable CLI toolkit for APR Dashboard integrations following the proven pattern from km-cli-tools and cli-browser-auto. Every command the QA agent used across 5 rounds of Valcre/Supabase/form testing becomes a documented, searchable, repeatable script.

This is both a developer toolkit AND the foundation for a product feature — agent support systems packaged with the app.

---

## Reference Architectures (copy these patterns exactly)

### km-cli-tools (KM-Exp)
```
~/.claude/skills/km-cli-tools/
  SKILL.md              — usage docs, quick decision tree, domain table
  scripts/search.py     — BM25 search engine with domain filtering
  data/
    task-commands.csv   — 27 rows (create, get, list, search, rename, etc.)
    viewer-commands.csv — 8 rows (open-in-viewer, open-in-browser, spawn, deep links)
    boards.csv          — 3 rows (board IDs, statuses, descriptions)
    deep-links.csv      — 4 rows (kmexp:// protocol links)
  evals/                — test queries to validate search returns correct results
```

### cli-browser-auto (Browser Automation)
```
~/.claude/skills/cli-browser-auto/
  SKILL.md              — 6 tools documented, quick decision tree, common mistakes
  scripts/search.py     — BM25 search with 7 domains, stop words, keyword boost
  data/
    agent-browser.csv     — 127 rows (navigate, interact, capture, network, auth, diff)
    playwright-cli.csv    — 72 rows (cross-browser, video, tracing)
    browser-api.csv       — 6 rows (KM-Exp browser panel)
    playwright-mcp.csv    — 21 rows (Electron testing via CDP)
    advanced-capabilities.csv — 28 rows (run_code patterns)
    ai-notes.csv          — 8 rows (screenshot annotations)
    scenarios.csv         — 25 rows ("I need to X" mappings)
```

### Pattern: What Makes These Work

1. **CSV data** with columns: `command, usage, description, example, category, keywords`
2. **search.py** with BM25 scoring + 10x keyword boost + stop word filtering
3. **--domain flag** to filter by integration area
4. **SKILL.md** with mandatory "Search Before You Act" section
5. **Naive agent validation** — deploy fresh agent with only the skill, test natural language queries
6. **Living reference doc** on the task board for changelog tracking

---

## CLI-APR-Tools Architecture

### Directory Structure
```
~/.claude/skills/cli-apr-tools/
  SKILL.md              — full docs following cli-browser-auto format
  scripts/search.py     — BM25 engine (copy from cli-browser-auto, update CSV_FILES)
  data/
    valcre.csv          — Valcre API operations (auth, job CRUD, field verify, contact mapping)
    supabase.csv        — Supabase data operations (query, upsert, health check)
    form.csv            — Intake form automation (fill, submit, verify, field mapping)
    dashboard.csv       — Dashboard UI operations (navigate, LOE fill, button states)
    docuseal.csv        — DocuSeal operations (LOE send, signature track, webhook verify)
    clickup.csv         — ClickUp task operations (create, template, status sync)
    qa.csv              — QA workflows ("run regression", "verify fields", "screenshot audit")
    deploy.csv          — Deployment operations (Vercel push, build check, proxy config)
  evals/
    search-evals.json   — natural language queries + expected results
```

### Domains (8)

| Domain | Integration | Est. Rows | Source |
|--------|------------|-----------|--------|
| `valcre` | Valcre REST API | ~30 | QA rounds 4-5 + tests/valcre/*.ts |
| `supabase` | Supabase DB | ~15 | QA agent Supabase API calls |
| `form` | Intake form | ~15 | QA round 5 form filling sequence |
| `dashboard` | Dashboard UI | ~20 | QA agent dashboard navigation |
| `docuseal` | DocuSeal e-sign | ~10 | Existing integration code |
| `clickup` | ClickUp tasks | ~10 | Existing clickup.ts |
| `qa` | QA workflows | ~15 | Round 1-5 patterns distilled |
| `deploy` | Vercel deploy | ~10 | Deploy sequence from this session |

**Estimated total: ~125 commands**

---

## Phase 1: Extract (Morning — Agent A: react-spec)

### Step 1: Read all QA deliverables
```
/tmp/apr-field-audit/round1/ through round5/
  - SUMMARY.md from each round
  - All screenshots (evidence, not needed for scripts)
  - JSON files (Valcre API responses)
```

### Step 2: Interview QA agent (dev-7 if still alive)
Send via tmux:
```
"List every agent-browser command you used across all 5 rounds.
Format: command | what it did | which round"
```

```
"List every curl/API call you made to Valcre, Supabase, or any external service.
Format: endpoint | method | what it verified"
```

```
"List every form interaction — field fills, dropdown selects, button clicks.
Format: field | action | value | which step"
```

### Step 3: Read existing test files
```
tests/valcre/test-valcre-job.ts
tests/valcre/test-valcre-job-by-number.ts
tests/valcre/test-valcre-property-types.ts
tests/valcre/test-all-property-types.ts
tests/full-workflow.spec.ts
tests/valcre-job-creation.spec.ts
```

### Step 4: Read api/valcre.ts for all field mappings
Extract every conversion map:
- INTENDED_USES_MAP
- SCOPE_OF_WORK_MAP
- REQUESTED_VALUES_MAP
- PURPOSES_MAP
- REPORT_FORMAT_MAP
- PROPERTY_TYPE_MAP

### Step 5: Build CSV files
One CSV per domain. Columns match existing pattern:
```csv
command,usage,description,example,category,keywords
```

---

## Phase 2: Build (Agent A continues)

### Step 1: Create skill directory + search engine
- Copy search.py from cli-browser-auto
- Update CSV_FILES dict with 8 APR domains
- Test with 5 queries

### Step 2: Write SKILL.md
Follow cli-browser-auto format:
- Tool overview with domain table
- "MANDATORY: Search Before You Act" section
- Quick decision tree
- Domain-by-domain command reference
- Common mistakes section
- Version history

### Step 3: Create scripts where needed
Some commands are just documentation (API call patterns).
Others need actual scripts in `~/.claude/scripts/apr/`:
- `valcre-auth.sh` — authenticate and get bearer token
- `valcre-verify-job.sh` — query job by VAL number, check all fields
- `valcre-field-audit.sh` — full field comparison (sent vs received)
- `apr-health-check.sh` — verify all integrations responding
- `apr-regression.sh` — run standard QA round against test job

---

## Phase 3: Validate (Agent B: QA agent)

### Two-Agent Validation Pattern (proven today)

**Agent A (react-spec)** builds the toolkit, then deploys **Agent B (QA agent)** to validate.

Agent B gets ONLY:
- The cli-apr-tools skill loaded
- A list of 15 natural language queries

Agent B tests:
```
"How do I create a Valcre job?"
"Verify fields landed in Valcre"
"Run a full field audit"
"Check if Supabase has the job"
"Fill the intake form with test data"
"What's the Valcre auth endpoint?"
"Run regression tests"
"Deploy to Vercel"
"Check DocuSeal signature status"
"Create a ClickUp task for this job"
"Screenshot the dashboard job detail"
"What conversion maps exist?"
"Check if the API proxy is hitting production"
"Verify contact address mapping"
"Run health check on all integrations"
```

For each query:
1. Search returns relevant command? (PASS/FAIL)
2. Command syntax is correct? (PASS/FAIL)
3. Agent can execute it without additional context? (PASS/FAIL)

**Agent A reviews results, fixes gaps, Agent B re-tests.** Loop until all 15 queries pass.

---

## Phase 4: Document + Register

1. Add cli-apr-tools to skill registry
2. Create living reference doc on task board (like task_6q15161u for km-cli-tools)
3. Add to agent-board-mapping for APR agents
4. Update APR Dashboard CLAUDE.md with toolkit reference
5. Checkpoint the whole thing

---

## Success Criteria

- [ ] 8 CSV files with ~125 total commands
- [ ] search.py returns correct result for 15/15 test queries
- [ ] Naive QA agent can execute 5 commands without additional context
- [ ] SKILL.md follows cli-browser-auto format
- [ ] At least 5 executable scripts in ~/.claude/scripts/apr/
- [ ] Registered in skill registry
- [ ] Living reference doc on board

---

## Deploy Command (Tomorrow Morning)

```bash
# Fresh react-spec on a new session
spawn-session.sh --name apr-builder --persona /agent-react-specialist \
  --msg "Read ~/Development/APR-Dashboard-v3/builds/cli-apr-tools-SPEC.md and execute it. Phase 1 first — extract from QA deliverables and existing tests. QA agent may still be alive on dev-7 — interview it if so."
```

Then CoArch monitors with:
```
/monitor-agent Session: <new-session>
```

---

## Evidence Base

All raw material lives in:
- `/tmp/apr-field-audit/round1-5/` — QA deliverables (SUMMARY.md, screenshots, JSON)
- `tests/valcre/*.ts` — existing test scripts
- `api/valcre.ts` — all field mapping logic
- `src/utils/webhooks/` — ClickUp, DocuSeal integration code
- React-spec checkpoint #117 — full session summary
- QA agent dev-7 — 621 turns of real browser automation (interview if alive)
