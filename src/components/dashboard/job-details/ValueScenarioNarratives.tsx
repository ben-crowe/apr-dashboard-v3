import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings, Pencil, Lock, X, Eye, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ALL_SCENARIOS, resolveNarrative } from "@/utils/loe/loeCascade";
import { loadNarrativeMap, saveNarrative, type NarrativeMap } from "@/utils/loe/narrativeStore";

/**
 * Value-Scenario narrative editor — live mirror of LOE Section 10.
 *
 * INLINE (primary, on the dashboard): the scenarios THIS job derives show their actual §10 write-up
 * right here, readable at a glance, editable in place (Edit → Save & lock). No drilling.
 * COG → LIBRARY: the full registry (every scenario incl. the 4 pending ones Chris fills) in a modal.
 *
 * What you save here is exactly what §10 prints (generateLOE preloads this same store). Empty summary →
 * §10 keeps its literal bracket (degrades cleanly). Store-load fail → falls back to the code seed text.
 */
interface Props {
  scenarios: string[]; // the value scenarios derived for THIS job (from the cascade)
}

const ValueScenarioNarratives: React.FC<Props> = ({ scenarios }) => {
  const [map, setMap] = useState<NarrativeMap | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [libOpen, setLibOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const m = await loadNarrativeMap();
      if (!alive) return;
      if (m) setMap(m);
      else setLoadFailed(true); // honest: store unreachable → we show seed text + a note
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  // Resolved text for a scenario: edited store value if present, else the code seed (never blank-regress).
  const textOf = (s: string): string => {
    if (map && Object.prototype.hasOwnProperty.call(map, s)) return map[s] || "";
    return resolveNarrative(s) || "";
  };

  const startEdit = (s: string) => { setDraft(textOf(s)); setEditing(s); };
  const cancel = () => { setEditing(null); setDraft(""); };

  const save = async (s: string) => {
    setSaving(s);
    const res = await saveNarrative(s, draft.trim());
    setSaving(null);
    if (res.success) {
      setMap(m => ({ ...(m || {}), [s]: draft.trim() }));
      setEditing(null);
      toast.success("Locked in — Section 10 will print this.");
    } else {
      toast.error(`Couldn't save: ${res.error || "write failed (are you signed in?)"}`);
    }
  };

  // One scenario row — used both inline (rowNum set) and in the library (rowNum omitted).
  const ScenarioRow = ({ s, rowNum }: { s: string; rowNum?: number }) => {
    const txt = textOf(s);
    const empty = !txt.trim();
    const isEditing = editing === s;
    const isSaving = saving === s;
    return (
      <div className="border border-border rounded-lg bg-muted/40 mb-2 overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 bg-card border-b border-border">
          <span className={`h-2 w-2 rounded-full shrink-0 ${empty ? "bg-amber-400" : "bg-rose-500"}`} />
          <span className="text-[13px] font-semibold flex-1 truncate">{s}</span>
          {rowNum != null && (
            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground bg-muted border border-border rounded-full px-2 py-0.5">§10 row {rowNum}</span>
          )}
          {empty && rowNum == null && (
            <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">needs text</span>
          )}
          {!isEditing && (
            <button
              onClick={() => startEdit(s)}
              className="flex items-center gap-1.5 text-[11.5px] border border-border rounded-md px-2.5 py-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Pencil className="h-3 w-3" /> {empty ? "Add text" : "Edit"}
            </button>
          )}
        </div>
        <div className="p-3">
          {isEditing ? (
            <>
              <textarea
                value={draft}
                onChange={e => setDraft(e.target.value)}
                autoFocus
                className="w-full min-h-[84px] rounded-md border border-border bg-card p-2.5 text-[13px] leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 resize-y"
              />
              <div className="flex items-center gap-2 mt-2.5">
                <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => save(s)} disabled={isSaving}>
                  {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Lock className="h-3.5 w-3.5" />}
                  Save &amp; lock
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs" onClick={cancel} disabled={isSaving}>Cancel</Button>
              </div>
            </>
          ) : (
            <>
              {empty ? (
                <p className="text-[12.5px] italic text-amber-700">
                  No write-up yet — Section 10 prints a literal placeholder until one is added. Add the wording here (this is where the pending copy goes).
                </p>
              ) : (
                <p className="text-[13px] leading-relaxed text-slate-800 dark:text-slate-200" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{txt}</p>
              )}
              <p className="text-[10.5px] text-muted-foreground mt-2 flex items-center gap-1.5">
                Prints into Section 10{rowNum != null ? ` as [EA/HCSummary${rowNum}]` : ""} · live mirror
              </p>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-3 pt-3 border-t border-border">
      <div className="flex items-center gap-2 mb-0.5">
        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-medium">Section 10 write-ups</span>
        <span className="text-[11px] text-muted-foreground italic">— exactly what prints in the contract</span>
        <button
          onClick={() => setLibOpen(true)}
          className="ml-auto flex items-center gap-1.5 text-[11.5px] border border-border rounded-md px-2.5 py-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Open the full scenario library (incl. the ones not on this job)"
        >
          <Settings className="h-3.5 w-3.5" /> All scenarios
        </button>
      </div>

      {loadFailed && (
        <div className="flex items-center gap-2 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2.5 py-1.5 mb-2">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> Showing the built-in text — couldn’t reach the saved store. Edits may not persist until it’s back.
        </div>
      )}

      {loading ? (
        <p className="text-[12px] text-muted-foreground flex items-center gap-2 py-2"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading write-ups…</p>
      ) : scenarios.length === 0 ? (
        <p className="text-[12px] text-muted-foreground italic py-1">Pick a Status of Improvements (or scenario) to see the write-ups that will print.</p>
      ) : (
        scenarios.map((s, i) => <ScenarioRow key={s} s={s} rowNum={i + 1} />)
      )}

      {/* Full library (cog) */}
      <Dialog open={libOpen} onOpenChange={setLibOpen}>
        <DialogContent className="max-w-2xl w-[92vw] max-h-[88vh] flex flex-col p-0 [&>button]:hidden">
          <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-border">
            <div>
              <p className="text-sm font-semibold">All Section 10 scenarios — library</p>
              <p className="text-[11.5px] text-muted-foreground mt-0.5">Every scenario in the registry. Edit any write-up; this is where the pending ones (e.g. Insurable Replacement Cost) get filled.</p>
            </div>
            <button onClick={() => setLibOpen(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted"><X className="h-4 w-4" /></button>
          </div>
          <div className="px-5 py-4 overflow-auto">
            {ALL_SCENARIOS.map(s => <ScenarioRow key={s} s={s} />)}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ValueScenarioNarratives;
