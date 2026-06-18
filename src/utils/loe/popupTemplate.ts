/**
 * Popup template system — the THIRD managed component type beside Document + Email.
 *
 * A "popup" is a saved screen the signing flow renders. Today the only one is the
 * post-sign Thank-You screen (SigningPage), but it's modelled as a managed library so
 * more sequence points can render their own popup later (Vision doc).
 *
 * Mirrors emailTemplate.ts 1:1, with ONE difference: popups resolve by `is_active`
 * (exactly one active) instead of `is_default`. The ACTIVE popup is what the signing
 * page renders (SPEC-APR-LOE-popup-editor INV-0 / INV-3).
 *
 * MERGE TOKENS (visible in the editor, hard-locked) — all resolve at SIGN time, on the
 * signing page, from the signed submission + its job:
 *   {{client_name}} {{property_address}} {{job_number}}
 *
 * The SEED below is the redesigned Thank-You screen (the build's visual deliverable).
 * It lives in CODE so reset-to-seed / the no-active fallback is always real and
 * immutable — a bad overwrite of the active popup can never blank the signing page.
 */
import { supabase } from "@/integrations/supabase/client";

export const POPUP_MERGE_TOKENS = [
  { token: '{{client_name}}',      label: 'Client name',      resolvesAt: 'sign' as const },
  { token: '{{property_address}}', label: 'Property address', resolvesAt: 'sign' as const },
  { token: '{{job_number}}',       label: 'Job number',       resolvesAt: 'sign' as const },
];

export const DEFAULT_POPUP_TEMPLATE_NAME = 'Default Thank-You';

/**
 * The immutable recoverable seed — the REDESIGNED post-sign Thank-You screen.
 *
 * Design direction (engine-primed, ui-ux-pro-max "Trust & Authority"): brand-harmonized
 * to Valta blue (#2c5aa0), restrained, no gradients, an SVG success check (never an
 * emoji), WCAG-AA contrast, prefers-reduced-motion respected. Self-contained full-page
 * HTML so the WHOLE screen is editable in-app and renders standalone in the iframe.
 */
