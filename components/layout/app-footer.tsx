import { QrCode } from "lucide-react"

export function AppFooter() {
  return (
    <footer className="border-t border-border/50 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-center">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <QrCode className="size-4 text-primary/70" />
          FreeQRCode Studio
        </div>
        <p className="max-w-md text-sm text-muted-foreground">
          Générateur de QR codes gratuit et premium. Sans compte, sans limite.
        </p>
        <p className="text-xs text-muted-foreground/60">
          Personnalisez · Exportez · Partagez
        </p>
      </div>
    </footer>
  )
}
