"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Definir la interfaz para la estructura de datos de contacto
export interface ContactContent {
  email: string
  phone: string
  location: string
}

interface ContactFormProps {
  content: ContactContent
  onChange: (content: ContactContent) => void
}

export default function ContactForm({ content, onChange }: ContactFormProps) {
  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    onChange({
      ...content,
      [name]: value,
    })
  }

  return (
    <Card className="bg-black/40 border-blue-700/20">
      <CardHeader>
        <CardTitle>Sección Contacto</CardTitle>
        <CardDescription>Edita tu información de contacto que se muestra en tu portafolio.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            value={content.email}
            onChange={handleChange}
            className="bg-black/40 border-blue-700/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            name="phone"
            value={content.phone}
            onChange={handleChange}
            className="bg-black/40 border-blue-700/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Ubicación</Label>
          <Input
            id="location"
            name="location"
            value={content.location}
            onChange={handleChange}
            className="bg-black/40 border-blue-700/20"
          />
        </div>
      </CardContent>
    </Card>
  )
}
