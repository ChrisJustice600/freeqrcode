"use client"

import { useEffect, useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { QrCapacityIndicator } from "@/components/qr/qr-capacity-indicator"
import { QrCustomizer } from "@/components/qr/qr-customizer"
import { QrExportMenu } from "@/components/qr/qr-export-menu"
import { QrHistoryPanel } from "@/components/qr/qr-history-panel"
import { QrInputForm } from "@/components/qr/qr-input-form"
import { QrPreview } from "@/components/qr/qr-preview"
import { QrTypeTabs } from "@/components/qr/qr-type-tabs"
import { useQrGenerator } from "@/hooks/use-qr-generator"
import {
  buildQrData,
  getCapacityInfo,
  getContentLabel,
} from "@/lib/qr/builders"
import { defaultGeneratorState } from "@/lib/qr/defaults"
import { loadHistory, saveHistoryEntry } from "@/lib/qr/history"
import type { QrGeneratorState, QrHistoryEntry } from "@/lib/qr/types"

function SectionHeader({
  step,
  title,
  description,
}: {
  step: number
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="step-badge shrink-0">{step}</span>
      <div>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="mt-1">{description}</CardDescription>
      </div>
    </div>
  )
}

export function QrGenerator() {
  const [state, setState] = useState<QrGeneratorState>(defaultGeneratorState)
  const [history, setHistory] = useState<QrHistoryEntry[]>([])

  const { containerRef, isReady, isValid, error, data, download, copyToClipboard } =
    useQrGenerator(state)

  const capacity = getCapacityInfo(data)

  useEffect(() => {
    setHistory(loadHistory())
  }, [])

  useEffect(() => {
    if (!isValid) return

    const timer = window.setTimeout(() => {
      const updated = saveHistoryEntry({
        label: getContentLabel(state),
        state,
      })
      setHistory(updated)
    }, 1500)

    return () => window.clearTimeout(timer)
  }, [isValid, state])

  function restoreHistory(entry: QrHistoryEntry) {
    setState(entry.state)
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_400px] lg:gap-8">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <SectionHeader
              step={1}
              title="Contenu"
              description="Choisissez ce que votre QR code doit contenir."
            />
          </CardHeader>
          <CardContent className="space-y-5">
            <QrTypeTabs
              value={state.contentType}
              onChange={(contentType) =>
                setState((current) => ({ ...current, contentType }))
              }
            />
            <QrInputForm
              contentType={state.contentType}
              content={state.content}
              onChange={(content) =>
                setState((current) => ({ ...current, content }))
              }
            />
            <QrCapacityIndicator capacity={capacity} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <SectionHeader
              step={2}
              title="Style"
              description="Couleurs, formes, logo et finitions."
            />
          </CardHeader>
          <CardContent>
            <QrCustomizer
              style={state.style}
              onChange={(style) =>
                setState((current) => ({ ...current, style }))
              }
            />
          </CardContent>
        </Card>

        <QrHistoryPanel
          history={history}
          onRestore={restoreHistory}
          onClear={() => setHistory([])}
        />
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <Card className="preview-glow overflow-hidden">
          <CardHeader className="border-b border-border/50 pb-4">
            <SectionHeader
              step={3}
              title="Aperçu live"
              description="Mise à jour en temps réel."
            />
          </CardHeader>
          <CardContent className="space-y-5 pt-5">
            <QrPreview
              containerRef={containerRef}
              isValid={isValid}
              isReady={isReady}
              error={error}
              frameStyle={state.style.frameStyle}
              transparentBackground={state.style.transparentBackground}
            />
            <Separator className="opacity-50" />
            <div className="space-y-2">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Exporter
              </p>
              <QrExportMenu
                contentType={state.contentType}
                isValid={isValid}
                onDownload={download}
                onCopy={copyToClipboard}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
