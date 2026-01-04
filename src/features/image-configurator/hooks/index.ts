/**
 * Image Configurator Hooks
 * Export all hooks from the feature
 */

export {
  useJobImages,
  jobImagesKeys,
  useUpdateImageCategory,
  useToggleImageSelection,
  useUpdateImageCaption,
  useSaveImageEdits,
  useBulkUpdateCategories,
  getEffectiveCategory,
  getEffectiveSubcategory,
  getQualityColor,
  needsReview,
} from './useJobImages';

export {
  useLayouts,
  layoutsKeys,
  useCreateDefaultLayouts,
  useAssignImageToSlot,
  useClearSlot,
  useSwapSlotImages,
  useUpdateSlotCaption,
  useAutoFillLayout,
  getSlotsForLayout,
} from './useLayouts';
