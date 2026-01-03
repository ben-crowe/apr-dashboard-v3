/**
 * SiteTabPanel.tsx
 * Renders the SITE tab with collapsible sections for site details
 * Following the same pattern as HomeTabPanel
 */

import { useState, useCallback, useMemo, ChangeEvent } from 'react';
import { useReportBuilderStore } from '../../store/reportBuilderStore';
import './SiteTabPanel.css';

// Rating options for site rating
const RATINGS = ['', 'Excellent', 'Good', 'Average', 'Fair', 'Poor'];

// Adjacent property types
const ADJACENT_TYPES = ['', 'Residential', 'Commercial', 'Industrial', 'Vacant', 'Park', 'Road', 'Agricultural'];

// Shape options
const SHAPE_OPTIONS = ['', 'Regular', 'Rectangular', 'Square', 'Irregular', 'Triangular', 'L-Shaped'];

// Topography options
const TOPOGRAPHY_OPTIONS = ['', 'Level', 'Gently Sloping', 'Sloping', 'Steep', 'Rolling', 'Varied'];

// Accessibility options
const ACCESSIBILITY_OPTIONS = ['', 'Excellent', 'Good', 'Average', 'Fair', 'Poor', 'Limited'];

// All section IDs for expand/collapse all functionality
const ALL_SECTION_IDS = [
  'site-area',
  'adjacent-uses',
  'site-conditions',
  'site-plan-images'
];

// Collapsible Section Component
interface CollapsibleSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isCollapsed: boolean;
  onToggle: () => void;
}

function CollapsibleSection({ id, title, children, isCollapsed, onToggle }: CollapsibleSectionProps) {
  return (
    <div className={`section ${isCollapsed ? 'collapsed' : ''}`} id={id}>
      <div className="section-header" onClick={onToggle}>
        <h3>{title}</h3>
        <div className="header-controls">
          <div className="collapse-icon">&#9660;</div>
        </div>
      </div>
      <div className="section-content">
        {children}
      </div>
    </div>
  );
}

