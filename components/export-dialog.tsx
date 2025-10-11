"use client"

import { useMemo, useState } from "react"
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

type ExportFormat = "tailwind" | "css" | "json" | "scss" | "android" | "swiftui" | "figma"

export function ExportDialog({ open, onOpenChange, colors }: ExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>("tailwind")
  const [copied, setCopied] = useState(false)

  const paletteBundles = useMemo(
    () =>
      colors.map((color, index) => ({
        id: `palette-${index + 1}`,
        color,
        palettes: generatePalette(color),
      })),
    [colors],
  )

  const exportContent = useMemo(() => {
    if (paletteBundles.length === 0) return "Keine Palette ausgewählt."

    switch (format) {
      case "tailwind":
        return generateTailwindConfig(paletteBundles)
      case "css":
        return generateCSS(paletteBundles)
      case "json":
        return generateJSON(paletteBundles)
      case "scss":
        return generateSCSS(paletteBundles)
      case "android":
        return generateAndroidXml(paletteBundles)
      case "swiftui":
        return generateSwiftUI(paletteBundles)
      case "figma":
        return generateFigmaTokens(paletteBundles)
      default:
        return ""
    }
  }, [format, paletteBundles])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(exportContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-hidden sm:max-w-3xl">
        <div className="modern-scrollbar max-h-[calc(85vh-3rem)] overflow-y-auto pr-1">
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle>Farben exportieren</DialogTitle>
              <DialogDescription>
                Wähle das gewünschte Format für den Export deiner Farbpaletten mit Light- und Dark-Varianten.
              </DialogDescription>
            </DialogHeader>

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
                    CSS Custom Properties
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
                    SCSS Variablen
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="android" id="android" />
                  <Label htmlFor="android" className="font-normal">
                    Android XML
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="swiftui" id="swiftui" />
                  <Label htmlFor="swiftui" className="font-normal">
                    SwiftUI Palette
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="figma" id="figma" />
                  <Label htmlFor="figma" className="font-normal">
                    Figma Tokens
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-xl bg-muted">
                <pre className="modern-scrollbar max-h-[50vh] overflow-auto bg-transparent p-4 text-sm sm:max-h-96">
                  <code className="block whitespace-pre">{exportContent}</code>
                </pre>
              </div>
              <Button size="sm" variant="secondary" className="absolute right-6 top-6 gap-2" onClick={handleCopy}>
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
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface PaletteBundle {
  id: string
  color: string
  palettes: ReturnType<typeof generatePalette>
}

function generateTailwindConfig(palettes: PaletteBundle[]) {
  const colors = palettes.reduce((acc, palette) => {
    acc[palette.id] = {
      light: palette.palettes.light,
      dark: palette.palettes.dark,
    }
    return acc
  }, {} as Record<string, unknown>)

  return `module.exports = {
  theme: {
    extend: {
      colors: ${JSON.stringify(colors, null, 8).replace(/"([^"]+)":/g, "$1:")}
    }
  }
}`
}

function generateCSS(palettes: PaletteBundle[]) {
  return palettes
    .map(
      (palette, index) => `
/* Palette ${index + 1} (${palette.color}) */
:root {
  --${palette.id}-primary: ${palette.palettes.light.primary};
  --${palette.id}-secondary: ${palette.palettes.light.secondary};
  --${palette.id}-text: ${palette.palettes.light.text};
  --${palette.id}-background: ${palette.palettes.light.background};
  --${palette.id}-headline: ${palette.palettes.light.headline};
  --${palette.id}-accent: ${palette.palettes.light.accent};
}
[data-theme="dark"] {
  --${palette.id}-primary: ${palette.palettes.dark.primary};
  --${palette.id}-secondary: ${palette.palettes.dark.secondary};
  --${palette.id}-text: ${palette.palettes.dark.text};
  --${palette.id}-background: ${palette.palettes.dark.background};
  --${palette.id}-headline: ${palette.palettes.dark.headline};
  --${palette.id}-accent: ${palette.palettes.dark.accent};
}`,
    )
    .join("\n")
}

function generateSCSS(palettes: PaletteBundle[]) {
  return palettes
    .map(
      (palette, index) => `
// Palette ${index + 1} (${palette.color})
$${palette.id}-light-primary: ${palette.palettes.light.primary};
$${palette.id}-light-secondary: ${palette.palettes.light.secondary};
$${palette.id}-light-text: ${palette.palettes.light.text};
$${palette.id}-light-background: ${palette.palettes.light.background};
$${palette.id}-light-headline: ${palette.palettes.light.headline};
$${palette.id}-light-accent: ${palette.palettes.light.accent};
$${palette.id}-dark-primary: ${palette.palettes.dark.primary};
$${palette.id}-dark-secondary: ${palette.palettes.dark.secondary};
$${palette.id}-dark-text: ${palette.palettes.dark.text};
$${palette.id}-dark-background: ${palette.palettes.dark.background};
$${palette.id}-dark-headline: ${palette.palettes.dark.headline};
$${palette.id}-dark-accent: ${palette.palettes.dark.accent};`,
    )
    .join("\n")
}

function generateJSON(palettes: PaletteBundle[]) {
  const formatted = palettes.map((palette) => ({
    id: palette.id,
    color: palette.color,
    light: palette.palettes.light,
    dark: palette.palettes.dark,
  }))

  return JSON.stringify(formatted, null, 2)
}

function generateAndroidXml(palettes: PaletteBundle[]) {
  const entries = palettes
    .map(
      (palette, index) => `  <!-- Palette ${index + 1} (${palette.color}) -->
  <color name="${palette.id}_light_primary">${palette.palettes.light.primary}</color>
  <color name="${palette.id}_light_secondary">${palette.palettes.light.secondary}</color>
  <color name="${palette.id}_light_text">${palette.palettes.light.text}</color>
  <color name="${palette.id}_light_background">${palette.palettes.light.background}</color>
  <color name="${palette.id}_light_headline">${palette.palettes.light.headline}</color>
  <color name="${palette.id}_light_accent">${palette.palettes.light.accent}</color>
  <color name="${palette.id}_dark_primary">${palette.palettes.dark.primary}</color>
  <color name="${palette.id}_dark_secondary">${palette.palettes.dark.secondary}</color>
  <color name="${palette.id}_dark_text">${palette.palettes.dark.text}</color>
  <color name="${palette.id}_dark_background">${palette.palettes.dark.background}</color>
  <color name="${palette.id}_dark_headline">${palette.palettes.dark.headline}</color>
  <color name="${palette.id}_dark_accent">${palette.palettes.dark.accent}</color>`,
    )
    .join("\n")

  return `<resources>
${entries}
</resources>`
}

function generateSwiftUI(palettes: PaletteBundle[]) {
  return palettes
    .map(
      (palette, index) => `// Palette ${index + 1} (${palette.color})
struct ${camelCase(palette.id)}Palette {
    static let light = ThemePalette(
        primary: "${palette.palettes.light.primary}",
        secondary: "${palette.palettes.light.secondary}",
        text: "${palette.palettes.light.text}",
        background: "${palette.palettes.light.background}",
        headline: "${palette.palettes.light.headline}",
        accent: "${palette.palettes.light.accent}"
    )
    static let dark = ThemePalette(
        primary: "${palette.palettes.dark.primary}",
        secondary: "${palette.palettes.dark.secondary}",
        text: "${palette.palettes.dark.text}",
        background: "${palette.palettes.dark.background}",
        headline: "${palette.palettes.dark.headline}",
        accent: "${palette.palettes.dark.accent}"
    )
}
`,
    )
    .join("\n") +
    `
struct ThemePalette {
    let primary: String
    let secondary: String
    let text: String
    let background: String
    let headline: String
    let accent: String
}
`
}

function generateFigmaTokens(palettes: PaletteBundle[]) {
  const tokens = palettes.reduce<Record<string, unknown>>((acc, palette) => {
    acc[palette.id] = {
      type: "color",
      value: {
        light: palette.palettes.light,
        dark: palette.palettes.dark,
      },
      description: `Palette ${palette.color}`,
    }
    return acc
  }, {})

  return JSON.stringify(tokens, null, 2)
}

function camelCase(value: string) {
  return value
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}
