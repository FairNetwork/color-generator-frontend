"use client"

import { generatePalette } from "@/lib/palette-generator"

interface ColorPaletteProps {
  primaryColor: string
}

export function ColorPalette({ primaryColor }: ColorPaletteProps) {
  const palette = generatePalette(primaryColor)

  return (
    <div className="space-y-6">
      {([
        { mode: "light", label: "☀️ Light Mode" },
        { mode: "dark", label: "🌙 Dark Mode" },
      ] as const).map(({ mode, label }) => (
        <div key={mode} className="space-y-3">
          <div className="text-sm font-semibold text-muted-foreground">{label}</div>
          <div className="space-y-2">
            {Object.entries(palette[mode]).map(([key, value]) => (
              <div key={key} className="flex items-center gap-3">
                <div className="h-8 w-8 shrink-0 rounded border" style={{ backgroundColor: value }} />
                <div className="flex-1">
                  <div className="text-xs font-semibold capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</div>
                  <div className="font-mono text-xs text-muted-foreground">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
