# 01 - System Overview

## App Description
The APR Dashboard is a 4-stage appraisal workflow system targeting comprehensive report generation, quotes management, CRM entry, and E-Signatures.

## The 4 Stages
1. **Client Intake (Submission):** Jobs are mapped in from external requests. Integrations typically parse this.
2. **Job Management (LOE):** Managing line-of-effort, producing quotes, tying into external PM tools.
3. **E-Signature:** Pushing the generated agreements out via DocuSeal for client signature.
4. **Report Builder:** The massive core application capable of maintaining 944+ distinct form fields to generate live HTML-preview reports.

## Core Tech Stack
- React 18 / TypeScript
- Vite Build Tool
- Tailwind CSS & Shadcn UI
- Supabase Backend (Postgres + Auth)
- Zustand (Client-side state)
- Vercel (Front-end hosting)

*(Reviewer check: Please confirm this tech stack accurately represents current goals vs V4 plans.)*
