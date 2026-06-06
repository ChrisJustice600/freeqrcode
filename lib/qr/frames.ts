import type { FrameStyle } from "./types"

export interface FrameOption {
  id: FrameStyle
  name: string
  description: string
}

export const frameOptions: FrameOption[] = [
  { id: "none", name: "Aucun", description: "Sans cadre" },
  { id: "simple", name: "Simple", description: "Bordure nette" },
  { id: "rounded", name: "Arrondi", description: "Coins doux" },
  { id: "elegant", name: "Élégant", description: "Double trait" },
  { id: "gradient", name: "Dégradé", description: "Bordure colorée" },
  { id: "scanner", name: "Scanner", description: "Coins en L" },
  { id: "polaroid", name: "Polaroid", description: "Style photo" },
  { id: "ticket", name: "Ticket", description: "Étiquette scan" },
]

interface FrameLayout {
  padding: number
  labelHeight: number
  label?: string
  bgColor: string
  borderColor: string
  borderWidth: number
  radius: number
  draw: (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    layout: FrameLayout
  ) => void
}

function drawSimpleFrame(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  layout: FrameLayout
) {
  ctx.strokeStyle = layout.borderColor
  ctx.lineWidth = layout.borderWidth
  ctx.strokeRect(x, y, size, size)
}

function drawRoundedFrame(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  layout: FrameLayout
) {
  const r = layout.radius
  ctx.strokeStyle = layout.borderColor
  ctx.lineWidth = layout.borderWidth
  ctx.beginPath()
  ctx.roundRect(x, y, size, size, r)
  ctx.stroke()
}

function drawElegantFrame(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  layout: FrameLayout
) {
  drawRoundedFrame(ctx, x, y, size, layout)
  ctx.lineWidth = 1
  ctx.strokeRect(x + 6, y + 6, size - 12, size - 12)
}

function drawGradientFrame(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  const gradient = ctx.createLinearGradient(x, y, x + size, y + size)
  gradient.addColorStop(0, "#7c3aed")
  gradient.addColorStop(0.5, "#6366f1")
  gradient.addColorStop(1, "#ec4899")
  ctx.strokeStyle = gradient
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.roundRect(x, y, size, size, 16)
  ctx.stroke()
}

function drawScannerCorners(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  layout: FrameLayout
) {
  const len = 28
  const offset = 8
  ctx.strokeStyle = layout.borderColor
  ctx.lineWidth = 4
  ctx.lineCap = "round"

  const corners = [
    [x + offset, y + offset + len, x + offset, y + offset, x + offset + len, y + offset],
    [x + size - offset - len, y + offset, x + size - offset, y + offset, x + size - offset, y + offset + len],
    [x + offset, y + size - offset - len, x + offset, y + size - offset, x + offset + len, y + size - offset],
    [x + size - offset - len, y + size - offset, x + size - offset, y + size - offset, x + size - offset, y + size - offset - len],
  ]

  for (const [x1, y1, x2, y2, x3, y3] of corners) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.lineTo(x3, y3)
    ctx.stroke()
  }
}

function drawPolaroidFrame(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  layout: FrameLayout
) {
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(x - 12, y - 12, size + 24, size + 48)
  ctx.fillStyle = layout.bgColor
  ctx.fillRect(x, y, size, size)
}

function drawTicketFrame(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  layout: FrameLayout
) {
  ctx.setLineDash([8, 6])
  ctx.strokeStyle = layout.borderColor
  ctx.lineWidth = 2
  ctx.strokeRect(x, y, size, size)
  ctx.setLineDash([])
}

const frameLayouts: Record<Exclude<FrameStyle, "none">, FrameLayout> = {
  simple: {
    padding: 20,
    labelHeight: 0,
    bgColor: "#ffffff",
    borderColor: "rgba(0,0,0,0.15)",
    borderWidth: 2,
    radius: 8,
    draw: drawSimpleFrame,
  },
  rounded: {
    padding: 24,
    labelHeight: 0,
    bgColor: "#ffffff",
    borderColor: "rgba(99,102,241,0.5)",
    borderWidth: 4,
    radius: 24,
    draw: drawRoundedFrame,
  },
  elegant: {
    padding: 22,
    labelHeight: 0,
    bgColor: "#ffffff",
    borderColor: "rgba(0,0,0,0.25)",
    borderWidth: 2,
    radius: 12,
    draw: drawElegantFrame,
  },
  gradient: {
    padding: 24,
    labelHeight: 0,
    bgColor: "#ffffff",
    borderColor: "#7c3aed",
    borderWidth: 4,
    radius: 16,
    draw: drawGradientFrame,
  },
  scanner: {
    padding: 20,
    labelHeight: 0,
    bgColor: "#ffffff",
    borderColor: "#7c3aed",
    borderWidth: 4,
    radius: 0,
    draw: drawScannerCorners,
  },
  polaroid: {
    padding: 32,
    labelHeight: 20,
    bgColor: "#ffffff",
    borderColor: "#ffffff",
    borderWidth: 0,
    radius: 0,
    draw: drawPolaroidFrame,
  },
  ticket: {
    padding: 20,
    labelHeight: 36,
    label: "SCANNEZ-MOI",
    bgColor: "#ffffff",
    borderColor: "rgba(99,102,241,0.6)",
    borderWidth: 2,
    radius: 0,
    draw: drawTicketFrame,
  },
}

export async function applyFrameToBlob(
  qrBlob: Blob,
  frameStyle: FrameStyle,
  qrSize: number
): Promise<Blob> {
  if (frameStyle === "none") return qrBlob

  const layout = frameLayouts[frameStyle]
  const qrImage = await createImageBitmap(qrBlob)
  const inner = qrSize
  const pad = layout.padding
  const labelH = layout.labelHeight
  const canvas = document.createElement("canvas")
  canvas.width = inner + pad * 2
  canvas.height = inner + pad * 2 + labelH
  const ctx = canvas.getContext("2d")
  if (!ctx) return qrBlob

  ctx.fillStyle = layout.bgColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const qrX = pad
  const qrY = pad
  ctx.drawImage(qrImage, qrX, qrY, inner, inner)

  const frameX = qrX - 8
  const frameY = qrY - 8
  const frameSize = inner + 16
  layout.draw(ctx, frameX, frameY, frameSize, layout)

  if (layout.label) {
    ctx.fillStyle = "#6366f1"
    ctx.font = "bold 13px system-ui, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(layout.label, canvas.width / 2, canvas.height - 12)
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Export failed"))),
      "image/png"
    )
  })
}

export function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
