import { supabase } from "@/integrations/supabase/client";

const BUCKET_NAME = 'report-images';

// Image categories for folder organization
export type ImageCategory =
  | 'cover'
  | 'signature'
  | 'maps'
  | 'exterior'
  | 'street'
  | 'common'
  | 'units'
  | 'systems';

// Map field IDs to categories
export function getImageCategory(fieldId: string): ImageCategory {
  if (fieldId.includes('cover')) return 'cover';
  if (fieldId.includes('signature')) return 'signature';
  if (fieldId.includes('map') || fieldId.includes('zoning') || fieldId.includes('site-plan')) return 'maps';
  if (fieldId.includes('exterior')) return 'exterior';
  if (fieldId.includes('street')) return 'street';
  if (fieldId.includes('common')) return 'common';
  if (fieldId.includes('unit')) return 'units';
  if (fieldId.includes('systems')) return 'systems';
  return 'cover'; // fallback
}

/**
 * Upload an image to Supabase Storage
 * Path format: {jobId}/{category}/{fieldId}_{timestamp}.{ext}
 */
export async function uploadReportImage(
  file: File,
  jobId: string,
  fieldId: string
): Promise<{ url: string; path: string } | { error: string }> {
  try {
    const category = getImageCategory(fieldId);
    const ext = file.name.split('.').pop() || 'jpg';
    const timestamp = Date.now();
    const path = `${jobId}/${category}/${fieldId}_${timestamp}.${ext}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('Upload error:', error);
      return { error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(path);

    return {
      url: urlData.publicUrl,
      path: data.path,
    };
  } catch (err) {
    console.error('Upload exception:', err);
    return { error: 'Failed to upload image' };
  }
}

/**
 * Delete an image from Supabase Storage
 */
export async function deleteReportImage(path: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Delete exception:', err);
    return false;
  }
}

/**
 * Get public URL for an image path
 */
export function getReportImageUrl(path: string): string {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);

  return data.publicUrl;
}

/**
 * List all images for a job
 */
export async function listJobImages(jobId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(jobId, {
        limit: 100,
        sortBy: { column: 'created_at', order: 'asc' },
      });

    if (error) {
      console.error('List error:', error);
      return [];
    }

    return data.map(file => `${jobId}/${file.name}`);
  } catch (err) {
    console.error('List exception:', err);
    return [];
  }
}

/**
 * Ensure the report-images bucket exists
 */
export async function ensureReportImagesBucketExists(): Promise<boolean> {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error("Error listing buckets:", error);
      return false;
    }

    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);

    if (!bucketExists) {
      console.warn(`⚠️ ${BUCKET_NAME} bucket does not exist. Run migration to create it.`);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error checking bucket:", err);
    return false;
  }
}
