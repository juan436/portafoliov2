"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, Code, Server, Database, Braces } from "lucide-react"
import { useContent } from "@/contexts/content-context"
import { useToast } from "@/hooks/use-toast"
import type { Skill } from "@/contexts/content-context"
import Script from "next/script"

// Importar componentes extraídos
import SkillForm from "@/components/admin/forms/skill-form"
import SkillsTable from "@/components/admin/tables/skills-table"
import OtherSkillsTable from "@/components/admin/tables/other-skills-table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function SkillsManager() {
  const {
    content,
    updateSkills,
    otherSkills,
    addOtherSkill,
    editOtherSkill,
    removeOtherSkill,
    // Métodos específicos para skills
    createSkillItem,
    updateSkillItem,
    deleteSkillItem,
    saveAllContent,
  } = useContent()
  
  const { toast } = useToast()
  const [skills, setSkills] = useState(content.skills)
  const [otherSkillsState, setOtherSkills] = useState(content.otherSkills)
  const [currentSkill, setCurrentSkill] = useState<Skill | null>(null)
  const [currentOtherSkill, setCurrentOtherSkill] = useState("")
  const [isSkillFormOpen, setIsSkillFormOpen] = useState(false)
  const [isOtherSkillDialogOpen, setIsOtherSkillDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleteOtherSkillDialogOpen, setIsDeleteOtherSkillDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("frontend")
  const [newOtherSkill, setNewOtherSkill] = useState("")

  // Cargar skills desde el contexto
  useEffect(() => {
    setSkills(content.skills)
    setOtherSkills(content.otherSkills)
  }, [content.skills, content.otherSkills])

  // Renderizar el ícono de Devicon
  const renderDevIcon = (iconName: string, colored = false) => {
    if (!iconName) return null
    const iconClass = `devicon-${iconName}${colored ? "-plain colored" : "-plain"}`
    return <i className={`${iconClass} text-2xl`}></i>
  }

  // Funciones para manejar la CRUD de skills técnicas
  const handleCreateSkill = () => {
    setCurrentSkill(null)
    setIsSkillFormOpen(true)
  }

  const handleEditSkill = (skill: Skill) => {
    setCurrentSkill(skill)
    setIsSkillFormOpen(true)
  }

  const handleDeleteSkillConfirm = (skill: Skill) => {
    setCurrentSkill(skill)
    setIsDeleteDialogOpen(true)
  }

  const handleSkillFormSubmit = async (skill: Skill) => {
    const isEditing = Boolean(currentSkill)
    
    try {
      if (isEditing && currentSkill?.id) {
        // Actualizar una skill existente usando updateSkillItem
        const success = await updateSkillItem(currentSkill.id, skill)
        
        if (success) {
          toast({
            title: "Habilidad actualizada",
            description: "La habilidad ha sido actualizada correctamente y se refleja en el portafolio.",
            variant: "default",
          })
        } else {
          toast({
            title: "Error al actualizar",
            description: "Hubo un problema al actualizar la habilidad. Inténtalo de nuevo.",
            variant: "destructive",
          })
        }
      } else {
        // Crear una nueva skill usando createSkillItem
        const newSkill = await createSkillItem(skill, activeTab)
        
        if (newSkill) {
          toast({
            title: "Habilidad creada",
            description: "La habilidad ha sido creada correctamente y se refleja en el portafolio.",
            variant: "default",
          })
        } else {
          toast({
            title: "Error al crear",
            description: "Hubo un problema al crear la habilidad. Inténtalo de nuevo.",
            variant: "destructive",
          })
        }
      }
      
      // Cerrar el formulario
      setIsSkillFormOpen(false)
      
    } catch (error) {
      console.error("Error al gestionar la habilidad:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  // Manejar la eliminación de skills
  const handleDeleteSkill = async () => {
    try {
      if (!currentSkill?.id) {
        throw new Error("ID de habilidad no válido")
      }
      
      const success = await deleteSkillItem(currentSkill.id.toString())
      
      if (success) {
        toast({
          title: "Habilidad eliminada",
          description: "La habilidad se ha eliminado correctamente.",
          variant: "default",
        })
        
        setIsDeleteDialogOpen(false)
      } else {
        toast({
          title: "Error al eliminar",
          description: "No se pudo eliminar la habilidad. Inténtalo de nuevo.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al eliminar habilidad:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  // Manejar la creación de otras habilidades
  const handleCreateOtherSkill = () => {
    setCurrentOtherSkill("")
    setNewOtherSkill("")
    setIsOtherSkillDialogOpen(true)
  }

  // Manejar la edición de otras habilidades
  const handleEditOtherSkill = (skill: string) => {
    setCurrentOtherSkill(skill)
    setNewOtherSkill(skill)
    setIsOtherSkillDialogOpen(true)
  }

  // Manejar el guardado de otras habilidades
  const handleSaveOtherSkill = () => {
    if (!newOtherSkill.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la habilidad no puede estar vacío.",
        variant: "destructive",
      })
      return
    }

    // Actualizar otras habilidades
    const updatedOtherSkills = currentOtherSkill
      ? otherSkillsState.map((s) => (s === currentOtherSkill ? newOtherSkill : s))
      : [...otherSkillsState, newOtherSkill]

    setOtherSkills(updatedOtherSkills)
    
    // Manejar la actualización en el contexto
    if (currentOtherSkill) {
      editOtherSkill(currentOtherSkill, newOtherSkill)
    } else {
      addOtherSkill(newOtherSkill)
    }

    // Guardar cambios
    const saved = saveAllContent()

    if (saved) {
      toast({
        title: currentOtherSkill ? "Habilidad actualizada" : "Habilidad creada",
        description: currentOtherSkill
          ? "La habilidad adicional ha sido actualizada correctamente."
          : "La habilidad adicional ha sido creada correctamente.",
        variant: "default",
      })
    } else {
      toast({
        title: "Error al guardar",
        description: "Hubo un problema al guardar los cambios. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }

    setIsOtherSkillDialogOpen(false)
  }

  // Manejar la eliminación de otras habilidades (confirmar)
  const handleDeleteOtherSkillConfirm = (skill: string) => {
    setCurrentOtherSkill(skill)
    setIsDeleteOtherSkillDialogOpen(true)
  }

  // Manejar la eliminación de otras habilidades
  const handleDeleteOtherSkill = () => {
    if (currentOtherSkill) {
      const updatedOtherSkills = otherSkillsState.filter((s) => s !== currentOtherSkill)
      setOtherSkills(updatedOtherSkills)
      removeOtherSkill(currentOtherSkill)

      // Guardar inmediatamente para que se refleje en el portafolio
      const saved = saveAllContent()

      if (saved) {
        toast({
          title: "Habilidad eliminada",
          description: "La habilidad adicional ha sido eliminada correctamente.",
          variant: "default",
        })
      } else {
        toast({
          title: "Error al eliminar",
          description: "Hubo un problema al eliminar la habilidad. Inténtalo de nuevo.",
          variant: "destructive",
        })
      }

      setIsDeleteOtherSkillDialogOpen(false)
    }
  }

  return (
    <>
      {/* Script para cargar los iconos de Devicon */}
      <Script src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.js" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Gestión de Habilidades</h2>
          <Button onClick={handleCreateSkill} className="bg-blue-700 hover:bg-blue-800">
            <Plus className="mr-2 h-4 w-4" />
            Añadir Habilidad
          </Button>
        </div>

        {/* Tabs para las diferentes categorías de habilidades técnicas */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-black/40 border border-blue-700/20">
            <TabsTrigger
              value="frontend"
              className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500 flex items-center"
            >
              <Code className="mr-2 h-4 w-4" />
              Frontend
            </TabsTrigger>
            <TabsTrigger
              value="backend"
              className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500 flex items-center"
            >
              <Server className="mr-2 h-4 w-4" />
              Backend
            </TabsTrigger>
            <TabsTrigger
              value="database"
              className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500 flex items-center"
            >
              <Database className="mr-2 h-4 w-4" />
              Base de Datos
            </TabsTrigger>
            <TabsTrigger
              value="devops"
              className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500 flex items-center"
            >
              <Braces className="mr-2 h-4 w-4" />
              DevOps
            </TabsTrigger>
          </TabsList>

          {/* Contenido de las tabs */}
          <TabsContent value="frontend" className="m-0">
            <SkillsTable
              skills={skills.frontend}
              onEdit={handleEditSkill}
              onDelete={handleDeleteSkillConfirm}
              renderDevIcon={renderDevIcon}
            />
          </TabsContent>
          <TabsContent value="backend" className="m-0">
            <SkillsTable
              skills={skills.backend}
              onEdit={handleEditSkill}
              onDelete={handleDeleteSkillConfirm}
              renderDevIcon={renderDevIcon}
            />
          </TabsContent>
          <TabsContent value="database" className="m-0">
            <SkillsTable
              skills={skills.database}
              onEdit={handleEditSkill}
              onDelete={handleDeleteSkillConfirm}
              renderDevIcon={renderDevIcon}
            />
          </TabsContent>
          <TabsContent value="devops" className="m-0">
            <SkillsTable
              skills={skills.devops}
              onEdit={handleEditSkill}
              onDelete={handleDeleteSkillConfirm}
              renderDevIcon={renderDevIcon}
            />
          </TabsContent>
        </Tabs>

        {/* Sección de otras habilidades */}
        <Card className="bg-black/40 border-blue-700/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Otras Habilidades</CardTitle>
              <CardDescription>Soft skills y otras competencias profesionales</CardDescription>
            </div>
            <Button onClick={handleCreateOtherSkill} className="bg-blue-700 hover:bg-blue-800">
              <Plus className="mr-2 h-4 w-4" />
              Añadir
            </Button>
          </CardHeader>
          <CardContent>
            <OtherSkillsTable
              skills={otherSkillsState}
              onEdit={handleEditOtherSkill}
              onDelete={handleDeleteOtherSkillConfirm}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Formulario de habilidad técnica */}
      <SkillForm
        isOpen={isSkillFormOpen}
        onClose={() => setIsSkillFormOpen(false)}
        onSave={handleSkillFormSubmit}
        currentSkill={currentSkill}
        category={activeTab}
      />

      {/* Dialog para confirmar eliminación de habilidad técnica */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-black border-blue-700/20">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar la habilidad {currentSkill?.name}? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteSkill}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para añadir/editar otra habilidad */}
      <Dialog open={isOtherSkillDialogOpen} onOpenChange={setIsOtherSkillDialogOpen}>
        <DialogContent className="bg-black border-blue-700/20">
          <DialogHeader>
            <DialogTitle>{currentOtherSkill ? "Editar Habilidad" : "Nueva Habilidad"}</DialogTitle>
            <DialogDescription>
              {currentOtherSkill
                ? "Actualiza el nombre de la habilidad adicional."
                : "Añade una nueva habilidad adicional a tu perfil."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input
                value={newOtherSkill}
                onChange={(e) => setNewOtherSkill(e.target.value)}
                placeholder="Ej: Gestión de equipos, Comunicación efectiva"
                className="bg-black/40 border-blue-700/20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOtherSkillDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveOtherSkill} className="bg-blue-700 hover:bg-blue-800">
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para confirmar eliminación de otra habilidad */}
      <Dialog open={isDeleteOtherSkillDialogOpen} onOpenChange={setIsDeleteOtherSkillDialogOpen}>
        <DialogContent className="bg-black border-blue-700/20">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar la habilidad "{currentOtherSkill}"? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOtherSkillDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteOtherSkill}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
