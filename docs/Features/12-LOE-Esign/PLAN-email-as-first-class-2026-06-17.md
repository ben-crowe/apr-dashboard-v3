# Email-as-First-Class Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Promote email to a first-class sibling of documents — a named template library, an opt-in preview, a direct inline send, save-to-job draft/sent, and an optional document↔email default pairing.

**Architecture:** Mostly UI on top of an existing data layer. Extend `email_templates` (additive columns: pairing + channel + trigger) and add library CRUD that mirrors the document-template functions. Surface two template dropdowns + an inline `[template ▼][👁][Send]` control; reuse `EmailComposeModal` as the opt-in previewer; wire the already-written `job_email_instances` load/save so emails persist on the job.

**Tech Stack:** React 18 + TypeScript (strict) + Vite, Tailwind + Shadcn UI, Supabase (PostgreSQL + RLS), Resend (send), Zustand elsewhere (not needed here).

**Source spec:** `docs/Features/12-LOE-Esign/SPEC-email-as-first-class-2026-06-17.md`

## Global Constraints

- TypeScript strict — no `any`. All new code fully typed.
- UI: Tailwind + Shadcn only. No generic CSS. Match existing `LOEPreviewModal` / `LoeQuoteSection` patterns.
- Supabase migrations are additive only — no destructive changes; existing rows must keep working (safe defaults).
- Dev port is **8086** (`vite.config.ts`), NOT 5173. Headless browser testing only (`agent-browser`, never `--headed`).
- No workarounds for build failures (no symlinks/aliases/route-disables) — fix root cause.
- Verify gates per task: `npx tsc --noEmit` clean, `npm run build` clean (passes the drift gate), and a headless visual check of any new/changed surface (screenshot + read). Visual is the only ground truth for UI — never claim a surface done off typecheck alone.
- Deploy to the test instance with `vercel --prod` and report the deploy; Ben tests the DEPLOYED build.
- Every email send must write a job-scoped `job_email_instances` row (the future sequence-map timeline depends on faithful logging).

---

## File Structure

- `supabase/migrations/2026061715xxxx_email_templates_pairing_channel_trigger.sql` — **create**: additive columns.
- `src/utils/loe/emailTemplate.ts` — **modify**: add library CRUD + pairing resolver; extend `EmailTemplate` type.
- `src/components/dashboard/job-details/actions/EmailComposeModal.tsx` — **modify**: preview-first, Email Templates dropdown, Save-as-draft / Save-as-version, Back-to-Preview, optional pairing.
- `src/components/dashboard/job-details/actions/LOEPreviewModal.tsx` — **modify**: rename picker label → "Document Templates"; replace footer "Continue to Email" with the inline Send-by-Email control.
- `src/components/dashboard/job-details/actions/SendByEmailControl.tsx` — **create**: the reusable `[template ▼][👁][Send]` row.
- `src/components/dashboard/job-details/LoeQuoteSection.tsx` — **modify**: document-less email entry; email draft/sent pills; refresh wiring.

---

## Task 1: Migration — pairing + channel + trigger columns

**Files:**
- Create: `supabase/migrations/2026061715xxxx_email_templates_pairing_channel_trigger.sql`

