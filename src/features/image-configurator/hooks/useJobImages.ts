/**
 * useJobImages Hook
 * Fetches and filters job images from Supabase
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { JobImage, ImageFilters, ImageCategory } from '../types';

// Query key factory
export const jobImagesKeys = {
  all: ['job-images'] as const,
  lists: () => [...jobImagesKeys.all, 'list'] as const,
  list: (jobId: string, filters: ImageFilters) => [...jobImagesKeys.lists(), jobId, filters] as const,
  detail: (imageId: string) => [...jobImagesKeys.all, 'detail', imageId] as const,
};

// Fetch job images with filters
async function fetchJobImages(jobId: string, filters: ImageFilters): Promise<JobImage[]> {
  let query = supabase
    .from('job_images')
    .select('*')
    .eq('job_id', jobId);

  // Apply category filter (check both ai and user category)
  if (filters.category) {
    query = query.or(
      `ai_category.eq.${filters.category},user_category.eq.${filters.category}`
    );
  }

  // Apply subcategory filter
  if (filters.subcategory) {
    query = query.or(
      `ai_subcategory.eq.${filters.subcategory},user_subcategory.eq.${filters.subcategory}`
    );
  }

  // Apply quality filter
  if (filters.minQuality != null) {
    query = query.gte('quality_score', filters.minQuality);
  }

  // Hide rejected images
  if (filters.hideRejected) {
    query = query.eq('selected_for_report', true);
  }

  // Hide already placed images
  if (filters.hidePlaced) {
    query = query.is('page_assignment', null);
  }

  // Show only unreviewed images
  if (filters.showOnlyUnreviewed) {
    query = query.is('user_category', null);
  }

  // Filter by status
  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  // Order by creation time
  const { data, error } = await query.order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

// Hook for fetching job images
export function useJobImages(jobId: string, filters: ImageFilters = {}) {
  return useQuery({
    queryKey: jobImagesKeys.list(jobId, filters),
    queryFn: () => fetchJobImages(jobId, filters),
    enabled: !!jobId,
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Update image category
async function updateImageCategory(
  imageId: string,
  category: ImageCategory,
  subcategory?: string
): Promise<void> {
  const { error } = await supabase
    .from('job_images')
    .update({
      user_category: category,
      user_subcategory: subcategory,
      updated_at: new Date().toISOString(),
    })
    .eq('id', imageId);

  if (error) throw error;
}

export function useUpdateImageCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ imageId, category, subcategory }: {
      imageId: string;
      category: ImageCategory;
      subcategory?: string;
    }) => updateImageCategory(imageId, category, subcategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobImagesKeys.lists() });
    },
  });
}

// Toggle image selection for report
async function toggleImageSelection(imageId: string, selected: boolean): Promise<void> {
  const { error } = await supabase
    .from('job_images')
    .update({
      selected_for_report: selected,
      updated_at: new Date().toISOString(),
    })
    .eq('id', imageId);

  if (error) throw error;
}

export function useToggleImageSelection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ imageId, selected }: { imageId: string; selected: boolean }) =>
      toggleImageSelection(imageId, selected),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobImagesKeys.lists() });
    },
  });
}

// Update image caption
async function updateImageCaption(imageId: string, caption: string): Promise<void> {
  const { error } = await supabase
    .from('job_images')
    .update({
      caption,
      updated_at: new Date().toISOString(),
    })
    .eq('id', imageId);

  if (error) throw error;
}

export function useUpdateImageCaption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ imageId, caption }: { imageId: string; caption: string }) =>
      updateImageCaption(imageId, caption),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobImagesKeys.lists() });
    },
  });
}

// Save crop/adjustments data
async function saveImageEdits(
  imageId: string,
  cropData?: JobImage['crop_data'],
  adjustments?: JobImage['adjustments']
): Promise<void> {
  const { error } = await supabase
    .from('job_images')
    .update({
      crop_data: cropData,
      adjustments,
      updated_at: new Date().toISOString(),
    })
    .eq('id', imageId);

  if (error) throw error;
}

export function useSaveImageEdits() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ imageId, cropData, adjustments }: {
      imageId: string;
      cropData?: JobImage['crop_data'];
      adjustments?: JobImage['adjustments'];
    }) => saveImageEdits(imageId, cropData, adjustments),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobImagesKeys.lists() });
    },
  });
}

// Bulk update image categories
async function bulkUpdateCategories(
  imageIds: string[],
  category: ImageCategory,
  subcategory?: string
): Promise<void> {
  const { error } = await supabase
    .from('job_images')
    .update({
      user_category: category,
      user_subcategory: subcategory,
      updated_at: new Date().toISOString(),
    })
    .in('id', imageIds);

  if (error) throw error;
}

export function useBulkUpdateCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ imageIds, category, subcategory }: {
      imageIds: string[];
      category: ImageCategory;
      subcategory?: string;
    }) => bulkUpdateCategories(imageIds, category, subcategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobImagesKeys.lists() });
    },
  });
}

// Get effective category (user override or AI)
export function getEffectiveCategory(image: JobImage): ImageCategory | undefined {
  return image.user_category || image.ai_category;
}

// Get effective subcategory
export function getEffectiveSubcategory(image: JobImage): string | undefined {
  return image.user_subcategory || image.ai_subcategory;
}

// Get quality color based on score
export function getQualityColor(score: number | undefined): 'green' | 'yellow' | 'red' {
  if (!score) return 'red';
  if (score >= 0.8) return 'green';
  if (score >= 0.6) return 'yellow';
  return 'red';
}

// Check if image needs review (low confidence or no user category)
export function needsReview(image: JobImage): boolean {
  // No user override and low AI confidence
  if (!image.user_category && (image.ai_confidence ?? 0) < 0.6) {
    return true;
  }
  // Quality issues
  if (image.is_blurry || image.is_overexposed || image.is_underexposed) {
    return true;
  }
  return false;
}
