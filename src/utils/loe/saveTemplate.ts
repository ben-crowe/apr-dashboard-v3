import { supabase } from '@/integrations/supabase/client';

export interface SaveTemplateParams {
  templateName: string;
  templateHTML: string;
  setAsDefault: boolean;
  userId: string;
}

export interface SaveTemplateResult {
  success: boolean;
  templateId?: string;
  error?: string;
}

/**
 * Save LOE template to database
 * If setAsDefault is true, unsets all other user templates as default first
 */
export async function saveTemplate({
  templateName,
  templateHTML,
  setAsDefault,
  userId
}: SaveTemplateParams): Promise<SaveTemplateResult> {
  try {
    // If setting as default, unset other defaults first
    if (setAsDefault) {
      const { error: updateError } = await supabase
        .from('loe_templates')
        .update({ is_default: false })
        .eq('created_by', userId)
        .eq('is_default', true);

      if (updateError) {
        console.error('Failed to unset other defaults:', updateError);
        return { success: false, error: updateError.message };
      }
    }

    // Insert new template
    const { data, error } = await supabase
      .from('loe_templates')
      .insert({
        name: templateName,
        template_html: templateHTML,
        is_default: setAsDefault,
        created_by: userId,
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