**Interfaces:**
- Produces: `email_templates.paired_template_id UUID NULL`, `email_templates.channel TEXT NOT NULL DEFAULT 'email'`, `email_templates.trigger TEXT NOT NULL DEFAULT 'manual'`. (`job_email_instances` already exists from `20260614120000_create_email_templates.sql` — verify, don't recreate.)

- [ ] **Step 1: Write the migration**

```sql
-- Email templates as a typed library: optional document pairing + channel + trigger.
-- Additive only; safe defaults keep the existing single default row valid.
ALTER TABLE email_templates
  ADD COLUMN IF NOT EXISTS paired_template_id UUID NULL,   -- → loe_templates.id (default email for that doc)
  ADD COLUMN IF NOT EXISTS channel TEXT NOT NULL DEFAULT 'email',   -- 'email' | 'popup'
  ADD COLUMN IF NOT EXISTS "trigger" TEXT NOT NULL DEFAULT 'manual'; -- 'manual' | 'after_sign'

CREATE INDEX IF NOT EXISTS idx_email_templates_paired ON email_templates (paired_template_id);
```

- [ ] **Step 2: Apply it** (react-specialist/builder has Supabase access)

Run: apply via Supabase MCP / CLI against `ngovnamnjmexdpjtcnky`.
Expected: columns present; `select paired_template_id, channel, "trigger" from email_templates limit 1;` returns the seeded default with `channel='email'`, `trigger='manual'`, `paired_template_id=null`.

- [ ] **Step 3: Confirm `job_email_instances` exists**

Run: `select count(*) from job_email_instances;`
Expected: returns a count (0+), no "relation does not exist". If missing, the `20260614120000` migration never ran — apply it first.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/2026061715xxxx_email_templates_pairing_channel_trigger.sql
git commit -m "feat(email): add pairing/channel/trigger columns to email_templates"
```

---

## Task 2: Email-template library functions

**Files:**
- Modify: `src/utils/loe/emailTemplate.ts`

**Interfaces:**
- Consumes: existing `supabase` client, `EMAIL_SEED_SUBJECT/BODY`, `EmailTemplate` interface.
- Produces:
  - extend `EmailTemplate` with `paired_template_id: string | null; channel: 'email' | 'popup'; trigger: 'manual' | 'after_sign';`
  - `loadAllEmailTemplates(): Promise<EmailTemplate[]>` (default first, then name)
  - `saveEmailTemplate(input: SaveEmailTemplateInput): Promise<{ success: boolean; id?: string; error?: string }>`
  - `setDefaultEmailTemplate(id: string): Promise<boolean>`
  - `resolveEmailTemplateForDocument(docTemplateId: string | null, all: EmailTemplate[]): EmailTemplate | null`

- [ ] **Step 1: Extend the type**

```ts
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body_html: string;
  is_default: boolean;
  paired_template_id: string | null;
  channel: 'email' | 'popup';
  trigger: 'manual' | 'after_sign';
}
```

- [ ] **Step 2: Add `loadAllEmailTemplates`**

```ts
export async function loadAllEmailTemplates(): Promise<EmailTemplate[]> {
  const { data, error } = await supabase
    .from('email_templates')
    .select('*')
    .order('is_default', { ascending: false })
    .order('name', { ascending: true });
  if (error) { console.error('loadAllEmailTemplates:', error); return []; }
  return (data ?? []) as EmailTemplate[];
}
```

- [ ] **Step 3: Add `SaveEmailTemplateInput` + `saveEmailTemplate`**

```ts
export interface SaveEmailTemplateInput {
  id?: string;                 // present = update in place; absent = insert new version
  name: string;
  subject: string;
  body_html: string;
  setAsDefault?: boolean;
  pairedTemplateId?: string | null;
  channel?: 'email' | 'popup';
  trigger?: 'manual' | 'after_sign';
}

export async function saveEmailTemplate(
  input: SaveEmailTemplateInput,
): Promise<{ success: boolean; id?: string; error?: string }> {
  // Enforce single default (unique index allows only one is_default=true).
  if (input.setAsDefault) {
    await supabase.from('email_templates').update({ is_default: false }).eq('is_default', true);
  }
  const row = {
    name: input.name,
    subject: input.subject,
    body_html: input.body_html,
    is_default: input.setAsDefault ?? false,
    paired_template_id: input.pairedTemplateId ?? null,
    channel: input.channel ?? 'email',
    trigger: input.trigger ?? 'manual',
    updated_at: new Date().toISOString(),
  };
  if (input.id) {
    const { error } = await supabase.from('email_templates').update(row).eq('id', input.id);
    return error ? { success: false, error: error.message } : { success: true, id: input.id };
  }
  const { data, error } = await supabase.from('email_templates').insert(row).select('id').single();
  return error ? { success: false, error: error.message } : { success: true, id: data?.id };
}
```

- [ ] **Step 4: Add `setDefaultEmailTemplate` + `resolveEmailTemplateForDocument`**

```ts
export async function setDefaultEmailTemplate(id: string): Promise<boolean> {
  await supabase.from('email_templates').update({ is_default: false }).eq('is_default', true);
  const { error } = await supabase.from('email_templates').update({ is_default: true }).eq('id', id);
  if (error) { console.error('setDefaultEmailTemplate:', error); return false; }
  return true;
}

