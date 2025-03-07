"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Maximize, Minimize, LayoutTemplate, Settings, ChevronLeft, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { getEventImages } from "@/lib/images"
import { getEvents } from "@/lib/events"
import { SlideshowControls } from "@/components/slideshow-controls"
import { SlideshowEventTrigger } from "@/components/slideshow-event-trigger"

interface Image {
  id: string
  url: string
  createdAt: string
  caption?: string
  eventId: string
}

interface Event {
  id: string
  name: string
  date: string
}

export default function Slideshow() {
  const searchParams = useSearchParams()
  const eventIdFromUrl = searchParams.get("event")

  const [events, setEvents] = useState<Event[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [images, setImages] = useState<Image[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9")
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [slideInterval, setSlideInterval] = useState(5000) // 5 seconds
  const [showCaptions, setShowCaptions] = useState(true)
  const [editingCaption, setEditingCaption] = useState(false)
  const [currentCaption, setCurrentCaption] = useState("")
  const [triggerMode, setTriggerMode] = useState<"auto" | "manual" | "timed">("auto")
  const [triggerDelay, setTriggerDelay] = useState(30000) // 30 seconds

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const triggerTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch available events
  useEffect(() => {
    async function fetchEvents() {
      try {
        const fetchedEvents = await getEvents()
        setEvents(fetchedEvents)

        // Set initial event selection
        if (eventIdFromUrl && fetchedEvents.some((e) => e.id === eventIdFromUrl)) {
          setSelectedEventId(eventIdFromUrl)
        } else if (fetchedEvents.length > 0) {
          setSelectedEventId(fetchedEvents[0].id)
        }
      } catch (error) {
        console.error("Error fetching events:", error)
      }
    }

    fetchEvents()
  }, [eventIdFromUrl])

  // Fetch images for the selected event
  const fetchImages = useCallback(async () => {
    if (!selectedEventId) return

    setIsLoading(true)
    try {
      const fetchedImages = await getEventImages(selectedEventId)
      setImages(fetchedImages)

      // Reset current index when changing events
      setCurrentIndex(0)

      // Set caption for the first image
      if (fetchedImages.length > 0) {
        setCurrentCaption(fetchedImages[0].caption || "")
      }

      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching images:", error)
      setIsLoading(false)
    }
  }, [selectedEventId])

  useEffect(() => {
    if (selectedEventId) {
      fetchImages()
    }
  }, [selectedEventId, fetchImages])

  // Poll for new images
  useEffect(() => {
    if (!selectedEventId) return

    const pollInterval = setInterval(fetchImages, 30000) // Poll every 30 seconds

    return () => clearInterval(pollInterval)
  }, [selectedEventId, fetchImages])

  // Handle slideshow playback
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    // Start a new interval if playing
    if (isPlaying && images.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
      }, slideInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, images, slideInterval])

  // Update caption when changing slides
  useEffect(() => {
    if (images.length > 0) {
      setCurrentCaption(images[currentIndex].caption || "")
    }
  }, [currentIndex, images])

  // Event trigger setup
  useEffect(() => {
    if (triggerTimeoutRef.current) {
      clearTimeout(triggerTimeoutRef.current)
      triggerTimeoutRef.current = null
    }

    if (triggerMode === "timed" && images.length > 0) {
      triggerTimeoutRef.current = setTimeout(() => {
        // Trigger special slide or action
        handleTriggerEvent()
      }, triggerDelay)
    }

    return () => {
      if (triggerTimeoutRef.current) {
        clearTimeout(triggerTimeoutRef.current)
      }
    }
  }, [triggerMode, triggerDelay, images])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  const toggleAspectRatio = () => {
    setAspectRatio(aspectRatio === "16:9" ? "9:16" : "16:9")
  }

  const toggleControls = () => {
    setShowControls(!showControls)
  }

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  const handleTriggerEvent = () => {
    // Example: Jump to a specific slide
    const specialSlideIndex = Math.floor(Math.random() * images.length)
    setCurrentIndex(specialSlideIndex)

    // Pause the slideshow temporarily
    const wasPlaying = isPlaying
    setIsPlaying(false)

    // Resume after 5 seconds
    setTimeout(() => {
      if (wasPlaying) {
        setIsPlaying(true)
      }
    }, 5000)
  }

  const handleSaveCaption = async () => {
    if (images.length === 0) return

    // In a real app, you would save this to the database
    const updatedImages = [...images]
    updatedImages[currentIndex] = {
      ...updatedImages[currentIndex],
      caption: currentCaption,
    }

    setImages(updatedImages)
    setEditingCaption(false)
  }

  const handleEventChange = (eventId: string) => {
    setSelectedEventId(eventId)
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {!isFullscreen && (
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Link href="/">
            <Button variant="outline" size="icon" className="bg-black/50 text-white border-gray-700 hover:bg-black/70">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>

          {events.length > 0 && (
            <Select value={selectedEventId || ""} onValueChange={handleEventChange}>
              <SelectTrigger className="w-[180px] bg-black/50 text-white border-gray-700">
                <SelectValue placeholder="Selecione um evento" />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-white">
          <p className="text-xl mb-4">Nenhuma foto disponível para este evento</p>
          {selectedEventId && (
            <Link href={`/admin/events?event=${selectedEventId}`}>
              <Button variant="outline">Gerenciar Fotos do Evento</Button>
            </Link>
          )}
        </div>
      ) : (
        <div
          className={`w-full h-full flex items-center justify-center transition-all duration-500 ease-in-out ${
            aspectRatio === "16:9" ? "aspect-video" : "aspect-[9/16]"
          }`}
        >
          <img
            src={images[currentIndex]?.url || "/placeholder.svg?height=600&width=800"}
            alt={images[currentIndex]?.caption || "Slide"}
            className={`max-h-full max-w-full object-contain transition-opacity duration-500 ${
              aspectRatio === "16:9" ? "w-full" : "h-full"
            }`}
          />

          {showCaptions && images[currentIndex]?.caption && (
            <div className="absolute bottom-16 left-0 right-0 text-center">
              <div className="inline-block bg-black/70 text-white px-6 py-3 rounded-lg text-lg max-w-[80%]">
                {images[currentIndex].caption}
              </div>
            </div>
          )}
        </div>
      )}

      {showControls && (
        <>
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={togglePlayback}
              className="bg-black/50 text-white border-gray-700 hover:bg-black/70"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleFullscreen}
              className="bg-black/50 text-white border-gray-700 hover:bg-black/70"
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleAspectRatio}
              className="bg-black/50 text-white border-gray-700 hover:bg-black/70"
            >
              <LayoutTemplate className="h-4 w-4" />
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-black/50 text-white border-gray-700 hover:bg-black/70"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-gray-900 text-white border-gray-700">
                <SheetHeader>
                  <SheetTitle className="text-white">Configurações do Slideshow</SheetTitle>
                  <SheetDescription className="text-gray-400">Personalize a apresentação de slides</SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Velocidade dos Slides</h3>
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[slideInterval]}
                        min={1000}
                        max={10000}
                        step={500}
                        onValueChange={(value) => setSlideInterval(value[0])}
                      />
                      <span className="text-sm w-16">{slideInterval / 1000}s</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-captions">Mostrar Legendas</Label>
                    <Switch id="show-captions" checked={showCaptions} onCheckedChange={setShowCaptions} />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Modo de Gatilho</h3>
                    <Tabs value={triggerMode} onValueChange={(v) => setTriggerMode(v as any)}>
                      <TabsList className="grid grid-cols-3 bg-gray-800">
                        <TabsTrigger value="auto">Automático</TabsTrigger>
                        <TabsTrigger value="manual">Manual</TabsTrigger>
                        <TabsTrigger value="timed">Temporizado</TabsTrigger>
                      </TabsList>
                    </Tabs>

                    {triggerMode === "timed" && (
                      <div className="pt-2 space-y-2">
                        <Label htmlFor="trigger-delay">Atraso do Gatilho (segundos)</Label>
                        <Input
                          id="trigger-delay"
                          type="number"
                          min={5}
                          value={triggerDelay / 1000}
                          onChange={(e) => setTriggerDelay(Number.parseInt(e.target.value) * 1000)}
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                    )}
                  </div>

                  {images.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Editar Legenda</h3>
                      <Input
                        value={currentCaption}
                        onChange={(e) => setCurrentCaption(e.target.value)}
                        placeholder="Adicionar legenda para esta imagem"
                        className="bg-gray-800 border-gray-700"
                      />
                      <Button onClick={handleSaveCaption} className="w-full">
                        Salvar Legenda
                      </Button>
                    </div>
                  )}

                  <Button variant="outline" onClick={toggleControls} className="w-full border-gray-700">
                    Esconder Controles
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {triggerMode === "manual" && <SlideshowEventTrigger onTrigger={handleTriggerEvent} />}
        </>
      )}

      {!showControls && (
        <button
          className="absolute inset-0 w-full h-full cursor-default"
          onClick={toggleControls}
          aria-label="Show controls"
        />
      )}

      {showControls && images.length > 0 && (
        <SlideshowControls
          currentIndex={currentIndex}
          totalImages={images.length}
          onPrevious={() => setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)}
          onNext={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)}
        />
      )}
    </div>
  )
}

