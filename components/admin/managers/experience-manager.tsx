"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useContent } from "@/contexts/content-context"
import { useToast } from "@/hooks/use-toast"
import ExperienceForm, { Experience } from "@/components/admin/forms/experience-form"

export default function ExperienceManager() {
  const { 
    content, 
    createExperienceItem, 
    updateExperienceItem, 
    deleteExperienceItem
  } = useContent()
  const { toast } = useToast()
  const [experienceContent, setExperienceContent] = useState<Experience[]>(content.experience)

  // Actualizar estado local cuando cambia el contenido global
  useEffect(() => {
    setExperienceContent(content.experience)
  }, [content])

  // Manejar cambios en la experiencia
  const handleExperienceChange = (updatedExperience: Experience[]) => {
    setExperienceContent(updatedExperience)
  }

  // Crear nueva experiencia
  const handleCreateExperience = async (experience: Omit<Experience, "_id">) => {
    try {
      const result = await createExperienceItem(experience)
      
      if (result) {
        // Actualizar el estado local para reflejar la creación exitosa
        const updatedExperiences = experienceContent.map(exp => {
          if (exp.isNew && 
              exp.position === experience.position && 
              exp.company === experience.company) {
            // Encontramos la experiencia que acabamos de crear, actualizamos su estado
            return { ...exp, isNew: false, _id: result._id }
          }
          return exp
        })
        setExperienceContent(updatedExperiences)
        
        toast({
          title: "Experiencia creada",
          description: "Se ha creado una nueva experiencia correctamente.",
          variant: "default",
        })
      } else {
        toast({
          title: "Error",
          description: "No se pudo crear la experiencia. Inténtalo de nuevo.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al crear experiencia:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al crear la experiencia.",
        variant: "destructive",
      })
    }
  }

  // Actualizar experiencia existente
  const handleUpdateExperience = async (id: string, experience: Experience) => {
    try {
      const success = await updateExperienceItem(id, experience)
      
      if (success) {
        toast({
          title: "Experiencia actualizada",
          description: "La experiencia ha sido actualizada correctamente.",
          variant: "default",
        })
      } else {
        toast({
          title: "Error",
          description: "No se pudo actualizar la experiencia. Inténtalo de nuevo.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al actualizar experiencia:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar la experiencia.",
        variant: "destructive",
      })
    }
  }

  // Eliminar experiencia
  const handleDeleteExperience = async (id: string) => {
    try {
      const success = await deleteExperienceItem(id)
      
      if (success) {
        toast({
          title: "Experiencia eliminada",
          description: "La experiencia ha sido eliminada correctamente.",
          variant: "default",
        })
      } else {
        toast({
          title: "Error",
          description: "No se pudo eliminar la experiencia. Inténtalo de nuevo.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al eliminar experiencia:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar la experiencia.",
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
      <h2 className="text-2xl font-bold">Gestión de Experiencia</h2>

      <Card className="bg-black/40 border-blue-700/20">
        <CardHeader>
          <CardTitle>Experiencia Laboral</CardTitle>
          <CardDescription>
            Administra tu historial de experiencia laboral. Puedes agregar, editar o eliminar experiencias.
            {experienceContent.some(exp => exp.isNew) && (
              <p className="text-amber-400 text-sm mt-1">
                ⚠️ Tienes experiencias pendientes de crear. Completa sus datos y guarda los cambios.
              </p>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExperienceForm 
            experiences={experienceContent} 
            onChange={handleExperienceChange}
            onCreate={handleCreateExperience}
            onUpdate={handleUpdateExperience}
            onDelete={handleDeleteExperience}
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}
