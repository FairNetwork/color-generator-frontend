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

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>Nächste Farbe</span>
          <span>{isPaused ? "Pausiert" : `${remainingSeconds.toFixed(1)}s`}</span>
        </div>
        <Progress value={progress} />
      </div>
    </div>
  )
}
