export type ColorType = "pastel" | "vibrant" | "dark" | "light" | "neon" | "earth"

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
    default:
      return generateVibrantColor()
  }
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

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")
}
