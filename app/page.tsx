import { Download, Palette, Sparkles, Zap } from "lucide-react"

import { AppFooter } from "@/components/layout/app-footer"
import { AppHeader } from "@/components/layout/app-header"
import { QrGenerator } from "@/components/qr/qr-generator"

const features = [
  { icon: Zap, label: "Génération instantanée" },
  { icon: Palette, label: "Styles personnalisés" },
  { icon: Download, label: "Export SVG · PNG · JPG" },
]

export default function Page() {
  return (
    <div className="mesh-bg flex min-h-svh flex-col">
      <AppHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden px-4 pb-4 pt-14 sm:pt-20">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-[420px] w-[420px] rounded-full bg-primary/8 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-3xl text-center">
            <div className="animate-fade-up badge-pill mx-auto mb-5">
              <Sparkles className="size-3.5" />
              Générateur QR code premium
            </div>
            <h1 className="animate-fade-up animate-fade-up-delay-1 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="gradient-text">Créez des QR codes</span>
              <br />
              <span className="text-foreground">qui font la différence</span>
            </h1>
            <p className="animate-fade-up animate-fade-up-delay-2 mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Liens, WiFi, cartes de visite ou fichiers — personnalisez chaque
              détail, ajoutez votre logo et exportez en haute qualité.
            </p>
            <div className="animate-fade-up animate-fade-up-delay-3 mt-8 flex flex-wrap items-center justify-center gap-2">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <span key={feature.label} className="feature-pill">
                    <Icon className="size-3.5 text-primary" />
                    {feature.label}
                  </span>
                )
              })}
            </div>
          </div>
        </section>
        <QrGenerator />
      </main>
      <AppFooter />
    </div>
  )
}
