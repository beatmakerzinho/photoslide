"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import type React from "react"

import { Camera, Upload, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { uploadImage } from "@/lib/upload"
import { getEvents } from "@/lib/events"

export default function UploadPage() {
  const searchParams = useSearchParams()
  const eventIdFromUrl = searchParams.get("event")

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [events, setEvents] = useState<Array<{ id: string; name: string }>>([])
  const [selectedEvent, setSelectedEvent] = useState<string>("default-event")

  useEffect(() => {
    async function fetchEvents() {
      try {
        const fetchedEvents = await getEvents()
        setEvents(fetchedEvents)

        // If we have an event ID from the URL, use it
        if (eventIdFromUrl && fetchedEvents.some((e) => e.id === eventIdFromUrl)) {
          setSelectedEvent(eventIdFromUrl)
        } else if (fetchedEvents.length > 0) {
          setSelectedEvent(fetchedEvents[0].id)
        }
      } catch (error) {
        console.error("Error fetching events:", error)
      }
    }

    fetchEvents()
  }, [eventIdFromUrl])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset states
    setUploadStatus("idle")
    setErrorMessage("")

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Por favor, selecione uma imagem válida.")
      return
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("A imagem deve ter no máximo 10MB.")
      return
    }

    setSelectedFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadStatus("idle")

    try {
      await uploadImage(selectedFile, selectedEvent)
      setUploadStatus("success")

      // Reset after successful upload
      setTimeout(() => {
        setSelectedFile(null)
        setPreviewUrl(null)
        setUploadStatus("idle")
      }, 3000)
    } catch (error) {
      console.error("Error uploading image:", error)
      setUploadStatus("error")
      setErrorMessage("Erro ao enviar a imagem. Tente novamente.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleTakePhoto = () => {
    // Trigger file input click
    document.getElementById("file-input")?.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle>Enviar Foto</CardTitle>
          <CardDescription>Compartilhe suas fotos do evento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event-select">Evento</Label>
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger id="event-select">
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
          </div>

          <input
            type="file"
            id="file-input"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            capture="environment"
          />

          {previewUrl ? (
            <div className="relative">
              <img
                src={previewUrl || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-64 object-contain border border-gray-200 rounded-md"
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2 bg-white"
                onClick={() => {
                  setSelectedFile(null)
                  setPreviewUrl(null)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              className="w-full h-64 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
              onClick={handleTakePhoto}
            >
              <Upload className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Clique para selecionar ou tirar uma foto</p>
            </div>
          )}

          {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}

          {uploadStatus === "success" && (
            <div className="flex items-center text-green-500">
              <Check className="h-4 w-4 mr-2" />
              <span>Foto enviada com sucesso!</span>
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="flex items-center text-red-500">
              <X className="h-4 w-4 mr-2" />
              <span>{errorMessage || "Erro ao enviar a foto."}</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2">
          <Button className="w-full" onClick={handleTakePhoto}>
            <Camera className="h-4 w-4 mr-2" />
            Tirar Foto
          </Button>
          <Button
            className="w-full"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading || events.length === 0}
          >
            {isUploading ? "Enviando..." : "Enviar Foto"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

