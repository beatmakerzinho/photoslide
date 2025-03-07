"use server"

import { revalidatePath } from "next/cache"
import { createEventInDatabase, getEventsFromDatabase } from "./database"

export async function getEvents() {
  try {
    const events = await getEventsFromDatabase()
    return events
  } catch (error) {
    console.error("Error fetching events:", error)
    return []
  }
}

export async function createEvent(eventData: { name: string; date: string }) {
  try {
    const newEvent = await createEventInDatabase(eventData)

    // Revalidate the events page
    revalidatePath("/admin/events")

    return newEvent
  } catch (error) {
    console.error("Error creating event:", error)
    throw new Error("Failed to create event")
  }
}

