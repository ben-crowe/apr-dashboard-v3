import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-none border-0 border-b border-b-gray-300 dark:border-b-white/20 bg-transparent px-1 py-2 text-base text-gray-900 dark:text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-400 hover:border-b-gray-500 dark:hover:border-b-white/40 focus-visible:border-b-gray-600 dark:focus-visible:border-b-border focus-visible:outline-none focus-visible:ring-0 transition-colors disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
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
