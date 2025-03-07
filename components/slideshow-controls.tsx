"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SlideshowControlsProps {
  currentIndex: number
  totalImages: number
  onPrevious: () => void
  onNext: () => void
}

export function SlideshowControls({ currentIndex, totalImages, onPrevious, onNext }: SlideshowControlsProps) {
  return (
    <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4">
      <Button
        variant="outline"
        size="icon"
        onClick={onPrevious}
        className="bg-black/50 text-white border-gray-700 hover:bg-black/70"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="text-white bg-black/50 px-3 py-1 rounded-md text-sm">
        {currentIndex + 1} / {totalImages}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={onNext}
        className="bg-black/50 text-white border-gray-700 hover:bg-black/70"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

