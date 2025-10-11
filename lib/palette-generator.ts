export interface ColorPalette {
  primary: string
  secondary: string
  text: string
  background: string
  headline: string
  accent: string
}

export function generatePalette(primaryColor: string, mode: "light" | "dark"): ColorPalette {
  const rgb = hexToRgb(primaryColor)
  if (!rgb) return getDefaultPalette(mode)

  const { r, g, b } = rgb

  if (mode === "light") {
    return {
      primary: primaryColor,
      secondary: adjustColor(r, g, b, 0.3, 0.2),
      text: "#1a1a1a",
      background: "#ffffff",
      headline: "#0a0a0a",
      accent: adjustColor(r, g, b, -0.2, 0.3),
    }
  } else {
    return {
      primary: primaryColor,
      secondary: adjustColor(r, g, b, -0.3, -0.2),
      text: "#e5e5e5",
      background: "#0a0a0a",
      headline: "#ffffff",
      accent: adjustColor(r, g, b, 0.2, 0.3),
    }
  }
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

function adjustColor(r: number, g: number, b: number, hueDelta: number, satDelta: number): string {
  // Convert to HSL
  const { h, s, l } = rgbToHsl(r, g, b)

  // Adjust hue and saturation
  const newH = (h + hueDelta) % 1
  const newS = Math.max(0, Math.min(1, s + satDelta))

  // Convert back to RGB
  const { r: newR, g: newG, b: newB } = hslToRgb(newH, newS, l)

  return rgbToHex(newR, newG, newB)
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
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")
}

function getDefaultPalette(mode: "light" | "dark"): ColorPalette {
  if (mode === "light") {
    return {
      primary: "#3b82f6",
      secondary: "#8b5cf6",
      text: "#1a1a1a",
      background: "#ffffff",
      headline: "#0a0a0a",
      accent: "#10b981",
    }
  } else {
    return {
      primary: "#3b82f6",
      secondary: "#8b5cf6",
      text: "#e5e5e5",
      background: "#0a0a0a",
      headline: "#ffffff",
      accent: "#10b981",
    }
  }
}
