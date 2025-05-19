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

import ProjectForm from "@/components/admin/forms/project-form"
import ProjectsTable from "@/components/admin/tables/projects-table"

type ProjectCategory = 'fullstack' | 'backend';

export default function ProjectsManager() {
  const { content, createProjectItem, updateProjectItem, deleteProjectItem } = useContent()
  const { toast } = useToast()
  
  const [activeTab, setActiveTab] = useState<ProjectCategory>("fullstack")
  const [fullstackProjects, setFullstackProjects] = useState<Project[]>(content.projects.fullstack || [])
  const [backendProjects, setBackendProjects] = useState<Project[]>(content.projects.backend || [])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [lastSelectedFullstack, setLastSelectedFullstack] = useState<Project | null>(null)
  const [lastSelectedBackend, setLastSelectedBackend] = useState<Project | null>(null)
  const [isTabChanging, setIsTabChanging] = useState(false)
  const [isCreatingNewProject, setIsCreatingNewProject] = useState(false)

  const currentProjects = activeTab === "fullstack" ? fullstackProjects : backendProjects;
  const lastSelected = activeTab === "fullstack" ? lastSelectedFullstack : lastSelectedBackend;
  
  const setLastSelected = useCallback((project: Project | null) => {
    if (activeTab === "fullstack") {
      setLastSelectedFullstack(project);
    } else {
      setLastSelectedBackend(project);
    }
  }, [activeTab]);

  useEffect(() => {
    setFullstackProjects(content.projects.fullstack || []);
    setBackendProjects(content.projects.backend || []);
  }, [content.projects]);

  useEffect(() => {
    if (selectedProject && !isTabChanging) {
      setLastSelected(selectedProject);
    }

    if (isTabChanging) {
      const lastProjectExists = lastSelected && 
        currentProjects.some(p => p.id === lastSelected.id);
      
      setSelectedProject(lastProjectExists ? lastSelected : null);
      setEditMode(false);
      setIsTabChanging(false);
    }
  }, [activeTab, selectedProject, isTabChanging, currentProjects, lastSelected, setLastSelected]);

  const handleTabChange = useCallback((value: string) => {
    setIsTabChanging(true);
    setActiveTab(value as ProjectCategory);
  }, []);

  const showToast = useCallback((title: string, description: string, isError = false) => {
    toast({
      title,
      description,
      variant: isError ? "destructive" : "default",
    });
  }, [toast]);

  const addNewProject = useCallback(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    
    // Crear un objeto de proyecto temporal mínimo
    // Los valores predeterminados se manejan en el ProjectForm
    const newProjectTemplate: Project = {
      id: -1, // ID temporal negativo para indicar que es un proyecto nuevo
      createdAt: currentDate,
      // Solo definimos la imagen para proyectos fullstack para mantener la consistencia visual
      image: activeTab === "fullstack" ? "/placeholder.svg?height=400&width=600" : undefined
    };

    // Establecer el modo de creación
    setIsCreatingNewProject(true);
    
    // Seleccionar el proyecto temporal y activar el modo de edición
    setSelectedProject(newProjectTemplate);
    setEditMode(true);
  }, [activeTab]);

  const handleSaveEdit = useCallback(async (updatedProject: Project) => {
    // Si estamos creando un nuevo proyecto
    if (isCreatingNewProject) {
      const newProject = await createProjectItem(updatedProject, activeTab);
      
      if (newProject) {
        setSelectedProject(newProject);
        setEditMode(false);
        setIsCreatingNewProject(false);
        showToast("Proyecto creado", "El proyecto ha sido creado correctamente.");
        
        // Actualizar la lista de proyectos correspondiente
        if (activeTab === "fullstack") {
          setFullstackProjects(prev => [...prev, newProject]);
        } else {
          setBackendProjects(prev => [...prev, newProject]);
        }
      } else {
        showToast("Error", "No se pudo crear el proyecto. Intenta de nuevo.", true);
      }
    } 
    // Si estamos editando un proyecto existente
    else {
      const success = await updateProjectItem(updatedProject.id.toString(), updatedProject, activeTab);

      if (success) {
        setSelectedProject(updatedProject);
        setEditMode(false);
        showToast("Proyecto actualizado", "El proyecto ha sido actualizado correctamente.");
      } else {
        showToast("Error", "No se pudo actualizar el proyecto. Intenta de nuevo.", true);
      }
    }
  }, [activeTab, createProjectItem, updateProjectItem, showToast, isCreatingNewProject]);

  const handleCancelEdit = useCallback(() => {
    if (isCreatingNewProject) {
      // Si estamos creando un nuevo proyecto, simplemente descartamos el proyecto temporal
      setSelectedProject(null);
      setIsCreatingNewProject(false);
    }
    
    setEditMode(false);
  }, [isCreatingNewProject]);

  const deleteProject = useCallback(async (id: number) => {
    const success = await deleteProjectItem(id.toString(), activeTab);

    if (success) {
      if (selectedProject && selectedProject.id === id) {
        const remainingProjects = currentProjects.filter(p => p.id !== id);
        setSelectedProject(remainingProjects.length > 0 ? remainingProjects[0] : null);
      }
      
      showToast("Proyecto eliminado", "El proyecto ha sido eliminado correctamente.");
    } else {
      showToast("Error", "No se pudo eliminar el proyecto. Intenta de nuevo.", true);
    }
  }, [activeTab, currentProjects, deleteProjectItem, selectedProject, showToast]);

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
          onCancel={handleCancelEdit}
          isNewProject={isCreatingNewProject}
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
