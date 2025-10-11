export type ColorType =
  | "pastel"
  | "vibrant"
  | "dark"
  | "light"
  | "neon"
  | "earth"
  | "muted"
  | "warm"
  | "cool"
  | "monochrome"

export const ALL_COLOR_TYPES: ColorType[] = [
  "pastel",
  "vibrant",
  "dark",
  "light",
  "neon",
  "earth",
  "muted",
  "warm",
  "cool",
  "monochrome",
]

export function generateColor(type: ColorType): string {
  switch (type) {
    case "pastel":
      return generatePastelColor()
    case "vibrant":
      return generateVibrantColor()
    case "dark":
      return generateDarkColor()
    case "light":
      return generateLightColor()
    case "neon":
      return generateNeonColor()
    case "earth":
      return generateEarthColor()
    case "muted":
      return generateMutedColor()
    case "warm":
      return generateWarmColor()
    case "cool":
      return generateCoolColor()
    case "monochrome":
      return generateMonochromeColor()
    default:
      return generateVibrantColor()
  }
}

export function generateColorFromTypes(types: ColorType[]): string {
  const availableTypes = types.length > 0 ? types : ALL_COLOR_TYPES
  const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)]
  return generateColor(randomType)
}

function generatePastelColor(): string {
  const r = Math.floor(Math.random() * 100 + 155)
  const g = Math.floor(Math.random() * 100 + 155)
  const b = Math.floor(Math.random() * 100 + 155)
  return rgbToHex(r, g, b)
}

function generateVibrantColor(): string {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  return rgbToHex(r, g, b)
}

function generateDarkColor(): string {
  const r = Math.floor(Math.random() * 100)
  const g = Math.floor(Math.random() * 100)
  const b = Math.floor(Math.random() * 100)
  return rgbToHex(r, g, b)
}

function generateLightColor(): string {
  const r = Math.floor(Math.random() * 50 + 205)
  const g = Math.floor(Math.random() * 50 + 205)
  const b = Math.floor(Math.random() * 50 + 205)
  return rgbToHex(r, g, b)
}

function generateNeonColor(): string {
  const colors = [
    [255, Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
    [Math.floor(Math.random() * 100), 255, Math.floor(Math.random() * 100)],
    [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), 255],
    [255, 255, Math.floor(Math.random() * 100)],
    [255, Math.floor(Math.random() * 100), 255],
    [Math.floor(Math.random() * 100), 255, 255],
  ]
  const [r, g, b] = colors[Math.floor(Math.random() * colors.length)]
  return rgbToHex(r, g, b)
}

function generateEarthColor(): string {
  const earthTones = [
    [139, 90, 43],
    [160, 120, 80],
    [101, 67, 33],
    [194, 178, 128],
    [133, 94, 66],
    [92, 64, 51],
  ]
  const base = earthTones[Math.floor(Math.random() * earthTones.length)]
  const r = base[0] + Math.floor(Math.random() * 40 - 20)
  const g = base[1] + Math.floor(Math.random() * 40 - 20)
  const b = base[2] + Math.floor(Math.random() * 40 - 20)
  return rgbToHex(Math.max(0, Math.min(255, r)), Math.max(0, Math.min(255, g)), Math.max(0, Math.min(255, b)))
}

function generateMutedColor(): string {
  const hue = Math.random() * 360
  const saturation = Math.random() * 20 + 25 // lower saturation for muted look
  const lightness = Math.random() * 20 + 55
  return hslToHex(hue, saturation, lightness)
}

function generateWarmColor(): string {
  const hue = Math.random() < 0.5 ? Math.random() * 60 : 300 + Math.random() * 60
  const saturation = Math.random() * 30 + 60
  const lightness = Math.random() * 20 + 45
  return hslToHex(hue, saturation, lightness)
}

function generateCoolColor(): string {
  const hue = 120 + Math.random() * 120
  const saturation = Math.random() * 30 + 55
  const lightness = Math.random() * 25 + 45
  return hslToHex(hue, saturation, lightness)
}

function generateMonochromeColor(): string {
  const value = Math.floor(Math.random() * 156 + 50)
  return rgbToHex(value, value, value)
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")
}

function hslToHex(h: number, s: number, l: number): string {
  const saturation = s / 100
  const lightness = l / 100

  const k = (n: number) => (n + h / 30) % 12
  const a = saturation * Math.min(lightness, 1 - lightness)
  const f = (n: number) => lightness - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))

  const r = Math.round(255 * f(0))
  const g = Math.round(255 * f(8))
  const b = Math.round(255 * f(4))

  return rgbToHex(r, g, b)
}
