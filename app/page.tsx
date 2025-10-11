"use client"

import { useState, useEffect, useCallback } from "react"
import { ColorCarousel } from "@/components/color-carousel"
import { SavedColors } from "@/components/saved-colors"
import { ColorTypeSelector } from "@/components/color-type-selector"
import {
  ALL_COLOR_TYPES,
  generateColorFromTypes,
  type ColorType,
} from "@/lib/color-generator"

export default function ColorGeneratorPage() {
  const [selectedTypes, setSelectedTypes] = useState<ColorType[]>([...ALL_COLOR_TYPES])
  const [currentColor, setCurrentColor] = useState("")
  const [savedColors, setSavedColors] = useState<string[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)

  const cycleDuration = 2000

  const generateNextColor = useCallback(() => generateColorFromTypes(selectedTypes), [selectedTypes])

  // Generate initial color
  useEffect(() => {
    setCurrentColor(generateNextColor())
  }, [generateNextColor])

  // Auto-advance carousel every 2 seconds
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setCurrentColor(generateNextColor())
    }, cycleDuration)

    return () => clearInterval(interval)
  }, [generateNextColor, isPaused, cycleDuration])

  // Animate progress towards next color
  useEffect(() => {
    if (isPaused) return

    let animationFrame: number
    let startTime: number | null = null
    setProgress(0)

    const step = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp
      }

      const elapsed = timestamp - startTime
      const percentage = Math.min(100, (elapsed / cycleDuration) * 100)
      setProgress(percentage)

      if (elapsed < cycleDuration) {
        animationFrame = requestAnimationFrame(step)
      }
    }

    animationFrame = requestAnimationFrame(step)

    return () => cancelAnimationFrame(animationFrame)
  }, [currentColor, isPaused, cycleDuration])

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

  const timeRemaining = Math.max(0, cycleDuration * (1 - progress / 100))

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Color Type Selector */}
        <ColorTypeSelector value={selectedTypes} onChange={setSelectedTypes} />

        {/* Color Carousel */}
        <ColorCarousel
          color={currentColor}
          isPaused={isPaused}
          onPauseToggle={() => setIsPaused(!isPaused)}
          progress={progress}
          timeRemaining={timeRemaining}
        />

        {/* Saved Colors */}
        <SavedColors colors={savedColors} onRemoveColor={handleRemoveColor} />
      </div>
    </div>
  )
}
