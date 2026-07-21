import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, X, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { parseTemplate, reconstructHTML, EditableSection } from "@/utils/loe/templateParser";

/**
 * DocumentFieldsEditor — the sectioned FIELDS panel (labeled box per editable section,
 * numbered-group headers, [field] placeholder guard) extracted from TemplateEditorModal
 * (the "Edit Contract" screen) so it is ONE editor codebase instead of two. Both
 * TemplateEditorModal's Split view and the Component Studio's document Split view render
 * through this component — editing a field here and editing it there are the same code path.
 *
 * Ownership split: this component owns section state + reconstruction; the CALLER owns the
 * live preview (it re-renders whatever `onChange` hands back) and the save destination.
 */
export interface DocumentFieldsEditorProps {
  /** The document's current HTML — parsed into sections. Changing this to a genuinely NEW
      document (not an echo of this component's own onChange) re-derives sections from it. */
  html: string;
  /** Fires with the reconstructed HTML on every field edit, so the caller can re-render its
      live preview in place. */
  onChange: (reconstructedHTML: string) => void;
  onSave: () => void | Promise<void>;
  isSaving?: boolean;
  saveLabel?: string;
}

const DocumentFieldsEditor: React.FC<DocumentFieldsEditorProps> = ({ html, onChange, onSave, isSaving, saveLabel = 'Save Draft' }) => {
  const [fontSize, setFontSize] = useState(12);
  const [baseHtml, setBaseHtml] = useState(html);
  const [sections, setSections] = useState<Map<string, string>>(new Map());
  // Tracks the HTML this component itself last emitted via onChange, so an echoed prop update
  // (the caller feeding our own reconstruction back in for its preview) is never mistaken for a
  // NEW document loading — that would reset the sections mid-edit and drop the in-progress typing.
  const lastEmitted = useRef<string | null>(null);

  const editableSections = useMemo(() => (baseHtml ? parseTemplate(baseHtml) : []), [baseHtml]);

  useEffect(() => {
    if (html === lastEmitted.current) return; // our own echo — not a new document
    setBaseHtml(html);
    const initial = new Map<string, string>();
    parseTemplate(html || '').forEach(s => initial.set(s.id, s.content));
    setSections(initial);
  }, [html]);

  const handleTextareaResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    const padding = 16;
    const minHeight = fontSize * 1.3 + padding;
    textarea.style.height = Math.max(textarea.scrollHeight, minHeight) + 'px';
  };

  const handleSectionChange = (sectionId: string, value: string) => {
    setSections(prev => {
      const updated = new Map(prev);
      updated.set(sectionId, value);
      try {
        const reconstructed = reconstructHTML(baseHtml, updated, editableSections);
        lastEmitted.current = reconstructed;
        onChange(reconstructed);
      } catch (err) {
        console.warn('DocumentFieldsEditor: reconstruction failed', err);
      }
      return updated;
    });
  };

  const handleSaveClick = () => {
    const placeholderPattern = /\[[\w.-]+\]/g;
    const originalPlaceholders = (baseHtml.match(placeholderPattern) || []).sort();
    const editedPlaceholders: string[] = [];
    sections.forEach(content => editedPlaceholders.push(...(content.match(placeholderPattern) || [])));
    if (JSON.stringify(originalPlaceholders) !== JSON.stringify(editedPlaceholders.sort())) {
      toast.error('Warning: Field placeholders have been modified! Please ensure all [field] placeholders are intact.');
      return;
    }
    onSave();
  };

  const groups = useMemo(() => {
    const g: { title: string; items: EditableSection[] }[] = [];
    for (const s of editableSections) {
      const title = s.sectionTitle || s.label || 'Section';
      const last = g[g.length - 1];
      if (last && last.title === title) last.items.push(s);
      else g.push({ title, items: [s] });
    }
    return g;
  }, [editableSections]);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex items-center justify-end gap-1 border-b border-border mb-2 px-1 py-1.5">
        <Button variant="ghost" size="sm" onClick={() => setFontSize(p => Math.max(p - 1, 10))} className="h-5 w-5 p-0 hover:text-foreground" title="Decrease Font Size"><ChevronDown className="h-3 w-3" /></Button>
        <span className="text-[11px] tabular-nums w-9 text-center select-none">{fontSize}px</span>
        <Button variant="ghost" size="sm" onClick={() => setFontSize(p => Math.min(p + 1, 20))} className="h-5 w-5 p-0 hover:text-foreground" title="Increase Font Size"><ChevronUp className="h-3 w-3" /></Button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 px-1">
        <div className="space-y-2 pb-2" style={{ fontSize: `${fontSize}px`, lineHeight: `${fontSize * 1.3}px` }}>
          {editableSections.length === 0 && (
            <div className="text-xs text-muted-foreground italic select-none px-2 py-6 text-center">No editable sections found in this document.</div>
          )}
          {groups.map((g, gi) => {
            let orderedNum = 0;
            return (
              <div key={gi} className="mb-4">
                <div className="text-sm font-semibold text-foreground border-b border-border pb-1 mb-2">{g.title}</div>
                {g.items.map(section => {
                  const currentValue = sections.get(section.id) || '';
                  const micro = section.fieldLabel
                    ? { text: section.fieldLabel, cls: 'text-xs font-medium text-muted-foreground' }
                    : section.ordered
                      ? { text: String(++orderedNum), cls: 'text-[10px] font-semibold text-muted-foreground/70' }
                      : null;
                  return (
                    <div key={section.id} className="mb-3">
                      {micro && <div className={`mb-1 ${micro.cls}`}>{micro.text}</div>}
                      <Textarea
                        value={currentValue}
                        onChange={(e) => { handleSectionChange(section.id, e.target.value); handleTextareaResize(e); }}
                        className="w-full p-2 border border-border rounded resize-none bg-card text-foreground hover:border-gray-400 focus-visible:border-gray-400 focus-visible:outline-none focus-visible:ring-0 overflow-hidden"
                        rows={1}
                        style={{ fontSize: `${fontSize}px`, lineHeight: `${fontSize * 1.3}px`, height: 'auto', minHeight: `${fontSize * 1.3 + 16}px` }}
                      />
                      {section.placeholders.length > 0 && (
                        <div className="text-xs text-gray-400 dark:text-muted-foreground italic select-none px-2 mt-0.5">{section.placeholders.join(', ')}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2 pt-2 px-1 border-t">
        <Button onClick={handleSaveClick} variant="outline" size="sm" className="h-7 px-2 text-xs gap-1" disabled={isSaving}>
          <Save className="h-3 w-3" /> {isSaving ? 'Saving…' : saveLabel}
        </Button>
      </div>
    </div>
  );
};

export default DocumentFieldsEditor;
