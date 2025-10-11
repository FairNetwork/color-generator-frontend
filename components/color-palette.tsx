"use client"

import { generatePalette } from "@/lib/palette-generator"

interface ColorPaletteProps {
  primaryColor: string
}

export function ColorPalette({ primaryColor }: ColorPaletteProps) {
  const palette = generatePalette(primaryColor)
  const paletteKeys = Object.keys(palette.light) as Array<keyof typeof palette.light>

  const formatLabel = (label: string) => label.replace(/([A-Z])/g, " $1").trim()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[minmax(0,1fr)_repeat(2,minmax(0,1.5fr))] items-center gap-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <span className="text-left">Farbrolle</span>
        <span className="text-center">☀️ Light Mode</span>
        <span className="text-center">🌙 Dark Mode</span>
      </div>

      <div className="space-y-3">
        {paletteKeys.map((key) => (
          <div
            key={key}
            className="grid grid-cols-[minmax(0,1fr)_repeat(2,minmax(0,1.5fr))] items-center gap-4 rounded-xl border bg-card/50 p-3"
          >
            <div className="text-xs font-semibold capitalize text-muted-foreground">
              {formatLabel(key)}
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
    <div className="flex items-center gap-3 rounded-lg bg-background/70 px-3 py-2">
      <div className="h-9 w-9 shrink-0 rounded-md border" style={{ backgroundColor: color }} />
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="font-mono text-xs text-foreground/80">{color}</div>
      </div>
    </div>
  )
}
