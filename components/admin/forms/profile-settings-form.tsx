"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil } from "lucide-react"

export interface ProfileSettings {
  name: string
  email: string
  avatar: string
}

interface ProfileSettingsFormProps {
  settings: ProfileSettings
  onChange: (settings: ProfileSettings) => void
}

export default function ProfileSettingsForm({ settings, onChange }: ProfileSettingsFormProps) {
  // Manejar cambios en el perfil
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    onChange({
      ...settings,
      [name]: value,
    })
  }

  return (
    <Card className="bg-black/40 border-blue-700/20">
      <CardHeader>
        <CardTitle>Perfil</CardTitle>
        <CardDescription>Actualiza tu información de perfil y avatar.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src={settings.avatar || "/placeholder.svg"}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-2 border-blue-700/30"
            />
            <Button size="sm" className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-blue-700">
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            name="name"
            value={settings.name}
            onChange={handleChange}
            className="bg-black/40 border-blue-700/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            value={settings.email}
            onChange={handleChange}
            className="bg-black/40 border-blue-700/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="avatar">URL del Avatar</Label>
          <Input
            id="avatar"
            name="avatar"
            value={settings.avatar}
            onChange={handleChange}
            className="bg-black/40 border-blue-700/20"
          />
          <p className="text-xs text-slate-500">
            Introduce la URL de una imagen para usarla como avatar. Recomendación: imagen cuadrada de 500x500px.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
