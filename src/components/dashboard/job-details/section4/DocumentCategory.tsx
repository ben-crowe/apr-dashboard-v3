import React from "react";

interface DocumentCategoryProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const DocumentCategory: React.FC<DocumentCategoryProps> = ({
  title,
  icon,
  children
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 pb-2 border-b">
        {icon}
        <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
      </div>
      {children}
    </div>
  );
};

export default DocumentCategory;