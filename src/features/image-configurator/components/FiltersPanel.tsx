/**
 * FiltersPanel Component
 * Controls for filtering the image grid
 */

import React from 'react';
import { ImageFilters, ImageCategory, IMAGE_SUBCATEGORIES } from '../types';

const CATEGORIES: Array<{ value: ImageCategory | ''; label: string }> = [
  { value: '', label: 'All Categories' },
  { value: 'Exterior', label: 'Exterior' },
  { value: 'Interior Units', label: 'Interior Units' },
  { value: 'Common Areas', label: 'Common Areas' },
  { value: 'Building Systems', label: 'Building Systems' },
  { value: 'Site', label: 'Site' },
  { value: 'Basement/Utility', label: 'Basement/Utility' },
  { value: 'Other', label: 'Other' },
];

interface FiltersPanelProps {
  filters: ImageFilters;
  onChange: (filters: ImageFilters) => void;
  selectedCount: number;
  totalCount: number;
  onBulkAction?: (action: 'select-all' | 'select-none' | 'select-category') => void;
}

export function FiltersPanel({
  filters,
  onChange,
  selectedCount,
  totalCount,
  onBulkAction,
}: FiltersPanelProps) {
  // Get subcategories for selected category
  const subcategories = filters.category
    ? IMAGE_SUBCATEGORIES[filters.category] || []
    : [];

  return (
    <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex flex-wrap items-center gap-4">
      {/* Category filter */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-slate-400">Category</label>
        <select
          className="bg-slate-700 border border-slate-600 rounded text-sm px-2 py-1 text-white min-w-[140px]"
          value={filters.category ?? ''}
          onChange={(e) => {
            const category = e.target.value as ImageCategory | '';
            onChange({
              ...filters,
              category: category || null,
              subcategory: null, // Reset subcategory when category changes
            });
          }}
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory filter (only show if category selected) */}
      {subcategories.length > 0 && (
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400">Subcategory</label>
          <select
            className="bg-slate-700 border border-slate-600 rounded text-sm px-2 py-1 text-white min-w-[120px]"
            value={filters.subcategory ?? ''}
            onChange={(e) =>
              onChange({ ...filters, subcategory: e.target.value || null })
            }
          >
            <option value="">All</option>
            {subcategories.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Quality slider */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-slate-400">Min Quality</label>
        <input
          type="range"
          min={0}
          max={100}
          value={(filters.minQuality ?? 0) * 100}
          onChange={(e) =>
            onChange({
              ...filters,
              minQuality: Number(e.target.value) / 100,
            })
          }
          className="w-20 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-xs text-slate-300 w-10">
          {Math.round((filters.minQuality ?? 0) * 100)}%
        </span>
      </div>

      {/* Toggle filters */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
          <input
            type="checkbox"
            checked={!!filters.hideRejected}
            onChange={(e) =>
              onChange({ ...filters, hideRejected: e.target.checked })
            }
            className="w-3.5 h-3.5 rounded border-slate-600 bg-slate-700 text-blue-500"
          />
          Hide rejected
        </label>

        <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
          <input
            type="checkbox"
            checked={!!filters.hidePlaced}
            onChange={(e) =>
              onChange({ ...filters, hidePlaced: e.target.checked })
            }
            className="w-3.5 h-3.5 rounded border-slate-600 bg-slate-700 text-blue-500"
          />
          Hide placed
        </label>

        <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
          <input
            type="checkbox"
            checked={!!filters.showOnlyUnreviewed}
            onChange={(e) =>
              onChange({ ...filters, showOnlyUnreviewed: e.target.checked })
            }
            className="w-3.5 h-3.5 rounded border-slate-600 bg-slate-700 text-blue-500"
          />
          Needs review
        </label>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bulk actions */}
      {onBulkAction && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onBulkAction('select-all')}
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            Select All
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={() => onBulkAction('select-none')}
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            Select None
          </button>
        </div>
      )}

      {/* Count display */}
      <div className="text-xs text-slate-400">
        <span className="text-white font-medium">{selectedCount}</span>
        {' selected of '}
        <span className="text-white font-medium">{totalCount}</span>
      </div>
    </div>
  );
}

export default FiltersPanel;
