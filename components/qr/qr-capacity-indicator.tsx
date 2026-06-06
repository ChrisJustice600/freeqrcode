import { cn } from "@/lib/utils"
import type { CapacityInfo } from "@/lib/qr/types"

interface QrCapacityIndicatorProps {
  capacity: CapacityInfo
}

const levelConfig: Record<
  CapacityInfo["level"],
  { label: string; bar: string; text: string }
> = {
  low: {
    label: "Capacité optimale",
    bar: "bg-gradient-to-r from-emerald-500 to-emerald-400",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  medium: {
    label: "Capacité modérée",
    bar: "bg-gradient-to-r from-amber-500 to-amber-400",
    text: "text-amber-600 dark:text-amber-400",
  },
  high: {
    label: "Capacité élevée",
    bar: "bg-gradient-to-r from-orange-500 to-orange-400",
    text: "text-orange-600 dark:text-orange-400",
  },
  critical: {
    label: "Risque d'illisibilité",
    bar: "bg-gradient-to-r from-red-500 to-red-400",
    text: "text-red-600 dark:text-red-400",
  },
}

export function QrCapacityIndicator({ capacity }: QrCapacityIndicatorProps) {
  if (capacity.length === 0) return null

  const config = levelConfig[capacity.level]

  return (
    <div className="rounded-xl border border-border/50 bg-muted/30 px-3 py-2.5">
      <div className="flex items-center justify-between text-xs">
        <span className={cn("font-medium", config.text)}>{config.label}</span>
        <span className="font-mono text-muted-foreground">
          {capacity.length} / ~{capacity.maxRecommended}
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all duration-500", config.bar)}
          style={{ width: `${capacity.percentage}%` }}
        />
      </div>
    </div>
  )
}
