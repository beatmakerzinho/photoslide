"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getRecentImages } from "@/lib/images"

interface Image {
  id: string
  url: string
  createdAt: string
}

export function PhotoCarousel() {
  const [images, setImages] = useState<Image[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadImages() {
      try {
        const fetchedImages = await getRecentImages(5) // Get 5 recent images
        setImages(fetchedImages)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading images:", error)
        setIsLoading(false)
      }
    }

    loadImages()
  }, [])

  useEffect(() => {
    if (images.length === 0) return

    // Auto-advance the carousel every 5 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [images])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-100 rounded-lg">
        <p className="text-gray-500">Nenhuma foto disponível</p>
      </div>
    )
  }

  return (
    <div className="relative h-64 rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex transition-transform duration-500 ease-in-out">
        <img
          src={images[currentIndex]?.url || "/placeholder.svg"}
          alt="Foto do evento"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-between p-4">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrevious}
          className="bg-black/30 text-white border-transparent hover:bg-black/50 hover:border-transparent"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={goToNext}
          className="bg-black/30 text-white border-transparent hover:bg-black/50 hover:border-transparent"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-white" : "bg-white/50"}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

