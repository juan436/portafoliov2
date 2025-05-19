"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Tag, Briefcase } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Definir la interfaz para una experiencia laboral
export interface Experience {
  position: string
  company: string
  period: string
  description: string
  skills: string[]
}

interface ExperienceFormProps {
  experiences: Experience[]
  onChange: (experiences: Experience[]) => void
}

export default function ExperienceForm({ experiences, onChange }: ExperienceFormProps) {
  const { toast } = useToast()
  const [activeExperienceIndex, setActiveExperienceIndex] = useState(0)
  const [newTechnology, setNewTechnology] = useState("")

  // Agregar nueva experiencia
  const addNewExperience = () => {
    const newExperience: Experience = {
      position: "Nuevo Cargo",
      company: "Nueva Empresa",
      period: "2023 - Presente",
      description: "Descripción de la nueva experiencia laboral",
      skills: ["Git", "JavaScript", "HTML", "CSS"], // Tecnologías por defecto
    }
    const updatedExperiences = [...experiences, newExperience]
    onChange(updatedExperiences)
    setActiveExperienceIndex(updatedExperiences.length - 1)

    toast({
      title: "Experiencia añadida",
      description: "Se ha añadido una nueva experiencia. Edítala para personalizarla.",
      variant: "default",
    })
  }

  // Eliminar experiencia
  const deleteExperience = (index: number, e?: React.MouseEvent) => {
    // Evitar la propagación del evento si existe
    if (e) {
      e.stopPropagation()
    }

    if (experiences.length <= 1) {
      toast({
        title: "No se puede eliminar",
        description: "Debe haber al menos una experiencia.",
        variant: "destructive",
      })
      return
    }

    const updatedExperiences = [...experiences]
    updatedExperiences.splice(index, 1)
    onChange(updatedExperiences)

    // Ajustar el índice activo si es necesario
    if (activeExperienceIndex >= updatedExperiences.length) {
      setActiveExperienceIndex(updatedExperiences.length - 1)
    }

    toast({
      title: "Experiencia eliminada",
      description: "La experiencia ha sido eliminada correctamente.",
      variant: "default",
    })
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

  // Agregar tecnología a la experiencia actual
  const addTechnology = () => {
    if (!newTechnology.trim()) return

    const updatedExperiences = [...experiences]
    const currentExperience = updatedExperiences[activeExperienceIndex]

    // Asegurarse de que skills exista
    if (!currentExperience.skills) {
      currentExperience.skills = []
    }

    // Evitar duplicados
    if (!currentExperience.skills.includes(newTechnology.trim())) {
      currentExperience.skills = [...currentExperience.skills, newTechnology.trim()]
      onChange(updatedExperiences)
      setNewTechnology("")

      toast({
        title: "Tecnología añadida",
        description: `Se ha añadido "${newTechnology}" a las tecnologías de esta experiencia.`,
        variant: "default",
      })
    } else {
      toast({
        title: "Tecnología duplicada",
        description: "Esta tecnología ya existe en la lista.",
        variant: "destructive",
      })
    }
  }

  // Eliminar tecnología de la experiencia actual
  const removeTechnology = (tech: string) => {
    const updatedExperiences = [...experiences]
    const currentExperience = updatedExperiences[activeExperienceIndex]

    if (currentExperience.skills) {
      currentExperience.skills = currentExperience.skills.filter((skill) => skill !== tech)
      onChange(updatedExperiences)

      toast({
        title: "Tecnología eliminada",
        description: `Se ha eliminado "${tech}" de las tecnologías de esta experiencia.`,
        variant: "default",
      })
    }
  }

  return (
    <Card className="bg-black/40 border-blue-700/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Sección Experiencia</CardTitle>
          <CardDescription>Edita tu experiencia laboral que se muestra en tu portafolio.</CardDescription>
        </div>
        <Button onClick={addNewExperience} className="bg-blue-700 hover:bg-blue-800 flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Nueva Experiencia
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {experiences.map((exp, index) => (
            <Card
              key={index}
              className={`cursor-pointer transition-all duration-200 relative ${
                activeExperienceIndex === index
                  ? "bg-blue-900/20 border-blue-500"
                  : "bg-black/40 border-blue-700/20 hover:border-blue-700/50"
              }`}
              onClick={() => setActiveExperienceIndex(index)}
            >
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="font-medium text-sm mb-1">{exp.position}</h3>
                  <p className="text-xs text-slate-400">{exp.company}</p>
                  <p className="text-xs text-slate-500 mt-1">{exp.period}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 p-1 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                  onClick={(e) => deleteExperience(index, e)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {experiences.length > 0 && (
          <div className="space-y-4 border border-blue-700/20 rounded-lg p-4">
            <h3 className="font-medium mb-2">Editando: {experiences[activeExperienceIndex].position}</h3>
            <div className="space-y-2">
              <Label htmlFor="exp-position">Cargo</Label>
              <Input
                id="exp-position"
                name="position"
                value={experiences[activeExperienceIndex].position}
                onChange={handleExperienceChange}
                className="bg-black/40 border-blue-700/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exp-company">Empresa</Label>
              <Input
                id="exp-company"
                name="company"
                value={experiences[activeExperienceIndex].company}
                onChange={handleExperienceChange}
                className="bg-black/40 border-blue-700/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exp-period">Período</Label>
              <Input
                id="exp-period"
                name="period"
                value={experiences[activeExperienceIndex].period}
                onChange={handleExperienceChange}
                className="bg-black/40 border-blue-700/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exp-description">Descripción</Label>
              <Textarea
                id="exp-description"
                name="description"
                value={experiences[activeExperienceIndex].description}
                onChange={handleExperienceChange}
                className="min-h-[100px] bg-black/40 border-blue-700/20"
              />
            </div>

            {/* Sección para tecnologías */}
            <div className="space-y-2 mt-6 pt-6 border-t border-blue-700/20">
              <div className="flex justify-between items-center">
                <Label htmlFor="exp-technologies" className="flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-blue-500" />
                  Tecnologías Utilizadas
                </Label>
              </div>

              {/* Lista de tecnologías actuales */}
              <div className="flex flex-wrap gap-2 mb-4">
                {experiences[activeExperienceIndex].skills?.map((tech, idx) => (
                  <div
                    key={idx}
                    className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-sm flex items-center gap-2 group"
                  >
                    {tech}
                    <button
                      onClick={() => removeTechnology(tech)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                {!experiences[activeExperienceIndex].skills?.length && (
                  <p className="text-sm text-slate-500 italic">No hay tecnologías añadidas</p>
                )}
              </div>

              {/* Formulario para añadir nueva tecnología */}
              <div className="flex gap-2">
                <Input
                  id="new-technology"
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  placeholder="Añadir nueva tecnología..."
                  className="bg-black/40 border-blue-700/20 flex-1"
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
                  disabled={!newTechnology.trim()}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Añadir
                </Button>
              </div>

              <p className="text-xs text-slate-400 mt-2">
                Presiona Enter o haz clic en "Añadir" para agregar una nueva tecnología. Las tecnologías aparecerán
                como badges en la sección de experiencia.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
