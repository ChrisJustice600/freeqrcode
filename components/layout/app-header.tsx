"use client"

import { Moon, QrCode, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function AppHeader() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <header className="glass-header sticky top-0 z-40">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[oklch(0.48_0.2_310)] text-primary-foreground shadow-lg shadow-primary/25">
            <QrCode className="size-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">FreeQRCode</span>
            <span className="hidden text-[10px] font-medium tracking-widest text-muted-foreground uppercase sm:block">
              Studio
            </span>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-xl border-border/60 bg-background/50 backdrop-blur-sm"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          aria-label="Changer le thème"
        >
          <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </Button>
      </div>
    </header>
  )
}
