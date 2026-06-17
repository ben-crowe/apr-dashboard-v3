import React, { useEffect, useState } from 'react';
import { Eye, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { loadAllEmailTemplates, resolveEmailTemplateForDocument, EmailTemplate } from '@/utils/loe/emailTemplate';

/**
 * PRD-APR-LOE-03 (Wave C / Task 4) — the inline `[template ▼][👁 Preview][Send]` row.
 *
 * Reusable, first-class email entry point: drop it beside any document (docTemplateId = the
 * loe_templates id) OR with docTemplateId = null for a DOCUMENT-LESS send (KR2 — email is no
 * longer a sub-step of a document). It only PICKS + hands the chosen template up via the
 * callbacks — the parent wires the real send + instance persistence (Wave D), so this control
 * stays dumb and reusable. The dropdown is sourced from the managed library (Task 2), and the
 * default-for-this-document pre-selects via resolveEmailTemplateForDocument (deterministic, the
 * partial-unique pairing index guarantees a single paired match).
 */
interface Props {
  /** The document template this email accompanies, or null for a document-less email. */
  docTemplateId: string | null;
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
      const all = (await loadAllEmailTemplates()).filter((t) => t.channel === 'email');
      setTemplates(all);
      setSelectedId(resolveEmailTemplateForDocument(docTemplateId, all)?.id ?? '');
    })();
  }, [docTemplateId]);

  const selected = templates.find((t) => t.id === selectedId) ?? null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground whitespace-nowrap">Send by Email:</span>
      <Select value={selectedId} onValueChange={setSelectedId} disabled={disabled || !templates.length}>
        <SelectTrigger className="h-8 w-[220px] text-sm">
          <SelectValue placeholder="Email template" />
        </SelectTrigger>
        <SelectContent>
          {templates.map((t) => (
            <SelectItem key={t.id} value={t.id}>
              {t.name}
              {t.is_default ? ' (default)' : ''}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-1"
        disabled={!selected}
        onClick={() => selected && onPreview(selected)}
        title="Preview / edit the email"
      >
        <Eye className="h-4 w-4" /> Preview
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1"
        disabled={disabled || isSending || !selected}
        onClick={async () => {
          if (!selected) return;
          setIsSending(true);
          try {
            await onSend(selected);
          } finally {
            setIsSending(false);
          }
        }}
      >
        {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send
      </Button>
    </div>
  );
};

export default SendByEmailControl;
