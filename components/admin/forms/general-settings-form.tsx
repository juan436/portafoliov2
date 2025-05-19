"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export interface GeneralSettings {
  siteName: string
  siteDescription: string
  language: string
  darkMode: boolean
}

interface GeneralSettingsFormProps {
  settings: GeneralSettings
  onChange: (settings: GeneralSettings) => void
}

export default function GeneralSettingsForm({ settings, onChange }: GeneralSettingsFormProps) {
  // Manejar cambios en configuración general
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined

    onChange({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  return (
    <Card className="bg-black/40 border-blue-700/20">
      <CardHeader>
        <CardTitle>Configuración General</CardTitle>
        <CardDescription>Configura los ajustes generales de tu portafolio.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="siteName">Nombre del Sitio</Label>
          <Input
            id="siteName"
            name="siteName"
            value={settings.siteName}
            onChange={handleChange}
            className="bg-black/40 border-blue-700/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="siteDescription">Descripción del Sitio</Label>
          <Input
            id="siteDescription"
            name="siteDescription"
            value={settings.siteDescription}
            onChange={handleChange}
            className="bg-black/40 border-blue-700/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">Idioma Predeterminado</Label>
          <select
            id="language"
            name="language"
            value={settings.language}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-black/40 border border-blue-700/20 focus:border-blue-500 outline-none"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="it">Italiano</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="darkMode">Modo Oscuro</Label>
            <p className="text-sm text-slate-500">Activar el modo oscuro por defecto</p>
          </div>
          <Switch
            id="darkMode"
            name="darkMode"
            checked={settings.darkMode}
            onCheckedChange={(checked) => onChange({ ...settings, darkMode: checked })}
          />
        </div>
      </CardContent>
    </Card>
  )
}
