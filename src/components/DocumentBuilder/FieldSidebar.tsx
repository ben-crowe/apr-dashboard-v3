import React, { useState, useMemo } from 'react';
import { FieldDefinition, FieldRegistry } from './services/FieldRegistry';

interface FieldSidebarProps {
  registry: FieldRegistry;
  jobData: any;
  onFieldClick: (field: FieldDefinition) => void;
}

export const FieldSidebar: React.FC<FieldSidebarProps> = ({
  registry,
  jobData,
  onFieldClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  
  const fields = useMemo(() => registry.getAllFields(), [registry]);
  
  const filteredFields = useMemo(() => {
    if (!searchTerm) return fields;
    
    const term = searchTerm.toLowerCase();
    return fields.filter(field =>
      field.displayName.toLowerCase().includes(term) ||
      field.marker.toLowerCase().includes(term)
    );
  }, [fields, searchTerm]);
  
  const getFieldValue = (field: FieldDefinition) => {
    const pathParts = field.dataPath.split('.');
    let value = jobData;
    for (const part of pathParts) {
      value = value?.[part];
    }
    return value;
  };
  
  return (
    <div className="field-sidebar w-64 p-4 bg-white rounded-lg shadow-sm h-full overflow-hidden flex flex-col">
      <h3 className="text-lg font-semibold mb-4">Available Fields</h3>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search fields..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="field-list flex-1 overflow-y-auto space-y-2">
        {filteredFields.map(field => {
          const value = getFieldValue(field);
          const hasValue = value !== undefined && value !== '';
          
          return (
            <div
              key={field.id}
              className={`
                field-item 
                p-3 
                rounded-lg 
                cursor-pointer 
                transition-all
                border
                ${hasValue 
                  ? 'bg-green-50 border-green-200 hover:bg-green-100' 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }
              `}
              onClick={() => onFieldClick(field)}
              onMouseEnter={() => setHoveredField(field.id)}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="field-name font-medium text-sm">
                {field.displayName}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </div>
              <div className="field-marker text-xs text-gray-600 font-mono mt-1">
                {field.marker}
              </div>
              
              {hoveredField === field.id && hasValue && (
                <div className="field-tooltip mt-2 p-2 bg-white rounded border border-gray-200 text-xs">
                  <strong>Current value:</strong> {field.format ? field.format(value) : value}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          <strong>Tip:</strong> Click any field to insert it at your cursor position in the editor.
        </p>
      </div>
    </div>
  );
};