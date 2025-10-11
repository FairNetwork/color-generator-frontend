"use client"

import { useState } from "react"
import { generatePalette } from "@/lib/palette-generator"
import { Button } from "@/components/ui/button"

interface ColorPaletteProps {
  primaryColor: string
}

export function ColorPalette({ primaryColor }: ColorPaletteProps) {
  const [mode, setMode] = useState<"light" | "dark">("light")
  const palette = generatePalette(primaryColor, mode)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Farbpalette</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
          className="h-7 text-xs"
        >
          {mode === "light" ? "☀️ Light" : "🌙 Dark"}
        </Button>
      </div>

      <div className="space-y-2">
        {Object.entries(palette).map(([key, value]) => (
          <div key={key} className="flex items-center gap-2">
            <div className="h-8 w-8 shrink-0 rounded border" style={{ backgroundColor: value }} />
            <div className="flex-1">
              <div className="text-xs font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</div>
              <div className="font-mono text-xs text-muted-foreground">{value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
