"use client"

import { QrCode, ScanLine } from "lucide-react"

import { QrFrame } from "@/components/qr/qr-frame"
import type { FrameStyle } from "@/lib/qr/types"
import { cn } from "@/lib/utils"

interface QrPreviewProps {
  containerRef: React.RefObject<HTMLDivElement | null>
  isValid: boolean
  isReady: boolean
  error: string | null
  frameStyle: FrameStyle
  transparentBackground: boolean
}

export function QrPreview({
  containerRef,
  isValid,
  isReady,
  error,
  frameStyle,
  transparentBackground,
}: QrPreviewProps) {
  return (
    <div className="space-y-3">
      <div
        className={cn(
          "relative mx-auto flex min-h-[300px] items-center justify-center overflow-hidden rounded-2xl border border-border/60 p-8",
          transparentBackground ? "checkerboard" : "bg-gradient-to-br from-muted/40 to-muted/10"
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--glow),transparent_70%)]" />

        {!isReady && (
          <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
            <div className="size-5 animate-pulse rounded-full bg-primary/30" />
            Chargement...
          </div>
        )}

        {isReady && !isValid && (
          <div className="relative flex flex-col items-center gap-3 px-4 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl border border-dashed border-border/80 bg-background/50">
              <QrCode className="size-8 text-muted-foreground/40" />
            </div>
            <p className="max-w-[220px] text-sm leading-relaxed text-muted-foreground">
              {error || "Saisissez un contenu pour générer votre QR code"}
            </p>
          </div>
        )}

        <QrFrame
          style={frameStyle}
          className={cn(
            "transition-all duration-300",
            isValid ? "scale-100 opacity-100" : "pointer-events-none absolute scale-95 opacity-0"
          )}
        >
          <div ref={containerRef} className="flex items-center justify-center" />
        </QrFrame>
      </div>

      {isValid && (
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <ScanLine className="size-3.5 text-primary/70" />
          Prêt à scanner
        </div>
      )}
    </div>
  )
}
