# Antigravity Gemini Agent Prompt: Field ID Audit

**Purpose:** Complete prompt to give to Antigravity native Gemini agent for automated field ID auditing

**Usage:** Copy this entire prompt and paste it into Antigravity's Gemini agent interface

---

## PROMPT FOR GEMINI AGENT

```
GOAL: Audit Report Builder field IDs - find missing fields between templates and registry

CONTEXT:
You are testing the APR Dashboard Report Builder.
Project location: /Users/bencrowe/Development/APR-Dashboard-v3
This is a code audit task, NOT a browser task (no dev server needed).

FILES TO ANALYZE:
1. Template file: /Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/templates/reportPageTemplates.ts
2. Registry file: /Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/schema/fieldRegistry.ts
3. Test data file: /Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/data/northBattlefordTestData-REAL.ts

STEPS:
1. Read reportPageTemplates.ts completely
2. Find ALL instances of: getFieldValue(sections, 'FIELD-ID')
   - Use regex: getFieldValue\(sections,\s*['"]([^'"]+)['"]\)
   - Extract the field ID from each match
   - Create list of unique field IDs used in templates
   - Count total unique field IDs

3. Read fieldRegistry.ts completely
4. Find ALL instances of: storeId: 'FIELD-ID'
   - Use regex: storeId:\s*['"]([^'"]+)['"]
   - Extract the storeId value from each match
   - Create list of unique field IDs in registry
   - Count total unique field IDs

5. Compare the two lists:
   - Fields in TEMPLATES but NOT in REGISTRY = Missing fields (these need to be added)
   - Fields in REGISTRY but NOT in TEMPLATES = Unused fields (informational only)

6. Categorize missing fields by pattern/prefix:
   - site-* (Site-related fields)
   - frontage-* (Frontage/traffic fields)
   - inspection-* (Inspection fields)
   - zoning-* (Zoning fields)
   - Other (uncategorized)

7. Generate detailed audit report

EXPECTED OUTPUT:
Create a markdown file at: /Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/FIELD-AUDIT-RESULTS.md

The report should contain:

# Field ID Audit Report

**Date:** [Current date]
**Audited by:** Gemini Agent
**Status:** [PASS/NEEDS REVIEW]

## Summary

- **Template field IDs:** [count]
- **Registry field IDs:** [count]
- **Missing from registry:** [count] ← THIS IS THE KEY NUMBER
- **Unused in templates:** [count]

## Missing Fields (Need to Add to Registry)

[If ~40 fields missing, this matches expectations - PASS]
[If significantly more/less, flag for review - NEEDS REVIEW]

### Site Fields ([count])
- site-corner
- site-grade
- site-quality
- [list all site-* fields]

### Frontage/Traffic Fields ([count])
- frontage-street-1
- frontage-street-2
- [list all frontage-* and traffic-* fields]

### Inspection Fields ([count])
- inspection-appraiser-1
- inspection-date-1
- [list all inspection-* fields]

### Zoning Fields ([count])
- zoning-district-type
- zoning-permitted-uses
- [list all zoning-* fields]

### Other Fields ([count])
- [list all other uncategorized fields]

## Unused Fields (In Registry but Not Used)

[List fields that exist in registry but aren't used in any templates]
[This is informational - may be for future pages or deprecated fields]

## Verification Against Documentation

Compare missing fields list to CLAUDE.md documentation:
- Location: /Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/.claude/CLAUDE.md
- Expected missing fields documented: ~40 fields
- Match status: [MATCHES/DISCREPANCY]

If discrepancy found:
- List unexpected missing fields not in CLAUDE.md
- This indicates either:
  a) CLAUDE.md needs updating
  b) New fields added to templates without documentation

## Recommendations

[Based on count of missing fields:]
- If 35-45 missing fields: PROCEED with field addition sessions
- If <35 missing fields: Investigate - may have already been added
- If >45 missing fields: Investigate - may indicate template issues

## Next Steps

1. Review this audit report
2. Confirm missing fields list matches expectations
3. Use this list as work queue for field addition
4. Proceed with vibe coding workflow to add fields

---

**Audit Complete**

END OF EXPECTED OUTPUT

IF ERRORS OCCUR:
- File not found: Report exact path that failed and suggest correction
- Regex not matching: Show sample text from file and regex pattern used
- Parse errors: Report line number and content causing issue
- Permission denied: Check file permissions

CONSTRAINTS:
- Do NOT modify any files
- Do NOT run dev server
- Do NOT navigate browser
- This is a READ-ONLY code analysis task
- Only create the FIELD-AUDIT-RESULTS.md report file

SUCCESS CRITERIA:
- File created at correct location
- Contains accurate count of template field IDs
- Contains accurate count of registry field IDs
- Missing fields list is complete and categorized
- Report format is clean markdown
- Comparison to CLAUDE.md completed
- Recommendations provided
```

---

## HOW TO USE THIS PROMPT

1. **Open Antigravity IDE**
2. **Create/Select Gemini native agent** (not browser agent - code analysis agent)
3. **Copy the entire prompt above** (between the triple backticks)
4. **Paste into Gemini agent interface**
5. **Run the agent**
6. **Wait for completion** (should take 1-2 minutes)
7. **Review the generated report** at `/docs/15-Contract-review/1-Formatting & Report/FIELD-AUDIT-RESULTS.md`

---

## EXPECTED RESULTS

**If successful:**
- File `FIELD-AUDIT-RESULTS.md` created
- Shows ~40 missing fields (matches expectations)
- Missing fields categorized by type
- Clear next steps provided

**If issues:**
- Gemini will report specific errors
- File paths, regex patterns, or permissions issues
- Can adjust prompt and re-run

---

## NEXT PROMPTS (AFTER FIELD AUDIT SUCCEEDS)

After confirming field audit results, you can run additional verification tests:

### Test 2: Page Count Validation (requires dev server)
### Test 3: Visual Validation (requires dev server + browser)
### Test 4: Data Flow Test (requires dev server + browser)

*(These will be separate prompts since they need browser automation)*

---

**Save this file for reference - it's your template for running automated field audits**
