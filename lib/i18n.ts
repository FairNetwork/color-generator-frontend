export type SupportedLanguage = "en" | "de"

export type AppTranslations = {
  language: SupportedLanguage
  colorChangeIntervalLabel: string
  instructions: {
    mobile: string
    desktop: string
  }
  colorCarousel: {
    nextColor: string
    paused: string
  }
  savedColors: {
    title: string
    savedCount: (count: number) => string
    empty: string
    downloadAria: string
    removeAria: string
  }
  colorPalette: {
    usage: string
    lightMode: string
    darkMode: string
    light: string
    dark: string
    labels: Record<string, string>
  }
  colorTypes: {
    all: string
    labels: Record<string, string>
  }
  exportDialog: {
    title: string
    description: string
    formatLabel: string
    formats: Record<string, string>
    copy: string
    copied: string
    noPalette: string
  }
}

const basePaletteLabels = {
  primary: "Primary",
  secondary: "Secondary",
  accent: "Accent",
  background: "Background",
  surface: "Surface",
  text: "Text",
  headline: "Headline",
  muted: "Muted",
  border: "Border",
  success: "Success",
  warning: "Warning",
  danger: "Danger",
}

const baseColorTypeLabels = {
  pastel: "Pastel",
  vibrant: "Vibrant",
  dark: "Dark",
  light: "Light",
  neon: "Neon",
  earth: "Earthy",
  muted: "Muted",
  warm: "Warm",
  cool: "Cool",
  monochrome: "Monochrome",
}

export const translations: Record<SupportedLanguage, AppTranslations> = {
  en: {
    language: "en",
    colorChangeIntervalLabel: "Color change interval",
    instructions: {
      mobile: "Tap the color area to save it",
      desktop: "Press the spacebar to save",
    },
    colorCarousel: {
      nextColor: "Next color",
      paused: "Paused",
    },
    savedColors: {
      title: "Saved colors",
      savedCount: (count) => `${count} saved`,
      empty:
        "No colors saved yet. Press the spacebar or tap the color area on mobile to add your favorites to the list.",
      downloadAria: "Download palette",
      removeAria: "Remove color",
    },
    colorPalette: {
      usage: "Usage",
      lightMode: "Light mode",
      darkMode: "Dark mode",
      light: "Light",
      dark: "Dark",
      labels: basePaletteLabels,
    },
    colorTypes: {
      all: "All",
      labels: baseColorTypeLabels,
    },
    exportDialog: {
      title: "Export colors",
      description:
        "Choose how you want to export your palettes with light and dark variants.",
      formatLabel: "Format",
      formats: {
        tailwind: "Tailwind Config",
        css: "CSS Custom Properties",
        json: "JSON",
        scss: "SCSS variables",
        android: "Android XML",
        swiftui: "SwiftUI Colors",
        figma: "Figma Tokens",
      },
      copy: "Copy",
      copied: "Copied!",
      noPalette: "No palette selected.",
    },
  },
  de: {
    language: "de",
    colorChangeIntervalLabel: "Farbwechsel-Intervall",
    instructions: {
      mobile: "Tippe auf den Farbbereich, um ihn zu speichern",
      desktop: "Drücke die Leertaste, um zu speichern",
    },
    colorCarousel: {
      nextColor: "Nächste Farbe",
      paused: "Pausiert",
    },
    savedColors: {
      title: "Gespeicherte Farben",
      savedCount: (count) => `${count} gespeichert`,
      empty:
        "Noch keine Farben gespeichert. Drücke die Leertaste oder tippe auf den Farbbereich auf dem Handy, um Favoriten hinzuzufügen.",
      downloadAria: "Palette herunterladen",
      removeAria: "Farbe entfernen",
    },
    colorPalette: {
      usage: "Verwendung",
      lightMode: "Heller Modus",
      darkMode: "Dunkler Modus",
      light: "Hell",
      dark: "Dunkel",
      labels: {
        primary: "Primär",
        secondary: "Sekundär",
        accent: "Akzent",
        background: "Hintergrund",
        surface: "Fläche",
        text: "Text",
        headline: "Überschrift",
        muted: "Gedämpft",
        border: "Rahmen",
        success: "Erfolg",
        warning: "Warnung",
        danger: "Fehler",
      },
    },
    colorTypes: {
      all: "Alle",
      labels: {
        pastel: "Pastell",
        vibrant: "Kräftig",
        dark: "Dunkel",
        light: "Hell",
        neon: "Neon",
        earth: "Erdig",
        muted: "Gedämpft",
        warm: "Warm",
        cool: "Kühl",
        monochrome: "Monochrom",
      },
    },
    exportDialog: {
      title: "Farben exportieren",
      description:
        "Wähle, wie du deine Paletten mit hellen und dunklen Varianten exportieren möchtest.",
      formatLabel: "Format",
      formats: {
        tailwind: "Tailwind-Konfiguration",
        css: "CSS-Custom Properties",
        json: "JSON",
        scss: "SCSS-Variablen",
        android: "Android-XML",
        swiftui: "SwiftUI-Farben",
        figma: "Figma Tokens",
      },
      copy: "Kopieren",
      copied: "Kopiert!",
      noPalette: "Keine Palette ausgewählt.",
    },
  },
}

export const resolveLanguage = (input: string | null): SupportedLanguage =>
  input === "de" ? "de" : "en"