/** Pre-select the email for a document: the template paired to it, else the global default. */
export function resolveEmailTemplateForDocument(
  docTemplateId: string | null,
  all: EmailTemplate[],
): EmailTemplate | null {
  if (docTemplateId) {
    const paired = all.find(t => t.paired_template_id === docTemplateId);
    if (paired) return paired;
  }
  return all.find(t => t.is_default) ?? all[0] ?? null;
}
```

- [ ] **Step 5: Typecheck + commit**

Run: `npx tsc --noEmit` → Expected: clean.
```bash
git add src/utils/loe/emailTemplate.ts
git commit -m "feat(email): email-template library CRUD + document pairing resolver"
```

---

## Task 3: Wire job_email_instances (draft/sent persistence)

**Files:**
- Modify: `src/components/dashboard/job-details/LoeQuoteSection.tsx`

**Interfaces:**
- Consumes: existing `loadJobEmailInstances(jobId)`, `saveJobEmailInstance(input)`, `EmailInstance` from `emailTemplate.ts`.
- Produces: `emailInstances` state + `refreshEmailInstances()` in `LoeQuoteSection`, and a `saveEmailInstance(state)` helper passed to the previewer/control.

- [ ] **Step 1: Add state + loader** (mirror the existing contract refresh pattern)

```ts
const [emailInstances, setEmailInstances] = useState<EmailInstance[]>([]);
const refreshEmailInstances = useCallback(async () => {
  setEmailInstances(await loadJobEmailInstances(job.id));
}, [job.id]);
useEffect(() => { void refreshEmailInstances(); }, [refreshEmailInstances]);
```

- [ ] **Step 2: Add a save helper used by the send + draft paths**

```ts
const persistEmailInstance = async (args: {
  id?: string; subject: string; bodyHtml: string;
  recipientEmail: string; contractId: string | null; state: 'draft' | 'sent';
}) => {
  const res = await saveJobEmailInstance({
    id: args.id, jobId: job.id, contractId: args.contractId ?? undefined,
    recipientEmail: args.recipientEmail, subject: args.subject,
    bodyHtml: args.bodyHtml, state: args.state,
  });
  if (!res.success) toast.error(`Saving email failed: ${res.error}`);
  await refreshEmailInstances();
  return res;
};
```

- [ ] **Step 3: Typecheck + commit**

Run: `npx tsc --noEmit` → Expected: clean.
```bash
git add src/components/dashboard/job-details/LoeQuoteSection.tsx
git commit -m "feat(email): wire job_email_instances load/save into the job"
```

> Verification note: `job_email_instances` is RLS `authenticated`-write. A headless/anon agent-browser session SILENTLY no-ops the write (table stays empty though the UI looks fine). Prove the draft/sent persist under a REAL login, or pre-seed via service-role SQL — never false-pass on anon.

---

## Task 4: SendByEmailControl — the inline `[template ▼][👁][Send]` row

**Files:**
- Create: `src/components/dashboard/job-details/actions/SendByEmailControl.tsx`

**Interfaces:**
- Consumes: `loadAllEmailTemplates`, `resolveEmailTemplateForDocument` (Task 2).
- Produces: `<SendByEmailControl docTemplateId={...} onSend={(tpl) => Promise} onPreview={(tpl) => void} disabled={...} />` where `tpl: EmailTemplate`.

- [ ] **Step 1: Build the control**

```tsx
import React, { useEffect, useState } from 'react';
import { Eye, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { loadAllEmailTemplates, resolveEmailTemplateForDocument, EmailTemplate } from '@/utils/loe/emailTemplate';

interface Props {
  docTemplateId: string | null;          // null for a document-less email
  onSend: (tpl: EmailTemplate) => Promise<void>;
  onPreview: (tpl: EmailTemplate) => void;
  disabled?: boolean;
}

const SendByEmailControl: React.FC<Props> = ({ docTemplateId, onSend, onPreview, disabled }) => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    void (async () => {
      const all = (await loadAllEmailTemplates()).filter(t => t.channel === 'email');
      setTemplates(all);
      setSelectedId(resolveEmailTemplateForDocument(docTemplateId, all)?.id ?? '');
    })();
  }, [docTemplateId]);

  const selected = templates.find(t => t.id === selectedId) ?? null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground whitespace-nowrap">Send by Email:</span>
      <Select value={selectedId} onValueChange={setSelectedId} disabled={disabled || !templates.length}>
        <SelectTrigger className="h-8 w-[220px] text-sm"><SelectValue placeholder="Email template" /></SelectTrigger>
        <SelectContent>
          {templates.map(t => (
            <SelectItem key={t.id} value={t.id}>
              {t.name}{t.is_default ? ' (default)' : ''}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="ghost" size="sm" className="h-8 gap-1" disabled={!selected}
        onClick={() => selected && onPreview(selected)} title="Preview / edit the email">
        <Eye className="h-4 w-4" /> Preview
      </Button>
      <Button variant="outline" size="sm" className="h-8 gap-1" disabled={disabled || isSending || !selected}
        onClick={async () => { if (!selected) return; setIsSending(true); try { await onSend(selected); } finally { setIsSending(false); } }}>
        {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send
      </Button>
    </div>
  );
};
export default SendByEmailControl;
```

- [ ] **Step 2: Typecheck + commit**

Run: `npx tsc --noEmit` → Expected: clean.
```bash
git add src/components/dashboard/job-details/actions/SendByEmailControl.tsx
git commit -m "feat(email): inline Send-by-Email control (template picker + preview + send)"
```

---

## Task 5: EmailComposeModal — preview-first, template dropdown, save-as-version

**Files:**
- Modify: `src/components/dashboard/job-details/actions/EmailComposeModal.tsx`

**Interfaces:**
- Consumes: `loadAllEmailTemplates`, `saveEmailTemplate`, `EmailTemplate` (Task 2); a new optional `initialTemplate?: EmailTemplate` prop and `onSaveDraft?: (subject, bodyHtml) => Promise<void>` prop.
- Produces: an `EmailComposeModal` that (a) opens in read-only preview, (b) reveals the split editor on "Edit" with a "Back to Preview" exit, (c) has an Email Templates dropdown that reloads body/subject on change, (d) offers "Save as draft" and "Save as version" (name + set-default + pair-to-document).

- [ ] **Step 1: Add `viewMode` state** (`'preview' | 'edit'`, default `'preview'`); render the existing left/right split only in `'edit'`, and a single full-width rendered preview in `'preview'` with an "Edit" button. Reuse the existing `previewHtml`.

- [ ] **Step 2: Add the Email Templates dropdown** in the header; on change call `loadAllEmailTemplates` results and set `subject`/`bodyHtml` + `seedTick`. Pre-select `initialTemplate`.

- [ ] **Step 3: Add "Back to Preview"** button in the edit-mode header (`setViewMode('preview')`) — mirrors the document editor's exit; no save required.

- [ ] **Step 4: Add "Save as draft"** → `onSaveDraft?.(subject, bodyHtml)` (persists a `job_email_instances` draft via Task 3 helper, wired by the parent).

- [ ] **Step 5: Add "Save as version"** → a small dialog (name, "Set as default", "Pair to current document") → `saveEmailTemplate({...})`; on success refresh the dropdown.

- [ ] **Step 6: Typecheck + visual check + commit**

Run: `npx tsc --noEmit` → clean. Then headless: open a job, trigger the previewer, screenshot preview mode + edit mode + back-to-preview; Read the PNGs; confirm dropdown + buttons render and the rendered email matches the template.
```bash
git add src/components/dashboard/job-details/actions/EmailComposeModal.tsx
git commit -m "feat(email): preview-first email modal w/ template dropdown + save-as-version"
```

---

## Task 6: LOEPreviewModal — rename picker + inline send control

**Files:**
- Modify: `src/components/dashboard/job-details/actions/LOEPreviewModal.tsx`

**Interfaces:**
- Consumes: `SendByEmailControl` (Task 4), `EmailComposeModal` (Task 5), `selectedTemplateId` (the document template id, already in this component).
- Produces: footer Send-by-Email row replacing "Continue to Email"; previewer opened only via the control's `onPreview`.

- [ ] **Step 1: Rename the document picker label** `Template:` → `Document Templates:` (line ~348).

- [ ] **Step 2: Replace the footer "Continue to Email" button** with `<SendByEmailControl docTemplateId={selectedTemplateId} onSend={...} onPreview={() => setShowEmailStep(true)} disabled={isSending} />`. `onSend` resolves merge tokens, calls the existing send path, and persists a `sent` instance (via the parent helper, Task 3). Keep the previewer (`EmailComposeModal`) mounted, opened by `onPreview`.

- [ ] **Step 3: Typecheck + build + visual + commit**

Run: `npx tsc --noEmit` → clean; `npm run build` → clean. Headless: open a sent/draft document → confirm the footer shows `[Document Templates label]`, the `Send by Email [▼][👁][Send]` row, paired email pre-selected. Screenshot + Read.
```bash
git add src/components/dashboard/job-details/actions/LOEPreviewModal.tsx
git commit -m "feat(email): two-dropdown header + inline Send-by-Email in LOE preview"
```

---

## Task 7: Document-less email entry + email draft/sent pills on the job

**Files:**
- Modify: `src/components/dashboard/job-details/LoeQuoteSection.tsx`

**Interfaces:**
- Consumes: `SendByEmailControl` (Task 4), `EmailComposeModal` (Task 5), `emailInstances` + `persistEmailInstance` (Task 3).
- Produces: a document-less Send-by-Email entry (beside "Create Contract") with `docTemplateId={null}`; an email draft/sent list rendered like the contract pills.

- [ ] **Step 1: Add the document-less control** beside Create Contract: `<SendByEmailControl docTemplateId={null} onSend={tpl => /* send + persist sent, contractId:null */} onPreview={tpl => /* open EmailComposeModal initialTemplate=tpl */} />`.

- [ ] **Step 2: Render email pills** from `emailInstances` reusing the contract-pill markup (FileSignature→Mail icon; draft = blue, sent = green; newest-first, draft above sent). Draft "Open" → previewer editable; sent "Open" → previewer read-only. Drafts deletable; sent locked.

- [ ] **Step 3: Mount one `EmailComposeModal`** at this level for the document-less + pill-open paths, wired to `persistEmailInstance` for Save-as-draft and to refresh on close.

- [ ] **Step 4: Typecheck + build + visual + commit**

Run: `npx tsc --noEmit` → clean; `npm run build` → clean. Headless: from the job (no document) pick the default email → Send → confirm a `sent` email pill appears; open the previewer → Save draft → confirm a `draft` pill. Screenshot + Read. (Persist proof under a REAL login per Task 3 note.)
```bash
git add src/components/dashboard/job-details/LoeQuoteSection.tsx
git commit -m "feat(email): document-less send entry + email draft/sent pills on the job"
```

---

## Task 8: Document↔email pairing UX + end-to-end verify + deploy

**Files:**
- Modify: `src/components/dashboard/job-details/actions/EmailComposeModal.tsx` (pairing control inside Save-as-version — built in Task 5 Step 5; this task verifies the round trip).

- [ ] **Step 1: Confirm the pairing round trip** — Save-as-version with "Pair to current document" set → reopen the paired document's Send-by-Email → that email is pre-selected (no manual pick). Headless screenshot both ends.

- [ ] **Step 2: Full-flow visual pass** — (a) document fast path: open LOE → Send by Email (paired pre-selected) → Send → sent pill; (b) review path: 👁 → edit → Back to Preview → Send; (c) document-less: thank-you style send; (d) save-as-version appears in the dropdown. Read each PNG; confirm key elements + that the rendered email matches the chosen template (font/colors present, not blank).

- [ ] **Step 3: Build + deploy + report**

Run: `npm run build` → clean. `vercel --prod` → capture the production URL. Report to Ben that it's DEPLOYED (built+committed-local ≠ deployed).

- [ ] **Step 4: Commit any final fixes**

```bash
git add -A
git commit -m "feat(email): document↔email pairing verified + full-flow visual pass"
```

---

## Self-Review (author check against the spec)

- **Spec §3 data model** → Tasks 1–2 (columns + CRUD + resolver). ✓
- **Spec §4A two dropdowns** → Task 6 Step 1 (rename) + Task 5 Step 2 (email dropdown). ✓
- **Spec §4B inline send control (opt-in preview)** → Task 4 + Task 6 Step 2. ✓
- **Spec §4C preview-first editor + save-as-version** → Task 5. ✓
- **Spec §4D save-to-job pills** → Task 3 + Task 7 Step 2. ✓
- **Spec §4 document-less send** → Task 7 Step 1. ✓
- **Spec pairing (resolve + author)** → Task 2 resolver + Task 5 Step 5 + Task 8. ✓
- **Spec §8 future types** → channel/trigger columns exist + editable (Task 1, Task 5 Step 5); firing/popup render explicitly NOT built. ✓
- **Spec §9 north star** → no build; faithful instance logging (Task 3, Tasks 6–7 sends) preserves the door. ✓
- **Faithful-logging constraint** → every `onSend` persists a `sent` instance (Tasks 6, 7). ✓
- **RLS anon-write trap** → flagged in Task 3 + Task 7 gates. ✓

Placeholder scan: no TBD/TODO; each code step carries real code or a concrete edit target. Type consistency: `EmailTemplate`, `EmailInstance`, `saveEmailTemplate`, `resolveEmailTemplateForDocument`, `SendByEmailControl` props used identically across tasks.

---

*ui-designer plan, 2026-06-17. Implements SPEC-email-as-first-class-2026-06-17.md. Intended to run through the team deployment workflow: co-architect gates/delegates, ui-designer builds, qa-agent verifies.*
