import type { Options } from "qr-code-styling"

import type { QrStyleOptions } from "./types"

export function buildQrOptions(
  data: string,
  style: QrStyleOptions
): Options {
  const errorLevel = style.logoUrl ? "H" : style.errorCorrectionLevel

  return {
    width: style.width,
    height: style.height,
    type: "canvas",
    data,
    margin: style.margin,
    qrOptions: {
      typeNumber: 0,
      mode: "Byte",
      errorCorrectionLevel: errorLevel,
    },
    image: style.logoUrl || undefined,
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: style.imageSize,
      margin: style.logoMargin,
      crossOrigin: "anonymous",
    },
    dotsOptions: {
      color: style.dotsColor,
      type: style.dotsType,
    },
    cornersSquareOptions: {
      color: style.cornersSquareColor,
      type: style.cornersSquareType,
    },
    cornersDotOptions: {
      color: style.cornersDotColor,
      type: style.cornersDotType,
    },
    backgroundOptions: {
      color: style.transparentBackground
        ? "transparent"
        : style.backgroundColor,
    },
  }
}
