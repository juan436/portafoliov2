"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Definir la interfaz para la estructura de datos de Hero
export interface HeroContent {
  title: string
  subtitle: string
  description: string
  profileImage: string
}

interface HeroFormProps {
  content: HeroContent
  onChange: (content: HeroContent) => void
}

export default function HeroForm({ content, onChange }: HeroFormProps) {
  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    onChange({
      ...content,
      [name]: value,
    })
  }

  return (
    <Card className="bg-black/40 border-blue-700/20">
      <CardHeader>
        <CardTitle>Sección Hero</CardTitle>
        <CardDescription>
          Edita el contenido principal que se muestra en la parte superior de tu portafolio.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            name="title"
            value={content.title}
            onChange={handleChange}
            className="bg-black/40 border-blue-700/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtítulo</Label>
          <Input
            id="subtitle"
            name="subtitle"
            value={content.subtitle}
            onChange={handleChange}
            className="bg-black/40 border-blue-700/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            name="description"
            value={content.description}
            onChange={handleChange}
            className="min-h-[100px] bg-black/40 border-blue-700/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profileImage">Imagen de Perfil (URL)</Label>
          <Input
            id="profileImage"
            name="profileImage"
            value={content.profileImage}
            onChange={handleChange}
            className="bg-black/40 border-blue-700/20"
            placeholder="https://tu-dominio.com/images/profile/tu-imagen.jpg"
          />
          <p className="text-xs text-slate-400">
            URL de la imagen de perfil que se mostrará en las secciones Hero y About.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
