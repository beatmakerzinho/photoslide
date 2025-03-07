"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getEvents, createEvent } from "@/lib/events"
import { EventList } from "@/components/event-list"
import { EventPhotos } from "@/components/event-photos"
import { EventQRCode } from "@/components/event-qrcode"
import { PlusCircle, ChevronLeft } from "lucide-react"

interface Event {
  id: string
  name: string
  date: string
  createdAt: string
}

export default function EventManagement() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState<"photos" | "qrcode">("photos")
  const [newEventName, setNewEventName] = useState("")
  const [newEventDate, setNewEventDate] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadEvents() {
      try {
        const fetchedEvents = await getEvents()
        setEvents(fetchedEvents)

        // Select the first event by default if available
        if (fetchedEvents.length > 0 && !selectedEvent) {
          setSelectedEvent(fetchedEvents[0].id)
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error loading events:", error)
        setIsLoading(false)
      }
    }

    loadEvents()
  }, [selectedEvent])

  const handleCreateEvent = async () => {
    if (!newEventName) return

    setIsCreating(true)

    try {
      const newEvent = await createEvent({
        name: newEventName,
        date: newEventDate || new Date().toISOString().split("T")[0],
      })

      setEvents([...events, newEvent])
      setSelectedEvent(newEvent.id)
      setNewEventName("")
      setNewEventDate("")
    } catch (error) {
      console.error("Error creating event:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const selectedEventData = events.find((e) => e.id === selectedEvent)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="outline" size="icon" className="mr-4">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-blue-900">Gerenciamento de Eventos</h1>
        </div>

        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="events">Eventos</TabsTrigger>
            <TabsTrigger value="create">Criar Evento</TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Eventos</CardTitle>
                  <CardDescription>Selecione um evento para gerenciar</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center p-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                  ) : events.length === 0 ? (
                    <div className="text-center p-4 text-gray-500">Nenhum evento encontrado</div>
                  ) : (
                    <EventList events={events} selectedEvent={selectedEvent} onSelectEvent={setSelectedEvent} />
                  )}
                </CardContent>
              </Card>

              <div className="md:col-span-3">
                {!selectedEvent ? (
                  <Card>
                    <CardContent className="p-8">
                      <div className="text-center text-gray-500">Selecione um evento para visualizar detalhes</div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>{selectedEventData?.name || "Evento"}</CardTitle>
                        <CardDescription>Gerencie as fotos e o QR Code deste evento</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Tabs
                          value={selectedTab}
                          onValueChange={(value) => setSelectedTab(value as "photos" | "qrcode")}
                        >
                          <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="photos">Fotos</TabsTrigger>
                            <TabsTrigger value="qrcode">QR Code</TabsTrigger>
                          </TabsList>

                          <TabsContent value="photos">
                            <EventPhotos eventId={selectedEvent} />
                          </TabsContent>

                          <TabsContent value="qrcode">
                            <EventQRCode eventId={selectedEvent} eventName={selectedEventData?.name || "Evento"} />
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Criar Novo Evento</CardTitle>
                <CardDescription>Preencha os detalhes para criar um novo evento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="event-name">Nome do Evento</Label>
                  <Input
                    id="event-name"
                    placeholder="Digite o nome do evento"
                    value={newEventName}
                    onChange={(e) => setNewEventName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event-date">Data do Evento</Label>
                  <Input
                    id="event-date"
                    type="date"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleCreateEvent} disabled={!newEventName || isCreating} className="w-full">
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Criando...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Criar Evento
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

