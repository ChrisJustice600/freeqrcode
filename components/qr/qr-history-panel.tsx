"use client"

import { Clock, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { clearHistory } from "@/lib/qr/history"
import type { QrHistoryEntry } from "@/lib/qr/types"

interface QrHistoryPanelProps {
  history: QrHistoryEntry[]
  onRestore: (entry: QrHistoryEntry) => void
  onClear: () => void
}

export function QrHistoryPanel({
  history,
  onRestore,
  onClear,
}: QrHistoryPanelProps) {
  if (history.length === 0) return null

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Clock className="size-4 text-primary" />
          Historique récent
        </div>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className="text-muted-foreground"
          onClick={() => {
            clearHistory()
            onClear()
          }}
        >
          <Trash2 />
          Effacer
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map((entry) => (
          <Button
            key={entry.id}
            type="button"
            variant="outline"
            size="sm"
            className="h-auto max-w-full rounded-xl border-border/60 bg-background/40 py-2 text-left backdrop-blur-sm transition-colors hover:border-primary/30 hover:bg-primary/5"
            onClick={() => onRestore(entry)}
          >
            <span className="truncate text-xs">{entry.label}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
