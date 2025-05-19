"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ImageIcon } from "lucide-react"
import type { Project } from "@/contexts/content-context"

interface ProjectFormProps {
  project: Project | null
  editMode: boolean
  setEditMode: (value: boolean) => void
  onSave: (project: Project) => void
}

export default function ProjectForm({ project, editMode, setEditMode, onSave }: ProjectFormProps) {
  const [formData, setFormData] = useState<Project | null>(project)

  // Actualizar el formData cuando cambia el proyecto seleccionado
  useEffect(() => {
    setFormData(project)
  }, [project])

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

  // Manejar cambios en los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // Manejar tags especialmente (separados por comas)
    if (name === "tags") {
      const tagsArray = value.split(",").map((tag) => tag.trim()).filter(Boolean)
      setFormData((prev) => prev ? { ...prev, [name]: tagsArray } : null)
    } else {
      setFormData((prev) => prev ? { ...prev, [name]: value } : null)
    }
  }

  // Guardar los cambios
  const handleSave = () => {
    if (formData) {
      onSave(formData)
    }
  }

  return (
    <Card className="bg-black/40 border-blue-700/20">
      <CardHeader>
        <CardTitle>
          {editMode
            ? "Editar Proyecto"
            : "Detalles del Proyecto"}
        </CardTitle>
        <CardDescription>
          {editMode
            ? "Modifica los detalles del proyecto seleccionado."
            : "Visualiza los detalles del proyecto o haz clic en editar."}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
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
                value={formData.title}
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
                value={formData.description}
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
                  value={formData.image || ""}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="bg-black/40 border-blue-700/20"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                {formData.image && (
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
                value={formData.tags.join(", ")}
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
                  value={formData.github}
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
                  value={formData.demo}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="bg-black/40 border-blue-700/20"
                  placeholder="https://demo.ejemplo.com"
                />
              </div>
            </div>

            {editMode && (
              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} className="bg-blue-700 hover:bg-blue-800">
                  Guardar
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
