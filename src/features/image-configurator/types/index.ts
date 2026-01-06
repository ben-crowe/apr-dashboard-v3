/**
 * Image Page Configurator Types
 * TypeScript definitions for the image management feature
 */

// Image status in processing pipeline
export type ImageStatus = 'pending' | 'classified' | 'error';

// Image categories for property appraisal photos
export type ImageCategory =
  | 'Exterior'
  | 'Interior Units'
  | 'Common Areas'
  | 'Building Systems'
  | 'Site'
  | 'Basement/Utility'
  | 'Other';

// All image categories
export const IMAGE_CATEGORIES: ImageCategory[] = [
  'Exterior',
  'Interior Units',
  'Common Areas',
  'Building Systems',
  'Site',
  'Basement/Utility',
  'Other',
];

// Image subcategories by category
export const IMAGE_SUBCATEGORIES: Record<ImageCategory, string[]> = {
  'Exterior': ['Front Facade', 'Rear', 'Left Side', 'Right Side', 'Close-up', 'Street View'],
  'Interior Units': ['Kitchen', 'Bathroom', 'Bedroom', 'Living Room', 'Hallway', 'Dining'],
  'Common Areas': ['Lobby', 'Corridor', 'Amenity Space', 'Laundry Room', 'Mailroom'],
  'Building Systems': ['HVAC', 'Electrical', 'Plumbing', 'Water Heater', 'Roof', 'Elevator'],
  'Site': ['Parking', 'Landscaping', 'Signage', 'Entrance', 'Driveway'],
  'Basement/Utility': ['Mechanical Room', 'Storage', 'Foundation', 'Utilities'],
  'Other': ['Miscellaneous', 'Documents', 'Unknown'],
};

// Job image record from database
export interface JobImage {
  id: string;
  job_id: string;
  original_filename: string;
  storage_path: string;
  thumbnail_path?: string;
  web_path?: string;
  print_path?: string;
  file_size?: number;
  width?: number;
  height?: number;
  status: ImageStatus;
  ai_category?: ImageCategory;
  ai_subcategory?: string;
  ai_confidence?: number;
  ai_labels?: Array<{ label: string; score: number }>;
  user_category?: ImageCategory;
  user_subcategory?: string;
  quality_score?: number;
  is_blurry?: boolean;
  is_overexposed?: boolean;
  is_underexposed?: boolean;
  exif_data?: Record<string, unknown>;
  captured_at?: string;
  gps_lat?: number;
  gps_lng?: number;
  crop_data?: CropData;
  adjustments?: ImageAdjustments;
  selected_for_report: boolean;
  page_assignment?: string;
  slot_position?: number;
  caption?: string;
  created_at: string;
  updated_at: string;
}

// Image crop data for non-destructive editing
export interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio?: number;
  rotation?: number;
}

// Image adjustments for non-destructive editing
export interface ImageAdjustments {
  brightness?: number;
  contrast?: number;
  saturation?: number;
  sharpness?: number;
  exposure?: number;
}

// Page layout definition
export interface PageLayout {
  id: string;
  job_id: string;
  page_type: string;
  layout_template: LayoutTemplate;
  sort_order: number;
  title?: string;
  category_filter?: ImageCategory;
  created_at: string;
  updated_at: string;
}

// Layout template options
export type LayoutTemplate = '2x2' | '3x3' | '3x4' | '4x3' | '1x1' | '2x3' | 'custom';

// Page layout slot
export interface PageLayoutSlot {
  id: string;
  layout_id: string;
  slot_position: number;
  slot_label?: string;
  image_id?: string;
  caption?: string;
  width?: string;
  height?: string;
}

// Filter options for image grid
export interface ImageFilters {
  category?: ImageCategory | null;
  subcategory?: string | null;
  minQuality?: number | null;
  hideRejected?: boolean;
  hidePlaced?: boolean;
  showOnlyUnreviewed?: boolean;
  status?: ImageStatus | null;
}

// Upload progress tracking
export interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

// Drag-drop context for image assignment
export interface DragItem {
  id: string;
  type: 'image' | 'slot';
  imageId?: string;
  slotId?: string;
}

// Layout builder state
export interface LayoutBuilderState {
  activeLayoutId: string | null;
  layouts: PageLayout[];
  slots: PageLayoutSlot[];
  isLoading: boolean;
  error?: string;
}

