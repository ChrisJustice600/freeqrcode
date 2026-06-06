import type { QrContentData, QrGeneratorState, QrStyleOptions } from "./types"

export const defaultContent: QrContentData = {
  type: "url",
  url: { url: "" },
  text: { text: "" },
  email: { email: "", subject: "", body: "" },
  phone: { phone: "" },
  sms: { phone: "", message: "" },
  wifi: { ssid: "", password: "", encryption: "WPA", hidden: false },
  vcard: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organization: "",
    title: "",
    website: "",
  },
  file: { url: "", mode: "link" },
}

export const defaultStyle: QrStyleOptions = {
  width: 300,
  height: 300,
  margin: 10,
  dotsColor: "#000000",
  dotsType: "square",
  cornersSquareType: "square",
  cornersDotType: "square",
  cornersSquareColor: "#000000",
  cornersDotColor: "#000000",
  backgroundColor: "#ffffff",
  transparentBackground: false,
  logoUrl: null,
  logoMargin: 8,
  imageSize: 0.4,
  errorCorrectionLevel: "M",
  presetId: "classic",
  frameStyle: "none",
}

export const defaultGeneratorState: QrGeneratorState = {
  contentType: "url",
  content: defaultContent,
  style: defaultStyle,
}
