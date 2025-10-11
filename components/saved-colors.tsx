"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ColorPalette } from "@/components/color-palette"
import { ExportDialog } from "@/components/export-dialog"
import { X, Download } from "lucide-react"

interface SavedColorsProps {
  colors: string[]
  onRemoveColor: (color: string) => void
}

export function SavedColors({ colors, onRemoveColor }: SavedColorsProps) {
  const [exportDialogOpen, setExportDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gespeicherte Farben</h2>
        <Button onClick={() => setExportDialogOpen(true)} className="gap-2">
          <Download className="h-4 w-4" />
          Exportieren
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {colors.map((color) => (
          <Card key={color} className="overflow-hidden">
            <div className="relative">
              <div className="h-32 w-full transition-transform hover:scale-105" style={{ backgroundColor: color }} />
              <Button
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8 rounded-full"
                onClick={() => onRemoveColor(color)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <div className="mb-4 font-mono text-lg font-semibold">{color}</div>
              <ColorPalette primaryColor={color} />
            </div>
          </Card>
        ))}
      </div>

      <ExportDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen} colors={colors} />
    </div>
  )
}
