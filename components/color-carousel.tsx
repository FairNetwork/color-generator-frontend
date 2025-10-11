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
  onSaveColor: () => void
  isMobile: boolean
}

export const ColorCarousel = ({
  color,
  isPaused,
  onPauseToggle,
  progress,
  timeRemaining,
  onSaveColor,
  isMobile,
}: ColorCarouselProps) => {
  const remainingSeconds = Math.max(0, timeRemaining / 1000)
  const instructionText = isMobile
    ? "Tap the color area to save it"
    : "Press the spacebar to save"

  return (
    <div className="space-y-6">
      <div
        className="relative flex h-[320px] items-center justify-center overflow-hidden rounded-2xl shadow-2xl transition-colors duration-500 sm:h-[380px] md:h-[420px]"
        style={{ backgroundColor: color }}
        role={isMobile ? "button" : undefined}
        tabIndex={isMobile ? 0 : undefined}
        onClick={() => {
          if (isMobile) {
            onSaveColor()
          }
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/10" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

        <div className="relative z-10 max-w-xl space-y-3 px-4 pb-24 text-center sm:px-6">
          <div className="font-mono text-4xl font-bold text-white drop-shadow-lg sm:text-5xl md:text-7xl">
            {color}
          </div>
          <div className="text-xs font-medium text-white/90 drop-shadow sm:text-sm">
            {instructionText}
          </div>
        </div>

        <Button
          variant="secondary"
          size="icon"
          className="absolute right-4 top-4 h-11 w-11 rounded-full shadow-lg sm:right-6 sm:top-6 sm:h-12 sm:w-12"
          onClick={(event) => {
            event.stopPropagation()
            onPauseToggle()
          }}
        >
          {isPaused ? (
            <Play className="h-5 w-5" />
          ) : (
            <Pause className="h-5 w-5" />
          )}
        </Button>

        <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-4 sm:px-6 sm:pb-6">
          <div className="rounded-2xl bg-black/35 p-3 shadow-lg backdrop-blur sm:p-4">
            <div className="flex items-center justify-between text-[11px] font-medium text-white/80 sm:text-xs">
              <span>Next color</span>
              <span>
                {isPaused ? "Paused" : `${remainingSeconds.toFixed(1)}s`}
              </span>
            </div>
            <Progress
              value={progress}
              className="mt-2 h-1.5 bg-white/30 sm:h-2"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
