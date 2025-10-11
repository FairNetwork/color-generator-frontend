"use client"

import { useState, useEffect, useCallback } from "react"
import { ColorCarousel } from "@/components/color-carousel"
import { SavedColors } from "@/components/saved-colors"
import { ColorTypeSelector } from "@/components/color-type-selector"
import { generateColor, type ColorType } from "@/lib/color-generator"

export default function ColorGeneratorPage() {
  const [colorType, setColorType] = useState<ColorType>("vibrant")
  const [currentColor, setCurrentColor] = useState("")
  const [savedColors, setSavedColors] = useState<string[]>([])
  const [isPaused, setIsPaused] = useState(false)

  // Generate initial color
  useEffect(() => {
    setCurrentColor(generateColor(colorType))
  }, [colorType])

  // Auto-advance carousel every 2 seconds
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setCurrentColor(generateColor(colorType))
    }, 2000)

    return () => clearInterval(interval)
  }, [colorType, isPaused])

  // Handle spacebar press to save color
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space" && currentColor) {
        e.preventDefault()
        if (!savedColors.includes(currentColor)) {
          setSavedColors((prev) => [...prev, currentColor])
        }
      }
    },
    [currentColor, savedColors],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [handleKeyPress])

  const handleRemoveColor = (color: string) => {
    setSavedColors((prev) => prev.filter((c) => c !== color))
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Color Type Selector */}
        <ColorTypeSelector value={colorType} onChange={setColorType} />

        {/* Color Carousel */}
        <ColorCarousel color={currentColor} isPaused={isPaused} onPauseToggle={() => setIsPaused(!isPaused)} />

        {/* Saved Colors */}
        {savedColors.length > 0 && <SavedColors colors={savedColors} onRemoveColor={handleRemoveColor} />}
      </div>
    </div>
  )
}
