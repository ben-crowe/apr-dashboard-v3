import React from 'react';

interface TemplateSelectorProps {
  current: string;
  onChange: (templateId: string) => void;
  templates: Array<{ id: string; name: string; category: string }>;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  current,
  onChange,
  templates
}) => {
  return (
    <div className="template-selector mb-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Document Template</h3>
        <div className="flex gap-2">
          {templates.map(template => (
            <button
              key={template.id}
              onClick={() => onChange(template.id)}
              className={`
                px-4 
                py-2 
                rounded-lg 
                transition-all
                ${current === template.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              <span className="font-medium">{template.name}</span>
              <span className="text-xs block opacity-75">{template.category}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Switch templates anytime - your content will be preserved and reformatted.
      </p>
    </div>
  );
};