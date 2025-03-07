"use server"

import { revalidatePath } from "next/cache"
import {
  getEventPhotosFromDatabase,
  updatePhotoStatusInDatabase,
  deletePhotoFromDatabase,
  updatePhotoCaptionInDatabase,
} from "./database"

export async function getEventPhotos(eventId: string) {
  try {
    const photos = await getEventPhotosFromDatabase(eventId)
    return photos
  } catch (error) {
    console.error("Error fetching event photos:", error)
    return []
  }
}

export async function updatePhotoStatus(photoId: string, status: "approved" | "rejected") {
  try {
    await updatePhotoStatusInDatabase(photoId, status)

    // Revalidate the events page and slideshow
    revalidatePath("/admin/events")
    revalidatePath("/slideshow")

    return { success: true }
  } catch (error) {
    console.error("Error updating photo status:", error)
    throw new Error("Failed to update photo status")
  }
}

export async function deletePhoto(photoId: string) {
  try {
    await deletePhotoFromDatabase(photoId)

    // Revalidate the events page and slideshow
    revalidatePath("/admin/events")
    revalidatePath("/slideshow")

    return { success: true }
  } catch (error) {
    console.error("Error deleting photo:", error)
    throw new Error("Failed to delete photo")
  }
}

export async function updatePhotoCaption(photoId: string, caption: string) {
  try {
    await updatePhotoCaptionInDatabase(photoId, caption)

    // Revalidate the events page and slideshow
    revalidatePath("/admin/events")
    revalidatePath("/slideshow")

    return { success: true }
  } catch (error) {
    console.error("Error updating photo caption:", error)
    throw new Error("Failed to update photo caption")
  }
}

