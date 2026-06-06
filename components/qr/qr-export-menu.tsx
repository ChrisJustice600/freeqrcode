"use client"

import { Copy, Download, FileImage, FileType } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getExportFilename } from "@/lib/qr/builders"
import type { QrContentType } from "@/lib/qr/types"
import { cn } from "@/lib/utils"

interface QrExportMenuProps {
  contentType: QrContentType
  isValid: boolean
  onDownload: (extension: "svg" | "png" | "jpeg") => Promise<boolean>
  onCopy: () => Promise<boolean>
}

export function QrExportMenu({
  contentType,
  isValid,
  onDownload,
  onCopy,
}: QrExportMenuProps) {
  async function handleDownload(extension: "svg" | "png" | "jpeg") {
    const success = await onDownload(extension)
    if (success) {
      toast.success(`Export ${extension.toUpperCase()} réussi`)
    } else {
      toast.error("Impossible d'exporter le QR code")
    }
  }

  async function handleCopy() {
    try {
      const success = await onCopy()
      if (success) {
        toast.success("Image copiée dans le presse-papiers")
      } else {
        toast.error("Copie impossible")
      }
    } catch {
      toast.error("Votre navigateur ne supporte pas la copie d'image")
    }
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button
        type="button"
        disabled={!isValid}
        className={cn("btn-gradient col-span-2 h-10 rounded-xl")}
        onClick={() => handleDownload("png")}
      >
        <FileImage />
        Télécharger PNG
      </Button>
      <Button
        type="button"
        variant="outline"
        disabled={!isValid}
        className="h-9 rounded-xl border-border/60 bg-background/50"
        onClick={() => handleDownload("svg")}
      >
        <FileType />
        SVG
      </Button>
      <Button
        type="button"
        variant="outline"
        disabled={!isValid}
        className="h-9 rounded-xl border-border/60 bg-background/50"
        onClick={() => handleDownload("jpeg")}
      >
        <Download />
        JPG
      </Button>
      <Button
        type="button"
        variant="secondary"
        disabled={!isValid}
        className="col-span-2 h-9 rounded-xl"
        onClick={() => void handleCopy()}
      >
        <Copy />
        Copier l&apos;image
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            disabled={!isValid}
            className="col-span-2 h-8 rounded-xl text-xs text-muted-foreground"
          >
            <Download />
            Autres options
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="rounded-xl">
          <DropdownMenuItem onClick={() => handleDownload("png")}>
            {getExportFilename(contentType, "png")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDownload("svg")}>
            {getExportFilename(contentType, "svg")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDownload("jpeg")}>
            {getExportFilename(contentType, "jpeg")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
