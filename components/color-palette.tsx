"use client"

import { PALETTE_FIELDS, generatePalette } from "@/lib/palette-generator"

interface ColorPaletteProps {
  primaryColor: string
}

export function ColorPalette({ primaryColor }: ColorPaletteProps) {
  const palette = generatePalette(primaryColor)
  const paletteKeys = PALETTE_FIELDS.filter((key) => key in palette.light)

  return (
    <div className="space-y-4">
      <div className="hidden items-center gap-4 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground md:grid md:grid-cols-[minmax(0,1.1fr)_repeat(2,minmax(0,1fr))]">
        <span className="text-left">Usage</span>
        <span className="text-left">Light mode</span>
        <span className="text-left">Dark mode</span>
      </div>

      <div className="space-y-3">
        {paletteKeys.map((key) => (
          <div
            key={key}
            className="flex flex-col gap-3 rounded-xl border bg-card/60 p-3 shadow-sm md:grid md:grid-cols-[minmax(0,1.1fr)_repeat(2,minmax(0,1fr))] md:items-center md:gap-4"
          >
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground md:text-[11px]">
              {paletteLabels[key]}
            </div>

            <ColorPreview color={palette.light[key]} label="Light" />
            <ColorPreview color={palette.dark[key]} label="Dark" />
          </div>
        ))}
      </div>
    </div>
  )
}

interface ColorPreviewProps {
  color: string
  label: string
}

function ColorPreview({ color, label }: ColorPreviewProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-background/70 px-3 py-2 shadow-sm sm:gap-4">
      <div className="h-9 w-9 shrink-0 rounded-md border" style={{ backgroundColor: color }} />
      <div className="min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="font-mono text-xs text-foreground/80 break-all">{color}</div>
      </div>
    </div>
  )
}

const paletteLabels: Record<(typeof PALETTE_FIELDS)[number], string> = {
  primary: "Primary",
  secondary: "Secondary",
  accent: "Accent",
  background: "Background",
  surface: "Surface",
  text: "Text",
  headline: "Headline",
  muted: "Muted",
  border: "Border",
  success: "Success",
  warning: "Warning",
  danger: "Danger",
}
