"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Code2, Server, ImageIcon } from "lucide-react"
import { useContent } from "@/contexts/content-context"
import { useToast } from "@/hooks/use-toast"
import type { Project } from "@/contexts/content-context"

export default function ProjectsManager() {
  const {
    content,
    isLoading,
    // Usar los nuevos métodos específicos para proyectos
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

  // Función para actualizar un proyecto
  const updateProject = (updatedProject: Project) => {
    if (activeTab === "fullstack") {
      const updatedProjects = fullstackProjects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project,
      )
      setFullstackProjects(updatedProjects)
    } else {
      const updatedProjects = backendProjects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project,
      )
      setBackendProjects(updatedProjects)
    }

    setSelectedProject(updatedProject)
  }

  // Función para manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!selectedProject) return

    const { name, value } = e.target

    if (name === "tags") {
      // Convertir la cadena de etiquetas separadas por comas en un array
      const tagsArray = value.split(",").map((tag) => tag.trim())
      updateProject({
        ...selectedProject,
        tags: tagsArray,
      })
    } else {
      updateProject({
        ...selectedProject,
        [name]: value,
      })
    }
  }

  // Función para guardar al salir del modo edición - Actualizada para usar updateProjectItem
  const handleSaveEdit = async () => {
    if (!selectedProject) return

    const category = activeTab as 'fullstack' | 'backend'
    const success = await updateProjectItem(selectedProject.id.toString(), selectedProject, category)

    setEditMode(false)

    if (success) {
      // Disparar un evento específico para proyectos
      if (typeof window !== "undefined") {
        const event = new CustomEvent("projectsUpdated", {
          detail: {
            fullstack: content.projects.fullstack,
            backend: content.projects.backend,
          },
        })
        window.dispatchEvent(event)
      }

      toast({
        title: "Cambios guardados",
        description: "Los cambios han sido guardados correctamente.",
        variant: "default",
      })
    } else {
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios. Intenta de nuevo.",
        variant: "destructive",
      })
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestor de Proyectos</h2>
        <div className="flex gap-2">
          <Button onClick={addNewProject} className="bg-blue-700 hover:bg-blue-800">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Proyecto
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-black/40 border border-blue-700/20 mb-6">
          <TabsTrigger
            value="fullstack"
            className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500"
          >
            <Code2 className="mr-2 h-4 w-4" />
            Full Stack
          </TabsTrigger>
          <TabsTrigger value="backend" className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500">
            <Server className="mr-2 h-4 w-4" />
            Backend
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fullstack" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <Card className="bg-black/40 border-blue-700/20">
                <CardHeader>
                  <CardTitle>Proyectos Full Stack</CardTitle>
                  <CardDescription>Selecciona un proyecto para editarlo o añade uno nuevo.</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                    {fullstackProjects.length > 0 ? (
                      fullstackProjects
                        .sort((a, b) => b.id - a.id) // Ordenar por ID descendente
                        .map((project) => (
                          <div
                            key={project.id}
                            className={`p-3 rounded-md cursor-pointer relative group ${selectedProject?.id === project.id
                                ? "bg-blue-900/30 border border-blue-500"
                                : "bg-black/20 border border-blue-700/20 hover:border-blue-700/50"
                              }`}
                            onClick={() => {
                              setSelectedProject(project)
                              setEditMode(false)
                            }}
                          >
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium text-sm truncate pr-8">{project.title}</h3>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 p-1 absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteProject(project.id)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-xs text-slate-400 truncate">{project.description}</p>
                          </div>
                        ))
                    ) : (
                      <p className="text-center text-slate-400 py-4">No hay proyectos</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-3">
              <Card className="bg-black/40 border-blue-700/20">
                <CardHeader>
                  <CardTitle>
                    {editMode
                      ? "Editar Proyecto"
                      : selectedProject
                        ? "Detalles del Proyecto"
                        : "Selecciona un Proyecto"}
                  </CardTitle>
                  <CardDescription>
                    {editMode
                      ? "Modifica los detalles del proyecto seleccionado."
                      : "Visualiza los detalles del proyecto o haz clic en editar."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {selectedProject ? (
                    <div className="space-y-4">
                      {!editMode && (
                        <div className="flex justify-end">
                          <Button
                            onClick={() => setEditMode(true)}
                            variant="outline"
                            className="border-blue-700/50 text-blue-500 hover:bg-blue-700/10"
                          >
                            Editar
                          </Button>
                        </div>
                      )}

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Título</Label>
                          <Input
                            id="title"
                            name="title"
                            value={selectedProject.title}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className="bg-black/40 border-blue-700/20"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Descripción</Label>
                          <Textarea
                            id="description"
                            name="description"
                            value={selectedProject.description}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className="min-h-[100px] bg-black/40 border-blue-700/20"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="image">URL de la Imagen</Label>
                          <div className="flex gap-2">
                            <Input
                              id="image"
                              name="image"
                              value={selectedProject.image || ""}
                              onChange={handleInputChange}
                              disabled={!editMode}
                              className="bg-black/40 border-blue-700/20"
                              placeholder="https://ejemplo.com/imagen.jpg"
                            />
                            {selectedProject.image && (
                              <Button
                                variant="outline"
                                size="icon"
                                className="border-blue-700/50 text-blue-500 hover:bg-blue-700/10"
                                onClick={() => window.open(selectedProject.image, "_blank")}
                              >
                                <ImageIcon className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <p className="text-xs text-slate-400">
                            URL de la imagen del proyecto. Deja en blanco para proyectos backend.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="tags">Etiquetas (separadas por comas)</Label>
                          <Input
                            id="tags"
                            name="tags"
                            value={selectedProject.tags.join(", ")}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className="bg-black/40 border-blue-700/20"
                            placeholder="React, Node.js, MongoDB"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="github">URL de GitHub</Label>
                            <Input
                              id="github"
                              name="github"
                              value={selectedProject.github}
                              onChange={handleInputChange}
                              disabled={!editMode}
                              className="bg-black/40 border-blue-700/20"
                              placeholder="https://github.com/usuario/proyecto"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="demo">URL de Demo/Docs</Label>
                            <Input
                              id="demo"
                              name="demo"
                              value={selectedProject.demo}
                              onChange={handleInputChange}
                              disabled={!editMode}
                              className="bg-black/40 border-blue-700/20"
                              placeholder="https://demo.ejemplo.com"
                            />
                          </div>
                        </div>

                        {editMode && (
                          <div className="flex justify-end pt-4">
                            <Button onClick={handleSaveEdit} className="bg-blue-700 hover:bg-blue-800">
                              Guardar
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-slate-400 mb-4">No hay ningún proyecto seleccionado.</p>
                      <Button onClick={addNewProject} className="bg-blue-700 hover:bg-blue-800">
                        <Plus className="mr-2 h-4 w-4" />
                        Crear Nuevo Proyecto
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="backend" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <Card className="bg-black/40 border-blue-700/20">
                <CardHeader>
                  <CardTitle>Proyectos Backend</CardTitle>
                  <CardDescription>Selecciona un proyecto para editarlo o añade uno nuevo.</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                    {backendProjects.length > 0 ? (
                      backendProjects
                        .sort((a, b) => parseInt(b.id.toString()) - parseInt(a.id.toString())) // Ordenar por ID descendente
                        .map((project) => (
                          <div
                            key={project.id}
                            className={`p-3 rounded-md cursor-pointer relative group ${selectedProject?.id === project.id
                                ? "bg-blue-900/30 border border-blue-500"
                                : "bg-black/20 border border-blue-700/20 hover:border-blue-700/50"
                              }`}
                            onClick={() => {
                              setSelectedProject(project)
                              setEditMode(false)
                            }}
                          >
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium text-sm truncate pr-8">{project.title}</h3>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 p-1 absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteProject(project.id)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-xs text-slate-400 truncate">{project.description}</p>
                          </div>
                        ))
                    ) : (
                      <p className="text-center text-slate-400 py-4">No hay proyectos</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-3">
              <Card className="bg-black/40 border-blue-700/20">
                <CardHeader>
                  <CardTitle>
                    {editMode
                      ? "Editar Proyecto"
                      : selectedProject
                        ? "Detalles del Proyecto"
                        : "Selecciona un Proyecto"}
                  </CardTitle>
                  <CardDescription>
                    {editMode
                      ? "Modifica los detalles del proyecto seleccionado."
                      : "Visualiza los detalles del proyecto o haz clic en editar."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {selectedProject ? (
                    <div className="space-y-4">
                      {!editMode && (
                        <div className="flex justify-end">
                          <Button
                            onClick={() => setEditMode(true)}
                            variant="outline"
                            className="border-blue-700/50 text-blue-500 hover:bg-blue-700/10"
                          >
                            Editar
                          </Button>
                        </div>
                      )}

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Título</Label>
                          <Input
                            id="title"
                            name="title"
                            value={selectedProject.title}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className="bg-black/40 border-blue-700/20"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Descripción</Label>
                          <Textarea
                            id="description"
                            name="description"
                            value={selectedProject.description}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className="min-h-[100px] bg-black/40 border-blue-700/20"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="tags">Etiquetas (separadas por comas)</Label>
                          <Input
                            id="tags"
                            name="tags"
                            value={selectedProject.tags.join(", ")}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className="bg-black/40 border-blue-700/20"
                            placeholder="Node.js, Express, JWT, PostgreSQL"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="github">URL de GitHub</Label>
                            <Input
                              id="github"
                              name="github"
                              value={selectedProject.github}
                              onChange={handleInputChange}
                              disabled={!editMode}
                              className="bg-black/40 border-blue-700/20"
                              placeholder="https://github.com/usuario/proyecto"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="demo">URL de Documentación</Label>
                            <Input
                              id="demo"
                              name="demo"
                              value={selectedProject.demo}
                              onChange={handleInputChange}
                              disabled={!editMode}
                              className="bg-black/40 border-blue-700/20"
                              placeholder="https://docs.ejemplo.com"
                            />
                          </div>
                        </div>

                        {editMode && (
                          <div className="flex justify-end pt-4">
                            <Button onClick={handleSaveEdit} className="bg-blue-700 hover:bg-blue-800">
                              Guardar
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-slate-400 mb-4">No hay ningún proyecto seleccionado.</p>
                      <Button onClick={addNewProject} className="bg-blue-700 hover:bg-blue-800">
                        <Plus className="mr-2 h-4 w-4" />
                        Crear Nuevo Proyecto
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
