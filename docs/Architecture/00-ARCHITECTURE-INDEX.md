# 00 - Architecture Index

**Project:** APR Dashboard V3/V4
**Purpose:** This directory contains the modular architecture documentation for the application.

## How to Use This Directory
Agents and developers should not read all files. Search or reference only the module relevant to your task:

| Module | Description |
|--------|-------------|
| [01-SYSTEM-OVERVIEW.md](./01-SYSTEM-OVERVIEW.md) | High-level system goals, tech stack, and primary features. |
| [02-DATA-MODELS.md](./02-DATA-MODELS.md) | Supabase relational schemas (`job_submissions`, `job_loe_details`, `report_builder_data`) and constraints. |
| [03-COMPONENT-HIERARCHY.md](./03-COMPONENT-HIERARCHY.md) | Frontend React tree, Shadcn UI usage, CSS scoping, and state management (Zustand). |
| [04-REPORT-BUILDER-ENGINE.md](./04-REPORT-BUILDER-ENGINE.md) | Deep dive into the 944+ field registry, 4-file sync requirements, and template mapping rules. |
| [05-EXTERNAL-APIS.md](./05-EXTERNAL-APIS.md) | Integration contracts for Valcre, ClickUp, Resend, and DocuSeal. |

## Agent Priming (Search Waterfall)
If an agent needs pure structural context, run a RAG search across this directory using Gemini or Cognee before reading raw files.

**Example:**
`~/.claude/scripts/search-gemini "[project:APR-Dashboard-v3] what is the database schema for job submissions"`
