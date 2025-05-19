"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, Code2, Server } from "lucide-react"
import { useContent } from "@/contexts/content-context"
import { useToast } from "@/hooks/use-toast"
import type { Project } from "@/contexts/content-context"

// Importar los componentes extraídos
import ProjectForm from "@/components/admin/forms/project-form"
import ProjectsTable from "@/components/admin/tables/projects-table"

export default function ProjectsManager() {
  const {
    content,
    isLoading,
    // Usar los métodos específicos para proyectos
    createProjectItem,
    updateProjectItem,
    deleteProjectItem
  } = useContent()

  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("fullstack")
  const [fullstackProjects, setFullstackProjects] = useState<Project[]>(content.projects.fullstack || [])
  const [backendProjects, setBackendProjects] = useState<Project[]>(content.projects.backend || [])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [editMode, setEditMode] = useState(false)

  // Cargar proyectos desde el contexto
  useEffect(() => {
    setFullstackProjects(content.projects.fullstack || [])
    setBackendProjects(content.projects.backend || [])
  }, [content.projects])

  // Seleccionar el primer proyecto por defecto si hay proyectos disponibles
  useEffect(() => {
    if (activeTab === "fullstack" && fullstackProjects.length > 0 && !selectedProject) {
      setSelectedProject(fullstackProjects[0])
    } else if (activeTab === "backend" && backendProjects.length > 0 && !selectedProject) {
      setSelectedProject(backendProjects[0])
    }
  }, [activeTab, fullstackProjects, backendProjects, selectedProject])

  // Función para añadir un nuevo proyecto - Actualizada para usar createProjectItem
  const addNewProject = async () => {
    const currentDate = new Date().toISOString().split("T")[0]
    
    // Preparar datos del nuevo proyecto
    const newProjectData = {
      title: activeTab === "fullstack" ? "Nuevo Proyecto Full Stack" : "Nuevo Proyecto Backend",
      description: "Descripción del proyecto",
      tags: ["Tag 1", "Tag 2"],
      github: "#",
      demo: "#",
      createdAt: currentDate,
      image: activeTab === "fullstack" ? "/placeholder.svg?height=400&width=600" : undefined
    }

    const category = activeTab as 'fullstack' | 'backend'

    // Llamar al método del contexto para crear el proyecto
    const newProject = await createProjectItem(newProjectData, category)

    if (newProject) {
      setSelectedProject(newProject)
      setEditMode(true)
      
      toast({
        title: "Proyecto añadido",
        description: "Se ha añadido un nuevo proyecto. Edítalo para personalizarlo.",
        variant: "default",
      })
    } else {
      toast({
        title: "Error",
        description: "No se pudo crear el proyecto. Intenta de nuevo.",
        variant: "destructive",
      })
    }
  }

  // Función para eliminar un proyecto - Actualizada para usar deleteProjectItem
  const deleteProject = async (id: number) => {
    const category = activeTab as 'fullstack' | 'backend'
    const success = await deleteProjectItem(id.toString(), category)

    if (success) {
      // Actualizar la selección si el proyecto eliminado era el seleccionado
      if (selectedProject && selectedProject.id === id) {
        // Determinar qué proyectos quedan después de la eliminación
        const remainingProjects = category === 'fullstack'
          ? fullstackProjects.filter(p => p.id !== id)
          : backendProjects.filter(p => p.id !== id)

        // Seleccionar otro proyecto o establecer a null
        setSelectedProject(remainingProjects.length > 0 ? remainingProjects[0] : null)
      }
      
      toast({
        title: "Proyecto eliminado",
        description: "El proyecto ha sido eliminado correctamente.",
        variant: "default",
      })
    } else {
      toast({
        title: "Error",
        description: "No se pudo eliminar el proyecto. Intenta de nuevo.",
        variant: "destructive",
      })
    }
  }

  // Función para manejar el guardado de la edición
  const handleSaveEdit = async (updatedProject: Project) => {
    const category = activeTab as 'fullstack' | 'backend'
    const success = await updateProjectItem(updatedProject.id.toString(), updatedProject, category)

    if (success) {
      setSelectedProject(updatedProject)
      setEditMode(false)

      toast({
        title: "Proyecto actualizado",
        description: "El proyecto ha sido actualizado correctamente.",
        variant: "default",
      })
    } else {
      toast({
        title: "Error",
        description: "No se pudo actualizar el proyecto. Intenta de nuevo.",
        variant: "destructive",
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestión de Proyectos</h2>
        <Button onClick={addNewProject} className="bg-blue-700 hover:bg-blue-800">
          <Plus className="mr-2 h-4 w-4" />
          Añadir Proyecto
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-black/40 border border-blue-700/20">
          <TabsTrigger
            value="fullstack"
            className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500 flex items-center"
          >
            <Code2 className="mr-2 h-4 w-4" />
            Full Stack
          </TabsTrigger>
          <TabsTrigger
            value="backend"
            className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500 flex items-center"
          >
            <Server className="mr-2 h-4 w-4" />
            Backend
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
          <div className="md:col-span-3">
            <TabsContent value="fullstack" className="m-0">
              <ProjectsTable
                projects={fullstackProjects}
                selectedProject={selectedProject}
                onSelectProject={setSelectedProject}
                onDeleteProject={deleteProject}
                title="Proyectos Full Stack"
                description="Proyectos que incluyen frontend y backend."
              />
            </TabsContent>
            <TabsContent value="backend" className="m-0">
              <ProjectsTable
                projects={backendProjects}
                selectedProject={selectedProject}
                onSelectProject={setSelectedProject}
                onDeleteProject={deleteProject}
                title="Proyectos Backend"
                description="APIs, servicios y aplicaciones de servidor."
              />
            </TabsContent>
          </div>

          <div className="md:col-span-4">
                <ProjectForm
                  project={selectedProject}
              editMode={editMode}
              setEditMode={setEditMode}
                  onSave={handleSaveEdit}
                />
            </div>
        </div>
      </Tabs>
    </motion.div>
  )
}
