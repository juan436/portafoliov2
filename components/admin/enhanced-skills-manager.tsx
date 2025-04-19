"use client"

import type React from "react"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Code, Server, Database, Braces } from "lucide-react"
import { useContent } from "@/contexts/content-context"
import { useToast } from "@/hooks/use-toast"
import type { Skill } from "@/contexts/content-context"
import Script from "next/script"
import SkillForm from "@/components/admin/skill-form"

export default function EnhancedSkillsManager() {
  const { content, updateSkills, updateOtherSkills, saveAllContent } = useContent()
  const { toast } = useToast()
  const [skills, setSkills] = useState(content.skills)
  const [otherSkills, setOtherSkills] = useState(content.otherSkills)
  const [currentSkill, setCurrentSkill] = useState<Skill | null>(null)
  const [currentOtherSkill, setCurrentOtherSkill] = useState("")
  const [isSkillFormOpen, setIsSkillFormOpen] = useState(false)
  const [isOtherSkillDialogOpen, setIsOtherSkillDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleteOtherSkillDialogOpen, setIsDeleteOtherSkillDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("frontend")

  // Crear una nueva skill
  const handleCreateSkill = () => {
    setCurrentSkill(null)
    setIsSkillFormOpen(true)
  }

  // Editar una skill existente
  const handleEditSkill = (skill: Skill) => {
    setCurrentSkill({ ...skill })
    setIsSkillFormOpen(true)
  }

  // Confirmar eliminación de una skill
  const handleDeleteConfirm = (skill: Skill) => {
    setCurrentSkill(skill)
    setIsDeleteDialogOpen(true)
  }

  // Eliminar una skill
  const handleDeleteSkill = () => {
    if (currentSkill) {
      const updatedSkills = {
        ...skills,
        [activeTab]: skills[activeTab as keyof typeof skills].filter((s) => s.name !== currentSkill.name),
      }
      setSkills(updatedSkills)
      updateSkills(updatedSkills)

      // Guardar inmediatamente para que se refleje en el portafolio
      const saved = saveAllContent()

      if (saved) {
        toast({
          title: "Habilidad eliminada",
          description: "La habilidad ha sido eliminada correctamente y se refleja en el portafolio.",
          variant: "default",
        })
      } else {
        toast({
          title: "Error al eliminar",
          description: "Hubo un problema al eliminar la habilidad. Inténtalo de nuevo.",
          variant: "destructive",
        })
      }

      setIsDeleteDialogOpen(false)
      setCurrentSkill(null)
    }
  }

  // Guardar una skill (nueva o editada)
  const handleSaveSkill = (skill: Skill) => {
    // Crear una copia del array de skills del tipo actual
    const currentTypeSkills = [...skills[activeTab as keyof typeof skills]]

    // Verificar si ya existe una skill con ese nombre (excepto si es la misma que estamos editando)
    const existingIndex = currentTypeSkills.findIndex((s) => s.name === skill.name)
    const isEditing = currentSkill !== null

    if (existingIndex >= 0 && (!isEditing || (isEditing && currentSkill?.name !== skill.name))) {
      toast({
        title: "Error al guardar",
        description: "Ya existe una habilidad con ese nombre.",
        variant: "destructive",
      })
      return
    }

    // Si estamos editando, encontrar y actualizar la skill existente
    if (isEditing) {
      const skillIndex = currentTypeSkills.findIndex((s) => s.name === currentSkill?.name)
      if (skillIndex >= 0) {
        currentTypeSkills[skillIndex] = skill
      } else {
        currentTypeSkills.push(skill)
      }
    } else {
      // Si es nueva, añadirla al array
      currentTypeSkills.push(skill)
    }

    // Actualizar el estado local y el contexto global
    const updatedSkills = {
      ...skills,
      [activeTab]: currentTypeSkills,
    }

    setSkills(updatedSkills)
    updateSkills(updatedSkills)

    // Guardar inmediatamente para que se refleje en el portafolio
    const saved = saveAllContent()

    if (saved) {
      toast({
        title: isEditing ? "Habilidad actualizada" : "Habilidad creada",
        description: isEditing
          ? "La habilidad ha sido actualizada correctamente y se refleja en el portafolio."
          : "La habilidad ha sido creada correctamente y se refleja en el portafolio.",
        variant: "default",
      })

      // Disparar un evento personalizado para forzar la actualización de los componentes
      if (typeof window !== "undefined") {
        const event = new CustomEvent("skillsUpdated", { detail: updatedSkills })
        window.dispatchEvent(event)
      }
    } else {
      toast({
        title: "Error al guardar",
        description: "Hubo un problema al guardar los cambios. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }

    // Cerrar el formulario
    setIsSkillFormOpen(false)
  }

  // Manejar la creación de otras habilidades
  const handleCreateOtherSkill = () => {
    setCurrentOtherSkill("")
    setIsOtherSkillDialogOpen(true)
  }

  const handleEditOtherSkill = (skill: string) => {
    setCurrentOtherSkill(skill)
    setIsOtherSkillDialogOpen(true)
  }

  const handleDeleteOtherSkillConfirm = (skill: string) => {
    setCurrentOtherSkill(skill)
    setIsDeleteOtherSkillDialogOpen(true)
  }

  const handleSaveOtherSkill = (formData: FormData) => {
    const skillName = formData.get("skillName") as string

    if (!skillName) {
      toast({
        title: "Error al guardar",
        description: "El nombre de la habilidad es obligatorio.",
        variant: "destructive",
      })
      return
    }

    const updatedOtherSkills = currentOtherSkill
      ? otherSkills.map((s) => (s === currentOtherSkill ? skillName : s))
      : [...otherSkills, skillName]

    setOtherSkills(updatedOtherSkills)
    updateOtherSkills(updatedOtherSkills)

    // Guardar inmediatamente para que se refleje en el portafolio
    const saved = saveAllContent()

    if (saved) {
      toast({
        title: currentOtherSkill ? "Habilidad actualizada" : "Habilidad creada",
        description: currentOtherSkill
          ? "La habilidad ha sido actualizada correctamente y se refleja en el portafolio."
          : "La habilidad ha sido creada correctamente y se refleja en el portafolio.",
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
    setCurrentOtherSkill("")
  }

  const handleDeleteOtherSkill = () => {
    if (currentOtherSkill) {
      const updatedOtherSkills = otherSkills.filter((s) => s !== currentOtherSkill)
      setOtherSkills(updatedOtherSkills)
      updateOtherSkills(updatedOtherSkills)

      // Guardar inmediatamente para que se refleje en el portafolio
      const saved = saveAllContent()

      if (saved) {
        toast({
          title: "Habilidad eliminada",
          description: "La habilidad ha sido eliminada correctamente y se refleja en el portafolio.",
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
      setCurrentOtherSkill("")
    }
  }

  // Modificar la función renderDevIcon para manejar específicamente el caso de Next.js
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-8">
      {/* Add Devicon script */}
      <Script src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Habilidades</h2>
        <Button onClick={handleCreateSkill} className="bg-blue-700 hover:bg-blue-800">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Habilidad
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-black/40 border border-blue-700/20 mb-6">
          <TabsTrigger
            value="frontend"
            className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500"
          >
            <Code className="mr-2 h-4 w-4" />
            Frontend
          </TabsTrigger>
          <TabsTrigger value="backend" className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500">
            <Server className="mr-2 h-4 w-4" />
            Backend
          </TabsTrigger>
          <TabsTrigger
            value="database"
            className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500"
          >
            <Database className="mr-2 h-4 w-4" />
            Bases de Datos
          </TabsTrigger>
          <TabsTrigger value="devops" className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500">
            <Braces className="mr-2 h-4 w-4" />
            DevOps
          </TabsTrigger>
        </TabsList>

        {Object.keys(skills).map((category) => (
          <TabsContent key={category} value={category} className="mt-0">
            <Card className="bg-black/40 border-blue-700/20">
              <CardHeader>
                <CardTitle>
                  Habilidades de{" "}
                  {category === "frontend"
                    ? "Frontend"
                    : category === "backend"
                      ? "Backend"
                      : category === "database"
                        ? "Bases de Datos"
                        : "DevOps"}
                </CardTitle>
                <CardDescription>
                  Gestiona las habilidades de{" "}
                  {category === "frontend"
                    ? "Frontend"
                    : category === "backend"
                      ? "Backend"
                      : category === "database"
                        ? "Bases de Datos"
                        : "DevOps"}{" "}
                  que se mostrarán en tu portafolio.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SkillsTable
                  skills={skills[category as keyof typeof skills]}
                  onEdit={handleEditSkill}
                  onDelete={handleDeleteConfirm}
                  renderDevIcon={renderDevIcon}
                />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

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
              skills={otherSkills}
              onEdit={handleEditOtherSkill}
              onDelete={handleDeleteOtherSkillConfirm}
            />
          </CardContent>
        </Card>
      </div>

      {/* Formulario de habilidad */}
      <SkillForm
        isOpen={isSkillFormOpen}
        onClose={() => setIsSkillFormOpen(false)}
        onSave={handleSaveSkill}
        currentSkill={currentSkill}
        category={activeTab}
      />

      {/* Diálogo para crear/editar habilidad adicional */}
      <Dialog open={isOtherSkillDialogOpen} onOpenChange={setIsOtherSkillDialogOpen}>
        <DialogContent className="bg-black/90 border-blue-700/30">
          <DialogHeader>
            <DialogTitle>{currentOtherSkill ? "Editar Habilidad Adicional" : "Nueva Habilidad Adicional"}</DialogTitle>
            <DialogDescription>
              {currentOtherSkill
                ? "Modifica el nombre de la habilidad adicional."
                : "Añade una nueva habilidad adicional a tu portafolio."}
            </DialogDescription>
          </DialogHeader>

          <form action={handleSaveOtherSkill} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="skillName">Nombre de la Habilidad</Label>
              <Input
                id="skillName"
                name="skillName"
                defaultValue={currentOtherSkill}
                placeholder="Nombre de la habilidad"
                className="bg-black/40 border-blue-700/20"
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOtherSkillDialogOpen(false)}
                className="border-blue-700/50 text-blue-500 hover:bg-blue-700/10"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-700 hover:bg-blue-800">
                Guardar Habilidad
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para eliminar habilidad */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-black/90 border-red-700/30">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar la habilidad "{currentSkill?.name}"? Esta acción no se puede
              deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-blue-700/50 text-blue-500 hover:bg-blue-700/10"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSkill}
              className="bg-red-700 hover:bg-red-800 text-white"
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para eliminar habilidad adicional */}
      <Dialog open={isDeleteOtherSkillDialogOpen} onOpenChange={setIsDeleteOtherSkillDialogOpen}>
        <DialogContent className="bg-black/90 border-red-700/30">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar la habilidad adicional "{currentOtherSkill}"? Esta acción no se puede
              deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOtherSkillDialogOpen(false)}
              className="border-blue-700/50 text-blue-500 hover:bg-blue-700/10"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteOtherSkill}
              className="bg-red-700 hover:bg-red-800 text-white"
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

// Componente de tabla para mostrar habilidades
function SkillsTable({
  skills,
  onEdit,
  onDelete,
  renderDevIcon,
}: {
  skills: Skill[]
  onEdit: (skill: Skill) => void
  onDelete: (skill: Skill) => void
  renderDevIcon: (iconName: string, colored?: boolean) => React.ReactNode
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-blue-700/20 hover:bg-blue-900/10">
            <TableHead className="w-[50px]">Icono</TableHead>
            <TableHead>Habilidad</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skills.length === 0 ? (
            <TableRow className="border-blue-700/20 hover:bg-blue-900/10">
              <TableCell colSpan={3} className="text-center py-8 text-slate-400">
                No hay habilidades disponibles. Haz clic en "Nueva Habilidad" para añadir una.
              </TableCell>
            </TableRow>
          ) : (
            skills.map((skill) => (
              <TableRow key={skill.name} className="border-blue-700/20 hover:bg-blue-900/10">
                <TableCell>
                  <div className="h-10 w-10 flex items-center justify-center bg-black/30 rounded-md p-1">
                    {renderDevIcon(skill.icon, skill.colored !== false)}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{skill.name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(skill)}
                      className="h-8 w-8 text-slate-400 hover:text-blue-500 hover:bg-blue-900/20"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(skill)}
                      className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

// Componente de tabla para mostrar habilidades adicionales
function OtherSkillsTable({
  skills,
  onEdit,
  onDelete,
}: {
  skills: string[]
  onEdit: (skill: string) => void
  onDelete: (skill: string) => void
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-blue-700/20 hover:bg-blue-900/10">
            <TableHead>Habilidad</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skills.length === 0 ? (
            <TableRow className="border-blue-700/20 hover:bg-blue-900/10">
              <TableCell colSpan={2} className="text-center py-8 text-slate-400">
                No hay habilidades adicionales disponibles. Haz clic en "Nueva Habilidad Adicional" para añadir una.
              </TableCell>
            </TableRow>
          ) : (
            skills.map((skill) => (
              <TableRow key={skill} className="border-blue-700/20 hover:bg-blue-900/10">
                <TableCell className="font-medium">{skill}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(skill)}
                      className="h-8 w-8 text-slate-400 hover:text-blue-500 hover:bg-blue-900/20"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(skill)}
                      className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
