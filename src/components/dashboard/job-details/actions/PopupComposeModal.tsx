import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DetailJob, JobDetails } from "@/types/job";
import { X, RotateCcw, Save, Loader2, Pencil, ArrowLeft, FilePlus2, MonitorCheck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  POPUP_MERGE_TOKENS,
  POPUP_SEED_BODY,
  loadAllPopupTemplates,
  savePopupTemplate,
  setActivePopupTemplate,
  resetActivePopupTemplateToSeed,
  resolvePopupTokens,
  PopupTemplate,
} from "@/utils/loe/popupTemplate";

/**
 * Popup editor — the THIRD managed component type beside Document + Email (INV-1).
 *
 * Same preview-first → edit → save-as-version family as EmailComposeModal, popup-shaped:
 * no subject, no recipient, no send. A popup is a saved SCREEN; the ACTIVE one renders on
 * the post-sign signing page (INV-0). Editing is dashboard-only.
 *
 * Merge tokens ({{client_name}} {{property_address}} {{job_number}}) all resolve at SIGN
 * time on the signing page; here they preview against the current job's data (INV-4).
 */
interface PopupComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: DetailJob;
  jobDetails: JobDetails;
  /** Pre-select this popup on open (e.g. the one chosen in the Previewer dropdown). */
  initialTemplate?: PopupTemplate;
  /** Fired after any save/set-active so the parent can refresh its popup list. */
  onSaved?: () => void;
}

