"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ColorCarousel } from "@/components/color-carousel"
import { SavedColors } from "@/components/saved-colors"
import { ColorTypeSelector } from "@/components/color-type-selector"
import {
  ALL_COLOR_TYPES,
  generateColorFromTypes,
  type ColorType,
} from "@/lib/color-generator"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { useIsMobile } from "@/hooks/use-mobile"
import { translations, resolveLanguage } from "@/lib/i18n"
import { useSearchParams } from "next/navigation"

const ColorGeneratorPage = () => {
  const [selectedTypes, setSelectedTypes] = useState<ColorType[]>([
    ...ALL_COLOR_TYPES,
  ])
  const [currentColor, setCurrentColor] = useState("")
  const [savedColors, setSavedColors] = useState<string[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [cycleDuration, setCycleDuration] = useState(4000)

  const isMobile = useIsMobile()
  const searchParams = useSearchParams()

  const languageParam = searchParams.get("language")
  const colorModeParam = searchParams.get("colormode")

  const language = resolveLanguage(languageParam)
  const copy = translations[language]

  const getNow = useCallback(
    () => (typeof performance !== "undefined" ? performance.now() : Date.now()),
    [],
  )
  const cycleStartRef = useRef<number>(getNow())
  const pausedElapsedRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  const generateNextColor = useCallback(
    () => generateColorFromTypes(selectedTypes),
    [selectedTypes],
  )

  const saveCurrentColor = useCallback(() => {
    if (!currentColor) return
    setSavedColors((prev) => {
      if (prev.includes(currentColor)) {
        return prev
      }
      return [...prev, currentColor]
    })
  }, [currentColor])

  // Generate initial color
  useEffect(() => {
    const nextColor = generateNextColor()
    setCurrentColor(nextColor)
    const now = getNow()
    cycleStartRef.current = now
    pausedElapsedRef.current = 0
    setProgress(0)
  }, [generateNextColor, getNow])

  useEffect(() => {
    const root = document.documentElement
    root.lang = language

    if (colorModeParam === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [colorModeParam, language])

    useEffect(() => {
        const sendHeight = () => {
            const height = document.documentElement.scrollHeight;
            window.parent.postMessage({ type: "iframe-height", height }, "*");
        };

        sendHeight();

        const ro = new ResizeObserver(sendHeight);
        ro.observe(document.body);

        window.addEventListener("load", sendHeight);

        return () => {
            window.removeEventListener("load", sendHeight);
            ro.disconnect();
        };
    }, []);

  useEffect(() => {
    if (isPaused) {
      pausedElapsedRef.current = Math.min(
        cycleDuration,
        getNow() - cycleStartRef.current,
      )
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      return
    }

    const resumeElapsed = pausedElapsedRef.current
    const startTime = getNow() - resumeElapsed
    cycleStartRef.current = startTime
    pausedElapsedRef.current = 0

    const step = (timestamp: number) => {
      const elapsed = timestamp - cycleStartRef.current

      if (elapsed >= cycleDuration) {
        setProgress(100)
        const nextColor = generateNextColor()
        setCurrentColor(nextColor)
        cycleStartRef.current = timestamp
        pausedElapsedRef.current = 0

        rafRef.current = requestAnimationFrame((nextTimestamp) => {
          cycleStartRef.current = nextTimestamp
          setProgress(0)
          step(nextTimestamp)
        })
        return
      }

      const percentage = Math.min(100, (elapsed / cycleDuration) * 100)
      setProgress(percentage)
      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [generateNextColor, getNow, isPaused, cycleDuration])

  // Handle spacebar press to save color
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault()
        saveCurrentColor()
      }
    },
    [saveCurrentColor],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [handleKeyPress])

  const handleRemoveColor = (color: string) => {
    setSavedColors((prev) => prev.filter((c) => c !== color))
  }

  const handleCycleDurationChange = useCallback(
    (nextSeconds: number[]) => {
      const seconds = nextSeconds[0]
      const newDuration = seconds * 1000
      const now = getNow()
      const progressRatio = progress / 100
      cycleStartRef.current = now - progressRatio * newDuration
      if (isPaused) {
        pausedElapsedRef.current = Math.min(
          newDuration,
          now - cycleStartRef.current,
        )
      } else {
        pausedElapsedRef.current = 0
      }
      setCycleDuration(newDuration)
    },
    [getNow, isPaused, progress],
  )

  const timeRemaining = Math.max(0, cycleDuration * (1 - progress / 100))

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-12">
      <div className="mx-auto max-w-7xl space-y-10 sm:space-y-12">
        {/* Color Type Selector */}
        <ColorTypeSelector
          value={selectedTypes}
          onChange={setSelectedTypes}
          translations={copy.colorTypes}
        />

        <div className="space-y-3">
          <Label htmlFor="interval-slider" className="text-base font-medium">
            {copy.colorChangeIntervalLabel}: {(cycleDuration / 1000).toFixed(1)}s
          </Label>
          <Slider
            id="interval-slider"
            min={1}
            max={10}
            step={0.5}
            value={[cycleDuration / 1000]}
            onValueChange={handleCycleDurationChange}
          />
        </div>

        {/* Color Carousel */}
        <ColorCarousel
          color={currentColor}
          isPaused={isPaused}
          onPauseToggle={() => setIsPaused(!isPaused)}
          progress={progress}
          timeRemaining={timeRemaining}
          onSaveColor={saveCurrentColor}
          isMobile={isMobile}
          translations={copy}
        />

        {/* Saved Colors */}
        <SavedColors
          colors={savedColors}
          onRemoveColor={handleRemoveColor}
          translations={copy.savedColors}
          paletteTranslations={copy.colorPalette}
          exportTranslations={copy.exportDialog}
        />
      </div>
    </div>
  )
}

export default ColorGeneratorPage
