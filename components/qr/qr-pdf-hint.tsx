import { FileText, Info } from "lucide-react"

export function QrPdfHint() {
  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Info className="size-4 text-primary" />
        </div>
        <div className="space-y-1">
          <p className="font-medium text-foreground">
            Un QR code ne peut pas contenir un fichier entier
          </p>
          <p className="leading-relaxed text-muted-foreground">
            La capacité est limitée à environ 3 Ko. Collez un lien vers votre PDF
            hébergé (Google Drive, Dropbox, OneDrive…) ou uploadez le fichier pour
            obtenir un lien court.
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-background/50 px-2.5 py-1.5 text-xs text-muted-foreground">
        <FileText className="size-3.5 text-primary/70" />
        <span>Formats acceptés : PDF, images, documents</span>
      </div>
    </div>
  )
}
