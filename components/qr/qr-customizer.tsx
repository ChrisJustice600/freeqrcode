"use client"

import { ImagePlus, X } from "lucide-react"
import { useRef } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { frameOptions } from "@/lib/qr/frames"
import { applyPreset, qrPresets } from "@/lib/qr/presets"
import type { CornerType, DotsType, FrameStyle, QrStyleOptions } from "@/lib/qr/types"
import { cn } from "@/lib/utils"

interface QrCustomizerProps {
  style: QrStyleOptions
  onChange: (style: QrStyleOptions) => void
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </Label>
      <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/20 p-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="size-9 cursor-pointer rounded-lg border-0 bg-transparent p-0.5"
        />
        <span className="font-mono text-xs text-muted-foreground">{value}</span>
      </div>
    </div>
  )
}

export function QrCustomizer({ style, onChange }: QrCustomizerProps) {
  const logoInputRef = useRef<HTMLInputElement>(null)

  function update(partial: Partial<QrStyleOptions>) {
    onChange({ ...style, ...partial, presetId: null })
  }

  function handleLogoUpload(file: File) {
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Le logo ne doit pas dépasser 2 Mo")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange({
          ...style,
          logoUrl: reader.result,
          errorCorrectionLevel: "H",
          presetId: null,
        })
        toast.success("Logo ajouté")
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <Label className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Presets visuels
        </Label>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {qrPresets.map((preset) => {
            const dots = preset.style.dotsColor || "#000"
            const bg = preset.style.backgroundColor || "#fff"
            const corners = preset.style.cornersSquareColor || dots
            const isActive = style.presetId === preset.id

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onChange(applyPreset(style, preset.id))}
                className={cn(
                  "group rounded-xl border p-3 text-left text-xs transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5",
                  isActive
                    ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
                    : "border-border/60 bg-background/40"
                )}
              >
                <div className="preset-swatch">
                  <span style={{ background: dots }} />
                  <span style={{ background: corners }} />
                  <span style={{ background: bg }} />
                </div>
                <div className="font-semibold text-foreground">{preset.name}</div>
                <div className="mt-0.5 text-muted-foreground">{preset.description}</div>
              </button>
            )
          })}
        </div>
      </div>

      <Separator />

      <div className="grid gap-4 sm:grid-cols-2">
        <ColorField
          label="Couleur des points"
          value={style.dotsColor}
          onChange={(dotsColor) => update({ dotsColor })}
        />
        <ColorField
          label="Couleur de fond"
          value={style.backgroundColor}
          onChange={(backgroundColor) => update({ backgroundColor })}
        />
        <ColorField
          label="Couleur des coins"
          value={style.cornersSquareColor}
          onChange={(cornersSquareColor) =>
            update({ cornersSquareColor, cornersDotColor: cornersSquareColor })
          }
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Style des points</Label>
          <Select
            value={style.dotsType}
            onValueChange={(value) => update({ dotsType: value as DotsType })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="square">Carré</SelectItem>
              <SelectItem value="dots">Points</SelectItem>
              <SelectItem value="rounded">Arrondi</SelectItem>
              <SelectItem value="extra-rounded">Très arrondi</SelectItem>
              <SelectItem value="classy">Classy</SelectItem>
              <SelectItem value="classy-rounded">Classy arrondi</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Style des coins</Label>
          <Select
            value={style.cornersSquareType}
            onValueChange={(value) =>
              update({ cornersSquareType: value as CornerType })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="square">Carré</SelectItem>
              <SelectItem value="dot">Point</SelectItem>
              <SelectItem value="extra-rounded">Très arrondi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Taille ({style.width}px)</Label>
          </div>
          <Slider
            value={[style.width]}
            min={200}
            max={800}
            step={10}
            onValueChange={([width]) =>
              update({ width, height: width })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Marge ({style.margin}px)</Label>
          <Slider
            value={[style.margin]}
            min={0}
            max={40}
            step={1}
            onValueChange={([margin]) => update({ margin })}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <Label>Logo central</Label>
        <input
          ref={logoInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleLogoUpload(file)
          }}
        />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => logoInputRef.current?.click()}
          >
            <ImagePlus />
            Ajouter un logo
          </Button>
          {style.logoUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => update({ logoUrl: null, errorCorrectionLevel: "M" })}
            >
              <X />
              Retirer
            </Button>
          )}
        </div>
        {style.logoUrl && (
          <div className="space-y-3 rounded-xl border border-border/60 bg-muted/20 p-4">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={style.logoUrl}
                alt="Logo"
                className="size-12 rounded-md border object-contain"
              />
              <div className="flex-1 space-y-2">
                <div className="space-y-1">
                  <Label className="text-xs">Taille du logo ({Math.round(style.imageSize * 100)}%)</Label>
                  <Slider
                    value={[style.imageSize * 100]}
                    min={10}
                    max={50}
                    step={1}
                    onValueChange={([value]) =>
                      update({ imageSize: value / 100 })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Marge logo ({style.logoMargin}px)</Label>
                  <Slider
                    value={[style.logoMargin]}
                    min={0}
                    max={20}
                    step={1}
                    onValueChange={([logoMargin]) => update({ logoMargin })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="transparent-bg">Fond transparent</Label>
          <Switch
            id="transparent-bg"
            checked={style.transparentBackground}
            onCheckedChange={(transparentBackground) =>
              update({ transparentBackground })
            }
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Cadre décoratif
          </Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {frameOptions.map((frame) => {
              const isActive = style.frameStyle === frame.id
              return (
                <button
                  key={frame.id}
                  type="button"
                  onClick={() => update({ frameStyle: frame.id as FrameStyle })}
                  className={cn(
                    "rounded-xl border p-2.5 text-left text-xs transition-all hover:border-primary/30",
                    isActive
                      ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
                      : "border-border/60 bg-background/40"
                  )}
                >
                  <div className="mb-2 flex h-8 items-center justify-center">
                    <span
                      className={cn(
                        "block size-6",
                        frame.id === "none" && "border border-dashed border-muted-foreground/40",
                        frame.id === "simple" && "rounded border-2 border-foreground/30",
                        frame.id === "rounded" && "rounded-lg border-[3px] border-primary/40",
                        frame.id === "elegant" && "rounded border-2 border-foreground/30 ring-1 ring-foreground/10 ring-inset",
                        frame.id === "gradient" && "rounded-md bg-gradient-to-br from-violet-500 to-pink-500 p-0.5",
                        frame.id === "scanner" && "relative border-2 border-transparent",
                        frame.id === "polaroid" && "border border-foreground/10 bg-white shadow-sm",
                        frame.id === "ticket" && "border-2 border-dashed border-primary/50"
                      )}
                    >
                      {frame.id === "gradient" && (
                        <span className="block size-full rounded-[3px] bg-background" />
                      )}
                      {frame.id === "scanner" && (
                        <span className="absolute inset-0 border-t-2 border-l-2 border-primary" />
                      )}
                    </span>
                  </div>
                  <div className="font-semibold">{frame.name}</div>
                  <div className="text-muted-foreground">{frame.description}</div>
                </button>
              )
            })}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Correction d&apos;erreur</Label>
          <Select
            value={style.errorCorrectionLevel}
            onValueChange={(value) =>
              update({
                errorCorrectionLevel: value as QrStyleOptions["errorCorrectionLevel"],
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L">Faible (L)</SelectItem>
              <SelectItem value="M">Moyenne (M)</SelectItem>
              <SelectItem value="Q">Élevée (Q)</SelectItem>
              <SelectItem value="H">Maximale (H)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
