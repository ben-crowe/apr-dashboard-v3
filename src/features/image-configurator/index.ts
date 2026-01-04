/**
 * Image Configurator Feature
 *
 * A standalone feature for managing job images in appraisal reports:
 * - Bulk image upload with drag-drop
 * - Filterable image gallery with quality indicators
 * - Drag-drop layout builder for page composition
 * - Non-destructive image editor (crop, rotate, adjust)
 *
 * Usage:
 * ```tsx
 * import { ImageConfiguratorDemo } from '@/features/image-configurator';
 *
 * <ImageConfiguratorDemo jobId="job-123" />
 * ```
 */

// Components
export {
  ImageUploadZone,
  FiltersPanel,
  ImageGrid,
  SortableSlot,
  LayoutBuilder,
  ImageEditorModal,
  ImageConfiguratorDemo,
} from './components';

// Hooks
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
  useLayouts,
  layoutsKeys,
  useCreateDefaultLayouts,
  useAssignImageToSlot,
  useClearSlot,
  useSwapSlotImages,
  useUpdateSlotCaption,
  useAutoFillLayout,
  getSlotsForLayout,
} from './hooks';

// Types
export type {
  JobImage,
  PageLayout,
  PageLayoutSlot,
  ImageFilters,
  UploadProgress,
  ImageCategory,
  LayoutTemplate,
} from './types';

export {
  IMAGE_CATEGORIES,
  IMAGE_SUBCATEGORIES,
  STORAGE_BUCKETS,
  storagePaths,
  DEFAULT_LAYOUTS,
  getSlotCount,
} from './types';
