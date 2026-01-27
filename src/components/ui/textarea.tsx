import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-gray-200 dark:border-slate-700/50 !bg-white dark:bg-secondary px-3 py-2 text-sm text-gray-900 dark:text-foreground ring-offset-background placeholder:text-gray-500 dark:placeholder:text-muted-foreground hover:border-gray-400 dark:hover:border-slate-600/60 dark:hover:bg-slate-800/50 focus-visible:border-gray-400 dark:focus-visible:border-slate-600/60 focus-visible:outline-none focus-visible:ring-0 transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
