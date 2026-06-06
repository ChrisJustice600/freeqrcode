import type { QrStyleOptions } from "./types"
import { defaultStyle } from "./defaults"

export interface QrPreset {
  id: string
  name: string
  description: string
  style: Partial<QrStyleOptions>
}

export const qrPresets: QrPreset[] = [
  {
    id: "classic",
    name: "Classique",
    description: "Noir et blanc, style standard",
    style: {
      dotsColor: "#000000",
      dotsType: "square",
      cornersSquareType: "square",
      cornersDotType: "square",
      cornersSquareColor: "#000000",
      cornersDotColor: "#000000",
      backgroundColor: "#ffffff",
      transparentBackground: false,
      frameStyle: "none",
    },
  },
  {
    id: "rounded",
    name: "Arrondi",
    description: "Points et coins arrondis",
    style: {
      dotsColor: "#1a1a2e",
      dotsType: "rounded",
      cornersSquareType: "extra-rounded",
      cornersDotType: "dot",
      cornersSquareColor: "#1a1a2e",
      cornersDotColor: "#1a1a2e",
      backgroundColor: "#f8fafc",
      transparentBackground: false,
      frameStyle: "none",
    },
  },
  {
    id: "colorful",
    name: "Coloré",
    description: "Points bleus sur fond clair",
    style: {
      dotsColor: "#2563eb",
      dotsType: "classy-rounded",
      cornersSquareType: "extra-rounded",
      cornersDotType: "dot",
      cornersSquareColor: "#1d4ed8",
      cornersDotColor: "#3b82f6",
      backgroundColor: "#eff6ff",
      transparentBackground: false,
      frameStyle: "none",
    },
  },
  {
    id: "dark",
    name: "Sombre",
    description: "Fond sombre, points clairs",
    style: {
      dotsColor: "#f8fafc",
      dotsType: "dots",
      cornersSquareType: "dot",
      cornersDotType: "square",
      cornersSquareColor: "#e2e8f0",
      cornersDotColor: "#f8fafc",
      backgroundColor: "#0f172a",
      transparentBackground: false,
      frameStyle: "none",
    },
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Points fins, look épuré",
    style: {
      dotsColor: "#374151",
      dotsType: "dots",
      cornersSquareType: "square",
      cornersDotType: "square",
      cornersSquareColor: "#374151",
      cornersDotColor: "#374151",
      backgroundColor: "#ffffff",
      transparentBackground: false,
      frameStyle: "none",
    },
  },
]

export function applyPreset(
  current: QrStyleOptions,
  presetId: string
): QrStyleOptions {
  const preset = qrPresets.find((item) => item.id === presetId)
  if (!preset) return current

  return {
    ...defaultStyle,
    ...current,
    ...preset.style,
    presetId,
    width: current.width,
    height: current.height,
    margin: current.margin,
    logoUrl: current.logoUrl,
    logoMargin: current.logoMargin,
    imageSize: current.imageSize,
    errorCorrectionLevel: current.errorCorrectionLevel,
  }
}
