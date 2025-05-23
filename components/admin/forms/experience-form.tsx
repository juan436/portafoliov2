"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Tag, Briefcase, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Definir la interfaz para una experiencia laboral
export interface Experience {
  _id?: string
  position: string
  company: string
  period: string
  description: string
  skills: string[]
  companyLogo?: string
  location?: string
  achievements?: string[]
  url?: string
  isNew?: boolean
}

interface ExperienceFormProps {
  experiences: Experience[]
  onChange: (experiences: Experience[]) => void
  onCreate?: (experience: Omit<Experience, "_id">) => Promise<void>
  onUpdate?: (id: string, experience: Experience) => Promise<void>
  onDelete?: (id: string) => Promise<void>
}

export default function ExperienceForm({ 
  experiences, 
  onChange, 
  onCreate, 
  onUpdate, 
  onDelete 
}: ExperienceFormProps) {
  const { toast } = useToast()
  const [activeExperienceIndex, setActiveExperienceIndex] = useState(0)
  const [newTechnology, setNewTechnology] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [experienceToDeleteIndex, setExperienceToDeleteIndex] = useState<number | null>(null)

  // Agregar nueva experiencia (solo en memoria)
  const addNewExperience = () => {
    const newExperience: Experience = {
      position: "",
      company: "",
      period: "",
      description: "",
      skills: [],
      isNew: true // Marcar como nueva para saber que aún no está en la base de datos
    }
    
    // Siempre agregamos en memoria primero
    const updatedExperiences = [...experiences, newExperience]
    onChange(updatedExperiences)
    setActiveExperienceIndex(updatedExperiences.length - 1)

    toast({
      title: "Nueva experiencia",
      description: "Completa los datos y guarda los cambios para crear la experiencia.",
      variant: "default",
    })
  }

  // Iniciar proceso de eliminación de experiencia
  const confirmDeleteExperience = (index: number, e?: React.MouseEvent) => {
    // Evitar la propagación del evento si existe
    if (e) {
      e.stopPropagation()
    }
    
    setExperienceToDeleteIndex(index)
    setIsDeleteDialogOpen(true)
  }

  // Eliminar experiencia después de confirmación
  const executeDeleteExperience = () => {
    if (experienceToDeleteIndex === null) return
    
    const index = experienceToDeleteIndex
    const experienceToDelete = experiences[index]

    // Si la experiencia es nueva (solo en memoria), simplemente la eliminamos del estado
    if (experienceToDelete.isNew) {
      const updatedExperiences = [...experiences]
      updatedExperiences.splice(index, 1)
      onChange(updatedExperiences)
      
      // Ajustar el índice activo si es necesario
      if (updatedExperiences.length === 0) {
        // No hay más experiencias, no necesitamos ajustar el índice
      } else if (activeExperienceIndex >= updatedExperiences.length) {
        setActiveExperienceIndex(updatedExperiences.length - 1)
      } else if (activeExperienceIndex === index) {
        // Si estamos eliminando la experiencia activa, cambiamos a otra
        setActiveExperienceIndex(Math.max(0, index - 1))
      }
      
      toast({
        title: "Experiencia eliminada",
        description: "La experiencia ha sido eliminada.",
        variant: "default",
      })
      return
    }

    // Si tiene ID y existe onDelete, la eliminamos de la base de datos
    if (onDelete && experienceToDelete._id) {
      // Primero eliminamos del estado local para una UI más responsiva
      const updatedExperiences = [...experiences]
      updatedExperiences.splice(index, 1)
      onChange(updatedExperiences)
      
      // Ajustar el índice activo si es necesario
      if (updatedExperiences.length === 0) {
        // No hay más experiencias, no necesitamos ajustar el índice
      } else if (activeExperienceIndex >= updatedExperiences.length) {
        setActiveExperienceIndex(updatedExperiences.length - 1)
      } else if (activeExperienceIndex === index) {
        // Si estamos eliminando la experiencia activa, cambiamos a otra
        setActiveExperienceIndex(Math.max(0, index - 1))
      }
      
      // Luego eliminamos de la base de datos
      onDelete(experienceToDelete._id)
        .catch(error => {
          console.error("Error al eliminar experiencia:", error)
          toast({
            title: "Error",
            description: "No se pudo eliminar la experiencia. Los cambios locales se han revertido.",
            variant: "destructive",
          })
          // Revertir cambios locales en caso de error
          onChange(experiences)
        })
    } else {
      // Modo de edición local (para compatibilidad con el ContentEditor)
      const updatedExperiences = [...experiences]
      updatedExperiences.splice(index, 1)
      onChange(updatedExperiences)

      // Ajustar el índice activo si es necesario
      if (updatedExperiences.length === 0) {
        // No hay más experiencias, no necesitamos ajustar el índice
      } else if (activeExperienceIndex >= updatedExperiences.length) {
        setActiveExperienceIndex(updatedExperiences.length - 1)
      } else if (activeExperienceIndex === index) {
        // Si estamos eliminando la experiencia activa, cambiamos a otra
        setActiveExperienceIndex(Math.max(0, index - 1))
      }

      toast({
        title: "Experiencia eliminada",
        description: "La experiencia ha sido eliminada correctamente.",
        variant: "default",
      })
    }

    // Cerrar el diálogo
    setIsDeleteDialogOpen(false)
    setExperienceToDeleteIndex(null)
  }

  // Manejar cambios en la experiencia activa
  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const updatedExperiences = [...experiences]
    updatedExperiences[activeExperienceIndex] = {
      ...updatedExperiences[activeExperienceIndex],
      [name]: value,
    }
    onChange(updatedExperiences)
  }

  // Guardar cambios en la experiencia actual
  const saveExperience = async () => {
    const currentExperience = experiences[activeExperienceIndex]
    
    // Validar datos mínimos
    if (!currentExperience.position.trim() || !currentExperience.company.trim() || !currentExperience.period.trim()) {
      toast({
        title: "Datos incompletos",
        description: "Debes completar al menos el cargo, la empresa y el período.",
        variant: "destructive",
      })
      return
    }

    // Si es una experiencia nueva, la creamos en la base de datos
    if (currentExperience.isNew) {
      if (onCreate) {
        // Eliminar la propiedad isNew antes de enviar
        const { isNew, ...experienceData } = currentExperience
        
        try {
          await onCreate(experienceData)
          
          // Actualizar el estado para quitar la marca isNew y agregar el ID retornado
          const updatedExperiences = [...experiences]
          updatedExperiences[activeExperienceIndex] = {
            ...updatedExperiences[activeExperienceIndex],
            isNew: false
          }
          onChange(updatedExperiences)
          
          toast({
            title: "Experiencia creada",
            description: "La experiencia ha sido creada correctamente.",
            variant: "default",
          })
        } catch (error) {
          console.error("Error al crear experiencia:", error)
          toast({
            title: "Error",
            description: "No se pudo crear la experiencia. Inténtalo de nuevo.",
            variant: "destructive",
          })
        }
      }
    } else if (onUpdate && currentExperience._id) {
      // Si ya existe, la actualizamos
      try {
        await onUpdate(currentExperience._id, currentExperience)
        toast({
          title: "Cambios guardados",
          description: "Los cambios en la experiencia han sido guardados correctamente.",
          variant: "default",
        })
      } catch (error) {
        console.error("Error al actualizar experiencia:", error)
        toast({
          title: "Error",
          description: "No se pudo actualizar la experiencia. Inténtalo de nuevo.",
          variant: "destructive",
        })
      }
    } else {
      // Modo de edición local (para compatibilidad con el ContentEditor)
      onChange(experiences)
      toast({
        title: "Cambios guardados",
        description: "Los cambios en la experiencia han sido guardados localmente.",
        variant: "default",
      })
    }
  }

  // Agregar tecnología a la experiencia actual
  const addTechnology = () => {
    if (!newTechnology.trim()) return

    const updatedExperiences = [...experiences]
    const currentSkills = updatedExperiences[activeExperienceIndex].skills || []

    // Verificar si la tecnología ya existe
    if (currentSkills.includes(newTechnology.trim())) {
      toast({
        title: "Tecnología duplicada",
        description: "Esta tecnología ya está en la lista.",
        variant: "destructive",
      })
      return
    }

    updatedExperiences[activeExperienceIndex] = {
      ...updatedExperiences[activeExperienceIndex],
      skills: [...currentSkills, newTechnology.trim()],
    }

    onChange(updatedExperiences)
    setNewTechnology("")

    toast({
      title: "Tecnología añadida",
      description: `"${newTechnology.trim()}" ha sido añadida a la experiencia.`,
      variant: "default",
    })
  }

  // Eliminar tecnología de la experiencia actual
  const removeTechnology = (tech: string) => {
    const updatedExperiences = [...experiences]
    const currentSkills = updatedExperiences[activeExperienceIndex].skills || []

    updatedExperiences[activeExperienceIndex] = {
      ...updatedExperiences[activeExperienceIndex],
      skills: currentSkills.filter((t) => t !== tech),
    }

    onChange(updatedExperiences)
  }

  // Renderizar el formulario de experiencia
  const renderExperienceForm = () => {
    if (experiences.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Briefcase className="h-12 w-12 text-blue-500/50 mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">No hay experiencias</h3>
          <p className="text-gray-500 text-center max-w-md mb-6">
            Agrega tu primera experiencia laboral haciendo clic en el botón "Agregar Experiencia"
          </p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-1 space-y-2">
          <h3 className="text-sm font-medium mb-2">Experiencias</h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {experiences.map((exp, index) => (
              <div
                key={index}
                onClick={() => setActiveExperienceIndex(index)}
                className={`p-3 rounded-md cursor-pointer flex justify-between items-center ${
                  index === activeExperienceIndex
                    ? "bg-blue-700/20 border border-blue-700/40"
                    : "bg-black/20 border border-blue-700/10 hover:bg-blue-700/10"
                }`}
              >
                <div className="flex-1 truncate">
                  <p className="font-medium truncate">
                    {exp.position || <span className="text-gray-500 italic">Nuevo cargo</span>}
                  </p>
                  <p className="text-sm text-gray-400 truncate">
                    {exp.company || <span className="text-gray-500 italic">Nueva empresa</span>}
                  </p>
                </div>
                <button
                  onClick={(e) => confirmDeleteExperience(index, e)}
                  className="ml-2 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Formulario de edición */}
        <div className="md:col-span-3 bg-black/20 border border-blue-700/10 rounded-md p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Cargo</Label>
                <Input
                  id="position"
                  name="position"
                  value={experiences[activeExperienceIndex].position}
                  onChange={handleExperienceChange}
                  placeholder="Ej: Desarrollador Full Stack"
                  className="bg-black/40"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input
                  id="company"
                  name="company"
                  value={experiences[activeExperienceIndex].company}
                  onChange={handleExperienceChange}
                  placeholder="Ej: Tech Company"
                  className="bg-black/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="period">Período</Label>
                <Input
                  id="period"
                  name="period"
                  value={experiences[activeExperienceIndex].period}
                  onChange={handleExperienceChange}
                  placeholder="Ej: Enero 2022 - Presente"
                  className="bg-black/40"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  name="location"
                  value={experiences[activeExperienceIndex].location || ""}
                  onChange={handleExperienceChange}
                  placeholder="Ej: Remoto / Ciudad, País"
                  className="bg-black/40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={experiences[activeExperienceIndex].description}
                onChange={handleExperienceChange}
                placeholder="Describe tus responsabilidades y logros en este puesto..."
                className="bg-black/40 min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyLogo">Logo de la empresa (URL)</Label>
              <Input
                id="companyLogo"
                name="companyLogo"
                value={experiences[activeExperienceIndex].companyLogo || ""}
                onChange={handleExperienceChange}
                placeholder="https://example.com/logo.png"
                className="bg-black/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL del proyecto o empresa</Label>
              <Input
                id="url"
                name="url"
                value={experiences[activeExperienceIndex].url || ""}
                onChange={handleExperienceChange}
                placeholder="https://example.com"
                className="bg-black/40"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center">
                <Tag className="mr-2 h-4 w-4" />
                Tecnologías utilizadas
              </Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {experiences[activeExperienceIndex].skills?.map((tech, i) => (
                  <div
                    key={i}
                    className="bg-blue-700/20 text-blue-400 px-2 py-1 rounded-md text-sm flex items-center"
                  >
                    {tech}
                    <button
                      onClick={() => removeTechnology(tech)}
                      className="ml-2 text-blue-400 hover:text-red-500"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {(!experiences[activeExperienceIndex].skills || experiences[activeExperienceIndex].skills.length === 0) && (
                  <div className="text-gray-500 text-sm italic">
                    No hay tecnologías añadidas
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                <Input
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  placeholder="Añadir tecnología (ej: React, Node.js)"
                  className="bg-black/40"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTechnology()
                    }
                  }}
                />
                <Button
                  onClick={addTechnology}
                  className="bg-blue-700 hover:bg-blue-800"
                  type="button"
                >
                  Añadir
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Estas tecnologías se mostrarán como badges en la sección de experiencia.
              </p>
            </div>

            <Button onClick={saveExperience} className="bg-blue-700 hover:bg-blue-800">
              <Save className="h-4 w-4 mr-1" />
              Guardar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Card className="bg-black/40 border-blue-700/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Experiencia Laboral</CardTitle>
            <CardDescription>
              Gestiona tu historial de experiencia profesional
            </CardDescription>
          </div>
          <Button onClick={addNewExperience} className="bg-blue-700 hover:bg-blue-800">
            <Plus className="mr-2 h-4 w-4" />
            Agregar Experiencia
          </Button>
        </CardHeader>
        <CardContent>
          {renderExperienceForm()}
        </CardContent>
      </Card>

      {/* Diálogo de confirmación para eliminar experiencia */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-black border-blue-700/20">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              {experienceToDeleteIndex !== null && experiences[experienceToDeleteIndex] ? (
                <>
                  ¿Estás seguro de que deseas eliminar la experiencia 
                  <span className="font-medium text-blue-400">
                    {" "}{experiences[experienceToDeleteIndex].position || "Nueva experiencia"}{" "}
                  </span>
                  en 
                  <span className="font-medium text-blue-400">
                    {" "}{experiences[experienceToDeleteIndex].company || "Nueva empresa"}
                  </span>?
                  Esta acción no se puede deshacer.
                </>
              ) : (
                "¿Estás seguro de que deseas eliminar esta experiencia? Esta acción no se puede deshacer."
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={executeDeleteExperience}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
