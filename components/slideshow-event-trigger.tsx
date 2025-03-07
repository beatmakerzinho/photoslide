"use client"

import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"

interface SlideshowEventTriggerProps {
  onTrigger: () => void
}

export function SlideshowEventTrigger({ onTrigger }: SlideshowEventTriggerProps) {
  return (
    <div className="absolute bottom-20 right-4">
      <Button
        onClick={onTrigger}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none shadow-lg"
      >
        <Zap className="h-4 w-4 mr-2" />
        Acionar Evento
      </Button>
    </div>
  )
}

