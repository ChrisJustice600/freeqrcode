import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 text-sm shadow-xs backdrop-blur-sm transition-all outline-none placeholder:text-muted-foreground focus-visible:border-primary/40 focus-visible:ring-3 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive dark:bg-input/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
