# UNIFIED ARCHITECTURAL TRUTH (DRAFT)

> **STATUS:** Work In Progress
> **PURPOSE:** This is a consolidation of all scattered architecture, feature, and integration plans into one master document. Once peer-reviewed and vetted by the USER, this will be split into modular search-optimized files.

---

---

## 📑 Master Index

* **[1. System Overview & Goals](#1-system-overview--goals)**
* **[2. Data Models & Persistence](#2-data-models--persistence)**
* **[2.5 Document Hub (Feature 03 & 04)](#25-document-hub-feature-03--04)**
* **[3. External Integrations](#3-external-integrations)**
* **[4. The Report Builder Engine](#4-the-report-builder-engine)**
* **[5. The Calculator Engine](#5-the-calculator-engine)**

---
### 1. System Overview & Goals
- **The 4-Stage Workflow:**
  1. *Client Intake* (Submitting the job)
  2. *Job Management* (LOE prep, Valcre, ClickUp)
  3. *E-Signatures* (DocuSeal integration)
  4. *Report Builder* (944+ field live preview editor)
- **Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Shadcn UI, Supabase (Postgres + Auth), Zustand for client-side state, Vercel for hosting.

### 2. Data Models & Persistence
- **`job_submissions` Schema:** Core entry point for new jobs from external APIs.
- **`job_loe_details` Schema:** Specific financial details and quotes attached to a submission.
- **`report_builder_data` / `reports` Table:**
  - *Hybrid Architecture:* The planned architecture revolves around a hybrid JSONB + relational columns strategy. Columns track metadata (e.g., `job_id`, `status`, `property_address`), while a massive `data JSONB` column dynamically holds the 944+ field payload without requiring constant schema migrations.
  - *Current Status:* There are currently no formal Supabase migrations defining this table. State is currently living entirely client-side via Zustand.
  - *Priority Objective:* Implement a debounce persistence layer to auto-save the JSONB payload to Supabase.

### 2.5 Document Hub (Feature 03 & 04)
- **Vision:** Transform APR Hub into a complete pre-appraisal workflow hub before pushing to Valcre.
- **Smart Tracking:** Files are categorized (Legal, Assessment, Maps, Permits) with states (Complete, In Progress, Missing, N/A).
- **Automation Pipeline:** Intelligent scrapers and connectors automatically gather Assessment split tracking (Houski), Map imagery (GIS/Google), and Titles (SPIN2).
- **Export to Valcre:** One-click compiling of all verified documents into a Valcre-ready deliverable structure.

### 3. External Integrations
- **ClickUp:** Synchronizes task states. Must trigger *post-Valcre* job creation. Token and 401 permission errors must not be silenced; the system relies heavily on task templates.
- **Valcre:** Records the property and formalized appraisal job identifiers.
- **DocuSeal & LOE E-Signatures (The "Smart Pipeline"):** 
  - *Architecture:* Built to avoid the painful mapping UI of DocuSeal and PandaDoc. 
  - *HTML Generation & Editability:* The system natively generates an HTML LOE document (`v3Template.ts`) by dynamically injecting ~20 fields directly from the dashboard state. Crucially, the app features an internal LOE editing interface that allows the user to re-write 7 distinct document sections (like the Intro, Authorized Use, Delivery Date, and the massive Terms & Conditions block) *before* locking it as a PDF.
  - *The Proxy & Bypass:* A Supabase Edge Function pushes the locked HTML block directly to DocuSeal. DocuSeal invisibly places signatures over the `<signature-field>` anchor tags. Crucially, it sets `send_email: false` to bypass DocuSeal's generic emails, instead passing the generated signing slug to a custom **Resend API Edge Function** for fully branded client delivery.
  - *Webhooks:* The `docuseal-webhook` listens for completion, auto-updates the Supabase `job_submissions` state to `loe_signed`, saves the final PDF to `job_files`, and pings the ClickUp API to update the task timeline in real-time.

### 4. The Report Builder Engine
- **Master Field Registry:** Over 944 fields are mapped.
- **The 4-File Sync Rule:** Any edit to a field requires updating:
  1. `fieldRegistry.ts`
  2. The `TestDataSet`
  3. `Report-MF-template.html` (The HTML View)
  4. `EditPanel` components (The User Input)
- **Live Preview Rendering:** Uses side-by-side splits where Zustand state changes instantly recalculate the visual output.

### 5. The Calculator Engine
- **Field Mappings:** The engine maps exactly 62 critical inputs and computes dozens of outputs (like `calc-pgr`, `calc-noi`, `calc-indicated-value`). It maps specifically to Pages 43 (Income), 44 (Expenses), 45 (Cap Rate), 49 (Direct Cap), 50 (Conclusion), and 63 (Reconciliation) of the Master Template.
- **Mathematical Core & State Integration:** The calculator is implemented inside `reportBuilderStore` using a core `runCalculations()` function. The calculations run automatically upon field changes (real-time recalculation) and sync back into the Zustand store.
- **The Non-Invasive Wrapper Architecture:** For interactive components (like the standalone Calculator Demo at `/calculator-demo`), a hook `useCalculationSteps` re-implements the logic in parallel to extract intermediate step breakdowns without mutating the pristine, validated core engine. This ensures the 8-step logic (Unit Mix → Other Income → PGR → Vacancy → Expenses → NOI → Value) is transparent without polluting the master store output.

---
