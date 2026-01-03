/**
 * ImprovementsTabPanel.tsx
 * Renders the IMPV (Improvements) tab with collapsible sections for building details
 * Following the same pattern as SiteTabPanel
 */

import { useState, useCallback, useMemo, ChangeEvent } from 'react';
import { useReportBuilderStore } from '../../store/reportBuilderStore';
import './ImprovementsTabPanel.css';

// Condition rating options
const CONDITION_RATINGS = ['', 'Excellent', 'Good', 'Average', 'Fair', 'Poor'];

// Building format options
const BUILDING_FORMAT_OPTIONS = ['', 'Garden Style', 'Walk-Up', 'Mid-Rise', 'High-Rise', 'Mixed'];

// All section IDs for expand/collapse all functionality
const ALL_SECTION_IDS = [
  'building-overview',
  'amenities',
  'construction',
  'systems',
  'finishes',
  'site-improvements',
  'condition'
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

export default function ImprovementsTabPanel() {
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
    <div className="impv-tab-panel">
      <div className="impv-tab-container">
        {/* Minimal controls - right aligned text links */}
        <div className="impv-quick-controls">
          <span className="quick-link" onClick={toggleAllSections}>
            <span className="chevron">{allCollapsed ? '>' : 'v'}</span>
            {allCollapsed ? 'Expand' : 'Collapse'}
          </span>
        </div>

        {/* 1. BUILDING OVERVIEW */}
        <CollapsibleSection
          id="building-overview"
          title="Building Overview"
          isCollapsed={collapsedSections.has('building-overview')}
          onToggle={() => toggleSection('building-overview')}
        >
          <div className="form-grid form-grid-1">
            <div className="form-group full-width">
              <label>Overview</label>
              <textarea
                value={String(getValue('impv-overview') || '')}
                onChange={onInputChange('impv-overview')}
                placeholder="Describe the overall building improvements..."
              />
            </div>
          </div>
          <div className="form-grid form-grid-4">
            <div className="form-group">
              <label>Number of Buildings</label>
              <input
                type="number"
                value={String(getValue('impv-num-buildings') || '')}
                onChange={onInputChange('impv-num-buildings')}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label>Net Rentable Area (SF)</label>
              <input
                type="number"
                value={String(getValue('impv-nra') || '')}
                onChange={onInputChange('impv-nra')}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label>Year Built</label>
              <input
                type="number"
                value={String(getValue('impv-year-built') || '')}
                onChange={onInputChange('impv-year-built')}
                placeholder="YYYY"
              />
            </div>
            <div className="form-group">
              <label>Number of Units</label>
              <input
                type="number"
                value={String(getValue('impv-num-units') || '')}
                onChange={onInputChange('impv-num-units')}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label>Number of Stories</label>
              <input
                type="number"
                value={String(getValue('impv-stories') || '')}
                onChange={onInputChange('impv-stories')}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label>Building Format</label>
              <select
                value={String(getValue('impv-building-format') || '')}
                onChange={onInputChange('impv-building-format')}
              >
                {BUILDING_FORMAT_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt || 'Select...'}</option>
                ))}
              </select>
            </div>
          </div>
        </CollapsibleSection>

        {/* 2. AMENITIES */}
        <CollapsibleSection
          id="amenities"
          title="Amenities"
          isCollapsed={collapsedSections.has('amenities')}
          onToggle={() => toggleSection('amenities')}
        >
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label>Project Amenities</label>
              <textarea
                value={String(getValue('project-amenities') || '')}
                onChange={onInputChange('project-amenities')}
                placeholder="Common area amenities, fitness center, pool, etc."
              />
            </div>
            <div className="form-group">
              <label>Unit Amenities</label>
              <textarea
                value={String(getValue('unit-amenities') || '')}
                onChange={onInputChange('unit-amenities')}
                placeholder="In-unit washer/dryer, appliances, balcony, etc."
              />
            </div>
            <div className="form-group">
              <label>Laundry</label>
              <input
                type="text"
                value={String(getValue('laundry') || '')}
                onChange={onInputChange('laundry')}
                placeholder="In-unit, common area, coin-operated, etc."
              />
            </div>
            <div className="form-group">
              <label>Security Features</label>
              <textarea
                value={String(getValue('security') || '')}
                onChange={onInputChange('security')}
                placeholder="Intercom, key fob access, cameras, etc."
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* 3. CONSTRUCTION */}
        <CollapsibleSection
          id="construction"
          title="Construction"
          isCollapsed={collapsedSections.has('construction')}
          onToggle={() => toggleSection('construction')}
        >
          <div className="form-grid form-grid-3">
            <div className="form-group">
              <label>Foundation</label>
              <input
                type="text"
                value={String(getValue('foundation') || '')}
                onChange={onInputChange('foundation')}
                placeholder="Poured concrete, etc."
              />
            </div>
            <div className="form-group">
              <label>Exterior Walls/Framing</label>
              <input
                type="text"
                value={String(getValue('exterior-walls') || '')}
                onChange={onInputChange('exterior-walls')}
                placeholder="Wood frame, brick, etc."
              />
            </div>
            <div className="form-group">
              <label>Roof</label>
              <input
                type="text"
                value={String(getValue('roof') || '')}
                onChange={onInputChange('roof')}
                placeholder="Flat, pitched, asphalt shingles, etc."
              />
            </div>
            <div className="form-group">
              <label>Roof Condition</label>
              <select
                value={String(getValue('impv-roof-condition') || '')}
                onChange={onInputChange('impv-roof-condition')}
              >
                {CONDITION_RATINGS.map(opt => (
                  <option key={opt} value={opt}>{opt || 'Select...'}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Insulation</label>
              <input
                type="text"
                value={String(getValue('impv-insulation') || '')}
                onChange={onInputChange('impv-insulation')}
                placeholder="R-value, type, etc."
              />
            </div>
            <div className="form-group">
              <label>Elevator</label>
              <input
                type="text"
                value={String(getValue('elevator') || '')}
                onChange={onInputChange('elevator')}
                placeholder="None, hydraulic, traction, etc."
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* 4. BUILDING SYSTEMS */}
        <CollapsibleSection
          id="systems"
          title="Building Systems"
          isCollapsed={collapsedSections.has('systems')}
          onToggle={() => toggleSection('systems')}
        >
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label>HVAC</label>
              <input
                type="text"
                value={String(getValue('hvac') || '')}
                onChange={onInputChange('hvac')}
                placeholder="Forced air, baseboard, etc."
              />
            </div>
            <div className="form-group">
              <label>Electrical</label>
              <input
                type="text"
                value={String(getValue('electrical') || '')}
                onChange={onInputChange('electrical')}
                placeholder="100 amp, 200 amp, etc."
              />
            </div>
            <div className="form-group">
              <label>Plumbing</label>
              <input
                type="text"
                value={String(getValue('plumbing') || '')}
                onChange={onInputChange('plumbing')}
                placeholder="Copper, PEX, etc."
              />
            </div>
            <div className="form-group">
              <label>Fire Protection</label>
              <input
                type="text"
                value={String(getValue('fire-protection') || '')}
                onChange={onInputChange('fire-protection')}
                placeholder="Sprinklers, smoke detectors, etc."
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* 5. INTERIOR FINISHES */}
        <CollapsibleSection
          id="finishes"
          title="Interior Finishes"
          isCollapsed={collapsedSections.has('finishes')}
          onToggle={() => toggleSection('finishes')}
        >
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label>Interior Walls</label>
              <input
                type="text"
                value={String(getValue('interior-walls') || '')}
                onChange={onInputChange('interior-walls')}
                placeholder="Drywall, painted, etc."
              />
            </div>
            <div className="form-group">
              <label>Ceilings</label>
              <input
                type="text"
                value={String(getValue('ceilings') || '')}
                onChange={onInputChange('ceilings')}
                placeholder="Drywall, textured, etc."
              />
            </div>
            <div className="form-group">
              <label>Flooring</label>
              <input
                type="text"
                value={String(getValue('flooring') || '')}
                onChange={onInputChange('flooring')}
                placeholder="Carpet, vinyl plank, tile, etc."
              />
            </div>
            <div className="form-group">
              <label>Doors & Windows</label>
              <input
                type="text"
                value={String(getValue('doors-windows') || '')}
                onChange={onInputChange('doors-windows')}
                placeholder="Hollow core, vinyl windows, etc."
              />
            </div>
            <div className="form-group span-2">
              <label>Interior Finish Quality</label>
              <select
                value={String(getValue('impv-interior-finish') || '')}
                onChange={onInputChange('impv-interior-finish')}
              >
                {CONDITION_RATINGS.map(opt => (
                  <option key={opt} value={opt}>{opt || 'Select...'}</option>
                ))}
              </select>
            </div>
          </div>
        </CollapsibleSection>

        {/* 6. SITE IMPROVEMENTS */}
        <CollapsibleSection
          id="site-improvements"
          title="Site Improvements"
          isCollapsed={collapsedSections.has('site-improvements')}
          onToggle={() => toggleSection('site-improvements')}
        >
          <div className="form-grid form-grid-2">
            <div className="form-group span-2">
              <label>Site Improvements</label>
              <textarea
                value={String(getValue('site-impv') || '')}
                onChange={onInputChange('site-impv')}
                placeholder="Describe site improvements..."
              />
            </div>
            <div className="form-group span-2">
              <label>Landscaping</label>
              <input
                type="text"
                value={String(getValue('landscaping') || '')}
                onChange={onInputChange('landscaping')}
                placeholder="Grass, shrubs, trees, etc."
              />
            </div>
            <div className="form-group">
              <label>Parking Spaces</label>
              <input
                type="number"
                value={String(getValue('parking-spaces') || '')}
                onChange={onInputChange('parking-spaces')}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label>Parking Ratio</label>
              <input
                type="number"
                step="0.01"
                value={String(getValue('parking-ratio') || '')}
                onChange={onInputChange('parking-ratio')}
                placeholder="0.00"
              />
            </div>
            <div className="form-group">
              <label>Building Footprint (SF)</label>
              <input
                type="number"
                value={String(getValue('impv-building-footprint') || '')}
                onChange={onInputChange('impv-building-footprint')}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label>Site Coverage (%)</label>
              <input
                type="number"
                step="0.1"
                value={String(getValue('impv-site-coverage') || '')}
                onChange={onInputChange('impv-site-coverage')}
                placeholder="0.0"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* 7. CONDITION */}
        <CollapsibleSection
          id="condition"
          title="Condition"
          isCollapsed={collapsedSections.has('condition')}
          onToggle={() => toggleSection('condition')}
        >
          <div className="form-grid form-grid-1">
            <div className="form-group">
              <label>Overall Condition</label>
              <select
                value={String(getValue('overall-condition') || '')}
                onChange={onInputChange('overall-condition')}
              >
                {CONDITION_RATINGS.map(opt => (
                  <option key={opt} value={opt}>{opt || 'Select...'}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Functional Design</label>
              <textarea
                value={String(getValue('functional-design') || '')}
                onChange={onInputChange('functional-design')}
                placeholder="Describe functional design aspects..."
              />
            </div>
            <div className="form-group">
              <label>Hazardous Materials</label>
              <textarea
                value={String(getValue('hazardous-materials') || '')}
                onChange={onInputChange('hazardous-materials')}
                placeholder="Assumes free of hazardous waste, asbestos, mold"
              />
            </div>
          </div>
        </CollapsibleSection>

      </div>
    </div>
  );
}