export const POPUP_SEED_BODY = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; height: 100%; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background: #f1f5f9;
    color: #0f172a;
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }
  .va-shell { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 32px 20px; }
  .va-brand { display: flex; align-items: baseline; gap: 8px; margin: 8px 0 40px; }
  .va-brand .mark { font-size: 22px; font-weight: 800; letter-spacing: 0.02em; color: #2c5aa0; }
  .va-brand .sub { font-size: 14px; color: #64748b; }
  .va-card {
    width: 100%;
    max-width: 520px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-top: 4px solid #2c5aa0;
    border-radius: 16px;
    box-shadow: 0 10px 30px -12px rgba(15, 23, 42, 0.18);
    padding: 48px 40px 44px;
    text-align: center;
    animation: va-rise 380ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .va-badge {
    width: 72px; height: 72px; margin: 0 auto 24px;
    border-radius: 999px;
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    display: flex; align-items: center; justify-content: center;
  }
  .va-badge svg { width: 36px; height: 36px; stroke: #059669; }
  .va-card h1 { margin: 0 0 14px; font-size: 28px; line-height: 1.2; font-weight: 700; color: #0f172a; }
  .va-lead { margin: 0 auto 12px; max-width: 40ch; font-size: 16px; line-height: 1.6; color: #334155; }
  .va-sub { margin: 0 auto; max-width: 40ch; font-size: 14px; line-height: 1.6; color: #64748b; }
  .va-rule { width: 48px; height: 3px; margin: 28px auto 0; border-radius: 3px; background: #e2e8f0; }
  .va-foot { text-align: center; padding: 24px 20px 8px; font-size: 12px; color: #94a3b8; }
  @keyframes va-rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
  @media (prefers-reduced-motion: reduce) { .va-card { animation: none; } }
</style>
</head>
<body>
  <div class="va-shell">
    <div class="va-brand">
      <span class="mark">VALTA</span>
      <span class="sub">Property Valuations</span>
    </div>
    <div class="va-card" role="status" aria-live="polite">
      <div class="va-badge" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <h1>Thank You!</h1>
      <p class="va-lead">{{client_name}}, your Letter of Engagement has been successfully signed.</p>
      <p class="va-sub">You will receive a copy of the signed document via email shortly.</p>
      <div class="va-rule" aria-hidden="true"></div>
    </div>
  </div>
  <div class="va-foot">&copy; 2025 Valta Property Valuations Ltd. All rights reserved.</div>
</body>
</html>`;

export interface PopupTemplate {
  id: string;
  name: string;
  body_html: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SavePopupTemplateInput {
  id?: string;            // present = update in place; absent = insert new
  name: string;
  body_html: string;
  setActive?: boolean;
}

/**
 * Resolve the popup's SIGN-time merge tokens from the signed submission + its job.
 * Unknown tokens collapse to a safe value so the signed screen never shows raw `{{…}}`.
 */
export function resolvePopupTokens(
  html: string,
  ctx: { clientName?: string; propertyAddress?: string; jobNumber?: string },
): string {
  return html
    .replaceAll('{{client_name}}', (ctx.clientName || '').trim() || 'Thank you')
    .replaceAll('{{property_address}}', ctx.propertyAddress || 'your property')
    .replaceAll('{{job_number}}', ctx.jobNumber || '');
}

/**
 * Load the ACTIVE popup. Self-heals: if no active row exists yet (fresh DB / no seed),
 * it seeds one from the code constant so the signing page always has a popup to render.
 * Returns null only on a hard DB error — the caller then falls back to the code seed.
 */
export async function loadActivePopupTemplate(): Promise<PopupTemplate | null> {
  const { data, error } = await supabase
    .from('popup_templates')
    .select('*')
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('loadActivePopupTemplate failed:', error);
    return null;
  }
  if (data) return data as PopupTemplate;

  // Self-heal: seed the active popup from the code constant.
  const { data: seeded, error: seedErr } = await supabase
    .from('popup_templates')
    .insert({
      name: DEFAULT_POPUP_TEMPLATE_NAME,
      body_html: POPUP_SEED_BODY,
      is_active: true,
    })
    .select('*')
    .single();
  if (seedErr) {
    console.error('loadActivePopupTemplate seed failed:', seedErr);
    return null;
  }
  return seeded as PopupTemplate;
}

/** All popup templates — active first, then alphabetical. */
export async function loadAllPopupTemplates(): Promise<PopupTemplate[]> {
  const { data, error } = await supabase
    .from('popup_templates')
    .select('*')
    .order('is_active', { ascending: false })
    .order('name', { ascending: true });
  if (error) {
    console.error('loadAllPopupTemplates failed:', error);
    return [];
  }
  return (data ?? []) as PopupTemplate[];
}

/**
 * Create (no id) or update-in-place (id given) a popup template.
 * Single-active invariant: setting one active clears the prior active first, so the
 * partial-unique index (one is_active=true) is never violated.
 */
export async function savePopupTemplate(
  input: SavePopupTemplateInput,
): Promise<{ success: boolean; id?: string; error?: string }> {
  if (input.setActive) {
    await supabase.from('popup_templates').update({ is_active: false }).eq('is_active', true);
  }
  const row = {
    name: input.name,
    body_html: input.body_html,
    is_active: input.setActive ?? false,
    updated_at: new Date().toISOString(),
  };
  if (input.id) {
    const { error } = await supabase.from('popup_templates').update(row).eq('id', input.id);
    return error ? { success: false, error: error.message } : { success: true, id: input.id };
  }
  const { data, error } = await supabase.from('popup_templates').insert(row).select('id').single();
  return error ? { success: false, error: error.message } : { success: true, id: (data as { id: string } | null)?.id };
}

/** Promote one popup to ACTIVE (clears the prior active first — single-active invariant). */
export async function setActivePopupTemplate(id: string): Promise<boolean> {
  await supabase.from('popup_templates').update({ is_active: false }).eq('is_active', true);
  const { error } = await supabase.from('popup_templates').update({ is_active: true }).eq('id', id);
  if (error) {
    console.error('setActivePopupTemplate failed:', error);
    return false;
  }
  return true;
}

/** Reset the active popup to the verbatim original seed (the redesigned default). */
export async function resetActivePopupTemplateToSeed(): Promise<{ success: boolean; error?: string }> {
  const active = await loadActivePopupTemplate();
  if (!active) return { success: false, error: 'No active popup row to reset' };
  const { error } = await supabase
    .from('popup_templates')
    .update({ body_html: POPUP_SEED_BODY, updated_at: new Date().toISOString() })
    .eq('id', active.id);
  return error ? { success: false, error: error.message } : { success: true };
}
