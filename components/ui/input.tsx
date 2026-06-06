import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full min-w-0 rounded-xl border border-border/60 bg-background/60 px-3 py-1 text-sm shadow-xs backdrop-blur-sm transition-all outline-none placeholder:text-muted-foreground focus-visible:border-primary/40 focus-visible:ring-3 focus-visible:ring-primary/15 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
