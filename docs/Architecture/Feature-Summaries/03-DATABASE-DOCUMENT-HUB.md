# 03 - Database & Document Hub (Master Overview)

> **AUDIT TIMESTAMP:** 2026-03-03  
> **STATUS:** Planned/Partial (Hybrid Database strategy formulated)  
> **WARNING:** The contents of the `docs/Features/03-Database-Document-Hub/` folder are largely historical planning documents. **DO NOT** treat the individual files in that folder as the final implemented truth.

---

## The App's Current Truth (Read This First)

The architectural reality of the Database and Document Hub is tracked in the master **[UNIFIED-ARCHITECTURAL-TRUTH.md](../UNIFIED-ARCHITECTURAL-TRUTH-DRAFT.md)**.

**Key unified facts for this feature:**
- **The Hybrid JSONB Strategy:** The `report_builder_data` mapping (944+ fields) does NOT use individual SQL columns. It uses a hybrid `JSONB` approach where metadata is queryable but the payload remains a dynamic JSON blob.
- **The Document Hub Pipeline:** Serves as a pre-appraisal workflow hub before pushing to Valcre. It uses automated scrapers (SPIN2, Houski, GIS) with smart status tracking (Complete/Missing/NA) for Legal, Assessment, Maps, and Permits.

---

## Folder Junk Filter (What is in the old folder?)

If you enter `docs/Features/03-Database-Document-Hub/`, treat its contents as deprecated context and brainstorms:

### 🛑 Ignore These (Historical Junk)
- `README.md` and `SECTION-4-DATABASE-FIELDS.md`: These contain old tables and static schema ideas. They have been superseded by the actual Supabase DB and the Hybrid JSONB reality.
- `doc-mgt. to review old possibly/`: 13 files of outdated notes.
- `SMART-DOCUMENT-LINKS-SYSTEM.md`: Exploratory brainstorms about UI features.

### 🟡 Potentially Useful (Reference Only)
- `SECTION-4-DOCUMENT-HUB-PLAN.md`: A great high-level conceptual outline of the UI vision for the 4 document categories, but remember it is a *plan*, not the *code*.

---

## Conclusion
Do not rely on the legacy `03-Database-Document-Hub` folder for implementation truths. The single truth of the database structure lives in the codebase's Supabase migrations and the `UNIFIED-ARCHITECTURAL-TRUTH.md`.
