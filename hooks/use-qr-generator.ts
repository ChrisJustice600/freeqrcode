"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type QRCodeStyling from "qr-code-styling"

import { buildQrData, getExportFilename, validateContent } from "@/lib/qr/builders"
import { applyFrameToBlob, triggerBlobDownload } from "@/lib/qr/frames"
import { buildQrOptions } from "@/lib/qr/styling"
import type { QrGeneratorState } from "@/lib/qr/types"

type QRCodeStylingConstructor = typeof QRCodeStyling

export function useQrGenerator(state: QrGeneratorState) {
  const containerRef = useRef<HTMLDivElement>(null)
  const qrRef = useRef<QRCodeStyling | null>(null)
  const QRCodeStylingRef = useRef<QRCodeStylingConstructor | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const data = buildQrData(state.contentType, state.content)
  const validationError = validateContent(state.contentType, state.content)
  const isValid = Boolean(data) && validationError === null

  useEffect(() => {
    let cancelled = false

    async function loadLibrary() {
      const module = await import("qr-code-styling")
      if (!cancelled) {
        QRCodeStylingRef.current = module.default
        setIsReady(true)
      }
    }

    loadLibrary()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!isReady || !QRCodeStylingRef.current || !containerRef.current) return

    const timer = window.setTimeout(async () => {
      if (!QRCodeStylingRef.current || !containerRef.current) return

      if (!isValid) {
        containerRef.current.innerHTML = ""
        qrRef.current = null
        setError(validationError)
        return
      }

      setError(null)

      const options = buildQrOptions(data, state.style)

      if (!qrRef.current) {
        qrRef.current = new QRCodeStylingRef.current(options)
        containerRef.current.innerHTML = ""
        await qrRef.current.append(containerRef.current)
      } else {
        await qrRef.current.update(options)
      }
    }, 300)

    return () => window.clearTimeout(timer)
  }, [data, isReady, isValid, state.style, validationError])

  const download = useCallback(
    async (extension: "svg" | "png" | "jpeg") => {
      if (!qrRef.current || !isValid) return false

      const filename = getExportFilename(state.contentType, extension)

      if (extension === "svg" || state.style.frameStyle === "none") {
        await qrRef.current.download({ name: "qrcode", extension })
        return true
      }

      const raw = await qrRef.current.getRawData("png")
      if (!raw) return false

      const qrBlob = toBlob(raw)
      const framed = await applyFrameToBlob(
        qrBlob,
        state.style.frameStyle,
        state.style.width
      )

      const finalBlob =
        extension === "jpeg"
          ? await convertToJpeg(framed)
          : framed

      triggerBlobDownload(finalBlob, filename)
      return true
    },
    [isValid, state.contentType, state.style.frameStyle, state.style.width]
  )

  const copyToClipboard = useCallback(async () => {
    if (!qrRef.current || !isValid) return false

    let blob = await qrRef.current.getRawData("png")
    if (!blob || !(blob instanceof Blob)) return false

    if (state.style.frameStyle !== "none") {
      blob = await applyFrameToBlob(
        blob,
        state.style.frameStyle,
        state.style.width
      )
    }

    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob }),
    ])
    return true
  }, [isValid, state.style.frameStyle, state.style.width])

  return {
    containerRef,
    qrInstance: qrRef,
    isReady,
    isValid,
    error: error || validationError,
    data,
    download,
    copyToClipboard,
  }
}

function toBlob(raw: Blob | Buffer): Blob {
  if (raw instanceof Blob) return raw
  return new Blob([Uint8Array.from(raw)])
}

async function convertToJpeg(pngBlob: Blob): Promise<Blob> {
  const bitmap = await createImageBitmap(pngBlob)
  const canvas = document.createElement("canvas")
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const ctx = canvas.getContext("2d")
  if (!ctx) return pngBlob

  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(bitmap, 0, 0)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("JPEG conversion failed"))),
      "image/jpeg",
      0.92
    )
  })
}
