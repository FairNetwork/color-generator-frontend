"use client"

import { useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PALETTE_FIELDS, generatePalette } from "@/lib/palette-generator"
import { Copy, Check } from "lucide-react"

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  colors: string[]
}

type ExportFormat =
  | "tailwind"
  | "css"
  | "json"
  | "scss"
  | "android"
  | "swiftui"
  | "figma"

export const ExportDialog = ({
  open,
  onOpenChange,
  colors,
}: ExportDialogProps) => {
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
    if (paletteBundles.length === 0) return "No palette selected."

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
        <div className="modern-scrollbar max-h-[calc(85vh-3rem)] overflow-y-auto pr-1 -mr-[5px]">
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle>Export colors</DialogTitle>
              <DialogDescription>
                Choose how you want to export your palettes with light and dark
                variants.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <Label>Format</Label>
              <RadioGroup
                value={format}
                onValueChange={(v) => setFormat(v as ExportFormat)}
              >
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
                    SCSS variables
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
              <div className="overflow-hidden rounded-xl bg-muted pr-[10px]">
                <pre className="modern-scrollbar max-h-[50vh] overflow-auto bg-transparent p-4 text-sm sm:max-h-96">
                  <code className="block whitespace-pre">{exportContent}</code>
                </pre>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="absolute right-[20px] top-[10px] gap-2"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
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

const generateTailwindConfig = (palettes: PaletteBundle[]) => {
  const colors = palettes.reduce(
    (acc, palette) => {
      acc[palette.id] = {
        light: palette.palettes.light,
        dark: palette.palettes.dark,
      }
      return acc
    },
    {} as Record<string, unknown>,
  )

  return `module.exports = {
  theme: {
    extend: {
      colors: ${JSON.stringify(colors, null, 8).replace(/"([^"]+)":/g, "$1:")}
    }
  }
}`
}

const generateCSS = (palettes: PaletteBundle[]) => {
  return palettes
    .map(
      (palette, index) => `
/* Palette ${index + 1} (${palette.color}) */
:root {
${PALETTE_FIELDS.map((field) => `  --${palette.id}-${field}: ${palette.palettes.light[field]};`).join("\n")}
}
[data-theme="dark"] {
${PALETTE_FIELDS.map((field) => `  --${palette.id}-${field}: ${palette.palettes.dark[field]};`).join("\n")}
}`,
    )
    .join("\n")
}

const generateSCSS = (palettes: PaletteBundle[]) => {
  return palettes
    .map(
      (palette, index) => `
// Palette ${index + 1} (${palette.color})
${PALETTE_FIELDS.map((field) => `$${palette.id}-light-${field}: ${palette.palettes.light[field]};`).join("\n")}
${PALETTE_FIELDS.map((field) => `$${palette.id}-dark-${field}: ${palette.palettes.dark[field]};`).join("\n")}`,
    )
    .join("\n")
}

const generateJSON = (palettes: PaletteBundle[]) => {
  const formatted = palettes.map((palette) => ({
    id: palette.id,
    color: palette.color,
    light: palette.palettes.light,
    dark: palette.palettes.dark,
  }))

  return JSON.stringify(formatted, null, 2)
}

const generateAndroidXml = (palettes: PaletteBundle[]) => {
  const entries = palettes
    .map(
      (palette, index) => `  <!-- Palette ${index + 1} (${palette.color}) -->
${PALETTE_FIELDS.map(
  (field) =>
    `  <color name="${palette.id}_light_${field}">${palette.palettes.light[field]}</color>`,
).join("\n")}
${PALETTE_FIELDS.map(
  (field) =>
    `  <color name="${palette.id}_dark_${field}">${palette.palettes.dark[field]}</color>`,
).join("\n")}`,
    )
    .join("\n")

  return `<resources>
${entries}
</resources>`
}

const generateSwiftUI = (palettes: PaletteBundle[]) => {
  return (
    palettes
      .map(
        (palette, index) => `// Palette ${index + 1} (${palette.color})
struct ${camelCase(palette.id)}Palette {
    static let light = ThemePalette(
${PALETTE_FIELDS.map((field) => `        ${field}: "${palette.palettes.light[field]}",`).join("\n")}
    )
    static let dark = ThemePalette(
${PALETTE_FIELDS.map((field) => `        ${field}: "${palette.palettes.dark[field]}",`).join("\n")}
    )
}
`,
      )
      .join("\n") +
    `
struct ThemePalette {
${PALETTE_FIELDS.map((field) => `    let ${field}: String`).join("\n")}
}
`
  )
}

const generateFigmaTokens = (palettes: PaletteBundle[]) => {
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

const camelCase = (value: string) => {
  return value
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}
