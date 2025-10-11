"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { generatePalette } from "@/lib/palette-generator"
import { Copy, Check } from "lucide-react"

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  colors: string[]
}

type ExportFormat = "tailwind" | "css" | "json" | "scss"

export function ExportDialog({ open, onOpenChange, colors }: ExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>("tailwind")
  const [mode, setMode] = useState<"light" | "dark">("light")
  const [copied, setCopied] = useState(false)

  const generateExport = () => {
    const palettes = colors.map((color) => generatePalette(color, mode))

    switch (format) {
      case "tailwind":
        return generateTailwindConfig(palettes)
      case "css":
        return generateCSS(palettes)
      case "json":
        return JSON.stringify(palettes, null, 2)
      case "scss":
        return generateSCSS(palettes)
      default:
        return ""
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateExport())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Farben exportieren</DialogTitle>
          <DialogDescription>Wähle das gewünschte Format für den Export deiner Farbpaletten</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <Label>Format</Label>
              <RadioGroup value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tailwind" id="tailwind" />
                  <Label htmlFor="tailwind" className="font-normal">
                    Tailwind Config
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="css" id="css" />
                  <Label htmlFor="css" className="font-normal">
                    CSS Variables
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="json" id="json" />
                  <Label htmlFor="json" className="font-normal">
                    JSON
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="scss" id="scss" />
                  <Label htmlFor="scss" className="font-normal">
                    SCSS Variables
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Modus</Label>
              <RadioGroup value={mode} onValueChange={(v) => setMode(v as "light" | "dark")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light" className="font-normal">
                    ☀️ Light Mode
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark" className="font-normal">
                    🌙 Dark Mode
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="relative">
            <pre className="max-h-96 overflow-auto rounded-lg bg-muted p-4 text-sm">
              <code>{generateExport()}</code>
            </pre>
            <Button size="sm" variant="secondary" className="absolute right-2 top-2 gap-2" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Kopiert!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Kopieren
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function generateTailwindConfig(palettes: any[]) {
  const colors = palettes.reduce((acc, palette, index) => {
    acc[`palette-${index + 1}`] = {
      primary: palette.primary,
      secondary: palette.secondary,
      text: palette.text,
      background: palette.background,
      headline: palette.headline,
      accent: palette.accent,
    }
    return acc
  }, {} as any)

  return `module.exports = {
  theme: {
    extend: {
      colors: ${JSON.stringify(colors, null, 8).replace(/"([^"]+)":/g, "$1:")}
    }
  }
}`
}

function generateCSS(palettes: any[]) {
  return palettes
    .map(
      (palette, index) => `
/* Palette ${index + 1} */
:root {
  --palette-${index + 1}-primary: ${palette.primary};
  --palette-${index + 1}-secondary: ${palette.secondary};
  --palette-${index + 1}-text: ${palette.text};
  --palette-${index + 1}-background: ${palette.background};
  --palette-${index + 1}-headline: ${palette.headline};
  --palette-${index + 1}-accent: ${palette.accent};
}`,
    )
    .join("\n")
}

function generateSCSS(palettes: any[]) {
  return palettes
    .map(
      (palette, index) => `
// Palette ${index + 1}
$palette-${index + 1}-primary: ${palette.primary};
$palette-${index + 1}-secondary: ${palette.secondary};
$palette-${index + 1}-text: ${palette.text};
$palette-${index + 1}-background: ${palette.background};
$palette-${index + 1}-headline: ${palette.headline};
$palette-${index + 1}-accent: ${palette.accent};`,
    )
    .join("\n")
}
