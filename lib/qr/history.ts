import { defaultStyle } from "./defaults"
import type { FrameStyle, QrGeneratorState, QrHistoryEntry, QrStyleOptions } from "./types"

const STORAGE_KEY = "freeqrcode-history"
const MAX_ENTRIES = 5

function normalizeStyle(style: QrStyleOptions & { showFrame?: boolean }): QrStyleOptions {
  if (style.frameStyle) {
    return { ...defaultStyle, ...style }
  }

  return {
    ...defaultStyle,
    ...style,
    frameStyle: style.showFrame ? ("simple" as FrameStyle) : "none",
  }
}

function normalizeEntry(entry: QrHistoryEntry): QrHistoryEntry {
  return {
    ...entry,
    state: {
      ...entry.state,
      style: normalizeStyle(entry.state.style as QrStyleOptions & { showFrame?: boolean }),
    },
  }
}

export function loadHistory(): QrHistoryEntry[] {
  if (typeof window === "undefined") return []

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as QrHistoryEntry[]
    return Array.isArray(parsed)
      ? parsed.slice(0, MAX_ENTRIES).map(normalizeEntry)
      : []
  } catch {
    return []
  }
}

export function saveHistoryEntry(
  entry: Omit<QrHistoryEntry, "id" | "timestamp">
): QrHistoryEntry[] {
  if (typeof window === "undefined") return []

  const newEntry: QrHistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  }

  const current = loadHistory().filter(
    (item) => item.label !== newEntry.label || item.state.contentType !== newEntry.state.contentType
  )

  const updated = [newEntry, ...current].slice(0, MAX_ENTRIES)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}

export function clearHistory(): void {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(STORAGE_KEY)
}
