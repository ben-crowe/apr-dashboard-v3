import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-gray-200 dark:border-slate-700/50 !bg-white dark:bg-secondary px-3 py-2 text-base text-gray-900 dark:text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-500 dark:placeholder:text-muted-foreground hover:border-gray-400 dark:hover:border-slate-600/60 dark:hover:bg-slate-800/50 focus-visible:border-gray-400 dark:focus-visible:border-slate-600/60 focus-visible:outline-none focus-visible:ring-0 transition-colors disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
