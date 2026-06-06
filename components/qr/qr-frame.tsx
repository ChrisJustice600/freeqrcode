import type { FrameStyle } from "@/lib/qr/types"
import { cn } from "@/lib/utils"

interface QrFrameProps {
  style: FrameStyle
  children: React.ReactNode
  className?: string
}

function ScannerCorners() {
  const base = "absolute size-7 border-primary"
  return (
    <>
      <span className={cn(base, "top-1 left-1 border-t-[3px] border-l-[3px]")} />
      <span className={cn(base, "top-1 right-1 border-t-[3px] border-r-[3px]")} />
      <span className={cn(base, "bottom-1 left-1 border-b-[3px] border-l-[3px]")} />
      <span className={cn(base, "right-1 bottom-1 border-r-[3px] border-b-[3px]")} />
    </>
  )
}

export function QrFrame({ style, children, className }: QrFrameProps) {
  if (style === "none") {
    return <div className={cn("relative", className)}>{children}</div>
  }

  if (style === "polaroid") {
    return (
      <div className={cn("inline-flex flex-col bg-white p-3 pb-8 shadow-lg", className)}>
        {children}
      </div>
    )
  }

  if (style === "ticket") {
    return (
      <div className={cn("inline-flex flex-col items-center gap-2", className)}>
        <div className="border-2 border-dashed border-primary/50 bg-background/90 p-4">
          {children}
        </div>
        <span className="text-xs font-bold tracking-widest text-primary uppercase">
          Scannez-moi
        </span>
      </div>
    )
  }

  if (style === "gradient") {
    return (
      <div
        className={cn(
          "inline-flex rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-pink-500 p-1 shadow-lg shadow-primary/20",
          className
        )}
      >
        <div className="rounded-[14px] bg-background p-4">{children}</div>
      </div>
    )
  }

  if (style === "scanner") {
    return (
      <div className={cn("relative bg-background/90 p-6", className)}>
        <ScannerCorners />
        <div className="relative z-10">{children}</div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative inline-flex",
        style === "simple" && "rounded-lg border-2 border-border/80 bg-background/90 p-4 shadow-md",
        style === "rounded" &&
          "rounded-3xl border-4 border-primary/30 bg-background/90 p-5 shadow-lg shadow-primary/10",
        style === "elegant" &&
          "rounded-xl border-2 border-foreground/20 bg-background/90 p-4 shadow-sm ring-1 ring-foreground/10 ring-inset",
        className
      )}
    >
      {children}
    </div>
  )
}
