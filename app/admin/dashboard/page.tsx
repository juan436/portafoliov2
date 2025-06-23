"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Actualizar rutas de importación a la nueva estructura de carpetas
import AdminLayout from "@/components/admin/layout/admin-layout"
import ProjectsManager from "@/components/admin/managers/projects-manager"
import ContentEditor from "@/components/admin/managers/content-editor"
import ImageManager from "@/components/admin/managers/image-manager"
import SkillsManager from "@/components/admin/managers/skills-manager"
import ExperienceManager from "@/components/admin/managers/experience-manager"
import { Code, FileText, FileImage, Settings, User, Briefcase } from "lucide-react"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("projects")
  const router = useRouter()
  const searchParams = useSearchParams()

  // Verificar autenticación al cargar la página
  useEffect(() => {
    const checkAuth = () => {
      console.log("Dashboard: Verificando autenticación...");
      
      try {
        const isLoggedIn = sessionStorage.getItem("isLoggedIn");
        console.log("Dashboard: Estado de isLoggedIn:", isLoggedIn);
        const adminUser = sessionStorage.getItem("adminUser");
        console.log("Dashboard: Usuario admin:", adminUser);
        const token = sessionStorage.getItem("token");
        console.log("Dashboard: Token existe:", !!token);
        
        if (!isLoggedIn) {
          console.log("Dashboard: No hay sesión, redirigiendo a login...");
          router.push("/admin/login");
        } else {
          console.log("Dashboard: Sesión válida, mostrando dashboard...");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Dashboard: Error al verificar autenticación:", error);
        // Si hay un error al acceder a sessionStorage, tratemos de mostrar el dashboard de todos modos
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router])

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && ["projects", "skills", "experience", "content", "images"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleTabChange = (value: string) => {
    setActiveTab(value)

    const url = new URL(window.location.href)
    url.searchParams.set("tab", value)

    url.searchParams.delete("type")
    url.searchParams.delete("section")

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
            <TabsList className="bg-black/40 border border-blue-700/20 w-full justify-start flex-wrap">
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
            </TabsList>
          </Tabs>
        </div>

        {/* Contenido principal */}
        <div className="bg-black/20 border border-blue-700/20 rounded-lg p-6">
          {activeTab === "projects" && <ProjectsManager />}
          {activeTab === "skills" && <SkillsManager />}
          {activeTab === "experience" && <ExperienceManager />}
          {activeTab === "content" && <ContentEditor />}
          {activeTab === "images" && <ImageManager />}
        </div>
      </div>
    </AdminLayout>
  )
}
