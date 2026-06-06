import type {
  CapacityInfo,
  QrContentData,
  QrContentType,
  QrGeneratorState,
} from "./types"

export function validateUrl(url: string): boolean {
  if (!url.trim()) return false
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`)
    return Boolean(parsed.hostname)
  } catch {
    return false
  }
}

export function normalizeUrl(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return ""
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed
  }
  return `https://${trimmed}`
}

function escapeWifi(value: string): string {
  return value.replace(/[\\;,"]/g, "\\$&")
}

export function buildEmail(data: QrContentData["email"]): string {
  if (!data.email.trim()) return ""
  const params = new URLSearchParams()
  if (data.subject?.trim()) params.set("subject", data.subject.trim())
  if (data.body?.trim()) params.set("body", data.body.trim())
  const query = params.toString()
  return query ? `mailto:${data.email.trim()}?${query}` : `mailto:${data.email.trim()}`
}

export function buildPhone(data: QrContentData["phone"]): string {
  if (!data.phone.trim()) return ""
  return `tel:${data.phone.trim()}`
}

export function buildSms(data: QrContentData["sms"]): string {
  if (!data.phone.trim()) return ""
  const message = data.message?.trim()
  return message
    ? `SMSTO:${data.phone.trim()}:${message}`
    : `SMSTO:${data.phone.trim()}:`
}

export function buildWifi(data: QrContentData["wifi"]): string {
  if (!data.ssid.trim()) return ""
  const hidden = data.hidden ? "true" : "false"
  if (data.encryption === "nopass") {
    return `WIFI:T:nopass;S:${escapeWifi(data.ssid.trim())};H:${hidden};;`
  }
  return `WIFI:T:${data.encryption};S:${escapeWifi(data.ssid.trim())};P:${escapeWifi(data.password)};H:${hidden};;`
}

export function buildVCard(data: QrContentData["vcard"]): string {
  if (!data.firstName.trim() && !data.lastName.trim()) return ""

  const lines = ["BEGIN:VCARD", "VERSION:3.0"]
  const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`.trim()
  lines.push(`N:${data.lastName.trim()};${data.firstName.trim()};;;`)
  lines.push(`FN:${fullName}`)
  if (data.organization?.trim()) lines.push(`ORG:${data.organization.trim()}`)
  if (data.title?.trim()) lines.push(`TITLE:${data.title.trim()}`)
  if (data.phone?.trim()) lines.push(`TEL;TYPE=CELL:${data.phone.trim()}`)
  if (data.email?.trim()) lines.push(`EMAIL:${data.email.trim()}`)
  if (data.website?.trim()) lines.push(`URL:${normalizeUrl(data.website)}`)
  lines.push("END:VCARD")
  return lines.join("\n")
}

export function buildQrData(
  contentType: QrContentType,
  content: QrContentData
): string {
  switch (contentType) {
    case "url":
      return normalizeUrl(content.url.url)
    case "text":
      return content.text.text.trim()
    case "email":
      return buildEmail(content.email)
    case "phone":
      return buildPhone(content.phone)
    case "sms":
      return buildSms(content.sms)
    case "wifi":
      return buildWifi(content.wifi)
    case "vcard":
      return buildVCard(content.vcard)
    case "file":
      return normalizeUrl(content.file.url)
    default:
      return ""
  }
}

export function validateContent(
  contentType: QrContentType,
  content: QrContentData
): string | null {
  switch (contentType) {
    case "url":
      if (!content.url.url.trim()) return "Veuillez saisir une URL."
      if (!validateUrl(content.url.url)) return "URL invalide."
      return null
    case "text":
      if (!content.text.text.trim()) return "Veuillez saisir un texte."
      return null
    case "email":
      if (!content.email.email.trim()) return "Veuillez saisir une adresse email."
      return null
    case "phone":
      if (!content.phone.phone.trim()) return "Veuillez saisir un numéro."
      return null
    case "sms":
      if (!content.sms.phone.trim()) return "Veuillez saisir un numéro."
      return null
    case "wifi":
      if (!content.wifi.ssid.trim()) return "Veuillez saisir le nom du réseau (SSID)."
      if (
        content.wifi.encryption !== "nopass" &&
        !content.wifi.password.trim()
      ) {
        return "Veuillez saisir le mot de passe WiFi."
      }
      return null
    case "vcard":
      if (!content.vcard.firstName.trim() && !content.vcard.lastName.trim()) {
        return "Veuillez saisir au moins un nom."
      }
      return null
    case "file":
      if (!content.file.url.trim()) return "Veuillez saisir ou uploader un fichier."
      if (!validateUrl(content.file.url)) return "URL de fichier invalide."
      return null
    default:
      return null
  }
}

export function getCapacityInfo(data: string): CapacityInfo {
  const length = data.length
  const maxRecommended = 1200
  const percentage = Math.min(100, Math.round((length / maxRecommended) * 100))

  let level: CapacityInfo["level"] = "low"
  if (percentage >= 90) level = "critical"
  else if (percentage >= 70) level = "high"
  else if (percentage >= 40) level = "medium"

  return { length, maxRecommended, level, percentage }
}

export function getExportFilename(
  contentType: QrContentType,
  extension: string
): string {
  const timestamp = Date.now()
  return `qrcode-${contentType}-${timestamp}.${extension}`
}

export function getContentLabel(state: QrGeneratorState): string {
  const data = buildQrData(state.contentType, state.content)
  if (data.length <= 40) return data
  return `${data.slice(0, 37)}...`
}
