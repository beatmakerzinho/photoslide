"use client"

import { useState, useEffect } from "react"
import { Check, X, Trash2, Download, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getEventPhotos, updatePhotoStatus, deletePhoto, updatePhotoCaption } from "@/lib/photos"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Photo {
  id: string
  url: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  eventId: string
  caption?: string
}

interface EventPhotosProps {
  eventId: string
}

export function EventPhotos({ eventId }: EventPhotosProps) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null)
  const [caption, setCaption] = useState("")

  useEffect(() => {
    async function loadPhotos() {
      setIsLoading(true)
      try {
        const fetchedPhotos = await getEventPhotos(eventId)
        setPhotos(fetchedPhotos)
      } catch (error) {
        console.error("Error loading photos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (eventId) {
      loadPhotos()
    }
  }, [eventId])

  const handleUpdateStatus = async (photoId: string, status: "approved" | "rejected") => {
    try {
      await updatePhotoStatus(photoId, status)

      // Update local state
      setPhotos(photos.map((photo) => (photo.id === photoId ? { ...photo, status } : photo)))
    } catch (error) {
      console.error("Error updating photo status:", error)
    }
  }

  const handleDeletePhoto = async () => {
    if (!photoToDelete) return

    try {
      await deletePhoto(photoToDelete)

      // Update local state
      setPhotos(photos.filter((photo) => photo.id !== photoToDelete))
      setPhotoToDelete(null)
    } catch (error) {
      console.error("Error deleting photo:", error)
    }
  }

  const handleEditCaption = (photo: Photo) => {
    setEditingPhoto(photo)
    setCaption(photo.caption || "")
  }

  const handleSaveCaption = async () => {
    if (!editingPhoto) return

    try {
      await updatePhotoCaption(editingPhoto.id, caption)

      // Update local state
      setPhotos(photos.map((photo) => (photo.id === editingPhoto.id ? { ...photo, caption } : photo)))

      setEditingPhoto(null)
    } catch (error) {
      console.error("Error updating photo caption:", error)
    }
  }

  const filteredPhotos = photos.filter((photo) => {
    if (filter === "all") return true
    return photo.status === filter
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Aprovada</Badge>
      case "rejected":
        return <Badge className="bg-red-500">Rejeitada</Badge>
      default:
        return <Badge className="bg-yellow-500">Pendente</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (photos.length === 0) {
    return <div className="text-center p-8 text-gray-500">Nenhuma foto encontrada para este evento</div>
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" onValueChange={(value) => setFilter(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todas ({photos.length})</TabsTrigger>
          <TabsTrigger value="pending">Pendentes ({photos.filter((p) => p.status === "pending").length})</TabsTrigger>
          <TabsTrigger value="approved">Aprovadas ({photos.filter((p) => p.status === "approved").length})</TabsTrigger>
          <TabsTrigger value="rejected">
            Rejeitadas ({photos.filter((p) => p.status === "rejected").length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPhotos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden">
            <div className="relative group">
              <img
                src={photo.url || "/placeholder.svg"}
                alt="Foto do evento"
                className="w-full aspect-square object-cover"
              />

              {photo.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-sm truncate">
                  {photo.caption}
                </div>
              )}

              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  {photo.status !== "approved" && (
                    <Button
                      size="icon"
                      variant="outline"
                      className="bg-white text-green-600 hover:bg-green-50 hover:text-green-700"
                      onClick={() => handleUpdateStatus(photo.id, "approved")}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}

                  {photo.status !== "rejected" && (
                    <Button
                      size="icon"
                      variant="outline"
                      className="bg-white text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleUpdateStatus(photo.id, "rejected")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        onClick={() => handleEditCaption(photo)}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Legenda</DialogTitle>
                        <DialogDescription>
                          Adicione uma legenda para esta foto. A legenda será exibida durante a apresentação de slides.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-4 py-4">
                        <div className="flex justify-center mb-4">
                          <img
                            src={photo.url || "/placeholder.svg"}
                            alt="Preview"
                            className="max-h-48 object-contain rounded-md"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="caption">Legenda</Label>
                          <Input
                            id="caption"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Digite uma legenda para esta foto"
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button type="submit" onClick={handleSaveCaption}>
                          Salvar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        className="bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-700"
                      >
                        <span className="sr-only">Abrir menu</span>
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                        >
                          <path
                            d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <a href={photo.url} download target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-2" />
                          Baixar
                        </a>
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault()
                              setPhotoToDelete(photo.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir foto</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir esta foto? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setPhotoToDelete(null)}>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeletePhoto} className="bg-red-500 hover:bg-red-600">
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="absolute top-2 right-2">{getStatusBadge(photo.status)}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

