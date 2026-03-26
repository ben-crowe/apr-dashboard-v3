import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-none border-0 border-b border-b-gray-300 dark:border-b-white/20 bg-transparent px-1 py-2 text-sm text-gray-900 dark:text-foreground ring-offset-background placeholder:text-gray-400 dark:placeholder:text-muted-foreground hover:border-b-gray-500 dark:hover:border-b-white/40 focus-visible:border-b-gray-600 dark:focus-visible:border-b-border focus-visible:outline-none focus-visible:ring-0 transition-colors disabled:cursor-not-allowed disabled:opacity-50",
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