const PopupComposeModal: React.FC<PopupComposeModalProps> = ({
  isOpen,
  onClose,
  job,
  jobDetails,
  initialTemplate,
  onSaved,
}) => {
  const [bodyHtml, setBodyHtml] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const [sourceMode, setSourceMode] = useState(false);
  const editorIframeRef = useRef<HTMLIFrameElement>(null);
  const [seedTick, setSeedTick] = useState(0);
  const seedingRef = useRef(false);

  const [viewMode, setViewMode] = useState<'preview' | 'edit'>('preview');
  const [templates, setTemplates] = useState<PopupTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  // Save-as-version sub-dialog.
  const [saveVersionOpen, setSaveVersionOpen] = useState(false);
  const [versionName, setVersionName] = useState('');
  const [versionSetActive, setVersionSetActive] = useState(true);
  const [savingVersion, setSavingVersion] = useState(false);
  const [savingActive, setSavingActive] = useState(false);

  const clientName = `${job.clientFirstName ?? ''} ${job.clientLastName ?? ''}`.trim();
  const tokenCtx = {
    clientName,
    propertyAddress: job.propertyAddress || '',
    jobNumber: jobDetails.jobNumber || '',
  };

  // Initial load: prefer initialTemplate, else the active popup, else the first; library for the dropdown.
  const seedOnOpen = async () => {
    setIsLoading(true);
    try {
      const all = await loadAllPopupTemplates();
      setTemplates(all);
      const start =
        (initialTemplate && all.find((t) => t.id === initialTemplate.id)) ||
        all.find((t) => t.is_active) ||
        all[0] ||
        null;
      if (start) {
        setSelectedTemplateId(start.id);
        setBodyHtml(start.body_html);
      } else {
        // No library row yet — fall back to the code seed (the redesigned default).
        setSelectedTemplateId('');
        setBodyHtml(POPUP_SEED_BODY);
      }
      setSeedTick((t) => t + 1);
    } catch (e) {
      console.error('Failed to load popup templates:', e);
      setBodyHtml(POPUP_SEED_BODY);
      setSeedTick((t) => t + 1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setViewMode('preview');
      setSourceMode(false);
      void seedOnOpen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplateId(id);
    const tpl = templates.find((t) => t.id === id);
    if (tpl) { setBodyHtml(tpl.body_html); setSeedTick((t) => t + 1); }
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

  // Convert the previewed/resolved values back to tokens before persisting, so a saved popup
  // stays portable across clients (mirrors EmailComposeModal.detokenize).
  const detokenize = (text: string): string => {
    let out = text;
    if (tokenCtx.clientName) out = out.split(tokenCtx.clientName).join('{{client_name}}');
    if (tokenCtx.propertyAddress) out = out.split(tokenCtx.propertyAddress).join('{{property_address}}');
    if (tokenCtx.jobNumber) out = out.split(tokenCtx.jobNumber).join('{{job_number}}');
    return out;
  };

  // Save the current content over the selected popup AND make it active (the common case:
  // "this is the screen I want shown"). Insert a new active row if nothing is selected.
  const handleSaveActive = async () => {
    setSavingActive(true);
    try {
      const res = await savePopupTemplate({
        id: selectedTemplateId || undefined,
        name: templates.find((t) => t.id === selectedTemplateId)?.name || 'Default Thank-You',
        body_html: detokenize(bodyHtml),
        setActive: true,
      });
      if (!res.success) { toast.error(`Could not save: ${res.error}`); return; }
      toast.success('Saved and set as the active popup');
      const all = await loadAllPopupTemplates();
      setTemplates(all);
      if (res.id) setSelectedTemplateId(res.id);
      onSaved?.();
    } finally {
      setSavingActive(false);
    }
  };

  const handleSaveVersion = async () => {
    if (!versionName.trim()) { toast.error('Give the version a name'); return; }
    setSavingVersion(true);
    try {
      const res = await savePopupTemplate({
        name: versionName.trim(),
        body_html: detokenize(bodyHtml),
        setActive: versionSetActive,
      });
      if (!res.success) { toast.error(`Could not save version: ${res.error}`); return; }
      toast.success(`Saved "${versionName.trim()}"${versionSetActive ? ' (now active)' : ''}`);
      const all = await loadAllPopupTemplates();
      setTemplates(all);
      if (res.id) setSelectedTemplateId(res.id);
      setSaveVersionOpen(false);
      setVersionName('');
      setVersionSetActive(true);
      onSaved?.();
    } finally {
      setSavingVersion(false);
    }
  };

  const handleSetActive = async () => {
    if (!selectedTemplateId) { toast.error('Save this popup first, then set it active'); return; }
    const ok = await setActivePopupTemplate(selectedTemplateId);
    if (ok) {
      toast.success('Set as the active popup');
      const all = await loadAllPopupTemplates();
      setTemplates(all);
      onSaved?.();
    } else {
      toast.error('Could not set active');
    }
  };

  const handleResetToSeed = async () => {
    const res = await resetActivePopupTemplateToSeed();
    if (res.success) { toast.success('Active popup reset to the original'); await seedOnOpen(); }
    else toast.error(`Reset failed: ${res.error}`);
  };

  // Preview renders tokens resolved against the current job (what the client would see).
  const previewHtml = resolvePopupTokens(bodyHtml, tokenCtx);
  const activeName = templates.find((t) => t.is_active)?.name;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[90vw] h-[95vh] flex flex-col p-4 [&>button]:hidden">
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MonitorCheck className="h-4 w-4 text-muted-foreground" /> Popup Editor
            </h2>
            <p className="text-sm text-muted-foreground">
              The post-sign Thank-You screen{activeName ? ` — active: ${activeName}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Select value={selectedTemplateId} onValueChange={handleSelectTemplate} disabled={isLoading || !templates.length}>
              <SelectTrigger className="h-8 w-[200px] text-sm">
                <SelectValue placeholder={templates.length ? 'Select a popup' : 'No saved popups'} />
              </SelectTrigger>
              <SelectContent>
                {templates.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}{t.is_active ? ' (active)' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading popup…
          </div>
        ) : viewMode === 'preview' ? (
          /* preview-first — full-width rendered preview + Edit */
          <div className="flex-1 flex flex-col overflow-hidden my-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">Preview — how the signed screen will look for this client</span>
              <Button variant="outline" size="sm" className="h-8 gap-1" onClick={() => setViewMode('edit')}>
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Button>
            </div>
            <div className="flex-1 border rounded-lg overflow-auto bg-white">
              <iframe srcDoc={previewHtml} title="Popup preview" className="w-full h-full" sandbox="allow-same-origin" style={{ border: 'none', minHeight: '100%' }} />
            </div>
          </div>
        ) : (
          /* edit mode — 2-col split */
          <div className="flex-1 grid grid-cols-2 gap-4 overflow-hidden my-2">
            {/* Left: editor */}
            <div className="flex flex-col gap-3 overflow-auto pr-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Edit the Thank-You screen</span>
                <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={() => setViewMode('preview')}>
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Preview
                </Button>
              </div>

              <div>
                <Label className="text-xs font-medium">Merge fields (click to insert — locked)</Label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {POPUP_MERGE_TOKENS.map((t) => (
                    <button
                      key={t.token}
                      type="button"
                      onClick={() => insertToken(t.token)}
                      title="Resolves on the signed screen, from this job"
                      className="text-xs px-2 py-1 rounded border font-mono transition-colors bg-muted border-border text-foreground hover:bg-gray-200"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <Label htmlFor="popup-body" className="text-xs font-medium">
                    {sourceMode ? 'Body (HTML source)' : 'Body — click to edit the screen'}
                  </Label>
                  <button
                    type="button"
                    onClick={toggleSourceMode}
                    title={sourceMode ? 'Switch back to editing the rendered screen' : 'Drop into raw HTML for fully custom formatting'}
                    className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border border-border text-muted-foreground hover:bg-muted transition-colors font-mono"
                  >
                    {sourceMode ? '◀ Rich view' : '</> HTML source'}
                  </button>
                </div>
                {sourceMode ? (
                  <textarea
                    id="popup-body"
                    ref={bodyRef}
                    value={bodyHtml}
                    onChange={(e) => setBodyHtml(e.target.value)}
                    className="mt-1 flex-1 min-h-[240px] w-full rounded-md border border-border bg-card p-2 text-xs font-mono text-foreground focus:outline-none focus:ring-0 focus:border-gray-400"
                    spellCheck={false}
                  />
                ) : (
                  <iframe ref={editorIframeRef} title="Popup body editor" className="mt-1 flex-1 min-h-[240px] w-full rounded-md border border-border bg-white focus-within:border-gray-400" />
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={() => setSaveVersionOpen(true)} className="gap-1 h-8 text-xs">
                  <FilePlus2 className="h-3.5 w-3.5" /> Save as version
                </Button>
                {selectedTemplateId && (
                  <Button variant="ghost" size="sm" onClick={handleSetActive} className="gap-1 h-8 text-xs" title="Make the selected popup the one shown on the signing page">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Set active
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={handleResetToSeed} className="gap-1 h-8 text-xs" title="Restore the active popup to the verbatim original">
                  <RotateCcw className="h-3.5 w-3.5" /> Reset to original
                </Button>
              </div>
            </div>

            {/* Right: live preview */}
            <div className="flex flex-col overflow-hidden">
              <Label className="text-xs font-medium mb-1">Preview</Label>
              <div className="flex-1 border rounded-lg overflow-auto bg-white">
                <iframe srcDoc={previewHtml} title="Popup preview" className="w-full h-full" sandbox="allow-same-origin" style={{ border: 'none', minHeight: '100%' }} />
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t">
          <p className="text-xs text-muted-foreground">The active popup is what the client sees after signing.</p>
          <button
            onClick={handleSaveActive}
            disabled={savingActive || isLoading}
            className="text-foreground hover:underline transition-colors text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed disabled:no-underline flex items-center gap-1"
          >
            {savingActive ? 'Saving…' : <><Save className="h-4 w-4" /> Save &amp; set active</>}
          </button>
        </div>

        {/* Save-as-version sub-dialog */}
        <Dialog open={saveVersionOpen} onOpenChange={setSaveVersionOpen}>
          <DialogContent className="max-w-md">
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold flex items-center gap-1"><FilePlus2 className="h-4 w-4" /> Save as a new popup version</h3>
              <div>
                <Label htmlFor="popup-version-name" className="text-xs font-medium">Version name</Label>
                <Input id="popup-version-name" value={versionName} onChange={(e) => setVersionName(e.target.value)} placeholder="e.g. Thank-You — with next steps" className="h-9 text-sm mt-1" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={versionSetActive} onChange={(e) => setVersionSetActive(e.target.checked)} className="h-4 w-4" />
                Set as the active popup
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

export default PopupComposeModal;
