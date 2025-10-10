// Clean Valcre-inspired design system
import React from "react";
import { cn } from "@/lib/utils";

// Section header - clean and minimal
export const SectionTitle = ({ 
  number, 
  title 
}: { 
  number?: string; 
  title: string 
}) => (
  <span className="text-base font-medium text-gray-900 dark:text-gray-100">
    {number && <span className="mr-2">{number}</span>}
    {title}
  </span>
);

// Clean input field with bottom border only (like Valcre)
export const CleanInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full bg-transparent border-0 border-b border-gray-200 dark:border-gray-700",
        "px-0 py-1 text-sm",
        "placeholder:text-gray-400 dark:placeholder:text-gray-500",
        "focus:outline-none focus:border-primary dark:focus:border-primary",
        "transition-colors duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
});
CleanInput.displayName = "CleanInput";

// Clean select field with bottom border only
export const CleanSelect = React.forwardRef<
  HTMLSelectElement,
  React.ComponentProps<"select">
>(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "w-full bg-transparent border-0 border-b border-gray-200 dark:border-gray-700",
        "px-0 py-1 text-sm cursor-pointer",
        "focus:outline-none focus:border-primary dark:focus:border-primary",
        "transition-colors duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});
CleanSelect.displayName = "CleanSelect";

// Clean textarea with bottom border
export const CleanTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full bg-transparent border-0 border-b border-gray-200 dark:border-gray-700",
        "px-0 py-1 text-sm resize-none",
        "placeholder:text-gray-400 dark:placeholder:text-gray-500",
        "focus:outline-none focus:border-primary dark:focus:border-primary",
        "transition-colors duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
});
CleanTextarea.displayName = "CleanTextarea";

// Clean field row with right-aligned label
export const CleanFieldRow = ({ 
  label, 
  children,
  required = false,
  className = "" 
}: { 
  label: string; 
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) => (
  <div className={cn("grid grid-cols-3 gap-4 py-1.5", className)}>
    <label className="text-sm text-gray-600 dark:text-gray-400 text-right pt-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <div className="col-span-2">
      {children}
    </div>
  </div>
);

// Compact field for two-column layout with clean styling
export const CleanCompactField = ({ 
  label, 
  children,
  required = false,
  fullWidth = false,
  className = "" 
}: { 
  label: string; 
  children: React.ReactNode;
  required?: boolean;
  fullWidth?: boolean;
  className?: string;
}) => (
  <div className={cn(
    "flex items-center gap-3 py-1.5",
    fullWidth ? 'md:col-span-2' : '',
    className
  )}>
    <label className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap min-w-[120px] text-right">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <div className="flex-1 max-w-[250px]">
      {children}
    </div>
  </div>
);

// Field group without extra borders - just logical grouping
export const CleanFieldGroup = ({ 
  title,
  children,
  className = ""
}: { 
  title?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("space-y-1", className)}>
    {title && (
      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
        {title}
      </h3>
    )}
    <div className="space-y-1">
      {children}
    </div>
  </div>
);

// Two-column layout for fields
export const CleanTwoColumnLayout = ({ 
  children,
  className = ""
}: { 
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn(
    "grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1",
    className
  )}>
    {children}
  </div>
);

// Main section container - single clean border
export const CleanSection = ({ 
  children,
  className = ""
}: { 
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn(
    "bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800",
    "p-6 space-y-6",
    className
  )}>
    {children}
  </div>
);

// Action bar for section buttons
export const CleanActionBar = ({ 
  children,
  className = ""
}: { 
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn(
    "flex items-center justify-between",
    "pb-4 mb-4 border-b border-gray-100 dark:border-gray-800",
    className
  )}>
    {children}
  </div>
);

// Status indicator
export const CleanStatusBadge = ({ 
  status,
  children,
  className = ""
}: { 
  status: 'success' | 'warning' | 'error' | 'info' | 'default';
  children: React.ReactNode;
  className?: string;
}) => {
  const statusColors = {
    success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
      statusColors[status],
      className
    )}>
      {children}
    </span>
  );
};

// Clean button style
export const CleanButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
  }
>(({ className, variant = 'secondary', size = 'md', ...props }, ref) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-transparent border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800',
    ghost: 'bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
  };

  const sizes = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-1.5 text-sm',
    lg: 'px-5 py-2 text-base'
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium",
        "transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});
CleanButton.displayName = "CleanButton";