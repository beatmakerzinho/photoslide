"use client"

import { CardFooter } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { generateQRCode } from "@/lib/qrcode"
import Link from "next/link"

export default function QRCodeGenerator() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [eventName, setEventName] = useState<string>("")
  const [uploadUrl, setUploadUrl] = useState<string>("")

  useEffect(() => {
    // Default to the current host
    const host = window.location.origin
    setUploadUrl(`${host}/upload`)
  }, [])

  const handleGenerateQRCode = async () => {
    if (!eventName) return

    try {
      const qrCode = await generateQRCode(uploadUrl)
      setQrCodeUrl(qrCode)
    } catch (error) {
      console.error("Error generating QR code:", error)
    }
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = qrCodeUrl
    link.download = `qrcode-${eventName.replace(/\s+/g, "-").toLowerCase()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gerador de QR Code</CardTitle>
              <CardDescription>Crie um QR Code para os participantes enviarem fotos</CardDescription>
            </div>
            <Link href="/admin/events">
              <Button variant="outline" size="sm">
                Gerenciar Eventos
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event-name">Nome do Evento</Label>
            <Input
              id="event-name"
              placeholder="Digite o nome do evento"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="upload-url">URL de Upload</Label>
            <Input id="upload-url" value={uploadUrl} onChange={(e) => setUploadUrl(e.target.value)} />
          </div>

          {qrCodeUrl && (
            <div className="flex flex-col items-center mt-4">
              <img
                src={qrCodeUrl || "/placeholder.svg"}
                alt="QR Code"
                className="w-64 h-64 border border-gray-200 rounded-md"
              />
              <p className="text-sm text-gray-500 mt-2">Escaneie este QR Code para enviar fotos</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2">
          <Button className="w-full" onClick={handleGenerateQRCode} disabled={!eventName}>
            Gerar QR Code
          </Button>
          {qrCodeUrl && (
            <Button className="w-full" variant="outline" onClick={handleDownload}>
              Baixar QR Code
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

