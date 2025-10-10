// Valcre-style consistent design for all sections
import React from "react";

export const sectionTriggerStyle = "hover:no-underline py-3";
export const sectionContentStyle = "px-6 py-4";

// Section header with optional number
export const SectionTitle = ({ number, title }: { number?: string; title: string }) => (
  <span className="text-base font-medium text-gray-900 dark:text-gray-100">
    {number && <span className="mr-2">{number}</span>}
    {title}
  </span>
);

// Two-column field layout like Valcre
export const FieldRow = ({ 
  label, 
  children,
  className = "" 
}: { 
  label: string; 
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`grid grid-cols-3 gap-2 py-0.5 ${className}`}>
    <div className="text-sm text-gray-600 dark:text-gray-400 text-right">
      {label}
    </div>
    <div className="col-span-2">
      {children}
    </div>
  </div>
);

// Section group header - cleaner without extra nesting
export const SectionGroup = ({ 
  title,
  children
}: { 
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-6 mt-4">
    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
      {title}
    </h3>
    {children}
  </div>
);

// Two-column field container for better vertical spacing
export const TwoColumnFields = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0.5">
    {children}
  </div>
);

// Single field wrapper - keeps field at half width for consistency
export const SingleFieldWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
    <div>{children}</div>
    <div>{/* Empty column for spacing */}</div>
  </div>
);

// Compact field for two-column layout
export const CompactField = ({ 
  label, 
  children,
  fullWidth = false,
  className = "" 
}: { 
  label: string; 
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}) => (
  <div className={`flex items-center gap-2 py-0.5 ${fullWidth ? 'md:col-span-2' : ''} ${className}`}>
    <label className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap min-w-[140px] text-right">
      {label}:
    </label>
    <div className="flex-1">
      {children}
    </div>
  </div>
);