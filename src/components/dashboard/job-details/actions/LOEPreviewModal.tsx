import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DetailJob, JobDetails } from "@/types/job";
import { Send, X, Download, Mail, Plus, ZoomIn, ZoomOut, RotateCcw, Edit, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import TemplateEditorModal from './TemplateEditorModal';
import EmailComposeModal from './EmailComposeModal';
import { loadAllEmailTemplates, EmailTemplate } from '@/utils/loe/emailTemplate';
import { saveTemplate, loadAllTemplates, loadTemplateById, setDefaultTemplate, LOETemplate } from '@/utils/loe/saveTemplate';
import { saveJobContract } from '@/utils/loe/jobContracts';
import { generateLOEHTML } from '@/utils/loe/generateLOE';
// Paged.js polyfill is vendored into /public (from the pagedjs npm package) and loaded
// only when Download is clicked. It renders CSS @page margin-boxes (the running
// Page X of Y + VALTA footer) that bare Chrome print silently drops — so the downloaded
// PDF carries the footer on every page.
const PAGED_POLYFILL_PATH = '/paged.polyfill.js';

interface LOEPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: DetailJob;
  jobDetails: JobDetails;
  documentHTML: string;
  onApprove: (recipientEmail?: string, emailOverride?: { subject: string; bodyHtml: string }) => Promise<void>;
  /** Fired after a client contract is saved, so the dashboard can refresh its saved list. */
  onContractSaved?: () => void;
  /** Current instance id. Present when reopening an existing contract; absent for a brand-new
      one (first Save Draft inserts, then this modal captures the returned id). Carried so the
      eventual sent-marking (Chunk 2) updates the same row instead of forking one. */
  contractId?: string | null;
  /** Read-only "View" mode — used when opening a SENT contract. Hides the template picker,
      email row, Edit Template, and Send so a sent doc can't be silently re-edited into a new
      send (truthful-sent guardrail). */
  readOnly?: boolean;
  /** documentHTML is an ALREADY-SAVED instance (a reopened DRAFT). Show it verbatim on open —
      load the template LIST for the picker but do NOT regenerate the default, which would
      clobber the saved edits. Editable (unlike readOnly): the user can still hit Edit Document. */
  existingContract?: boolean;
  /** PRD-APR-LOE-03 INV-0: the Email dropdown lives in the Previewer BESIDE the Document dropdown.
      Picking an Email template fires this → parent opens the STANDALONE email composer
      (docTemplateId=null, contract_id=null) — the document-less first-class send path. */
  onPickEmail?: (emailTemplate: EmailTemplate) => void;
}

