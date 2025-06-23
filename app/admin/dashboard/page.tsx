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
        // Función auxiliar para obtener valor de una cookie por su nombre
        const getCookie = (name: string): string | null => {
          if (typeof document === 'undefined') return null;
          const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
          return match ? match[2] : null;
        };
        
        // Verificar autenticación tanto en cookies como en sessionStorage
        const isLoggedInCookie = getCookie('isLoggedIn');
        const isLoggedInSession = sessionStorage.getItem("isLoggedIn");
        const adminUserCookie = getCookie('adminUser');
        const adminUserSession = sessionStorage.getItem("adminUser");
        const tokenCookie = getCookie('authToken');
        const tokenSession = sessionStorage.getItem("token");
        
        console.log("Dashboard: Estado de sesión:");
        console.log("- Cookie isLoggedIn:", isLoggedInCookie);
        console.log("- Session isLoggedIn:", isLoggedInSession);
        console.log("- Cookie adminUser:", adminUserCookie);
        console.log("- Session adminUser:", adminUserSession);
        console.log("- Token en cookie:", !!tokenCookie);
        console.log("- Token en session:", !!tokenSession);
        
        // Considerar autenticado si está en cookies O en sessionStorage
        const isAuthenticated = isLoggedInCookie === 'true' || isLoggedInSession === 'true';
        
        if (!isAuthenticated) {
          console.log("Dashboard: No hay sesión válida, redirigiendo a login...");
          router.push("/admin/login");
        } else {
          console.log("Dashboard: Sesión válida, mostrando dashboard...");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Dashboard: Error al verificar autenticación:", error);
        // Si hay un error al acceder a cookies/sessionStorage, intentamos mostrar el dashboard
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
