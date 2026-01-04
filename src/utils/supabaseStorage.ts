/**
 * Supabase Storage URL Utilities
 * Handles both public and private bucket access with signed URLs
 */

import { supabase } from '@/integrations/supabase/client';
import { STORAGE_BUCKETS } from '@/features/image-configurator/types';

export interface ImageUrlOptions {
  width?: number;
  height?: number;
  quality?: number;
  expiresIn?: number; // seconds, default 3600 (1 hour)
}

/**
 * Get a signed URL for a private storage bucket
 * Private buckets require authentication, so we use signed URLs
 */
export async function getSignedImageUrl(
  path: string,
  options?: ImageUrlOptions
): Promise<string | null> {
  try {
    // Determine bucket from path
    const bucket = path.includes('processed') 
      ? STORAGE_BUCKETS.PROCESSED 
      : STORAGE_BUCKETS.RAW;

    // Create signed URL with expiration (default 1 hour)
    const expiresIn = options?.expiresIn || 3600;
    
    // Note: Supabase signed URLs don't support transform options directly
    // Transformations need to be done via the render/image endpoint or client-side
    // For now, we'll get the signed URL and append transform params if needed
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);
    
    if (error) {
      console.error('Error creating signed URL:', error);
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    // If transform options are provided, we need to use the render endpoint
    // But signed URLs don't support this - we'll return the base signed URL
    // Transformations should be handled client-side or via processed variants
    return data.signedUrl;
  } catch (error) {
    console.error('Exception creating signed URL:', error);
    return null;
  }
}

/**
 * Get public URL for a public storage bucket
 * Only use this for public buckets
 */
export function getPublicImageUrl(
  path: string,
  options?: ImageUrlOptions
): string {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const bucket = path.includes('processed') 
    ? STORAGE_BUCKETS.PROCESSED 
    : STORAGE_BUCKETS.RAW;

  let url = `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;

  // Add transformation params if provided
  if (options) {
    const params = new URLSearchParams();
    if (options.width) params.set('width', String(options.width));
    if (options.height) params.set('height', String(options.height));
    if (options.quality) params.set('quality', String(options.quality));

    if (params.toString()) {
      url += `?${params.toString()}`;
    }
  }

  return url;
}

/**
 * React hook to get image URL
 * Uses public URLs for public buckets (simpler and faster)
 */
export function useSignedImageUrl(
  path: string | null | undefined,
  options?: ImageUrlOptions
): string | null {
  // For public buckets, just return the public URL directly
  if (!path) return null;
  return getPublicImageUrl(path, options);
}

