import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DetailJob, JobDetails } from "@/types/job";
import { Send, X, Mail, RotateCcw, Save, AlertTriangle, Loader2, ArrowLeft, Pencil, FilePlus2 } from "lucide-react";
import { toast } from "sonner";
import {
  EMAIL_MERGE_TOKENS,
  loadDefaultEmailTemplate,
  loadAllEmailTemplates,
  saveDefaultEmailTemplate,
  saveEmailTemplate,
  resetDefaultEmailTemplateToSeed,
  resolveEditTimeTokens,
  EMAIL_SEED_SUBJECT,
  EMAIL_SEED_BODY,
  EmailTemplate,
} from "@/utils/loe/emailTemplate";

/**
 * ② Email step — the editable cover-note that carries the signing link to the client.
 *
 * PRD-APR-LOE-03 (Wave C / Task 5) added: preview-first viewMode, an Email-Templates dropdown
 * (pick from the managed library, not just the single default), "Back to Preview", "Save as
 * draft", and "Save as version" (name + set-default + PAIR-TO-DOCUMENT). The pairing save goes
 * through saveEmailTemplate; if it returns the typed `already-paired` guardrail error
 * (PRD Guardrail 3), we surface a clean toast — a raw DB error never reaches the user.
 *
 * Editing the body here is still an INSTANCE edit (local state → saved as a per-send instance on
 * Send). It NEVER changes a managed template unless you explicitly "Set as Default" or "Save as
 * version". {{signing_link}} stays a labelled placeholder here — it resolves at send.
 */
interface EmailComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  job: DetailJob;
  jobDetails: JobDetails;
  recipientEmail: string;
  isSending: boolean;
  /** Fired when the user confirms the send. Carries the composed (edit-time-merged) email. */
  onSend: (payload: { subject: string; bodyHtml: string }) => Promise<void>;
  /** Optional: pre-select this template on open (e.g. the one chosen in SendByEmailControl). */
  initialTemplate?: EmailTemplate;
  /** Optional: persist a draft instance (wired by the parent via the Task 3 helper). */
  onSaveDraft?: (subject: string, bodyHtml: string) => Promise<void>;
  /** The current document template id, for "Pair to current document" in Save-as-version. */
  docTemplateId?: string | null;
}

