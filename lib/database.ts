"use server"

// This is a mock database implementation
// In a real application, you would use a real database like PostgreSQL, MongoDB, etc.

interface Image {
  id: string
  url: string
  createdAt: string
  eventId: string
  status: "pending" | "approved" | "rejected"
  caption?: string
}

interface Event {
  id: string
  name: string
  date: string
  createdAt: string
}

// In-memory storage for demonstration
let images: Image[] = []
const events: Event[] = [
  {
    id: "default-event",
    name: "Evento Padrão",
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
]

export async function saveImageToDatabase(image: Omit<Image, "id" | "status" | "eventId">, eventId = "default-event") {
  const id = Math.random().toString(36).substring(2, 15)
  const newImage = {
    id,
    ...image,
    eventId,
    status: "pending" as const,
  }

  // In a real implementation, you would save to a database
  images.push(newImage)

  return newImage
}

export async function getImagesFromDatabase() {
  // In a real implementation, you would fetch from a database

  // Get only approved images or all images if none are approved yet
  const approvedImages = images.filter((img) => img.status === "approved")
  const imagesToReturn = approvedImages.length > 0 ? approvedImages : images

  // Sort by createdAt in descending order (newest first)
  return [...imagesToReturn].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getEventsFromDatabase() {
  // In a real implementation, you would fetch from a database
  return [...events]
}

export async function createEventInDatabase(eventData: { name: string; date: string }) {
  const id = Math.random().toString(36).substring(2, 15)
  const newEvent = {
    id,
    ...eventData,
    createdAt: new Date().toISOString(),
  }

  // In a real implementation, you would save to a database
  events.push(newEvent)

  return newEvent
}

export async function getEventPhotosFromDatabase(eventId: string) {
  // In a real implementation, you would fetch from a database with a query
  return images
    .filter((img) => img.eventId === eventId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function updatePhotoStatusInDatabase(photoId: string, status: "approved" | "rejected") {
  // In a real implementation, you would update the database
  const photoIndex = images.findIndex((img) => img.id === photoId)

  if (photoIndex !== -1) {
    images[photoIndex] = {
      ...images[photoIndex],
      status,
    }
  }

  return { success: true }
}

export async function deletePhotoFromDatabase(photoId: string) {
  // In a real implementation, you would delete from the database
  images = images.filter((img) => img.id !== photoId)

  return { success: true }
}

export async function getRecentImagesFromDatabase(limit = 5) {
  // In a real implementation, you would fetch from a database with a limit

  // Get only approved images
  const approvedImages = images.filter((img) => img.status === "approved")

  // Sort by createdAt in descending order (newest first) and limit
  return [...approvedImages]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}

export async function updatePhotoCaptionInDatabase(photoId: string, caption: string) {
  // In a real implementation, you would update the database
  const photoIndex = images.findIndex((img) => img.id === photoId)

  if (photoIndex !== -1) {
    images[photoIndex] = {
      ...images[photoIndex],
      caption,
    }
  }

  return { success: true }
}

