"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { generateQRCode } from "@/lib/qrcode"

interface EventQRCodeProps {
  eventId: string
  eventName: string
}

export function EventQRCode({ eventId, eventName }: EventQRCodeProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [uploadUrl, setUploadUrl] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateQRCode = async () => {
    setIsGenerating(true)

    try {
      // Create a URL with the event ID as a query parameter
      const baseUrl = window.location.origin
      const url = uploadUrl || `${baseUrl}/upload?event=${eventId}`

      const qrCode = await generateQRCode(url)
      setQrCodeUrl(qrCode)
    } catch (error) {
      console.error("Error generating QR code:", error)
    } finally {
      setIsGenerating(false)
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
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="upload-url">URL de Upload (opcional)</Label>
          <Input
            id="upload-url"
            placeholder="URL personalizada (deixe em branco para usar a padrão)"
            value={uploadUrl}
            onChange={(e) => setUploadUrl(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Se deixado em branco, será usado o URL padrão com o ID do evento.
          </p>
        </div>

        {qrCodeUrl && (
          <div className="flex flex-col items-center mt-4">
            <img
              src={qrCodeUrl || "/placeholder.svg"}
              alt="QR Code"
              className="w-48 h-48 border border-gray-200 rounded-md"
            />
            <p className="text-sm text-gray-500 mt-2">Escaneie este QR Code para enviar fotos para o evento</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button className="w-full" onClick={handleGenerateQRCode} disabled={isGenerating}>
          {isGenerating ? "Gerando..." : "Gerar QR Code"}
        </Button>
        {qrCodeUrl && (
          <Button className="w-full" variant="outline" onClick={handleDownload}>
            Baixar QR Code
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

