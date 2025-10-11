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

export const generatePalette = (primaryColor: string): DualPalette => {
  return {
    light: generatePaletteForMode(primaryColor, "light"),
    dark: generatePaletteForMode(primaryColor, "dark"),
  }
}

const generatePaletteForMode = (
  primaryColor: string,
  mode: "light" | "dark",
): ColorPalette => {
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

const normalizeHex = (hex: string): string => {
  const prefixed = hex.startsWith("#") ? hex : `#${hex}`
  return prefixed.toUpperCase()
}

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
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

const adjustFromHsl = (
  base: { h: number; s: number; l: number },
  adjustment: HslAdjustment,
): string => {
  const newH = (((base.h + (adjustment.h ?? 0)) % 1) + 1) % 1
  const newS = clamp(base.s + (adjustment.s ?? 0), 0, 1)
  const newL = clamp(base.l + (adjustment.l ?? 0), 0, 1)
  const { r, g, b } = hslToRgb(newH, newS, newL)
  return rgbToHex(r, g, b)
}

const rgbToHsl = (
  r: number,
  g: number,
  b: number,
): { h: number; s: number; l: number } => {
  const red = r / 255
  const green = g / 255
  const blue = b / 255

  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case red:
        h = ((green - blue) / d + (green < blue ? 6 : 0)) / 6
        break
      case green:
        h = ((blue - red) / d + 2) / 6
        break
      case blue:
        h = ((red - green) / d + 4) / 6
        break
    }
  }

  return { h, s, l }
}

const hslToRgb = (
  h: number,
  s: number,
  l: number,
): { r: number; g: number; b: number } => {
  if (s === 0) {
    const gray = Math.round(l * 255)
    return { r: gray, g: gray, b: gray }
  }

  const hueToRgb = (p: number, q: number, t: number) => {
    let temp = t
    if (temp < 0) temp += 1
    if (temp > 1) temp -= 1
    if (temp < 1 / 6) return p + (q - p) * 6 * temp
    if (temp < 1 / 2) return q
    if (temp < 2 / 3) return p + (q - p) * (2 / 3 - temp) * 6
    return p
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q

  const r = hueToRgb(p, q, h + 1 / 3)
  const g = hueToRgb(p, q, h)
  const b = hueToRgb(p, q, h - 1 / 3)

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

const rgbToHex = (r: number, g: number, b: number): string => {
  return (
    "#" +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  )
}

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

const getDefaultPalette = (mode: "light" | "dark"): ColorPalette => {
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
