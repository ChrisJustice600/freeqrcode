"use client"

import type React from "react"
import {
  FileText,
  Link2,
  Mail,
  MessageSquare,
  Phone,
  Text,
  User,
  Wifi,
} from "lucide-react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { QrContentType } from "@/lib/qr/types"
import { cn } from "@/lib/utils"

const contentTypes: {
  value: QrContentType
  label: string
  icon: React.ComponentType<{ className?: string }>
}[] = [
  { value: "url", label: "Lien", icon: Link2 },
  { value: "text", label: "Texte", icon: Text },
  { value: "email", label: "Email", icon: Mail },
  { value: "phone", label: "Tél.", icon: Phone },
  { value: "sms", label: "SMS", icon: MessageSquare },
  { value: "wifi", label: "WiFi", icon: Wifi },
  { value: "vcard", label: "vCard", icon: User },
  { value: "file", label: "Fichier", icon: FileText },
]

interface QrTypeTabsProps {
  value: QrContentType
  onChange: (value: QrContentType) => void
}

export function QrTypeTabs({ value, onChange }: QrTypeTabsProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as QrContentType)}>
      <TabsList className="grid h-auto w-full grid-cols-4 gap-1.5 rounded-xl bg-muted/50 p-1.5 sm:grid-cols-8">
        {contentTypes.map((type) => {
          const Icon = type.icon
          const isActive = value === type.value
          return (
            <TabsTrigger
              key={type.value}
              value={type.value}
              className={cn(
                "flex h-auto flex-col gap-1.5 rounded-lg px-1 py-2.5 text-xs transition-all",
                "data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:shadow-primary/10",
                "data-[state=active]:ring-1 data-[state=active]:ring-primary/20"
              )}
            >
              <span
                className={cn(
                  "flex size-7 items-center justify-center rounded-lg transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "bg-transparent text-muted-foreground"
                )}
              >
                <Icon className="size-3.5" />
              </span>
              <span className={cn(isActive && "font-semibold text-foreground")}>
                {type.label}
              </span>
            </TabsTrigger>
          )
        })}
      </TabsList>
    </Tabs>
  )
}
