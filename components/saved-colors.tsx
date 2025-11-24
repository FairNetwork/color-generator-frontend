"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ColorPalette } from "@/components/color-palette"
import { ExportDialog } from "@/components/export-dialog"
import { ChevronDown, Download, X } from "lucide-react"
import type { AppTranslations } from "@/lib/i18n"

interface SavedColorsProps {
  colors: string[]
  onRemoveColor: (color: string) => void
  translations: AppTranslations["savedColors"]
  paletteTranslations: AppTranslations["colorPalette"]
  exportTranslations: AppTranslations["exportDialog"]
}

export const SavedColors = ({
  colors,
  onRemoveColor,
  translations,
  paletteTranslations,
  exportTranslations,
}: SavedColorsProps) => {
  const [expandedColors, setExpandedColors] = useState<string[]>([])
  const [exportTarget, setExportTarget] = useState<string | null>(null)

  const toggleColor = (color: string) => {
    setExpandedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    )
  }

  const handleExport = (color: string) => {
    setExportTarget(color)
  }

  const handleExportDialogChange = (open: boolean) => {
    if (!open) {
      setExportTarget(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
          {translations.title}
        </h2>
        <span className="text-sm text-muted-foreground sm:text-base">
          {translations.savedCount(colors.length)}
        </span>
      </div>

      {colors.length === 0 ? (
        <p className="rounded-lg border border-dashed bg-muted/40 p-6 text-sm text-muted-foreground">
          {translations.empty}
        </p>
      ) : (
        <div className="space-y-3">
          {colors.map((color) => {
            const isExpanded = expandedColors.includes(color)

            return (
              <div key={color} className="rounded-xl border bg-card shadow-sm">
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5">
                  <button
                    type="button"
                    onClick={() => toggleColor(color)}
                    className="flex flex-1 flex-col gap-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:flex-row sm:items-center sm:gap-4"
                  >
                    <span
                      className="h-12 w-12 shrink-0 rounded-full border"
                      style={{ backgroundColor: color }}
                    />
                    <span className="flex-1 font-mono text-base font-semibold leading-tight sm:text-lg">
                      {color}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : "rotate-0"}`}
                      aria-hidden
                    />
                  </button>

                  <div className="flex items-center justify-end gap-2 sm:justify-start">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(event) => {
                        event.stopPropagation()
                        handleExport(color)
                      }}
                      aria-label={translations.downloadAria}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(event) => {
                        event.stopPropagation()
                        onRemoveColor(color)
                      }}
                      aria-label={translations.removeAria}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t bg-muted/40 px-4 py-4">
                    <ColorPalette
                      primaryColor={color}
                      translations={paletteTranslations}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <ExportDialog
        open={Boolean(exportTarget)}
        onOpenChange={handleExportDialogChange}
        colors={exportTarget ? [exportTarget] : []}
        translations={exportTranslations}
      />
    </div>
  )
}