const EmailComposeModal: React.FC<EmailComposeModalProps> = ({
  isOpen,
  onClose,
  onBack,
  job,
  jobDetails,
  recipientEmail,
  isSending,
  onSend,
  initialTemplate,
  onSaveDraft,
  docTemplateId = null,
}) => {
  const [subject, setSubject] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const [sourceMode, setSourceMode] = useState(false);
  const editorIframeRef = useRef<HTMLIFrameElement>(null);
  const [seedTick, setSeedTick] = useState(0);
  const seedingRef = useRef(false);

  // T5 Step 1: preview-first. 'preview' = full-width rendered read-only + an Edit button;
  // 'edit' = the existing 2-col split editor.
  const [viewMode, setViewMode] = useState<'preview' | 'edit'>('preview');
  // T5 Step 2: the managed email-template library + the currently-selected one.
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  // T5 Step 5: the Save-as-version sub-dialog.
  const [saveVersionOpen, setSaveVersionOpen] = useState(false);
  const [versionName, setVersionName] = useState('');
  const [versionSetDefault, setVersionSetDefault] = useState(false);
  const [versionPairToDoc, setVersionPairToDoc] = useState(false);
  const [savingVersion, setSavingVersion] = useState(false);

  const tokenCtx = {
    firstName: job.clientFirstName || '',
    lastName: job.clientLastName || '',
    jobNumber: jobDetails.jobNumber || '',
    propertyAddress: job.propertyAddress || '',
  };

  // Apply a template's content into THIS instance (edit-time tokens resolved).
  const applyTemplateContent = (baseSubject: string, baseBody: string) => {
    setSubject(resolveEditTimeTokens(baseSubject, tokenCtx));
    setBodyHtml(resolveEditTimeTokens(baseBody, tokenCtx));
    setSeedTick((t) => t + 1);
  };

  // Initial load: prefer the passed initialTemplate, else the managed default. Also load the
  // full library for the dropdown.
  const seedOnOpen = async () => {
    setIsLoading(true);
    try {
      const all = (await loadAllEmailTemplates()).filter((t) => t.channel === 'email');
      setTemplates(all);
      const start =
        (initialTemplate && all.find((t) => t.id === initialTemplate.id)) ||
        all.find((t) => t.id === initialTemplate?.id) ||
        all.find((t) => t.is_default) ||
        null;
      if (start) {
        setSelectedTemplateId(start.id);
        applyTemplateContent(start.subject, start.body_html);
      } else {
        // No library row — fall back to the legacy single default / seed.
        const tpl = await loadDefaultEmailTemplate();
        applyTemplateContent(tpl?.subject ?? EMAIL_SEED_SUBJECT, tpl?.body_html ?? EMAIL_SEED_BODY);
      }
    } catch (e) {
      console.error('Failed to load email templates:', e);
      applyTemplateContent(EMAIL_SEED_SUBJECT, EMAIL_SEED_BODY);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setViewMode('preview');
      void seedOnOpen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // T5 Step 2: switching the dropdown reloads subject/body from that template.
  const handleSelectTemplate = (id: string) => {
    setSelectedTemplateId(id);
    const tpl = templates.find((t) => t.id === id);
    if (tpl) applyTemplateContent(tpl.subject, tpl.body_html);
  };

  const readEditorHtml = (doc: Document): string => '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;

  // (Re)seed the editable iframe — only in edit mode, on seed bump (caret stays put).
  useEffect(() => {
    if (viewMode !== 'edit' || sourceMode || isLoading) return;
    const iframe = editorIframeRef.current;
    const doc = iframe?.contentDocument;
    if (!doc) return;
    seedingRef.current = true;
    const safe = (bodyHtml || '<p></p>').replace(/<script[\s\S]*?<\/script>/gi, '');
    doc.open();
    doc.write(safe);
    doc.close();
    doc.designMode = 'on';
    seedingRef.current = false;
    const handler = () => {
      if (seedingRef.current) return;
      setBodyHtml(readEditorHtml(doc));
    };
    doc.addEventListener('input', handler);
    return () => doc.removeEventListener('input', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seedTick, sourceMode, isLoading, viewMode]);

  const insertToken = (token: string) => {
    if (!sourceMode) {
      const doc = editorIframeRef.current?.contentDocument;
      if (doc) {
        (doc.body as HTMLElement | null)?.focus();
        const ok = doc.execCommand('insertText', false, token);
        if (!ok && doc.body) doc.body.append(token);
        setBodyHtml(readEditorHtml(doc));
        return;
      }
    }
    const el = bodyRef.current;
    if (!el) { setBodyHtml((b) => b + token); return; }
    const start = el.selectionStart ?? bodyHtml.length;
    const end = el.selectionEnd ?? bodyHtml.length;
    setBodyHtml(bodyHtml.slice(0, start) + token + bodyHtml.slice(end));
  };

  const toggleSourceMode = () => {
    setSourceMode((prev) => {
      const next = !prev;
      if (!next) setSeedTick((t) => t + 1);
      return next;
    });
  };

  const detokenize = (text: string): string => {
    let out = text;
    if (tokenCtx.firstName) out = out.split(tokenCtx.firstName).join('{{first_name}}');
    if (tokenCtx.lastName) out = out.split(tokenCtx.lastName).join('{{last_name}}');
    if (tokenCtx.jobNumber) out = out.split(tokenCtx.jobNumber).join('{{job_number}}');
    if (tokenCtx.propertyAddress) out = out.split(tokenCtx.propertyAddress).join('{{property_address}}');
    return out;
  };

  const handleSetDefault = async () => {
    const res = await saveDefaultEmailTemplate(detokenize(subject), detokenize(bodyHtml));
    if (res.success) toast.success('Saved as the default email');
    else toast.error(`Could not save default: ${res.error}`);
  };

  const handleResetDefaultToSeed = async () => {
    const res = await resetDefaultEmailTemplateToSeed();
    if (res.success) {
      toast.success('Default email reset to the original');
      await seedOnOpen();
    } else {
      toast.error(`Reset failed: ${res.error}`);
    }
  };

  // T5 Step 4: save the current content as a draft instance (parent persists via Task 3).
  const handleSaveDraft = async () => {
    if (!onSaveDraft) { toast.error('Draft saving is not available here'); return; }
    try {
      await onSaveDraft(subject, bodyHtml);
      toast.success('Draft saved');
    } catch (e) {
      toast.error(`Could not save draft: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  // T5 Step 5: save as a NEW managed version (name + set-default + pair-to-document). The pairing
  // path can hit Guardrail 3 (already-paired) — surface it cleanly, never a raw 23505.
  const handleSaveVersion = async () => {
    if (!versionName.trim()) { toast.error('Give the version a name'); return; }
    setSavingVersion(true);
    try {
      const res = await saveEmailTemplate({
        name: versionName.trim(),
        subject: detokenize(subject),
        body_html: detokenize(bodyHtml),
        setAsDefault: versionSetDefault,
        pairedTemplateId: versionPairToDoc ? docTemplateId : null,
        channel: 'email',
        trigger: 'manual',
      });
      if (!res.success) {
        if (res.error === 'already-paired') {
          toast.error('That document is already paired to an email — unpair it first, or pick a different document.');
        } else {
          toast.error(`Could not save version: ${res.error}`);
        }
        return;
      }
      toast.success(`Saved "${versionName.trim()}"${versionSetDefault ? ' (now the default)' : ''}`);
      // refresh the dropdown so the new version is selectable
      const all = (await loadAllEmailTemplates()).filter((t) => t.channel === 'email');
      setTemplates(all);
      if (res.id) setSelectedTemplateId(res.id);
      setSaveVersionOpen(false);
      setVersionName('');
      setVersionSetDefault(false);
      setVersionPairToDoc(false);
    } finally {
      setSavingVersion(false);
    }
  };

  const handleSend = async () => {
    if (!subject.trim() || !bodyHtml.trim()) {
      toast.error('Subject and body are required');
      return;
    }
    await onSend({ subject, bodyHtml });
  };

  const previewHtml = bodyHtml.split('{{signing_link}}').join('#signing-link-resolved-at-send');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[90vw] h-[95vh] flex flex-col p-4 [&>button]:hidden">
        {/* Header + stepper */}
        <div className="flex justify-between items-center pb-2 border-b">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="gap-1 h-8">
              <ArrowLeft className="h-4 w-4" /> Document
            </Button>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">① Review</span>
              <span className="text-muted-foreground">›</span>
              <span className="font-semibold text-foreground">② Email</span>
              <span className="text-muted-foreground">›</span>
              <span className="text-muted-foreground">③ Sent</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* T5 Step 2: Email Templates dropdown */}
            <Select value={selectedTemplateId} onValueChange={handleSelectTemplate} disabled={isLoading || !templates.length}>
              <SelectTrigger className="h-8 w-[220px] text-sm">
                <SelectValue placeholder="Email template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}{t.is_default ? ' (default)' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* TEST-path banner */}
        <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-md bg-amber-100 border border-amber-300 text-amber-900 text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            <strong>Recipient: {recipientEmail}</strong> (the client). <strong>TEST mode:</strong> in non-prod the actual delivery is redirected to the sandbox test address — the real client is never emailed in non-prod.
          </span>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading email…
          </div>
        ) : viewMode === 'preview' ? (
          /* T5 Step 1: preview-first — full-width rendered preview + Edit */
          <div className="flex-1 flex flex-col overflow-hidden my-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">To:</span>
                <span className="font-semibold">{recipientEmail}</span>
              </div>
              <Button variant="outline" size="sm" className="h-8 gap-1" onClick={() => setViewMode('edit')}>
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Button>
            </div>
            <div className="text-sm mb-1"><span className="text-muted-foreground">Subject:</span> <span className="font-medium">{subject}</span></div>
            <div className="flex-1 border rounded-lg overflow-auto bg-white">
              <iframe srcDoc={previewHtml} title="Email preview" className="w-full h-full" sandbox="" style={{ border: 'none', minHeight: '100%' }} />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              The <span className="font-mono">Signing link</span> button resolves to the real URL at send.
            </p>
          </div>
        ) : (
          /* edit mode — the existing 2-col split */
          <div className="flex-1 grid grid-cols-2 gap-4 overflow-hidden my-2">
            {/* Left: editor */}
            <div className="flex flex-col gap-3 overflow-auto pr-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">To:</span>
                  <span className="text-sm font-semibold">{recipientEmail}</span>
                </div>
                {/* T5 Step 3: Back to Preview */}
                <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={() => setViewMode('preview')}>
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Preview
                </Button>
              </div>

              <div>
                <Label htmlFor="email-subject" className="text-xs font-medium">Subject</Label>
                <Input id="email-subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="h-9 text-sm mt-1" />
              </div>

              <div>
                <Label className="text-xs font-medium">Merge fields (click to insert — locked)</Label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {EMAIL_MERGE_TOKENS.map((t) => (
                    <button
                      key={t.token}
                      type="button"
                      onClick={() => insertToken(t.token)}
                      title={t.resolvesAt === 'send' ? 'Resolves at send (the signing link only exists once the document is sent)' : 'Resolves now, from this job'}
                      className={`text-xs px-2 py-1 rounded border font-mono transition-colors ${
                        t.resolvesAt === 'send' ? 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100' : 'bg-muted border-border text-foreground hover:bg-gray-200'
                      }`}
                    >
                      {t.label}{t.resolvesAt === 'send' ? ' (at send)' : ''}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-body" className="text-xs font-medium">
                    {sourceMode ? 'Body (HTML source)' : 'Body — click to edit the letter'}
                  </Label>
                  <button
                    type="button"
                    onClick={toggleSourceMode}
                    title={sourceMode ? 'Switch back to editing the rendered letter' : 'Drop into raw HTML for fully custom formatting'}
                    className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border border-border text-muted-foreground hover:bg-muted transition-colors font-mono"
                  >
                    {sourceMode ? '◀ Rich view' : '</> HTML source'}
                  </button>
                </div>
                {sourceMode ? (
                  <textarea
                    id="email-body"
                    ref={bodyRef}
                    value={bodyHtml}
                    onChange={(e) => setBodyHtml(e.target.value)}
                    className="mt-1 flex-1 min-h-[240px] w-full rounded-md border border-border bg-card p-2 text-xs font-mono text-foreground focus:outline-none focus:ring-0 focus:border-gray-400"
                    spellCheck={false}
                  />
                ) : (
                  <iframe ref={editorIframeRef} title="Email body editor" className="mt-1 flex-1 min-h-[240px] w-full rounded-md border border-border bg-white focus-within:border-gray-400" />
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={handleSetDefault} className="gap-1 h-8 text-xs">
                  <Save className="h-3.5 w-3.5" /> Set as Default
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSaveVersionOpen(true)} className="gap-1 h-8 text-xs">
                  <FilePlus2 className="h-3.5 w-3.5" /> Save as version
                </Button>
                {onSaveDraft && (
                  <Button variant="ghost" size="sm" onClick={handleSaveDraft} className="gap-1 h-8 text-xs">
                    <Save className="h-3.5 w-3.5" /> Save as draft
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={handleResetDefaultToSeed} className="gap-1 h-8 text-xs" title="Restore the managed default to the verbatim original">
                  <RotateCcw className="h-3.5 w-3.5" /> Reset default to original
                </Button>
              </div>
            </div>

            {/* Right: live preview */}
            <div className="flex flex-col overflow-hidden">
              <Label className="text-xs font-medium mb-1">Preview</Label>
              <div className="flex-1 border rounded-lg overflow-auto bg-white">
                <iframe srcDoc={previewHtml} title="Email preview" className="w-full h-full" sandbox="" style={{ border: 'none', minHeight: '100%' }} />
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                The <span className="font-mono">Signing link</span> button resolves to the real URL at send.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t">
          <p className="text-xs text-muted-foreground">Edits here apply to this send only — the default is unchanged.</p>
          <button
            onClick={handleSend}
            disabled={isSending || isLoading}
            className="text-foreground hover:underline transition-colors text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed disabled:no-underline flex items-center gap-1"
          >
            {isSending ? 'Sending…' : <><Send className="h-4 w-4" /> Send to Client</>}
          </button>
        </div>

        {/* T5 Step 5: Save-as-version sub-dialog */}
        <Dialog open={saveVersionOpen} onOpenChange={setSaveVersionOpen}>
          <DialogContent className="max-w-md">
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold flex items-center gap-1"><FilePlus2 className="h-4 w-4" /> Save as a new email version</h3>
              <div>
                <Label htmlFor="version-name" className="text-xs font-medium">Version name</Label>
                <Input id="version-name" value={versionName} onChange={(e) => setVersionName(e.target.value)} placeholder="e.g. Commercial LOE — short" className="h-9 text-sm mt-1" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={versionSetDefault} onChange={(e) => setVersionSetDefault(e.target.checked)} className="h-4 w-4" />
                Set as the default email
              </label>
              <label className={`flex items-center gap-2 text-sm ${docTemplateId ? '' : 'opacity-50'}`}>
                <input type="checkbox" checked={versionPairToDoc} onChange={(e) => setVersionPairToDoc(e.target.checked)} disabled={!docTemplateId} className="h-4 w-4" />
                Pair to the current document {docTemplateId ? '' : '(no document in context)'}
              </label>
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="ghost" size="sm" onClick={() => setSaveVersionOpen(false)} disabled={savingVersion}>Cancel</Button>
                <Button variant="outline" size="sm" onClick={handleSaveVersion} disabled={savingVersion} className="gap-1">
                  {savingVersion ? <Loader2 className="h-4 w-4 animate-spin" /> : <FilePlus2 className="h-4 w-4" />} Save version
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default EmailComposeModal;
