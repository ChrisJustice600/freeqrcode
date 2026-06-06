"use client"

import { Loader2, Upload } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { QrPdfHint } from "@/components/qr/qr-pdf-hint"
import type { QrContentData, QrContentType } from "@/lib/qr/types"

interface QrInputFormProps {
  contentType: QrContentType
  content: QrContentData
  onChange: (content: QrContentData) => void
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

export function QrInputForm({
  contentType,
  content,
  onChange,
}: QrInputFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  async function handleFileUpload(file: File) {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error || "Échec de l'upload")
      }

      const payload = (await response.json()) as { url: string }
      onChange({
        ...content,
        file: { ...content.file, url: payload.url, mode: "upload" },
      })
      toast.success("Fichier uploadé avec succès")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur lors de l'upload"
      )
    } finally {
      setIsUploading(false)
    }
  }

  switch (contentType) {
    case "url":
      return (
        <Field label="URL du site">
          <Input
            placeholder="https://exemple.com"
            value={content.url.url}
            onChange={(e) =>
              onChange({
                ...content,
                url: { url: e.target.value },
              })
            }
          />
        </Field>
      )

    case "text":
      return (
        <Field label="Texte à encoder">
          <Textarea
            placeholder="Saisissez votre message..."
            rows={4}
            value={content.text.text}
            onChange={(e) =>
              onChange({
                ...content,
                text: { text: e.target.value },
              })
            }
          />
        </Field>
      )

    case "email":
      return (
        <div className="space-y-3">
          <Field label="Adresse email">
            <Input
              type="email"
              placeholder="contact@exemple.com"
              value={content.email.email}
              onChange={(e) =>
                onChange({
                  ...content,
                  email: { ...content.email, email: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Sujet (optionnel)">
            <Input
              value={content.email.subject || ""}
              onChange={(e) =>
                onChange({
                  ...content,
                  email: { ...content.email, subject: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Message (optionnel)">
            <Textarea
              rows={3}
              value={content.email.body || ""}
              onChange={(e) =>
                onChange({
                  ...content,
                  email: { ...content.email, body: e.target.value },
                })
              }
            />
          </Field>
        </div>
      )

    case "phone":
      return (
        <Field label="Numéro de téléphone">
          <Input
            type="tel"
            placeholder="+33 6 12 34 56 78"
            value={content.phone.phone}
            onChange={(e) =>
              onChange({
                ...content,
                phone: { phone: e.target.value },
              })
            }
          />
        </Field>
      )

    case "sms":
      return (
        <div className="space-y-3">
          <Field label="Numéro de téléphone">
            <Input
              type="tel"
              placeholder="+33 6 12 34 56 78"
              value={content.sms.phone}
              onChange={(e) =>
                onChange({
                  ...content,
                  sms: { ...content.sms, phone: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Message (optionnel)">
            <Textarea
              rows={3}
              value={content.sms.message || ""}
              onChange={(e) =>
                onChange({
                  ...content,
                  sms: { ...content.sms, message: e.target.value },
                })
              }
            />
          </Field>
        </div>
      )

    case "wifi":
      return (
        <div className="space-y-3">
          <Field label="Nom du réseau (SSID)">
            <Input
              value={content.wifi.ssid}
              onChange={(e) =>
                onChange({
                  ...content,
                  wifi: { ...content.wifi, ssid: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Mot de passe">
            <Input
              type="password"
              value={content.wifi.password}
              onChange={(e) =>
                onChange({
                  ...content,
                  wifi: { ...content.wifi, password: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Chiffrement">
            <Select
              value={content.wifi.encryption}
              onValueChange={(value) =>
                onChange({
                  ...content,
                  wifi: {
                    ...content.wifi,
                    encryption: value as QrContentData["wifi"]["encryption"],
                  },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WPA">WPA / WPA2</SelectItem>
                <SelectItem value="WEP">WEP</SelectItem>
                <SelectItem value="nopass">Aucun mot de passe</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <div className="flex items-center justify-between">
            <Label htmlFor="wifi-hidden">Réseau masqué</Label>
            <Switch
              id="wifi-hidden"
              checked={content.wifi.hidden}
              onCheckedChange={(checked) =>
                onChange({
                  ...content,
                  wifi: { ...content.wifi, hidden: checked },
                })
              }
            />
          </div>
        </div>
      )

    case "vcard":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Prénom">
            <Input
              value={content.vcard.firstName}
              onChange={(e) =>
                onChange({
                  ...content,
                  vcard: { ...content.vcard, firstName: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Nom">
            <Input
              value={content.vcard.lastName}
              onChange={(e) =>
                onChange({
                  ...content,
                  vcard: { ...content.vcard, lastName: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={content.vcard.email || ""}
              onChange={(e) =>
                onChange({
                  ...content,
                  vcard: { ...content.vcard, email: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Téléphone">
            <Input
              value={content.vcard.phone || ""}
              onChange={(e) =>
                onChange({
                  ...content,
                  vcard: { ...content.vcard, phone: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Organisation">
            <Input
              value={content.vcard.organization || ""}
              onChange={(e) =>
                onChange({
                  ...content,
                  vcard: { ...content.vcard, organization: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Poste">
            <Input
              value={content.vcard.title || ""}
              onChange={(e) =>
                onChange({
                  ...content,
                  vcard: { ...content.vcard, title: e.target.value },
                })
              }
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Site web">
              <Input
                placeholder="https://exemple.com"
                value={content.vcard.website || ""}
                onChange={(e) =>
                  onChange({
                    ...content,
                    vcard: { ...content.vcard, website: e.target.value },
                  })
                }
              />
            </Field>
          </div>
        </div>
      )

    case "file":
      return (
        <div className="space-y-4">
          <QrPdfHint />
          <Tabs
            value={content.file.mode}
            onValueChange={(mode) =>
              onChange({
                ...content,
                file: {
                  ...content.file,
                  mode: mode as "link" | "upload",
                },
              })
            }
          >
            <TabsList className="w-full">
              <TabsTrigger value="link" className="flex-1">
                Lien
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex-1">
                Upload
              </TabsTrigger>
            </TabsList>
            <TabsContent value="link" className="mt-3">
              <Field label="URL du fichier">
                <Input
                  placeholder="https://drive.google.com/..."
                  value={content.file.url}
                  onChange={(e) =>
                    onChange({
                      ...content,
                      file: { ...content.file, url: e.target.value, mode: "link" },
                    })
                  }
                />
              </Field>
            </TabsContent>
            <TabsContent value="upload" className="mt-3 space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.txt"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) void handleFileUpload(file)
                }}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Upload />
                )}
                {isUploading ? "Upload en cours..." : "Choisir un fichier"}
              </Button>
              {content.file.url && content.file.mode === "upload" && (
                <p className="break-all text-xs text-muted-foreground">
                  Lien généré : {content.file.url}
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )

    default:
      return null
  }
}
