import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface MultiSelectProps {
  options: string[];
  /** Comma-separated string of selected values (storage format used across LoeQuoteSection). */
  value?: string;
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Multi-select control that visually matches the underlined single Select trigger
 * used throughout LoeQuoteSection. Stores selections as a comma-separated string
 * (parsed in/out here) to match the existing handleMultiSelectChange storage format.
 */
export function MultiSelect({
  options,
  value = "",
  onChange,
  placeholder = "Select...",
  className,
}: MultiSelectProps) {
  const selected = React.useMemo(
    () => value.split(",").map((v) => v.trim()).filter(Boolean),
    [value]
  );

  const toggle = (option: string) => {
    const next = selected.includes(option)
      ? selected.filter((v) => v !== option)
      : [...selected, option];
    onChange(next);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "h-7 text-sm max-w-[160px] w-full flex items-center justify-between gap-1 bg-transparent border-0 border-b border-b-gray-400 dark:border-b-white/20 rounded-none px-0 text-left",
            className
          )}
        >
          <span className={cn("truncate", selected.length === 0 && "text-muted-foreground")}>
            {selected.length === 0 ? placeholder : selected.join(", ")}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-1" align="start">
        <div className="max-h-64 overflow-y-auto">
          {options.map((option) => {
            const isSelected = selected.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggle(option)}
                className="w-full flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-left hover:bg-accent hover:text-accent-foreground"
              >
                <span className="flex h-4 w-4 items-center justify-center flex-shrink-0">
                  {isSelected && <Check className="h-4 w-4" />}
                </span>
                <span className="truncate">{option}</span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default MultiSelect;
