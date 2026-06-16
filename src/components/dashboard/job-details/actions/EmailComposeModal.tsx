import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DetailJob, JobDetails } from "@/types/job";
import { Send, X, Mail, RotateCcw, Save, AlertTriangle, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  EMAIL_MERGE_TOKENS,
  loadDefaultEmailTemplate,
  saveDefaultEmailTemplate,
  resetDefaultEmailTemplateToSeed,
  resolveEditTimeTokens,
  EMAIL_SEED_SUBJECT,
  EMAIL_SEED_BODY,
} from "@/utils/loe/emailTemplate";

/**
 * ② Email step — the editable cover-note that carries the signing link to the client.
 * Opens AFTER document review (① ), BEFORE the actual send (③ Sent). Email is always step two,
 * attached to a confirmed document — you never compose one cold.
 *
 * Editing here is an INSTANCE edit (local state → saved as a per-send instance on Send). It NEVER
 * changes the managed default. "Set as Default" / "Reset to Original" are the only paths that
 * touch the default row.
 *
 * {{signing_link}} stays a labelled placeholder here — it only resolves at send (the DocuSeal
 * send produces it). Names / job# / property resolve now, from job data.
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
}) => {
  const [subject, setSubject] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  // Left-pane edit surface: false = rendered WYSIWYG (default — edit the real letter),
  // true = raw HTML source (drop-in code for fully custom formatting).
  const [sourceMode, setSourceMode] = useState(false);
  const editorIframeRef = useRef<HTMLIFrameElement>(null);
  // Re-seed signal: bump to (re)load the editable iframe from bodyHtml. We seed imperatively
  // (not via React on every keystroke) so the caret never resets while typing.
  const [seedTick, setSeedTick] = useState(0);
  const seedingRef = useRef(false);

  const tokenCtx = {
    firstName: job.clientFirstName || '',
    lastName: job.clientLastName || '',
    jobNumber: jobDetails.jobNumber || '',
    propertyAddress: job.propertyAddress || '',
  };

  // Load the managed default and resolve edit-time tokens into THIS instance (local copy).
  const seedFromDefault = async () => {
    setIsLoading(true);
    try {
      const tpl = await loadDefaultEmailTemplate();
      const baseSubject = tpl?.subject ?? EMAIL_SEED_SUBJECT;
      const baseBody = tpl?.body_html ?? EMAIL_SEED_BODY;
      setSubject(resolveEditTimeTokens(baseSubject, tokenCtx));
      setBodyHtml(resolveEditTimeTokens(baseBody, tokenCtx));
    } catch (e) {
      console.error('Failed to load default email template:', e);
      setSubject(resolveEditTimeTokens(EMAIL_SEED_SUBJECT, tokenCtx));
      setBodyHtml(resolveEditTimeTokens(EMAIL_SEED_BODY, tokenCtx));
    } finally {
      setIsLoading(false);
      setSeedTick(t => t + 1); // re-seed the rendered editor from the freshly-loaded body
    }
  };

  useEffect(() => {
    if (isOpen) void seedFromDefault();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Serialize the editable iframe's document back to a full HTML string (with DOCTYPE).
  const readEditorHtml = (doc: Document): string =>
    '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;

  // (Re)seed the editable iframe from bodyHtml and wire read-back of edits. Runs only when the
  // seed signal bumps or we switch into rendered mode — NOT on every keystroke (caret stays put).
  useEffect(() => {
    if (sourceMode || isLoading) return;
    const iframe = editorIframeRef.current;
    const doc = iframe?.contentDocument;
    if (!doc) return;
    seedingRef.current = true;
    // Defensively strip any <script> so written template HTML can't execute in the same-origin frame.
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
  }, [seedTick, sourceMode, isLoading]);

  // Insert a merge token at the cursor — works in BOTH the rendered editor and the raw-source box.
  const insertToken = (token: string) => {
    if (!sourceMode) {
      const doc = editorIframeRef.current?.contentDocument;
      if (doc) {
        (doc.body as HTMLElement | null)?.focus();
        const ok = doc.execCommand('insertText', false, token);
        if (!ok && doc.body) doc.body.append(token); // fallback when no live selection
        setBodyHtml(readEditorHtml(doc));
        return;
      }
    }
    const el = bodyRef.current;
    if (!el) { setBodyHtml(b => b + token); return; }
    const start = el.selectionStart ?? bodyHtml.length;
    const end = el.selectionEnd ?? bodyHtml.length;
    setBodyHtml(bodyHtml.slice(0, start) + token + bodyHtml.slice(end));
  };

  // Toggle the left pane between rendered editing and raw HTML source. Re-seed the rendered
  // editor when returning to it so it reflects any raw-source edits.
  const toggleSourceMode = () => {
    setSourceMode(prev => {
      const next = !prev;
      if (!next) setSeedTick(t => t + 1);
      return next;
    });
  };

  // Save the CURRENT compose content as the new managed default (Set as Default). Re-tokenize
  // the merged-back values so the default keeps its {{tokens}} rather than baking THIS client in.
  const handleSetDefault = async () => {
    const res = await saveDefaultEmailTemplate(detokenize(subject), detokenize(bodyHtml));
    if (res.success) toast.success('Saved as the default email');
    else toast.error(`Could not save default: ${res.error}`);
  };

  // Reverse edit-time resolution so a "Set as Default" keeps reusable tokens, not this client's data.
  const detokenize = (text: string): string => {
    let out = text;
    if (tokenCtx.firstName) out = out.split(tokenCtx.firstName).join('{{first_name}}');
    if (tokenCtx.lastName) out = out.split(tokenCtx.lastName).join('{{last_name}}');
    if (tokenCtx.jobNumber) out = out.split(tokenCtx.jobNumber).join('{{job_number}}');
    if (tokenCtx.propertyAddress) out = out.split(tokenCtx.propertyAddress).join('{{property_address}}');
    return out;
  };

  const handleResetDefaultToSeed = async () => {
    const res = await resetDefaultEmailTemplateToSeed();
    if (res.success) {
      toast.success('Default email reset to the original');
      await seedFromDefault();
    } else {
      toast.error(`Reset failed: ${res.error}`);
    }
  };

  const handleSend = async () => {
    if (!subject.trim() || !bodyHtml.trim()) {
      toast.error('Subject and body are required');
      return;
    }
    await onSend({ subject, bodyHtml });
  };

  // Live preview: show {{signing_link}} as a labelled placeholder href (resolves at send).
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
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* TEST-path banner (Resend sandbox delivers only to bc@crowestudio.com) */}
        <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-md bg-amber-100 border border-amber-300 text-amber-900 text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            <strong>TEST — delivered to sandbox, not the client.</strong> Sending goes to{' '}
            <strong>{recipientEmail}</strong> only (Resend sandbox), even though the email is merged as the client.
          </span>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading email…
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-2 gap-4 overflow-hidden my-2">
            {/* Left: editor */}
            <div className="flex flex-col gap-3 overflow-auto pr-1">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">To:</span>
                <span className="text-sm font-semibold">{recipientEmail}</span>
              </div>

              <div>
                <Label htmlFor="email-subject" className="text-xs font-medium">Subject</Label>
                <Input
                  id="email-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="h-9 text-sm mt-1"
                />
              </div>

              {/* Locked merge-token palette — visible + insertable, never editable inline */}
              <div>
                <Label className="text-xs font-medium">Merge fields (click to insert — locked)</Label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {EMAIL_MERGE_TOKENS.map((t) => (
                    <button
                      key={t.token}
                      type="button"
                      onClick={() => insertToken(t.token)}
                      title={t.resolvesAt === 'send'
                        ? 'Resolves at send (the signing link only exists once the document is sent)'
                        : 'Resolves now, from this job'}
                      className={`text-xs px-2 py-1 rounded border font-mono transition-colors ${
                        t.resolvesAt === 'send'
                          ? 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100'
                          : 'bg-muted border-border text-foreground hover:bg-gray-200'
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
                    title={sourceMode
                      ? 'Switch back to editing the rendered letter'
                      : 'Drop into raw HTML for fully custom formatting'}
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
                  <iframe
                    ref={editorIframeRef}
                    title="Email body editor"
                    className="mt-1 flex-1 min-h-[240px] w-full rounded-md border border-border bg-white focus-within:border-gray-400"
                  />
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={handleSetDefault} className="gap-1 h-8 text-xs">
                  <Save className="h-3.5 w-3.5" /> Set as Default
                </Button>
                <Button variant="ghost" size="sm" onClick={handleResetDefaultToSeed} className="gap-1 h-8 text-xs"
                  title="Restore the managed default to the verbatim original">
                  <RotateCcw className="h-3.5 w-3.5" /> Reset default to original
                </Button>
              </div>
            </div>

            {/* Right: live preview */}
            <div className="flex flex-col overflow-hidden">
              <Label className="text-xs font-medium mb-1">Preview</Label>
              <div className="flex-1 border rounded-lg overflow-auto bg-white">
                <iframe
                  srcDoc={previewHtml}
                  title="Email preview"
                  className="w-full h-full"
                  sandbox=""
                  style={{ border: 'none', minHeight: '100%' }}
                />
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
      </DialogContent>
    </Dialog>
  );
};

export default EmailComposeModal;
