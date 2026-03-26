# 12 - LOE & eSignature (Master Overview)

> **AUDIT TIMESTAMP:** 2026-03-03  
> **STATUS:** Feature Completed (Production Smart Pipeline)  
> **WARNING:** The contents of the `docs/Features/12-LOE-Esign/` folder are historical design documents and mapping sheets. **DO NOT** treat them as the live codebase reality.

---

## The App's Current Truth (Read This First)

The functional reality of the LOE & eSignature flow is fully documented in the master **[UNIFIED-ARCHITECTURAL-TRUTH.md](../UNIFIED-ARCHITECTURAL-TRUTH-DRAFT.md)**.

**Key unified facts for this feature ("The Smart Pipeline"):**
- **HTML Generation:** Bypasses PandaDoc/DocuSeal mappers. Dynamically generates an HTML LOE document (`v3Template.ts`) injecting ~20 fields.
- **Editable Sections:** Features an internal UI to rewrite 7 document chunks before locking.
- **Proxy & Bypass:** A Supabase Edge Function pushes the HTML to DocuSeal. It sets `send_email: false` to bypass standard DocuSeal emails, passing the generated signing slug to a custom Resend API Edge Function.
- **Webhooks:** Listens for completion to update `job_submissions`, save the PDF natively to `job_files`, and ping ClickUp.

---

## Folder Junk Filter (What is in the old folder?)

If you enter `docs/Features/12-LOE-Esign/`, tread carefully. 

### 🛑 Ignore These (Historical Junk)
- `3-DOCUSEAL-LOE-FIELD-MAPPING.md`: Deprecated. The mapping happens dynamically in code now.
- `LOE-TEMPLATE-EDITABILITY-ANALYSIS.md`: Old planning document.

### 🟡 Potentially Useful (Reference Only)
- `LOE-DOCUSEAL-ARCHITECTURE.md`: Extremely detailed, accurate breakdown of the edge functions, webhook structures, and database writes. (This informed the Master Unified Truth, but the Unified doc is the faster read).
- `LOE-TEMPLATE-EDITABLE-SECTIONS.md`: Breaks down the exact 7 editable sections of the template string.

---

## Conclusion
The smart pipeline for LOE generation is mature and functional. The `12-LOE-Esign` folder contains excellent historical reference on *why* the edge functions were built, but the Master Unified Document describes *how* it fits into the broader application.
