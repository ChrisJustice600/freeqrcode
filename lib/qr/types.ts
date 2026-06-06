export type QrContentType =
  | "url"
  | "text"
  | "email"
  | "phone"
  | "sms"
  | "wifi"
  | "vcard"
  | "file"

export type DotsType =
  | "square"
  | "dots"
  | "rounded"
  | "extra-rounded"
  | "classy"
  | "classy-rounded"

export type CornerType = "square" | "dot" | "extra-rounded"

export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H"

export type FrameStyle =
  | "none"
  | "simple"
  | "rounded"
  | "elegant"
  | "gradient"
  | "scanner"
  | "polaroid"
  | "ticket"

export interface UrlContent {
  url: string
}

export interface TextContent {
  text: string
}

export interface EmailContent {
  email: string
  subject?: string
  body?: string
}

export interface PhoneContent {
  phone: string
}

export interface SmsContent {
  phone: string
  message?: string
}

export type WifiEncryption = "WPA" | "WEP" | "nopass"

export interface WifiContent {
  ssid: string
  password: string
  encryption: WifiEncryption
  hidden?: boolean
}

export interface VCardContent {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  organization?: string
  title?: string
  website?: string
}

export interface FileContent {
  url: string
  mode: "link" | "upload"
}

export interface QrContentData {
  type: QrContentType
  url: UrlContent
  text: TextContent
  email: EmailContent
  phone: PhoneContent
  sms: SmsContent
  wifi: WifiContent
  vcard: VCardContent
  file: FileContent
}

export interface QrStyleOptions {
  width: number
  height: number
  margin: number
  dotsColor: string
  dotsType: DotsType
  cornersSquareType: CornerType
  cornersDotType: CornerType
  cornersSquareColor: string
  cornersDotColor: string
  backgroundColor: string
  transparentBackground: boolean
  logoUrl: string | null
  logoMargin: number
  imageSize: number
  errorCorrectionLevel: ErrorCorrectionLevel
  presetId: string | null
  frameStyle: FrameStyle
}

export interface QrGeneratorState {
  contentType: QrContentType
  content: QrContentData
  style: QrStyleOptions
}

export interface QrHistoryEntry {
  id: string
  label: string
  timestamp: number
  state: QrGeneratorState
}

export interface CapacityInfo {
  length: number
  maxRecommended: number
  level: "low" | "medium" | "high" | "critical"
  percentage: number
}
