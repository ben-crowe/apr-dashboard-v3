# APR Dashboard — Integration Roadmap

Future integrations to build, test with QA agent, and add to cli-apr-tools.

---

## SharePoint File Storage

**URL:** https://valtapropertyvaluations.sharepoint.com/sites/V/Shared%20Documents/Forms/AllItems.aspx
**API:** MS Graph API for SharePoint Online
**Purpose:** Document storage per job — reports, comps, photos, supporting docs
**Pattern:** Auto-create folder per VAL job, upload generated reports, pull existing documents into Report Builder
**Credentials:** Ben to provide
**cli-apr-tools domain:** `sharepoint` or `storage`

---

## Email — Two Systems

### 1. Resend (Automated/Transactional) — EXISTING
- Already integrated for DocuSeal signature notifications
- No-reply type emails, system alerts, status updates
- Templates, webhooks, delivery tracking
- "Your LOE is ready for signature" type
- **cli-apr-tools domain:** `email-auto`

### 2. Valta Business Email (Client-Facing) — NEW
- Real Valta email address (chris@valta.ca or similar)
- Client follow-up, scheduling, questions
- Must be reply-able, show as real person in inbox
- API: Likely MS 365 / Outlook API (Valta already on SharePoint/MS ecosystem)
- Agent-assisted drafting: agent drafts based on job context, Chris reviews and sends
- **cli-apr-tools domain:** `email-client`
- **Credentials:** Ben to confirm if Valta uses MS 365 or other email provider

### Key Distinction
| Type | Tool | From Address | Reply-able | Use Case |
|------|------|-------------|-----------|----------|
| Automated | Resend | no-reply@valta.ca | No | LOE ready, signature complete, status alerts |
| Client-facing | MS 365 / Outlook | chris@valta.ca | Yes | Follow-ups, scheduling, questions |

---

## Pipedrive CRM

- Kill Pipedrive workstream from Platform Strategy
- Lead stages, pipeline views, automated email triggers, client history, deal tracking
- **cli-apr-tools domain:** `pipedrive`

---

## Document Hub Scrapers

- SPIN2 (titles)
- Houski (assessment data)
- GIS/Google (maps, satellite imagery)
- Pre-appraisal data gathering — automated
- Prototype for agent-as-operator at scale
- **cli-apr-tools domain:** `scraper`

---

## ClickUp Refinement

- Current integration works but needs end-to-end verification
- New job → auto-create ClickUp task → assign template → sync status back
- Edge cases likely exist — needs QA agent browser testing round
- Already has cli-apr-tools domain: `clickup`

---

## Integration Test Priority

1. ClickUp full flow verification (existing, needs testing)
2. SharePoint file storage (new, Ben has credentials)
3. Valta business email (new, confirm MS 365)
4. Pipedrive CRM (new, Kill Pipedrive workstream)
5. Document Hub scrapers (new, longest timeline)

Each integration follows the same cycle:
Build → QA agent tests with agent-browser → extract commands into cli-apr-tools CSV → search engine picks them up
