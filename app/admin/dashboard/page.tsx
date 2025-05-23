"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Actualizar rutas de importación a la nueva estructura de carpetas
import AdminLayout from "@/components/admin/layout/admin-layout"
import ProjectsManager from "@/components/admin/managers/projects-manager"
import ContentEditor from "@/components/admin/managers/content-editor"
import SettingsPanel from "@/components/admin/managers/settings-panel"
import ImageManager from "@/components/admin/managers/image-manager"
import SkillsManager from "@/components/admin/managers/skills-manager"
import ExperienceManager from "@/components/admin/managers/experience-manager"
import { Code, FileText, FileImage, Settings, User, Briefcase } from "lucide-react"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("projects")
  // const [activeProjectType, setActiveProjectType] = useState("fullstack")
  const [activeSettingsSection, setActiveSettingsSection] = useState("general")
  const router = useRouter()
  const searchParams = useSearchParams()

  // Verificar autenticación al cargar la página
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn")
      if (!isLoggedIn) {
        router.push("/admin/login")
      } else {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  // Establecer la pestaña activa basada en los parámetros de URL
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && ["projects", "skills", "experience", "content", "images", "settings"].includes(tab)) {
      setActiveTab(tab)
    }

    // const type = searchParams.get("type")
    // if (type && ["fullstack", "backend"].includes(type)) {
    //   setActiveProjectType(type)
    // }

    const section = searchParams.get("section")
    if (section && ["general", "profile"].includes(section)) {
      setActiveSettingsSection(section)
    }
  }, [searchParams])

  // Actualizar la URL cuando cambia la pestaña
  const handleTabChange = (value: string) => {
    setActiveTab(value)

    // Actualizar la URL sin recargar la página
    const url = new URL(window.location.href)
    url.searchParams.set("tab", value)

    // Mantener el tipo de proyecto si estamos en la pestaña de proyectos
    // if (value === "projects") {
    //   url.searchParams.set("type", activeProjectType)
    // } else {
    url.searchParams.delete("type")
    // }

    // Mantener la sección de configuración si estamos en la pestaña de configuración
    if (value === "settings") {
      url.searchParams.set("section", activeSettingsSection)
    } else {
      url.searchParams.delete("section")
    }

    window.history.replaceState({}, "", url.toString())
  }

  // Actualizar el tipo de proyecto
  // const handleProjectTypeChange = (type: string) => {
  //   setActiveProjectType(type)

  //   const url = new URL(window.location.href)
  //   url.searchParams.set("type", type)
  //   window.history.replaceState({}, "", url.toString())
  // }

  // Actualizar la sección de configuración
  const handleSettingsSectionChange = (section: string) => {
    setActiveSettingsSection(section)

    const url = new URL(window.location.href)
    url.searchParams.set("section", section)
    window.history.replaceState({}, "", url.toString())
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16">
            <div className="w-full h-full border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-slate-400">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>

          {/* Navegación principal */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="bg-black/40 border border-blue-700/20 w-full justify-start overflow-x-auto">
              <TabsTrigger
                value="projects"
                className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500 flex items-center"
              >
                <Code className="mr-2 h-4 w-4" />
                Proyectos
              </TabsTrigger>
              <TabsTrigger
                value="skills"
                className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500 flex items-center"
              >
                <Code className="mr-2 h-4 w-4" />
                Habilidades
              </TabsTrigger>
              <TabsTrigger
                value="experience"
                className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500 flex items-center"
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Experiencia
              </TabsTrigger>
              <TabsTrigger
                value="content"
                className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500 flex items-center"
              >
                <FileText className="mr-2 h-4 w-4" />
                Contenido
              </TabsTrigger>
              <TabsTrigger
                value="images"
                className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500 flex items-center"
              >
                <FileImage className="mr-2 h-4 w-4" />
                Imágenes
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500 flex items-center"
              >
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Subnavegación para configuración */}
        {activeTab === "settings" && (
          <div className="mb-6">
            <Tabs value={activeSettingsSection} onValueChange={handleSettingsSectionChange} className="w-full">
              <TabsList className="bg-black/20 border border-blue-700/10 mb-4">
                <TabsTrigger
                  value="general"
                  className="data-[state=active]:bg-blue-700/10 data-[state=active]:text-blue-400 flex items-center"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  General
                </TabsTrigger>
                <TabsTrigger
                  value="profile"
                  className="data-[state=active]:bg-blue-700/10 data-[state=active]:text-blue-400 flex items-center"
                >
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}

        {/* Contenido principal */}
        <div className="bg-black/20 border border-blue-700/20 rounded-lg p-6">
          {activeTab === "projects" && <ProjectsManager />}
          {activeTab === "skills" && <SkillsManager />}
          {activeTab === "experience" && <ExperienceManager />}
          {activeTab === "content" && <ContentEditor />}
          {activeTab === "images" && <ImageManager />}
          {activeTab === "settings" && <SettingsPanel section={activeSettingsSection} />}
        </div>
      </div>
    </AdminLayout>
  )
}
