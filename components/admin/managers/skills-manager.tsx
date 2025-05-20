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
    addOtherSkill,
    editOtherSkill,
    removeOtherSkill,
    // Métodos específicos para skills
    createSkillItem,
    updateSkillItem,
    deleteSkillItem,
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
  const [activeTab, setActiveTab] = useState<string>("frontend")
  const [newOtherSkill, setNewOtherSkill] = useState("")
  const [isCreatingNewSkill, setIsCreatingNewSkill] = useState(false)

  // Datos de ejemplo para el renderizador de iconos
  const devIcons = [
    "react", "nodejs", "javascript", "typescript", "html5", "css3", 
    "bootstrap", "tailwindcss", "sass", "webpack", "nextjs", "git", 
    "github", "mongodb", "postgresql", "mysql", "express", "nestjs",
    "docker", "kubernetes", "jenkins", "nginx", "linux", "aws",
    "firebase", "heroku", "vercel", "figma", "photoshop", "illustrator"
  ]

  useEffect(() => {
    setSkills(content.skills)
    setOtherSkills(content.otherSkills)
  }, [content])

  // Renderizador de iconos de Devicon
  const renderDevIcon = (iconName: string, colored = true) => {
    if (!iconName) return null

    // Caso especial para Next.js
    if (iconName === "nextjs") {
      return (
        <i
          className={`devicon-nextjs-original-wordmark ${colored ? "colored" : ""}`}
          style={{ fontSize: "2rem", color: !colored ? "white" : undefined }}
        ></i>
      )
    }

    // Casos especiales que usan sufijos diferentes
    const specialIcons: Record<string, string> = {
      express: "original",
      nestjs: "plain-wordmark",
      amazonwebservices: "original",
      digitalocean: "original",
    }

    // Determinar el sufijo correcto
    const suffix = specialIcons[iconName] || "plain"

    return (
      <i
        className={`devicon-${iconName}-${suffix} ${colored ? "colored" : ""}`}
        style={{ fontSize: "2rem", color: !colored && !specialIcons[iconName] ? "white" : undefined }}
      ></i>
    )
  }

  // Crear una nueva skill técnica
  const handleCreateSkill = () => {
    // Crear un objeto de habilidad temporal (no se guarda en la base de datos todavía)
    const tempSkill: Skill = {
      name: "",
      icon: "",
      category: activeTab
    };
    
    setIsCreatingNewSkill(true);
    setCurrentSkill(tempSkill);
    setIsSkillFormOpen(true);
  }

  // Editar una skill existente
  const handleEditSkill = (skill: Skill) => {
    setIsCreatingNewSkill(false);
    setCurrentSkill({ ...skill });
    setIsSkillFormOpen(true);
  }

  // Confirmar eliminación de una skill
  const handleDeleteSkillConfirm = (skill: Skill) => {
    console.log("Confirmando eliminación de skill:", skill);
    setCurrentSkill(skill);
    setIsDeleteDialogOpen(true);
  }

  // Eliminar una skill
  const handleDeleteSkill = async () => {
    console.log("Intentando eliminar skill:", currentSkill);
    
    if (!currentSkill) {
      console.log("Error: No hay skill seleccionada");
      toast({
        title: "Error",
        description: "No se puede eliminar la habilidad porque no hay ninguna seleccionada.",
        variant: "destructive",
      });
      return;
    }
    
    const skillId = currentSkill._id;
    
    if (!skillId) {
      console.log("Error: ID de skill no válido");
      toast({
        title: "Error",
        description: "No se puede eliminar la habilidad porque no tiene un ID válido.",
        variant: "destructive",
      });
      return;
    }

    console.log("Llamando a deleteSkillItem con ID:", skillId);
    const success = await deleteSkillItem(skillId);
    console.log("Resultado de deleteSkillItem:", success);

    if (success) {
      // Actualizar el estado local
      setSkills(prev => {
        const updated = { ...prev };
        const category = currentSkill.category as keyof Skills;
        updated[category] = updated[category].filter(s => s._id !== skillId);
        return updated;
      });

      // Mostrar notificación
      toast({
        title: "Habilidad eliminada",
        description: "La habilidad ha sido eliminada correctamente.",
        variant: "default",
      });
    } else {
      toast({
        title: "Error al eliminar",
        description: "Hubo un problema al eliminar la habilidad. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }

    setIsDeleteDialogOpen(false);
    setCurrentSkill(null);
  }

  // Guardar una skill (nueva o editada)
  const handleSkillFormSubmit = async (skill: Skill) => {
    if (isCreatingNewSkill) {
      // Es una nueva habilidad
      const result = await createSkillItem(skill);
      
      if (result) {
        // Actualizar el estado local
        setSkills(prev => {
          const updated = { ...prev };
          const category = skill.category as keyof Skills;
          updated[category] = [...updated[category], result];
          return updated;
        });

        toast({
          title: "Habilidad creada",
          description: "La habilidad ha sido creada correctamente.",
          variant: "default",
        });
      } else {
        toast({
          title: "Error al crear",
          description: "Hubo un problema al crear la habilidad. Inténtalo de nuevo.",
          variant: "destructive",
        });
      }
    } else {
      // Es una edición de habilidad existente
      const skillId = skill._id;
      
      if (!skillId) {
        toast({
          title: "Error al actualizar",
          description: "No se pudo identificar la habilidad a actualizar.",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Actualizando skill con ID:", skillId, "Datos:", skill);
      const success = await updateSkillItem(skillId, skill);
      
      if (success) {
        // Actualizar el estado local
        setSkills(prev => {
          const updated = { ...prev };
          const category = skill.category as keyof Skills;
          updated[category] = updated[category].map(s => s._id === skillId ? skill : s);
          return updated;
        });

        toast({
          title: "Habilidad actualizada",
          description: "La habilidad ha sido actualizada correctamente.",
          variant: "default",
        });
      } else {
        toast({
          title: "Error al actualizar",
          description: "Hubo un problema al actualizar la habilidad. Inténtalo de nuevo.",
          variant: "destructive",
        });
      }
    }

    setIsSkillFormOpen(false);
    setCurrentSkill(null);
    setIsCreatingNewSkill(false);
  }

  // Crear una nueva habilidad adicional
  const handleCreateOtherSkill = () => {
    setNewOtherSkill("");
    setCurrentOtherSkill("");
    setIsOtherSkillDialogOpen(true);
  }

  // Editar una habilidad adicional existente
  const handleEditOtherSkill = (skill: string) => {
    setNewOtherSkill(skill);
    setCurrentOtherSkill(skill);
    setIsOtherSkillDialogOpen(true);
  }

  // Confirmar eliminación de una habilidad adicional
  const handleDeleteOtherSkillConfirm = (skill: string) => {
    setCurrentOtherSkill(skill);
    setIsDeleteOtherSkillDialogOpen(true);
  }

  // Guardar una habilidad adicional (nueva o editada)
  const handleSaveOtherSkill = async () => {
    if (!newOtherSkill.trim()) {
      toast({
        title: "Campo requerido",
        description: "El nombre de la habilidad es obligatorio.",
        variant: "destructive",
      });
      return;
    }

    if (currentOtherSkill) {
      // Editar habilidad existente
      const index = otherSkillsState.findIndex(s => s.name === currentOtherSkill);
      
      if (index !== -1) {
        const skillObj = otherSkillsState[index];
        await editOtherSkill(skillObj._id, { _id: skillObj._id, name: newOtherSkill });
        
        // Actualizar estado local
        const updatedSkills = [...otherSkillsState];
        updatedSkills[index].name = newOtherSkill;
        
        setOtherSkills(updatedSkills);
        
        toast({
          title: "Habilidad actualizada",
          description: "La habilidad adicional ha sido actualizada correctamente.",
          variant: "default",
        });
      }
    } else {
      // Crear nueva habilidad
      const newSkillObj = { _id: Date.now().toString(), name: newOtherSkill };
      await addOtherSkill(newSkillObj);
      
      // Actualizar estado local
      setOtherSkills([...otherSkillsState, newSkillObj]);
      
      toast({
        title: "Habilidad creada",
        description: "La habilidad adicional ha sido creada correctamente.",
        variant: "default",
      });
    }

    setIsOtherSkillDialogOpen(false);
    setNewOtherSkill("");
    setCurrentOtherSkill("");
  }

  // Eliminar una habilidad adicional
  const handleDeleteOtherSkill = async () => {
    if (!currentOtherSkill) return;
    
    // Buscar la habilidad a eliminar
    const skillToDelete = otherSkillsState.find(s => s.name === currentOtherSkill);
    
    if (skillToDelete) {
      await removeOtherSkill(skillToDelete._id);
      
      // Actualizar estado local
      setOtherSkills(otherSkillsState.filter(s => s.name !== currentOtherSkill));
      
      toast({
        title: "Habilidad eliminada",
        description: "La habilidad adicional ha sido eliminada correctamente.",
        variant: "default",
      });
    } else {
      toast({
        title: "Error al eliminar",
        description: "Hubo un problema al eliminar la habilidad. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }

    setIsDeleteOtherSkillDialogOpen(false);
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
        <div className="mt-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Otras Habilidades</h2>
            <Button onClick={handleCreateOtherSkill} className="bg-blue-700 hover:bg-blue-800">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Habilidad Adicional
            </Button>
          </div>
          
          <Card className="bg-black/40 border-blue-700/20">
            <CardHeader>
              <CardTitle>Habilidades Adicionales</CardTitle>
              <CardDescription>Gestiona las habilidades adicionales que se mostrarán en tu portafolio.</CardDescription>
            </CardHeader>
            <CardContent>
              <OtherSkillsTable
                skills={otherSkillsState}
                onEdit={handleEditOtherSkill}
                onDelete={handleDeleteOtherSkillConfirm}
              />
            </CardContent>
          </Card>
        </div>
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
