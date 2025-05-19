"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
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

// Tipos de categorías de proyectos
type ProjectCategory = 'fullstack' | 'backend';

export default function ProjectsManager() {
  const {
    content,
    isLoading,
    createProjectItem,
    updateProjectItem,
    deleteProjectItem
  } = useContent()

  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<ProjectCategory>("fullstack")
  const [fullstackProjects, setFullstackProjects] = useState<Project[]>(content.projects.fullstack || [])
  const [backendProjects, setBackendProjects] = useState<Project[]>(content.projects.backend || [])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [editMode, setEditMode] = useState(false)
  
  // Guardar el último proyecto seleccionado para cada categoría
  const [lastSelectedFullstack, setLastSelectedFullstack] = useState<Project | null>(null)
  const [lastSelectedBackend, setLastSelectedBackend] = useState<Project | null>(null)
  const [isTabChanging, setIsTabChanging] = useState(false)

  // Obtener los proyectos actuales según la categoría activa
  const currentProjects = activeTab === "fullstack" ? fullstackProjects : backendProjects;
  
  // Obtener el último proyecto seleccionado según la categoría activa
  const lastSelected = activeTab === "fullstack" ? lastSelectedFullstack : lastSelectedBackend;
  
  // Función para establecer el último proyecto seleccionado según la categoría
  const setLastSelected = useCallback((project: Project | null) => {
    if (activeTab === "fullstack") {
      setLastSelectedFullstack(project);
    } else {
      setLastSelectedBackend(project);
    }
  }, [activeTab]);

  // Cargar proyectos desde el contexto
  useEffect(() => {
    setFullstackProjects(content.projects.fullstack || [])
    setBackendProjects(content.projects.backend || [])
  }, [content.projects])

  // Efecto para manejar la selección de proyectos y cambios de pestaña
  useEffect(() => {
    // Si el proyecto seleccionado cambia (no por cambio de pestaña), actualizar el último seleccionado
    if (selectedProject && !isTabChanging) {
      setLastSelected(selectedProject);
    }

    // Si estamos cambiando de pestaña, restaurar el proyecto guardado o seleccionar el primero
    if (isTabChanging) {
      // Verificar si el último proyecto seleccionado todavía existe en la lista
      const lastProjectExists = lastSelected && 
        currentProjects.some(p => p.id === lastSelected.id);
      
      if (lastProjectExists) {
        // Restaurar el último proyecto seleccionado
        setSelectedProject(lastSelected);
      } else if (currentProjects.length > 0) {
        // Si no hay último proyecto o ya no existe, seleccionar el primero
        setSelectedProject(currentProjects[0]);
      } else {
        setSelectedProject(null);
      }
      
      // Resetear el modo de edición al cambiar de pestaña
      setEditMode(false);
      
      // Resetear la bandera después de procesar el cambio de pestaña
      setIsTabChanging(false);
    }
  }, [activeTab, selectedProject, isTabChanging, currentProjects, lastSelected, setLastSelected]);

  // Función personalizada para cambiar de pestaña
  const handleTabChange = useCallback((value: string) => {
    setIsTabChanging(true);
    setActiveTab(value as ProjectCategory);
  }, []);

  // Función para mostrar notificaciones toast
  const showToast = useCallback((title: string, description: string, isError = false) => {
    toast({
      title,
      description,
      variant: isError ? "destructive" : "default",
    });
  }, [toast]);

  // Función para añadir un nuevo proyecto
  const addNewProject = useCallback(async () => {
    const currentDate = new Date().toISOString().split("T")[0];
    
    // Preparar datos del nuevo proyecto
    const newProjectData = {
      title: activeTab === "fullstack" ? "Nuevo Proyecto Full Stack" : "Nuevo Proyecto Backend",
      description: "Descripción del proyecto",
      tags: ["Tag 1", "Tag 2"],
      github: "#",
      demo: "#",
      createdAt: currentDate,
      image: activeTab === "fullstack" ? "/placeholder.svg?height=400&width=600" : undefined
    };

    // Llamar al método del contexto para crear el proyecto
    const newProject = await createProjectItem(newProjectData, activeTab);

    if (newProject) {
      setSelectedProject(newProject);
      setEditMode(true);
      showToast(
        "Proyecto añadido",
        "Se ha añadido un nuevo proyecto. Edítalo para personalizarlo."
      );
    } else {
      showToast(
        "Error",
        "No se pudo crear el proyecto. Intenta de nuevo.",
        true
      );
    }
  }, [activeTab, createProjectItem, showToast]);

  // Función para eliminar un proyecto
  const deleteProject = useCallback(async (id: number) => {
    const success = await deleteProjectItem(id.toString(), activeTab);

    if (success) {
      // Actualizar la selección si el proyecto eliminado era el seleccionado
      if (selectedProject && selectedProject.id === id) {
        // Determinar qué proyectos quedan después de la eliminación
        const remainingProjects = currentProjects.filter(p => p.id !== id);
        // Seleccionar otro proyecto o establecer a null
        setSelectedProject(remainingProjects.length > 0 ? remainingProjects[0] : null);
      }
      
      showToast(
        "Proyecto eliminado",
        "El proyecto ha sido eliminado correctamente."
      );
    } else {
      showToast(
        "Error",
        "No se pudo eliminar el proyecto. Intenta de nuevo.",
        true
      );
    }
  }, [activeTab, currentProjects, deleteProjectItem, selectedProject, showToast]);

  // Función para manejar el guardado de la edición
  const handleSaveEdit = useCallback(async (updatedProject: Project) => {
    const success = await updateProjectItem(updatedProject.id.toString(), updatedProject, activeTab);

    if (success) {
      setSelectedProject(updatedProject);
      setEditMode(false);
      showToast(
        "Proyecto actualizado",
        "El proyecto ha sido actualizado correctamente."
      );
    } else {
      showToast(
        "Error",
        "No se pudo actualizar el proyecto. Intenta de nuevo.",
        true
      );
    }
  }, [activeTab, updateProjectItem, showToast]);

  // Renderizar los componentes de tabla y formulario para la pestaña actual
  const renderProjectContent = (category: ProjectCategory, title: string, description: string) => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <ProjectsTable
          projects={category === "fullstack" ? fullstackProjects : backendProjects}
          selectedProject={selectedProject}
          onSelectProject={setSelectedProject}
          onDeleteProject={deleteProject}
          title={title}
          description={description}
        />
      </div>
      <div className="md:col-span-3">
        <ProjectForm
          project={selectedProject}
          editMode={editMode}
          setEditMode={setEditMode}
          onSave={handleSaveEdit}
        />
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestor de Proyectos</h2>
        <Button onClick={addNewProject} className="bg-blue-700 hover:bg-blue-800">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Proyecto
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="bg-black/40 border border-blue-700/20 mb-6">
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

        <TabsContent value="fullstack" className="mt-0">
          {renderProjectContent("fullstack", "Proyectos Full Stack", "Selecciona un proyecto para editarlo o añade uno nuevo.")}
        </TabsContent>

        <TabsContent value="backend" className="mt-0">
          {renderProjectContent("backend", "Proyectos Backend", "APIs, servicios y aplicaciones de servidor.")}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