// Quality scoring result
export interface QualityMetrics {
  score: number;
  isBlurry: boolean;
  isOverexposed: boolean;
  isUnderexposed: boolean;
  blurScore?: number;
  exposureScore?: number;
  resolutionScore?: number;
}

// AI classification result
export interface ClassificationResult {
  category: ImageCategory;
  subcategory: string;
  confidence: number;
  rawLabels: Array<{ label: string; score: number }>;
}

// Image editor design state (for Filerobot)
export interface DesignState {
  imgSrc: string;
  filter?: string;
  finetunes?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
  };
  adjustments?: {
    crop?: CropData;
    rotation?: number;
    flip?: { horizontal: boolean; vertical: boolean };
  };
}

// Supabase storage bucket names
export const STORAGE_BUCKETS = {
  RAW: 'appraisal-raw',
  PROCESSED: 'appraisal-processed',
} as const;

// Storage path helpers
export const storagePaths = {
  raw: (jobId: string, fileId: string, ext: string = 'jpg') => `uploads/${jobId}/raw/${fileId}.${ext}`,
  thumb: (jobId: string, fileId: string, ext: string = 'jpg') => `processed/${jobId}/thumb/${fileId}.${ext}`,
  web: (jobId: string, fileId: string, ext: string = 'jpg') => `processed/${jobId}/web/${fileId}.${ext}`,
  print: (jobId: string, fileId: string, ext: string = 'jpg') => `processed/${jobId}/print/${fileId}.${ext}`,
};

// Default layout templates - matches standard appraisal report pages
export const DEFAULT_LAYOUTS: Omit<PageLayout, 'id' | 'job_id' | 'created_at' | 'updated_at'>[] = [
  // === SUBJECT PROPERTY PHOTOS ===
  { page_type: 'subject-photos-1', layout_template: '2x3', sort_order: 1, title: 'Subject Photos - Page 1', category_filter: 'Exterior' },
  { page_type: 'subject-photos-2', layout_template: '2x3', sort_order: 2, title: 'Subject Photos - Page 2', category_filter: 'Interior Units' },

  // === MAPS (Full Page Single Image) ===
  { page_type: 'location-map', layout_template: '1x1', sort_order: 3, title: 'Location Map' },
  { page_type: 'aerial-map', layout_template: '1x1', sort_order: 4, title: 'Aerial Map' },
  { page_type: 'zoning-map', layout_template: '1x1', sort_order: 5, title: 'Zoning Map' },
  { page_type: 'flood-map', layout_template: '1x1', sort_order: 6, title: 'Flood Map' },
  { page_type: 'site-plan', layout_template: '1x1', sort_order: 7, title: 'Site Plan' },

  // === COMPARABLE SALES ===
  { page_type: 'comp-location-map', layout_template: '1x1', sort_order: 8, title: 'Comparable Location Map' },
  { page_type: 'comp-photos-1', layout_template: '2x3', sort_order: 9, title: 'Comparable Photos - Page 1' },
  { page_type: 'comp-photos-2', layout_template: '2x3', sort_order: 10, title: 'Comparable Photos - Page 2' },

  // === RENTAL COMPARABLES (if applicable) ===
  { page_type: 'rental-comp-map', layout_template: '1x1', sort_order: 11, title: 'Rental Comparable Map' },
  { page_type: 'rental-comp-photos', layout_template: '2x3', sort_order: 12, title: 'Rental Comparable Photos' },

  // === ADDITIONAL ===
  { page_type: 'building-systems', layout_template: '2x2', sort_order: 13, title: 'Building Systems', category_filter: 'Building Systems' },
  { page_type: 'site-improvements', layout_template: '2x2', sort_order: 14, title: 'Site Improvements', category_filter: 'Site' },
];

// Helper to get slot count for a layout template
export function getSlotCount(template: LayoutTemplate): number {
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

// Helper to get grid dimensions for a layout template
export function getGridDimensions(template: LayoutTemplate): { rows: number; cols: number } {
  const dims: Record<LayoutTemplate, { rows: number; cols: number }> = {
    '1x1': { rows: 1, cols: 1 },
    '2x2': { rows: 2, cols: 2 },
    '2x3': { rows: 2, cols: 3 },
    '3x3': { rows: 3, cols: 3 },
    '3x4': { rows: 3, cols: 4 },
    '4x3': { rows: 4, cols: 3 },
    'custom': { rows: 1, cols: 1 },
  };
  return dims[template];
}
