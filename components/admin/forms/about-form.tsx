"use client"

import React, { useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

// Definir la interfaz para la estructura de datos de About
export interface AboutContent {
  paragraph1: string
  paragraph2: string
  paragraph3: string
}

interface AboutFormProps {
  content: AboutContent
  onChange: (content: AboutContent) => void
}

export default function AboutForm({ content, onChange }: AboutFormProps) {
  // Contador de renderizados para depuración
  const renderCount = useRef(0);
  renderCount.current += 1;
  
  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    onChange({
      ...content,
      [name]: value,
    });
  }

  return (
    <Card className="bg-black/40 border-blue-700/20">
      <CardHeader>
        <CardTitle>Sección Sobre Mí</CardTitle>
        <CardDescription>
          Edita la información personal y profesional que aparece en la sección "Sobre Mí".
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="paragraph1">Párrafo 1</Label>
          <Textarea
            id="paragraph1"
            name="paragraph1"
            value={content.paragraph1 || ""}
            onChange={handleChange}
            className="min-h-[100px] bg-black/40 border-blue-700/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="paragraph2">Párrafo 2</Label>
          <Textarea
            id="paragraph2"
            name="paragraph2"
            value={content.paragraph2 || ""}
            onChange={handleChange}
            className="min-h-[100px] bg-black/40 border-blue-700/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="paragraph3">Párrafo 3</Label>
          <Textarea
            id="paragraph3"
            name="paragraph3"
            value={content.paragraph3 || ""}
            onChange={handleChange}
            className="min-h-[100px] bg-black/40 border-blue-700/20"
          />
        </div>
      </CardContent>
    </Card>
  )
}
