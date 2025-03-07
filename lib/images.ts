"use server"

import { getImagesFromDatabase, getRecentImagesFromDatabase, getEventPhotosFromDatabase } from "./database"

export async function getImages() {
  try {
    const images = await getImagesFromDatabase()
    return images
  } catch (error) {
    console.error("Error fetching images:", error)
    return []
  }
}

export async function getRecentImages(limit = 5) {
  try {
    const images = await getRecentImagesFromDatabase(limit)
    return images
  } catch (error) {
    console.error("Error fetching recent images:", error)
    return []
  }
}

export async function getEventImages(eventId: string) {
  try {
    const images = await getEventPhotosFromDatabase(eventId)

    // Filter to only show approved images for the slideshow
    const approvedImages = images.filter((img) => img.status === "approved")

    // Add some sample captions for demonstration
    return approvedImages.map((img, index) => ({
      ...img,
      caption: img.caption || (index % 3 === 0 ? `Foto ${index + 1} do evento` : ""),
    }))
  } catch (error) {
    console.error("Error fetching event images:", error)
    return []
  }
}

