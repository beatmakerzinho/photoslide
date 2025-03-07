"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SlideshowEventDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
}

export function SlideshowEventDialog({ isOpen, onClose, title, message }: SlideshowEventDialogProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 300) // Match transition duration

      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen && !isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className="relative bg-gradient-to-br from-blue-900 to-purple-900 text-white p-6 rounded-lg shadow-xl max-w-md w-full transform transition-all duration-300 scale-100">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-white hover:bg-white/10"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-lg">{message}</p>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose} className="bg-white text-blue-900 hover:bg-white/90">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  )
}

