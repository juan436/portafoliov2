"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings, User, Lock, Bell, Pencil } from "lucide-react"

// Añadir prop para la sección de configuración
interface SettingsPanelProps {
  section?: string
}

export default function SettingsPanel({ section = "general" }: SettingsPanelProps) {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Juan Villegas Portfolio",
    siteDescription: "Desarrollador Full Stack especializado en React, Node.js y más tecnologías web.",
    language: "es",
    darkMode: true,
  })

  const [profileSettings, setProfileSettings] = useState({
    name: "Juan Villegas",
    email: "admin@example.com",
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile-E9YRocD6o4olhnzraHWCjLmKjCbspw.jpeg",
  })

  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    messageNotifications: true,
    updateNotifications: false,
  })

  // Manejar cambios en configuración general
  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined

    setGeneralSettings({
      ...generalSettings,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  // Manejar cambios en perfil
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileSettings({
      ...profileSettings,
      [name]: value,
    })
  }

  // Manejar cambios en seguridad
  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSecuritySettings({
      ...securitySettings,
      [name]: value,
    })
  }

  // Manejar cambios en notificaciones
  const handleNotificationChange = (name: string, checked: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked,
    })
  }

  // Guardar cambios
  const handleSave = () => {
    // Aquí implementarías la lógica para guardar los cambios en tu backend
    alert("Configuración guardada correctamente")
  }

  // Mostrar la sección correspondiente según el parámetro
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Configuración</h2>
        <Button onClick={handleSave} className="bg-blue-700 hover:bg-blue-800">
          Guardar Cambios
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-black/40 border border-blue-700/20 mb-6">
          <TabsTrigger value="general" className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500">
            <Settings className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="profile" className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500">
            <User className="mr-2 h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500"
          >
            <Lock className="mr-2 h-4 w-4" />
            Seguridad
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500"
          >
            <Bell className="mr-2 h-4 w-4" />
            Notificaciones
          </TabsTrigger>
        </TabsList>

        {/* Configuración General */}
        <TabsContent value="general" className="mt-0">
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
                  value={generalSettings.siteName}
                  onChange={handleGeneralChange}
                  className="bg-black/40 border-blue-700/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Descripción del Sitio</Label>
                <Input
                  id="siteDescription"
                  name="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={handleGeneralChange}
                  className="bg-black/40 border-blue-700/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Idioma Predeterminado</Label>
                <select
                  id="language"
                  name="language"
                  value={generalSettings.language}
                  onChange={handleGeneralChange}
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
                  checked={generalSettings.darkMode}
                  onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, darkMode: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración de Perfil */}
        <TabsContent value="profile" className="mt-0">
          <Card className="bg-black/40 border-blue-700/20">
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
              <CardDescription>Actualiza tu información de perfil y avatar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <img
                    src={profileSettings.avatar || "/placeholder.svg"}
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
                  value={profileSettings.name}
                  onChange={handleProfileChange}
                  className="bg-black/40 border-blue-700/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profileSettings.email}
                  onChange={handleProfileChange}
                  className="bg-black/40 border-blue-700/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">URL del Avatar</Label>
                <Input
                  id="avatar"
                  name="avatar"
                  value={profileSettings.avatar}
                  onChange={handleProfileChange}
                  className="bg-black/40 border-blue-700/20"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración de Seguridad */}
        <TabsContent value="security" className="mt-0">
          <Card className="bg-black/40 border-blue-700/20">
            <CardHeader>
              <CardTitle>Seguridad</CardTitle>
              <CardDescription>Actualiza tu contraseña y configura opciones de seguridad.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Contraseña Actual</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={securitySettings.currentPassword}
                  onChange={handleSecurityChange}
                  className="bg-black/40 border-blue-700/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={securitySettings.newPassword}
                  onChange={handleSecurityChange}
                  className="bg-black/40 border-blue-700/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={securitySettings.confirmPassword}
                  onChange={handleSecurityChange}
                  className="bg-black/40 border-blue-700/20"
                />
              </div>
              <Button className="w-full bg-blue-700 hover:bg-blue-800 mt-2">Cambiar Contraseña</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración de Notificaciones */}
        <TabsContent value="notifications" className="mt-0">
          <Card className="bg-black/40 border-blue-700/20">
            <CardHeader>
              <CardTitle>Notificaciones</CardTitle>
              <CardDescription>Configura tus preferencias de notificaciones.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Notificaciones por Email</Label>
                  <p className="text-sm text-slate-500">Recibir notificaciones por email</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="messageNotifications">Notificaciones de Mensajes</Label>
                  <p className="text-sm text-slate-500">Recibir notificaciones de nuevos mensajes</p>
                </div>
                <Switch
                  id="messageNotifications"
                  checked={notificationSettings.messageNotifications}
                  onCheckedChange={(checked) => handleNotificationChange("messageNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="updateNotifications">Notificaciones de Actualizaciones</Label>
                  <p className="text-sm text-slate-500">Recibir notificaciones sobre actualizaciones del sistema</p>
                </div>
                <Switch
                  id="updateNotifications"
                  checked={notificationSettings.updateNotifications}
                  onCheckedChange={(checked) => handleNotificationChange("updateNotifications", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
