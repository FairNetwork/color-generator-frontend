"use client"

import { Button } from "@/components/ui/button"
import { Pause, Play } from "lucide-react"

interface ColorCarouselProps {
  color: string
  isPaused: boolean
  onPauseToggle: () => void
}

export function ColorCarousel({ color, isPaused, onPauseToggle }: ColorCarouselProps) {
  return (
    <div className="space-y-6">
      <div
        className="relative flex h-[400px] items-center justify-center overflow-hidden rounded-2xl shadow-2xl transition-colors duration-500"
        style={{ backgroundColor: color }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent" />
        <div className="relative z-10 space-y-4 text-center">
          <div className="font-mono text-5xl font-bold text-white drop-shadow-lg md:text-7xl">{color}</div>
          <div className="text-sm font-medium text-white/90 drop-shadow">Drücke die Leertaste zum Speichern</div>
        </div>

        <Button
          variant="secondary"
          size="icon"
          className="absolute bottom-6 right-6 h-12 w-12 rounded-full shadow-lg"
          onClick={onPauseToggle}
        >
          {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  )
}
