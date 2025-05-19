"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ImageIcon, X } from "lucide-react"
import type { Project } from "@/contexts/content-context"

interface ProjectFormProps {
  project: Project | null
  editMode: boolean
  setEditMode: (value: boolean) => void
  onSave: (project: Project) => void
  onCancel?: () => void
  isNewProject?: boolean
}

export default function ProjectForm({ 
  project, 
  editMode, 
  setEditMode, 
  onSave,
  onCancel,
  isNewProject = false
}: ProjectFormProps) {
  const [formData, setFormData] = useState<Project | null>(project)
  const [emptyFields, setEmptyFields] = useState<Record<string, boolean>>({})

  // Actualizar el formData cuando cambia el proyecto seleccionado
  useEffect(() => {
    if (isNewProject && project) {
      const emptyProject = { ...project };
      emptyProject.title = '';
      emptyProject.description = '';
      emptyProject.github = '';
      emptyProject.demo = '';
      emptyProject.tags = [];
      setFormData(emptyProject);
    } else {
      setFormData(project);
    }
    
    // Resetear los campos vacíos cuando cambia el proyecto
    setEmptyFields({});
  }, [project, isNewProject]);

  // Manejar cambios en los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    setEmptyFields(prev => ({
      ...prev,
      [name]: value.trim() === ''
    }))
    
    if (name === "tags") {
      setFormData((prev) => prev ? { ...prev, [name]: value } : null)
    } else {
      setFormData((prev) => prev ? { ...prev, [name]: value } : null)
    }
  }

  // Guardar los cambios
  const handleSave = () => {
    if (formData) {
      const processedData = { ...formData };
      
      if (typeof processedData.tags === 'string') {
        processedData.tags = processedData.tags.split(',')
          .map(tag => tag.trim())
          .filter(Boolean)
      }
      
      if (isNewProject) {
        const currentDate = new Date().toISOString().split("T")[0];
        
        if (!processedData.title) {
          processedData.title = project?.title || "Nuevo Proyecto";
        }
        if (!processedData.description) {
          processedData.description = project?.description || "Descripción del proyecto";
        }
        if (!processedData.github) {
          processedData.github = project?.github || "#";
        }
        if (!processedData.demo) {
          processedData.demo = project?.demo || "#";
        }
        if (!processedData.tags || processedData.tags.length === 0) {
          processedData.tags = project?.tags || ["Tag 1", "Tag 2"];
        }
        if (!processedData.createdAt) {
          processedData.createdAt = currentDate;
        }
        if (!processedData.image) {
          processedData.image = project?.image;
        }
      }
      
      onSave(processedData);
    }
  }

  // Cancelar la edición
  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      setEditMode(false)
    }
  }

  // Determinar los placeholders según si es un nuevo proyecto o no
  const getPlaceholder = (field: string) => {
    if (isNewProject) {
      switch (field) {
        case 'title': return 'Título del proyecto (ej. Mi Aplicación Web)'
        case 'description': return 'Descripción detallada del proyecto'
        case 'github': return 'https://github.com/usuario/proyecto'
        case 'demo': return 'https://demo.ejemplo.com'
        case 'tags': return 'React, Node.js, MongoDB'
        case 'image': return 'https://ejemplo.com/imagen.jpg'
        default: return ''
      }
    }
    return ''
  }

  // Si no hay proyecto seleccionado, mostrar mensaje
  if (!formData) {
    return (
      <Card className="bg-black/40 border-blue-700/20">
        <CardHeader>
          <CardTitle>Detalles del Proyecto</CardTitle>
          <CardDescription>
            Selecciona un proyecto existente o crea uno nuevo para visualizar detalles
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-center text-slate-400 py-4">No hay proyecto seleccionado</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-black/40 border-blue-700/20">
      <CardHeader>
        <CardTitle>
          {isNewProject 
            ? "Crear Nuevo Proyecto"
            : editMode
              ? "Editar Proyecto"
              : "Detalles del Proyecto"}
        </CardTitle>
        <CardDescription>
          {isNewProject
            ? "Ingresa los detalles para crear un nuevo proyecto."
            : editMode
              ? "Modifica los detalles del proyecto seleccionado."
              : "Visualiza los detalles del proyecto o haz clic en editar."}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {!editMode && !isNewProject && (
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
                value={emptyFields.title ? '' : formData.title}
                onChange={handleInputChange}
                disabled={!editMode}
                className="bg-black/40 border-blue-700/20"
                placeholder={getPlaceholder('title')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={emptyFields.description ? '' : formData.description}
                onChange={handleInputChange}
                disabled={!editMode}
                className="min-h-[100px] bg-black/40 border-blue-700/20"
                placeholder={getPlaceholder('description')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL de la Imagen</Label>
              <div className="flex gap-2">
                <Input
                  id="image"
                  name="image"
                  value={emptyFields.image ? '' : (formData.image || "")}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="bg-black/40 border-blue-700/20"
                  placeholder={getPlaceholder('image')}
                />
                {formData.image && !emptyFields.image && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-blue-700/50 text-blue-500 hover:bg-blue-700/10"
                    onClick={() => window.open(formData.image, "_blank")}
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
                value={emptyFields.tags ? '' : (typeof formData.tags === 'string' ? formData.tags : formData.tags.join(', '))}
                onChange={handleInputChange}
                disabled={!editMode}
                className="bg-black/40 border-blue-700/20"
                placeholder={getPlaceholder('tags')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="github">URL de GitHub</Label>
                <Input
                  id="github"
                  name="github"
                  value={emptyFields.github ? '' : formData.github}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="bg-black/40 border-blue-700/20"
                  placeholder={getPlaceholder('github')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="demo">URL de Demo/Docs</Label>
                <Input
                  id="demo"
                  name="demo"
                  value={emptyFields.demo ? '' : formData.demo}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="bg-black/40 border-blue-700/20"
                  placeholder={getPlaceholder('demo')}
                />
              </div>
            </div>

            {editMode && (
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  onClick={handleCancel} 
                  variant="outline"
                  className="border-red-700/50 text-red-500 hover:bg-red-700/10"
                >
                  Cancelar
                </Button>
                <Button onClick={handleSave} className="bg-blue-700 hover:bg-blue-800">
                  {isNewProject ? "Crear Proyecto" : "Guardar"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
