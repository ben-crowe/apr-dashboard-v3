import { supabase } from '@/integrations/supabase/client';

export interface SaveTemplateParams {
  templateName: string;
  templateHTML: string;
  setAsDefault: boolean;
}

export interface SaveTemplateResult {
  success: boolean;
  templateId?: string;
  error?: string;
}

export interface LOETemplate {
  id: string;
  name: string;
  template_html: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Save LOE template to database (app-wide, no user requirement)
 * If setAsDefault is true, unsets all other templates as default first
 */
export async function saveTemplate({
  templateName,
  templateHTML,
  setAsDefault
}: SaveTemplateParams): Promise<SaveTemplateResult> {
  try {
    // If setting as default, unset other defaults first (app-wide)
    if (setAsDefault) {
      const { error: updateError } = await supabase
        .from('loe_templates')
        .update({ is_default: false })
        .eq('is_default', true);

      if (updateError) {
        console.error('Failed to unset other defaults:', updateError);
        return { success: false, error: updateError.message };
      }
    }

    // Insert new template (app-wide, no created_by requirement)
    const { data, error } = await supabase
      .from('loe_templates')
      .insert({
        name: templateName,
        template_html: templateHTML,
        is_default: setAsDefault,
        version: 1
      })
      .select('id')
      .single();

    if (error) {
      console.error('Failed to save template:', error);
      return { success: false, error: error.message };
    }

    return { success: true, templateId: data.id };
  } catch (err: any) {
    console.error('Error saving template:', err);
    return { success: false, error: err.message || 'Unknown error occurred' };
  }
}

/**
 * Load all templates (app-wide)
 */
export async function loadAllTemplates(): Promise<LOETemplate[]> {
  try {
    // PREVIEW PICKER: surface ALL templates (active or not) so every version — incl. a
    // staged-but-not-live one (e.g. V07 default-but-inactive) — is selectable to view/edit.
    // The SEND path is a SEPARATE loader (loadTemplateRow, newest-ACTIVE in generateLOE.ts)
    // and is unaffected: making a template visible here does NOT put it in the send path.
    const { data, error } = await supabase
      .from('loe_templates')
      .select('*')
      .order('is_default', { ascending: false })
      .order('version', { ascending: false });

    if (error) {
      console.error('Failed to load templates:', error);
      return [];
    }

    return data || [];
  } catch (err: any) {
    console.error('Error loading templates:', err);
    return [];
  }
}

/**
 * Load default template (app-wide)
 */
export async function loadDefaultTemplate(): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('loe_templates')
      .select('template_html')
      .eq('is_default', true)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return null;
    }

    return data.template_html;
  } catch (err: any) {
    console.error('Error loading default template:', err);
    return null;
  }
}

/**
 * Load template by ID
 */
export async function loadTemplateById(templateId: string): Promise<LOETemplate | null> {
  try {
    // No is_active filter — the preview picker can load ANY template (incl. a staged
    // not-yet-live one) to view/edit. Send path is separate (loadTemplateRow), so this is safe.
    const { data, error } = await supabase
      .from('loe_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  } catch (err: any) {
    console.error('Error loading template:', err);
    return null;
  }
}

/**
 * Set template as default (app-wide)
 */
export async function setDefaultTemplate(templateId: string): Promise<boolean> {
  try {
    // Unset all other defaults first
    await supabase
      .from('loe_templates')
      .update({ is_default: false })
      .eq('is_default', true);

    // Set this template as default
    const { error } = await supabase
      .from('loe_templates')
      .update({ is_default: true })
      .eq('id', templateId);

    if (error) {
      console.error('Failed to set default template:', error);
      return false;
    }

    return true;
  } catch (err: any) {
    console.error('Error setting default template:', err);
    return false;
  }
}
