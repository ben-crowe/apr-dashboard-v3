/**
 * Value-Scenario narrative store — the editable home for §10 summaries.
 *
 * Today the summaries live hardcoded in `NARRATIVES` (loeCascade.ts). This moves them into the
 * Supabase `scenario_narratives` table so they can be read + edited + locked in the dashboard
 * (Value Scenarios area) and flow straight into the generated LOE (live mirror). The code `NARRATIVES`
 * const stays as the SEED + fallback so a fresh/empty DB never blank-regresses.
 *
 * Mirror of `seedTemplatesIfEmpty` (generateLOE.ts): seed at runtime, upsert-if-empty, verbatim from
 * the code seed (incl. the client typo "makret" — Chris's call to fix, not ours).
 *
 * RLS (v1): public read / authenticated write. A write on an UNauthenticated session silently no-ops
 * under RLS — callers surface save failures honestly (never optimistic-success). Reads work anon.
 */
import { supabase } from '@/integrations/supabase/client';
import { NARRATIVES } from './loeCascade';

export type NarrativeMap = Record<string, string | null>;

let _cache: NarrativeMap | null = null;

/** Seed the table from the code NARRATIVES const if it's empty (verbatim summaries). Non-fatal. */
async function seedIfEmpty(): Promise<void> {
  try {
    const { count, error } = await supabase
      .from('scenario_narratives')
      .select('scenario', { count: 'exact', head: true });
    if (error || (count ?? 0) > 0) return;
    const rows = NARRATIVES.map(n => ({
      scenario: n.scenario,
      summary: n.summary,
      ea_detail: n.eaDetail,
      hc_detail: n.hcDetail,
    }));
    await supabase.from('scenario_narratives').upsert(rows, { onConflict: 'scenario' });
  } catch (err) {
    console.warn('scenario_narratives seed skipped (non-fatal):', err);
  }
}

/**
 * Load every narrative as a {scenario → summary} map. Seeds the table first if empty. Returns null
 * on a hard failure so callers fall back to the code seed (never blank-regress). Cached per session;
 * pass `force` after a save to refresh.
 */
export async function loadNarrativeMap(force = false): Promise<NarrativeMap | null> {
  if (_cache && !force) return _cache;
  try {
    await seedIfEmpty();
    const { data, error } = await supabase
      .from('scenario_narratives')
      .select('scenario, summary');
    if (error || !data) return null;
    const map: NarrativeMap = {};
    for (const row of data) map[(row as any).scenario] = (row as any).summary ?? null;
    _cache = map;
    return map;
  } catch (err) {
    console.warn('loadNarrativeMap failed — falling back to code seed:', err);
    return null;
  }
}

/**
 * Save (lock in) a scenario's summary. Upserts by scenario. Returns an honest {success,error} — an
 * UNauthenticated session no-ops under RLS, so callers must surface a real failure, never a false pass.
 */
export async function saveNarrative(
  scenario: string,
  summary: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('scenario_narratives')
      .upsert({ scenario, summary, updated_at: new Date().toISOString() }, { onConflict: 'scenario' });
    if (error) return { success: false, error: error.message };
    if (_cache) _cache[scenario] = summary; // keep cache live
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || String(err) };
  }
}

/** Drop the in-memory cache (e.g. after an external change). */
export function invalidateNarrativeCache(): void {
  _cache = null;
}
