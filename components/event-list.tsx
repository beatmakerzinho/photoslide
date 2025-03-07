"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Event {
  id: string
  name: string
  date: string
  createdAt: string
}

interface EventListProps {
  events: Event[]
  selectedEvent: string | null
  onSelectEvent: (eventId: string) => void
}

export function EventList({ events, selectedEvent, onSelectEvent }: EventListProps) {
  // Sort events by date (newest first)
  const sortedEvents = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2">
        {sortedEvents.map((event) => (
          <Button
            key={event.id}
            variant={selectedEvent === event.id ? "default" : "outline"}
            className="w-full justify-start text-left h-auto py-3"
            onClick={() => onSelectEvent(event.id)}
          >
            <div className="flex flex-col items-start">
              <span className="font-medium">{event.name}</span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(event.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            </div>
          </Button>
        ))}
      </div>
    </ScrollArea>
  )
}

