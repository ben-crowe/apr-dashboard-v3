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
    <div className="px-3 py-2 border-b flex flex-wrap items-center gap-3" style={{ backgroundColor: '#1f1f1f', borderColor: '#333' }}>
      {/* Category filter */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-slate-400 font-medium">Category</label>
        <select
          className="rounded text-sm px-2 py-1 min-w-[130px] focus:outline-none focus:ring-2 focus:ring-green-500"
          style={{ backgroundColor: '#2a2a2a', color: '#94a3b8', borderColor: '#555', borderWidth: '1px', borderStyle: 'solid' }}
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
          <label className="text-xs text-slate-400 font-medium">Subcategory</label>
          <select
            className="rounded text-sm px-2 py-1 min-w-[110px] focus:outline-none focus:ring-2 focus:ring-green-500"
            style={{ backgroundColor: '#2a2a2a', color: '#94a3b8', borderColor: '#555', borderWidth: '1px', borderStyle: 'solid' }}
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
        <label className="text-xs text-slate-400 font-medium">Min Quality</label>
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
          className="w-16 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500 [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:shadow-md
            [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-green-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer
            [&::-moz-range-thumb]:shadow-md
            focus:outline-none focus:ring-2 focus:ring-green-500"
          style={{ accentColor: 'rgb(34 197 94)' }}
        />
        <span className="text-xs text-slate-400 w-8">
          {Math.round((filters.minQuality ?? 0) * 100)}%
        </span>
      </div>

      {/* Toggle filters */}
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
          <input
            type="checkbox"
            checked={!!filters.hideRejected}
            onChange={(e) =>
              onChange({ ...filters, hideRejected: e.target.checked })
            }
            className="w-3.5 h-3.5 rounded text-green-500 focus:ring-2 focus:ring-green-500"
            style={{
              backgroundColor: '#2a2a2a',
              borderColor: '#555',
              borderWidth: '1px',
              borderStyle: 'solid',
              accentColor: 'rgb(34 197 94)'
            }}
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
            className="w-3.5 h-3.5 rounded text-green-500 focus:ring-2 focus:ring-green-500"
            style={{
              backgroundColor: '#2a2a2a',
              borderColor: '#555',
              borderWidth: '1px',
              borderStyle: 'solid',
              accentColor: 'rgb(34 197 94)'
            }}
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
            className="w-3.5 h-3.5 rounded text-green-500 focus:ring-2 focus:ring-green-500"
            style={{
              backgroundColor: '#2a2a2a',
              borderColor: '#555',
              borderWidth: '1px',
              borderStyle: 'solid',
              accentColor: 'rgb(34 197 94)'
            }}
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
            className="text-xs text-slate-400 hover:text-slate-200 font-medium"
          >
            Select All
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={() => onBulkAction('select-none')}
            className="text-xs text-slate-400 hover:text-slate-200 font-medium"
          >
            Select None
          </button>
        </div>
      )}

      {/* Count display */}
      <div className="text-xs text-slate-400">
        <span className="text-slate-300 font-medium">{selectedCount}</span>
        {' selected of '}
        <span className="text-slate-300 font-medium">{totalCount}</span>
      </div>
    </div>
  );
}

export default FiltersPanel;
