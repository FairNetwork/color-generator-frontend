"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Pause, Play } from "lucide-react"

interface ColorCarouselProps {
  color: string
  isPaused: boolean
  onPauseToggle: () => void
  progress: number
  timeRemaining: number
}

export function ColorCarousel({ color, isPaused, onPauseToggle, progress, timeRemaining }: ColorCarouselProps) {
  const remainingSeconds = Math.max(0, timeRemaining / 1000)

  return (
    <div className="space-y-6">
      <div
        className="relative flex h-[400px] items-center justify-center overflow-hidden rounded-2xl shadow-2xl transition-colors duration-500"
        style={{ backgroundColor: color }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/10" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

        <div className="relative z-10 max-w-xl space-y-4 px-6 pb-24 text-center">
          <div className="font-mono text-5xl font-bold text-white drop-shadow-lg md:text-7xl">{color}</div>
          <div className="text-sm font-medium text-white/90 drop-shadow">Drücke die Leertaste zum Speichern</div>
        </div>

        <Button
          variant="secondary"
          size="icon"
          className="absolute right-6 top-6 h-12 w-12 rounded-full shadow-lg"
          onClick={onPauseToggle}
        >
          {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
        </Button>

        <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-6">
          <div className="rounded-2xl bg-black/35 p-4 shadow-lg backdrop-blur">
            <div className="flex items-center justify-between text-xs font-medium text-white/80">
              <span>Nächste Farbe</span>
              <span>{isPaused ? "Pausiert" : `${remainingSeconds.toFixed(1)}s`}</span>
            </div>
            <Progress value={progress} className="mt-2 h-2 bg-white/30" />
          </div>
        </div>
      </div>
    </div>
  )
}
