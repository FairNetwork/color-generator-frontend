export interface ColorPalette {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  headline: string
  muted: string
  border: string
  success: string
  warning: string
  danger: string
}

export interface DualPalette {
  light: ColorPalette
  dark: ColorPalette
}

export const PALETTE_FIELDS: Array<keyof ColorPalette> = [
  "primary",
  "secondary",
  "accent",
  "background",
  "surface",
  "text",
  "headline",
  "muted",
  "border",
  "success",
  "warning",
  "danger",
]

export function generatePalette(primaryColor: string): DualPalette {
  return {
    light: generatePaletteForMode(primaryColor, "light"),
    dark: generatePaletteForMode(primaryColor, "dark"),
  }
}

function generatePaletteForMode(primaryColor: string, mode: "light" | "dark"): ColorPalette {
  const normalizedPrimary = normalizeHex(primaryColor)
  const rgb = hexToRgb(normalizedPrimary)
  if (!rgb) return getDefaultPalette(mode)

  const { r, g, b } = rgb
  const baseHsl = rgbToHsl(r, g, b)

  const secondary = adjustFromHsl(baseHsl, {
    h: mode === "light" ? 0.08 : -0.08,
    s: mode === "light" ? -0.05 : 0.04,
    l: mode === "light" ? 0.08 : -0.08,
  })
  const accent = adjustFromHsl(baseHsl, {
    h: mode === "light" ? -0.07 : 0.07,
    s: mode === "light" ? 0.08 : 0.12,
    l: mode === "light" ? -0.04 : 0.12,
  })
  const muted = adjustFromHsl(baseHsl, {
    s: -0.35,
    l: mode === "light" ? 0.3 : -0.25,
  })
  const border = adjustFromHsl(baseHsl, {
    s: -0.45,
    l: mode === "light" ? 0.42 : -0.35,
  })
  const surface = adjustFromHsl(baseHsl, {
    s: mode === "light" ? -0.5 : -0.3,
    l: mode === "light" ? 0.48 : -0.45,
  })

  if (mode === "light") {
    return {
      primary: normalizedPrimary,
      secondary,
      accent,
      background: "#FFFFFF",
      surface,
      text: "#111827",
      headline: "#0B1120",
      muted,
      border,
      success: "#16A34A",
      warning: "#CA8A04",
      danger: "#DC2626",
    }
  }

  return {
    primary: normalizedPrimary,
    secondary,
    accent,
    background: "#020617",
    surface,
    text: "#E5E7EB",
    headline: "#F8FAFC",
    muted,
    border,
    success: "#22C55E",
    warning: "#FACC15",
    danger: "#F87171",
  }
}

function normalizeHex(hex: string): string {
  const prefixed = hex.startsWith("#") ? hex : `#${hex}`
  return prefixed.toUpperCase()
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null
}

interface HslAdjustment {
  h?: number
  s?: number
  l?: number
}

function adjustFromHsl(base: { h: number; s: number; l: number }, adjustment: HslAdjustment): string {
  const newH = ((base.h + (adjustment.h ?? 0)) % 1 + 1) % 1
  const newS = clamp(base.s + (adjustment.s ?? 0), 0, 1)
  const newL = clamp(base.l + (adjustment.l ?? 0), 0, 1)
  const { r, g, b } = hslToRgb(newH, newS, newL)
  return rgbToHex(r, g, b)
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return { h, s, l }
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  )
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function getDefaultPalette(mode: "light" | "dark"): ColorPalette {
  if (mode === "light") {
    return {
      primary: "#3B82F6",
      secondary: "#8B5CF6",
      accent: "#10B981",
      background: "#FFFFFF",
      surface: "#F9FAFB",
      text: "#111827",
      headline: "#0B1120",
      muted: "#E5E7EB",
      border: "#CBD5F5",
      success: "#16A34A",
      warning: "#CA8A04",
      danger: "#DC2626",
    }
  }

  return {
    primary: "#3B82F6",
    secondary: "#8B5CF6",
    accent: "#10B981",
    background: "#020617",
    surface: "#111827",
    text: "#E5E7EB",
    headline: "#F8FAFC",
    muted: "#334155",
    border: "#1F2937",
    success: "#22C55E",
    warning: "#FACC15",
    danger: "#F87171",
  }
}
