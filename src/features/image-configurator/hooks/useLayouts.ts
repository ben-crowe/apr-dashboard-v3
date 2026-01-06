/**
 * useLayouts Hook
 * Manages page layouts and slots for image placement
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { PageLayout, PageLayoutSlot, LayoutTemplate } from '../types';
import { DEFAULT_LAYOUTS } from '../types';
import { jobImagesKeys } from './useJobImages';

// Query key factory
export const layoutsKeys = {
  all: ['layouts'] as const,
  lists: () => [...layoutsKeys.all, 'list'] as const,
  list: (jobId: string) => [...layoutsKeys.lists(), jobId] as const,
  slots: (layoutId: string) => [...layoutsKeys.all, 'slots', layoutId] as const,
};

// Helper to get slot count (moved up for use in fetchLayouts)
function getSlotCountForTemplate(template: LayoutTemplate): number {
  const counts: Record<LayoutTemplate, number> = {
    '1x1': 1,
    '2x2': 4,
    '2x3': 6,
    '3x3': 9,
    '3x4': 12,
    '4x3': 12,
    'custom': 0,
  };
  return counts[template];
}

// Fetch layouts with their slots - auto-creates from template if none exist
async function fetchLayouts(jobId: string): Promise<{
  layouts: PageLayout[];
  slots: PageLayoutSlot[];
}> {
  // Fetch layouts
  let { data: layouts, error: layoutError } = await supabase
    .from('page_layouts')
    .select('*')
    .eq('job_id', jobId)
    .order('sort_order', { ascending: true });

  if (layoutError) throw layoutError;

  // AUTO-CREATE: If no layouts exist, create from template defaults
  if (!layouts || layouts.length === 0) {
    console.log('[useLayouts] No layouts found for job, creating from template...');

    // Create all layouts from DEFAULT_LAYOUTS
    for (const layout of DEFAULT_LAYOUTS) {
      const { data: newLayout, error: createError } = await supabase
        .from('page_layouts')
        .insert({
          job_id: jobId,
          page_type: layout.page_type,
          layout_template: layout.layout_template,
          sort_order: layout.sort_order,
          title: layout.title,
          category_filter: layout.category_filter,
        })
        .select()
        .single();

      if (createError) {
        console.error('[useLayouts] Error creating layout:', createError);
        throw createError;
      }

      // Create slots for this layout
      const slotCount = getSlotCountForTemplate(layout.layout_template);
      const slots = Array.from({ length: slotCount }, (_, i) => ({
        layout_id: newLayout.id,
        slot_position: i + 1,
        slot_label: `Slot ${i + 1}`,
      }));

      const { error: slotsError } = await supabase
        .from('page_layout_slots')
        .insert(slots);

      if (slotsError) {
        console.error('[useLayouts] Error creating slots:', slotsError);
        throw slotsError;
      }
    }

    console.log('[useLayouts] Created', DEFAULT_LAYOUTS.length, 'layouts from template');

    // Re-fetch the newly created layouts
    const { data: newLayouts, error: refetchError } = await supabase
      .from('page_layouts')
      .select('*')
      .eq('job_id', jobId)
      .order('sort_order', { ascending: true });

    if (refetchError) throw refetchError;
    layouts = newLayouts;
  }

  // Fetch slots for all layouts
  const layoutIds = layouts?.map(l => l.id) || [];
  if (layoutIds.length === 0) {
    return { layouts: [], slots: [] };
  }

  const { data: slots, error: slotsError } = await supabase
    .from('page_layout_slots')
    .select('*')
    .in('layout_id', layoutIds)
    .order('slot_position', { ascending: true });

  if (slotsError) throw slotsError;

  return {
    layouts: layouts || [],
    slots: slots || [],
  };
}

// Hook for fetching layouts and slots
export function useLayouts(jobId: string) {
  return useQuery({
    queryKey: layoutsKeys.list(jobId),
    queryFn: () => fetchLayouts(jobId),
    enabled: !!jobId,
    staleTime: 30 * 1000,
  });
}

// Create default layouts for a job
async function createDefaultLayouts(jobId: string, defaults: typeof DEFAULT_LAYOUTS): Promise<void> {
  // Create layouts
  for (const layout of defaults) {
    const { data: newLayout, error: layoutError } = await supabase
      .from('page_layouts')
      .insert({
        job_id: jobId,
        page_type: layout.page_type,
        layout_template: layout.layout_template,
        sort_order: layout.sort_order,
        title: layout.title,
        category_filter: layout.category_filter,
      })
      .select()
      .single();

    if (layoutError) throw layoutError;

    // Create slots for this layout
    const slotCount = getSlotCountForTemplate(layout.layout_template);
    const slots = Array.from({ length: slotCount }, (_, i) => ({
      layout_id: newLayout.id,
      slot_position: i + 1,
      slot_label: `Slot ${i + 1}`,
    }));

    const { error: slotsError } = await supabase
      .from('page_layout_slots')
      .insert(slots);

    if (slotsError) throw slotsError;
  }
}

export function useCreateDefaultLayouts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, defaults }: { jobId: string; defaults: typeof DEFAULT_LAYOUTS }) =>
      createDefaultLayouts(jobId, defaults),
    onSuccess: (_, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: layoutsKeys.list(jobId) });
    },
  });
}

// Assign image to a slot
async function assignImageToSlot(
  slotId: string,
  imageId: string | null,
  layoutId: string,
  slotPosition: number
): Promise<void> {
  // Update the slot
  const { error: slotError } = await supabase
    .from('page_layout_slots')
    .update({
      image_id: imageId,
    })
    .eq('id', slotId);

  if (slotError) throw slotError;

  // Update the image (if assigning, not clearing)
  if (imageId) {
    const { error: imageError } = await supabase
      .from('job_images')
      .update({
        selected_for_report: true,
        page_assignment: layoutId,
        slot_position: slotPosition,
        updated_at: new Date().toISOString(),
      })
      .eq('id', imageId);

    if (imageError) throw imageError;
  }
}

export function useAssignImageToSlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slotId, imageId, layoutId, slotPosition }: {
      slotId: string;
      imageId: string | null;
      layoutId: string;
      slotPosition: number;
    }) => assignImageToSlot(slotId, imageId, layoutId, slotPosition),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: layoutsKeys.all });
      queryClient.invalidateQueries({ queryKey: jobImagesKeys.lists() });
    },
  });
}

// Clear a slot
async function clearSlot(slotId: string, previousImageId?: string): Promise<void> {
  // Clear the slot
  const { error: slotError } = await supabase
    .from('page_layout_slots')
    .update({
      image_id: null,
    })
    .eq('id', slotId);

  if (slotError) throw slotError;

  // Clear the image's placement if it was assigned
  if (previousImageId) {
    const { error: imageError } = await supabase
      .from('job_images')
      .update({
        page_assignment: null,
        slot_position: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', previousImageId);

    if (imageError) throw imageError;
  }
}

export function useClearSlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slotId, previousImageId }: { slotId: string; previousImageId?: string }) =>
      clearSlot(slotId, previousImageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: layoutsKeys.all });
      queryClient.invalidateQueries({ queryKey: jobImagesKeys.lists() });
    },
  });
}

// Swap images between two slots
async function swapSlotImages(
  slot1Id: string,
  slot2Id: string,
  image1Id: string | null,
  image2Id: string | null
): Promise<void> {
  // Update slot 1 with image 2
  const { error: slot1Error } = await supabase
    .from('page_layout_slots')
    .update({ image_id: image2Id })
    .eq('id', slot1Id);

  if (slot1Error) throw slot1Error;

  // Update slot 2 with image 1
  const { error: slot2Error } = await supabase
    .from('page_layout_slots')
    .update({ image_id: image1Id })
    .eq('id', slot2Id);

  if (slot2Error) throw slot2Error;
}

export function useSwapSlotImages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slot1Id, slot2Id, image1Id, image2Id }: {
      slot1Id: string;
      slot2Id: string;
      image1Id: string | null;
      image2Id: string | null;
    }) => swapSlotImages(slot1Id, slot2Id, image1Id, image2Id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: layoutsKeys.all });
    },
  });
}

// Update slot caption
async function updateSlotCaption(slotId: string, caption: string): Promise<void> {
  const { error } = await supabase
    .from('page_layout_slots')
    .update({ caption })
    .eq('id', slotId);

  if (error) throw error;
}

export function useUpdateSlotCaption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slotId, caption }: { slotId: string; caption: string }) =>
      updateSlotCaption(slotId, caption),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: layoutsKeys.all });
    },
  });
}

// Auto-fill layout with best quality images from matching category
async function autoFillLayout(
  layoutId: string,
  jobId: string,
  categoryFilter?: string
): Promise<void> {
  // Get empty slots for this layout
  const { data: slots, error: slotsError } = await supabase
    .from('page_layout_slots')
    .select('*')
    .eq('layout_id', layoutId)
    .is('image_id', null)
    .order('slot_position', { ascending: true });

  if (slotsError) throw slotsError;
  if (!slots || slots.length === 0) return;

  // Get unplaced images, filtered by category and sorted by quality
  let query = supabase
    .from('job_images')
    .select('*')
    .eq('job_id', jobId)
    .eq('selected_for_report', false)
    .is('page_assignment', null)
    .order('quality_score', { ascending: false })
    .limit(slots.length);

  if (categoryFilter) {
    query = query.or(
      `ai_category.eq.${categoryFilter},user_category.eq.${categoryFilter}`
    );
  }

  const { data: images, error: imagesError } = await query;
  if (imagesError) throw imagesError;
  if (!images || images.length === 0) return;

  // Assign images to slots
  for (let i = 0; i < Math.min(slots.length, images.length); i++) {
    const slot = slots[i];
    const image = images[i];

    await assignImageToSlot(slot.id, image.id, layoutId, slot.slot_position);
  }
}

export function useAutoFillLayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ layoutId, jobId, categoryFilter }: {
      layoutId: string;
      jobId: string;
      categoryFilter?: string;
    }) => autoFillLayout(layoutId, jobId, categoryFilter),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: layoutsKeys.all });
      queryClient.invalidateQueries({ queryKey: jobImagesKeys.lists() });
    },
  });
}

// Get slots for a specific layout
export function getSlotsForLayout(slots: PageLayoutSlot[], layoutId: string): PageLayoutSlot[] {
  return slots.filter(s => s.layout_id === layoutId);
}
