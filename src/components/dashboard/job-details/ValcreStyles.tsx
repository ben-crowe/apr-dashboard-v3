// Valcre-style consistent design for all sections
import React from "react";
import { Loader2, Check, AlertTriangle } from "lucide-react";

// Per-field sync status indicator (PRD: saving → saved-local → synced-to-Valcre → sync-failed).
// 'saved' = persisted to Supabase (grey); 'synced' = readback-CONFIRMED in Valcre (blue);
// 'sync-failed' = Valcre rejected/failed (amber !) — surfaces the silent-200 rejections.
export type FieldSyncStatus = 'idle' | 'saving' | 'saved' | 'synced' | 'sync-failed';
export const FieldStatusIcon = ({ status }: { status?: FieldSyncStatus }) => {
  switch (status) {
    case 'saving':
      return <Loader2 className="h-3.5 w-3.5 text-gray-400 animate-spin shrink-0" aria-label="Saving…" />;
    case 'saved':
      return <Check className="h-3.5 w-3.5 text-gray-400 shrink-0" aria-label="Saved locally" />;
    case 'synced':
      return <Check className="h-3.5 w-3.5 text-blue-500 shrink-0" aria-label="Synced to Valcre" />;
    case 'sync-failed':
      return <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" aria-label="Valcre sync failed" />;
    default:
      return null;
  }
};

export const sectionTriggerStyle = "hover:no-underline py-3";
export const sectionContentStyle = "px-4 py-4";

// Section header with optional number
export const SectionTitle = ({ number, title }: { number?: string; title: string }) => (
  <span className="text-base font-medium text-foreground">
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
    <div className="text-sm text-muted-foreground text-right">
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
  title: string | React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="mb-6 mt-4">
    <h3 className="text-xs font-semibold text-foreground dark:text-gray-400 uppercase tracking-wider mb-3">
      {title}
    </h3>
    {children}
  </div>
);

// Two-column field container for better vertical spacing
export const TwoColumnFields = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0.5 ${className}`}>
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
  className = "",
  status
}: {
  label?: string | React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
  status?: FieldSyncStatus;
}) => (
  <div className={`flex items-center gap-2 py-0.5 ${fullWidth ? 'md:col-span-2' : ''} ${className}`}>
    {label && (
      <label className="text-sm text-muted-foreground whitespace-nowrap min-w-[160px] text-right">
        {typeof label === 'string' ? `${label}:` : label}
      </label>
    )}
    <div className="flex-1">
      {children}
    </div>
    <FieldStatusIcon status={status} />
  </div>
);