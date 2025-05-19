"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export interface SecuritySettings {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface SecuritySettingsFormProps {
  settings: SecuritySettings
  onChange: (settings: SecuritySettings) => void
  onSave?: () => void
}

export default function SecuritySettingsForm({ settings, onChange, onSave }: SecuritySettingsFormProps) {
  // Manejar cambios en campos de seguridad
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
        <CardTitle>Seguridad</CardTitle>
        <CardDescription>Cambia tu contraseña y gestiona la seguridad de tu cuenta.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Contraseña Actual</Label>
          <Input
            id="currentPassword"
            name="currentPassword"
            type="password"
            value={settings.currentPassword}
            onChange={handleChange}
            className="bg-black/40 border-blue-700/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="newPassword">Nueva Contraseña</Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            value={settings.newPassword}
            onChange={handleChange}
            className="bg-black/40 border-blue-700/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={settings.confirmPassword}
            onChange={handleChange}
            className="bg-black/40 border-blue-700/20"
          />
        </div>
        <div className="pt-4">
          <Button
            onClick={onSave}
            className="bg-blue-700 hover:bg-blue-800"
            disabled={!settings.currentPassword || !settings.newPassword || settings.newPassword !== settings.confirmPassword}
          >
            Cambiar Contraseña
          </Button>
          {settings.newPassword && settings.confirmPassword && settings.newPassword !== settings.confirmPassword && (
            <p className="mt-2 text-sm text-red-500">Las contraseñas no coinciden.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