const LOEPreviewModal: React.FC<LOEPreviewModalProps> = ({
  isOpen,
  onClose,
  job,
  jobDetails,
  documentHTML,
  onApprove,
  onContractSaved,
  contractId,
  readOnly = false,
  existingContract = false,
  onPickEmail
}) => {
  // Current instance id this preview/editor is bound to. Seeded from the contractId prop on
  // open; set after a brand-new insert so subsequent saves update the same row.
  const [savedContractId, setSavedContractId] = useState<string | null>(contractId ?? null);
  const [isSending, setIsSending] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [showEmailEdit, setShowEmailEdit] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(75); // Default zoom 75%
  const [isEditMode, setIsEditMode] = useState(false);
  // ② Email step — opens after the user confirms the document, before the actual send.
  const [showEmailStep, setShowEmailStep] = useState(false);
  const [editedHTML, setEditedHTML] = useState<string>('');
  const [templateModified, setTemplateModified] = useState(false);
  
  // Template picker state
  const [templates, setTemplates] = useState<LOETemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  // INV-0: Email templates for the Previewer's Email dropdown (peer to Document Templates).
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  useEffect(() => {
    if (!isOpen) return;
    loadAllEmailTemplates().then(setEmailTemplates).catch(() => setEmailTemplates([]));
  }, [isOpen]);
  const [currentDocumentHTML, setCurrentDocumentHTML] = useState<string>(documentHTML);

  // Initialize recipient email - Default to bc@crowestudio.com for testing (developer's email)
  // Users can change it via "Change Recipient" button if needed
  useEffect(() => {
    // For testing: Default to developer's email (bc@crowestudio.com)
    // Users can override via "Change Recipient" button
    const testEmail = 'bc@crowestudio.com';
    setRecipientEmail(testEmail);
    console.log('📧 Default email set to:', testEmail, '(testing mode)');
  }, []);

  // Load templates when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentDocumentHTML(documentHTML);
      setSavedContractId(contractId ?? null);
      // In read-only View mode (a sent doc), do NOT load+regenerate the default template —
      // that would clobber the saved edited_html. Show exactly what was saved.
      // For a reopened DRAFT (existingContract), load the template LIST for the picker but skip
      // the default-render so the saved draft shows verbatim; a brand-new doc renders the default.
      if (!readOnly) loadTemplates(!existingContract);
    }
  }, [isOpen]);

  // Update currentDocumentHTML when documentHTML prop changes
  useEffect(() => {
    if (isOpen) {
      setCurrentDocumentHTML(documentHTML);
    }
  }, [documentHTML, isOpen]);

  // Render a chosen template into the preview — passes the row's VERSION so the generator picks
  // the right token mapper (V07 PascalCase vs V3 lowercase) + fires the version-gated cascade/
  // suppression. Used both on open (default) and on dropdown change. View/edit ONLY — does not
  // change which template the send path ships.
  const renderTemplate = async (templateId: string): Promise<string | null> => {
    const template = await loadTemplateById(templateId);
    if (!template) {
      toast.error('Template not found');
      return null;
    }
    const regeneratedHTML = await generateLOEHTML(
      job, jobDetails, template.template_html, template.id, (template as any).version,
    );
    setCurrentDocumentHTML(regeneratedHTML);
    setEditedHTML(''); // Clear any edited HTML
    setTemplateModified(false);
    setSelectedTemplateId(templateId);
    return template.name;
  };

  const loadTemplates = async (renderDefault = true) => {
    setIsLoadingTemplates(true);
    try {
      const loadedTemplates = await loadAllTemplates();
      setTemplates(loadedTemplates);

      // Open on the default template (render it so the preview matches the picker selection).
      const defaultTemplate = loadedTemplates.find(t => t.is_default) ?? loadedTemplates[0];
      if (defaultTemplate) {
        if (renderDefault) {
          await renderTemplate(defaultTemplate.id);
        } else {
          // Reopened draft: keep the saved HTML in the preview; just sync the picker selection.
          setSelectedTemplateId(defaultTemplate.id);
        }
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const handleTemplateChange = async (templateId: string) => {
    if (templateId === selectedTemplateId) return;

    setIsRegenerating(true);
    try {
      const name = await renderTemplate(templateId);
      if (name) void 0 /* success: silent (Ben) */;
    } catch (error) {
      console.error('Failed to load template:', error);
      toast.error('Failed to load template');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSetDefault = async (templateId: string) => {
    const success = await setDefaultTemplate(templateId);
    if (success) {
      void 0 /* success: silent (Ben) */;
      loadTemplates(); // Reload to refresh UI
    } else {
      toast.error('Failed to set default template');
    }
  };

  useEffect(() => {
    // Create a blob URL for the preview with proper scaling CSS
    const htmlToUse = editedHTML || currentDocumentHTML;
    if (htmlToUse) {
      // Add CSS to scale the document based on zoom level
      const zoomDecimal = zoomLevel / 100;
      const scaleValue = 0.9 + (zoomDecimal - 0.75) * 0.5; // Adjust scale proportionally
      
      const scaledHTML = htmlToUse.replace(
        '</head>',
        `<style>
          body {
            zoom: ${zoomDecimal};
            transform: scale(${scaleValue});
            transform-origin: top center;
            max-width: 850px;
            margin: 0 auto;
            padding: 20px;
            overflow-x: hidden;
          }
          .document {
            max-width: 850px;
            margin: 0 auto;
          }
          @media print {
            body {
              zoom: 1;
              transform: none;
              max-width: 100%;
            }
          }
        </style>
        </head>`
      );
      
      const blob = new Blob([scaledHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      
      // Cleanup on unmount
      return () => URL.revokeObjectURL(url);
    }
  }, [currentDocumentHTML, editedHTML, zoomLevel]);

  // ① → ②: confirm the document, then open the Email step. The actual send fires from there.
  const handleProceedToEmail = () => {
    if (templateModified) {
      toast.error('Please save your template before sending to client');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!recipientEmail || !emailRegex.test(recipientEmail)) {
      toast.error('Please enter a valid email address (e.g., name@domain.com)');
      setShowEmailEdit(true);
      return;
    }
    setShowEmailStep(true);
  };

  // ② → ③: send with the composed email. Double-send guard: isSending disables the button.
  const handleSendEmail = async (emailOverride: { subject: string; bodyHtml: string }) => {
    if (isSending) return;
    setIsSending(true);
    try {
      const emailToUse = recipientEmail !== job.clientEmail ? recipientEmail : undefined;
      await onApprove(emailToUse, emailOverride);
      setShowEmailStep(false);
      onClose();
    } catch (error) {
      console.error('Error sending document:', error);
      toast.error('Failed to send document');
    } finally {
      setIsSending(false);
    }
  };

  const handleDownloadPreview = () => {
    // Download as a TRUE paged PDF (not raw HTML). Open a clean print window, run the
    // Paged.js polyfill so the @page footer (Page X of Y + VALTA) is rendered onto every
    // page, then auto-open the print dialog -> client picks "Save as PDF".
    // (Bare Chrome print drops @page margin-box content; Paged.js restores it.)
    const htmlToDownload = editedHTML || currentDocumentHTML;
    if (!htmlToDownload) {
      toast.error('Nothing to download yet — generate the preview first');
      return;
    }
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow pop-ups for this site to download the PDF');
      return;
    }

    const polyfillSrc = new URL(PAGED_POLYFILL_PATH, window.location.origin).href;
    const docTitle = `LOE-${job.clientLastName || 'Client'}-${jobDetails.jobNumber || 'DRAFT'}`;
    // Point the download tab at the app's VA favicon. Without this the new window falls
    // back to /favicon.ico (the stale Lovable heart) instead of the VA mark.
    const faviconTag = `<link rel="icon" type="image/svg+xml" href="${window.location.origin}/favicon.svg">`;
    const titleTag = `<title>${docTitle}</title>${faviconTag}`;
    // White-paper guard: Paged.js paginates in SCREEN context, where the template's
    // @media screen grey backdrop would tint the page boxes. Force every Paged.js page
    // box (and the paper) white so the downloaded PDF is uniform white edge-to-edge.
    const whitePaperStyle =
      `<style>html,body{background:#fff !important}` +
      `.pagedjs_pages,.pagedjs_page,.pagedjs_sheet,.pagedjs_pagebox{background:#fff !important}` +
      `@media print{html,body,.pagedjs_page{background:#fff !important}}</style>`;
    // PagedConfig must be set BEFORE the polyfill loads; .after fires once pagination completes.
    const pagedHooks =
      `<script>window.PagedConfig={auto:true,after:function(){setTimeout(function(){window.focus();window.print();},400);}};</scr` + `ipt>` +
      `<script src="${polyfillSrc}"></scr` + `ipt>`;

    let doc = htmlToDownload;
    doc = /<\/title>/i.test(doc)
      ? doc.replace(/<title>[\s\S]*?<\/title>/i, titleTag)
      : /<\/head>/i.test(doc)
        ? doc.replace(/<\/head>/i, `${titleTag}</head>`)
        : titleTag + doc;
    // inject the white-paper guard as the LAST thing in <head> so it wins the cascade
    doc = /<\/head>/i.test(doc)
      ? doc.replace(/<\/head>/i, `${whitePaperStyle}</head>`)
      : whitePaperStyle + doc;
    doc = /<\/body>/i.test(doc)
      ? doc.replace(/<\/body>/i, `${pagedHooks}</body>`)
      : doc + pagedHooks;

    printWindow.document.open();
    printWindow.document.write(doc);
    printWindow.document.close();
    void 0 /* success: silent (Ben) */;
  };

  // Save the CURRENTLY-PREVIEWED document as a draft directly from the preview — no need to
  // open Edit Document. Same persistence path as the editor's Save Draft (job_contracts,
  // state 'draft'); threads savedContractId so a re-save updates the SAME row, not a fork.
  const handleSaveDraftFromPreview = async () => {
    const htmlToSave = editedHTML || currentDocumentHTML;
    if (!htmlToSave) {
      toast.error('Nothing to save yet — generate the preview first');
      return;
    }
    const chosen = templates.find(t => t.id === selectedTemplateId);
    const monthDay = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const client = job.clientLastName || job.clientFirstName || 'Client';
    const draftName = `${chosen?.name || 'Document'} — ${client} — ${monthDay}`;
    setIsSavingDraft(true);
    try {
      const result = await saveJobContract({
        id: savedContractId ?? undefined,
        jobId: job.id,
        name: draftName,
        editedHtml: htmlToSave,
        templateId: selectedTemplateId,
        templateVersion: (chosen as any)?.version ?? null,
        contractType: chosen?.name ?? null,
        state: 'draft',
      });
      if (result.success) {
        if (!savedContractId && result.id) setSavedContractId(result.id);
        onContractSaved?.();
        toast.success('Draft saved');
      } else {
        toast.error(`Failed to save draft: ${result.error}`);
      }
    } finally {
      setIsSavingDraft(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[90vw] h-[95vh] flex flex-col p-4 [&>button]:hidden">
        {/* Minimal Header */}
        <div className="flex justify-between items-center pb-2 border-b">
          <div className="flex-1">
            <h2 className="text-lg font-semibold">Previewer</h2>
            <p className="text-sm text-muted-foreground">Review before sending</p>
          </div>
          
          {/* Template Picker — hidden in read-only View (sent doc) */}
          {!readOnly && (
          <div className="flex items-center gap-2 mr-4">
            <Label htmlFor="template-select" className="text-sm font-medium whitespace-nowrap">
              Document Templates:
            </Label>
            <Select
              value={selectedTemplateId || 'default'}
              onValueChange={handleTemplateChange}
              disabled={isLoadingTemplates || isRegenerating}
            >
              <SelectTrigger id="template-select" className="w-[200px] h-8 text-sm bg-card border border-border text-foreground hover:border-gray-400 focus:border-gray-400 focus:outline-none focus:ring-0">
                {isRegenerating ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  <SelectValue placeholder="Select template">
                    {templates.find(t => t.id === selectedTemplateId)?.name || 'Default Template'}
                  </SelectValue>
                )}
              </SelectTrigger>
              <SelectContent className="bg-background border border-border">
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{template.name}</span>
                      {template.is_default && (
                        <span className="ml-2 text-xs text-blue-600">(Default)</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedTemplateId && templates.find(t => t.id === selectedTemplateId) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSetDefault(selectedTemplateId)}
                className="h-7 text-xs"
                title="Set as default template"
              >
                Set Default
              </Button>
            )}
            {/* INV-0: Email Templates dropdown — PEER to Document Templates, side by side in the
                Previewer. Picking one opens the STANDALONE email composer (document-less,
                contract_id=null) via onPickEmail — email sendable without a document. */}
            {onPickEmail && (
              <>
                <Label htmlFor="email-template-select" className="text-sm font-medium whitespace-nowrap ml-2">
                  Email:
                </Label>
                <Select
                  value=""
                  onValueChange={(id) => {
                    const tpl = emailTemplates.find(t => t.id === id);
                    if (tpl) onPickEmail(tpl);
                  }}
                  disabled={emailTemplates.length === 0}
                >
                  <SelectTrigger id="email-template-select" className="w-[200px] h-8 text-sm bg-card border border-border text-foreground hover:border-gray-400 focus:border-gray-400 focus:outline-none focus:ring-0">
                    <SelectValue placeholder={emailTemplates.length ? 'Send an email…' : 'No email templates'} />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border">
                    {emailTemplates.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
          )}

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoomLevel(Math.max(25, zoomLevel - 10))}
                className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-200"
                title="Zoom Out"
              >
                <ZoomOut className="h-3 w-3" />
              </Button>
              
              <span className="text-xs font-medium px-2 min-w-[45px] text-center dark:text-gray-200">
                {zoomLevel}%
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
                className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-200"
                title="Zoom In"
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
              
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoomLevel(75)}
                className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-200"
                title="Reset Zoom"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
            
            {!readOnly && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditedHTML(currentDocumentHTML);
                  setIsEditMode(true);
                }}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit Document
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Email Recipient Section — hidden in read-only View (sent doc) */}
        {!readOnly && (
        <div className="flex items-center gap-3 py-2 px-4">
          <Mail className="h-4 w-4 text-muted-foreground" />
          {showEmailEdit ? (
            <div className="flex items-center gap-2 flex-1">
              <span className="text-sm font-medium text-foreground">Send to:</span>
              <Input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-64 h-8 text-sm bg-card dark:bg-secondary border border-border dark:border-border text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground hover:border-gray-400 dark:hover:border-border focus-visible:border-gray-400 dark:focus-visible:border-border focus-visible:outline-none focus-visible:ring-0"
                placeholder="Enter recipient email"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowEmailEdit(false)}
                className="h-8 text-xs text-foreground hover:text-foreground dark:hover:text-gray-300 hover:underline"
              >
                Done
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-1">
              <span className="text-sm font-medium text-foreground">E-signature will be sent to:</span>
              <span className="text-sm font-semibold text-foreground">{recipientEmail || 'No email specified'}</span>
              {recipientEmail !== job.clientEmail && (
                <span className="text-xs text-muted-foreground">
                  (Testing: {recipientEmail}, Client: {job.clientEmail})
                </span>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowEmailEdit(true)}
                className="h-7 text-xs text-foreground hover:text-foreground dark:hover:text-gray-300 hover:underline ml-auto"
              >
                Change Recipient
              </Button>
            </div>
          )}
        </div>
        )}

        {/* Preview Frame - Maximum space */}
        <div className="flex-1 border rounded-lg overflow-auto bg-muted my-2">
          {previewUrl ? (
            <iframe
              src={previewUrl}
              className="w-full h-full bg-card"
              title="LOE Document Preview"
              sandbox="allow-same-origin"
              style={{ border: 'none', minHeight: '100%' }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Loading preview...
            </div>
          )}
        </div>

        {/* Minimal Footer */}
        <div className="flex justify-between items-center pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Verify all details are correct before sending
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPreview}
              className="h-7 text-sm"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            {!readOnly && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveDraftFromPreview}
                disabled={isSavingDraft}
                className="h-7 text-sm"
              >
                <Save className="h-4 w-4 mr-1" />
                {isSavingDraft ? 'Saving…' : 'Save Draft'}
              </Button>
            )}
            {!readOnly && (
              <button
                onClick={handleProceedToEmail}
                disabled={isSending}
                className="text-foreground hover:text-foreground dark:hover:text-gray-300 hover:underline transition-colors text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed disabled:no-underline flex items-center gap-1"
              >
                <Send className="h-4 w-4" />
                Continue to Email
              </button>
            )}
          </div>
        </div>

        {/* Template Editor Modal */}
        <TemplateEditorModal
          isOpen={isEditMode}
          onClose={() => setIsEditMode(false)}
          initialHTML={editedHTML || currentDocumentHTML}
          initialName={(() => {
            // Pre-filled Document Name default: {TemplateType} — {Client} — {Mon D} (spec b).
            const chosen = templates.find(t => t.id === selectedTemplateId);
            const monthDay = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const client = job.clientLastName || job.clientFirstName || 'Client';
            return `${chosen?.name || 'Document'} — ${client} — ${monthDay}`;
          })()}
          onSave={async (contractName, html) => {
            // Edit Contract mode: save THIS CLIENT's tailored contract (not a template).
            // Persists to job_contracts against the job; the dashboard then lists it as a
            // draft. Threads the current instance id so resaving updates the SAME row
            // instead of forking a new one (no duplicate-on-resave).
            const chosen = templates.find(t => t.id === selectedTemplateId);
            const result = await saveJobContract({
              id: savedContractId ?? undefined,
              jobId: job.id,
              name: contractName,
              editedHtml: html,
              templateId: selectedTemplateId,
              templateVersion: (chosen as any)?.version ?? null,
              contractType: chosen?.name ?? null,
              state: 'draft',
            });

            if (result.success) {
              // First insert returns the new id — capture it so the next Save Draft updates
              // this same row rather than inserting again.
              if (!savedContractId && result.id) setSavedContractId(result.id);
              setEditedHTML(html);
              setTemplateModified(false);
              // Update preview with edited HTML
              const blob = new Blob([html], { type: 'text/html' });
              const url = URL.createObjectURL(blob);
              setPreviewUrl(url);
              // Tell the dashboard to refresh its saved-contracts list.
              onContractSaved?.();
            } else {
              toast.error(`Failed to save contract: ${result.error}`);
            }
          }}
        />

        {/* ② Email step — opens on "Continue to Email", sends with the composed cover note */}
        <EmailComposeModal
          isOpen={showEmailStep}
          onClose={() => setShowEmailStep(false)}
          onBack={() => setShowEmailStep(false)}
          job={job}
          jobDetails={jobDetails}
          recipientEmail={recipientEmail}
          isSending={isSending}
          onSend={handleSendEmail}
        />
      </DialogContent>
    </Dialog>
  );
};

export default LOEPreviewModal;