import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Play } from "lucide-react"
import { PhotoCarousel } from "@/components/photo-carousel"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col items-center p-4">
      <div className="max-w-4xl w-full text-center mb-8 pt-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">Compartilhamento de Fotos para Eventos</h1>
        <p className="text-xl text-blue-700 mb-8">
          Sistema para compartilhamento de fotos em tempo real durante eventos
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-12">
          <Link href="/admin/events" className="w-full">
            <Card className="h-full shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center justify-center">
                  <Settings className="h-6 w-6 mr-2" />
                  Gerenciamento de Eventos
                </CardTitle>
                <CardDescription>Crie e gerencie eventos, QR Codes e fotos</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <img src="/placeholder.svg?height=150&width=150" alt="Management Icon" className="h-32 w-32" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/slideshow" className="w-full">
            <Card className="h-full shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center justify-center">
                  <Play className="h-6 w-6 mr-2" />
                  Apresentação de Fotos
                </CardTitle>
                <CardDescription>Visualize as fotos enviadas em tempo real</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <img src="/placeholder.svg?height=150&width=150" alt="Slideshow Icon" className="h-32 w-32" />
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="w-full">
          <h2 className="text-2xl font-bold text-blue-900 mb-4 text-left">Fotos Recentes</h2>
          <PhotoCarousel />
        </div>
      </div>
    </div>
  )
}