export default function SiteTabPanel() {
  const { sections, updateFieldValue } = useReportBuilderStore();

  // Track collapsed state for each section
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  // Toggle section collapse
  const toggleSection = useCallback((sectionId: string) => {
    setCollapsedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }, []);

  // Check if all sections are collapsed
  const allCollapsed = useMemo(() => {
    return ALL_SECTION_IDS.every(id => collapsedSections.has(id));
  }, [collapsedSections]);

  // Expand all sections
  const expandAll = useCallback(() => {
    setCollapsedSections(new Set());
  }, []);

  // Collapse all sections
  const collapseAll = useCallback(() => {
    setCollapsedSections(new Set(ALL_SECTION_IDS));
  }, []);

  // Toggle all sections
  const toggleAllSections = useCallback(() => {
    if (allCollapsed) {
      expandAll();
    } else {
      collapseAll();
    }
  }, [allCollapsed, expandAll, collapseAll]);

  // Get field value from store
  const getValue = useCallback((fieldId: string): string | number | boolean => {
    for (const section of sections) {
      for (const field of section.fields || []) {
        if (field.id === fieldId) return field.value;
      }
      for (const sub of section.subsections || []) {
        for (const field of sub.fields || []) {
          if (field.id === fieldId) return field.value;
        }
      }
    }
    return '';
  }, [sections]);

  // Update field in store
  const handleChange = useCallback((fieldId: string, value: string | number | boolean) => {
    updateFieldValue(fieldId, value);
  }, [updateFieldValue]);

  // Input change handler
  const onInputChange = useCallback((fieldId: string) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    handleChange(fieldId, e.target.value);
  }, [handleChange]);

  return (
    <div className="site-tab-panel">
      <div className="site-tab-container">
        {/* Minimal controls - right aligned text links */}
        <div className="site-quick-controls">
          <span className="quick-link" onClick={toggleAllSections}>
            <span className="chevron">{allCollapsed ? '>' : 'v'}</span>
            {allCollapsed ? 'Expand' : 'Collapse'}
          </span>
        </div>

        {/* 1. SITE AREA */}
        <CollapsibleSection
          id="site-area"
          title="Site Area"
          isCollapsed={collapsedSections.has('site-area')}
          onToggle={() => toggleSection('site-area')}
        >
          <div className="form-grid form-grid-4">
            <div className="form-group">
              <label>Total Site Area (SF)</label>
              <input
                type="number"
                value={String(getValue('site-total-area') || '')}
                onChange={onInputChange('site-total-area')}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label>Site Acreage</label>
              <input
                type="number"
                step="0.01"
                value={String(getValue('site-acreage') || '')}
                onChange={onInputChange('site-acreage')}
                placeholder="0.00"
              />
            </div>
            <div className="form-group span-2">
              <label>Site Address</label>
              <input
                type="text"
                value={String(getValue('site-address') || '')}
                onChange={onInputChange('site-address')}
                placeholder="Street Address"
              />
            </div>
            <div className="form-group">
              <label>Shape</label>
              <select
                value={String(getValue('site-shape') || '')}
                onChange={onInputChange('site-shape')}
              >
                {SHAPE_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt || 'Select...'}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Topography</label>
              <select
                value={String(getValue('topography') || '')}
                onChange={onInputChange('topography')}
              >
                {TOPOGRAPHY_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt || 'Select...'}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Accessibility</label>
              <select
                value={String(getValue('accessibility') || '')}
                onChange={onInputChange('accessibility')}
              >
                {ACCESSIBILITY_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt || 'Select...'}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Exposure & Visibility</label>
              <select
                value={String(getValue('exposure-visibility') || '')}
                onChange={onInputChange('exposure-visibility')}
              >
                {RATINGS.map(r => <option key={r} value={r}>{r || 'Select...'}</option>)}
              </select>
            </div>
          </div>
        </CollapsibleSection>

        {/* 2. ADJACENT USES */}
        <CollapsibleSection
          id="adjacent-uses"
          title="Adjacent Uses"
          isCollapsed={collapsedSections.has('adjacent-uses')}
          onToggle={() => toggleSection('adjacent-uses')}
        >
          <div className="adjacent-grid">
            <div className="form-group">
              <label>North</label>
              <select
                value={String(getValue('adjacent-north') || '')}
                onChange={onInputChange('adjacent-north')}
              >
                {ADJACENT_TYPES.map(t => <option key={t} value={t}>{t || 'Select...'}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>South</label>
              <select
                value={String(getValue('adjacent-south') || '')}
                onChange={onInputChange('adjacent-south')}
              >
                {ADJACENT_TYPES.map(t => <option key={t} value={t}>{t || 'Select...'}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>East</label>
              <select
                value={String(getValue('adjacent-east') || '')}
                onChange={onInputChange('adjacent-east')}
              >
                {ADJACENT_TYPES.map(t => <option key={t} value={t}>{t || 'Select...'}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>West</label>
              <select
                value={String(getValue('adjacent-west') || '')}
                onChange={onInputChange('adjacent-west')}
              >
                {ADJACENT_TYPES.map(t => <option key={t} value={t}>{t || 'Select...'}</option>)}
              </select>
            </div>
          </div>
        </CollapsibleSection>

        {/* 3. SITE CONDITIONS */}
        <CollapsibleSection
          id="site-conditions"
          title="Site Conditions"
          isCollapsed={collapsedSections.has('site-conditions')}
          onToggle={() => toggleSection('site-conditions')}
        >
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label>Easements & Encroachments</label>
              <textarea
                value={String(getValue('easements') || '')}
                onChange={onInputChange('easements')}
                placeholder="Assumed satisfactory unless noted"
              />
            </div>
            <div className="form-group">
              <label>Soils</label>
              <textarea
                value={String(getValue('soils') || '')}
                onChange={onInputChange('soils')}
                placeholder="Assumed suitable for development"
              />
            </div>
            <div className="form-group">
              <label>Environmental Concerns</label>
              <textarea
                value={String(getValue('hazardous-waste') || '')}
                onChange={onInputChange('hazardous-waste')}
                placeholder="None present based on review"
              />
            </div>
            <div className="form-group">
              <label>Site Rating</label>
              <select
                value={String(getValue('site-rating') || '')}
                onChange={onInputChange('site-rating')}
              >
                {RATINGS.map(r => <option key={r} value={r}>{r || 'Select...'}</option>)}
              </select>
            </div>
            <div className="form-group span-2">
              <label>Site Conclusion</label>
              <textarea
                className="conclusion-textarea"
                value={String(getValue('site-conclusion') || '')}
                onChange={onInputChange('site-conclusion')}
                placeholder="Summarize the overall site characteristics and suitability for the current or proposed use..."
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* 4. SITE PLAN IMAGES */}
        <CollapsibleSection
          id="site-plan-images"
          title="Site Plan Images"
          isCollapsed={collapsedSections.has('site-plan-images')}
          onToggle={() => toggleSection('site-plan-images')}
        >
          <div className="image-upload-area">
            <div className="form-group">
              <label>Site Plan Images</label>
              <div className="file-upload-zone">
                <div className="upload-placeholder">
                  <span className="upload-icon">+</span>
                  <span className="upload-text">Drop images here or click to upload</span>
                  <span className="upload-hint">Supports PNG, JPG, PDF</span>
                </div>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  className="file-input"
                />
              </div>
            </div>
          </div>
        </CollapsibleSection>

      </div>
    </div>
  );
}
