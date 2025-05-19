"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export interface NotificationSettings {
  emailNotifications: boolean
  messageNotifications: boolean
  updateNotifications: boolean
}

interface NotificationSettingsFormProps {
  settings: NotificationSettings
  onChange: (settings: NotificationSettings) => void
}

export default function NotificationSettingsForm({ settings, onChange }: NotificationSettingsFormProps) {
  // Manejar cambios en notificaciones
  const handleNotificationChange = (name: string, checked: boolean) => {
    onChange({
      ...settings,
      [name]: checked,
    })
  }

  return (
    <Card className="bg-black/40 border-blue-700/20">
      <CardHeader>
        <CardTitle>Notificaciones</CardTitle>
        <CardDescription>Configura tus preferencias de notificaciones.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <Label htmlFor="emailNotifications">Notificaciones por Email</Label>
            <p className="text-sm text-slate-500">Recibir actualizaciones y alertas por email</p>
          </div>
          <Switch
            id="emailNotifications"
            checked={settings.emailNotifications}
            onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
          />
        </div>
        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <Label htmlFor="messageNotifications">Notificaciones de Mensajes</Label>
            <p className="text-sm text-slate-500">Recibir notificaciones de mensajes y comentarios</p>
          </div>
          <Switch
            id="messageNotifications"
            checked={settings.messageNotifications}
            onCheckedChange={(checked) => handleNotificationChange("messageNotifications", checked)}
          />
        </div>
        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <Label htmlFor="updateNotifications">Notificaciones de Actualizaciones</Label>
            <p className="text-sm text-slate-500">Recibir notificaciones sobre nuevas funcionalidades y actualizaciones</p>
          </div>
          <Switch
            id="updateNotifications"
            checked={settings.updateNotifications}
            onCheckedChange={(checked) => handleNotificationChange("updateNotifications", checked)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
