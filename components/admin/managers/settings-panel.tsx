"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Settings, User, Lock, Bell } from "lucide-react"

// Importar los componentes de formularios extraídos
import GeneralSettingsForm, { GeneralSettings } from "@/components/admin/forms/general-settings-form"
import ProfileSettingsForm, { ProfileSettings } from "@/components/admin/forms/profile-settings-form"
import SecuritySettingsForm, { SecuritySettings } from "@/components/admin/forms/security-settings-form"
import NotificationSettingsForm, { NotificationSettings } from "@/components/admin/forms/notification-settings-form"

// Añadir prop para la sección de configuración
interface SettingsPanelProps {
  section?: string
}

export default function SettingsPanel({ section = "general" }: SettingsPanelProps) {
  // Estados para cada tipo de configuración
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    siteName: "Juan Villegas Portfolio",
    siteDescription: "Desarrollador Full Stack especializado en React, Node.js y más tecnologías web.",
    language: "es",
    darkMode: true,
  })

  const [profileSettings, setProfileSettings] = useState<ProfileSettings>({
    name: "Juan Villegas",
    email: "admin@example.com",
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile-E9YRocD6o4olhnzraHWCjLmKjCbspw.jpeg",
  })

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    messageNotifications: true,
    updateNotifications: false,
  })

  // Guardar cambios
  const handleSave = () => {
    // Aquí implementarías la lógica para guardar los cambios en tu backend
    alert("Configuración guardada correctamente")
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Configuración</h2>
        <Button onClick={handleSave} className="bg-blue-700 hover:bg-blue-800">
          Guardar Cambios
        </Button>
      </div>

      <Tabs defaultValue={section} className="w-full">
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

        {/* Formularios de configuración */}
        <TabsContent value="general" className="mt-0">
          <GeneralSettingsForm 
            settings={generalSettings} 
            onChange={setGeneralSettings} 
          />
        </TabsContent>

        <TabsContent value="profile" className="mt-0">
          <ProfileSettingsForm 
            settings={profileSettings} 
            onChange={setProfileSettings} 
          />
        </TabsContent>

        <TabsContent value="security" className="mt-0">
          <SecuritySettingsForm 
            settings={securitySettings} 
            onChange={setSecuritySettings} 
            onSave={handleSave}
          />
        </TabsContent>

        <TabsContent value="notifications" className="mt-0">
          <NotificationSettingsForm 
            settings={notificationSettings} 
            onChange={setNotificationSettings} 
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
