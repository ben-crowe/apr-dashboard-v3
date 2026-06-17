import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useReportBuilderStore } from '../store/reportBuilderStore';
import { fieldRegistry } from '../schema/fieldRegistry';
import type { ReportSection } from '../types/reportBuilder.types';

// ─── V4 Slice 1: report-builder persistence (outbound save half) ────────────────
// Mirror of useLoadJobIntoReport (the inbound bridge). Serializes the store's
// field-value bag → upserts one row per job into report_builder_data → stamps a
// validated schema_version. Open access (no auth gate — Ben's call, this is a
// dev/test instance; login-based gating is a separate later feature).
// Spec: docs/Architecture/SPEC-V4-slice1-unlock-persist.md

/** The data shape we validate the bag against. Bump when the field schema changes. */
export const REPORT_SCHEMA_VERSION = 1;

export type FieldBag = Record<string, string | string[] | number>;

/** Build the set of every known field id (id + storeId) once, for validation. */
const KNOWN_FIELD_IDS: Set<string> = (() => {
  const ids = new Set<string>();
  for (const f of fieldRegistry) {
    if (f.id) ids.add(f.id);
    // storeId is an alias some fields carry; accept both so a saved bag round-trips.
    const storeId = (f as { storeId?: string }).storeId;
    if (storeId) ids.add(storeId);
  }
  return ids;
})();

/** Flatten the nested store (sections + subsections → fields) into a flat id→value bag. */
export function serializeFieldBag(sections: ReportSection[]): FieldBag {
  const bag: FieldBag = {};
  const take = (id: string, value: unknown) => {
    if (value === undefined || value === null) return;
    if (typeof value === 'string' && value === '') return;
    if (Array.isArray(value) && value.length === 0) return;
    bag[id] = value as string | string[] | number;
  };
  for (const section of sections) {
    for (const field of section.fields ?? []) take(field.id, field.value);
    for (const sub of section.subsections ?? []) {
      for (const field of sub.fields ?? []) take(field.id, field.value);
    }
  }
  return bag;
}

/**
 * QA FIX 1 — REAL validation, not a claim. Split the bag into keys that exist in the
 * field registry vs unknown keys. We persist ONLY the validated subset, so the stored
 * data is always registry-shaped for the stamped schema_version.
 */
export function validateFieldBag(bag: FieldBag): {
  validBag: FieldBag;
  unknownKeys: string[];
} {
  const validBag: FieldBag = {};
  const unknownKeys: string[] = [];
  for (const [key, value] of Object.entries(bag)) {
    if (KNOWN_FIELD_IDS.has(key)) validBag[key] = value;
    else unknownKeys.push(key);
  }
  return { validBag, unknownKeys };
}

/** Upsert the current store state for a job. Honest error on failure (no silent success). */
export async function saveReportBuilderData(
  jobId: string,
  sections: ReportSection[],
): Promise<{ error: string | null }> {
  if (!jobId) return { error: 'No jobId — cannot save report data.' };

  const bag = serializeFieldBag(sections);
  const { validBag, unknownKeys } = validateFieldBag(bag);
  if (unknownKeys.length > 0) {
    console.warn(
      `[report_builder_data] dropped ${unknownKeys.length} field id(s) not in the registry (schema v${REPORT_SCHEMA_VERSION}):`,
      unknownKeys.slice(0, 20),
    );
  }

  const { error } = await supabase
    .from('report_builder_data')
    .upsert(
      {
        job_id: jobId,
        schema_version: REPORT_SCHEMA_VERSION,
        data: validBag,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'job_id' },
    );

  if (error) {
    console.error('[report_builder_data] save failed:', error);
    toast.error(`Report save failed: ${error.message}`);
    return { error: error.message };
  }
  return { error: null };
}

/**
 * Load the saved bag for a job. QA FIX 2 — zero rows is a DEFINED state, not an error:
 * a never-saved job returns { data: null } and the caller leaves the store as a clean
 * empty/mock form. Only a real query error returns an error.
 */
export async function loadReportBuilderData(
  jobId: string,
): Promise<{ data: FieldBag | null; error: string | null }> {
  if (!jobId) return { data: null, error: null };

  const { data, error } = await supabase
    .from('report_builder_data')
    .select('data')
    .eq('job_id', jobId)
    .maybeSingle();

  if (error) {
    console.error('[report_builder_data] load failed:', error);
    return { data: null, error: error.message };
  }
  // Zero rows → maybeSingle returns data === null → clean empty state, NOT a crash.
  return { data: (data?.data as FieldBag) ?? null, error: null };
}

/**
 * Debounced autosave (~2s). Subscribes to store changes; whenever the store is dirty
 * and a job is active, saves after the debounce window and clears the dirty flag.
 * Used by the in-dashboard report builder mount.
 */
export function useReportBuilderAutosave(jobId: string | undefined, enabled: boolean) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled || !jobId) return;

    const unsubscribe = useReportBuilderStore.subscribe((state) => {
      if (!state.isDirty) return;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(async () => {
        const { sections } = useReportBuilderStore.getState();
        const { error } = await saveReportBuilderData(jobId, sections);
        if (!error) {
          // Clear dirty so the next edit (not this save) re-arms autosave — no loop.
          useReportBuilderStore.setState({ isDirty: false });
        }
      }, 2000);
    });

    return () => {
      if (timer.current) clearTimeout(timer.current);
      unsubscribe();
    };
  }, [jobId, enabled]);
}
